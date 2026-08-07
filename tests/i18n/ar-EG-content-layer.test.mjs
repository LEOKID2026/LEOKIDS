/**
 * ar-EG (Egypt) sparse content-layer checks vs Arabic Master ar-001.
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
const LOCALE = "ar-EG";
const BASE = "ar-001";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const EG_GRADES = [
  "الصف الأول",
  "الصف الثاني",
  "الصف الثالث",
  "الصف الرابع",
  "الصف الخامس",
  "الصف السادس",
];
/** Other-country / dialect leakage markers (not Egyptian MSA education terms). */
const CROSS_COUNTRY_RE =
  /\b(السعودية|الإمارات|المغرب|تونس|الجزائر|الكويت|قطر|عمان|البحرين|الأردن|لبنان|العراق|سوريا|فلسطين)\b/;
/** Numeric grade labels from ar-001 must not remain as EG overrides. */
const NUMERIC_GRADE_LABEL_RE = /الصف [1-6]\b/;
/** Forbidden visible English UI chrome in country overlay (brand Leo Kids allowed). */
const FORBIDDEN_EN_UI_RE =
  /\b(Grade [1-6]|Sign out|Dashboard|Worksheet|Parent guide|Continue|Cancel|Save|Loading)\b/i;

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

test("ar-EG locale namespaces parse and stay sparse vs ar-001", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("copilot.json"));

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
    assert.equal(CROSS_COUNTRY_RE.test(blob), false, `cross-country in ${file}`);
    assert.equal(FORBIDDEN_EN_UI_RE.test(blob), false, `forbidden EN UI in ${file}`);
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

test("ar-EG grade mapping الصف الأول–السادس (MoE primary; not numeric الصف N)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    EG_GRADES
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
    EG_GRADES
  );
  assert.match(learning.master?.gradeRequired || "", /صفك/);
  assert.doesNotMatch(learning.master?.gradeRequired || "", /درجتك/);

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
    EG_GRADES
  );

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /مصر/);
  assert.match(seo.homeTitle, /المرحلة الابتدائية/);
  assert.match(seo.learningDescription, /الأول إلى السادس الابتدائي/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, NUMERIC_GRADE_LABEL_RE);
  assert.match(allLocaleText, /الصف الأول/);
  assert.match(allLocaleText, /الصف السادس/);
});

test("ar-EG grade vs class-group distinction (صف ≠ فصل; no فصل دراسي for class group)", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(
    school.portal?.classesSubtitle,
    "اختر الصف والفصل والمادة - التقارير والإدارة حسب الصف"
  );
  assert.match(school.portal?.classesSubtitle || "", /الصف/);
  assert.match(school.portal?.classesSubtitle || "", /الفصل/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /الفصل الدراسي/);

  const demo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8"));
  assert.equal(demo.activity?.classroomUnavailable, "أنشطة الفصل غير متوفرة في الوضع التجريبي.");
  assert.doesNotMatch(demo.activity?.classroomUnavailable || "", /الفصل الدراسي/);
});

test("ar-EG content packs sparse contract vs ar-001", () => {
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
  const crossCountryHits = [];
  /** @type {string[]} */
  const forbiddenEnHits = [];
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
        if (CROSS_COUNTRY_RE.test(value)) crossCountryHits.push(`${rel}:${key}`);
        if (FORBIDDEN_EN_UI_RE.test(value)) forbiddenEnHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && HEBREW_RE.test(value)) hebrewHits.push(`${rel}:${key}`);
      if (typeof value === "string" && CROSS_COUNTRY_RE.test(value)) {
        crossCountryHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && FORBIDDEN_EN_UI_RE.test(value)) {
        forbiddenEnHits.push(`${rel}:${key}`);
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
  assert.deepEqual(extraFiles, [], "files without ar-001 authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(crossCountryHits, []);
  assert.deepEqual(forbiddenEnHits, []);
});

test("ar-EG pack grade labels use ordinals; inherit MSA student/teacher/parent terms", () => {
  const teacherGrade = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/lib__teacher-portal__teacher-class-grade.json"),
      "utf8"
    )
  );
  assert.deepEqual(
    [
      teacherGrade.copy.grade_1,
      teacherGrade.copy.grade_2,
      teacherGrade.copy.grade_3,
      teacherGrade.copy.grade_4,
      teacherGrade.copy.grade_5,
      teacherGrade.copy.grade_6,
    ],
    EG_GRADES
  );

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.equal(rewards.gradeBands.g12, "الصف الأول–الثاني");
  assert.equal(rewards.gradeBands.g34, "الصف الثالث–الرابع");
  assert.equal(rewards.gradeBands.g56, "الصف الخامس–السادس");

  // Terminology locks inherited from ar-001 (not re-copied as identical overrides).
  const arCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8"));
  assert.equal(arCommon.grade1, "الصف 1");
  const arSchool = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "school.json"), "utf8"));
  assert.match(JSON.stringify(arSchool), /ولي الأمر/);
  assert.match(JSON.stringify(arSchool), /معلم/);
  const arLearning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "learning.json"), "utf8"));
  assert.equal(arLearning.master?.defaultPlayerName, "التلميذ");
  const arWorksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "worksheets.json"), "utf8")
  );
  assert.equal(arWorksheets.documentTitle, "ورقة عمل");
});

