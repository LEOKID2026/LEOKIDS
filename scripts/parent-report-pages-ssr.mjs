/**
 *  SSR     ( E2E ) —    payload.
 * : npm run test:parent-report-phase6 ( -package.json),  : npx tsx scripts/parent-report-pages-ssr.mjs
 * : docs/PARENT_REPORT.md
 */
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

async function importFromRoot(rel) {
  const m = await import(pathToFileURL(join(ROOT, rel)).href);
  return m.default && typeof m.default === "object" ? m.default : m;
}

const { buildDetailedParentReportFromBaseReport } = await importFromRoot("utils/detailed-parent-report.js");
const { normalizeExecutiveSummary } = await importFromRoot("utils/parent-report-payload-normalize.js");
const { PARENT_REPORT_SCENARIOS } = await import(pathToFileURL(join(ROOT, "tests/fixtures/parent-report-pipeline.mjs")).href);
const { PARENT_REPORT_PRODUCT_SCENARIOS } = await import(
  pathToFileURL(join(ROOT, "tests", "fixtures", "parent-report-product-scenarios.mjs")).href
);
const { FORBIDDEN_INTERNAL_PARENT_TERMS } = await importFromRoot("utils/contracts/parent-product-contract-v1.js");

const detailedMod = await import(pathToFileURL(join(ROOT, "components/parent-report-detailed-surface.jsx")).href);
const {
  ExecutiveSummarySection,
  SubjectPhase3Insights,
  SubjectSummaryBlock,
  TopicRecommendationExplainStrip,
  ParentAssignedActivitiesSection,
} = detailedMod;
const contractUiMod = await import(pathToFileURL(join(ROOT, "components/parent-report-contract-ui-blocks.jsx")).href);
const { ParentTopContractSummaryBlock, ParentSubjectContractSummaryBlock } = contractUiMod;
const shortContractUiMod = await import(
  pathToFileURL(join(ROOT, "components/parent-report-short-contract-preview.jsx")).href
);
const { ParentReportShortContractPreview } = shortContractUiMod;

const parentMod = await import(pathToFileURL(join(ROOT, "components/parent-report-topic-explain-row.jsx")).href);
const { ParentReportTopicExplainRow, ParentReportTopicExplainBlock } = parentMod;

const { ParentReportInsight } = await import(pathToFileURL(join(ROOT, "components/ParentReportInsight.jsx")).href);

function render(label, el) {
  let html;
  try {
    html = renderToStaticMarkup(el);
  } catch (e) {
    throw new Error(`${label}: ${e?.message || e}`);
  }
  assert.ok(typeof html === "string" && html.length > 0, `${label}: empty html`);
  return html;
}

