/**
 * Phase 2B structural parity + terminology audit for id-ID learning/worksheets/games.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const NS = ["learning", "worksheets", "games"];
const LOCALE = "id-ID";

function walkLeaves(node, prefix = [], out = []) {
  if (node === null || typeof node !== "object") {
    out.push({ path: prefix.join("."), value: node });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => walkLeaves(v, prefix.concat(String(i)), out));
    return out;
  }
  for (const k of Object.keys(node)) walkLeaves(node[k], prefix.concat(k), out);
  return out;
}

function keySet(node, prefix = [], out = new Set()) {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    out.add(prefix.join("."));
    return out;
  }
  const keys = Object.keys(node);
  if (keys.length === 0) out.add(prefix.join("."));
  for (const k of keys) keySet(node[k], prefix.concat(k), out);
  return out;
}

function placeholders(s) {
  const simple = [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  const icu = [...String(s).matchAll(/\{(\w+)\s*,/g)].map((m) => m[1]);
  const mustache = [...String(s).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  return [...new Set([...simple, ...icu, ...mustache])].sort();
}

/** Leaves that intentionally keep English learning content / brand / formulas. */
const INTENTIONAL_ENGLISH_PATHS = new Set([
  "worksheets.writingCustomWordsPlaceholder",
  "learning.english.steps.grammarAmIsAre",
  "learning.english.steps.grammarCheck",
  "learning.english.mistakes.iAmNotIs",
  "learning.english.mistakes.amOnlyWithI",
  "learning.english.mistakes.checkGrammarLearning",
  "learning.english.mistakes.checkGrammar",
  "games.arcadeGames.fourline.title",
  "games.arcadeGames.ludo.title",
  "games.arcadeGames.bingo.title",
]);

const LATIN_UI_HINT =
  /\b(Choose|Try again|Great job|Continue|Next|Check your answer|Grade |Student|Worksheet|Practice|Game |Subject|Score|Play now|Back to|Loading|Error|Submit|Cancel|Save|Delete|Select |Create |Print|Download|Preview|Answer key)\b/i;

const report = {
  namespaces: {},
  totals: {
    enLeaves: 0,
    idLeaves: 0,
    missingKeys: 0,
    extraKeys: 0,
    emptyLeaves: 0,
    placeholderMismatches: 0,
  },
  intentionalEnglish: [],
  unexplainedEnglishUi: [],
  gradeDefects: [],
  studentDefects: [],
  gameDefects: [],
  worksheetDefects: [],
  registerDefects: [],
};

