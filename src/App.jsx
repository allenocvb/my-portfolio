import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { PowerGlitch } from "powerglitch";
import Home from "./pages/Home";
import BlogIndex from "./pages/blog/index";
import BlogPost from "./pages/blog/BlogPost";
import EjectScreen from "./pages/EjectScreen";
import NoSignal from "./pages/NoSignal";

const audio = new Audio("/effect.webm");

const glitchBody = () => PowerGlitch.glitch("body", {
  playMode: "always",
  createContainers: true,
  hideOverflow: false,
  timing: {
    duration: 1000,
    iterations: 1,
    easing: "ease-in-out",
  },
  glitchTimeSpan: {
    start: 0,
    end: 1,
  },
  shake: {
    velocity: 15,
    amplitudeX: 0.2,
    amplitudeY: 0.2,
  },
  slice: {
    count: 6,
    velocity: 15,
    minHeight: 0.02,
    maxHeight: 0.15,
    hueRotate: true,
  },
});

const App = () => {
  const [isEjected, setIsEjected] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // The navbar passes a click event; the terminal's `play` command passes { play: true }.
  const handleEject = (options) => {
    setAutoPlay(options?.play === true);
    audio.cloneNode(true).play();
    const glitch = glitchBody();

    setTimeout(() => {
      glitch.stopGlitch();
      setIsEjected(true);
    }, 1000);
  };

  // Stay on the current screen (glitching) until the reload back to the VCR intro,
  // so the home page never flashes in between.
  const handleRewind = () => {
    audio.cloneNode(true).play();
    glitchBody();
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  if (isEjected) {
    return <EjectScreen onRewind={handleRewind} autoPlay={autoPlay} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home onEject={handleEject} />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="*" element={<NoSignal onInsertTape={handleRewind} />} />
    </Routes>
  );
};

export default App;
