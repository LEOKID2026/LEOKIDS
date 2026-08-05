/**
 * Parent diagnostic explanation layer — all approved subject taxonomy batches verify.
 * Run: npx tsx scripts/parent-report-diagnostic-explanation-verify.mjs
 */

import assert from "node:assert/strict";

const M02_PATTERN = "  ";
const M10_ENGINE_PATTERN = "    ";
const M02_EXPLANATION_PREFIX = "   ";
const M03_EXPLANATION_PREFIX = "   ";
const M10_EXPLANATION_PREFIX = "       ";
const M05_EXPLANATION_PREFIX = "      ";
const M09_EXPLANATION_PREFIX = "     ";
const G01_EXPLANATION_PREFIX = "     ";
const G03_EXPLANATION_PREFIX = "     ";
const G08_EXPLANATION_PREFIX = "     ";
const H01_EXPLANATION_PREFIX = "     ";
const H04_EXPLANATION_PREFIX = "    ";
const H05_EXPLANATION_PREFIX = "      ";
const H08_EXPLANATION_PREFIX = "     ";
const E01_EXPLANATION_PREFIX = "       ";
const E05_EXPLANATION_PREFIX = "      ";
const E08_EXPLANATION_PREFIX = "       ";
const S01_EXPLANATION_PREFIX = "       ";
const S04_EXPLANATION_PREFIX = "      ";
const S07_EXPLANATION_PREFIX = "     ";
const S08_EXPLANATION_PREFIX = "       ";
const MG01_EXPLANATION_PREFIX = "     ";
const MG07_EXPLANATION_PREFIX = "       ";
const MG08_EXPLANATION_PREFIX = "     ";

/** @type {Record<string, { patternHe: string; subskillHe: string; bucketKey: string; displayName: string; topicRowSuffix: string }>} */
const MATH_TAXONOMY_FIXTURE = {
  "M-01": {
    patternHe: "  ",
    subskillHe: " 10+1",
    bucketKey: "addition",
    displayName: "",
    topicRowSuffix: "addition\u0001learning\u0001g2\u0001easy",
  },
  "M-02": {
    patternHe: M02_PATTERN,
    subskillHe: "",
    bucketKey: "addition",
    displayName: "",
    topicRowSuffix: "addition\u0001learning\u0001g3\u0001easy",
  },
  "M-03": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "multiplication",
    displayName: "",
    topicRowSuffix: "multiplication\u0001learning\u0001g3\u0001easy",
  },
  "M-04": {
    patternHe: "   ",
    subskillHe: "",
    bucketKey: "fractions",
    displayName: "",
    topicRowSuffix: "fractions\u0001learning\u0001g4\u0001easy",
  },
  "M-05": {
    patternHe: "  ",
    subskillHe: "",
    bucketKey: "fractions",
    displayName: "",
    topicRowSuffix: "fractions\u0001learning\u0001g5\u0001easy",
  },
  "M-06": {
    patternHe: "  ",
    subskillHe: "/",
    bucketKey: "decimals",
    displayName: "",
    topicRowSuffix: "decimals\u0001learning\u0001g5\u0001easy",
  },
  "M-07": {
    patternHe: "  +  ",
    subskillHe: "",
    bucketKey: "word_problems",
    displayName: " ",
    topicRowSuffix: "word_problems\u0001learning\u0001g4\u0001easy",
  },
  "M-08": {
    patternHe: "  ",
    subskillHe: "",
    bucketKey: "word_problems",
    displayName: " ",
    topicRowSuffix: "word_problems\u0001learning\u0001g5\u0001easy",
  },
  "M-09": {
    patternHe: "  /   ",
    subskillHe: " ",
    bucketKey: "subtraction",
    displayName: "",
    topicRowSuffix: "subtraction\u0001learning\u0001g3\u0001easy",
  },
  "M-10": {
    patternHe: M10_ENGINE_PATTERN,
    subskillHe: "",
    bucketKey: "division",
    displayName: "",
    topicRowSuffix: "division\u0001learning\u0001g4\u0001easy",
  },
};

/** @type {Record<string, { patternHe: string; subskillHe: string; bucketKey: string; displayName: string; topicRowSuffix: string }>} */
const GEOMETRY_TAXONOMY_FIXTURE = {
  "G-01": {
    patternHe: " ",
    subskillHe: " /",
    bucketKey: "quadrilaterals",
    displayName: "",
    topicRowSuffix: "quadrilaterals\u0001learning\u0001g4\u0001easy",
  },
  "G-02": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "angles",
    displayName: "",
    topicRowSuffix: "angles\u0001learning\u0001g4\u0001easy",
  },
  "G-03": {
    patternHe: " ",
    subskillHe: "",
    bucketKey: "area",
    displayName: "",
    topicRowSuffix: "area\u0001learning\u0001g4\u0001easy",
  },
  "G-04": {
    patternHe: " ",
    subskillHe: "/",
    bucketKey: "rotation",
    displayName: "",
    topicRowSuffix: "rotation\u0001learning\u0001g4\u0001easy",
  },
  "G-05": {
    patternHe: " ",
    subskillHe: " 3D",
    bucketKey: "volume",
    displayName: "",
    topicRowSuffix: "volume\u0001learning\u0001g4\u0001easy",
  },
  "G-06": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "perimeter",
    displayName: "",
    topicRowSuffix: "perimeter\u0001learning\u0001g4\u0001easy",
  },
  "G-07": {
    patternHe: "  ",
    subskillHe: "",
    bucketKey: "symmetry",
    displayName: "",
    topicRowSuffix: "symmetry\u0001learning\u0001g4\u0001easy",
  },
  "G-08": {
    patternHe: " ÷2   ",
    subskillHe: "×÷2",
    bucketKey: "triangles",
    displayName: "",
    topicRowSuffix: "triangles\u0001learning\u0001g4\u0001easy",
  },
};

/** @type {Record<string, { patternHe: string; subskillHe: string; bucketKey: string; displayName: string; topicRowSuffix: string }>} */
const HEBREW_SUBJECT_TAXONOMY_FIXTURE = {
  "H-01": {
    patternHe: "   ",
    subskillHe: "",
    bucketKey: "vocabulary",
    displayName: " ",
    topicRowSuffix: "vocabulary\u0001learning\u0001g4\u0001easy",
  },
  "H-02": {
    patternHe: "/  ",
    subskillHe: "/",
    bucketKey: "grammar",
    displayName: "",
    topicRowSuffix: "grammar\u0001learning\u0001g4\u0001easy",
  },
  "H-03": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "writing",
    displayName: "",
    topicRowSuffix: "writing\u0001learning\u0001g4\u0001easy",
  },
  "H-04": {
    patternHe: "    ",
    subskillHe: "",
    bucketKey: "reading",
    displayName: "",
    topicRowSuffix: "reading\u0001learning\u0001g4\u0001easy",
  },
  "H-05": {
    patternHe: "  ",
    subskillHe: "",
    bucketKey: "vocabulary",
    displayName: " ",
    topicRowSuffix: "vocabulary\u0001learning\u0001g5\u0001easy",
  },
  "H-06": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "grammar",
    displayName: "",
    topicRowSuffix: "grammar\u0001learning\u0001g5\u0001easy",
  },
  "H-07": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "writing",
    displayName: "",
    topicRowSuffix: "writing\u0001learning\u0001g5\u0001easy",
  },
  "H-08": {
    patternHe: "  ",
    subskillHe: "",
    bucketKey: "speaking",
    displayName: "",
    topicRowSuffix: "speaking\u0001learning\u0001g5\u0001easy",
  },
};

