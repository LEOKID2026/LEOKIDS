import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

/**
 * @param {string|null|undefined} [contentLocale]
 * @param {string} slug
 * @param {string} key
 */
export function globalBurnDownCopyForLocale(contentLocale, slug, key) {
  const index =
    resolveRegisteredContentPack(contentLocale, "global-burn-down", "burn-down-index.json") || {};
  const pack = index[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * @param {string} slug
 * @param {string} key
 */
export function globalBurnDownCopy(slug, key) {
  return globalBurnDownCopyForLocale("en", slug, key);
}
