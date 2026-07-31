/**
 * Resolve math animation step titles from content pack (no English literals in engine).
 */
import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";
import { loadMathAnimationTitles } from "./learning-locale-contract.js";

/**
 * @param {string|null|undefined} [contentLocale]
 */
function titlesPack(contentLocale) {
  return (
    loadMathAnimationTitles(contentLocale) ||
    resolveRegisteredContentPack(contentLocale, "learning", "math-animation-titles.json") ||
    {}
  );
}

/**
 * @param {string} key
 * @param {Record<string, string|number>|undefined} [params]
 * @param {string|null|undefined} [contentLocale]
 */
export function animTitle(key, params, contentLocale) {
  const titlesEn = titlesPack(contentLocale);
  const template = titlesEn.titles?.[key];
  if (typeof template !== "string" || !template.trim()) return String(key || "");
  if (!params || typeof params !== "object") return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => {
    const val = params[name];
    return val == null ? "" : String(val);
  });
}
