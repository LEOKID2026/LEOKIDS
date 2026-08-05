/**
 * Product verification: same Copilot engine + payload shape as the parent report UI.
 * Mirrors ParentCopilotPanel → runParentCopilotTurnAsync / runParentCopilotTurn(input).
 *
 * Run: npx tsx scripts/parent-copilot-ui-product-verify.mjs
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

async function load(rel) {
  const m = await import(pathToFileURL(join(ROOT, "..", rel)).href);
  return m.default && typeof m.default === "object" ? m.default : m;
}

const parentCopilot = await load("utils/parent-copilot/index.js");
const { routeParentQuestion, AMBIGUOUS_RESPONSE_HE } = await load("utils/parent-copilot/question-router.js");
const { resolveScope } = await load("utils/parent-copilot/scope-resolver.js");
const { buildTopicClarificationQuestionHe } = await load("utils/parent-copilot/report-row-resolver.js");

/** Same deterministic core as the panel; sync path avoids optional LLM upgrade latency in CI. */
const runTurn = parentCopilot.runParentCopilotTurn;

const AMBIGUOUS_LEAK = AMBIGUOUS_RESPONSE_HE.slice(0, 24);

function makeContract(topicRowKey, subjectId, displayName, qCount = 12, acc = 72, extra = {}) {
  const hasSubskill = extra.hasSubskillMetadata === true;
  const gradeSuffix =
    topicRowKey.includes("g4") ? " ( )" : topicRowKey.includes("g5") ? " (   —   )" : "";
  return {
    topicRowKey,
    displayName,
    questions: qCount,
    accuracy: acc,
    contentGradeKey: extra.contentGradeKey || null,
    gradeRelation: extra.gradeRelation || null,
    hasSubskillMetadata: hasSubskill,
    thinEvidenceDowngraded: false,
    contractsV1: {
      narrative: {
        textSlots: {
          observation: `${displayName}${gradeSuffix}  ${qCount}     ${acc}%.`,
          interpretation: hasSubskill
            ? ` ${displayName}${gradeSuffix}  :    .`
            : `${displayName}${gradeSuffix} —     ,    .`,
          action: `  ${displayName}${gradeSuffix}.`,
          uncertainty: hasSubskill
            ? ""
            : "     ,         .",
        },
      },
      evidence: { questionCount: qCount, accuracyPct: acc, subskillBreakdownAvailable: hasSubskill },
      decision: { cannotConcludeYet: false },
      readiness: { readiness: "emerging" },
      confidence: { confidenceBand: "medium" },
      recommendation: { eligible: true, intensity: "RI2" },
    },
  };
}

/** Grade-split payload from shared output-integrity fixture (no PDF topic names). */
async function screenshotGradeSplitPayload() {
  const { buildDetailedParentReportFromBaseReport } = await load("utils/detailed-parent-report.js");
  const { buildGradeSplitBaseReport } = await import(
    pathToFileURL(join(ROOT, "fixtures/parent-report-output-integrity-fixtures.mjs")).href
  );
  const { detailedReportToCopilotPayload } = await load(
    "utils/parent-report-output-integrity/trace-row-pipeline.js",
  );
  const detailed = buildDetailedParentReportFromBaseReport(buildGradeSplitBaseReport(), { period: "week" });
  return detailedReportToCopilotPayload(detailed);
}

/** Loaded-report shape passed to ParentCopilotShell `payload` prop. */
function uiLoadedReportPayload() {
  return {
    registeredGradeKey: "g4",
    gradePracticeMeta: {
      registeredGradeKey: "g4",
      mixedGradePractice: true,
      mixedGradePracticeNoteHe:
        "      ,    .",
    },
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          makeContract("fractions::grade:g4", "math", "Fractions", 20, 55),
          makeContract("fractions::grade:g5", "math", "Fractions", 18, 40),
          makeContract("multiplication", "math", "Multiplication", 15, 70),
        ],
      },
      {
        subject: "english",
        topicRecommendations: [makeContract("grammar", "english", "", 10, 80)],
      },
      {
        subject: "hebrew",
        topicRecommendations: [makeContract("reading", "hebrew", " ", 14, 65)],
      },
      {
        subject: "science",
        topicRecommendations: [makeContract("life", "science", " ", 8, 75)],
      },
      {
        subject: "geometry",
        topicRecommendations: [makeContract("shapes", "geometry", "", 9, 78)],
      },
    ],
  };
}

