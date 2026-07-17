/**
 * Client-side reward flags (NEXT_PUBLIC_* mirrors server flags when exposed).
 */

function envEnabled(name, defaultWhenUnset = true) {
  const raw = process.env[name];
  if (raw == null || String(raw).trim() === "") return defaultWhenUnset;
  const v = String(raw).trim().toLowerCase();
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export function isCardRewardsEnabledClient() {
  return envEnabled("NEXT_PUBLIC_CARD_REWARDS_ENABLED", true);
}

export function isRewardEconomySettingsEnabledClient() {
  return envEnabled("NEXT_PUBLIC_REWARD_ECONOMY_SETTINGS_ENABLED", true);
}

export function isAdminManualCoinCreditEnabledClient() {
  return envEnabled("NEXT_PUBLIC_ENABLE_ADMIN_MANUAL_COIN_CREDIT", true);
}

export function isRewardsAdminEnabledClient() {
  return (
    isCardRewardsEnabledClient() ||
    isRewardEconomySettingsEnabledClient() ||
    isAdminManualCoinCreditEnabledClient()
  );
}
