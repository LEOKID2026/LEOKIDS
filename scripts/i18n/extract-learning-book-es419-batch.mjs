#!/usr/bin/env node
/**
 * Extract active learning-book EN pages to JSON batches for es-419 translation.
 * Usage: node scripts/i18n/extract-learning-book-es419-batch.mjs <subject> <grade>
 */
import fs from "fs";
import path from "path";
import { ACTIVE_LEARNING_BOOK_PAGES } from "../../tests/i18n/learning-book-active-pages.mjs";
import { parseLearningPageMarkdown } from "../../lib/learning-book/parse-learning-page-markdown.js";

const subject = process.argv[2];
const grade = process.argv[3];
if (!subject || !grade) {
  console.error("Usage: node scripts/i18n/extract-learning-book-es419-batch.mjs <subject> <grade>");
  process.exit(1);
}

const root = process.cwd();
const outDir = path.join(root, "reports/learning-books-es419/batches");
fs.mkdirSync(outDir, { recursive: true });

const pages = ACTIVE_LEARNING_BOOK_PAGES.filter(
  (p) => p.subject === subject && p.grade === grade,
);

/** @type {object[]} */
const records = [];
for (const p of pages) {
  const filePath = path.join(
    root,
    "docs/learning-book/en",
    subject,
    grade,
    "drafts",
    `${p.pageId}.md`,
  );
  const raw = fs.readFileSync(filePath, "utf8");
  const page = parseLearningPageMarkdown(raw, p.pageId);
  const contentScopeMatch = raw.match(/\*\*Content scope:\*\*\s*(.+)/);
  records.push({
    id: p.pageId,
    subject,
    grade,
    h1: page.displayTitle,
    title_english: page.metadata?.title_english || page.displayTitle,
    contentScope: contentScopeMatch ? contentScopeMatch[1].trim() : "",
    sections: page.sections.map((s) => ({
      number: s.number,
      rawTitle: s.rawTitle,
      body: String(s.body || "").trim(),
    })),
  });
}

const outPath = path.join(outDir, `src-${subject}-${grade}.json`);
fs.writeFileSync(outPath, JSON.stringify({ subject, grade, pages: records }, null, 2) + "\n");
console.log(JSON.stringify({ wrote: path.relative(root, outPath), count: records.length }, null, 2));
