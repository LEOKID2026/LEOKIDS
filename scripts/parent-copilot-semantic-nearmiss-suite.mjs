import assert from "node:assert/strict";
import semanticClass from "../utils/parent-copilot/semantic-question-class.js";
import { pct, writeArtifact } from "./rollout-artifacts-lib.mjs";

const cases = [
  { utterance: "What is the strongest subject?", expected: "strongest_subject" },
  { utterance: "What subject is very strong now", expected: "none" },
  { utterance: "What is the weakest subject", expected: "weakest_subject" },
  { utterance: "In which subject is it hardish?", expected: "none" },
  { utterance: "What is most cancelled this period?", expected: "none" },
  { utterance: "Are there more topics?", expected: "subject_listing" },
  { utterance: "Comparrison betwen math an english", expected: "none" },
  { utterance: "What to doo thiss weeek?", expected: "none" },
  { utterance: "Advance or wait", expected: "advance_or_hold_question" },
  { utterance: "I did not understand at all please explain simply", expected: "clarify_reexplain" },
];

let pass = 0;
for (const tc of cases) {
  const got = semanticClass.detectAggregateQuestionClass(tc.utterance);
  if (got === tc.expected) pass += 1;
}

const nearmissAccuracy = pct(pass, cases.length);
writeArtifact("semantic-nearmiss", {
  nearmissAccuracy,
  sampleSize: cases.length,
  pass: nearmissAccuracy >= 94,
});

assert.ok(cases.length >= 10, "semantic near-miss sample size too small");
assert.ok(nearmissAccuracy >= 94, `semantic near-miss accuracy below threshold: ${nearmissAccuracy.toFixed(2)}%`);

console.log("parent-copilot-semantic-nearmiss-suite: OK");
