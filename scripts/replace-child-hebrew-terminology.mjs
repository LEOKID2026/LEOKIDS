/**
 * Replace user-facing Hebrew "/" with "//".
 * Skips learning question banks and internal docs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".next",
  "review-packages",
  "docs",
  ".cursor",
  "_handoff",
  "hebrew-owner-review",
  "qa-evidence-audit",
]);

const SKIP_FILE_PATTERNS = [
  /[\\/]data[\\/]hebrew-literacy-/,
  /[\\/]data[\\/]science-questions\.js$/,
  /[\\/]data[\\/]english-questions[\\/]/,
  /[\\/]data[\\/]curriculum-oracle[\\/]/,
  /[\\/]utils[\\/]/,
  /[\\/]data[\\/]hebrew-copy-baseline[\\/]/,
];

const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".json", ".md"]);

const RULES = [
  [" ", " "],
  [" ", " "],
  [" ", " "],
  ["  ", "  /"],
  [" ", " /"],
  [" ", " /"],
  [" ", " /"],
  [" ", " /"],
  [" :", " /:"],
  ["  ", " / "],
  ["  ", "  /"],
  ["PIN ", "PIN /"],
  ["  ", "  /"],
  [" ", " /"],
  [" ", " /"],
  ["  ", "  /"],
  [" ", " /"],
  [" ", " /"],
  [" ", " /"],
  [" ", " /"],
  [" ", " /"],
  [" ", " /"],
  ["  ", "  /"],
  ["", "/"],
  ["", ""],
  ["", ""],
  ["", "/"],
  ["", "/"],
  ["/", "/"],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", "/"],
];

function shouldSkipFile(absPath) {
  if (!EXT.has(path.extname(absPath))) return true;
  return SKIP_FILE_PATTERNS.some((re) => re.test(absPath.replace(/\//g, "\\")) || re.test(absPath));
}

function shouldSkipDir(absPath) {
  return SKIP_DIR_NAMES.has(path.basename(absPath));
}

function replaceText(text) {
  let out = text;
  for (const [from, to] of RULES) {
    out = out.split(from).join(to);
  }
  return out;
}

function walk(dir, changedFiles) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (shouldSkipDir(abs)) continue;
      walk(abs, changedFiles);
      continue;
    }
    if (shouldSkipFile(abs)) continue;
    const before = fs.readFileSync(abs, "utf8");
    if (!before.includes("")) continue;
    const after = replaceText(before);
    if (after !== before) {
      fs.writeFileSync(abs, after, "utf8");
      changedFiles.push(path.relative(ROOT, abs));
    }
  }
}

const targets = ["pages", "components", "lib", "data/help-center", "data/legal", "tests/e2e", "scripts/help-center"];
const changed = [];
for (const rel of targets) {
  const abs = path.join(ROOT, rel);
  if (fs.existsSync(abs)) walk(abs, changed);
}

console.log(`Updated ${changed.length} files`);
for (const f of changed.sort()) console.log(f);
