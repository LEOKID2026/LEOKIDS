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

test("selector count remains 93 while coverage excludes Arabic Master", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 93);
  assert.equal(getLocaleCoverageGeoId("ar-001"), null);
  assert.equal(getLocaleSelectorFlag("ar-001")?.kind, "icon");
});

test("coverage markets are derived from selector SoT and deduplicated", () => {
  const { markets, marketCount, byGeoId } = buildSelectorCoverageMarkets();
  assert.equal(marketCount, markets.length);
  assert.equal(byGeoId.size, marketCount);

  // Unique flag codes collapse UK subdivisions → fewer geographies than selector rows.
  assert.equal(marketCount < 90, true);
  assert.equal(marketCount > 70, true);
  assert.equal(marketCount, 83);

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
  assert.match(mapSrc, /useI18n/);
  assert.match(mapSrc, /coverageMapSummary/);
  assert.doesNotMatch(mapSrc, /Available across \$\{/);
  assert.doesNotMatch(mapSrc, /LOCALE_SELECTOR_FLAG\s*=/);
});

test("coverage map UI strings are localized for ar/es/id masters", () => {
  const ar = JSON.parse(fs.readFileSync(path.join(repoRoot, "locales/ar-001/ui.json"), "utf8"));
  const es = JSON.parse(fs.readFileSync(path.join(repoRoot, "locales/es-419/ui.json"), "utf8"));
  const id = JSON.parse(fs.readFileSync(path.join(repoRoot, "locales/id-ID/ui.json"), "utf8"));
  const en = JSON.parse(fs.readFileSync(path.join(repoRoot, "locales/en/ui.json"), "utf8"));

  for (const pack of [ar, es, id, en]) {
    const sw = pack.languageSwitcher;
    assert.ok(sw.coverageMapTitle);
    assert.match(sw.coverageMapSummary, /\{count\}/);
    assert.ok(sw.coverageMapHint);
    assert.ok(sw.coverageMapClose);
    assert.ok(sw.coverageLanguages?.en);
    assert.ok(sw.coverageUkNations?.["en-GB"]);
  }

  assert.match(ar.languageSwitcher.coverageMapTitle, /تغطية|LEO/);
  assert.match(es.languageSwitcher.coverageMapTitle, /Cobertura/i);
  assert.notEqual(ar.languageSwitcher.coverageMapHint, en.languageSwitcher.coverageMapHint);
  assert.notEqual(es.languageSwitcher.coverageMapClose, en.languageSwitcher.coverageMapClose);
});

test("coverage market titles follow display locale via Intl", () => {
  const { byGeoId: enMarkets } = buildSelectorCoverageMarkets(undefined, {
    displayLocale: "en",
  });
  const { byGeoId: arMarkets } = buildSelectorCoverageMarkets(undefined, {
    displayLocale: "ar-001",
    resolveLanguageLabel: () => "الإنجليزية",
    resolveUkNationLabel: (loc) => loc.id,
  });
  assert.equal(enMarkets.get("CA")?.title, "Canada");
  assert.notEqual(arMarkets.get("CA")?.title, "Canada");
  assert.match(String(arMarkets.get("CA")?.title || ""), /كندا|Canada/);
});

test("homepage hero hosts coverage map and removes both promo videos", () => {
  const hero = fs.readFileSync(path.join(repoRoot, "components/home/HomeHero.jsx"), "utf8");
  const kids = fs.readFileSync(path.join(repoRoot, "components/home/HomeKidsSection.jsx"), "utf8");
  const indexPage = fs.readFileSync(path.join(repoRoot, "pages/index.js"), "utf8");
  assert.match(hero, /GlobalCoverageMap/);
  assert.match(hero, /home-hero-coverage-map/);
  assert.match(hero, /1\.06fr/);
  assert.match(hero, /0\.94fr/);
  assert.doesNotMatch(hero, /content-priority|1\.55fr|max-w-\[22rem\]/);
  assert.doesNotMatch(hero, /lg:flex-nowrap/);
  assert.doesNotMatch(hero, /PromoVideoClickablePreview|ParentPromoVideo|PARENT_PROMO/);
  assert.doesNotMatch(kids, /StudentPromoVideo|PromoVideo/);
  assert.doesNotMatch(indexPage, /HomeParentVideo/);
});

test("coverage map uses compact header and stable details height", () => {
  const mapSrc = fs.readFileSync(
    path.join(repoRoot, "components/i18n/GlobalCoverageMap.jsx"),
    "utf8"
  );
  assert.match(mapSrc, /data-coverage-header/);
  assert.match(mapSrc, /data-coverage-details-stable/);
  assert.match(mapSrc, /data-coverage-layout="stable-details"/);
  assert.match(mapSrc, /h-\[3\.75rem\]/);
  assert.match(mapSrc, /justify-between/);
  // Top duplicate helper above the map must not render; hint stays in details slot only.
  assert.doesNotMatch(
    mapSrc,
    /<p className=\{hintClass\}>\{hint\}<\/p>/
  );
  const hintOccurrences = (mapSrc.match(/\{hint\}/g) || []).length;
  assert.equal(hintOccurrences >= 1, true);
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
