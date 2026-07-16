import { SUBJECT_PERMISSION_KEYS } from "./subject-key-map.js";
import { SUBJECT_PERMISSION_LABELS_HE } from "./subject-permission-labels.js";

/** @type {readonly string[]} */
export const REGISTERED_GRADE_KEYS = Object.freeze(["g1", "g2", "g3", "g4", "g5", "g6"]);

/**
 * Source manifest for resolver build only — not used at runtime for enforcement.
 * @type {Array<{
 *   subjectKey: string,
 *   displayNameHe: string,
 *   sortOrder: number,
 *   primarySources: Array<{ exportName: string, module: string }>,
 *   secondarySources: Array<{ exportName: string, module: string }>,
 *   architecturalNotes?: string[],
 * }>}
 */
export const SUBJECT_GRADE_SOURCE_MANIFEST = [
  {
    subjectKey: "math",
    displayNameHe: SUBJECT_PERMISSION_LABELS_HE.math,
    sortOrder: 1,
    primarySources: [{ exportName: "GRADES", module: "utils/math-constants.js" }],
    secondarySources: [
      { exportName: "LEARNING_BOOK_META_LIST", module: "lib/learning-book/learning-book-catalog-meta.js" },
    ],
  },
  {
    subjectKey: "geometry",
    displayNameHe: SUBJECT_PERMISSION_LABELS_HE.geometry,
    sortOrder: 2,
    primarySources: [{ exportName: "GRADES", module: "utils/geometry-constants.js" }],
    secondarySources: [
      { exportName: "LEARNING_BOOK_META_LIST", module: "lib/learning-book/learning-book-catalog-meta.js" },
    ],
  },
  {
    subjectKey: "english",
    displayNameHe: SUBJECT_PERMISSION_LABELS_HE.english,
    sortOrder: 3,
    primarySources: [
      { exportName: "ENGLISH_GRADE_ORDER", module: "data/english-curriculum.js" },
    ],
    secondarySources: [
      { exportName: "LEARNING_BOOK_META_LIST", module: "lib/learning-book/learning-book-catalog-meta.js" },
    ],
  },
  {
    subjectKey: "science",
    displayNameHe: SUBJECT_PERMISSION_LABELS_HE.science,
    sortOrder: 4,
    primarySources: [
      { exportName: "SCIENCE_GRADE_ORDER", module: "data/science-curriculum.js" },
    ],
    secondarySources: [
      { exportName: "LEARNING_BOOK_META_LIST", module: "lib/learning-book/learning-book-catalog-meta.js" },
    ],
  },
];

export { SUBJECT_PERMISSION_KEYS };
