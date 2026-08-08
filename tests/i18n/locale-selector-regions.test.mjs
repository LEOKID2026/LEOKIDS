/**
 * Global market selector — region grouping + search inventory contract.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { getSelectableLocales } from "../../lib/i18n/locale-registry.js";
import {
  LOCALE_SELECTOR_REGION,
  SELECTOR_REGION_ORDER,
  getLocaleSelectorRegion,
  getSelectorDisplayLabel,
  groupLocalesBySelectorRegion,
  localeMatchesSelectorQuery,
} from "../../lib/i18n/locale-selector-regions.js";
import {
  LOCALE_SELECTOR_FLAG,
  getLocaleSelectorFlag,
  getMarketFlagAssetPath,
  listUniqueMarketFlagCodes,
} from "../../lib/i18n/locale-selector-flags.js";
import { buildLocalizedHref } from "../../lib/i18n/locale-path.js";
import { resolveInterfaceLocale } from "../../lib/i18n/locale-resolution.js";
import { serializeLocaleCookie } from "../../lib/i18n/locale-cookie.js";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

test("selector option count remains 93", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 93);
  assert.equal(Object.keys(LOCALE_SELECTOR_REGION).length, 93);
});

test("every selectable locale appears exactly once with a region", () => {
  const locales = getSelectableLocales();
  const ids = locales.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);

  for (const loc of locales) {
    const region = getLocaleSelectorRegion(loc.id);
    assert.ok(region, `missing region for ${loc.id}`);
    assert.equal(SELECTOR_REGION_ORDER.includes(region), true, region);
    assert.equal(LOCALE_SELECTOR_REGION[loc.id], region);
  }

  const mappedIds = Object.keys(LOCALE_SELECTOR_REGION);
  for (const id of mappedIds) {
    assert.equal(ids.includes(id), true, `orphan region map entry ${id}`);
  }
});

test("grouped selector covers all 93 without duplicates", () => {
  const locales = getSelectableLocales();
  const groups = groupLocalesBySelectorRegion(locales);
  const flat = groups.flatMap((g) => g.locales.map((l) => l.id));
  assert.equal(flat.length, 93);
  assert.equal(new Set(flat).size, 93);
  for (const group of groups) {
    const labels = group.locales.map(getSelectorDisplayLabel);
    const sorted = [...labels].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    assert.deepEqual(labels, sorted, group.regionId);
  }
});

test("search finds representative entries across regions", () => {
  const locales = getSelectableLocales();
  const byId = Object.fromEntries(locales.map((l) => [l.id, l]));

  assert.equal(localeMatchesSelectorQuery(byId["id-ID"], "indo"), true);
  assert.equal(localeMatchesSelectorQuery(byId["es-MX"], "méxico"), true);
  assert.equal(localeMatchesSelectorQuery(byId["de-DE"], "germany"), true);
  assert.equal(localeMatchesSelectorQuery(byId["ar-SA"], "saudi"), true);
  assert.equal(localeMatchesSelectorQuery(byId["ar-EG"], "egypt"), true);
  assert.equal(localeMatchesSelectorQuery(byId["ar-AE"], "uae"), true);
  assert.equal(localeMatchesSelectorQuery(byId["ar-AE"], "emirates"), true);
  assert.equal(getSelectorDisplayLabel(byId["ar-AE"]), "UAE");
  assert.equal(localeMatchesSelectorQuery(byId["en-CA"], "canada"), true);
  assert.equal(localeMatchesSelectorQuery(byId["fr-CA"], "canada"), true);
  assert.equal(localeMatchesSelectorQuery(byId["de-CH"], "switzerland"), true);
  assert.equal(localeMatchesSelectorQuery(byId["en-GB"], "england"), true);
  assert.equal(localeMatchesSelectorQuery(byId["en-AU"], "australia"), true);

  // User-facing search does not require locale codes.
  const filtered = groupLocalesBySelectorRegion(locales, { query: "canada" });
  const hitIds = filtered.flatMap((g) => g.locales.map((l) => l.id)).sort();
  assert.deepEqual(hitIds, ["en-CA", "fr-CA"]);
});

test("multi-language countries remain distinct options", () => {
  const ids = getSelectableLocales().map((l) => l.id);
  for (const id of ["en-CA", "fr-CA", "nl-BE", "fr-BE", "de-CH", "fr-CH", "it-CH", "en-CM", "fr-CM"]) {
    assert.equal(ids.includes(id), true, id);
  }
  const labels = Object.fromEntries(
    getSelectableLocales()
      .filter((l) => ["en-CA", "fr-CA", "nl-BE", "fr-BE", "de-CH", "fr-CH", "it-CH"].includes(l.id))
      .map((l) => [l.id, getSelectorDisplayLabel(l)])
  );
  assert.notEqual(labels["en-CA"], labels["fr-CA"]);
  assert.notEqual(labels["nl-BE"], labels["fr-BE"]);
  assert.equal(new Set([labels["de-CH"], labels["fr-CH"], labels["it-CH"]]).size, 3);
});

test("UK entities remain distinct", () => {
  const byId = Object.fromEntries(getSelectableLocales().map((l) => [l.id, l]));
  assert.equal(getSelectorDisplayLabel(byId["en-GB"]), "England");
  assert.equal(getSelectorDisplayLabel(byId["en-SCT"]), "Scotland");
  assert.equal(getSelectorDisplayLabel(byId["en-WLS"]), "Wales");
  assert.equal(getSelectorDisplayLabel(byId["en-NIR"]), "Northern Ireland");
  assert.equal(getLocaleSelectorRegion("en-GB"), "europe");
  assert.equal(getLocaleSelectorRegion("en-SCT"), "europe");
});

test("locale switch preserves route and query params", () => {
  const path = "/student/learning/book/math/g6";
  const search = "subject=math&grade=g6";
  assert.equal(
    buildLocalizedHref("id-ID", path, { search }),
    `/id${path}?${search}`
  );
  assert.equal(
    buildLocalizedHref("en", path, { search }),
    `${path}?${search}`
  );
  assert.equal(
    buildLocalizedHref("ar-001", path, { search }),
    `/ar-001${path}?${search}`
  );
});

test("selected locale cookie still wins on refresh (guest persistence)", () => {
  const cookie = serializeLocaleCookie("id-ID").split(";")[0];
  assert.equal(
    resolveInterfaceLocale({
      asPath: "/student/home",
      cookieHeader: cookie,
    }),
    "id-ID"
  );
});

test("region inventory counts are stable", () => {
  const locales = getSelectableLocales();
  const groups = groupLocalesBySelectorRegion(locales);
  const counts = Object.fromEntries(groups.map((g) => [g.regionId, g.locales.length]));
  assert.deepEqual(counts, {
    americas: 29,
    europe: 19,
    africa: 26,
    middle_east: 10,
    asia: 7,
    oceania: 2,
  });
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), 93);
});

test("93/93 selector options have flag or neutral icon metadata", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 93);
  assert.equal(Object.keys(LOCALE_SELECTOR_FLAG).length, 93);

  /** @type {string[]} */
  const missing = [];
  for (const loc of locales) {
    const meta = getLocaleSelectorFlag(loc.id);
    if (!meta) missing.push(loc.id);
  }
  assert.deepEqual(missing, []);

  for (const id of Object.keys(LOCALE_SELECTOR_FLAG)) {
    assert.equal(
      locales.some((l) => l.id === id),
      true,
      `orphan flag map entry ${id}`
    );
  }
});

