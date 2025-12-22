import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import styles from "./ExperienceTimeline.module.scss";

const ExperienceTimeline = ({ experiences }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div className={styles.timelineContainer}>
      <VerticalTimeline
        lineColor="#e5e5e5"
        layout="1-column-left"
        animate={!isMobile}
      >
        {experiences.map((exp, index) => (
          <VerticalTimelineElement
            key={index}
            className={styles.timelineElement}
            contentStyle={{
              background: "#dfdfe6", // #dfdfe6 // #f5f5f5
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e5e5e5",
              borderRadius: "25px",
              padding: "1.5rem",
            }}
            contentArrowStyle={{ borderRight: "7px solid #e5e5e5" }}
            iconStyle={{
              background: "#fff",
              boxShadow: "0 0 0 4px #e5e5e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={
              exp.companyLink ? (
                <a
                  href={exp.companyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconLink}
                >
                  <img
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    className={styles.iconImage}
                  />
                </a>
              ) : (
                <img
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  className={styles.iconImage}
                />
              )
            }
          >
            <h3 className={styles.title}>
              {exp.previousTitle ? (
                <>
                  {exp.title}{" "}
                  <span className={styles.strikethroughTitle}>
                    {exp.previousTitle}
                  </span>{" "}
                  @ {exp.company}
                </>
              ) : (
                <>
                  {exp.title} @ {exp.company}
                </>
              )}
            </h3>
            {exp.location && <p className={styles.location}>{exp.location}</p>}
            <p className={styles.description}>{exp.description}</p>
            <p className={styles.timeframe}>
              {exp.previousTimeframe ? (
                <>
                  <span className={styles.strikethrough}>
                    {exp.previousTimeframe}
                  </span>{" "}
                  <span className={styles.returning}>{exp.timeframe}</span>
                </>
              ) : (
                exp.timeframe
              )}
            </p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default ExperienceTimeline;
