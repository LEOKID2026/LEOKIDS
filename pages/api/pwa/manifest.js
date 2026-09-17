import { readLocaleCookie } from "../../../lib/i18n/locale-cookie.js";
import { PWA_MANIFEST_BASES } from "../../../lib/pwa/manifest-bases.js";
import { resolvePwaManifestLocale, resolvePwaStartUrl } from "../../../lib/pwa/pwa-locale.js";

const PORTAL_START = {
  student: "/student/home",
  parent: "/parent/login",
  teacher: "/teacher/login",
};

/**
 * Locale-aware PWA manifest (lang, dir, start_url).
 * GET /api/pwa/manifest?portal=parent&locale=en-XA
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const portal = String(req.query.portal || "student").trim().toLowerCase();
  const base = PWA_MANIFEST_BASES[portal];
  if (!base) {
    return res.status(400).json({ ok: false, error: "invalid_portal" });
  }

  const cookieLocale = readLocaleCookie(typeof req.headers.cookie === "string" ? req.headers.cookie : "");
  const queryLocale = typeof req.query.locale === "string" ? req.query.locale : null;
  const localeId = queryLocale || cookieLocale || "en";

  const pwaLocale = resolvePwaManifestLocale(localeId);
  const startPath = PORTAL_START[portal] || base.start_url || "/";

  const manifest = {
    ...base,
    lang: pwaLocale.lang,
    dir: pwaLocale.dir,
    start_url: resolvePwaStartUrl(localeId, startPath),
  };

  res.setHeader("Content-Type", "application/manifest+json");
  res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
  return res.status(200).json(manifest);
}
