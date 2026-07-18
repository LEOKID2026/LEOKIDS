import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 3 Math Learning Book — internal TOC registry.
 * Content files: docs/learning-book/math/g3/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleKey: string, pages: string[] }} MathG3Batch */

/** @type {MathG3Batch[]} */
const MATH_G3_BOOK_BATCHES_RAW = [
  {
    id: "a",
    titleKey: "math.g3.a",
    pages: [
      "ns_place_hundreds",
      "ns_neighbors",
      "ns_complement10",
      "ns_complement100",
      "ns_even_odd",
      "cmp",
      "sequence",
    ],
  },
  {
    id: "b",
    titleKey: "math.g3.b",
    pages: [
      "add_two",
      "sub_two",
      "add_three",
      "mul",
      "mul_tens",
      "mul_hundreds",
      "div",
      "div_with_remainder",
      "divisibility",
    ],
  },
  {
    id: "c",
    titleKey: "math.g3.c",
    pages: ["fractions"],
  },
  {
    id: "d",
    titleKey: "math.g3.d",
    pages: [
      "eq_add",
      "eq_sub",
      "dec_add",
      "dec_sub",
      "order_add_mul",
      "order_mul_sub",
      "order_parentheses",
    ],
  },
  {
    id: "e",
    titleKey: "math.g3.e",
    pages: ["wp_comparison_more", "wp_leftover", "wp_time_sum"],
  },
];


const _MATH_G3_SEQUENCE = createSequencedBookExports("math", "g3", MATH_G3_BOOK_BATCHES_RAW);
export const MATH_G3_PAGE_ORDER = _MATH_G3_SEQUENCE.pageOrder;
export const MATH_G3_BOOK_BATCHES = _MATH_G3_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getMathG3PageNeighbors(pageId) {
  return _MATH_G3_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidMathG3PageId(pageId) {
  return _MATH_G3_SEQUENCE.isValidPageId(pageId);
}

export const MATH_G3_BOOK_META = Object.freeze({
  subject: "math",
  grade: "g3",
  routeBase: "/student/learning/book/math/g3",
  bookTitleKey: "math.g3.bookTitle",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/math/g3/drafts",
});

