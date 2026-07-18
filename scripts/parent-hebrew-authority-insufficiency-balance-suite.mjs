import assert from "node:assert/strict";
import parentCopilot from "../utils/parent-copilot/index.js";
import { syntheticPayload } from "./parent-copilot-test-fixtures.mjs";
import { pct, writeArtifact } from "./rollout-artifacts-lib.mjs";

const eligiblePayload = syntheticPayload({ eligible: true });
const insufficientPayload = syntheticPayload({ eligible: false });

const insufficientCue =
  /לא\s+ניתן|אין\s+מספיק\s+נתונים|מוקדם\s+לקבוע|כדאי\s+להמשיך\s+לעקוב|not enough evidence|too early|continuing to monitor|continue(?:\s+to)?\s+monitor|still early|insufficient|consistent reinforcement is still needed|verify stability/iu;
const overAuthorityCue = /בוודאות|חד\s+משמעית|בטוח\s+לחלוטין|completely certain|with certainty|unequivocally/iu;

let insufficientRequired = 0;
let insufficientPresent = 0;
let authorityViolations = 0;
let total = 0;

for (let i = 0; i < 80; i++) {
  const good = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: eligiblePayload,
    utterance: "What is the meaning for Fractions?",
    sessionId: `auth-good-${i}`,
    selectedContextRef: null,
  });
  const bad = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: insufficientPayload,
    utterance: "What is the meaning for Fractions?",
    sessionId: `auth-ins-${i}`,
    selectedContextRef: null,
  });

  const goodText = Array.isArray(good?.answerBlocks) ? good.answerBlocks.map((b) => String(b?.answerText || "")).join(" ") : "";
  const badText = Array.isArray(bad?.answerBlocks) ? bad.answerBlocks.map((b) => String(b?.answerText || "")).join(" ") : "";

  total += 2;
  if (overAuthorityCue.test(goodText)) authorityViolations += 1;
  if (overAuthorityCue.test(badText)) authorityViolations += 1;

  insufficientRequired += 1;
  if (insufficientCue.test(badText)) insufficientPresent += 1;
}

const insufficiencyRecall = pct(insufficientPresent, insufficientRequired);
const authorityPer1000 = total > 0 ? (authorityViolations / total) * 1000 : 0;

writeArtifact("hebrew-authority-insufficiency-balance", {
  sampleSize: total,
  insufficiencyRecall,
  authorityPer1000,
  pass: insufficiencyRecall >= 97 && authorityPer1000 <= 2,
});

assert.ok(total >= 120, "authority/insufficiency sample size too small");
assert.ok(insufficiencyRecall >= 97, `insufficiency recall below threshold: ${insufficiencyRecall.toFixed(2)}%`);
assert.ok(authorityPer1000 <= 2, `authority drift too high: ${authorityPer1000.toFixed(2)} per 1000`);

console.log("parent-hebrew-authority-insufficiency-balance-suite: OK");
