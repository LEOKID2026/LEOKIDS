/**
 * Global product: locale-aware reward card display (never expose Hebrew DB fields).
 */

import { resolveRewardCardEntry, rewardUiCopyForLocale } from "./reward-pack-copy.js";
import { resolveRewardCardDisplay } from "./reward-card-locale-catalog.js";
import { formatRarityHe, formatCardTypeHe } from "./rewards-ui.js";

/** Hebrew / Aramaic block — used to reject any Hebrew candidate for global display. */
export const HEBREW_RE = /[\u0590-\u05FF]/;

/**
 * Israeli-concept cards kept only as non-display legacy keys (old data / overlays).
 * Never return their catalog titles to global student surfaces.
 */
export const GLOBAL_UNSUPPORTED_REWARD_CARD_KEYS = Object.freeze([
  "achievement_hebrew_star",
  "achievement_moledet_explorer",
]);

const GLOBAL_UNSUPPORTED_REWARD_CARD_KEY_SET = new Set(GLOBAL_UNSUPPORTED_REWARD_CARD_KEYS);

/**
 * @param {string|null|undefined} cardKey
 */
export function isGlobalUnsupportedRewardCardKey(cardKey) {
  return GLOBAL_UNSUPPORTED_REWARD_CARD_KEY_SET.has(String(cardKey || "").trim());
}

/**
 * @param {string} seriesSlug
 * @param {string|null|undefined} contentLocale
 */
function seriesTitleFromSlug(seriesSlug, contentLocale = "en") {
  const key = String(seriesSlug || "").trim();
  if (!key) return "";
  const fromPack = rewardUiCopyForLocale(contentLocale, "series", key, {});
  if (fromPack && fromPack !== key && !isHebrewText(fromPack)) return fromPack;
  return key
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * @param {string|null|undefined} text
 */
export function isHebrewText(text) {
  return HEBREW_RE.test(String(text || ""));
}

/**
 * Pick first non-empty, non-Hebrew candidate; otherwise "".
 * @param {...(string|null|undefined)} candidates
 */
function firstSafeEnglishText(...candidates) {
  for (const c of candidates) {
    const s = String(c || "").trim();
    if (s && !isHebrewText(s)) return s;
  }
  return "";
}

/**
 * @param {{
 *   cardKey?: string|null,
 *   seriesSlug?: string|null,
 *   nameHe?: string|null,
 *   descriptionHe?: string|null,
 *   seriesNameHe?: string|null,
 *   rarity?: string|null,
 *   cardType?: string|null,
 * }} input
 * @param {string} [locale]
 */
export function resolveGlobalRewardCardDisplay(input = {}, locale = "en") {
  const cardKey = String(input.cardKey || "").trim();
  const unsupported = isGlobalUnsupportedRewardCardKey(cardKey);

  // Legacy Israeli keys: never surface catalog/DB titles (Hebrew Star / Homeland Explorer).
  if (unsupported) {
    const safeName = rewardUiCopyForLocale(locale, "fallback", "rewardCard") || "Reward card";
    const name = isHebrewText(safeName) ? "Reward card" : safeName;
    let description =
      rewardUiCopyForLocale(locale, "fallback", "collectName", { name }) || `Collect ${name}!`;
    if (isHebrewText(description)) description = `Collect ${name}!`;
    const seriesSlug = String(input.seriesSlug || "").trim();
    const seriesName = seriesSlug ? seriesTitleFromSlug(seriesSlug, locale) : "";
    return {
      name,
      description,
      seriesName,
      rarityLabel: formatRarityHe(input.rarity, locale),
      cardTypeLabel: formatCardTypeHe(input.cardType, locale),
    };
  }

  // Never prefer Hebrew DB fields. Catalog English first; Hebrew candidates are rejected.
  const catalogEntry = cardKey
    ? resolveRewardCardDisplay(locale, cardKey) || resolveRewardCardEntry(cardKey, locale)
    : null;

  let name = firstSafeEnglishText(catalogEntry?.title, catalogEntry?.name);
  // Intentionally never use input.nameHe / descriptionHe when they contain Hebrew.
  // Non-Hebrew values in those fields are only accepted as last-resort non-catalog text
  // (e.g. already-remapped English from an API layer).
  if (!name) {
    name = firstSafeEnglishText(input.nameHe);
  }
  if (!name) {
    name = rewardUiCopyForLocale(locale, "fallback", "rewardCard") || "Reward card";
    if (isHebrewText(name)) name = "Reward card";
  }

  let description = firstSafeEnglishText(catalogEntry?.description);
  if (!description) {
    description = firstSafeEnglishText(input.descriptionHe);
  }
  if (!description) {
    description =
      rewardUiCopyForLocale(locale, "fallback", "collectName", { name }) || `Collect ${name}!`;
    if (isHebrewText(description)) description = `Collect ${name}!`;
  }

  const seriesSlug = String(input.seriesSlug || "").trim();
  let seriesName = seriesSlug ? seriesTitleFromSlug(seriesSlug, locale) : "";
  if (!seriesName) {
    seriesName = firstSafeEnglishText(input.seriesNameHe);
  }

  return {
    name,
    description,
    seriesName,
    rarityLabel: formatRarityHe(input.rarity, locale),
    cardTypeLabel: formatCardTypeHe(input.cardType, locale),
  };
}

/**
 * @param {object} card row from reward_cards (+ optional reward_card_series)
 * @param {{ slug?: string, name_he?: string }|null|undefined} [series]
 * @param {string} [locale]
 */
export function mapGlobalRewardCardForChild(card, series, locale = "en") {
  const seriesObj = series || card?.reward_card_series || null;
  const display = resolveGlobalRewardCardDisplay(
    {
      cardKey: card?.card_key,
      seriesSlug: seriesObj?.slug,
      nameHe: card?.name_he,
      descriptionHe: card?.description_he,
      seriesNameHe: seriesObj?.name_he,
      rarity: card?.rarity,
      cardType: card?.card_type,
    },
    locale);
  return { ...card, ...display, nameHe: display.name, descriptionHe: display.description };
}

/** @deprecated use rewardUiCopyForLocale("series", slug) */
export const REWARD_SERIES_EN_BY_SLUG = {};
