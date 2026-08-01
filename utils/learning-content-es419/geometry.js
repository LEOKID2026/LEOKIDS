/**
 * LatAm Spanish (es-419) rebuilders for geometry question stems.
 * Params / numbers / π stay unchanged; instructional prose is Spanish.
 */
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

/**
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildGeometryStemEs419(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "").replace(/^story_/, "");
  const radius = Number(p.radius);
  const hasRadius = Number.isFinite(radius) && radius > 0;

  if (kind === "circle_area" && hasRadius) {
    return `Un círculo con radio ${radius}. ¿Cuál es el área? (π = 3.14)`;
  }
  if (kind === "circle_perimeter" && hasRadius) {
    return `Un círculo con radio ${radius}. ¿Cuál es la circunferencia? (π = 3.14)`;
  }
  if (kind === "concept_circle" && p.patternFamily === "radius_diameter") {
    return "En un círculo, la relación entre el diámetro y el radio es:";
  }

  const side = Number(p.side ?? p.sideLength);
  const length = Number(p.length ?? p.a);
  const width = Number(p.width ?? p.b);
  if ((kind === "square_area" || kind.includes("square_area")) && Number.isFinite(side) && side > 0) {
    return `¿Cuál es el área del cuadrado con lado ${side}?`;
  }
  if (
    (kind === "square_perimeter" || kind.includes("square_perimeter")) &&
    Number.isFinite(side) &&
    side > 0
  ) {
    return `¿Cuál es el perímetro del cuadrado con lado ${side}?`;
  }
  if (
    (kind === "rectangle_area" || kind.includes("rect_area")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `¿Cuál es el área del rectángulo con largo ${length} y ancho ${width}?`;
  }
  if (
    (kind === "rectangle_perimeter" || kind.includes("rect_perimeter")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `¿Cuál es el perímetro del rectángulo con largo ${length} y ancho ${width}?`;
  }

  return null;
}

/**
 * @param {Record<string, unknown>} question
 * @returns {string}
 */
export function geometryFallbackStemEs419(question) {
  const existing = String(question?.question || question?.exerciseText || "").trim();
  if (existing && !containsHebrew(existing)) return existing;
  return "Resuelve.";
}

function isNearlyEmptyStem(text) {
  const t = String(text ?? "")
    .replace(/[_\s.:=?\-−–—,/|()π=3.14]+/gi, "")
    .replace(/radio|diámetro|circulo|círculo|área|area|perímetro|perimetro|circunferencia|de|el|la|un|una|cuál|cual|es/gi, "")
    .trim();
  return t.length < 1;
}

/**
 * Localize geometry question for LatAm Spanish (es-419) display.
 * @param {Record<string, unknown>} question
 */
export function localizeGeometryQuestionEs419(question) {
  if (!question) return question;

  const base = { ...question };
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const rebuilt = rebuildGeometryStemEs419({ ...question, ...base, params: question.params });
  let resolvedStem = rebuilt && !containsHebrew(rebuilt) ? rebuilt : null;
  if (!resolvedStem) {
    resolvedStem = geometryFallbackStemEs419(question);
  }

  const out = mapQuestionTextFields({ ...base }, (field, value) => {
    if (field === "question" || field === "exerciseText" || field === "questionLabel") {
      if (!value || containsHebrew(value) || isNearlyEmptyStem(value)) return resolvedStem;
      return value;
    }
    if (!containsHebrew(String(value ?? ""))) return value;
    return String(value).replace(/(?!)/gu, " ").replace(/\s{2,}/g, " ").trim() || value;
  });

  out.question = resolvedStem;
  if (!out.exerciseText || containsHebrew(String(out.exerciseText)) || isNearlyEmptyStem(out.exerciseText)) {
    out.exerciseText = resolvedStem;
  }
  out.displayStemSource = rebuilt ? "params" : "passthrough";
  return out;
}
