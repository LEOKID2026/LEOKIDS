/**
 * Stage 4 — learning content locale readiness (question banks, books, english subject).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveContentLocale } from "../../lib/content/locale.js";
import { resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
import {
  localizeQuestionForContentLocale,
  localizeScienceQuestionsForContentLocale,
  resolveLearningInstructionLocale,
  resolveLearningQuestionContentLocale,
} from "../../lib/learning/question-content-locale.js";
import { loadMathG1Page } from "../../lib/learning-book/load-math-g1-pages.js";
import { createLearningBookPageLoader } from "../../lib/learning-book/load-learning-book-pages.js";
import { getLearningBookEntry } from "../../lib/learning-book/learning-book-catalog.js";
import {
  MATH_G1_BOOK_BATCHES,
  MATH_G1_PAGE_ORDER,
  MATH_G1_BOOK_META,
  getMathG1PageNeighbors,
  isValidMathG1PageId,
} from "../../lib/learning-book/math-g1-registry.js";
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { containsHebrew } from "../../utils/learning-question-content-locale.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("math question localizes via content locale path (en)", () => {
  const raw = {
    subject: "math",
    question: "  2 + 2?",
    answers: ["3", "4", "5", "6"],
    correctAnswer: "4",
    params: { kind: "addition", diagnosticSkillId: "math.addition" },
  };
  const localized = localizeQuestionForContentLocale(raw, {
    subject: "math",
    contentLocale: "en",
  });
  assert.ok(localized);
  assert.equal(localized.correctAnswer, "4");
  assert.equal(localized.params?.diagnosticSkillId, "math.addition");
  assert.ok(!containsHebrew(String(localized.question || "")));
});

test("es-419 science uses locale overlay (not English fallback)", () => {
  const raw = {
    subject: "science",
    id: SCIENCE_QUESTIONS[0]?.id,
    stem: SCIENCE_QUESTIONS[0]?.stem || "",
    options: SCIENCE_QUESTIONS[0]?.options || ["", ""],
    correctIndex: SCIENCE_QUESTIONS[0]?.correctIndex ?? 0,
    params: SCIENCE_QUESTIONS[0]?.params || { diagnosticSkillId: "science.test" },
  };
  const viaEs = localizeLearningQuestion(raw, {
    subject: "science",
    contentLocale: "es-419",
  });
  const viaEn = localizeLearningQuestion(raw, {
    subject: "science",
    contentLocale: "en",
  });
  assert.notEqual(viaEs.stem || viaEs.question, viaEn.stem || viaEn.question);
  assert.match(String(viaEs.stem || viaEs.question), /[áéíóúñ¿¡]/i);
  assert.equal(viaEs.params?.diagnosticSkillId, viaEn.params?.diagnosticSkillId);
});

test("unknown content locale falls back to English display layer for science", () => {
  const raw = {
    subject: "science",
    id: SCIENCE_QUESTIONS[0]?.id,
    stem: SCIENCE_QUESTIONS[0]?.stem || "",
    options: SCIENCE_QUESTIONS[0]?.options || ["", ""],
    correctIndex: SCIENCE_QUESTIONS[0]?.correctIndex ?? 0,
    params: SCIENCE_QUESTIONS[0]?.params || { diagnosticSkillId: "science.test" },
  };
  // Unregistered / disabled tags collapse to en (fr-FR is a live product locale).
  const viaUnknown = localizeLearningQuestion(raw, {
    subject: "science",
    contentLocale: "xx-YY",
  });
  const viaEn = localizeLearningQuestion(raw, {
    subject: "science",
    contentLocale: "en",
  });
  assert.deepEqual(viaUnknown.stem || viaUnknown.question, viaEn.stem || viaEn.question);
  assert.equal(viaUnknown.params?.diagnosticSkillId, viaEn.params?.diagnosticSkillId);
});

test("science bank localization preserves stable ids and diagnostic params", () => {
  const sample = SCIENCE_QUESTIONS.slice(0, 5);
  const localized = localizeScienceQuestionsForContentLocale(sample, "en");
  assert.equal(localized.length, sample.length);
  for (let i = 0; i < sample.length; i += 1) {
    assert.equal(localized[i].id, sample[i].id);
    assert.equal(localized[i].topic, sample[i].topic);
    assert.deepEqual(localized[i].grades, sample[i].grades);
    if (sample[i].params?.diagnosticSkillId) {
      assert.equal(localized[i].params.diagnosticSkillId, sample[i].params.diagnosticSkillId);
    }
  }
});

test("learning book loads via content locale drafts dir (en tree preferred)", () => {
  const draftsRel = resolveLearningBookDraftsDir("en", "math", "g1");
  assert.match(draftsRel.replace(/\\/g, "/"), /docs\/learning-book\/en\/math\/g1\/drafts/);

  const page = loadMathG1Page("ns_counting_forward", { contentLocale: "en" });
  assert.ok(page);
  assert.equal(page.pageId, "ns_counting_forward");

  const loader = createLearningBookPageLoader(
    {
      batches: MATH_G1_BOOK_BATCHES,
      pageOrder: MATH_G1_PAGE_ORDER,
      meta: MATH_G1_BOOK_META,
      getPageNeighbors: getMathG1PageNeighbors,
      isValidPageId: isValidMathG1PageId,
    },
    { contentLocale: "en" },
  );
  assert.match(String(loader.draftsDir).replace(/\\/g, "/"), /\/en\/math\/g1\/drafts/);
});

test("learning book es-419 drafts dir resolves when tree exists", () => {
  const draftsRel = resolveLearningBookDraftsDir("es-419", "math", "g1");
  // es-419 tree may be absent; authoritative fallback is English locale tree.
  const normalized = draftsRel.replace(/\\/g, "/");
  assert.ok(
    /docs\/learning-book\/es-419\/math\/g1\/drafts/.test(normalized) ||
      /docs\/learning-book\/en\/math\/g1\/drafts/.test(normalized),
    `unexpected drafts dir: ${normalized}`,
  );
  const page = loadMathG1Page("ns_counting_forward", { contentLocale: "es-419" });
  assert.ok(page);
  assert.equal(page.pageId, "ns_counting_forward");
});

test("English subject: learning content locale forced to en; instructions resolvable separately", () => {
  assert.equal(
    resolveLearningQuestionContentLocale({
      subject: "english",
      interfaceLocale: "ar-XB",
    }),
    "en",
  );
  assert.equal(
    resolveContentLocale({ subject: "english", interfaceLocale: "en-XA" }),
    "en",
  );

  const instructionLocaleEn = resolveLearningInstructionLocale({
    interfaceLocale: "en",
    subject: "english",
  });
  assert.equal(instructionLocaleEn, "en");

  const instructionLocaleEs = resolveLearningInstructionLocale({
    instructionLocale: "es-419",
    subject: "english",
  });
  assert.equal(instructionLocaleEs, "es-419");

  const baseQuestion = {
    subject: "english",
    question: "Choose the correct English sentence.",
    answers: ["I am happy.", "I is happy."],
    correctAnswer: "I am happy.",
    explanation: " I  -am.",
    explanationByLocale: {
      en: "With I we use am.",
      "es-419": "Con I usamos am.",
    },
    params: { topic: "grammar", patternFamily: "grammar_be" },
  };

  const qEn = localizeLearningQuestion(baseQuestion, {
    subject: "english",
    contentLocale: "en",
    instructionLocale: "en",
  });
  assert.equal(qEn.correctAnswer, "I am happy.");
  assert.ok(String(qEn.answers[0]).includes("I am"));
  assert.equal(qEn.explanation, "With I we use am.");
  assert.ok(!containsHebrew(String(qEn.explanation || "")));

  const qEs = localizeLearningQuestion(baseQuestion, {
    subject: "english",
    contentLocale: "en",
    instructionLocale: "es-419",
  });
  assert.equal(qEs.correctAnswer, "I am happy.");
  assert.ok(String(qEs.answers[0]).includes("I am"));
  assert.equal(qEs.explanation, "Con I usamos am.");
  assert.ok(!containsHebrew(String(qEs.explanation || "")));

  const qHeFallback = localizeLearningQuestion(baseQuestion, {
    subject: "english",
    contentLocale: "en",
    instructionLocale: "he",
  });
  assert.equal(qHeFallback.correctAnswer, "I am happy.");
  assert.equal(qHeFallback.explanation, "With I we use am.");
  assert.ok(!containsHebrew(String(qHeFallback.explanation || "")));
});

test("runtime book TOC loads for master locales without throwing (no HTTP 500 contract)", () => {
  const subjects = ["math", "geometry", "science", "english"];
  const grades = ["g1", "g2", "g3", "g4", "g5", "g6"];
  const locales = ["en", "ar-001", "id-ID", "es-419", "pt-BR"];
  /** @type {string[]} */
  const failures = [];
  for (const subject of subjects) {
    for (const grade of grades) {
      const entry = getLearningBookEntry(subject, grade);
      if (!entry) {
        failures.push(`missing catalog entry ${subject}/${grade}`);
        continue;
      }
      for (const loc of locales) {
        try {
          const batches = entry.loader.loadTocEntries({ contentLocale: loc });
          assert.ok(Array.isArray(batches), `${loc} ${subject}/${grade} batches`);
          assert.ok(batches.length > 0, `${loc} ${subject}/${grade} empty TOC`);
        } catch (err) {
          failures.push(`${loc} ${subject}/${grade}: ${err?.message || err}`);
        }
      }
    }
  }
  assert.deepEqual(failures, [], failures.join("\n"));
});

