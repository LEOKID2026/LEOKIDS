import fs from "node:fs";
import path from "node:path";
import { isInactiveBookDraft } from "./learning-book-active-pages.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const HE = /[\u0590-\u05FF]/;
const PATH_ALLOW = [
  /^pages\/admin\//, /^pages\/api\/admin\//, /^components\/admin\//, /^lib\/admin-portal\//,
  /^lib\/admin-server\//, /^tests\//, /^scripts\//, /^pages\/dev\//, /^components\/prototypes\//,
  /^utils\/math-question-generator/, /^utils\/geometry-question-generator/, /^utils\/english-question-generator/,
  /^data\/science-questions/, /^data\/english-questions\//, /^utils\/learning-content-en\//,
  /^lib\/bidi\//, /^data\/admin-video-builder\//, /^data\/language-review\//, /^utils\/curriculum-audit\//,
  /^utils\/hebrew-audio-attach\.js$/, /^data\/curriculum-spine\//,
  /^docs\/learning-book\/MATH_/, /^docs\/learning-book\/GEOMETRY_/, /^docs\/learning-book\/SCIENCE_/,
  /^docs\/learning-book\/ENGLISH_/, /REVIEW_PACK|COVERAGE|TEMPLATE|PLAN|SIGNOFF|AUDIT/,
];

function walk(d, o = []) {
  if (!fs.existsSync(d)) return o;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, o);
    else o.push(f);
  }
  return o;
}

const counts = {};
for (const base of ["pages", "components", "lib", "data", "utils", "hooks", "public", "docs/learning-book"]) {
  for (const file of walk(path.join(root, base))) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (PATH_ALLOW.some((r) => r.test(rel)) || isInactiveBookDraft(rel)) continue;
    if (!/\.(js|jsx|ts|tsx|mjs|md|json|css)$/.test(rel)) continue;
    if (!HE.test(fs.readFileSync(file, "utf8"))) continue;
    const k = rel.split("/").slice(0, 2).join("/");
    counts[k] = (counts[k] || 0) + 1;
  }
}
Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log(v, k));
