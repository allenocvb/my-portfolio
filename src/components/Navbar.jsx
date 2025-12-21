import React from "react";
import styles from "./Navbar.module.scss";
import spaceInvadersGif from "/assets/spaceinvadersgif.gif";
import { Briefcase, FolderKanban, Mail } from "lucide-react";

const Navbar = ({ onEject }) => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Section with id "${sectionId}" not found`);
    }
  };

  return (
    <div className={`${styles["navbar-container"]} ${styles.sticky}`}>
      <div className={styles["left-section"]}>
        <img
          src={spaceInvadersGif}
          alt="Space Invaders"
          className={styles["space-invaders-gif"]}
        />
        <button onClick={onEject} className={styles["eject-button"]}>
          EJECT ⏏
        </button>
      </div>
      <nav className={styles.navbar}>
        <a
          onClick={() => scrollToSection("experience")}
          aria-label="Experience"
        >
          <Briefcase className={styles.navIcon} />
          <span className={styles.navText}>Experience</span>
        </a>
        <a onClick={() => scrollToSection("projects")} aria-label="Projects">
          <FolderKanban className={styles.navIcon} />
          <span className={styles.navText}>Projects</span>
        </a>
        <a onClick={() => scrollToSection("contact")} aria-label="Contact">
          <Mail className={styles.navIcon} />
          <span className={styles.navText}>Contact</span>
        </a>
      </nav>
    </div>
  );
};

export default Navbar;
