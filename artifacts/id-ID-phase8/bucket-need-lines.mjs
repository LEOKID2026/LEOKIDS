/**
 * Split need-lines into content vs readme-only vs english-target-heavy.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const EN = path.join(OUT, "en-sot");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const lineLoc = new Map(); // en -> {readme:bool, content:bool, subjects:Set, englishOnly:bool}
for (const f of walk(EN)) {
  const rel = path.relative(EN, f).replace(/\\/g, "/");
  const base = path.basename(f);
  const subject = rel.split("/")[0];
  const isReadme = base.toLowerCase() === "readme.md";
  const text = fs.readFileSync(f, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const en = raw.trim();
    if (!en) continue;
    if (!lineLoc.has(en)) lineLoc.set(en, { readme: false, content: false, subjects: new Set() });
    const rec = lineLoc.get(en);
    if (isReadme) rec.readme = true;
    else rec.content = true;
    rec.subjects.add(subject);
  }
}

const meta = JSON.parse(fs.readFileSync(path.join(OUT, "dict-chunk-meta.json"), "utf8"));
const need = [];
for (const { file } of meta.chunkMeta) {
  need.push(...JSON.parse(fs.readFileSync(path.join(OUT, "dict-chunks", file), "utf8")));
}

const buckets = {
  readmeOnly: [],
  contentMathGeoSci: [],
  contentEnglish: [],
  shared: [],
};

for (const en of need) {
  const rec = lineLoc.get(en) || { readme: false, content: true, subjects: new Set(["?"]) };
  const subs = [...rec.subjects];
  if (rec.readme && !rec.content) {
    buckets.readmeOnly.push(en);
    continue;
  }
  const onlyEn = subs.length === 1 && subs[0] === "english";
  const noEnglish = !subs.includes("english");
  if (onlyEn) buckets.contentEnglish.push(en);
  else if (noEnglish) buckets.contentMathGeoSci.push(en);
  else buckets.shared.push(en);
}

const summary = Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length]));
fs.writeFileSync(
  path.join(OUT, "need-buckets.json"),
  JSON.stringify({ summary, buckets }, null, 2)
);
console.log(summary);
