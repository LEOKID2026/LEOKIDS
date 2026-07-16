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
  hebrew: "Hebrew",
  science: "Science",
  moledet_geography: "Homeland & geography",
});

const MATH_OPERATION_NAMES_HE = Object.freeze({
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
  division_with_remainder: "Division with remainder",
  fractions: "Fractions",
  percentages: "Percentages",
  sequences: "Sequences",
  decimals: "Decimals",
  rounding: "Rounding",
  divisibility: "Divisibility rules",
  prime_composite: "Prime and composite numbers",
  powers: "Powers",
  ratio: "Ratio",
  equations: "Equations",
  order_of_operations: "Order of operations",
  zero_one_properties: "Properties of 0 and 1",
  estimation: "Estimation",
  scale: "Scale",
  compare: "Comparison",
  number_sense: "Number sense",
  factors_multiples: "Factors and multiples",
  word_problems: "Word problems",
  multiplication_table: "Multiplication table",
  mixed: "Mixed practice",
});

const GEOMETRY_TOPIC_NAMES_HE = Object.freeze({
  shapes_basic: "Basic shapes",
  shapes: "Shapes",
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
  solids: "Solid shapes",
  pythagoras: "Pythagorean theorem",
  mixed: "Mixed practice",
});

const ENGLISH_TOPIC_NAMES_HE = Object.freeze({
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
  mixed: "Mixed practice",
});

const SCIENCE_TOPIC_NAMES_HE = Object.freeze({
  body: "Human body",
  animals: "Animals",
  plants: "Plants",
  materials: "Materials",
  earth_space: "Earth and space",
  environment: "Environment and ecology",
  experiments: "Experiments and processes",
  mixed: "Mixed topics",
});

const HEBREW_TOPIC_NAMES_HE = Object.freeze({
  reading: "Reading",
  comprehension: "Reading comprehension",
  reading_comprehension: "Reading comprehension",
  writing: "Writing and expression",
  grammar: "Grammar and language",
  vocabulary: "Vocabulary",
  speaking: "Speaking and discussion",
  mixed: "Mixed practice",
  main_idea: "Main idea",
  sequence: "Sequence",
  inference: "Inference",
});

const MOLEDET_GEOGRAPHY_TOPIC_NAMES_HE = Object.freeze({
  homeland: "Homeland",
  community: "Community",
  citizenship: "Citizenship",
  geography: "Geography",
  basic_geography: "Geography basics",
  values: "Values",
  maps: "Maps",
  map_reading: "Map reading",
  directions: "Directions",
  places: "Places",
  mixed: "Mixed practice",
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
