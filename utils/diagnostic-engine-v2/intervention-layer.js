import { TAXONOMY_BY_ID } from "./taxonomy-registry.js";

/**
 * @param {string|null} taxonomyId
 */
export function buildInterventionPlan(taxonomyId) {
  if (!taxonomyId || !TAXONOMY_BY_ID[taxonomyId]) {
    return {
      immediateActionHe: "Gather more evidence before a plan",
      shortPracticeHe: "3–7 items on the same topic at a slightly lower difficulty",
      avoidHe: "Do not jump too high in level or mix several topics together.",
      improvementSignalsHe: ["Fewer repeating errors", "Independent correction after a mistake"],
      failureSignalsHe: ["No change after two structured cycles"],
      hypothesisChangeHe: "Failure on the proposed check, or success only with heavy hinting",
    };
  }
  const row = TAXONOMY_BY_ID[taxonomyId];
  return {
    immediateActionHe: row.probeHe,
    shortPracticeHe: row.interventionHe,
    avoidHe: "Do not jump too high in level, mix several topics, or rely on general feedback without an example.",
    improvementSignalsHe: ["Match taxonomy success markers", "Transfer success to a similar task"],
    failureSignalsHe: [row.escalationHe],
    hypothesisChangeHe: "When the recommended probe fails or strong counter-evidence appears",
    taxonomyId: row.id,
  };
}
