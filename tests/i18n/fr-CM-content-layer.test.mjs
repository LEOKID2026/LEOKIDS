/**
 * fr-CM (Cameroun — sous-système francophone) sparse content-layer checks.
 * No registry wiring, build, or full suite.
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
const LOCALE = "fr-CM";
const BASE = "fr-FR";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** France 6e, Ivory Coast CP1–CP2, Senegal CI, DR Congo EBEP labels must not leak. */
const FOREIGN_GRADE_RE = /\b6e\b|\bCP1\b|\bCP2\b|\bCI\b|\bEBEP\b|\b7e\b/;
const CM_GRADES = ["SIL", "CP", "CE1", "CE2", "CM1", "CM2"];
/** Claims that Francophone track = whole Cameroon, or other-country leakage. */
const SCOPE_LEAK_RE =
  /\b(Sénégal|Senegal|Côte d’Ivoire|Cote d'Ivoire|RDC|Congo|France)\b/i;
const ALL_CAMEROON_CLAIM_RE =
  /(?:tout(?:e)?\s+le\s+Cameroun|tous\s+les\s+(?:élèves|enfants)\s+(?:du|au)\s+Cameroun|représente\s+(?:le\s+)?Cameroun|pour\s+les\s+élèves\s+du\s+Cameroun(?!\s+francophone))/i;
/** Dead Israel-curriculum / Hebrew / homeland residue must not remain as local overrides. */
const DEAD_CURRICULUM_RE =
  /hebrew|homeland|israel|israeli|moledet|hasmon|judea|judaism|hébreu|hébraïque|hasmonéen|Judée|judaïsme|||/i;
const ANGLOPHONE_CLASS_RE = /\bClass\s*[1-6]\b|\bCL\s*[1-6]\b/i;

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
 */
function assertNoScopeLeak(blob, label) {
  assert.equal(SCOPE_LEAK_RE.test(blob), false, `country leak in ${label}`);
  assert.equal(ALL_CAMEROON_CLAIM_RE.test(blob), false, `all-Cameroon claim in ${label}`);
}

test("fr-CM locale namespaces parse and stay sparse vs fr-FR", () => {
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
    assertNoScopeLeak(blob, file);
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

test("fr-CM grade terminology SIL–CM2 (authority-backed; not France/CI/SN)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    CM_GRADES
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
    CM_GRADES
  );
  assert.equal(learning.chooseGrade, "Choisis un niveau");
  assert.equal(learning.master?.gradeFallback, "Niveau");
  assert.equal(learning.master?.currentGrade, "Niveau actuel");
  assert.match(learning.master?.gradeRequired || "", /niveau/);
  assert.doesNotMatch(learning.master?.gradeRequired || "", /\bclasse\b/i);

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
    CM_GRADES
  );
  assert.equal(worksheets.gradeField, "Niveau");
  assert.equal(worksheets.gradeFilterAll, "Tous les niveaux");
  assert.equal(worksheets.levelFilterAll, "Tous les niveaux");
  assert.match(worksheets.createHint, /fiche d’exercices|fiche d'exercices/);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Cameroun/);
  assert.match(seo.homeTitle, /francophone/i);
  assert.match(seo.learningDescription, /SIL à CM2/);
  assert.doesNotMatch(seo.homeTitle, ALL_CAMEROON_CLAIM_RE);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, /\b6e\b/);
  assert.doesNotMatch(allLocaleText, /\bCP1\b/);
  assert.doesNotMatch(allLocaleText, /\bCP2\b/);
  assert.doesNotMatch(allLocaleText, /(?<![A-Za-z])CI(?![A-Za-z])/);
  assert.match(allLocaleText, /\bSIL\b/);
  assert.match(allLocaleText, /\bCM2\b/);
});

