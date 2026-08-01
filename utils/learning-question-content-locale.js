/**
 * @deprecated Use lib/content/locale.js — kept for backward compatibility.
 */
import { resolveContentLocale as resolveCore } from "../lib/content/locale.js";

export const DEFAULT_CONTENT_LOCALE = "en";

/** Product locales accepted by Global content resolution. */
const PRODUCT_CONTENT_LOCALES = new Set([
  "en",
  "es-419",
  "es-MX",
  "es-CO",
  "es-AR",
  "es-PE",
  "es-CL",
  "es-EC",
  "es-GT",
  "es-DO",
]);

/** Detect Hebrew-script code points without embedding Unicode escapes in source. */
export function containsHebrew(text) {
  const s = String(text || "");
  for (let i = 0; i < s.length; ) {
    const cp = s.codePointAt(i);
    if (cp >= 0x0590 && cp <= 0x05ff) return true;
    i += cp > 0xffff ? 2 : 1;
  }
  return false;
}

export function resolveContentLocale(opts) {
  const resolved = resolveCore({
    contentLocale: opts?.contentLocale,
    interfaceLocale: opts?.locale,
    subject: opts?.subject,
    market: opts?.market,
    curriculum: opts?.curriculum,
  });
  const id = String(resolved || "");
  if (PRODUCT_CONTENT_LOCALES.has(id)) return id;
  // Country / regional Spanish still product content via registry chain.
  if (id.toLowerCase().startsWith("es-")) return id;
  return "en";
}

const QUESTION_TEXT_KEYS = [
  "question",
  "exerciseText",
  "questionLabel",
  "stem",
  "explanation",
  "feedback",
  "hint",
  "theoryHelp",
];

function cloneStringArray(arr) {
  return Array.isArray(arr) ? arr.map((x) => String(x)) : arr;
}

export function mapQuestionTextFields(question, localizeField) {
  if (!question || typeof question !== "object") return question;
  const out = { ...question };
  for (const key of QUESTION_TEXT_KEYS) {
    if (typeof out[key] === "string" && out[key].trim()) {
      out[key] = localizeField(key, out[key], out);
    }
  }
  for (const arrKey of ["answers", "options", "acceptedAnswers", "theoryLines"]) {
    if (Array.isArray(out[arrKey])) {
      out[arrKey] = out[arrKey].map((item, i) =>
        typeof item === "string" && item.trim()
          ? localizeField(arrKey, item, out, i)
          : item
      );
    }
  }
  return out;
}

export function collectQuestionTextFields(question) {
  const parts = [];
  if (!question || typeof question !== "object") return parts;
  for (const key of QUESTION_TEXT_KEYS) {
    if (typeof question[key] === "string") parts.push(question[key]);
  }
  for (const arrKey of ["answers", "options", "acceptedAnswers", "theoryLines"]) {
    if (Array.isArray(question[arrKey])) {
      for (const item of question[arrKey]) {
        if (typeof item === "string") parts.push(item);
      }
    }
  }
  return parts;
}

/** @deprecated Never-matching stub — HE codepoint regex removed from product. */
const HEBREW_CODEPOINT_RE = /(?!)/;

export { cloneStringArray, HEBREW_CODEPOINT_RE };
