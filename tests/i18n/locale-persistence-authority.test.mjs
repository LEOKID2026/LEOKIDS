/**
 * Critical runtime repair — interface locale persistence precedence.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { resolveInterfaceLocale } from "../../lib/i18n/locale-resolution.js";
import { DEFAULT_LOCALE, FALLBACK_LOCALE } from "../../lib/i18n/locale-registry.js";
import { serializeLocaleCookie } from "../../lib/i18n/locale-cookie.js";
import {
  buildLocalizedHref,
  ensureLocalePrefixedUrl,
  localizeHref,
  withLocalePath,
} from "../../lib/i18n/locale-path.js";

function cookieFor(localeId) {
  return serializeLocaleCookie(localeId).split(";")[0];
}

test("1. no stored preference + no market → English", () => {
  assert.equal(resolveInterfaceLocale({ asPath: "/student/home" }), FALLBACK_LOCALE);
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/student/home",
      acceptLanguage: "ar-SA,ar;q=0.9,en;q=0.8",
    }),
    FALLBACK_LOCALE
  );
});

test("2. no stored preference + supported detected market → market locale", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/",
      detectedMarketLocale: "id-ID",
    }),
    "id-ID"
  );
});

test("3. guest cookie id-ID survives refresh (bare path)", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/student/learning",
      cookieHeader: cookieFor("id-ID"),
    }),
    "id-ID"
  );
});

test("4. guest cookie ar-001 survives page navigation (bare path)", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/student/home",
      cookieHeader: cookieFor("ar-001"),
    }),
    "ar-001"
  );
});

test("5. logged-in saved id-ID stays on refresh", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      profileInterfaceLocale: "id-ID",
      cookieHeader: cookieFor("en"),
      acceptLanguage: "ar-SA",
    }),
    "id-ID"
  );
});

test("6. logged-in change id-ID → en: profile en wins next page + refresh", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      profileInterfaceLocale: "en",
      cookieHeader: cookieFor("en"),
    }),
    "en"
  );
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/reports",
      profileInterfaceLocale: "en",
      cookieHeader: cookieFor("en"),
    }),
    "en"
  );
});

test("7. logged-in change en → ar-001 persists", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/teacher/dashboard",
      profileInterfaceLocale: "ar-001",
      cookieHeader: cookieFor("ar-001"),
    }),
    "ar-001"
  );
});

test("8. saved user locale beats country/market detection", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/",
      profileInterfaceLocale: "id-ID",
      detectedMarketLocale: "ar-001",
      acceptLanguage: "ar-SA",
    }),
    "id-ID"
  );
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/",
      cookieHeader: cookieFor("pt-BR"),
      detectedMarketLocale: "ar-001",
    }),
    "pt-BR"
  );
});

test("9. internal localized link preserves selected locale", () => {
  assert.equal(localizeHref("id-ID", "/student/learning"), "/id/student/learning");
  assert.equal(localizeHref("ar-001", "/student/learning/book/math/g6"), "/ar-001/student/learning/book/math/g6");
  assert.equal(ensureLocalePrefixedUrl("es-419", "/parents"), "/es-419/parents");
});

test("10. login redirect uses account preference over guest cookie", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/parent/dashboard",
      profileInterfaceLocale: "ar-001",
      cookieHeader: cookieFor("id-ID"),
    }),
    "ar-001"
  );
});

test("11. book navigation preserves selected locale in href builders", () => {
  const bookPath = "/student/learning/book/math/g6";
  assert.equal(withLocalePath("id-ID", bookPath), "/id/student/learning/book/math/g6");
  assert.equal(
    buildLocalizedHref("id-ID", bookPath, { search: "subject=math&grade=g6" }),
    "/id/student/learning/book/math/g6?subject=math&grade=g6"
  );
});

test("12. query params survive locale switch href build", () => {
  assert.equal(
    buildLocalizedHref("en", "/student/learning/book/english/g5", {
      search: "subject=english&grade=g5",
    }),
    "/student/learning/book/english/g5?subject=english&grade=g5"
  );
  assert.equal(
    buildLocalizedHref("id-ID", "/student/learning/book/english/g5", {
      search: "subject=english&grade=g5",
      hash: "#toc",
    }),
    "/id/student/learning/book/english/g5?subject=english&grade=g5#toc"
  );
});

test("saved cookie beats mismatched URL prefix (resolution)", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/ar-001/student/learning",
      cookieHeader: cookieFor("id-ID"),
    }),
    "id-ID"
  );
});

test("URL locale applies only when no saved preference (first use)", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/ar-001/student/learning",
    }),
    "ar-001"
  );
  assert.equal(DEFAULT_LOCALE, "en");
});

test("Accept-Language does not initialize product locale without opt-in", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/",
      acceptLanguage: "id-ID,id;q=0.9",
    }),
    FALLBACK_LOCALE
  );
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/",
      acceptLanguage: "id-ID,id;q=0.9",
      allowAcceptLanguage: true,
    }),
    "id-ID"
  );
});
