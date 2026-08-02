/**
 * fr-CD (DR Congo French) sparse content-layer checks.
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
const LOCALE = "fr-CD";
const BASE = "fr-FR";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** France primary labels that must not remain in Congolese overlays. */
const FRANCE_GRADE_RE = /\b(CP|CE1|CE2|CM1|CM2)\b|\b6e\b(?! (?:année )?primaire)|\bcollège\b/;
/** National languages must not leak into fr-CD chrome. */
const NATIONAL_LANG_RE = /\b(Lingala|Kikongo|Swahili|Tshiluba)\b/i;
const CD_SHORT_GRADES = [
  "1re primaire",
  "2e primaire",
  "3e primaire",
  "4e primaire",
  "5e primaire",
  "6e primaire",
];
const CD_BANDS = {
  g12: "1re–2e année primaire",
  g34: "3e–4e année primaire",
  g56: "5e–6e année primaire",
};

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

test("fr-CD locale namespaces parse and stay sparse vs fr-FR", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("auth.json"));
  assert.ok(files.includes("ui.json"));
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
    assert.equal(HEBREW_RE.test(blob), false, file);
    assert.equal(FRANCE_GRADE_RE.test(blob), false, `France grade leak in ${file}`);
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

test("fr-CD grade terminology 1re–6e année primaire (short/full)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    CD_SHORT_GRADES
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
    CD_SHORT_GRADES
  );
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
      worksheets.gradeG6,
    ],
    CD_SHORT_GRADES
  );
  assert.equal(worksheets.selectGrade, "Année");
  assert.equal(worksheets.gradeField, "Année");
  assert.equal(worksheets.gradeFilterAll, "Toutes les années");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /République démocratique du Congo/);
  assert.match(seo.learningDescription, /1re à 6e année primaire/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, FRANCE_GRADE_RE);
  assert.match(allLocaleText, /1re primaire/);
  assert.match(allLocaleText, /6e primaire/);
  assert.match(allLocaleText, /année primaire|Choisissez une année|toutes les années/i);
});

test("fr-CD worksheets/learning/school année vs groupe-classe", () => {
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
  assert.match(school.portal?.classesSubtitle || "", /année scolaire/);
  assert.match(school.portal?.classesSubtitle || "", /groupe-classe/);
  assert.match(school.portal?.classesSubtitle || "", /1re–6e année primaire/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /classe physique/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /Choisissez le niveau,/);
});

test("fr-CD Congolese French: téléphone portable, e-mail inherited, no courriel", () => {
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.registration?.teacher?.phoneLabel, "Numéro de téléphone portable");
  assert.equal(auth.email, undefined, "e-mail chrome inherits fr-FR");

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, /courriel/i);
  assert.doesNotMatch(allLocaleText, /cellulaire|GSM/i);
  assert.doesNotMatch(allLocaleText, NATIONAL_LANG_RE);

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.invalidGrade, /année/i);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.parent?.selectGrade, "Choisir une année");
});

test("fr-CD UI/PWA backHome and about année (not maison / grade-as-niveau)", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.layout?.backHome, "Retour à l’accueil");
  assert.equal(ui.pwa?.backHome, "Retour à l’accueil");
  assert.match(ui.public?.about?.intro1 || "", /par matière, année, sujet et niveau de difficulté/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", /par matière, niveau, sujet/);
  assert.match(ui.public?.about?.intro1 || "", /niveau de difficulté/);
  assert.equal(ui.public?.about?.siteFeatures?.["1"]?.phase, "Années et niveaux de difficulté");
  assert.match(ui.public?.about?.siteFeatures?.["1"]?.text || "", /l’année|l'année/);
  assert.match(ui.public?.about?.siteFeatures?.["1"]?.text || "", /niveau de difficulté/);
  assert.doesNotMatch(JSON.stringify(ui), /Retour à la maison/);
  assert.doesNotMatch(JSON.stringify(ui), /\bNotes et niveaux/);
});

test("fr-CD content packs sparse contract vs fr-FR", () => {
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
  const nationalLangHits = [];
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
        if (NATIONAL_LANG_RE.test(value)) nationalLangHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && NATIONAL_LANG_RE.test(value)) {
        nationalLangHits.push(`${rel}:${key}`);
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
  assert.deepEqual(franceGradeHits, [], "France CP/6e/collège labels must not remain");
  assert.deepEqual(nationalLangHits, [], "national-language leakage");
});

