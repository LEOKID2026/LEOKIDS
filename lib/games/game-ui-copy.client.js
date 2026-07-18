import uiPackIndex from "../../content-packs/en/games/ui-pack-index.json" with { type: "json" };
import { applyGameLocaleTransform } from "./game-pack-copy.js";
import { resolveContentLocale } from "../i18n/locale-resolution.js";

/**
 * @param {unknown} value
 * @param {string} localeId
 */
function localizeValue(value, localeId) {
  if (typeof value === "string") return applyGameLocaleTransform(value, localeId);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = typeof v === "string" ? applyGameLocaleTransform(v, localeId) : v;
    }
    return out;
  }
  return value;
}

/**
 * Client-safe game UI pack (title, blurb, help) with pseudo-locale transforms.
 * @param {string} gameKey
 * @param {string|null|undefined} contentLocale
 */
export function loadGameUiPackClient(gameKey, contentLocale) {
  const localeId = resolveContentLocale({ contentLocale });
  const pack = uiPackIndex[String(gameKey || "").trim().toLowerCase()];
  if (!pack || typeof pack !== "object") return null;
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(pack)) {
    out[k] = localizeValue(v, localeId);
  }
  return out;
}

/**
 * @param {{
 *   gameKey: string,
 *   field: string,
 *   contentLocale?: string|null,
 *   fallback?: string,
 * }} opts
 */
export function resolveGameUiFieldClient(opts) {
  const pack = loadGameUiPackClient(opts.gameKey, opts.contentLocale);
  const val = pack?.[opts.field];
  if (typeof val === "string" && val.trim()) return val;
  return opts.fallback || "";
}

/**
 * @param {string} gameKey
 * @param {string|null|undefined} contentLocale
 */
export function resolveGameHelpClient(gameKey, contentLocale) {
  const pack = loadGameUiPackClient(gameKey, contentLocale);
  const help = pack?.help;
  return help && typeof help === "object" && !Array.isArray(help) ? help : {};
}

/**
 * @param {string} gameKey
 * @param {string|null|undefined} contentLocale
 */
export function resolveGameDisplayClient(gameKey, contentLocale) {
  const pack = loadGameUiPackClient(gameKey, contentLocale);
  if (!pack) {
    return { title: "Game", blurb: "", help: {} };
  }
  return {
    title: typeof pack.title === "string" ? pack.title : "Game",
    blurb: typeof pack.blurb === "string" ? pack.blurb : "",
    help: resolveGameHelpClient(gameKey, contentLocale),
  };
}
