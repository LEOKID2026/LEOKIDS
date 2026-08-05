/**
 * Writing ready catalog metadata for API responses.
 * @module lib/writing/writing-catalog.server
 */

import { writingCategoryLabelEn } from "./writing-constants.js";
import { resolveReadyWritingTitle } from "../../data/writing/ready-title.locale.js";
import {
  READY_WRITING_CATALOG,
  getReadyWritingBySlug,
  countPublicReadyWritingEntries,
} from "./writing-ready-catalog.js";

/**
 * @typedef {import("./writing-worksheet-types.js").ReadyWritingCatalogEntry} ReadyWritingCatalogEntry
 */

export { READY_WRITING_CATALOG as WRITING_READY_CATALOG, getReadyWritingBySlug as getWritingCatalogEntryBySlug };

/**
 * @param {string} [locale]
 * @returns {Array<Record<string, unknown>>}
 */
export function buildWritingCatalogItems(locale = "en") {
  return READY_WRITING_CATALOG.map((entry) => ({
    worksheetType: "writing",
    slug: entry.slug,
    catalogNumber: entry.catalogNumber,
    writingCategory: entry.writingCategory,
    categoryHe: writingCategoryLabelEn(entry.writingCategory, locale) || entry.title,
    title: resolveReadyWritingTitle(entry.title, locale),
    publicAccess: entry.publicAccess === true,
    locked: entry.publicAccess !== true,
    inkSave: entry.inkSave === true,
    seed: entry.seed ?? null,
  }));
}

/**
 * @returns {number}
 */
export function countPublicWritingCatalogEntries() {
  return countPublicReadyWritingEntries();
}
