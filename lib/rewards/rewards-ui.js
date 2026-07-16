/** English labels for child-facing reward UI. */

export const RARITY_LABELS_EN = {
  regular: "Regular",
  special: "Special",
  rare: "Rare",
  gold: "Gold",
};

export const CARD_TYPE_LABELS_EN = {
  achievement: "Achievement card",
  shop: "Shop card",
  event: "Event card",
};

export const CARD_SOURCE_LABELS_EN = {
  earned_achievement: "Learning achievement",
  shop_purchase: "Shop purchase",
  surprise_box_reward: "Surprise box",
  duplicate_conversion: "Duplicate conversion",
  card_sellback: "Duplicate sale",
  admin_grant: "Gift from the team",
};

export function formatRarityHe(rarity) {
  return RARITY_LABELS_EN[rarity] || RARITY_LABELS_EN.regular;
}

export function formatCardTypeHe(cardType) {
  return CARD_TYPE_LABELS_EN[cardType] || CARD_TYPE_LABELS_EN.shop;
}

export function formatCoinAmountHe(amount) {
  const n = Math.floor(Number(amount) || 0);
  return `${n.toLocaleString("en-US")} coins`;
}

export function formatCoinAmountNumberHe(amount) {
  const n = Math.floor(Number(amount) || 0);
  return n.toLocaleString("en-US");
}

/** Shop tile when the student already owns this purchasable card. */
export const SHOP_CARD_ALREADY_OWNED_HE = "You have it!";

/** Shop tile when the student can sell one duplicate copy. */
export const SHOP_CARD_SELL_DUPLICATE_HE = "Sell duplicate";

/** Catalog tile when the student already owns this card. */
export const CATALOG_CARD_OWNED_HE = "Collected";

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
