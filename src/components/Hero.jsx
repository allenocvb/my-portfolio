import React from 'react';
import Typewriter from './Typewriter';
import styles from './Hero.module.scss';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error(`Section with id "${sectionId}" not found`);
    }
  };

  return (
    <div className={styles.heroContainer}>
      <Typewriter
        className={styles.heroTitle}
        text="Allen Odoom"
        minTypeSpeed={100}
        maxTypeSpeed={150}
        initDelay={700}
      />
      <div className={styles.heroDescription}>
        I am a college student and Software Engineer. I have a passion for learning, building beautiful user experiences, and giving back to communities. 
        Check out my <a onClick={() => scrollToSection('projects')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>side-projects</a> below.
        <p className={styles.heroMessage}>
          <em>
          Can click on project image to see github!
          </em>
        </p>
      </div>
      <p className={styles.heroNote}>
        P.S. Try ejecting the page!
      </p>
    </div>
  );
};

export default Hero;