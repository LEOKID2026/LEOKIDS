/**
 * Cookie + bare-path locale persistence contract (middleware / helpers).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_LOCALE, resolveLocaleDefinition } from "../../lib/i18n/locale-registry.js";
import {
  ensureLocalePrefixedUrl,
  localizeHref,
  withLocalePath,
} from "../../lib/i18n/locale-path.js";
import { resolveInterfaceLocale } from "../../lib/i18n/locale-resolution.js";

test("cookie es-419 + bare path still resolves to es-419 (no URL prefix)", () => {
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/about",
      cookieHeader: "lk_global_locale=es-419",
    }),
    "es-419"
  );
});

test("active es-419 choice maps bare product paths to prefixed hrefs", () => {
  for (const bare of [
    "/parents",
    "/parent/dashboard",
    "/student/home",
    "/teacher/dashboard",
    "/school/dashboard",
    "/about",
    "/contact",
  ]) {
    assert.equal(localizeHref("es-419", bare), `/es-419${bare === "/" ? "" : bare}`);
    assert.equal(ensureLocalePrefixedUrl("es-419", bare), withLocalePath("es-419", bare));
  }
  assert.equal(localizeHref("en", "/parents"), "/parents");
  assert.equal(ensureLocalePrefixedUrl("en", "/parents"), null);
  assert.equal(resolveLocaleDefinition("es-419").id !== DEFAULT_LOCALE, true);
});
