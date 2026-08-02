/**
 * Group-2 country wiring: Cameroon-en, Benin, Mauritius-en,
 * Guinea, Togo, Gabon, Congo (Republic).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  LOCALE_REGISTRY,
  getSelectableLocales,
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { resolveContentLocale as resolveProductContentLocale } from "../../utils/learning-question-content-locale.js";
import {
  stripLocaleFromPath,
  withLocalePath,
  buildLocalizedHref,
  shouldRedirectToPublicLocalePrefix,
} from "../../lib/i18n/locale-path.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
import { getCatalogPackExact, CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import { resolveHelpLocale, listArticles } from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_FR_FR } from "../../data/english-questions/word-meanings/fr-FR.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";

const ROOT = process.cwd();

function walkJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

const COUNTRIES = [
  {
    id: "en-CM",
    prefix: "cm-en",
    label: "Cameroon-en",
    chain: ["en-CM", "en"],
    namespaces: 12,
    packs: 46,
    probeKey: "common.grade1",
    probeValue: "Class 1",
    booksDir: "docs/learning-book/en",
    grades: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"],
  },
  {
    id: "fr-BJ",
    prefix: "bj",
    label: "Benin",
    chain: ["fr-BJ", "fr-FR", "en"],
    namespaces: 9,
    packs: 26,
    probeKey: "common.grade1",
    probeValue: "CI",
    booksDir: "docs/learning-book/fr-FR",
    grades: ["CI", "CP", "CE1", "CE2", "CM1", "CM2"],
  },
  {
    id: "en-MU",
    prefix: "mu-en",
    label: "Mauritius-en",
    chain: ["en-MU", "en"],
    namespaces: 11,
    packs: 28,
    probeKey: "common.grade1",
    probeValue: "Grade 1",
    booksDir: "docs/learning-book/en",
    grades: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
  },
  {
    id: "fr-GN",
    prefix: "gn",
    label: "Guinea",
    chain: ["fr-GN", "fr-FR", "en"],
    namespaces: 9,
    packs: 26,
    probeKey: "common.grade1",
    probeValue: "CP1",
    booksDir: "docs/learning-book/fr-FR",
    grades: ["CP1", "CP2", "CE1", "CE2", "CM1", "CM2"],
  },
  {
    id: "fr-TG",
    prefix: "tg",
    label: "Togo",
    chain: ["fr-TG", "fr-FR", "en"],
    namespaces: 9,
    packs: 26,
    probeKey: "common.grade1",
    probeValue: "CP1",
    booksDir: "docs/learning-book/fr-FR",
    grades: ["CP1", "CP2", "CE1", "CE2", "CM1", "CM2"],
  },
  {
    id: "fr-GA",
    prefix: "ga",
    label: "Gabon",
    chain: ["fr-GA", "fr-FR", "en"],
    namespaces: 8,
    packs: 26,
    probeKey: "common.grade1",
    probeValue: "1re année",
    booksDir: "docs/learning-book/fr-FR",
    grades: ["1re année", "2e année", "3e année", "4e année", "5e année", "6e"],
  },
  {
    id: "fr-CG",
    prefix: "cg",
    label: "Congo",
    chain: ["fr-CG", "fr-FR", "en"],
    namespaces: 9,
    packs: 17,
    probeKey: "common.grade1",
    probeValue: "CP1",
    booksDir: "docs/learning-book/fr-FR",
    grades: ["CP1", "CP2", "CE1", "CE2", "CM1", "CM2"],
  },
];

const FORBIDDEN_GENERATORS = [
  "tests/i18n/_gen-en-CM-sparse-layer.mjs",
  "tests/i18n/_gen-fr-BJ-sparse-layer.mjs",
  "tests/i18n/_gen-en-MU-sparse-layer.mjs",
  "tests/i18n/_gen-fr-GN-sparse-layer.mjs",
  "tests/i18n/_gen-fr-TG-sparse-layer.mjs",
  "tests/i18n/_gen-fr-GA-sparse-layer.mjs",
];

const EMPTY_HELP_OVERRIDES = [
  "data/help-center/fr-GN/parent-report.js",
  "data/help-center/fr-GA/parent-report.js",
  "data/help-center/fr-CG/parent-report.js",
];

function scanLocaleLayer(id, re) {
  let hits = 0;
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (/\.(json|js)$/.test(ent.name)) {
        const m = fs.readFileSync(p, "utf8").match(re);
        if (m) hits += m.length;
      }
    }
  }
  for (const root of [
    path.join(ROOT, "locales", id),
    path.join(ROOT, "content-packs", id),
    path.join(ROOT, "data/help-center", id),
  ]) {
    walk(root);
  }
  return hits;
}

test("selector count is 69 and includes group-2 countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 69);
  for (const c of COUNTRIES) {
    const hits = locales.filter((l) => l.id === c.id);
    assert.equal(hits.length, 1, c.id);
    assert.equal(hits[0].label, c.label);
    assert.equal(hits[0].nativeName, c.label);
    assert.equal(hits[0].pathPrefix, c.prefix);
  }
  const ids = locales.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
  const prefixes = locales.map((l) => l.pathPrefix);
  assert.equal(new Set(prefixes).size, prefixes.length);
  const labels = locales.map((l) => l.label);
  assert.equal(new Set(labels).size, labels.length);
});

for (const c of COUNTRIES) {
  test(`${c.id}: registry, path /${c.prefix}, fallback chain, canonical redirects`, () => {
    const def = LOCALE_REGISTRY[c.id];
    assert.ok(def);
    assert.equal(def.enabled, true);
    assert.equal(def.selectorVisible, true);
    assert.equal(def.label, c.label);
    assert.equal(def.pathPrefix, c.prefix);
    assert.deepEqual(getLocaleFallbackChain(c.id), c.chain);
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(resolveProductContentLocale({ contentLocale: c.id }), c.id);
    assert.equal(withLocalePath(c.id, "/student/home"), `/${c.prefix}/student/home`);
    assert.deepEqual(stripLocaleFromPath(`/${c.prefix}/parents`), {
      locale: c.id,
      pathname: "/parents",
      hadPrefix: true,
      pathSegment: c.prefix,
    });
    assert.equal(
      buildLocalizedHref(c.id, "/parents", { search: "x=1", hash: "y" }),
      `/${c.prefix}/parents?x=1#y`
    );

    const fromInternal = stripLocaleFromPath(`/${c.id}/learning/math`);
    assert.equal(fromInternal.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromInternal.pathSegment), true);

    const fromUpper = stripLocaleFromPath(`/${c.prefix.toUpperCase()}/learning/math`);
    assert.equal(fromUpper.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromUpper.pathSegment), true);
  });
}

test("group-2 forbidden /cm and /mu do not guess a language", () => {
  for (const bare of ["cm", "mu"]) {
    assert.equal(resolveLocaleIdFromPathPrefix(bare), null, bare);
    assert.equal(stripLocaleFromPath(`/${bare}/parents`).locale, null, bare);
  }
});

test("group-2 /cm-en and /cm-fr remain distinct; /cg and /cd remain distinct", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("cm-en"), "en-CM");
  assert.equal(resolveLocaleIdFromPathPrefix("cm-fr"), "fr-CM");
  assert.notEqual(resolveLocaleIdFromPathPrefix("cm-en"), resolveLocaleIdFromPathPrefix("cm-fr"));
  assert.equal(resolveLocaleIdFromPathPrefix("cg"), "fr-CG");
  assert.equal(resolveLocaleIdFromPathPrefix("cd"), "fr-CD");
  assert.notEqual(resolveLocaleIdFromPathPrefix("cg"), resolveLocaleIdFromPathPrefix("cd"));
  assert.equal(getLocaleFallbackChain("fr-CG")[0], "fr-CG");
  assert.equal(getLocaleFallbackChain("fr-CD")[0], "fr-CD");
});

test("group-2 bare Francophone ISO paths resolve to their locales", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("bj"), "fr-BJ");
  assert.equal(resolveLocaleIdFromPathPrefix("gn"), "fr-GN");
  assert.equal(resolveLocaleIdFromPathPrefix("tg"), "fr-TG");
  assert.equal(resolveLocaleIdFromPathPrefix("ga"), "fr-GA");
  assert.equal(resolveLocaleIdFromPathPrefix("cg"), "fr-CG");
});

test("group-2 countries stay isolated from siblings and bases", () => {
  assert.notEqual(getLocaleFallbackChain("fr-BJ")[0], "fr-GN");
  assert.notEqual(getLocaleFallbackChain("fr-GN")[0], "fr-TG");
  assert.notEqual(getLocaleFallbackChain("fr-TG")[0], "fr-GA");
  assert.notEqual(getLocaleFallbackChain("fr-GA")[0], "fr-CG");
  assert.notEqual(getLocaleFallbackChain("fr-CG")[0], "fr-CD");
  assert.notEqual(getLocaleFallbackChain("en-CM")[0], "fr-CM");
  assert.equal(resolveLocaleDefinition("en").id, "en");
  assert.equal(resolveLocaleDefinition("fr-FR").id, "fr-FR");
  assert.equal(resolveLocaleDefinition("fr-CM").id, "fr-CM");
  assert.equal(resolveLocaleDefinition("fr-CD").id, "fr-CD");
  assert.notEqual(resolveLocaleIdFromPathPrefix("fr"), "fr-BJ");
  assert.equal(resolveLocaleIdFromPathPrefix("fr"), "fr-FR");
});

test("group-2 namespace deep merge probes and grade mappings", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    assert.equal(lookupMessage(bundles, c.probeKey), c.probeValue, `${c.id} ${c.probeKey}`);
    assert.deepEqual(
      [
        lookupMessage(bundles, "common.grade1"),
        lookupMessage(bundles, "common.grade2"),
        lookupMessage(bundles, "common.grade3"),
        lookupMessage(bundles, "common.grade4"),
        lookupMessage(bundles, "common.grade5"),
        lookupMessage(bundles, "common.grade6"),
      ],
      c.grades,
      `${c.id} grades`
    );
    assert.equal(
      fs.readdirSync(path.join(ROOT, "locales", c.id)).filter((f) => f.endsWith(".json")).length,
      c.namespaces,
      c.id
    );
  }
  const ga = loadLocaleBundles("fr-GA");
  assert.equal(lookupMessage(ga, "common.grade6"), "6e");
  assert.doesNotMatch(lookupMessage(ga, "common.grade6") || "", /6e année primaire/);
});

test("group-2 content packs catalog disk parity", () => {
  for (const c of COUNTRIES) {
    const disk = walkJson(path.join(ROOT, "content-packs", c.id)).map((p) =>
      p.replace(/\\/g, "/").split(`content-packs/${c.id}/`)[1]
    );
    const catalogKeys = Object.keys(CONTENT_PACK_CATALOG[c.id] || {}).sort();
    assert.equal(disk.length, c.packs, `${c.id} disk count`);
    assert.equal(catalogKeys.length, c.packs, `${c.id} catalog count`);
    assert.deepEqual(catalogKeys, disk.sort());
    assert.ok(getCatalogPackExact(c.id, catalogKeys[0]));
  }
});

test("group-2 Help resolution; fr-GN/fr-GA/fr-CG parent-report inherit fr-FR", () => {
  for (const c of COUNTRIES) {
    assert.equal(resolveHelpLocale(c.id), c.id);
    for (const section of ["parents", "students", "subjects", "parent-report"]) {
      assert.ok(listArticles(section, c.id).length > 0, `${c.id} ${section}`);
    }
  }
  for (const rel of EMPTY_HELP_OVERRIDES) {
    assert.equal(fs.existsSync(path.join(ROOT, rel)), false, rel);
  }
  const frPr = listArticles("parent-report", "fr-FR");
  assert.equal(frPr.length, 12);
  for (const id of ["fr-GN", "fr-GA", "fr-CG"]) {
    const localPr = listArticles("parent-report", id);
    assert.equal(localPr.length, 12, id);
    assert.deepEqual(
      localPr.map((a) => a.slug).sort(),
      frPr.map((a) => a.slug).sort(),
      id
    );
  }
});

test("group-2 word meanings and heavy-content inheritance", () => {
  assert.equal(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "en-CM" }),
    "dog"
  );
  assert.equal(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "en-MU" }),
    "dog"
  );
  const frWord = Object.keys(WORD_MEANINGS_FR_FR.animals || {})[0] || "dog";
  for (const id of ["fr-BJ", "fr-GN", "fr-TG", "fr-GA", "fr-CG"]) {
    assert.equal(
      resolveEnglishWordMeaning(frWord, { listKey: "animals", instructionLocale: id }),
      WORD_MEANINGS_FR_FR.animals[frWord],
      id
    );
  }

  const cmMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en-CM" }
  );
  const enMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en" }
  );
  assert.equal(String(cmMath.question || ""), String(enMath.question || ""));

  const bjGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-BJ" }
  );
  const frGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-FR" }
  );
  assert.equal(
    String(bjGeo.question || bjGeo.stem || ""),
    String(frGeo.question || frGeo.stem || "")
  );

  const cgSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"] },
    { subject: "science", contentLocale: "fr-CG" }
  );
  const frSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"] },
    { subject: "science", contentLocale: "fr-FR" }
  );
  assert.equal(String(cgSci.stem || cgSci.question || ""), String(frSci.stem || frSci.question || ""));
});

test("group-2 learning books fall back to language base dirs", () => {
  for (const c of COUNTRIES) {
    assert.equal(
      resolveLearningBookDraftsDir(c.id, "math", "g1"),
      `${c.booksDir}/math/g1/drafts`,
      c.id
    );
  }
});

test("group-2 generator files and empty Help overrides absent", () => {
  for (const rel of FORBIDDEN_GENERATORS) {
    assert.equal(fs.existsSync(path.join(ROOT, rel)), false, rel);
  }
  for (const rel of EMPTY_HELP_OVERRIDES) {
    assert.equal(fs.existsSync(path.join(ROOT, rel)), false, rel);
  }
});

test("group-2 content corrections: class/group, framing, residue", () => {
  resetLocaleBundleCache();

  const cm = loadLocaleBundles("en-CM");
  assert.equal(lookupMessage(cm, "teacher.dashboard.createClassLabel"), "Class group name");
  assert.equal(lookupMessage(cm, "teacher.dashboard.createClassButton"), "Create class group");
  assert.equal(lookupMessage(cm, "teacher.dashboard.noClassesTitle"), "No active class groups");
  assert.equal(lookupMessage(cm, "school.portal.quickClasses"), "Manage class groups");
  assert.doesNotMatch(lookupMessage(cm, "teacher.dashboard.createClassLabel") || "", /^Class name$/);
  assert.doesNotMatch(lookupMessage(cm, "teacher.dashboard.createClassButton") || "", /^Create class$/);

  const bj = loadLocaleBundles("fr-BJ");
  assert.equal(lookupMessage(bj, "teacher.dashboard.createClassLabel"), "Nom du groupe-classe");
  assert.equal(lookupMessage(bj, "teacher.dashboard.createClassButton"), "Créer un groupe-classe");
  assert.equal(lookupMessage(bj, "teacher.dashboard.noClassesTitle"), "Aucun groupe-classe actif");
  assert.equal(lookupMessage(bj, "teacher.dashboard.createClassPlaceholder"), "par ex. CE1 — LION");
  assert.match(lookupMessage(bj, "ui.home.subhead") || "", /Bénin/);
  assert.match(lookupMessage(bj, "ui.home.subhead") || "", /CI–CM2/);
  assert.match(lookupMessage(bj, "ui.public.about.intro1") || "", /enseignement primaire au Bénin/);
  const bjWelcome = listArticles("parents", "fr-BJ").find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(bjWelcome || {}), /Bénin/);

  const ga = loadLocaleBundles("fr-GA");
  assert.equal(lookupMessage(ga, "common.grade6"), "6e");
  assert.equal(lookupMessage(ga, "teacher.dashboard.createClassLabel"), "Nom du groupe-classe");
  assert.equal(lookupMessage(ga, "teacher.dashboard.createClassButton"), "Créer un groupe-classe");
  assert.equal(lookupMessage(ga, "teacher.dashboard.noClassesTitle"), "Aucun groupe-classe actif");
  assert.equal(lookupMessage(ga, "teacher.dashboard.createClassPlaceholder"), "par ex. 3e année — LION");
  assert.match(lookupMessage(ga, "ui.home.subhead") || "", /Gabon/);
  assert.doesNotMatch(lookupMessage(ga, "ui.home.subhead") || "", /6e année primaire/);
  assert.equal(scanLocaleLayer("fr-GA", /6e année primaire/gi), 0);

  const cg = loadLocaleBundles("fr-CG");
  assert.match(lookupMessage(cg, "ui.home.subhead") || "", /République du Congo/);
  const cgWelcome = listArticles("parents", "fr-CG").find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(cgWelcome || {}), /République du Congo/);
  assert.doesNotMatch(JSON.stringify(cgWelcome || {}), /République démocratique du Congo|Congo-Kinshasa|Kinshasa|\bRDC\b|DR Congo/);

  for (const id of ["en-CM"]) {
    assert.equal(scanLocaleLayer(id, /Hebrew/gi), 0, `${id} Hebrew`);
    assert.equal(scanLocaleLayer(id, /homeland/gi), 0, `${id} homeland`);
    assert.equal(scanLocaleLayer(id, /Israel|Israeli/gi), 0, `${id} Israel`);
    assert.equal(scanLocaleLayer(id, /Hasmonaean/gi), 0, `${id} Hasmonaean`);
    assert.equal(scanLocaleLayer(id, /Judea|Judaism/gi), 0, `${id} Judea`);
    assert.equal(scanLocaleLayer(id, /[\u0590-\u05FF]/g), 0, `${id} Hebrew script`);
  }
  for (const id of ["fr-BJ", "fr-GA", "fr-CG"]) {
    assert.equal(scanLocaleLayer(id, /Hebrew|hébreu/gi), 0, `${id} hebrew`);
    assert.equal(scanLocaleLayer(id, /homeland|patrie/gi), 0, `${id} homeland`);
    assert.equal(scanLocaleLayer(id, /Israel|Israël|Israeli/gi), 0, `${id} Israel`);
    assert.equal(scanLocaleLayer(id, /Hasmonaean|Hasmonéen/gi), 0, `${id} Hasmonaean`);
    assert.equal(scanLocaleLayer(id, /Judea|Judée|Judaism|judaïsme/gi), 0, `${id} Judea`);
    assert.equal(scanLocaleLayer(id, /[\u0590-\u05FF]/g), 0, `${id} Hebrew script`);
  }
});

test("existing base and group-1 locales remain enabled after group-2 wiring", () => {
  for (const id of ["en", "fr-FR", "fr-CM", "fr-CD", "en-RW", "en-GH", "es-US"]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
});
