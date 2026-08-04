/**
 * Author remaining student-hybrid EN lines — full sentences only, no short-word salad.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { EXACT as BOOK_EXACT, translateBookLineDe } from "./_de-DE-book-line.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function money(s) {
  return String(s)
    .replace(/\b(\d+(?:[.,]\d+)?)\s*shekels?\b/gi, "$1 Euro")
    .replace(/\bshekels?\b/gi, "Euro")
    .replace(/\bagorot\b/gi, "Cent")
    .replace(/\$(\d)/g, "€$1")
    .replace(/(\d),(\d{3})\b/g, "$1.$2");
}

const LONG = [
  ["rectangular prism", "Quader"],
  ["three-dimensional solids", "dreidimensionale Körper"],
  ["equal sharing", "gleichmäßiges Teilen"],
  ["quarter turn", "Vierteldrehung"],
  ["number line", "Zahlenstrahl"],
  ["word problems", "Textaufgaben"],
  ["word problem", "Textaufgabe"],
  ["food webs", "Nahrungsnetze"],
  ["basic chemistry", "Grundlagen der Chemie"],
  ["order of operations", "Reihenfolge der Rechenoperationen"],
  ["breaking apart", "Zerlegen"],
  ["multi-step", "mehrstufig"],
  ["research question", "Forschungsfrage"],
  ["class presentation", "Klassenvortrag"],
  ["storage space", "Stauraum"],
  ["earlier grades", "früheren Klassen"],
  ["whole border", "gesamten Rand"],
  ["times table", "Einmaleins"],
  ["long division", "schriftliche Division"],
  ["fair sharing", "gerechtes Teilen"],
  ["natural fibers", "Naturfasern"],
  ["how much space the square takes up on a surface", "wie viel Platz das Quadrat auf einer Fläche einnimmt"],
  ["shapes that have length, width, and height", "Formen mit Länge, Breite und Höhe"],
  ["in your head", "im Kopf"],
  ["Grade 1", "1. Klasse"],
  ["Grade 2", "2. Klasse"],
  ["Grade 3", "3. Klasse"],
  ["Grade 4", "4. Klasse"],
  ["the volume of a", "das Volumen eines"],
  ["the perimeter of a", "den Umfang eines"],
  ["the area of a", "die Fläche eines"],
  ["the diagonal of a", "die Diagonale eines"],
  ["a rectangular prism", "einen Quader"],
  ["a square", "ein Quadrat"],
  ["a rectangle", "ein Rechteck"],
  ["a cube", "ein Würfel"],
  ["the cube", "den Würfel"],
  ["the square", "das Quadrat"],
  ["parallelogram", "Parallelogramm"],
  ["trapezoid", "Trapez"],
  ["Trapezoid", "Trapez"],
];

function applyLong(s) {
  let out = s;
  for (const [en, de] of LONG.sort((a, b) => b[0].length - a[0].length)) {
    out = out.split(en).join(de);
  }
  return out;
}

function author(en) {
  const raw = money(String(en).trim());
  if (!raw) return en;
  if (BOOK_EXACT[raw]) return BOOK_EXACT[raw];

  let m;
  if ((m = raw.match(/^Trapezoid: bases (.+?), area (.+?) — what is the height\?$/i)))
    return `Trapez: Grundseiten ${m[1].replace(/\band\b/g, "und")}, Fläche ${m[2]} — was ist die Höhe?`;
  if ((m = raw.match(/^Trapezoid: bases (.+?), height (.+?) — what is the area\?$/i)))
    return `Trapez: Grundseiten ${m[1].replace(/\band\b/g, "und")}, Höhe ${m[2]} — was ist die Fläche?`;
  if (/^Repeated addition:/i.test(raw)) return raw.replace(/^Repeated addition:/i, "Wiederholte Addition:");

  if ((m = raw.match(/^Today in geometry we will learn about (.+)\.$/i)))
    return `Heute lernen wir in Geometrie etwas über ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in geometry we will learn to (.+)\.$/i)))
    return `Heute lernen wir in Geometrie, ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in geometry we will learn what (.+)\.$/i)))
    return `Heute lernen wir in Geometrie, was ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in geometry we will go deeper into (.+)\.$/i)))
    return `Heute gehen wir in Geometrie tiefer ein auf ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in geometry we will strengthen (.+)\.$/i)))
    return `Heute festigen wir in Geometrie ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in geometry we will learn (.+)\.$/i)))
    return `Heute lernen wir in Geometrie ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in science we will learn about (.+)\.$/i)))
    return `Heute lernen wir in Naturwissenschaften etwas über ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in science we will learn to (.+)\.$/i)))
    return `Heute lernen wir in Naturwissenschaften, ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in science we will learn (.+)\.$/i)))
    return `Heute lernen wir in Naturwissenschaften ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in math we will learn about (.+)\.$/i)))
    return `Heute lernen wir in Mathematik etwas über ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in math we will learn to (.+)\.$/i)))
    return `Heute lernen wir in Mathematik, ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today in math we will learn (.+)\.$/i)))
    return `Heute lernen wir in Mathematik ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we're going to learn to (.+)\.$/i)))
    return `Heute lernen wir, ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we're going to learn (.+)\.$/i)))
    return `Heute lernen wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we'll learn about (.+)\.$/i)))
    return `Heute lernen wir etwas über ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we'll learn to (.+)\.$/i)))
    return `Heute lernen wir, ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we'll learn (.+)\.$/i)))
    return `Heute lernen wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we'll solve (.+)\.$/i)))
    return `Heute lösen wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we'll check (.+)\.$/i)))
    return `Heute prüfen wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we will learn about (.+)\.$/i)))
    return `Heute lernen wir etwas über ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we will learn to (.+)\.$/i)))
    return `Heute lernen wir, ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we will learn (.+)\.$/i)))
    return `Heute lernen wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we will strengthen (.+)\.$/i)))
    return `Heute festigen wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we will calculate (.+)\.$/i)))
    return `Heute berechnen wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we will solve (.+)\.$/i)))
    return `Heute lösen wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Today we will (.+)\.$/i)))
    return `Heute werden wir ${applyLong(m[1])}.`;
  if ((m = raw.match(/^We will learn about (.+)\.$/i)))
    return `Wir lernen etwas über ${applyLong(m[1])}.`;
  if ((m = raw.match(/^We will learn what (.+)\.$/i)))
    return `Wir lernen, was ${applyLong(m[1])}.`;
  if ((m = raw.match(/^We will learn (.+)\.$/i)))
    return `Wir lernen ${applyLong(m[1])}.`;
  if ((m = raw.match(/^In practice you'll find (.+)$/i)))
    return `In der Übung findest du ${applyLong(m[1])}`;
  if ((m = raw.match(/^In practice you will find (.+)$/i)))
    return `In der Übung findest du ${applyLong(m[1])}`;
  if ((m = raw.match(/^Now you know how to (.+)\.$/i)))
    return `Jetzt weißt du, wie du ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Now you know (.+)\.$/i)))
    return `Jetzt weißt du ${applyLong(m[1])}.`;
  if ((m = raw.match(/^When you practice, look for (.+)\.$/i)))
    return `Wenn du übst, achte auf ${applyLong(m[1])}.`;
  if ((m = raw.match(/^Important: (.+)$/i)))
    return `Wichtig: ${applyLong(m[1])}`;

  // Prefer long-phrase book engine (short swaps disabled there)
  const via = translateBookLineDe(raw);
  if (via !== raw && !stillEn(via)) return via;

  return applyLong(raw);
}

function stillEn(s) {
  return /\b(the|and|with|that|which|because|through|their|they|these|those|would|could|should|from|have|been|does|make|help|need|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|Today|Now you|In practice|Look for|Try to|How many|How much|A square|A rectangle|changes in|work with|all work)\b/.test(
    s
  );
}

// Manual quality overrides for known broken / high-value lines
const MANUAL = {
  "Today in science we will learn about basic chemistry — changes in materials, density — and safety in all work with materials.":
    "Heute lernen wir in Naturwissenschaften etwas über Grundlagen der Chemie — Veränderungen von Materialien, Dichte — und Sicherheit bei jeder Arbeit mit Materialien.",
  "Today in geometry we will learn to calculate the volume of a rectangular prism — a box, crate, or small storage space.":
    "Heute lernen wir in Geometrie, das Volumen eines Quaders zu berechnen — einer Schachtel, einer Kiste oder eines kleinen Stauraums.",
  "We will learn what a quarter turn is — a rotation of 90° — like when you turn an arrow a quarter of the way around.":
    "Wir lernen, was eine Vierteldrehung ist — eine Drehung um 90° — wie wenn du einen Pfeil um ein Viertel des Weges drehst.",
  "Today in geometry we will learn what the area of a square is — how much space the square takes up on a surface.":
    "Heute lernen wir in Geometrie, was die Fläche eines Quadrats ist — wie viel Platz das Quadrat auf einer Fläche einnimmt.",
  "Today we'll learn about the diagonal of a parallelogram in geometry — ideas, not one formula for every case.":
    "Heute lernen wir in Geometrie etwas über die Diagonale eines Parallelogramms — Ideen, nicht eine Formel für jeden Fall.",
  "Today we will calculate volume of a rectangular prism directly — all three dimensions in one multiplication.":
    "Heute berechnen wir das Volumen eines Quaders direkt — alle drei Abmessungen in einer Multiplikation.",
  "Today we'll solve a remainder word problem — how many are left after filling equal boxes (or groups).":
    "Heute lösen wir eine Textaufgabe zum Rest — wie viele bleiben übrig, nachdem gleiche Kisten (oder Gruppen) gefüllt wurden.",
  "Today in geometry we will learn to find the perimeter of a square — the length of the whole border.":
    "Heute lernen wir in Geometrie, den Umfang eines Quadrats zu finden — die Länge des gesamten Rands.",
  "Trapezoid: bases 3 cm and 7 cm, area 30 cm² — what is the height?":
    "Trapez: Grundseiten 3 cm und 7 cm, Fläche 30 cm² — was ist die Höhe?",
  "Trapezoid: bases 4 cm and 8 cm, height 6 cm — what is the area?":
    "Trapez: Grundseiten 4 cm und 8 cm, Höhe 6 cm — was ist die Fläche?",
  "Now you know about basic chemistry and safety in science.":
    "Jetzt kennst du Grundlagen der Chemie und Sicherheit in den Naturwissenschaften.",
};

const hybrid = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-hybrid-student.json"), "utf8"));
const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const scopesDe = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
Object.assign(map, scopesDe, MANUAL);

let bad = 0;
const badSamples = [];
for (const { en } of hybrid) {
  const de = MANUAL[en] || author(en);
  map[en] = de;
  if (stillEn(de)) {
    bad++;
    if (badSamples.length < 40) badSamples.push({ en, de });
  }
}
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-hybrid-bad.json"), JSON.stringify(badSamples, null, 2));
console.log({ authored: hybrid.length, stillBad: bad, mapSize: Object.keys(map).length, badSamples: badSamples.slice(0, 12) });

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], { cwd: ROOT, stdio: "inherit" });
if (r.status) process.exit(r.status);
fs.copyFileSync(
  path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
  path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
);
r = spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(r.status || 0);
