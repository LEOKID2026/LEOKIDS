import assert from "node:assert/strict";
import parentCopilot from "../utils/parent-copilot/index.js";
import guardrail from "../utils/parent-copilot/guardrail-validator.js";

function mkTopic(subjectId, topicRowKey, displayName, questions, accuracy, opts = {}) {
  const readiness = opts.readiness || "forming";
  const confidenceBand = opts.confidenceBand || "medium";
  const cannotConcludeYet = opts.cannotConcludeYet === true;
  const eligible = opts.eligible !== false;
  const intensity = opts.intensity || "RI1";
  return {
    topicRowKey,
    displayName,
    questions,
    accuracy,
    contractsV1: {
      evidence: { contractVersion: "v1", topicKey: topicRowKey, subjectId },
      decision: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        decisionTier: cannotConcludeYet ? 0 : 2,
        cannotConcludeYet,
      },
      readiness: { contractVersion: "v1", topicKey: topicRowKey, subjectId, readiness },
      confidence: { contractVersion: "v1", topicKey: topicRowKey, subjectId, confidenceBand },
      recommendation: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        eligible,
        intensity: eligible ? intensity : "RI0",
        family: eligible ? "general_practice" : null,
        anchorEvidenceIds: [],
        forbiddenBecause: cannotConcludeYet ? ["cannot_conclude_yet"] : [],
      },
      narrative: {
        contractVersion: "v1",
        topicKey: topicRowKey,
        subjectId,
        wordingEnvelope: cannotConcludeYet ? "WE0" : "WE2",
        hedgeLevel: "light",
        allowedTone: "parent_professional_warm",
        forbiddenPhrases: ["completely certain"],
        requiredHedges: ["right now"],
        allowedSections: ["summary", "finding", "recommendation", "limitations"],
        recommendationIntensityCap: eligible ? intensity : "RI0",
        textSlots: {
          observation: `Right now in ${displayName}, ${questions} questions were observed with about ${accuracy}% accuracy.`,
          interpretation: `Right now this describes an initial picture in ${displayName}.`,
          action: eligible ? "Right now a short practice step is possible." : null,
          uncertainty: "Right now it is worth continuing to monitor.",
        },
      },
    },
  };
}

function payloadOneSubject() {
  return {
    version: 2,
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          mkTopic("math", "m-add", "Addition", 24, 78, {
            readiness: "emerging",
            confidenceBand: "medium",
          }),
        ],
      },
    ],
    executiveSummary: { majorTrendsHe: [] },
  };
}

function payloadMultiSubject() {
  return {
    version: 2,
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          mkTopic("math", "m-mul", "Multiplication", 30, 60, {
            readiness: "forming",
            confidenceBand: "low",
            cannotConcludeYet: true,
            eligible: false,
          }),
        ],
      },
      {
        subject: "english",
        topicRecommendations: [
          mkTopic("english", "e-voc", "Vocabulary", 18, 92, {
            readiness: "ready",
            confidenceBand: "high",
            cannotConcludeYet: false,
            eligible: true,
            intensity: "RI2",
          }),
        ],
      },
      {
        subject: "science",
        topicRecommendations: [
          mkTopic("science", "s-bio", "Biology", 12, 45, {
            readiness: "insufficient",
            confidenceBand: "low",
            cannotConcludeYet: true,
            eligible: false,
          }),
        ],
      },
    ],
    executiveSummary: { majorTrendsHe: [] },
  };
}

function payloadSparseData() {
  return {
    version: 2,
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          mkTopic("math", "m-sparse", "Order of operations", 0, 0, {
            readiness: "insufficient",
            confidenceBand: "low",
            cannotConcludeYet: true,
            eligible: false,
          }),
        ],
      },
      {
        subject: "english",
        topicRecommendations: [
          mkTopic("english", "e-sparse", "Reading comprehension", 2, 50, {
            readiness: "insufficient",
            confidenceBand: "low",
            cannotConcludeYet: true,
            eligible: false,
          }),
        ],
      },
    ],
    executiveSummary: { majorTrendsHe: [] },
  };
}

