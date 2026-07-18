import test from "node:test";
import assert from "node:assert/strict";
import {
  stripLocaleFromPath,
  withLocalePath,
  getLocaleFromPath,
  isLocalizedPath,
  canonicalizeLocalizedPath,
  buildLocalizedHref,
  isLocaleRoutingExcluded,
  shouldRedirectPrefixedDefaultLocale,
  isLocaleRoutable,
} from "../../lib/i18n/locale-path.js";

test("stripLocaleFromPath: extracts enabled locale prefix", () => {
  assert.deepEqual(stripLocaleFromPath("/en-XA/parent/dashboard"), {
    locale: "en-XA",
    pathname: "/parent/dashboard",
    hadPrefix: true,
  });
  assert.deepEqual(stripLocaleFromPath("/ar-XB/learning"), {
    locale: "ar-XB",
    pathname: "/learning",
    hadPrefix: true,
  });
});

test("stripLocaleFromPath: Hebrew /he is never a locale segment", () => {
  assert.deepEqual(stripLocaleFromPath("/he/parent/dashboard"), {
    locale: null,
    pathname: "/he/parent/dashboard",
    hadPrefix: false,
  });
  assert.equal(getLocaleFromPath("/he/about"), null);
});

test("stripLocaleFromPath: registered disabled locale still strips prefix", () => {
  assert.deepEqual(stripLocaleFromPath("/es/about"), {
    locale: "es",
    pathname: "/about",
    hadPrefix: true,
  });
  assert.deepEqual(stripLocaleFromPath("/about"), {
    locale: null,
    pathname: "/about",
    hadPrefix: false,
  });
});

test("withLocalePath: default en stays unprefixed", () => {
  assert.equal(withLocalePath("en", "/parent/dashboard"), "/parent/dashboard");
  assert.equal(withLocalePath("en-US", "/"), "/");
  assert.equal(withLocalePath(null, "/about"), "/about");
});

test("withLocalePath: pseudo locales receive prefix", () => {
  assert.equal(withLocalePath("en-XA", "/parent/dashboard"), "/en-XA/parent/dashboard");
  assert.equal(withLocalePath("ar-XB", "/"), "/ar-XB");
  assert.equal(withLocalePath("ar-XB", "/student/home"), "/ar-XB/student/home");
});

test("withLocalePath: Hebrew is not prefixed; registered locales are", () => {
  assert.equal(withLocalePath("he", "/about"), "/about");
  assert.equal(withLocalePath("es", "/about"), "/es/about");
});

test("shouldRedirectPrefixedDefaultLocale: /en prefix should redirect to unprefixed", () => {
  assert.equal(shouldRedirectPrefixedDefaultLocale("en"), true);
  assert.equal(shouldRedirectPrefixedDefaultLocale("en-US"), true);
  assert.equal(shouldRedirectPrefixedDefaultLocale("en-XA"), false);
  assert.equal(shouldRedirectPrefixedDefaultLocale("ar-XB"), false);
});

test("canonicalizeLocalizedPath strips nested locale and trailing slash", () => {
  assert.equal(canonicalizeLocalizedPath("/en-XA/parent/dashboard/"), "/parent/dashboard");
  assert.equal(canonicalizeLocalizedPath("parent/dashboard"), "/parent/dashboard");
  assert.equal(canonicalizeLocalizedPath("/"), "/");
});

test("buildLocalizedHref preserves query and hash", () => {
  assert.equal(
    buildLocalizedHref("ar-XB", "/about", { search: "tab=1", hash: "section" }),
    "/ar-XB/about?tab=1#section"
  );
});

test("isLocaleRoutingExcluded: static assets and API paths", () => {
  assert.equal(isLocaleRoutingExcluded("/_next/static/chunk.js"), true);
  assert.equal(isLocaleRoutingExcluded("/api/auth/session"), true);
  assert.equal(isLocaleRoutingExcluded("/static/logo.png"), true);
  assert.equal(isLocaleRoutingExcluded("/favicon.ico"), true);
  assert.equal(isLocaleRoutingExcluded("/robots.txt"), true);
  assert.equal(isLocaleRoutingExcluded("/sitemap.xml"), true);
  assert.equal(isLocaleRoutingExcluded("/images/hero.webp"), true);
  assert.equal(isLocaleRoutingExcluded("/sw.js"), true);
  assert.equal(isLocaleRoutingExcluded("/parent/dashboard"), false);
});

test("isLocalizedPath reflects prefix detection", () => {
  assert.equal(isLocalizedPath("/en-XA/about"), true);
  assert.equal(isLocalizedPath("/he/about"), false);
  assert.equal(isLocalizedPath("/about"), false);
});

test("isLocaleRoutable: enabled locales routable; disabled registry ids fall back to en", () => {
  assert.equal(isLocaleRoutable("en"), true);
  assert.equal(isLocaleRoutable("en-XA"), true);
  assert.equal(isLocaleRoutable("ar-XB"), true);
  assert.equal(isLocaleRoutable("es"), true);
  assert.equal(isLocaleRoutable("zz-unknown"), true);
});
