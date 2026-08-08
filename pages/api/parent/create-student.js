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

/**
 * @param {import("next").NextApiResponse} res
 * @param {number} status
 * @param {string} code
 */
function fail(res, status, code) {
  return res.status(status).json({ ok: false, error: code, code });
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return fail(res, 405, "method_not_allowed");
  }

  const fullNameParsed = parseBoundedTrimmedString(req.body?.fullName, MAX_PARENT_STUDENT_NAME_LEN);
  if (!fullNameParsed.ok) {
    return fail(res, 400, "full_name_too_long");
  }
  if (!fullNameParsed.value) {
    return fail(res, 400, "full_name_required");
  }
  const fullName = fullNameParsed.value;

  if (req.body?.gradeLevel != null && String(req.body.gradeLevel).trim() !== "") {
    const gradeParsed = parseBoundedTrimmedString(req.body.gradeLevel, MAX_PARENT_GRADE_LEVEL_LEN);
    if (!gradeParsed.ok) {
      return fail(res, 400, "grade_level_too_long");
    }
  }
  const gradeLevel = trimString(req.body?.gradeLevel);
  if (!gradeLevel) {
    return fail(res, 400, "grade_required");
  }

  // Never accept client product_id.
  void req.body?.productId;
  void req.body?.product_id;

  try {
    const ctx = await requireParentApiContext(res, req.headers.authorization || "");
    if (ctx.stopped) return undefined;

    const productId = getServerProductId();
    const membership = await ensureGlobalProductMembership(ctx.serviceRole, ctx.parentUserId, {
      preserveExistingLanguages: true,
    });
    if (!membership.ok) {
      const code =
        (typeof membership.error === "string" && membership.error) || "product_membership_required";
      return res.status(membership.status || 503).json({
        ok: false,
        error: code,
        code,
        message: membership.message || PRODUCT_ERRORS.membership_required.message,
      });
    }

    const limitResult = await resolveParentMaxChildren(
      ctx.serviceRole,
      ctx.parentUserId,
      ctx.user?.email
    );
    if (!limitResult.ok) {
      return fail(res, limitResult.status, limitResult.code || "validation_failed");
    }

    const countResult = await countGlobalParentStudents(ctx.serviceRole, ctx.parentUserId);
    if (!countResult.ok) {
      const code =
        (typeof countResult.error === "string" && countResult.error) || "student_count_failed";
      return res.status(countResult.status || 403).json({
        ok: false,
        error: code,
        code,
        message: countResult.message,
      });
    }
    if (countResult.count >= limitResult.maxChildren) {
      return fail(res, 400, "child_limit_reached");
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
          return fail(res, 403, "create_student_failed");
        }
        if (data?.product_id !== productId) {
          return fail(res, 500, "student_product_mismatch");
        }
        return res.status(200).json({ ok: true, student: data, productId });
      }
      return fail(res, 403, "create_student_failed");
    }

    const studentId =
      rpcResult.data?.student?.id || rpcResult.data?.student_id || rpcResult.data?.studentId;
    if (!studentId) {
      return fail(res, 500, "create_student_failed");
    }

    const { data, error } = await supabase
      .from("students")
      .select("id,full_name,grade_level,is_active,created_at,product_id")
      .eq("id", studentId)
      .eq("parent_id", ctx.parentUserId)
      .eq("product_id", productId)
      .single();

    if (error || !data) {
      return fail(res, 500, "load_created_student_failed");
    }

    return res.status(200).json({ ok: true, student: data, productId });
  } catch (_e) {
    return fail(res, 500, "unexpected_server_error");
  }
}

export default wrapMutatingApi(handler);
