/**
 * Detailed report surface components — separated for import in SSR tests without Layout/router.
 * Parent Copilot Phase A: no report/print structure change here - Copilot is only integrated on the `parent-report-detailed.js` page.
 */
export const PARENT_COPILOT_PHASE_A_SURFACE_TAG = "phaseA-no-layout-change";
import { reportPackCopy } from "../lib/reports/report-pack-copy.js";
import React, { useMemo } from "react";
import {
  buildSubjectParentLetterDetailedPhase1,
  rewriteParentRecommendationForDetailedHe,
} from "../utils/detailed-report-parent-letter-he";
import {
  behaviorDominantLabelHe,
  buildTopicDiagnosticExplainSectionsHe,
  learningMemoryLineHe,
  mistakePatternLineHe,
  sanitizeEngineSnippetHe,
  subjectMajorRiskLabelsHe,
  transferReadinessLineHe,
  truncateHe,
} from "../utils/parent-report-ui-explain-he";
import {
  PARENT_TOPIC_TIER,
  parentTopicTierSectionTitleHe,
} from "../utils/parent-report-surface/index.js";
import {
  formatExclusiveLearningMinutesHe,
  normalizeLearningTimeExclusiveBreakdown,
} from "../lib/parent-ui/learning-time-exclusive-breakdown-display.js";
import {
  getLpdFromRow,
  lpdParentVisibleFindingFromRow,
  shouldSuppressLegacyEngineParentCopy,
  guardParentFacingText,
  buildLpdSafeTopicExplainSectionsHe,
} from "../utils/learning-pattern-decision/index.js";
import { trendV1DisplayLineHe } from "../utils/parent-report-topic-trend-v1.js";
import {
  SUBJECT_PHASE3_ROW_LABEL_HE,
  SUBJECT_V2_RECALIBRATION_NEED_NO_HE,
  normalizeParentFacingHe,
} from "../utils/parent-report-language/index.js";
import { narrativeSectionTextHe } from "../utils/contracts/narrative-contract-v1.js";
import {
  PARENT_BULLETS_EMPTY_WITH_VOLUME_HE,
  stripKnownParentReportLeakageHe,
} from "../utils/parent-data-presence.js";
const PR1_RETENTION_LABEL_HE = {
  low: "low",
  moderate: "moderate",
  high: "high",
  unknown: "unclear",
};

const PR1_TRANSFER_LABEL_HE = {
  not_ready: "It's better to reinforce the current topic first.",
  limited: reportPackCopy("components__parent-report-detailed-surface", "you_can_try_a_little_only_within_the_same_topic"),
  emerging: reportPackCopy("components__parent-report-detailed-surface", "you_can_start_with_a_small_step_but_not_jump_a_level"),
  ready: reportPackCopy("components__parent-report-detailed-surface", "you_can_try_a_small_advanced_step"),
};

const PHASE1_WHAT_NOT_TO_DO_DISPLAY = Object.freeze({
  "Rising in level too quickly; mixing topics; general feedback without a counter-example":
    "Don't jump a level too fast, don't mix several topics together, and don't settle for general feedback without an example.",
  "Jumping to a high level; mixing topics; general feedback without a counter-example":
    "Don't jump to too high a level, don't mix several topics together, and don't settle for general feedback without an example.",
  "Rising in level too quickly; mixing topics":
    "Don't jump to too high a level and don't mix several topics together.",
  "Jumping to a high level; mixing topics":
    "Don't jump to too high a level and don't mix several topics together.",
});

function canonicalPhase1WhatNotToDoKey(raw) {
  const t = String(raw || "").trim();
  if (PHASE1_WHAT_NOT_TO_DO_DISPLAY[t]) return t;
  const hasCounterExample = /(?:counter-example|דוגמה\s*נגדית)/iu.test(t);
  const hasMixing = /(?:mixing topics|ערבוב\s*נושאים)/iu.test(t);
  const isFastRise = /(?:Rising in level too quickly|עלייה\s*מהירה\s*מדי\s*ברמה)/iu.test(t);
  const isHighJump = /(?:Jumping to a high level|קפיצה\s*לרמה\s*גבוהה)/iu.test(t);
  if (isFastRise && hasMixing && hasCounterExample) {
    return "Rising in level too quickly; mixing topics; general feedback without a counter-example";
  }
  if (isHighJump && hasMixing && hasCounterExample) {
    return "Jumping to a high level; mixing topics; general feedback without a counter-example";
  }
  if (isFastRise && hasMixing) {
    return "Rising in level too quickly; mixing topics";
  }
  if (isHighJump && hasMixing) {
    return "Jumping to a high level; mixing topics";
  }
  return t;
}

function phase1WhatNotToDoDisplayHe(raw) {
  const canonical = canonicalPhase1WhatNotToDoKey(raw);
  return PHASE1_WHAT_NOT_TO_DO_DISPLAY[canonical] || canonical;
}

function formatTopicQuestionCountHe(count) {
  const n = Math.max(0, Math.round(Number(count) || 0));
  if (n === 1) return "1 question";
  return `${n} questions`;
}

/** PR1 — parent-visible text only; does not change the payload. */
function pr1CrossSubjectRetentionDisplayHe(raw) {
  const k = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  return PR1_RETENTION_LABEL_HE[k] || "unclear";
}

/** PR1 — cross-subject transfer readiness; does not show a raw identifier. */
function pr1CrossSubjectTransferDisplayHe(raw) {
  const k = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  return PR1_TRANSFER_LABEL_HE[k] || reportPackCopy("components__parent-report-detailed-surface", "still_needs_more_practice_to_determine");
}

/**
 * PR1 — cleans identifier/token leakage from text shown to the parent (local to this file).
 * @param {unknown} s
 */
