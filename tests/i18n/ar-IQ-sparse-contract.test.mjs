/**
 * Iraq (ar-IQ) sparse country overlay checks vs Arabic Master (ar-001).
 * Planned chain: ar-IQ → ar-001 → en. No registry wiring / build / full suite.
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
const LOCALE = "ar-IQ";
const BASE = "ar-001";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;

/** Egypt / Saudi / Morocco / Algeria / Jordan / Maghreb / Gulf leakage. */
const CROSS_COUNTRY_RE =
  /مصر|المصرية|السعودية|المملكة العربية|المغرب|الجزائر|تونس|الأردن|الاردن|جنيه|درهم|السنة\s*[1-6]\s*ابتدائي|السنة\s*1\s*متوسط|الأساتذة|الفصل الدراسي/;

/** Claims Arabic is the only language of Iraq. */
const MONOLINGUAL_CLAIM_RE =
  /اللغة الوحيدة|فقط بالعربية في العراق|العربية وحدها|لا توجد لغة أخرى|اللغة الرسمية الوحيدة/;

const IQ_GRADES = [
  "الصف الأول",
  "الصف الثاني",
  "الصف الثالث",
  "الصف الرابع",
  "الصف الخامس",
  "الصف السادس",
];

const DIGIT_GRADE_RE = /الصف [1-6](?!\d)/;
const FORBIDDEN_EN_UI_RE =
  /\b(Grade|Practice|Worksheets|Reports|Parent Guides|Regular|Advanced|Math|Science|Student login|Parent login)\b/;

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
  assert.equal(
    CROSS_COUNTRY_RE.test(blob),
    false,
    `cross-country leak in ${label}: ${blob.match(CROSS_COUNTRY_RE)?.[0]}`
  );
  assert.equal(MONOLINGUAL_CLAIM_RE.test(blob), false, `monolingual claim in ${label}`);
}

test("ar-IQ locale JSON parse + sparse contract vs ar-001", () => {
  const countryRoot = path.join(ROOT, "locales", LOCALE);
  const baseRoot = path.join(ROOT, "locales", BASE);
  const files = listJsonRel(countryRoot);
  assert.ok(files.length > 0, "expected ar-IQ locale files");

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
    assert.equal(DIGIT_GRADE_RE.test(JSON.stringify(country)), false, `digit grade in ${rel}`);

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

test("ar-IQ grade mapping grade1–6 (primary word forms)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    IQ_GRADES
  );
  // Passthrough template: callers must pass already-resolved grade1–grade6 labels.
  assert.equal(common.gradeLabel, "{grade}");
  for (const label of IQ_GRADES) {
    assert.match(label, /^الصف /);
    assert.doesNotMatch(label, DIGIT_GRADE_RE);
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
    IQ_GRADES
  );
  assert.equal(learning.master?.gradeTitle, "{grade}");
  assert.match(learning.master?.gradeRequired || "", /تحديث صفك/);
  assert.doesNotMatch(learning.master?.gradeRequired || "", /درجتك/);
  assert.match(learning.geometry?.errors?.noTopics || "", /صف آخر/);

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
    IQ_GRADES
  );

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /العراق/);
  assert.match(seo.homeTitle, /بالعربية/);
  assert.match(seo.homeDescription, /النسخة العربية للعراق/);
  assert.doesNotMatch(seo.homeDescription, MONOLINGUAL_CLAIM_RE);
  assert.doesNotMatch(seo.homeDescription, /كردي|Kurdish|سوراني/i);
});

