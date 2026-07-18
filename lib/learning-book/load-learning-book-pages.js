/**
 * Generic learning-book page loader (build-time SSG) — content-locale aware.
 */

import fs from "fs";
import path from "path";
import {
  parseLearningPageMarkdown,
  assertMathG1PageSections,
} from "./parse-learning-page-markdown.js";
import {
  buildPlaceholderPageMarkdown,
  PLACEHOLDER_PAGE_ID,
} from "./learning-book-placeholders.js";
import { resolveLearningBookDraftsDir } from "../content/locale.server.js";
import { DEFAULT_LOCALE } from "../i18n/locale-registry.js";
import { buildBookTocEntries } from "./build-book-toc-entries.js";

/**
 * @typedef {{
 *   batches: { id: string, titleHe: string, pages: string[] }[],
 *   pageOrder: string[],
 *   meta: { draftsDir: string, routeBase: string, [key: string]: unknown },
 *   getPageNeighbors: (pageId: string) => { prev: string|null, next: string|null, index: number },
 *   isValidPageId: (pageId: string) => boolean,
 * }} LearningBookRegistry
 */

/**
 * @param {LearningBookRegistry} registry
 * @param {{ contentLocale?: string|null }} [opts]
 */
export function createLearningBookPageLoader(registry, opts = {}) {
  const contentLocale = opts.contentLocale || registry.meta.contentLocale || DEFAULT_LOCALE;
  const subject = String(registry.meta.subject || "");
  const grade = String(registry.meta.grade || "");
  const draftsDir =
    registry.meta.draftsDir ||
    resolveLearningBookDraftsDir(contentLocale, subject, grade);
  const draftsAbsolute = path.isAbsolute(draftsDir)
    ? draftsDir
    : path.join(process.cwd(), draftsDir);

  /**
   * @param {string} pageId
   */
  function loadPage(pageId) {
    const filePath = path.join(draftsAbsolute, `${pageId}.md`);
    let raw = null;

    if (fs.existsSync(filePath)) {
      raw = fs.readFileSync(filePath, "utf8");
    } else if (
      pageId === PLACEHOLDER_PAGE_ID &&
      registry.meta.status === "placeholder"
    ) {
      raw = buildPlaceholderPageMarkdown({
        subject: String(registry.meta.subject),
        grade: String(registry.meta.grade),
        subjectTitleHe: registry.meta.subjectTitleHe,
      });
    } else {
      return null;
    }

    const page = parseLearningPageMarkdown(raw, pageId);
    assertMathG1PageSections(page);
    return page;
  }

  function loadAllPages() {
    return registry.pageOrder.map((pageId) => {
      const page = loadPage(pageId);
      if (!page) {
        throw new Error(
          `Missing ${registry.meta.subject}/${registry.meta.grade} draft: ${pageId}.md`
        );
      }
      return page;
    });
  }

  function loadTocEntries() {
    const pages = loadAllPages();
    const byId = Object.fromEntries(pages.map((p) => [p.pageId, p]));

    return buildBookTocEntries(registry.batches, byId, contentLocale);
  }

  function getStaticPaths() {
    return registry.pageOrder.map((pageId) => ({ params: { pageId } }));
  }

  return {
    loadPage,
    loadAllPages,
    loadTocEntries,
    getStaticPaths,
  };
}

/**
 * @param {LearningBookRegistry} registry
 * @param {string} pageId
 */
export function loadLearningBookPage(registry, pageId) {
  return createLearningBookPageLoader(registry).loadPage(pageId);
}