function pr1ParentVisibleTextHe(s) {
  let t = sanitizeEngineSnippetHe(String(s ?? ""));
  t = t.replace(/\u0001/g, " ");
  t = t.replace(/\bdefault_[a-z0-9_]+\b/gi, "");
  t = t.replace(
    /\b(advance_level|advance_grade_topic_only|maintain_and_strengthen|remediate_same_level|drop_one_level_topic_only|drop_one_grade_topic_only)\b/g,
    ""
  );
  t = t.replace(/\b(no_memory|light_memory|not_enough_evidence)\b/gi, "");
  t = t.replace(/\(pf:[^)]*\)/gi, "");
  t = t.replace(/\(k:[^)]*\)/gi, "");
  t = t.replace(/\(to:[^)]*\)/gi, "");
  t = t.replace(/\(st:[^)]*\)/gi, "");
  t = t.replace(/\(ct:[^)]*\)/gi, "");
  t = t.replace(/\b[a-z][a-z0-9_]{10,}\b/g, "");
  t = t.replace(/\s{2,}/g, " ").trim();
  t = normalizeParentFacingHe(t);
  t = stripKnownParentReportLeakageHe(t);
  if (!t) return "";
  const numericOnly = /^[\d\s.,/%\-–-]+$/u.test(t);
  if (numericOnly) return "";
  if (/^0{2,}$/u.test(t)) return "";
  return guardParentFacingText(t);
}

