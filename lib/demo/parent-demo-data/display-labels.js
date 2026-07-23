import { demoPackCopy } from "../demo-pack-copy.js";
import { resolveDemoTopicLabelEn } from "./subject-topics.js";

/** English titles for parent-assigned demo activities. */
const ACTIVITY_TITLE_TEMPLATES = Object.freeze([
  "{subject} practice — {topic}",
  "Strengthen {subject}: {topic}",
  "Homework — {topic}",
  "Focused practice — {topic}",
]);

/**
 * @param {string} subjectKey
 */
function demoSubjectLabelEn(subjectKey) {
  const label = demoPackCopy("subjects", subjectKey);
  return label !== subjectKey ? label : "Learning";
}

/**
 * @param {string} subjectLabel
 * @param {string} topicLabel
 * @param {number} seq
 */
export function buildDemoActivityTitleEn(subjectLabel, topicLabel, seq) {
  const tpl = ACTIVITY_TITLE_TEMPLATES[seq % ACTIVITY_TITLE_TEMPLATES.length];
  return tpl.replace("{subject}", subjectLabel).replace("{topic}", topicLabel);
}

/**
 * @param {string} gradeLevel
 * @param {string} subjectKey
 * @param {string} topicKey
 * @param {number} seq
 */
export function buildDemoActivityCopyEn(gradeLevel, subjectKey, topicKey, seq) {
  const topicLabel = resolveDemoTopicLabelEn(gradeLevel, subjectKey, topicKey);
  const subjectLabel = demoSubjectLabelEn(subjectKey);
  return {
    title: buildDemoActivityTitleEn(subjectLabel, topicLabel, seq),
    topicLabel,
    subjectLabel,
  };
}
