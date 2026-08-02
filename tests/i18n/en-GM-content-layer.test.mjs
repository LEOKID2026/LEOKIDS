/**
 * en-GM (The Gambia — English formal-education layer) sparse content-layer checks.
 * No registry wiring, build, or full suite.
 *
 * Authority: MoBSE Lower Basic Education (LBE) Grade 1–6;
 * Upper Basic (Grade 7–9) is outside the six product levels.
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
const LOCALE = "en-GM";
const HEBREW_RE = /[\u0590-\u05FF]/
const LOCAL_LANG_RE =
  /\b(mandinka|wolof|pulaar|fula|jola|serer|sereer|soninke|manjak|manjaku|arabic|french)\b/i;
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const PHYSICAL_CLASS_RE = /\bphysical class\b/i;
const AMBIGUOUS_PRIMARY_CLASS_RE = /\bprimary class(es)?\b/i;
const ENGLISH_ONLY_GM_RE =
  /\b(english (is|as) the only|only language in (the )?gambia|sole (official )?language|all (of )?(the )?gambia speaks? english|represents?\s+all\s+(of\s+)?(the\s+)?gambia)\b/i;
const ENGLISH_SCOPE_RE = /English-language|English experience|Lower Basic/i;
const UPPER_BASIC_PRODUCT_RE =
  /\b(Upper Basic|UBE|Grade\s*7|Grade\s*8|Grade\s*9|Grades?\s*7\s*[–-]\s*9)\b/;
const PEER_LEAK_RE =
  /\b(Ghana|Nigeria|Sierra Leone|Liberia|Kenya|Rwanda|Cameroon|Mauritius|Basic [1-6]|Primary [1-6]|Year [1-6]|CP1|CP2|\bCI\b|SIL)\b/;
const ISRAEL_RESIDUE_LEAF_RE =
  /hebrew|homeland|israel|israeli|hasmonaean|judea|judean|hellenism|judaism|moledet|עברית|מולדת|ישראל/i;
const ISRAEL_RESIDUE_VALUE_RE =
  /\b(Hebrew|Homeland|Israel|Israeli|Hasmonaean|Judea|Judean|Hellenism|Judaism|Moledet|עברית|מולדת|ישראל)\b/;
const AMERICAN_VERB_PRACTICE_RE = /\b(to practice|helps to practice|Keep practicing|keep practicing|start practicing)\b/;
const BARE_CLASS_ACTION_RE =
  /\b(?:Class name|Active classes|No active classes|(?:Manage|Create) class(?! groups?\b))\b/;
const FOREIGN_CURRENCY_RE = /\b(USD|dollar|naira|cedi|shilling|rand|rupee|₹|\$)\b/i;
const GENERATOR_PATH = path.join(ROOT, "tests", "i18n", "_gen-en-GM-sparse-layer.mjs");
const ALLOWED_CONTENT_ROOTS = [
  path.join(ROOT, "locales", LOCALE),
  path.join(ROOT, "content-packs", LOCALE),
  path.join(ROOT, "data", "help-center", LOCALE),
  path.join(ROOT, "tests", "i18n"),
];

/**
 * @param {string} rootDir
 */
function collectIsraelResidueHits(rootDir) {
  /** @type {string[]} */
  const hits = [];
  for (const rel of listJsonRel(rootDir)) {
    const abs = path.join(rootDir, rel);
    const raw = fs.readFileSync(abs, "utf8");
    if (/israeli-primary-curriculum-map/i.test(raw)) {
      hits.push(`${rel}:path:israeli-primary-curriculum-map`);
    }
    const json = JSON.parse(raw);
    for (const [key, value] of collectStringLeaves(json)) {
      if (ISRAEL_RESIDUE_LEAF_RE.test(key) || ISRAEL_RESIDUE_VALUE_RE.test(value)) {
        hits.push(`${rel}:${key}`);
      }
    }
  }
  return hits;
}

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

test("en-GM generator helper is absent", () => {
  assert.equal(fs.existsSync(GENERATOR_PATH), false);
  const genHelpers = fs
    .readdirSync(path.join(ROOT, "tests", "i18n"))
    .filter((name) => /en-GM/i.test(name) && (/^_gen-|_scaffold|_helper/i.test(name) || name.endsWith(".mjs") && name.startsWith("_gen-")));
  assert.deepEqual(genHelpers, []);
});