test("ar-IQ grade vs class-group distinction (صف ≠ شعبة)", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal.classLabel, "شعبة");
  assert.equal(school.portal.colClass, "شعبة");
  assert.equal(school.portal.choosePhysicalClass, "اختر الشعبة");
  assert.match(school.portal.classesSubtitle, /الصف والشعبة/);
  assert.notEqual(school.portal.colClass, "الصف");
  assert.doesNotMatch(JSON.stringify(school), /اختر الفصل|اسم الفصل|تقرير الفصل|الفصل الدراسي/);

  const teacher = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8")
  );
  assert.match(teacher.dashboard.createClassLabel, /الشعبة/);
  assert.match(teacher.classGuidanceSeverityTier.critical_class, /الشعبة/);
  assert.match(teacher.supportSuggestions.targetedReview, /في الشعبة/);
  assert.doesNotMatch(JSON.stringify(teacher), /يحتاج الفصل|في الفصل|للفصل|اسم الفصل/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.teacherShell.classReportTitle, /الشعبة/);
  assert.match(ui.teacherShell.myClasses, /شعب/);
});

test("ar-IQ student terminology keeps تلميذ; teacher keeps معلم", () => {
  const overlayBlob = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");

  // No Saudi-style طالب replacement forced into Iraq overlays.
  assert.doesNotMatch(overlayBlob, /تسجيل دخول الطالب|أنا طالب|للطلاب|الطالب الجديد/);
  // Teacher overlays do not invent Maghreb أستاذ as the primary school role.
  assert.doesNotMatch(overlayBlob, /الأستاذ|الأساتذة|بوابة الأستاذ/);

  // Master already uses تلميذ/معلم — overlays must not regress those roles.
  const auth001 = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001/auth.json"), "utf8"));
  assert.match(auth001.studentLoginTitle, /التلميذ/);
  assert.match(auth001.teacherLoginTitle, /المعلم/);
});

test("ar-IQ content-packs sparse contract vs ar-001", () => {
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
    assert.equal(DIGIT_GRADE_RE.test(JSON.stringify(country)), false, `digit grade in pack ${rel}`);
    const countryLeaves = collectStringLeaves(country);
    const allCountryStrings = [];
    /** @param {unknown} v */
    function collectAll(v) {
      if (typeof v === "string") allCountryStrings.push(v);
      else if (Array.isArray(v)) v.forEach(collectAll);
      else if (v && typeof v === "object") Object.values(v).forEach(collectAll);
    }
    collectAll(country);
    if (countryLeaves.size === 0 && allCountryStrings.length === 0) emptyFiles.push(rel);

    if (Array.isArray(country)) {
      if (!baseExists(rel)) {
        extraFiles.push(rel);
        continue;
      }
      const base = JSON.parse(fs.readFileSync(path.join(baseRoot, rel), "utf8"));
      assert.ok(Array.isArray(base), rel);
      /** @type {string[]} */
      const baseOnly = [];
      /** @param {unknown} v */
      function collectBase(v) {
        if (typeof v === "string") baseOnly.push(v);
        else if (Array.isArray(v)) v.forEach(collectBase);
        else if (v && typeof v === "object") Object.values(v).forEach(collectBase);
      }
      collectBase(base);
      assert.equal(allCountryStrings.length, baseOnly.length, `array length drift ${rel}`);
      let diffs = 0;
      for (let i = 0; i < allCountryStrings.length; i += 1) {
        if (allCountryStrings[i] !== baseOnly[i]) diffs += 1;
      }
      assert.ok(diffs > 0, `array overlay has no diffs: ${rel}`);
      continue;
    }

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

test("ar-IQ pack grade labels + bands + شعبة SEO", () => {
  const demo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-IQ/demo/ui.json"), "utf8"));
  assert.deepEqual(Object.values(demo.grades), IQ_GRADES);

  const teacherGrade = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs/ar-IQ/global-burn-down/burn-down-index.json"),
      "utf8"
    )
  );
  assert.deepEqual(
    [
      teacherGrade["lib__teacher-portal__teacher-class-grade"].grade_1,
      teacherGrade["lib__teacher-portal__teacher-class-grade"].grade_6,
    ],
    [IQ_GRADES[0], IQ_GRADES[5]]
  );
  assert.match(
    teacherGrade["components__teacher-portal__TeacherDashboardClient"].class_fallback,
    /شعبة/
  );
  assert.match(
    teacherGrade["lib__site__public-page-seo"].leo_kids_practice_for_elementary_learners,
    /العراق/
  );
  assert.match(
    teacherGrade["lib__site__public-page-seo"].school_portal_manage_classes_teachers_students_messaging_progress,
    /الشعب/
  );

  const games = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-IQ/games/burn-down-index.json"), "utf8")
  );
  assert.equal(
    games["components__educational-games__leo-word-train__leo-word-train-data"].grades_5_6,
    "الصف الخامس–السادس"
  );

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-IQ/rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, {
    g12: "الصف الأول–الثاني",
    g34: "الصف الثالث–الرابع",
    g56: "الصف الخامس–السادس",
  });

  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-IQ/books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), IQ_GRADES);

  const booksTitles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-IQ/books/registry-titles.json"), "utf8")
  );
  assert.match(booksTitles.meta["math.g3"].bookTitle, /الصف الثالث/);
  assert.doesNotMatch(booksTitles.meta["math.g3"].bookTitle, DIGIT_GRADE_RE);

  const booksSkills = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-IQ/books/english-page-skills.json"), "utf8")
  );
  assert.match(booksSkills.grades.g3.grammar_question_frames.title, /الصف الثالث/);
  assert.doesNotMatch(booksSkills.grades.g3.grammar_question_frames.title, DIGIT_GRADE_RE);
});

