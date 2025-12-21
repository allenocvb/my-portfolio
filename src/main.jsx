// main.jsx - Entry point
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { PowerGlitch } from "powerglitch";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const REDUCE_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const audio = new Audio("/effect.webm");

let timerInterval;
const createTimer = (timer) => {
  let time = 0;
  timerInterval = setInterval(() => {
    time += 1;
    const hours = Math.floor(time / 3600);
    const minutes = `0${Math.floor((time % 3600) / 60)}`.slice(-2);
    const seconds = `0${Math.floor(time % 60)}`.slice(-2);
    timer.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
};

const vcr = document.getElementById("vcr");
const currentPath = window.location.pathname;

if (!REDUCE_MOTION && currentPath === "/") {
  // Only show the intro screen if the path is '/'
  let timer = document.getElementById("timer");
  if (!timer) {
    timer = document.createElement("p");
    timer.id = "timer";
    timer.className = "glitch";
    timer.textContent = "0:00:00";
    document.getElementById("marker").appendChild(timer);
    createTimer(timer);
  }

  const glitch0 = PowerGlitch.glitch(".overlay", {
    glitchTimeSpan: false,
  });
  const glitch1 = PowerGlitch.glitch(".glitch", {
    timing: {
      duration: 700,
      easing: "ease-in-out",
    },
  });

  let init = false;
  setTimeout(() => {
    if (!init) {
      document.getElementById("reminder").style.opacity = 1;
    }
    glitch0.stopGlitch();
  }, 1000);

  document.getElementById("vcr").classList.add("font-mono");

  const start = () => {
    if (init) return;
    audio.cloneNode(true).play();
    init = true;
    glitch1.stopGlitch();
    const glitch2 = PowerGlitch.glitch(".glitch", {
      glitchTimeSpan: false,
    });
    clearInterval(timerInterval);
    vcr.style.opacity = 0;
    setTimeout(() => {
      document.body.style.overflow = "auto";
      glitch2.stopGlitch();
      vcr.style.display = "none";
      root.render(
        <BrowserRouter>
          <Analytics />
          <App />
        </BrowserRouter>,
      );
    }, 1000);
  };

  document.addEventListener("click", start);
} else {
  // Skip the intro screen for any other path
  vcr.style.display = "none";
  root.render(
    <BrowserRouter>
      <Analytics />
      <App />
    </BrowserRouter>,
  );
  document.body.style.overflow = "auto";
}