function runDetailedPageChunks() {
  const longHe = "".repeat(40);
  const longWhy = " ".repeat(120) + "knowledge_gap —    .";

  const sparse = buildDetailedParentReportFromBaseReport(PARENT_REPORT_SCENARIOS.all_sparse(), { period: "week" });
  assert.ok(sparse);

  render("exec:missing-executiveSummary", h(ExecutiveSummarySection, { es: normalizeExecutiveSummary({}), compact: false }));
  render("exec:sparse-normalized", h(ExecutiveSummarySection, { es: normalizeExecutiveSummary(sparse), compact: true }));
  render("exec:sparse-full", h(ExecutiveSummarySection, { es: normalizeExecutiveSummary(sparse), compact: false }));

  const partialPayload = { ...sparse, executiveSummary: undefined };
  render("exec:undefined-executiveSummary", h(ExecutiveSummarySection, { es: normalizeExecutiveSummary(partialPayload), compact: false }));

  const strong = buildDetailedParentReportFromBaseReport(PARENT_REPORT_SCENARIOS.strong_executive_case(), { period: "week" });
  render(
    "exec:phase8-ladder-normalized",
    h(ExecutiveSummarySection, { es: normalizeExecutiveSummary(strong), compact: false })
  );
  const esP9 = {
    ...normalizeExecutiveSummary(strong),
    dominantCrossSubjectMistakePatternLabelHe: "   ",
    crossSubjectLearningStageLabelHe: " ",
    crossSubjectRetentionRisk: "moderate",
    crossSubjectTransferReadiness: "limited",
    reviewBeforeAdvanceAreasHe: [":      ."],
    transferReadyAreasHe: [],
    crossSubjectResponseToIntervention: "early_positive_response",
    crossSubjectResponseToInterventionLabelHe: "   —   ",
    crossSubjectSupportAdjustmentNeed: "hold_course",
    crossSubjectSupportAdjustmentNeedHe: "   ",
    crossSubjectConclusionFreshness: "medium",
    crossSubjectRecalibrationNeed: "light_review",
    crossSubjectRecalibrationNeedHe: "     ",
    majorRecheckAreasHe: [":       ."],
    areasWhereSupportCanBeReducedHe: [],
    areasNeedingStrategyChangeHe: [],
  };
  render("exec:phase9-compact", h(ExecutiveSummarySection, { es: esP9, compact: false }));
  const spMath = strong.subjectProfiles.find((s) => s.subject === "math") || strong.subjectProfiles[0];
  const spStress = {
    ...spMath,
    subjectLabelHe: longHe,
    dominantLearningRiskLabelHe: longHe,
    trendNarrativeHe: longHe,
    recommendedHomeMethodHe: longHe,
    whatNotToDoHe: longHe,
  };
  render("phase3:long-labels-compact", h(SubjectPhase3Insights, { sp: spStress, compact: true }));
  render("phase3:long-labels-full", h(SubjectPhase3Insights, { sp: spStress, compact: false }));

  const spPartial = {
    subject: "math",
    subjectLabelHe: "",
    topStrengths: [],
    topWeaknesses: [],
    topicRecommendations: [],
    dominantLearningRisk: "knowledge_gap",
    dominantSuccessPattern: null,
    dominantLearningRiskLabelHe: " ",
    dominantSuccessPatternLabelHe: null,
    dominantRootCause: "insufficient_evidence",
    dominantRootCauseLabelHe: "     ",
    secondaryRootCause: null,
    rootCauseDistribution: {},
    subjectDiagnosticRestraintHe: "       —   .",
    subjectConclusionReadiness: "partial",
    subjectInterventionPriorityHe: "    ",
    subjectPriorityReasonHe: "    —   .",
    subjectDoNowHe: "     .",
    subjectAvoidNowHe: "     .",
    trendNarrativeHe: null,
    confidenceSummaryHe: null,
    recommendedHomeMethodHe: null,
    whatNotToDoHe: null,
    majorRiskFlagsAcrossRows: { recentTransitionRisk: true },
    dominantBehaviorProfileAcrossRows: null,
    fragileSuccessRowCount: 0,
    stableMasteryRowCount: 0,
    modeConcentrationNoteHe: null,
    subjectResponseToIntervention: "not_enough_evidence",
    subjectResponseToInterventionLabelHe: "       ",
    subjectSupportFit: "unknown",
    subjectSupportAdjustmentNeed: "monitor_only",
    subjectSupportAdjustmentNeedHe: "     ",
    subjectConclusionFreshness: "medium",
    subjectRecalibrationNeed: "light_review",
    subjectRecalibrationNeedHe: "     ",
    subjectEffectivenessNarrativeHe: ":        .      ",
  };
  render("phase3:partial-fields", h(SubjectPhase3Insights, { sp: spPartial, compact: true }));
  render("summary-block:sparse", h(SubjectSummaryBlock, { sp: sparse.subjectProfiles[0] }));

  const oneDom = buildDetailedParentReportFromBaseReport(PARENT_REPORT_SCENARIOS.one_dominant_subject(), { period: "week" });
  const tr = oneDom.subjectProfiles[0]?.topicRecommendations?.[0];
  assert.ok(tr, "topic rec for strip");
  assert.ok(
    String(tr.displayName || "").length > 0 && !String(tr.displayName || "").includes(""),
    `math topic displayName should be operation-only (grade/level in table columns; got ${tr.displayName})`
  );
  render("topic-strip:golden", h(TopicRecommendationExplainStrip, { tr }));

  const trTrendV1 = {
    ...tr,
    trendV1: {
      ok: true,
      direction: "improving",
      parentLineHe: " :  —         .",
    },
  };
  const trendStripHtml = render("topic-strip:trend-v1", h(TopicRecommendationExplainStrip, { tr: trTrendV1 }));
  assert.match(trendStripHtml, /parent-report-topic-trend-v1/u);
  assert.match(
    trendStripHtml,
    /trend for this period:\s*improving/i,
    "trend strip should render the English improving-trend meaning",
  );

  const trSparseSignals = {
    ...tr,
    whyThisRecommendationHe: longWhy,
    topicEngineRowSignals: {
      riskFlags: { hintDependenceRisk: true },
      whyThisRecommendationHe: longWhy,
      diagnosticType: "knowledge_gap",
    },
  };
  render("topic-strip:long-why-partial-sig", h(TopicRecommendationExplainStrip, { tr: trSparseSignals }));

  const trPhase8 = {
    ...tr,
    interventionPlanHe: "    —   .",
    doNowHe: "    .",
    avoidNowHe: "       .",
    cautionLineHe: "      .",
    recommendedSessionCount: 2,
    recommendedSessionLengthBand: "very_short",
    recommendedPracticeLoad: "minimal",
    interventionDurationBand: "very_short",
    interventionFormat: "observation_block",
    interventionIntensity: "light",
    interventionParentEffort: "low",
    topicEngineRowSignals: null,
  };
  render("topic-strip:phase8-compact", h(TopicRecommendationExplainStrip, { tr: trPhase8 }));

  const trPhase10 = {
    ...tr,
    topicEngineRowSignals: {
      ...(tr.topicEngineRowSignals && typeof tr.topicEngineRowSignals === "object" ? tr.topicEngineRowSignals : {}),
      responseToInterventionLabelHe: "   —   ",
      freshnessStateLabelHe: "  ",
      conclusionFreshnessLabelHe: "   —   ",
      nextSupportAdjustmentHe: "  /     ",
    },
  };
  render("topic-strip:phase10-compact", h(TopicRecommendationExplainStrip, { tr: trPhase10 }));

  const esPhase11 = {
    ...normalizeExecutiveSummary(strong),
    crossSubjectSupportSequenceState: "continuing_sequence",
    crossSubjectSupportSequenceStateLabelHe: "    ",
    crossSubjectNextBestSequenceStep: "continue_current_sequence",
    crossSubjectNextBestSequenceStepHe: "    —     ",
    subjectsReadyForReleaseHe: [":         "],
    subjectsAtRiskOfSupportRepetitionHe: [],
    subjectsNeedingSupportResetHe: [],
  };
  render("exec:phase11-sequence-strip", h(ExecutiveSummarySection, { es: esPhase11, compact: false }));

  const trPhase11 = {
    ...tr,
    topicEngineRowSignals: {
      ...(tr.topicEngineRowSignals && typeof tr.topicEngineRowSignals === "object" ? tr.topicEngineRowSignals : {}),
      supportSequenceNarrativeHe: "   —           .",
      strategyRepetitionRiskHe: "       ",
      strategyFatigueRiskHe: "      ",
      nextSupportSequenceActionHe: "         ",
    },
  };
  render("topic-strip:phase11-compact", h(TopicRecommendationExplainStrip, { tr: trPhase11 }));

  const esPhase12 = {
    ...normalizeExecutiveSummary(strong),
    crossSubjectRecommendationMemoryState: "light_memory",
    crossSubjectRecommendationMemoryStateLabelHe: "    —   ",
    crossSubjectSupportHistoryDepth: "short_history",
    crossSubjectSupportHistoryDepthLabelHe: " :   ",
    crossSubjectExpectedVsObservedMatch: "partly_aligned",
    crossSubjectExpectedVsObservedMatchHe: "       ",
    crossSubjectContinuationDecision: "continue_but_refine",
    crossSubjectContinuationDecisionHe: "  ,     ",
    subjectsWithClearCarryoverHe: [],
    subjectsNeedingFreshEvidenceHe: [":        ."],
    subjectsWherePriorPathSeemsMisalignedHe: [],
  };
  render("exec:phase12-memory-strip", h(ExecutiveSummarySection, { es: esPhase12, compact: false }));

  const trPhase12 = {
    ...tr,
    topicEngineRowSignals: {
      ...(tr.topicEngineRowSignals && typeof tr.topicEngineRowSignals === "object" ? tr.topicEngineRowSignals : {}),
      recommendationMemoryNarrativeHe: "«»:          .",
      outcomeTrackingNarrativeHe: "«»:    ·     ·   .",
      recommendationContinuationDecisionHe: "  ,     ",
      whatNeedsFreshEvidenceNowHe: "     :       .",
      recommendationMemoryState: "light_memory",
      expectedVsObservedMatch: "not_enough_evidence",
    },
  };
  render("topic-strip:phase12-compact", h(TopicRecommendationExplainStrip, { tr: trPhase12 }));

  const esPhase13 = {
    ...normalizeExecutiveSummary(strong),
    crossSubjectGateState: "recheck_gate_visible",
    crossSubjectGateStateLabelHe: "        ",
    crossSubjectNextCycleDecisionFocus: "refresh_baseline_before_decision",
    crossSubjectNextCycleDecisionFocusHe: "     ",
    crossSubjectEvidenceTargetType: "fresh_data_needed",
    crossSubjectEvidenceTargetTypeLabelHe: " /  ",
    crossSubjectTargetObservationWindow: "needs_fresh_baseline",
    crossSubjectTargetObservationWindowLabelHe: "    ",
    subjectsNearReleaseButNotThereHe: [":    —     ."],
    subjectsNeedingRecheckBeforeDecisionHe: [":   /    ."],
    subjectsWithVisiblePivotTriggerHe: [],
  };
  render("exec:phase13-gates-strip", h(ExecutiveSummarySection, { es: esPhase13, compact: false }));

  const trPhase13 = {
    ...tr,
    topicEngineRowSignals: {
      ...(tr.topicEngineRowSignals && typeof tr.topicEngineRowSignals === "object" ? tr.topicEngineRowSignals : {}),
      gateNarrativeHe: "«»:   —    .",
      evidenceTargetNarrativeHe: "«»:    ·   .",
      nextCycleDecisionFocusHe: "     ",
      releaseGate: "pending",
      whatWouldJustifyReleaseHe: "        .",
      recheckGate: "off",
      pivotGate: "off",
    },
  };
  render("topic-strip:phase13-compact", h(TopicRecommendationExplainStrip, { tr: trPhase13 }));

  const esPhase14 = {
    ...normalizeExecutiveSummary(strong),
    crossSubjectDependencyState: "likely_local_issue",
    crossSubjectDependencyStateLabelHe: "     —    ",
    crossSubjectLikelyFoundationalBlocker: "unknown",
    crossSubjectLikelyFoundationalBlockerLabelHe: "    ",
    crossSubjectFoundationFirstPriority: false,
    crossSubjectFoundationFirstPriorityHe: "         —   « »  .",
    subjectsLikelyShowingDownstreamSymptomsHe: [],
    subjectsNeedingFoundationFirstHe: [],
    subjectsSafeForLocalInterventionHe: [":    —      ."],
  };
  render("exec:phase14-foundation-strip", h(ExecutiveSummarySection, { es: esPhase14, compact: false }));

  const trPhase14 = {
    ...tr,
    topicEngineRowSignals: {
      ...(tr.topicEngineRowSignals && typeof tr.topicEngineRowSignals === "object" ? tr.topicEngineRowSignals : {}),
      foundationDependencyNarrativeHe: "«»:      —   .",
      interventionOrderingHe: "    ",
      foundationBeforeExpansion: false,
    },
  };
  render("topic-strip:phase14-compact", h(TopicRecommendationExplainStrip, { tr: trPhase14 }));

  const trPhase15 = {
    ...trPhase14,
    topicEngineRowSignals: {
      ...(trPhase14.topicEngineRowSignals && typeof trPhase14.topicEngineRowSignals === "object"
        ? trPhase14.topicEngineRowSignals
        : {}),
      freshnessStateLabelHe: "  ",
      conclusionFreshnessLabelHe: "  ",
      whatNeedsFreshEvidenceNowHe: "    ",
      gateNarrativeHe: ":    ",
      evidenceTargetNarrativeHe: ":    ",
      nextSupportAdjustmentHe: "  —   ",
      nextSupportSequenceActionHe: "  —   ",
      recommendationMemoryNarrativeHe: "   ",
      outcomeTrackingNarrativeHe: "   ",
    },
  };
  render("topic-strip:phase15-unified-compact", h(TopicRecommendationExplainStrip, { tr: trPhase15 }));
}

