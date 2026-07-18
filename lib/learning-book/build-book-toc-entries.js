import { resolveRegistryTitleKey } from "./book-pack-copy.js";

/**
 * @param {{ id: string, titleKey?: string, titleHe?: string, title?: string, pages: string[] }[]} batches
 * @param {Record<string, { displayTitle?: string }|undefined>} pagesById
 * @param {string} [contentLocale]
 */
export function buildBookTocEntries(batches, pagesById, contentLocale = "en") {
  return batches.map((batch) => ({
    id: batch.id,
    titleKey: batch.titleKey || "",
    titleHe: batch.titleKey
      ? resolveRegistryTitleKey(String(batch.titleKey), contentLocale)
      : String(batch.titleHe || batch.title || ""),
    pages: batch.pages.map((pageId) => ({
      pageId,
      displayTitle: pagesById[pageId]?.displayTitle || pageId,
    })),
  }));
}
