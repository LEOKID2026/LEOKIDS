import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HE = /[\u0590-\u05FF]/;
const ALLOW = new RegExp(
  String.raw`(^|[/\\])(admin|dev|prototypes|prototype)([/\\]|$)|[/\\]admin-[^/\\]+|admin-ui\.he\.|admin-analytics|admin-video|admin-portal|admin-server|teacher-ui\.he\.|teacher-activity-report-pdf-he|/lib/auth/[^/]+\.he\.js$`,
  "i"
);
const SCAN_ROOTS = ["data", "utils", "lib", "pages", "components", "content-packs", "locales", "hooks"];
const SKIP = new Set(["node_modules", ".next", "exports", "docs", "curriculum-oracle", "language-review"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(p, out);
      continue;
    }
    if (!/\.(js|mjs|cjs|jsx|ts|tsx|json)$/i.test(ent.name)) continue;
    out.push(path.relative(ROOT, p).replace(/\\/g, "/"));
  }
  return out;
}

const offenders = [];
for (const root of SCAN_ROOTS) {
  for (const rel of walk(path.join(ROOT, root))) {
    if (ALLOW.test(rel)) continue;
    if (HE.test(fs.readFileSync(path.join(ROOT, rel), "utf8"))) offenders.push(rel);
  }
}
console.log("product_offenders", offenders.length);
if (offenders.length) console.log(offenders.slice(0, 50).join("\n"));

const critical = [
  "utils/parent-copilot/stage-a-freeform-interpretation.js",
  "utils/parent-copilot/question-classifier.js",
  "utils/parent-report-language/parent-facing-normalize.js",
  "utils/parent-report-language/forbidden-terms.js",
  "utils/parent-copilot/conversational-reply-class.js",
  "utils/parent-copilot/semantic-question-class.js",
  "utils/parent-copilot/guardrail-validator.js",
  "utils/parent-copilot/index.js",
  "utils/parent-copilot/pattern-answer-composers.js",
  "utils/parent-copilot/report-row-resolver.js",
  "utils/learning-pattern-decision/parent-pattern-label.js",
  "utils/math-storage.js",
  "utils/student-question-stem-sanitizer.js",
  "utils/student-question-display.js",
  "utils/geometry-activity-question-stem.js",
  "utils/math-time-tracking.js",
  "utils/learning-content-en/science-translate.js",
  "lib/learning-book/learning-book-sequence-meta.js",
  "lib/learning-book/geometry-diagram-page-map.js",
  "hooks/useArcadeBingoSession.js",
  "lib/learning/learning-time-credit-policy.js",
  "lib/classroom-activities/classroom-skill-labels.js",
  "utils/parent-narrative-safety/parent-narrative-safety-contract.js",
  "utils/parent-narrative-safety/parent-narrative-safety-fixtures.js",
  "utils/parent-narrative-safety/parent-narrative-safety-guard.js",
  "utils/parent-narrative-safety/parent-report-text-extractor.js",
  "data/curriculum-spine/v1/skills.json",
  "data/coloring/coloring-pages-catalog.json",
  "data/coloring/reward-cards-source-catalog.json",
];

for (const f of critical) {
  const t = fs.readFileSync(path.join(ROOT, f), "utf8");
  console.log(HE.test(t) ? "HE" : "OK", f);
}

// node --check on changed js under utils/lib/hooks that we care about
const checkRoots = ["utils", "lib", "hooks"];
let fail = 0;
let checked = 0;
for (const root of checkRoots) {
  for (const rel of walk(path.join(ROOT, root))) {
    if (!/\.(js|mjs|cjs)$/i.test(rel)) continue;
    if (ALLOW.test(rel)) continue;
    // Only check files that still parse interest — sample all product JS that had HE historically by checking all
    const r = spawnSync(process.execPath, ["--check", path.join(ROOT, rel)], { encoding: "utf8" });
    checked++;
    if (r.status !== 0) {
      fail++;
      console.log("SYNTAX_FAIL", rel);
      console.log(r.stderr || r.stdout);
      if (fail >= 25) break;
    }
  }
  if (fail >= 25) break;
}
console.log("syntax_checked", checked, "syntax_fail", fail);

// allowlisted auth still may have HE
const authHe = "lib/auth/auth-registration.js";
console.log(
  "auth-registration.js HE (allowlisted):",
  HE.test(fs.readFileSync(path.join(ROOT, authHe), "utf8"))
);
