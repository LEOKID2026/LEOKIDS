import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), "utf8"));

const FINAL = {
  "Now you know the square in geometry.": "Jetzt kennst du das Quadrat in Geometrie.",
  "Now you know the diagonal of a square in geometry.":
    "Jetzt kennst du die Diagonale eines Quadrats in Geometrie.",
  "- You can say:": "- Du kannst sagen:",
  "In practice you'll find division with a remainder — always write quotient and remainder!":
    "In der Übung findest du Division mit Rest — schreibe immer Quotient und Rest!",
  "Rule: divisor × quotient = dividend — always check with multiplication.":
    "Regel: Divisor × Quotient = Dividend — prüfe immer mit Multiplikation.",
  "**Content scope:** dividing decimals; decimal point in the quotient":
    "**Inhaltsumfang:** Dezimalzahlen teilen; Komma im Quotienten",
  '5 = the remainder — the answer to "how many are left?"':
    "5 = der Rest — die Antwort auf „wie viele sind übrig?“",
  '"How many are left?" → 7 (the remainder), not 8.':
    "„Wie viele sind übrig?“ → 7 (der Rest), nicht 8.",
  "126,000 ÷ 9 — Step A: find the quotient": "126.000 ÷ 9 — Schritt A: finde den Quotienten",
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

// Direct patch the two known files if rebuild title cells still English
for (const [rel, pairs] of [
  [
    "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_square.md",
    [["Now you know the square in geometry.", "Jetzt kennst du das Quadrat in Geometrie."]],
  ],
  [
    "docs/learning-book/de-DE/geometry/g4/drafts/diagonal_square.md",
    [
      ["Now you know the diagonal of a square in geometry.", "Jetzt kennst du die Diagonale eines Quadrats in Geometrie."],
      ["- You can say:", "- Du kannst sagen:"],
    ],
  ],
]) {
  const p = path.join(ROOT, rel);
  let t = fs.readFileSync(p, "utf8");
  for (const [a, b] of pairs) t = t.split(a).join(b);
  fs.writeFileSync(p, t);
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
