/**
 * fr-CH (Switzerland French / Suisse romande) sparse content-layer checks.
 * Base authority: fr-FR. Fallback planned: fr-CH → fr-FR → en.
 * HarmoS: grade1→3P … grade6→8P. No registry wiring, build, or full suite.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "fr-CH";
const BASE = "fr-FR";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** France / Canada / Belgium primary labels that must not remain in Swiss overlays. */
const FOREIGN_GRADE_RE =
  /\b(CP|CE1|CE2|CM1|CM2)\b|\b6e\b(?! année)|\bcollège\b|1re année|2e année(?! primaire)|1re–6e année|1re à 6e année|1re primaire|6e primaire/;
const CH_GRADES = ["3P", "4P", "5P", "6P", "7P", "8P"];

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

test("fr-CH locale namespaces parse and stay sparse vs fr-FR", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("ui.json"));
  assert.ok(files.includes("validation.json"));
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
    assert.equal(FOREIGN_GRADE_RE.test(blob), false, `foreign grade leak in ${file}`);
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

test("fr-CH grade terminology 3P–8P (HarmoS; not France/Canada/Belgium)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    CH_GRADES
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
    CH_GRADES
  );
  assert.equal(learning.chooseGrade, "Choisis une année");

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
    CH_GRADES
  );
  assert.equal(worksheets.selectGrade, "Année");
  assert.equal(worksheets.gradeField, "Année");
  assert.equal(worksheets.gradeFilterAll, "Toutes les années");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Suisse|degré primaire/);
  assert.match(seo.learningDescription, /3P à 8P/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, FOREIGN_GRADE_RE);
  assert.match(allLocaleText, /\b3P\b/);
  assert.match(allLocaleText, /\b8P\b/);
  assert.match(allLocaleText, /année scolaire|Choisissez une année|toutes les années/i);
});

test("fr-CH worksheets/learning/school use année; groupe-classe not classe physique", () => {
  const worksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8")
  );
  assert.equal(worksheets.gradeFilterAll, "Toutes les années");
  assert.match(worksheets.createHint, /fiche d’exercices|fiche d'exercices/);

  const learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  assert.equal(learning.master?.gradeFallback, "Année");
  assert.equal(learning.master?.currentGrade, "Année actuelle");
  assert.match(learning.master?.gradeRequired || "", /ta année scolaire/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal?.createStudentGrade, "Année");
  assert.equal(school.portal?.classMgmtGrade, "Année");
  assert.equal(school.portal?.assignCurrentGrade, "Année actuelle");
  assert.equal(school.portal?.assignTargetGrade, "Année cible");
  assert.match(school.portal?.classesSubtitle || "", /année scolaire/);
  assert.match(school.portal?.classesSubtitle || "", /groupe-classe/);
  assert.match(school.portal?.classesSubtitle || "", /3P à 8P/);
  assert.doesNotMatch(school.portal?.classesSubtitle || "", /classe physique/);
  assert.equal(school.portal?.chooseGrade, "Choisissez une année");
});

test("fr-CH parent report copy.grade is Année", () => {
  const leaf = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "reports/burn-down/components__parent-report-detailed-surface.json"
      ),
      "utf8"
    )
  );
  assert.equal(leaf.copy?.grade, "Année");
  const index = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "reports/burn-down-index.json"), "utf8")
  );
  assert.equal(index["components__parent-report-detailed-surface"]?.grade, "Année");
});

test("fr-CH Swiss French terminology: e-mail inherited; téléphone portable; enseignant", () => {
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.match(auth.registration?.teacher?.phoneLabel || "", /téléphone portable/i);
  assert.match(auth.registration?.teacher?.explanationHint || "", /enseignant|enseignante/);
  assert.doesNotMatch(JSON.stringify(auth), /cellulaire|courriel/i);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.parent?.selectGrade, "Choisir une année");

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.invalidGrade, /année/i);
});

test("fr-CH content packs sparse contract vs fr-FR", () => {
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
  const foreignGradeHits = [];
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
        if (FOREIGN_GRADE_RE.test(value)) foreignGradeHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && FOREIGN_GRADE_RE.test(value)) {
        foreignGradeHits.push(`${rel}:${key}`);
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
  assert.deepEqual(foreignGradeHits, [], "France/Canada/Belgium grade labels must not remain");
});