export function Bullets({ items, className = "", volumeQuestionsTotal = 0 }) {
  const safeItems = (Array.isArray(items) ? items : [])
    .map((x) => pr1ParentVisibleTextHe(x))
    .filter(Boolean);
  if (!safeItems.length)
    return (
      <p className={`pr-detailed-muted text-sm ${className}`.trim()}>
        {Number(volumeQuestionsTotal) > 0 ? PARENT_BULLETS_EMPTY_WITH_VOLUME_HE : "No data to display."}
      </p>
    );
  return (
    <ul
      className={`pr-detailed-body-text list-disc pr-5 space-y-1.5 text-sm md:text-base text-white/[0.88] leading-relaxed ${className}`.trim()}
    >
      {safeItems.map((t, i) => (
        <li key={i} className="pr-detailed-bullet-li">
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Executive summary — Phase 4 fields */
export function ExecutiveSummarySection({ es, compact }) {
  const volQ = Number(es?.windowTotalQuestions) || 0;
  return (
    <div className="pr-detailed-exec-summary space-y-3 md:space-y-4">
      <div
        className={`grid grid-cols-1 gap-3 md:gap-4 ${
          (es.topFocusAreasHe || []).length > 0 ? "md:grid-cols-2" : ""
        }`.trim()}
      >
        <div>
          <h4 className="pr-detailed-subheading text-emerald-200/95">Where good results were seen across subjects</h4>
          <Bullets items={es.topStrengthsAcrossHe || []} volumeQuestionsTotal={volQ} />
        </div>
        {(es.topFocusAreasHe || []).length > 0 ? (
          <div>
            <h4 className="pr-detailed-subheading text-amber-200/95">What to focus on (across subjects)</h4>
            <Bullets items={es.topFocusAreasHe || []} volumeQuestionsTotal={volQ} />
          </div>
        ) : null}
      </div>
      {es.majorTrendsHe?.length ? (
        <div>
          <h4 className="pr-detailed-subheading text-cyan-200/95">Major trends</h4>
          <Bullets items={es.majorTrendsHe || []} volumeQuestionsTotal={volQ} />
        </div>
      ) : null}
      {(es.dominantCrossSubjectRiskLabelHe || es.dominantCrossSubjectSuccessPatternLabelHe) && !compact ? (
        <div className="flex flex-wrap gap-2 text-[11px] md:text-xs text-white/78">
          {es.dominantCrossSubjectRiskLabelHe ? (
            <span className="rounded border border-white/15 bg-white/[0.05] px-2 py-1">
              <span className="text-white/45 font-bold">Where it seems harder: </span>
              {pr1ParentVisibleTextHe(es.dominantCrossSubjectRiskLabelHe)}
            </span>
          ) : null}
          {es.dominantCrossSubjectSuccessPatternLabelHe ? (
            <span className="rounded border border-white/15 bg-white/[0.05] px-2 py-1">
              <span className="text-white/45 font-bold">Where it seems stronger: </span>
              {pr1ParentVisibleTextHe(es.dominantCrossSubjectSuccessPatternLabelHe)}
            </span>
          ) : null}
        </div>
      ) : null}
      {es.mainHomeRecommendationHe ? (
        <div className="rounded-lg border border-amber-400/28 bg-amber-950/14 px-3 py-2.5">
          <h4 className="pr-detailed-subheading text-amber-100/95 mb-1 border-0 pb-0">Main home action for the period</h4>
          <p className="pr-detailed-body-text text-sm m-0 leading-relaxed">
            {pr1ParentVisibleTextHe(es.mainHomeRecommendationHe)}
          </p>
        </div>
      ) : null}
      {Boolean(es.topImmediateParentActionHe ||
        es.secondPriorityActionHe ||
        (es.monitoringOnlyAreasHe && es.monitoringOnlyAreasHe.length) ||
        (es.deferForNowAreasHe && es.deferForNowAreasHe.length)) && (
        <div className="rounded-lg border border-sky-400/24 bg-sky-950/12 px-3 py-2.5 pr-detailed-avoid-split">
          <h4 className="pr-detailed-subheading text-sky-100/95 mb-1.5 border-0 pb-0">What to do now - in order</h4>
          <div className="space-y-1.5 text-[11px] md:text-sm text-white/[0.86] leading-snug">
            {es.topImmediateParentActionHe ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">What to do first: </span>
                {pr1ParentVisibleTextHe(es.topImmediateParentActionHe)}
              </p>
            ) : (
              <p className="m-0 text-white/55">There's no topic worth focusing on this week - a short practice routine is enough.</p>
            )}
            {es.secondPriorityActionHe ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">What to do next: </span>
                {pr1ParentVisibleTextHe(es.secondPriorityActionHe)}
              </p>
            ) : null}
            {es.monitoringOnlyAreasHe?.length ? (
              <div className="m-0">
                <span className="text-white/45 font-bold">Keep a short routine: </span>
                <span className="text-white/[0.82]">
                  {es.monitoringOnlyAreasHe.map(pr1ParentVisibleTextHe).join(" · ")}
                </span>
              </div>
            ) : null}
            {es.deferForNowAreasHe?.length ? (
              <div className="m-0">
                <span className="text-white/45 font-bold">No need to focus on this now - it can wait: </span>
                <span className="text-white/[0.82]">{es.deferForNowAreasHe.map(pr1ParentVisibleTextHe).join(" · ")}</span>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {Boolean(es.dominantCrossSubjectMistakePatternLabelHe ||
        es.crossSubjectLearningStageLabelHe ||
        (es.reviewBeforeAdvanceAreasHe && es.reviewBeforeAdvanceAreasHe.length) ||
        (es.transferReadyAreasHe && es.transferReadyAreasHe.length)) && (
        <div className="rounded-lg border border-emerald-400/22 bg-emerald-950/10 px-3 py-2.5 pr-detailed-avoid-split">
          <h4 className="pr-detailed-subheading text-emerald-100/95 mb-1.5 border-0 pb-0">Repeated mistakes and retention of what's been learned</h4>
          <div className="space-y-1 text-[11px] md:text-sm text-white/[0.86] leading-snug">
            {es.dominantCrossSubjectMistakePatternLabelHe ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">What stands out: </span>
                {pr1ParentVisibleTextHe(es.dominantCrossSubjectMistakePatternLabelHe)}
              </p>
            ) : null}
            {es.crossSubjectLearningStageLabelHe ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Over time: </span>
                {pr1ParentVisibleTextHe(es.crossSubjectLearningStageLabelHe)}
                {es.crossSubjectRetentionRisk
                  ? ` · Retention risk: ${pr1CrossSubjectRetentionDisplayHe(es.crossSubjectRetentionRisk)}`
                  : ""}
                {es.crossSubjectTransferReadiness
                  ? ` · Readiness for the next step: ${pr1CrossSubjectTransferDisplayHe(es.crossSubjectTransferReadiness)}`
                  : ""}
              </p>
            ) : null}
            {es.reviewBeforeAdvanceAreasHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Before raising the level: </span>
                {es.reviewBeforeAdvanceAreasHe.map(pr1ParentVisibleTextHe).join(" · ")}
              </p>
            ) : null}
            {es.transferReadyAreasHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Ready for careful expansion: </span>
                {es.transferReadyAreasHe.map(pr1ParentVisibleTextHe).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      )}
      {Boolean(es.crossSubjectResponseToInterventionLabelHe ||
        es.crossSubjectSupportAdjustmentNeedHe ||
        es.crossSubjectRecalibrationNeedHe ||
        (es.majorRecheckAreasHe && es.majorRecheckAreasHe.length) ||
        (es.areasWhereSupportCanBeReducedHe && es.areasWhereSupportCanBeReducedHe.length) ||
        (es.areasNeedingStrategyChangeHe && es.areasNeedingStrategyChangeHe.length)) && (
        <div className="rounded-lg border border-teal-400/22 bg-teal-950/10 px-3 py-2.5 pr-detailed-avoid-split">
          <h4 className="pr-detailed-subheading text-teal-100/95 mb-1.5 border-0 pb-0">What helps now and what's worth changing</h4>
          <div className="space-y-1 text-[11px] md:text-sm text-white/[0.86] leading-snug">
            {es.crossSubjectResponseToInterventionLabelHe ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">What appears to be happening: </span>
                {pr1ParentVisibleTextHe(es.crossSubjectResponseToInterventionLabelHe)}
              </p>
            ) : null}
            {es.crossSubjectSupportAdjustmentNeedHe ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Direction for next week: </span>
                {pr1ParentVisibleTextHe(es.crossSubjectSupportAdjustmentNeedHe)}
              </p>
            ) : null}
            {es.crossSubjectRecalibrationNeedHe &&
            es.crossSubjectRecalibrationNeedHe !== SUBJECT_V2_RECALIBRATION_NEED_NO_HE ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Is it worth checking a different direction? </span>
                {pr1ParentVisibleTextHe(es.crossSubjectRecalibrationNeedHe)}
              </p>
            ) : null}
            {es.majorRecheckAreasHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Worth checking again: </span>
                {es.majorRecheckAreasHe.map(pr1ParentVisibleTextHe).join(" · ")}
              </p>
            ) : null}
            {es.areasWhereSupportCanBeReducedHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">You can try a bit more independence: </span>
                {es.areasWhereSupportCanBeReducedHe.map(pr1ParentVisibleTextHe).join(" · ")}
              </p>
            ) : null}
            {es.areasNeedingStrategyChangeHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">A strategy change is warranted: </span>
                {es.areasNeedingStrategyChangeHe.map(pr1ParentVisibleTextHe).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      )}
      {Boolean(String(es.crossSubjectSupportSequenceStateLabelHe || "").trim() ||
        String(es.crossSubjectNextBestSequenceStepHe || "").trim() ||
        (es.subjectsReadyForReleaseHe && es.subjectsReadyForReleaseHe.length) ||
        (es.subjectsAtRiskOfSupportRepetitionHe && es.subjectsAtRiskOfSupportRepetitionHe.length) ||
        (es.subjectsNeedingSupportResetHe && es.subjectsNeedingSupportResetHe.length)) && (
        <div className="rounded-lg border border-indigo-400/22 bg-indigo-950/10 px-3 py-2.5 pr-detailed-avoid-split">
          <h4 className="pr-detailed-subheading text-indigo-100/95 mb-1.5 border-0 pb-0">How progress looks over time</h4>
          <div className="space-y-1 text-[11px] md:text-sm text-white/[0.86] leading-snug">
            {String(es.crossSubjectSupportSequenceStateLabelHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Overall status: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectSupportSequenceStateLabelHe)), 220)}
              </p>
            ) : null}
            {String(es.crossSubjectNextBestSequenceStepHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Direction for the sequence: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectNextBestSequenceStepHe)), 220)}
              </p>
            ) : null}
            {es.subjectsReadyForReleaseHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">You can try a bit less help, carefully: </span>
                {truncateHe(es.subjectsReadyForReleaseHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
            {es.subjectsAtRiskOfSupportRepetitionHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Risk of repetition: </span>
                {truncateHe(es.subjectsAtRiskOfSupportRepetitionHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
            {es.subjectsNeedingSupportResetHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Worth pausing and refreshing direction: </span>
                {truncateHe(es.subjectsNeedingSupportResetHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
          </div>
        </div>
      )}
      {Boolean(String(es.crossSubjectRecommendationMemoryStateLabelHe || "").trim() ||
        (es.subjectsWithClearCarryoverHe && es.subjectsWithClearCarryoverHe.length) ||
        (es.subjectsNeedingFreshEvidenceHe && es.subjectsNeedingFreshEvidenceHe.length) ||
        (es.subjectsWherePriorPathSeemsMisalignedHe && es.subjectsWherePriorPathSeemsMisalignedHe.length)) && (
        <div className="rounded-lg border border-slate-400/22 bg-slate-950/12 px-3 py-2.5 pr-detailed-avoid-split">
          <h4 className="pr-detailed-subheading text-slate-100/95 mb-1.5 border-0 pb-0">What we tried recently - did it help?</h4>
          <div className="space-y-1 text-[11px] md:text-sm text-white/[0.86] leading-snug">
            {String(es.crossSubjectRecommendationMemoryStateLabelHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">What we tried recently: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectRecommendationMemoryStateLabelHe)), 220)}
                {String(es.crossSubjectSupportHistoryDepthLabelHe || "").trim()
                  ? ` · ${truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectSupportHistoryDepthLabelHe)), 120)}`
                  : ""}
              </p>
            ) : null}
            {String(es.crossSubjectExpectedVsObservedMatchHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Does this match what we expected: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectExpectedVsObservedMatchHe)), 220)}
              </p>
            ) : null}
            {String(es.crossSubjectContinuationDecisionHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Direction going forward: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectContinuationDecisionHe)), 220)}
              </p>
            ) : null}
            {es.subjectsWithClearCarryoverHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Good consistency: </span>
                {truncateHe(es.subjectsWithClearCarryoverHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
            {es.subjectsNeedingFreshEvidenceHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Needs updated information: </span>
                {truncateHe(es.subjectsNeedingFreshEvidenceHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
            {es.subjectsWherePriorPathSeemsMisalignedHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">The previous direction doesn't fit well enough: </span>
                {truncateHe(es.subjectsWherePriorPathSeemsMisalignedHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
          </div>
        </div>
      )}
      {Boolean(String(es.crossSubjectGateStateLabelHe || "").trim() ||
        String(es.crossSubjectNextCycleDecisionFocusHe || "").trim() ||
        String(es.crossSubjectEvidenceTargetTypeLabelHe || "").trim() ||
        String(es.crossSubjectTargetObservationWindowLabelHe || "").trim() ||
        (es.subjectsNearReleaseButNotThereHe && es.subjectsNearReleaseButNotThereHe.length) ||
        (es.subjectsNeedingRecheckBeforeDecisionHe && es.subjectsNeedingRecheckBeforeDecisionHe.length) ||
        (es.subjectsWithVisiblePivotTriggerHe && es.subjectsWithVisiblePivotTriggerHe.length)) && (
        <div className="rounded-lg border border-fuchsia-400/22 bg-fuchsia-950/10 px-3 py-2.5 pr-detailed-avoid-split">
          <h4 className="pr-detailed-subheading text-fuchsia-100/95 mb-1.5 border-0 pb-0">Before changing anything</h4>
          <div className="space-y-1 text-[11px] md:text-sm text-white/[0.86] leading-snug">
            {String(es.crossSubjectGateStateLabelHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">What's right to do now: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectGateStateLabelHe)), 220)}
              </p>
            ) : null}
            {String(es.crossSubjectNextCycleDecisionFocusHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">What's worth checking: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectNextCycleDecisionFocusHe)), 240)}
              </p>
            ) : null}
            {(String(es.crossSubjectEvidenceTargetTypeLabelHe || "").trim() ||
              String(es.crossSubjectTargetObservationWindowLabelHe || "").trim()) && (
              <p className="m-0">
                <span className="text-white/45 font-bold">What to collect: </span>
                {truncateHe(
                  [es.crossSubjectEvidenceTargetTypeLabelHe, es.crossSubjectTargetObservationWindowLabelHe]
                    .filter(Boolean)
                    .map((x) => pr1ParentVisibleTextHe(String(x)))
                    .join(" · "),
                  260
                )}
              </p>
            )}
            {es.subjectsNearReleaseButNotThereHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Not yet ready to reduce help: </span>
                {truncateHe(es.subjectsNearReleaseButNotThereHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
            {es.subjectsNeedingRecheckBeforeDecisionHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Refresh before deciding: </span>
                {truncateHe(es.subjectsNeedingRecheckBeforeDecisionHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
            {es.subjectsWithVisiblePivotTriggerHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">A sign for a careful direction change: </span>
                {truncateHe(es.subjectsWithVisiblePivotTriggerHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
          </div>
        </div>
      )}
      {Boolean(String(es.crossSubjectDependencyStateLabelHe || "").trim() ||
        String(es.crossSubjectFoundationFirstPriorityHe || "").trim() ||
        (es.subjectsLikelyShowingDownstreamSymptomsHe && es.subjectsLikelyShowingDownstreamSymptomsHe.length) ||
        (es.subjectsNeedingFoundationFirstHe && es.subjectsNeedingFoundationFirstHe.length) ||
        (es.subjectsSafeForLocalInterventionHe && es.subjectsSafeForLocalInterventionHe.length)) && (
        <div className="rounded-lg border border-emerald-400/22 bg-emerald-950/10 px-3 py-2.5 pr-detailed-avoid-split">
          <h4 className="pr-detailed-subheading text-emerald-100/95 mb-1.5 border-0 pb-0">Is the difficulty broad or narrow?</h4>
          <div className="space-y-1 text-[11px] md:text-sm text-white/[0.86] leading-snug">
            {String(es.crossSubjectDependencyStateLabelHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Overall picture: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectDependencyStateLabelHe)), 220)}
                {String(es.crossSubjectLikelyFoundationalBlockerLabelHe || "").trim()
                  ? ` · ${truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectLikelyFoundationalBlockerLabelHe)), 140)}`
                  : ""}
              </p>
            ) : null}
            {String(es.crossSubjectFoundationFirstPriorityHe || "").trim() ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">What to do in this round: </span>
                {truncateHe(pr1ParentVisibleTextHe(String(es.crossSubjectFoundationFirstPriorityHe)), 240)}
              </p>
            ) : null}
            {es.subjectsLikelyShowingDownstreamSymptomsHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">The difficulty may start elsewhere: </span>
                {truncateHe(es.subjectsLikelyShowingDownstreamSymptomsHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
            {es.subjectsNeedingFoundationFirstHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Where the difficulty starts: </span>
                {truncateHe(es.subjectsNeedingFoundationFirstHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
            {es.subjectsSafeForLocalInterventionHe?.length ? (
              <p className="m-0">
                <span className="text-white/45 font-bold">Looks focused on this topic: </span>
                {truncateHe(es.subjectsSafeForLocalInterventionHe.map(pr1ParentVisibleTextHe).join(" · "), 260)}
              </p>
            ) : null}
          </div>
        </div>
      )}
      {es.cautionNoteHe ? (
        <div className="rounded-lg border border-rose-400/28 bg-rose-950/12 px-3 py-2.5">
          <h4 className="pr-detailed-subheading text-rose-100/95 mb-1 border-0 pb-0">Caution</h4>
          <p className="pr-detailed-body-text text-sm m-0 leading-relaxed">
            {pr1ParentVisibleTextHe(es.cautionNoteHe)}
          </p>
        </div>
      ) : null}
      {es.overallConfidenceHe ? (
        <div>
          <h4 className="pr-detailed-subheading text-sky-200/95">How much can you trust these conclusions?</h4>
          <p className="pr-detailed-body-text text-sm m-0 leading-relaxed">
            {pr1ParentVisibleTextHe(es.overallConfidenceHe)}
          </p>
        </div>
      ) : null}
      {es.mixedSignalNoticeHe ? (
        <div className="rounded-lg border border-violet-400/25 bg-violet-950/12 px-3 py-2">
          <p className="pr-detailed-body-text text-sm m-0 text-violet-100/95 leading-relaxed">
            {pr1ParentVisibleTextHe(es.mixedSignalNoticeHe)}
          </p>
        </div>
      ) : null}
      {!compact && (es.reportReadinessHe || es.evidenceBalanceHe) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/78">
          {es.reportReadinessHe ? (
            <p className="m-0 leading-relaxed">
              <span className="text-white/45 font-bold block text-[11px] mb-0.5">Report readiness</span>
              {pr1ParentVisibleTextHe(es.reportReadinessHe)}
            </p>
          ) : null}
          {es.evidenceBalanceHe ? (
            <p className="m-0 leading-relaxed">
              <span className="text-white/45 font-bold block text-[11px] mb-0.5">What's clearer and what still needs checking</span>
              {pr1ParentVisibleTextHe(es.evidenceBalanceHe)}
            </p>
          ) : null}
        </div>
      ) : null}
      {es.homeFocusHe ? (
        <div>
          <h4 className="pr-detailed-subheading text-sky-200/95">A word about home</h4>
          <p className="pr-detailed-body-text whitespace-pre-line leading-relaxed m-0">
            {pr1ParentVisibleTextHe(es.homeFocusHe)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function trendOverlapsDiagnosis(diagnosisHe, trendNarrativeHe) {
  const t = String(trendNarrativeHe || "").trim();
  const d = String(diagnosisHe || "").trim();
  if (!t || !d || t.length < 16) return false;
  return d.includes(t.slice(0, Math.min(28, t.length)));
}

/** Parent-facing extras only — inline, no accordion. */
export function SubjectPhase3Insights({ sp, compact }) {
  void compact;
  const letter = useMemo(() => buildSubjectParentLetterDetailedPhase1(sp), [sp]);
  const rows = [];
  const dr = String(sp?.dominantLearningRiskLabelHe || "").trim();
  if (dr) rows.push({ k: "What to pay attention to", v: pr1ParentVisibleTextHe(dr) });
  const ds = String(sp?.dominantSuccessPatternLabelHe || "").trim();
  if (ds) rows.push({ k: "What's working well", v: pr1ParentVisibleTextHe(ds) });
  const wntRaw = String(sp?.whatNotToDoHe || "").trim();
  const wnt = phase1WhatNotToDoDisplayHe(wntRaw);
  if (wnt && (!letter?.closing || !String(letter.closing).includes(wnt.slice(0, 24)))) {
    rows.push({ k: "What to avoid right now", v: truncateHe(pr1ParentVisibleTextHe(wnt), 200) });
  }
  const trLine = String(transferReadinessLineHe(sp) || "").trim();
  const trMapped = pr1CrossSubjectTransferDisplayHe(String(sp?.subjectTransferReadiness || "").trim());
  const trCombined = pr1ParentVisibleTextHe(trLine || (trMapped !== reportPackCopy("components__parent-report-detailed-surface", "still_needs_more_practice_to_determine") ? trMapped : ""));
  if (trCombined) {
    rows.push({ k: "Ready to advance?", v: truncateHe(trCombined, 160) });
  }

  if (!rows.length) return null;

  return (
    <div className="parent-surface-only pr-detailed-phase3-dl space-y-2 m-0 mb-2 rounded-lg border border-white/10 bg-black/10 px-2 py-2">
      {rows.map(({ k, v }) => (
        <div key={k} className="min-w-0">
          <div className="text-white/50 font-bold text-[11px] md:text-xs m-0 mb-0.5">{k}</div>
          <div className="m-0 text-white/[0.88] leading-relaxed text-[11px] md:text-sm">
            {pr1ParentVisibleTextHe(String(v))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Exclusive learning-time breakdown — screen-only, collapsed by default.
 * Add-only; does not replace parent activities / out-of-grade sections.
 * @param {{ breakdown?: object|null|undefined }} props
 */
export function LearningTimeBreakdownDetails({ breakdown }) {
  const b = normalizeLearningTimeExclusiveBreakdown(breakdown);
  if (!b) return null;

  const rows = [
    { label: "Total learning time", value: `${formatExclusiveLearningMinutesHe(b.totalMinutes)} min` },
    {
      label: reportPackCopy("components__parent-report-detailed-surface", "practice_with_questions"),
      value: `${formatExclusiveLearningMinutesHe(b.questionPracticeMinutes)} min`,
    },
    { label: "Questions answered", value: String(b.analyzedQuestionCount) },
    {
      label: reportPackCopy("components__parent-report-detailed-surface", "book_reading"),
      value: `${formatExclusiveLearningMinutesHe(b.bookReadingMinutes)} min`,
    },
    {
      label: reportPackCopy("components__parent-report-detailed-surface", "other_active_learning"),
      value: `${formatExclusiveLearningMinutesHe(b.otherActiveLearningMinutes)} min`,
    },
  ];

  return (
    <details className="pr-detailed-learning-time-breakdown no-pdf no-print mb-5 md:mb-6 min-w-0 rounded-lg border border-white/10 bg-black/10">
      <summary
        id="pr-detailed-learning-time-breakdown-heading"
        className="pr-detailed-section-title cursor-pointer select-none list-none text-base md:text-lg font-extrabold tracking-tight text-white m-0 px-3 py-3 md:px-4 md:py-3.5 border-b border-white/10 [&::-webkit-details-marker]:hidden"
      >
        Learning time breakdown
      </summary>
      <div className="px-3 py-3 md:px-4 md:py-4 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-white/10">
                  <td className="p-2 font-semibold text-white/85">{row.label}</td>
                  <td className="p-2 text-white/90">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {b.bySubject.length > 0 ? (
          <div>
            <p className="pr-detailed-topic-rec-head m-0 mb-2">Breakdown by subject</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/15 bg-white/5">
                    <th className="p-2 font-semibold">Subject</th>
                    <th className="p-2 font-semibold">{reportPackCopy("components__parent-report-detailed-surface", "practice_with_questions")}</th>
                    <th className="p-2 font-semibold">{reportPackCopy("components__parent-report-detailed-surface", "book_reading")}</th>
                  </tr>
                </thead>
                <tbody>
                  {b.bySubject.map((row) => (
                    <tr key={row.subjectKey} className="border-b border-white/10">
                      <td className="p-2">{row.subjectLabelHe}</td>
                      <td className="p-2">
                        {formatExclusiveLearningMinutesHe(row.questionPracticeMinutes)} min
                      </td>
                      <td className="p-2">
                        {formatExclusiveLearningMinutesHe(row.bookReadingMinutes)} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </details>
  );
}

/**
 * Parent-assigned activities in the selected period (detailed report transparency table).
 * Screen-only, collapsed by default — not part of the official print/PDF report.
 * @param {{ rows?: object[]|null|undefined }} props
 */
export function ParentAssignedActivitiesSection({ rows }) {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) return null;

  return (
    <details className="pr-detailed-parent-activities no-pdf no-print mb-5 md:mb-6 min-w-0 rounded-lg border border-white/10 bg-black/10">
      <summary
        id="pr-detailed-parent-activities-heading"
        className="pr-detailed-section-title cursor-pointer select-none list-none text-base md:text-lg font-extrabold tracking-tight text-white m-0 px-3 py-3 md:px-4 md:py-3.5 border-b border-white/10 [&::-webkit-details-marker]:hidden"
      >
        Personal activities from parent ({list.length})
      </summary>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/15 bg-white/5">
              <th className="p-2 font-semibold">Activity</th>
              <th className="p-2 font-semibold">Subject</th>
              <th className="p-2 font-semibold">Topic</th>
              <th className="p-2 font-semibold">Grade</th>
              <th className="p-2 font-semibold">Date</th>
              <th className="p-2 font-semibold">Questions</th>
              <th className="p-2 font-semibold">Accuracy</th>
              <th className="p-2 font-semibold">Time (min)</th>
              <th className="p-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, idx) => (
              <tr
                key={row.activityId || `${row.subjectId}-${row.topicKey}-${idx}`}
                className="border-b border-white/10"
              >
                <td className="p-2">{row.activityLabelHe || "Personal activity from parent"}</td>
                <td className="p-2">{row.subjectLabelHe || "-"}</td>
                <td className="p-2">{row.topicLabelHe || "-"}</td>
                <td className="p-2">{row.gradeLabelHe || "-"}</td>
                <td className="p-2">{row.lastActivityAtHe || "Not available"}</td>
                <td className="p-2">{row.questionCount ?? 0}</td>
                <td className="p-2">{row.accuracy ?? 0}%</td>
                <td className="p-2">{row.timeMinutes ?? 0}</td>
                <td className="p-2">{row.statusLabelHe || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function OutOfGradePracticeTable({ rows }) {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-white/15 bg-white/5">
            <th className="p-2 font-semibold">Subject</th>
            <th className="p-2 font-semibold">Topic</th>
            <th className="p-2 font-semibold">Grade</th>
            <th className="p-2 font-semibold">Questions</th>
            <th className="p-2 font-semibold">Accuracy</th>
            <th className="p-2 font-semibold">Time (min)</th>
            <th className="p-2 font-semibold">Last date</th>
            <th className="p-2 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody>
          {list.map((row, idx) => (
            <tr
              key={row.topicRowKey || `${row.subjectId}-${row.topicLabelHe}-${idx}`}
              className="border-b border-white/10"
            >
              <td className="p-2">{row.subjectLabelHe || "-"}</td>
              <td className="p-2">{row.topicLabelHe || "-"}</td>
              <td className="p-2">{row.gradeLabelHe || "-"}</td>
              <td className="p-2">{row.questions ?? 0}</td>
              <td className="p-2">{row.accuracy ?? 0}%</td>
              <td className="p-2">{row.timeMinutes ?? 0}</td>
              <td className="p-2">{row.lastActivityAtHe || "Not available"}</td>
              <td className="p-2">{row.sourceLabelHe || "Practice"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Out-of-registered-grade practice — transparency only (detailed report, screen-only).
 * @param {{ transparency?: object|null|undefined }} props
 */
export function OutOfGradePracticeSection({ transparency }) {
  const block =
    transparency && typeof transparency === "object" ? transparency : null;
  if (!block) return null;

  const advanced = Array.isArray(block.advancedPractice) ? block.advancedPractice : [];
  const foundation = Array.isArray(block.foundationPractice) ? block.foundationPractice : [];
  if (!advanced.length && !foundation.length) return null;

  const total = advanced.length + foundation.length;

  return (
    <details className="pr-detailed-out-of-grade no-pdf no-print mb-5 md:mb-6 min-w-0 rounded-lg border border-white/10 bg-black/10">
      <summary
        id="pr-detailed-out-of-grade-heading"
        className="pr-detailed-section-title cursor-pointer select-none list-none text-base md:text-lg font-extrabold tracking-tight text-white m-0 px-3 py-3 md:px-4 md:py-3.5 border-b border-white/10 [&::-webkit-details-marker]:hidden"
      >
        {block.titleHe || "Practice outside the registered grade"} ({total})
      </summary>
      <div className="px-3 py-3 md:px-4 md:py-4 space-y-4">
        {advanced.length > 0 ? (
          <div>
            <p className="pr-detailed-topic-rec-head m-0 mb-2">Advanced practice</p>
            <OutOfGradePracticeTable rows={advanced} />
          </div>
        ) : null}
        {foundation.length > 0 ? (
          <div>
            <p className="pr-detailed-topic-rec-head m-0 mb-2">Prior foundations</p>
            <OutOfGradePracticeTable rows={foundation} />
          </div>
        ) : null}
      </div>
    </details>
  );
}

/**
 * Parent-facing topic rows grouped by unified tier.
 * @param {{ sp: object, hideTopicRowKeysForTiers?: Set<string>, tierAllowlist?: string[]|null }} props
 */
export function SubjectTopicTierGroups({ sp, hideTopicRowKeysForTiers, tierAllowlist = null }) {
  const groups = sp?.topicGroupsByTier;
  if (!groups || typeof groups !== "object") return null;
  const defaultOrder = [
    PARENT_TOPIC_TIER.STRONG,
    PARENT_TOPIC_TIER.MONITOR,
    PARENT_TOPIC_TIER.ADVANCED_PRACTICE,
    PARENT_TOPIC_TIER.FOUNDATION_PRACTICE,
    PARENT_TOPIC_TIER.STRENGTHEN,
    PARENT_TOPIC_TIER.CLEAR_GAP,
    PARENT_TOPIC_TIER.NEEDS_GUIDANCE,
    PARENT_TOPIC_TIER.LOW_EVIDENCE,
  ];
  const order =
    Array.isArray(tierAllowlist) && tierAllowlist.length ? tierAllowlist : defaultOrder;
  // Wave 2 Fix 2.4: tiers that already get a dedicated topic recommendation card
  // (full mode only) should not repeat those same topics here.
  const tiersDedupedAgainstCards =
    hideTopicRowKeysForTiers && hideTopicRowKeysForTiers.size > 0
      ? new Set([
          PARENT_TOPIC_TIER.STRENGTHEN,
          PARENT_TOPIC_TIER.CLEAR_GAP,
          PARENT_TOPIC_TIER.ADVANCED_PRACTICE,
          PARENT_TOPIC_TIER.FOUNDATION_PRACTICE,
        ])
      : null;
  const sections = order
    .map((tier) => {
      const allRows = Array.isArray(groups[tier]) ? groups[tier] : [];
      const rows =
        tiersDedupedAgainstCards && tiersDedupedAgainstCards.has(tier)
          ? allRows.filter((row) => !hideTopicRowKeysForTiers.has(row?.topicRowKey))
          : allRows;
      if (!rows.length) return null;
      return (
        <div key={tier} className="parent-surface-only pr-detailed-topic-tier-group mb-3">
          <p className="pr-detailed-topic-rec-head">{parentTopicTierSectionTitleHe(tier)}</p>
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.topicRowKey}
                className="pr-detailed-topic-overview-item rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2.5"
              >
                <div className="pr-detailed-body-text font-bold text-white/95 leading-snug">
                  {row.narrativeTitleHe}
                </div>
                {row.gradeRelationSublineHe ? (
                  <p className="pr-detailed-muted text-xs m-0 mt-0.5 text-white/60">
                    {row.gradeRelationSublineHe}
                  </p>
                ) : null}
                <p className="pr-detailed-body-text text-sm m-0 mt-1.5 text-white/[0.88]">
                  {row.overviewStatusHe} · {formatTopicQuestionCountHe(row.questions)} · {row.accuracy}% accuracy
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    })
    .filter(Boolean);
  if (!sections.length) return null;
  return <div className="pr-detailed-topic-overview-block parent-surface-only space-y-1">{sections}</div>;
}

export function SubjectPrimaryActionBlock({ actionHe }) {
  const text = pr1ParentVisibleTextHe(String(actionHe || ""));
  if (!text) return null;
  return (
    <div className="parent-surface-only rounded-lg border border-amber-400/28 bg-amber-950/14 px-3 py-2.5">
      <p className="pr-detailed-mini-heading font-bold text-amber-100/95 mb-1 text-sm">
        What to do in this subject
      </p>
      <p className="pr-detailed-body-text text-sm leading-relaxed m-0 text-white/[0.91]">{text}</p>
    </div>
  );
}

/** Short subject breakdown — only fields from the existing payload (no separate engine) */
export function SubjectSummaryBlock({ sp }) {
  const L = useMemo(() => buildSubjectParentLetterDetailedPhase1(sp), [sp]);
  const riskChips = useMemo(() => subjectMajorRiskLabelsHe(sp?.majorRiskFlagsAcrossRows, 4), [sp]);
  const q = Number(sp?.subjectQuestionCount) || 0;
  const a = Number(sp?.subjectAccuracy) || 0;
  return (
    <div className="pr-detailed-summary-subject pr-detailed-subject-stack min-w-0">
      <div className="pr-detailed-subject-heading">
        <h3 className="pr-detailed-subject-title text-base md:text-lg font-bold text-white m-0 tracking-tight pb-2 border-b border-white/12">
          {sp.subjectLabelHe}
        </h3>
        <p className="pr-detailed-subject-metrics text-xs md:text-sm m-0 mt-1 text-white/75">
          Questions: {q} | Accuracy: {a}%
        </p>
      </div>
      <div className="pr-detailed-subject-inner space-y-2.5 pt-3">
        <SubjectPhase3Insights sp={sp} compact />
        {L.opening ? (
          <p className="pr-detailed-body-text text-sm leading-relaxed m-0">{L.opening}</p>
        ) : null}
        {riskChips.length ? (
          <div className="flex flex-wrap gap-1">
            {riskChips.map((lab) => (
              <span
                key={lab}
                className="inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-400/35 bg-rose-950/25 text-rose-100/95"
              >
                {lab}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Cleans parent-facing display text sourced from engine fields — without changing the payload */
function topicStripParentClean(s) {
  let t = sanitizeEngineSnippetHe(String(s || ""));
  t = t.replace(/\u0001/g, " ");
  t = t.replace(/\bundetermined\b/gi, "");
  t = t.replace(/\bdefault_[a-z0-9_]+\b/gi, "");
  t = t.replace(
    /\b(advance_level|advance_grade_topic_only|maintain_and_strengthen|remediate_same_level|drop_one_level_topic_only|drop_one_grade_topic_only)\b/g,
    ""
  );
  t = t.replace(/\b(no_memory|light_memory|not_enough_evidence)\b/gi, "");
  t = t.replace(/\bresponseMs\b|\bretry\b|\bhint\b/gi, "");
  t = t.replace(/\blow_?confidence\b|\bmin_?questions\b|\btier\b/gi, "");
  t = t.replace(/\b[a-z][a-z0-9_]{10,}\b/g, "");
  t = t.replace(/\s{2,}/g, " ").trim();
  t = normalizeParentFacingHe(t);
  if (!t) return "";
  const numericOnly = /^[\d\s.,/%\-–-]+$/u.test(t);
  if (numericOnly) return "";
  if (/^0{2,}$/u.test(t)) return "";
  return t;
}

function topicStripNorm(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Topic recommendation explain strip — up to 3 parent-facing layers: what we saw / what it means / direction to work on */
export function TopicRecommendationExplainStrip({ tr, suppressedLines = [] }) {
  const suppressLegacy = shouldSuppressLegacyEngineParentCopy(tr);

  const lpdSections = suppressLegacy ? buildLpdSafeTopicExplainSectionsHe(tr) : null;
  const legacySections = suppressLegacy ? null : buildTopicDiagnosticExplainSectionsHe(tr);
  const explainSections = lpdSections || legacySections;

  if (explainSections) {
    const suppressed = new Set(
      (Array.isArray(suppressedLines) ? suppressedLines : [])
        .map((x) => topicStripNorm(x))
        .filter(Boolean),
    );
    const seenRowNorm = new Set();
    const trendLine = trendV1DisplayLineHe(tr?.trendV1 || tr?.mapRow?.trendV1);
    const sectionRows = [
      explainSections.identified,
      explainSections.data,
      trendLine || null,
      explainSections.pattern,
      explainSections.meaning,
      explainSections.action,
    ].filter((body) => {
      const n = topicStripNorm(body);
      if (!n) return false;
      if (suppressed.has(n)) return false;
      if (seenRowNorm.has(n)) return false;
      seenRowNorm.add(n);
      return true;
    });

    if (!sectionRows.length) return null;

    return (
      <div
        className="pr-detailed-topic-phase2 mt-2 space-y-1.5 border-t border-white/10 pt-2"
        data-testid="parent-report-lpd-topic-explain"
      >
        {sectionRows.map((body) => (
          <p
            key={topicStripNorm(body)}
            className="pr-detailed-body-text text-[11px] md:text-xs m-0 text-white/80 leading-snug"
            {...(topicStripNorm(body) === topicStripNorm(trendLine)
              ? { "data-testid": "parent-report-topic-trend-v1" }
              : {})}
          >
            {body}
          </p>
        ))}
      </div>
    );
  }

  return null;
}
