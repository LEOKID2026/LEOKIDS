/**
 * Intent-specific answer contract regression suite.
 * Run: npm run test:parent-copilot-intent-answer-contracts
 * Debug evidence: COPILOT_EVIDENCE_DEBUG=1 npm run test:parent-copilot-intent-answer-contracts
 */
import assert from "node:assert/strict";
import parentCopilot from "../utils/parent-copilot/index.js";
import sessionMemory from "../utils/parent-copilot/session-memory.js";
import intentComposers from "../utils/parent-copilot/intent-answer-composers.js";
import evidencePolarity from "../utils/parent-copilot/evidence-polarity.js";

const { FORBIDDEN_POSITIVE_WHEN_WEAK_RE } = evidencePolarity;
const { fingerprintAnswerHe } = intentComposers;
const runParentCopilotTurn = parentCopilot.runParentCopilotTurn;
const resetSession = sessionMemory.resetParentCopilotSessionForTests;

const DEBUG = process.env.COPILOT_EVIDENCE_DEBUG === "1";

function answerText(res) {
  if (res?.resolutionStatus === "resolved") {
    return (res.answerBlocks || []).map((b) => String(b.textHe || "")).join(" ");
  }
  return String(res.clarificationQuestionHe || "");
}

function makeTopicRow(topicRowKey, subjectId, displayName, q, acc, extra = {}) {
  const slots = {
    observation: `${displayName}    ${q} ,    ${acc}%.`,
    interpretation: acc <= 54 ? " " : "",
    action: ".",
    uncertainty: "",
  };
  return {
    topicRowKey,
    displayName,
    questions: q,
    accuracy: acc,
    rowIdentityV1: extra.rowIdentityV1 || null,
    contractsV1: {
      evidence: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        questionCount: q,
        accuracyPct: acc,
      },
      decision: { cannotConcludeYet: false, decisionTier: 2 },
      readiness: { readiness: "emerging" },
      confidence: { confidenceBand: "medium" },
      recommendation: { eligible: true, intensity: "RI2", forbiddenBecause: [] },
      narrative: {
        textSlots: slots,
        wordingEnvelope: "WE2",
        allowedSections: ["summary", "finding"],
      },
    },
  };
}

function buildPayload(opts = {}) {
  const mathTopics = opts.mathTopics || [
    makeTopicRow("fractions::grade:g5", "math", "", 76, 41, {
      rowIdentityV1: { contentGradeKey: "g5", gradeRelation: "same" },
    }),
    makeTopicRow("multiplication", "math", "", 24, 88),
  ];
  return {
    version: 2,
    registeredGradeKey: "g5",
    subjectProfiles: [
      {
        subject: "math",
        subjectQuestionCount: mathTopics.reduce((n, tr) => n + tr.questions, 0),
        topicRecommendations: mathTopics,
      },
      {
        subject: "english",
        subjectQuestionCount: 0,
        topicRecommendations: [makeTopicRow("grammar", "english", "", 0, 0)],
      },
    ],
    diagnosticEngineV2: {
      units: Array.isArray(opts.diagnosticUnits) ? opts.diagnosticUnits : [],
    },
    executiveSummary: { majorTrendsHe: [" "] },
  };
}

let sid = 0;
const freshSid = () => `iac-${++sid}`;

// A — report explanation
{
  const r = runParentCopilotTurn({
    audience: "parent",
    payload: buildPayload(),
    utterance: "   ",
    sessionId: freshSid(),
  });
  assert.equal(r.resolutionStatus, "resolved");
  const text = answerText(r);
  assert.ok(/|||/i.test(text), "report-level summary expected");
  assert.ok(/||/i.test(text), "should mention practiced areas");
  assert.ok(!/^\s*—\s*.*76.*41/u.test(text.trim()), "must not open with single weak topic only");
}

// B — topic problem with grade context
{
  const payload = buildPayload({
    mathTopics: [
      makeTopicRow("topic_a::grade:g4", "math", " ", 30, 82, {
        rowIdentityV1: { contentGradeKey: "g4", gradeRelation: "lower" },
      }),
      makeTopicRow("topic_a::grade:g5", "math", " ", 28, 38, {
        rowIdentityV1: { contentGradeKey: "g5", gradeRelation: "same" },
      }),
    ],
  });
  const r = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "   ?",
    sessionId: freshSid(),
  });
  assert.equal(r.resolutionStatus, "resolved");
  const text = answerText(r);
  assert.ok(/ ||g4|g5|38|82||/i.test(text), "topic diagnostic with grade split");
}

