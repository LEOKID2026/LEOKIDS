/**
 * Collect unique non-empty lines from EN learning-book SoT for id-ID translation.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EN = path.join(ROOT, "artifacts/id-ID-phase8/en-sot");
const OUT = path.join(ROOT, "artifacts/id-ID-phase8");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const counts = new Map();
const bySubject = { math: new Map(), geometry: new Map(), science: new Map(), english: new Map() };

function subjectOf(rel) {
  const s = rel.split(/[\\/]/)[0];
  return bySubject[s] ? s : null;
}

function looksTranslatable(line) {
  const t = line.trim();
  if (!t) return false;
  if (/^```/.test(t)) return false;
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(t)) return false;
  if (/^[-*]\s*`[^`]+`\s*$/.test(t)) return false; // bullet of path/token only
  if (/^[\d\s+\-×÷=*/?.,…()\[\]{}%°]+$/.test(t)) return false;
  if (/^[A-Za-z0-9_./:\\-]+$/.test(t) && t.includes("/")) return false;
  // pure backtick tokens
  if (/^`[^`]+`$/.test(t)) return false;
  return /[A-Za-z]/.test(t);
}

for (const f of walk(EN)) {
  const rel = path.relative(EN, f).replace(/\\/g, "/");
  const sub = subjectOf(rel);
  const text = fs.readFileSync(f, "utf8");
  for (const line of text.split(/\r?\n/)) {
    if (!looksTranslatable(line)) continue;
    const key = line.trim();
    counts.set(key, (counts.get(key) || 0) + 1);
    if (sub) bySubject[sub].set(key, (bySubject[sub].get(key) || 0) + 1);
  }
}

const unique = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
fs.writeFileSync(path.join(OUT, "unique-lines.json"), JSON.stringify(unique.map(([en, n]) => ({ en, n })), null, 2));
fs.writeFileSync(
  path.join(OUT, "unique-lines-meta.json"),
  JSON.stringify(
    {
      unique: unique.length,
      totalOccurrences: unique.reduce((s, [, n]) => s + n, 0),
      bySubject: Object.fromEntries(
        Object.entries(bySubject).map(([k, m]) => [k, m.size])
      ),
      top50: unique.slice(0, 50).map(([en, n]) => ({ en, n })),
    },
    null,
    2
  )
);
console.log(JSON.stringify({ unique: unique.length, files: walk(EN).length }, null, 2));
