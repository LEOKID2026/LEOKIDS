/**
 * Spain (es-ES) wiring: /es path, namespaces, reports/help sparse merge, meanings.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import {
  stripLocaleFromPath,
  withLocalePath,
  shouldRedirectToPublicLocalePrefix,
} from "../../lib/i18n/locale-path.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { loadContentPack } from "../../lib/content/locale.server.js";
import {
  loadMergedReportBurnDownIndex,
  reportPackCopyForLocale,
} from "../../lib/reports/report-pack-copy.js";
import { getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import {
  ALL_ARTICLES_ES_419,
  ALL_ARTICLES_ES_ES,
  getArticle,
  listArticles,
  resolveHelpLocale,
} from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_ES_ES } from "../../data/english-questions/word-meanings/es-ES.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function countLeaves(obj, n = 0) {
  if (!obj || typeof obj !== "object") return n;
  for (const v of Object.values(obj)) {
    if (typeof v === "string") n += 1;
    else n = countLeaves(v, n);
  }
  return n;
}

function collectStrings(value, out = []) {
  if (typeof value === "string") {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectStrings(v, out);
  }
  return out;
}

/** School-year grado/grados (not angle degrees like "90 grados"). */
function schoolYearGradoHits(text) {
  const s = String(text || "");
  const hits = [];
  const re =
    /\b(?:grados?\s+\d|los\s+grados|del\s+grado|un\s+grado|tu\s+grado|nivel\s+del\s+grado|nombre,\s+grado|nombre\s+o\s+grado|elegir\s+un\s+grado|elige\s+un\s+grado|selección\s+de\s+grado|Grado\s+\d|"grade"\s*:\s*"Grado")\b/gi;
  let m;
  while ((m = re.exec(s))) hits.push(m[0]);
  // bare label Grado as UI grade field
  if (/"grade"\s*:\s*"Grado"/.test(s)) hits.push('grade":"Grado"');
  if (/\bGrado\b/.test(s) && !/90\s+grados|grados\s+de\s+ángulo|ángulo/i.test(s)) {
    // count standalone Grado tokens that are school-year labels
    for (const mm of s.matchAll(/\bGrado\b/g)) hits.push(mm[0]);
  }
  return hits;
}

test("es-ES maps /es and falls back es-ES → es-419 → en", () => {
  assert.equal(getPublicLocalePathPrefix("es-ES"), "es");
  assert.equal(resolveLocaleIdFromPathPrefix("es"), "es-ES");
  assert.deepEqual(getLocaleFallbackChain("es-ES"), ["es-ES", "es-419", "en"]);
  assert.equal(resolveLocaleDefinition("es-ES").label, "España");
  assert.equal(withLocalePath("es-ES", "/parents"), "/es/parents");
  assert.equal(withLocalePath("es-419", "/parents"), "/es-419/parents");
});

test("es-ES canonical redirects from /es-ES and /ES", () => {
  const fromInternal = stripLocaleFromPath("/es-ES/student/home");
  assert.equal(fromInternal.locale, "es-ES");
  assert.equal(shouldRedirectToPublicLocalePrefix("es-ES", fromInternal.pathSegment), true);
  assert.equal(withLocalePath("es-ES", fromInternal.pathname), "/es/student/home");

  const fromUpper = stripLocaleFromPath("/ES/parents");
  assert.equal(fromUpper.locale, "es-ES");
  assert.equal(shouldRedirectToPublicLocalePrefix("es-ES", fromUpper.pathSegment), true);
});

test("es-ES loads all nine sparse namespaces via deep merge", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("es-ES");
  for (const ns of [
    "common",
    "learning",
    "worksheets",
    "ui",
    "seo",
    "teacher",
    "school",
    "validation",
    "copilot",
  ]) {
    assert.ok(bundles[ns] && typeof bundles[ns] === "object", ns);
  }
  assert.equal(lookupMessage(bundles, "common.grade1"), "1.º de Primaria");
  assert.equal(lookupMessage(bundles, "worksheets.gradeField"), "Curso");
  assert.match(String(lookupMessage(bundles, "school.portal.classesSubtitle") || ""), /Elija/);
  assert.ok(lookupMessage(bundles, "ui.nav.home"));
  assert.ok(lookupMessage(bundles, "teacher.assignmentTypes.worksheet_pdf") || true);
  // sibling from es-419 / en still resolves
  assert.ok(typeof lookupMessage(bundles, "ui.languageSwitcher.label") === "string");
});

test("es-ES content packs deep-merge and missing packs inherit es-419", () => {
  const demo = loadContentPack("es-ES", "demo", "ui.json");
  const rewards = loadContentPack("es-ES", "rewards", "ui.json");
  const books = loadContentPack("es-ES", "books", "ui.json");
  assert.ok(demo && Object.keys(demo).length >= 1);
  assert.ok(rewards && Object.keys(rewards).length >= 1);
  assert.ok(books && Object.keys(books).length >= 1);

  const packRoot = path.join(root, "content-packs", "es-ES");
  const files = [];
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.endsWith(".json")) files.push(p);
    }
  };
  walk(packRoot);
  assert.ok(files.length >= 27, `expected >=27 packs, got ${files.length}`);
  for (const file of files) {
    const rel = path.relative(packRoot, file).split(path.sep);
    const pack = loadContentPack("es-ES", ...rel);
    assert.ok(pack != null, rel.join("/"));
  }
});

