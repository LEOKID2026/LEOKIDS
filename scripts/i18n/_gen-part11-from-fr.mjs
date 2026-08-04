/**
 * Align remaining hybrid EN lines to fr-FR, then apply curated FR→DE educational phrases
 * plus full-line overrides. Merge into residue map and rebuild.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN_ROOT = path.join(ROOT, "docs/learning-book/en");
const FR_ROOT = path.join(ROOT, "docs/learning-book/fr-FR");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (p.endsWith(".md")) out.push(p);
  }
  return out;
}

/** Longest-first FR→DE educational phrases (Germany). */
const FR_DE = [
  ["Deux pots identiques, même quantité d’eau et même lumière ; seule température différente (variable).", "Zwei gleiche Töpfe, dieselbe Menge Wasser und dasselbe Licht; nur die Temperatur ist unterschiedlich (Variable)."],
  ["Aujourd'hui, en géométrie, nous allons", "Heute lernen wir in Geometrie"],
  ["Aujourd'hui, en sciences, nous allons", "Heute lernen wir in Naturwissenschaften"],
  ["Aujourd'hui, en maths, nous allons", "Heute lernen wir in Mathematik"],
  ["Aujourd'hui, nous allons apprendre", "Heute lernen wir"],
  ["Aujourd'hui, nous allons", "Heute werden wir"],
  ["En pratique, tu trouveras", "In der Übung findest du"],
  ["En pratique, tu vas trouver", "In der Übung findest du"],
  ["Maintenant, tu sais comment", "Jetzt weißt du, wie du"],
  ["Maintenant, tu sais", "Jetzt weißt du"],
  ["Lorsque tu t'entraînes, cherche des questions sur", "Wenn du übst, achte auf Fragen zu"],
  ["Lorsque tu t'entraînes, cherche", "Wenn du übst, achte auf"],
  ["Important :", "Wichtig:"],
  ["Étape 3 —", "Schritt 3 —"],
  ["Étape 2 —", "Schritt 2 —"],
  ["Étape 1 —", "Schritt 1 —"],
  ["parallélogramme", "Parallelogramm"],
  ["trapèze", "Trapez"],
  ["rectangle", "Rechteck"],
  ["carré", "Quadrat"],
  ["triangle", "Dreieck"],
  ["cercle", "Kreis"],
  ["périmètre", "Umfang"],
  ["aire", "Fläche"],
  ["volume", "Volumen"],
  ["diagonale", "Diagonale"],
  ["hauteur", "Höhe"],
  ["base", "Grundseite"],
  ["angle", "Winkel"],
  ["angles", "Winkel"],
  ["côtés", "Seiten"],
  ["côté", "Seite"],
  ["géométrie", "Geometrie"],
  ["mathématiques", "Mathematik"],
  ["sciences", "Naturwissenschaften"],
  ["division", "Division"],
  ["multiplication", "Multiplikation"],
  ["addition", "Addition"],
  ["soustraction", "Subtraktion"],
  ["reste", "Rest"],
  ["facteurs", "Teiler"],
  ["multiple", "Vielfaches"],
  ["nombre", "Zahl"],
  ["nombres", "Zahlen"],
  ["enfant", "Kind"],
  ["enfants", "Kinder"],
  ["question", "Frage"],
  ["questions", "Fragen"],
  ["exemple", "Beispiel"],
  ["Exemples", "Beispiele"],
  ["par exemple", "zum Beispiel"],
  ["aujourd'hui", "heute"],
  ["nous allons", "wir werden"],
  ["tu peux", "du kannst"],
  ["tu sais", "du weißt"],
  ["c'est", "das ist"],
  ["ce n'est pas", "das ist nicht"],
  ["et", "und"],
  ["ou", "oder"],
  ["mais", "aber"],
  ["avec", "mit"],
  ["sans", "ohne"],
  ["pour", "für"],
  ["dans", "in"],
  ["sur", "auf"],
  ["de la", "der"],
  ["de le", "des"],
  ["des", "der"],
  ["les", "die"],
  ["une", "eine"],
  ["un", "ein"],
  ["le", "der"],
  ["la", "die"],
].sort((a, b) => b[0].length - a[0].length);

