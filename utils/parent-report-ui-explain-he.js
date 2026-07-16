/**
 * Parent-facing display labels — short/detailed report (UI display phase only).
 * Maps technical ids to short text; does not invent pedagogical content.
 */

import { normalizeParentFacingHe } from "./parent-report-language/parent-facing-normalize.js";
import { SUBJECT_V2_RECALIBRATION_NEED_NO_HE } from "./parent-report-language/v2-parent-copy.js";
import { narrativeSectionTextHe } from "./contracts/narrative-contract-v1.js";
import { stripKnownParentReportLeakageHe } from "./parent-data-presence.js";
import { buildEngineDecisionParentTopicCopyHe, buildExplainIdentifiedLineHe, PARENT_TECHNICAL_ID_STRIP_RE } from "./parent-report-language/engine-decision-parent-copy-he.js";
import {
  DEPENDENCY_STATE_PARENT_HE,
  MISTAKE_PATTERN_PARENT_HE,
  PARENT_DIAGNOSTIC_TYPE_LABEL_HE,
  ROOT_CAUSE_PARENT_HE,
  explainActionHe,
  explainDataHe,
  explainIdentifiedHe,
  explainMeaningHe,
  explainPatternHe,
  foundationTextFromEngineHe,
  meaningExplainSentenceHe,
  parentDiagnosticTypeLabelHe,
  parentStepLabelHe,
  patternTextFromEngineHe,
} from "./parent-report-language/parent-report-hebrew-copy-spec.js";

const BEHAVIOR_OR_DIAGNOSTIC_HE = { ...PARENT_DIAGNOSTIC_TYPE_LABEL_HE };

const CONF_BADGE_HE = {
  high: "Enough questions in this period",
  medium: "A moderate number of questions in this period",
  low: "Still limited data - a bit more practice will help us understand better",
};

const SUFF_BADGE_HE = {
  high: "Amount of practice: good",
  medium: "Amount of practice: moderate",
  low: "Amount of practice: low",
};

const RISK_FLAG_HE = {
  falsePromotionRisk: "Risk of moving up a level too early",
  falseRemediationRisk: "Risk of over-treating",
  speedOnlyRisk: "Tendency toward speed",
  hintDependenceRisk: "The child still relies on hints",
  insufficientEvidenceRisk: "Only partial information",
  recentTransitionRisk: "A small recent change",
};

const TREND_DIR_HE = {
  up: "Improving",
  down: "Declining",
  flat: "No change",
  unknown: "Not clear enough",
};

/**
 * @param {string} text
 * @param {number} max
 */
