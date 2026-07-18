/**
 * Validate Books UI content packs (ui.json, registry titles, English skills, registries).
 * Run: node scripts/i18n/validate-book-content-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bookUi from "../../content-packs/en/books/ui.json" with { type: "json" };
import registryTitles from "../../content-packs/en/books/registry-titles.json" with { type: "json" };
import englishSkills from "../../content-packs/en/books/english-page-skills.json" with { type: "json" };
import {
  assertBookPackKey,
  bookUiCopyForLocale,
  getLearningBookSubjectLabelCopy,
  resolveBookTitleKey,
  resolveEnglishSkillCopy,
  resolveRegistryTitleKey,
} from "../../lib/learning-book/book-pack-copy.js";
import { scanRepository } from "./hardcoded-ui-core.mjs";
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const libDir = path.join(root, "lib/learning-book");

/** @type {string[]} */
const errors = [];

const SUBJECT_CODES = ["math", "geometry", "hebrew", "english", "science", "moledet", "geography", "history"];
const GRADE_CODES = ["g1", "g2", "g3", "g4", "g5", "g6"];

function booksUiFindingCount() {
  const { findings } = scanRepository(root);
  return findings.filter((f) => {
    const file = f.file.replace(/\\/g, "/");
    if (isAllowlistedFinding(file, f.line, f.text)) return false;
    return /learning-book|english-page-skill/.test(file);
  }).length;
}

for (const subject of SUBJECT_CODES) {
  try {
    assertBookPackKey("subjects", subject);
  } catch {
    errors.push(`missing subject label: subjects.${subject}`);
  }
}

for (const grade of GRADE_CODES) {
  if (!bookUi.grades?.[grade]) errors.push(`missing grade label: grades.${grade}`);
}

const shellKeys = [
  "close",
  "tocTitle",
  "pageNavWithinTopic",
  "topicNav",
  "previousPage",
  "nextPage",
  "emptyPageContent",
  "practiceNow",
];
for (const key of shellKeys) {
  try {
    assertBookPackKey("shell", key);
  } catch {
    errors.push(`missing shell key: shell.${key}`);
  }
}

for (const locale of ["en", "en-XA", "ar-XB"]) {
  const subjectLabel = getLearningBookSubjectLabelCopy("math", locale);
  if (!subjectLabel) errors.push(`${locale}: missing math subject label`);
  const shell = bookUiCopyForLocale(locale, "shell", "previousPage");
  if (!shell) errors.push(`${locale}: missing previousPage shell copy`);
  if (locale === "en-XA" && shell && !/^\[\[\[/.test(shell)) {
    errors.push("en-XA: pseudo-long not applied to shell.previousPage");
  }
  if (locale === "ar-XB" && shell && shell.charCodeAt(0) !== 0x202b) {
    errors.push("ar-XB: pseudo-rtl not applied to shell.previousPage");
  }
  const bookTitle = resolveBookTitleKey("math.g1.bookTitle", locale);
  if (!bookTitle) errors.push(`${locale}: missing math.g1 book title`);
  const batchTitle = resolveRegistryTitleKey("math.g1.a", locale);
  if (!batchTitle) errors.push(`${locale}: missing math.g1.a batch title`);
}

/** @type {Set<string>} */
const packTitleKeys = new Set();
for (const [bookKey, batches] of Object.entries(registryTitles.batches || {})) {
  for (const [batchId, row] of Object.entries(batches || {})) {
    const key = `${bookKey}.${batchId}`;
    if (packTitleKeys.has(key)) errors.push(`duplicate batch title key in pack: ${key}`);
    packTitleKeys.add(key);
    if (!row?.title) errors.push(`registry-titles missing title: batches.${bookKey}.${batchId}`);
  }
}

for (const [bookKey, row] of Object.entries(registryTitles.meta || {})) {
  if (!row?.bookTitle) errors.push(`registry-titles missing bookTitle: meta.${bookKey}`);
}

let skillCount = 0;
for (const [grade, pages] of Object.entries(englishSkills.grades || {})) {
  for (const [pageKey, entry] of Object.entries(pages || {})) {
    skillCount += 1;
    if (!entry.skillId) errors.push(`english skill missing skillId: ${grade}/${pageKey}`);
    if (!entry.title) errors.push(`english skill missing title: ${grade}/${pageKey}`);
    if (!entry.description) errors.push(`english skill missing description: ${grade}/${pageKey}`);
    const title = resolveEnglishSkillCopy(grade, pageKey, "title", "en");
    if (!title) errors.push(`english skill unresolved title: ${grade}/${pageKey}`);
    if (entry.doNotTranslateFields?.includes("title") && title !== entry.title) {
      errors.push(`english skill title must stay English: ${grade}/${pageKey}`);
    }
  }
}
if (skillCount < 100) errors.push(`expected at least 100 english-page-skills entries, got ${skillCount}`);

const registryFiles = fs
  .readdirSync(libDir)
  .filter(
    (name) =>
      name.endsWith("-registry.js") &&
      name !== "create-placeholder-book-registry.js" &&
      name !== "geometry-diagram-registry.js",
  );

for (const file of registryFiles) {
  const source = fs.readFileSync(path.join(libDir, file), "utf8");
  if (/\btitleHe\s*:/.test(source)) errors.push(`${file}: contains titleHe`);
  if (/\bbookTitleHe\s*:/.test(source)) errors.push(`${file}: contains bookTitleHe`);
  if (/\btitle\s*:\s*["'][A-Za-z]/.test(source)) errors.push(`${file}: contains inline title string`);
  if (!/\btitleKey\s*:/.test(source) && !/GEOMETRY_DIAGRAM/.test(source)) {
    errors.push(`${file}: missing titleKey fields`);
  }
  const metaMatch = source.match(/BOOK_META\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\)/);
  if (metaMatch && !/bookTitleKey\s*:/.test(metaMatch[1])) {
    errors.push(`${file}: meta missing bookTitleKey`);
  }
}

const booksUiRemaining = booksUiFindingCount();
if (booksUiRemaining !== 0) {
  errors.push(`Books UI hardcoded findings: ${booksUiRemaining} (expected 0)`);
}

if (errors.length) {
  console.error("validate-book-content-packs FAILED");
  for (const e of errors.slice(0, 20)) console.error(" -", e);
  if (errors.length > 20) console.error(` ... and ${errors.length - 20} more`);
  process.exit(1);
}

console.log(
  `validate-book-content-packs OK (${skillCount} english skills, ${registryFiles.length} registries, Books UI=0)`,
);
