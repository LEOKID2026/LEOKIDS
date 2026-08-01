#!/usr/bin/env node
/**
 * Convert science question bank modules under data/science-questions*.js to EN-only
 * text using SCIENCE_EN_OVERLAY + translateScienceText / localizeScienceQuestionEn.
 *
 * Preserves IDs, correctIndex, diagnostics/params, and file structure.
 * Run: node scripts/i18n/convert-science-banks-to-english.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const HEBREW_RE = /[\u0590-\u05FF]/g;
const mod = (rel) => import(pathToFileURL(join(ROOT, rel)).href);

/** Text fields that may carry Hebrew student-facing copy. */
const TEXT_KEYS = new Set(["stem", "question", "explanation", "options", "theoryLines"]);

/**
 * @param {Record<string, unknown>} row
 * @param {Record<string, unknown>} localized
 */
function mergeLocalizedText(row, localized) {
  const out = { ...row };
  for (const key of TEXT_KEYS) {
    if (localized[key] !== undefined) out[key] = localized[key];
  }
  return out;
}

function countHebrewInRows(rows) {
  let chars = 0;
  let rowsWithHe = 0;
  for (const row of rows) {
    const blob = [
      row?.stem,
      row?.question,
      row?.explanation,
      ...(Array.isArray(row?.options) ? row.options : []),
      ...(Array.isArray(row?.theoryLines) ? row.theoryLines : []),
    ]
      .filter((x) => typeof x === "string")
      .join(" ");
    const m = blob.match(HEBREW_RE);
    if (m?.length) {
      chars += m.length;
      rowsWithHe += 1;
    }
  }
  return { chars, rowsWithHe };
}

function countHebrewInFile(rel) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  return (text.match(HEBREW_RE) || []).length;
}

/**
 * @typedef {{
 *   file: string,
 *   exportName: string,
 *   kind: "main-concat-phase3" | "simple-array" | "production-batch1" | "g3-body-bank",
 *   header?: string,
 * }} BankTarget
 */

/** @type {BankTarget[]} */
const TARGETS = [
  {
    file: "data/science-questions.js",
    exportName: "SCIENCE_QUESTIONS",
    kind: "main-concat-phase3",
    header: `// grades[] must list only grades where topic appears in SCIENCE_GRADES[g].topics (data/science-curriculum.js).
// Maintainer realignment: node scripts/fix-science-grades-metadata.mjs
// English source conversion: node scripts/i18n/convert-science-banks-to-english.mjs
import { SCIENCE_QUESTIONS_PHASE3 } from "./science-questions-phase3.js";

export const SCIENCE_QUESTIONS = `,
  },
  {
    file: "data/science-questions-phase3.js",
    exportName: "SCIENCE_QUESTIONS_PHASE3",
    kind: "simple-array",
    header: `/**
 * Phase 3 expansion: deeper items for environment, experiments, earth_space
 * (emphasis g5/g6, mostly hard band). Concatenated in science-questions.js.
 * English source conversion: node scripts/i18n/convert-science-banks-to-english.mjs
 */
`,
  },
  {
    file: "data/science-questions-phase4b1.js",
    exportName: "SCIENCE_QUESTIONS_PHASE4B1",
    kind: "simple-array",
  },
  {
    file: "data/science-questions-phase-b.js",
    exportName: "SCIENCE_QUESTIONS_PHASE_B",
    kind: "simple-array",
  },
  {
    file: "data/science-questions-p0-g123-fill.js",
    exportName: "SCIENCE_QUESTIONS_P0_G123_FILL",
    kind: "simple-array",
  },
  {
    file: "data/science-questions-p1-g456-fill.js",
    exportName: "SCIENCE_QUESTIONS_P1_G456_FILL",
    kind: "simple-array",
  },
  {
    file: "data/science-questions-closure-fill.js",
    exportName: "SCIENCE_QUESTIONS_CLOSURE_FILL",
    kind: "simple-array",
  },
  {
    file: "data/science-questions-needs-more-volume.js",
    exportName: "SCIENCE_QUESTIONS_NEEDS_MORE_VOLUME",
    kind: "simple-array",
  },
  {
    file: "data/science-questions-production-batch1.js",
    exportName: "SCIENCE_QUESTIONS_PRODUCTION_BATCH1",
    kind: "production-batch1",
  },
  {
    file: "data/science-questions-g3-body-bank.js",
    exportName: "SCIENCE_G3_BODY_BANK",
    kind: "g3-body-bank",
  },
];

function preserveLeadingComments(rel, exportDecl) {
  const raw = readFileSync(join(ROOT, rel), "utf8");
  const idx = raw.indexOf(exportDecl);
  if (idx <= 0) return "";
  return raw.slice(0, idx).trimEnd() + "\n\n";
}

