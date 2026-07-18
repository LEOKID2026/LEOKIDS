/**
 * Report locale resolution — separate from interface and content locales.
 */

import { resolveReportLocale as resolveReportLocaleCore } from "../i18n/locale-resolution.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { createTranslator } from "../i18n/create-translator.js";
import { localizeReportContract } from "./localize-report-contract.js";

/**
 * Resolve report locale for a parent membership + optional request hints.
 * @param {{
 *   preferredReportLanguage?: string|null,
 *   interfaceLocale?: string|null,
 *   reportLocale?: string|null,
 * }} [opts]
 */
export function resolveParentReportLocale(opts = {}) {
  return resolveReportLocaleCore({
    preferredReportLanguage: opts.preferredReportLanguage,
    interfaceLocale: opts.interfaceLocale,
    reportLocale: opts.reportLocale,
  });
}

/**
 * Create a report-scoped translator (does not follow interface locale cookie chain).
 * @param {string|null|undefined} localeId
 */
export function createReportTranslator(localeId) {
  const id = resolveLocaleDefinition(localeId || "en").id;
  return createTranslator(id);
}

/**
 * Localize a structured report contract using report locale.
 * @param {Record<string, unknown>} contract
 * @param {string|null|undefined} localeId
 */
export function localizeReportContractForLocale(contract, localeId) {
  const locale = resolveParentReportLocale({ reportLocale: localeId });
  return localizeReportContract(contract, locale);
}

/**
 * @param {string|null|undefined} localeId
 */
export function resolveReportDirection(localeId) {
  return resolveLocaleDefinition(resolveParentReportLocale({ reportLocale: localeId })).direction;
}

/**
 * Resolve production report locale from membership + optional request hint.
 * @param {{
 *   membershipLocales?: {
 *     ok?: boolean,
 *     preferredReportLanguage?: string|null,
 *     interfaceLanguage?: string|null,
 *   }|null,
 *   reportLocaleHint?: string|null,
 * }} [opts]
 */
export function resolveProductionReportLocale(opts = {}) {
  const membership = opts.membershipLocales;
  if (membership?.ok) {
    return resolveParentReportLocale({
      preferredReportLanguage: membership.preferredReportLanguage,
      interfaceLocale: membership.interfaceLanguage,
      reportLocale: opts.reportLocaleHint,
    });
  }
  return resolveParentReportLocale({
    reportLocale: opts.reportLocaleHint,
    interfaceLocale: "en",
  });
}

/**
 * Attach resolved report/interface locale ids to payload meta for API clients.
 * @param {Record<string, unknown>|null|undefined} payload
 * @param {{ reportLocale?: string|null, interfaceLocale?: string|null }} locales
 */
export function attachReportLocaleMeta(payload, locales = {}) {
  const base = payload && typeof payload === "object" ? payload : {};
  const meta =
    base.meta && typeof base.meta === "object" && !Array.isArray(base.meta)
      ? { ...base.meta }
      : {};
  if (locales.reportLocale) meta.reportLocale = locales.reportLocale;
  if (locales.interfaceLocale) meta.interfaceLocale = locales.interfaceLocale;
  return { ...base, meta };
}

export { localizeReportContract };
