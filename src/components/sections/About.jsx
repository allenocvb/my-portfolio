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

  useEffect(() => {
    if (!announcement) return;
    const transcript = historyRef.current;
    if (transcript) transcript.scrollTop = transcript.lastElementChild?.offsetTop || 0;
    // Keep the prompt available if the first response pushes it below the viewport.
    const prompt = promptRef.current;
    if (prompt && (prompt.getBoundingClientRect().bottom > window.innerHeight || prompt.getBoundingClientRect().top < 80)) {
      prompt.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [entries, announcement]);

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

  return (
    <section className={styles.aboutContainer} aria-label="About Allen — interactive terminal">
      <div className={styles.terminal}>
        <div className={styles.terminalHeader} aria-hidden="true">
          <div className={`${styles.headerButton} ${styles.red}`} />
          <div className={`${styles.headerButton} ${styles.yellow}`} />
          <div className={`${styles.headerButton} ${styles.green}`} />
        </div>
        <div className={styles.terminalWindow}>
          {showIntro && statements.map((statement) => (
            <div className={styles.statement} key={statement.input}>
              <div className={styles.inputStatement}>{statement.input}</div>
              <div className={styles.returnStatement} dangerouslySetInnerHTML={{ __html: statement.return }} />
            </div>
          ))}
          {entries.length > 0 && (
            <div className={styles.history} ref={historyRef} tabIndex={0} role="region" aria-label="Command output">
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
              <input id="terminal-command" value={value} onChange={(event) => { setValue(event.target.value); setHistoryIndex(null); setSuggestions(""); }} onKeyDown={onKeyDown}
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
