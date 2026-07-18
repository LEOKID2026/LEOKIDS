/**
 * Approved round-3 pattern answer composers (exact owner-provided Hebrew templates).
 */

import { copilotStaticMessage } from "../../lib/parent-copilot/copilot-static-message.js";
import { buildTruthPacketV1 } from "./truth-packet-v1.js";
import { NO_DATA_FOR_REQUEST_RESPONSE_HE } from "./question-classifier.js";
import { foldUtteranceForHeMatch } from "./utterance-normalize-he.js";
import { normalizeSubjectId, subjectLabelHe, SUBJECT_ORDER } from "./contract-reader.js";
import {
  collectTopicMetrics,
  pickWeakestTopic,
  pickWeakestTopics,
  pickStrongForThreeThings,
  pickWeakForThreeThings,
  pickStableTopicForProgress,
  pickStableSubjectForProgress,
  resolveContextTopicMetrics,
  topicAnchorFields,
} from "./pattern-topic-metrics.js";
import { findTopicRowByKey } from "./contract-reader.js";
import {
  exportTrendEvidence,
  exportParentActivityEvidence,
  exportSpeedEvidence,
  isRealTrendLineHe,
  hasProgressComparisonTrend,
} from "./no-data-request-response.js";
import { detectAggregateQuestionClass } from "./semantic-question-class.js";

const WHERE_HELP_RE = /איפה\s+(?:ה(?:וא|יא)|(?:הילד|הילדה))\s+צ(?:ר|ר)יך\s+עזרה/u;
const THREE_THINGS_RE = /(?:מה\s+)?(?:שלוש(?:ת)?|3)\s*(?:ה)?דברים(?:\s+הכי\s+חשוב(?:ים)?)?(?:\s+להורה)?/u;
const OPEN_ACTIVITY_RE = /על\s+איזה\s+נושא\s+ל(?:פתוח|התחיל)(?:\s+(?:ל(?:ו|ה)|פעילות))?/u;
const TREND_RE =
  /מה\s+השתנה|משבוע\s+קודם|מהשבוע\s+קודם|השבוע\s+קודם|האם\s+(?:הוא|היא)\s+מתקדם|יש\s+שיפור|התקדמות/u;
const PARENT_ACTIVITY_RE = /הפעילות\s+.*השפיע|האם\s+הפעילות\s+.*השפיע|מה\s+נתתי\s+ל(?:ו|ה)/u;
const SPEED_RE =
  /האם\s+ז(?:ה|ו)\s+בגלל\s+לחץ\s+זמן|אולי\s+ז(?:ה|ו)\s+בגלל\s+מהירות|האם\s+(?:הוא|היא)\s+טע(?:ה|תה)\s+כי\s+עבד(?:ה)?\s+מהר|לחץ\s+זמן|עונה\s+מהר|מהר\s+מדי/u;
const HOME_TODAY_RE =
  /(?:^|\s)(?:מה\s+לעשות\s+(?:אית(?:ו|ה|ם)|עמ(?:ו|ה))(?:\s+בבית)?\s+היום|מה\s+לעשות\s+בבית(?:\s+היום)?|מה\s+עושים\s+עכשיו|ו?מה\s+לעשות\s+(?:עם\s+ז(?:ה|ו)\s+)?בבית)(?:\s*[.?؟]*)?$/u;
const ASK_AT_HOME_RE = /מה\s+לשאול\s+(?:אות(?:ו|ה)|את(?:ו|ה))\s+בבית/u;
const WHAT_NOT_INFER_RE = /מה\s+לא\s+כדאי\s+(?:לי\s+)?להסיק(?:\s+עדיין)?/u;
const PROGRESS_WHERE_RE =
  /איפה\s+רואים(?:\s+(?:ש(?:יפור|התקדמות)|(?:ש(?:ה)?)?מצב\s+טוב\s+יותר))?/u;
const IMPORTANT_NOW_RE =
  /מה\s+ה(?:כי\s+)?חשוב(?:\s+(?:כרגע|לי(?:\s+ל)?דעת(?:\s+השבוע)?|עכשיו))?|במה\s+להתמקד\s+(?:עכשיו|השבוע)?|מה\s+העיקר|מה\s+חשוב\s+עכשיו/u;
