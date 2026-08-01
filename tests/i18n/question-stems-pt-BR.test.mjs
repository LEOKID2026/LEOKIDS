import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import {
  renderMathStemForLocale,
  renderGeometryStemForLocale,
} from "../../lib/learning/render-question-stem.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import { containsHebrew } from "../../utils/learning-question-content-locale.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
import { loadMathG1Page } from "../../lib/learning-book/load-math-g1-pages.js";
import fs from "node:fs";
import path from "node:path";

function assertNoForeignLeak(text) {
  const s = String(text || "");
  assert.equal(containsHebrew(s), false, `Hebrew leak: ${s}`);
  assert.doesNotMatch(s, /\b(How many|What is|Compare the|Round to|Fill in)\b/);
  assert.doesNotMatch(s, /\b(¿Cuánto|Cuál es|perímetro del cuadrado|pelotas)\b/i);
}

describe("pt-BR math/geometry question stems", () => {
  it("rebuilds arithmetic generic stem in Portuguese", () => {
    const math = renderMathStemForLocale(
      { operation: "addition", params: { a: 4, b: 7 } },
      "pt-BR",
    );
    assert.match(String(math.stem), /Quanto é 4 \+ 7\?/);
    assertNoForeignLeak(math.stem);
  });

  it("rebuilds word-problem instruction in Portuguese", () => {
    const out = localizeLearningQuestion(
      { subject: "math", params: { kind: "wp_simple_add", a: 3, b: 5 } },
      { subject: "math", contentLocale: "pt-BR" },
    );
    assert.match(out.question, /bolas|Leo/i);
    assert.match(out.question, /Quant/);
    assert.doesNotMatch(out.question, /How many|balls/);
    assertNoForeignLeak(out.question);
  });

  it("rebuilds comparison stem in Portuguese", () => {
    const out = localizeLearningQuestion(
      {
        subject: "math",
        operation: "compare",
        params: { kind: "cmp", exerciseText: "12 __ 15", presentationVariant: 0, difficulty: "easy" },
      },
      { subject: "math", contentLocale: "pt-BR" },
    );
    assert.match(out.question, /Compare|compar/i);
    assert.match(out.question, /12 __ 15/);
    assertNoForeignLeak(out.question);
  });

  it("rebuilds fraction stem in Portuguese", () => {
    const out = localizeLearningQuestion(
      { subject: "math", params: { kind: "frac_half", whole: 8 } },
      { subject: "math", contentLocale: "pt-BR" },
    );
    assert.match(out.question, /metade|8/);
    assert.doesNotMatch(out.question, /What is half/);
    assertNoForeignLeak(out.question);
  });

  it("rebuilds unit-bearing stem in Portuguese", () => {
    const out = localizeLearningQuestion(
      { subject: "math", params: { kind: "wp_unit_cm_to_m", cm: 300 } },
      { subject: "math", contentLocale: "pt-BR" },
    );
    assert.match(out.question, /metros|centímetros|centimetros|300/i);
    assert.doesNotMatch(out.question, /How many meters/);
    assertNoForeignLeak(out.question);
  });

  it("rebuilds geometry shape/area/perimeter/angle-related stems", () => {
    const circle = localizeLearningQuestion(
      { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
      { subject: "geometry", contentLocale: "pt-BR" },
    );
    assert.match(circle.question, /círculo|circulo/i);
    assert.match(circle.question, /área|area/i);
    assert.doesNotMatch(circle.question, /What is the area/);
    assertNoForeignLeak(circle.question);

    const square = renderGeometryStemForLocale(
      { params: { kind: "square_perimeter", side: 6 } },
      "pt-BR",
    );
    assert.match(String(square.stem), /perímetro|perimetro/i);
    assert.match(String(square.stem), /quadrado/i);
    assertNoForeignLeak(square.stem);

    const rect = renderGeometryStemForLocale(
      { params: { kind: "rectangle_area", length: 5, width: 3 } },
      "pt-BR",
    );
    assert.match(String(rect.stem), /retângulo|retangulo/i);
    assertNoForeignLeak(rect.stem);

    const circ = renderGeometryStemForLocale(
      { params: { kind: "circle_perimeter", radius: 2 } },
      "pt-BR",
    );
    assert.match(String(circ.stem), /circunferência|circunferencia/i);
    assertNoForeignLeak(circ.stem);
  });

  it("preserves placeholders / BLANK and does not alter params", () => {
    const q = {
      subject: "math",
      id: "test-frac",
      params: { kind: "frac_simplify_intro_g4", num: 2, den: 4 },
      correctIndex: 1,
      diagnosticTags: ["frac"],
    };
    const out = localizeLearningQuestion(q, { subject: "math", contentLocale: "pt-BR" });
    assert.equal(out.id, "test-frac");
    assert.equal(out.correctIndex, 1);
    assert.deepEqual(out.diagnosticTags, ["frac"]);
    assert.equal(out.params.num, 2);
    assert.equal(out.params.den, 4);
    assert.match(out.question, /2\/4/);
    assert.match(out.question, /__/);
  });

  it("marks question_stems ok for pt-BR in completeness check", () => {
    const report = checkLocaleCompleteness("pt-BR");
    const stems = report.findings.find((f) => f.id === "question_stems");
    assert.equal(stems?.status, "ok");
  });

  it("travel ticket word id uses passagem (not ingresso)", () => {
    assert.equal(
      resolveEnglishWordMeaning("ticket", { listKey: "travel", instructionLocale: "pt-BR" }),
      "passagem",
    );
  });
});

describe("pt-BR learning-book runtime authority", () => {
  it("resolves and loads public book pages from docs/learning-book/pt-BR", () => {
    const dir = resolveLearningBookDraftsDir("pt-BR", "math", "g1");
    assert.match(dir.replace(/\\/g, "/"), /docs\/learning-book\/pt-BR\/math\/g1\/drafts/);
    const abs = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    assert.equal(fs.existsSync(abs), true);
    const page = loadMathG1Page("ns_counting_forward", { contentLocale: "pt-BR" });
    assert.ok(page);
    const blob = JSON.stringify(page);
    assert.equal(containsHebrew(blob), false);
    assert.doesNotMatch(blob, /\bHow to\b|\bWhat is\b/);
  });
});
