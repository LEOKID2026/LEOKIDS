/**
 * fr-BJ (Bénin) sparse content-layer checks.
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
const LOCALE = "fr-BJ";
const BASE = "fr-FR";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** France 6e / Ivory Coast CP1–CP2 must not leak into Benin CI–CM2 layer. */
const FRANCE_OR_CI_GRADE_RE = /\b6e\b|\bCP1\b|\bCP2\b/;
const BJ_GRADES = ["CI", "CP", "CE1", "CE2", "CM1", "CM2"];
/** National languages / greetings — French education layer must not claim exclusivity via these. */
const LOCAL_LANG_RE =
  /\b(Fon|Fongbé|Yoruba|Yorùbá|Bariba|Dendi|Goun|Mina|nangadef|jamm|salaam aleekum)\b/i;
const FRENCH_ONLY_CLAIM_RE =
  /\b(seule langue|unique langue|langue unique|uniquement en français|only language|French is the only)\b/i;
const CROSS_COUNTRY_RE =
  /\b(Sénégal|Senegal|Côte d’Ivoire|Côte d'Ivoire|Cameroun|Guinée|Togo|Gabon|Congo|France|Québec|Belgique|Suisse)\b/;
/** Dead Israel-curriculum / Hebrew / homeland residue must not remain as local overrides. */
const DEAD_CURRICULUM_RE =
  /hebrew|homeland|israel|israeli|moledet|hasmon|judea|judaism|hébreu|hébraïque|hasmonéen|Judée|judaïsme|||/i;

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

test("fr-BJ locale namespaces parse and stay sparse vs fr-FR", () => {
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
    assert.equal(LOCAL_LANG_RE.test(blob), false, `local-language leak in ${file}`);
    assert.equal(FRENCH_ONLY_CLAIM_RE.test(blob), false, `French-only claim in ${file}`);
    assert.equal(CROSS_COUNTRY_RE.test(blob), false, `cross-country leak in ${file}`);
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

test("fr-BJ authority-backed grade mapping CI–CM2 (not France CP…6e / Ivory Coast CP1–CP2)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    BJ_GRADES
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
    BJ_GRADES
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
    BJ_GRADES
  );
  assert.equal(worksheets.gradeField, "Niveau");
  assert.equal(worksheets.gradeFilterAll, "Tous les niveaux");
  assert.match(worksheets.createHint, /fiche d’exercices|fiche d'exercices/);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Bénin/);
  assert.match(seo.homeTitle, /enseignement primaire/);
  assert.match(seo.learningDescription, /CI à CM2/);
  assert.doesNotMatch(seo.homeTitle, /enseignement élémentaire/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, /\b6e\b/);
  assert.doesNotMatch(allLocaleText, /\bCP1\b/);
  assert.doesNotMatch(allLocaleText, /\bCP2\b/);
  assert.match(allLocaleText, /\bCI\b/);
  assert.match(allLocaleText, /\bCM2\b/);
});

test("fr-BJ niveau/année vs classe/groupe-classe distinction", () => {
  const school = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8")
  );
  assert.match(school.portal?.classesSubtitle || "", /niveau scolaire/);
  assert.match(school.portal?.classesSubtitle || "", /groupe-classe/);
  assert.match(school.portal?.classesSubtitle || "", /CI–CM2/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /classe physique/);
  assert.equal(school.portal?.chooseGrade, "Choisissez un niveau");
  assert.equal(school.portal?.choosePhysicalClass, "Choisissez le groupe-classe");
  assert.equal(school.portal?.colGrade, "Niveau");
  assert.equal(school.portal?.colClass, "Groupe-classe");
  assert.equal(school.portal?.classLabel, "Groupe-classe");
  assert.equal(school.portal?.assignCurrentGrade, "Niveau actuel");
  assert.match(school.portal?.createStudentClass || "", /Groupe-classe|groupe-classe/);
  assert.match(school.portal?.studentsSubtitle || "", /groupe-classe/);
  assert.doesNotMatch(school.portal?.studentsSubtitle || "", /par classe —/);
  assert.match(school.portal?.physicalClassReportTitle || "", /groupe-classe/);

  const learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  assert.equal(learning.master?.gradeFallback, "Niveau");
  assert.doesNotMatch(learning.chooseGrade || "", /\bclasse\b/i);
});

test("fr-BJ student/teacher/parent terminology (élève / enseignant / parent)", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /élèves/);
  assert.match(seo.homeDescription, /parents/);
  assert.doesNotMatch(JSON.stringify(seo), /\bapprenant\b/i);

  const school = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8")
  );
  assert.doesNotMatch(JSON.stringify(school), /\bmaître\b|\bmaîtresse\b/i);
  assert.doesNotMatch(JSON.stringify(school), /\binstituteur\b/i);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.parent?.selectGrade || "", /niveau/);
  assert.doesNotMatch(JSON.stringify(ui), /\bresponsable légal\b/i);
});

