import { topicOptionsForAssignedActivity } from "../../classroom-activities/assigned-activity-topic-options.js";
import { normalizeGradeLevelToKey } from "../../learning-student-defaults.js";
import {
  getEnglishTopicName,
  getMathReportBucketDisplayName,
  getScienceTopicName,
  getTopicName,
} from "../../../utils/math-report-generator.js";
import { DEMO_PARENT_SUBJECTS } from "./constants.js";

/**
 * @param {string} gradeLevel e.g. grade_2
 * @param {string} subjectKey
 */
export function demoTopicOptionsForChild(gradeLevel, subjectKey) {
  const gradeKey = normalizeGradeLevelToKey(gradeLevel) || "g2";
  if (!DEMO_PARENT_SUBJECTS.includes(subjectKey)) return [];
  return topicOptionsForAssignedActivity(subjectKey, gradeKey);
}

/**
 * @param {string} gradeLevel
 * @param {string} subjectKey
 * @param {() => number} rnd
 */
export function pickDemoTopicKey(gradeLevel, subjectKey, rnd) {
  const opts = demoTopicOptionsForChild(gradeLevel, subjectKey);
  if (!opts.length) return "general";
  return opts[Math.floor(rnd() * opts.length)].key;
}

/**
 * @param {string} gradeLevel
 * @param {string} subjectKey
 * @param {string} topicKey
 */
export function resolveDemoTopicLabelEn(gradeLevel, subjectKey, topicKey) {
  const key = String(topicKey || "").trim();
  if (subjectKey === "math") {
    return getMathReportBucketDisplayName(key) || key;
  }
  if (subjectKey === "geometry") {
    return getTopicName(key) || key.replace(/_/g, " ");
  }
  if (subjectKey === "english") {
    return getEnglishTopicName(key) || key.replace(/_/g, " ");
  }
  if (subjectKey === "science") {
    return getScienceTopicName(key) || key.replace(/_/g, " ");
  }
  const opts = demoTopicOptionsForChild(gradeLevel, subjectKey);
  const hit = opts.find((o) => o.key === key);
  const label = hit?.label || key;
  return /[\u0590-\u05FF]/.test(String(label)) ? key.replace(/_/g, " ") : label;
}

/** @deprecated use resolveDemoTopicLabelEn */
export function resolveDemoTopicLabelHe(gradeLevel, subjectKey, topicKey) {
  return resolveDemoTopicLabelEn(gradeLevel, subjectKey, topicKey);
}
