import { NUMERIC_GATES } from "./constants.js";

const FORBIDDEN_SUBSTRINGS = [
  "",
  "ADHD",
  "",
  "",
  "",
  "",
  "",
  "",
  ""];

const UNCERTAINTY_MARKERS = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""];

const SUCCESS_MARKERS = [
  "",
  "",
  "",
  "",
  "",
  ""];

/**
 * @param {object} p
 * @param {string} p.text
 * @param {boolean} p.requireUncertainty
 * @param {string[]} p.evidenceRefs
 * @param {object} [p.canonicalState]
 */
export function validateExplanationOutput({ text, requireUncertainty, evidenceRefs, canonicalState }) {
  const t = String(text || "");
  /** @type {string[]} */
  const reasonCodes = [];

  let forbiddenClaimPass = true;
  for (const sub of FORBIDDEN_SUBSTRINGS) {
    if (t.includes(sub)) {
      forbiddenClaimPass = false;
      reasonCodes.push(`forbidden_substring:${sub}`);
    }
  }

  const uncertaintyCompliancePass =
    !requireUncertainty || UNCERTAINTY_MARKERS.some((m) => t.includes(m));

  if (requireUncertainty && !uncertaintyCompliancePass) reasonCodes.push("missing_uncertainty_sentence");

  const evidenceLinkPass =
    Array.isArray(evidenceRefs) &&
    evidenceRefs.length > 0 &&
    evidenceRefs.every((r) => typeof r === "string" && (r.startsWith("evidence:") || r.startsWith("taxonomy:")));

  if (!evidenceLinkPass) reasonCodes.push("evidence_refs_invalid");

  let stateCoherencePass = true;
  let familyCoherencePass = true;
  let readinessConfidenceCoherencePass = true;

  if (canonicalState) {
    const action = canonicalState.actionState;
    const family = canonicalState.recommendation?.family;

    if ((action === "probe_only" || action === "withhold") && SUCCESS_MARKERS.some((m) => t.includes(m))) {
      stateCoherencePass = false;
      reasonCodes.push("state_coherence:success_text_for_probe_or_withhold");
    }

    if (family && family !== action) {
      familyCoherencePass = false;
      reasonCodes.push(`family_coherence:family=${family}_action=${action}`);
    }

    const readiness = canonicalState.assessment?.readiness;
    const confidence = canonicalState.assessment?.confidenceLevel;
    if (readiness === "insufficient" && (t.includes("") || t.includes("ready to advance"))) {
      readinessConfidenceCoherencePass = false;
      reasonCodes.push("readiness_coherence:ready_text_for_insufficient");
    }
    if ((confidence === "low" || confidence === "early_signal_only") && (t.includes("") || t.includes("Certainty is relatively high"))) {
      readinessConfidenceCoherencePass = false;
      reasonCodes.push("confidence_coherence:high_text_for_low_confidence");
    }
  }

  const boundaryPass = forbiddenClaimPass;
  const overallPass =
    boundaryPass &&
    evidenceLinkPass &&
    uncertaintyCompliancePass &&
    forbiddenClaimPass &&
    stateCoherencePass &&
    familyCoherencePass &&
    readinessConfidenceCoherencePass;

  return {
    boundaryPass,
    evidenceLinkPass,
    uncertaintyCompliancePass,
    forbiddenClaimPass,
    stateCoherencePass,
    familyCoherencePass,
    readinessConfidenceCoherencePass,
    overallPass,
    reasonCodes,
    gateRef: {
      ambiguityThreshold: NUMERIC_GATES.ambiguityUncertaintyLineThreshold,
      evidenceLinkPassMin: NUMERIC_GATES.explanationEvidenceLinkPassMin,
    },
  };
}
