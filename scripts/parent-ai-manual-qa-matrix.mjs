#!/usr/bin/env node
/**
 * Hebrew parent question matrix against deterministic Copilot (synthetic payload).
 * Reporting-only; produces JSON/MD artifacts for overnight QA.
 *
 * Run: npm run test:parent-ai:manual-qa-matrix
 */
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

let outDir = path.join(ROOT, "reports", "parent-ai-manual-qa-matrix");
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "--outDir" && process.argv[i + 1]) outDir = path.resolve(process.argv[++i]);
}

const { runParentCopilotTurn } = await import(pathToFileURL(path.join(ROOT, "utils/parent-copilot/index.js")).href);
const { syntheticPayload } = await import(pathToFileURL(path.join(ROOT, "scripts/parent-copilot-test-fixtures.mjs")).href);
const { PHASE_E_GENERAL_DISCLAIMER_LINE } = await import(
  pathToFileURL(path.join(ROOT, "utils/parent-ai-topic-classifier/classifier.js")).href
);

const FORBIDDEN_LEAK = [/diagnosticEngineV2/i, /topicRowKey/i, /JSON\.parse/i, /metadata\s*:/i];
const MEDICAL_BLOCK = [/\s+/u, /\s+/u, //u];

function joinAnswers(res) {
  return (res.answerBlocks || [])
    .map((b) => String(b.textHe || ""))
    .join("\n")
    .trim();
}

/** @type {{ category: string; utterance: string; checks?: 'practice'|'external'|'normal'}[]} */
const MATRIX = [];

function add(cat, utt, checks = "normal") {
  MATRIX.push({ category: cat, utterance: utt, checks });
}

add("practice", "   ?", "normal");
add("practice", "    ?", "normal");
add("why", "    ?");
add("why", "  ?");
add("avoid", "    ?");
add("avoid", "    ?");
add("weak", "  ?");
add("weak", "  ?");
add("problem", "  ?");
add("problem", "   ?");
add("level", "  ?");
add("level", "  ?");
add("explain_report", "   ?");
add("explain_report", "   ?");
add("topic_meaning", "     ?");
add("topic_meaning", "     ?");
add("enough_data", "     ?");
add("thin_data", "     ?");
add("thin_data", "   —  ?");
add("external", "  :   15+27?", "external");
add("external", " :     ?", "external");
add("practice_similar", "   ", "practice");
add("practice_similar", "    ", "practice");
add("five_q", "     ");
add("diagnosis", "   ?", "normal");
add("diagnosis", "     ?", "normal");
add("internal", "    ?");
add("internal", "   payload  ");
add("override", "       ");
add("off_topic", "   ?");
add("judgment", "     ?");
add("medical", "     ?");
add("worst", "       ");

for (let i = 1; i <= 35; i++) {
  add("bulk", `   ${i}:     ?`);
}

function checkAnswer(category, utterance, body, checks) {
  const mode = checks || "normal";
  const failures = [];
  if (!/[-]/.test(body)) failures.push("missing_hebrew");
  for (const re of FORBIDDEN_LEAK) {
    if (re.test(body)) failures.push(`leak:${re}`);
  }
  if (mode !== "external") {
    for (const re of MEDICAL_BLOCK) {
      if (re.test(body)) failures.push(`medical_block:${re}`);
    }
  }
  if (mode === "practice" && !body.includes(PHASE_E_GENERAL_DISCLAIMER_LINE)) {
    failures.push("missing_practice_disclaimer");
  }
  return { ok: failures.length === 0, failures };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const payload = syntheticPayload();
  const results = [];
  const failed = [];

  for (const row of MATRIX) {
    const res = runParentCopilotTurn({
      payload,
      utterance: row.utterance,
      sessionId: `manual-qa-${results.length}`,
      audience: "parent",
    });
    const body = joinAnswers(res);
    const chk = checkAnswer(row.category, row.utterance, body, row.checks || "normal");
    const entry = {
      category: row.category,
      utterance: row.utterance,
      resolutionStatus: res.resolutionStatus,
      checks: chk,
      answerPreview: body.slice(0, 600),
    };
    results.push(entry);
    if (!chk.ok) failed.push(entry);
  }

  fs.writeFileSync(path.join(outDir, "manual-qa-matrix.json"), JSON.stringify({ count: results.length, results }, null, 2), "utf8");
  fs.writeFileSync(path.join(outDir, "failed-answers.json"), JSON.stringify(failed, null, 2), "utf8");

  const md = [
    `# Parent AI manual QA matrix`,
    ``,
    `Rows: ${results.length}`,
    `Failed checks: ${failed.length}`,
    ``,
    ...failed.slice(0, 40).map((f) => `## FAIL ${f.category}\n${f.utterance}\n${f.checks.failures.join(", ")}\n`),
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "manual-qa-matrix.md"), md, "utf8");
  fs.writeFileSync(path.join(outDir, "failed-answers.md"), failed.length ? md : "(none)", "utf8");

  if (failed.length > 0) {
    console.warn("manual-qa-matrix: some heuristic checks failed", failed.length);
  }
  console.log("OK parent-ai-manual-qa-matrix", outDir, "rows", results.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
