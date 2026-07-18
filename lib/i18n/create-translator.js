import { applyPseudoLong, applyPseudoRtl, formatMessage } from "./message-format.js";
import { getFallbackBundles, loadLocaleBundles, lookupMessage } from "./load-messages.js";
import {
  isPseudoLongLocale,
  isPseudoRtlLocale,
  resolveLocaleDefinition,
} from "./locale-registry.js";
import { getLocaleFallbackChain } from "./locale-resolution.js";
import { getBaseLocaleId, normalizeLocaleId } from "./locale-normalize.js";

/**
 * @param {string} locale
 */
export function createTranslator(locale) {
  const def = resolveLocaleDefinition(locale);
  const localeId = def.id;
  const bundles = loadLocaleBundles(localeId);
  const fallback = getFallbackBundles();
  const chain = getLocaleFallbackChain(localeId);
  /** @type {Set<string>} */
  const missing = new Set();
  /** @type {{ key: string, usedLocale: string, requestedLocale: string }[]} */
  const fallbackHits = [];

  /**
   * @param {string} key
   * @param {Record<string, unknown>} [vars]
   */
  function t(key, vars) {
    let msg = lookupMessage(bundles, key);
    let usedLocale = localeId;

    if (msg == null) {
      msg = lookupMessage(fallback, key);
      usedLocale = chain.find((id) => lookupMessage(loadLocaleBundles(id), key) != null) || "en";
      if (msg != null && usedLocale !== localeId) {
        fallbackHits.push({ key, usedLocale, requestedLocale: localeId });
      }
    }

    if (msg == null) {
      missing.add(key);
      if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`[i18n] missing key: ${key} (locale=${localeId})`);
      }
      msg = key;
    }

    let out = formatMessage(msg, vars, localeId);
    if (isPseudoLongLocale(localeId)) {
      out = applyPseudoLong(out);
    } else if (isPseudoRtlLocale(localeId)) {
      out = applyPseudoRtl(out);
    }
    return out;
  }

  return {
    locale: localeId,
    baseLocale: getBaseLocaleId(localeId) || normalizeLocaleId(localeId),
    direction: def.direction,
    t,
    getMissingKeys: () => Array.from(missing),
    getFallbackHits: () => fallbackHits.slice(),
  };
}
