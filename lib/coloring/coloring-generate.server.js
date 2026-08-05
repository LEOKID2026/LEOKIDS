/**
 * Coloring worksheet generation — single card A4 page.
 */
import { getColoringCatalogEntryByKey, getColoringCatalogForHub } from "./coloring-catalog.server.js";

/**
 * @param {Record<string, unknown>} input
 */
export function generateColoringWorksheet(input) {
  const cardKey = String(input?.cardKey || input?.slug || "").trim();
  if (!cardKey) {
    return { ok: false, status: 400, code: "missing_card_key", message: "" };
  }

  const entry = getColoringCatalogEntryByKey(cardKey);
  if (!entry) {
    return { ok: false, status: 404, code: "unknown_coloring_card", message: "" };
  }

  const worksheetPayload = {
    payloadKind: "coloring_worksheet",
    worksheetType: "coloring",
    cardKey: entry.cardKey,
    displayName: entry.displayName,
    title: entry.displayName,
    previewUrl: entry.previewPath,
    a4Url: entry.a4Path,
    savedAt: Date.now(),
  };

  return {
    ok: true,
    worksheetPayload,
    generation: {
      worksheetType: "coloring",
      cardKey: entry.cardKey,
    },
  };
}

/**
 * @param {import("./coloring-worksheet-types.js").ColoringWorksheetPayload} payload
 */
export function publicColoringPayload(payload) {
  return {
    payloadKind: payload.payloadKind,
    worksheetType: payload.worksheetType,
    cardKey: payload.cardKey,
    displayName: payload.displayName,
    title: payload.title,
    previewUrl: payload.previewUrl,
    a4Url: payload.a4Url,
    savedAt: payload.savedAt,
  };
}

export function listColoringCatalogPublic() {
  return getColoringCatalogForHub();
}