test("fr-CH pack grade labels use 3P–8P bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), CH_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, {
    g12: "3P–4P",
    g34: "5P–6P",
    g56: "7P–8P",
  });

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Mathématiques — 3P");
  assert.equal(titles.meta["math.g2"].bookTitle, "Mathématiques — 4P");
  assert.equal(titles.meta["english.g6"].bookTitle, "Anglais — 8P");
  assert.doesNotMatch(JSON.stringify(titles), FOREIGN_GRADE_RE);
});

test("fr-CH help overlays parse and remap France grade span to 3P–8P", async () => {
  const help = await import(`../../data/help-center/fr-CH/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/fr-FR/parents.js");
  assert.equal(
    help.ALL_ARTICLES_FR_CH.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/fr-FR/subjects.js")).SUBJECT_ARTICLES.length
  );

  const welcome = help.BY_SECTION_FR_CH.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /3e année primaire \(3P\)/);
  assert.match(JSON.stringify(welcome), /8e année primaire \(8P\)/);
  assert.doesNotMatch(JSON.stringify(welcome), FOREIGN_GRADE_RE);

  const addStudents = help.BY_SECTION_FR_CH.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /choisissez une année/);
  assert.match(JSON.stringify(addStudents), /3P à 8P/);
  assert.match(JSON.stringify(addStudents), /3P — grade_1/);
  assert.match(JSON.stringify(addStudents), /8P — grade_6/);
  assert.doesNotMatch(JSON.stringify(addStudents), FOREIGN_GRADE_RE);

  const choose = help.BY_SECTION_FR_CH.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.equal(choose.title, "Choisis une matière et une année");
  assert.match(JSON.stringify(choose), /ta année/);
  assert.doesNotMatch(JSON.stringify(choose), /ta classe/);

  const math = help.BY_SECTION_FR_CH.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /3P à la 8P/);
  assert.match(JSON.stringify(math), /année et un niveau de difficulté/);
  assert.doesNotMatch(JSON.stringify(math), /Choisissez une classe et un niveau/);
  assert.doesNotMatch(JSON.stringify(math), /du CP à la 6e/);
});

function deepMerge(base, overlay) {
  if (Array.isArray(overlay)) return overlay.slice();
  if (!overlay || typeof overlay !== "object") return overlay;
  const out = base && typeof base === "object" && !Array.isArray(base) ? { ...base } : {};
  for (const [k, v] of Object.entries(overlay)) {
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      out[k] &&
      typeof out[k] === "object" &&
      !Array.isArray(out[k])
    ) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

test("fr-CH demo: année + 3P–8P grades", () => {
  const demo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  assert.equal(demo.bar?.changeGrade, "Changer d’année");
  assert.equal(demo.bar?.gradeLabel, "Année");
  assert.match(demo.enter?.activeSessionNote || "", /changer d’année/);
  assert.doesNotMatch(demo.enter?.activeSessionNote || "", /changer de note/);
  assert.deepEqual(Object.values(demo.grades), CH_GRADES);
  assert.doesNotMatch(JSON.stringify(demo), FOREIGN_GRADE_RE);
});

test("fr-CH demo resolver: player + homepage false friends fixed", () => {
  const base = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, "demo/ui.json"), "utf8")
  );
  const overlay = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  const merged = deepMerge(base, overlay);

  assert.equal(merged.display.arcadePlayerName, "Joueur démo");
  assert.equal(merged.parentPortal.enterBackHome, "Retour à l’accueil");
  assert.notEqual(base.display.arcadePlayerName, merged.display.arcadePlayerName);
  assert.notEqual(base.parentPortal.enterBackHome, merged.parentPortal.enterBackHome);

  const demoBlob = JSON.stringify(overlay);
  assert.doesNotMatch(demoBlob, /Lecteur démo/);
  assert.doesNotMatch(demoBlob, /Retour à la maison/);
  assert.doesNotMatch(demoBlob, /Changer de note/);

  const mergedLeaves = collectStringLeaves(merged);
  /** @type {string[]} */
  const falseFriends = [];
  for (const [key, value] of mergedLeaves) {
    if (/Lecteur démo/i.test(value)) falseFriends.push(`${key}=${value}`);
    if (/Retour à la maison/i.test(value)) falseFriends.push(`${key}=${value}`);
    if (/Changer de note/i.test(value)) falseFriends.push(`${key}=${value}`);
    // lecteur = player; maison = homepage; note = grade (false-friend patterns)
    if (/\bLecteur\b/i.test(value) && /démo|demo|joueur|player/i.test(value)) {
      falseFriends.push(`${key}=${value}`);
    }
    if (/\bmaison\b/i.test(value) && /retour|accueil|home|page/i.test(value)) {
      falseFriends.push(`${key}=${value}`);
    }
  }
  assert.deepEqual(falseFriends, [], `demo false friends: ${falseFriends.join(" | ")}`);
});

test("fr-CH help students: tu conjugations (no vous forms)", async () => {
  const help = await import(`../../data/help-center/fr-CH/index.js?t=${Date.now() + 1}`);
  const students = help.BY_SECTION_FR_CH.students;
  const blob = JSON.stringify(students);
  assert.match(blob, /Ce que tu vois après/);
  assert.match(blob, /Ici, tu verras ton nom/);
  assert.match(blob, /que tu as choisi/);
  assert.match(blob, /Si tu as fait une erreur/);
  assert.match(blob, /Plus tu pratiques/);
  assert.match(blob, /Entraîne-toi et gagne des pièces/);
  assert.doesNotMatch(blob, /tu verrez/);
  assert.doesNotMatch(blob, /tu avez/);
  assert.doesNotMatch(blob, /tu pratiquez/);
  assert.doesNotMatch(blob, /gagnez des pièces/);
});

test("fr-CH grade-aware report pack: 3P–8P ranges", () => {
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
  assert.match(blob, /3P–4P/);
  assert.match(blob, /5P–6P/);
  assert.match(blob, /7P–8P/);
  assert.match(blob, /\b8P\b/);
  assert.doesNotMatch(blob, /niveaux 1 et 2/);
  assert.doesNotMatch(blob, FOREIGN_GRADE_RE);
});

test("fr-CH does not ship word-meanings, science overlay, learning-content, or books copies", () => {
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`)),
    false
  );
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-fr-CH-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "utils/learning-content-fr-CH")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/fr-CH")), false);

  const skills = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "books/english-page-skills.json"),
      "utf8"
    )
  );
  assert.match(skills.grades.g6.grammar_comparatives.description, /the best \/ the most interesting/);
  assert.match(skills.grades.g6.grammar_comparatives.description, /\b8P\b/);
  assert.doesNotMatch(skills.grades.g6.grammar_comparatives.description, /\breinforce\b/);
});

