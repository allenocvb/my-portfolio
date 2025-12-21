import React, { useEffect } from "react";
import { PowerGlitch } from "powerglitch";

const NoSignal = ({ onInsertTape }) => {
  const handleInsertTape = () => {
    onInsertTape();
  };

  useEffect(() => {
    const glitchEffect = PowerGlitch.glitch("body");

    return () => {
      glitchEffect.stopGlitch();
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "VCR, monospace",
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>NO SIGNAL</h1>
      <button
        onClick={handleInsertTape}
        style={{ fontSize: "24px", padding: "10px 20px", cursor: "pointer" }}
      >
        INSERT TAPE
      </button>
    </div>
  );
};

export default NoSignal;
