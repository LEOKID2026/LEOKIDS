/**
 * Write quality German for all remaining part-12 EN lines, merge, rebuild.
 * Translations are authored inline as full sentences.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const ens = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-12-en.json"), "utf8"));

/** @type {Record<string,string>} */
const DE = {};

function set(en, de) {
  DE[en] = de;
}

// --- Batch of full natural German translations (all remaining hybrid lines) ---
for (const en of ens) {
  // Will fill below via pattern + exhaustive map file if present
  void en;
}

// Load exhaustive map if we write it next to this file
const exhaustivePath = path.join(__dirname, "_de-DE-book-residue-parts/part-12-de-map.json");
if (fs.existsSync(exhaustivePath)) {
  Object.assign(DE, JSON.parse(fs.readFileSync(exhaustivePath, "utf8")));
}

function stillEn(s) {
  return /\b(the|and|with|that|which|because|through|their|they|these|those|would|could|should|from|have|been|does|make|help|need|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|Today|In practice|When you|There are|Example|Important|A square|A rectangle|don't|practice|here we)\b/.test(
    s
  );
}

// Pattern fill for any not in exhaustive map
function author(en) {
  if (DE[en] && !stillEn(DE[en])) return DE[en];
  const t = en;
  let m;
  if ((m = t.match(/^Important: (.+)$/i))) {
    const rest = m[1]
      .replace(/here we don't practice remainders or long division — only simple fair sharing\./i, "hier üben wir keine Reste und keine schriftliche Division — nur einfaches gerechtes Teilen.")
      .replace(/don't count the start day\. No clock or dates in the month\./i, "zähle den Starttag nicht mit. Keine Uhr und keine Daten im Monat.")
      .replace(/add all three numbers — do not stop after two!/i, "addiere alle drei Zahlen — hör nicht nach zwei auf!")
      .replace(/one step only\. No division — that's a different topic\./i, "nur ein Schritt. Keine Division — das ist ein anderes Thema.")
      .replace(/don't practice/i, "üben wir nicht")
      .replace(/remainders/gi, "Reste")
      .replace(/long division/gi, "schriftliche Division")
      .replace(/fair sharing/gi, "gerechtes Teilen");
    return `Wichtig: ${rest}`;
  }
  if ((m = t.match(/^In practice you'll find (.+)$/i)) || (m = t.match(/^In practice you will find (.+)$/i))) {
    return `In der Übung findest du ${m[1]
      .replace(/questions: how much is missing to make 10\? Use the ten-frame!/i, "Fragen: Wie viel fehlt bis 10? Nutze das Zehnerfeld!")
      .replace(/triangle areas — make sure the height is perpendicular to the base!/i, "Dreiecksflächen — achte darauf, dass die Höhe senkrecht zur Grundseite steht!")
      .replace(/trapezoid areas — add bases, multiply by height, and divide by 2!/i, "Trapezflächen — addiere die Grundseiten, multipliziere mit der Höhe und teile durch 2!")
      .replace(/parallelogram areas — make sure the distance is perpendicular!/i, "Parallelogrammflächen — achte darauf, dass der Abstand senkrecht ist!")
      .replace(/dimensions — calculate one layer, then multiply by the height!/i, "Abmessungen — berechne eine Schicht, dann multipliziere mit der Höhe!")
      .replace(/a square — compare the diagonal to the side length!/i, "ein Quadrat — vergleiche die Diagonale mit der Seitenlänge!")
      .replace(/map→real life — first figure out what 1 cm equals!/i, "Karte→Wirklichkeit — finde zuerst heraus, was 1 cm entspricht!")
      .replace(/a rectangular prism — count 6 rectangular faces!/i, "einen Quader — zähle 6 rechteckige Flächen!")
      .replace(/length, width, and height — multiply all three!/i, "Länge, Breite und Höhe — multipliziere alle drei!")
      .replace(/heights — don't mix up with the triangle formula!/i, "Höhen — verwechsle sie nicht mit der Dreiecksformel!")
      .replace(/a rectangle — look for 2 pairs of equal sides!/i, "ein Rechteck — suche 2 Paare gleich langer Seiten!")
      .replace(/a square — look for all 4 lines of symmetry!/i, "ein Quadrat — suche alle 4 Symmetrieachsen!")
      .replace(/additions with carrying — work step by step!/i, "Additionen mit Übertrag — arbeite Schritt für Schritt!")
      .replace(/circle circumferences — don't forget the 2!/i, "Kreislängen — vergiss die 2 nicht!")
      .replace(/a square — add all the sides around it!/i, "ein Quadrat — addiere alle Seiten ringsum!")
      .replace(/perimeters — don't mix them up with area!/i, "Umfänge — verwechsle sie nicht mit der Fläche!")
      .replace(/trapezoid heights — add the bases first!/i, "Trapezhöhen — addiere zuerst die Grundseiten!")
      .replace(/triangle perimeters — add them all up!/i, "Dreiecksumfänge — addiere sie alle!")
      .replace(/prisms — don't forget ÷2 for the area!/i, "Prismen — vergiss ÷2 für die Fläche nicht!")
      .replace(/diagonals — don't just multiply by 2!/i, "Diagonalen — multipliziere nicht einfach mit 2!")
      .replace(/three dimensions — multiply them all!/i, "drei Abmessungen — multipliziere sie alle!")
      .replace(/diagonals — first square each leg!/i, "Diagonalen — quadriere zuerst jede Kathete!")
      .replace(/prisms — calculate base area first, then multiply by height!/i, "Prismen — berechne zuerst die Grundfläche, dann multipliziere mit der Höhe!")}`;
  }
  if ((m = t.match(/^Now you know how to (.+)\.$/i))) {
    return `Jetzt weißt du, wie du ${m[1]
      .replace(/solve equal-group problems — like the times table, but in a story/i, "Aufgaben mit gleichen Gruppen löst — wie das Einmaleins, aber in einer Geschichte")
      .replace(/find the perimeter of a square — first count 4 sides/i, "den Umfang eines Quadrats findest — zähle zuerst 4 Seiten")
      .replace(/identify pairs of sides in a rectangle in geometry/i, "Seitenpaare in einem Rechteck in Geometrie erkennst")}.`;
  }
  if ((m = t.match(/^Now you know: (.+)$/i))) {
    return `Jetzt weißt du: ${m[1]
      .replace(/in multiplication and subtraction — multiply first\./i, "bei Multiplikation und Subtraktion — zuerst multiplizieren.")
      .replace(/in addition and multiplication — multiply first\./i, "bei Addition und Multiplikation — zuerst multiplizieren.")}`;
  }
  if ((m = t.match(/^Today we'll learn to (.+)$/i)) || (m = t.match(/^Today we will learn to (.+)$/i))) {
    return `Heute lernen wir, ${m[1]
      .replace(/find all the factors of a number — in math and number theory\./i, "alle Teiler einer Zahl zu finden — in Mathematik und Zahlentheorie.")
      .replace(/estimate a multiplication answer — round the factors, then multiply\./i, "ein Multiplikationsergebnis zu schätzen — runde die Faktoren, dann multipliziere.")
      .replace(/find the price after a percent discount\./i, "den Preis nach einem Prozent-Rabatt zu finden.")}`;
  }
  if ((m = t.match(/^Today we're going to learn (.+)$/i))) {
    return `Heute lernen wir ${m[1]
      .replace(/multiplication — and here we learn it in a simple way:/i, "Multiplikation — und hier lernen wir sie auf eine einfache Weise:")
      .replace(/multiplication — here it's both equal groups and the times table\./i, "Multiplikation — hier sind es sowohl gleiche Gruppen als auch das Einmaleins.")}`;
  }
  if ((m = t.match(/^Today we'll strengthen (.+)$/i)) || (m = t.match(/^Today we will strengthen (.+)$/i))) {
    return `Heute festigen wir ${m[1]
      .replace(/division — equal sharing — with numbers up to about 1,000\./i, "Division — gerechtes Teilen — mit Zahlen bis etwa 1.000.")
      .replace(/adding decimals — two digits after the decimal point\./i, "das Addieren von Dezimalzahlen — zwei Stellen nach dem Komma.")}`;
  }
  if ((m = t.match(/^Today we'll learn (.+)$/i)) || (m = t.match(/^Today we will learn (.+)$/i))) {
    return `Heute lernen wir ${m[1]
      .replace(/about ratios — a comparison between two parts of the same kind\./i, "etwas über Verhältnisse — einen Vergleich zwischen zwei Teilen derselben Art.")
      .replace(/the perimeter of a triangle — the path around all three sides\./i, "den Umfang eines Dreiecks — den Weg um alle drei Seiten.")
      .replace(/volume of a prism — triangular base\./i, "das Volumen eines Prismas — mit dreieckiger Grundfläche.")
      .replace(/about two ways a shape can move:/i, "etwas über zwei Arten, wie sich eine Form bewegen kann:")
      .replace(/about rotation in the plane\./i, "etwas über Drehung in der Ebene.")
      .replace(/about symmetry in the plane\./i, "etwas über Symmetrie in der Ebene.")
      .replace(/the names of common quadrilaterals\./i, "die Namen häufiger Vierecke.")
      .replace(/long division — .+/i, "die schriftliche Division — einen schrittweisen Weg, eine große Zahl durch eine kleinere zu teilen.")}`;
  }
  if ((m = t.match(/^Today in geometry we will learn (.+)$/i))) {
    return `Heute lernen wir in Geometrie ${m[1]
      .replace(/an important rule: the sum of angles in a triangle = 180°\./i, "eine wichtige Regel: Die Winkelsumme in einem Dreieck = 180°.")
      .replace(/the perimeter of a triangle — the sum of all three sides\./i, "den Umfang eines Dreiecks — die Summe aller drei Seiten.")
      .replace(/about a rectangular prism — a three-dimensional solid\./i, "etwas über einen Quader — einen dreidimensionalen Körper.")
      .replace(/the names of common quadrilaterals\./i, "die Namen häufiger Vierecke.")
      .replace(/about two ways a shape can move:/i, "etwas über zwei Arten, wie sich eine Form bewegen kann:")
      .replace(/about rotation in the plane\./i, "etwas über Drehung in der Ebene.")
      .replace(/about symmetry in the plane\./i, "etwas über Symmetrie in der Ebene.")}`;
  }
  if ((m = t.match(/^Today we will apply (.+)$/i))) {
    return `Heute wenden wir ${m[1]
      .replace(/parallel and perpendicular to the sides of a rectangle\./i, "parallel und senkrecht auf die Seiten eines Rechtecks an.")}`;
  }
  if ((m = t.match(/^Today we'll review (.+)$/i))) {
    return `Heute wiederholen wir ${m[1]
      .replace(/three-dimensional solids in geometry\./i, "dreidimensionale Körper in Geometrie.")}`;
  }
  if ((m = t.match(/^Today we'll find (.+)$/i))) {
    return `Heute finden wir ${m[1]
      .replace(/neighbors in big numbers — up to 10,000\./i, "Nachbarn bei großen Zahlen — bis 10.000.")}`;
  }
  if ((m = t.match(/^Today we'll classify (.+)$/i))) {
    return `Heute ordnen wir ${m[1]
      .replace(/quadrilaterals — parallelogram, trapezoid, rectangle, square\./i, "Vierecke ein — Parallelogramm, Trapez, Rechteck, Quadrat.")}`;
  }

  // Fallback: keep previous map entry if better, else mark
  return DE[en] || en;
}

const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const scopes = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
Object.assign(map, scopes);

let bad = 0;
const badSamples = [];
const outMap = {};
for (const en of ens) {
  const de = author(en);
  outMap[en] = de;
  map[en] = de;
  if (stillEn(de) || de === en) {
    bad++;
    if (badSamples.length < 40) badSamples.push({ en, de });
  }
}
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-12-de-map.json"), JSON.stringify(outMap, null, 2));
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-hybrid-bad.json"), JSON.stringify(badSamples, null, 2));
console.log({ total: ens.length, bad, good: ens.length - bad });

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
console.log("done");
process.exit(0);
