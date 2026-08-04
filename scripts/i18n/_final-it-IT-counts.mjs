import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, out);
    else if (pred(e.name, p)) out.push(p);
  }
  return out;
}
function strings(o, a = []) {
  if (typeof o === "string") a.push(o);
  else if (Array.isArray(o)) o.forEach((v) => strings(v, a));
  else if (o && typeof o === "object") Object.values(o).forEach((v) => strings(v, a));
  return a;
}

let localeStudente = 0;
let localeEs = 0;
for (const f of walk("locales/it-IT", (n) => n.endsWith(".json"))) {
  const blob = strings(JSON.parse(fs.readFileSync(f, "utf8"))).join("\n");
  localeStudente += (blob.match(/\bstudente\b/gi) || []).length;
  localeEs += (blob.match(/[áíóúñ¿¡]|\b(puedes|también|hoja de)\b/i) || []).length;
}

let packFiles = 0;
let packStudente = 0;
let packEs = 0;
for (const f of walk("content-packs/it-IT", (n) => n.endsWith(".json"))) {
  packFiles += 1;
  const blob = strings(JSON.parse(fs.readFileSync(f, "utf8"))).join("\n");
  packStudente += (blob.match(/\bstudente\b/gi) || []).length;
  packEs += (blob.match(/[áíóúñ¿¡]|\b(puedes|también|hoja de|Inténtalo|Quieres)\b/i) || []).length;
}

const meanings = await import(
  pathToFileURL(path.resolve("data/english-questions/word-meanings/it-IT.js")).href
);
const meaningKeys = Object.keys(meanings.default || meanings.WORD_MEANINGS_IT_IT || meanings).filter(
  (k) => !["default"].includes(k),
);
const help = await import(pathToFileURL(path.resolve("data/help-center/it-IT/index.js")).href);
const sci = (
  await import(pathToFileURL(path.resolve("data/science-questions-it-IT-overlay.js")).href)
).SCIENCE_IT_IT_OVERLAY;
const common = JSON.parse(fs.readFileSync("locales/it-IT/common.json", "utf8"));
const books = walk("docs/learning-book/it-IT", (n) => n.endsWith(".md")).length;

console.log(
  JSON.stringify(
    {
      locales: { files: 15, studente: localeStudente, esMarks: localeEs },
      packs: { files: packFiles, studente: packStudente, esMarks: packEs },
      books,
      scienceIds: Object.keys(sci).length,
      helpArticles: help.ALL_ARTICLES_IT_IT.length,
      meaningExportKeys: meaningKeys.length,
      grades: {
        gradeLabel: common.gradeLabel,
        grade1: common.grade1,
        grade6: common.grade6,
        brand: common.brandName,
      },
    },
    null,
    2,
  ),
);
