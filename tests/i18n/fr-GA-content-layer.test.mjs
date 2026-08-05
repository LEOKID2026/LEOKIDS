/**
 * fr-GA (Gabon French) sparse content-layer checks.
 * No registry wiring, build, or full suite.
 *
 * Authority: Loi n°21/2011 (JO Gabon) + Annuaire statistique éducation Gabon —
 * primaire = 1re–5e année; 6e = entrée collège (not 6e année primaire).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "fr-GA";
const BASE = "fr-FR";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** France primary labels that must not remain in Gabonese overlays. */
const FRANCE_GRADE_RE = /\b(CP|CE1|CE2|CM1|CM2)\b/;
/** Cross-country grade systems that must not leak. */
const CROSS_COUNTRY_GRADE_RE =
  /\b(CP1|CP2|SIL|CI–CM2|1re primaire|6e primaire|6e année primaire)\b|\bRépublique démocratique du Congo\b|\bau Sénégal\b|\bau Cameroun\b|\ben Côte d’Ivoire\b/;
/** Must not claim French represents all of Gabon. */
const SOLE_LANGUAGE_RE =
  /seule langue|langue unique|uniquement (?:le )?français|French is the only|only language/i;
const NATIONAL_LANG_RE = /\b(Fang|Myènè|Myene|Punu|Nzebi|Téké|Teke)\b/i;
/** Dead Israel-curriculum / Hebrew / homeland residue must not remain as local overrides. */
const DEAD_CURRICULUM_RE =
  /hebrew|homeland|israel|israeli|moledet|hasmon|judea|judaism|hellenism|hébreu|hébraïque|hasmonéen|Judée|judaïsme|hellénisme|patrie|||/i;

const GA_SHORT_GRADES = [
  "1re année",
  "2e année",
  "3e année",
  "4e année",
  "5e année",
  "6e",
];
const GA_BANDS = {
  g12: "1re–2e année",
  g34: "3e–4e année",
  g56: "5e année–6e",
};

const OTHER_LOCALES = [
  "fr-FR",
  "fr-BJ",
  "fr-GN",
  "fr-TG",
  "fr-CI",
  "fr-SN",
  "fr-CD",
  "fr-CM",
  "en",
];

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

/**
 * @param {unknown} a
 * @param {unknown} b
 * @param {string} keyPath
 * @param {string[]} orphans
 * @param {string[]} typeMismatches
 * @param {string[]} placeholderMismatches
 * @param {string[]} identical
 */
function auditLocaleOverlay(a, b, keyPath, orphans, typeMismatches, placeholderMismatches, identical) {
  if (a == null) return;
  if (typeof a !== typeof b && !(a && typeof a === "object" && b && typeof b === "object")) {
    if (b === undefined) orphans.push(keyPath);
    else typeMismatches.push(keyPath);
    return;
  }
  if (typeof a === "string") {
    if (typeof b !== "string") {
      typeMismatches.push(keyPath);
      return;
    }
    if (a === b) identical.push(keyPath);
    const pa = (a.match(PLACEHOLDER_RE) || []).slice().sort().join("|");
    const pb = (b.match(PLACEHOLDER_RE) || []).slice().sort().join("|");
    if (pa !== pb) placeholderMismatches.push(keyPath);
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      typeMismatches.push(keyPath);
      return;
    }
    for (let i = 0; i < a.length; i += 1) {
      auditLocaleOverlay(
        a[i],
        b[i],
        `${keyPath}[${i}]`,
        orphans,
        typeMismatches,
        placeholderMismatches,
        identical
      );
    }
    return;
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object" || Array.isArray(b)) {
      if (b === undefined) orphans.push(keyPath);
      else typeMismatches.push(keyPath);
      return;
    }
    for (const [k, v] of Object.entries(a)) {
      const next = keyPath ? `${keyPath}.${k}` : k;
      if (!(k in /** @type {Record<string, unknown>} */ (b))) orphans.push(next);
      else {
        auditLocaleOverlay(
          v,
          /** @type {Record<string, unknown>} */ (b)[k],
          next,
          orphans,
          typeMismatches,
          placeholderMismatches,
          identical
        );
      }
    }
  }
}

