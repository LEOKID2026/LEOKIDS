/**
 * Selector region metadata for the global market/language picker.
 * Data-driven SoT separate from routing/fallback — keyed by registry locale id.
 * Every selectable (selectorVisible) locale must appear here exactly once.
 */

/** @typedef {"americas"|"europe"|"africa"|"middle_east"|"asia"|"oceania"} SelectorRegionId */

/** @type {readonly SelectorRegionId[]} */
export const SELECTOR_REGION_ORDER = Object.freeze([
  "americas",
  "europe",
  "africa",
  "middle_east",
  "asia",
  "oceania",
]);

/** @type {Readonly<Record<SelectorRegionId, string>>} */
export const SELECTOR_REGION_LABELS = Object.freeze({
  americas: "Americas",
  europe: "Europe",
  africa: "Africa",
  middle_east: "Middle East",
  asia: "Asia",
  oceania: "Oceania",
});

/**
 * Locale id → selector region. Inventory authority for the selector picker.
 * @type {Readonly<Record<string, SelectorRegionId>>}
 */
export const LOCALE_SELECTOR_REGION = Object.freeze({
  // Americas
  en: "americas",
  "es-MX": "americas",
  "es-CO": "americas",
  "es-AR": "americas",
  "es-PE": "americas",
  "es-CL": "americas",
  "es-EC": "americas",
  "es-GT": "americas",
  "es-DO": "americas",
  "es-VE": "americas",
  "es-BO": "americas",
  "es-HN": "americas",
  "es-SV": "americas",
  "es-NI": "americas",
  "es-PY": "americas",
  "es-CR": "americas",
  "es-PA": "americas",
  "es-UY": "americas",
  "es-CU": "americas",
  "es-PR": "americas",
  "pt-BR": "americas",
  "en-CA": "americas",
  "fr-CA": "americas",
  "es-US": "americas",
  "nl-SR": "americas",
  "en-JM": "americas",
  "en-TT": "americas",
  "en-BS": "americas",
  "en-GY": "americas",

  // Europe
  "es-ES": "europe",
  "pt-PT": "europe",
  "it-IT": "europe",
  "fr-FR": "europe",
  "nl-NL": "europe",
  "de-DE": "europe",
  "de-AT": "europe",
  "de-CH": "europe",
  "ru-RU": "europe",
  "en-IE": "europe",
  "en-GB": "europe",
  "en-WLS": "europe",
  "en-SCT": "europe",
  "en-NIR": "europe",
  "nl-BE": "europe",
  "fr-BE": "europe",
  "fr-CH": "europe",
  "it-CH": "europe",
  "ru-BY": "europe",

  // Africa (includes Maghreb Arabic markets)
  "ar-MA": "africa",
  "ar-DZ": "africa",
  "ar-TN": "africa",
  "pt-AO": "africa",
  "pt-MZ": "africa",
  "fr-CI": "africa",
  "en-ZA": "africa",
  "en-NG": "africa",
  "en-KE": "africa",
  "en-GH": "africa",
  "fr-SN": "africa",
  "fr-CD": "africa",
  "en-RW": "africa",
  "fr-CM": "africa",
  "en-CM": "africa",
  "fr-BJ": "africa",
  "en-MU": "africa",
  "fr-GN": "africa",
  "fr-TG": "africa",
  "fr-GA": "africa",
  "fr-CG": "africa",
  "pt-CV": "africa",
  "es-GQ": "africa",
  "en-SL": "africa",
  "en-LR": "africa",
  "en-GM": "africa",

  // Middle East (Arabic MSA + Near East / Gulf)
  "ar-001": "middle_east",
  "ar-EG": "middle_east",
  "ar-SA": "middle_east",
  "ar-IQ": "middle_east",
  "ar-JO": "middle_east",
  "ar-AE": "middle_east",
  "ar-KW": "middle_east",
  "ar-QA": "middle_east",
  "ar-OM": "middle_east",
  "ar-BH": "middle_east",

  // Asia
  "id-ID": "asia",
  "en-SG": "asia",
  "en-PH": "asia",
  "en-IN": "asia",
  "ru-KZ": "asia",
  "ru-UZ": "asia",
  "ru-KG": "asia",

  // Oceania
  "en-AU": "oceania",
  "en-NZ": "oceania",
});

/**
 * @param {string|null|undefined} localeId
 * @returns {SelectorRegionId|null}
 */
export function getLocaleSelectorRegion(localeId) {
  const id = String(localeId || "").trim();
  if (!id) return null;
  return LOCALE_SELECTOR_REGION[id] || null;
}

/**
 * @param {string|null|undefined} regionId
 */
export function getSelectorRegionLabel(regionId) {
  const id = String(regionId || "");
  return SELECTOR_REGION_LABELS[id] || id;
}

/**
 * Display label used in the market selector (never a raw locale code for UX).
 * @param {{ id?: string, label?: string, nativeName?: string, displayName?: string }} loc
 */
export function getSelectorDisplayLabel(loc) {
  if (!loc || typeof loc !== "object") return "";
  return String(loc.label || loc.nativeName || loc.displayName || loc.id || "").trim();
}

/**
 * Case-insensitive market search across display names + registry aliases.
 * Does not match locale codes for user-facing search.
 * @param {{ id: string, label?: string, nativeName?: string, displayName?: string, aliases?: string[] }} loc
 * @param {string} query
 */
export function localeMatchesSelectorQuery(loc, query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return true;
  /** @type {string[]} */
  const hay = [
    getSelectorDisplayLabel(loc),
    loc.nativeName,
    loc.displayName,
    loc.label,
    ...(Array.isArray(loc.aliases) ? loc.aliases : []),
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());
  return hay.some((h) => h.includes(q));
}

/**
 * Group selectable locales by region, alphabetically within each region.
 * @param {Array<{ id: string, label?: string, nativeName?: string, displayName?: string }>} locales
 * @param {{ query?: string }} [opts]
 * @returns {{ regionId: SelectorRegionId, label: string, locales: typeof locales }[]}
 */
export function groupLocalesBySelectorRegion(locales, opts = {}) {
  const query = opts.query || "";
  /** @type {Map<SelectorRegionId, typeof locales>} */
  const buckets = new Map();
  for (const regionId of SELECTOR_REGION_ORDER) {
    buckets.set(regionId, []);
  }

  for (const loc of locales || []) {
    if (!localeMatchesSelectorQuery(loc, query)) continue;
    const regionId = getLocaleSelectorRegion(loc.id);
    if (!regionId || !buckets.has(regionId)) {
      throw new Error(`Selectable locale missing selector region: ${loc.id}`);
    }
    buckets.get(regionId).push(loc);
  }

  /** @type {{ regionId: SelectorRegionId, label: string, locales: typeof locales }[]} */
  const groups = [];
  for (const regionId of SELECTOR_REGION_ORDER) {
    const list = buckets.get(regionId) || [];
    if (!list.length) continue;
    list.sort((a, b) =>
      getSelectorDisplayLabel(a).localeCompare(getSelectorDisplayLabel(b), "en", {
        sensitivity: "base",
      })
    );
    groups.push({
      regionId,
      label: getSelectorRegionLabel(regionId),
      locales: list,
    });
  }
  return groups;
}
