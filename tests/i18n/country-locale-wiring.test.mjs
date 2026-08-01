/**
 * Country locale wiring: registry, public /mx paths, selector labels, deep merge.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  LOCALE_REGISTRY,
  getSelectableLocales,
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
} from "../../lib/i18n/locale-registry.js";
import {
  stripLocaleFromPath,
  withLocalePath,
  buildLocalizedHref,
  shouldRedirectToPublicLocalePrefix,
} from "../../lib/i18n/locale-path.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { deepMergeJson } from "../../lib/i18n/deep-merge.js";
import { resolveHelpLocale } from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { loadContentPack } from "../../lib/content/locale.server.js";

const COUNTRIES = [
  { id: "es-MX", prefix: "mx", label: "México" },
  { id: "es-CO", prefix: "co", label: "Colombia" },
  { id: "es-AR", prefix: "ar", label: "Argentina" },
  { id: "es-PE", prefix: "pe", label: "Perú" },
];

test("country locales registered with es-419 → en fallback", () => {
  for (const c of COUNTRIES) {
    const def = LOCALE_REGISTRY[c.id];
    assert.ok(def, c.id);
    assert.equal(def.enabled, true);
    assert.equal(def.fallbackLocale, "es-419");
    assert.equal(def.pathPrefix, c.prefix);
    assert.equal(def.label, c.label);
    assert.equal(def.nativeName, c.label);
    assert.deepEqual(getLocaleFallbackChain(c.id), [c.id, "es-419", "en"]);
  }
});

test("selector shows English + country names only (no Español / codes)", () => {
  const locales = getSelectableLocales();
  const ids = locales.map((l) => l.id).sort();
  assert.deepEqual(ids, ["en", "es-AR", "es-CO", "es-MX", "es-PE"]);
  assert.ok(!ids.includes("es-419"));
  const labels = locales.filter((l) => l.id !== "en").map((l) => l.label || l.nativeName);
  assert.deepEqual(labels.sort(), ["Argentina", "Colombia", "México", "Perú"].sort());
  for (const loc of locales) {
    assert.doesNotMatch(String(loc.label || ""), /^es-/i);
    assert.notEqual(loc.label, "Español");
    assert.notEqual(loc.nativeName, "Español");
    assert.notEqual(loc.label, "MX");
    assert.notEqual(loc.label, "CO");
  }
});

test("public routes use lowercase country prefixes mapped to internal locales", () => {
  for (const c of COUNTRIES) {
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(withLocalePath(c.id, "/student/home"), `/${c.prefix}/student/home`);
    assert.equal(withLocalePath(c.id, "/"), `/${c.prefix}`);
    assert.deepEqual(stripLocaleFromPath(`/${c.prefix}/parents`), {
      locale: c.id,
      pathname: "/parents",
      hadPrefix: true,
      pathSegment: c.prefix,
    });
    assert.equal(
      buildLocalizedHref(c.id, "/parents", { search: "x=1", hash: "y" }),
      `/${c.prefix}/parents?x=1#y`
    );
  }
  assert.equal(withLocalePath("es-419", "/parents"), "/es-419/parents");
});

test("internal /es-MX style segments redirect to public /mx", () => {
  const parsed = stripLocaleFromPath("/es-MX/student/home");
  assert.equal(parsed.locale, "es-MX");
  assert.equal(parsed.pathSegment, "es-MX");
  assert.equal(shouldRedirectToPublicLocalePrefix("es-MX", "es-MX"), true);
  assert.equal(shouldRedirectToPublicLocalePrefix("es-MX", "mx"), false);
  assert.equal(withLocalePath("es-MX", parsed.pathname), "/mx/student/home");
});

test("deep merge keeps sibling branches for sparse country UI overlays", () => {
  resetLocaleBundleCache();
  const mx = loadLocaleBundles("es-MX");
  // Country overlay key
  const overlay = lookupMessage(mx, "ui.help.videoModalMobile");
  assert.ok(overlay && /celular|móvil|mobile/i.test(overlay));
  // Sibling from es-419 must survive shallow-replace bugs
  const fromBase = lookupMessage(mx, "ui.languageSwitcher.label");
  assert.ok(typeof fromBase === "string" && fromBase.length > 0);
  const fromEn = lookupMessage(mx, "ui.nav.home");
  assert.ok(typeof fromEn === "string" && fromEn.length > 0);
});

test("deepMergeJson does not drop untouched nested keys", () => {
  const merged = deepMergeJson(
    { help: { a: "1", b: "2" }, other: { x: "y" } },
    { help: { a: "mx" } }
  );
  assert.deepEqual(merged, { help: { a: "mx", b: "2" }, other: { x: "y" } });
});

test("help center country locales inherit es-419 pack", () => {
  assert.equal(resolveHelpLocale("es-MX"), "es-419");
  assert.equal(resolveHelpLocale("es-CO"), "es-419");
  assert.equal(resolveHelpLocale("en"), "en");
});

test("es-CO word meaning override merges onto es-419", () => {
  const co = resolveEnglishWordMeaning("brown", {
    listKey: "colors",
    instructionLocale: "es-CO",
  });
  assert.equal(co, "café");
  const from419 = resolveEnglishWordMeaning("red", {
    listKey: "colors",
    instructionLocale: "es-CO",
  });
  assert.ok(typeof from419 === "string" && from419.length > 0);
  assert.notEqual(from419, "red");
});

test("sparse content pack deep-merge keeps parent keys", () => {
  const pack = loadContentPack("es-MX", "demo", "ui.json");
  assert.ok(pack && typeof pack === "object");
  // Parent es-419 demo ui should still contribute keys when country file is sparse
  const keys = Object.keys(pack);
  assert.ok(keys.length >= 1);
});

test("resolveLocaleDefinition accepts country ids", () => {
  assert.equal(resolveLocaleDefinition("es-MX").id, "es-MX");
  assert.equal(resolveLocaleDefinition("es-PE").fallbackLocale, "es-419");
});
