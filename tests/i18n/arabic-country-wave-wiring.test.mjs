/**
 * Arabic country wave shared wiring: Egypt (ar-EG), Saudi Arabia (ar-SA),
 * Morocco (ar-MA), Algeria (ar-DZ).
 *
 * Base authority: ar-001. Fallback: country → ar-001 → en.
 * No country-to-country Arabic inheritance.
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
  resolveDirection,
  isRtlLocale,
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
import { loadContentPack, resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
import { getCatalogPackExact, CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import { resolveHelpLocale, listArticles, getHelpSections } from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_AR_001 } from "../../data/english-questions/word-meanings/ar-001.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";
import {
  getGuidePageContentForLocale,
  getPracticePageContentForLocale,
  getMarketingLandingContentForLocale,
} from "../../lib/seo/locale-public-seo-content.js";

const ROOT = process.cwd();
const HEBREW_RE = /[\u0590-\u05FF]/;
const ARABIC_RE = /[\u0600-\u06FF]/

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
    id: "ar-EG",
    prefix: "eg",
    label: "Egypt",
    chain: ["ar-EG", "ar-001", "en"],
    grade1: "الصف الأول",
    grade6: "الصف السادس",
    helpLocale: "ar-EG",
  },
  {
    id: "ar-SA",
    prefix: "sa",
    label: "Saudi Arabia",
    chain: ["ar-SA", "ar-001", "en"],
    grade1: "الصف الأول",
    grade6: "الصف السادس",
    helpLocale: "ar-SA",
  },
  {
    id: "ar-MA",
    prefix: "ma",
    label: "Morocco",
    chain: ["ar-MA", "ar-001", "en"],
    grade1: "السنة الأولى",
    grade6: "السنة السادسة",
    helpLocale: "ar-MA",
  },
  {
    id: "ar-DZ",
    prefix: "dz",
    label: "Algeria",
    chain: ["ar-DZ", "ar-001", "en"],
    grade1: "السنة 1 ابتدائي",
    grade6: "السنة 1 متوسط",
    helpLocale: "ar-DZ",
  },
];

test("selector count is 84 and includes Arabic wave countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 84);
  for (const c of COUNTRIES) {
    const hits = locales.filter((l) => l.id === c.id);
    assert.equal(hits.length, 1, c.id);
    assert.equal(hits[0].label, c.label);
    assert.equal(hits[0].nativeName, c.label);
    assert.equal(hits[0].pathPrefix, c.prefix);
  }
  assert.equal(locales.filter((l) => l.label === "العربية").length, 1);
  const ids = locales.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
  const prefixes = locales.map((l) => l.pathPrefix || l.id);
  assert.equal(new Set(prefixes).size, prefixes.length);
  const labels = locales.map((l) => l.label);
  assert.equal(new Set(labels).size, labels.length);
});

for (const c of COUNTRIES) {
  test(`${c.id}: registry, path /${c.prefix}, fallback chain, RTL, canonical redirects`, () => {
    const def = LOCALE_REGISTRY[c.id];
    assert.ok(def);
    assert.equal(def.enabled, true);
    assert.equal(def.selectorVisible, true);
    assert.equal(def.label, c.label);
    assert.equal(def.pathPrefix, c.prefix);
    assert.equal(def.direction, "rtl");
    assert.equal(def.fallbackLocale, "ar-001");
    assert.deepEqual(getLocaleFallbackChain(c.id), c.chain);
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(resolveProductContentLocale({ contentLocale: c.id }), c.id);
    assert.equal(resolveDirection(c.id), "rtl");
    assert.equal(isRtlLocale(c.id), true);
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

    const fromLocaleUpper = stripLocaleFromPath(`/${c.id.toUpperCase()}/help`);
    assert.equal(fromLocaleUpper.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromLocaleUpper.pathSegment), true);
  });
}

test("Arabic wave countries stay isolated from siblings (no country-to-country fallback)", () => {
  for (const a of COUNTRIES) {
    const chain = getLocaleFallbackChain(a.id);
    for (const b of COUNTRIES) {
      if (a.id === b.id) continue;
      assert.equal(chain.includes(b.id), false, `${a.id} must not fall back to ${b.id}`);
    }
    assert.equal(chain[1], "ar-001");
    assert.equal(chain[2], "en");
  }
  assert.equal(resolveLocaleIdFromPathPrefix("eg"), "ar-EG");
  assert.equal(resolveLocaleIdFromPathPrefix("sa"), "ar-SA");
  assert.equal(resolveLocaleIdFromPathPrefix("ma"), "ar-MA");
  assert.equal(resolveLocaleIdFromPathPrefix("dz"), "ar-DZ");
});

test("bare ar stays disabled; /ar remains Argentina", () => {
  assert.equal(LOCALE_REGISTRY.ar?.enabled, false);
  assert.notEqual(resolveLocaleDefinition("ar").id, "ar-001");
  assert.equal(resolveLocaleIdFromPathPrefix("ar"), "es-AR");
  assert.equal(stripLocaleFromPath("/ar/parents").locale, "es-AR");
});

test("Arabic wave namespace deep merge and grade labels", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    assert.equal(lookupMessage(bundles, "common.grade1"), c.grade1, c.id);
    assert.equal(lookupMessage(bundles, "common.grade6"), c.grade6, c.id);
    assert.match(String(lookupMessage(bundles, "common.grade1") || ""), ARABIC_RE);
    assert.equal(HEBREW_RE.test(String(lookupMessage(bundles, "common.grade1") || "")), false);
  }
});

test("Arabic wave disk↔loader namespace parity (post-audit)", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const locDir = path.join(ROOT, "locales", c.id);
    const nsFiles = fs
      .readdirSync(locDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
    const bundles = loadLocaleBundles(c.id);
    const ar001 = loadLocaleBundles("ar-001");
    for (const ns of nsFiles) {
      assert.ok(bundles[ns], `${c.id}: namespace ${ns} missing from runtime bundles`);
      const disk = JSON.parse(fs.readFileSync(path.join(locDir, `${ns}.json`), "utf8"));
      // Every string leaf on disk must win over ar-001 at runtime (proves import+registration).
      const stack = [{ obj: disk, prefix: ns }];
      while (stack.length) {
        const { obj, prefix } = stack.pop();
        if (obj == null || typeof obj !== "object" || Array.isArray(obj)) continue;
        for (const [k, v] of Object.entries(obj)) {
          const key = `${prefix}.${k}`;
          if (typeof v === "string") {
            assert.equal(
              lookupMessage(bundles, key),
              v,
              `${c.id}: disk overlay ${key} not effective in runtime`
            );
            // If ar-001 differs, country must not silently inherit the master value.
            const base = lookupMessage(ar001, key);
            if (base != null && base !== v) {
              assert.notEqual(
                lookupMessage(bundles, key),
                base,
                `${c.id}: ${key} still resolves to ar-001 (loader miss)`
              );
            }
          } else if (v && typeof v === "object" && !Array.isArray(v)) {
            stack.push({ obj: v, prefix: key });
          }
        }
      }
    }
  }
});

test("ar-DZ grade6 is السنة 1 متوسط and never السنة 6", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("ar-DZ");
  const g6 = lookupMessage(bundles, "common.grade6");
  assert.equal(g6, "السنة 1 متوسط");
  assert.notEqual(g6, "السنة 6");
  assert.equal(String(g6).includes("السنة 6"), false);

  const teacherGrade = loadContentPack("ar-DZ", "global-burn-down", "burn-down-index.json");
  const gradePack = teacherGrade?.["lib__teacher-portal__teacher-class-grade"];
  assert.equal(gradePack?.grade_6, "السنة 1 متوسط");
  assert.notEqual(gradePack?.grade_6, "السنة 6");
});

test("Arabic wave content packs catalog disk parity", () => {
  for (const c of COUNTRIES) {
    const disk = walkJson(path.join(ROOT, "content-packs", c.id)).map((p) =>
      p.replace(/\\/g, "/").split(`content-packs/${c.id}/`)[1]
    );
    const catalogKeys = Object.keys(CONTENT_PACK_CATALOG[c.id] || {}).sort();
    assert.equal(catalogKeys.length, disk.length, `${c.id} catalog vs disk count`);
    assert.deepEqual(catalogKeys, disk.sort());
    assert.ok(
      getCatalogPackExact(c.id, "demo/ui.json") || getCatalogPackExact(c.id, "rewards/ui.json"),
      c.id
    );
    assert.ok(loadContentPack(c.id, "rewards", "ui.json"), `${c.id} rewards`);
  }
});

test("Arabic wave Help resolution and inheritance", () => {
  for (const c of COUNTRIES) {
    assert.equal(resolveHelpLocale(c.id), c.helpLocale, c.id);
    const sections = getHelpSections(c.id);
    assert.ok(sections?.parents?.title);
    assert.match(String(sections.parents.title), ARABIC_RE);
    for (const section of ["parents", "students", "subjects", "parent-report"]) {
      assert.ok(listArticles(section, c.id).length > 0, `${c.id} ${section}`);
    }
  }
});

test("ar-EG Help sparse merge is effective (academic الصف)", async () => {
  const { getArticle } = await import("../../data/help-center/index.js");
  assert.equal(resolveHelpLocale("ar-EG"), "ar-EG");
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = getArticle("subjects", slug, "ar-EG");
    assert.ok(article, slug);
    const text = JSON.stringify(article);
    assert.match(text, /الصف/);
    assert.doesNotMatch(text, /اختر الدرجة/);
  }
  const parent = getArticle("parents", "edit-or-delete-student", "ar-EG");
  assert.match(String(parent?.summary || ""), /الصف/);
  assert.doesNotMatch(String(parent?.summary || ""), /الدرجة/);
});

test("Arabic wave word meanings inherit ar-001; English learning stems stay English", () => {
  const sampleCat = Object.keys(WORD_MEANINGS_AR_001 || {})[0];
  assert.ok(sampleCat, "ar-001 word meanings present");
  const words = Object.keys(WORD_MEANINGS_AR_001[sampleCat] || {});
  assert.ok(words.length > 0);
  const word = words[0];
  for (const c of COUNTRIES) {
    const meaning = resolveEnglishWordMeaning(word, {
      listKey: sampleCat,
      instructionLocale: c.id,
    });
    assert.equal(meaning, WORD_MEANINGS_AR_001[sampleCat][word], c.id);
  }

  const enQ = {
    id: "wiring-en-stem",
    subject: "english",
    prompt: "Choose the correct word",
    question: "Choose the correct word",
  };
  for (const c of COUNTRIES) {
    const localized = localizeLearningQuestion(enQ, {
      subject: "english",
      contentLocale: c.id,
      instructionLocale: c.id,
    });
    assert.match(String(localized.prompt || localized.question || ""), /Choose the correct word/i);
  }
});

test("Arabic wave public SEO inherits ar-001 (and ar-SA overlays)", () => {
  for (const c of COUNTRIES) {
    const guide = getGuidePageContentForLocale(c.id, "math-practice-at-home");
    assert.ok(guide);
    assert.match(String(guide.h1 || guide.displayTitle || ""), ARABIC_RE);
    const practice = getPracticePageContentForLocale(c.id, "math");
    assert.ok(practice);
    assert.match(String(practice.h1 || practice.displayTitle || ""), ARABIC_RE);
  }
  const saTeachers = getMarketingLandingContentForLocale("ar-SA", "teachers");
  assert.ok(saTeachers);
  assert.match(String(saTeachers.h1 || saTeachers.title || JSON.stringify(saTeachers)), ARABIC_RE);
});

test("Arabic wave inherits science/books/games/writing from ar-001 chain", () => {
  for (const c of COUNTRIES) {
    assert.equal(
      resolveLearningBookDraftsDir(c.id, "math", "g1"),
      resolveLearningBookDraftsDir("ar-001", "math", "g1")
    );
    const games = loadContentPack(c.id, "games", "burn-down-index.json");
    assert.ok(games && typeof games === "object");
    const writing = resolveWritingWordPacks(c.id);
    assert.ok(writing);
  }
});

test("Arabic wave report pack grade labels resolve", () => {
  assert.equal(
    reportPackCopyForLocale("ar-EG", "components__parent-report-detailed-surface", "grade"),
    "الصف"
  );
  assert.equal(
    reportPackCopyForLocale("ar-SA", "components__parent-report-detailed-surface", "grade"),
    "الصف"
  );
  assert.equal(
    reportPackCopyForLocale("ar-MA", "components__parent-report-detailed-surface", "grade"),
    "السنة"
  );
  assert.equal(
    reportPackCopyForLocale("ar-DZ", "components__parent-report-detailed-surface", "grade"),
    "السنة"
  );
  const dzReports = loadContentPack("ar-DZ", "reports", "burn-down-index.json");
  const dzGlobal = loadContentPack("ar-DZ", "global-burn-down", "burn-down-index.json");
  const blob = `${JSON.stringify(dzReports || {})}\n${JSON.stringify(dzGlobal || {})}`;
  assert.match(blob, /السنة 1 متوسط/);
  assert.equal(blob.includes("السنة 6"), false);
});

test("sampled Arabic wave UI has no Hebrew and carries Arabic chrome", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    const sample = [
      lookupMessage(bundles, "common.grade1"),
      lookupMessage(bundles, "ui.nav.home") || lookupMessage(bundles, "common.home"),
      lookupMessage(bundles, "school.portal.navDashboard"),
    ]
      .filter(Boolean)
      .join(" | ");
    assert.equal(HEBREW_RE.test(sample), false, c.id);
    assert.match(sample, ARABIC_RE, c.id);
  }
});
