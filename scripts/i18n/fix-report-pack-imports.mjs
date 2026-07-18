import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next") continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs, out);
    else if (/\.(js|jsx)$/.test(ent.name)) out.push(abs);
  }
  return out;
}

/** @param {string} rel */
function importPath(rel) {
  const depth = rel.split(/[/\\]/).length - 1;
  return `${ "../".repeat(depth) }lib/reports/report-pack-copy.js`.replace(/\\/g, "/");
}

let fixed = 0;
for (const abs of walk(root)) {
  const rel = path.relative(root, abs).replace(/\\/g, "/");
  if (rel === "lib/reports/report-pack-copy.js") continue;
  const src = fs.readFileSync(abs, "utf8");
  if (!src.includes("reportPackCopy(")) continue;
  if (src.includes("reportPackCopy }") || src.includes("{ reportPackCopy }")) continue;
  const importLine = `import { reportPackCopy } from "${importPath(rel)}";\n`;
  const idx = src.search(/^import /m);
  const next = idx >= 0 ? src.slice(0, idx) + importLine + src.slice(idx) : importLine + src;
  fs.writeFileSync(abs, next, "utf8");
  fixed += 1;
  console.log("import", rel);
}
console.log("fixed", fixed);
