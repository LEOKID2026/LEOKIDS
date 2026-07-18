import { burnDownCopy } from "../../lib/learning/burn-down-copy.js";
/**
 * Deterministic fixtures for parent narrative safety selftest (Hebrew copy).
 */

/**
 * @typedef {object} ParentNarrativeFixture
 * @property {string} id
 * @property {string} description
 * @property {string} narrativeText
 * @property {Record<string, unknown>} engineOutput
 * @property {Record<string, unknown>} [reportContext]
 * @property {"he"} [locale]
 * @property {"pass"|"warning"|"block"} expectStatus
 * @property {boolean} expectOk
 */

/** @type {ParentNarrativeFixture[]} */
export const PARENT_NARRATIVE_SAFETY_FIXTURES = [
  {
    id: "safe_observational_he",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "safe_hebrew_parent_narrative_with_observational_tone_and_adequate_volume"),
    narrativeText:
      "נראה שההתקדמות בנושא עקבית. מהנתונים כאן אין עומס חריג - כדאי להמשיך בתרגול קצר פעמיים בשבוע לשמירה על שגרה.",
    engineOutput: {
      questionCount: 42,
      dataSufficiencyLevel: "strong",
      engineConfidence: "medium",
      recommendationTier: "advance_ok",
    },
    reportContext: { surface: "short" },
    locale: "he",
    expectStatus: "pass",
    expectOk: true,
  },
  {
    id: "thin_data_cautious_wording",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "thin_evidence_but_explicit_cautious_hedging_should_not_block"),
    narrativeText:
      "עדיין מוקדם לקבוע כיוון סופי. ייתכן שכדאי חיזוק קל - כדאי לאסוף עוד מעט תרגול לפני שמחליטים על צעד הבא.",
    engineOutput: {
      thinData: true,
      questionCount: 4,
      dataSufficiencyLevel: "weak",
      engineConfidence: "low",
      recommendationTier: "maintain",
    },
    expectStatus: "pass",
    expectOk: true,
  },
  {
    id: "thin_data_overconfident",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "thin_evidence_with_strong_certainty_and_mastery_claim_block"),
    narrativeText: "בוודאות הילד כבר שליטה מלאה בחומר ואין צורך בתרגול נוסף בכלל.",
    engineOutput: {
      thinData: true,
      questionCount: 3,
      dataSufficiencyLevel: "thin",
    },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "do_not_conclude_ignored",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "engine_lists_do_not_conclude_barriers_but_text_uses_absolute_certainty"),
    narrativeText:
      "ברור שחסרה הבנה יסודית לחלוטין, וחד משמעי שיש לטפל בזה מיד - אין ספק בכך.",
    engineOutput: {
      doNotConclude: ["אין להסיק לקות או אבחון לפי מבחן בית בלבד"],
      questionCount: 20,
      engineConfidence: "medium",
    },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "medical_diagnostic_unsafe",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "disability_clinical_framing_block"),
    narrativeText: "ייתכן שמדובר בדיסלקציה; מומלץ אבחון קליני מיידי.",
    engineOutput: { questionCount: 30, engineConfidence: "low" },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "unsupported_recommendation_escalation",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "engine_allows_maintenance_only_narrative_forces_level_jump"),
    narrativeText: "יש להעלות את הרמה מיד ולבצע קפיצה לרמה גבוהה - חובה להתקדם בלי לחכות.",
    engineOutput: {
      recommendationTier: "maintain_only",
      recommendedNextStepHe: "תרגול קצר וממוקד פעמיים בשבוע על אותו נושא",
      questionCount: 18,
    },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "contradiction_engine_confidence_low",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "engine_confidence_low_but_parent_text_is_fully_certain"),
    narrativeText: "בוודאות הנושא נסגר לחלוטין והבנת הילד מושלמת בלי מקום לספק.",
    engineOutput: {
      engineConfidence: "low",
      questionCount: 12,
      dataSufficiencyLevel: "medium",
    },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "permanent_fixed_ability",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "permanent_failure_never_succeed_framing_block"),
    narrativeText: "הילד תמיד נכשל בחישוב ולעולם לא יצליח ליישב את זה - זו עמדה קבועה.",
    engineOutput: { questionCount: 25 },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "guessing_presented_as_mastery",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "high_guessing_signal_but_narrative_claims_full_mastery"),
    narrativeText: "יש שליטה מלאה בנושא והכל מושלם; אפשר לדלג על חזרות.",
    engineOutput: {
      guessingLikelihoodHigh: true,
      questionCount: 30,
      engineConfidence: "medium",
    },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "prerequisite_issue_overstated",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "only_suspected_prerequisite_gap_narrative_states_proof_level_gap"),
    narrativeText: "חוסר יסוד מוכח לחלוטין במבנה המספרים - אין ספק שזה חוסר קודם שלם.",
    engineOutput: {
      prerequisiteGapLevel: "suspected",
      questionCount: 15,
    },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "unsafe_must_not_say_token",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "internal_taxonomy_token_leaked_into_parent_copy_block"),
    narrativeText: "לפי mappings במערכת הטקסונומיה המומלצת, נבחר צעד הבא.",
    engineOutput: { questionCount: 22 },
    expectStatus: "block",
    expectOk: false,
  },
  {
    id: "safe_thin_statistical_dal_line",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "realistic_thin_data_statistical_restraint_line_pass_info_safe_thin_cauti"),
    narrativeText: "נתון דל - לא מסכמים ביטחון סטטיסטי ברמת המקצוע.",
    engineOutput: {
      thinData: true,
      questionCount: 3,
      dataSufficiencyLevel: "thin",
      engineConfidence: "low",
    },
    expectStatus: "pass",
    expectOk: true,
  },
  {
    id: "safe_collect_more_examples_before_decision",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "explicit_collect_more_examples_framing_pass_info"),
    narrativeText: "כדאי להמשיך לאסוף עוד דוגמאות לפני החלטה משמעותית על צעד הבא.",
    engineOutput: { thinData: true, questionCount: 4 },
    expectStatus: "pass",
    expectOk: true,
  },
  {
    id: "unsafe_determine_weakness_from_two_questions",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "thin_data_but_claims_determinability_significant_weakness_warning"),
    narrativeText: "על בסיס שתי שאלות ניתן לקבוע חולשה משמעותית בנושא.",
    engineOutput: { thinData: true, questionCount: 2 },
    expectStatus: "warning",
    expectOk: true,
  },
  {
    id: "unsafe_insufficient_but_clear_problem_assertion",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "acknowledges_lack_of_data_then_asserts_clear_problem_warning"),
    narrativeText: "אין מספיק מידע, אבל יש בעיה ברורה בנושא שכדאי לטפל בה.",
    engineOutput: { thinData: true, questionCount: 3 },
    expectStatus: "warning",
    expectOk: true,
  },
  {
    id: "ambiguous_thin_no_explicit_anchor",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "thin_row_but_vague_narrative_without_explicit_limited_data_framing_warni"),
    narrativeText: "הביצועים משתנים מפעם לפעם; לפעמים טוב ולפעמים פחות, בלי דפוס ברור.",
    engineOutput: { thinData: true, questionCount: 4 },
    expectStatus: "warning",
    expectOk: true,
  },
  {
    id: "thin_despite_little_data_clear_child_struggles",
    description: burnDownCopy("utils__parent-narrative-safety__parent-narrative-safety-fixtures", "despite_little_data_absolute_clarity_about_struggle_overconfidence_thin_"),
    narrativeText: "למרות שיש מעט נתונים, ברור שהילד מתקשה בחומר וצריך התערבות מיידית.",
    engineOutput: { thinData: true, questionCount: 3 },
    expectStatus: "block",
    expectOk: false,
  },
];
