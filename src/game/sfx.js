// Tiny synthesized sound effects: no audio files to download.
const MUTE_KEY = "invaders-muted";

export function createSfx() {
  let context = null;
  let noise = null;
  let muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch { /* default to sound on */ }

  const ensure = () => {
    if (muted) return null;
    if (!context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
      noise = context.createBuffer(1, context.sampleRate * 0.4, context.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (context.state === "suspended") context.resume();
    return context;
  };

  const tone = (from, to, duration, volume = 0.04, type = "square") => {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  };

  const burst = (duration, volume, frequency) => {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;
    const source = c.createBufferSource();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    source.buffer = noise;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(frequency, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    source.connect(filter).connect(gain).connect(c.destination);
    source.start(t);
    source.stop(t + duration);
  };

  return {
    unlock: ensure,
    get muted() { return muted; },
    setMuted(value) {
      muted = value;
      try { localStorage.setItem(MUTE_KEY, value ? "1" : "0"); } catch { /* not persisted */ }
      if (muted && context?.state === "running") context.suspend();
      if (!muted) ensure();
    },
    shoot: () => tone(880, 220, 0.09, 0.025),
    hit: () => burst(0.18, 0.12, 2400),
    ufo: () => tone(300, 900, 0.25, 0.03, "triangle"),
    bonus: () => { tone(660, 1320, 0.12, 0.04); setTimeout(() => tone(990, 1980, 0.14, 0.04), 90); },
    hurt: () => { burst(0.5, 0.2, 1200); tone(220, 40, 0.5, 0.05, "sawtooth"); },
    wave: () => { tone(440, 880, 0.12, 0.035); setTimeout(() => tone(660, 1320, 0.16, 0.035), 120); },
    over: () => tone(330, 55, 0.9, 0.05, "triangle"),
    close() { context?.close(); context = null; },
  };
}
