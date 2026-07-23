/**
 * Visual-size normalization for full_trace SVG glyphs (English global).
 * @module lib/writing/writing-glyph-visual-scale
 */

/** @typedef {"en-upper" | "en-lower" | "digits"} WritingGlyphAssetGroup */

/** Neutral target: visible stroke height as fraction of glyph frame (md baseline). */
export const WRITING_GLYPH_TARGET_FILL_H = 0.7;

/** Median stroke bounding-box height as fraction of viewBox height (measured). */
export const WRITING_GLYPH_MEDIAN_FILL_H = /** @type {const} */ ({
  "en-upper": 0.822,
  "en-lower": 0.547,
  digits: 0.822,
});

/**
 * Scale applied inside the glyph frame for full_trace only.
 * @type {Record<WritingGlyphAssetGroup, number>}
 */
export const WRITING_GLYPH_VISUAL_SCALE_FULL_TRACE = {
  "en-upper": 0.8516,
  "en-lower": 1.2797,
  digits: 0.8516,
};

/**
 * @param {WritingGlyphAssetGroup | string | null | undefined} group
 * @param {import("./writing-worksheet-types.js").TraceRenderMode | string | undefined} traceRenderMode
 * @returns {number}
 */
export function writingGlyphVisualScaleForGroup(group, traceRenderMode) {
  if (traceRenderMode !== "full_trace" && traceRenderMode !== "faint_model") {
    return 1;
  }
  return writingGlyphVisualScaleForFullTrace(group);
}

/**
 * @param {WritingGlyphAssetGroup | string | null | undefined} group
 * @returns {number}
 */
export function writingGlyphVisualScaleForFullTrace(group) {
  if (!group) return 1;
  return WRITING_GLYPH_VISUAL_SCALE_FULL_TRACE[/** @type {WritingGlyphAssetGroup} */ (group)] ?? 1;
}
