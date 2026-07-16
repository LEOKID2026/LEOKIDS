import assert from "node:assert/strict";
import scopeResolver from "../utils/parent-copilot/scope-resolver.js";
import { syntheticPayload } from "./parent-copilot-test-fixtures.mjs";
import { pct, writeArtifact } from "./rollout-artifacts-lib.mjs";

const payload = syntheticPayload();

const cases = [
  {
    utterance: "What stands out most this period in Fractions?",
    expectedStatus: "resolved",
    expectedScopeType: "executive",
  },
  {
    utterance: "What is the meaning for Fractions?",
    expectedStatus: "resolved",
    expectedScopeType: "topic",
  },
  {
    utterance: "I want to understand Math",
    expectedStatus: "resolved",
    expectedScopeType: "subject",
  },
  {
    utterance: "Can I get another explanation?",
    expectedStatus: "resolved",
    expectedScopeType: "executive",
  },
  {
    utterance: "What is the strongest subject regarding Fractions?",
    expectedStatus: "resolved",
    expectedScopeType: "executive",
  },
];

let pass = 0;
for (const tc of cases) {
  const out = scopeResolver.resolveScope({ payload, utterance: tc.utterance, selectedContextRef: null });
  const ok =
    out.resolutionStatus === tc.expectedStatus &&
    (tc.expectedScopeType == null || out.scope?.scopeType === tc.expectedScopeType);
  if (ok) pass += 1;
}

const collisionAccuracy = pct(pass, cases.length);
writeArtifact("scope-collision", {
  collisionAccuracy,
  sampleSize: cases.length,
  pass: collisionAccuracy >= 95,
});

assert.ok(cases.length >= 5, "scope collision sample size too small");
assert.ok(collisionAccuracy >= 95, `scope collision accuracy below threshold: ${collisionAccuracy.toFixed(2)}%`);

console.log("parent-copilot-scope-collision-suite: OK");
