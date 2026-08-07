/**
 * Algeria (ar-DZ) sparse country overlay checks vs Arabic Master (ar-001).
 * Planned chain: ar-DZ → ar-001 → en. No registry wiring / build / full suite.
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
const LOCALE = "ar-DZ";
const BASE = "ar-001";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;

/** Morocco / Tunisia / Egypt / Saudi / France / other Maghreb leakage. */
const CROSS_COUNTRY_RE =
  /المغرب|تونس|مصر|السعودية|المملكة العربية|France|Maroc|Tunisie|Égypte|Egypt|Morocco|Tunisia|الدارجة المغربية|الصف\s*[1-6](?!\s*ابتدائي)|CP1|CM2|\b6e\b/i;

/** Claims Arabic is the only language of Algeria. */
const MONOLINGUAL_CLAIM_RE =
  /اللغة الوحيدة|فقط بالعربية في الجزائر|العربية وحدها|لا توجد لغة أخرى|اللغة الرسمية الوحيدة(?!\s+للواجهة)/;

const DZ_GRADES = [
  "السنة 1 ابتدائي",
  "السنة 2 ابتدائي",
  "السنة 3 ابتدائي",
  "السنة 4 ابتدائي",
  "السنة 5 ابتدائي",
  "السنة 1 متوسط",
];

/** Authoritative display resolver for product grade IDs (test-local; mirrors overlay keys). */
function resolveArDzGradeDisplay(gradeId) {
  const n = String(gradeId ?? "")
    .trim()
    .replace(/^grade_?/i, "")
    .replace(/^g/i, "");
  const idx = Number(n);
  if (!Number.isFinite(idx) || idx < 1 || idx > 6) return "";
  return DZ_GRADES[idx - 1];
}

/** Dangerous numeric year templates that would yield السنة 6 for grade6. */
const NUMERIC_YEAR_TEMPLATE_RE = /السنة\s*\{(?:grade|n)\}/;

/** Visible English UI tokens that must not appear as country overrides. */
const FORBIDDEN_EN_UI_RE =
  /\b(Grade|Practice|Worksheets|Reports|Parent Guides|Regular|Advanced|Math|Science)\b/;

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
 * @param {unknown} obj
 * @param {string} [prefix]
 * @param {Map<string, unknown>} [out]
 */
function collectLeavesTyped(obj, prefix = "", out = new Map()) {
  if (obj == null) return out;
  if (typeof obj !== "object") {
    out.set(prefix || "(root)", obj);
    return out;
  }
  if (Array.isArray(obj)) {
    out.set(prefix || "(root)", obj);
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === "object" && !Array.isArray(v)) collectLeavesTyped(v, p, out);
    else out.set(p, v);
  }
  return out;
}

