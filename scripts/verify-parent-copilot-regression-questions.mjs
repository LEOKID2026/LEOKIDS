/**
 * One-off regression verification table (same pipeline as QA selftest).
 * Run: npx tsx scripts/verify-parent-copilot-regression-questions.mjs
 */
import parentCopilot from "../utils/parent-copilot/index.js";

function makeContract(topicKey, subjectId, obs, interp, act, unc, qCount = 12, acc = 75, recEligible = true) {
  return {
    topicRowKey: topicKey,
    displayName:
      topicKey === "geo"
        ? ""
        : topicKey === "frac"
          ? ""
          : topicKey === "eng_vocab"
            ? " "
            : " ",
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
        textSlots: { observation: obs, interpretation: interp, action: act, uncertainty: unc },
      },
      decision: { contractVersion: "v1", topicKey, subjectId, decisionTier: 2, cannotConcludeYet: false },
      readiness: { contractVersion: "v1", topicKey, subjectId, readiness: "emerging" },
      confidence: { contractVersion: "v1", topicKey, subjectId, confidenceBand: "medium" },
      recommendation: {
        contractVersion: "v1",
        topicKey,
        subjectId,
        eligible: recEligible,
        intensity: recEligible ? "RI2" : "RI0",
        family: "general_practice",
        anchorEvidenceIds: [],
        rationaleCodes: [],
        forbiddenBecause: [],
      },
      evidence: { contractVersion: "v1", topicKey, subjectId },
    },
  };
}

function highDataPayload() {
  const mathGeo = makeContract(
    "geo",
    "math",
    "  45 ,    72%.",
    "         .",
    "       .",
    "     .",
  );
  const mathFrac = makeContract(
    "frac",
    "math",
    "  60 ,    68%.",
    "       .",
    "      .",
    "     .",
  );
  const engVocab = makeContract(
    "eng_vocab",
    "english",
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

const QUESTIONS = [
  "  ?",
  "   ?",
  "  ?",
  "    ?",
  "  ?",
  "   ",
  "  ?",
  "  ?",
  "   ?",
];

let sid = 0;
const payload = highDataPayload();

process.stdout.write("Regression verification (highDataPayload, runParentCopilotTurn)\n\n");

for (const q of QUESTIONS) {
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: q,
    sessionId: `verify-${++sid}`,
    selectedContextRef: null,
  });

  const bucket = res.metadata?.classifierBucket ?? "(missing)";
  const semantic = res.metadata?.semanticIntent ?? "(missing)";
  const gp = res.telemetry?.generationPath ?? res.generationPath ?? "(missing)";
  const blocksText =
    res.resolutionStatus === "resolved"
      ? (Array.isArray(res.answerBlocks) ? res.answerBlocks : [])
          .map((b) => String(b?.textHe || "").trim())
          .filter(Boolean)
          .join("\n\n")
      : String(res.clarificationQuestionHe || "").trim();

  process.stdout.write(`--- ${q} ---\n`);
  process.stdout.write(`classifierBucket: ${bucket}\n`);
  process.stdout.write(`semanticIntent: ${semantic}\n`);
  process.stdout.write(`generationPath: ${gp}\n`);
  process.stdout.write(`final visible answer:\n${blocksText}\n\n`);
}
