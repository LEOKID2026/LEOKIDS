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
import { rebuildMathStemPtPt } from "../../utils/learning-content-pt-PT/math.js";
import { rebuildGeometryStemPtPt } from "../../utils/learning-content-pt-PT/geometry.js";
import { rebuildMathStemItIt } from "../../utils/learning-content-it-IT/math.js";
import { rebuildGeometryStemItIt } from "../../utils/learning-content-it-IT/geometry.js";
import { rebuildMathStemFrFr } from "../../utils/learning-content-fr-FR/math.js";
import { rebuildGeometryStemFrFr } from "../../utils/learning-content-fr-FR/geometry.js";
import { rebuildMathStemNlNl } from "../../utils/learning-content-nl-NL/math.js";
import { rebuildGeometryStemNlNl } from "../../utils/learning-content-nl-NL/geometry.js";
import { rebuildMathStemDeDe } from "../../utils/learning-content-de-DE/math.js";
import { rebuildGeometryStemDeDe } from "../../utils/learning-content-de-DE/geometry.js";
import { rebuildMathStemRuRu } from "../../utils/learning-content-ru-RU/math.js";
import { rebuildGeometryStemRuRu } from "../../utils/learning-content-ru-RU/geometry.js";
import { rebuildMathStemRuKz } from "../../utils/learning-content-ru-KZ/math.js";
import { rebuildGeometryStemRuKz } from "../../utils/learning-content-ru-KZ/geometry.js";
import { rebuildMathStemRuUz } from "../../utils/learning-content-ru-UZ/math.js";
import { rebuildGeometryStemRuUz } from "../../utils/learning-content-ru-UZ/geometry.js";
import { rebuildMathStemRuKg } from "../../utils/learning-content-ru-KG/math.js";
import { rebuildGeometryStemRuKg } from "../../utils/learning-content-ru-KG/geometry.js";
import { rebuildMathStemRuBy } from "../../utils/learning-content-ru-BY/math.js";
import { rebuildGeometryStemRuBy } from "../../utils/learning-content-ru-BY/geometry.js";
import { getContentFallbackChain, resolveContentLocale } from "../content/locale.js";

const OP_SYMBOL = Object.freeze({
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
});

/**
 * @param {string} locale
 * @returns {string}
 */
function resolveStemLocale(locale) {
  const chain = getContentFallbackChain(locale);
  for (const loc of chain) {
    if (
      loc === "es-419" ||
      loc === "pt-PT" ||
      loc === "pt-BR" ||
      loc === "it-IT" ||
      loc === "fr-FR" ||
      loc === "nl-NL" ||
      loc === "de-DE" ||
      loc === "ru-KZ" ||
      loc === "ru-UZ" ||
      loc === "ru-KG" ||
      loc === "ru-BY" ||
      loc === "ru-RU" ||
      loc === "en"
    ) {
      return loc;
    }
  }
  return "en";
}

/**
 * @param {Record<string, unknown>} question
 * @param {string} [locale]
 */
export function buildGenericMathStemFromParams(question, locale = "en") {
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  const stemLocale = resolveStemLocale(locale);
  if (a != null && b != null && OP_SYMBOL[opRaw]) {
    if (stemLocale === "es-419") {
      return `¿Cuánto es ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
    }
    if (stemLocale === "pt-BR" || stemLocale === "pt-PT") {
      return `Quanto é ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
    }
    if (stemLocale === "it-IT") {
      return `Quanto fa ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
    }
    if (stemLocale === "fr-FR") {
      return `Combien font ${a} ${OP_SYMBOL[opRaw]} ${b} ?`;
    }
    if (stemLocale === "nl-NL") {
      return `Hoeveel is ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
    }
    if (stemLocale === "de-DE") {
      return `Wie viel ist ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
    }
    if (
      stemLocale === "ru-RU" ||
      stemLocale === "ru-KZ" ||
      stemLocale === "ru-UZ" ||
      stemLocale === "ru-KG" ||
      stemLocale === "ru-BY"
    ) {
      return `Вычисли: ${a} ${OP_SYMBOL[opRaw]} ${b}?`;
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
  const stemLocale = resolveStemLocale(locale);
  if (stemLocale === "es-419") return rebuildMathStemEs419;
  if (stemLocale === "pt-PT") return rebuildMathStemPtPt;
  if (stemLocale === "pt-BR") return rebuildMathStemPtBr;
  if (stemLocale === "it-IT") return rebuildMathStemItIt;
  if (stemLocale === "fr-FR") return rebuildMathStemFrFr;
  if (stemLocale === "nl-NL") return rebuildMathStemNlNl;
  if (stemLocale === "de-DE") return rebuildMathStemDeDe;
  if (stemLocale === "ru-KZ") return rebuildMathStemRuKz;
  if (stemLocale === "ru-UZ") return rebuildMathStemRuUz;
  if (stemLocale === "ru-KG") return rebuildMathStemRuKg;
  if (stemLocale === "ru-BY") return rebuildMathStemRuBy;
  if (stemLocale === "ru-RU") return rebuildMathStemRuRu;
  return rebuildMathStemEn;
}

function pickGeometryRebuilder(locale) {
  const stemLocale = resolveStemLocale(locale);
  if (stemLocale === "es-419") return rebuildGeometryStemEs419;
  if (stemLocale === "pt-PT") return rebuildGeometryStemPtPt;
  if (stemLocale === "pt-BR") return rebuildGeometryStemPtBr;
  if (stemLocale === "it-IT") return rebuildGeometryStemItIt;
  if (stemLocale === "fr-FR") return rebuildGeometryStemFrFr;
  if (stemLocale === "nl-NL") return rebuildGeometryStemNlNl;
  if (stemLocale === "de-DE") return rebuildGeometryStemDeDe;
  if (stemLocale === "ru-KZ") return rebuildGeometryStemRuKz;
  if (stemLocale === "ru-UZ") return rebuildGeometryStemRuUz;
  if (stemLocale === "ru-KG") return rebuildGeometryStemRuKg;
  if (stemLocale === "ru-BY") return rebuildGeometryStemRuBy;
  if (stemLocale === "ru-RU") return rebuildGeometryStemRuRu;
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
