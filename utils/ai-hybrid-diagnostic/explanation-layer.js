import { stableJsonHash } from "./stable-json-hash.js";
import { NUMERIC_GATES } from "./constants.js";
import { validateExplanationOutput } from "./explanation-validator.js";

/**
 * @param {object} p
 * @param {object} p.snapshot v2AuthoritySnapshot
 * @param {object} p.ranking
 * @param {object} p.probeIntel
 * @param {object} p.gate
 */
export function buildHybridExplanations({ snapshot, ranking, probeIntel, gate, canonicalState }) {
  const taxonomyId = snapshot?.taxonomyId || snapshot?.diagnosis?.taxonomyId || "";
  const conf = String(snapshot?.confidence?.level || "");
  const g = snapshot?.outputGating || {};
  const cannot = !!g.cannotConcludeYet || !!canonicalState?.assessment?.cannotConcludeYet;
  const ambiguity = Number(ranking?.ambiguityScore);

  const canonicalFamily = canonicalState?.recommendation?.family;
  const canonicalUncertainty = canonicalState?.narrativeConstraints?.uncertaintyRequired;
  const requireUncertainty =
    canonicalUncertainty === true ||
    (Number.isFinite(ambiguity) && ambiguity >= NUMERIC_GATES.ambiguityUncertaintyLineThreshold) ||
    conf !== "high" ||
    cannot;

  const isProbeOnly = canonicalFamily === "probe_only" || canonicalFamily === "withhold";

  const evidenceRefs = [
    taxonomyId ? `taxonomy:${taxonomyId}` : "evidence:volume",
    "evidence:gating",
    ...(probeIntel?.suggestedProbeId ? [`evidence:probe:${probeIntel.suggestedProbeId}`] : []),
  ];

  const bundle = {
    snapshotHash: snapshot?.snapshotHash,
    rankingTop1: ranking?.top1Id || null,
    ambiguityScore: ranking?.ambiguityScore ?? null,
    probeId: probeIntel?.suggestedProbeId || null,
  };
  const inputBundleId = stableJsonHash(bundle);

  function templateParent() {
    if (cannot) {
      return "Based on what has been gathered so far, there is still not enough basis to set a clear direction on this topic.";
    }
    const base = taxonomyId
      ? `An active learning pattern (${taxonomyId}) was identified from practice data in the date range. `
      : "Based on practice data in this range, there is an initial picture. ";
    const tail =
      gate.mode === "rank_only"
        ? "Certainty is moderate - read the explanation with the teacher before decisions."
        : "You can use the check recommendations to reduce uncertainty.";
    return base + tail;
  }

  function templateTeacher() {
    if (cannot) {
      return "Output gate: cannot-conclude. Do not infer a sharp diagnosis; use a probe and follow-up per V2 policy.";
    }
    return `V2 authority: taxonomy=${taxonomyId || "none"}, confidence=${conf}, mode=${gate.mode}, ambiguity=${(ambiguity ?? "").toString()}, suggestedProbe=${probeIntel?.suggestedProbeId || "none"}.`;
  }

  let textParent = templateParent();
  let textTeacher = templateTeacher();
  let outputStatus = /** @type {"ok"|"fallback"|"failed"} */ ("ok");
  let failureReason = "";

  if (isProbeOnly && !cannot && textParent.includes("active learning pattern")) {
    textParent =
      "Based on what has been gathered so far, there is still not enough basis to set a clear direction on this topic.";
    outputStatus = "fallback";
    failureReason = "probe_only_framed_as_success";
  }

  let validator = validateExplanationOutput({ text: textParent, requireUncertainty, evidenceRefs });
  if (!validator.overallPass) {
    textParent =
      "Based on what has been gathered so far, there is still not enough basis to set a clear direction on this topic.";
    outputStatus = "fallback";
    failureReason = validator.reasonCodes.join(";");
    validator = validateExplanationOutput({
      text: textParent,
      requireUncertainty: true,
      evidenceRefs: ["evidence:gating", "taxonomy:none"],
    });
  }

  const uncertaintyLine = requireUncertainty
    ? "Certainty: different interpretations are possible - include adult judgment."
    : "Certainty is relatively high per system gates for this range.";

  return {
    inputBundleId,
    explanationContract: {
      inputBundleId,
      outputStatus,
      validatorPass: validator.overallPass,
      failureReason,
    },
    parent: {
      audience: "parent",
      text: textParent,
      uncertaintyLine,
      evidenceRefs,
      boundaryCheck: validator.boundaryPass,
      hallucinationCheck: validator.evidenceLinkPass,
      status: outputStatus,
    },
    teacher: {
      audience: "teacher",
      text: textTeacher,
      uncertaintyLine,
      evidenceRefs,
      boundaryCheck: validator.boundaryPass,
      hallucinationCheck: validator.evidenceLinkPass,
      status: outputStatus,
    },
    validator,
  };
}
