// src/components/VHSIntro.jsx
import React, { useEffect } from 'react';
import { PowerGlitch } from 'powerglitch';

const VHSIntro = ({ onEnd }) => {
  useEffect(() => {
    const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const audio = new Audio('/effect.webm');

    let timerInterval;
    const createTimer = (timer) => {
      let time = 0;
      timerInterval = setInterval(() => {
        time += 1;
        const hours = Math.floor(time / 3600);
        const minutes = `0${Math.floor((time % 3600) / 60)}`.slice(-2);
        const seconds = `0${Math.floor(time % 60)}`.slice(-2);
        timer.textContent = `${hours}:${minutes}:${seconds}`;
      }, 1000);
    };

    const vcr = document.getElementById('vcr');

    const startIntro = () => {
      const glitch1 = PowerGlitch.glitch('.glitch', {
        timing: {
          duration: 700,
          easing: 'ease-in-out',
        },
      });

      let init = false;
      const start = () => {
        if (init) return;
        audio.cloneNode(true).play();
        init = true;
        glitch1.stopGlitch();
        clearInterval(timerInterval);
        vcr.style.opacity = 0;
        setTimeout(() => {
          document.body.style.overflow = 'auto';
          vcr.style.display = 'none';
          if (onEnd) onEnd(); // Transition to main content
        }, 1000);
      };

      document.addEventListener('click', start);
    };

    if (!REDUCE_MOTION) {
      const timer = document.createElement('p');
      timer.className = 'glitch';
      timer.textContent = '0:00:00';
      document.getElementById('marker').appendChild(timer);
      createTimer(timer);

      const glitch0 = PowerGlitch.glitch('.overlay', {
        glitchTimeSpan: false,
      });

      setTimeout(() => {
        glitch0.stopGlitch();
        startIntro();
      }, 1000);
    } else {
      vcr.style.display = 'none';
    }

    return () => {
      clearInterval(timerInterval);
      document.removeEventListener('click', startIntro);
    };
  }, [onEnd]);

  return null;
};

export default VHSIntro;


