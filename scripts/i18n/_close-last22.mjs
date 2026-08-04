import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const hybrid = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-hybrid-student.json"), "utf8"));
const bad = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-13-en.json"), "utf8"));
// refresh from current collectors
spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], {
  cwd: ROOT,
  stdio: "pipe",
});
spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-bad.mjs")], {
  cwd: ROOT,
  stdio: "pipe",
});
const h2 = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-hybrid-student.json"), "utf8"));
const b2 = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-13-en.json"), "utf8"));
const ens = [...new Set([...h2.map((x) => x.en), ...b2])];

const DE = {
  "**Content scope:** Division with no remainder. Large numbers; two-digit divisor. Hundreds strategy (8,400÷12).":
    "**Inhaltsumfang:** Division ohne Rest. Große Zahlen; zweistelliger Divisor. Hunderter-Strategie (8.400÷12).",
  "Today in geometry we will learn about three-dimensional solids — shapes that have length, width, and height.":
    "Heute lernen wir in Geometrie etwas über dreidimensionale Körper — Formen mit Länge, Breite und Höhe.",
  "Today we will calculate area of a trapezoid — for example a roof face shaped like a trapezoid.":
    "Heute berechnen wir die Fläche eines Trapezes — zum Beispiel eine Dachfläche in Trapezform.",
  "Today we'll learn division — equal sharing — with large numbers and a two-digit divisor.":
    "Heute lernen wir Division — gerechtes Teilen — mit großen Zahlen und einem zweistelligen Divisor.",
  "Subtraction equations with large numbers require accuracy.":
    "Subtraktionsgleichungen mit großen Zahlen erfordern Genauigkeit.",
  "You can think of it like bundles of 10 and single cubes.":
    "Du kannst es dir wie Bündel von 10 und einzelne Würfel vorstellen.",
  "Leftover questions = division with remainder + checking.":
    "Rest-Fragen = Division mit Rest + Prüfen.",
  "Difference questions appear often — with large numbers.":
    "Differenzfragen kommen oft vor — mit großen Zahlen.",
  "| **title_english** | Even and Odd — Large Numbers |":
    "| **title_english** | Gerade und ungerade — große Zahlen |",
  "Important: no remainder. One step — one sharing.":
    "Wichtig: kein Rest. Ein Schritt — einmal teilen.",
  "Research question, graph, and conclusion.": "Forschungsfrage, Diagramm und Schlussfolgerung.",
  "Research question — clear and measurable": "Forschungsfrage — klar und messbar",
  "Rabbits (prey) and tigers (predators).": "Kaninchen (Beute) und Tiger (Räuber).",
  "# Counting Forward on the Number Line": "# Vorwärtszählen auf dem Zahlenstrahl",
  '"More" = difference — not the total!': "„Mehr“ = Differenz — nicht die Summe!",
  "There are three comparison symbols:": "Es gibt drei Vergleichszeichen:",
  "Check: 48 ÷ 2 = 24 — no remainder.": "Prüfung: 48 ÷ 2 = 24 — kein Rest.",
  "How do you compare large numbers?": "Wie vergleichst du große Zahlen?",
  "Prey — is eaten by a predator.": "Beute — wird von einem Räuber gefressen.",
  "72 ÷ 9 = 8 with no remainder.": "72 ÷ 9 = 8 ohne Rest.",
  "Predator eats; prey is eaten": "Räuber frisst; Beute wird gefressen",
  "At night the body rests.": "In der Nacht ruht der Körper.",
  "Link Grade 3: 7 + 3 = 10 → 67 + 33 = 100 ( same idea with tens).":
    "Verbindung 3. Klasse: 7 + 3 = 10 → 67 + 33 = 100 (dieselbe Idee mit Zehnern).",
  "Link Grade 3: 7 + 3 = 10 → 67 + 33 = 100 (same idea with tens).":
    "Verbindung 3. Klasse: 7 + 3 = 10 → 67 + 33 = 100 (dieselbe Idee mit Zehnern).",
  "Link 3. Klasse: 7 + 3 = 10 → 67 + 33 = 100 ( gleich idea mit tens).":
    "Verbindung 3. Klasse: 7 + 3 = 10 → 67 + 33 = 100 (dieselbe Idee mit Zehnern).",
};

const map = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), "utf8"));
Object.assign(map, DE);
for (const en of ens) {
  if (DE[en]) map[en] = DE[en];
}
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), JSON.stringify(map, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-16-de-map.json"), JSON.stringify(DE, null, 2));
console.log({ ens: ens.length, covered: ens.filter((e) => DE[e]).length, missing: ens.filter((e) => !DE[e]) });

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
if (r.status) process.exit(r.status);
fs.copyFileSync(
  path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
  path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
);

// Direct patch remaining known files
const patches = {
  "docs/learning-book/de-DE/math/g3/drafts/ns_complement10.md": [
    [/Link\s*(Grade\s*3|3\. Klasse):\s*7 \+ 3 = 10 → 67 \+ 33 = 100 \([^)]*\)/g,
      "Verbindung 3. Klasse: 7 + 3 = 10 → 67 + 33 = 100 (dieselbe Idee mit Zehnern)."],
    [/\bGrade\s*([1-6])\b/g, "$1. Klasse"],
  ],
  "docs/learning-book/de-DE/geometry/g2/drafts/solids.md": [
    [
      "Heute lernen wir in Geometrie etwas über three-dimensional solids — Formen, die have length, width, and height.",
      "Heute lernen wir in Geometrie etwas über dreidimensionale Körper — Formen mit Länge, Breite und Höhe.",
    ],
    [
      "Today in geometry we will learn about three-dimensional solids — shapes that have length, width, and height.",
      "Heute lernen wir in Geometrie etwas über dreidimensionale Körper — Formen mit Länge, Breite und Höhe.",
    ],
  ],
};
for (const [rel, list] of Object.entries(patches)) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let t = fs.readFileSync(p, "utf8");
  for (const [a, b] of list) {
    if (a instanceof RegExp) t = t.replace(a, b);
    else t = t.split(a).join(b);
  }
  fs.writeFileSync(p, t);
}

// Apply all DE map entries as full-line replacements across books for safety
for (const f of walk(path.join(ROOT, "docs/learning-book/de-DE"))) {
  const rel = path.relative(path.join(ROOT, "docs/learning-book/de-DE"), f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  let t = fs.readFileSync(f, "utf8");
  let changed = false;
  for (const [en, de] of Object.entries(DE)) {
    if (t.includes(en)) {
      t = t.split(en).join(de);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(f, t);
}

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-bad.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
spawnSync(process.execPath, [path.join(__dirname, "_audit-de-DE-closure.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
