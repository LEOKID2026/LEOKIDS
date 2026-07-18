/**
 * Generic locale-aware reward card display catalog loader.
 * DB stores stable card_key + logic; display names come from locale catalogs.
 */

import { DEFAULT_LOCALE } from "../i18n/locale-registry.js";
import { resolveContentLocale } from "../i18n/locale-resolution.js";
import {
  loadRewardCardCatalog,
  resolveRewardCardEntry,
} from "./reward-pack-copy.js";

/**
 * @param {string|null|undefined} locale
 * @param {string} cardKey
 */
export function resolveRewardCardDisplay(locale, cardKey) {
  const entry = resolveRewardCardEntry(cardKey, locale);
  if (!entry) return null;
  return {
    cardKey: entry.cardKey,
    name: entry.title,
    description: entry.description,
    contentLocale: entry.contentLocale,
  };
}

/**
 * @param {string|null|undefined} locale
 */
export function getRewardCardCatalog(locale) {
  return loadRewardCardCatalog(locale);
}

/**
 * Validate catalog completeness vs reference locale keys.
 * @param {string} localeId
 * @param {string} [referenceLocale]
 */
export function validateRewardCatalogCompleteness(localeId, referenceLocale = DEFAULT_LOCALE) {
  const ref = getRewardCardCatalog(referenceLocale) || {};
  const target = getRewardCardCatalog(localeId) || {};
  const missing = Object.keys(ref).filter((k) => !target[k]?.title);
  return { ok: missing.length === 0, missing, total: Object.keys(ref).length };
}

/** @deprecated tests only */
export function registerRewardCardCatalog(_localeId, _catalog) {
  // no-op — catalogs load from content packs
}