test("country flag assets exist; Arabic Master uses neutral globe icon", () => {
  const ar = getLocaleSelectorFlag("ar-001");
  assert.ok(ar);
  assert.equal(ar.kind, "icon");
  assert.equal(ar.icon, "globe");
  assert.equal(getMarketFlagAssetPath(ar), null);

  const codes = listUniqueMarketFlagCodes();
  assert.equal(codes.includes("gb-eng"), true);
  assert.equal(codes.includes("gb-sct"), true);
  assert.equal(codes.includes("gb-wls"), true);
  assert.equal(codes.includes("gb-nir"), true);
  assert.equal(codes.includes("gb"), false);

  for (const code of codes) {
    const file = path.join(repoRoot, "public", "assets", "market-flags", `${code}.svg`);
    assert.equal(existsSync(file), true, `missing flag asset ${code}`);
  }
});

test("multi-language countries share the same country flag", () => {
  assert.deepEqual(getLocaleSelectorFlag("en-CA"), getLocaleSelectorFlag("fr-CA"));
  assert.deepEqual(getLocaleSelectorFlag("nl-BE"), getLocaleSelectorFlag("fr-BE"));
  assert.deepEqual(getLocaleSelectorFlag("de-CH"), getLocaleSelectorFlag("fr-CH"));
  assert.deepEqual(getLocaleSelectorFlag("fr-CH"), getLocaleSelectorFlag("it-CH"));
  assert.deepEqual(getLocaleSelectorFlag("en-CM"), getLocaleSelectorFlag("fr-CM"));
  assert.equal(getLocaleSelectorFlag("en-CA")?.code, "ca");
  assert.equal(getLocaleSelectorFlag("nl-BE")?.code, "be");
  assert.equal(getLocaleSelectorFlag("de-CH")?.code, "ch");
});

