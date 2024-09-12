import React from 'react';
import styles from './ProjectCard.module.scss';

export default function ProjectCard(props) {
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectContent}>
        <div className={styles.imageContainer}>
          <img
            src={props.logo}
            alt={`${props.project} logo`}
            className={styles.projectLogo}
          />
        </div>
        <div className={styles.detailsContainer}>
          <h3 className={styles.projectName}>{props.project}</h3>
          <h4 className={styles.sourceTitle}>{props.source}</h4>
          <p className={styles.description}>{props.description}</p>
          <p className={styles.stack}>{props.stack}</p>
        </div>
      </div>
    </div>
  );
}