function payloadWithTrends() {
  const p = payloadMultiSubject();
  p.executiveSummary = {
    majorTrendsHe: [
      "Consistent progress appears in English over the period",
      "Caution is needed when interpreting Math because of variability",
      "There is a localized improvement in reading accuracy",
    ],
  };
  return p;
}

function payloadWithoutTrends() {
  const p = payloadMultiSubject();
  p.executiveSummary = { majorTrendsHe: [] };
  return p;
}

function payloadImbalancedCounts() {
  return {
    version: 2,
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          mkTopic("math", "m-heavy", "Multiplication", 120, 70, {
            readiness: "forming",
            confidenceBand: "medium",
          }),
        ],
      },
      {
        subject: "english",
        topicRecommendations: [
          mkTopic("english", "e-light", "Vocabulary", 8, 92, {
            readiness: "ready",
            confidenceBand: "high",
          }),
        ],
      },
      {
        subject: "science",
        topicRecommendations: [
          mkTopic("science", "s-tiny", "Biology", 3, 40, {
            readiness: "insufficient",
            confidenceBand: "low",
            cannotConcludeYet: true,
            eligible: false,
          }),
        ],
      },
    ],
    executiveSummary: { majorTrendsHe: [] },
  };
}

const MATRIX_QUESTIONS = [
  "What is the strongest subject?",
  "What is the weakest subject?",
  "Which subject is the most difficult?",
  "Are there any other subjects?",
  "What stands out most this period?",
  "Math versus English",
  "Where is there the most practice?",
  "Where is there the least data?",
  "What improved?",
  "What needs attention?",
  "What is still unclear?",
  "Which subject is most stable?",
];

const FAMILIES_WITHOUT_TOPIC_LEAK = new Set([
  "What is the strongest subject?",
  "What is the weakest subject?",
  "Which subject is the most difficult?",
]);

const coachingPrefix = /^(from the parenting side|as a parent|according to the report:\s*$|if this is clear)/i;
const internalLeak = /(period overview|scope|executive)/i;
const forbiddenProfessionWording = /\bprofession(?:s)?\b/i;

function expectedPatternForQuestion(q) {
  if (q === "What is the strongest subject?") {
    return /strongest subject|mainly one subject|one subject with(?: enough)?(?: numerical)? practice|not enough(?: numerical)? practice|not ranked|not enough data to compare|only .+ was practiced|relatively strong/i;
  }
  if (q === "What is the weakest subject?") {
    return /weakest subject|lowest subject|mainly one subject|one subject with(?: enough)?(?: numerical)? practice|not enough(?: numerical)? practice|not ranked|not enough data to compare|only .+ was practiced|needs? (?:attention|reinforcement|strengthening)|most \"?difficult\"?/i;
  }
  if (q === "Which subject is the most difficult?") {
    return /most \"?difficult\"?|hardest|mainly one subject|one subject with(?: enough)?(?: numerical)? practice|not enough(?: numerical)? practice|not ranked|not enough data to compare|only .+ was practiced|needs? (?:attention|reinforcement|strengthening)/i;
  }
  if (q === "Are there any other subjects?") {
    return /following subjects appear|does not currently show subjects|one subject|only .+ was practiced|not enough data to compare/i;
  }
  if (q === "What stands out most this period?") {
    return /stands out|summary formulations|highest average|not enough(?: numerical)? practice|accuracy|progress|direction|period/i;
  }
  if (q === "Math versus English") {
    return /higher than|same line|not enough(?: numerical)? practice|lacks enough numerical practice|specify the two names|compare two subjects|little(?: practice)? data|not enough information|comparison is based|working relatively well/i;
  }
  if (q === "Where is there the most practice?") {
    return /most practice|no active subjects|documented questions|questions/i;
  }
  if (q === "Where is there the least data?") {
    return /least data|least information|no active subjects|documented questions|too little data/i;
  }
  if (q === "What improved?") {
    return /improvement|no explicit summary line|improved|direction|progress/i;
  }
  if (q === "What needs attention?") {
    return /needs? (?:attention|reinforcement|strengthening)|focus that currently requires|not enough data/i;
  }
  if (q === "What is still unclear?") {
    return /still (?:not )?clear|no strong indication|uncertainty|entire subject|not enough|focus practice|not yet settled|several areas/i;
  }
  if (q === "Which subject is most stable?") {
    return /most stable subject|only one subject|not enough(?: consistent)? practice|impossible to compare stability/i;
  }
  return /.+/;
}

