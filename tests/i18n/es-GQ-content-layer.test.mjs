/**
 * es-GQ (Equatorial Guinea Spanish) sparse content-layer checks.
 * No registry wiring, build, or full suite.
 *
 * Authority: PRODEGE Anuario Estadístico de la Educación (MEC / Guinea Ecuatorial)
 * — Educación Primaria = 6 grados (1er–6to); grado = año escolar; clase/aula = grupo.
 * Regional Spanish: Equatoguinean (peninsular lexicon lean; no voseo; no sole-language claim).
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
const LOCALE = "es-GQ";
const BASE = "es-419";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const VOSOTROS_RE = /\bvosotros\b|\b(estáis|tenéis|queréis|podéis|hacéis|sois)\b/i;
const VOSEO_RE = /\b(vos|tenés|querés|podés|sabés|decís|venís|sos)\b/i;
/** Spain primary-year labels and US/LATAM worksheet/mobile leakage to avoid. */
const SPAIN_GRADE_RE = /\bcurso\s+[1-6]\b|\b[1-6]\.º\s+de\s+Primaria\b/i;
const LATAM_US_LEAK_RE =
  /\b(México|Mexico|Colombia|Argentina|Perú|Peru|Estados Unidos|España)\b|\bcelular\b|\bhoja de trabajo\b|\b1\.er grado\b|\b2\.º grado\b/i;
const BARE_GRADO_N_RE = /\bGrado [1-6]\b/;
/** Forbidden product-band chrome labels (UI band names / badges / filters). */
const LEGACY_BAND_RE = /Grados\s+[1-6]\s*[–-]\s*[1-6]/;
/** Natural descriptive prose inside full sentences (not band chrome). */
const DESCRIPTIVE_GRADE_PROSE_RE =
  /\b(?:para|de|en)\s+los\s+grados\s+[1-6]\s+y\s+[1-6]\b|\bpara\s+grados\s+[1-6]\s*-\s*[1-6]\b|\bde\s+grados\s+[1-6]\s*-\s*[1-6]\b/i;
const SOLE_LANGUAGE_RE =
  /única lengua|único idioma|solo idioma|sola lengua|el idioma de Guinea|Spanish is the only|only language/i;
const GQ_GRADES = [
  "1er grado",
  "2do grado",
  "3er grado",
  "4to grado",
  "5to grado",
  "6to grado",
];
const GQ_BANDS = {
  g12: "1er–2do grado",
  g34: "3er–4to grado",
  g56: "5to–6to grado",
};
const GQ_GAME_BANDS = {
  grades_1_2: "1er–2do grado",
  grades_3_4: "3er–4to grado",
  grades_5_6: "5to–6to grado",
};

/** Paths outside the es-GQ content agent contract that must stay untouched. */
const FORBIDDEN_TOUCH_GLOBS = [
  "locales/es-419",
  "locales/es-ES",
  "locales/en",
  "locales/es-MX",
  "locales/es-US",
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
 * @param {string} label
 */
function assertNoSpainLatamOrPronounLeak(blob, label) {
  assert.equal(VOSOTROS_RE.test(blob), false, `vosotros in ${label}`);
  assert.equal(VOSEO_RE.test(blob), false, `voseo in ${label}`);
  assert.equal(SPAIN_GRADE_RE.test(blob), false, `Spain grade terminology in ${label}`);
  assert.equal(LATAM_US_LEAK_RE.test(blob), false, `Spain/LATAM/US leakage in ${label}`);
  assert.equal(SOLE_LANGUAGE_RE.test(blob), false, `sole-language claim in ${label}`);
}

test("es-GQ locale namespaces parse and stay sparse vs es-419", () => {
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
  assert.ok(files.includes("school.json"));

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
    assertNoSpainLatamOrPronounLeak(blob, file);
    assert.equal(BARE_GRADO_N_RE.test(blob), false, `bare Grado N in ${file}`);
    assert.equal(LEGACY_BAND_RE.test(blob), false, `legacy Grados N–N in ${file}`);
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

test("es-GQ authority-backed grade mapping 1er–6to grado", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    GQ_GRADES
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
    GQ_GRADES
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
    GQ_GRADES
  );
  assert.match(worksheets.createHint, /nivel de dificultad/);
  assert.match(worksheets.createHint, /\bgrado\b/);
  assert.doesNotMatch(worksheets.createHint, /\bcurso\b/);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Guinea Ecuatorial/);
  assert.match(seo.homeDescription, /padres, madres o tutores/);
  assert.match(seo.learningDescription, /1er a 6to grado/);
  assert.doesNotMatch(seo.homeTitle, SOLE_LANGUAGE_RE);
  assert.doesNotMatch(seo.homeDescription, SOLE_LANGUAGE_RE);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assertNoSpainLatamOrPronounLeak(allLocaleText, "locales/es-GQ");
  assert.match(allLocaleText, /1er grado/);
  assert.match(allLocaleText, /6to grado/);
  assert.match(allLocaleText, /2do grado/);
  assert.match(allLocaleText, /4to grado/);
  assert.match(allLocaleText, /Educación Primaria/);
  assert.match(allLocaleText, /padre, madre o tutor/);
  assert.match(allLocaleText, /nivel de dificultad/);
});

