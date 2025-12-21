import React, { useState } from "react";
import Typewriter from "./Typewriter";
import FlipImage from "./FlipImage";
import styles from "./Hero.module.scss";

const Hero = () => {
  const [triggerFlip, setTriggerFlip] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Section with id "${sectionId}" not found`);
    }
  };

  const handleTypewriterComplete = () => {
    setTriggerFlip(true);
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.flipImageWrapper}>
        <FlipImage
          front="/assets/FlipedLuffy.jpeg"
          back="/assets/MyPic.JPG"
          alt="avatar"
          triggerFlip={triggerFlip}
        />
      </div>
      <Typewriter
        className={styles.heroTitle}
        text="Allen Odoom"
        minTypeSpeed={100}
        maxTypeSpeed={150}
        initDelay={700}
        onComplete={handleTypewriterComplete}
      />
      <div className={styles.heroDescription}>
        <p>
          Software engineer and soon-to-be Computer Science (B.S) graduate from
          the Pennsylvania State University.
        </p>
        <p>
          Highly interested in large-scale, high-impact products across mobile
          engineering, distributed systems, and artificial intelligence. Check
          out my{" "}
          <a
            onClick={() => scrollToSection("projects")}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            side-projects
          </a>{" "}
          below.
        </p>
      </div>
      <p className={styles.heroNote}>P.S. Try ejecting the page!</p>
    </div>
  );
};

export default Hero;
