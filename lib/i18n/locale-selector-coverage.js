/**
 * Geographic coverage for the global market map — derived from selector SoT.
 * Do not maintain a parallel covered-countries list here.
 */

import { getSelectableLocales } from "./locale-registry.js";
import { getLocaleSelectorFlag } from "./locale-selector-flags.js";
import { getSelectorDisplayLabel } from "./locale-selector-regions.js";

/** @typedef {{ id: string, label?: string, nativeName?: string, displayName?: string, aliases?: string[] }} CoverageLocale */

/**
 * Minimal language-tag → display label for multi-language market details.
 * Generic; not a per-locale coverage list.
 * @type {Readonly<Record<string, string>>}
 */
export const COVERAGE_LANGUAGE_LABELS = Object.freeze({
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  nl: "Nederlands",
  it: "Italiano",
  pt: "Português",
  ar: "العربية",
  id: "Bahasa Indonesia",
  ru: "Русский",
});

/** UK selector flag codes that collapse to a single United Kingdom map geometry. */
export const UK_SELECTOR_FLAG_CODES = Object.freeze([
  "gb-eng",
  "gb-sct",
  "gb-wls",
  "gb-nir",
]);

/**
 * Normalize a selector flag code to a world-map geography id (ISO 3166-1 alpha-2).
 * UK constituent flags → GB. Icon / unknown → null.
 * @param {string|null|undefined} flagCode
 * @returns {string|null}
 */
export function selectorFlagCodeToGeoId(flagCode) {
  const code = String(flagCode || "")
    .trim()
    .toLowerCase();
  if (!code) return null;
  if (UK_SELECTOR_FLAG_CODES.includes(code)) return "GB";
  if (/^[a-z]{2}$/.test(code)) return code.toUpperCase();
  return null;
}

/**
 * @param {string|null|undefined} localeId
 * @returns {string|null}
 */
export function getLocaleCoverageGeoId(localeId) {
  const meta = getLocaleSelectorFlag(localeId);
  if (!meta || meta.kind !== "country") return null;
  return selectorFlagCodeToGeoId(meta.code);
}

/**
 * @param {string|null|undefined} localeId
 */
export function getCoverageLanguageLabel(localeId) {
  const id = String(localeId || "").trim();
  const lang = id.split("-")[0]?.toLowerCase() || "";
  return COVERAGE_LANGUAGE_LABELS[lang] || lang.toUpperCase();
}

/**
 * Human market title for a geography id (Intl region display name).
 * @param {string} geoId
 * @param {string} [locale="en"]
 */
export function getCoverageMarketTitle(geoId, locale = "en") {
  const id = String(geoId || "").toUpperCase();
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    const name = dn.of(id);
    if (name) return name;
  } catch {
    // ignore
  }
  return id;
}

/**
 * @typedef {{
 *   geoId: string,
 *   title: string,
 *   detail: string,
 *   localeIds: string[],
 *   isUnitedKingdom: boolean,
 * }} CoverageMarket
 */

/**
 * Build deduplicated geographic coverage markets from selectable locales.
 * Excludes Arabic Master (ar-001 / icon entries). Collapses UK nations to GB.
 *
 * @param {CoverageLocale[]} [locales]
 * @returns {{ markets: CoverageMarket[], marketCount: number, byGeoId: Map<string, CoverageMarket> }}
 */
export function buildSelectorCoverageMarkets(locales) {
  const list = Array.isArray(locales) ? locales : getSelectableLocales();
  /** @type {Map<string, CoverageLocale[]>} */
  const groups = new Map();

  for (const loc of list) {
    const geoId = getLocaleCoverageGeoId(loc.id);
    if (!geoId) continue;
    if (!groups.has(geoId)) groups.set(geoId, []);
    groups.get(geoId).push(loc);
  }

  /** @type {CoverageMarket[]} */
  const markets = [];
  for (const [geoId, members] of groups.entries()) {
    members.sort((a, b) =>
      getSelectorDisplayLabel(a).localeCompare(getSelectorDisplayLabel(b), "en", {
        sensitivity: "base",
      })
    );
    const isUnitedKingdom = geoId === "GB";
    const title = getCoverageMarketTitle(geoId);
    let detail = "";
    if (isUnitedKingdom) {
      detail = members.map((m) => getSelectorDisplayLabel(m)).join(" · ");
    } else if (members.length > 1) {
      const langs = [...new Set(members.map((m) => getCoverageLanguageLabel(m.id)))];
      detail = langs.join(" · ");
    } else {
      detail = getCoverageLanguageLabel(members[0].id);
    }
    markets.push({
      geoId,
      title,
      detail,
      localeIds: members.map((m) => m.id),
      isUnitedKingdom,
    });
  }

  markets.sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
  /** @type {Map<string, CoverageMarket>} */
  const byGeoId = new Map(markets.map((m) => [m.geoId, m]));
  return {
    markets,
    marketCount: markets.length,
    byGeoId,
  };
}

/**
 * Resolve every geographic selector market against map polygon/marker ids.
 * @param {Iterable<string>} mapGeoIds
 * @param {CoverageMarket[]} markets
 */
export function findUnmappedCoverageMarkets(mapGeoIds, markets) {
  const available = new Set(
    [...mapGeoIds].map((id) => String(id || "").toUpperCase()).filter(Boolean)
  );
  return (markets || []).filter((m) => !available.has(m.geoId));
}
