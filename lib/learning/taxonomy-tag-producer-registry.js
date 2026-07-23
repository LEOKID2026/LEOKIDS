/**
 * Active evidence-tag producers — a rule is not implemented unless at least one
 * required tag has an active producer listed here.
 */

import { RULE_PRIMARY_PRODUCER } from "./taxonomy-rule-primary-producers.js";

/** @typedef {"math-numeric-classifier"|"math-mcq-infer"|"mcq-distractor-classifier"|"hebrew-typed-classifier"|"english-typed-classifier"|"geometry-numeric-classifier"|"question-bank-static"|"probe-params"} ProducerModule */

/**
 * @typedef {Object} TagProducer
 * @property {ProducerModule} module
 * @property {string} generator
 * @property {boolean} active
 * @property {string} [notes]
 */

/** @type {Record<string, TagProducer>} */
export const TAG_PRODUCER_REGISTRY = Object.freeze({
  omitted_addend: {
    module: "math-numeric-classifier",
    generator: "utils/math-question-generator.js:inferMathDistractorFamily",
    active: true,
  },
  omitted_step: {
    module: "math-numeric-classifier",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
    notes: "multi-step probe expectedErrorTags",
  },
  multi_step_failure: {
    module: "math-numeric-classifier",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
  },
  wrong_final_step: {
    module: "math-numeric-classifier",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
  },
  add_instead_of_sub: {
    module: "math-numeric-classifier",
    generator: "utils/math-question-generator.js:inferMathDistractorFamily",
    active: true,
  },
  operand_reversal: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
  },
  reverse_direction: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
    notes: "alias of operand_reversal family",
  },
  add_instead_of_mul: {
    module: "math-numeric-classifier",
    generator: "utils/math-question-generator.js:inferMathDistractorFamily",
    active: true,
  },
  wrong_operation_wp: {
    module: "math-numeric-classifier",
    generator: "utils/math-question-generator.js:inferMathDistractorFamily",
    active: true,
  },
  mul_instead_of_div: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
    notes: "operation_confusion probe tag",
  },
  inverse_operation_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
  },
  rounding_wrong_direction: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
  },
  place_value_error: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
  },
  number_sense_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
  },
  representation_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: false,
    notes: "no deterministic numeric path yet",
  },
  carry_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: false,
    notes: "probe tag only; no typed classifier",
  },
  regroup_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: false,
  },
  column_carry_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: false,
  },
  fact_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
    notes: "multiplication_fact_gap probe",
  },
  multiplication_fact_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
  },
  numerator_only_compare: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
  },
  denominator_only_compare: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
  },
  fraction_compare_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
    notes: "adds_denominators_directly / wrong_lcm",
  },
  mirror_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
  },
  common_denominator_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
  },
  fraction_operation_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: true,
  },
  decimal_place_error: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
    notes: "shares place_value_error path",
  },
  unit_error: {
    module: "math-numeric-classifier",
    generator: "utils/math-question-generator.js:inferMathDistractorFamily",
    active: false,
  },
  wrong_unit: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: false,
  },
  unit_conversion_error: {
    module: "math-mcq-infer",
    generator: "utils/math-question-generator.js:probe-params",
    active: false,
  },
  forgot_divide_by_2: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
  },
  perimeter_area_confusion: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
  },
  volume_perimeter_confusion: {
    module: "geometry-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: false,
  },
  volume_formula_error: {
    module: "geometry-numeric-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  height_base_confusion: {
    module: "geometry-numeric-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  area_formula_error: {
    module: "geometry-numeric-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  parallelogram_area_error: {
    module: "geometry-numeric-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  formula_error: {
    module: "geometry-numeric-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  triangle_area_error: {
    module: "math-numeric-classifier",
    generator: "lib/learning/classifiers/math-numeric-classifier.js",
    active: true,
  },
  shape_property_confusion: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  quadrilateral_confusion: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  parallel_perpendicular_confusion: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  angle_range_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  protractor_reading_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  transformation_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js:transform_confusion",
    active: true,
  },
  rotation_direction_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js:transform_confusion",
    active: true,
  },
  symmetry_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  symmetry_axis_confusion: {
    module: "mcq-distractor-classifier",
    generator: "utils/geometry-question-generator.js",
    active: false,
  },
  spelling_error: {
    module: "english-typed-classifier",
    generator: "lib/learning/classifiers/english-typed-classifier.js",
    active: true,
  },
  writing_error: {
    module: "english-typed-classifier",
    generator: "lib/learning/classifiers/english-typed-classifier.js",
    active: true,
  },
  grammar_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js:grammar_forms",
    active: true,
  },
  tense_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js:same_slot_forms",
    active: true,
  },
  agreement_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js:grammar_forms",
    active: true,
  },
  vocabulary_meaning_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  collocation_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  word_choice_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  translation_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  word_order_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  preposition_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  article_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  preposition_phrase_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  phrasal_verb_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  sentence_structure_error: {
    module: "mcq-distractor-classifier",
    generator: "utils/english-question-generator.js",
    active: false,
  },
  listening_comprehension_error: {
    module: "question-bank-static",
    generator: "data/english-questions",
    active: false,
  },
  concept_confusion: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  classification_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  classification_confusion: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  variable_control_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  experiment_design_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  body_system_confusion: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  organ_function_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  material_property_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  state_of_matter_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  material_change_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  physical_chemical_confusion: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  earth_space_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  planet_confusion: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  environment_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  ecosystem_confusion: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  animal_classification_error: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
  habitat_confusion: {
    module: "mcq-distractor-classifier",
    generator: "data/science-questions.js",
    active: false,
  },
});

/**
 * @param {string|null|undefined} tag
 * @returns {TagProducer|null}
 */
export function getTagProducer(tag) {
  const t = String(tag || "").trim();
  if (!t) return null;
  const explicit = TAG_PRODUCER_REGISTRY[t];
  if (explicit?.active) return explicit;

  const fromPrimary = Object.values(RULE_PRIMARY_PRODUCER).find((p) => p.active && p.tag === t);
  if (fromPrimary) {
    return {
      module: /** @type {ProducerModule} */ (fromPrimary.module),
      generator: fromPrimary.generator,
      active: true,
    };
  }

  return explicit || null;
}

/**
 * @param {string|null|undefined} tag
 */
export function hasActiveTagProducer(tag) {
  const p = getTagProducer(tag);
  return !!(p && p.active);
}

/**
 * @param {string[]} requiredTags
 */
export function ruleHasActiveProducer(requiredTags) {
  if (!Array.isArray(requiredTags) || requiredTags.length === 0) return false;
  return requiredTags.some((t) => hasActiveTagProducer(t));
}

/**
 * @returns {{ activeTags: number, totalTags: number, activeProducers: number }}
 */
export function summarizeTagProducerRegistry() {
  const entries = Object.entries(TAG_PRODUCER_REGISTRY);
  return {
    totalTags: entries.length,
    activeTags: entries.filter(([, p]) => p.active).length,
    activeProducers: entries.filter(([, p]) => p.active).length,
  };
}
