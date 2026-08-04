/**
 * Rebuild docs/learning-book/nl-NL from EN with phrase-first Dutch (no short-word salad).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN = path.join(ROOT, "docs/learning-book/en");
const OUT = path.join(ROOT, "docs/learning-book/nl-NL");

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith(".md")) files.push(p);
  }
  return files;
}

const EXACT = new Map([
  ["## Metadata", "## Metagegevens"],
  ["| Field | Value |", "| Veld | Waarde |"],
  ["**Source references:**", "**Bronverwijzingen:**"],
  ["**Content scope:**", "**Inhoudsbereik:**"],
  ["## 1. What are we learning?", "## 1. Wat gaan we leren?"],
  ["## 2. Simple explanation", "## 2. Eenvoudige uitleg"],
  ["## 3. Visual / concrete example", "## 3. Visueel / concreet voorbeeld"],
  ["## 3. Example", "## 3. Voorbeeld"],
  ["## 4. Let's solve together", "## 4. Laten we het samen oplossen"],
  ["## 5. Try it yourself", "## 5. Probeer het zelf"],
  ["## 6. Common mistake — watch out!", "## 6. Veelgemaakte fout — let op!"],
  ["## 6. Let's check together", "## 6. Laten we samen nakijken"],
  ["## 7. Let's practice!", "## 7. Laten we oefenen!"],
  ["Try to solve it on your own.", "Probeer het zelf op te lossen."],
  ["Try to solve it yourself.", "Probeer het zelf op te lossen."],
  ["On the next page we'll check the steps and the answer together.", "Op de volgende pagina kijken we samen de stappen en het antwoord na."],
  ["On the next page, we'll check the way and the answer together.", "Op de volgende pagina kijken we samen de manier en het antwoord na."],
  ["Let's break it into easy steps.", "Laten we het in makkelijke stappen verdelen."],
  ["For example:", "Bijvoorbeeld:"],
  ["Useful words:", "Handige woorden:"],
]);

/** Longer first. */
const PHRASES = [
  ["Today we will use a formula for the area of a square:", "Vandaag gebruiken we een formule voor de oppervlakte van een vierkant:"],
  ["Today we will use a formula to find the perimeter of a square:", "Vandaag gebruiken we een formule om de omtrek van een vierkant te vinden:"],
  ["Today we will apply parallel and perpendicular to the sides of a rectangle.", "Vandaag passen we evenwijdig en loodrecht toe op de zijden van een rechthoek."],
  ["Today we will strengthen the perimeter of a triangle here — with sides 5, 6, and 7 cm.", "Vandaag oefenen we hier de omtrek van een driehoek — met zijden 5, 6 en 7 cm."],
  ["Today we'll learn about the diagonal of a parallelogram in geometry — ideas, not one formula for every case.", "Vandaag leren we over de diagonaal van een parallellogram in meetkunde — ideeën, niet één formule voor elk geval."],
  ["Today we'll learn the diagonal of a rectangle.", "Vandaag leren we de diagonaal van een rechthoek."],
  ["Today we'll learn the diagonal of a square.", "Vandaag leren we de diagonaal van een vierkant."],
  ["Today we'll learn the height of a parallelogram from area and base.", "Vandaag leren we de hoogte van een parallellogram uit oppervlakte en basis."],
  ["Today we're going to learn to", "Vandaag gaan we leren om te"],
  ["Today we're going to learn", "Vandaag gaan we"],
  ["Today we are going to learn", "Vandaag gaan we"],
  ["Today we will learn to", "Vandaag leren we om te"],
  ["Today we will learn", "Vandaag leren we"],
  ["Today we will", "Vandaag zullen we"],
  ["Today we'll", "Vandaag zullen we"],
  ["Today we add", "Vandaag voegen we toe"],
  ["Now you know how to", "Nu weet je hoe je"],
  ["Now you know about", "Nu ken je"],
  ["Now you know the", "Nu ken je de"],
  ["Now you know", "Nu ken je"],
  ["In practice you'll find", "In de oefening vind je"],
  ["In practice you will find", "In de oefening vind je"],
  ["In practice, fill", "In de oefening vul"],
  ["In practice:", "In de oefening:"],
  ["In practice ", "In de oefening "],
  ["We will learn about", "We leren over"],
  ["We will learn", "We leren"],
  ["We will identify", "We herkennen"],
  ["We will see", "We zien"],
  ["We will fill", "We vullen"],
  ["We will also learn", "We leren ook"],
  ["We will connect", "We verbinden"],
  ["We will break", "We splitsen"],
  ["We'll break", "We splitsen"],
  ["We'll listen", "We luisteren"],
  ["area of a square", "oppervlakte van een vierkant"],
  ["area of a rectangle", "oppervlakte van een rechthoek"],
  ["perimeter of a square", "omtrek van een vierkant"],
  ["perimeter of a rectangle", "omtrek van een rechthoek"],
  ["perimeter of a triangle", "omtrek van een driehoek"],
  ["Area = side × side", "Oppervlakte = zijde × zijde"],
  ["Formula: Area", "Formule: Oppervlakte"],
  ["Formula — side × side", "Formule — zijde × zijde"],
  ["Formula — Area = side × side", "Formule — Oppervlakte = zijde × zijde"],
  ["parallel and perpendicular", "evenwijdig en loodrecht"],
  ["number line", "getallenlijn"],
  ["addition problems", "optelsommen"],
  ["Simple explanation", "Eenvoudige uitleg"],
  ["What are we learning?", "Wat gaan we leren?"],
  ["Common mistake", "Veelgemaakte fout"],
  ["watch out!", "let op!"],
  ["together that's", "samen is dat"],
  ["in science", "in natuur en techniek"],
  ["in geometry", "in meetkunde"],
  ["Grade 1", "Groep 3"],
  ["Grade 2", "Groep 4"],
  ["Grade 3", "Groep 5"],
  ["Grade 4", "Groep 6"],
  ["Grade 5", "Groep 7"],
  ["Grade 6", "Groep 8"],
  ["square", "vierkant"],
  ["rectangle", "rechthoek"],
  ["triangle", "driehoek"],
  ["circle", "cirkel"],
  ["parallelogram", "parallellogram"],
  ["trapezoid", "trapezium"],
  ["diagonal", "diagonaal"],
  ["perimeter", "omtrek"],
  ["area", "oppervlakte"],
  ["height", "hoogte"],
  ["base", "basis"],
  ["side", "zijde"],
  ["sides", "zijden"],
  ["angle", "hoek"],
  ["angles", "hoeken"],
  ["formula", "formule"],
  ["parallel", "evenwijdig"],
  ["perpendicular", "loodrecht"],
  ["Wiskunde", "Rekenen"],
  ["Science", "Natuur en techniek"],
  ["Geometry", "Meetkunde"],
  ["Math", "Rekenen"],
].sort((a, b) => b[0].length - a[0].length);

