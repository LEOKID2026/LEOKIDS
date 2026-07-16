/**
 * English labels for Global worksheet meta (hub + preview + public catalog).
 * @module lib/worksheets/worksheet-meta-labels-en.server
 */

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
  g1: "Grade 1",
  g2: "Grade 2",
  g3: "Grade 3",
  g4: "Grade 4",
  g5: "Grade 5",
  g6: "Grade 6",
};

const LEVEL_EN = {
  regular: "Regular",
  advanced: "Advanced",
};

const MATH_TOPIC_EN = {
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
  division_with_remainder: "Division with remainder",
  fractions: "Fractions",
  decimals: "Decimals",
  percentages: "Percentages",
  ratio: "Ratio",
  scale: "Scale",
  sequences: "Sequences",
  number_sense: "Number sense",
  comparison: "Comparison",
  compare: "Comparison",
  order_of_operations: "Order of operations",
  divisibility: "Divisibility rules",
  word_problems: "Word problems",
  rounding: "Rounding",
  equations: "Equations",
  factors_multiples: "Factors and multiples",
  estimation: "Estimation",
  mixed: "Mixed practice",
};

const GEOMETRY_TOPIC_EN = {
  shapes_basic: "Basic shapes",
  area: "Area",
  perimeter: "Perimeter",
  volume: "Volume",
  angles: "Angles",
  parallel_perpendicular: "Parallel and perpendicular",
  triangles: "Triangles",
  quadrilaterals: "Quadrilaterals",
  transformations: "Transformations",
  rotation: "Rotation",
  symmetry: "Symmetry",
  diagonal: "Diagonals",
  heights: "Heights",
  tiling: "Tiling",
  circles: "Circles",
  solids: "Solids",
  pythagoras: "Pythagoras",
  mixed: "Mixed practice",
};

const ENGLISH_TOPIC_EN = {
  phonics: "Phonics",
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  grammar_basics: "Grammar basics",
  translation: "Translation",
  sentence: "Sentence building",
  sentences: "Sentence building",
  writing: "Writing",
  reading_comprehension: "Reading comprehension",
  matching: "Matching",
  inference: "Inference",
  sentence_understanding: "Sentence understanding",
  simple_sentences: "Simple sentences",
  mixed: "Mixed practice",
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
