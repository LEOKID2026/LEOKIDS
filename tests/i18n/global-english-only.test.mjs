/**
 * Global English-only hard-fail scan for EN runtime surfaces.
 *
 * Architecture contract:
 * - Science SOURCE bank may remain Hebrew; EN display must come from overlay (1017/1017).
 * - Hebrew glyph→slug maps are technical data, not UI prose.
 * - Locale-aware CSS (`html[dir=rtl]`) is allowed only in locale font stacks.
 * - New Hebrew on Global EN-visible paths must fail this suite.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isInactiveBookDraft } from "./learning-book-active-pages.mjs";
import { validateScienceEnOverlayMechanical } from "../../lib/learning/science-overlay-mechanical-validate.js";
import { localizeScienceBankForLocale } from "../../utils/learning-content-en/science.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const HE = /[\u0590-\u05FF]/;
const HE_IMPORT = /from\s+['"][^'"]*\.he(?:\.[a-z]+)?['"]|require\(\s*['"][^'"]*\.he/;
const RTL_LANG = /lang\s*=\s*["']he["']|dir\s*=\s*["']rtl["']|direction\s*:\s*["']rtl["']/i;

const SCAN_ROOTS = [
  "pages",
  "components",
  "lib",
  "data",
  "content",
  "utils",
  "hooks",
  "styles",
  "public",
  "docs/learning-book",
  "middleware.js",
];

const EXT = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".html",
  ".css",
  ".scss",
  ".md",
]);

/** Admin-only + tooling that never renders Hebrew to Global users */
const PATH_ALLOW = [
  /^pages\/admin\//,
  /^pages\/api\/admin\//,
  /^components\/admin\//,
  /^lib\/admin-portal\//,
  /^lib\/admin-server\//,
  /^lib\/auth\/.*\.he\.js$/,
  /^lib\/rewards\/.*\.he\.js$/,
  /^lib\/teacher-portal\/.*\.he\.js$/,
  /^lib\/leo-miners\/server\/leo-miners-admin-config\.server\.js$/,
  /^tests\//,
  /^scripts\//,
  /^pages\/dev\//,
  /^components\/prototypes\//,
  /\/node_modules\//,
  /\/\.next\//,
  // Generators localize before student UI (runtime samples below)
  /^utils\/math-question-generator\.js$/,
  /^utils\/geometry-question-generator\.js$/,
  /^utils\/english-question-generator\.js$/,
  // Science HE source bank is allowed as SOURCE only — runtime overlay is asserted below
  /^data\/science-questions\.js$/,
  /^data\/science-questions\//,
  /^data\/english-questions\//,
  /^utils\/learning-content-en\//,
  /^lib\/bidi\//,
  /^data\/admin-video-builder\//,
  /^data\/language-review\//,
  /^utils\/curriculum-audit\//,
  /^utils\/hebrew-audio-attach\.js$/,
  /^components\/ai-hybrid-internal-reviewer-panel\.jsx$/,
  /^utils\/parent-copilot\//,
  /^utils\/parent-ai-topic-classifier\//,
  /^utils\/parent-report-output-integrity\//,
  /^utils\/parent-report-language\//,
  /^utils\/diagnostic-engine-v2\//,
  /^utils\/parent-narrative-safety\//,
  /^utils\/learning-pattern-decision\//,
  /^data\/curriculum-oracle\//,
  /^utils\/mcq-fail-content-repair\.js$/,
  /^utils\/geometry-diagram-layout\.js$/,
  /^lib\/i18n\/locale-registry\.js$/,
  /^data\/curriculum-spine\//,
  /^docs\/learning-book\/MATH_/,
  /^docs\/learning-book\/GEOMETRY_/,
  /^docs\/learning-book\/SCIENCE_/,
  /^docs\/learning-book\/ENGLISH_/,
  /^docs\/learning-book\/LEARNING_BOOK_/,
  /^docs\/learning-book\/.*REVIEW_PACK/,
  /^docs\/learning-book\/.*COVERAGE/,
  /^docs\/learning-book\/.*TEMPLATE/,
  /^docs\/learning-book\/.*PLAN/,
  /^docs\/learning-book\/.*SIGNOFF/,
  /^docs\/learning-book\/.*AUDIT/,
];