const AVOID_NOW_RE =
  /מה\s+כדאי\s+להימנע(?:\s+ממנ(?:ו|ה))?(?:\s+עכשיו)?|ממה\s+להימנע|מה\s+לא\s+(?:כדאי\s+)?(?:ל)?עשות|מה\s+לא\s+כדאי\s+(?:לי\s+)?להסיק/u;
const LEARNING_SEVERITY_FOLLOWUP_RE = /^(?:ז(?:ה|ו)\s+)?חמור\s*\??$/u;
const EXPLAIN_REPORT_SIMPLE_RE =
  /תסביר\s+לי\s+א(?:ת|ת)?\s+הדוח\s+במילים\s+פשוטות|במילים\s+פשוטות.*(?:א(?:ת|ת)?\s+)?(?:ה)?דוח|תסביר.*(?:א(?:ת|ת)?\s+)?(?:ה)?דוח.*(?:במילים\s+פשוטות|פשוט)/u;

export function matchesExplainReportSimpleWordsUtterance(utterance) {
  return EXPLAIN_REPORT_SIMPLE_RE.test(foldUtteranceForHeMatch(String(utterance || "")));
}

function globalReportQuestionCount(payload) {
  const s = payload?.summary || payload?.practiceSummary || {};
  const os = payload?.overallSnapshot && typeof payload.overallSnapshot === "object" ? payload.overallSnapshot : {};
  return Math.max(
    0,
    Number(s.totalAnswers ?? s.totalQuestions ?? os.totalQuestions ?? 0) || 0,
  );
}

function subjectRowsFromPayload(payload) {
  const coverage = payload?.overallSnapshot?.subjectCoverage;
  if (Array.isArray(coverage) && coverage.length) {
    return coverage
      .map((row) => ({
        sid: normalizeSubjectId(row?.subject),
        q: Math.max(0, Number(row?.questionCount ?? row?.answers ?? 0) || 0),
        acc: Math.max(0, Math.min(100, Math.round(Number(row?.accuracy ?? 0)))),
      }))
      .filter((r) => r.sid && r.q > 0);
  }
  const subjects = payload?.subjects && typeof payload.subjects === "object" ? payload.subjects : null;
  if (subjects && Object.keys(subjects).length) {
    return Object.entries(subjects).map(([sid, row]) => ({
      sid: normalizeSubjectId(sid),
      q: Math.max(0, Number(row?.answers ?? row?.questions ?? 0) || 0),
      acc: Math.max(0, Math.min(100, Math.round(Number(row?.accuracy ?? 0)))),
    })).filter((r) => r.sid && r.q > 0);
  }
  /** @type {Map<string, { q: number; correct: number }>} */
  const bySid = new Map();
  for (const m of collectTopicMetrics(payload)) {
    if (!m.sid) continue;
    const prev = bySid.get(m.sid) || { q: 0, correct: 0 };
    prev.q += m.q;
    prev.correct += Math.round((m.q * m.acc) / 100);
    bySid.set(m.sid, prev);
  }
  return [...bySid.entries()].map(([sid, v]) => ({
    sid,
    q: v.q,
    acc: v.q ? Math.round((v.correct / v.q) * 100) : 0,
  }));
}

function hasEnoughReportVolumeForSimpleExplain(payload) {
  if (globalReportQuestionCount(payload) >= 30) return true;
  return subjectRowsFromPayload(payload).some((r) => r.q >= 20);
}

/**
 * @param {unknown} payload
 * @param {string} excludeSid
 */
function stableSubjectPhraseList(payload, excludeSid) {
  const rows = subjectRowsFromPayload(payload)
    .filter((r) => r.sid !== excludeSid && r.q >= 8)
    .sort((a, b) => b.acc - a.acc || b.q - a.q);
  if (!rows.length) return "";
  return rows
    .slice(0, 4)
    .map((r) => `${subjectLabelHe(r.sid)} with ${r.q} questions and ${r.acc}%`)
    .join(", ");
}

function composeExplainReportSimpleWords(payload) {
  const weak = pickWeakestTopic(collectTopicMetrics(payload));
  if (!weak?.q) return null;
  const a = topicAnchorFields(weak);
  const stableList = stableSubjectPhraseList(payload, a.subjectId || "");
  let text =
    `Simply put: there is enough practice to see where to start. The main point is ${a.subjectLabel} - ${a.topicLabel}: ${a.questionCount} questions with ${a.accuracyPercent}% success. This is the first issue that should be strengthened.`;
  if (stableList) {
    text += `Alongside this, there are areas that seem more stable in this period: ${stableList}.`;
  }
  text += `Therefore, the recommendation is not to scatter the practice: start with ${a.subjectLabel} - ${a.topicLabel}, 5–10 minutes, 3–5 questions each time, then check if the answers are more stable.`;
  return patternDraft(text, a, "explain_report");
}

