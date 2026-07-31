import {
  MATH_G4_BOOK_BATCHES,
  MATH_G4_PAGE_ORDER,
  MATH_G4_BOOK_META,
  getMathG4PageNeighbors,
  isValidMathG4PageId,
} from "./math-g4-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: MATH_G4_BOOK_BATCHES,
  pageOrder: MATH_G4_PAGE_ORDER,
  meta: MATH_G4_BOOK_META,
  getPageNeighbors: getMathG4PageNeighbors,
  isValidPageId: isValidMathG4PageId,
});

export const loadMathG4Page = _exports.loadPage;
export const loadAllMathG4Pages = _exports.loadAllPages;
export const loadMathG4TocEntries = _exports.loadTocEntries;
export const getMathG4StaticPaths = _exports.getStaticPaths;
