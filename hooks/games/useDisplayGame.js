import { useMemo } from "react";
import { useGameUiDisplay } from "../../lib/games/game-locale-context.jsx";

/**
 * Merge registry metadata with locale-aware UI pack title/blurb for shells and help.
 * @param {string} gameKey
 * @param {Record<string, unknown>|null|undefined} registryGame
 */
export function useDisplayGame(gameKey, registryGame) {
  const ui = useGameUiDisplay(gameKey);
  return useMemo(() => {
    if (!registryGame) return null;
    const key = String(gameKey || registryGame.gameKey || registryGame.id || "").trim();
    return {
      ...registryGame,
      gameKey: key,
      titleHe: ui.title,
      blurbHe: ui.blurb,
    };
  }, [registryGame, ui.title, ui.blurb, gameKey]);
}
