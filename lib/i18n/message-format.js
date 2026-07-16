/**
 * Lightweight ICU-ish message formatter (variables + plural select).
 * Supports: "Hello {name}" and "{count, plural, one {# item} other {# items}}"
 */

/**
 * @param {string} template
 * @param {Record<string, unknown>} [vars]
 * @param {string} [locale]
 */
export function formatMessage(template, vars = {}, locale = "en") {
  const src = String(template ?? "");
  if (!src) return "";

  // Plural: {count, plural, one {...} other {...}}
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

  // Simple variables {name}
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
  const id = String(locale || "en");
  if (id === "en-XA") return "en";
  if (id === "ar-XB") return "ar";
  return id;
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
 * Pseudo-locale expansion for missing-key / layout QA (en-XA).
 * @param {string} text
 */
export function applyPseudoLong(text) {
  const s = String(text || "");
  if (!s) return s;
  return `[[[ ${s} ~~~ ${s} ]]]`;
}