/** @type {Record<string, { patternHe: string; subskillHe: string; bucketKey: string; displayName: string; topicRowSuffix: string }>} */
const ENGLISH_SUBJECT_TAXONOMY_FIXTURE = {
  "E-01": {
    patternHe: "  ",
    subskillHe: "collocation",
    bucketKey: "vocabulary",
    displayName: " ",
    topicRowSuffix: "vocabulary\u0001learning\u0001g4\u0001easy",
  },
  "E-02": {
    patternHe: "past/present",
    subskillHe: " ",
    bucketKey: "grammar",
    displayName: "",
    topicRowSuffix: "grammar\u0001learning\u0001g4\u0001easy",
  },
  "E-03": {
    patternHe: " ",
    subskillHe: " ",
    bucketKey: "translation",
    displayName: "",
    topicRowSuffix: "translation\u0001learning\u0001g4\u0001easy",
  },
  "E-04": {
    patternHe: "he/she/it",
    subskillHe: " ",
    bucketKey: "grammar",
    displayName: "",
    topicRowSuffix: "grammar\u0001learning\u0001g5\u0001easy",
  },
  "E-05": {
    patternHe: "  ",
    subskillHe: "preposition",
    bucketKey: "vocabulary",
    displayName: " ",
    topicRowSuffix: "vocabulary\u0001learning\u0001g5\u0001easy",
  },
  "E-06": {
    patternHe: "  ",
    subskillHe: "inference",
    bucketKey: "sentences",
    displayName: "",
    topicRowSuffix: "sentences\u0001learning\u0001g5\u0001easy",
  },
  "E-07": {
    patternHe: " ",
    subskillHe: " ",
    bucketKey: "writing",
    displayName: "",
    topicRowSuffix: "writing\u0001learning\u0001g5\u0001easy",
  },
  "E-08": {
    patternHe: "  ",
    subskillHe: "minimal pairs",
    bucketKey: "vocabulary",
    displayName: " ",
    topicRowSuffix: "vocabulary\u0001learning\u0001g6\u0001easy",
  },
};

/** @type {Record<string, { patternHe: string; subskillHe: string; bucketKey: string; displayName: string; topicRowSuffix: string }>} */
const SCIENCE_SUBJECT_TAXONOMY_FIXTURE = {
  "S-01": {
    patternHe: " ",
    subskillHe: "  ",
    bucketKey: "animals",
    displayName: " ",
    topicRowSuffix: "animals\u0001learning\u0001g4\u0001easy",
  },
  "S-02": {
    patternHe: " ",
    subskillHe: " ",
    bucketKey: "experiments",
    displayName: "",
    topicRowSuffix: "experiments\u0001learning\u0001g4\u0001easy",
  },
  "S-03": {
    patternHe: "/ ",
    subskillHe: "/",
    bucketKey: "body",
    displayName: " ",
    topicRowSuffix: "body\u0001learning\u0001g4\u0001easy",
  },
  "S-04": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "materials",
    displayName: "",
    topicRowSuffix: "materials\u0001learning\u0001g4\u0001easy",
  },
  "S-05": {
    patternHe: " ",
    subskillHe: " ",
    bucketKey: "experiments",
    displayName: "",
    topicRowSuffix: "experiments\u0001learning\u0001g5\u0001easy",
  },
  "S-06": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "earth_space",
    displayName: "  ",
    topicRowSuffix: "earth_space\u0001learning\u0001g5\u0001easy",
  },
  "S-07": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "environment",
    displayName: "",
    topicRowSuffix: "environment\u0001learning\u0001g5\u0001easy",
  },
  "S-08": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "mixed",
    displayName: "",
    topicRowSuffix: "mixed\u0001learning\u0001g5\u0001easy",
  },
};

/** @type {Record<string, { patternHe: string; subskillHe: string; bucketKey: string; displayName: string; topicRowSuffix: string }>} */
const MOLEDET_GEOGRAPHY_TAXONOMY_FIXTURE = {
  "MG-01": {
    patternHe: "  ",
    subskillHe: "",
    bucketKey: "maps",
    displayName: "",
    topicRowSuffix: "maps\u0001learning\u0001g4\u0001easy",
  },
  "MG-02": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "maps",
    displayName: "",
    topicRowSuffix: "maps\u0001learning\u0001g4\u0001medium",
  },
  "MG-03": {
    patternHe: "  ",
    subskillHe: "/",
    bucketKey: "citizenship",
    displayName: "",
    topicRowSuffix: "citizenship\u0001learning\u0001g4\u0001easy",
  },
  "MG-04": {
    patternHe: " ",
    subskillHe: " ",
    bucketKey: "homeland",
    displayName: "",
    topicRowSuffix: "homeland\u0001learning\u0001g4\u0001easy",
  },
  "MG-05": {
    patternHe: "  ",
    subskillHe: " ",
    bucketKey: "geography",
    displayName: "",
    topicRowSuffix: "geography\u0001learning\u0001g5\u0001easy",
  },
  "MG-06": {
    patternHe: "  ",
    subskillHe: "",
    bucketKey: "homeland",
    displayName: "",
    topicRowSuffix: "homeland\u0001learning\u0001g5\u0001easy",
  },
  "MG-07": {
    patternHe: " ",
    subskillHe: " ",
    bucketKey: "community",
    displayName: "",
    topicRowSuffix: "community\u0001learning\u0001g5\u0001easy",
  },
  "MG-08": {
    patternHe: "  ",
    subskillHe: "",
    bucketKey: "maps",
    displayName: "",
    topicRowSuffix: "maps\u0001learning\u0001g5\u0001easy",
  },
};

const [
  explainMod,
  detailedMod,
  parentReportV2Mod,
  schoolMod,
] = await Promise.all([
  import("../utils/parent-report-language/parent-diagnostic-explanations.js"),
  import("../utils/detailed-parent-report.js"),
  import("../utils/parent-report-v2.js"),
  import("../lib/school-portal/school-report-view-model.js").catch(() => ({ buildSchoolClassReportViewModel: null })),
]);

