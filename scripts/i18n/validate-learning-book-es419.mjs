#!/usr/bin/env node
/**
 * Validate learning-book es-419 parity vs EN active catalog pages.
 * Checks: missing pages, section count/numbers, IDs, empty bodies, Hebrew, vos/vosotros.
 */
import fs from "fs";
import path from "path";
import { ACTIVE_LEARNING_BOOK_PAGES } from "../../tests/i18n/learning-book-active-pages.mjs";
import { parseLearningPageMarkdown } from "../../lib/learning-book/parse-learning-page-markdown.js";

const root = process.cwd();
const locale = process.argv[2] || "es-419";
const baseLocale = "en";

const HEBREW_RE = /[\u0590-\u05FF]/;
const VOS_RE = /\bvos\b/i;
const VOSOTROS_RE = /\bvosotros\b|\bvosotras\b/i;

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const warnings = [];

let pagesOk = 0;
let sectionsOk = 0;
let stringUnits = 0;

for (const page of ACTIVE_LEARNING_BOOK_PAGES) {
  const enPath = path.join(
    root,
    "docs/learning-book",
    baseLocale,
    page.subject,
    page.grade,
    "drafts",
    `${page.pageId}.md`,
  );
  const locPath = path.join(
    root,
    "docs/learning-book",
    locale,
    page.subject,
    page.grade,
    "drafts",
    `${page.pageId}.md`,
  );

  if (!fs.existsSync(enPath)) {
    errors.push(`missing EN source ${page.subject}:${page.grade}:${page.pageId}`);
    continue;
  }
  if (!fs.existsSync(locPath)) {
    errors.push(`missing ${locale} ${page.subject}:${page.grade}:${page.pageId}`);
    continue;
  }

  const enRaw = fs.readFileSync(enPath, "utf8");
  const locRaw = fs.readFileSync(locPath, "utf8");
  const enPage = parseLearningPageMarkdown(enRaw, page.pageId);
  const locPage = parseLearningPageMarkdown(locRaw, page.pageId);

  if (locPage.pageId !== page.pageId) {
    errors.push(`pageId mismatch ${page.pageId} -> ${locPage.pageId}`);
  }
  if (locPage.metadata?.learning_page_id && enPage.metadata?.learning_page_id) {
    if (locPage.metadata.learning_page_id !== enPage.metadata.learning_page_id) {
      errors.push(`learning_page_id changed for ${page.pageId}`);
    }
  }
  if (locPage.metadata?.skill_id && enPage.metadata?.skill_id) {
    if (locPage.metadata.skill_id !== enPage.metadata.skill_id) {
      errors.push(`skill_id changed for ${page.pageId}`);
    }
  }

  if (locPage.sections.length !== enPage.sections.length) {
    errors.push(
      `section count ${page.pageId}: en=${enPage.sections.length} ${locale}=${locPage.sections.length}`,
    );
  } else {
    for (let i = 0; i < enPage.sections.length; i += 1) {
      if (enPage.sections[i].number !== locPage.sections[i].number) {
        errors.push(`section number drift ${page.pageId} #${enPage.sections[i].number}`);
      }
      if (!String(locPage.sections[i].title || locPage.sections[i].rawTitle || "").trim()) {
        errors.push(`empty section title ${page.pageId} #${enPage.sections[i].number}`);
      }
      const body = String(locPage.sections[i].body || "").trim();
      if (!body) errors.push(`empty section body ${page.pageId} #${enPage.sections[i].number}`);
      stringUnits += body.split(/\n+/).filter(Boolean).length;
      sectionsOk += 1;
    }
  }

  if (HEBREW_RE.test(locRaw)) errors.push(`Hebrew in ${locale} ${page.pageId}`);
  if (VOS_RE.test(locRaw)) errors.push(`vos in ${locale} ${page.pageId}`);
  if (VOSOTROS_RE.test(locRaw)) errors.push(`vosotros in ${locale} ${page.pageId}`);

  // Unintended identical body (still EN) — warn for non-english subjects
  if (page.subject !== "english") {
    const enBodies = enPage.sections.map((s) => String(s.body || "").trim()).join("\n");
    const locBodies = locPage.sections.map((s) => String(s.body || "").trim()).join("\n");
    if (enBodies && enBodies === locBodies) {
      warnings.push(`still-identical-to-en ${page.subject}:${page.grade}:${page.pageId}`);
    }
  }

  pagesOk += 1;
}

const report = {
  locale,
  pagesOk,
  pagesTotal: ACTIVE_LEARNING_BOOK_PAGES.length,
  sectionsOk,
  stringUnitsApprox: stringUnits,
  missingPages: errors.filter((e) => e.startsWith("missing")).length,
  identicalToEn: warnings.length,
  errorCount: errors.length,
  warningCount: warnings.length,
  errors: errors.slice(0, 40),
  warnings: warnings.slice(0, 40),
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
