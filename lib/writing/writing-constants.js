/**
 * Writing worksheet shared constants — English letters, paths, fonts, asset helpers.
 * @module lib/writing/writing-constants
 */

import { glyphAssetSlug } from "./glyph-asset-slugs.js";
import { createTranslator } from "../i18n/create-translator.js";

export { resolveWritingTraceAssetUrl, resolveWritingStrokeOrderAssetUrl } from "./writing-trace-asset-resolver.js";
export { glyphAssetSlug } from "./glyph-asset-slugs.js";

export const ENGLISH_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const ENGLISH_LOWER = "abcdefghijklmnopqrstuvwxyz".split("");

/** 16 prewriting path ids — W-201 through W-216. */
export const PREWRITING_PATHS = [
  "horizontal",
  "vertical",
  "waves",
  "circles",
  "zigzag",
  "loops",
  "curves",
  "spirals",
  "peaks",
  "valleys",
  "slants",
  "bridges",
  "mountains",
  "tunnels",
  "combo",
  "mixed_shapes",
];

/** @type {Record<string, string>} Locale keys under worksheets.* */
export const PREWRITING_PATH_I18N_KEYS = {
  horizontal: "writingPrewritingHorizontal",
  vertical: "writingPrewritingVertical",
  slants: "writingPrewritingDiagonal",
  bridges: "writingPrewritingBridges",
  waves: "writingPrewritingWaves",
  peaks: "writingPrewritingPeaks",
  circles: "writingPrewritingCircles",
  loops: "writingPrewritingLoops",
  curves: "writingPrewritingCurves",
  spirals: "writingPrewritingSpirals",
  zigzag: "writingPrewritingZigzag",
  valleys: "writingPrewritingValleys",
  mountains: "writingPrewritingMountains",
  tunnels: "writingPrewritingTunnels",
  combo: "writingPrewritingCombination",
  mixed_shapes: "writingPrewritingMixedShapes",
};

/** @deprecated Prefer prewritingPathLabelEn / PREWRITING_PATH_I18N_KEYS */
export const PREWRITING_PATH_LABELS_EN = PREWRITING_PATH_I18N_KEYS;

export const WRITING_FONT_FAMILY_EN_PRINT = "Noto Sans";
export const WRITING_FONT_FAMILY_EN_SCRIPT = "Patrick Hand";

/** @type {Record<"en", { print: string, script: string }>} */
export const WRITING_FONT_FAMILIES = {
  en: {
    print: WRITING_FONT_FAMILY_EN_PRINT,
    script: WRITING_FONT_FAMILY_EN_SCRIPT,
  },
};

const ASSET_ROOT = "/assets/writing";

/**
 * @param {"en-upper" | "en-lower" | "digits"} group
 * @param {string} glyphId
 * @returns {string}
 */
export function strokePathAssetPath(group, glyphId) {
  const slug = glyphAssetSlug(glyphId);
  return `${ASSET_ROOT}/stroke-path/${group}/${slug}.svg`;
}

/**
 * @param {"en-upper" | "en-lower" | "digits"} group
 * @param {string} glyphId
 * @returns {string}
 */
export function outlineGlyphAssetPath(group, glyphId) {
  const slug = glyphAssetSlug(glyphId);
  return `${ASSET_ROOT}/outline/${group}/${slug}.svg`;
}

/**
 * @param {string} pathId
 * @returns {string}
 */
export function prewritingPathAssetPath(pathId) {
  const safe = encodeURIComponent(String(pathId || "").trim());
  return `${ASSET_ROOT}/prewriting/${safe}.svg`;
}

/**
 * @param {string} illustrationId
 * @returns {string}
 */
export function illustrationAssetPath(illustrationId) {
  const safe = encodeURIComponent(String(illustrationId || "").trim());
  return `${ASSET_ROOT}/illustrations/${safe}.svg`;
}

export function fullTraceGlyphAssetPath(group, glyphId) {
  const slug = glyphAssetSlug(glyphId);
  return `${ASSET_ROOT}/full-trace/${group}/${slug}.svg`;
}

/**
 * @param {"en-upper" | "en-lower" | "digits"} group
 * @param {string} glyphId
 * @returns {string}
 */
export function strokeOrderAssetPath(group, glyphId) {
  const slug = glyphAssetSlug(glyphId);
  return `${ASSET_ROOT}/stroke-order/${group}/${slug}.json`;
}

/**
 * @param {"en"} language
 * @param {"print" | "script"} scriptStyle
 * @returns {string}
 */
export function writingFontFamilyFor(language, scriptStyle) {
  const bucket = WRITING_FONT_FAMILIES.en;
  return scriptStyle === "script" ? bucket.script : bucket.print;
}

/**
 * @param {string} letter
 * @returns {boolean}
 */
export function isEnglishLetter(letter) {
  const ch = String(letter || "").trim();
  return ENGLISH_UPPER.includes(ch) || ENGLISH_LOWER.includes(ch);
}

/**
 * @param {string} pathId
 * @returns {boolean}
 */
