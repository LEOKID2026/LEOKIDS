/**
 * Viewport-aware geometry for the market selector dropdown panel.
 * Keeps the panel fully inside the viewport (no horizontal clipping / scroll).
 */

/**
 * @typedef {{
 *   left: number,
 *   top: number,
 *   width: number,
 *   maxHeight: number,
 *   placement: "below" | "above",
 * }} SelectorPanelBox
 */

/**
 * @param {{ top: number, right: number, bottom: number, left: number, width: number, height: number }} triggerRect
 * @param {{ width: number, height: number }} viewport
 * @param {{
 *   margin?: number,
 *   gap?: number,
 *   preferredWidth?: number,
 *   preferredMaxHeight?: number,
 *   minHeight?: number,
 * }} [opts]
 * @returns {SelectorPanelBox}
 */
export function computeSelectorPanelBox(triggerRect, viewport, opts = {}) {
  const margin = Number.isFinite(opts.margin) ? opts.margin : 8;
  const gap = Number.isFinite(opts.gap) ? opts.gap : 4;
  const preferredWidth = Number.isFinite(opts.preferredWidth) ? opts.preferredWidth : 320;
  const preferredMaxHeight = Number.isFinite(opts.preferredMaxHeight)
    ? opts.preferredMaxHeight
    : 420;
  const minHeight = Number.isFinite(opts.minHeight) ? opts.minHeight : 160;

  const vw = Math.max(0, Number(viewport.width) || 0);
  const vh = Math.max(0, Number(viewport.height) || 0);

  const width = Math.max(0, Math.min(preferredWidth, vw - margin * 2));

  // Prefer aligning the panel's inline-end with the trigger's inline-end (LTR end = right),
  // then clamp so the full width stays inside the viewport with side margins.
  let left = Number(triggerRect.right) - width;
  const maxLeft = Math.max(margin, vw - margin - width);
  left = Math.min(Math.max(left, margin), maxLeft);

  const spaceBelow = vh - Number(triggerRect.bottom) - margin;
  const spaceAbove = Number(triggerRect.top) - margin;
  const placeBelow = spaceBelow >= minHeight || spaceBelow >= spaceAbove;

  if (placeBelow) {
    const top = Number(triggerRect.bottom) + gap;
    const maxHeight = Math.max(
      Math.min(preferredMaxHeight, spaceBelow - gap),
      Math.min(minHeight, Math.max(0, spaceBelow - gap))
    );
    return {
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(width),
      maxHeight: Math.round(Math.max(0, maxHeight)),
      placement: "below",
    };
  }

  const maxHeight = Math.max(
    Math.min(preferredMaxHeight, spaceAbove - gap),
    Math.min(minHeight, Math.max(0, spaceAbove - gap))
  );
  const top = Math.max(margin, Number(triggerRect.top) - gap - maxHeight);
  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    maxHeight: Math.round(Math.max(0, maxHeight)),
    placement: "above",
  };
}

/**
 * True when a panel box sits fully inside the viewport (with optional margin).
 * @param {SelectorPanelBox} box
 * @param {{ width: number, height: number }} viewport
 * @param {number} [margin]
 */
export function selectorPanelFitsViewport(box, viewport, margin = 0) {
  if (!box) return false;
  const right = box.left + box.width;
  const bottom = box.top + box.maxHeight;
  return (
    box.left >= margin - 0.5 &&
    box.top >= margin - 0.5 &&
    right <= viewport.width - margin + 0.5 &&
    bottom <= viewport.height + 0.5
  );
}
