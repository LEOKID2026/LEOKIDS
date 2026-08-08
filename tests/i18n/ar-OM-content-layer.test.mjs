/**
 * ar-OM (Oman) sparse content-layer checks vs ar-001.
 * No registry wiring, build, or full suite.
 *
 * Authority: Oman MoE — التعليم الأساسي (10 years); الحلقة الأولى = 1–4; الحلقة الثانية = 5–10.
 * LEO covers grades 1–6 → حلقة أولى + جزء من الحلقة الثانية (not full cycle 2).
 * Physical class group: الشعبة. Academic grade: الصف.
 * Fallback target (not wired here): ar-OM → ar-001 → en.
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
const LOCALE = "ar-OM";
const AUTHORITY = "ar-001";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const CROSS_COUNTRY_RE =
  /مصر|المصرية|المملكة العربية السعودية|السعودية(?! العربية)|المغرب|الجزائر|تونس|الأردن|الاردن|عمّان|العراق|الإمارات|الامارات|الكويت|قطر|البحرين|جنيه|ريال سعودي/;
const DIGIT_GRADE_RE = /الصف [1-6](?!\d)/;
const TALMEEDH_RE = /تلميذ/;
const FORBIDDEN_EN_UI_RE =
  /\b(Grade|Student login|Parent login|Worksheet|Dashboard|Settings|Cancel|Save|Continue|Back|Next|Loading)\b/;
const MONOLINGUAL_CLAIM_RE =
  /اللغة الوحيدة|فقط بالعربية في (عُمان|عمان|سلطنة عُمان)|العربية وحدها|لا توجد لغة أخرى|اللغة الرسمية الوحيدة(?!\s+للواجهة)/;
/** Wrong claim that cycle 2 ends at 6/8, or that 1–6 is all حلقة أولى. Oman Cycle 2 continues to grade 10. */
const BAD_CYCLE_CLAIM_RE =
  /الحلقة الثانية[^.؛\n]{0,40}(حتى|إلى)\s*الصف السادس(?![^.؛\n]{0,40}العاشر)|الصفوف?\s*(?:الأول|1)\s*[–\-إلى]+\s*(?:السادس|6)[^.؛\n]{0,30}الحلقة الأولى|الحلقة الأولى[^.؛\n]{0,40}(?:الأول|1)[^.؛\n]{0,20}(?:السادس|6)|الحلقة الثانية[^.؛\n]{0,40}(حتى|إلى)\s*الصف الثامن/;
const SEMESTERISH_CLASS_GROUP_RE = /الفصل الدراسي/;
const COPILOT_AR_PRODUCT_NAME = "مساعد الطيار";
const LATIN_COPILOT_RE = /\bCopilot\b/;
/** Official primary-stage label that must not describe the whole LEO 1–6 audience as Oman system structure. */
const MARHALA_IBTIDAIYYA_RE = /المرحلة الابتدائية/;

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

/**
 * @param {unknown} obj
 * @param {string[]} out
 */
function collectAllStrings(obj, out = []) {
  if (typeof obj === "string") {
    out.push(obj);
    return out;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) collectAllStrings(item, out);
    return out;
  }
  if (obj && typeof obj === "object") {
    for (const v of Object.values(obj)) collectAllStrings(v, out);
  }
  return out;
}

/** @param {string} text */
function hasAcademicDarajah(text) {
  return ACADEMIC_DARAJAH_RES.some((re) => re.test(text));
}

/**
 * Deep-merge plain objects the same way runtime sparse packs do (arrays replace).
 * @param {unknown} base
 * @param {unknown} overlay
 */
function deepMergeJson(base, overlay) {
  if (overlay === undefined) return base;
  if (overlay === null || typeof overlay !== "object" || Array.isArray(overlay)) {
    return overlay;
  }
  if (base === null || base === undefined || typeof base !== "object" || Array.isArray(base)) {
    return Array.isArray(overlay) ? overlay : { ...overlay };
  }
  /** @type {Record<string, unknown>} */
  const out = { .../** @type {Record<string, unknown>} */ (base) };
  for (const [key, value] of Object.entries(/** @type {Record<string, unknown>} */ (overlay))) {
    const prev = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      out[key] = deepMergeJson(prev, value);
    } else {
      out[key] = value;
    }
  }
  return out;
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

