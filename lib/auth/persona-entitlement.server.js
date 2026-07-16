/** @typedef {'parent'|'private_teacher'|'school_teacher'|'school_manager'|'school_operator'|'admin'} Persona */

export const PERSONA_VALUES = [
  "parent",
  "private_teacher",
  "school_teacher",
  "school_manager",
  "school_operator",
  "admin",
];

export const ACTIVE_ENTITLEMENT_STATUS = "active";

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} serviceRole
 * @param {string} userId
 * @param {Persona} persona
 */
export async function loadPersonaEntitlement(serviceRole, userId, persona) {
  const { data, error } = await serviceRole
    .from("account_persona_entitlements")
    .select("*")
    .eq("user_id", userId)
    .eq("persona", persona)
    .maybeSingle();

  if (error) {
    const { isDbSchemaNotReadyError } = await import("../teacher-server/teacher-audit.server.js");
    if (isDbSchemaNotReadyError(error)) {
      return { ok: false, status: 503, code: "db_schema_not_ready" };
    }
    return { ok: false, status: 500, code: "internal_error" };
  }

  return { ok: true, entitlement: data || null };
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} serviceRole
 * @param {string} userId
 * @param {Persona} persona
 */
export async function hasActivePersonaEntitlement(serviceRole, userId, persona) {
  const result = await loadPersonaEntitlement(serviceRole, userId, persona);
  if (!result.ok) return result;
  return {
    ok: true,
    active: result.entitlement?.status === ACTIVE_ENTITLEMENT_STATUS,
    entitlement: result.entitlement,
  };
}

/**
 * Load parent account settings for a product.
 * After v2 migration PK is (parent_user_id, product_id). Pre-migration falls back to parent_user_id only.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} serviceRole
 * @param {string} parentUserId
 * @param {string} [productId] — defaults to server Global product
 */
export async function loadParentAccountSettings(serviceRole, parentUserId, productId) {
  const { getServerProductId } = await import("../global/product-context.server.js");
  const resolvedProductId = productId || getServerProductId();

  let query = serviceRole
    .from("parent_account_settings")
    .select("*")
    .eq("parent_user_id", parentUserId);

  // Prefer product-scoped row when column exists.
  const withProduct = await query.eq("product_id", resolvedProductId).maybeSingle();
  if (!withProduct.error) {
    return { ok: true, settings: withProduct.data || null, productId: resolvedProductId };
  }

  const msg = String(withProduct.error?.message || "").toLowerCase();
  const productColumnMissing =
    withProduct.error?.code === "42703" ||
    withProduct.error?.code === "PGRST204" ||
    msg.includes("product_id");

  if (!productColumnMissing) {
    const { isDbSchemaNotReadyError } = await import("../teacher-server/teacher-audit.server.js");
    if (isDbSchemaNotReadyError(withProduct.error)) {
      return { ok: false, status: 503, code: "db_schema_not_ready" };
    }
    return { ok: false, status: 500, code: "internal_error" };
  }

  // Legacy single-row settings (pre v2) — Global site still reads until migration runs.
  const { data, error } = await serviceRole
    .from("parent_account_settings")
    .select("*")
    .eq("parent_user_id", parentUserId)
    .maybeSingle();

  if (error) {
    const { isDbSchemaNotReadyError } = await import("../teacher-server/teacher-audit.server.js");
    if (isDbSchemaNotReadyError(error)) {
      return { ok: false, status: 503, code: "db_schema_not_ready" };
    }
    return { ok: false, status: 500, code: "internal_error" };
  }

  return { ok: true, settings: data || null, productId: resolvedProductId, legacy: true };
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} serviceRole
 * @param {string} userId
 * @param {Persona} persona
 * @param {object} [options]
 */
export async function upsertActiveEntitlement(serviceRole, userId, persona, options = {}) {
  const approvalSource = options.approvalSource || "self_signup";
  const approvedBy = options.approvedBy || null;

  const { data, error } = await serviceRole
    .from("account_persona_entitlements")
    .upsert(
      {
        user_id: userId,
        persona,
        status: ACTIVE_ENTITLEMENT_STATUS,
        approval_source: approvalSource,
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      },
      { onConflict: "user_id,persona" }
    )
    .select("*")
    .single();

  if (error) {
    const { isDbSchemaNotReadyError } = await import("../teacher-server/teacher-audit.server.js");
    if (isDbSchemaNotReadyError(error)) {
      return { ok: false, status: 503, code: "db_schema_not_ready" };
    }
    return { ok: false, status: 500, code: "internal_error" };
  }

  return { ok: true, entitlement: data };
}

/**
 * Map entitlement status to API error code.
 * @param {string|null|undefined} status
 */
export function entitlementStatusToErrorCode(status) {
  switch (status) {
    case "pending":
      return "entitlement_pending";
    case "suspended":
      return "entitlement_suspended";
    case "rejected":
      return "entitlement_rejected";
    case "revoked":
      return "entitlement_revoked";
    default:
      return "not_a_persona";
  }
}
