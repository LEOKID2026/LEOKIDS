/**
 * Resolve math animation step titles from content pack (no English literals in engine).
 */
import titlesEn from "../../content-packs/en/learning/math-animation-titles.json" with { type: "json" };

/**
 * @param {string} key
 * @param {Record<string, string|number>|undefined} [params]
 */
export function animTitle(key, params) {
  const template = titlesEn.titles?.[key];
  if (typeof template !== "string" || !template.trim()) return String(key || "");
  if (!params || typeof params !== "object") return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => {
    const val = params[name];
    return val == null ? "" : String(val);
  });
}
