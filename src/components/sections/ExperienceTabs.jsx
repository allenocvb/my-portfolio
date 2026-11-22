import { useEffect, useId, useRef, useState } from "react";
import styles from "./ExperienceTabs.module.scss";

export default function ExperienceTabs({ experiences }) {
  const [active, setActive] = useState(0);
  const [horizontal, setHorizontal] = useState(() => window.matchMedia("(max-width: 600px)").matches);
  const tabs = useRef([]);
  const id = useId();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 600px)");
    const update = () => setHorizontal(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const select = (index) => {
    setActive(index);
    tabs.current[index]?.focus();
    // Scroll the tab strip itself; don't move the page when switching jobs.
    const tab = tabs.current[index];
    if (horizontal && tab) {
      const list = tab.parentElement;
      if (tab.offsetLeft < list.scrollLeft) list.scrollLeft = tab.offsetLeft;
      else if (tab.offsetLeft + tab.offsetWidth > list.scrollLeft + list.clientWidth) {
        list.scrollLeft = tab.offsetLeft + tab.offsetWidth - list.clientWidth;
      }
    }
  };

  const onKeyDown = (event, index) => {
    const previous = horizontal ? "ArrowLeft" : "ArrowUp";
    const next = horizontal ? "ArrowRight" : "ArrowDown";
    let target;
    if (event.key === previous) target = (index - 1 + experiences.length) % experiences.length;
    if (event.key === next) target = (index + 1) % experiences.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = experiences.length - 1;
    if (target !== undefined) { event.preventDefault(); select(target); }
  };

  if (!experiences.length) return null;

  return (
    <div className={styles.experience}>
      <div className={styles.tabs} role="tablist" aria-label="Companies" aria-orientation={horizontal ? "horizontal" : "vertical"}>
        {experiences.map((experience, index) => (
          <button key={experience.company} type="button" role="tab"
            id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active === index}
            tabIndex={active === index ? 0 : -1} ref={(node) => { tabs.current[index] = node; }}
            className={styles.tab} onClick={() => setActive(index)} onKeyDown={(event) => onKeyDown(event, index)}>
            {experience.tabLabel || experience.company}
          </button>
        ))}
      </div>
      <div className={styles.panels}>
        {experiences.map((experience, index) => (
          <div key={experience.company} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`}
            hidden={active !== index} tabIndex={0} className={styles.panel}>
            <h3 className={styles.title}>
              {experience.title} <span className={styles.at}>@</span>{" "}
              {experience.companyLink ? <a href={experience.companyLink} target="_blank" rel="noopener noreferrer">{experience.company}</a> : experience.company}
            </h3>
            <p className={styles.timeframe}>{experience.timeframe}</p>
            {experience.previousTimeframe && <p className={styles.previous}>Previously {experience.previousTitle?.toLowerCase() || "intern"} · {experience.previousTimeframe}</p>}
            {experience.location && <p className={styles.location}>{experience.location}</p>}
            <ul className={styles.highlights}>
              {(experience.highlights || [experience.description]).map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