function runContractBindingChunks() {
  const stable = buildDetailedParentReportFromBaseReport(PARENT_REPORT_SCENARIOS.stable_excellence(), {
    period: "week",
  });
  const top = stable?.parentProductContractV1?.top;
  assert.ok(top && typeof top === "object", "contract top should exist for stable scenario");
  const topHtml = render("contract-ui:top-stable", h(ParentTopContractSummaryBlock, { top }));
  for (const token of FORBIDDEN_INTERNAL_PARENT_TERMS) {
    assert.ok(!topHtml.toLowerCase().includes(String(token).toLowerCase()), `forbidden token leaked in top ui: ${token}`);
  }
  assert.ok(
    topHtml.includes("What matters first") || topHtml.includes("Main focus"),
    "top contract priority label should render"
  );
  assert.ok(!/knowledge gap/i.test(topHtml), "stable mastery top area should avoid remediation wording");

  const trendScenario = PARENT_REPORT_PRODUCT_SCENARIOS.find((s) => s.id === "trend_insufficient");
  assert.ok(trendScenario && typeof trendScenario.buildBaseReport === "function", "trend_insufficient scenario missing");
  const trendReport = buildDetailedParentReportFromBaseReport(trendScenario.buildBaseReport(), { period: "week" });
  const trendTopHtml = render("contract-ui:top-trend-insufficient", h(ParentTopContractSummaryBlock, { top: trendReport?.parentProductContractV1?.top }));
  const strongTrendWords = [
    "improving",
    "declining",
    "positive trend",
    "negative trend",
    "established improvement",
    "established decline",
  ];
  for (const word of strongTrendWords) {
    assert.ok(!trendTopHtml.includes(word), `trend-insufficient top area contains strong trend wording: ${word}`);
  }

  const subjectContracts = stable?.parentProductContractV1?.subjects || {};
  const firstSubjectContract = Object.values(subjectContracts)[0];
  const subjectHtml = render(
    "contract-ui:subject-stable",
    h(ParentSubjectContractSummaryBlock, { contractRow: firstSubjectContract, compact: false })
  );
  assert.ok(subjectHtml.includes("Parent summary"), "subject contract block should render");

  const legacyFallbackHtml = renderToStaticMarkup(h(ParentTopContractSummaryBlock, { top: null }));
  assert.equal(legacyFallbackHtml, "", "missing top contract should render empty safely");

  const shortPreviewHtml = render(
    "contract-ui:short-preview",
    h(ParentReportShortContractPreview, { top })
  );
  assert.ok(shortPreviewHtml.includes("Short parent summary"), "short preview title should render");
  assert.ok(shortPreviewHtml.includes("What to do now"), "short preview should include do-now line");
  assert.ok(!/knowledge gap/i.test(shortPreviewHtml), "stable short preview should avoid remediation wording");
  const shortFallbackHtml = renderToStaticMarkup(h(ParentReportShortContractPreview, { top: null }));
  assert.equal(shortFallbackHtml, "", "missing short contract preview should render empty safely");
}

