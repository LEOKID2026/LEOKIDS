/**
 * Shared English display titles for the 7 active arcade board games.
 * Never show a raw gameKey (e.g. "fourline", "snakes-and-ladders") to a child -
 * always resolve through displayArcadeGameTitle() first.
 */

/** @type {Record<string, string>} */
export const ARCADE_GAME_TITLES_EN = {
  fourline: "Four in a Row",
  ludo: "Ludo",
  "snakes-and-ladders": "Snakes and Ladders",
  checkers: "Checkers",
  chess: "Chess",
  dominoes: "Dominoes",
  bingo: "Bingo",
};

/**
 * @param {string} [gameKey]
 * @param {string} [fallback] optional fallback title if gameKey is unmapped
 * @returns {string} English title, or a generic fallback — never the raw gameKey
 */
export function displayArcadeGameTitle(gameKey, fallback = "") {
  const key = String(gameKey || "").trim().toLowerCase();
  return ARCADE_GAME_TITLES_EN[key] || fallback || "Game";
}
