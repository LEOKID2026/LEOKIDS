import fs from "node:fs";
import path from "node:path";

const HE = /[\u0590-\u05FF]/;
const root = process.cwd();

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.includes(`${path.sep}drafts${path.sep}`) && f.endsWith(".md")) out.push(f);
  }
  return out;
}

const active = new Set();
for (const f of fs.readdirSync(path.join(root, "lib/learning-book"))) {
  if (!f.endsWith("-registry.js")) continue;
  const t = fs.readFileSync(path.join(root, "lib/learning-book", f), "utf8");
  for (const m of t.matchAll(/"([a-z0-9_]+)"/g)) {
    const id = m[1];
    if (id.includes("_") || /^[a-z]+$/.test(id)) active.add(id);
  }
}

const files = walk(path.join(root, "docs/learning-book"));
let heActive = 0;
let heInactive = 0;
const activeSamples = [];
for (const f of files) {
  const id = path.basename(f, ".md");
  const has = HE.test(fs.readFileSync(f, "utf8"));
  if (!has) continue;
  if (active.has(id)) {
    heActive++;
    if (activeSamples.length < 15) activeSamples.push(path.relative(root, f));
  } else heInactive++;
}
console.log("active page ids approx", active.size);
console.log("active drafts with hebrew", heActive);
console.log("inactive drafts with hebrew", heInactive);
console.log("samples:", activeSamples.join("\n"));
