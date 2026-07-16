import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import { translateScienceFields, translateScienceText } from "./science-translate.js";

function overlayForQuestion(question) {
  const id = String(question?.id || "");
  return id ? SCIENCE_EN_OVERLAY[id] : null;
}

export function localizeScienceQuestionEn(question) {
  if (!question) return question;
  const overlay = overlayForQuestion(question);
  let base = { ...question };
  if (overlay) {
    if (overlay.stem) base.stem = overlay.stem;
    if (overlay.question) base.question = overlay.question;
    if (overlay.options) base.options = [...overlay.options];
    if (overlay.explanation) base.explanation = overlay.explanation;
    if (overlay.theoryLines) base.theoryLines = [...overlay.theoryLines];
  } else {
    base = translateScienceFields(base);
  }
  return mapQuestionTextFields(base, (_field, value) => {
    const text = String(value ?? "");
    return containsHebrew(text) ? translateScienceText(text) : text;
  });
}

export function localizeScienceBankForLocale(rows, locale = "en") {
  if (locale !== "en" || !Array.isArray(rows)) return rows;
  return rows.map((row) => localizeScienceQuestionEn(row));
}
