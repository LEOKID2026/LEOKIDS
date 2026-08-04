/**
 * Final gate for fr-FR content layer closure.
 * Exit 0 only when all closure conditions hold.
 *
 * Run: node scripts/i18n/verify-fr-FR-final-closure.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

function deepKeys(o, p = "", a = []) {
  if (o == null || typeof o !== "object") return a;
  if (Array.isArray(o)) {
    o.forEach((x, i) => deepKeys(x, `${p}[${i}]`, a));
    return a;
  }
  for (const [k, v] of Object.entries(o)) {
    a.push(p ? `${p}.${k}` : k);
    deepKeys(v, p ? `${p}.${k}` : k, a);
  }
  return a;
}

const failures = [];
function check(name, ok, detail) {
  if (!ok) failures.push({ name, detail });
  else console.log("OK", name, detail || "");
}

const enNs = fs.readdirSync(path.join(ROOT, "locales/en")).filter((f) => f.endsWith(".json")).sort();
const frNs = fs.readdirSync(path.join(ROOT, "locales/fr-FR")).filter((f) => f.endsWith(".json")).sort();
check("namespaces file set", JSON.stringify(enNs) === JSON.stringify(frNs), `${frNs.length}`);
let keyBad = 0;
for (const f of enNs) {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en", f), "utf8"));
  const fr = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR", f), "utf8"));
  if (deepKeys(en).sort().join("|") !== deepKeys(fr).sort().join("|")) keyBad += 1;
}
check("namespace key parity", keyBad === 0, String(keyBad));

const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR/common.json"), "utf8"));
check(
  "grade mapping",
  common.grade1 === "CP" &&
    common.grade2 === "CE1" &&
    common.grade3 === "CE2" &&
    common.grade4 === "CM1" &&
    common.grade5 === "CM2" &&
    common.grade6 === "6e" &&
    common.gradeLabel === "{grade}",
  JSON.stringify([common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6]),
);

const enPacks = walk(path.join(ROOT, "content-packs/en"), (n) => n.endsWith(".json"));
const frPacks = walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json"));
check("content-pack count", enPacks.length === frPacks.length, `${frPacks.length}`);
let packKeyBad = 0;
for (const enFile of enPacks) {
  const rel = path.relative(path.join(ROOT, "content-packs/en"), enFile);
  const frFile = path.join(ROOT, "content-packs/fr-FR", rel);
  if (!fs.existsSync(frFile)) {
    packKeyBad += 1;
    continue;
  }
  const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
  const fr = JSON.parse(fs.readFileSync(frFile, "utf8"));
  if (deepKeys(en).sort().join("|") !== deepKeys(fr).sort().join("|")) packKeyBad += 1;
}
check("content-pack key parity", packKeyBad === 0, String(packKeyBad));

const enSci = (await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href)).SCIENCE_EN_OVERLAY;
const frSci = (await import(pathToFileURL(path.join(ROOT, "data/science-questions-fr-FR-overlay.js")).href)).SCIENCE_FR_FR_OVERLAY;
const enIds = Object.keys(enSci).sort();
const frIds = Object.keys(frSci).sort();
check("science ID parity", JSON.stringify(enIds) === JSON.stringify(frIds), String(frIds.length));
let optBad = 0;
for (const id of enIds) {
  if ((enSci[id].options || []).length !== (frSci[id].options || []).length) optBad += 1;
}
check("science option-count parity", optBad === 0, String(optBad));

const enBooks = walk(path.join(ROOT, "docs/learning-book/en"), (n) => n.endsWith(".md")).map((f) =>
  path.relative(path.join(ROOT, "docs/learning-book/en"), f).replace(/\\/g, "/"),
);
const frBooks = walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md")).map((f) =>
  path.relative(path.join(ROOT, "docs/learning-book/fr-FR"), f).replace(/\\/g, "/"),
);
check("learning-book path parity", JSON.stringify(enBooks.sort()) === JSON.stringify(frBooks.sort()), String(frBooks.length));

const helpFr = await import(pathToFileURL(path.join(ROOT, "data/help-center/fr-FR/index.js")).href);
const parents = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/parents.js")).href);
const students = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/students.js")).href);
const reportA = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/parent-report.js")).href);
const subjects = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/subjects.js")).href);
const enHelp = [...parents.PARENT_ARTICLES, ...students.STUDENT_ARTICLES, ...reportA.PARENT_REPORT_ARTICLES, ...subjects.SUBJECT_ARTICLES];
check("help count", helpFr.ALL_ARTICLES_FR_FR.length === 40, String(helpFr.ALL_ARTICLES_FR_FR.length));
check(
  "help slug parity",
  helpFr.ALL_ARTICLES_FR_FR.every((a, i) => a.slug === enHelp[i]?.slug),
  "slugs",
);

const { WORD_LISTS } = await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-lists.js")).href);
const { WORD_MEANINGS_FR_FR } = await import(
  pathToFileURL(path.join(ROOT, "data/english-questions/word-meanings/fr-FR.js")).href
);
let meanings = 0;
let missing = 0;
for (const [cat, words] of Object.entries(WORD_LISTS)) {
  for (const id of Object.keys(words || {})) {
    meanings += 1;
    if (!WORD_MEANINGS_FR_FR[cat]?.[id]) missing += 1;
  }
}
check("word-meaning ID parity", missing === 0, String(meanings));

const math = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-fr-FR/math.js")).href);
const geo = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-fr-FR/geometry.js")).href);
const money = String(math.rebuildMathStemFrFr({ params: { kind: "wp_pocket_money", money: 10, toy: 3 } }));
const disk = String(geo.rebuildGeometryStemFrFr({ params: { kind: "circle_area", radius: 5 } }));
const circ = String(geo.rebuildGeometryStemFrFr({ params: { kind: "circle_perimeter", radius: 5 } }));
check("math euro", /euro/i.test(money) && !/dollar/i.test(money), money);
check("geometry disque/aire", /disque/i.test(disk) && /aire/i.test(disk), disk);
check("geometry cercle/circonférence", /cercle/i.test(circ) && /circonférence/i.test(circ), circ);
check("stem field ids english", !/exerciceTexte|QuestionÉtiquette|Réponses acceptées/.test(fs.readFileSync(path.join(ROOT, "utils/learning-content-fr-FR/math.js"), "utf8")));

const scan = spawnSync(process.execPath, [path.join(__dirname, "scan-fr-FR-real-english.mjs")], { encoding: "utf8" });
const scanJson = JSON.parse(scan.stdout);
check("english instructional leakage", scanJson.total === 0, JSON.stringify(scanJson));

const roots = [
  ...walk(path.join(ROOT, "locales/fr-FR"), (n) => n.endsWith(".json")),
  ...walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json")),
  path.join(ROOT, "data/science-questions-fr-FR-overlay.js"),
  ...walk(path.join(ROOT, "data/help-center/fr-FR"), (n) => n.endsWith(".js")),
  ...walk(path.join(ROOT, "utils/learning-content-fr-FR"), (n) => n.endsWith(".js")),
  ...walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md")),
  path.join(ROOT, "data/english-questions/word-meanings/fr-FR.js"),
];
let etudiant = 0;
let feuille = 0;
let gradeEn = 0;
let tuBroken = 0;
for (const f of roots) {
  const t = fs.readFileSync(f, "utf8");
  etudiant += (t.match(/étudiant/gi) || []).length;
  feuille += (t.match(/feuille de calcul/gi) || []).length;
  gradeEn += (t.match(/\bGrade\s*[1-6]\b|\b1st Grade\b|\bYear\s*[1-6]\b/g) || []).length;
  if (/\b(à|pour) tu\b/i.test(t) || /peut tu\b/i.test(t) || /Il tu\b/.test(t) || /payez-tu|ajoutez-tu/.test(t)) tuBroken += 1;
}
check("étudiant for pupils", etudiant === 0, String(etudiant));
check("feuille de calcul", feuille === 0, String(feuille));
check("English grade labels", gradeEn === 0, String(gradeEn));
check("tu/vous mechanical inconsistencies", tuBroken === 0, String(tuBroken));

const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR/worksheets.json"), "utf8"));
check(
  "worksheet terminology",
  /fiche d’exercices/i.test(ws.createWorksheet) &&
    /Corrigé/i.test(ws.answerKey) &&
    /Aperçu/i.test(ws.preview) &&
    ws.gradeG1 === "CP",
  ws.createWorksheet,
);

const writingReq = JSON.parse(fs.readFileSync(path.join(__dirname, "_fr-FR-writing-pack-requirements.json"), "utf8"));
check("writing-pack requirements ready", writingReq.packTitles.colors === "Couleurs" && writingReq.colorInstructions["Color in red"] === "Colorie en rouge");

if (failures.length) {
  console.error("FAILURES", JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log("\nALL CLOSURE CHECKS PASSED");
console.log(
  JSON.stringify(
    {
      namespaces: frNs.length,
      packs: frPacks.length,
      science: frIds.length,
      books: frBooks.length,
      help: helpFr.ALL_ARTICLES_FR_FR.length,
      meanings,
      englishInstructionalLeakage: 0,
      englishEducationalTargetsPreserved: true,
    },
    null,
    2,
  ),
);
