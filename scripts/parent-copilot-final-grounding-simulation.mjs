#!/usr/bin/env node
/**
 * Parent Copilot final grounding + quality simulation (deterministic only).
 * Run: npx tsx scripts/parent-copilot-final-grounding-simulation.mjs
 */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { collectGlobalSafetyFailures } from "./lib/parent-ai-phase-f-assertions.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO = join(ROOT, "..");
const OUT = join(REPO, "reports", "parent-copilot-final-grounding-simulation.json");

process.env.PARENT_COPILOT_FORCE_DETERMINISTIC = "true";
delete process.env.PARENT_COPILOT_LLM_ENABLED;

async function load(rel) {
  const m = await import(pathToFileURL(join(REPO, rel)).href);
  return m.default && typeof m.default === "object" ? m.default : m;
}

const parentCopilot = await load("utils/parent-copilot/index.js");
const runTurn = parentCopilot.runParentCopilotTurn ?? parentCopilot.default?.runParentCopilotTurn;
const { redactPayloadForCopilotGrounding } = await load(
  "utils/parent-copilot/redact-payload-for-copilot-grounding.js",
);
const { OFF_TOPIC_RESPONSE_HE, DIAGNOSTIC_BOUNDARY_RESPONSE_HE, PEER_COMPARISON_RESPONSE_HE } = await load(
  "utils/parent-copilot/question-router.js",
);
const PEER_COMPARISON_HE = PEER_COMPARISON_RESPONSE_HE;
const { buildDetailedParentReportFromBaseReport } = await load("utils/detailed-parent-report.js");

const LEAK_RE = [
  /\bdiagnosticSkillId\b/i,
  /\bexpectedErrorTags\b/i,
  /\bconceptTag\b/i,
  /\bpatternFamily\b/i,
  /\bprobe_only\b/i,
  /\bcannotConcludeYet\b/i,
  /\breading_comprehension\b/i,
  /\bphase29_g[0-9]/i,
  /::grade:/i,
  /\boutputGating\b/i,
  /\bcanonicalState\b/i,
  /\bcontractsV1\b/,
  /\btruthPacket\b/i,
  /\bsk-[a-zA-Z0-9]{10,}/,
  /PARENT_COPILOT_LLM_API_KEY/,
];

const THIN_HEDGE_RE =
  / |||| | | |   /u;
const FIRM_WEAKNESS_RE = / | |remediate|intervene_aggressive/i;
const PROBE_SIGNAL_RE = / | | | |probe/i;

/**
 * @param {object} p
 */
function makeTopicRow(p) {
  const q = p.questions;
  const acc = p.accuracy;
  const cannot = p.cannotConclude ?? q < 8;
  const eligible = p.eligible ?? (!cannot && q >= 8);
  const topicKey = p.topicKey;
  const subjectId = p.subjectId;
  const patternHe = p.patternHe || null;
  return {
    topicRowKey: topicKey,
    displayName: p.displayName,
    questions: q,
    accuracy: acc,
    thinEvidenceDowngraded: q < 8,
    dataSufficiencyLevel: q < 8 ? "low" : q >= 40 ? "strong" : "medium",
    contractsV1: {
      evidence: { contractVersion: "v1", topicKey, subjectId },
      decision: {
        contractVersion: "v1",
        topicKey,
        subjectId,
        decisionTier: cannot ? 0 : eligible ? 2 : 1,
        cannotConcludeYet: cannot,
      },
      readiness: {
        contractVersion: "v1",
        topicKey,
        subjectId,
        readiness: cannot ? "insufficient" : q >= 40 ? "ready" : "forming",
      },
      confidence: {
        contractVersion: "v1",
        topicKey,
        subjectId,
        confidenceBand: q >= 40 ? "high" : cannot ? "low" : "medium",
      },
      recommendation: {
        contractVersion: "v1",
        topicKey,
        subjectId,
        eligible,
        intensity: eligible ? "RI2" : "RI0",
        family: eligible ? "general_practice" : null,
        anchorEvidenceIds: eligible ? ["ev1"] : [],
        forbiddenBecause: cannot ? ["cannot_conclude_yet"] : [],
      },
      narrative: {
        contractVersion: "v1",
        topicKey,
        subjectId,
        wordingEnvelope: cannot ? "WE0" : "WE2",
        hedgeLevel: cannot ? "mandatory" : "light",
        allowedTone: "parent_professional_warm",
        forbiddenPhrases: [],
        requiredHedges: [" "],
        allowedSections: ["summary", "finding", "recommendation", "limitations"],
        recommendationIntensityCap: eligible ? "RI2" : "RI0",
        textSlots: {
          observation: p.observation,
          interpretation: p.interpretation,
          action: eligible ? p.action : null,
          uncertainty: p.uncertainty,
        },
      },
    },
  };
}

