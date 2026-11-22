// The VCR intro screen and its VHS transition into the site.
// Lives outside React (in index.html) so it can cover the page while the site renders underneath.
// showIntro() can be called again later (Rewind) without reloading the page.
import { PowerGlitch } from "powerglitch";

export const INTRO_ENABLED = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const audio = new Audio("/effect.webm");
const intro = document.getElementById("intro");
const listeners = new Set();

/** Runs `callback` the moment someone clicks to begin (before the transition plays). */
export const onIntroStart = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const hideIntro = () => {
  intro.style.display = "none";
  document.body.style.overflow = "auto";
};

let timerInterval;
const startTimer = () => {
  let timer = document.getElementById("timer");
  if (!timer) {
    timer = document.createElement("p");
    timer.id = "timer";
    timer.className = "glitch";
    document.getElementById("marker").appendChild(timer);
  }
  timer.textContent = "0:00:00";
  clearInterval(timerInterval);
  let time = 0;
  timerInterval = setInterval(() => {
    time += 1;
    const hours = Math.floor(time / 3600);
    const minutes = `0${Math.floor((time % 3600) / 60)}`.slice(-2);
    const seconds = `0${Math.floor(time % 60)}`.slice(-2);
    timer.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
};

// VHS static: a tiny canvas filled with random grey pixels each frame, stretched full-screen.
function startStatic(canvas) {
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(canvas.width, canvas.height);
  const data = image.data;
  let raf = 0;
  const draw = () => {
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v + Math.random() * 40; // faint purple-blue tint
      data[i + 3] = Math.random() < 0.55 ? 255 : 0;
    }
    ctx.putImageData(image, 0, 0);
    raf = requestAnimationFrame(draw);
  };
  draw();
  return () => cancelAnimationFrame(raf);
}

const rand = (min, max) => min + Math.random() * (max - min);

// Big, random jolts of the whole picture in different directions, building up.
function shakeScreen(element, duration) {
  const frames = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const power = i === steps ? 0 : 0.35 + (i / steps) * 0.65;
    frames.push({
      transform: `translate(${rand(-70, 70) * power}px, ${rand(-40, 40) * power}px) rotate(${rand(-2.5, 2.5) * power}deg) skewX(${rand(-12, 12) * power}deg) scale(${1 + rand(-0.06, 0.06) * power})`,
      easing: "steps(1, end)",
    });
  }
  return element.animate(frames, { duration, fill: "forwards" });
}

