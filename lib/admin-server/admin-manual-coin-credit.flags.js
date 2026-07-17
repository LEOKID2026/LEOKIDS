/**
 * Admin manual coin credit feature flag (fail-closed).
 */

export function isAdminManualCoinCreditEnabled() {
  const raw = process.env.ENABLE_ADMIN_MANUAL_COIN_CREDIT;
  if (raw == null || String(raw).trim() === "") return true;
  return String(raw).trim().toLowerCase() === "true";
}

export function adminManualCoinCreditDisabledResponse() {
  return { ok: false, error: "feature_disabled" };
}