// C — mistake follow-up differs from problem turn
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [makeTopicRow("topic_a", "math", " ", 24, 48)],
    diagnosticUnits: [
      {
        subjectId: "math",
        topicRowKey: "topic_a",
        taxonomy: { patternHe: "  " },
      },
    ],
  });
  const t1 = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "   ?",
    sessionId,
  });
  const t2 = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "  ?",
    sessionId,
  });
  assert.equal(t1.resolutionStatus, "resolved");
  assert.equal(t2.resolutionStatus, "resolved");
  const fp1 = fingerprintAnswerHe({ answerBlocks: t1.answerBlocks });
  const fp2 = fingerprintAnswerHe({ answerBlocks: t2.answerBlocks });
  assert.notEqual(fp1, fp2, "mistake follow-up must differ from topic-problem answer");
  const t2Text = answerText(t2);
  assert.ok(/||||/i.test(t2Text), "mistake answer uses pattern");
  assert.ok(!/   24 .*41%/u.test(t2Text) || /|/i.test(t2Text));
}

// D — typo mistake intent
{
  const r = runParentCopilotTurn({
    audience: "parent",
    payload: buildPayload({
      mathTopics: [makeTopicRow("topic_a", "math", " ", 18, 50)],
      diagnosticUnits: [{ subjectId: "math", topicRowKey: "topic_a", taxonomy: { patternHe: " " } }],
    }),
    utterance: "   ?",
    sessionId: freshSid(),
  });
  assert.equal(r.resolutionStatus, "resolved");
  assert.ok(/|| /i.test(answerText(r)));
}

// E — home practice follow-up
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [makeTopicRow("topic_a", "math", " ", 20, 45)],
  });
  runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "   ?",
    sessionId,
  });
  const t2 = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "  ?",
    sessionId,
  });
  assert.equal(t2.resolutionStatus, "resolved");
  const text = answerText(t2);
  assert.ok(/||||/i.test(text), "concrete home practice plan");
  assert.ok(!/       /i.test(text));
}

// F — three intents same topic, three different answers
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [makeTopicRow("topic_a", "math", " ", 22, 44)],
    diagnosticUnits: [{ subjectId: "math", topicRowKey: "topic_a", taxonomy: { patternHe: " " } }],
  });
  const q1 = runParentCopilotTurn({ audience: "parent", payload, utterance: "   ?", sessionId });
  const q2 = runParentCopilotTurn({ audience: "parent", payload, utterance: " ?", sessionId });
  const q3 = runParentCopilotTurn({ audience: "parent", payload, utterance: " ?", sessionId });
  const fp1 = fingerprintAnswerHe({ answerBlocks: q1.answerBlocks });
  const fp2 = fingerprintAnswerHe({ answerBlocks: q2.answerBlocks });
  const fp3 = fingerprintAnswerHe({ answerBlocks: q3.answerBlocks });
  assert.notEqual(fp1, fp2);
  assert.notEqual(fp2, fp3);
  assert.notEqual(fp1, fp3);
}

// G — no pattern metadata
{
  const r = runParentCopilotTurn({
    audience: "parent",
    payload: buildPayload({
      mathTopics: [makeTopicRow("topic_b", "math", " ", 40, 45)],
      diagnosticUnits: [],
    }),
    utterance: "   ?",
    sessionId: freshSid(),
  });
  assert.equal(r.resolutionStatus, "resolved");
  assert.ok(answerText(r).includes("        "));
}

// H — low accuracy polarity
{
  const r = runParentCopilotTurn({
    audience: "parent",
    payload: buildPayload(),
    utterance: "  ?",
    sessionId: freshSid(),
  });
  const text = answerText(r);
  assert.ok(!FORBIDDEN_POSITIVE_WHEN_WEAK_RE.test(text));
  assert.ok(/||41/i.test(text));
}

// I — unpracticed in report explanation only as neutral note
{
  const r = runParentCopilotTurn({
    audience: "parent",
    payload: buildPayload(),
    utterance: "   ",
    sessionId: freshSid(),
  });
  const text = answerText(r);
  assert.ok(/ | |/i.test(text), "unpracticed neutral note in report summary");
}

if (DEBUG) {
  process.stderr.write("COPILOT_EVIDENCE_DEBUG enabled — check stderr from turns above\n");
}

process.stdout.write("OK parent-copilot-intent-answer-contracts\n");
