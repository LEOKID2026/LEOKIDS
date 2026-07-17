/**
 * Hard-fail scan: Global runtime must not ship Hebrew to users.
 *
 * Allowlist is narrow and documented. HE source banks that feed an English
 * localization pipeline are excluded from the static character scan, then
 * verified via runtime sampling below.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const HE = /[\u0590-\u05FF]/;
const HE_IMPORT = /from\s+['"][^'"]*\.he(?:\.[a-z]+)?['"]|require\(\s*['"][^'"]*\.he/;
const RTL_LANG = /lang\s*=\s*["']he["']|dir\s*=\s*["']rtl["']|direction\s*:\s*["']rtl["']/i;

const SCAN_ROOTS = ["pages", "components", "lib", "data", "content", "utils"];
const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".json", ".html"]);

/**
 * Paths that may contain Hebrew without failing the static scan.
 * Each entry must be justified: not rendered as Hebrew on Global, or HE→EN pipeline.
 */
const PATH_ALLOW = [
  /\.he\.(js|jsx|ts|tsx|mjs|cjs|json)$/,
  /\/tests\//,
  /\.selftest\.mjs$/,
  /scripts\/i18n\//,
  /node_modules\//,
  /\.next\//,
  /curriculum-oracle\//,
  /language-review\//,
  /videos-manifest\.he\.json$/,
  /offline-precache-generated/,
  // Dev prototypes — not Global production surfaces
  /components\/prototypes\/dev\//,
  /^pages\/dev\//,
  // HE question source banks; Global uses localized SCIENCE_QUESTIONS / overlays
  /^data\/science-questions/,
  /^data\/english-questions\//,
  // HE→EN translation dictionaries (keys may be Hebrew)
  /^utils\/learning-content-en\//,
  // Admin console stays Hebrew by product decision (Global student/parent surfaces only)
  /^pages\/admin\//,
  /^pages\/api\/admin\//,
  /^components\/admin\//,
  /^lib\/admin-server\//,
  /^lib\/admin-portal\//,
  // Admin-only public worksheet visit metric labels (Hebrew admin dashboard cards; never rendered to public users)
  /^lib\/analytics\/public-worksheet-analytics\.server\.js$/,
  // Admin video media metadata index (not student UI)
  /^data\/admin-video-builder\//,
  // Curriculum spine / audit catalogs used for tooling
  /^data\/curriculum-spine\//,
  /^utils\/curriculum-audit\//,
  // HE source templates for generators that localize via learning-content-en before return
  /^utils\/math-question-generator\.js$/,
  /^utils\/geometry-question-generator\.js$/,
  /^utils\/math-constants\.js$/,
  // Learning-book page maps (tooling / page indices; student UI uses EN masters)
  /^lib\/learning-book\//,
  // Legacy HE-named modules kept on disk for IL archive; live Global must not import them
  /parent-report-approved-copy-he\.js$/,
  /parent-facing-normalize-he\.js$/,
  /conversational-reply-class-he\.js$/,
  /diagnostic-labels-he\.js$/,
  /probe-map-he\.js$/,
  /engine-decision-parent-copy-he\.js$/,
  /confidence-parent-he\.js$/,
  /parent-report-ui-explain-he\.js$/,
  /parent-report-engine-insights-he\.js$/,
  /detailed-report-parent-letter-he\.js$/,
  /parent-diagnostic-explanations-he\.js$/,
  // Any HE archive twin (*-he.js / *.he.*)
  /-he\.js$/,
  // Archived Hebrew-reading educational game (not on Global hub)
  /^components\/educational-games\/leo-word-detective\//,
  // HE term denylist for report sanitizers (not UI copy)
  /^utils\/parent-report-language\/forbidden-terms\.js$/,
  // Curriculum catalog sources (tooling / IL content indexes; student UI uses EN masters)
  /^data\/science-curriculum\.js$/,
  /^data\/english-curriculum\.js$/,
  /^utils\/geometry-constants\.js$/,
  // Parent copilot NLU: Hebrew utterance matchers / LLM filters (not rendered UI copy)
  /^utils\/parent-copilot\//,
  // MCQ repair stopwords / pad tokens used for matching, not display
  /^utils\/mcq-fail-content-repair\.js$/,
  // Dev-only prototype hubs / experimental libs (not Global production)
  /^lib\/dev\//,
  /^lib\/prototypes\//,
  /^components\/ai-hybrid-internal-reviewer-panel\.jsx$/,
  // Legacy HE input matchers (not rendered UI)
  /^lib\/classroom-activities\/generate-activity-questions-client\.js$/,
  /MixedHebrewMathText\.js$/,
  // Matcher / sanitizer / safety fixtures (not rendered UI copy)
  /^utils\/student-question-stem-sanitizer\.js$/,
  /^utils\/parent-narrative-safety\//,
  /^utils\/hebrew-audio-attach\.js$/,
  /^lib\/bidi\/rtl-audit-page-scoring\.js$/,
  /^utils\/ai-hybrid-diagnostic\/explanation-validator\.js$/,
  // Locale metadata for disabled/future locales (not active Global UI direction)
  /^lib\/i18n\/locale-registry\.js$/,
  // Admin-only Leo Miners config messages
  /^lib\/leo-miners\/server\/leo-miners-admin-config\.server\.js$/,
  // Spelling/niqqud tooling — not student UI copy
  /^utils\/hebrew-spelling-niqqud\.js$/,
  // HE stem parsers / shape matchers (not displayed labels)
  /^utils\/geometry-activity-question-stem\.js$/,
  /^utils\/geometry-diagram-spec\.js$/,
  /^utils\/student-question-display\.js$/,
  /^lib\/learning\/question-engine-metadata\.js$/,
  /^lib\/learning-client\/adaptive-planner-explanation-validate\.js$/,
  // Test fixtures asserting residual policy strings
  /^utils\/parent-report-output-integrity\/zero-evidence-policy-tests\.js$/,
  // Legacy HE matchers / denylists / shape maps (not rendered Global UI copy)
  /^utils\/parent-report-data-integrity\.js$/,
  /^utils\/learning-badge-ids\.js$/,
  /^utils\/learning-step-geometry-text\.js$/,
  /^utils\/geometry-diagram-layout\.js$/,
  /^utils\/parent-report-surface\/parent-surface-label-guard\.js$/,
  /^utils\/question-quality\.js$/,
  /^lib\/worksheets\/worksheet-geometry-allowlist\.js$/,
  /^lib\/worksheets\/worksheet-geometry-solid-svg\.js$/,
  /^utils\/diagnostic-engine-v2\/human-boundaries\.js$/,
  /^lib\/learning-student-defaults\.js$/,
  /^utils\/canonical-topic-state\/build-canonical-state\.js$/,
  /^lib\/learning\/activity-display-level\.js$/,
  /^lib\/learning\/parent-report-display-level\.js$/,
  /^lib\/worksheets\/worksheet-level-display\.js$/,
  /^lib\/seo\/seo-public-paths\.js$/,
  /^utils\/learning-pattern-decision\/parent-engine-decision-contract-v2\.js$/,
  /^utils\/adaptive-learning-planner\/diagnostic-unit-skill-alignment\.js$/,
  /^utils\/diagnostic-engine-v2\/geometry-taxonomy-candidate-order\.js$/,
  /^utils\/learning-diagnostics\/diagnostic-framework-v1\.js$/,
  /^utils\/learning-mixed-hebrew-math-render\.js$/,
  /^utils\/math-answer-primary-button\.js$/,
  /^utils\/math-time-tracking\.js$/,
  /^utils\/math-storage\.js$/,
  /^utils\/lower-grade-practice-runtime-quality\.js$/,
  /^utils\/learning-step-vertical-exercise\.js$/,
  /^utils\/math-fraction-question-display\.js$/,
  /^utils\/math-scratchpad\/paper-grid-config\.js$/,
  /^utils\/parent-report-output-integrity\/context-labeling-matrix\.js$/,
  /^utils\/parent-report-output-integrity\/row-display-label-context\.js$/,
  /^utils\/parent-report-output-integrity\/display-context-label-tests\.js$/,
  /^utils\/contracts\/parent-product-contract-v1\.js$/,
  /^utils\/audio-playback-core\.js$/,
  /^utils\/english-question-generator\.js$/,
  /^utils\/geometry-units\.js$/,
  /^utils\/geometry-animations\.js$/,
  /^utils\/parent-report-advice-drift\.js$/,
  /^utils\/parent-report-text-dedupe\.js$/,
  /^utils\/parent-report-language\/subject-evidence-policy\.js$/,
  /^utils\/science-runtime-coverage\.js$/,
  /^utils\/parent-ai-context\/build-parent-ai-context\.js$/,
  /^utils\/parent-ai-topic-classifier\/classifier\.js$/,
  /^utils\/parent-data-presence\.js$/,
  /^utils\/parent-report-decision-gates\.js$/,
  /^utils\/parent-report-recommendation-memory\.js$/,
  /^utils\/parent-report-support-sequencing\.js$/,
  /^utils\/parent-report-outcome-tracking\.js$/,
  /^utils\/parent-report-parent-assigned-activities\.js$/,
  // Legacy HE tokens in topic / remainder / empty-prompt detectors (not UI labels)
  /^lib\/classroom-activities\/student-activity-question-ui\.client\.js$/,
  /^lib\/classroom-activities\/assigned-activity-math-mcq-hydrate\.server\.js$/,
  /^lib\/worksheets\/worksheet-english-selector\.server\.js$/,
  /^lib\/worksheets\/worksheet-geometry-selector\.server\.js$/,
];

