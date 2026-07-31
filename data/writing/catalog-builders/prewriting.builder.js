/**
 * Prewriting ready catalog — W-201 to W-216 (16 entries).
 * Titles are locale-neutral English ids resolved for Global display (no Hebrew runtime authority).
 * @module data/writing/catalog-builders/prewriting.builder
 */

import { formatCatalogNumber, makeCatalogEntry } from "./_builder-utils.js";

/** @typedef {import("./_builder-utils.js").WritingCatalogBuilderEntry} WritingCatalogBuilderEntry */

/**
 * Fixed catalog order — public slugs W-201, W-205, W-207, W-215 per plan v3.1 §15–16.
 * @type {Array<{ pathId: string, title: string }>}
 */
const PREWRITING_CATALOG_ORDER = [
  { pathId: "horizontal", title: "Horizontal lines" },
  { pathId: "vertical", title: "Vertical lines" },
  { pathId: "slants", title: "Diagonal lines" },
  { pathId: "bridges", title: "Bridges" },
  { pathId: "waves", title: "Waves" },
  { pathId: "peaks", title: "Peaks" },
  { pathId: "circles", title: "Circles" },
  { pathId: "loops", title: "Loops" },
  { pathId: "curves", title: "Curves" },
  { pathId: "spirals", title: "Spirals" },
  { pathId: "zigzag", title: "Zigzag" },
  { pathId: "valleys", title: "Valleys" },
  { pathId: "mountains", title: "Mountains" },
  { pathId: "tunnels", title: "Tunnels" },
  { pathId: "combo", title: "Line combinations" },
  { pathId: "mixed_shapes", title: "Mixed shapes" },
];

/** @type {WritingCatalogBuilderEntry[]} */
export const PREWRITING_CATALOG = PREWRITING_CATALOG_ORDER.map((item, index) => {
  const catalogNum = 201 + index;
  return makeCatalogEntry({
    slug: `writing-pre-${item.pathId}`,
    catalogNumber: formatCatalogNumber(catalogNum),
    writingCategory: "prewriting",
    title: item.title,
    gradeKey: "prek",
    seed: 1000 + catalogNum,
    builderConfig: {
      writingCategory: "prewriting",
      prewritingPathId: item.pathId,
      tracingMode: "trace",
      traceRenderMode: "outline",
      lineTemplate: "prewriting_path",
      lineCount: 6,
      itemsPerLine: 1,
    },
  });
});

/**
 * @returns {WritingCatalogBuilderEntry[]}
 */
export function buildPrewritingCatalog() {
  return PREWRITING_CATALOG;
}
