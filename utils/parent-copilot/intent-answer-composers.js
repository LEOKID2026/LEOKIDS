/**
 * Intent-specific Parent Copilot answer composers (not shared FAQ/metric blocks).
 */

import { copilotStaticMessage } from "../../lib/parent-copilot/copilot-static-message.js";
import {
  findTopicRowByKey,
  listCopilotAnchoredTopicRows,
  normalizeSubjectId,
  subjectLabelHe,
  SUBJECT_ORDER,
} from "./contract-reader.js";
import { resolveReportRowFromUtterance } from "./report-row-resolver.js";
import { findDiagnosticUnitForIntelligence } from "./truth-packet-v1.js";
import { extractMistakePatternHeFromUnit, isMistakePatternQuestion } from "./topic-evidence-answer.js";
import {
  classifyPracticePolarity,
  meaningHeForPolarity,
  POLARITY,
  textViolatesPolarityForEvidence,
} from "./evidence-polarity.js";
import { parentFacingTopicRowLabelHe } from "../parent-report-topic-evidence.js";
import {
  classifySubjectEvidenceTier,
  SUBJECT_EVIDENCE_TIER,
  zeroEvidenceSubjectCopilotHe,
} from "../parent-report-language/subject-evidence-policy.js";
import { ANSWER_CONTRACT, resolveAnswerContract, subjectQuestionCountFromPayload } from "./intent-answer-contract.js";
import { foldUtteranceForHeMatch } from "./utterance-normalize-he.js";
import {
  evidenceSourcePhraseHe,
  gradeScopeMeaningHe,
  masteryReallocationHe,
} from "../parent-report-language/grade-insight-he.js";
import { detectAggregateQuestionClass } from "./semantic-question-class.js";

const STRONG_ACC_MIN = 75;
const STRONG_Q_MIN = 8;
const WEAK_ACC_MAX = 54;
// Soft volume gate for "you may be over-investing in an already-mastered topic".
// Not an evidence/confidence threshold — only decides whether to OFFER a reallocation hint.
const MASTERY_REALLOCATION_Q_MIN = 24;

/**
 * @param {unknown} tr
 */
function rowMetrics(tr) {
  const q = Math.max(0, Number(tr?.questions ?? tr?.questionCount) || 0);
  const acc = Math.max(0, Math.min(100, Math.round(Number(tr?.accuracy) || 0)));
  const sid = normalizeSubjectId(tr?.subjectId || tr?.contractsV1?.evidence?.subjectId || "");
  const topicRowKey = String(tr?.topicRowKey || tr?.topicKey || "").trim();
  const displayName = String(tr?.displayName || "Topic").trim();
  const riv = tr?.rowIdentityV1 && typeof tr.rowIdentityV1 === "object" ? tr.rowIdentityV1 : {};
  return {
    q,
    acc,
    sid,
    topicRowKey,
    displayName,
    contentGradeKey: riv.contentGradeKey ?? null,
    gradeRelation: riv.gradeRelation ?? null,
    evidenceSources: Array.isArray(riv.evidenceSources) ? riv.evidenceSources : [],
    primaryEvidenceSource: riv.primaryEvidenceSource ?? null,
    label: parentFacingTopicRowLabelHe({
      displayName,
      contentGradeKey: riv.contentGradeKey,
      gradeRelation: riv.gradeRelation,
      topicRowKey,
      registeredGradeKey: null,
    }),
  };
}

/**
 * All in-window topic rows with practice (matches real detailed-report UI rows).
 * @param {unknown} payload
 */
function collectPracticeMetrics(payload) {
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  /** @type {ReturnType<typeof rowMetrics>[]} */
  const metas = [];
  const seen = new Set();
  const pushMetric = (m) => {
    if (!m || m.q <= 0) return;
    const key = `${m.sid}|${m.topicRowKey}`;
    if (seen.has(key)) return;
    seen.add(key);
    metas.push(m);
  };
  for (const sp of profiles) {
    const sid = normalizeSubjectId(sp?.subject);
    const list = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
    for (const tr of list) {
      pushMetric(rowMetrics({ ...tr, subjectId: sid }));
    }
    for (const row of Array.isArray(sp?.topicOverviewRows) ? sp.topicOverviewRows : []) {
      pushMetric(
        rowMetrics({
          ...row,
          topicRowKey: row.topicRowKey || row.topicKey,
          subjectId: sid,
        }),
      );
    }
  }
  if (metas.length) return metas;
  const anchored = listCopilotAnchoredTopicRows(payload);
  for (const { subject, tr } of anchored) {
    const m = rowMetrics({ ...tr, subjectId: subject });
    if (m.q > 0) metas.push(m);
  }
  return metas;
}

/**
 * Weighted subject accuracy rollups (matches aggregate semantic ranking).
 * @param {unknown} payload
 */
function subjectWeightedAvgRows(payload) {
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  /** @type {Array<{ sid: string; label: string; totalQ: number; avg: number }>} */
  const rows = [];
  for (const sid of SUBJECT_ORDER) {
    const sp = profiles.find((p) => normalizeSubjectId(p?.subject) === sid);
    if (!sp) continue;
    let totalQ = 0;
    let wAcc = 0;
    for (const tr of Array.isArray(sp.topicRecommendations) ? sp.topicRecommendations : []) {
      const q = Math.max(0, Number(tr?.questions ?? tr?.questionCount) || 0);
      const acc = Math.max(0, Math.min(100, Math.round(Number(tr?.accuracy) || 0)));
      if (q > 0) {
        totalQ += q;
        wAcc += acc * q;
      }
    }
    if (totalQ > 0) {
      rows.push({ sid, label: subjectLabelHe(sid), totalQ, avg: Math.round(wAcc / totalQ) });
    }
  }
  return rows;
}

/**
 * Focus topic for mistake/home/topic contracts when scope is executive or inherited.
 * @param {object} params
 */
