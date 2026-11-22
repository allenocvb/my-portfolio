import { PowerGlitch } from "powerglitch";

// The site's signature glitch: the same shake + colour-shifted slices used when the intro
// loads and when the page is ejected.
export const SCREEN_GLITCH = {
  shake: { velocity: 15, amplitudeX: 0.2, amplitudeY: 0.2 },
  slice: { count: 6, velocity: 15, minHeight: 0.02, maxHeight: 0.15, hueRotate: true },
};

// Glitches `element` once for `duration` ms. Returns a function that ends the glitch and
// undoes PowerGlitch's DOM changes: it wraps the element in two divs and leaves hidden copies
// of it behind (duplicate ids, extra work), which would otherwise pile up without a reload.
export function glitchOnce(element, duration) {
  const glitch = PowerGlitch.glitch(element, {
    playMode: "always",
    createContainers: true,
    hideOverflow: false,
    timing: { duration, iterations: 1, easing: "ease-in-out" },
    glitchTimeSpan: { start: 0, end: 1 },
    ...SCREEN_GLITCH,
  });

  return () => {
    glitch.stopGlitch();
    const layers = element.parentElement;
    const container = layers?.parentElement;
    if (element.dataset.glitched && container?.parentNode) {
      container.parentNode.insertBefore(element, container);
      container.remove();
    }
    element.style.gridArea = "";
    delete element.dataset.glitched;
  };
}