test("UK nations use distinct subdivision flags", () => {
  assert.equal(getLocaleSelectorFlag("en-GB")?.code, "gb-eng");
  assert.equal(getLocaleSelectorFlag("en-SCT")?.code, "gb-sct");
  assert.equal(getLocaleSelectorFlag("en-WLS")?.code, "gb-wls");
  assert.equal(getLocaleSelectorFlag("en-NIR")?.code, "gb-nir");
  const ukCodes = ["en-GB", "en-SCT", "en-WLS", "en-NIR"].map(
    (id) => getLocaleSelectorFlag(id)?.code
  );
  assert.equal(new Set(ukCodes).size, 4);
});

test("selector panel stays inside mobile and desktop viewports", async () => {
  const { computeSelectorPanelBox, selectorPanelFitsViewport } = await import(
    "../../lib/i18n/locale-selector-panel.js"
  );

  /** @type {{ width: number, triggerRight: number, triggerLeft?: number }[]} */
  const cases = [
    { width: 320, triggerRight: 312 },
    { width: 360, triggerRight: 352 },
    { width: 375, triggerRight: 367 },
    { width: 390, triggerRight: 382 },
    { width: 407, triggerRight: 399 },
    { width: 430, triggerRight: 422 },
    { width: 768, triggerRight: 740 },
    { width: 1280, triggerRight: 1200 },
    // Trigger near the start (RTL chrome / left placement)
    { width: 390, triggerRight: 96, triggerLeft: 16 },
  ];

  for (const c of cases) {
    const triggerLeft = c.triggerLeft ?? c.triggerRight - 80;
    const box = computeSelectorPanelBox(
      {
        top: 48,
        right: c.triggerRight,
        bottom: 80,
        left: triggerLeft,
        width: c.triggerRight - triggerLeft,
        height: 32,
      },
      { width: c.width, height: 800 },
      { margin: 8, preferredWidth: 320 }
    );
    assert.equal(box.width <= c.width - 16, true, `width@${c.width}`);
    assert.equal(box.left >= 8, true, `left@${c.width}`);
    assert.equal(box.left + box.width <= c.width - 8, true, `right@${c.width}`);
    assert.equal(
      selectorPanelFitsViewport(box, { width: c.width, height: 800 }, 8),
      true,
      `fit@${c.width}`
    );
  }
});

test("selector panel prefers above placement when below space is tight", async () => {
  const { computeSelectorPanelBox } = await import("../../lib/i18n/locale-selector-panel.js");
  const box = computeSelectorPanelBox(
    { top: 700, right: 380, bottom: 732, left: 300, width: 80, height: 32 },
    { width: 390, height: 780 },
    { margin: 8, preferredWidth: 320, minHeight: 160 }
  );
  assert.equal(box.placement, "above");
  assert.equal(box.top >= 8, true);
  assert.equal(box.left + box.width <= 390 - 8, true);
});
