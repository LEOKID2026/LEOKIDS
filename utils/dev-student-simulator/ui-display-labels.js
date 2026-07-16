/**
 * Display strings for the Dev Student Simulator Custom Builder UI only.
 * Internal subject ids and topic keys stay unchanged everywhere else.
 */

import { SUBJECT_BUCKETS } from "./constants";

/** Row order in the custom panel (UI only). */
export const CUSTOM_BUILDER_UI_SUBJECT_ORDER = Object.freeze([
  "math",
  "geometry",
  "hebrew",
  "english",
  "science",
  "moledet-geography",
]);

export const SUBJECT_DISPLAY_HE = Object.freeze({
  math: "Math",
  geometry: "Geometry",
  english: "English",
  hebrew: "Hebrew",
  science: "Science",
  "moledet-geography": "Homeland / Geography",
});

/**
 * Flat map: internal topic key -> display label for checkboxes.
 * Includes all keys from SUBJECT_BUCKETS plus extras for forward-compatible buckets.
 */
export const TOPIC_DISPLAY_HE = Object.freeze({
  // Math
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
  divisibility: "Divisibility",
  prime_composite: "Prime / composite",
  powers: "Powers",
  ratio: "Ratio",
  equations: "Equations",
  order_of_operations: "Order of operations",
  zero_one_properties: "Properties of 0 and 1",
  estimation: "Estimation",
  scale: "Scale",
  compare: "Number comparison",
  number_sense: "Number sense",
  factors_multiples: "Factors and multiples",
  word_problems: "Word problems",
  // Geometry
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
  solids: "Solid shapes",
  pythagoras: "Pythagorean theorem",
  units: "Units of measure",
  // Hebrew (subject)
  reading: "Reading",
  comprehension: "Reading comprehension",
  writing: "Writing",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  speaking: "Speaking",
  // English (subject) — overlaps keys with Hebrew where meaning matches UI
  translation: "Translation",
  sentences: "Sentence building",
  // Science
  body: "Human body",
  animals: "Animals",
  plants: "Plants",
  materials: "Materials",
  earth_space: "Earth and space",
  environment: "Environment",
  experiments: "Experiments",
  // Moledet / geography
  homeland: "Homeland",
  community: "Community",
  citizenship: "Citizenship",
  geography: "Geography",
  values: "Values",
  maps: "Maps",
  // Shared
  mixed: "Mixed",
});

const UNMAPPED_TOPIC_HE = "Topic (unlabeled key)";

/**
 * @param {string} subjectId
 * @returns {string}
 */
export function hebrewSubjectLabel(subjectId) {
  return SUBJECT_DISPLAY_HE[subjectId] || subjectId;
}

/**
 * Primary display line for a topic checkbox. Never returns the raw key as the only label.
 * @param {string} topicKey
 * @returns {string}
 */
export function hebrewTopicPrimary(topicKey) {
  if (topicKey == null || topicKey === "") return UNMAPPED_TOPIC_HE;
  return TOPIC_DISPLAY_HE[topicKey] || UNMAPPED_TOPIC_HE;
}

/**
 * Ensures every current bucket topic has a non-fallback entry (dev-time guard).
 * @returns {string[]} missing internal keys
 */
export function listTopicKeysMissingHebrewLabel() {
  const missing = [];
  for (const sid of Object.keys(SUBJECT_BUCKETS)) {
    const list = SUBJECT_BUCKETS[sid] || [];
    for (const k of list) {
      if (!TOPIC_DISPLAY_HE[k]) missing.push(k);
    }
  }
  return missing;
}
