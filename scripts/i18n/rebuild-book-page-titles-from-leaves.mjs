/**
 * Rebuild content-packs books registry-titles pages index from leaf JSON files.
 * Seeds EN leaves from markdown + AR leaves via MT cache / Google MT.
 *
 *   node scripts/i18n/rebuild-book-page-titles-from-leaves.mjs
 *   node scripts/i18n/rebuild-book-page-titles-from-leaves.mjs --merge-only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  ARABIC_MASTER_GLOSSARY,
} from "../../lib/i18n/arabic-master-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-ar-001.json");
const MERGE_ONLY = process.argv.includes("--merge-only");
const LOCALES = ["en", "ar-001"];

const DRAFT_MARKER = /\s*`?\[DRAFT[^\]]*\]`?\s*/gi;

const EXACT_OVERRIDES = {
  "Word problems": "مسائل كلامية",
  "Place value": "القيمة المكانية",
  "Number sense": "الحس العددي",
  "Even and Odd": "الزوجي والفردي",
  "Review": "مراجعة",
  Practice: "تمرين",
  Addition: "الجمع",
  Subtraction: "الطرح",
  Multiplication: "الضرب",
  Division: "القسمة",
  Fractions: "الكسور",
  Decimals: "الأعداد العشرية",
  Perimeter: "المحيط",
  Area: "المساحة",
  Volume: "الحجم",
  Angles: "الزوايا",
  Triangles: "المثلثات",
  Circles: "الدوائر",
};

const POST_PHRASE_FIXES = [
  [/\bGrade 6\b/g, "الصف 6"],
  [/\bGrade 5\b/g, "الصف 5"],
  [/\bGrade 4\b/g, "الصف 4"],
  [/\bGrade 3\b/g, "الصف 3"],
  [/\bGrade 2\b/g, "الصف 2"],
  [/\bGrade 1\b/g, "الصف 1"],
  [/ — /g, " — "],
  [/ – /g, " — "],
  [/ - /g, " — "],
];

function cleanEnTitle(title) {
  return String(title || "")
    .replace(DRAFT_MARKER, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyGlossaryHints(text) {
  let out = text;
  for (const [enTerm, entry] of Object.entries(ARABIC_MASTER_GLOSSARY)) {
    if (!entry?.preferred || !/[A-Za-z]/.test(enTerm) || enTerm.length < 3) continue;
    out = out.replace(new RegExp(`\\b${escapeRegExp(enTerm)}\\b`, "g"), entry.preferred);
  }
  for (const [re, rep] of POST_PHRASE_FIXES) out = out.replace(re, rep);
  return out;
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache), "utf8");
}

async function mtTranslate(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateToArabic(en, cache) {
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, en)) {
    return EXACT_OVERRIDES[en];
  }
  if (cache[en]) return applyGlossaryHints(cache[en]);

  let translated;
  try {
    translated = await mtTranslate(en);
  } catch (err) {
    throw new Error(`MT failed for "${en}": ${err.message}`);
  }
  translated = applyGlossaryHints(translated);
  cache[en] = translated;
  return translated;
}

function leafDir(locale) {
  return path.join(ROOT, "content-packs", locale, "books", "page-title-leaves");
}

function registryPath(locale) {
  return path.join(ROOT, "content-packs", locale, "books", "registry-titles.json");
}

function walkLeaves(dir) {
  /** @type {Record<string, Record<string, { title: string }>>} */
  const pages = {};
  if (!fs.existsSync(dir)) return pages;
  for (const bookKey of fs.readdirSync(dir)) {
    const bookDir = path.join(dir, bookKey);
    if (!fs.statSync(bookDir).isDirectory()) continue;
    pages[bookKey] = {};
    for (const file of fs.readdirSync(bookDir)) {
      if (!file.endsWith(".json")) continue;
      const pageId = file.replace(/\.json$/, "");
      const raw = JSON.parse(fs.readFileSync(path.join(bookDir, file), "utf8"));
      if (!raw?.title) throw new Error(`missing title in leaf ${bookKey}/${pageId}`);
      pages[bookKey][pageId] = { title: String(raw.title) };
    }
  }
  return pages;
}

function mergePagesIntoRegistry(locale, pages) {
  const regPath = registryPath(locale);
  const registry = JSON.parse(fs.readFileSync(regPath, "utf8"));
  registry.pages = pages;
  fs.writeFileSync(regPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  const count = Object.values(pages).reduce((n, book) => n + Object.keys(book).length, 0);
  console.log(`merged ${count} page titles into ${regPath}`);
}

async function seedLeaves() {
  const extract = path.join(__dirname, "_extract-book-page-titles.mjs");
  spawnSync(process.execPath, [extract], { cwd: ROOT, stdio: "inherit" });
  const enPages = JSON.parse(
    fs.readFileSync(path.join(__dirname, "_book-page-titles-en.json"), "utf8"),
  ).pages;

  const enOut = leafDir("en");
  fs.mkdirSync(enOut, { recursive: true });
  const cache = loadCache();
  const arOut = leafDir("ar-001");
  fs.mkdirSync(arOut, { recursive: true });

  let enCount = 0;
  let arCount = 0;
  for (const [bookKey, pageMap] of Object.entries(enPages)) {
    const enBookDir = path.join(enOut, bookKey);
    const arBookDir = path.join(arOut, bookKey);
    fs.mkdirSync(enBookDir, { recursive: true });
    fs.mkdirSync(arBookDir, { recursive: true });
    for (const [pageId, row] of Object.entries(pageMap || {})) {
      const enTitle = cleanEnTitle(row.title);
      fs.writeFileSync(
        path.join(enBookDir, `${pageId}.json`),
        `${JSON.stringify({ title: enTitle }, null, 2)}\n`,
        "utf8",
      );
      enCount += 1;

      const arTitle = await translateToArabic(enTitle, cache);
      if (!arTitle || arTitle === enTitle) {
        throw new Error(`missing Arabic title for ${bookKey}.${pageId}: ${enTitle}`);
      }
      fs.writeFileSync(
        path.join(arBookDir, `${pageId}.json`),
        `${JSON.stringify({ title: arTitle }, null, 2)}\n`,
        "utf8",
      );
      arCount += 1;
      if (arCount % 25 === 0) saveCache(cache);
    }
  }
  saveCache(cache);
  console.log(`seeded ${enCount} EN leaves, ${arCount} AR leaves`);
}

async function main() {
  if (!MERGE_ONLY) {
    await seedLeaves();
  }
  for (const locale of LOCALES) {
    mergePagesIntoRegistry(locale, walkLeaves(leafDir(locale)));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
