/**
 * Locale / script font resolver for Global.
 * Declares stacks for Latin, Arabic, Devanagari, Bengali.
 * Prefers self-hosted webfonts under public/fonts when present;
 * otherwise system fallback — never references a missing font file URL.
 */

import fs from "fs";
import path from "path";
import { resolveLocaleDefinition } from "./locale-registry.js";

/** @typedef {"Latn"|"Arab"|"Deva"|"Beng"} ScriptCode */

/** @type {Record<ScriptCode, { cssVar: string, families: string[], webfontCandidates: string[] }>} */
export const SCRIPT_FONT_STACKS = Object.freeze({
  Latn: {
    cssVar: "--lk-font-sans",
    families: ["Segoe UI", "Noto Sans", "system-ui", "sans-serif"],
    webfontCandidates: ["NotoSans-Regular.woff2", "latin/NotoSans-Regular.woff2"],
  },
  Arab: {
    cssVar: "--lk-font-arabic",
    families: ["Noto Naskh Arabic", "Tahoma", "Segoe UI", "sans-serif"],
    webfontCandidates: [
      "NotoNaskhArabic-Regular.woff2",
      "arabic/NotoNaskhArabic-Regular.woff2",
    ],
  },
  Deva: {
    cssVar: "--lk-font-devanagari",
    families: ["Noto Sans Devanagari", "Noto Sans", "Segoe UI", "sans-serif"],
    webfontCandidates: [
      "NotoSansDevanagari-Regular.woff2",
      "devanagari/NotoSansDevanagari-Regular.woff2",
    ],
  },
  Beng: {
    cssVar: "--lk-font-bengali",
    families: ["Noto Sans Bengali", "Noto Sans", "Segoe UI", "sans-serif"],
    webfontCandidates: [
      "NotoSansBengali-Regular.woff2",
      "bengali/NotoSansBengali-Regular.woff2",
    ],
  },
});

/**
 * @param {string|null|undefined} localeId
 * @returns {ScriptCode}
 */
export function resolveScriptForLocale(localeId) {
  const id = String(localeId || "en").toLowerCase();
  if (id.startsWith("ar") || id === "ar-xb") return "Arab";
  if (id.startsWith("hi") || id.startsWith("mr") || id.startsWith("ne")) return "Deva";
  if (id.startsWith("bn")) return "Beng";
  const def = resolveLocaleDefinition(localeId);
  if (def?.direction === "rtl" && (id.startsWith("ar") || id.includes("arab"))) return "Arab";
  return "Latn";
}

/**
 * @param {string} root
 * @param {string} relativeFont
 */
function webfontExists(root, relativeFont) {
  const candidates = [
    path.join(root, "public", "fonts", relativeFont),
    path.join(root, "fonts", relativeFont),
  ];
  return candidates.some((p) => fs.existsSync(p));
}

/**
 * @param {string|null|undefined} localeId
 * @param {{ root?: string, script?: ScriptCode }} [opts]
 */
export function resolveLocaleFontStack(localeId, opts = {}) {
  const root = opts.root || process.cwd();
  const script = opts.script || resolveScriptForLocale(localeId);
  const stack = SCRIPT_FONT_STACKS[script] || SCRIPT_FONT_STACKS.Latn;
  const def = resolveLocaleDefinition(localeId);

  /** @type {string|null} */
  let webfontUrl = null;
  for (const cand of stack.webfontCandidates) {
    if (webfontExists(root, cand)) {
      webfontUrl = `/fonts/${cand.replace(/\\/g, "/")}`;
      break;
    }
  }

  const families = webfontUrl
    ? [stack.families[0], ...stack.families.slice(1)]
    : [...stack.families];

  // Registry fonts are names only — never file URLs
  const registryFonts = Array.isArray(def?.fonts) ? def.fonts.filter(Boolean) : [];

  return {
    localeId: def?.id || String(localeId || "en"),
    script,
    cssVar: stack.cssVar,
    fontFamilyCss: families.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", "),
    families,
    registryFonts,
    webfontUrl,
    webfontAvailable: Boolean(webfontUrl),
    usesSystemFallback: !webfontUrl,
  };
}

/**
 * Ensure CSS/font infra does not reference missing font files.
 * @param {{ root?: string }} [opts]
 */
export function auditLocaleFontFileReferences(opts = {}) {
  const root = opts.root || process.cwd();
  const cssPath = path.join(root, "styles", "locale-fonts.css");
  /** @type {string[]} */
  const missing = [];
  /** @type {string[]} */
  const urls = [];
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, "utf8");
    const re = /url\(\s*['"]?([^'")\s]+)['"]?\s*\)/g;
    let m;
    while ((m = re.exec(css))) {
      const rel = m[1].replace(/^\//, "");
      urls.push(rel);
      const absPublic = path.join(root, "public", rel);
      const absRoot = path.join(root, rel);
      if (!fs.existsSync(absPublic) && !fs.existsSync(absRoot)) {
        missing.push(rel);
      }
    }
  }
  return { urls, missing, ok: missing.length === 0 };
}
