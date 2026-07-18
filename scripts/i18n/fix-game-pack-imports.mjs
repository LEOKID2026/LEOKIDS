/**
 * Add missing gamePackCopy imports after batch migration.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCAN_ROOTS, EXT, REPO_ROOT } from "./hardcoded-ui-core.mjs";

const root = REPO_ROOT;

/** @param {string} relFile */
function importPath(relFile) {
  const depth = relFile.split(/[/\\]/).length - 1;
  return `${ "../".repeat(depth) }lib/games/game-pack-copy.js`.replace(/\\/g, "/");
}

/** @param {string} dir */
function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(abs, out);
      continue;
    }
    if (!EXT.has(path.extname(name))) continue;
    out.push(path.relative(root, abs).replace(/\\/g, "/"));
  }
  return out;
}

let fixed = 0;
for (const scanRoot of SCAN_ROOTS) {
  const base = path.join(root, scanRoot);
  if (!fs.existsSync(base)) continue;
  for (const rel of walk(base)) {
    const abs = path.join(root, rel);
    let src = fs.readFileSync(abs, "utf8");
    if (!src.includes("gamePackCopy(")) continue;
    if (/export\s+function\s+gamePackCopy\b/.test(src)) continue;
    if (/import\s+\{[^}]*\bgamePackCopy\b/.test(src)) continue;
    const importLine = `import { gamePackCopy } from "${importPath(rel)}";\n`;
    const idx = src.search(/^import /m);
    src = idx >= 0 ? src.slice(0, idx) + importLine + src.slice(idx) : importLine + src;
    fs.writeFileSync(abs, src, "utf8");
    fixed += 1;
    console.log("fixed import:", rel);
  }
}

console.log("total fixed", fixed);
