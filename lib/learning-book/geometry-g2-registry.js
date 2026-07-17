import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 2 Geometry Learning Book — internal TOC registry.
 * Content files: docs/learning-book/geometry/g2/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} GeometryG2Batch */

/** @type {GeometryG2Batch[]} */
const GEOMETRY_G2_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "Three-Dimensional Solids — Names and Introduction [DRAFT — not owner-approved]", titleHe: "Three-Dimensional Solids — Names and Introduction [DRAFT — not owner-approved]",
    pages: ["solids"],
  },
  {
    id: "b",
    title: "Area of a Square [DRAFT — not owner-approved]", titleHe: "Area of a Square [DRAFT — not owner-approved]",
    pages: ["square_area"],
  },
  {
    id: "c",
    title: "Translation and Reflection — More Practice [DRAFT — not owner-approved]", titleHe: "Translation and Reflection — More Practice [DRAFT — not owner-approved]",
    pages: ["transformations"],
  },
];


const _GEOMETRY_G2_SEQUENCE = createSequencedBookExports("geometry", "g2", GEOMETRY_G2_BOOK_BATCHES_RAW);
export const GEOMETRY_G2_PAGE_ORDER = _GEOMETRY_G2_SEQUENCE.pageOrder;
export const GEOMETRY_G2_BOOK_BATCHES = _GEOMETRY_G2_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getGeometryG2PageNeighbors(pageId) {
  return _GEOMETRY_G2_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidGeometryG2PageId(pageId) {
  return _GEOMETRY_G2_SEQUENCE.isValidPageId(pageId);
}

export const GEOMETRY_G2_BOOK_META = Object.freeze({
  subject: "geometry",
  grade: "g2",
  routeBase: "/student/learning/book/geometry/g2",
  bookTitle: "Geometry — Grade 2", bookTitleHe: "Geometry — Grade 2",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/geometry/g2/drafts",
});

