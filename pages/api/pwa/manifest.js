import { readLocaleCookie } from "../../../lib/i18n/locale-cookie.js";
import { resolvePwaManifestLocale, resolvePwaStartUrl } from "../../../lib/pwa/pwa-locale.js";
import fs from "fs";
import path from "path";

const PORTAL_FILES = {
  student: "manifest-student.webmanifest",
  parent: "manifest-parent.webmanifest",
  teacher: "manifest-teacher.webmanifest",
};

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
  const fileName = PORTAL_FILES[portal];
  if (!fileName) {
    return res.status(400).json({ ok: false, error: "invalid_portal" });
  }

  const cookieLocale = readLocaleCookie(typeof req.headers.cookie === "string" ? req.headers.cookie : "");
  const queryLocale = typeof req.query.locale === "string" ? req.query.locale : null;
  const localeId = queryLocale || cookieLocale || "en";

  const filePath = path.join(process.cwd(), "public", fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, error: "manifest_not_found" });
  }

  const base = JSON.parse(fs.readFileSync(filePath, "utf8"));
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
