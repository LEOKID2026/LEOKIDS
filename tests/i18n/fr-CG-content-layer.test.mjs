/**
 * fr-CG (Republic of the Congo French) sparse content-layer checks.
 * No registry wiring, build, or full suite.
 *
 * Path distinction (documented; wiring by main agent later):
 *   /cg = Republic of the Congo (fr-CG)
 *   /cd = DR Congo (fr-CD) — must not leak here
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
const LOCALE = "fr-CG";
const BASE = "fr-FR";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** France primary labels that must not remain (bare CP without 1|2, or 6e). */
const FRANCE_GRADE_RE = /\b(CP(?!1|2)|6e)\b/;
/** DR Congo grade/naming leakage. */
const DR_CONGO_LEAK_RE =
  /République démocratique du Congo|Congo-Kinshasa|\bRDC\b|\bDR Congo\b|\bKinshasa\b|\bfr-CD\b|\/cd\b|1re primaire|2e primaire|3e primaire|4e primaire|5e primaire|6e primaire|1re–6e année primaire|1re à 6e année primaire/i;
/** Cameroon / Senegal / Ivory Coast grade codes that are not Congo's. */
const FOREIGN_GRADE_RE = /\bSIL\b|\bEBEP\b|(?<!Côte d’)(?<!CP1–)(?<!CP1 )\bCI\b(?!-)/;
const CG_GRADES = ["CP1", "CP2", "CE1", "CE2", "CM1", "CM2"];
const CG_BANDS = {
  g12: "CP1–CP2",
  g34: "CE1–CE2",
  g56: "CM1–CM2",
};
/** Must not claim French is the only language of the Republic of the Congo. */
const FRENCH_ONLY_CLAIM_RE =
  /(?:seule\s+langue|unique\s+langue|langue\s+unique|seule\s+langue\s+parlée|tout(?:e)?\s+le\s+Congo\s+parle\s+français|représente\s+(?:toute\s+)?(?:la\s+)?République\s+du\s+Congo)/i;
/** Dead Israel-curriculum / Hebrew / homeland / Hellenism residue must not remain as local overrides. */
const DEAD_CURRICULUM_RE =
  /hebrew|homeland|israel|israeli|israël|moledet|hasmon|judea|judaism|hellenism|hellénisme|hébreu|hébraïque|hasmonéen|Judée|judaïsme|patrie|||/i;
/** User-facing DR Congo naming (product strings). Technical /cg vs /cd comments are out of scope. */
const USER_FACING_DR_CONGO_RE =
  /République démocratique du Congo|Congo-Kinshasa|\bRDC\b|\bDR Congo\b|\bKinshasa\b|1re primaire|2e primaire|3e primaire|4e primaire|5e primaire|6e primaire/i;

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

/**
 * @param {string} blob
 * @param {string} label
 */
function assertNoLeakage(blob, label) {
  assert.equal(HEBREW_RE.test(blob), false, `Hebrew in ${label}`);
  assert.equal(DR_CONGO_LEAK_RE.test(blob), false, `DR Congo leak in ${label}`);
  assert.equal(FRENCH_ONLY_CLAIM_RE.test(blob), false, `French-only claim in ${label}`);
}

test("fr-CG documents /cg vs /cd country path distinction", () => {
  const helpIndex = fs.readFileSync(
    path.join(ROOT, "data/help-center", LOCALE, "index.js"),
    "utf8"
  );
  assert.match(helpIndex, /\/cg\s*=\s*Republic of the Congo/);
  assert.match(helpIndex, /\/cd\s*=\s*DR Congo/);
  assert.doesNotMatch(helpIndex, /fr-CD\s*=\s*Republic/);
});

test("fr-CG locale namespaces parse and stay sparse vs fr-FR", () => {
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
  assert.ok(files.includes("auth.json"));
  assert.ok(files.includes("validation.json"));

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
    assertNoLeakage(blob, file);
    assert.equal(FRANCE_GRADE_RE.test(blob), false, `France grade leak in ${file}`);
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

test("fr-CG grade terminology CP1–CM2 (authority-backed; not France/DR Congo)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    CG_GRADES
  );

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    CG_GRADES
  );
  assert.equal(learning.chooseGrade, "Choisis une année");
  assert.equal(learning.master?.gradeFallback, "Année");

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
      worksheets.gradeG6,
    ],
    CG_GRADES
  );
  assert.equal(worksheets.selectGrade, "Année");
  assert.equal(worksheets.gradeField, "Année");
  assert.equal(worksheets.gradeFilterAll, "Toutes les années");
  assert.match(worksheets.createHint || "", /niveau de difficulté/);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /République du Congo/);
  assert.doesNotMatch(seo.homeTitle, /démocratique/i);
  assert.match(seo.learningDescription, /CP1 à CM2/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, FRANCE_GRADE_RE);
  assert.doesNotMatch(allLocaleText, DR_CONGO_LEAK_RE);
  assert.match(allLocaleText, /\bCP1\b/);
  assert.match(allLocaleText, /\bCP2\b/);
  assert.match(allLocaleText, /\bCM2\b/);
});

