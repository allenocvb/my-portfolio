import React from "react";
import { FolderOpen, Github, ExternalLink } from "lucide-react";
import styles from "./ProjectsGrid.module.scss";

const ProjectCard = ({ project }) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.cardHeader}>
        <div className={styles.projectIcon}>
          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              className={styles.projectImage}
            />
          ) : (
            <FolderOpen size={35} />
          )}
        </div>
        <div className={styles.links}>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              aria-label="Live Demo"
            >
              <ExternalLink size={22} />
            </a>
          )}
        </div>
      </div>
      <div className={styles.cardTitle}>{project.name}</div>
      <div className={styles.cardDesc}>{project.description}</div>
      <div className={styles.cardTech}>{project.techStack}</div>
    </div>
  );
};

const ProjectsGrid = ({ projects }) => {
  return (
    <div className={styles.projectsContainer}>
      <ul className={styles.projectsGrid}>
        {projects.map((project, index) => (
          <li key={index}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsGrid;
