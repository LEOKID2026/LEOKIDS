import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 1 Math Learning Book — internal TOC registry (preview slice only).
 * Content files: docs/learning-book/math/g1/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleKey: string, pages: string[] }} MathG1Batch */

/** @type {MathG1Batch[]} */
const MATH_G1_BOOK_BATCHES_RAW = [
  {
    id: "a",
    titleKey: "math.g1.a",
    pages: [
      "ns_counting_forward",
      "ns_counting_backward",
      "ns_number_line",
      "ns_neighbors",
      "cmp",
    ],
  },
  {
    id: "b",
    titleKey: "math.g1.b",
    pages: [
      "ns_place_tens_units",
      "ns_even_odd",
      "ns_complement10",
      "add_second_decade",
      "add_tens_only",
    ],
  },
  {
    id: "c",
    titleKey: "math.g1.c",
    pages: [
      "add_two",
      "sub_two",
      "eq_add_simple",
      "eq_sub_simple",
      "mul",
    ],
  },
  {
    id: "d",
    titleKey: "math.g1.d",
    pages: [
      "wp_coins",
      "wp_coins_spent",
      "wp_time_date",
      "wp_time_days",
    ],
  },
];


const _MATH_G1_SEQUENCE = createSequencedBookExports("math", "g1", MATH_G1_BOOK_BATCHES_RAW);
export const MATH_G1_PAGE_ORDER = _MATH_G1_SEQUENCE.pageOrder;
export const MATH_G1_BOOK_BATCHES = _MATH_G1_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getMathG1PageNeighbors(pageId) {
  return _MATH_G1_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidMathG1PageId(pageId) {
  return _MATH_G1_SEQUENCE.isValidPageId(pageId);
}

export const MATH_G1_BOOK_META = Object.freeze({
  subject: "math",
  grade: "g1",
  routeBase: "/student/learning/book/math/g1",
  bookTitleKey: "math.g1.bookTitle",
  draftsDir: "docs/learning-book/math/g1/drafts",
});

