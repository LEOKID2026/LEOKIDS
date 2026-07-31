import {
  MATH_G3_BOOK_BATCHES,
  MATH_G3_PAGE_ORDER,
  MATH_G3_BOOK_META,
  getMathG3PageNeighbors,
  isValidMathG3PageId,
} from "./math-g3-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: MATH_G3_BOOK_BATCHES,
  pageOrder: MATH_G3_PAGE_ORDER,
  meta: MATH_G3_BOOK_META,
  getPageNeighbors: getMathG3PageNeighbors,
  isValidPageId: isValidMathG3PageId,
});

export const loadMathG3Page = _exports.loadPage;
export const loadAllMathG3Pages = _exports.loadAllPages;
export const loadMathG3TocEntries = _exports.loadTocEntries;
export const getMathG3StaticPaths = _exports.getStaticPaths;
