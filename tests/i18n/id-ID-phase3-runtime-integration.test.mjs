/**
 * Indonesian Master Phase 3 — runtime integration (namespaces, Help, Public SEO).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  I18N_NAMESPACES,
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import {
  getSelectableLocales,
  resolveLocaleDefinition,
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveDirection,
  isRtlLocale,
  DEFAULT_LOCALE,
  LOCALE_REGISTRY,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain, resolveContentLocale } from "../../lib/i18n/locale-resolution.js";
import { stripLocaleFromPath, withLocalePath } from "../../lib/i18n/locale-path.js";
import { buildCanonicalUrl, buildHreflangAlternates, resolveOgLocale } from "../../lib/seo/locale-seo.js";
import { resolveBrowserSpeechLang } from "../../lib/speech/locale-resolver.js";
import {
  resolveHelpLocale,
  getHelpSections,
  listArticles,
  getArticle,
  ALL_ARTICLES_ID_ID,
  SECTIONS_ID_ID,
  ALL_ARTICLES,
} from "../../data/help-center/index.js";
import {
  getGuidePageContentForLocale,
  getPracticePageContentForLocale,
  getMarketingLandingContentForLocale,
  getWorksheetsPageContentForLocale,
  getGuideHubCardsForLocale,
  getPracticeHubCardsForLocale,
} from "../../lib/seo/locale-public-seo-content.js";
import { getLegalPolicyBundleForLocale } from "../../lib/legal/locale-legal-content.js";
import { getClientPublicSeoOverlay } from "../../lib/seo/client-public-seo-overlay.js";
import { ID_ID_PUBLIC_SEO_KEYS } from "../../lib/seo/public-seo-id-ID-client-index.js";
import { CONTENT_PACK_CATALOG, getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import { loadContentPack } from "../../lib/content/locale.server.js";
import { SEO_PUBLIC_PATHS } from "../../lib/seo/seo-public-paths.js";

const ROOT = process.cwd();
const LOCALE = "id-ID";
const PREFIX = "id";
const PLACEHOLDER_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;

function collectStringLeaves(v, prefix, out) {
  if (typeof v === "string") {
    out.set(prefix, v);
    return;
  }
  if (Array.isArray(v)) {
    v.forEach((item, i) => {
      const p = `${prefix}[${i}]`;
      if (typeof item === "string") out.set(p, item);
      else collectStringLeaves(item, p, out);
    });
    return;
  }
  if (v && typeof v === "object") {
    for (const [k, child] of Object.entries(v)) {
      collectStringLeaves(child, prefix ? `${prefix}.${k}` : k, out);
    }
  }
}

function loadDiskLeaves(locale, ns) {
  const file = path.join(ROOT, "locales", locale, `${ns}.json`);
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const leaves = new Map();
  collectStringLeaves(json, "", leaves);
  return leaves;
}

function walkJsonFiles(dir, base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJsonFiles(p, rel));
    else if (e.name.endsWith(".json")) out.push(rel.replace(/\\/g, "/"));
  }
  return out.sort();
}

function loadSwHelpers() {
  const src = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
  const start = src.indexOf("const LOCALE_PUBLIC_PATH_PREFIX");
  const end = src.indexOf("const REWARD_CARD_PATH_PREFIX");
  // eslint-disable-next-line no-new-func
  return new Function(
    `${src.slice(start, end)}\nreturn { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale };`
  )();
}

test("foundation: id-ID path/selector/fallback/LTR/og/TTS/SW", () => {
  const def = resolveLocaleDefinition(LOCALE);
  assert.equal(def.pathPrefix, PREFIX);
  assert.equal(def.label, "Indonesia");
  assert.equal(getSelectableLocales().length, 93);
  assert.deepEqual(getLocaleFallbackChain(LOCALE), [LOCALE, "en"]);
  assert.equal(resolveDirection(LOCALE), "ltr");
  assert.equal(isRtlLocale(LOCALE), false);
  assert.equal(resolveOgLocale(LOCALE), "id_ID");
  assert.equal(resolveBrowserSpeechLang(LOCALE), "id-ID");
  assert.equal(withLocalePath(LOCALE, "/help"), "/id/help");
  assert.match(buildCanonicalUrl("/parents", LOCALE), /\/id\/parents$/);
  assert.ok(buildHreflangAlternates("/parents").some((a) => a.locale === "id-ID"));

  const { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale } = loadSwHelpers();
  assert.equal(LOCALE_PUBLIC_PATH_PREFIX[LOCALE], PREFIX);
  assert.equal(offlineFallbackPath(LOCALE), "/id/offline");
  assert.equal(isArabicOfflineUiLocale(LOCALE), false);
  assert.equal(offlineFallbackPath("es-AR"), "/ar/offline");
  assert.equal(offlineFallbackPath("en"), "/offline");
  assert.equal(offlineFallbackPath("ar-001"), "/ar-001/offline");
});

test("namespace runtime: all I18N_NAMESPACES registered with dynamic EN/ID parity", () => {
  resetLocaleBundleCache();
  // Prefer inspecting registered bundle map if exported; else loadLocaleBundles + disk.
  const bundles = loadLocaleBundles(LOCALE);
  let own = 0;
  let enTotal = 0;
  let missing = 0;
  let extra = 0;
  let empty = 0;
  let ph = 0;

  for (const ns of I18N_NAMESPACES) {
    const en = loadDiskLeaves("en", ns);
    const idDisk = loadDiskLeaves("id-ID", ns);
    const idRuntime = new Map();
    collectStringLeaves(bundles[ns], "", idRuntime);
    enTotal += en.size;
    own += idDisk.size;
    assert.equal(idRuntime.size, en.size, `${ns} runtime leaf count`);
    for (const [k, enVal] of en) {
      assert.ok(idRuntime.has(k), `${ns} missing ${k}`);
      const idVal = idRuntime.get(k);
      if (!String(idVal || "").trim()) empty += 1;
      const enPh = [...String(enVal).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort().join(",");
      const idPh = [...String(idVal).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort().join(",");
      if (enPh !== idPh) ph += 1;
    }
    for (const k of idRuntime.keys()) if (!en.has(k)) extra += 1;
    for (const k of en.keys()) if (!idRuntime.has(k)) missing += 1;

    // Own locale must equal disk Indonesian (not English) for a translated sample key when values differ.
    for (const [k, idVal] of idDisk) {
      assert.equal(idRuntime.get(k), idVal, `${ns}.${k} runtime must be id-ID own leaf`);
    }
  }

  assert.ok(enTotal > 0, "EN namespaces must have string leaves");
  assert.equal(own, enTotal, `id-ID disk leaves must match EN (en=${enTotal}, id=${own})`);
  assert.equal(missing, 0);
  assert.equal(extra, 0);
  assert.equal(empty, 0);
  assert.equal(ph, 0);

  // Representative lookups must differ from English where translations differ.
  assert.equal(lookupMessage(bundles, "common.grade1"), "Kelas 1");
  assert.notEqual(lookupMessage(bundles, "common.grade1"), "Grade 1");
  assert.equal(lookupMessage(bundles, "auth.signIn"), "Masuk");
  assert.equal(lookupMessage(bundles, "school.portal.navDashboard"), "Dasbor");
  assert.notEqual(lookupMessage(bundles, "school.portal.navDashboard"), "Dashboard");
  assert.match(String(lookupMessage(bundles, "ui.nav.helpCenter") || ""), /Pusat/i);
  assert.match(String(lookupMessage(bundles, "seo.homeTitle") || ""), /Leo Kids/);
  assert.match(String(lookupMessage(bundles, "seo.homeTitle") || ""), /Latihan|murid|sekolah/i);
});

test("Help: resolveHelpLocale id-ID; 4 sections; 40 articles; slug parity", () => {
  assert.equal(resolveHelpLocale(LOCALE), LOCALE);
  assert.equal(resolveHelpLocale("id-id"), LOCALE);
  // bare id remains English Help (not a registry alias)
  assert.equal(resolveHelpLocale("id"), "en");

  const sections = getHelpSections(LOCALE);
  assert.equal(Object.keys(sections).length, 4);
  assert.equal(Object.keys(SECTIONS_ID_ID).length, 4);
  assert.equal(ALL_ARTICLES_ID_ID.length, 40);

  const enSlugs = new Set(ALL_ARTICLES.map((a) => `${a.section}/${a.slug}`));
  const idSlugs = ALL_ARTICLES_ID_ID.map((a) => `${a.section}/${a.slug}`);
  assert.equal(new Set(idSlugs).size, 40);
  for (const s of idSlugs) assert.ok(enSlugs.has(s), `extra or unknown ${s}`);
  for (const s of enSlugs) assert.ok(idSlugs.includes(s), `missing ${s}`);

  for (const key of ["parents", "students", "parent-report", "subjects"]) {
    const arts = listArticles(key, LOCALE);
    assert.ok(arts.length > 0, key);
    const sample = arts[0];
    const got = getArticle(key, sample.slug, LOCALE);
    assert.ok(got);
    assert.equal(got.slug, sample.slug);
    assert.notEqual(got.title, getArticle(key, sample.slug, "en")?.title);
  }
});

test("Public SEO: 28 disk = 28 client = 28 catalog; runtime localized", () => {
  const disk = walkJsonFiles(path.join(ROOT, "content-packs/id-ID/public-seo"));
  assert.equal(disk.length, 28);
  assert.equal(ID_ID_PUBLIC_SEO_KEYS.length, 28);
  assert.deepEqual([...ID_ID_PUBLIC_SEO_KEYS].sort(), disk);

  const catalogKeys = Object.keys(CONTENT_PACK_CATALOG[LOCALE] || {})
    .filter((k) => k.startsWith("public-seo/"))
    .map((k) => k.slice("public-seo/".length))
    .sort();
  assert.equal(catalogKeys.length, 28);
  assert.deepEqual(catalogKeys, disk);

  // Phase 5 adds full-master non-SEO root packs; public-seo must remain exactly 28.
  const nonSeo = Object.keys(CONTENT_PACK_CATALOG[LOCALE] || {}).filter(
    (k) => !k.startsWith("public-seo/")
  );
  assert.equal(nonSeo.length, 28);
  assert.deepEqual(nonSeo.sort(), Object.keys(CONTENT_PACK_CATALOG.en || {}).sort());

  for (const rel of disk) {
    assert.ok(getClientPublicSeoOverlay(LOCALE, ...rel.split("/")));
    assert.ok(getCatalogPackExact(LOCALE, `public-seo/${rel}`));
  }
  assert.equal(getClientPublicSeoOverlay("en", "practice", "math.json"), null);

  const math = getPracticePageContentForLocale(LOCALE, "math");
  const mathEn = getPracticePageContentForLocale("en", "math");
  assert.ok(math?.h1);
  assert.notEqual(math.h1, mathEn.h1);

  const kids = getMarketingLandingContentForLocale(LOCALE, "kids");
  const kidsEn = getMarketingLandingContentForLocale("en", "kids");
  assert.ok(kids?.hero?.title || kids?.pageTitle);
  assert.notEqual(kids.hero?.title, kidsEn.hero?.title);
  assert.notEqual(kids.pageTitle, kidsEn.pageTitle);

  const guide = getGuidePageContentForLocale(LOCALE, "math-practice-at-home");
  const guideEn = getGuidePageContentForLocale("en", "math-practice-at-home");
  assert.ok(guide?.h1);
  assert.notEqual(guide.h1, guideEn.h1);

  const ws = getWorksheetsPageContentForLocale(LOCALE);
  const wsEn = getWorksheetsPageContentForLocale("en");
  assert.ok(ws?.h1);
  // worksheets may partially use burn-down; still expect overlay fields differ where present
  assert.notEqual(JSON.stringify(ws), JSON.stringify(wsEn));

  const legal = getLegalPolicyBundleForLocale(LOCALE);
  const legalEn = getLegalPolicyBundleForLocale("en");
  assert.notEqual(
    legal.parentReportDisclaimerTitle,
    legalEn.parentReportDisclaimerTitle
  );

  assert.ok(SEO_PUBLIC_PATHS.length >= 40);
  // Coverage: practice + guide hubs/pages that have overlays resolve Indonesian H1/title
  for (const slug of ["hub", "math", "geometry", "science", "english", "games", "reading", "no-print", "parent-reports"]) {
    const page = getPracticePageContentForLocale(LOCALE, slug);
    const en = getPracticePageContentForLocale("en", slug);
    assert.ok(page, slug);
    if (page.h1 && en?.h1) assert.notEqual(page.h1, en.h1, `practice ${slug}`);
  }
  assert.ok(getGuideHubCardsForLocale(LOCALE));
  assert.ok(getPracticeHubCardsForLocale(LOCALE));
});

test("English-subject content stays EN; UI/SEO chrome is ID", () => {
  assert.equal(
    resolveContentLocale({ subject: "english", interfaceLocale: LOCALE }),
    "en"
  );
  const seo = getPracticePageContentForLocale(LOCALE, "english");
  const seoEn = getPracticePageContentForLocale("en", "english");
  assert.ok(seo?.h1);
  assert.notEqual(seo.h1, seoEn.h1);
});

test("Phase5 wired non-SEO packs resolve from id-ID catalog (not en-only fallback)", () => {
  assert.ok(loadContentPack(LOCALE, "learning", "burn-down-index.json"));
  assert.ok(loadContentPack(LOCALE, "reports", "burn-down-index.json"));
  assert.ok(loadContentPack(LOCALE, "games", "burn-down-index.json"));
  assert.ok(getCatalogPackExact(LOCALE, "learning/burn-down-index.json"));
  assert.ok(getCatalogPackExact(LOCALE, "reports/burn-down-index.json"));
  assert.ok(getCatalogPackExact(LOCALE, "games/burn-down-index.json"));
  assert.notEqual(
    JSON.stringify(getCatalogPackExact(LOCALE, "learning/burn-down-index.json")),
    JSON.stringify(getCatalogPackExact("en", "learning/burn-down-index.json"))
  );
});

test("existing locale regressions compact", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("ar"), "es-AR");
  assert.equal(getPublicLocalePathPrefix("ar-001"), "ar-001");
  assert.equal(getPublicLocalePathPrefix("es-419"), "es-419");
  assert.deepEqual(getLocaleFallbackChain("ar-001"), ["ar-001", "en"]);
  assert.ok(LOCALE_REGISTRY.en?.enabled);
  assert.equal(stripLocaleFromPath("/ar/parents").locale, "es-AR");
  assert.equal(stripLocaleFromPath("/ar-001/parents").locale, "ar-001");
  assert.equal(stripLocaleFromPath("/id/parents").locale, LOCALE);
});
