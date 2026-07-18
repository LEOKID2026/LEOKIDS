/**
 * Market and curriculum resolution — separate from interface locale.
 */

/** @typedef {'global'|'US'|'GB'|'ES'|'MX'|'FR'} MarketId */
/** @typedef {'international'|'US'|'GB'|'ES'|'MX'} CurriculumId */

/** @type {Readonly<Record<string, MarketId>>} */
export const LOCALE_DEFAULT_MARKET = Object.freeze({
  en: "global",
  "en-XA": "global",
  "ar-XB": "global",
});

/** @type {Readonly<Record<string, CurriculumId>>} */
export const LOCALE_DEFAULT_CURRICULUM = Object.freeze({
  en: "international",
  "en-XA": "international",
  "ar-XB": "international",
});

/**
 * @param {string|null|undefined} interfaceLocale
 * @param {string|null|undefined} [explicitMarket]
 * @returns {MarketId}
 */
export function resolveMarket(interfaceLocale, explicitMarket) {
  const raw = String(explicitMarket || "").trim();
  if (raw && isValidMarket(raw)) return /** @type {MarketId} */ (raw);
  const loc = String(interfaceLocale || "en");
  return LOCALE_DEFAULT_MARKET[loc] || "global";
}

/**
 * @param {string|null|undefined} interfaceLocale
 * @param {string|null|undefined} [explicitCurriculum]
 * @returns {CurriculumId}
 */
export function resolveCurriculum(interfaceLocale, explicitCurriculum) {
  const raw = String(explicitCurriculum || "").trim();
  if (raw && isValidCurriculum(raw)) return /** @type {CurriculumId} */ (raw);
  const loc = String(interfaceLocale || "en");
  return LOCALE_DEFAULT_CURRICULUM[loc] || "international";
}

/**
 * @param {string} id
 */
export function isValidMarket(id) {
  return ["global", "US", "GB", "ES", "MX", "FR"].includes(id);
}

/**
 * @param {string} id
 */
export function isValidCurriculum(id) {
  return ["international", "US", "GB", "ES", "MX"].includes(id);
}
