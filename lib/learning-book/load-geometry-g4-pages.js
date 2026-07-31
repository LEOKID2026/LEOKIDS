import {
  GEOMETRY_G4_BOOK_BATCHES,
  GEOMETRY_G4_PAGE_ORDER,
  GEOMETRY_G4_BOOK_META,
  getGeometryG4PageNeighbors,
  isValidGeometryG4PageId,
} from "./geometry-g4-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";

const _exports = createDedicatedBookPageExports({
  batches: GEOMETRY_G4_BOOK_BATCHES,
  pageOrder: GEOMETRY_G4_PAGE_ORDER,
  meta: GEOMETRY_G4_BOOK_META,
  getPageNeighbors: getGeometryG4PageNeighbors,
  isValidPageId: isValidGeometryG4PageId,
});

export const loadGeometryG4Page = _exports.loadPage;
export const loadAllGeometryG4Pages = _exports.loadAllPages;
export const loadGeometryG4TocEntries = _exports.loadTocEntries;
export const getGeometryG4StaticPaths = _exports.getStaticPaths;
