/**
 * Parent-facing English factual labels for classifier-proven tags.
 * Describes what appeared in the answer — not why the child erred.
 * Locale-neutral keys; English strings resolved only in this parent-facing layer.
 */

import { normalizeToCanonicalTag } from "../../lib/learning/taxonomy-tag-normalizer.js";

/** Section heading for topic-card home actions (product copy). */
export const PARENT_TOPIC_HOME_ACTION_HEADING_EN = "What to try together";

/**
 * Factual English noun phrases for active global subjects
 * (math / geometry / english / science). Aliases share canonical wording.
 * Phrasing must work inside: "The same error appeared in N answers: {label}."
 */
export const PROVEN_FACTUAL_PARENT_LABEL_EN = Object.freeze({
  omitted_addend: "addition of only two addends out of three",
  add_instead_of_sub: "addition instead of subtraction",
  mul_instead_of_add: "multiplication instead of addition",
  sub_instead_of_add: "subtraction instead of addition",
  add_instead_of_mul: "addition instead of multiplication",
  mul_instead_of_div: "multiplication instead of division",
  math_decimal_place_shift_error: "a decimal point placed in the wrong position",
  math_percentage_base_error: "an incorrect use of percent, whole, or part",
  math_equation_inverse_error: "an inverse operation used incorrectly in an equation",
  rounding_wrong_direction: "rounding in the wrong direction",
  wrong_operation_wp: "an incorrect arithmetic operation in a word problem",
  unit_error: "an incorrect unit of measure",
  place_value_error: "a place value that did not match the correct answer",
  calculation_off_by_one: "an answer that differed by 1",
  calculation_near_miss: "a calculation that differed slightly from the correct answer",
  carry_error: "an incorrect carrying step in addition",
  regroup_error: "an incorrect carrying step in addition",
  column_carry_error: "an incorrect carrying step in addition",
  borrow_error: "an incorrect regrouping step in subtraction",
  multiplication_fact_error: "an incorrect multiplication-table fact",
  numerator_only_compare: "a fraction comparison based only on the numerator",
  mirror_error: "an incorrect common-denominator step",
  common_denominator_error: "an incorrect common-denominator step",
  fraction_operation_error: "an incorrect common-denominator step",
  forgot_divide_by_2: "a missing divide-by-2 step",
  perimeter_area_confusion: "perimeter used instead of area",
  perimeter_formula_error: "an incorrect perimeter formula",
  volume_formula_error: "an incorrect volume formula",
  area_formula_error: "an incorrect area formula",
  triangle_angle_sum_error: "triangle angle measures that did not add up correctly",
  pythagorean_relation_error: "side lengths added instead of using the Pythagorean relation",
  shape_property_confusion: "a shape property that did not match",
  angle_range_error: "an angle reading that did not match",
  transformation_error: "a geometric transformation that did not match",
  symmetry_error: "a symmetry-axis choice that did not match",
  spelling_pattern_error: "a spelling pattern that did not match the word",
  spelling_error: "a spelling that did not match the target word",
  grammar_error: "a grammar form that did not fit the sentence",
  tense_error: "a verb tense that did not fit the sentence",
  agreement_error: "a subject-verb or number agreement mismatch",
  vocabulary_meaning_error: "a word used with a meaning that did not fit",
  translation_error: "a translation that did not fit the context",
  preposition_error: "a preposition that did not fit the sentence",
  phrasal_verb_error: "a phrasal verb that did not fit the context",
  sentence_structure_error: "word order that did not fit the sentence",
  phonics_minimal_pair_error: "a choice between similar sounds that did not match",
  vocabulary_context_error: "a word that did not fit the context",
  grammar_agreement_error: "a subject-verb or number agreement mismatch",
  reading_comprehension_error: "an answer that did not address the comprehension question",
  homophone_confusion: "a word that sounds similar but did not fit",
  homograph_error: "a word that sounds similar but did not fit",
  verb_tense_error: "a verb tense that did not fit the sentence",
  punctuation_error: "punctuation that did not match the sentence",
  speaking_expression_error: "spoken wording that did not match the prompt",
  concept_confusion: "a science concept that did not match the question",
  variable_control_error: "more than one variable was changed in the experiment",
  body_system_confusion: "body-system order or placement that did not match",
  material_property_error: "a material property description that did not match",
  physical_chemical_confusion: "a physical concept used where a chemical one was needed, or the reverse",
  planet_confusion: "a planet or celestial body that did not match",
  ecosystem_confusion: "an ecosystem level that did not match",
  animal_classification_error: "an animal classification that did not match",
  comparison_error: "a comparison that did not match the required relation",
  math_compare_relation_error: "a comparison symbol that did not match",
  math_scale_operation_error: "a scale operation that did not match",
  math_division_operation_error: "a division operation that did not match",
  math_remainder_error: "a quotient or remainder that did not match",
  math_sequence_step_error: "a step in a number sequence that did not match",
  math_ratio_order_error: "ratio order that did not match",
  math_operation_order_error: "operations computed left-to-right instead of by order of operations",
  math_divisibility_classification_error: "a divisibility conclusion that did not match",
  math_prime_composite_classification_error: "a prime/composite classification that did not match",
  math_power_as_multiplication_error: "the base multiplied by the exponent instead of a power calculation",
  math_identity_property_error: "an identity (zero or one) property used incorrectly",
  math_estimation_strategy_error: "an estimate used where an exact result was required",
  math_gcd_smaller_input_error: "a greatest-common-divisor choice that did not match",
});

