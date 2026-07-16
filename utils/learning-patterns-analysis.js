import {
  MIN_PATTERN_FAMILY_FOR_DIAGNOSIS,
  MIN_MISTAKES_FOR_STRONG_RECOMMENDATION,
  normalizeMistakeEvent,
  mistakePatternClusterKey,
} from "./mistake-event.js";
import {
  weaknessLabelHe,
  sessionRowLabelHe,
  GENERIC_WEAKNESS_HE,
} from "./diagnostic-labels-he.js";
import {
  CONCLUSION_FRESHNESS_LABEL_HE,
  EXPECTED_VS_OBSERVED_MATCH_LABEL_HE,
  FOLLOW_THROUGH_SIGNAL_LABEL_HE,
  GATE_STATE_LABEL_HE,
  DEPENDENCY_STATE_LABEL_HE,
  FOUNDATIONAL_BLOCKER_LABEL_HE,
  INTERVENTION_TYPE_LABEL_HE,
  LEARNING_STAGE_LABEL_HE,
  MISTAKE_PATTERN_LABEL_HE,
  NEXT_BEST_SEQUENCE_STEP_LABEL_HE,
  NEXT_CYCLE_DECISION_FOCUS_LABEL_HE,
  PRIOR_RECOMMENDATION_SIGNATURE_LABEL_HE,
  RECALIBRATION_NEED_LABEL_HE,
  RECOMMENDATION_CONTINUATION_DECISION_LABEL_HE,
  RECOMMENDATION_MEMORY_STATE_LABEL_HE,
  RECOMMENDATION_ROTATION_NEED_LABEL_HE,
  RESPONSE_TO_INTERVENTION_LABEL_HE,
  ROOT_CAUSE_LABEL_HE,
  SUPPORT_ADJUSTMENT_NEED_LABEL_HE,
  SUPPORT_SEQUENCE_STATE_LABEL_HE,
  TARGET_EVIDENCE_TYPE_LABEL_HE,
  TARGET_OBSERVATION_WINDOW_LABEL_HE,
} from "./parent-report-ui-explain-he.js";
import { PARENT_DIAGNOSTIC_TYPE_LABEL_HE } from "./parent-report-language/parent-report-hebrew-copy-spec.js";
import { pickRecommendedInterventionType } from "./topic-next-step-phase2.js";
import { mathReportBaseOperationKey, canonicalParentReportGradeKey } from "./math-report-generator.js";
import {
  splitTopicRowKey,
  mistakeMathScopeComplete,
  mathScopeLevelFromField,
  normalizeMistakeModeField,
} from "./parent-report-row-diagnostics.js";
import { applyMathScopedParentDisplayNames } from "./math-topic-parent-display.js";
import { normalizeParentFacingHe } from "./parent-report-language/parent-facing-normalize.js";
import { mergeSubjectConclusionReadinessContract } from "./minimal-safe-scope-enforcement.js";

/**
 * Stable topic identifier for reconciliation purposes (same bucket as in mistakes / the report row).
 * @param {string} subjectId
 * @param {string} topicRowKey
 * @param {Record<string, unknown>|null|undefined} row
 */
function stableTopicBucketBase(subjectId, topicRowKey, row) {
  const bk =
    row && typeof row === "object" && row.bucketKey != null && row.bucketKey !== ""
      ? String(row.bucketKey)
      : splitTopicRowKey(String(topicRowKey)).bucketKey;
  if (subjectId === "math") return mathReportBaseOperationKey(bk);
  return String(bk || "").trim();
}

/**
 * Matches the "strength" threshold in buildSessionBands: high accuracy + enough questions, without needsPractice.
 */
function isHighAccuracySessionRow(row) {
  if (!row || typeof row !== "object") return false;
  const q = Number(row.questions) || 0;
  const acc = Number(row.accuracy) || 0;
  if (q < 8) return false;
  if (row.needsPractice) return false;
  if (row.excellent && q >= 10) return true;
  return acc >= 87;
}

/** Low accuracy for true_weakness purposes when there is a mistake pattern */
function isLowAccuracySessionRow(row) {
  if (!row || typeof row !== "object") return false;
  const acc = Number(row.accuracy) || 0;
  if (row.needsPractice) return true;
  return acc < 70;
}

function bucketBaseFromMistakeSample(subjectId, sampleEv) {
  if (!sampleEv || typeof sampleEv !== "object") return "";
  if (subjectId === "math") {
    return mathReportBaseOperationKey(
      String(sampleEv.bucketKey || sampleEv.topicOrOperation || "")
    );
  }
  return String(sampleEv.topicOrOperation || sampleEv.bucketKey || "").trim();
}

function findWeaknessCandidateForTopWeakness(weaknessCandidates, w) {
  const found = weaknessCandidates.find(
    (c) => c.labelHe === w.labelHe && c.mistakeCount === w.mistakeCount
  );
  if (found) return found;
  const m = /^[^:]+:w:(\d+)$/.exec(String(w.id || ""));
  if (m) {
    const idx = Number(m[1]);
    if (Number.isFinite(idx) && weaknessCandidates[idx]) return weaknessCandidates[idx];
  }
  return null;
}

function buildStrengthWithCautionLines(row, mistakeCount) {
  const label = normalizeParentFacingHe(String(row?.displayName || "the topic").trim() || "the topic");
  const acc = Number(row?.accuracy) || 0;
  const q = Number(row?.questions) || 0;
  const n = Number(mistakeCount) || 0;
  return [
    `In ${label} good control is seen in the selected period: about ${acc}% correct out of ${q} questions.`,
    `When there is a mistake, sometimes the same pattern repeats (${n} similar cases in the selected period) - it is worth stopping for a moment on one example together.`,
    `What should be done together: choose one short exercise, go through it aloud step by step, then let the child try again by himself.`,
  ];
}

/**
 * Prevents overlap between the primary weakness and a topic row with high accuracy (Batch 1 — logic only, no UI change).
 * @returns {{
 *   topWeaknesses: object[],
 *   parentTopicToneByKey: Record<string, string>,
 *   parentStrengthWithCautionLinesByKey: Record<string, string[]>,
 *   suppressedCautionByBucket: Map<string, { mistakeCount: number, lines: string[] }>,
 * }}
 */
function reconcileParentFacingTopicSignals(
  subjectId,
  report,
  weaknessCandidates,
  topWeaknessesPre
) {
  const rowsKey = REPORT_ROWS_KEY[subjectId];
  const map =
    rowsKey && report && typeof report === "object" && report[rowsKey] && typeof report[rowsKey] === "object"
      ? report[rowsKey]
      : {};

  /** @type {Map<string, { mistakeCount: number, lines: string[] }>} */
  const suppressedCautionByRowKey = new Map();
  const filteredWeaknesses = [];

  function mathWeaknessSampleMatchesRow(topicRowKey, sampleEv) {
    if (subjectId !== "math") return true;
    const ev = sampleEv && typeof sampleEv === "object" ? sampleEv : null;
    if (!mistakeMathScopeComplete(ev)) return false;
    const parts = splitTopicRowKey(String(topicRowKey));
    if (parts.gradeScope == null || parts.levelScope == null) return false;
    const g = canonicalParentReportGradeKey(ev.grade);
    const l = mathScopeLevelFromField(ev.level);
    const m = normalizeMistakeModeField(ev.mode);
    return (
      parts.gradeScope === g &&
      parts.levelScope === l &&
      (parts.modeKey || "learning") === m
    );
  }

  for (const w of topWeaknessesPre) {
    const cand = findWeaknessCandidateForTopWeakness(weaknessCandidates, w);
    const bucket = bucketBaseFromMistakeSample(subjectId, cand?.sampleEvent);
    if (!bucket) {
      filteredWeaknesses.push(w);
      continue;
    }
    const rowKeys = Object.keys(map).filter((k) => {
      const row = map[k];
      if (!row || typeof row !== "object") return false;
      if ((Number(row.questions) || 0) <= 0) return false;
      if (stableTopicBucketBase(subjectId, k, row) !== bucket) return false;
      return mathWeaknessSampleMatchesRow(k, cand?.sampleEvent);
    });
    const hasHigh = rowKeys.some((k) => isHighAccuracySessionRow(map[k]));
    if (hasHigh) {
      let bestKey = rowKeys[0];
      let bestAcc = -1;
      for (const k of rowKeys) {
        const r = map[k];
        if (!isHighAccuracySessionRow(r)) continue;
        const a = Number(r.accuracy) || 0;
        if (a > bestAcc) {
          bestAcc = a;
          bestKey = k;
        }
      }
      const bestRow = map[bestKey];
      const lines = buildStrengthWithCautionLines(bestRow, cand?.mistakeCount ?? w.mistakeCount);
      suppressedCautionByRowKey.set(String(bestKey), {
        mistakeCount: cand?.mistakeCount ?? w.mistakeCount,
        lines,
      });
      continue;
    }
    filteredWeaknesses.push(w);
  }

  const parentTopicToneByKey = {};
  const parentStrengthWithCautionLinesByKey = {};

  for (const k of Object.keys(map)) {
    const row = map[k];
    if (!row || typeof row !== "object") continue;
    if ((Number(row.questions) || 0) <= 0) continue;
    if (suppressedCautionByRowKey.has(String(k))) {
      parentTopicToneByKey[k] = "strength_with_caution";
      const pack = suppressedCautionByRowKey.get(String(k));
      if (pack?.lines && !parentStrengthWithCautionLinesByKey[k]) {
        parentStrengthWithCautionLinesByKey[k] = pack.lines;
      }
    }
  }

  const weaknessTargetRowKeys = new Set();
  for (const w of filteredWeaknesses) {
    const cand = findWeaknessCandidateForTopWeakness(weaknessCandidates, w);
    const bucket = bucketBaseFromMistakeSample(subjectId, cand?.sampleEvent);
    if (!bucket) continue;
    for (const k of Object.keys(map)) {
      const row = map[k];
      if (!row || typeof row !== "object") continue;
      if ((Number(row.questions) || 0) <= 0) continue;
      if (stableTopicBucketBase(subjectId, k, row) !== bucket) continue;
      if (!mathWeaknessSampleMatchesRow(k, cand?.sampleEvent)) continue;
      weaknessTargetRowKeys.add(String(k));
    }
  }

  for (const k of Object.keys(map)) {
    const row = map[k];
    if (!row || typeof row !== "object") continue;
    if ((Number(row.questions) || 0) <= 0) continue;
    if (parentTopicToneByKey[k]) continue;
    if (weaknessTargetRowKeys.has(String(k)) && isLowAccuracySessionRow(row)) {
      parentTopicToneByKey[k] = "true_weakness";
    } else if (isHighAccuracySessionRow(row)) {
      parentTopicToneByKey[k] = "strength";
    } else {
      parentTopicToneByKey[k] = "stable_monitor";
    }
  }

  return {
    topWeaknesses: filteredWeaknesses,
    parentTopicToneByKey,
    parentStrengthWithCautionLinesByKey,
    suppressedCautionByBucket: suppressedCautionByRowKey,
  };
}

function mergeParentActionWithCautionBlocks(parentActionHe, parentStrengthWithCautionLinesByKey) {
  const keys = Object.keys(parentStrengthWithCautionLinesByKey || {});
  if (!keys.length) return parentActionHe || null;
  const firstKey = keys[0];
  const lines = parentStrengthWithCautionLinesByKey[firstKey];
  if (!Array.isArray(lines) || lines.length < 3) return parentActionHe || null;
  const block = lines.join(" ").trim();
  const base = typeof parentActionHe === "string" ? parentActionHe.trim() : "";
  if (!base) return block;
  if (base.includes(lines[0])) return base;
  return `${block} ${base}`.trim();
}
/**
 * Coarse classification for the at-home action style — based only on the (Hebrew-sourced) weakness label.
 * @returns {"wording"|"careless"|"foundation"}
 */
function inferWeaknessKindHe(labelHe) {
  const s = String(labelHe || "").toLowerCase();
  const h = `${labelHe || ""}`;
  if (
    /ניסוח|הבנה|הוראות|משימה|קריאה|מילולי|משפט|חיבור|הבנת הנקרא|האזנה/i.test(h) ||
    s.includes("reading") ||
    s.includes("listening")
  ) {
    return "wording";
  }
  if (/איות|דיוק|רשלנות|תשומת לב|שגיא|טעות|חוסר/i.test(h) || s.includes("spelling")) {
    return "careless";
  }
  return "foundation";
}

/**
 * === Subject narrative payload (patternDiagnostics.subjects[subjectId]) ===
 *
 * A) Shape (extends legacy fields; narrative is the source of truth for UI):
 * - subject, subjectLabelHe
 * - summaryHe: string | null
 * - topStrengths: Array<{ id, labelHe, questions, accuracy, confidence, needsPractice, excellent, tierHe }>
 * - topWeaknesses: Array<{ id, labelHe, mistakeCount, confidence, tierHe }>
 * - parentTopicToneByKey: Record<topicRowKey, "strength"|"strength_with_caution"|"stable_monitor"|"true_weakness"> - reconciliation against report rows
 * - parentStrengthWithCautionLinesByKey: Record<topicRowKey, [string,string,string]> — positive, caveat about a mistake pattern, at-home direction (only for strength_with_caution)
 * - stableExcellence: Array<{ id, labelHe, questions, accuracy, confidence, needsPractice, excellent, tierHe }> — high threshold, separate from maintain
 * - maintain, improving: session bands + tierHe for each row
 * - parentActionHe: string | null  (max 1 concrete home action)
 * - nextWeekGoalHe: string | null   (reinforcement + maintenance when data allows)
 * - evidenceExamples: Array<{ type: "mistake"|"success", ... }>  (max 2; only moderate/high confidence)
 *
 * B) Ranking:
 * - Weaknesses: clusters by mistakePatternClusterKey, sort by mistakeCount desc → top 3 (≥ MIN_PATTERN_FAMILY).
 * - topStrengths: merge excellent-pool + strengths-pool (disjoint), sort by
 *   (excellent desc, accuracy desc, questions desc) → top 3.
 * - stableExcellence / maintain / improving: scan report rows (sorted by accuracy) into separate buckets — stableExcellence first (high threshold), then excellent/strengths/maintain/improving (no duplicates).
 *
 * C) summaryHe: 1–2 Hebrew sentences — positives (stableExcellence, topStrengths, maintain), risks (topWeaknesses or improving),
 *    stability note if mistakeCount ≥ MIN_MISTAKES_FOR_STRONG_RECOMMENDATION, sparse-data note if needed.
 *
 * D) parentActionHe: one imperative block with duration + focus + method; prefers top weakness, else improving, else maintain.
 *    nextWeekGoalHe: optional "A target for reinforcement" from top weakness or improving + "Target for conservation" from topStrengths[0] or maintain[0]
 *    when questions ≥ 8 or excellent.
 *
 * E) UI: parent-report maps each tierHe to the card subtitle (not everything is "weakness"; maintain → "Keeping a good level"; stableExcellence → "Your child is doing well on this topic over time").
 */

