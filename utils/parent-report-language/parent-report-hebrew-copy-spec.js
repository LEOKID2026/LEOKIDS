/**
 * Parent report copy — English literal templates (Global product).
 * Do not invent wording here; add new strings deliberately and keep them parent-friendly.
 */

import {
  PARENT_TOPIC_HOME_ACTION_HEADING as PARENT_TOPIC_HOME_ACTION_HEADING_HE,
  resolveParentFacingPatternLabel as resolveParentFacingPatternLabelHe,
} from "../learning-pattern-decision/parent-facing-error-pattern.js";

/** @typedef {{ subject?: string, topic?: string, q?: number, acc?: number, wrongRatio?: number|null, pattern?: string, action?: string, rootCause?: string, strongTopic?: string, weakTopic?: string, totalAnswers?: number, diagnosticAnswers?: number }} CopyVars */

/** Spec §9 — forbidden verbatim phrases in parent-facing output */
export const SPEC_FORBIDDEN_PARENT_PHRASES = Object.freeze([
  "foundation gap",
  "basic difficulty",
  "fragile success",
  "appears to be a difficulty in",
  "there are repeated mistakes in",
  "worth reviewing at a slow pace",
  "worth paying attention to",
  "this is a topic that keeps recurring in practice",
  "overall performance in this period indicates a need for further reinforcement",
  "the pattern observed in performance",
  "caution considerations were also kept",
  "simpler parts of the topic",
  "not determined",
  "natural noise of early learning",
  "not enough information",
  "not yet enough information",
  "there are several types of mistakes",
  "no single clear pattern yet",
  "conceptual confusion",
  "unstable knowledge point",
  "clear_topic_gap",
  "partial_stable",
  "mastery_stable",
  "topic_needs_strengthening",
  "early_direction_only",
  "insufficient_data",
  "engineDecision",
  "safeSubskill",
  "taxonomy",
  "metadata",
  "candidate",
  "fallback",
]);

const MEANING_BY_ROOT_CAUSE_INSIGHT = Object.freeze({
  knowledge_gap: "The data points to a skill that is still not fully stable.",
  speed_pressure: "Some of the mistakes look related to speed - not necessarily a full knowledge gap.",
  instruction_friction: "The difficulty may be related to understanding the instructions, not just knowledge of the topic.",
  careless_execution: "The material looks partly familiar, but there are execution mistakes that repeat when working quickly.",
  weak_independence: "The child does better with support, and it still helps to build up independent problem-solving.",
  insufficient_evidence: "There are still only a few answers - a little more practice would help before drawing a clear conclusion.",
  preliminary_direction: "There is an early direction, but a bit more practice would help before drawing a clear conclusion.",
  recurring_pattern:
    "A recurring pattern already shows up in this topic, so it is worth addressing and reinforcing. It still helps to keep practicing to confirm the pattern holds over time.",
  recurring_pattern_supported:
    "A recurring pattern already shows up in this topic across several sessions, so it is worth addressing and reinforcing. It helps to keep practicing to confirm the pattern holds over time.",
  no_consistent_pattern: "There is already some practice in this topic, but a consistent enough pattern has not appeared yet.",
  mixed_signal: "There are a few possible directions - worth checking again after a bit more practice.",
  early_stage_instability: "There are still only a few answers - a little more practice would help before drawing a clear conclusion.",
  mixed: "There are a few possible directions - worth checking again after a bit more practice.",
});

