import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveInterfaceLocale,
  resolveContentLocale,
  resolveReportLocale,
  getLocaleFallbackChain,
} from "../../lib/i18n/locale-resolution.js";
import { DEFAULT_LOCALE, FALLBACK_LOCALE } from "../../lib/i18n/locale-registry.js";
import { serializeLocaleCookie } from "../../lib/i18n/locale-cookie.js";

const cookieAr = serializeLocaleCookie("ar-XB").split(";")[0];

test("resolveInterfaceLocale priority: profile > cookie > URL > market > default", () => {
  const base = {
    profileInterfaceLocale: "en-XA",
    cookieHeader: cookieAr,
    acceptLanguage: "ar-SA,ar;q=0.9",
  };

  // Profile wins over URL and cookie when provided (authenticated account).
  assert.equal(resolveInterfaceLocale({ ...base, asPath: "/ar-XB/parent/dashboard" }), "en-XA");
  assert.equal(
    resolveInterfaceLocale({ ...base, asPath: "/parent/dashboard", query: { locale: "ar-XB" } }),
    "en-XA"
  );
  assert.equal(resolveInterfaceLocale({ ...base, asPath: "/parent/dashboard" }), "en-XA");

  // Cookie wins when no profile.
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      profileInterfaceLocale: null,
      cookieHeader: cookieAr,
      acceptLanguage: "en,en-US;q=0.9",
    }),
    "ar-XB"
  );

  // URL first-use when no saved preference.
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/ar-XB/parent/dashboard",
    }),
    "ar-XB"
  );

  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      preferCookie: false,
    }),
    FALLBACK_LOCALE
  );
  assert.equal(resolveInterfaceLocale({ asPath: "/parent/dashboard" }), FALLBACK_LOCALE);
});

test("resolveInterfaceLocale: disabled locale prefix resolves via registry fallback to en", () => {
  // /de is live (de-DE); use a still-disabled prefix stub.
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/pl/about",
      profileInterfaceLocale: "en-XA",
    }),
    "en-XA"
  );
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/pl/about",
      cookieHeader: cookieAr,
    }),
    "ar-XB"
  );
});

test("resolveInterfaceLocale: Accept-Language ignored unless allowAcceptLanguage", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      acceptLanguage: "en-XA,en;q=0.9",
      hasExplicitUserChoice: true,
    }),
    DEFAULT_LOCALE
  );
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      acceptLanguage: "en-XA,en;q=0.9",
    }),
    DEFAULT_LOCALE
  );
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      acceptLanguage: "en-XA,en;q=0.9",
      allowAcceptLanguage: true,
    }),
    "en-XA"
  );
});

test("resolveInterfaceLocale: Hebrew path segment is not treated as locale", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/he/parent/dashboard",
      profileInterfaceLocale: "en-XA",
    }),
    "en-XA"
  );
});

test("resolveContentLocale: explicit content locale and english subject shortcut", () => {
  assert.equal(resolveContentLocale({ contentLocale: "en-XA" }), "en-XA");
  // Unknown / unregistered (including he*) resolve to en via registry
  assert.equal(resolveContentLocale({ contentLocale: "he-IL" }), "en");
  assert.equal(resolveContentLocale({ contentLocale: "he" }), "en");
  assert.equal(resolveContentLocale({ subject: "english" }), "en");
  assert.equal(resolveContentLocale({ interfaceLocale: "ar-XB" }), "en");
  assert.equal(resolveContentLocale({ interfaceLocale: "en-XA" }), "en");
  assert.equal(resolveContentLocale({ interfaceLocale: "en" }), "en");
});

test("resolveReportLocale: explicit report locale wins, else interface chain without cookie", () => {
  assert.equal(resolveReportLocale({ reportLocale: "en-XA", interfaceLocale: "en" }), "en-XA");
  assert.equal(
    resolveReportLocale({
      interfaceLocale: "en-XA",
      preferredReportLanguage: "ar-XB",
    }),
    "ar-XB"
  );
});

test("getLocaleFallbackChain uses registry configured fallback", () => {
  assert.deepEqual(getLocaleFallbackChain("en-XA"), ["en-XA", "en"]);
  assert.deepEqual(getLocaleFallbackChain("ar-XB"), ["ar-XB", "en"]);
  assert.deepEqual(getLocaleFallbackChain("en"), ["en"]);
  assert.deepEqual(getLocaleFallbackChain("es-419"), ["es-419", "en"]);
});

test("resolveInterfaceLocale: es-419 URL prefix is active on first use", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/es-419/parent/dashboard",
      acceptLanguage: "en",
    }),
    "es-419"
  );
});
