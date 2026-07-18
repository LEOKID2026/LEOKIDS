/**
 * PWA locale helpers — manifest, cache keys, start URLs.
 */

import { resolveDirection, resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { withLocalePath } from "../i18n/locale-path.js";

/**
 * @param {string|null|undefined} localeId
 */
export function resolvePwaManifestLocale(localeId) {
  const def = resolveLocaleDefinition(localeId);
  return {
    lang: def.id === "en-XA" ? "en-XA" : def.intlLocale || def.id,
    dir: resolveDirection(def.id),
    name: def.displayName,
    shortName: def.displayName,
  };
}

/**
 * @param {string|null|undefined} localeId
 * @param {string} startPath
 */
export function resolvePwaStartUrl(localeId, startPath) {
  return withLocalePath(localeId, startPath);
}

/**
 * Service worker / precache namespace including locale.
 * @param {string|null|undefined} localeId
 * @param {string} baseKey
 */
export function buildPwaCacheKey(localeId, baseKey) {
  const def = resolveLocaleDefinition(localeId);
  return `lk-global-${def.id}-${baseKey}`;
}
