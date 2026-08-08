/**
 * Middleware locale preference precedence (cookie wins over mismatched URL).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { LOCALE_COOKIE_NAME, resolveLocaleDefinition } from "../../lib/i18n/locale-registry.js";
import { withLocalePath, stripLocaleFromPath } from "../../lib/i18n/locale-path.js";

/**
 * Mirror of middleware preference-vs-URL decision (kept in sync with middleware.js).
 * @param {{ pathname: string, cookieLocale?: string|null }} input
 */
function middlewareLocaleDecision({ pathname, cookieLocale = null }) {
  const parsed = stripLocaleFromPath(pathname);
  if (!parsed.locale) {
    const resolved = resolveLocaleDefinition(cookieLocale || "en");
    if (resolved.id !== "en" && resolved.enabled) {
      return {
        action: "redirect",
        pathname: withLocalePath(resolved.id, parsed.pathname || pathname),
        locale: resolved.id,
      };
    }
    return { action: "next", locale: resolved.id, pathname };
  }

  const def = resolveLocaleDefinition(parsed.locale);
  if (!def.enabled) {
    return { action: "redirect", pathname: parsed.pathname, locale: "en" };
  }

  if (cookieLocale) {
    const preferred = resolveLocaleDefinition(cookieLocale);
    if (preferred.enabled && preferred.id !== def.id) {
      const nextPath = withLocalePath(preferred.id, parsed.pathname);
      if (nextPath !== pathname) {
        return { action: "redirect", pathname: nextPath, locale: preferred.id };
      }
    }
  }

  return { action: "rewrite", pathname: parsed.pathname, locale: def.id };
}

test("middleware: cookie id-ID beats URL ar-001", () => {
  const d = middlewareLocaleDecision({
    pathname: "/ar-001/student/learning",
    cookieLocale: "id-ID",
  });
  assert.equal(d.action, "redirect");
  assert.equal(d.pathname, "/id/student/learning");
  assert.equal(d.locale, "id-ID");
});

test("middleware: no cookie adopts URL locale (first use)", () => {
  const d = middlewareLocaleDecision({
    pathname: "/ar-001/student/learning/book/math/g6",
    cookieLocale: null,
  });
  assert.equal(d.action, "rewrite");
  assert.equal(d.locale, "ar-001");
  assert.equal(d.pathname, "/student/learning/book/math/g6");
});

test("middleware: matching cookie + URL rewrites without bounce", () => {
  const d = middlewareLocaleDecision({
    pathname: "/id/student/learning",
    cookieLocale: "id-ID",
  });
  assert.equal(d.action, "rewrite");
  assert.equal(d.locale, "id-ID");
});

test("middleware: bare path with non-default cookie redirects to prefix", () => {
  const d = middlewareLocaleDecision({
    pathname: "/student/learning",
    cookieLocale: "es-419",
  });
  assert.equal(d.action, "redirect");
  assert.equal(d.pathname, "/es-419/student/learning");
});

test("middleware: bare path with English cookie stays bare", () => {
  const d = middlewareLocaleDecision({
    pathname: "/student/learning",
    cookieLocale: "en",
  });
  assert.equal(d.action, "next");
  assert.equal(d.locale, "en");
});

test("locale cookie name contract", () => {
  assert.equal(LOCALE_COOKIE_NAME, "lk_global_locale");
});
