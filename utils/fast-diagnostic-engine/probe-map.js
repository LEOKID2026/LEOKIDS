/**
 * Deterministic next-probe hints by normalized error tag or diagnosticSkillId.
 * Used when dominantTag / skill matches; FastDiagnosticEngine keeps generic fallback otherwise.
 */

/** @typedef {{ skill: string, suggestedQuestionType: string, reasonHe: string }} ProbeHint */

/** @type {Record<string, ProbeHint>} */
export const PROBE_BY_ERROR_TAG = {
  adds_denominators_directly: {
    skill: "Finding a common denominator before adding fractions",
    suggestedQuestionType: "fraction_common_denominator_only",
    reasonHe:
      "Check whether the difficulty is finding a common denominator before the addition itself, with short questions on a single common denominator only.",
  },
  wrong_lcm: {
    skill: "Understanding the least common denominator",
    suggestedQuestionType: "fraction_lcm_pair_compare",
    reasonHe:
      "Run pairs of small denominators and ask to identify the least common denominator before combining.",
  },
  ignores_denominator: {
    skill: "Linking numerator–denominator in fraction operations",
    suggestedQuestionType: "fraction_same_den_twice",
    reasonHe: "Strengthen the link between numerator and denominator before combining two fractions.",
  },
  concept_gap: {
    skill: "Understanding a fraction as a ratio",
    suggestedQuestionType: "fraction_meaning_visual",
    reasonHe: "Show a visual representation of the fraction as a ratio before the addition algorithm.",
  },
  operation_confusion: {
    skill: "Distinguishing addition from multiplication of fractions",
    suggestedQuestionType: "fraction_operation_gate",
    reasonHe: "Explicitly choose one operation (add/subtract/multiply) with a short guiding sentence.",
  },
  tense_confusion: {
    skill: "Matching tense to a time word or subject",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Choose minimal pairs (e.g. past/present) with the same root and a clear time word.",
  },
  grammar_pattern_error: {
    skill: "Matching verb form to the subject",
    suggestedQuestionType: "english_subject_verb_agreement_short",
    reasonHe: "Isolate short sentences with singular/plural subjects and matching verb forms.",
  },
  vocabulary_gap: {
    skill: "Vocabulary in a short sentence",
    suggestedQuestionType: "english_vocab_in_context_cloze",
    reasonHe: "Complete a word in a short sentence with clear context (not a standalone word list).",
  },
  comprehension_gap: {
    skill: "A focused comprehension question on a short paragraph",
    suggestedQuestionType: "hebrew_read_explicit_detail",
    reasonHe: "Read a short paragraph and answer one question that requires explicit information from the text.",
  },
  detail_recall_error: {
    skill: "Locating an explicit detail in the text",
    suggestedQuestionType: "hebrew_detail_scan_short",
    reasonHe: "Ask to locate one detail that appeared explicitly, without inferences.",
  },
  inference_error: {
    skill: "Controlled inference from the text",
    suggestedQuestionType: "hebrew_inference_one_step",
    reasonHe: "A short sentence with a question that requires one inference step grounded in the text.",
  },
  sequence_error: {
    skill: "Ordering events from the text",
    suggestedQuestionType: "hebrew_sequence_three_steps",
    reasonHe: "Present three events and ask for a sensible order based on the wording.",
  },
  concept_confusion: {
    skill: "Distinguishing closely related science concepts",
    suggestedQuestionType: "science_concept_minimal_contrast",
    reasonHe: "Present two adjacent concepts and choose one correct definition from the shortened text.",
  },
  fact_recall_gap: {
    skill: "Recalling a fact from the lesson",
    suggestedQuestionType: "science_fact_one_line_recall",
    reasonHe: "A short question with one tight answer from the material learned.",
  },
  cause_effect_gap: {
    skill: "Cause–effect relationship",
    suggestedQuestionType: "science_cause_effect_pair",
    reasonHe: "Choose what comes from the cause and what from the effect in a simple situation.",
  },
  classification_error: {
    skill: "Classifying by a single criterion",
    suggestedQuestionType: "science_single_criterion_sort",
    reasonHe: "Present a small set and ask to classify by one clear attribute.",
  },
  place_value_error: {
    skill: "Place value of a digit",
    suggestedQuestionType: "place_value_digit_value",
    reasonHe: "Isolate the place value of one digit in a number in a short exercise.",
  },
  multiplication_fact_gap: {
    skill: "Multiplication table facts",
    suggestedQuestionType: "multiplication_fact_check",
    reasonHe: "A short direct multiplication question from the multiplication table.",
  },
  /** Geometry-only slip tag (infer-tags emits this instead of generic calculation_slip for geometry). */
  geometry_calculation_slip: {
    skill: "Choosing a formula or first step in geometry",
    suggestedQuestionType: "geometry_formula_choice",
    reasonHe: "Choose an appropriate formula or first step before numerical calculation.",
  },
  prerequisite_gap: {
    skill: "Prerequisite concept",
    suggestedQuestionType: "geometry_concept_minimal_contrast",
    reasonHe: "Reinforce a foundational concept before continuing.",
  },
  spelling_pattern_error: {
    skill: "Spelling in short context",
    suggestedQuestionType: "english_vocab_in_context_cloze",
    reasonHe: "Complete a word in a sentence with clear context.",
  },
  present_simple_3rd_singular_error: {
    skill: "Third-person verb form in the simple present",
    suggestedQuestionType: "english_subject_verb_agreement_short",
    reasonHe: "Isolate short sentences with he/she/it and choose the matching verb form.",
  },
  past_tense_form_error: {
    skill: "Simple past form",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Choose minimal past/present pairs with the same root.",
  },
  progressive_aspect_error: {
    skill: "Present continuous (am/is/are + V-ing)",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Check the choice between a continuous action and a simple tense.",
  },
  question_word_order_error: {
    skill: "Word order in a question",
    suggestedQuestionType: "english_question_frame_word_order",
    reasonHe: "Isolate short question sentences with do/does/is/are in the right place.",
  },
  modal_verb_error: {
    skill: "Helping verbs (can/must/should)",
    suggestedQuestionType: "english_modal_minimal_pair",
    reasonHe: "Choose between two helping verbs in a short sentence with the same main verb.",
  },
  quantifier_choice_error: {
    skill: "Quantifiers (some/many/much)",
    suggestedQuestionType: "english_quantifier_minimal_pair",
    reasonHe: "Distinguish countable vs. uncountable quantity in a short sentence.",
  },
  comparative_form_error: {
    skill: "Comparison form",
    suggestedQuestionType: "english_comparative_form_short",
    reasonHe: "Choose -er/-est or more/most in a short sentence.",
  },
  future_form_error: {
    skill: "Future (will / going to)",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Choose between will and going to in a clear context.",
  },
  perfect_aspect_error: {
    skill: "Perfect tenses (have/had + V3)",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Check a perfect form against a simple tense in the same context.",
  },
  conditional_clause_error: {
    skill: "Conditional sentence",
    suggestedQuestionType: "english_conditional_clause_short",
    reasonHe: "Isolate if/when with a matching verb form in one person.",
  },
  sentence_structure_error: {
    skill: "Sentence structure",
    suggestedQuestionType: "english_subject_verb_agreement_short",
    reasonHe: "Isolate short sentences with consistent word order and verb form.",
  },
  advanced_grammar_error: {
    skill: "Advanced grammar",
    suggestedQuestionType: "english_subject_verb_agreement_short",
    reasonHe: "Isolate one sentence with a clear grammar pattern to check.",
  },
  place_identification_error: {
    skill: "Identifying a place/settlement",
    suggestedQuestionType: "moledet_place_identification_short",
    reasonHe: "A short question about location or settlement type from the material.",
  },
};

