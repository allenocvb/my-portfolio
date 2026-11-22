// main.jsx - Entry point
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import { INTRO_ENABLED, hideIntro, onIntroStart, showIntro } from "./intro";

const root = createRoot(document.getElementById("root"));
const renderApp = () => {
  root.render(
    <BrowserRouter>
      <Analytics />
      <App />
    </BrowserRouter>,
  );
};

if (INTRO_ENABLED && window.location.pathname === "/") {
  // Render the site the moment the visitor clicks to begin (it fills in behind the transition).
  const stop = onIntroStart(() => {
    stop();
    renderApp();
  });
  showIntro();
} else {
  // Skip the intro for other paths and for reduced motion.
  hideIntro();
  renderApp();
}
