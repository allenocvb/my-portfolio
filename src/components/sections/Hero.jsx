import React, { useState } from "react";
import Typewriter from "../ui/Typewriter";
import FlipImage from "../ui/FlipImage";
import styles from "./Hero.module.scss";

const Hero = () => {
  const [triggerFlip, setTriggerFlip] = useState(false);
  // Coming in through the VCR intro, wait for the transition to settle before typing.
  const [typingDelay] = useState(() =>
    document.getElementById("intro")?.style.display !== "none" ? 1200 : 700,
  );

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
          front="/assets/tosen1.jpeg"
          back="/assets/MyPic.JPG"
          alt="avatar"
          triggerFlip={triggerFlip}
        />
      </div>
      <Typewriter
        className={styles.heroTitle}
        text="Allen Odoom"
        delay={typingDelay}
        onComplete={handleTypewriterComplete}
      />
      <div className={styles.heroDescription}>
        <p>
          Software Engineer and B.S. in Computer Science graduate from The
          Pennsylvania State University.
        </p>
        <p>
          Highly interested in large-scale, high-impact products across mobile
          engineering, distributed systems, and applied artificial intelligence.
          Check out my{" "}
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
