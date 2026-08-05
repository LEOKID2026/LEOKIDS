/**
 * Apply content fixes from cursor_book_content_fix_pack to exports/audio-text/books.
 * Only modifies page-*.txt files under exports/audio-text/books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BOOKS_ROOT = path.join(ROOT, "exports", "audio-text", "books");
const CSV_PATH = path.join(ROOT, "cursor_book_content_fix_pack", "cursor_content_fix_findings.csv");

/** @type {string[]} */
const changedFiles = [];

function parseCSV(text) {
  /** @type {string[][]} */
  const rows = [];
  /** @type {string[]} */
  let row = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const n = text[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') {
        cur += '"';
        i += 1;
        continue;
      }
      if (c === '"') {
        inQ = false;
        continue;
      }
      cur += c;
      continue;
    }
    if (c === '"') {
      inQ = true;
      continue;
    }
    if (c === ",") {
      row.push(cur);
      cur = "";
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && n === "\n") i += 1;
      if (cur || row.length) {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      }
      continue;
    }
    cur += c;
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

function pagePath(book, page) {
  return path.join(BOOKS_ROOT, book, "pages", page);
}

function readPage(book, page) {
  const p = pagePath(book, page);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function writePage(book, page, text) {
  const p = pagePath(book, page);
  const normalized = text.endsWith("\n") ? text : `${text}\n`;
  fs.writeFileSync(p, normalized, "utf8");
  if (!changedFiles.includes(p)) changedFiles.push(p);
}

function replacePage(book, page, text) {
  writePage(book, page, text);
}

function replaceInPage(book, page, replacements) {
  let text = readPage(book, page);
  if (text == null) return false;
  let changed = false;
  for (const [from, to] of replacements) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      changed = true;
    }
  }
  if (changed) writePage(book, page, text);
  return changed;
}

function removeAdjacentDuplicates(text) {
  const lines = text.split(/\r?\n/);
  /** @type {string[]} */
  const out = [];
  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (out.length && trimmed.trim() === out[out.length - 1].trim() && trimmed.trim().length > 1) {
      continue;
    }
    out.push(trimmed);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function walkPageFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walkPageFiles(p));
    else if (/^page-\d+\.txt$/.test(name)) out.push(p);
  }
  return out;
}

// --- Exact full-page replacements from prompt ---
const FULL_PAGE = [
  [
    "math-g1",
    "page-073.txt",
    `9  + 12 :
  .
  10:
9 + 10 = 19
   2:
19 + 2 = 21
:
9 + 12 = 21`,
  ],
  [
    "math-g1",
    "page-080.txt",
    ` 8 .
 3 .
  :
8 − 3 = 5
  5 .
 :
5 + 3 = 8`,
  ],
  [
    "hebrew-g1",
    "page-200.txt",
    `  —  ?
 —  ?
.`,
  ],
  [
    "moledet-g3",
    "page-025.txt",
    `    ?
 —    ,    .
 —   ,     .
  ;    .`,
  ],
  [
    "english-g5",
    "page-111.txt",
    `: "   ."
water —    .
      -a lot of.
   .
There was a lot of water in the bottle.`,
  ],
  [
    "english-g5",
    "page-125.txt",
    `: "       ."
Last year =   →  .
work on a project =   .
       .
Last year our class worked on a project about the environment.`,
  ],
];

for (const [book, page, content] of FULL_PAGE) {
  replacePage(book, page, content);
}

// Fix typo in english-g5 page-111 - user said "" not ""
replaceInPage("english-g5", "page-111.txt", [[" ", " "]]);

// --- Exact in-page replacements from prompt ---
const EXACT_REPLACEMENTS = [
  ["hebrew-g1", "page-096.txt", " ", " "],
  ["hebrew-g4", "page-078.txt", "    ", "    "],
  ["hebrew-g5", "page-155.txt", "   — .", "    ."],
  ["hebrew-g6", "page-001.txt", "  ", "  "],
  ["science-g1", "page-022.txt", " —    ", " —    "],
  ["hebrew-g1", "page-065.txt", " —  .", " —  ."],
  [
    "science-g5",
    "page-023.txt",
    null,
    null,
  ],
  [
    "science-g5",
    "page-027.txt",
    null,
    null,
  ],
  [
    "science-g6",
    "page-016.txt",
    " —    :",
    " —       :",
  ],
  [
    "english-g5",
    "page-106.txt",
    "much/many —   ",
    "much/many —       ",
  ],
  [
    "english-g5",
    "page-110.txt",
    "There was much water in the bottle.",
    "There was a lot of water in the bottle.",
  ],
  [
    "english-g5",
    "page-112.txt",
    "   -much/many  .",
    "     much -many    .",
  ],
  ["english-g5", "page-124.txt", "made a project", "worked on a project"],
  ["english-g2", "page-060.txt", "playground — .", "playground —  ."],
];

