/**
 * Restore accidental bitwise `|` that should be logical `||` in continued expressions.
 * Does NOT touch JSDoc typedef unions that currently use `||` (inverse corruption).
 *
 * Pattern fixed: end-of-line `|` before a continuation line of an expression
 * that was `||` before the multilingual closure commit.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const TARGETS = [
  "utils/topic-next-step-phase2.js",
  "utils/topic-next-step-engine.js",
  "utils/learning-patterns-analysis.js",
  "utils/parent-report-support-sequencing.js",
  "utils/parent-report-recommendation-memory.js",
  "utils/parent-report-outcome-tracking.js",
  "utils/parent-report-intervention-effectiveness.js",
  "utils/parent-report-diagnostic-restraint.js",
  "utils/parent-report-decision-gates.js",
  "utils/parent-report-advice-drift.js",
  "utils/parent-report-mistake-intelligence.js",
  "utils/parent-copilot/semantic-aggregate-answers.js",
  "utils/parent-copilot/truth-packet-v1.js",
  "utils/parent-copilot/short-followup-composer.js",
  "utils/parent-copilot/pattern-answer-composers.js",
  "utils/parent-copilot/intent-answer-contract.js",
  "utils/parent-copilot/index.js",
  "utils/learning-pattern-decision/lpd-parent-facing-copy.js",
  "utils/diagnostic-engine-v2/output-gating.js",
  "utils/diagnostic-engine-v2/run-diagnostic-engine-v2.js",
  "utils/diagnostic-engine-v2/topic-taxonomy-metadata-enrichment.js",
];

function restoreFromBase(rel) {
  const base = "e8b01fa0b";
  let prev;
  try {
    prev = execSync(`git show ${base}:${rel}`, { cwd: ROOT, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  } catch {
    console.log("skip missing in base", rel);
    return;
  }
  const curPath = path.join(ROOT, rel);
  const cur = fs.readFileSync(curPath, "utf8");
  const prevLines = prev.split(/\r?\n/);
  const curLines = cur.split(/\r?\n/);

  // Heuristic: for each current line ending with bare `|` (not `||`, not `|=`),
  // if the corresponding region in prev had `||` at that logical place, restore.
  // Safer approach: take prev file's `||` continuations by matching unique context.
  // Even safer: for lines that are EXACTLY the same as prev except `|` vs `||` at EOL, restore.

  // Build map of trimmed content without trailing |/|| for alignment is fragile.
  // Instead: replace in current any EOL `|` that appears as EOL `||` in prev for same
  // left-hand-side snippet (first 40 chars of trimmed line without trailing or).

  const prevEolOr = new Map();
  for (const line of prevLines) {
    const m = line.match(/^(\s*)(.*?)(\|\|)\s*$/);
    if (!m) continue;
    const key = m[2].replace(/\s+/g, " ").trim();
    if (key) prevEolOr.set(key, true);
  }

  let changed = 0;
  const out = curLines.map((line) => {
    const m = line.match(/^(\s*)(.*?)(\|)\s*$/);
    if (!m) return line;
    // already ||
    if (/\|\|\s*$/.test(line)) return line;
    const key = m[2].replace(/\s+/g, " ").trim();
    if (!key || !prevEolOr.has(key)) return line;
    changed += 1;
    return `${m[1]}${m[2]}||`;
  });

  if (changed) {
    fs.writeFileSync(curPath, out.join("\n"));
    console.log("fixed", rel, changed);
  } else {
    console.log("no change", rel);
  }
}

for (const t of TARGETS) restoreFromBase(t);
