/**
 * Generates manual sample outputs for the 7 required questions.
 * Run: npx tsx scripts/parent-copilot-qa-sample-outputs.mjs
 */
import parentCopilot from "../utils/parent-copilot/index.js";

const payload = {
  version: 2,
  summary: { totalAnswers: 484 },
  overallSnapshot: { totalQuestions: 484, accuracyPct: 74 },
  subjectProfiles: [
    {
      subject: "math",
      topicRecommendations: [
        {
          topicRowKey: "geo",
          displayName: "",
          questions: 45,
          accuracy: 72,
          contractsV1: {
            narrative: {
              contractVersion: "v1", topicKey: "geo", subjectId: "math",
              wordingEnvelope: "WE2", hedgeLevel: "light", allowedTone: "parent_professional_warm",
              forbiddenPhrases: [], requiredHedges: [],
              allowedSections: ["summary", "finding", "recommendation", "limitations"],
              recommendationIntensityCap: "RI2",
              textSlots: {
                observation: "  45     -72%.    ;     .",
                interpretation: "       .",
                action: "      .",
                uncertainty: "",
              },
            },
            decision: { contractVersion: "v1", topicKey: "geo", subjectId: "math", decisionTier: 2, cannotConcludeYet: false },
            readiness: { contractVersion: "v1", topicKey: "geo", subjectId: "math", readiness: "emerging" },
            confidence: { contractVersion: "v1", topicKey: "geo", subjectId: "math", confidenceBand: "medium" },
            recommendation: { contractVersion: "v1", topicKey: "geo", subjectId: "math", eligible: true, intensity: "RI2", family: "general_practice", anchorEvidenceIds: [], rationaleCodes: [], forbiddenBecause: [] },
            evidence: { contractVersion: "v1", topicKey: "geo", subjectId: "math" },
          },
        },
        {
          topicRowKey: "frac",
          displayName: "",
          questions: 60,
          accuracy: 68,
          contractsV1: {
            narrative: {
              contractVersion: "v1", topicKey: "frac", subjectId: "math",
              wordingEnvelope: "WE2", hedgeLevel: "light", allowedTone: "parent_professional_warm",
              forbiddenPhrases: [], requiredHedges: [],
              allowedSections: ["summary", "finding", "recommendation", "limitations"],
              recommendationIntensityCap: "RI2",
              textSlots: {
                observation: "  60     -68%.      .",
                interpretation: "     .",
                action: "      .",
                uncertainty: "",
              },
            },
            decision: { contractVersion: "v1", topicKey: "frac", subjectId: "math", decisionTier: 2, cannotConcludeYet: false },
            readiness: { contractVersion: "v1", topicKey: "frac", subjectId: "math", readiness: "emerging" },
            confidence: { contractVersion: "v1", topicKey: "frac", subjectId: "math", confidenceBand: "high" },
            recommendation: { contractVersion: "v1", topicKey: "frac", subjectId: "math", eligible: true, intensity: "RI2", family: "general_practice", anchorEvidenceIds: [], rationaleCodes: [], forbiddenBecause: [] },
            evidence: { contractVersion: "v1", topicKey: "frac", subjectId: "math" },
          },
        },
      ],
    },
    {
      subject: "english",
      topicRecommendations: [
        {
          topicRowKey: "eng_vocab",
          displayName: " ",
          questions: 38,
          accuracy: 81,
          contractsV1: {
            narrative: {
              contractVersion: "v1", topicKey: "eng_vocab", subjectId: "english",
              wordingEnvelope: "WE1", hedgeLevel: "light", allowedTone: "parent_professional_warm",
              forbiddenPhrases: [], requiredHedges: [],
              allowedSections: ["summary", "finding"],
              recommendationIntensityCap: "RI2",
              textSlots: {
                observation: "    38     -81%.  .",
                interpretation: "    .",
                action: "    .",
                uncertainty: "",
              },
            },
            decision: { contractVersion: "v1", topicKey: "eng_vocab", subjectId: "english", decisionTier: 1, cannotConcludeYet: false },
            readiness: { contractVersion: "v1", topicKey: "eng_vocab", subjectId: "english", readiness: "ready" },
            confidence: { contractVersion: "v1", topicKey: "eng_vocab", subjectId: "english", confidenceBand: "high" },
            recommendation: { contractVersion: "v1", topicKey: "eng_vocab", subjectId: "english", eligible: true, intensity: "RI2", family: "vocabulary", anchorEvidenceIds: [], rationaleCodes: [], forbiddenBecause: [] },
            evidence: { contractVersion: "v1", topicKey: "eng_vocab", subjectId: "english" },
          },
        },
      ],
    },
  ],
  executiveSummary: {
    majorTrendsHe: [
      "  484      74%.",
      " :  .",
      "    .",
    ],
  },
};

const questions = [
  "  ?",
  "    ?",
  "  ?",
  "  ?",
  "  ?",
  "   ?",
  "  ?",
];

let sid = 0;
for (const q of questions) {
  const res = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: q,
    sessionId: `sample-${++sid}`,
  });
  const text =
    res.resolutionStatus === "resolved"
      ? (res.answerBlocks || []).map((b) => b.textHe).join("\n\n")
      : res.clarificationQuestionHe;
  process.stdout.write(`--- : ${q} ---\n${text}\n\n`);
}