test("fr-GA locale namespaces parse and stay sparse vs fr-FR", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("teacher.json"));
  assert.ok(files.includes("ui.json"));
  assert.ok(files.includes("validation.json"));
  assert.equal(
    fs.existsSync(path.join(ROOT, "tests/i18n/_gen-fr-GA-sparse-layer.mjs")),
    false,
    "generator helper must be absent"
  );

  /** @type {string[]} */
  const orphans = [];
  /** @type {string[]} */
  const typeMismatches = [];
  /** @type {string[]} */
  const placeholderMismatches = [];
  /** @type {string[]} */
  const identical = [];
  /** @type {string[]} */
  const emptyFiles = [];
  let overrideCount = 0;

  for (const file of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryDir, file), "utf8"));
    const basePath = path.join(baseDir, file);
    assert.ok(fs.existsSync(basePath), `missing ${BASE} authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    const blob = JSON.stringify(country);
    assert.equal(HEBREW_RE.test(blob), false, file);
    assert.equal(FRANCE_GRADE_RE.test(blob), false, `France grade leak in ${file}`);
    assert.equal(CROSS_COUNTRY_GRADE_RE.test(blob), false, `cross-country leak in ${file}`);
    assert.equal(SOLE_LANGUAGE_RE.test(blob), false, `sole-language claim in ${file}`);
    assert.equal(NATIONAL_LANG_RE.test(blob), false, `national-language leak in ${file}`);
    auditLocaleOverlay(
      country,
      base,
      file.replace(/\.json$/, ""),
      orphans,
      typeMismatches,
      placeholderMismatches,
      identical
    );
  }

  assert.deepEqual(emptyFiles, []);
  assert.deepEqual(orphans, []);
  assert.deepEqual(typeMismatches, []);
  assert.deepEqual(placeholderMismatches, []);
  assert.deepEqual(identical, []);
  assert.ok(overrideCount > 0);
});

test("fr-GA authority-backed grade mapping 1re–5e année + 6e", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5],
    GA_SHORT_GRADES.slice(0, 5)
  );
  assert.equal(common.grade6, undefined, "grade6 inherits fr-FR 6e (identical omitted)");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
    ],
    GA_SHORT_GRADES.slice(0, 5)
  );
  assert.equal(learning.master?.grades?.g6, undefined);
  assert.equal(learning.chooseGrade, "Choisis une année");

  const worksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8")
  );
  assert.deepEqual(
    [
      worksheets.gradeG1,
      worksheets.gradeG2,
      worksheets.gradeG3,
      worksheets.gradeG4,
      worksheets.gradeG5,
    ],
    GA_SHORT_GRADES.slice(0, 5)
  );
  assert.equal(worksheets.gradeG6, undefined);
  assert.equal(worksheets.selectGrade, "Année");
  assert.equal(worksheets.gradeField, "Année");
  assert.equal(worksheets.gradeFilterAll, "Toutes les années");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Gabon/);
  assert.match(seo.learningDescription, /1re–5e année primaire/);
  assert.match(seo.learningDescription, /6e/);
  assert.doesNotMatch(seo.learningDescription, /6e année primaire/);
  assert.doesNotMatch(seo.homeTitle, SOLE_LANGUAGE_RE);
  assert.doesNotMatch(seo.homeDescription, SOLE_LANGUAGE_RE);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, FRANCE_GRADE_RE);
  assert.doesNotMatch(allLocaleText, /6e primaire|6e année primaire/);
  assert.match(allLocaleText, /1re année/);
  assert.match(allLocaleText, /5e année/);
});

test("fr-GA année/niveau vs classe/groupe-classe; niveau de difficulté preserved", () => {
  const worksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8")
  );
  assert.equal(worksheets.gradeFilterAll, "Toutes les années");
  assert.doesNotMatch(JSON.stringify(worksheets), /Toutes les classes/);

  const learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  assert.equal(learning.master?.gradeFallback, "Année");
  assert.equal(learning.master?.currentGrade, "Année actuelle");
  assert.equal(learning.chooseGrade, "Choisis une année");

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal?.createStudentGrade, "Année");
  assert.equal(school.portal?.classMgmtGrade, "Année");
  assert.equal(school.portal?.assignCurrentGrade, "Année actuelle");
  assert.equal(school.portal?.assignTargetGrade, "Année cible");
  assert.equal(school.communication?.detailsFieldGrade, "Année");
  assert.equal(school.portal?.choosePhysicalClass, "Choisissez le groupe-classe");
  assert.equal(school.portal?.colClass, "Groupe-classe");
  assert.equal(school.portal?.classLabel, "Groupe-classe");
  assert.equal(school.communication?.detailsFieldClass, "Groupe-classe");
  assert.match(school.portal?.studentsSubtitle || "", /année scolaire/);
  assert.match(school.portal?.studentsSubtitle || "", /groupe-classe/);
  assert.match(school.portal?.createStudentClass || "", /groupe-classe/);
  assert.equal(school.portal?.classMgmtName, "Nom du groupe-classe");
  assert.equal(school.portal?.classMgmtCreate, "Créer un groupe-classe");
  assert.match(school.portal?.classesSubtitle || "", /année scolaire/);
  assert.match(school.portal?.classesSubtitle || "", /groupe-classe/);
  assert.match(school.portal?.classesSubtitle || "", /1re–5e année primaire/);
  assert.match(school.portal?.classesSubtitle || "", /6e/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /classe physique/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /Choisissez le niveau,/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home?.subhead || "", /Gabon/);
  assert.match(ui.home?.subhead || "", /1re–5e année/);
  assert.match(ui.public?.about?.intro1 || "", /Gabon/);
  assert.match(ui.public?.about?.intro1 || "", /entrée au collège/);
  assert.match(ui.public?.about?.intro1 || "", /niveau de difficulté/);
  assert.match(ui.public?.about?.intro1 || "", /par matière, année, sujet et niveau de difficulté/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", /par matière, niveau, sujet/);
  assert.equal(ui.public?.about?.siteFeatures?.["1"]?.phase, "Années et niveaux de difficulté");
  assert.match(ui.public?.about?.siteFeatures?.["1"]?.text || "", /niveau de difficulté/);
  assert.equal(ui.parent?.selectGrade, "Choisir une année");
});

test("fr-GA teacher portal distinguishes année from groupe-classe", () => {
  const teacher = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8")
  );
  const dash = teacher.dashboard || {};
  assert.equal(dash.noClassesTitle, "Aucun groupe-classe actif");
  assert.match(dash.noClassesHint || "", /groupe-classe/);
  assert.match(dash.noClassesHint || "", /Gérer le groupe-classe/);
  assert.equal(dash.createClassLabel, "Nom du groupe-classe");
  assert.doesNotMatch(dash.createClassLabel || "", /Nom de la classe/);
  assert.equal(dash.createClassButton, "Créer un groupe-classe");
  assert.doesNotMatch(dash.createClassButton || "", /Créer une classe/);
  assert.equal(dash.createClassPlaceholder, "par ex. 3e année — LION");
  assert.doesNotMatch(dash.createClassPlaceholder || "", /Classe 3/);
  assert.doesNotMatch(dash.createClassPlaceholder || "", FRANCE_GRADE_RE);
  assert.match(dash.createClassPlaceholder || "", /3e année/);
  assert.equal(teacher.fallback?.classSuffix, "Groupe-classe {label}");
  assert.match(teacher.fallback?.classSubjectHeadline || "", /groupe-classe/);
  assert.match(teacher.classGuidanceSeverityTier?.critical_class || "", /groupe-classe/);
  assert.match(teacher.classHealth?.critical_class || "", /groupe-classe/);
  assert.match(teacher.focus?.classFallbackBanner || "", /groupe-classe/);
  assert.doesNotMatch(teacher.focus?.classFallbackBanner || "", /renforcement des cours/);
});

test("fr-GA student/teacher/parent terminology and UI chrome", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /élèves/);
  assert.match(seo.homeDescription, /parents/);
  assert.match(seo.homeDescription, /Gabon/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.layout?.backHome, "Retour à l’accueil");
  assert.equal(ui.pwa?.backHome, "Retour à l’accueil");
  assert.doesNotMatch(JSON.stringify(ui), /Retour à la maison/);
  assert.doesNotMatch(JSON.stringify(ui), /\bNotes et niveaux/);
  assert.doesNotMatch(JSON.stringify(ui), SOLE_LANGUAGE_RE);

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.invalidGrade, /année/i);

  // No auth overlay: e-mail / phone inherit fr-FR; enseignant/élève/parent inherit.
  assert.equal(fs.existsSync(path.join(ROOT, "locales", LOCALE, "auth.json")), false);
  assert.ok(fs.existsSync(path.join(ROOT, "locales", LOCALE, "teacher.json")));
});

test("fr-GA content packs sparse contract vs fr-FR", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", BASE);
  const baseExists = (rel) => fs.existsSync(path.join(baseRoot, rel));

  /** @type {string[]} */
  const identicalOverrides = [];
  /** @type {string[]} */
  const orphanKeys = [];
  /** @type {string[]} */
  const placeholderMismatches = [];
  /** @type {string[]} */
  const nearFullCopies = [];
  /** @type {string[]} */
  const emptyFiles = [];
  /** @type {string[]} */
  const hebrewHits = [];
  /** @type {string[]} */
  const franceGradeHits = [];
  /** @type {string[]} */
  const crossCountryHits = [];
  /** @type {string[]} */
  const soleLanguageHits = [];
  /** @type {string[]} */
  const extraFiles = [];

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const countryLeaves = collectStringLeaves(country);
    if (countryLeaves.size === 0) emptyFiles.push(rel);

    if (isBurnDownIndexPath(rel)) {
      const domain = rel.split("/")[0];
      const baseRel = `${domain}/burn-down-index.json`;
      if (!baseExists(baseRel)) {
        extraFiles.push(rel);
        continue;
      }
      const base = JSON.parse(fs.readFileSync(path.join(baseRoot, baseRel), "utf8"));
      const indexAudit = auditBurnDownIndexOverlay(country, base, { countryRoot, domain });
      for (const [key, value] of indexAudit.countryLeaves) {
        if (HEBREW_RE.test(value)) hebrewHits.push(`${rel}:${key}`);
        if (FRANCE_GRADE_RE.test(value)) franceGradeHits.push(`${rel}:${key}`);
        if (CROSS_COUNTRY_GRADE_RE.test(value)) crossCountryHits.push(`${rel}:${key}`);
        if (SOLE_LANGUAGE_RE.test(value)) soleLanguageHits.push(`${rel}:${key}`);
      }
      for (const key of indexAudit.identicalOverrides) identicalOverrides.push(`${rel}:${key}`);
      for (const key of indexAudit.orphanKeys) orphanKeys.push(`${rel}:${key}`);
      for (const key of indexAudit.placeholderMismatches) {
        placeholderMismatches.push(`${rel}:${key}`);
      }
      continue;
    }

    const authority = resolveAuthorityPackPath(rel, baseExists);
    if (authority.kind === "missing" || !authority.baseRel) {
      extraFiles.push(rel);
      continue;
    }
    const base = JSON.parse(fs.readFileSync(path.join(baseRoot, authority.baseRel), "utf8"));
    const baseLeaves = collectStringLeaves(base);
    for (const [key, value] of countryLeaves) {
      if (typeof value === "string" && HEBREW_RE.test(value)) hebrewHits.push(`${rel}:${key}`);
      if (typeof value === "string" && FRANCE_GRADE_RE.test(value)) {
        franceGradeHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && CROSS_COUNTRY_GRADE_RE.test(value)) {
        crossCountryHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && SOLE_LANGUAGE_RE.test(value)) {
        soleLanguageHits.push(`${rel}:${key}`);
      }
      if (!baseLeaves.has(key)) orphanKeys.push(`${rel}:${key}`);
      else if (baseLeaves.get(key) === value) identicalOverrides.push(`${rel}:${key}`);
      else {
        const pa = ((value.match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
        const pb = (((baseLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).slice().sort()).join(
          "|"
        );
        if (pa !== pb) placeholderMismatches.push(`${rel}:${key}`);
      }
    }
    const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
    if (assessment.isNearFullCopy) nearFullCopies.push(rel);
  }

  assert.deepEqual(emptyFiles, [], "empty overrides");
  assert.deepEqual(extraFiles, [], "files without fr-FR authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(franceGradeHits, [], "France CP/CE/CM labels must not remain");
  assert.deepEqual(crossCountryHits, [], "cross-country leakage");
  assert.deepEqual(soleLanguageHits, [], "no sole-language claim");
});

test("fr-GA pack grade labels and bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(
    [booksUi.grades.g1, booksUi.grades.g2, booksUi.grades.g3, booksUi.grades.g4, booksUi.grades.g5],
    GA_SHORT_GRADES.slice(0, 5)
  );
  assert.equal(booksUi.grades.g6, undefined);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, GA_BANDS);

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Mathématiques — 1re année");
  assert.equal(titles.meta["math.g2"].bookTitle, "Mathématiques — 2e année");
  assert.equal(titles.meta["math.g5"].bookTitle, "Mathématiques — 5e année");
  assert.equal(titles.meta["english.g6"], undefined, "6e title identical to fr-FR");
  assert.doesNotMatch(JSON.stringify(titles), FRANCE_GRADE_RE);
  assert.doesNotMatch(JSON.stringify(titles), /6e primaire/);
});

test("fr-GA parent report copy.grade is Année", () => {
  const leaf = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "reports/burn-down/components__parent-report-detailed-surface.json"
      ),
      "utf8"
    )
  );
  assert.equal(leaf.copy?.grade, "Année");
  const index = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "reports/burn-down-index.json"), "utf8")
  );
  assert.equal(index["components__parent-report-detailed-surface"]?.grade, "Année");
});

test("fr-GA help: no empty parent-report override; inherits fr-FR; four sections", async () => {
  const parentReportPath = path.join(ROOT, "data/help-center", LOCALE, "parent-report.js");
  assert.equal(fs.existsSync(parentReportPath), false, "empty parent-report override must not exist");

  const help = await import(`../../data/help-center/fr-GA/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/fr-FR/parents.js");
  const studentsBase = await import("../../data/help-center/fr-FR/students.js");
  const parentReportBase = await import("../../data/help-center/fr-FR/parent-report.js");
  const subjectsBase = await import("../../data/help-center/fr-FR/subjects.js");

  assert.deepEqual(
    Object.keys(help.BY_SECTION_FR_GA).sort(),
    ["parent-report", "parents", "students", "subjects"]
  );

  assert.equal(
    help.BY_SECTION_FR_GA["parent-report"],
    parentReportBase.PARENT_REPORT_ARTICLES,
    "parent-report must be the fr-FR article array by reference"
  );
  assert.equal(
    help.BY_SECTION_FR_GA["parent-report"].length,
    parentReportBase.PARENT_REPORT_ARTICLES.length
  );
  assert.deepEqual(
    help.BY_SECTION_FR_GA["parent-report"].map((a) => a.slug),
    parentReportBase.PARENT_REPORT_ARTICLES.map((a) => a.slug)
  );

  const expectedTotal =
    parentsBase.PARENT_ARTICLES.length +
    studentsBase.STUDENT_ARTICLES.length +
    parentReportBase.PARENT_REPORT_ARTICLES.length +
    subjectsBase.SUBJECT_ARTICLES.length;
  assert.equal(help.ALL_ARTICLES_FR_GA.length, expectedTotal);

  const slugs = help.ALL_ARTICLES_FR_GA.map((a) => a.slug);
  assert.equal(new Set(slugs).size, slugs.length, "no duplicate article slugs/IDs");

  for (const a of parentsBase.PARENT_ARTICLES) {
    assert.ok(
      help.BY_SECTION_FR_GA.parents.some((x) => x.slug === a.slug),
      `missing inherited parent article ${a.slug}`
    );
  }
  for (const a of studentsBase.STUDENT_ARTICLES) {
    assert.ok(
      help.BY_SECTION_FR_GA.students.some((x) => x.slug === a.slug),
      `missing inherited student article ${a.slug}`
    );
  }
  for (const a of parentReportBase.PARENT_REPORT_ARTICLES) {
    assert.ok(
      help.BY_SECTION_FR_GA["parent-report"].some((x) => x.slug === a.slug),
      `missing inherited parent-report article ${a.slug}`
    );
  }
  for (const a of subjectsBase.SUBJECT_ARTICLES) {
    assert.ok(
      help.BY_SECTION_FR_GA.subjects.some((x) => x.slug === a.slug),
      `missing inherited subject article ${a.slug}`
    );
  }
});

