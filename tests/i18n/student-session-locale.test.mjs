/**
 * Student session locale — client_meta.interface_locale authority (no new schema).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  readInterfaceLocaleFromClientMeta,
  withInterfaceLocaleInClientMeta,
} from "../../lib/student-server/student-session-locale.server.js";
import { resolveInterfaceLocale } from "../../lib/i18n/locale-resolution.js";
import { serializeLocaleCookie } from "../../lib/i18n/locale-cookie.js";
import { buildLocalizedHref } from "../../lib/i18n/locale-path.js";

test("student client_meta stores and reads interface_locale", () => {
  const meta = withInterfaceLocaleInClientMeta({ guest: false }, "id-ID");
  assert.equal(meta.interface_locale, "id-ID");
  assert.equal(readInterfaceLocaleFromClientMeta(meta), "id-ID");
  assert.equal(readInterfaceLocaleFromClientMeta({}), null);
});

test("student account locale wins over stale browser cookie from another student", () => {
  const staleCookie = serializeLocaleCookie("ar-001").split(";")[0];
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/student/home",
      profileInterfaceLocale: "id-ID",
      cookieHeader: staleCookie,
    }),
    "id-ID"
  );
});

test("selector locale switch preserves book query params", () => {
  assert.equal(
    buildLocalizedHref("en", "/student/learning/book/math/g6", {
      search: "subject=math&grade=g6",
    }),
    "/student/learning/book/math/g6?subject=math&grade=g6"
  );
  assert.equal(
    buildLocalizedHref("ar-001", "/student/learning/book/math/g6", {
      search: "subject=math&grade=g6",
    }),
    "/ar-001/student/learning/book/math/g6?subject=math&grade=g6"
  );
  assert.equal(
    buildLocalizedHref("id-ID", "/student/learning/book/math/g6", {
      search: "subject=math&grade=g6",
    }),
    "/id/student/learning/book/math/g6?subject=math&grade=g6"
  );
});

test("selector chain id-ID → en → ar-001 → id-ID preserves path+query", () => {
  const path = "/student/learning/book/math/g6";
  const search = "subject=math&grade=g6";
  assert.equal(buildLocalizedHref("id-ID", path, { search }), `/id${path}?${search}`);
  assert.equal(buildLocalizedHref("en", path, { search }), `${path}?${search}`);
  assert.equal(buildLocalizedHref("ar-001", path, { search }), `/ar-001${path}?${search}`);
  assert.equal(buildLocalizedHref("id-ID", path, { search }), `/id${path}?${search}`);
});
