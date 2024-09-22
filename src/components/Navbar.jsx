import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.scss';
import spaceInvadersGif from '/assets/spaceinvadersgif.gif';

const Navbar = ({ onEject }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error(`Section with id "${sectionId}" not found`);
    }
  };

  return (
    <div className={`${styles['navbar-container']} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles['left-section']}>
        <img
          src={spaceInvadersGif}
          alt="Space Invaders"
          className={styles['space-invaders-gif']}
        />
        <button onClick={onEject} className={styles['eject-button']}>EJECT ⏏</button>
      </div>
      <nav className={styles.navbar}>
        <a onClick={() => scrollToSection('experience')}>Experience</a>
        <a onClick={() => scrollToSection('projects')}>Projects</a>
        <a onClick={() => scrollToSection('contact')}>Contact</a>
      </nav>
    </div>
  );
};

export default Navbar;


