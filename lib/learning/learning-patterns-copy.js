import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

/**
 * @param {string|null|undefined} [contentLocale]
 * @param {string} key
 */
export function patternCopyForLocale(contentLocale, key) {
  const pack =
    resolveRegisteredContentPack(contentLocale, "learning", "learning-patterns-copy.json") || {};
  const val = pack.copy?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * @param {string} key
 */
export function patternCopy(key) {
  return patternCopyForLocale("en", key);
}
