import React, { useEffect, useState } from 'react';
import styles from './EjectScreen.module.scss';

const EjectScreen = ({ onRewind }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 5, y: 5 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const moveGif = () => {
      setPosition({
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100)
      });
    };

    const interval = setInterval(moveGif, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="eject-screen" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'black', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <AnimatedBackground />
      <img 
        src="/src/assets/spaceinvaders2.gif" 
        alt="Space Invader" 
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '100px',
          height: 'auto',
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.05s linear',
          zIndex: 1
        }}
      />
      <p style={{ fontSize: '24px', textAlign: 'center', maxWidth: '80%', marginBottom: '20px', zIndex: 2 }}>
        ""Begin doing what you want to do now. We are not living in eternity. We have only this moment, sparkling like a star in our hand—and melting like a snowflake." — Francis Bacon"
      </p>
      <button 
        onClick={onRewind} 
        className={styles.rewindButton}
      >
        Rewind
      </button>
    </div>
  );
};

export default EjectScreen;
