/**
 * Canonical public site origin for user-facing links and production fallbacks.
 * Prefer env; never hardcode the Israeli production domain for the global product.
 */

function trimTrailingSlash(url) {
  return String(url || "").replace(/\/+$/, "");
}

function originFromEnv(...keys) {
  for (const key of keys) {
    const raw = process.env[key];
    if (raw && String(raw).trim()) {
      try {
        const u = new URL(String(raw).trim());
        return trimTrailingSlash(u.origin);
      } catch {
        // ignore invalid
      }
    }
  }
  return "";
}

function originFromHostEnv(key) {
  const raw = process.env[key];
  if (!raw || !String(raw).trim()) return "";
  const host = String(raw).trim().replace(/^https?:\/\//, "");
  try {
    return trimTrailingSlash(new URL(`https://${host}`).origin);
  } catch {
    return "";
  }
}

const envOrigin =
  originFromEnv("NEXT_PUBLIC_CANONICAL_ORIGIN", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_APP_URL") ||
  originFromHostEnv("VERCEL_PROJECT_PRODUCTION_URL") ||
  originFromHostEnv("VERCEL_URL");

/** @type {string} */
export const CANONICAL_PUBLIC_SITE_ORIGIN = envOrigin || "http://localhost:3000";

/** Hostname (no scheme) for allowNavigation / host checks. */
export const CANONICAL_PUBLIC_SITE_HOST = (() => {
  try {
    return new URL(CANONICAL_PUBLIC_SITE_ORIGIN).hostname;
  } catch {
    return "localhost";
  }
})();

export function getCanonicalPublicSiteOrigin() {
  return CANONICAL_PUBLIC_SITE_ORIGIN;
}

export function getCanonicalPublicSiteHost() {
  return CANONICAL_PUBLIC_SITE_HOST;
}
