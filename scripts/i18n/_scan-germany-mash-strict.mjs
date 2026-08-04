import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DE = path.join(ROOT, "docs/learning-book/de-DE");
const MASH =
  /\b(to add|to subtract|to multiply|to divide|Steps für|Steps for|Hundreds \+|ones:|carry |Coin Values|wie viel ist Left|Left\?|number line|What is|How many|Write the|Read the|Today we will learn to |Today we're going to learn to |with remainder|no remainder|full boxes|missing number|place value|times table|word problem)\b/i;

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const hits = [];
for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((l, i) => {
    if (!MASH.test(l)) return;
    if (/\|\s*\*\*title_english\*\*/i.test(l)) return;
    hits.push({ rel, i: i + 1, l: l.slice(0, 160) });
  });
}
console.log(JSON.stringify({ count: hits.length, hits }, null, 2));
