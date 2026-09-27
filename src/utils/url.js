/**
 * Helper to get the base application URL.
 * Reads VITE_APP_URL from environment variables (e.g. on Vercel: https://your-project.vercel.app)
 * Falls back to window.location.origin (e.g. http://localhost:5173).
 */
export function getAppBaseUrl() {
  const envUrl = import.meta.env.VITE_APP_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, '');
  }
  return window.location.origin;
}

export function buildAttendeeUrl(eventSlugOrId) {
  const base = getAppBaseUrl();
  const path = window.location.pathname === '/' ? '' : window.location.pathname;
  return `${base}${path}?role=attendee&event=${eventSlugOrId}`;
}
