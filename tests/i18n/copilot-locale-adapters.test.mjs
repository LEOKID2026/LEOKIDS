import test from "node:test";
import assert from "node:assert/strict";
import {
  localizeCopilotBoundaryResponse,
  applyCopilotResponseLocaleToTurn,
} from "../../lib/parent-copilot/copilot-locale-adapters/index.js";
import { GENERAL_OFF_TOPIC_RESPONSE_HE } from "../../utils/parent-copilot/question-classifier.js";

test("copilot English adapter replaces Hebrew boundary copy", () => {
  const en = localizeCopilotBoundaryResponse(GENERAL_OFF_TOPIC_RESPONSE_HE, "en");
  assert.match(en, /I can only help here/);
  assert.doesNotMatch(en, /[\u0590-\u05FF]/);
});

test("copilot en-XA adapter applies pseudo-long transform", () => {
  const pseudo = localizeCopilotBoundaryResponse(GENERAL_OFF_TOPIC_RESPONSE_HE, "en-XA");
  assert.ok(pseudo.length > 80);
});

test("applyCopilotResponseLocaleToTurn localizes answer blocks", () => {
  const turn = applyCopilotResponseLocaleToTurn(
    {
      answerBlocks: [{ type: "paragraph", textHe: GENERAL_OFF_TOPIC_RESPONSE_HE }],
    },
    "en"
  );
  assert.match(String(turn.answerBlocks[0].answerText), /I can only help here/);
});
