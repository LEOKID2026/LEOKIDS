/**
 * Deep-merge plain JSON objects for sparse locale overlays.
 * Arrays and primitives from `overlay` replace; nested plain objects merge.
 * @param {unknown} base
 * @param {unknown} overlay
 * @returns {unknown}
 */
export function deepMergeJson(base, overlay) {
  if (overlay === undefined) return base;
  if (overlay === null || typeof overlay !== "object" || Array.isArray(overlay)) {
    return overlay;
  }
  if (base === null || base === undefined || typeof base !== "object" || Array.isArray(base)) {
    return Array.isArray(overlay) ? overlay : { ...overlay };
  }

  /** @type {Record<string, unknown>} */
  const out = { .../** @type {Record<string, unknown>} */ (base) };
  for (const [key, value] of Object.entries(/** @type {Record<string, unknown>} */ (overlay))) {
    const prev = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      out[key] = deepMergeJson(prev, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
