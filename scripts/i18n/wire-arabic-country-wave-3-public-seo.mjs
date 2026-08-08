/**
 * Register Wave 3 country public-seo overlays in
 * lib/seo/public-seo-ar-001-client-index.js (manual country tables; generator is ar-001 SoT only).
 *
 * Run: node scripts/i18n/wire-arabic-country-wave-3-public-seo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const FILE = path.join(ROOT, "lib/seo/public-seo-ar-001-client-index.js");

const LOCALES = [
  { id: "ar-KW", prefix: "kw", constName: "AR_KW_PUBLIC_SEO" },
  { id: "ar-QA", prefix: "qa", constName: "AR_QA_PUBLIC_SEO" },
  { id: "ar-OM", prefix: "om", constName: "AR_OM_PUBLIC_SEO" },
  { id: "ar-BH", prefix: "bh", constName: "AR_BH_PUBLIC_SEO" },
];

function walkJson(dir, base, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkJson(p, base, acc);
    else if (e.name.endsWith(".json")) {
      acc.push(path.relative(base, p).split(path.sep).join("/"));
    }
  }
  return acc;
}

let src = fs.readFileSync(FILE, "utf8");
const nl = src.includes("\r\n") ? "\r\n" : "\n";

/** @type {string[]} */
const importBlocks = [];
/** @type {string[]} */
const tableBlocks = [];
/** @type {string[]} */
const localeMapLines = [];

for (const loc of LOCALES) {
  if (src.includes(`content-packs/${loc.id}/public-seo/`)) {
    console.log(`public-seo index: ${loc.id} already wired`);
    continue;
  }
  const seoRoot = path.join(ROOT, "content-packs", loc.id, "public-seo");
  const files = walkJson(seoRoot, seoRoot).sort();
  const importLines = [];
  const entries = [];
  files.forEach((rel, i) => {
    const varName = `pack_${loc.prefix}_${i}`;
    importLines.push(
      `import ${varName} from "../../content-packs/${loc.id}/public-seo/${rel}" with { type: "json" };`
    );
    entries.push(`  "${rel}": ${varName},`);
  });
  importBlocks.push(importLines.join(nl));
  tableBlocks.push(
    `const ${loc.constName} = {${nl}${entries.join(nl)}${nl}};`
  );
  localeMapLines.push(`  "${loc.id}": ${loc.constName},`);
}

if (importBlocks.length === 0) {
  console.log("public-seo index: nothing to add");
  process.exit(0);
}

const tnImportEnd =
  'import pack_tn_18 from "../../content-packs/ar-TN/public-seo/practice/worksheets.json" with { type: "json" };';
if (!src.includes(tnImportEnd)) {
  throw new Error("Wave 3 public-seo import anchor not found");
}
src = src.replace(
  tnImportEnd,
  `${tnImportEnd}${nl}${nl}${importBlocks.join(nl + nl)}`
);

const tnTableEnd = `const AR_TN_PUBLIC_SEO = {`;
const tnTableIdx = src.indexOf(tnTableEnd);
if (tnTableIdx < 0) throw new Error("AR_TN_PUBLIC_SEO not found");
const afterTnTable = src.indexOf("\n};\n\nconst PUBLIC_SEO_BY_LOCALE", tnTableIdx);
if (afterTnTable < 0) throw new Error("PUBLIC_SEO_BY_LOCALE after TN not found");
const insertTablesAt = afterTnTable + "\n};".length;
src =
  src.slice(0, insertTablesAt) +
  nl +
  nl +
  tableBlocks.join(nl + nl) +
  src.slice(insertTablesAt);

const mapMarker = 'const PUBLIC_SEO_BY_LOCALE = {';
const mapIdx = src.indexOf(mapMarker);
if (mapIdx < 0) throw new Error("PUBLIC_SEO_BY_LOCALE not found");
const mapClose = src.indexOf("\n};", mapIdx);
if (mapClose < 0) throw new Error("PUBLIC_SEO_BY_LOCALE close not found");
const beforeClose = src.slice(mapIdx, mapClose);
if (!beforeClose.includes('"ar-TN"')) {
  throw new Error("expected ar-TN in PUBLIC_SEO_BY_LOCALE");
}
src =
  src.slice(0, mapClose) +
  nl +
  localeMapLines.join(nl) +
  src.slice(mapClose);

fs.writeFileSync(FILE, src, "utf8");
console.log(`public-seo index: wired ${LOCALES.filter((l) => !src.includes(`skip`)).length} locales`);
console.log("done");
