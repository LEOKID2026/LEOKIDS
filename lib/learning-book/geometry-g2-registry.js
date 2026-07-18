import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 2 Geometry Learning Book — internal TOC registry.
 * Content files: docs/learning-book/geometry/g2/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleKey: string, pages: string[] }} GeometryG2Batch */

/** @type {GeometryG2Batch[]} */
const GEOMETRY_G2_BOOK_BATCHES_RAW = [
  {
    id: "a",
    titleKey: "geometry.g2.a",
    pages: ["solids"],
  },
  {
    id: "b",
    titleKey: "geometry.g2.b",
    pages: ["square_area"],
  },
  {
    id: "c",
    titleKey: "geometry.g2.c",
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
  bookTitleKey: "geometry.g2.bookTitle",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/geometry/g2/drafts",
});

