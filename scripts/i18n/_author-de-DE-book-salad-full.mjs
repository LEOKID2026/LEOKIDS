/**
 * Author German for all salad EN lines, merge into residue map, rebuild books.
 * node scripts/i18n/_author-de-DE-book-salad-full.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { EXACT as BOOK_EXACT } from "./_de-DE-book-line.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function money(s) {
  return String(s)
    .replace(/\b(\d+(?:[.,]\d+)?)\s*shekels?\b/gi, "$1 Euro")
    .replace(/\b(\d+(?:[.,]\d+)?)\s*dollars?\b/gi, "$1 Euro")
    .replace(/\bshekels?\b/gi, "Euro")
    .replace(/\bdollars?\b/gi, "Euro")
    .replace(/\$(\d)/g, "€$1");
}

function num(s) {
  return String(s).replace(/(\d),(\d{3})\b/g, "$1.$2");
}

/** @type {Array<[RegExp, string|((...args:string[])=>string)]>} */
const RULES = [
  // Headings / chrome already handled elsewhere — keep here for safety
  [/^## Metadata$/, "## Metadaten"],
  [/^## 1\. What are we learning\?$/, "## 1. Was lernen wir?"],
  [/^## 2\. Simple explanation$/, "## 2. Einfache Erklärung"],
  [/^## 3\. Example$/, "## 3. Beispiel"],
  [/^## 3\. Visual \/ concrete example$/, "## 3. Anschauliches / konkretes Beispiel"],
  [/^## 4\. Let's solve together$/, "## 4. Lass uns gemeinsam lösen"],
  [/^## 5\. Try it yourself$/, "## 5. Probiere es selbst"],
  [/^## 6\. Let's check together$/, "## 6. Lass uns gemeinsam prüfen"],
  [/^## 6\. Common mistake — watch out!$/, "## 6. Häufiger Fehler — Achtung!"],
  [/^## 7\. Let's practice!$/, "## 7. Lass uns üben!"],
  [/^\*\*Source references:\*\*$/, "**Quellenverweise:**"],
  [/^\*\*Content scope:\*\*$/, "**Inhaltsumfang:**"],
  [/^- ✅ Documentation and draft markdown only$/, "- ✅ Nur Dokumentation und Entwurfs-Markdown"],
  [/^- `book_placeholder\.md` — infrastructure placeholder; \*\*not\*\* part of the 3-page book\.$/, "- `book_placeholder.md` — Infrastruktur-Platzhalter; **nicht** Teil des 3-Seiten-Buchs."],
  [/^- Internal IDs remain `(.+)` and `subject: (.+)`\.$/, "- Interne IDs bleiben `$1` und `subject: $2`."],

  // Today…
  [/^Today in geometry we will learn about (.+)\.$/i, (_, x) => `Heute lernen wir in Geometrie etwas über ${geoNoun(x)}.`],
  [/^Today in geometry we will learn to (.+)\.$/i, (_, x) => `Heute lernen wir in Geometrie, ${xDe(x)}.`],
  [/^Today in geometry we will learn (.+)\.$/i, (_, x) => `Heute lernen wir in Geometrie ${xDe(x)}.`],
  [/^Today in geometry we will strengthen (.+)\.$/i, (_, x) => `Heute festigen wir in Geometrie ${xDe(x)}.`],
  [/^Today in geometry we will go deeper into (.+)\.$/i, (_, x) => `Heute gehen wir in Geometrie tiefer ein auf ${xDe(x)}.`],
  [/^Today in math we will learn about (.+)\.$/i, (_, x) => `Heute lernen wir in Mathematik etwas über ${xDe(x)}.`],
  [/^Today in math we will learn to (.+)\.$/i, (_, x) => `Heute lernen wir in Mathematik, ${xDe(x)}.`],
  [/^Today in math we will learn (.+)\.$/i, (_, x) => `Heute lernen wir in Mathematik ${xDe(x)}.`],
  [/^Today in math we will (.+)\.$/i, (_, x) => `Heute werden wir in Mathematik ${xDe(x)}.`],
  [/^Today in science we will learn about (.+)\.$/i, (_, x) => `Heute lernen wir in Naturwissenschaften etwas über ${xDe(x)}.`],
  [/^Today in science we will learn (.+)\.$/i, (_, x) => `Heute lernen wir in Naturwissenschaften ${xDe(x)}.`],
  [/^Today we're going to learn to (.+)\.$/i, (_, x) => `Heute lernen wir, ${xDe(x)}.`],
  [/^Today we're going to learn (.+)\.$/i, (_, x) => `Heute lernen wir ${xDe(x)}.`],
  [/^Today we will learn about (.+)\.$/i, (_, x) => `Heute lernen wir etwas über ${xDe(x)}.`],
  [/^Today we will learn to (.+)\.$/i, (_, x) => `Heute lernen wir, ${xDe(x)}.`],
  [/^Today we will learn (.+)\.$/i, (_, x) => `Heute lernen wir ${xDe(x)}.`],
  [/^Today we will (.+)\.$/i, (_, x) => `Heute werden wir ${xDe(x)}.`],
  [/^Today we'll learn about (.+)\.$/i, (_, x) => `Heute lernen wir etwas über ${xDe(x)}.`],
  [/^Today we'll learn (.+)\.$/i, (_, x) => `Heute lernen wir ${xDe(x)}.`],

  // Now you know…
  [/^Now you know how to (.+)\.$/i, (_, x) => `Jetzt weißt du, wie du ${xDe(x)}.`],
  [/^Now you know about (.+)\.$/i, (_, x) => `Jetzt kennst du ${xDe(x)}.`],
  [/^Now you know (.+)\.$/i, (_, x) => `Jetzt weißt du ${xDe(x)}.`],

  // In practice…
  [/^In practice you'll find (.+)\.$/i, (_, x) => `In der Übung findest du ${xDe(x)}.`],
  [/^In practice you will find (.+)\.$/i, (_, x) => `In der Übung findest du ${xDe(x)}.`],

  // Content scope
  [/^\*\*Content scope:\*\*\s*(.+)$/i, (_, x) => `**Inhaltsumfang:** ${scopeDe(x)}`],
  [/^Content scope:\s*(.+)$/i, (_, x) => `Inhaltsumfang: ${scopeDe(x)}`],

  // Geometry Q forms
  [/^A square with side (\d+(?:\.\d+)?)(?:\s*cm)?\s*—\s*what is the perimeter\?$/i, (_, n) => `Ein Quadrat mit Seitenlänge ${n} cm — was ist der Umfang?`],
  [/^A square with side (\d+(?:\.\d+)?)(?:\s*cm)?\s*—\s*what is the area\?$/i, (_, n) => `Ein Quadrat mit Seitenlänge ${n} cm — was ist die Fläche?`],
  [/^A square with side (\d+)\s*—\s*is the diagonal shorter than (\d+), equal to (\d+), or longer than (\d+)\?$/i, (_, a, b, c, d) => `Ein Quadrat mit Seitenlänge ${a} — ist die Diagonale kürzer als ${b}, gleich ${c} oder länger als ${d}?`],
  [/^Square with side (.+)$/i, (_, x) => `Quadrat mit Seitenlänge ${xDe(x)}`],
  [/^A square has a side of length (.+)$/i, (_, x) => `Ein Quadrat hat eine Seitenlänge von ${xDe(x)}`],
  [/^A triangle with sides ([^,]+), ([^,]+), and ([^\s—]+)(?:\s*cm)?\s*—\s*what is the perimeter\?$/i, (_, a, b, c) => `Ein Dreieck mit den Seiten ${a}, ${b} und ${c} — was ist der Umfang?`],
  [/^A triangle with sides ([^,]+), ([^,]+), and ([^\s—]+)\s*—\s*what type of triangle is it\?$/i, (_, a, b, c) => `Ein Dreieck mit den Seiten ${a}, ${b} und ${c} — welche Art von Dreieck ist das?`],
  [/^Triangle: sides (.+?)\s*—\s*what is the perimeter\?$/i, (_, s) => `Dreieck: Seiten ${s} — was ist der Umfang?`],
  [/^Trapezoid: bases (.+?), height (.+?)\s*—\s*what is the area\?$/i, (_, b, h) => `Trapez: Grundseiten ${b}, Höhe ${h} — was ist die Fläche?`],
  [/^Trapezoid: bases (.+?), area (.+?)\s*—\s*what is the height\?$/i, (_, b, a) => `Trapez: Grundseiten ${b}, Fläche ${a} — was ist die Höhe?`],
  [/^A square with (\d+) corners — what is the sum of all its angles\?$/i, (_, n) => `Ein Quadrat mit ${n} Ecken — was ist die Summe aller Innenwinkel?`],
  [/^A rectangle that is not a square — how many lines of symmetry does it have\?$/i, "Ein Rechteck, das kein Quadrat ist — wie viele Symmetrieachsen hat es?"],
  [/^For a rectangular prism — how many pairs of equal faces are there\?$/i, "Bei einem Quader — wie viele Paare gleich großer Flächen gibt es?"],
  [/^In a parallelogram — can you always calculate the diagonal like in a rectangle, using only two adjacent sides\?$/i, "In einem Parallelogramm — kannst du die Diagonale immer wie in einem Rechteck berechnen, nur mit zwei benachbarten Seiten?"],
  [/^Area of a trapezoid = average of the bases × height\.$/i, "Fläche eines Trapezes = Mittelwert der Grundseiten × Höhe."],
  [/^What is the area\?$/i, "Was ist die Fläche?"],
  [/^What is the perimeter\?$/i, "Was ist der Umfang?"],
  [/^What is the volume\?$/i, "Was ist das Volumen?"],
  [/^What is the height\?$/i, "Was ist die Höhe?"],
  [/^What is the diagonal\?$/i, "Was ist die Diagonale?"],

  // Rectangle / square core prose
  [/^A rectangle is like a square — but it usually has a different length and width\.$/i, "Ein Rechteck ist wie ein Quadrat — aber es hat meist eine andere Länge und Breite."],
  [/^A rectangle has 4 sides and 4 right corners — like a square\.$/i, "Ein Rechteck hat 4 Seiten und 4 rechte Ecken — wie ein Quadrat."],
  [/^In a rectangle there is a length \(a longer side\) and a width \(a shorter side\)\.$/i, "In einem Rechteck gibt es eine Länge (eine längere Seite) und eine Breite (eine kürzere Seite)."],
  [/^Opposite sides are equal to each other — long opposite long, short opposite short\.$/i, "Gegenüberliegende Seiten sind gleich lang — lang gegenüber lang, kurz gegenüber kurz."],
  [/^The longer side — length$/i, "Die längere Seite — Länge"],
  [/^The shorter side — width$/i, "Die kürzere Seite — Breite"],
  [/^Different length and width — not a square \(in a square everything is equal\)\.$/i, "Unterschiedliche Länge und Breite — kein Quadrat (in einem Quadrat ist alles gleich)."],
  [/^Imagine a chalkboard in the classroom:$/i, "Stell dir eine Tafel im Klassenzimmer vor:"],
  [/^Is the board a rectangle\?$/i, "Ist die Tafel ein Rechteck?"],
  [/^Yes, the board is a rectangle$/i, "Ja, die Tafel ist ein Rechteck"],
  [/^Check the length and width!$/i, "Prüfe die Länge und die Breite!"],
  [/^A square is a shape we see everywhere — tiles, windows, and games\.$/i, "Ein Quadrat ist eine Form, die wir überall sehen — Fliesen, Fenster und Spiele."],
  [/^A square has 4 corners — at each corner there is a right angle \(like the corner of a box\)\.$/i, "Ein Quadrat hat 4 Ecken — an jeder Ecke gibt es einen rechten Winkel (wie die Ecke eines Kartons)."],
  [/^Are all the sides equal\?$/i, "Sind alle Seiten gleich lang?"],
  [/^Are all the corners right angles\?$/i, "Sind alle Ecken rechte Winkel?"],
  [/^Is the sticker a square\?$/i, "Ist der Aufkleber ein Quadrat?"],
  [/^Yes, the sticker is a square$/i, "Ja, der Aufkleber ist ein Quadrat"],
  [/^Are the corners right angles\? Yes — like a square\.$/i, "Sind die Ecken rechte Winkel? Ja — wie bei einem Quadrat."],
  [/^Are all the sides equal to each other\? Yes — they are all the same length\.$/i, "Sind alle Seiten gleich lang? Ja — sie sind alle gleich lang."],
  [/^Sticker: 4 sides, all right corners, and all sides equal to each other\.$/i, "Aufkleber: 4 Seiten, alle rechten Ecken, und alle Seiten gleich lang."],
  [/^The shape moved to a new place — but it did not flip over\.$/i, "Die Form wurde an einen neuen Ort verschoben — aber sie wurde nicht gespiegelt."],
  [/^Did the shape move to a new place, or does it look like a mirror image\?$/i, "Wurde die Form an einen neuen Ort verschoben, oder sieht sie wie ein Spiegelbild aus?"],
  [/^The number stays the same!$/i, "Die Zahl bleibt gleich!"],
  [/^Always check the place!$/i, "Prüfe immer die Stelle!"],

  // Solids
  [/^cube, rectangular prism, cylinder, pyramid, cone, and sphere\.$/i, "Würfel, Quader, Zylinder, Pyramide, Kegel und Kugel."],
  [/^A three-dimensional solid is a shape that is not flat on the page — you can hold it in your hand\.$/i, "Ein dreidimensionaler Körper ist eine Form, die nicht flach auf der Seite liegt — du kannst sie in der Hand halten."],
  [/^A polygon base and triangular faces \(like a tent\)\.$/i, "Eine vieleckige Grundfläche und dreieckige Seitenflächen (wie ein Zelt)."],
  [/^A round base and one point at the top \(like a party hat\)\.$/i, "Eine runde Grundfläche und eine Spitze oben (wie ein Partyhut)."],
  [/^Imagine a shoe box — rectangular faces, not all the same\.$/i, "Stell dir einen Schuhkarton vor — rechteckige Flächen, nicht alle gleich."],
  [/^A solid has 6 equal square faces\. What is it called\?$/i, "Ein Körper hat 6 gleiche Quadratflächen. Wie heißt er?"],
  [/^Two round bases and a curved side \(like a soda can\)\.$/i, "Zwei runde Grundflächen und eine gebogene Seitenfläche (wie eine Getränkedose)."],
  [/^A solid with two round bases and a curved side — like a soda can\.$/i, "Ein Körper mit zwei runden Grundflächen und einer gebogenen Seitenfläche — wie eine Getränkedose."],
  [/^The bases are round — not square or rectangular\.$/i, "Die Grundflächen sind rund — nicht quadratisch oder rechteckig."],

  // Decimal / place value
  [/^×10 → the decimal point moves one place to the right\.$/i, "×10 → das Komma wandert eine Stelle nach rechts."],
  [/^÷10 → the decimal point moves one place to the left\.$/i, "÷10 → das Komma wandert eine Stelle nach links."],
  [/^If it's 0, 1, 2, 3, or 4 — round down \(stay the same\)$/i, "Wenn es 0, 1, 2, 3 oder 4 ist — abrunden (bleibt gleich)"],
  [/^In the number (.+?) — how many thousands are there\?$/i, (_, n) => `In der Zahl ${num(n)} — wie viele Tausender gibt es?`],

  // Money names
  [/^(.+?) paid (\d+) shekels for a (.+) that cost (\d+) shekels\.$/i, (_, who, paid, item, cost) => `${who} hat ${paid} Euro für ${articleDe(item)} bezahlt, ${articleDe(item)} ${cost} Euro gekostet hat.`],
  [/^(.+?) has one coin of (\d+) shekels and (\d+) coins of (\d+) shekels\.$/i, (_, who, a, n, b) => `${who} hat eine Münze zu ${a} Euro und ${n} Münzen zu ${b} Euro.`],

  // Generic questions
  [/^(.+?) — what is the perimeter\?$/i, (_, x) => `${clauseDe(x)} — was ist der Umfang?`],
  [/^(.+?) — what is the area\?$/i, (_, x) => `${clauseDe(x)} — was ist die Fläche?`],
  [/^(.+?) — what is the volume\?$/i, (_, x) => `${clauseDe(x)} — was ist das Volumen?`],
  [/^(.+?) — what is the height\?$/i, (_, x) => `${clauseDe(x)} — was ist die Höhe?`],
  [/^(.+?) — how many (.+)\?$/i, (_, x, y) => `${clauseDe(x)} — wie viele ${xDe(y)}?`],

  // Imagine / Check / Try
  [/^Imagine (.+):$/i, (_, x) => `Stell dir ${xDe(x)} vor:`],
  [/^Imagine (.+)\.$/i, (_, x) => `Stell dir ${xDe(x)} vor.`],
  [/^Try to solve it on your own\.$/i, "Versuch, es allein zu lösen."],
  [/^Try to solve it yourself\.$/i, "Versuch, es selbst zu lösen."],
  [/^On the next page we'll check the steps and the answer together\.$/i, "Auf der nächsten Seite prüfen wir gemeinsam die Schritte und die Antwort."],
  [/^On the next page we will check the steps and the answer together\.$/i, "Auf der nächsten Seite prüfen wir gemeinsam die Schritte und die Antwort."],

  // Science light
  [/^At night — who or what gives us light in the sky\?$/i, "In der Nacht — wer oder was gibt uns Licht am Himmel?"],
  [/^In the neighborhood there is a big tree where birds build a nest\.$/i, "In der Nachbarschaft steht ein großer Baum, in dem Vögel ein Nest bauen."],
  [/^An even number — you can arrange in pairs, and everyone has a partner\.$/i, "Eine gerade Zahl — du kannst sie in Paare ordnen, und jeder hat einen Partner."],
  [/^A door — 4 right angles, but different width and height\.$/i, "Eine Tür — 4 rechte Winkel, aber unterschiedliche Breite und Höhe."],
  [/^Now you know how to check divisibility by 2, 5, and 10\.$/i, "Jetzt weißt du, wie du die Teilbarkeit durch 2, 5 und 10 prüfst."],
];

function geoNoun(x) {
  const t = String(x).trim().toLowerCase();
  const map = {
    "the rectangle": "das Rechteck",
    rectangle: "das Rechteck",
    "the square": "das Quadrat",
    square: "das Quadrat",
    "the triangle": "das Dreieck",
    triangle: "das Dreieck",
    "the circle": "den Kreis",
    circle: "den Kreis",
    "rectangular prisms": "Quader",
    "a rectangular prism": "einen Quader",
    solids: "Körper",
    "three-dimensional solids": "dreidimensionale Körper",
    transformations: "Abbildungen",
    rotation: "Drehung",
    "parallel and perpendicular lines": "parallele und senkrechte Geraden",
    quadrilaterals: "Vierecke",
    triangles: "Dreiecke",
    angles: "Winkel",
    area: "Fläche",
    perimeter: "Umfang",
    volume: "Volumen",
    symmetry: "Symmetrie",
  };
  return map[t] || xDe(x);
}

function articleDe(item) {
  const t = String(item).trim().toLowerCase();
  const map = {
    game: "ein Spiel",
    book: "ein Buch",
    toy: "ein Spielzeug",
    "a game": "ein Spiel",
    "a book": "ein Buch",
  };
  return map[t] || `ein ${xDe(item)}`;
}

function scopeDe(x) {
  return xDe(x)
    .replace(/^Identifying /i, "Erkennen von ")
    .replace(/\bno measurements\b/gi, "keine Messungen")
    .replace(/\bdifferent length and width\b/gi, "unterschiedliche Länge und Breite")
    .replace(/\bopposite side pairs\b/gi, "Paare gegenüberliegender Seiten");
}

function clauseDe(x) {
  return xDe(x).replace(/^./, (c) => c.toUpperCase());
}

function xDe(s) {
  let out = money(num(String(s)));
  const pairs = [
    ["rectangular prism", "Quader"],
    ["right angles", "rechte Winkel"],
    ["right corners", "rechte Ecken"],
    ["right angle", "rechter Winkel"],
    ["number line", "Zahlenstrahl"],
    ["word problems", "Textaufgaben"],
    ["word problem", "Textaufgabe"],
    ["place value", "Stellenwert"],
    ["even number", "gerade Zahl"],
    ["odd number", "ungerade Zahl"],
    ["lines of symmetry", "Symmetrieachsen"],
    ["decimal point", "Komma"],
    ["opposite sides", "gegenüberliegende Seiten"],
    ["equal to each other", "gleich lang"],
    ["three-dimensional", "dreidimensional"],
    ["addition problems", "Additionsaufgaben"],
    ["the rectangle", "das Rechteck"],
    ["the square", "das Quadrat"],
    ["the triangle", "das Dreieck"],
    ["the circle", "den Kreis"],
    ["a rectangle", "ein Rechteck"],
    ["a square", "ein Quadrat"],
    ["a triangle", "ein Dreieck"],
    ["a circle", "ein Kreis"],
    ["a cube", "ein Würfel"],
    ["the area", "die Fläche"],
    ["the perimeter", "den Umfang"],
    ["the volume", "das Volumen"],
    ["the diagonal", "die Diagonale"],
    ["the height", "die Höhe"],
    ["the answer", "die Antwort"],
    ["check divisibility", "die Teilbarkeit prüfen"],
    ["add two numbers", "zwei Zahlen addieren"],
    ["identify rectangles", "Rechtecke erkennen"],
    ["identifying rectangles", "Rechtecke erkennen"],
    ["identifying a rectangle", "ein Rechteck erkennen"],
    ["sheet of paper", "Blatt Papier"],
    ["TV screen", "Fernsehbildschirm"],
    ["shoe box", "Schuhkarton"],
    ["soda can", "Getränkedose"],
    ["party hat", "Partyhut"],
    ["chalkboard", "Tafel"],
    ["classroom", "Klassenzimmer"],
    ["mirror image", "Spiegelbild"],
    ["longer side", "längere Seite"],
    ["shorter side", "kürzere Seite"],
    ["curved side", "gebogene Seitenfläche"],
    ["round bases", "runde Grundflächen"],
    ["round base", "runde Grundfläche"],
    ["triangular faces", "dreieckige Seitenflächen"],
    ["polygon base", "vieleckige Grundfläche"],
    ["equal faces", "gleiche Flächen"],
    ["square faces", "Quadratflächen"],
    ["adjacent sides", "benachbarte Seiten"],
    ["average of the bases", "Mittelwert der Grundseiten"],
    ["pairs of equal faces", "Paare gleich großer Flächen"],
    ["type of triangle", "Art von Dreieck"],
    ["sum of all its angles", "Summe aller Innenwinkel"],
    ["in the teens", "im Zehnerplus-Bereich"],
    ["the teens", "der Zehnerplus-Bereich"],
    ["perimeter", "Umfang"],
    ["area", "Fläche"],
    ["volume", "Volumen"],
    ["diagonal", "Diagonale"],
    ["height", "Höhe"],
    ["length", "Länge"],
    ["width", "Breite"],
    ["symmetry", "Symmetrie"],
    ["parallelogram", "Parallelogramm"],
    ["trapezoid", "Trapez"],
    ["quadrilateral", "Viereck"],
    ["quadrilaterals", "Vierecke"],
    ["triangle", "Dreieck"],
    ["triangles", "Dreiecke"],
    ["rectangle", "Rechteck"],
    ["square", "Quadrat"],
    ["circle", "Kreis"],
    ["cube", "Würfel"],
    ["cylinder", "Zylinder"],
    ["pyramid", "Pyramide"],
    ["cone", "Kegel"],
    ["sphere", "Kugel"],
    ["solid", "Körper"],
    ["solids", "Körper"],
    ["angle", "Winkel"],
    ["angles", "Winkel"],
    ["faces", "Flächen"],
    ["face", "Fläche"],
    ["bases", "Grundflächen"],
    ["base", "Grundfläche"],
    ["sides", "Seiten"],
    ["side", "Seite"],
    ["corners", "Ecken"],
    ["corner", "Ecke"],
    ["shape", "Form"],
    ["shapes", "Formen"],
    ["measurements", "Messungen"],
    ["measurement", "Messung"],
    ["examples", "Beispiele"],
    ["example", "Beispiel"],
    ["difference", "Unterschied"],
    ["because", "weil"],
    ["without", "ohne"],
    ["through", "durch"],
    ["different", "unterschiedlich"],
    ["everything", "alles"],
    ["everywhere", "überall"],
    ["usually", "meist"],
    ["longer", "länger"],
    ["shorter", "kürzer"],
    ["equal", "gleich"],
    ["same", "gleich"],
    ["round", "rund"],
    ["flat", "flach"],
    ["curved", "gebogen"],
    ["rectangular", "rechteckig"],
    ["calculate", "berechnen"],
    ["using only", "nur mit"],
    ["always", "immer"],
    ["not", "nicht"],
    ["and", "und"],
    ["with", "mit"],
    ["from", "von"],
    ["into", "in"],
    ["about", "über"],
    ["for", "für"],
    ["or", "oder"],
    ["but", "aber"],
    ["the", ""],
    ["a ", ""],
    ["an ", ""],
    ["of ", ""],
    ["to ", ""],
    ["in ", "in "],
    ["on ", "auf "],
    ["at ", "bei "],
    ["is ", "ist "],
    ["are ", "sind "],
    ["has ", "hat "],
    ["have ", "haben "],
    ["like ", "wie "],
    ["you ", "du "],
    ["we ", "wir "],
    ["it ", "es "],
    ["they ", "sie "],
    ["this ", "dies "],
    ["that ", "das "],
    ["what ", "was "],
    ["how ", "wie "],
    ["when ", "wann "],
    ["where ", "wo "],
    ["why ", "warum "],
    ["can ", "kann "],
    ["will ", "wird "],
  ];
  for (const [en, de] of pairs) {
    out = out.replace(new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), de);
  }
  out = out.replace(/\s{2,}/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
  return out;
}

function stillEn(s) {
  const m = String(s).match(
    /\b(the|and|with|that|which|without|because|through|their|they|these|those|would|could|should|have|been|does|make|makes|help|need|what|when|where|how|why|for|over|under|after|before|during|only|also|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|all|sides|corners|shape|length|width|equal|Imagine|Check|Yes|Did|Does|called|hold|move|moved|flip|mirror|everywhere|tiles|windows|games|board|sticker|classroom|Identifying|different|opposite|usually|longer|shorter|everything|Infrastructure|placeholder|Documentation|three-dimensional|flat|page|hand|polygon|triangular|faces|round|base|point|top|party|hat|shoe|box|rectangular|same|curved|soda|can|bases|shekel)\b/gi
  );
  return (m || []).length >= 2;
}

function author(en) {
  const t = String(en).trim();
  if (!t) return en;
  if (BOOK_EXACT[t]) return BOOK_EXACT[t];
  for (const [re, rep] of RULES) {
    const m = t.match(re);
    if (!m) continue;
    return typeof rep === "function" ? rep(...m) : t.replace(re, rep);
  }
  // Fallback: phrase-ish clause transform (last resort)
  let out = xDe(t);
  if (/^[a-zäöü]/.test(out)) out = out[0].toUpperCase() + out.slice(1);
  return out;
}

const salad = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-salad.json"), "utf8"));
const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const bad = [];
let n = 0;
for (const { en } of salad) {
  const de = author(en);
  map[en] = de;
  n++;
  if (stillEn(de)) bad.push({ en, de });
}
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-book-salad-authored.json"), JSON.stringify(
  Object.fromEntries(salad.map(({ en }) => [en, map[en]])),
  null,
  2
));
fs.writeFileSync(path.join(__dirname, "_de-DE-book-salad-bad.json"), JSON.stringify(bad, null, 2));
console.log({ authored: n, bad: bad.length, mapSize: Object.keys(map).length });

const r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
if (r.status !== 0) process.exit(r.status || 1);
const c = spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-salad.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(c.status || 0);
