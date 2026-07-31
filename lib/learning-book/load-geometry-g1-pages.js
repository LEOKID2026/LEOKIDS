import {
  GEOMETRY_G1_BOOK_BATCHES,
  GEOMETRY_G1_PAGE_ORDER,
  GEOMETRY_G1_BOOK_META,
  getGeometryG1PageNeighbors,
  isValidGeometryG1PageId,
} from "./geometry-g1-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: GEOMETRY_G1_BOOK_BATCHES,
  pageOrder: GEOMETRY_G1_PAGE_ORDER,
  meta: GEOMETRY_G1_BOOK_META,
  getPageNeighbors: getGeometryG1PageNeighbors,
  isValidPageId: isValidGeometryG1PageId,
});

export const loadGeometryG1Page = _exports.loadPage;
export const loadAllGeometryG1Pages = _exports.loadAllPages;
export const loadGeometryG1TocEntries = _exports.loadTocEntries;
export const getGeometryG1StaticPaths = _exports.getStaticPaths;
