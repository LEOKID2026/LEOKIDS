/**
 * Parent Visible Finding Templates — Base Contract (section 8.1).
 * Subject-agnostic: {topicName} from row metadata, never hardcoded subject topics.
 */
import { isUsableParentPatternLabel, isBlockedParentPatternLabel, sanitizeParentPatternLabel } from "./parent-pattern-label.js";

/** @type {readonly string[]} */
export const FORBIDDEN_PARENT_WORDS = Object.freeze([
  "diagnosis",
  "diagnosed",
  "diagnostic",
  "warning",
  "severe warning",
  "serious problem",
  "the child does not know",
  "permanent gap",
  "the source of the difficulty for certain",
  "permanent problem",
  "alert",
  "urgent",
  "critical",
  "cold probe",
  "unknown",
  "counted in the report",
  "the learning report",
  "internal",
  "not enough of a picture",
  "limited data",
]);

/**
 * @param {string} text
 * @returns {string[]}
 */
export function findForbiddenParentWords(text) {
  const s = String(text || "").toLowerCase();
  const hits = [];
  for (const w of FORBIDDEN_PARENT_WORDS) {
    if (s.includes(String(w).toLowerCase())) hits.push(w);
  }
  if (/in the last practice session/i.test(text)) hits.push("in the last practice session");
  return hits;
}

/**
 * @param {number} wrongCount
 * @param {number} questionCount
 * @param {number} accuracy
 */
function difficultyVolumePhrase(wrongCount, questionCount, accuracy) {
  const w = Math.max(0, Number(wrongCount) || 0);
  const q = Math.max(0, Number(questionCount) || 0);
  const acc = Number(accuracy) || 0;
  const ratio = q > 0 ? w / q : 0;
  if (ratio >= 0.5 || acc <= 40) return "many mistakes";
  return "some mistakes";
}

/**
 * @param {number} wrongCount
 * @param {number} questionCount
 * @param {number} accuracy
 */
function difficultyActionPhrase(wrongCount, questionCount, accuracy) {
  const w = Math.max(0, Number(wrongCount) || 0);
  const q = Math.max(0, Number(questionCount) || 0);
  const acc = Number(accuracy) || 0;
  if (q >= 5 && (acc < 55 || w >= Math.ceil(q * 0.4))) return "go back and reinforce";
  return "go back and practice";
}

/**
 * @param {object} p
 * @param {string} p.topicName
 * @param {number} p.questionCount
 * @param {string} p.topicStatus
 * @param {string} p.findingType
 * @param {string} p.evidenceStrength
 * @param {boolean} p.canUseRepeatedWording
 * @param {{ label?: string }[]} p.repeatedMistakePatterns
 * @param {boolean} p.competitiveBucketOnly
 * @param {boolean} p.hasMixed
 */