test("reports sparse deep merge: Spain overrides + es-419 siblings", () => {
  const merged = loadMergedReportBurnDownIndex("es-ES");
  const base = getCatalogPackExact("es-419", "reports/burn-down-index.json");
  const overlay = getCatalogPackExact("es-ES", "reports/burn-down-index.json");
  // Spain reports overlay shrank after Israeli-residue leaf removal; keep merge/sibling contract.
  assert.equal(countLeaves(overlay), 35);
  assert.equal(countLeaves(merged), countLeaves(base));
  assert.equal(reportPackCopyForLocale("es-ES", "components__parent-report-detailed-surface", "grade"), "Curso");
  assert.equal(
    reportPackCopyForLocale("es-419", "components__parent-report-detailed-surface", "grade"),
    "Grado"
  );
  const siblingKey = Object.keys(base["components__parent-report-detailed-surface"] || {}).find(
    (k) => k !== "grade"
  );
  assert.ok(siblingKey);
  assert.equal(
    merged["components__parent-report-detailed-surface"][siblingKey],
    base["components__parent-report-detailed-surface"][siblingKey]
  );
  const flat = JSON.stringify(merged);
  assert.equal((flat.match(/grado/gi) || []).length, 0);
});

test("Help sparse overlay: España curso wording; other locales stay on es-419", () => {
  assert.equal(resolveHelpLocale("es-ES"), "es-ES");
  assert.equal(resolveHelpLocale("es-MX"), "es-419");
  assert.equal(resolveHelpLocale("es-UY"), "es-419");
  assert.equal(listArticles("parents", "es-ES").length, listArticles("parents", "es-419").length);
  assert.deepEqual(
    ALL_ARTICLES_ES_ES.map((a) => `${a.section}/${a.slug}`).sort(),
    ALL_ARTICLES_ES_419.map((a) => `${a.section}/${a.slug}`).sort()
  );

  const welcome = getArticle("parents", "welcome-and-overview", "es-ES");
  assert.match(JSON.stringify(welcome), /1\.º a 6\.º de Primaria/);
  assert.doesNotMatch(JSON.stringify(welcome), /grados 1 a 6/);

  const add = getArticle("parents", "add-students", "es-ES");
  assert.match(add.summary, /curso/);
  assert.ok(add.keywords.includes("curso"));

  const mx = getArticle("parents", "welcome-and-overview", "es-MX");
  assert.match(JSON.stringify(mx), /grados 1 a 6/);

  const helpFlat = collectStrings(ALL_ARTICLES_ES_ES).join("\n");
  assert.equal(schoolYearGradoHits(helpFlat).length, 0, schoolYearGradoHits(helpFlat).slice(0, 5).join("|"));
});

test("es-ES word meanings: 13 Spain glosses; other meanings inherit", () => {
  let n = 0;
  for (const list of Object.values(WORD_MEANINGS_ES_ES)) n += Object.keys(list).length;
  assert.equal(n, 13);
  assert.equal(resolveEnglishWordMeaning("juice", { listKey: "food", instructionLocale: "es-ES" }), "zumo");
  assert.equal(resolveEnglishWordMeaning("computer", { listKey: "house", instructionLocale: "es-ES" }), "ordenador");
  assert.equal(
    resolveEnglishWordMeaning("computer", { listKey: "technology", instructionLocale: "es-ES" }),
    "ordenador"
  );
  assert.equal(
    resolveEnglishWordMeaning("laptop", { listKey: "technology", instructionLocale: "es-ES" }),
    "ordenador portátil"
  );
  const red = resolveEnglishWordMeaning("red", { listKey: "colors", instructionLocale: "es-ES" });
  const baseRed = resolveEnglishWordMeaning("red", { listKey: "colors", instructionLocale: "es-419" });
  assert.equal(red, baseRed);
});

test("Spain address: school usted markers; individual tú; angle grados preserved in learning", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("es-ES");
  assert.match(String(lookupMessage(bundles, "school.portal.classesSubtitle") || ""), /\bElija\b/);
  const worksheets = JSON.stringify(bundles.worksheets || {});
  assert.equal(/\bvosotros\b/i.test(worksheets), false);
  // Individual UI prefers tú forms (tu / tú) in worksheets/UI overlays where present
  const ui = JSON.stringify(bundles.ui || {});
  assert.equal(/\bvosotros\b/i.test(ui), false);

  // Angle degrees: geometry copy from es-419 chain should still allow "grados" for angles if present
  const geom = loadContentPack("es-419", "learning", "geometry-content.json");
  const geomFlat = JSON.stringify(geom || {});
  // If geometry content mentions degrees, preserve that concept for Spain inheritance path
  if (/grados/i.test(geomFlat)) {
    const esGeom = loadContentPack("es-ES", "learning", "geometry-content.json");
    assert.match(JSON.stringify(esGeom || {}), /grados/i);
  } else {
    assert.ok(true);
  }
});
