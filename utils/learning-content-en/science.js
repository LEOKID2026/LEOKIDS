/**
 * Apply locale Science display overlays by content locale.
 */
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import { SCIENCE_ES_419_OVERLAY } from "../../data/science-questions-es-419-overlay.js";
import { SCIENCE_PT_BR_OVERLAY } from "../../data/science-questions-pt-BR-overlay.js";
import { SCIENCE_PT_PT_OVERLAY } from "../../data/science-questions-pt-PT-overlay.js";
import { SCIENCE_IT_IT_OVERLAY } from "../../data/science-questions-it-IT-overlay.js";
import { SCIENCE_FR_FR_OVERLAY } from "../../data/science-questions-fr-FR-overlay.js";
import { SCIENCE_NL_NL_OVERLAY } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_DE_DE_OVERLAY } from "../../data/science-questions-de-DE-overlay.js";
import { SCIENCE_RU_RU_OVERLAY } from "../../data/science-questions-ru-RU-overlay.js";
import { translateScienceFields, translateScienceText } from "./science-translate.js";
import { getContentFallbackChain, resolveContentLocale } from "../../lib/content/locale.js";

const SCIENCE_OVERLAY_BY_LOCALE = {
  "es-419": SCIENCE_ES_419_OVERLAY,
  "pt-PT": SCIENCE_PT_PT_OVERLAY,
  "pt-BR": SCIENCE_PT_BR_OVERLAY,
  "it-IT": SCIENCE_IT_IT_OVERLAY,
  "fr-FR": SCIENCE_FR_FR_OVERLAY,
  "nl-NL": SCIENCE_NL_NL_OVERLAY,
  "de-DE": SCIENCE_DE_DE_OVERLAY,
  "ru-RU": SCIENCE_RU_RU_OVERLAY,
  en: SCIENCE_EN_OVERLAY,
};

function overlayMapForLocale(locale) {
  const id = resolveContentLocale({ contentLocale: locale });
  const chain = getContentFallbackChain(id);
  for (const loc of chain) {
    if (SCIENCE_OVERLAY_BY_LOCALE[loc]) return SCIENCE_OVERLAY_BY_LOCALE[loc];
  }
  return SCIENCE_EN_OVERLAY;
}

function overlayForQuestion(question, locale = "en") {
  const id = String(question?.id || "");
  if (!id) return null;
  const map = overlayMapForLocale(locale);
  return map?.[id] || null;
}

function applyOverlay(question, overlay) {
  if (!question) return question;
  let base = { ...question };
  if (overlay) {
    if (overlay.stem) base.stem = overlay.stem;
    if (overlay.question) base.question = overlay.question;
    if (overlay.options) base.options = [...overlay.options];
    if (overlay.explanation) base.explanation = overlay.explanation;
    if (overlay.theoryLines) base.theoryLines = [...overlay.theoryLines];
    if (typeof overlay.hint === "string") base.hint = overlay.hint;
    if (typeof overlay.feedback === "string") base.feedback = overlay.feedback;
  } else {
    base = translateScienceFields(base);
  }
  return mapQuestionTextFields(base, (_field, value) => {
    const text = String(value ?? "");
    return containsHebrew(text) ? translateScienceText(text) : text;
  });
}

/** English display path (legacy name). */
export function localizeScienceQuestionEn(question) {
  return applyOverlay(question, overlayForQuestion(question, "en"));
}

export function localizeScienceQuestionForLocale(question, locale = "en") {
  const resolved = resolveContentLocale({ contentLocale: locale, subject: "science" });
  return applyOverlay(question, overlayForQuestion(question, resolved));
}

export function localizeScienceBankForLocale(rows, locale = "en") {
  if (!Array.isArray(rows)) return rows;
  const resolved = resolveContentLocale({ contentLocale: locale, subject: "science" });
  return rows.map((row) => localizeScienceQuestionForLocale(row, resolved));
}
