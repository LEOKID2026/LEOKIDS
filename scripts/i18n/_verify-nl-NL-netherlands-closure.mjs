/**
 * Targeted Netherlands closure verification (nl-NL only).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function walkFixed(d, pred, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkFixed(p, pred, a);
    else if (pred(p)) a.push(p);
  }
  return a;
}

const report = { failures: [] };
function fail(msg, extra) {
  report.failures.push({ msg, extra });
}

const learning = JSON.parse(fs.readFileSync("locales/nl-NL/learning.json", "utf8"));
const common = JSON.parse(fs.readFileSync("locales/nl-NL/common.json", "utf8"));
const ui = JSON.parse(fs.readFileSync("locales/nl-NL/ui.json", "utf8"));
const worksheets = JSON.parse(fs.readFileSync("locales/nl-NL/worksheets.json", "utf8"));
const school = JSON.parse(fs.readFileSync("locales/nl-NL/school.json", "utf8"));
const seo = JSON.parse(fs.readFileSync("locales/nl-NL/seo.json", "utf8"));

// 1 grade mapping
if (learning.master?.gradeTitle !== "{grade}") fail("gradeTitle must be {grade}", learning.master?.gradeTitle);
if (common.gradeLabel !== "{grade}") fail("gradeLabel must be {grade}", common.gradeLabel);
const gmap = [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6];
const expect = ["Groep 3", "Groep 4", "Groep 5", "Groep 6", "Groep 7", "Groep 8"];
if (JSON.stringify(gmap) !== JSON.stringify(expect)) fail("discrete grade labels", gmap);
if (gmap.some((g) => /^Groep\s*[12]$/.test(g))) fail("Groep 1/2 discrete label");
if (/\{groep\}/.test(JSON.stringify(learning) + JSON.stringify(common))) fail("{groep} placeholder");

// 2 CTAs
if (ui.home?.ctaKids !== "Ik ben een leerling") fail("ctaKids", ui.home?.ctaKids);
if (ui.home?.ctaParents !== "Ik ben ouder") fail("ctaParents", ui.home?.ctaParents);
if (ui.home?.ctaTeachers !== "Ik ben leerkracht") fail("ctaTeachers", ui.home?.ctaTeachers);
if (/I'm /.test(JSON.stringify(ui))) fail("I'm remains in ui");

// 3 Helpcentrum
if (ui.nav?.helpCenter !== "Helpcentrum") fail("helpCenter", ui.nav?.helpCenter);

// 4 ICU
if (!/other \{# vragen\}/.test(learning.questionsAnswered || "")) fail("ICU other", learning.questionsAnswered);
if (/\bandere\b/.test(learning.questionsAnswered || "")) fail("ICU andere remains");

// 5 access gates (nested)
if (ui.student?.accessGateSignInPrompt !== "Log in als leerling om verder te gaan") {
  fail("accessGate", ui.student?.accessGateSignInPrompt);
}
if (ui.parent?.errors?.signInAgainParent !== "Log opnieuw in als ouder.") {
  fail("signInAgainParent", ui.parent?.errors?.signInAgainParent);
}

// 6 cijfer-as-grade
const gradeCijfer =
  /\bKies een cijfer\b|\bonderwerp\/cijfer\b|\bonderwerp, cijfer\b|het cijfer, de moeilijk|ander cijfer|je cijfer bij|dit cijfer te selecteren|het cijfer wijzigt|Een cijfer hoger/;
for (const f of walkFixed("locales/nl-NL", (p) => p.endsWith(".json"))) {
  const t = fs.readFileSync(f, "utf8");
  if (gradeCijfer.test(t)) fail("cijfer-as-grade", f);
}
for (const f of [
  "content-packs/nl-NL/demo/ui.json",
  "content-packs/nl-NL/learning/burn-down-index.json",
  "content-packs/nl-NL/learning/burn-down/utils__topic-next-step-engine.json",
  "content-packs/nl-NL/global-burn-down/burn-down-index.json",
  "content-packs/nl-NL/global-burn-down/lib__learning__subject-permissions__subject-access.server.json",
]) {
  if (fs.existsSync(f) && gradeCijfer.test(fs.readFileSync(f, "utf8"))) fail("cijfer-as-grade pack", f);
}

// 7 EN instructional leakage
const EN_INSTR =
  /\b(I'm |Helpen center|Niet quite|Volgende question|learning hub|Manage leerlingen|Children op account|Sign in naar|Step 1: Understand|Alstublieft sign|Alstublieft enter|Please sign|Welcome to|How do I|Try again|Click here|Show de |Read de |Find de |Add de |Line up the |What do we do|How do we |doe we solve|Your answer:|Controleren answer|Enter de |login \/ sign up|Unread messages|Go naar|Messages van|Selecteered|Failed naar|Pick a topic|Try it uwself|Wat we learn)\b/;
let enHits = 0;
const enSamples = [];
for (const f of [
  ...walkFixed("locales/nl-NL", (p) => p.endsWith(".json")),
  ...walkFixed("content-packs/nl-NL", (p) => p.endsWith(".json")),
]) {
  const rel = f.replace(/\\/g, "/");
  if (rel.includes("/books/english") || rel.includes("english-page-skills")) continue;
  const t = fs.readFileSync(f, "utf8");
  if (EN_INSTR.test(t)) {
    enHits++;
    if (enSamples.length < 15) {
      const line = t.split(/\n/).find((l) => EN_INSTR.test(l));
      enSamples.push({ f: rel, line: (line || "").slice(0, 120) });
    }
  }
}
if (enHits) fail("EN instructional leakage", { enHits, enSamples });

// 8 je/u
const MIX = /\b(je|jij|jouw)\b.*\b(u|uw)\b|\b(u|uw)\b.*\b(je|jij|jouw)\b/i;
let mix = 0;
const mixSamples = [];
for (const f of walkFixed("locales/nl-NL", (p) => p.endsWith(".json"))) {
  for (const line of fs.readFileSync(f, "utf8").split(/\n/)) {
    if (MIX.test(line)) {
      mix++;
      if (mixSamples.length < 10) mixSamples.push({ f, line: line.slice(0, 140) });
    }
  }
}
if (mix) fail("je/u mix", { mix, mixSamples });

// 9 word meanings
const { WORD_LISTS } = await import(pathToFileURL(path.resolve("data/english-questions/word-lists.js")).href);
const { WORD_MEANINGS_NL_NL } = await import(
  pathToFileURL(path.resolve("data/english-questions/word-meanings/nl-NL.js")).href + "?t=" + Date.now()
);
let missing = 0;
let orphans = 0;
let total = 0;
for (const cat of Object.keys(WORD_LISTS)) {
  const list = WORD_LISTS[cat] || {};
  const mean = WORD_MEANINGS_NL_NL[cat] || {};
  for (const id of Object.keys(list)) {
    total++;
    if (!(id in mean)) missing++;
  }
  for (const id of Object.keys(mean || {})) {
    if (!(id in list)) orphans++;
  }
}
if (total !== 745 || missing || orphans) fail("word meanings", { total, missing, orphans });
if (!WORD_MEANINGS_NL_NL.sight) fail("missing sight category");

// 10 orphans
if ("writingInstructionTrace" in worksheets || "writingInstructionColor" in worksheets) {
  fail("orphan writing keys still present");
}

// 11 phrasing
if (school.communication?.audienceGradeParents !== "Ouders van deze groep") {
  fail("audienceGradeParents", school.communication?.audienceGradeParents);
}
if (/een optionele antwoorden/.test(JSON.stringify(worksheets))) fail("optionele antwoorden");
if (/elementaire leerlingen/.test(JSON.stringify(seo))) fail("seo elementary");
if (!/basisschool/.test(seo.homeTitle || "")) fail("seo basisschool missing", seo.homeTitle);

// Rekenen / Natuur en techniek
if (learning.subjects?.math !== "Rekenen") fail("Rekenen", learning.subjects?.math);
if (learning.subjects?.science !== "Natuur en techniek") fail("Science authority", learning.subjects?.science);
if (/\bWiskunde\b/.test(JSON.stringify(learning) + JSON.stringify(common) + JSON.stringify(ui))) {
  fail("Wiskunde present");
}

// Groep 1-2 display in locales
let g12 = 0;
for (const f of walkFixed("locales/nl-NL", (p) => p.endsWith(".json"))) {
  if (/\bGroep\s*[12]\b/.test(fs.readFileSync(f, "utf8"))) g12++;
}
if (g12) fail("Groep 1/2 in locales", g12);

// Books instructional chrome (non-English subjects)
const BOOK_EN =
  /\b(Today we will|Today we'll|What are we learning\?|Try it yourself|Simple explanation|Let's practice|On the next page we will|I'm |Helpen center)\b/;
let bookLeak = 0;
const bookSamples = [];
for (const f of walkFixed("docs/learning-book/nl-NL", (p) => p.endsWith(".md"))) {
  if (f.includes(`${path.sep}english${path.sep}`)) continue;
  if (f.endsWith("README.md")) continue;
  const t = fs.readFileSync(f, "utf8");
  if (BOOK_EN.test(t)) {
    bookLeak++;
    if (bookSamples.length < 10) {
      const line = t.split(/\n/).find((l) => BOOK_EN.test(l));
      bookSamples.push({ f: f.replace(/\\/g, "/"), line: (line || "").slice(0, 120) });
    }
  }
}
if (bookLeak) fail("books EN leak", { bookLeak, bookSamples });

// Science EN
const { SCIENCE_NL_NL_OVERLAY: NL } = await import(
  pathToFileURL(path.resolve("data/science-questions-nl-NL-overlay.js")).href + "?t=" + Date.now()
);
const CLEAR =
  /\b(What is|What are|What do|Which |How many|How do|If your|Today we|Please |Welcome )\b/;
let sciLeak = 0;
for (const n of Object.values(NL)) {
  for (const s of [n.stem, n.explanation, ...(n.options || []), ...(n.theoryLines || [])]) {
    if (CLEAR.test(String(s || ""))) {
      sciLeak++;
      break;
    }
  }
}
if (sciLeak) fail("science EN leak", sciLeak);

// ICU andere across layer
let icuAndere = 0;
for (const f of [
  ...walkFixed("locales/nl-NL", (p) => p.endsWith(".json")),
  ...walkFixed("content-packs/nl-NL", (p) => p.endsWith(".json")),
]) {
  if (/plural,[^\n]*\bandere\b/.test(fs.readFileSync(f, "utf8"))) icuAndere++;
}
if (icuAndere) fail("ICU andere files", icuAndere);

// login labels
if (ui.nav?.loginParent !== "Inloggen als ouder") fail("loginParent", ui.nav?.loginParent);
if (ui.nav?.loginStudent !== "Inloggen als leerling") fail("loginStudent", ui.nav?.loginStudent);

report.ok = report.failures.length === 0;
report.summary = {
  gradeTitle: learning.master.gradeTitle,
  gradeLabel: common.gradeLabel,
  grades: gmap,
  helpCenter: ui.nav.helpCenter,
  cta: { kids: ui.home.ctaKids, parents: ui.home.ctaParents, teachers: ui.home.ctaTeachers },
  accessGate: ui.student.accessGateSignInPrompt,
  signInAgainParent: ui.parent?.errors?.signInAgainParent,
  questionsAnswered: learning.questionsAnswered,
  wordMeanings: { total, missing, orphans, sight: Object.keys(WORD_MEANINGS_NL_NL.sight || {}).length },
  orphansRemoved: !("writingInstructionTrace" in worksheets),
  audienceGradeParents: school.communication?.audienceGradeParents,
  scienceEnLeak: sciLeak,
  booksEnLeak: bookLeak,
  jeUmix: mix,
  enInstrFiles: enHits,
  rekenen: learning.subjects?.math,
  science: learning.subjects?.science,
};

fs.writeFileSync("scripts/i18n/_nl-NL-netherlands-closure.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
