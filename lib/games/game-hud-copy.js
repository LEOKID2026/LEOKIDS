/**
 * Shared HUD labels for solo / educational game chrome.
 */
import { gamePackCopy } from "./game-pack-copy.js";

const SLUG = "games__shared_runtime_hud";

export function gameHudLabel(key, vars) {
  return gamePackCopy(SLUG, key, vars);
}

export function gameHudScore(score) {
  return gameHudLabel("end_score", { score });
}

export function gameHudScoreColon() {
  return gameHudLabel("score_colon");
}
