import { getLearningSupabaseServiceRoleClient } from "../../../lib/learning-supabase/server";
import { requireParentApiContext } from "../../../lib/auth/persona-guard.server.js";
import { resolveParentMaxChildren } from "../../../lib/parent-server/parent-entitlement-provision.server.js";
import { DEFAULT_PARENT_STUDENT_LIMIT } from "../../../lib/parent-server/parent-student-limit.server";
import { getServerProductId, PRODUCT_ERRORS } from "../../../lib/global/product-context.server.js";
import { isProductColumnSchemaMissing } from "../../../lib/global/product-membership.server.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const ctx = await requireParentApiContext(res, req.headers.authorization || "");
    if (ctx.stopped) return undefined;

    const productId = getServerProductId();
    const serviceClient = getLearningSupabaseServiceRoleClient();

    const { data, error } = await serviceClient
      .from("students")
      .select(
        "id,full_name,grade_level,is_active,created_at,account_kind,product_id,student_coin_balances(balance,lifetime_earned,lifetime_spent)"
      )
      .eq("parent_id", ctx.parentUserId)
      .eq("product_id", productId)
      .or("account_kind.eq.registered,account_kind.is.null")
      .order("created_at", { ascending: true });

    if (error) {
      if (isProductColumnSchemaMissing(error)) {
        return res.status(503).json(PRODUCT_ERRORS.schema_not_ready);
      }
      return res.status(403).json({ ok: false, error: "Could not list students" });
    }

    // Defense in depth: only Global students.
    const students = (data || []).filter((s) => s.product_id === productId);
    const ids = students.map((s) => s.id).filter(Boolean);
    const loginByStudentId = Object.create(null);
    const activeStudentIds = new Set();

    if (ids.length > 0) {
      const { data: activeCodes, error: codesErr } = await serviceClient
        .from("student_access_codes")
        .select("student_id,login_username,is_active,revoked_at,created_at")
        .in("student_id", ids)
        .eq("is_active", true)
        .is("revoked_at", null)
        .order("created_at", { ascending: false });

      if (codesErr) {
        return res.status(403).json({ ok: false, error: "Could not load student credentials" });
      }

      for (const row of activeCodes || []) {
        const sid = row.student_id;
        if (!sid || !ids.includes(sid)) continue;
        activeStudentIds.add(sid);
      }

      for (const row of activeCodes || []) {
        const sid = row.student_id;
        if (!sid || !ids.includes(sid)) continue;
        const u =
          typeof row.login_username === "string" && row.login_username.trim()
            ? row.login_username.trim()
            : null;
        if (!u) continue;
        if (loginByStudentId[sid] === undefined) {
          loginByStudentId[sid] = u;
        }
      }
      for (const sid of activeStudentIds) {
        if (loginByStudentId[sid] === undefined) {
          loginByStudentId[sid] = null;
        }
      }
    }

    const enriched = students.map((s) => {
      const login_username = loginByStudentId[s.id] ?? null;
      return {
        ...s,
        login_username,
        has_active_access_code: activeStudentIds.has(s.id),
      };
    });

    const limitResult = await resolveParentMaxChildren(
      ctx.serviceRole,
      ctx.parentUserId,
      ctx.user?.email
    );
    const studentLimit = limitResult.ok ? limitResult.maxChildren : DEFAULT_PARENT_STUDENT_LIMIT;

    return res.status(200).json({
      ok: true,
      students: enriched,
      studentLimit,
      defaultStudentLimit: DEFAULT_PARENT_STUDENT_LIMIT,
      productId,
    });
  } catch (_e) {
    return res.status(500).json({ ok: false, error: "Unexpected server error" });
  }
}
