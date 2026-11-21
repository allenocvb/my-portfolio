import test from "node:test";
import assert from "node:assert/strict";
import { handleLeaderboard, memoryStore, upstashStore, validateSubmission } from "./_leaderboard.js";

const id = (n) => `client-${String(n).padStart(12, "0")}`;
const post = (store, body) => handleLeaderboard({ method: "POST", body }, store);

test("players get stable secret numbers and only their best score is kept", async () => {
  const store = memoryStore();
  const first = await post(store, { clientId: id(1), score: 500, duration: 60 });
  assert.equal(first.status, 200);
  assert.deepEqual(first.json.you, { player: 1, best: 500, rank: 1 });

  await post(store, { clientId: id(2), score: 900, duration: 60 });
  store.throttle = async () => true; // skip the per-client rate limit for this test
  await post(store, { clientId: id(1), score: 300, duration: 60 });
  const board = await handleLeaderboard({ method: "GET", query: { client: id(1) } }, store);
  assert.deepEqual(board.json.top, [{ player: 2, score: 900 }, { player: 1, score: 500 }]);
  assert.deepEqual(board.json.you, { player: 1, best: 500, rank: 2 });
});

test("rejects implausible or malformed submissions", async () => {
  assert.ok(validateSubmission({ clientId: "short", score: 10, duration: 5 }));
  assert.ok(validateSubmission({ clientId: id(1), score: 15, duration: 5 }));
  assert.ok(validateSubmission({ clientId: id(1), score: 999990, duration: 5 }));
  assert.ok(validateSubmission({ clientId: id(1), score: "100", duration: 5 }));
  assert.equal(validateSubmission({ clientId: id(1), score: 1230, duration: 90 }), null);
  const store = memoryStore();
  assert.equal((await post(store, { clientId: id(1), score: 999990, duration: 5 })).status, 400);
  assert.equal((await handleLeaderboard({ method: "DELETE" }, store)).status, 405);
});

test("rate limits rapid submissions", async () => {
  const store = memoryStore();
  assert.equal((await post(store, { clientId: id(3), score: 100, duration: 30 })).status, 200);
  assert.equal((await post(store, { clientId: id(3), score: 200, duration: 30 })).status, 429);
});

test("upstash store is disabled without credentials", () => {
  assert.equal(upstashStore({}), null);
  assert.ok(upstashStore({ KV_REST_API_URL: "https://x", KV_REST_API_TOKEN: "t" }));
});
