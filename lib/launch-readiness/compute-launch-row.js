/**
 * Compute launch registry rows from inventory aggregates + curriculum rules.
 * Used by build-topic-launch-registry.mjs and QA matrix refresh.
 */
import {
  diagnosticContributionFor,
  refineSurfacesForTopic,
  topicCellKey} from "./launch-surfaces.js";

/**
 * @typedef {object} InventoryTopicAgg
 * @property {number} topicTotal
 * @property {Record<string, number>} [byLevel]
 * @property {boolean} [criticalBlocking]
 * @property {boolean} [needsAuthoring]
 * @property {number} [professionalReady]
 * @property {number} [launchAcceptableThin]
 */

/**
 * @param {string} subject
 * @param {string} grade
 * @param {string} topic
 * @param {InventoryTopicAgg} [inv]
 * @returns {{ launchLevel: string, reason: string }}
 */
export function computeLaunchLevel(subject, grade, topic, inv = {}) {
  const g = Number(String(grade).replace("g", ""));

  

  if (subject === "english" && grade === "g1") {
    if (topic === "vocabulary") {
      return {
        launchLevel: "PRACTICE_ONLY",
        reason:
          "Vocabulary flashcard MCQ only; no letters/sounds/listening path. Not full English literacy."};
    }
    return { launchLevel: "HIDE", reason: "Not in G1 English product curriculum" };
  }

  if (subject === "english" && grade === "g2") {
    if (topic === "writing") {
      return {
        launchLevel: "PRACTICE_ONLY",
        reason: "Typing-only; not assignable MCQ without validated grading path."};
    }
    if (topic === "translation") {
      return {
        launchLevel: "LIMITED",
        reason: "Translation pool extremely thin; literacy path incomplete without audio."};
    }
    if (topic === "vocabulary") {
      return {
        launchLevel: "LIMITED",
        reason: "MCQ vocabulary without foundational letters/sounds/listening."};
    }
    return { launchLevel: "LIMITED", reason: "Early English lacks phonics/listening path" };
  }

  

  

  if (inv.criticalBlocking) {
    return {
      launchLevel: "LIMITED",
      reason: "CRITICAL_BLOCKING inventory - assign blocked until Phase 2 authoring"};
  }

  if (topic === "writing" || topic === "speaking") {
    if (g >= 3 && (subject === "english")) {
      return {
        launchLevel: "PRACTICE_ONLY",
        reason: "Typing/speaking only in self-practice; not assignable."};
    }
  }

  if ((inv.professionalReady ?? 0) >= 2) {
    return {
      launchLevel: "FULL",
      reason: "≥2 levels PROFESSIONAL_READY; technical + volume gates pass"};
  }
  if ((inv.launchAcceptableThin ?? 0) >= 1 && !inv.needsAuthoring) {
    return { launchLevel: "FULL", reason: "Launch-acceptable thin with adequate topic total" };
  }
  if (inv.needsAuthoring && (inv.topicTotal ?? 0) >= 30) {
    return {
      launchLevel: "LIMITED",
      reason: "Usable but below professional per-level thresholds"};
  }
  if (inv.needsAuthoring) {
    return {
      launchLevel: "LIMITED",
      reason: `Thin inventory (${inv.topicTotal ?? 0} unique); needs authoring`};
  }
  if ((inv.topicTotal ?? 0) > 0) {
    return { launchLevel: "LIMITED", reason: "Partial inventory coverage" };
  }
  return { launchLevel: "HIDE", reason: "No usable content" };
}

/**
 * @param {string} subject
 * @param {string} grade
 * @param {string} topic
 * @param {InventoryTopicAgg} [inv]
 */
export function buildRegistryRow(subject, grade, topic, inv = {}) {
  const { launchLevel, reason } = computeLaunchLevel(subject, grade, topic, inv);
  const criticalBlocking = Boolean(inv.criticalBlocking);
  const diagnosticContribution = diagnosticContributionFor(launchLevel, topic, criticalBlocking);
  let surfaces = refineSurfacesForTopic(launchLevel, topic);

  if (criticalBlocking) {
    surfaces = { ...surfaces, parentAssign: false, teacherAssign: false };
  }

  const bookFirstRecommended = false;
  const bookFirstSoftGateTopics =
    [];

  const audioRequired =
    (subject === "english" && (grade === "g1" || grade === "g2"));

  return {
    subject,
    grade,
    topic,
    cellKey: topicCellKey(subject, grade, topic),
    launchLevel,
    surfaces,
    diagnosticContribution,
    bookFirstRecommended,
    bookFirstSoftGateTopics,
    audioRequired,
    marketingEligible: launchLevel === "FULL",
    marketingNoteInternal:
      launchLevel === "PRACTICE_ONLY"
        ? "practice_or_book_path_only_not_full_curriculum_claim"
        : launchLevel === "LIMITED"
          ? "usable_with_known_gaps"
          : launchLevel === "HIDE"
            ? "hidden_from_launch_surfaces"
            : "full_launch_surface",
    inventoryStatus: criticalBlocking
      ? "CRITICAL_BLOCKING"
      : inv.needsAuthoring
        ? "NEEDS_AUTHORING"
        : (inv.professionalReady ?? 0) >= 2
          ? "PROFESSIONAL_READY"
          : "MIXED",
    topicTotal: inv.topicTotal ?? 0,
    reason,
    registryVersion: "launch-policy-v1"};
}