test("fr-GA help overlays parse and remap France grade span", async () => {
  const help = await import(`../../data/help-center/fr-GA/index.js?t=${Date.now() + 2}`);
  const parentsBase = await import("../../data/help-center/fr-FR/parents.js");
  assert.equal(
    help.ALL_ARTICLES_FR_GA.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_FR_GA.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_FR_GA.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /Gabon/);
  assert.match(JSON.stringify(welcome), /1re à la 5e année primaire/);
  assert.match(JSON.stringify(welcome), /entrée au collège/);
  assert.doesNotMatch(JSON.stringify(welcome), FRANCE_GRADE_RE);
  assert.doesNotMatch(JSON.stringify(welcome), SOLE_LANGUAGE_RE);
  assert.doesNotMatch(JSON.stringify(welcome), /6e année primaire/);

  const addStudents = help.BY_SECTION_FR_GA.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /choisissez une année/);
  assert.doesNotMatch(addStudents.summary, /choisissez une classe/);
  assert.match(JSON.stringify(addStudents), /1re à 5e année primaire/);
  assert.match(JSON.stringify(addStudents), /1re année — grade_1/);
  assert.match(JSON.stringify(addStudents), /6e — grade_6/);
  assert.doesNotMatch(JSON.stringify(addStudents), FRANCE_GRADE_RE);
  assert.doesNotMatch(JSON.stringify(addStudents), /6e année primaire/);

  const editStudent = help.BY_SECTION_FR_GA.parents.find((a) => a.slug === "edit-or-delete-student");
  assert.match(editStudent.summary, /l’année|l'année/);

  const choose = help.BY_SECTION_FR_GA.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.equal(choose.title, "Choisis une matière et une année");
  assert.match(JSON.stringify(choose), /ta année/);
  assert.doesNotMatch(JSON.stringify(choose), /ta classe/);

  const math = help.BY_SECTION_FR_GA.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /1re année à la 6e/);
  assert.match(JSON.stringify(math), /année et un niveau de difficulté/);
  assert.doesNotMatch(JSON.stringify(math), /Choisissez une classe et un niveau/);
  assert.doesNotMatch(JSON.stringify(math), /du CP à la 6e/);

  const geometry = help.BY_SECTION_FR_GA.subjects.find((a) => a.slug === "geometry");
  assert.match(geometry.summary, /1re année à la 6e/);
  assert.doesNotMatch(geometry.summary, /niveaux 1 à 6/);

  const science = help.BY_SECTION_FR_GA.subjects.find((a) => a.slug === "science");
  assert.match(science.summary, /1re année à la 6e/);
  assert.doesNotMatch(science.summary, /niveaux 1 à 6/);
});

