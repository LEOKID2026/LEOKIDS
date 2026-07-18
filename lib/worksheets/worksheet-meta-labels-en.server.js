/**
 * English labels for Global worksheet meta (hub + preview + public catalog).
 * @module lib/worksheets/worksheet-meta-labels-en.server
 */

import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import { WORKSHEET_SUBJECT_ALLOWLIST } from "./worksheet-print-allowlist.js";
import { isWorksheetPublicLevelKey } from "./worksheet-level-display.js";
import { mathPracticeFormatTitleEn } from "./worksheet-math-practice-format.js";

/** @typedef {import("./worksheet-question-types.js").WorksheetSubjectId} WorksheetSubjectId */

const SUBJECT_EN = {
  math: "Math",
  geometry: "Geometry",
  english: "English",
  science: "Science",
};

const GRADE_EN = {
  g1: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "grade_1"),
  g2: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "grade_2"),
  g3: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "grade_3"),
  g4: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "grade_4"),
  g5: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "grade_5"),
  g6: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "grade_6"),
};

const LEVEL_EN = {
  regular: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "regular"),
  advanced: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "advanced"),
};

const MATH_TOPIC_EN = {
  addition: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "addition"),
  subtraction: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "subtraction"),
  multiplication: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "multiplication"),
  division: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "division"),
  division_with_remainder: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "division_with_remainder"),
  fractions: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "fractions"),
  decimals: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "decimals"),
  percentages: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "percentages"),
  ratio: "Ratio",
  scale: "Scale",
  sequences: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "sequences"),
  number_sense: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "number_sense"),
  comparison: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "comparison"),
  compare: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "comparison"),
  order_of_operations: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "order_of_operations"),
  divisibility: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "divisibility_rules"),
  word_problems: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "word_problems"),
  rounding: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "rounding"),
  equations: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "equations"),
  factors_multiples: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "factors_and_multiples"),
  estimation: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "estimation"),
  mixed: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "mixed_practice"),
};

const GEOMETRY_TOPIC_EN = {
  shapes_basic: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "basic_shapes"),
  area: "Area",
  perimeter: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "perimeter"),
  volume: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "volume"),
  angles: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "angles"),
  parallel_perpendicular: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "parallel_and_perpendicular"),
  triangles: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "triangles"),
  quadrilaterals: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "quadrilaterals"),
  transformations: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "transformations"),
  rotation: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "rotation"),
  symmetry: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "symmetry"),
  diagonal: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "diagonals"),
  heights: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "heights"),
  tiling: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "tiling"),
  circles: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "circles"),
  solids: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "solids"),
  pythagoras: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "pythagoras"),
  mixed: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "mixed_practice"),
};

const ENGLISH_TOPIC_EN = {
  phonics: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "phonics"),
  vocabulary: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "vocabulary"),
  grammar: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "grammar"),
  grammar_basics: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "grammar_basics"),
  translation: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "translation"),
  sentence: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "sentence_building"),
  sentences: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "sentence_building"),
  writing: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "writing"),
  reading_comprehension: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "reading_comprehension"),
  matching: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "matching"),
  inference: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "inference"),
  sentence_understanding: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "sentence_understanding"),
  simple_sentences: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "simple_sentences"),
  mixed: globalBurnDownCopy("lib__worksheets__worksheet-meta-labels-en.server", "mixed_practice"),
};

/**
 * @param {WorksheetSubjectId} _subjectId
 * @param {string} gradeKey
 */
export function worksheetGradeLabelEn(_subjectId, gradeKey) {
  const key = String(gradeKey || "").toLowerCase();
  if (GRADE_EN[key]) return GRADE_EN[key];
  const m = key.match(/^g([1-6])$/);
  if (m) return `Grade ${m[1]}`;
  const m2 = key.match(/^grade_([1-6])$/);
  if (m2) return `Grade ${m2[1]}`;
  return gradeKey || "-";
}

/**
 * @param {WorksheetSubjectId} subjectId
 * @param {string} topicKey
 */
export function worksheetTopicLabelEn(subjectId, topicKey) {
  const key = String(topicKey || "");
  if (subjectId === "math") return MATH_TOPIC_EN[key] || key;
  if (subjectId === "geometry") return GEOMETRY_TOPIC_EN[key] || key;
  if (subjectId === "english") return ENGLISH_TOPIC_EN[key] || key;
  return key;
}

/**
 * @param {WorksheetSubjectId} _subjectId
 * @param {string} levelKey
 */
export function worksheetLevelLabelEn(_subjectId, levelKey) {
  if (isWorksheetPublicLevelKey(levelKey)) return LEVEL_EN[levelKey] || levelKey;
  return "-";
}

/**
 * @param {WorksheetSubjectId} subjectId
 */
export function worksheetSubjectLabelEn(subjectId) {
  return (
    SUBJECT_EN[subjectId] ||
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
 * }} params
 */
export function buildWorksheetPayloadMetaEn(params) {
  const subjectEn = worksheetSubjectLabelEn(params.subjectId);
  const gradeEn = worksheetGradeLabelEn(params.subjectId, params.gradeKey);
  let topicEn = worksheetTopicLabelEn(params.subjectId, params.topicKey);
  if (params.subjectId === "math" && params.mathPracticeFormat) {
    topicEn = mathPracticeFormatTitleEn(
      params.mathPracticeFormat,
      params.topicKey,
      params.gradeKey
    );
  }
  const levelEn = worksheetLevelLabelEn(params.subjectId, params.levelKey);
  const titleEn =
    params.titleEn ||
    params.titleHe ||
    `Worksheet — ${subjectEn} · ${topicEn}`;

  // Keep legacy *He field names for payload shape; values are English for Global.
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
  };
}

export {
  MATH_TOPIC_EN,
  GEOMETRY_TOPIC_EN,
  ENGLISH_TOPIC_EN,
  SUBJECT_EN,
  GRADE_EN,
  LEVEL_EN,
};
