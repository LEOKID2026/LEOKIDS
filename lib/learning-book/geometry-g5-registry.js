import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 5 Geometry Learning Book — internal TOC registry.
 * Content files: docs/learning-book/geometry/g5/drafts/{pageId}.md
 *
 * Official sequence (kita5.pdf): § ד.4 גבהים → § ה. מדידות שטחים / נוסחאות שטח.
 */

/** @typedef {{ id: string, titleKey: string, pages: string[] }} GeometryG5Batch */

/** @type {GeometryG5Batch[]} */
const GEOMETRY_G5_BOOK_BATCHES_RAW = [
  {
    id: "a",
    titleKey: "geometry.g5.a",
    pages: ["parallel_perpendicular", "quadrilaterals", "triangle_angles"],
  },
  {
    id: "b",
    titleKey: "geometry.g5.b",
    pages: ["square_perimeter", "triangle_perimeter"],
  },
  {
    id: "c",
    titleKey: "geometry.g5.c",
    pages: ["heights_triangle", "heights_parallelogram", "heights_trapezoid"],
  },
  {
    id: "d",
    titleKey: "geometry.g5.d",
    pages: ["square_area", "triangle_area", "parallelogram_area", "trapezoid_area"],
  },
  {
    id: "e",
    titleKey: "geometry.g5.e",
    pages: ["diagonal_square", "diagonal_rectangle", "diagonal_parallelogram"],
  },
  {
    id: "f",
    titleKey: "geometry.g5.f",
    pages: ["solids", "rectangular_prism_volume"],
  },
  {
    id: "g",
    titleKey: "geometry.g5.g",
    pages: ["tiling"],
  },
];


const _GEOMETRY_G5_SEQUENCE = createSequencedBookExports("geometry", "g5", GEOMETRY_G5_BOOK_BATCHES_RAW);
export const GEOMETRY_G5_PAGE_ORDER = _GEOMETRY_G5_SEQUENCE.pageOrder;
export const GEOMETRY_G5_BOOK_BATCHES = _GEOMETRY_G5_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getGeometryG5PageNeighbors(pageId) {
  return _GEOMETRY_G5_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidGeometryG5PageId(pageId) {
  return _GEOMETRY_G5_SEQUENCE.isValidPageId(pageId);
}

export const GEOMETRY_G5_BOOK_META = Object.freeze({
  subject: "geometry",
  grade: "g5",
  routeBase: "/student/learning/book/geometry/g5",
  bookTitleKey: "geometry.g5.bookTitle",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/geometry/g5/drafts",
});

