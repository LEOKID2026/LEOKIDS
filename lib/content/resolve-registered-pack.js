/**
 * Locale-aware content pack resolution over the registered catalog.
 * Fallback to `en` (and configured chain) happens here — not via hard imports in callers.
 */

import { getContentFallbackChain, resolveContentLocale } from "./locale.js";
import { getCatalogPackExact } from "./pack-catalog.js";

/**
 * @param {string|null|undefined|{
 *   contentLocale?: string|null,
 *   interfaceLocale?: string|null,
 *   subject?: string|null,
 *   market?: string|null,
 *   curriculum?: string|null,
 * }} localeOrOpts
 * @param {...string} segments path under content-packs/{locale}/
 * @returns {unknown}
 */
export function resolveRegisteredContentPack(localeOrOpts, ...segments) {
  const opts =
    localeOrOpts && typeof localeOrOpts === "object" && !Array.isArray(localeOrOpts)
      ? localeOrOpts
      : { contentLocale: localeOrOpts };

  const locale = resolveContentLocale(opts);
  const relativePath = segments
    .map((s) => String(s || "").replace(/\\/g, "/").replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");

  if (!relativePath) return null;

  const chain = getContentFallbackChain(locale);
  for (const loc of chain) {
    const pack = getCatalogPackExact(loc, relativePath);
    if (pack != null) return pack;
  }
  return null;
}

/**
 * Convenience: learning domain packs.
 * @param {string|null|undefined|object} localeOrOpts
 * @param {...string} segments under learning/
 */
export function resolveLearningPack(localeOrOpts, ...segments) {
  return resolveRegisteredContentPack(localeOrOpts, "learning", ...segments);
}

/**
 * Convenience: games domain packs.
 */
export function resolveGamesPack(localeOrOpts, ...segments) {
  return resolveRegisteredContentPack(localeOrOpts, "games", ...segments);
}

/**
 * Convenience: reports domain packs.
 */
export function resolveReportsPack(localeOrOpts, ...segments) {
  return resolveRegisteredContentPack(localeOrOpts, "reports", ...segments);
}

/**
 * Convenience: books domain packs.
 */
export function resolveBooksPack(localeOrOpts, ...segments) {
  return resolveRegisteredContentPack(localeOrOpts, "books", ...segments);
}

/**
 * Convenience: rewards domain packs.
 */
export function resolveRewardsPack(localeOrOpts, ...segments) {
  return resolveRegisteredContentPack(localeOrOpts, "rewards", ...segments);
}
