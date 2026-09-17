// Shared by both entry points; the static demo never contacts a NodeFlare server.
export const demoMode = import.meta.env?.VITE_DEMO === "true"
  || Boolean(import.meta.env?.DEV && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo"));

export const demoBase = import.meta.env?.BASE_URL ?? "/";
const demoQuery = import.meta.env?.DEV ? "?demo=1" : "";
export const dashboardHref = demoMode ? `${demoBase}${demoQuery}` : "/";
export const adminHref = demoMode ? `${demoBase}admin.html${demoQuery}#/admin/login` : "/admin/login";
