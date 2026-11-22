import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { PowerGlitch } from "powerglitch";
import Home from "./pages/Home";
import BlogIndex from "./pages/blog/index";
import BlogPost from "./pages/blog/BlogPost";
import EjectScreen from "./pages/EjectScreen";
import NoSignal from "./pages/NoSignal";
import { INTRO_ENABLED, onIntroStart, showIntro } from "./intro";

const audio = new Audio("/effect.webm");

// Glitches the whole page for a second. Returns a function that ends the glitch and
// undoes PowerGlitch's wrapping of <body> (it moves <body> into two divs and leaves
// hidden full-page copies behind, which would otherwise pile up without a page reload).
const glitchBody = () => {
  const body = document.body;
  // Once <body> is wrapped and shaken it clips its own content; with a full-screen fixed
  // page inside (the eject screen) that clipped everything and left a blank screen.
  const overflow = body.style.overflow;
  body.style.overflow = "visible";
  const glitch = PowerGlitch.glitch(body, {
    playMode: "always",
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 1000,
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
    glitch.stopGlitch();
    const layers = body.parentElement;
    const container = layers?.parentElement;
    if (layers && container && container !== document.documentElement) {
      document.documentElement.insertBefore(body, container);
      container.remove();
    }
    body.style.gridArea = "";
    body.style.overflow = overflow;
    delete body.dataset.glitched;
  };
};

const App = () => {
  const navigate = useNavigate();
  const [isEjected, setIsEjected] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  // True while the VCR intro is back on screen after a Rewind; the site renders again on "click to begin".
  const [introShowing, setIntroShowing] = useState(false);

  useEffect(() => onIntroStart(() => setIntroShowing(false)), []);

  // The navbar passes a click event; the terminal's `play` command passes { play: true }.
  const handleEject = (options) => {
    setAutoPlay(options?.play === true);
    audio.cloneNode(true).play();
    const endGlitch = glitchBody();

    setTimeout(() => {
      endGlitch();
      setIsEjected(true);
    }, 1000);
  };

  // Cut straight back to the VCR intro (its own loading glitch plays), no reload and no blank screen.
  const handleRewind = () => {
    audio.cloneNode(true).play();
    if (INTRO_ENABLED) {
      showIntro();
      setIntroShowing(true);
    }
    setIsEjected(false);
    navigate("/", { replace: true });
  };

  if (introShowing) return null;

  if (isEjected) {
    return <EjectScreen onRewind={handleRewind} autoPlay={autoPlay} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home onEject={handleEject} />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="*" element={<NoSignal onInsertTape={handleRewind} />} />
    </Routes>
  );
};

export default App;
