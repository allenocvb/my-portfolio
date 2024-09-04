import React from 'react';
import styles from './Wexperience.module.scss';

export default function Wexperience(props) {
  return (
    <div className={styles.experienceCard}>
      <div className={styles.experienceContent}>
        <div className={styles.imageContainer}>
          <img
            src={props.logo}
            alt={`${props.company} logo`}
            className={styles.companyLogo}
          />
        </div>
        <div className={styles.detailsContainer}>
          <h3 className={styles.companyName}>{props.company}</h3>
          <h4 className={styles.jobTitle}>{props.title}</h4>
          <p className={styles.timeframe}>{props.timeframe}</p>
          <p className={styles.description}>{props.description}</p>
        </div>
      </div>
    </div>
  );
}