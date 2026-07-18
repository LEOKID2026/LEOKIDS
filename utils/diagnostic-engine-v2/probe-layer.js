import { TAXONOMY_BY_ID } from "./taxonomy-registry.js";
import defaultsEn from "../../content-packs/en/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };

/**
 * @param {string|null} taxonomyId
 */
export function buildProbePlan(taxonomyId) {
  const fb = defaultsEn.probeFallback;
  const withTax = defaultsEn.probeWithTaxonomy;
  if (!taxonomyId || !TAXONOMY_BY_ID[taxonomyId]) {
    return {
      probeType: "structural_transfer",
      objectiveHe: fb.objective,
      specificationHe: fb.specification,
      stoppingRuleHe: fb.stoppingRule,
      escalationRuleHe: fb.escalationRule,
    };
  }
  const row = TAXONOMY_BY_ID[taxonomyId];
  return {
    probeType: "blueprint_row_probe",
    objectiveHe: withTax.objective,
    specificationHe: row.probeHe,
    stoppingRuleHe: withTax.stoppingRule,
    escalationRuleHe: row.escalationHe,
    taxonomyId: row.id,
  };
}
