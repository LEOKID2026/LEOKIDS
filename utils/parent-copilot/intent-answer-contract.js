/**
 * Maps resolved scope + Stage A intent + utterance → intent-specific answer contract.
 */

import { foldUtteranceForMatch, normalizeFreeformParentUtterance } from "./utterance-normalize.js";
import { isMistakePatternQuestion } from "./topic-evidence-answer.js";
import { isContextualFollowUpUtterance } from "./contextual-follow-up.js";
import { classifySubjectEvidenceTier, SUBJECT_EVIDENCE_TIER } from "../parent-report-language/subject-evidence-policy.js";

export const ANSWER_CONTRACT = Object.freeze({
  report_explanation: "report_explanation",
  important_focus: "important_focus",
  topic_problem: "topic_problem",
  topic_lookup: "topic_lookup",
  mistake_pattern: "mistake_pattern",
  home_practice: "home_practice",
  strength: "strength",
  progression: "progression",
  zero_evidence: "zero_evidence"});

const REPORT_EXPLAIN_RE =
  /\s*(?:\s*)?(?:\s*)?(?:)?|\s*\s*|\s*\s*|\s*\s*|\s*\s*|\s*|\s*/u;

const IMPORTANT_FOCUS_RE =
  /\s*\s*|\s*\s*|\s*\s*|\s*\s*\s*|\s*\s*|\s*\s*\s*/u;

const TOPIC_LOOKUP_RE = /^\s*\s+/u;

const TOPIC_PROBLEM_RE =
  /\s*|\s*|\s*|\s*|\s*(?:)?\s*(?:)|\s*\s*|\s*|\s*/u;

const HOME_PRACTICE_RE =
  /\s*|\s*|\s*|\s*|\s*\s*|\s*|\s*/u;

const STRENGTH_RE =
  /\s*\s*|\s*(?:)?\s*|\s*|\s*|\s*|\s*|(?:)?\s*(?:\s*)?(?:)?|\s*|(?:)?\s*/u;

// Progression family: advance / level up / level down / mastered / above-grade / below-grade / focus elsewhere.
const PROGRESSION_RE =
  /\s*(?:)?|\s*(?:\s*)?(?:)?|\s*(?:)?|\s*(?:\s*)?(?:)?|\s*|\s*|\s*|\s*(?:)?|\s*|\s*(?:)?|\s*(?:\s*)?|\s*\s*|\s*\s*/u;

/**
 * @param {unknown} payload
 * @param {string} subjectId
 */
export function subjectQuestionCountFromPayload(payload, subjectId) {
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  const sp = profiles.find((p) => String(p?.subject || "") === subjectId);
  if (!sp) return 0;
  const explicit = Math.max(0, Number(sp?.subjectQuestionCount ?? sp?.questionCount) || 0);
  if (explicit > 0) return explicit;
  const topics = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
  let sum = 0;
  for (const tr of topics) sum += Math.max(0, Number(tr?.questions ?? tr?.questionCount) || 0);
  if (sum > 0) return sum;
  for (const row of Array.isArray(sp?.topicOverviewRows) ? sp.topicOverviewRows : []) {
    sum += Math.max(0, Number(row?.questions) || 0);
  }
  if (sum > 0) return sum;
  if (subjectId === "history") {
    const summary = payload?.summary && typeof payload.summary === "object" ? payload.summary : {};
    return Math.max(0, Number(summary.historyQuestions) || 0);
  }
  return sum;
}

/**
 * @param {object} params
 */
export function resolveAnswerContract(params) {
  const utteranceStr = String(params?.utteranceStr || "");
  const folded = foldUtteranceForMatch(normalizeFreeformParentUtterance(utteranceStr));
  const scopeType = String(params?.scopeType || "");
  const stageAIntent = String(params?.stageAIntent || "");
  const payload = params?.payload;
  const subjectId =
    String(params?.subjectId || "").trim() |
    String(params?.truthPacket?.surfaceFacts?.subjectId || "").trim();

  if (scopeType === "subject" && subjectId) {
    const tier = classifySubjectEvidenceTier(subjectQuestionCountFromPayload(payload, subjectId));
    if (tier === SUBJECT_EVIDENCE_TIER.none) return ANSWER_CONTRACT.zero_evidence;
  }

  if (isMistakePatternQuestion(utteranceStr)) return ANSWER_CONTRACT.mistake_pattern;

  if (IMPORTANT_FOCUS_RE.test(folded)) return ANSWER_CONTRACT.important_focus;

  if (TOPIC_LOOKUP_RE.test(folded) || /^\s*\s+/u.test(folded)) return ANSWER_CONTRACT.topic_lookup;

  if (
    HOME_PRACTICE_RE.test(folded) |
    stageAIntent === "what_to_do_today" |
    stageAIntent === "what_to_do_this_week" |
    stageAIntent === "how_to_tell_child" |
    (isContextualFollowUpUtterance(utteranceStr) && /\s*|\s*|\s*/u.test(folded))
  ) {
    return ANSWER_CONTRACT.home_practice;
  }

  if (PROGRESSION_RE.test(folded)) {
    return ANSWER_CONTRACT.progression;
  }

  if (stageAIntent === "what_is_going_well" || STRENGTH_RE.test(folded)) {
    return ANSWER_CONTRACT.strength;
  }

  if (stageAIntent === "what_is_most_important" && scopeType === "executive") {
    return ANSWER_CONTRACT.important_focus;
  }

  if (
    scopeType === "executive" &&
    (stageAIntent === "explain_report" |
      stageAIntent === "ask_topic_specific" |
      stageAIntent === "ask_subject_specific" |
      REPORT_EXPLAIN_RE.test(folded))
  ) {
    return ANSWER_CONTRACT.report_explanation;
  }

  if (scopeType === "topic") {
    if (
      TOPIC_PROBLEM_RE.test(folded) |
      stageAIntent === "what_is_still_difficult" |
      stageAIntent === "why_not_advance" |
      stageAIntent === "what_not_to_do_now"
    ) {
      return ANSWER_CONTRACT.topic_problem;
    }
    if (stageAIntent === "what_is_most_important" || stageAIntent === "is_intervention_needed") {
      return ANSWER_CONTRACT.topic_problem;
    }
  }

  if (scopeType === "subject" && (TOPIC_PROBLEM_RE.test(folded) || stageAIntent === "what_is_still_difficult")) {
    return ANSWER_CONTRACT.topic_problem;
  }

  return null;
}

export default { ANSWER_CONTRACT, resolveAnswerContract, subjectQuestionCountFromPayload };
