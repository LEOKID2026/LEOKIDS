/**
 * Locale-aware content pack resolution over the registered catalog.
 * Fallback to `en` (and configured chain) happens here — not via hard imports in callers.
 *
 * Sparse country overlays (e.g. es-ES) are deep-merged onto parent packs along
 * getContentFallbackChain — same leaf-overlay semantics as loadContentPack.
 */

import { getContentFallbackChain, resolveContentLocale } from "./locale.js";
import { getCatalogPackExact } from "./pack-catalog.js";
import { deepMergeJson } from "../i18n/deep-merge.js";

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
  /** @type {unknown[]} */
  const layers = [];
  // Base → overlay order (same as loadContentPack): reverse chain so en first.
  for (const loc of [...chain].reverse()) {
    const pack = getCatalogPackExact(loc, relativePath);
    if (pack != null) layers.push(pack);
  }
  if (layers.length === 0) return null;
  // Preserve identity when a single registered pack covers the path (en / full es-419).
  if (layers.length === 1) return layers[0];

  /** @type {unknown} */
  let merged = Array.isArray(layers[0]) ? [] : {};
  for (const pack of layers) {
    merged = deepMergeJson(merged, pack);
  }
  return merged;
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
