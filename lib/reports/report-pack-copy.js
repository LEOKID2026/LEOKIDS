import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { getContentFallbackChain } from "../content/locale.js";
import { getCatalogPackExact } from "../content/pack-catalog.js";
import { deepMergeJson } from "../i18n/deep-merge.js";

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
 * Deep-merge reports/burn-down-index.json along the content fallback chain
 * (e.g. es-ES → es-419 → en), matching loadContentPack leaf-overlay semantics.
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
    if (pack == null) continue;
    found = true;
    merged = /** @type {Record<string, unknown>} */ (
      deepMergeJson(merged ?? {}, pack)
    );
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
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function reportPackCopy(slug, key, vars) {
  const raw = lookupPackString("en", slug, key);
  return formatMessage(raw, vars, "en");
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
