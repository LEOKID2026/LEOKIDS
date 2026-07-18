import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pageRoots = [
  path.join(root, "pages/learning/book"),
];

/** @param {string} dir */
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs, out);
    else if (ent.name.endsWith(".js")) out.push(abs);
  }
  return out;
}

for (const abs of walk(pageRoots[0])) {
  if (abs.includes("[subject]")) continue;
  let source = fs.readFileSync(abs, "utf8");
  const importMatch = source.match(
    /import \{([^}]+)\} from ["']([^"']*load-(?:math|geometry)-g[1-6]-pages[^"']*)["'];\r?\n/,
  );
  if (!importMatch) continue;

  const symbols = importMatch[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !s.includes("StaticPaths"));
  const importPath = importMatch[2];
  source = source.replace(importMatch[0], "");

  if (!source.includes("getServerSideProps")) continue;

  const dynamicImport = `  const { ${symbols.join(", ")} } = await import("${importPath}");\n`;
  if (source.includes("await import(") && source.includes(importPath)) continue;
  source = source.replace(
    /export async function getServerSideProps\(\{ params \}\) \{\r?\n/,
    `export async function getServerSideProps({ params }) {\n${dynamicImport}`,
  );
  source = source.replace(
    /export async function getServerSideProps\(\) \{\r?\n/,
    `export async function getServerSideProps() {\n${dynamicImport}`,
  );

  fs.writeFileSync(abs, source);
  console.log("fixed imports", path.relative(root, abs));
}