export function resolveFocusTopicContext(params) {
  const payload = params?.payload;
  const truthPacket = params?.truthPacket;
  const conv = params?.conversationState;

  if (String(truthPacket?.scopeType || "") === "topic" && truthPacket?.scopeId) {
    const subjectId = String(truthPacket.surfaceFacts?.subjectId || "").trim();
    const hit = findTopicRowByKey(payload, String(truthPacket.scopeId), subjectId);
    if (hit?.tr) {
      const m = rowMetrics({ ...hit.tr, subjectId: hit.subject || subjectId });
      return {
        topicRowKey: m.topicRowKey,
        subjectId: m.sid,
        displayName: m.displayName,
        gradeSplitTopicRowKeys: Array.isArray(truthPacket.gradeSplitTopicRowKeys)
          ? truthPacket.gradeSplitTopicRowKeys
          : [],
      };
    }
  }

  const lastTopic = String(conv?.lastResolvedTopic || "").trim();
  if (lastTopic) {
    const hit = findTopicRowByKey(payload, lastTopic);
    if (hit?.tr) {
      const m = rowMetrics({ ...hit.tr, subjectId: hit.subject });
      return { topicRowKey: m.topicRowKey, subjectId: m.sid, displayName: m.displayName, gradeSplitTopicRowKeys: [] };
    }
  }

  const metas = collectPracticeMetrics(payload);
  const weak = pickWeakestRow(metas) || metas.sort((a, b) => b.q - a.q)[0];
  if (!weak) return null;
  const sameName = metas.filter((m) => m.displayName === weak.displayName && m.sid === weak.sid);
  const gradeSplitTopicRowKeys =
    sameName.length >= 2 ? sameName.map((m) => m.topicRowKey).filter(Boolean) : [];
  return {
    topicRowKey: weak.topicRowKey,
    subjectId: weak.sid,
    displayName: weak.displayName,
    gradeSplitTopicRowKeys,
  };
}

/**
 * @param {string} contract
 */
function contractNeedsTopicFocus(contract) {
  return (
    contract === ANSWER_CONTRACT.mistake_pattern ||
    contract === ANSWER_CONTRACT.topic_problem ||
    contract === ANSWER_CONTRACT.home_practice ||
    contract === ANSWER_CONTRACT.topic_lookup
  );
}

/**
 * @param {object} params
 */
function gatherTopicRowMetrics(params) {
  const payload = params.payload;
  const truthPacket = params.truthPacket;
  const subjectId =
    String(truthPacket?.surfaceFacts?.subjectId || "").trim() ||
    String(params?.subjectId || "").trim();
  const splitKeys = Array.isArray(truthPacket?.gradeSplitTopicRowKeys)
    ? truthPacket.gradeSplitTopicRowKeys.map((k) => String(k || "").trim()).filter(Boolean)
    : [];
  /** @type {ReturnType<typeof rowMetrics>[]} */
  const rows = [];
  if (splitKeys.length >= 2) {
    for (const key of splitKeys) {
      const hit = findTopicRowByKey(payload, key, subjectId);
      if (hit?.tr) rows.push(rowMetrics({ ...hit.tr, subjectId: hit.subject || subjectId }));
    }
  } else {
    const scopeId = String(truthPacket?.scopeId || "").trim();
    const hit = findTopicRowByKey(payload, scopeId, subjectId);
    if (hit?.tr) rows.push(rowMetrics({ ...hit.tr, subjectId: hit.subject || subjectId }));
  }
  return rows;
}

/**
 * @param {ReturnType<typeof rowMetrics>[]} rows
 */
function pickWeakestRow(rows) {
  const withQ = rows.filter((r) => r.q >= STRONG_Q_MIN);
  if (!withQ.length) return rows[0] || null;
  return [...withQ].sort((a, b) => a.acc - b.acc || b.q - a.q)[0];
}

/**
 * @param {ReturnType<typeof rowMetrics>[]} rows
 */
function gradeSplitNarrativeHe(rows) {
  if (rows.length < 2) return "";
  const parts = rows
    .filter((r) => r.q > 0)
    .map((r) => `${r.label}: ${r.q} questions, accuracy about ${r.acc}%`)
    .join("; ");
  const weak = pickWeakestRow(rows);
  if (!parts) return "";
  let text = `In the same subject there is practice in several grade levels - ${parts}.`;
  if (weak) {
    text += `The weaker line is ${weak.label} (precision ${weak.acc}%).`;
  }
  return text;
}

/**
 * @param {object} params
 */
function buildEvidenceUsed(params) {
  const truthPacket = params.truthPacket;
  const payload = params.payload;
  const subjectId = String(truthPacket?.surfaceFacts?.subjectId || "").trim();
  const scopeId = String(truthPacket?.scopeId || "").trim();
  const unit = findDiagnosticUnitForIntelligence(payload, subjectId, scopeId);
  const patternHe = extractMistakePatternHeFromUnit(unit);
  const diagLine = String(unit?.diagnosis?.lineHe || "").trim();
  return {
    questions: Number(truthPacket?.surfaceFacts?.questions) || 0,
    accuracy: Number(truthPacket?.surfaceFacts?.accuracy) || 0,
    grade: truthPacket?.surfaceFacts?.contentGradeKey ?? null,
    gradeRelation: truthPacket?.surfaceFacts?.gradeRelation ?? null,
    patternHe: patternHe || null,
    diagnosisLine: diagLine || null,
    recommendation: String(truthPacket?.contracts?.narrative?.textSlots?.action || "").trim() || null,
    noData:
      classifySubjectEvidenceTier(subjectQuestionCountFromPayload(payload, subjectId)) ===
      SUBJECT_EVIDENCE_TIER.none,
    rowSourceIds: Array.isArray(truthPacket?.gradeSplitTopicRowKeys)
      ? truthPacket.gradeSplitTopicRowKeys
      : scopeId
        ? [scopeId]
        : [],
  };
}

/**
 * @param {object} params
 */
