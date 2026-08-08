/**
 * Arabic country wave 2 shared wiring: Iraq (ar-IQ), Jordan (ar-JO),
 * UAE (ar-AE), Tunisia (ar-TN).
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
import { loadContentPack } from "../../lib/content/locale.server.js";
import { getCatalogPackExact, CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import { resolveHelpLocale, listArticles, getHelpSections } from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_AR_001 } from "../../data/english-questions/word-meanings/ar-001.js";
import {
  getGuidePageContentForLocale,
  getPracticePageContentForLocale,
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

function loadSwOfflineFallbackPath() {
  const src = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
  const start = src.indexOf("const LOCALE_PUBLIC_PATH_PREFIX");
  const end = src.indexOf("const REWARD_CARD_PATH_PREFIX");
  assert.ok(start >= 0 && end > start);
  // eslint-disable-next-line no-new-func
  return new Function(
    `${src.slice(start, end)}\nreturn { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale };`
  )();
}

const COUNTRIES = [
  {
    id: "ar-IQ",
    prefix: "iq",
    label: "Iraq",
    chain: ["ar-IQ", "ar-001", "en"],
    grade6: "الصف السادس",
    classLabel: "شعبة",
    helpLocale: "ar-IQ",
  },
  {
    id: "ar-JO",
    prefix: "jo",
    label: "Jordan",
    chain: ["ar-JO", "ar-001", "en"],
    grade6: "الصف السادس",
    classLabel: "شعبة",
    studentHit: "طالب",
    helpLocale: "ar-JO",
  },
  {
    id: "ar-AE",
    prefix: "ae",
    label: "United Arab Emirates",
    chain: ["ar-AE", "ar-001", "en"],
    grade6: "الصف السادس",
    classLabelIncludes: "الشعبة",
    helpLocale: "ar-AE",
  },
  {
    id: "ar-TN",
    prefix: "tn",
    label: "Tunisia",
    chain: ["ar-TN", "ar-001", "en"],
    grade6: "السنة السادسة",
    classLabel: "قسم",
    gradeField: "السنة",
    helpLocale: "ar-TN",
  },
];

test("Wave 2 selector includes IQ/JO/AE/TN once each (Wave 3 may raise total)", () => {
  const locales = getSelectableLocales();
  assert.ok(locales.length >= 84);
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

test("Wave 2 path prefixes iq/jo/ae/tn are free of collisions", () => {
  for (const c of COUNTRIES) {
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
  }
  assert.equal(resolveLocaleIdFromPathPrefix("ae"), "ar-AE");
  assert.equal(resolveLocaleIdFromPathPrefix("ar"), "es-AR");
});

for (const c of COUNTRIES) {
  test(`${c.id}: registry, path /${c.prefix}, fallback, RTL`, () => {
    const def = LOCALE_REGISTRY[c.id];
    assert.ok(def);
    assert.equal(def.enabled, true);
    assert.equal(def.selectorVisible, true);
    assert.equal(def.label, c.label);
    assert.equal(def.pathPrefix, c.prefix);
    assert.equal(def.direction, "rtl");
    assert.equal(def.fallbackLocale, "ar-001");
    assert.deepEqual(getLocaleFallbackChain(c.id), c.chain);
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
  });
}

test("Wave 2 countries stay isolated from siblings", () => {
  for (const c of COUNTRIES) {
    const chain = getLocaleFallbackChain(c.id);
    for (const other of COUNTRIES) {
      if (other.id === c.id) continue;
      assert.equal(chain.includes(other.id), false, `${c.id} must not fall back to ${other.id}`);
    }
    for (const w1 of ["ar-EG", "ar-SA", "ar-MA", "ar-DZ"]) {
      assert.equal(chain.includes(w1), false, `${c.id} must not fall back to ${w1}`);
    }
  }
});

test("Wave 2 disk↔loader namespace parity", () => {
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
      assert.ok(bundles[ns], `${c.id}: missing runtime namespace ${ns}`);
      const disk = JSON.parse(fs.readFileSync(path.join(locDir, `${ns}.json`), "utf8"));
      const stack = [{ obj: disk, prefix: ns }];
      while (stack.length) {
        const { obj, prefix } = stack.pop();
        if (!obj || typeof obj !== "object" || Array.isArray(obj)) continue;
        for (const [k, v] of Object.entries(obj)) {
          const key = `${prefix}.${k}`;
          if (typeof v === "string") {
            assert.equal(lookupMessage(bundles, key), v, `${c.id} ${key}`);
            const base = lookupMessage(ar001, key);
            if (base != null && base !== v) {
              assert.notEqual(lookupMessage(bundles, key), base, `${c.id} ${key} loader miss`);
            }
          } else if (v && typeof v === "object" && !Array.isArray(v)) {
            stack.push({ obj: v, prefix: key });
          }
        }
      }
    }
  }
});

test("Wave 2 content-pack catalog disk parity", () => {
  for (const c of COUNTRIES) {
    const disk = walkJson(path.join(ROOT, "content-packs", c.id)).map((p) =>
      p.replace(/\\/g, "/").split(`content-packs/${c.id}/`)[1]
    );
    const catalogKeys = Object.keys(CONTENT_PACK_CATALOG[c.id] || {}).sort();
    assert.equal(catalogKeys.length, disk.length, `${c.id} catalog vs disk count`);
    assert.deepEqual(catalogKeys, disk.sort());
    assert.ok(getCatalogPackExact(c.id, "demo/ui.json") || getCatalogPackExact(c.id, "rewards/ui.json"));
    assert.ok(loadContentPack(c.id, "rewards", "ui.json"), `${c.id} rewards`);
  }
});

test("Wave 2 Help resolution", () => {
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

test("Wave 2 effective grade/class terminology", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    assert.equal(lookupMessage(bundles, "common.grade6"), c.grade6, c.id);
    const classLabel = lookupMessage(bundles, "school.portal.classLabel");
    if (c.classLabel) assert.equal(classLabel, c.classLabel, c.id);
    if (c.classLabelIncludes) assert.match(String(classLabel || ""), new RegExp(c.classLabelIncludes));
    if (c.gradeField) {
      assert.equal(lookupMessage(bundles, "worksheets.gradeField"), c.gradeField, c.id);
    }
    if (c.studentHit) {
      assert.match(String(lookupMessage(bundles, "learning.master.defaultPlayerName") || ""), new RegExp(c.studentHit));
    }
    assert.equal(HEBREW_RE.test(String(lookupMessage(bundles, "common.grade6") || "")), false);
  }
});

test("Wave 2 UAE cycle wording does not map all grades 1–6 to Cycle 1 alone", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("ar-AE");
  const about = JSON.stringify(bundles.ui?.public?.about || bundles.ui?.about || {});
  const seo = JSON.stringify(bundles.seo || {});
  const blob = `${about}\n${seo}`;
  // Must not claim grades 1–6 are entirely Cycle 1 / الحلقة الأولى only.
  assert.doesNotMatch(blob, /الصفوف من 1 إلى 6 هي الحلقة الأولى/);
  assert.doesNotMatch(blob, /الدرجات 1[–-]6.*الحلقة الأولى فقط/);
});

test("Wave 2 word meanings inherit ar-001; public SEO inherits ar-001 (+ AE/TN/IQ overlays)", () => {
  const sampleCat = Object.keys(WORD_MEANINGS_AR_001 || {})[0];
  const word = Object.keys(WORD_MEANINGS_AR_001[sampleCat] || {})[0];
  assert.ok(sampleCat && word);
  for (const c of COUNTRIES) {
    const meaning = resolveEnglishWordMeaning(word, {
      listKey: sampleCat,
      instructionLocale: c.id,
    });
    assert.equal(meaning, WORD_MEANINGS_AR_001[sampleCat][word], c.id);
    const guide = getGuidePageContentForLocale(c.id, "math-practice-at-home");
    assert.ok(guide);
    assert.match(String(guide.h1 || guide.displayTitle || ""), ARABIC_RE);
    const practice = getPracticePageContentForLocale(c.id, "math");
    assert.ok(practice);
    assert.match(String(practice.h1 || practice.displayTitle || ""), ARABIC_RE);
  }
  const tnMathH1 = String(getPracticePageContentForLocale("ar-TN", "math")?.h1 || "");
  assert.match(tnMathH1, /السنة/);
  assert.doesNotMatch(tnMathH1, /حسب الصف/);

  resetLocaleBundleCache();
  const iq = loadLocaleBundles("ar-IQ");
  const iqMath = lookupMessage(iq, "learning.math.howToLearnSteps.step1");
  const iqGeo = lookupMessage(iq, "learning.geometry.howToLearnSteps.step1");
  const iqAbove = lookupMessage(
    iq,
    "copilot.answers.utils_parent-copilot_intent-answer-composers.according_to_the_report_there_is_still_insufficient_evidence_for"
  );
  assert.match(String(iqMath || ""), /اختر الصف/);
  assert.doesNotMatch(String(iqMath || ""), /اختر الدرجة/);
  assert.match(String(iqGeo || ""), /اختر الصف/);
  assert.doesNotMatch(String(iqGeo || ""), /اختر الدرجة/);
  assert.match(String(iqAbove || ""), /الصف المذكور/);
  assert.doesNotMatch(String(iqAbove || ""), /الدرجة المذكورة/);
  assert.match(
    String(getPracticePageContentForLocale("ar-IQ", "math")?.h1 || ""),
    /حسب الصف/
  );
  const iqWordBands = [
    "الصفان الأول والثاني",
    "الصفان الثالث والرابع",
    "الصفان الخامس والسادس",
  ];
  for (const slug of ["math", "english", "reading", "geometry", "science", "games", "no-print"]) {
    const blob = JSON.stringify(getPracticePageContentForLocale("ar-IQ", slug) || {});
    for (const band of iqWordBands) {
      assert.match(blob, new RegExp(band.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `ar-IQ ${slug} ${band}`);
    }
    assert.doesNotMatch(blob, /الصفوف\s*[1-6]\s*[–-]\s*[1-6]/);
    assert.doesNotMatch(blob, /الصف\s+[1-6]/);
  }
  const iqHub = JSON.stringify(getPracticePageContentForLocale("ar-IQ", "hub") || {});
  assert.match(iqHub, /للصفوف الأول|الأول إلى السادس|الأول–السادس/);
  assert.doesNotMatch(iqHub, /للصفوف\s*1\s*[–-]\s*6/);
});

test("Wave 2 SW offlineFallbackPath uses public prefixes + Wave 1/Argentina regressions", () => {
  const { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale } =
    loadSwOfflineFallbackPath();
  for (const c of COUNTRIES) {
    assert.equal(LOCALE_PUBLIC_PATH_PREFIX[c.id], c.prefix, c.id);
    assert.equal(offlineFallbackPath(c.id), `/${c.prefix}/offline`, c.id);
    assert.notEqual(offlineFallbackPath(c.id), `/${c.id}/offline`, c.id);
    assert.equal(isArabicOfflineUiLocale(c.id), true, c.id);
  }
  assert.equal(offlineFallbackPath("es-AR"), "/ar/offline");
  assert.equal(isArabicOfflineUiLocale("es-AR"), false);
  assert.equal(offlineFallbackPath("ar-EG"), "/eg/offline");
  assert.equal(offlineFallbackPath("ar-SA"), "/sa/offline");
  assert.equal(offlineFallbackPath("ar-MA"), "/ma/offline");
  assert.equal(offlineFallbackPath("ar-DZ"), "/dz/offline");
  assert.equal(offlineFallbackPath("ar-001"), "/ar-001/offline");

  // Full map parity vs registry for enabled non-default locales
  for (const [id, def] of Object.entries(LOCALE_REGISTRY)) {
    if (!def?.enabled || id === "en") continue;
    const prefix = getPublicLocalePathPrefix(id);
    if (!prefix) continue;
    assert.equal(LOCALE_PUBLIC_PATH_PREFIX[id], prefix, `SW map drift ${id}`);
  }
});

test("Wave 2 bare ar remains Argentina; Arabic Master label preserved", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("ar"), "es-AR");
  assert.equal(stripLocaleFromPath("/ar/parents").locale, "es-AR");
  assert.equal(resolveLocaleDefinition("ar-001").label, "العربية");
});
