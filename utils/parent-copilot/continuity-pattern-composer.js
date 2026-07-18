/**
 * Approved continuity follow-up composers (round 3).
 */

import { copilotStaticMessage } from "../../lib/parent-copilot/copilot-static-message.js";
import { buildTruthPacketV1 } from "./truth-packet-v1.js";
import { NO_DATA_FOR_REQUEST_RESPONSE_HE } from "./question-classifier.js";
import { foldUtteranceForHeMatch } from "./utterance-normalize-he.js";
import {
  collectTopicMetrics,
  extractTopicAnchorsFromSummary,
  pickStrongestTopic,
  pickWeakestTopic,
  resolveContextTopicMetrics,
  topicAnchorFields,
  STRONG_ACC_MIN,
  STRONG_Q_MIN,
} from "./pattern-topic-metrics.js";

const WHAT_NOW_RE = /^(?:אז\s+)?מה\s+עושים(?:\s+עכשיו)?(?:\s*[.?؟]*)?$/u;
const PRESERVE_RE = /^איך\s+לשמר(?:\s+א(?:ת|ת)?\s+ז(?:ה|ו))?(?:\s*[.?؟]*)?$/u;
const IF_WRONG_RE = /^ו?מה\s+אם\s+(?:ה(?:וא|יא)|(?:הילד|הילדה))\s+טוע(?:ה|ים|ות)\s*(?:ב(?:זה|נושא))?(?:\s*[.?؟]*)?$/u;
const SIMPLER_RE = /^(?:תסביר\s+)?(?:פשוט\s+יותר|תעש(?:ה|י)\s+.*\s+פשוט\s+יותר)(?:\s*[.?؟]*)?$/u;
const SHORTEN_RE = /^(?:תקצר\s+לי|תעש(?:ה|י)\s+.*\s+קצר)(?:\s*[.?؟]*)?$/u;
const WHY_RE = /^למה(?:\s*[.?؟]*)?$/u;
const SEVERITY_RE = /^(?:ז(?:ה|ו)\s+)?חמור(?:\s*[.?؟]*)?$/u;
const THEN_ACTIVITY_RE = /^אז\s+לפתוח\s+פעילות(?:\s*[.?؟]*)?$/u;
const WHICH_TOPIC_RE = /^באיזה\s+נושא(?:\s*[.?؟]*)?$/u;
const THEN_AFTER_RE = /^ו?מה\s+אחר(?:\s+כך)?(?:\s*[.?؟]*)?$/u;
const HOME_FOLLOWUP_RE = /^ו?מה\s+לעשות\s+(?:עם\s+ז(?:ה|ו)\s+)?בבית(?:\s*[.?؟]*)?$/u;

/**
 * @param {string} utterance
 */
export function matchesContinuityFollowUp(utterance) {
  const t = foldUtteranceForHeMatch(String(utterance || ""));
  if (!t || t.length > 48) return false;
  return (
    WHAT_NOW_RE.test(t) ||
    PRESERVE_RE.test(t) ||
    IF_WRONG_RE.test(t) ||
    SIMPLER_RE.test(t) ||
    SHORTEN_RE.test(t) ||
    WHY_RE.test(t) ||
    SEVERITY_RE.test(t) ||
    THEN_ACTIVITY_RE.test(t) ||
    HOME_FOLLOWUP_RE.test(t) ||
    WHICH_TOPIC_RE.test(t) ||
    THEN_AFTER_RE.test(t)
  );
}

/**
 * @param {string} utterance
 */
export function classifyContinuityFollowUp(utterance) {
  const t = foldUtteranceForHeMatch(String(utterance || ""));
  if (SEVERITY_RE.test(t)) return "severity";
  if (HOME_FOLLOWUP_RE.test(t)) return "home_followup";
  if (WHAT_NOW_RE.test(t) || THEN_ACTIVITY_RE.test(t)) return "what_now";
  if (PRESERVE_RE.test(t)) return "preserve";
  if (IF_WRONG_RE.test(t)) return "if_wrong";
  if (SIMPLER_RE.test(t)) return "simpler";
  if (SHORTEN_RE.test(t)) return "shorten";
  if (WHY_RE.test(t)) return "why";
  if (WHICH_TOPIC_RE.test(t) || THEN_AFTER_RE.test(t)) return "what_now";
  return null;
}

function hasConversationContext(conv) {
  return (
    String(conv?.lastResolvedTopic || "").trim() ||
    String(conv?.lastResolvedSubject || "").trim() ||
    (Array.isArray(conv?.priorScopes) && conv.priorScopes.length > 0) ||
    String(conv?.lastAnswerSummary || "").trim().length > 12
  );
}

