export function setThemePreference(theme) {
  if (theme !== "light" && theme !== "dark") return;
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("portfolio-theme", theme); } catch { /* Optional persistence. */ }
}
