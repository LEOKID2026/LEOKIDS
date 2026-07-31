import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

/**
 * @param {string|null|undefined} [contentLocale]
 * @param {string} slug
 * @param {string} key
 */
export function burnDownCopyForLocale(contentLocale, slug, key) {
  const index = resolveRegisteredContentPack(contentLocale, "learning", "burn-down-index.json") || {};
  const pack = index[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * @param {string} slug
 * @param {string} key
 */
export function burnDownCopy(slug, key) {
  return burnDownCopyForLocale("en", slug, key);
}
