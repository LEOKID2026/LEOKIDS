/**
 * Parent Report Engine Decision Contract — propagates DE2/V3/professional decisions
 * to all parent surfaces. q/accuracy gate visibility only; content comes from engines.
 */
import { parentFacingPatternLabelHe } from "../parent-report-language/parent-facing-pattern-label.js";
import {
  buildEngineDiagnosticDecision,
  computeAccuracyBand,
  computeEngineConfidenceTier,
} from "../parent-report-engine-v1-signals.js";
import {
  normalizeParentVisibleMetrics,
  buildParentMetricsDataLineHe,
  formatQuestionsTextHe,
  formatWrongOfQuestionsTextHe,
  buildSpeedPressurePatternFindingHe,
} from "./normalize-parent-practice-metrics.js";
import { isUsableParentPatternLabel, sanitizeParentPatternLabel } from "./parent-pattern-label.js";
import { resolveEvidenceStrength } from "./resolve-evidence-strength.js";
import {
  buildUnifiedDecisionContext,
  reconcileEngineDecisionWithContext,
} from "./build-unified-decision-context.js";
import {
  buildActionDecisionContractV2,
  legacyRecommendedActionFromContractV2,
} from "../action-decision-contract/action-decision-contract-v2.js";

/** @typedef {"de2"|"v3"|"professional"|"canonicalState"|"topic_aggregation"} EngineSource */

/**
 * @deprecated P2 compatibility helper for isolated legacy callers/tests.
 * The active EDC pipeline selects through ActionDecisionContractV2 and only
 * mirrors its result back to `recommendedAction`.
 * @param {string|null|undefined} actionState
 * @param {string} engineDecision
 * @param {{ questions: number, accuracy: number, wrong: number }} metrics
 * @param {{
 *   canonicalPresent?: boolean,
 *   recommendationAllowed?: boolean,
 *   intensityCap?: string
 * }} [authority]
 */
export function mapEngineRecommendedAction(actionState, engineDecision, metrics, authority = {}) {
  const q = Math.max(0, Number(metrics?.questions) || 0);
  const action = String(actionState || "").trim().toLowerCase();
  const canonicalPresent = authority?.canonicalPresent === true;
  const recommendationAllowed = authority?.recommendationAllowed === true;
  const intensityCap = String(authority?.intensityCap || "RI0");

  if (q <= 0) return "none";

  // P0 authority rule: metrics and engineDecision may describe the finding, but only
  // canonical state may authorize an action. Missing canonical authority is fail-closed.
  if (
    !canonicalPresent ||
    !recommendationAllowed ||
    intensityCap === "RI0" ||
    action === "withhold" ||
    action === "probe_only"
  ) {
    return "watch";
  }

  if (
    action === "intervene" &&
    (engineDecision === "clear_topic_gap" || engineDecision === "topic_needs_strengthening")
  ) {
    return "remediate_same_level";
  }

  if (action === "maintain" || action === "expand_cautiously") {
    return "maintain_and_strengthen";
  }

  // diagnose_only authorizes a diagnosis, not remediation.
  return "watch";
}

/**
 * @param {string|null|undefined} raw
 */
function cleanParentFindingPattern(raw) {
  let t = sanitizeParentPatternLabel(String(raw || ""));
  t = t.replace(/\(focus point:[^)]*\)/gi, "");
  t = t.replace(/the focus point is[^.]*\.?\s*/gi, "");
  t = t.replace(/indicates a pattern:\s*/gi, "");
  t = t.replace(/\s{2,}/g, " ").trim();
  return t;
}

/**
 * @param {object} p
 */