const {
  buildParentDiagnosticExplanationV1FromV2Unit,
  resolveApprovedParentDiagnosticExplanationV1,
  parentDiagnosticExplanationCatalogForTests,
  mathTaxonomyExplanationIdsForTests,
  geometryTaxonomyExplanationIdsForTests,
  hebrewSubjectTaxonomyExplanationIdsForTests,
  englishSubjectTaxonomyExplanationIdsForTests,
  scienceSubjectTaxonomyExplanationIdsForTests,
  moledetGeographyTaxonomyExplanationIdsForTests,
} = explainMod;
const { buildDetailedParentReportFromBaseReport } = detailedMod;
const { summarizeV2UnitsForSubjectForTests } = parentReportV2Mod;

function buildMathUnit(taxonomyId) {
  const fx = MATH_TAXONOMY_FIXTURE[taxonomyId];
  assert.ok(fx, `fixture for ${taxonomyId}`);
  const topicRowKey = fx.topicRowSuffix;
  return {
    blueprintRef: "test",
    engineVersion: "v2",
    unitKey: `math::${topicRowKey}`,
    subjectId: "math",
    topicRowKey,
    bucketKey: fx.bucketKey,
    displayName: fx.displayName,
    diagnosis: {
      allowed: true,
      taxonomyId,
      lineHe: `  : ${fx.patternHe} ( : ${fx.subskillHe}) ${fx.bucketKey}.`,
    },
    intervention: { taxonomyId },
    taxonomy: { id: taxonomyId, patternHe: fx.patternHe, subskillHe: fx.subskillHe },
    recurrence: { wrongCountForRules: 4, full: true, wrongEventCount: 4 },
    confidence: { level: "moderate" },
    priority: { level: "P3" },
    competingHypotheses: { hypotheses: [] },
    strengthProfile: { tags: [], dominantBehavior: null },
    outputGating: {
      interventionAllowed: true,
      diagnosisAllowed: true,
      probeOnly: false,
      cannotConcludeYet: false,
      additiveCautionAllowed: false,
      positiveAuthorityLevel: "none",
    },
    probe: { specificationHe: "", objectiveHe: "" },
    explainability: { whyNotStrongerConclusionHe: [], cannotConcludeYetHe: [] },
    evidenceTrace: [{ type: "volume", value: { questions: 12, correct: 8, wrong: 4, accuracy: 67 } }],
    canonicalState: {
      actionState: "intervene",
      recommendation: { allowed: true, family: "remedial" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "none" },
      topicStateId: `ts_${taxonomyId}`,
      stateHash: "h1",
    },
  };
}

function rowFor(unit) {
  return {
    bucketKey: unit.bucketKey,
    displayName: unit.displayName,
    questions: 12,
    correct: 8,
    wrong: 4,
    accuracy: 67,
    gradeKey: "g4",
    modeKey: "learning",
    levelKey: "easy",
    lastSessionMs: Date.UTC(2026, 4, 6, 12, 0, 0),
  };
}

function subjectLabelHeForUnit(unit) {
  if (unit.subjectId === "geometry") return "";
  if (unit.subjectId === "hebrew") return "";
  if (unit.subjectId === "english") return "";
  if (unit.subjectId === "science") return "";
  if (unit.subjectId === "moledet-geography") return " ";
  return "";
}

function shortSummaryForUnit(unit) {
  const topicRowKey = unit.topicRowKey;
  const topicMap = { [topicRowKey]: rowFor(unit) };
  return summarizeV2UnitsForSubjectForTests([unit], {
    subjectReportQuestions: 12,
    subjectLabelHe: subjectLabelHeForUnit(unit),
    topicMap,
    reportTotalQuestions: 20,
  });
}

function buildGeometryUnit(taxonomyId) {
  const fx = GEOMETRY_TAXONOMY_FIXTURE[taxonomyId];
  assert.ok(fx, `geometry fixture for ${taxonomyId}`);
  const topicRowKey = fx.topicRowSuffix;
  return {
    blueprintRef: "test",
    engineVersion: "v2",
    unitKey: `geometry::${topicRowKey}`,
    subjectId: "geometry",
    topicRowKey,
    bucketKey: fx.bucketKey,
    displayName: fx.displayName,
    diagnosis: {
      allowed: true,
      taxonomyId,
      lineHe: `  : ${fx.patternHe} ( : ${fx.subskillHe}) ${fx.bucketKey}.`,
    },
    intervention: { taxonomyId },
    taxonomy: { id: taxonomyId, patternHe: fx.patternHe, subskillHe: fx.subskillHe },
    recurrence: { wrongCountForRules: 4, full: true, wrongEventCount: 4 },
    confidence: { level: "moderate" },
    priority: { level: "P3" },
    competingHypotheses: { hypotheses: [] },
    strengthProfile: { tags: [], dominantBehavior: null },
    outputGating: {
      interventionAllowed: true,
      diagnosisAllowed: true,
      probeOnly: false,
      cannotConcludeYet: false,
      additiveCautionAllowed: false,
      positiveAuthorityLevel: "none",
    },
    probe: { specificationHe: "", objectiveHe: "" },
    explainability: { whyNotStrongerConclusionHe: [], cannotConcludeYetHe: [] },
    evidenceTrace: [{ type: "volume", value: { questions: 12, correct: 8, wrong: 4, accuracy: 67 } }],
    canonicalState: {
      actionState: "intervene",
      recommendation: { allowed: true, family: "remedial" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "none" },
      topicStateId: `ts_${taxonomyId}`,
      stateHash: "h1",
    },
  };
}

function buildHebrewSubjectUnit(taxonomyId) {
  const fx = HEBREW_SUBJECT_TAXONOMY_FIXTURE[taxonomyId];
  assert.ok(fx, `hebrew fixture for ${taxonomyId}`);
  const topicRowKey = fx.topicRowSuffix;
  return {
    blueprintRef: "test",
    engineVersion: "v2",
    unitKey: `hebrew::${topicRowKey}`,
    subjectId: "hebrew",
    topicRowKey,
    bucketKey: fx.bucketKey,
    displayName: fx.displayName,
    diagnosis: {
      allowed: true,
      taxonomyId,
      lineHe: `  : ${fx.patternHe} ( : ${fx.subskillHe}) ${fx.bucketKey}.`,
    },
    intervention: { taxonomyId },
    taxonomy: { id: taxonomyId, patternHe: fx.patternHe, subskillHe: fx.subskillHe },
    recurrence: { wrongCountForRules: 4, full: true, wrongEventCount: 4 },
    confidence: { level: "moderate" },
    priority: { level: "P3" },
    competingHypotheses: { hypotheses: [] },
    strengthProfile: { tags: [], dominantBehavior: null },
    outputGating: {
      interventionAllowed: true,
      diagnosisAllowed: true,
      probeOnly: false,
      cannotConcludeYet: false,
      additiveCautionAllowed: false,
      positiveAuthorityLevel: "none",
    },
    probe: { specificationHe: "", objectiveHe: "" },
    explainability: { whyNotStrongerConclusionHe: [], cannotConcludeYetHe: [] },
    evidenceTrace: [{ type: "volume", value: { questions: 12, correct: 8, wrong: 4, accuracy: 67 } }],
    canonicalState: {
      actionState: "intervene",
      recommendation: { allowed: true, family: "remedial" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "none" },
      topicStateId: `ts_${taxonomyId}`,
      stateHash: "h1",
    },
  };
}

