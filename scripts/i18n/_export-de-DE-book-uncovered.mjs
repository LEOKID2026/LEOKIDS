import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EN = path.join(ROOT, "docs/learning-book/en");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/i18n/_de-DE-book-residue-map.json"), "utf8"));
import { EXACT } from "./_de-DE-book-line.mjs";

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (p.endsWith(".md")) out.push(p);
  }
  return out;
}

const freq = new Map();
for (const f of walk(EN)) {
  const rel = path.relative(EN, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || !/[A-Za-z]/.test(t)) continue;
    if (/^\|\s*\*\*(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status)\*\*/i.test(t))
      continue;
    if (/^[-*]\s*`[^`]+`$/.test(t)) continue;
    if (/^[\d\s+\-−–—×÷=<>().,/π√%°cm²m³:?]+$/.test(t)) continue;
    if (map[t] || EXACT[t]) continue;
    // skip pure code/path refs
    if (/^docs\//.test(t) || /^data\//.test(t)) continue;
    freq.set(t, (freq.get(t) || 0) + 1);
  }
}

const arr = [...freq.entries()]
  .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
  .map(([en, c]) => ({ en, c }));

fs.writeFileSync(path.join(ROOT, "scripts/i18n/_de-DE-book-uncovered.json"), JSON.stringify(arr, null, 2));
console.log({ uncovered: arr.length, chars: arr.reduce((a, x) => a + x.en.length, 0), top20: arr.slice(0, 20) });
