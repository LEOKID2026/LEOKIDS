import test from "node:test";
import assert from "node:assert/strict";
import {
  stripLocaleFromPath,
  withLocalePath,
  getLocaleFromPath,
  isLocalizedPath,
  canonicalizeLocalizedPath,
  buildLocalizedHref,
  localizeHref,
  ensureLocalePrefixedUrl,
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
  assert.deepEqual(stripLocaleFromPath("/es-419/about"), {
    locale: "es-419",
    pathname: "/about",
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
  assert.deepEqual(stripLocaleFromPath("/fr/about"), {
    locale: "fr",
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
  assert.equal(withLocalePath("es-419", "/parent/dashboard"), "/es-419/parent/dashboard");
});

test("withLocalePath: Hebrew is not prefixed; registered locales are", () => {
  assert.equal(withLocalePath("he", "/about"), "/about");
  assert.equal(withLocalePath("fr", "/about"), "/fr/about");
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

test("buildLocalizedHref en ↔ es-419 keeps same page with query and hash", () => {
  assert.equal(
    buildLocalizedHref("es-419", "/parents", { search: "utm=1", hash: "cta" }),
    "/es-419/parents?utm=1#cta"
  );
  assert.equal(
    buildLocalizedHref("en", "/student/home", { search: "x=1", hash: "nav" }),
    "/student/home?x=1#nav"
  );
});

test("localizeHref prefixes internal paths for es-419 and leaves English bare", () => {
  assert.equal(localizeHref("es-419", "/parent/dashboard"), "/es-419/parent/dashboard");
  assert.equal(localizeHref("es-419", "/about?tab=1#x"), "/es-419/about?tab=1#x");
  assert.equal(localizeHref("en", "/about?tab=1#x"), "/about?tab=1#x");
  assert.equal(localizeHref("es-419", "https://example.com/x"), "https://example.com/x");
  assert.equal(localizeHref("es-419", "/admin/schools"), "/admin/schools");
  assert.equal(localizeHref("es-419", "#section"), "#section");
});

test("ensureLocalePrefixedUrl restores missing es-419 prefix after bare navigation", () => {
  assert.equal(ensureLocalePrefixedUrl("es-419", "/about"), "/es-419/about");
  assert.equal(
    ensureLocalePrefixedUrl("es-419", "/parent/dashboard?tab=1#sum"),
    "/es-419/parent/dashboard?tab=1#sum"
  );
  assert.equal(ensureLocalePrefixedUrl("es-419", "/es-419/about"), null);
  assert.equal(ensureLocalePrefixedUrl("en", "/about"), null);
  assert.equal(ensureLocalePrefixedUrl("es-419", "/admin/schools"), null);
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
  assert.equal(isLocaleRoutable("fr"), true);
  assert.equal(isLocaleRoutable("zz-unknown"), true);
});
