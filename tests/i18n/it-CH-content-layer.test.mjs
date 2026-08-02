/**
 * it-CH (Switzerland Italian / Ticino) sparse content-layer checks.
 * Base authority: it-IT. Fallback planned: it-CH → it-IT → en.
 * Mapping: grade1–5 → 1ª–5ª elementare; grade6 → 1ª media.
 * No registry wiring, build, or full suite.
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
const LOCALE = "it-CH";
const BASE = "it-IT";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** Italy primaria/secondaria labels that must not remain in Swiss overlays. */
const FOREIGN_GRADE_RE =
  /\bprimaria\b|\bsecondaria\b|1ª–6ª elementare|1a–6a elementare|6ª elementare|6a elementare|1ª–6ª primaria|scuola primaria/;
const CH_GRADES = [
  "1ª elementare",
  "2ª elementare",
  "3ª elementare",
  "4ª elementare",
  "5ª elementare",
  "1ª media",
];
const DE_FR_LEAK_RE =
  /\b(Primarschule|Grundschule|Schulstufe|Klasse wählen|année scolaire|Choisis|téléphone|enseignant)\b|ß/;

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

test("it-CH locale namespaces parse and stay sparse vs it-IT", () => {
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
    assert.equal(DE_FR_LEAK_RE.test(blob), false, `de/fr leak in ${file}`);
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

test("it-CH grade mapping 1ª–5ª elementare / 1ª media (not Italy primaria)", () => {
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

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /scuola elementare|allievi/);
  assert.match(seo.learningDescription, /1ª elementare.*1ª media|1ª media/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, FOREIGN_GRADE_RE);
  assert.match(allLocaleText, /1ª elementare/);
  assert.match(allLocaleText, /1ª media/);
  assert.match(allLocaleText, /scuola elementare|anno scolastico|classe attuale|tutte le classi/i);
});

test("it-CH school: classe vs sezione; no classe fisica", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.match(school.portal?.classesSubtitle || "", /anno scolastico/);
  assert.match(school.portal?.classesSubtitle || "", /sezione/);
  assert.match(school.portal?.classesSubtitle || "", /1ª elementare.*1ª media|1ª media/);
  assert.equal(school.portal?.choosePhysicalClass, "Selezioni la sezione");
  assert.match(school.portal?.createStudentClass || "", /Sezione|gruppo classe/);
  assert.doesNotMatch(JSON.stringify(school), /classe fisica/i);
  assert.equal(school.portal?.chooseGrade, "Selezioni la classe");
});

test("it-CH worksheets use scheda di lavoro + Lei; child learning inherits tu", () => {
  const worksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8")
  );
  assert.match(worksheets.hubIntro, /scheda di lavoro/);
  assert.match(worksheets.createHint, /Selezioni|crei/);
  assert.match(worksheets.createHint, /scheda di lavoro/);
  assert.doesNotMatch(worksheets.createHint, /\bScegli\b/);

  const itLearning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "learning.json"), "utf8"));
  assert.match(itLearning.chooseGrade, /^Scegli /);
});

test("it-CH parent report copy.grade inherits Classe from it-IT (no identical local leaf)", () => {
  const leafPath = path.join(
    ROOT,
    "content-packs",
    LOCALE,
    "reports/burn-down/components__parent-report-detailed-surface.json"
  );
  assert.equal(fs.existsSync(leafPath), false, "identical surface leaf must be pruned");
  const base = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        BASE,
        "reports/burn-down/components__parent-report-detailed-surface.json"
      ),
      "utf8"
    )
  );
  assert.equal(base.copy?.grade, "Classe");
  const index = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "reports/burn-down-index.json"), "utf8")
  );
  assert.equal(index["components__parent-report-detailed-surface"], undefined);
  assert.ok(index["utils__parent-report-language__grade-aware-recommendation-templates"]);
});

