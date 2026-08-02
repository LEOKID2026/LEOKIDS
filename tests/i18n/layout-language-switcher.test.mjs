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
  assert.equal(locales.length, 37);
  assert.deepEqual(
    locales.map((l) => l.id),
    [
      "en",
      "es-MX",
      "es-CO",
      "es-AR",
      "es-PE",
      "es-CL",
      "es-EC",
      "es-GT",
      "es-DO",
      "es-VE",
      "es-BO",
      "es-HN",
      "es-SV",
      "es-NI",
      "es-PY",
      "es-CR",
      "es-PA",
      "es-UY",
      "es-CU",
      "es-PR",
      "es-ES",
      "pt-BR",
      "pt-PT",
      "it-IT",
      "fr-FR",
      "nl-NL",
      "en-AU",
      "en-NZ",
      "en-IE",
      "en-GB",
      "en-CA",
      "en-SG",
      "en-ZA",
      "en-WLS",
      "en-SCT",
      "en-NIR",
      "en-PH",
    ]
  );
  const byId = Object.fromEntries(locales.map((l) => [l.id, l]));
  assert.equal(byId.en.nativeName, "English");
  assert.equal(byId["es-MX"].nativeName, "México");
  assert.equal(byId["es-DO"].nativeName, "R. Dominicana");
  assert.equal(byId["es-VE"].nativeName, "Venezuela");
  assert.equal(byId["es-SV"].nativeName, "El Salvador");
  assert.equal(byId["es-NI"].nativeName, "Nicaragua");
  assert.equal(byId["es-PY"].nativeName, "Paraguay");
  assert.equal(byId["es-CR"].nativeName, "Costa Rica");
  assert.equal(byId["es-PA"].nativeName, "Panamá");
  assert.equal(byId["es-UY"].nativeName, "Uruguay");
  assert.equal(byId["es-CU"].nativeName, "Cuba");
  assert.equal(byId["es-PR"].nativeName, "Puerto Rico");
  assert.equal(byId["es-ES"].nativeName, "España");
  assert.equal(byId["pt-BR"].nativeName, "Brasil");
  assert.equal(byId["pt-BR"].label, "Brasil");
  assert.equal(byId["pt-BR"].pathPrefix, "br");
  assert.equal(byId["pt-PT"].nativeName, "Portugal");
  assert.equal(byId["pt-PT"].label, "Portugal");
  assert.equal(byId["pt-PT"].pathPrefix, "pt");
  assert.equal(byId["it-IT"].nativeName, "Italy");
  assert.equal(byId["it-IT"].pathPrefix, "it");
  assert.equal(byId["fr-FR"].nativeName, "France");
  assert.equal(byId["fr-FR"].pathPrefix, "fr");
  assert.equal(byId["nl-NL"].nativeName, "Netherlands");
  assert.equal(byId["nl-NL"].pathPrefix, "nl");
  assert.equal(byId["en-AU"].nativeName, "Australia");
  assert.equal(byId["en-NZ"].nativeName, "New Zealand");
  assert.equal(byId["en-IE"].nativeName, "Ireland");
  assert.equal(byId["en-GB"].nativeName, "England");
  assert.equal(byId["en-GB"].pathPrefix, "eng");
  assert.equal(byId["en-CA"].nativeName, "Canada");
  assert.equal(byId["en-SG"].nativeName, "Singapore");
  assert.equal(byId["en-ZA"].nativeName, "South Africa");
  assert.equal(byId["en-WLS"].nativeName, "Wales");
  assert.equal(byId["en-WLS"].pathPrefix, "wls");
  assert.equal(byId["en-SCT"].nativeName, "Scotland");
  assert.equal(byId["en-SCT"].pathPrefix, "sct");
  assert.equal(byId["en-NIR"].nativeName, "Northern Ireland");
  assert.equal(byId["en-NIR"].pathPrefix, "nir");
  assert.equal(byId["en-PH"].nativeName, "Philippines");
  assert.equal(byId["en-PH"].pathPrefix, "ph");
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
  assert.match(switcher, /max-h-\[min\(70vh,520px\)\]/);
  assert.match(switcher, /overflow-y-auto/);
  assert.match(switcher, /overflow-x-hidden/);
  assert.match(switcher, /overscroll-contain/);
  assert.doesNotMatch(switcher, /es-419/);
  assert.doesNotMatch(switcher, /Hebrew|עברית|flag/i);
});

test("LanguageSwitcher list can reach all selectable locales including Brasil Portugal Italy France Netherlands", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 37);
  assert.equal(locales[0].id, "en");
  assert.ok(locales.some((l) => l.id === "pt-BR" && l.nativeName === "Brasil"));
  assert.ok(locales.some((l) => l.id === "pt-PT" && l.nativeName === "Portugal"));
  assert.ok(locales.some((l) => l.id === "it-IT" && l.nativeName === "Italy"));
  assert.ok(locales.some((l) => l.id === "fr-FR" && l.nativeName === "France"));
  assert.ok(locales.some((l) => l.id === "nl-NL" && l.nativeName === "Netherlands"));
  assert.equal(locales[locales.length - 1].id, "en-PH");
  assert.equal(locales[locales.length - 1].nativeName, "Philippines");
});
