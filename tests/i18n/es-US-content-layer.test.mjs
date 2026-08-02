/**
 * es-US (United States Spanish) sparse content-layer checks.
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
const LOCALE = "es-US";
const BASE = "es-419";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const VOSOTROS_RE = /\bvosotros\b|\b(estáis|tenéis|queréis|podéis|hacéis|sois)\b/i;
const VOSEO_RE = /\b(vos|tenés|querés|podés|sabés|decís|venís|sos)\b/i;
const SPAIN_TERM_RE = /\b(ordenador|móvil)\b|\bcurso\s+[1-6]\b/i;
const BARE_GRADO_N_RE = /\bGrado [1-6]\b/;
const US_GRADES = [
  "1.er grado",
  "2.º grado",
  "3.er grado",
  "4.º grado",
  "5.º grado",
  "6.º grado",
];

/** Paths outside the es-US content agent contract that must stay untouched. */
const FORBIDDEN_TOUCH_GLOBS = [
  "locales/es-419",
  "locales/en",
  "locales/es-MX",
  "locales/es-ES",
  "content-packs/es-419",
  "data/help-center/es-419",
  "data/help-center/index.js",
];

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
function assertNoSpainOrVoseo(blob, label) {
  assert.equal(VOSOTROS_RE.test(blob), false, `vosotros in ${label}`);
  assert.equal(VOSEO_RE.test(blob), false, `voseo in ${label}`);
  assert.equal(SPAIN_TERM_RE.test(blob), false, `Spain terminology in ${label}`);
}

test("es-US locale namespaces parse and stay sparse vs es-419", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("ui.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("teacher.json"));
  assert.ok(files.includes("auth.json"));

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
    assertNoSpainOrVoseo(blob, file);
    assert.equal(BARE_GRADO_N_RE.test(blob), false, `bare Grado N in ${file}`);
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

test("es-US grade mapping 1.er–6.º grado", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    US_GRADES
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
    US_GRADES
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
    US_GRADES
  );
  assert.match(worksheets.hubTitle, /Hojas de trabajo/);
  assert.doesNotMatch(worksheets.hubTitle, /Hojas de actividades/);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Estados Unidos/);
  assert.match(seo.homeDescription, /habla hispana/);
  assert.match(seo.learningDescription, /1\.er a 6\.º grado/);
  assert.doesNotMatch(seo.homeTitle, /única lengua|único idioma|el idioma de Estados Unidos/i);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assertNoSpainOrVoseo(allLocaleText, "locales/es-US");
  assert.match(allLocaleText, /1\.er grado/);
  assert.match(allLocaleText, /6\.º grado/);
  assert.match(allLocaleText, /escuela primaria/);
  assert.match(allLocaleText, /celular/);
  assert.match(allLocaleText, /hoja de trabajo/i);
  assert.match(allLocaleText, /padre, madre o tutor/);
});

test("es-US UI/teacher preferred terminology", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home?.subhead || "", /escuela primaria/);
  assert.equal(ui.help?.videoModalMobile, "Video tutorial (celular)");
  assert.match(ui.parent?.worksheets || "", /Hojas de trabajo/);
  assert.equal(ui.student?.panelWorksheets, "Hojas de trabajo");

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.equal(teacher.assignmentTypes?.worksheet_pdf, "Hoja de trabajo");

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.match(auth.askParentOpenAccount, /padre, madre o tutor/);
  assert.match(auth.parentWelcomeBody, /padre, madre o tutor/);
});

