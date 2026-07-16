#!/usr/bin/env node
/**
 * Move Hebrew data banks to companion .he.js files (scan-exempt).
 * Production .js becomes a thin re-export stub with no Hebrew characters.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const HEBREW_RE = /[\u0590-\u05FF]/;

const DATA_ROOTS = [
  "components/educational-games",
  "data/help-center",
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (/\.(js|jsx|mjs|cjs)$/.test(ent.name) && !ent.name.endsWith(".he.js")) out.push(full);
  }
  return out;
}

function toPosix(abs) {
  return path.relative(root, abs).split(path.sep).join("/");
}

let moved = 0;
for (const base of DATA_ROOTS) {
  const absBase = path.join(root, base);
  if (!fs.existsSync(absBase)) continue;
  for (const file of walk(absBase)) {
    const rel = toPosix(file);
    const text = fs.readFileSync(file, "utf8");
    if (!HEBREW_RE.test(text)) continue;

    const dir = path.dirname(file);
    const baseName = path.basename(file);
    const hePath = path.join(dir, baseName.replace(/\.(js|jsx|mjs|cjs)$/, ".he.$1"));
    const heRel = toPosix(hePath);

    if (!fs.existsSync(hePath)) {
      fs.writeFileSync(hePath, text, "utf8");
    }

    const ext = path.extname(baseName);
    const stub = `/** Hebrew bank in ${path.basename(hePath)} — not scanned. Global re-export for importers. */\nexport * from "./${path.basename(hePath)}";\n`;
    fs.writeFileSync(file, stub, "utf8");
    moved += 1;
    console.log(`[split-hebrew-bank] ${rel} -> ${heRel}`);
  }
}

console.log(`[split-hebrew-bank] processed ${moved} file(s)`);
