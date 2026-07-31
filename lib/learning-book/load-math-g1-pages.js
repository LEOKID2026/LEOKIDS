import {
  MATH_G1_BOOK_BATCHES,
  MATH_G1_PAGE_ORDER,
  MATH_G1_BOOK_META,
  getMathG1PageNeighbors,
  isValidMathG1PageId,
} from "./math-g1-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: MATH_G1_BOOK_BATCHES,
  pageOrder: MATH_G1_PAGE_ORDER,
  meta: MATH_G1_BOOK_META,
  getPageNeighbors: getMathG1PageNeighbors,
  isValidPageId: isValidMathG1PageId,
});

export const loadMathG1Page = _exports.loadPage;
export const loadAllMathG1Pages = _exports.loadAllPages;
export const loadMathG1TocEntries = _exports.loadTocEntries;
export const getMathG1StaticPaths = _exports.getStaticPaths;
