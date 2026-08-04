/**
 * Full-line German author for learning-book EN sentences (Germany).
 * Pattern-first; avoids word-salad. No external MT.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXACT as BOOK_EXACT, translateBookLineDe } from "./_de-DE-book-line.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SAFE_LONG = [
  [/Today in geometry we will learn about the rectangle\./gi, "Heute lernen wir in Geometrie etwas über das Rechteck."],
  [/Today in geometry we will learn about the square\./gi, "Heute lernen wir in Geometrie etwas über das Quadrat."],
  [/A rectangle is like a square — but it usually has a different length and width\./gi, "Ein Rechteck ist wie ein Quadrat — aber es hat meist eine andere Länge und Breite."],
  [/A rectangle has 4 sides and 4 right corners — like a square\./gi, "Ein Rechteck hat 4 Seiten und 4 rechte Ecken — wie ein Quadrat."],
  [/In a rectangle there is a length \(a longer side\) and a width \(a shorter side\)\./gi, "In einem Rechteck gibt es eine Länge (eine längere Seite) und eine Breite (eine kürzere Seite)."],
  [/Opposite sides are equal to each other — long opposite long, short opposite short\./gi, "Gegenüberliegende Seiten sind gleich lang — lang gegenüber lang, kurz gegenüber kurz."],
  [/Imagine a chalkboard in the classroom:/gi, "Stell dir eine Tafel im Klassenzimmer vor:"],
  [/Is the board a rectangle\?/gi, "Ist die Tafel ein Rechteck?"],
  [/Yes, the board is a rectangle/gi, "Ja, die Tafel ist ein Rechteck"],
  [/Check the length and width!/gi, "Prüfe die Länge und die Breite!"],
  [/The longer side — length/gi, "Die längere Seite — Länge"],
  [/The shorter side — width/gi, "Die kürzere Seite — Breite"],
  [/Different length and width — not a square \(in a square everything is equal\)\./gi, "Unterschiedliche Länge und Breite — kein Quadrat (in einem Quadrat ist alles gleich)."],
  [/A square is a shape we see everywhere — tiles, windows, and games\./gi, "Ein Quadrat ist eine Form, die wir überall sehen — Fliesen, Fenster und Spiele."],
  [/Are all the sides equal\?/gi, "Sind alle Seiten gleich lang?"],
  [/Are all the corners right angles\?/gi, "Sind alle Ecken rechte Winkel?"],
  [/Is the sticker a square\?/gi, "Ist der Aufkleber ein Quadrat?"],
  [/Yes, the sticker is a square/gi, "Ja, der Aufkleber ist ein Quadrat"],
  [/The shape moved to a new place — but it did not flip over\./gi, "Die Form wurde an einen neuen Ort verschoben — aber sie wurde nicht gespiegelt."],
  [/Did the shape move to a new place, or does it look like a mirror image\?/gi, "Wurde die Form an einen neuen Ort verschoben, oder sieht sie wie ein Spiegelbild aus?"],
  [/The number stays the same!/gi, "Die Zahl bleibt gleich!"],
  [/Always check the place!/gi, "Prüfe immer die Stelle!"],
  [/- ✅ Documentation and draft markdown only/gi, "- ✅ Nur Dokumentation und Entwurfs-Markdown"],
  [/- `book_placeholder\.md` — infrastructure placeholder; \*\*not\*\* part of the 3-page book\./gi, "- `book_placeholder.md` — Infrastruktur-Platzhalter; **nicht** Teil des 3-Seiten-Buchs."],
  [/- Internal IDs remain `Geometrie:g1:\{pageId\}` and `subject: Geometrie`\./gi, "- Interne IDs bleiben `Geometrie:g1:{pageId}` und `subject: Geometrie`."],
  [/Content scope: Identifying a rectangle; different length and width; opposite side pairs; no measurements/gi, "Inhaltsumfang: Ein Rechteck erkennen; unterschiedliche Länge und Breite; Paare gegenüberliegender Seiten; keine Messungen"],
  [/\*\*Content scope:\*\* Identifying a rectangle; different length and width; opposite side pairs; no measurements/gi, "**Inhaltsumfang:** Ein Rechteck erkennen; unterschiedliche Länge und Breite; Paare gegenüberliegender Seiten; keine Messungen"],
];

/** Ordered structural patterns with capture groups */
const PATTERNS = [
  [/^A square with side (\d+(?:\.\d+)?)\s*(cm)?\s*—\s*what is the perimeter\?$/i, (_, n, u) => `Ein Quadrat mit Seitenlänge ${n}${u ? " cm" : ""} — was ist der Umfang?`],
  [/^A square with side (\d+(?:\.\d+)?)\s*(cm)?\s*—\s*what is the area\?$/i, (_, n, u) => `Ein Quadrat mit Seitenlänge ${n}${u ? " cm" : ""} — was ist die Fläche?`],
  [/^A square with side (\d+)\s*—\s*is the diagonal shorter than (\d+), equal to (\d+), or longer than (\d+)\?$/i, (_, a, b, c, d) => `Ein Quadrat mit Seitenlänge ${a} — ist die Diagonale kürzer als ${b}, gleich ${c} oder länger als ${d}?`],
  [/^A triangle with sides (\d+), (\d+), and (\d+)\s*(cm)?\s*—\s*what is the perimeter\?$/i, (_, a, b, c, u) => `Ein Dreieck mit den Seiten ${a}, ${b} und ${c}${u ? " cm" : ""} — was ist der Umfang?`],
  [/^A triangle with sides (\d+), (\d+), and (\d+)\s*—\s*what type of triangle is it\?$/i, (_, a, b, c) => `Ein Dreieck mit den Seiten ${a}, ${b} und ${c} — welche Art von Dreieck ist das?`],
  [/^Triangle: sides (.+?)\s*—\s*what is the perimeter\?$/i, (_, s) => `Dreieck: Seiten ${s} — was ist der Umfang?`],
  [/^Trapezoid: bases (.+?), height (.+?)\s*—\s*what is the area\?$/i, (_, b, h) => `Trapez: Grundseiten ${b}, Höhe ${h} — was ist die Fläche?`],
  [/^Trapezoid: bases (.+?), area (.+?)\s*—\s*what is the height\?$/i, (_, b, a) => `Trapez: Grundseiten ${b}, Fläche ${a} — was ist die Höhe?`],
  [/^A square with (\d+) corners — what is the sum of all its angles\?$/i, (_, n) => `Ein Quadrat mit ${n} Ecken — was ist die Summe aller Innenwinkel?`],
  [/^A rectangle that is not a square — how many lines of symmetry does it have\?$/i, "Ein Rechteck, das kein Quadrat ist — wie viele Symmetrieachsen hat es?"],
  [/^For a rectangular prism — how many pairs of equal faces are there\?$/i, "Bei einem Quader — wie viele Paare gleich großer Flächen gibt es?"],
  [/^In a parallelogram — can you always calculate the diagonal like in a rectangle, using only two adjacent sides\?$/i, "In einem Parallelogramm — kannst du die Diagonale immer wie in einem Rechteck berechnen, nur mit zwei benachbarten Seiten?"],
  [/^Area of a trapezoid = average of the bases × height\.$/i, "Fläche eines Trapezes = Mittelwert der Grundseiten × Höhe."],
  [/^×10 → the decimal point moves one place to the right\.$/i, "×10 → das Komma wandert eine Stelle nach rechts."],
  [/^÷10 → the decimal point moves one place to the left\.$/i, "÷10 → das Komma wandert eine Stelle nach links."],
  [/^If it's 0, 1, 2, 3, or 4 — round down \(stay the same\)$/i, "Wenn es 0, 1, 2, 3 oder 4 ist — abrunden (bleibt gleich)"],
  [/^Now you know how to check divisibility by 2, 5, and 10\.$/i, "Jetzt weißt du, wie du die Teilbarkeit durch 2, 5 und 10 prüfst."],
  [/^In the number ([\d,]+) — how many thousands are there\?$/i, (_, n) => `In der Zahl ${n.replace(/,/g, ".")} — wie viele Tausender gibt es?`],
  [/^At night — who or what gives us light in the sky\?$/i, "In der Nacht — wer oder was gibt uns Licht am Himmel?"],
  [/^In the neighborhood there is a big tree where birds build a nest\.$/i, "In der Nachbarschaft steht ein großer Baum, in dem Vögel ein Nest bauen."],
  [/^An even number — you can arrange in pairs, and everyone has a partner\.$/i, "Eine gerade Zahl — du kannst sie in Paare ordnen, und jeder hat einen Partner."],
  [/^A door — 4 right angles, but different width and height\.$/i, "Eine Tür — 4 rechte Winkel, aber unterschiedliche Breite und Höhe."],
  [/^A three-dimensional solid is a shape that is not flat on the page — you can hold it in your hand\./i, "Ein dreidimensionaler Körper ist eine Form, die nicht flach auf der Seite liegt — du kannst sie in der Hand halten."],
  [/^A polygon base and triangular faces \(like a tent\)\./i, "Eine vieleckige Grundfläche und dreieckige Seitenflächen (wie ein Zelt)."],
  [/^A round base and one point at the top \(like a party hat\)\./i, "Eine runde Grundfläche und eine Spitze oben (wie ein Partyhut)."],
  [/^Imagine a shoe box — rectangular faces, not all the same\./i, "Stell dir einen Schuhkarton vor — rechteckige Flächen, nicht alle gleich."],
  [/^A solid has 6 equal square faces\. What is it called\?/i, "Ein Körper hat 6 gleiche Quadratflächen. Wie heißt er?"],
  [/^Two round bases and a curved side \(like a soda can\)\./i, "Zwei runde Grundflächen und eine gebogene Seitenfläche (wie eine Getränkedose)."],
  [/^A solid with two round bases and a curved side — like a soda can\./i, "Ein Körper mit zwei runden Grundflächen und einer gebogenen Seitenfläche — wie eine Getränkedose."],
  [/^The bases are round — not square or rectangular\./i, "Die Grundflächen sind rund — nicht quadratisch oder rechteckig."],
  [/^(Danny|Amir|Noa|Maya|Leo|Tom|Sara|Nina|Omar|Lina) (has|had|paid|pays|bought|buys|found|finds|collected|gets|got) (.+)$/i, (full, name, verb, rest) => {
    const v = {
      has: "hat",
      had: "hatte",
      paid: "hat bezahlt",
      pays: "bezahlt",
      bought: "hat gekauft",
      buys: "kauft",
      found: "hat gefunden",
      finds: "findet",
      collected: "hat gesammelt",
      gets: "bekommt",
      got: "bekam",
    }[verb.toLowerCase()] || verb;
    return `${name} ${v} ${moneyDe(rest)}`;
  }],
];

function moneyDe(s) {
  return String(s)
    .replace(/\b(\d+)\s*shekels?\b/gi, "$1 Euro")
    .replace(/\b(\d+)\s*dollars?\b/gi, "$1 Euro")
    .replace(/\bshekels?\b/gi, "Euro")
    .replace(/\bdollars?\b/gi, "Euro");
}

const LEX = [
  [/shekels?/gi, "Euro"],
  [/dollars?/gi, "Euro"],
  [/\bGrade\s*([1-6])\b/g, "$1. Klasse"],
  [/\bright angles?\b/gi, "rechte Winkel"],
  [/\bright corners?\b/gi, "rechte Ecken"],
  [/\bnumber line\b/gi, "Zahlenstrahl"],
  [/\brectangular prism\b/gi, "Quader"],
  [/\bparallelogram\b/gi, "Parallelogramm"],
  [/\btrapezoid\b/gi, "Trapez"],
  [/\bquadrilateral\b/gi, "Viereck"],
  [/\bquadrilaterals\b/gi, "Vierecke"],
  [/\bperimeter\b/gi, "Umfang"],
  [/\barea\b/gi, "Fläche"],
  [/\bvolume\b/gi, "Volumen"],
  [/\bdiagonal\b/gi, "Diagonale"],
  [/\bheight\b/gi, "Höhe"],
  [/\blength\b/gi, "Länge"],
  [/\bwidth\b/gi, "Breite"],
  [/\bsymmetry\b/gi, "Symmetrie"],
  [/\blines of symmetry\b/gi, "Symmetrieachsen"],
  [/\bdecimal point\b/gi, "Komma"],
  [/\binfrastructure placeholder\b/gi, "Infrastruktur-Platzhalter"],
  [/\bDocumentation and draft markdown only\b/gi, "Nur Dokumentation und Entwurfs-Markdown"],
  [/\bthree-dimensional\b/gi, "dreidimensional"],
  [/\bchalkboard\b/gi, "Tafel"],
  [/\bclassroom\b/gi, "Klassenzimmer"],
  [/\bsticker\b/gi, "Aufkleber"],
  [/\bmirror image\b/gi, "Spiegelbild"],
  [/\bopposite sides\b/gi, "gegenüberliegende Seiten"],
  [/\bequal to each other\b/gi, "gleich lang"],
  [/\bWhat is it called\?/gi, "Wie heißt es?"],
  [/\bwhat is it called\?/gi, "wie heißt es?"],
  [/\bWhat is the\b/g, "Was ist der/die/das"],
  [/\bwhat is the\b/g, "was ist der/die/das"],
  [/\bHow many\b/g, "Wie viele"],
  [/\bhow many\b/g, "wie viele"],
  [/\bHow much\b/g, "Wie viel"],
  [/\bImagine\b/g, "Stell dir vor:"],
  [/\bCheck\b/g, "Prüfe"],
  [/\bAlways\b/g, "Immer"],
  [/\bYes,/g, "Ja,"],
  [/\bYes —/g, "Ja —"],
  [/\bNo,/g, "Nein,"],
  [/\bbecause\b/gi, "weil"],
  [/\bwithout\b/gi, "ohne"],
  [/\bthrough\b/gi, "durch"],
  [/\bdifferent\b/gi, "unterschiedlich"],
  [/\beverything\b/gi, "alles"],
  [/\beverywhere\b/gi, "überall"],
  [/\busually\b/gi, "meist"],
  [/\blonger\b/gi, "länger"],
  [/\bshorter\b/gi, "kürzer"],
  [/\bequal\b/gi, "gleich"],
  [/\bsides\b/gi, "Seiten"],
  [/\bside\b/gi, "Seite"],
  [/\bcorners\b/gi, "Ecken"],
  [/\bcorner\b/gi, "Ecke"],
  [/\bshapes?\b/gi, "Form"],
  [/\bsquare\b/gi, "Quadrat"],
  [/\brectangle\b/gi, "Rechteck"],
  [/\btriangle\b/gi, "Dreieck"],
  [/\bcircle\b/gi, "Kreis"],
  [/\bcube\b/gi, "Würfel"],
  [/\bcylinder\b/gi, "Zylinder"],
  [/\bpyramid\b/gi, "Pyramide"],
  [/\bcone\b/gi, "Kegel"],
  [/\bsphere\b/gi, "Kugel"],
  [/\bsolid\b/gi, "Körper"],
  [/\bfaces\b/gi, "Flächen"],
  [/\bface\b/gi, "Fläche"],
  [/\bbases\b/gi, "Grundflächen"],
  [/\bbase\b/gi, "Grundfläche"],
  [/\bcurved\b/gi, "gebogen"],
  [/\bround\b/gi, "rund"],
  [/\bflat\b/gi, "flach"],
  [/\bpage\b/gi, "Seite"],
  [/\bhand\b/gi, "Hand"],
  [/\btiles\b/gi, "Fliesen"],
  [/\bwindows\b/gi, "Fenster"],
  [/\bgames\b/gi, "Spiele"],
  [/\bboard\b/gi, "Tafel"],
  [/\bdoor\b/gi, "Tür"],
  [/\bmeasurements?\b/gi, "Messungen"],
  [/\bIdentifying\b/g, "Erkennen von"],
  [/\bidentifying\b/g, "Erkennen von"],
  [/\bopposite\b/gi, "gegenüberliegend"],
  [/\bpairs\b/gi, "Paare"],
  [/\bpair\b/gi, "Paar"],
  [/\bmoved\b/gi, "verschoben"],
  [/\bmove\b/gi, "verschieben"],
  [/\bflip over\b/gi, "umdrehen"],
  [/\bflip\b/gi, "spiegeln"],
  [/\bnew place\b/gi, "neuen Ort"],
  [/\blook like\b/gi, "aussehen wie"],
  [/\bdid not\b/gi, "nicht"],
  [/\bdoes it\b/gi, "tut es"],
  [/\bDid the\b/g, "Hat die/der/das"],
  [/\bIs the\b/g, "Ist die/der/das"],
  [/\bAre all the\b/g, "Sind alle"],
  [/\bAre the\b/g, "Sind die"],
  [/\bhas\b/gi, "hat"],
  [/\bhave\b/gi, "haben"],
  [/\blike a\b/gi, "wie ein"],
  [/\blike an\b/gi, "wie ein"],
  [/\bis like\b/gi, "ist wie"],
  [/\bis a\b/gi, "ist ein"],
  [/\bis an\b/gi, "ist ein"],
  [/\bare\b/gi, "sind"],
  [/\bthe\b/gi, "die/der/das"],
  [/\band\b/gi, "und"],
  [/\bwith\b/gi, "mit"],
  [/\bthat\b/gi, "das"],
  [/\bwhich\b/gi, "welche"],
  [/\bfor\b/gi, "für"],
  [/\bfrom\b/gi, "von"],
  [/\binto\b/gi, "in"],
  [/\babout\b/gi, "über"],
  [/\byour\b/gi, "dein"],
  [/\byou\b/gi, "du"],
  [/\bwe\b/gi, "wir"],
  [/\bour\b/gi, "unser"],
  [/\bthey\b/gi, "sie"],
  [/\btheir\b/gi, "ihr"],
  [/\bthis\b/gi, "dies"],
  [/\bthese\b/gi, "diese"],
  [/\bthose\b/gi, "jene"],
  [/\bnot\b/gi, "nicht"],
  [/\ball\b/gi, "alle"],
  [/\beach\b/gi, "jede"],
  [/\bevery\b/gi, "jede"],
  [/\bmore\b/gi, "mehr"],
  [/\bmost\b/gi, "meist"],
  [/\bonly\b/gi, "nur"],
  [/\balso\b/gi, "auch"],
  [/\bthan\b/gi, "als"],
  [/\bthen\b/gi, "dann"],
  [/\bor\b/gi, "oder"],
  [/\bbut\b/gi, "aber"],
  [/\bin\b/gi, "in"],
  [/\bon\b/gi, "auf"],
  [/\bat\b/gi, "bei"],
  [/\bof\b/gi, "von"],
  [/\bto\b/gi, "zu"],
  [/\ba\b/gi, "ein"],
  [/\ban\b/gi, "ein"],
];

function stillEn(s) {
  const m = String(s).match(
    /\b(the|and|with|that|which|is|are|has|have|like|not|all|sides|corners|shape|length|width|equal|Imagine|Check|Yes|Did|Does|called|hold|move|moved|flip|mirror|everywhere|tiles|windows|games|board|sticker|classroom|Identifying|different|opposite|usually|longer|shorter|everything|Infrastructure|placeholder|Documentation|three-dimensional|flat|page|hand|polygon|triangular|faces|round|base|point|top|party|hat|shoe|box|rectangular|same|curved|soda|can|bases|your|you|we|our|they|their|this|these|those|because|without|through|would|could|should|what|when|where|how|why|shekel)\b/gi
  );
  return (m || []).length >= 2;
}

export function authorBookLineDe(en) {
  const raw = String(en ?? "");
  const trimmed = raw.trim();
  if (!trimmed) return raw;
  if (BOOK_EXACT[trimmed]) return BOOK_EXACT[trimmed];

  for (const [re, de] of SAFE_LONG) {
    if (re.test(trimmed)) {
      re.lastIndex = 0;
      return trimmed.replace(re, de);
    }
  }

  for (const [re, rep] of PATTERNS) {
    const m = trimmed.match(re);
    if (!m) continue;
    return typeof rep === "function" ? rep(...m) : rep;
  }

  // Long-phrase engine only (short swaps disabled in translateBookLineDe)
  let out = translateBookLineDe(trimmed);
  if (!stillEn(out) && out !== trimmed) return out;

  // Do NOT apply word-salad lexicon to full sentences.
  // Return EN unchanged so residue tooling can force full-line maps.
  return moneyDe(trimmed);
}

function looksBad(de) {
  // leftover English verbs/articles after authoring
  return /\b(the|and|with|that|which|is|are|has|have|like|Imagine|Check|called|hold|move|moved|flip|everywhere|tiles|windows|games|board|sticker|classroom|Identifying|Documentation|placeholder|three-dimensional|soda|shekel)\b/i.test(
    de
  );
}

export function authorAll(lines) {
  const map = {};
  const bad = [];
  for (const en of lines) {
    const de = authorBookLineDe(en);
    map[en] = de;
    if (looksBad(de) || stillEn(de)) bad.push({ en, de });
  }
  return { map, bad };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const salad = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-salad.json"), "utf8"));
  const lines = salad.map((x) => x.en);
  const { map, bad } = authorAll(lines);
  fs.writeFileSync(path.join(__dirname, "_de-DE-book-salad-authored.json"), JSON.stringify(map, null, 2));
  fs.writeFileSync(path.join(__dirname, "_de-DE-book-salad-bad.json"), JSON.stringify(bad, null, 2));
  console.log({ authored: Object.keys(map).length, bad: bad.length, badSample: bad.slice(0, 25) });
}
