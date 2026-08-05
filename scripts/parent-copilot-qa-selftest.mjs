/**
 * Focused Parent Copilot Q&A full-pipeline checks.
 * Run: npm run test:parent-copilot-qa
 *
 * Tests the real runParentCopilotTurn pipeline end-to-end — not just Stage A or validators.
 * Groups:
 *   A — Off-topic (deterministic, no LLM, no report data, exact boundary text)
 *   B — Main focus (specific focus areas, practical steps)
 *   C — Strengths (grounded only, no hype)
 *   D — Weaknesses (calm, specific, no diagnosis)
 *   E — Home practice (practical plan)
 *   F — High-data (484 answers, no global thin-data wording)
 *   G — Thin-data (3 answers, cautious wording)
 *   H — Scoped thin-data (high global, low topic)
 *   I — Diagnostic (no diagnosis, practice-data limitation)
 *   J — Unit checks (router, Stage A, validator helpers)
 */

import stageAMod from "../utils/parent-copilot/stage-a-freeform-interpretation.js";
import guardrailMod from "../utils/parent-copilot/guardrail-validator.js";
import reportVolumeMod from "../utils/parent-copilot/report-volume-context.js";
import questionRouterMod from "../utils/parent-copilot/question-router.js";
import parentCopilot from "../utils/parent-copilot/index.js";
import classifierMod from "../utils/parent-copilot/question-classifier.js";

const { interpretFreeformStageA } = stageAMod;
const { AMBIGUOUS_RESPONSE_HE } = classifierMod;
const { validateAnswerDraft } = guardrailMod;
const { maxGlobalReportQuestionCount, STRONG_GLOBAL_QUESTION_FLOOR } = reportVolumeMod;
const { routeParentQuestion, OFF_TOPIC_RESPONSE_HE, GENERAL_OFF_TOPIC_RESPONSE_HE } = questionRouterMod;

let failures = 0;
let runs = 0;

function check(name, ok, detail) {
  runs += 1;
  if (!ok) {
    failures += 1;
    process.stderr.write(`FAIL  ${name}${detail ? ` :: ${detail}` : ""}\n`);
  } else {
    process.stdout.write(`  ok  ${name}\n`);
  }
}

function answerText(res) {
  if (res.resolutionStatus === "resolved") {
    return (Array.isArray(res.answerBlocks) ? res.answerBlocks : [])
      .map((b) => String(b?.textHe || ""))
      .join(" ");
  }
  return String(res.clarificationQuestionHe || "");
}

// ─── Payload builders ────────────────────────────────────────────────────────

function makeContract(topicKey, subjectId, obs, interp, act, unc, qCount = 12, acc = 75, recEligible = true) {
  return {
    topicRowKey: topicKey,
    displayName: topicKey === "geo" ? "" : topicKey === "frac" ? "" : topicKey === "eng_vocab" ? " " : " ",
    questions: qCount,
    accuracy: acc,
    contractsV1: {
      narrative: {
        contractVersion: "v1",
        topicKey,
        subjectId,
        wordingEnvelope: "WE2",
        hedgeLevel: "light",
        allowedTone: "parent_professional_warm",
        forbiddenPhrases: [],
        requiredHedges: [],
        allowedSections: ["summary", "finding", "recommendation", "limitations"],
        recommendationIntensityCap: recEligible ? "RI2" : "RI0",
        textSlots: {
          observation: obs,
          interpretation: interp,
          action: act,
          uncertainty: unc,
        },
      },
      decision: { contractVersion: "v1", topicKey, subjectId, decisionTier: 2, cannotConcludeYet: false },
      readiness: { contractVersion: "v1", topicKey, subjectId, readiness: "emerging" },
      confidence: { contractVersion: "v1", topicKey, subjectId, confidenceBand: "medium" },
      recommendation: {
        contractVersion: "v1", topicKey, subjectId,
        eligible: recEligible, intensity: recEligible ? "RI2" : "RI0",
        family: "general_practice", anchorEvidenceIds: [], rationaleCodes: [], forbiddenBecause: [],
      },
      evidence: { contractVersion: "v1", topicKey, subjectId },
    },
  };
}