function buildEnglishSubjectUnit(taxonomyId) {
  const fx = ENGLISH_SUBJECT_TAXONOMY_FIXTURE[taxonomyId];
  assert.ok(fx, `english fixture for ${taxonomyId}`);
  const topicRowKey = fx.topicRowSuffix;
  return {
    blueprintRef: "test",
    engineVersion: "v2",
    unitKey: `english::${topicRowKey}`,
    subjectId: "english",
    topicRowKey,
    bucketKey: fx.bucketKey,
    displayName: fx.displayName,
    diagnosis: {
      allowed: true,
      taxonomyId,
      lineHe: `  : ${fx.patternHe} ( : ${fx.subskillHe}) ${fx.bucketKey}.`,
    },
    intervention: { taxonomyId },
    taxonomy: { id: taxonomyId, patternHe: fx.patternHe, subskillHe: fx.subskillHe },
    recurrence: { wrongCountForRules: 4, full: true, wrongEventCount: 4 },
    confidence: { level: "moderate" },
    priority: { level: "P3" },
    competingHypotheses: { hypotheses: [] },
    strengthProfile: { tags: [], dominantBehavior: null },
    outputGating: {
      interventionAllowed: true,
      diagnosisAllowed: true,
      probeOnly: false,
      cannotConcludeYet: false,
      additiveCautionAllowed: false,
      positiveAuthorityLevel: "none",
    },
    probe: { specificationHe: "", objectiveHe: "" },
    explainability: { whyNotStrongerConclusionHe: [], cannotConcludeYetHe: [] },
    evidenceTrace: [{ type: "volume", value: { questions: 12, correct: 8, wrong: 4, accuracy: 67 } }],
    canonicalState: {
      actionState: "intervene",
      recommendation: { allowed: true, family: "remedial" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "none" },
      topicStateId: `ts_${taxonomyId}`,
      stateHash: "h1",
    },
  };
}

function buildScienceSubjectUnit(taxonomyId) {
  const fx = SCIENCE_SUBJECT_TAXONOMY_FIXTURE[taxonomyId];
  assert.ok(fx, `science fixture for ${taxonomyId}`);
  const topicRowKey = fx.topicRowSuffix;
  return {
    blueprintRef: "test",
    engineVersion: "v2",
    unitKey: `science::${topicRowKey}`,
    subjectId: "science",
    topicRowKey,
    bucketKey: fx.bucketKey,
    displayName: fx.displayName,
    diagnosis: {
      allowed: true,
      taxonomyId,
      lineHe: `  : ${fx.patternHe} ( : ${fx.subskillHe}) ${fx.bucketKey}.`,
    },
    intervention: { taxonomyId },
    taxonomy: { id: taxonomyId, patternHe: fx.patternHe, subskillHe: fx.subskillHe },
    recurrence: { wrongCountForRules: 4, full: true, wrongEventCount: 4 },
    confidence: { level: "moderate" },
    priority: { level: "P3" },
    competingHypotheses: { hypotheses: [] },
    strengthProfile: { tags: [], dominantBehavior: null },
    outputGating: {
      interventionAllowed: true,
      diagnosisAllowed: true,
      probeOnly: false,
      cannotConcludeYet: false,
      additiveCautionAllowed: false,
      positiveAuthorityLevel: "none",
    },
    probe: { specificationHe: "", objectiveHe: "" },
    explainability: { whyNotStrongerConclusionHe: [], cannotConcludeYetHe: [] },
    evidenceTrace: [{ type: "volume", value: { questions: 12, correct: 8, wrong: 4, accuracy: 67 } }],
    canonicalState: {
      actionState: "intervene",
      recommendation: { allowed: true, family: "remedial" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "none" },
      topicStateId: `ts_${taxonomyId}`,
      stateHash: "h1",
    },
  };
}

function buildMoledetGeographySubjectUnit(taxonomyId) {
  const fx = MOLEDET_GEOGRAPHY_TAXONOMY_FIXTURE[taxonomyId];
  assert.ok(fx, `moledet-geography fixture for ${taxonomyId}`);
  const topicRowKey = fx.topicRowSuffix;
  return {
    blueprintRef: "test",
    engineVersion: "v2",
    unitKey: `moledet-geography::${topicRowKey}`,
    subjectId: "moledet-geography",
    topicRowKey,
    bucketKey: fx.bucketKey,
    displayName: fx.displayName,
    diagnosis: {
      allowed: true,
      taxonomyId,
      lineHe: `  : ${fx.patternHe} ( : ${fx.subskillHe}) ${fx.bucketKey}.`,
    },
    intervention: { taxonomyId },
    taxonomy: { id: taxonomyId, patternHe: fx.patternHe, subskillHe: fx.subskillHe },
    recurrence: { wrongCountForRules: 4, full: true, wrongEventCount: 4 },
    confidence: { level: "moderate" },
    priority: { level: "P3" },
    competingHypotheses: { hypotheses: [] },
    strengthProfile: { tags: [], dominantBehavior: null },
    outputGating: {
      interventionAllowed: true,
      diagnosisAllowed: true,
      probeOnly: false,
      cannotConcludeYet: false,
      additiveCautionAllowed: false,
      positiveAuthorityLevel: "none",
    },
    probe: { specificationHe: "", objectiveHe: "" },
    explainability: { whyNotStrongerConclusionHe: [], cannotConcludeYetHe: [] },
    evidenceTrace: [{ type: "volume", value: { questions: 12, correct: 8, wrong: 4, accuracy: 67 } }],
    canonicalState: {
      actionState: "intervene",
      recommendation: { allowed: true, family: "remedial" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "none" },
      topicStateId: `ts_${taxonomyId}`,
      stateHash: "h1",
    },
  };
}