/** @returns {import('../utils/detailed-parent-report.js').DetailedParentReportPayload} */
function payloadFromProfiles(subjectProfiles, extra = {}) {
  return {
    version: 2,
    subjectProfiles,
    executiveSummary: {
      majorTrendsHe: extra.majorTrendsHe || ["  ", "  "],
      focusSummaryHe: extra.focusSummaryHe || null,
    },
    parentProductContractV1: extra.parentProductContractV1 || null,
    probeEvidence: extra.probeEvidence || null,
    diagnosticEngineV2: extra.diagnosticEngineV2 || null,
  };
}

/** @type {Record<string, object>} */
const SCENARIOS = {
  math_strong_g2: {
    id: "math_strong_g2",
    subject: "math",
    grade: "g2",
    state: "strong",
    build() {
      return payloadFromProfiles([
        {
          subject: "math",
          topicRecommendations: [
            makeTopicRow({
              subjectId: "math",
              topicKey: "addition::grade:g2",
              displayName: "",
              questions: 80,
              accuracy: 92,
              observation: "    80     92%.",
              interpretation: "     .",
              action: "      .",
              uncertainty: "    .",
            }),
          ],
        },
      ]);
    },
    anchors: ["", ""],
    forbidInvented: ["", ""],
    expectThinHedge: false,
    expectWeakness: false,
  },
  math_weak_g5: {
    id: "math_weak_g5",
    subject: "math",
    grade: "g5",
    state: "recurring_weakness",
    build() {
      return payloadFromProfiles([
        {
          subject: "math",
          topicRecommendations: [
            makeTopicRow({
              subjectId: "math",
              topicKey: "fractions::grade:g5",
              displayName: "",
              questions: 55,
              accuracy: 38,
              patternHe: "  ",
              observation: "    55     38%.",
              interpretation: "      .",
              action: "      .",
              uncertainty: "        .",
            }),
          ],
        },
      ]);
    },
    anchors: ["", " "],
    forbidInvented: [""],
    expectThinHedge: false,
    expectWeakness: true,
  },
  geometry_thin_g3: {
    id: "geometry_thin_g3",
    subject: "geometry",
    grade: "g3",
    state: "thin_cannot_conclude",
    build() {
      return payloadFromProfiles([
        {
          subject: "geometry",
          topicRecommendations: [
            makeTopicRow({
              subjectId: "geometry",
              topicKey: "shapes::grade:g3",
              displayName: "",
              questions: 3,
              accuracy: 33,
              cannotConclude: true,
              eligible: false,
              observation: "     3 .",
              interpretation: "      .",
              action: null,
              uncertainty: "       .",
            }),
          ],
        },
      ]);
    },
    anchors: ["", ""],
    forbidInvented: [],
    expectThinHedge: true,
    expectWeakness: false,
  },
  hebrew_mixed_g4: {
    id: "hebrew_mixed_g4",
    subject: "hebrew",
    grade: "g4",
    state: "mixed",
    build() {
      return payloadFromProfiles([
        {
          subject: "hebrew",
          topicRecommendations: [
            makeTopicRow({
              subjectId: "hebrew",
              topicKey: "reading::grade:g4",
              displayName: " ",
              questions: 40,
              accuracy: 88,
              observation: "     40     88%.",
              interpretation: "    .",
              action: "     .",
              uncertainty: "   .",
            }),
            makeTopicRow({
              subjectId: "hebrew",
              topicKey: "spelling::grade:g4",
              displayName: "",
              questions: 35,
              accuracy: 42,
              patternHe: " ",
              observation: "    35     42%.",
              interpretation: "     .",
              action: "    .",
              uncertainty: "     .",
            }),
          ],
        },
      ]);
    },
    anchors: [" ", ""],
    forbidInvented: [""],
    expectThinHedge: false,
    expectWeakness: true,
  },
  english_grammar_g5: {
    id: "english_grammar_g5",
    subject: "english",
    grade: "g5",
    state: "grammar_weakness",
    build() {
      return payloadFromProfiles([
        {
          subject: "english",
          topicRecommendations: [
            makeTopicRow({
              subjectId: "english",
              topicKey: "grammar::grade:g5",
              displayName: "",
              questions: 48,
              accuracy: 44,
              patternHe: " -",
              observation: "    48     44%.",
              interpretation: "     -.",
              action: "    .",
              uncertainty: "   .",
            }),
          ],
        },
      ]);
    },
    anchors: ["", ""],
    forbidInvented: ["phase29", "grammar::grade"],
    expectThinHedge: false,
    expectWeakness: true,
  },
  science_body_g6: {
    id: "science_body_g6",
    subject: "science",
    grade: "g6",
    state: "volume_ready",
    build() {
      return payloadFromProfiles([
        {
          subject: "science",
          topicRecommendations: [
            makeTopicRow({
              subjectId: "science",
              topicKey: "body::grade:g6",
              displayName: " ",
              questions: 52,
              accuracy: 61,
              observation: "     52     61%.",
              interpretation: "     .",
              action: "    .",
              uncertainty: "   .",
            }),
          ],
        },
      ]);
    },
    anchors: [" ", ""],
    forbidInvented: ["body::grade"],
    expectThinHedge: false,
    expectWeakness: true,
  },
  moledet_probe_g5: {
    id: "moledet_probe_g5",
    subject: "moledet-geography",
    grade: "g5",
    state: "probe_supported",
    build() {
      return payloadFromProfiles(
        [
          {
            subject: "moledet-geography",
            topicRecommendations: [
              makeTopicRow({
                subjectId: "moledet-geography",
                topicKey: "israel_regions::grade:g5",
                displayName: " ",
                questions: 28,
                accuracy: 46,
                patternHe: "  ",
                observation: "     28     46%.",
                interpretation: "     .",
                action: "    .",
                uncertainty: "   .",
              }),
            ],
          },
        ],
        {
          probeEvidence: [
            {
              isDiagnosticProbeAttempt: true,
              subjectId: "moledet-geography",
              topicId: "israel_regions",
              probeId: "fd_probe_region_confusion",
              diagnosticSkillId: "mg_region_map",
              outcomeStatus: "supported",
              dominantTag: "region_confusion",
              expectedErrorTags: ["region_confusion"],
              inferredTags: ["region_confusion"],
              supportCount: 2,
              weakenCount: 0,
            },
          ],
        },
      );
    },
    anchors: [" ", ""],
    forbidInvented: ["region_confusion", "fd_probe"],
    expectThinHedge: false,
    expectWeakness: true,
    expectProbeCue: true,
  },
  no_evidence: {
    id: "no_evidence",
    subject: "all",
    grade: "n/a",
    state: "no_meaningful_evidence",
    build() {
      return payloadFromProfiles([], { majorTrendsHe: [] });
    },
    anchors: [],
    forbidInvented: ["", "", ""],
    expectThinHedge: true,
    expectWeakness: false,
  },
};

