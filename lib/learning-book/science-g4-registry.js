import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 4 Science Learning Book — internal TOC registry.
 * Content files: docs/learning-book/science/g4/drafts/{pageId}.md
 * Note: plants excluded (spine maxGrade 3).
 */

/** @typedef {{ id: string, titleKey: string, pages: string[] }} ScienceG4Batch */

/** @type {ScienceG4Batch[]} */
const SCIENCE_G4_BOOK_BATCHES_RAW = [
  {
    id: "a",
    titleKey: "science.g4.a",
    pages: ["body", "animals"],
  },
  {
    id: "b",
    titleKey: "science.g4.b",
    pages: ["materials", "earth_space", "environment"],
  },
  { id: "c", titleKey: "science.g4.c", pages: ["experiments"] },
];


const _SCIENCE_G4_SEQUENCE = createSequencedBookExports("science", "g4", SCIENCE_G4_BOOK_BATCHES_RAW);
export const SCIENCE_G4_PAGE_ORDER = _SCIENCE_G4_SEQUENCE.pageOrder;
export const SCIENCE_G4_BOOK_BATCHES = _SCIENCE_G4_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getScienceG4PageNeighbors(pageId) {
  return _SCIENCE_G4_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidScienceG4PageId(pageId) {
  return _SCIENCE_G4_SEQUENCE.isValidPageId(pageId);
}

export const SCIENCE_G4_BOOK_META = Object.freeze({
  subject: "science",
  grade: "g4",
  routeBase: "/student/learning/book/science/g4",
  bookTitleKey: "science.g4.bookTitle",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/science/g4/drafts",
});

