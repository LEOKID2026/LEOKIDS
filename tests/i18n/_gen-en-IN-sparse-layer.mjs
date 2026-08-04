/**
 * One-shot generator: en-NG sparse overlays → en-IN Class 1–6 Indian English.
 * Not part of the test suite; safe to keep as a locale scaffold helper.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assessNearFullCopy,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "en-IN";

/**
 * @param {string} dir
 * @returns {string[]}
 */
function listJsonRel(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  /** @param {string} d @param {string} rel */
  function walk(d, rel = "") {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      const abs = path.join(d, ent.name);
      if (ent.isDirectory()) walk(abs, r);
      else if (ent.name.endsWith(".json")) out.push(r.replace(/\\/g, "/"));
    }
  }
  walk(dir);
  return out.sort();
}

/** @param {string} s */
function transformString(s) {
  let t = s;
  t = t.replace(/\bPrimary \{grade\}\b/g, "Class {grade}");
  t = t.replace(/\bPrimary 1–6\b/g, "Classes 1–6");
  t = t.replace(/\bPrimary 1-6\b/g, "Classes 1-6");
  t = t.replace(/\bPrimary 1 through Primary 6\b/g, "Class 1 through Class 6");
  t = t.replace(/\bPrimary 1–2\b/g, "Class 1–2");
  t = t.replace(/\bPrimary 1-2\b/g, "Class 1-2");
  t = t.replace(/\bPrimary 3–4\b/g, "Class 3–4");
  t = t.replace(/\bPrimary 3-4\b/g, "Class 3-4");
  t = t.replace(/\bPrimary 5–6\b/g, "Class 5–6");
  t = t.replace(/\bPrimary 5-6\b/g, "Class 5-6");
  for (let n = 1; n <= 6; n += 1) {
    t = t.replace(new RegExp(`\\bPrimary ${n}\\b`, "g"), `Class ${n}`);
  }
  t = t.replace(/\bprimary school pupils\b/g, "school students in Classes 1–6");
  t = t.replace(/\bPrimary school pupils\b/g, "School students in Classes 1–6");
  t = t.replace(/\ball primary classes\b/g, "all classes");
  t = t.replace(/\bAll primary classes\b/g, "All classes");
  t = t.replace(/\bupper primary classes\b/g, "upper-primary levels");
  t = t.replace(/\bUpper primary classes\b/g, "Upper-primary levels");
  t = t.replace(/\badvanced primary classes\b/g, "Classes 5–6");
  t = t.replace(/\bAdvanced primary classes\b/g, "Classes 5–6");
  t = t.replace(/\bprimary classes\b/g, "classes");
  t = t.replace(/\bPrimary classes\b/g, "Classes");
  t = t.replace(/\ba primary class\b/g, "a class");
  t = t.replace(/\bA primary class\b/g, "A class");
  t = t.replace(/\bthe primary class\b/g, "the class");
  t = t.replace(/\bThe primary class\b/g, "The class");
  t = t.replace(/\byour primary class\b/g, "your class");
  t = t.replace(/\bYour primary class\b/g, "Your class");
  t = t.replace(/\bthis primary class\b/g, "this class");
  t = t.replace(/\bThis primary class\b/g, "This class");
  t = t.replace(/\bcurrent primary class\b/g, "current class");
  t = t.replace(/\bCurrent primary class\b/g, "Current class");
  t = t.replace(/\bTarget primary class\b/g, "Target class");
  t = t.replace(/\btarget primary class\b/g, "target class");
  t = t.replace(/\bChange primary class\b/g, "Change class");
  t = t.replace(/\bchange primary class\b/g, "change class");
  t = t.replace(/\bChoose a primary class\b/g, "Choose a class");
  t = t.replace(/\bchoose a primary class\b/g, "choose a class");
  t = t.replace(/\bSelect a primary class\b/g, "Select a class");
  t = t.replace(/\bselect a primary class\b/g, "select a class");
  t = t.replace(/\bSuitable for primary class\b/g, "Suitable for class");
  t = t.replace(/\bsuitable for primary class\b/g, "suitable for class");
  t = t.replace(/\bby primary class\b/g, "by class");
  t = t.replace(/\bBy primary class\b/g, "By class");
  t = t.replace(/\bAbove primary class\b/g, "Above class level");
  t = t.replace(/\babove primary class\b/g, "above class level");
  t = t.replace(/\bprimary class\b/g, "class");
  t = t.replace(/\bPrimary class\b/g, "Class");
  t = t.replace(/\bphysical class\b/g, "section");
  t = t.replace(/\bPhysical class\b/g, "Section");
  t = t.replace(/\bNo classes in this class\b/g, "No sections in this class");
  t = t.replace(/\bNigeria\b/g, "India");
  t = t.replace(/\bnigeria\b/g, "India");
  return t;
}

