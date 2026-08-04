import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const libDir = path.join(root, "lib/learning-book");

const regFiles = fs
  .readdirSync(libDir)
  .filter((f) => /^(math|geometry|english|science)-g[1-6]-registry\.js$/.test(f));

/** @type {Record<string, string[]>} */
const books = {};

for (const file of regFiles) {
  const m = file.match(/^(math|geometry|english|science)-g([1-6])-registry\.js$/);
  if (!m) continue;
  const subject = m[1];
  const grade = `g${m[2]}`;
  const bookKey = `${subject}.${grade}`;
  const src = fs.readFileSync(path.join(libDir, file), "utf8");
  const pageRe = /pages:\s*\[([\s\S]*?)\]/g;
  const pages = [];
  let pm;
  while ((pm = pageRe.exec(src))) {
    const inner = pm[1];
    const ids = inner.match(/"([^"]+)"/g) || [];
    pages.push(...ids.map((s) => s.replace(/"/g, "")));
  }
  books[bookKey] = pages;
}

function readTitle(subject, grade, pageId) {
  const candidates = [
    path.join(root, "docs/learning-book/en", subject, grade, "drafts", `${pageId}.md`),
    path.join(root, "docs/learning-book", subject, grade, "drafts", `${pageId}.md`),
  ];
  for (const fp of candidates) {
    if (!fs.existsSync(fp)) continue;
    const raw = fs.readFileSync(fp, "utf8");
    const meta = raw.match(/\*\*title_english\*\*\s*\|\s*([^\n|]+)/);
    if (meta) return meta[1].trim();
    const h = raw.match(/^# (.+)/m);
    if (h) return h[1].trim();
  }
  return pageId;
}

/** @type {Record<string, Record<string, { title: string }>>} */
const pages = {};
for (const [bookKey, pageIds] of Object.entries(books)) {
  const [subject, grade] = bookKey.split(".");
  pages[bookKey] = {};
  for (const pageId of pageIds) {
    pages[bookKey][pageId] = { title: readTitle(subject, grade, pageId) };
  }
}

const out = path.join(root, "scripts/i18n/_book-page-titles-en.json");
fs.writeFileSync(out, `${JSON.stringify({ pages }, null, 2)}\n`);
console.log(
  `books ${Object.keys(books).length} pages ${Object.values(books).reduce((a, p) => a + p.length, 0)}`,
);
