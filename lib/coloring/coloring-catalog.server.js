/**
 * Coloring pages catalog — bundled JSON manifest (works on Vercel serverless).
 */
import catalogDocument from "../../data/coloring/coloring-pages-catalog.json" with { type: "json" };

/** @typedef {import("./coloring-worksheet-types.js").ColoringCatalogEntry} ColoringCatalogEntry */

let cached = /** @type {ColoringCatalogEntry[] | null} */ (null);

function loadCatalogFile() {
  return {
    cards: Array.isArray(catalogDocument.cards) ? catalogDocument.cards : [],
  };
}

export function getColoringCatalogEntries() {
  if (!cached) cached = loadCatalogFile().cards;
  return cached.slice();
}

export function getColoringCatalogEntryByKey(cardKey) {
  const key = String(cardKey || "").trim();
  return getColoringCatalogEntries().find((c) => c.cardKey === key) || null;
}

export function getColoringCatalogForHub() {
  return getColoringCatalogEntries().map((entry) => ({
    cardKey: entry.cardKey,
    displayNameHe: formatColoringCardDisplayName(entry),
    category: entry.category,
    previewPath: entry.previewPath,
    a4Path: entry.a4Path,
  }));
}

/** English display label for global product (legacy field name displayNameHe). */
function formatColoringCardDisplayName(entry) {
  if (entry.displayNameEn && String(entry.displayNameEn).trim()) {
    return String(entry.displayNameEn).trim();
  }
  const key = String(entry.cardKey || "").trim();
  if (!key) return "Coloring page";
  return key
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function invalidateColoringCatalogCache() {
  cached = null;
}
