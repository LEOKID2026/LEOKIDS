import {
  GEOMETRY_G6_BOOK_BATCHES,
  GEOMETRY_G6_PAGE_ORDER,
  GEOMETRY_G6_BOOK_META,
  getGeometryG6AccessibleBookBatches,
  getGeometryG6AccessiblePageOrder,
  getGeometryG6PageNeighbors,
  isValidGeometryG6PageId,
} from "./geometry-g6-registry.js";
import { createDedicatedBookPageExports } from "./create-dedicated-book-page-exports.js";
import { buildBookTocEntries } from "./build-book-toc-entries.js";
import { DEFAULT_LOCALE } from "../i18n/locale-registry.js";

const _exports = createDedicatedBookPageExports({
  batches: GEOMETRY_G6_BOOK_BATCHES,
  pageOrder: GEOMETRY_G6_PAGE_ORDER,
  meta: GEOMETRY_G6_BOOK_META,
  getPageNeighbors: getGeometryG6PageNeighbors,
  isValidPageId: isValidGeometryG6PageId,
});

export const loadGeometryG6Page = _exports.loadPage;
export const loadAllGeometryG6Pages = _exports.loadAllPages;

/**
 * @param {{ contentLocale?: string|null }} [opts]
 */
export function loadGeometryG6TocEntries(opts = {}) {
  const pages = loadAllGeometryG6Pages(opts);
  const byId = Object.fromEntries(pages.map((p) => [p.pageId, p]));
  const accessibleBatches = getGeometryG6AccessibleBookBatches();
  return buildBookTocEntries(accessibleBatches, byId, opts.contentLocale || DEFAULT_LOCALE);
}

export function getGeometryG6StaticPaths() {
  return getGeometryG6AccessiblePageOrder().map((pageId) => ({ params: { pageId } }));
}
