/**
 * GLOBAL product card scope — Israel-only keys must never enter GLOBAL payloads.
 * Filter / deny-list only (fresh GLOBAL migrations must not seed these keys).
 */

/** Forbidden Israel-only card keys (deny-list for filters and gates). */
export const GLOBAL_ISRAEL_ONLY_REWARD_CARD_KEYS = Object.freeze([
  "achievement_hebrew_star",
  "achievement_moledet_explorer",
  "event_hanukkah",
  "event_independence_day",
  "event_purim",
  "event_rosh_hashana",
  "event_shavuot",
  "event_sukkot",
  "event_lag_baomer",
  "event_passover",
  "event_tu_bishvat",
]);

const ISRAEL_ONLY_SET = new Set(GLOBAL_ISRAEL_ONLY_REWARD_CARD_KEYS);

/**
 * @param {string|null|undefined} cardKey
 */
export function isIsraelOnlyRewardCardKey(cardKey) {
  return ISRAEL_ONLY_SET.has(String(cardKey || "").trim());
}

/**
 * @param {string|null|undefined} cardKey
 */
export function isGlobalRewardCardKey(cardKey) {
  const key = String(cardKey || "").trim();
  if (!key) return false;
  return !isIsraelOnlyRewardCardKey(key);
}

/**
 * @param {{ card_key?: string|null, cardKey?: string|null }|null|undefined} card
 */
export function isGlobalScopedRewardCard(card) {
  return isGlobalRewardCardKey(card?.card_key || card?.cardKey);
}

/**
 * @template T
 * @param {T[]} cards
 * @returns {T[]}
 */
export function filterIsraelOnlyRewardCards(cards) {
  return (cards || []).filter((c) => isGlobalScopedRewardCard(c));
}
