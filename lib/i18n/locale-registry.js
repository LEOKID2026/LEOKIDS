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
    aliases: ["en-US"],
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
  "es-UY": {
    id: "es-UY",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Uruguay)",
    nativeName: "Uruguay",
    intlLocale: "es-UY",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-UY",
    ogLocale: "es_UY",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Uruguay",
    pathPrefix: "uy",
    selectorVisible: true,
  },
  "es-CU": {
    id: "es-CU",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Cuba)",
    nativeName: "Cuba",
    intlLocale: "es-CU",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-CU",
    ogLocale: "es_CU",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Cuba",
    pathPrefix: "cu",
    selectorVisible: true,
  },
  "es-PR": {
    id: "es-PR",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Puerto Rico)",
    nativeName: "Puerto Rico",
    intlLocale: "es-PR",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-PR",
    ogLocale: "es_PR",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Puerto Rico",
    pathPrefix: "pr",
    selectorVisible: true,
  },
  "es-ES": {
    id: "es-ES",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (Spain)",
    nativeName: "España",
    intlLocale: "es-ES",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-ES",
    ogLocale: "es_ES",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "España",
    // Public URL is /es (not /es-ES). Bare language tag `es` stays unregistered.
    pathPrefix: "es",
    selectorVisible: true,
  },
  /**
   * Brazilian Portuguese — full language layer (not a sparse country overlay).
   * Public path /br; selector label "Brasil". Portugal (pt-PT) inherits: pt-PT → pt-BR → en.
   */
  "pt-BR": {
    id: "pt-BR",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Portuguese (Brazil)",
    nativeName: "Brasil",
    intlLocale: "pt-BR",
    fallbackLocale: "en",
    textToSpeechLocale: "pt-BR",
    ogLocale: "pt_BR",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Brasil",
    pathPrefix: "br",
    selectorVisible: true,
  },
  /**
   * European Portuguese (Portugal) — full layer on pt-BR.
   * Public path /pt (not /pt-PT). Bare `pt` is not an alias of pt-BR.
   */
  "pt-PT": {
    id: "pt-PT",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Portuguese (Portugal)",
    nativeName: "Portugal",
    intlLocale: "pt-PT",
    fallbackLocale: "pt-BR",
    textToSpeechLocale: "pt-PT",
    ogLocale: "pt_PT",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Portugal",
    pathPrefix: "pt",
    selectorVisible: true,
  },
  /**
   * Portuguese (Angola) — sparse country overlay on pt-PT.
   * Public path /ao (not /pt-AO). Chain: pt-AO → pt-PT → pt-BR → en.
   */
  "pt-AO": {
    id: "pt-AO",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Portuguese (Angola)",
    nativeName: "Angola",
    intlLocale: "pt-AO",
    fallbackLocale: "pt-PT",
    textToSpeechLocale: "pt-AO",
    ogLocale: "pt_AO",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Angola",
    pathPrefix: "ao",
    selectorVisible: true,
  },
  /**
   * Portuguese (Mozambique) — sparse country overlay on pt-PT.
   * Public path /mz (not /pt-MZ). Chain: pt-MZ → pt-PT → pt-BR → en.
   */
  "pt-MZ": {
    id: "pt-MZ",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Portuguese (Mozambique)",
    nativeName: "Mozambique",
    intlLocale: "pt-MZ",
    fallbackLocale: "pt-PT",
    textToSpeechLocale: "pt-MZ",
    ogLocale: "pt_MZ",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Mozambique",
    pathPrefix: "mz",
    selectorVisible: true,
  },
  /**
   * Italian (Italy) — full language layer. Public path /it (not /it-IT).
   * Bare `it` is not a registered alias.
   */
  "it-IT": {
    id: "it-IT",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Italian (Italy)",
    nativeName: "Italy",
    intlLocale: "it-IT",
    fallbackLocale: "en",
    textToSpeechLocale: "it-IT",
    ogLocale: "it_IT",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Italy",
    pathPrefix: "it",
    selectorVisible: true,
  },
  /**
   * French (France) — full language layer. Public path /fr (not /fr-FR).
   * Bare `fr` is not a registered alias.
   */
  "fr-FR": {
    id: "fr-FR",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "French (France)",
    nativeName: "France",
    intlLocale: "fr-FR",
    fallbackLocale: "en",
    textToSpeechLocale: "fr-FR",
    ogLocale: "fr_FR",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "France",
    pathPrefix: "fr",
    selectorVisible: true,
  },
  /**
   * French (Côte d’Ivoire) — sparse country overlay on fr-FR.
   * Public path /ci (not /fr-CI). Chain: fr-CI → fr-FR → en.
   */
  "fr-CI": {
    id: "fr-CI",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "French (Côte d’Ivoire)",
    nativeName: "Côte d’Ivoire",
    intlLocale: "fr-CI",
    fallbackLocale: "fr-FR",
    textToSpeechLocale: "fr-CI",
    ogLocale: "fr_CI",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Côte d’Ivoire",
    pathPrefix: "ci",
    selectorVisible: true,
  },
  /**
   * French (Canada) — sparse country overlay on fr-FR.
   * Public path /ca-fr (not /fr-CA). Chain: fr-CA → fr-FR → en.
   * Distinct from English Canada (en-CA /ca).
   */
  "fr-CA": {
    id: "fr-CA",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "French (Canada)",
    nativeName: "Canada-fr",
    intlLocale: "fr-CA",
    fallbackLocale: "fr-FR",
    textToSpeechLocale: "fr-CA",
    ogLocale: "fr_CA",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Canada-fr",
    pathPrefix: "ca-fr",
    selectorVisible: true,
  },
  /**
   * Dutch (Netherlands) — full language layer. Public path /nl (not /nl-NL).
   * Bare `nl` is not a registered alias.
   */
  "nl-NL": {
    id: "nl-NL",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Dutch (Netherlands)",
    nativeName: "Netherlands",
    intlLocale: "nl-NL",
    fallbackLocale: "en",
    textToSpeechLocale: "nl-NL",
    ogLocale: "nl_NL",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Netherlands",
    pathPrefix: "nl",
    selectorVisible: true,
  },
  /**
   * German (Germany) — full language layer. Public path /de (not /de-DE).
   * Bare `de` is not a registered alias.
   */
  "de-DE": {
    id: "de-DE",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "German (Germany)",
    nativeName: "Germany",
    intlLocale: "de-DE",
    fallbackLocale: "en",
    textToSpeechLocale: "de-DE",
    ogLocale: "de_DE",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Germany",
    pathPrefix: "de",
    selectorVisible: true,
  },
  /**
   * German (Austria) — sparse country overlay on de-DE.
   * Public path /at (not /de-AT). Chain: de-AT → de-DE → en.
   */
  "de-AT": {
    id: "de-AT",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "German (Austria)",
    nativeName: "Austria",
    intlLocale: "de-AT",
    fallbackLocale: "de-DE",
    textToSpeechLocale: "de-AT",
    ogLocale: "de_AT",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Austria",
    pathPrefix: "at",
    selectorVisible: true,
  },
  /**
   * German (Switzerland) — sparse country overlay on de-DE (Swiss Standard German).
   * Public path /ch-de (not /de-CH). Chain: de-CH → de-DE → en.
   */
  "de-CH": {
    id: "de-CH",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "German (Switzerland)",
    nativeName: "Switzerland-de",
    intlLocale: "de-CH",
    fallbackLocale: "de-DE",
    textToSpeechLocale: "de-CH",
    ogLocale: "de_CH",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Switzerland-de",
    pathPrefix: "ch-de",
    selectorVisible: true,
  },
  /**
   * Russian (Russia) — full language layer. Public path /ru (not /ru-RU).
   * Bare `ru` is not a registered alias.
   */
  "ru-RU": {
    id: "ru-RU",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Russian (Russia)",
    nativeName: "Russia",
    intlLocale: "ru-RU",
    fallbackLocale: "en",
    textToSpeechLocale: "ru-RU",
    ogLocale: "ru_RU",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Russia",
    pathPrefix: "ru",
    selectorVisible: true,
  },
  /**
   * English country layers — sparse overlays on `en` (not Commonwealth base locales).
   * Public paths: /au /nz /ie /eng. Selector shows country names only.
   */
  "en-AU": {
    id: "en-AU",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Australia)",
    nativeName: "Australia",
    intlLocale: "en-AU",
    fallbackLocale: "en",
    textToSpeechLocale: "en-AU",
    ogLocale: "en_AU",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Australia",
    pathPrefix: "au",
    selectorVisible: true,
  },
  "en-NZ": {
    id: "en-NZ",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (New Zealand)",
    nativeName: "New Zealand",
    intlLocale: "en-NZ",
    fallbackLocale: "en",
    textToSpeechLocale: "en-NZ",
    ogLocale: "en_NZ",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "New Zealand",
    pathPrefix: "nz",
    selectorVisible: true,
  },
  "en-IE": {
    id: "en-IE",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Ireland)",
    nativeName: "Ireland",
    intlLocale: "en-IE",
    fallbackLocale: "en",
    textToSpeechLocale: "en-IE",
    ogLocale: "en_IE",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Ireland",
    pathPrefix: "ie",
    selectorVisible: true,
  },
  /**
   * England — en-GB serves England only (not United Kingdom umbrella).
   * Wales (en-WLS) inherits British-English chrome from en-GB with no local overlays.
   */
  "en-GB": {
    id: "en-GB",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (England)",
    nativeName: "England",
    intlLocale: "en-GB",
    fallbackLocale: "en",
    textToSpeechLocale: "en-GB",
    ogLocale: "en_GB",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "England",
    pathPrefix: "eng",
    selectorVisible: true,
  },
  "en-CA": {
    id: "en-CA",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Canada)",
    nativeName: "Canada-en",
    intlLocale: "en-CA",
    fallbackLocale: "en",
    textToSpeechLocale: "en-CA",
    ogLocale: "en_CA",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Canada-en",
    pathPrefix: "ca",
    selectorVisible: true,
  },
  "en-SG": {
    id: "en-SG",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Singapore)",
    nativeName: "Singapore",
    intlLocale: "en-SG",
    fallbackLocale: "en",
    textToSpeechLocale: "en-SG",
    ogLocale: "en_SG",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Singapore",
    pathPrefix: "sg",
    selectorVisible: true,
  },
  "en-ZA": {
    id: "en-ZA",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (South Africa)",
    nativeName: "South Africa",
    intlLocale: "en-ZA",
    fallbackLocale: "en",
    textToSpeechLocale: "en-ZA",
    ogLocale: "en_ZA",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "South Africa",
    pathPrefix: "za",
    selectorVisible: true,
  },
  /**
   * English (Nigeria) — sparse country overlay on en.
   * Public path /ng (not /en-NG). Chain: en-NG → en.
   */
  "en-NG": {
    id: "en-NG",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Nigeria)",
    nativeName: "Nigeria",
    intlLocale: "en-NG",
    fallbackLocale: "en",
    textToSpeechLocale: "en-NG",
    ogLocale: "en_NG",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Nigeria",
    pathPrefix: "ng",
    selectorVisible: true,
  },
  /**
   * English (Kenya) — sparse country overlay on en.
   * Public path /ke (not /en-KE). Chain: en-KE → en.
   */
  "en-KE": {
    id: "en-KE",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Kenya)",
    nativeName: "Kenya",
    intlLocale: "en-KE",
    fallbackLocale: "en",
    textToSpeechLocale: "en-KE",
    ogLocale: "en_KE",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Kenya",
    pathPrefix: "ke",
    selectorVisible: true,
  },
  /**
   * Wales — zero-content locale. Public /wls. Fallback: en-WLS → en-GB → en.
   * No locales/, content-packs/, or Help overlays (inherits England/British chrome).
   */
  "en-WLS": {
    id: "en-WLS",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Wales)",
    nativeName: "Wales",
    intlLocale: "en-GB",
    fallbackLocale: "en-GB",
    textToSpeechLocale: "en-GB",
    ogLocale: "en_GB",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Wales",
    pathPrefix: "wls",
    selectorVisible: true,
  },
  /**
   * Scotland — sparse overlays. Public /sct. Fallback: en-SCT → en-GB → en.
   * Grades: Primary 2–Primary 7 (internal grade1–grade6).
   */
  "en-SCT": {
    id: "en-SCT",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Scotland)",
    nativeName: "Scotland",
    intlLocale: "en-GB",
    fallbackLocale: "en-GB",
    textToSpeechLocale: "en-GB",
    ogLocale: "en_GB",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Scotland",
    pathPrefix: "sct",
    selectorVisible: true,
  },
  /**
   * Northern Ireland — sparse overlays. Public /nir. Fallback: en-NIR → en-GB → en.
   * Grades: Primary 2–Primary 7 (internal grade1–grade6).
   */
  "en-NIR": {
    id: "en-NIR",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Northern Ireland)",
    nativeName: "Northern Ireland",
    intlLocale: "en-GB",
    fallbackLocale: "en-GB",
    textToSpeechLocale: "en-GB",
    ogLocale: "en_GB",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Northern Ireland",
    pathPrefix: "nir",
    selectorVisible: true,
  },
  /**
   * Philippines — sparse chrome overlays only. Public /ph. Fallback: en-PH → en.
   * No content-packs / Help / word-meanings (inherit en). Grades: Grade 1–6.
   */
  "en-PH": {
    id: "en-PH",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Philippines)",
    nativeName: "Philippines",
    intlLocale: "en-PH",
    fallbackLocale: "en",
    textToSpeechLocale: "en-PH",
    ogLocale: "en_PH",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Philippines",
    pathPrefix: "ph",
    selectorVisible: true,
  },
  /**
   * Dutch (Belgium) — sparse country overlay on nl-NL (Flemish Standard Dutch).
   * Public path /be-nl (not /nl-BE). Chain: nl-BE → nl-NL → en.
   * Distinct from Belgium-fr (fr-BE /be-fr).
   */
  "nl-BE": {
    id: "nl-BE",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Dutch (Belgium)",
    nativeName: "Belgium-nl",
    intlLocale: "nl-BE",
    fallbackLocale: "nl-NL",
    textToSpeechLocale: "nl-BE",
    ogLocale: "nl_BE",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Belgium-nl",
    pathPrefix: "be-nl",
    selectorVisible: true,
  },
  /**
   * French (Belgium) — sparse country overlay on fr-FR.
   * Public path /be-fr (not /fr-BE). Chain: fr-BE → fr-FR → en.
   * Distinct from Belgium-nl (nl-BE /be-nl).
   */
  "fr-BE": {
    id: "fr-BE",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "French (Belgium)",
    nativeName: "Belgium-fr",
    intlLocale: "fr-BE",
    fallbackLocale: "fr-FR",
    textToSpeechLocale: "fr-BE",
    ogLocale: "fr_BE",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Belgium-fr",
    pathPrefix: "be-fr",
    selectorVisible: true,
  },
  /**
   * French (Switzerland) — sparse country overlay on fr-FR.
   * Public path /ch-fr (not /fr-CH). Chain: fr-CH → fr-FR → en.
   * Distinct from Switzerland-de (/ch-de) and Switzerland-it (/ch-it).
   */
  "fr-CH": {
    id: "fr-CH",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "French (Switzerland)",
    nativeName: "Switzerland-fr",
    intlLocale: "fr-CH",
    fallbackLocale: "fr-FR",
    textToSpeechLocale: "fr-CH",
    ogLocale: "fr_CH",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Switzerland-fr",
    pathPrefix: "ch-fr",
    selectorVisible: true,
  },
  /**
   * Italian (Switzerland) — sparse country overlay on it-IT.
   * Public path /ch-it (not /it-CH). Chain: it-CH → it-IT → en.
   * Distinct from Switzerland-de (/ch-de) and Switzerland-fr (/ch-fr).
   */
  "it-CH": {
    id: "it-CH",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Italian (Switzerland)",
    nativeName: "Switzerland-it",
    intlLocale: "it-CH",
    fallbackLocale: "it-IT",
    textToSpeechLocale: "it-CH",
    ogLocale: "it_CH",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Switzerland-it",
    pathPrefix: "ch-it",
    selectorVisible: true,
  },
  /**
   * English (India) — sparse country overlay on en.
   * Public path /in-en (not /en-IN). Bare /in does not guess a language.
   * Chain: en-IN → en.
   */
  "en-IN": {
    id: "en-IN",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (India)",
    nativeName: "India-en",
    intlLocale: "en-IN",
    fallbackLocale: "en",
    textToSpeechLocale: "en-IN",
    ogLocale: "en_IN",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "India-en",
    pathPrefix: "in-en",
    selectorVisible: true,
  },
  /**
   * English (Ghana) — sparse country overlay on en.
   * Public path /gh (not /en-GH). Chain: en-GH → en.
   */
  "en-GH": {
    id: "en-GH",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Ghana)",
    nativeName: "Ghana",
    intlLocale: "en-GH",
    fallbackLocale: "en",
    textToSpeechLocale: "en-GH",
    ogLocale: "en_GH",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Ghana",
    pathPrefix: "gh",
    selectorVisible: true,
  },
  /**
   * French (Senegal) — sparse country overlay on fr-FR.
   * Public path /sn (not /fr-SN). Chain: fr-SN → fr-FR → en.
   */
  "fr-SN": {
    id: "fr-SN",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "French (Senegal)",
    nativeName: "Senegal",
    intlLocale: "fr-SN",
    fallbackLocale: "fr-FR",
    textToSpeechLocale: "fr-SN",
    ogLocale: "fr_SN",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Senegal",
    pathPrefix: "sn",
    selectorVisible: true,
  },
  /**
   * French (DR Congo) — sparse country overlay on fr-FR.
   * Public path /cd (not /fr-CD). Chain: fr-CD → fr-FR → en.
   */
  "fr-CD": {
    id: "fr-CD",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "French (DR Congo)",
    nativeName: "DR Congo",
    intlLocale: "fr-CD",
    fallbackLocale: "fr-FR",
    textToSpeechLocale: "fr-CD",
    ogLocale: "fr_CD",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "DR Congo",
    pathPrefix: "cd",
    selectorVisible: true,
  },
  /**
   * Spanish (USA) — sparse country overlay on es-419.
   * Public path /us-es (not /es-US). Bare /us does not guess a language.
   * Chain: es-US → es-419 → en.
   */
  "es-US": {
    id: "es-US",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Spanish (USA)",
    nativeName: "USA-es",
    intlLocale: "es-US",
    fallbackLocale: "es-419",
    textToSpeechLocale: "es-US",
    ogLocale: "es_US",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "USA-es",
    pathPrefix: "us-es",
    selectorVisible: true,
  },
  /**
   * Russian (Kazakhstan) — sparse country overlay on ru-RU.
   * Public path /kz-ru (not /ru-KZ). Bare /kz does not guess a language.
   * Chain: ru-KZ → ru-RU → en.
   */
  "ru-KZ": {
    id: "ru-KZ",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Russian (Kazakhstan)",
    nativeName: "Kazakhstan-ru",
    intlLocale: "ru-KZ",
    fallbackLocale: "ru-RU",
    textToSpeechLocale: "ru-KZ",
    ogLocale: "ru_KZ",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Kazakhstan-ru",
    pathPrefix: "kz-ru",
    selectorVisible: true,
  },
  /**
   * Russian (Uzbekistan) — sparse country overlay on ru-RU.
   * Public path /uz-ru (not /ru-UZ). Bare /uz does not guess a language.
   * Chain: ru-UZ → ru-RU → en.
   */
  "ru-UZ": {
    id: "ru-UZ",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Russian (Uzbekistan)",
    nativeName: "Uzbekistan-ru",
    intlLocale: "ru-UZ",
    fallbackLocale: "ru-RU",
    textToSpeechLocale: "ru-UZ",
    ogLocale: "ru_UZ",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Uzbekistan-ru",
    pathPrefix: "uz-ru",
    selectorVisible: true,
  },
  /**
   * Russian (Kyrgyzstan) — sparse country overlay on ru-RU.
   * Public path /kg-ru (not /ru-KG). Bare /kg does not guess a language.
   * Chain: ru-KG → ru-RU → en.
   */
  "ru-KG": {
    id: "ru-KG",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Russian (Kyrgyzstan)",
    nativeName: "Kyrgyzstan-ru",
    intlLocale: "ru-KG",
    fallbackLocale: "ru-RU",
    textToSpeechLocale: "ru-KG",
    ogLocale: "ru_KG",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Kyrgyzstan-ru",
    pathPrefix: "kg-ru",
    selectorVisible: true,
  },
  /**
   * Russian (Belarus) — sparse country overlay on ru-RU.
   * Public path /by-ru (not /ru-BY). Bare /by does not guess a language.
   * Chain: ru-BY → ru-RU → en.
   */
  "ru-BY": {
    id: "ru-BY",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "Russian (Belarus)",
    nativeName: "Belarus-ru",
    intlLocale: "ru-BY",
    fallbackLocale: "ru-RU",
    textToSpeechLocale: "ru-BY",
    ogLocale: "ru_BY",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Belarus-ru",
    pathPrefix: "by-ru",
    selectorVisible: true,
  },
  /**
   * English (Rwanda) — sparse country overlay on en.
   * Public path /rw-en (not /en-RW). Bare /rw does not guess a language.
   * Chain: en-RW → en.
   */
  "en-RW": {
    id: "en-RW",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "English (Rwanda)",
    nativeName: "Rwanda-en",
    intlLocale: "en-RW",
    fallbackLocale: "en",
    textToSpeechLocale: "en-RW",
    ogLocale: "en_RW",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Rwanda-en",
    pathPrefix: "rw-en",
    selectorVisible: true,
  },
  /**
   * French (Cameroon) — sparse country overlay on fr-FR.
   * Public path /cm-fr (not /fr-CM). Bare /cm does not guess a language.
   * Chain: fr-CM → fr-FR → en.
   */
  "fr-CM": {
    id: "fr-CM",
    enabled: true,
    status: "enabled",
    direction: "ltr",
    displayName: "French (Cameroon)",
    nativeName: "Cameroon-fr",
    intlLocale: "fr-CM",
    fallbackLocale: "fr-FR",
    textToSpeechLocale: "fr-CM",
    ogLocale: "fr_CM",
    aliases: [],
    defaultMarket: "global",
    defaultCurriculum: "international",
    fonts: ["Segoe UI", "Noto Sans", "sans-serif"],
    label: "Cameroon-fr",
    pathPrefix: "cm-fr",
    selectorVisible: true,
  },
  // Future product locales — registered, not yet translated.
  // Note: bare `es` / `pt` / `it` / `fr` / `nl` / `de` / `ru` are intentionally absent as locale ids;
  // Spain/Portugal/Italy/France/Netherlands/Germany/Russia use pathPrefix → regional locales.
  pl: mkDisabled("pl", "Polski", "Polski", "ltr", "pl-PL", "pl_PL"),
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