// --- Catalog: all approved subject batches (50 taxonomy entries) ---
{
  const catalog = parentDiagnosticExplanationCatalogForTests();
  const mathIds = mathTaxonomyExplanationIdsForTests();
  const geomIds = geometryTaxonomyExplanationIdsForTests();
  const hebIds = hebrewSubjectTaxonomyExplanationIdsForTests();
  const engIds = englishSubjectTaxonomyExplanationIdsForTests();
  const sciIds = scienceSubjectTaxonomyExplanationIdsForTests();
  const mgIds = moledetGeographyTaxonomyExplanationIdsForTests();
  assert.deepEqual(
    mathIds,
    ["M-01", "M-02", "M-03", "M-04", "M-05", "M-06", "M-07", "M-08", "M-09", "M-10"],
    "math catalog M-01..M-10",
  );
  assert.deepEqual(
    geomIds,
    ["G-01", "G-02", "G-03", "G-04", "G-05", "G-06", "G-07", "G-08"],
    "geometry catalog G-01..G-08",
  );
  assert.deepEqual(
    hebIds,
    ["H-01", "H-02", "H-03", "H-04", "H-05", "H-06", "H-07", "H-08"],
    "hebrew-subject catalog H-01..H-08",
  );
  assert.deepEqual(
    engIds,
    ["E-01", "E-02", "E-03", "E-04", "E-05", "E-06", "E-07", "E-08"],
    "english-subject catalog E-01..E-08",
  );
  assert.deepEqual(
    sciIds,
    ["S-01", "S-02", "S-03", "S-04", "S-05", "S-06", "S-07", "S-08"],
    "science-subject catalog S-01..S-08",
  );
  assert.deepEqual(
    mgIds,
    ["MG-01", "MG-02", "MG-03", "MG-04", "MG-05", "MG-06", "MG-07", "MG-08"],
    "moledet-geography catalog MG-01..MG-08",
  );
  assert.equal(catalog.length, 50);
  for (const e of catalog.filter((x) => x.lookupKey.includes(":M-"))) {
    assert.equal(e.approvalSource, "owner_math_batch_approved", e.lookupKey);
  }
  for (const e of catalog.filter((x) => x.lookupKey.includes(":G-"))) {
    assert.equal(e.approvalSource, "owner_geometry_batch_approved", e.lookupKey);
  }
  for (const e of catalog.filter((x) => x.lookupKey.includes(":H-"))) {
    assert.equal(e.approvalSource, "owner_hebrew_subject_batch_approved", e.lookupKey);
  }
  for (const e of catalog.filter((x) => x.lookupKey.includes(":E-"))) {
    assert.equal(e.approvalSource, "owner_english_subject_batch_approved", e.lookupKey);
  }
  for (const e of catalog.filter((x) => x.lookupKey.includes(":S-"))) {
    assert.equal(e.approvalSource, "owner_science_subject_batch_approved", e.lookupKey);
  }
  for (const e of catalog.filter((x) => x.lookupKey.includes(":MG-"))) {
    assert.equal(e.approvalSource, "owner_moledet_geography_batch_approved", e.lookupKey);
  }
  for (const e of catalog) {
    assert.equal(e.status, "approved");
    assert.ok(e.explanationHe.startsWith(" "), `${e.lookupKey} prefix`);
    assert.ok(!e.explanationHe.includes("/ "), `${e.lookupKey} no child-blame wording`);
    if (e.exampleHe) {
      assert.ok(!e.explanationHe.includes(String(e.exampleHe)), `${e.lookupKey} example separate from explanation`);
    }
  }
  assert.equal(resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "M-99" }), null);
  assert.equal(resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "G-99" }), null);
  assert.equal(resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "H-99" }), null);
  assert.equal(resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "E-99" }), null);
  assert.equal(resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "S-99" }), null);
  assert.equal(resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "MG-99" }), null);
}

// --- Each M-01 … M-10 diagnosed → resolves on weakness row ---
for (const taxonomyId of mathTaxonomyExplanationIdsForTests()) {
  const unit = buildMathUnit(taxonomyId);
  const entry = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId });
  assert.ok(entry, `${taxonomyId} catalog entry resolves`);
  const fromUnit = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.equal(fromUnit?.lookupKey, `finding:taxonomy:${taxonomyId}`);
  assert.equal(fromUnit?.explanationHe, entry.explanationHe);
  assert.equal(fromUnit?.exampleHe, entry.exampleHe);

  const short = shortSummaryForUnit(unit);
  const w0 = short.topWeaknesses?.[0];
  assert.ok(w0?.parentDiagnosticExplanationV1, `${taxonomyId} weakness carries explanation`);
  assert.equal(w0.parentDiagnosticExplanationV1.explanationHe, entry.explanationHe);
}

// --- M-02 / M-10 exact wording preserved ---
{
  const m02 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "M-02" });
  assert.equal(
    m02.explanationHe,
    "         .        9.",
  );
  assert.equal(m02.exampleHe, "27 + 18");
  const m10 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "M-10" });
  assert.equal(
    m10.explanationHe,
    "       . ,           .",
  );
  assert.equal(m10.exampleHe, "12 ÷ 3 = 4; 4 × 3 = 12");
}

// --- M-03 only → no M-02 / M-10 explanations ---
{
  const unit = buildMathUnit("M-03");
  const short = shortSummaryForUnit(unit);
  const blob = JSON.stringify(short);
  assert.ok(blob.includes(M03_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M02_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M10_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M05_EXPLANATION_PREFIX));
}

// --- No math taxonomy weakness → no explanation block ---
{
  const topicRowKey = "addition\u0001learning\u0001g3\u0001easy";
  const unit = {
    ...buildMathUnit("M-02"),
    taxonomy: { id: "M-02", patternHe: "", subskillHe: "" },
    diagnosis: { allowed: true, taxonomyId: "M-02", lineHe: "" },
    canonicalState: {
      actionState: "maintain",
      recommendation: { allowed: false, family: "maintain" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "excellent" },
      topicStateId: "ts_str",
      stateHash: "h2",
    },
  };
  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses?.length || 0, 0, "no pattern label → no weakness row");
  const blob = JSON.stringify(short);
  assert.ok(!blob.includes(M02_EXPLANATION_PREFIX));
}

// --- M-09 snapshot (detailed + short) ---
{
  const unit = buildMathUnit("M-09");
  const short = shortSummaryForUnit(unit);
  const w0 = short.topWeaknesses[0];
  assert.ok(w0.parentDiagnosticExplanationV1.explanationHe.startsWith(M09_EXPLANATION_PREFIX));
  assert.equal(w0.parentDiagnosticExplanationV1.exampleHe, "13 - 5");

  const topicRowKey = unit.topicRowKey;
  const detailed = buildDetailedParentReportFromBaseReport(
    {
      startDate: "2026-05-01",
      endDate: "2026-05-08",
      period: "week",
      summary: { totalQuestions: 20 },
      mathOperations: { [topicRowKey]: rowFor(unit) },
      diagnosticEngineV2: { units: [unit] },
    },
    { period: "week" },
  );
  const sp = detailed.subjectProfiles.find((p) => p.subject === "math");
  assert.ok(sp.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe.startsWith(M09_EXPLANATION_PREFIX));
}

