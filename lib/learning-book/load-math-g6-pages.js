import {
  MATH_G6_BOOK_BATCHES,
  MATH_G6_PAGE_ORDER,
  MATH_G6_BOOK_META,
  getMathG6PageNeighbors,
  isValidMathG6PageId,
} from "./math-g6-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: MATH_G6_BOOK_BATCHES,
  pageOrder: MATH_G6_PAGE_ORDER,
  meta: MATH_G6_BOOK_META,
  getPageNeighbors: getMathG6PageNeighbors,
  isValidPageId: isValidMathG6PageId,
});

export const loadMathG6Page = _exports.loadPage;
export const loadAllMathG6Pages = _exports.loadAllPages;
export const loadMathG6TocEntries = _exports.loadTocEntries;
export const getMathG6StaticPaths = _exports.getStaticPaths;
