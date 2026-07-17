import fs from "node:fs";
import path from "node:path";
import { isInactiveBookDraft } from "./learning-book-active-pages.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const HE = /[\u0590-\u05FF]/;
const HE_IMPORT = /from\s+['"][^'"]*\.he(?:\.[a-z]+)?['"]|require\(\s*['"][^'"]*\.he/;
const RTL_LANG = /lang\s*=\s*["']he["']|dir\s*=\s*["']rtl["']|direction\s*:\s*["']rtl["']/i;
const PATH_ALLOW = [/^pages\/admin\//, /^pages\/api\/admin\//, /^components\/admin\//, /^lib\/admin-portal\//, /^lib\/admin-server\//, /^tests\//, /^scripts\//, /^pages\/dev\//, /^components\/prototypes\//, /^utils\/math-question-generator/, /^utils\/geometry-question-generator/, /^utils\/english-question-generator/, /^data\/science-questions/, /^data\/english-questions\//, /^utils\/learning-content-en\//, /^lib\/bidi\//, /^data\/admin-video-builder\//, /^data\/language-review\//, /^utils\/curriculum-audit\//, /^utils\/hebrew-audio-attach\.js$/, /^components\/ai-hybrid-internal-reviewer-panel\.jsx$/, /^utils\/parent-copilot\//, /^utils\/parent-ai-topic-classifier\//, /^utils\/parent-report-output-integrity\//, /^utils\/parent-report-language\//, /^utils\/diagnostic-engine-v2\//, /^utils\/parent-narrative-safety\//, /^utils\/learning-pattern-decision\//, /^data\/curriculum-oracle\//, /^lib\/i18n\/locale-registry\.js$/, /^data\/curriculum-spine\//, /^docs\/learning-book\/MATH_/, /^docs\/learning-book\/GEOMETRY_/, /^docs\/learning-book\/SCIENCE_/, /^docs\/learning-book\/ENGLISH_/, /REVIEW_PACK|COVERAGE|TEMPLATE|PLAN|SIGNOFF|AUDIT/];

function hebrewOutsideRegexAndStrings(line) {
  let stripped = line.replace(/\/(?:\\.|[^/\\])+\/[dgimsuy]*/g, "");
  stripped = stripped.replace(/"(?:\\.|[^"\\])*"/g, "").replace(/'(?:\\.|[^'\\])*'/g, "").replace(/`(?:\\.|[^`\\])*`/g, "");
  return HE.test(stripped);
}
function isCommentOnly(line) {
  const t = line.trim();
  if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("<!--")) return true;
  const codePart = line.split("//")[0];
  if (line.includes("//") && HE.test(line) && !HE.test(codePart.replace(/["'`][^"'`]*["'`]/g, ""))) return true;
  return false;
}
function isNormalizationPatternLine(line, rel) {
  if (!/^lib\/learning-book\//.test(rel)) return false;
  return /\.replace\(|\.match\(|RegExp|\/[^/]*[\u0590-\u05FF]/.test(line);
}
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
const fileCounts = {};
for (const base of ["pages", "components", "lib", "data", "utils", "hooks", "public", "docs/learning-book", "middleware.js"]) {
  const files = base === "middleware.js" && fs.existsSync(path.join(root, base)) ? [path.join(root, base)] : walk(path.join(root, base));
  for (const file of files) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (PATH_ALLOW.some((r) => r.test(rel)) || isInactiveBookDraft(rel)) continue;
    if (!/\.(js|jsx|ts|tsx|mjs|cjs|json|md|css|html)$/.test(rel)) continue;
    const text = fs.readFileSync(file, "utf8");
    let n = 0;
    text.split(/\r?\n/).forEach((line) => {
      if (isCommentOnly(line) || isNormalizationPatternLine(line, rel)) return;
      if (HE_IMPORT.test(line) || RTL_LANG.test(line)) n++;
      else if (HE.test(line) && hebrewOutsideRegexAndStrings(line)) n++;
    });
    if (n) fileCounts[rel] = n;
  }
}
const sorted = Object.entries(fileCounts).sort((a, b) => b[1] - a[1]);
console.log("files", sorted.length, "lines", sorted.reduce((s, [, n]) => s + n, 0));
sorted.slice(0, 30).forEach(([f, n]) => console.log(n, f));