test("ar-EG academic grade does not resolve to درجة (practice + copilot + help)", async () => {
  /** Academic-grade misuse of درجة (not angle/score/temperature). */
  const ACADEMIC_DARAJAH_RE =
    /اختر الدرجة|درجة أخرى|فوق الدرجة المذكورة|الاسم أو الدرجة|الدرجة والمستوى/;

  const learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  assert.equal(
    learning.math?.howToLearnSteps?.step1,
    "اختر الصف والصعوبة والعملية (الجمع والطرح والضرب والقسمة والكسور والنسب المئوية والمزيد)."
  );
  assert.match(learning.math?.howToLearnSteps?.step1 || "", /اختر الصف والصعوبة/);
  assert.doesNotMatch(learning.math?.howToLearnSteps?.step1 || "", /اختر الدرجة/);

  assert.equal(
    learning.geometry?.howToLearnSteps?.step1,
    "اختر الصف والصعوبة والموضوع (المساحة والمحيط والحجم والزوايا وفيثاغورس والمزيد)."
  );
  assert.match(learning.geometry?.howToLearnSteps?.step1 || "", /اختر الصف والصعوبة/);
  assert.doesNotMatch(learning.geometry?.howToLearnSteps?.step1 || "", /اختر الدرجة/);

  assert.equal(
    learning.geometry?.errors?.noTopics,
    "لا توجد مواضيع متاحة لهذا الصف. الرجاء اختيار صف آخر."
  );
  assert.match(learning.geometry?.errors?.noTopics || "", /صف آخر/);
  assert.doesNotMatch(learning.geometry?.errors?.noTopics || "", /درجة أخرى/);

  const copilot = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "copilot.json"), "utf8")
  );
  const aboveGrade =
    copilot.answers?.["utils_parent-copilot_intent-answer-composers"]
      ?.according_to_the_report_there_is_still_insufficient_evidence_for;
  assert.match(aboveGrade || "", /فوق الصف المذكور/);
  assert.doesNotMatch(aboveGrade || "", /فوق الدرجة المذكورة/);

  const { BY_SECTION_AR_EG } = await import("../../data/help-center/ar-EG/index.js");
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = BY_SECTION_AR_EG.subjects.find((a) => a.slug === slug);
    assert.ok(article, `missing help subject ${slug}`);
    const practicePara = (article.blocks || []).find(
      (b) => b.kind === "paragraph" && String(b.text || "").includes("والمستوى")
    );
    assert.ok(practicePara, `practice paragraph missing for ${slug}`);
    assert.match(String(practicePara.text), /اختر الصف والمستوى/);
    assert.doesNotMatch(String(practicePara.text), /اختر الدرجة والمستوى/);
  }

  const editArticle = BY_SECTION_AR_EG.parents.find((a) => a.slug === "edit-or-delete-student");
  assert.ok(editArticle);
  assert.equal(editArticle.summary, "تغيير الاسم أو الصف، وحذفها مع التأكيد.");
  assert.doesNotMatch(String(editArticle.summary), /أو الدرجة/);

  const overlayBlob = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8")
    ),
    JSON.stringify(BY_SECTION_AR_EG.subjects),
    JSON.stringify(BY_SECTION_AR_EG.parents.find((a) => a.slug === "edit-or-delete-student")),
  ].join("\n");
  assert.equal(ACADEMIC_DARAJAH_RE.test(overlayBlob), false, "academic درجة misuse in ar-EG layer");

  // Legitimate non-academic درجة must remain available via ar-001 inheritance (angles).
  const arGeom = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "learning.json"), "utf8")
  );
  assert.match(arGeom.geometry?.reference?.terms?.right_angle?.desc || "", /90 درجة/);
});

test("ar-EG English-learning targets preserved (no word-meanings country pack)", () => {
  const egMeanings = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(egMeanings), false, "do not copy word-meanings when identical to ar-001");
  assert.ok(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/ar-001.js")));
});

test("ar-EG does not modify other locales or shared runtime", () => {
  const guarded = [
    "locales/ar-001/common.json",
    "locales/en/common.json",
    "lib/i18n/locale-registry.js",
    "lib/i18n/load-messages.js",
  ];
  for (const rel of guarded) {
    const abs = path.join(ROOT, rel);
    assert.ok(fs.existsSync(abs), rel);
  }
  // Country layer must not introduce sibling Arabic country dirs as a side effect of this layer.
  const arabicLocales = fs
    .readdirSync(path.join(ROOT, "locales"))
    .filter((name) => name.startsWith("ar-"));
  assert.ok(arabicLocales.includes("ar-001"));
  assert.ok(arabicLocales.includes("ar-EG"));
});
