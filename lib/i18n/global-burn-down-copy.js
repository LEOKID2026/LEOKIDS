import globalBurnDownIndex from "../../content-packs/en/global-burn-down/burn-down-index.json" with { type: "json" };

/**
 * @param {string} slug
 * @param {string} key
 */
export function globalBurnDownCopy(slug, key) {
  const pack = globalBurnDownIndex[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}
