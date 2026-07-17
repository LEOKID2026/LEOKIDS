import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

const catalogUrl = pathToFileURL(
  path.join(root, "lib/learning-book/learning-book-catalog.js"),
).href;
const { LEARNING_BOOK_CATALOG_LIST } = await import(catalogUrl);

/** @type {Set<string>} keys `${subject}:${grade}:${pageId}` */
const ACTIVE_PAGE_KEYS = new Set();

/** @type {{ subject: string, grade: string, pageId: string, rel: string }[]} */
export const ACTIVE_LEARNING_BOOK_PAGES = [];

for (const entry of LEARNING_BOOK_CATALOG_LIST) {
  const order = entry.registry?.pageOrder ?? [];
  for (const pageId of order) {
    const key = `${entry.subject}:${entry.grade}:${pageId}`;
    ACTIVE_PAGE_KEYS.add(key);
    ACTIVE_LEARNING_BOOK_PAGES.push({
      subject: entry.subject,
      grade: entry.grade,
      pageId,
      rel: `docs/learning-book/${entry.subject}/${entry.grade}/drafts/${pageId}.md`,
    });
  }
}

/** @returns {Promise<Set<string>>} active page keys `${subject}:${grade}:${pageId}` */
export async function loadActiveLearningPageIds() {
  return new Set(ACTIVE_PAGE_KEYS);
}

/** @returns {Set<string>} */
export function loadActiveLearningPageIdsSync() {
  return new Set(ACTIVE_PAGE_KEYS);
}

/** @param {string} rel posix path under docs/learning-book */
export function isInactiveBookDraft(rel) {
  if (!rel.includes("/drafts/") || !rel.endsWith(".md")) return false;
  const m = rel.match(
    /^docs\/learning-book\/([^/]+)\/([^/]+)\/drafts\/([^/]+)\.md$/,
  );
  if (!m) return true;
  const [, subject, grade, pageId] = m;
  return !ACTIVE_PAGE_KEYS.has(`${subject}:${grade}:${pageId}`);
}
