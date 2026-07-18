import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pageRoot = path.join(root, "pages/learning/book");

/** @param {string} dir */
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs, out);
    else if (ent.name.endsWith(".js")) out.push(abs);
  }
  return out;
}

const loaderByFn = {
  loadMathG1TocEntries: "../../../../../lib/learning-book/load-math-g1-pages",
  loadMathG2TocEntries: "../../../../../lib/learning-book/load-math-g2-pages",
  loadMathG3TocEntries: "../../../../../lib/learning-book/load-math-g3-pages",
  loadMathG4TocEntries: "../../../../../lib/learning-book/load-math-g4-pages",
  loadMathG5TocEntries: "../../../../../lib/learning-book/load-math-g5-pages",
  loadMathG6TocEntries: "../../../../../lib/learning-book/load-math-g6-pages",
  loadGeometryG1TocEntries: "../../../../../lib/learning-book/load-geometry-g1-pages",
  loadGeometryG2TocEntries: "../../../../../lib/learning-book/load-geometry-g2-pages",
  loadGeometryG3TocEntries: "../../../../../lib/learning-book/load-geometry-g3-pages",
  loadGeometryG4TocEntries: "../../../../../lib/learning-book/load-geometry-g4-pages",
  loadGeometryG5TocEntries: "../../../../../lib/learning-book/load-geometry-g5-pages",
  loadGeometryG6TocEntries: "../../../../../lib/learning-book/load-geometry-g6-pages",
};

for (const abs of walk(pageRoot)) {
  let source = fs.readFileSync(abs, "utf8");
  for (const [fn, importPath] of Object.entries(loaderByFn)) {
    if (!source.includes(fn)) continue;
    if (source.includes(`await import("${importPath}")`)) continue;
    const dynamicImport = `  const { ${fn} } = await import("${importPath}");\n`;
    source = source.replace(
      /export async function getServerSideProps\(\) \{\r?\n/,
      `export async function getServerSideProps() {\n${dynamicImport}`,
    );
    fs.writeFileSync(abs, source);
    console.log("fixed index", path.relative(root, abs), fn);
    break;
  }
}
