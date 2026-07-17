import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 5 Geometry Learning Book — internal TOC registry.
 * Content files: docs/learning-book/geometry/g5/drafts/{pageId}.md
 *
 * Official sequence (kita5.pdf): § ד.4 גבהים → § ה. מדידות שטחים / נוסחאות שטח.
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} GeometryG5Batch */

/** @type {GeometryG5Batch[]} */
const GEOMETRY_G5_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "Parallel and Perpendicular Lines and more", titleHe: "Parallel and Perpendicular Lines and more",
    pages: ["parallel_perpendicular", "quadrilaterals", "triangle_angles"],
  },
  {
    id: "b",
    title: "Perimeter of a Square and more", titleHe: "Perimeter of a Square and more",
    pages: ["square_perimeter", "triangle_perimeter"],
  },
  {
    id: "c",
    title: "Height of a Triangle and more", titleHe: "Height of a Triangle and more",
    pages: ["heights_triangle", "heights_parallelogram", "heights_trapezoid"],
  },
  {
    id: "d",
    title: "Area of a Square and more", titleHe: "Area of a Square and more",
    pages: ["square_area", "triangle_area", "parallelogram_area", "trapezoid_area"],
  },
  {
    id: "e",
    title: "Diagonal of a Square and more", titleHe: "Diagonal of a Square and more",
    pages: ["diagonal_square", "diagonal_rectangle", "diagonal_parallelogram"],
  },
  {
    id: "f",
    title: "Three-Dimensional Solids and more", titleHe: "Three-Dimensional Solids and more",
    pages: ["solids", "rectangular_prism_volume"],
  },
  {
    id: "g",
    title: "Tiling a Plane", titleHe: "Tiling a Plane",
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
  bookTitle: "Geometry — Grade 5", bookTitleHe: "Geometry — Grade 5",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/geometry/g5/drafts",
});

