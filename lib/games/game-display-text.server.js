/**
 * Resolve English display title/blurb for Global runtime from content packs.
 */
import { loadGameUiPack, resolveGameContentField } from "./game-locale-contract.js";
import { applyGameLocaleTransform } from "./game-pack-copy.js";
import { resolveContentLocale } from "../i18n/locale-resolution.js";
import { displayArcadeGameTitle } from "../../components/arcade/club/arcadeGameTitles.js";

/**
 * @param {string} gameKey
 * @param {string} [category]
 * @param {string} [contentLocale]
 * @returns {{ title: string, blurb: string }}
 */
export function resolveGlobalGameDisplayText(gameKey, category = "", contentLocale = "en") {
  const key = String(gameKey || "").trim().toLowerCase();
  const cat = String(category || "").trim().toLowerCase();
  const locale = resolveContentLocale({ contentLocale });

  const pack = loadGameUiPack(key, locale);
  if (pack?.title) {
    return {
      title: resolveGameContentField({
        gameKey: key,
        field: "title",
        contentLocale: locale,
        fallback: pack.title,
      }),
      blurb: resolveGameContentField({
        gameKey: key,
        field: "blurb",
        contentLocale: locale,
        fallback: pack.blurb || "",
      }),
    };
  }

  if (cat === "online" || key) {
    const arcadeTitle = displayArcadeGameTitle(key, "", locale);
    if (arcadeTitle && arcadeTitle !== applyGameLocaleTransform("Game", locale)) {
      return {
        title: arcadeTitle,
        blurb: applyGameLocaleTransform("Play with friends in the arcade", locale),
      };
    }
  }

  return {
    title: applyGameLocaleTransform("Game", locale),
    blurb: applyGameLocaleTransform("Have fun and keep learning", locale),
  };
}
