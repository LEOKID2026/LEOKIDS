/**
 * Phase 7 — plausible root-cause layer for a topic row (v1).
 */

import { ROOT_CAUSE_PARENT_HE as ROOT_CAUSE_LABEL_HE } from "./parent-report-language/parent-report-hebrew-copy-spec.js";

/**
 * @param {object} p
 * @param {ReturnType<import("./parent-report-diagnostic-restraint.js").computeDiagnosticRestraint>} p.restraint
 * @param {Record<string, unknown>} p.riskFlags
 * @param {Record<string, unknown>} p.trendDer
 * @param {Record<string, unknown>|null|undefined} p.behaviorProfile
 * @param {number} p.q
 * @param {number} p.accuracy
 * @param {number} p.wrongRatio
 * @param {string} p.behaviorType
 */
export function estimateRowRootCause(p) {
  const row = p.row || {};
  const { restraint, riskFlags, trendDer, behaviorProfile, q, accuracy, wrongRatio, behaviorType } = p;
  const level = restraint?.diagnosticRestraint?.level || "confirmed";

  /** @type {string[]} */
  const evidence = [];

  if (level === "insufficient" || restraint?.conclusionStrength === "withheld") {
    return {
      rootCause: "insufficient_evidence",
      rootCauseLabelHe: ROOT_CAUSE_LABEL_HE.insufficient_evidence,
      rootCauseConfidence: 0.25,
      rootCauseEvidence: ["Evidence volume or quality does not allow locking onto the source of difficulty."],
      secondaryPossibleCause: null,
      rootCauseNarrativeHe:
        "There is still not enough basis to say exactly what the source of difficulty is - prefer short, measurable practice before conclusions.",
    };
  }

  const acc = Math.round(Number(accuracy) || 0);
  const wr = Number(wrongRatio) || 0;
  const modeKey = String(row?.modeKey || "").trim();

  /** @type {string|null} */
  let secondary = null;

  if (behaviorType === "careless_pattern") {
    evidence.push("Dominant profile - carelessness pattern");
    if (riskFlags.speedOnlyRisk) secondary = "speed_pressure";
    return finalize("careless_execution", 0.66, evidence, secondary, acc, wr, q, trendDer, behaviorType);
  }

  if (behaviorType === "fragile_success" && (trendDer.fragileProgressPattern || riskFlags.hintDependenceRisk)) {
    evidence.push("Success with dependence or a fragile trend");
    return finalize("weak_independence", 0.63, evidence, "instruction_friction", acc, wr, q, trendDer, behaviorType);
  }

  if (behaviorType === "knowledge_gap" && riskFlags.strongKnowledgeGapEvidence && acc < 62 && q >= 10) {
    evidence.push("Knowledge gap with low accuracy and supporting error volume");
    return finalize("knowledge_gap", 0.74, evidence, secondary, acc, wr, q, trendDer, behaviorType);
  }

  if (riskFlags.speedOnlyRisk && behaviorType !== "speed_pressure") {
    evidence.push("Speed/path flag without a severe accuracy gap");
    return finalize("speed_pressure", 0.72, evidence, secondary, acc, wr, q, trendDer, behaviorType);
  }

  if (behaviorType === "instruction_friction" || riskFlags.hintDependenceRisk) {
    evidence.push("Hint dependence or instruction friction");
    if (riskFlags.speedOnlyRisk) secondary = "speed_pressure";
    return finalize("instruction_friction", 0.68, evidence, secondary, acc, wr, q, trendDer, behaviorType);
  }

  if (behaviorType === "speed_pressure" || (modeKey === "speed" || modeKey === "marathon") && acc >= 52 && wr < 0.35) {
    evidence.push("Speed/marathon practice mode with medium-or-better accuracy");
    return finalize("speed_pressure", 0.7, evidence, secondary, acc, wr, q, trendDer, behaviorType);
  }

  if (
    acc >= 68 &&
    wr > 0.12 &&
    wr < 0.35 &&
    q >= 10 &&
    behaviorType !== "fragile_success" &&
    behaviorType !== "knowledge_gap" &&
    behaviorType !== "instruction_friction"
  ) {
    evidence.push('Relatively "careless" errors versus mastery level');
    return finalize("careless_execution", 0.62, evidence, secondary, acc, wr, q, trendDer, behaviorType);
  }

  if (
    trendDer.independenceDeteriorating &&
    (trendDer.positiveAccuracy || acc >= 75) &&
    (riskFlags.hintDependenceRisk || behaviorType === "fragile_success")
  ) {
    evidence.push("Independence declining alongside relatively high accuracy");
    return finalize("weak_independence", 0.65, evidence, "instruction_friction", acc, wr, q, trendDer, behaviorType);
  }

  if (q < 12 || restraint?.conclusionStrength === "tentative") {
    evidence.push("Early stage or moderate evidence");
    return finalize("early_stage_instability", 0.55, evidence, null, acc, wr, q, trendDer, behaviorType);
  }

  if (restraint?.diagnosticRestraint?.level === "mixed") {
    evidence.push("Conflicting signals");
    return finalize(
      "mixed_signal",
      0.5,
      evidence,
      behaviorType !== "undetermined" ? behaviorType : null,
      acc,
      wr,
      q,
      trendDer,
      behaviorType
    );
  }

  if (behaviorType === "knowledge_gap") {
    evidence.push("Behavior profile points to a knowledge gap");
    return finalize("knowledge_gap", 0.58, evidence, secondary, acc, wr, q, trendDer, behaviorType);
  }

  evidence.push("No clear lock-in - cautious default");
  return finalize("mixed_signal", 0.45, evidence, null, acc, wr, q, trendDer, behaviorType);
}

