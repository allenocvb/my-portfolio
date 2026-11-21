import test from "node:test";
import assert from "node:assert/strict";
import { completeCommand, runCommand } from "./terminalCommands.js";
import aboutMe from "../data/aboutMe.js";
import projects from "../data/projects.js";

test("commands normalize whitespace and case, with console aliases", () => {
  assert.deepEqual(runCommand("  SKILLS  "), runCommand("Allen.skills"));
  assert.deepEqual(runCommand("sudo   hire Allen"), runCommand("contact"));
  for (const statement of aboutMe) {
    assert.equal(runCommand(statement.input).output[0].value, statement.return);
  }
});
test("project output uses real data and safe internal fallback links", () => {
  const result = runCommand("projects");
  assert.equal(result.output.length, projects.length);
  for (const item of result.output) assert.match(item.href, /^(https:\/\/|#projects$)/);
});
test("only explicit commands can change state", () => {
  assert.equal(runCommand("clear").action, "clear");
  assert.equal(runCommand("reset").action, "reset");
  assert.equal(runCommand("theme dark").theme, "dark");
  assert.equal(runCommand("theme light").theme, "light");
  for (const input of ["theme purple", "clear; alert(1)", "<img src=x onerror=alert(1)>", "constructor", "toString", "__proto__"]) {
    assert.equal(runCommand(input).action, undefined);
    assert.equal(runCommand(input).output[0].type, "text");
    assert.match(runCommand(input).output[0].value, /Unknown command/);
  }
  assert.equal(runCommand("   "), null);
});
test("completion supports both command styles", () => {
  assert.deepEqual(completeCommand("resu"), ["resume"]);
  assert.deepEqual(completeCommand("Allen.lang"), ["Allen.languages"]);
  assert.deepEqual(completeCommand(""), []);
  assert.deepEqual(completeCommand("invalid"), []);
});
