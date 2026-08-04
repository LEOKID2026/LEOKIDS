import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translateBookLineNl, stillEnglishInstructional } from "./_nl-NL-book-line.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN_DIR = path.join(ROOT, "docs/learning-book/en");
const OUT_DIR = path.join(ROOT, "docs/learning-book/nl-NL");

const residue = JSON.parse(fs.readFileSync(path.join(__dirname, "_book-residue-en.json"), "utf8"));
const ROUND2 = JSON.parse(fs.readFileSync(path.join(__dirname, "_book-residue-round2.json"), "utf8"));

/** Manual overrides where phrase translator is insufficient. */
const MANUAL = {
  ...ROUND2,
  "Today in geometry we will learn about the rectangle.": "Vandaag in meetkunde leren we over de rechthoek.",
  "Today in geometry we will learn about the square.": "Vandaag in meetkunde leren we over het vierkant.",
  "If all the sides are equal and all the corners are right angles — the shape is a square.":
    "Als alle zijden even lang zijn en alle hoeken rechte hoeken zijn — is de vorm een vierkant.",
  "When you measure — all the sides are equal to each other.":
    "Als je meet — zijn alle zijden even lang.",
  "Sticker: 4 sides, all right corners, and all sides equal to each other.":
    "Sticker: 4 zijden, alle rechte hoeken, en alle zijden even lang.",
  "Are all the sides equal to each other? Yes — they are all the same length.":
    "Zijn alle zijden even lang? Ja — ze zijn allemaal even lang.",
  "Check that all the sides are equal!": "Controleer dat alle zijden even lang zijn!",
  "Today in geometry we will learn about two ways a shape can move:":
    "Vandaag in meetkunde leren we over twee manieren waarop een vorm kan bewegen:",
  "Today in geometry we will learn about three-dimensional solids — shapes that have length, width, and height.":
    "Vandaag in meetkunde leren we over driedimensionale lichamen — vormen met lengte, breedte en hoogte.",
  "- All the faces are equal squares": "- Alle vlakken zijn gelijke vierkanten",
  "All the faces are equal squares — that is a cube, not a rectangular prism.":
    "Alle vlakken zijn gelijke vierkanten — dat is een kubus, geen balk.",
  "Today in geometry we will learn what the area of a square is — how much space the square takes up on a surface":
    "Vandaag in meetkunde leren we wat de oppervlakte van een vierkant is — hoeveel ruimte het vierkant inneemt op een vlak",
  "Fill it in rows — 4 squares in each row.": "Vul het rij voor rij — 4 vierkantjes in elke rij.",
  "Fill it in rows — 3 small squares in each row.": "Vul het rij voor rij — 3 kleine vierkantjes in elke rij.",
  "Today in geometry we will strengthen the difference between translation and reflection.":
    "Vandaag in meetkunde oefenen we het verschil tussen translatie en spiegeling.",
  "Today in geometry we will learn about parallel lines and perpendicular lines.":
    "Vandaag in meetkunde leren we over evenwijdige lijnen en loodrechte lijnen.",
  "Today in geometry we will learn the names of common quadrilaterals.":
    "Vandaag in meetkunde leren we de namen van veelvoorkomende vierhoeken.",
  "**Content scope:** Quarter turn 90°; introduction; no formal center":
    "**Inhoudsbereik:** Kwartslag 90°; introductie; geen formeel middelpunt",
  "Today in geometry we will learn about rotation in the plane.":
    "Vandaag in meetkunde leren we over rotatie in het vlak.",
  "We will learn what a quarter turn is — a rotation of 90° — like when you turn an arrow a quarter of the way around.":
    "We leren wat een kwartslag is — een rotatie van 90° — zoals wanneer je een pijl een kwartslag draait.",
  "A quarter turn = 90° — one quarter of a full path (360°).":
    "Een kwartslag = 90° — een kwart van een volledige ronde (360°).",
  "Example: an arrow pointing up — after a quarter turn (90°) it points to the right.":
    "Voorbeeld: een pijl die omhoog wijst — na een kwartslag (90°) wijst hij naar rechts.",
  "- From 12 to 3 — that is a quarter turn": "- Van 12 naar 3 — dat is een kwartslag",
  "We rotated a shape a quarter turn. How many degrees did we rotate?":
    "We draaiden een vorm een kwartslag. Hoeveel graden hebben we gedraaid?",
  "A quarter turn = one quarter of 360°.": "Een kwartslag = een kwart van 360°.",
  "Now you know a quarter turn in geometry.": "Nu ken je een kwartslag in meetkunde.",
  "Today in geometry we will go deeper into the cube — a solid we already know from earlier grades.":
    "Vandaag in meetkunde gaan we dieper in op de kubus — een lichaam dat we al kennen uit eerdere groepen.",
  "Today in geometry we will strengthen the area of a square — with a grid and bigger numbers.":
    "Vandaag in meetkunde oefenen we de oppervlakte van een vierkant — met een rooster en grotere getallen.",
  "First way — grid: 5 squares in each row, 5 rows → 25 total.":
    "Eerste manier — rooster: 5 vierkantjes in elke rij, 5 rijen → 25 in totaal.",
  "- 5 squares in each row": "- 5 vierkantjes in elke rij",
  "Today in geometry we will learn to find the perimeter of a square — the length of the whole border.":
    "Vandaag in meetkunde leren we de omtrek van een vierkant te vinden — de lengte van de hele rand.",
  "We will start by counting: go around all four sides and add them up.":
    "We beginnen met tellen: ga rond alle vier zijden en tel ze op.",
  "In a square all 4 sides are equal.": "In een vierkant zijn alle 4 zijden even lang.",
  "Here — for example a square with side 7 → area 49 cm².":
    "Hier — bijvoorbeeld een vierkant met zijde 7 → oppervlakte 49 cm².",
  "Why? In each row there are 7 units, 7 rows → 7 × 7.":
    "Waarom? In elke rij zijn er 7 eenheden, 7 rijen → 7 × 7.",
  "Unit: cm².": "Eenheid: cm².",
  "Area ≠ Perimeter — area is inside, perimeter is around.":
    "Oppervlakte ≠ omtrek — oppervlakte is binnen, omtrek is rondom.",
  "Square with side 7:": "Vierkant met zijde 7:",
  "Area: 49 cm².": "Oppervlakte: 49 cm².",
  "A square has a side of length 7. What is the area?":
    "Een vierkant heeft een zijde van lengte 7. Wat is de oppervlakte?",
  "A square with side 9 — what is the area?": "Een vierkant met zijde 9 — wat is de oppervlakte?",
};

