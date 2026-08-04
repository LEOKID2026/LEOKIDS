/**
 * One-shot generator: en-NG sparse overlays → en-RW Primary year / class group.
 * Not part of the test suite; locale scaffold helper only.
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
  t = t.replace(/\bNigeria\b/g, "Rwanda");
  t = t.replace(/\bnigeria\b/g, "Rwanda");

  // Class-group (physical grouping) before year rewrites.
  t = t.replace(/\bphysical class\b/g, "class group");
  t = t.replace(/\bPhysical class\b/g, "Class group");
  t = t.replace(/\bphysical classes\b/g, "class groups");
  t = t.replace(/\bPhysical classes\b/g, "Class groups");

  // School-year terminology: avoid ambiguous "primary class".
  t = t.replace(/\ball primary classes\b/g, "all primary years");
  t = t.replace(/\bAll primary classes\b/g, "All primary years");
  t = t.replace(/\bupper primary classes\b/g, "Primary 5–6");
  t = t.replace(/\bUpper primary classes\b/g, "Primary 5–6");
  t = t.replace(/\badvanced primary classes\b/g, "Primary 5–6");
  t = t.replace(/\bAdvanced primary classes\b/g, "Primary 5–6");
  t = t.replace(/\bprimary classes\b/g, "primary years");
  t = t.replace(/\bPrimary classes\b/g, "Primary years");
  t = t.replace(/\ba primary class\b/g, "a primary year");
  t = t.replace(/\bA primary class\b/g, "A primary year");
  t = t.replace(/\bthe primary class\b/g, "the primary year");
  t = t.replace(/\bThe primary class\b/g, "The primary year");
  t = t.replace(/\byour primary class\b/g, "your primary year");
  t = t.replace(/\bYour primary class\b/g, "Your primary year");
  t = t.replace(/\bthis primary class\b/g, "this primary year");
  t = t.replace(/\bThis primary class\b/g, "This primary year");
  t = t.replace(/\bcurrent primary class\b/g, "current primary year");
  t = t.replace(/\bCurrent primary class\b/g, "Current primary year");
  t = t.replace(/\bTarget primary class\b/g, "Target primary year");
  t = t.replace(/\btarget primary class\b/g, "target primary year");
  t = t.replace(/\bChange primary class\b/g, "Change primary year");
  t = t.replace(/\bchange primary class\b/g, "change primary year");
  t = t.replace(/\bChoose a primary class\b/g, "Choose a primary year");
  t = t.replace(/\bchoose a primary class\b/g, "choose a primary year");
  t = t.replace(/\bSelect a primary class\b/g, "Select a primary year");
  t = t.replace(/\bselect a primary class\b/g, "select a primary year");
  t = t.replace(/\bby primary class\b/g, "by primary year");
  t = t.replace(/\bBy primary class\b/g, "By primary year");
  t = t.replace(/\bprimary class\b/g, "primary year");
  t = t.replace(/\bPrimary class\b/g, "Primary year");

  // Residual ambiguous "chosen class" after year rewrite.
  t = t.replace(/\byour chosen class\b/g, "your chosen primary year");
  t = t.replace(/\bYour chosen class\b/g, "Your chosen primary year");

  // Learner-centred CBC wording (instructional).
  t = t.replace(/\bprimary school pupils\b/g, "primary school learners");
  t = t.replace(/\bPrimary school pupils\b/g, "Primary school learners");

  // School portal: class lists under a year.
  t = t.replace(/\bNo classes in this primary year\b/g, "No class groups in this primary year");
  t = t.replace(/\bno classes in this primary year\b/g, "no class groups in this primary year");

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

/**
 * Deep-merge sparse objects (overlay wins).
 * @param {unknown} base
 * @param {unknown} overlay
 */
function deepMerge(base, overlay) {
  if (!overlay || typeof overlay !== "object" || Array.isArray(overlay)) return overlay;
  if (!base || typeof base !== "object" || Array.isArray(base)) return overlay;
  /** @type {Record<string, unknown>} */
  const out = { .../** @type {Record<string, unknown>} */ (base) };
  for (const [k, v] of Object.entries(/** @type {Record<string, unknown>} */ (overlay))) {
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      out[k] &&
      typeof out[k] === "object" &&
      !Array.isArray(out[k])
    ) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
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
  let transformed = transformValue(ng);

  // Rwanda-specific sparse additions (class/group + learner/child terminology).
  if (file === "school.json") {
    transformed = deepMerge(transformed, {
      portal: {
        choosePhysicalClass: "Choose class group",
        colClass: "Class group",
        classLabel: "Class group",
        physicalClassReportTitle: "General class group report",
        physicalClassReportButton: "General class group report",
        physicalClassLoading: "Loading general class group report…",
        createStudentClass: "Class group (class name at school)",
        classesSubtitle:
          "Choose a primary year, class group and subject — reports and management by primary year",
        studentsSubtitle:
          "Browse by primary year and class group — view child reports without entering IDs",
      },
    });
  }
  if (file === "ui.json") {
    transformed = deepMerge(transformed, {
      empty: {
        noStudents: "No children yet. Add a child to get started.",
      },
      public: {
        homepage: {
          valueCards: {
            "0": {
              text: "See what your child practised, where they are improving, and what to reinforce.",
            },
          },
          teachers: {
            text: "Send focused activities, see how learners perform, and continue from the lesson at home.",
            bullet0: "Manage learners",
          },
        },
        about: {
          intro1:
            "The site is designed for primary school learners in Primary 1–6 (Primary 1–2, Primary 3–4, and Primary 5–6), with practice by subject, primary year, topic, and difficulty level. Every child can start where it makes sense, move forward gradually, and reinforce the topics where they need more confidence.",
        },
      },
      student: {
        childDefault: "Learner",
      },
    });
  }
  if (file === "seo.json") {
    transformed = deepMerge(transformed, {
      homeTitle: "Leo Kids — Practice for primary school learners in Rwanda",
    });
  }
  if (file === "learning.json") {
    transformed = deepMerge(transformed, {
      master: {
        defaultPlayerName: "Learner",
        gradeFallback: "Primary year",
      },
    });
  }

  const pruned = pruneIdentical(transformed, en);
  if (!pruned || typeof pruned !== "object" || Object.keys(pruned).length === 0) {
    console.log("SKIP empty locale", file);
    continue;
  }
  ensureDir(path.join(ROOT, "locales/en-RW"));
  fs.writeFileSync(path.join(ROOT, "locales/en-RW", file), `${JSON.stringify(pruned, null, 2)}\n`);
  localeOverrideCount += collectStringLeaves(pruned).size;
  console.log("locale", file, "leaves", collectStringLeaves(pruned).size);
}

const ngRoot = path.join(ROOT, "content-packs/en-NG");
const enRoot = path.join(ROOT, "content-packs/en");
const rwRoot = path.join(ROOT, "content-packs/en-RW");
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
    const outPath = path.join(rwRoot, rel);
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

  const outPath = path.join(rwRoot, rel);
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