const EN_FULL = {
  "Two identical pots, same amount of water and same light; only temperature different (variable).":
    "Zwei gleiche Töpfe, dieselbe Menge Wasser und dasselbe Licht; nur die Temperatur ist unterschiedlich (Variable).",
  "A wool string is made of natural fibers — also an insulator; electricity does not pass easily.":
    "Ein Wollfaden besteht aus Naturfasern — auch ein Isolator; Strom fließt nicht leicht hindurch.",
  "Today we'll learn long division — a step-by-step way to divide a big number by a smaller one.":
    "Heute lernen wir die schriftliche Division — einen schrittweisen Weg, eine große Zahl durch eine kleinere zu teilen.",
  "When you fill equal boxes (or groups), the answer is the remainder — not the number of boxes!":
    "Wenn du gleiche Kisten (oder Gruppen) füllst, ist die Antwort der Rest — nicht die Anzahl der Kisten!",
  "In a square you can draw a line from one corner to the opposite corner — that is a diagonal.":
    "In einem Quadrat kannst du eine Linie von einer Ecke zur gegenüberliegenden Ecke zeichnen — das ist eine Diagonale.",
  "Today we're going to learn multiplication — here it's both equal groups and the times table.":
    "Heute lernen wir Multiplikation — hier sind es sowohl gleiche Gruppen als auch das Einmaleins.",
  "In practice you'll find triangle areas — make sure the height is perpendicular to the base!":
    "In der Übung findest du Dreiecksflächen — achte darauf, dass die Höhe senkrecht zur Grundseite steht!",
  "There are 18 cookies shared equally among 3 children. How many cookies does each child get?":
    "Es gibt 18 Kekse, die gleichmäßig auf 3 Kinder verteilt werden. Wie viele Kekse bekommt jedes Kind?",
  "Today we'll check when a number divides evenly by 2, 3, 5, 6, 9, or 10 — using quick rules.":
    "Heute prüfen wir, wann eine Zahl ohne Rest durch 2, 3, 5, 6, 9 oder 10 teilbar ist — mit schnellen Regeln.",
  "When you practice, look for questions about eggs, young animals, and similarity to parents.":
    "Wenn du übst, achte auf Fragen zu Eiern, Jungtieren und der Ähnlichkeit mit den Eltern.",
  "Today in geometry we will learn an important rule: the sum of angles in a triangle = 180°.":
    "Heute lernen wir in Geometrie eine wichtige Regel: Die Winkelsumme in einem Dreieck = 180°.",
  "Step 3 — Count hops: after Monday: (1) Tuesday → (2) Wednesday → (3) Thursday → (4) Friday":
    "Schritt 3 — Zähle die Sprünge: nach Montag: (1) Dienstag → (2) Mittwoch → (3) Donnerstag → (4) Freitag",
  "Today in geometry we will learn the perimeter of a triangle — the sum of all three sides.":
    "Heute lernen wir in Geometrie den Umfang eines Dreiecks — die Summe aller drei Seiten.",
  "In practice you'll find trapezoid areas — add bases, multiply by height, and divide by 2!":
    "In der Übung findest du Trapezflächen — addiere die Grundseiten, multipliziere mit der Höhe und teile durch 2!",
  "Important: here we don't practice remainders or long division — only simple fair sharing.":
    "Wichtig: hier üben wir keine Reste und keine schriftliche Division — nur einfaches gerechtes Teilen.",
  "Today we'll learn to estimate a multiplication answer — round the factors, then multiply.":
    "Heute lernen wir, ein Multiplikationsergebnis zu schätzen — runde die Faktoren, dann multipliziere.",
  "When you practice, look for questions about connections between living things in nature.":
    "Wenn du übst, achte auf Fragen zu Verbindungen zwischen Lebewesen in der Natur.",
  "Today in geometry we will learn about a rectangular prism — a three-dimensional solid.":
    "Heute lernen wir in Geometrie etwas über einen Quader — einen dreidimensionalen Körper.",
  "In practice you'll find parallelogram areas — make sure the distance is perpendicular!":
    "In der Übung findest du Parallelogrammflächen — achte darauf, dass der Abstand senkrecht ist!",
  "In practice you'll find dimensions — calculate one layer, then multiply by the height!":
    "In der Übung findest du Abmessungen — berechne eine Schicht, dann multipliziere mit der Höhe!",
  "Now you know how to solve equal-group problems — like the times table, but in a story.":
    "Jetzt weißt du, wie du Aufgaben mit gleichen Gruppen löst — wie das Einmaleins, aber in einer Geschichte.",
  "When you practice, look for questions about observation, comparison, and one variable.":
    "Wenn du übst, achte auf Fragen zu Beobachtung, Vergleich und einer Variable.",
  "When you practice, look for questions about variables, graphs, and presenting results.":
    "Wenn du übst, achte auf Fragen zu Variablen, Diagrammen und dem Präsentieren von Ergebnissen.",
};

function frToDe(fr) {
  const t = String(fr ?? "").trim();
  // Exact FR line only — never short-word salad from French
  for (const [a, b] of FR_DE) {
    if (a.length >= 40 && t === a) return b;
    if (a.length >= 40 && t.includes(a) && t.length < a.length + 10) return t.split(a).join(b);
  }
  if (FR_DE_EXACT[t]) return FR_DE_EXACT[t];
  return null;
}

const FR_DE_EXACT = Object.fromEntries(FR_DE.filter(([a]) => a.length >= 40));

function stillEn(s) {
  return /\b(the|and|with|that|which|because|through|their|they|these|those|would|could|should|from|have|been|does|make|help|need|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|Today|In practice|Look for|Try to|How many|How much)\b/.test(
    s
  );
}

// Index EN line → {rel, i}
const index = new Map();
for (const f of walk(EN_ROOT)) {
  const rel = path.relative(EN_ROOT, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t && !index.has(t)) index.set(t, { rel, i });
  });
}

const hybrid = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-hybrid-student.json"), "utf8"));
const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const scopesDe = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
Object.assign(map, scopesDe, EN_FULL);

let fromFr = 0;
let bad = 0;
const badSamples = [];
for (const { en } of hybrid) {
  if (map[en] && !stillEn(map[en])) continue;
  if (EN_FULL[en]) {
    map[en] = EN_FULL[en];
    continue;
  }
  const loc = index.get(en);
  let de = null;
  if (loc) {
    const frPath = path.join(FR_ROOT, loc.rel);
    if (fs.existsSync(frPath)) {
      const frLine = (fs.readFileSync(frPath, "utf8").split(/\r?\n/)[loc.i] || "").trim();
      if (frLine && frLine !== en) {
        de = frToDe(frLine);
        fromFr++;
      }
    }
  }
  if (!de || stillEn(de)) {
    // keep previous map if any, else leave for next manual
    de = map[en] && !stillEn(map[en]) ? map[en] : de || en;
  }
  map[en] = de;
  if (stillEn(de)) {
    bad++;
    if (badSamples.length < 30) badSamples.push({ en, de });
  }
}

fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-hybrid-bad.json"), JSON.stringify(badSamples, null, 2));
console.log({ hybrid: hybrid.length, fromFr, bad, mapSize: Object.keys(map).length });

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