/** Payload with 484 total answers — full report, high data */
function highDataPayload() {
  const mathGeo = makeContract(
    "geo", "math",
    "  45 ,    72%.",
    "         .",
    "       .",
    "     .",
  );
  const mathFrac = makeContract(
    "frac", "math",
    "  60 ,    68%.",
    "       .",
    "      .",
    "     .",
  );
  const engVocab = makeContract(
    "eng_vocab", "english",
    "    38 ,    81%.",
    "    .",
    "    .",
    "",
  );
  return {
    version: 2,
    summary: { totalAnswers: 484 },
    overallSnapshot: { totalQuestions: 484, accuracyPct: 74 },
    subjectProfiles: [
      { subject: "math", topicRecommendations: [mathGeo, mathFrac] },
      { subject: "english", topicRecommendations: [engVocab] },
    ],
    executiveSummary: {
      majorTrendsHe: [
        "   484      -74%.",
        "     .",
        "   .",
      ],
    },
  };
}

/** Payload with 3 total answers — thin data */
function thinDataPayload() {
  const tr = makeContract(
    "frac", "math",
    "  3  ,    -67%.",
    "   —  ,   .",
    "",
    "  ,    .",
    3, 67, false,
  );
  return {
    version: 2,
    summary: { totalAnswers: 3 },
    overallSnapshot: { totalQuestions: 3, accuracyPct: 67 },
    subjectProfiles: [
      { subject: "math", topicRecommendations: [tr] },
    ],
    executiveSummary: { majorTrendsHe: ["  —   ."] },
  };
}

/** Payload: high global (300 answers) but geometry topic has only 2 answers */
function scopedThinDataPayload() {
  const geoThin = makeContract(
    "geo", "math",
    "   2   —  .",
    "     ,      .",
    "",
    "     .",
    2, 50, false,
  );
  const mathMain = makeContract(
    "frac", "math",
    "  80 ,    -72%.",
    "   .",
    "  .",
    "",
    80, 72,
  );
  return {
    version: 2,
    summary: { totalAnswers: 300 },
    overallSnapshot: { totalQuestions: 300, accuracyPct: 73 },
    subjectProfiles: [
      { subject: "math", topicRecommendations: [geoThin, mathMain] },
    ],
    executiveSummary: {
      majorTrendsHe: [
        "   300 .",
        "     .",
      ],
    },
  };
}

// ─── SESSIONS: fresh session ID per test to avoid state bleed ────────────────
let sid = 0;
function freshSid() { return `qa-test-${++sid}-${Date.now()}`; }

// ═══════════════════════════════════════════════════════════════════════════════
// Group A — Off-topic (deterministic boundary, no LLM, no report data)
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group A: Off-topic ──\n");

const OFF_TOPIC_BANNED_PATTERNS = [
  // No report-data numbers
  /\d{2,}\s*/,
  /\d{2,}\s*/,
  /\s+\s*\d/,
  /\s+\s+\d/,
  // No child summary
  /\s+(||||)/,
  // No topic/subject commentary
  /|/,
  /||/,
  // No " " or similar
  /\s+|\s+\s+/,
  // No thin-data phrases
  /\s+|\s+\s+|\s+/,
  // No "   "
  /\s+\s+\s+/,
];

const offTopicQuestions = [
  "  ?",
  "  ?",         // no  — regression test
  " ?",
  " ",
  "  ?",
  " ?",
  "  ?",
  // ── Classifier regression list (adversarial cases the regex-only router missed) ──
  "  ?",
  "  ?",
  "    ?",
  "  ?",
  "   ?",
  "  17  24?",
];

// Off-topic-or-ambiguous: classifier may legitimately route either way; either
// boundary copy is acceptable as long as no report data leaks.
const offTopicOrAmbiguousQuestions = [
  "  ?",
  "  ?",
  "",
];