function priorTurnWasNoData(conv) {
  if (conv?.lastTurnWasNoData === true) return true;
  const s = String(conv?.lastAnswerSummary || conv?.lastAssistantAnswerDigestHe || "");
  return (
    s.includes("Not enough information") ||
    s.includes(NO_DATA_FOR_REQUEST_RESPONSE_HE.slice(0, 24)) ||
    s.includes("There is not enough in the current report")
  );
}

function priorTurnWasWhatNotInfer(conv) {
  if (conv?.lastTurnWasWhatNotInfer === true) return true;
  const s = String(conv?.lastAnswerSummary || conv?.lastAssistantAnswerDigestHe || "");
  return s.includes("You should not draw conclusions from the report") || s.includes("Do not draw a personal conclusion");
}

const WHY_NOT_INFER_EXPLANATION_HE =
  "Because the report only shows practice data from the site in the selected period: which topics were practiced, how many questions were answered and what the level of accuracy was. These data are sufficient to choose a small educational step, but not to draw a personal conclusion about the child or compare him to other children.";

/**
 * @param {ReturnType<typeof topicAnchorFields>} a
 * @param {string} utterance
 * @param {string} plannerIntent
 * @param {unknown} payload
 */
function continuityDraft(answerText, a, utterance, plannerIntent, payload) {
  const truthPacket = buildTruthPacketV1(payload, {
    scopeType: "topic",
    scopeId: a.topicRowKey,
    scopeLabel: a.displayName || a.topicLabel,
    canonicalIntent: plannerIntent,
    parentUtterance: utterance,
  });
  if (!truthPacket) return null;
  return {
    answerBlocks: [{ type: "observation", answerText: String(textHe || "").trim(), source: "continuity_pattern_composer" }],
    plannerIntent,
    truthPacket,
    scopeMeta: {
      generationPath: "pattern_composer",
      continuityPattern: true,
      intentReason: "continuity:approved_pattern",
      scopeConfidence: 0.9,
      scopeReason: "continuity_followup",
    },
  };
}

function continuityExecutiveDraft(answerText, utterance, plannerIntent, payload) {
  const truthPacket = buildTruthPacketV1(payload, {
    scopeType: "executive",
    scopeId: "executive",
    scopeLabel: copilotStaticMessage("copilot.answers.utils_parent-copilot_continuity-pattern-composer.report_summary"),
    canonicalIntent: plannerIntent,
    parentUtterance: utterance,
  });
  if (!truthPacket) return null;
  return {
    answerBlocks: [{ type: "observation", answerText: String(textHe || "").trim(), source: "continuity_pattern_composer" }],
    plannerIntent,
    truthPacket,
    scopeMeta: {
      generationPath: "pattern_composer",
      continuityPattern: true,
      intentReason: "continuity:approved_pattern",
      scopeConfidence: 0.88,
      scopeReason: "continuity_followup_no_data",
    },
  };
}

function resolveStrongOrLast(payload, conv) {
  const last = resolveContextTopicMetrics(payload, conv, { allowWeakestFallback: false });
  if (last && last.q >= STRONG_Q_MIN && last.acc >= STRONG_ACC_MIN) return topicAnchorFields(last);
  const strong = pickStrongestTopic(collectTopicMetrics(payload));
  return strong ? topicAnchorFields(strong) : last ? topicAnchorFields(last) : null;
}

function resolveFollowUpAnchor(payload, conv, { allowWeakestForWhatNow = false } = {}) {
  const strict = resolveContextTopicMetrics(payload, conv, { allowWeakestFallback: false });
  if (strict) return topicAnchorFields(strict);
  if (allowWeakestForWhatNow) {
    const weak = pickWeakestTopic(collectTopicMetrics(payload));
    return weak ? topicAnchorFields(weak) : null;
  }
  return null;
}

/**
 * @param {object} params
 */
