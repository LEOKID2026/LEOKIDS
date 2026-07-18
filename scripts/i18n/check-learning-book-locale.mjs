#!/usr/bin/env node
/**
 * Validate learning-book locale layout completeness for active catalog pages.
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "node:url";
import { ACTIVE_LEARNING_BOOK_PAGES } from "../../tests/i18n/learning-book-active-pages.mjs";
import { resolveLearningBookPagePath } from "../../lib/content/locale.server.js";

const locale = process.argv[2] || "en";
/** @type {string[]} */
const missing = [];

for (const page of ACTIVE_LEARNING_BOOK_PAGES) {
  const filePath = resolveLearningBookPagePath(locale, page.subject, page.grade, page.pageId);
  if (!fs.existsSync(filePath)) {
    missing.push(`${page.subject}:${page.grade}:${page.pageId} -> ${path.relative(process.cwd(), filePath)}`);
  }
}

if (missing.length) {
  console.error(`FAIL learning-book-locale (${locale}): ${missing.length} missing`);
  for (const m of missing.slice(0, 20)) console.error(" -", m);
  process.exit(1);
}

console.log(`PASS learning-book-locale (${locale}): ${ACTIVE_LEARNING_BOOK_PAGES.length} pages`);
