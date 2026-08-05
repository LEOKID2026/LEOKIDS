/**
 * Parent Copilot report-row-first routing regression (English fixtures).
 * Run: npx tsx scripts/parent-copilot-hebrew-understanding-selftest.mjs
 */

import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

async function load(rel) {
  const m = await import(pathToFileURL(join(ROOT, "..", rel)).href);
  return m.default && typeof m.default === "object" ? m.default : m;
}

const { classifyParentQuestionDeterministic, AMBIGUOUS_RESPONSE_HE } = await load(
  "utils/parent-copilot/question-classifier.js"
);
const { routeParentQuestion } = await load("utils/parent-copilot/question-router.js");
const { resolveScope } = await load("utils/parent-copilot/scope-resolver.js");
const { runParentCopilotTurn } = await load("utils/parent-copilot/index.js");
const { buildTopicClarificationQuestionHe } = await load("utils/parent-copilot/report-row-resolver.js");

function makeContract(topicRowKey, subjectId, displayName, qCount = 12, acc = 72) {
  return {
    topicRowKey,
    displayName,
    questions: qCount,
    accuracy: acc,
    contractsV1: {
      narrative: {
        textSlots: {
          observation: `${displayName}: ${qCount} questions answered with about ${acc}%.`,
          interpretation: `${displayName} still needs focused practice.`,
          action: `Practice ${displayName} in short sessions.`,
          uncertainty: "",
        },
      },
      decision: { cannotConcludeYet: false },
      readiness: { readiness: "emerging" },
      confidence: { confidenceBand: "medium" },
      recommendation: { eligible: true, intensity: "RI2" },
    },
  };
}

function richPayload() {
  return {
    registeredGradeKey: "g4",
    gradePracticeMeta: {
      registeredGradeKey: "g4",
      mixedGradePractice: true,
      mixedGradePracticeNoteHe:
        "Some practice came from topics above the registered grade; the report separates same-grade and out-of-grade rows.",
    },
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          makeContract("fractions::grade:g4", "math", "Fractions", 20, 55),
          makeContract("fractions::grade:g5", "math", "Fractions", 18, 40),
          makeContract("multiplication", "math", "Multiplication", 15, 70),
          makeContract("division", "math", "Division", 12, 68),
        ],
      },
      {
        subject: "english",
        topicRecommendations: [makeContract("grammar", "english", "Grammar", 10, 80)],
      },
      {
        subject: "hebrew",
        topicRecommendations: [
          makeContract("reading", "hebrew", "Reading comprehension", 14, 65),
        ],
      },
      {
        subject: "science",
        topicRecommendations: [makeContract("life", "science", "Life science", 8, 75)],
      },
      {
        subject: "geometry",
        topicRecommendations: [makeContract("shapes", "geometry", "Shapes", 9, 78)],
      },
      {
        subject: "moledet-geography",
        topicRecommendations: [makeContract("israel", "moledet-geography", "Geography", 6, 82)],
      },
    ],
  };
}

const payload = richPayload();
let sid = 0;
const freshSid = () => `heb-${++sid}`;

function answerText(res) {
  if (res?.resolutionStatus === "resolved") {
    return (res.answerBlocks || []).map((b) => String(b.textHe || "")).join(" ");
  }
  return String(res.clarificationQuestionHe || "");
}

const mustBeReportRelated = [
  "Explain fractions to me — what is the problem?",
  "Math fractions",
  "What is the problem?",
  "What should we do at home?",
  "How is he doing in math?",
  "How is he doing in reading comprehension?",
  "What matters most to practice this week?",
  "Why are there two grades on the same topic?",
  "What is the problem with multiplication?",
  "How is he doing in division?",
  "What about grammar?",
  "How is he doing in geometry?",
  "What should we do in science?",
  "How is he doing in Hebrew?",
  "How is he doing in English?",
  "How is he doing in geography?",
];

for (const q of mustBeReportRelated) {
  const det = classifyParentQuestionDeterministic({ utterance: q, payload });
  assert.equal(det.bucket, "report_related", `classifier report_related :: ${q} got ${det.bucket}`);
}

const vagueTopic = "I want to know about a specific topic";
const routeVague = routeParentQuestion(vagueTopic, payload);
assert.equal(routeVague.exitEarly, true);
assert.ok(
  String(routeVague.deterministicResponse || "").includes("which topic"),
  "vague topic uses short clarification"
);
assert.ok(
  !String(routeVague.deterministicResponse || "").includes(AMBIGUOUS_RESPONSE_HE.slice(0, 24)),
  "vague topic must not use long generic ambiguous copy"
);

const scopeFrac = resolveScope({ payload, utterance: "Explain fractions to me — what is the problem?" });
assert.equal(scopeFrac.resolutionStatus, "resolved");
assert.equal(scopeFrac.scope?.scopeType, "topic");
assert.match(String(scopeFrac.scope?.scopeLabel || ""), /fractions/i);

const scopeMath = resolveScope({ payload, utterance: "How is he doing in math?" });
assert.equal(scopeMath.resolutionStatus, "resolved");
assert.equal(scopeMath.scope?.scopeType, "subject");
assert.equal(scopeMath.scope?.scopeId, "math");

const turn = runParentCopilotTurn({
  audience: "parent",
  payload,
  utterance: "Explain fractions to me — what is the problem?",
  sessionId: freshSid(),
});
assert.equal(turn.resolutionStatus, "resolved", "topic question must resolve with report data");
const turnText = answerText(turn);
assert.ok(turnText.includes("Fractions") || /\d/.test(turnText), "answer references topic or metrics");
assert.ok(
  !turnText.includes(AMBIGUOUS_RESPONSE_HE.slice(0, 20)),
  "must not leak generic ambiguous help after real question"
);

const clarify = buildTopicClarificationQuestionHe(payload);
assert.ok(clarify.includes("Fractions") || clarify.includes("Math"));

process.stdout.write("OK parent-copilot-hebrew-understanding-selftest\n");
