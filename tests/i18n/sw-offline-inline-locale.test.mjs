/**
 * F1 / F1-R1: Service Worker offlineFallbackPath must use public pathPrefix
 * (not raw locale id). Inline Arabic offline must use that helper.
 * Argentina es-AR → /ar/offline; not Arabic UI.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  LOCALE_REGISTRY,
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  DEFAULT_LOCALE,
} from "../../lib/i18n/locale-registry.js";

const ROOT = process.cwd();
const SW_PATH = path.join(ROOT, "public/sw.js");

function loadSwOfflineHelpers() {
  const src = fs.readFileSync(SW_PATH, "utf8");
  const start = src.indexOf("const LOCALE_PUBLIC_PATH_PREFIX");
  const end = src.indexOf("const REWARD_CARD_PATH_PREFIX");
  assert.ok(start >= 0, "LOCALE_PUBLIC_PATH_PREFIX missing from public/sw.js");
  assert.ok(end > start, "REWARD_CARD_PATH_PREFIX marker missing");
  const fnSrc = src.slice(start, end);
  assert.match(fnSrc, /function offlineFallbackPath/);
  assert.match(fnSrc, /function isArabicOfflineUiLocale/);
  assert.match(fnSrc, /function offlineInlineFallbackHtml/);
  // eslint-disable-next-line no-new-func
  return new Function(
    `${fnSrc}\nreturn { LOCALE_PUBLIC_PATH_PREFIX, offlineFallbackPath, offlineInlineFallbackHtml, isArabicOfflineUiLocale };`
  )();
}

const {
  LOCALE_PUBLIC_PATH_PREFIX,
  offlineFallbackPath,
  offlineInlineFallbackHtml,
  isArabicOfflineUiLocale,
} = loadSwOfflineHelpers();

function hrefFromInlineHtml(html) {
  const m = String(html || "").match(/<a\s+href="([^"]+)"/i);
  return m ? m[1] : null;
}

const ARABIC_CASES = [
  { id: "ar-EG", path: "/eg/offline" },
  { id: "ar-SA", path: "/sa/offline" },
  { id: "ar-MA", path: "/ma/offline" },
  { id: "ar-DZ", path: "/dz/offline" },
  { id: "ar-001", path: "/ar-001/offline" },
];

test("F1-R1: offlineFallbackPath(es-AR) uses public /ar (not /es-AR)", () => {
  assert.equal(offlineFallbackPath("es-AR"), "/ar/offline");
  assert.notEqual(offlineFallbackPath("es-AR"), "/es-AR/offline");
});

test("F1: offlineFallbackPath maps Arabic countries + master", () => {
  for (const c of ARABIC_CASES) {
    assert.equal(offlineFallbackPath(c.id), c.path, c.id);
  }
});

test("F1-R1: SW LOCALE_PUBLIC_PATH_PREFIX parity vs locale-registry", () => {
  const expected = {};
  for (const [id, def] of Object.entries(LOCALE_REGISTRY)) {
    if (!def?.enabled) continue;
    if (id === "en" || id === DEFAULT_LOCALE) continue;
    const prefix = getPublicLocalePathPrefix(id);
    if (!prefix) continue;
    expected[id] = prefix;
  }
  const swKeys = Object.keys(LOCALE_PUBLIC_PATH_PREFIX).sort();
  const regKeys = Object.keys(expected).sort();
  assert.deepEqual(swKeys, regKeys, "SW prefix map keys must match enabled registry locales");
  for (const id of regKeys) {
    assert.equal(
      LOCALE_PUBLIC_PATH_PREFIX[id],
      expected[id],
      `${id} public prefix drift`
    );
    assert.equal(
      offlineFallbackPath(id),
      `/${expected[id]}/offline`,
      `${id} offlineFallbackPath`
    );
  }
});

test("F1-R1: sample locales where localeId != public pathPrefix", () => {
  const samples = [
    ["es-AR", "ar"],
    ["pt-BR", "br"],
    ["en-GB", "eng"],
    ["fr-CA", "ca-fr"],
    ["es-MX", "mx"],
  ];
  for (const [id, prefix] of samples) {
    assert.equal(getPublicLocalePathPrefix(id), prefix, id);
    assert.equal(offlineFallbackPath(id), `/${prefix}/offline`, id);
  }
});

test("F1: inline offline HTML link uses offlineFallbackPath (not hardcoded ar-001 for countries)", () => {
  for (const c of ARABIC_CASES) {
    const html = offlineInlineFallbackHtml(c.id);
    const href = hrefFromInlineHtml(html);
    assert.equal(href, c.path, `${c.id} inline href`);
    if (c.id !== "ar-001") {
      assert.notEqual(href, "/ar-001/offline", `${c.id} must not link to master offline`);
    }
    assert.match(html, /dir="rtl"/);
    assert.match(html, /lang="ar"/);
  }
});

test("F1: Argentina es-AR is not Arabic offline UI; /ar remains Argentina", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("ar"), "es-AR");
  assert.equal(isArabicOfflineUiLocale("es-AR"), false);
  assert.equal(isArabicOfflineUiLocale("ar-EG"), true);
  assert.equal(isArabicOfflineUiLocale("ar-001"), true);

  const html = offlineInlineFallbackHtml("es-AR");
  assert.doesNotMatch(html, /dir="rtl"/);
  assert.doesNotMatch(html, /lang="ar"/);
  assert.doesNotMatch(html, /\/ar-001\/offline/);
  assert.equal(offlineFallbackPath("es-AR"), "/ar/offline");
});

test("F1: source uses public-prefix map + offlineFallbackPath(loc) for inline link", () => {
  const src = fs.readFileSync(SW_PATH, "utf8");
  assert.match(src, /const LOCALE_PUBLIC_PATH_PREFIX/);
  assert.match(src, /const offlinePath = offlineFallbackPath\(loc\)/);
  const inlineFn = src.slice(
    src.indexOf("function offlineInlineFallbackHtml"),
    src.indexOf("const REWARD_CARD_PATH_PREFIX")
  );
  assert.match(inlineFn, /offlinePath/);
  assert.doesNotMatch(inlineFn, /href="\/ar-001\/offline"/);
  // Must not hardcode es-AR → /es-AR/offline fallback pattern as sole authority
  assert.doesNotMatch(
    src.slice(src.indexOf("function offlineFallbackPath"), src.indexOf("function isArabicOfflineUiLocale")),
    /if \(loc === "es-AR"\)/
  );
});
