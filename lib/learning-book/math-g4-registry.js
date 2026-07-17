import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 4 Math Learning Book — internal TOC registry.
 * Content files: docs/learning-book/math/g4/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} MathG4Batch */

/** @type {MathG4Batch[]} */
const MATH_G4_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "Place Value and more", titleHe: "Place Value and more",
    pages: [
      "ns_place_hundreds",
      "ns_neighbors",
      "ns_complement100",
      "ns_complement10",
      "ns_even_odd",
      "cmp",
      "sequence",
      "round",
    ],
  },
  {
    id: "b",
    title: "Adding with 0 and more", titleHe: "Adding with 0 and more",
    pages: ["zero_add", "zero_sub", "zero_mul", "one_mul"],
  },
  {
    id: "c",
    title: "Adding Two Numbers and more", titleHe: "Adding Two Numbers and more",
    pages: ["add_two", "sub_two", "add_three", "mul", "mul_vertical"],
  },
  {
    id: "d",
    title: "Division and more", titleHe: "Division and more",
    pages: [
      "div",
      "div_with_remainder",
      "div_long",
      "divisibility",
      "prime_composite",
      "fm_factor",
      "fm_multiple",
      "fm_gcd",
    ],
  },
  {
    id: "e",
    title: "Adding Decimals and more", titleHe: "Adding Decimals and more",
    pages: [
      "dec_add",
      "dec_sub",
      "eq_add",
      "eq_sub",
      "est_add",
      "est_mul",
      "est_quantity",
    ],
  },
  {
    id: "f",
    title: "Powers and more", titleHe: "Powers and more",
    pages: ["power_base", "power_calc"],
  },
  {
    id: "g",
    title: "Word Problems and more", titleHe: "Word Problems and more",
    pages: ["wp_comparison_more", "wp_leftover", "wp_time_sum"],
  },
];


const _MATH_G4_SEQUENCE = createSequencedBookExports("math", "g4", MATH_G4_BOOK_BATCHES_RAW);
export const MATH_G4_PAGE_ORDER = _MATH_G4_SEQUENCE.pageOrder;
export const MATH_G4_BOOK_BATCHES = _MATH_G4_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getMathG4PageNeighbors(pageId) {
  return _MATH_G4_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidMathG4PageId(pageId) {
  return _MATH_G4_SEQUENCE.isValidPageId(pageId);
}

export const MATH_G4_BOOK_META = Object.freeze({
  subject: "math",
  grade: "g4",
  routeBase: "/student/learning/book/math/g4",
  bookTitle: "Math — Grade 4", bookTitleHe: "Math — Grade 4",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/math/g4/drafts",
});

