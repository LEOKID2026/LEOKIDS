/**
 * Locale-aware meanings for English learning words.
 * English word ID stays stable; meaning follows instructionLocale.
 * Global: never return Hebrew. WORD_LISTS is an English ID catalog.
 * Spanish (es / es-419 / …): word-meanings/es-419.js pack.
 * English and unknown locales: the English word itself.
 */

import { WORD_LISTS } from "./word-lists.js";
import { WORD_MEANINGS_ES_419 } from "./word-meanings/es-419.js";

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
 * @param {string} listKey
 * @param {string} enWord
 * @returns {string|null}
 */
function spanishMeaningFromPack(listKey, enWord) {
  const list = WORD_MEANINGS_ES_419?.[listKey];
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

  if (isSpanishInstructionLocale(instructionLocale)) {
    if (resolvedListKey) {
      const es = spanishMeaningFromPack(resolvedListKey, word);
      if (es) return es;
    }
    for (const key of Object.keys(WORD_MEANINGS_ES_419 || {})) {
      const es = spanishMeaningFromPack(key, word);
      if (es) return es;
    }
  }

  // en and unknown locales: English word itself
  return word;
}

export { isSpanishInstructionLocale };

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
