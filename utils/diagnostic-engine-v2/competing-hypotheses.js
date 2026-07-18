import defaultsEn from "../../content-packs/en/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };

/**
 * @param {import("./taxonomy-types.js").TaxonomyRow} taxonomyRow
 * @param {string|null|undefined} behaviorDominant
 */
export function buildCompetingHypotheses(taxonomyRow, behaviorDominant) {
  /** @type {Array<{ hypothesisId: string, labelHe: string, role: "primary"|"competitor"|"behavior" }>} */
  const out = [];
  const behavior = defaultsEn.competingHypotheses;
  const root = taxonomyRow.rootsHe && taxonomyRow.rootsHe[0];
  if (root) out.push({ hypothesisId: "root_primary", labelHe: root, role: "primary" });
  for (const c of taxonomyRow.competitorsHe || []) {
    out.push({ hypothesisId: `competitor:${c}`, labelHe: c, role: "competitor" });
  }
  const b = behaviorDominant ? String(behaviorDominant) : "";
  if (b === "speed_pressure") {
    out.push({
      hypothesisId: "speed_vs_knowledge",
      labelHe: behavior.speedPressure,
      role: "behavior",
    });
  } else if (b === "careless_pattern") {
    out.push({
      hypothesisId: "careless_vs_misunderstanding",
      labelHe: behavior.carelessPattern,
      role: "behavior",
    });
  } else if (b === "instruction_friction") {
    out.push({
      hypothesisId: "hint_dependence_vs_gap",
      labelHe: behavior.instructionFriction,
      role: "behavior",
    });
  }
  return {
    hypotheses: out,
    distinguishingEvidenceHe: behavior.distinguishingEvidence,
  };
}
