/**
 * Shared wiring for Arabic country wave: ar-EG, ar-SA, ar-MA, ar-DZ.
 * Wires load-messages.js + pack-catalog.js from on-disk sparse overlays.
 * Does NOT modify country content.
 *
 * Run: node scripts/i18n/wire-arabic-country-wave.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const LOCALES = ["ar-EG", "ar-SA", "ar-MA", "ar-DZ"];

function localeSlug(id) {
  return id.replace(/-/g, "");
}

function toNsImportVar(ns, localeId) {
  const base = ns.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const slug = localeSlug(localeId);
  return `${base}${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
}

function catalogImportVar(relPath, localeId) {
  const parts = relPath
    .replace(/\//g, " ")
    .replace(/[.\-\[\]]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const camel = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return `${camel}_${localeSlug(localeId)}`;
}

function walkJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function wireLoadMessages() {
  const file = path.join(ROOT, "lib/i18n/load-messages.js");
  let src = fs.readFileSync(file, "utf8");
  const nl = src.includes("\r\n") ? "\r\n" : "\n";

  /** @type {string[]} */
  const importLines = [];
  /** @type {string[]} */
  const bundleBlocks = [];

  for (const localeId of LOCALES) {
    if (src.includes(`locales/${localeId}/`)) {
      console.log(`load-messages: ${localeId} already wired`);
      continue;
    }
    const locDir = path.join(ROOT, "locales", localeId);
    const nsFiles = fs
      .readdirSync(locDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
    for (const ns of nsFiles) {
      const v = toNsImportVar(ns, localeId);
      importLines.push(
        `import ${v} from "../../locales/${localeId}/${ns}.json" with { type: "json" };`
      );
    }
    const fields = nsFiles
      .map((ns) => `    ${ns}: ${toNsImportVar(ns, localeId)},`)
      .join(nl);
    bundleBlocks.push(`  "${localeId}": Object.freeze({${nl}${fields}${nl}  }),`);
  }

  if (importLines.length === 0) {
    console.log("load-messages: nothing to add");
    return;
  }

  const anchorImport =
    'import worksheetsEnGM from "../../locales/en-GM/worksheets.json" with { type: "json" };';
  if (!src.includes(anchorImport)) {
    throw new Error("load-messages anchor import not found");
  }
  src = src.replace(anchorImport, `${anchorImport}${nl}${importLines.join(nl)}`);

  const anchorBundle = '  "en-AU": Object.freeze({';
  if (!src.includes(anchorBundle)) {
    throw new Error("load-messages anchor bundle not found");
  }
  src = src.replace(anchorBundle, `${bundleBlocks.join(nl)}${nl}${anchorBundle}`);

  fs.writeFileSync(file, src, "utf8");
  console.log(`load-messages: wired ${importLines.length} imports`);
}

function wirePackCatalog() {
  const file = path.join(ROOT, "lib/content/pack-catalog.js");
  let src = fs.readFileSync(file, "utf8");
  const nl = src.includes("\r\n") ? "\r\n" : "\n";

  /** @type {string[]} */
  const importLines = [];
  /** @type {string[]} */
  const catalogBlocks = [];

  for (const localeId of LOCALES) {
    if (src.includes(`content-packs/${localeId}/`)) {
      console.log(`pack-catalog: ${localeId} already wired`);
      continue;
    }
    const packRoot = path.join(ROOT, "content-packs", localeId);
    const files = walkJson(packRoot)
      .map((p) => path.relative(packRoot, p).replace(/\\/g, "/"))
      .sort();
    for (const rel of files) {
      const v = catalogImportVar(rel, localeId);
      importLines.push(
        `import ${v} from "../../content-packs/${localeId}/${rel}" with { type: "json" };`
      );
    }
    const entries = files
      .map((rel) => `    "${rel}": ${catalogImportVar(rel, localeId)},`)
      .join(nl);
    catalogBlocks.push(`  "${localeId}": Object.freeze({${nl}${entries}${nl}  }),`);
  }

  if (importLines.length === 0) {
    console.log("pack-catalog: nothing to add");
    return;
  }

  const catalogExport = "export const CONTENT_PACK_CATALOG = {";
  const idx = src.indexOf(catalogExport);
  if (idx < 0) throw new Error("CONTENT_PACK_CATALOG not found");
  const before = src.slice(0, idx);
  const after = src.slice(idx);
  const lastImportNeedle = 'with { type: "json" };';
  const lastImport = before.lastIndexOf(lastImportNeedle);
  if (lastImport < 0) throw new Error("no prior pack imports");
  const insertAt = lastImport + lastImportNeedle.length;
  src =
    before.slice(0, insertAt) +
    nl +
    importLines.join(nl) +
    before.slice(insertAt) +
    after;

  const authMarker = `${nl}${nl}/**${nl} * English-country burn-down overlay authority`;
  const authAt = src.indexOf(authMarker);
  if (authAt < 0) throw new Error("pack-catalog authority marker not found");
  const closeNeedle = `}),${nl}};`;
  const closeAt = src.lastIndexOf(closeNeedle, authAt);
  if (closeAt < 0) throw new Error("pack-catalog closing brace not found");
  const insertCatalogAt = closeAt + `}),${nl}`.length;
  src =
    src.slice(0, insertCatalogAt) +
    catalogBlocks.join(nl) +
    nl +
    src.slice(insertCatalogAt);

  fs.writeFileSync(file, src, "utf8");
  console.log(`pack-catalog: wired ${importLines.length} imports`);
}

wireLoadMessages();
wirePackCatalog();
console.log("done");
