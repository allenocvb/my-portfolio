// Shared leaderboard logic. Files starting with "_" are not deployed as their own
// Vercel functions; api/leaderboard.js (production) and vite.config.js (local dev)
// both call handleLeaderboard with a different store.

export const TOP_LIMIT = 10;
const MAX_SCORE = 1_000_000;
const MAX_POINTS_PER_SECOND = 300;
const CLIENT_ID = /^[A-Za-z0-9-]{16,64}$/;
const KEYS = {
  counter: "invaders:next-player",
  players: "invaders:players",
  scores: "invaders:scores",
  throttle: (clientId) => `invaders:throttle:${clientId}`,
};

const validClientId = (value) => typeof value === "string" && CLIENT_ID.test(value);

export function validateSubmission(body) {
  if (!body || typeof body !== "object") return "Invalid body.";
  const { clientId, score, duration } = body;
  if (!validClientId(clientId)) return "Invalid client.";
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE || score % 10 !== 0) return "Invalid score.";
  if (typeof duration !== "number" || !Number.isFinite(duration) || duration < 1 || duration > 6 * 3600) return "Invalid duration.";
  if (score > duration * MAX_POINTS_PER_SECOND + 300) return "Invalid score.";
  return null;
}

async function snapshot(store, clientId) {
  const top = await store.top(TOP_LIMIT);
  const you = validClientId(clientId) ? await store.lookup(clientId) : null;
  return { top, you };
}

export async function handleLeaderboard({ method, query = {}, body }, store) {
  if (method === "GET") return { status: 200, json: await snapshot(store, query.client) };
  if (method !== "POST") return { status: 405, json: { error: "Method not allowed." } };

  const error = validateSubmission(body);
  if (error) return { status: 400, json: { error } };
  if (!(await store.throttle(body.clientId))) return { status: 429, json: { error: "Slow down." } };

  const player = await store.playerFor(body.clientId);
  await store.submit(player, body.score);
  return { status: 200, json: await snapshot(store, body.clientId) };
}

const toEntries = (flat) => {
  const entries = [];
  for (let i = 0; i < flat.length; i += 2) entries.push({ player: Number(flat[i]), score: Number(flat[i + 1]) });
  return entries;
};

// Upstash Redis over its REST API (what Vercel's Redis/KV marketplace integration provides).
export function upstashStore(env = process.env) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const pipeline = async (...commands) => {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
    });
    if (!response.ok) throw new Error(`Redis error ${response.status}`);
    const results = await response.json();
    return results.map(({ result, error }) => {
      if (error) throw new Error(error);
      return result;
    });
  };

  return {
    async top(limit) {
      const [flat] = await pipeline(["ZRANGE", KEYS.scores, 0, limit - 1, "REV", "WITHSCORES"]);
      return toEntries(flat || []);
    },
    async lookup(clientId) {
      const [player] = await pipeline(["HGET", KEYS.players, clientId]);
      if (player == null) return null;
      const [best, rank] = await pipeline(
        ["ZSCORE", KEYS.scores, player],
        ["ZREVRANK", KEYS.scores, player],
      );
      return { player: Number(player), best: best == null ? null : Number(best), rank: rank == null ? null : rank + 1 };
    },
    async playerFor(clientId) {
      const [existing] = await pipeline(["HGET", KEYS.players, clientId]);
      if (existing != null) return Number(existing);
      const [next] = await pipeline(["INCR", KEYS.counter]);
      const [, player] = await pipeline(
        ["HSETNX", KEYS.players, clientId, next],
        ["HGET", KEYS.players, clientId],
      );
      return Number(player);
    },
    async submit(player, score) {
      await pipeline(["ZADD", KEYS.scores, "GT", score, player]);
    },
    async throttle(clientId) {
      const [ok] = await pipeline(["SET", KEYS.throttle(clientId), 1, "NX", "EX", 3]);
      return ok === "OK";
    },
  };
}

// In-memory store for `npm run dev`; resets whenever the dev server restarts.
export function memoryStore() {
  let next = 0;
  const players = new Map();
  const scores = new Map();
  const throttled = new Map();
  const ranked = () => [...scores].sort((a, b) => b[1] - a[1] || b[0] - a[0]);

  return {
    async top(limit) {
      return ranked().slice(0, limit).map(([player, score]) => ({ player, score }));
    },
    async lookup(clientId) {
      const player = players.get(clientId);
      if (player == null) return null;
      const index = ranked().findIndex(([id]) => id === player);
      return { player, best: scores.get(player) ?? null, rank: index < 0 ? null : index + 1 };
    },
    async playerFor(clientId) {
      if (!players.has(clientId)) players.set(clientId, ++next);
      return players.get(clientId);
    },
    async submit(player, score) {
      if (!scores.has(player) || score > scores.get(player)) scores.set(player, score);
    },
    async throttle(clientId, now = Date.now()) {
      if ((throttled.get(clientId) || 0) > now) return false;
      throttled.set(clientId, now + 1000);
      return true;
    },
  };
}
