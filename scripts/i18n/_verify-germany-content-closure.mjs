/**
 * Targeted Germany content/linguistic closure checks.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
const fails = [];
const pass = [];

function walk(d, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

// 1) Mash / Hebrew / broken
const DE_BOOKS = path.join(ROOT, "docs/learning-book/de-DE");
const MASH =
  /\b(to add|to subtract|to multiply|to divide|Steps für|Steps for|Hundreds \+|ones:|carry |Coin Values|wie viel ist Left|Left\?|number line|What is|How many|Write the|Read the|Today we will learn to |Today we're going to learn to |with remainder|no remainder|full boxes|missing number|place value|times table|word problem)\b/i;
const HE = /[\u0590-\u05FF]/;
const BROKEN =
  /\b(lernening|lernenING|tiauf|Reproductiauf|Observatiauf|Divisiauf|comparisauf|Whbei|foder|modere|befodere|Additiauf|foundatiauf|fodermula|woderds|predatoder|lernening-book|Geometrie_GRADE)\b/;

let mash = 0,
  heb = 0,
  broken = 0;
for (const f of walk(DE_BOOKS)) {
  const rel = path.relative(DE_BOOKS, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  for (const l of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    if (/\|\s*\*\*title_english\*\*/i.test(l)) continue;
    if (MASH.test(l)) mash++;
    if (HE.test(l)) heb++;
    if (BROKEN.test(l)) broken++;
  }
}
(mash === 0 ? pass : fails).push(`mash=${mash}`);
(heb === 0 ? pass : fails).push(`hebrew=${heb}`);
(broken === 0 ? pass : fails).push(`broken=${broken}`);

// 2) Parent/worksheets/seo/school Sie keys
const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/ui.json"), "utf8"));
const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/worksheets.json"), "utf8"));
const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/seo.json"), "utf8"));
const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/school.json"), "utf8"));
const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/learning.json"), "utf8"));

