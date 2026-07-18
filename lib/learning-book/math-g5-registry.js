import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 5 Math Learning Book — internal TOC registry.
 * Content files: docs/learning-book/math/g5/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleKey: string, pages: string[] }} MathG5Batch */

/** @type {MathG5Batch[]} */
const MATH_G5_BOOK_BATCHES_RAW = [
  {
    id: "a",
    titleKey: "math.g5.a",
    pages: [
      "ns_place_hundreds",
      "ns_neighbors",
      "ns_complement100",
      "cmp",
      "sequence",
      "round",
    ],
  },
  {
    id: "b",
    titleKey: "math.g5.b",
    pages: ["add_two", "sub_two", "add_three", "mul"],
  },
  {
    id: "c",
    titleKey: "math.g5.c",
    pages: ["div", "div_with_remainder", "div_two_digit"],
  },
  {
    id: "d",
    titleKey: "math.g5.d",
    pages: [
      "frac_reduce",
      "frac_expand",
      "frac_add_sub",
      "mixed_to_frac",
      "frac_to_mixed",
    ],
  },
  {
    id: "e",
    titleKey: "math.g5.e",
    pages: ["dec_add", "dec_sub", "eq_add", "eq_sub", "eq_mul", "eq_div"],
  },
  {
    id: "f",
    titleKey: "math.g5.f",
    pages: [
      "fm_factor",
      "fm_multiple",
      "fm_gcd",
      "est_add",
      "est_mul",
      "est_quantity",
    ],
  },
  {
    id: "g",
    titleKey: "math.g5.g",
    pages: ["perc_part_of", "perc_discount"],
  },
  {
    id: "h",
    titleKey: "math.g5.h",
    pages: [
      "wp_comparison_more",
      "wp_leftover",
      "wp_time_sum",
      "wp_multi_step",
      "wp_distance_time",
      "wp_shop_discount",
      "wp_unit_cm_to_m",
      "wp_unit_g_to_kg",
    ],
  },
];


const _MATH_G5_SEQUENCE = createSequencedBookExports("math", "g5", MATH_G5_BOOK_BATCHES_RAW);
export const MATH_G5_PAGE_ORDER = _MATH_G5_SEQUENCE.pageOrder;
export const MATH_G5_BOOK_BATCHES = _MATH_G5_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getMathG5PageNeighbors(pageId) {
  return _MATH_G5_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidMathG5PageId(pageId) {
  return _MATH_G5_SEQUENCE.isValidPageId(pageId);
}

export const MATH_G5_BOOK_META = Object.freeze({
  subject: "math",
  grade: "g5",
  routeBase: "/student/learning/book/math/g5",
  bookTitleKey: "math.g5.bookTitle",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/math/g5/drafts",
});