function writeSimpleArray(rel, exportName, rows, headerOverride) {
  const header =
    headerOverride ||
    preserveLeadingComments(rel, `export const ${exportName}`) ||
    `/** Converted to English by scripts/i18n/convert-science-banks-to-english.mjs */\n`;
  const body = `${header}export const ${exportName} = ${JSON.stringify(rows, null, 2)};\n`;
  writeFileSync(join(ROOT, rel), body, "utf8");
}

async function main() {
  const { localizeScienceQuestionEn } = await mod(
    "utils/learning-content-en/science.js"
  );
  const { SCIENCE_QUESTIONS_PHASE3 } = await mod("data/science-questions-phase3.js");
  const phase3Ids = new Set(SCIENCE_QUESTIONS_PHASE3.map((q) => q.id));

  const report = [];

  for (const target of TARGETS) {
    const beforeFileHe = countHebrewInFile(target.file);
    const loaded = await mod(target.file);
    /** @type {any[]} */
    let sourceRows;

    if (target.kind === "main-concat-phase3") {
      const all = loaded.SCIENCE_QUESTIONS;
      sourceRows = all.filter((q) => !phase3Ids.has(q.id));
    } else if (target.kind === "production-batch1") {
      sourceRows = loaded.SCIENCE_QUESTIONS_PRODUCTION_BATCH1;
    } else if (target.kind === "g3-body-bank") {
      sourceRows = loaded.SCIENCE_G3_BODY_BANK;
    } else {
      sourceRows = loaded[target.exportName];
    }

    if (!Array.isArray(sourceRows)) {
      report.push({
        file: target.file,
        error: `export ${target.exportName} is not an array`,
      });
      continue;
    }

    const converted = sourceRows.map((row) =>
      mergeLocalizedText(row, localizeScienceQuestionEn(row))
    );

    // Preserve correctIndex / ids
    for (let i = 0; i < sourceRows.length; i++) {
      if (converted[i].id !== sourceRows[i].id) {
        throw new Error(`ID drift in ${target.file} at index ${i}`);
      }
      if (converted[i].correctIndex !== sourceRows[i].correctIndex) {
        throw new Error(`correctIndex drift in ${target.file} id=${sourceRows[i].id}`);
      }
    }

    if (target.kind === "main-concat-phase3") {
      const body = `${target.header}${JSON.stringify(converted, null, 2)}.concat(SCIENCE_QUESTIONS_PHASE3);\n`;
      writeFileSync(join(ROOT, target.file), body, "utf8");
    } else if (target.kind === "production-batch1") {
      const header = `/** Science production completion — Batch 1 (grade-targeted MCQs, varied stems). Wired from data/science-questions.js.
 * English source conversion: node scripts/i18n/convert-science-banks-to-english.mjs
 */

export const SCIENCE_QUESTIONS_PRODUCTION_BATCH1 = `;
      writeFileSync(
        join(ROOT, target.file),
        `${header}${JSON.stringify(converted, null, 2)};\n`,
        "utf8"
      );
    } else if (target.kind === "g3-body-bank") {
      // Keep skill family map + helpers; rewrite only the bank array via full-file rebuild
      // from the exported rows (skill metadata already embedded on each question).
      const header = `/**
 * Grade 3 body — authored MCQs (no generic study-skills meta-stems).
 * Target: 50+ unique items for g3 easy body sessions.
 * English source conversion: node scripts/i18n/convert-science-banks-to-english.mjs
 */

export const SCIENCE_G3_BODY_BANK = `;
      writeFileSync(
        join(ROOT, target.file),
        `${header}${JSON.stringify(converted, null, 2)};\n`,
        "utf8"
      );
    } else if (target.kind === "simple-array") {
      writeSimpleArray(target.file, target.exportName, converted, target.header);
    }

    const afterRows = countHebrewInRows(converted);
    const afterFileHe = countHebrewInFile(target.file);
    report.push({
      file: target.file,
      rows: converted.length,
      beforeFileHe,
      afterFileHe,
      remainingHeRows: afterRows.rowsWithHe,
      remainingHeCharsInText: afterRows.chars,
    });
  }

  console.log("[convert-science-banks-to-english] summary:");
  for (const row of report) {
    if (row.error) {
      console.log(`  FAIL ${row.file}: ${row.error}`);
      continue;
    }
    console.log(
      `  ${row.file}: rows=${row.rows} HE_file ${row.beforeFileHe}→${row.afterFileHe} remainingHeRows=${row.remainingHeRows}`
    );
  }

  const incomplete = report.filter((r) => (r.afterFileHe || 0) > 0 || r.error);
  if (incomplete.length) {
    console.log(
      `\n[convert-science-banks-to-english] ${incomplete.length} file(s) still contain Hebrew or failed.`
    );
  } else {
    console.log("\n[convert-science-banks-to-english] all target bank files are Hebrew-free.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
