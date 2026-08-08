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
import { buildLocalizedHref } from "../../lib/i18n/locale-path.js";
import { resolveInterfaceLocale } from "../../lib/i18n/locale-resolution.js";
import { serializeLocaleCookie } from "../../lib/i18n/locale-cookie.js";

test("selector option count remains 89", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 89);
  assert.equal(Object.keys(LOCALE_SELECTOR_REGION).length, 89);
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

test("grouped selector covers all 89 without duplicates", () => {
  const locales = getSelectableLocales();
  const groups = groupLocalesBySelectorRegion(locales);
  const flat = groups.flatMap((g) => g.locales.map((l) => l.id));
  assert.equal(flat.length, 89);
  assert.equal(new Set(flat).size, 89);
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
    americas: 25,
    europe: 19,
    africa: 26,
    middle_east: 10,
    asia: 7,
    oceania: 2,
  });
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), 89);
});
