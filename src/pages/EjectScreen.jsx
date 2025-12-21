import React, { useState, useEffect, useCallback } from "react";
import { PowerGlitch } from "powerglitch";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const EjectScreen = ({ onRewind }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 5, y: 5 });
  const [rotation, setRotation] = useState(0);

  const updatePosition = useCallback(() => {
    setPosition((prev) => {
      let newX = prev.x + velocity.x;
      let newY = prev.y + velocity.y;
      let newVelocityX = velocity.x;
      let newVelocityY = velocity.y;

      if (newX <= 0 || newX >= window.innerWidth - 100) {
        newVelocityX = -newVelocityX;
      }
      if (newY <= 0 || newY >= window.innerHeight - 100) {
        newVelocityY = -newVelocityY;
      }

      setVelocity({ x: newVelocityX, y: newVelocityY });
      setRotation((prev) => (prev + 5) % 360);

      return { x: newX, y: newY };
    });
  }, [velocity]);

  useEffect(() => {
    const intervalId = setInterval(updatePosition, 50);
    return () => clearInterval(intervalId);
  }, [updatePosition]);

  useEffect(() => {
    const glitchEffect = PowerGlitch.glitch("#eject-screen", {
      playMode: "always",
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 2000,
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

    return () => {
      glitchEffect.stopGlitch();
    };
  }, []);

  return (
    <div
      id="eject-screen"
      style={{
        fontFamily: "VCR, monospace",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <AnimatedBackground />
      <img
        src="/assets/spaceinvaders2.gif"
        alt="Space Invader"
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "100px",
          height: "auto",
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.05s linear",
          zIndex: 1,
        }}
      />
      <p
        style={{
          fontSize: "24px",
          textAlign: "center",
          maxWidth: "80%",
          marginBottom: "20px",
          zIndex: 2,
        }}
      >
        "Begin doing what you want to do now. We are not living in eternity. We
        have only this moment, sparkling like a star in our hand—and melting
        like a snowflake." — Someone wise
      </p>
      <button
        onClick={onRewind}
        className="px-5 py-2.5 text-lg cursor-pointer z-10 hover:underline"
      >
        Rewind{" "}
        <span style={{ fontFamily: "inherit", fontVariantEmoji: "text" }}>
          ⏮︎
        </span>
      </button>
    </div>
  );
};

export default EjectScreen;