const MEANING_BY_BEHAVIOR_EXPLAIN = Object.freeze({
  knowledge_gap:
    "There is a skill in this topic that is still not fully stable. The report relies on accuracy and the rate of mistakes.",
  fragile_success:
    "The child gets to some of the correct answers, but consistency is not there yet. It is worth checking the solving method, not just the final result.",
  speed_pressure:
    "Some of the mistakes look related to speed or time pressure, so it would not be right to conclude right away that the whole topic is not understood.",
  instruction_friction:
    "The difficulty may be related to reading the instructions or understanding what the question is asking, not just knowledge of the topic.",
  careless_execution:
    "The child seems to know part of the material, but there are execution mistakes that repeat when rushing or skipping a step.",
  careless_pattern:
    "The child seems to know part of the material, but there are execution mistakes that repeat when rushing or skipping a step.",
  weak_independence:
    "The child does better with support or hints, and it still helps to build up independent problem-solving.",
  stable_mastery:
    "The data points to good command of the topic right now. It's important to maintain this skill rather than assume the whole subject is already stable.",
  insufficient_evidence:
    "There are still only a few answers - a little more practice would help before drawing a clear conclusion.",
  undetermined:
    "There are still only a few answers - a little more practice would help before drawing a clear conclusion.",
  mixed_low_signal:
    "There are still only a few answers - a little more practice would help before drawing a clear conclusion.",
  mixed_signal:
    "There are signs pointing in a few different directions, so the report recommends moving forward carefully instead of drawing one strong conclusion.",
  mixed:
    "There are signs pointing in a few different directions, so the report recommends moving forward carefully instead of drawing one strong conclusion.",
});

const ACTION_BY_ROOT_CAUSE = Object.freeze({
  knowledge_gap:
    "Go over similar questions in the same topic and difficulty level, and ask the child to explain the solving steps out loud.",
  speed_pressure: "Solve a few questions without a timer, pause before submitting, and check whether the answer fits the question.",
  instruction_friction:
    "Read the instructions together, mark what the question is asking for, and only then solve the question.",
  careless_execution:
    "Solve slowly and do a short final check: did I answer what was asked, and did I skip a step.",
  weak_independence:
    "Let the child try first on their own, and only then check together. The goal is to build independent problem-solving before getting help.",
  fragile_success:
    "Solve a small number of similar questions, pause on the first attempt, and check why that first answer was chosen.",
  stable_mastery:
    "Keep the topic fresh with short practice, and gradually add slightly more challenging questions if accuracy holds.",
  insufficient_evidence:
    "There are still only a few answers - a bit more practice on this topic would help, then check the report again.",
  preliminary_direction: "Do a few more questions on this topic, then check the report again.",
  recurring_pattern:
    "Go over similar questions in this topic, reinforce the point that keeps recurring, and check again after more practice.",
  recurring_pattern_supported:
    "Keep up focused practice on this topic, reinforce the point that keeps recurring, and confirm the improvement holds going forward.",
  no_consistent_pattern:
    "Keep up short practice on this topic to see whether a consistent pattern forms.",
  mixed_signal:
    "Keep up short practice on this topic - worth checking again after a few more questions.",
  early_stage_instability:
    "Do a few more questions on this topic, then check the report again.",
});

/** Spec §3 — mistake pattern parent text by engine id */
export const MISTAKE_PATTERN_PARENT_HE = Object.freeze({
  insufficient_mistake_evidence: "",
  recurring_weakness: "Some mistakes repeat in the same type of activity.",
  insufficient_recurrence: "",
  early_signal: "",
  speed_driven_error: "Some mistakes happened while working quickly.",
  instruction_misread: "Some mistakes appear related to understanding the instructions.",
  support_dependent_success: "Success mostly happens with guidance or hints.",
  careless_flip: "Small execution mistakes that repeat when working quickly.",
  concept_confusion: "",
  procedure_break: "Confusion about the order of steps in solving.",
  mixed_mistake_pattern: "",
  early_learning_noise: "",
});

/** Spec §4 — foundation dependency parent text by engine id */
export const DEPENDENCY_STATE_PARENT_HE = Object.freeze({
  insufficient_dependency_evidence:
    "There is not yet enough information to know whether the difficulty is in the topic itself or in its foundation.",
  likely_local_issue: "The signs mostly point to a difficulty within this topic itself.",
  likely_foundational_block:
    "There is a sign that the difficulty may be related to the foundation of this topic, but there is no mapping yet showing exactly which foundational part is involved.",
  mixed_dependency_signal:
    "There are signs of a difficulty in the topic itself, and also signs that the foundation may be a factor. It's best to move forward carefully rather than draw one strong conclusion.",
  accuracy_foundation_gap:
    "The low accuracy repeats enough to suspect the foundation of this topic is still not stable, but there is no precise identification of the underlying sub-topic.",
});

