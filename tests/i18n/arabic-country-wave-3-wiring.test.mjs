/**
 * Arabic country wave 3 shared wiring: Kuwait (ar-KW), Qatar (ar-QA),
 * Oman (ar-OM), Bahrain (ar-BH).
 *
 * Base authority: ar-001. Fallback: country → ar-001 → en.
 * Qatar public path /qa must not be treated as internal QA tooling.
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
import { getClientPublicSeoOverlay } from "../../lib/seo/public-seo-ar-001-client-index.js";
import {
  getGuidePageContentForLocale,
  getPracticePageContentForLocale,
} from "../../lib/seo/locale-public-seo-content.js";
import {
  shouldShowLayoutLanguageSwitcher,
  isQatarPublicLocalePath,
  isInternalQaToolingPath,
} from "../../lib/site-nav.js";

const ROOT = process.cwd();
const ARABIC_RE = /[\u0600-\u06FF]/;

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
    id: "ar-KW",
    prefix: "kw",
    label: "الكويت",
    chain: ["ar-KW", "ar-001", "en"],
    grade6: "الصف السادس",
    gradeField: "الصف",
    classLabel: "فصل",
    studentHit: "طالب",
    helpLocale: "ar-KW",
  },
  {
    id: "ar-QA",
    prefix: "qa",
    label: "قطر",
    chain: ["ar-QA", "ar-001", "en"],
    grade6: "الصف السادس",
    gradeField: "الصف",
    classLabel: "شعبة",
    studentHit: "طالب",
    helpLocale: "ar-QA",
  },
  {
    id: "ar-OM",
    prefix: "om",
    label: "عُمان",
    chain: ["ar-OM", "ar-001", "en"],
    grade6: "الصف السادس",
    gradeField: "الصف",
    classLabelIncludes: "شعبة",
    studentHit: "طالب",
    helpLocale: "ar-OM",
  },
  {
    id: "ar-BH",
    prefix: "bh",
    label: "البحرين",
    chain: ["ar-BH", "ar-001", "en"],
    grade6: "الصف السادس",
    gradeField: "الصف",
    classLabelIncludes: "صف",
    studentHit: "طالب",
    helpLocale: "ar-BH",
  },
];

test("Wave 3 selector count is 89 and includes new countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 89);
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

test("Wave 3 path prefixes kw/qa/om/bh are free of collisions", () => {
  for (const c of COUNTRIES) {
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
  }
  assert.equal(resolveLocaleIdFromPathPrefix("qa"), "ar-QA");
  assert.equal(resolveLocaleIdFromPathPrefix("ar"), "es-AR");
});

test("Qatar /qa carve-out: locale product surface vs internal QA tooling", () => {
  assert.equal(isQatarPublicLocalePath("/qa"), true);
  assert.equal(isQatarPublicLocalePath("/qa/parents"), true);
  assert.equal(isInternalQaToolingPath("/qa"), false);
  assert.equal(isInternalQaToolingPath("/qa/student/home"), false);
  assert.equal(isInternalQaToolingPath("/tools/qa"), true);
  assert.equal(isInternalQaToolingPath("/tools/qa/report"), true);
  assert.equal(isInternalQaToolingPath("/internal/qa/x"), true);
  assert.equal(shouldShowLayoutLanguageSwitcher("/qa"), true);
  assert.equal(shouldShowLayoutLanguageSwitcher("/qa/practice/math"), true);
  assert.equal(shouldShowLayoutLanguageSwitcher("/tools/qa"), false);
  assert.equal(shouldShowLayoutLanguageSwitcher("/tools/qa/x"), false);
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

test("Wave 3 countries stay isolated from siblings and prior Arabic waves", () => {
  for (const c of COUNTRIES) {
    const chain = getLocaleFallbackChain(c.id);
    for (const other of COUNTRIES) {
      if (other.id === c.id) continue;
      assert.equal(chain.includes(other.id), false, `${c.id} must not fall back to ${other.id}`);
    }
    for (const prior of ["ar-EG", "ar-SA", "ar-MA", "ar-DZ", "ar-IQ", "ar-JO", "ar-AE", "ar-TN"]) {
      assert.equal(chain.includes(prior), false, `${c.id} must not fall back to ${prior}`);
    }
  }
});

test("Wave 3 disk↔loader namespace parity", () => {
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

test("Wave 3 content-pack catalog disk parity", () => {
  for (const c of COUNTRIES) {
    const disk = walkJson(path.join(ROOT, "content-packs", c.id)).map((p) =>
      p.replace(/\\/g, "/").split(`content-packs/${c.id}/`)[1]
    );
    const catalogKeys = Object.keys(CONTENT_PACK_CATALOG[c.id] || {}).sort();
    assert.equal(catalogKeys.length, disk.length, `${c.id} catalog vs disk count`);
    assert.deepEqual(catalogKeys, disk.sort());
    assert.ok(getCatalogPackExact(c.id, "demo/ui.json") || getCatalogPackExact(c.id, "rewards/ui.json"));
    assert.ok(loadContentPack(c.id, "rewards", "ui.json") || loadContentPack(c.id, "demo", "ui.json"));
  }
});

test("Wave 3 public-seo runtime index parity", () => {
  for (const c of COUNTRIES) {
    const seoRoot = path.join(ROOT, "content-packs", c.id, "public-seo");
    const disk = walkJson(seoRoot).map((p) =>
      p.replace(/\\/g, "/").split(`content-packs/${c.id}/public-seo/`)[1]
    );
    for (const rel of disk) {
      assert.ok(
        getClientPublicSeoOverlay(c.id, ...rel.split("/")),
        `${c.id} missing runtime SEO ${rel}`
      );
    }
    const practice = getPracticePageContentForLocale(c.id, "math");
    assert.ok(practice);
    assert.match(String(practice.h1 || practice.displayTitle || ""), ARABIC_RE);
    const guide = getGuidePageContentForLocale(c.id, "math-practice-at-home");
    assert.ok(guide);
    assert.match(String(guide.h1 || guide.displayTitle || ""), ARABIC_RE);
  }
});

test("Wave 3 Help resolution", () => {
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

test("Wave 3 effective grade/class terminology", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    assert.equal(lookupMessage(bundles, "common.grade6"), c.grade6, c.id);
    if (c.gradeField) {
      assert.equal(lookupMessage(bundles, "worksheets.gradeField"), c.gradeField, c.id);
    }
    const classLabel = lookupMessage(bundles, "school.portal.classLabel");
    if (c.classLabel) assert.equal(classLabel, c.classLabel, c.id);
    if (c.classLabelIncludes) {
      assert.match(String(classLabel || ""), new RegExp(c.classLabelIncludes));
    }
    if (c.studentHit) {
      assert.match(
        String(lookupMessage(bundles, "learning.master.defaultPlayerName") || ""),
        new RegExp(c.studentHit)
      );
    }
  }
});

test("Wave 3 SW offlineFallbackPath uses public prefixes + prior regressions", () => {
  const { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale } =
    loadSwOfflineFallbackPath();
  for (const c of COUNTRIES) {
    assert.equal(LOCALE_PUBLIC_PATH_PREFIX[c.id], c.prefix, c.id);
    assert.equal(offlineFallbackPath(c.id), `/${c.prefix}/offline`, c.id);
    assert.equal(isArabicOfflineUiLocale(c.id), true, c.id);
  }
  assert.equal(offlineFallbackPath("es-AR"), "/ar/offline");
  assert.equal(isArabicOfflineUiLocale("es-AR"), false);
  assert.equal(offlineFallbackPath("ar-IQ"), "/iq/offline");
  assert.equal(offlineFallbackPath("ar-JO"), "/jo/offline");
  assert.equal(offlineFallbackPath("ar-AE"), "/ae/offline");
  assert.equal(offlineFallbackPath("ar-TN"), "/tn/offline");
  assert.equal(offlineFallbackPath("ar-001"), "/ar-001/offline");
  assert.equal(offlineFallbackPath("en"), "/offline");

  for (const [id, def] of Object.entries(LOCALE_REGISTRY)) {
    if (!def?.enabled || id === "en") continue;
    const prefix = getPublicLocalePathPrefix(id);
    if (!prefix) continue;
    assert.equal(LOCALE_PUBLIC_PATH_PREFIX[id], prefix, `SW map drift ${id}`);
  }
});

test("Wave 2 / Argentina / Master regressions remain intact", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("iq"), "ar-IQ");
  assert.equal(resolveLocaleIdFromPathPrefix("jo"), "ar-JO");
  assert.equal(resolveLocaleIdFromPathPrefix("ae"), "ar-AE");
  assert.equal(resolveLocaleIdFromPathPrefix("tn"), "ar-TN");
  assert.equal(resolveLocaleIdFromPathPrefix("ar"), "es-AR");
  assert.equal(resolveLocaleDefinition("ar-001").label, "العربية");
  assert.deepEqual(getLocaleFallbackChain("ar-TN"), ["ar-TN", "ar-001", "en"]);
  const tnMath = getPracticePageContentForLocale("ar-TN", "math");
  assert.match(String(tnMath?.h1 || ""), /السنة/);
  assert.doesNotMatch(String(tnMath?.h1 || ""), /حسب الصف/);
});
