/**
 * Language-neutral question display rendering.
 * Canonical question objects carry ids/params/answers/diagnostics;
 * stems are produced from params + kind — not by translating Hebrew sentences.
 */

import { containsHebrew } from "../../utils/learning-question-content-locale.js";
import { rebuildMathStemEn } from "../../utils/learning-content-en/math.js";
import { rebuildGeometryStemEn } from "../../utils/learning-content-en/geometry.js";
import { rebuildMathStemEs419 } from "../../utils/learning-content-es419/math.js";
import { rebuildGeometryStemEs419 } from "../../utils/learning-content-es419/geometry.js";
import { rebuildMathStemPtBr } from "../../utils/learning-content-pt-BR/math.js";
import { rebuildGeometryStemPtBr } from "../../utils/learning-content-pt-BR/geometry.js";
import { resolveContentLocale } from "../content/locale.js";

const OP_SYMBOL = Object.freeze({
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
});

/**
 * @param {Record<string, unknown>} question
 * @param {string} [locale]
 */
export function buildGenericMathStemFromParams(question, locale = "en") {
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  if (a != null && b != null && OP_SYMBOL[opRaw]) {
    if (locale === "es-419") {
      return `¿Cuánto es ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
    }
    if (locale === "pt-BR") {
      return `Quanto é ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
    }
    return `What is ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
  }
  for (const candidate of [p.exerciseText, question?.exerciseText, question?.question]) {
    if (typeof candidate === "string" && candidate.trim() && !containsHebrew(candidate)) {
      return String(candidate).trim();
    }
  }
  return null;
}

/**
 * @param {Record<string, unknown>} question
 * @param {string|null|undefined} [contentLocale]
 * @returns {{ stem: string|null, source: string }}
 */
function pickMathRebuilder(locale) {
  if (locale === "es-419") return rebuildMathStemEs419;
  if (locale === "pt-BR") return rebuildMathStemPtBr;
  return rebuildMathStemEn;
}

function pickGeometryRebuilder(locale) {
  if (locale === "es-419") return rebuildGeometryStemEs419;
  if (locale === "pt-BR") return rebuildGeometryStemPtBr;
  return rebuildGeometryStemEn;
}

export function renderMathStemForLocale(question, contentLocale = "en") {
  const locale = resolveContentLocale({ contentLocale, subject: "math" });
  const rebuilt = pickMathRebuilder(locale)(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }

  const generic = buildGenericMathStemFromParams(question, locale);
  if (generic) {
    return { stem: generic, source: "generic" };
  }

  const existing = String(question?.question || question?.exerciseText || "").trim();
  if (existing && !containsHebrew(existing)) {
    return { stem: existing, source: "passthrough" };
  }

  return { stem: null, source: "none" };
}

/**
 * @param {Record<string, unknown>} question
 * @param {string|null|undefined} [contentLocale]
 * @returns {{ stem: string|null, source: string }}
 */
export function renderGeometryStemForLocale(question, contentLocale = "en") {
  const locale = resolveContentLocale({ contentLocale, subject: "geometry" });
  const rebuilt = pickGeometryRebuilder(locale)(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }

  const existing = String(question?.question || question?.exerciseText || "").trim();
  if (existing && !containsHebrew(existing)) {
    return { stem: existing, source: "passthrough" };
  }

  return { stem: null, source: "none" };
}

/**
 * Clear authored Hebrew display strings so locale rendering is the sole authority.
 * Preserves params, numeric answers, diagnostics.
 * @param {Record<string, unknown>} question
 */
export function neutralizeAuthoredDisplayText(question) {
  if (!question || typeof question !== "object") return question;
  const out = { ...question };
  for (const key of ["question", "exerciseText", "questionLabel", "stem", "explanation", "hint", "feedback"]) {
    if (typeof out[key] === "string" && containsHebrew(out[key])) {
      out[key] = "";
    }
  }
  out.displayTextNeutralized = true;
  return out;
}
