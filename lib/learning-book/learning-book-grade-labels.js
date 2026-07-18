/** Locale-aware grade labels for Global learning book UI. */

import bookUi from "../../content-packs/en/books/ui.json" with { type: "json" };
import { bookUiCopy, bookUiCopyForLocale } from "./book-pack-copy.js";

/** @type {Record<string, string>} */
export const GRADE_SHORT_LABELS = Object.freeze(
  Object.fromEntries(
    Object.keys(bookUi.grades || {}).map((grade) => [grade, bookUiCopy("grades", grade)]),
  ),
);

/** @type {Record<string, string>} */
export const GRADE_LONG_LABELS = Object.freeze({ ...GRADE_SHORT_LABELS });

/** @param {string} grade */
export function getGradeShortLabel(grade, contentLocale = "en") {
  const key = String(grade || "").toLowerCase();
  return bookUiCopyForLocale(contentLocale, "grades", key) || grade;
}

/** @param {string} grade */
export function getGradeLongLabel(grade, contentLocale = "en") {
  return getGradeShortLabel(grade, contentLocale);
}
