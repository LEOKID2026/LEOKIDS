/**
 * Indonesian Master Phase 1 — foundation wiring only.
 * No translation completeness, Help, content-packs, or public SEO content.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
  getSelectableLocales,
  resolveDirection,
  isRtlLocale,
  LOCALE_REGISTRY,
  DEFAULT_LOCALE,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain, resolveContentLocale } from "../../lib/i18n/locale-resolution.js";
import { normalizeLocaleId } from "../../lib/i18n/locale-normalize.js";
import {
  stripLocaleFromPath,
  withLocalePath,
} from "../../lib/i18n/locale-path.js";
import {
  I18N_NAMESPACES,
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { buildCanonicalUrl, buildHreflangAlternates, resolveOgLocale } from "../../lib/seo/locale-seo.js";
import { resolveBrowserSpeechLang } from "../../lib/speech/locale-resolver.js";
import { resolveHelpLocale } from "../../data/help-center/index.js";
import { loadContentPack } from "../../lib/content/locale.server.js";

const ROOT = process.cwd();
const LOCALE = "id-ID";
const PREFIX = "id";
const SW_PATH = path.join(ROOT, "public/sw.js");

function loadSwOfflineHelpers() {
  const src = fs.readFileSync(SW_PATH, "utf8");
  const start = src.indexOf("const LOCALE_PUBLIC_PATH_PREFIX");
  const end = src.indexOf("const REWARD_CARD_PATH_PREFIX");
  assert.ok(start >= 0, "LOCALE_PUBLIC_PATH_PREFIX missing");
  assert.ok(end > start, "REWARD_CARD_PATH_PREFIX marker missing");
  const fnSrc = src.slice(start, end);
  // eslint-disable-next-line no-new-func
  return new Function(
    `${fnSrc}\nreturn { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale };`
  )();
}

const { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, isArabicOfflineUiLocale } =
  loadSwOfflineHelpers();

test("id-ID registry: path, selector, og, TTS, LTR", () => {
  const def = resolveLocaleDefinition(LOCALE);
  assert.equal(def.id, LOCALE);
  assert.equal(def.enabled, true);
  assert.equal(def.status, "enabled");
  assert.equal(def.pathPrefix, PREFIX);
  assert.equal(def.label, "Indonesia");
  assert.equal(def.nativeName, "Indonesia");
  assert.equal(def.fallbackLocale, "en");
  assert.equal(def.direction, "ltr");
  assert.equal(def.ogLocale, "id_ID");
  assert.equal(def.textToSpeechLocale, "id-ID");
  assert.equal(def.intlLocale, "id-ID");
  assert.equal(getPublicLocalePathPrefix(LOCALE), PREFIX);
  assert.equal(resolveLocaleIdFromPathPrefix(PREFIX), LOCALE);
  assert.equal(resolveDirection(LOCALE), "ltr");
  assert.equal(isRtlLocale(LOCALE), false);
  assert.equal(resolveOgLocale(LOCALE), "id_ID");
  assert.equal(resolveBrowserSpeechLang(LOCALE), "id-ID");
});

test("selector count is 93; Indonesia once; no duplicate ids/paths/labels", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 93);
  const hits = locales.filter((l) => l.id === LOCALE);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].label, "Indonesia");
  assert.equal(locales.filter((l) => l.label === "Indonesia").length, 1);
  assert.equal(locales.filter((l) => l.pathPrefix === PREFIX).length, 1);
  assert.ok(!LOCALE_REGISTRY.id);
  assert.ok(!locales.some((l) => l.id === "id"));

  const ids = locales.map((l) => l.id);
  const paths = locales.map((l) => l.pathPrefix || (l.id === "en" ? "" : l.id));
  const labels = locales.map((l) => l.label);
  assert.equal(new Set(ids).size, ids.length, "duplicate ids");
  assert.equal(new Set(paths).size, paths.length, "duplicate paths");
  assert.equal(new Set(labels).size, labels.length, "duplicate labels");
});

test("fallback chain is exactly id-ID → en", () => {
  assert.deepEqual(getLocaleFallbackChain(LOCALE), [LOCALE, "en"]);
  assert.ok(!getLocaleFallbackChain(LOCALE).includes("ar-001"));
  assert.ok(!getLocaleFallbackChain(LOCALE).includes("es-419"));
  assert.ok(!getLocaleFallbackChain(LOCALE).includes("pt-BR"));
});

test("locale normalization: id-ID / id-id; bare id is not a registry alias", () => {
  assert.equal(normalizeLocaleId("id-ID"), LOCALE);
  assert.equal(normalizeLocaleId("id-id"), LOCALE);
  assert.equal(normalizeLocaleId("ID-ID"), LOCALE);
  // Masters use pathPrefix for /id; bare language tag is not an alias (same as de/it/fr).
  assert.equal(normalizeLocaleId("id"), "id");
  assert.equal(resolveLocaleDefinition("id").id, "en");
});

test("exact /id path routing; no false /foo/id or mid-path matches", () => {
  assert.equal(stripLocaleFromPath("/id").locale, LOCALE);
  assert.equal(stripLocaleFromPath("/id/").locale, LOCALE);
  assert.equal(stripLocaleFromPath("/id/parents").locale, LOCALE);
  assert.equal(stripLocaleFromPath("/id/parents").pathname, "/parents");
  assert.equal(stripLocaleFromPath("/id/practice/math").locale, LOCALE);
  assert.equal(stripLocaleFromPath("/id/practice/math").pathname, "/practice/math");
  assert.equal(stripLocaleFromPath("/id/help").locale, LOCALE);
  assert.equal(stripLocaleFromPath("/id/parent/login").locale, LOCALE);

  assert.equal(withLocalePath(LOCALE, "/parents"), "/id/parents");
  assert.equal(withLocalePath(LOCALE, "/practice/math"), "/id/practice/math");
  assert.equal(withLocalePath(LOCALE, "/help"), "/id/help");
  assert.equal(withLocalePath(LOCALE, "/parent/login"), "/id/parent/login");

  // Mid-path / trailing identifier must not become Indonesian.
  assert.equal(stripLocaleFromPath("/foo/id").locale, null);
  assert.equal(stripLocaleFromPath("/foo/id").pathname, "/foo/id");
  assert.equal(stripLocaleFromPath("/some-id-value").locale, null);
  assert.equal(stripLocaleFromPath("/api/admin/rewards/cards/id").locale, null);
  assert.equal(stripLocaleFromPath("/teacher/class/id").locale, null);
});

test("message loader: id-ID own Indonesian leaves (Phase 3)", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(LOCALE);
  for (const ns of I18N_NAMESPACES) {
    assert.ok(bundles[ns] && typeof bundles[ns] === "object", ns);
  }
  assert.equal(lookupMessage(bundles, "common.grade1"), "Kelas 1");
  assert.notEqual(lookupMessage(bundles, "common.grade1"), "Grade 1");
  assert.ok(I18N_NAMESPACES.length >= 15);
});

test("hreflang / canonical / OG include id-ID public path", () => {
  const canon = buildCanonicalUrl("/parents", LOCALE);
  assert.match(canon, /\/id\/parents$/);
  const alts = buildHreflangAlternates("/parents");
  // buildHreflangAlternates uses ogLocale with '_' → '-' → id-ID
  const hit = alts.find((a) => a.locale === "id-ID");
  assert.ok(hit, "hreflang alternate for Indonesian");
  assert.match(hit.href, /\/id\/parents$/);
  assert.equal(resolveOgLocale(LOCALE), "id_ID");
});

test("SW: id-ID → /id/offline; map↔registry parity; not Arabic offline UI", () => {
  assert.equal(LOCALE_PUBLIC_PATH_PREFIX[LOCALE], PREFIX);
  assert.equal(offlineFallbackPath(LOCALE), "/id/offline");
  assert.equal(offlineFallbackPath("en"), "/offline");
  assert.equal(offlineFallbackPath("ar-001"), "/ar-001/offline");
  assert.equal(offlineFallbackPath("es-AR"), "/ar/offline");
  assert.equal(isArabicOfflineUiLocale(LOCALE), false);

  const expected = {};
  for (const [id, def] of Object.entries(LOCALE_REGISTRY)) {
    if (!def?.enabled) continue;
    if (id === "en" || id === DEFAULT_LOCALE) continue;
    const prefix = getPublicLocalePathPrefix(id);
    if (!prefix) continue;
    expected[id] = prefix;
  }
  assert.deepEqual(
    Object.keys(LOCALE_PUBLIC_PATH_PREFIX).sort(),
    Object.keys(expected).sort()
  );
  for (const id of Object.keys(expected)) {
    assert.equal(LOCALE_PUBLIC_PATH_PREFIX[id], expected[id], id);
  }
});

test("English subject content locale stays en under Indonesian interface", () => {
  // Explicit contentLocale wins; English-subject exception applies when resolving via interface/subject.
  assert.equal(
    resolveContentLocale({ subject: "english", interfaceLocale: LOCALE }),
    "en"
  );
  assert.equal(
    resolveContentLocale({ subject: "math", interfaceLocale: LOCALE }),
    LOCALE
  );
});

test("Phase 3 Help is id-ID; content packs load for id-ID", () => {
  assert.equal(resolveHelpLocale(LOCALE), LOCALE);
  assert.ok(loadContentPack(LOCALE, "learning", "burn-down-index.json"));
  assert.ok(loadContentPack(LOCALE, "reports", "burn-down-index.json"));
  assert.ok(loadContentPack(LOCALE, "games", "burn-down-index.json"));
});