const MAP = {};
for (const { en } of residue) {
  MAP[en] = MANUAL[en] || translateBookLineNl(en);
}
Object.assign(MAP, MANUAL);
fs.writeFileSync(path.join(__dirname, "_book-residue-nl-map.json"), JSON.stringify(MAP, null, 2));

const still = Object.entries(MAP).filter(([, nl]) => stillEnglishInstructional(nl));
console.log({ mapped: Object.keys(MAP).length, stillAfter: still.length, sampleStill: still.slice(0, 15).map(([e, n]) => ({ e: e.slice(0, 80), n: n.slice(0, 80) })) });

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

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
  const trimmed = line.trim();
  if (MAP[trimmed]) return line.replace(trimmed, MAP[trimmed]);
  if (englishSubject && isEnglishTargetLine(line)) return line;
  if (
    englishSubject &&
    /^(A |An |The |We hear|We say|It's |It is |What is a |Door means|Think — a )/i.test(trimmed) &&
    !/^(What are we learning|Today we|Try to solve|On the next|Now you know|Useful words)/i.test(trimmed)
  ) {
    return line;
  }
  const { text, ph } = protect(line);
  let out = translateBookLineNl(text);
  // apply MAP substrings for residual chrome embedded in longer lines
  for (const [en, nl] of Object.entries(MAP)) {
    if (en.length >= 20 && out.includes(en)) out = out.split(en).join(nl);
  }
  return restore(out, ph);
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
for (const enFile of walk(EN_DIR)) {
  const rel = path.relative(EN_DIR, enFile);
  const dest = path.join(OUT_DIR, rel);
  const md = fs.readFileSync(enFile, "utf8");
  const englishSubject = rel.replace(/\\/g, "/").startsWith("english/");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, convert(md, { englishSubject }), "utf8");
  n++;
}
console.log({ wrote: n });
