import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

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
 * @param {string|null|undefined} reportLocale
 * @param {string} slug
 * @param {string} key
 */
function lookupPackString(reportLocale, slug, key) {
  const index = resolveRegisteredContentPack(reportLocale, "reports", "burn-down-index.json") || {};
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