function runParentReportPageChunks() {
  const longLabel = "" + "".repeat(200);
  const longWhy = "".repeat(500);
  const row = {
    rowKey: "k1",
    label: longLabel,
    questions: 12,
    topicEngineRowSignals: {
      whyThisRecommendationHe: longWhy,
      riskFlags: { falsePromotionRisk: true, recentTransitionRisk: true },
      diagnosticType: "fragile_success",
      confidenceBadge: "medium",
      sufficiencyBadge: "low",
    },
    trend: { version: 1, accuracyDirection: "down", independenceDirection: "up", fluencyDirection: "flat", confidence: 0.5, summaryHe: " ." },
    behaviorProfile: { version: 1, dominantType: "instruction_friction", signals: {}, decisionTrace: [] },
    decisionTrace: [],
    recommendationDecisionTrace: [],
  };
  render("parent-report:explain-row-stress", h(ParentReportTopicExplainRow, { row }));
  render("parent-report:explain-block", h(ParentReportTopicExplainBlock, { rows: [row] }));

  const rowMinimal = {
    rowKey: "k2",
    label: "",
    questions: 8,
    topicEngineRowSignals: null,
    trend: null,
    behaviorProfile: null,
  };
  render("parent-report:explain-row-minimal", h(ParentReportTopicExplainRow, { row: rowMinimal }));

  const rowTrendV1 = {
    rowKey: "k2b",
    label: "Addition",
    questions: 12,
    topicEngineRowSignals: null,
    trend: null,
    trendV1: {
      ok: true,
      direction: "stable",
      parentLineHe:
        "Trend for this period: no significant change — short practice can help reinforce the topic.",
    },
  };
  const trendRowHtml = renderToStaticMarkup(h(ParentReportTopicExplainRow, { row: rowTrendV1, compact: true }));
  assert.match(trendRowHtml, /parent-report-topic-trend-v1/u);
  assert.match(trendRowHtml, /trend for this period:\s*no significant change/i);
  assert.match(trendRowHtml, /what to do together/i);
  render("parent-report:explain-row-trend-v1", h(ParentReportTopicExplainRow, { row: rowTrendV1, compact: true }));

  const rowChartLive = {
    rowKey: "geometry_area\u0001g4",
    label: " -  ",
    questions: 12,
    accuracy: 45,
    wrong: 6,
    correct: 6,
  };
  const chartLiveHtml = renderToStaticMarkup(h(ParentReportTopicExplainRow, { row: rowChartLive }));
  assert.match(chartLiveHtml, /what we see/i, "chart live row should render What we see");
  assert.match(chartLiveHtml, /the data/i, "chart live row should render The data");
  assert.match(chartLiveHtml, /what it means/i, "chart live row should render What it means");
  assert.ok(
    /what to do together/i.test(chartLiveHtml) ||
      /add a short practice/i.test(chartLiveHtml),
    "chart live row should render home action or practice_focus meaning-only explain",
  );
  assert.match(chartLiveHtml, /parent-report-topic-diagnostic-explain/u);
  render("parent-report:explain-row-chart-live", h(ParentReportTopicExplainRow, { row: rowChartLive }));

  const rowPhase8 = {
    rowKey: "p8-row",
    label: "",
    questions: 11,
    topicEngineRowSignals: {
      whyThisRecommendationHe: "   SSR.",
      interventionPlanHe: " :    .",
      doNowHe: "  .",
      avoidNowHe: "      .",
      cautionLineHe: ":  .",
      recommendedSessionCount: 2,
      recommendedSessionLengthBand: "short",
      recommendedPracticeLoad: "light",
      interventionDurationBand: "short",
      interventionFormat: "mixed",
      interventionIntensity: "focused",
      interventionParentEffort: "medium",
    },
    trend: null,
    behaviorProfile: null,
    decisionTrace: [],
    recommendationDecisionTrace: [],
  };
  render("parent-report:explain-row-phase8", h(ParentReportTopicExplainRow, { row: rowPhase8 }));

  const rowPhase10 = {
    ...rowPhase8,
    topicEngineRowSignals: {
      ...rowPhase8.topicEngineRowSignals,
      responseToInterventionLabelHe: "   —   ",
      freshnessStateLabelHe: "  ",
      conclusionFreshnessLabelHe: "   —   ",
      nextSupportAdjustmentHe: "  /     ",
    },
  };
  render("parent-report:explain-row-phase10", h(ParentReportTopicExplainRow, { row: rowPhase10 }));

  const rowPhase11 = {
    ...rowPhase10,
    topicEngineRowSignals: {
      ...rowPhase10.topicEngineRowSignals,
      supportSequenceStateLabelHe: "   —    ",
      strategyRepetitionRiskHe: "       ",
      nextSupportSequenceActionHe: "    —    ",
    },
  };
  render("parent-report:explain-row-phase11", h(ParentReportTopicExplainRow, { row: rowPhase11 }));

  const rowPhase12 = {
    ...rowPhase11,
    topicEngineRowSignals: {
      ...rowPhase11.topicEngineRowSignals,
      recommendationMemoryStateLabelHe: "    —   ",
      outcomeTrackingNarrativeHe: "   —      .",
      recommendationContinuationDecisionHe: "         ",
    },
  };
  render("parent-report:explain-row-phase12", h(ParentReportTopicExplainRow, { row: rowPhase12 }));

  const rowPhase13 = {
    ...rowPhase12,
    topicEngineRowSignals: {
      ...rowPhase12.topicEngineRowSignals,
      gateNarrativeHe: ":      .",
      evidenceTargetNarrativeHe: ":     .",
      releaseGate: "pending",
      whatWouldJustifyReleaseHe: "      .",
      pivotGate: "off",
      recheckGate: "off",
    },
  };
  render("parent-report:explain-row-phase13", h(ParentReportTopicExplainRow, { row: rowPhase13 }));

  const rowPhase14 = {
    ...rowPhase13,
    topicEngineRowSignals: {
      ...rowPhase13.topicEngineRowSignals,
      foundationDependencyNarrativeHe: "«»:    —   .",
      interventionOrderingHe: "   —   ",
      foundationBeforeExpansion: true,
      foundationBeforeExpansionHe: "     —        .",
    },
  };
  render("parent-report:explain-row-phase14", h(ParentReportTopicExplainRow, { row: rowPhase14 }));

  const rowPhase15 = {
    ...rowPhase14,
    topicEngineRowSignals: {
      ...rowPhase14.topicEngineRowSignals,
      freshnessStateLabelHe: "  ",
      conclusionFreshnessLabelHe: "  ",
      whatNeedsFreshEvidenceNowHe: "    ",
      nextSupportAdjustmentHe: "  —   ",
      nextSupportSequenceActionHe: "  —   ",
    },
  };
  render("parent-report:explain-row-phase15", h(ParentReportTopicExplainRow, { row: rowPhase15 }));
}

