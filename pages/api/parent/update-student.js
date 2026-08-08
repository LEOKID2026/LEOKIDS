import { requireParentApiContext } from "../../../lib/auth/persona-guard.server.js";
import {
  MAX_PARENT_GRADE_LEVEL_LEN,
  MAX_PARENT_STUDENT_NAME_LEN,
  parseBoundedTrimmedString,
  safeUuid,
  trimString,
} from "../../../lib/security/api-input.server.js";
import { getLearningSupabaseServiceRoleClient } from "../../../lib/learning-supabase/server";
import {
  callApplyParentStudentGradeChangeRpc,
  isSchemaNotReadyError,
} from "../../../lib/learning/subject-permissions/subject-access.server.js";
import { wrapMutatingApi } from "../../../lib/global/apply-write-barrier.js";

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

  const studentId = safeUuid(req.body?.studentId);
  const isActiveRaw = req.body?.isActive;

  if (!studentId) {
    return fail(res, 400, "student_id_required");
  }

  const patch = {};
  if (req.body?.fullName != null && String(req.body.fullName).trim() !== "") {
    const fullNameParsed = parseBoundedTrimmedString(req.body.fullName, MAX_PARENT_STUDENT_NAME_LEN);
    if (!fullNameParsed.ok) {
      return fail(res, 400, "full_name_too_long");
    }
    patch.full_name = fullNameParsed.value;
  }
  if (req.body?.gradeLevel != null && String(req.body.gradeLevel).trim() !== "") {
    const gradeParsed = parseBoundedTrimmedString(req.body.gradeLevel, MAX_PARENT_GRADE_LEVEL_LEN);
    if (!gradeParsed.ok) {
      return fail(res, 400, "grade_level_too_long");
    }
    patch.grade_level = gradeParsed.value;
  }
  if (typeof isActiveRaw === "boolean") patch.is_active = isActiveRaw;

  if (Object.keys(patch).length === 0) {
    return fail(res, 400, "no_fields_to_update");
  }

  try {
    const ctx = await requireParentApiContext(res, req.headers.authorization || "");
    if (ctx.stopped) return undefined;

    const { loadOwnedGlobalStudent } = await import("../../../lib/global/product-student.server.js");
    const owned = await loadOwnedGlobalStudent(ctx.serviceRole, {
      studentId,
      parentUserId: ctx.parentUserId,
      select: "id,grade_level,product_id,parent_id",
    });
    if (!owned.ok) {
      const code =
        (typeof owned.error === "string" && owned.error) || "update_student_failed";
      return res.status(owned.status || 403).json({
        ok: false,
        error: code,
        code,
        message: owned.message,
      });
    }
    const existing = owned.student;

    const gradeChanged =
      patch.grade_level != null && String(patch.grade_level) !== String(existing.grade_level || "");

    if (gradeChanged) {
      const supabase = getLearningSupabaseServiceRoleClient();
      const rpcResult = await callApplyParentStudentGradeChangeRpc(supabase, {
        parentId: ctx.parentUserId,
        changedBy: ctx.parentUserId,
        studentId,
        gradeLevel: patch.grade_level,
      });
      if (rpcResult.error && !isSchemaNotReadyError(rpcResult.error)) {
        return fail(res, 403, "update_student_grade_failed");
      }
      delete patch.grade_level;
    }

    if (Object.keys(patch).length === 0) {
      const { data, error } = await ctx.bearerSupabase
        .from("students")
        .select("id,full_name,grade_level,is_active,created_at")
        .eq("id", studentId)
        .single();
      if (error) return fail(res, 403, "update_student_failed");
      return res.status(200).json({ ok: true, student: data });
    }

    const { data, error } = await ctx.bearerSupabase
      .from("students")
      .update(patch)
      .eq("id", studentId)
      .eq("parent_id", ctx.parentUserId)
      .select("id,full_name,grade_level,is_active,created_at")
      .single();

    if (error) {
      return fail(res, 403, "update_student_failed");
    }

    return res.status(200).json({ ok: true, student: data });
  } catch (_e) {
    return fail(res, 500, "unexpected_server_error");
  }
}

export default wrapMutatingApi(handler);
