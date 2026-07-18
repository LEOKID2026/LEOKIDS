/**
 * Deterministic next-probe hints by normalized error tag or diagnosticSkillId.
 * Copy lives in content-packs/en/learning/fast-diagnostic-probes.json.
 */

import probesEn from "../../content-packs/en/learning/fast-diagnostic-probes.json" with { type: "json" };

/** @typedef {{ skill: string, suggestedQuestionType: string, reasonHe: string }} ProbeHint */

/**
 * @param {Record<string, { skill?: string, suggestedQuestionType?: string, reason?: string }>} raw
 * @returns {Record<string, ProbeHint>}
 */
function buildProbeMap(raw) {
  /** @type {Record<string, ProbeHint>} */
  const out = {};
  for (const [key, val] of Object.entries(raw || {})) {
    if (!val || typeof val !== "object") continue;
    out[key] = {
      skill: String(val.skill || ""),
      suggestedQuestionType: String(val.suggestedQuestionType || ""),
      reasonHe: String(val.reason || ""),
    };
  }
  return out;
}

/** @type {Record<string, ProbeHint>} */
export const PROBE_BY_ERROR_TAG = buildProbeMap(probesEn.probesByErrorTag);

/** @type {Record<string, ProbeHint>} */
export const PROBE_BY_DIAGNOSTIC_SKILL_ID = buildProbeMap(probesEn.probesByDiagnosticSkillId);

/**
 * @param {object} p
 * @param {string} [p.dominantTag]
 * @param {string|null} [p.dominantDiagnosticSkillId]
 */
export function resolveProbeHintFromMap({ dominantTag, dominantDiagnosticSkillId }) {
  const tag = dominantTag ? String(dominantTag) : "";
  const sid = dominantDiagnosticSkillId ? String(dominantDiagnosticSkillId) : "";
  if (tag && PROBE_BY_ERROR_TAG[tag]) return PROBE_BY_ERROR_TAG[tag];
  if (sid && PROBE_BY_DIAGNOSTIC_SKILL_ID[sid]) return PROBE_BY_DIAGNOSTIC_SKILL_ID[sid];
  return null;
}