const checks = [
  [ui.parent.childLimitReached, /Sie haben/, "childLimitReached"],
  [ui.parent.gradeRequired, /wählen Sie/, "gradeRequired"],
  [ui.home.ctaParents, /Bereich für Eltern/, "ctaParents"],
  [ui.nav.helpCenter, /Hilfezentrum|Hilfebereich/, "helpCenter"],
  [ui.public.homepage.finalCta.text, /Ihr Kind|Sie /, "finalCta.text"],
  [ws.hubSubtitle, /Wählen Sie|Ihres Kindes/, "hubSubtitle"],
  [ws.hubIntro, /bevor Sie drucken/, "hubIntro"],
  [ws.createHint, /druckfertiges Arbeitsblatt/, "createHint"],
  [seo.learningDescription, /Wählen Sie/, "learningDescription"],
  [school.portal.createStudentClassHint, /Wählen Sie/, "createStudentClassHint"],
  [learning.questionsAnswered, /\{count, plural, one \{# Frage\} other \{# Fragen\}\}/, "questionsAnswered"],
];
for (const [val, re, name] of checks) {
  (re.test(String(val)) ? pass : fails).push(name + "=" + JSON.stringify(val));
}

// 3) Help grade IDs
const parentsHelp = fs.readFileSync(path.join(ROOT, "data/help-center/de-DE/parents.js"), "utf8");
const gradeIds = (parentsHelp.match(/grade_[1-6]/g) || []).length;
(gradeIds === 0 ? pass : fails).push(`helpGradeIds=${gradeIds}`);

// 4) Diagnostic English display values
const labels = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content-packs/de-DE/learning/diagnostic-labels.json"), "utf8")
);
const enish = [];
// Established German school/loan terms are fine (Addition, Division, Multiple Choice, …).
const ALLOWED_LOAN = /^(Addition|Subtraktion|Multiplikation|Division|Division mit Rest|Brüche|Prozente|Folgen|Dezimalzahlen|Runden|Potenzen|Verhältnisse|Gleichungen|Rechenreihenfolge|Überschlagen|Maßstab|Vergleich|Zahlenverständnis|Teiler und Vielfache|Textaufgaben|Einmaleins-Tabelle|Stellenwert|Muster|Fortgeschrittene Multiplikation|Gemischte Übung|Grundformen|Formen|Fläche|Umfang|Volumen|Winkel|Parallele und senkrechte Geraden|Dreiecke|Vierecke|Abbildungen|Drehung|Symmetrie|Diagonalen|Höhen|Parkettierung|Kreise|Körper|Satz des Pythagoras|Koordinaten|Phonetik|Wortschatz|Grammatik|Grammatikgrundlagen|Übersetzung|Satzbau|Schreiben|Leseverständnis|Zuordnen|Schlussfolgern|Satzverständnis|Einfache Sätze|Der menschliche Körper|Tiere|Pflanzen|Materialien|Erde und Weltraum|Umwelt und Ökologie|Experimente und Vorgänge|Tiere und Pflanzen|Einfache Experimente|Lebewesen|Materie|Kräfte|Gemischte Themen|Lesen|Sprechen|Hauptgedanke|Reihenfolge|Tatsache und Meinung|Vokale lesen|Pluralformen|Verbformen|Satzstruktur|Heimatkunde|Gemeinschaft|Staatsbürgerschaft|Geografie|Geografie-Grundlagen|Werte|Karten|Kartenlesen|Richtungen|Orte|Einfache Karten|Regionen|Geschichte|wortbasiert|Aufgaben|Ergänzung|Sätze|Rest|Rabatte|Prisma|Rechteck|Multiple Choice|Lückentext|Präpositionen|Hörverstehen|Rechtschreibung|Zeitform|unregelmäßige Formen|Abrufen|Geschichte|gemischte Operationen|senkrechte Schreibweise|Übertrag|einmal|Grundniveau|mittleres Niveau|fortgeschrittenes Niveau|Klasse|Kontext|logische Folge|Folge|Hier gibt es wiederkehrende Fehler|Ein Punkt, der auffällt|Es hilft, dieses Thema noch etwas zu festigen|Ein Thema, das noch einmal geprüft werden sollte|Teilbarkeitsregeln|Prim- und zusammengesetzte Zahlen|Eigenschaften von 0 und 1)$/;
function walkAll(obj, prefix = "") {
  for (const [k, v] of Object.entries(obj || {})) {
    if (v && typeof v === "object") walkAll(v, prefix + k + ".");
    else if (typeof v === "string") {
      const s = v.trim();
      if (ALLOWED_LOAN.test(s)) continue;
      // Flag leftover English instructional labels
      if (
        /^(grade|multiplication|addition|subtraction|division|area|volume|vocabulary|grammar|reading|writing|sentence|problems|comparison|remainder|context|sequence|geography)$/i.test(s) ||
        /^(The |A |There |It |Parallel and|Grammar basics|Sentence |Reading |Matching|Inference|Simple |Basic |Living |Matter|Forces|Animals and|Speaking|Main idea|Fact vs|Vowel |Verb forms|Sentence structure|Homeland |Community|Citizenship|Geography|Values|Maps|Map |Directions|Places|Regions|History|word-based|fill in|prepositions|listening|spelling|verb tense|irregular|recall|story|mixed operations|vertical form|regrouping|once|basic level|regular level|advanced level|logical sequence|homeland studies|3D shapes)/i.test(s)
      ) {
        enish.push(prefix + k + "=" + s);
      }
    }
  }
}
walkAll(labels);
const uniqEn = [...new Set(enish)];
(uniqEn.length === 0 ? pass : fails).push(`diagnosticEn=${uniqEn.length}:${uniqEn.slice(0, 8).join(";")}`);

// 5) Word meanings
const { WORD_LISTS } = await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-lists.js")).href);
const { WORD_MEANINGS_DE_DE } = await import(
  pathToFileURL(path.join(ROOT, "data/english-questions/word-meanings/de-DE.js")).href
);
let authority = 0,
  present = 0,
  missing = [],
  orphans = [];
for (const [cat, words] of Object.entries(WORD_LISTS)) {
  for (const id of Object.keys(words || {})) {
    authority++;
    if (WORD_MEANINGS_DE_DE[cat]?.[id]) present++;
    else missing.push(cat + "." + id);
  }
}
for (const [cat, words] of Object.entries(WORD_MEANINGS_DE_DE)) {
  for (const id of Object.keys(words || {})) {
    if (!WORD_LISTS[cat]?.[id]) orphans.push(cat + "." + id);
  }
}
(authority === 745 && present === 745 && missing.length === 0 && orphans.length === 0
  ? pass
  : fails
).push(`wm=${present}/${authority} missing=${missing.length} orphans=${orphans.length}`);
(WORD_MEANINGS_DE_DE.school?.grade === "die Klasse" ? pass : fails).push(
  `school.grade=${WORD_MEANINGS_DE_DE.school?.grade}`
);
const sightKeys = ["the", "and", "is", "it", "me", "we", "you", "my", "at"];
const sightOk = sightKeys.every((k) => WORD_MEANINGS_DE_DE.sight?.[k]);
(sightOk ? pass : fails).push(`sight=${sightOk}`);

// 6) Geometry circle_perimeter
const geo = fs.readFileSync(path.join(ROOT, "utils/learning-content-de-DE/geometry.js"), "utf8");
(geo.includes("Umfang des Kreises") ? pass : fails).push("circle_perimeter");

// 7) Parent du leftovers in flagged keys
const parentDu = [];
for (const [k, v] of Object.entries(ui.parent || {})) {
  if (typeof v === "string" && /\b(Du |du |dein |deine |deinem |deines |wähle |Wähle )\b/.test(v)) {
    parentDu.push("parent." + k);
  }
}
for (const key of ["hubSubtitle", "hubIntro", "createHint", "recommendationsEmpty", "recommendationsHint", "readyEmptyText", "mixedTopicsHint", "mixedTopicsEmptyError", "writingCreateHint"]) {
  const v = ws[key];
  if (typeof v === "string" && /\b(Du |du |dein |deine |deinem |deines |wähle |Wähle )\b/.test(v)) parentDu.push("ws." + key);
}
if (/\b(Wähle |wähle |du |dein)/.test(seo.learningDescription || "")) parentDu.push("seo.learningDescription");
if (/\b(Wähle |wähle |du )/i.test(school.portal?.createStudentClassHint || "")) parentDu.push("school.createStudentClassHint");
(parentDu.length === 0 ? pass : fails).push(`parentDu=${parentDu.join(",") || 0}`);

console.log(
  JSON.stringify(
    {
      pass: pass.length,
      fail: fails.length,
      fails,
      mash,
      heb,
      broken,
      authority,
      present,
      missing: missing.length,
      orphans: orphans.length,
      schoolGrade: WORD_MEANINGS_DE_DE.school?.grade,
      questionsAnswered: learning.questionsAnswered,
      helpCenter: ui.nav.helpCenter,
      ctaParents: ui.home.ctaParents,
      diagnosticEn: uniqEn.length,
      parentDu: parentDu.length,
    },
    null,
    2
  )
);
if (fails.length) process.exitCode = 1;