const SUBJECT_IDS = [
  "math",
  "geometry",
  "english",
  "science",
  "history",
  "hebrew",
  "moledet-geography",
];

const REPORT_ROWS_KEY = {
  math: "mathOperations",
  geometry: "geometryTopics",
  english: "englishTopics",
  science: "scienceTopics",
  history: "historySubtopics",
  hebrew: "hebrewTopics",
  "moledet-geography": "moledetGeographyTopics",
};

const SUBJECT_LABEL_HE = {
  math: "Math",
  geometry: "Geometry",
  english: "English",
  science: "Science",
  history: "History",
  hebrew: "Hebrew",
  "moledet-geography": "Homeland & Geography",
  moledet: "Homeland Studies",
  geography: "Geography",
};

/** Narrative caps (professional profile) */
const MAX_TOP_WEAKNESSES = 3;
const MAX_TOP_STRENGTHS = 3;
const MAX_MAINTAIN = 2;
const MAX_IMPROVING = 2;
/** How many "Your child is doing well on this topic over time" rows (separate from maintain / top strengths) */
const MAX_STABLE_EXCELLENCE = 3;
/** Long-term success threshold: don't declare too quickly — high accuracy + enough questions in range */
const STABLE_EXCELLENCE_MIN_ACCURACY = 92;
const STABLE_EXCELLENCE_MIN_QUESTIONS = 22;
/** Internal pool before merge/rank */
const INTERNAL_SESSION_POOL = 12;

/** Default for a session row without a label — the "improvement trend" card shows a short word */
const IMPROVING_GENERIC_PRACTICE_LABEL_ALIASES = new Set(["on the subject of practice", "Subject in practice"]);

/**
 * Display label for "A field in the trend of improvement" cards (and for old cached reports).
 * @param {string|null|undefined} labelHe
 */
export function improvingDiagnosticsDisplayLabelHe(labelHe) {
  const lab = String(labelHe || "").trim();
  if (IMPROVING_GENERIC_PRACTICE_LABEL_ALIASES.has(lab)) return "Practice";
  return lab;
}

/**
 * Short parent-facing phrasing from any weakness label - "About connection" instead of "Point difficulty in connection" / "around the topic...".
 * @param {string|null|undefined} labelHe
 */
function parentCopyTopicPhraseHe(labelHe) {
  const s = String(labelHe || "").trim();
  if (!s) return "On the selected practice topic";
  if (s === GENERIC_WEAKNESS_HE) return "On a topic identified in practice";
  if (/^בנושא(\s|\/)/u.test(s)) return s;

  const tailed = [
    /^קושי נקודתי ב(.+)$/u,
    /^קושי חוזר \/ קושי שחוזר ב(.+)$/u,
    /^קושי חוזר ב(.+)$/u,
  ];
  for (const re of tailed) {
    const m = s.match(re);
    if (m) return `on ${m[1].trim()}`;
  }

  const dePattern = s.replace(/^דפוס שגיאות:\s*/u, "").trim();
  if (dePattern && dePattern !== s) return `on ${dePattern}`;

  if (s.startsWith("confusion")) return `on ${s}`;

  if (/^קושי\s+/u.test(s)) {
    const rest = s.replace(/^קושי\s+/u, "").trim();
    if (/^בנושא(\s|\/)/u.test(rest)) return rest;
    return `on ${rest}`;
  }

  return `on ${s}`;
}

/** For the phrasing "It is recommended to focus on…" — a colon after "on the subject" / "on the subject/s" */
function parentCopyTopicPhraseForFocusHe(labelHe) {
  return parentCopyTopicPhraseHe(labelHe)
    .replace(/^בנושא\/ים\s+/u, "on the subject/s:")
    .replace(/^בנושא\s+/u, "Subject:");
}

/** A reinforcement-goal sentence framed from a success perspective, not "Reduce typographical errors" */
function successRateImprovementGoalHe(labelHe) {
  const ph = parentCopyTopicPhraseHe(labelHe);
  const core = ph
    .replace(/^בנושא\/ים\s+/u, "")
    .replace(/^בנושא\s+/u, "")
    .trim() || ph;
  if (!core) return "Raise success rate in the subject";
  if (/^ב/u.test(core)) return `increase the success rate ${core}`;
  return `Increase the success rate in ${core}`;
}

function recStrength(mistakeCount) {
  if (mistakeCount >= MIN_MISTAKES_FOR_STRONG_RECOMMENDATION) return "strong";
  if (mistakeCount >= MIN_PATTERN_FAMILY_FOR_DIAGNOSIS) return "moderate";
  return "tentative";
}

function rowConfidenceFromSessions(row) {
  const q = Number(row?.questions) || 0;
  if (q >= 24) return "high";
  if (q >= 10) return "moderate";
  return "low";
}

function formatSessionBand(subjectId, row, rowKey) {
  return {
    id: `${subjectId}:${String(rowKey).slice(0, 120)}`,
    labelHe: sessionRowLabelHe(subjectId, row),
    questions: Number(row?.questions) || 0,
    accuracy: Number(row?.accuracy) || 0,
    confidence: rowConfidenceFromSessions(row),
    needsPractice: !!row?.needsPractice,
    excellent: !!row?.excellent,
  };
}

function joinHebrewList(items) {
  const xs = (items || []).map((s) => String(s || "").trim()).filter(Boolean);
  if (!xs.length) return "";
  if (xs.length === 1) return xs[0];
  if (xs.length === 2) return `${xs[0]} and ${xs[1]}`;
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}

function strengthTierHe(row) {
  const q = Number(row?.questions) || 0;
  const acc = Number(row?.accuracy) || 0;
  if (row?.excellent && q >= 20 && acc >= 90) return "A topic your child is doing better on right now";
  if (row?.excellent) return "A current strength";
  if (acc >= 92 && q >= 14) return "A current strength";
  return "A current strength";
}

function weaknessTierHe(labelHe, mistakeCount, confidence) {
  const lab = String(labelHe || "").trim();
  if (!lab || lab === GENERIC_WEAKNESS_HE) return "Area to strengthen";
  if (mistakeCount >= MIN_MISTAKES_FOR_STRONG_RECOMMENDATION) {
    return "Practice so far suggests this is worth strengthening";
  }
  if (mistakeCount >= MIN_PATTERN_FAMILY_FOR_DIAGNOSIS) {
    if (confidence === "high") return "Practice so far suggests this is worth strengthening";
    return "Practice suggests this is worth strengthening";
  }
  return "Area to strengthen";
}

function buildTopStrengthsMerged(excellent, strengths, max) {
  const combined = [...(excellent || []), ...(strengths || [])];
  combined.sort((a, b) => {
    const ex = (x) => (x.excellent ? 1 : 0);
    if (ex(b) !== ex(a)) return ex(b) - ex(a);
    const acc = (x) => Number(x.accuracy) || 0;
    if (acc(b) !== acc(a)) return acc(b) - acc(a);
    return (Number(b.questions) || 0) - (Number(a.questions) || 0);
  });
  return combined.slice(0, max).map((row) => ({
    ...row,
    tierHe: strengthTierHe(row),
  }));
}

/**
 * Splits report rows into stableExcellence / excellent / strengths / maintain / improving (no duplicates by row key).
 * Collects a larger internal pool for ranking purposes before trimming to topStrengths, etc.
 */
function buildSessionBands(subjectId, report) {
  const rowsKey = REPORT_ROWS_KEY[subjectId];
  const map = rowsKey && report[rowsKey] ? report[rowsKey] : {};
  const entries = Object.entries(map || {})
    .map(([rowKey, row]) => ({ rowKey, row }))
    .sort((a, b) => {
      const acc = (x) => Number(x.row?.accuracy) || 0;
      const q = (x) => Number(x.row?.questions) || 0;
      return acc(b) - acc(a) || q(b) - q(a);
    });

  const used = new Set();
  const take = (predicate, max) => {
    const out = [];
    for (const { rowKey, row } of entries) {
      if (out.length >= max) break;
      if (!row || typeof row !== "object") continue;
      const q = Number(row.questions) || 0;
      if (q < 5) continue;
      if (used.has(rowKey)) continue;
      if (!predicate(row, q)) continue;
      used.add(rowKey);
      out.push(formatSessionBand(subjectId, row, rowKey));
    }
    return out;
  };

  const stableExcellenceRaw = take(
    (row, q) => {
      if (row.needsPractice) return false;
      const acc = Number(row.accuracy) || 0;
      if (acc < STABLE_EXCELLENCE_MIN_ACCURACY) return false;
      if (q < STABLE_EXCELLENCE_MIN_QUESTIONS) return false;
      return true;
    },
    MAX_STABLE_EXCELLENCE
  );

  const stableExcellenceOut = stableExcellenceRaw.map((r) => ({
    ...r,
    tierHe: "Your child is doing well on this topic over time",
  }));

  const excellent = take(
    (row, q) => row.excellent && q >= 10,
    INTERNAL_SESSION_POOL
  );

  const strengths = take(
    (row, q) =>
      !row.excellent &&
      Number(row.accuracy) >= 87 &&
      q >= 8 &&
      !row.needsPractice,
    INTERNAL_SESSION_POOL
  );

  const maintain = take(
    (row, q) => {
      const acc = Number(row.accuracy) || 0;
      return !row.needsPractice && acc >= 80 && acc < 93 && q >= 6;
    },
    INTERNAL_SESSION_POOL
  );

  const improving = take(
    (row, q) => {
      const acc = Number(row.accuracy) || 0;
      if (row.needsPractice && acc >= 55 && acc < 78) return true;
      if (!row.excellent && acc >= 68 && acc <= 82 && q >= 6) return true;
      return false;
    },
    INTERNAL_SESSION_POOL
  );

  const topStrengths = buildTopStrengthsMerged(
    excellent,
    strengths,
    MAX_TOP_STRENGTHS
  );

  const excellentOut = topStrengths.filter((r) => r.excellent);
  const strengthsOut = topStrengths.filter((r) => !r.excellent);

  const maintainOut = maintain
    .slice(0, MAX_MAINTAIN)
    .map((r) => ({ ...r, tierHe: "Keeping a good level" }));
  const improvingOut = improving
    .slice(0, MAX_IMPROVING)
    .map((r) => ({
      ...r,
      tierHe: "A topic still gaining strength",
      labelHe: improvingDiagnosticsDisplayLabelHe(r.labelHe),
    }));

  return {
    stableExcellence: stableExcellenceOut,
    excellent: excellentOut,
    strengths: strengthsOut,
    maintain: maintainOut,
    improving: improvingOut,
    topStrengths,
  };
}

function buildEvidenceMistakeFromEvent(ev, confidence) {
  if (!ev) return null;
  const ex = String(ev.exerciseText || "").trim();
  if (ex.length > 220) return null;
  if (!ex && ev.userAnswer == null) return null;
  if (confidence !== "high" && confidence !== "moderate") return null;
  return {
    exerciseText: ex || null,
    questionLabel: ev.questionLabel || null,
    correctAnswer: ev.correctAnswer ?? null,
    userAnswer: ev.userAnswer ?? null,
    confidence,
  };
}

function buildEvidenceSuccessFromPick(pick) {
  if (!pick) return null;
  if (pick.questions < 8) return null;
  const conf =
    pick.confidence === "high" || pick.questions >= 20 ? "high" : "moderate";
  return {
    titleHe: "What your child is doing well in practice",
    bodyHe: `On the subject ${pick.labelHe} there is good success in the selected period: about ${pick.accuracy}% correct out of ${pick.questions} questions.`,
    confidence: conf,
  };
}

function buildSummaryHe(
  subjectLabelHe,
  stableExcellence,
  topStrengths,
  topWeaknesses,
  maintain,
  improving,
  wrongCount,
  mistakeEventCount,
  diagnosticSparseNoteHe
) {
  const label = subjectLabelHe || "the subject";
  const opening = `Regarding ${label}:`;

  if (
    !stableExcellence.length &&
    !topStrengths.length &&
    !topWeaknesses.length &&
    !maintain.length &&
    !improving.length
  ) {
    if (diagnosticSparseNoteHe) return `${opening} ${diagnosticSparseNoteHe}`;
    if (wrongCount > 0 && !topWeaknesses.length) {
      return `${opening} There are some mistakes here without a clear repeating pattern - it's better not to jump to conclusions; You should continue with calm practice and accumulate more samples.`;
    }
    if (mistakeEventCount >= 0 && mistakeEventCount < 5) {
      return `${opening} There is still little information in the selected period - after a little more practice it will be possible to formulate a more complete picture.`;
    }
    return null;
  }

  const parts = [];
  if (stableExcellence.length) {
    const exNames = joinHebrewList(stableExcellence.map((s) => s.labelHe));
    parts.push(
      stableExcellence.length > 1
        ? `The child seems to do well in ${exNames} over time.`
        : `The child seems to do well in ${stableExcellence[0].labelHe} over time.`
    );
  }
  if (topStrengths.length) {
    const names = joinHebrewList(topStrengths.map((s) => s.labelHe));
    parts.push(
      topStrengths.length > 1
        ? `You see strong themes in ${names}.`
        : `We see a strong theme in ${names}.`
    );
  } else if (!stableExcellence.length && maintain.length) {
    parts.push(
      `We see a good maintenance of the level in ${joinHebrewList(maintain.map((m) => m.labelHe))}.`
    );
  } else if (stableExcellence.length && maintain.length) {
    parts.push(
      `We also see a good maintenance of the level in ${joinHebrewList(maintain.map((m) => m.labelHe))}.`
    );
  }

  if (topWeaknesses.length) {
    const names = joinHebrewList(
      topWeaknesses.map((w) => parentCopyTopicPhraseHe(w.labelHe))
    );
    let s =
      topWeaknesses.length > 1
        ? `There are also some areas that should be strengthened: ${names}.`
        : `There is also room for strengthening ${parentCopyTopicPhraseHe(topWeaknesses[0].labelHe)}.`;
    if (
      topWeaknesses.some(
        (w) => w.mistakeCount >= MIN_MISTAKES_FOR_STRONG_RECOMMENDATION
      )
    ) {
      s += "It's repetitive enough that it's worth approaching it early - without pressure, with short, neat practice.";
    }
    parts.push(s);
  } else if (wrongCount > 0) {
    parts.push(
      "The mistakes that are there still don't tell one clear story - that's okay; We will continue to follow."
    );
  }

  if (!topWeaknesses.length && improving.length) {
    parts.push(
      `You also see topics that are still growing: ${joinHebrewList(improving.map((x) => x.labelHe))}.`
    );
  }

  const text = parts.join(" ").trim();
  return text || null;
}

