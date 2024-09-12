import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import aboutMe from './components/aboutMe';
import { PowerGlitch } from 'powerglitch';
import styles from './styles/SectionTitles.module.scss';
import Wexperience from './components/Wexperience';
import ProjectCard from './components/ProjectCard'
import AnimatedBackground from './components/AnimatedBackground';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

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

const EjectScreen = ({ onRewind }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 5, y: 5 });
  const [rotation, setRotation] = useState(0);

  const updatePosition = useCallback(() => {
    setPosition(prev => {
      let newX = prev.x + velocity.x;
      let newY = prev.y + velocity.y;
      let newVelocityX = velocity.x;
      let newVelocityY = velocity.y;

      if (newX <= 0 || newX >= window.innerWidth - 100) {
        newVelocityX = -newVelocityX;
      }
      if (newY <= 0 || newY >= window.innerHeight - 100) {
        newVelocityY = -newVelocityY;
      }

      setVelocity({ x: newVelocityX, y: newVelocityY });
      setRotation(prev => (prev + 5) % 360);

      return { x: newX, y: newY };
    });
  }, [velocity]);

  useEffect(() => {
    const intervalId = setInterval(updatePosition, 50);
    return () => clearInterval(intervalId);
  }, [updatePosition]);

  useEffect(() => {
    const glitchEffect = PowerGlitch.glitch('#eject-screen', {
      playMode: 'always',
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 2000,
        iterations: 1,
        easing: 'ease-in-out',
      },
      glitchTimeSpan: {
        start: 0,
        end: 1,
      },
      shake: {
        velocity: 15,
        amplitudeX: 0.2,
        amplitudeY: 0.2,
      },
      slice: {
        count: 6,
        velocity: 15,
        minHeight: 0.02,
        maxHeight: 0.15,
        hueRotate: true,
      },
    });

    return () => {
      glitchEffect.stopGlitch();
    };
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
      "Begin doing what you want to do now. We are not living in eternity. We have only this moment, sparkling like a star in our hand—and melting like a snowflake." — Francis Bacon
      </p>
      <button onClick={onRewind} style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer', zIndex: 2 }}>Rewind(Click)</button>
    </div>
  );
};

const Content = ({ onEject }) => (
  <div className="content-container">
    <Navbar onEject={onEject} />
    <Hero />
    <About statements={aboutMe} />
    <h2 id="Experience" className={styles.sectionTitle}>
      Experience
    </h2>
    <Wexperience
      title="Software Engineer Intern"
      company="Warner Bros Discovery"
      timeframe="June 2024 - August 2024"
      description="Designed and deployed a shared Redis-based caching solution for Bleacher Report's web application, enhancing server-side rendering performance and cutting storage needs by up to 90%.
      Worked closely with DevOps, engineering teams, and key stakeholders to design and optimize the architecture of the Bleacher Report web application, leveraging technologies like Next.js, Apollo GraphQL, and Docker.
      Contributed to the front-end development of Bleacher Report 2.0, integrating betting features using Next.js, TypeScript, and Storybook, and conducted performance testing with k6 to ensure application reliability."
      logo="/src/assets/wbdlogo.png"
    />
    <Wexperience
      title="Computer Science Instructor"
      company="355Code"
      timeframe="October 2022 - January 2024"
      description="Tutored 20+ students in JavaScript and Python. 
      Demonstrated knowledge in both front-end and back-end technologies to provide comprehensive instruction. 
      Leveraged strong communication and teaching skills to break down complex concepts for diverse learners."
      logo="/src/assets/355CodeLogo.png"
    />
    <Wexperience
      title="Summiteer"
      company="Capital One"
      timeframe="July 2023 - August 2023"
      description="Selected as one of 31 participants to participate in a week-long summit. 
      Attended a week of technical workshops on Web, Full-Stack, and Mobile Development using Git, React, SQL, APIs, AR (Snapchat Lens Studio), Swift, and more.
      Finished 2nd place at the Summit hackathon where I worked in a group of four to create an application with the theme of 'Changing banking for good.'"
      logo="/src/assets/CapitalOneLogo.jpg"
    />
    <h2 id="Projects" className={styles.sectionTitle}>
      Projects
    </h2>
    <ProjectCard 
      logo="/src/assets/HornetInvasionImg.png"
      project="Hornet Invasion(Space Invaders)"
      source="Personal"
      description="Recreated the classic Space Alien game by replacing the original elements with an exterminator and bugs.
      Developed a 2D game using pygame, a powerful Python library, incorporating user input, key presses, and mouse-click functionality."
      stack="Python, CSS, Pygame"
    />
    <ProjectCard 
      logo="/src/assets/OdinRecipesImg.png"
      project="One Piece Recipes Site"
      source="Personal"
      description="This website is was my very first HTML/CSS project, marking my introduction to web development. 
      It features a collection of recipes inspired by the One Piece anime, including:
      Marine Captain's Curry, Sanji's Risotto, Franky Cola, Elbaf Semla, Tony Tony Chopper's Cotton Candy, and Oden."
      stack="HTML, CSS"
    />
    
  </div>
);

const App = () => {
  const [isEjected, setIsEjected] = useState(false);

  const handleEject = () => {
    audio.cloneNode(true).play();
    const glitch = PowerGlitch.glitch('body', {
      playMode: 'always',
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 1000,
        iterations: 1,
        easing: 'ease-in-out',
      },
      glitchTimeSpan: {
        start: 0,
        end: 1,
      },
      shake: {
        velocity: 15,
        amplitudeX: 0.2,
        amplitudeY: 0.2,
      },
      slice: {
        count: 6,
        velocity: 15,
        minHeight: 0.02,
        maxHeight: 0.15,
        hueRotate: true,
      },
    });

    setTimeout(() => {
      glitch.stopGlitch();
      setIsEjected(true);
    }, 1000);
  };

  const handleRewind = () => {
    setIsEjected(false);
    audio.cloneNode(true).play();
    setTimeout(() => {
      location.reload();
    }, 1000);
  };

  if (isEjected) {
    return <EjectScreen onRewind={handleRewind} />;
  }

  return <Content onEject={handleEject} />;
};

const vcr = document.getElementById('vcr');

if (!REDUCE_MOTION) {
  const timer = document.createElement('p');
  timer.className = 'glitch';
  timer.textContent = '0:00:00';
  document.getElementById('marker').appendChild(timer);
  createTimer(timer);

  const glitch0 = PowerGlitch.glitch('.overlay', {
    glitchTimeSpan: false,
  });
  const glitch1 = PowerGlitch.glitch('.glitch', {
    timing: {
      duration: 700,
      easing: 'ease-in-out',
    },
  });

  let init = false;
  setTimeout(() => {
    if (!init) {
      document.getElementById('reminder').style.opacity = 1;
    }
    glitch0.stopGlitch();
  }, 1000);

  const start = () => {
    if (init) return;
    audio.cloneNode(true).play();
    init = true;
    glitch1.stopGlitch();
    const glitch2 = PowerGlitch.glitch('.glitch', {
      glitchTimeSpan: false,
    });
    clearInterval(timerInterval);
    vcr.style.opacity = 0;
    setTimeout(() => {
      document.body.style.overflow = 'auto';
      glitch2.stopGlitch();
      vcr.style.display = 'none';
      root.render(<App />); // Render the main content
    }, 1000);
  };

  document.addEventListener('click', start);
} else {
  vcr.style.display = 'none';
  root.render(<App />);
  document.body.style.overflow = 'auto';
}
