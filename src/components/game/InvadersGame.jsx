import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Volume2, VolumeX, X } from "lucide-react";
import { createInvaders } from "../../game/invaders";
import { createSfx } from "../../game/sfx";
import { fetchLeaderboard, submitScore } from "../../game/leaderboard";
import styles from "./InvadersGame.module.scss";

const pad = (value) => String(value).padStart(6, "0");
const mediaMatches = (query) => typeof window !== "undefined" && window.matchMedia?.(query).matches;

function Leaderboard({ board, highlight, limit }) {
  if (!board) return <p className={styles.boardNote}>Loading scores…</p>;
  const rows = board.top.slice(0, limit);
  const you = board.you;
  const youListed = you?.player != null && rows.some((row) => row.player === you.player);

  return (
    <div className={styles.board}>
      <p className={styles.boardTitle}>{board.offline ? "Scores on this device" : "Leaderboard"}</p>
      {rows.length === 0 ? (
        <p className={styles.boardNote}>No scores yet. Be the first.</p>
      ) : (
        <ol className={styles.boardList}>
          {rows.map((row, index) => (
            <li key={`${row.player}-${index}`} className={row.player != null && row.player === highlight ? styles.you : undefined}>
              <span className={styles.rank}>{index + 1}</span>
              <span className={styles.name}>{row.player == null ? "this device" : `secret user ${row.player}`}</span>
              <span className={styles.points}>{pad(row.score)}</span>
            </li>
          ))}
          {!youListed && you?.rank && you.best != null && (
            <li className={`${styles.you} ${styles.outside}`}>
              <span className={styles.rank}>{you.rank}</span>
              <span className={styles.name}>secret user {you.player}</span>
              <span className={styles.points}>{pad(you.best)}</span>
            </li>
          )}
        </ol>
      )}
      {board.offline && <p className={styles.boardNote}>Global leaderboard unavailable right now.</p>}
    </div>
  );
}