for (const [book, page, from, to] of EXACT_REPLACEMENTS) {
  if (from && to) replaceInPage(book, page, [[from, to]]);
}

// Science earthquake pages
{
  const s523 = readPage("science-g5", "page-023.txt");
  if (s523 && /|| /i.test(s523)) {
    replacePage(
      "science-g5",
      "page-023.txt",
      "  —         ,       ."
    );
  }
  const s527 = readPage("science-g5", "page-027.txt");
  if (s527) {
    const patched = s527
      .split(/\r?\n/)
      .map((line) => {
        if (/ |/i.test(line) && /||/i.test(line)) {
          return "              —    .";
        }
        return line;
      })
      .join("\n");
    if (patched !== s527) writePage("science-g5", "page-027.txt", patched);
  }
}

// Geography safety page
{
  const g518 = readPage("geography-g5", "page-018.txt");
  if (g518 && /|/i.test(g518)) {
    replacePage(
      "geography-g5",
      "page-018.txt",
      `        .
     ,    .`
    );
  }
}

// --- Global systemic fixes on all page txt files ---
const pageFiles = walkPageFiles(BOOKS_ROOT);
for (const file of pageFiles) {
  let text = fs.readFileSync(file, "utf8");
  const original = text;

  text = text.split("  5:").join("  :");
  text = text.split("  5").join("  ");
  text = removeAdjacentDuplicates(text);

  if (text !== original) {
    fs.writeFileSync(file, text.endsWith("\n") ? text : `${text}\n`, "utf8");
    if (!changedFiles.includes(file)) changedFiles.push(file);
  }
}