/**
 * Approved narrative for "Explain the report to me in simple words" when report volume is sufficient.
 * Not routed via classifyApprovedPatternQuestion — invoked explicitly from index.js.
 */
export function tryComposeExplainReportSimpleWordsDraft(params) {
  const utteranceStr = String(params?.utteranceStr || "");
  const payload = params?.payload;
  if (!matchesExplainReportSimpleWordsUtterance(utteranceStr)) return null;
  if (!hasEnoughReportVolumeForSimpleExplain(payload)) return null;
  const composed = composeExplainReportSimpleWords(payload);
  if (!composed) return null;

  const truthPacket = buildTruthPacketV1(payload, {
    scopeType: "topic",
    scopeId: composed.focusTopic?.topicRowKey || "explain-simple-words",
    scopeLabel: composed.focusTopic?.displayName || composed.focusTopic?.topicLabel || copilotStaticMessage("copilot.answers.utils_parent-copilot_pattern-answer-composers.report_summary"),
    canonicalIntent: "explain_report",
    parentUtterance: utteranceStr,
  });
  if (!truthPacket) return null;

  return {
    ...composed,
    patternId: "explain_report_simple_words",
    truthPacket,
    scopeMeta: {
      generationPath: "pattern_composer",
      patternId: "explain_report_simple_words",
      intentReason: "composer:explain_report_simple_words",
      scopeConfidence: 0.94,
      scopeReason: "approved_simple_explain_composer",
    },
  };
}

/**
 * @param {string} utterance
 */
export function classifyApprovedPatternQuestion(utterance) {
  const t = foldUtteranceForHeMatch(String(utterance || ""));
  if (!t) return null;
  const aggregateClass = detectAggregateQuestionClass(utterance);
  if (aggregateClass === "recommendation_action" || aggregateClass === "improved") return null;
  if (PROGRESS_WHERE_RE.test(t)) return "progress_where";
  if (IMPORTANT_NOW_RE.test(t)) return "important_now";
  if (AVOID_NOW_RE.test(t)) return "avoid_now";
  if (HOME_TODAY_RE.test(t)) return "home_today";
  if (ASK_AT_HOME_RE.test(t)) return "ask_at_home";
  if (WHAT_NOT_INFER_RE.test(t)) return "what_not_infer";
  if (WHERE_HELP_RE.test(t)) return "where_help";
  if (THREE_THINGS_RE.test(t)) return "three_things";
  if (OPEN_ACTIVITY_RE.test(t)) return "open_activity";
  if (TREND_RE.test(t)) return "trend";
  if (PARENT_ACTIVITY_RE.test(t)) return "parent_activity";
  if (SPEED_RE.test(t)) return "speed";
  if (LEARNING_SEVERITY_FOLLOWUP_RE.test(t) && t.length <= 24) return "learning_severity_followup";
  return null;
}

/**
 * @param {ReturnType<typeof topicAnchorFields>} a
 */
function buildTopicTruthPacket(payload, a, utterance, plannerIntent) {
  if (!a?.topicRowKey) return null;
  return buildTruthPacketV1(payload, {
    scopeType: "topic",
    scopeId: a.topicRowKey,
    scopeLabel: a.displayName || a.topicLabel,
    canonicalIntent: plannerIntent,
    parentUtterance: utterance,
  });
}

/**
 * @param {string} textHe
 */
function patternAnswerBlocks(answerText) {
  const text = String(textHe || "").trim();
  if (!text) return [];
  const sentenceBreak = text.search(/(?<=[.!?])\s+(?=\S)/u);
  if (sentenceBreak >= 12 && sentenceBreak < text.length - 12) {
    return [
      { type: "observation", answerText: text.slice(0, sentenceBreak).trim(), source: "pattern_composer" },
      { type: "meaning", answerText: text.slice(sentenceBreak).trim(), source: "pattern_composer" },
    ];
  }
  return [
    { type: "observation", answerText: text, source: "pattern_composer" },
    {
      type: "meaning",
      explanationCode: "copilot.answers.utils_parent-copilot_pattern-answer-composers.this_is_a_focused_answer_according_to_what_appears_in_the_report",
      source: "pattern_composer",
    },
  ];
}

