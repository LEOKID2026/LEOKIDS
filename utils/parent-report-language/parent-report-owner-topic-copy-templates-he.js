/**
 * Owner-authored topic-level Hebrew copy — Phase B+C+D (templateId + slots only).
 */

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
  if (q === 1) return "1 question";
  return `${q} questions`;
}

function formatCorrectText(n) {
  const c = Math.max(0, Math.round(Number(n) || 0));
  if (c === 1) return "1 correct answer";
  return `${c} correct answers`;
}

function formatWrongText(n) {
  const w = Math.max(0, Math.round(Number(n) || 0));
  if (w === 1) return "1 wrong answer";
  return `${w} wrong answers`;
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
  const topic = s.topicName;
  const qText = formatQuestionsText(s.questions);
  if (hasBreakdown(s)) {
    let line = `The data: ${qText} solved in ${topic}, of which ${formatCorrectText(s.correct)} and ${formatWrongText(s.wrong)}.`;
    if (hasReliableAccuracy(s) && s.accuracy > 0) {
      line += ` Accuracy is ${s.accuracy}%.`;
    }
    return line;
  }
  if (hasReliableAccuracy(s) && s.accuracy > 0) {
    return `The data: ${qText} solved in ${topic}, and accuracy is ${s.accuracy}%.`;
  }
  return `The data: ${qText} solved in ${topic}.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderTopicPatternLine(s) {
  if (!hasPattern(s)) return "";
  return `The recurring mistake: ${s.detectedPattern}.`;
}

/** @param {string} base @param {TopicOwnerCopySlots} s */
function appendPatternToSnapshot(base, s) {
  if (!hasPattern(s)) return base;
  return `${base} The recurring mistake: ${s.detectedPattern}.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedBase(s) {
  const tn = s.topicName;
  const qText = formatQuestionsText(s.questions);
  let base;
  if (s.decisionCode === "clear_topic_gap") {
    base = `${tn} is worth focusing on now. ${qText} solved, and accuracy is ${s.accuracy}%.`;
  } else {
    base = `${tn} shows a sign of a topic that needs reinforcement. ${qText} solved, and accuracy is ${s.accuracy}%.`;
  }
  return appendPatternToSnapshot(base, s);
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedIdentified(s) {
  if (hasPattern(s)) {
    return `What we see: in ${s.topicName} there are a few mistakes that repeat around the same idea.`;
  }
  return `What we see: in ${s.topicName} there's difficulty based on the questions solved and the accuracy.`;
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
    return `What it means: this probably isn't a one-time mistake. It's worth going back to the basics of ${s.topicName} before moving on.`;
  }
  return `What it means: the child succeeds on some of the questions, but ${s.topicName} still isn't stable enough.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedHomeAction(s) {
  if (hasPattern(s)) {
    return `What to do together: solve 5-8 short questions in ${s.topicName}. After each mistake, pause, ask the child to explain how they solved it, and pay special attention to ${s.detectedPattern}.`;
  }
  return `What to do together: solve 5-8 short questions in ${s.topicName}. After each mistake, pause and ask the child to explain how they solved it.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedStepLabel(s) {
  if (s.decisionCode === "clear_topic_gap") return "Basic reinforcement";
  return "Reinforcement at the same level";
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedInterventionPlan(s) {
  if (hasPattern(s)) {
    return `In the coming week it's recommended to focus on ${s.topicName} at the same difficulty level. Start with short questions, pay special attention to the recurring mistake pattern (${s.detectedPattern}), and only move to more complex questions after accuracy improves.`;
  }
  return `In the coming week it's recommended to focus on ${s.topicName} at the same difficulty level. Start with short questions, check the solving method, and only move to more complex questions after accuracy improves.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderDifficultyObservedDoNow(s) {
  if (hasPattern(s)) {
    return `Today, solve 5 questions in ${s.topicName} together. After each question, ask the child to explain the method, and pay special attention to the pattern: ${s.detectedPattern}.`;
  }
  return `Today, solve 5 questions in ${s.topicName} together. After each question, ask the child to explain the method, not just mark an answer.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderPositiveObservedBase(s) {
  const qText = formatQuestionsText(s.questions);
  return `${s.topicName} shows good success. ${qText} solved, and accuracy is ${s.accuracy}%.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderPositiveObservedIdentified(s) {
  return `What we see: ${s.topicName} shows good success on the questions solved.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderPositiveObservedData(s) {
  return renderTopicDataLine(s);
}

/** @param {TopicOwnerCopySlots} _s */
function renderPositiveObservedMeaning(_s) {
  return `What it means: ${_s.topicName} looks relatively stable right now. It's worth maintaining it with short practice now and then.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderPositiveObservedHomeAction(s) {
  return `What to do together: solve a few short questions in ${s.topicName} now and then, to keep up momentum and confidence.`;
}

/** @param {TopicOwnerCopySlots} _s */
function renderPositiveObservedStepLabel(_s) {
  return "Maintain with short practice";
}

/** @param {TopicOwnerCopySlots} _s */
function renderPositiveObservedCaution(_s) {
  return "Even when success looks good, it's worth keeping up short practice now and then to make sure the topic stays stable.";
}

/** @param {TopicOwnerCopySlots} s */
function renderInitialTopicDataBase(s) {
  const tn = s.topicName;
  if (s.questions === 1) {
    return `${tn} still has only 1 question so far. This is only an initial picture.`;
  }
  return `${tn} still has few questions: ${s.questions}. This is only an initial picture.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderInitialTopicDataIdentified(s) {
  return `What we see: there are currently few questions in ${s.topicName}.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderInitialTopicDataData(s) {
  return renderTopicDataLine(s);
}

/** @param {TopicOwnerCopySlots} _s */
function renderInitialTopicDataMeaning(_s) {
  return "What it means: it's still too early to draw a clear conclusion. A few more questions on this topic are needed.";
}

/** @param {TopicOwnerCopySlots} s */
function renderInitialTopicDataHomeAction(s) {
  return `What to do together: solve a few more short questions in ${s.topicName}, without pressure, to get a clearer picture.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderPracticeFocusBase(s) {
  return `${s.topicName} had a few mistakes, but there still aren't enough questions to know whether this repeats consistently.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderPracticeFocusIdentified(s) {
  return `What we see: there were a few mistakes in ${s.topicName}, but there still aren't enough questions to know if this is a steady pattern.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderPracticeFocusData(s) {
  return renderTopicDataLine(s);
}

/** @param {TopicOwnerCopySlots} _s */
function renderPracticeFocusMeaning(_s) {
  return "What it means: it's worth adding a bit more practice and seeing whether the same mistakes repeat.";
}

/** @param {TopicOwnerCopySlots} s */
function renderPracticeFocusHomeAction(s) {
  return `What to do together: practice a few short questions in ${s.topicName}, and ask the child to explain the method out loud.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedBase(s) {
  const base = `${s.topicName} has both correct answers and recurring mistakes. It's worth reinforcing on target without jumping a level too fast.`;
  return appendPatternToSnapshot(base, s);
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedIdentified(s) {
  if (hasPattern(s)) {
    return `What we see: ${s.topicName} has both successes and recurring mistakes.`;
  }
  return `What we see: ${s.topicName} has both successes and mistakes that need reinforcement.`;
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
  return `What it means: there's a certain foundation, but ${s.topicName} still isn't fully stable.`;
}

/** @param {TopicOwnerCopySlots} s */
function renderMixedHomeAction(s) {
  return `What to do together: pick 5-8 questions in ${s.topicName}, mix easy and medium questions, and pause at every mistake to understand what happened.`;
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
    return "This is still initial information - it's worth adding a few more questions and checking whether the direction holds.";
  }
  if (s.decisionCode === "clear_topic_gap") {
    return "This is no longer just initial information; it's worth going back and reinforcing this topic in a focused way.";
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
    return `It's worth checking after a bit more short practice whether the pattern (${s.detectedPattern}) keeps showing up or starts to fade.`;
  }
  return "It's worth checking after a bit more short practice whether accuracy improves and the topic becomes more stable.";
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
