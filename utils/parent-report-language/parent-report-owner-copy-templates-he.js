/**
 * Owner-authored subject-level Hebrew copy — Phase A (templateId + slots only).
 * Editorial strings supplied by product owner; render functions interpolate slots only.
 */

import { parentReportOwnerTopicCopyTemplatesHe } from "./parent-report-owner-topic-copy-templates-he.js";

/** @typedef {{
 *   topicName: string,
 *   questions: number,
 *   correct: number,
 *   wrong: number,
 *   accuracy: number,
 *   detectedPattern: string|null,
 *   affectedSubskill: string|null,
 *   evidenceStrength: string,
 * }|null} OwnerPriorityTopicSlots */

/** @typedef {{
 *   subjectName: string,
 *   subjectDecision: string,
 *   recommendedSubjectAction: string,
 *   priorityTopic0: OwnerPriorityTopicSlots,
 *   priorityTopic1: OwnerPriorityTopicSlots,
 *   prioritySpeedTopic0: OwnerPriorityTopicSlots,
 * }} SubjectOwnerCopySlots */

export const SUBJECT_OWNER_COPY_TEMPLATE_IDS = Object.freeze({
  OPENING: "SUBJECT_OPENING_PRIORITY_TOPIC_0",
  DIAGNOSIS_0: "SUBJECT_DIAGNOSIS_PRIORITY_TOPIC_0",
  DIAGNOSIS_1: "SUBJECT_DIAGNOSIS_PRIORITY_TOPIC_1",
  CLOSING: "SUBJECT_CLOSING_ENGINE_CONTRACT",
  HOME_ACTION: "remediate_priority_topics_same_level",
});

/** @param {unknown} v */
function str(v) {
  return v != null ? String(v).trim() : "";
}

/** @param {OwnerPriorityTopicSlots|null|undefined} t */
function hasPattern(t) {
  return !!str(t?.detectedPattern);
}

/**
 * @param {Record<string, unknown>|null|undefined} topic
 * @returns {OwnerPriorityTopicSlots|null}
 */
function buildPriorityTopicSlot(topic) {
  if (!topic || typeof topic !== "object") return null;
  const topicName = str(topic.topicLabelKey || topic.displayName || topic.topicName);
  if (!topicName) return null;
  return {
    topicName,
    questions: Number(topic.questions) || 0,
    correct: Number(topic.correct) || 0,
    wrong: Number(topic.wrong) || 0,
    accuracy: Number(topic.accuracy) || 0,
    detectedPattern: topic.detectedPattern ? str(topic.detectedPattern) : null,
    affectedSubskill: topic.affectedSubskill ? str(topic.affectedSubskill) : null,
    evidenceStrength: str(topic.evidenceStrength),
  };
}

/**
 * @param {Record<string, unknown>|null|undefined} contract
 * @param {string} [subjectLabelHe]
 * @returns {SubjectOwnerCopySlots|null}
 */
export function buildSubjectOwnerCopySlots(contract, subjectLabelHe = "") {
  if (!contract || typeof contract !== "object") return null;
  const p0 = buildPriorityTopicSlot(contract.priorityTopics?.[0]);
  const p1 = buildPriorityTopicSlot(contract.priorityTopics?.[1]);
  const speedTopic0 = buildPriorityTopicSlot(contract.prioritySpeedTopic);
  return {
    subjectName: str(subjectLabelHe || contract.subjectLabelKey),
    subjectDecision: str(contract.subjectDecision),
    recommendedSubjectAction: str(contract.recommendedSubjectAction),
    priorityTopic0: p0,
    priorityTopic1: p1,
    prioritySpeedTopic0: speedTopic0,
  };
}

/** @param {SubjectOwnerCopySlots} slots */
function renderSubjectOpeningPriorityTopic0(slots) {
  const sn = slots.subjectName;
  const t0 = slots.priorityTopic0;

  // speed_check_only_subject has NO actionable gap topic (t0 is always null for it —
  // enforced upstream: gaps.length===0 && stable.length===0 && speedCheckTopics.length>=1).
  // Uses its own dedicated slot (prioritySpeedTopic0) so this branch never depends on t0.
  // Product-owner-approved wording — must not claim a knowledge gap, must not say "נושא
  // אחד" (the sentence just names the single highest-priority speed-check topic, per the
  // existing priority order, without counting them).
  if (slots.subjectDecision === "speed_check_only_subject") {
    const speedTopic = slots.prioritySpeedTopic0;
    if (!speedTopic || !sn) return "";
    return `In ${sn} it's still worth checking performance without a time limit. In ${speedTopic.topicName} the mistakes showed up during fast practice, so it's still too early to say whether reinforcement of the knowledge itself is needed.`;
  }

  if (!t0 || !sn) return "";

  // mixed_subject_profile ALWAYS describes exactly one topic needing strengthening
  // (gaps.length === 1 && stable.length >= 1 — enforced upstream in
  // build-subject-engine-decision-contract.js). Product-owner-approved wording — must
  // never say "כמה נושאים" (several topics), since only one topic is a gap here. Also
  // uses "בחלק מהנושאים" (in some of the topics) rather than "נושאים שבהם" (topics
  // where...), which was imprecise when stable.length===1 (a single stable topic is
  // not "topics", plural).
  if (slots.subjectDecision === "mixed_subject_profile") {
    return `In ${sn}, stability is visible in some topics, alongside one topic that's worth reinforcing. It's recommended to start with ${t0.topicName}.`;
  }
  if (slots.subjectDecision === "multiple_topic_gaps") {
    if (hasPattern(t0)) {
      return `In ${sn}, a few topics stand out as needing reinforcement. The first topic is ${t0.topicName}: ${t0.questions} questions were solved, accuracy is at ${t0.accuracy}%, and a recurring mistake pattern was found: ${t0.detectedPattern}. So it's worth starting there.`;
    }
    return `In ${sn}, a few topics stand out as needing reinforcement. The first topic is ${t0.topicName}: ${t0.questions} questions were solved, and accuracy is at ${t0.accuracy}%. So it's worth starting there.`;
  }
  if (slots.subjectDecision === "focused_strengthening_needed") {
    return `In ${sn}, one topic currently stands out as needing reinforcement: ${t0.topicName}. ${t0.questions} questions were solved, and accuracy is at ${t0.accuracy}%. It's recommended to reinforce this topic before moving on.`;
  }
  return "";
}

