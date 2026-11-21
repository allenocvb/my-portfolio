import { useState, useEffect, useRef } from "react";
import { PowerGlitch } from "powerglitch";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import InvadersGame from "../components/game/InvadersGame";
import { fetchLeaderboard } from "../game/leaderboard";
import styles from "./EjectScreen.module.scss";

const SIZE = 100;
const SPEED = 100; // px per second
const SPIN = 100; // degrees per second

const EjectScreen = ({ onRewind, autoPlay = false }) => {
  const [playing, setPlaying] = useState(autoPlay);
  const [autoStart, setAutoStart] = useState(autoPlay);
  const [hiScore, setHiScore] = useState(null);
  const invaderRef = useRef(null);
  const motion = useRef({ x: 50, y: 50, vx: SPEED, vy: SPEED, rotation: 0 });

  // Bouncing invader: one rAF loop writing a transform, no React re-renders.
  // Paused while the game is open.
  useEffect(() => {
    if (playing) return undefined;
    let raf = 0;
    let last = performance.now();
    const step = (now) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const m = motion.current;
      const maxX = window.innerWidth - SIZE;
      const maxY = window.innerHeight - SIZE;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.x <= 0 || m.x >= maxX) { m.vx = m.x <= 0 ? Math.abs(m.vx) : -Math.abs(m.vx); m.x = Math.max(0, Math.min(maxX, m.x)); }
      if (m.y <= 0 || m.y >= maxY) { m.vy = m.y <= 0 ? Math.abs(m.vy) : -Math.abs(m.vy); m.y = Math.max(0, Math.min(maxY, m.y)); }
      m.rotation = (m.rotation + SPIN * dt) % 360;
      if (invaderRef.current) {
        invaderRef.current.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) rotate(${m.rotation}deg)`;
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

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

  useEffect(() => {
    if (playing) return;
    let active = true;
    fetchLeaderboard().then((board) => {
      if (active) setHiScore(board.top[0]?.score ?? null);
    });
    return () => { active = false; };
  }, [playing]);

  const openGame = () => {
    setAutoStart(false);
    setPlaying(true);
  };

  return (
    // The wrapper keeps React's DOM bookkeeping stable while PowerGlitch wraps #eject-screen.
    <div>
      <div id="eject-screen" className={styles.ejectScreen} aria-hidden={playing || undefined}>
        {!playing && <AnimatedBackground />}
        <img
          ref={invaderRef}
          src="/assets/spaceinvaders2.gif"
          alt=""
          className={styles.invader}
          style={{ transform: "translate3d(50px, 50px, 0)" }}
        />

        <button type="button" className={styles.playButton} onClick={openGame} aria-label="Play Space Invader">
          <span className={styles.playLabel}>PLAY</span>
          <svg className={styles.playIcon} viewBox="0 0 10 12" aria-hidden="true">
            <path d="M0 0 L10 6 L0 12 Z" fill="currentColor" />
          </svg>
          {hiScore != null && hiScore > 0 && (
            <span className={styles.hiScore}>HI {String(hiScore).padStart(6, "0")}</span>
          )}
        </button>

        <p className={styles.quote}>
          &quot;Begin doing what you want to do now. We are not living in eternity. We
          have only this moment, sparkling like a star in our hand—and melting
          like a snowflake.&quot; — Someone wise
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

      {playing && <InvadersGame autoStart={autoStart} onExit={() => setPlaying(false)} />}
    </div>
  );
};

export default EjectScreen;