function topicDisplayNames(payload) {
  const out = [];
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  for (const sp of profiles) {
    const list = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
    for (const tr of list) {
      const dn = String(tr?.displayName || "").trim();
      if (dn) out.push(dn);
    }
  }
  return out;
}

function assertOneSubjectStrongestSemantics(joined, payloadName, question) {
  assert.ok(/one subject|mainly one subject|only .+ with practice|without comparison/i.test(joined), `${payloadName}: "${question}" must state single-subject limitation`);
  assert.ok(/Math/i.test(joined), `${payloadName}: "${question}" must name Math`);
  assert.ok(
    /without comparison|at least two subjects|not enough data to compare|impossible to rank|not ranked/i.test(joined),
    `${payloadName}: "${question}" must deny reliable multi-subject ranking`,
  );
}

function assertSemanticAnswerShape(payloadName, payload, question, response) {
  assert.equal(response.resolutionStatus, "resolved", `${payloadName}: "${question}" must resolve`);
  assert.ok(guardrail.validateParentCopilotResponseV1(response).ok, `${payloadName}: "${question}" guardrail invalid`);
  assert.ok(
    Array.isArray(response.answerBlocks) && response.answerBlocks.length >= 2,
    `${payloadName}: "${question}" answer must have at least 2 blocks`,
  );
  assert.equal(response.answerBlocks[0]?.type, "observation", `${payloadName}: "${question}" first block must be observation`);
  assert.equal(response.suggestedFollowUp, null, `${payloadName}: "${question}" should not emit follow-up`);

  const first = String(response.answerBlocks[0]?.textHe || "").trim();
  const joined = response.answerBlocks.map((b) => String(b.textHe || "")).join(" ");
  assert.ok(first.length > 10, `${payloadName}: "${question}" first block too short`);
  assert.ok(!coachingPrefix.test(first), `${payloadName}: "${question}" must be answer-first, not coaching-first`);
  assert.ok(!internalLeak.test(joined), `${payloadName}: "${question}" leaked internal label`);
  assert.ok(!forbiddenProfessionWording.test(joined), `${payloadName}: "${question}" must use subject, not profession`);
  assert.ok(expectedPatternForQuestion(question).test(joined), `${payloadName}: "${question}" wrong answer class content: ${joined}`);

  if (payloadName === "one-subject-report" && question === "What is the strongest subject?") {
    assertOneSubjectStrongestSemantics(joined, payloadName, question);
  }

  if (FAMILIES_WITHOUT_TOPIC_LEAK.has(question) && payloadName === "multi-subject-report") {
    const topics = topicDisplayNames(payload);
    const hasTopicLeak = topics.some((dn) => joined.includes(dn));
    assert.equal(hasTopicLeak, false, `${payloadName}: "${question}" leaked topic-row phrasing`);
  }
}

function runCase(payloadName, payloadFactory) {
  const payload = payloadFactory();
  MATRIX_QUESTIONS.forEach((q, index) => {
    // Include index so truncated base64 prefixes cannot collide across similar English questions.
    const sessionId = `matrix-${payloadName}-${index}-${Buffer.from(q).toString("base64url").slice(0, 24)}`;
    const res = parentCopilot.runParentCopilotTurn({
      audience: "parent",
      payload,
      utterance: q,
      sessionId,
      selectedContextRef: null,
    });
    assertSemanticAnswerShape(payloadName, payload, q, res);
  });
}

runCase("one-subject-report", payloadOneSubject);
runCase("multi-subject-report", payloadMultiSubject);
runCase("sparse-data-report", payloadSparseData);
runCase("with-major-trends-report", payloadWithTrends);
runCase("without-major-trends-report", payloadWithoutTrends);
runCase("imbalanced-question-count-report", payloadImbalancedCounts);

console.log("parent-copilot-executive-answer-safe-matrix: OK");
