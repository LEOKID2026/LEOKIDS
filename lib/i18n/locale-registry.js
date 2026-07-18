/**
 * Global locale registry — data-driven definitions for all product locales.
 * Default English; pseudo locales for QA; future locales registered disabled.
 */

import { normalizeLocaleId } from "./locale-normalize.js";

/** @typedef {"ltr"|"rtl"} TextDirection */
/** @typedef {"disabled"|"development"|"preview"|"enabled"} LocaleStatus */

/**
 * @typedef {{
 *   id: string,
 *   enabled: boolean,
 *   status: LocaleStatus,
 *   direction: TextDirection,
 *   displayName: string,
 *   nativeName: string,
 *   intlLocale: string,
 *   fallbackLocale: string|null,
 *   textToSpeechLocale: string,
 *   ogLocale: string,
 *   aliases: string[],
 *   defaultMarket: string,
 *   defaultCurriculum: string,
 *   isPseudo?: boolean,
 *   fonts?: string[],
 *   label?: string,
 * }} LocaleDefinition
 */

/** @type {Readonly<Record<string, LocaleDefinition>>} */
export const LOCALE_REGISTRY = Object.freeze({
  en: {
    id: "en",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English",
    nativeName: "English",
    intlLocale: "en",
    fallbackLocale: null,
    textToSpeechLocale: "en-US",
    ogLocale: "en_US",
    aliases: ["en-US", "en-GB", "en-AU", "en-CA"],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "English",
  },
  "en-XA": {
    id: "en-XA",
    enabled: true,
    status: "development",
    direction: "ltr",
    displayName: "English (pseudo long)",
    nativeName: "English (pseudo long)",
    intlLocale: "en",
    fallbackLocale: "en",
    textToSpeechLocale: "en-US",
    ogLocale: "en_US",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    isPseudo: true,
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "English (pseudo long)",
  },
  "ar-XB": {
    id: "ar-XB",
    enabled: true,
    status: "development",
    direction: "rtl",
    displayName: "Arabic (pseudo RTL)",
    nativeName: "Arabic (pseudo RTL)",
    intlLocale: "ar",
    fallbackLocale: "en",
    textToSpeechLocale: "ar-SA",
    ogLocale: "ar_SA",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    isPseudo: true,
    fonts: ["Noto Naskh Arabic", "Tahoma", "sans-serif"],
    label: "Arabic (pseudo RTL)",
  },
  // Future product locales — registered, not yet translated.
  es: mkDisabled("es", "Español", "Español", "ltr", "es-ES", "es_ES"),
  fr: mkDisabled("fr", "Français", "Français", "ltr", "fr-FR", "fr_FR"),
  de: mkDisabled("de", "Deutsch", "Deutsch", "ltr", "de-DE", "de_DE"),
  pt: mkDisabled("pt", "Português", "Português", "ltr", "pt-PT", "pt_PT", ["pt-BR"]),
  it: mkDisabled("it", "Italiano", "Italiano", "ltr", "it-IT", "it_IT"),
  nl: mkDisabled("nl", "Nederlands", "Nederlands", "ltr", "nl-NL", "nl_NL"),
  pl: mkDisabled("pl", "Polski", "Polski", "ltr", "pl-PL", "pl_PL"),
  ru: mkDisabled("ru", "Русский", "Русский", "ltr", "ru-RU", "ru_RU"),
  ar: mkDisabled("ar", "Arabic", "العربية", "rtl", "ar-SA", "ar_SA"),
  fa: mkDisabled("fa", "Persian", "فارسی", "rtl", "fa-IR", "fa_IR"),
  ur: mkDisabled("ur", "Urdu", "اردو", "rtl", "ur-PK", "ur_PK"),
  tr: mkDisabled("tr", "Turkish", "Türkçe", "ltr", "tr-TR", "tr_TR"),
  zh: mkDisabled("zh", "Chinese", "中文", "ltr", "zh-Hans", "zh_CN", ["zh-Hans", "zh-Hant"]),
  ja: mkDisabled("ja", "Japanese", "日本語", "ltr", "ja-JP", "ja_JP"),
  ko: mkDisabled("ko", "Korean", "한국어", "ltr", "ko-KR", "ko_KR"),
});

/**
 * @param {string} id
 * @param {string} displayName
 * @param {string} nativeName
 * @param {TextDirection} direction
 * @param {string} tts
 * @param {string} og
 * @param {string[]} [aliases]
 */
function mkDisabled(id, displayName, nativeName, direction, tts, og, aliases = []) {
  return {
    id,
    enabled: false,
    status: /** @type {LocaleStatus} */ ("disabled"),
    direction,
    displayName,
    nativeName,
    intlLocale: id,
    fallbackLocale: "en",
    textToSpeechLocale: tts,
    ogLocale: og,
    aliases,
    defaultMarket: "global",
    defaultCurriculum: "international",
    label: displayName,
  };
}

export const DEFAULT_LOCALE = "en";
export const FALLBACK_LOCALE = "en";
export const LOCALE_COOKIE_NAME = "lk_global_locale";
export const LOCALE_REQUEST_HEADER = "x-lk-interface-locale";

/** Locales selectable in UI (enabled + preview in production only enabled). */
export const ACTIVE_LOCALE_IDS = Object.freeze(
  Object.values(LOCALE_REGISTRY)
    .filter((l) => l.status === "enabled")
    .map((l) => l.id)
);

/** Locales available in development/CI including pseudo. */
export const RUNTIME_LOCALE_IDS = Object.freeze(
  Object.values(LOCALE_REGISTRY)
    .filter((l) => l.enabled)
    .map((l) => l.id)
);

/**
 * @param {string|null|undefined} raw
 * @returns {LocaleDefinition}
 */
export function resolveLocaleDefinition(raw) {
  const id = normalizeLocaleId(raw);
  if (LOCALE_REGISTRY[id]?.enabled) return LOCALE_REGISTRY[id];

  for (const def of Object.values(LOCALE_REGISTRY)) {
    if (!def.enabled) continue;
    if (def.aliases.some((a) => normalizeLocaleId(a) === id || a.toLowerCase() === id.toLowerCase())) {
      return def;
    }
  }

  const base = id.split("-")[0];
  if (base && LOCALE_REGISTRY[base]?.enabled) return LOCALE_REGISTRY[base];

  return LOCALE_REGISTRY[DEFAULT_LOCALE];
}

/**
 * @param {string|null|undefined} raw
 * @returns {TextDirection}
 */
export function resolveDirection(raw) {
  return resolveLocaleDefinition(raw).direction;
}

/**
 * @param {string|null|undefined} localeId
 */
export function isPseudoLongLocale(localeId) {
  return String(localeId || "") === "en-XA";
}

/**
 * @param {string|null|undefined} localeId
 */
export function isPseudoRtlLocale(localeId) {
  return String(localeId || "") === "ar-XB";
}

/**
 * @param {string|null|undefined} localeId
 */
export function isRtlLocale(localeId) {
  return resolveDirection(localeId) === "rtl";
}

/**
 * Locales shown in language switcher (enabled only, length >= 2 check done by caller).
 */
export function getSelectableLocales() {
  return Object.values(LOCALE_REGISTRY).filter((l) => l.status === "enabled");
}

export { stripLocaleFromPath, stripLocalePrefix, withLocalePath, withLocalePrefix, getLocaleFromPath, isLocalizedPath, canonicalizeLocalizedPath } from "./locale-path.js";