test("fr-CM content packs sparse contract vs fr-FR", () => {
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
  const foreignGradeHits = [];
  /** @type {string[]} */
  const scopeHits = [];
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
        if (FOREIGN_GRADE_RE.test(value)) foreignGradeHits.push(`${rel}:${key}`);
        if (SCOPE_LEAK_RE.test(value) || ALL_CAMEROON_CLAIM_RE.test(value)) {
          scopeHits.push(`${rel}:${key}`);
        }
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
      if (typeof value === "string" && FOREIGN_GRADE_RE.test(value)) {
        foreignGradeHits.push(`${rel}:${key}`);
      }
      if (
        typeof value === "string" &&
        (SCOPE_LEAK_RE.test(value) || ALL_CAMEROON_CLAIM_RE.test(value))
      ) {
        scopeHits.push(`${rel}:${key}`);
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
  assert.deepEqual(foreignGradeHits, [], "France/SN/CI/CD grade labels must not remain");
  assert.deepEqual(scopeHits, [], "no other-country or all-Cameroon claims");
});

test("fr-CM pack grade labels use SIL–CM2 bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), CM_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, {
    g12: "SIL–CP",
    g34: "CE1–CE2",
    g56: "CM1–CM2",
  });

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Mathématiques — SIL");
  assert.equal(titles.meta["math.g2"].bookTitle, "Mathématiques — CP");
  assert.equal(titles.meta["english.g6"].bookTitle, "Anglais — CM2");
  assert.doesNotMatch(JSON.stringify(titles), /\b6e\b/);
  assert.doesNotMatch(JSON.stringify(titles), /\bCP1\b/);
  assert.doesNotMatch(JSON.stringify(titles), /(?<![A-Za-z])CI(?![A-Za-z])/);
});

