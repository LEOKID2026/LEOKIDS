import patternsCopyEn from "../../content-packs/en/learning/learning-patterns-copy.json" with { type: "json" };

/**
 * @param {string} key
 */
export function patternCopy(key) {
  const val = patternsCopyEn.copy?.[key];
  return typeof val === "string" ? val : String(key || "");
}