function finalize(
  rootCause,
  rootCauseConfidence,
  rootCauseEvidence,
  secondaryPossibleCause,
  acc,
  wr,
  q,
  trendDer,
  behaviorType
) {
  const label = ROOT_CAUSE_LABEL_HE[rootCause] || rootCause;
  const nar = buildNarrativeHe(rootCause, acc, wr, q, trendDer, behaviorType);
  return {
    rootCause,
    rootCauseLabelHe: label,
    rootCauseConfidence,
    rootCauseEvidence,
    secondaryPossibleCause,
    rootCauseNarrativeHe: nar,
  };
}

function buildNarrativeHe(rootCause, acc, wr, q, trendDer, behaviorType) {
  const parts = [];
  if (rootCause === "speed_pressure") {
    parts.push("The difficulty seems mainly tied to a fast path or time pressure - not necessarily a deep understanding gap.");
  } else if (rootCause === "instruction_friction") {
    parts.push("The pattern fits task reading and hint dependence more than a full knowledge gap.");
  } else if (rootCause === "knowledge_gap") {
    parts.push("The data support a focused knowledge gap alongside relatively low accuracy at a reasonable volume.");
  } else if (rootCause === "careless_execution") {
    parts.push("There are signs of careless execution alongside reasonable mastery - stabilize accuracy before dropping a level.");
  } else if (rootCause === "weak_independence") {
    parts.push("Solution independence is low relative to accuracy - build independence before jumping a level.");
  } else if (rootCause === "early_stage_instability") {
    parts.push("Still early in the window - the picture may stabilize after more short, consistent practice.");
  } else if (rootCause === "mixed_signal") {
    parts.push("Several signals point in different directions - do not lock onto a single explanation yet.");
  } else {
    parts.push("There is not yet enough precision in the data to describe the source of difficulty sharply.");
  }
  parts.push(`(accuracy ${acc}%, relative errors ${Math.round(wr * 100)}%, ${q} questions; profile ${behaviorType})`);
  if (trendDer?.unclearTrend) parts.push("Accuracy trend is not sharp - keep cautious wording.");
  return parts.join(" ");
}
