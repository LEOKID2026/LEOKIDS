/** English grade labels for Global learning book UI. */

/** @type {Record<string, string>} */
export const GRADE_SHORT_LABELS = Object.freeze({
  g1: "Grade 1",
  g2: "Grade 2",
  g3: "Grade 3",
  g4: "Grade 4",
  g5: "Grade 5",
  g6: "Grade 6",
});

/** @type {Record<string, string>} */
export const GRADE_LONG_LABELS = Object.freeze({
  g1: "Grade 1",
  g2: "Grade 2",
  g3: "Grade 3",
  g4: "Grade 4",
  g5: "Grade 5",
  g6: "Grade 6",
});

/** @param {string} grade */
export function getGradeShortLabel(grade) {
  return GRADE_SHORT_LABELS[String(grade || "").toLowerCase()] ?? grade;
}

/** @param {string} grade */
export function getGradeLongLabel(grade) {
  return GRADE_LONG_LABELS[String(grade || "").toLowerCase()] ?? grade;
}
