/**
 * Escape Hebrew letters to \uXXXX in specific files (keep syntax; 0 HE chars).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HE_G = /[\u0590-\u05FF]/g;

function escapeHe(text) {
  return text.replace(HE_G, (ch) => {
    const cp = ch.codePointAt(0);
    return "\\u" + cp.toString(16).toUpperCase().padStart(4, "0");
  });
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(js|mjs|cjs|jsx)$/i.test(ent.name)) out.push(p);
  }
  return out;
}

const targets = [
  ...walk(path.join(ROOT, "utils/parent-copilot")),
  ...walk(path.join(ROOT, "utils/parent-narrative-safety")),
  path.join(ROOT, "utils/learning-pattern-decision/parent-pattern-label.js"),
  path.join(ROOT, "utils/learning-pattern-decision/lpd-parent-facing-copy.js"),
  path.join(ROOT, "utils/learning-pattern-decision/parent-engine-decision-contract-v2.js"),
  path.join(ROOT, "utils/learning-pattern-decision/build-subject-engine-decision-contract.js"),
  path.join(ROOT, "utils/parent-report-language/grade-insight.js"),
  path.join(ROOT, "utils/parent-report-language/parent-report-owner-copy-templates.js"),
  path.join(ROOT, "utils/parent-report-language/pedagogy-glossary.js"),
  path.join(ROOT, "utils/parent-report-language/subject-withhold-summary.js"),
  path.join(ROOT, "lib/learning/learning-time-credit-policy.js"),
];

let n = 0;
for (const p of targets) {
  if (!fs.existsSync(p)) continue;
  const raw = fs.readFileSync(p, "utf8");
  if (!/[\u0590-\u05FF]/.test(raw)) continue;
  fs.writeFileSync(p, escapeHe(raw), "utf8");
  n++;
  console.log("escaped", path.relative(ROOT, p).replace(/\\/g, "/"));
}
console.log("escaped_count", n);