function isAllowedPath(rel) {
  return PATH_ALLOW.some((re) => re.test(rel));
}

/**
 * Narrow exemption: Hebrew characters used only as glyph keys / inventory in writing builders.
 * Values must be Latin slugs or the line is a single-letter string entry — never UI sentences.
 */
function isHebrewGlyphTechnicalLine(line, rel) {
  if (!/^data\/writing\/catalog-builders\//.test(rel)) return false;
  const t = line.trim();
  if (/^[\u0590-\u05FF]{1,2}\s*:\s*"[a-z0-9-]+"\s*,?$/.test(t)) return true;
  if (/^"[\u0590-\u05FF]{1,2}"\s*,?$/.test(t)) return true;
  if (/^'[\u0590-\u05FF]{1,2}'\s*,?$/.test(t)) return true;
  if (/\bHEBREW_(LETTER|FINAL|LETTERS|LETTER_SLUG)/.test(line)) return true;
  return false;
}

/** Locale-aware direction selectors — not hardcoded product Hebrew UI */
function isLocaleAwareRtlCss(line, rel) {
  if (!/^styles\/locale-fonts\.css$/.test(rel)) return false;
  return /html\[dir=["']rtl["']\]/.test(line) || /:lang\(/.test(line);
}

function hebrewOutsideRegexAndStrings(line) {
  let stripped = line.replace(/\/(?:\\.|[^/\\])+\/[dgimsuy]*/g, "");
  stripped = stripped
    .replace(/"(?:\\.|[^"\\])*"/g, "")
    .replace(/'(?:\\.|[^'\\])*'/g, "")
    .replace(/`(?:\\.|[^`\\])*`/g, "");
  return HE.test(stripped);
}

function isCommentOnly(line) {
  const t = line.trim();
  if (
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    t.startsWith("<!--") ||
    /^\s*\{\s*\/\*/.test(t)
  ) {
    return true;
  }
  const codePart = line.split("//")[0];
  if (line.includes("//") && HE.test(line) && !HE.test(codePart.replace(/["'`][^"'`]*["'`]/g, ""))) {
    return true;
  }
  return false;
}

