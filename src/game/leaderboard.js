const CLIENT_KEY = "invaders-client-id";
const LOCAL_KEY = "invaders-local-scores";
const ENDPOINT = "/api/leaderboard";

const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Private mode: scores just won't persist. */ }
  },
};

function randomId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

export function getClientId() {
  let id = storage.get(CLIENT_KEY);
  if (!id || !/^[A-Za-z0-9-]{16,64}$/.test(id)) {
    id = randomId();
    storage.set(CLIENT_KEY, id);
  }
  return id;
}

function localScores() {
  try {
    const scores = JSON.parse(storage.get(LOCAL_KEY) || "[]");
    return Array.isArray(scores) ? scores.filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

function saveLocalScore(score) {
  const scores = [...localScores(), score].sort((a, b) => b - a).slice(0, 10);
  storage.set(LOCAL_KEY, JSON.stringify(scores));
}

// Used when the API is unreachable (offline, or storage not configured yet).
function localBoard() {
  const scores = localScores();
  return {
    offline: true,
    top: scores.map((score) => ({ player: null, score })),
    you: scores.length ? { player: null, best: scores[0], rank: null } : null,
  };
}

async function request(init) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const url = init ? ENDPOINT : `${ENDPOINT}?client=${encodeURIComponent(getClientId())}`;
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) throw new Error(String(response.status));
    const data = await response.json();
    if (!Array.isArray(data.top)) throw new Error("Bad response");
    return { offline: false, ...data };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchLeaderboard() {
  try {
    return await request();
  } catch {
    return localBoard();
  }
}

export async function submitScore(score, duration) {
  saveLocalScore(score);
  try {
    return await request({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: getClientId(), score, duration: Math.max(1, Math.round(duration)) }),
    });
  } catch {
    return localBoard();
  }
}
