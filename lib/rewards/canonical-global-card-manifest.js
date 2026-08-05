/**
 * Canonical GLOBAL runtime card keys = English pack catalog minus Israel-only
 * scope and pack-only / non-runtime entries (no DB row / not student-facing).
 */

import { REWARD_CARD_CATALOG_EN } from "./reward-pack-copy.js";
import { isIsraelOnlyRewardCardKey } from "./global-card-scope.js";

/**
 * Present in content-packs for copy/assets but not returned by GLOBAL card APIs
 * (no active DB row, or not a collectible card).
 */
export const GLOBAL_PACK_ONLY_NON_RUNTIME_CARD_KEYS = Object.freeze([
  "leo_card_common_assets",
  "event_autumn",
  "event_family_day",
  "event_spring",
  "event_summer_vacation",
  "event_winter_vacation",
]);

const PACK_ONLY_SET = new Set(GLOBAL_PACK_ONLY_NON_RUNTIME_CARD_KEYS);

const keys = Object.keys(REWARD_CARD_CATALOG_EN.cards || {})
  .filter((k) => !isIsraelOnlyRewardCardKey(k) && !PACK_ONLY_SET.has(k))
  .sort();

export const CANONICAL_GLOBAL_CARD_KEYS = Object.freeze(keys);

export const CANONICAL_GLOBAL_CARD_KEY_SET = new Set(CANONICAL_GLOBAL_CARD_KEYS);

/**
 * @param {string|null|undefined} cardKey
 */
export function isCanonicalGlobalCardKey(cardKey) {
  return CANONICAL_GLOBAL_CARD_KEY_SET.has(String(cardKey || "").trim());
}