/** @param {unknown} v */
function transformValue(v) {
  if (typeof v === "string") return transformString(v);
  if (Array.isArray(v)) return v.map(transformValue);
  if (v && typeof v === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = transformValue(val);
    return out;
  }
  return v;
}

/**
 * @param {unknown} country
 * @param {unknown} base
 * @returns {unknown}
 */
function pruneIdentical(country, base) {
  if (typeof country === "string") {
    if (typeof base !== "string") return country;
    return country === base ? undefined : country;
  }
  if (Array.isArray(country)) {
    if (!Array.isArray(base)) return country;
    const jsonC = JSON.stringify(country);
    const jsonB = JSON.stringify(base);
    return jsonC === jsonB ? undefined : country;
  }
  if (country && typeof country === "object") {
    if (!base || typeof base !== "object" || Array.isArray(base)) return country;
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(/** @type {Record<string, unknown>} */ (country))) {
      const pruned = pruneIdentical(v, /** @type {Record<string, unknown>} */ (base)[k]);
      if (pruned !== undefined) out[k] = pruned;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return country === base ? undefined : country;
}

/** @param {string} p */
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

const localeFiles = fs
  .readdirSync(path.join(ROOT, "locales/en-NG"))
  .filter((f) => f.endsWith(".json"));
let localeOverrideCount = 0;
for (const file of localeFiles) {
  const ng = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en-NG", file), "utf8"));
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en", file), "utf8"));
  const transformed = transformValue(ng);
  const pruned = pruneIdentical(transformed, en);
  if (!pruned || typeof pruned !== "object" || Object.keys(pruned).length === 0) {
    console.log("SKIP empty locale", file);
    continue;
  }
  ensureDir(path.join(ROOT, "locales", LOCALE));
  fs.writeFileSync(path.join(ROOT, "locales", LOCALE, file), `${JSON.stringify(pruned, null, 2)}\n`);
  localeOverrideCount += collectStringLeaves(pruned).size;
  console.log("locale", file, "leaves", collectStringLeaves(pruned).size);
}

const ngRoot = path.join(ROOT, "content-packs/en-NG");
const enRoot = path.join(ROOT, "content-packs/en");
const inRoot = path.join(ROOT, "content-packs", LOCALE);
const baseExists = (rel) => fs.existsSync(path.join(enRoot, rel));

let packFiles = 0;
let packLeaves = 0;
/** @type {string[]} */
const nearFull = [];
/** @type {string[]} */
const identical = [];
/** @type {string[]} */
const orphans = [];

for (const rel of listJsonRel(ngRoot)) {
  const ng = JSON.parse(fs.readFileSync(path.join(ngRoot, rel), "utf8"));
  const transformed = transformValue(ng);

  if (isBurnDownIndexPath(rel)) {
    // Prune burn-down index leaf values that match en authority files when possible.
    const domain = rel.split("/")[0];
    const baseRel = `${domain}/burn-down-index.json`;
    let out = transformed;
    if (baseExists(baseRel)) {
      const base = JSON.parse(fs.readFileSync(path.join(enRoot, baseRel), "utf8"));
      // Index shape differs; keep transformed sparse NG-style index as-is after string transform.
      out = transformed;
      void base;
    }
    const outPath = path.join(inRoot, rel);
    ensureDir(path.dirname(outPath));
    fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
    packFiles += 1;
    console.log("index", rel);
    continue;
  }

  const authority = resolveAuthorityPackPath(rel, baseExists);
  if (authority.kind === "missing" || !authority.baseRel) {
    console.log("NO AUTHORITY", rel);
    continue;
  }
  const base = JSON.parse(fs.readFileSync(path.join(enRoot, authority.baseRel), "utf8"));
  const pruned = pruneIdentical(transformed, base);
  if (!pruned) {
    console.log("SKIP empty pack", rel);
    continue;
  }
  const countryLeaves = collectStringLeaves(pruned);
  const baseLeaves = collectStringLeaves(base);
  for (const [key, value] of countryLeaves) {
    if (!baseLeaves.has(key)) orphans.push(`${rel}:${key}`);
    else if (baseLeaves.get(key) === value) identical.push(`${rel}:${key}`);
  }
  const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
  if (assessment.isNearFullCopy) nearFull.push(rel);

  const outPath = path.join(inRoot, rel);
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, `${JSON.stringify(pruned, null, 2)}\n`);
  packFiles += 1;
  packLeaves += countryLeaves.size;
  console.log("pack", rel, "leaves", countryLeaves.size);
}

console.log("\nSUMMARY");
console.log("localeOverrideCount", localeOverrideCount);
console.log("packFiles", packFiles, "packLeaves", packLeaves);
console.log("identical", identical.length, identical.slice(0, 30));
console.log("orphans", orphans.length, orphans.slice(0, 30));
console.log("nearFull", nearFull);
