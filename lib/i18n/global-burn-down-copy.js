import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

/** Active interface locale for legacy `globalBurnDownCopy()` call sites (set from I18nProvider). */
let activeBurnDownLocale = "en";

/**
 * Bind burn-down resolution to the active interface locale (React tree).
 * @param {string|null|undefined} locale
 */
export function bindGlobalBurnDownLocale(locale) {
  activeBurnDownLocale = locale ? String(locale) : "en";
}

/**
 * @returns {string}
 */
export function getActiveBurnDownLocale() {
  return activeBurnDownLocale;
}

/**
 * @param {string|null|undefined} [contentLocale]
 * @param {string} slug
 * @param {string} key
 */
export function globalBurnDownCopyForLocale(contentLocale, slug, key) {
  const index =
    resolveRegisteredContentPack(contentLocale, "global-burn-down", "burn-down-index.json") || {};
  const pack = index[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * Locale-aware when `bindGlobalBurnDownLocale` is active (defaults to en on server/API).
 * @param {string} slug
 * @param {string} key
 */
export function globalBurnDownCopy(slug, key) {
  return globalBurnDownCopyForLocale(activeBurnDownLocale, slug, key);
}