/**
 * @param {string} textHe
 * @param {object} focus
 */
function patternDraft(answerText, focus, plannerIntent) {
  return {
    answerBlocks: patternAnswerBlocks(answerText),
    plannerIntent,
    focusTopic: focus,
    answerComposerUsed: "pattern_composer",
  };
}

function composeWhereHelp(payload) {
  const weakTopics = pickWeakestTopics(collectTopicMetrics(payload), 2);
  if (!weakTopics.length) return null;
  const first = topicAnchorFields(weakTopics[0]);
  let text = `According to the report, the first place worth strengthening is ${first.subjectLabel} - ${first.topicLabel}: ${first.questionCount} questions, ${first.accuracyPercent}% success. This is the best topic to start with because it both appears in the report and gives a clear direction for a short practice at home.`;
  if (weakTopics.length >= 2) {
    const second = topicAnchorFields(weakTopics[1]);
    text += `After him you can also pay attention to ${second.subjectLabel} - ${second.topicLabel}: ${second.questionCount} questions, ${second.accuracyPercent}% success.`;
  }
  text += `The practical step: start one short activity on the first topic, 5-10 minutes, then check if the following answers are more stable.`;
  return patternDraft(text, first, "what_is_still_difficult");
}

function composeThreeThings(payload) {
  const metas = collectTopicMetrics(payload);
  const strong = pickStrongForThreeThings(metas);
  const weak = pickWeakForThreeThings(metas);
  if (!metas.length) return null;

  let text = copilotStaticMessage("copilot.answers.utils_parent-copilot_pattern-answer-composers.the_three_most_important_things_right_now_are");
  if (strong) {
    const s = topicAnchorFields(strong);
    text += `1. Preserve what works: ${s.subjectLabel} - ${s.topicLabel}, with ${s.questionCount} questions and ${s.accuracyPercent}% success.\n\n`;
  } else {
    text += "1. First, accumulate another short practice, so that the image in the report will be more stable.";
  }
  if (weak) {
    const w = topicAnchorFields(weak);
    text += `2. Strengthen one point: ${w.subjectLabel} - ${w.topicLabel}, with ${w.questionCount} questions and ${w.accuracyPercent}% success.\n\n`;
    text += `3. Take a small step at home: one short activity on ${w.topicLabel}, without overloading many topics together.`;
    return patternDraft(text, w, "what_is_most_important");
  }
  text += "2. At the moment, there is not one subject that stands out enough for reinforcement, so it is better to keep the practice short and varied.";
  const fallbackWeak = pickWeakestTopic(metas);
  const wLabel = fallbackWeak ? fallbackWeak.label || fallbackWeak.displayName : "Topic";
  text += `3. Take a small step at home: one short activity on ${wLabel}, without overloading many topics together.`;
  const focus = fallbackWeak ? topicAnchorFields(fallbackWeak) : strong ? topicAnchorFields(strong) : topicAnchorFields(metas[0]);
  return patternDraft(text, focus, "what_is_most_important");
}

function composeAvoidNow(payload, utteranceStr = "") {
  let text =
    "Right now you should avoid three things: don't draw a personal conclusion about the child, don't open many topics together, and don't decide based on one or two questions. According to the report, it is better to choose one topic for a short practice, check several answers in a row, and then see if the direction returns later on.";
  const weak = pickWeakestTopic(collectTopicMetrics(payload));
  if (weak?.q) {
    const a = topicAnchorFields(weak);
    text += `Topic to start: ${a.subjectLabel} - ${a.topicLabel}.`;
    return patternDraft(text, a, "what_not_to_do_now");
  }
  const truthPacket = buildTruthPacketV1(payload, {
    scopeType: "executive",
    scopeId: "executive",
    scopeLabel: copilotStaticMessage("copilot.answers.utils_parent-copilot_pattern-answer-composers.report_summary"),
    canonicalIntent: "what_not_to_do_now",
    parentUtterance: utteranceStr,
  });
  if (!truthPacket) return null;
  return {
    answerBlocks: patternAnswerBlocks(text),
    plannerIntent: "what_not_to_do_now",
    focusTopic: null,
    answerComposerUsed: "pattern_composer",
    truthPacket,
  };
}

