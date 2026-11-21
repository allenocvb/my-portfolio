import aboutMe from "../data/aboutMe.js";
import projects from "../data/projects.js";
import experiences from "../data/experiences.js";

const help = [
  ["skills", "Languages, frameworks, and tools"],
  ["projects", "Explore my projects"],
  ["experience", "My career so far"],
  ["resume", "Get my résumé"],
  ["contact", "Get in touch"],
  ["hobbies", "Life outside of code"],
  ["play", "Play Space Invaders"],
  ["theme light / theme dark", "Change the site's appearance"],
  ["clear", "Clear the terminal"],
  ["reset", "Restore the original introduction"],
];

const aliases = {
  "allen.skills": "skills",
  "allen.projects": "projects",
  "allen.experience": "experience",
  "sudo hire allen": "allen.contactinfo",
  contact: "allen.contactinfo",
  resume: "allen.resume",
  hobbies: "allen.hobbies",
};

export const commandNames = [
  "help",
  ...help.map(([name]) => name).filter((name) => !name.includes(" / ")),
  "theme light", "theme dark",
  ...aboutMe.map(({ input }) => input),
  "Allen.skills", "Allen.projects", "Allen.experience",
];

const text = (value) => ({ type: "text", value });
const statementOutput = ({ input, return: value }) => ({ type: "statement", label: input, value });

// Only this allowlist is executable. User input is never evaluated or rendered as HTML.
export function runCommand(input) {
  let command = input.trim().replace(/\s+/g, " ").toLowerCase();
  if (!command) return null;
  command = Object.hasOwn(aliases, command) ? aliases[command] : command;
  if (command === "clear" || command === "reset") return { action: command, output: [] };
  if (command === "help") return { output: [
    { type: "help", commands: help },
    text("Tab completes a command; ↑ / ↓ recall history."),
  ] };
  if (command === "play") return { action: "play", output: [text("Inserting tape…")] };
  if (command === "skills") return { output: aboutMe
    .filter(({ input }) => ["Allen.languages", "Allen.frameworks_libraries", "Allen.technologies"].includes(input))
    .map(statementOutput) };
  if (command === "projects") return { output: projects.map((project) => ({
    type: "link", label: project.name, href: project.liveLink || project.githubLink || "#projects",
    detail: project.techStack,
  })) };
  if (command === "experience") return { output: experiences.map((experience) => text(
    `${experience.title} @ ${experience.company}\n${experience.previousTimeframe ? `${experience.previousTimeframe} · ` : ""}${experience.timeframe}`,
  )) };
  if (command === "theme light" || command === "theme dark") {
    const theme = command.split(" ")[1];
    return { action: "theme", theme, output: [text(`Switched to ${theme} mode.`)] };
  }
  const statement = aboutMe.find(({ input }) => input.toLowerCase() === command);
  if (statement) return { output: [statementOutput(statement)] };
  return { output: [text("Unknown command. Type help to see what you can try.")] };
}

export function completeCommand(input) {
  const prefix = input.trim().toLowerCase();
  if (!prefix) return [];
  return commandNames.filter((name) => name.toLowerCase().startsWith(prefix));
}
