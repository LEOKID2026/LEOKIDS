import { PARENT_SIGNUP_MODE } from "./parent-signup-mode.server.js";
import {
  hasActivePersonaEntitlement,
  loadParentAccountSettings,
  upsertActiveEntitlement,
} from "../auth/persona-entitlement.server.js";
import { getLearningSupabaseServiceRoleClient } from "../learning-supabase/server.js";
import {
  DEFAULT_PARENT_STUDENT_LIMIT,
  QA_SIMULATION_PARENT_EMAIL,
  QA_SIMULATION_PARENT_STUDENT_LIMIT,
} from "./parent-student-limit.server.js";

/**
 * Provision parent entitlement + product-scoped settings after policy acceptance.
 * Writes only to product_parent_account_settings (never legacy parent_account_settings).
 * @param {import('@supabase/supabase-js').SupabaseClient} [serviceRole]
 * @param {string} parentUserId
 * @param {string|null|undefined} email
 * @param {{ productId?: string }} [options]
 */
export async function provisionParentEntitlementOnAccept(serviceRole, parentUserId, email, options = {}) {
  if (PARENT_SIGNUP_MODE !== "auto_active") {
    return { ok: true, skipped: true, reason: "signup_mode_not_auto_active" };
  }

  const db = serviceRole || getLearningSupabaseServiceRoleClient();
  const { getServerProductId } = await import("../global/product-context.server.js");
  // Server product only — ignore client product claims.
  void options.productId;
  void options.product_id;
  const productId = getServerProductId();

  const entitlementResult = await upsertActiveEntitlement(db, parentUserId, "parent", {
    approvalSource: "self_signup",
  });
  if (!entitlementResult.ok) return entitlementResult;

  const normalizedEmail = String(email || "").trim().toLowerCase();
  const maxChildren =
    normalizedEmail === QA_SIMULATION_PARENT_EMAIL
      ? QA_SIMULATION_PARENT_STUDENT_LIMIT
      : DEFAULT_PARENT_STUDENT_LIMIT;

  const settingsResult = await loadParentAccountSettings(db, parentUserId, productId);
  if (!settingsResult.ok) {
    // Schema not ready: entitlement still ok; settings wait for v3 SQL.
    if (settingsResult.schemaMissing || settingsResult.code === "db_schema_not_ready") {
      return {
        ok: true,
        entitlement: entitlementResult.entitlement,
        settingsCreated: false,
        productId,
        settingsDeferred: true,
      };
    }
    return settingsResult;
  }

  if (!settingsResult.settings) {
    const { insertProductParentAccountSettings } = await import(
      "../global/product-settings.server.js"
    );
    const insertResult = await insertProductParentAccountSettings(db, {
      parent_user_id: parentUserId,
      product_id: productId,
      plan_code: "free",
      account_status: "active",
      max_children: maxChildren,
      reports_enabled: true,
      copilot_enabled: false,
    });
    if (!insertResult.ok) {
      if (insertResult.schemaMissing || insertResult.code === "db_schema_not_ready") {
        return {
          ok: true,
          entitlement: entitlementResult.entitlement,
          settingsCreated: false,
          productId,
          settingsDeferred: true,
        };
      }
      return { ok: false, status: insertResult.status || 500, code: insertResult.code || "internal_error" };
    }
  }

  return {
    ok: true,
    entitlement: entitlementResult.entitlement,
    settingsCreated: !settingsResult.settings,
    productId,
  };
}

/**
 * When policy is already accepted but entitlement/settings were not provisioned
 * (e.g. accept API returned 200 before a failed silent provision), heal once.
 * @param {import('@supabase/supabase-js').SupabaseClient} serviceRole
 * @param {string} parentUserId
 * @param {string|null|undefined} email
 */
export async function ensureParentEntitlementIfPolicyAccepted(serviceRole, parentUserId, email) {
  if (PARENT_SIGNUP_MODE !== "auto_active") {
    return { ok: true, skipped: true, reason: "signup_mode_not_auto_active" };
  }

  const activeCheck = await hasActivePersonaEntitlement(serviceRole, parentUserId, "parent");
  if (!activeCheck.ok) return activeCheck;
  if (activeCheck.active) {
    const { getServerProductId } = await import("../global/product-context.server.js");
    const settingsResult = await loadParentAccountSettings(
      serviceRole,
      parentUserId,
      getServerProductId()
    );
    if (settingsResult.ok && settingsResult.settings?.account_status === "active") {
      return { ok: true, skipped: true, reason: "already_provisioned" };
    }
    if (settingsResult.schemaMissing || settingsResult.code === "db_schema_not_ready") {
      return { ok: true, skipped: true, reason: "settings_schema_not_ready" };
    }
  }

  const { resolveParentPolicyAcceptanceStatus } = await import("./policy-acceptance.server.js");
  const policyStatus = await resolveParentPolicyAcceptanceStatus(serviceRole, parentUserId);
  if (!policyStatus.accepted) {
    return { ok: true, skipped: true, reason: "policy_not_accepted" };
  }

  return provisionParentEntitlementOnAccept(serviceRole, parentUserId, email);
}

/**
 * Resolve max children from product_parent_account_settings with legacy email fallback.
 * @param {import('@supabase/supabase-js').SupabaseClient} serviceRole
 * @param {string} parentUserId
 * @param {string|null|undefined} email
 */
export async function resolveParentMaxChildren(serviceRole, parentUserId, email) {
  const settingsResult = await loadParentAccountSettings(serviceRole, parentUserId);
  if (!settingsResult.ok) {
    if (settingsResult.schemaMissing || settingsResult.code === "db_schema_not_ready") {
      const { resolveParentStudentLimit } = await import("./parent-student-limit.server.js");
      return { ok: true, maxChildren: resolveParentStudentLimit(email), settings: null };
    }
    return settingsResult;
  }

  if (settingsResult.settings?.max_children != null) {
    return { ok: true, maxChildren: settingsResult.settings.max_children, settings: settingsResult.settings };
  }

  const { resolveParentStudentLimit } = await import("./parent-student-limit.server.js");
  return {
    ok: true,
    maxChildren: resolveParentStudentLimit(email),
    settings: null,
  };
}
