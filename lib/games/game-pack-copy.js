import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

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
 * @param {string|null|undefined} gameLocale
 * @param {string} slug
 * @param {string} key
 */
function lookupPackString(gameLocale, slug, key) {
  const index = resolveRegisteredContentPack(gameLocale, "games", "burn-down-index.json") || {};
  const pack = index[slug];
  const val = pack?.[key];
  return typeof val === "string" ? val : String(key || "");
}

/**
 * Resolve game copy via locale pack catalog (fallback to en inside resolver).
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function gamePackCopy(slug, key, vars) {
  const raw = lookupPackString("en", slug, key);
  return formatMessage(raw, vars, "en");
}

/**
 * Locale-aware game pack copy — pack resolution + ICU vars + pseudo transforms.
 * @param {string|null|undefined} gameLocale
 * @param {string} slug
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function gamePackCopyForLocale(gameLocale, slug, key, vars) {
  const localeId = resolveLocaleDefinition(gameLocale || "en").id;
  const raw = lookupPackString(localeId, slug, key);
  const formatted = formatMessage(raw, vars, localeId);
  return applyGameLocaleTransform(formatted, localeId);
}

/**
 * @param {string|null|undefined} gameLocale
 */
export function createGamePackCopy(gameLocale) {
  return (slug, key, vars) => gamePackCopyForLocale(gameLocale, slug, key, vars);
}