function composeImportantNow(payload) {
  const metas = collectTopicMetrics(payload);
  const weak = pickWeakestTopic(metas);
  if (weak?.q) {
    const a = topicAnchorFields(weak);
    const text = `The most important thing right now is to choose one topic to strengthen and not spread the practice. According to the report, the first place to start is ${a.subjectLabel} - ${a.topicLabel}: ${a.questionCount} questions, ${a.accuracyPercent}% success. You should practice for 5-10 minutes, 3-5 questions, and then check if the answers are more stable.`;
    return patternDraft(text, a, "what_is_most_important");
  }
  const stable = pickStableTopicForProgress(metas);
  if (stable?.q) {
    const a = topicAnchorFields(stable);
    const text = `The most important thing right now is to keep the practice short and regular. According to the report, the topic that seems more stable in this period is ${a.subjectLabel} - ${a.topicLabel}: ${a.questionCount} questions, ${a.accuracyPercent}% success. You should practice for 5-10 minutes, 3-5 questions, and then check if the stability is maintained.`;
    return patternDraft(text, a, "what_is_most_important");
  }
  return null;
}

function composeProgressWhere(payload) {
  const trend = hasProgressComparisonTrend(payload) ? composeTrend(payload) : null;
  if (trend) return { ...trend, patternId: "progress_where" };

  const metas = collectTopicMetrics(payload);
  const stableTopic = pickStableTopicForProgress(metas);
  if (stableTopic?.q) {
    const a = topicAnchorFields(stableTopic);
    const text = `The current report does not show a sufficient comparison that proves a change from the previous week. Yes, you can see where the practice seems more stable during this period: ${a.subjectLabel} - ${a.topicLabel}, with ${a.questionCount} questions and ${a.accuracyPercent}% success. That's why you should continue there with a short practice and check if the stability is maintained in the future.`;
    return patternDraft(text, a, "explain_report");
  }

  const subjectAnchor = pickStableSubjectForProgress(payload);
  if (subjectAnchor?.questionCount) {
    const text = `The current report does not show a sufficient comparison that proves a change from the previous week. Yes, you can see where the practice seems more stable during this period: ${subjectAnchor.subjectLabel}, with ${subjectAnchor.questionCount} questions and ${subjectAnchor.accuracyPercent}% success. That's why you should continue there with a short practice and check if the stability is maintained in the future.`;
    const truthPacket = buildTruthPacketV1(payload, {
      scopeType: "subject",
      scopeId: subjectAnchor.subjectId,
      scopeLabel: subjectAnchor.subjectLabel,
      canonicalIntent: "explain_report",
      parentUtterance: "",
    });
    if (!truthPacket) return null;
    return {
      answerBlocks: patternAnswerBlocks(text),
      plannerIntent: "explain_report",
      focusTopic: subjectAnchor,
      answerComposerUsed: "pattern_composer",
      truthPacket,
    };
  }

  return null;
}

function composeHomeToday(payload, conv) {
  const weak = resolveContextTopicMetrics(payload, conv, { allowWeakestFallback: true });
  if (!weak?.q) return null;
  const a = topicAnchorFields(weak);
  let text = `Today I would do one thing: a short activity on the topic ${a.subjectLabel} - ${a.topicLabel}. In the report there are ${a.questionCount} questions with ${a.accuracyPercent}% success, so it is a good place for focused practice. Do only 5-10 minutes, 3-5 questions, and at the end ask the child: How did you think of the answer?`;
  const hit = findTopicRowByKey(payload, a.topicRowKey, a.subjectId || undefined);
  const sub =
    hit?.tr?.contractsV1?.evidence?.safeSubskillHe ||
    hit?.tr?.safeSubskillHe ||
    hit?.tr?.contractsV1?.narrative?.safeSubskillHe;
  if (String(sub || "").trim().length >= 3) {
    text += copilotStaticMessage("copilot.answers.utils_parent-copilot_pattern-answer-composers.if_a_clear_sub_skill_appears_in_the_report_you_should_focus_on_i");
  }
  return patternDraft(text, a, "what_to_do_today");
}

