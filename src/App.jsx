import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { PowerGlitch } from "powerglitch";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import EjectScreen from "./pages/EjectScreen";
import NoSignal from "./pages/NoSignal";

const audio = new Audio("/effect.webm");

const App = () => {
  const [isEjected, setIsEjected] = useState(false);

  const handleEject = () => {
    audio.cloneNode(true).play();
    const glitch = PowerGlitch.glitch("body", {
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

    setTimeout(() => {
      glitch.stopGlitch();
      setIsEjected(true);
    }, 1000);
  };

  const handleRewind = () => {
    setIsEjected(false);
    audio.cloneNode(true).play();
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  if (isEjected) {
    return <EjectScreen onRewind={handleRewind} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home onEject={handleEject} />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="*" element={<NoSignal onInsertTape={handleRewind} />} />
    </Routes>
  );
};

export default App;