/** Shared fallback when only generic grammar_pattern_error is inferred. */
const EN_GRAMMAR_PROBE_FALLBACK = {
  skill: "Matching verb form to the subject",
  suggestedQuestionType: "english_subject_verb_agreement_short",
  reasonHe: "Isolate short sentences with singular/plural subjects and matching verb forms.",
};

/** @type {Record<string, ProbeHint>} */
export const PROBE_BY_DIAGNOSTIC_SKILL_ID = {
  math_frac_same_den: {
    skill: "Adding/subtracting fractions with the same denominator",
    suggestedQuestionType: "fraction_same_den_twice",
    reasonHe: "Confirm stability in the numerator when the denominator is already shared.",
  },
  math_frac_common_denominator: {
    skill: "Finding a common denominator before adding",
    suggestedQuestionType: "fraction_common_denominator_only",
    reasonHe:
      "First check the common-denominator step without skipping straight to the final answer.",
  },
  en_grammar_be_present: {
    skill: "Be forms with the subject",
    suggestedQuestionType: "english_be_agreement_gate",
    reasonHe: "Isolate sentences with I/he/they and choose the matching be form.",
  },
  en_grammar_present_simple: {
    skill: "Simple present - subject–verb agreement",
    suggestedQuestionType: "english_subject_verb_agreement_short",
    reasonHe: "Isolate short sentences with he/she/it and choose the matching verb form.",
  },
  en_grammar_past_simple: {
    skill: "Simple past",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Choose minimal past/present pairs with the same root.",
  },
  en_grammar_progressive: {
    skill: "Present continuous",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Check the choice between a continuous action and a simple tense.",
  },
  en_grammar_question_frames: {
    skill: "Question frames",
    suggestedQuestionType: "english_question_frame_word_order",
    reasonHe: "Isolate short question sentences with do/does/is/are in the right place.",
  },
  en_grammar_modals: {
    skill: "Helping verbs",
    suggestedQuestionType: "english_modal_minimal_pair",
    reasonHe: "Choose between two helping verbs in a short sentence.",
  },
  en_grammar_quantifiers: {
    skill: "Quantifiers",
    suggestedQuestionType: "english_quantifier_minimal_pair",
    reasonHe: "Distinguish some/many/much in a short sentence.",
  },
  en_grammar_comparatives: {
    skill: "Comparison",
    suggestedQuestionType: "english_comparative_form_short",
    reasonHe: "Choose a comparison form in a short sentence.",
  },
  en_grammar_future_forms: {
    skill: "Future",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Choose between will and going to in a clear context.",
  },
  en_grammar_complex_tenses: {
    skill: "Perfect tenses",
    suggestedQuestionType: "english_tense_minimal_pair",
    reasonHe: "Check perfect vs. a simple tense in the same context.",
  },
  en_grammar_conditionals: {
    skill: "Conditionals",
    suggestedQuestionType: "english_conditional_clause_short",
    reasonHe: "Isolate if/when with a matching verb form.",
  },
  /** phase29 standard/advanced: intentional generic grammar probe (no separate UI type). */
  en_grammar_phase29_standard: EN_GRAMMAR_PROBE_FALLBACK,
  en_grammar_phase29_advanced: {
    ...EN_GRAMMAR_PROBE_FALLBACK,
    skill: "Advanced grammar - intermediate step",
    reasonHe: "Isolate one sentence with a clear grammar pattern to check.",
  },
  he_comp_explicit_detail: {
    skill: "Retrieving an explicit detail from a short text",
    suggestedQuestionType: "hebrew_explicit_detail_one_line",
    reasonHe: "A short paragraph and a question that points to a specific sentence.",
  },
  sci_body_fact_recall: {
    skill: "Recalling a body/systems fact",
    suggestedQuestionType: "science_fact_single_choice",
    reasonHe: "One tight fact question from the material about the organ or system.",
  },
  sci_respiration_concept: {
    skill: "Role of the respiratory system in gas exchange",
    suggestedQuestionType: "science_concept_minimal_contrast",
    reasonHe: "Distinguish blood transport from oxygen/CO2 exchange with the air.",
  },
  moledet_geo_homeland: {
    skill: "Homeland studies - basic facts",
    suggestedQuestionType: "moledet_fact_one_line_recall",
    reasonHe: "A short fact question about Israel/settlements.",
  },
  moledet_geo_community: {
    skill: "Community - roles and institutions",
    suggestedQuestionType: "moledet_fact_one_line_recall",
    reasonHe: "A short question about community life from the material.",
  },
  moledet_geo_citizenship: {
    skill: "Civics - basics",
    suggestedQuestionType: "moledet_concept_minimal_contrast",
    reasonHe: "Distinguish two civics concepts in a short sentence.",
  },
  moledet_geo_geography: {
    skill: "Geography - landscape and climate",
    suggestedQuestionType: "moledet_fact_one_line_recall",
    reasonHe: "A fact question about landscape/climate/settlements.",
  },
  moledet_geo_values: {
    skill: "Values and identity",
    suggestedQuestionType: "moledet_fact_one_line_recall",
    reasonHe: "A short question about a value or tradition from the lesson.",
  },
  moledet_geo_maps: {
    skill: "Map reading",
    suggestedQuestionType: "moledet_map_reading_short",
    reasonHe: "A short map question with a clear scale or direction.",
  },
};

/**
 * @param {object} p
 * @param {string} [p.dominantTag]
 * @param {string|null} [p.dominantDiagnosticSkillId]
 */
export function resolveProbeHintFromMap({ dominantTag, dominantDiagnosticSkillId }) {
  const tag = dominantTag ? String(dominantTag) : "";
  const sid = dominantDiagnosticSkillId ? String(dominantDiagnosticSkillId) : "";
  if (tag && PROBE_BY_ERROR_TAG[tag]) return PROBE_BY_ERROR_TAG[tag];
  if (sid && PROBE_BY_DIAGNOSTIC_SKILL_ID[sid]) return PROBE_BY_DIAGNOSTIC_SKILL_ID[sid];
  return null;
}
