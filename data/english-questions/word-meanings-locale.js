/**
 * Locale-aware meanings for English learning words.
 * English word ID stays stable; meaning follows instructionLocale.
 * Global: never return Hebrew. WORD_LISTS is an English ID catalog.
 * Spanish: country packs deep-merge onto es-419 (e.g. es-CO → es-419 → en word).
 * Portuguese Brazil: pt-BR → en.
 * Portugal: pt-PT → pt-BR → en.
 * Bare `pt` is NOT an alias of pt-BR (or pt-PT for meanings); English meanings.
 */

import { WORD_LISTS } from "./word-lists.js";
import { WORD_MEANINGS_EN } from "./word-meanings/en.js";
import { WORD_MEANINGS_ES_419 } from "./word-meanings/es-419.js";
import { WORD_MEANINGS_ES_CO } from "./word-meanings/es-CO.js";
import { WORD_MEANINGS_ES_GT } from "./word-meanings/es-GT.js";
import { WORD_MEANINGS_ES_BO } from "./word-meanings/es-BO.js";
import { WORD_MEANINGS_ES_SV } from "./word-meanings/es-SV.js";
import { WORD_MEANINGS_ES_PY } from "./word-meanings/es-PY.js";
import { WORD_MEANINGS_ES_PA } from "./word-meanings/es-PA.js";
import { WORD_MEANINGS_ES_UY } from "./word-meanings/es-UY.js";
import { WORD_MEANINGS_ES_ES } from "./word-meanings/es-ES.js";
import { WORD_MEANINGS_PT_BR } from "./word-meanings/pt-BR.js";
import { WORD_MEANINGS_PT_PT } from "./word-meanings/pt-PT.js";
import { WORD_MEANINGS_IT_IT } from "./word-meanings/it-IT.js";
import { WORD_MEANINGS_FR_FR } from "./word-meanings/fr-FR.js";
import { WORD_MEANINGS_NL_NL } from "./word-meanings/nl-NL.js";
import { WORD_MEANINGS_DE_DE } from "./word-meanings/de-DE.js";
import { WORD_MEANINGS_RU_RU } from "./word-meanings/ru-RU.js";
import { WORD_MEANINGS_AR_001 } from "./word-meanings/ar-001.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { deepMergeJson } from "../../lib/i18n/deep-merge.js";

/** @type {Record<string, Record<string, Record<string, string>>>} */
const MEANING_PACKS = {
  en: WORD_MEANINGS_EN,
  "es-419": WORD_MEANINGS_ES_419,
  "es-CO": WORD_MEANINGS_ES_CO,
  "es-GT": WORD_MEANINGS_ES_GT,
  "es-BO": WORD_MEANINGS_ES_BO,
  "es-SV": WORD_MEANINGS_ES_SV,
  "es-PY": WORD_MEANINGS_ES_PY,
  "es-PA": WORD_MEANINGS_ES_PA,
  "es-UY": WORD_MEANINGS_ES_UY,
  "es-ES": WORD_MEANINGS_ES_ES,
  "pt-BR": WORD_MEANINGS_PT_BR,
  "pt-PT": WORD_MEANINGS_PT_PT,
  "it-IT": WORD_MEANINGS_IT_IT,
  "fr-FR": WORD_MEANINGS_FR_FR,
  "nl-NL": WORD_MEANINGS_NL_NL,
  "de-DE": WORD_MEANINGS_DE_DE,
  "ru-RU": WORD_MEANINGS_RU_RU,
  "ar-001": WORD_MEANINGS_AR_001,
};

/**
 * @param {unknown} locale
 * @returns {string}
 */