function buildParentSafeFindingFromEngine(p) {
  const name = String(p.topicName || "this topic").trim() || "this topic";
  const q = p.metrics.questions;
  const acc = p.metrics.accuracy;
  const w = p.metrics.wrong;
  const pattern = cleanParentFindingPattern(p.detectedPattern);
  const hasPattern = isUsableParentPatternLabel(p.detectedPattern) && !!pattern;
  const suffix = q > 0 ? ` Based on ${formatQuestionsTextHe(q)} solved in this topic.` : "";
  const engineDecision = String(p.engineDecision || "");

  if (q <= 0) return "";

  if (q <= 2) {
    return q === 1
      ? `${name} only has preliminary data so far. As more questions are answered in this topic, we'll be able to show a more accurate picture.`
      : `${formatQuestionsTextHe(q)} were solved in ${name}. It's still early to identify a clear pattern in this topic.`;
  }

  if (hasPattern && !p.blockPatternClaim) {
    return `A recurring mistake pattern appears in ${name} (${pattern}). This topic is worth reinforcing.${suffix}`;
  }

  if (p.misconceptionLabel && isUsableParentPatternLabel(p.misconceptionLabel)) {
    const misc = cleanParentFindingPattern(p.misconceptionLabel);
    if (!misc) return "";
    return `A recurring mistake was identified in ${name}: ${misc}. This topic is worth reinforcing.${suffix}`;
  }

  if (engineDecision === "clear_topic_gap") {
    return `${name} shows a clear difficulty - ${formatWrongOfQuestionsTextHe(w, q)} (${acc}% accuracy). It's worth going back and reinforcing ${name} before moving on.${suffix}`;
  }

  if (engineDecision === "speed_pressure_pattern") {
    // Product-owner-approved wording — single source shared with
    // engine-decision-parent-copy.js (buildDiagnosticBodyByDecision). Does NOT
    // claim the problem IS speed, nor that a knowledge gap exists or is ruled out.
    return buildSpeedPressurePatternFindingHe({ topicName: name, wrong: w, questions: q, accuracy: acc });
  }

  if (engineDecision === "topic_needs_strengthening") {
    return `${name} has a point worth reinforcing (${formatQuestionsTextHe(q)}, ${acc}% accuracy). Focused reinforcement would help.${suffix}`;
  }

  if (engineDecision === "partial_stable") {
    return `${name} shows partial understanding (${acc}% accuracy), but still needs reinforcement to reach stability.${suffix}`;
  }

  if (engineDecision === "mastery_stable") {
    return `${name} shows good, stable success (${formatQuestionsTextHe(q)}, ${acc}% accuracy).${suffix}`;
  }

  if (engineDecision === "early_direction_only" || engineDecision === "insufficient_data") {
    if (q <= 4) {
      return `${name} has ${formatQuestionsTextHe(q)}. It's still early to draw a clear conclusion.`;
    }
    return "";
  }

  if (q >= 5 && w >= 2 && acc < 70) {
    const volume = acc <= 40 || w / Math.max(q, 1) >= 0.5 ? "a lot of mistakes" : "some mistakes";
    return `${name} had ${volume} in the questions solved. It's worth going back and reinforcing this topic.${suffix}`;
  }

  return "";
}

/**
 * @param {number} q
 * @param {string} evidenceStrength
 * @param {string} engineDecision
 */
export function resolveEngineDecisionUncertaintyText(q, evidenceStrength, engineDecision) {
  const questions = Math.max(0, Math.floor(Number(q) || 0));
  const strongEvidence =
    evidenceStrength === "strong" || questions >= 50 || engineDecision === "clear_topic_gap";
  if (strongEvidence) return null;
  if (questions >= 20) return null;
  if (questions <= 4) {
    return "It's still early to determine a final direction - we'll keep collecting a bit more practice data.";
  }
  return null;
}

/**
 * @param {Record<string, unknown>|null|undefined} sp
 */
export function findStrongestEngineDecisionInSubject(sp) {
  /** @type {Record<string, unknown>[]} */
  const candidates = [];
  if (Array.isArray(sp?.topicRecommendations)) candidates.push(...sp.topicRecommendations);
  if (Array.isArray(sp?.topWeaknesses)) candidates.push(...sp.topWeaknesses);

  const rank = {
    clear_topic_gap: 4,
    topic_needs_strengthening: 3,
    partial_stable: 2,
    early_direction_only: 1,
  };

  /** @type {{ contract: Record<string, unknown>, row: Record<string, unknown>, rank: number }|null} */
  let best = null;
  for (const row of candidates) {
    const contract =
      row?.engineDecisionContract ||
      row?.learningPatternDecision?.engineDecisionContract ||
      null;
    if (!contract || typeof contract !== "object") continue;
    const finding = String(contract.parentSafeFinding || "").trim();
    if (!finding) continue;
    const r = rank[String(contract.engineDecision || "")] || 0;
    const q = Number(contract.questions) || 0;
    if (
      !best ||
      r > best.rank ||
      (r === best.rank && q > Number(best.contract.questions || 0))
    ) {
      best = { contract, row, rank: r };
    }
  }
  return best;
}

