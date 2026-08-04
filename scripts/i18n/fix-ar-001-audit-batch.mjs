import fs from "fs";
import path from "path";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, j) {
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

const hudKeysEn = {
  score: "Score",
  sorted: "Sorted",
  lives: "Lives",
  time: "Time",
  sec: "sec",
  score_colon: "Score:",
  level: "Level",
  coins: "Coins",
  times_up_case_open: "Time's up! The case stays open.",
  times_up_train_station: "Time's up! The train stayed at the station.",
  times_up_solution_prefix: "Time's up! {solution}",
  times_up_bakery_solution: "Time's up. Here's the solution:\n{solution}",
  end_score: "⭐ Score: {score}",
};
const hudKeysAr = {
  score: "النقاط",
  sorted: "تم الفرز",
  lives: "المحاولات",
  time: "الوقت",
  sec: "ث",
  score_colon: "النقاط:",
  level: "المستوى",
  coins: "العملات",
  times_up_case_open: "انتهى الوقت! تبقى القضية مفتوحة.",
  times_up_train_station: "انتهى الوقت! بقي القطار في المحطة.",
  times_up_solution_prefix: "انتهى الوقت! {solution}",
  times_up_bakery_solution: "انتهى الوقت. إليك الحل:\n{solution}",
  end_score: "⭐ النقاط: {score}",
};

for (const [locale, keys] of [
  ["en", hudKeysEn],
  ["ar-001", hudKeysAr],
]) {
  const idxPath = `content-packs/${locale}/games/burn-down-index.json`;
  const idx = readJson(idxPath);
  const sortSlug = "components__solo-games__engines__MleoSortShapesEngine";
  idx[sortSlug] = {
    ...(idx[sortSlug] || {}),
    score: keys.score,
    sorted: keys.sorted,
    lives: keys.lives,
    time: keys.time,
    sec: keys.sec,
  };
  idx.games__shared_runtime_hud = { ...(idx.games__shared_runtime_hud || {}), ...keys };

  const gameSlugs = {
    "components__educational-games__leo-word-detective__LeoWordDetectiveGame": {
      times_up: keys.times_up_case_open,
      end_score: keys.end_score,
    },
    "components__educational-games__leo-word-train__LeoWordTrainGame": {
      times_up: keys.times_up_train_station,
      end_score: keys.end_score,
    },
    "components__educational-games__leo-bakery__LeoBakeryGame": {
      times_up_solution: keys.times_up_bakery_solution,
      end_score: keys.end_score,
    },
    "components__educational-games__leo-gifts__LeoGiftsGame": {
      times_up_solution: keys.times_up_solution_prefix,
      end_score: keys.end_score,
    },
    "components__educational-games__leo-lab__LeoLabGame": { end_score: keys.end_score },
    "components__educational-games__leo-number-path__LeoNumberPathGame": {
      end_score: keys.end_score,
    },
    "components__educational-games__leo-pizzeria__LeoPizzeriaGame": {
      end_score: keys.end_score,
    },
    "components__educational-games__leo-supermarket__LeoSupermarketGame": {
      end_score: keys.end_score,
    },
  };
  for (const [slug, vals] of Object.entries(gameSlugs)) {
    idx[slug] = { ...(idx[slug] || {}), ...vals };
  }
  const finish = "components__solo-games__SoloGameFinishScreen";
  if (idx[finish]) idx[finish].score = keys.score_colon;
  writeJson(idxPath, idx);
  console.log("updated", idxPath);
}

const wsPath = "locales/ar-001/worksheets.json";
const ws = readJson(wsPath);
const enWs = readJson("locales/en/worksheets.json");
ws.subjectField = "مادة";
ws.topicField = "موضوع";
ws.subjectFilterAll = "جميع المواد";
ws.writingCategoryPrewriting = "ما قبل الكتابة";
ws.writingNumberModeBeforeAfter = "قبل / بعد";

const worksheetArFixes = {
  writingCategoryEnglishLetters: "الحروف الإنجليزية",
  writingCategoryEnglishWords: "الكلمات الإنجليزية",
  writingCategoryNumbers: "الأرقام",
};
for (const [k, v] of Object.entries(worksheetArFixes)) {
  if (ws[k]) ws[k] = v;
}
writeJson(wsPath, ws);

const identities = [];
for (const [k, v] of Object.entries(ws)) {
  if (
    typeof v === "string" &&
    typeof enWs[k] === "string" &&
    v === enWs[k] &&
    /[A-Za-z]{3,}/.test(v)
  ) {
    identities.push([k, v]);
  }
}
console.log("worksheet identity-with-EN count", identities.length);
for (const row of identities.slice(0, 60)) console.log(row.join(" = "));

// Scan Arabic-Indic digits in ar-001 packs/locales
const digitRe = /[٠١٢٣٤٥٦٧٨٩]/g;
const roots = ["locales/ar-001", "content-packs/ar-001", "data/help"];
let digitHits = 0;
const digitFiles = [];
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (/\.(json|md|jsx?|tsx?|html)$/i.test(ent.name)) {
        const text = fs.readFileSync(p, "utf8");
        const m = text.match(digitRe);
        if (m?.length) {
          digitHits += m.length;
          digitFiles.push([p, m.length]);
        }
      }
    }
  };
  walk(root);
}
digitFiles.sort((a, b) => b[1] - a[1]);
console.log("Arabic-Indic digit hits", digitHits, "files", digitFiles.length);
for (const row of digitFiles.slice(0, 25)) console.log(row[1], row[0]);
