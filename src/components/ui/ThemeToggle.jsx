import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setTheme(document.documentElement.dataset.theme);
    const systemChange = () => {
      let saved;
      try { saved = localStorage.getItem("portfolio-theme"); } catch { /* Optional persistence. */ }
      if (saved !== "light" && saved !== "dark") {
        document.documentElement.dataset.theme = media.matches ? "dark" : "light";
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    media.addEventListener("change", systemChange);
    return () => { observer.disconnect(); media.removeEventListener("change", systemChange); };
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Works without storage. */ }
  };
  const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
  return (
    <button type="button" className={styles.toggle} onClick={toggle} aria-label={label} title={label}>
      {theme === "dark" ? <Sun size={21} aria-hidden="true" /> : <Moon size={21} aria-hidden="true" />}
    </button>
  );
}
