import uiPackIndex from "../../content-packs/en/games/ui-pack-index.json" with { type: "json" };

/**
 * Static arcade catalog for UI. Database `arcade_games` is authoritative when seeded.
 * Entry costs come from reward_economy_entry_cost_options (Admin/DB).
 */

/**
 * @param {string} gameKey
 */
function arcadeRegistryTitle(gameKey) {
  const pack = uiPackIndex[gameKey];
  return pack?.title && String(pack.title).trim() ? String(pack.title) : gameKey;
}

export const ARCADE_GAME_REGISTRY = [
  {
    gameKey: "fourline",
    title: arcadeRegistryTitle("fourline"),
    foundationOnly: true,
    minPlayers: 2,
    maxPlayers: 2,
  },
  {
    gameKey: "checkers",
    title: arcadeRegistryTitle("checkers"),
    foundationOnly: true,
    minPlayers: 2,
    maxPlayers: 2,
  },
  {
    gameKey: "chess",
    title: arcadeRegistryTitle("chess"),
    foundationOnly: true,
    minPlayers: 2,
    maxPlayers: 2,
  },
  {
    gameKey: "snakes-and-ladders",
    title: arcadeRegistryTitle("snakes-and-ladders"),
    foundationOnly: true,
    minPlayers: 2,
    maxPlayers: 4,
  },
  {
    gameKey: "dominoes",
    title: arcadeRegistryTitle("dominoes"),
    foundationOnly: true,
    minPlayers: 2,
    maxPlayers: 2,
  },
  {
    gameKey: "bingo",
    title: arcadeRegistryTitle("bingo"),
    foundationOnly: true,
    minPlayers: 2,
    maxPlayers: 8,
  },
  {
    gameKey: "ludo",
    title: arcadeRegistryTitle("ludo"),
    foundationOnly: true,
    minPlayers: 2,
    maxPlayers: 4,
  },
];

export function findRegistryGame(gameKey) {
  return ARCADE_GAME_REGISTRY.find((g) => g.gameKey === gameKey) || null;
}
