import { TAXONOMY_BY_ID } from "./taxonomy-registry.js";

/**
 * @param {string|null} taxonomyId
 */
export function buildProbePlan(taxonomyId) {
  if (!taxonomyId || !TAXONOMY_BY_ID[taxonomyId]) {
    return {
      probeType: "structural_transfer",
      objectiveHe: "Separate a foundation gap from a topic-specific issue",
      specificationHe: "A parallel task on the same principle with reduced complexity",
      stoppingRuleHe: "Two consistent sequences or stable improvement",
      escalationRuleHe: "No improvement after two cycles",
    };
  }
  const row = TAXONOMY_BY_ID[taxonomyId];
  return {
    probeType: "blueprint_row_probe",
    objectiveHe: "Distinguish a foundation difficulty from a topic-specific one",
    specificationHe: row.probeHe,
    stoppingRuleHe: "Meet the row recurrence threshold or reject the hypothesis",
    escalationRuleHe: row.escalationHe,
    taxonomyId: row.id,
  };
}
