// main.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import aboutMe from './components/aboutMe';
import { PowerGlitch } from 'powerglitch';
import styles from './styles/SectionTitles.module.scss';
import Wexperience from './components/Wexperience';
import ProjectCard from './components/ProjectCard';
import AnimatedBackground from './components/AnimatedBackground';
import ContactLinks from './components/ContactLinks';

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
   <div id="eject-screen" style={{ 
    fontFamily: 'VCR, monospace', 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: 'black', 
    color: 'white', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden' }}>
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
 <div className="content-container" style={{ paddingTop: '80px' }}>
   <Navbar onEject={onEject} />
   <Hero />
   <About statements={aboutMe} />
   <h2 id="experience" className={styles.sectionTitle}>
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
     companyLink="https://www.wbd.com/"
   />
   <Wexperience
     title="Computer Science Instructor"
     company="355Code"
     timeframe="October 2022 - January 2024"
     description="Tutored 20+ students in JavaScript and Python.
     Demonstrated knowledge in both front-end and back-end technologies to provide comprehensive instruction.
     Leveraged strong communication and teaching skills to break down complex concepts for diverse learners."
     logo="/src/assets/355CodeLogo.png"
     companyLink="https://www.355code.com/"
   />
   <Wexperience
     title="Summiteer"
     company="Capital One"
     timeframe="July 2023 - August 2023"
     description="Selected as one of 31 participants to participate in a week-long summit.
     Attended a week of technical workshops on Web, Full-Stack, and Mobile Development using Git, React, SQL, APIs, AR (Snapchat Lens Studio), Swift, and more.
     Finished 2nd place at the Summit hackathon where I worked in a group of four to create an application with the theme of 'Changing banking for good.'"
     logo="/src/assets/CapitalOneLogo.jpg"
     companyLink="https://www.capitalone.com/about/corporate-information/our-company/"
   />
   <h2 id="projects" className={styles.sectionTitle}>
     Projects
   </h2>
   <ProjectCard
     logo="/src/assets/RenaissanceSky.jpg"
     project="Art Explorer App"
     source="Personal"
     description="Developed an iOS app using SwiftUI that allows users to explore artworks from the Harvard Art Museums API. 
     The app enables users to browse artworks filtered by artist, medium, and period. 
     Each artwork includes a detailed view with an image, description, and artist information. 
     Implemented search functionality and asynchronous image loading to enhance user experience."
     stack="SwiftUI, Harvard Art Museums API, URLSession, AsyncImage, JSON Parsing, MapKit"
     githubLink="https://github.com/allenocvb/ArtExplorer"
   />
   <ProjectCard
     logo="/src/assets/P2PIMG.png"
     project="Peer-to-Peer File Sharing"
     source="Academic"
     availability="Code upon request(Academic)"
     description="This project is a peer-to-peer (P2P) file-sharing system designed to allow multiple clients to share and download files from each other. 
     The system includes a central server that maintains a list of shared files and their distribution across peers. 
     Files are broken into chunks, which are downloaded simultaneously from different peers to maximize download speed. 
     The project also includes an integrity check using hash functions to ensure the correctness of downloaded files."
     stack="Python, Socket Programming, Multithreading, Hash Functions"
   />
   <ProjectCard
     logo="/src/assets/HornetInvasionImg.png"
     project="Hornet Invasion(Space Invaders)"
     source="Personal"
     description="Recreated the classic Space Alien game by replacing the original elements with an exterminator and bugs.
     Developed a 2D game using pygame, a powerful Python library, incorporating user input, key presses, and mouse-click functionality."
     stack="Python, CSS, Pygame"
     githubLink="https://github.com/allenocvb/Hornet-Invasion-Space-invaders-"
   />
    <ProjectCard
     logo="/src/assets/BeRealIMG.png"
     project="BeReal Clone App"
     source="Academic"
     description="Developed an iOS clone of the BeReal app that allows users to select and upload photos from their photo library. 
     Implemented user authentication and persistence using Parse Swift SDK with Back4App as the backend. 
     The app features a unique functionality where users can only view others' posts after uploading their own photo within a 24-hour window.
      Posts include captions, usernames, and timestamps. Utilized a custom Parse object for efficient server-side persistence of photo uploads and post retrieval."
     stack="Swift, UIKit, Parse Swift SDK, Back4App, PhotosUI, AlamofireImage"
     githubLink="https://github.com/allenocvb/BeRealPart2"
   />
   <ProjectCard
     logo="/src/assets/OdinRecipesImg.png"
     project="One Piece Recipes Site"
     source="Personal"
     description="This website is was my very first HTML/CSS project, marking my introduction to web development.
     It features a collection of recipes inspired by the One Piece anime, including:
     Marine Captain's Curry, Sanji's Risotto, Franky Cola, Elbaf Semla, Tony Tony Chopper's Cotton Candy, and Oden."
     stack="HTML, CSS"
     githubLink="https://github.com/allenocvb/odinrecipes"
   />
   <ProjectCard
     logo="/src/assets/Placeholder.png"
     project="Scavenger Hunt App"
     source="Personal"
     availability="Code upon request(Refactoring)"
     description="Built an iOS scavenger hunt app where users complete tasks by attaching photos from their library or camera. 
     Each task includes a title, description, and completion status, with a map displaying the location where the photo was taken. 
     Users can view a list of tasks, mark them as completed by attaching a photo, and see custom map annotations for the task location. 
     Implemented photo picker integration, custom map annotations, and a task completion tracking system."
     stack="Swift, UIKit, PHPickerViewController, MapKit, CoreLocation, URLSession"
   />
   <ProjectCard
     logo="/src/assets/Placeholder.png"
     project="Adventure Journal"
     source="Personal"
     availability="Code upon request(In progress)"
     description="Adventure Journal is a web app where users can post their personal challenges and achievements, such as fitness goals, travel experiences, or academic accomplishments. 
     Other users can follow these journeys, leave comments, and take on the same challenges by clicking the 'Challenge Myself' button. 
     The app also allows users to track their progress, share proof (photos, videos), and interact with a supportive community."
     stack="React, Supabase, CSS, HTML, JavaScript"
   />
   <ProjectCard
     logo="/src/assets/CMPSC221.png"
     project="Course Scheduler"
     source="Academic"
     availability="Code upon request(Academic)"
     description="Developed a comprehensive College Course Scheduling application as part of an Object Oriented Programming course. 
     This multi-semester scheduler features separate admin and student panels, allowing for efficient course management and student registration. 
     Leveraged Java and SQL expertise to implement admin functions for adding semesters, courses, and students to the Derby database, while also creating a student interface for adding or dropping courses. 
     The project showcases proficiency in OOP principles, database management, and GUI design through the implementation of efficient SQL queries and a user-friendly interface built with SwingGUI."
     stack="Java, SQL, Derby Database, SwingGUI"
   />
   <h2 id="contact" className={styles.sectionTitle}>
     Contact
   </h2>
   <ContactLinks />
  
 </div>
);


const NoSignal = ({ onInsertTape }) => {
  const handleInsertTape = () => {
    onInsertTape();
  };

  useEffect(() => {
    const glitchEffect = PowerGlitch.glitch('body');

    return () => {
      glitchEffect.stopGlitch();
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: 'VCR, monospace',
        backgroundColor: 'black',
        color: 'white',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>NO SIGNAL</h1>
      <button
        onClick={handleInsertTape}
        style={{ fontSize: '24px', padding: '10px 20px', cursor: 'pointer' }}
      >
        ► INSERT TAPE
      </button>
    </div>
  );
};

export default NoSignal;


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
      window.location.href = '/';
    }, 1000);
  };

  if (isEjected) {
    return <EjectScreen onRewind={handleRewind} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Content onEject={handleEject} />} />
      <Route path="*" element={<NoSignal onInsertTape={handleRewind} />} />
    </Routes>
  );
};


const vcr = document.getElementById('vcr');
const currentPath = window.location.pathname;


if (!REDUCE_MOTION && currentPath === '/') {
  // Only show the intro screen if the path is '/'
  // Check if the timer element already exists
  let timer = document.getElementById('timer');
  if (!timer) {
    timer = document.createElement('p');
    timer.id = 'timer'; // Assign an id to the timer element
    timer.className = 'glitch';
    timer.textContent = '0:00:00';
    document.getElementById('marker').appendChild(timer);
    createTimer(timer);
  }

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

  document.getElementById('vcr').classList.add('font-mono');

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
      root.render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    }, 1000);
  };

  document.addEventListener('click', start);
} else {
  // Skip the intro screen for any other path
  vcr.style.display = 'none';
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  document.body.style.overflow = 'auto';
}

