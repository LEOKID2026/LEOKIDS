import assert from "node:assert/strict";
/** Default import: tsx’s named export linking is unreliable for some project ESM .js files. */
import intentResolver from "../utils/parent-copilot/intent-resolver.js";
import semanticQuestionClass from "../utils/parent-copilot/semantic-question-class.js";
import { pct, writeArtifact } from "./rollout-artifacts-lib.mjs";

const { resolveIntentWithConfidence } = intentResolver;
const { detectAggregateQuestionClass } = semanticQuestionClass;

const intentCases = [
  { utterance: "What should we do today on this topic?", expected: "what_to_do_today" },
  { utterance: "What should we do this week?", expected: "what_to_do_this_week" },
  /** Matches Stage A `what_not_to_do_now` — not difficulty wording. */
  { utterance: "What should we not do now?", expected: "what_not_to_do_now" },
  { utterance: "What is the most important right now?", expected: "what_is_most_important" },
  { utterance: "How do I explain this to the child?", expected: "how_to_tell_child" },
  { utterance: "What should I ask the teacher?", expected: "question_for_teacher" },
  { utterance: "What do we see in the data?", expected: "explain_report" },
  { utterance: "What is the meaning of the data?", expected: "clarify_term" },
  { utterance: "It is not clear to me, there is uncertainty", expected: "is_intervention_needed" },
  { utterance: "What is the meaning of the numbers", expected: "clarify_term" },
  { utterance: "What is the most important right now in the report?", expected: "what_is_most_important" },
  { utterance: "How do I say this to the child at home?", expected: "how_to_tell_child" },
];

const semanticCases = [
  { utterance: "What is the strongest subject?", expected: "strongest_subject" },
  { utterance: "Which subject is hardest?", expected: "hardest_subject" },
  { utterance: "What stands out most this period?", expected: "period_highlight" },
  { utterance: "Are there more subjects?", expected: "subject_listing" },
  { utterance: "What are the next recommendations?", expected: "recommendation_action" },
  { utterance: "I did not understand, please explain simply", expected: "clarify_reexplain" },
  { utterance: "Should we advance or wait?", expected: "advance_or_hold_question" },
  { utterance: "Math versus English which is better?", expected: "comparison" },
];

let intentPass = 0;
for (const c of intentCases) {
  const got = resolveIntentWithConfidence(c.utterance).intent;
  if (got === c.expected) intentPass += 1;
}
let semanticPass = 0;
for (const c of semanticCases) {
  const got = detectAggregateQuestionClass(c.utterance);
  if (got === c.expected) semanticPass += 1;
}

const intentAccuracy = pct(intentPass, intentCases.length);
const semanticAccuracy = pct(semanticPass, semanticCases.length);
const summary = {
  intentAccuracy,
  semanticAccuracy,
  intentSampleSize: intentCases.length,
  semanticSampleSize: semanticCases.length,
  pass: intentAccuracy >= 97 && semanticAccuracy >= 96,
};

writeArtifact("classifier-edge-matrix", summary);

assert.ok(intentCases.length >= 12, "intent sample size too small");
assert.ok(semanticCases.length >= 8, "semantic sample size too small");
assert.ok(intentAccuracy >= 97, `intent accuracy below threshold: ${intentAccuracy.toFixed(2)}%`);
assert.ok(semanticAccuracy >= 96, `semantic accuracy below threshold: ${semanticAccuracy.toFixed(2)}%`);

console.log("parent-copilot-classifier-edge-matrix-suite: OK");
