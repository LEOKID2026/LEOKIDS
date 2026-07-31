/**
 * Shared factory for dedicated grade book page loaders.
 * Routes drafts through resolveLearningBookDraftsDir (locale tree → legacy fallback).
 */

import { createLearningBookPageLoader } from "./load-learning-book-pages.js";
import { DEFAULT_LOCALE } from "../i18n/locale-registry.js";

/**
 * @param {{
 *   batches: unknown[],
 *   pageOrder: string[],
 *   meta: Record<string, unknown>,
 *   getPageNeighbors: (pageId: string) => { prev: string|null, next: string|null, index: number },
 *   isValidPageId: (pageId: string) => boolean,
 *   missingDraftMessage?: (pageId: string) => string,
 * }} spec
 */
export function createDedicatedBookPageExports(spec) {
  /**
   * @param {string|null|undefined} [contentLocale]
   */
  function getLoader(contentLocale) {
    return createLearningBookPageLoader(
      {
        batches: spec.batches,
        pageOrder: spec.pageOrder,
        meta: spec.meta,
        getPageNeighbors: spec.getPageNeighbors,
        isValidPageId: spec.isValidPageId,
      },
      { contentLocale: contentLocale || DEFAULT_LOCALE },
    );
  }

  /**
   * @param {string} pageId
   * @param {{ contentLocale?: string|null }} [opts]
   */
  function loadPage(pageId, opts = {}) {
    return getLoader(opts.contentLocale).loadPage(pageId);
  }

  /**
   * @param {{ contentLocale?: string|null }} [opts]
   */
  function loadAllPages(opts = {}) {
    return getLoader(opts.contentLocale).loadAllPages();
  }

  /**
   * @param {{ contentLocale?: string|null }} [opts]
   */
  function loadTocEntries(opts = {}) {
    return getLoader(opts.contentLocale).loadTocEntries();
  }

  function getStaticPaths() {
    return getLoader(DEFAULT_LOCALE).getStaticPaths();
  }

  return {
    loadPage,
    loadAllPages,
    loadTocEntries,
    getStaticPaths,
    getLoader,
  };
}
