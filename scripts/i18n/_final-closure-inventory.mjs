import fs from "node:fs";
import path from "node:path";
import { ES419_TRANSLATION_INVENTORY } from "../../lib/i18n/es-419-translation-inventory.js";
import {
  REQUIRED_UI_NAMESPACES,
  REQUIRED_CONTENT_PACK_PATHS,
  GLOBAL_SUBJECTS,
} from "../../lib/i18n/locale-completeness-manifest.js";
import { CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import { ALL_ARTICLES, ALL_ARTICLES_ES_419 } from "../../data/help-center/index.js";
import { computeScienceLocalizationCoverage } from "../../lib/learning/science-localization-coverage.js";
import { SCIENCE_ES_419_OVERLAY } from "../../data/science-questions-es-419-overlay.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";

const HEBREW = /[\u0590-\u05FF]/;
const VOS = /\b(vosotros|vosotras|(?<![A-Za-zÁÉÍÓÚáéíóúÑñ])vos(?![A-Za-zÁÉÍÓÚáéíóúÑñ]))\b/i;

function exists(p) {
  return fs.existsSync(p);
}

function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else out.push(p.split(path.sep).join("/"));
  }
  return out;
}

const nsMissing = REQUIRED_UI_NAMESPACES.filter(
  (ns) => !exists(`locales/es-419/${ns}.json`) || !exists(`locales/en/${ns}.json`)
);
const packMissing = REQUIRED_CONTENT_PACK_PATHS.filter(
  (p) => !CONTENT_PACK_CATALOG["es-419"]?.[p] || !CONTENT_PACK_CATALOG.en?.[p]
);
const sciEn = computeScienceLocalizationCoverage();
const sciEs = computeScienceLocalizationCoverage(undefined, SCIENCE_ES_419_OVERLAY);

const scanRoots = [
  "locales/es-419",
  "content-packs/es-419",
  "data/help-center/es-419",
  "utils/learning-content-es419",
  "data/science-questions-es-419-overlay.js",
  "data/english-questions/word-meanings",
  "data/english-questions/writing-sentence-cues",
];
let he = 0;
let vos = 0;
const heFiles = [];
const vosFiles = [];
for (const r of scanRoots) {
  const files =
    exists(r) && fs.statSync(r).isDirectory() ? walk(r) : exists(r) ? [r] : [];
  for (const f of files) {
    if (!/\.(json|js|mjs|md)$/i.test(f)) continue;
    const t = fs.readFileSync(f, "utf8");
    if (HEBREW.test(t)) {
      he += 1;
      heFiles.push(f);
    }
    if (VOS.test(t)) {
      vos += 1;
      vosFiles.push(f);
    }
  }
}

const enReport = checkLocaleCompleteness("en");
const esReport = checkLocaleCompleteness("es-419");

const inventory = {
  namespaces: { required: REQUIRED_UI_NAMESPACES.length, missing: nsMissing },
  contentPacksRequired: { required: REQUIRED_CONTENT_PACK_PATHS.length, missing: packMissing },
  subjects: GLOBAL_SUBJECTS,
  inventoryItems: ES419_TRANSLATION_INVENTORY.length,
  helpParity: { en: ALL_ARTICLES.length, es: ALL_ARTICLES_ES_419.length },
  science: {
    enComplete: sciEn.contractComplete,
    esComplete: sciEs.contractComplete,
    enN: sciEn.totalQuestions,
    esHit: sciEs.overlayHit,
  },
  stems: {
    mathEn: exists("utils/learning-content-en/math.js"),
    mathEs: exists("utils/learning-content-es419/math.js"),
    geoEn: exists("utils/learning-content-en/geometry.js"),
    geoEs: exists("utils/learning-content-es419/geometry.js"),
  },
  packCounts: {
    gamesEn: walk("content-packs/en/games").length,
    gamesEs: walk("content-packs/es-419/games").length,
    burnEn: walk("content-packs/en/global-burn-down").length,
    burnEs: walk("content-packs/es-419/global-burn-down").length,
  },
  heHits: he,
  vosHits: vos,
  heFiles: heFiles.slice(0, 10),
  vosFiles: vosFiles.slice(0, 10),
  completeness: {
    enMissing: enReport.missingCount,
    esMissing: esReport.missingCount,
    enFallback: enReport.fallbackCount,
    esFallback: esReport.fallbackCount,
  },
};

fs.mkdirSync("scripts/i18n", { recursive: true });
fs.writeFileSync(
  "scripts/i18n/_final-closure-inventory.json",
  JSON.stringify(inventory, null, 2),
  "utf8"
);
console.log(JSON.stringify(inventory, null, 2));
