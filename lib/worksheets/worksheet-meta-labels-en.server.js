/**
 * Locale-aware labels for Global worksheet meta (hub + preview + public catalog).
 * Labels are resolved at call time via globalBurnDownCopyForLocale so that
 * ar-001 (and any other) interface locales receive translated strings.
 * @module lib/worksheets/worksheet-meta-labels-en.server
 */

import { globalBurnDownCopyForLocale } from "../../lib/i18n/global-burn-down-copy.js";
import { WORKSHEET_SUBJECT_ALLOWLIST } from "./worksheet-print-allowlist.js";
import { isWorksheetPublicLevelKey } from "./worksheet-level-display.js";
import { mathPracticeFormatTitleEn } from "./worksheet-math-practice-format.js";

/** @typedef {import("./worksheet-question-types.js").WorksheetSubjectId} WorksheetSubjectId */

const SLUG = "lib__worksheets__worksheet-meta-labels-en.server";

/** Maps grade key to burn-down pack key. */
const GRADE_PACK_KEYS = {
  g1: "grade_1",
  g2: "grade_2",
  g3: "grade_3",
  g4: "grade_4",
  g5: "grade_5",
  g6: "grade_6",
};

/** Maps subject id to burn-down pack key. */
const SUBJECT_PACK_KEYS = {
  math: "subject_math",
  geometry: "subject_geometry",
  english: "subject_english",
  science: "subject_science",
};

/** Maps math topic key to burn-down pack key. */
const MATH_TOPIC_PACK_KEYS = {
  addition: "addition",
  subtraction: "subtraction",
  multiplication: "multiplication",
  division: "division",
  division_with_remainder: "division_with_remainder",
  fractions: "fractions",
  decimals: "decimals",
  percentages: "percentages",
  ratio: "ratio",
  scale: "scale",
  sequences: "sequences",
  number_sense: "number_sense",
  comparison: "comparison",
  compare: "comparison",
  order_of_operations: "order_of_operations",
  divisibility: "divisibility_rules",
  word_problems: "word_problems",
  rounding: "rounding",
  equations: "equations",
  factors_multiples: "factors_and_multiples",
  estimation: "estimation",
  mixed: "mixed_practice",
};

/** Maps geometry topic key to burn-down pack key. */
const GEOMETRY_TOPIC_PACK_KEYS = {
  shapes_basic: "basic_shapes",
  area: "area",
  perimeter: "perimeter",
  volume: "volume",
  angles: "angles",
  parallel_perpendicular: "parallel_and_perpendicular",
  triangles: "triangles",
  quadrilaterals: "quadrilaterals",
  transformations: "transformations",
  rotation: "rotation",
  symmetry: "symmetry",
  diagonal: "diagonals",
  heights: "heights",
  tiling: "tiling",
  circles: "circles",
  solids: "solids",
  pythagoras: "pythagoras",
  mixed: "mixed_practice",
};

/** Maps English topic key to burn-down pack key. */
const ENGLISH_TOPIC_PACK_KEYS = {
  phonics: "phonics",
  vocabulary: "vocabulary",
  grammar: "grammar",
  grammar_basics: "grammar_basics",
  translation: "translation",
  sentence: "sentence_building",
  sentences: "sentence_building",
  writing: "writing",
  reading_comprehension: "reading_comprehension",
  matching: "matching",
  inference: "inference",
  sentence_understanding: "sentence_understanding",
  simple_sentences: "simple_sentences",
  mixed: "mixed_practice",
};

/**
 * @param {WorksheetSubjectId} _subjectId
 * @param {string} gradeKey
 * @param {string} [locale]
 */
export function worksheetGradeLabelEn(_subjectId, gradeKey, locale = "en") {
  const key = String(gradeKey || "").toLowerCase();
  const packKey = GRADE_PACK_KEYS[key];
  if (packKey) return globalBurnDownCopyForLocale(locale, SLUG, packKey);
  const m = key.match(/^g([1-6])$/);
  if (m) return globalBurnDownCopyForLocale(locale, SLUG, `grade_${m[1]}`);
  const m2 = key.match(/^grade_([1-6])$/);
  if (m2) return globalBurnDownCopyForLocale(locale, SLUG, `grade_${m2[1]}`);
  return gradeKey || "-";
}

