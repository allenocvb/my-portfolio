import React from 'react';
import Typewriter from './Typewriter';
import styles from './Hero.module.scss';

let Scrollchor;
try {
  Scrollchor = require('react-scrollchor').default;
} catch (error) {
  console.warn('Scrollchor could not be loaded. Using a regular anchor tag instead.');
  Scrollchor = ({ to, children }) => <a href={to}>{children}</a>;
}

const Hero = () => (
  <div className={styles.heroContainer}>
    <Typewriter
      className={styles.heroTitle}
      text="Allen Odoom"
      minTypeSpeed={100}
      maxTypeSpeed={150}
      initDelay={700}
    />
    <div className={styles.heroDescription}>
      I am a College student and Software Engineer. I have a passion for learning, building beautiful user experiences, and giving back to communities.

      Check out my <Scrollchor to="#projects">side-projects</Scrollchor> below.
    </div>
    {/* Add the new italic text here */}
    <p className={styles.heroNote}>
      P.S. Try ejecting the page!
    </p>
  </div>
);

export default Hero;