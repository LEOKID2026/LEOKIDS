/**
 * Owner-authored topic-level copy — Phase B+C+D (templateId + slots only).
 * Strings resolve via report burn-down packs (locale-aware).
 */

import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";

const SLUG = "utils__parent-report-language__parent-report-owner-topic-copy-templates";

/** @typedef {{
 *   topicName: string,
 *   subjectName: string,
 *   questions: number,
 *   correct: number,
 *   wrong: number,
 *   accuracy: number,
 *   detectedPattern: string|null,
 *   affectedSubskill: string|null,
 *   misconceptionLabel: string|null,
 *   recommendedAction: string|null,
 *   evidenceStrength: string,
 *   decisionCode: string,
 *   baseTemplateId: string,
 *   narrativeEnvelope: string|null,
 * }} TopicOwnerCopySlots */

/** @param {unknown} v */
function str(v) {
  return v != null ? String(v).trim() : "";
}

/** @param {TopicOwnerCopySlots} s */
function hasPattern(s) {
  return !!str(s.detectedPattern);
}

function formatQuestionsText(n) {
  const q = Math.max(0, Math.round(Number(n) || 0));
  return reportPackCopy(SLUG, "questions_text", { questions: q });
}

function formatCorrectText(n) {
  const c = Math.max(0, Math.round(Number(n) || 0));
  return reportPackCopy(SLUG, "correct_text", { correct: c });
}

function formatWrongText(n) {
  const w = Math.max(0, Math.round(Number(n) || 0));
  return reportPackCopy(SLUG, "wrong_text", { wrong: w });
}

function hasBreakdown(s) {
  const q = Math.max(0, Math.round(Number(s.questions) || 0));
  const c = Math.max(0, Math.round(Number(s.correct) || 0));
  const w = Math.max(0, Math.round(Number(s.wrong) || 0));
  return q > 0 && c + w === q && (c > 0 || w > 0);
}

function hasReliableAccuracy(s) {
  const q = Math.max(0, Math.round(Number(s.questions) || 0));
  if (q <= 0) return false;
  const acc = Math.round(Number(s.accuracy) || 0);
  const c = Math.max(0, Math.round(Number(s.correct) || 0));
  const w = Math.max(0, Math.round(Number(s.wrong) || 0));
  if (acc <= 0 && c === 0 && w === q) return false;
  return Number.isFinite(acc);
}

