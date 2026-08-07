/**
 * Tunisia (ar-TN) sparse country layer checks vs authority chain:
 * ar-TN → ar-001 → en (authority leaves = ar-001).
 * Focused only — no full suite / no build / no other locales.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";
import { deepMergeJson } from "../../lib/i18n/deep-merge.js";

const ROOT = process.cwd();
const LOCALE = "ar-TN";
const AUTHORITY = "ar-001";

/**
 * Effective public-seo after ar-001 ← ar-TN deep-merge (same merge shape as
 * locale-public-seo-content once MAIN registers the client overlay table).
 * @param {...string} segments
 */
function effectivePublicSeo(...segments) {
  const rel = segments.join("/");
  const basePath = path.join(ROOT, "content-packs", AUTHORITY, "public-seo", rel);
  const overlayPath = path.join(ROOT, "content-packs", LOCALE, "public-seo", rel);
  assert.ok(fs.existsSync(basePath), `missing authority public-seo ${rel}`);
  const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
  if (!fs.existsSync(overlayPath)) return base;
  const overlay = JSON.parse(fs.readFileSync(overlayPath, "utf8"));
  return deepMergeJson(base, overlay);
}

/** Academic grade/year markers that must not remain in Tunisia public Practice/SEO. */
const ACADEMIC_SAF_RE =
  /حسب الصف|اختر الصف|الصفوف|للصفوف|والصف |حسب المادة والصف|المادة والصف|للصف |بالصف|متطابقة مع الدرجة|المحتوى والدرجة|حسب الدرجة|اختر درجة/;

/** Hebrew / forbidden UI heuristics for Arabic Master country overlays */
const HEBREW_RE = /[\u0590-\u05FF]/;
const FORBIDDEN_EN_UI_RE =
  /\b(Sign in|Log in|Password|Submit|Cancel|Next|Back|Home|Settings|Grade|Class|Teacher|Parent|Student)\b/;

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
  return [...String(s).matchAll(/\{[^{}]+\}|\{\{[^{}]+\}\}/g)].map((m) => m[0]).sort();
}

/**
 * Collect all string leaves under locales + content-packs for a locale.
 * @param {string} locale
 */
function allLocaleStrings(locale) {
  /** @type {string[]} */
  const strings = [];
  for (const rootName of ["locales", "content-packs"]) {
    const root = path.join(ROOT, rootName, locale);
    for (const rel of listJsonRel(root)) {
      const obj = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
      for (const v of collectStringLeaves(obj).values()) strings.push(v);
    }
  }
  return strings;
}

test("ar-TN locale JSON parse + sparse vs ar-001", () => {
  const countryRoot = path.join(ROOT, "locales", LOCALE);
  const files = listJsonRel(countryRoot);
  assert.ok(files.length > 0, "expected ar-TN locale files");

  /** @type {Array<{ file: string, key: string }>} */
  const orphans = [];
  /** @type {Array<{ file: string, key: string }>} */
  const identical = [];
  /** @type {Array<{ file: string, key: string }>} */
  const placeholderMismatches = [];
  /** @type {Array<{ file: string, key: string }>} */
  const typeMismatches = [];

  for (const rel of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    assert.ok(country && typeof country === "object");
    assert.notEqual(Object.keys(country).length, 0, `empty locale file ${rel}`);
    const basePath = path.join(ROOT, "locales", AUTHORITY, rel);
    assert.ok(fs.existsSync(basePath), `missing authority namespace ${rel}`);
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
          const a = placeholders(value).join(",");
          const b = placeholders(bv).join(",");
          if (a !== b) placeholderMismatches.push({ file: rel, key });
        }
      }
    }
  }

  assert.equal(orphans.length, 0, `orphan keys: ${JSON.stringify(orphans)}`);
  assert.equal(identical.length, 0, `identical overrides: ${JSON.stringify(identical)}`);
  assert.equal(
    placeholderMismatches.length,
    0,
    `placeholder mismatches: ${JSON.stringify(placeholderMismatches)}`
  );
  assert.equal(typeMismatches.length, 0, `type mismatches: ${JSON.stringify(typeMismatches)}`);
});