test("fr-CG année / niveau de difficulté vs groupe-classe distinction", () => {
  const worksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8")
  );
  assert.equal(worksheets.gradeFilterAll, "Toutes les années");
  assert.doesNotMatch(JSON.stringify(worksheets), /Toutes les classes/);
  assert.match(worksheets.createHint || "", /l’année|l'année/);
  assert.match(worksheets.createHint || "", /niveau de difficulté/);

  const learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  assert.equal(learning.master?.gradeFallback, "Année");
  assert.match(learning.chooseGrade || "", /année/i);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.match(school.portal?.classesSubtitle || "", /année scolaire/);
  assert.match(school.portal?.classesSubtitle || "", /groupe-classe/);
  assert.match(school.portal?.classesSubtitle || "", /CP1–CM2/);
  assert.equal(school.portal?.choosePhysicalClass, "Choisissez le groupe-classe");
  assert.equal(school.portal?.colClass, "Groupe-classe");
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /classe scolaire/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /classe physique/);

  const teacher = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8")
  );
  assert.match(JSON.stringify(teacher), /groupe-classe/i);
  assert.match(teacher.dashboard?.createClassPlaceholder || "", /CE1/);
});

test("fr-CG student / teacher / parent terminology", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home?.subhead || "", /élèves/);
  assert.match(ui.parent?.selectGrade || "", /année/);
  assert.match(ui.public?.about?.intro1 || "", /élèves du primaire/);
  assert.match(ui.public?.about?.intro1 || "", /français/);
  assert.match(ui.public?.about?.intro1 || "", /d’autres langues|d'autres langues/);

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.match(auth.registration?.intent?.school_representative || "", /directeur d’école|directeur d'école/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.match(school.portal?.createStudentClass || "", /groupe-classe/);
});

test("fr-CG content packs sparse contract vs fr-FR", () => {
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
  const drCongoHits = [];
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
        if (DR_CONGO_LEAK_RE.test(value)) drCongoHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && DR_CONGO_LEAK_RE.test(value)) {
        drCongoHits.push(`${rel}:${key}`);
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
  assert.deepEqual(franceGradeHits, [], "France CP/6e labels must not remain");
  assert.deepEqual(drCongoHits, [], "DR Congo naming/grade leak");
});

test("fr-CG pack grade labels use CP1–CM2 bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), CG_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, CG_BANDS);

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Mathématiques — CP1");
  assert.equal(titles.meta["math.g2"].bookTitle, "Mathématiques — CP2");
  assert.equal(titles.meta["english.g6"].bookTitle, "Anglais — CM2");
  assert.doesNotMatch(JSON.stringify(titles), /\b6e\b/);
  assert.doesNotMatch(JSON.stringify(titles), DR_CONGO_LEAK_RE);
});