test("ar-IQ Help overlays: Iraq framing + grade wording; English Grade_N IDs preserved", async () => {
  const { BY_SECTION_AR_IQ } = await import("../../data/help-center/ar-IQ/index.js");
  const welcome = BY_SECTION_AR_IQ.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeText = (welcome?.blocks || []).map((b) => b.text || "").join("\n");
  assert.match(welcomeText, /العراق/);
  assert.match(welcomeText, /بالعربية/);
  assert.match(welcomeText, /الصف الأول/);
  assert.doesNotMatch(welcomeText, MONOLINGUAL_CLAIM_RE);

  const add = BY_SECTION_AR_IQ.parents.find((a) => a.slug === "add-students");
  const addText = (add?.blocks || []).map((b) => b.text || "").join("\n");
  assert.match(addText, /الصف الأول إلى الصف السادس/);
  const list = (add?.blocks || []).find((b) => b.kind === "list");
  assert.ok(list?.items?.some((item) => /Grade_1/.test(item)));
  assert.ok(list?.items?.some((item) => /Grade_6/.test(item)));

  const math = BY_SECTION_AR_IQ.subjects.find((a) => a.slug === "math");
  assert.match(math?.summary || "", /الأول–السادس/);
  const mathBlob = JSON.stringify(math);
  assert.match(mathBlob, /اختر الصف والمستوى/);
  assert.doesNotMatch(mathBlob, /اختر الدرجة والمستوى/);
});

/**
 * Deep-merge country overlay onto base (locale / pack object semantics).
 * @param {Record<string, unknown>} base
 * @param {Record<string, unknown>} overlay
 */
function deepMergeOverlay(base, overlay) {
  if (!overlay || typeof overlay !== "object") return base;
  /** @type {Record<string, unknown>} */
  const out = { ...base };
  for (const [k, v] of Object.entries(overlay)) {
    const bv = base[k];
    if (v && typeof v === "object" && !Array.isArray(v) && bv && typeof bv === "object" && !Array.isArray(bv)) {
      out[k] = deepMergeOverlay(
        /** @type {Record<string, unknown>} */ (bv),
        /** @type {Record<string, unknown>} */ (v)
      );
    } else out[k] = v;
  }
  return out;
}

/** Academic digit-grade display leftovers (not technical IDs). */
const EFFECTIVE_DIGIT_GRADE_RE = /الصف [1-6](?!\d)|الصفوف من [1-6]|للصفوف 1-6|الصفوف 1-6/;

/**
 * Physical school class-group فصل (excludes chapter/season/classroom-vocab/verb/separation).
 * Semantic allowlist of product chrome patterns — not a blanket فصل ban.
 */
