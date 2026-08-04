import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const ens = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-11-en.json"), "utf8"));

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (p.endsWith(".md")) out.push(p);
  }
  return out;
}

const index = new Map();
for (const f of walk(path.join(ROOT, "docs/learning-book/en"))) {
  const rel = path.relative(path.join(ROOT, "docs/learning-book/en"), f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t && !index.has(t)) index.set(t, { rel, i });
  });
}

const pairs = ens.map((en) => {
  const loc = index.get(en);
  let fr = "";
  if (loc) {
    const fp = path.join(ROOT, "docs/learning-book/fr-FR", loc.rel);
    if (fs.existsSync(fp)) fr = (fs.readFileSync(fp, "utf8").split(/\r?\n/)[loc.i] || "").trim();
  }
  return { en, fr };
});

fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-11-en-fr.json"), JSON.stringify(pairs, null, 2));
console.log({ pairs: pairs.length, withFr: pairs.filter((p) => p.fr && p.fr !== p.en).length });