function runParentReportInsightChunk() {
  const html = render(
    "parent-report:parent-ai-insight",
    h(ParentReportInsight, {
      explanation: {
        ok: true,
        text: "Parent test copy — a report-grounded insight for SSR and print verification.".repeat(3),
      },
    })
  );
  assert.ok(html.includes("Insight for parents"), "insight title should render");
  assert.ok(html.includes("Parent test copy"), "insight body should render");
}

function runParentAssignedActivitiesSectionChunk() {
  const rows = [
    {
      activityLabelHe: "   — ",
      subjectLabelHe: "",
      topicLabelHe: "",
      gradeLabelHe: "",
      lastActivityAtHe: "01/03/2026",
      questionCount: 10,
      accuracy: 80,
      timeMinutes: 5,
      statusLabelHe: "",
    },
  ];
  const html = render(
    "parent-assigned-activities:collapsed",
    h(ParentAssignedActivitiesSection, { rows }),
  );
  assert.ok(html.includes("<details"), "parent activities must use details");
  assert.ok(!/\bdetails[^>]*\sopen[\s=>]/i.test(html), "parent activities must be collapsed by default");
  assert.ok(html.includes("no-pdf"), "parent activities must be no-pdf");
  assert.ok(html.includes("no-print"), "parent activities must be no-print");
  assert.ok(html.includes("Personal activities from parent (1)"), "parent activities summary shows count");

  const emptyHtml = renderToStaticMarkup(h(ParentAssignedActivitiesSection, { rows: [] }));
  assert.equal(emptyHtml, "", "empty parent activities render nothing");
}

function main() {
  runDetailedPageChunks();
  runContractBindingChunks();
  runParentReportPageChunks();
  runParentReportInsightChunk();
  runParentAssignedActivitiesSectionChunk();
  console.log("parent-report pages SSR smoke: OK");
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
