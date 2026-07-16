import { requireParentApiContext } from "../../../lib/auth/persona-guard.server.js";
import { resolveParentMaxChildren } from "../../../lib/parent-server/parent-entitlement-provision.server.js";
import {
  MAX_PARENT_GRADE_LEVEL_LEN,
  MAX_PARENT_STUDENT_NAME_LEN,
  parseBoundedTrimmedString,
  trimString,
} from "../../../lib/security/api-input.server.js";
import { getLearningSupabaseServiceRoleClient } from "../../../lib/learning-supabase/server";
import {
  callCreateParentStudentWithDefaultsRpc,
  isSchemaNotReadyError,
} from "../../../lib/learning/subject-permissions/subject-access.server.js";
import { wrapMutatingApi } from "../../../lib/global/apply-write-barrier.js";
import { getServerProductId, PRODUCT_ERRORS } from "../../../lib/global/product-context.server.js";
import { ensureGlobalProductMembership } from "../../../lib/global/product-membership.server.js";
import { countGlobalParentStudents } from "../../../lib/global/product-student.server.js";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const fullNameParsed = parseBoundedTrimmedString(req.body?.fullName, MAX_PARENT_STUDENT_NAME_LEN);
  if (!fullNameParsed.ok) {
    return res.status(400).json({ ok: false, error: "fullName too long" });
  }
  if (!fullNameParsed.value) {
    return res.status(400).json({ ok: false, error: "fullName is required" });
  }
  const fullName = fullNameParsed.value;

  if (req.body?.gradeLevel != null && String(req.body.gradeLevel).trim() !== "") {
    const gradeParsed = parseBoundedTrimmedString(req.body.gradeLevel, MAX_PARENT_GRADE_LEVEL_LEN);
    if (!gradeParsed.ok) {
      return res.status(400).json({ ok: false, error: "gradeLevel too long" });
    }
  }
  const gradeLevel = trimString(req.body?.gradeLevel);
  if (!gradeLevel) {
    return res.status(400).json({
      ok: false,
      code: "grade_required",
      error: "Please select a grade",
    });
  }

  // Never accept client product_id.
  void req.body?.productId;
  void req.body?.product_id;

  try {
    const ctx = await requireParentApiContext(res, req.headers.authorization || "");
    if (ctx.stopped) return undefined;

    const productId = getServerProductId();
    const membership = await ensureGlobalProductMembership(ctx.serviceRole, ctx.parentUserId, {
      interfaceLanguage: "en",
      preferredReportLanguage: "en",
    });
    if (!membership.ok) {
      return res.status(membership.status || 503).json({
        ok: false,
        error: membership.error || PRODUCT_ERRORS.membership_required.error,
        message: membership.message || PRODUCT_ERRORS.membership_required.message,
      });
    }

    const limitResult = await resolveParentMaxChildren(
      ctx.serviceRole,
      ctx.parentUserId,
      ctx.user?.email
    );
    if (!limitResult.ok) {
      return res.status(limitResult.status).json({ ok: false, error: limitResult.code });
    }

    const countResult = await countGlobalParentStudents(ctx.serviceRole, ctx.parentUserId);
    if (!countResult.ok) {
      return res.status(countResult.status || 403).json({
        ok: false,
        error: countResult.error || "Could not check child count",
        message: countResult.message,
      });
    }
    if (countResult.count >= limitResult.maxChildren) {
      return res.status(400).json({
        ok: false,
        error: "You can add up to 3 children on this parent account",
      });
    }

    const supabase = getLearningSupabaseServiceRoleClient();
    const rpcResult = await callCreateParentStudentWithDefaultsRpc(supabase, {
      parentId: ctx.parentUserId,
      changedBy: ctx.parentUserId,
      fullName,
      gradeLevel,
      productId,
    });

    if (rpcResult.error) {
      // Prefer Global product RPC; then legacy RPC only if schema is not ready for product.
      const tryLegacy =
        isSchemaNotReadyError(rpcResult.error) ||
        String(rpcResult.error.message || "").includes("product");

      if (tryLegacy) {
        // Direct insert with product_id — no path creates a student without product_id.
        const payload = {
          parent_id: ctx.parentUserId,
          full_name: fullName,
          grade_level: gradeLevel,
          product_id: productId,
        };
        const { data, error } = await supabase
          .from("students")
          .insert(payload)
          .select("id,full_name,grade_level,is_active,created_at,product_id")
          .single();
        if (error) {
          if (String(error.message || "").toLowerCase().includes("product_id")) {
            return res.status(503).json(PRODUCT_ERRORS.schema_not_ready);
          }
          return res.status(403).json({ ok: false, error: "Could not create student" });
        }
        if (data?.product_id !== productId) {
          return res.status(500).json({ ok: false, error: "student_product_mismatch" });
        }
        return res.status(200).json({ ok: true, student: data, productId });
      }
      return res.status(403).json({ ok: false, error: "Could not create student" });
    }

    const studentId =
      rpcResult.data?.student?.id || rpcResult.data?.student_id || rpcResult.data?.studentId;
    if (!studentId) {
      return res.status(500).json({ ok: false, error: "Could not create student" });
    }

    const { data, error } = await supabase
      .from("students")
      .select("id,full_name,grade_level,is_active,created_at,product_id")
      .eq("id", studentId)
      .eq("parent_id", ctx.parentUserId)
      .eq("product_id", productId)
      .single();

    if (error || !data) {
      return res.status(500).json({ ok: false, error: "Could not load created student" });
    }

    return res.status(200).json({ ok: true, student: data, productId });
  } catch (_e) {
    return res.status(500).json({ ok: false, error: "Unexpected server error" });
  }
}

export default wrapMutatingApi(handler);
