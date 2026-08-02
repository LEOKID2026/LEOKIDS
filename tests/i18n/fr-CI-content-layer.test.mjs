/**
 * fr-CI (Côte d’Ivoire) sparse content-layer checks.
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
const LOCALE = "fr-CI";
const BASE = "fr-FR";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const FRANCE_GRADE_RE = /\b(CP(?!1|2)|6e)\b/;
const CI_GRADES = ["CP1", "CP2", "CE1", "CE2", "CM1", "CM2"];

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

test("fr-CI locale namespaces parse and stay sparse vs fr-FR", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
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
    assert.ok(fs.existsSync(basePath), `missing ${BASE} authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    const blob = JSON.stringify(country);
    assert.equal(HEBREW_RE.test(blob), false, file);
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

test("fr-CI grade terminology CP1–CM2 (not France CP…6e)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    CI_GRADES
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
    CI_GRADES
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
    CI_GRADES
  );

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Côte d’Ivoire/);
  assert.match(seo.learningDescription, /CP1 à CM2/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, /\b6e\b/);
  assert.doesNotMatch(allLocaleText, /(?<!Côte d’)(?<!CP1–)(?<!CP1 )\bCP\b(?!1|2)/);
  assert.match(allLocaleText, /\bCP1\b/);
  assert.match(allLocaleText, /\bCP2\b/);
  assert.match(allLocaleText, /\bCM2\b/);
});

test("fr-CI content packs sparse contract vs fr-FR", () => {
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
        if (FRANCE_GRADE_RE.test(value)) franceGradeHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && FRANCE_GRADE_RE.test(value)) {
        franceGradeHits.push(`${rel}:${key}`);
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
  assert.deepEqual(franceGradeHits, [], "France CP/6e labels must not remain");
});

test("fr-CI pack grade labels use CP1–CM2 bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), CI_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, {
    g12: "CP1–CP2",
    g34: "CE1–CE2",
    g56: "CM1–CM2",
  });

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Mathématiques — CP1");
  assert.equal(titles.meta["math.g2"].bookTitle, "Mathématiques — CP2");
  assert.equal(titles.meta["english.g6"].bookTitle, "Anglais — CM2");
  assert.doesNotMatch(JSON.stringify(titles), /\b6e\b/);
  assert.doesNotMatch(JSON.stringify(titles), /— CP"/);
});

test("fr-CI help overlays parse and remap France grade span", async () => {
  const help = await import(`../../data/help-center/fr-CI/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/fr-FR/parents.js");
  assert.equal(
    help.ALL_ARTICLES_FR_CI.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_FR_CI.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_FR_CI.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /CP1 au CM2/);
  assert.doesNotMatch(JSON.stringify(welcome), /\b6e\b/);

  const addStudents = help.BY_SECTION_FR_CI.parents.find((a) => a.slug === "add-students");
  assert.match(JSON.stringify(addStudents), /CP1 à CM2/);
  assert.match(JSON.stringify(addStudents), /CP1 — grade_1/);
  assert.doesNotMatch(JSON.stringify(addStudents), /\b6e\b/);

  const math = help.BY_SECTION_FR_CI.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /CP1 au CM2/);
  assert.doesNotMatch(JSON.stringify(math), /du CP à la 6e/);

  const geometry = help.BY_SECTION_FR_CI.subjects.find((a) => a.slug === "geometry");
  assert.match(geometry.summary, /du CP1 au CM2/);
  assert.doesNotMatch(geometry.summary, /niveaux 1 à 6/);

  const science = help.BY_SECTION_FR_CI.subjects.find((a) => a.slug === "science");
  assert.match(science.summary, /du CP1 au CM2/);
  assert.doesNotMatch(science.summary, /niveaux 1 à 6/);
});

test("fr-CI demo false friends: classe / joueur / accueil", () => {
  const demo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  assert.equal(demo.bar?.changeGrade, "Changer de classe");
  assert.match(demo.enter?.activeSessionNote || "", /changer de classe/);
  assert.doesNotMatch(demo.enter?.activeSessionNote || "", /changer de note/);
  assert.equal(demo.display?.arcadePlayerName, "Joueur démo");
  assert.equal(demo.parentPortal?.enterBackHome, "Retour à l’accueil");
  assert.doesNotMatch(JSON.stringify(demo), /Lecteur démo/);
  assert.doesNotMatch(JSON.stringify(demo), /Retour à la maison/);
  assert.doesNotMatch(JSON.stringify(demo), /Changer de note/);
});

test("fr-CI help students: tu conjugations (no vous forms)", async () => {
  const help = await import(`../../data/help-center/fr-CI/index.js?t=${Date.now() + 1}`);
  const students = help.BY_SECTION_FR_CI.students;
  const blob = JSON.stringify(students);
  assert.match(blob, /Ce que tu vois après/);
  assert.match(blob, /que tu as choisi/);
  assert.match(blob, /Si tu as fait une erreur/);
  assert.match(blob, /Plus tu pratiques/);
  assert.match(blob, /Fais une pause si tu es fatigué/);
  assert.doesNotMatch(blob, /tu voyez/);
  assert.doesNotMatch(blob, /tu avez/);
  assert.doesNotMatch(blob, /tu pratiquez/);
  assert.doesNotMatch(blob, /tu êtes/);
  assert.doesNotMatch(blob, /\blisez\b/);
  assert.doesNotMatch(blob, /\bpassez\b/);
  assert.doesNotMatch(blob, /\bFaites une pause\b/);
});

test("fr-CI grade-aware report pack: math terms and CP1–CM2 ranges", () => {
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
  assert.match(blob, /CP1–CP2/);
  assert.match(blob, /CE1–CE2/);
  assert.match(blob, /CM1–CM2/);
  assert.doesNotMatch(blob, /niveaux 1 et 2/);
  assert.doesNotMatch(blob, /niveaux 3 et 4/);
  assert.doesNotMatch(blob, /\b6e\b/);
  assert.doesNotMatch(blob, /de 5e à 6e/);
});

test("fr-CI school portal: classe scolaire vs classe physique", () => {
  const school = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8")
  );
  assert.match(school.portal?.classesSubtitle || "", /classe scolaire/);
  assert.match(school.portal?.classesSubtitle || "", /classe physique/);
  assert.match(school.portal?.classesSubtitle || "", /CP1–CM2/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /Choisissez le niveau,/);
});

test("fr-CI does not ship word-meanings overlay or mutate English targets", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
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
});

test("fr-CI child/adult register: no tu/vous mix introduced in overlays", () => {
  const blobs = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((rel) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8")
    ),
  ].join("\n");
  // Overlay layer is mostly labels/SEO; ensure we did not introduce mixed address forms.
  assert.doesNotMatch(blobs, /\b(Choisis|Clique|Essaie|Écris)\b.*\b(Vous|Sélectionnez)\b/s);
  assert.doesNotMatch(blobs, /\b(Vous|Sélectionnez)\b.*\b(Choisis|Clique|Essaie|Écris)\b/s);
});