/** @param {SubjectOwnerCopySlots} slots */
function renderSubjectDiagnosisPriorityTopic0(slots) {
  const t0 = slots.priorityTopic0;
  if (!t0) return "";
  if (hasPattern(t0)) {
    return `The main difficulty right now is in ${t0.topicName}. ${t0.questions} questions were solved with ${t0.accuracy}% accuracy, and a recurring mistake pattern was found: ${t0.detectedPattern}. This points to a need for focused reinforcement in that topic.`;
  }
  return `The main difficulty right now is in ${t0.topicName}. ${t0.questions} questions were solved with ${t0.accuracy}% accuracy. That's enough to recommend focused reinforcement in that topic, not just continued general practice.`;
}

/** @param {SubjectOwnerCopySlots} slots */
function renderSubjectDiagnosisPriorityTopic1(slots) {
  const t1 = slots.priorityTopic1;
  if (!t1) return "";
  if (hasPattern(t1)) {
    return `Another topic worth reinforcing is ${t1.topicName}. ${t1.questions} questions were solved with ${t1.accuracy}% accuracy, and a recurring mistake pattern was found: ${t1.detectedPattern}.`;
  }
  return `Another topic worth reinforcing is ${t1.topicName}. ${t1.questions} questions were solved with ${t1.accuracy}% accuracy, so it's worth including it in upcoming practice too.`;
}

/** @param {SubjectOwnerCopySlots} slots */
function renderRemediatePriorityTopicsSameLevel(slots) {
  const t0 = slots.priorityTopic0;
  if (!t0) return "";
  const t1 = slots.priorityTopic1;
  if (t1) {
    return `In the coming week it's recommended to practice at the same level, without raising the difficulty for now. Start with ${t0.topicName}, then move on to ${t1.topicName}. Each time, practice a small number of questions and check that the child can explain how they reached the answer.`;
  }
  return `In the coming week it's recommended to practice at the same level, without raising the difficulty for now. Focus on ${t0.topicName}, with a small number of questions each time, and check that the child can explain how they reached the answer.`;
}

/** @param {SubjectOwnerCopySlots} _slots */
function renderSubjectClosingEngineContract(_slots) {
  return "It's better to work short and focused: pick one topic at a time, solve 5-8 questions, and then ask the child to explain how they got to the answer. After a few practice sessions, check whether accuracy and stability are improving.";
}

/** @type {Record<string, (slots: SubjectOwnerCopySlots) => string>} */
const subjectOwnerCopyTemplatesHe = Object.freeze({
  [SUBJECT_OWNER_COPY_TEMPLATE_IDS.OPENING]: renderSubjectOpeningPriorityTopic0,
  [SUBJECT_OWNER_COPY_TEMPLATE_IDS.DIAGNOSIS_0]: renderSubjectDiagnosisPriorityTopic0,
  [SUBJECT_OWNER_COPY_TEMPLATE_IDS.DIAGNOSIS_1]: renderSubjectDiagnosisPriorityTopic1,
  [SUBJECT_OWNER_COPY_TEMPLATE_IDS.CLOSING]: renderSubjectClosingEngineContract,
  [SUBJECT_OWNER_COPY_TEMPLATE_IDS.HOME_ACTION]: renderRemediatePriorityTopicsSameLevel,
});

/** Subject + topic owner templates (Phase A + B+C+D). */
export const parentReportOwnerCopyTemplatesHe = Object.freeze({
  ...subjectOwnerCopyTemplatesHe,
  ...parentReportOwnerTopicCopyTemplatesHe,
});

/**
 * @param {string} templateId
 * @param {SubjectOwnerCopySlots|null|undefined} slots
 * @returns {string|null}
 */
export function renderOwnerSubjectCopyTemplateHe(templateId, slots) {
  const id = str(templateId);
  if (!id || !slots) return null;
  const fn = parentReportOwnerCopyTemplatesHe[id];
  if (!fn) return null;
  const text = str(fn(slots));
  return text || null;
}

/**
 * @param {Record<string, unknown>|null|undefined} contract
 * @param {string} templateId
 * @param {string} [subjectLabelHe]
 * @returns {string|null}
 */
export function resolveSubjectOwnerCopyFromContract(contract, templateId, subjectLabelHe = "") {
  if (!contract?.blockedLegacySummary) return null;
  const slots = buildSubjectOwnerCopySlots(contract, subjectLabelHe);
  if (!slots) return null;
  return renderOwnerSubjectCopyTemplateHe(templateId, slots);
}
