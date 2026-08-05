#!/usr/bin/env node
/**
 * Round-3 approved pattern composer selftest.
 */
import assert from "node:assert/strict";
import { tryComposePatternAnswerDraft } from "../utils/parent-copilot/pattern-answer-composers.js";
import { tryComposeContinuityPatternDraft } from "../utils/parent-copilot/continuity-pattern-composer.js";
import { NO_DATA_FOR_REQUEST_RESPONSE_HE } from "../utils/parent-copilot/question-classifier.js";

function samplePayload() {
  return {
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          {
            topicRowKey: "math:frac-add",
            displayName: " ",
            questions: 24,
            accuracy: 48,
            contractsV1: { narrative: { textSlots: { observation: "    " } } },
          },
          {
            topicRowKey: "math:mult",
            displayName: "",
            questions: 30,
            accuracy: 82,
          },
        ],
      },
    ],
    executiveSummary: {
      majorTrendsHe: ["        ."],
    },
    summary: { parentActivityAttemptsCount: 2, totalAnswers: 54 },
  };
}

function main() {
  const payload = samplePayload();

  const where = tryComposePatternAnswerDraft({
    utteranceStr: "   ?",
    payload,
    conversationState: {},
  });
  assert.ok(where?.answerBlocks?.[0]?.textHe.includes("24 "));
  assert.ok(where.answerBlocks[0].textHe.includes("48%"));

  const three = tryComposePatternAnswerDraft({
    utteranceStr: "     ?",
    payload,
    conversationState: {},
  });
  assert.ok(three?.answerBlocks?.[0]?.textHe.includes(" "));

  const open = tryComposePatternAnswerDraft({
    utteranceStr: "     ?",
    payload,
    conversationState: {},
  });
  assert.ok(open?.answerBlocks?.[0]?.textHe.includes("5–10") || open?.answerBlocks?.[0]?.textHe.includes(" "));

  const speed = tryComposePatternAnswerDraft({
    utteranceStr: "    ?",
    payload,
    conversationState: {},
  });
  assert.ok(speed?.answerBlocks?.[0]?.textHe.includes(" ") || speed?.answerBlocks?.[0]?.textHe.includes(""));

  const emptyPayload = { subjectProfiles: [] };
  const noDataTrend = tryComposePatternAnswerDraft({
    utteranceStr: "   ?",
    payload: emptyPayload,
    conversationState: {},
  });
  assert.equal(noDataTrend?.noData, true);

  const conv = {
    priorScopes: ["topic:math:frac-add"],
    lastResolvedTopic: "math:frac-add",
    lastResolvedSubject: "math",
  };
  const cont = tryComposeContinuityPatternDraft({
    utteranceStr: "  ?",
    payload,
    conversationState: conv,
  });
  assert.ok(cont?.answerBlocks?.[0]?.textHe.includes(" "));

  const englishConv = {
    priorScopes: ["subject:english"],
    lastResolvedSubject: "english",
    lastAnswerSummary: "       .",
  };
  const severity = tryComposeContinuityPatternDraft({
    utteranceStr: " ?",
    payload: {
      subjectProfiles: [
        {
          subject: "english",
          topicRecommendations: [
            { topicRowKey: "english:vocab", displayName: "", questions: 12, accuracy: 40 },
          ],
        },
        {
          subject: "math",
          topicRecommendations: [
            { topicRowKey: "math:geom", displayName: "", questions: 20, accuracy: 35 },
          ],
        },
      ],
    },
    conversationState: englishConv,
  });
  assert.ok(severity?.answerBlocks?.[0]?.textHe.includes(""));
  assert.ok(!severity?.answerBlocks?.[0]?.textHe.includes(""));

  const home = tryComposePatternAnswerDraft({
    utteranceStr: "  ?",
    payload,
    conversationState: {},
  });
  assert.ok(home?.answerBlocks?.[0]?.textHe.includes("  "));

  const askHome = tryComposePatternAnswerDraft({
    utteranceStr: "   ?",
    payload,
    conversationState: {},
  });
  assert.ok(askHome?.answerBlocks?.[0]?.textHe.includes(" "));

  const notInfer = tryComposePatternAnswerDraft({
    utteranceStr: "   ?",
    payload,
    conversationState: {},
  });
  assert.ok(notInfer?.answerBlocks?.[0]?.textHe.includes("    "));

  const whyNotInfer = tryComposeContinuityPatternDraft({
    utteranceStr: "?",
    payload,
    conversationState: {
      lastTurnWasWhatNotInfer: true,
      lastAnswerSummary: notInfer.answerBlocks[0].textHe,
    },
  });
  assert.ok(whyNotInfer?.answerBlocks?.[0]?.textHe.includes("     "));

  const preserve = tryComposeContinuityPatternDraft({
    utteranceStr: " ?",
    payload,
    conversationState: {
      priorScopes: ["topic:math:mult"],
      lastResolvedTopic: "math:mult",
      lastPlannerIntent: "what_is_going_well",
    },
  });
  assert.ok(preserve?.answerBlocks?.[0]?.textHe.includes(""));

  assert.equal(NO_DATA_FOR_REQUEST_RESPONSE_HE.length > 20, true);
  console.log("OK parent-copilot-pattern-round3-selftest");
}

main();
