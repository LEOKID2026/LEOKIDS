/**
 * Dutch (Netherlands) (nl-NL) rebuilders for geometry question stems.
 * English is the authority; params / numbers / π stay unchanged.
 */
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

/**
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildGeometryStemNlNl(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "").replace(/^story_/, "");
  const radius = Number(p.radius);
  const hasRadius = Number.isFinite(radius) && radius > 0;

  if (kind === "circle_area" && hasRadius) {
    return `Een cirkel heeft een straal van ${radius}. Wat is de oppervlakte? (π = 3,14)`;
  }
  if (kind === "circle_perimeter" && hasRadius) {
    return `Een cirkel heeft een straal van ${radius}. Wat is de omtrek van de cirkel? (π = 3,14)`;
  }
  if (kind === "concept_circle" && p.patternFamily === "radius_diameter") {
    return "In een cirkel is de relatie tussen de diameter en de straal:";
  }

  const side = Number(p.side ?? p.sideLength);
  const length = Number(p.length ?? p.a);
  const width = Number(p.width ?? p.b);
  if ((kind === "square_area" || kind.includes("square_area")) && Number.isFinite(side) && side > 0) {
    return `Wat is de oppervlakte van het vierkant met zijde ${side}?`;
  }
  if (
    (kind === "square_perimeter" || kind.includes("square_perimeter")) &&
    Number.isFinite(side) &&
    side > 0
  ) {
    return `Wat is de omtrek van het vierkant met zijde ${side}?`;
  }
  if (
    (kind === "rectangle_area" || kind.includes("rect_area")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `Wat is de oppervlakte van de rechthoek met lengte ${length} en breedte ${width}?`;
  }
  if (
    (kind === "rectangle_perimeter" || kind.includes("rect_perimeter")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `Wat is de omtrek van de rechthoek met lengte ${length} en breedte ${width}?`;
  }

  return null;
}

/**
 * @param {Record<string, unknown>} question
 * @returns {string}
 */
export function geometryFallbackStemNlNl(question) {
  const existing = String(question?.question || question?.exerciseText || "").trim();
  if (existing && !containsHebrew(existing)) return existing;
  return "Reken uit.";
}

function isNearlyEmptyStem(text) {
  const t = String(text ?? "")
    .replace(/[_\s.:=?\-−–—,/|()π=3.14]+/gi, "")
    .replace(
      /straal|diameter|cirkel|oppervlakte|omtrek|van|een|de|het|wat|is/gi,
      "",
    )
    .trim();
  return t.length < 1;
}

/**
 * Localize geometry question for Dutch (Netherlands) (nl-NL) display.
 * @param {Record<string, unknown>} question
 */
export function localizeGeometryQuestionNlNl(question) {
  if (!question) return question;

  const base = { ...question };
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const rebuilt = rebuildGeometryStemNlNl({ ...question, ...base, params: question.params });
  let resolvedStem = rebuilt && !containsHebrew(rebuilt) ? rebuilt : null;
  if (!resolvedStem) {
    resolvedStem = geometryFallbackStemNlNl(question);
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