function composeReportExplanation(params) {
  const payload = params.payload;
  const metas = collectPracticeMetrics(payload);
  const totalQ = metas.reduce((s, m) => s + m.q, 0);
  const subjectsPracticed = new Set(metas.map((m) => m.sid));
  const subjectLabels = [...subjectsPracticed].map((sid) => subjectLabelHe(sid));
  const strong = metas
    .filter((m) => m.q >= STRONG_Q_MIN && m.acc >= STRONG_ACC_MIN)
    .sort((a, b) => b.acc - a.acc || b.q - a.q)
    .slice(0, 2);
  const weak = metas
    .filter((m) => m.q >= STRONG_Q_MIN && m.acc <= WEAK_ACC_MAX)
    .sort((a, b) => a.acc - b.acc || b.q - a.q)
    .slice(0, 2);
  const allThin = metas.length > 0 && metas.every((m) => m.q < STRONG_Q_MIN);

  const practicedPhrase =
    subjectLabels.length > 0
      ? `During the period, practice was recorded in ${subjectLabels.join(", ")} - a total of ${totalQ} questions.`
      : totalQ > 0
        ? `During the period, about ${totalQ} practice questions were recorded.`
        : "In the range of the period there is still very little practice - the general picture is still partial.";

  /** @type {string[]} */
  const meaningParts = [];
  if (strong.length) {
    meaningParts.push(
      `What works relatively well: ${strong.map((m) =>`${subjectLabelHe(m.sid)} - ${m.displayName} (about ${m.acc}% on ${m.q} questions)`).join("; ")}.`,
    );
  }
  if (weak.length) {
    const lead =
      weak.length === 1
        ? `The main thing that requires attention right now is ${subjectLabelHe(weak[0].sid)} - ${weak[0].displayName}`
        : `Places that require strengthening: ${weak.map((m) =>`${subjectLabelHe(m.sid)} - ${m.displayName} (about ${m.acc}%)`).join("; ")}`;
    meaningParts.push(`${lead}.`);
  } else if (!strong.length && metas.length) {
    meaningParts.push("There is still no very prominent strong line - you should continue a short practice and follow stability.");
  }

  let action =
    weak.length > 0
      ? `This week: Focused practice 5–10 minutes a day around ${weak[0].displayName}, then check if accuracy increases.`
      : strong.length > 0
        ? "This week: keep a short and routine practice in the strong subjects, and follow that the direction is maintained."
        : "This week: add a short practice focused on one subject, then come back to ask again about the report.";
  if (allThin) {
    const primary = metas[0];
    let unc = "";
    for (const sp of Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : []) {
      if (primary?.sid && normalizeSubjectId(sp?.subject) !== primary.sid) continue;
      for (const tr of Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : []) {
        const u = tr?.contractsV1?.narrative?.textSlots?.uncertainty;
        if (u) {
          unc = String(u).trim();
          break;
        }
      }
      if (unc) break;
    }
    if (unc) action = unc;
    else if (primary) {
      meaningParts.push(meaningHeForPolarity(primary.displayName, primary.q, primary.acc));
      action = copilotStaticMessage("copilot.answers.utils_parent-copilot_intent-answer-composers.right_now_it_s_worth_gathering_more_practice");
    }
  }

  return {
    answerBlocks: [
      { type: "observation", answerText: practicedPhrase, source: "intent_composer" },
      { type: "meaning", answerText: meaningParts.join(" "), source: "intent_composer" },
      { type: "next_step", answerText: action, source: "intent_composer" },
    ],
    plannerIntent: "explain_report",
    answerComposerUsed: ANSWER_CONTRACT.report_explanation,
  };
}

/**
 * @param {object} params
 */
function composeTopicProblem(params) {
  const truthPacket = params.truthPacket;
  const payload = params.payload;
  const scopeType = String(truthPacket?.scopeType || "");
  let rowMetricsList = gatherTopicRowMetrics(params);
  if (scopeType === "subject") {
    const sid = normalizeSubjectId(truthPacket.scopeId);
    rowMetricsList = collectPracticeMetrics(payload).filter((m) => m.sid === sid);
  }
  const primary = pickWeakestRow(rowMetricsList) || rowMetricsList[0];
  if (!primary) return null;

  const displayName = String(truthPacket?.scopeLabel || primary.displayName || "the topic").trim();
  const q = primary.q;
  const acc = primary.acc;
  const polarity = classifyPracticePolarity(q, acc);
  const unit = findDiagnosticUnitForIntelligence(payload, primary.sid, primary.topicRowKey);
  const patternHe = extractMistakePatternHeFromUnit(unit);
  const gradeNote = gradeSplitNarrativeHe(rowMetricsList);

  const registered = String(
    truthPacket?.surfaceFacts?.registeredGradeKey || payload?.registeredGradeKey || "",
  ).trim();

  /** @type {string[]} */
  const meaningParts = [];
  if (gradeNote) meaningParts.push(gradeNote);
  if (registered && primary.gradeRelation === "higher") {
    meaningParts.push(`Part of the practice was performed above the listed class (${registered}) - you should read this separately from performing in the listed class.`);
  } else if (primary.gradeRelation === "lower") {
    meaningParts.push("Part of the practice was performed at a basic/low grade level - difficulty here may indicate a need to strengthen the basics in the subject before advancing to the grade level.");
  }
  const problemSrcPhrase = evidenceSourcePhraseHe(primary.primaryEvidenceSource);
  if (problemSrcPhrase) {
    meaningParts.push(`The bulk of the evidence on this issue was collected ${problemSrcPhrase}.`);
  }
  if (polarity === POLARITY.support_needed) {
    meaningParts.push(
      patternHe
        ? `In ${displayName} there are ${q} questions with an accuracy of about ${acc}% - we see a recurring difficulty: ${patternHe}. Academically, this means that the foundation is not yet stable enough before difficulty is added.`
        : meaningHeForPolarity(displayName, q, acc) +
            "From an academic point of view, this means that you should strengthen before concluding that everything is stable.",
    );
  } else if (polarity === POLARITY.thin) {
    meaningParts.push(`In ${displayName} there is still a little practice (${q} questions) - it is too early to determine a clear direction.`);
  } else {
    meaningParts.push(
      `In ${displayName} seems relative stability (${acc}% on ${q} questions) - it is still worth making sure it returns.`,
    );
  }

  const observation =
    rowMetricsList.length >= 2
      ? `In ${displayName} there is practice at several grade levels during the period - below is the breakdown by lines in the report.`
      : `In ${primary.label} during this period there are ${q} questions, with an accuracy of about ${acc}%.`;

  const action =
    polarity === POLARITY.support_needed
      ? `You should start with focused strengthening on ${displayName}: 5-10 minutes a day, the same type of question, and checking if the accuracy increases before adding a level.`
      : `It is useful to keep a short practice in ${displayName} and monitor that the stability is maintained.`;

  return {
    answerBlocks: [
      { type: "observation", answerText: observation, source: "intent_composer" },
      { type: "meaning", answerText: meaningParts.join(" "), source: "intent_composer" },
      { type: "next_step", answerText: action, source: "intent_composer" },
    ],
    plannerIntent: "what_is_still_difficult",
    answerComposerUsed: ANSWER_CONTRACT.topic_problem,
  };
}

