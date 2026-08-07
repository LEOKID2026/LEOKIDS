/**
 * Country locale wiring: registry, public paths, selector labels, deep merge.
 * Waves 1–5: MX…PA + UY/CU/PR (final LatAm wave).
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
  { id: "es-UY", prefix: "uy", label: "Uruguay" },
  { id: "es-CU", prefix: "cu", label: "Cuba" },
  { id: "es-PR", prefix: "pr", label: "Puerto Rico" },
  { id: "es-ES", prefix: "es", label: "España" },
];

const SELECTOR_IDS = [
  "ar-001",
  "ar-AE",
  "ar-DZ",
  "ar-EG",
  "ar-IQ",
  "ar-JO",
  "ar-MA",
  "ar-SA",
  "ar-TN",
  "de-AT",
  "de-CH",
  "de-DE",
  "en",
  "en-AU",
  "en-CA",
  "en-CM",
  "en-GB",
  "en-GH",
  "en-GM",
  "en-IE",
  "en-IN",
  "en-KE",
  "en-LR",
  "en-MU",
  "en-NG",
  "en-NIR",
  "en-NZ",
  "en-PH",
  "en-RW",
  "en-SCT",
  "en-SG",
  "en-SL",
  "en-WLS",
  "en-ZA",
  "es-AR",
  "es-BO",
  "es-CL",
  "es-CO",
  "es-CR",
  "es-CU",
  "es-DO",
  "es-EC",
  "es-ES",
  "es-GQ",
  "es-GT",
  "es-HN",
  "es-MX",
  "es-NI",
  "es-PA",
  "es-PE",
  "es-PR",
  "es-PY",
  "es-SV",
  "es-US",
  "es-UY",
  "es-VE",
  "fr-BE",
  "fr-BJ",
  "fr-CA",
  "fr-CD",
  "fr-CG",
  "fr-CH",
  "fr-CI",
  "fr-CM",
  "fr-FR",
  "fr-GA",
  "fr-GN",
  "fr-SN",
  "fr-TG",
  "it-CH",
  "it-IT",
  "nl-BE",
  "nl-NL",
  "nl-SR",
  "pt-AO",
  "pt-BR",
  "pt-CV",
  "pt-MZ",
  "pt-PT",
  "ru-BY",
  "ru-KG",
  "ru-KZ",
  "ru-RU",
  "ru-UZ",
];

const SELECTOR_LABELS = [
  "Algeria",
  "Angola",
  "Argentina",
  "Australia",
  "Austria",
  "Belarus-ru",
  "Belgium-fr",
  "Belgium-nl",
  "Benin",
  "Bolivia",
  "Brasil",
  "Cabo Verde-pt",
  "Cameroon-en",
  "Cameroon-fr",
  "Canada-en",
  "Canada-fr",
  "Chile",
  "Colombia",
  "Congo",
  "Costa Rica",
  "Cuba",
  "Côte d’Ivoire",
  "DR Congo",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "England",
  "Equatorial Guinea-es",
  "España",
  "France",
  "Gabon",
  "Germany",
  "Ghana",
  "Guatemala",
  "Guinea",
  "Honduras",
  "India-en",
  "Iraq",
  "Ireland",
  "Italy",
  "Jordan",
  "Kazakhstan-ru",
  "Kenya",
  "Kyrgyzstan-ru",
  "Liberia",
  "Mauritius-en",
  "Morocco",
  "Mozambique",
  "México",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Nigeria",
  "Northern Ireland",
  "Panamá",
  "Paraguay",
  "Perú",
  "Philippines",
  "Portugal",
  "Puerto Rico",
  "R. Dominicana",
  "Russia",
  "Rwanda-en",
  "Saudi Arabia",
  "Scotland",
  "Senegal",
  "Sierra Leone-en",
  "Singapore",
  "South Africa",
  "Suriname-nl",
  "Switzerland-de",
  "Switzerland-fr",
  "Switzerland-it",
  "The Gambia",
  "Togo",
  "Tunisia",
  "USA-es",
  "United Arab Emirates",
  "Uruguay",
  "Uzbekistan-ru",
  "Venezuela",
  "Wales",
  "العربية",
];

const SELECTOR_ORDER = [
  "en",
  "ar-001",
  "ar-EG",
  "ar-SA",
  "ar-MA",
  "ar-DZ",
  "ar-IQ",
  "ar-JO",
  "ar-AE",
  "ar-TN",
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
  "pt-AO",
  "pt-MZ",
  "it-IT",
  "fr-FR",
  "fr-CI",
  "fr-CA",
  "nl-NL",
  "de-DE",
  "de-AT",
  "de-CH",
  "ru-RU",
  "en-AU",
  "en-NZ",
  "en-IE",
  "en-GB",
  "en-CA",
  "en-SG",
  "en-ZA",
  "en-NG",
  "en-KE",
  "en-WLS",
  "en-SCT",
  "en-NIR",
  "en-PH",
  "nl-BE",
  "fr-BE",
  "fr-CH",
  "it-CH",
  "en-IN",
  "en-GH",
  "fr-SN",
  "fr-CD",
  "es-US",
  "ru-KZ",
  "ru-UZ",
  "ru-KG",
  "ru-BY",
  "en-RW",
  "fr-CM",
  "en-CM",
  "fr-BJ",
  "en-MU",
  "fr-GN",
  "fr-TG",
  "fr-GA",
  "fr-CG",
  "nl-SR",
  "pt-CV",
  "es-GQ",
  "en-SL",
  "en-LR",
  "en-GM",
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

test("Brasil pt-BR registered with /br and fallback to en", () => {
  const def = LOCALE_REGISTRY["pt-BR"];
  assert.ok(def);
  assert.equal(def.enabled, true);
  assert.equal(def.fallbackLocale, "en");
  assert.equal(def.pathPrefix, "br");
  assert.equal(def.label, "Brasil");
  assert.equal(def.nativeName, "Brasil");
  assert.deepEqual(getLocaleFallbackChain("pt-BR"), ["pt-BR", "en"]);
  assert.equal(getPublicLocalePathPrefix("pt-BR"), "br");
  assert.equal(resolveLocaleIdFromPathPrefix("br"), "pt-BR");
  assert.equal(withLocalePath("pt-BR", "/student/home"), "/br/student/home");
  assert.deepEqual(stripLocaleFromPath("/br/parents"), {
    locale: "pt-BR",
    pathname: "/parents",
    hadPrefix: true,
    pathSegment: "br",
  });
  assert.equal(shouldRedirectToPublicLocalePrefix("pt-BR", "pt-BR"), true);
  assert.equal(shouldRedirectToPublicLocalePrefix("pt-BR", "BR"), true);
  assert.equal(shouldRedirectToPublicLocalePrefix("pt-BR", "br"), false);
  assert.equal(withLocalePath("pt-BR", stripLocaleFromPath("/pt-BR/help").pathname), "/br/help");
});

test("selector shows English + country names only (no Español / codes)", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 84);
  assert.deepEqual(
    locales.map((l) => l.id),
    SELECTOR_ORDER
  );
  const ids = locales.map((l) => l.id).sort();
  assert.deepEqual(ids, SELECTOR_IDS);
  assert.ok(!ids.includes("es-419"));
  const labels = locales.filter((l) => l.id !== "en").map((l) => l.label || l.nativeName);
  assert.deepEqual(labels.sort(), [...SELECTOR_LABELS].sort());
  for (const loc of locales) {
    assert.doesNotMatch(String(loc.label || ""), /^es-/i);
    assert.notEqual(loc.label, "Español");
    assert.notEqual(loc.nativeName, "Español");
    assert.notEqual(loc.label, "UY");
    assert.notEqual(loc.label, "CU");
    assert.notEqual(loc.label, "PR");
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

test("Wave 2–5 internal locale ids and uppercase prefixes redirect to public form", () => {
  for (const c of [
    { id: "es-CL", prefix: "cl", internal: "es-CL", upper: "CL" },
    { id: "es-VE", prefix: "ve", internal: "es-VE", upper: "VE" },
    { id: "es-NI", prefix: "ni", internal: "es-NI", upper: "NI" },
    { id: "es-PY", prefix: "py", internal: "es-PY", upper: "PY" },
    { id: "es-CR", prefix: "cr", internal: "es-CR", upper: "CR" },
    { id: "es-PA", prefix: "pa", internal: "es-PA", upper: "PA" },
    { id: "es-UY", prefix: "uy", internal: "es-UY", upper: "UY" },
    { id: "es-CU", prefix: "cu", internal: "es-CU", upper: "CU" },
    { id: "es-PR", prefix: "pr", internal: "es-PR", upper: "PR" },
    { id: "es-ES", prefix: "es", internal: "es-ES", upper: "ES" },
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
  for (const id of ["es-MX", "es-CL", "es-VE", "es-NI", "es-CR", "es-PA", "es-UY", "es-CU", "es-PR"]) {
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

test("help center country locales inherit es-419 pack; Spain uses es-ES overlay", () => {
  for (const c of COUNTRIES) {
    if (c.id === "es-ES") {
      assert.equal(resolveHelpLocale(c.id), "es-ES");
    } else {
      assert.equal(resolveHelpLocale(c.id), "es-419");
    }
  }
  assert.equal(resolveHelpLocale("en"), "en");
  assert.equal(resolveHelpLocale("pt-BR"), "pt-BR");
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

test("Wave 5 Uruguay word meanings; Cuba/Puerto Rico inherit es-419", () => {
  assert.equal(
    resolveEnglishWordMeaning("bus", { listKey: "travel", instructionLocale: "es-UY" }),
    "ómnibus"
  );
  assert.equal(
    resolveEnglishWordMeaning("bus_stop", {
      listKey: "community",
      instructionLocale: "es-UY",
    }),
    "parada de ómnibus"
  );
  const uyRed = resolveEnglishWordMeaning("red", {
    listKey: "colors",
    instructionLocale: "es-UY",
  });
  assert.ok(typeof uyRed === "string" && uyRed.length > 0);
  assert.notEqual(uyRed, "ómnibus");

  const baseBus = resolveEnglishWordMeaning("bus", {
    listKey: "travel",
    instructionLocale: "es-419",
  });
  for (const id of ["es-CU", "es-PR"]) {
    assert.equal(
      resolveEnglishWordMeaning("bus", { listKey: "travel", instructionLocale: id }),
      baseBus,
      id
    );
    assert.notEqual(baseBus, "ómnibus", id);
  }
});

test("teacher namespace worksheet_pdf loads for Wave 5 countries", () => {
  resetLocaleBundleCache();
  for (const id of ["es-UY", "es-CU", "es-PR"]) {
    const bundles = loadLocaleBundles(id);
    assert.equal(lookupMessage(bundles, "teacher.assignmentTypes.worksheet_pdf"), "Hoja de trabajo", id);
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
  for (const id of ["es-MX", "es-CL", "es-VE", "es-NI", "es-PY", "es-CR", "es-PA", "es-UY", "es-CU", "es-PR"]) {
    const pack = loadContentPack(id, "demo", "ui.json");
    assert.ok(pack && typeof pack === "object", id);
    assert.ok(Object.keys(pack).length >= 1, id);
  }
});

test("Puerto Rico rewards sparse gradeBands merge onto es-419", () => {
  const pr = loadContentPack("es-PR", "rewards", "ui.json");
  const base = loadContentPack("es-419", "rewards", "ui.json");
  assert.ok(pr && typeof pr === "object");
  assert.ok(base && typeof base === "object");
  assert.equal(pr.gradeBands.g12, "1.er–2.º grado");
  assert.equal(pr.gradeBands.g34, "3.er–4.º grado");
  assert.equal(pr.gradeBands.g56, "5.º–6.º grado");
  // Sibling keys still come from es-419 (no full-pack replace)
  assert.equal(pr.rarity.regular, base.rarity.regular);
  assert.equal(pr.shop.alreadyOwned, base.shop.alreadyOwned);
});

test("Uruguay and Puerto Rico worksheet address stay tú-only", () => {
  resetLocaleBundleCache();
  for (const id of ["es-UY", "es-PR"]) {
    const bundles = loadLocaleBundles(id);
    const worksheets = JSON.stringify(bundles.worksheets || {});
    assert.equal(/\bvosotros\b/i.test(worksheets), false, id);
    assert.equal(/(^|[^a-záéíóúñ])vos([^a-záéíóúñ]|$)/i.test(worksheets), false, id);
    const uiPack = loadContentPack(id, "global-burn-down", "lib__worksheets__worksheet-ui.json");
    const packText = JSON.stringify(uiPack || {});
    assert.equal(/\bvosotros\b/i.test(packText), false, `${id} pack`);
    assert.equal(/(^|[^a-záéíóúñ])vos([^a-záéíóúñ]|$)/i.test(packText), false, `${id} pack`);
  }
});

test("country content packs do not cross-contaminate", () => {
  const uy = loadContentPack("es-UY", "demo", "ui.json");
  const cu = loadContentPack("es-CU", "demo", "ui.json");
  const pr = loadContentPack("es-PR", "demo", "ui.json");
  assert.ok(uy && cu && pr);
  assert.equal(typeof uy, "object");
  assert.equal(typeof cu, "object");
  assert.equal(typeof pr, "object");
});

test("resolveLocaleDefinition accepts country ids", () => {
  assert.equal(resolveLocaleDefinition("es-MX").id, "es-MX");
  assert.equal(resolveLocaleDefinition("es-CR").id, "es-CR");
  assert.equal(resolveLocaleDefinition("es-PA").fallbackLocale, "es-419");
  assert.equal(resolveLocaleDefinition("es-UY").id, "es-UY");
  assert.equal(resolveLocaleDefinition("es-CU").id, "es-CU");
  assert.equal(resolveLocaleDefinition("es-PR").fallbackLocale, "es-419");
});
