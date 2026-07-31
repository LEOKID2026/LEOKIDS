import {
  GEOMETRY_G5_BOOK_BATCHES,
  GEOMETRY_G5_PAGE_ORDER,
  GEOMETRY_G5_BOOK_META,
  getGeometryG5PageNeighbors,
  isValidGeometryG5PageId,
} from "./geometry-g5-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: GEOMETRY_G5_BOOK_BATCHES,
  pageOrder: GEOMETRY_G5_PAGE_ORDER,
  meta: GEOMETRY_G5_BOOK_META,
  getPageNeighbors: getGeometryG5PageNeighbors,
  isValidPageId: isValidGeometryG5PageId,
});

export const loadGeometryG5Page = _exports.loadPage;
export const loadAllGeometryG5Pages = _exports.loadAllPages;
export const loadGeometryG5TocEntries = _exports.loadTocEntries;
export const getGeometryG5StaticPaths = _exports.getStaticPaths;
