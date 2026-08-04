/**
 * Offline: finish content-packs/it-IT from en structure + es-419 bridge + EN→IT cache.
 * No network.
 *
 * Run: node scripts/i18n/generate-it-IT-packs-offline.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveItString, applyItalianAuthorityPostfix } from "./offline-es-to-it-IT.mjs";
import { ITALIAN_ITALY_GLOSSARY } from "../../lib/i18n/italian-italy-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-it-IT.json");

const SKIP_VALUE_KEYS = new Set([
  "id",
  "ids",
  "skillId",
  "pageType",
  "learningPageId",
  "learningLanguage",
  "gameId",
  "subjectId",
  "topicId",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "icon",
  "image",
  "imageSrc",
  "asset",
  "assetPath",
  "font",
  "ttf",
  "locale",
  "localeId",
  "contentLocale",
  "enum",
  "key",
  "code",
  "type",
  "kind",
  "status",
  "namespace",
  "version",
  "sha",
  "hash",
  "color",
  "bg",
  "background",
  "className",
  "component",
  "file",
  "filename",
  "ext",
  "mime",
  "doNotTranslateFields",
]);

const EXACT = {
  Math: "Matematica",
  Geometry: "Geometria",
  English: "Inglese",
  Science: "Scienze",
  Hebrew: "Ebraico",
  Geography: "Geografia",
  History: "Storia",
  "Leo Kids": "Leo Kids",
  "Grade 1": "1ª primaria",
  "Grade 2": "2ª primaria",
  "Grade 3": "3ª primaria",
  "Grade 4": "4ª primaria",
  "Grade 5": "5ª primaria",
  "Grade 6": "1ª secondaria",
  "All grades": "Tutte le classi",
  Worksheet: "Scheda didattica",
  Worksheets: "Schede didattiche",
  Preview: "Anteprima",
  Print: "Stampa",
  "Answer key": "Soluzioni",
  Parent: "Genitore",
  Parents: "Genitori",
  Student: "Alunno",
  Students: "Alunni",
  Teacher: "Insegnante",
  School: "Scuola",
};

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function listJson(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".json")) out.push(full);
    }
  })(dir);
  return out;
}

function looksNonTranslate(s) {
  if (s == null) return true;
  const str = String(s);
  if (!str.trim()) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str)) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(str)) return true;
  if (/^\d+(\.\d+)?%?$/.test(str)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(str) && str.length <= 48) return true;
  if (!/\s/.test(str)) {
    if (/^[a-z0-9]+([_/.-][a-z0-9]+)+$/i.test(str)) return true;
    if (/^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(str)) return true;
    if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
    if (/\.(png|jpe?g|gif|webp|svg|ttf|woff2?|json|js|css|mp3|wav|pdf)$/i.test(str)) return true;
  }
  return false;
}

function glossaryHints(text) {
  let out = text;
  for (const [en, entry] of Object.entries(ITALIAN_ITALY_GLOSSARY)) {
    if (!entry?.preferred || en.length < 3) continue;
    const re = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    out = out.replace(re, entry.preferred);
  }
  return applyItalianAuthorityPostfix(out);
}

function transform(enNode, esNode, key, cache) {
  if (typeof enNode === "string") {
    if (SKIP_VALUE_KEYS.has(key) || looksNonTranslate(enNode)) return enNode;
    if (Object.prototype.hasOwnProperty.call(EXACT, enNode)) return EXACT[enNode];
    return glossaryHints(
      resolveItString(enNode, typeof esNode === "string" ? esNode : null, cache),
    );
  }
  if (Array.isArray(enNode)) {
    return enNode.map((item, i) =>
      transform(item, Array.isArray(esNode) ? esNode[i] : null, key, cache),
    );
  }
  if (enNode && typeof enNode === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(enNode)) {
      const esVal = esNode && typeof esNode === "object" && !Array.isArray(esNode) ? esNode[k] : null;
      out[k] = transform(v, esVal, k, cache);
    }
    return out;
  }
  return enNode;
}

function main() {
  const cache = loadCache();
  const enRoot = path.join(ROOT, "content-packs/en");
  const esRoot = path.join(ROOT, "content-packs/es-419");
  const itRoot = path.join(ROOT, "content-packs/it-IT");
  const files = listJson(enRoot);
  let n = 0;
  for (const enFile of files) {
    const rel = path.relative(enRoot, enFile);
    const esFile = path.join(esRoot, rel);
    const itFile = path.join(itRoot, rel);
    const enObj = JSON.parse(fs.readFileSync(enFile, "utf8"));
    let esObj = null;
    if (fs.existsSync(esFile)) {
      try {
        esObj = JSON.parse(fs.readFileSync(esFile, "utf8"));
      } catch {
        esObj = null;
      }
    }
    const out = transform(enObj, esObj, "", cache);
    fs.mkdirSync(path.dirname(itFile), { recursive: true });
    fs.writeFileSync(itFile, JSON.stringify(out, null, 2) + "\n", "utf8");
    n += 1;
    if (n % 40 === 0) console.log("packs", n, "/", files.length);
  }
  console.log("Wrote content-packs/it-IT files", n);
}

main();