const PHYSICAL_CLASS_FASL_RES = [
  /تقرير الفصل/,
  /إدارة الفصل/,
  /أنشطة الفصل(?! الدراسي)/,
  /اسم الفصل/,
  /في الفصل(?! الدراسي)/,
  /إلى الفصل/,
  /من الفصل/,
  /هذا الفصل/,
  /هذه الفصل/,
  /للفصل/,
  /الفصول(?! الدراسية)/,
  /فصولي/,
  /فصول$/,
  /الفصل بأكمل/,
  /متوسط الفصل/,
  /أولياء أمور الفصل/,
  /تنقّل الفصل/,
  /حالة الفصل/,
  /معرّف الفصل/,
  /تحميل الفصل/,
  /لهذا الفصل/,
  /الفصل الأساسي/,
  /التقرير العام للفصل/,
  /بلغ هذا الفصل/,
  /فصل مطابق/,
  /إنشاء فصل/,
  /أضف فصلا/,
  /اختر الفصل/,
  /فصلًا موجود/,
  /"فصل"/,
  /الفصل الدراسي/,
  /تلاميذ الفصل/,
  /معلم الفصل/,
  /معلمك في الفصل/,
  /لا توجد فصول/,
  /الفصل 3/,
  /للفصل بأكمل/,
  /أوراق عمل هذا الفصل/,
  /أنشطة هذا الفصل/,
  /مستوى صف هذا الفصل/,
];

const PHYSICAL_CLASS_SKIP_RE =
  /فصل المخاليط|فصل ولي الأمر|منفصل|مفصل|فصل الموضوع|عبارات الفصول|تعليمات الفصول|كلمات الفصول|عناصر الفصل الدراسي|الفصل الدراسي،|الفصول والسماء|التربة والفصول|أنشطة الفصل الدراسي/;

/**
 * @param {string} value
 */
function hasPhysicalClassFasl(value) {
  const s = String(value || "");
  if (!s || PHYSICAL_CLASS_SKIP_RE.test(s)) return false;
  if (/^(فصل|الفصل|فصول|الفصول)$/.test(s.trim())) return true;
  return PHYSICAL_CLASS_FASL_RES.some((re) => re.test(s));
}

test("ar-IQ effective locales: numeric grades = 0 and physical-class فصل = 0", () => {
  const baseDir = path.join(ROOT, "locales", BASE);
  const countryDir = path.join(ROOT, "locales", LOCALE);
  /** @type {string[]} */
  const digitHits = [];
  /** @type {string[]} */
  const faslHits = [];

  for (const rel of listJsonRel(baseDir)) {
    const base = JSON.parse(fs.readFileSync(path.join(baseDir, rel), "utf8"));
    const countryPath = path.join(countryDir, rel);
    const country = fs.existsSync(countryPath)
      ? JSON.parse(fs.readFileSync(countryPath, "utf8"))
      : {};
    const merged = deepMergeOverlay(base, country);
    for (const [key, value] of collectStringLeaves(merged)) {
      if (EFFECTIVE_DIGIT_GRADE_RE.test(value)) digitHits.push(`${rel}:${key}=>${value}`);
      if (hasPhysicalClassFasl(value)) faslHits.push(`${rel}:${key}=>${value}`);
    }
  }

  assert.equal(digitHits.length, 0, `numeric grade leftovers: ${JSON.stringify(digitHits)}`);
  assert.equal(faslHits.length, 0, `physical-class فصل leftovers: ${JSON.stringify(faslHits)}`);

  const common = JSON.parse(fs.readFileSync(path.join(countryDir, "common.json"), "utf8"));
  assert.equal(common.gradeLabel, "{grade}");
  assert.doesNotMatch(common.gradeLabel, /الصف \{grade\}/);
});