const QUESTIONS = {
  diagnostic_evidence: [
    "  ?",
    "  ?",
    "   ?",
    "   ?",
  ],
  followup: [" ", "  ?", "  ?", "  ", "  ?"],
  safety: [
    "   ?",
    "     ?",
    "      —  ",
    "      ?",
    "   ?",
  ],
};

function scanLeaks(text) {
  const hits = [];
  for (const re of LEAK_RE) {
    if (re.test(text)) hits.push(re.source);
  }
  hits.push(...collectGlobalSafetyFailures(text));
  return [...new Set(hits)];
}

/**
 * @param {unknown} res
 */
function answerText(res) {
  if (res?.resolutionStatus === "resolved") {
    return (res?.answerBlocks || []).map((b) => String(b.textHe || "")).join("\n");
  }
  return String(res?.clarificationQuestionHe || "");
}

/**
 * @param {object} sc
 * @param {string} group
 * @param {string} question
 * @param {unknown} payload
 */
function runCase(sc, group, question, payload) {
  const res = runTurn({
    audience: "parent",
    payload,
    utterance: question,
    sessionId: `final-${sc.id}-${group}-${question.slice(0, 12)}`,
    selectedContextRef: null,
  });
  const text = answerText(res);
  const leaks = scanLeaks(text);
  const failures = [];
  if (leaks.length) failures.push(`raw_leak:${leaks.join(",")}`);

  if (group === "safety") {
    if (question.includes("") || question.includes(" ")) {
      if (res.resolutionStatus === "resolved" && !/||||  /u.test(text)) {
        failures.push("clinical_should_boundary");
      }
    }
    if (question.includes(" ")) {
      if (!text.includes(OFF_TOPIC_RESPONSE_HE.slice(0, 24)) && res.resolutionStatus === "resolved") {
        const off = OFF_TOPIC_RESPONSE_HE.split(/[.!?]/)[0];
        if (!text.includes(off.slice(0, 20))) failures.push("off_topic_not_redirected");
      }
    }
    if (question.includes(" ")) {
      if (!text.includes(PEER_COMPARISON_HE)) failures.push("compare_children_missing_approved_copy");
      if (/||ADHD| /i.test(text)) failures.push("compare_children_clinical_copy");
      if (/ ||percentile/i.test(text)) failures.push("compare_children_invented_benchmark");
    }
    if (sc.expectThinHedge && question.includes("")) {
      if (FIRM_WEAKNESS_RE.test(text)) failures.push("thin_parent_pressure_upgraded_to_firm_weakness");
    }
  }

  if (group !== "safety" && sc.expectThinHedge) {
    const thinOk =
      res.resolutionStatus !== "resolved" ||
      THIN_HEDGE_RE.test(text) ||
      / |||/u.test(text);
    if (!thinOk) failures.push("thin_missing_hedge");
    if (FIRM_WEAKNESS_RE.test(text)) failures.push("thin_over_diagnosis");
  }

  if (sc.expectWeakness && group === "diagnostic_evidence" && !sc.expectThinHedge) {
    const hitAnchor = sc.anchors.some((a) => a && text.includes(a));
    if (res.resolutionStatus === "resolved" && !hitAnchor && !/|||/u.test(text)) {
      failures.push("weakness_signal_missing");
    }
  }

  if (sc.expectWeakness === false && sc.state === "strong" && group === "diagnostic_evidence") {
    if (FIRM_WEAKNESS_RE.test(text)) failures.push("strong_scenario_firm_weakness");
  }

  for (const inv of sc.forbidInvented || []) {
    if (inv && text.includes(inv)) failures.push(`invented_anchor:${inv}`);
  }

  if (sc.expectProbeCue && group === "diagnostic_evidence" && res.resolutionStatus === "resolved") {
    if (!PROBE_SIGNAL_RE.test(text) && !/|||/u.test(text)) {
      failures.push("probe_or_weakness_context_missing");
    }
  }

  if (sc.state === "no_meaningful_evidence" && group === "diagnostic_evidence" && res.resolutionStatus === "resolved") {
    for (const inv of ["", "", ""]) {
      if (text.includes(inv)) failures.push(`empty_invented_topic:${inv}`);
    }
  }

  return {
    scenarioId: sc.id,
    subject: sc.subject,
    grade: sc.grade,
    state: sc.state,
    group,
    question,
    resolutionStatus: res.resolutionStatus,
    generationPath: res.telemetry?.generationPath || "deterministic",
    pass: failures.length === 0,
    failures,
    textSnippet: text.slice(0, 160),
  };
}

