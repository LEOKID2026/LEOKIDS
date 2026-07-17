/**
 * Grade 6 Geometry Learning Book — internal TOC registry.
 * Content files: docs/learning-book/geometry/g6/drafts/{pageId}.md
 */
import { createSequencedBookExports } from "./learning-book-sequence.js";
import { isPrismVolumeTriangleAllowed } from "../../utils/geometry-curriculum-gates.js";

/** @typedef {{ id: string, titleHe: string, pages: string[] }} GeometryG6Batch */

/** @type {GeometryG6Batch[]} */
const GEOMETRY_G6_BOOK_BATCHES_RAW = [
  {
    id: "a",
    title: "Perimeter of a Square and more", titleHe: "Perimeter of a Square and more",
    pages: [
      "square_perimeter",
      "triangle_perimeter",
      "square_area",
      "parallelogram_area",
      "trapezoid_area",
      "triangle_angles",
    ],
  },
  {
    id: "b",
    title: "Circumference of a Circle [DRAFT and more", titleHe: "Circumference of a Circle [DRAFT and more",
    pages: ["circle_perimeter", "circle_area"],
  },
  {
    id: "c",
    title: "Pythagorean Theorem and more", titleHe: "Pythagorean Theorem and more",
    pages: ["pythagoras_hyp", "pythagoras_leg"],
  },
  {
    id: "d",
    title: "Solids and more", titleHe: "Solids and more",
    pages: ["solids", "rectangular_prism_volume"],
  },
  {
    id: "e",
    title: "Volume of a Prism and more", titleHe: "Volume of a Prism and more",
    pages: ["prism_volume_rectangular", "prism_volume_triangle"],
  },
  {
    id: "f",
    title: "Volume of a Pyramid and more", titleHe: "Volume of a Pyramid and more",
    pages: ["pyramid_volume_square", "pyramid_volume_rectangular"],
  },
  {
    id: "g",
    title: "Volume of a Cylinder [DRAFT and more", titleHe: "Volume of a Cylinder [DRAFT and more",
    pages: ["cylinder_volume", "cone_volume", "sphere_volume"],
  },
];


const _GEOMETRY_G6_SEQUENCE = createSequencedBookExports("geometry", "g6", GEOMETRY_G6_BOOK_BATCHES_RAW);
export const GEOMETRY_G6_PAGE_ORDER = _GEOMETRY_G6_SEQUENCE.pageOrder;
export const GEOMETRY_G6_BOOK_BATCHES = _GEOMETRY_G6_SEQUENCE.batches;

/** Pages reachable in product while teach-path gates apply. */
export function getGeometryG6AccessiblePageOrder() {
  if (isPrismVolumeTriangleAllowed()) return GEOMETRY_G6_PAGE_ORDER;
  return GEOMETRY_G6_PAGE_ORDER.filter((pageId) => pageId !== "prism_volume_triangle");
}

/** TOC batches with gated pages removed from navigation. */
export function getGeometryG6AccessibleBookBatches() {
  const allowed = new Set(getGeometryG6AccessiblePageOrder());
  return GEOMETRY_G6_BOOK_BATCHES.map((batch) => ({
    ...batch,
    pages: batch.pages.filter((pageId) => allowed.has(pageId)),
  })).filter((batch) => batch.pages.length > 0);
}

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getGeometryG6PageNeighbors(pageId) {
  const order = getGeometryG6AccessiblePageOrder();
  const index = order.indexOf(pageId);
  if (index === -1) {
    return { prev: null, next: null, index: -1 };
  }
  return {
    prev: index > 0 ? order[index - 1] : null,
    next: index < order.length - 1 ? order[index + 1] : null,
    index,
  };
}

export function isValidGeometryG6PageId(pageId) {
  return getGeometryG6AccessiblePageOrder().includes(pageId);
}

export const GEOMETRY_G6_BOOK_META = Object.freeze({
  subject: "geometry",
  grade: "g6",
  routeBase: "/student/learning/book/geometry/g6",
  bookTitle: "Geometry — Grade 6", bookTitleHe: "Geometry — Grade 6",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/geometry/g6/drafts",
});

