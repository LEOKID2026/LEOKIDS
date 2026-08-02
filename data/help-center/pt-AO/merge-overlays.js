/**
 * Apply sparse Help Center overlays onto a base article list (by slug).
 * Copied utility pattern for Angola (pt-AO) sparse Help overlays on pt-PT Help.
 */

/**
 * @typedef {{
 *   title?: string,
 *   summary?: string,
 *   keywords?: string[],
 *   blockPatches?: Array<{
 *     id?: string,
 *     kind?: string,
 *     textIncludes?: string,
 *     altIncludes?: string,
 *     paragraphIncludes?: string,
 *     text?: string,
 *     alt?: string,
 *     caption?: string,
 *     items?: string[],
 *     paragraphs?: string[],
 *   }>,
 * }} HelpArticleOverlay
 */

/**
 * @param {Record<string, unknown>} block
 * @param {NonNullable<HelpArticleOverlay["blockPatches"]>[number]} patch
 */
function blockMatches(block, patch) {
  if (patch.id != null && block.id !== patch.id) return false;
  if (patch.kind != null && block.kind !== patch.kind) return false;
  if (patch.textIncludes != null) {
    const hay = String(block.text || "");
    if (!hay.includes(patch.textIncludes)) return false;
  }
  if (patch.altIncludes != null) {
    const hay = String(block.alt || "");
    if (!hay.includes(patch.altIncludes)) return false;
  }
  if (patch.paragraphIncludes != null) {
    const paras = Array.isArray(block.paragraphs) ? block.paragraphs.join("\n") : "";
    if (!paras.includes(patch.paragraphIncludes)) return false;
  }
  return Boolean(
    patch.id || patch.kind || patch.textIncludes || patch.altIncludes || patch.paragraphIncludes
  );
}

/**
 * @param {Record<string, unknown>} block
 * @param {NonNullable<HelpArticleOverlay["blockPatches"]>[number]} patch
 */
function applyBlockPatch(block, patch) {
  /** @type {Record<string, unknown>} */
  const next = { ...block };
  if (patch.text !== undefined) next.text = patch.text;
  if (patch.alt !== undefined) next.alt = patch.alt;
  if (patch.caption !== undefined) next.caption = patch.caption;
  if (patch.items !== undefined) next.items = patch.items;
  if (patch.paragraphs !== undefined) next.paragraphs = patch.paragraphs;
  return next;
}

/**
 * @param {Record<string, unknown>} article
 * @param {HelpArticleOverlay} overlay
 */
export function applyHelpArticleOverlay(article, overlay) {
  if (!overlay) return article;
  /** @type {Record<string, unknown>} */
  const out = { ...article };
  if (overlay.title !== undefined) out.title = overlay.title;
  if (overlay.summary !== undefined) out.summary = overlay.summary;
  if (overlay.keywords !== undefined) out.keywords = overlay.keywords;
  if (Array.isArray(overlay.blockPatches) && Array.isArray(article.blocks)) {
    out.blocks = article.blocks.map((block) => {
      for (const patch of overlay.blockPatches) {
        if (blockMatches(/** @type {Record<string, unknown>} */ (block), patch)) {
          return applyBlockPatch(/** @type {Record<string, unknown>} */ (block), patch);
        }
      }
      return block;
    });
  }
  return out;
}

/**
 * @param {Array<Record<string, unknown>>} baseArticles
 * @param {Record<string, HelpArticleOverlay>} overlaysBySlug
 */
export function mergeHelpArticlesWithOverlays(baseArticles, overlaysBySlug) {
  return (baseArticles || []).map((article) => {
    const slug = String(article?.slug || "");
    const overlay = overlaysBySlug?.[slug];
    if (!overlay) return article;
    return applyHelpArticleOverlay(article, overlay);
  });
}
