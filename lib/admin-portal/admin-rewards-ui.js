/** English display labels for Admin rewards / economy UI. */

import { CARD_RULE_TYPE_META } from "../rewards/card-rule-types.js";

const RARITY_LABELS = {
  regular: "Regular",
  special: "Special",
  rare: "Rare",
  gold: "Gold",
};
const CARD_TYPE_LABELS = {
  achievement: "Achievement card",
  shop: "Shop card",
  event: "Event card",
};

export function formatRarityLabel(rarity) {
  return RARITY_LABELS[rarity] || RARITY_LABELS.regular;
}
export function formatCardTypeLabel(cardType) {
  return CARD_TYPE_LABELS[cardType] || CARD_TYPE_LABELS.shop;
}

export const VISIBILITY_MODE_HE = {
  visible_locked: "Visible (locked until earned)",
  hidden_until_eligible: "Hidden until eligible",
};

export const CARD_RARITY_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "special", label: "Special" },
  { value: "rare", label: "Rare" },
  { value: "gold", label: "Gold" },
];

export const CARD_TYPE_OPTIONS = [
  { value: "shop", label: "Shop" },
  { value: "achievement", label: "Achievement" },
  { value: "event", label: "Event" },
];

/** @param {string|null|undefined} mode */
export function formatVisibilityModeHe(mode) {
  return VISIBILITY_MODE_HE[String(mode || "").trim()] || mode || "-";
}

/** @param {string|null|undefined} ruleType */
export function formatRuleTypeHe(ruleType) {
  const k = String(ruleType || "").trim();
  return CARD_RULE_TYPE_META[k]?.label || ruleType || "-";
}

export const ADMIN_REWARDS_PAGE_UNAVAILABLE =
  "Rewards page is unavailable — enable server flags: cards, coin economy, or manual coins.";

/** @type {Record<string, string>} */
export const ECONOMY_SETTING_AREA_HE = {
  daily_missions: "Daily missions",
  monthly_tiers: "Monthly tiers",
  global_settings: "Global settings",
  session_coins: "Practice coins",
  entry_cost_options: "Arcade entry costs",
  arcade_payout_rules: "Arcade payout rules",
};

/** @type {Record<string, string>} */
export const ECONOMY_ENTITY_KEY_HE = {
  g12: "Grades 1–2",
  g34: "Grades 3–4",
  g56: "Grades 5–6",
};

/** @type {Record<string, string>} */
export const ECONOMY_FIELD_NAME_HE = {
  text: "Child-facing text",
  target_value: "Target",
  reward_coins: "Coins",
  minutes_target: "Minutes target",
  tier_label: "Tier name",
  is_active: "Active",
  base_coins: "Base coins",
  bonus_80_coins: "80% bonus",
  bonus_95_coins: "95% bonus",
  daily_cap: "Daily cap",
  amount: "Amount",
  label: "Label",
  payout_rules_json: "Payout rules",
  display_order: "Display order",
  monthly_minutes_cap: "Monthly minutes cap",
  monthly_coins_cap: "Monthly coins cap",
  row_update: "Row update",
};

/** @type {Record<string, string>} */
export const ARCADE_GAME_KEY_HE = {
  fourline: "Four in a row",
  ludo: "Ludo",
  "snakes-and-ladders": "Snakes & ladders",
  checkers: "Checkers",
  chess: "Chess",
  dominoes: "Dominoes",
  bingo: "Bingo",
};

/** @param {string|null|undefined} area */
export function formatEconomySettingAreaHe(area) {
  const key = String(area || "").trim().toLowerCase();
  return ECONOMY_SETTING_AREA_HE[key] || area || "-";
}

/** @param {string|null|undefined} entityKey */
export function formatEconomyEntityKeyHe(entityKey) {
  const key = String(entityKey || "").trim().toLowerCase();
  return ECONOMY_ENTITY_KEY_HE[key] || entityKey || "-";
}

/** @param {string|null|undefined} fieldName */
export function formatEconomyFieldNameHe(fieldName) {
  const key = String(fieldName || "").trim().toLowerCase();
  return ECONOMY_FIELD_NAME_HE[key] || fieldName || "-";
}

/** @param {string|null|undefined} gameKey @param {string|null|undefined} [title] */
export function formatArcadeGameKeyHe(gameKey, title) {
  const titleText = String(title || "").trim();
  if (titleText) return titleText;
  const key = String(gameKey || "").trim().toLowerCase();
  return ARCADE_GAME_KEY_HE[key] || gameKey || "-";
}

/** @param {boolean|null|undefined} ok */
export function formatApiOkHe(ok) {
  if (ok === true) return "Yes";
  if (ok === false) return "No";
  return "-";
}
