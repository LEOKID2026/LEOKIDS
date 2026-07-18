import { createGamePackCopy } from "../games/game-pack-copy.js";
import { resolveGameHelpClient } from "../games/game-ui-copy.client.js";

/** @typedef {{ howToPlay: string, scoring: string, rewards: string, tip: string }} SoloGameHelpContent */

/**
 * @param {string|null|undefined} contentLocale
 */
function fallbackHelp(contentLocale) {
  const copy = createGamePackCopy(contentLocale);
  return {
    howToPlay: copy("lib__solo-games__solo-game-help", "follow_the_instructions_on_screen_and_try_to_reach_the_goal"),
    scoring: copy("lib__solo-games__solo-game-help", "good_moves_earn_points_mistakes_or_running_out_of_time_can_end_the_game"),
    rewards: copy("lib__solo-games__solo-game-help", "finish_a_successful_game_to_earn_coins_and_diamonds_for_kid_s_world"),
    tip: copy("lib__solo-games__solo-game-help", "read_the_screen_before_you_start_then_plan_your_next_move"),
  };
}

/**
 * @param {string} gameKey
 * @param {string|null|undefined} [contentLocale]
 * @returns {SoloGameHelpContent}
 */
export function resolveSoloGameHelp(gameKey, contentLocale = "en") {
  const packHelp = resolveGameHelpClient(gameKey, contentLocale);
  const fb = fallbackHelp(contentLocale);
  return {
    howToPlay: String(packHelp.howToPlay || "").trim() || fb.howToPlay,
    scoring: String(packHelp.scoring || "").trim() || fb.scoring,
    rewards: String(packHelp.rewards || "").trim() || fb.rewards,
    tip: String(packHelp.tip || "").trim() || fb.tip,
  };
}