export default function InvadersGame({ autoStart = false, onExit }) {
  const surfaceRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sfxRef = useRef(null);
  const overAtRef = useRef(0);
  const panelRef = useRef(null);
  const [phase, setPhase] = useState(autoStart ? "playing" : "menu");
  const [board, setBoard] = useState(null);
  const [result, setResult] = useState(null);
  const [muted, setMuted] = useState(false);
  const [isTouch] = useState(() => mediaMatches("(pointer: coarse)"));

  const applyBoard = useCallback((next) => {
    setBoard(next);
    engineRef.current?.setHighScore(next.top[0]?.score ?? next.you?.best ?? 0);
  }, []);

  const start = useCallback(() => {
    engineRef.current?.start();
    setResult(null);
    setPhase("playing");
  }, []);

  const pause = useCallback(() => {
    if (engineRef.current?.mode !== "play") return;
    engineRef.current.pause();
    setPhase("paused");
  }, []);

  const resume = useCallback(() => {
    engineRef.current?.resume();
    setPhase("playing");
  }, []);

  const handleGameOver = useCallback(({ score, wave, duration }) => {
    overAtRef.current = performance.now();
    setResult({ score, wave, saving: true });
    setPhase("over");
    const request = score > 0 ? submitScore(score, duration) : fetchLeaderboard();
    request.then((next) => {
      applyBoard(next);
      setResult((current) => current && { ...current, saving: false });
    });
  }, [applyBoard]);

  // Latest callbacks for the engine, which is created once.
  const callbacks = useRef({});
  callbacks.current = { handleGameOver, pause };

  useEffect(() => {
    const sfx = createSfx();
    sfxRef.current = sfx;
    setMuted(sfx.muted);
    const engine = createInvaders({
      canvas: canvasRef.current,
      surface: surfaceRef.current,
      sfx,
      reducedMotion: mediaMatches("(prefers-reduced-motion: reduce)"),
      controlsHint: mediaMatches("(pointer: coarse)") ? "DRAG TO MOVE · HOLD TO FIRE" : "A/D MOVE · SPACE FIRE · P PAUSE",
      onGameOver: (summary) => callbacks.current.handleGameOver(summary),
      onPauseRequest: () => callbacks.current.pause(),
    });
    engineRef.current = engine;

    const stage = stageRef.current;
    const fit = () => {
      const style = getComputedStyle(stage);
      const width = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      engine.resize(width, height);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    document.fonts?.load("14px VCR").then(() => engine.redraw()).catch(() => {});

    if (autoStart) engine.start();
    fetchLeaderboard().then(applyBoard);

    return () => {
      observer.disconnect();
      engine.destroy();
      sfx.close();
    };
    // autoStart only matters on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyBoard]);

  // Menu keyboard shortcuts: Enter/Space to start, Escape to resume or leave.
  useEffect(() => {
    if (phase === "playing") return undefined;
    const onKeyDown = (event) => {
      if (event.repeat) return;
      const key = event.key;
      if (key === "Escape") {
        event.preventDefault();
        if (phase === "paused") resume();
        else onExit?.();
        return;
      }
      if ((key === "Enter" || key === " ") && !(document.activeElement instanceof HTMLButtonElement)) {
        if (phase === "over" && performance.now() - overAtRef.current < 700) return;
        event.preventDefault();
        if (phase === "paused") resume();
        else start();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, resume, start, onExit]);

  // On game over, focus the panel rather than a button: releasing a held Space key
  // over a focused button would click it and restart instantly.
  useEffect(() => {
    if (phase === "over") panelRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const toggleMute = () => {
    const next = !muted;
    sfxRef.current?.setMuted(next);
    setMuted(next);
  };

  const you = board?.you;
  const newBest = result && !result.saving && you?.best != null && result.score > 0 && result.score >= you.best;

  return (
    <div className={styles.game} ref={surfaceRef} role="application" aria-label="Space Invader game">
      <div className={styles.topBar} data-no-drag>
        {phase === "playing" && (
          <button type="button" onClick={pause} aria-label="Pause"><Pause size={20} /></button>
        )}
        <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button type="button" onClick={onExit} aria-label="Exit game"><X size={22} /></button>
      </div>

      <div className={`${styles.stage} ${isTouch ? styles.touchStage : ""}`} ref={stageRef}>
        <div className={styles.screen}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div className={styles.scanlines} aria-hidden="true" />
        </div>
      </div>

      {isTouch && phase === "playing" && (
        <p className={styles.touchHint} aria-hidden="true">drag anywhere to move · hold to fire</p>
      )}

      {phase !== "playing" && (
        <div className={styles.overlay} data-no-drag>
          <div className={styles.panel} ref={panelRef} tabIndex={-1}>
            {phase === "menu" && (
              <>
                <p className={styles.kicker}>Insert coin</p>
                <h2 className={styles.title}>Space Invader</h2>
                <p className={styles.sub}>This time, you&apos;re the invader.</p>
                <p className={styles.controls}>
                  {isTouch ? "Drag anywhere to move · hold to fire" : "A / D or ← / → to move · Space to fire · P to pause"}
                </p>
                <div className={styles.actions}>
                  <button type="button" className={styles.primary} onClick={start} autoFocus>▶ Start</button>
                </div>
                <Leaderboard board={board} highlight={you?.player} limit={5} />
              </>
            )}

            {phase === "paused" && (
              <>
                <h2 className={styles.title}>Paused</h2>
                <div className={styles.actions}>
                  <button type="button" className={styles.primary} onClick={resume} autoFocus>▶ Resume</button>
                  <button type="button" className={styles.secondary} onClick={onExit}>Exit</button>
                </div>
              </>
            )}

            {phase === "over" && result && (
              <>
                <h2 className={styles.title}>Game Over</h2>
                <p className={styles.finalScore}>{pad(result.score)}</p>
                <p className={styles.sub} aria-live="polite">
                  {result.saving
                    ? "Saving score…"
                    : you?.player != null
                      ? `You're secret user ${you.player}${you.rank ? ` · rank #${you.rank}` : ""}${newBest ? " · new best!" : ""}`
                      : `Wave ${result.wave}`}
                </p>
                <div className={styles.actions}>
                  <button type="button" className={styles.primary} onClick={start}>↻ Play again</button>
                  <button type="button" className={styles.secondary} onClick={onExit}>Exit</button>
                </div>
                <Leaderboard board={board} highlight={you?.player} limit={10} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