test("ar-TN grade mapping + school-year / class-group distinction", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/common.json"), "utf8"));
  assert.equal(common.grade1, "السنة الأولى");
  assert.equal(common.grade2, "السنة الثانية");
  assert.equal(common.grade3, "السنة الثالثة");
  assert.equal(common.grade4, "السنة الرابعة");
  assert.equal(common.grade5, "السنة الخامسة");
  assert.equal(common.grade6, "السنة السادسة");
  assert.equal(common.gradeLabel, "السنة {grade}");
  // Not Algeria mapping
  assert.doesNotMatch(common.grade6, /متوسط|ابتدائي/);
  assert.doesNotMatch(common.grade1, /السنة 1/);

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/learning.json"), "utf8"));
  assert.equal(learning.master.grades.g1, "السنة الأولى");
  assert.equal(learning.master.gradeFallback, "السنة");
  assert.equal(learning.master.currentGrade, "السنة الحالية");
  assert.notEqual(learning.master.gradeFallback, "مستوى");
  assert.notEqual(learning.master.gradeFallback, "صف");
  assert.notEqual(learning.master.gradeFallback, "درجة");
  assert.match(learning.master.gradeRequired, /سنتك الدراسية/);
  assert.doesNotMatch(learning.master.gradeRequired, /درجتك/);
  assert.match(learning.math.howToLearnSteps.step1, /^اختر السنة/);
  assert.doesNotMatch(learning.math.howToLearnSteps.step1, /الدرجة/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/school.json"), "utf8"));
  assert.equal(school.portal.colGrade, "السنة");
  assert.equal(school.portal.classLabel, "قسم");
  assert.equal(school.portal.choosePhysicalClass, "اختر القسم");
  assert.equal(school.portal.colClass, "قسم");
  assert.match(school.portal.classesSubtitle, /السنة/);
  assert.match(school.portal.classesSubtitle, /القسم/);
  assert.doesNotMatch(school.portal.classesSubtitle, /اختر الصف والفصل/);
  assert.notEqual(school.portal.colGrade, school.portal.colClass);

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/teacher.json"), "utf8"));
  assert.equal(teacher.fallback.classSuffix, "القسم {label}");
  assert.match(teacher.dashboard.createClassLabel, /القسم/);

  const demo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-TN/demo/ui.json"), "utf8"));
  assert.equal(demo.bar.gradeLabel, "السنة");
  assert.equal(demo.bar.changeGrade, "تغيير السنة");
  assert.equal(demo.grades.g3, "السنة الثالثة");

  const gradePack = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs/ar-TN/global-burn-down/lib__teacher-portal__teacher-class-grade.json"),
      "utf8"
    )
  );
  assert.equal(gradePack.copy.grade_1, "السنة الأولى");
  assert.equal(gradePack.copy.grade_6, "السنة السادسة");
});

test("ar-TN grade bands + education-stage + multilingual-country wording", () => {
  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-TN/rewards/ui.json"), "utf8")
  );
  assert.equal(rewards.gradeBands.g12, "السنة 1–2");
  assert.equal(rewards.gradeBands.g34, "السنة 3–4");
  assert.equal(rewards.gradeBands.g56, "السنة 5–6");
  // Product bands stay within primary years 1–6 (no moyenne remap)
  assert.doesNotMatch(JSON.stringify(rewards.gradeBands), /متوسط|ابتدائي/);

  for (const rel of [
    "content-packs/ar-TN/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json",
    "content-packs/ar-TN/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json",
    "content-packs/ar-TN/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json",
  ]) {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
    assert.match(JSON.stringify(j.copy), /السنة 1–2/);
    assert.doesNotMatch(JSON.stringify(j.copy), /الصف 1/);
  }

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/seo.json"), "utf8"));
  assert.match(seo.homeTitle, /النسخة العربية/);
  assert.match(seo.homeTitle, /تونس/);
  assert.match(seo.homeTitle, /التعليم الابتدائي/);
  assert.match(seo.homeDescription, /بالعربية/);
  assert.match(seo.learningDescription, /النسخة العربية لتونس/);
  // Must not claim Arabic is Tunisia's only language
  assert.doesNotMatch(seo.homeTitle, /اللغة الوحيدة|فقط بالعربية|الحصرية/);
  assert.doesNotMatch(seo.homeDescription, /اللغة الوحيدة|اللغة الرسمية الوحيدة/);
  // Stage wording must not overclaim full 9-year التعليم الأساسي as product scope
  assert.doesNotMatch(seo.homeTitle, /التعليم الأساسي بالكامل|كل سنوات التعليم الأساسي/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/ui.json"), "utf8"));
  assert.match(ui.public.about.intro1, /المرحلة الابتدائية/);

  const publicSeo = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs/ar-TN/global-burn-down/lib__site__public-page-seo.json"),
      "utf8"
    )
  );
  assert.match(publicSeo.copy.leo_kids_practice_for_elementary_learners, /النسخة العربية/);
  assert.match(publicSeo.copy.leo_kids_practice_for_elementary_learners, /تونس/);
  assert.match(
    publicSeo.copy.digital_practice_for_elementary_learners_in_math_geometry_english_and_sc,
    /بالعربية/
  );
});