/**
 * @param {object} params
 */
function composeMistakePattern(params) {
  const truthPacket = params.truthPacket;
  const payload = params.payload;
  const scopeType = String(truthPacket?.scopeType || "");
  let subjectId = String(truthPacket?.surfaceFacts?.subjectId || "").trim();
  let scopeId = String(truthPacket?.scopeId || "").trim();
  let displayName = String(truthPacket?.scopeLabel || truthPacket?.surfaceFacts?.displayName || "the topic").trim();

  if (scopeType === "subject") {
    subjectId = String(truthPacket.scopeId || subjectId).trim();
    const rows = collectPracticeMetrics(payload)
      .filter((m) => m.sid === subjectId && m.q >= STRONG_Q_MIN)
      .sort((a, b) => a.acc - b.acc || b.q - a.q);
    const weak = rows[0];
    if (weak) {
      scopeId = weak.topicRowKey;
      displayName = weak.displayName;
    }
  }

  const unit = findDiagnosticUnitForIntelligence(payload, subjectId, scopeId);
  const rowMetricsList = collectPracticeMetrics(payload).filter(
    (m) => (!scopeId || m.topicRowKey === scopeId) && (!subjectId || m.sid === subjectId),
  );
  const primaryRow = rowMetricsList.sort((a, b) => a.acc - b.acc || b.q - a.q)[0];
  const q = primaryRow?.q ?? (Number(truthPacket?.surfaceFacts?.questions) || 0);
  const acc = primaryRow?.acc ?? (Number(truthPacket?.surfaceFacts?.accuracy) || 0);
  const polarity = classifyPracticePolarity(q, acc);
  if (polarity === POLARITY.thin || polarity === POLARITY.none) {
    const label = String(displayName || primaryRow?.displayName || "the topic").trim();
    const unc =
      payload?.subjectProfiles
        ?.flatMap((sp) => sp?.topicRecommendations || [])
        ?.find((tr) => String(tr?.topicRowKey || "") === scopeId || String(tr?.displayName || "") === label)
        ?.contractsV1?.narrative?.textSlots?.uncertainty || "";
    return {
      answerBlocks: [
        {
          type: "observation",
          answerText: `${label} has ${q} questions in the period range - still a little given.`,
          source: "intent_composer",
        },
        {
          type: "meaning",
          answerText: meaningHeForPolarity(label, q, acc),
          source: "intent_composer",
        },
        {
          type: "next_step",
          answerText: String(unc || "").trim() || "Right now it's worth gathering more practice before making a decision.",
          source: "intent_composer",
        },
      ],
      plannerIntent: "what_is_still_difficult",
      answerComposerUsed: ANSWER_CONTRACT.mistake_pattern,
    };
  }

  const patternHe = extractMistakePatternHeFromUnit(unit);
  const diagLine =
    unit?.diagnosis?.allowed !== false ? String(unit?.diagnosis?.lineHe || "").trim() : "";

  if (patternHe || diagLine) {
    const mistakeText = patternHe || diagLine;
    return {
      answerBlocks: [
        {
          type: "observation",
          answerText: `In ${displayName}, according to what appears in the report on error patterns:`,
          source: "intent_composer",
        },
        {
          type: "meaning",
          answerText: `The most prominent error that comes back is ${mistakeText}. This is a type of error that should be identified during practice - not just counting right/wrong.`,
          source: "intent_composer",
        },
        {
          type: "next_step",
          answerText: `Focused practice: 2-3 questions of the same type, without skipping a step - and ask the child to say out loud what he is doing before answering.`,
          source: "intent_composer",
        },
      ],
      plannerIntent: "what_is_still_difficult",
      answerComposerUsed: ANSWER_CONTRACT.mistake_pattern,
    };
  }

  return {
    answerBlocks: [
      {
        type: "observation",
        answerText: `${displayName} has enough practice data to see that there is a difficulty, but the report does not specify the type of error.`,
        source: "intent_composer",
      },
      {
        type: "meaning",
        answerText:
          "The report has enough information about the state of the issue, but not enough detail to identify the exact type of error.",
        source: "intent_composer",
      },
      {
        type: "next_step",
        answerText:
          "To collect it: during practice, write down one sentence about what the child did before he made a mistake - after 3-4 times a pattern will appear.",
        source: "intent_composer",
      },
    ],
    plannerIntent: "what_is_still_difficult",
    answerComposerUsed: ANSWER_CONTRACT.mistake_pattern,
  };
}

/**
 * @param {object} params
 */