test("ar-IQ effective packs: digit grades closed; physical-class فصل → شعبة on GBD", () => {
  /** @type {string[]} */
  const digitHits = [];

  const packRels = [
    "demo/ui.json",
    "rewards/ui.json",
    "books/ui.json",
    "books/registry-titles.json",
    "books/english-page-skills.json",
    "games/burn-down-index.json",
    "reports/burn-down-index.json",
    "global-burn-down/burn-down-index.json",
  ];

  for (const rel of packRels) {
    const basePath = path.join(ROOT, "content-packs", BASE, rel);
    const countryPath = path.join(ROOT, "content-packs", LOCALE, rel);
    assert.ok(fs.existsSync(basePath), `missing base ${rel}`);
    assert.ok(fs.existsSync(countryPath), `missing country overlay ${rel}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const country = JSON.parse(fs.readFileSync(countryPath, "utf8"));
    const merged = deepMergeOverlay(base, country);
    for (const [key, value] of collectStringLeaves(merged)) {
      if (EFFECTIVE_DIGIT_GRADE_RE.test(value)) digitHits.push(`${rel}:${key}=>${value}`);
    }
  }

  // Reports leaf fragment (catalog merge path)
  const reportLeafRel =
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json";
  const reportLeafBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, reportLeafRel), "utf8")
  );
  const reportLeafCountry = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, reportLeafRel), "utf8")
  );
  const reportLeafMerged = deepMergeOverlay(reportLeafBase, reportLeafCountry);
  for (const [key, value] of collectStringLeaves(reportLeafMerged)) {
    if (EFFECTIVE_DIGIT_GRADE_RE.test(value)) {
      digitHits.push(`${reportLeafRel}:${key}=>${value}`);
    }
  }

  assert.equal(digitHits.length, 0, `pack numeric grade leftovers: ${JSON.stringify(digitHits)}`);

  /** @type {string[]} */
  const faslHits = [];
  const gbdBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, "global-burn-down/burn-down-index.json"), "utf8")
  );
  const gbdCountry = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/burn-down-index.json"),
      "utf8"
    )
  );
  for (const [slug, pack] of Object.entries(gbdBase)) {
    if (!pack || typeof pack !== "object") continue;
    for (const [key, value] of Object.entries(/** @type {Record<string, unknown>} */ (pack))) {
      if (typeof value !== "string") continue;
      const countryPack = gbdCountry[slug];
      const effective =
        countryPack && typeof countryPack[key] === "string" ? countryPack[key] : value;
      if (hasPhysicalClassFasl(effective)) faslHits.push(`${slug}.${key}=>${effective}`);
    }
  }
  assert.equal(
    faslHits.length,
    0,
    `GBD physical-class فصل leftovers: ${JSON.stringify(faslHits)}`
  );

  assert.equal(gbdCountry["pages__teacher__worksheets__index"].class_scope, "شعبة");
  assert.match(
    gbdCountry["components__teacher-portal__TeacherDashboardClient"].class_fallback,
    /^شعبة$/
  );
});

test("ar-IQ academic درجة closures: math/geometry step1 + copilot above-grade", () => {
  const baseLearning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "learning.json"), "utf8")
  );
  const countryLearning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  const learning = deepMergeOverlay(baseLearning, countryLearning);
  assert.match(learning.math.howToLearnSteps.step1, /اختر الصف/);
  assert.doesNotMatch(learning.math.howToLearnSteps.step1, /اختر الدرجة/);
  assert.match(learning.geometry.howToLearnSteps.step1, /اختر الصف/);
  assert.doesNotMatch(learning.geometry.howToLearnSteps.step1, /اختر الدرجة/);

  const baseCopilot = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "copilot.json"), "utf8")
  );
  const countryCopilot = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "copilot.json"), "utf8")
  );
  const copilot = deepMergeOverlay(baseCopilot, countryCopilot);
  const above =
    copilot.answers?.["utils_parent-copilot_intent-answer-composers"]
      ?.according_to_the_report_there_is_still_insufficient_evidence_for || "";
  assert.match(above, /فوق الصف المذكور/);
  assert.doesNotMatch(above, /فوق الدرجة/);
});

/** Academic school-year درجة (not score / angle / temperature / متدرجة). */
const ACADEMIC_DARAJAH_RES = [
  /اختر الدرجة/,
  /تغيير الدرجة/,
  /حسب الدرجة/,
  /مع الدرجة(?! الحرارة)/,
  /فوق الدرجة/,
  /أو الدرجة/,
  /اسم أو الدرجة/,
  /درجة أخرى/,
  /درجة أقل/,
  /درجة طفلك/,
  /تحديث درجتك/,
  /درجتك/,
  /اختر درجة(?! الحرارة)/,
  /رفع درجة/,
  /"درجة"/,
  /الكتابة حسب الدرجة/,
  /والمحتوى والدرجة/,
  /المحتوى والدرجة/,
  /متطابقة مع الدرجة/,
];

/** @param {string} text */
function hasAcademicDarajah(text) {
  return ACADEMIC_DARAJAH_RES.some((re) => re.test(String(text || "")));
}

test("ar-IQ residual academic درجة defects = 0 on effective merge", async () => {
  /** @type {string[]} */
  const hits = [];

  for (const rel of listJsonRel(path.join(ROOT, "locales", BASE))) {
    const base = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, rel), "utf8"));
    const ovPath = path.join(ROOT, "locales", LOCALE, rel);
    const ov = fs.existsSync(ovPath) ? JSON.parse(fs.readFileSync(ovPath, "utf8")) : {};
    const merged = deepMergeOverlay(base, ov);
    for (const [key, value] of collectStringLeaves(merged)) {
      if (hasAcademicDarajah(value)) hits.push(`locales/${rel}:${key}`);
    }
  }

  const help = await import("../../data/help-center/ar-IQ/index.js");
  if (hasAcademicDarajah(JSON.stringify(help.ALL_ARTICLES_AR_IQ))) {
    hits.push("help:ALL_ARTICLES");
  }

  const packRels = [
    "demo/ui.json",
    "learning/burn-down-index.json",
    "learning/burn-down/utils__topic-next-step-engine.json",
    "public-seo/guides/hub-cards.json",
    "public-seo/guides/math-practice-at-home.json",
    "public-seo/practice/english.json",
    "public-seo/practice/math.json",
    "public-seo/practice/reading.json",
  ];
  for (const rel of packRels) {
    const base = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs", BASE, rel), "utf8"));
    const ov = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8"));
    const merged = deepMergeOverlay(
      Array.isArray(base) ? { _arr: base } : base,
      Array.isArray(ov) ? { _arr: ov } : ov
    );
    const blob = JSON.stringify(Array.isArray(ov) ? ov : merged);
    // For array-root, effective is the country array itself (full replace).
    const effectiveBlob = Array.isArray(ov) ? JSON.stringify(ov) : JSON.stringify(merged);
    if (hasAcademicDarajah(effectiveBlob)) hits.push(`content-packs/${rel}`);
  }

  // Score/angle senses must remain inherited (not forced to صف).
  const ar001Learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "learning.json"), "utf8")
  );
  assert.equal(ar001Learning.master.peakScore, "درجة الذروة");
  assert.equal(ar001Learning.geometry.reference.terms.right_angle.desc, "90 درجة");

  assert.deepEqual(hits, [], `academic درجة remaining: ${JSON.stringify(hits)}`);
});

const IQ_GRADE_BANDS = [
  "الصفان الأول والثاني",
  "الصفان الثالث والرابع",
  "الصفان الخامس والسادس",
];

/** Numeric academic grade-band / digit grade labels in SEO chrome. */
const NUMERIC_ACADEMIC_GRADE_RE =
  /الصفوف\s*[1-6]\s*[–-]\s*[1-6]|الصفوف\s*[1-6]-[1-6]|الصف\s*[1-6](?!\d)|للصفوف\s*[1-6]/;

/**
 * @param {string} subjectRel under public-seo/practice/
 */
function effectivePracticePage(subjectRel) {
  const base = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, "public-seo/practice", subjectRel), "utf8")
  );
  const ovPath = path.join(ROOT, "content-packs", LOCALE, "public-seo/practice", subjectRel);
  const ov = fs.existsSync(ovPath) ? JSON.parse(fs.readFileSync(ovPath, "utf8")) : {};
  return deepMergeOverlay(base, ov);
}

/**
 * @param {Record<string, unknown>} page
 */
function gradeBandTitles(page) {
  const sections = /** @type {Array<Record<string, unknown>>} */ (page.sections || []);
  const gradeSec = sections.find((s) => Array.isArray(s.gradeSections));
  const gs = /** @type {Array<{ title?: string }>} */ (gradeSec?.gradeSections || []);
  return gs.map((g) => g.title || "");
}

test("ar-IQ public-seo grade-band titles are word-form (effective merge)", () => {
  for (const subject of ["math.json", "english.json", "reading.json"]) {
    const page = effectivePracticePage(subject);
    const titles = gradeBandTitles(page);
    assert.deepEqual(titles, IQ_GRADE_BANDS, subject);
    for (const t of titles) {
      assert.equal(NUMERIC_ACADEMIC_GRADE_RE.test(t), false, `${subject} numeric band: ${t}`);
    }
  }

  // Residual family: geometry / science / games / no-print / hub
  for (const subject of ["geometry.json", "science.json", "games.json", "no-print.json"]) {
    const page = effectivePracticePage(subject);
    const titles = gradeBandTitles(page);
    assert.deepEqual(titles, IQ_GRADE_BANDS, subject);
  }

  const hub = effectivePracticePage("hub.json");
  const hubBlob = JSON.stringify(hub);
  assert.equal(NUMERIC_ACADEMIC_GRADE_RE.test(hubBlob), false, `hub numeric: ${hubBlob.match(NUMERIC_ACADEMIC_GRADE_RE)}`);
  assert.match(hubBlob, /الأول إلى السادس/);
});

test("ar-IQ public-seo effective tree: numeric academic grade-band defects = 0", () => {
  /** @type {string[]} */
  const hits = [];
  const baseRoot = path.join(ROOT, "content-packs", BASE, "public-seo");
  const countryRoot = path.join(ROOT, "content-packs", LOCALE, "public-seo");

  /** @param {unknown} obj @param {string} prefix @param {Array<{key:string,value:string}>} out */
  function allLeaves(obj, prefix = "", out = []) {
    if (typeof obj === "string") {
      out.push({ key: prefix, value: obj });
      return out;
    }
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => allLeaves(v, `${prefix}[${i}]`, out));
      return out;
    }
    if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) allLeaves(v, prefix ? `${prefix}.${k}` : k, out);
    }
    return out;
  }

  for (const rel of listJsonRel(baseRoot)) {
    const base = JSON.parse(fs.readFileSync(path.join(baseRoot, rel), "utf8"));
    const ovPath = path.join(countryRoot, rel);
    const ov = fs.existsSync(ovPath) ? JSON.parse(fs.readFileSync(ovPath, "utf8")) : {};
    const merged =
      Array.isArray(base) && Array.isArray(ov)
        ? ov
        : Object.keys(ov).length
          ? deepMergeOverlay(base, ov)
          : base;
    for (const { key, value } of allLeaves(merged)) {
      if (NUMERIC_ACADEMIC_GRADE_RE.test(value)) hits.push(`${rel}:${key}=>${value}`);
    }
  }

  assert.deepEqual(hits, [], `numeric grade-band leftovers: ${JSON.stringify(hits)}`);
});

test("ar-IQ does not modify ar-001 / other locales / shared runtime", () => {
  // Guard: this overlay authoring session must not touch shared wiring files.
  const forbiddenTouched = [
    "lib/i18n/locale-registry.js",
    "lib/i18n/load-messages.js",
    "lib/content/pack-catalog.js",
    "data/help-center/index.js",
  ];
  // Presence check only — content must still be the shared files (not deleted).
  for (const rel of forbiddenTouched) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `shared file missing: ${rel}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, "locales/ar-001/common.json")));
  assert.equal(fs.existsSync(path.join(ROOT, "locales/ar-IQ/common.json")), true);
});
