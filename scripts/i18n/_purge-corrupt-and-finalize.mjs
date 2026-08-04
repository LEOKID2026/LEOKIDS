/**
 * Purge historically corrupted residue-map values (bare or→oder / on→auf),
 * re-apply clean authored maps, rebuild, fix final lines, audit.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const CORRUPT =
  /Divisiauf|Whbei|foder|modere|befodere|woderds|predatoder|comparisauf|impodertant|anichther|Additiauf|foundatiauf|arefoderm|fodermula|mbei|vauf |wird learn|du kann |Hold mirroder|Modere |swap places|coderner|flach surface|use formula|nieimmt|stell dir vor ein|That ist |Everyday |Here wir |always write|no Rest|Large Numbers|checking\.|part!|its parents|multiply by 1, 2, 3|Rests\./i;

let map = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), "utf8"));
let purged = 0;
for (const [k, v] of Object.entries(map)) {
  if (CORRUPT.test(String(v))) {
    delete map[k];
    purged++;
  }
}
console.log({ purged });

const scopes = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
Object.assign(map, scopes);

for (const part of [
  "part-12-de-map.json",
  "part-14-de-map.json",
  "part-15-de-map.json",
]) {
  const p = path.join(__dirname, "_de-DE-book-residue-parts", part);
  if (!fs.existsSync(p)) continue;
  Object.assign(map, JSON.parse(fs.readFileSync(p, "utf8")));
}

const FINAL = {
  "Now you know the square in geometry.": "Jetzt kennst du das Quadrat in Geometrie.",
  "Now you know the diagonal of a square in geometry.":
    "Jetzt kennst du die Diagonale eines Quadrats in Geometrie.",
  "- You can say:": "- Du kannst sagen:",
  "In practice you'll find division with a remainder — always write quotient and remainder!":
    "In der Übung findest du Division mit Rest — schreibe immer Quotient und Rest!",
  "In practice you'll find division with no remainder — check with multiplication!":
    "In der Übung findest du Division ohne Rest — prüfe mit Multiplikation!",
  "In practice you'll find division with a remainder in words.":
    "In der Übung findest du Division mit Rest in Worten.",
  "In practice you'll find division with remainders.":
    "In der Übung findest du Division mit Rest.",
  "Rule: divisor × quotient = dividend — always check with multiplication.":
    "Regel: Divisor × Quotient = Dividend — prüfe immer mit Multiplikation.",
  "**Content scope:** dividing decimals; decimal point in the quotient":
    "**Inhaltsumfang:** Dezimalzahlen teilen; Komma im Quotienten",
  '5 = the remainder — the answer to "how many are left?"':
    "5 = der Rest — die Antwort auf „wie viele sind übrig?“",
  '"How many are left?" → 7 (the remainder), not 8.':
    "„Wie viele sind übrig?“ → 7 (der Rest), nicht 8.",
  "126,000 ÷ 9 — Step A: find the quotient": "126.000 ÷ 9 — Schritt A: finde den Quotienten",
  "Today we will strengthen division — equal sharing with no remainder — using multi-step breaking apart and checking.":
    "Heute festigen wir Division — gerechtes Teilen ohne Rest — mit mehrschrittigem Zerlegen und Prüfen.",
  "In practice you'll find what is X% of Y? — find the part!":
    "In der Übung findest du: Was ist X % von Y? — finde den Anteil!",
  "What is the difference between comparison and variable?":
    "Was ist der Unterschied zwischen Vergleich und Variable?",
  "What is the difference between predator and prey?":
    "Was ist der Unterschied zwischen Räuber und Beute?",
  "What is similar between a puppy and its parents?":
    "Was ist ähnlich zwischen einem Welpen und seinen Eltern?",
  "In practice you'll find what are the multiples? — multiply by 1, 2, 3…!":
    "In der Übung findest du: Was sind die Vielfachen? — multipliziere mit 1, 2, 3…!",
  "| **title_english** | Division with Remainder — Large Numbers |":
    "| **title_english** | Division mit Rest — große Zahlen |",
  "# Division with Remainder — Large Numbers": "# Division mit Rest — große Zahlen",
  "Link Grade 3: 7 + 3 = 10 → 67 + 33 = 100 (same idea with tens).":
    "Verbindung 3. Klasse: 7 + 3 = 10 → 67 + 33 = 100 (dieselbe Idee mit Zehnern).",
  "- From 12 to 3 — that is a quarter turn": "- Von 12 nach 3 — das ist eine Vierteldrehung",
};
Object.assign(map, FINAL);
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), JSON.stringify(map, null, 2));

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
if (r.status) process.exit(r.status);
fs.copyFileSync(
  path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
  path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
);

// Direct ensure final lines
for (const [rel, pairs] of [
  [
    "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_square.md",
    [["Now you know the square in geometry.", "Jetzt kennst du das Quadrat in Geometrie."]],
  ],
  [
    "docs/learning-book/de-DE/geometry/g4/drafts/diagonal_square.md",
    [
      [
        "Now you know the diagonal of a square in geometry.",
        "Jetzt kennst du die Diagonale eines Quadrats in Geometrie.",
      ],
      ["- You can say:", "- Du kannst sagen:"],
    ],
  ],
]) {
  const p = path.join(ROOT, rel);
  let t = fs.readFileSync(p, "utf8");
  for (const [a, b] of pairs) t = t.split(a).join(b);
  fs.writeFileSync(p, t);
}

// Re-apply Grade→Klasse on READMEs / packs
const packPath = path.join(ROOT, "content-packs/de-DE/books/english-page-skills.json");
fs.writeFileSync(packPath, fs.readFileSync(packPath, "utf8").replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse"));

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
