/**
 * Public writing demo allowlist — English presets only.
 * @module data/writing/public-demo-allowlist
 */

/** Allowed task types for public writing demo generator. */
export const PUBLIC_WRITING_DEMO_TASK_TYPES = new Set(["trace", "copy", "quantity_match"]);

/** @type {Set<string>} */
export const PUBLIC_WRITING_DEMO_ENGLISH_PAIRS = new Set(["A", "a", "B", "b", "M", "m", "S", "s"]);

/** @type {Set<string>} */
export const PUBLIC_WRITING_DEMO_ENGLISH_WORDS = new Set(["cat", "dog", "sun"]);

/** @type {Set<number>} */
export const PUBLIC_WRITING_DEMO_NUMBERS = new Set([0, 1, 2, 3, 5]);

/** @type {Set<string>} */
export const PUBLIC_WRITING_DEMO_PREWRITING_PATHS = new Set([
  "horizontal",
  "waves",
  "circles",
  "combo",
]);

/**
 * @typedef {Object} PublicWritingDemoPreset
 * @property {string} id
 * @property {import("../../lib/writing/writing-worksheet-types.js").WritingCategory} writingCategory
 * @property {string} titleHe
 * @property {Record<string, unknown>} request
 */

/** @type {PublicWritingDemoPreset[]} */
export const PUBLIC_WRITING_DEMO_PRESETS = [
  {
    id: "en-A-trace",
    writingCategory: "english_letters",
    titleHe: "Trace — A",
    request: {
      writingCategory: "english_letters",
      characters: ["A"],
      letterCase: "upper",
      tracingMode: "trace",
      lineCount: 6,
      itemsPerLine: 1,
    },
  },
  {
    id: "num-1-trace",
    writingCategory: "numbers",
    titleHe: "Number 1",
    request: {
      writingCategory: "numbers",
      numberRange: { min: 1, max: 1 },
      numberMode: "digit",
      tracingMode: "trace",
      lineCount: 6,
      itemsPerLine: 1,
    },
  },
  {
    id: "num-qty-2",
    writingCategory: "numbers",
    titleHe: "Quantity 2",
    request: {
      writingCategory: "numbers",
      numberRange: { min: 2, max: 2 },
      numberMode: "quantity_match",
      tracingMode: "trace",
      lineCount: 4,
      itemsPerLine: 1,
    },
  },
  {
    id: "pre-horizontal",
    writingCategory: "prewriting",
    titleHe: "Horizontal lines",
    request: {
      writingCategory: "prewriting",
      prewritingPathId: "horizontal",
      tracingMode: "trace",
      lineCount: 6,
      itemsPerLine: 1,
    },
  },
  {
    id: "en-word-cat",
    writingCategory: "english_words",
    titleHe: "Word — cat",
    request: {
      writingCategory: "english_words",
      wordPackId: "custom",
      words: ["cat"],
      tracingMode: "trace",
      lineCount: 4,
      itemsPerLine: 1,
    },
  },
  {
    id: "personal-name",
    writingCategory: "personal_text",
    titleHe: "First name",
    request: {
      writingCategory: "personal_text",
      customText: "Alex",
      customTextKind: "first_name",
      tracingMode: "trace",
      lineCount: 4,
      itemsPerLine: 1,
    },
  },
];

/**
 * @param {string} presetId
 * @returns {PublicWritingDemoPreset | null}
 */
export function getPublicWritingDemoPreset(presetId) {
  const key = String(presetId || "").trim();
  return PUBLIC_WRITING_DEMO_PRESETS.find((p) => p.id === key) || null;
}

export const PUBLIC_WRITING_DEMO_LIMITS = {
  maxPages: 1,
  maxLines: 6,
  maxCharsPerLine: 4,
  maxCustomNameLength: 30,
  maxCustomWordLength: 15,
  maxQuantityMatchValue: 3,
};