for (const q of offTopicQuestions) {
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: q,
    sessionId: freshSid(),
    selectedContextRef: null,
  });

  const text = answerText(res);
  const textLower = text.toLowerCase();

  // Must return a boundary response (clarification or resolved with only boundary text)
  check(
    `[A] off_topic response has content :: "${q}"`,
    text.trim().length > 0,
    `empty answer`,
  );

  // Must contain the exact expected boundary text
  check(
    `[A] off_topic boundary text :: "${q}"`,
    text === GENERAL_OFF_TOPIC_RESPONSE_HE || text === OFF_TOPIC_RESPONSE_HE,
    `got: ${text.slice(0, 120)}`,
  );

  // Must NOT contain report data
  for (const re of OFF_TOPIC_BANNED_PATTERNS) {
    if (re.test(text)) {
      check(`[A] off_topic no report data (${re}) :: "${q}"`, false, `banned pattern found in: ${text.slice(0, 200)}`);
    }
  }

  // generationPath must be deterministic
  const gp = res?.telemetry?.generationPath || res?.generationPath;
  check(
    `[A] off_topic generationPath=deterministic :: "${q}"`,
    !gp || gp === "deterministic",
    `generationPath=${gp}`,
  );
}

// ─── Group A2: Off-topic-or-ambiguous (relaxed bucket, strict gate) ──────────
process.stdout.write("\n── Group A2: Off-topic-or-ambiguous (no report leakage either way) ──\n");

for (const q of offTopicOrAmbiguousQuestions) {
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: q,
    sessionId: freshSid(),
    selectedContextRef: null,
  });
  const text = answerText(res);
  // Either off_topic OR ambiguous boundary copy — both contain "  "
  check(
    `[A2] some report-redirect copy present :: "${q}"`,
    text.includes("  ") || text.includes(" "),
    text.slice(0, 200),
  );
  // No report data leakage regardless of which bucket
  for (const re of OFF_TOPIC_BANNED_PATTERNS) {
    if (re.test(text)) {
      check(`[A2] no report data (${re}) :: "${q}"`, false, text.slice(0, 200));
    }
  }
  const cb = res?.metadata?.classifierBucket;
  check(
    `[A2] classifierBucket is non-report :: "${q}"`,
    cb === "off_topic" || cb === "ambiguous_or_unclear",
    `classifierBucket=${cb}`,
  );
}

// Semantic intent labels (ask_strengths, …) — category names for telemetry; canonical
// routing still uses Stage-A intents (what_is_going_well, …).

// ─── Regression: exact manual failure case from issue report ─────────────────
{
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: "  ?",
    sessionId: freshSid(),
    selectedContextRef: null,
  });
  const text = answerText(res);

  check("[A-REG]    — no 37 ", !text.includes("37") && !text.includes(""), text.slice(0, 200));
  // Only check that "484" (the specific count) doesn't appear, not the word "" itself
  // (the correct boundary text says "  " which legitimately contains "")
  check("[A-REG]    — no 484 count", !text.includes("484"), text.slice(0, 200));
  check("[A-REG]    — no geometry commentary", !text.includes("") && !text.includes(""), text.slice(0, 200));
  check("[A-REG]    — no topic commentary", !/||/.test(text), text.slice(0, 200));
  check("[A-REG]    — boundary answer present", text.includes("  ") || text.includes(" "), text.slice(0, 200));
}

// ─── Group R: Full-pipeline classifier regression (exact remote failures) ────
process.stdout.write("\n── Group R: Classifier regression (full pipeline) ──\n");

const classifierRegressionCases = [
  { utterance: "  ?", expectedIntent: "what_is_going_well", expectedSemantic: "ask_strengths" },
  { utterance: "   ?", expectedIntent: "what_is_going_well", expectedSemantic: "ask_strengths" },
  { utterance: "  ?", expectedIntent: "what_is_going_well", expectedSemantic: "ask_strengths" },
  { utterance: "    ?", expectedIntent: "what_is_going_well", expectedSemantic: "ask_strengths" },
  { utterance: "  ?", expectedIntent: "what_is_going_well", expectedSemantic: "ask_strengths" },
  { utterance: "   ", expectedIntent: "explain_report", expectedSemantic: "explain_report" },
  { utterance: "  ?", expectedIntent: "explain_report", expectedSemantic: "explain_report" },
  { utterance: "  ?", expectedIntent: "what_is_still_difficult", expectedSemantic: "ask_weaknesses" },
  { utterance: "   ?", expectedIntent: "what_is_still_difficult", expectedSemantic: "ask_weaknesses" },
];

