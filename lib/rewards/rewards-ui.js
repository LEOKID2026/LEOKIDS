import { createRewardUiCopy, rewardUiCopy } from "./reward-pack-copy.js";

/**
 * Child-facing reward UI labels — resolved from content-packs/en/rewards/ui.json
 */

/**
 * @param {string|null|undefined} [contentLocale]
 */
function ui(contentLocale) {
  return contentLocale ? createRewardUiCopy(contentLocale) : rewardUiCopy;
}

export function formatRarityHe(rarity, contentLocale) {
  const copy = ui(contentLocale);
  return copy("rarity", rarity) || copy("rarity", "regular");
}

export function formatCardTypeHe(cardType, contentLocale) {
  const copy = ui(contentLocale);
  return copy("cardType", cardType) || copy("cardType", "shop");
}

export function formatCardSourceHe(source, contentLocale) {
  const copy = ui(contentLocale);
  return copy("cardSource", source) || source || "";
}

export function formatCoinAmountHe(amount, contentLocale) {
  const n = Math.floor(Number(amount) || 0);
  const copy = ui(contentLocale);
  return copy("shop", "coinsLabel", { amount: n.toLocaleString("en-US") });
}

export function formatCoinAmountNumberHe(amount) {
  const n = Math.floor(Number(amount) || 0);
  return n.toLocaleString("en-US");
}

export function shopCardAlreadyOwnedHe(contentLocale) {
  return ui(contentLocale)("shop", "alreadyOwned");
}

export function shopCardSellDuplicateHe(contentLocale) {
  return ui(contentLocale)("shop", "sellDuplicate");
}

export function catalogCardOwnedHe(contentLocale) {
  return ui(contentLocale)("shop", "catalogOwned");
}

/** @deprecated use shopCardAlreadyOwnedHe */
export const SHOP_CARD_ALREADY_OWNED_HE = shopCardAlreadyOwnedHe();

/** @deprecated use shopCardSellDuplicateHe */
export const SHOP_CARD_SELL_DUPLICATE_HE = shopCardSellDuplicateHe();

/** @deprecated use catalogCardOwnedHe */
export const CATALOG_CARD_OWNED_HE = catalogCardOwnedHe();

export function formatCountdownHe(totalSeconds) {
  const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** Back-compat re-exports for callers without locale param */
export const RARITY_LABELS_EN = Object.freeze({
  regular: rewardUiCopy("rarity", "regular"),
  special: rewardUiCopy("rarity", "special"),
  rare: rewardUiCopy("rarity", "rare"),
  gold: rewardUiCopy("rarity", "gold"),
});

export const CARD_TYPE_LABELS_EN = Object.freeze({
  achievement: rewardUiCopy("cardType", "achievement"),
  shop: rewardUiCopy("cardType", "shop"),
  event: rewardUiCopy("cardType", "event"),
});

export const CARD_SOURCE_LABELS_EN = Object.freeze({
  earned_achievement: rewardUiCopy("cardSource", "earned_achievement"),
  shop_purchase: rewardUiCopy("cardSource", "shop_purchase"),
  surprise_box_reward: rewardUiCopy("cardSource", "surprise_box_reward"),
  duplicate_conversion: rewardUiCopy("cardSource", "duplicate_conversion"),
  card_sellback: rewardUiCopy("cardSource", "card_sellback"),
  admin_grant: rewardUiCopy("cardSource", "admin_grant"),
});
