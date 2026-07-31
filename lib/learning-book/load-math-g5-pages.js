import {
  MATH_G5_BOOK_BATCHES,
  MATH_G5_PAGE_ORDER,
  MATH_G5_BOOK_META,
  getMathG5PageNeighbors,
  isValidMathG5PageId,
} from "./math-g5-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: MATH_G5_BOOK_BATCHES,
  pageOrder: MATH_G5_PAGE_ORDER,
  meta: MATH_G5_BOOK_META,
  getPageNeighbors: getMathG5PageNeighbors,
  isValidPageId: isValidMathG5PageId,
});

export const loadMathG5Page = _exports.loadPage;
export const loadAllMathG5Pages = _exports.loadAllPages;
export const loadMathG5TocEntries = _exports.loadTocEntries;
export const getMathG5StaticPaths = _exports.getStaticPaths;
