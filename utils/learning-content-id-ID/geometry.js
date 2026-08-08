/**
 * Indonesian (id-ID) rebuilders for geometry question stems.
 * English is the authority; params / numbers / π stay unchanged.
 */
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

/**
 * Closed EN→ID label map for common geometry option / short-answer tokens.
 * Embedded so display options localize without pack registration.
 */
const GEOMETRY_LABELS_EN_TO_ID = Object.freeze({
  Parallel: "Sejajar",
  Perpendicular: "Tegak lurus",
  Equilateral: "Sama sisi",
  Isosceles: "Sama kaki",
  Scalene: "Sembarang",
  Square: "Persegi",
  Rectangle: "Persegi panjang",
  Parallelogram: "Jajar genjang",
  Trapezoid: "Trapesium",
  Translation: "Translasi",
  Reflection: "Refleksi",
  Rotation: "Rotasi",
  "No movement": "Tidak bergerak",
  Cube: "Kubus",
  "Rectangular prism": "Balok",
  Cylinder: "Silinder",
  Pyramid: "Limas",
  Cone: "Kerucut",
  Sphere: "Bola",
  True: "Benar",
  False: "Salah",
  "No equal sides": "Tidak ada sisi sama",
  "No right angles": "Tidak ada sudut siku-siku",
  // lowercase solid aliases (generators sometimes emit these)
  cube: "Kubus",
  "rectangular prism": "Balok",
  cylinder: "Silinder",
  pyramid: "Limas",
  cone: "Kerucut",
  sphere: "Bola",
});

/**
 * @param {unknown} text
 * @returns {string|null}
 */
function mapGeometryLabel(text) {
  const t = String(text ?? "").trim();
  if (!t) return null;
  if (Object.prototype.hasOwnProperty.call(GEOMETRY_LABELS_EN_TO_ID, t)) {
    return GEOMETRY_LABELS_EN_TO_ID[t];
  }
  return null;
}

function isShortAnswerField(field) {
  return field === "answers" || field === "options" || field === "acceptedAnswers";
}

/**
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildGeometryStemIdId(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "").replace(/^story_/, "");
  const radius = Number(p.radius);
  const hasRadius = Number.isFinite(radius) && radius > 0;

  if (kind === "circle_area" && hasRadius) {
    return `Lingkaran dengan jari-jari ${radius}. Berapa luasnya? (π = 3.14)`;
  }
  if (kind === "circle_perimeter" && hasRadius) {
    return `Lingkaran dengan jari-jari ${radius}. Berapa kelilingnya? (π = 3.14)`;
  }
  if (kind === "concept_circle" && p.patternFamily === "radius_diameter") {
    return "Dalam lingkaran, hubungan antara diameter dan jari-jari adalah:";
  }

  const side = Number(p.side ?? p.sideLength);
  const length = Number(p.length ?? p.a);
  const width = Number(p.width ?? p.b);
  if ((kind === "square_area" || kind.includes("square_area")) && Number.isFinite(side) && side > 0) {
    return `Berapa luas persegi dengan sisi ${side}?`;
  }
  if (
    (kind === "square_perimeter" || kind.includes("square_perimeter")) &&
    Number.isFinite(side) &&
    side > 0
  ) {
    return `Berapa keliling persegi dengan sisi ${side}?`;
  }
  if (
    (kind === "rectangle_area" || kind.includes("rect_area")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `Berapa luas persegi panjang dengan panjang ${length} dan lebar ${width}?`;
  }
  if (
    (kind === "rectangle_perimeter" || kind.includes("rect_perimeter")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `Berapa keliling persegi panjang dengan panjang ${length} dan lebar ${width}?`;
  }

  return null;
}

/**
 * @param {Record<string, unknown>} question
 * @returns {string}
 */
export function geometryFallbackStemIdId(question) {
  const existing = String(question?.question || question?.exerciseText || "").trim();
  if (existing && !containsHebrew(existing)) return existing;
  return "Selesaikan.";
}

function isNearlyEmptyStem(text) {
  const t = String(text ?? "")
    .replace(/[_\s.:=?\-−–—,/|()π=3.14]+/gi, "")
    .replace(
      /jari-jari|jarijari|diameter|lingkaran|luas|keliling|persegi|panjang|lebar|sisi|dengan|berapa|adalah|dalam|hubungan|antara|dan|yang|sebuah|satu|of|the|a|what|is|radius|circle|area|perimeter|circumference/gi,
      "",
    )
    .trim();
  return t.length < 1;
}

/**
 * Localize geometry question for Indonesian (id-ID) display.
 * @param {Record<string, unknown>} question
 */
export function localizeGeometryQuestionIdId(question) {
  if (!question) return question;

  const base = { ...question };
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const rebuilt = rebuildGeometryStemIdId({ ...question, ...base, params: question.params });
  let resolvedStem = rebuilt && !containsHebrew(rebuilt) ? rebuilt : null;
  if (!resolvedStem) {
    resolvedStem = geometryFallbackStemIdId(question);
  }

  const out = mapQuestionTextFields({ ...base }, (field, value) => {
    if (field === "question" || field === "exerciseText" || field === "questionLabel") {
      if (!value || containsHebrew(value) || isNearlyEmptyStem(value)) return resolvedStem;
      return value;
    }
    if (isShortAnswerField(field)) {
      const label = mapGeometryLabel(value);
      if (label) return label;
      const text = String(value ?? "");
      if (!containsHebrew(text)) return text;
      return text.replace(/(?!)/gu, "").trim() || text;
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

  if (typeof out.correctAnswer === "string") {
    const mapped = mapGeometryLabel(out.correctAnswer);
    if (mapped) out.correctAnswer = mapped;
  }

  return out;
}
