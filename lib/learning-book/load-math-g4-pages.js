import fs from "fs";
import path from "path";
import {
  MATH_G4_BOOK_BATCHES,
  MATH_G4_PAGE_ORDER,
  MATH_G4_BOOK_META,
} from "./math-g4-registry";
import {
  parseLearningPageMarkdown,
  assertMathG1PageSections,
} from "./parse-learning-page-markdown";
import { buildBookTocEntries } from "./build-book-toc-entries.js";

const DRAFTS_ABSOLUTE = path.join(process.cwd(), MATH_G4_BOOK_META.draftsDir);

/**
 * @param {string} pageId
 */
export function loadMathG4Page(pageId) {
  const filePath = path.join(DRAFTS_ABSOLUTE, `${pageId}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const page = parseLearningPageMarkdown(raw, pageId);
  assertMathG1PageSections(page);
  return page;
}

export function loadAllMathG4Pages() {
  return MATH_G4_PAGE_ORDER.map((pageId) => {
    const page = loadMathG4Page(pageId);
    if (!page) {
      throw new Error(`Missing Grade 4 Math draft: ${pageId}.md`);
    }
    return page;
  });
}

export function loadMathG4TocEntries() {
  const pages = loadAllMathG4Pages();
  const byId = Object.fromEntries(pages.map((p) => [p.pageId, p]));

  return buildBookTocEntries(MATH_G4_BOOK_BATCHES, byId);
}

export function getMathG4StaticPaths() {
  return MATH_G4_PAGE_ORDER.map((pageId) => ({ params: { pageId } }));
}
