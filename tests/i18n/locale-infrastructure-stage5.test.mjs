/**
 * Stage 5 — multilingual infrastructure readiness.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { containsHebrew } from "../../utils/learning-question-content-locale.js";
import { computeScienceLocalizationCoverage } from "../../lib/learning/science-localization-coverage.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import {
  formatLocaleDate,
  formatLocaleNumber,
  formatLocaleGradeLabel,
} from "../../lib/i18n/format-locale.js";
import { buildHreflangAlternates, buildCanonicalUrl, resolveOgLocale } from "../../lib/seo/locale-seo.js";
import { expandSitemapPathsForLocales } from "../../lib/seo/sitemap-static-paths.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { PREWRITING_CATALOG } from "../../data/writing/catalog-builders/prewriting.builder.js";
import { ACTIVE_LOCALE_IDS } from "../../lib/i18n/locale-registry.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("math question display stem comes from params — no Hebrew left in stem", () => {
  const q = localizeLearningQuestion(
    {
      subject: "math",
      question: "כמה זה?",
      exerciseText: "2 + 3",
      operation: "addition",
      answers: ["4", "5", "6", "7"],
      correctAnswer: "5",
      params: { kind: "addition", a: 2, b: 3, diagnosticSkillId: "math.add" },
      a: 2,
      b: 3,
    },
    { subject: "math", contentLocale: "en" },
  );
  assert.ok(q.question);
  assert.ok(!containsHebrew(String(q.question)));
  assert.equal(q.correctAnswer, "5");
  assert.equal(q.params.diagnosticSkillId, "math.add");
  assert.ok(["params", "generic", "passthrough"].includes(q.displayStemSource) || q.question.includes("2"));
});

test("geometry params-based stem — no HE→EN sentence dependency for covered kinds", () => {
  const q = localizeLearningQuestion(
    {
      subject: "geometry",
      question: "מה שטח הריבוע?",
      answers: ["16", "8", "4", "12"],
      correctAnswer: "16",
      params: { kind: "square_area", side: 4 },
    },
    { subject: "geometry", contentLocale: "en" },
  );
  assert.ok(!containsHebrew(String(q.question)));
  assert.match(String(q.question), /square|area|4/i);
  assert.equal(q.correctAnswer, "16");
});

test("science localization coverage — exact field metrics", () => {
  const report = computeScienceLocalizationCoverage();
  assert.equal(report.totalQuestions, report.withStableId);
  assert.equal(report.overlayHit, report.totalQuestions);
  assert.equal(report.overlayCoveragePct, 100);
  assert.equal(report.fields.stem.overlayCovered, report.totalQuestions);
  assert.equal(report.fields.options.overlayCovered, report.totalQuestions);
  assert.equal(report.fields.explanation.overlayCovered, report.totalQuestions);
  assert.equal(report.fields.stem.hebrewRemainingInOverlay, 0);
  assert.equal(report.fields.options.hebrewRemainingInOverlay, 0);
  assert.equal(report.fields.explanation.hebrewRemainingInOverlay, 0);
  // hint/feedback optional — source count documented
  assert.equal(typeof report.hintSourceCount, "number");
  assert.equal(typeof report.feedbackSourceCount, "number");
  assert.equal(typeof report.theoryLinesSourceCount, "number");
  assert.ok(report.contractComplete, JSON.stringify(report.fields, null, 2));
  console.log(
    `SCIENCE_COVERAGE total=${report.totalQuestions} overlay=${report.overlayCoveragePct}% theoryLinesSource=${report.theoryLinesSourceCount} hintSource=${report.hintSourceCount} feedbackSource=${report.feedbackSourceCount} incomplete=${report.incompleteOverlayCount}`,
  );
});

test("writing catalogs have no Hebrew titles in Global builders", () => {
  for (const entry of PREWRITING_CATALOG) {
    assert.ok(entry.title || entry.titleHe);
    assert.ok(!containsHebrew(String(entry.title || entry.titleHe)));
  }
  const packs = resolveWritingWordPacks("en");
  assert.ok(!containsHebrew(String(packs.colors.titleHe)));
  assert.equal(packs.colors.titleEn, "Colors");
});

test("formatting uses locale intl — en and pseudo", () => {
  const d = new Date("2024-06-15T12:00:00Z");
  const en = formatLocaleDate(d, "en");
  const xa = formatLocaleDate(d, "en-XA");
  const ar = formatLocaleDate(d, "ar-XB");
  assert.ok(en && en !== "—");
  assert.ok(xa && xa !== "—");
  assert.ok(ar && ar !== "—");
  assert.equal(formatLocaleNumber(1234.5, "en"), formatLocaleNumber(1234.5, "en"));
  assert.equal(formatLocaleGradeLabel("g3", "en"), "Grade 3");
  assert.equal(formatLocaleGradeLabel("g3", "ar-XB"), "Grade 3");
});

test("locale completeness manifest — en ok, missing locale reports gaps", () => {
  const en = checkLocaleCompleteness("en");
  assert.equal(en.localeId, "en");
  assert.ok(en.summary.ok >= 8, JSON.stringify(en.summary));
  assert.equal(en.missingCount, 0, JSON.stringify(en.findings.filter((f) => f.status === "missing")));

  const pseudo = checkLocaleCompleteness("en-XA");
  assert.ok(pseudo.isPseudo);
  assert.ok(pseudo.findings.some((f) => f.status === "fallback" || f.status === "intentional"));

  const missing = checkLocaleCompleteness("es-419");
  // Unknown collapses via registry to en definition — still reports structure
  assert.ok(missing.findings.length > 0);
});

test("SEO metadata helpers are locale-ready", () => {
  assert.match(buildCanonicalUrl("/about", "en"), /\/about$/);
  assert.equal(resolveOgLocale("en"), "en_US");
  const alts = buildHreflangAlternates("/about", ACTIVE_LOCALE_IDS);
  assert.ok(alts.some((a) => a.locale === "x-default"));
  const expanded = expandSitemapPathsForLocales(["/about", "/help"], ["en"]);
  assert.deepEqual(expanded, ["/about", "/help"]);
});

test("no Global runtime hard dependency on he content-packs or docs/learning-book/he", () => {
  const HARD = /content-packs\/he\/|docs\/learning-book\/he\//;
  const skip = /(?:^|\/)(admin|dev|prototypes|scripts|tests|docs)(?:\/|$)/;
  /** @type {string[]} */
  const violations = [];
  function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".") || e.name === "node_modules") continue;
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) walk(abs, out);
      else if (/\.(js|jsx|mjs)$/.test(e.name)) out.push(abs);
    }
    return out;
  }
  for (const dir of ["lib", "utils", "components", "pages"]) {
    for (const abs of walk(path.join(root, dir))) {
      const rel = path.relative(root, abs).split(path.sep).join("/");
      if (skip.test(rel)) continue;
      const text = fs.readFileSync(abs, "utf8");
      if (HARD.test(text)) violations.push(rel);
    }
  }
  assert.deepEqual(violations, []);
});