test("ar-TN content-packs sparse contract vs ar-001", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", AUTHORITY);
  const baseExists = (rel) => fs.existsSync(path.join(baseRoot, rel));

  /** @type {string[]} */
  const extraFiles = [];
  /** @type {Array<{ rel: string, key: string }>} */
  const orphanKeys = [];
  /** @type {Array<{ rel: string, key: string }>} */
  const identicalOverrides = [];
  /** @type {Array<{ rel: string }>} */
  const nearFullCopies = [];

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    assert.ok(country && typeof country === "object");
    assert.notEqual(Object.keys(country).length, 0, `empty override file ${rel}`);

    if (isBurnDownIndexPath(rel)) {
      const domain = rel.split("/")[0];
      const baseIndexRel = `${domain}/burn-down-index.json`;
      if (!baseExists(baseIndexRel)) {
        extraFiles.push(rel);
        continue;
      }
      const baseIndex = JSON.parse(fs.readFileSync(path.join(baseRoot, baseIndexRel), "utf8"));
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
    const countryLeaves = collectStringLeaves(country);
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

    const assessment = assessNearFullCopy(
      /** @type {Map<string, string>} */ (countryLeaves),
      /** @type {Map<string, string>} */ (baseLeaves)
    );
    if (assessment.isNearFullCopy) nearFullCopies.push({ rel });
  }

  assert.equal(extraFiles.length, 0, `extra/orphan files: ${JSON.stringify(extraFiles)}`);
  assert.equal(orphanKeys.length, 0, `orphan keys: ${JSON.stringify(orphanKeys)}`);
  assert.equal(
    identicalOverrides.length,
    0,
    `identical overrides: ${JSON.stringify(identicalOverrides)}`
  );
  assert.equal(nearFullCopies.length, 0, `near-full copies: ${JSON.stringify(nearFullCopies)}`);
});

test("ar-TN terminology closure: السنة / قسم / معلم + no Algeria/Morocco leakage patterns", () => {
  const forbiddenGradeOrClass = /(?:^|[^\u0600-\u06FF])(?:الصف|صفوف|الفصل|فصل)(?:$|[^\u0600-\u06FF])/;
  const forbiddenUstadh = /أستاذ|أساتذة/;
  const algeriaPattern = /السنة\s*[1-6]\s*ابتدائي|السنة\s*1\s*متوسط|سنة\s*متوسط/;

  /** @type {string[]} */
  const bad = [];
  for (const rootName of ["locales", "content-packs"]) {
    for (const rel of listJsonRel(path.join(ROOT, rootName, LOCALE))) {
      const leaves = collectStringLeaves(
        JSON.parse(fs.readFileSync(path.join(ROOT, rootName, LOCALE, rel), "utf8"))
      );
      for (const [key, value] of leaves) {
        if (forbiddenGradeOrClass.test(value)) bad.push(`${rootName}/${rel}:${key}=${value}`);
        if (forbiddenUstadh.test(value)) bad.push(`ustadh ${rootName}/${rel}:${key}=${value}`);
        if (algeriaPattern.test(value)) bad.push(`dz-leak ${rootName}/${rel}:${key}=${value}`);
      }
    }
  }
  assert.equal(bad.length, 0, `terminology defects in overlays: ${JSON.stringify(bad.slice(0, 15))}`);

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/learning.json"), "utf8"));
  assert.equal(learning.master.gradeFallback, "السنة");
  const slashParts = learning.master.notEnoughQuestions.split("/");
  assert.equal(slashParts.length, 3, "expected topic/year/difficulty slash triplet");
  assert.equal(slashParts[1], "السنة");
  assert.match(slashParts[2], /^المستو[ىي]/);
  assert.equal(learning.master.notEnoughQuestions.includes("/صف/"), false);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/school.json"), "utf8"));
  assert.equal(school.portal.colGrade, "السنة");
  assert.equal(school.portal.classLabel, "قسم");
  assert.match(school.portal.quickClassesDesc, /المعلم/);
  assert.doesNotMatch(school.portal.quickClassesDesc, /أستاذ|مدرّس/);
  assert.equal(school.communication.audienceGradeTeachers, "معلمو السنة");

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/teacher.json"), "utf8"));
  assert.equal(teacher.classGuidanceSeverityTier.critical_class, "يحتاج القسم إلى اهتمام فوري");
  assert.equal(teacher.actionTypes.class_reteach, "إعادة تدريس القسم بأكمله");
  assert.doesNotMatch(JSON.stringify(teacher), /الفصل/);

  const gradeAware = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/ar-TN/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
      ),
      "utf8"
    )
  );
  const gaBlob = JSON.stringify(gradeAware.copy);
  assert.match(gaBlob, /للسنوات 1-2/);
  assert.doesNotMatch(gaBlob, /صفوف|الصف /);
  assert.match(
    gradeAware.copy.grade_5_6_data_backed_conclusions_vs_speculation,
    /السنة الخامسة إلى السادسة/
  );
  assert.ok(Object.keys(gradeAware.copy).length >= 30, "expected dense grade-aware صف→سنة overrides");

  const parentReport = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs/ar-TN/reports/burn-down/pages__learning__parent-report.json"),
      "utf8"
    )
  );
  assert.equal(parentReport.copy.grade, "السنة");
});