test("en-GM locale namespaces parse and stay sparse vs en", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", "en");
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("teacher.json"));
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
    assert.ok(fs.existsSync(basePath), `missing en authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    const blob = JSON.stringify(country);
    assert.equal(HEBREW_RE.test(blob), false, file);
    assert.equal(LOCAL_LANG_RE.test(blob), false, file);
    assert.equal(AMBIGUOUS_PRIMARY_CLASS_RE.test(blob), false, file);
    assert.equal(PHYSICAL_CLASS_RE.test(blob), false, file);
    assert.equal(ENGLISH_ONLY_GM_RE.test(blob), false, file);
    assert.equal(UPPER_BASIC_PRODUCT_RE.test(blob), false, file);
    assert.equal(PEER_LEAK_RE.test(blob), false, file);
    auditLocaleOverlay(country, base, file.replace(/\.json$/, ""), orphans, typeMismatches, placeholderMismatches, identical);
  }

  assert.deepEqual(emptyFiles, []);
  assert.deepEqual(orphans, []);
  assert.deepEqual(typeMismatches, []);
  assert.deepEqual(placeholderMismatches, []);
  assert.deepEqual(identical, []);
  assert.ok(overrideCount > 0);
});

test("en-GM Grade 1–6 / Lower Basic mapping and class/group distinction", () => {
  const enCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "common.json"), "utf8"));
  const gmCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  const mergedCommon = deepMergeJson(enCommon, gmCommon);

  // Grade labels inherit from en (identical → not redeclared); Maths is local.
  assert.equal(gmCommon.grade1, undefined);
  assert.equal(gmCommon.gradeLabel, undefined);
  assert.deepEqual(
    [
      mergedCommon.grade1,
      mergedCommon.grade2,
      mergedCommon.grade3,
      mergedCommon.grade4,
      mergedCommon.grade5,
      mergedCommon.grade6,
    ],
    ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]
  );
  assert.equal(mergedCommon.gradeLabel, "Grade {grade}");
  assert.equal(mergedCommon.subjectMath, "Maths");
  assert.equal(gmCommon.subjectMath, "Maths");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  const enLearning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "learning.json"), "utf8"));
  const mergedLearning = deepMergeJson(enLearning, learning);
  assert.equal(learning.master?.defaultPlayerName, "Pupil");
  assert.deepEqual(
    [
      mergedLearning.master?.grades?.g1,
      mergedLearning.master?.grades?.g2,
      mergedLearning.master?.grades?.g3,
      mergedLearning.master?.grades?.g4,
      mergedLearning.master?.grades?.g5,
      mergedLearning.master?.grades?.g6,
    ],
    ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]
  );
  assert.equal(mergedLearning.master?.gradeTitle, "Grade {grade}");
  assert.match(learning.math.howToLearnBlurb, /\bpractise\b/);

  const worksheets = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8"));
  assert.equal(worksheets.subjectMath, "Maths");
  assert.match(worksheets.createTypeColoring, /Colouring/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal?.choosePhysicalClass, "Choose class group");
  assert.equal(school.portal?.colClass, "Class group");
  assert.equal(school.portal?.classLabel, "Class group");
  assert.equal(school.portal?.classMgmtName, "Class group name");
  assert.equal(school.portal?.classMgmtSection, "Manage class groups");
  assert.equal(school.portal?.classMgmtCreate, "Create class group");
  assert.equal(school.portal?.statClasses, "Active class groups");
  assert.equal(school.portal?.quickClasses, "Manage class groups");
  assert.equal(school.portal?.viewClass, "View class group");
  assert.match(school.portal?.classesSubtitle || "", /class group/);
  assert.match(school.portal?.classesSubtitle || "", /\bgrade\b/i);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", PHYSICAL_CLASS_RE);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", AMBIGUOUS_PRIMARY_CLASS_RE);
  assert.doesNotMatch(JSON.stringify(school), BARE_CLASS_ACTION_RE);
  assert.notEqual(school.portal?.colClass, "Grade");
  assert.notEqual(school.portal?.classLabel, "Grade");
  // Grade remains the school-year label (not remapped to Class 1–6).
  assert.equal(school.portal?.chooseGrade, undefined);
  assert.equal(school.portal?.colGrade, undefined);

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.equal(teacher.dashboard?.noClassesTitle, "No active class groups");
  assert.equal(teacher.dashboard?.createClassLabel, "Class group name");
  assert.equal(teacher.dashboard?.createClassButton, "Create class group");
  assert.match(teacher.dashboard?.noClassesHint || "", /Manage class group/);
  assert.doesNotMatch(JSON.stringify(teacher.dashboard || {}), BARE_CLASS_ACTION_RE);

  const validation = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8"));
  assert.match(validation.api?.physical_class_not_found || "", /class group/);

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.registration?.intent?.school_representative, "School representative / head teacher");
  assert.equal(auth.studentLoginTitle, undefined, "account login inherits Student login from en");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Lower Basic/);
  assert.match(seo.homeTitle, /The Gambia/);
  assert.match(seo.homeDescription, /Lower Basic Education/);
  assert.match(seo.learningDescription, /Lower Basic/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  const intro1 = ui.public?.about?.intro1 || "";
  assert.match(intro1, /Lower Basic Education officially covers Grade 1–6/);
  assert.match(intro1, /LEO KIDS groups these grades for practice as Grade 1–2, Grade 3–4, and Grade 5–6/);
  assert.doesNotMatch(intro1, /Lower Basic[^\n.]{0,80}Grade 1–6:\s*Grade 1–2/);
  assert.doesNotMatch(intro1, UPPER_BASIC_PRODUCT_RE);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(
    [rewards.gradeBands?.g12, rewards.gradeBands?.g34, rewards.gradeBands?.g56],
    ["Grade 1–2", "Grade 3–4", "Grade 5–6"]
  );

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, AMBIGUOUS_PRIMARY_CLASS_RE);
  assert.doesNotMatch(allLocaleText, /\belementary\b/i);
  assert.doesNotMatch(allLocaleText, /\bprincipal\b/i);
  assert.doesNotMatch(allLocaleText, PHYSICAL_CLASS_RE);
  assert.doesNotMatch(allLocaleText, LOCAL_LANG_RE);
  assert.doesNotMatch(allLocaleText, ENGLISH_ONLY_GM_RE);
  assert.doesNotMatch(allLocaleText, PEER_LEAK_RE);
  assert.doesNotMatch(allLocaleText, UPPER_BASIC_PRODUCT_RE);
  assert.doesNotMatch(allLocaleText, /\bPupil login\b/);
  assert.doesNotMatch(allLocaleText, /\bLearner login\b/);
  assert.match(allLocaleText, /\bHelp centre\b/);
  assert.match(allLocaleText, /\bcolour/i);
  assert.match(allLocaleText, /\bpractising\b/);
  assert.match(allLocaleText, /\bhead teacher\b/);
  assert.match(allLocaleText, /\bclass group\b/);
  assert.match(allLocaleText, /\bpupil\b/i);
  assert.match(allLocaleText, /\bLower Basic\b/);
  assert.match(allLocaleText, /\bGrade 1–2\b/);
  assert.match(allLocaleText, /\bGrade 3–4\b/);
  assert.match(allLocaleText, /\bGrade 5–6\b/);
  assert.match(allLocaleText, ENGLISH_SCOPE_RE);
  assert.doesNotMatch(allLocaleText, FOREIGN_CURRENCY_RE);
  assert.doesNotMatch(allLocaleText, BARE_CLASS_ACTION_RE);
  assert.doesNotMatch(allLocaleText, AMERICAN_VERB_PRACTICE_RE);
  assert.doesNotMatch(allLocaleText, ISRAEL_RESIDUE_VALUE_RE);
  assert.doesNotMatch(allLocaleText, /\bClass [1-6]\b/);
});

test("en-GM content packs sparse contract vs en", () => {
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
          LOCAL_LANG_RE.test(value) ||
          AMBIGUOUS_PRIMARY_CLASS_RE.test(value) ||
          PHYSICAL_CLASS_RE.test(value) ||
          ENGLISH_ONLY_GM_RE.test(value) ||
          PEER_LEAK_RE.test(value) ||
          UPPER_BASIC_PRODUCT_RE.test(value) ||
          FOREIGN_CURRENCY_RE.test(value) ||
          ISRAEL_RESIDUE_LEAF_RE.test(key) ||
          ISRAEL_RESIDUE_VALUE_RE.test(value) ||
          AMERICAN_VERB_PRACTICE_RE.test(value) ||
          BARE_CLASS_ACTION_RE.test(value)
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
          LOCAL_LANG_RE.test(value) ||
          AMBIGUOUS_PRIMARY_CLASS_RE.test(value) ||
          PHYSICAL_CLASS_RE.test(value) ||
          ENGLISH_ONLY_GM_RE.test(value) ||
          PEER_LEAK_RE.test(value) ||
          UPPER_BASIC_PRODUCT_RE.test(value) ||
          FOREIGN_CURRENCY_RE.test(value) ||
          ISRAEL_RESIDUE_LEAF_RE.test(key) ||
          ISRAEL_RESIDUE_VALUE_RE.test(value) ||
          AMERICAN_VERB_PRACTICE_RE.test(value) ||
          BARE_CLASS_ACTION_RE.test(value)
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
  const enDemo = JSON.parse(fs.readFileSync(path.join(baseRoot, "demo/ui.json"), "utf8"));
  const mergedDemo = deepMergeJson(enDemo, demo);
  assert.deepEqual(
    [
      mergedDemo.grades?.g1,
      mergedDemo.grades?.g2,
      mergedDemo.grades?.g3,
      mergedDemo.grades?.g4,
      mergedDemo.grades?.g5,
      mergedDemo.grades?.g6,
    ],
    ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]
  );
  assert.equal(demo.subjects?.math, "Maths");

  const classesIdx = JSON.parse(
    fs.readFileSync(path.join(countryRoot, "global-burn-down/pages__school__classes__index.json"), "utf8")
  );
  assert.equal(classesIdx.copy?.no_classes_in_this_grade, "No class groups in this grade.");

  const teacherDash = JSON.parse(
    fs.readFileSync(
      path.join(countryRoot, "global-burn-down/components__teacher-portal__TeacherDashboardClient.json"),
      "utf8"
    )
  );
  assert.equal(teacherDash.copy?.manage_class, "Manage class group");
  assert.equal(teacherDash.copy?.classes, "Class groups");
  assert.equal(teacherDash.copy?.class_report, "Class group report");

  const recTemplates = JSON.parse(
    fs.readFileSync(
      path.join(
        countryRoot,
        "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
      ),
      "utf8"
    )
  );
  const recBlob = JSON.stringify(recTemplates);
  assert.doesNotMatch(recBlob, /Hellenism/i);
  assert.doesNotMatch(recBlob, /Judaism/i);
  assert.doesNotMatch(recBlob, AMERICAN_VERB_PRACTICE_RE);
  assert.equal(recTemplates.copy?.it_helps_to_practice_grade_6_hellenism_figures_and_roles_after_each_exer, undefined);
  assert.equal(recTemplates.copy?.this_week_focus_on_grade_6_hellenism_figures_and_roles, undefined);
});

test("en-GM help overlays parse and keep English slugs", async () => {
  const help = await import("../../data/help-center/en-GM/index.js");
  const parentsBase = await import("../../data/help-center/content/parents.js");
  assert.equal(help.ALL_ARTICLES_EN_GM.length, (
    (await import("../../data/help-center/content/parents.js")).PARENT_ARTICLES.length +
    (await import("../../data/help-center/content/students.js")).STUDENT_ARTICLES.length +
    (await import("../../data/help-center/content/parent-report.js")).PARENT_REPORT_ARTICLES.length +
    (await import("../../data/help-center/content/subjects.js")).SUBJECT_ARTICLES.length
  ));
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_EN_GM.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_EN_GM.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /Lower Basic Education officially covers Grade 1–6/);
  assert.match(welcomeBlob, /LEO KIDS groups these grades for practice as Grade 1–2, Grade 3–4, and Grade 5–6/);
  assert.match(welcomeBlob, /The Gambia/);
  assert.match(welcomeBlob, /maths/i);
  assert.doesNotMatch(welcomeBlob, /Lower Basic[^\n.]{0,80}Grade 1–6:\s*Grade 1–2/);
  assert.doesNotMatch(welcomeBlob, UPPER_BASIC_PRODUCT_RE);
  assert.doesNotMatch(welcomeBlob, /Hellenism/i);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_GM), LOCAL_LANG_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_GM), AMBIGUOUS_PRIMARY_CLASS_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_GM), /\belementary\b/i);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_GM), PHYSICAL_CLASS_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_GM), ENGLISH_ONLY_GM_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_GM), PEER_LEAK_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_GM), UPPER_BASIC_PRODUCT_RE);
  assert.equal(help.SECTIONS_EN_GM.students.title, "Guide for pupils");
});

test("en-GM does not ship word-meanings overlay or mutate English targets", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.equal(booksUi.subjects?.math, "Maths");
  assert.ok(!("words" in booksUi));
  assert.ok(!("phonics" in booksUi));
  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta?.["math.g1"]?.bookTitle, "Maths — Grade 1");
  assert.equal(titles.meta?.["math.g6"]?.bookTitle, "Maths — Grade 6");
  assert.equal(
    fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "books/english-page-skills.json")),
    false
  );
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-en-GM-overlay.js")), false);
});

test("en-GM Mathematics/Maths and British English spelling authority", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.subjects.math, "Maths");
  assert.match(learning.math.howToLearnBlurb, /\bpractise\b/);
  assert.doesNotMatch(learning.math.howToLearnBlurb, /\bpractice maths\b/);
  assert.match(learning.geometry.reference.shapes.circle.desc, /\bcentre\b/);

  const reports = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "reports.json"), "utf8"));
  assert.match(reports.remediateSameLevel, /\bpractising\b/);
  assert.match(reports.v2.executive.majorTrendsManyUnitsLine2, /\bstabilise\b/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.public.homepage.parentBenefits.highlight, /\borganised\b/);
  assert.match(ui.nav.helpCenter, /\bcentre\b/);

  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.match(booksUi.shell.practiceMath, /\bpractise\b/);
});

test("en-GM Help subject summaries use practise (verb) and keep practice (noun)", async () => {
  const help = await import("../../data/help-center/en-GM/index.js");
  const subjects = help.BY_SECTION_EN_GM.subjects;
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    assert.match(String(article.summary), /how to practise\./);
    assert.doesNotMatch(String(article.summary), /how to practice\./);
    assert.match(String(article.summary), /\bpractice for Grade 1–6\b/);
  }
  const subjectsBlob = JSON.stringify(subjects);
  assert.doesNotMatch(subjectsBlob, /how to practice/i);
  assert.match(subjectsBlob, /Go to Maths practice/);
});

test("en-GM pupil/learner/student/child terminology", () => {
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
  assert.match(ui.home?.subhead, /Lower Basic pupils/);
  assert.match(ui.public?.homepage?.teachers?.text, /pupils perform/);
  assert.equal(ui.public?.homepage?.teachers?.bullet0, "Manage pupils");
  assert.match(ui.public?.about?.intro1, /Lower Basic pupils in The Gambia/);
  assert.match(ui.public?.about?.intro1, /LEO KIDS groups these grades for practice as Grade 1–2/);

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.master?.defaultPlayerName, "Pupil");
});

test("en-GM public SEO scopes English Lower Basic experience in The Gambia", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, ENGLISH_SCOPE_RE);
  assert.match(seo.homeDescription, ENGLISH_SCOPE_RE);
  assert.match(seo.learningDescription, ENGLISH_SCOPE_RE);
  assert.doesNotMatch(JSON.stringify(seo), ENGLISH_ONLY_GM_RE);
  assert.doesNotMatch(JSON.stringify(seo), UPPER_BASIC_PRODUCT_RE);

  const publicSeo = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/lib__site__public-page-seo.json"),
      "utf8"
    )
  );
  assert.match(
    publicSeo.copy.digital_practice_for_elementary_learners_in_math_geometry_english_and_sc,
    /Lower Basic.*The Gambia|The Gambia.*Lower Basic/
  );
  assert.match(publicSeo.copy.leo_kids_practice_for_elementary_learners, /Lower Basic.*The Gambia/);

  const appTitle = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "global-burn-down/pages___app.json"), "utf8")
  );
  assert.match(appTitle.copy.default_document_title, /Lower Basic.*The Gambia|The Gambia.*Lower Basic/i);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home.subhead, ENGLISH_SCOPE_RE);
  assert.match(ui.public.about.intro1, ENGLISH_SCOPE_RE);
  assert.match(ui.public.about.intro1, /The Gambia/);
});

test("en-GM currency surfaces stay free of foreign currency chrome", () => {
  // Authority: Gambian dalasi / GMD — no local currency chrome keys in en base,
  // so sparse overlay must not invent foreign currency labels.
  const localeBlob = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  const packBlob = listJsonRel(path.join(ROOT, "content-packs", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(localeBlob, FOREIGN_CURRENCY_RE);
  assert.doesNotMatch(packBlob, FOREIGN_CURRENCY_RE);
  assert.doesNotMatch(localeBlob, /\bNaira\b|\bCedi\b|\bShilling\b|\bRand\b|\bRupee\b/);
  assert.doesNotMatch(packBlob, /\bNaira\b|\bCedi\b|\bShilling\b|\bRand\b|\bRupee\b/);
});

test("en-GM has no local overrides under Israeli curriculum authority slugs", () => {
  const packHits = collectIsraelResidueHits(path.join(ROOT, "content-packs", LOCALE));
  const localeHits = collectIsraelResidueHits(path.join(ROOT, "locales", LOCALE));
  const helpDir = path.join(ROOT, "data", "help-center", LOCALE);
  /** @type {string[]} */
  const helpHits = [];
  if (fs.existsSync(helpDir)) {
    for (const ent of fs.readdirSync(helpDir)) {
      const abs = path.join(helpDir, ent);
      if (!fs.statSync(abs).isFile()) continue;
      const raw = fs.readFileSync(abs, "utf8");
      if (/israeli-primary-curriculum-map|Hebrew|homeland|Israel|Israeli|Moledet|Hasmonaean|Judea|Judaism|Hellenism|עברית|מולדת|ישראל/i.test(raw)) {
        helpHits.push(`help-center/${ent}`);
      }
    }
  }
  assert.deepEqual(packHits, [], "Israel/Hebrew residue in content-packs/en-GM");
  assert.deepEqual(localeHits, [], "Israel/Hebrew residue in locales/en-GM");
  assert.deepEqual(helpHits, [], "Israel/Hebrew residue in help-center/en-GM");

  const learningIndexPath = path.join(ROOT, "content-packs", LOCALE, "learning/burn-down-index.json");
  if (fs.existsSync(learningIndexPath)) {
    const learningIndex = JSON.parse(fs.readFileSync(learningIndexPath, "utf8"));
    assert.equal(
      learningIndex["utils__curriculum-audit__israeli-primary-curriculum-map"],
      undefined,
      "no local overrides under israeli-primary-curriculum-map"
    );
  }
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
});

test("en-GM runtime probe: homepage value card practised + parent empty state", () => {
  const enUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "ui.json"), "utf8"));
  const gmUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  const merged = deepMergeJson(enUi, gmUi);

  assert.equal(
    merged.public?.homepage?.valueCards?.["0"]?.text,
    "See what your child practised, where they are improving, and what to reinforce."
  );
  assert.equal(merged.empty?.noStudents, "No children yet. Add a child to get started.");

  const homepageBlob = JSON.stringify(merged.public?.homepage?.valueCards || {});
  assert.doesNotMatch(homepageBlob, /\bpracticed\b/);
  assert.doesNotMatch(homepageBlob, /\bpracticing\b/);
  assert.match(homepageBlob, /\bpractised\b/);

  assert.doesNotMatch(String(merged.empty?.noStudents), /pupils/i);
  assert.doesNotMatch(String(merged.empty?.noStudents), /\bstudents\b/i);
});

test("en-GM content agent did not modify other locales or shared runtime", () => {
  const meaningEn = path.join(ROOT, "data/english-questions/word-meanings/en.js");
  assert.ok(fs.existsSync(meaningEn));
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/en-GM.js")), false);
  assert.equal(fs.existsSync(GENERATOR_PATH), false);

  for (const root of ALLOWED_CONTENT_ROOTS) {
    if (!fs.existsSync(root)) continue;
  }
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "gm")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", "gm")), false);

  for (const other of ["en", "en-GH", "en-NG", "en-CM", "en-MU", "en-RW", "en-SL", "en-LR"]) {
    assert.ok(fs.existsSync(path.join(ROOT, "locales", other)), other);
  }
});
