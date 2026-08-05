/**
 * Parent Copilot Hebrew understanding — report-row-first routing regression.
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
          observation: `${displayName}  ${qCount}     ${acc}%.`,
          interpretation: `${displayName}   .`,
          action: `  ${displayName}.`,
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
        "      ,    .",
    },
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          makeContract("fractions::grade:g4", "math", "", 20, 55),
          makeContract("fractions::grade:g5", "math", "", 18, 40),
          makeContract("multiplication", "math", "", 15, 70),
          makeContract("division", "math", "", 12, 68),
        ],
      },
      {
        subject: "english",
        topicRecommendations: [makeContract("grammar", "english", "", 10, 80)],
      },
      {
        subject: "hebrew",
        topicRecommendations: [
          makeContract("reading", "hebrew", " ", 14, 65),
        ],
      },
      {
        subject: "science",
        topicRecommendations: [makeContract("life", "science", " ", 8, 75)],
      },
      {
        subject: "geometry",
        topicRecommendations: [makeContract("shapes", "geometry", "", 9, 78)],
      },
      {
        subject: "moledet-geography",
        topicRecommendations: [makeContract("israel", "moledet-geography", "", 6, 82)],
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
  "     ",
  " ",
  " ?",
  "  ?",
  "  ?",
  "   ?",
  "    ?",
  "     ?",
  "  ?",
  "  ?",
  "  ?",
  "  ?",
  "  ?",
  "  ?",
  "  ?",
  "  ?",
];

for (const q of mustBeReportRelated) {
  const det = classifyParentQuestionDeterministic({ utterance: q, payload });
  assert.equal(det.bucket, "report_related", `classifier report_related :: ${q} got ${det.bucket}`);
}

const vagueTopic = "     ";
const routeVague = routeParentQuestion(vagueTopic, payload);
assert.equal(routeVague.exitEarly, true);
assert.ok(
  String(routeVague.deterministicResponse || "").includes("  "),
  "vague topic uses short clarification"
);
assert.ok(
  !String(routeVague.deterministicResponse || "").includes(AMBIGUOUS_RESPONSE_HE.slice(0, 24)),
  "vague topic must not use long generic ambiguous copy"
);

const scopeFrac = resolveScope({ payload, utterance: "     " });
assert.equal(scopeFrac.resolutionStatus, "resolved");
assert.equal(scopeFrac.scope?.scopeType, "topic");
assert.match(String(scopeFrac.scope?.scopeLabel || ""), //);

const scopeMath = resolveScope({ payload, utterance: "  ?" });
assert.equal(scopeMath.resolutionStatus, "resolved");
assert.equal(scopeMath.scope?.scopeType, "subject");
assert.equal(scopeMath.scope?.scopeId, "math");

const turn = runParentCopilotTurn({
  audience: "parent",
  payload,
  utterance: "     ",
  sessionId: freshSid(),
});
assert.equal(turn.resolutionStatus, "resolved", "topic question must resolve with report data");
const turnText = answerText(turn);
assert.ok(turnText.includes("") || /\d/.test(turnText), "answer references topic or metrics");
assert.ok(
  !turnText.includes(AMBIGUOUS_RESPONSE_HE.slice(0, 20)),
  "must not leak generic ambiguous help after real question"
);

const clarify = buildTopicClarificationQuestionHe(payload);
assert.ok(clarify.includes("") || clarify.includes(""));

process.stdout.write("OK parent-copilot-hebrew-understanding-selftest\n");
