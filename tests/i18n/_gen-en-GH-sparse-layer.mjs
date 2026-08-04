/**
 * One-shot generator: en-NG sparse overlays → en-GH Basic 1–6 terminology.
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
  t = t.replace(/\bPrimary 1–6\b/g, "Basic 1–6");
  t = t.replace(/\bPrimary 1-6\b/g, "Basic 1-6");
  t = t.replace(/\bPrimary 1 through Primary 6\b/g, "Basic 1 through Basic 6");
  t = t.replace(/\bPrimary 1–2\b/g, "Basic 1–2");
  t = t.replace(/\bPrimary 1-2\b/g, "Basic 1-2");
  t = t.replace(/\bPrimary 3–4\b/g, "Basic 3–4");
  t = t.replace(/\bPrimary 3-4\b/g, "Basic 3-4");
  t = t.replace(/\bPrimary 5–6\b/g, "Basic 5–6");
  t = t.replace(/\bPrimary 5-6\b/g, "Basic 5-6");
  for (let n = 1; n <= 6; n += 1) {
    t = t.replace(new RegExp(`\\bPrimary ${n}\\b`, "g"), `Basic ${n}`);
  }
  t = t.replace(/\bPrimary \{grade\}\b/g, "Basic {grade}");
  t = t.replace(/\byour chosen class\b/g, "your chosen basic level");
  t = t.replace(/\bYour chosen class\b/g, "Your chosen basic level");
  t = t.replace(/\bprimary school pupils\b/g, "primary school learners");
  t = t.replace(/\bPrimary school pupils\b/g, "Primary school learners");
  t = t.replace(/\ball primary classes\b/g, "all basic levels");
  t = t.replace(/\bAll primary classes\b/g, "All basic levels");
  t = t.replace(/\bprimary classes\b/g, "basic levels");
  t = t.replace(/\bPrimary classes\b/g, "Basic levels");
  t = t.replace(/\ba primary class\b/g, "a basic level");
  t = t.replace(/\bA primary class\b/g, "A basic level");
  t = t.replace(/\bthe primary class\b/g, "the basic level");
  t = t.replace(/\bThe primary class\b/g, "The basic level");
  t = t.replace(/\byour primary class\b/g, "your basic level");
  t = t.replace(/\bYour primary class\b/g, "Your basic level");
  t = t.replace(/\bthis primary class\b/g, "this basic level");
  t = t.replace(/\bThis primary class\b/g, "This basic level");
  t = t.replace(/\bcurrent primary class\b/g, "current basic level");
  t = t.replace(/\bCurrent primary class\b/g, "Current basic level");
  t = t.replace(/\bTarget primary class\b/g, "Target basic level");
  t = t.replace(/\btarget primary class\b/g, "target basic level");
  t = t.replace(/\bChange primary class\b/g, "Change basic level");
  t = t.replace(/\bchange primary class\b/g, "change basic level");
  t = t.replace(/\bChoose a primary class\b/g, "Choose a basic level");
  t = t.replace(/\bchoose a primary class\b/g, "choose a basic level");
  t = t.replace(/\bSelect a primary class\b/g, "Select a basic level");
  t = t.replace(/\bselect a primary class\b/g, "select a basic level");
  t = t.replace(/\bby primary class\b/g, "by basic level");
  t = t.replace(/\bBy primary class\b/g, "By basic level");
  t = t.replace(/\bprimary class\b/g, "basic level");
  t = t.replace(/\bPrimary class\b/g, "Basic level");
  t = t.replace(/\bupper primary classes\b/g, "Upper Primary");
  t = t.replace(/\bUpper primary classes\b/g, "Upper Primary");
  t = t.replace(/\badvanced primary classes\b/g, "Upper Primary");
  t = t.replace(/\bAdvanced primary classes\b/g, "Upper Primary");
  t = t.replace(/\bphysical class\b/g, "class group");
  t = t.replace(/\bPhysical class\b/g, "Class group");
  t = t.replace(/\bhead teacher\b/g, "headteacher");
  t = t.replace(/\bHead teacher\b/g, "Headteacher");
  t = t.replace(/\bNigeria\b/g, "Ghana");
  t = t.replace(/\bnigeria\b/g, "Ghana");
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
  ensureDir(path.join(ROOT, "locales/en-GH"));
  fs.writeFileSync(path.join(ROOT, "locales/en-GH", file), `${JSON.stringify(pruned, null, 2)}\n`);
  localeOverrideCount += collectStringLeaves(pruned).size;
  console.log("locale", file, "leaves", collectStringLeaves(pruned).size);
}

const ngRoot = path.join(ROOT, "content-packs/en-NG");
const enRoot = path.join(ROOT, "content-packs/en");
const ghRoot = path.join(ROOT, "content-packs/en-GH");
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
    const outPath = path.join(ghRoot, rel);
    ensureDir(path.dirname(outPath));
    fs.writeFileSync(outPath, `${JSON.stringify(transformed, null, 2)}\n`);
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

  const outPath = path.join(ghRoot, rel);
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