/** @param {TopicOwnerCopySlots} s */
function renderTopicDataLine(s) {
  const topicName = s.topicName;
  const qText = formatQuestionsText(s.questions);
  if (hasBreakdown(s)) {
    let line = reportPackCopy(SLUG, "data_line_breakdown", {
      qText,
      topicName,
      correctText: formatCorrectText(s.correct),
      wrongText: formatWrongText(s.wrong),
    });
    if (hasReliableAccuracy(s) && s.accuracy > 0) {
      line += reportPackCopy(SLUG, "data_line_accuracy_suffix", { accuracy: s.accuracy });
    }
    return line;
  }
  if (hasReliableAccuracy(s) && s.accuracy > 0) {
    return reportPackCopy(SLUG, "data_line_with_accuracy", {
      qText,
      topicName,
      accuracy: s.accuracy,
    });
  }
  return reportPackCopy(SLUG, "data_line_basic", { qText, topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderTopicPatternLine(s) {
  if (!hasPattern(s)) return "";
  return reportPackCopy(SLUG, "pattern_line", { detectedPattern: s.detectedPattern });
}

/** @param {string} base @param {TopicOwnerCopySlots} s */
function appendPatternToSnapshot(base, s) {
  if (!hasPattern(s)) return base;
  return `${base}${reportPackCopy(SLUG, "pattern_suffix", { detectedPattern: s.detectedPattern })}`;
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedBase(s) {
  const topicName = s.topicName;
  const qText = formatQuestionsText(s.questions);
  let base;
  if (s.decisionCode === "clear_topic_gap") {
    base = reportPackCopy(SLUG, "difficulty_base_clear_gap", {
      topicName,
      qText,
      accuracy: s.accuracy,
    });
  } else {
    base = reportPackCopy(SLUG, "difficulty_base_default", {
      topicName,
      qText,
      accuracy: s.accuracy,
    });
  }
  return appendPatternToSnapshot(base, s);
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedIdentified(s) {
  if (hasPattern(s)) {
    return reportPackCopy(SLUG, "difficulty_identified_pattern", { topicName: s.topicName });
  }
  return reportPackCopy(SLUG, "difficulty_identified_default", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedData(s) {
  return renderTopicDataLine(s);
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedPattern(s) {
  return renderTopicPatternLine(s);
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedMeaning(s) {
  if (s.decisionCode === "clear_topic_gap") {
    return reportPackCopy(SLUG, "difficulty_meaning_clear_gap", { topicName: s.topicName });
  }
  return reportPackCopy(SLUG, "difficulty_meaning_default", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedHomeAction(s) {
  if (hasPattern(s)) {
    return reportPackCopy(SLUG, "difficulty_home_pattern", {
      topicName: s.topicName,
      detectedPattern: s.detectedPattern,
    });
  }
  return reportPackCopy(SLUG, "difficulty_home_default", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedStepLabel(s) {
  if (s.decisionCode === "clear_topic_gap") {
    return reportPackCopy(SLUG, "difficulty_step_clear_gap");
  }
  return reportPackCopy(SLUG, "difficulty_step_default");
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedInterventionPlan(s) {
  if (hasPattern(s)) {
    return reportPackCopy(SLUG, "difficulty_plan_pattern", {
      topicName: s.topicName,
      detectedPattern: s.detectedPattern,
    });
  }
  return reportPackCopy(SLUG, "difficulty_plan_default", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedDoNow(s) {
  if (hasPattern(s)) {
    return reportPackCopy(SLUG, "difficulty_donow_pattern", {
      topicName: s.topicName,
      detectedPattern: s.detectedPattern,
    });
  }
  return reportPackCopy(SLUG, "difficulty_donow_default", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderPositiveObservedBase(s) {
  return reportPackCopy(SLUG, "positive_base", {
    topicName: s.topicName,
    qText: formatQuestionsText(s.questions),
    accuracy: s.accuracy,
  });
}

/** @param {TopicOwnerCopySlots} s */
function renderPositiveObservedIdentified(s) {
  return reportPackCopy(SLUG, "positive_identified", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderPositiveObservedData(s) {
  return renderTopicDataLine(s);
}

/** @param {TopicOwnerCopySlots} _s */
function renderPositiveObservedMeaning(_s) {
  return reportPackCopy(SLUG, "positive_meaning", { topicName: _s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderPositiveObservedHomeAction(s) {
  return reportPackCopy(SLUG, "positive_home", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} _s */
function renderPositiveObservedStepLabel(_s) {
  return reportPackCopy(SLUG, "positive_step");
}

/** @param {TopicOwnerCopySlots} _s */
function renderPositiveObservedCaution(_s) {
  return reportPackCopy(SLUG, "positive_caution");
}

/** @param {TopicOwnerCopySlots} s */
function renderInitialTopicDataBase(s) {
  const topicName = s.topicName;
  if (s.questions === 1) {
    return reportPackCopy(SLUG, "initial_base_one", { topicName });
  }
  return reportPackCopy(SLUG, "initial_base_few", {
    topicName,
    questions: s.questions,
  });
}

/** @param {TopicOwnerCopySlots} s */
function renderInitialTopicDataIdentified(s) {
  return reportPackCopy(SLUG, "initial_identified", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderInitialTopicDataData(s) {
  return renderTopicDataLine(s);
}

/** @param {TopicOwnerCopySlots} _s */
function renderInitialTopicDataMeaning(_s) {
  return reportPackCopy(SLUG, "initial_meaning");
}

/** @param {TopicOwnerCopySlots} s */
function renderInitialTopicDataHomeAction(s) {
  return reportPackCopy(SLUG, "initial_home", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderPracticeFocusBase(s) {
  return reportPackCopy(SLUG, "practice_base", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderPracticeFocusIdentified(s) {
  return reportPackCopy(SLUG, "practice_identified", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderPracticeFocusData(s) {
  return renderTopicDataLine(s);
}

/** @param {TopicOwnerCopySlots} _s */
function renderPracticeFocusMeaning(_s) {
  return reportPackCopy(SLUG, "practice_meaning");
}

/** @param {TopicOwnerCopySlots} s */
function renderPracticeFocusHomeAction(s) {
  return reportPackCopy(SLUG, "practice_home", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedBase(s) {
  const base = reportPackCopy(SLUG, "mixed_base", { topicName: s.topicName });
  return appendPatternToSnapshot(base, s);
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedIdentified(s) {
  if (hasPattern(s)) {
    return reportPackCopy(SLUG, "mixed_identified_pattern", { topicName: s.topicName });
  }
  return reportPackCopy(SLUG, "mixed_identified_default", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedData(s) {
  return renderTopicDataLine(s);
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedPattern(s) {
  return renderTopicPatternLine(s);
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedMeaning(s) {
  return reportPackCopy(SLUG, "mixed_meaning", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedHomeAction(s) {
  return reportPackCopy(SLUG, "mixed_home", { topicName: s.topicName });
}

/** @param {TopicOwnerCopySlots} s */
function renderNarrativeWe0Snapshot(s) {
  if (s.decisionCode === "early_direction_only") {
    return renderInitialTopicDataBase(s);
  }
  if (s.decisionCode === "clear_topic_gap") {
    return renderDifficultyObservedBase(s);
  }
  return "";
}

/** @param {TopicOwnerCopySlots} s */
function renderNarrativeWe0Caution(s) {
  if (s.decisionCode === "early_direction_only") {
    return reportPackCopy(SLUG, "narrative_we0_caution_early");
  }
  if (s.decisionCode === "clear_topic_gap") {
    return reportPackCopy(SLUG, "narrative_we0_caution_gap");
  }
  return "";
}

/** @param {TopicOwnerCopySlots} s */
function renderNarrativeWe1Snapshot(s) {
  return renderDifficultyObservedBase(s);
}

/** @param {TopicOwnerCopySlots} s */
function renderNarrativeWe2Snapshot(s) {
  if (hasPattern(s)) {
    return renderMixedBase(s);
  }
  return renderDifficultyObservedBase(s);
}

/** @param {TopicOwnerCopySlots} s */
function renderNarrativeWe2Caution(s) {
  if (hasPattern(s)) {
    return reportPackCopy(SLUG, "narrative_we2_caution_pattern", {
      detectedPattern: s.detectedPattern,
    });
  }
  return reportPackCopy(SLUG, "narrative_we2_caution_default");
}

/** @type {Record<string, (s: TopicOwnerCopySlots) => string>} */
export const parentReportOwnerTopicCopyTemplatesHe = Object.freeze({
  difficulty_observed: renderDifficultyObservedBase,
  "difficulty_observed:TOPIC_EXPLAIN_IDENTIFIED": renderDifficultyObservedIdentified,
  "difficulty_observed:TOPIC_EXPLAIN_DATA": renderDifficultyObservedData,
  "difficulty_observed:TOPIC_EXPLAIN_PATTERN": renderDifficultyObservedPattern,
  "difficulty_observed:TOPIC_EXPLAIN_MEANING": renderDifficultyObservedMeaning,
  "difficulty_observed:TOPIC_EXPLAIN_HOME_ACTION": renderDifficultyObservedHomeAction,
  "difficulty_observed:RECOMMENDATION_STEP_LABEL": renderDifficultyObservedStepLabel,
  "difficulty_observed:RECOMMENDATION_FINDING": renderDifficultyObservedBase,
  "difficulty_observed:RECOMMENDATION_INTERVENTION_PLAN": renderDifficultyObservedInterventionPlan,
  "difficulty_observed:RECOMMENDATION_DO_NOW": renderDifficultyObservedDoNow,
  positive_observed: renderPositiveObservedBase,
  "positive_observed:TOPIC_EXPLAIN_IDENTIFIED": renderPositiveObservedIdentified,
  "positive_observed:TOPIC_EXPLAIN_DATA": renderPositiveObservedData,
  "positive_observed:TOPIC_EXPLAIN_MEANING": renderPositiveObservedMeaning,
  "positive_observed:TOPIC_EXPLAIN_HOME_ACTION": renderPositiveObservedHomeAction,
  "positive_observed:RECOMMENDATION_STEP_LABEL": renderPositiveObservedStepLabel,
  "positive_observed:RECOMMENDATION_FINDING": renderPositiveObservedBase,
  "positive_observed:RECOMMENDATION_CAUTION": renderPositiveObservedCaution,
  initial_topic_data: renderInitialTopicDataBase,
  "initial_topic_data:TOPIC_EXPLAIN_IDENTIFIED": renderInitialTopicDataIdentified,
  "initial_topic_data:TOPIC_EXPLAIN_DATA": renderInitialTopicDataData,
  "initial_topic_data:TOPIC_EXPLAIN_MEANING": renderInitialTopicDataMeaning,
  "initial_topic_data:TOPIC_EXPLAIN_HOME_ACTION": renderInitialTopicDataHomeAction,
  practice_focus: renderPracticeFocusBase,
  "practice_focus:TOPIC_EXPLAIN_IDENTIFIED": renderPracticeFocusIdentified,
  "practice_focus:TOPIC_EXPLAIN_DATA": renderPracticeFocusData,
  "practice_focus:TOPIC_EXPLAIN_MEANING": renderPracticeFocusMeaning,
  "practice_focus:TOPIC_EXPLAIN_HOME_ACTION": renderPracticeFocusHomeAction,
  mixed: renderMixedBase,
  "mixed:TOPIC_EXPLAIN_IDENTIFIED": renderMixedIdentified,
  "mixed:TOPIC_EXPLAIN_DATA": renderMixedData,
  "mixed:TOPIC_EXPLAIN_PATTERN": renderMixedPattern,
  "mixed:TOPIC_EXPLAIN_MEANING": renderMixedMeaning,
  "mixed:TOPIC_EXPLAIN_HOME_ACTION": renderMixedHomeAction,
  NARRATIVE_WE0_snapshot: renderNarrativeWe0Snapshot,
  NARRATIVE_WE0_cautionLineHe: renderNarrativeWe0Caution,
  NARRATIVE_WE1_snapshot: renderNarrativeWe1Snapshot,
  NARRATIVE_WE2_snapshot: renderNarrativeWe2Snapshot,
  NARRATIVE_WE2_cautionLineHe: renderNarrativeWe2Caution,
});

/**
 * @param {string} templateId
 * @param {TopicOwnerCopySlots|null|undefined} slots
 * @returns {string|null}
 */
export function renderOwnerTopicCopyTemplateHe(templateId, slots) {
  const id = str(templateId);
  if (!id || !slots) return null;
  const fn = parentReportOwnerTopicCopyTemplatesHe[id];
  if (!fn) return null;
  const text = str(fn(slots));
  return text || null;
}

export const TOPIC_EXPLAIN_SECTION_TEMPLATE_SUFFIX = Object.freeze({
  identified: "TOPIC_EXPLAIN_IDENTIFIED",
  data: "TOPIC_EXPLAIN_DATA",
  pattern: "TOPIC_EXPLAIN_PATTERN",
  meaning: "TOPIC_EXPLAIN_MEANING",
  action: "TOPIC_EXPLAIN_HOME_ACTION",
});

/**
 * @param {string} baseTemplateId
 * @param {keyof typeof TOPIC_EXPLAIN_SECTION_TEMPLATE_SUFFIX} section
 */
export function topicExplainTemplateId(baseTemplateId, section) {
  const base = str(baseTemplateId);
  const suffix = TOPIC_EXPLAIN_SECTION_TEMPLATE_SUFFIX[section];
  if (!base || !suffix) return base;
  return `${base}:${suffix}`;
}

/**
 * @param {string} envelope e.g. WE0
 * @param {"snapshot"|"cautionLineHe"} section
 */
export function narrativeOwnerTemplateId(envelope, section) {
  const env = str(envelope).toUpperCase();
  if (!env) return "";
  return `NARRATIVE_${env}_${section}`;
}
