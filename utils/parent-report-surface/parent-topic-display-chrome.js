/**
 * Parent-report display chrome (English-only) — maps question count + accuracy to a
 * safe topic status + visual meaning. Display-only: does not change LPD / EDC / ADC /
 * classifier output. Reuses the existing global theme tones already used by
 * `PrMiniBadge` (components/parent-report-topic-explain-row.jsx) and
 * `topicUiFromLearningPatternDecision` (utils/learning-pattern-decision/parent-report-ui-helpers.js)
 * — no colors are invented here, and none of the Israeli/Hebrew CSS is copied.
 *
 * Thresholds (product policy):
 *  - < 5 questions:  insufficient_data (never mastery/partial, never "Good"/"Excellent")
 *  - 5–9 questions:  >=70% early_direction_only; 50–69% topic_needs_strengthening; <50% clear_topic_gap
 *  - >=10 questions: >=90% mastery_stable; 70–89% partial_stable; 50–69% topic_needs_strengthening; <50% clear_topic_gap
 *
 * factualObservations are never hidden by this chrome — callers should keep showing them
 * regardless of topicStatus, including under insufficient_data.
 */

/** @typedef {"insufficient_data"|"early_direction_only"|"topic_needs_strengthening"|"clear_topic_gap"|"partial_stable"|"mastery_stable"} ParentTopicStatusEn */

/** @typedef {"ok"|"warn"|"risk"|"neutral"|"sky"} ParentTopicChromeTone */

/**
 * @param {{ questions?: number|null, accuracy?: number|null }} p
 * @returns {ParentTopicStatusEn}
 */
export function resolveEnglishTopicStatus(p) {
  const q = Math.max(0, Math.floor(Number(p?.questions) || 0));
  const acc = Math.max(0, Math.min(100, Math.round(Number(p?.accuracy) || 0)));

  if (q < 5) return "insufficient_data";

  if (q < 10) {
    if (acc >= 70) return "early_direction_only";
    if (acc >= 50) return "topic_needs_strengthening";
    return "clear_topic_gap";
  }

  if (acc >= 90) return "mastery_stable";
  if (acc >= 70) return "partial_stable";
  if (acc >= 50) return "topic_needs_strengthening";
  return "clear_topic_gap";
}

/**
 * @param {ParentTopicStatusEn|string} status
 */
export function parentTopicDisplayChromeEn(status) {
  const s = String(status || "insufficient_data");

  if (s === "mastery_stable") {
    return {
      topicStatus: s,
      tone: /** @type {ParentTopicChromeTone} */ ("ok"),
      badgeTextEn: "Excellent",
      statusEmoji: "✅",
      accuracyClass: "text-emerald-400",
      excellent: true,
      needsPractice: false,
      insufficientData: false,
      weakTopic: false,
    };
  }

  if (s === "partial_stable") {
    return {
      topicStatus: s,
      tone: /** @type {ParentTopicChromeTone} */ ("sky"),
      badgeTextEn: "Developing well",
      statusEmoji: "👍",
      accuracyClass: "text-sky-300",
      excellent: false,
      needsPractice: false,
      insufficientData: false,
      weakTopic: false,
    };
  }

  if (s === "topic_needs_strengthening") {
    return {
      topicStatus: s,
      tone: /** @type {ParentTopicChromeTone} */ ("warn"),
      badgeTextEn: "Worth strengthening",
      statusEmoji: "⚠️",
      accuracyClass: "text-amber-400",
      excellent: false,
      needsPractice: true,
      insufficientData: false,
      weakTopic: false,
    };
  }

  if (s === "clear_topic_gap") {
    return {
      topicStatus: s,
      tone: /** @type {ParentTopicChromeTone} */ ("risk"),
      badgeTextEn: "Needs focused practice",
      statusEmoji: "⚠️",
      accuracyClass: "text-amber-400",
      excellent: false,
      needsPractice: true,
      insufficientData: false,
      weakTopic: true,
    };
  }

  if (s === "early_direction_only") {
    return {
      topicStatus: s,
      tone: /** @type {ParentTopicChromeTone} */ ("neutral"),
      badgeTextEn: "Early direction only",
      statusEmoji: "🔎",
      accuracyClass: "text-white/75",
      excellent: false,
      needsPractice: false,
      insufficientData: false,
      weakTopic: false,
    };
  }

  return {
    topicStatus: "insufficient_data",
    tone: /** @type {ParentTopicChromeTone} */ ("neutral"),
    badgeTextEn: "Just getting started",
    statusEmoji: "🔎",
    accuracyClass: "text-white/70",
    excellent: false,
    needsPractice: false,
    insufficientData: true,
    weakTopic: false,
  };
}

/**
 * @param {Record<string, unknown>|null|undefined} row
 */
export function parentTopicDisplayChromeFromRow(row) {
  const questions = Math.max(
    0,
    Number(
      row?.parentVisibleMetrics?.questions ?? row?.questions ?? row?.learningPatternDecision?.practicedQuestions ?? 0,
    ) || 0,
  );
  const accuracy = Math.round(
    Number(row?.parentVisibleMetrics?.accuracy ?? row?.accuracy ?? row?.learningPatternDecision?.accuracy ?? 0) || 0,
  );

  const status = resolveEnglishTopicStatus({ questions, accuracy });
  return {
    ...parentTopicDisplayChromeEn(status),
    questions,
    accuracy,
  };
}
