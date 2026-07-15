#!/usr/bin/env node
/**
 * Ensure platform admin auth user (app_metadata.role=admin + admin entitlement).
 * node --env-file=.env.local scripts/admin-portal/ensure-admin-test-user.mjs
 *
 * Optional env:
 *   MAIN_ADMIN_EMAIL or ADMIN_TEST_EMAIL (default: leokid2026@gmail.com)
 *   ADMIN_TEST_PASSWORD — if set, updates password; never committed or logged
 */
import { createClient } from "@supabase/supabase-js";

const EMAIL = String(
  process.env.MAIN_ADMIN_EMAIL || process.env.ADMIN_TEST_EMAIL || "leokid2026@gmail.com"
)
  .trim()
  .toLowerCase();
const PASSWORD = String(process.env.ADMIN_TEST_PASSWORD || "").trim();

function requireEnv(name) {
  const v = String(process.env[name] || "").trim();
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

async function findUserByEmail(admin, email) {
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data?.users?.find((u) => String(u.email || "").toLowerCase() === email);
    if (match) return match;
    if (!data?.users?.length) break;
  }
  return null;
}

async function upsertAdminEntitlement(db, userId) {
  const { error } = await db.from("account_persona_entitlements").upsert(
    {
      user_id: userId,
      persona: "admin",
      status: "active",
      approval_source: "admin",
      approved_at: new Date().toISOString(),
    },
    { onConflict: "user_id,persona" }
  );
  if (error) throw error;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_LEARNING_SUPABASE_URL");
  const serviceKey = requireEnv("LEARNING_SUPABASE_SERVICE_ROLE_KEY");

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const existing = await findUserByEmail(admin, EMAIL);
  let userId;

  if (existing?.id) {
    const patch = {
      email_confirm: true,
      app_metadata: { ...(existing.app_metadata || {}), role: "admin" },
    };
    if (PASSWORD) patch.password = PASSWORD;
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, patch);
    if (error) throw error;
    userId = data.user?.id || existing.id;
    console.log(`Updated admin user: ${EMAIL} (${userId})`);
  } else {
    if (!PASSWORD) {
      throw new Error(
        `User ${EMAIL} not found. Set ADMIN_TEST_PASSWORD to create, or create in Supabase Dashboard.`
      );
    }
    const { data, error } = await admin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      app_metadata: { role: "admin" },
    });
    if (error) throw error;
    userId = data.user?.id;
    console.log(`Created admin user: ${EMAIL} (${userId})`);
  }

  await upsertAdminEntitlement(admin, userId);

  const { data: profile } = await admin
    .from("teacher_profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.id) {
    console.warn(
      "WARN: user has teacher_profiles row — admin should not use teacher APIs. Remove manually if unintended."
    );
  } else {
    console.log("OK: no teacher_profiles row (admin not treated as teacher).");
  }

  if (!PASSWORD) {
    console.log("Password unchanged — set via Supabase Dashboard if needed.");
  }

  console.log("app_metadata.role=admin + admin entitlement active. Login via /teacher/login → /admin/teachers.");
}

main().catch((e) => {
  console.error("ensure-admin-test-user: FAIL", e.message || e);
  process.exit(1);
});
