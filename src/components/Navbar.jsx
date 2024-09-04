import React from 'react';
import styles from './Navbar.module.scss';
import spaceInvadersGif from '../assets/spaceinvadersgif.gif';

const Navbar = ({ onEject }) => {
  return (
    <div className={styles['navbar-container']}>
      <div className={styles['left-section']}>
        <img
          src={spaceInvadersGif}
          alt="Space Invaders"
          className={styles['space-invaders-gif']}
        />
        <button onClick={onEject} className={styles['eject-button']}>EJECT ⏏</button>
      </div>
      <nav className={styles.navbar}>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  );
};

export default Navbar;


