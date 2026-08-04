/**
 * Restore EOL `|` → `||` by matching against e8b01fa0b left-hand sides.
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = "e8b01fa0b";

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walk(p, out);
    } else if (/\.(js|mjs)$/i.test(ent.name)) out.push(p);
  }
  return out;
}

function restoreFile(abs) {
  const rel = path.relative(ROOT, abs).split(path.sep).join("/");
  let prev;
  try {
    prev = execSync(`git show ${BASE}:${rel}`, {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch {
    return 0;
  }
  const cur = fs.readFileSync(abs, "utf8");
  const prevEolOr = new Map();
  for (const line of prev.split(/\r?\n/)) {
    const m = line.match(/^(\s*)(.*?)(\|\|)\s*$/);
    if (!m) continue;
    const key = m[2].replace(/\s+/g, " ").trim();
    if (key) prevEolOr.set(key, true);
  }
  let changed = 0;
  const out = cur.split(/\r?\n/).map((line) => {
    if (/\|\|\s*$/.test(line)) return line;
    const m = line.match(/^(\s*)(.*)(\|)\s*$/);
    if (!m) return line;
    const key = m[2].replace(/\s+/g, " ").trim();
    if (!key || !prevEolOr.has(key)) return line;
    changed += 1;
    return `${m[1]}${m[2]}||`;
  });
  if (changed) fs.writeFileSync(abs, out.join("\n"));
  return changed;
}

const roots = [
  "utils/parent-copilot",
  "utils/contracts",
  "utils/canonical-topic-state",
  "utils/parent-report-language",
  "utils/parent-report-output-integrity",
  "utils/learning-pattern-decision",
];

let files = 0;
let total = 0;
for (const root of roots) {
  for (const abs of walk(path.join(ROOT, root))) {
    const n = restoreFile(abs);
    if (n) {
      files += 1;
      total += n;
      console.log(path.relative(ROOT, abs).split(path.sep).join("/"), n);
    }
  }
}
console.log(JSON.stringify({ files, total }, null, 2));