function composeHomePractice(params) {
  const truthPacket = params.truthPacket;
  const displayName = String(truthPacket?.scopeLabel || truthPacket?.surfaceFacts?.displayName || "the topic").trim();
  const utterance = foldUtteranceForHeMatch(String(params?.utteranceStr || ""));
  const q = Math.max(0, Number(truthPacket?.surfaceFacts?.questions) || 0);
  const acc = Math.max(0, Math.min(100, Math.round(Number(truthPacket?.surfaceFacts?.accuracy) || 0)));
  const cannot = truthPacket?.derivedLimits?.cannotConcludeYet === true;
  const recEligible = truthPacket?.derivedLimits?.recommendationEligible !== false;
  if (cannot || !recEligible || classifyPracticePolarity(q, acc) === POLARITY.thin) {
    return null;
  }
  const duration =
    /כמה\s*זמן/u.test(utterance) ? "5-10 minutes a day, no more" : "About 5-10 minutes a day";

  return {
    answerBlocks: [
      {
        type: "observation",
        answerText: `A practical house plan around ${displayName}:`,
        source: "intent_composer",
      },
      {
        type: "meaning",
        answerText: `${duration}: (1) 2–3 questions of the same type without help; (2) a short test together after each question - what did you do before the answer; (3) notice if the same type of error repeats.`,
        source: "intent_composer",
      },
      {
        type: "next_step",
        explanationCode: "copilot.answers.utils_parent-copilot_intent-answer-composers.follow_up_after_3_4_days_like_this_then_check_in_the_report_if_t",
        source: "intent_composer",
      },
    ],
    plannerIntent: /שבוע/u.test(utterance) ? "what_to_do_this_week" : "what_to_do_today",
    answerComposerUsed: ANSWER_CONTRACT.home_practice,
  };
}

/**
 * @param {object} params
 */
function composeStrength(params) {
  const payload = params.payload;
  const practicedSubjects = SUBJECT_ORDER.filter(
    (sid) => classifySubjectEvidenceTier(subjectQuestionCountFromPayload(payload, sid)) !== SUBJECT_EVIDENCE_TIER.none,
  );
  const metas = collectPracticeMetrics(payload)
    .filter((m) => m.q >= STRONG_Q_MIN && m.acc >= STRONG_ACC_MIN)
    .sort((a, b) => b.acc - a.acc || b.q - a.q)
    .slice(0, 3);

  if (practicedSubjects.length === 1 && metas.length === 0) {
    const sid = practicedSubjects[0];
    const subQ = subjectQuestionCountFromPayload(payload, sid);
    const subMetas = collectPracticeMetrics(payload).filter((m) => m.sid === sid);
    const best = [...subMetas].sort((a, b) => b.acc - a.acc || b.q - a.q)[0];
    return {
      answerBlocks: [
        {
          type: "observation",
          answerText: `During the period, only ${subjectLabelHe(sid)} (${subQ} questions) will be practiced - there is not enough data to compare subjects.`,
          source: "intent_composer",
        },
        {
          type: "meaning",
          answerText: best
            ? `According to what is in the report, ${subjectLabelHe(sid)} is the only subject with practice - ${best.displayName} about ${best.acc}% on ${best.q} questions.`
            : `${subjectLabelHe(sid)} is the only subject with practice in the range - it is impossible to rank "strong/weak" between subjects.`,
          source: "intent_composer",
        },
      ],
      plannerIntent: "what_is_going_well",
      answerComposerUsed: ANSWER_CONTRACT.strength,
    };
  }

  if (!metas.length) {
    return {
      answerBlocks: [
        {
          type: "observation",
          answerText: "According to what appears in the report, there is not yet a topic with enough practice and high accuracy to call it \"strong\" reliably.",
          source: "intent_composer",
        },
        {
          type: "meaning",
          explanationCode: "copilot.answers.utils_parent-copilot_intent-answer-composers.this_does_not_mean_that_there_are_no_successes_just_that_it_is_s",
          source: "intent_composer",
        },
      ],
      plannerIntent: "what_is_going_well",
      answerComposerUsed: ANSWER_CONTRACT.strength,
    };
  }

  const list = metas
    .map((m) => `${subjectLabelHe(m.sid)} - ${m.displayName}: about ${m.acc}% on ${m.q} questions`)
    .join("; ");

  const singleSubjectNote =
    practicedSubjects.length === 1
      ? `During the period, only ${subjectLabelHe(practicedSubjects[0])} was practiced - there is not enough data to compare subjects.`
      : "";

  const lead = metas[0];
  const srcPhrase = evidenceSourcePhraseHe(lead?.primaryEvidenceSource);
  const meaningHe = srcPhrase
    ? `${list}. Part of the evidence for ${lead.displayName} was collected ${srcPhrase}.`
    : `${list}.`;

  // gradeRelation-aware next step: higher → consider leveling up; same → advance gradually.
  const relStep = gradeScopeMeaningHe({
    gradeRelation: lead?.gradeRelation,
    isStrength: true,
    topicName: lead?.displayName,
  });
  const reallocate =
    lead && lead.q >= MASTERY_REALLOCATION_Q_MIN ? masteryReallocationHe(lead.displayName) : "";
  const nextStepHe =
    [relStep, reallocate].filter(Boolean).join(" ") ||
    "You should keep a short and routine practice there, and level up only if success continues to appear.";

  const utteranceStr = String(params?.utteranceStr || "");
  const isStrongestSubjectQ = detectAggregateQuestionClass(utteranceStr) === "strongest_subject";
  const withAvg = subjectWeightedAvgRows(payload);
  const strongestSub =
    isStrongestSubjectQ && withAvg.length
      ? [...withAvg].sort((a, b) => (b.avg || 0) - (a.avg || 0) || b.totalQ - a.totalQ)[0]
      : null;

  let observationHe = `${singleSubjectNote}According to the practice data in the range, these are the relatively strong areas within what was practiced:`;
  if (strongestSub) {
    observationHe =
      withAvg.length === 1
        ? `There is currently mainly one subject with enough numerical practice in the report - ${strongestSub.label}, with an average accuracy of about ${strongestSub.avg}%.`
        : `The strongest subject at the moment is ${strongestSub.label} - according to the average overall accuracy across subjects with practice in the report (about ${strongestSub.avg}%).`;
  }

  return {
    answerBlocks: [
      {
        type: "observation",
        answerText: observationHe,
        source: "intent_composer",
      },
      { type: "meaning", answerText: meaningHe, source: "intent_composer" },
      {
        type: "next_step",
        answerText: nextStepHe,
        source: "intent_composer",
      },
    ],
    plannerIntent: "what_is_going_well",
    answerComposerUsed: ANSWER_CONTRACT.strength,
  };
}

