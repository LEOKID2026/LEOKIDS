import { useMemo } from "react";
import { useI18n } from "../i18n/I18nProvider.jsx";
import { createGamePackCopy } from "./game-pack-copy.js";
import {
  loadGameUiPackClient,
  resolveGameDisplayClient,
  resolveGameHelpClient,
  resolveGameUiFieldClient,
} from "./game-ui-copy.client.js";

/** Burn-down runtime copy bound to content locale. */
export function useGamePackCopy() {
  const { contentLocale } = useI18n();
  return useMemo(() => createGamePackCopy(contentLocale), [contentLocale]);
}

/**
 * @param {string} gameKey
 */
export function useGameUiDisplay(gameKey) {
  const { contentLocale } = useI18n();
  return useMemo(
    () => resolveGameDisplayClient(gameKey, contentLocale),
    [gameKey, contentLocale]
  );
}

/**
 * @param {string} gameKey
 */
export function useGameHelpContent(gameKey) {
  const { contentLocale } = useI18n();
  return useMemo(() => resolveGameHelpClient(gameKey, contentLocale), [gameKey, contentLocale]);
}

export { loadGameUiPackClient, resolveGameDisplayClient, resolveGameHelpClient, resolveGameUiFieldClient };