/**
 * @param {string} subjectLabel
 * @param {{ contract: Record<string, unknown> }|null} strongest
 */
export function buildSubjectEngineSummaryOpeningHe(subjectLabel, strongest) {
  if (!strongest?.contract) return null;
  const finding = String(strongest.contract.parentSafeFinding || "").trim();
  if (!finding) return null;
  const lab = String(subjectLabel || "this subject").trim();
  return `${lab}: ${finding}`;
}

/**
 * Inject engine pattern into repeatedMistakePatterns for LPD downstream.
 * @param {{ label?: string, key?: string, count?: number, ratio?: number }[]} existing
 * @param {string} patternLabel
 * @param {number} wrongCount
 */
export function injectEnginePatternIntoRepeatedMistakes(existing, patternLabel, wrongCount) {
  const label = sanitizeParentPatternLabel(patternLabel);
  if (!label) return existing;
  const list = Array.isArray(existing) ? [...existing] : [];
  const key = `engine:${label}`;
  if (list.some((p) => sanitizeParentPatternLabel(p?.label) === label)) return list;
  list.unshift({
    key,
    label,
    count: Math.max(1, Math.floor(Number(wrongCount) || 0)),
    ratio: 1,
  });
  return list;
}

/**
 * @param {object} [input]
 */
