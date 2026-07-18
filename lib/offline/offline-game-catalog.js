import { gamePackCopy } from "../../lib/games/game-pack-copy.js";
import { SOLO_GAME_LIST } from "../solo-games/solo-game-registry.js";
import { EDUCATIONAL_GAME_LIST } from "../educational-games/educational-game-registry.js";

export const OFFLINE_HUB_ROUTE = "/student/offline";

export const OFFLINE_SOLO_HUB_ROUTE = "/student/offline/solo";

export const OFFLINE_EDUCATIONAL_HUB_ROUTE = "/student/offline/educational";

export const SAME_DEVICE_OFFLINE_GAMES = Object.freeze([
  {
    slug: "tic-tac-toe",
    title: gamePackCopy("lib__offline__offline-game-catalog", "tic_tac_toe"),
    emoji: "❌⭕️",
    players: "2 players",
    blurb: gamePackCopy("lib__offline__offline-game-catalog", "boards_from_3_3_to_7_7_with_score_tracking"),
  },
  {
    slug: "rock-paper-scissors",
    title: gamePackCopy("lib__offline__offline-game-catalog", "rock_paper_scissors"),
    titleOneLine: true,
    emoji: "🪨📄✂️",
    players: "2 players or vs robot",
    blurb: gamePackCopy("lib__offline__offline-game-catalog", "quick_rounds_best_of_all"),
  },
  {
    slug: "tap-battle",
    title: gamePackCopy("lib__offline__offline-game-catalog", "tap_battle"),
    emoji: "⚡️",
    players: "2 players",
    blurb: gamePackCopy("lib__offline__offline-game-catalog", "each_side_taps_as_fast_as_they_can_who_wins"),
  },
  {
    slug: "memory-match",
    title: gamePackCopy("lib__offline__offline-game-catalog", "memory_match"),
    emoji: "🧠",
    players: "1–2 players",
    blurb: gamePackCopy("lib__offline__offline-game-catalog", "flip_cards_find_pairs_and_try_to_win"),
  },
]);

/** @param {string} gameKey */
export function offlineSoloRoute(gameKey) {
  return `${OFFLINE_SOLO_HUB_ROUTE}/${gameKey}`;
}

/** @param {string} gameKey */
export function offlineEducationalRoute(gameKey) {
  return `${OFFLINE_EDUCATIONAL_HUB_ROUTE}/${gameKey}`;
}

export const OFFLINE_SOLO_GAMES = SOLO_GAME_LIST.map((game) => ({
  id: game.id,
  titleHe: game.titleHe,
  emoji: game.emoji,
  blurbHe: game.blurbHe,
  route: offlineSoloRoute(game.id),
  hasDifficultyPicker: game.hasDifficultyPicker,
}));

export const OFFLINE_EDUCATIONAL_GAMES = EDUCATIONAL_GAME_LIST.map((game) => ({
  id: game.id,
  titleHe: game.titleHe,
  emoji: game.emoji,
  blurbHe: game.blurbHe,
  route: offlineEducationalRoute(game.id),
  hasDifficultyPicker: game.hasDifficultyPicker,
}));

/** @param {string} gameKey */
export function isValidOfflineSoloGameKey(gameKey) {
  return OFFLINE_SOLO_GAMES.some((g) => g.id === gameKey);
}

/** @param {string} gameKey */
export function isValidOfflineEducationalGameKey(gameKey) {
  return OFFLINE_EDUCATIONAL_GAMES.some((g) => g.id === gameKey);
}