test("fr-CD pack grade labels use short labels and année primaire bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), CD_SHORT_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, CD_BANDS);

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Mathématiques — 1re primaire");
  assert.equal(titles.meta["math.g2"].bookTitle, "Mathématiques — 2e primaire");
  assert.equal(titles.meta["english.g6"].bookTitle, "Anglais — 6e primaire");
  assert.doesNotMatch(JSON.stringify(titles), FRANCE_GRADE_RE);
});

test("fr-CD parent report copy.grade is Année", () => {
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

test("fr-CD help overlays parse and remap France grade span", async () => {
  const help = await import(`../../data/help-center/fr-CD/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/fr-FR/parents.js");
  assert.equal(
    help.ALL_ARTICLES_FR_CD.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_FR_CD.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_FR_CD.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /1re à la 6e année primaire/);
  assert.doesNotMatch(JSON.stringify(welcome), FRANCE_GRADE_RE);

  const addStudents = help.BY_SECTION_FR_CD.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /choisissez une année/);
  assert.doesNotMatch(addStudents.summary, /choisissez une classe/);
  assert.match(JSON.stringify(addStudents), /1re à 6e année primaire/);
  assert.match(JSON.stringify(addStudents), /1re année primaire — grade_1/);
  assert.doesNotMatch(JSON.stringify(addStudents), FRANCE_GRADE_RE);

  const editStudent = help.BY_SECTION_FR_CD.parents.find((a) => a.slug === "edit-or-delete-student");
  assert.match(editStudent.summary, /l’année|l'année/);

  const choose = help.BY_SECTION_FR_CD.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.equal(choose.title, "Choisis une matière et une année");
  assert.match(JSON.stringify(choose), /ta année/);
  assert.doesNotMatch(JSON.stringify(choose), /ta classe/);

  const math = help.BY_SECTION_FR_CD.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /1re à la 6e année primaire/);
  assert.match(JSON.stringify(math), /année et un niveau de difficulté/);
  assert.doesNotMatch(JSON.stringify(math), /Choisissez une classe et un niveau/);
  assert.doesNotMatch(JSON.stringify(math), /du CP à la 6e/);

  const geometry = help.BY_SECTION_FR_CD.subjects.find((a) => a.slug === "geometry");
  assert.match(geometry.summary, /1re à la 6e année primaire/);
  assert.doesNotMatch(geometry.summary, /niveaux 1 à 6/);

  const science = help.BY_SECTION_FR_CD.subjects.find((a) => a.slug === "science");
  assert.match(science.summary, /1re à la 6e année primaire/);
  assert.doesNotMatch(science.summary, /niveaux 1 à 6/);
});

test("fr-CD demo false friends: année / joueur / accueil", () => {
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
  assert.deepEqual(Object.values(demo.grades || {}), CD_SHORT_GRADES);
});

test("fr-CD help students: tu conjugations (no vous forms)", async () => {
  const help = await import(`../../data/help-center/fr-CD/index.js?t=${Date.now() + 1}`);
  const students = help.BY_SECTION_FR_CD.students;
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

test("fr-CD grade-aware report pack: math terms and année primaire ranges", () => {
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
  assert.match(blob, /1re–2e année primaire/);
  assert.match(blob, /3e–4e année primaire/);
  assert.match(blob, /5e–6e année primaire/);
  assert.doesNotMatch(blob, /niveaux 1 et 2/);
  assert.doesNotMatch(blob, /niveaux 3 et 4/);
  assert.doesNotMatch(blob, FRANCE_GRADE_RE);
  assert.doesNotMatch(blob, /de 5e à 6e/);
});

test("fr-CD does not ship word-meanings/science/learning-book overlays", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-fr-CD-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "utils/learning-content-fr-CD")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/fr-CD")), false);
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
  assert.match(skills.grades.g6.grammar_comparatives.description, /6e primaire/);
  assert.doesNotMatch(skills.grades.g6.grammar_comparatives.description, FRANCE_GRADE_RE);
});

test("fr-CD child/adult register: no tu/vous mix introduced in overlays", () => {
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
    assert.doesNotMatch(blob, NATIONAL_LANG_RE, file);
  }
});
