/**
 * Short parent report (V2) — parent-facing wording only, parameters only.
 */

export {
  insufficientSubjectQuestionsLineHe,
  zeroEvidenceSubjectLineHe,
  thinEvidenceSubjectLineHe,
} from "./subject-evidence-policy.js";

export function tierStableStrengthHe() {
  return "Stable strength";
}

export function tierWeaknessRecurringHe() {
  return "A recurring difficulty";
}

export function tierWeaknessSupportHe() {
  return "Gentle reinforcement";
}

export function evidenceExampleTitleFallbackHe() {
  return "Topic examined";
}

export function evidenceExampleBodyFallbackHe() {
  return "There still isn't enough detail here to elaborate - it's better to continue with short practice and come back to this.";
}

export function v2SubjectMemoryPartialEvidenceHe() {
  return "In some topics there's still limited practice - a few more questions will make the picture clearer.";
}

export function v2SubjectDiagnosticRestraintHe() {
  return "It's still too early to set a clear direction across all topics at once - it's better to give consistent practice more time.";
}

/** Short overview when topic engine cannot conclude (2–3 questions, withhold). */
export function v2ShortOverviewCannotConcludeHe() {
  return "The data is still partial, so it's worth collecting more information before setting a final direction.";
}
