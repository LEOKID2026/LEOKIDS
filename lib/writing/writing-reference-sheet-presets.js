/**
 * Full-set reference tracing sheets — one A4 page, each character once (English global).
 * @module lib/writing/writing-reference-sheet-presets
 */

import {
  ENGLISH_LOWER,
  ENGLISH_UPPER,
} from "./writing-constants.js";

/** @typedef {"en_upper" | "en_lower" | "digits"} ReferenceSheetPresetKey */

/** @type {ReferenceSheetPresetKey[]} */
export const REFERENCE_SHEET_PRESET_KEYS = ["en_upper", "en_lower", "digits"];

/**
 * @typedef {Object} ReferenceSheetPreset
 * @property {ReferenceSheetPresetKey} key
 * @property {string} labelHe
 * @property {string} titleHe
 * @property {import("./writing-worksheet-types.js").WritingCategory} writingCategory
 * @property {number} lineCount
 * @property {number} itemsPerLine
 * @property {import("./writing-worksheet-types.js").ScriptStyle} scriptStyle
 * @property {string[]} [characters]
 * @property {"upper" | "lower"} [letterCase]
 * @property {{ min: number, max: number }} [numberRange]
 * @property {"digit"} [numberMode]
 */

/** @type {Record<ReferenceSheetPresetKey, ReferenceSheetPreset>} */
export const REFERENCE_SHEET_PRESETS = {
  en_upper: {
    key: "en_upper",
    labelHe: "All uppercase letters",
    titleHe: "All uppercase letters",
    writingCategory: "english_letters",
    characters: [...ENGLISH_UPPER],
    letterCase: "upper",
    scriptStyle: "print",
    lineCount: 5,
    itemsPerLine: 6,
  },
  en_lower: {
    key: "en_lower",
    labelHe: "All lowercase letters",
    titleHe: "All lowercase letters",
    writingCategory: "english_letters",
    characters: [...ENGLISH_LOWER],
    letterCase: "lower",
    scriptStyle: "print",
    lineCount: 5,
    itemsPerLine: 6,
  },
  digits: {
    key: "digits",
    labelHe: "All digits",
    titleHe: "All digits",
    writingCategory: "numbers",
    numberRange: { min: 0, max: 9 },
    numberMode: "digit",
    scriptStyle: "print",
    lineCount: 2,
    itemsPerLine: 5,
  },
};

/**
 * @param {ReferenceSheetPresetKey} presetKey
 * @returns {Record<string, unknown> | null}
 */
export function applyReferenceSheetPreset(presetKey) {
  const preset = REFERENCE_SHEET_PRESETS[presetKey];
  if (!preset) return null;

  /** @type {Record<string, unknown>} */
  const request = {
    writingCategory: preset.writingCategory,
    scriptStyle: preset.scriptStyle,
    lineTemplate: "reference_sheet",
    lineCount: preset.lineCount,
    itemsPerLine: preset.itemsPerLine,
    tracingMode: "trace",
    traceRenderMode: "full_trace",
    repeatsPerLine: 1,
    includeExample: false,
    includeCopyRows: false,
    includeIndependentRows: false,
    includeNameField: false,
    includeDateField: false,
    pageDensity: "compact",
    pageOrientation: "portrait",
    referenceSheetPreset: presetKey,
  };

  if (preset.characters) request.characters = [...preset.characters];
  if (preset.letterCase) request.letterCase = preset.letterCase;
  if (preset.numberRange) request.numberRange = { ...preset.numberRange };
  if (preset.numberMode) request.numberMode = preset.numberMode;

  return request;
}

/**
 * @param {ReferenceSheetPresetKey} presetKey
 * @returns {number}
 */
export function referenceSheetCharacterCount(presetKey) {
  const preset = REFERENCE_SHEET_PRESETS[presetKey];
  if (!preset) return 0;
  if (preset.characters) return preset.characters.length;
  if (preset.numberRange) return preset.numberRange.max - preset.numberRange.min + 1;
  return 0;
}
