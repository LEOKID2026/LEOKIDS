import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DE = path.join(ROOT, "docs/learning-book/de-DE");

const MASH =
  /\b(Lernening|Volumenn|Wie much|colored|calculations|prepares du|of a Quader|of a Kugel|of a Zylinder|of a Kegel|Properties of a|parts of a|Knowing solids|Parentheses in Calculations|numeratoder|denominatoder|gleich parts|basic fractions|Split into|There sind|Expund|Pyramidee|Diagonale splits|Wie much)\b/i;
const HE = /[\u0590-\u05FF]/;

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const mash = [];
const heb = [];
for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  for (const [i, l] of fs.readFileSync(f, "utf8").split(/\r?\n/).entries()) {
    if (HE.test(l)) heb.push({ rel, i: i + 1, l: l.slice(0, 140) });
    if (rel.startsWith("english/")) continue;
    if (/\|\s*\*\*title_english\*\*/i.test(l)) continue;
    if (MASH.test(l)) mash.push({ rel, i: i + 1, l: l.slice(0, 160) });
  }
}

const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/ui.json"), "utf8"));
const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/worksheets.json"), "utf8"));
const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/school.json"), "utf8"));

const adultKeys = {
  coloringUploadHint: ws.coloringUploadHint,
  operatorDataViewerDesc: school.portal.operatorDataViewerDesc,
  installedParent: ui.pwa.installedParent,
  promptAcceptedParent: ui.pwa.promptAcceptedParent,
};
const adultBad = Object.entries(adultKeys).filter(
  ([, v]) => /\b(Dein |deinem |deinen |deines |Du |Öffne das|aktualisiere |versuche es erneut|entferne )\b/.test(v)
);

const examples = [
  "geometry/g6/drafts/solids.md",
  "geometry/g6/drafts/rectangular_prism_volume.md",
  "math/g3/drafts/fractions.md",
].map((rel) => {
  const lines = fs.readFileSync(path.join(DE, rel), "utf8").split(/\r?\n/);
  return { rel, h1: lines[0], mashLines: lines.filter((l) => MASH.test(l) && !/title_english/i.test(l)) };
});

console.log(
  JSON.stringify(
    {
      mash: mash.length,
      mashSamples: mash,
      heb: heb.length,
      hebSamples: heb.slice(0, 10),
      adultBad: adultBad.map(([k, v]) => [k, v]),
      adultKeys,
      examples,
      ok: mash.length === 0 && heb.length === 0 && adultBad.length === 0,
    },
    null,
    2
  )
);
if (mash.length || heb.length || adultBad.length) process.exitCode = 1;
