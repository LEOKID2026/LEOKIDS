/**
 * Validate active learning book pages — structure vs HEAD, flags shrinkage.
 * Run: node scripts/verification/validate-active-book-pages.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ACTIVE_LEARNING_BOOK_PAGES } from "../../tests/i18n/learning-book-active-pages.mjs";

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

const root = process.cwd();
const outDir = path.join(root, "tmp", "verification");
fs.mkdirSync(outDir, { recursive: true });

const HE = /[\u0590-\u05FF]/;
const MOJIBAKE = /â|Ã|Â|�/;

function gitShow(file) {
  try {
    return execSync(`git show HEAD:"${file.replace(/\\/g, "/")}"`, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 5 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

function analyze(md) {
  if (!md) return null;
  const headings = (md.match(/^#{1,6}\s+/gm) || []).length;
  const paragraphs = md.split(/\n\n+/).filter((p) => p.trim() && !p.startsWith("#") && !p.startsWith("|")).length;
  const exercises = (md.match(/##\s+\d+\./g) || []).length;
  const questions = (md.match(/\?\s*$/gm) || []).length + (md.match(/Question:/gi) || []).length;
  const options = (md.match(/^[-*]\s+/gm) || []).length;
  const diagrams = (md.match(/:::geometry-diagram/g) || []).length;
  const tables = (md.match(/^\|.+\|/gm) || []).length;
  const fences = (md.match(/```/g) || []).length / 2;
  const links = (md.match(/\[([^\]]+)\]\([^)]+\)/g) || []).length;
  const placeholders = (md.match(/TODO|PLACEHOLDER|Content will be added|coming soon|\[DRAFT/i) || []).length;
  return {
    lines: md.split(/\r?\n/).length,
    chars: md.length,
    headings,
    paragraphs,
    exercises,
    questions,
    options,
    diagrams,
    tables,
    fences,
    links,
    placeholders,
    hebrew: (md.match(HE) || []).length,
    mojibake: MOJIBAKE.test(md),
  };
}

function findDraftPath(pageId) {
  for (const subject of ["math", "geometry", "science", "english"]) {
    for (const g of ["g1", "g2", "g3", "g4", "g5", "g6"]) {
      const rel = `docs/learning-book/${subject}/${g}/drafts/${pageId}.md`;
      if (fs.existsSync(path.join(root, rel))) return rel;
    }
  }
  return null;
}

/** @type {object[]} */
const pages = [];
/** @type {object[]} */
const flagged = [];

for (const { pageId, rel, subject, grade } of ACTIVE_LEARNING_BOOK_PAGES) {
  if (!fs.existsSync(path.join(root, rel))) {
    flagged.push({ pageId, subject, grade, rel, issue: "draft file missing" });
    continue;
  }
  const current = stripBom(fs.readFileSync(path.join(root, rel), "utf8"));
  const headRaw = gitShow(rel);
  const head = headRaw ? stripBom(headRaw) : null;
  const curA = analyze(current);
  const headA = analyze(head);

  /** @type {string[]} */
  const issues = [];
  if (!curA) issues.push("empty");
  if (curA?.hebrew) issues.push("hebrew in content");
  if (curA?.mojibake) issues.push("mojibake");
  if (!/\*\*learning_page_id\*\*/.test(current)) issues.push("missing learning_page_id");
  if (!/^#\s+.+/m.test(current)) issues.push("missing title");
  if (curA && curA.exercises < 5) issues.push("fewer than 5 sections");
  if (headA && curA) {
    const shrink = (headA.chars - curA.chars) / Math.max(headA.chars, 1);
    if (shrink > 0.15) issues.push(`chars shrunk ${(shrink * 100).toFixed(1)}%`);
    if (headA.headings > curA.headings + 1) issues.push("headings reduced");
    if (headA.diagrams > curA.diagrams) issues.push("diagrams removed");
  }

  const entry = {
    pageId,
    subject,
    grade,
    rel,
    head: headA,
    current: curA,
    issues,
  };
  pages.push(entry);
  if (issues.length) flagged.push(entry);
}

const bySubject = {};
for (const p of pages) {
  const m = p.rel.match(/learning-book\/(math|geometry|science|english)\/(g\d)/);
  if (!m) continue;
  const key = `${m[1]}:${m[2]}`;
  if (!bySubject[key]) bySubject[key] = { total: 0, flagged: 0 };
  bySubject[key].total++;
  if (p.issues.length) bySubject[key].flagged++;
}

fs.writeFileSync(
  path.join(outDir, "book-pages-validation.json"),
  JSON.stringify({ activeCount: pages.length, flagged, pages: pages.filter((p) => p.issues.length) }, null, 2),
);

console.log("Active pages validated:", pages.length);
console.log("Flagged:", flagged.length);
if (flagged.length) {
  flagged.slice(0, 15).forEach((f) => console.log(`  ${f.pageId || f.rel}: ${(f.issues || [f.issue]).join(", ")}`));
}
console.log("\nBy subject/grade:");
Object.entries(bySubject)
  .sort()
  .forEach(([k, v]) => console.log(`  ${k}: ${v.total} pages, ${v.flagged} flagged`));
console.log(`\nWrote ${path.join(outDir, "book-pages-validation.json")}`);

if (flagged.some((f) => (f.issues || [f.issue]).some((i) => !String(i).includes("chars shrunk")))) {
  process.exitCode = 1;
}
