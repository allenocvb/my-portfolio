import React, { useEffect, useRef } from "react";

const Giscus = ({ repo, repoId, category, categoryId }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", document.documentElement.dataset.theme || "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");

    ref.current.appendChild(script);
    const syncTheme = () => {
      ref.current?.querySelector("iframe.giscus-frame")?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: document.documentElement.dataset.theme } } },
        "https://giscus.app",
      );
    };
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    // Also sync after the lazy iframe loads if the preference changed meanwhile.
    const container = ref.current;
    container.addEventListener("load", syncTheme, true);
    return () => { observer.disconnect(); container.removeEventListener("load", syncTheme, true); container.replaceChildren(); };
  }, [repo, repoId, category, categoryId]);

  return <div ref={ref} />;
};

export default Giscus;
