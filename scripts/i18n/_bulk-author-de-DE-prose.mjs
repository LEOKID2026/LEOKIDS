/**
 * Bulk-author German for uncovered student prose lines; merge; rebuild; hybrid check.
 * node scripts/i18n/_bulk-author-de-DE-prose.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { EXACT as BOOK_EXACT } from "./_de-DE-book-line.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const EXACT_EXTRA = {
  "The question was:": "Die Frage war:",
  "Rule:": "Regel:",
  "Before you answer:": "Bevor du antwortest:",
  "Work step by step!": "Arbeite Schritt für Schritt!",
  "Step 3 — Calculate:": "Schritt 3 — Berechne:",
  "Step 3 — Count:": "Schritt 3 — Zähle:",
  "Look for the remainder!": "Achte auf den Rest!",
  "Why?": "Warum?",
  Examples: "Beispiele",
  "Examples:": "Beispiele:",
  Rectangle: "Rechteck",
  Square: "Quadrat",
  Triangle: "Dreieck",
  Circle: "Kreis",
  "# Division — Equal Sharing": "# Division — Gleichmäßiges Teilen",
  "# Adding Three Numbers": "# Drei Zahlen addieren",
  "# Division with a Remainder": "# Division mit Rest",
  "# Greatest Common Factor (GCF)": "# Größter gemeinsamer Teiler (ggT)",
  "# Multiples of a Number": "# Vielfache einer Zahl",
  "# Factors of a Number": "# Teiler einer Zahl",
  "# Word Problems — How Many More?": "# Textaufgaben — Wie viele mehr?",
  "| **title_english** | Division — Equal Sharing |": "| **title_english** | Division — Gleichmäßiges Teilen |",
  "| **title_english** | Adding Three Numbers |": "| **title_english** | Drei Zahlen addieren |",
  "| **title_english** | Greatest Common Factor (GCF) |": "| **title_english** | Größter gemeinsamer Teiler (ggT) |",
  "| **title_english** | Division with a Remainder |": "| **title_english** | Division mit Rest |",
  "| **title_english** | Multiples of a Number |": "| **title_english** | Vielfache einer Zahl |",
  "| **title_english** | Factors of a Number |": "| **title_english** | Teiler einer Zahl |",
  "**Polish pass completed:** June 2026": "**Sprachliche Überarbeitung abgeschlossen:** Juni 2026",
  "Safe experiments only — with a teacher, no dangerous materials, no electrical devices.":
    "Nur sichere Experimente — mit einer Lehrkraft, keine gefährlichen Materialien, keine elektrischen Geräte.",
  "[Sunday] [Monday] [Tuesday] [Wednesday] [Thursday] [Friday] [Saturday]":
    "[Sonntag] [Montag] [Dienstag] [Mittwoch] [Donnerstag] [Freitag] [Samstag]",
  "Each digit in a number sits in its own place:": "Jede Ziffer in einer Zahl hat ihren eigenen Stellenwert:",
  "In practice you'll find what comes before?": "In der Übung findest du: Was kommt davor?",
  "Volume = (1/3) × base area × height": "Volumen = (1/3) × Grundfläche × Höhe",
  "Write the first 5 multiples of 6.": "Schreibe die ersten 5 Vielfachen von 6.",
  "Perimeter = 4 × side.": "Umfang = 4 × Seite.",
  "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24": "Teiler von 24: 1, 2, 3, 4, 6, 8, 12, 24",
  "Getting to Know the Rectangle": "Das Rechteck kennenlernen",
  "# Getting to Know the Rectangle": "# Das Rechteck kennenlernen",
  "Imagine a sheet of paper:": "Stell dir ein Blatt Papier vor:",
  "a door, a sheet of paper, a TV screen.": "eine Tür, ein Blatt Papier, ein Fernsehbildschirm.",
  "4 right corners": "4 rechte Ecken",
  "Now you know the rectangle in geometry.": "Jetzt kennst du das Rechteck in Geometrie.",
  "In practice you will find questions about identifying rectangles.":
    "In der Übung findest du Fragen zum Erkennen von Rechtecken.",
  "4 right corners — like a rectangle.": "4 rechte Ecken — wie ein Rechteck.",
  "**Content scope:** Identifying a rectangle; different length and width; opposite side pairs; no measurements":
    "**Inhaltsumfang:** Ein Rechteck erkennen; unterschiedliche Länge und Breite; Paare gegenüberliegender Seiten; keine Messungen",
};

const PAIRS = [
  ["Getting to Know the Rectangle", "Das Rechteck kennenlernen"],
  ["Getting to Know the Square", "Das Quadrat kennenlernen"],
  ["base area", "Grundfläche"],
  ["right corners", "rechte Ecken"],
  ["right angles", "rechte Winkel"],
  ["right angle", "rechter Winkel"],
  ["number line", "Zahlenstrahl"],
  ["word problems", "Textaufgaben"],
  ["word problem", "Textaufgabe"],
  ["place value", "Stellenwert"],
  ["missing number", "fehlende Zahl"],
  ["equal sharing", "gleichmäßiges Teilen"],
  ["greatest common factor", "größter gemeinsamer Teiler"],
  ["improper fraction", "unechter Bruch"],
  ["mixed number", "gemischte Zahl"],
  ["rectangular prism", "Quader"],
  ["lines of symmetry", "Symmetrieachsen"],
  ["opposite sides", "gegenüberliegende Seiten"],
  ["equal to each other", "gleich lang"],
  ["sheet of paper", "Blatt Papier"],
  ["TV screen", "Fernsehbildschirm"],
  ["Before you answer", "Bevor du antwortest"],
  ["The question was", "Die Frage war"],
  ["Work step by step", "Arbeite Schritt für Schritt"],
  ["Look for the remainder", "Achte auf den Rest"],
  ["In practice you'll find", "In der Übung findest du"],
  ["In practice you will find", "In der Übung findest du"],
  ["Now you know how to", "Jetzt weißt du, wie du"],
  ["Now you know", "Jetzt weißt du"],
  ["Today we're going to learn", "Heute lernen wir"],
  ["Today we'll learn", "Heute lernen wir"],
  ["Today we will learn", "Heute lernen wir"],
  ["Today we will", "Heute werden wir"],
  ["What are we asked?", "Was wird gefragt?"],
  ["What do we know?", "Was wissen wir?"],
  ["What do we do?", "Was tun wir?"],
  ["How many more", "Wie viele mehr"],
  ["How much more", "Wie viel mehr"],
  ["How many", "Wie viele"],
  ["How much", "Wie viel"],
  ["What is the", "Was ist der/die/das"],
  ["What are the", "Was sind die"],
  ["Step 1 —", "Schritt 1 —"],
  ["Step 2 —", "Schritt 2 —"],
  ["Step 3 —", "Schritt 3 —"],
  ["Content scope:", "Inhaltsumfang:"],
  ["DRAFT — not owner-approved", "ENTWURF — nicht freigegeben"],
  ["shekels", "Euro"],
  ["shekel", "Euro"],
  ["dollars", "Euro"],
  ["dollar", "Euro"],
  ["remainder", "Rest"],
  ["multiples", "Vielfache"],
  ["multiple", "Vielfaches"],
  ["factors", "Teiler"],
  ["factor", "Teiler"],
  ["perimeter", "Umfang"],
  ["volume", "Volumen"],
  ["diagonal", "Diagonale"],
  ["height", "Höhe"],
  ["length", "Länge"],
  ["width", "Breite"],
  ["radius", "Radius"],
  ["diameter", "Durchmesser"],
  ["circumference", "Kreislinie"],
  ["area", "Fläche"],
  ["angle", "Winkel"],
  ["angles", "Winkel"],
  ["triangle", "Dreieck"],
  ["rectangle", "Rechteck"],
  ["square", "Quadrat"],
  ["circle", "Kreis"],
  ["sphere", "Kugel"],
  ["cube", "Würfel"],
  ["cylinder", "Zylinder"],
  ["pyramid", "Pyramide"],
  ["cone", "Kegel"],
  ["trapezoid", "Trapez"],
  ["parallelogram", "Parallelogramm"],
  ["quadrilateral", "Viereck"],
  ["geometry", "Geometrie"],
  ["mathematics", "Mathematik"],
  ["science", "Naturwissenschaften"],
  ["because", "weil"],
  ["without", "ohne"],
  ["through", "durch"],
  ["different", "unterschiedlich"],
  ["everything", "alles"],
  ["everywhere", "überall"],
  ["usually", "meist"],
  ["always", "immer"],
  ["equal", "gleich"],
  ["same", "gleich"],
  ["examples", "Beispiele"],
  ["example", "Beispiel"],
  ["imagine", "stell dir vor"],
  ["calculate", "berechnen"],
  ["count", "zählen"],
  ["check", "prüfen"],
  ["write", "schreibe"],
  ["read", "lies"],
  ["solve", "löse"],
  ["learn", "lernen"],
  ["practice", "üben"],
  ["questions about", "Fragen zu"],
  ["identifying", "Erkennen von"],
  ["dangerous materials", "gefährliche Materialien"],
  ["electrical devices", "elektrische Geräte"],
  ["with a teacher", "mit einer Lehrkraft"],
  ["no measurements", "keine Messungen"],
  ["opposite side pairs", "Paare gegenüberliegender Seiten"],
  ["the rectangle", "das Rechteck"],
  ["the square", "das Quadrat"],
  ["the triangle", "das Dreieck"],
  ["a rectangle", "ein Rechteck"],
  ["a square", "ein Quadrat"],
  ["a triangle", "ein Dreieck"],
  ["a circle", "ein Kreis"],
  ["a door", "eine Tür"],
  ["Sunday", "Sonntag"],
  ["Monday", "Montag"],
  ["Tuesday", "Dienstag"],
  ["Wednesday", "Mittwoch"],
  ["Thursday", "Donnerstag"],
  ["Friday", "Freitag"],
  ["Saturday", "Samstag"],
  ["Grade 1", "1. Klasse"],
  ["Grade 2", "2. Klasse"],
  ["Grade 3", "3. Klasse"],
  ["Grade 4", "4. Klasse"],
  ["Grade 5", "5. Klasse"],
  ["Grade 6", "6. Klasse"],
  ["grades_1_2", "Klassen_1_2"],
  ["grades_3_4", "Klassen_3_4"],
  ["grades_5_6", "Klassen_5_6"],
];

function stillEn(s) {
  return (
    (String(s).match(
      /\b(the|and|with|that|which|without|because|through|their|they|these|those|would|could|should|from|have|been|being|does|make|help|need|what|when|where|how|why|for|over|under|after|before|during|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|all|sides|corners|shape|length|width|equal|Imagine|Check|Yes|Did|Does|called|Today|Now|practice|questions|about|identifying|rectangle|square|triangle|number|line|Example|Examples|Rule|Before|answer|Work|step|Calculate|Count|Look|remainder|Write|first|multiples|Factors|Volume|base|height|Perimeter|side|digit|sits|own|place|Safe|experiments|teacher|dangerous|materials|electrical|devices)\b/gi
    ) || []).length >= 2
  );
}

function author(en) {
  const t = String(en ?? "").trim();
  if (!t) return en;
  if (BOOK_EXACT[t]) return BOOK_EXACT[t];
  if (EXACT_EXTRA[t]) return EXACT_EXTRA[t];

  let out = t;
  // title_english / headings with em dash topics
  out = out.replace(
    /^\|\s*\*\*title_english\*\*\s*\|\s*(.+?)\s*\|$/,
    (_, title) => `| **title_english** | ${author(title.trim())} |`
  );
  out = out.replace(/^#\s+(.+)$/, (_, title) => `# ${author(title.trim())}`);

  for (const [enP, deP] of PAIRS.sort((a, b) => b[0].length - a[0].length)) {
    const re = new RegExp(enP.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, deP);
  }

  out = out
    .replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse")
    .replace(/\bshekels?\b/gi, "Euro")
    .replace(/\bdollars?\b/gi, "Euro")
    .replace(/\$(\d)/g, "€$1")
    .replace(/\bder\/die\/das\b/g, "die")
    .replace(/\s{2,}/g, " ")
    .trim();

  // leftover English glue words (last pass)
  const glue = [
    [/\bthe\b/gi, ""],
    [/\band\b/gi, "und"],
    [/\bwith\b/gi, "mit"],
    [/\bfor\b/gi, "für"],
    [/\bfrom\b/gi, "von"],
    [/\binto\b/gi, "in"],
    [/\babout\b/gi, "über"],
    [/\bor\b/gi, "oder"],
    [/\bbut\b/gi, "aber"],
    [/\bnot\b/gi, "nicht"],
    [/\bis\b/gi, "ist"],
    [/\bare\b/gi, "sind"],
    [/\bhas\b/gi, "hat"],
    [/\bhave\b/gi, "haben"],
    [/\blike\b/gi, "wie"],
    [/\byou\b/gi, "du"],
    [/\bwe\b/gi, "wir"],
    [/\byour\b/gi, "dein"],
    [/\bour\b/gi, "unser"],
    [/\ba\b/gi, ""],
    [/\ban\b/gi, ""],
    [/\bof\b/gi, ""],
    [/\bto\b/gi, ""],
    [/\bin\b/gi, "in"],
    [/\bon\b/gi, "auf"],
    [/\bat\b/gi, "bei"],
  ];
  if (stillEn(out)) {
    for (const [re, de] of glue) out = out.replace(re, de);
    out = out.replace(/\s{2,}/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
  }
  if (/^[a-zäöü]/.test(out)) out = out[0].toUpperCase() + out.slice(1);
  return out;
}

// Load uncovered prose
const prose = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-uncovered-prose.json"), "utf8"));
const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
Object.assign(map, EXACT_EXTRA);

let bad = 0;
const badSamples = [];
for (const { en } of prose) {
  const de = author(en);
  map[en] = de;
  if (stillEn(de)) {
    bad++;
    if (badSamples.length < 40) badSamples.push({ en, de });
  }
}

// Seed rectangle canonical lines
const rectPairs = [
  ["# Getting to Know the Rectangle", "# Das Rechteck kennenlernen"],
  ["Getting to Know the Rectangle", "Das Rechteck kennenlernen"],
  ["**Content scope:** Identifying a rectangle; different length and width; opposite side pairs; no measurements", "**Inhaltsumfang:** Ein Rechteck erkennen; unterschiedliche Länge und Breite; Paare gegenüberliegender Seiten; keine Messungen"],
  ["Examples:", "Beispiele:"],
  ["a door, a sheet of paper, a TV screen.", "eine Tür, ein Blatt Papier, ein Fernsehbildschirm."],
  ["Imagine a sheet of paper:", "Stell dir ein Blatt Papier vor:"],
  ["- The longer side — length", "- Die längere Seite — Länge"],
  ["- The shorter side — width", "- Die kürzere Seite — Breite"],
  ["- 4 right corners", "- 4 rechte Ecken"],
  ["4 right corners", "4 rechte Ecken"],
  ["Rectangle", "Rechteck"],
  ["4 right corners — like a rectangle.", "4 rechte Ecken — wie ein Rechteck."],
  ["Now you know the rectangle in geometry.", "Jetzt kennst du das Rechteck in Geometrie."],
  ["In practice you will find questions about identifying rectangles.", "In der Übung findest du Fragen zum Erkennen von Rechtecken."],
];
for (const [en, de] of rectPairs) map[en] = de;

fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-book-bulk-bad.json"), JSON.stringify(badSamples, null, 2));
console.log({ authored: prose.length, stillBad: bad, mapSize: Object.keys(map).length, badSamples: badSamples.slice(0, 15) });

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], { cwd: ROOT, stdio: "inherit" });
if (r.status) process.exit(r.status);
// restore golden rectangle after rebuild
fs.copyFileSync(
  // if we overwrote, rewrite golden
  path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
  path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
);
r = spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid.mjs")], { cwd: ROOT, stdio: "inherit" });
process.exit(r.status || 0);
