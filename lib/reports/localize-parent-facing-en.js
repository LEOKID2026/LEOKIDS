/**
 * English overlay for parent-facing report payloads.
 * Does not rewrite Hebrew engines; adds parentFacingLocalized beside them.
 */

import { localizeReportContract } from "./localize-report-contract.js";

/**
 * Derive lightweight contracts from common parent-report payload shapes.
 * @param {any} payload
 * @returns {Array<Record<string, unknown>>}
 */
export function deriveReportContractsFromPayload(payload) {
  const contracts = [];
  const subjects = payload?.subjects || payload?.bySubject || [];
  const list = Array.isArray(subjects) ? subjects : Object.values(subjects || {});

  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const subject = entry.subject || entry.id || entry.key;
    const topics = entry.topics || entry.weakTopics || entry.toStrengthen || [];
    const topicList = Array.isArray(topics) ? topics : [];
    if (topicList.length === 0 && entry.accuracy != null) {
      contracts.push({
        type: Number(entry.accuracy) >= 80 ? "subject_strength" : "subject_needs_attention",
        subject,
        topic: entry.focusTopic || "mixed",
        metrics: {
          accuracy: entry.accuracy,
          questions: entry.questions || entry.totalQuestions || 0,
        },
        recommendedAction:
          Number(entry.accuracy) >= 80 ? "maintain_and_strengthen" : "remediate_same_level",
      });
      continue;
    }
    for (const topic of topicList.slice(0, 6)) {
      const topicId = typeof topic === "string" ? topic : topic.id || topic.topic || topic.key;
      const accuracy = typeof topic === "object" ? topic.accuracy : entry.accuracy;
      const questions = typeof topic === "object" ? topic.questions : entry.questions;
      contracts.push({
        type: Number(accuracy) >= 75 ? "topic_stable" : "topic_needs_strengthening",
        subject,
        topic: topicId,
        metrics: {
          accuracy: accuracy ?? 0,
          questions: questions ?? 0,
          wrong: typeof topic === "object" ? topic.wrong : undefined,
        },
        recommendedAction: "remediate_same_level",
      });
    }
  }

  if (contracts.length === 0) {
    contracts.push({
      type: "insufficient_data",
      subject: "math",
      topic: "mixed",
      metrics: { questions: 0, accuracy: 0 },
      recommendedAction: "remediate_same_level",
    });
  }
  return contracts;
}

/**
 * @param {any} payload
 * @param {string} [locale]
 */
export function wrapPayloadWithLocalizedParentFacing(payload, locale = "en") {
  const contracts = deriveReportContractsFromPayload(payload);
  const localized = contracts.map((c) => localizeReportContract(c, locale));
  return {
    ...payload,
    reportContracts: contracts,
    parentFacingLocalized: {
      locale,
      insights: localized.map((l) => l.headline),
      recommendations: localized.flatMap((l) => l.recommendations),
      caveats: localized.flatMap((l) => l.caveats),
      strengths: localized.flatMap((l) => l.strengths),
      items: localized,
    },
  };
}