test("es-GQ grade/course/year vs class/group and nivel de dificultad", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.match(school.portal?.classesSubtitle || "", /1er a 6to grado/);
  assert.match(school.portal?.classesSubtitle || "", /clase \(grupo/);
  assert.match(school.portal?.classesSubtitle || "", /\bgrado\b/);
  assert.equal(school.portal?.choosePhysicalClass, "Elegir clase (grupo)");
  assert.match(school.portal?.createStudentClass || "", /grupo de alumnos/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /clase escolar/);

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.match(teacher.dashboard?.createClassPlaceholder || "", /3er grado/);
  assert.match(teacher.dashboard?.createClassPlaceholder || "", /Grupo/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.public?.about?.intro1 || "", /nivel de dificultad/);
  assert.match(ui.public?.about?.intro1 || "", /\bgrado\b/);
  assert.match(ui.public?.about?.intro1 || "", /1er a 6to grado/);
  assert.match(ui.public?.about?.intro1 || "", /Guinea Ecuatorial/);
  assert.match(ui.public?.about?.intro1 || "", /bandas 1er–2do, 3er–4to y 5to–6to grado/);
  assert.match(ui.public?.about?.intro1 || "", /grupos de práctica de Leo Kids/);
  assert.match(ui.public?.about?.intro1 || "", /ciclos oficiales \(grados 1–3 y 4–6\)/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", /\bcurso\b/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", SOLE_LANGUAGE_RE);

  const worksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8")
  );
  assert.match(worksheets.createHint, /nivel de dificultad/);
});

test("es-GQ country framing on home, about, and Help welcome", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home?.subhead || "", /Guinea Ecuatorial/);
  assert.match(ui.home?.subhead || "", /Educación Primaria/);
  assert.match(ui.home?.subhead || "", /[Pp]ráctica en español|[Ee]n español/);
  assert.doesNotMatch(ui.home?.subhead || "", SOLE_LANGUAGE_RE);
  assert.match(ui.public?.about?.intro1 || "", /Guinea Ecuatorial/);
  assert.match(ui.public?.about?.intro1 || "", /práctica en español/);
});

test("es-GQ student / teacher / parent terminology and regional Spanish", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home?.subhead || "", /Educación Primaria/);
  assert.match(ui.home?.ctaParents || "", /padre, madre o tutor/);
  assert.equal(
    ui.installApp?.androidStep3,
    'En el móvil: toca "Agregar a la pantalla de inicio" en el menú del navegador'
  );
  assert.match(ui.installApp?.androidStep3 || "", /\bmóvil\b/);
  assert.doesNotMatch(ui.installApp?.androidStep3 || "", /\bcelular\b/);

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.match(auth.askParentOpenAccount, /padre, madre o tutor/);
  assert.match(auth.parentWelcomeBody, /padre, madre o tutor/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.match(JSON.stringify(school), /docente/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, /\bcelular\b/);
  assert.doesNotMatch(allLocaleText, /teléfono celular/i);
  assert.match(allLocaleText, /\bmóvil\b/);
  assert.doesNotMatch(allLocaleText, /\bhoja de trabajo\b/i);
  assert.doesNotMatch(allLocaleText, VOSOTROS_RE);
  assert.doesNotMatch(allLocaleText, VOSEO_RE);
});

