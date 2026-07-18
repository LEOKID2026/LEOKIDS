import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanRepository } from "./hardcoded-ui-core.mjs";
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function categorizeFinding(file, text) {
  const f = file.replace(/\\/g, "/");
  if (isAllowlistedFinding(f, 0, text)) return "False positives";
  if (
    /\/dev-student-simulator\/|pages\/learning\/dev\/|pages\/learning\/dev-/.test(f) ||
    /\/mock\//.test(f) ||
    /feature-flag/.test(f)
  ) {
    return "Internal/non-user-facing";
  }
  if (/parent-copilot|copilot-turn|ParentCopilot/.test(f)) return "Copilot";
  if (/parent-report|report-generator|report-language|detailed-parent-report/.test(f)) return "Reports";
  if (/learning-book|english-page-skill/.test(f)) return "Books UI";
  if (/diagnostic-|taxonomy-|probe-map|math-animations/.test(f)) return "Learning";
  if (/pages\/learning|learning-/.test(f)) return "Learning";
  return "Other";
}

const { findings } = scanRepository();
/** @type {Map<string, number>} */
const byFile = new Map();
for (const f of findings) {
  if (categorizeFinding(f.file, f.text) !== "Learning") continue;
  byFile.set(f.file, (byFile.get(f.file) || 0) + 1);
}

for (const [file, count] of [...byFile.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`${count}\t${file}`);
}
console.log("total", [...byFile.values()].reduce((a, b) => a + b, 0));