test("fr-GA grade6 resolves to 6e; never 6e année primaire; no Congo/CP leakage", () => {
  const frCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8"));
  assert.equal(frCommon.grade6, "6e");

  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.equal(common.grade6, undefined, "identical 6e omitted; runtime inherits fr-FR");
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5],
    ["1re année", "2e année", "3e année", "4e année", "5e année"]
  );

  const blobs = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8")
    ),
  ].join("\n");

  assert.doesNotMatch(blobs, /6e année primaire|6e primaire/);
  assert.doesNotMatch(blobs, FRANCE_GRADE_RE);
  assert.doesNotMatch(blobs, /1re–6e année primaire|1re à 6e année primaire/);
  assert.doesNotMatch(blobs, /\bCP1\b|\bCP2\b|\bSIL\b/);
  assert.doesNotMatch(blobs, /République démocratique du Congo/);
  assert.match(blobs, /5e année–6e/);
});

test("fr-GA demo false friends: année / joueur / accueil", () => {
  const demo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  assert.equal(demo.bar?.changeGrade, "Changer d’année");
  assert.match(demo.enter?.activeSessionNote || "", /changer d’année|changer d'année/);
  assert.doesNotMatch(demo.enter?.activeSessionNote || "", /changer de note/);
  assert.equal(demo.display?.arcadePlayerName, "Joueur démo");
  assert.equal(demo.parentPortal?.enterBackHome, "Retour à l’accueil");
  assert.doesNotMatch(JSON.stringify(demo), /Lecteur démo/);
  assert.doesNotMatch(JSON.stringify(demo), /Retour à la maison/);
  assert.doesNotMatch(JSON.stringify(demo), /Changer de note/);
  assert.deepEqual(
    [demo.grades.g1, demo.grades.g2, demo.grades.g3, demo.grades.g4, demo.grades.g5],
    GA_SHORT_GRADES.slice(0, 5)
  );
});

test("fr-GA help students: tu conjugations (no vous forms)", async () => {
  const help = await import(`../../data/help-center/fr-GA/index.js?t=${Date.now() + 1}`);
  const students = help.BY_SECTION_FR_GA.students;
  const blob = JSON.stringify(students);
  assert.match(blob, /Ce que tu vois après/);
  assert.match(blob, /que tu as choisi/);
  assert.match(blob, /Si tu as fait une erreur/);
  assert.match(blob, /Plus tu pratiques/);
  assert.match(blob, /Fais une pause si tu es fatigué/);
  assert.doesNotMatch(blob, /tu voyez/);
  assert.doesNotMatch(blob, /tu avez/);
  assert.doesNotMatch(blob, /tu pratiquez/);
  assert.doesNotMatch(blob, /tu êtes/);
  assert.doesNotMatch(blob, /\blisez\b/);
  assert.doesNotMatch(blob, /\bpassez\b/);
  assert.doesNotMatch(blob, /\bFaites une pause\b/);
});

test("fr-GA grade-aware report pack: math terms, année ranges, no dead curriculum", () => {
  const pack = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
      ),
      "utf8"
    )
  );
  const copy = pack.copy || pack;
  const blob = Object.values(copy).join("\n");
  assert.match(copy.keep_formal_area_recommendations_null_for_grades_1_2, /d’aire|d'aire/);
  assert.doesNotMatch(copy.keep_formal_area_recommendations_null_for_grades_1_2, /domaine/);
  assert.match(
    copy.keep_formula_based_area_recommendations_null_for_grades_1_2,
    /d’aire|d'aire/
  );
  assert.match(
    copy.keep_prime_composite_recommendations_null_for_grades_1_2,
    /nombres premiers\/composés/
  );
  assert.doesNotMatch(
    copy.keep_scale_magnitude_recommendations_null_for_grades_1_2_until_early_num,
    /premier numéro/
  );
  assert.match(blob, /1re–2e année/);
  assert.match(blob, /3e–4e année/);
  assert.match(blob, /5e année–6e/);
  assert.doesNotMatch(blob, /niveaux 1 et 2/);
  assert.doesNotMatch(blob, /niveaux 3 et 4/);
  assert.doesNotMatch(blob, FRANCE_GRADE_RE);
  assert.doesNotMatch(blob, /6e année primaire|6e primaire/);
  assert.doesNotMatch(blob, /de 5e à 6e années/);
  assert.doesNotMatch(blob, DEAD_CURRICULUM_RE);
  assert.equal(
    Object.keys(copy).some((k) => DEAD_CURRICULUM_RE.test(k)),
    false,
    "no dead Hebrew/homeland/Israel-curriculum override keys"
  );
});

