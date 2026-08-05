/**
 * Parent Copilot multi-turn conversation quality — scope inheritance, polarity, mistake patterns.
 * Run: npm run test:parent-copilot-conversation-quality
 */
import assert from "node:assert/strict";
import parentCopilot from "../utils/parent-copilot/index.js";
import sessionMemory from "../utils/parent-copilot/session-memory.js";
import evidencePolarity from "../utils/parent-copilot/evidence-polarity.js";

const { FORBIDDEN_POSITIVE_WHEN_WEAK_RE } = evidencePolarity;
const runParentCopilotTurn = parentCopilot.runParentCopilotTurn;
const resetSession = sessionMemory.resetParentCopilotSessionForTests;

/** Generic ambiguous fallback opener — must not appear on contextual follow-ups. */
const AMBIGUOUS_SNIP = "I could not tell exactly";

function answerText(res) {
  if (res?.resolutionStatus === "resolved") {
    return (res.answerBlocks || []).map((b) => String(b.textHe || "")).join(" ");
  }
  return String(res.clarificationQuestionHe || "");
}

/**
 * @param {string} topicRowKey
 * @param {string} subjectId
 * @param {string} displayName
 * @param {number} q
 * @param {number} acc
 * @param {object} [narrativeSlots]
 */
function makeTopicRow(topicRowKey, subjectId, displayName, q, acc, narrativeSlots = null) {
  const slots = narrativeSlots || {
    observation: `${displayName}: ${q} questions were answered with about ${acc}%.`,
    interpretation:
      acc <= 54
        ? "The data shows difficulty; focused support is still needed."
        : "Practice looks relatively stable in this topic.",
    action: "Keep short practice sessions on this topic.",
    uncertainty: "",
  };
  return {
    topicRowKey,
    displayName,
    questions: q,
    accuracy: acc,
    contractsV1: {
      evidence: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        questionCount: q,
        accuracyPct: acc,
      },
      decision: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        decisionTier: q >= 20 ? 2 : 1,
        cannotConcludeYet: false,
      },
      readiness: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        readiness: acc >= 75 ? "ready" : "emerging",
      },
      confidence: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        confidenceBand: acc >= 78 ? "high" : "medium",
      },
      recommendation: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        eligible: true,
        intensity: "RI2",
        family: "general_practice",
        anchorEvidenceIds: ["ev"],
        forbiddenBecause: [],
      },
      narrative: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        wordingEnvelope: acc <= 54 ? "WE4" : "WE3",
        hedgeLevel: "light",
        allowedTone: "parent_professional_warm",
        forbiddenPhrases: [],
        requiredHedges: [],
        allowedSections: ["summary", "finding", "recommendation", "limitations"],
        recommendationIntensityCap: "RI2",
        textSlots: slots,
      },
    },
  };
}

/**
 * @param {object} opts
 */
function buildPayload(opts = {}) {
  const mathTopics = opts.mathTopics || [
    makeTopicRow("fractions", "math", "Fractions", 76, 41),
  ];
  return {
    version: 2,
    subjectProfiles: [
      {
        subject: "math",
        subjectQuestionCount: mathTopics.reduce((n, tr) => n + Math.max(0, Number(tr?.questions) || 0), 0),
        topicRecommendations: mathTopics,
      },
      {
        subject: "english",
        subjectQuestionCount:
          opts.englishTopics?.reduce((n, tr) => n + Math.max(0, Number(tr?.questions) || 0), 0) ?? 0,
        topicRecommendations: opts.englishTopics || [
          makeTopicRow("grammar", "english", "Grammar", 0, 0, {
            observation: "",
            interpretation: "",
            action: null,
            uncertainty: "",
          }),
        ],
      },
    ],
    diagnosticEngineV2: {
      units: Array.isArray(opts.diagnosticUnits) ? opts.diagnosticUnits : [],
    },
    executiveSummary: { majorTrendsHe: ["Mixed practice this period."] },
  };
}

let sid = 0;
const freshSid = () => `pcq-${++sid}`;

// A — topic + follow-up inherits scope; uses pattern when available
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [makeTopicRow("topic_a", "math", "Topic A", 24, 48)],
    diagnosticUnits: [
      {
        subjectId: "math",
        topicRowKey: "topic_a",
        diagnosis: { lineHe: "Confusing numerator and denominator", allowed: true },
        taxonomy: { patternHe: "Mixing numerator and denominator" },
      },
    ],
  });
  const t1 = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "What is the problem with Topic A?",
    sessionId,
  });
  assert.equal(t1.resolutionStatus, "resolved");
  const t2 = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "What are the main mistakes?",
    sessionId,
  });
  assert.equal(t2.resolutionStatus, "resolved", "follow-up must resolve, not fallback");
  const t2Text = answerText(t2);
  assert.ok(!t2Text.includes(AMBIGUOUS_SNIP), "follow-up must not use generic ambiguous fallback");
  assert.ok(/Topic A|numerator|denominator|pattern|mistake/i.test(t2Text), "follow-up should use inherited topic + pattern evidence");
}