/**
 * Only these classifier-proven keys (and aliases that normalize into them)
 * may enter factualObservations. Legacy pattern-family keys are excluded.
 */
export const FACTUAL_OBSERVATION_APPROVED_TAGS = Object.freeze(
  new Set(Object.keys(PROVEN_FACTUAL_PARENT_LABEL_EN)),
);

/** Legacy learning-pattern family keys — sanitize/display only, NOT factualObservations. */
export const LEGACY_PATTERN_FAMILY_LABEL_EN = Object.freeze({
  procedural_error: "a solving method that did not fit the question",
  procedure_break: "solution steps or order of operations that did not match",
  calculation_error: "a calculation or order-of-operations mismatch",
  conceptual_error: "an answer that did not match the required concept",
  conceptual_misunderstanding: "an answer that did not match the required concept",
  strategy_gap: "a strategy choice that did not fit the question",
  prerequisite_gap: "an answer that pointed to a prior-skill gap",
  reading_comprehension_issue: "an answer that did not match the question or text",
  vocabulary_gap: "a word or term that did not fit the question",
  phonics_gap: "letter or sound decoding that did not match",
  inference_gap: "a conclusion not supported by the information given",
  speed_pressure: "errors that appeared during fast work",
  careless_or_attention: "small execution slips that repeated",
  guessing_or_unstable: "answers that varied across attempts",
  careless_error: "small execution slips that repeated",
  careless_pattern: "small execution slips that repeated",
  operation_selection_error: "an operation choice that did not fit the question",
  fraction_concept_error: "an answer that did not match the fraction concept",
  word_problem_reading: "an answer that did not match the wording of the question",
  instruction_misread: "an answer that did not match the instruction",
  support_dependent_success: "success mainly with hints or guided support",
  recurring_weakness: "the same kind of error repeating in the activity",
  speed_driven_error: "errors that appeared during fast work",
});

export const PARENT_ERROR_PATTERN_LABEL_EN = Object.freeze({
  ...PROVEN_FACTUAL_PARENT_LABEL_EN,
  ...LEGACY_PATTERN_FAMILY_LABEL_EN,
});

/**
 * @param {string|null|undefined} tag
 */
export function isApprovedFactualObservationTag(tag) {
  const raw = String(tag || "")
    .trim()
    .toLowerCase()
    .replace(/^(mt|pf|st|ct|k|to):/i, "");
  if (!raw) return false;
  if (FACTUAL_OBSERVATION_APPROVED_TAGS.has(raw)) return true;
  const canon = normalizeToCanonicalTag(raw);
  return !!(canon && FACTUAL_OBSERVATION_APPROVED_TAGS.has(canon));
}

/**
 * @param {string|null|undefined} label
 */
export function parentFacingErrorPatternLabelEn(label) {
  const raw = String(label || "").trim().toLowerCase();
  if (!raw) return "";
  if (PARENT_ERROR_PATTERN_LABEL_EN[raw]) return PARENT_ERROR_PATTERN_LABEL_EN[raw];
  const stripped = raw.replace(/^(mt|pf|st|ct|k|to):/i, "");
  if (stripped && PARENT_ERROR_PATTERN_LABEL_EN[stripped]) {
    return PARENT_ERROR_PATTERN_LABEL_EN[stripped];
  }
  return "";
}

/**
 * Proven factual label only (empty for legacy family keys).
 * @param {string|null|undefined} label
 */
export function provenFactualParentLabelEn(label) {
  const raw = String(label || "").trim().toLowerCase();
  if (!raw) return "";
  if (PROVEN_FACTUAL_PARENT_LABEL_EN[raw]) return PROVEN_FACTUAL_PARENT_LABEL_EN[raw];
  const stripped = raw.replace(/^(mt|pf|st|ct|k|to):/i, "");
  if (stripped && PROVEN_FACTUAL_PARENT_LABEL_EN[stripped]) {
    return PROVEN_FACTUAL_PARENT_LABEL_EN[stripped];
  }
  const canon = normalizeToCanonicalTag(stripped || raw);
  if (canon && PROVEN_FACTUAL_PARENT_LABEL_EN[canon]) {
    return PROVEN_FACTUAL_PARENT_LABEL_EN[canon];
  }
  return "";
}

/**
 * @param {string|null|undefined} label
 */
export function isTechnicalEnglishPatternKey(label) {
  const raw = String(label || "").trim();
  if (!raw || /[\u0590-\u05FF]/.test(raw)) return false;
  if (/^(pf|k|to|st|ct|mt):/i.test(raw)) {
    const stripped = raw.replace(/^(pf|k|to|st|ct|mt):/i, "");
    if (PARENT_ERROR_PATTERN_LABEL_EN[stripped.toLowerCase()]) return false;
    return true;
  }
  if (/^default_[a-z0-9_]+$/i.test(raw)) return true;
  return /^[a-z][a-z0-9_]*$/i.test(raw);
}

/**
 * @param {string|null|undefined} label
 */
export function resolveParentFacingPatternLabelEn(label) {
  const raw = String(label || "").trim();
  if (!raw) return "";
  const mapped = parentFacingErrorPatternLabelEn(raw);
  if (mapped) return mapped;
  if (isTechnicalEnglishPatternKey(raw)) return "";
  return raw;
}

/** @deprecated Prefer parentFacingErrorPatternLabelEn — kept for gradual migration. */
export const parentFacingErrorPatternLabel = parentFacingErrorPatternLabelEn;
