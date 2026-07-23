/**
 * Writing worksheet shared constants — English letters, paths, fonts, asset helpers.
 * @module lib/writing/writing-constants
 */

import { glyphAssetSlug } from "./glyph-asset-slugs.js";

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

/** @type {Record<string, string>} */
export const PREWRITING_PATH_LABELS_EN = {
  horizontal: "Horizontal lines",
  vertical: "Vertical lines",
  slants: "Diagonal lines",
  bridges: "Bridges",
  waves: "Waves",
  peaks: "Peaks",
  circles: "Circles",
  loops: "Loops",
  curves: "Curves",
  spirals: "Spirals",
  zigzag: "Zigzag",
  valleys: "Valleys",
  mountains: "Mountains",
  tunnels: "Tunnels",
  combo: "Combination",
  mixed_shapes: "Mixed shapes",
};

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
 * @returns {string}
 */
export function prewritingPathLabelEn(pathId) {
  const key = String(pathId || "").trim();
  return PREWRITING_PATH_LABELS_EN[key] || key;
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

export const ENGLISH_WORD_PACKS = EN_WORD_PACKS_RAW;
export { ENGLISH_WORD_PACK_IDS };

/** English category labels for server-side catalog metadata. */
export const WRITING_CATEGORY_LABELS_EN = {
  english_letters: "English letters",
  numbers: "Numbers",
  prewriting: "Pre-writing",
  english_words: "English words",
  personal_text: "Name & personal text",
  mixed: "Mixed practice",
};

/** @deprecated use WRITING_CATEGORY_LABELS_EN or i18n writingCategoryLabel */
export const WRITING_CATEGORY_LABELS_HE = WRITING_CATEGORY_LABELS_EN;
