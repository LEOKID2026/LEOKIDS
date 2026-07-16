/**
 * Phase 14 — work order: foundation before expansion vs local treatment (dependency + gates).
 */

import {
  FOUNDATION_DECISION_LABEL_HE,
  INTERVENTION_ORDERING_LABEL_HE,
  NEXT_CYCLE_SUPPORT_LEVEL_LABEL_HE,
} from "./parent-report-ui-explain-he.js";

/**
 * @param {Record<string, unknown>} p merged dependency + gates + targets
 *
 * Phase 15 — internal priority (no new engine):
 * 1) `insufficient_dependency_evidence` or mixed with low conf → always evidence-first before foundation_first.
 * 2) `likely_foundational_block` + shouldTreat + conf moderate|high → foundation_first; else gather or local.
 * 3) advance/release gates in forming only reinforce foundationBeforeExpansion — do not override dependency decision.
 */
export function buildFoundationOrderingPhase14(p) {
  const dep = String(p?.dependencyState || "");
  const conf = String(p?.dependencyConfidence || "low");
  const shouldF = !!p?.shouldTreatAsFoundationFirst;
  const adv = String(p?.advanceGate || "");
  const rel = String(p?.releaseGate || "");
  const nextFocus = String(p?.nextCycleDecisionFocus || "");

  let foundationDecision = "treat_locally";
  let interventionOrdering = "local_support_first";
  let nextCycleSupportLevel = "narrow_local";
  let foundationBeforeExpansion = false;

  if (dep === "insufficient_dependency_evidence" || (dep === "mixed_dependency_signal" && conf === "low")) {
    foundationDecision = "collect_dependency_evidence_first";
    interventionOrdering = "gather_dependency_evidence_first";
    nextCycleSupportLevel = "evidence_first";
  } else if (dep === "mixed_dependency_signal") {
    foundationDecision = "run_parallel_light_support";
    interventionOrdering = "parallel_light_support";
    nextCycleSupportLevel = "blended_light";
    foundationBeforeExpansion = true;
  } else if (dep === "likely_foundational_block" && shouldF && (conf === "moderate" || conf === "high")) {
    foundationDecision = "stabilize_foundation_first";
    interventionOrdering = "foundation_first";
    nextCycleSupportLevel = "foundation_targeted";
    foundationBeforeExpansion = true;
  } else if (dep === "likely_foundational_block") {
    foundationDecision = "collect_dependency_evidence_first";
    interventionOrdering = "gather_dependency_evidence_first";
    nextCycleSupportLevel = "evidence_first";
    foundationBeforeExpansion = nextFocus.includes("refresh") || nextFocus.includes("prove");
  } else {
    foundationDecision = "treat_locally";
    interventionOrdering = "local_support_first";
    nextCycleSupportLevel = "narrow_local";
  }

  if (dep === "likely_foundational_block" && (adv === "forming" || rel === "forming")) {
    foundationBeforeExpansion = true;
  }

  let foundationBeforeExpansionHe = "";
  if (foundationBeforeExpansion && dep === "likely_foundational_block") {
    foundationBeforeExpansionHe =
      "Before raising expectations in this topic, it's worth reinforcing the foundation it builds on first - then refine.";
  } else if (foundationBeforeExpansion && dep === "mixed_dependency_signal") {
    foundationBeforeExpansionHe =
      "Avoid opening two expansions at once - a light step on the foundation and a focused step on the topic.";
  } else if (foundationBeforeExpansion && (adv === "forming" || rel === "forming")) {
    foundationBeforeExpansionHe =
      "While there's concern about a foundation gap, ease off on release or advancement until there's more baseline stability.";
  }

  return {
    foundationDecision,
    foundationDecisionLabelHe:
      FOUNDATION_DECISION_LABEL_HE[foundationDecision] || FOUNDATION_DECISION_LABEL_HE.treat_locally,
    nextCycleSupportLevel,
    nextCycleSupportLevelHe:
      NEXT_CYCLE_SUPPORT_LEVEL_LABEL_HE[nextCycleSupportLevel] || NEXT_CYCLE_SUPPORT_LEVEL_LABEL_HE.narrow_local,
    foundationBeforeExpansion,
    foundationBeforeExpansionHe,
    interventionOrdering,
    interventionOrderingHe:
      INTERVENTION_ORDERING_LABEL_HE[interventionOrdering] || INTERVENTION_ORDERING_LABEL_HE.local_support_first,
  };
}

/**
 * @param {Record<string, unknown>} p
 */
export function buildPhase14RecommendationOverlay(p) {
  const ord = buildFoundationOrderingPhase14(p);
  const dep = String(p?.dependencyState || "");
  const blk = String(p?.likelyFoundationalBlockerLabelHe || "").trim();

  let whyThisMayBeSymptomNotCoreHe = "";
  if (dep === "likely_foundational_block") {
    whyThisMayBeSymptomNotCoreHe =
      "Here the visible difficulty may not be only local - it may be tied to a foundation that hasn't stabilized yet - so don't conclude it's only topic-level polish.";
  } else if (dep === "mixed_dependency_signal") {
    whyThisMayBeSymptomNotCoreHe =
      "The picture is mixed: there may be both a local component and one that needs more foundation stability - don't lean hard in one direction only.";
  }

  let whyFoundationFirstHe = "";
  let whyLocalSupportFirstHe = "";
  let whatCanWaitUntilFoundationStabilizesHe = "";

  if (ord.interventionOrdering === "foundation_first" || ord.foundationDecision === "stabilize_foundation_first") {
    whyFoundationFirstHe = blk
      ? `Start with a short focus on ${blk} before trying to "catch up on everything" in this topic.`
      : "Stabilize a small, clear foundation first - then refine in the topic.";
    whatCanWaitUntilFoundationStabilizesHe =
      "You can wait on expanding load, jumping a level, and deep polish on details - until there are two short sessions with a consistent signal.";
  } else if (ord.interventionOrdering === "local_support_first") {
    whyLocalSupportFirstHe =
      "At this stage the difficulty seems more local, so address it in a focused way without stretching into a broader story.";
    whatCanWaitUntilFoundationStabilizesHe =
      "There's no need to defer everything to a \"big foundation\" if what's here is still point-specific.";
  } else if (ord.interventionOrdering === "parallel_light_support") {
    whyFoundationFirstHe = "A light line on the foundation - without replacing the whole plan.";
    whyLocalSupportFirstHe = "At the same time, keep a narrow goal in the topic - not two heavy loads.";
    whatCanWaitUntilFoundationStabilizesHe =
      "Avoid doubling up heavy practice on two tracks in the same evening.";
  } else {
    whyLocalSupportFirstHe =
      "For now it's better to gather more signal before deciding whether to open broad foundation work.";
    whatCanWaitUntilFoundationStabilizesHe =
      "Aggressive changes to sequence or level can wait for a short observation cycle.";
  }

  return {
    ...ord,
    whyThisMayBeSymptomNotCoreHe,
    whyFoundationFirstHe,
    whyLocalSupportFirstHe,
    whatCanWaitUntilFoundationStabilizesHe,
  };
}
