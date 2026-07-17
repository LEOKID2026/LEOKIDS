import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 6 Math Learning Book — internal TOC registry.
 * Content files: docs/learning-book/math/g6/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} MathG6Batch */

/** @type {MathG6Batch[]} */
const MATH_G6_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "Place Value and more", titleHe: "Place Value and more",
    pages: ["ns_place_hundreds", "ns_neighbors", "ns_complement100", "cmp", "sequence", "round"],
  },
  {
    id: "b",
    title: "Adding Two Numbers and more", titleHe: "Adding Two Numbers and more",
    pages: ["add_two", "sub_two", "add_three", "mul", "div", "div_with_remainder"],
  },
  {
    id: "c",
    title: "Factors of a Number and more", titleHe: "Factors of a Number and more",
    pages: ["fm_factor", "fm_multiple", "fm_gcd"],
  },
  {
    id: "d",
    title: "Addition Equation and more", titleHe: "Addition Equation and more",
    pages: ["eq_add", "eq_sub", "eq_mul", "eq_div"],
  },
  {
    id: "e",
    title: "Adding Decimal Numbers and more", titleHe: "Adding Decimal Numbers and more",
    pages: [
      "dec_add",
      "dec_sub",
      "dec_multiply",
      "dec_multiply_10_100",
      "dec_divide",
      "dec_divide_10_100",
      "dec_repeating",
    ],
  },
  {
    id: "f",
    title: "A Fraction as Division and more", titleHe: "A Fraction as Division and more",
    pages: ["frac_as_division", "frac_multiply", "frac_divide"],
  },
  {
    id: "g",
    title: "Ratios and more", titleHe: "Ratios and more",
    pages: [
      "ratio_first",
      "ratio_second",
      "ratio_find",
      "scale_find",
      "scale_map_to_real",
      "scale_real_to_map",
    ],
  },
  {
    id: "h",
    title: "Percent of a Quantity and more", titleHe: "Percent of a Quantity and more",
    pages: ["perc_part_of", "perc_discount"],
  },
  {
    id: "i",
    title: "Word Problems and more", titleHe: "Word Problems and more",
    pages: [
      "wp_comparison_more",
      "wp_leftover",
      "wp_time_sum",
      "wp_distance_time",
      "wp_shop_discount",
      "wp_unit_cm_to_m",
      "wp_unit_g_to_kg",
    ],
  },
];


const _MATH_G6_SEQUENCE = createSequencedBookExports("math", "g6", MATH_G6_BOOK_BATCHES_RAW);
export const MATH_G6_PAGE_ORDER = _MATH_G6_SEQUENCE.pageOrder;
export const MATH_G6_BOOK_BATCHES = _MATH_G6_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getMathG6PageNeighbors(pageId) {
  return _MATH_G6_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidMathG6PageId(pageId) {
  return _MATH_G6_SEQUENCE.isValidPageId(pageId);
}

export const MATH_G6_BOOK_META = Object.freeze({
  subject: "math",
  grade: "g6",
  routeBase: "/student/learning/book/math/g6",
  bookTitle: "Math — Grade 6", bookTitleHe: "Math — Grade 6",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/math/g6/drafts",
});

