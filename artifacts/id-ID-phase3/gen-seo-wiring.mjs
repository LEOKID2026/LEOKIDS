/**
 * Generate id-ID public-seo client index + pack-catalog snippet.
 * Run: node artifacts/id-ID-phase3/gen-seo-wiring.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SEO_DIR = path.join(ROOT, "content-packs/id-ID/public-seo");

function walk(dir, base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, rel));
    else if (e.name.endsWith(".json")) out.push(rel.replace(/\\/g, "/"));
  }
  return out.sort();
}

const files = walk(SEO_DIR);
if (files.length !== 28) {
  throw new Error(`Expected 28 overlays, found ${files.length}`);
}

function toImportVar(rel) {
  return (
    "seoIdId_" +
    rel
      .replace(/\.json$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
  );
}

const importLines = files.map((rel) => {
  const v = toImportVar(rel);
  return `import ${v} from "../../content-packs/id-ID/public-seo/${rel}" with { type: "json" };`;
});

const mapLines = files.map((rel) => `  "${rel}": ${toImportVar(rel)},`);

const clientSrc = `/**
 * Indonesian Master public-seo client overlays (id-ID).
 * Schema mirrors public-seo-ar-001-client-index.js; locale-specific module.
 */
${importLines.join("\n")}

export const ID_ID_PUBLIC_SEO = Object.freeze({
${mapLines.join("\n")}
});

export const ID_ID_PUBLIC_SEO_KEYS = Object.freeze(Object.keys(ID_ID_PUBLIC_SEO));

/**
 * Exact client-side public-seo overlay for id-ID (no fallback).
 * @param {string|null|undefined} locale
 * @param {...string} segments
 * @returns {unknown}
 */
export function getClientPublicSeoOverlay(locale, ...segments) {
  const loc = String(locale || "").trim();
  if (loc !== "id-ID") return null;
  const key = segments
    .map((s) => String(s || "").replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return ID_ID_PUBLIC_SEO[key] ?? null;
}
`;

fs.writeFileSync(
  path.join(ROOT, "lib/seo/public-seo-id-ID-client-index.js"),
  clientSrc,
  "utf8"
);

const catalogImportLines = files.map((rel) => {
  const v =
    "PublicSeo" +
    rel
      .replace(/\.json$/, "")
      .split(/[\\/]/)
      .map((p) => p.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase()).replace(/-/g, ""))
      .join("") +
    "Json_idID";
  return { rel, v, line: `import ${v} from "../../content-packs/id-ID/public-seo/${rel}" with { type: "json" };` };
});

const catalogBlock = `
// --- id-ID public-seo only (Phase 3) ---
${catalogImportLines.map((x) => x.line).join("\n")}
`;

const catalogEntry = `
  "id-ID": Object.freeze({
${catalogImportLines
  .map((x) => `    "public-seo/${x.rel}": ${x.v},`)
  .join("\n")}
  }),
`;

fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-phase3/pack-catalog-id-ID-snippet.txt"),
  catalogBlock + "\n" + catalogEntry,
  "utf8"
);

console.log("Wrote client index + catalog snippet for", files.length, "files");
console.log(JSON.stringify({ files }, null, 2));