for (const row of classifierRegressionCases) {
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: row.utterance,
    sessionId: freshSid(),
    selectedContextRef: null,
  });
  const text = answerText(res);
  check(
    `[R] resolved :: "${row.utterance}"`,
    res.resolutionStatus === "resolved",
    `resolutionStatus=${res.resolutionStatus} text=${text.slice(0, 120)}`,
  );
  check(
    `[R] classifierBucket=report_related :: "${row.utterance}"`,
    res.metadata?.classifierBucket === "report_related",
    `classifierBucket=${res.metadata?.classifierBucket}`,
  );
  check(
    `[R] not ambiguous boundary :: "${row.utterance}"`,
    !text.includes("  "),
    text.slice(0, 160),
  );
  check(
    `[R] intent ${row.expectedIntent} :: "${row.utterance}"`,
    res.intent === row.expectedIntent,
    `intent=${res.intent}`,
  );
  check(
    `[R] semanticIntent ${row.expectedSemantic} :: "${row.utterance}"`,
    res.metadata?.semanticIntent === row.expectedSemantic,
    `semanticIntent=${res.metadata?.semanticIntent}`,
  );
  check(
    `[R] no AMBIGUOUS_RESPONSE_HE :: "${row.utterance}"`,
    text.trim() !== AMBIGUOUS_RESPONSE_HE.trim(),
    `got clarification stub`,
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group B — Main focus
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group B: Main focus ──\n");
{
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: "    ?",
    sessionId: freshSid(),
  });
  const text = answerText(res);
  check("[B] main focus — has content", text.trim().length > 30, text.slice(0, 80));
  check("[B] main focus — no diagnosis", !/||ADHD|/.test(text), text.slice(0, 200));
  check("[B] main focus — no global thin-data with 484 answers", !/\s+(?!\s+(?:|))|\s+\s+(?!\s+(?:|))/.test(text), text.slice(0, 300));
  check("[B] main focus — no emotional confidence wording", !/[]|[]/.test(text), text.slice(0, 200));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group C — Strengths
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group C: Strengths ──\n");
{
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: "  ?",
    sessionId: freshSid(),
  });
  const text = answerText(res);
  check("[C] strengths — has content", text.trim().length > 20, text.slice(0, 80));
  check("[C] strengths — no emotional confidence", !/[]|[]/.test(text), text.slice(0, 200));
  check("[C] strengths — no diagnosis", !/||ADHD|/.test(text), text.slice(0, 200));
  check("[C] strengths — no global thin-data (484 answers)", !/\s+(?!\s+(?:|))/.test(text), text.slice(0, 300));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group D — Weaknesses
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group D: Weaknesses ──\n");
{
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: "  ?",
    sessionId: freshSid(),
  });
  const text = answerText(res);
  check("[D] weaknesses — has content", text.trim().length > 20, text.slice(0, 80));
  check("[D] weaknesses — calm (no scary language)", !/\s+|\s+\s+|\s+\s+/.test(text), text.slice(0, 200));
  check("[D] weaknesses — no diagnosis", !/||ADHD|/.test(text), text.slice(0, 200));
  check("[D] weaknesses — no emotional confidence", !/[]|[]/.test(text), text.slice(0, 200));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group E — Home practice
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group E: Home practice ──\n");
{
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: "  ?",
    sessionId: freshSid(),
  });
  const text = answerText(res);
  check("[E] home practice — has content", text.trim().length > 20, text.slice(0, 80));
  check("[E] home practice — no diagnosis", !/||ADHD|/.test(text), text.slice(0, 200));
  check("[E] home practice — no emotional confidence", !/[]|[]/.test(text), text.slice(0, 200));
  check("[E] home practice — no global thin-data (484 answers)", !/\s+(?!\s+(?:|))|\s+\s+(?!\s+(?:|))/.test(text), text.slice(0, 300));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group F — High-data: 484 answers — NO global thin-data phrases allowed
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group F: High-data (484 answers) ──\n");

