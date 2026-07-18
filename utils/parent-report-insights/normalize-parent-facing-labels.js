import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";
/**
 * Parent-facing display-name resolution for the Insight Packet.
 *
 * The label dictionaries are inlined here on purpose so the insights module is fully self-contained
 * and can run under plain Node ESM (no Next.js bundler). They mirror the public dictionaries in
 * `utils/math-report-generator.js`. If a key is added to that file, mirror it here too - the
 * `parent-report-insights-selftest.mjs` golden fixtures will surface drift quickly.
 */

const SUBJECT_LABEL_HE = Object.freeze({
  math: "Math",
  geometry: "Geometry",
  english: "English",
  hebrew: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "hebrew"),
  science: "Science",
  moledet_geography: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "homeland_geography"),
});

const MATH_OPERATION_NAMES_HE = Object.freeze({
  addition: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "addition"),
  subtraction: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "subtraction"),
  multiplication: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "multiplication"),
  division: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "division"),
  division_with_remainder: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "division_with_remainder"),
  fractions: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "fractions"),
  percentages: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "percentages"),
  sequences: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "sequences"),
  decimals: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "decimals"),
  rounding: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "rounding"),
  divisibility: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "divisibility_rules"),
  prime_composite: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "prime_and_composite_numbers"),
  powers: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "powers"),
  ratio: "Ratio",
  equations: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "equations"),
  order_of_operations: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "order_of_operations"),
  zero_one_properties: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "properties_of_0_and_1"),
  estimation: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "estimation"),
  scale: "Scale",
  compare: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "comparison"),
  number_sense: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "number_sense"),
  factors_multiples: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "factors_and_multiples"),
  word_problems: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "word_problems"),
  multiplication_table: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "multiplication_table"),
  mixed: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "mixed_practice"),
});

const GEOMETRY_TOPIC_NAMES_HE = Object.freeze({
  shapes_basic: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "basic_shapes"),
  shapes: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "shapes"),
  area: "Area",
  perimeter: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "perimeter"),
  volume: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "volume"),
  angles: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "angles"),
  parallel_perpendicular: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "parallel_and_perpendicular"),
  triangles: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "triangles"),
  quadrilaterals: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "quadrilaterals"),
  transformations: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "transformations"),
  rotation: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "rotation"),
  symmetry: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "symmetry"),
  diagonal: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "diagonals"),
  heights: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "heights"),
  tiling: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "tiling"),
  circles: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "circles"),
  solids: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "solid_shapes"),
  pythagoras: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "pythagorean_theorem"),
  mixed: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "mixed_practice"),
});

const ENGLISH_TOPIC_NAMES_HE = Object.freeze({
  vocabulary: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "vocabulary"),
  grammar: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "grammar"),
  grammar_basics: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "grammar_basics"),
  translation: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "translation"),
  sentence: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "sentence_building"),
  sentences: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "sentence_building"),
  writing: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "writing"),
  reading_comprehension: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "reading_comprehension"),
  matching: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "matching"),
  inference: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "inference"),
  mixed: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "mixed_practice"),
});

const SCIENCE_TOPIC_NAMES_HE = Object.freeze({
  body: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "human_body"),
  animals: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "animals"),
  plants: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "plants"),
  materials: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "materials"),
  earth_space: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "earth_and_space"),
  environment: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "environment_and_ecology"),
  experiments: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "experiments_and_processes"),
  mixed: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "mixed_topics"),
});

const HEBREW_TOPIC_NAMES_HE = Object.freeze({
  reading: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "reading"),
  comprehension: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "reading_comprehension"),
  reading_comprehension: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "reading_comprehension"),
  writing: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "writing_and_expression"),
  grammar: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "grammar_and_language"),
  vocabulary: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "vocabulary"),
  speaking: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "speaking_and_discussion"),
  mixed: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "mixed_practice"),
  main_idea: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "main_idea"),
  sequence: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "sequence"),
  inference: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "inference"),
});

const MOLEDET_GEOGRAPHY_TOPIC_NAMES_HE = Object.freeze({
  homeland: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "homeland"),
  community: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "community"),
  citizenship: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "citizenship"),
  geography: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "geography"),
  basic_geography: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "geography_basics"),
  values: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "values"),
  maps: "Maps",
  map_reading: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "map_reading"),
  directions: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "directions"),
  places: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "places"),
  mixed: reportPackCopy("utils__parent-report-insights__normalize-parent-facing-labels", "mixed_practice"),
});

const RAW_KEY_RE = /^[a-z][a-z0-9_]*$/i;

function stripMathKindSuffix(key) {
  if (typeof key !== "string") return "";
  const i = key.indexOf("::");
  return i === -1 ? key : key.slice(0, i);
}

export function getSubjectDisplayNameHe(subjectKey) {
  if (!subjectKey) return "Subject";
  const k = String(subjectKey).trim().toLowerCase();
  return SUBJECT_LABEL_HE[k] || "Subject";
}

export function getTopicDisplayNameHe(subjectKey, topicKey) {
  const tk = String(topicKey || "").trim();
  if (!tk || tk === "general") return "";
  const sk = String(subjectKey || "").trim().toLowerCase();
  switch (sk) {
    case "math": {
      const base = stripMathKindSuffix(tk);
      if (base.startsWith("wp_")) return MATH_OPERATION_NAMES_HE.word_problems;
      return MATH_OPERATION_NAMES_HE[base] || "";
    }
    case "geometry":
      return GEOMETRY_TOPIC_NAMES_HE[tk] || "";
    case "english":
      return ENGLISH_TOPIC_NAMES_HE[tk] || "";
    case "science":
      return SCIENCE_TOPIC_NAMES_HE[tk] || "";
    case "hebrew":
      return HEBREW_TOPIC_NAMES_HE[tk] || "";
    case "moledet_geography":
      return MOLEDET_GEOGRAPHY_TOPIC_NAMES_HE[tk] || "";
    default:
      return "";
  }
}

export function isLikelyRawKey(label) {
  if (typeof label !== "string") return false;
  const t = label.trim();
  if (!t) return false;
  return RAW_KEY_RE.test(t);
}

export function safeHebrewLabel(label, fallback) {
  if (typeof label === "string") {
    const t = label.trim();
    if (t && !isLikelyRawKey(t)) return t;
  }
  return typeof fallback === "string" && fallback.trim() ? fallback.trim() : "Topic";
}

export const SUBJECT_LABELS_HE_FOR_TESTS = SUBJECT_LABEL_HE;