export function buildParentVisibleFinding({
  topicName,
  questionCount,
  topicStatus,
  findingType,
  evidenceStrength,
  canUseRepeatedWording,
  repeatedMistakePatterns = [],
  competitiveBucketOnly = false,
  hasMixed = false,
  wrongCount = 0,
  accuracy = 0,
}) {
  const q = Math.max(0, Number(questionCount) || 0);
  const w = Math.max(0, Number(wrongCount) || 0);
  const acc = Number(accuracy) || 0;
  const name = String(topicName || "this topic").trim() || "this topic";
  const rawPatternLabel = String(repeatedMistakePatterns[0]?.label || "").trim();
  const patternLabel = sanitizeParentPatternLabel(repeatedMistakePatterns[0]?.label);
  const contextSuffix =
    q > 0 ? ` Based on ${q} questions solved in this topic.` : "";

  /** @type {"no_parent_text"|"factual_observation"|"pattern_observed"|"repeated_pattern"|"strong_pattern"} */
  let parentWordingLevel = "no_parent_text";
  let parentVisibleFinding = "";
  let templateId = "no_parent_text";

  if (topicStatus === "not_practiced" || q === 0) {
    return { parentVisibleFinding: "", parentWordingLevel: "no_parent_text", templateId: "no_parent_text" };
  }

  if (
    q <= 2 ||
    topicStatus === "initial_data" ||
    findingType === "initial_topic_data"
  ) {
    templateId = "initial_topic_data";
    parentWordingLevel = "factual_observation";
    parentVisibleFinding =
      q === 1
        ? `In ${name}, there is only early data so far. As more questions are solved in this topic, we can show a clearer picture.`
        : `In ${name}, ${q} questions were solved. It is still too early to spot a clear pattern in this topic.`;
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  const hasInternalRepeat = repeatedMistakePatterns.length > 0;
  const q34Factual = q >= 3 && q <= 4 && hasInternalRepeat && !canUseRepeatedWording;

  if (q34Factual) {
    templateId = "q3_4_factual";
    parentWordingLevel = "factual_observation";
    parentVisibleFinding = `In ${name}, based on ${q} questions solved in this topic, an early pattern of mistakes is showing.`;
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  if (competitiveBucketOnly) {
    templateId = "competitive_bucket_only";
    parentWordingLevel = "factual_observation";
    const brief = topicStatus.includes("positive")
      ? "success is showing"
      : topicStatus.includes("difficulty")
        ? "difficulty is showing"
        : "a pattern is showing";
    parentVisibleFinding = `In ${name}, in a competitive/speed setting, ${brief}.${contextSuffix}`;
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  if (hasMixed || topicStatus === "mixed" || findingType === "mixed_pattern") {
    templateId = "mixed";
    parentWordingLevel = "pattern_observed";
    parentVisibleFinding =
      `In ${name}, there are both successes and areas worth reinforcing. ` +
      `It helps to strengthen the parts that need attention, while continuing to build on what already works.${contextSuffix}`;
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  if (topicStatus === "difficulty_repeated" && canUseRepeatedWording) {
    if (isBlockedParentPatternLabel(rawPatternLabel)) {
      // Fall through to difficulty_observed — no "recurring pattern" for unknown/missing labels.
    } else if (isUsableParentPatternLabel(patternLabel)) {
      templateId = "difficulty_repeated";
      parentWordingLevel =
        evidenceStrength === "strong" ? "strong_pattern" : "repeated_pattern";
      parentVisibleFinding =
        `In ${name}, a recurring pattern of mistakes appears (${patternLabel}). It helps to reinforce this topic.${contextSuffix}`;
      return { parentVisibleFinding, parentWordingLevel, templateId };
    } else if (rawPatternLabel) {
      templateId = "difficulty_repeated_evidence_tag";
      parentWordingLevel =
        evidenceStrength === "strong" ? "strong_pattern" : "repeated_pattern";
      parentVisibleFinding =
        `In ${name}, a recurring pattern of mistakes appears (${rawPatternLabel}). It helps to reinforce this topic.${contextSuffix}`;
      return { parentVisibleFinding, parentWordingLevel, templateId };
    } else {
      templateId = "difficulty_repeated_generic";
      parentWordingLevel = "repeated_pattern";
      parentVisibleFinding =
        `In ${name}, a recurring pattern of mistakes appears. It helps to reinforce this topic.${contextSuffix}`;
      return { parentVisibleFinding, parentWordingLevel, templateId };
    }
  }

  if (
    topicStatus === "difficulty_observed" ||
    findingType === "difficulty_pattern" ||
    topicStatus === "practice_focus" ||
    findingType === "practice_focus"
  ) {
    const volume = difficultyVolumePhrase(w, q, acc);
    const action = difficultyActionPhrase(w, q, acc);
    templateId = topicStatus === "practice_focus" || findingType === "practice_focus"
      ? "practice_focus"
      : "difficulty_observed";
    parentWordingLevel = q >= 5 ? "pattern_observed" : "factual_observation";
    parentVisibleFinding =
      `In ${name}, there ${volume === "many mistakes" ? "were many mistakes" : "were some mistakes"} on the questions solved. It helps to ${action} this topic.${contextSuffix}`;
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  if (topicStatus === "positive_repeated") {
    templateId = "positive_repeated";
    parentWordingLevel =
      evidenceStrength === "strong" ? "strong_pattern" : "pattern_observed";
    parentVisibleFinding =
      `In ${name}, consistent strong success shows on the questions solved.${contextSuffix}`;
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  if (topicStatus === "positive_observed" || findingType === "success_pattern") {
    templateId = "positive_observed";
    parentWordingLevel =
      q >= 8 ? "pattern_observed" : "factual_observation";
    parentVisibleFinding =
      `In ${name}, strong success shows on the questions solved.${contextSuffix}`;
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  if (topicStatus === "no_clear_pattern") {
    if (q >= 5 && w >= 2 && acc < 70) {
      const volume = difficultyVolumePhrase(w, q, acc);
      const action = difficultyActionPhrase(w, q, acc);
      templateId = "no_clear_pattern_difficulty_fallback";
      parentWordingLevel = "pattern_observed";
      parentVisibleFinding =
        `In ${name}, there ${volume === "many mistakes" ? "were many mistakes" : "were some mistakes"} on the questions solved. It helps to ${action} this topic.${contextSuffix}`;
      return { parentVisibleFinding, parentWordingLevel, templateId };
    }
    templateId = "no_clear_pattern";
    parentWordingLevel = "no_parent_text";
    parentVisibleFinding = "";
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  if (q >= 5 && w >= 2 && acc < 70) {
    const volume = difficultyVolumePhrase(w, q, acc);
    const action = difficultyActionPhrase(w, q, acc);
    templateId = "difficulty_observed_fallback";
    parentWordingLevel = "pattern_observed";
    parentVisibleFinding =
      `In ${name}, there ${volume === "many mistakes" ? "were many mistakes" : "were some mistakes"} on the questions solved. It helps to ${action} this topic.${contextSuffix}`;
    return { parentVisibleFinding, parentWordingLevel, templateId };
  }

  templateId = "no_clear_pattern";
  parentWordingLevel = "no_parent_text";
  parentVisibleFinding = "";
  return { parentVisibleFinding, parentWordingLevel, templateId };
}
