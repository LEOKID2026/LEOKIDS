/**
 * Offline learning-book/nl-NL from English authority (local only).
 * Math/geometry/science: full Dutch prose.
 * English subject: Dutch chrome/instructions; keep English learning targets/examples.
 *
 * node scripts/i18n/generate-learning-book-nl-NL-offline.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translateEduNl } from "./_nl-NL-edu-translate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN = path.join(ROOT, "docs/learning-book/en");
const OUT = path.join(ROOT, "docs/learning-book/nl-NL");

const EXACT_LINES = [
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
  ["Today we're going to learn to add two numbers.", "Vandaag gaan we leren om twee getallen op te tellen."],
  ["Addition is when you put two groups together to make one bigger group.", "Optellen is wanneer je twee groepen bij elkaar doet om één grotere groep te maken."],
  ["When you add — you put two amounts together.", "Wanneer je optelt — doe je twee hoeveelheden bij elkaar."],
  ['+ means "and more".', '+ betekent "en meer".'],
  ['= means "that\'s the total".', '= betekent "dat is het totaal".'],
  ["For example: 4 + 3 = 7", "Bijvoorbeeld: 4 + 3 = 7"],
  ["Four and three more — together that's seven.", "Vier en drie meer — samen is dat zeven."],
  ["Let's break it into easy steps.", "Laten we het in makkelijke stappen verdelen."],
  ["First we add 10:", "Eerst tellen we 10 op:"],
  ["Still need to add 2 more:", "We moeten nog 2 meer optellen:"],
  ["Try to solve it on your own.", "Probeer het zelf op te lossen."],
  ["On the next page we'll check the steps and the answer together.", "Op de volgende pagina kijken we samen de stappen en het antwoord na."],
  ["Now you know how to add two numbers.", "Nu weet je hoe je twee getallen optelt."],
  ["In practice you'll find addition problems.", "In de oefening vind je optelsommen."],
  ["Join groups or hop to the right on the number line!", "Voeg groepen samen of spring naar rechts op de getallenlijn!"],
  ["Start at 17.", "Begin bij 17."],
  ["Start at 7.", "Begin bij 7."],
  ["Add 4 steps forward: 8, 9, 10, 11.", "Tel 4 stappen vooruit: 8, 9, 10, 11."],
  ["9 marbles + 12 marbles:", "9 knikkers + 12 knikkers:"],
  ["Adding two numbers, sum up to 30. No vertical addition, no carrying, no adding three numbers.", "Twee getallen optellen, som tot 30. Geen verticaal optellen, geen onthouden, geen drie getallen optellen."],
  ["Today we will learn classroom words in English.", "Vandaag leren we klassikale woorden in het Engels."],
  ["We'll listen, look, and connect a word to a picture — first by listening.", "We luisteren, kijken en verbinden een woord aan een plaatje — eerst door te luisteren."],
  ["Try to solve it yourself.", "Probeer het zelf op te lossen."],
  ["On the next page, we'll check the way and the answer together.", "Op de volgende pagina kijken we samen de manier en het antwoord na."],
  ["Now you know classroom words.", "Nu ken je klassikale woorden."],
  ["Useful words:", "Handige woorden:"],
];

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith(".md")) files.push(p);
  }
  return files;
}

function protect(s) {
  const ph = [];
  let out = String(s).replace(/```[\s\S]*?```/g, (block) => {
    ph.push(block);
    return `⟦B${ph.length - 1}⟧`;
  });
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    ph.push("`" + code + "`");
    return `⟦C${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restore(s, ph) {
  return String(s)
    .replace(/⟦B(\d+)⟧/g, (_, i) => ph[Number(i)])
    .replace(/⟦C(\d+)⟧/g, (_, i) => ph[Number(i)]);
}

function isMetaIdLine(line) {
  return /\|\s*\*\*(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(line);
}

function isEnglishTargetLine(line) {
  const t = line.trim();
  if (!t) return false;
  // short vocab lines
  if (/^[A-Za-z][A-Za-z' -]{0,24}$/.test(t) && !/\s{2,}/.test(t)) return true;
  // quoted English tokens
  if (/^"[A-Za-z]/.test(t) || /^'[A-Za-z]/.test(t)) return true;
  // pure equation/number lines
  if (/^[\d\s+\-×÷=/?.,…]+$/.test(t)) return true;
  return false;
}

function translateLine(line, { englishSubject }) {
  if (!line.trim()) return line;
  if (isMetaIdLine(line)) {
    // Map age_band display labels only outside IDs; keep grade key g1 etc.
    return line
      .replace(/\|\s*\*\*subject\*\*\s*\|\s*math\s*\|/i, "| **subject** | rekenen |")
      .replace(/\|\s*\*\*grade\*\*/i, "| **groep**")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_1_2\s*\|/i, "| **age_band** | groepen_3_4 |")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_3_4\s*\|/i, "| **age_band** | groepen_5_6 |")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_5_6\s*\|/i, "| **age_band** | groepen_7_8 |");
  }
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(line)) return line;

  for (const [en, nl] of EXACT_LINES) {
    if (line === en) return nl;
    if (line.includes(en)) line = line.split(en).join(nl);
  }

  if (englishSubject && isEnglishTargetLine(line)) return line;
  // English subject: keep example sentences that are clearly English learning material
  if (
    englishSubject &&
    /^(A |An |The |We hear|We say|It's |It is |What is a |Door means|Think — a )/i.test(line.trim()) &&
    !/^(What are we learning|Today we|Try to solve|On the next|Now you know|Useful words)/i.test(line.trim())
  ) {
    return line;
  }

  const { text, ph } = protect(line);
  let out = translateEduNl(text, { childFacing: true });
  out = restore(out, ph);
  out = out
    .replace(/\bWiskunde\b/g, "Rekenen")
    .replace(/\bGrade\s*1\b/g, "Groep 3")
    .replace(/\bGrade\s*2\b/g, "Groep 4")
    .replace(/\bGrade\s*3\b/g, "Groep 5")
    .replace(/\bGrade\s*4\b/g, "Groep 6")
    .replace(/\bGrade\s*5\b/g, "Groep 7")
    .replace(/\bGrade\s*6\b/g, "Groep 8")
    .replace(/\bwetenschap\b/gi, "natuur en techniek")
    .replace(/\bScience\b/g, "Natuur en techniek");
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

const files = walk(EN);
let n = 0;
for (const enFile of files) {
  const rel = path.relative(EN, enFile);
  const dest = path.join(OUT, rel);
  const md = fs.readFileSync(enFile, "utf8");
  const englishSubject = rel.replace(/\\/g, "/").startsWith("english/");
  const out = convert(md, { englishSubject });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out, "utf8");
  n++;
  if (n % 50 === 0) console.log("books", n, "/", files.length);
}
console.log("Wrote learning-book/nl-NL", n);

// quick residual scan
const EN_INSTR = /\b(Today we will|Today we're|What are we learning|Try it yourself|Simple explanation|Let's practice|Let's solve|Common mistake)\b/;
let residualFiles = 0;
for (const f of walk(OUT)) {
  const rel = path.relative(OUT, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue; // english targets may remain
  const t = fs.readFileSync(f, "utf8");
  if (EN_INSTR.test(t)) residualFiles++;
}
console.log({ residualNonEnglishSubjectFilesWithEnChrome: residualFiles });
