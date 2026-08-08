/**
 * Composite client public-seo overlay resolver.
 * Dispatches to locale-specific indexes without mixing Arabic/Indonesian modules.
 */
import { getClientPublicSeoOverlay as getArabicPublicSeoOverlay } from "./public-seo-ar-001-client-index.js";
import { getClientPublicSeoOverlay as getIdIdPublicSeoOverlay } from "./public-seo-id-ID-client-index.js";

/**
 * @param {string|null|undefined} locale
 * @param {...string} segments
 * @returns {unknown}
 */
export function getClientPublicSeoOverlay(locale, ...segments) {
  return (
    getIdIdPublicSeoOverlay(locale, ...segments) ??
    getArabicPublicSeoOverlay(locale, ...segments)
  );
}
