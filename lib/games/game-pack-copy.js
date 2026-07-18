import gameBurnDownIndex from "../../content-packs/en/games/burn-down-index.json" with { type: "json" };
import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";

/**
 * Apply pseudo-locale transforms for game copy (en-XA / ar-XB).
 * @param {string} text
 * @param {string|null|undefined} gameLocale
 */
export function applyGameLocaleTransform(text, gameLocale) {
  const id = resolveLocaleDefinition(gameLocale || "en").id;
  const s = String(text ?? "");
  if (!s) return s;
  if (id === "en-XA") return applyPseudoLong(s);
  if (id === "ar-XB") return applyPseudoRtl(s);
  return s;
}

/**
 * @param {string} slug
 * @param {string} key
 */
function lookupPackString(slug, key) {
  const pack = gameBurnDownIndex[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * Resolve game copy from content-packs/en/games/burn-down packs (English source).
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function gamePackCopy(slug, key, vars) {
  const raw = lookupPackString(slug, key);
  return formatMessage(raw, vars, "en");
}

/**
 * Locale-aware game pack copy — applies ICU vars then pseudo-locale transforms.
 * @param {string|null|undefined} gameLocale
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function gamePackCopyForLocale(gameLocale, slug, key, vars) {
  const localeId = resolveLocaleDefinition(gameLocale || "en").id;
  const raw = lookupPackString(slug, key);
  const formatted = formatMessage(raw, vars, localeId);
  return applyGameLocaleTransform(formatted, localeId);
}

/**
 * @param {string|null|undefined} gameLocale
 */
export function createGamePackCopy(gameLocale) {
  return (slug, key, vars) => gamePackCopyForLocale(gameLocale, slug, key, vars);
}
