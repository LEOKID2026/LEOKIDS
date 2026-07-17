import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 3 Science Learning Book — internal TOC registry.
 * Content files: docs/learning-book/science/g3/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} ScienceG3Batch */

/** @type {ScienceG3Batch[]} */
const SCIENCE_G3_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "The Human Body and more", titleHe: "The Human Body and more",
    pages: ["body", "animals", "plants"],
  },
  {
    id: "b",
    title: "Materials and more", titleHe: "Materials and more",
    pages: ["materials", "earth_space", "environment"],
  },
  { id: "c", title: "A Short Scientific Experiment [DRAFT — not owner-approved]", titleHe: "A Short Scientific Experiment [DRAFT — not owner-approved]", pages: ["experiments"] },
];


const _SCIENCE_G3_SEQUENCE = createSequencedBookExports("science", "g3", SCIENCE_G3_BOOK_BATCHES_RAW);
export const SCIENCE_G3_PAGE_ORDER = _SCIENCE_G3_SEQUENCE.pageOrder;
export const SCIENCE_G3_BOOK_BATCHES = _SCIENCE_G3_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getScienceG3PageNeighbors(pageId) {
  return _SCIENCE_G3_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidScienceG3PageId(pageId) {
  return _SCIENCE_G3_SEQUENCE.isValidPageId(pageId);
}

export const SCIENCE_G3_BOOK_META = Object.freeze({
  subject: "science",
  grade: "g3",
  routeBase: "/student/learning/book/science/g3",
  bookTitle: "Science — Grade 3", bookTitleHe: "Science — Grade 3",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/science/g3/drafts",
});