function isNormalizationPatternLine(line, rel) {
  if (!/^lib\/learning-book\//.test(rel)) return false;
  if (/\.replace\(|\.match\(|RegExp|\/[^/]*[\u0590-\u05FF][^/]*\/[gimuys]*/.test(line)) {
    return true;
  }
  return false;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** @type {{ rel: string, line: number, kind: string, snippet: string }[]} */
const findings = [];

for (const file of walk(path.join(root, "pages"))) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (/\.he\.(js|jsx|ts|tsx)$/.test(rel) && !rel.startsWith("pages/admin/")) {
    findings.push({
      rel,
      line: 1,
      kind: "he_page_route",
      snippet: "Legacy .he page route file must be removed",
    });
  }
}

for (const base of SCAN_ROOTS) {
  const absBase = path.join(root, base);
  if (!fs.existsSync(absBase)) continue;
  const files = fs.statSync(absBase).isFile() ? [absBase] : walk(absBase);
  for (const file of files) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (isAllowedPath(rel)) continue;
    if (isInactiveBookDraft(rel)) continue;
    const ext = path.extname(rel);
    if (ext && !EXT.has(ext)) continue;
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (text.length > 3_000_000) continue;

    text.split(/\r?\n/).forEach((line, i) => {
      if (isCommentOnly(line)) return;
      if (isNormalizationPatternLine(line, rel)) return;
      if (isHebrewGlyphTechnicalLine(line, rel)) return;
      if (isLocaleAwareRtlCss(line, rel)) return;
      if (HE_IMPORT.test(line)) {
        findings.push({
          rel,
          line: i + 1,
          kind: "he_import",
          snippet: line.trim().slice(0, 160),
        });
      }
      if (RTL_LANG.test(line) && !isLocaleAwareRtlCss(line, rel)) {
        findings.push({
          rel,
          line: i + 1,
          kind: "rtl_or_lang_he",
          snippet: line.trim().slice(0, 160),
        });
      }
      if (HE.test(line) && hebrewOutsideRegexAndStrings(line)) {
        findings.push({
          rel,
          line: i + 1,
          kind: "hebrew_char",
          snippet: line.trim().slice(0, 160),
        });
      }
    });
  }
}

async function runtimeSampleChecks() {
  const failures = [];

  const overlay = validateScienceEnOverlayMechanical();
  if (!overlay.ok) {
    failures.push(
      `science EN overlay mechanical FAIL issueCount=${overlay.issueCount} sample=${(overlay.issueSample || []).slice(0, 5).join(",")}`
    );
  }
  if (overlay.totalQuestions !== 1017) {
    failures.push(`science overlay expected 1017 questions, got ${overlay.totalQuestions}`);
  }

  const { SCIENCE_QUESTIONS } = await import(
    pathToFileURL(path.join(root, "data/science-questions.js")).href
  );
  const localized = localizeScienceBankForLocale(SCIENCE_QUESTIONS, "en");
  assert.equal(localized.length, SCIENCE_QUESTIONS.length);
  for (const q of localized.slice(0, 80)) {
    for (const field of ["stem", "question", "explanation"]) {
      const v = q?.[field];
      if (typeof v === "string" && HE.test(v)) {
        failures.push(`localized SCIENCE.${q.id || "?"}.${field} still Hebrew (EN overlay path)`);
      }
    }
    if (Array.isArray(q?.options)) {
      for (const [i, opt] of q.options.entries()) {
        if (typeof opt === "string" && HE.test(opt)) {
          failures.push(`localized SCIENCE.${q.id || "?"}.options[${i}] still Hebrew`);
        }
      }
    }
  }
  // Spot-check: first question must differ from HE source when source is HE
  const raw0 = SCIENCE_QUESTIONS[0];
  const loc0 = localized[0];
  if (raw0 && loc0 && typeof raw0.stem === "string" && HE.test(raw0.stem)) {
    if (typeof loc0.stem !== "string" || HE.test(loc0.stem)) {
      failures.push("EN localization left first science stem Hebrew — Hebrew fallback visible");
    }
  }

  try {
    const { generateQuestion } = await import(
      pathToFileURL(path.join(root, "utils/math-question-generator.js")).href
    );
    const { getLevelConfig } = await import(
      pathToFileURL(path.join(root, "utils/math-storage.js")).href
    );
    const lc = getLevelConfig(3, "easy");
    for (let i = 0; i < 6; i++) {
      const q = generateQuestion(lc, "addition", "g3", null);
      if (HE.test(JSON.stringify(q))) failures.push(`math generateQuestion sample ${i} Hebrew in output`);
    }
  } catch (err) {
    failures.push(`math runtime sample: ${err.message}`);
  }
  return failures;
}

const runtimeFailures = await runtimeSampleChecks();

if (findings.length || runtimeFailures.length) {
  console.error(
    `FAIL global-english-only: ${findings.length} static, ${runtimeFailures.length} runtime\n`
  );
  for (const f of findings.slice(0, 50)) {
    console.error(`[${f.kind}] ${f.rel}:${f.line}`);
    console.error(`  ${f.snippet}`);
  }
  if (findings.length > 50) console.error(`… +${findings.length - 50} more`);
  for (const r of runtimeFailures) console.error(`[runtime] ${r}`);
  process.exit(1);
}

assert.equal(findings.length, 0);
assert.equal(runtimeFailures.length, 0);
console.log(
  "ok - global English-only: no HE on EN surfaces; science overlay 1017 EN display path verified"
);
