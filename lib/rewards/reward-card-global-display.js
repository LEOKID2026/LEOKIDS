/**
 * Global product: locale-aware reward card display (never expose Hebrew DB fields).
 */

import { resolveRewardCardEntry, rewardUiCopyForLocale } from "./reward-pack-copy.js";
import { resolveRewardCardDisplay } from "./reward-card-locale-catalog.js";
import { formatRarityHe, formatCardTypeHe } from "./rewards-ui.js";

const HEBREW_RE = /[\u0590-\u05FF]/;

/**
 * @param {string} seriesSlug
 * @param {string|null|undefined} contentLocale
 */
function seriesTitleFromSlug(seriesSlug, contentLocale = "en") {
  const key = String(seriesSlug || "").trim();
  if (!key) return "";
  const fromPack = rewardUiCopyForLocale(contentLocale, "series", key, {});
  if (fromPack && fromPack !== key) return fromPack;
  return key
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * @param {string|null|undefined} text
 */
function isHebrewText(text) {
  return HEBREW_RE.test(String(text || ""));
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
  const localized = cardKey ? resolveRewardCardDisplay(locale, cardKey) : null;
  const catalogEntry = localized || (cardKey ? resolveRewardCardEntry(cardKey, locale) : null);

  let name = catalogEntry?.title || catalogEntry?.name || "";
  if (!name && input.nameHe && !isHebrewText(input.nameHe)) {
    name = String(input.nameHe).trim();
  }
  if (!name) {
    name = cardKey
      ? rewardUiCopyForLocale(locale, "fallback", "rewardCard")
      : rewardUiCopyForLocale(locale, "fallback", "rewardCard");
  }

  let description = catalogEntry?.description || "";
  if (!description && input.descriptionHe && !isHebrewText(input.descriptionHe)) {
    description = String(input.descriptionHe).trim();
  }
  if (!description) {
    description = rewardUiCopyForLocale(locale, "fallback", "collectName", { name });
  }

  const seriesSlug = String(input.seriesSlug || "").trim();
  let seriesName = seriesSlug ? seriesTitleFromSlug(seriesSlug, locale) : "";
  if (!seriesName && input.seriesNameHe && !isHebrewText(input.seriesNameHe)) {
    seriesName = String(input.seriesNameHe).trim();
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
    locale,
  );
  return { ...card, ...display, nameHe: display.name, descriptionHe: display.description };
}

/** @deprecated use rewardUiCopyForLocale("series", slug) */
export const REWARD_SERIES_EN_BY_SLUG = {};
