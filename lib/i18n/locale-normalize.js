/**
 * Central BCP 47 locale normalization and alias resolution.
 * All locale decisions must go through this module — no ad-hoc checks elsewhere.
 */

import { LOCALE_REGISTRY } from "./locale-registry.js";

/** @typedef {{ canonical: string, base: string|null, language: string, script: string|null, region: string|null }} NormalizedLocale */

const ENGLISH_NORMALIZED = Object.freeze({
  canonical: "en",
  base: null,
  language: "en",
  script: null,
  region: null,
});

/**
 * Unregistered language/canonical tags fall back to English (no special-casing by name).
 * A tag counts as registered when the exact id, bare language, or a same-language
 * regional/script variant (e.g. es-MX ↔ es-419) exists in LOCALE_REGISTRY.
 * @param {string} canonical
 * @param {string} language
 */
function isRegisteredLocaleTag(canonical, language) {
  if (LOCALE_REGISTRY[canonical] || LOCALE_REGISTRY[language]) return true;
  const lang = String(language || "").toLowerCase();
  if (!lang) return false;
  for (const def of Object.values(LOCALE_REGISTRY)) {
    const id = String(def.id || "");
    if (id === lang || id.toLowerCase().startsWith(`${lang}-`)) return true;
    if (
      Array.isArray(def.aliases) &&
      def.aliases.some((a) => {
        const n = String(a || "")
          .toLowerCase()
          .replace(/_/g, "-");
        return n === String(canonical || "").toLowerCase() || n.split("-")[0] === lang;
      })
    ) {
      return true;
    }
  }
  return false;
}

/** Known aliases → canonical registry id */
const ALIAS_MAP = Object.freeze({
  "en-us": "en",
  "en-xa": "en-XA",
  "ar-xb": "ar-XB",
  "es-la": "es-419",
});

/**
 * Resolve an exact registered locale id (case-insensitive), including non-ISO
 * tags such as `en-WLS` (3-letter country layer) that BCP 47 region/script
 * parsing would otherwise drop.
 * @param {string} lower
 * @returns {string|null}
 */
function findRegisteredLocaleId(lower) {
  for (const id of Object.keys(LOCALE_REGISTRY)) {
    if (id.toLowerCase() === lower) return id;
  }
  return null;
}

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
    return { ...ENGLISH_NORMALIZED };
  }

  const lower = input.toLowerCase();
  if (ALIAS_MAP[lower]) {
    const canonical = ALIAS_MAP[lower];
    return expandCanonical(canonical);
  }

  const registeredExact = findRegisteredLocaleId(lower);
  if (registeredExact) {
    return expandCanonical(registeredExact);
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
    } else if (/^[A-Za-z]{3}$/.test(p)) {
      // Preserve registered-style 3-letter layers (e.g. WLS) as region tokens.
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

  const registeredCanonical = findRegisteredLocaleId(canonical.toLowerCase());
  if (registeredCanonical) {
    return expandCanonical(registeredCanonical);
  }

  if (!isRegisteredLocaleTag(canonical, language)) {
    return { ...ENGLISH_NORMALIZED };
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
    if (/^[A-Za-z]{4}$/.test(p)) script = p[0].toUpperCase() + p.slice(1).toLowerCase();
    else if (/^[A-Za-z]{2}$/.test(p) || /^\d{3}$/.test(p) || /^[A-Za-z]{3}$/.test(p)) {
      region = p.toUpperCase();
    }
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
 * Build fallback chain: exact → (parent or language base) → default.
 *
 * When `configuredFallback` is a same-language regional/script parent
 * (e.g. es-MX → es-419), that parent is preferred over the bare language base
 * so future country locales resolve as: country → es-419 → en.
 *
 * Regional locales that fall straight to the default locale skip the bare
 * language stub (es-419 → en, not es-419 → es → en).
 *
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

  const cfg =
    configuredFallback && configuredFallback !== n.canonical ? configuredFallback : null;
  const cfgNorm = cfg ? normalizeLocaleInput(cfg) : null;
  const sameLanguageRegionalParent =
    Boolean(cfg) &&
    Boolean(cfgNorm) &&
    cfgNorm.language === n.language &&
    cfg !== n.base &&
    Boolean(cfgNorm.region || cfgNorm.script);

  if (sameLanguageRegionalParent) {
    push(cfg);
  } else if (n.region && cfg === defaultLocale) {
    // es-419 → en (skip inert bare-language stub)
    push(cfg);
  } else {
    if (n.base && n.base !== n.canonical) push(n.base);
    if (cfg && cfg !== n.base) push(cfg);
  }

  push(defaultLocale);
  return chain;
}