test("ar-TN audit closure: school/platform/validation/copilot/help semantic terms", async () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/school.json"), "utf8"));
  assert.equal(school.portal.statClasses, "أقسام نشطة");
  assert.equal(school.portal.quickClasses, "إدارة الأقسام");
  assert.equal(school.portal.emptyClasses, "لا توجد أقسام مسجلة للمدرسة.");
  assert.equal(school.portal.colClasses, "أقسام");
  for (const key of ["statClasses", "quickClasses", "emptyClasses", "colClasses"]) {
    assert.doesNotMatch(school.portal[key], /فصول|الفصل/);
    assert.match(school.portal[key], /قسم|أقسام/);
  }

  const platform = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/platform.json"), "utf8"));
  assert.equal(platform.auditActions.school_class_viewed, "تم عرض تقرير القسم");
  assert.equal(platform.auditActions.school_class_teacher_reassigned, "تم إعادة تعيين معلم القسم");
  assert.equal(platform.auditActions.school_class_archived, "تمت أرشفة القسم");
  assert.equal(platform.auditActions.viewed_class_report, "تم عرض تقرير القسم");
  for (const id of [
    "school_class_viewed",
    "school_class_teacher_reassigned",
    "school_class_archived",
    "viewed_class_report",
  ]) {
    assert.ok(Object.prototype.hasOwnProperty.call(platform.auditActions, id));
    assert.doesNotMatch(platform.auditActions[id], /الفصل|فصول/);
    assert.match(platform.auditActions[id], /القسم/);
  }

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales/ar-TN/validation.json"), "utf8")
  );
  assert.match(validation.api.physical_class_not_found, /قسم/);
  assert.match(validation.api.physical_class_not_found, /أقسام المعلم/);
  assert.doesNotMatch(validation.api.physical_class_not_found, /فصل|فصول/);

  const copilot = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-TN/copilot.json"), "utf8"));
  assert.match(copilot.boundary.peerComparison, /في القسم/);
  assert.doesNotMatch(copilot.boundary.peerComparison, /في الفصل/);
  const intent = copilot.answers["utils_parent-copilot_intent-answer-composers"];
  assert.match(intent.according_to_the_report_there_is_still_insufficient_evidence_for, /فوق السنة المذكورة/);
  assert.doesNotMatch(intent.according_to_the_report_there_is_still_insufficient_evidence_for, /درجة/);
  assert.match(intent.it_is_worth_gathering_more_practice_before_concluding_on_above_c, /السنة الدراسية/);
  assert.doesNotMatch(intent.it_is_worth_gathering_more_practice_before_concluding_on_above_c, /مستوى الصف|الصف الدراسي/);

  const { BY_SECTION_AR_TN } = await import("../../data/help-center/ar-TN/index.js");
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = BY_SECTION_AR_TN.subjects.find((a) => a.slug === slug);
    assert.ok(article, `missing subject help ${slug}`);
    const practice = (article.blocks || [])
      .filter((b) => b.kind === "paragraph")
      .map((b) => String(b.text || ""))
      .join("\n");
    assert.match(practice, /اختر السنة ومستوى الصعوبة/);
    assert.doesNotMatch(practice, /اختر الدرجة والمستوى/);
    assert.match(practice, /السنة/);
    assert.match(practice, /مستوى الصعوبة/);
  }
});

