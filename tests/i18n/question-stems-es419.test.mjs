import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { renderMathStemForLocale, renderGeometryStemForLocale } from "../../lib/learning/render-question-stem.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";

describe("es-419 math/geometry question stems", () => {
  it("rebuilds math word-problem stems in LatAm Spanish", () => {
    const q = { subject: "math", params: { kind: "wp_simple_add", a: 3, b: 5 } };
    const out = localizeLearningQuestion(q, { subject: "math", contentLocale: "es-419" });
    assert.match(out.question, /pelotas/);
    assert.doesNotMatch(out.question, /How many|balls/);
  });

  it("rebuilds geometry circle stems in LatAm Spanish", () => {
    const q = { subject: "geometry", params: { kind: "circle_area", radius: 4 } };
    const out = localizeLearningQuestion(q, { subject: "geometry", contentLocale: "es-419" });
    assert.match(out.question, /círculo|circulo/i);
    assert.match(out.question, /área|area/i);
    assert.doesNotMatch(out.question, /What is the area/);
  });

  it("renderMathStemForLocale / renderGeometryStemForLocale honor es-419", () => {
    const math = renderMathStemForLocale(
      { params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
      "es-419"
    );
    assert.match(String(math.stem), /dólares|dolares/i);
    const geo = renderGeometryStemForLocale(
      { params: { kind: "square_perimeter", side: 6 } },
      "es-419"
    );
    assert.match(String(geo.stem), /perímetro|perimetro/i);
  });

  it("marks question_stems ok for es-419 in completeness check", () => {
    const report = checkLocaleCompleteness("es-419");
    const stems = report.findings.find((f) => f.id === "question_stems");
    assert.equal(stems?.status, "ok");
  });
});