/** Spec §2.1 — allowed step labels for parent explain block */
const STEP_LABEL_BY_ENGINE_STEP = Object.freeze({
  maintain_and_strengthen: "keep building at the same level",
  remediate_same_level: "reinforce at the same level",
  advance_level: "raise the difficulty level for this topic only",
  advance_grade_topic_only: "move up a grade level for this topic only",
  drop_one_level_topic_only: "lower the difficulty level for this topic only",
  drop_one_grade_topic_only: "lower the difficulty level for this topic only",
});

const SUBJECT_ID_TO_LABEL = Object.freeze({
  math: "Math",
  geometry: "Geometry",
  english: "English",
  science: "Science",
  hebrew: "Hebrew",
  "moledet-geography": "Social Studies & Geography",
});

function clean(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

function subjectLabel(subject, subjectId) {
  const s = clean(subject);
  if (s) return s;
  return SUBJECT_ID_TO_LABEL[String(subjectId || "")] || "";
}

/**
 * @param {string} [recommendedNextStep]
 * @param {string} [recommendedStepLabelHe]
 */
export function parentStepLabelHe(recommendedNextStep, recommendedStepLabelHe) {
  const step = clean(recommendedNextStep);
  if (step && STEP_LABEL_BY_ENGINE_STEP[step]) return STEP_LABEL_BY_ENGINE_STEP[step];
  const lab = clean(recommendedStepLabelHe);
  for (const allowed of Object.values(STEP_LABEL_BY_ENGINE_STEP)) {
    if (lab === allowed) return allowed;
  }
  if (lab.includes("keep building")) return STEP_LABEL_BY_ENGINE_STEP.maintain_and_strengthen;
  if (lab.includes("reinforce")) return STEP_LABEL_BY_ENGINE_STEP.remediate_same_level;
  if (lab.includes("raise the difficulty")) return STEP_LABEL_BY_ENGINE_STEP.advance_level;
  if (lab.includes("move up a grade")) return STEP_LABEL_BY_ENGINE_STEP.advance_grade_topic_only;
  if (lab.includes("lower the difficulty")) return STEP_LABEL_BY_ENGINE_STEP.drop_one_level_topic_only;
  return "";
}

/**
 * @param {string} [dominantMistakePattern]
 * @param {string} [dominantMistakePatternLabelHe]
 */
export function patternTextFromEngineHe(dominantMistakePattern, dominantMistakePatternLabelHe) {
  const id = clean(dominantMistakePattern);
  if (id && MISTAKE_PATTERN_PARENT_HE[id]) return MISTAKE_PATTERN_PARENT_HE[id];
  void dominantMistakePatternLabelHe;
  return "";
}

/**
 * @param {string} [dependencyState]
 */
export function foundationTextFromEngineHe(dependencyState) {
  const dep = clean(dependencyState);
  if (dep && DEPENDENCY_STATE_PARENT_HE[dep]) return DEPENDENCY_STATE_PARENT_HE[dep];
  return "";
}

/**
 * @param {string} [rootCause]
 * @param {string} [diagnosticType]
 */
export function meaningInsightSentenceHe(rootCause, diagnosticType) {
  const rc = clean(rootCause);
  if (rc && MEANING_BY_ROOT_CAUSE_INSIGHT[rc]) return MEANING_BY_ROOT_CAUSE_INSIGHT[rc];
  const bt = clean(diagnosticType);
  if (bt === "knowledge_gap") return MEANING_BY_ROOT_CAUSE_INSIGHT.knowledge_gap;
  if (bt === "speed_pressure") return MEANING_BY_ROOT_CAUSE_INSIGHT.speed_pressure;
  if (bt === "instruction_friction") return MEANING_BY_ROOT_CAUSE_INSIGHT.instruction_friction;
  if (bt === "careless_pattern") return MEANING_BY_ROOT_CAUSE_INSIGHT.careless_execution;
  if (bt === "fragile_success") return MEANING_BY_ROOT_CAUSE_INSIGHT.weak_independence;
  return "The report is flagging this topic to keep an eye on, but there isn't yet a more precise underlying reason.";
}

/**
 * @param {string} [rootCause]
 * @param {string} [diagnosticType]
 */
export function meaningExplainSentenceHe(rootCause, diagnosticType) {
  const rc = clean(rootCause);
  if (rc && MEANING_BY_BEHAVIOR_EXPLAIN[rc]) return MEANING_BY_BEHAVIOR_EXPLAIN[rc];
  const bt = clean(diagnosticType);
  if (bt && MEANING_BY_BEHAVIOR_EXPLAIN[bt]) return MEANING_BY_BEHAVIOR_EXPLAIN[bt];
  return MEANING_BY_BEHAVIOR_EXPLAIN.undetermined;
}

/**
 * @param {string} [rootCause]
 * @param {string} [diagnosticType]
 * @param {string} [engineAction]
 */
export function actionTextHe(rootCause, diagnosticType, engineAction) {
  const rc = clean(rootCause);
  if (rc && ACTION_BY_ROOT_CAUSE[rc]) return ACTION_BY_ROOT_CAUSE[rc];
  const bt = clean(diagnosticType);
  if (bt === "fragile_success" && ACTION_BY_ROOT_CAUSE.fragile_success) return ACTION_BY_ROOT_CAUSE.fragile_success;
  if (bt === "stable_mastery" && ACTION_BY_ROOT_CAUSE.stable_mastery) return ACTION_BY_ROOT_CAUSE.stable_mastery;
  const eng = clean(engineAction);
  if (eng) return eng;
  return "Keep up short practice on this topic, without drawing a more precise conclusion just yet.";
}

/** Spec §1.2 zero diagnostic */
export function activityGapZeroDiagnosticHe(totalAnswers) {
  return (
    `There were ${Math.round(Number(totalAnswers) || 0)} answers on the site, but 0 counted toward the learning report. ` +
    "So the report doesn't yet show a full learning picture. For a more accurate picture, it helps to also do regular practice questions in the core subjects."
  );
}

/** Spec §1.2 partial diagnostic */
export function activityGapPartialDiagnosticHe(totalAnswers, diagnosticAnswers) {
  return (
    `There were ${Math.round(Number(totalAnswers) || 0)} answers on the site, but only ${Math.round(Number(diagnosticAnswers) || 0)} counted toward the learning report. ` +
    "So the conclusions are still partial. For a more accurate picture, it helps to do more regular practice questions in the core subjects."
  );
}

/** Spec §1.2 non-diagnostic only */
export function activityGapNonDiagnosticOnlyHe() {
  return (
    "There was activity on the site during this period, but most of it isn't the kind that lets the report draw a precise learning conclusion. " +
    "Adding regular practice questions would help the report identify strengths and areas to reinforce."
  );
}

/** Spec §1.3 */
export function noUrgentTopicInsightHe() {
  return (
    "There is practice in the selected period, but the system has not yet identified one standout topic that needs special reinforcement. " +
    "It helps to continue with short, regular practice and check that stability holds going forward."
  );
}

/** Spec §1.4 */
export function mixedSubjectStrongWeakHe(subject, strongTopic, weakTopic) {
  const subj = clean(subject);
  const strong = clean(strongTopic);
  const weak = clean(weakTopic);
  if (!subj || !strong || !weak || strong === weak) return "";
  return (
    `${subj} shows a mixed picture: ${strong} looks like a strength, but ${weak} still has a point worth reinforcing. ` +
    "That's why the report breaks the subject down by topic instead of giving one overall conclusion."
  );
}

/**
 * Post-processes insight/action text for low-data cases so the phrase matches actual q.
 * @param {string} text
 * @param {number} q
 */
function adjustInsufficientEvidenceByQHe(text, q) {
  const t = String(text || "");
  if (!t.includes("only a few answers")) return t;
  const n = Math.round(Number(q) || 0);
  if (n <= 5) return "Still very little data - a bit more practice will help us get a clearer picture.";
  if (n <= 15) return "There is an early direction, but a bit more practice would help before drawing a clear conclusion.";
  return "This looks like a topic worth reinforcing in upcoming practice.";
}

/**
 * Spec §1.1 topic attention insight
 * @param {CopyVars & { rootCause?: string, diagnosticType?: string, patternId?: string, engineAction?: string }} p
 */
export function topicAttentionInsightHe(p) {
  const subj = subjectLabel(p.subject, p.subjectId);
  const topic = clean(p.topic);
  const q = Math.round(Number(p.q) || 0);
  const acc = Math.round(Number(p.acc) || 0);
  let wr = p.wrongRatio;
  if (wr == null || !Number.isFinite(Number(wr))) wr = Math.max(0, Math.min(100, 100 - acc));
  else wr = Math.round(Number(wr));

  const patternText = patternTextFromEngineHe(p.patternId, p.pattern);
  const patternSentence = patternText
    ? patternText.endsWith(".")
      ? patternText
      : `${patternText}.`
    : "";

  const meaningSentence = adjustInsufficientEvidenceByQHe(
    meaningInsightSentenceHe(p.rootCause, p.diagnosticType),
    q
  );
  const action = adjustInsufficientEvidenceByQHe(
    actionTextHe(p.rootCause, p.diagnosticType, p.engineAction),
    q
  );

  const base =
    `${subj} - topic ${topic}: ${q} questions solved, accuracy was ${acc}%, and the mistake rate was ${wr}%. ` +
    `${patternSentence ? `${patternSentence} ` : ""}${meaningSentence}`;

  return `${base} What to do: ${action}`;
}

/** Spec §5.1 */
export function stableMasteryInsightHe(p) {
  const subj = subjectLabel(p.subject, p.subjectId);
  const topic = clean(p.topic);
  const q = Math.round(Number(p.q) || 0);
  const acc = Math.round(Number(p.acc) || 0);
  let wr = p.wrongRatio;
  if (wr == null || !Number.isFinite(Number(wr))) wr = Math.max(0, Math.min(100, 100 - acc));
  else wr = Math.round(Number(wr));
  return (
    `${subj} - topic ${topic}: ${q} questions solved, accuracy was ${acc}%. ` +
    "This shows good command of the topic. " +
    "What to do: keep the topic fresh with occasional short practice, and check that accuracy holds on new questions too."
  );
}

/** Spec §5.2 */
export function advanceLevelInsightHe(p) {
  const subj = subjectLabel(p.subject, p.subjectId);
  const topic = clean(p.topic);
  return (
    `${subj} - topic ${topic}: the data points to a good enough command to consider raising the difficulty level for this topic only. ` +
    "It's recommended to move up gradually and check that accuracy holds on harder questions too."
  );
}

/** Spec §5.3 */
export function advanceGradeInsightHe(p) {
  const subj = subjectLabel(p.subject, p.subjectId);
  const topic = clean(p.topic);
  return (
    `${subj} - topic ${topic}: the data points to readiness to advance in this topic only. ` +
    "This doesn't mean the whole subject is ready for a jump - just that this particular topic looks more stable."
  );
}

/** Spec §5.4 */
export function strengthOverviewLineHe(p) {
  const subj = subjectLabel(p.subject, p.subjectId);
  const topic = clean(p.topic);
  const q = Math.round(Number(p.q) || 0);
  const acc = Math.round(Number(p.acc) || 0);
  return (
    `Strength: in ${subj} - topic ${topic}, ${q} questions were solved with ${acc}% accuracy. ` +
    "This is a topic worth maintaining, and if accuracy holds, gradual progress can be considered."
  );
}

/** Spec §5.5 positive subject line */
export function rawMetricStrengthPositiveHe(subject, q, acc) {
  const subj = clean(subject);
  const nq = Math.round(Number(q) || 0);
  const nacc = Math.round(Number(acc) || 0);
  return (
    `${subj} shows a relatively positive picture: ${nq} questions and ${nacc}% accuracy. ` +
    "To understand whether this is stable mastery, it also helps to check the breakdown by topic."
  );
}

/** Spec §5.5 caveat when weak topic in same subject */
export function rawMetricStrengthMixedSubjectHe(subject) {
  const subj = clean(subject);
  return (
    `${subj} also has good points, but the report found a specific topic worth reinforcing. ` +
    "That's why it's important to look at the breakdown by topic rather than draw one overall conclusion about the whole subject."
  );
}

/** Spec §5.6 */
export function dailyImprovementInsightHe() {
  return (
    "There's an improving trend over the recent period, but it's worth checking whether it holds going forward. " +
    "It's recommended to keep up the same level a bit longer before concluding the topic is already stable."
  );
}

/** Spec §5.7 */
export function strengthNotStableEnoughHe() {
  return (
    "Accuracy looks good, but there are cautionary signs such as hints used, repeated attempts, or an unclear trend. " +
    "So for now it's better to build up this topic rather than jump a level."
  );
}

/** Spec §6 insufficient_data (student level) */
export function insufficientDataInsightHe() {
  return (
    "There is still too little practice data to show a reliable learning picture. " +
    "Adding some short practice would help get a more accurate picture."
  );
}

/** Spec §6.1 — recent inactivity (not thin-data wording) */
export function recentInactivityInsightHe() {
  return "There hasn't been recent activity - it's recommended to return to short practice to keep up the learning streak.";
}

/** Spec §2.1 */
export function explainIdentifiedHe(stepLabel, topic) {
  const step = clean(stepLabel);
  const t = clean(topic);
  if (step && t) return `What we see: ${step} in the topic ${t}.`;
  if (t) return `What we see: focus on the topic ${t}.`;
  return "";
}

/** Spec §2.2 */
export function explainDataHe(q, acc, wrongRatio) {
  const nq = Math.round(Number(q) || 0);
  const nacc = Math.round(Number(acc) || 0);
  if (nq > 0 && nq < 5) {
    return `The data: there are ${nq} questions on this topic - this is only an early picture.`;
  }
  const wr = wrongRatio != null && Number.isFinite(Number(wrongRatio)) ? Math.round(Number(wrongRatio)) : null;
  if (wr != null) return `The data: ${nq} questions, ${nacc}% accuracy, ${wr}% mistakes.`;
  return `The data: ${nq} questions, ${nacc}% accuracy.`;
}

/** Spec §2.3 */
export function explainPatternHe(patternText) {
  const mapped = resolveParentFacingPatternLabelHe(patternText);
  const p = clean(mapped || patternText);
  if (!p || /^[a-z][a-z0-9_]*$/i.test(p)) return "";
  if (p) return `The recurring mistake: ${p.replace(/^the recurring mistake:\s*/i, "").replace(/^pattern:\s*/i, "").replace(/^the standout mistake pattern:\s*/i, "")}.`.replace(/\.\.$/, ".");
  return "";
}

/** Spec §2.4 */
export function explainMeaningHe(rootCause, diagnosticType, foundationLine) {
  const core = meaningExplainSentenceHe(rootCause, diagnosticType);
  const foundation = clean(foundationLine);
  if (foundation) return `What this means: ${core} ${foundation}`;
  return `What this means: ${core}`;
}

/** Spec §2.5 */
export function explainActionHe(rootCause, diagnosticType, engineAction) {
  const action = actionTextHe(rootCause, diagnosticType, engineAction);
  return `${PARENT_TOPIC_HOME_ACTION_HEADING_HE}: ${action}`;
}

/** Spec §7 home with engine action */
export function homeWithEngineActionHe(action) {
  const a = clean(action);
  if (!a) return "";
  return `At home: ${a}`;
}

/** Spec §7 fallback */
export function homeFallbackHe() {
  return "At home: it's recommended to do short, regular practice, and check the next report to see whether a clearer pattern has formed.";
}

/** Spec §7 by subject when no action */
export function homeBySubjectHe(subjectId) {
  const sid = String(subjectId || "").trim();
  if (sid === "math" || sid === "geometry") {
    return "At home: solve a few questions on the same topic, at a slow pace, and ask the child to explain the solving steps.";
  }
  if (sid === "hebrew") {
    return "At home: read a short text, pause after each section, and ask the child to explain in their own words what they understood.";
  }
  if (sid === "english") {
    return "At home: practice a few words or short sentences, and check that the child understands the meaning, not just recognizes the answer.";
  }
  if (sid === "science" || sid === "moledet-geography") {
    return "At home: review the key concepts from the topic, and ask the child to explain one example in their own words.";
  }
  return homeFallbackHe();
}

/** Spec §2.4 / §6 — short parent labels for diagnostic type badges */
export const PARENT_DIAGNOSTIC_TYPE_LABEL_HE = Object.freeze({
  knowledge_gap: "There's a knowledge point in this topic that isn't fully stable yet.",
  speed_pressure: "Some of the mistakes look related to speed or time pressure.",
  instruction_friction: "The difficulty may be related to reading the instructions or understanding what the question asks.",
  careless_pattern: "The child seems to know part of the material, but there are execution mistakes that repeat when rushing or skipping a step.",
  careless_execution: "The child seems to know part of the material, but there are execution mistakes that repeat when rushing or skipping a step.",
  fragile_success: "The child gets to some of the correct answers, but consistency isn't fully there yet.",
  stable_mastery: "The data points to good command of the topic right now.",
  undetermined: "No clear pattern has been established for this topic yet.",
  insufficient_evidence: "It's still early to clearly determine what needs reinforcement in this topic.",
  mixed_low_signal: "It's still early to clearly determine what needs reinforcement in this topic.",
  mixed_signal: "There are signs pointing in a few different directions, so the report recommends moving forward carefully.",
  mixed: "There are signs pointing in a few different directions, so the report recommends moving forward carefully.",
  weak_independence: "The child does better with support or hints, and it still helps to build up independent problem-solving.",
  none_sparse: "There are too few questions on this topic to draw a clear conclusion from.",
  none_observed: "There isn't yet enough repetition to call the mistake a consistent pattern.",
});

/** Spec §1.1 meaningSentence — root cause labels for parent display */
export const ROOT_CAUSE_PARENT_HE = Object.freeze({
  knowledge_gap: MEANING_BY_ROOT_CAUSE_INSIGHT.knowledge_gap,
  speed_pressure: MEANING_BY_ROOT_CAUSE_INSIGHT.speed_pressure,
  instruction_friction: MEANING_BY_ROOT_CAUSE_INSIGHT.instruction_friction,
  careless_execution: MEANING_BY_ROOT_CAUSE_INSIGHT.careless_execution,
  weak_independence: MEANING_BY_ROOT_CAUSE_INSIGHT.weak_independence,
  insufficient_evidence: MEANING_BY_ROOT_CAUSE_INSIGHT.insufficient_evidence,
  preliminary_direction: MEANING_BY_ROOT_CAUSE_INSIGHT.preliminary_direction,
  recurring_pattern: MEANING_BY_ROOT_CAUSE_INSIGHT.recurring_pattern,
  recurring_pattern_supported: MEANING_BY_ROOT_CAUSE_INSIGHT.recurring_pattern_supported,
  no_consistent_pattern: MEANING_BY_ROOT_CAUSE_INSIGHT.no_consistent_pattern,
  mixed_signal: MEANING_BY_ROOT_CAUSE_INSIGHT.mixed_signal,
  early_stage_instability: MEANING_BY_ROOT_CAUSE_INSIGHT.insufficient_evidence,
  retention_fragility: MEANING_BY_ROOT_CAUSE_INSIGHT.insufficient_evidence,
  language_load: MEANING_BY_ROOT_CAUSE_INSIGHT.instruction_friction,
  transition_gap: MEANING_BY_ROOT_CAUSE_INSIGHT.insufficient_evidence,
});

/** Spec §6 preliminary_signal */
export function preliminarySignalHe() {
  return "There's an early signal, but not yet enough repetition to draw a clear conclusion.";
}

/**
 * @param {string} [diagnosticType]
 */
export function parentDiagnosticTypeLabelHe(diagnosticType) {
  const k = clean(diagnosticType);
  if (k && PARENT_DIAGNOSTIC_TYPE_LABEL_HE[k]) return PARENT_DIAGNOSTIC_TYPE_LABEL_HE[k];
  return k ? "What was seen in practice" : "No clear pattern has been established for this topic yet.";
}

/**
 * @param {string} text
 * @returns {string[]}
 */
export function findSpecForbiddenPhrasesInString(text) {
  const t = String(text || "");
  const hits = [];
  for (const phrase of SPEC_FORBIDDEN_PARENT_PHRASES) {
    if (t.includes(phrase)) hits.push(phrase);
  }
  return hits;
}
