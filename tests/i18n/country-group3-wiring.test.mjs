/**
 * Group-3 country wiring: Suriname-nl, Cabo Verde-pt, Equatorial Guinea-es,
 * Sierra Leone-en, Liberia, The Gambia.
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
import { WORD_MEANINGS_NL_NL } from "../../data/english-questions/word-meanings/nl-NL.js";
import { WORD_MEANINGS_PT_PT } from "../../data/english-questions/word-meanings/pt-PT.js";
import { WORD_MEANINGS_ES_419 } from "../../data/english-questions/word-meanings/es-419.js";
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
    id: "nl-SR",
    prefix: "sr-nl",
    label: "Suriname-nl",
    chain: ["nl-SR", "nl-NL", "en"],
    namespaces: 10,
    packs: 23,
    probeKey: "common.grade1",
    probeValue: "1e leerjaar",
    booksDir: "docs/learning-book/nl-NL",
    grades: [
      "1e leerjaar",
      "2e leerjaar",
      "3e leerjaar",
      "4e leerjaar",
      "5e leerjaar",
      "6e leerjaar",
    ],
  },
  {
    id: "pt-CV",
    prefix: "cv-pt",
    label: "Cabo Verde-pt",
    chain: ["pt-CV", "pt-PT", "pt-BR", "en"],
    namespaces: 8,
    packs: 25,
    probeKey: "common.grade1",
    probeValue: "1.º ano",
    booksDir: "docs/learning-book/pt-PT",
    grades: ["1.º ano", "2.º ano", "3.º ano", "4.º ano", "5.º ano", "6.º ano"],
  },
  {
    id: "es-GQ",
    prefix: "gq-es",
    label: "Equatorial Guinea-es",
    chain: ["es-GQ", "es-419", "en"],
    namespaces: 8,
    packs: 13,
    probeKey: "common.grade1",
    probeValue: "1er grado",
    booksDir: "docs/learning-book/es-419",
    grades: ["1er grado", "2do grado", "3er grado", "4to grado", "5to grado", "6to grado"],
  },
  {
    id: "en-SL",
    prefix: "sl-en",
    label: "Sierra Leone-en",
    chain: ["en-SL", "en"],
    namespaces: 12,
    packs: 46,
    probeKey: "common.grade1",
    probeValue: "Class 1",
    booksDir: "docs/learning-book/en",
    grades: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"],
  },
  {
    id: "en-LR",
    prefix: "lr",
    label: "Liberia",
    chain: ["en-LR", "en"],
    namespaces: 8,
    packs: 18,
    probeKey: "common.grade1",
    probeValue: "Grade 1",
    booksDir: "docs/learning-book/en",
    grades: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
  },
  {
    id: "en-GM",
    prefix: "gm",
    label: "The Gambia",
    chain: ["en-GM", "en"],
    namespaces: 12,
    packs: 29,
    probeKey: "common.grade1",
    probeValue: "Grade 1",
    booksDir: "docs/learning-book/en",
    grades: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
  },
];

const FORBIDDEN_HELPERS = [
  "tests/i18n/_gen-en-SL-sparse-layer.mjs",
  "tests/i18n/_gen-en-GM-sparse-layer.mjs",
  "tests/i18n/_gen-en-LR-sparse-layer.mjs",
  "tests/i18n/_fix-en-LR-sparse-layer.mjs",
  "tests/i18n/_fix2-en-LR-sparse-layer.mjs",
  "tests/i18n/_gen-pt-CV-sparse-layer.mjs",
];

const EMPTY_HELP_OVERRIDES = [
  "data/help-center/en-LR/students.js",
  "data/help-center/en-LR/parent-report.js",
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

test("selector count is 75 and includes group-3 countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 75);
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
  const hrefs = locales.map((l) => `/${l.pathPrefix}`);
  assert.equal(new Set(hrefs).size, hrefs.length);
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

test("group-3 forbidden /sr /cv /gq /sl do not guess a language", () => {
  for (const bare of ["sr", "cv", "gq", "sl"]) {
    assert.equal(resolveLocaleIdFromPathPrefix(bare), null, bare);
    assert.equal(stripLocaleFromPath(`/${bare}/parents`).locale, null, bare);
  }
});

test("group-3 /lr and /gm resolve to Liberia and The Gambia", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("lr"), "en-LR");
  assert.equal(resolveLocaleIdFromPathPrefix("gm"), "en-GM");
});

test("group-3 countries stay isolated from siblings and bases", () => {
  assert.notEqual(getLocaleFallbackChain("nl-SR")[0], "nl-BE");
  assert.notEqual(getLocaleFallbackChain("nl-SR")[0], "nl-NL");
  assert.equal(getLocaleFallbackChain("nl-SR")[1], "nl-NL");
  assert.notEqual(getLocaleFallbackChain("pt-CV")[0], "pt-AO");
  assert.notEqual(getLocaleFallbackChain("pt-CV")[0], "pt-MZ");
  assert.equal(getLocaleFallbackChain("pt-CV")[1], "pt-PT");
  assert.notEqual(getLocaleFallbackChain("es-GQ")[0], "es-US");
  assert.notEqual(getLocaleFallbackChain("es-GQ")[0], "es-ES");
  assert.equal(getLocaleFallbackChain("es-GQ")[1], "es-419");
  assert.notEqual(getLocaleFallbackChain("en-SL")[0], "en-LR");
  assert.notEqual(getLocaleFallbackChain("en-LR")[0], "en-GM");
  assert.equal(resolveLocaleDefinition("nl-NL").id, "nl-NL");
  assert.equal(resolveLocaleDefinition("pt-PT").id, "pt-PT");
  assert.equal(resolveLocaleDefinition("es-419").id, "es-419");
  assert.equal(resolveLocaleDefinition("en").id, "en");
});

test("group-3 namespace deep merge probes and grade mappings", () => {
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
});

test("group-3 content packs catalog disk parity", () => {
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

test("group-3 Help resolution; four sections; parent-report inheritance where local absent", () => {
  for (const c of COUNTRIES) {
    assert.equal(resolveHelpLocale(c.id), c.id);
    for (const section of ["parents", "students", "subjects", "parent-report"]) {
      assert.ok(listArticles(section, c.id).length > 0, `${c.id} ${section}`);
    }
  }
  assert.equal(fs.existsSync(path.join(ROOT, "data/help-center/nl-SR/parent-report.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/help-center/pt-CV/parent-report.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/help-center/es-GQ/parent-report.js")), false);
  for (const rel of EMPTY_HELP_OVERRIDES) {
    assert.equal(fs.existsSync(path.join(ROOT, rel)), false, rel);
  }
  assert.equal(listArticles("parent-report", "nl-SR").length, listArticles("parent-report", "nl-NL").length);
  assert.equal(listArticles("parent-report", "pt-CV").length, listArticles("parent-report", "pt-PT").length);
  assert.equal(listArticles("parent-report", "es-GQ").length, listArticles("parent-report", "es-419").length);
  assert.equal(listArticles("students", "en-LR").length, 11);
  assert.equal(listArticles("parent-report", "en-LR").length, 12);
  assert.deepEqual(
    listArticles("students", "en-LR").map((a) => a.slug).sort(),
    listArticles("students", "en").map((a) => a.slug).sort()
  );
  assert.deepEqual(
    listArticles("parent-report", "en-LR").map((a) => a.slug).sort(),
    listArticles("parent-report", "en").map((a) => a.slug).sort()
  );
});

test("group-3 word meanings and heavy-content inheritance", () => {
  assert.equal(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "en-SL" }),
    "dog"
  );
  assert.equal(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "en-LR" }),
    "dog"
  );
  assert.equal(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "en-GM" }),
    "dog"
  );

  const nlWord = Object.keys(WORD_MEANINGS_NL_NL.animals || {})[0] || "dog";
  assert.equal(
    resolveEnglishWordMeaning(nlWord, { listKey: "animals", instructionLocale: "nl-SR" }),
    WORD_MEANINGS_NL_NL.animals[nlWord]
  );

  const ptWord = Object.keys(WORD_MEANINGS_PT_PT.animals || {})[0] || "dog";
  assert.equal(
    resolveEnglishWordMeaning(ptWord, { listKey: "animals", instructionLocale: "pt-CV" }),
    WORD_MEANINGS_PT_PT.animals[ptWord]
  );

  const esWord = Object.keys(WORD_MEANINGS_ES_419.animals || {})[0] || "dog";
  assert.equal(
    resolveEnglishWordMeaning(esWord, { listKey: "animals", instructionLocale: "es-GQ" }),
    WORD_MEANINGS_ES_419.animals[esWord]
  );

  const slMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en-SL" }
  );
  const enMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en" }
  );
  assert.equal(String(slMath.question || ""), String(enMath.question || ""));

  const cvGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "pt-CV" }
  );
  const ptGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "pt-PT" }
  );
  assert.equal(
    String(cvGeo.question || cvGeo.stem || ""),
    String(ptGeo.question || ptGeo.stem || "")
  );

  const gqSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"] },
    { subject: "science", contentLocale: "es-GQ" }
  );
  const esSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"] },
    { subject: "science", contentLocale: "es-419" }
  );
  assert.equal(String(gqSci.stem || gqSci.question || ""), String(esSci.stem || esSci.question || ""));
});

test("group-3 learning books fall back to language base dirs", () => {
  for (const c of COUNTRIES) {
    assert.equal(
      resolveLearningBookDraftsDir(c.id, "math", "g1"),
      `${c.booksDir}/math/g1/drafts`,
      c.id
    );
  }
});

test("group-3 generator/helper files and empty Help overrides absent", () => {
  for (const rel of FORBIDDEN_HELPERS) {
    assert.equal(fs.existsSync(path.join(ROOT, rel)), false, rel);
  }
  for (const rel of EMPTY_HELP_OVERRIDES) {
    assert.equal(fs.existsSync(path.join(ROOT, rel)), false, rel);
  }
});

test("group-3 content corrections: framing, residue, terminology", () => {
  resetLocaleBundleCache();
  const nl = loadLocaleBundles("nl-SR");
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6].map((n) => lookupMessage(nl, `common.grade${n}`)),
    ["1e leerjaar", "2e leerjaar", "3e leerjaar", "4e leerjaar", "5e leerjaar", "6e leerjaar"]
  );
  assert.equal(scanLocaleLayer("nl-SR", /Leerjaar\s*[3-8]\b/g), 0);
  // Dutch-English mash: English chrome verbs/labels should not remain in Dutch overlays.
  assert.equal(scanLocaleLayer("nl-SR", /\b(Manage class|Create class|No active classes|Class name)\b/g), 0);
  assert.equal(scanLocaleLayer("nl-SR", /Hebrew|Hebreeuws|homeland|Israel|Israël|Israeli|Judea|Judaism|Hellenism|Hasmonaean|[\u0590-\u05FF]/gi), 0);

  const pt = loadLocaleBundles("pt-CV");
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6].map((n) => lookupMessage(pt, `common.grade${n}`)),
    ["1.º ano", "2.º ano", "3.º ano", "4.º ano", "5.º ano", "6.º ano"]
  );
  // User-facing locale/pack chrome (Help matcher fields like titleIncludes may mention BR source titles).
  const ptLocaleBlob = fs
    .readdirSync(path.join(ROOT, "locales/pt-CV"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => fs.readFileSync(path.join(ROOT, "locales/pt-CV", f), "utf8"))
    .join("\n");
  assert.doesNotMatch(
    ptLocaleBlob,
    /\b(Gerenciar|gerenciamento|projetado|porcentagem|porcentagens|cronômetro|celular|usuário)\b/i
  );
  assert.equal(lookupMessage(pt, "teacher.dashboard.createClassLabel") || "", "Nome da turma");
  assert.equal(fs.existsSync(path.join(ROOT, "tests/i18n/_gen-pt-CV-sparse-layer.mjs")), false);

  const es = loadLocaleBundles("es-GQ");
  assert.match(lookupMessage(es, "ui.home.subhead") || lookupMessage(es, "ui.public.about.intro1") || "", /Guinea Ecuatorial|Ecuatorial/i);
  assert.equal(scanLocaleLayer("es-GQ", /\bcelular\b/gi), 0);
  assert.equal(scanLocaleLayer("es-GQ", /Grados\s*1\s*[–-]\s*2/g), 0);

  assert.equal(scanLocaleLayer("en-SL", /Hellenism|Hebrew|Israel|Israeli|Judea|Judaism|Hasmonaean|[\u0590-\u05FF]/gi), 0);
  assert.equal(scanLocaleLayer("en-GM", /Hellenism|Hebrew|Israel|Israeli|Judea|Judaism|Hasmonaean|[\u0590-\u05FF]/gi), 0);
  assert.equal(scanLocaleLayer("en-GM", /\bGrade\s*[7-9]\b/g), 0);
  assert.equal(scanLocaleLayer("en-LR", /Hellenism|Hebrew|Israel|Israeli|[\u0590-\u05FF]/gi), 0);
  for (const id of ["nl-SR", "pt-CV", "es-GQ", "en-SL", "en-LR", "en-GM"]) {
    assert.equal(
      scanLocaleLayer(id, /Hebrew|Hebreeuws|hébreu|homeland|Israel|Israël|Israeli|Judea|Judaism|Hellenism|Hasmonaean|Moledet|[\u0590-\u05FF]/gi),
      0,
      `${id} residue`
    );
  }
});

test("existing base and prior groups remain enabled after group-3 wiring", () => {
  for (const id of ["en", "nl-NL", "pt-PT", "es-419", "en-CM", "fr-BJ", "en-MU", "nl-BE", "pt-AO"]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
});