function buildParentActionHe(
  subjectLabelHe,
  topWeaknesses,
  improving,
  maintain,
  topStrengths
) {
  const subj = subjectLabelHe || "the subject";
  const tp = parentCopyTopicPhraseHe;
  const w0 = topWeaknesses[0];
  const i0 = improving[0];
  const m0 = maintain[0];
  const s0 = topStrengths[0];
  if (w0) {
    const kind = inferWeaknessKindHe(w0.labelHe);
    if (kind === "wording") {
      return `It is advisable twice a week, about fifteen minutes in ${subj} ${tp(w0.labelHe)} - to read the formulation together, break it into short sentences, and only then formulate an answer.`;
    }
    if (kind === "careless") {
      return `Twice a week, fifteen minutes at ${subj} ${tp(w0.labelHe)} - a short stop before sending: "Did I answer what I was asked?".`;
    }
    return `Twice a week, fifteen minutes: practice in ${subj} focused ${tp(w0.labelHe)} - repeat questions in focused practice, continue slowly until the topic is understood, then recognize a small improvement.`;
  }
  if (i0) {
    return `Twice a week, fifteen minutes: short practice in ${subj} ${tp(i0.labelHe)} (currently accurate about ${i0.accuracy}%) - draft first, check later.`;
  }
  const pick = m0 || s0;
  if (pick) {
    return `Once a week, ten minutes: practice the subject ${subj} ${tp(pick.labelHe)} - practice and a short repetition of the studied material.`;
  }
  return null;
}

function buildNextWeekGoalHe(subjectLabelHe, topWeaknesses, improving, topStrengths, maintain, stableExcellence) {
  const subj = subjectLabelHe || "the subject";
  const w0 = topWeaknesses[0];
  const preserve =
    stableExcellence[0] ||
    topStrengths.find((t) => t.excellent || t.questions >= 8) ||
    maintain.find((m) => m.questions >= 8) ||
    topStrengths[0] ||
    maintain[0];
  const preserveLabel = preserve?.labelHe;
  const tp = parentCopyTopicPhraseHe;
  const goals = [];
  if (w0) {
    if (inferWeaknessKindHe(w0.labelHe) === "wording") {
      goals.push(
        `It is recommended to choose a few examples to go through together with the child step by step, and try this week to increase the success rate - even a small improvement in the success rate is enough.`
      );
    } else {
      goals.push(
        `In ${subj} ${tp(w0.labelHe)} - try one week ${successRateImprovementGoalHe(w0.labelHe)} - even a small improvement in the success rate is enough.`
      );
    }
  } else if (improving?.[0]) {
    const i0 = improving[0];
    goals.push(
      `Two short weeks around ${i0.labelHe} - ${successRateImprovementGoalHe(i0.labelHe)} - two small sessions, not a long practice.`
    );
  }
  if (preserveLabel) {
    goals.push(`Continue next week at the same pace around ${tp(preserveLabel)} - maintain the good level.`);
  }
  if (!goals.length) return null;
  return goals.join(" ");
}

function buildEvidenceExamples(evidenceMistake, evidenceSuccess) {
  const out = [];
  if (evidenceMistake) {
    out.push({ type: "mistake", ...evidenceMistake });
  }
  if (evidenceSuccess) {
    out.push({
      type: "success",
      titleHe: evidenceSuccess.titleHe,
      bodyHe: evidenceSuccess.bodyHe,
      confidence: evidenceSuccess.confidence,
    });
  }
  return out.slice(0, 2);
}

/**
 * Structured segments for the comprehensive report — based on the same buckets as the existing cards, no placeholder text.
 */
function buildDiagnosticSectionsHe({
  stableExcellence,
  topStrengths,
  maintain,
  improving,
  topWeaknesses,
  insufficientData,
  diagnosticSparseNoteHe,
  parentActionHe,
  nextWeekGoalHe,
}) {
  const strongHe = [];
  for (const x of stableExcellence) {
    strongHe.push(`${x.labelHe} - accuracy about ${x.accuracy}% (${x.questions} questions)`);
  }
  for (const x of topStrengths) {
    if (strongHe.length >= 6) break;
    strongHe.push(`${x.labelHe} - accuracy about ${x.accuracy}% (${x.questions} questions)`);
  }

  const maintainHe = (maintain || []).map(
    (x) => `${x.labelHe} - accuracy ${x.accuracy}% (${x.questions} questions; it is recommended to keep pace)`
  );

  const improveHe = (improving || []).map(
    (x) =>
      `${improvingDiagnosticsDisplayLabelHe(x.labelHe)} - accuracy ${x.accuracy}% (${x.questions} questions)`
  );

  const urgentAttentionHe = topWeaknesses.map((w) =>
    `${w.labelHe}${
      typeof w.mistakeCount === "number" ? ` - about ${w.mistakeCount} similar mistakes in the selected period` : ""
    }`
  );

  const insufficientDataHe = [];
  if (diagnosticSparseNoteHe) insufficientDataHe.push(diagnosticSparseNoteHe);
  for (const u of insufficientData.slice(0, 5)) {
    insufficientDataHe.push(u.note || "Partial data for a particular pattern.");
  }
  const insufficientDataNoteHe =
    insufficientData.length > 8
      ? "There are other areas with scattered errors that have not reached the threshold of a pattern that repeats enough - the picture in them is still partial."
      : null;
  if (insufficientDataNoteHe) insufficientDataHe.push(insufficientDataNoteHe);

  return {
    strongHe,
    maintainHe,
    improveHe,
    urgentAttentionHe,
    insufficientDataHe,
    concreteHomeActionHe: parentActionHe || null,
    nextShortGoalHe: nextWeekGoalHe || null,
  };
}

function buildSubSkillInsightsHe(topWeaknesses) {
  return topWeaknesses.slice(0, 4).map((w) => ({
    lineHe: w.labelHe,
    evidenceNoteHe:
      typeof w.mistakeCount === "number" && w.mistakeCount >= MIN_MISTAKES_FOR_STRONG_RECOMMENDATION
        ? "A pattern that repeats in the selected period."
        : typeof w.mistakeCount === "number" && w.mistakeCount >= MIN_PATTERN_FAMILY_FOR_DIAGNOSIS
          ? "Medium repeating pattern - worth noting."
          : "Only an initial sign - still too early for an unequivocal conclusion.",
  }));
}

const RISK_BEHAVIOR_TYPES = new Set([
  "knowledge_gap",
  "speed_pressure",
  "instruction_friction",
  "careless_pattern",
  "fragile_success",
]);

function emptyRiskOr() {
  return {
    falsePromotionRisk: false,
    falseRemediationRisk: false,
    speedOnlyRisk: false,
    hintDependenceRisk: false,
    insufficientEvidenceRisk: false,
    recentTransitionRisk: false,
  };
}

/**
 * Phase 8 — subject-level parent priority scale.
 * @param {string} subjectId
 * @param {object} args
 */
function computeSubjectPriorityFieldsPhase8(subjectId, args) {
  const {
    dominantLearningRisk,
    dominantSuccessPattern,
    subjectConclusionReadiness,
    dominantRootCause,
    riskOr,
    stableMasteryRowCount,
    fragileSuccessRowCount,
    recommendedHomeMethodHe,
    strongRowCount,
  } = args;
  const lab = SUBJECT_LABEL_HE[subjectId] || "the subject";
  const home =
    recommendedHomeMethodHe && String(recommendedHomeMethodHe).trim()
      ? String(recommendedHomeMethodHe).trim()
      : "";

  if (subjectConclusionReadiness === "not_ready" || dominantRootCause === "insufficient_evidence") {
    return {
      subjectPriorityLevel: "monitor",
      subjectPriorityReasonHe: `In ${lab} the information is still incomplete - light practice and repeated testing is better, not too big a change.`,
      subjectImmediateActionHe: `In ${lab}: two short sessions (5–8 minutes) at the same difficulty level - watch and record only.`,
      subjectDeferredActionHe: `In ${lab}: postpone a change of level/class and a long program until a figure stabilizes.`,
      subjectMonitoringOnly: true,
      subjectDoNowHe: "short and regular practice; One clear task for each session.",
      subjectAvoidNowHe: "Do not draw strong conclusions or load a series of reinforcements.",
    };
  }

  if (
    subjectConclusionReadiness === "ready" &&
    dominantRootCause === "knowledge_gap" &&
    (strongRowCount || 0) >= 1
  ) {
    return {
      subjectPriorityLevel: "immediate",
      subjectPriorityReasonHe: `In ${lab} ${ROOT_CAUSE_LABEL_HE.knowledge_gap} it is recommended to start with a short and focused practice.`,
      subjectImmediateActionHe: home || `In ${lab}: one short mission with repetition of a typical mistake at the same level.`,
      subjectDeferredActionHe: `In ${lab}: to wait with the expansion of subjects until they have stabilized repeated small successes.`,
      subjectMonitoringOnly: false,
      subjectDoNowHe: "targeted reinforcement at the same level; Fewer issues at the same time.",
      subjectAvoidNowHe: "Do not push too fast a rise in the level at home; Do not skip repeating mistakes.",
    };
  }

  if (
    subjectConclusionReadiness === "ready" &&
    fragileSuccessRowCount >= 1 &&
    riskOr?.hintDependenceRisk
  ) {
    return {
      subjectPriorityLevel: "immediate",
      subjectPriorityReasonHe: `In ${lab} there is success with the child still using hints - you should work now on a gradual transition to independence.`,
      subjectImmediateActionHe: home || `In ${lab}: a short task - a small independent experience and then a test together.`,
      subjectDeferredActionHe: `In ${lab}: postpone a too rapid increase in level until the dependency decreases a little.`,
      subjectMonitoringOnly: false,
      subjectDoNowHe: "Separate a short independent experience from a test at the end.",
      subjectAvoidNowHe: "Do not stop help suddenly; Do not explain too long during the practice.",
    };
  }

  if (
    dominantSuccessPattern === "stable_mastery" &&
    stableMasteryRowCount >= 2 &&
    dominantLearningRisk !== "knowledge_gap" &&
    dominantRootCause !== "knowledge_gap"
  ) {
    return {
      subjectPriorityLevel: "maintain",
      subjectPriorityReasonHe: `In ${lab} it seems that the level is maintained relatively well - stay on a calm routine.`,
      subjectImmediateActionHe: home || `In ${lab}: continue with two short practices a week around the topics where relatively good results are seen.`,
      subjectDeferredActionHe: `In ${lab}: reject extensions or hardening before a clear need.`,
      subjectMonitoringOnly: false,
      subjectDoNowHe: "to continue a steady pace; Praise a little persistence.",
      subjectAvoidNowHe: "Do not add load to the house when there is no clear sign.",
    };
  }

  if (subjectConclusionReadiness === "partial" || dominantRootCause === "mixed_signal") {
    return {
      subjectPriorityLevel: "soon",
      subjectPriorityReasonHe: `In ${lab} middle picture - small change now, big decisions later.`,
      subjectImmediateActionHe: home || `In ${lab}: one short meeting this week with only one focus.`,
      subjectDeferredActionHe: `In ${lab}: postpone a final decision when the data is still mixed.`,
      subjectMonitoringOnly: false,
      subjectDoNowHe: "to track accuracy at the same level before adding variables.",
      subjectAvoidNowHe: "Do not lock in a single explanation when there are several possible directions.",
    };
  }

  return {
    subjectPriorityLevel: "soon",
    subjectPriorityReasonHe: `In ${lab}: medium priority - short and regular practice.`,
    subjectImmediateActionHe: home || `In ${lab}: two short sessions a week at the same level.`,
    subjectDeferredActionHe: `In ${lab}: postpone dramatic changes until the direction becomes clear.`,
    subjectMonitoringOnly: false,
    subjectDoNowHe: "short and regular practice; A clear mission.",
    subjectAvoidNowHe: "Do not make a level worse without two good encounters in a row.",
  };
}

/**
 * Subject-level synthesis from enriched report rows (Phase 1–2) — only when there is data in the row.
 * @param {string} subjectId
 * @param {Record<string, unknown>} report
 */
