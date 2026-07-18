import { TAXONOMY_BY_ID } from "./taxonomy-registry.js";
import defaultsEn from "../../content-packs/en/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };

/**
 * @param {string|null} taxonomyId
 */
export function buildInterventionPlan(taxonomyId) {
  const fb = defaultsEn.interventionFallback;
  const withTax = defaultsEn.interventionWithTaxonomy;
  if (!taxonomyId || !TAXONOMY_BY_ID[taxonomyId]) {
    return {
      immediateActionHe: fb.immediateAction,
      shortPracticeHe: fb.shortPractice,
      avoidHe: fb.avoid,
      improvementSignalsHe: fb.improvementSignals,
      failureSignalsHe: fb.failureSignals,
      hypothesisChangeHe: fb.hypothesisChange,
    };
  }
  const row = TAXONOMY_BY_ID[taxonomyId];
  return {
    immediateActionHe: row.probeHe,
    shortPracticeHe: row.interventionHe,
    avoidHe: withTax.avoid,
    improvementSignalsHe: withTax.improvementSignals,
    failureSignalsHe: [row.escalationHe],
    hypothesisChangeHe: withTax.hypothesisChange,
    taxonomyId: row.id,
  };
}