let sid = 0;
const freshSid = () => `ui-verify-${++sid}`;

function answerText(res) {
  if (res?.resolutionStatus === "resolved") {
    return (res.answerBlocks || []).map((b) => String(b.textHe || "")).join("\n");
  }
  return String(res.clarificationQuestionHe || "");
}

function scopeFromTurn(res) {
  return {
    scopeType: res?.scopeType ?? res?.telemetry?.trace?.scopeType ?? null,
    scopeId: res?.scopeId ?? res?.telemetry?.trace?.scopeId ?? null,
    scopeReason: res?.telemetry?.scope?.reason || res?.metadata?.scopeReason,
    classifierBucket: res?.metadata?.classifierBucket,
  };
}

function uiTurn(utterance, payload) {
  const input = {
    audience: "parent",
    payload,
    utterance,
    sessionId: freshSid(),
    selectedContextRef: null,
    clickedFollowupFamily: null,
  };
  return runTurn(input);
}

function assertNoAmbiguousLeak(text, label) {
  assert.ok(
    !String(text).includes(AMBIGUOUS_LEAK),
    `${label}: must not leak generic ambiguous help copy`,
  );
}

// ─── Static UI wiring audit (no design changes) ─────────────────────────────

const panelSrc = readFileSync(join(ROOT, "../components/parent-copilot/parent-copilot-panel.jsx"), "utf8");
assert.ok(
  panelSrc.includes("runParentCopilotTurnAsync") || panelSrc.includes("runParentCopilotTurn"),
  "panel uses parent-copilot index turn runner",
);
assert.ok(!panelSrc.includes("localStorage") && !panelSrc.includes("sessionStorage"), "panel must not cache copilot answers in storage");

const shortReportSrc = readFileSync(join(ROOT, "../pages/learning/parent-report.js"), "utf8");
assert.ok(shortReportSrc.includes("copilotDetailedPayload"), "short report builds detailed payload for copilot");
assert.ok(shortReportSrc.includes("/api/parent/copilot-turn"), "short report API path for copilot when enabled");

const apiSrc = readFileSync(join(ROOT, "../pages/api/parent/copilot-turn.js"), "utf8");
assert.ok(apiSrc.includes("runParentCopilotTurnAsync"), "API uses async copilot engine");
assert.ok(apiSrc.includes("resolveCopilotTurnPayloadForApi"), "API resolves server payload (not stale client-only path)");

const resolverSrc = readFileSync(join(ROOT, "../utils/parent-copilot/report-row-resolver.js"), "utf8");
assert.ok(resolverSrc.includes("resolveReportRowFromUtterance"), "report-row resolver present in codebase");

process.stdout.write("UI wiring audit: panel→index.js, no answer cache, API→runParentCopilotTurnAsync\n");

// ─── Turn matrix (same as ParentCopilotPanel.submit) ─────────────────────────

function listTopicLabels(p) {
  const out = [];
  for (const sp of p.subjectProfiles || []) {
    for (const tr of sp.topicRecommendations || []) {
      if (tr?.displayName) out.push(String(tr.displayName));
    }
  }
  return out;
}

const payload = uiLoadedReportPayload();
const rows = listTopicLabels(payload);

