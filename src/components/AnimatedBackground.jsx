import React from 'react';
import styles from './AnimatedBackground.module.scss';

const AnimatedBackground = () => {
  return (
    <div className={styles.animatedBackground}>
      {[...Array(50)].map((_, i) => (
        <div key={i} className={styles.drop} style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`
        }} />
      ))}
    </div>
  );
};

export default AnimatedBackground;