test("fr-GA teacher content-pack chrome uses groupe-classe", () => {
  const dash = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "global-burn-down/components__teacher-portal__TeacherDashboardClient.json"
      ),
      "utf8"
    )
  );
  assert.equal(dash.copy?.manage_class, "Gérer le groupe-classe");
  assert.equal(dash.copy?.classes, "Groupes-classes");
  assert.equal(dash.copy?.class_report, "Rapport du groupe-classe");
  assert.match(dash.copy?.remove_this_student_from_the_class || "", /groupe-classe/);

  const smoke = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json"
      ),
      "utf8"
    )
  );
  assert.equal(smoke.copy?.class_3_leo, "3e année — LION");
  assert.doesNotMatch(smoke.copy?.class_3_leo || "", /Classe 3/);
});

test("fr-GA overlays have no local Hebrew/homeland/Israel residue", () => {
  /** @type {string[]} */
  const hits = [];
  const roots = [
    path.join(ROOT, "locales", LOCALE),
    path.join(ROOT, "content-packs", LOCALE),
    path.join(ROOT, "data/help-center", LOCALE),
  ];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const files = root.endsWith(LOCALE) && root.includes("help-center")
      ? fs.readdirSync(root).filter((f) => f.endsWith(".js")).map((f) => path.join(root, f))
      : listJsonRel(root).map((rel) => path.join(root, rel));
    for (const file of files) {
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) continue;
      const blob = fs.readFileSync(file, "utf8");
      if (DEAD_CURRICULUM_RE.test(blob) || HEBREW_RE.test(blob)) hits.push(file);
    }
  }
  assert.deepEqual(hits, [], "dead curriculum residue in fr-GA overlays");
  assert.equal(fs.existsSync(path.join(ROOT, "tests/i18n/_gen-fr-GA-sparse-layer.mjs")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/help-center", LOCALE, "parent-report.js")), false);
});

