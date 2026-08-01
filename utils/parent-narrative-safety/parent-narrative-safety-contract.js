/**
 * Parent narrative safety — shared patterns and engine snapshot shape (validation-only).
 * Hebrew product copy is validated; English comments only.
 */

/** @typedef {"pass"|"warning"|"block"} NarrativeSafetyStatus */
/** @typedef {"none"|"low"|"medium"|"high"} NarrativeSafetySeverity */

/**
 * Minimal engine snapshot for guard checks (subset of real report / V2 payloads).
 * Unknown fields are ignored.
 *
 * @typedef {object} ParentNarrativeEngineOutput
 * @property {string[]} [doNotConclude]
 * @property {boolean} [cannotConclude]
 * @property {boolean} [thinData]
 * @property {number} [questionCount]
 * @property {"strong"|"medium"|"weak"|"thin"|"low"|"insufficient"} [dataSufficiencyLevel]
 * @property {"high"|"medium"|"low"|"insufficient"} [engineConfidence]
 * @property {"strong"|"moderate"|"weak"|"withheld"} [conclusionStrengthAllowed]
 * @property {string|null} [recommendedNextStepHe]
 * @property {"maintain"|"maintain_only"|"advance_ok"|"none"} [recommendationTier]
 * @property {"suspected"|"confirmed"|"none"|null} [prerequisiteGapLevel]
 * @property {boolean} [guessingLikelihoodHigh]
 * @property {string[]} [mustNotSay]
 */

/**
 * @typedef {object} ParentNarrativeReportContext
 * @property {"short"|"detailed"|"topic_row"|"letter"|"copilot"|"other"} [surface]
 * @property {string} [subjectId]
 */

/** Clinical / medical / disability-framing — parent report must not use (block). */
export const MEDICAL_DIAGNOSTIC_RES = [
  //u,
  /\s*/u,
  /\s*|ADHD/u,
  /\s*|\s*/u,
  /\s*|\s*|\s*/u,
  /\s*|\s*/u];

/** Absolute certainty — risky when engine forbids strong conclusions or has low confidence. */
export const OVERCONFIDENT_PHRASE_RES = [
  //u,
  /[\s-]*(?:)?/u,
  /\s*/u,
  /\s*(?!)/u, // allow "" careful? keep simple:  
  /\s*|\s*[\s-]*/u,
  /\s*\s*(?:)/u];

/** Hedging / observational — reduces risk when evidence is thin. */
export const CAUTIOUS_HEDGE_RES = [
  /\s*/u,
  /\s*/u,
  /\s*/u,
  /\s*/u,
  /\s*\s*/u,
  /\s*/u,
  /\s*\s*/u,
  /\s+\s+/u];

/**
 * Hebrew narrative explicitly acknowledges limited evidence / need for more data.
 * When matched on thin engine rows, these are treated as safe framing (info), not `ambiguous_evidence`.
 */
export const SAFE_THIN_DATA_CAUTION_RES = [
  /\s+\s+\s+\s+/u,
  /\s+\s+/u,
  /\s+\s+/u,
  /\s*/u,
  /\s+/u,
  /\s+\s+/u,
  /\s+\s+/u,
  /\s+/u,
  /\s+\s+\s*/u,
  /\s+\s+/u,
  /\s+\s+\s+/u,
  /\s+\s+/u,
  /\s+\s+\s+/u,
  /\s+\s+/u,
  /\s+\s+\s+/u,
  /\s+\s+/u,
  /\s+\s+\s+/u,
  /\s+\s+/u,
  /\s+\s+/u,
  /\s+\s+/u,
  /\s+\s+/u,
  /\s+\s+/u,
  /\s+/u,
  /\s+/u,
  /\s+/u,
  /(?:)?\s+\s+/u,
  /\s+\s+\s+/u,
  /\s+\s+\s+/u,
  /\s+\s+\s+/u,
  /\s+\s+\s+/u];

/**
 * Strong claims or prescriptions despite thin data — still warn (do not treat as safe caution).
 */
export const UNSAFE_THIN_DATA_MIXED_CONCLUSION_RES = [
  /\s+/u,
  /\s+/u,
  /\s*/u,
  /\s*/u,
  /\s+(?:).{0,120}\s+/u,
  /\s+\s+.{0,80}.{0,80}/u,
  /\s+\s+(?:\s+\s+)/u,
  /\s+\s+\s+.{0,80}\s+/u];

/** Traits framed as permanent — block in educational reporting. */
export const PERMANENT_ABILITY_RES = [
  /\s*\s*(?:)/u,
  /\s*/u,
  /\s*\s*/u,
  /\s*\s*/u];

/** Escalation wording when only maintenance is supported. */
export const UNSUPPORTED_ADVANCE_RES = [
  /(?:)\s*(?:\s*)?/u,
  /\s*(?:\s*)?/u,
  /\s*/u,
  /\s*\s*/u,
  /\s*/u,
  /\s*/u,
  /\s*/u];

/** Strong mastery claims — unsafe if guessing is likely. */
export const MASTERY_CLAIM_RES = [/\s*/u, /\s*/u, /\s*/u, /\s*/u];

/** Strong gap / prerequisite claims — unsafe if only suspected. */
export const OVERSTATED_GAP_RES = [/\s*\s*/u, /\s*\s*/u, /\s*/u];

/** Default parent-facing phrases that must never appear (subset; extend via engineOutput.mustNotSay). */
export const DEFAULT_MUST_NOT_SAY = [
  "",
  "",
  "probe",
  "fallback",
  "insufficient_data"];

export const ISSUE_CODES = {
  medical_language: "medical_language",
  must_not_say: "must_not_say",
  overconfident: "overconfident",
  thin_data_strong: "thin_data_strong",
  do_not_conclude_violation: "do_not_conclude_violation",
  engine_confidence_contradiction: "engine_confidence_contradiction",
  recommendation_unsupported: "recommendation_unsupported",
  permanent_trait: "permanent_trait",
  guessing_as_mastery: "guessing_as_mastery",
  prerequisite_overstated: "prerequisite_overstated",
  ambiguous_evidence: "ambiguous_evidence"};
