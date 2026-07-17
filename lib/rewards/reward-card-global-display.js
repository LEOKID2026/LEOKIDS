/**
 * Global product: English-only reward card display (never expose Hebrew DB fields).
 */

import { REWARD_CARD_GLOBAL_EN_CATALOG } from "./reward-card-global-en-catalog.js";
import { formatRarityHe, formatCardTypeHe } from "./rewards-ui.js";

/** @type {Record<string, string>} */
export const REWARD_SERIES_EN_BY_SLUG = {
  professions: "Professions",
  "space-tech": "Space & Tech",
  fantasy: "Fantasy",
  "sport-fun": "Sports & Fun",
  style: "Style",
  general: "General achievements",
  math: "Math achievements",
  language: "Language achievements",
  subjects: "Subject achievements",
  events: "Events",
};

const HEBREW_RE = /[\u0590-\u05FF]/;

function titleFromSlug(slug) {
  const key = String(slug || "").trim();
  if (!key) return "";
  if (REWARD_SERIES_EN_BY_SLUG[key]) return REWARD_SERIES_EN_BY_SLUG[key];
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
 */
export function resolveGlobalRewardCardDisplay(input = {}) {
  const cardKey = String(input.cardKey || "").trim();
  const catalogEntry = cardKey ? REWARD_CARD_GLOBAL_EN_CATALOG[cardKey] : null;

  let name = catalogEntry?.name || "";
  if (!name && input.nameHe && !isHebrewText(input.nameHe)) {
    name = String(input.nameHe).trim();
  }
  if (!name) name = cardKey ? cardKey.replace(/_/g, " ") : "Reward card";

  let description = catalogEntry?.description || "";
  if (!description && input.descriptionHe && !isHebrewText(input.descriptionHe)) {
    description = String(input.descriptionHe).trim();
  }
  if (!description) description = `Collect ${name}!`;

  const seriesSlug = String(input.seriesSlug || "").trim();
  let seriesName = seriesSlug ? titleFromSlug(seriesSlug) : "";
  if (!seriesName && input.seriesNameHe && !isHebrewText(input.seriesNameHe)) {
    seriesName = String(input.seriesNameHe).trim();
  }

  return {
    name,
    description,
    seriesName,
    rarityLabel: formatRarityHe(input.rarity),
    cardTypeLabel: formatCardTypeHe(input.cardType),
  };
}

/**
 * @param {object} card row from reward_cards (+ optional reward_card_series)
 * @param {{ slug?: string, name_he?: string }|null|undefined} [series]
 */
export function mapGlobalRewardCardForChild(card, series) {
  const seriesObj = series || card?.reward_card_series || null;
  const display = resolveGlobalRewardCardDisplay({
    cardKey: card?.card_key,
    seriesSlug: seriesObj?.slug,
    nameHe: card?.name_he,
    descriptionHe: card?.description_he,
    seriesNameHe: seriesObj?.name_he,
    rarity: card?.rarity,
    cardType: card?.card_type,
  });
  return display;
}