test("fr-CH child/adult register: no tu/vous mix; number-word policy = inherit fr-FR", () => {
  /** @type {string[]} */
  const mixed = [];
  const MIX_RE =
    /\b(Choisis|Clique|Essaie|Écris)\b.*\b(Vous|Sélectionnez)\b|\b(Vous|Sélectionnez)\b.*\b(Choisis|Clique|Essaie|Écris)\b/s;

  for (const rel of [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((r) => path.join("locales", LOCALE, r)),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((r) =>
      path.join("content-packs", LOCALE, r)
    ),
  ]) {
    const leaves = collectStringLeaves(
      JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"))
    );
    for (const [key, value] of leaves) {
      if (MIX_RE.test(value)) mixed.push(`${rel}:${key}`);
    }
  }

  const learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  assert.match(learning.chooseGrade, /^Choisis /);
  assert.match(learning.master?.gradeRequired || "", /\bta année scolaire\b|Demande /);
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.match(auth.registration?.teacher?.explanationHint || "", /\bvous\b/i);
  assert.deepEqual(mixed, []);

  const joined = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((r) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, r), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((r) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, r), "utf8")
    ),
  ].join("\n");
  assert.doesNotMatch(joined, /\bseptante\b|\bnonante\b|\bhuitante\b/);
});

test("regression: fr-FR / fr-CA / de-CH trees untouched by fr-CH worktree edits", () => {
  const status = execFileSync(
    "git",
    [
      "status",
      "--porcelain",
      "--",
      "locales/fr-FR",
      "locales/fr-CA",
      "locales/de-CH",
      "content-packs/fr-FR",
      "content-packs/fr-CA",
      "content-packs/de-CH",
      "data/help-center/fr-FR",
      "data/help-center/fr-CA",
      "data/help-center/de-CH",
    ],
    {
      cwd: ROOT,
      encoding: "utf8",
    }
  ).trim();
  assert.equal(status, "", `unexpected authority/sibling changes:\n${status}`);
});