function composeAskAtHome(payload, conv) {
  const weak = resolveContextTopicMetrics(payload, conv, { allowWeakestFallback: true });
  if (!weak?.q) return null;
  const a = topicAnchorFields(weak);
  const text = `You can ask him three short questions about ${a.subjectLabel} - ${a.topicLabel}:\n\n1. What did they ask you to find in the question?\n\n2. How did you decide what the first step is?\n\n3. Where did you feel it became difficult?\n\nThe goal is to understand his way of thinking, not to test him for a long time.`;
  return patternDraft(text, a, "what_to_do_today");
}

function composeWhatNotInfer(payload, utterance) {
  const text =
    "You should not draw a personal conclusion about the child from the report, nor compare him to other children. The report shows only what happened in practice on the site during the selected period: subjects, subjects, amount of questions and accuracy. Therefore it is correct to focus on one small study step according to the data, and not to conclude beyond what appears in the report.";
  const truthPacket = buildTruthPacketV1(payload, {
    scopeType: "executive",
    scopeId: "executive",
    scopeLabel: copilotStaticMessage("copilot.answers.utils_parent-copilot_pattern-answer-composers.report_summary"),
    canonicalIntent: "report_trust_question",
    parentUtterance: utterance,
  });
  if (!truthPacket) return null;
  return {
    answerBlocks: patternAnswerBlocks(text),
    plannerIntent: "report_trust_question",
    focusTopic: null,
    answerComposerUsed: "pattern_composer",
    truthPacket,
    scopeMeta: {
      generationPath: "pattern_composer",
      patternId: "what_not_infer",
      intentReason: "pattern:what_not_infer",
      scopeConfidence: 0.95,
      scopeReason: "approved_pattern_composer",
    },
  };
}

function composeOpenActivity(payload) {
  const weak = pickWeakestTopic(collectTopicMetrics(payload));
  if (!weak) return null;
  const a = topicAnchorFields(weak);
  const text = `You should start a short activity on the topic ${a.subjectLabel} - ${a.topicLabel}. In the report there are ${a.questionCount} questions with ${a.accuracyPercent}% success, so this is a good topic for focused practice now. It is recommended to choose only one short activity, to see if there is an improvement before moving on to another topic.`;
  return patternDraft(text, a, "what_to_do_now");
}

function findTrendAnchor(payload) {
  const trends = payload?.executiveSummary?.majorTrendsHe;
  if (!Array.isArray(trends) || !trends.length) return null;
  const metas = collectTopicMetrics(payload);
  for (const line of trends) {
    const trendText = String(line || "").trim();
    if (!isRealTrendLineHe(trendText)) continue;
    for (const m of metas) {
      if (m.displayName && trendText.includes(m.displayName)) {
        return { ...topicAnchorFields(m), trendText };
      }
    }
    for (const sid of SUBJECT_ORDER) {
      const label = subjectLabelHe(sid);
      if (trendText.includes(label)) {
        const topic = pickWeakestTopic(metas.filter((x) => x.sid === sid)) || metas.find((x) => x.sid === sid);
        if (topic) return { ...topicAnchorFields(topic), trendText };
      }
    }
  }
  const trendText = trends
    .map((x) => String(x || "").trim())
    .find((t) => isRealTrendLineHe(t));
  const weak = pickWeakestTopic(metas);
  if (trendText && weak) return { ...topicAnchorFields(weak), trendText };
  return null;
}

function composeTrend(payload) {
  if (!exportTrendEvidence(payload)) return null;
  const anchor = findTrendAnchor(payload);
  if (!anchor?.trendText) return null;
  const text = `The report shows a change in ${anchor.subjectLabel} - ${anchor.topicLabel}: ${anchor.trendText}. Therefore, it can be said that there is a direction in the report, but it is still worth checking it in another short practice.`;
  return patternDraft(text, anchor, "explain_report");
}

function composeParentActivity(payload) {
  const anchor = exportParentActivityEvidence(payload);
  if (!anchor) return null;
  const text = `The report shows personal activity on the subject ${anchor.subjectLabel} - ${anchor.topicLabel}. After the activity, ${anchor.questionCount} questions appear with ${anchor.accuracyPercent}% success. This gives an initial direction, but it is worth checking another short practice before concluding a stable change.`;
  return patternDraft(text, anchor, "explain_report");
}

function composeSpeed(payload) {
  const anchor = exportSpeedEvidence(payload);
  if (!anchor) return null;
  const text = `The report shows a sign that part of the practice was in fast mode. That's why you should check ${anchor.subjectLabel} - ${anchor.topicLabel} also in normal practice, without time pressure, and see if the answers are more stable.`;
  return patternDraft(text, anchor, "explain_report");
}

