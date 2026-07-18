import uiPackIndex from "../../../content-packs/en/games/ui-pack-index.json" with { type: "json" };
import { applyGameLocaleTransform } from "../../../lib/games/game-pack-copy.js";
import { resolveContentLocale } from "../../../lib/i18n/locale-resolution.js";

/**
 * Shared display titles for the 7 active arcade board games.
 * Never show a raw gameKey (e.g. "fourline", "snakes-and-ladders") to a child —
 * always resolve through displayArcadeGameTitle() first.
 */

/**
 * @param {string} [gameKey]
 * @param {string} [fallback] optional fallback title if gameKey is unmapped
 * @param {string|null} [contentLocale]
 * @returns {string} localized title, or a generic fallback — never the raw gameKey
 */
export function displayArcadeGameTitle(gameKey, fallback = "", contentLocale = "en") {
  const key = String(gameKey || "").trim().toLowerCase();
  const locale = resolveContentLocale({ contentLocale });
  const pack = uiPackIndex[key];
  if (pack?.title && String(pack.title).trim()) {
    return applyGameLocaleTransform(String(pack.title), locale);
  }
  const fb = String(fallback || "").trim();
  if (fb) return fb;
  return applyGameLocaleTransform("Game", locale);
}

/** @deprecated Use displayArcadeGameTitle with content packs. Kept for legacy imports. */
export const ARCADE_GAME_TITLES_EN = Object.freeze({
  fourline: displayArcadeGameTitle("fourline"),
  ludo: displayArcadeGameTitle("ludo"),
  "snakes-and-ladders": displayArcadeGameTitle("snakes-and-ladders"),
  checkers: displayArcadeGameTitle("checkers"),
  chess: displayArcadeGameTitle("chess"),
  dominoes: displayArcadeGameTitle("dominoes"),
  bingo: displayArcadeGameTitle("bingo"),
});
