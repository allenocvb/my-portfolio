// main.jsx
import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import aboutMe from "./components/aboutMe";
import { PowerGlitch } from "powerglitch";
import styles from "./styles/SectionTitles.module.scss";
import ExperienceTimeline from "./components/ExperienceTimeline";
import EducationCard from "./components/EducationCard";
import ProjectsGrid from "./components/ProjectsGrid";
import AnimatedBackground from "./components/AnimatedBackground";
import ContactLinks from "./components/ContactLinks";
import Blog from "./components/Blog";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const REDUCE_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const audio = new Audio("/effect.webm");

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
    setPosition((prev) => {
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
      setRotation((prev) => (prev + 5) % 360);

      return { x: newX, y: newY };
    });
  }, [velocity]);

  useEffect(() => {
    const intervalId = setInterval(updatePosition, 50);
    return () => clearInterval(intervalId);
  }, [updatePosition]);

  useEffect(() => {
    const glitchEffect = PowerGlitch.glitch("#eject-screen", {
      playMode: "always",
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 2000,
        iterations: 1,
        easing: "ease-in-out",
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
    <div
      id="eject-screen"
      style={{
        fontFamily: "VCR, monospace",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <AnimatedBackground />
      <img
        src="/assets/spaceinvaders2.gif"
        alt="Space Invader"
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "100px",
          height: "auto",
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.05s linear",
          zIndex: 1,
        }}
      />
      <p
        style={{
          fontSize: "24px",
          textAlign: "center",
          maxWidth: "80%",
          marginBottom: "20px",
          zIndex: 2,
        }}
      >
        "Begin doing what you want to do now. We are not living in eternity. We
        have only this moment, sparkling like a star in our hand—and melting
        like a snowflake." — Someone wise
      </p>
      <button
        onClick={onRewind}
        className="px-5 py-2.5 text-lg cursor-pointer z-10 hover:underline"
      >
        Rewind{" "}
        <span style={{ fontFamily: "inherit", fontVariantEmoji: "text" }}>
          ⏮︎
        </span>
      </button>
    </div>
  );
};

const Content = ({ onEject }) => (
  <div className="content-container" style={{ paddingTop: "80px" }}>
    <Navbar onEject={onEject} />
    <Hero />
    <About statements={aboutMe} />
    <h2 id="experience" className={styles.sectionTitle}>
      Experience
    </h2>
    <ExperienceTimeline
      experiences={[
        {
          title: "Software Engineer",
          previousTitle: "Intern",
          company: "Pinterest",
          location: "Remote(NYC based)",
          previousTimeframe: "May 2025 - August 2025",
          timeframe: "Returning July 2026",
          description:
            "SWE on the Home Feed product team. Designed and shipped a Home Feed discovery module for Pinterest mobile, leveraging user interest vectors and topic extraction services to drive serendipitous context discovery for millions of users. Worked on experiments for Shopping Modules and impoved a core API",
          logo: "/assets/pinterest-logo.png",
          companyLink: "https://www.pinterestcareers.com/",
        },
        {
          title: "Software Engineer Intern",
          company: "Warner Bros Discovery",
          location: "Atlanta, Georgia",
          timeframe: "June 2024 - August 2024",
          description:
            "SWE intern on Bleacher Report Web team. Built a POC for a shared Redis caching layer for Bleacher Report, improving SSR performance and reducing storage usage by up to 90%. Contributed to Bleacher Report 2.0 using Next.js, Typescript, and GraphQL, and validated performance and reliability through k6 load testing.",
          logo: "/assets/wbdlogo.png",
          companyLink: "https://www.wbd.com/",
        },
        {
          title: "Computer Science Instructor",
          company: "355Code",
          location: "Remote",
          timeframe: "October 2022 - January 2024",
          description:
            "Taught JavaScript and Python to students, covering both front-end and back-end fundamentals. Simplified complex concepts through clear explanations and hands on guidance tailored to diverse learning styles.",
          logo: "/assets/355CodeLogo.png",
          companyLink: "https://www.355code.com/",
        },
      ]}
    />
    <h2 id="projects" className={styles.sectionTitle}>
      Projects
    </h2>
    <ProjectsGrid
      projects={[
        {
          name: "Art Explorer App",
          description:
            "iOS app using SwiftUI to explore artworks from the Harvard Art Museums API. Browse by culture, artist, medium, and period with search and async image loading.",
          techStack: "SwiftUI, Harvard Art Museums API, MapKit",
          githubLink: "https://github.com/allenocvb/ArtExplorer",
          image: "/assets/RenaissanceSky.jpg",
        },
        {
          name: "Peer-to-Peer File Sharing",
          description:
            "P2P file-sharing system with a central server tracking shared files. Files are chunked and downloaded from multiple peers with hash-based integrity checks. (Academic)",
          techStack: "Python, Socket Programming, Multithreading",
          image: "/assets/P2PIMG.png",
        },
        {
          name: "B2B Marketplace",
          description:
            "University django e-commerce marketplace with role-based auth, product categories, shopping cart, and admin dashboard with analytics. (Academic)",
          techStack: "Python, Django, SQLite, TailwindCSS",
          image: "/assets/B2bMarketplace.png",
        },
        {
          name: "Hornet Invasion",
          description:
            "Space Invaders remake with an exterminator vs bugs theme. Built with pygame featuring user input, key presses, and mouse-click functionality.",
          techStack: "Python, Pygame",
          githubLink:
            "https://github.com/allenocvb/Hornet-Invasion-Space-invaders-",
          image: "/assets/HornetInvasionImg.png",
        },
        {
          name: "BeReal Clone App",
          description:
            "iOS BeReal clone with photo uploads, user auth via Parse Swift SDK, and a 24-hour posting window before viewing others' posts.",
          techStack: "Swift, UIKit, Parse SDK, Back4App",
          githubLink: "https://github.com/allenocvb/BeRealPart2",
          image: "/assets/BeRealIMG.png",
        },
        {
          name: "One Piece Recipes Site",
          description:
            "My first HTML/CSS project featuring anime-inspired recipes: Marine Captain's Curry, Sanji's Risotto, Franky Cola, and more.",
          techStack: "HTML, CSS",
          githubLink: "https://github.com/allenocvb/odinrecipes",
          image: "/assets/OdinRecipesImg.png",
        },
        {
          name: "Scavenger Hunt App",
          description:
            "iOS scavenger hunt app where users complete tasks by attaching photos. Displays task locations on a map with custom annotations.",
          techStack: "Swift, UIKit, MapKit, CoreLocation",
          githubLink: "https://github.com/allenocvb/scavengerHunt",
          image: "/assets/TaskIMG.png",
        },
        {
          name: "Adventure Journal",
          description:
            "Web app for posting personal challenges and achievements. Users can follow journeys, comment, and take on challenges themselves.",
          techStack: "React, Supabase, JavaScript",
          image: "/assets/Placeholder.png",
        },
      ]}
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
    const glitchEffect = PowerGlitch.glitch("body");

    return () => {
      glitchEffect.stopGlitch();
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "VCR, monospace",
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>NO SIGNAL</h1>
      <button
        onClick={handleInsertTape}
        style={{ fontSize: "24px", padding: "10px 20px", cursor: "pointer" }}
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
    const glitch = PowerGlitch.glitch("body", {
      playMode: "always",
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 1350,
        iterations: 1,
        easing: "ease-out",
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
      window.location.href = "/";
    }, 1000);
  };

  if (isEjected) {
    return <EjectScreen onRewind={handleRewind} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Content onEject={handleEject} />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="*" element={<NoSignal onInsertTape={handleRewind} />} />
    </Routes>
  );
};

const vcr = document.getElementById("vcr");
const currentPath = window.location.pathname;

if (!REDUCE_MOTION && currentPath === "/") {
  // Only show the intro screen if the path is '/'
  // Check if the timer element already exists
  let timer = document.getElementById("timer");
  if (!timer) {
    timer = document.createElement("p");
    timer.id = "timer"; // Assign an id to the timer element
    timer.className = "glitch";
    timer.textContent = "0:00:00";
    document.getElementById("marker").appendChild(timer);
    createTimer(timer);
  }

  const glitch0 = PowerGlitch.glitch(".overlay", {
    glitchTimeSpan: false,
  });
  const glitch1 = PowerGlitch.glitch(".glitch", {
    timing: {
      duration: 700,
      easing: "ease-in-out",
    },
  });

  let init = false;
  setTimeout(() => {
    if (!init) {
      document.getElementById("reminder").style.opacity = 1;
    }
    glitch0.stopGlitch();
  }, 1000);

  document.getElementById("vcr").classList.add("font-mono");

  const start = () => {
    if (init) return;
    audio.cloneNode(true).play();
    init = true;
    glitch1.stopGlitch();
    const glitch2 = PowerGlitch.glitch(".glitch", {
      glitchTimeSpan: false,
    });
    clearInterval(timerInterval);
    vcr.style.opacity = 0;
    setTimeout(() => {
      document.body.style.overflow = "auto";
      glitch2.stopGlitch();
      vcr.style.display = "none";
      root.render(
        <>
          <BrowserRouter>
            <Analytics />
            <App />
          </BrowserRouter>
        </>,
      );
    }, 1000);
  };

  document.addEventListener("click", start);
} else {
  // Skip the intro screen for any other path
  vcr.style.display = "none";
  root.render(
    <>
      <BrowserRouter>
        <Analytics />
        <App />
      </BrowserRouter>
    </>,
  );
  document.body.style.overflow = "auto";
}