export function truncateHe(text, max = 140) {
  const s = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return "";
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1))}…`;
}

/**
 * Replaces technical identifiers in engine-sourced text (e.g. behavior profile).
 * @param {string} text
 */
export function sanitizeEngineSnippetHe(text) {
  let s = String(text || "");
  for (const [k, v] of Object.entries(BEHAVIOR_OR_DIAGNOSTIC_HE)) {
    s = s.replace(new RegExp(`\\b${k}\\b`, "g"), v);
  }
  s = s.replace(/\b(falsePromotionRisk|falseRemediationRisk|speedOnlyRisk|hintDependenceRisk|insufficientEvidenceRisk|recentTransitionRisk)\b/g, "");
  s = s.replace(PARENT_TECHNICAL_ID_STRIP_RE, "");
  s = s.replace(/\s{2,}/g, " ").trim();
  return stripKnownParentReportLeakageHe(s);
}

/** Removes technical parentheses from visible text in the diagnostics/recommendations area (short report). */
export function stripTechnicalParensForParentDiagnosticsHe(text) {
  return String(text || "")
    .replace(/\(pf:[^)]*\)/gi, "")
    .replace(/\(k:[^)]*\)/gi, "")
    .replace(/\(to:[^)]*\)/gi, "")
    .replace(/\(st:[^)]*\)/gi, "")
    .replace(/\(ct:[^)]*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * PR1 — visible text in the short report (diagnostics printout).
 * @param {unknown} s
 */
export function shortReportDiagnosticsParentVisibleHe(s) {
  let t = stripTechnicalParensForParentDiagnosticsHe(String(s ?? ""));
  t = sanitizeEngineSnippetHe(t);
  t = t.replace(/\u0001/g, " ");
  t = t.replace(/\bdefault_[a-z0-9_]+\b/gi, "");
  t = t.replace(
    /\b(advance_level|advance_grade_topic_only|maintain_and_strengthen|remediate_same_level|drop_one_level_topic_only|drop_one_grade_topic_only)\b/g,
    ""
  );
  t = t.replace(/\b(no_memory|light_memory|not_enough_evidence)\b/gi, "");
  // Strip long snake_case engine tokens only — never plain English words like "information".
  t = t.replace(/\b[a-z][a-z0-9]*_[a-z0-9_]{2,}\b/gi, "");
  t = t.replace(/\s{2,}/g, " ").trim();
  return normalizeParentFacingHe(stripKnownParentReportLeakageHe(t));
}

export function diagnosticTypeLabelHe(id) {
  return parentDiagnosticTypeLabelHe(String(id || "").trim());
}

export function behaviorDominantLabelHe(id) {
  return diagnosticTypeLabelHe(id);
}

export function confidenceBadgeLabelHe(badge) {
  const b = String(badge || "").toLowerCase();
  return CONF_BADGE_HE[b] || CONF_BADGE_HE.medium;
}

export function sufficiencyBadgeLabelHe(badge) {
  const b = String(badge || "").toLowerCase();
  return SUFF_BADGE_HE[b] || SUFF_BADGE_HE.medium;
}

/**
 * @param {Record<string, boolean>|null|undefined} riskFlags
 * @param {number} maxLabels
 */
export function activeRiskFlagLabelsHe(riskFlags, maxLabels = 4) {
  if (!riskFlags || typeof riskFlags !== "object") return [];
  const out = [];
  for (const [key, val] of Object.entries(riskFlags)) {
    if (!val) continue;
    const lab = RISK_FLAG_HE[key];
    if (lab) out.push(lab);
    if (out.length >= maxLabels) break;
  }
  return out;
}

const TREND_ACCURACY_FULL_HE = Object.freeze({
  up: "There's an improving trend over the recent period.",
  down: "There's a decline in performance over the recent period, so short, focused practice would help.",
  flat: "Results aren't consistent right now - there are good answers alongside mistakes, so it helps to keep following this topic.",
  unknown: "There still isn't enough practice to determine a clear trend.",
});

/**
 * Short trend line — prefers the engine's summaryHe.
 * @param {Record<string, unknown>|null|undefined} trend
 */
export function trendCompactLineHe(trend) {
  const t = trend && typeof trend === "object" ? trend : null;
  if (!t) return "";
  const sumRaw = String(t.summaryHe || "").trim();
  if (sumRaw) {
    let s = sanitizeEngineSnippetHe(sumRaw);
    s = s.replace(/\bdefault_[a-z0-9_]+\b/gi, "");
    s = s.replace(/\u0001/g, " ");
    /* block internal engine trend words that must not appear to parent */
    s = s.replace(/\b(improving|declining|unstable|trend|profile)\b/gi, "");
    s = s.replace(/\bpast\/present\b/gi, "past and present");
    s = s.replace(/\s{2,}/g, " ").trim();
    return truncateHe(normalizeParentFacingHe(s), 100);
  }
  const ad = String(t.accuracyDirection ?? "unknown").trim().toLowerCase();
  return TREND_ACCURACY_FULL_HE[ad] || TREND_ACCURACY_FULL_HE.unknown;
}

/**
 * @param {Array<{ detailHe?: string, phase?: string }>} trace
 * @param {number} maxItems
 */
export function formatDecisionTraceBulletsHe(trace, maxItems = 4) {
  if (!Array.isArray(trace) || !trace.length) return [];
  const withText = trace
    .map((e) => String(e?.detailHe || "").trim())
    .filter(Boolean);
  if (withText.length) return withText.slice(-maxItems);
  return trace
    .slice(-maxItems)
    .map((e) => {
      const ph = String(e?.phase || "").trim();
      return ph ? `Where in the process: ${ph}` : "";
    })
    .filter(Boolean);
}

/**
 * @param {Record<string, boolean>|null|undefined} majorRiskFlagsAcrossRows
 * @param {number} maxLabels
 */
export function subjectMajorRiskLabelsHe(majorRiskFlagsAcrossRows, maxLabels = 5) {
  return activeRiskFlagLabelsHe(majorRiskFlagsAcrossRows, maxLabels);
}

/** Root cause of difficulty Phase 7 — parent_report_hebrew_copy_spec.md §1.1 meaningSentence */
export const ROOT_CAUSE_LABEL_HE = {
  ...ROOT_CAUSE_PARENT_HE,
  insufficient_evidence: ROOT_CAUSE_PARENT_HE.insufficient_evidence,
};

/** Recommended intervention type Phase 7 */
export const INTERVENTION_TYPE_LABEL_HE = {
  stabilize_accuracy: "Reinforce accuracy before changing level",
  reduce_time_pressure: "Ease time pressure a bit while keeping accuracy",
  guided_to_independent_transition: "Move slowly from guided support to independence",
  clarify_instruction_pattern: "Explain the task and break it into small steps",
  target_core_skill_gap: "Focused reinforcement where it's missing",
  monitor_before_escalation: "A bit more guided practice before escalating",
};

/** Phase 9 — dominant mistake pattern (id → parent-facing text) — parent_report_hebrew_copy_spec.md §3 */
export const MISTAKE_PATTERN_LABEL_HE = { ...MISTAKE_PATTERN_PARENT_HE };

/** Phase 9 — learning stage over time */
export const LEARNING_STAGE_LABEL_HE = {
  early_acquisition: "Still learning and experimenting - this topic is relatively new",
  partial_stabilization: "Starting to stabilize, not fully there yet",
  stable_control: "Good problem-solving that holds over time",
  fragile_retention: "The material is retained with difficulty",
  regression_signal: "A recent decline - worth watching over the coming week",
  transfer_emerging: "Starting to apply outside of the exact practice format too",
  insufficient_longitudinal_evidence: "Still not enough information over time",
};

const PHASE8_DURATION_BAND_HE = {
  very_short: "Very short sessions",
  short: "Short sessions",
  moderate: "Moderate-length sessions",
};

const PHASE8_INTENSITY_HE = {
  light: "Light",
  focused: "Focused",
  targeted: "Precise",
};

const PHASE8_FORMAT_HE = {
  guided_practice: "Guided practice",
  independent_practice: "Independent practice",
  mixed: "Guided and independent",
  observation_block: "Observation and measurement",
};

const PHASE8_PARENT_EFFORT_HE = {
  low: "Light parent involvement",
  medium: "Moderate parent involvement",
  high: "High parent involvement",
};

const PHASE8_PRACTICE_LOAD_HE = {
  minimal: "Minimal practice",
  light: "Light practice",
  moderate: "Moderate practice",
};

/**
 * Short chips for a topic row / recommendation — Phase 8 (no long text).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function phase8TopicMetaChipsHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  /** @type {string[]} */
  const chips = [];
  const dur = PHASE8_DURATION_BAND_HE[String(src.interventionDurationBand || "")];
  if (dur) chips.push(dur);
  const fmt = PHASE8_FORMAT_HE[String(src.interventionFormat || "")];
  if (fmt) chips.push(fmt);
  const inten = PHASE8_INTENSITY_HE[String(src.interventionIntensity || "")];
  if (inten && chips.length < 3) chips.push(inten);
  const load = PHASE8_PRACTICE_LOAD_HE[String(src.recommendedPracticeLoad || "")];
  if (load && chips.length < 3) chips.push(load);
  const eff = PHASE8_PARENT_EFFORT_HE[String(src.interventionParentEffort || "")];
  if (eff && chips.length < 3) chips.push(eff);
  return chips.slice(0, 3);
}

/**
 * Compact home practice calibration line.
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function phase8PracticeCalibrationLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const n = Number(src.recommendedSessionCount);
  const countOk = Number.isFinite(n) && n > 0;
  const len =
    src.recommendedSessionLengthBand === "very_short"
      ? "5–8 min"
      : src.recommendedSessionLengthBand === "moderate"
        ? "up to ~15 min"
        : "8–12 min";
  if (!countOk) return "";
  return `${n} times a week, about ${len} each time.`;
}

/**
 * Short line for mistake pattern (Phase 9).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function mistakePatternLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const fromSpec = patternTextFromEngineHe(
    String(src.dominantMistakePattern || ""),
    src.dominantMistakePatternLabelHe,
  );
  if (fromSpec) return truncateHe(fromSpec, 140);
  return "";
}

const VAGUE_FOUNDATION_PHRASE =
  /simpler parts|the foundation it relies on|do not expand|the difficulty may start in parts/i;

/**
 * Mistake pattern for parent — only when there's a real mapping; otherwise honest wording.
 * @param {Record<string, unknown>|null|undefined} sig
 */
export function parentFacingPatternLineHe(sig) {
  if (!sig || typeof sig !== "object") return "";
  const patternId = String(sig.dominantMistakePattern || "").trim();
  const fromSpec = patternTextFromEngineHe(patternId, sig.dominantMistakePatternLabelHe);
  return fromSpec ? fromSpec.replace(/\s+/g, " ").trim() : "";
}

/**
 * Foundation/prerequisite for parent — real mapping or honest fallback.
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function parentFacingFoundationLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  if (!sig) return "";
  const dep = String(sig.dependencyState || "");
  const blocker = String(sig.likelyFoundationalBlocker || "unknown");
  if (blocker === "accuracy_foundation_gap") {
    return DEPENDENCY_STATE_PARENT_HE.accuracy_foundation_gap || "";
  }
  return foundationTextFromEngineHe(dep);
}

/**
 * @param {Record<string, unknown>|null|undefined} sig
 */
function parentFacingActionLineHe(sig) {
  if (!sig || typeof sig !== "object") return "";
  return (
    String(sig.doNowHe || "").trim() ||
    String(sig.interventionPlanHe || "").trim() ||
    String(sig.recommendedParentActionHe || "").trim()
  );
}

/**
 * @param {Record<string, unknown>|null|undefined} sig
 * @param {Record<string, unknown>|null|undefined} row
 */
function parentFacingMeaningLineHe(sig, row) {
  if (!sig || typeof sig !== "object") return "";
  const meaning = meaningExplainSentenceHe(
    String(sig.rootCause || ""),
    String(sig.diagnosticType || ""),
  );
  if (meaning) return meaning;
  const step = parentStepLabelHe(
    String(sig.recommendedNextStep || ""),
    String(sig.recommendedStepLabelHe || ""),
  );
  if (step) return step;
  if (rowNeedsAttentionForExplain(row)) {
    return meaningExplainSentenceHe("insufficient_evidence", "undetermined");
  }
  return "";
}

/** @param {Record<string, unknown>|null|undefined} row */
function rowNeedsAttentionForExplain(row) {
  const acc = Number(row?.accuracy) || 0;
  const q = Number(row?.questions) || 0;
  return q >= 3 && acc < 70;
}

/**
 * Full diagnostic explanation for a topic — screen + PDF (no mid-sentence truncation).
 * @param {Record<string, unknown>|null|undefined} row
 * @returns {{ identified: string, data: string, pattern: string, meaning: string, action: string } | null}
 */
export function buildTopicDiagnosticExplainSectionsHe(row) {
  if (!row || typeof row !== "object") return null;
  const q = Number(row.questions) || 0;
  if (q <= 0) return null;

  const sig = row.topicEngineRowSignals && typeof row.topicEngineRowSignals === "object" ? row.topicEngineRowSignals : null;
  const label = String(row.label || "").trim();
  const acc = Math.round(Number(row.accuracy) || 0);

  const engineCopy = buildEngineDecisionParentTopicCopyHe({
    subjectId: row.subjectId,
    subjectLabelHe: row.subjectLabelHe,
    topic: label,
    topicKey: row.topicKey,
    q,
    acc,
    wrong: row.wrong,
    gradeKey: row.gradeKey,
    topicEngineRowSignals: sig,
  });

  if (engineCopy) {
    const identified = buildExplainIdentifiedLineHe(engineCopy, label);

    return {
      identified: shortReportDiagnosticsParentVisibleHe(identified),
      data: shortReportDiagnosticsParentVisibleHe(`The data: ${engineCopy.dataHe}`),
      pattern: "",
      meaning: shortReportDiagnosticsParentVisibleHe(`What this means: ${engineCopy.whyHe}`),
      action: shortReportDiagnosticsParentVisibleHe(engineCopy.actionHe),
    };
  }

  const wrong = Number(row.wrong);
  const wr =
    q > 0 && Number.isFinite(wrong) && wrong >= 0
      ? Math.round((wrong / q) * 100)
      : acc <= 100
        ? Math.max(0, 100 - acc)
        : null;

  const stepLabel = sig
    ? parentStepLabelHe(String(sig.recommendedNextStep || ""), String(sig.recommendedStepLabelHe || ""))
    : "";
  const identified = explainIdentifiedHe(stepLabel, label);
  const data = explainDataHe(q, acc, wr);

  const patternText = sig ? parentFacingPatternLineHe(sig) : "";
  const pattern = explainPatternHe(patternText);

  const rootCause = String(sig?.rootCause || "");
  const diagnosticType = String(sig?.diagnosticType || "");
  const foundation = parentFacingFoundationLineHe(row);
  const meaning = explainMeaningHe(rootCause, diagnosticType, foundation);

  const engineAction = parentFacingActionLineHe(sig);
  const action = explainActionHe(rootCause, diagnosticType, engineAction);

  return {
    identified: shortReportDiagnosticsParentVisibleHe(identified),
    data: shortReportDiagnosticsParentVisibleHe(data),
    pattern: shortReportDiagnosticsParentVisibleHe(pattern),
    meaning: shortReportDiagnosticsParentVisibleHe(meaning),
    action: shortReportDiagnosticsParentVisibleHe(action),
  };
}

/**
 * Short line for learning memory (Phase 9).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function learningMemoryLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const mem = String(src.memoryNarrativeHe || "").trim();
  const st = String(src.learningStageLabelHe || "").trim();
  if (mem) return truncateHe(mem, 150);
  if (st) return truncateHe(`Over time: ${st}.`, 110);
  return "";
}

/**
 * "Review before advancing" line (Phase 9).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function reviewBeforeAdvanceLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const s = String(src.reviewBeforeAdvanceHe || "").trim();
  return s ? truncateHe(s, 160) : "";
}

/**
 * Transfer readiness line (Phase 9).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function transferReadinessLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const tr = String(src.transferReadiness || "").trim();
  if (!tr || tr === "unknown") return "";
  const map = {
    not_ready: "It's better to reinforce the current topic first before raising difficulty.",
    limited: "A little can be tried, but only within the same topic, not across several topics at once.",
    emerging: "A small step within the same topic can be started.",
    ready: "A small advanced step can be tried, carefully.",
  };
  return truncateHe(map[tr] || "", 130);
}

/** Phase 10 — response to intervention */
export const RESPONSE_TO_INTERVENTION_LABEL_HE = {
  not_enough_evidence: "There still isn't enough experience to know whether what we tried is really helping",
  early_positive_response: "There are early signs of improvement - not confirmed yet",
  stalled_response: "Progress feels stalled - worth refining or changing direction a bit",
  over_supported_progress: "Success mostly happens with help nearby - not yet full independence",
  independence_growing: "Independence is growing alongside progress",
  regression_under_support: "A negative trend even with the same support",
  mixed_response: "Mixed response - some progress, some still dependent",
};

export const SUPPORT_FIT_LABEL_HE = {
  good_fit: "Good fit with current support",
  partial_fit: "Partial fit - keep tracking and adjusting",
  poor_fit: "Weak fit - consider changing approach",
  unknown: "Not yet clear whether the fit is good",
};

export const SUPPORT_ADJUSTMENT_NEED_LABEL_HE = {
  hold_course: "Continue in the same direction, carefully",
  tighten_focus: "Narrow to one goal and slow down a bit",
  reduce_support: "Gradually reduce support as independence appears",
  increase_structure: "Add a short, clear structure",
  change_strategy: "Change approach - what we tried isn't enough",
  monitor_only: "Observe and gather more information before deciding",
};

/** Phase 10 — freshness of the conclusion */
export const FRESHNESS_STATE_LABEL_HE = {
  fresh: "The information is relatively current",
  recent_but_partial: "Partially current - details are still missing",
  aging: "The information is starting to age",
  stale: "The information is less current - don't rely on it alone",
  unknown: "Not clear how fresh the information is",
};

export const CONCLUSION_FRESHNESS_LABEL_HE = {
  high: "What the report shows is fairly reasonable right now",
  medium: "What the report shows is still solidifying - we'll keep checking",
  low: "What the report shows is still tentative - a bit more information would help",
  expired: "What the report shows is no longer current - worth reviewing again",
};

export const RECALIBRATION_NEED_LABEL_HE = {
  none: SUBJECT_V2_RECALIBRATION_NEED_NO_HE,
  light_review: "A light review before any meaningful change",
  structured_recheck: "A structured check before escalating or raising the level",
  do_not_rely_yet: "Don't rely solely on what the report shows yet",
};

/** Phase 10 — direction of support adjustment for next week */
export const NEXT_SUPPORT_ADJUSTMENT_LABEL_HE = {
  continue_same_plan: "Continue with the same plan - carefully and with re-checking",
  continue_and_reduce_support: "Continue and slightly reduce guidance when there's a sign of independence",
  continue_and_tighten_focus: "Continue, narrow to one goal, and shorten the session if needed",
  pause_and_observe: "Pause for a moment, observe, and gather more information before changing",
  recheck_before_advancing: "One more short check before raising difficulty or level",
  switch_strategy: "Change approach - what we tried isn't enough right now",
};

/** Phase 11 — support sequence state */
export const SUPPORT_SEQUENCE_STATE_LABEL_HE = {
  new_support_cycle: "Starting new support - in the first days, watch the results without rushing to conclusions",
  early_sequence: "Start of new support - keep tracking without overloading",
  continuing_sequence: "Continuing in the same direction, which looks good",
  sequence_ready_for_release: "Support can be reduced a little",
  sequence_stalled: "The direction isn't progressing enough - narrow the goal or change approach",
  sequence_exhausted: "Practice is repeating too much - worth pausing and trying a different approach",
  insufficient_sequence_evidence: "Still limited experience - worth checking again after a bit more practice.",
};

export const PRIOR_SUPPORT_PATTERN_LABEL_HE = {
  guided_repeat: "Similar guided support repeated over time",
  guided_then_release: "Guided, then a gradual move toward more independence",
  review_hold_repeat: "A cycle of review and holding steady before changing",
  observe_then_retry: "A short check, then another attempt",
  mixed_support_history: "An inconsistent mix of support",
  unknown: "Not clear what past support looked like",
};

export const STRATEGY_REPETITION_RISK_LABEL_HE = {
  low: "Low risk of unnecessarily repeating the same method",
  moderate: "Moderate risk of repeating the same direction without change",
  high: "High risk of repeating the same kind of help without added benefit",
  unknown: "Not clear if there's risky repetition",
};

export const STRATEGY_FATIGUE_RISK_LABEL_HE = {
  low: "Low load right now",
  moderate: "Worth watching that things don't get \"worn out\" on the same wording",
  high: "There's a sign of fatigue with this kind of support - time to refresh",
  unknown: "Not clear regarding fatigue with the approach",
};

export const NEXT_BEST_SEQUENCE_STEP_LABEL_HE = {
  continue_current_sequence: "Continue in the same direction a bit longer and check again",
  begin_release_step: "Start reducing help carefully - don't switch all at once",
  tighten_same_goal: "Narrow the same goal instead of expanding",
  switch_support_type: "Switch the type of support - not just another repetition",
  reset_with_short_review: "A short reset and re-check before pushing further",
  observe_before_next_cycle: "Observe and gather information before a new cycle",
};

/** Phase 11 — next week's support sequence action (engine) */
export const NEXT_SUPPORT_SEQUENCE_ACTION_LABEL_HE = {
  continue_same_sequence: "Continue in the same direction - without a big change",
  continue_with_tighter_target: "Continue in the same direction with a more focused goal",
  begin_release_sequence: "Start a gradual process of reducing help",
  pause_repeat_and_switch: "Pause repetitions and switch direction",
  short_reset_then_retry: "A short reset, then try again",
  observe_without_new_push: "Observe without a new push right now",
};

export const ADVICE_SIMILARITY_LEVEL_LABEL_HE = {
  clearly_new: "Sounds like a relatively new direction compared to what's repeated so far",
  partly_repeated: "Some things repeat - a slight variation could help",
  mostly_repeated: "Most of the wording repeats itself - worth changing the angle",
  unknown: "Not clear if this is a repetition",
};

export const ADVICE_NOVELTY_LABEL_HE = {
  high: "A lot of freshness in the wording and in what's actually done",
  medium: "A moderate level of freshness",
  low: "Similar to what's already been tried - maybe update it a bit",
  unknown: "Not clear",
};

export const RECOMMENDATION_ROTATION_NEED_LABEL_HE = {
  none: "No need to update the direction of the recommendation",
  light_variation: "It's enough to lightly update the wording or the step",
  meaningful_rotation: "Worth changing significantly - not the same repeated exercise",
  do_not_repeat_yet: "Don't repeat the same kind of practice without pausing for a short check",
};

/** Phase 12 — what was tried recently */
export const RECOMMENDATION_MEMORY_STATE_LABEL_HE = {
  no_memory: "Still limited experience from the past - worth checking again after a bit more practice",
  light_memory: "Only limited information from the past - mostly from the current period",
  usable_memory: "Enough background to compare progress against what happened recently",
  strong_memory: "Several periods to compare - continuity can be trusted a bit more",
};

export const PRIOR_RECOMMENDATION_SIGNATURE_LABEL_HE = {
  guided_accuracy_path: "Previous attempt to stabilize accuracy through guided practice",
  review_hold_path: "Review and holding steady before a change",
  release_transition_path: "A gradual transition from support to independence",
  observe_monitor_path: "A short check and information gathering",
  mixed_prior_path: "Several approaches tried, without one clear direction",
  unknown: "Not clear what past support looked like",
};

export const SUPPORT_HISTORY_DEPTH_LABEL_HE = {
  single_window: "Information from a single period only",
  short_history: "Data from two periods to compare",
  multi_window: "Several periods - a stronger basis",
  unknown: "Not clear how much history is available",
};

export const RECOMMENDATION_CARRYOVER_LABEL_HE = {
  not_visible: "No clear continuity is visible from the previous direction",
  partly_visible: "The same direction may be continuing - but not conclusively",
  clearly_visible: "It looks like the same support direction is continuing into this period too",
  unclear: "Not clear if this is the same approach or a small change",
};

export const MEMORY_OF_PRIOR_SUPPORT_CONFIDENCE_LABEL_HE = {
  none: "Still not a strong enough basis to compare with the past",
  low: "The comparison with the past is still weak",
  medium: "Enough background for a careful comparison with the past",
  high: "There's enough background for a fairly reliable comparison with the past",
};

/** Phase 12 — outcome tracking */
export const EXPECTED_OUTCOME_TYPE_LABEL_HE = {
  accuracy_stabilization: "We wanted to stabilize accuracy",
  independence_growth: "We wanted to build independence",
  error_reduction: "We wanted to reduce recurring mistakes",
  retention_hold: "We wanted retention and consistency",
  release_readiness: "We wanted to see if help could be carefully reduced",
  evidence_collection: "We wanted to gather a bit more information",
  unknown: "Not clear what we were actually trying to improve",
};

export const OBSERVED_OUTCOME_STATE_LABEL_HE = {
  clear_progress: "In practice, we see clear improvement in the direction we wanted",
  partial_progress: "In practice, there's partial progress",
  flat_response: "In practice, the picture is fairly flat",
  contradictory_response: "In practice, the direction differs from what we expected",
  not_observable_yet: "Still too early to see a clear result",
};

export const EXPECTED_VS_OBSERVED_MATCH_LABEL_HE = {
  aligned: "What we wanted and what we're seeing now look aligned",
  partly_aligned: "There's partial overlap between what we expected and what we're seeing",
  misaligned: "What we wanted doesn't match what we're seeing now",
  not_enough_evidence: "There still isn't enough basis from practice for a reliable comparison",
};

export const FOLLOW_THROUGH_SIGNAL_LABEL_HE = {
  likely_followed: "It's likely the direction at home was followed",
  possibly_followed: "The direction may have been followed - not conclusive",
  unclear: "Not clear if the same direction was followed at home",
  not_inferable: "Cannot be inferred from the data",
};

export const RECOMMENDATION_CONTINUATION_DECISION_LABEL_HE = {
  continue_with_same_core: "Continue with the same goal - what we're seeing in practice supports it",
  continue_but_refine: "Continue in the same direction, more precisely",
  begin_controlled_release: "Start slowly reducing support - now that there's a basis",
  do_not_repeat_without_new_evidence: "Don't repeat the same direction without new information",
  pivot_from_prior_path: "Move away from a direction that didn't lead anywhere",
  reset_and_rebuild_signal: "A short reset to rebuild the picture before pushing further",
};

export const OUTCOME_BASED_NEXT_MOVE_LABEL_HE = {
  keep_current_direction: "Stay on this direction - and check again later",
  tighten_goal_definition: "Narrow the goal - don't expand it",
  reduce_support_and_check_transfer: "Reduce support a little and check if it holds on a new question too",
  collect_new_evidence_first: "Gather more information before a major decision",
  switch_path_type: "Switch the approach - not just another round",
  brief_reset_then_compare: "A brief reset and a fresh comparison",
};

/** Phase 13 — decision gates */
export const GATE_STATE_LABEL_HE = {
  gates_not_ready: "There still isn't enough basis - staying with a cautious decision",
  continue_gate_active: "The current direction needs a bit more proof before changing",
  release_gate_forming: "Getting closer to reducing help - still missing one short sign of independence",
  pivot_gate_visible: "If there's still no improvement after more practice - worth considering a slightly different direction",
  recheck_gate_visible: "Missing current information - worth gathering a bit more before deciding",
  advance_gate_forming: "There's a good basis - don't raise the level too fast without a clearly repeating success",
  mixed_gate_state: "Several things at once - one clear step first",
};

export const GATE_READINESS_LABEL_HE = {
  low: "Low readiness - not locking into anything definitive",
  moderate: "Moderate readiness - can be narrowed to one step",
  high: "Relatively high readiness - still with conditions before reducing help or raising the level",
  insufficient: "Not yet enough basis for a precise decision",
};

export const GATE_LEVEL_LABEL_HE = {
  off: "Not relevant right now",
  pending: "Waiting for one more short sign",
  forming: "Building gradually",
  ready_watch: "Almost there - one last condition remains",
  blocked: "Paused temporarily until there's a bit of progress",
};

/** Phase 13 — evidence targets for the next round */
export const TARGET_EVIDENCE_TYPE_LABEL_HE = {
  accuracy_confirmation: "Confirm that accuracy holds without unnecessary pressure",
  independence_confirmation: "See a short success without help in the middle",
  retention_confirmation: "See that the child remembers even after a short break",
  mistake_reduction_confirmation: "See fewer mistakes of the same kind",
  response_confirmation: "See how the child responds to practice at home",
  fresh_data_needed: "Gather a bit more current data before closing the picture",
  mixed_target: "Combine two short signs - not everything at once",
};

export const TARGET_OBSERVATION_WINDOW_LABEL_HE = {
  next_short_cycle: "In the coming days (one or two sessions)",
  next_two_cycles: "Within the next two short practice sequences",
  needs_fresh_baseline: "After a short check to refresh the picture",
  unknown: "Not clear how much time is needed",
};

/** Phase 13 — decision focus for the next round */
export const NEXT_CYCLE_DECISION_FOCUS_LABEL_HE = {
  prove_current_direction: "Check that the current direction is really helping",
  check_independence_before_release: "Check for short independence before reducing help",
  stabilize_before_advance: "Stabilize before raising the level",
  test_if_path_is_working: "Check if the direction is actually working after a bit more practice",
  refresh_baseline_before_decision: "Recheck the simpler parts before a big decision",
  prepare_for_controlled_release: "Prepare to reduce help gradually - not switch to independent all at once",
};

/** Phase 14 — parent_report_hebrew_copy_spec.md §4 */
export const DEPENDENCY_STATE_LABEL_HE = { ...DEPENDENCY_STATE_PARENT_HE };

export const FOUNDATIONAL_BLOCKER_LABEL_HE = {
  accuracy_foundation_gap: DEPENDENCY_STATE_PARENT_HE.accuracy_foundation_gap,
  procedure_automaticity_gap: "It's hard to recall the solving method alone, even when the material is familiar",
  instruction_language_load: "The wording of the task adds extra load",
  independence_readiness_gap: "Still early for full independent work",
  retention_instability: "The child still doesn't retain the method over time",
  unknown: "Not yet clear exactly what needs reinforcing first",
};

export const LIKELIHOOD_LOW_MOD_HIGH_HE = {
  low: "Less likely",
  moderate: "Moderate likelihood",
  high: "Fairly likely",
  unknown: "Not clear",
};

/** Phase 14 — intervention order */
export const INTERVENTION_ORDERING_LABEL_HE = {
  foundation_first: "First reinforce the simpler parts - then return to the topic itself",
  local_support_first: "Focused practice on the topic itself first",
  parallel_light_support: "Light practice in parallel - without expanding everything at once",
  gather_dependency_evidence_first: "Gather more information before deciding what to reinforce first",
};

/** Phase 14 — foundation decision for the next round */
export const FOUNDATION_DECISION_LABEL_HE = {
  stabilize_foundation_first: "Reinforce the simpler parts first before expanding",
  treat_locally: "Address the topic itself - without expanding beyond what the data shows",
  run_parallel_light_support: "Combine short practice of the simpler parts together with the topic itself",
  collect_dependency_evidence_first: "Gather information before changing the order of work",
};

export const NEXT_CYCLE_SUPPORT_LEVEL_LABEL_HE = {
  narrow_local: "Focused practice on the topic",
  foundation_targeted: "Focused practice on the simpler parts that need reinforcing",
  blended_light: "A light mix - not double the load",
  evidence_first: "A short check before deciding on the level of support",
};

/**
 * Response-to-intervention line (Phase 10).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function responseToInterventionLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const s = String(src.responseToInterventionLabelHe || "").trim();
  if (s) return truncateHe(s, 150);
  const id = String(src.responseToIntervention || "").trim();
  const lab = RESPONSE_TO_INTERVENTION_LABEL_HE[id];
  return lab ? truncateHe(lab, 150) : "";
}

/**
 * Support adjustment / next step line (Phase 10).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function supportAdjustmentLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const adj = String(src.nextSupportAdjustmentHe || "").trim();
  if (adj) return truncateHe(adj, 160);
  const need = String(src.supportAdjustmentNeedHe || "").trim();
  if (need) return truncateHe(need, 140);
  return "";
}

/**
 * Freshness / evidence validity line (Phase 10).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function freshnessLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const fs = String(src.freshnessStateLabelHe || "").trim();
  const cf = String(src.conclusionFreshnessLabelHe || "").trim();
  const parts = [fs, cf].filter(Boolean);
  if (!parts.length) return "";
  return truncateHe(parts.join(" · "), 160);
}

/**
 * Need to re-check the direction (Phase 10).
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function recalibrationLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const s = String(src.recalibrationNeedHe || "").trim();
  return s ? truncateHe(s, 150) : "";
}

/** Phase 11 — support direction */
export function supportSequenceLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const nar = String(src.supportSequenceNarrativeHe || "").trim();
  if (nar) return truncateHe(nar, 160);
  const st = String(src.supportSequenceStateLabelHe || "").trim();
  return st ? truncateHe(st, 140) : "";
}

export function repetitionRiskLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const s = String(src.strategyRepetitionRiskHe || "").trim();
  if (!s || s === STRATEGY_REPETITION_RISK_LABEL_HE.unknown) return "";
  return truncateHe(s, 150);
}

export function fatigueRiskLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const s = String(src.strategyFatigueRiskHe || "").trim();
  if (!s || s === STRATEGY_FATIGUE_RISK_LABEL_HE.unknown) return "";
  return truncateHe(s, 150);
}

export function releaseReadinessLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const seq = String(src.supportSequenceState || "").trim();
  if (seq === "sequence_ready_for_release") {
    return truncateHe(
      "It looks like the support is helping - a short, controlled step of reducing help can be tried, though not fully independent yet.",
      170
    );
  }
  if (seq === "sequence_exhausted" || seq === "sequence_stalled") {
    return truncateHe("The sequence is stuck or tiring - worth pausing and refreshing the approach before more of the same practice.", 160);
  }
  return "";
}

export function sequenceActionLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const a = String(src.nextSupportSequenceActionHe || "").trim();
  return a ? truncateHe(a, 170) : "";
}

/** One line for repetition + fatigue — only when there's a label beyond unknown */
export function topicRepetitionFatigueCompactLineHe(rowOrRec) {
  const r = repetitionRiskLineHe(rowOrRec);
  const f = fatigueRiskLineHe(rowOrRec);
  if (r && f) return truncateHe(`${r} · ${f}`, 168);
  return r || f;
}

/**
 * Topic sequence line: sequence wording, or a careful release line when there's no wording.
 * @param {Record<string, unknown>|null|undefined} rowOrRec
 */
export function topicSupportSequenceOrReleaseLineHe(rowOrRec) {
  const seq = supportSequenceLineHe(rowOrRec);
  if (seq) return seq;
  return releaseReadinessLineHe(rowOrRec);
}

/** Phase 12 — what was tried recently / carryover */
export function recommendationMemoryLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const nar = String(src.recommendationMemoryNarrativeHe || "").trim();
  if (nar) return truncateHe(nar, 168);
  const st = String(src.recommendationMemoryStateLabelHe || "").trim();
  return st ? truncateHe(st, 150) : "";
}

export function outcomeTrackingLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const nar = String(src.outcomeTrackingNarrativeHe || "").trim();
  if (nar) return truncateHe(nar, 168);
  const m = String(src.expectedVsObservedMatchHe || "").trim();
  return m ? truncateHe(m, 155) : "";
}

export function continuationDecisionLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const s = String(src.recommendationContinuationDecisionHe || "").trim();
  return s ? truncateHe(s, 165) : "";
}

export function carryoverLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  if (String(src.recommendationCarryover || "") === "not_visible") return "";
  const s = String(src.recommendationCarryoverLabelHe || "").trim();
  if (!s) return "";
  return truncateHe(s, 155);
}

export function freshEvidenceNeedLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const mem = String(src.recommendationMemoryState || "");
  const match = String(src.expectedVsObservedMatch || "");
  const s = String(src.whatNeedsFreshEvidenceNowHe || "").trim();
  if (!s) return "";
  if (mem === "no_memory" || mem === "light_memory" || match === "not_enough_evidence") return truncateHe(s, 165);
  return "";
}

/** Phase 13 — gates and focus for the next round */
export function gateStateLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const nar = String(src.gateNarrativeHe || "").trim();
  if (nar) return truncateHe(nar, 170);
  const st = String(src.gateStateLabelHe || "").trim();
  return st ? truncateHe(st, 155) : "";
}

export function decisionFocusLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const s = String(src.nextCycleDecisionFocusHe || "").trim();
  return s ? truncateHe(s, 165) : "";
}

export function evidenceTargetLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const nar = String(src.evidenceTargetNarrativeHe || "").trim();
  if (nar) return truncateHe(nar, 168);
  const t = String(src.targetEvidenceTypeLabelHe || "").trim();
  const w = String(src.targetObservationWindowLabelHe || "").trim();
  if (t && w) return truncateHe(`${t} · ${w}`, 168);
  return t ? truncateHe(t, 155) : "";
}

export function releaseGateLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const rg = String(src.releaseGate || "");
  if (rg !== "forming" && rg !== "pending" && rg !== "ready_watch") return "";
  const w = String(src.whatWouldJustifyReleaseHe || "").trim();
  if (w) return truncateHe(w, 168);
  return truncateHe(
    "The direction looks reasonable - before reducing help, it helps to see one more short success without help in the middle.",
    168
  );
}

export function pivotTriggerLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const pg = String(src.pivotGate || "");
  if (pg !== "forming" && pg !== "pending") return "";
  const t = String(src.whatWouldTriggerPivotHe || "").trim();
  return t ? truncateHe(t, 168) : truncateHe(GATE_STATE_LABEL_HE.pivot_gate_visible, 140);
}

export function recheckTriggerLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const rc = String(src.recheckGate || "");
  if (rc !== "forming" && rc !== "pending") return "";
  const t = String(src.whatWouldTriggerRecheckHe || "").trim();
  return t ? truncateHe(t, 165) : "";
}

/** One trigger line: prioritize recheck, then pivot, then release */
export function gateTriggerCompactLineHe(rowOrRec) {
  const rec = recheckTriggerLineHe(rowOrRec);
  if (rec) return rec;
  const piv = pivotTriggerLineHe(rowOrRec);
  if (piv) return piv;
  const rel = releaseGateLineHe(rowOrRec);
  return rel || "";
}

/** Phase 14 — where the difficulty starts / support order */
export function dependencyStateLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const nar = String(src.foundationDependencyNarrativeHe || "").trim();
  if (nar) return truncateHe(nar, 170);
  const st = String(src.dependencyStateLabelHe || "").trim();
  return st ? truncateHe(st, 155) : "";
}

export function foundationPriorityLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  if (!src.shouldTreatAsFoundationFirst && String(src.foundationDecision || "") !== "stabilize_foundation_first")
    return "";
  const w = String(src.whyFoundationFirstHe || "").trim();
  if (w) return truncateHe(w, 168);
  return truncateHe(FOUNDATION_DECISION_LABEL_HE.stabilize_foundation_first, 130);
}

export function interventionOrderingLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const s = String(src.interventionOrderingHe || "").trim();
  return s ? truncateHe(s, 165) : "";
}

export function foundationBeforeExpansionLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  if (!src.foundationBeforeExpansion) return "";
  const t = String(src.foundationBeforeExpansionHe || "").trim();
  return t ? truncateHe(t, 168) : "";
}

export function downstreamSymptomLineHe(rowOrRec) {
  const o = rowOrRec && typeof rowOrRec === "object" ? rowOrRec : {};
  const sig = o.topicEngineRowSignals && typeof o.topicEngineRowSignals === "object" ? o.topicEngineRowSignals : null;
  const src = sig || o;
  const d = String(src.downstreamSymptomLikelihood || "");
  if (d !== "high" && d !== "moderate") return "";
  const sym = String(src.whyThisMayBeSymptomNotCoreHe || "").trim();
  if (sym) return truncateHe(sym, 165);
  const h = String(src.downstreamSymptomLikelihoodHe || "").trim();
  return h ? truncateHe(h, 140) : "";
}

/* -------------------------------------------------------------------------- */
/* Phase 15 — compact UI: a single consistent instructional priority order,   */
/* no duplication between layers.                                             */
/* Content priority: (1) what we see (2) support (3) what's still missing     */
/* (4) what to defer (5) foundation/local — this only merges parallel lines   */
/* that originate from the same engine fields.                                */
/* -------------------------------------------------------------------------- */

/** @param {string} hay @param {string} needle */
function pr15HayContainsProbe(hay, needle, minProbe = 16) {
  const H = String(hay || "");
  const N = String(needle || "").trim();
  if (!H || !N) return false;
  const probe = N.slice(0, Math.min(Math.max(minProbe, 12), N.length));
  return probe.length >= 10 && H.includes(probe);
}

function topicNarrativeSectionLineHe(rowOrRec, section, max = 180) {
  const c =
    rowOrRec?.contractsV1?.narrative && typeof rowOrRec.contractsV1.narrative === "object"
      ? rowOrRec.contractsV1.narrative
      : null;
  if (!c) return "";
  const line = narrativeSectionTextHe(section, c);
  return line ? truncateHe(normalizeParentFacingHe(line), max) : "";
}

function hasTopicNarrativeContract(rowOrRec) {
  return !!(
    rowOrRec?.contractsV1?.narrative &&
    typeof rowOrRec.contractsV1.narrative === "object"
  );
}

/**
 * Freshness + recalibration + "fresh evidence" in one line (not three nearly-identical caution lines).
 * Priority: freshness > fresh-evidence (filtered) > recalibration.
 */
export function topicFreshnessUnifiedLineHe(rowOrRec) {
  const fromContract = topicNarrativeSectionLineHe(rowOrRec, "limitations", 195);
  if (hasTopicNarrativeContract(rowOrRec)) return fromContract;
  const fr = freshnessLineHe(rowOrRec);
  if (fr) return fr;
  const fe = freshEvidenceNeedLineHe(rowOrRec);
  const rec = recalibrationLineHe(rowOrRec);
  if (fe && rec && !pr15HayContainsProbe(fe, rec, 14) && !pr15HayContainsProbe(rec, fe, 14)) {
    return truncateHe(`${fe} · ${rec}`, 195);
  }
  if (fe) return fe;
  return rec || "";
}

/**
 * Support adjustment / sequence step / sequence wording — one line; adjustment takes priority since it sometimes covers the sequence too.
 */
export function topicSupportFlowUnifiedLineHe(rowOrRec) {
  const fromContract = topicNarrativeSectionLineHe(rowOrRec, "recommendation", 190);
  if (hasTopicNarrativeContract(rowOrRec)) return fromContract;
  const adj = supportAdjustmentLineHe(rowOrRec);
  if (adj) return adj;
  const seqA = sequenceActionLineHe(rowOrRec);
  if (seqA) return seqA;
  return topicSupportSequenceOrReleaseLineHe(rowOrRec);
}

/** Sequence + repetition — merged when text overlaps; otherwise " · " */
export function topicSequencingRepeatCompactLineHe(rowOrRec) {
  const flow = topicSupportFlowUnifiedLineHe(rowOrRec);
  const rep = topicRepetitionFatigueCompactLineHe(rowOrRec);
  if (!rep) return flow;
  if (!flow) return rep;
  if (pr15HayContainsProbe(flow, rep, 14) || pr15HayContainsProbe(rep, flow, 14)) return flow;
  return truncateHe(`${flow} · ${rep}`, 200);
}

/** What was tried recently + outcome + continuation — without duplicating near-identical sentences */
export function topicMemoryOutcomeContinuationCompactLineHe(rowOrRec) {
  const mem = recommendationMemoryLineHe(rowOrRec);
  const out = outcomeTrackingLineHe(rowOrRec);
  const cont = continuationDecisionLineHe(rowOrRec);
  const parts = [];
  let acc = "";
  if (mem) {
    parts.push(mem);
    acc = mem;
  }
  if (out && !pr15HayContainsProbe(acc, out, 18)) {
    parts.push(out);
    acc = parts.join(" ");
  }
  if (cont && !pr15HayContainsProbe(acc, cont, 18)) parts.push(cont);
  return parts.length ? truncateHe(parts.join(" · "), 210) : "";
}

/**
 * Gate + round focus + evidence target + trigger — one line when the fields repeat the same intent.
 * Priority: gate narrative > focus > evidence target > trigger (only if it adds information).
 */
export function topicGatesEvidenceDecisionCompactLineHe(rowOrRec) {
  const fromContract = topicNarrativeSectionLineHe(rowOrRec, "finding", 200);
  if (hasTopicNarrativeContract(rowOrRec)) return fromContract;
  const gate = gateStateLineHe(rowOrRec);
  const focus = decisionFocusLineHe(rowOrRec);
  const ev = evidenceTargetLineHe(rowOrRec);
  const trig = gateTriggerCompactLineHe(rowOrRec);
  const parts = [];
  let acc = "";
  if (gate) {
    parts.push(gate);
    acc = gate;
  }
  if (focus && !pr15HayContainsProbe(acc, focus, 14)) {
    parts.push(focus);
    acc = parts.join(" ");
  }
  if (ev && !pr15HayContainsProbe(acc, ev, 18)) {
    parts.push(ev);
    acc = parts.join(" ");
  }
  if (trig && !pr15HayContainsProbe(acc, trig, 18)) parts.push(trig);
  return parts.length ? truncateHe(parts.join(" · "), 215) : "";
}

/** Foundation/local + intervention order + before expansion + downstream symptom — avoids duplication between Phase 14 lines */
export function topicFoundationDependencyCompactLineHe(rowOrRec) {
  const foundation = parentFacingFoundationLineHe(rowOrRec);
  if (foundation) return foundation;
  const ord = interventionOrderingLineHe(rowOrRec);
  const dep = dependencyStateLineHe(rowOrRec);
  if (dep && !VAGUE_FOUNDATION_PHRASE.test(dep)) return dep;
  return ord ? truncateHe(ord, 220) : "";
}
