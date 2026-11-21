import { handleLeaderboard, upstashStore } from "./_leaderboard.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const store = upstashStore();
  if (!store) return res.status(503).json({ error: "Leaderboard storage is not configured." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "null") : req.body;
    const { status, json } = await handleLeaderboard({ method: req.method, query: req.query, body }, store);
    return res.status(status).json(json);
  } catch (error) {
    console.error("leaderboard", error);
    return res.status(500).json({ error: "Leaderboard unavailable." });
  }
}
