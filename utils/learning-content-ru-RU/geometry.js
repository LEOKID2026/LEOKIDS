/**
 * Russian (ru-RU / Russia) rebuilders for geometry question stems.
 * English is the authority; params / numbers / π stay unchanged.
 *
 * Terminology:
 *   Геометрия
 *   круг — disk / filled circle (area)
 *   окружность — circumference / circle line
 *   радиус, диаметр, площадь, периметр
 */

export const GEOMETRY_TERMS_RU_RU = Object.freeze({
  subject: "Геометрия",
  perimeter: "периметр",
  area: "площадь",
  circleDisk: "круг",
  circumference: "окружность",
  radius: "радиус",
  diameter: "диаметр",
});
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

/**
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildGeometryStemRuRu(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "").replace(/^story_/, "");
  const radius = Number(p.radius);
  const hasRadius = Number.isFinite(radius) && radius > 0;

  if (kind === "circle_area" && hasRadius) {
    return `Круг с радиусом ${radius}. Чему равна площадь? (π = 3,14)`;
  }
  if (kind === "circle_perimeter" && hasRadius) {
    return `Окружность с радиусом ${radius}. Чему равна длина окружности? (π = 3,14)`;
  }
  if (kind === "concept_circle" && p.patternFamily === "radius_diameter") {
    return "В круге соотношение между диаметром и радиусом такое:";
  }

  const side = Number(p.side ?? p.sideLength);
  const length = Number(p.length ?? p.a);
  const width = Number(p.width ?? p.b);
  if ((kind === "square_area" || kind.includes("square_area")) && Number.isFinite(side) && side > 0) {
    return `Чему равна площадь квадрата со стороной ${side}?`;
  }
  if (
    (kind === "square_perimeter" || kind.includes("square_perimeter")) &&
    Number.isFinite(side) &&
    side > 0
  ) {
    return `Чему равен периметр квадрата со стороной ${side}?`;
  }
  if (
    (kind === "rectangle_area" || kind.includes("rect_area")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `Чему равна площадь прямоугольника с длиной ${length} и шириной ${width}?`;
  }
  if (
    (kind === "rectangle_perimeter" || kind.includes("rect_perimeter")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `Чему равен периметр прямоугольника с длиной ${length} и шириной ${width}?`;
  }

  return null;
}

/**
 * @param {Record<string, unknown>} question
 * @returns {string}
 */
export function geometryFallbackStemRuRu(question) {
  const existing = String(question?.question || question?.exerciseText || "").trim();
  if (existing && !containsHebrew(existing)) return existing;
  return "Реши.";
}

function isNearlyEmptyStem(text) {
  const t = String(text ?? "")
    .replace(/[_\s.:=?\-−–—,/|()π=3,14]+/gi, "")
    .replace(
      /радиус|диаметр|круг|окружность|площадь|периметр|длина|ширина|сторона|квадрат|прямоугольник|чему|равн[ао]|с|и|в/gi,
      ""
    )
    .trim();
  return t.length < 1;
}

/**
 * Localize geometry question for Russian (ru-RU) display.
 * @param {Record<string, unknown>} question
 */
export function localizeGeometryQuestionRuRu(question) {
  if (!question) return question;

  const base = { ...question };
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const rebuilt = rebuildGeometryStemRuRu({ ...question, ...base, params: question.params });
  let resolvedStem = rebuilt && !containsHebrew(rebuilt) ? rebuilt : null;
  if (!resolvedStem) {
    resolvedStem = geometryFallbackStemRuRu(question);
  }

  const out = mapQuestionTextFields({ ...base }, (field, value) => {
    if (field === "question" || field === "exerciseText" || field === "questionLabel") {
      if (!value || containsHebrew(value) || isNearlyEmptyStem(value)) return resolvedStem;
      return value;
    }
    if (!containsHebrew(String(value ?? ""))) return value;
    return (
      String(value)
        .replace(/(?!)/gu, " ")
        .replace(/\s{2,}/g, " ")
        .trim() || value
    );
  });

  out.question = resolvedStem;
  if (!out.exerciseText || containsHebrew(String(out.exerciseText)) || isNearlyEmptyStem(out.exerciseText)) {
    out.exerciseText = resolvedStem;
  }
  out.displayStemSource = rebuilt ? "params" : "passthrough";
  return out;
}
