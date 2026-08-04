import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

/** Active interface locale for legacy `burnDownCopy()` call sites (set from I18nProvider). */
let activeLearningBurnDownLocale = "en";

/**
 * Bind learning burn-down resolution to the active interface locale (React tree).
 * @param {string|null|undefined} locale
 */
export function bindLearningBurnDownLocale(locale) {
  activeLearningBurnDownLocale = locale ? String(locale) : "en";
}

/**
 * @returns {string}
 */
export function getActiveLearningBurnDownLocale() {
  return activeLearningBurnDownLocale;
}

/**
 * @param {string|null|undefined} [contentLocale]
 * @param {string} slug
 * @param {string} key
 */
export function burnDownCopyForLocale(contentLocale, slug, key) {
  const index = resolveRegisteredContentPack(contentLocale, "learning", "burn-down-index.json") || {};
  const pack = index[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * Locale-aware when `bindLearningBurnDownLocale` is active (defaults to en on server/API).
 * @param {string} slug
 * @param {string} key
 */
export function burnDownCopy(slug, key) {
  return burnDownCopyForLocale(activeLearningBurnDownLocale, slug, key);
}
