import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 6 Science Learning Book — internal TOC registry.
 * Content files: docs/learning-book/science/g6/drafts/{pageId}.md
 * Note: plants excluded (spine maxGrade 3).
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} ScienceG6Batch */

/** @type {ScienceG6Batch[]} */
const SCIENCE_G6_BOOK_BATCHES_RAW = [
  { id: "a", title: "The Human Body and more", titleHe: "The Human Body and more", pages: ["body", "animals"] },
  {
    id: "b",
    title: "Materials and more", titleHe: "Materials and more",
    pages: ["materials", "earth_space", "environment"],
  },
  { id: "c", title: "Science Project [DRAFT — not owner-approved]", titleHe: "Science Project [DRAFT — not owner-approved]", pages: ["experiments"] },
];


const _SCIENCE_G6_SEQUENCE = createSequencedBookExports("science", "g6", SCIENCE_G6_BOOK_BATCHES_RAW);
export const SCIENCE_G6_PAGE_ORDER = _SCIENCE_G6_SEQUENCE.pageOrder;
export const SCIENCE_G6_BOOK_BATCHES = _SCIENCE_G6_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getScienceG6PageNeighbors(pageId) {
  return _SCIENCE_G6_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidScienceG6PageId(pageId) {
  return _SCIENCE_G6_SEQUENCE.isValidPageId(pageId);
}

export const SCIENCE_G6_BOOK_META = Object.freeze({
  subject: "science",
  grade: "g6",
  routeBase: "/student/learning/book/science/g6",
  bookTitle: "Science — Grade 6", bookTitleHe: "Science — Grade 6",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/science/g6/drafts",
});

