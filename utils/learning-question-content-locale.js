/**
 * Content locale for learning question generators (global default: English).
 * UI chrome uses i18n; question stems/options/feedback use this layer.
 */

export const DEFAULT_CONTENT_LOCALE = "en";

const HEBREW_RE = /[\u0590-\u05FF]/;

export function containsHebrew(text) {
  return HEBREW_RE.test(String(text ?? ""));
}

export function resolveContentLocale(opts) {
  const raw =
    opts?.contentLocale ??
    opts?.locale ??
    (typeof globalThis !== "undefined"
      ? globalThis.__LEO_LEARNING_CONTENT_LOCALE
      : undefined) ??
    DEFAULT_CONTENT_LOCALE;
  const id = String(raw || DEFAULT_CONTENT_LOCALE).trim().toLowerCase();
  return id === "he" || id === "he-il" ? "he" : "en";
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

/**
 * Apply a field-localizer to student-facing question payload fields.
 * @param {Record<string, unknown>} question
 * @param {(field: string, value: string, q: Record<string, unknown>) => string} localizeField
 */
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

export { cloneStringArray, HEBREW_RE as HEBREW_CODEPOINT_RE };
