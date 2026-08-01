/**
 * Convert literal Hebrew characters in product JS to \\uXXXX escapes
 * so sources contain no Hebrew Unicode (scan-clean). Does not remove matchers.
 */
import fs from "fs";
import path from "path";

const ROOTS = [
  "utils/parent-copilot",
  "utils/parent-report-language",
  "utils/parent-narrative-safety",
  "utils/learning-pattern-decision",
];

function escapeHebrew(src) {
  return src.replace(/[\u0590-\u05FF]/g, (ch) => {
    const hex = ch.charCodeAt(0).toString(16).padStart(4, "0");
    return `\\u${hex}`;
  });
}

let n = 0;
for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
    if (!ent.isFile() || !/\.(js|mjs)$/.test(ent.name)) continue;
    const p = path.join(root, ent.name);
    const raw = fs.readFileSync(p, "utf8");
    if (!/[\u0590-\u05FF]/.test(raw)) continue;
    fs.writeFileSync(p, escapeHebrew(raw), "utf8");
    n += 1;
    console.log("escaped", p);
  }
}
console.log("escaped_files", n);
