import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DE = path.join(ROOT, "docs/learning-book/de-DE");

const needles = [
  "one apex",
  "circular Grundseite",
  "Circular Grundseite",
  "3 dimensions",
  "Order of multiplication",
  "Calculate das",
  "Add 4 steps",
  "doesn't matter",
  "Start at ",
  "wie du Calculate",
  "Circular Grund",
];

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const bookHits = [];
for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((l, i) => {
    if (/title_english/i.test(l)) return;
    for (const n of needles) {
      if (l.includes(n)) bookHits.push({ rel, i: i + 1, n, l: l.slice(0, 160) });
    }
  });
}

const uiNeedles = ["Deine Privatsphäre", "Dein Foto", "Dein Browser", "Dein Blatt"];
const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/worksheets.json"), "utf8"));
const adultKeys = Object.keys(ws).filter((k) => k.startsWith("coloringUpload"));
const adultBad = [];
for (const k of adultKeys) {
  const v = String(ws[k] || "");
  for (const n of uiNeedles) {
    if (v.includes(n)) adultBad.push({ k, n, v });
  }
  if (/\b(Dein |Deine |deiner |deinem |bleib |versuche es|Versuche |Speichere )\b/.test(v)) {
    adultBad.push({ k, n: "du-pattern", v });
  }
}

const examples = [
  "geometry/g6/drafts/solids.md",
  "geometry/g6/drafts/rectangular_prism_volume.md",
  "geometry/g4/drafts/rectangular_prism_volume.md",
  "math/g1/drafts/add_two.md",
  "math/g3/drafts/div_with_remainder.md",
].map((rel) => {
  const t = fs.readFileSync(path.join(DE, rel), "utf8");
  const bad = needles.filter((n) => t.includes(n) && !t.split(/\n/).every((l) => !l.includes(n) || /title_english/i.test(l)));
  // simpler: any non-title_english line containing needle
  const lines = t.split(/\n/).filter((l) => !/title_english/i.test(l) && needles.some((n) => l.includes(n)));
  return { rel, badLines: lines };
});

console.log(
  JSON.stringify(
    {
      bookHits,
      adultBad,
      examples,
      keySamples: {
        coloringUploadPrivacyTitle: ws.coloringUploadPrivacyTitle,
        coloringUploadPrivacyBody: ws.coloringUploadPrivacyBody,
        coloringUploadUnsupported: ws.coloringUploadUnsupported,
        coloringUploadFallbackNotice: ws.coloringUploadFallbackNotice,
        coloringUploadPhaseStyleTransfer: ws.coloringUploadPhaseStyleTransfer,
      },
      ok: bookHits.length === 0 && adultBad.length === 0,
    },
    null,
    2
  )
);
if (bookHits.length || adultBad.length) process.exitCode = 1;
