/**
 * Lightweight ICU-ish message formatter + centralized Intl wrappers.
 */

import { resolveLocaleDefinition } from "./locale-registry.js";

/**
 * @param {string} template
 * @param {Record<string, unknown>} [vars]
 * @param {string} [locale]
 */
export function formatMessage(template, vars = {}, locale = "en") {
  const src = String(template ?? "");
  if (!src) return "";

  let out = src.replace(
    /\{(\w+)\s*,\s*plural\s*,\s*((?:[^{}]+|\{[^{}]*\})+)\}/g,
    (_m, name, body) => {
      const n = Number(vars[name]);
      const rule = Number.isFinite(n)
        ? new Intl.PluralRules(normalizeIntlLocale(locale)).select(n)
        : "other";
      const arms = parsePluralArms(body);
      const chosen = arms[rule] || arms.other || "";
      return chosen.replace(/#/g, String(Number.isFinite(n) ? n : vars[name] ?? ""));
    }
  );

  out = out.replace(/\{(\w+)\}/g, (_m, name) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) {
      const v = vars[name];
      return v == null ? "" : String(v);
    }
    return `{${name}}`;
  });

  return out;
}

/**
 * @param {string} body
 */
function parsePluralArms(body) {
  /** @type {Record<string, string>} */
  const arms = {};
  const re = /(\w+)\s*\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(body))) {
    arms[m[1]] = m[2];
  }
  return arms;
}

/**
 * @param {string} locale
 */
export function normalizeIntlLocale(locale) {
  const def = resolveLocaleDefinition(locale);
  return def.intlLocale || def.id;
}

/**
 * @param {number} value
 * @param {string} locale
 * @param {Intl.NumberFormatOptions} [opts]
 */
export function formatNumber(value, locale, opts) {
  return new Intl.NumberFormat(normalizeIntlLocale(locale), opts).format(value);
}

/**
 * @param {Date|number|string} value
 * @param {string} locale
 * @param {Intl.DateTimeFormatOptions} [opts]
 */
export function formatDate(value, locale, opts) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(normalizeIntlLocale(locale), opts).format(d);
}

/**
 * @param {Date|number|string} value
 * @param {string} locale
 * @param {Intl.DateTimeFormatOptions} [opts]
 */
export function formatTime(value, locale, opts) {
  return formatDate(value, locale, { hour: "numeric", minute: "numeric", ...opts });
}

/**
 * @param {Date|number|string} value
 * @param {string} locale
 * @param {Intl.DateTimeFormatOptions} [opts]
 */
export function formatRelativeTime(value, locale, opts = {}) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const now = Date.now();
  const diffSec = Math.round((d.getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat(normalizeIntlLocale(locale), {
    numeric: "auto",
    ...opts,
  });
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
  const diffDay = Math.round(diffHour / 24);
  return rtf.format(diffDay, "day");
}

/**
 * @param {string[]} items
 * @param {string} locale
 * @param {Intl.ListFormatOptions} [opts]
 */
export function formatList(items, locale, opts) {
  return new Intl.ListFormat(normalizeIntlLocale(locale), opts).format(items);
}

/**
 * @param {number} value
 * @param {string} locale
 * @param {string} [currency]
 */
export function formatCurrency(value, locale, currency = "USD") {
  return formatNumber(value, locale, { style: "currency", currency });
}

/**
 * @param {number} value
 * @param {string} locale
 * @param {Intl.NumberFormatOptions} [opts]
 */
export function formatPercent(value, locale, opts) {
  return formatNumber(value, locale, { style: "percent", ...opts });
}

/**
 * Pseudo-locale expansion for layout QA (en-XA).
 * @param {string} text
 */
export function applyPseudoLong(text) {
  const s = String(text || "");
  if (!s) return s;
  return `[[[ ${s} ~~~ ${s} ]]]`;
}

/**
 * Pseudo RTL marker for layout QA (ar-XB) — keeps identifiers/numbers readable.
 * @param {string} text
 */
export function applyPseudoRtl(text) {
  const s = String(text || "");
  if (!s) return s;
  return `\u202B${s}\u202C`;
}