const cases = [
  {
    id: 1,
    q: "Explain fractions to me — what is the problem?",
    run() {
      const scope = resolveScope({ payload, utterance: this.q });
      assert.equal(scope.scope?.scopeType, "topic");
      assert.match(String(scope.scope?.scopeLabel || ""), /fractions/i);
      const res = uiTurn(this.q, payload);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
      const t = answerText(res);
      assert.ok(t.includes("Fractions") || /\d/.test(t), "grounded topic/metrics");
      assert.ok(scopeFromTurn(res).scopeReason?.includes("report_row") || scope.scopeReason?.includes("report_row"));
    },
  },
  {
    id: 2,
    q: "Math fractions",
    run() {
      const res = uiTurn(this.q, payload);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
      const scope = resolveScope({ payload, utterance: this.q });
      assert.equal(scope.scope?.scopeType, "topic");
      assert.match(String(scope.scope?.scopeLabel || ""), /fractions/i);
    },
  },
  {
    id: 3,
    q: "How is he doing in math?",
    run() {
      const scope = resolveScope({ payload, utterance: this.q });
      assert.equal(scope.scope?.scopeType, "subject");
      assert.equal(scope.scope?.scopeId, "math");
      const res = uiTurn(this.q, payload);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
      const st = scopeFromTurn(res);
      if (st.scopeType != null) {
        assert.equal(st.scopeType, "subject", "must not scope to first math topic");
        assert.equal(st.scopeId, "math");
      }
      assert.ok(
        scope.scopeReason?.includes("report_row_subject") ||
          scope.scopeReason?.includes("utterance_subject") ||
          scope.scopeReason?.includes("aggregate_class"),
        "subject routing via report-row or aggregate path",
      );
    },
  },
  {
    id: 4,
    q: "What is the problem?",
    run() {
      const res = uiTurn(this.q, payload);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
      assert.ok(answerText(res).length >= 20, "general weakness answer");
    },
  },
  {
    id: 5,
    q: "What matters most to practice this week?",
    run() {
      const res = uiTurn(this.q, payload);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
    },
  },
  {
    id: 6,
    q: "What should we do at home?",
    run() {
      const res = uiTurn(this.q, payload);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
    },
  },
  {
    id: 7,
    q: "I want to know about a specific topic",
    run() {
      const route = routeParentQuestion(this.q, payload);
      assert.equal(route.exitEarly, true);
      const text = String(route.deterministicResponse || "");
      assert.ok(text.includes("which topic"), "short clarification");
      assertNoAmbiguousLeak(text, this.q);
      assert.ok(
        rows.some((r) => text.includes(r)) || text.includes("Fractions") || text.includes("Math"),
        "examples from loaded rows when possible",
      );
    },
  },
  {
    id: 8,
    q: "Why are there two grades on the same topic?",
    run() {
      const res = uiTurn(this.q, payload);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
      const t = answerText(res);
      assert.ok(
        /grade|g4|g5|mixed|split|two/i.test(t) || t.includes("Fractions"),
        "mixed-grade awareness in answer",
      );
    },
  },
  {
    id: 9,
    q: "Why does the same topic show two grade rows?",
    run() {
      const res = uiTurn(this.q, payload);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
      const t = answerText(res);
      assert.ok(
        /grade|g4|g5|split|mixed|registered|practice/i.test(t),
        `split-grade explanation :: ${t.slice(0, 120)}`,
      );
    },
  },
  {
    id: 10,
    q: "???",
    run() {
      const route = routeParentQuestion(this.q, payload);
      assert.equal(route.classifierBucket, "ambiguous_or_unclear");
      assert.equal(route.exitEarly, true);
      assert.equal(route.deterministicResponse, AMBIGUOUS_RESPONSE_HE);
    },
  },
  {
    id: 11,
    q: "...",
    run() {
      const route = routeParentQuestion(this.q, payload);
      assert.equal(route.classifierBucket, "ambiguous_or_unclear");
      assert.equal(route.exitEarly, true);
    },
  },
  {
    id: 12,
    q: "?",
    run() {
      const route = routeParentQuestion(this.q, payload);
      assert.equal(route.classifierBucket, "ambiguous_or_unclear");
      assert.equal(route.exitEarly, true);
    },
  },
  {
    id: 13,
    q: "What is the problem with fractions?",
    async run() {
      const shot = await screenshotGradeSplitPayload();
      const res = uiTurn(this.q, shot);
      assert.equal(res.resolutionStatus, "resolved");
      assertNoAmbiguousLeak(answerText(res), this.q);
      const t = answerText(res);
      assert.ok(
        /fractions|367|66|38|87|grade/i.test(t),
        `grounded fractions/grade answer :: ${t.slice(0, 160)}`,
      );
      assert.ok(!/too early|not enough data|limited data/u.test(t), "no thin-data phrasing on high-volume rows");
      assert.ok(
        (t.includes("367") && t.includes("87")) || (t.includes("66") && t.includes("38")) || /grade|split|g4|g5/i.test(t),
        "must reference grade-split or both volume bands — not a single averaged score",
      );
      assert.ok(
        !t.includes("367") || !t.includes("38") || (t.includes("87") && t.includes("66")),
        "must not treat high-accuracy g4 row as the problem because of g5 failure",
      );
    },
  },
];

for (const c of cases) {
  await Promise.resolve(c.run());
  process.stdout.write(`  ok  UI case ${c.id}: ${c.q}\n`);
}

const clarify = buildTopicClarificationQuestionHe(payload);
assert.ok(clarify.includes("Fractions") || clarify.includes("Math"), "clarification examples include report row");

process.stdout.write("\nparent-copilot-ui-product-verify: ALL PASS\n");
