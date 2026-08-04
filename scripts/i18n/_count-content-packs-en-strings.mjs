import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC_ROOT = path.join(ROOT, "content-packs", "en");

const SKIP_VALUE_KEYS = new Set([
  "id","ids","skillId","pageType","learningPageId","learningLanguage","gameId","subjectId",
  "topicId","slug","href","src","path","route","url","icon","image","imageSrc","asset",
  "assetPath","font","ttf","locale","localeId","contentLocale","enum","key","code","type",
  "kind","status","severity","version","sha","hash","color","bg","background","className",
  "component","file","filename","ext","mime","doNotTranslateFields",
]);

function looksNonTranslate(s) {
  if (s == null) return true;
  const str = String(s);
  if (!str.trim()) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str)) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(str)) return true;
  if (/^\d+(\.\d+)?%?$/.test(str)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(str) && str.length <= 48) return true;
  if (/[\u0590-\u05FF]/.test(str) && !/[A-Za-z]/.test(str)) return true;
  if (!/\s/.test(str)) {
    if (/^[a-z0-9]+([_/.-][a-z0-9]+)+$/i.test(str)) return true;
    if (/^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(str)) return true;
    if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
    if (/\.(png|jpe?g|gif|webp|svg|ttf|woff2?|json|js|css|mp3|wav|pdf)$/i.test(str)) return true;
  }
  return false;
}

function listJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const fp = path.join(p, ent.name);
      if (ent.isDirectory()) walk(fp);
      else if (ent.name.endsWith(".json")) out.push(fp);
    }
  })(dir);
  return out;
}

const unique = new Set();
let totalOccurrences = 0;
function collect(node, key, skipFields) {
  if (node == null) return;
  if (typeof node === "string") {
    if (key && SKIP_VALUE_KEYS.has(key)) return;
    if (skipFields && key && skipFields.has(key)) return;
    if (!looksNonTranslate(node)) {
      unique.add(node);
      totalOccurrences++;
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((x) => collect(x, undefined, skipFields));
    return;
  }
  if (typeof node === "object") {
    let childSkip = skipFields;
    if (Array.isArray(node.doNotTranslateFields)) {
      childSkip = new Set([...(childSkip || []), ...node.doNotTranslateFields.map(String)]);
    }
    for (const [k, v] of Object.entries(node)) collect(v, k, childSkip);
  }
}

const files = listJsonFiles(SRC_ROOT);
for (const f of files) {
  try {
    collect(JSON.parse(fs.readFileSync(f, "utf8")));
  } catch (e) {
    console.warn("parse fail", f, e.message);
  }
}
console.log("files:", files.length, "uniqueStrings:", unique.size, "totalOccurrences:", totalOccurrences);
