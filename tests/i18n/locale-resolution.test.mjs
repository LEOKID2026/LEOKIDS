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

test("resolveInterfaceLocale priority: URL beats profile, cookie, Accept-Language, default", () => {
  const base = {
    profileInterfaceLocale: "en-XA",
    cookieHeader: cookieAr,
    acceptLanguage: "en-XA,en;q=0.9",
  };

  assert.equal(resolveInterfaceLocale({ ...base, asPath: "/ar-XB/parent/dashboard" }), "ar-XB");
  assert.equal(
    resolveInterfaceLocale({ ...base, asPath: "/parent/dashboard", query: { locale: "en-XA" } }),
    "en-XA"
  );
  assert.equal(resolveInterfaceLocale({ ...base, asPath: "/parent/dashboard" }), "en-XA");
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      profileInterfaceLocale: null,
      cookieHeader: cookieAr,
      acceptLanguage: "en,en-US;q=0.9",
    }),
    "ar-XB"
  );
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      acceptLanguage: "en,en-US;q=0.9",
      preferCookie: false,
    }),
    "en"
  );
  assert.equal(resolveInterfaceLocale({ asPath: "/parent/dashboard" }), FALLBACK_LOCALE);
});

test("resolveInterfaceLocale: disabled locale prefix resolves via registry fallback to en", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/es/about",
      profileInterfaceLocale: "en-XA",
    }),
    "en"
  );
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/es/about",
      cookieHeader: cookieAr,
    }),
    "en"
  );
});

test("resolveInterfaceLocale: hasExplicitUserChoice skips Accept-Language", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      acceptLanguage: "en-XA,en;q=0.9",
      hasExplicitUserChoice: true,
    }),
    DEFAULT_LOCALE
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
  assert.equal(resolveContentLocale({ contentLocale: "he-IL" }), "he");
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
  assert.deepEqual(getLocaleFallbackChain("ar-XB"), ["ar-XB", "ar", "en"]);
  assert.deepEqual(getLocaleFallbackChain("en"), ["en"]);
});
