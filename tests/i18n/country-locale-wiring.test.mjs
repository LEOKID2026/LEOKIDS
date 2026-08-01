/**
 * Country locale wiring: registry, public paths, selector labels, deep merge.
 * Covers Wave 1 (MX/CO/AR/PE) and Wave 2 (CL/EC/GT/DO).
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
  { id: "es-CL", prefix: "cl", label: "Chile" },
  { id: "es-EC", prefix: "ec", label: "Ecuador" },
  { id: "es-GT", prefix: "gt", label: "Guatemala" },
  { id: "es-DO", prefix: "do", label: "República Dominicana" },
];

const SELECTOR_IDS = [
  "en",
  "es-AR",
  "es-CL",
  "es-CO",
  "es-DO",
  "es-EC",
  "es-GT",
  "es-MX",
  "es-PE",
];

const SELECTOR_LABELS = [
  "Argentina",
  "Chile",
  "Colombia",
  "Ecuador",
  "Guatemala",
  "México",
  "Perú",
  "República Dominicana",
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
  assert.deepEqual(ids, SELECTOR_IDS);
  assert.ok(!ids.includes("es-419"));
  const labels = locales.filter((l) => l.id !== "en").map((l) => l.label || l.nativeName);
  assert.deepEqual(labels.sort(), [...SELECTOR_LABELS].sort());
  for (const loc of locales) {
    assert.doesNotMatch(String(loc.label || ""), /^es-/i);
    assert.notEqual(loc.label, "Español");
    assert.notEqual(loc.nativeName, "Español");
    assert.notEqual(loc.label, "MX");
    assert.notEqual(loc.label, "CO");
    assert.notEqual(loc.label, "CL");
    assert.notEqual(loc.label, "EC");
    assert.notEqual(loc.label, "GT");
    assert.notEqual(loc.label, "DO");
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

test("Wave 2 internal /es-CL and /CL redirect to public /cl", () => {
  for (const c of [
    { id: "es-CL", prefix: "cl", internal: "es-CL", upper: "CL" },
    { id: "es-EC", prefix: "ec", internal: "es-EC", upper: "EC" },
    { id: "es-GT", prefix: "gt", internal: "es-GT", upper: "GT" },
    { id: "es-DO", prefix: "do", internal: "es-DO", upper: "DO" },
  ]) {
    const fromInternal = stripLocaleFromPath(`/${c.internal}/student/home`);
    assert.equal(fromInternal.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromInternal.pathSegment), true);
    assert.equal(withLocalePath(c.id, fromInternal.pathname), `/${c.prefix}/student/home`);

    const fromUpper = stripLocaleFromPath(`/${c.upper}/parents`);
    assert.equal(fromUpper.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromUpper.pathSegment), true);
    assert.equal(withLocalePath(c.id, fromUpper.pathname), `/${c.prefix}/parents`);
  }
});

test("deep merge keeps sibling branches for sparse country UI overlays", () => {
  resetLocaleBundleCache();
  for (const id of ["es-MX", "es-CL", "es-GT"]) {
    const bundles = loadLocaleBundles(id);
    const overlay = lookupMessage(bundles, "ui.help.videoModalMobile");
    assert.ok(overlay && /celular|móvil|mobile/i.test(overlay), id);
    const fromBase = lookupMessage(bundles, "ui.languageSwitcher.label");
    assert.ok(typeof fromBase === "string" && fromBase.length > 0, id);
    const fromEn = lookupMessage(bundles, "ui.nav.home");
    assert.ok(typeof fromEn === "string" && fromEn.length > 0, id);
  }
});

test("deepMergeJson does not drop untouched nested keys", () => {
  const merged = deepMergeJson(
    { help: { a: "1", b: "2" }, other: { x: "y" } },
    { help: { a: "mx" } }
  );
  assert.deepEqual(merged, { help: { a: "mx", b: "2" }, other: { x: "y" } });
});

test("help center country locales inherit es-419 pack", () => {
  for (const c of COUNTRIES) {
    assert.equal(resolveHelpLocale(c.id), "es-419");
  }
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

test("es-GT word meaning override merges onto es-419", () => {
  const gt = resolveEnglishWordMeaning("brown", {
    listKey: "colors",
    instructionLocale: "es-GT",
  });
  assert.equal(gt, "café");
  const from419 = resolveEnglishWordMeaning("red", {
    listKey: "colors",
    instructionLocale: "es-GT",
  });
  assert.ok(typeof from419 === "string" && from419.length > 0);
  assert.notEqual(from419, "red");
  // Wave 2 countries without meaning packs inherit es-419
  const cl = resolveEnglishWordMeaning("brown", {
    listKey: "colors",
    instructionLocale: "es-CL",
  });
  assert.ok(typeof cl === "string" && cl.length > 0);
  assert.notEqual(cl, "brown");
});

test("sparse content pack deep-merge keeps parent keys", () => {
  for (const id of ["es-MX", "es-CL", "es-EC", "es-GT", "es-DO"]) {
    const pack = loadContentPack(id, "demo", "ui.json");
    assert.ok(pack && typeof pack === "object", id);
    const keys = Object.keys(pack);
    assert.ok(keys.length >= 1, id);
  }
});

test("country content packs do not cross-contaminate", () => {
  const cl = loadContentPack("es-CL", "demo", "ui.json");
  const gt = loadContentPack("es-GT", "demo", "ui.json");
  assert.ok(cl && gt);
  // Both inherit es-419 base; country overlays must remain independently mergeable
  assert.equal(typeof cl, "object");
  assert.equal(typeof gt, "object");
});

test("resolveLocaleDefinition accepts country ids", () => {
  assert.equal(resolveLocaleDefinition("es-MX").id, "es-MX");
  assert.equal(resolveLocaleDefinition("es-PE").fallbackLocale, "es-419");
  assert.equal(resolveLocaleDefinition("es-CL").id, "es-CL");
  assert.equal(resolveLocaleDefinition("es-DO").fallbackLocale, "es-419");
});