test("es-US content packs sparse contract vs es-419", () => {
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
  const typeMismatches = [];
  /** @type {string[]} */
  const nearFullCopies = [];
  /** @type {string[]} */
  const emptyFiles = [];
  /** @type {string[]} */
  const hebrewHits = [];
  /** @type {string[]} */
  const spainHits = [];
  /** @type {string[]} */
  const bareGradeHits = [];
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
        if (SPAIN_TERM_RE.test(value) || VOSOTROS_RE.test(value) || VOSEO_RE.test(value)) {
          spainHits.push(`${rel}:${key}`);
        }
        if (BARE_GRADO_N_RE.test(value)) bareGradeHits.push(`${rel}:${key}`);
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
      if (
        typeof value === "string" &&
        (SPAIN_TERM_RE.test(value) || VOSOTROS_RE.test(value) || VOSEO_RE.test(value))
      ) {
        spainHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && BARE_GRADO_N_RE.test(value)) {
        bareGradeHits.push(`${rel}:${key}`);
      }
      if (!baseLeaves.has(key)) orphanKeys.push(`${rel}:${key}`);
      else if (baseLeaves.get(key) === value) identicalOverrides.push(`${rel}:${key}`);
      else {
        const baseVal = baseLeaves.get(key);
        if (typeof baseVal !== "string") typeMismatches.push(`${rel}:${key}`);
        else {
          const pa = ((value.match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
          const pb = (((baseVal.match(PLACEHOLDER_RE) || []).slice().sort()).join("|"));
          if (pa !== pb) placeholderMismatches.push(`${rel}:${key}`);
        }
      }
    }
    const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
    if (assessment.isNearFullCopy) nearFullCopies.push(rel);
  }

  assert.deepEqual(emptyFiles, [], "empty overrides");
  assert.deepEqual(extraFiles, [], "files without es-419 authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(typeMismatches, [], "type mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(spainHits, [], "Spain/vosotros/voseo terms");
  assert.deepEqual(bareGradeHits, [], "bare Grado N labels");
});

test("es-US pack grade labels and bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), US_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, {
    g12: "1.er–2.º grado",
    g34: "3.er–4.º grado",
    g56: "5.º–6.º grado",
  });

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Matemáticas — 1.er grado");
  assert.equal(titles.meta["english.g6"].bookTitle, "Inglés — 6.º grado");
  assert.equal(titles.meta["science.g3"].bookTitle, "Ciencias — 3.er grado");
  assert.doesNotMatch(JSON.stringify(titles), BARE_GRADO_N_RE);

  const demo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(demo.grades), US_GRADES);
  assert.match(demo.worksheet?.pageTitle || "", /Hoja de trabajo/);
  assert.doesNotMatch(JSON.stringify(demo), /Hoja de actividades/);

  const teacherGrade = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "global-burn-down/lib__teacher-portal__teacher-class-grade.json"
      ),
      "utf8"
    )
  );
  assert.deepEqual(Object.values(teacherGrade.copy), US_GRADES);

  const seoPack = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/lib__site__public-page-seo.json"),
      "utf8"
    )
  );
  assert.match(seoPack.copy.leo_kids_practice_for_elementary_learners, /Estados Unidos/);
  assert.match(
    seoPack.copy.digital_practice_for_elementary_learners_in_math_geometry_english_and_sc,
    /escuela primaria/
  );
  assert.match(seoPack.copy.teacher_portal_leo_kids, /docente/);
});

test("es-US help overlays parse and remap grade / celular chrome", async () => {
  const help = await import(`../../data/help-center/es-US/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/es-419/parents.js");
  assert.equal(
    help.ALL_ARTICLES_ES_US.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/es-419/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/es-419/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/es-419/subjects.js")).SUBJECT_ARTICLES.length
  );

  const welcome = help.BY_SECTION_ES_US.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /1\.er a 6\.º grado/);
  assert.match(JSON.stringify(welcome), /escuela primaria/);
  assert.match(JSON.stringify(welcome), /padres, madres o tutores/);
  assert.doesNotMatch(JSON.stringify(welcome), BARE_GRADO_N_RE);

  const addStudents = help.BY_SECTION_ES_US.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /1\.er a 6\.º/);
  assert.match(JSON.stringify(addStudents), /1\.er grado — grade_1/);
  assert.match(JSON.stringify(addStudents), /6\.º grado — grade_6/);

  const mobile = help.BY_SECTION_ES_US.parents.find((a) => a.slug === "mobile-and-offline");
  assert.equal(mobile.title, "Celular y juegos sin conexión");
  assert.match(JSON.stringify(mobile), /celular/);
  assert.doesNotMatch(JSON.stringify(mobile), /\bmóvil\b/);

  const choose = help.BY_SECTION_ES_US.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.match(choose.summary, /1\.er a 6\.º grado/);

  const math = help.BY_SECTION_ES_US.subjects.find((a) => a.slug === "math");
  assert.match(math.summary, /1\.er a 6\.º grado/);
  assert.match(JSON.stringify(math), /escuela primaria/);

  const helpBlob = JSON.stringify(help.ALL_ARTICLES_ES_US);
  assertNoSpainOrVoseo(helpBlob, "help-center/es-US");
});

test("es-US does not ship word-meanings overlay; English learning chrome preserved", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);

  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.ok(!("words" in booksUi));
  assert.ok(!("phonics" in booksUi));
  assert.ok(!("spelling" in booksUi));

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  for (const key of Object.keys(titles.meta || {})) {
    if (key.startsWith("english.")) {
      assert.match(titles.meta[key].bookTitle, /^Inglés —/);
    }
  }
});

test("es-US other locales and shared runtime unmodified by this layer", () => {
  for (const rel of FORBIDDEN_TOUCH_GLOBS) {
    const abs = path.join(ROOT, rel);
    assert.ok(fs.existsSync(abs), rel);
  }
  // Contract: this agent must not create /us wiring or English US path.
  assert.equal(fs.existsSync(path.join(ROOT, "locales/en-US")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs/en-US")), false);
});