test("it-CH Swiss Italian terminology: telefono cellulare; docente; e-mail inherited", () => {
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.match(auth.registration?.teacher?.phoneLabel || "", /telefono cellulare/i);
  assert.match(auth.registration?.teacher?.explanationHint || "", /docente|rappresentante legale/);
  assert.doesNotMatch(JSON.stringify(auth), /\bHandy\b|\bportable\b/i);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.parent?.selectGrade || "", /classe/i);
  assert.match(ui.parent?.allowGradePicker || "", /allievo/);
});

test("it-CH content packs sparse contract vs it-IT", () => {
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
  assert.deepEqual(extraFiles, [], "files without it-IT authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(foreignGradeHits, [], "Italy primaria/secondaria must not remain");
});

test("it-CH pack grade labels use elementare/media bands", () => {
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.deepEqual(Object.values(booksUi.grades), CH_GRADES);

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewards.gradeBands, {
    g12: "1ª–2ª elementare",
    g34: "3ª–4ª elementare",
    g56: "5ª elementare–1ª media",
  });

  const titles = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json"), "utf8")
  );
  assert.equal(titles.meta["math.g1"].bookTitle, "Matematica — 1ª elementare");
  assert.equal(titles.meta["math.g2"].bookTitle, "Matematica — 2ª elementare");
  assert.equal(titles.meta["english.g6"].bookTitle, "Inglese — 1ª media");
  assert.doesNotMatch(JSON.stringify(titles), FOREIGN_GRADE_RE);
  assert.doesNotMatch(JSON.stringify(titles), /6ª elementare|6a elementare/);
});