test("ar-OM locale namespaces parse and stay sparse vs ar-001", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", AUTHORITY);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("auth.json"));
  assert.ok(files.includes("school.json"), "school has الشعبة overrides");
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
  /** @type {string[]} */
  const hebrewHits = [];
  /** @type {string[]} */
  const crossHits = [];
  /** @type {string[]} */
  const digitGradeHits = [];
  /** @type {string[]} */
  const talmeedhHits = [];
  /** @type {string[]} */
  const monolingualHits = [];
  /** @type {string[]} */
  const badCycleHits = [];
  let overrideCount = 0;

  for (const file of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryDir, file), "utf8"));
    const basePath = path.join(baseDir, file);
    assert.ok(fs.existsSync(basePath), `missing ar-001 authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    const blob = JSON.stringify(country);
    if (HEBREW_RE.test(blob)) hebrewHits.push(file);
    if (CROSS_COUNTRY_RE.test(blob)) crossHits.push(file);
    if (DIGIT_GRADE_RE.test(blob)) digitGradeHits.push(file);
    if (TALMEEDH_RE.test(blob)) talmeedhHits.push(file);
    if (MONOLINGUAL_CLAIM_RE.test(blob)) monolingualHits.push(file);
    if (BAD_CYCLE_CLAIM_RE.test(blob)) badCycleHits.push(file);
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
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(crossHits, []);
  assert.deepEqual(digitGradeHits, []);
  assert.deepEqual(talmeedhHits, []);
  assert.deepEqual(monolingualHits, []);
  assert.deepEqual(badCycleHits, []);
  assert.ok(overrideCount > 0);
});

test("ar-OM grade mapping الصف الأول–السادس and Oman education-stage wording", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.master?.defaultPlayerName, "الطالب");
  assert.equal(
    learning.master?.gradeRequired,
    "يرجى اختيار الصف قبل التدريب. اطلب من ولي الأمر تحديث صفك."
  );
  assert.doesNotMatch(learning.master?.gradeRequired || "", /درجتك|درجة/);
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );

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
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /سلطنة عُمان/);
  assert.match(seo.homeDescription, /النسخة العربية لسلطنة عُمان/);
  assert.doesNotMatch(seo.homeDescription, MONOLINGUAL_CLAIM_RE);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.home?.ctaKids, "أنا طالب");
  assert.equal(ui.home?.ctaTeachers, "أنا معلم");
  assert.match(ui.home?.subhead || "", /سلطنة عُمان/);
  assert.match(learning.master?.gradeRequired || "", /ولي الأمر/);
  assert.match(ui.public?.about?.intro1 || "", /الصف الأول إلى الصف السادس/);
  assert.match(ui.public?.about?.intro1 || "", /الحلقة الأولى/);
  assert.match(ui.public?.about?.intro1 || "", /الصف الأول–الرابع/);
  assert.match(ui.public?.about?.intro1 || "", /جزءًا من الحلقة الثانية/);
  assert.match(ui.public?.about?.intro1 || "", /الصف الخامس–السادس/);
  assert.match(ui.public?.about?.intro1 || "", /حتى الصف العاشر/);
  assert.match(ui.public?.about?.intro1 || "", /10 سنوات|التعليم الأساسي/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", BAD_CYCLE_CLAIM_RE);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.equal(rewards.gradeBands?.g12, "الصف الأول–الثاني");
  assert.equal(rewards.gradeBands?.g34, "الصف الثالث–الرابع");
  assert.equal(rewards.gradeBands?.g56, "الصف الخامس–السادس");
  assert.doesNotMatch(JSON.stringify(rewards.gradeBands), /الحلقة/);
});

test("ar-OM effective surfaces: no misleading المرحلة الابتدائية for LEO grades 1–6", async () => {
  /** @type {string[]} */
  const hits = [];

  // Locales: deep-merge ar-001 ← ar-OM
  for (const rel of listJsonRel(path.join(ROOT, "locales", AUTHORITY))) {
    const base = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, rel), "utf8"));
    const ovPath = path.join(ROOT, "locales", LOCALE, rel);
    const overlay = fs.existsSync(ovPath)
      ? JSON.parse(fs.readFileSync(ovPath, "utf8"))
      : undefined;
    const effective = deepMergeJson(base, overlay);
    const blob = JSON.stringify(effective);
    if (MARHALA_IBTIDAIYYA_RE.test(blob)) hits.push(`locales-effective:${rel}`);
  }

  // Content packs: file merge + global-burn-down index leaf overlays
  const idx = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "global-burn-down/burn-down-index.json"), "utf8")
  );
  for (const rel of listJsonRel(path.join(ROOT, "content-packs", AUTHORITY))) {
    const base = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs", AUTHORITY, rel), "utf8"));
    const ovPath = path.join(ROOT, "content-packs", LOCALE, rel);
    let effective = fs.existsSync(ovPath)
      ? deepMergeJson(base, JSON.parse(fs.readFileSync(ovPath, "utf8")))
      : base;
    const parts = rel.split("/");
    if (parts[0] === "global-burn-down" && parts[1]?.endsWith(".json")) {
      const slug = parts[1].replace(/\.json$/, "");
      if (idx[slug] && effective && typeof effective === "object" && !Array.isArray(effective)) {
        const leaf = /** @type {Record<string, unknown>} */ (effective);
        if (leaf.copy && typeof leaf.copy === "object") {
          leaf.copy = { .../** @type {object} */ (leaf.copy), ...idx[slug] };
        }
      }
    }
    const blob = JSON.stringify(effective);
    if (MARHALA_IBTIDAIYYA_RE.test(blob)) hits.push(`pack-effective:${rel}`);
  }

  // Help: merged articles (display text), not matcher-only textIncludes in overlay source
  const help = await import("../../data/help-center/ar-OM/index.js");
  const helpBlob = JSON.stringify(help.ALL_ARTICLES_AR_OM);
  if (MARHALA_IBTIDAIYYA_RE.test(helpBlob)) hits.push("help-effective:ALL_ARTICLES_AR_OM");

  assert.deepEqual(hits, [], `misleading المرحلة الابتدائية still effective: ${JSON.stringify(hits)}`);

  // Explicit corrected public SEO / app chrome
  const reading = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/practice/reading.json"), "utf8")
  );
  assert.match(reading.h1, /التعليم الأساسي/);
  assert.doesNotMatch(reading.h1, MARHALA_IBTIDAIYYA_RE);

  const science = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/practice/science.json"), "utf8")
  );
  assert.match(science.badge, /التعليم الأساسي/);
  assert.doesNotMatch(science.badge, MARHALA_IBTIDAIYYA_RE);

  const seoPack = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/lib__site__public-page-seo.json"),
      "utf8"
    )
  );
  assert.match(seoPack.copy.leo_kids_practice_for_elementary_learners, /التعليم الأساسي/);
  assert.doesNotMatch(JSON.stringify(seoPack), MARHALA_IBTIDAIYYA_RE);

  const appTitle = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "global-burn-down/pages___app.json"), "utf8")
  );
  assert.match(appTitle.copy.default_document_title, /التعليم الأساسي/);
  assert.doesNotMatch(appTitle.copy.default_document_title, MARHALA_IBTIDAIYYA_RE);

  const schools = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/marketing/schools.json"), "utf8")
  );
  assert.match(JSON.stringify(schools.benefits.items), /للتعليم الأساسي|التعليم الأساسي/);
  assert.match(JSON.stringify(schools.benefits.items), /للصفوف من الأول إلى السادس|الصفوف من الأول إلى السادس/);
  assert.doesNotMatch(JSON.stringify(schools), MARHALA_IBTIDAIYYA_RE);

  // Justified inheritance: practice hub uses generic "ممارسة ابتدائية" (not المرحلة الابتدائية stage claim)
  const hubBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", AUTHORITY, "public-seo/practice/hub.json"), "utf8")
  );
  const hubOv = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/practice/hub.json"), "utf8")
  );
  const hub = /** @type {{ h1?: string }} */ (deepMergeJson(hubBase, hubOv));
  assert.equal(hub.h1, "ممارسة ابتدائية حسب المادة والصف");
  assert.doesNotMatch(hub.h1 || "", MARHALA_IBTIDAIYYA_RE);

  // Justified: worksheet SEO "الممارسة الابتدائية" is practice-style adjective, not official stage
  const basePublicSeo = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", AUTHORITY, "global-burn-down/lib__site__public-page-seo.json"),
      "utf8"
    )
  );
  assert.match(
    basePublicSeo.copy.ready_worksheets_a_worksheet_generator_and_answer_keys_for_elementary_pr,
    /للممارسة الابتدائية|الممارسة الابتدائية/
  );
  assert.equal(
    fs.existsSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/lib__site__public-page-seo.json")
    ),
    true
  );
  assert.doesNotMatch(
    JSON.stringify(seoPack.copy),
    /ready_worksheets_a_worksheet_generator_and_answer_keys_for_elementary_pr/
  );
});

test("ar-OM Oman cycle regression: حلقة أولى 1–4; 5–6 part of حلقة ثانية to 10", async () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  const about = ui.public?.about?.intro1 || "";
  assert.match(about, /الحلقة الأولى \(الصف الأول–الرابع\)/);
  assert.match(about, /جزءًا من الحلقة الثانية \(الصف الخامس–السادس/);
  assert.match(about, /الحلقة الثانية تمتد رسميًا حتى الصف العاشر/);
  assert.doesNotMatch(about, BAD_CYCLE_CLAIM_RE);
  // Must not claim grades 1–6 are all حلقة أولى as a single official band.
  assert.doesNotMatch(about, /الحلقة الأولى[^.؛()]{0,40}(?:إلى|–|-)\s*الصف السادس/);
  assert.doesNotMatch(about, /الحلقة الثانية\s*(?:تنتهي|تنتهى|فقط)/);

  const help = await import("../../data/help-center/ar-OM/index.js");
  const welcome = help.BY_SECTION_AR_OM.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /الحلقة الأولى \(الصف الأول–الرابع\)/);
  assert.match(welcomeBlob, /جزءًا من الحلقة الثانية \(الصف الخامس–السادس/);
  assert.match(welcomeBlob, /حتى الصف العاشر/);
  assert.doesNotMatch(welcomeBlob, BAD_CYCLE_CLAIM_RE);
  assert.doesNotMatch(welcomeBlob, MARHALA_IBTIDAIYYA_RE);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.doesNotMatch(JSON.stringify(rewards.gradeBands), /الحلقة الأولى|الحلقة الثانية/);
});

test("ar-OM grade/class-group distinction: الصف ≠ الشعبة; no الفصل الدراسي for physical group", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal.choosePhysicalClass, "اختر الشعبة");
  assert.equal(school.portal.classLabel, "الشعبة");
  assert.equal(school.portal.colClass, "الشعبة");
  assert.equal(
    school.portal.classesSubtitle,
    "اختر الصف والشعبة والمادة - التقارير والإدارة حسب الصف"
  );
  assert.doesNotMatch(school.portal.classesSubtitle, SEMESTERISH_CLASS_GROUP_RE);
  assert.doesNotMatch(JSON.stringify(school), SEMESTERISH_CLASS_GROUP_RE);
  assert.match(JSON.stringify(school), /الشعبة/);
  assert.equal(school.communication.detailsFieldClass, "الشعبة");
  assert.equal(school.communication.audienceClassParents, "أولياء أمور الشعبة");

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.api.physical_class_not_found, /شعبة مطابقة/);
  assert.doesNotMatch(validation.api.physical_class_not_found, /فصل مطابق/);

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.match(teacher.dashboard?.noClassesTitle || "", /شعب/);
  assert.match(teacher.focus?.classFallbackBanner || "", /الشعبة/);
  assert.doesNotMatch(JSON.stringify(teacher), /يحتاج الشعبة|يظهر الشعبة|الشعبة يسير/);
});

test("ar-OM content packs sparse contract vs ar-001", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", AUTHORITY);
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
  const crossHits = [];
  /** @type {string[]} */
  const digitGradeHits = [];
  /** @type {string[]} */
  const talmeedhHits = [];
  /** @type {string[]} */
  const extraFiles = [];
  /** @type {string[]} */
  const badCycleHits = [];

  assert.equal(fs.existsSync(path.join(countryRoot, "learning/taxonomy")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`)), false);

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const countryLeaves = collectStringLeaves(country);
    const allCountryStrings = collectAllStrings(country);
    if (countryLeaves.size === 0 && allCountryStrings.length === 0) emptyFiles.push(rel);
    const blob = JSON.stringify(country);
    if (BAD_CYCLE_CLAIM_RE.test(blob)) badCycleHits.push(rel);

    if (Array.isArray(country)) {
      if (!baseExists(rel)) {
        extraFiles.push(rel);
        continue;
      }
      const base = JSON.parse(fs.readFileSync(path.join(baseRoot, rel), "utf8"));
      assert.ok(Array.isArray(base), rel);
      const baseStrings = collectAllStrings(base);
      const countryStrings = allCountryStrings;
      assert.equal(countryStrings.length, baseStrings.length, `array length drift ${rel}`);
      let diffs = 0;
      for (let i = 0; i < countryStrings.length; i += 1) {
        const value = countryStrings[i];
        if (HEBREW_RE.test(value)) hebrewHits.push(`${rel}:[${i}]`);
        if (CROSS_COUNTRY_RE.test(value)) crossHits.push(`${rel}:[${i}]`);
        if (DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:[${i}]`);
        if (TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:[${i}]`);
        if (value !== baseStrings[i]) diffs += 1;
      }
      assert.ok(diffs > 0, `array overlay has no diffs: ${rel}`);
      assert.ok(diffs < countryStrings.length, `array overlay rewrote everything: ${rel}`);
      continue;
    }

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
        if (CROSS_COUNTRY_RE.test(value)) crossHits.push(`${rel}:${key}`);
        if (DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:${key}`);
        if (TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && CROSS_COUNTRY_RE.test(value)) crossHits.push(`${rel}:${key}`);
      if (typeof value === "string" && DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:${key}`);
      if (typeof value === "string" && TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:${key}`);
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
  assert.deepEqual(crossHits, []);
  assert.deepEqual(digitGradeHits, []);
  assert.deepEqual(talmeedhHits, []);
  assert.deepEqual(badCycleHits, []);

  const demo = JSON.parse(fs.readFileSync(path.join(countryRoot, "demo/ui.json"), "utf8"));
  assert.deepEqual(
    [demo.grades?.g1, demo.grades?.g2, demo.grades?.g3, demo.grades?.g4, demo.grades?.g5, demo.grades?.g6],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );

  const classGrade = JSON.parse(
    fs.readFileSync(
      path.join(countryRoot, "global-burn-down/lib__teacher-portal__teacher-class-grade.json"),
      "utf8"
    )
  );
  assert.deepEqual(
    [
      classGrade.copy.grade_1,
      classGrade.copy.grade_2,
      classGrade.copy.grade_3,
      classGrade.copy.grade_4,
      classGrade.copy.grade_5,
      classGrade.copy.grade_6,
    ],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );

  const dash = JSON.parse(
    fs.readFileSync(
      path.join(countryRoot, "global-burn-down/components__teacher-portal__TeacherDashboardClient.json"),
      "utf8"
    )
  );
  assert.match(dash.copy?.remove_this_student_from_the_class || "", /من الشعبة/);
  assert.match(dash.copy?.dashboard_subtitle || "", /الشعب والطلاب/);
  assert.match(dash.copy?.class_at_cap || "", /بلغت هذه الشعبة/);
});

test("ar-OM help overlays parse on ar-001 base and keep slugs", async () => {
  const help = await import("../../data/help-center/ar-OM/index.js");
  const baseParents = await import("../../data/help-center/ar-001/parents.js");
  const baseStudents = await import("../../data/help-center/ar-001/students.js");
  const baseReport = await import("../../data/help-center/ar-001/parent-report.js");
  const baseSubjects = await import("../../data/help-center/ar-001/subjects.js");

  assert.equal(
    help.ALL_ARTICLES_AR_OM.length,
    baseParents.PARENT_ARTICLES.length +
      baseStudents.STUDENT_ARTICLES.length +
      baseReport.PARENT_REPORT_ARTICLES.length +
      baseSubjects.SUBJECT_ARTICLES.length
  );
  assert.equal(help.SECTIONS_AR_OM.students.title, "دليل للطلاب");
  assert.doesNotMatch(help.SECTIONS_AR_OM.students.title, TALMEEDH_RE);

  const parentSlugs = new Set(baseParents.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_AR_OM.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }

  const welcome = help.BY_SECTION_AR_OM.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /سلطنة عُمان/);
  assert.match(welcomeBlob, /الحلقة الأولى/);
  assert.match(welcomeBlob, /جزءًا من الحلقة الثانية/);
  assert.match(welcomeBlob, /حتى الصف العاشر/);
  assert.doesNotMatch(welcomeBlob, BAD_CYCLE_CLAIM_RE);
  assert.doesNotMatch(welcomeBlob, MONOLINGUAL_CLAIM_RE);

  const login = help.BY_SECTION_AR_OM.students.find((a) => a.slug === "student-login");
  assert.match(JSON.stringify(login), /تسجيل دخول الطالب/);
  assert.doesNotMatch(JSON.stringify(login), TALMEEDH_RE);

  const blob = JSON.stringify(help.ALL_ARTICLES_AR_OM);
  assert.doesNotMatch(blob, HEBREW_RE);
  assert.doesNotMatch(blob, CROSS_COUNTRY_RE);
});

test("ar-OM does not ship word-meanings overlay; English learning IDs preserved", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);

  const skills = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/english-page-skills.json"), "utf8")
  );
  assert.ok(!("words" in skills));
  assert.ok(!("phonics" in skills));
  assert.equal(skills.grades?.g3?.grammar_question_frames?.title, "الأسئلة - تعزيز الصف الثالث");
  assert.match(skills.grades?.g4?.vocab_school?.title || "", /الطلاب/);
});

test("ar-OM ar-001 untouched; MAIN wired /om; country content constraints", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "locales", AUTHORITY, "common.json")), true);
  const ar001Common = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, "common.json"), "utf8")
  );
  assert.equal(ar001Common.grade1, "الصف 1");

  const registry = fs.readFileSync(path.join(ROOT, "lib/i18n/locale-registry.js"), "utf8");
  assert.match(registry, /"ar-OM"/);
  assert.match(registry, /pathPrefix:\s*"om"/);

  const localeBlob = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(localeBlob, FORBIDDEN_EN_UI_RE);
  assert.doesNotMatch(localeBlob, LATIN_COPILOT_RE);
  assert.doesNotMatch(localeBlob, SEMESTERISH_CLASS_GROUP_RE);
});

test("ar-OM Copilot chrome uses Arabic Master product name مساعد الطيار", () => {
  const ar001Ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, "ui.json"), "utf8"));
  assert.match(ar001Ui.localeSettings?.description || "", /مساعد الطيار/);

  const copilot = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "copilot.json"), "utf8"));
  const rebuild =
    copilot.answers["lib_parent-copilot_copilot-turn-payload"].server
      .could_not_verify_student_ownership_for_copilot_rebuild;
  assert.match(rebuild, new RegExp(COPILOT_AR_PRODUCT_NAME));
  assert.doesNotMatch(rebuild, LATIN_COPILOT_RE);
  assert.match(copilot.boundary?.peerComparison || "", /في الشعبة/);
});

test("ar-OM academic-grade surfaces use الصف not درجة; score/angle درجة may remain inherited", async () => {
  /** @type {string[]} */
  const academicHits = [];

  for (const rel of listJsonRel(path.join(ROOT, "locales", LOCALE))) {
    const blob = fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8");
    if (hasAcademicDarajah(blob)) academicHits.push(`locales/${rel}`);
  }
  for (const rel of listJsonRel(path.join(ROOT, "content-packs", LOCALE))) {
    const blob = fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8");
    if (hasAcademicDarajah(blob)) academicHits.push(`content-packs/${rel}`);
  }

  const help = await import("../../data/help-center/ar-OM/index.js");
  const helpBlob = JSON.stringify({
    sections: help.SECTIONS_AR_OM,
    articles: help.ALL_ARTICLES_AR_OM,
  });
  if (hasAcademicDarajah(helpBlob)) academicHits.push("data/help-center/ar-OM");

  assert.deepEqual(academicHits, [], `academic درجة remaining: ${JSON.stringify(academicHits)}`);

  const diag = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "learning/diagnostic-labels.json"), "utf8")
  );
  assert.equal(diag.snippets.grade, "الصف");

  const hub = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/guides/hub-cards.json"), "utf8")
  );
  assert.match(hub[0].blurb, /مع الصف/);
  assert.doesNotMatch(hub[0].blurb, /مع الدرجة/);

  const ar001Learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, "learning.json"), "utf8"));
  assert.equal(ar001Learning.master.peakScore, "درجة الذروة");
  assert.equal(ar001Learning.geometry.reference.terms.right_angle.desc, "90 درجة");

  const aeLearning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.match(aeLearning.master.gradeRequired, /تحديث صفك/);
  assert.doesNotMatch(aeLearning.master.gradeRequired, /درجتك/);

  assert.equal(
    fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/guides/parent-progress-tracking.json")),
    false,
    "score-sense الدرجة المنخفضة stays inherited"
  );

  const edit = help.BY_SECTION_AR_OM.parents.find((a) => a.slug === "edit-or-delete-student");
  assert.match(edit.summary, /أو الصف/);
  assert.doesNotMatch(edit.summary, /الدرجة/);
});

const NUMERIC_ACADEMIC_RE =
  /الصف [1-6](?!\d)|الصفوف [1-6]|للصفوف [1-6]|من 1 إلى 6|الصفوف 1–6|الصفوف 1-6/;
const STUDENT_ROLE_TALMEEDH_RE = /تلميذ|تلاميذ/;
const WORD_BANDS = ["الصفان الأول والثاني", "الصفان الثالث والرابع", "الصفان الخامس والسادس"];

test("ar-OM audit-28: Help subject summaries + numeric body paragraphs (8 findings)", async () => {
  const { BY_SECTION_AR_OM } = await import("../../data/help-center/ar-OM/index.js");
  const expectedSummaries = {
    math: "ممارسة الرياضيات للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    geometry: "ممارسة الهندسة للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    english: "ممارسة اللغة الإنجليزية للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    science: "ممارسة العلوم للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
  };
  for (const [slug, summary] of Object.entries(expectedSummaries)) {
    const article = BY_SECTION_AR_OM.subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    assert.equal(article.summary, summary);
    assert.doesNotMatch(article.summary, NUMERIC_ACADEMIC_RE);
    const blob = collectAllStrings(article).join("\n");
    assert.match(blob, /في الصفوف من الأول إلى السادس/);
    assert.doesNotMatch(blob, /في الصفوف من 1 إلى 6/);
    assert.doesNotMatch(blob, /للصفوف 1-6/);
    assert.match(blob, /اختر الصف والمستوى/);
    assert.doesNotMatch(blob, /اختر الدرجة والمستوى/);
  }
});

test("ar-OM audit-28: Public SEO numeric grade bands + hub FAQ (14 findings)", () => {
  const hub = /** @type {{ faq: Array<{ a: string }>, footerCta: { secondary: { label: string } } }} */ (
    deepMergeJson(
      JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-001/public-seo/practice/hub.json"), "utf8")),
      JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-OM/public-seo/practice/hub.json"), "utf8"))
    )
  );
  assert.equal(
    hub.faq[0].a,
    "الممارسة مصمّمة للصفوف من الأول إلى السادس، وتعرض كل مادة مواضيع مناسبة للصف الذي تختاره."
  );
  assert.doesNotMatch(hub.faq[0].a, NUMERIC_ACADEMIC_RE);
  assert.equal(hub.faq.length, 3);
  assert.equal(hub.footerCta.secondary.label, "دخول الطالب");

  /** @param {string} rel */
  function mergedPractice(rel) {
    return /** @type {{ badge?: string, sections?: Array<{ gradeSections?: Array<{ title: string }> }> }} */ (
      deepMergeJson(
        JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-001", rel), "utf8")),
        JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-OM", rel), "utf8"))
      )
    );
  }

  const geometry = mergedPractice("public-seo/practice/geometry.json");
  assert.equal(geometry.badge, "الهندسة للصفوف من الأول إلى السادس");
  assert.doesNotMatch(geometry.badge || "", NUMERIC_ACADEMIC_RE);
  const geoBands = geometry.sections?.find((s) => Array.isArray(s.gradeSections))?.gradeSections || [];
  assert.deepEqual(
    geoBands.map((g) => g.title),
    WORD_BANDS
  );

  for (const rel of [
    "public-seo/practice/science.json",
    "public-seo/practice/games.json",
    "public-seo/practice/no-print.json",
  ]) {
    const pack = mergedPractice(rel);
    const bands = pack.sections?.find((s) => Array.isArray(s.gradeSections))?.gradeSections || [];
    assert.equal(bands.length, 3, rel);
    assert.deepEqual(
      bands.map((g) => g.title),
      WORD_BANDS,
      rel
    );
    for (const g of bands) assert.doesNotMatch(g.title, NUMERIC_ACADEMIC_RE);
  }
});

test("ar-OM audit-28: Legal + schools marketing student-role تلميذ closure (6 findings)", () => {
  const legal = /** @type {{ unifiedLegalSections: Array<{ paragraphs: string[] }> }} */ (
    deepMergeJson(
      JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-001/public-seo/legal/unified.json"), "utf8")),
      JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-OM/public-seo/legal/unified.json"), "utf8"))
    )
  );
  const s = legal.unifiedLegalSections;
  assert.match(s[0].paragraphs[3], /متابعة الطلاب/);
  assert.doesNotMatch(s[0].paragraphs[3], STUDENT_ROLE_TALMEEDH_RE);
  assert.match(s[4].paragraphs[1], /أو الطلاب/);
  assert.match(s[4].paragraphs[2], /أو الطلاب/);
  assert.match(s[4].paragraphs[3], /تجاه الطالب/);
  assert.match(s[13].paragraphs[4], /حول الطلاب/);
  for (const idx of [0, 4, 13]) {
    const blob = JSON.stringify(s[idx]);
    assert.doesNotMatch(blob, STUDENT_ROLE_TALMEEDH_RE);
  }

  const schools = /** @type {{ infoSections: Array<{ bullets: string[] }> }} */ (
    deepMergeJson(
      JSON.parse(
        fs.readFileSync(path.join(ROOT, "content-packs/ar-001/public-seo/marketing/schools.json"), "utf8")
      ),
      JSON.parse(
        fs.readFileSync(path.join(ROOT, "content-packs/ar-OM/public-seo/marketing/schools.json"), "utf8")
      )
    )
  );
  assert.equal(schools.infoSections[0].bullets[2], "عرض الطلاب المسجّلين.");
  assert.doesNotMatch(schools.infoSections[0].bullets[2], STUDENT_ROLE_TALMEEDH_RE);
});

test("ar-OM residual: numeric academic grades + student-role تلميذ = 0 on audited surfaces", async () => {
  /** @type {string[]} */
  const numHits = [];
  /** @type {string[]} */
  const talHits = [];

  const help = await import("../../data/help-center/ar-OM/index.js");
  for (const article of help.ALL_ARTICLES_AR_OM) {
    for (const s of collectAllStrings(article)) {
      if (NUMERIC_ACADEMIC_RE.test(s)) numHits.push(`help:${article.slug}:${s.slice(0, 80)}`);
      if (STUDENT_ROLE_TALMEEDH_RE.test(s)) talHits.push(`help:${article.slug}:${s.slice(0, 80)}`);
    }
  }

  const packRels = [
    "public-seo/practice/hub.json",
    "public-seo/practice/math.json",
    "public-seo/practice/geometry.json",
    "public-seo/practice/english.json",
    "public-seo/practice/science.json",
    "public-seo/practice/reading.json",
    "public-seo/practice/games.json",
    "public-seo/practice/no-print.json",
    "public-seo/marketing/schools.json",
    "public-seo/marketing/teachers.json",
    "public-seo/legal/unified.json",
    "public-seo/guides/hub-cards.json",
    "public-seo/guides/math-practice-at-home.json",
    "public-seo/guides/learning-games-at-home.json",
    "demo/ui.json",
  ];
  for (const rel of packRels) {
    const basePath = path.join(ROOT, "content-packs/ar-001", rel);
    if (!fs.existsSync(basePath)) continue;
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const ovPath = path.join(ROOT, "content-packs/ar-OM", rel);
    const ov = fs.existsSync(ovPath) ? JSON.parse(fs.readFileSync(ovPath, "utf8")) : {};
    const merged = Array.isArray(base)
      ? Array.isArray(ov) && ov.length
        ? ov
        : base
      : deepMergeJson(base, ov);
    for (const s of collectAllStrings(merged)) {
      if (NUMERIC_ACADEMIC_RE.test(s)) numHits.push(`pack:${rel}:${s.slice(0, 100)}`);
      if (STUDENT_ROLE_TALMEEDH_RE.test(s)) talHits.push(`pack:${rel}:${s.slice(0, 100)}`);
    }
  }

  for (const ns of ["school.json", "teacher.json", "ui.json", "platform.json", "learning.json", "auth.json"]) {
    const merged = deepMergeJson(
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001", ns), "utf8")),
      fs.existsSync(path.join(ROOT, "locales/ar-OM", ns))
        ? JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-OM", ns), "utf8"))
        : undefined
    );
    for (const s of collectAllStrings(merged)) {
      if (STUDENT_ROLE_TALMEEDH_RE.test(s)) talHits.push(`locale:${ns}:${s.slice(0, 100)}`);
    }
  }

  assert.deepEqual(numHits, [], `numeric residues: ${JSON.stringify(numHits.slice(0, 20))}`);
  assert.deepEqual(talHits, [], `student-role residues: ${JSON.stringify(talHits.slice(0, 20))}`);
});
