import fs from "fs";
import path from "path";
import {
  MATH_G1_BOOK_BATCHES,
  MATH_G1_PAGE_ORDER,
  MATH_G1_BOOK_META,
} from "./math-g1-registry";
import {
  parseLearningPageMarkdown,
  assertMathG1PageSections,
} from "./parse-learning-page-markdown";
import { buildBookTocEntries } from "./build-book-toc-entries.js";

const DRAFTS_ABSOLUTE = path.join(process.cwd(), MATH_G1_BOOK_META.draftsDir);

/**
 * @param {string} pageId
 */
export function loadMathG1Page(pageId) {
  const filePath = path.join(DRAFTS_ABSOLUTE, `${pageId}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const page = parseLearningPageMarkdown(raw, pageId);
  assertMathG1PageSections(page);
  return page;
}

export function loadAllMathG1Pages() {
  return MATH_G1_PAGE_ORDER.map((pageId) => {
    const page = loadMathG1Page(pageId);
    if (!page) {
      throw new Error(`Missing Grade 1 Math draft: ${pageId}.md`);
    }
    return page;
  });
}

export function loadMathG1TocEntries() {
  const pages = loadAllMathG1Pages();
  const byId = Object.fromEntries(pages.map((p) => [p.pageId, p]));

  return buildBookTocEntries(MATH_G1_BOOK_BATCHES, byId);
}

export function getMathG1StaticPaths() {
  return MATH_G1_PAGE_ORDER.map((pageId) => ({ params: { pageId } }));
}