test("fr-BJ content packs sparse contract vs fr-FR", () => {
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
  const localLangHits = [];
  /** @type {string[]} */
  const frenchOnlyHits = [];
  /** @type {string[]} */
  const crossCountryHits = [];
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
        if (FRANCE_OR_CI_GRADE_RE.test(value)) franceGradeHits.push(`${rel}:${key}`);
        if (LOCAL_LANG_RE.test(value)) localLangHits.push(`${rel}:${key}`);
        if (FRENCH_ONLY_CLAIM_RE.test(value)) frenchOnlyHits.push(`${rel}:${key}`);
        if (CROSS_COUNTRY_RE.test(value)) crossCountryHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && FRANCE_OR_CI_GRADE_RE.test(value)) {
        franceGradeHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && LOCAL_LANG_RE.test(value)) {
        localLangHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && FRENCH_ONLY_CLAIM_RE.test(value)) {
        frenchOnlyHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && CROSS_COUNTRY_RE.test(value)) {
        crossCountryHits.push(`${rel}:${key}`);
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
  assert.deepEqual(franceGradeHits, [], "France 6e / CI CP1–CP2 labels must not remain");
  assert.deepEqual(localLangHits, [], "no national-language leakage");
  assert.deepEqual(frenchOnlyHits, [], "no claim that French represents all Benin");
  assert.deepEqual(crossCountryHits, [], "no France or cross-country leakage");
});

test("fr-BJ pack grade labels use CI–CM2 bands (MEMP sous-cycles)", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), BJ_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, {
    g12: "CI–CP",
    g34: "CE1–CE2",
    g56: "CM1–CM2",
  });

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Mathématiques — CI");
  assert.equal(titles.meta["math.g2"].bookTitle, "Mathématiques — CP");
  assert.equal(titles.meta["english.g6"].bookTitle, "Anglais — CM2");
  assert.doesNotMatch(JSON.stringify(titles), /\b6e\b/);
  assert.doesNotMatch(JSON.stringify(titles), /\bCP1\b/);
});

