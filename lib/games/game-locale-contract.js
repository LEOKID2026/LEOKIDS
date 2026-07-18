/**
 * Game content locale contract — UI via i18n keys, gameplay via content packs.
 */

import { loadContentPack } from "../content/locale.server.js";
import { resolveContentLocale, getLocalizedContent } from "../content/locale.js";
import { resolveSpeechLocale } from "../speech/locale-resolver.js";

/**
 * @param {string} gameKey
 * @param {string|null|undefined} contentLocale
 */
export function loadGameUiPack(gameKey, contentLocale) {
  const locale = resolveContentLocale({ contentLocale });
  return (
    loadContentPack(locale, "games", gameKey, "ui.json") ||
    loadContentPack(locale, "games", `${gameKey}.json`)
  );
}

/**
 * Gameplay content (orders, task banks, feedback arrays).
 * @param {string} gameKey
 * @param {string|null|undefined} contentLocale
 */
export function loadGameContentPack(gameKey, contentLocale) {
  const locale = resolveContentLocale({ contentLocale });
  return loadContentPack(locale, "games", gameKey, "content.json");
}

/**
 * Resolve instructional copy for a game.
 * @param {{
 *   gameKey: string,
 *   field: string,
 *   contentLocale?: string|null,
 *   interfaceLocale?: string|null,
 *   fallback?: string,
 * }} opts
 */
export function resolveGameContentField(opts) {
  const pack = loadGameUiPack(opts.gameKey, opts.contentLocale);
  const val = pack?.[opts.field];
  if (typeof val === "string" && val.trim()) return val;
  return opts.fallback || "";
}

/**
 * @param {{ interfaceLocale?: string|null, contentLocale?: string|null }} [opts]
 */
export function resolveGameSpeechLocale(opts = {}) {
  return resolveSpeechLocale({
    interfaceLocale: opts.interfaceLocale,
    contentLocale: opts.contentLocale,
    kind: "content",
  });
}

/**
 * Validator helper — game must declare content pack path or use i18n keys in shell.
 * @param {string} gameKey
 */
export function assertGameLocaleContract(gameKey) {
  const pack = loadGameUiPack(gameKey, "en");
  return {
    gameKey,
    hasEnPack: Boolean(pack),
    note: pack
      ? "ui content pack present"
      : "requires migration to content-packs/en/games or games.json keys",
  };
}
