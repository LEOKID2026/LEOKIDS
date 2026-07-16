/**
 * Map structured report contracts → localized UI strings.
 * Engines must emit contracts; this layer owns prose.
 */

import { createTranslator } from "../i18n/create-translator.js";

const TYPE_KEY = {
  topic_needs_strengthening: "reports.contract.types.topicNeedsStrengthening",
  topic_stable: "reports.contract.types.topicStable",
  subject_strength: "reports.contract.types.subjectStrength",
  subject_needs_attention: "reports.contract.types.subjectNeedsAttention",
  insufficient_data: "reports.contract.types.insufficientData",
  inactivity: "reports.contract.types.inactivity",
};

const ACTION_KEY = {
  remediate_same_level: "reports.actions.remediateSameLevel",
  maintain_and_strengthen: "reports.actions.maintainAndStrengthen",
  raise_challenge: "reports.actions.raiseChallenge",
  review_prerequisites: "reports.actions.reviewPrerequisites",
  short_break_then_retry: "reports.actions.shortBreakThenRetry",
};

/**
 * @param {string} subject
 * @param {string} topicOrSkill
 * @param {(k: string, v?: Record<string, unknown>) => string} t
 */
function topicLabel(subject, topicOrSkill, t) {
  const key = `reports.topics.${subject}.${topicOrSkill}`;
  const labeled = t(key);
  if (labeled !== key) return labeled;
  return String(topicOrSkill || "").replace(/_/g, " ");
}

/**
 * @param {string} subject
 * @param {(k: string, v?: Record<string, unknown>) => string} t
 */
function subjectLabel(subject, t) {
  const key = `learning.subjects.${subject}`;
  const labeled = t(key);
  if (labeled !== key) return labeled;
  return String(subject || "");
}

/**
 * @param {{
 *   type?: string,
 *   subject?: string,
 *   topic?: string,
 *   skill?: string,
 *   metrics?: { questions?: number, accuracy?: number, wrong?: number },
 *   recommendedAction?: string,
 * }} contract
 * @param {string} [locale]
 */
export function localizeReportContract(contract, locale = "en") {
  const { t } = createTranslator(locale);
  const c = contract && typeof contract === "object" ? contract : {};
  const subject = String(c.subject || "math");
  const topicId = String(c.topic || c.skill || "topic");
  const topic = topicLabel(subject, topicId, t);
  const subjectName = subjectLabel(subject, t);
  const metrics = c.metrics || {};
  const accuracy = Number(metrics.accuracy);
  const questions = Number(metrics.questions);
  const vars = {
    topic,
    skill: topic,
    subject: subjectName,
    accuracy: Number.isFinite(accuracy) ? accuracy : "—",
    questions: Number.isFinite(questions) ? questions : "—",
    wrong: metrics.wrong ?? "—",
    target: 80,
  };

  const typeKey = TYPE_KEY[c.type] || "reports.contract.types.unknown";
  const headline = t(typeKey, vars);
  const actionKey = ACTION_KEY[c.recommendedAction] || null;
  const recommendation = actionKey ? t(actionKey, vars) : t("reports.actions.remediateSameLevel", vars);

  return {
    locale,
    messageKey: typeKey,
    actionKey: actionKey || "reports.actions.remediateSameLevel",
    headline,
    recommendation,
    strengths: [t("reports.short.strengths.consistentPractice", vars)],
    toStrengthen: [headline],
    recommendations: [recommendation, t("reports.short.recommendations.practiceFocusTopic", vars)],
    caveats: [t("reports.short.caveats.thinEvidence", vars)],
    shortTitle: t("reports.shortTitle"),
    detailedTitle: t("reports.detailedTitle"),
    mockBanner: t("reports.mockBanner"),
    metrics: { ...metrics },
    contract: {
      type: c.type || "unknown",
      subject,
      topic: topicId,
      metrics: { ...metrics },
      recommendedAction: c.recommendedAction || "remediate_same_level",
    },
  };
}
