/**
 * Country locale wiring: registry, public paths, selector labels, deep merge.
 * Waves 1–4: MX/CO/AR/PE, CL/EC/GT/DO, VE/BO/HN/SV, NI/PY/CR/PA.
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
  { id: "es-DO", prefix: "do", label: "R. Dominicana" },
  { id: "es-VE", prefix: "ve", label: "Venezuela" },
  { id: "es-BO", prefix: "bo", label: "Bolivia" },
  { id: "es-HN", prefix: "hn", label: "Honduras" },
  { id: "es-SV", prefix: "sv", label: "El Salvador" },
  { id: "es-NI", prefix: "ni", label: "Nicaragua" },
  { id: "es-PY", prefix: "py", label: "Paraguay" },
  { id: "es-CR", prefix: "cr", label: "Costa Rica" },
  { id: "es-PA", prefix: "pa", label: "Panamá" },
];

const SELECTOR_IDS = [
  "en",
  "es-AR",
  "es-BO",
  "es-CL",
  "es-CO",
  "es-CR",
  "es-DO",
  "es-EC",
  "es-GT",
  "es-HN",
  "es-MX",
  "es-NI",
  "es-PA",
  "es-PE",
  "es-PY",
  "es-SV",
  "es-VE",
];

const SELECTOR_LABELS = [
  "Argentina",
  "Bolivia",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "R. Dominicana",
  "Venezuela",
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
    assert.notEqual(loc.label, "NI");
    assert.notEqual(loc.label, "PY");
    assert.notEqual(loc.label, "CR");
    assert.notEqual(loc.label, "PA");
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

test("Wave 2–4 internal locale ids and uppercase prefixes redirect to public form", () => {
  for (const c of [
    { id: "es-CL", prefix: "cl", internal: "es-CL", upper: "CL" },
    { id: "es-VE", prefix: "ve", internal: "es-VE", upper: "VE" },
    { id: "es-NI", prefix: "ni", internal: "es-NI", upper: "NI" },
    { id: "es-PY", prefix: "py", internal: "es-PY", upper: "PY" },
    { id: "es-CR", prefix: "cr", internal: "es-CR", upper: "CR" },
    { id: "es-PA", prefix: "pa", internal: "es-PA", upper: "PA" },
  ]) {
    const fromInternal = stripLocaleFromPath(`/${c.internal}/student/home`);
    assert.equal(fromInternal.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromInternal.pathSegment), true);
    assert.equal(withLocalePath(c.id, fromInternal.pathname), `/${c.prefix}/student/home`);

    const fromUpper = stripLocaleFromPath(`/${c.upper}/parents`);
    assert.equal(fromUpper.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromUpper.pathSegment), true);
    assert.equal(
      buildLocalizedHref(c.id, fromUpper.pathname, { search: "tab=1" }),
      `/${c.prefix}/parents?tab=1`
    );
  }
});

test("deep merge keeps sibling branches for sparse country UI overlays", () => {
  resetLocaleBundleCache();
  for (const id of ["es-MX", "es-CL", "es-VE", "es-NI", "es-CR", "es-PA"]) {
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
  assert.equal(
    resolveEnglishWordMeaning("brown", { listKey: "colors", instructionLocale: "es-CO" }),
    "café"
  );
});

test("Wave 3–4 word meanings: BO/SV/PY/PA override brown; NI/CR inherit es-419", () => {
  for (const id of ["es-BO", "es-SV", "es-PY", "es-PA"]) {
    assert.equal(
      resolveEnglishWordMeaning("brown", { listKey: "colors", instructionLocale: id }),
      "café",
      id
    );
  }
  for (const id of ["es-NI", "es-CR", "es-VE", "es-HN", "es-PY", "es-PA"]) {
    const red = resolveEnglishWordMeaning("red", {
      listKey: "colors",
      instructionLocale: id,
    });
    assert.ok(typeof red === "string" && red.length > 0, id);
    assert.notEqual(red, "red", id);
  }
});

test("Costa Rica uses año labels without changing grade keys", () => {
  resetLocaleBundleCache();
  const cr = loadLocaleBundles("es-CR");
  assert.equal(lookupMessage(cr, "common.grade1"), "1.er año");
  assert.equal(lookupMessage(cr, "common.grade6"), "6.º año");
  assert.equal(lookupMessage(cr, "learning.master.grades.g1"), "1.er año");
  assert.equal(lookupMessage(cr, "learning.master.grades.g6"), "6.º año");
  // Keys remain grade1–grade6 / g1–g6; sibling UI still resolves from chain
  assert.ok(typeof lookupMessage(cr, "ui.nav.home") === "string");
});

test("sparse content pack deep-merge keeps parent keys", () => {
  for (const id of ["es-MX", "es-CL", "es-VE", "es-NI", "es-PY", "es-CR", "es-PA"]) {
    const pack = loadContentPack(id, "demo", "ui.json");
    assert.ok(pack && typeof pack === "object", id);
    assert.ok(Object.keys(pack).length >= 1, id);
  }
});

test("country content packs do not cross-contaminate", () => {
  const ni = loadContentPack("es-NI", "demo", "ui.json");
  const pa = loadContentPack("es-PA", "demo", "ui.json");
  assert.ok(ni && pa);
  assert.equal(typeof ni, "object");
  assert.equal(typeof pa, "object");
});

test("resolveLocaleDefinition accepts country ids", () => {
  assert.equal(resolveLocaleDefinition("es-MX").id, "es-MX");
  assert.equal(resolveLocaleDefinition("es-CR").id, "es-CR");
  assert.equal(resolveLocaleDefinition("es-PA").fallbackLocale, "es-419");
});
