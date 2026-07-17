import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 3 Math Learning Book — internal TOC registry.
 * Content files: docs/learning-book/math/g3/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} MathG3Batch */

/** @type {MathG3Batch[]} */
const MATH_G3_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "Hundreds, Tens, and Ones and more", titleHe: "Hundreds, Tens, and Ones and more",
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
    title: "Adding Two Numbers and more", titleHe: "Adding Two Numbers and more",
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
    title: "Fractions — What Are They and How Do We Compare?", titleHe: "Fractions — What Are They and How Do We Compare?",
    pages: ["fractions"],
  },
  {
    id: "d",
    title: "Addition Equation and more", titleHe: "Addition Equation and more",
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
    title: "Word Problem and more", titleHe: "Word Problem and more",
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
  bookTitle: "Math — Grade 3", bookTitleHe: "Math — Grade 3",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/math/g3/drafts",
});

