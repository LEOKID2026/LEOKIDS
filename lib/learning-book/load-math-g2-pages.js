import {
  MATH_G2_BOOK_BATCHES,
  MATH_G2_PAGE_ORDER,
  MATH_G2_BOOK_META,
  getMathG2PageNeighbors,
  isValidMathG2PageId,
} from "./math-g2-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: MATH_G2_BOOK_BATCHES,
  pageOrder: MATH_G2_PAGE_ORDER,
  meta: MATH_G2_BOOK_META,
  getPageNeighbors: getMathG2PageNeighbors,
  isValidPageId: isValidMathG2PageId,
});

export const loadMathG2Page = _exports.loadPage;
export const loadAllMathG2Pages = _exports.loadAllPages;
export const loadMathG2TocEntries = _exports.loadTocEntries;
export const getMathG2StaticPaths = _exports.getStaticPaths;
