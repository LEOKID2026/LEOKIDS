/**
 * Verify geometry/science learning book pages are converted to English.
 * Run: node scripts/verify-learning-book-english.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GEOMETRY_G1_PAGE_ORDER } from "../lib/learning-book/geometry-g1-registry.js";
import { GEOMETRY_G2_PAGE_ORDER } from "../lib/learning-book/geometry-g2-registry.js";
import { GEOMETRY_G3_PAGE_ORDER } from "../lib/learning-book/geometry-g3-registry.js";
import { GEOMETRY_G4_PAGE_ORDER } from "../lib/learning-book/geometry-g4-registry.js";
import { GEOMETRY_G5_PAGE_ORDER } from "../lib/learning-book/geometry-g5-registry.js";
import { GEOMETRY_G6_PAGE_ORDER } from "../lib/learning-book/geometry-g6-registry.js";
import { SCIENCE_G1_PAGE_ORDER } from "../lib/learning-book/science-g1-registry.js";
import { SCIENCE_G2_PAGE_ORDER } from "../lib/learning-book/science-g2-registry.js";
import { SCIENCE_G3_PAGE_ORDER } from "../lib/learning-book/science-g3-registry.js";
import { SCIENCE_G4_PAGE_ORDER } from "../lib/learning-book/science-g4-registry.js";
import { SCIENCE_G5_PAGE_ORDER } from "../lib/learning-book/science-g5-registry.js";
import { SCIENCE_G6_PAGE_ORDER } from "../lib/learning-book/science-g6-registry.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REQUIRED_SECTIONS = [
  "## 1. What are we learning?",
  "## 2. Simple explanation",
  "## 3. Example",
  "## 4. Let's solve together",
  "## 5. Try it yourself",
  "## 6. Let's check together",
  "## 7. Let's practice!",
];

const BOOKS = [
  ...["g1","g2","g3","g4","g5","g6"].flatMap((g) =>
    { const o = {g1:GEOMETRY_G1_PAGE_ORDER,g2:GEOMETRY_G2_PAGE_ORDER,g3:GEOMETRY_G3_PAGE_ORDER,g4:GEOMETRY_G4_PAGE_ORDER,g5:GEOMETRY_G5_PAGE_ORDER,g6:GEOMETRY_G6_PAGE_ORDER}[g];
      return o.map((p) => ({ subject: "geometry", grade: g, pageId: p })); }),
  ...["g1","g2","g3","g4","g5","g6"].flatMap((g) =>
    { const o = {g1:SCIENCE_G1_PAGE_ORDER,g2:SCIENCE_G2_PAGE_ORDER,g3:SCIENCE_G3_PAGE_ORDER,g4:SCIENCE_G4_PAGE_ORDER,g5:SCIENCE_G5_PAGE_ORDER,g6:SCIENCE_G6_PAGE_ORDER}[g];
      return o.map((p) => ({ subject: "science", grade: g, pageId: p })); }),
];

let ok = 0;
const fail = [];
for (const b of BOOKS) {
  const rel = `docs/learning-book/${b.subject}/${b.grade}/drafts/${b.pageId}.md`;
  const raw = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const body = raw.replace(/\*\*title_hebrew\*\*[^\n]*/u, "");
  const issues = [];
  if (!/\*\*title_english\*\*/.test(raw)) issues.push("no title_english");
  for (const s of REQUIRED_SECTIONS) {
    if (!raw.includes(s)) {
      issues.push("bad sections");
      break;
    }
  }
  if (/[\u0590-\u05FF]/.test(body)) issues.push("hebrew in body");
  if (issues.length) fail.push({ ...b, issues });
  else ok++;
}
console.log(`OK: ${ok}/${BOOKS.length}`);
if (fail.length) {
  console.log("Remaining:");
  for (const f of fail) console.log(`${f.subject}:${f.grade}:${f.pageId} — ${f.issues.join(", ")}`);
}