// Rips the VCR picture into horizontal strips that slide off in different directions and
// drop out one by one, so the site (already rendered underneath) shows through the tears.
function tearApart(screen, before, duration) {
  const count = 14;
  const weights = Array.from({ length: count }, () => rand(0.4, 1.4));
  const sum = weights.reduce((a, b) => a + b, 0);
  const strips = [];
  let top = 0;
  weights.forEach((weight, i) => {
    const height = i === count - 1 ? 100 - top : (weight / sum) * 100;
    const strip = document.createElement("div");
    strip.className = "intro-strip";
    strip.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - height)}% 0)`;
    const copy = screen.cloneNode(true);
    copy.removeAttribute("id");
    copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    strip.appendChild(copy);
    // A bright tear line along the top edge of the strip.
    const edge = document.createElement("div");
    edge.className = "intro-tear-edge";
    edge.style.top = `${top}%`;
    strip.appendChild(edge);
    strips.push(strip);
    top += height;
  });
  strips.forEach((strip) => intro.insertBefore(strip, before));
  screen.style.visibility = "hidden";

  strips.forEach((strip) => {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const dropAt = rand(0.45, 0.95);
    const frames = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const hue = Math.random() < 0.35 ? `hue-rotate(${Math.round(rand(0, 360))}deg) saturate(3)` : "";
      frames.push({
        offset: t,
        transform: `translateX(${rand(-6, 6) + direction * t * rand(35, 95)}vw) translateY(${rand(-1, 1) * t}vh) skewX(${rand(-12, 12) * t}deg)`,
        filter: `${hue} brightness(${1 + Math.random() * t})`.trim(),
        opacity: t >= dropAt ? 0 : Math.random() < 0.2 ? 0.4 : 1,
        easing: "steps(1, end)",
      });
    }
    strip.animate(frames, { duration, fill: "forwards" });
  });
}

// The handoff from the VCR screen to the site, mixing both versions:
// the VCR text glitches and the whole screen shakes, VHS static and a tracking band roll in,
// the picture tears into strips, and the site flickers in through the noise until the signal locks.
async function playTransition() {
  const vcr = document.getElementById("vcr");
  // PowerGlitch may have wrapped #vcr in a container; animate whichever box holds it.
  const screen = [...intro.children].find((el) => el.contains(vcr)) || vcr;
  const noise = intro.querySelector(".intro-noise");
  const tracking = intro.querySelector(".intro-tracking");
  const page = document.getElementById("root");
  if (!screen.animate) return;

  const total = 1700;
  const tearAt = 450;
  const stopStatic = startStatic(noise);

  shakeScreen(intro, total * 0.8);
  noise.animate(
    [
      { opacity: 0 },
      { opacity: 0.45, offset: 0.1 },
      { opacity: 0.25, offset: 0.2 },
      { opacity: 0.38, offset: 0.32 },
      { opacity: 0.22, offset: 0.45 },
      { opacity: 0.4, offset: 0.58 },
      { opacity: 0.2, offset: 0.75 },
      { opacity: 0.3, offset: 0.82 },
      { opacity: 0 },
    ],
    { duration: total, fill: "forwards" },
  );
  tracking.animate([{ top: "-30%" }, { top: "110%" }], { duration: 480, iterations: 3, easing: "linear", fill: "forwards" });
  tracking.animate([{ opacity: 1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 1440, fill: "forwards" });

  // The picture jerks around while the text glitches...
  screen.animate(
    [
      { transform: "translate(0, 0)", filter: "none" },
      { transform: "translate(-18px, 0) skewX(-3deg)", filter: "contrast(1.5)", offset: 0.2 },
      { transform: "translate(14px, 3px)", filter: "hue-rotate(80deg) contrast(1.4)", offset: 0.4 },
      { transform: "translate(-8px, -3px) skewX(4deg)", filter: "brightness(1.6)", offset: 0.6 },
      { transform: "translate(20px, 0)", filter: "hue-rotate(-60deg)", offset: 0.8 },
      { transform: "translate(0, 0)", filter: "none" },
    ].map((frame) => ({ ...frame, easing: "steps(1, end)" })),
    { duration: tearAt },
  );
  // ...then tears apart.
  setTimeout(() => tearApart(screen, noise, total - tearAt - 120), tearAt);

  // The site rolls in under the tears, jittering and colour-shifting until the signal locks.
  page.animate(
    [
      { opacity: 0, transform: "translate(0, 0)", filter: "none" },
      { opacity: 0, transform: "translate(0, 0)", filter: "none", offset: 0.26 },
      { opacity: 0.6, transform: "translate(16px, 0) skewX(-2deg)", filter: "hue-rotate(90deg) saturate(2.5) contrast(1.3)", offset: 0.34 },
      { opacity: 0.25, transform: "translate(-14px, -4px)", filter: "brightness(1.8) saturate(0)", offset: 0.42 },
      { opacity: 0.8, transform: "translate(9px, 0) skewX(2deg)", filter: "hue-rotate(-70deg) saturate(2)", offset: 0.52 },
      { opacity: 0.4, transform: "translate(-7px, 3px)", filter: "contrast(1.6) brightness(1.3)", offset: 0.6 },
      { opacity: 0.95, transform: "translate(4px, 0)", filter: "hue-rotate(40deg)", offset: 0.7 },
      { opacity: 0.7, transform: "translate(-3px, 0)", filter: "brightness(1.2)", offset: 0.8 },
      { opacity: 1, transform: "translate(1px, 0)", filter: "none", offset: 0.9 },
      { opacity: 1, transform: "translate(0, 0)", filter: "none" },
    ].map((frame) => ({ ...frame, easing: "steps(1, end)" })),
    { duration: total },
  );

  await new Promise((resolve) => setTimeout(resolve, total));
  stopStatic();
  intro.querySelectorAll(".intro-strip").forEach((strip) => strip.remove());
}

// Puts the intro back to its starting state (after a previous run) and waits for a click.
export function showIntro() {
  intro.getAnimations?.({ subtree: true }).forEach((animation) => animation.cancel());
  document.getElementById("root").getAnimations?.().forEach((animation) => animation.cancel());
  intro.querySelectorAll(".intro-strip").forEach((strip) => strip.remove());
  const vcr = document.getElementById("vcr");
  ([...intro.children].find((el) => el.contains(vcr)) || vcr).style.visibility = "";
  const reminder = document.getElementById("reminder");
  reminder.style.opacity = 0;

  intro.style.display = "";
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
  startTimer();

  const glitch0 = PowerGlitch.glitch(".overlay", { glitchTimeSpan: false });
  const glitch1 = PowerGlitch.glitch(".glitch", {
    timing: { duration: 700, easing: "ease-in-out" },
  });

  let started = false;
  const reminderTimeout = setTimeout(() => {
    if (!started) reminder.style.opacity = 1;
    glitch0.stopGlitch();
  }, 1000);

  const start = async () => {
    if (started) return;
    started = true;
    clearTimeout(reminderTimeout);
    glitch0.stopGlitch();
    document.removeEventListener("click", start);
    document.removeEventListener("keydown", onKey);
    audio.cloneNode(true).play()?.catch(() => {});
    clearInterval(timerInterval);
    glitch1.stopGlitch();
    const glitch2 = PowerGlitch.glitch(".glitch", {
      glitchTimeSpan: false,
      shake: { velocity: 30, amplitudeX: 0.6, amplitudeY: 0.5 },
      slice: { count: 8, velocity: 30, minHeight: 0.05, maxHeight: 0.4, hueRotate: true },
    });

    // Let the site render now, hidden behind the intro, so it's ready when the screen tears open.
    listeners.forEach((callback) => callback());
    try {
      await playTransition();
    } finally {
      glitch2.stopGlitch();
      hideIntro();
    }
  };
  const onKey = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      start();
    }
  };

  // Attach after this click (e.g. the Rewind click) has finished bubbling.
  setTimeout(() => {
    document.addEventListener("click", start);
    document.addEventListener("keydown", onKey);
  }, 0);
}
