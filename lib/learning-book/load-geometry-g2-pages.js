import fs from "fs";
import path from "path";
import {
  GEOMETRY_G2_BOOK_BATCHES,
  GEOMETRY_G2_PAGE_ORDER,
  GEOMETRY_G2_BOOK_META,
} from "./geometry-g2-registry";
import {
  parseLearningPageMarkdown,
  assertMathG1PageSections,
} from "./parse-learning-page-markdown";
import { buildBookTocEntries } from "./build-book-toc-entries.js";

const DRAFTS_ABSOLUTE = path.join(process.cwd(), GEOMETRY_G2_BOOK_META.draftsDir);

/**
 * @param {string} pageId
 */
export function loadGeometryG2Page(pageId) {
  const filePath = path.join(DRAFTS_ABSOLUTE, `${pageId}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const page = parseLearningPageMarkdown(raw, pageId);
  assertMathG1PageSections(page);
  return page;
}

export function loadAllGeometryG2Pages() {
  return GEOMETRY_G2_PAGE_ORDER.map((pageId) => {
    const page = loadGeometryG2Page(pageId);
    if (!page) {
      throw new Error(`Missing Grade 2 Geometry draft: ${pageId}.md`);
    }
    return page;
  });
}

export function loadGeometryG2TocEntries() {
  const pages = loadAllGeometryG2Pages();
  const byId = Object.fromEntries(pages.map((p) => [p.pageId, p]));

  return buildBookTocEntries(GEOMETRY_G2_BOOK_BATCHES, byId);
}

export function getGeometryG2StaticPaths() {
  return GEOMETRY_G2_PAGE_ORDER.map((pageId) => ({ params: { pageId } }));
}
