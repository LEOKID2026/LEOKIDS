/**
 * One-shot generator: fr-SN sparse scaffold → fr-CM (SIL–CM2 Francophone).
 * Not part of the test suite; locale scaffold helper only.
 * Base authority remains fr-FR (pruneIdentical vs fr-FR).
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

  // Country / subsystem framing (Francophone path, not all Cameroon).
  t = t.replace(/\bau Sénégal\b/g, "au Cameroun");
  t = t.replace(/\ben Sénégal\b/g, "au Cameroun");
  t = t.replace(/\bSénégal\b/g, "Cameroun");
  t = t.replace(/\bsénégalais\b/gi, "camerounais");

  t = t.replace(
    /\bélèves de l’enseignement élémentaire\b/g,
    "élèves du primaire francophone"
  );
  t = t.replace(
    /\bélèves de l'enseignement élémentaire\b/g,
    "élèves du primaire francophone"
  );
  t = t.replace(
    /\bl’enseignement élémentaire\b/g,
    "l’enseignement primaire francophone"
  );
  t = t.replace(
    /\bl'enseignement élémentaire\b/g,
    "l'enseignement primaire francophone"
  );
  t = t.replace(
    /\benseignement élémentaire\b/g,
    "enseignement primaire francophone"
  );

  // Grade bands and spans (CI is Senegal year 1; Cameroon year 1 is SIL).
  t = t.replace(/\bCI–CP\b/g, "SIL–CP");
  t = t.replace(/\bCI-CP\b/g, "SIL-CP");
  t = t.replace(/\bCI–CM2\b/g, "SIL–CM2");
  t = t.replace(/\bCI-CM2\b/g, "SIL-CM2");
  t = t.replace(/\bdu CI au CM2\b/g, "du SIL au CM2");
  t = t.replace(/\bDu CI au CM2\b/g, "Du SIL au CM2");
  t = t.replace(/\bCI à CM2\b/g, "SIL à CM2");
  t = t.replace(/\bCI a CM2\b/g, "SIL à CM2");
  t = t.replace(/\bCI through CM2\b/g, "SIL through CM2");

  // Standalone CI grade labels (after band rewrites).
  t = t.replace(/— CI\b/g, "— SIL");
  t = t.replace(/– CI\b/g, "– SIL");
  t = t.replace(/"CI"/g, '"SIL"');
  t = t.replace(/\bCI — grade_1\b/g, "SIL — grade_1");
  t = t.replace(/\bCI — grade_1\b/g, "SIL — grade_1");

  // Residual word-boundary CI grade tokens (avoid matching inside words).
  t = t.replace(/(^|[^A-Za-zÀ-ÿ])CI([^A-Za-zÀ-ÿ0-9]|$)/g, "$1SIL$2");

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
    return JSON.stringify(country) === JSON.stringify(base) ? undefined : country;
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
  .readdirSync(path.join(ROOT, "locales/fr-SN"))
  .filter((f) => f.endsWith(".json"));
let localeOverrideCount = 0;
for (const file of localeFiles) {
  const sn = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-SN", file), "utf8"));
  const fr = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR", file), "utf8"));
  let transformed = transformValue(sn);

  if (file === "auth.json") {
    transformed = deepMerge(transformed, {
      registration: {
        intent: {
          school_representative: "Représentant d'école / directeur d'école",
        },
      },
    });
  }
  if (file === "school.json") {
    transformed = deepMerge(transformed, {
      portal: {
        roleManager: "Directeur d'école",
        choosePhysicalClass: "Choisissez le groupe-classe",
        colClass: "Groupe-classe",
        classLabel: "Groupe-classe",
        physicalClassReportTitle: "Rapport général du groupe-classe",
        physicalClassReportButton: "Rapport général du groupe-classe",
        physicalClassLoading: "Chargement du rapport général du groupe-classe…",
        createStudentClass: "Classe (groupe-classe à l’école)",
        classesSubtitle:
          "Choisissez le niveau scolaire (SIL–CM2), le groupe-classe et la matière — rapports et gestion par niveau scolaire",
        studentsSubtitle:
          "Parcourez par niveau scolaire et par groupe-classe — rapports sur les enfants sans saisir d’identifiant",
      },
    });
  }
  if (file === "seo.json") {
    transformed = deepMerge(transformed, {
      homeTitle:
        "Leo Kids — Pratique pour les élèves du primaire francophone au Cameroun",
      homeDescription:
        "Pratique des mathématiques, de la géométrie, de l’anglais et des sciences avec suivi des progrès pour les parents au Cameroun (sous-système francophone).",
      learningDescription:
        "Choisissez une matière et un niveau (SIL à CM2) pour commencer à pratiquer.",
    });
  }
  if (file === "ui.json") {
    transformed = deepMerge(transformed, {
      home: {
        subhead:
          "Pratiquez les mathématiques, la géométrie, l’anglais et les sciences — conçus pour les élèves du primaire francophone.",
      },
      public: {
        about: {
          intro1:
            "Le site est conçu pour les élèves du primaire francophone au Cameroun (SIL–CP, CE1–CE2 et CM1–CM2), avec une pratique par matière, niveau, thème et difficulté. Chaque enfant peut commencer là où cela a du sens, progresser progressivement et renforcer les sujets où il a besoin de plus de confiance.",
        },
      },
    });
  }

  const pruned = pruneIdentical(transformed, fr);
  if (!pruned || typeof pruned !== "object" || Object.keys(pruned).length === 0) {
    console.log("SKIP empty locale", file);
    continue;
  }
  ensureDir(path.join(ROOT, "locales/fr-CM"));
  fs.writeFileSync(path.join(ROOT, "locales/fr-CM", file), `${JSON.stringify(pruned, null, 2)}\n`);
  localeOverrideCount += collectStringLeaves(pruned).size;
  console.log("locale", file, "leaves", collectStringLeaves(pruned).size);
}

const snRoot = path.join(ROOT, "content-packs/fr-SN");
const frRoot = path.join(ROOT, "content-packs/fr-FR");
const cmRoot = path.join(ROOT, "content-packs/fr-CM");
const baseExists = (rel) => fs.existsSync(path.join(frRoot, rel));

let packFiles = 0;
let packLeaves = 0;
/** @type {string[]} */
const nearFull = [];
/** @type {string[]} */
const identical = [];
/** @type {string[]} */
const orphans = [];

for (const rel of listJsonRel(snRoot)) {
  const sn = JSON.parse(fs.readFileSync(path.join(snRoot, rel), "utf8"));
  const transformed = transformValue(sn);

  if (isBurnDownIndexPath(rel)) {
    const outPath = path.join(cmRoot, rel);
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
  const base = JSON.parse(fs.readFileSync(path.join(frRoot, authority.baseRel), "utf8"));
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

  const outPath = path.join(cmRoot, rel);
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
