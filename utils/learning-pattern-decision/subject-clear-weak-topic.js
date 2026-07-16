/**
 * Subject/topic rows with enough parent-visible volume to conclude clear weakness.
 */
import { normalizeParentVisibleMetrics } from "./normalize-parent-practice-metrics.js";

/**
 * @param {{ questions?: number, correct?: number, wrong?: number, accuracy?: number }} metrics
 */
export function isClearWeakTopicMetrics(metrics) {
  const m = normalizeParentVisibleMetrics(metrics || {});
  return m.questions >= 5 && m.wrong >= 2 && m.accuracy < 70;
}

/**
 * @param {Record<string, unknown>|null|undefined} row
 */
export function extractMetricsFromTopicRow(row) {
  if (row?.parentVisibleMetrics && typeof row.parentVisibleMetrics === "object") {
    return normalizeParentVisibleMetrics(row.parentVisibleMetrics);
  }
  return normalizeParentVisibleMetrics(row || {}, row?.mapRow || null);
}

/**
 * @param {Record<string, unknown>|null|undefined} sp
 */
export function findClearWeakTopicInSubject(sp) {
  /** @type {Record<string, unknown>[]} */
  const candidates = [];
  if (Array.isArray(sp?.topicRecommendations)) candidates.push(...sp.topicRecommendations);
  if (Array.isArray(sp?.topWeaknesses)) candidates.push(...sp.topWeaknesses);

  for (const row of candidates) {
    const metrics = extractMetricsFromTopicRow(row);
    if (!isClearWeakTopicMetrics(metrics)) continue;
    const label = String(row?.labelHe || row?.displayName || row?.label || "").trim();
    if (!label) continue;
    return { label, metrics, row };
  }
  return null;
}

/**
 * @param {number} q
 * @param {number|null|undefined} acc
 */
export function isClearWeakSubjectVolume(q, acc) {
  const questions = Math.max(0, Number(q) || 0);
  const accuracy = Number(acc);
  return questions >= 5 && Number.isFinite(accuracy) && accuracy < 70;
}

/**
 * @param {string} subjectLabelHe
 * @param {string} topicLabelHe
 */
export function subjectClearWeakOpeningHe(subjectLabelHe, topicLabelHe) {
  const lab = String(subjectLabelHe || "this subject").trim();
  const topic = String(topicLabelHe || "this topic")
    .replace(/^[^-]+-\s*/, "")
    .trim();
  return `In ${lab}, a clear area to reinforce shows in ${topic} - it helps to strengthen it with short, calm practice.`;
}

/**
 * @param {string} subjectLabelHe
 * @param {string} topicLabelHe
 */
export function subjectClearWeakClosingHe(subjectLabelHe, topicLabelHe) {
  const lab = String(subjectLabelHe || "this subject").trim();
  const topic = String(topicLabelHe || "this topic")
    .replace(/^[^-]+-\s*/, "")
    .trim();
  return `In the coming weeks, it helps to focus on ${topic} and check again after a few more short practice sessions.`;
}

export const INSUFFICIENT_SUBJECT_SUMMARY_RE =
  /not enough of a picture|still too early|limited data|little information|not enough yet|still cautious|follow up after more practice|the direction looks stable/i;
