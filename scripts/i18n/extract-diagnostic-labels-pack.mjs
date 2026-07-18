/**
 * One-time helper: extract diagnostic label maps from utils/diagnostic-labels.js
 * Run: node scripts/i18n/extract-diagnostic-labels-pack.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const srcPath = path.join(root, "utils/diagnostic-labels.js");
const outPath = path.join(root, "content-packs/en/learning/diagnostic-labels.json");

const src = fs.readFileSync(srcPath, "utf8");

/**
 * @param {string} constName
 */
function extractConstObject(constName) {
  const re = new RegExp(`const ${constName} = ([\\s\\S]*?);\\r?\\n`, "m");
  const m = src.match(re);
  if (!m) throw new Error(`missing ${constName}`);
  return vm.runInNewContext(`(${m[1]})`, {});
}

/**
 * @param {string} exportName
 */
function extractExportString(exportName) {
  const re = new RegExp(`export const ${exportName} = "([^"]*)"`);
  const m = src.match(re);
  if (!m) throw new Error(`missing ${exportName}`);
  return m[1];
}

const pack = {
  operations: extractConstObject("OPERATION_NAMES_EN"),
  geometryTopics: extractConstObject("GEOMETRY_TOPIC_NAMES_EN"),
  englishTopics: extractConstObject("ENGLISH_TOPIC_NAMES_EN"),
  scienceTopics: extractConstObject("SCIENCE_TOPIC_NAMES_EN"),
  languageArtsTopics: extractConstObject("LANGUAGE_ARTS_TOPIC_NAMES_EN"),
  homelandGeographyTopics: extractConstObject("HOMELAND_GEOGRAPHY_TOPIC_NAMES_EN"),
  snippets: extractConstObject("EN_SNIPPET_EN"),
  generics: {
    weakness: extractExportString("GENERIC_WEAKNESS_EN"),
    point: extractExportString("GENERIC_POINT_EN"),
    reinforce: extractExportString("GENERIC_REINFORCE_EN"),
    parentTopicFallback: extractExportString("PARENT_TOPIC_FALLBACK_EN"),
  },
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(root, outPath)}`);