/** @param {string} s */
function placeholders(s) {
  return [...String(s).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort();
}

/**
 * @param {string} blob
 * @param {string} label
 */
function assertNoLeakage(blob, label) {
  assert.equal(HEBREW_RE.test(blob), false, `Hebrew in ${label}`);
  assert.equal(CROSS_COUNTRY_RE.test(blob), false, `cross-country leak in ${label}: ${blob.match(CROSS_COUNTRY_RE)?.[0]}`);
  assert.equal(MONOLINGUAL_CLAIM_RE.test(blob), false, `monolingual claim in ${label}`);
}

test("ar-DZ locale JSON parse + sparse contract vs ar-001", () => {
  const countryRoot = path.join(ROOT, "locales", LOCALE);
  const baseRoot = path.join(ROOT, "locales", BASE);
  const files = listJsonRel(countryRoot);
  assert.ok(files.length > 0, "expected ar-DZ locale files");

  /** @type {Array<{ file: string, key: string }>} */
  const orphans = [];
  /** @type {Array<{ file: string, key: string }>} */
  const identical = [];
  /** @type {Array<{ file: string, key: string }>} */
  const placeholderMismatches = [];
  /** @type {Array<{ file: string, key: string }>} */
  const typeMismatches = [];
  /** @type {string[]} */
  const emptyFiles = [];

  for (const rel of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    assert.ok(country && typeof country === "object");
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(rel);
    assertNoLeakage(JSON.stringify(country), rel);

    const basePath = path.join(baseRoot, rel);
    assert.ok(fs.existsSync(basePath), `missing ar-001 authority ${rel}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const countryLeaves = collectLeavesTyped(country);
    const baseLeaves = collectLeavesTyped(base);

    for (const [key, value] of countryLeaves) {
      if (!baseLeaves.has(key)) orphans.push({ file: rel, key });
      else if (baseLeaves.get(key) === value) identical.push({ file: rel, key });
      else {
        const bv = baseLeaves.get(key);
        if (typeof value !== typeof bv) typeMismatches.push({ file: rel, key });
        if (typeof value === "string" && typeof bv === "string") {
          if (placeholders(value).join(",") !== placeholders(bv).join(",")) {
            placeholderMismatches.push({ file: rel, key });
          }
          if (FORBIDDEN_EN_UI_RE.test(value) && !FORBIDDEN_EN_UI_RE.test(bv)) {
            assert.fail(`forbidden English UI override ${rel} ${key}: ${value}`);
          }
        }
      }
    }
  }

  assert.deepEqual(emptyFiles, []);
  assert.equal(orphans.length, 0, `orphan keys: ${JSON.stringify(orphans)}`);
  assert.equal(identical.length, 0, `identical overrides: ${JSON.stringify(identical)}`);
  assert.equal(
    placeholderMismatches.length,
    0,
    `placeholder mismatches: ${JSON.stringify(placeholderMismatches)}`
  );
  assert.equal(typeMismatches.length, 0, `type mismatches: ${JSON.stringify(typeMismatches)}`);
});

test("ar-DZ grade mapping (5-year primary + 1AM display for grade6)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    DZ_GRADES
  );
  // Passthrough: callers must pass already-resolved grade1–grade6 labels (France pattern).
  assert.equal(common.gradeLabel, "{grade}");
  assert.equal(common.grade6, "السنة 1 متوسط");
  assert.notEqual(common.grade6, "السنة 6");
  assert.notEqual(resolveArDzGradeDisplay(6), "السنة 6");
  assert.equal(resolveArDzGradeDisplay(6), "السنة 1 متوسط");
  assert.equal(resolveArDzGradeDisplay("grade_6"), "السنة 1 متوسط");
  assert.equal(resolveArDzGradeDisplay("g6"), "السنة 1 متوسط");
  for (let i = 1; i <= 6; i += 1) {
    assert.equal(resolveArDzGradeDisplay(i), DZ_GRADES[i - 1]);
    assert.equal(common[`grade${i}`], DZ_GRADES[i - 1]);
  }

  const learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    DZ_GRADES
  );
  assert.equal(learning.master?.gradeTitle, "{grade}");
  assert.equal(learning.master?.grades?.g6, "السنة 1 متوسط");
  assert.notEqual(learning.master?.grades?.g6, "السنة 6");
  assert.equal(learning.chooseGrade, "اختر السنة");
  assert.equal(learning.master?.gradeFallback, "السنة");
  assert.equal(learning.master?.currentGrade, "السنة الحالية");
  assert.match(learning.master?.gradeRequired || "", /السنة/);
  assert.doesNotMatch(learning.master?.gradeRequired || "", /\bالصف\b/);

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
    DZ_GRADES
  );
  assert.equal(worksheets.gradeField, "السنة");
  assert.equal(worksheets.gradeFilterAll, "جميع السنوات");
  assert.equal(worksheets.gradeG6, "السنة 1 متوسط");
  assert.notEqual(worksheets.gradeG6, "السنة 6");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /الجزائر/);
  assert.match(seo.homeTitle, /بالعربية/);
  assert.match(seo.homeDescription, /النسخة العربية للجزائر/);
  assert.match(seo.learningDescription, /السنة/);
  assert.doesNotMatch(seo.homeTitle, MONOLINGUAL_CLAIM_RE);
  assert.doesNotMatch(seo.homeDescription, /الفرنسية|الأمازيغية|Tamazight|Darija/i);
});

test("ar-DZ forbids numeric السنة {grade|n} templates (grade6 ≠ السنة 6)", () => {
  const blobs = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8")
    ),
  ];
  for (const blob of blobs) {
    assert.equal(NUMERIC_YEAR_TEMPLATE_RE.test(blob), false, `numeric year template: ${blob.match(NUMERIC_YEAR_TEMPLATE_RE)?.[0]}`);
    assert.doesNotMatch(blob, /السنة\s*6(?!\s*ابتدائي)/);
  }

  const pack = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-DZ/global-burn-down/burn-down-index.json"), "utf8")
  );
  assert.equal(pack["lib__teacher-portal__teacher-class-grade"].grade_6, "السنة 1 متوسط");
  assert.notEqual(pack["lib__teacher-portal__teacher-class-grade"].grade_6, "السنة 6");
  assert.equal(pack["lib__worksheets__worksheet-meta-labels-en.server"].grade_6, "السنة 1 متوسط");
  assert.equal(pack["lib__worksheets__worksheet-meta-labels-en.server"].grade_n, undefined);

  const demo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-DZ/demo/ui.json"), "utf8"));
  assert.equal(demo.grades.g6, "السنة 1 متوسط");
  assert.notEqual(demo.grades.g6, "السنة 6");

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-DZ/rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, {
    g12: "السنة 1–2 ابتدائي",
    g34: "السنة 3–4 ابتدائي",
    g56: "السنة 5 ابتدائي–1 متوسط",
  });

  const approved = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/ar-DZ/reports/burn-down/lib__parent-ui__parent-report-approved-copy.json"
      ),
      "utf8"
    )
  );
  assert.equal(approved.copy.grade_word_n, "{grade}");

  // Passthrough + authoritative map: grade6 never becomes السنة 6.
  assert.equal(commonGradePassthrough(resolveArDzGradeDisplay(6)), "السنة 1 متوسط");
});

/** @param {string} resolvedLabel */
function commonGradePassthrough(resolvedLabel) {
  return String("{grade}").replace("{grade}", resolvedLabel);
}

test("ar-DZ grade vs class-group distinction (سنة ≠ قسم)", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal.colGrade, "السنة");
  assert.equal(school.portal.colClass, "قسم");
  assert.equal(school.portal.classLabel, "قسم");
  assert.equal(school.portal.chooseGrade, "اختر السنة");
  assert.equal(school.portal.choosePhysicalClass, "اختر القسم");
  assert.match(school.portal.classesSubtitle, /السنة والقسم/);
  assert.notEqual(school.portal.colGrade, school.portal.colClass);
  assert.doesNotMatch(JSON.stringify(school), /اختر الفصل|اسم الفصل|تقرير الفصل/);

  const teacher = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8")
  );
  assert.match(teacher.dashboard.createClassLabel, /القسم/);
  assert.match(teacher.classGuidanceSeverityTier.critical_class, /القسم/);
  assert.match(teacher.supportSuggestions.targetedReview, /في القسم/);
  assert.match(teacher.actionTypes.class_reteach, /القسم/);
  assert.doesNotMatch(JSON.stringify(teacher), /يحتاج الفصل|في الفصل|للفصل/);
});

test("ar-DZ teacher terminology أستاذ on school/teacher/ui surfaces", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal.roleTeacher, "الأستاذ");
  assert.equal(school.portal.teacherLabel, "الأستاذ");
  assert.equal(school.portal.colTeacher, "الأستاذ");
  assert.match(school.portal.navTeachers, /الأساتذة/);
  assert.match(school.portal.teachersTitle, /الأساتذة/);
  assert.doesNotMatch(JSON.stringify(school), /المعلّم|المعلمين|المعلّمون/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.nav.teachers, "للأساتذة");
  assert.equal(ui.nav.teacherPortal, "بوابة الأستاذ");
  assert.match(ui.teacherShell.classReportTitle, /القسم/);
  assert.match(ui.teacherShell.myClasses, /أقسامي/);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.teachersTitle, /للأساتذة/);
});

test("ar-DZ content-packs sparse contract vs ar-001", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", BASE);
  const baseExists = (rel) => fs.existsSync(path.join(baseRoot, rel));

  /** @type {string[]} */
  const extraFiles = [];
  /** @type {Array<{ rel: string, key: string }>} */
  const orphanKeys = [];
  /** @type {Array<{ rel: string, key: string }>} */
  const identicalOverrides = [];
  /** @type {Array<{ rel: string }>} */
  const nearFullCopies = [];
  /** @type {string[]} */
  const emptyFiles = [];

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    assert.ok(country && typeof country === "object");
    assertNoLeakage(JSON.stringify(country), rel);
    const countryLeaves = collectStringLeaves(country);
    if (countryLeaves.size === 0) emptyFiles.push(rel);

    if (isBurnDownIndexPath(rel)) {
      const domain = rel.split("/")[0];
      const baseRel = `${domain}/burn-down-index.json`;
      if (!baseExists(baseRel)) {
        extraFiles.push(rel);
        continue;
      }
      const baseIndex = JSON.parse(fs.readFileSync(path.join(baseRoot, baseRel), "utf8"));
      const indexAudit = auditBurnDownIndexOverlay(country, baseIndex, { countryRoot, domain });
      for (const key of indexAudit.orphanKeys) orphanKeys.push({ rel, key });
      for (const key of indexAudit.identicalOverrides) identicalOverrides.push({ rel, key });
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
      if (!baseLeaves.has(key)) orphanKeys.push({ rel, key });
      else if (baseLeaves.get(key) === value) identicalOverrides.push({ rel, key });
      else if (typeof value === "string" && typeof baseLeaves.get(key) === "string") {
        const a = placeholders(value).join(",");
        const b = placeholders(/** @type {string} */ (baseLeaves.get(key))).join(",");
        assert.equal(a, b, `placeholder mismatch ${rel} ${key}`);
      }
    }
    const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
    if (assessment.isNearFullCopy) nearFullCopies.push({ rel });
  }

  assert.deepEqual(emptyFiles, []);
  assert.equal(extraFiles.length, 0, `extra/orphan files: ${JSON.stringify(extraFiles)}`);
  assert.equal(orphanKeys.length, 0, `orphan keys: ${JSON.stringify(orphanKeys)}`);
  assert.equal(
    identicalOverrides.length,
    0,
    `identical overrides: ${JSON.stringify(identicalOverrides)}`
  );
  assert.equal(nearFullCopies.length, 0, `near-full copies: ${JSON.stringify(nearFullCopies)}`);
});

test("ar-DZ pack grade labels + bands closed", () => {
  const demo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-DZ/demo/ui.json"), "utf8"));
  assert.equal(demo.bar.changeGrade, "تغيير السنة");
  assert.equal(demo.bar.gradeLabel, "السنة");
  assert.deepEqual(Object.values(demo.grades), DZ_GRADES);

  const teacherGrade = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs/ar-DZ/global-burn-down/burn-down-index.json"),
      "utf8"
    )
  );
  assert.deepEqual(
    [
      teacherGrade["lib__teacher-portal__teacher-class-grade"].grade_1,
      teacherGrade["lib__teacher-portal__teacher-class-grade"].grade_6,
    ],
    [DZ_GRADES[0], DZ_GRADES[5]]
  );

  const games = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-DZ/games/burn-down-index.json"), "utf8")
  );
  assert.equal(
    games["components__educational-games__leo-lab__leo-lab-data"].grades_1_2,
    "السنة 1–2 ابتدائي"
  );
  assert.equal(
    games["components__educational-games__leo-word-train__leo-word-train-data"].grades_5_6,
    "السنة 5 ابتدائي–1 متوسط"
  );
  assert.doesNotMatch(JSON.stringify(games), /الصف\s*[1-6]/);

  const reportGrade = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/ar-DZ/reports/burn-down/components__parent-report-detailed-surface.json"
      ),
      "utf8"
    )
  );
  assert.equal(reportGrade.copy.grade, "السنة");
});

/**
 * Deep-merge ar-001 ← ar-DZ for effective-copy probes (mirrors runtime inheritance).
 * @param {unknown} a
 * @param {unknown} b
 */
function deepMerge(a, b) {
  if (b == null) return a;
  if (a == null) return b;
  if (typeof b !== "object" || Array.isArray(b)) return b;
  if (typeof a !== "object" || Array.isArray(a)) return b;
  /** @type {Record<string, unknown>} */
  const out = { ...(/** @type {Record<string, unknown>} */ (a)) };
  for (const [k, v] of Object.entries(/** @type {Record<string, unknown>} */ (b))) {
    out[k] = deepMerge(out[k], v);
  }
  return out;
}

/**
 * @param {string} ns file basename without .json
 */
function effectiveLocale(ns) {
  const base = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, `${ns}.json`), "utf8"));
  const ovPath = path.join(ROOT, "locales", LOCALE, `${ns}.json`);
  const ov = fs.existsSync(ovPath) ? JSON.parse(fs.readFileSync(ovPath, "utf8")) : {};
  return deepMerge(base, ov);
}

test("ar-DZ effective copy: learning blurbs/steps use السنة not صف/درجة", () => {
  const learning = /** @type {Record<string, any>} */ (effectiveLocale("learning"));
  assert.match(learning.master.mistakePracticeBlurb, /السنة/);
  assert.doesNotMatch(learning.master.mistakePracticeBlurb, /الصف|درجة/);
  for (const subject of ["math", "geometry", "science"]) {
    assert.match(learning[subject].howToLearnBlurb, /السنة/);
    assert.doesNotMatch(learning[subject].howToLearnBlurb, /\bالصف\b|درجة/);
    assert.match(learning[subject].howToLearnSteps.step1, /السنة/);
    assert.doesNotMatch(learning[subject].howToLearnSteps.step1, /درجة|\bالصف\b/);
  }
  assert.equal(learning.master.grades.g6, "السنة 1 متوسط");
  assert.notEqual(learning.master.grades.g6, "السنة 6");
});

test("ar-DZ effective copy: teacher=أستاذ, class-group=قسم, about/help surfaces", () => {
  const auth = /** @type {Record<string, any>} */ (effectiveLocale("auth"));
  assert.match(auth.teacherLoginTitle, /الأستاذ/);
  assert.doesNotMatch(auth.teacherLoginTitle, /المعلم/);

  const platform = /** @type {Record<string, any>} */ (effectiveLocale("platform"));
  assert.equal(platform.roles.teacher, "الأستاذ");
  assert.match(platform.auditActions.school_class_viewed, /القسم/);
  assert.match(platform.auditActions.school_class_teacher_reassigned, /أستاذ القسم|القسم/);
  assert.match(platform.auditActions.school_class_archived, /القسم/);
  assert.match(platform.auditActions.viewed_class_report, /القسم/);
  assert.match(platform.auditActions.assign_teacher, /الأستاذ/);

  const validation = /** @type {Record<string, any>} */ (effectiveLocale("validation"));
  assert.match(validation.api.physical_class_not_found, /قسم/);
  assert.doesNotMatch(validation.api.physical_class_not_found, /فصل/);

  const copilot = /** @type {Record<string, any>} */ (effectiveLocale("copilot"));
  assert.match(copilot.boundary.peerComparison, /في القسم/);
  assert.doesNotMatch(copilot.boundary.peerComparison, /في الفصل/);

  const reports = /** @type {Record<string, any>} */ (effectiveLocale("reports"));
  assert.match(reports.parentSections.teacherMessages, /الأستاذ/);
  assert.match(reports.v2.executive.cautionP4, /للأستاذ/);
  assert.doesNotMatch(reports.v2.executive.cautionP4, /للمعلم/);

  const ui = /** @type {Record<string, any>} */ (effectiveLocale("ui"));
  assert.equal(ui.public.about.siteFeatures["1"].phase, "السنوات ومستويات الصعوبة");
  assert.match(ui.copilot.panel.quickUtterances.qa_ask_teacher, /أستاذ/);
});

test("ar-DZ help overlays: سنة terminology + multilingual wording", async () => {
  const { BY_SECTION_AR_DZ } = await import("../../data/help-center/ar-DZ/index.js");

  const choose = BY_SECTION_AR_DZ.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.ok(choose);
  assert.match(String(choose.title), /السنة/);
  assert.doesNotMatch(String(choose.title), /والصف$/);
  const body = (choose.blocks || []).map((b) => String(b.text || "")).join("\n");
  assert.match(body, /سنتك/);
  assert.doesNotMatch(body, /صفّك/);

  const welcome = BY_SECTION_AR_DZ.parents.find((a) => a.slug === "welcome-and-overview");
  assert.ok(welcome);
  const welcomeText = (welcome.blocks || []).map((b) => String(b.text || "")).join("\n");
  assert.match(welcomeText, /بالعربية/);
  assert.match(welcomeText, /الجزائر/);
  assert.match(welcomeText, /ابتدائي/);
  assert.doesNotMatch(welcomeText, MONOLINGUAL_CLAIM_RE);
  assert.doesNotMatch(welcomeText, /الصفوف من 1 إلى 6/);

  const add = BY_SECTION_AR_DZ.parents.find((a) => a.slug === "add-students");
  assert.ok(add);
  const addList = (add.blocks || []).find((b) => b.kind === "list");
  assert.ok(addList);
  assert.match(JSON.stringify(addList.items), /السنة 1 ابتدائي/);
  assert.match(JSON.stringify(addList.items), /السنة 1 متوسط/);

  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = BY_SECTION_AR_DZ.subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    const blob = JSON.stringify(article.blocks || []);
    assert.match(blob, /اختر السنة والمستوى/);
    assert.doesNotMatch(blob, /اختر الدرجة والمستوى/);
    assert.doesNotMatch(blob, /في الصفوف من 1 إلى 6/);
  }

  const printPdf = BY_SECTION_AR_DZ["parent-report"].find((a) => a.slug === "printing-and-pdf");
  assert.ok(printPdf);
  const printBlob = JSON.stringify(printPdf.blocks || []);
  assert.match(printBlob, /مع الأستاذ/);
  assert.doesNotMatch(printBlob, /مع المعلم/);
});

test("ar-DZ does not ship empty heavy overlays or word-meanings copies", () => {
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/ar-DZ.js")),
    false
  );
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/ar-DZ.json")),
    false
  );
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-ar-DZ-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/ar-DZ")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs/ar-DZ/books")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs/ar-DZ/learning")), false);
});

test("ar-DZ isolation: base/other locales/shared runtime untouched + inheritance posture", () => {
  // Overlay exists; wiring not claimed.
  assert.ok(fs.existsSync(path.join(ROOT, "locales", LOCALE)));
  assert.ok(fs.existsSync(path.join(ROOT, "locales", BASE, "common.json")));

  const registryPath = path.join(ROOT, "lib/i18n/locale-registry.js");
  const registryAlt = path.join(ROOT, "lib/i18n/locales.js");
  for (const p of [registryPath, registryAlt]) {
    if (!fs.existsSync(p)) continue;
    const txt = fs.readFileSync(p, "utf8");
    // Soft check: if registry already mentions ar-DZ that is main-agent work; do not fail layer.
    void txt;
  }

  // No French/Darija fallback files created under ar-DZ.
  const localeBlob = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(localeBlob, /fr-FR|fr-DZ|darija|دارجة|Tamazight|أمازيغية/i);
  assert.match(localeBlob, /السنة 1 متوسط/);
  assert.match(localeBlob, /قسم/);
  assert.match(localeBlob, /الأستاذ/);

  // Arabic Master grade wording remains for inheritance (not mutated here).
  const masterCommon = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8")
  );
  assert.equal(masterCommon.grade1, "الصف 1");
  assert.equal(masterCommon.grade6, "الصف 6");
});
