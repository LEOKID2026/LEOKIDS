/**
 * Pass 3: remove all "section 5" wording + remaining grade/syllabus meta in page txt only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOKS_ROOT = path.join(__dirname, "..", "exports", "audio-text", "books");

/** @type {string[]} */
const changed = [];

function walkPageTxt(dir) {
  /** @type {string[]} */
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push(...walkPageTxt(p));
    else if (name.endsWith(".txt") && /page-\d+\.txt$/.test(name)) out.push(p);
  }
  return out;
}

const SECTION5_RES = [
  [/\s+\s*5\s*:/gu, "  :"],
  [/\s+\s*5\s*:/gu, "  :"],
  [/\s+\s*5/gu, "  "],
  [/\s+\s*5/gu, "  "],
  [/\s*5\s*:/gu, "  :"],
  [/\s*5\s*:/gu, "  :"],
];

const GRADE_SYLLABUS_RES = [
  [/       \./gu, "     ."],
  [/  /gu, " "],
  [/    \./gu, "    ."],
  [/  /gu, "  "],
  [/        \./gu, "      ."],
  [/        \./gu, "      ."],
  [/        \./gu, "      ."],
  [/       \./gu, "     ."],
  [/   —   /gu, "   —  "],
  [/    ,/gu, "  ,"],
  [/    ,/gu, "  ,"],
  [/  /gu, " "],
  [/:  ,  ,/gu, ":  ,"],
  [/    \./gu, "   ."],
  [/    /gu, "   "],
  [/     /gu, "    "],
  [/   /gu, "  "],
  [/  /gu, " "],
  [/    /gu, "   "],
  [/   /gu, " "],
  [/     —    \./gu, "     —  ."],
  [/  /gu, " "],
  [/      —  \./gu, "     ."],
  [/\(     —   \)/gu, "(     —  )"],
  [/ \( \):/gu, ":"],
  [/         \./gu, "       ."],
  [/    =  ×   !/gu, "    =  × !"],
  [/    \./gu, "    ."],
  [/"    /gu, '"   '],
  [/  '2/gu, "   "],
  [/   \./gu, " ."],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, ""],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s*[]['’]?\s+/gu, " "],
  [/\s+([^.\n]+)\s+\s*[]['']?/gu, " $1"],
  [/\s+\s*[]['’]?/gu, " "],
  [/\s+\s+/gu, "  "],
  [/\s+\s+\s*[]['’]?/gu, " "],
  [/\s*\(\s*[]['']?\):/gu, ":"],
  [/\s+\s+\s*[]['']?/gu, "   "],
  [/\s+\s+\s*[]['']?/gu, "  "],
  [/\s+([^.\n]+)\s+\s*[]['']?/gu, " $1"],
  [/\s+\s*[]['']?/gu, ""],
  [/\s+\s+\s+\s+/gu, "   "],
  [/\s*[]['']?\s+/gu, " "],
  [/\s+\s*[]['']?/gu, " "],
];

for (const file of walkPageTxt(BOOKS_ROOT)) {
  let text = fs.readFileSync(file, "utf8");
  const original = text;
  for (const [re, rep] of SECTION5_RES) text = text.replace(re, rep);
  for (const [re, rep] of GRADE_SYLLABUS_RES) text = text.replace(re, rep);
  if (text !== original) {
    fs.writeFileSync(file, text.endsWith("\n") ? text : `${text}\n`, "utf8");
    changed.push(file);
  }
}

console.log(JSON.stringify({ changedCount: changed.length }, null, 2));