test("fr-CG parent report copy.grade is Année", () => {
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

test("fr-CG help: no empty parent-report file; inherits fr-FR; overlays win", async () => {
  const helpDir = path.join(ROOT, "data/help-center", LOCALE);
  assert.equal(
    fs.existsSync(path.join(helpDir, "parent-report.js")),
    false,
    "empty parent-report override file must not exist"
  );
  assert.ok(fs.existsSync(path.join(helpDir, "parents.js")));
  assert.ok(fs.existsSync(path.join(helpDir, "students.js")));
  assert.ok(fs.existsSync(path.join(helpDir, "subjects.js")));

  const help = await import(`../../data/help-center/fr-CG/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/fr-FR/parents.js");
  const studentsBase = await import("../../data/help-center/fr-FR/students.js");
  const parentReportBase = await import("../../data/help-center/fr-FR/parent-report.js");
  const subjectsBase = await import("../../data/help-center/fr-FR/subjects.js");

  assert.deepEqual(
    Object.keys(help.BY_SECTION_FR_CG).sort(),
    ["parent-report", "parents", "students", "subjects"].sort()
  );
  assert.equal(
    help.BY_SECTION_FR_CG["parent-report"],
    parentReportBase.PARENT_REPORT_ARTICLES,
    "parent-report must be the fr-FR article array by reference (no empty merge)"
  );
  assert.equal(
    help.BY_SECTION_FR_CG["parent-report"].length,
    parentReportBase.PARENT_REPORT_ARTICLES.length
  );
  assert.equal(
    help.ALL_ARTICLES_FR_CG.length,
    parentsBase.PARENT_ARTICLES.length +
      studentsBase.STUDENT_ARTICLES.length +
      parentReportBase.PARENT_REPORT_ARTICLES.length +
      subjectsBase.SUBJECT_ARTICLES.length
  );

  const slugs = help.ALL_ARTICLES_FR_CG.map((a) => a.slug);
  assert.equal(new Set(slugs).size, slugs.length, "no duplicate article slugs/IDs");

  for (const base of parentReportBase.PARENT_REPORT_ARTICLES) {
    const hit = help.BY_SECTION_FR_CG["parent-report"].find((a) => a.slug === base.slug);
    assert.ok(hit, `missing inherited parent-report article ${base.slug}`);
    assert.equal(hit, base);
  }

  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_FR_CG.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }

  const welcome = help.BY_SECTION_FR_CG.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /République du Congo/);
  assert.match(JSON.stringify(welcome), /CP1 au CM2/);
  assert.doesNotMatch(JSON.stringify(welcome), /Congo-Brazzaville/);
  assert.doesNotMatch(JSON.stringify(welcome), /\b6e\b/);
  assert.doesNotMatch(JSON.stringify(welcome), USER_FACING_DR_CONGO_RE);
  assert.doesNotMatch(JSON.stringify(welcome), FRENCH_ONLY_CLAIM_RE);

  const addStudents = help.BY_SECTION_FR_CG.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /choisissez une année/);
  assert.doesNotMatch(addStudents.summary, /choisissez une classe/);
  assert.match(JSON.stringify(addStudents), /CP1 à CM2/);
  assert.match(JSON.stringify(addStudents), /CP1 — grade_1/);
  assert.doesNotMatch(JSON.stringify(addStudents), DR_CONGO_LEAK_RE);

  const editStudent = help.BY_SECTION_FR_CG.parents.find((a) => a.slug === "edit-or-delete-student");
  assert.match(editStudent.summary, /l’année|l'année/);

  const choose = help.BY_SECTION_FR_CG.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.equal(choose.title, "Choisis une matière et une année");
  assert.match(JSON.stringify(choose), /ta année/);
  assert.doesNotMatch(JSON.stringify(choose), /ta classe/);

  const math = help.BY_SECTION_FR_CG.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /CP1 au CM2/);
  assert.match(JSON.stringify(math), /année et un niveau de difficulté/);
  assert.doesNotMatch(JSON.stringify(math), /Choisissez une classe et un niveau/);
  assert.doesNotMatch(JSON.stringify(math), /du CP à la 6e/);

  const geometry = help.BY_SECTION_FR_CG.subjects.find((a) => a.slug === "geometry");
  assert.match(geometry.summary, /du CP1 au CM2/);
  assert.doesNotMatch(geometry.summary, /niveaux 1 à 6/);

  const science = help.BY_SECTION_FR_CG.subjects.find((a) => a.slug === "science");
  assert.match(science.summary, /du CP1 au CM2/);
  assert.doesNotMatch(science.summary, /niveaux 1 à 6/);

  /** Overlay bodies only — index.js may document /cg vs /cd distinction. */
  const helpBlob = [
    fs.readFileSync(path.join(helpDir, "parents.js"), "utf8"),
    fs.readFileSync(path.join(helpDir, "students.js"), "utf8"),
    fs.readFileSync(path.join(helpDir, "subjects.js"), "utf8"),
    JSON.stringify(help.BY_SECTION_FR_CG.parents),
    JSON.stringify(help.BY_SECTION_FR_CG.students),
    JSON.stringify(help.BY_SECTION_FR_CG.subjects),
  ].join("\n");
  assert.doesNotMatch(helpBlob, DR_CONGO_LEAK_RE);
});

test("fr-CG demo false friends: année / joueur / accueil", () => {
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
  assert.deepEqual(Object.values(demo.grades || {}), CG_GRADES);
});

test("fr-CG help students: tu conjugations (no vous forms)", async () => {
  const help = await import(`../../data/help-center/fr-CG/index.js?t=${Date.now() + 1}`);
  const students = help.BY_SECTION_FR_CG.students;
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

test("fr-CG grade-aware report pack: math terms and CP1–CM2 ranges", () => {
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
  assert.match(blob, /CP1–CP2/);
  assert.match(blob, /CE1–CE2/);
  assert.match(blob, /CM1–CM2/);
  assert.doesNotMatch(blob, /niveaux 1 et 2/);
  assert.doesNotMatch(blob, /niveaux 3 et 4/);
  assert.doesNotMatch(blob, /\b6e\b/);
  assert.doesNotMatch(blob, USER_FACING_DR_CONGO_RE);
  assert.doesNotMatch(blob, DEAD_CURRICULUM_RE);
  assert.equal(
    Object.keys(copy).some((k) => DEAD_CURRICULUM_RE.test(k)),
    false,
    "no dead Hebrew/homeland/Israel-curriculum override keys"
  );
});

test("fr-CG does not ship word-meanings/science/learning-book overlays; English targets preserved", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-fr-CG-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "utils/learning-content-fr-CG")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/fr-CG")), false);
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
  assert.match(skills.grades.g6.grammar_comparatives.description, /the best \/ the most interesting/);
  assert.match(skills.grades.g6.grammar_comparatives.description, /CM2/);
  assert.doesNotMatch(skills.grades.g6.grammar_comparatives.description, /\b6e\b/);
});

test("fr-CG no DR Congo / fr-CD leakage across overlays", () => {
  /** Content overlays only — index.js may document /cg vs /cd distinction. */
  const helpContentFiles = ["parents.js", "students.js", "subjects.js"];
  const blobs = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8")
    ),
    ...helpContentFiles.map((f) =>
      fs.readFileSync(path.join(ROOT, "data/help-center", LOCALE, f), "utf8")
    ),
  ].join("\n");
  assert.doesNotMatch(blobs, USER_FACING_DR_CONGO_RE);
  assert.doesNotMatch(blobs, FRENCH_ONLY_CLAIM_RE);
  assert.doesNotMatch(blobs, FOREIGN_GRADE_RE);
  assert.match(blobs, /République du Congo/);
});

test("fr-CG layer has no active Hebrew/homeland/Israel-curriculum local overrides", () => {
  const roots = [
    path.join(ROOT, "locales", LOCALE),
    path.join(ROOT, "content-packs", LOCALE),
    path.join(ROOT, "data/help-center", LOCALE),
  ];
  /** @type {string[]} */
  const hits = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const rel of listJsonRel(root)) {
      const abs = path.join(root, rel);
      const blob = fs.readFileSync(abs, "utf8");
      if (DEAD_CURRICULUM_RE.test(blob) || HEBREW_RE.test(blob)) {
        hits.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
      }
    }
    for (const ent of fs.readdirSync(root)) {
      if (!ent.endsWith(".js")) continue;
      const abs = path.join(root, ent);
      const blob = fs.readFileSync(abs, "utf8");
      if (DEAD_CURRICULUM_RE.test(blob) || HEBREW_RE.test(blob)) {
        hits.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
      }
    }
  }
  assert.deepEqual(hits, [], "dead curriculum residue in fr-CG overlays");
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/help-center", LOCALE, "parent-report.js")),
    false
  );
});

test("fr-CG child/adult register: no tu/vous mix introduced in overlays", () => {
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
  }
});

test("fr-CG layer did not modify other locales or shared runtime", () => {
  const forbiddenTouched = [
    "locales/fr-FR/common.json",
    "locales/fr-CD/common.json",
    "locales/fr-GA/common.json",
    "locales/fr-CI/common.json",
    "locales/fr-CM/common.json",
    "lib/i18n/locale-registry.js",
    "lib/i18n/load-messages.js",
    "lib/content/pack-catalog.js",
    "data/help-center/index.js",
  ];
  // Structural presence check only — content agent must not own these paths.
  for (const rel of forbiddenTouched) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)) || rel.includes("fr-GA"), rel);
  }
  assert.equal(
    fs.existsSync(path.join(ROOT, "locales/fr-CG/common.json")),
    true
  );
  assert.notEqual(LOCALE, "fr-CD");
  assert.notEqual(LOCALE, "fr-FR");
});
