/**
 * Central BCP 47 locale normalization and alias resolution.
 * All locale decisions must go through this module — no ad-hoc checks elsewhere.
 */

/** @typedef {{ canonical: string, base: string|null, language: string, script: string|null, region: string|null }} NormalizedLocale */

/** Known aliases → canonical registry id */
const ALIAS_MAP = Object.freeze({
  "en-us": "en",
  "en-gb": "en",
  "en-au": "en",
  "en-ca": "en",
  "en-xa": "en-XA",
  "ar-xb": "ar-XB",
  he: "he",
  "he-il": "he",
});

/**
 * Normalize raw locale input to a canonical BCP 47-style id used in registry keys.
 * @param {string|null|undefined} raw
 * @returns {NormalizedLocale}
 */
export function normalizeLocaleInput(raw) {
  const input = String(raw || "")
    .trim()
    .replace(/_/g, "-");

  if (!input) {
    return {
      canonical: "en",
      base: null,
      language: "en",
      script: null,
      region: null,
    };
  }

  const lower = input.toLowerCase();
  if (ALIAS_MAP[lower]) {
    const canonical = ALIAS_MAP[lower];
    return expandCanonical(canonical);
  }

  const parts = input.split("-").filter(Boolean);
  const language = (parts[0] || "en").toLowerCase();
  let script = null;
  let region = null;

  for (let i = 1; i < parts.length; i += 1) {
    const p = parts[i];
    if (/^[A-Za-z]{4}$/.test(p)) {
      script = p[0].toUpperCase() + p.slice(1).toLowerCase();
    } else if (/^[A-Za-z]{2}$/.test(p) || /^\d{3}$/.test(p)) {
      region = p.toUpperCase();
    }
  }

  /** @type {string[]} */
  const canonicalParts = [language];
  if (script) canonicalParts.push(script);
  if (region) canonicalParts.push(region);
  const canonical = canonicalParts.join("-");

  const aliasHit = ALIAS_MAP[canonical.toLowerCase()];
  if (aliasHit) {
    return expandCanonical(aliasHit);
  }

  return {
    canonical,
    base: script || region ? language : null,
    language,
    script,
    region,
  };
}

/**
 * @param {string} canonical
 * @returns {NormalizedLocale}
 */
function expandCanonical(canonical) {
  const parts = canonical.split("-");
  const language = parts[0].toLowerCase();
  let script = null;
  let region = null;
  for (let i = 1; i < parts.length; i += 1) {
    const p = parts[i];
    if (/^[A-Za-z]{4}$/.test(p)) script = p;
    else region = p.toUpperCase();
  }
  return {
    canonical,
    base: parts.length > 1 ? language : null,
    language,
    script,
    region,
  };
}

/**
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function normalizeLocaleId(raw) {
  return normalizeLocaleInput(raw).canonical;
}

/**
 * @param {string|null|undefined} raw
 * @returns {string|null}
 */
export function getBaseLocaleId(raw) {
  const n = normalizeLocaleInput(raw);
  if (n.base) return n.base;
  const parts = n.canonical.split("-");
  return parts.length > 1 ? parts[0] : null;
}

/**
 * Build fallback chain: exact → base → configured fallback → default.
 * @param {string|null|undefined} raw
 * @param {{ configuredFallback?: string|null, defaultLocale?: string }} [opts]
 * @returns {string[]}
 */
export function buildLocaleFallbackChain(raw, opts = {}) {
  const defaultLocale = opts.defaultLocale || "en";
  const configuredFallback = opts.configuredFallback ?? defaultLocale;
  const n = normalizeLocaleInput(raw);
  /** @type {string[]} */
  const chain = [];
  const push = (id) => {
    if (!id || chain.includes(id)) return;
    chain.push(id);
  };
  push(n.canonical);
  if (n.base && n.base !== n.canonical) push(n.base);
  if (configuredFallback && configuredFallback !== n.canonical && configuredFallback !== n.base) {
    push(configuredFallback);
  }
  push(defaultLocale);
  return chain;
}
