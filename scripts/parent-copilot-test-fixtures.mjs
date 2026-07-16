/**
 * Shared fixture payloads for Parent Copilot rollout suites.
 */

/**
 * @param {{ eligible?: boolean }} [opts]
 */
export function syntheticPayload(opts = {}) {
  const eligible = opts.eligible !== false;
  const recommendation = eligible
    ? {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        eligible: true,
        intensity: "RI2",
        family: "general_practice",
        anchorEvidenceIds: ["ev1"],
        forbiddenBecause: [],
      }
    : {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        eligible: false,
        intensity: "RI0",
        family: null,
        anchorEvidenceIds: [],
        forbiddenBecause: ["cannot_conclude_yet"],
      };
  return {
    version: 2,
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          {
            topicRowKey: "t1",
            displayName: "Fractions",
            questions: 14,
            accuracy: 78,
            contractsV1: {
              evidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math" },
              decision: {
                contractVersion: "v1",
                topicKey: "t1",
                subjectId: "math",
                decisionTier: eligible ? 2 : 0,
                cannotConcludeYet: !eligible,
              },
              readiness: { contractVersion: "v1", topicKey: "t1", subjectId: "math", readiness: eligible ? "emerging" : "insufficient" },
              confidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math", confidenceBand: eligible ? "medium" : "low" },
              recommendation,
              narrative: {
                contractVersion: "v1",
                topicKey: "t1",
                subjectId: "math",
                wordingEnvelope: eligible ? "WE2" : "WE0",
                hedgeLevel: eligible ? "light" : "mandatory",
                allowedTone: "parent_professional_warm",
                forbiddenPhrases: ["completely certain"],
                requiredHedges: ["right now"],
                allowedSections: ["summary", "finding", "recommendation", "limitations"],
                recommendationIntensityCap: eligible ? "RI2" : "RI0",
                textSlots: {
                  observation: "Right now in Fractions, 14 questions were observed with about 78% accuracy.",
                  interpretation: "Right now there is a good practice direction, but consistent reinforcement is still needed.",
                  action: eligible ? "Right now short, focused practice with guided review is recommended." : null,
                  uncertainty: "Right now it is worth continuing to monitor and verify stability in the next round.",
                },
              },
            },
          },
        ],
      },
      {
        subject: "english",
        topicRecommendations: [
          {
            topicRowKey: "e1",
            displayName: "Grammar",
            questions: 10,
            accuracy: 88,
            contractsV1: {
              evidence: { contractVersion: "v1", topicKey: "e1", subjectId: "english" },
              decision: { contractVersion: "v1", topicKey: "e1", subjectId: "english", decisionTier: 2, cannotConcludeYet: false },
              readiness: { contractVersion: "v1", topicKey: "e1", subjectId: "english", readiness: "ready" },
              confidence: { contractVersion: "v1", topicKey: "e1", subjectId: "english", confidenceBand: "high" },
              recommendation: {
                contractVersion: "v1",
                topicKey: "e1",
                subjectId: "english",
                eligible: true,
                intensity: "RI2",
                family: "general_practice",
                anchorEvidenceIds: ["ev2"],
                forbiddenBecause: [],
              },
              narrative: {
                contractVersion: "v1",
                topicKey: "e1",
                subjectId: "english",
                wordingEnvelope: "WE2",
                hedgeLevel: "light",
                allowedTone: "parent_professional_warm",
                forbiddenPhrases: ["completely certain"],
                requiredHedges: ["right now"],
                allowedSections: ["summary", "finding", "recommendation", "limitations"],
                recommendationIntensityCap: "RI2",
                textSlots: {
                  observation: "Right now in Grammar, accuracy is about 88%.",
                  interpretation: "Right now the period shows relatively good stability.",
                  action: "Right now it is recommended to preserve short, gradual practice.",
                  uncertainty: "Right now continue with short monitoring before raising difficulty.",
                },
              },
            },
          },
        ],
      },
    ],
    executiveSummary: { majorTrendsHe: ["First line for the period", "Second line for the period"] },
  };
}

export default { syntheticPayload };