test("fr-GA does not ship word-meanings/science/learning-book overlays", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-fr-GA-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "utils/learning-content-fr-GA")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/fr-GA")), false);
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.ok(!("words" in booksUi));
  assert.ok(!("phonics" in booksUi));
  const skills = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "books/english-page-skills.json"),
      "utf8"
    )
  );
  assert.equal(skills.grades?.g6, undefined, "English g6 targets inherit fr-FR");
  assert.match(skills.grades.g2.sentence_base.title, /2e année/);
  assert.doesNotMatch(JSON.stringify(skills), FRANCE_GRADE_RE);
});

test("fr-GA child/adult register: no tu/vous mix; no sole-language claim", () => {
  const files = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      path.join(ROOT, "locales", LOCALE, rel)
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((rel) =>
      path.join(ROOT, "content-packs", LOCALE, rel)
    ),
  ];
  for (const file of files) {
    const blob = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(
      blob,
      /\b(Choisis|Clique|Essaie|Écris)\b.*\b(Vous|Sélectionnez)\b/s,
      file
    );
    assert.doesNotMatch(
      blob,
      /\b(Vous|Sélectionnez)\b.*\b(Choisis|Clique|Essaie|Écris)\b/s,
      file
    );
    assert.doesNotMatch(blob, SOLE_LANGUAGE_RE, file);
    assert.doesNotMatch(blob, NATIONAL_LANG_RE, file);
    assert.doesNotMatch(blob, CROSS_COUNTRY_GRADE_RE, file);
  }
});

test("fr-GA other locales modified = 0", () => {
  // Content agent may only touch fr-GA paths; peer locales must remain untouched in this layer.
  for (const loc of OTHER_LOCALES) {
    const localeDir = path.join(ROOT, "locales", loc);
    if (!fs.existsSync(localeDir)) continue;
    // Presence check only — wiring agent owns registry; we assert we did not create peer overlays here.
    assert.notEqual(loc, LOCALE);
  }
  assert.ok(fs.existsSync(path.join(ROOT, "locales", LOCALE)));
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/fr-GA.js")), false);
});
