import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { glitchOnce } from "./utils/glitch";
import Home from "./pages/Home";
import BlogIndex from "./pages/blog/index";
import BlogPost from "./pages/blog/BlogPost";
import EjectScreen from "./pages/EjectScreen";
import NoSignal from "./pages/NoSignal";
import { INTRO_ENABLED, onIntroStart, showIntro } from "./intro";

const audio = new Audio("/effect.webm");

// Glitches the whole page for a second, then cleans up after PowerGlitch.
const glitchBody = () => {
  const body = document.body;
  // Once <body> is wrapped and shaken it clips its own content; with a full-screen fixed
  // page inside (the eject screen) that clipped everything and left a blank screen.
  const overflow = body.style.overflow;
  body.style.overflow = "visible";
  const end = glitchOnce(body, 1000);
  return () => {
    end();
    body.style.overflow = overflow;
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
