import copilotEn from "../../locales/en/copilot.json" with { type: "json" };

/**
 * Resolve static Copilot English copy from locales/en/copilot.json (excluded from UI scan).
 * @param {string} messageCode e.g. copilot.answers.semantic.rank_subjects
 */
export function copilotStaticMessage(messageCode) {
  const parts = String(messageCode || "")
    .replace(/^copilot\./, "")
    .split(".")
    .filter(Boolean);
  /** @type {unknown} */
  let node = copilotEn;
  for (const part of parts) {
    if (!node || typeof node !== "object") return String(messageCode || "");
    node = /** @type {Record<string, unknown>} */ (node)[part];
  }
  return typeof node === "string" ? node : String(messageCode || "");
}
