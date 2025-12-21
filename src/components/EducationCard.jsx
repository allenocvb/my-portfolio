import React from "react";
import styles from "./EducationCard.module.scss";

const EducationCard = ({ logo, school, location, timeframe, degree, link }) => {
  return (
    <div className={styles.educationCard}>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoLink}
        >
          <img src={logo} alt={`${school} logo`} className={styles.logo} />
        </a>
      ) : (
        <img src={logo} alt={`${school} logo`} className={styles.logo} />
      )}
      <div className={styles.details}>
        <h3 className={styles.school}>{school}</h3>
        <div className={styles.meta}>
          <span className={styles.location}>
            <span className={styles.icon}>📍</span> {location}
          </span>
          <span className={styles.timeframe}>
            <span className={styles.icon}>📅</span> {timeframe}
          </span>
        </div>
        <p className={styles.degree}>{degree}</p>
      </div>
    </div>
  );
};

export default EducationCard;
