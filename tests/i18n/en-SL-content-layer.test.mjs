/**
 * en-SL (Sierra Leone — English in formal primary education) sparse content-layer checks.
 * No registry wiring, build, or full suite.
 *
 * Authority: MBSSE / National Curriculum Framework / ASC —
 * Class 1–6; lower primary Class 1–3; upper primary Class 4–6;
 * pupil (ASC/admin); head teacher (primary).
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
import { deepMergeJson } from "../../lib/i18n/deep-merge.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "en-SL";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const GRADE_LABEL_RE = /\bGrade [1-6]\b/;
const NIGERIA_PRIMARY_RE = /\bPrimary [1-6]\b/;
const GHANA_BASIC_RE = /\bBasic [1-6]\b/;
const PHYSICAL_CLASS_RE = /\bphysical class\b/i;
const LOCAL_LANG_RE =
  /\b(krio|mende|temne|limba|kono|loko|sherbro|fullah|susu|yalunka|kissi|kuranko)\b/i;
const DEAD_CURRICULUM_RE =
  /\b(israel|israeli|hebrew|homeland|moledet|hasmonaean|hasmon|judea|judaism|hellenism|||)\b/i;
const DEAD_CURRICULUM_KEY_RE =
  /israel|israeli|hebrew|homeland|moledet|hasmon|judea|judaism|hellenism|||/i;
const ALL_ENGLISH_CLAIM_RE =
  /(?:only\s+language|sole\s+language|English\s+is\s+the\s+only|represents?\s+(?:all\s+)?Sierra\s+Leone|for\s+all\s+(?:pupils|learners|students|children)\s+(?:in|across)\s+Sierra\s+Leone|all\s+of\s+Sierra\s+Leone(?:'s|\u2019s)?\s+languages)/i;
const FOREIGN_COUNTRY_RE =
  /\b(Ghana|Nigeria|Kenya|Cameroon|India|Rwanda|The Gambia|Gambia)\b/;
const SL_GRADES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"];
const SL_PRODUCT_BANDS = ["Class 1–2", "Class 3–4", "Class 5–6"];
const GENERATOR_PATH = path.join(ROOT, "tests/i18n/_gen-en-SL-sparse-layer.mjs");

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
function assertCleanChrome(blob, label) {
  assert.equal(HEBREW_RE.test(blob), false, `hebrew in ${label}`);
  assert.equal(ALL_ENGLISH_CLAIM_RE.test(blob), false, `all-English / all-SL claim in ${label}`);
  assert.equal(FOREIGN_COUNTRY_RE.test(blob), false, `foreign country in ${label}`);
  assert.equal(DEAD_CURRICULUM_RE.test(blob), false, `dead curriculum in ${label}`);
  assert.equal(PHYSICAL_CLASS_RE.test(blob), false, `physical class in ${label}`);
  assert.equal(LOCAL_LANG_RE.test(blob), false, `local language name in ${label}`);
  assert.equal(GRADE_LABEL_RE.test(blob), false, `Grade N in ${label}`);
  assert.equal(NIGERIA_PRIMARY_RE.test(blob), false, `Primary N in ${label}`);
  assert.equal(GHANA_BASIC_RE.test(blob), false, `Basic N in ${label}`);
}

test("en-SL generator helper is absent", () => {
  assert.equal(fs.existsSync(GENERATOR_PATH), false, "tests/i18n/_gen-en-SL-sparse-layer.mjs must be removed");
  const helpers = fs
    .readdirSync(path.join(ROOT, "tests/i18n"))
    .filter((name) => /en-SL/i.test(name) && (/^_gen-/i.test(name) || /helper/i.test(name)));
  assert.deepEqual(helpers, [], "en-SL generator/helper files remaining must be 0");
});

test("en-SL locale namespaces parse and stay sparse vs en", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", "en");
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("seo.json"));

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
    assert.ok(fs.existsSync(basePath), `missing en authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    assertCleanChrome(JSON.stringify(country), file);
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

test("en-SL grade terminology Class 1–6 and Sierra Leone wording", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    SL_GRADES
  );
  assert.equal(common.gradeLabel, "Class {grade}");
  assert.equal(common.subjectMath, "Maths");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.chooseGrade, "Choose a class");
  assert.equal(learning.master?.defaultPlayerName, "Pupil");
  assert.equal(learning.master?.gradeTitle, "Class {grade}");
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    SL_GRADES
  );
  assert.match(learning.math.howToLearnBlurb, /\bpractise\b/);
  assert.doesNotMatch(learning.math.howToLearnBlurb, /\bpractice maths\b/);

  const worksheets = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8"));
  assert.equal(worksheets.gradeFilterAll, "All classes");
  assert.equal(worksheets.selectGrade, "Class");
  assert.match(worksheets.createTypeColoring, /Colouring/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal?.chooseGrade, "Choose a class");
  assert.equal(school.portal?.choosePhysicalClass, "Choose class group");
  assert.equal(school.portal?.colGrade, "Class");
  assert.equal(school.portal?.colClass, "Class group");
  assert.equal(school.portal?.classLabel, "Class group");
  assert.equal(school.portal?.assignCurrentGrade, "Current class");
  assert.equal(school.portal?.assignCurrentClass, "Assigned class group");
  assert.equal(school.portal?.classMgmtSection, "Manage class groups");
  assert.equal(school.portal?.classMgmtName, "Class group name");
  assert.equal(school.portal?.classMgmtCreate, "Create class group");
  assert.equal(school.portal?.quickClasses, "Manage class groups");
  assert.equal(school.portal?.statClasses, "Active class groups");
  assert.equal(school.portal?.viewClass, "View class group");
  assert.notEqual(school.portal?.colClass, "Class");
  assert.notEqual(school.portal?.classLabel, school.portal?.colGrade);
  assert.match(school.portal?.classesSubtitle || "", /class group/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", PHYSICAL_CLASS_RE);
  assert.doesNotMatch(JSON.stringify(school), /No classes in this class/);
  assert.doesNotMatch(school.portal?.classMgmtSection || "", /\bManage classes\b/);
  assert.doesNotMatch(school.portal?.classMgmtName || "", /^Class name$/);
  assert.doesNotMatch(school.portal?.classMgmtCreate || "", /^Create class$/);

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.equal(teacher.dashboard?.noClassesTitle, "No active class groups");
  assert.equal(teacher.dashboard?.createClassLabel, "Class group name");
  assert.equal(teacher.dashboard?.createClassButton, "Create class group");
  assert.match(teacher.dashboard?.noClassesHint || "", /Manage class group/);
  assert.doesNotMatch(JSON.stringify(teacher.dashboard || {}), /\bNo active classes\b/);
  assert.doesNotMatch(teacher.dashboard?.createClassLabel || "", /^Class name$/);
  assert.doesNotMatch(teacher.dashboard?.createClassButton || "", /^Create class$/);

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.registration?.intent?.school_representative, "School representative / head teacher");
  assert.equal(auth.studentLoginTitle, undefined, "account login inherits Student login from en");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Sierra Leone/);
  assert.match(seo.homeTitle, /primary school pupils/);
  assert.match(seo.homeDescription, /formal primary education/);
  assert.doesNotMatch(seo.homeTitle, ALL_ENGLISH_CLAIM_RE);
  assert.doesNotMatch(seo.homeDescription, ALL_ENGLISH_CLAIM_RE);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.public?.about?.intro1 || "", /formal education system/);
  assert.match(ui.public?.about?.intro1 || "", /lower primary Class 1–3/);
  assert.match(ui.public?.about?.intro1 || "", /upper primary Class 4–6/);
  assert.match(ui.public?.about?.intro1 || "", /Class 1–6/);
  // Official structure must remain distinct from product chrome bands.
  assert.doesNotMatch(ui.public?.about?.intro1 || "", /lower primary Class 1–2/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", /upper primary Class 5–6/);
  assert.doesNotMatch(
    ui.public?.about?.intro1 || "",
    /lower primary Class 1–3; upper primary Class 4–6.*?Class 1–2/
  );

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(
    [rewards.gradeBands?.g12, rewards.gradeBands?.g34, rewards.gradeBands?.g56],
    SL_PRODUCT_BANDS
  );
  assert.notEqual(rewards.gradeBands?.g12, "Class 1–3");
  assert.notEqual(rewards.gradeBands?.g56, "Class 4–6");

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assertCleanChrome(allLocaleText, "all locales");
  assert.doesNotMatch(allLocaleText, /\belementary\b/i);
  assert.doesNotMatch(allLocaleText, /\bprincipal\b/i);
  assert.doesNotMatch(allLocaleText, /\bheadmaster\b/i);
  assert.doesNotMatch(allLocaleText, /\bLearner login\b/);
  assert.doesNotMatch(allLocaleText, /\bheadteacher\b/);
  assert.doesNotMatch(allLocaleText, /\borganization\b/);
  assert.doesNotMatch(allLocaleText, /\bcolor\b/i);
  assert.match(allLocaleText, /\bHelp centre\b/);
  assert.match(allLocaleText, /\bcolour/i);
  assert.match(allLocaleText, /\bpractising\b/);
  assert.match(allLocaleText, /\bhead teacher\b/);
  assert.match(allLocaleText, /\bClass 1\b/);
  assert.match(allLocaleText, /\bclass group\b/);
  assert.match(allLocaleText, /\bpupil\b/i);
  assert.match(allLocaleText, /\borganised\b/);
});

test("en-SL content packs sparse contract vs en", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", "en");
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
  const chromeHits = [];
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
        if (
          HEBREW_RE.test(value) ||
          ALL_ENGLISH_CLAIM_RE.test(value) ||
          FOREIGN_COUNTRY_RE.test(value) ||
          DEAD_CURRICULUM_RE.test(value) ||
          PHYSICAL_CLASS_RE.test(value) ||
          GRADE_LABEL_RE.test(value) ||
          NIGERIA_PRIMARY_RE.test(value) ||
          GHANA_BASIC_RE.test(value)
        ) {
          chromeHits.push(`${rel}:${key}`);
        }
      }
      for (const key of indexAudit.identicalOverrides) identicalOverrides.push(`${rel}:${key}`);
      for (const key of indexAudit.orphanKeys) orphanKeys.push(`${rel}:${key}`);
      for (const key of indexAudit.placeholderMismatches) placeholderMismatches.push(`${rel}:${key}`);
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
      if (typeof value === "string") {
        if (
          HEBREW_RE.test(value) ||
          ALL_ENGLISH_CLAIM_RE.test(value) ||
          FOREIGN_COUNTRY_RE.test(value) ||
          DEAD_CURRICULUM_RE.test(value) ||
          PHYSICAL_CLASS_RE.test(value) ||
          GRADE_LABEL_RE.test(value) ||
          NIGERIA_PRIMARY_RE.test(value) ||
          GHANA_BASIC_RE.test(value)
        ) {
          chromeHits.push(`${rel}:${key}`);
        }
      }
      if (!baseLeaves.has(key)) orphanKeys.push(`${rel}:${key}`);
      else if (baseLeaves.get(key) === value) identicalOverrides.push(`${rel}:${key}`);
      else {
        const pa = ((value.match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
        const pb = (((baseLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
        if (pa !== pb) placeholderMismatches.push(`${rel}:${key}`);
      }
    }
    const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
    if (assessment.isNearFullCopy) nearFullCopies.push(rel);
  }

  assert.deepEqual(emptyFiles, [], "empty overrides");
  assert.deepEqual(extraFiles, [], "files without en authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(chromeHits, [], "chrome / scope leaks");

  const demo = JSON.parse(fs.readFileSync(path.join(countryRoot, "demo/ui.json"), "utf8"));
  assert.equal(demo.bar?.changeGrade, "Change class");
  assert.deepEqual(
    [demo.grades?.g1, demo.grades?.g2, demo.grades?.g3, demo.grades?.g4, demo.grades?.g5, demo.grades?.g6],
    SL_GRADES
  );
  assert.equal(demo.subjects?.math, "Maths");

  const rewards = JSON.parse(fs.readFileSync(path.join(countryRoot, "rewards/ui.json"), "utf8"));
  assert.deepEqual(
    [rewards.gradeBands?.g12, rewards.gradeBands?.g34, rewards.gradeBands?.g56],
    SL_PRODUCT_BANDS
  );

  const classesIdx = JSON.parse(
    fs.readFileSync(path.join(countryRoot, "global-burn-down/pages__school__classes__index.json"), "utf8")
  );
  assert.equal(classesIdx.copy?.no_classes_in_this_grade, "No class groups in this class.");
});

test("en-SL help overlays parse and keep English slugs", async () => {
  const help = await import("../../data/help-center/en-SL/index.js");
  const parentsBase = await import("../../data/help-center/content/parents.js");
  assert.equal(help.ALL_ARTICLES_EN_SL.length, (
    (await import("../../data/help-center/content/parents.js")).PARENT_ARTICLES.length +
    (await import("../../data/help-center/content/students.js")).STUDENT_ARTICLES.length +
    (await import("../../data/help-center/content/parent-report.js")).PARENT_REPORT_ARTICLES.length +
    (await import("../../data/help-center/content/subjects.js")).SUBJECT_ARTICLES.length
  ));
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_EN_SL.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_EN_SL.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /Class 1–6/);
  assert.match(welcomeBlob, /lower primary Class 1–3/);
  assert.match(welcomeBlob, /upper primary Class 4–6/);
  assert.match(welcomeBlob, /formal education system/);
  assert.match(welcomeBlob, /primary school pupils/);
  assert.match(welcomeBlob, /maths/i);
  assert.doesNotMatch(welcomeBlob, ALL_ENGLISH_CLAIM_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_SL), FOREIGN_COUNTRY_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_SL), GRADE_LABEL_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_SL), NIGERIA_PRIMARY_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_SL), GHANA_BASIC_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_SL), /\belementary\b/i);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_SL), PHYSICAL_CLASS_RE);
  assert.equal(help.SECTIONS_EN_SL.students.title, "Guide for pupils");
});

test("en-SL does not ship word-meanings overlay or mutate English targets", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  const scienceOverlay = path.join(ROOT, "data/science-questions-en-SL-overlay.js");
  assert.equal(fs.existsSync(scienceOverlay), false);
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.equal(booksUi.subjects?.math, "Maths");
  assert.ok(!("words" in booksUi));
  assert.ok(!("phonics" in booksUi));
  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta?.["math.g1"]?.bookTitle, "Maths — Class 1");
  assert.equal(titles.meta?.["english.g6"]?.bookTitle, "English — Class 6");
});

test("en-SL Mathematics/Maths and British verb-noun spelling on authored surfaces", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.subjects.math, "Maths");
  assert.match(learning.math.howToLearnBlurb, /\bpractise\b/);
  assert.doesNotMatch(learning.math.howToLearnBlurb, /\bpractice maths\b/);

  const reports = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "reports.json"), "utf8"));
  assert.match(reports.remediateSameLevel, /\bpractising\b/);
  assert.match(reports.v2.executive.majorTrendsManyUnitsLine2, /\bstabilise\b/);

  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.match(booksUi.shell.practiceMath, /\bpractise\b/);
});

test("en-SL Help subject summaries use practise (verb) and keep practice (noun)", async () => {
  const help = await import("../../data/help-center/en-SL/index.js");
  const subjects = help.BY_SECTION_EN_SL.subjects;
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    assert.match(String(article.summary), /how to practise\./);
    assert.doesNotMatch(String(article.summary), /how to practice\./);
    assert.match(String(article.summary), /\bpractice for Class 1–6\b/);
  }
  const subjectsBlob = JSON.stringify(subjects);
  assert.doesNotMatch(subjectsBlob, /how to practice/i);
  assert.match(subjectsBlob, /Go to Maths practice/);
});

test("en-SL account/login keys stay Student; instructional pupil remains", () => {
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  const enAuth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "auth.json"), "utf8"));
  const enUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "ui.json"), "utf8"));

  assert.equal(auth.studentLoginTitle, undefined);
  assert.equal(auth.studentName, undefined);
  assert.equal(ui.nav?.loginStudent, undefined);
  assert.equal(ui.public?.homepage?.hero?.kidsCta, undefined);
  assert.equal(ui.public?.homepage?.finalCta?.kidsCta, undefined);
  assert.equal(ui.student?.accessGateSignInPrompt, undefined);
  assert.equal(ui.student?.accessGateSignInCta, undefined);

  assert.equal(enAuth.studentLoginTitle, "Student login");
  assert.equal(enUi.nav.loginStudent, "Student login");
  assert.equal(enUi.public.homepage.hero.kidsCta, "Student login");
  assert.equal(enUi.student.accessGateSignInCta, "Student sign-in");

  assert.equal(ui.student?.childDefault, "Pupil");
  assert.equal(ui.empty?.noStudents, "No children yet. Add a child to get started.");
  assert.match(ui.home?.subhead, /primary school pupils/);
  assert.match(ui.public?.homepage?.teachers?.text, /pupils perform/);
  assert.equal(ui.public?.homepage?.teachers?.bullet0, "Manage pupils");
});

test("en-SL runtime probe: homepage value card practised + parent empty state", () => {
  const enUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "ui.json"), "utf8"));
  const slUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  const merged = deepMergeJson(enUi, slUi);

  assert.equal(
    merged.public?.homepage?.valueCards?.["0"]?.text,
    "See what your child practised, where they are improving, and what to reinforce."
  );
  assert.equal(merged.empty?.noStudents, "No children yet. Add a child to get started.");
  assert.equal(merged.empty?.noProgress, "No practice data for this period yet.");

  const homepageBlob = JSON.stringify(merged.public?.homepage?.valueCards || {});
  assert.doesNotMatch(homepageBlob, /\bpracticed\b/);
  assert.doesNotMatch(homepageBlob, /\bpracticing\b/);
  assert.match(homepageBlob, /\bpractised\b/);

  assert.doesNotMatch(String(merged.empty?.noStudents), /pupils/i);
  assert.doesNotMatch(String(merged.empty?.noStudents), /\bstudents\b/i);
});

test("en-SL Class year vs class group stays distinct across teacher and school portals", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  const validation = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8"));

  assert.equal(school.portal.colGrade, "Class");
  assert.equal(school.portal.createStudentGrade, "Class");
  assert.equal(school.portal.classMgmtGrade, "Class");
  assert.equal(school.portal.chooseGrade, "Choose a class");
  assert.equal(school.communication.detailsFieldGrade, "Class");

  assert.equal(school.portal.colClass, "Class group");
  assert.equal(school.portal.classLabel, "Class group");
  assert.equal(school.communication.detailsFieldClass, "Class group");
  assert.equal(
    validation.api?.physical_class_not_found,
    "No matching class group found — confirm teacher and subject class groups are set up"
  );

  const teacherDash = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/components__teacher-portal__TeacherDashboardClient.json"),
      "utf8"
    )
  );
  assert.equal(teacherDash.copy?.manage_class, "Manage class group");
  assert.equal(teacherDash.copy?.classes, "Class groups");
  assert.equal(teacherDash.copy?.class_report, "Class group report");
  assert.equal(teacherDash.copy?.remove_this_student_from_the_class, "Remove this pupil from the class group?");

  const classPage = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/pages__teacher__class__[classId].json"),
      "utf8"
    )
  );
  assert.equal(classPage.copy?.class_report, "Class group report");

  const groupSurfaces = [
    JSON.stringify(school),
    JSON.stringify(teacher),
    JSON.stringify(validation),
    JSON.stringify(teacherDash),
    JSON.stringify(classPage),
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/components__teacher-portal__TeacherClassReportModal.json"),
      "utf8"
    ),
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/pages__teacher__class__[classId]__activities__index.json"),
      "utf8"
    ),
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json"),
      "utf8"
    ),
  ].join("\n");

  assert.match(groupSurfaces, /\bclass group\b/i);
  assert.doesNotMatch(groupSurfaces, /\bNo active classes\b/);
  assert.doesNotMatch(groupSurfaces, /"Manage class"/);
  assert.doesNotMatch(groupSurfaces, /"Create class"/);
  assert.doesNotMatch(groupSurfaces, /"Class name"/);
  assert.doesNotMatch(groupSurfaces, /"Manage classes"/);
  assert.doesNotMatch(groupSurfaces, PHYSICAL_CLASS_RE);

  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    SL_GRADES
  );
});

test("en-SL has no local Hellenism/Hebrew/Israel report overrides", () => {
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
      const text = fs.readFileSync(abs, "utf8");
      if (DEAD_CURRICULUM_RE.test(text) || HEBREW_RE.test(text) || DEAD_CURRICULUM_KEY_RE.test(text)) {
        hits.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
      }
    }
    if (root.includes("help-center")) {
      for (const name of fs.readdirSync(root)) {
        if (!name.endsWith(".js")) continue;
        const abs = path.join(root, name);
        const text = fs.readFileSync(abs, "utf8");
        if (DEAD_CURRICULUM_RE.test(text) || HEBREW_RE.test(text) || DEAD_CURRICULUM_KEY_RE.test(text)) {
          hits.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
        }
      }
    }
  }
  assert.deepEqual(hits, [], "no Hellenism/Hebrew/Israel residue in en-SL overlays");

  const learnIdx = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "learning/burn-down-index.json"), "utf8")
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(learnIdx, "utils__curriculum-audit__israeli-primary-curriculum-map"),
    false
  );
  assert.equal(
    fs.existsSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json"
      )
    ),
    false
  );

  const reportLeaf = JSON.parse(
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
  const reportKeys = Object.keys(reportLeaf.copy || {});
  assert.equal(reportKeys.some((k) => DEAD_CURRICULUM_KEY_RE.test(k)), false);
  assert.equal(
    Object.values(reportLeaf.copy || {}).some((v) => DEAD_CURRICULUM_RE.test(String(v))),
    false
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(reportLeaf.copy || {}, "grade_6_hellenism_figures_and_roles"),
    false
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      reportLeaf.copy || {},
      "this_week_focus_on_grade_6_hellenism_figures_and_roles"
    ),
    false
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      reportLeaf.copy || {},
      "it_helps_to_practice_grade_6_hellenism_figures_and_roles_after_each_exer"
    ),
    false
  );

  const reportIdx = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "reports/burn-down-index.json"), "utf8")
  );
  const idxCopy = reportIdx["utils__parent-report-language__grade-aware-recommendation-templates"] || {};
  assert.equal(Object.keys(idxCopy).some((k) => DEAD_CURRICULUM_KEY_RE.test(k)), false);
  assert.equal(
    Object.prototype.hasOwnProperty.call(idxCopy, "grade_6_hellenism_figures_and_roles"),
    false
  );

  // Burn-down indexes must not own orphan keys vs en authority.
  for (const rel of [
    "reports/burn-down-index.json",
    "learning/burn-down-index.json",
    "games/burn-down-index.json",
    "global-burn-down/burn-down-index.json",
  ]) {
    const countryRoot = path.join(ROOT, "content-packs", LOCALE);
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const domain = rel.split("/")[0];
    const base = JSON.parse(
      fs.readFileSync(path.join(ROOT, "content-packs", "en", `${domain}/burn-down-index.json`), "utf8")
    );
    const audit = auditBurnDownIndexOverlay(country, base, { countryRoot, domain });
    assert.deepEqual(audit.orphanKeys, [], `orphan burn-down index keys in ${rel}`);
  }
});

test("en-SL does not modify other locales, en, en-GH, en-NG, en-KE, en-LR, or en-GM", () => {
  const enCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "common.json"), "utf8"));
  assert.equal(enCommon.grade1, "Grade 1");
  assert.equal(enCommon.subjectMath, "Math");
  const enTeacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "teacher.json"), "utf8"));
  assert.equal(enTeacher.dashboard?.noClassesTitle, "No active classes");
  assert.equal(enTeacher.dashboard?.createClassLabel, "Class name");

  const enReportLeaf = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/en/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
      ),
      "utf8"
    )
  );
  assert.equal(
    enReportLeaf.copy?.grade_6_hellenism_figures_and_roles,
    "Grade 6 Hellenism figures and roles.",
    "base en report leaf unchanged"
  );

  const ghCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en-GH", "common.json"), "utf8"));
  assert.equal(ghCommon.grade1, "Basic 1");
  const ngCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en-NG", "common.json"), "utf8"));
  assert.equal(ngCommon.grade1, "Primary 1");
  const keCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en-KE", "common.json"), "utf8"));
  assert.equal(keCommon.subjectMath, "Maths");
  assert.equal(keCommon.grade1, undefined, "en-KE inherits Grade 1 from en; not Class 1");

  if (fs.existsSync(path.join(ROOT, "locales", "en-LR", "seo.json"))) {
    const lrSeo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en-LR", "seo.json"), "utf8"));
    assert.match(String(lrSeo.homeTitle || lrSeo.homeDescription || ""), /Liberia/i);
    assert.doesNotMatch(JSON.stringify(lrSeo), /Sierra Leone/);
  }
  if (fs.existsSync(path.join(ROOT, "locales", "en-GM", "common.json"))) {
    const gmCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en-GM", "common.json"), "utf8"));
    assert.equal(gmCommon.subjectMath, "Maths");
    assert.equal(gmCommon.grade1, undefined, "en-GM grade chrome not rewritten by en-SL agent");
  }
});