// B — typo variant treated as mistake-pattern intent
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [makeTopicRow("topic_a", "math", "Topic A", 18, 50)],
    diagnosticUnits: [
      {
        subjectId: "math",
        topicRowKey: "topic_a",
        taxonomy: { patternHe: "Repeated mistake adding fractions" },
      },
    ],
  });
  const r = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "What are the mistaks in Topic A?",
    sessionId,
  });
  assert.equal(r.resolutionStatus, "resolved");
  const text = answerText(r);
  assert.ok(/mistake|pattern|fraction/i.test(text), "typo mistaks should surface mistake-pattern evidence");
}

// C — low accuracy high volume: difficulty wording, never success hype
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload();
  const r = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "What is the problem with fractions?",
    sessionId,
  });
  assert.equal(r.resolutionStatus, "resolved");
  const text = answerText(r);
  assert.ok(!FORBIDDEN_POSITIVE_WHEN_WEAK_RE.test(text), "76q/41% must not get positive success wording");
  assert.ok(/reinforcement|difficulty|accuracy|41|76/i.test(text), "should cite difficulty/support framing with evidence");
}

// D — high accuracy row: stable / maintain wording
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [makeTopicRow("mastery", "math", "Mastery", 450, 88)],
  });
  const r = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "How is his mastery?",
    sessionId,
  });
  assert.equal(r.resolutionStatus, "resolved");
  const text = answerText(r);
  assert.ok(/stable|maintain|good|88/i.test(text), "high accuracy should read as stable/good");
  assert.ok(!/focused reinforcement.*before concluding everything is stable/i.test(text), "strong row should not get weak-support-only copy");
}

// E — grade split: weak g5 vs strong g4
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [
      makeTopicRow("fractions::grade:g4", "math", "Fractions", 30, 82),
      makeTopicRow("fractions::grade:g5", "math", "Fractions", 28, 38),
    ],
  });
  const r = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "What is the problem with fractions?",
    sessionId,
  });
  assert.equal(r.resolutionStatus, "resolved");
  const text = answerText(r);
  assert.ok(/fractions/i.test(text));
  assert.ok(
    /grade|g5|g4|weaker|lower|38|82|gap|two/i.test(text) || /38|82/.test(text),
    "grade split should surface weaker practice row without calling strong row weak",
  );
}

// F — missing mistake pattern: precise limitation, not fallback
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [makeTopicRow("topic_b", "math", "Topic B", 40, 45)],
    diagnosticUnits: [],
  });
  const r = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "What are the mistakes in Topic B?",
    sessionId,
  });
  assert.equal(r.resolutionStatus, "resolved");
  const text = answerText(r);
  assert.ok(
    text.includes("not enough detail to identify the exact mistake type"),
    "must state precise limitation when pattern metadata missing",
  );
  assert.ok(!text.includes(AMBIGUOUS_SNIP), "must not generic-fallback");
}

// G — subject scope + follow-up mistake question
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    mathTopics: [
      makeTopicRow("fractions", "math", "Fractions", 76, 41),
      makeTopicRow("multiplication", "math", "Multiplication", 20, 85),
    ],
    diagnosticUnits: [
      {
        subjectId: "math",
        topicRowKey: "fractions",
        taxonomy: { patternHe: "Mistake reducing fractions" },
      },
    ],
  });
  const t1 = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "What is the problem in math?",
    sessionId,
  });
  assert.equal(t1.resolutionStatus, "resolved");
  const t2 = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "Where did he make more mistakes?",
    sessionId,
  });
  assert.equal(t2.resolutionStatus, "resolved");
  const t2Text = answerText(t2);
  assert.ok(!t2Text.includes(AMBIGUOUS_SNIP), "subject-scoped follow-up must not fallback");
  assert.ok(/math|fractions|mistake|pattern|error/i.test(t2Text), "continues within math scope");
}

// H — zero-evidence english
{
  const sessionId = freshSid();
  resetSession(sessionId);
  const payload = buildPayload({
    englishTopics: [makeTopicRow("grammar", "english", "Grammar", 0, 0)],
  });
  const r = runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "How is he doing in English?",
    sessionId,
  });
  assert.ok(
    r.resolutionStatus === "resolved" || r.resolutionStatus === "clarification_required",
    "english zero-evidence should resolve or clarify with no-data policy",
  );
  const text = answerText(r);
  assert.ok(/not practiced|no practice|no data|0|not observed|period/i.test(text), "must communicate no practice in period");
}

process.stdout.write("OK parent-copilot-conversation-quality\n");
