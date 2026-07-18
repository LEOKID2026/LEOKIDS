/**
 * Validate active game content packs under content-packs/en/games/.
 * Run: node scripts/i18n/validate-game-content-packs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EDUCATIONAL_GAME_KEYS } from "../../lib/educational-games/educational-game-registry.js";
import { SOLO_GAME_KEYS } from "../../lib/solo-games/solo-game-registry.js";
import { ARCADE_GAME_REGISTRY } from "../../lib/arcade/game-registry.js";
import { SAME_DEVICE_OFFLINE_GAMES } from "../../lib/offline/offline-game-catalog.js";
import { assertGameLocaleContract } from "../../lib/games/game-locale-contract.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const packsDir = path.join(root, "content-packs", "en", "games");

const ACTIVE_GAME_IDS = [
  ...EDUCATIONAL_GAME_KEYS,
  ...SOLO_GAME_KEYS,
  ...ARCADE_GAME_REGISTRY.map((g) => g.gameKey),
  ...SAME_DEVICE_OFFLINE_GAMES.map((g) => g.slug),
];

const REQUIRED_KEYS = ["title", "blurb", "help"];
const errors = [];

/**
 * @param {string} gameId
 */
function readUiPack(gameId) {
  const dirUi = path.join(packsDir, gameId, "ui.json");
  const flat = path.join(packsDir, `${gameId}.json`);
  if (fs.existsSync(dirUi)) {
    return JSON.parse(fs.readFileSync(dirUi, "utf8"));
  }
  if (fs.existsSync(flat)) {
    return JSON.parse(fs.readFileSync(flat, "utf8"));
  }
  return null;
}

for (const gameId of ACTIVE_GAME_IDS) {
  const contract = assertGameLocaleContract(gameId);
  if (!contract.hasEnPack) {
    errors.push(`missing pack: ${gameId}`);
    continue;
  }
  const pack = readUiPack(gameId);
  if (!pack) {
    errors.push(`missing ui pack file: ${gameId}`);
    continue;
  }
  if (String(pack.gameId || gameId) !== gameId) {
    errors.push(`${gameId}: gameId mismatch (${pack.gameId})`);
  }
  for (const key of REQUIRED_KEYS) {
    if (pack[key] == null) errors.push(`${gameId}: missing ${key}`);
  }
}

if (errors.length) {
  console.error("Game content pack validation failed:\n" + errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${ACTIVE_GAME_IDS.length} active game content packs.`);