// --- Each G-01 … G-08 diagnosed → resolves on weakness row ---
for (const taxonomyId of geometryTaxonomyExplanationIdsForTests()) {
  const unit = buildGeometryUnit(taxonomyId);
  const entry = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId });
  assert.ok(entry, `${taxonomyId} geometry catalog entry resolves`);
  const fromUnit = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.equal(fromUnit?.lookupKey, `finding:taxonomy:${taxonomyId}`);
  assert.equal(fromUnit?.explanationHe, entry.explanationHe);
  assert.equal(fromUnit?.exampleHe, entry.exampleHe);

  const short = shortSummaryForUnit(unit);
  const w0 = short.topWeaknesses?.[0];
  assert.ok(w0?.parentDiagnosticExplanationV1, `${taxonomyId} geometry weakness carries explanation`);
  assert.equal(w0.parentDiagnosticExplanationV1.explanationHe, entry.explanationHe);
}

// --- G-03 only → no G-01 / G-08 / math explanations ---
{
  const unit = buildGeometryUnit("G-03");
  const short = shortSummaryForUnit(unit);
  const blob = JSON.stringify(short);
  assert.ok(blob.includes(G03_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(G01_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(G08_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M02_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M10_EXPLANATION_PREFIX));
}

// --- No geometry taxonomy weakness → no geometry explanation ---
{
  const unit = {
    ...buildGeometryUnit("G-03"),
    taxonomy: { id: "G-03", patternHe: "", subskillHe: "" },
    diagnosis: { allowed: true, taxonomyId: "G-03", lineHe: "" },
    canonicalState: {
      actionState: "maintain",
      recommendation: { allowed: false, family: "maintain" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "excellent" },
      topicStateId: "ts_geom_str",
      stateHash: "h2",
    },
  };
  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses?.length || 0, 0);
  const blob = JSON.stringify(short);
  assert.ok(!blob.includes(G03_EXPLANATION_PREFIX));
}

// --- Geometry LTR example lines (separate from explanationHe) ---
{
  const g03 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "G-03" });
  assert.equal(g03.exampleHe, " ⟂ ");
  assert.ok(!g03.explanationHe.includes("⟂"));
  const g06 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "G-06" });
  assert.equal(g06.exampleHe, "120  = 1.2 ");
  assert.ok(!g06.explanationHe.includes("1.2"));
  const g08 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "G-08" });
  assert.equal(g08.exampleHe, " 6,  4: 6 × 4 ÷ 2");
  assert.ok(!g08.explanationHe.includes("6 × 4"));
}

// --- G-08 snapshot ---
{
  const unit = buildGeometryUnit("G-08");
  const ex = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.ok(ex.explanationHe.startsWith(G08_EXPLANATION_PREFIX));
  assert.equal(ex.exampleHe, " 6,  4: 6 × 4 ÷ 2");
  process.stdout.write(
    `\n[G-08 snapshot]\n${ex.explanationHe}\n : ${ex.exampleHe}\n`,
  );
}

// --- Each H-01 … H-08 diagnosed → resolves on weakness row ---
for (const taxonomyId of hebrewSubjectTaxonomyExplanationIdsForTests()) {
  const unit = buildHebrewSubjectUnit(taxonomyId);
  const entry = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId });
  assert.ok(entry, `${taxonomyId} hebrew-subject catalog entry resolves`);
  const fromUnit = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.equal(fromUnit?.lookupKey, `finding:taxonomy:${taxonomyId}`);
  assert.equal(fromUnit?.explanationHe, entry.explanationHe);
  assert.equal(fromUnit?.exampleHe, entry.exampleHe);

  const short = shortSummaryForUnit(unit);
  const w0 = short.topWeaknesses?.[0];
  assert.ok(w0?.parentDiagnosticExplanationV1, `${taxonomyId} hebrew weakness carries explanation`);
  assert.equal(w0.parentDiagnosticExplanationV1.explanationHe, entry.explanationHe);
}

// --- H-04 only → no H-01 / H-08 / math / geometry explanations ---
{
  const unit = buildHebrewSubjectUnit("H-04");
  const short = shortSummaryForUnit(unit);
  const blob = JSON.stringify(short);
  assert.ok(blob.includes(H04_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(H01_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(H08_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M02_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M10_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(G03_EXPLANATION_PREFIX));
}

// --- No Hebrew-subject taxonomy weakness → no Hebrew-subject explanation ---
{
  const unit = {
    ...buildHebrewSubjectUnit("H-04"),
    taxonomy: { id: "H-04", patternHe: "", subskillHe: "" },
    diagnosis: { allowed: true, taxonomyId: "H-04", lineHe: "" },
    canonicalState: {
      actionState: "maintain",
      recommendation: { allowed: false, family: "maintain" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "excellent" },
      topicStateId: "ts_heb_str",
      stateHash: "h2",
    },
  };
  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses?.length || 0, 0);
  const blob = JSON.stringify(short);
  assert.ok(!blob.includes(H04_EXPLANATION_PREFIX));
}

// --- Hebrew-subject LTR example lines (separate from explanationHe) ---
{
  const h04 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "H-04" });
  assert.equal(h04.exampleHe, " ? /  ?");
  assert.ok(!h04.explanationHe.includes(" "));
  const h05 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "H-05" });
  assert.equal(h05.exampleHe, " / ");
  assert.ok(!h05.explanationHe.includes(" / "));
  const h01 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "H-01" });
  assert.equal(h01.exampleHe, " / ");
  assert.ok(!h01.explanationHe.includes(""));
}

// --- H-05 snapshot (short + detailed) ---
{
  const unit = buildHebrewSubjectUnit("H-05");
  const ex = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.ok(ex.explanationHe.startsWith(H05_EXPLANATION_PREFIX));
  assert.equal(ex.exampleHe, " / ");

  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe, ex.explanationHe);

  const topicRowKey = unit.topicRowKey;
  const detailed = buildDetailedParentReportFromBaseReport(
    {
      startDate: "2026-05-01",
      endDate: "2026-05-08",
      period: "week",
      summary: { totalQuestions: 20 },
      hebrewTopics: { [topicRowKey]: rowFor(unit) },
      diagnosticEngineV2: { units: [unit] },
    },
    { period: "week" },
  );
  const sp = detailed.subjectProfiles.find((p) => p.subject === "hebrew");
  assert.ok(sp.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe.startsWith(H05_EXPLANATION_PREFIX));
  process.stdout.write(
    `\n[H-05 snapshot]\n${ex.explanationHe}\n : ${ex.exampleHe}\n`,
  );
}