/**
 * @param {WorksheetSubjectId} subjectId
 * @param {string} topicKey
 * @param {string} [locale]
 */
export function worksheetTopicLabelEn(subjectId, topicKey, locale = "en") {
  const key = String(topicKey || "");
  if (subjectId === "math") {
    const packKey = MATH_TOPIC_PACK_KEYS[key];
    return packKey ? globalBurnDownCopyForLocale(locale, SLUG, packKey) : key;
  }
  if (subjectId === "geometry") {
    const packKey = GEOMETRY_TOPIC_PACK_KEYS[key];
    return packKey ? globalBurnDownCopyForLocale(locale, SLUG, packKey) : key;
  }
  if (subjectId === "english") {
    const packKey = ENGLISH_TOPIC_PACK_KEYS[key];
    return packKey ? globalBurnDownCopyForLocale(locale, SLUG, packKey) : key;
  }
  return key;
}

/**
 * @param {WorksheetSubjectId} _subjectId
 * @param {string} levelKey
 * @param {string} [locale]
 */
export function worksheetLevelLabelEn(_subjectId, levelKey, locale = "en") {
  if (isWorksheetPublicLevelKey(levelKey)) {
    return globalBurnDownCopyForLocale(locale, SLUG, levelKey);
  }
  return "-";
}

/**
 * @param {WorksheetSubjectId} subjectId
 * @param {string} [locale]
 */
export function worksheetSubjectLabelEn(subjectId, locale = "en") {
  const packKey = SUBJECT_PACK_KEYS[subjectId];
  if (packKey) return globalBurnDownCopyForLocale(locale, SLUG, packKey);
  return (
    WORKSHEET_SUBJECT_ALLOWLIST[subjectId]?.labelHe ||
    subjectId
  );
}

/**
 * @param {{
 *   subjectId: WorksheetSubjectId,
 *   gradeKey: string,
 *   topicKey: string,
 *   levelKey: string,
 *   inkSave?: boolean,
 *   titleHe?: string,
 *   titleEn?: string,
 *   mathPracticeFormat?: string,
 *   interfaceLocale?: string,
 * }} params
 */
export function buildWorksheetPayloadMetaEn(params) {
  const locale = typeof params.interfaceLocale === "string" ? params.interfaceLocale : "en";
  const subjectEn = worksheetSubjectLabelEn(params.subjectId, locale);
  const gradeEn = worksheetGradeLabelEn(params.subjectId, params.gradeKey, locale);
  let topicEn = worksheetTopicLabelEn(params.subjectId, params.topicKey, locale);
  if (params.subjectId === "math" && params.mathPracticeFormat) {
    topicEn = mathPracticeFormatTitleEn(
      params.mathPracticeFormat,
      params.topicKey,
      params.gradeKey,
      locale
    );
  }
  const levelEn = worksheetLevelLabelEn(params.subjectId, params.levelKey, locale);
  const titleTemplate = globalBurnDownCopyForLocale(locale, SLUG, "worksheet_title_prefix");
  const titleEn =
    params.titleEn ||
    params.titleHe ||
    titleTemplate.replace("{subject}", subjectEn).replace("{topic}", topicEn);

  // Keep legacy *He field names for payload shape; values are locale-resolved for Global.
  return {
    titleHe: titleEn,
    subjectHe: subjectEn,
    gradeHe: gradeEn,
    topicHe: topicEn,
    levelHe: levelEn,
    inkSave: params.inkSave === true,
    subjectId: params.subjectId,
    gradeKey: params.gradeKey,
    topicKey: params.topicKey,
    levelKey: params.levelKey,
    mathPracticeFormat: params.mathPracticeFormat,
    ...(params.instructionLocale ? { instructionLocale: params.instructionLocale } : {}),
    ...(params.contentLocale ? { contentLocale: params.contentLocale } : {}),
    ...(params.interfaceLocale ? { interfaceLocale: params.interfaceLocale } : {}),
  };
}
