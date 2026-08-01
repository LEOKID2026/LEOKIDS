/**
 * Layout HUD language switcher visibility + same-page locale href contract.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { shouldShowLayoutLanguageSwitcher } from "../../lib/site-nav.js";
import { getSelectableLocales } from "../../lib/i18n/locale-registry.js";
import { buildLocalizedHref, canonicalizeLocalizedPath } from "../../lib/i18n/locale-path.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

test("shouldShowLayoutLanguageSwitcher: product areas include public/auth/portals", () => {
  for (const p of [
    "/",
    "/parents",
    "/teachers",
    "/kids",
    "/about",
    "/contact",
    "/parent/login",
    "/parent/dashboard",
    "/student/home",
    "/teacher/dashboard",
    "/school/dashboard",
    "/auth/forgot-password",
    "/auth/reset-password",
  ]) {
    assert.equal(shouldShowLayoutLanguageSwitcher(p), true, p);
  }
});

test("shouldShowLayoutLanguageSwitcher: excludes admin/dev/prototypes/poc/qa", () => {
  for (const p of [
    "/admin",
    "/admin/schools",
    "/admin/parents/x",
    "/dev/solo-game-prototypes",
    "/learning/dev/engine-review",
    "/learning/dev-student-simulator",
    "/learning/dev-db-report-preview",
    "/student/world-home-prototype",
    "/dev/english-word-builder-prototype",
    "/internal/poc/tool",
    "/tools/qa",
  ]) {
    assert.equal(shouldShowLayoutLanguageSwitcher(p), false, p);
  }
});

test("selectable locales for switcher are English + country names", () => {
  const locales = getSelectableLocales();
  assert.deepEqual(
    locales.map((l) => l.id).sort(),
    ["en", "es-AR", "es-CL", "es-CO", "es-DO", "es-EC", "es-GT", "es-MX", "es-PE"]
  );
  const byId = Object.fromEntries(locales.map((l) => [l.id, l]));
  assert.equal(byId.en.nativeName, "English");
  assert.equal(byId["es-MX"].nativeName, "México");
  assert.equal(byId["es-CO"].nativeName, "Colombia");
  assert.equal(byId["es-AR"].nativeName, "Argentina");
  assert.equal(byId["es-PE"].nativeName, "Perú");
  assert.equal(byId["es-CL"].nativeName, "Chile");
  assert.equal(byId["es-EC"].nativeName, "Ecuador");
  assert.equal(byId["es-GT"].nativeName, "Guatemala");
  assert.equal(byId["es-DO"].nativeName, "República Dominicana");
});

test("same-page language switch preserves path, query, and hash", () => {
  const pathOnly = canonicalizeLocalizedPath("/es-419/student/home");
  assert.equal(pathOnly, "/student/home");
  assert.equal(
    buildLocalizedHref("es-419", "/parents", { search: "ref=hud", hash: "top" }),
    "/es-419/parents?ref=hud#top"
  );
  assert.equal(
    buildLocalizedHref("en", "/es-419/student/home", { search: "x=1", hash: "a" }),
    "/student/home?x=1#a"
  );
  assert.equal(
    buildLocalizedHref("en", canonicalizeLocalizedPath("/es-419/parent/dashboard"), {
      search: "tab=report",
      hash: "summary",
    }),
    "/parent/dashboard?tab=report#summary"
  );
});

test("Layout HUD mounts LanguageSwitcher once via shared chrome", () => {
  const src = readFileSync(path.join(repoRoot, "components/Layout.js"), "utf8");
  assert.match(src, /import LocaleLink from "\.\/i18n\/LocaleLink\.jsx"/);
  assert.match(src, /<LocaleLink/);
  assert.match(src, /import LanguageSwitcher from "\.\/i18n\/LanguageSwitcher\.jsx"/);
  assert.match(src, /shouldShowLayoutLanguageSwitcher/);
  assert.match(src, /<LanguageSwitcher appearance=\{/);
  assert.equal((src.match(/<LanguageSwitcher/g) || []).length, 1);

  const switcher = readFileSync(
    path.join(repoRoot, "components/i18n/LanguageSwitcher.jsx"),
    "utf8"
  );
  assert.match(switcher, /selectableLocales/);
  assert.match(switcher, /setLocale/);
  assert.match(switcher, /aria-label/);
  assert.match(switcher, /Escape/);
  assert.doesNotMatch(switcher, /es-419/);
  assert.doesNotMatch(switcher, /Hebrew|עברית|flag/i);
});
