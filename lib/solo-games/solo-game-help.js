/** @typedef {{ howToPlay: string, scoring: string, rewards: string, tip: string }} SoloGameHelpContent */

export const SOLO_GAME_HELP_FALLBACK = Object.freeze({
  howToPlay: "Follow the instructions on screen and try to reach the goal.",
  scoring: "Good moves earn points. Mistakes or running out of time can end the game.",
  rewards: "Finish a successful game to earn coins and diamonds for Kid's World.",
  tip: "Read the screen before you start — then plan your next move.",
});

/**
 * @param {{ titleHe?: string, help?: Partial<SoloGameHelpContent> } | null | undefined} game
 * @returns {SoloGameHelpContent}
 */
export function resolveSoloGameHelp(game) {
  const help = game?.help || {};
  return {
    howToPlay: help.howToPlay?.trim() || SOLO_GAME_HELP_FALLBACK.howToPlay,
    scoring: help.scoring?.trim() || SOLO_GAME_HELP_FALLBACK.scoring,
    rewards: help.rewards?.trim() || SOLO_GAME_HELP_FALLBACK.rewards,
    tip: help.tip?.trim() || SOLO_GAME_HELP_FALLBACK.tip,
  };
}
