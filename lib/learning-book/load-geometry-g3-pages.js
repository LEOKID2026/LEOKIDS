import {
  GEOMETRY_G3_BOOK_BATCHES,
  GEOMETRY_G3_PAGE_ORDER,
  GEOMETRY_G3_BOOK_META,
  getGeometryG3PageNeighbors,
  isValidGeometryG3PageId,
} from "./geometry-g3-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: GEOMETRY_G3_BOOK_BATCHES,
  pageOrder: GEOMETRY_G3_PAGE_ORDER,
  meta: GEOMETRY_G3_BOOK_META,
  getPageNeighbors: getGeometryG3PageNeighbors,
  isValidPageId: isValidGeometryG3PageId,
});

export const loadGeometryG3Page = _exports.loadPage;
export const loadAllGeometryG3Pages = _exports.loadAllPages;
export const loadGeometryG3TocEntries = _exports.loadTocEntries;
export const getGeometryG3StaticPaths = _exports.getStaticPaths;
