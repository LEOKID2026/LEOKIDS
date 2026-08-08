/**
 * Phase 6D focused validation for id-ID word meanings (content-only).
 * Run: node artifacts/id-ID-phase6d/validate-id-ID-word-meanings.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { WORD_MEANINGS_EN } from "../../data/english-questions/word-meanings/en.js";
import { WORD_MEANINGS_ID_ID as ID } from "../../data/english-questions/word-meanings/id-ID.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Loanwords / identical forms commonly used as Indonesian. */
const INTENTIONAL_SAME = new Set([
  "zebra",
  "penguin",
  "pizza",
  "yoga",
  "hotel",
  "wifi",
  "bluetooth",
  "internet",
  "email",
  "video",
  "robot",
  "tablet",
  "laptop",
  "pasta",
  "flu",
  "judo",
  "karate",
  "golf",
  "bus",
  "oven",
  "toilet",
  "museum",
  "supermarket",
  "bank",
  "cafe",
  "piano",
  "film",
  "tsunami",
  "planet",
  "program",
  "printer",
  "folder",
  "sofa",
  "salad",
]);

function countPack(pack) {
  let n = 0;
  for (const map of Object.values(pack || {})) n += Object.keys(map || {}).length;
  return n;
}

function main() {
  const canonKeys = [];
  for (const [list, map] of Object.entries(WORD_LISTS)) {
    for (const lemma of Object.keys(map)) canonKeys.push(`${list}|${lemma}`);
  }
  const idKeys = [];
  const empty = [];
  const dups = [];
  const seen = new Set();
  const untranslated = [];

  for (const [list, map] of Object.entries(ID || {})) {
    for (const [lemma, meaning] of Object.entries(map || {})) {
      const k = `${list}|${lemma}`;
      idKeys.push(k);
      if (seen.has(k)) dups.push(k);
      else seen.add(k);
      const mm = String(meaning ?? "").trim();
      if (!mm) empty.push(k);
      const sameAsLemma = mm === lemma || mm === lemma.replace(/_/g, " ");
      if (sameAsLemma && !INTENTIONAL_SAME.has(lemma)) {
        untranslated.push({ key: k, meaning: mm });
      }
    }
  }

  const canonSet = new Set(canonKeys);
  const idSet = new Set(idKeys);
  const missing = [...canonSet].filter((k) => !idSet.has(k));
  const extra = [...idSet].filter((k) => !canonSet.has(k));

  const spot = {
    "animals.dog": ID.animals?.dog,
    "food.apple": ID.food?.apple,
    "colors.orange": ID.colors?.orange,
    "food.orange": ID.food?.orange,
    "animals.mouse": ID.animals?.mouse,
    "technology.mouse": ID.technology?.mouse,
    "weather.cold": ID.weather?.cold,
    "health.cold": ID.health?.cold,
    "sight.the": ID.sight?.the,
    "sight.and": ID.sight?.and,
    "emotions.happy": ID.emotions?.happy,
    "actions.run": ID.actions?.run,
    "global_issues.climate_change": ID.global_issues?.climate_change,
    "school.teacher": ID.school?.teacher,
    "technology.speaker": ID.technology?.speaker,
    "school.stapler": ID.school?.stapler,
    "history.modern": ID.history?.modern,
  };

  const report = {
    wordListsLists: Object.keys(WORD_LISTS).length,
    wordListsEntries: canonKeys.length,
    enLists: Object.keys(WORD_MEANINGS_EN).length,
    enEntries: countPack(WORD_MEANINGS_EN),
    idLists: Object.keys(ID || {}).length,
    idEntries: idKeys.length,
    missingLemmas: missing.length,
    extraLemmas: extra.length,
    duplicateLemmas: dups.length,
    emptyMeanings: empty.length,
    untranslatedEnglishDefinitions: untranslated.length,
    intentionalLoanwordSameAsLemma: INTENTIONAL_SAME.size,
    missing,
    extra,
    dups,
    empty,
    untranslated,
    spot,
  };

  fs.writeFileSync(
    path.join(__dirname, "validation-final.json"),
    JSON.stringify(report, null, 2),
    "utf8"
  );

  const pass =
    missing.length === 0 &&
    extra.length === 0 &&
    dups.length === 0 &&
    empty.length === 0 &&
    untranslated.length === 0 &&
    idKeys.length === canonKeys.length;

  console.log(
    JSON.stringify(
      {
        pass,
        wordListsEntries: report.wordListsEntries,
        idEntries: report.idEntries,
        missingLemmas: report.missingLemmas,
        extraLemmas: report.extraLemmas,
        duplicateLemmas: report.duplicateLemmas,
        emptyMeanings: report.emptyMeanings,
        untranslatedEnglishDefinitions: report.untranslatedEnglishDefinitions,
        spot,
      },
      null,
      2
    )
  );
  process.exit(pass ? 0 : 1);
}

main();
