import { createSequencedBookExports } from "./learning-book-sequence.js";
/**
 * Grade 4 Geometry Learning Book — internal TOC registry.
 * Content files: docs/learning-book/geometry/g4/drafts/{pageId}.md
 */

/** @typedef {{ id: string, titleHe: string, pages: string[] }} GeometryG4Batch */

/** @type {GeometryG4Batch[]} */
const GEOMETRY_G4_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "Properties of a Square and more", titleHe: "Properties of a Square and more",
    pages: [
      "shapes_basic_properties_square",
      "shapes_basic_properties_rectangle",
      "shapes_basic_properties_angles",
      "symmetry",
    ],
  },
  {
    id: "b",
    title: "Quadrilaterals and more", titleHe: "Quadrilaterals and more",
    pages: ["quadrilaterals", "parallel_perpendicular"],
  },
  {
    id: "c",
    title: "Perimeter of a Square and more", titleHe: "Perimeter of a Square and more",
    pages: [
      "square_perimeter",
      "square_area",
      "triangle_perimeter",
      "triangle_angles",
    ],
  },
  {
    id: "d",
    title: "Diagonal of a Square [DRAFT and more", titleHe: "Diagonal of a Square [DRAFT and more",
    pages: ["diagonal_square", "diagonal_rectangle"],
  },
  {
    id: "e",
    title: "Solids and more", titleHe: "Solids and more",
    pages: ["solids", "rectangular_prism_volume"],
  },
];


const _GEOMETRY_G4_SEQUENCE = createSequencedBookExports("geometry", "g4", GEOMETRY_G4_BOOK_BATCHES_RAW);
export const GEOMETRY_G4_PAGE_ORDER = _GEOMETRY_G4_SEQUENCE.pageOrder;
export const GEOMETRY_G4_BOOK_BATCHES = _GEOMETRY_G4_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getGeometryG4PageNeighbors(pageId) {
  return _GEOMETRY_G4_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidGeometryG4PageId(pageId) {
  return _GEOMETRY_G4_SEQUENCE.isValidPageId(pageId);
}

export const GEOMETRY_G4_BOOK_META = Object.freeze({
  subject: "geometry",
  grade: "g4",
  routeBase: "/student/learning/book/geometry/g4",
  bookTitle: "Geometry — Grade 4", bookTitleHe: "Geometry — Grade 4",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/geometry/g4/drafts",
});

