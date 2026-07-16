/**
 * Global locale registry — default English, dynamic direction, future locales reserved.
 */

/** @typedef {"ltr"|"rtl"} TextDirection */

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   direction: TextDirection,
 *   enabled: boolean,
 *   isPseudo?: boolean,
 *   fonts?: string[],
 * }} LocaleDefinition
 */

/** @type {Readonly<Record<string, LocaleDefinition>>} */
export const LOCALE_REGISTRY = Object.freeze({
  en: {
    id: "en",
    label: "English",
    direction: "ltr",
    enabled: true,
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
  },
  "en-XA": {
    id: "en-XA",
    label: "English (pseudo long)",
    direction: "ltr",
    enabled: true,
    isPseudo: true,
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
  },
  "ar-XB": {
    id: "ar-XB",
    label: "Arabic (pseudo RTL)",
    direction: "rtl",
    enabled: false,
    isPseudo: true,
    fonts: ["Noto Naskh Arabic", "Tahoma", "sans-serif"],
  },
  // Future product locales — registered, not yet translated.
  es: { id: "es", label: "Español", direction: "ltr", enabled: false },
  fr: { id: "fr", label: "Français", direction: "ltr", enabled: false },
  de: { id: "de", label: "Deutsch", direction: "ltr", enabled: false },
  pt: { id: "pt", label: "Português", direction: "ltr", enabled: false },
  it: { id: "it", label: "Italiano", direction: "ltr", enabled: false },
  nl: { id: "nl", label: "Nederlands", direction: "ltr", enabled: false },
  pl: { id: "pl", label: "Polski", direction: "ltr", enabled: false },
  ru: { id: "ru", label: "Русский", direction: "ltr", enabled: false },
  ar: { id: "ar", label: "العربية", direction: "rtl", enabled: false },
  fa: { id: "fa", label: "فارسی", direction: "rtl", enabled: false },
  ur: { id: "ur", label: "اردو", direction: "rtl", enabled: false },
  tr: { id: "tr", label: "Türkçe", direction: "ltr", enabled: false },
  zh: { id: "zh", label: "中文", direction: "ltr", enabled: false },
  ja: { id: "ja", label: "日本語", direction: "ltr", enabled: false },
  ko: { id: "ko", label: "한국어", direction: "ltr", enabled: false },
});

export const DEFAULT_LOCALE = "en";
export const FALLBACK_LOCALE = "en";

/** Cookie / query param name for interface locale. */
export const LOCALE_COOKIE_NAME = "lk_global_locale";

/** Locales that may be selected in UI / QA today. */
export const ACTIVE_LOCALE_IDS = Object.freeze(
  Object.values(LOCALE_REGISTRY)
    .filter((l) => l.enabled)
    .map((l) => l.id)
);

/**
 * @param {string|null|undefined} raw
 * @returns {LocaleDefinition}
 */
export function resolveLocaleDefinition(raw) {
  const id = String(raw || "")
    .trim()
    .replace(/_/g, "-");
  if (id && LOCALE_REGISTRY[id]?.enabled) return LOCALE_REGISTRY[id];
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
 * Future locale path prefix: /es, /fr, /ar — never /he.
 * @param {string} pathname
 */
export function stripLocalePrefix(pathname) {
  const p = String(pathname || "/");
  const m = p.match(/^\/([a-z]{2}(?:-[A-Za-z]{2,4})?)(?=\/|$)/);
  if (!m) return { locale: null, pathname: p || "/" };
  const candidate = m[1];
  if (candidate === "he") return { locale: null, pathname: p || "/" };
  if (!LOCALE_REGISTRY[candidate]) return { locale: null, pathname: p || "/" };
  const rest = p.slice(m[0].length) || "/";
  return { locale: candidate, pathname: rest.startsWith("/") ? rest : `/${rest}` };
}

/**
 * @param {string} localeId
 * @param {string} pathname absolute app path without locale prefix
 */
export function withLocalePrefix(localeId, pathname) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!localeId || localeId === DEFAULT_LOCALE) return path;
  if (!LOCALE_REGISTRY[localeId] || localeId === "he") return path;
  if (path === "/") return `/${localeId}`;
  return `/${localeId}${path}`;
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
