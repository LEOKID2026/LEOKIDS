/**
 * Phase 5: wire id-ID non-SEO root packs into pack-catalog (pt-BR model).
 * Preserves existing id-ID public-seo registrations.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CATALOG = path.join(ROOT, "lib/content/pack-catalog.js");

/** Same relative paths as CONTENT_PACK_CATALOG.en / pt-BR */
const ROOT_PACKS = [
  "books/ui.json",
  "books/registry-titles.json",
  "books/english-page-skills.json",
  "demo/ui.json",
  "games/burn-down-index.json",
  "games/ui-pack-index.json",
  "global-burn-down/burn-down-index.json",
  "learning/burn-down-index.json",
  "learning/diagnostic-engine-v2-defaults.json",
  "learning/diagnostic-framework-v1.json",
  "learning/diagnostic-labels.json",
  "learning/example-pattern-diagnostics-payload.json",
  "learning/fast-diagnostic-probes.json",
  "learning/fast-diagnostic-tag-labels.json",
  "learning/geometry-content.json",
  "learning/learning-patterns-copy.json",
  "learning/math-animation-titles.json",
  "learning/taxonomy/english.structure.json",
  "learning/taxonomy/english.content.json",
  "learning/taxonomy/geometry.structure.json",
  "learning/taxonomy/geometry.content.json",
  "learning/taxonomy/math.structure.json",
  "learning/taxonomy/math.content.json",
  "learning/taxonomy/science.structure.json",
  "learning/taxonomy/science.content.json",
  "reports/burn-down-index.json",
  "rewards/card-catalog.json",
  "rewards/ui.json",
];

function toVar(rel) {
  return (
    "packIdId_" +
    rel
      .replace(/\.json$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
  );
}

for (const rel of ROOT_PACKS) {
  const abs = path.join(ROOT, "content-packs/id-ID", rel);
  if (!fs.existsSync(abs)) throw new Error(`missing ${rel}`);
}

let src = fs.readFileSync(CATALOG, "utf8");
if (src.includes("packIdId_books_ui")) {
  console.log("already wired non-SEO roots");
  process.exit(0);
}

const importLines = ROOT_PACKS.map((rel) => {
  const v = toVar(rel);
  return `import ${v} from "../../content-packs/id-ID/${rel}" with { type: "json" };`;
}).join("\n");

// Place imports near other id-ID public-seo imports (before CONTENT_PACK_CATALOG)
const marker = "export const CONTENT_PACK_CATALOG = {";
if (!src.includes(marker)) throw new Error("catalog marker missing");
if (!src.includes("PublicSeoPracticeWorksheetsJson_idID")) {
  throw new Error("Phase3 public-seo imports missing");
}
src = src.replace(marker, `${importLines}\n\n${marker}`);

const entryLines = ROOT_PACKS.map((rel) => `    "${rel}": ${toVar(rel)},`).join("\n");

// Expand id-ID catalog object: insert non-SEO keys before public-seo keys
const idBlockRe =
  /("id-ID": Object\.freeze\(\{\r?\n)(\s*"public-seo\/)/;
if (!idBlockRe.test(src)) throw new Error("id-ID catalog block not found");
src = src.replace(idBlockRe, `$1${entryLines}\n$2`);

fs.writeFileSync(CATALOG, src);
console.log(`Wired ${ROOT_PACKS.length} non-SEO root packs into CONTENT_PACK_CATALOG["id-ID"]`);
