import { useEffect, useRef, useState } from "react";
import { completeCommand, runCommand } from "../../utils/terminalCommands";
import { setThemePreference } from "../../utils/theme";
import styles from "./About.module.scss";

function Output({ output }) {
  return output.map((item, index) => {
    if (item.type === "help") return (
      <dl className={styles.commandList} key={index}>
        {item.commands.map(([name, description]) => (
          <div key={name}><dt>{name}</dt><dd>{description}</dd></div>
        ))}
      </dl>
    );
    if (item.type === "statement") return (
      <div key={index} className={styles.outputItem}>
        <div className={styles.outputLabel}>{item.label}</div>
        {/* HTML comes exclusively from the site's authored aboutMe data. */}
        <div dangerouslySetInnerHTML={{ __html: item.value }} />
      </div>
    );
    if (item.type === "link") return (
      <div key={index} className={styles.outputItem}>
        <a href={item.href} {...(item.href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{item.label}</a>
        <div>{item.detail}</div>
      </div>
    );
    return <p key={index} className={styles.outputItem}>{item.value}</p>;
  });
}

export default function About({ statements, onPlay }) {
  const [showIntro, setShowIntro] = useState(true);
  const [entries, setEntries] = useState([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [draft, setDraft] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const promptRef = useRef(null);
  const historyRef = useRef(null);
  const windowRef = useRef(null);
  const inputRef = useRef(null);
  // open | expanded | closing | closed
  const [windowState, setWindowState] = useState("open");
  const expanded = windowState === "expanded";

  // The terminal is a fixed-size window that scrolls inside. After a command, show the prompt
  // if the new output fits on screen with it, otherwise jump to the start of the output.
  useEffect(() => {
    if (!announcement) return;
    const win = windowRef.current;
    const prompt = promptRef.current;
    if (!win || !prompt) return;
    const entry = historyRef.current?.lastElementChild;
    if (!entry) {
      win.scrollTo({ top: 0 });
      return;
    }
    const winTop = win.getBoundingClientRect().top - win.scrollTop;
    const entryTop = entry.getBoundingClientRect().top - winTop;
    const promptBottom = prompt.getBoundingClientRect().bottom - winTop;
    const fits = promptBottom - entryTop <= win.clientHeight - 24;
    win.scrollTo({ top: Math.max(0, fits ? promptBottom - win.clientHeight + 24 : entryTop - 16), behavior: "smooth" });
  }, [entries, announcement]);

  // Expanded: lock page scroll, Esc to exit, keep typing.
  useEffect(() => {
    if (!expanded) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (event) => { if (event.key === "Escape") setWindowState("open"); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const closeTerminal = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setWindowState(reduce ? "closed" : "closing");
    if (!reduce) setTimeout(() => setWindowState("closed"), 200);
  };

  // Reopening starts a fresh session, like relaunching a terminal.
  const reopenTerminal = () => {
    setEntries([]);
    setShowIntro(true);
    setValue("");
    setSuggestions("");
    setAnnouncement("");
    setWindowState("open");
  };

  // Clicking empty space in the terminal puts the cursor in the prompt, like a real terminal.
  const focusPrompt = (event) => {
    if (event.target.closest("a, button, input, dl") || window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  const submit = (command) => {
    const trimmed = command.trim();
    const result = runCommand(trimmed);
    if (!result) return;
    setHistory((previous) => [...previous, trimmed].slice(-100));
    setHistoryIndex(null);
    setDraft("");
    setValue("");
    setSuggestions("");
    if (result.action === "clear" || result.action === "reset") {
      setEntries([]);
      setShowIntro(result.action === "reset");
      setAnnouncement(result.action === "reset" ? "Original introduction restored." : "Terminal cleared. Type help for commands.");
    } else {
      if (result.action === "theme") setThemePreference(result.theme);
      if (result.action === "play") onPlay?.();
      setEntries((previous) => [...previous, { input: trimmed, output: result.output }].slice(-50));
      setAnnouncement(`Finished ${trimmed}. Output is above the command input.`);
    }
  };

  const onKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Tab" && !event.shiftKey) {
      const matches = completeCommand(value);
      if (matches.length === 1 && matches[0] !== value) {
        event.preventDefault();
        setValue(matches[0]);
        setSuggestions("");
      } else if (matches.length > 1) {
        // Let Tab leave the input normally, so keyboard users are never trapped.
        setSuggestions(`Suggestions: ${matches.join(", ")}`);
      }
    }
    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && history.length) {
      event.preventDefault();
      setSuggestions("");
      if (event.key === "ArrowUp") {
        if (historyIndex === null) setDraft(value);
        const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(next);
        setValue(history[next]);
      } else if (historyIndex !== null) {
        const next = historyIndex + 1;
        setHistoryIndex(next < history.length ? next : null);
        setValue(next < history.length ? history[next] : draft);
      }
    }
  };

  if (windowState === "closed") {
    return (
      <section className={styles.aboutContainer} aria-label="About Allen — interactive terminal">
        <button type="button" className={styles.reopen} onClick={reopenTerminal}>
          <span className={styles.reopenDots} aria-hidden="true">
            <span className={styles.red} /><span className={styles.yellow} /><span className={styles.green} />
          </span>
          <span>terminal closed — click to reopen</span>
        </button>
      </section>
    );
  }

  return (
    <section className={styles.aboutContainer} aria-label="About Allen — interactive terminal">
      {expanded && <div className={styles.backdrop} onClick={() => setWindowState("open")} aria-hidden="true" />}
      <div
        className={`${styles.terminal} ${expanded ? styles.expanded : ""} ${windowState === "closing" ? styles.closing : ""}`}
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded || undefined}
        aria-label={expanded ? "Terminal" : undefined}
      >
        <div className={styles.terminalHeader}>
          <button type="button" className={`${styles.headerButton} ${styles.red}`} onClick={closeTerminal} aria-label="Close terminal" title="Close">
            <svg className={styles.glyph} viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" /></svg>
          </button>
          <div className={`${styles.headerButton} ${styles.yellow}`} aria-hidden="true">
            <svg className={styles.glyph} viewBox="0 0 10 10"><path d="M2 5h6" /></svg>
          </div>
          <button
            type="button"
            className={`${styles.headerButton} ${styles.green}`}
            onClick={() => setWindowState(expanded ? "open" : "expanded")}
            aria-label={expanded ? "Exit full screen" : "Expand terminal"}
            title={expanded ? "Exit full screen" : "Expand"}
          >
            <svg className={`${styles.glyph} ${styles.glyphFill}`} viewBox="0 0 10 10" aria-hidden="true">
              {expanded
                ? <path d="M4.6 4.6H1.6L4.6 1.6z M5.4 5.4h3l-3 3z" />
                : <path d="M2 2h4L2 6z M8 8H4L8 4z" />}
            </svg>
          </button>
        </div>
        <div className={styles.terminalWindow} ref={windowRef} onClick={focusPrompt}>
          {showIntro && statements.map((statement) => (
            <div className={styles.statement} key={statement.input}>
              <div className={styles.inputStatement}>{statement.input}</div>
              <div className={styles.returnStatement} dangerouslySetInnerHTML={{ __html: statement.return }} />
            </div>
          ))}
          {entries.length > 0 && (
            <div className={styles.history} ref={historyRef} role="log" aria-label="Command output">
              {entries.map((entry, index) => (
                <div className={styles.historyEntry} key={index}>
                  <div className={styles.inputStatement}>{entry.input}</div>
                  <div className={styles.returnStatement}><Output output={entry.output} /></div>
                </div>
              ))}
            </div>
          )}
          <form ref={promptRef} className={styles.promptArea} onSubmit={(event) => { event.preventDefault(); submit(value); }}>
            <p className={styles.hint} id="terminal-hint">Type <button type="button" onClick={() => submit("help")}>help</button> to explore.</p>
            <div className={styles.promptRow}>
              <label htmlFor="terminal-command" className={styles.promptSymbol}><span className="sr-only">Terminal command</span><span aria-hidden="true">&gt;</span></label>
              <input id="terminal-command" ref={inputRef} value={value} onChange={(event) => { setValue(event.target.value); setHistoryIndex(null); setSuggestions(""); }} onKeyDown={onKeyDown}
                aria-describedby="terminal-hint" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="send" maxLength={200} />
              <button className={styles.runButton} type="submit" disabled={!value.trim()}>Run</button>
            </div>
            <div className={styles.shortcuts} aria-label="Suggested commands">
              {["projects", "resume"].map((command) => <button type="button" key={command} onClick={() => submit(command)}>{command}</button>)}
            </div>
            {suggestions && <p className={styles.hint} role="status">{suggestions}</p>}
            <p className="sr-only" role="status">{announcement}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
