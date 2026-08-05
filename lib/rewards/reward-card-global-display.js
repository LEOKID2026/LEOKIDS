/**
 * Global product: locale-aware reward card display (never expose Hebrew DB fields).
 */

import { resolveRewardCardEntry, rewardUiCopyForLocale } from "./reward-pack-copy.js";
import { resolveRewardCardDisplay } from "./reward-card-locale-catalog.js";
import { formatRarityLabel, formatCardTypeLabel } from "./rewards-ui.js";
import {
  GLOBAL_ISRAEL_ONLY_REWARD_CARD_KEYS,
  isIsraelOnlyRewardCardKey,
} from "./global-card-scope.js";

/** Hebrew block — validator / rejector for accidental Hebrew candidates. */
export const HEBREW_RE = /[\u0590-\u05FF]/;

/** @deprecated use GLOBAL_ISRAEL_ONLY_REWARD_CARD_KEYS */
export const GLOBAL_UNSUPPORTED_REWARD_CARD_KEYS = GLOBAL_ISRAEL_ONLY_REWARD_CARD_KEYS;

/**
 * @param {string|null|undefined} cardKey
 */
export function isGlobalUnsupportedRewardCardKey(cardKey) {
  return isIsraelOnlyRewardCardKey(cardKey);
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
function firstSafeText(...candidates) {
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
 *   name?: string|null,
 *   description?: string|null,
 *   seriesName?: string|null,
 *   rarity?: string|null,
 *   cardType?: string|null,
 * }} input
 * @param {string} [locale]
 */
export function resolveGlobalRewardCardDisplay(input = {}, locale = "en") {
  const cardKey = String(input.cardKey || "").trim();
  const unsupported = isGlobalUnsupportedRewardCardKey(cardKey);

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
      rarityLabel: formatRarityLabel(input.rarity, locale),
      cardTypeLabel: formatCardTypeLabel(input.cardType, locale),
    };
  }

  const catalogEntry = cardKey
    ? resolveRewardCardDisplay(locale, cardKey) || resolveRewardCardEntry(cardKey, locale)
    : null;

  let name = firstSafeText(catalogEntry?.title, catalogEntry?.name, input.name);
  if (!name) {
    name = rewardUiCopyForLocale(locale, "fallback", "rewardCard") || "Reward card";
    if (isHebrewText(name)) name = "Reward card";
  }

  let description = firstSafeText(catalogEntry?.description, input.description);
  if (!description) {
    description =
      rewardUiCopyForLocale(locale, "fallback", "collectName", { name }) || `Collect ${name}!`;
    if (isHebrewText(description)) description = `Collect ${name}!`;
  }

  const seriesSlug = String(input.seriesSlug || "").trim();
  let seriesName = seriesSlug ? seriesTitleFromSlug(seriesSlug, locale) : "";
  if (!seriesName) {
    seriesName = firstSafeText(input.seriesName);
  }

  return {
    name,
    description,
    seriesName,
    rarityLabel: formatRarityLabel(input.rarity, locale),
    cardTypeLabel: formatCardTypeLabel(input.cardType, locale),
  };
}

/**
 * @param {object} card row from reward_cards (+ optional reward_card_series)
 * @param {{ slug?: string }|null|undefined} [series]
 * @param {string} [locale]
 */
export function mapGlobalRewardCardForChild(card, series, locale = "en") {
  const seriesObj = series || card?.reward_card_series || null;
  const display = resolveGlobalRewardCardDisplay(
    {
      cardKey: card?.card_key,
      seriesSlug: seriesObj?.slug,
      rarity: card?.rarity,
      cardType: card?.card_type,
    },
    locale
  );
  return { ...card, ...display };
}

/** @deprecated use rewardUiCopyForLocale("series", slug) */
export const REWARD_SERIES_EN_BY_SLUG = {};
