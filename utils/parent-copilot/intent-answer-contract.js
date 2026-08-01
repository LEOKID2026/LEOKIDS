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
  /(?:explain|tell\s+me\s+about)\s+(?:the\s+)?report|what\s+(?:does\s+)?(?:the\s+)?report\s+(?:say|show|mean)|(?:give\s+me\s+)?(?:a\s+)?summary|what\s+(?:do\s+we\s+)?see\s+here|overall\s+picture/iu;

const IMPORTANT_FOCUS_RE =
  /what\s+(?:is\s+)?important\s+(?:here|now)|what\s+(?:is\s+)?(?:the\s+)?most\s+important|what\s+(?:to\s+)?(?:focus|emphasize)|where\s+(?:to\s+)?(?:put\s+)?(?:the\s+)?focus/iu;

const TOPIC_LOOKUP_RE = /^(?:what\s+about|how\s+about)\s+/iu;

const TOPIC_PROBLEM_RE =
  /what\s+(?:is\s+)?(?:the\s+)?(?:problem|difficulty)|where\s+(?:is\s+)?(?:the\s+)?(?:problem|difficulty)|why\s+(?:is\s+)?(?:he|she|the\s+child)?\s*(?:weak|struggling)|what\s+(?:is\s+)?(?:not\s+working|weak)|why\s+(?:is\s+it\s+)?(?:hard|difficult)/iu;

const HOME_PRACTICE_RE =
  /what\s+should\s+(?:we|i)\s+do|what\s+to\s+do(?:\s+(?:now|today|this\s+week|at\s+home))?|how\s+(?:to\s+)?practice|how\s+long|at\s+home|next\s+step|what\s+(?:do\s+we\s+)?do\s+now|home\s+practice|how\s+(?:do\s+(?:we|i)\s+)?practice/iu;

const STRENGTH_RE =
  /what\s+(?:is\s+)?going\s+well|where\s+(?:is\s+)?(?:he|she|the\s+child)?\s*strong|what\s+(?:is\s+)?strong|strengths?|succeeding|strongest|(?:the\s+)?strong(?:est)?\s+subject|which\s+subject\s+is\s+strongest/iu;

// Progression family: advance / level up / level down / mastered / above-grade / below-grade / focus elsewhere.
const PROGRESSION_RE =
  /\b(?:advance|move\s+ahead|level\s+up|raise\s+(?:the\s+)?level|level\s+down|lower\s+(?:the\s+)?level|already\s+masters?|masters?\s+the\s+topic|already\s+knows?|above\s+(?:grade|level)|below\s+(?:grade|level)|focus\s+on\s+(?:another|a\s+different)\s+topic|switch\s+(?:to\s+)?(?:another|a\s+different)\s+topic|wasting)\b/iu;

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
    String(params?.subjectId || "").trim() ||
    String(params?.truthPacket?.surfaceFacts?.subjectId || "").trim();

  if (scopeType === "subject" && subjectId) {
    const tier = classifySubjectEvidenceTier(subjectQuestionCountFromPayload(payload, subjectId));
    if (tier === SUBJECT_EVIDENCE_TIER.none) return ANSWER_CONTRACT.zero_evidence;
  }

  if (isMistakePatternQuestion(utteranceStr)) return ANSWER_CONTRACT.mistake_pattern;

  if (IMPORTANT_FOCUS_RE.test(folded)) return ANSWER_CONTRACT.important_focus;

  if (TOPIC_LOOKUP_RE.test(folded)) return ANSWER_CONTRACT.topic_lookup;

  if (
    HOME_PRACTICE_RE.test(folded) ||
    stageAIntent === "what_to_do_today" ||
    stageAIntent === "what_to_do_this_week" ||
    stageAIntent === "how_to_tell_child" ||
    (isContextualFollowUpUtterance(utteranceStr) && /\b(?:home|practice|today|week|next\s+step)\b/iu.test(folded))
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
    (stageAIntent === "explain_report" ||
      stageAIntent === "ask_topic_specific" ||
      stageAIntent === "ask_subject_specific" ||
      REPORT_EXPLAIN_RE.test(folded))
  ) {
    return ANSWER_CONTRACT.report_explanation;
  }

  if (scopeType === "topic") {
    if (
      TOPIC_PROBLEM_RE.test(folded) ||
      stageAIntent === "what_is_still_difficult" ||
      stageAIntent === "why_not_advance" ||
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