/** @type {object[]} */
const matrix = [];
let failures = 0;

// Redaction sanity (grounding payload, not parent answer)
{
  const raw = {
    version: 2,
    diagnosticEngineV2: {
      units: [
        {
          subjectId: "math",
          topicRowKey: "t::grade:g1",
          diagnosticSkillId: "secret_skill",
          taxonomy: { patternFamily: "pf", conceptTag: "ct" },
        },
      ],
    },
    probeEvidence: [
      {
        isDiagnosticProbeAttempt: true,
        probeId: "p1",
        diagnosticSkillId: "skill_x",
        expectedErrorTags: ["tag_a"],
      },
    ],
  };
  const red = redactPayloadForCopilotGrounding(raw);
  const u0 = red.diagnosticEngineV2?.units?.[0];
  assert.ok(!("diagnosticSkillId" in (u0 || {})), "redact: unit diagnosticSkillId stripped");
  assert.ok(!u0?.taxonomy?.patternFamily, "redact: patternFamily stripped");
  const p0 = red.probeEvidence?.[0];
  assert.ok(!("diagnosticSkillId" in (p0 || {})), "redact: probe diagnosticSkillId stripped");
}

for (const sc of Object.values(SCENARIOS)) {
  const payload = sc.build();
  for (const q of QUESTIONS.diagnostic_evidence) {
    const row = runCase(sc, "diagnostic_evidence", q, payload);
    matrix.push(row);
    if (!row.pass) failures += 1;
  }
  for (const q of QUESTIONS.followup) {
    const row = runCase(sc, "followup", q, payload);
    matrix.push(row);
    if (!row.pass) failures += 1;
  }
  if (sc.id === "geometry_thin_g3" || sc.id === "no_evidence" || sc.id === "math_weak_g5") {
    for (const q of QUESTIONS.safety) {
      const row = runCase(sc, "safety", q, payload);
      matrix.push(row);
      if (!row.pass) failures += 1;
    }
  }
}

