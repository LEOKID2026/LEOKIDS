/**
 * Topic-scoped evidence helpers + legacy entry (delegates to intent-answer-composers).
 */

import { foldUtteranceForMatch, normalizeFreeformParentUtterance } from "./utterance-normalize.js";
import { tryComposeIntentAnswer } from "./intent-answer-composers.js";
import { rewriteEngineTaxonomySnippetForParentHe } from "../diagnostic-labels.js";
import {
  parentFacingDiagnosisSnippetHe,
  parentFacingPatternLabelHe} from "../parent-report-language/parent-facing-pattern-label.js";

const MISTAKE_QUESTION_RE =
  /|\s*(?:|)?\s*|\s*(?:)?\s*|\s*\s*|\s*|\s*\s*|\s*|\s*/u;

/**
 * @param {string} utterance
 */
export function isMistakePatternQuestion(utterance) {
  return MISTAKE_QUESTION_RE.test(foldUtteranceForMatch(normalizeFreeformParentUtterance(utterance)));
}

/**
 * @param {object|null|undefined} unit
 */
export function extractMistakePatternHeFromUnit(unit) {
  if (!unit || typeof unit !== "object") return "";
  const diagLine = String(unit?.diagnosis?.lineHe || "").trim();
  if (diagLine && unit?.diagnosis?.allowed !== false) {
    return parentFacingDiagnosisSnippetHe(unit, diagLine);
  }
  const mapped = parentFacingPatternLabelHe(unit);
  if (mapped) return mapped;
  const subskill = String(unit?.taxonomy?.subskillHe || "").trim();
  if (subskill) return rewriteEngineTaxonomySnippetForParentHe(subskill);
  return "";
}

/**
 * @param {object} params
 * @deprecated Use tryComposeIntentAnswer — kept for callers/tests.
 */
export function tryComposeTopicEvidenceAnswer(params) {
  return tryComposeIntentAnswer({
    ...params,
    stageAIntent: params?.plannerIntent || params?.stageAIntent});
}

export default {
  isMistakePatternQuestion,
  extractMistakePatternHeFromUnit,
  tryComposeTopicEvidenceAnswer};
