/** English display labels for parent subject permissions panel. */

/** @type {Record<string, string>} */
export const SUBJECT_PERMISSION_LABELS_EN = Object.freeze({
  math: "Math",
  geometry: "Geometry",
  english: "English",
  science: "Science",
});

/** @deprecated use SUBJECT_PERMISSION_LABELS_EN */
export const SUBJECT_PERMISSION_LABELS_HE = SUBJECT_PERMISSION_LABELS_EN;

/**
 * @param {string} subjectKey
 */
export function getSubjectPermissionLabelHe(subjectKey) {
  return SUBJECT_PERMISSION_LABELS_EN[subjectKey] || subjectKey;
}