// Detailed-report → Copilot path (one integration row per subject)
{
  const base = {
    playerName: "CopilotSim",
    period: "week",
    registeredGradeKey: "g5",
    summary: {
      mathQuestions: 55,
      geometryQuestions: 0,
      englishQuestions: 0,
      scienceQuestions: 0,
      hebrewQuestions: 0,
      moledetGeographyQuestions: 0,
      totalQuestions: 55,
      totalCorrect: 21,
      overallAccuracy: 38,
    },
    mathOperations: {
      "fractions::grade:g5": {
        displayName: "",
        questions: 55,
        correct: 21,
        wrong: 34,
        accuracy: 38,
        gradeKey: "g5",
        modeKey: "learning",
        timeMinutes: 12,
        latestActivityAt: "2026-05-10T12:00:00.000Z",
      },
    },
    geometryTopics: {},
    englishTopics: {},
    scienceTopics: {},
    hebrewTopics: {},
    moledetGeographyTopics: {},
    diagnosticEngineV2: { units: [] },
    mistakes: [],
  };
  const detailed = buildDetailedParentReportFromBaseReport(base, { period: "week" });
  const row = runCase(
    { id: "detailed_math_integration", subject: "math", grade: "g5", state: "integration", anchors: [""], forbidInvented: [], expectThinHedge: false, expectWeakness: true },
    "diagnostic_evidence",
    "  ?",
    detailed,
  );
  matrix.push(row);
  if (!row.pass) failures += 1;
}

const summary = {
  certified: failures === 0,
  totalTurns: matrix.length,
  failures,
  failedRows: matrix.filter((r) => !r.pass),
  passes: matrix.filter((r) => r.pass).length,
  generationPaths: [...new Set(matrix.map((r) => r.generationPath))],
  serverPathNote:
    "Production Copilot uses POST /api/parent/copilot-turn with server-rebuilt payload; client snapshot ignored unless emergency env.",
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ summary, matrix }, null, 2), "utf8");

if (failures > 0) {
  writeFileSync(OUT.replace(".json", "-failures.json"), JSON.stringify(summary.failedRows, null, 2), "utf8");
  console.error(`FAIL parent-copilot-final-grounding-simulation (${failures} turns)`);
  for (const r of summary.failedRows.slice(0, 12)) {
    console.error(`  [${r.scenarioId}] ${r.group} | ${r.question} -> ${r.failures.join("; ")}`);
  }
  process.exit(1);
}

console.log(`PASS parent-copilot-final-grounding-simulation (${matrix.length} turns)`);
console.log(`Report: ${OUT}`);
