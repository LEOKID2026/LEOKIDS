import { resolveRegistryTitleKey } from "./book-pack-copy.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";

/**
 * @param {string} batchTitleKey
 */
function bookKeyFromBatchTitleKey(batchTitleKey) {
  const parts = String(batchTitleKey || "").split(".");
  if (parts.length >= 2) return `${parts[0]}.${parts[1]}`;
  return "";
}

/**
 * True when a candidate looks like untranslated English prose under a non-English locale.
 * @param {string} title
 * @param {string} localeId
 */
function looksLikeEnglishProse(title, localeId) {
  if (!title || localeId === "en" || localeId.startsWith("en-")) return false;
  return /[A-Za-z]{3,}/.test(title);
}

/**
 * Resolve a TOC navigation title preferring titleKey pack lookup.
 * Under non-English locales, never surface English markdown displayTitle as the visible label.
 *
 * @param {{ titleKey?: string, displayTitle?: string, pageId?: string }} entry
 * @param {string|null|undefined} contentLocale
 */
export function resolveTocNavTitle(entry, contentLocale = "en") {
  const localeId = resolveLocaleDefinition(contentLocale || "en").id;
  const titleKey = String(entry?.titleKey || "").trim();

  if (titleKey) {
    try {
      const resolved = resolveRegistryTitleKey(titleKey, localeId);
      if (resolved) return resolved;
    } catch {
      // fall through — never throw from TOC rendering
    }
  }

  const display = String(entry?.displayTitle || "").trim();
  if (display && !looksLikeEnglishProse(display, localeId)) return display;

  // Non-en: refuse English displayTitle fallback for navigation.
  return String(entry?.pageId || titleKey || "");
}

/**
 * @param {{ id: string, titleKey?: string, title?: string, title?: string, pages: string[] }[]} batches
 * @param {Record<string, { displayTitle?: string }|undefined>} pagesById
 * @param {string} [contentLocale]
 */
export function buildBookTocEntries(batches, pagesById, contentLocale = "en") {
  const localeId = resolveLocaleDefinition(contentLocale || "en").id;
  return batches.map((batch) => {
    const bookKey = bookKeyFromBatchTitleKey(batch.titleKey || "");
    let title = "";
    if (batch.titleKey) {
      try {
        title = resolveRegistryTitleKey(String(batch.titleKey), localeId);
      } catch {
        title = "";
      }
    }
    if (!title) {
      const fallback = String(batch.title || batch.title || "");
      title =
        fallback && !looksLikeEnglishProse(fallback, localeId)
          ? fallback
          : bookKey || String(batch.id || "");
    }

    return {
      id: batch.id,
      titleKey: batch.titleKey || "",
      title,
      pages: batch.pages.map((pageId) => {
        const titleKey = bookKey ? `${bookKey}.${pageId}` : "";
        let displayTitle = "";
        if (titleKey) {
          try {
            displayTitle = resolveRegistryTitleKey(titleKey, localeId);
          } catch {
            displayTitle = "";
          }
        }
        if (!displayTitle) {
          const md = String(pagesById[pageId]?.displayTitle || "");
          if (md && !looksLikeEnglishProse(md, localeId)) {
            displayTitle = md;
          } else {
            // Non-en: do not keep English markdown as the visible nav title.
            displayTitle = titleKey || pageId;
          }
        }
        return {
          pageId,
          titleKey,
          displayTitle,
        };
      }),
    };
  });
}