const HIGH_DATA_THIN_PHRASES = [
  /\s+(?!\s+(?:|))/u,
  /\s+\s+(?!\s+(?:||))/u,
  /\s+(?!\s+(?:||\s+(?:|)))/u,
  /\s+\s+(?!\s+(?:|))/u,
  /\s+\s+\s+(?!\s+(?:|))/u,
  /\s+\s+\s+\s+/u,
  /\s+\s+\s+\s+/u,
];

const highDataQuestions = [
  "    ?",
  "  ?",
  "  ?",
  "  ?",
  "   ",
];

for (const q of highDataQuestions) {
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: highDataPayload(),
    utterance: q,
    sessionId: freshSid(),
  });
  const text = answerText(res);

  for (const re of HIGH_DATA_THIN_PHRASES) {
    if (re.test(text)) {
      check(`[F] no global thin-data phrase (${re}) :: "${q}"`, false, `found in: ${text.slice(0, 300)}`);
    }
  }
  // If no banned patterns found, log pass
  const anyBanned = HIGH_DATA_THIN_PHRASES.some((re) => re.test(text));
  check(`[F] high-data no global thin-data :: "${q}"`, !anyBanned, text.slice(0, 300));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group G — Thin-data: 3 answers — cautious wording expected
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group G: Thin-data (3 answers) ──\n");
{
  const questions = ["  ?", "   "];
  for (const q of questions) {
    const res = parentCopilot.runParentCopilotTurn({
      audience: "parent",
      payload: thinDataPayload(),
      utterance: q,
      sessionId: freshSid(),
    });
    const text = answerText(res);
    check(`[G] thin-data has content :: "${q}"`, text.trim().length > 10, text.slice(0, 80));
    check(`[G] thin-data no diagnosis :: "${q}"`, !/||ADHD/.test(text), text.slice(0, 200));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group H — Scoped thin-data: high global (300), low geometry (2)
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group H: Scoped thin-data ──\n");
{
  // Geometry question on scoped-thin payload: caution must be scoped to geometry
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: scopedThinDataPayload(),
    utterance: "  ?",
    sessionId: freshSid(),
  });
  const text = answerText(res);
  check("[H] scoped thin — has content", text.trim().length > 10, text.slice(0, 80));
  check("[H] scoped thin — no diagnosis", !/||ADHD/.test(text), text.slice(0, 200));

  // Global answer on high-data payload should NOT have global thin-data
  const resGlobal = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: scopedThinDataPayload(),
    utterance: "  ?",
    sessionId: freshSid(),
  });
  const textGlobal = answerText(resGlobal);
  check("[H] scoped thin — global question no global thin phrase",
    !HIGH_DATA_THIN_PHRASES.some((re) => re.test(textGlobal)),
    textGlobal.slice(0, 300));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group I — Diagnostic: refuse cleanly, no diagnosis
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group I: Diagnostic request ──\n");
{
  const diagnosticQuestions = [
    "   ?",
    "  ADHD?",
    "  ?",
  ];
  for (const q of diagnosticQuestions) {
    const res = parentCopilot.runParentCopilotTurn({
      audience: "parent",
      payload: highDataPayload(),
      utterance: q,
      sessionId: freshSid(),
    });
    const text = answerText(res);
    // Must refuse diagnosis
    check(`[I] diagnostic — has content :: "${q}"`, text.trim().length > 10, text.slice(0, 80));
    // Must NOT assert the child has a condition
    check(
      `[I] diagnostic — no diagnosis claim :: "${q}"`,
      !/(\s+\s+(?:||ADHD)|\s+\s+(?:||ADHD)|\s+|\s+)/iu.test(text),
      text.slice(0, 200),
    );
    // Must mention practice-data limitation or professional evaluation
    check(
      `[I] diagnostic — mentions limitation or professional eval :: "${q}"`,
      /(\s*|(?:|)\s+|\s+\s+|\s+\s+)/u.test(text),
      text.slice(0, 300),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Group J — Unit checks: router, Stage A, validator, volume helpers
// ═══════════════════════════════════════════════════════════════════════════════

process.stdout.write("\n── Group J: Unit checks ──\n");

// J1 — Router: off_topic intents
for (const q of [
  "  ?",
  "  ?",      // no  — key regression
  " ?",
  " ",
  "  ?",
  " ?",
  "  ?",
]) {
  const r = routeParentQuestion(q);
  check(`[J1] router off_topic :: "${q}"`, r.routerIntent === "off_topic", r.routerIntent);
  check(`[J1] router off_topic exitEarly :: "${q}"`, r.exitEarly === true, String(r.exitEarly));
  check(`[J1] router off_topic deterministicResponse :: "${q}"`, typeof r.deterministicResponse === "string" && r.deterministicResponse.length > 0, r.deterministicResponse || "null");
  check(`[J1] router off_topic exact text :: "${q}"`, r.deterministicResponse === OFF_TOPIC_RESPONSE_HE, r.deterministicResponse || "null");
  check(`[J1] router off_topic requiresLlm=false :: "${q}"`, r.requiresLlm === false, String(r.requiresLlm));
}

// J2 — Router: diagnostic intents
for (const q of ["  ADHD?", "   ?"]) {
  const r = routeParentQuestion(q);
  check(`[J2] router unsafe_or_diagnostic :: "${q}"`, r.routerIntent === "unsafe_or_diagnostic_request", r.routerIntent);
  check(`[J2] router diagnostic exitEarly :: "${q}"`, r.exitEarly === true, String(r.exitEarly));
}

// J3 — Router: report intents (do NOT exit early). Pass the payload so the
// classifier has the subject/topic vocabulary it needs (otherwise "  ?"
// reads as a topic-match-less shorthand and lands in ambiguous_or_unclear).
for (const q of ["   ?", "  ?", "  ?", "  ?"]) {
  const r = routeParentQuestion(q, highDataPayload());
  check(`[J3] router no early exit for report question :: "${q}"`, r.exitEarly === false, `${r.routerIntent}/${r.exitEarly}`);
}

// J4 — Stage A: off_topic intents (legacy layer still classifies correctly)
for (const q of ["  ?", "  ?", " ?", " "]) {
  const st = interpretFreeformStageA(q, {});
  check(`[J4] stageA off_topic :: "${q}"`, st.canonicalIntent === "off_topic_redirect", st.canonicalIntent);
}

// J5 — Validator: high volume rejects global scarcity language in composed glue
function minimalTruthPacket(overrides = {}) {
  const base = {
    surfaceFacts: {
      questions: 30,
      reportQuestionTotalGlobal: 30,
      accuracy: 80,
      displayName: "  ",
      subjectLabelHe: "",
      weakFocusSubjectLabelHe: "",
      weakFocusTopicDisplayNameHe: "",
      relevantSummaryLines: [],
    },
    derivedLimits: {
      cannotConcludeYet: false,
      recommendationEligible: true,
      recommendationIntensityCap: "RI2",
      readiness: "ready",
      confidenceBand: "high",
    },
    contracts: {
      narrative: {
        textSlots: { observation: "x".repeat(20), interpretation: "y".repeat(20), uncertainty: "" },
      },
    },
    interpretationScope: "executive",
    allowedClaimEnvelope: { requiredHedges: [], forbiddenPhrases: [], wordingEnvelope: "WE1", allowedSections: ["summary"] },
  };
  return { ...base, ...overrides, surfaceFacts: { ...base.surfaceFacts, ...overrides.surfaceFacts } };
}

const highVol = minimalTruthPacket({ surfaceFacts: { questions: 400, reportQuestionTotalGlobal: 484, accuracy: 82 } });

// Original banned phrase (existing test)
const badDraft1 = {
  answerBlocks: [
    { type: "observation", textHe: "    ,       .  .", source: "composed" },
    { type: "meaning", textHe: "          .", source: "composed" },
  ],
};
const v1 = validateAnswerDraft(badDraft1, highVol, { intent: "explain_report" });
check("[J5] validator: high volume rejects old global scarcity phrase", !v1.ok && v1.failCodes.includes("truth_contradiction_global_thin_language_high_volume"), v1.failCodes?.join(","));

// New banned phrase:   (unscoped)
const badDraft2 = {
  answerBlocks: [
    { type: "observation", textHe: "      .", source: "composed" },
    { type: "meaning", textHe: "     .", source: "composed" },
  ],
};
const v2 = validateAnswerDraft(badDraft2, highVol, { intent: "explain_report" });
check("[J5] validator: high volume rejects   (unscoped)", !v2.ok && v2.failCodes.includes("truth_contradiction_global_thin_language_high_volume"), v2.failCodes?.join(","));

// New banned phrase:    (unscoped)
const badDraft3 = {
  answerBlocks: [
    { type: "observation", textHe: "      .", source: "composed" },
    { type: "meaning", textHe: "   —     .", source: "composed" },
  ],
};
const v3 = validateAnswerDraft(badDraft3, highVol, { intent: "explain_report" });
check("[J5] validator: high volume rejects    (unscoped)", !v3.ok && v3.failCodes.includes("truth_contradiction_global_thin_language_high_volume"), v3.failCodes?.join(","));

// J6 — Validator: emotional confidence blocked (unscoped  — not statistical )
const emoDraft = {
  answerBlocks: [
    { type: "observation", textHe: "     .", source: "composed" },
    { type: "meaning", textHe: "           .", source: "composed" },
  ],
};
const vEmo = validateAnswerDraft(emoDraft, minimalTruthPacket(), { intent: "explain_report" });
check("[J6] emotional confidence rejected", !vEmo.ok && vEmo.failCodes.includes("emotional_confidence_language"), vEmo.failCodes?.join(","));

// J7 — Validator: off_topic contamination (report data in off_topic answer)
const offTopicContaminated = {
  answerBlocks: [
    { type: "observation", textHe: "   .   484    74%.", source: "composed" },
    { type: "meaning", textHe: "      .", source: "composed" },
  ],
};
const vContam = validateAnswerDraft(offTopicContaminated, minimalTruthPacket(), { intent: "off_topic_redirect" });
check("[J7] off_topic contamination rejected", !vContam.ok && vContam.failCodes.includes("off_topic_report_data_contamination"), vContam.failCodes?.join(","));

// J8 — Volume helpers
check(
  "[J8] maxGlobalReportQuestionCount",
  maxGlobalReportQuestionCount({ summary: { totalAnswers: 300 }, overallSnapshot: { totalQuestions: 280 } }) === 300,
  String(maxGlobalReportQuestionCount({ summary: { totalAnswers: 300 }, overallSnapshot: { totalQuestions: 280 } })),
);
check("[J8] STRONG_GLOBAL_QUESTION_FLOOR sane", STRONG_GLOBAL_QUESTION_FLOOR === 120, String(STRONG_GLOBAL_QUESTION_FLOOR));

const zeroEvidenceTruth = {
  ...minimalTruthPacket(),
  subjectQuestionCounts: {
    math: 40,
    geometry: 0,
    english: 0,
    science: 0,
    hebrew: 0,
    history: 0,
    "moledet-geography": 0,
  },
};
const badZeroEvidenceDraft = {
  answerBlocks: [
    { type: "observation", textHe: "       .", source: "composed" },
    { type: "meaning", textHe: "      .", source: "composed" },
  ],
};
const vZero = validateAnswerDraft(badZeroEvidenceDraft, zeroEvidenceTruth, { intent: "explain_report" });
check(
  "[J9] zero-evidence subject mention rejected",
  !vZero.ok &&
    (vZero.failCodes.includes("zero_evidence_subject_mention") ||
      vZero.failCodes.includes("zero_evidence_forbidden_phrasing")),
  vZero.failCodes?.join(","),
);

// ─── Summary ──────────────────────────────────────────────────────────────────

process.stdout.write(`\nparent-copilot-qa selftest :: ${runs - failures}/${runs} passed\n`);
if (failures > 0) {
  process.stderr.write(`\n${failures} test(s) FAILED\n`);
  process.exit(1);
}
