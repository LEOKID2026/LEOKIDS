/**
 * Server-only content locale helpers (filesystem).
 */

import fs from "fs";
import path from "path";
import {
  buildLegacyLearningBookDraftsDir,
  buildLearningBookDraftsDir,
  getContentFallbackChain,
  resolveContentLocale,
} from "./locale.js";

/**
 * Load JSON content pack from content-packs/{locale}/{...path}.
 * @param {string} locale
 * @param {...string} segments
 */
export function loadContentPack(locale, ...segments) {
  const chain = getContentFallbackChain(locale);
  for (const loc of chain) {
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