// --- Each E-01 … E-08 diagnosed → resolves on weakness row ---
for (const taxonomyId of englishSubjectTaxonomyExplanationIdsForTests()) {
  const unit = buildEnglishSubjectUnit(taxonomyId);
  const entry = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId });
  assert.ok(entry, `${taxonomyId} english-subject catalog entry resolves`);
  const fromUnit = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.equal(fromUnit?.lookupKey, `finding:taxonomy:${taxonomyId}`);
  assert.equal(fromUnit?.explanationHe, entry.explanationHe);
  assert.equal(fromUnit?.exampleHe, entry.exampleHe);

  const short = shortSummaryForUnit(unit);
  const w0 = short.topWeaknesses?.[0];
  assert.ok(w0?.parentDiagnosticExplanationV1, `${taxonomyId} english weakness carries explanation`);
  assert.equal(w0.parentDiagnosticExplanationV1.explanationHe, entry.explanationHe);
}

// --- E-05 only → no E-01 / E-08 / math / geometry / Hebrew explanations ---
{
  const unit = buildEnglishSubjectUnit("E-05");
  const short = shortSummaryForUnit(unit);
  const blob = JSON.stringify(short);
  assert.ok(blob.includes(E05_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(E01_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(E08_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M02_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M10_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(G03_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(H04_EXPLANATION_PREFIX));
}

// --- No English-subject taxonomy weakness → no English-subject explanation ---
{
  const unit = {
    ...buildEnglishSubjectUnit("E-05"),
    taxonomy: { id: "E-05", patternHe: "", subskillHe: "preposition" },
    diagnosis: { allowed: true, taxonomyId: "E-05", lineHe: "" },
    canonicalState: {
      actionState: "maintain",
      recommendation: { allowed: false, family: "maintain" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "excellent" },
      topicStateId: "ts_eng_str",
      stateHash: "h2",
    },
  };
  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses?.length || 0, 0);
  const blob = JSON.stringify(short);
  assert.ok(!blob.includes(E05_EXPLANATION_PREFIX));
}

// --- English-subject LTR example lines (separate from explanationHe) ---
{
  const e01 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "E-01" });
  assert.equal(e01.exampleHe, "make a decision");
  assert.ok(!e01.explanationHe.includes("make a decision"));
  const e05 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "E-05" });
  assert.equal(e05.exampleHe, "in / on / at");
  assert.ok(!e05.explanationHe.includes("in / on / at"));
  const e08 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "E-08" });
  assert.equal(e08.exampleHe, "ship / sheep");
  assert.ok(!e08.explanationHe.includes("ship / sheep"));
}

// --- E-08 snapshot (short + detailed) ---
{
  const unit = buildEnglishSubjectUnit("E-08");
  const ex = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.ok(ex.explanationHe.startsWith(E08_EXPLANATION_PREFIX));
  assert.equal(ex.exampleHe, "ship / sheep");

  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe, ex.explanationHe);

  const topicRowKey = unit.topicRowKey;
  const detailed = buildDetailedParentReportFromBaseReport(
    {
      startDate: "2026-05-01",
      endDate: "2026-05-08",
      period: "week",
      summary: { totalQuestions: 20 },
      englishTopics: { [topicRowKey]: rowFor(unit) },
      diagnosticEngineV2: { units: [unit] },
    },
    { period: "week" },
  );
  const sp = detailed.subjectProfiles.find((p) => p.subject === "english");
  assert.ok(sp.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe.startsWith(E08_EXPLANATION_PREFIX));
  process.stdout.write(
    `\n[E-08 snapshot]\n${ex.explanationHe}\n : ${ex.exampleHe}\n`,
  );
}

// --- Each S-01 … S-08 diagnosed → resolves on weakness row ---
for (const taxonomyId of scienceSubjectTaxonomyExplanationIdsForTests()) {
  const unit = buildScienceSubjectUnit(taxonomyId);
  const entry = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId });
  assert.ok(entry, `${taxonomyId} science-subject catalog entry resolves`);
  const fromUnit = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.equal(fromUnit?.lookupKey, `finding:taxonomy:${taxonomyId}`);
  assert.equal(fromUnit?.explanationHe, entry.explanationHe);
  assert.equal(fromUnit?.exampleHe, entry.exampleHe);

  const short = shortSummaryForUnit(unit);
  const w0 = short.topWeaknesses?.[0];
  assert.ok(w0?.parentDiagnosticExplanationV1, `${taxonomyId} science weakness carries explanation`);
  assert.equal(w0.parentDiagnosticExplanationV1.explanationHe, entry.explanationHe);
}

// --- S-04 only → no S-01 / S-08 / math / geometry / Hebrew / English explanations ---
{
  const unit = buildScienceSubjectUnit("S-04");
  const short = shortSummaryForUnit(unit);
  const blob = JSON.stringify(short);
  assert.ok(blob.includes(S04_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(S01_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(S08_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M02_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M10_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(G03_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(H04_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(E05_EXPLANATION_PREFIX));
}

// --- No Science-subject taxonomy weakness → no Science-subject explanation ---
{
  const unit = {
    ...buildScienceSubjectUnit("S-04"),
    taxonomy: { id: "S-04", patternHe: "", subskillHe: " " },
    diagnosis: { allowed: true, taxonomyId: "S-04", lineHe: "" },
    canonicalState: {
      actionState: "maintain",
      recommendation: { allowed: false, family: "maintain" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "excellent" },
      topicStateId: "ts_sci_str",
      stateHash: "h2",
    },
  };
  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses?.length || 0, 0);
  const blob = JSON.stringify(short);
  assert.ok(!blob.includes(S04_EXPLANATION_PREFIX));
}

// --- Science-subject example lines (separate from explanationHe) ---
{
  const s03 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "S-03" });
  assert.equal(s03.exampleHe, " →  ");
  assert.ok(!s03.explanationHe.includes(" →  "));
  const s04 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "S-04" });
  assert.equal(s04.exampleHe, " → ");
  assert.ok(!s04.explanationHe.includes(" → "));
  const s05 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "S-05" });
  assert.equal(s05.exampleHe, "1000  = 1 ");
  assert.ok(!s05.explanationHe.includes("1000 "));
  const s07 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "S-07" });
  assert.equal(s07.exampleHe, " →  → ");
  assert.ok(!s07.explanationHe.includes(" → "));
}