test("it-CH help overlays parse and remap Italy grades to Ticino", async () => {
  const help = await import(`../../data/help-center/it-CH/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/it-IT/parents.js");
  assert.equal(
    help.ALL_ARTICLES_IT_CH.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/it-IT/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/it-IT/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/it-IT/subjects.js")).SUBJECT_ARTICLES.length
  );

  const welcome = help.BY_SECTION_IT_CH.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /1ª elementare/);
  assert.match(JSON.stringify(welcome), /1ª media/);
  assert.match(JSON.stringify(welcome), /scuola elementare/);
  assert.doesNotMatch(JSON.stringify(welcome), FOREIGN_GRADE_RE);

  const addStudents = help.BY_SECTION_IT_CH.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /selezioni una classe/i);
  assert.match(JSON.stringify(addStudents), /1ª elementare/);
  assert.match(JSON.stringify(addStudents), /1ª media/);
  assert.doesNotMatch(JSON.stringify(addStudents), FOREIGN_GRADE_RE);

  const choose = help.BY_SECTION_IT_CH.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.match(JSON.stringify(choose), /\bScegli\b/);
  assert.match(JSON.stringify(choose), /tua classe/);
  assert.doesNotMatch(JSON.stringify(choose), /tuo classe/);

  const math = help.BY_SECTION_IT_CH.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /1ª elementare alla 1ª media/);
  assert.match(JSON.stringify(math), /Selezioni una classe/);
  assert.doesNotMatch(JSON.stringify(math), /1ª primaria|1ª secondaria/);
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

const PUBLIC_ES_RE =
  /\b(para|nuevos|Salir|cajas|cartas|No hay|Mundo Kids|Tiempo|Se acabo|Probar|Descartar|Bienvenido|Jugador|habitacion|disponibles para|sin registrarte)\b/i;
const PUBLIC_EN_REPORT_RE =
  /\b(Not available|Insufficient\b|Practice with|reference table|unit choice|Overall picture|Book reading|Still needs)\b|^Keep |^Do not provide |for grades [0-9]/;

test("it-CH demo merged runtime: Italian chrome + Ticino grades", () => {
  const base = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs", BASE, "demo/ui.json"), "utf8"));
  const overlay = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  const demo = deepMerge(base, overlay);
  assert.equal(demo.bar.playExpired, "Il tempo è scaduto. Puoi ricominciare.");
  assert.equal(demo.bar.playTime, "Tempo di gioco");
  assert.equal(demo.bar.exitDemo, "Esci dalla demo");
  assert.equal(demo.bar.changeGrade, "Cambia classe");
  assert.equal(demo.enter.pageDescription, "Prova il mondo dei bambini senza registrarti.");
  assert.match(demo.enter.activeSessionNote, /cambiare classe/);
  assert.deepEqual(Object.values(demo.grades), CH_GRADES);
  assert.doesNotMatch(JSON.stringify(demo), FOREIGN_GRADE_RE);
  assert.doesNotMatch(JSON.stringify(demo), PUBLIC_ES_RE);
});

test("it-CH rewards/cards merged runtime: Italian chrome; placeholders preserved", () => {
  const base = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, "rewards/ui.json"), "utf8")
  );
  const overlay = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  const rewards = deepMerge(base, overlay);
  assert.equal(rewards.surpriseBox.readyMultiple, "{count} scatole pronte da aprire!");
  assert.equal(rewards.shopView.empty, "Al momento non ci sono carte disponibili da acquistare.");
  assert.equal(rewards.cardsPage.kidsWorldBack, "Mondo dei bambini");
  assert.equal(rewards.cardsPage.catalogEmpty, "Non ci sono carte da mostrare.");
  assert.deepEqual(rewards.gradeBands, {
    g12: "1ª–2ª elementare",
    g34: "3ª–4ª elementare",
    g56: "5ª elementare–1ª media",
  });
  assert.match(rewards.shop.coinsLabel, /\{amount\}/);
  assert.doesNotMatch(JSON.stringify(rewards), PUBLIC_ES_RE);
});

test("it-CH books shell merged runtime: no Spanish mash", () => {
  const base = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs", BASE, "books/ui.json"), "utf8"));
  const overlay = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  const books = deepMerge(base, overlay);
  assert.equal(books.shell.emptyPageContent, "Nessun contenuto da mostrare in questa pagina.");
  assert.match(books.shell.indexSubtitle, /e leggi/);
  assert.match(books.shell.pageOfTotal, /Pagina \{current\} di \{total\}/);
  assert.deepEqual(Object.values(books.grades), CH_GRADES);
  assert.doesNotMatch(books.shell.emptyPageContent, PUBLIC_ES_RE);
});

test("it-CH parent-report detailed surface merged: Italian chrome; grade=Classe", () => {
  const base = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        BASE,
        "reports/burn-down/components__parent-report-detailed-surface.json"
      ),
      "utf8"
    )
  );
  const leafPath = path.join(
    ROOT,
    "content-packs",
    LOCALE,
    "reports/burn-down/components__parent-report-detailed-surface.json"
  );
  const overlay = fs.existsSync(leafPath) ? JSON.parse(fs.readFileSync(leafPath, "utf8")) : {};
  const merged = deepMerge(base, overlay);
  assert.equal(merged.copy.grade, "Classe");
  assert.equal(merged.copy.practice_with_questions, "Esercitazione con domande");
  assert.equal(merged.copy.accuracy, "Precisione");
  assert.doesNotMatch(JSON.stringify(merged.copy), PUBLIC_EN_REPORT_RE);
  assert.doesNotMatch(JSON.stringify(merged.copy), /\bGrade\b|\bNot available\b|\bPractice with\b/);
});

test("it-CH parent-report display labels merged: Italian user-facing labels", () => {
  const base = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        BASE,
        "reports/burn-down/utils__parent-report-language__parent-report-display-labels.json"
      ),
      "utf8"
    )
  );
  const leafPath = path.join(
    ROOT,
    "content-packs",
    LOCALE,
    "reports/burn-down/utils__parent-report-language__parent-report-display-labels.json"
  );
  assert.equal(fs.existsSync(leafPath), false, "identical display-labels leaf must be pruned");
  const labels = deepMerge(base, {}).copy;
  assert.equal(labels.not_available, "Non disponibile");
  assert.equal(labels.practice, "Esercitazione");
  assert.equal(labels.insufficient, "Insufficiente");
  assert.doesNotMatch(JSON.stringify(labels), PUBLIC_EN_REPORT_RE);
});

test("it-CH grade-aware report pack: full Italian + elementare/media bands", () => {
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
  const base = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        BASE,
        "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
      ),
      "utf8"
    )
  );
  const copy = deepMerge(base, pack).copy || deepMerge(base, pack);
  const blob = Object.values(copy).join("\n");
  assert.equal(Object.keys(pack.copy || pack).length, 121);
  assert.match(blob, /1ª–2ª elementare/);
  assert.match(blob, /3ª–4ª elementare/);
  assert.match(blob, /5ª elementare–1ª media/);
  assert.match(blob, /\b1ª media\b/);
  assert.match(blob, /numeri primi e composti|conversione delle unità|tabella di riferimento/i);
  assert.doesNotMatch(blob, /5ª–6ª elementare|6ª elementare|primaria|secondaria/);
  assert.doesNotMatch(blob, PUBLIC_EN_REPORT_RE);
  assert.match(blob, /si concentri|chieda a Suo figlio|Mantenere nulle|Non fornire/);
});

test("it-CH common.accessDenied inherits Lei from it-IT; local grades stay Ticino", () => {
  const base = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8"));
  const overlay = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8")
  );
  const merged = deepMerge(base, overlay);
  assert.equal(merged.accessDenied, "Non ha accesso a questa pagina.");
  assert.equal(merged.accessDenied, base.accessDenied);
  assert.equal(overlay.accessDenied, undefined);
  assert.deepEqual(
    [merged.grade1, merged.grade2, merged.grade3, merged.grade4, merged.grade5, merged.grade6],
    CH_GRADES
  );
});

test("it-CH focused public Spanish/English chrome scan = 0", () => {
  /** @type {string[]} */
  const hits = [];
  const targets = [
    ["demo", "content-packs", "demo/ui.json"],
    ["rewards", "content-packs", "rewards/ui.json"],
    ["books", "content-packs", "books/ui.json"],
    [
      "surface",
      "content-packs",
      "reports/burn-down/components__parent-report-detailed-surface.json",
    ],
    [
      "labels",
      "content-packs",
      "reports/burn-down/utils__parent-report-language__parent-report-display-labels.json",
    ],
    [
      "grade-aware",
      "content-packs",
      "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json",
    ],
  ];
  for (const [label, root, rel] of targets) {
    const base = JSON.parse(fs.readFileSync(path.join(ROOT, root, BASE, rel), "utf8"));
    const chPath = path.join(ROOT, root, LOCALE, rel);
    const overlay = fs.existsSync(chPath) ? JSON.parse(fs.readFileSync(chPath, "utf8")) : {};
    const merged = deepMerge(base, overlay);
    for (const [key, value] of collectStringLeaves(merged)) {
      if (PUBLIC_ES_RE.test(value) || PUBLIC_EN_REPORT_RE.test(value)) {
        hits.push(`${label}:${key}=${value}`);
      }
    }
  }
  assert.deepEqual(hits, [], `public chrome hits:\n${hits.slice(0, 30).join("\n")}`);
});

test("it-CH does not ship word-meanings, science overlay, learning-content, or books copies", () => {
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`)),
    false
  );
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-it-CH-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "utils/learning-content-it-CH")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/it-CH")), false);

  const skills = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "books/english-page-skills.json"),
      "utf8"
    )
  );
  assert.match(skills.grades.g6.grammar_comparatives.description, /the best \/ the most interesting/);
  assert.match(skills.grades.g6.grammar_comparatives.description, /1ª media/);
  assert.doesNotMatch(skills.grades.g6.grammar_comparatives.description, /\breinforce\b/);
});

