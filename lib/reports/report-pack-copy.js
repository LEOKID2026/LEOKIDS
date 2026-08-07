import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { getContentFallbackChain } from "../content/locale.js";
import { CONTENT_PACK_CATALOG, getCatalogPackExact } from "../content/pack-catalog.js";
import { deepMergeJson } from "../i18n/deep-merge.js";

/** Active report locale for legacy `reportPackCopy()` call sites (set from I18nProvider). */
let activeReportPackLocale = "en";

/**
 * Bind report burn-down resolution to the active report locale (React tree).
 * @param {string|null|undefined} locale
 */
export function bindReportPackLocale(locale) {
  activeReportPackLocale = locale ? String(locale) : "en";
}

/**
 * @returns {string}
 */
export function getActiveReportPackLocale() {
  return activeReportPackLocale;
}

/**
 * Apply pseudo-locale transforms for report copy (en-XA / ar-XB).
 * @param {string} text
 * @param {string|null|undefined} reportLocale
 */
export function applyReportLocaleTransform(text, reportLocale) {
  const id = resolveLocaleDefinition(reportLocale || "en").id;
  const s = String(text ?? "");
  if (!s) return s;
  if (id === "en-XA") return applyPseudoLong(s);
  if (id === "ar-XB") return applyPseudoRtl(s);
  return s;
}

/**
 * @param {unknown} pack
 * @returns {Record<string, string>}
 */
function burnDownLeafCopy(pack) {
  if (!pack || typeof pack !== "object" || Array.isArray(pack)) return {};
  const maybeCopy = /** @type {{ copy?: unknown }} */ (pack).copy;
  if (maybeCopy && typeof maybeCopy === "object" && !Array.isArray(maybeCopy)) {
    /** @type {Record<string, string>} */
    const out = {};
    for (const [k, v] of Object.entries(maybeCopy)) {
      if (typeof v === "string") out[k] = v;
    }
    return out;
  }
  /** @type {Record<string, string>} */
  const out = {};
  for (const [k, v] of Object.entries(pack)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

/**
 * Merge registered `reports/burn-down/*.json` leaf overlays into a flat slug map.
 * Sparse country layers often ship leaf overrides without repeating them inside
 * burn-down-index.json; runtime must still honor the catalogued leaves.
 *
 * @param {string} localeId
 * @returns {Record<string, Record<string, string>>}
 */
function reportBurnDownLeavesForLocale(localeId) {
  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  const catalog = CONTENT_PACK_CATALOG[localeId] || {};
  for (const [rel, pack] of Object.entries(catalog)) {
    const match = String(rel).match(/^reports\/burn-down\/(.+)\.json$/);
    if (!match) continue;
    const copy = burnDownLeafCopy(pack);
    if (!Object.keys(copy).length) continue;
    out[match[1]] = copy;
  }
  return out;
}

/**
 * Deep-merge reports/burn-down-index.json along the content fallback chain
 * (e.g. es-ES → es-419 → en), matching loadContentPack leaf-overlay semantics.
 * Also merges catalogued reports/burn-down leaf packs so sparse country overlays
 * that author leaves without index mirrors still resolve at runtime.
 * @param {string|null|undefined} reportLocale
 * @returns {Record<string, Record<string, string>>}
 */
export function loadMergedReportBurnDownIndex(reportLocale) {
  const localeId = resolveLocaleDefinition(reportLocale || "en").id;
  const chain = getContentFallbackChain(localeId);
  /** @type {Record<string, unknown>|null} */
  let merged = null;
  let found = false;
  for (const loc of [...chain].reverse()) {
    const pack = getCatalogPackExact(loc, "reports/burn-down-index.json");
    if (pack != null) {
      found = true;
      merged = /** @type {Record<string, unknown>} */ (deepMergeJson(merged ?? {}, pack));
    }
    const leaves = reportBurnDownLeavesForLocale(loc);
    if (Object.keys(leaves).length) {
      found = true;
      merged = /** @type {Record<string, unknown>} */ (deepMergeJson(merged ?? {}, leaves));
    }
  }
  return /** @type {Record<string, Record<string, string>>} */ (found ? merged : {});
}

/**
 * @param {string|null|undefined} reportLocale
 * @param {string} slug
 * @param {string} key
 */
function lookupPackString(reportLocale, slug, key) {
  const index = loadMergedReportBurnDownIndex(reportLocale);
  const pack = index[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * Resolve report copy via locale pack catalog (fallback to en inside resolver).
 * Locale-aware when `bindReportPackLocale` is active (defaults to en on server/API).
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function reportPackCopy(slug, key, vars) {
  return reportPackCopyForLocale(activeReportPackLocale, slug, key, vars);
}

/**
 * Locale-aware report pack copy — pack resolution + ICU vars + pseudo transforms.
 * @param {string|null|undefined} reportLocale
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function reportPackCopyForLocale(reportLocale, slug, key, vars) {
  const localeId = resolveLocaleDefinition(reportLocale || "en").id;
  const raw = lookupPackString(localeId, slug, key);
  const formatted = formatMessage(raw, vars, localeId);
  return applyReportLocaleTransform(formatted, localeId);
}

/**
 * @param {string|null|undefined} reportLocale
 */
export function createReportPackCopy(reportLocale) {
  return (slug, key, vars) => reportPackCopyForLocale(reportLocale, slug, key, vars);
}
