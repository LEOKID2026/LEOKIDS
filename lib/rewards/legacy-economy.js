/**
 * SEED / MIGRATION ONLY — not a runtime economy source.
 * Do not import from award, display, or API paths at runtime.
 * Values are copied into DB via migrations (058+) and future 063 seed.
 */

export const LEGACY_MISSION_POOL = {
  g12: [
    { id: "questions_10", textHe: "Answer 10 questions today", type: "questions", target: 10, rewardCoins: 20 },
    { id: "minutes_5", textHe: "Learn for 5 minutes today", type: "minutes", target: 5, rewardCoins: 20 },
    { id: "subjects_1", textHe: "Practice at least one subject", type: "subjects", target: 1, rewardCoins: 20 },
  ],
  g34: [
    { id: "questions_15", textHe: "Answer 15 questions today", type: "questions", target: 15, rewardCoins: 20 },
    { id: "minutes_8", textHe: "Learn for 8 minutes today", type: "minutes", target: 8, rewardCoins: 20 },
    { id: "subjects_2", textHe: "Practice two different subjects", type: "subjects", target: 2, rewardCoins: 20 },
  ],
  g56: [
    { id: "questions_20", textHe: "Answer 20 questions today", type: "questions", target: 20, rewardCoins: 20 },
    { id: "minutes_10", textHe: "Learn for 10 minutes today", type: "minutes", target: 10, rewardCoins: 20 },
    { id: "subjects_2", textHe: "Practice two different subjects", type: "subjects", target: 2, rewardCoins: 20 },
  ],
};

export const LEGACY_MISSION_REWARD_COINS = 20;

export const LEGACY_MONTHLY_PERSISTENCE_TIERS = [
  { minutes: 100, coins: 10_000, labelHe: "100-minute goal" },
  { minutes: 250, coins: 30_000, labelHe: "250-minute goal" },
  { minutes: 400, coins: 60_000, labelHe: "400-minute goal" },
  { minutes: 600, coins: 100_000, labelHe: "600-minute goal" },
];

export const LEGACY_MONTHLY_GLOBAL = {
  monthlyMinutesCap: 600,
  monthlyCoinsCap: 100_000,
};
