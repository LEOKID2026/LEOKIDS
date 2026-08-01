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
 *   pathPrefix?: string,
 *   selectorVisible?: boolean,
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
    selectorVisible: true,
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
  /**
   * Latin American Spanish base layer (UN M.49 region 419).
   * Future country locales inherit via fallbackLocale, e.g. es-MX → es-419 → en.
   * TODO(i18n-seo): review ogLocale / hreflang / sitemap when SEO translation stage runs.
   * TODO(i18n-tts): review textToSpeechLocale / voice catalog in games-audio stage (es-US placeholder).
   */
  "es-419": {
    id: "es-419",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Latin America)",
    nativeName: "Español",
    intlLocale: "es-419",
    fallbackLocale: "en",
    textToSpeechLocale: "es-US",
    ogLocale: "es_LA",
    aliases: ["es-LA"],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Español",
    // Base LatAm layer — public /es-419 stays; not offered in the country switcher.
    selectorVisible: false,
  },
  "es-MX": {
    id: "es-MX",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Mexico)",
    nativeName: "México",
    intlLocale: "es-MX",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-MX",
    ogLocale: "es_MX",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "México",
    pathPrefix: "mx",
    selectorVisible: true,
  },
  "es-CO": {
    id: "es-CO",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Colombia)",
    nativeName: "Colombia",
    intlLocale: "es-CO",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-CO",
    ogLocale: "es_CO",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Colombia",
    pathPrefix: "co",
    selectorVisible: true,
  },
  "es-AR": {
    id: "es-AR",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Argentina)",
    nativeName: "Argentina",
    intlLocale: "es-AR",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-AR",
    ogLocale: "es_AR",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Argentina",
    pathPrefix: "ar",
    selectorVisible: true,
  },
  "es-PE": {
    id: "es-PE",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Peru)",
    nativeName: "Perú",
    intlLocale: "es-PE",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-PE",
    ogLocale: "es_PE",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Perú",
    pathPrefix: "pe",
    selectorVisible: true,
  },
  "es-CL": {
    id: "es-CL",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Chile)",
    nativeName: "Chile",
    intlLocale: "es-CL",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-CL",
    ogLocale: "es_CL",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Chile",
    pathPrefix: "cl",
    selectorVisible: true,
  },
  "es-EC": {
    id: "es-EC",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Ecuador)",
    nativeName: "Ecuador",
    intlLocale: "es-EC",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-EC",
    ogLocale: "es_EC",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Ecuador",
    pathPrefix: "ec",
    selectorVisible: true,
  },
  "es-GT": {
    id: "es-GT",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Guatemala)",
    nativeName: "Guatemala",
    intlLocale: "es-GT",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-GT",
    ogLocale: "es_GT",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Guatemala",
    pathPrefix: "gt",
    selectorVisible: true,
  },
  "es-DO": {
    id: "es-DO",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Dominican Republic)",
    nativeName: "R. Dominicana",
    intlLocale: "es-DO",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-DO",
    ogLocale: "es_DO",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "R. Dominicana",
    pathPrefix: "do",
    selectorVisible: true,
  },
  "es-VE": {
    id: "es-VE",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Venezuela)",
    nativeName: "Venezuela",
    intlLocale: "es-VE",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-VE",
    ogLocale: "es_VE",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Venezuela",
    pathPrefix: "ve",
    selectorVisible: true,
  },
  "es-BO": {
    id: "es-BO",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Bolivia)",
    nativeName: "Bolivia",
    intlLocale: "es-BO",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-BO",
    ogLocale: "es_BO",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Bolivia",
    pathPrefix: "bo",
    selectorVisible: true,
  },
  "es-HN": {
    id: "es-HN",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Honduras)",
    nativeName: "Honduras",
    intlLocale: "es-HN",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-HN",
    ogLocale: "es_HN",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Honduras",
    pathPrefix: "hn",
    selectorVisible: true,
  },
  "es-SV": {
    id: "es-SV",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (El Salvador)",
    nativeName: "El Salvador",
    intlLocale: "es-SV",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-SV",
    ogLocale: "es_SV",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "El Salvador",
    pathPrefix: "sv",
    selectorVisible: true,
  },
  "es-NI": {
    id: "es-NI",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Nicaragua)",
    nativeName: "Nicaragua",
    intlLocale: "es-NI",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-NI",
    ogLocale: "es_NI",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Nicaragua",
    pathPrefix: "ni",
    selectorVisible: true,
  },
  "es-PY": {
    id: "es-PY",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Paraguay)",
    nativeName: "Paraguay",
    intlLocale: "es-PY",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-PY",
    ogLocale: "es_PY",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Paraguay",
    pathPrefix: "py",
    selectorVisible: true,
  },
  "es-CR": {
    id: "es-CR",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Costa Rica)",
    nativeName: "Costa Rica",
    intlLocale: "es-CR",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-CR",
    ogLocale: "es_CR",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Costa Rica",
    pathPrefix: "cr",
    selectorVisible: true,
  },
  "es-PA": {
    id: "es-PA",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Panama)",
    nativeName: "Panamá",
    intlLocale: "es-PA",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-PA",
    ogLocale: "es_PA",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Panamá",
    pathPrefix: "pa",
    selectorVisible: true,
  },
  // Future product locales — registered, not yet translated.
  // Note: bare `es` is intentionally absent; LatAm product Spanish is es-419.
  // Future Spain (es-ES) can register separately without inserting a stub into es-419 → en.
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

/** Locales selectable in UI — all enabled non-pseudo product locales (e.g. en, es-419). */
export const ACTIVE_LOCALE_IDS = Object.freeze(
  Object.values(LOCALE_REGISTRY)
    .filter((l) => l.enabled && !l.isPseudo && l.status === "enabled")
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
 * Locales shown in language switcher — enabled non-pseudo product locales
 * with selectorVisible !== false. Country locales use native country names;
 * es-419 stays as the inheritance base and is not listed.
 */
export function getSelectableLocales() {
  return Object.values(LOCALE_REGISTRY).filter(
    (l) => l.enabled && !l.isPseudo && l.selectorVisible !== false
  );
}

/**
 * Public URL path segment for a locale (e.g. es-MX → "mx", es-419 → "es-419").
 * @param {string|null|undefined} localeId
 * @returns {string|null}
 */
export function getPublicLocalePathPrefix(localeId) {
  const id = normalizeLocaleId(localeId);
  if (!id || id === DEFAULT_LOCALE) return null;
  const def = LOCALE_REGISTRY[id];
  if (!def) return null;
  return def.pathPrefix || def.id;
}

/**
 * Map a public path segment (e.g. "mx") to an internal locale id.
 * @param {string|null|undefined} segment
 * @returns {string|null}
 */
export function resolveLocaleIdFromPathPrefix(segment) {
  const lower = String(segment || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  if (!lower) return null;
  for (const def of Object.values(LOCALE_REGISTRY)) {
    if (!def.enabled) continue;
    if (def.pathPrefix && def.pathPrefix.toLowerCase() === lower) return def.id;
  }
  return null;
}

export {
  stripLocaleFromPath,
  stripLocalePrefix,
  withLocalePath,
  withLocalePrefix,
  getLocaleFromPath,
  isLocalizedPath,
  canonicalizeLocalizedPath,
  localizeHref,
  ensureLocalePrefixedUrl,
  buildLocalizedHref,
} from "./locale-path.js";