// --- Grade/meta wording replacements (global safe patterns) ---
const GRADE_META_GLOBAL = [
  [/  /gu, " "],
  [/  /gu, " "],
  [/   /gu, "  "],
  [/   /gu, "  "],
  [/  /gu, " "],
  [/   /gu, "  "],
  [/  /gu, " "],
  [/  /gu, " "],
  [/  /gu, " "],
  [/  /gu, " "],
  [/  /gu, "  "],
  [/   /gu, " "],
  [/  /gu, " "],
  [/   /gu, " "],
  [/  /gu, ""],
  [/  /gu, ""],
  [/ :/gu, ":"],
  [/ :/gu, ":"],
  [/ :/gu, ":"],
  [/ :/gu, ":"],
  [/ :/gu, ":"],
  [/ :/gu, ":"],
  [/  /gu, " "],
  [/  /gu, " "],
  [/  /gu, " "],
  [/  /gu, " "],
  [/  /gu, " "],
  [/     /gu, "   "],
  [/     /gu, "   "],
  [/  /gu, "  "],
  [/    \./gu, "   ."],
  [/      \./gu, "    ."],
  [
    /   , ,    \./gu,
    "   , ,  .",
  ],
  [/ /gu, ""],
  [/ /gu, " "],
  [/ :/gu, " :"],
  [/  '2/gu, "   "],
  [/  :/gu, ":"],
  [/   :/gu, " :"],
  [/   /gu, " "],
  [/   /gu, ""],
];

for (const file of pageFiles) {
  let text = fs.readFileSync(file, "utf8");
  const original = text;
  for (const [re, rep] of GRADE_META_GLOBAL) {
    text = text.replace(re, rep);
  }
  if (text !== original) {
    fs.writeFileSync(file, text.endsWith("\n") ? text : `${text}\n`, "utf8");
    if (!changedFiles.includes(file)) changedFiles.push(file);
  }
}

// --- Parse CSV for per-file recommendations ---
const csvRows = parseCSV(fs.readFileSync(CSV_PATH, "utf8"));
const header = csvRows[0];
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

/** @type {Map<string, { category: string, recommendation: string, issue: string }[]>} */
const byFile = new Map();

for (const row of csvRows.slice(1)) {
  if (!row.length || !row[idx.book]) continue;
  const book = row[idx.book];
  const page = row[idx.page];
  const key = `${book}/${page}`;
  if (!byFile.has(key)) byFile.set(key, []);
  byFile.get(key).push({
    category: row[idx.category] || "",
    recommendation: row[idx.recommendation] || "",
    issue: row[idx.issue] || "",
  });
}

// Apply CSV recommendations that contain explicit replace patterns
for (const [key, items] of byFile) {
  const [book, page] = key.split("/");
  let text = readPage(book, page);
  if (text == null) continue;
  const original = text;

  for (const item of items) {
    const rec = item.recommendation;
    // Pattern:  `X` -`Y` or Replace `X` with `Y`
    const m1 = rec.match(/(?: )?(?: )?(?: )?(?:)?:?\s*[`""'](.+?)[`""']\s*(?:|)[-:]?\s*[`""'](.+?)[`""']/u);
    const m2 = rec.match(/Replace(?:\s+the page with)?:?\s*[`""'](.+?)[`""']\s*with:?\s*[`""'](.+?)[`""']/iu);
    const m3 = rec.match(/Replace:\s*[`""'](.+?)[`""']\s*With:\s*[`""'](.+?)[`""']/iu);
    const match = m1 || m2 || m3;
    if (match) {
      const [, from, to] = match;
      if (from && to && text.includes(from)) text = text.split(from).join(to);
    }

    if (/   /i.test(rec)) {
      text = removeAdjacentDuplicates(text);
    }

    if (/   /i.test(rec) && item.category === "Content correctness") {
      // handled by FULL_PAGE above
    }
  }

  if (text !== original) writePage(book, page, text);
}

// --- Cross-book / near-duplicate adaptations from CSV ---
/** @type {Record<string, string>} */
const DUPLICATE_ADAPTATIONS = {
  // math-g2 pages that duplicate math-g1 - add variation in numbers/context
  "math-g2/page-073.txt": null,
};

// Read cross-book duplicate entries and lightly vary higher-grade copies
for (const row of csvRows.slice(1)) {
  const cat = row[idx.category];
  if (cat !== "Cross-book duplicate" && cat !== "Near duplicate lesson") continue;
  const book = row[idx.book];
  const page = row[idx.page];
  const rec = row[idx.recommendation] || "";
  let text = readPage(book, page);
  if (!text) continue;

  // If recommendation suggests changing numbers/examples, apply simple suffix note only when identical to lower grade
  const issue = row[idx.issue] || "";
  if (/|identical||duplicate/i.test(issue + rec)) {
    // For near-duplicates: prepend contextual opener if page starts identically to a pattern
    if (/^ /u.test(text) && !/^ /u.test(text)) {
      text = text.replace(/^ /u, "  ");
    }
    if (/^/u.test(text) && !/^ /u.test(text) && book.includes("-g") && parseInt(book.split("-g")[1], 10) >= 3) {
      text = text.replace(/^/u, " ");
    }
  }

  // Specific adaptations noted in CSV evidence for math spiral
  if (book === "math-g2" && page === "page-073.txt") {
    text = `12  + 15 :
  .
  10:
12 + 10 = 22
   5:
22 + 5 = 27
:
12 + 15 = 27`;
  }
  if (book === "math-g2" && page === "page-080.txt") {
    text = ` 13 .
 4 .
  :
13 − 4 = 9
  9 .
 :
9 + 4 = 13`;
  }
  if (book === "math-g3" && page === "page-073.txt") {
    text = `24 + 17:
 .
24 + 10 = 34
34 + 7 = 41
 24 + 17 = 41`;
  }
  if (book === "math-g3" && page === "page-080.txt") {
    text = ` 35 .
 18 .
35 − 18 = 17
 17 .
: 17 + 18 = 35`;
  }

  writePage(book, page, text);
}

const report = {
  changedFileCount: changedFiles.length,
  changedFiles: changedFiles.map((f) => path.relative(ROOT, f).replaceAll("\\", "/")),
};
fs.writeFileSync(
  path.join(ROOT, "exports", "audio-text", "content-fix-applied.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8"
);
console.log(JSON.stringify(report, null, 2));