test("ar-TN help overlays: grade terminology + guardian + multilingual wording", async () => {
  const { BY_SECTION_AR_TN } = await import("../../data/help-center/ar-TN/index.js");

  const choose = BY_SECTION_AR_TN.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.ok(choose);
  assert.match(String(choose.title), /السنة/);
  assert.doesNotMatch(String(choose.title), /والصف$/);
  const body = (choose.blocks || []).map((b) => String(b.text || "")).join("\n");
  assert.match(body, /سنتك الدراسية/);
  assert.doesNotMatch(body, /صفّك/);

  const welcome = BY_SECTION_AR_TN.parents.find((a) => a.slug === "welcome-and-overview");
  assert.ok(welcome);
  const welcomeText = (welcome.blocks || []).map((b) => String(b.text || "")).join("\n");
  assert.match(welcomeText, /السنة الأولى إلى السادسة|المرحلة الابتدائية/);
  assert.match(welcomeText, /النسخة العربية لتونس/);
  assert.match(welcomeText, /أولياء الأمور/);
  assert.doesNotMatch(welcomeText, /اللغة الوحيدة/);
  // Product covers primary cycle years 1–6, not preparatory years 7–9
  assert.doesNotMatch(welcomeText, /السنة السابعة|السنة التاسعة|المرحلة الإعدادية/);

  const add = BY_SECTION_AR_TN.parents.find((a) => a.slug === "add-students");
  assert.ok(add);
  assert.match(String(add.summary), /السنة/);
  const list = (add.blocks || []).find((b) => b.kind === "list");
  assert.ok(list);
  assert.match(JSON.stringify(list.items), /السنة الأولى/);
  assert.doesNotMatch(JSON.stringify(list.items), /الصف الأول/);
});

test("ar-TN no Hebrew / no forbidden English UI in overlay strings", () => {
  const strings = allLocaleStrings(LOCALE);
  assert.ok(strings.length > 0);
  const hebrewHits = strings.filter((s) => HEBREW_RE.test(s));
  assert.equal(hebrewHits.length, 0, `Hebrew leakage: ${JSON.stringify(hebrewHits.slice(0, 5))}`);

  const uiHits = strings.filter((s) => FORBIDDEN_EN_UI_RE.test(s) && !/Grade_\d/.test(s));
  assert.equal(uiHits.length, 0, `Forbidden English UI: ${JSON.stringify(uiHits.slice(0, 5))}`);
});

test("ar-TN does not ship English-learning word-meanings or science full copies", () => {
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/ar-TN.js")),
    false
  );
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/ar-TN.json")),
    false
  );
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-ar-TN-overlay.js")), false);
});

test("ar-TN other locales / shared runtime unmodified (scoped check)", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "locales/ar-001/common.json")));
  // Avoid substring false positives (e.g. مصر inside مصرح)
  const otherCountryRe =
    /الجزائر|المغرب|السعودية|(?:^|[^\u0600-\u06FF])مصر(?:[^\u0600-\u06FF]|$)|Algérie|Maroc|Tunisie|Égypte|Saudi/i;
  for (const rel of listJsonRel(path.join(ROOT, "locales", LOCALE))) {
    const blob = fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8");
    assert.doesNotMatch(blob, /\b(bonjour|merci|darija|الدارجة)\b/i);
    assert.doesNotMatch(blob, otherCountryRe);
  }
  for (const rel of listJsonRel(path.join(ROOT, "content-packs", LOCALE))) {
    const blob = fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8");
    assert.doesNotMatch(blob, otherCountryRe);
  }
});

