/**
 * user_product_memberships helpers — source of truth for product membership.
 * parent_profiles remains a shared user profile (no product_id).
 *
 * Membership mutations are service-role only (RPC + table writes via service client).
 * Suspended memberships are never auto-reactivated here.
 */

import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import { getServerProductId, PRODUCT_ERRORS, PRODUCT_GLOBAL } from "./product-context.server.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { normalizeLocaleId } from "../i18n/locale-normalize.js";

/**
 * Validate and normalize a locale id for membership storage.
 * @param {string|null|undefined} raw
 * @param {string} [fallback]
 */
export function normalizeMembershipLocale(raw, fallback = "en") {
  const id = normalizeLocaleId(raw || fallback);
  const def = resolveLocaleDefinition(id);
  if (!def.enabled && def.status !== "development") {
    return resolveLocaleDefinition(fallback).id;
  }
  return def.id;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} db
 * @param {string} userId
 * @param {string} [productId]
 */
export async function loadGlobalProductMembershipLocales(db, userId, productId = PRODUCT_GLOBAL) {
  if (!userId) {
    return { ok: false, status: 400, error: "missing_user_id" };
  }
  const { data, error } = await db
    .from("user_product_memberships")
    .select("user_id,product_id,status,interface_language,preferred_report_language")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    if (isProductMembershipSchemaMissing(error)) {
      return { ok: false, schemaMissing: true, error: PRODUCT_ERRORS.schema_not_ready.error };
    }
    return { ok: false, status: 500, error: "membership_lookup_failed" };
  }

  if (!data?.user_id) {
    return {
      ok: true,
      found: false,
      interfaceLanguage: "en",
      preferredReportLanguage: "en",
      membership: null,
    };
  }

  return {
    ok: true,
    found: true,
    interfaceLanguage: normalizeMembershipLocale(data.interface_language, "en"),
    preferredReportLanguage: normalizeMembershipLocale(
      data.preferred_report_language || data.interface_language,
      "en"
    ),
    membership: data,
  };
}

/**
 * Update membership locale fields for active Global membership.
 * @param {import("@supabase/supabase-js").SupabaseClient} db
 * @param {string} userId
 * @param {{
 *   interfaceLanguage?: string|null,
 *   preferredReportLanguage?: string|null,
 * }} opts
 */
export async function updateGlobalProductMembershipLocales(db, userId, opts = {}) {
  const productId = getServerProductId();
  const interfaceLanguage =
    opts.interfaceLanguage != null
      ? normalizeMembershipLocale(opts.interfaceLanguage)
      : undefined;
  const preferredReportLanguage =
    opts.preferredReportLanguage != null
      ? normalizeMembershipLocale(opts.preferredReportLanguage)
      : undefined;

  if (interfaceLanguage === undefined && preferredReportLanguage === undefined) {
    return { ok: false, status: 400, error: "no_locale_fields" };
  }

  return ensureGlobalProductMembership(db, userId, {
    interfaceLanguage: interfaceLanguage ?? null,
    preferredReportLanguage: preferredReportLanguage ?? null,
    preserveExistingLanguages: false,
    updateLanguagesOnly: true,
  });
}

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
 *   interfaceLanguage?: string|null,
 *   preferredReportLanguage?: string|null,
 *   preserveExistingLanguages?: boolean,
 *   updateLanguagesOnly?: boolean,
 *   initialInterfaceLanguage?: string|null,
 * }} [opts]
 */
export async function ensureGlobalProductMembership(db, userId, opts = {}) {
  const productId = getServerProductId();
  const preserveExisting =
    opts.preserveExistingLanguages !== false && opts.interfaceLanguage === undefined;
  const interfaceLanguage =
    opts.interfaceLanguage !== undefined
      ? opts.interfaceLanguage === null
        ? null
        : normalizeMembershipLocale(opts.interfaceLanguage)
      : preserveExisting
        ? null
        : normalizeMembershipLocale(opts.initialInterfaceLanguage, "en");
  const preferredReportLanguage =
    opts.preferredReportLanguage !== undefined
      ? opts.preferredReportLanguage === null
        ? null
        : normalizeMembershipLocale(opts.preferredReportLanguage)
      : preserveExisting
        ? null
        : interfaceLanguage || normalizeMembershipLocale(opts.initialInterfaceLanguage, "en");

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
        message: globalBurnDownCopy("lib__global__product-membership.server", "this_leo_kids_global_membership_is_suspended"),
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
      message: globalBurnDownCopy("lib__global__product-membership.server", "this_leo_kids_global_membership_is_suspended"),
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
        message: globalBurnDownCopy("lib__global__product-membership.server", "this_leo_kids_global_membership_is_suspended"),
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

    // Active only: update languages when explicitly provided.
    if (interfaceLanguage != null || preferredReportLanguage != null) {
      const patch = {
        ...(interfaceLanguage != null ? { interface_language: interfaceLanguage } : {}),
        ...(preferredReportLanguage != null
          ? { preferred_report_language: preferredReportLanguage }
          : {}),
        updated_at: new Date().toISOString(),
      };
      if (Object.keys(patch).length > 1) {
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
    }
    if (opts.updateLanguagesOnly) {
      return { ok: false, status: 400, error: "no_locale_update" };
    }
    return { ok: true, productId, membership: existing, via: "existing" };
  }

  const insertInterface = interfaceLanguage || normalizeMembershipLocale(opts.initialInterfaceLanguage, "en");
  const insertReport =
    preferredReportLanguage ||
    insertInterface ||
    normalizeMembershipLocale(opts.initialInterfaceLanguage, "en");
  const insertRow = {
    user_id: userId,
    product_id: productId,
    status: "active",
    interface_language: insertInterface,
    preferred_report_language: insertReport,
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
