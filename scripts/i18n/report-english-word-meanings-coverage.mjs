/**
 * Coverage report: WORD_LISTS ↔ WORD_MEANINGS_ES_419 parity.
 * Run: node scripts/i18n/report-english-word-meanings-coverage.mjs
 *
 * Prints:
 *   total unique English word IDs
 *   translated to es-419
 *   missing
 *   duplicates
 *   orphan translations (in es-419 but not in WORD_LISTS)
 *
 * Exits non-zero if missing or duplicates > 0.
 */
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { WORD_MEANINGS_ES_419 } from "../../data/english-questions/word-meanings/es-419.js";

const HEBREW = /[\u0590-\u05FF]/;

/** @type {Map<string, string[]>} */
const idToLists = new Map();
let totalEntries = 0;

for (const [listKey, list] of Object.entries(WORD_LISTS || {})) {
  for (const enWord of Object.keys(list || {})) {
    totalEntries += 1;
    const gloss = list[enWord];
    if (typeof gloss === "string" && HEBREW.test(gloss)) {
      console.error(`Hebrew in WORD_LISTS.${listKey}.${enWord}: ${gloss}`);
      process.exitCode = 1;
    }
    if (!idToLists.has(enWord)) idToLists.set(enWord, []);
    idToLists.get(enWord).push(listKey);
  }
}

const uniqueIds = idToLists.size;
const crossCategoryReuse = [...idToLists.entries()].filter(
  ([, lists]) => lists.length > 1
);

let translated = 0;
/** @type {string[]} */
const missing = [];

for (const [listKey, list] of Object.entries(WORD_LISTS || {})) {
  const pack = WORD_MEANINGS_ES_419?.[listKey];
  for (const enWord of Object.keys(list || {})) {
    if (pack && typeof pack[enWord] === "string" && pack[enWord]) {
      translated += 1;
    } else {
      missing.push(`${listKey}.${enWord}`);
    }
  }
}

/** @type {string[]} */
const orphans = [];
for (const [listKey, pack] of Object.entries(WORD_MEANINGS_ES_419 || {})) {
  const source = WORD_LISTS?.[listKey];
  if (!source) {
    orphans.push(`(category) ${listKey}`);
    continue;
  }
  for (const enWord of Object.keys(pack || {})) {
    if (source[enWord] == null) orphans.push(`${listKey}.${enWord}`);
  }
}

/**
 * Duplicates = repeated English IDs within a single category object
 * (should always be 0 for plain object keys). Cross-category ID reuse is
 * expected (e.g. fish in animals + food) and reported separately.
 * @type {string[]}
 */
const duplicates = [];
for (const [listKey, pack] of [
  ...Object.entries(WORD_LISTS || {}),
  ...Object.entries(WORD_MEANINGS_ES_419 || {}),
]) {
  const keys = Object.keys(pack || {});
  const seen = new Set();
  for (const enWord of keys) {
    if (seen.has(enWord)) duplicates.push(`${listKey}.${enWord}`);
    seen.add(enWord);
  }
}

console.log("English word meanings coverage");
console.log("------------------------------");
console.log(`total unique English word IDs:   ${uniqueIds}`);
console.log(`total list entries:              ${totalEntries}`);
console.log(`translated to es-419:            ${translated}`);
console.log(`missing:                         ${missing.length}`);
console.log(`duplicates:                      ${duplicates.length}`);
console.log(`orphan translations:             ${orphans.length}`);
console.log(`cross-category ID reuse:         ${crossCategoryReuse.length}`);

if (missing.length) {
  console.log("\nMissing (first 40):");
  for (const m of missing.slice(0, 40)) console.log(`  - ${m}`);
}
if (duplicates.length) {
  console.log("\nDuplicates (first 40):");
  for (const d of duplicates.slice(0, 40)) console.log(`  - ${d}`);
}
if (orphans.length) {
  console.log("\nOrphans (first 40):");
  for (const o of orphans.slice(0, 40)) console.log(`  - ${o}`);
}

if (missing.length > 0 || duplicates.length > 0) {
  process.exitCode = 1;
  console.error("\nFAIL: missing or duplicates must be 0.");
} else {
  console.log("\nOK: missing=0, duplicates=0.");
}