function normalizeLocaleTag(locale) {
  return String(locale || "")
    .trim()
    .replace(/_/g, "-")
    .toLowerCase();
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isSpanishInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  if (!tag) return false;
  return tag === "es" || tag.startsWith("es-") || tag === "es419";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isPortugueseBrazilInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  if (!tag) return false;
  // Exact Brazil only — never bare `pt` or pt-PT.
  return tag === "pt-br";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isPortuguesePortugalInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  if (!tag) return false;
  // Exact Portugal only — never bare `pt` (not an auto-alias).
  return tag === "pt-pt";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isPortugueseAngolaInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "pt-ao";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isPortugueseMozambiqueInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "pt-mz";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isItalianInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "it-it";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isItalianSwitzerlandInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "it-ch";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchFranceInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "fr-fr";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchCoteIvoireInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "fr-ci";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchCanadaInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "fr-ca";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchBelgiumInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "fr-be";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchSwitzerlandInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "fr-ch";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchSenegalInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "fr-sn";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchCongoInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "fr-cd";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchCameroonInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "fr-cm";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchBeninInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "fr-bj";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchGuineaInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "fr-gn";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchTogoInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "fr-tg";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchGabonInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "fr-ga";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isFrenchCongoBrazzavilleInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "fr-cg";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isDutchNetherlandsInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "nl-nl";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isDutchBelgiumInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "nl-be";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isDutchSurinameInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "nl-sr";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isPortugueseCaboVerdeInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "pt-cv";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isGermanGermanyInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "de-de";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isGermanAustriaInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "de-at";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isGermanSwitzerlandInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "de-ch";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isRussianRussiaInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "ru-ru";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isArabicMasterInstructionLocale(locale) {
  const tag = normalizeLocaleTag(locale);
  return tag === "ar-001" || tag === "ar001";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isRussianKazakhstanInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "ru-kz";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isRussianUzbekistanInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "ru-uz";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isRussianKyrgyzstanInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "ru-kg";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isRussianBelarusInstructionLocale(locale) {
  return normalizeLocaleTag(locale) === "ru-by";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isLocalizedMeaningLocale(locale) {
  return (
    isSpanishInstructionLocale(locale) ||
    isPortugueseBrazilInstructionLocale(locale) ||
    isPortuguesePortugalInstructionLocale(locale) ||
    isPortugueseAngolaInstructionLocale(locale) ||
    isPortugueseMozambiqueInstructionLocale(locale) ||
    isPortugueseCaboVerdeInstructionLocale(locale) ||
    isItalianInstructionLocale(locale) ||
    isItalianSwitzerlandInstructionLocale(locale) ||
    isFrenchFranceInstructionLocale(locale) ||
    isFrenchCoteIvoireInstructionLocale(locale) ||
    isFrenchCanadaInstructionLocale(locale) ||
    isFrenchBelgiumInstructionLocale(locale) ||
    isFrenchSwitzerlandInstructionLocale(locale) ||
    isFrenchSenegalInstructionLocale(locale) ||
    isFrenchCongoInstructionLocale(locale) ||
    isFrenchCameroonInstructionLocale(locale) ||
    isFrenchBeninInstructionLocale(locale) ||
    isFrenchGuineaInstructionLocale(locale) ||
    isFrenchTogoInstructionLocale(locale) ||
    isFrenchGabonInstructionLocale(locale) ||
    isFrenchCongoBrazzavilleInstructionLocale(locale) ||
    isDutchNetherlandsInstructionLocale(locale) ||
    isDutchBelgiumInstructionLocale(locale) ||
    isDutchSurinameInstructionLocale(locale) ||
    isGermanGermanyInstructionLocale(locale) ||
    isGermanAustriaInstructionLocale(locale) ||
    isGermanSwitzerlandInstructionLocale(locale) ||
    isRussianRussiaInstructionLocale(locale) ||
    isRussianKazakhstanInstructionLocale(locale) ||
    isRussianUzbekistanInstructionLocale(locale) ||
    isRussianKyrgyzstanInstructionLocale(locale) ||
    isRussianBelarusInstructionLocale(locale) ||
    isArabicMasterInstructionLocale(locale)
  );
}

/**
 * Build merged meaning tables for a locale via fallback chain.
 * @param {string|null|undefined} instructionLocale
 * @returns {Record<string, Record<string, string>>}
 */
function getMergedMeaningPack(instructionLocale) {
  const tag = normalizeLocaleTag(instructionLocale);
  if (!isLocalizedMeaningLocale(tag)) {
    return MEANING_PACKS.en || {};
  }
  let chainLocale = tag;
  if (tag === "es" || tag === "es419") chainLocale = "es-419";
  else if (tag === "pt-br") chainLocale = "pt-BR";
  else if (tag === "pt-pt") chainLocale = "pt-PT";
  else if (tag === "pt-ao") chainLocale = "pt-AO";
  else if (tag === "pt-mz") chainLocale = "pt-MZ";
  else if (tag === "pt-cv") chainLocale = "pt-CV";
  else if (tag === "it-ch") chainLocale = "it-CH";
  else if (tag === "it-it") chainLocale = "it-IT";
  else if (tag === "fr-fr") chainLocale = "fr-FR";
  else if (tag === "fr-be") chainLocale = "fr-BE";
  else if (tag === "fr-ch") chainLocale = "fr-CH";
  else if (tag === "fr-sn") chainLocale = "fr-SN";
  else if (tag === "fr-cd") chainLocale = "fr-CD";
  else if (tag === "fr-cm") chainLocale = "fr-CM";
  else if (tag === "fr-bj") chainLocale = "fr-BJ";
  else if (tag === "fr-gn") chainLocale = "fr-GN";
  else if (tag === "fr-tg") chainLocale = "fr-TG";
  else if (tag === "fr-ga") chainLocale = "fr-GA";
  else if (tag === "fr-cg") chainLocale = "fr-CG";
  else if (tag === "fr-ci") chainLocale = "fr-CI";
  else if (tag === "fr-ca") chainLocale = "fr-CA";
  else if (tag === "nl-be") chainLocale = "nl-BE";
  else if (tag === "nl-sr") chainLocale = "nl-SR";
  else if (tag === "nl-nl") chainLocale = "nl-NL";
  else if (tag === "de-de") chainLocale = "de-DE";
  else if (tag === "de-at") chainLocale = "de-AT";
  else if (tag === "de-ch") chainLocale = "de-CH";
  else if (tag === "ru-kz") chainLocale = "ru-KZ";
  else if (tag === "ru-uz") chainLocale = "ru-UZ";
  else if (tag === "ru-kg") chainLocale = "ru-KG";
  else if (tag === "ru-by") chainLocale = "ru-BY";
  else if (tag === "ru-ru") chainLocale = "ru-RU";
  else if (tag === "ar-001" || tag === "ar001") chainLocale = "ar-001";
  else if (tag === "es-us") chainLocale = "es-US";
  else if (tag === "es-gq") chainLocale = "es-GQ";
  const chain = getLocaleFallbackChain(chainLocale);
  /** @type {Record<string, Record<string, string>>} */
  let merged = {};
  for (const loc of [...chain].reverse()) {
    const pack = MEANING_PACKS[loc];
    if (!pack) continue;
    merged = /** @type {Record<string, Record<string, string>>} */ (
      deepMergeJson(merged, pack)
    );
  }
  return merged;
}

/**
 * @param {Record<string, Record<string, string>>} pack
 * @param {string} listKey
 * @param {string} enWord
 * @returns {string|null}
 */
function meaningFromPack(pack, listKey, enWord) {
  const list = pack?.[listKey];
  if (!list || typeof list !== "object") return null;
  const value = list[enWord];
  return typeof value === "string" && value ? value : null;
}

/**
 * @param {string} enWord
 * @returns {string|null}
 */
function findListKeyForEnglishWord(enWord) {
  for (const key of Object.keys(WORD_LISTS || {})) {
    if (WORD_LISTS[key]?.[enWord] != null) return key;
  }
  return null;
}

/**
 * Resolve meaning for one English word ID.
 * @param {string} enWord
 * @param {{ listKey?: string, instructionLocale?: string }} [opts]
 * @returns {string}
 */
export function resolveEnglishWordMeaning(enWord, { listKey, instructionLocale } = {}) {
  const word = String(enWord || "").trim();
  if (!word) return "";

  const resolvedListKey = listKey || findListKeyForEnglishWord(word);
  const pack = getMergedMeaningPack(instructionLocale);

  if (isLocalizedMeaningLocale(instructionLocale)) {
    if (resolvedListKey) {
      const localized = meaningFromPack(pack, resolvedListKey, word);
      if (localized) return localized;
    }
    for (const key of Object.keys(pack || {})) {
      const localized = meaningFromPack(pack, key, word);
      if (localized) return localized;
    }
  }

  // en and unknown locales: English word itself
  return word;
}

export {
  isSpanishInstructionLocale,
  isPortugueseBrazilInstructionLocale,
  isPortuguesePortugalInstructionLocale,
};

/**
 * Return { [enWord]: meaning } for a list.
 * @param {string} listKey
 * @param {string} [instructionLocale]
 * @returns {Record<string, string>}
 */
export function getLocalizedWordList(listKey, instructionLocale) {
  const key = String(listKey || "").trim();
  const source = WORD_LISTS?.[key];
  if (!source || typeof source !== "object") return {};

  /** @type {Record<string, string>} */
  const out = {};
  for (const enWord of Object.keys(source)) {
    out[enWord] = resolveEnglishWordMeaning(enWord, {
      listKey: key,
      instructionLocale,
    });
  }
  return out;
}

/**
 * Flat map of all entries for a locale (for word board).
 * @param {string[]|null|undefined} listKeys
 * @param {string} [instructionLocale]
 * @returns {Record<string, string>}
 */
export function getLocalizedWordEntries(listKeys, instructionLocale) {
  const keys =
    Array.isArray(listKeys) && listKeys.length
      ? listKeys.map((k) => String(k || "").trim()).filter(Boolean)
      : Object.keys(WORD_LISTS || {});

  /** @type {Record<string, string>} */
  const out = {};
  for (const listKey of keys) {
    const list = getLocalizedWordList(listKey, instructionLocale);
    for (const [enWord, meaning] of Object.entries(list)) {
      if (!(enWord in out)) out[enWord] = meaning;
    }
  }
  return out;
}

/**
 * Given a stored meaning or English id, resolve display meaning for instructionLocale.
 * @param {string} value
 * @param {{ listKey?: string, enWordHint?: string, instructionLocale?: string }} opts
 * @returns {string}
 */
export function remapStoredMeaningToInstructionLocale(
  value,
  { listKey, enWordHint, instructionLocale } = {}
) {
  const raw = String(value || "").trim();
  const hint = String(enWordHint || "").trim();

  let enWord = hint || null;

  if (!enWord && raw) {
    if (listKey && WORD_LISTS?.[listKey]?.[raw] != null) {
      enWord = raw;
    } else if (!listKey) {
      for (const key of Object.keys(WORD_LISTS || {})) {
        if (WORD_LISTS[key]?.[raw] != null) {
          enWord = raw;
          listKey = key;
          break;
        }
      }
    }
  }

  if (!enWord) {
    return hint || raw;
  }

  return resolveEnglishWordMeaning(enWord, { listKey, instructionLocale });
}