test("it-CH child/adult address: no tu/Lei mix in same string; no German/French leak", () => {
  /** @type {string[]} */
  const mixed = [];
  const MIX_RE =
    /\b(Scegli|Puoi|Hai)\b.*\b(Selezioni|Scelga|Può)\b|\b(Selezioni|Scelga|Può)\b.*\b(Scegli|Puoi|Hai)\b/s;

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
  assert.deepEqual(mixed, []);

  const joined = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((r) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, r), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((r) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, r), "utf8")
    ),
  ].join("\n");
  assert.doesNotMatch(joined, DE_FR_LEAK_RE);
  assert.doesNotMatch(joined, FOREIGN_GRADE_RE);
});

test("isolation: it-CH pruning did not modify it-IT; de-CH untouched; Italy grades intact", () => {
  // Hygiene must pass on a clean tree: tracked it-CH files + runtime grade split prove isolation.
  // Dirty porcelain is optional — when present, it-IT must stay out of an it-CH-only task.
  const trackedItCh = execFileSync(
    "git",
    [
      "ls-files",
      "--",
      "locales/it-CH",
      "content-packs/it-CH",
      "data/help-center/it-CH",
      "tests/i18n/it-CH-content-layer.test.mjs",
    ],
    { cwd: ROOT, encoding: "utf8" }
  )
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  assert.ok(trackedItCh.length > 0, "it-CH files must be tracked in git");
  assert.ok(
    trackedItCh.some((p) => p.startsWith("locales/it-CH/")),
    "tracked locales/it-CH expected"
  );
  assert.ok(
    trackedItCh.some((p) => p.startsWith("content-packs/it-CH/")),
    "tracked content-packs/it-CH expected"
  );
  assert.ok(
    trackedItCh.includes("tests/i18n/it-CH-content-layer.test.mjs"),
    "tracked it-CH content-layer test expected"
  );

  const deChStatus = execFileSync(
    "git",
    [
      "status",
      "--porcelain",
      "--",
      "locales/de-CH",
      "content-packs/de-CH",
      "data/help-center/de-CH",
    ],
    { cwd: ROOT, encoding: "utf8" }
  ).trim();
  assert.equal(deChStatus, "", `unexpected de-CH changes:\n${deChStatus}`);

  const itCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8"));
  assert.equal(itCommon.grade1, "1ª primaria");
  assert.equal(itCommon.grade2, "2ª primaria");
  assert.equal(itCommon.grade3, "3ª primaria");
  assert.equal(itCommon.grade4, "4ª primaria");
  assert.equal(itCommon.grade5, "5ª primaria");
  assert.equal(itCommon.grade6, "1ª secondaria");
  assert.equal(itCommon.accessDenied, "Non ha accesso a questa pagina.");

  const chCommon = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8")
  );
  assert.equal(chCommon.grade1, "1ª elementare");
  assert.equal(chCommon.grade2, "2ª elementare");
  assert.equal(chCommon.grade3, "3ª elementare");
  assert.equal(chCommon.grade4, "4ª elementare");
  assert.equal(chCommon.grade5, "5ª elementare");
  assert.equal(chCommon.grade6, "1ª media");
  assert.equal(chCommon.accessDenied, undefined);

  const porcelain = execFileSync("git", ["status", "--porcelain"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();

  if (porcelain) {
    const lines = porcelain.split(/\r?\n/).filter(Boolean);
    const itItHits = lines.filter((line) =>
      /(?:^|[\s])(?:locales|content-packs|data\/help-center)\/it-IT\b/.test(line)
    );
    assert.deepEqual(
      itItHits,
      [],
      `it-CH isolation must not leave unexpected it-IT porcelain:\n${itItHits.join("\n")}`
    );

    const chRelevant = lines.filter((line) =>
      /(?:locales|content-packs|data\/help-center)\/it-CH\b|tests\/i18n\/it-CH-content-layer\.test\.mjs/.test(
        line
      )
    );
    for (const line of chRelevant) {
      assert.doesNotMatch(
        line,
        /locales\/it-IT|content-packs\/it-IT|data\/help-center\/it-IT/,
        `it-CH porcelain must not touch it-IT: ${line}`
      );
    }
  }
});
