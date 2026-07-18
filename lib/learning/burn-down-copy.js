import burnDownIndex from "../../content-packs/en/learning/burn-down-index.json" with { type: "json" };

/**
 * @param {string} slug
 * @param {string} key
 */
export function burnDownCopy(slug, key) {
  const pack = burnDownIndex[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}
