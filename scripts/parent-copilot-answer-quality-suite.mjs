/**
 * Copilot answer quality — diagnostic meaning, not metric-only or generic thin fallback.
 * Run: npm run test:parent-copilot-answer-quality
 */

import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

async function load(rel) {
  const m = await import(pathToFileURL(join(ROOT, "..", rel)).href);
  return m.default && typeof m.default === "object" ? m.default : m;
}

const parentCopilot = await load("utils/parent-copilot/index.js");
const { AMBIGUOUS_RESPONSE_HE } = await load("utils/parent-copilot/question-router.js");
const runTurn = parentCopilot.runParentCopilotTurn;

function contract(topicRowKey, subjectId, displayName, qCount, acc) {
  return {
    topicRowKey,
    displayName,
    questions: qCount,
    accuracy: acc,
    contractsV1: {
      narrative: {
        textSlots: {
          observation: `${displayName}  ${qCount}     ${acc}%.`,
          interpretation: `${displayName}      —      .`,
          action: `   ${displayName} .`,
          uncertainty: "",
        },
      },
      decision: { cannotConcludeYet: false },
      readiness: { readiness: qCount >= 40 ? "ready" : "forming" },
      confidence: { confidenceBand: qCount >= 40 ? "high" : "medium" },
      recommendation: { eligible: true, intensity: "RI2" },
    },
  };
}

function payload(rows) {
  return {
    registeredGradeKey: "g4",
    gradePracticeMeta: {
      registeredGradeKey: "g4",
      mixedGradePractice: rows.some((r) => r.topicRowKey.includes("g5")),
      mixedGradePracticeNoteHe: "    .",
    },
    subjectProfiles: rows.map((r) => ({
      subject: r.subjectId,
      topicRecommendations: [contract(r.topicRowKey, r.subjectId, r.displayName, r.q, r.acc)],
    })),
  };
}

function answerText(res) {
  if (res?.resolutionStatus === "resolved") {
    return (res.answerBlocks || []).map((b) => String(b.textHe || "")).join("\n");
  }
  return String(res.clarificationQuestionHe || "");
}

const p = payload([
  { subjectId: "math", topicRowKey: "fractions::grade:g4", displayName: "", q: 367, acc: 87 },
  { subjectId: "math", topicRowKey: "fractions::grade:g5", displayName: "", q: 66, acc: 38 },
  { subjectId: "hebrew", topicRowKey: "reading", displayName: " ", q: 90, acc: 62 },
]);

// I: Topic question — grounded, not shallow
{
  const res = runTurn({
    audience: "parent",
    payload: p,
    utterance: "     ",
    sessionId: "aq-1",
  });
  assert.equal(res.resolutionStatus, "resolved");
  const t = answerText(res);
  assert.ok(!t.includes(AMBIGUOUS_RESPONSE_HE.slice(0, 20)));
  assert.ok(t.includes("") || /\d/.test(t));
  assert.ok(
    t.includes("") || t.includes("") || t.includes("") || t.includes(""),
    "diagnostic meaning beyond raw count",
  );
}

// J: General
{
  const res = runTurn({
    audience: "parent",
    payload: p,
    utterance: " ?",
    sessionId: "aq-2",
  });
  assert.equal(res.resolutionStatus, "resolved");
  assert.ok(!answerText(res).includes(AMBIGUOUS_RESPONSE_HE.slice(0, 20)));
}

// Mixed grade
{
  const res = runTurn({
    audience: "parent",
    payload: p,
    utterance: "     ?",
    sessionId: "aq-3",
  });
  assert.equal(res.resolutionStatus, "resolved");
  assert.ok(/|||/i.test(answerText(res)));
}

process.stdout.write("OK parent-copilot-answer-quality-suite\n");
