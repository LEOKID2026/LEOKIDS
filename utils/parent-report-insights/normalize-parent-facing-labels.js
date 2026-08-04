import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";
/**
 * Parent-facing display-name resolution for the Insight Packet.
 *
 * Lookups call reportPackCopy at runtime (after bindReportPackLocale) so values
 * are not frozen to English at module load.
 */

const SLUG = "utils__parent-report-insights__normalize-parent-facing-labels";

/** @param {string} key @param {string} [fallback] */
function t(key, fallback = "") {
  const v = reportPackCopy(SLUG, key);
  // Never surface the raw pack key as visible UI copy.
  if (v && v !== key) return v;
  return typeof fallback === "string" ? fallback : "";
}

const MATH_KEYS = Object.freeze([
  "addition",
  "subtraction",
  "multiplication",
  "division",
  "division_with_remainder",
  "fractions",
  "percentages",
  "sequences",
  "decimals",
  "rounding",
  "divisibility",
  "prime_composite",
  "powers",
  "ratio",
  "equations",
  "order_of_operations",
  "zero_one_properties",
  "estimation",
  "scale",
  "compare",
  "number_sense",
  "factors_multiples",
  "word_problems",
  "multiplication_table",
  "mixed",
]);

const MATH_PACK_KEY = Object.freeze({
  division_with_remainder: "division_with_remainder",
  divisibility: "divisibility_rules",
  prime_composite: "prime_and_composite_numbers",
  zero_one_properties: "properties_of_0_and_1",
  compare: "comparison",
  factors_multiples: "factors_and_multiples",
  word_problems: "word_problems",
  multiplication_table: "multiplication_table",
  mixed: "mixed_practice",
  ratio: "ratio",
  scale: "scale",
});

const GEOMETRY_KEYS = Object.freeze([
  "shapes_basic",
  "shapes",
  "area",
  "perimeter",
  "volume",
  "angles",
  "parallel_perpendicular",
  "triangles",
  "quadrilaterals",
  "transformations",
  "rotation",
  "symmetry",
  "diagonal",
  "heights",
  "tiling",
  "circles",
  "solids",
  "pythagoras",
  "mixed",
]);

const GEOMETRY_PACK_KEY = Object.freeze({
  shapes_basic: "basic_shapes",
  parallel_perpendicular: "parallel_and_perpendicular",
  diagonal: "diagonals",
  solids: "solid_shapes",
  pythagoras: "pythagorean_theorem",
  mixed: "mixed_practice",
  area: "area",
});

const ENGLISH_KEYS = Object.freeze([
  "vocabulary",
  "grammar",
  "grammar_basics",
  "translation",
  "sentence",
  "sentences",
  "writing",
  "reading_comprehension",
  "matching",
  "inference",
  "mixed",
]);

const ENGLISH_PACK_KEY = Object.freeze({
  sentence: "sentence_building",
  sentences: "sentence_building",
  mixed: "mixed_practice",
});

const SCIENCE_KEYS = Object.freeze([
  "body",
  "animals",
  "plants",
  "materials",
  "earth_space",
  "environment",
  "experiments",
  "mixed",
]);

const SCIENCE_PACK_KEY = Object.freeze({
  body: "human_body",
  earth_space: "earth_and_space",
  environment: "environment_and_ecology",
  experiments: "experiments_and_processes",
  mixed: "mixed_topics",
});

const RAW_KEY_RE = /^[a-z][a-z0-9_]*$/i;

function stripMathKindSuffix(key) {
  if (typeof key !== "string") return "";
  const i = key.indexOf("::");
  return i === -1 ? key : key.slice(0, i);
}

/** @param {string} topicKey @param {Record<string, string>} packMap @param {string[]} keys */
function lookupTopic(topicKey, packMap, keys) {
  const tk = String(topicKey || "").trim();
  if (!tk || !keys.includes(tk)) {
    const packKey = packMap[tk] || tk;
    const v = t(packKey, "");
    return v && v !== packKey ? v : "";
  }
  const packKey = packMap[tk] || tk;
  return t(packKey, "");
}

export function getSubjectDisplayNameHe(subjectKey) {
  if (!subjectKey) return t("subject", "Subject");
  const k = String(subjectKey).trim().toLowerCase();
  if (k === "math" || k === "geometry" || k === "english" || k === "science") {
    return t(`subject_${k}`, k);
  }
  return t("subject", "Subject");
}

export function getTopicDisplayNameHe(subjectKey, topicKey) {
  const tk = String(topicKey || "").trim();
  if (!tk || tk === "general") return "";
  const sk = String(subjectKey || "").trim().toLowerCase();
  switch (sk) {
    case "math": {
      const base = stripMathKindSuffix(tk);
      if (base.startsWith("wp_")) return t("word_problems");
      return lookupTopic(base, MATH_PACK_KEY, MATH_KEYS) || t(base, "");
    }
    case "geometry":
      return lookupTopic(tk, GEOMETRY_PACK_KEY, GEOMETRY_KEYS) || t(tk, "");
    case "english":
      return lookupTopic(tk, ENGLISH_PACK_KEY, ENGLISH_KEYS) || t(tk, "");
    case "science":
      return lookupTopic(tk, SCIENCE_PACK_KEY, SCIENCE_KEYS) || t(tk, "");
    default:
      return "";
  }
}

export function isLikelyRawKey(label) {
  if (typeof label !== "string") return false;
  const tLabel = label.trim();
  if (!tLabel) return false;
  return RAW_KEY_RE.test(tLabel);
}

export function safeHebrewLabel(label, fallback) {
  if (typeof label === "string") {
    const trimmed = label.trim();
    if (trimmed && !isLikelyRawKey(trimmed)) return trimmed;
  }
  return typeof fallback === "string" && fallback.trim() ? fallback.trim() : t("topic", "Topic");
}

/** Lazy subject map for tests that still expect a dictionary shape. */
export const SUBJECT_LABELS_HE_FOR_TESTS = new Proxy(
  {},
  {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      return getSubjectDisplayNameHe(prop);
    },
    ownKeys() {
      return ["math", "geometry", "english", "science"];
    },
    getOwnPropertyDescriptor(_t, prop) {
      if (typeof prop !== "string") return undefined;
      return { configurable: true, enumerable: true, value: getSubjectDisplayNameHe(prop) };
    },
  },
);