function synthesizeSubjectPhase3FromRows(subjectId, report) {
  const rowsKey = REPORT_ROWS_KEY[subjectId];
  const map =
    (rowsKey && report[rowsKey] ? report[rowsKey] : null) ||
    (subjectId === "history" && report.historyTopics ? report.historyTopics : {}) ||
    {};
  const entries = Object.entries(map || {}).filter(([, row]) => row && typeof row === "object");
  const rows = entries
    .map(([rowKey, row]) => ({ rowKey, row }))
    .filter(({ row }) => (Number(row.questions) || 0) > 0);

  if (!rows.length) {
    return {
      dominantLearningRisk: "none_sparse",
      dominantSuccessPattern: "none_sparse",
      trendNarrativeHe: "In the selected period there is still not enough practice to identify a clear trend in this profession.",
      confidenceSummaryHe: "In the chosen period there is still not enough practice to know how clear the direction is in this profession.",
      recommendedHomeMethodHe: null,
      whatNotToDoHe: "Do not build a long plan before there is more practice in the selected period.",
      majorRiskFlagsAcrossRows: emptyRiskOr(),
      dominantBehaviorProfileAcrossRows: "undetermined",
      strongestPositiveTrendRowHe: null,
      strongestCautionTrendRowHe: null,
      fragileSuccessRowCount: 0,
      stableMasteryRowCount: 0,
      modeConcentrationNoteHe: null,
      improvingButSupportedHe: null,
      dominantLearningRiskLabelHe: null,
      dominantSuccessPatternLabelHe: null,
      dominantRootCause: "insufficient_evidence",
      dominantRootCauseLabelHe: ROOT_CAUSE_LABEL_HE.insufficient_evidence,
      secondaryRootCause: null,
      rootCauseDistribution: {},
      subjectDiagnosticRestraintHe:
        "In the chosen period there is still not enough practice to understand where the difficulty starts or to recommend a major change.",
      subjectConclusionReadiness: "not_ready",
      subjectInterventionPriorityHe: INTERVENTION_TYPE_LABEL_HE.monitor_before_escalation,
      subjectPriorityLevel: "monitor",
      subjectPriorityReasonHe: "In the selected period there is still not enough practice to determine what is important to practice first.",
      subjectImmediateActionHe: null,
      subjectDeferredActionHe: null,
      subjectMonitoringOnly: true,
      subjectDoNowHe: "Collect a little short practice before decisions.",
      subjectAvoidNowHe: "Do not build a long plan before there is a figure.",
      dominantMistakePattern: "insufficient_mistake_evidence",
      dominantMistakePatternLabelHe: MISTAKE_PATTERN_LABEL_HE.insufficient_mistake_evidence,
      mistakePatternDistribution: {},
      subjectLearningStage: "insufficient_longitudinal_evidence",
      subjectLearningStageLabelHe: LEARNING_STAGE_LABEL_HE.insufficient_longitudinal_evidence,
      subjectRetentionRisk: "unknown",
      subjectTransferReadiness: "not_ready",
      subjectMemoryNarrativeHe: "In the selected period there is still not enough practice to detect a recurring error or a change over time.",
      subjectReviewBeforeAdvanceHe: null,
      subjectResponseToIntervention: "not_enough_evidence",
      subjectResponseToInterventionLabelHe: RESPONSE_TO_INTERVENTION_LABEL_HE.not_enough_evidence,
      subjectSupportFit: "unknown",
      subjectSupportAdjustmentNeed: "monitor_only",
      subjectSupportAdjustmentNeedHe: SUPPORT_ADJUSTMENT_NEED_LABEL_HE.monitor_only,
      subjectConclusionFreshness: "low",
      subjectRecalibrationNeed: "do_not_rely_yet",
      subjectRecalibrationNeedHe: RECALIBRATION_NEED_LABEL_HE.do_not_rely_yet,
      subjectEffectivenessNarrativeHe: "In the selected period there is still not enough practice to know if the help given really helped.",
      subjectSupportSequenceState: "insufficient_sequence_evidence",
      subjectSupportSequenceStateLabelHe: SUPPORT_SEQUENCE_STATE_LABEL_HE.insufficient_sequence_evidence,
      subjectStrategyRepetitionRisk: "unknown",
      subjectStrategyFatigueRisk: "unknown",
      subjectNextBestSequenceStep: "observe_before_next_cycle",
      subjectNextBestSequenceStepHe: NEXT_BEST_SEQUENCE_STEP_LABEL_HE.observe_before_next_cycle,
      subjectAdviceNovelty: "unknown",
      subjectRecommendationRotationNeed: "do_not_repeat_yet",
      subjectSequenceNarrativeHe: "In the selected period there is still not enough practice to decide what the next step in practice is.",
      subjectRecommendationMemoryState: "no_memory",
      subjectPriorRecommendationSignature: "unknown",
      subjectSupportHistoryDepth: "unknown",
      subjectRecommendationCarryover: "not_visible",
      subjectExpectedVsObservedMatch: "not_enough_evidence",
      subjectFollowThroughSignal: "not_inferable",
      subjectContinuationDecision: "continue_but_refine",
      subjectContinuationDecisionHe: RECOMMENDATION_CONTINUATION_DECISION_LABEL_HE.continue_but_refine,
      subjectOutcomeNarrativeHe: "In the selected period there is still not enough practice to know if what we tried recently helped.",
      subjectGateState: "gates_not_ready",
      subjectGateStateLabelHe: GATE_STATE_LABEL_HE.gates_not_ready,
      subjectGateReadiness: "insufficient",
      subjectNextCycleDecisionFocus: "prove_current_direction",
      subjectNextCycleDecisionFocusHe: NEXT_CYCLE_DECISION_FOCUS_LABEL_HE.prove_current_direction,
      subjectEvidenceTargetType: "fresh_data_needed",
      subjectTargetObservationWindow: "unknown",
      subjectGateNarrativeHe: "In the selected period there is still not enough practice to make a confident decision.",
      subjectDependencyState: "insufficient_dependency_evidence",
      subjectDependencyStateLabelHe: DEPENDENCY_STATE_LABEL_HE.insufficient_dependency_evidence,
      subjectLikelyFoundationalBlocker: "unknown",
      subjectLikelyFoundationalBlockerLabelHe: FOUNDATIONAL_BLOCKER_LABEL_HE.unknown,
      subjectDownstreamSymptomRisk: "unknown",
      subjectFoundationFirstPriority: false,
      subjectFoundationFirstPriorityHe: "In the chosen period there is still not enough practice to understand where the difficulty starts.",
      subjectDependencyNarrativeHe: "You should gather more practice before deciding what should be strengthened first.",
    };
  }

  const behaviorCounts = {};
  let fragileSuccessRowCount = 0;
  let stableMasteryRowCount = 0;
  const riskOr = emptyRiskOr();
  const modeKeys = [];
  const rootCauseRowCounts = {};
  let withheldStrengthRows = 0;
  let tentativeStrengthRows = 0;
  let moderateOrStrongRows = 0;

  let bestPositive = /** @type {{ labelHe: string, summaryHe: string, conf: number }|null} */ (null);
  let worstCaution = /** @type {{ labelHe: string, summaryHe: string, score: number }|null} */ (null);
  let improvingButSupportedHe = /** @type {string|null} */ (null);

  const mistakePatternRowCounts = {};
  const learningStageRowCounts = {};
  let maxRetentionRank = 0;
  const rrRank = { unknown: 0, low: 1, moderate: 2, high: 3 };
  let minTransferScore = 99;
  const trScore = { not_ready: 0, limited: 1, emerging: 2, ready: 3, unknown: -1 };
  /** @type {string[]} */
  const reviewBeforeAdvanceRowHints = [];

  const rtiCounts = {};
  const RTI_SUBJECT_WORST_FIRST = [
    "regression_under_support",
    "stalled_response",
    "mixed_response",
    "over_supported_progress",
    "not_enough_evidence",
    "early_positive_response",
    "independence_growing",
  ];
  const fitRank = { unknown: 0, good_fit: 1, partial_fit: 2, poor_fit: 3 };
  let fitBest = 0;
  let subjectSupportFitAgg = "unknown";
  const adjRank = {
    monitor_only: 0,
    hold_course: 1,
    reduce_support: 2,
    tighten_focus: 3,
    increase_structure: 4,
    change_strategy: 5,
  };
  let adjBest = 0;
  let subjectSupportAdjustmentNeedAgg = "monitor_only";
  const cfRank = { high: 0, medium: 1, low: 2, expired: 3 };
  let cfBest = 0;
  let subjectConclusionFreshnessAgg = "medium";
  const recRank = { none: 0, light_review: 1, structured_recheck: 2, do_not_rely_yet: 3 };
  let recBest = 0;
  let subjectRecalibrationNeedAgg = "none";

  const SEQ_STATE_WORST_FIRST = [
    "sequence_exhausted",
    "sequence_stalled",
    "insufficient_sequence_evidence",
    "continuing_sequence",
    "early_sequence",
    "new_support_cycle",
    "sequence_ready_for_release",
  ];
  const seqStateCounts = {};
  const repRiskRankP11 = { unknown: 0, low: 1, moderate: 2, high: 3 };
  let repBestP11 = 0;
  let subjectStrategyRepetitionRiskAgg = "unknown";
  const fatRiskRankP11 = { unknown: 0, low: 1, moderate: 2, high: 3 };
  let fatBestP11 = 0;
  let subjectStrategyFatigueRiskAgg = "unknown";
  const rotRankP11 = { none: 0, light_variation: 1, meaningful_rotation: 2, do_not_repeat_yet: 3 };
  let rotBestP11 = 0;
  let subjectRecommendationRotationNeedAgg = "none";
  const noveltyRankWorst = { low: 0, medium: 1, high: 2, unknown: 3 };
  let noveltyWorstScore = 99;
  let subjectAdviceNoveltyAgg = "unknown";
  const NEXT_BEST_STEP_WORST_FIRST = [
    "switch_support_type",
    "reset_with_short_review",
    "tighten_same_goal",
    "observe_before_next_cycle",
    "begin_release_step",
    "continue_current_sequence",
  ];
  const nextBestStepCounts = {};

  const MEM_STATE_RANK = { no_memory: 0, light_memory: 1, usable_memory: 2, strong_memory: 3 };
  const DEPTH_RANK = { unknown: 0, single_window: 1, short_history: 2, multi_window: 3 };
  const CARRY_RANK = { not_visible: 0, unclear: 1, partly_visible: 2, clearly_visible: 3 };
  const MATCH_WORST_FIRST = ["misaligned", "not_enough_evidence", "partly_aligned", "aligned"];
  const FOLLOW_WORST_FIRST = ["not_inferable", "unclear", "possibly_followed", "likely_followed"];
  const CONTINUATION_WORST_FIRST = [
    "reset_and_rebuild_signal",
    "pivot_from_prior_path",
    "do_not_repeat_without_new_evidence",
    "continue_but_refine",
    "begin_controlled_release",
    "continue_with_same_core",
  ];
  let memRankBest = -1;
  let subjectRecommendationMemoryState = "no_memory";
  let depthRankBest = -1;
  let subjectSupportHistoryDepth = "unknown";
  let carryRankBest = -1;
  let subjectRecommendationCarryover = "not_visible";
  const priorSigCounts = {};
  const matchCounts = {};
  const followCounts = {};
  const continuationCounts = {};

  const GATE_STATE_PRIORITY = [
    "pivot_gate_visible",
    "recheck_gate_visible",
    "gates_not_ready",
    "mixed_gate_state",
    "release_gate_forming",
    "advance_gate_forming",
    "continue_gate_active",
  ];
  const gateStateCounts = {};
  const READINESS_WORST = ["insufficient", "low", "moderate", "high"];
  const readinessCounts = {};
  const nextFocusCounts = {};
  const TARGET_TYPE_PRIORITY = [
    "fresh_data_needed",
    "mixed_target",
    "response_confirmation",
    "mistake_reduction_confirmation",
    "retention_confirmation",
    "independence_confirmation",
    "accuracy_confirmation",
  ];
  const targetTypeCounts = {};
  const WINDOW_PRIORITY = ["needs_fresh_baseline", "next_two_cycles", "next_short_cycle", "unknown"];
  const windowCounts = {};
  const depStateCounts = {};
  const blockerRowCounts = {};
  const dlRank = { unknown: 0, low: 1, moderate: 2, high: 3 };
  let worstDownstreamRank = 0;
  let foundationHeavyRows = 0;

  for (const { rowKey, row } of rows) {
    const bp = row.behaviorProfile && typeof row.behaviorProfile === "object" ? row.behaviorProfile : null;
    const dom = String(bp?.dominantType || "undetermined");
    behaviorCounts[dom] = (behaviorCounts[dom] || 0) + 1;
    if (dom === "fragile_success") fragileSuccessRowCount += 1;
    if (dom === "stable_mastery") stableMasteryRowCount += 1;

    const sig = row.topicEngineRowSignals && typeof row.topicEngineRowSignals === "object" ? row.topicEngineRowSignals : null;
    const rf = sig?.riskFlags && typeof sig.riskFlags === "object" ? sig.riskFlags : null;
    if (rf) {
      for (const k of Object.keys(riskOr)) {
        if (rf[k]) riskOr[k] = true;
      }
    }

    const rcId = String(sig?.rootCause || "").trim();
    if (rcId) rootCauseRowCounts[rcId] = (rootCauseRowCounts[rcId] || 0) + 1;
    const csRow = String(sig?.conclusionStrength || "").trim();
    if (csRow === "withheld") withheldStrengthRows += 1;
    else if (csRow === "tentative") tentativeStrengthRows += 1;
    else if (csRow === "moderate" || csRow === "strong") moderateOrStrongRows += 1;

    const mk = row.modeKey != null && String(row.modeKey).trim() !== "" ? String(row.modeKey).trim() : null;
    if (mk) modeKeys.push(mk);

    const trend = row.trend && typeof row.trend === "object" ? row.trend : null;
    const tConf = Number(trend?.confidence);
    const labelHe = sessionRowLabelHe(subjectId, row);
    const sumHe = String(trend?.summaryHe || "").trim();

    if (trend && (trend.accuracyDirection === "up" || trend.fluencyDirection === "up")) {
      const c = Number.isFinite(tConf) ? tConf : 0;
      if (!bestPositive || c > bestPositive.conf) {
        bestPositive = { labelHe, summaryHe: sumHe, conf: c };
      }
    }
    if (trend && (trend.accuracyDirection === "down" || trend.independenceDirection === "down")) {
      let score = 0;
      if (trend.accuracyDirection === "down") score += 2;
      if (trend.independenceDirection === "down") score += 1;
      if (trend.accuracyDirection === "up" && trend.independenceDirection === "down") score += 2;
      if (!worstCaution || score > worstCaution.score) {
        worstCaution = { labelHe, summaryHe: sumHe, score };
      }
    }
    if (
      trend &&
      trend.accuracyDirection === "up" &&
      trend.independenceDirection === "down" &&
      !improvingButSupportedHe
    ) {
      const subLab = SUBJECT_LABEL_HE[subjectId] || "the subject";
      improvingButSupportedHe = `In ${subLab} there is at least one line (${labelHe}) in which accuracy increases but independence decreases - progress still requires accompaniment; Not yet full independent control.`;
    }

    const dmp = String(sig?.dominantMistakePattern || "").trim();
    if (dmp) mistakePatternRowCounts[dmp] = (mistakePatternRowCounts[dmp] || 0) + 1;
    const lsg = String(sig?.learningStage || "").trim();
    if (lsg) learningStageRowCounts[lsg] = (learningStageRowCounts[lsg] || 0) + 1;
    const rrs = String(sig?.retentionRisk || "");
    if (rrRank[rrs] != null && rrRank[rrs] > maxRetentionRank) maxRetentionRank = rrRank[rrs];
    const trs = String(sig?.transferReadiness || "");
    if (trs && trScore[trs] != null && trScore[trs] >= 0 && trScore[trs] < minTransferScore) {
      minTransferScore = trScore[trs];
    }
    const rba = String(sig?.reviewBeforeAdvanceHe || "").trim();
    if (rba && reviewBeforeAdvanceRowHints.length < 4) reviewBeforeAdvanceRowHints.push(rba);

    const rtiRow = String(sig?.responseToIntervention || "").trim();
    if (rtiRow) rtiCounts[rtiRow] = (rtiCounts[rtiRow] || 0) + 1;
    const sf = String(sig?.supportFit || "").trim();
    if (fitRank[sf] != null && fitRank[sf] > fitBest) {
      fitBest = fitRank[sf];
      subjectSupportFitAgg = sf;
    }
    const adj = String(sig?.supportAdjustmentNeed || "").trim();
    if (adjRank[adj] != null && adjRank[adj] > adjBest) {
      adjBest = adjRank[adj];
      subjectSupportAdjustmentNeedAgg = adj;
    }
    const cf = String(sig?.conclusionFreshness || "").trim();
    if (cfRank[cf] != null && cfRank[cf] > cfBest) {
      cfBest = cfRank[cf];
      subjectConclusionFreshnessAgg = cf;
    }
    const rcn = String(sig?.recalibrationNeed || "").trim();
    if (recRank[rcn] != null && recRank[rcn] > recBest) {
      recBest = recRank[rcn];
      subjectRecalibrationNeedAgg = rcn;
    }

    const ssq = String(sig?.supportSequenceState || "").trim();
    if (ssq) seqStateCounts[ssq] = (seqStateCounts[ssq] || 0) + 1;
    const repP = String(sig?.strategyRepetitionRisk || "").trim();
    if (repRiskRankP11[repP] != null && repRiskRankP11[repP] > repBestP11) {
      repBestP11 = repRiskRankP11[repP];
      subjectStrategyRepetitionRiskAgg = repP;
    }
    const fatP = String(sig?.strategyFatigueRisk || "").trim();
    if (fatRiskRankP11[fatP] != null && fatRiskRankP11[fatP] > fatBestP11) {
      fatBestP11 = fatRiskRankP11[fatP];
      subjectStrategyFatigueRiskAgg = fatP;
    }
    const rotP = String(sig?.recommendationRotationNeed || "").trim();
    if (rotRankP11[rotP] != null && rotRankP11[rotP] > rotBestP11) {
      rotBestP11 = rotRankP11[rotP];
      subjectRecommendationRotationNeedAgg = rotP;
    }
    const advN = String(sig?.adviceNovelty || "").trim();
    const nvs = noveltyRankWorst[advN];
    if (nvs != null && nvs < noveltyWorstScore) {
      noveltyWorstScore = nvs;
      subjectAdviceNoveltyAgg = advN;
    }
    const nbs = String(sig?.nextBestSequenceStep || "").trim();
    if (nbs) nextBestStepCounts[nbs] = (nextBestStepCounts[nbs] || 0) + 1;

    const memSt = String(sig?.recommendationMemoryState || "").trim();
    if (MEM_STATE_RANK[memSt] != null && MEM_STATE_RANK[memSt] > memRankBest) {
      memRankBest = MEM_STATE_RANK[memSt];
      subjectRecommendationMemoryState = memSt;
    }
    const dep = String(sig?.supportHistoryDepth || "").trim();
    if (DEPTH_RANK[dep] != null && DEPTH_RANK[dep] > depthRankBest) {
      depthRankBest = DEPTH_RANK[dep];
      subjectSupportHistoryDepth = dep;
    }
    const car = String(sig?.recommendationCarryover || "").trim();
    if (CARRY_RANK[car] != null && CARRY_RANK[car] > carryRankBest) {
      carryRankBest = CARRY_RANK[car];
      subjectRecommendationCarryover = car;
    }
    const prs = String(sig?.priorRecommendationSignature || "").trim();
    if (prs) priorSigCounts[prs] = (priorSigCounts[prs] || 0) + 1;
    const mch = String(sig?.expectedVsObservedMatch || "").trim();
    if (mch) matchCounts[mch] = (matchCounts[mch] || 0) + 1;
    const flw = String(sig?.followThroughSignal || "").trim();
    if (flw) followCounts[flw] = (followCounts[flw] || 0) + 1;
    const cont = String(sig?.recommendationContinuationDecision || "").trim();
    if (cont) continuationCounts[cont] = (continuationCounts[cont] || 0) + 1;

    const gs = String(sig?.gateState || "").trim();
    if (gs) gateStateCounts[gs] = (gateStateCounts[gs] || 0) + 1;
    const gr = String(sig?.gateReadiness || "").trim();
    if (gr) readinessCounts[gr] = (readinessCounts[gr] || 0) + 1;
    const nf = String(sig?.nextCycleDecisionFocus || "").trim();
    if (nf) nextFocusCounts[nf] = (nextFocusCounts[nf] || 0) + 1;
    const tet = String(sig?.targetEvidenceType || "").trim();
    if (tet) targetTypeCounts[tet] = (targetTypeCounts[tet] || 0) + 1;
    const tow = String(sig?.targetObservationWindow || "").trim();
    if (tow) windowCounts[tow] = (windowCounts[tow] || 0) + 1;

    const depSt = String(sig?.dependencyState || "").trim();
    if (depSt) depStateCounts[depSt] = (depStateCounts[depSt] || 0) + 1;
    const lbk = String(sig?.likelyFoundationalBlocker || "").trim();
    if (lbk && lbk !== "unknown") blockerRowCounts[lbk] = (blockerRowCounts[lbk] || 0) + 1;
    const dsl = String(sig?.downstreamSymptomLikelihood || "").trim();
    const drk = dlRank[dsl] != null ? dlRank[dsl] : 0;
    if (drk > worstDownstreamRank) worstDownstreamRank = drk;
    if (sig?.foundationDecision === "stabilize_foundation_first" || sig?.shouldTreatAsFoundationFirst) {
      foundationHeavyRows += 1;
    }
  }

  const riskPool = {};
  for (const [k, n] of Object.entries(behaviorCounts)) {
    if (RISK_BEHAVIOR_TYPES.has(k)) riskPool[k] = n;
  }
  const riskEntries = Object.entries(riskPool)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  let dominantLearningRisk = "mixed";
  if (!riskEntries.length) {
    dominantLearningRisk = behaviorCounts.stable_mastery ? "none_observed" : "none_sparse";
  } else {
    const [topType, topN] = riskEntries[0];
    if (topN >= 2 || rows.length <= 4) dominantLearningRisk = topType;
    else if (rows.length >= 8 && topN === 1) dominantLearningRisk = "mixed_low_signal";
    else dominantLearningRisk = topType;
  }

  let dominantSuccessPattern = "mixed";
  if (stableMasteryRowCount >= 2 && stableMasteryRowCount >= fragileSuccessRowCount) {
    dominantSuccessPattern = "stable_mastery";
  } else if (fragileSuccessRowCount > stableMasteryRowCount && fragileSuccessRowCount >= 2) {
    dominantSuccessPattern = "fragile_success_cluster";
  } else if (stableMasteryRowCount > 0) {
    dominantSuccessPattern = "stable_mastery";
  } else if (fragileSuccessRowCount > 0) {
    dominantSuccessPattern = "fragile_success_cluster";
  }

  const modeDist = {};
  for (const m of modeKeys) modeDist[m] = (modeDist[m] || 0) + 1;
  const modeTop = Object.entries(modeDist).sort((a, b) => b[1] - a[1])[0];
  let modeConcentrationNoteHe = null;
  if (modeTop && modeKeys.length >= 4 && modeTop[1] / modeKeys.length >= 0.62) {
    modeConcentrationNoteHe = `Most of the practice in the selected period in the "${modeTop[0]}" mode - are not automatically generalized to the entire profession.`;
  }

  const strongRows = rows.filter((r) => r.row.dataSufficiencyLevel === "strong" && r.row.evidenceStrength === "strong");
  const anyHighRisk = riskOr.falsePromotionRisk || riskOr.hintDependenceRisk || riskOr.recentTransitionRisk;
  const trendParts = [];
  if (bestPositive && bestPositive.summaryHe && (bestPositive.conf >= 0.35 || !Number.isFinite(bestPositive.conf))) {
    trendParts.push(`Positive trend in ${bestPositive.labelHe}: ${bestPositive.summaryHe}`);
  }
  if (worstCaution && worstCaution.summaryHe) {
    trendParts.push(`A point of caution in ${worstCaution.labelHe}: ${worstCaution.summaryHe}`);
  }
  if (modeConcentrationNoteHe) trendParts.push(modeConcentrationNoteHe);
  let trendNarrativeHe = trendParts.join(" ").trim();
  if (!trendNarrativeHe) {
    trendNarrativeHe =
      rows.some((r) => r.row.trend)
        ? "There are trend data in the ranks, but there is still no uniform trend story at the professional level - it is worth gathering more practice."
        : "There is still little data on change over time - you should check again after more practice.";
  }
  trendNarrativeHe = normalizeParentFacingHe(trendNarrativeHe);

  const suffStrong = rows.filter((r) => r.row.dataSufficiencyLevel === "strong").length;
  const suffMed = rows.filter((r) => r.row.dataSufficiencyLevel === "medium").length;
  const suffLow = rows.filter((r) => r.row.dataSufficiencyLevel === "low" || !r.row.dataSufficiencyLevel).length;
  const hiConf = rows.filter((r) => (Number(r.row.confidenceScore) || 0) >= 72).length;
  let confidenceSummaryHe = `According to the collected data: ${suffStrong} lines give a clear direction, ${suffMed} lines give a partial direction, and ${suffLow} lines still with little information; ${hiConf} Clearer data from ${rows.length}.`;
  if (suffLow >= rows.length * 0.55) {
    confidenceSummaryHe += "The picture in the profession is still partial - remain cautious.";
  }
  if (anyHighRisk && strongRows.length >= 2) {
    confidenceSummaryHe += "Despite data with relatively good results, there are also points for attention - don't mark everything as stable yet.";
  }

  const riskLabelHe = {
    ...PARENT_DIAGNOSTIC_TYPE_LABEL_HE,
    mixed: PARENT_DIAGNOSTIC_TYPE_LABEL_HE.mixed_signal,
    fragile_success: PARENT_DIAGNOSTIC_TYPE_LABEL_HE.fragile_success,
    none_sparse: "Too little practice in the lines",
    none_observed: "Not one prominent repetitive behavior type was identified",
  };

  const successLabelHe = {
    stable_mastery: "Good control that is maintained over time in the rows",
    fragile_success_cluster: "Success with fragility in help/independence",
    mixed: "A mix of plates",
    none_sparse: "Too little practice in the lines",
  };

  let recommendedHomeMethodHe = null;
  const domRiskHe = riskLabelHe[dominantLearningRisk] || dominantLearningRisk;
  if (dominantLearningRisk === "knowledge_gap") {
    recommendedHomeMethodHe = `What to do at home: slow repetition of the basics in ${domRiskHe} - a short task, testing against the solution, without increasing the level too quickly.`;
  } else if (dominantLearningRisk === "speed_pressure") {
    recommendedHomeMethodHe =
      "What to do at home: break down the pressure for speed - practice at the same level of difficulty with an emphasis on accuracy before speed, without lowering the level of the entire profession.";
  } else if (dominantLearningRisk === "instruction_friction") {
    recommendedHomeMethodHe =
      "What to do at home: reading a joint task, identifying what was asked, and only then answering - to reduce the child is still helped by step-by-step hints.";
  } else if (dominantLearningRisk === "careless_pattern") {
    recommendedHomeMethodHe =
      "What to do at home: a short stop before sending, checking against the wording - do not immediately assume that this is a deep-rooted difficulty.";
  } else if (dominantLearningRisk === "fragile_success") {
    recommendedHomeMethodHe =
      "What to do at home: build independence gradually - a short practice with less help after the understanding is clear, without pushing too fast an increase in level.";
  } else {
    recommendedHomeMethodHe =
      strongRows.length >= 1
        ? "What to do at home: keep practice short and regular, and check that the level is maintained before changing settings."
        : "What to do at home: continue to collect short practice until the image in the profession stabilizes.";
  }

  const avoid = [];
  if (riskOr.falsePromotionRisk || dominantLearningRisk === "fragile_success") {
    avoid.push("Do not push a too fast increase in level or class at home without repeated success and without a decrease in the child still using hints.");
  }
  if (riskOr.speedOnlyRisk || dominantLearningRisk === "speed_pressure") {
    avoid.push("Do not turn difficulty in speed mode into a level drop in the entire profession.");
  }
  if (riskOr.falseRemediationRisk || dominantLearningRisk === "careless_pattern") {
    avoid.push("Do not immediately drop to an easy level without first trying targeted strengthening at the same level.");
  }
  if (riskOr.hintDependenceRisk) {
    avoid.push("Don't suddenly stop help - but gradually reduce it as understanding improves.");
  }
  if (worstCaution && worstCaution.score >= 3) {
    avoid.push("Do not interpret a short drop as a permanent failure - it is better to be careful and retest.");
  }
  const whatNotToDoHe = avoid.length ? avoid.join(" ") : "Do not determine a dramatic change without more practice in the chosen period.";

  const rootEntries = Object.entries(rootCauseRowCounts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const nonInsEntries = rootEntries.filter(([k]) => k !== "insufficient_evidence");
  let dominantRootCause = "insufficient_evidence";
  let secondaryRootCause = null;
  if (rootEntries.length) {
    const top = rootEntries[0];
    if (top[0] === "insufficient_evidence" && nonInsEntries.length && nonInsEntries[0][1] >= top[1]) {
      dominantRootCause = nonInsEntries[0][0];
      secondaryRootCause = rootEntries.find(([k]) => k !== dominantRootCause)?.[0] ?? null;
    } else {
      dominantRootCause = top[0];
      secondaryRootCause = rootEntries[1]?.[0] ?? null;
    }
  }
  const dominantRootCauseLabelHe =
    ROOT_CAUSE_LABEL_HE[dominantRootCause] || ROOT_CAUSE_LABEL_HE.insufficient_evidence;

  const nR = rows.length;
  const wFrac = withheldStrengthRows / nR;
  const tFrac = tentativeStrengthRows / nR;
  let subjectConclusionReadiness = "ready";
  if (wFrac >= 0.38) subjectConclusionReadiness = "not_ready";
  else if (wFrac + tFrac >= 0.45) subjectConclusionReadiness = "partial";

  subjectConclusionReadiness = mergeSubjectConclusionReadinessContract({
    internalReadiness: subjectConclusionReadiness,
    rows,
    withheldStrengthRows,
    tentativeStrengthRows,
    rowCount: nR,
    hasCannotConcludeYet: false,
  });

  let subjectDiagnosticRestraintHe = "";
  if (subjectConclusionReadiness === "not_ready") {
    subjectDiagnosticRestraintHe =
      "In most profession data there is still little information or it is too early to determine - no unambiguous explanation has yet been established.";
  } else if (subjectConclusionReadiness === "partial") {
    subjectDiagnosticRestraintHe =
      "There is some information, but also data that requires caution - you should follow it and not rush to determine too strong a direction.";
  } else if (moderateOrStrongRows >= Math.ceil(nR * 0.55)) {
    subjectDiagnosticRestraintHe = "There are some data that show a similar direction - the summary within the profession can be trusted more.";
  } else {
    subjectDiagnosticRestraintHe = "The picture in the profession is still mixed - it's worth going over the issues separately.";
  }

  const intv = pickRecommendedInterventionType(dominantRootCause, "maintain_and_strengthen");
  const subjectInterventionPriorityHe = INTERVENTION_TYPE_LABEL_HE[intv] || INTERVENTION_TYPE_LABEL_HE.monitor_before_escalation;

  const priorityFields = computeSubjectPriorityFieldsPhase8(subjectId, {
    dominantLearningRisk,
    dominantSuccessPattern,
    subjectConclusionReadiness,
    dominantRootCause,
    riskOr,
    stableMasteryRowCount,
    fragileSuccessRowCount,
    recommendedHomeMethodHe,
    strongRowCount: strongRows.length,
  });

  const mpEntries = Object.entries(mistakePatternRowCounts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const nonInsMp = mpEntries.filter(([k]) => k !== "insufficient_mistake_evidence");
  let dominantMistakePattern = "insufficient_mistake_evidence";
  if (mpEntries.length) {
    const top = mpEntries[0];
    if (top[0] === "insufficient_mistake_evidence" && nonInsMp.length && nonInsMp[0][1] >= top[1]) {
      dominantMistakePattern = nonInsMp[0][0];
    } else {
      dominantMistakePattern = top[0];
    }
  }
  const dominantMistakePatternLabelHe =
    MISTAKE_PATTERN_LABEL_HE[dominantMistakePattern] || MISTAKE_PATTERN_LABEL_HE.insufficient_mistake_evidence;

  const STAGE_PRIORITY = [
    "regression_signal",
    "fragile_retention",
    "early_acquisition",
    "insufficient_longitudinal_evidence",
    "partial_stabilization",
    "transfer_emerging",
    "stable_control",
  ];
  let subjectLearningStage = "insufficient_longitudinal_evidence";
  for (const st of STAGE_PRIORITY) {
    if ((learningStageRowCounts[st] || 0) > 0) {
      subjectLearningStage = st;
      break;
    }
  }
  const subjectLearningStageLabelHe =
    LEARNING_STAGE_LABEL_HE[subjectLearningStage] || LEARNING_STAGE_LABEL_HE.insufficient_longitudinal_evidence;

  const subjectRetentionRisk =
    maxRetentionRank >= 3 ? "high" : maxRetentionRank === 2 ? "moderate" : maxRetentionRank === 1 ? "low" : "unknown";

  let subjectTransferReadiness = "not_ready";
  if (minTransferScore === 99) subjectTransferReadiness = "not_ready";
  else if (minTransferScore === 3) subjectTransferReadiness = "ready";
  else if (minTransferScore === 2) subjectTransferReadiness = "emerging";
  else if (minTransferScore === 1) subjectTransferReadiness = "limited";
  else subjectTransferReadiness = "not_ready";

  if (subjectLearningStage === "fragile_retention" || subjectLearningStage === "regression_signal") {
    if (subjectTransferReadiness === "ready") subjectTransferReadiness = "limited";
  }

  const subjectMemoryNarrativeHe = `${subjectLearningStageLabelHe} in most lines - conservation: ${
    subjectRetentionRisk === "high"
      ? "Prefer repeated reinforcement before expanding."
      : subjectRetentionRisk === "moderate"
        ? "Worth watching before a major change."
        : "You can keep a steady pace and watch the results."
  }`.trim();

  let subjectReviewBeforeAdvanceHe = null;
  if (subjectRetentionRisk === "high" || subjectLearningStage === "fragile_retention" || subjectLearningStage === "regression_signal") {
    subjectReviewBeforeAdvanceHe =
      "Pause for a moment before advancing: repeat the same level with short sessions until accuracy stabilizes.";
  } else if (reviewBeforeAdvanceRowHints.length) {
    subjectReviewBeforeAdvanceHe = reviewBeforeAdvanceRowHints[0];
  } else if (subjectTransferReadiness === "limited" || subjectTransferReadiness === "not_ready") {
    subjectReviewBeforeAdvanceHe = "Make sure to repeat similar mistakes at the same level before opening a new topic.";
  }

  let subjectResponseToIntervention = "not_enough_evidence";
  const rtiSum = Object.values(rtiCounts).reduce((a, b) => a + b, 0);
  if (rtiSum > 0) {
    for (const id of RTI_SUBJECT_WORST_FIRST) {
      if ((rtiCounts[id] || 0) > 0) {
        subjectResponseToIntervention = id;
        break;
      }
    }
  }
  const subjectResponseToInterventionLabelHe =
    RESPONSE_TO_INTERVENTION_LABEL_HE[subjectResponseToIntervention] ||
    RESPONSE_TO_INTERVENTION_LABEL_HE.not_enough_evidence;
  const subjectSupportFit = subjectSupportFitAgg;
  const subjectSupportAdjustmentNeed = subjectSupportAdjustmentNeedAgg;
  const subjectSupportAdjustmentNeedHe =
    SUPPORT_ADJUSTMENT_NEED_LABEL_HE[subjectSupportAdjustmentNeed] ||
    SUPPORT_ADJUSTMENT_NEED_LABEL_HE.monitor_only;
  const subjectConclusionFreshness = subjectConclusionFreshnessAgg;
  const subjectRecalibrationNeed = subjectRecalibrationNeedAgg;
  const subjectRecalibrationNeedHe =
    RECALIBRATION_NEED_LABEL_HE[subjectRecalibrationNeed] || RECALIBRATION_NEED_LABEL_HE.none;
  const subLabAgg = SUBJECT_LABEL_HE[subjectId] || "the subject";
  const subjectEffectivenessNarrativeHe =
    `In ${subLabAgg}: ${subjectResponseToInterventionLabelHe}.` +
    (subjectRecalibrationNeed !== "none" ? subjectRecalibrationNeedHe : subjectSupportAdjustmentNeedHe);

  let subjectSupportSequenceState = "insufficient_sequence_evidence";
  const seqStateSum = Object.values(seqStateCounts).reduce((a, b) => a + b, 0);
  if (seqStateSum > 0) {
    for (const id of SEQ_STATE_WORST_FIRST) {
      if ((seqStateCounts[id] || 0) > 0) {
        subjectSupportSequenceState = id;
        break;
      }
    }
  }
  const subjectSupportSequenceStateLabelHe =
    SUPPORT_SEQUENCE_STATE_LABEL_HE[subjectSupportSequenceState] ||
    SUPPORT_SEQUENCE_STATE_LABEL_HE.insufficient_sequence_evidence;

  let subjectNextBestSequenceStep = "observe_before_next_cycle";
  const nbsSum = Object.values(nextBestStepCounts).reduce((a, b) => a + b, 0);
  if (nbsSum > 0) {
    for (const id of NEXT_BEST_STEP_WORST_FIRST) {
      if ((nextBestStepCounts[id] || 0) > 0) {
        subjectNextBestSequenceStep = id;
        break;
      }
    }
  }
  const subjectNextBestSequenceStepHe =
    NEXT_BEST_SEQUENCE_STEP_LABEL_HE[subjectNextBestSequenceStep] ||
    NEXT_BEST_SEQUENCE_STEP_LABEL_HE.observe_before_next_cycle;

  const subjectSequenceNarrativeHe =
    `In ${subLabAgg}: ${subjectSupportSequenceStateLabelHe}. ${subjectNextBestSequenceStepHe}` +
    (RECOMMENDATION_ROTATION_NEED_LABEL_HE[subjectRecommendationRotationNeedAgg] ||
      RECOMMENDATION_ROTATION_NEED_LABEL_HE.none);

  const priorSigEntries = Object.entries(priorSigCounts)
    .filter(([k]) => k && k !== "unknown")
    .sort((a, b) => b[1] - a[1]);
  const priorSigAll = Object.entries(priorSigCounts).sort((a, b) => b[1] - a[1]);
  let subjectPriorRecommendationSignature = "unknown";
  if (priorSigEntries.length) subjectPriorRecommendationSignature = priorSigEntries[0][0];
  else if (priorSigAll.length) subjectPriorRecommendationSignature = priorSigAll[0][0];

  let subjectExpectedVsObservedMatch = "not_enough_evidence";
  const mSum = Object.values(matchCounts).reduce((a, b) => a + b, 0);
  if (mSum > 0) {
    for (const id of MATCH_WORST_FIRST) {
      if ((matchCounts[id] || 0) > 0) {
        subjectExpectedVsObservedMatch = id;
        break;
      }
    }
  }

  let subjectFollowThroughSignal = "not_inferable";
  const fSum = Object.values(followCounts).reduce((a, b) => a + b, 0);
  if (fSum > 0) {
    for (const id of FOLLOW_WORST_FIRST) {
      if ((followCounts[id] || 0) > 0) {
        subjectFollowThroughSignal = id;
        break;
      }
    }
  }

  let subjectContinuationDecision = "continue_but_refine";
  const cSum = Object.values(continuationCounts).reduce((a, b) => a + b, 0);
  if (cSum > 0) {
    for (const id of CONTINUATION_WORST_FIRST) {
      if ((continuationCounts[id] || 0) > 0) {
        subjectContinuationDecision = id;
        break;
      }
    }
  }
  const subjectContinuationDecisionHe =
    RECOMMENDATION_CONTINUATION_DECISION_LABEL_HE[subjectContinuationDecision] ||
    RECOMMENDATION_CONTINUATION_DECISION_LABEL_HE.continue_but_refine;

  const subjectOutcomeNarrativeHe =
    `In ${subLabAgg}: ${RECOMMENDATION_MEMORY_STATE_LABEL_HE[subjectRecommendationMemoryState] || RECOMMENDATION_MEMORY_STATE_LABEL_HE.no_memory} ·` +
    `${PRIOR_RECOMMENDATION_SIGNATURE_LABEL_HE[subjectPriorRecommendationSignature] || PRIOR_RECOMMENDATION_SIGNATURE_LABEL_HE.unknown} · ` +
    `${EXPECTED_VS_OBSERVED_MATCH_LABEL_HE[subjectExpectedVsObservedMatch] || EXPECTED_VS_OBSERVED_MATCH_LABEL_HE.not_enough_evidence} · ` +
    `${FOLLOW_THROUGH_SIGNAL_LABEL_HE[subjectFollowThroughSignal] || FOLLOW_THROUGH_SIGNAL_LABEL_HE.not_inferable} · ` +
    subjectContinuationDecisionHe;

  let subjectGateState = "gates_not_ready";
  const gSum = Object.values(gateStateCounts).reduce((a, b) => a + b, 0);
  if (gSum > 0) {
    for (const id of GATE_STATE_PRIORITY) {
      if ((gateStateCounts[id] || 0) > 0) {
        subjectGateState = id;
        break;
      }
    }
  }
  const subjectGateStateLabelHe = GATE_STATE_LABEL_HE[subjectGateState] || GATE_STATE_LABEL_HE.gates_not_ready;

  let subjectGateReadiness = "insufficient";
  const rSum = Object.values(readinessCounts).reduce((a, b) => a + b, 0);
  if (rSum > 0) {
    for (const id of READINESS_WORST) {
      if ((readinessCounts[id] || 0) > 0) {
        subjectGateReadiness = id;
        break;
      }
    }
  }

  let subjectNextCycleDecisionFocus = "prove_current_direction";
  const nfSum = Object.values(nextFocusCounts).reduce((a, b) => a + b, 0);
  if (nfSum > 0) {
    for (const id of [
      "refresh_baseline_before_decision",
      "test_if_path_is_working",
      "stabilize_before_advance",
      "check_independence_before_release",
      "prepare_for_controlled_release",
      "prove_current_direction",
    ]) {
      if ((nextFocusCounts[id] || 0) > 0) {
        subjectNextCycleDecisionFocus = id;
        break;
      }
    }
  }
  const subjectNextCycleDecisionFocusHe =
    NEXT_CYCLE_DECISION_FOCUS_LABEL_HE[subjectNextCycleDecisionFocus] ||
    NEXT_CYCLE_DECISION_FOCUS_LABEL_HE.prove_current_direction;

  let subjectEvidenceTargetType = "mixed_target";
  const tSum = Object.values(targetTypeCounts).reduce((a, b) => a + b, 0);
  if (tSum > 0) {
    for (const id of TARGET_TYPE_PRIORITY) {
      if ((targetTypeCounts[id] || 0) > 0) {
        subjectEvidenceTargetType = id;
        break;
      }
    }
  }

  let subjectTargetObservationWindow = "unknown";
  const wSum = Object.values(windowCounts).reduce((a, b) => a + b, 0);
  if (wSum > 0) {
    for (const id of WINDOW_PRIORITY) {
      if ((windowCounts[id] || 0) > 0) {
        subjectTargetObservationWindow = id;
        break;
      }
    }
  }

  const subjectGateNarrativeHe =
    `In ${subLabAgg}: ${subjectGateStateLabelHe} · ${subjectNextCycleDecisionFocusHe} ·` +
    `${TARGET_EVIDENCE_TYPE_LABEL_HE[subjectEvidenceTargetType] || TARGET_EVIDENCE_TYPE_LABEL_HE.mixed_target} · ` +
    `${TARGET_OBSERVATION_WINDOW_LABEL_HE[subjectTargetObservationWindow] || TARGET_OBSERVATION_WINDOW_LABEL_HE.unknown}`;

  const DEP_SUBJ_PRIORITY = [
    "likely_foundational_block",
    "mixed_dependency_signal",
    "insufficient_dependency_evidence",
    "likely_local_issue",
  ];
  let subjectDependencyState = "insufficient_dependency_evidence";
  const depStateSum = Object.values(depStateCounts).reduce((a, b) => a + b, 0);
  if (depStateSum > 0) {
    for (const id of DEP_SUBJ_PRIORITY) {
      if ((depStateCounts[id] || 0) > 0) {
        subjectDependencyState = id;
        break;
      }
    }
  }
  const nDepFound = depStateCounts.likely_foundational_block || 0;
  const nDepLocal = depStateCounts.likely_local_issue || 0;
  if (rows.length >= 4 && nDepFound === 1 && stableMasteryRowCount >= 2 && fragileSuccessRowCount <= 1) {
    subjectDependencyState = "likely_local_issue";
  }
  if (rows.length >= 3 && nDepLocal >= rows.length - 1 && nDepFound === 0) {
    subjectDependencyState = "likely_local_issue";
  }

  const BLOCK_SUBJ_PRIORITY = [
    "retention_instability",
    "independence_readiness_gap",
    "accuracy_foundation_gap",
    "instruction_language_load",
    "procedure_automaticity_gap",
    "unknown",
  ];
  let subjectLikelyFoundationalBlocker = "unknown";
  const blkSum = Object.values(blockerRowCounts).reduce((a, b) => a + b, 0);
  if (blkSum > 0) {
    for (const id of BLOCK_SUBJ_PRIORITY) {
      if ((blockerRowCounts[id] || 0) > 0) {
        subjectLikelyFoundationalBlocker = id;
        break;
      }
    }
  }

  let subjectDownstreamSymptomRisk = "unknown";
  if (worstDownstreamRank >= 3) subjectDownstreamSymptomRisk = "high";
  else if (worstDownstreamRank === 2) subjectDownstreamSymptomRisk = "moderate";
  else if (worstDownstreamRank === 1) subjectDownstreamSymptomRisk = "low";

  const subjectFoundationFirstPriority =
    subjectDependencyState === "likely_foundational_block" ||
    (subjectDependencyState === "mixed_dependency_signal" && foundationHeavyRows >= 1);
  const subjectFoundationFirstPriorityHe = subjectFoundationFirstPriority
    ? "It is better to first establish a short foundation in this profession - and only then expand."
    : "You can stay with focused or easy practice at the same time - without expanding into an unnecessarily broad story.";

  const subjectDependencyStateLabelHe =
    DEPENDENCY_STATE_LABEL_HE[subjectDependencyState] || DEPENDENCY_STATE_LABEL_HE.insufficient_dependency_evidence;
  const subjectLikelyFoundationalBlockerLabelHe =
    FOUNDATIONAL_BLOCKER_LABEL_HE[subjectLikelyFoundationalBlocker] || FOUNDATIONAL_BLOCKER_LABEL_HE.unknown;

  const subjectDependencyNarrativeHe =
    `In ${subLabAgg}: ${subjectDependencyStateLabelHe} · ${subjectLikelyFoundationalBlockerLabelHe} · ${subjectFoundationFirstPriorityHe}`;

  return {
    dominantLearningRisk,
    dominantSuccessPattern,
    trendNarrativeHe,
    confidenceSummaryHe,
    recommendedHomeMethodHe,
    whatNotToDoHe,
    majorRiskFlagsAcrossRows: riskOr,
    dominantBehaviorProfileAcrossRows: Object.keys(behaviorCounts).sort(
      (a, b) => (behaviorCounts[b] || 0) - (behaviorCounts[a] || 0)
    )[0] || "undetermined",
    strongestPositiveTrendRowHe: bestPositive
      ? normalizeParentFacingHe(`${bestPositive.labelHe}: ${bestPositive.summaryHe}`)
      : null,
    strongestCautionTrendRowHe: worstCaution
      ? normalizeParentFacingHe(`${worstCaution.labelHe}: ${worstCaution.summaryHe}`)
      : null,
    fragileSuccessRowCount,
    stableMasteryRowCount,
    modeConcentrationNoteHe,
    dominantLearningRiskLabelHe: normalizeParentFacingHe(
      riskLabelHe[dominantLearningRisk] || String(dominantLearningRisk || "")
    ),
    dominantSuccessPatternLabelHe: normalizeParentFacingHe(
      successLabelHe[dominantSuccessPattern] || String(dominantSuccessPattern || "")
    ),
    improvingButSupportedHe,
    dominantRootCause,
    dominantRootCauseLabelHe,
    secondaryRootCause,
    rootCauseDistribution: { ...rootCauseRowCounts },
    subjectDiagnosticRestraintHe,
    subjectConclusionReadiness,
    subjectInterventionPriorityHe,
    ...priorityFields,
    dominantMistakePattern,
    dominantMistakePatternLabelHe,
    mistakePatternDistribution: { ...mistakePatternRowCounts },
    subjectLearningStage,
    subjectLearningStageLabelHe,
    subjectRetentionRisk,
    subjectTransferReadiness,
    subjectMemoryNarrativeHe,
    subjectReviewBeforeAdvanceHe,
    subjectResponseToIntervention,
    subjectResponseToInterventionLabelHe,
    subjectSupportFit,
    subjectSupportAdjustmentNeed,
    subjectSupportAdjustmentNeedHe,
    subjectConclusionFreshness,
    subjectRecalibrationNeed,
    subjectRecalibrationNeedHe,
    subjectEffectivenessNarrativeHe,
    subjectSupportSequenceState,
    subjectSupportSequenceStateLabelHe,
    subjectStrategyRepetitionRisk: subjectStrategyRepetitionRiskAgg,
    subjectStrategyFatigueRisk: subjectStrategyFatigueRiskAgg,
    subjectNextBestSequenceStep,
    subjectNextBestSequenceStepHe,
    subjectAdviceNovelty: subjectAdviceNoveltyAgg,
    subjectRecommendationRotationNeed: subjectRecommendationRotationNeedAgg,
    subjectSequenceNarrativeHe,
    subjectRecommendationMemoryState,
    subjectPriorRecommendationSignature,
    subjectSupportHistoryDepth,
    subjectRecommendationCarryover,
    subjectExpectedVsObservedMatch,
    subjectFollowThroughSignal,
    subjectContinuationDecision,
    subjectContinuationDecisionHe,
    subjectOutcomeNarrativeHe,
    subjectGateState,
    subjectGateStateLabelHe,
    subjectGateReadiness,
    subjectNextCycleDecisionFocus,
    subjectNextCycleDecisionFocusHe,
    subjectEvidenceTargetType,
    subjectTargetObservationWindow,
    subjectGateNarrativeHe,
    subjectDependencyState,
    subjectDependencyStateLabelHe,
    subjectLikelyFoundationalBlocker,
    subjectLikelyFoundationalBlockerLabelHe,
    subjectDownstreamSymptomRisk,
    subjectFoundationFirstPriority,
    subjectFoundationFirstPriorityHe,
    subjectDependencyNarrativeHe,
  };
}

/**
 * @param {Record<string, unknown>} report
 * @param {Record<string, unknown[]>} [rawMistakesBySubject]
 */
export function analyzeLearningPatterns(report, rawMistakesBySubject = {}) {
  if (report?.mathOperations && typeof report.mathOperations === "object") {
    applyMathScopedParentDisplayNames(report.mathOperations);
  }
  const out = {
    version: 2,
    generatedAt: new Date().toISOString(),
    constants: {
      minMistakesPerPatternFamily: MIN_PATTERN_FAMILY_FOR_DIAGNOSIS,
      minMistakesForStrongRecommendation: MIN_MISTAKES_FOR_STRONG_RECOMMENDATION,
      maxWeaknesses: MAX_TOP_WEAKNESSES,
      maxStrengthRows: MAX_TOP_STRENGTHS,
      maxMaintain: MAX_MAINTAIN,
      maxImproving: MAX_IMPROVING,
      maxStableExcellence: MAX_STABLE_EXCELLENCE,
      stableExcellenceMinAccuracy: STABLE_EXCELLENCE_MIN_ACCURACY,
      stableExcellenceMinQuestions: STABLE_EXCELLENCE_MIN_QUESTIONS,
    },
    subjects: {},
  };

  if (!report || typeof report !== "object") return out;

  for (const sid of SUBJECT_IDS) {
    const rawList = Array.isArray(rawMistakesBySubject[sid])
      ? rawMistakesBySubject[sid]
      : [];
    const events = rawList.map((r) => normalizeMistakeEvent(r, sid));
    const wrong = events.filter((e) => !e.isCorrect);

    const clusters = {};
    wrong.forEach((ev) => {
      const key = mistakePatternClusterKey(ev);
      if (!clusters[key]) clusters[key] = [];
      clusters[key].push(ev);
    });

    const weaknessCandidates = [];
    const insufficientData = [];

    Object.entries(clusters).forEach(([, list]) => {
      const n = list.length;
      if (n < MIN_PATTERN_FAMILY_FOR_DIAGNOSIS) {
        if (insufficientData.length < 24) {
          insufficientData.push({
            mistakeCount: n,
            note: "Less than 5 mistakes in the same pattern - it is still too early to determine a recurring difficulty",
          });
        }
        return;
      }
      const sample = list[list.length - 1];
      const labelHe = weaknessLabelHe(sid, sample);
      const rs = recStrength(n);
      weaknessCandidates.push({
        labelHe,
        mistakeCount: n,
        confidence: rs === "strong" ? "high" : "moderate",
        sampleEvent: sample,
      });
    });

    weaknessCandidates.sort((a, b) => b.mistakeCount - a.mistakeCount);
    const topWeaknessesPre = weaknessCandidates.slice(0, MAX_TOP_WEAKNESSES).map((w, i) => {
      const lab = w.labelHe || GENERIC_WEAKNESS_HE;
      return {
        id: `${sid}:w:${i}`,
        labelHe: lab,
        mistakeCount: w.mistakeCount,
        confidence: w.confidence,
        tierHe: weaknessTierHe(lab, w.mistakeCount, w.confidence),
      };
    });

    const {
      stableExcellence,
      excellent,
      strengths,
      maintain,
      improving,
      topStrengths,
    } = buildSessionBands(sid, report);

    const {
      topWeaknesses,
      parentTopicToneByKey,
      parentStrengthWithCautionLinesByKey,
    } = reconcileParentFacingTopicSignals(sid, report, weaknessCandidates, topWeaknessesPre);

    const weaknesses = topWeaknesses.map((w) => ({ ...w }));

    const studentRecommendationsImprove = [];
    const studentRecommendationsMaintain = [];
    const parentRecommendationsImprove = [];
    const parentRecommendationsMaintain = [];

    for (const w of topWeaknesses.slice(0, 2)) {
      const rs = recStrength(w.mistakeCount);
      studentRecommendationsImprove.push({
        id: `stu-imp:${w.id}`,
        textHe: `You should practice a little more ${parentCopyTopicPhraseForFocusHe(w.labelHe)} - ${w.mistakeCount} similar mistakes were recorded in the selected period. We stay with focused practice and not with "trying to fix everything at once".`,
        strength: rs,
      });
    }

    const w0 = topWeaknesses[0];
    if (w0) {
      const rs = recStrength(w0.mistakeCount);
      parentRecommendationsImprove.push({
        id: `par-imp:${w0.id}`,
        textHe:
          rs === "strong"
            ? `The same error repeats - ${parentCopyTopicPhraseHe(w0.labelHe)}. It's not an emergency, but it's worth taking care of. It is recommended to sit together on one example and go through it aloud step by step.`
            : `A repetition of the same type of error begins - ${parentCopyTopicPhraseHe(w0.labelHe)}. For the coming week, a calm look and a short, focused practice are enough.`,
        strength: rs,
      });
    }

    const topPositive =
      stableExcellence[0] || topStrengths[0] || excellent[0] || strengths[0];
    if (topPositive) {
      const rs =
        topPositive.confidence === "high" || topPositive.questions >= 18
          ? "strong"
          : "moderate";
      studentRecommendationsMaintain.push({
        id: `stu-maint:${topPositive.id}`,
        textHe: `Continue to practice comfortably on the topic ${topPositive.labelHe} - the level there is maintained (accuracy about ${topPositive.accuracy}%).`,
        strength: rs,
      });
      parentRecommendationsMaintain.push({
        id: `par-maint:${topPositive.id}`,
        textHe: `It is recommended to encourage persistence in the subject ${topPositive.labelHe} - you see repeated success; Maintaining a positive habit is just as important as correcting mistakes.`,
        strength: rs,
      });
    }

    let diagnosticSparseNoteHe = null;
    if (!topWeaknesses.length && wrong.length > 0) {
      diagnosticSparseNoteHe =
        "There are individual mistakes but without a pattern that repeats enough times - it is still not possible to determine a recurring difficulty.";
      if (!parentRecommendationsImprove.length) {
        parentRecommendationsImprove.push({
          id: `par-imp:${sid}:sparse`,
          textHe: diagnosticSparseNoteHe,
          strength: "tentative",
        });
      }
    }

    let evidenceMistake = null;
    const wTopMatched =
      weaknessCandidates.find((c) =>
        topWeaknesses.some((w) => w.labelHe === c.labelHe && w.mistakeCount === c.mistakeCount)
      ) || null;
    if (wTopMatched && wTopMatched.sampleEvent) {
      evidenceMistake = buildEvidenceMistakeFromEvent(
        wTopMatched.sampleEvent,
        wTopMatched.confidence
      );
    }

    const evidenceSuccess = buildEvidenceSuccessFromPick(
      stableExcellence[0] || topStrengths[0]
    );
    const evidenceExamples = buildEvidenceExamples(evidenceMistake, evidenceSuccess);

    const summaryHe = buildSummaryHe(
      SUBJECT_LABEL_HE[sid],
      stableExcellence,
      topStrengths,
      topWeaknesses,
      maintain,
      improving,
      wrong.length,
      events.length,
      diagnosticSparseNoteHe
    );

    let parentActionHe = buildParentActionHe(
      SUBJECT_LABEL_HE[sid],
      topWeaknesses,
      improving,
      maintain,
      topStrengths
    );
    parentActionHe = mergeParentActionWithCautionBlocks(
      parentActionHe,
      parentStrengthWithCautionLinesByKey
    );

    const nextWeekGoalHe = buildNextWeekGoalHe(
      SUBJECT_LABEL_HE[sid],
      topWeaknesses,
      improving,
      topStrengths,
      maintain,
      stableExcellence
    );

    const diagnosticSectionsHe = buildDiagnosticSectionsHe({
      stableExcellence,
      topStrengths,
      maintain,
      improving,
      topWeaknesses,
      insufficientData,
      diagnosticSparseNoteHe,
      parentActionHe,
      nextWeekGoalHe,
    });
    const subSkillInsightsHe = buildSubSkillInsightsHe(topWeaknesses);

    const phase3Subject = synthesizeSubjectPhase3FromRows(sid, report);

    const hasAnySignal =
      stableExcellence.length > 0 ||
      topWeaknesses.length > 0 ||
      topStrengths.length > 0 ||
      maintain.length > 0 ||
      improving.length > 0 ||
      studentRecommendationsImprove.length > 0 ||
      studentRecommendationsMaintain.length > 0 ||
      parentRecommendationsImprove.length > 0 ||
      parentRecommendationsMaintain.length > 0 ||
      evidenceMistake != null ||
      evidenceSuccess != null ||
      !!summaryHe;

    out.subjects[sid] = {
      subject: sid,
      subjectLabelHe: SUBJECT_LABEL_HE[sid],
      mistakeEventCount: events.length,
      wrongCount: wrong.length,
      hasAnySignal,
      summaryHe,
      topStrengths,
      topWeaknesses,
      parentTopicToneByKey,
      parentStrengthWithCautionLinesByKey,
      parentActionHe,
      nextWeekGoalHe,
      evidenceExamples,
      weaknesses,
      strengths,
      stableExcellence,
      excellent,
      maintain,
      improving,
      studentRecommendationsImprove,
      studentRecommendationsMaintain,
      parentRecommendationsImprove,
      parentRecommendationsMaintain,
      evidenceMistake,
      evidenceSuccess,
      insufficientData,
      diagnosticSparseNoteHe,
      diagnosticSectionsHe,
      subSkillInsightsHe,
      ...phase3Subject,
    };
  }

  return out;
}

/** Static example following the version 2 structure */
export const EXAMPLE_PATTERN_DIAGNOSTICS_PAYLOAD = {
  version: 2,
  generatedAt: "2026-04-11T12:00:00.000Z",
  constants: {
    minMistakesPerPatternFamily: 5,
    minMistakesForStrongRecommendation: 10,
    maxWeaknesses: 3,
    maxStrengthRows: 3,
    maxMaintain: 2,
    maxImproving: 2,
    maxStableExcellence: 3,
    stableExcellenceMinAccuracy: 92,
    stableExcellenceMinQuestions: 22,
  },
  subjects: {
    math: {
      subject: "math",
      subjectLabelHe: "Math",
      mistakeEventCount: 12,
      wrongCount: 12,
      hasAnySignal: true,
      summaryHe:
        "The picture of the subject in mathematics: the child succeeds in composition over time. There is also room for reinforcement in comparing quantities or numbers.",
      stableExcellence: [
        {
          id: "math:addition:learning",
          labelHe: "Addition",
          questions: 42,
          accuracy: 93,
          confidence: "high",
          needsPractice: false,
          excellent: true,
          tierHe: "Your child is doing well on this topic over time",
        },
      ],
      topStrengths: [],
      topWeaknesses: [
        {
          id: "math:w:0",
          labelHe: "Difficulty comparing quantities or numbers",
          mistakeCount: 7,
          confidence: "moderate",
          tierHe: "Focused difficulty",
        },
      ],
      parentTopicToneByKey: {},
      parentStrengthWithCautionLinesByKey: {},
      parentActionHe:
        "Three times a week, 15-20 minutes each session: choose one math task on the subject of comparing quantities or numbers - read the formulation together, formulate out loud what is given and what is requested, perform a first step on a draft sheet and only then write a final answer and check against the solution.",
      nextWeekGoalHe:
        "Target for reinforcement: increase the percentage of success in comparing quantities or numbers (at least one more successful attempt than last week). Goal for retention: continue a relaxed practice routine on composition to maintain the level of accuracy.",
      evidenceExamples: [
        {
          type: "mistake",
          exerciseText: "How many bags is the price of the computer higher?",
          questionLabel: null,
          correctAnswer: 120,
          userAnswer: 102,
          confidence: "moderate",
        },
        {
          type: "success",
          titleHe: "What your child is doing well in practice",
          bodyHe:
            "In the subject of essay there is good success in the selected period: about 93% correct out of 42 questions.",
          confidence: "high",
        },
      ],
      weaknesses: [
        {
          id: "math:w:0",
          labelHe: "Difficulty comparing quantities or numbers",
          mistakeCount: 7,
          confidence: "moderate",
          tierHe: "Focused difficulty",
        },
      ],
      strengths: [],
      excellent: [],
      maintain: [],
      improving: [],
      studentRecommendationsImprove: [
        {
          id: "stu-imp:math:w:0",
          textHe:
            "You should practice a little more on the subject: when comparing quantities or numbers - 7 similar mistakes were recorded in the selected period. We stay with focused practice and not with \"trying to fix everything at once\".",
          strength: "moderate",
        },
      ],
      studentRecommendationsMaintain: [
        {
          id: "stu-maint:math:addition:learning",
          textHe:
            "Continue practicing comfortably on the topic of connection - the level there is maintained (accuracy about 93%).",
          strength: "strong",
        },
      ],
      parentRecommendationsImprove: [
        {
          id: "par-imp:math:w:0",
          textHe:
            "A repetition of the same type of error begins - in the subject of comparing quantities or numbers. For the coming week, a calm look and a short, focused practice are enough.",
          strength: "moderate",
        },
      ],
      parentRecommendationsMaintain: [
        {
          id: "par-maint:math:addition:learning",
          textHe:
            "It is recommended to encourage persistence in connection - you see repeated success; Maintaining a positive habit is just as important as correcting mistakes.",
          strength: "strong",
        },
      ],
      evidenceMistake: {
        exerciseText: "How many bags is the price of the computer higher?",
        questionLabel: null,
        correctAnswer: 120,
        userAnswer: 102,
        confidence: "moderate",
      },
      evidenceSuccess: {
        titleHe: "What your child is doing well in practice",
        bodyHe:
          "In the subject of essay there is good success in the selected period: about 93% correct out of 42 questions.",
        confidence: "high",
      },
      insufficientData: [
        {
          mistakeCount: 2,
          note: "Less than 5 mistakes in the same pattern - it is still too early to determine a recurring difficulty",
        },
      ],
      diagnosticSparseNoteHe: null,
    },
    geometry: {
      subject: "geometry",
      subjectLabelHe: "Geometry",
      mistakeEventCount: 9,
      wrongCount: 9,
      hasAnySignal: true,
      summaryHe:
        "The image of the profession in geometry: there is also room for strengthening on the issue of recurring confusion between perimeter and area.",
      topStrengths: [],
      stableExcellence: [],
      topWeaknesses: [
        {
          id: "geometry:w:0",
          labelHe: "Repeated confusion between perimeter and area",
          mistakeCount: 6,
          confidence: "moderate",
          tierHe: "Focused difficulty",
        },
      ],
      parentActionHe:
        "Three times a week, 15-20 minutes each session: choose one task in geometry on the topic of repeated confusion between perimeter and area - read the formulation together, formulate out loud what is given and what is requested, make a first step on a draft sheet and only then write a final answer and check against the solution.",
      nextWeekGoalHe:
        "Target for reinforcement: increase the percentage of success in repeated confusion between scope and area (at least one more successful attempt than last week).",
      evidenceExamples: [
        {
          type: "mistake",
          exerciseText: "What is the perimeter of a 5x3 cm rectangle?",
          questionLabel: null,
          correctAnswer: "16 cm",
          userAnswer: "15 cm",
          confidence: "moderate",
        },
      ],
      weaknesses: [
        {
          id: "geometry:w:0",
          labelHe: "Repeated confusion between perimeter and area",
          mistakeCount: 6,
          confidence: "moderate",
          tierHe: "Focused difficulty",
        },
      ],
      strengths: [],
      excellent: [],
      maintain: [],
      improving: [],
      studentRecommendationsImprove: [
        {
          id: "stu-imp:geometry:w:0",
          textHe:
            "You should practice a little more on the subject: repeated confusion between scope and area - 6 similar mistakes were recorded in the selected period. We stay with focused practice and not with \"trying to fix everything at once\".",
          strength: "moderate",
        },
      ],
      studentRecommendationsMaintain: [],
      parentRecommendationsImprove: [
        {
          id: "par-imp:geometry:w:0",
          textHe:
            "A repetition of the same type of error begins - on the topic of repeated confusion between scope and area. For the coming week, a calm look and a short, focused practice are enough.",
          strength: "moderate",
        },
      ],
      parentRecommendationsMaintain: [],
      evidenceMistake: {
        exerciseText: "What is the perimeter of a 5x3 cm rectangle?",
        questionLabel: null,
        correctAnswer: "16 cm",
        userAnswer: "15 cm",
        confidence: "moderate",
      },
      evidenceSuccess: null,
      insufficientData: [],
      diagnosticSparseNoteHe: null,
    },
    english: {
      subject: "english",
      subjectLabelHe: "English",
      mistakeEventCount: 0,
      wrongCount: 0,
      hasAnySignal: false,
      summaryHe: null,
      topStrengths: [],
      stableExcellence: [],
      topWeaknesses: [],
      parentActionHe: null,
      nextWeekGoalHe: null,
      evidenceExamples: [],
      weaknesses: [],
      strengths: [],
      excellent: [],
      maintain: [],
      improving: [],
      studentRecommendationsImprove: [],
      studentRecommendationsMaintain: [],
      parentRecommendationsImprove: [],
      parentRecommendationsMaintain: [],
      evidenceMistake: null,
      evidenceSuccess: null,
      insufficientData: [],
      diagnosticSparseNoteHe: null,
    },
    science: {
      subject: "science",
      subjectLabelHe: "Science",
      mistakeEventCount: 0,
      wrongCount: 0,
      hasAnySignal: false,
      summaryHe: null,
      topStrengths: [],
      stableExcellence: [],
      topWeaknesses: [],
      parentActionHe: null,
      nextWeekGoalHe: null,
      evidenceExamples: [],
      weaknesses: [],
      strengths: [],
      excellent: [],
      maintain: [],
      improving: [],
      studentRecommendationsImprove: [],
      studentRecommendationsMaintain: [],
      parentRecommendationsImprove: [],
      parentRecommendationsMaintain: [],
      evidenceMistake: null,
      evidenceSuccess: null,
      insufficientData: [],
      diagnosticSparseNoteHe: null,
    },
    hebrew: {
      subject: "hebrew",
      subjectLabelHe: "Hebrew",
      mistakeEventCount: 11,
      wrongCount: 11,
      hasAnySignal: true,
      summaryHe:
        "The image of the profession in Hebrew: there is also room for reinforcement in prepositions and sentence structure.",
      topStrengths: [],
      stableExcellence: [],
      topWeaknesses: [
        {
          id: "hebrew:w:0",
          labelHe: "Difficulty with prepositions and sentence structure",
          mistakeCount: 6,
          confidence: "moderate",
          tierHe: "Focused difficulty",
        },
      ],
      parentActionHe:
        "Three times a week, 15-20 minutes in each session: choose one task in Hebrew on the topic with prepositions and sentence structure - read the wording together, formulate out loud what is given and what is requested, take the first step on a draft sheet and only then write a final answer and check against the solution.",
      nextWeekGoalHe:
        "Target for reinforcement: increase the percentage of success in prepositions and sentence structure (at least one more successful attempt than last week).",
      evidenceExamples: [
        {
          type: "mistake",
          exerciseText: "Complete: The children played ___ the time in kindergarten.",
          questionLabel: null,
          correctAnswer: "on",
          userAnswer: "to",
          confidence: "moderate",
        },
      ],
      weaknesses: [
        {
          id: "hebrew:w:0",
          labelHe: "Difficulty with prepositions and sentence structure",
          mistakeCount: 6,
          confidence: "moderate",
          tierHe: "Focused difficulty",
        },
      ],
      strengths: [],
      excellent: [],
      maintain: [],
      improving: [],
      studentRecommendationsImprove: [
        {
          id: "stu-imp:hebrew:w:0",
          textHe:
            "You should practice a little more on the subject: in prepositions and sentence structure - 6 similar mistakes were recorded in the selected period. We stay with focused practice and not with \"trying to fix everything at once\".",
          strength: "moderate",
        },
      ],
      studentRecommendationsMaintain: [],
      parentRecommendationsImprove: [
        {
          id: "par-imp:hebrew:w:0",
          textHe:
            "A repetition of the same type of error begins - on the subject in prepositions and sentence structure. For the coming week, a calm look and a short, focused practice are enough.",
          strength: "moderate",
        },
      ],
      parentRecommendationsMaintain: [],
      evidenceMistake: {
        exerciseText: "Complete: The children played ___ the time in kindergarten.",
        questionLabel: null,
        correctAnswer: "on",
        userAnswer: "to",
        confidence: "moderate",
      },
      evidenceSuccess: null,
      insufficientData: [
        {
          mistakeCount: 3,
          note: "Less than 5 mistakes in the same pattern - it is still too early to determine a recurring difficulty",
        },
      ],
      diagnosticSparseNoteHe: null,
    },
    "moledet-geography": {
      subject: "moledet-geography",
      subjectLabelHe: "Homeland & Geography",
      mistakeEventCount: 0,
      wrongCount: 0,
      hasAnySignal: false,
      summaryHe: null,
      topStrengths: [],
      stableExcellence: [],
      topWeaknesses: [],
      parentActionHe: null,
      nextWeekGoalHe: null,
      evidenceExamples: [],
      weaknesses: [],
      strengths: [],
      excellent: [],
      maintain: [],
      improving: [],
      studentRecommendationsImprove: [],
      studentRecommendationsMaintain: [],
      parentRecommendationsImprove: [],
      parentRecommendationsMaintain: [],
      evidenceMistake: null,
      evidenceSuccess: null,
      insufficientData: [],
      diagnosticSparseNoteHe: null,
    },
  },
};
