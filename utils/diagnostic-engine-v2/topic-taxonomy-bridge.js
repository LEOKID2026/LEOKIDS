/**
 *  bucketKey ( ) ↔   —    .
 *  stage1 blueprint §5 +   math-report-generator.
 */
import { mathReportBaseOperationKey } from "../math-report-generator.js";

/** @type {Record<string, string[]>} */
const MATH_OP_TO_IDS = {
  number_sense: ["M-01"],
  compare: ["M-01"],
  scale: ["M-01"],
  addition: ["M-02"],
  subtraction: ["M-09"],
  multiplication: ["M-03", "M-10"],
  division: ["M-10"],
  division_with_remainder: ["M-10"],
  fractions: ["M-04", "M-05"],
  decimals: ["M-06"],
  rounding: ["M-06"],
  word_problems: ["M-07", "M-08"],
  sequences: ["M-08"],
  percentages: ["M-06"],
  ratio: ["M-10"],
  equations: ["M-08"],
  order_of_operations: ["M-08"],
  mixed: ["M-02", "M-03"],
  divisibility: ["M-02"],
  prime_composite: ["M-01"],
  powers: ["M-03"],
  zero_one_properties: ["M-01"],
  estimation: ["M-01"],
  factors_multiples: ["M-03"]
};

/** @type {Record<string, string[]>} */
const GEOMETRY_TOPIC_TO_IDS = {
  shapes_basic: ["G-01"],
  quadrilaterals: ["G-01", "G-03"],
  area: ["G-03", "G-08"],
  perimeter: ["G-06"],
  volume: ["G-05"],
  angles: ["G-02"],
  parallel_perpendicular: ["G-01"],
  triangles: ["G-08"],
  transformations: ["G-04"],
  rotation: ["G-04"],
  symmetry: ["G-07"],
  diagonal: ["G-01"],
  heights: ["G-03"],
  tiling: ["G-01"],
  circles: ["G-02"],
  solids: ["G-05"],
  pythagoras: ["G-08"],
  mixed: ["G-01"]
};

/** @type {Record<string, string[]>} */
const ENGLISH_TOPIC_TO_IDS = {
  vocabulary: ["E-01", "E-05"],
  grammar: ["E-02", "E-04"],
  translation: ["E-03"],
  sentences: ["E-06"],
  /** Audit/inventory uses grammar category id `sentence` for sentence pools — alias of UI topic `sentences`. */
  sentence: ["E-06"],
  writing: ["E-07"],
  listening: ["E-08"],
  mixed: ["E-01"]
};

/** @type {Record<string, string[]>} */
const SCIENCE_TOPIC_TO_IDS = {
  body: ["S-03"],
  animals: ["S-01", "S-08"],
  plants: ["S-01"],
  materials: ["S-04", "S-05"],
  earth_space: ["S-01", "S-06"],
  environment: ["S-07"],
  experiments: ["S-02"],
  mixed: ["S-01"]
};

/**
 * Product bucket aliases → canonical keys that exist in taxonomy maps above.
 * No invented taxonomy — only redirects to keys already mapped.
 * @type {Record<string, string>}
 */
const TOPIC_BUCKET_ALIASES = {
  shapes: "shapes_basic",
  sentence: "sentences",
  human_body: "body"
};

const GRADE_SCOPE_SEP = "::grade:";

/**
 * Normalize report bucket keys: strip `::grade:gN`, then first `::` segment; apply aliases.
 * @param {string|null|undefined} bucketKeyRaw
 * @returns {{ rawBucketKey: string, normalizedBucketKey: string, gradeScope: string|null, baseBeforeAlias: string }}
 */
export function normalizeReportBucketKey(bucketKeyRaw) {
  const raw = String(bucketKeyRaw ?? "").trim();
  if (!raw) {
    return { rawBucketKey: raw, normalizedBucketKey: "", gradeScope: null, baseBeforeAlias: "" };
  }

  let gradeScope = null;
  let key = raw;
  const gradeIdx = key.indexOf(GRADE_SCOPE_SEP);
  if (gradeIdx !== -1) {
    gradeScope = key.slice(gradeIdx + GRADE_SCOPE_SEP.length).trim() || null;
    key = key.slice(0, gradeIdx);
  }

  const nextSep = key.indexOf("::");
  const baseBeforeAlias = nextSep === -1 ? key : key.slice(0, nextSep);
  const aliased = TOPIC_BUCKET_ALIASES[baseBeforeAlias] || baseBeforeAlias;

  return {
    rawBucketKey: raw,
    normalizedBucketKey: aliased,
    gradeScope,
    baseBeforeAlias
  };
}

/**
 * Legacy lookup (pre stage-2) — direct key without grade/alias normalization.
 * Used for audit before/after only.
 * @param {string} subjectId
 * @param {string} bucketKeyRaw
 * @returns {string[]}
 */
export function taxonomyIdsForReportBucketLegacy(subjectId, bucketKeyRaw) {
  const bucketKey = String(bucketKeyRaw || "").trim();
  if (!bucketKey) return [];

  if (subjectId === "math") {
    const base = mathReportBaseOperationKey(bucketKey);
    return MATH_OP_TO_IDS[base] ? [...MATH_OP_TO_IDS[base]] : [];
  }
  if (subjectId === "geometry") {
    return GEOMETRY_TOPIC_TO_IDS[bucketKey] ? [...GEOMETRY_TOPIC_TO_IDS[bucketKey]] : [];
  }
  if (subjectId === "english") {
    return ENGLISH_TOPIC_TO_IDS[bucketKey] ? [...ENGLISH_TOPIC_TO_IDS[bucketKey]] : [];
  }
  
  if (subjectId === "science") {
    return SCIENCE_TOPIC_TO_IDS[bucketKey] ? [...SCIENCE_TOPIC_TO_IDS[bucketKey]] : [];
  }

  return [];
}

/**
 * @param {string} subjectId
 * @param {string} bucketKeyRaw
 * @returns {string[]}
 */
export function taxonomyIdsForReportBucket(subjectId, bucketKeyRaw) {
  const sid = String(subjectId || "").trim();
  const raw = String(bucketKeyRaw || "").trim();
  if (!raw) return [];

  if (sid === "math") {
    const base = mathReportBaseOperationKey(raw);
    return MATH_OP_TO_IDS[base] ? [...MATH_OP_TO_IDS[base]] : [];
  }

  const { normalizedBucketKey } = normalizeReportBucketKey(raw);
  const bucketKey = normalizedBucketKey;
  if (!bucketKey) return [];

  if (sid === "geometry") {
    return GEOMETRY_TOPIC_TO_IDS[bucketKey] ? [...GEOMETRY_TOPIC_TO_IDS[bucketKey]] : [];
  }
  if (sid === "english") {
    return ENGLISH_TOPIC_TO_IDS[bucketKey] ? [...ENGLISH_TOPIC_TO_IDS[bucketKey]] : [];
  }

  if (sid === "science") {
    return SCIENCE_TOPIC_TO_IDS[bucketKey] ? [...SCIENCE_TOPIC_TO_IDS[bucketKey]] : [];
  }

  return [];
}
