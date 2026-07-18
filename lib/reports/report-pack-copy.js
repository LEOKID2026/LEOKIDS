import reportBurnDownIndex from "../../content-packs/en/reports/burn-down-index.json" with { type: "json" };
import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";

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
 * @param {string} slug
 * @param {string} key
 */
function lookupPackString(slug, key) {
  const pack = reportBurnDownIndex[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * Resolve report copy from content-packs/en/reports/burn-down packs (English source).
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function reportPackCopy(slug, key, vars) {
  const raw = lookupPackString(slug, key);
  return formatMessage(raw, vars, "en");
}

/**
 * Locale-aware report pack copy — applies ICU vars then pseudo-locale transforms.
 * @param {string|null|undefined} reportLocale
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function reportPackCopyForLocale(reportLocale, slug, key, vars) {
  const localeId = resolveLocaleDefinition(reportLocale || "en").id;
  const raw = lookupPackString(slug, key);
  const formatted = formatMessage(raw, vars, localeId);
  return applyReportLocaleTransform(formatted, localeId);
}

/**
 * @param {string|null|undefined} reportLocale
 */
export function createReportPackCopy(reportLocale) {
  return (slug, key, vars) => reportPackCopyForLocale(reportLocale, slug, key, vars);
}