function composeLearningSeverityFollowup(payload, conv) {
  const last = resolveLastTopicFromConv(payload, conv);
  if (!last?.questionCount) return null;
  const text = `From the report, it can only be regarded as a study subject for practice. In ${last.subjectLabel} - ${last.topicLabel} there are ${last.questionCount} questions with ${last.accuracyPercent}% success, so the recommendation is to start with a short and focused practice, not to conclude beyond what the report shows.`;
  return patternDraft(text, last, "explain_report");
}

/**
 * @param {unknown} payload
 * @param {object} conv
 */
function resolveLastTopicFromConv(payload, conv) {
  const ctx = resolveContextTopicMetrics(payload, conv, { allowWeakestFallback: false });
  if (ctx) return topicAnchorFields(ctx);
  const weak = pickWeakestTopic(collectTopicMetrics(payload));
  return weak ? topicAnchorFields(weak) : null;
}

/**
 * @param {object} params
 */
export function tryComposePatternAnswerDraft(params) {
  const utteranceStr = String(params?.utteranceStr || "");
  const payload = params?.payload;
  const conv = params?.conversationState || {};
  const pattern = classifyApprovedPatternQuestion(utteranceStr);
  if (!pattern) return null;

  if (pattern === "learning_severity_followup") {
    const hasCtx =
      String(conv.lastResolvedTopic || "").trim() ||
      String(conv.lastResolvedSubject || "").trim() ||
      (Array.isArray(conv.priorScopes) && conv.priorScopes.length > 0);
    if (!hasCtx) return null;
  }

  /** @type {null|ReturnType<typeof patternDraft>} */
  let composed = null;
  switch (pattern) {
    case "progress_where":
      composed = composeProgressWhere(payload);
      break;
    case "important_now":
      composed = composeImportantNow(payload);
      break;
    case "avoid_now": {
      const fixed = composeAvoidNow(payload, utteranceStr);
      if (fixed?.truthPacket) return { ...fixed, patternId: "avoid_now" };
      composed = fixed;
      break;
    }
    case "home_today":
      composed = composeHomeToday(payload, conv);
      break;
    case "ask_at_home":
      composed = composeAskAtHome(payload, conv);
      break;
    case "what_not_infer": {
      const fixed = composeWhatNotInfer(payload, utteranceStr);
      if (fixed) return { ...fixed, patternId: "what_not_infer" };
      return { noData: true, patternId: pattern, plannerIntent: "report_trust_question" };
    }
    case "where_help":
      composed = composeWhereHelp(payload);
      break;
    case "three_things":
      composed = composeThreeThings(payload);
      break;
    case "open_activity":
      composed = composeOpenActivity(payload);
      break;
    case "trend":
      composed = composeTrend(payload);
      break;
    case "parent_activity":
      composed = composeParentActivity(payload);
      break;
    case "speed":
      composed = composeSpeed(payload);
      break;
    case "learning_severity_followup":
      composed = composeLearningSeverityFollowup(payload, conv);
      break;
    default:
      break;
  }

  if (!composed) {
    return {
      noData: true,
      patternId: pattern,
      plannerIntent: "unknown_report_question",
    };
  }

  if (composed.truthPacket) {
    return {
      ...composed,
      patternId: pattern,
      scopeMeta: composed.scopeMeta || {
        generationPath: "pattern_composer",
        patternId: pattern,
        intentReason: `pattern:${pattern}`,
        scopeConfidence: 0.92,
        scopeReason: "approved_pattern_composer",
      },
    };
  }

  const truthPacket = buildTopicTruthPacket(payload, composed.focusTopic, utteranceStr, composed.plannerIntent);
  if (!truthPacket) {
    return {
      noData: true,
      patternId: pattern,
      plannerIntent: composed.plannerIntent,
    };
  }

  return {
    ...composed,
    patternId: pattern,
    truthPacket,
    scopeMeta: {
      generationPath: "pattern_composer",
      patternId: pattern,
      intentReason: `pattern:${pattern}`,
      scopeConfidence: 0.92,
      scopeReason: "approved_pattern_composer",
    },
  };
}

export function patternNoDataResponseHe() {
  return NO_DATA_FOR_REQUEST_RESPONSE_HE;
}