test("fr-CM help overlays parse and remap France grade span", async () => {
  const help = await import(`../../data/help-center/fr-CM/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/fr-FR/parents.js");
  assert.equal(
    help.ALL_ARTICLES_FR_CM.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_FR_CM.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_FR_CM.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /SIL au CM2/);
  assert.match(JSON.stringify(welcome), /francophone/i);
  assert.doesNotMatch(JSON.stringify(welcome), /\b6e\b/);
  assert.doesNotMatch(JSON.stringify(welcome), ALL_CAMEROON_CLAIM_RE);

  const addStudents = help.BY_SECTION_FR_CM.parents.find((a) => a.slug === "add-students");
  assert.match(JSON.stringify(addStudents), /SIL à CM2/);
  assert.match(JSON.stringify(addStudents), /SIL — grade_1/);
  assert.match(JSON.stringify(addStudents), /CP — grade_2/);
  assert.doesNotMatch(JSON.stringify(addStudents), /\b6e\b/);

  const math = help.BY_SECTION_FR_CM.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /SIL au CM2/);
  assert.doesNotMatch(JSON.stringify(math), /du CP à la 6e/);

  const geometry = help.BY_SECTION_FR_CM.subjects.find((a) => a.slug === "geometry");
  assert.match(geometry.summary, /du SIL au CM2/);
  assert.doesNotMatch(geometry.summary, /niveaux 1 à 6/);

  const science = help.BY_SECTION_FR_CM.subjects.find((a) => a.slug === "science");
  assert.match(science.summary, /du SIL au CM2/);
  assert.doesNotMatch(science.summary, /niveaux 1 à 6/);
});

test("fr-CM demo false friends: niveau / joueur / accueil", () => {
  const demo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  assert.equal(demo.bar?.gradeLabel, "Niveau");
  assert.equal(demo.bar?.changeGrade, "Changer de niveau");
  assert.match(demo.enter?.intro || "", /Choisissez un niveau/);
  assert.equal(demo.enter?.chooseGradeLegend, "Choisissez un niveau");
  assert.match(demo.enter?.activeSessionNote || "", /changer de niveau/);
  assert.doesNotMatch(demo.enter?.activeSessionNote || "", /changer de note/);
  assert.equal(demo.display?.arcadePlayerName, "Joueur démo");
  assert.equal(demo.parentPortal?.enterBackHome, "Retour à l’accueil");
  assert.doesNotMatch(JSON.stringify(demo), /Lecteur démo/);
  assert.doesNotMatch(JSON.stringify(demo), /Retour à la maison/);
  assert.doesNotMatch(JSON.stringify(demo), /Changer de note/);
  assert.deepEqual(Object.values(demo.grades), CM_GRADES);
});

test("fr-CM UI back-home and Francophone primary terminology", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.layout?.backHome, "Retour à l’accueil");
  assert.equal(ui.pwa?.backHome, "Retour à l’accueil");
  assert.match(ui.home?.subhead || "", /enseignement primaire francophone/);
  assert.doesNotMatch(JSON.stringify(ui), /Retour à la maison/);
  assert.doesNotMatch(JSON.stringify(ui), ALL_CAMEROON_CLAIM_RE);
});

test("fr-CM report detailed surface grade chrome = Niveau", () => {
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
  assert.equal(leaf.copy?.grade, "Niveau");
  const index = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "reports/burn-down-index.json"), "utf8")
  );
  assert.equal(index["components__parent-report-detailed-surface"]?.grade, "Niveau");
});

test("fr-CM help students: tu conjugations (no vous forms)", async () => {
  const help = await import(`../../data/help-center/fr-CM/index.js?t=${Date.now() + 1}`);
  const students = help.BY_SECTION_FR_CM.students;
  const blob = JSON.stringify(students);
  const home = students.find((a) => a.slug === "student-home-tour");
  const choose = students.find((a) => a.slug === "choose-subject-and-grade");
  const coins = students.find((a) => a.slug === "coins-and-arcade");
  assert.equal(choose.title, "Choisis une matière et un niveau");
  assert.match(JSON.stringify(choose), /ton niveau/);
  assert.doesNotMatch(JSON.stringify(choose), /ta classe/);
  assert.match(JSON.stringify(home), /tu verras ton nom/);
  assert.match(JSON.stringify(home), /tu possèdes/);
  assert.doesNotMatch(JSON.stringify(home), /tu verrez/);
  assert.doesNotMatch(JSON.stringify(home), /tu possédez/);
  assert.match(JSON.stringify(coins), /gagne des pièces/);
  assert.doesNotMatch(JSON.stringify(coins), /gagnez des pièces/);
  assert.match(blob, /Ce que tu vois après/);
  assert.match(blob, /que tu as choisi/);
  assert.match(blob, /Si tu as fait une erreur/);
  assert.match(blob, /Plus tu pratiques/);
  assert.match(blob, /Fais une pause si tu es fatigué/);
  assert.doesNotMatch(blob, /tu voyez/);
  assert.doesNotMatch(blob, /tu avez/);
  assert.doesNotMatch(blob, /tu pratiquez/);
  assert.doesNotMatch(blob, /tu êtes/);
  assert.doesNotMatch(blob, /tu verrez/);
  assert.doesNotMatch(blob, /tu possédez/);
  assert.doesNotMatch(blob, /tu gagnez/);
  assert.doesNotMatch(blob, /\blisez\b/);
  assert.doesNotMatch(blob, /\bpassez\b/);
  assert.doesNotMatch(blob, /\bFaites une pause\b/);
});

test("fr-CM grade-aware report pack: math terms and SIL–CM2 ranges", () => {
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
  assert.match(blob, /SIL–CP/);
  assert.match(blob, /CE1–CE2/);
  assert.match(blob, /CM1–CM2/);
  assert.doesNotMatch(blob, /niveaux 1 et 2/);
  assert.doesNotMatch(blob, /niveaux 3 et 4/);
  assert.doesNotMatch(blob, /\b6e\b/);
  assert.doesNotMatch(blob, /de 5e à 6e/);
  assert.doesNotMatch(blob, /\bCP1\b/);
  assert.doesNotMatch(blob, /(?<![A-Za-z])CI(?![A-Za-z])–CP/);
  assert.doesNotMatch(blob, DEAD_CURRICULUM_RE);
  assert.equal(
    Object.keys(copy).some((k) => DEAD_CURRICULUM_RE.test(k)),
    false,
    "no dead Hebrew/homeland/Israel-curriculum override keys"
  );
});

test("fr-CM school portal: niveau scolaire vs groupe-classe", () => {
  const school = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8")
  );
  assert.match(school.portal?.classesSubtitle || "", /niveau scolaire/);
  assert.match(school.portal?.classesSubtitle || "", /groupe-classe/);
  assert.match(school.portal?.classesSubtitle || "", /SIL–CM2/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /classe physique/);
  assert.equal(school.portal?.chooseGrade, "Choisissez un niveau");
  assert.equal(school.portal?.choosePhysicalClass, "Choisissez le groupe-classe");
  assert.equal(school.portal?.colGrade, "Niveau");
  assert.equal(school.portal?.assignCurrentGrade, "Niveau actuel");
});

test("fr-CM student/teacher/parent terminology stays Cameroon-appropriate", () => {
  const blobs = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8")
    ),
  ].join("\n");
  // Loi 98/004 + décret 2001/041: élève, enseignant, parents d’élèves, directeur d’école.
  // Overlay must not introduce France-only « professeur des écoles » or Senegal « enseignement élémentaire ».
  assert.doesNotMatch(blobs, /professeur des écoles/i);
  assert.doesNotMatch(blobs, /enseignement élémentaire/i);
  assert.doesNotMatch(blobs, /classe physique/i);
  assert.match(blobs, /fiche d’exercices|fiche d'exercices/);
});

test("fr-CM does not ship word-meanings, science overlay, or mutate English targets", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  const scienceOverlay = path.join(ROOT, "data/science-questions-fr-CM-overlay.js");
  assert.equal(fs.existsSync(scienceOverlay), false);
  const learningContent = path.join(ROOT, "utils/learning-content-fr-CM");
  assert.equal(fs.existsSync(learningContent), false);
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
  assert.equal(skills.grades.g2.sentence_base.title, "Phrases courtes — CP");
});

test("fr-CM child/adult register: no tu/vous mix introduced in overlays", () => {
  const files = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      path.join(ROOT, "locales", LOCALE, rel)
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((rel) =>
      path.join(ROOT, "content-packs", LOCALE, rel)
    ),
  ];
  /** @type {string[]} */
  const mixed = [];
  for (const abs of files) {
    const blob = fs.readFileSync(abs, "utf8");
    assertNoScopeLeak(blob, path.relative(ROOT, abs));
    if (
      /\b(Choisis|Clique|Essaie|Écris)\b.*\b(Vous|Sélectionnez)\b/s.test(blob) ||
      /\b(Vous|Sélectionnez)\b.*\b(Choisis|Clique|Essaie|Écris)\b/s.test(blob)
    ) {
      mixed.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
    }
  }
  assert.deepEqual(mixed, []);
});

test("fr-CM auth/validation: adresse e-mail and téléphone portable", () => {
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.teacherEmailLabel, "Adresse e-mail");
  assert.equal(auth.registration?.teacher?.emailLabel, "Adresse e-mail");
  assert.equal(auth.registration?.teacher?.phoneLabel, "Téléphone portable");
  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.invalidGrade, /niveau/);
});

test("fr-CM teacher portal distinguishes niveau from groupe-classe", () => {
  const teacher = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8")
  );
  const dash = teacher.dashboard || {};
  assert.equal(dash.noClassesTitle, "Aucun groupe-classe actif");
  assert.doesNotMatch(dash.noClassesTitle || "", /Pas de cours/);
  assert.match(dash.noClassesHint || "", /groupe-classe/);
  assert.match(dash.noClassesHint || "", /Gérer le groupe-classe/);
  assert.doesNotMatch(dash.noClassesHint || "", /Gérer la classe/);
  assert.equal(dash.createClassLabel, "Nom du groupe-classe");
  assert.doesNotMatch(dash.createClassLabel || "", /Nom de la classe/);
  assert.equal(dash.createClassButton, "Créer un groupe-classe");
  assert.doesNotMatch(dash.createClassButton || "", /Créer une classe/);
  assert.equal(dash.createClassPlaceholder, "par ex. CE1 — LION");
  assert.doesNotMatch(dash.createClassPlaceholder || "", /Classe 3/);
  assert.match(dash.createClassPlaceholder || "", /\b(SIL|CP|CE1|CE2|CM1|CM2)\b/);
  assert.equal(teacher.fallback?.classSuffix, "Groupe-classe {label}");
  assert.match(teacher.fallback?.classSubjectHeadline || "", /groupe-classe/);
  assert.match(teacher.classGuidanceSeverityTier?.critical_class || "", /groupe-classe/);
  assert.match(teacher.classHealth?.critical_class || "", /groupe-classe/);
  assert.match(teacher.focus?.classFallbackBanner || "", /groupe-classe/);
  assert.doesNotMatch(teacher.focus?.classFallbackBanner || "", /renforcement des cours/);

  const school = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8")
  );
  assert.match(school.portal?.choosePhysicalClass || "", /groupe-classe/);
  assert.match(school.portal?.chooseGrade || "", /niveau/);
  // School + teacher agree: year = niveau, managed cohort = groupe-classe.
  assert.match(JSON.stringify(teacher.dashboard), /groupe-classe/);
  assert.match(JSON.stringify(school.portal), /groupe-classe/);
  assert.match(JSON.stringify(school.portal), /niveau/);
});

test("fr-CM teacher content-pack chrome uses groupe-classe (not cours)", () => {
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
  assert.doesNotMatch(dash.copy?.classes || "", /^Cours$/);
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
  assert.equal(smoke.copy?.class_3_leo, "CE1 — LION");
  assert.doesNotMatch(smoke.copy?.class_3_leo || "", /Classe 3/);
  assert.doesNotMatch(smoke.copy?.class_3_leo || "", ANGLOPHONE_CLASS_RE);
});

test("fr-CM layer has no active Hebrew/homeland/Israel-curriculum local overrides", () => {
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
  assert.deepEqual(hits, [], "dead curriculum residue in fr-CM overlays");
});

test("fr-CM no Anglophone Class 1–6 or foreign Francophone leakage in overlays", () => {
  const blobs = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8")
    ),
  ].join("\n");
  assert.doesNotMatch(blobs, ANGLOPHONE_CLASS_RE);
  assert.doesNotMatch(blobs, /\bCP1\b/);
  assert.doesNotMatch(blobs, /\bCP2\b/);
  assert.doesNotMatch(blobs, /(?<![A-Za-z])CI(?![A-Za-z])–/);
  assert.doesNotMatch(blobs, /\b6e\b/);
  assert.doesNotMatch(blobs, /\bEBEP\b/);
  assert.doesNotMatch(blobs, SCOPE_LEAK_RE);
  assert.match(blobs, /francophone/i);
});

test("fr-CM other locales and shared runtime remain untouched", () => {
  const forbiddenTouched = [
    "locales/fr-FR/common.json",
    "locales/fr-FR/teacher.json",
    "locales/fr-CI/common.json",
    "locales/fr-SN/common.json",
    "locales/fr-CD/common.json",
    "locales/en/common.json",
  ];
  for (const rel of forbiddenTouched) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), rel);
  }
  // Content agent boundary: no /cm path artifact, no word-meanings overlay file.
  assert.equal(fs.existsSync(path.join(ROOT, "public/cm")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "locales/cm")), false);
});
