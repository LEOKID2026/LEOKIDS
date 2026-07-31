/**
 * Resolve locale-specific static assets (images/SVG/audio/PDF) with fallback to en.
 * Does not create assets — selection contract only.
 */

import fs from "fs";
import path from "path";
import { getContentFallbackChain, resolveContentLocale } from "./locale.js";

/**
 * @param {string|null|undefined} contentLocale
 * @param {string} relativePath path under public/assets, without locale prefix
 * @param {{
 *   baseDir?: string,
 *   root?: string,
 * }} [opts]
 * @returns {{ locale: string, relativeUrl: string, fellBack: boolean }}
 */
export function resolveLocalizedAsset(contentLocale, relativePath, opts = {}) {
  const rel = String(relativePath || "").replace(/^\/+/, "");
  const baseDir = String(opts.baseDir || "assets/i18n").replace(/\/+$/, "");
  const chain = getContentFallbackChain(resolveContentLocale({ contentLocale }));
  const root = opts.root || process.cwd();

  for (let i = 0; i < chain.length; i += 1) {
    const loc = chain[i];
    const candidateRel = `${baseDir}/${loc}/${rel}`.replace(/\\/g, "/");
    const absPublic = path.join(root, "public", candidateRel);
    const absRoot = path.join(root, candidateRel);
    if (fs.existsSync(absPublic) || fs.existsSync(absRoot)) {
      return { locale: loc, relativeUrl: `/${candidateRel}`, fellBack: i > 0 };
    }
  }

  return {
    locale: "en",
    relativeUrl: `/${baseDir}/en/${rel}`,
    fellBack: true,
  };
}
