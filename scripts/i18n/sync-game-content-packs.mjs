/**
 * Sync content-packs/en/games/*.json from existing registries (English source).
 * Run: node scripts/i18n/sync-game-content-packs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EDUCATIONAL_GAME_REGISTRY } from "../../lib/educational-games/educational-game-registry.js";
import { SOLO_GAME_REGISTRY } from "../../lib/solo-games/solo-game-registry.js";
import { ARCADE_GAME_REGISTRY } from "../../lib/arcade/game-registry.js";
import { SAME_DEVICE_OFFLINE_GAMES } from "../../lib/offline/offline-game-catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const outDir = path.join(root, "content-packs", "en", "games");

const REQUIRED_KEYS = ["title", "blurb", "help"];

/** @param {Record<string, unknown>} meta */
function packFromEducational(meta) {
  return {
    gameId: meta.gameKey || meta.id,
    title: meta.titleHe || "",
    blurb: meta.blurbHe || "",
    help: meta.help || {},
    accessibility: {
      title: meta.titleHe || "",
    },
  };
}

/** @param {Record<string, unknown>} meta */
function packFromSolo(meta) {
  return {
    gameId: meta.id || meta.gameKey,
    title: meta.titleHe || "",
    blurb: meta.blurbHe || "",
    help: meta.help || {},
  };
}

/** @param {{ gameKey: string, title: string }} meta */
function packFromArcade(meta) {
  return {
    gameId: meta.gameKey,
    title: meta.title || "",
    blurb: "Play with friends in the arcade",
    help: {
      howToPlay: "Follow the on-screen instructions for this game.",
      tip: "Take turns and have fun.",
    },
  };
}

/** @param {{ slug: string, title: string, blurb: string, players?: string }} meta */
function packFromOffline(meta) {
  return {
    gameId: meta.slug,
    title: meta.title || "",
    blurb: meta.blurb || "",
    players: meta.players || "",
    help: {
      howToPlay: "Play together on the same device.",
    },
  };
}

function writePack(gameId, pack) {
  const filePath = path.join(outDir, `${gameId}.json`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
}

let count = 0;
for (const [key, meta] of Object.entries(EDUCATIONAL_GAME_REGISTRY)) {
  writePack(key, packFromEducational(meta));
  count += 1;
}
for (const [key, meta] of Object.entries(SOLO_GAME_REGISTRY)) {
  writePack(key, packFromSolo(meta));
  count += 1;
}
for (const meta of ARCADE_GAME_REGISTRY) {
  writePack(meta.gameKey, packFromArcade(meta));
  count += 1;
}
for (const meta of SAME_DEVICE_OFFLINE_GAMES) {
  writePack(meta.slug, packFromOffline(meta));
  count += 1;
}

console.log(`Wrote ${count} game content packs to ${path.relative(root, outDir)}`);

for (const file of fs.readdirSync(outDir)) {
  if (!file.endsWith(".json")) continue;
  if (file === "burn-down-index.json" || file === "ui-pack-index.json") continue;
  const abs = path.join(outDir, file);
  if (!fs.statSync(abs).isFile()) continue;
  const pack = JSON.parse(fs.readFileSync(abs, "utf8"));
  for (const key of REQUIRED_KEYS) {
    if (pack[key] == null) {
      throw new Error(`${file} missing required key: ${key}`);
    }
  }
}

console.log("Required keys validated.");
