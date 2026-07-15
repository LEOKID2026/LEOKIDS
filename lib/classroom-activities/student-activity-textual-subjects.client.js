/**
 * Textual assigned-activity subjects (not math / not geometry).
 */

/** @type {readonly string[]} */
export const TEXTUAL_ASSIGNED_ACTIVITY_SUBJECT_IDS = Object.freeze([
  "english",
  "science",
]);

const TEXTUAL_SUBJECT_SET = new Set(TEXTUAL_ASSIGNED_ACTIVITY_SUBJECT_IDS);

/**
 * @param {unknown} subject
 * @returns {string}
 */
export function normalizeAssignedActivitySubjectKey(subject) {
  const key = String(subject || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (!key) return "";
  return key;
}

/**
 * True only for textual play paths. Never true for math/geometry.
 * @param {unknown} subject
 */
export function isTextualAssignedActivitySubject(subject) {
  return TEXTUAL_SUBJECT_SET.has(normalizeAssignedActivitySubjectKey(subject));
}