/**
 * @param {object} params
 */
/**
 * @param {object} params
 */
function composeTopicLookup(params) {
  const payload = params.payload;
  const utteranceStr = String(params?.utteranceStr || "");
  const rowRes = resolveReportRowFromUtterance(utteranceStr, payload);
  const best = rowRes.best;
  const label = String(best?.displayName || "").trim();

  if (!best?.topicRowKey) {
    const tail = utteranceStr.replace(/^מה\s*(?:לגבי|עם)\s+/u, "").trim();
    return {
      answerBlocks: [
        {
          type: "observation",
          answerText: tail
            ? `In this period there is no practice data on ${tail} in the current report.`
            : copilotStaticMessage("copilot.answers.utils_parent-copilot_intent-answer-composers.during_this_period_there_is_no_practice_data_on_this_subject_in_"),
          source: "intent_composer",
        },
        {
          type: "meaning",
          explanationCode: "copilot.answers.utils_parent-copilot_intent-answer-composers.you_can_choose_another_topic_from_the_report_or_gain_practice_on",
          source: "intent_composer",
        },
      ],
      plannerIntent: "ask_topic_specific",
      answerComposerUsed: ANSWER_CONTRACT.topic_lookup,
    };
  }

  const hit = findTopicRowByKey(payload, best.topicRowKey, rowRes.subjectId || "");
  const m = hit?.tr ? rowMetrics({ ...hit.tr, subjectId: hit.subject }) : null;
  const q = m?.q ?? 0;
  if (q === 0) {
    return {
      answerBlocks: [
        {
          type: "observation",
          answerText: `In this period there is no practice data on ${label || "the topic"} in the current report.`,
          source: "intent_composer",
        },
        {
          type: "meaning",
          explanationCode: "copilot.answers.utils_parent-copilot_intent-answer-composers.the_subject_appears_in_the_list_but_no_questions_have_been_count",
          source: "intent_composer",
        },
      ],
      plannerIntent: "ask_topic_specific",
      answerComposerUsed: ANSWER_CONTRACT.topic_lookup,
    };
  }

  return composeTopicProblem({
    ...params,
    truthPacket: {
      ...params.truthPacket,
      scopeType: "topic",
      scopeId: best.topicRowKey,
      scopeLabel: label,
      surfaceFacts: {
        ...(params.truthPacket?.surfaceFacts || {}),
        subjectId: m?.sid || rowRes.subjectId,
        displayName: label,
        questions: q,
        accuracy: m?.acc ?? 0,
      },
    },
  });
}

/**
 * Progression family: advance / level up / level down / mastered / above-grade /
 * below-grade / focus elsewhere. Uses gradeRelation + evidenceScope + evidenceSource +
 * strengths/weaknesses + evidence volume (confidence) — never just the profile grade.
 * @param {object} params
 */