export function tryComposeContinuityPatternDraft(params) {
  const utteranceStr = String(params?.utteranceStr || "");
  const payload = params?.payload;
  const conv = params?.conversationState || {};
  if (!matchesContinuityFollowUp(utteranceStr)) return null;
  if (!hasConversationContext(conv)) return null;

  const kind = classifyContinuityFollowUp(utteranceStr);
  if (!kind) return null;

  switch (kind) {
    case "home_followup": {
      const ctx = resolveContextTopicMetrics(payload, conv, { allowWeakestFallback: false });
      if (!ctx?.q) return { noData: true };
      const anchor = topicAnchorFields(ctx);
      const text = `Today I would do one thing: a short activity on the topic ${anchor.subjectLabel} - ${anchor.topicLabel}. In the report there are ${anchor.questionCount} questions with ${anchor.accuracyPercent}% success, so it is a good place for focused practice. Do only 5-10 minutes, 3-5 questions, and at the end ask the child: How did you think of the answer?`;
      return continuityDraft(text, anchor, utteranceStr, "what_to_do_today", payload);
    }
    case "what_now": {
      if (priorTurnWasNoData(conv)) {
        let text =
          "To check this in a simple way, you should start one normal practice without time pressure on the main topic that appears in the report, only 5-10 minutes. After a few questions you can check if the answers are more stable. If even then there is not enough information in the report, do not draw a conclusion and continue to accumulate practice.";
        const anchor = resolveFollowUpAnchor(payload, conv, { allowWeakestForWhatNow: true });
        if (anchor) {
          text += `Topic to start: ${anchor.subjectLabel} - ${anchor.topicLabel}.`;
          return continuityDraft(text, anchor, utteranceStr, "what_to_do_now", payload);
        }
        return continuityExecutiveDraft(text, utteranceStr, "what_to_do_now", payload);
      }
      const anchor = resolveFollowUpAnchor(payload, conv, { allowWeakestForWhatNow: true });
      if (!anchor) return { noData: true };
      const text = `The next step is a short practice on ${anchor.subjectLabel} - ${anchor.topicLabel}: 5–10 minutes, few questions, then checking if the answers are more stable. No need to open several topics together.`;
      return continuityDraft(text, anchor, utteranceStr, "what_to_do_now", payload);
    }
    case "severity": {
      const ctx = resolveContextTopicMetrics(payload, conv, { allowWeakestFallback: false });
      if (!ctx?.q) return { noData: true };
      const anchor = topicAnchorFields(ctx);
      const text = `From the report, it can only be regarded as a study subject for practice. In ${anchor.subjectLabel} - ${anchor.topicLabel} there are ${anchor.questionCount} questions with ${anchor.accuracyPercent}% success, so the recommendation is to start with a short and focused practice, not to conclude beyond what the report shows.`;
      return continuityDraft(text, anchor, utteranceStr, "explain_report", payload);
    }
    case "preserve": {
      const strong = resolveStrongOrLast(payload, conv);
      if (!strong || strong.questionCount < 1) return { noData: true };
      const text = `To preserve ${strong.subjectLabel} - ${strong.topicLabel}, a short practice once or twice a week is enough. The goal is to maintain a sequence without overloading, and to check that the accuracy remains stable.`;
      return continuityDraft(text, strong, utteranceStr, "what_is_going_well", payload);
    }
    case "if_wrong": {
      const anchor = resolveFollowUpAnchor(payload, conv);
      if (!anchor) return { noData: true };
      const text = `If he is wrong about ${anchor.subjectLabel} - ${anchor.topicLabel}, it is better to stop after one or two questions, ask him to explain how he thought, and then solve a similar question together. The goal is to understand the way, not to rush to many more questions.`;
      return continuityDraft(text, anchor, utteranceStr, "what_to_do_now", payload);
    }
    case "simpler": {
      const anchor = resolveFollowUpAnchor(payload, conv);
      if (!anchor) return { noData: true };
      const text = `Simply put: the topic you should focus on now is ${anchor.subjectLabel} - ${anchor.topicLabel}. You should do a short practice, check how he answers, and not conclude beyond what appears in the report.`;
      return continuityDraft(text, anchor, utteranceStr, "explain_report", payload);
    }
    case "shorten": {
      const anchors = extractTopicAnchorsFromSummary(payload, conv, 2);
      if (anchors.length >= 2) {
        const text = `In short: this week focus on ${anchors[0].subjectLabel} - ${anchors[0].topicLabel} and ${anchors[1].subjectLabel} - ${anchors[1].topicLabel}. Practice for 5-10 minutes at a time, without loading more subjects.`;
        return continuityDraft(text, anchors[0], utteranceStr, "explain_report", payload);
      }
      const anchor = resolveFollowUpAnchor(payload, conv) || (anchors[0] ?? null);
      if (!anchor) return { noData: true };
      const text = `In short: focus on ${anchor.subjectLabel} - ${anchor.topicLabel}, practice for 5–10 minutes, then check if there is an improvement in the following answers.`;
      return continuityDraft(text, anchor, utteranceStr, "explain_report", payload);
    }
    case "why": {
      if (priorTurnWasWhatNotInfer(conv)) {
        return continuityExecutiveDraft(
          WHY_NOT_INFER_EXPLANATION_HE,
          utteranceStr,
          "report_trust_question",
          payload,
        );
      }
      const ctx = resolveContextTopicMetrics(payload, conv, { allowWeakestFallback: false });
      const anchor = ctx ? topicAnchorFields(ctx) : resolveFollowUpAnchor(payload, conv);
      if (!anchor?.questionCount) return { noData: true };
      const text = `Because in the report there are ${anchor.subjectLabel} - ${anchor.topicLabel} ${anchor.questionCount} questions with ${anchor.accuracyPercent}% success. This is the figure from which the recommendation comes.`;
      return continuityDraft(text, anchor, utteranceStr, "explain_report", payload);
    }
    default:
      return null;
  }
}

export function continuityNoDataResponseHe() {
  return NO_DATA_FOR_REQUEST_RESPONSE_HE;
}