test("fr-BJ help overlays parse and remap France grade span", async () => {
  const help = await import(`../../data/help-center/fr-BJ/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/fr-FR/parents.js");
  assert.equal(
    help.ALL_ARTICLES_FR_BJ.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_FR_BJ.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_FR_BJ.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /CI au CM2/);
  assert.match(JSON.stringify(welcome), /enseignement primaire/);
  assert.match(JSON.stringify(welcome), /Bénin/);
  assert.doesNotMatch(JSON.stringify(welcome), /\b6e\b/);
  assert.doesNotMatch(JSON.stringify(welcome), /enseignement élémentaire/);
  assert.doesNotMatch(JSON.stringify(welcome), CROSS_COUNTRY_RE);

  const addStudents = help.BY_SECTION_FR_BJ.parents.find((a) => a.slug === "add-students");
  assert.match(JSON.stringify(addStudents), /CI à CM2/);
  assert.match(JSON.stringify(addStudents), /CI — grade_1/);
  assert.match(JSON.stringify(addStudents), /CP — grade_2/);
  assert.doesNotMatch(JSON.stringify(addStudents), /\b6e\b/);

  const math = help.BY_SECTION_FR_BJ.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /CI au CM2/);
  assert.doesNotMatch(JSON.stringify(math), /du CP à la 6e/);

  const geometry = help.BY_SECTION_FR_BJ.subjects.find((a) => a.slug === "geometry");
  assert.match(geometry.summary, /du CI au CM2/);
  assert.doesNotMatch(geometry.summary, /niveaux 1 à 6/);

  const science = help.BY_SECTION_FR_BJ.subjects.find((a) => a.slug === "science");
  assert.match(science.summary, /du CI au CM2/);
  assert.doesNotMatch(science.summary, /niveaux 1 à 6/);
});

test("fr-BJ demo false friends: niveau / joueur / accueil", () => {
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
  assert.deepEqual(Object.values(demo.grades), BJ_GRADES);
});

test("fr-BJ UI back-home, parent grade chrome, and public Bénin framing", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.layout?.backHome, "Retour à l’accueil");
  assert.equal(ui.pwa?.backHome, "Retour à l’accueil");
  assert.equal(ui.parent?.selectGrade, "Choisir un niveau");
  assert.doesNotMatch(JSON.stringify(ui), /Retour à la maison/);
  assert.match(ui.home?.subhead || "", /Bénin/);
  assert.match(ui.home?.subhead || "", /enseignement primaire/);
  assert.match(ui.home?.subhead || "", /CI–CM2/);
  assert.match(ui.public?.about?.intro1 || "", /Bénin/);
  assert.match(ui.public?.about?.intro1 || "", /enseignement primaire/);
  assert.match(ui.public?.about?.intro1 || "", /CI/);
  assert.match(ui.public?.about?.intro1 || "", /CM2/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", /programme national complet|toute la curriculum/i);
  assert.doesNotMatch(JSON.stringify(ui), CROSS_COUNTRY_RE);
});

test("fr-BJ report detailed surface grade chrome = Niveau", () => {
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

test("fr-BJ help students: tu conjugations (no vous forms)", async () => {
  const help = await import(`../../data/help-center/fr-BJ/index.js?t=${Date.now() + 1}`);
  const students = help.BY_SECTION_FR_BJ.students;
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

test("fr-BJ grade-aware report pack: math terms and CI–CM2 ranges", () => {
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
  assert.match(blob, /CI–CP/);
  assert.match(blob, /CE1–CE2/);
  assert.match(blob, /CM1–CM2/);
  assert.doesNotMatch(blob, /niveaux 1 et 2/);
  assert.doesNotMatch(blob, /niveaux 3 et 4/);
  assert.doesNotMatch(blob, /\b6e\b/);
  assert.doesNotMatch(blob, /de 5e à 6e/);
  assert.doesNotMatch(blob, /\bCP1\b/);
});

test("fr-BJ does not ship word-meanings, science overlay, or mutate English targets", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  const scienceOverlay = path.join(ROOT, "data/science-questions-fr-BJ-overlay.js");
  assert.equal(fs.existsSync(scienceOverlay), false);
  const learningContent = path.join(ROOT, "utils/learning-content-fr-BJ");
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

test("fr-BJ child/adult register: no tu/vous mix introduced in overlays", () => {
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
    assert.equal(LOCAL_LANG_RE.test(blob), false, abs);
    assert.equal(FRENCH_ONLY_CLAIM_RE.test(blob), false, abs);
    if (
      /\b(Choisis|Clique|Essaie|Écris)\b.*\b(Vous|Sélectionnez)\b/s.test(blob) ||
      /\b(Vous|Sélectionnez)\b.*\b(Choisis|Clique|Essaie|Écris)\b/s.test(blob)
    ) {
      mixed.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
    }
  }
  assert.deepEqual(mixed, []);
});

test("fr-BJ auth/validation: adresse e-mail and téléphone portable", () => {
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.teacherEmailLabel, "Adresse e-mail");
  assert.equal(auth.registration?.teacher?.emailLabel, "Adresse e-mail");
  assert.equal(auth.registration?.teacher?.phoneLabel, "Téléphone portable");
  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.invalidGrade, /niveau/);
});

test("fr-BJ generator file is absent", () => {
  assert.equal(
    fs.existsSync(path.join(ROOT, "tests/i18n/_gen-fr-BJ-sparse-layer.mjs")),
    false,
    "temporary generator must not remain"
  );
});

test("fr-BJ teacher portal distinguishes niveau from groupe-classe", () => {
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
  assert.match(dash.createClassPlaceholder || "", /\b(CI|CP|CE1|CE2|CM1|CM2)\b/);
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
  assert.match(JSON.stringify(teacher.dashboard), /groupe-classe/);
  assert.match(JSON.stringify(school.portal), /groupe-classe/);
  assert.match(JSON.stringify(school.portal), /niveau/);
});

test("fr-BJ teacher content-pack chrome uses groupe-classe (not cours)", () => {
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
});

test("fr-BJ layer has no active Hebrew/homeland/Israel-curriculum local overrides", () => {
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
  assert.deepEqual(hits, [], "dead curriculum residue in fr-BJ overlays");
});

test("fr-BJ burn-down indexes have no orphan leaves without authority", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", BASE);
  /** @type {string[]} */
  const orphanLeaves = [];
  for (const rel of listJsonRel(countryRoot)) {
    if (isBurnDownIndexPath(rel)) continue;
    const authority = resolveAuthorityPackPath(rel, (candidate) =>
      fs.existsSync(path.join(baseRoot, candidate))
    );
    if (authority.kind === "missing" || !authority.baseRel) orphanLeaves.push(rel);
  }
  assert.deepEqual(orphanLeaves, []);
});

test("fr-BJ other locales and shared runtime files remain unmodified", () => {
  const forbiddenTouch = [
    "locales/fr-FR/common.json",
    "locales/fr-FR/teacher.json",
    "locales/fr-CI/common.json",
    "locales/fr-SN/common.json",
    "locales/fr-CD/common.json",
    "locales/fr-CM/common.json",
    "locales/en/common.json",
  ];
  for (const rel of forbiddenTouch) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), rel);
  }
  assert.equal(fs.existsSync(path.join(ROOT, "locales", LOCALE)), true);
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`)),
    false
  );
  assert.equal(fs.existsSync(path.join(ROOT, "tests/i18n/_gen-fr-BJ-sparse-layer.mjs")), false);
});