test("no unauthorized hard-coded runtime paths that bypass locale resolver for en drafts", () => {
  const HARD_RE = /docs\/learning-book\/en\//;
  const ALLOW = new Set([
    // registries may document legacy/meta paths; loaders must not hard-join en
    "lib/i18n/es-419-translation-inventory.js",
  ]);
  /** @type {string[]} */
  const violations = [];
  const skip =
    /(?:^|\/)(admin|dev|prototypes|scripts|tests|docs)(?:\/|$)|pages\/admin|pages\/dev|components\/admin/;

  function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (/\.(js|jsx|mjs)$/.test(e.name)) out.push(p);
    }
    return out;
  }

  for (const dir of ["lib", "utils", "components", "pages"]) {
    for (const abs of walk(path.join(root, dir))) {
      const rel = path.relative(root, abs).split(path.sep).join("/");
      if (skip.test(rel) || ALLOW.has(rel)) continue;
      const text = fs.readFileSync(abs, "utf8");
      if (!HARD_RE.test(text)) continue;
      const lines = text.split(/\r?\n/);
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        if (!HARD_RE.test(line)) continue;
        if (/^\s*(\*|\/\/)/.test(line) || line.includes("* Content files:")) continue;
        if (line.includes("buildLearningBookDraftsDir") || line.includes("resolveLearningBookDraftsDir")) {
          continue;
        }
        violations.push(`${rel}:${i + 1}: ${line.trim()}`);
      }
    }
  }
  assert.deepEqual(violations, [], `Hard docs/learning-book/en paths:\n${violations.join("\n")}`);
});
