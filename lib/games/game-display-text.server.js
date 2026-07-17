/**
 * Resolve English display title/blurb for Global runtime from local registries.
 * Never fall back to DB title_he / blurb_he for user-facing copy.
 */
import { EDUCATIONAL_GAME_REGISTRY } from "../educational-games/educational-game-registry.js";
import { SOLO_GAME_REGISTRY } from "../solo-games/solo-game-registry.js";
import { displayArcadeGameTitle } from "../../components/arcade/club/arcadeGameTitles.js";

/** @type {Record<string, { title: string, blurb: string }>} */
const OFFLINE_SAME_DEVICE = Object.freeze({
  "tic-tac-toe": {
    title: "Tic-Tac-Toe",
    blurb: "Play on the same device with a friend",
  },
  "rock-paper-scissors": {
    title: "Rock, Paper, Scissors",
    blurb: "Quick rounds on one screen",
  },
  "tap-battle": {
    title: "Tap Battle",
    blurb: "Tap faster than your opponent",
  },
  "memory-match": {
    title: "Memory Match",
    blurb: "Find matching pairs offline",
  },
});

/**
 * @param {string} gameKey
 * @param {string} [category]
 * @returns {{ title: string, blurb: string }}
 */
export function resolveGlobalGameDisplayText(gameKey, category = "") {
  const key = String(gameKey || "").trim().toLowerCase();
  const cat = String(category || "").trim().toLowerCase();

  const edu = EDUCATIONAL_GAME_REGISTRY[key];
  if (edu) {
    return {
      title: edu.titleHe || "Educational Game",
      blurb: edu.blurbHe || "Learn while you play",
    };
  }

  const solo = SOLO_GAME_REGISTRY[key];
  if (solo) {
    return {
      title: solo.titleHe || "Solo Game",
      blurb: solo.blurbHe || "Play on your own",
    };
  }

  const offline = OFFLINE_SAME_DEVICE[key];
  if (offline) {
    return offline;
  }

  if (cat === "online" || key) {
    const arcadeTitle = displayArcadeGameTitle(key, "");
    if (arcadeTitle && arcadeTitle !== "Game") {
      return { title: arcadeTitle, blurb: "Play with friends in the arcade" };
    }
  }

  return {
    title: "Game",
    blurb: "Have fun and keep learning",
  };
}
