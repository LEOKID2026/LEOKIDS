/**
 * Remove Hebrew \u05xx escapes from parent-facing phrase banks (Global EN/ES parents).
 * Keeps EN literals; empties HE matcher fragments.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ESC = /\\u05[0-9A-Fa-f]{2}/gi;

const FILES = [
  "utils/parent-copilot/stage-a-freeform-interpretation.js",
  "utils/parent-copilot/question-classifier.js",
  "utils/parent-copilot/conversational-reply-class.js",
  "utils/parent-copilot/semantic-question-class.js",
  "utils/parent-copilot/guardrail-validator.js",
  "utils/parent-copilot/index.js",
  "utils/parent-copilot/pattern-answer-composers.js",
  "utils/parent-copilot/report-row-resolver.js",
  "utils/parent-copilot/utterance-normalize.js",
  "utils/parent-copilot/contextual-follow-up.js",
  "utils/parent-copilot/answer-composer.js",
  "utils/parent-copilot/intent-answer-composers.js",
  "utils/parent-copilot/parent-facing-answer-postprocess.js",
  "utils/parent-copilot/short-followup-composer.js",
  "utils/parent-copilot/no-data-request-response.js",
  "utils/parent-copilot/topic-evidence-answer.js",
  "utils/parent-copilot/semantic-aggregate-answers.js",
  "utils/parent-copilot/continuity-pattern-composer.js",
  "utils/parent-copilot/comparison-practical-continuity.js",
  "utils/parent-copilot/conversation-scope-inheritance.js",
  "utils/parent-copilot/data-grounded-evidence-augmentation.js",
  "utils/parent-copilot/evidence-polarity.js",
  "utils/parent-copilot/intent-answer-contract.js",
  "utils/parent-copilot/llm-orchestrator.js",
  "utils/parent-copilot/truth-packet-v1.js",
  "utils/learning-pattern-decision/parent-pattern-label.js",
  "utils/learning-pattern-decision/lpd-parent-facing-copy.js",
  "utils/learning-pattern-decision/parent-engine-decision-contract-v2.js",
  "utils/learning-pattern-decision/build-subject-engine-decision-contract.js",
  "utils/parent-narrative-safety/parent-narrative-safety-contract.js",
  "utils/parent-narrative-safety/parent-narrative-safety-fixtures.js",
  "utils/parent-narrative-safety/parent-narrative-safety-guard.js",
  "utils/parent-narrative-safety/parent-report-text-extractor.js",
  "utils/parent-report-language/forbidden-terms.js",
  "utils/parent-report-language/grade-insight.js",
  "utils/parent-report-language/parent-report-owner-copy-templates.js",
  "utils/parent-report-language/pedagogy-glossary.js",
  "utils/parent-report-language/subject-withhold-summary.js",
  "hooks/useArcadeBingoSession.js",
  "lib/learning/learning-time-credit-policy.js",
];

let changed = 0;
for (const rel of FILES) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let t = fs.readFileSync(p, "utf8");
  if (!ESC.test(t)) continue;
  ESC.lastIndex = 0;
  t = t.replace(ESC, "");
  // Collapse empty quoted strings left behind
  t = t.replace(/"(?:\s)*"/g, '""');
  fs.writeFileSync(p, t);
  changed++;
  console.log("stripped", rel);
}
console.log("changed", changed);