function composeProgression(params) {
  const payload = params.payload;
  const truthPacket = params.truthPacket;
  const folded = foldUtteranceForHeMatch(String(params?.utteranceStr || ""));
  const scopeType = String(truthPacket?.scopeType || "");

  const asksAboveGrade = /מעל\s*(?:ה)?כיתה|מעל\s*הרמה/u.test(folded);
  const asksBelowGrade = /מתחת\s*(?:ל)?כיתה|מתקשה\s*(?:גם\s*)?מתחת/u.test(folded);
  const asksLevelDown = /לרדת\s*(?:ב)?רמה|להוריד\s*(?:את\s*)?(?:ה)?רמה/u.test(folded);
  const isDown = asksBelowGrade || asksLevelDown;

  let metas = collectPracticeMetrics(payload);
  if (scopeType === "topic" && truthPacket?.scopeId) {
    const focus = metas.filter((m) => m.topicRowKey === String(truthPacket.scopeId).trim());
    if (focus.length) metas = focus;
  }

  const sttl = (sid, name) => `${subjectLabelHe(sid)} - ${name}`;

  if (!metas.length) {
    return {
      answerBlocks: [
        {
          type: "observation",
          explanationCode: "copilot.answers.utils_parent-copilot_intent-answer-composers.in_this_period_there_is_still_not_enough_practice_data_to_recomm",
          source: "intent_composer",
        },
        {
          type: "meaning",
          explanationCode: "copilot.answers.utils_parent-copilot_intent-answer-composers.you_should_gather_more_practice_on_the_subject_before_deciding_o",
          source: "intent_composer",
        },
      ],
      plannerIntent: "why_not_advance",
      answerComposerUsed: ANSWER_CONTRACT.progression,
    };
  }

  const strong = metas
    .filter((m) => m.q >= STRONG_Q_MIN && m.acc >= STRONG_ACC_MIN)
    .sort((a, b) => b.acc - a.acc || b.q - a.q);
  const weak = metas
    .filter((m) => m.q >= STRONG_Q_MIN && m.acc <= WEAK_ACC_MAX)
    .sort((a, b) => a.acc - b.acc || b.q - a.q);

  // ----- DOWN: level down / struggling below grade -----
  if (isDown) {
    const lowerWeak = weak.filter((m) => m.gradeRelation === "lower");
    if (asksBelowGrade) {
      if (lowerWeak.length) {
        const list = lowerWeak.slice(0, 3).map((m) => `${sttl(m.sid, m.displayName)} (about ${m.acc}% on ${m.q} questions)`).join("; ");
        return {
          answerBlocks: [
            { type: "observation", answerText: `Yes - according to the report there is difficulty even below the class listed in: ${list}.`, source: "intent_composer" },
            { type: "meaning", answerText: "Difficulty at a basic level indicates a need to strengthen the basics of the subject before advancing to the grade level.", source: "intent_composer" },
            { type: "next_step", answerText: `You should practice at a basic level in ${lowerWeak[0].displayName} until the accuracy increases, and only then return to the class level.`, source: "intent_composer" },
          ],
          plannerIntent: "what_is_still_difficult",
          answerComposerUsed: ANSWER_CONTRACT.progression,
        };
      }
      return {
        answerBlocks: [
          { type: "observation", answerText: "According to the report, no difficulty is seen at a level below the registered class during this period.", source: "intent_composer" },
          {
            type: "meaning",
            answerText: weak.length
              ? `The difficulties that appear are at the level of the class itself: ${weak.slice(0, 2).map((m) => sttl(m.sid, m.displayName)).join("; ")}.`
              : copilotStaticMessage("copilot.answers.utils_parent-copilot_intent-answer-composers.no_weak_line_stood_out_with_enough_practice_at_the_range"),
            source: "intent_composer",
          },
        ],
        plannerIntent: "what_is_still_difficult",
        answerComposerUsed: ANSWER_CONTRACT.progression,
      };
    }

    // generic "should we level down in a topic?"
    if (!weak.length) {
      return {
        answerBlocks: [
          { type: "observation", answerText: "According to the report, there is currently no topic with enough practice and low accuracy that justifies a drop in level.", source: "intent_composer" },
          { type: "meaning", answerText: "Dropping a level is appropriate when there is repeated difficulty; Currently we don't see one in the range data.", source: "intent_composer" },
        ],
        plannerIntent: "why_not_advance",
        answerComposerUsed: ANSWER_CONTRACT.progression,
      };
    }
    const w = weak[0];
    const foundationNote =
      w.gradeRelation === "lower"
        ? "The difficulty is already at a basic level, so strengthening the basics is especially important."
        : "";
    return {
      answerBlocks: [
        { type: "observation", answerText: `The place where it is best to consider a temporary level drop for reinforcement is ${sttl(w.sid, w.displayName)} (about ${w.acc}% on ${w.q} questions).`, source: "intent_composer" },
        { type: "meaning", answerText: `A temporary drop in level allows you to establish the foundation before returning to the class level.${foundationNote}`, source: "intent_composer" },
        { type: "next_step", answerText: `You should practice with ${w.displayName} one level lower for several days, then check if the accuracy increases.`, source: "intent_composer" },
      ],
      plannerIntent: "what_is_still_difficult",
      answerComposerUsed: ANSWER_CONTRACT.progression,
    };
  }

  // ----- UP: advance / level up / above grade / mastered / focus elsewhere -----
  if (asksAboveGrade) {
    const higherStrong = strong.filter((m) => m.gradeRelation === "higher");
    if (higherStrong.length) {
      const list = higherStrong.slice(0, 3).map((m) => `${sttl(m.sid, m.displayName)} (about ${m.acc}% on ${m.q} questions)`).join("; ");
      return {
        answerBlocks: [
          { type: "observation", answerText: `Yes - the child worked and succeeded even above the class listed in: ${list}.`, source: "intent_composer" },
          { type: "meaning", answerText: "Success above grade level indicates high ability in this subject.", source: "intent_composer" },
          { type: "next_step", answerText: `You can consider raising the difficulty or progressing to a more advanced topic in ${higherStrong[0].displayName}.`, source: "intent_composer" },
        ],
        plannerIntent: "what_is_going_well",
        answerComposerUsed: ANSWER_CONTRACT.progression,
      };
    }
    return {
      answerBlocks: [
        {
          type: "observation",
          answerText: strong.length
            ? "According to the report, the successes were measured at the level of the registered class and not above it."
            : copilotStaticMessage("copilot.answers.utils_parent-copilot_intent-answer-composers.according_to_the_report_there_is_still_insufficient_evidence_for"),
          source: "intent_composer",
        },
        {
          type: "meaning",
          answerText: strong.length
            ? `There is a nice control over the class level (eg ${sttl(strong[0].sid, strong[0].displayName)}) - you can consider increasing the difficulty gradually.`
            : copilotStaticMessage("copilot.answers.utils_parent-copilot_intent-answer-composers.it_is_worth_gathering_more_practice_before_concluding_on_above_c"),
          source: "intent_composer",
        },
      ],
      plannerIntent: "what_is_going_well",
      answerComposerUsed: ANSWER_CONTRACT.progression,
    };
  }

  if (!strong.length) {
    return {
      answerBlocks: [
        { type: "observation", answerText: "According to the report, there is not yet a topic with enough practice and high accuracy to recommend progress reliably.", source: "intent_composer" },
        { type: "meaning", answerText: "This does not mean that there are no successes - just that it is still too early to recommend an increase in the level according to the data in the range.", source: "intent_composer" },
        { type: "next_step", answerText: "You should continue a short and regular practice, then ask again when the accuracy stabilizes.", source: "intent_composer" },
      ],
      plannerIntent: "why_not_advance",
      answerComposerUsed: ANSWER_CONTRACT.progression,
    };
  }

  const lead = strong[0];
  const list = strong.slice(0, 3).map((m) => `${sttl(m.sid, m.displayName)} (about ${m.acc}% on ${m.q} questions)`).join("; ");
  const relStep =
    gradeScopeMeaningHe({ gradeRelation: lead.gradeRelation, isStrength: true, topicName: lead.displayName }) ||
    `${lead.displayName} has good control - you can increase the difficulty gradually or move to the next topic.`;
  const reallocate = lead.q >= MASTERY_REALLOCATION_Q_MIN ? masteryReallocationHe(lead.displayName) : "";
  const focusElsewhere =
    weak.length && weak[0].topicRowKey !== lead.topicRowKey
      ? `If you want to focus effort - you can direct part of the time from ${lead.displayName} to ${sttl(weak[0].sid, weak[0].displayName)} which requires more reinforcement.`
      : "";
  const srcPhrase = evidenceSourcePhraseHe(lead.primaryEvidenceSource);

  return {
    answerBlocks: [
      { type: "observation", answerText: `The most obvious place to move forward is: ${list}.`, source: "intent_composer" },
      {
        type: "meaning",
        answerText: srcPhrase ? `${relStep} Some of the evidence was collected ${srcPhrase}.` : relStep,
        source: "intent_composer",
      },
      {
        type: "next_step",
        answerText: [reallocate, focusElsewhere].filter(Boolean).join(" ") ||
          `You should continue to challenge in ${lead.displayName} and increase the difficulty gradually as long as the success is maintained.`,
        source: "intent_composer",
      },
    ],
    plannerIntent: "what_is_going_well",
    answerComposerUsed: ANSWER_CONTRACT.progression,
  };
}

