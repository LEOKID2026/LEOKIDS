/**
 * German (Germany) (de-DE) rebuilders for geometry question stems.
 * English is the authority; params / numbers / π stay unchanged.
 */
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

/**
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildGeometryStemDeDe(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "").replace(/^story_/, "");
  const radius = Number(p.radius);
  const hasRadius = Number.isFinite(radius) && radius > 0;

  if (kind === "circle_area" && hasRadius) {
    return `Ein Kreis mit Radius ${radius}. Wie groß ist die Fläche? (π = 3,14)`;
  }
  if (kind === "circle_perimeter" && hasRadius) {
    return `Ein Kreis mit Radius ${radius}. Wie groß ist der Umfang des Kreises? (π = 3,14)`;
  }
  if (kind === "concept_circle" && p.patternFamily === "radius_diameter") {
    return "In einem Kreis gilt für Durchmesser und Radius:";
  }

  const side = Number(p.side ?? p.sideLength);
  const length = Number(p.length ?? p.a);
  const width = Number(p.width ?? p.b);
  if ((kind === "square_area" || kind.includes("square_area")) && Number.isFinite(side) && side > 0) {
    return `Wie groß ist die Fläche des Quadrats mit Seitenlänge ${side}?`;
  }
  if (
    (kind === "square_perimeter" || kind.includes("square_perimeter")) &&
    Number.isFinite(side) &&
    side > 0
  ) {
    return `Wie groß ist der Umfang des Quadrats mit Seitenlänge ${side}?`;
  }
  if (
    (kind === "rectangle_area" || kind.includes("rect_area")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `Wie groß ist die Fläche des Rechtecks mit Länge ${length} und Breite ${width}?`;
  }
  if (
    (kind === "rectangle_perimeter" || kind.includes("rect_perimeter")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `Wie groß ist der Umfang des Rechtecks mit Länge ${length} und Breite ${width}?`;
  }

  return null;
}

/**
 * @param {Record<string, unknown>} question
 * @returns {string}
 */
export function geometryFallbackStemDeDe(question) {
  const existing = String(question?.question || question?.exerciseText || "").trim();
  if (existing && !containsHebrew(existing)) return existing;
  return "Löse.";
}

function isNearlyEmptyStem(text) {
  const t = String(text ?? "")
    .replace(/[_\s.:=?\-−–—,/|()π=3.14,]+/gi, "")
    .replace(
      /radius|durchmesser|kreis|kreislinie|fläche|flaeche|umfang|von|dem|der|die|ein|eine|was|ist|wie|groß|gross/gi,
      "",
    )
    .trim();
  return t.length < 1;
}

/**
 * Localize geometry question for German (Germany) (de-DE) display.
 * @param {Record<string, unknown>} question
 */
export function localizeGeometryQuestionDeDe(question) {
  if (!question) return question;

  const base = { ...question };
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const rebuilt = rebuildGeometryStemDeDe({ ...question, ...base, params: question.params });
  let resolvedStem = rebuilt && !containsHebrew(rebuilt) ? rebuilt : null;
  if (!resolvedStem) {
    resolvedStem = geometryFallbackStemDeDe(question);
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