for (const ns of NS) {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en", `${ns}.json`), "utf8"));
  const id = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, `${ns}.json`), "utf8"));
  const enKeys = keySet(en);
  const idKeys = keySet(id);
  const missing = [...enKeys].filter((k) => !idKeys.has(k));
  const extra = [...idKeys].filter((k) => !enKeys.has(k));
  const enLeaves = walkLeaves(en);
  const idLeaves = walkLeaves(id);
  const idByPath = new Map(idLeaves.map((l) => [l.path, l.value]));
  const empty = [];
  const phMismatch = [];

  for (const leaf of enLeaves) {
    const v = idByPath.get(leaf.path);
    if (typeof leaf.value === "string") {
      if (typeof v !== "string" || v.trim() === "") empty.push(leaf.path);
      else {
        const pe = placeholders(leaf.value);
        const pi = placeholders(v);
        if (JSON.stringify(pe) !== JSON.stringify(pi)) {
          phMismatch.push({ path: leaf.path, en: pe, id: pi });
        }
      }
    }
  }

  report.namespaces[ns] = {
    enLeaves: enLeaves.length,
    idLeaves: idLeaves.length,
    missingKeys: missing.length,
    extraKeys: extra.length,
    emptyLeaves: empty.length,
    placeholderMismatches: phMismatch.length,
    missingSample: missing.slice(0, 10),
    extraSample: extra.slice(0, 10),
    emptySample: empty.slice(0, 10),
    phSample: phMismatch.slice(0, 10),
  };
  report.totals.enLeaves += enLeaves.length;
  report.totals.idLeaves += idLeaves.length;
  report.totals.missingKeys += missing.length;
  report.totals.extraKeys += extra.length;
  report.totals.emptyLeaves += empty.length;
  report.totals.placeholderMismatches += phMismatch.length;

  for (const leaf of idLeaves) {
    if (typeof leaf.value !== "string") continue;
    const full = `${ns}.${leaf.path}`;
    const v = leaf.value;

    // Terminology
    if (/\b(siswa|peserta didik)\b/i.test(v)) report.studentDefects.push(full);
    if (/\bGrade\s*[1-6]\b/.test(v) || /\bFase\s*[ABC]\b/i.test(v)) report.gradeDefects.push(full);
    if (/\b(permainan|games?)\b/i.test(v) && !/game over/i.test(v) && !INTENTIONAL_ENGLISH_PATHS.has(full)) {
      // allow "Game over" briefly; flag other game/permainan
      if (/\b(permainan)\b/i.test(v) || /\bgames?\b/i.test(v)) report.gameDefects.push(`${full}: ${v}`);
    }
    if (/\b(worksheet|siswa)\b/i.test(v)) report.worksheetDefects.push(`${full}: ${v}`);
    if (/\bAnda\b/.test(v)) report.registerDefects.push(`${full}: ${v}`);

    // English retention accounting
    const hasLatinWords = /[A-Za-z]{3,}/.test(v);
    if (!hasLatinWords) continue;

    const isIntentional =
      INTENTIONAL_ENGLISH_PATHS.has(full) ||
      /^[A-Za-z0-9 ×÷π²³\-+/=().,%√\s]+$/.test(v) || // formulas / pure math
      /OpenCV|LEO KIDS|Leo Kids|Leo|Anime|Bingo|Ludo|Connect Four|Script|Timer|XP|AI|PNG|PDF|A4|JPG|Chrome|Edge|Safari|Pythagoras|OpenCV/.test(
        v
      ) ||
      /\b(I|You|We|They|He|She|It|am|is|are)\b/.test(v) ||
      full.includes("english.steps.") ||
      full.includes("english.mistakes.") ||
      full.endsWith("writingCustomWordsPlaceholder") ||
      full.includes("formula") ||
      /Game over!/.test(v);

    if (isIntentional && (INTENTIONAL_ENGLISH_PATHS.has(full) || /\b(I|am|is|are)\b/.test(v) || full.includes("writingCustomWordsPlaceholder"))) {
      report.intentionalEnglish.push(full);
    } else if (LATIN_UI_HINT.test(v) && !isIntentional) {
      report.unexplainedEnglishUi.push(`${full}: ${v}`);
    } else if (
      /\b(the|and|your|please|select|choose|click|try again|great|correct|incorrect|question|answer|score|level|grade)\b/i.test(
        v
      ) &&
      !isIntentional &&
      !/OpenCV|LEO|Leo|Anime|Bingo|Ludo|Connect Four|Script|Timer|XP|PDF|PNG|A4|JPG|Chrome|Edge|Safari|Pythagoras/.test(v)
    ) {
      report.unexplainedEnglishUi.push(`${full}: ${v}`);
    }
  }
}

// Deduplicate intentional list uniqueness
report.intentionalEnglish = [...new Set(report.intentionalEnglish)].sort();
report.unexplainedEnglishUi = [...new Set(report.unexplainedEnglishUi)].sort();
report.gameDefects = [...new Set(report.gameDefects)].sort();

const outPath = path.join(ROOT, "artifacts/id-ID-phase2b/parity-audit.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify(report.totals, null, 2));
console.log("intentionalEnglish", report.intentionalEnglish.length);
console.log("unexplainedEnglishUi", report.unexplainedEnglishUi.length, report.unexplainedEnglishUi.slice(0, 30));
console.log("gradeDefects", report.gradeDefects);
console.log("studentDefects", report.studentDefects);
console.log("gameDefects", report.gameDefects.slice(0, 40));
console.log("worksheetDefects", report.worksheetDefects);
console.log("registerDefects", report.registerDefects);
console.log("wrote", outPath);
