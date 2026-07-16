import { applyPseudoLong, formatMessage } from "./message-format.js";
import { getFallbackBundles, loadLocaleBundles, lookupMessage } from "./load-messages.js";
import { isPseudoLongLocale, resolveLocaleDefinition } from "./locale-registry.js";

/**
 * @param {string} locale
 */
export function createTranslator(locale) {
  const def = resolveLocaleDefinition(locale);
  const localeId = def.id;
  const bundles = loadLocaleBundles(localeId);
  const fallback = getFallbackBundles();
  /** @type {Set<string>} */
  const missing = new Set();

  /**
   * @param {string} key
   * @param {Record<string, unknown>} [vars]
   */
  function t(key, vars) {
    let msg = lookupMessage(bundles, key);
    if (msg == null) {
      msg = lookupMessage(fallback, key);
      if (msg == null) {
        missing.add(key);
        if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(`[i18n] missing key: ${key}`);
        }
        msg = key;
      }
    }
    let out = formatMessage(msg, vars, localeId);
    if (isPseudoLongLocale(localeId)) {
      out = applyPseudoLong(out);
    }
    return out;
  }

  return {
    locale: localeId,
    direction: def.direction,
    t,
    getMissingKeys: () => Array.from(missing),
  };
}