test("ar-TN Arabic Master inheritance posture (no full unnecessary copies)", () => {
  const localeFiles = listJsonRel(path.join(ROOT, "locales", LOCALE));
  const authFiles = listJsonRel(path.join(ROOT, "locales", AUTHORITY));
  assert.ok(localeFiles.length < authFiles.length, "locale overlay must be sparse vs ar-001");
  assert.ok(localeFiles.length <= 12, `unexpectedly dense locale overlay: ${localeFiles.length}`);

  const packFiles = listJsonRel(path.join(ROOT, "content-packs", LOCALE));
  const authPackFiles = listJsonRel(path.join(ROOT, "content-packs", AUTHORITY));
  assert.ok(packFiles.length < authPackFiles.length / 5, "content-pack overlay must stay sparse");
});

test("ar-TN effective public Practice H1 uses السنة (post-wiring closure)", () => {
  const overlay = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-TN/public-seo/practice/math.json"), "utf8")
  );
  assert.equal(overlay.h1, "ممارسة الرياضيات حسب السنة والموضوع");
  assert.doesNotMatch(overlay.h1, /الصف/);

  const effective = effectivePublicSeo("practice", "math.json");
  assert.equal(effective.h1, "ممارسة الرياضيات حسب السنة والموضوع");
  assert.match(String(effective.h1), /السنة/);
  assert.doesNotMatch(String(effective.h1), ACADEMIC_SAF_RE);
  assert.equal(/الصف/.test(String(effective.h1)), false);

  // Sibling practice hubs/cards that previously inherited academic صف
  for (const slug of ["geometry", "english", "hub"]) {
    const page = effectivePublicSeo("practice", `${slug}.json`);
    assert.match(String(page.h1), /السنة/);
    assert.doesNotMatch(String(page.h1), ACADEMIC_SAF_RE);
  }

  const hubCards = effectivePublicSeo("practice", "hub-cards.json");
  const hubBlob = JSON.stringify(hubCards);
  assert.match(hubBlob, /حسب السنة/);
  assert.doesNotMatch(hubBlob, ACADEMIC_SAF_RE);

  const worksheets = effectivePublicSeo("practice", "worksheets.json");
  assert.doesNotMatch(JSON.stringify(worksheets), ACADEMIC_SAF_RE);
  assert.match(JSON.stringify(worksheets), /حسب السنة|المادة والسنة/);
});

test("ar-TN effective public-seo Practice/Guides/Schools: academic صف/درجة = 0", () => {
  const surfaces = [
    "practice/math.json",
    "practice/geometry.json",
    "practice/english.json",
    "practice/hub.json",
    "practice/hub-cards.json",
    "practice/games.json",
    "practice/science.json",
    "practice/reading.json",
    "practice/no-print.json",
    "practice/parent-reports.json",
    "practice/worksheets.json",
    "guides/math-practice-at-home.json",
    "guides/math-games-for-kids.json",
    "guides/no-print-worksheets.json",
    "guides/reading-practice-at-home.json",
    "guides/english-vocabulary-practice.json",
    "guides/hub-cards.json",
    "marketing/schools.json",
    "legal/unified.json",
  ];

  /** @type {string[]} */
  const bad = [];
  for (const rel of surfaces) {
    const page = effectivePublicSeo(...rel.split("/"));
    const blob = JSON.stringify(page);
    if (ACADEMIC_SAF_RE.test(blob)) bad.push(rel);
    // Physical class-group must not stay as فصل/صفوف in schools marketing
    if (rel === "marketing/schools.json") {
      assert.match(blob, /أقسام/);
      assert.doesNotMatch(blob, /صفوف ومعلّمون|إدارة الصفوف|مدارس · صفوف/);
    }
  }
  assert.equal(bad.length, 0, `academic صف/درجة remaining: ${JSON.stringify(bad)}`);

  // Score sense of درجة may remain in parent-progress FAQ (no Tunisia overlay required)
  const progress = effectivePublicSeo("guides", "parent-progress-tracking.json");
  assert.match(String(progress?.faq?.[0]?.q || ""), /الدرجة المنخفضة/);
});

test("ar-TN learning curriculum grade labels use السنة", () => {
  const pack = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/ar-TN/learning/burn-down/components__parent__ParentCurriculumContent.json"
      ),
      "utf8"
    )
  );
  assert.equal(pack.copy.topics_by_grade, "المواضيع حسب السنة");
  assert.equal(pack.copy.six_grades, "ست سنوات");
  assert.equal(pack.copy.per_grade_regular_advanced, "لكل سنة: عادي، متقدم");
  assert.doesNotMatch(JSON.stringify(pack.copy), /صف/);
});
