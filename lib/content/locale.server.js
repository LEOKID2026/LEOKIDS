/**
 * Server-only content locale helpers (filesystem).
 * Prefer registered catalog when available so fallback matches client path.
 */

import fs from "fs";
import path from "path";
import {
  buildLegacyLearningBookDraftsDir,
  buildLearningBookDraftsDir,
  getContentFallbackChain,
  resolveContentLocale,
} from "./locale.js";
import { getCatalogPackExact } from "./pack-catalog.js";

/**
 * Load JSON content pack from content-packs/{locale}/{...path}.
 * Catalog hit first (same registry as client); filesystem for unregistered packs.
 * @param {string} locale
 * @param {...string} segments
 */
export function loadContentPack(locale, ...segments) {
  const chain = getContentFallbackChain(locale);
  const relativePath = segments
    .map((s) => String(s || "").replace(/\\/g, "/").replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");

  for (const loc of chain) {
    if (relativePath) {
      const fromCatalog = getCatalogPackExact(loc, relativePath);
      if (fromCatalog != null) return fromCatalog;
    }
    const filePath = path.join(process.cwd(), "content-packs", loc, ...segments);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw);
    }
  }
  return null;
}

/**
 * Resolve existing drafts directory on disk.
 * @param {string} contentLocale
 * @param {string} subject
 * @param {string} grade
 */
export function resolveLearningBookDraftsDir(contentLocale, subject, grade) {
  const localized = buildLearningBookDraftsDir(contentLocale, subject, grade);
  const legacy = buildLegacyLearningBookDraftsDir(subject, grade);
  const localizedAbs = path.join(process.cwd(), localized);
  if (fs.existsSync(localizedAbs)) return localized;
  return legacy;
}

/**
 * @param {string} contentLocale
 * @param {string} subject
 * @param {string} grade
 * @param {string} pageId
 */
export function resolveLearningBookPagePath(contentLocale, subject, grade, pageId) {
  const draftsDir = resolveLearningBookDraftsDir(contentLocale, subject, grade);
  return path.join(process.cwd(), draftsDir, `${pageId}.md`);
}

export { resolveContentLocale };