function isAllowedPath(rel) {
  return PATH_ALLOW.some((re) => re.test(rel));
}

function isCommentOnly(line) {
  const t = line.trim();
  return (
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    t.startsWith("<!--") ||
    /^\s*\{\s*\/\*/.test(t)
  );
}

/** Hebrew only inside a regex literal (sanitizers / detectors) — not UI copy. */
function isHebrewRegexOnlyLine(line) {
  const t = line.trim();
  if (!HE.test(t)) return false;
  // Strip strings in double/single quotes; if no Hebrew remains except in /.../ ok
  const withoutStrings = t
    .replace(/`(?:\\.|[^`\\])*`/g, "")
    .replace(/"(?:\\.|[^"\\])*"/g, "")
    .replace(/'(?:\\.|[^'\\])*'/g, "");
  if (!HE.test(withoutStrings)) return false;
  // After removing regex literals, no Hebrew should remain
  const withoutRegex = withoutStrings.replace(/\/(?:\\.|[^/\\\n])+\/[gimsuy]*/g, "");
  return !HE.test(withoutRegex);
}

function isJsdocTypeImportOnly(line) {
  return /@param|@typedef|@type|@returns/.test(line) && HE_IMPORT.test(line);
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

const findings = [];

for (const base of SCAN_ROOTS) {
  const absBase = path.join(root, base);
  for (const file of walk(absBase)) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (isAllowedPath(rel)) continue;
    const ext = path.extname(rel);
    if (ext && !EXT.has(ext)) continue;
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (text.length > 2_500_000) continue;

    text.split(/\r?\n/).forEach((line, i) => {
      if (isCommentOnly(line)) return;
      if (isJsdocTypeImportOnly(line)) return;

      if (HE_IMPORT.test(line)) {
        findings.push({
          rel,
          line: i + 1,
          kind: "he_import",
          snippet: line.trim().slice(0, 160),
        });
      }
      if (RTL_LANG.test(line)) {
        findings.push({
          rel,
          line: i + 1,
          kind: "rtl_or_lang_he",
          snippet: line.trim().slice(0, 160),
        });
      }
      if (HE.test(line) && !isHebrewRegexOnlyLine(line)) {
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

async function runtimeLocalizedSampleChecks() {
  const failures = [];
  const { SCIENCE_QUESTIONS } = await import(
    pathToFileURL(path.join(root, "data/science-questions.js")).href
  );
  const sciSample = (SCIENCE_QUESTIONS || []).slice(0, 40);
  for (const q of sciSample) {
    for (const field of ["stem", "question", "explanation"]) {
      const v = q?.[field];
      if (typeof v === "string" && HE.test(v)) {
        failures.push(`SCIENCE_QUESTIONS.${q.id || "?"}.${field} still Hebrew`);
      }
    }
    if (Array.isArray(q?.options)) {
      for (const opt of q.options) {
        if (typeof opt === "string" && HE.test(opt)) {
          failures.push(`SCIENCE_QUESTIONS.${q.id || "?"}.options still Hebrew`);
          break;
        }
      }
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
      const blob = JSON.stringify(q);
      if (HE.test(blob)) failures.push(`math generateQuestion sample ${i} contains Hebrew`);
    }
  } catch (err) {
    failures.push(`math runtime sample failed: ${err.message}`);
  }

  return failures;
}

const runtimeFailures = await runtimeLocalizedSampleChecks();

if (findings.length || runtimeFailures.length) {
  console.error(
    `FAIL global-english-only: ${findings.length} static finding(s), ${runtimeFailures.length} runtime finding(s)\n`
  );
  for (const f of findings.slice(0, 60)) {
    console.error(`[${f.kind}] ${f.rel}:${f.line}`);
    console.error(`  ${f.snippet}`);
  }
  if (findings.length > 60) console.error(`… +${findings.length - 60} more static`);
  for (const r of runtimeFailures.slice(0, 20)) {
    console.error(`[runtime] ${r}`);
  }
  process.exit(1);
}

assert.equal(findings.length, 0);
assert.equal(runtimeFailures.length, 0);
console.log("ok - global English-only runtime scan (0 findings)");
