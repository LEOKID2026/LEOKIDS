#!/usr/bin/env node
/**
 * Generate lib/learning-book/learning-book-sequence-meta.js from GLOBAL registries.
 * Run: node scripts/generate-learning-book-sequence-meta.mjs
 *
 * GLOBAL subjects only: math, geometry, english, science.
 * Parses *_BOOK_BATCHES_RAW from registry source text (avoids circular import
 * through learning-book-sequence.js → learning-book-sequence-meta.js).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SUBJECTS = ["math", "geometry", "english", "science"];
const GRADES = ["g1", "g2", "g3", "g4", "g5", "g6"];

const PREREQUISITE_OVERRIDES = {
  "geometry:g5": {
    triangle_area: ["heights_triangle"],
  },
};

/**
 * Extract *_BOOK_BATCHES_RAW array literal from registry source.
 * @param {string} src
 * @param {string} fileLabel
 */
function extractRawBatches(src, fileLabel) {
  const marker = "_BOOK_BATCHES_RAW = ";
  const i = src.indexOf(marker);
  if (i < 0) {
    throw new Error(`No *_BOOK_BATCHES_RAW in ${fileLabel}`);
  }
  let j = i + marker.length;
  while (j < src.length && src[j] !== "[") j++;
  if (src[j] !== "[") throw new Error(`No array start in ${fileLabel}`);
  let depth = 0;
  let end = j;
  for (; end < src.length; end++) {
    const ch = src[end];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        end++;
        break;
      }
    }
  }
  const literal = src.slice(j, end);
  try {
    return new Function(`return (${literal});`)();
  } catch (err) {
    throw new Error(`Failed to parse batches in ${fileLabel}: ${err.message}`);
  }
}

/** @type {Record<string, Record<string, object>>} */
const LEARNING_BOOK_PAGE_SEQUENCE = {};

for (const subject of SUBJECTS) {
  for (const grade of GRADES) {
    const regPath = path.join(ROOT, `lib/learning-book/${subject}-${grade}-registry.js`);
    if (!fs.existsSync(regPath)) continue;

    const src = fs.readFileSync(regPath, "utf8");
    const batches = extractRawBatches(src, regPath);
    if (!Array.isArray(batches)) {
      throw new Error(`Batches not an array in ${regPath}`);
    }

    const bookKey = `${subject}:${grade}`;
    LEARNING_BOOK_PAGE_SEQUENCE[bookKey] = {};
    let globalIndex = 0;

    batches.forEach((batch, batchOrder) => {
      const pages = Array.isArray(batch?.pages) ? batch.pages : [];
      pages.forEach((pageId, indexInBatch) => {
        if (!pageId || typeof pageId !== "string") {
          throw new Error(`Invalid page id in ${bookKey} batch ${batch?.id || batchOrder}`);
        }
        globalIndex += 1;
        LEARNING_BOOK_PAGE_SEQUENCE[bookKey][pageId] = {
          sequenceIndex: globalIndex,
          batchId: batch.id,
          batchOrder,
          indexInBatch: indexInBatch + 1,
          sequenceGroup: batch.id,
          oracleRowId: null,
          oracleSequenceIndex: null,
          prerequisitePageIds: PREREQUISITE_OVERRIDES[bookKey]?.[pageId] || [],
          source: "approved_local",
        };
      });
    });
  }
}

const bookKeys = Object.keys(LEARNING_BOOK_PAGE_SEQUENCE).sort();
if (bookKeys.length === 0) {
  throw new Error("No GLOBAL learning-book sequences generated — check registries");
}
for (const key of bookKeys) {
  if (!/^(math|geometry|english|science):g[1-6]$/.test(key)) {
    throw new Error(`Non-GLOBAL book key generated: ${key}`);
  }
  if (!key.trim() || /hebrew|moledet|geography|history|israel/i.test(key)) {
    throw new Error(`Forbidden residue book key: ${JSON.stringify(key)}`);
  }
}

const out = `/**
 * Learning book page sequence metadata (generated).
 * Do not edit by hand — run: node scripts/generate-learning-book-sequence-meta.mjs
 */
export const LEARNING_BOOK_PAGE_SEQUENCE = ${JSON.stringify(LEARNING_BOOK_PAGE_SEQUENCE, null, 2)};

export const LEARNING_BOOK_SEQUENCE_BOOK_KEYS = ${JSON.stringify(bookKeys)};
`;

const outPath = path.join(ROOT, "lib/learning-book/learning-book-sequence-meta.js");
fs.writeFileSync(outPath, out, "utf8");

let pageCount = 0;
for (const book of Object.values(LEARNING_BOOK_PAGE_SEQUENCE)) {
  pageCount += Object.keys(book).length;
}
console.log(`Wrote ${outPath} — ${bookKeys.length} books, ${pageCount} pages`);
console.log(`Books: ${bookKeys.join(", ")}`);
