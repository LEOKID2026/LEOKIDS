/**
 * Primary runtime producer for each of 59 taxonomy rules.
 * A rule is implemented when primaryProducer.active === true and module emits tag at runtime.
 */

/** @typedef {{ tag: string, module: string, generator: string, active: boolean, probeKind?: string|null }} RulePrimaryProducer */

/** @type {Record<string, RulePrimaryProducer>} */
export const RULE_PRIMARY_PRODUCER = Object.freeze({
  "M-01": { tag: "place_value_error", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "place_digit" },
  "M-02": { tag: "carry_error", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "add_vertical" },
  "M-03": { tag: "multiplication_fact_error", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "mul" },
  "M-04": { tag: "numerator_only_compare", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "frac_compare" },
  "M-05": { tag: "common_denominator_error", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "frac_add" },
  "M-06": { tag: "rounding_wrong_direction", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "dec_round" },
  "M-07": { tag: "unit_error", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "wp_unit" },
  "M-08": { tag: "omitted_addend", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "add_three" },
  "M-09": { tag: "add_instead_of_sub", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "sub_two" },
  "M-10": { tag: "wrong_operation_wp", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "wp_" },
  "G-01": { tag: "shape_property_confusion", module: "mcq-option-evidence-tagging", generator: "lib/learning/mcq-option-evidence-tagging.js", active: true, probeKind: "geometry_mcq" },
  "G-02": { tag: "angle_range_error", module: "mcq-option-evidence-tagging", generator: "utils/geometry-question-generator.js", active: true, probeKind: "geometry_mcq" },
  "G-03": { tag: "area_formula_error", module: "mcq-option-evidence-tagging", generator: "utils/geometry-question-generator.js", active: true, probeKind: "geometry_mcq" },
  "G-04": { tag: "transformation_error", module: "mcq-option-evidence-tagging", generator: "utils/geometry-question-generator.js:transform_confusion", active: true, probeKind: "geometry_transform" },
  "G-05": { tag: "volume_formula_error", module: "mcq-option-evidence-tagging", generator: "utils/geometry-question-generator.js", active: true, probeKind: "geometry_mcq" },
  "G-06": { tag: "perimeter_area_confusion", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "rect_area" },
  "G-07": { tag: "symmetry_error", module: "mcq-option-evidence-tagging", generator: "utils/geometry-question-generator.js", active: true, probeKind: "geometry_mcq" },
  "G-08": { tag: "forgot_divide_by_2", module: "math-numeric-classifier", generator: "lib/learning/classifiers/math-numeric-classifier.js", active: true, probeKind: "tri_area" },
  "E-01": { tag: "vocabulary_meaning_error", module: "mcq-option-evidence-tagging", generator: "utils/english-question-generator.js", active: true, probeKind: "vocabulary_mcq" },
  "E-02": { tag: "grammar_error", module: "mcq-option-evidence-tagging", generator: "utils/english-question-generator.js:grammar_forms", active: true, probeKind: "grammar_mcq" },
  "E-03": { tag: "translation_error", module: "mcq-option-evidence-tagging", generator: "data/english-questions/translation-pools.js", active: true, probeKind: "translation_mcq" },
  "E-04": { tag: "preposition_error", module: "mcq-option-evidence-tagging", generator: "utils/english-question-generator.js", active: true, probeKind: "grammar_mcq" },
  "E-05": { tag: "phrasal_verb_error", module: "mcq-option-evidence-tagging", generator: "utils/english-question-generator.js", active: true, probeKind: "grammar_mcq" },
  "E-06": { tag: "sentence_structure_error", module: "mcq-option-evidence-tagging", generator: "utils/english-question-generator.js:same_slot_forms", active: true, probeKind: "sentences_mcq" },
  "E-07": { tag: "spelling_error", module: "english-typed-classifier", generator: "lib/learning/classifiers/english-typed-classifier.js", active: true, probeKind: "spelling_typed" },
  "E-08": { tag: "listening_comprehension_error", module: "mcq-option-evidence-tagging", generator: "data/english-questions/phonics-g1.js", active: true, probeKind: "phonics_mcq" },
  "S-01": { tag: "concept_confusion", module: "mcq-option-evidence-tagging", generator: "data/science-questions.js:expectedErrorTags", active: true, probeKind: "science_mcq" },
  "S-02": { tag: "variable_control_error", module: "mcq-option-evidence-tagging", generator: "data/science-questions.js:expectedErrorTags", active: true, probeKind: "science_mcq" },
  "S-03": { tag: "body_system_confusion", module: "mcq-option-evidence-tagging", generator: "data/science-questions.js:expectedErrorTags", active: true, probeKind: "science_mcq" },
  "S-04": { tag: "material_property_error", module: "mcq-option-evidence-tagging", generator: "data/science-questions.js:expectedErrorTags", active: true, probeKind: "science_mcq" },
  "S-05": { tag: "physical_chemical_confusion", module: "mcq-option-evidence-tagging", generator: "data/science-questions.js:expectedErrorTags", active: true, probeKind: "science_mcq" },
  "S-06": { tag: "planet_confusion", module: "mcq-option-evidence-tagging", generator: "data/science-questions.js:expectedErrorTags", active: true, probeKind: "science_mcq" },
  "S-07": { tag: "ecosystem_confusion", module: "mcq-option-evidence-tagging", generator: "data/science-questions.js:expectedErrorTags", active: true, probeKind: "science_mcq" },
  "S-08": { tag: "animal_classification_error", module: "mcq-option-evidence-tagging", generator: "data/science-questions.js:expectedErrorTags", active: true, probeKind: "science_mcq" },
});

/**
 * @param {string|null|undefined} ruleId
 */
export function primaryProducerForRule(ruleId) {
  const id = String(ruleId || "").trim();
  return RULE_PRIMARY_PRODUCER[id] || null;
}

/**
 * @param {string|null|undefined} ruleId
 */
export function ruleHasPrimaryProducer(ruleId) {
  const p = primaryProducerForRule(ruleId);
  return !!(p && p.active);
}

/**
 * @returns {{ total: number, active: number }}
 */
export function summarizePrimaryProducers() {
  const entries = Object.values(RULE_PRIMARY_PRODUCER);
  return {
    total: entries.length,
    active: entries.filter((p) => p.active).length,
  };
}
