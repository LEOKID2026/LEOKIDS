/**
 * Prevent learning-book 500s on Vercel: markdown drafts must be output-traced.
 * Run: node --test tests/learning/learning-book-ssr-tracing.test.mjs
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { getLearningBookEntry } from "../../lib/learning-book/learning-book-catalog.js";
import { getLearningBookClientMeta } from "../../lib/learning-book/learning-book-catalog-meta.js";

const require = createRequire(import.meta.url);
const nextConfig = require("../../next.config.js");

/** @type {[string, string][]} */
const BOOK_MATRIX = [
  ["math", "g1"],
  ["math", "g3"],
  ["math", "g6"],
  ["geometry", "g1"],
  ["geometry", "g3"],
  ["geometry", "g6"],
  ["english", "g1"],
  ["english", "g3"],
  ["english", "g6"],
  ["science", "g3"],
];

test("next.config outputFileTracingIncludes bundles learning-book markdown drafts", () => {
  const includes = nextConfig.outputFileTracingIncludes || {};
  const routes = Object.keys(includes);
  assert.ok(
    routes.some((route) => route.includes("/student/learning/book")),
    "missing /student/learning/book trace route",
  );
  assert.ok(
    routes.some((route) => route.includes("/learning/book")),
    "missing /learning/book trace route",
  );
  for (const paths of Object.values(includes)) {
    if (!Array.isArray(paths)) continue;
    if (paths.some((p) => String(p).includes("docs/learning-book"))) {
      return;
    }
  }
  assert.fail("outputFileTracingIncludes must include ./docs/learning-book/**");
});

test("learning book SSR props load for production matrix", () => {
  for (const [subject, grade] of BOOK_MATRIX) {
    const entry = getLearningBookEntry(subject, grade);
    const clientMeta = getLearningBookClientMeta(subject, grade);
    assert.ok(entry, `${subject}/${grade}: missing catalog entry`);
    assert.ok(clientMeta, `${subject}/${grade}: missing client meta`);

    const batches = entry.loader.loadTocEntries();
    assert.ok(Array.isArray(batches) && batches.length > 0, `${subject}/${grade}: empty TOC`);
    assert.ok(batches[0].pages?.length > 0, `${subject}/${grade}: empty first batch`);

    const firstPageId = batches[0].pages[0].pageId;
    const page = entry.loader.loadPage(firstPageId);
    assert.ok(page?.displayTitle, `${subject}/${grade}/${firstPageId}: missing page title`);

    const serialized = JSON.stringify({
      batches,
      subject,
      grade,
      bookMeta: clientMeta.meta,
      page,
    });
    assert.ok(serialized.length > 20, `${subject}/${grade}: props not serializable`);
  }
});