// --- S-07 snapshot (short + detailed) ---
{
  const unit = buildScienceSubjectUnit("S-07");
  const ex = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.ok(ex.explanationHe.startsWith(S07_EXPLANATION_PREFIX));
  assert.equal(ex.exampleHe, " →  → ");

  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe, ex.explanationHe);

  const topicRowKey = unit.topicRowKey;
  const detailed = buildDetailedParentReportFromBaseReport(
    {
      startDate: "2026-05-01",
      endDate: "2026-05-08",
      period: "week",
      summary: { totalQuestions: 20 },
      scienceTopics: { [topicRowKey]: rowFor(unit) },
      diagnosticEngineV2: { units: [unit] },
    },
    { period: "week" },
  );
  const sp = detailed.subjectProfiles.find((p) => p.subject === "science");
  assert.ok(sp.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe.startsWith(S07_EXPLANATION_PREFIX));
  process.stdout.write(
    `\n[S-07 snapshot]\n${ex.explanationHe}\n : ${ex.exampleHe}\n`,
  );
}

// --- Each MG-01 … MG-08 diagnosed → resolves on weakness row ---
for (const taxonomyId of moledetGeographyTaxonomyExplanationIdsForTests()) {
  const unit = buildMoledetGeographySubjectUnit(taxonomyId);
  const entry = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId });
  assert.ok(entry, `${taxonomyId} moledet-geography catalog entry resolves`);
  const fromUnit = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.equal(fromUnit?.lookupKey, `finding:taxonomy:${taxonomyId}`);
  assert.equal(fromUnit?.explanationHe, entry.explanationHe);
  assert.equal(fromUnit?.exampleHe, entry.exampleHe);

  const short = shortSummaryForUnit(unit);
  const w0 = short.topWeaknesses?.[0];
  assert.ok(w0?.parentDiagnosticExplanationV1, `${taxonomyId} moledet-geography weakness carries explanation`);
  assert.equal(w0.parentDiagnosticExplanationV1.explanationHe, entry.explanationHe);
}

// --- MG-01 only → no MG-08 / Science / English / Hebrew / Geometry / Math explanations ---
{
  const unit = buildMoledetGeographySubjectUnit("MG-01");
  const short = shortSummaryForUnit(unit);
  const blob = JSON.stringify(short);
  assert.ok(blob.includes(MG01_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(MG08_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M02_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(M10_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(G03_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(H04_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(E05_EXPLANATION_PREFIX));
  assert.ok(!blob.includes(S04_EXPLANATION_PREFIX));
}

// --- No Moledet/Geography taxonomy weakness → no Moledet/Geography explanation ---
{
  const unit = {
    ...buildMoledetGeographySubjectUnit("MG-01"),
    taxonomy: { id: "MG-01", patternHe: "", subskillHe: "" },
    diagnosis: { allowed: true, taxonomyId: "MG-01", lineHe: "" },
    canonicalState: {
      actionState: "maintain",
      recommendation: { allowed: false, family: "maintain" },
      assessment: { readiness: "ready", confidenceLevel: "moderate", cannotConcludeYet: false },
      evidence: { positiveAuthorityLevel: "excellent" },
      topicStateId: "ts_mg_str",
      stateHash: "h2",
    },
  };
  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses?.length || 0, 0);
  const blob = JSON.stringify(short);
  assert.ok(!blob.includes(MG01_EXPLANATION_PREFIX));
}

// --- Moledet/Geography example lines (separate from explanationHe) ---
{
  const mg01 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "MG-01" });
  assert.equal(mg01.exampleHe, "1   = 1  ");
  assert.ok(!mg01.explanationHe.includes("1  "));
  const mg03 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "MG-03" });
  assert.equal(mg03.exampleHe, "  /    ");
  assert.ok(!mg03.explanationHe.includes(" "));
  const mg07 = resolveApprovedParentDiagnosticExplanationV1({ taxonomyId: "MG-07" });
  assert.equal(mg07.exampleHe, " —  /   — ");
  assert.ok(!mg07.explanationHe.includes(" — "));
}

// --- MG-07 snapshot (short + detailed) ---
{
  const unit = buildMoledetGeographySubjectUnit("MG-07");
  const ex = buildParentDiagnosticExplanationV1FromV2Unit(unit);
  assert.ok(ex.explanationHe.startsWith(MG07_EXPLANATION_PREFIX));
  assert.equal(ex.exampleHe, " —  /   — ");

  const short = shortSummaryForUnit(unit);
  assert.equal(short.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe, ex.explanationHe);

  const topicRowKey = unit.topicRowKey;
  const detailed = buildDetailedParentReportFromBaseReport(
    {
      startDate: "2026-05-01",
      endDate: "2026-05-08",
      period: "week",
      summary: { totalQuestions: 20 },
      moledetGeographyTopics: { [topicRowKey]: rowFor(unit) },
      diagnosticEngineV2: { units: [unit] },
    },
    { period: "week" },
  );
  const sp = detailed.subjectProfiles.find((p) => p.subject === "moledet-geography");
  assert.ok(sp.topWeaknesses[0].parentDiagnosticExplanationV1.explanationHe.startsWith(MG07_EXPLANATION_PREFIX));
  process.stdout.write(
    `\n[MG-07 snapshot]\n${ex.explanationHe}\n : ${ex.exampleHe}\n`,
  );
}

// --- School report unchanged ---
if (schoolMod.buildSchoolClassReportViewModel) {
  const vm = schoolMod.buildSchoolClassReportViewModel({
    classLabel: "",
    subjectReports: [],
    guidanceFocus: [],
  });
  const blob = JSON.stringify(vm);
  for (const prefix of [
    M02_EXPLANATION_PREFIX,
    M03_EXPLANATION_PREFIX,
    M05_EXPLANATION_PREFIX,
    M09_EXPLANATION_PREFIX,
    M10_EXPLANATION_PREFIX,
    G01_EXPLANATION_PREFIX,
    G03_EXPLANATION_PREFIX,
    G08_EXPLANATION_PREFIX,
    H01_EXPLANATION_PREFIX,
    H04_EXPLANATION_PREFIX,
    H05_EXPLANATION_PREFIX,
    H08_EXPLANATION_PREFIX,
    E01_EXPLANATION_PREFIX,
    E05_EXPLANATION_PREFIX,
    E08_EXPLANATION_PREFIX,
    S01_EXPLANATION_PREFIX,
    S04_EXPLANATION_PREFIX,
    S07_EXPLANATION_PREFIX,
    S08_EXPLANATION_PREFIX,
    MG01_EXPLANATION_PREFIX,
    MG07_EXPLANATION_PREFIX,
    MG08_EXPLANATION_PREFIX,
  ]) {
    assert.ok(!blob.includes(prefix), "school report must not include parent explanations");
  }
}

process.stdout.write("OK parent-report-diagnostic-explanation-verify\n");