test("es-GQ content packs sparse contract vs es-419", () => {
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
  const leakHits = [];
  /** @type {string[]} */
  const bareGradeHits = [];
  /** @type {string[]} */
  const legacyBandHits = [];
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
        if (
          SPAIN_GRADE_RE.test(value) ||
          LATAM_US_LEAK_RE.test(value) ||
          VOSOTROS_RE.test(value) ||
          VOSEO_RE.test(value) ||
          SOLE_LANGUAGE_RE.test(value)
        ) {
          leakHits.push(`${rel}:${key}`);
        }
        if (BARE_GRADO_N_RE.test(value)) bareGradeHits.push(`${rel}:${key}`);
        if (LEGACY_BAND_RE.test(value)) legacyBandHits.push(`${rel}:${key}`);
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
        (SPAIN_GRADE_RE.test(value) ||
          LATAM_US_LEAK_RE.test(value) ||
          VOSOTROS_RE.test(value) ||
          VOSEO_RE.test(value) ||
          SOLE_LANGUAGE_RE.test(value))
      ) {
        leakHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && BARE_GRADO_N_RE.test(value)) {
        bareGradeHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && LEGACY_BAND_RE.test(value)) {
        legacyBandHits.push(`${rel}:${key}`);
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
  assert.deepEqual(leakHits, [], "Spain/LATAM/US/vosotros/voseo/sole-language terms");
  assert.deepEqual(bareGradeHits, [], "bare Grado N labels");
  assert.deepEqual(legacyBandHits, [], "legacy Grados N–N band chrome");
});

test("es-GQ pack grade labels and bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), GQ_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, GQ_BANDS);

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Matemáticas — 1er grado");
  assert.equal(titles.meta["english.g6"].bookTitle, "Inglés — 6to grado");
  assert.equal(titles.meta["science.g3"].bookTitle, "Ciencias — 3er grado");
  assert.doesNotMatch(JSON.stringify(titles), BARE_GRADO_N_RE);

  const demo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(demo.grades), GQ_GRADES);

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
  assert.deepEqual(Object.values(teacherGrade.copy), GQ_GRADES);

  const seoPack = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/lib__site__public-page-seo.json"),
      "utf8"
    )
  );
  assert.match(seoPack.copy.leo_kids_practice_for_elementary_learners, /Guinea Ecuatorial/);
  assert.match(
    seoPack.copy.digital_practice_for_elementary_learners_in_math_geometry_english_and_sc,
    /Educación Primaria/
  );
  assert.match(seoPack.copy.teacher_portal_leo_kids, /docente/);
  assert.doesNotMatch(JSON.stringify(seoPack), SOLE_LANGUAGE_RE);
});

test("es-GQ games use local product band chrome (not Grados N–N)", () => {
  const gamesIndex = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "games/burn-down-index.json"), "utf8")
  );
  assert.deepEqual(gamesIndex["components__educational-games__leo-lab__leo-lab-data"], {
    grades_1_2: GQ_GAME_BANDS.grades_1_2,
  });
  assert.deepEqual(
    gamesIndex["components__educational-games__leo-word-detective__leo-word-detective-data"],
    GQ_GAME_BANDS
  );
  assert.deepEqual(
    gamesIndex["components__educational-games__leo-word-train__leo-word-train-data"],
    GQ_GAME_BANDS
  );

  for (const rel of [
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json",
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json",
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json",
  ]) {
    const leaf = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8"));
    const blob = JSON.stringify(leaf);
    assert.match(blob, /1er–2do grado/);
    assert.doesNotMatch(blob, LEGACY_BAND_RE);
    assert.doesNotMatch(blob, BARE_GRADO_N_RE);
  }

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, GQ_BANDS);
  const demo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(demo.grades), GQ_GRADES);
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), GQ_GRADES);
  assert.equal(
    fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "reports")),
    false,
    "no unjustified reports pack copy"
  );
});

