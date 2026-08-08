/**
 * Dynamic global coverage map — derived from selector SoT.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSelectableLocales } from "../../lib/i18n/locale-registry.js";
import {
  buildSelectorCoverageMarkets,
  findUnmappedCoverageMarkets,
  getLocaleCoverageGeoId,
  selectorFlagCodeToGeoId,
} from "../../lib/i18n/locale-selector-coverage.js";
import { getLocaleSelectorFlag } from "../../lib/i18n/locale-selector-flags.js";
import { computeSelectorPanelBox, selectorPanelFitsViewport } from "../../lib/i18n/locale-selector-panel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const worldMap = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "lib/i18n/data/world-countries.json"), "utf8")
);

test("selector count remains 89 while coverage excludes Arabic Master", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 89);
  assert.equal(getLocaleCoverageGeoId("ar-001"), null);
  assert.equal(getLocaleSelectorFlag("ar-001")?.kind, "icon");
});

test("coverage markets are derived from selector SoT and deduplicated", () => {
  const { markets, marketCount, byGeoId } = buildSelectorCoverageMarkets();
  assert.equal(marketCount, markets.length);
  assert.equal(byGeoId.size, marketCount);

  // Unique flag codes (82) collapse UK subdivisions → fewer geographies.
  assert.equal(marketCount < 82, true);
  assert.equal(marketCount > 70, true);

  assert.ok(byGeoId.has("CA"));
  assert.deepEqual(byGeoId.get("CA")?.localeIds.sort(), ["en-CA", "fr-CA"]);
  assert.match(byGeoId.get("CA")?.detail || "", /English/);
  assert.match(byGeoId.get("CA")?.detail || "", /Français/);

  assert.ok(byGeoId.has("CH"));
  assert.equal(byGeoId.get("CH")?.localeIds.length, 3);
  assert.match(byGeoId.get("CH")?.detail || "", /Deutsch/);
  assert.match(byGeoId.get("CH")?.detail || "", /Français/);
  assert.match(byGeoId.get("CH")?.detail || "", /Italiano/);

  assert.ok(byGeoId.has("BE"));
  assert.match(byGeoId.get("BE")?.detail || "", /Nederlands/);
  assert.match(byGeoId.get("BE")?.detail || "", /Français/);

  assert.ok(byGeoId.has("CM"));
  assert.equal(byGeoId.get("CM")?.localeIds.length, 2);

  assert.ok(byGeoId.has("US"));
  assert.equal(byGeoId.get("US")?.localeIds.includes("en"), true);
  assert.equal(byGeoId.get("US")?.localeIds.includes("es-US"), true);
});

test("UK nations collapse to GB geography with nation details", () => {
  assert.equal(selectorFlagCodeToGeoId("gb-eng"), "GB");
  assert.equal(selectorFlagCodeToGeoId("gb-sct"), "GB");
  assert.equal(selectorFlagCodeToGeoId("gb-wls"), "GB");
  assert.equal(selectorFlagCodeToGeoId("gb-nir"), "GB");

  const { byGeoId } = buildSelectorCoverageMarkets();
  const uk = byGeoId.get("GB");
  assert.ok(uk);
  assert.equal(uk.isUnitedKingdom, true);
  assert.equal(uk.localeIds.length, 4);
  for (const name of ["England", "Scotland", "Wales", "Northern Ireland"]) {
    assert.match(uk.detail, new RegExp(name));
  }
});

test("all geographic markets resolve on the local map dataset", () => {
  const { markets } = buildSelectorCoverageMarkets();
  const mapIds = [
    ...worldMap.countries.map((c) => c.id),
    ...worldMap.markers.map((m) => m.id),
  ];
  const unmapped = findUnmappedCoverageMarkets(mapIds, markets);
  assert.deepEqual(
    unmapped.map((m) => m.geoId),
    []
  );

  // Tiny markets use marker fallbacks when polygons are absent.
  for (const id of ["BH", "CV", "MU", "SG"]) {
    assert.equal(
      worldMap.markers.some((m) => m.id === id),
      true,
      id
    );
    assert.equal(
      markets.some((m) => m.geoId === id),
      true,
      `market ${id}`
    );
  }

  assert.equal(worldMap.countries.some((c) => c.id === "PR"), true);
  assert.equal(markets.some((m) => m.geoId === "PR"), true);
});

test("coverage map modal wiring stays outside the option list", () => {
  const switcher = fs.readFileSync(
    path.join(repoRoot, "components/i18n/LanguageSwitcher.jsx"),
    "utf8"
  );
  assert.match(switcher, /GlobalCoverageMapModal/);
  assert.match(switcher, /viewCoverageMap/);
  assert.match(switcher, /data-language-switcher-coverage-map/);
  assert.doesNotMatch(switcher, /absolute end-0 top-full/);

  const mapSrc = fs.readFileSync(
    path.join(repoRoot, "components/i18n/GlobalCoverageMap.jsx"),
    "utf8"
  );
  assert.match(mapSrc, /buildSelectorCoverageMarkets/);
  assert.doesNotMatch(mapSrc, /LOCALE_SELECTOR_FLAG\s*=/);
});

test("mobile panel geometry still fits after coverage-map affordance", () => {
  for (const width of [320, 360, 390, 407, 430, 1280]) {
    const box = computeSelectorPanelBox(
      { top: 48, right: width - 8, bottom: 80, left: width - 88, width: 80, height: 32 },
      { width, height: 800 },
      { margin: 8, preferredWidth: 320 }
    );
    assert.equal(selectorPanelFitsViewport(box, { width, height: 800 }, 8), true, String(width));
  }
});
