/**
 * Server-only content locale helpers (filesystem).
 * Prefer registered catalog when available so fallback matches client path.
 * Sparse country packs are deep-merged onto parent locales (e.g. es-MX → es-419 → en).
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
import { deepMergeJson } from "../i18n/deep-merge.js";

/**
 * Content-pack authority contract:
 * 1) Registered catalog entry wins when present (`getCatalogPackExact`).
 * 2) Otherwise on-disk `content-packs/{locale}/...` is a first-class authority
 *    for packs not listed in the catalog (intentional disk fallback — not a bug).
 *    Game slug JSON files commonly use this path; burn-down/ui indexes stay cataloged.
 * Duplicate authority is avoided by never registering the same relativePath twice
 * for a locale; disk is only consulted when the catalog miss occurs.
 *
 * @param {string} loc
 * @param {string} relativePath
 * @param {string[]} segments
 * @returns {unknown|null}
 */
function loadExactContentPack(loc, relativePath, segments) {
  if (relativePath) {
    const fromCatalog = getCatalogPackExact(loc, relativePath);
    if (fromCatalog != null) return fromCatalog;
  }
  // DISK_FALLBACK_CONTENT_PACK_AUTHORITY — legal when catalog has no exact pack.
  const filePath = path.join(process.cwd(), "content-packs", loc, ...segments);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  }
  return null;
}

/**
 * Load JSON content pack from content-packs/{locale}/{...path}.
 * Walks the fallback chain and deep-merges so sparse country overrides do not
 * replace an entire parent pack.
 * @param {string} locale
 * @param {...string} segments
 */
export function loadContentPack(locale, ...segments) {
  const chain = getContentFallbackChain(locale);
  const relativePath = segments
    .map((s) => String(s || "").replace(/\\/g, "/").replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");

  /** @type {unknown} */
  let merged = null;
  let found = false;
  for (const loc of [...chain].reverse()) {
    const pack = loadExactContentPack(loc, relativePath, segments);
    if (pack == null) continue;
    found = true;
    merged = deepMergeJson(merged ?? (Array.isArray(pack) ? [] : {}), pack);
  }
  return found ? merged : null;
}

/**
 * Resolve existing drafts directory on disk.
 * Prefers locale fallback chain (e.g. es-419 → en), then legacy tree.
 * @param {string} contentLocale
 * @param {string} subject
 * @param {string} grade
 */
export function resolveLearningBookDraftsDir(contentLocale, subject, grade) {
  const chain = getContentFallbackChain(contentLocale);
  for (const loc of chain) {
    const localized = buildLearningBookDraftsDir(loc, subject, grade);
    const localizedAbs = path.join(process.cwd(), localized);
    if (fs.existsSync(localizedAbs)) return localized;
  }
  return buildLegacyLearningBookDraftsDir(subject, grade);
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