export function isPrewritingPathId(pathId) {
  return PREWRITING_PATHS.includes(String(pathId || "").trim());
}

/**
 * @param {string} pathId
 * @param {string} [locale]
 * @returns {string}
 */
export function prewritingPathLabelEn(pathId, locale = "en") {
  const key = String(pathId || "").trim();
  const i18nLeaf = PREWRITING_PATH_I18N_KEYS[key];
  if (!i18nLeaf) return key;
  const { t } = createTranslator(locale);
  return t(`worksheets.${i18nLeaf}`);
}

/**
 * @param {Record<string, { titleEn?: string, titleHe?: string }>} packs
 * @param {string} packId
 * @returns {string}
 */
export function wordPackLabelEn(packs, packId) {
  const pack = packs[packId];
  if (pack?.titleEn) return pack.titleEn;
  if (pack?.titleHe) return pack.titleHe;
  return packId;
}

/**
 * @param {"upper" | "lower" | "pairs"} letterCase
 * @param {string[]} characters
 * @returns {string[]}
 */
export function expandEnglishCharacters(letterCase, characters) {
  const base = characters.length ? characters : [];
  if (letterCase === "lower") {
    return base.map((c) => c.toLowerCase());
  }
  if (letterCase === "pairs") {
    return base.flatMap((c) => {
      const upper = c.toUpperCase();
      const lower = c.toLowerCase();
      return upper === lower ? [upper] : [upper, lower];
    });
  }
  return base.map((c) => c.toUpperCase());
}

import { ENGLISH_WORD_PACKS as EN_WORD_PACKS_RAW, ENGLISH_WORD_PACK_IDS } from "../../data/writing/word-packs.en.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";

/** Locale-resolved packs (en today; learning words stay English). */
export const ENGLISH_WORD_PACKS = resolveWritingWordPacks("en");
export { ENGLISH_WORD_PACK_IDS, EN_WORD_PACKS_RAW };

/** @typedef {string | { text?: string, word?: string, illustrationId?: string }} WordPackEntry */

/**
 * @param {Record<string, { words?: WordPackEntry[] } | WordPackEntry[]>} packs
 * @param {string} packId
 * @returns {WordPackEntry[]}
 */
export function wordPackEntries(packs, packId) {
  const pack = packs[packId];
  if (!pack) return [];
  if (Array.isArray(pack)) return pack;
  return Array.isArray(pack.words) ? pack.words : [];
}

/**
 * @param {WordPackEntry} entry
 * @returns {string}
 */
export function wordPackEntryText(entry) {
  if (typeof entry === "string") return entry;
  return entry?.text || entry?.word || "";
}

/**
 * @param {Record<string, { words?: WordPackEntry[] } | WordPackEntry[]>} packs
 * @param {string} packId
 * @returns {string[]}
 */
export function wordsFromPack(packs, packId) {
  return wordPackEntries(packs, packId).map(wordPackEntryText).filter(Boolean);
}

/**
 * @param {string} character
 * @param {import("./writing-worksheet-types.js").WritingWorksheetRequest} [request]
 * @returns {boolean}
 */
export function isTraceableGlyphChar(character, request) {
  const ch = String(character || "");
  if (!ch || /^\s$/.test(ch)) return false;
  if (/^\d$/.test(ch)) return true;
  if (/^[A-Za-z]$/.test(ch)) return true;
  if (request?.writingCategory === "english_letters") return isEnglishLetter(ch);
  return false;
}

/** English category labels for server-side catalog metadata — via worksheets.* keys. */
export const WRITING_CATEGORY_I18N_KEYS = Object.freeze({
  english_letters: "writingCategoryEnglishLetters",
  numbers: "writingCategoryNumbers",
  prewriting: "writingCategoryPrewriting",
  english_words: "writingCategoryEnglishWords",
  personal_text: "writingCategoryPersonalText",
  mixed: "writingCategoryMixed",
});

/**
 * @param {string} categoryKey
 * @param {string} [locale]
 */
export function writingCategoryLabelEn(categoryKey, locale = "en") {
  const leaf = WRITING_CATEGORY_I18N_KEYS[categoryKey];
  if (!leaf) return categoryKey;
  const { t } = createTranslator(locale);
  return t(`worksheets.${leaf}`);
}

/** @deprecated Prefer writingCategoryLabelEn */
export const WRITING_CATEGORY_LABELS_EN = new Proxy(
  {},
  {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      return writingCategoryLabelEn(prop);
    },
    ownKeys() {
      return Reflect.ownKeys(WRITING_CATEGORY_I18N_KEYS);
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (typeof prop !== "string" || !(prop in WRITING_CATEGORY_I18N_KEYS)) return undefined;
      return { configurable: true, enumerable: true, value: writingCategoryLabelEn(prop) };
    },
  }
);

/** @deprecated use WRITING_CATEGORY_LABELS_EN or i18n writingCategoryLabel */
export const WRITING_CATEGORY_LABELS_HE = WRITING_CATEGORY_LABELS_EN;