function composeZeroEvidence(params) {
  const subjectId = String(params?.subjectId || params?.truthPacket?.scopeId || "").trim();
  const label = subjectLabelHe(subjectId);
  return {
    answerBlocks: [
      {
        type: "observation",
        answerText: zeroEvidenceSubjectCopilotHe(label),
        source: "intent_composer",
      },
      {
        type: "meaning",
        explanationCode: "copilot.answers.utils_parent-copilot_intent-answer-composers.it_is_therefore_impossible_to_determine_direction_from_the_curre",
        source: "intent_composer",
      },
    ],
    plannerIntent: "explain_report",
    answerComposerUsed: ANSWER_CONTRACT.zero_evidence,
  };
}

/**
 * @param {object} params
 */
export function tryComposeIntentAnswer(params) {
  const truthPacketIn = params?.truthPacket;
  if (!truthPacketIn) return null;

  const utteranceStr = String(params?.utteranceStr || "");
  const payload = params?.payload;
  const conv = params?.conversationState;
  let truthPacket = truthPacketIn;
  const scopeType = String(truthPacket.scopeType || "");
  const stageAIntent = String(params?.plannerIntent || params?.stageAIntent || "");
  const inheritedScope = !!params?.inheritedScope;

  const contract = resolveAnswerContract({
    utteranceStr,
    scopeType,
    stageAIntent,
    truthPacket,
    payload,
    subjectId: truthPacket.scopeType === "subject" ? truthPacket.scopeId : truthPacket.surfaceFacts?.subjectId,
  });

  if (!contract) return null;

  if (
    (contract === ANSWER_CONTRACT.report_explanation || contract === ANSWER_CONTRACT.important_focus) &&
    scopeType !== "executive"
  ) {
    return null;
  }

  if (contract === ANSWER_CONTRACT.zero_evidence && scopeType !== "subject") return null;

  if (contractNeedsTopicFocus(contract) && scopeType !== "topic") {
    const focus = resolveFocusTopicContext({ payload, truthPacket, conversationState: conv });
    if (!focus?.topicRowKey) return null;
    truthPacket = {
      ...truthPacket,
      scopeType: "topic",
      scopeId: focus.topicRowKey,
      scopeLabel: focus.displayName,
      gradeSplitTopicRowKeys: focus.gradeSplitTopicRowKeys,
      surfaceFacts: {
        ...(truthPacket.surfaceFacts || {}),
        subjectId: focus.subjectId,
        displayName: focus.displayName,
        questions:
          collectPracticeMetrics(payload).find((m) => m.topicRowKey === focus.topicRowKey)?.q ??
          truthPacket.surfaceFacts?.questions,
        accuracy:
          collectPracticeMetrics(payload).find((m) => m.topicRowKey === focus.topicRowKey)?.acc ??
          truthPacket.surfaceFacts?.accuracy,
      },
    };
  }

  const base = {
    utteranceStr,
    truthPacket,
    payload,
    conversationState: conv,
    subjectId: String(truthPacket.surfaceFacts?.subjectId || truthPacket.scopeId || "").trim(),
  };

  let composed = null;
  switch (contract) {
    case ANSWER_CONTRACT.report_explanation:
    case ANSWER_CONTRACT.important_focus:
      composed = composeReportExplanation(base);
      if (composed && contract === ANSWER_CONTRACT.important_focus) {
        composed.answerComposerUsed = ANSWER_CONTRACT.important_focus;
        composed.plannerIntent = "what_is_most_important";
      }
      break;
    case ANSWER_CONTRACT.topic_lookup:
      composed = composeTopicLookup(base);
      break;
    case ANSWER_CONTRACT.topic_problem:
      composed = composeTopicProblem(base);
      break;
    case ANSWER_CONTRACT.mistake_pattern:
      composed = composeMistakePattern(base);
      break;
    case ANSWER_CONTRACT.home_practice:
      composed = composeHomePractice(base);
      break;
    case ANSWER_CONTRACT.strength:
      composed = composeStrength(base);
      break;
    case ANSWER_CONTRACT.progression:
      composed = composeProgression(base);
      break;
    case ANSWER_CONTRACT.zero_evidence:
      composed = composeZeroEvidence({
        ...base,
        subjectId: String(truthPacket.scopeId || "").trim(),
      });
      break;
    default:
      return null;
  }

  if (!composed?.answerBlocks?.length) return null;

  const evidenceUsed = buildEvidenceUsed(base);
  return {
    ...composed,
    answerContract: contract,
    evidenceUsed,
    inheritedScope,
    resolvedIntent: stageAIntent,
    resolvedScope: `${scopeType}:${truthPacket.scopeId || ""}`,
  };
}

/**
 * @param {object} draft
 */
export function fingerprintAnswerHe(draft) {
  const text = (draft?.answerBlocks || []).map((b) => String(b.answerText || "")).join(" ");
  return text
    .replace(/\d+/g, "#")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

export default {
  tryComposeIntentAnswer,
  fingerprintAnswerHe,
  ANSWER_CONTRACT,
};
