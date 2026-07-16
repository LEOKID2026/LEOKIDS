/**
 * user_product_memberships helpers — source of truth for product membership.
 * parent_profiles remains a shared user profile (no product_id).
 *
 * Membership mutations are service-role only (RPC + table writes via service client).
 * Suspended memberships are never auto-reactivated here.
 */

import { getServerProductId, PRODUCT_ERRORS, PRODUCT_GLOBAL } from "./product-context.server.js";

/**
 * @param {unknown} err
 * @returns {boolean}
 */
export function isProductMembershipSchemaMissing(err) {
  const msg = String(err?.message || err?.details || err?.hint || err || "").toLowerCase();
  const code = String(err?.code || "");
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    msg.includes("user_product_memberships") ||
    (msg.includes("does not exist") && msg.includes("membership"))
  );
}

/**
 * @param {unknown} err
 * @returns {boolean}
 */
export function isProductColumnSchemaMissing(err) {
  const msg = String(err?.message || err?.details || err?.hint || err || "").toLowerCase();
  const code = String(err?.code || "");
  return (
    code === "42703" ||
    code === "PGRST204" ||
    msg.includes("product_id") ||
    (msg.includes("column") && msg.includes("does not exist"))
  );
}

/**
 * Ensure active Global membership for this auth user. Does not touch IL membership.
 * Uses server product id only — never accepts client product_id.
 * Does not reactivate suspended memberships.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} db — must be service role
 * @param {string} userId
 * @param {{
 *   interfaceLanguage?: string,
 *   preferredReportLanguage?: string,
 * }} [opts]
 */
export async function ensureGlobalProductMembership(db, userId, opts = {}) {
  const productId = getServerProductId();
  const interfaceLanguage = String(opts.interfaceLanguage || "en").trim() || "en";
  const preferredReportLanguage =
    String(opts.preferredReportLanguage || interfaceLanguage).trim() || "en";

  if (!userId) {
    return { ok: false, status: 400, error: "missing_user_id" };
  }

  // Never trust client product claims.
  void opts.productId;
  void opts.product_id;

  const rpc = await db.rpc("ensure_user_product_membership", {
    p_user_id: userId,
    p_product_id: productId,
    p_interface_language: interfaceLanguage,
    p_preferred_report_language: preferredReportLanguage,
  });

  if (!rpc.error) {
    const row = rpc.data;
    if (row?.status && row.status !== "active") {
      return {
        ok: false,
        status: 403,
        error: "product_membership_suspended",
        message: "This LEO KIDS Global membership is suspended.",
        productId,
        membership: row,
      };
    }
    return { ok: true, productId, membership: row, via: "rpc" };
  }

  // Missing RPC / table → schema not ready (no authenticated fallback path).
  if (isProductMembershipSchemaMissing(rpc.error)) {
    return {
      ok: false,
      status: 503,
      error: PRODUCT_ERRORS.schema_not_ready.error,
      message: PRODUCT_ERRORS.schema_not_ready.message,
      schemaMissing: true,
    };
  }

  // RPC exists but refused (e.g. suspended) — surface message.
  const rpcMsg = String(rpc.error.message || "");
  if (/suspended/i.test(rpcMsg)) {
    return {
      ok: false,
      status: 403,
      error: "product_membership_suspended",
      message: "This LEO KIDS Global membership is suspended.",
      productId,
    };
  }

  // Service-role table path (idempotent create / language update only).
  const { data: existing, error: selErr } = await db
    .from("user_product_memberships")
    .select("user_id,product_id,status,interface_language,preferred_report_language")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (selErr) {
    if (isProductMembershipSchemaMissing(selErr)) {
      return {
        ok: false,
        status: 503,
        error: PRODUCT_ERRORS.schema_not_ready.error,
        message: PRODUCT_ERRORS.schema_not_ready.message,
        schemaMissing: true,
      };
    }
    return { ok: false, status: 500, error: "membership_lookup_failed" };
  }

  if (existing?.user_id) {
    if (existing.status === "suspended") {
      return {
        ok: false,
        status: 403,
        error: "product_membership_suspended",
        message: "This LEO KIDS Global membership is suspended.",
        productId,
        membership: existing,
      };
    }

    if (existing.status !== "active") {
      return {
        ok: false,
        status: 403,
        ...PRODUCT_ERRORS.membership_required,
        productId,
        membership: existing,
      };
    }

    // Active only: update languages — never flip status.
    const patch = {
      interface_language: interfaceLanguage,
      preferred_report_language: preferredReportLanguage,
      updated_at: new Date().toISOString(),
    };
    const { error: updErr } = await db
      .from("user_product_memberships")
      .update(patch)
      .eq("user_id", userId)
      .eq("product_id", productId)
      .eq("status", "active");
    if (updErr) {
      return { ok: false, status: 500, error: "membership_update_failed" };
    }
    return { ok: true, productId, membership: { ...existing, ...patch }, via: "update" };
  }

  const insertRow = {
    user_id: userId,
    product_id: productId,
    status: "active",
    interface_language: interfaceLanguage,
    preferred_report_language: preferredReportLanguage,
  };
  const { data: inserted, error: insErr } = await db
    .from("user_product_memberships")
    .insert(insertRow)
    .select("user_id,product_id,status,interface_language,preferred_report_language")
    .maybeSingle();

  if (insErr) {
    if (isProductMembershipSchemaMissing(insErr)) {
      return {
        ok: false,
        status: 503,
        error: PRODUCT_ERRORS.schema_not_ready.error,
        message: PRODUCT_ERRORS.schema_not_ready.message,
        schemaMissing: true,
      };
    }
    return { ok: false, status: 500, error: "membership_create_failed" };
  }

  return { ok: true, productId, membership: inserted || insertRow, via: "insert" };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} db
 * @param {string} userId
 * @param {string} [productId]
 */
export async function hasActiveProductMembership(db, userId, productId = PRODUCT_GLOBAL) {
  const { data, error } = await db
    .from("user_product_memberships")
    .select("user_id,status")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    if (isProductMembershipSchemaMissing(error)) {
      return { ok: false, active: false, schemaMissing: true, error };
    }
    return { ok: false, active: false, error };
  }
  return { ok: true, active: Boolean(data?.user_id), schemaMissing: false };
}