test("es-GQ report grade phrases: descriptive prose retained; band chrome forbidden", () => {
  // es-GQ inherits es-419 reports (no local reports overlay). Audit the merged authority.
  const reportsRoot = path.join(ROOT, "content-packs", BASE, "reports");
  assert.ok(fs.existsSync(reportsRoot));

  /** @type {string[]} */
  const chromeHits = [];
  /** @type {string[]} */
  const proseHits = [];
  /** @type {string[]} */
  const bareBandLabelHits = [];

  for (const rel of listJsonRel(reportsRoot)) {
    const abs = path.join(reportsRoot, rel);
    const country = JSON.parse(fs.readFileSync(abs, "utf8"));
    for (const [key, value] of collectStringLeaves(country)) {
      if (typeof value !== "string") continue;
      if (LEGACY_BAND_RE.test(value)) chromeHits.push(`${rel}:${key}`);
      // Standalone band-label values (exact chrome), not sentence prose.
      if (/^Grados\s+[1-6]\s*[–-]\s*[1-6]$/.test(value.trim())) {
        bareBandLabelHits.push(`${rel}:${key}`);
      }
      if (DESCRIPTIVE_GRADE_PROSE_RE.test(value)) proseHits.push(`${rel}:${key}`);
    }
  }

  assert.deepEqual(chromeHits, [], "forbidden product-band chrome Grados N–N in reports");
  assert.deepEqual(bareBandLabelHits, [], "standalone Grados N–N band labels in reports");
  assert.ok(proseHits.length > 0, "expected retained descriptive prose like grados 1 y 2");

  // Spot-check natural sentence shapes (not band chrome).
  const templates = JSON.parse(
    fs.readFileSync(
      path.join(
        reportsRoot,
        "burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
      ),
      "utf8"
    )
  );
  const sample12 =
    templates.copy?.do_not_provide_formal_factors_multiples_recommendations_for_grades_1_2 || "";
  const sample34 =
    templates.copy?.this_week_focus_on_grade_3_4_mixed_hebrew_vocabulary_and_expressions_thr || "";
  const sample56 = templates.copy?.grade_5_6_graph_comparison_and_axis_based_reasoning || "";
  assert.match(sample12, /para los grados 1 y 2/);
  assert.match(sample34, /de los grados 3 y 4/);
  assert.match(sample56, /para los grados 5 y 6/);
  assert.doesNotMatch(sample12, LEGACY_BAND_RE);
  assert.doesNotMatch(sample34, LEGACY_BAND_RE);
  assert.doesNotMatch(sample56, LEGACY_BAND_RE);
  assert.notEqual(sample12.trim(), "Grados 1–2");
  assert.notEqual(sample12.trim(), GQ_BANDS.g12);

  // No conflict with official-cycle vs product-band explanation in public chrome.
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.public?.about?.intro1 || "", /grupos de práctica de Leo Kids/);
  assert.match(ui.public?.about?.intro1 || "", /ciclos oficiales \(grados 1–3 y 4–6\)/);
  assert.match(ui.public?.about?.intro1 || "", /1er–2do, 3er–4to y 5to–6to grado/);

  // Sparse decision: retain inherited prose; do not ship a reports overlay for it.
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "reports")), false);
});

test("es-GQ help overlays parse and remap grade chrome", async () => {
  const help = await import(`../../data/help-center/es-GQ/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/es-419/parents.js");
  assert.equal(
    help.ALL_ARTICLES_ES_GQ.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/es-419/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/es-419/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/es-419/subjects.js")).SUBJECT_ARTICLES.length
  );

  const welcome = help.BY_SECTION_ES_GQ.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /Guinea Ecuatorial/);
  assert.match(JSON.stringify(welcome), /1er a 6to grado/);
  assert.match(JSON.stringify(welcome), /Educación Primaria/);
  assert.match(JSON.stringify(welcome), /aprendizaje en español|práctica.*español/i);
  assert.match(JSON.stringify(welcome), /padres, madres o tutores/);
  assert.match(JSON.stringify(welcome), /bandas 1er–2do, 3er–4to y 5to–6to grado/);
  assert.match(JSON.stringify(welcome), /ciclos oficiales de primaria son grados 1–3 y 4–6/);
  assert.doesNotMatch(JSON.stringify(welcome), BARE_GRADO_N_RE);
  assert.doesNotMatch(JSON.stringify(welcome), SOLE_LANGUAGE_RE);

  const addStudents = help.BY_SECTION_ES_GQ.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /1er a 6to/);
  assert.match(JSON.stringify(addStudents), /1er grado — grade_1/);
  assert.match(JSON.stringify(addStudents), /6to grado — grade_6/);

  const choose = help.BY_SECTION_ES_GQ.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.match(choose.summary, /1er a 6to grado/);

  const math = help.BY_SECTION_ES_GQ.subjects.find((a) => a.slug === "math");
  assert.match(math.summary, /1er a 6to grado/);
  assert.match(JSON.stringify(math), /Educación Primaria/);

  const helpBlob = JSON.stringify(help.ALL_ARTICLES_ES_GQ);
  assertNoSpainLatamOrPronounLeak(helpBlob, "help-center/es-GQ");
  assert.doesNotMatch(helpBlob, SOLE_LANGUAGE_RE);
});

test("es-GQ does not ship word-meanings overlay; English learning chrome preserved", () => {
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

test("es-GQ other locales and shared runtime unmodified by this layer", () => {
  for (const rel of FORBIDDEN_TOUCH_GLOBS) {
    const abs = path.join(ROOT, rel);
    assert.ok(fs.existsSync(abs), rel);
  }
  // Contract: this agent must not create bare /gq wiring path content.
  assert.equal(fs.existsSync(path.join(ROOT, "locales/gq")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs/gq")), false);
});
