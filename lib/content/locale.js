/**
 * Client-safe content locale API (no Node fs).
 */

import { resolveContentLocale as resolveContentLocaleCore } from "../i18n/locale-resolution.js";
import { getLocaleFallbackChain } from "../i18n/locale-resolution.js";
import { DEFAULT_LOCALE } from "../i18n/locale-registry.js";

/**
 * @param {{
 *   contentLocale?: string|null,
 *   interfaceLocale?: string|null,
 *   subject?: string|null,
 *   market?: string|null,
 *   curriculum?: string|null,
 * }} [opts]
 */
export function resolveContentLocale(opts = {}) {
  return resolveContentLocaleCore(opts);
}

/**
 * @param {string|null|undefined} contentLocale
 */
export function getContentFallbackChain(contentLocale) {
  const primary = resolveContentLocaleCore({ contentLocale });
  return getLocaleFallbackChain(primary);
}

/**
 * @param {string} locale
 * @param {Record<string, unknown>} catalogs keyed by locale
 */
export function getLocalizedContent(locale, catalogs) {
  const chain = getContentFallbackChain(locale);
  for (const loc of chain) {
    if (catalogs[loc]) return catalogs[loc];
  }
  return catalogs[DEFAULT_LOCALE] || null;
}

/**
 * @param {string} locale
 * @param {Record<string, unknown>} catalogs
 */
export function getContentFallback(locale, catalogs) {
  const chain = getContentFallbackChain(locale);
  for (let i = 1; i < chain.length; i += 1) {
    const loc = chain[i];
    if (catalogs[loc]) return { locale: loc, content: catalogs[loc] };
  }
  return null;
}

/**
 * Relative drafts dir without filesystem checks (client-safe).
 * @param {string} contentLocale
 * @param {string} subject
 * @param {string} grade
 */
export function buildLearningBookDraftsDir(contentLocale, subject, grade) {
  const loc = resolveContentLocaleCore({ contentLocale });
  return pathJoin("docs", "learning-book", loc, subject, grade, "drafts");
}

/**
 * Legacy relative path (pre-locale layout).
 */
export function buildLegacyLearningBookDraftsDir(subject, grade) {
  return pathJoin("docs", "learning-book", subject, grade, "drafts");
}

/**
 * @param {...string} parts
 */
function pathJoin(...parts) {
  return parts.filter(Boolean).join("/").replace(/\\/g, "/");
}
