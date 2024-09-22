import React from 'react';
import styles from './ProjectCard.module.scss';

export default function ProjectCard(props) {
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectContent}>
        <div className={styles.imageContainer}>
          <a href={props.githubLink} target="_blank" rel="noopener noreferrer">
            <img
              src={props.logo}
              alt={`${props.project} logo`}
              className={styles.projectLogo}
            />
          </a>
        </div>
        <div className={styles.detailsContainer}>
          <h3 className={styles.projectName}>
            <a
              href={props.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              {props.project}
            </a>
          </h3>
          <h4 className={styles.sourceTitle}>{props.source}</h4>
          {/* Conditionally render the availability line */}
          {props.availability && (
            <p className={styles.availability}>{props.availability}</p>
          )}
          <p className={styles.description}>{props.description}</p>
          <p className={styles.stack}>{props.stack}</p>
        </div>
      </div>
    </div>
  );
}