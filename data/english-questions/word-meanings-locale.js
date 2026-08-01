/**
 * Locale-aware meanings for English learning words.
 * English word ID stays stable; meaning follows instructionLocale.
 * Global: never return Hebrew. WORD_LISTS is an English ID catalog.
 * Spanish: country packs deep-merge onto es-419 (e.g. es-CO → es-419 → en word).
 * Portuguese Brazil: pt-BR → en.
 * Bare `pt` is NOT an alias of pt-BR (reserved for future pt-PT); it follows
 * registry resolution (currently disabled → English meanings).
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
  // Exact Brazil only — never bare `pt` or future `pt-PT`.
  return tag === "pt-br";
}

/**
 * @param {unknown} locale
 * @returns {boolean}
 */
function isLocalizedMeaningLocale(locale) {
  return isSpanishInstructionLocale(locale) || isPortugueseBrazilInstructionLocale(locale);
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

export { isSpanishInstructionLocale, isPortugueseBrazilInstructionLocale };

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