export function buildParentReportEngineDecisionContract(input = {}) {
  /** @type {string[]} */
  const traceReason = ["raw:received"];

  const subjectId = String(input.subjectId || "").trim();
  const topicRowKey = String(input.topicRowKey || input.topicKey || "").trim();
  const topicName =
    String(input.topicName || input.displayName || input.topicLabel || "").trim() || "this topic";
  const unit = input.unit && typeof input.unit === "object" ? input.unit : null;
  const v3Enrichment =
    input.v3Enrichment && typeof input.v3Enrichment === "object" ? input.v3Enrichment : null;
  const professionalSlice =
    input.professionalSlice && typeof input.professionalSlice === "object"
      ? input.professionalSlice
      : null;
  const row = input.row && typeof input.row === "object" ? input.row : {};
  const actionTopicKey =
    String(unit?.bucketKey || row?.bucketKey || topicRowKey.split("\u0001")[0]).trim() ||
    topicRowKey;

  const metrics = normalizeParentVisibleMetrics(row, unit);
  traceReason.push(`metrics:q=${metrics.questions},c=${metrics.correct},w=${metrics.wrong},acc=${metrics.accuracy}`);

  if (metrics.questions <= 0) {
    const actionDecisionContract = buildActionDecisionContractV2({
      subjectId,
      topicKey: actionTopicKey,
      engineDecision: "none",
      metrics,
      canonicalState: unit?.canonicalState || null,
      unifiedDecisionContext: null,
      decisionTimestamp: input.decisionTimestamp,
    });
    return {
      subject: subjectId,
      topic: topicRowKey,
      topicName,
      questions: 0,
      correct: 0,
      wrong: 0,
      accuracy: 0,
      metrics,
      engineDecision: "none",
      sourceEngine: "topic_aggregation",
      detectedPattern: null,
      misconceptionLabel: null,
      affectedSubskill: null,
      severity: "none",
      evidenceStrength: "none",
      recommendedAction: "none",
      actionDecisionContract,
      parentSafeFinding: "",
      factualObservations: [],
      uncertaintyText: null,
      blockPatternClaim: true,
      traceReason,
      engineDiagnosticDecision: null,
    };
  }

  const de2PatternHe = unit ? parentFacingPatternLabelHe(unit) : "";
  const de2SubskillHe = sanitizeParentPatternLabel(
    String(unit?.taxonomy?.subskillHe || "").trim(),
  );
  const de2DiagnosisLine =
    unit?.diagnosis?.allowed === true ? String(unit?.diagnosis?.lineHe || "").trim() : "";
  const canonicalState = unit?.canonicalState || null;
  const actionState = String(canonicalState?.actionState || unit?.actionState || "").trim();

  if (unit) traceReason.push("de2:unit_present");
  if (de2PatternHe) traceReason.push(`de2:pattern=${de2PatternHe}`);
  if (v3Enrichment?.v3Rollup) traceReason.push("v3:enrichment_present");
  if (professionalSlice) traceReason.push("professional:slice_present");

  const v3PatternHe = sanitizeParentPatternLabel(
    String(v3Enrichment?.v3Rollup?.dominantErrorType || "").trim(),
  );

  /** @type {EngineSource} */
  let sourceEngine = "topic_aggregation";
  let detectedPattern = null;
  if (de2PatternHe && isUsableParentPatternLabel(de2PatternHe)) {
    detectedPattern = de2PatternHe;
    sourceEngine = "de2";
  } else if (v3PatternHe) {
    detectedPattern = v3PatternHe;
    sourceEngine = "v3";
  }

  const wrongRatio = metrics.questions > 0 ? metrics.wrong / metrics.questions : 0;
  const tier = computeEngineConfidenceTier(metrics.questions);
  const accuracyBand = computeAccuracyBand(metrics.accuracy, metrics.questions);

  const unifiedDecisionContext =
    input.unifiedDecisionContext && typeof input.unifiedDecisionContext === "object"
      ? input.unifiedDecisionContext
      : buildUnifiedDecisionContext({ row, unit, v3Enrichment });
  const subskillSignal = unifiedDecisionContext?.signals?.subskill || {};
  const patternSignal = unifiedDecisionContext?.signals?.pattern || {};
  const taxonomyMatch =
    patternSignal.taxonomyMatched === true
      ? {
          taxonomyMatch: true,
          taxonomyId: patternSignal.taxonomyId,
          matchStrength: patternSignal.recurrenceFull ? "strong" : "moderate",
          classificationReasonCode: null,
          rawBucketKey: String(unit?.bucketKey || row?.bucketKey || ""),
          normalizedBucketKey: String(unit?.bucketKey || row?.bucketKey || ""),
          subskillCandidateTechnical: subskillSignal.candidate || null,
          subskillCandidate: subskillSignal.safe === true ? subskillSignal.candidate : null,
          subskillSafety: subskillSignal.safety || null,
          safeSubskillToShow: subskillSignal.safe === true,
          patternCandidate: patternSignal.dominantPattern
            ? {
                patternKey: String(patternSignal.dominantPattern),
                confidence: patternSignal.eligible ? 0.82 : 0.48,
              }
            : null,
        }
      : null;
  // DE2 units do not produce riskFlags. The active producer attaches them to the
  // topic row under topicEngineRowSignals; do not read a fictional DE2 field.
  const rowRiskFlags =
    row?.topicEngineRowSignals?.riskFlags &&
    typeof row.topicEngineRowSignals.riskFlags === "object"
      ? row.topicEngineRowSignals.riskFlags
      : {};
  if (Object.keys(rowRiskFlags).length > 0) traceReason.push("row:risk_flags_present");

  const baseEngineDiagnosticDecision = buildEngineDiagnosticDecision({
    q: metrics.questions,
    acc: metrics.accuracy,
    wrongRatio,
    engineConfidenceTier: tier,
    accuracyBand,
    taxonomyMatch,
    rootCause:
      unifiedDecisionContext?.signals?.grade?.foundationRisk === true
        ? "foundation_risk"
        : unifiedDecisionContext?.signals?.upstreamDiagnostic
              ?.shouldAvoidStrongConclusion === false
          ? String(unifiedDecisionContext.signals.upstreamDiagnostic.rootCause || "")
          : "",
    behaviorType: String(
      unifiedDecisionContext?.signals?.upstreamDiagnostic?.diagnosticType ||
        row?.behaviorProfile?.dominantType ||
        "",
    ),
    dominantMistakePattern: detectedPattern || "",
    riskFlags: rowRiskFlags,
    modeKey: String(row?.modeKey || ""),
  });
  const reconciledDecision = reconcileEngineDecisionWithContext(
    baseEngineDiagnosticDecision.engineDecision,
    unifiedDecisionContext,
  );
  const engineDiagnosticDecision = {
    ...baseEngineDiagnosticDecision,
    engineDecision: reconciledDecision.engineDecision,
    why: [
      ...(baseEngineDiagnosticDecision.why || []),
      ...reconciledDecision.reasonCodes,
      ...(unifiedDecisionContext?.reconciler?.reasonCodes || []),
    ],
    reasonCodes: [...new Set([
      ...reconciledDecision.reasonCodes,
      ...(unifiedDecisionContext?.reconciler?.reasonCodes || []),
    ])],
    priorityAdjustment: Number(unifiedDecisionContext?.reconciler?.priorityAdjustment) || 0,
  };

  const engineDecision = String(engineDiagnosticDecision.engineDecision || "insufficient_data");
  traceReason.push(`engineDecision:${engineDecision}`);
  for (const reasonCode of engineDiagnosticDecision.reasonCodes || []) {
    traceReason.push(`unified:${reasonCode}`);
  }

  const evidenceStrength = resolveEvidenceStrength(metrics.questions);
  const severity =
    engineDecision === "clear_topic_gap"
      ? "high"
      : engineDecision === "topic_needs_strengthening"
        ? "moderate"
        : engineDecision === "partial_stable"
          ? "low"
          : "none";

  const blockPatternClaim =
    canonicalState?.actionState?.withholdParentClaim === true ||
    engineDiagnosticDecision.safeSubskillToShow === false &&
    !detectedPattern;

  const detectedTaxonomyId =
    String(unit?.taxonomy?.id || unit?.classification?.detectedTaxonomyId || "").trim() ||
    null;
  const detectedPatternTag =
    String(
      unit?.classification?.primaryTag ||
        row?.detectedPattern ||
        patternSignal?.dominantPattern ||
        "",
    ).trim() || null;

  const actionDecisionContract = buildActionDecisionContractV2({
    subjectId,
    topicKey: actionTopicKey,
    engineDecision,
    metrics,
    canonicalState,
    unifiedDecisionContext,
    detectedTaxonomyId,
    detectedPatternTag,
    decisionTimestamp: input.decisionTimestamp,
  });
  const actionAuthority = {
    source: "canonicalState",
    canonicalPresent: actionDecisionContract.authorityTrace.canonicalPresent,
    recommendationAllowed: actionDecisionContract.authorityTrace.recommendationAllowed,
    intensityCap: actionDecisionContract.authorityTrace.intensityCap,
    actionState: actionDecisionContract.authorityTrace.actionState,
  };
  const recommendedAction = legacyRecommendedActionFromContractV2(actionDecisionContract);
  traceReason.push(`recommendedAction:${recommendedAction}`);
  traceReason.push(`action:${actionDecisionContract.action}`);

  const parentSafeFinding = buildParentSafeFindingFromEngine({
    topicName,
    metrics,
    detectedPattern,
    misconceptionLabel: de2DiagnosisLine || null,
    engineDecision,
    blockPatternClaim,
  });
  traceReason.push(parentSafeFinding ? "parentSafeFinding:engine" : "parentSafeFinding:empty");

  const uncertaintyText = resolveEngineDecisionUncertaintyText(
    metrics.questions,
    evidenceStrength,
    engineDecision,
  );

  return {
    subject: subjectId,
    topic: topicRowKey,
    topicName,
    questions: metrics.questions,
    correct: metrics.correct,
    wrong: metrics.wrong,
    accuracy: metrics.accuracy,
    metrics,
    engineDecision,
    sourceEngine,
    detectedPattern,
    misconceptionLabel: de2DiagnosisLine || detectedPattern || null,
    affectedSubskill: de2SubskillHe || engineDiagnosticDecision.subskillCandidate?.labelHe || null,
    severity,
    evidenceStrength,
    recommendedAction,
    actionDecisionContract,
    actionAuthority,
    unifiedDecisionContext,
    signalPriorityAdjustment: Number(unifiedDecisionContext?.reconciler?.priorityAdjustment) || 0,
    signalPriorityReasons: unifiedDecisionContext?.reconciler?.reasonCodes || [],
    parentSafeFinding,
    factualObservations: [],
    uncertaintyText,
    blockPatternClaim,
    actionState: actionState || null,
    traceReason,
    engineDiagnosticDecision,
    dataText: buildParentMetricsDataLineHe(metrics, topicName),
  };
}
