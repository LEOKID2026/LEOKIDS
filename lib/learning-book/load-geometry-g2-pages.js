import {
  GEOMETRY_G2_BOOK_BATCHES,
  GEOMETRY_G2_PAGE_ORDER,
  GEOMETRY_G2_BOOK_META,
  getGeometryG2PageNeighbors,
  isValidGeometryG2PageId,
} from "./geometry-g2-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: GEOMETRY_G2_BOOK_BATCHES,
  pageOrder: GEOMETRY_G2_PAGE_ORDER,
  meta: GEOMETRY_G2_BOOK_META,
  getPageNeighbors: getGeometryG2PageNeighbors,
  isValidPageId: isValidGeometryG2PageId,
});

export const loadGeometryG2Page = _exports.loadPage;
export const loadAllGeometryG2Pages = _exports.loadAllPages;
export const loadGeometryG2TocEntries = _exports.loadTocEntries;
export const getGeometryG2StaticPaths = _exports.getStaticPaths;
