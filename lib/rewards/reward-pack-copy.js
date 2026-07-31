import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveContentLocale } from "../i18n/locale-resolution.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

/**
 * @param {string|null|undefined} contentLocale
 */
function cardCatalogSource(contentLocale) {
  return resolveRegisteredContentPack(contentLocale, "rewards", "card-catalog.json") || { cards: {} };
}

/**
 * @param {string|null|undefined} contentLocale
 */
function rewardUiSource(contentLocale) {
  return resolveRegisteredContentPack(contentLocale, "rewards", "ui.json") || {};
}

/** Default English catalog snapshot for validators / legacy exports */
export const REWARD_CARD_CATALOG_EN = cardCatalogSource("en");

/**
 * @param {string} text
 * @param {string|null|undefined} contentLocale
 */
export function applyRewardLocaleTransform(text, contentLocale) {
  const id = resolveLocaleDefinition(contentLocale || "en").id;
  const s = String(text ?? "");
  if (!s) return s;
  if (id === "en-XA") return applyPseudoLong(s);
  if (id === "ar-XB") return applyPseudoRtl(s);
  return s;
}

/**
 * @param {unknown} node
 * @param {string[]} path
 */
function getNested(node, path) {
  let cur = node;
  for (const seg of path) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[seg];
  }
  return cur;
}

/**
 * @param {string|null|undefined} contentLocale
 * @param {string} group e.g. "rarity", "shop", "requirements"
 * @param {string} key
 */
function lookupUiString(contentLocale, group, key) {
  const groupNode = rewardUiSource(contentLocale)[group];
  if (!groupNode || typeof groupNode !== "object") return String(key || "");
  if (String(key).includes(".")) {
    const nested = getNested(groupNode, String(key).split("."));
    if (typeof nested === "string") return nested;
    return String(key || "");
  }
  if (typeof groupNode[key] === "string") {
    return groupNode[key];
  }
  return String(key || "");
}

/**
 * English UI copy via locale pack catalog.
 * @param {string} group
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function rewardUiCopy(group, key, vars) {
  const raw = lookupUiString("en", group, key);
  return formatMessage(raw, vars, "en");
}

/**
 * Locale-aware reward UI copy.
 * @param {string|null|undefined} contentLocale
 * @param {string} group
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function rewardUiCopyForLocale(contentLocale, group, key, vars) {
  const localeId = resolveLocaleDefinition(contentLocale || "en").id;
  const raw = lookupUiString(localeId, group, key);
  const formatted = formatMessage(raw, vars, localeId);
  return applyRewardLocaleTransform(formatted, localeId);
}

/**
 * @param {string|null|undefined} contentLocale
 */
export function createRewardUiCopy(contentLocale) {
  return (group, key, vars) => rewardUiCopyForLocale(contentLocale, group, key, vars);
}

/**
 * @param {string|null|undefined} contentLocale
 */
export function loadRewardCardCatalog(contentLocale) {
  const localeId = resolveContentLocale({ contentLocale });
  const source = cardCatalogSource(localeId);
  /** @type {Record<string, object>} */
  const out = {};
  for (const [cardKey, entry] of Object.entries(source.cards || {})) {
    out[cardKey] = {
      ...entry,
      title: applyRewardLocaleTransform(String(entry.title || ""), localeId),
      description: applyRewardLocaleTransform(String(entry.description || ""), localeId),
      accessibility: {
        title: applyRewardLocaleTransform(String(entry.accessibility?.title || entry.title || ""), localeId),
        description: applyRewardLocaleTransform(
          String(entry.accessibility?.description || entry.description || ""),
          localeId,
        ),
      },
    };
  }
  return out;
}

/**
 * @param {string} cardKey
 * @param {string|null|undefined} [contentLocale]
 */
export function resolveRewardCardEntry(cardKey, contentLocale) {
  const key = String(cardKey || "").trim();
  if (!key) return null;
  const catalog = loadRewardCardCatalog(contentLocale);
  const entry = catalog[key];
  if (!entry) return null;
  return {
    cardKey: key,
    name: entry.title,
    description: entry.description,
    title: entry.title,
    category: entry.category,
    accessibility: entry.accessibility,
    contentLocale: resolveContentLocale({ contentLocale }),
  };
}

/**
 * @param {string} cardKey
 * @param {string|null|undefined} [contentLocale]
 */
export function assertRewardCardCatalogEntry(cardKey, contentLocale = "en") {
  const entry = resolveRewardCardEntry(cardKey, contentLocale);
  if (!entry?.title || !entry?.description) {
    throw new Error(`missing reward card catalog entry: ${cardKey}`);
  }
  return entry;
}

/**
 * @param {string[]} referenceCardKeys
 */
export function validateRewardCatalogAgainstKeys(referenceCardKeys) {
  const keys = referenceCardKeys.map((k) => String(k).trim()).filter(Boolean);
  const catalogKeys = new Set(Object.keys(REWARD_CARD_CATALOG_EN.cards || {}));
  const missingInCatalog = keys.filter((k) => !catalogKeys.has(k));
  const orphanInCatalog = [...catalogKeys].filter((k) => !keys.includes(k));
  const duplicateIds = keys.filter((k, i) => keys.indexOf(k) !== i);
  return {
    ok:
      missingInCatalog.length === 0 &&
      orphanInCatalog.length === 0 &&
      duplicateIds.length === 0,
    missingInCatalog,
    orphanInCatalog,
    duplicateIds,
    catalogCount: catalogKeys.size,
    referenceCount: keys.length,
  };
}
