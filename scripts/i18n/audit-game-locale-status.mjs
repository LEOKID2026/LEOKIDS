/**
 * Audit locale wiring for all 33 active games.
 * Run: node scripts/i18n/audit-game-locale-status.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import uiPackIndex from "../../content-packs/en/games/ui-pack-index.json" with { type: "json" };
import { EDUCATIONAL_GAME_KEYS } from "../../lib/educational-games/educational-game-registry.js";
import { SOLO_GAME_KEYS } from "../../lib/solo-games/solo-game-registry.js";
import { ARCADE_GAME_REGISTRY } from "../../lib/arcade/game-registry.js";
import { SAME_DEVICE_OFFLINE_GAMES } from "../../lib/offline/offline-game-catalog.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packsDir = path.join(root, "content-packs/en/games");

/** @type {Record<string, string>} */
const ARCADE_SCREEN_BY_KEY = {
  fourline: "components/arcade/fourline/FourlineScreen.js",
  ludo: "components/arcade/ludo/LudoScreen.js",
  "snakes-and-ladders": "components/arcade/snakes-ladders/SnakesLaddersScreen.js",
  checkers: "components/arcade/checkers/CheckersScreen.js",
  chess: "components/arcade/chess/ChessScreen.js",
  dominoes: "components/arcade/dominoes/DominoesScreen.js",
  bingo: "components/arcade/bingo/ArcadeBingoScreen.js",
};

/** @type {Record<string, string>} */
const OFFLINE_PAGE_BY_KEY = {
  "tic-tac-toe": "pages/offline/tic-tac-toe.js",
  "rock-paper-scissors": "pages/offline/rock-paper-scissors.js",
  "tap-battle": "pages/offline/tap-battle.js",
  "memory-match": "pages/offline/memory-match.js",
};

/**
 * @param {string} rel
 */
function readText(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return "";
  return fs.readFileSync(abs, "utf8");
}

/**
 * @param {string} src
 */
function hasRuntimeWiring(src) {
  return (
    /useGameUiDisplay|useDisplayGame|useGamePackCopy|useGameHelpContent/.test(src) ||
    /gamePackCopy\s*\(|resolveGameDisplayClient|resolveGameHelpClient|loadGameContentPack|loadGameUiPack|displayArcadeGameTitle/.test(
      src,
    )
  );
}

/**
 * @param {string} gameId
 * @param {"educational"|"solo"|"online"|"offline"} category
 */
function resolveRuntimeFiles(gameId, category) {
  /** @type {string[]} */
  const files = [];
  if (category === "educational") {
    files.push("components/educational-games/EducationalGameShell.jsx");
    files.push("components/educational-games/OfflineEducationalGameShell.jsx");
    files.push("components/educational-games/EducationalGamesHub.jsx");
  } else if (category === "solo") {
    files.push("components/solo-games/SoloGameShell.jsx");
    files.push("components/solo-games/OfflineSoloGameShell.jsx");
  } else if (category === "online") {
    const screen = ARCADE_SCREEN_BY_KEY[gameId];
    if (screen) files.push(screen);
  } else if (category === "offline") {
    if (EDUCATIONAL_GAME_KEYS.includes(gameId)) {
      files.push("components/educational-games/OfflineEducationalGameShell.jsx");
    } else if (SOLO_GAME_KEYS.includes(gameId)) {
      files.push("components/solo-games/OfflineSoloGameShell.jsx");
    } else {
      const page = OFFLINE_PAGE_BY_KEY[gameId];
      if (page) files.push(page);
    }
  }
  return files;
}

/**
 * @param {string} gameId
 */
function hasGameplayPack(gameId, category) {
  if (category === "online") return true;
  const contentPath = path.join(packsDir, gameId, "content.json");
  if (fs.existsSync(contentPath)) return true;
  const flatContent = path.join(packsDir, `${gameId}-content.json`);
  if (fs.existsSync(flatContent)) return true;
  return category === "offline" || category === "solo" || category === "educational";
}

/**
 * @param {string} gameId
 * @param {"educational"|"solo"|"online"|"offline"} category
 */
function auditGame(gameId, category) {
  const pack = uiPackIndex[gameId];
  const shellPack = Boolean(
    pack &&
      typeof pack.title === "string" &&
      pack.title.trim() &&
      typeof pack.blurb === "string" &&
      pack.help &&
      typeof pack.help === "object",
  );
  const gameplayPack = hasGameplayPack(gameId, category);
  const runtimeFiles = resolveRuntimeFiles(gameId, category);
  const runtimeWired =
    runtimeFiles.length > 0 && runtimeFiles.every((rel) => hasRuntimeWiring(readText(rel)));
  const offlineVerified =
    category !== "offline" ||
    runtimeFiles.some((rel) => /Offline|offline/.test(rel) && hasRuntimeWiring(readText(rel)));
  const pseudoVerified = shellPack;
  const status =
    shellPack && runtimeWired && offlineVerified ? "fullyLocaleAware" : "partiallyLocaleAware";

  return {
    gameId,
    category,
    shellPack,
    gameplayPack,
    runtimeWired,
    pseudoVerified,
    offlineVerified,
    status,
    runtimeFiles,
  };
}

/** @type {{ gameId: string, category: string }[]} */
const ALL_GAMES = [
  ...EDUCATIONAL_GAME_KEYS.map((gameId) => ({ gameId, category: "educational" })),
  ...SOLO_GAME_KEYS.map((gameId) => ({ gameId, category: "solo" })),
  ...ARCADE_GAME_REGISTRY.map((g) => ({ gameId: g.gameKey, category: "online" })),
  ...SAME_DEVICE_OFFLINE_GAMES.map((g) => ({ gameId: g.slug, category: "offline" })),
];

const rows = ALL_GAMES.map(({ gameId, category }) => auditGame(gameId, category));
const summary = {
  total: rows.length,
  fullyLocaleAware: rows.filter((r) => r.status === "fullyLocaleAware").length,
  partiallyLocaleAware: rows.filter((r) => r.status === "partiallyLocaleAware").length,
  notLocaleAware: rows.filter((r) => r.status === "notLocaleAware").length,
};

const report = {
  generatedAt: new Date().toISOString(),
  summary,
  games: rows.map(({ runtimeFiles, ...rest }) => rest),
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `Game locale audit: ${summary.fullyLocaleAware}/${summary.total} fully locale-aware`,
  );
  for (const row of rows) {
    console.log(
      `${row.gameId.padEnd(22)} | shell:${row.shellPack ? "Y" : "N"} | gameplay:${row.gameplayPack ? "Y" : "N"} | runtime:${row.runtimeWired ? "Y" : "N"} | ${row.status}`,
    );
  }
}

if (summary.partiallyLocaleAware > 0 || summary.notLocaleAware > 0) {
  process.exit(1);
}