function protect(s) {
  const ph = [];
  let out = String(s).replace(/```[\s\S]*?```/g, (block) => {
    ph.push(block);
    return `\u27E6B${ph.length - 1}\u27E7`;
  });
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    ph.push("`" + code + "`");
    return `\u27E6C${ph.length - 1}\u27E7`;
  });
  return { text: out, ph };
}

function restore(s, ph) {
  return String(s)
    .replace(/\u27E6B(\d+)\u27E7/g, (_, i) => ph[Number(i)])
    .replace(/\u27E6C(\d+)\u27E7/g, (_, i) => ph[Number(i)]);
}

function isMetaIdLine(line) {
  return /\|\s*\*\*(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(line);
}

function isEnglishTargetLine(line) {
  const t = line.trim();
  if (!t) return false;
  if (/^[A-Za-z][A-Za-z' -]{0,24}$/.test(t) && !/\s{2,}/.test(t)) return true;
  if (/^"[A-Za-z]/.test(t) || /^'[A-Za-z]/.test(t)) return true;
  if (/^[\d\s+\-×÷=/?.,…]+$/.test(t)) return true;
  return false;
}

function translateLine(line, { englishSubject }) {
  if (!line.trim()) return line;
  if (isMetaIdLine(line)) {
    return line
      .replace(/\|\s*\*\*subject\*\*\s*\|\s*math\s*\|/i, "| **subject** | rekenen |")
      .replace(/\|\s*\*\*grade\*\*/i, "| **groep**")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_1_2\s*\|/i, "| **age_band** | groepen_3_4 |")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_3_4\s*\|/i, "| **age_band** | groepen_5_6 |")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_5_6\s*\|/i, "| **age_band** | groepen_7_8 |");
  }
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(line)) return line;
  if (EXACT.has(line)) return EXACT.get(line);
  let out = line;
  for (const [en, nl] of EXACT) {
    if (out.includes(en)) out = out.split(en).join(nl);
  }
  if (englishSubject && isEnglishTargetLine(out)) return out;
  if (
    englishSubject &&
    /^(A |An |The |We hear|We say|It's |It is |What is a |Door means|Think — a )/i.test(out.trim()) &&
    !/^(What are we learning|Today we|Try to solve|On the next|Now you know|Useful words)/i.test(out.trim())
  ) {
    return out;
  }

  const { text, ph } = protect(out);
  out = text;
  for (const [en, nl] of PHRASES) {
    if (out.toLowerCase().includes(en.toLowerCase())) {
      // case-insensitive split/join without regex pitfalls
      const parts = out.split(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"));
      out = parts.join(nl);
    }
  }
  out = restore(out, ph);
  return out;
}

function convert(md, { englishSubject }) {
  return md
    .split(/(```[\s\S]*?```)/g)
    .map((part) => {
      if (part.startsWith("```")) return part;
      return part
        .split(/(\n)/)
        .map((line) => (line === "\n" ? line : translateLine(line, { englishSubject })))
        .join("");
    })
    .join("");
}

let n = 0;
for (const enFile of walk(EN)) {
  const rel = path.relative(EN, enFile);
  const dest = path.join(OUT, rel);
  const md = fs.readFileSync(enFile, "utf8");
  const englishSubject = rel.replace(/\\/g, "/").startsWith("english/");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, convert(md, { englishSubject }), "utf8");
  n++;
  if (n % 50 === 0) console.log("books", n);
}

const EN_INSTR =
  /\b(Today we will|Today we'll|Today we zal|What are we learning\?|Try it yourself|Simple explanation|Let's practice|Let's solve|Common mistake)\b/;
let residual = 0;
const samples = [];
for (const f of walk(OUT)) {
  const rel = path.relative(OUT, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const t = fs.readFileSync(f, "utf8");
  if (EN_INSTR.test(t)) {
    residual++;
    if (samples.length < 10) samples.push(rel);
  }
}
console.log({ wrote: n, residualNonEnglishEnChrome: residual, samples });
