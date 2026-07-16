/**
 * Product-scoped settings tables for Global (v3).
 * Legacy IL tables parent_account_settings / guest_mode_settings are never written here.
 */

import { getServerProductId, PRODUCT_ERRORS } from "./product-context.server.js";

export const PRODUCT_PARENT_ACCOUNT_SETTINGS_TABLE = "product_parent_account_settings";
export const PRODUCT_GUEST_MODE_SETTINGS_TABLE = "product_guest_mode_settings";

/**
 * @param {unknown} err
 */
export function isProductSettingsSchemaMissing(err) {
  const msg = String(err?.message || err?.details || err?.hint || err || "").toLowerCase();
  const code = String(err?.code || "");
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    msg.includes("product_parent_account_settings") ||
    msg.includes("product_guest_mode_settings") ||
    (msg.includes("does not exist") && msg.includes("product_"))
  );
}

/**
 * Load Global parent account settings from product_parent_account_settings only.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} serviceRole
 * @param {string} parentUserId
 * @param {string} [productId]
 */
export async function loadProductParentAccountSettings(serviceRole, parentUserId, productId) {
  const resolvedProductId = productId || getServerProductId();
  const { data, error } = await serviceRole
    .from(PRODUCT_PARENT_ACCOUNT_SETTINGS_TABLE)
    .select("*")
    .eq("parent_user_id", parentUserId)
    .eq("product_id", resolvedProductId)
    .maybeSingle();

  if (error) {
    if (isProductSettingsSchemaMissing(error)) {
      return {
        ok: false,
        status: 503,
        code: "db_schema_not_ready",
        error: PRODUCT_ERRORS.schema_not_ready.error,
        message: PRODUCT_ERRORS.schema_not_ready.message,
        schemaMissing: true,
      };
    }
    return { ok: false, status: 500, code: "internal_error" };
  }

  return { ok: true, settings: data || null, productId: resolvedProductId };
}

/**
 * Insert Global parent settings row (never touches legacy parent_account_settings).
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} serviceRole
 * @param {object} row
 */
export async function insertProductParentAccountSettings(serviceRole, row) {
  const productId = row.product_id || getServerProductId();
  const payload = { ...row, product_id: productId };
  const { data, error } = await serviceRole
    .from(PRODUCT_PARENT_ACCOUNT_SETTINGS_TABLE)
    .insert(payload)
    .select("*")
    .maybeSingle();

  if (error) {
    if (isProductSettingsSchemaMissing(error)) {
      return {
        ok: false,
        status: 503,
        code: "db_schema_not_ready",
        schemaMissing: true,
        error,
      };
    }
    return { ok: false, status: 500, code: "internal_error", error };
  }
  return { ok: true, settings: data, productId };
}
