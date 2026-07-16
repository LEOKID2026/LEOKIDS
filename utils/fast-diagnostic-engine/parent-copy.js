/**
 * Deterministic English copy for fast diagnosis (no LLM).
 */

/** @type {Record<string, string>} */
export const TAG_LABEL_EN = {
  calculation_slip: "A brief calculation slip",
  concept_gap: "Gap in understanding the concept",
  strategy_error: "Choosing an unsuitable solution approach",
  instruction_misread: "Misreading the wording",
  repeated_misconception: "A repeating incorrect pattern",
  guessing_pattern: "Guessing instead of checking",
  speed_block: "Speed pressure affecting accuracy",
  attention_variability: "Focus that varies across questions",
  prerequisite_gap: "Unstable prior concept",
  language_comprehension_gap: "Language comprehension",
  decoding_error: "Letter/sound decoding",
  comprehension_gap: "Reading comprehension",
  detail_recall_error: "Recalling details from the text",
  inference_error: "Inferring from the text",
  vocabulary_gap: "Vocabulary",
  sequence_error: "Order of steps or information",
  grammar_pattern_error: "Grammar pattern",
  tense_confusion: "Verb tense confusion",
  reading_comprehension_gap: "Overall text understanding",
  spelling_pattern_error: "Spelling pattern",
  fact_recall_gap: "Recalling facts",
  cause_effect_gap: "Cause–effect relationship",
  classification_error: "Classification",
  map_reading_gap: "Map/key reading",
  adds_denominators_directly: "Adding fractions without a common denominator",
  wrong_lcm: "Choosing a common denominator",
  ignores_denominator: "Ignoring the denominator",
  operation_confusion: "Confusion between operations",
  place_value_error: "Place value",
  multiplication_fact_gap: "Multiplication facts",
  concept_confusion: "Concept confusion",
};

/** @deprecated alias — values are US English */
export const TAG_LABEL_HE = TAG_LABEL_EN;

/**
 * @param {string[]} suspectedTags
 * @returns {string}
 */
export function tagsSummaryEn(suspectedTags) {
  const labels = suspectedTags
    .map((t) => TAG_LABEL_EN[t] || "")
    .filter(Boolean)
    .slice(0, 3);
  if (!labels.length) return "";
  return labels.join(" · ");
}

/** @deprecated alias */
export const tagsSummaryHe = tagsSummaryEn;
