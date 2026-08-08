/**
 * Market-selector flag metadata — data-driven SoT keyed by registry locale id.
 * UI renders these identifiers; do not hardcode per-locale flags in components.
 *
 * kind "country" → local SVG asset under /assets/market-flags/{code}.svg
 * kind "icon"    → neutral in-app icon (Arabic Master / non-country markets)
 */

/** @typedef {{ kind: "country", code: string } | { kind: "icon", icon: "globe" }} SelectorFlagMeta */

/**
 * Locale id → flag/icon metadata. Every selectorVisible locale must appear exactly once.
 * @type {Readonly<Record<string, SelectorFlagMeta>>}
 */
export const LOCALE_SELECTOR_FLAG = Object.freeze({
  // Americas
  en: { kind: "country", code: "us" },
  "es-MX": { kind: "country", code: "mx" },
  "es-CO": { kind: "country", code: "co" },
  "es-AR": { kind: "country", code: "ar" },
  "es-PE": { kind: "country", code: "pe" },
  "es-CL": { kind: "country", code: "cl" },
  "es-EC": { kind: "country", code: "ec" },
  "es-GT": { kind: "country", code: "gt" },
  "es-DO": { kind: "country", code: "do" },
  "es-VE": { kind: "country", code: "ve" },
  "es-BO": { kind: "country", code: "bo" },
  "es-HN": { kind: "country", code: "hn" },
  "es-SV": { kind: "country", code: "sv" },
  "es-NI": { kind: "country", code: "ni" },
  "es-PY": { kind: "country", code: "py" },
  "es-CR": { kind: "country", code: "cr" },
  "es-PA": { kind: "country", code: "pa" },
  "es-UY": { kind: "country", code: "uy" },
  "es-CU": { kind: "country", code: "cu" },
  "es-PR": { kind: "country", code: "pr" },
  "pt-BR": { kind: "country", code: "br" },
  "en-CA": { kind: "country", code: "ca" },
  "fr-CA": { kind: "country", code: "ca" },
  "es-US": { kind: "country", code: "us" },
  "nl-SR": { kind: "country", code: "sr" },
  "en-JM": { kind: "country", code: "jm" },
  "en-TT": { kind: "country", code: "tt" },
  "en-BS": { kind: "country", code: "bs" },
  "en-GY": { kind: "country", code: "gy" },

  // Europe
  "es-ES": { kind: "country", code: "es" },
  "pt-PT": { kind: "country", code: "pt" },
  "it-IT": { kind: "country", code: "it" },
  "fr-FR": { kind: "country", code: "fr" },
  "nl-NL": { kind: "country", code: "nl" },
  "de-DE": { kind: "country", code: "de" },
  "de-AT": { kind: "country", code: "at" },
  "de-CH": { kind: "country", code: "ch" },
  "ru-RU": { kind: "country", code: "ru" },
  "en-IE": { kind: "country", code: "ie" },
  "en-GB": { kind: "country", code: "gb-eng" },
  "en-WLS": { kind: "country", code: "gb-wls" },
  "en-SCT": { kind: "country", code: "gb-sct" },
  "en-NIR": { kind: "country", code: "gb-nir" },
  "nl-BE": { kind: "country", code: "be" },
  "fr-BE": { kind: "country", code: "be" },
  "fr-CH": { kind: "country", code: "ch" },
  "it-CH": { kind: "country", code: "ch" },
  "ru-BY": { kind: "country", code: "by" },

  // Africa
  "ar-MA": { kind: "country", code: "ma" },
  "ar-DZ": { kind: "country", code: "dz" },
  "ar-TN": { kind: "country", code: "tn" },
  "pt-AO": { kind: "country", code: "ao" },
  "pt-MZ": { kind: "country", code: "mz" },
  "fr-CI": { kind: "country", code: "ci" },
  "en-ZA": { kind: "country", code: "za" },
  "en-NG": { kind: "country", code: "ng" },
  "en-KE": { kind: "country", code: "ke" },
  "en-GH": { kind: "country", code: "gh" },
  "fr-SN": { kind: "country", code: "sn" },
  "fr-CD": { kind: "country", code: "cd" },
  "en-RW": { kind: "country", code: "rw" },
  "fr-CM": { kind: "country", code: "cm" },
  "en-CM": { kind: "country", code: "cm" },
  "fr-BJ": { kind: "country", code: "bj" },
  "en-MU": { kind: "country", code: "mu" },
  "fr-GN": { kind: "country", code: "gn" },
  "fr-TG": { kind: "country", code: "tg" },
  "fr-GA": { kind: "country", code: "ga" },
  "fr-CG": { kind: "country", code: "cg" },
  "pt-CV": { kind: "country", code: "cv" },
  "es-GQ": { kind: "country", code: "gq" },
  "en-SL": { kind: "country", code: "sl" },
  "en-LR": { kind: "country", code: "lr" },
  "en-GM": { kind: "country", code: "gm" },

  // Middle East — Arabic Master is country-neutral (globe), not a national flag
  "ar-001": { kind: "icon", icon: "globe" },
  "ar-EG": { kind: "country", code: "eg" },
  "ar-SA": { kind: "country", code: "sa" },
  "ar-IQ": { kind: "country", code: "iq" },
  "ar-JO": { kind: "country", code: "jo" },
  "ar-AE": { kind: "country", code: "ae" },
  "ar-KW": { kind: "country", code: "kw" },
  "ar-QA": { kind: "country", code: "qa" },
  "ar-OM": { kind: "country", code: "om" },
  "ar-BH": { kind: "country", code: "bh" },

  // Asia
  "id-ID": { kind: "country", code: "id" },
  "en-SG": { kind: "country", code: "sg" },
  "en-PH": { kind: "country", code: "ph" },
  "en-IN": { kind: "country", code: "in" },
  "ru-KZ": { kind: "country", code: "kz" },
  "ru-UZ": { kind: "country", code: "uz" },
  "ru-KG": { kind: "country", code: "kg" },

  // Oceania
  "en-AU": { kind: "country", code: "au" },
  "en-NZ": { kind: "country", code: "nz" },
});

/**
 * @param {string|null|undefined} localeId
 * @returns {SelectorFlagMeta|null}
 */
export function getLocaleSelectorFlag(localeId) {
  const id = String(localeId || "").trim();
  if (!id) return null;
  return LOCALE_SELECTOR_FLAG[id] || null;
}

/**
 * Public path for a country flag asset, or null for icon-only entries.
 * @param {SelectorFlagMeta|null|undefined} meta
 * @returns {string|null}
 */
export function getMarketFlagAssetPath(meta) {
  if (!meta || meta.kind !== "country") return null;
  const code = String(meta.code || "")
    .trim()
    .toLowerCase();
  if (!/^[a-z]{2}(-[a-z]{3})?$/.test(code)) return null;
  return `/assets/market-flags/${code}.svg`;
}

/**
 * Unique country flag asset codes required by the selector (excludes icons).
 * @returns {string[]}
 */
export function listUniqueMarketFlagCodes() {
  /** @type {Set<string>} */
  const codes = new Set();
  for (const meta of Object.values(LOCALE_SELECTOR_FLAG)) {
    if (meta.kind === "country" && meta.code) {
      codes.add(String(meta.code).toLowerCase());
    }
  }
  return [...codes].sort();
}
