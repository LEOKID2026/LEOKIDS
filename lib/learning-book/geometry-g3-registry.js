import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 3 Geometry Learning Book — internal TOC registry.
 * Content files: docs/learning-book/geometry/g3/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} GeometryG3Batch */

/** @type {GeometryG3Batch[]} */
const GEOMETRY_G3_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "Types of Triangles [DRAFT and more", titleHe: "Types of Triangles [DRAFT and more",
    pages: ["triangles", "quadrilaterals"],
  },
  {
    id: "b",
    title: "Parallel and Perpendicular Lines [DRAFT — not owner-approved]", titleHe: "Parallel and Perpendicular Lines [DRAFT — not owner-approved]",
    pages: ["parallel_perpendicular"],
  },
  {
    id: "c",
    title: "Area of a Square and more", titleHe: "Area of a Square and more",
    pages: ["square_area", "square_perimeter", "triangle_perimeter"],
  },
  {
    id: "d",
    title: "Angles in a Triangle [DRAFT — not owner-approved]", titleHe: "Angles in a Triangle [DRAFT — not owner-approved]",
    pages: ["triangle_angles"],
  },
  {
    id: "e",
    title: "Rotation in the Plane [DRAFT and more", titleHe: "Rotation in the Plane [DRAFT and more",
    pages: ["rotation", "solids"],
  },
];


const _GEOMETRY_G3_SEQUENCE = createSequencedBookExports("geometry", "g3", GEOMETRY_G3_BOOK_BATCHES_RAW);
export const GEOMETRY_G3_PAGE_ORDER = _GEOMETRY_G3_SEQUENCE.pageOrder;
export const GEOMETRY_G3_BOOK_BATCHES = _GEOMETRY_G3_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getGeometryG3PageNeighbors(pageId) {
  return _GEOMETRY_G3_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidGeometryG3PageId(pageId) {
  return _GEOMETRY_G3_SEQUENCE.isValidPageId(pageId);
}

export const GEOMETRY_G3_BOOK_META = Object.freeze({
  subject: "geometry",
  grade: "g3",
  routeBase: "/student/learning/book/geometry/g3",
  bookTitle: "Geometry — Grade 3", bookTitleHe: "Geometry — Grade 3",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/geometry/g3/drafts",
});

