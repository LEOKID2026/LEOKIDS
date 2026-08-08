import { getLearningSupabaseServiceRoleClient } from "../../../../../lib/learning-supabase/server";
import { requireParentApiContext } from "../../../../../lib/auth/persona-guard.server.js";
import { safeString } from "../../../../../lib/parent-server/report-data-aggregate.server.js";
import {
  callEnableAllParentStudentSubjectsRpc,
  callEnsureParentStudentLearningPermissionsRpc,
  callSetParentStudentGradePickerRpc,
  callSetParentStudentSubjectPermissionRpc,
  computeSubjectPermissionsPayload,
  isSchemaNotReadyError,
} from "../../../../../lib/learning/subject-permissions/subject-access.server.js";
import { isSubjectPermissionKey } from "../../../../../lib/learning/subject-permissions/subject-key-map.js";
import { getSubjectPermissionLabelHe } from "../../../../../lib/learning/subject-permissions/subject-permission-labels.js";

/**
 * @param {import("next").NextApiResponse} res
 * @param {number} status
 * @param {string} code
 */
function fail(res, status, code) {
  return res.status(status).json({ ok: false, error: code, code });
}

/**
 * @param {unknown} error
 * @returns {{ status: number, code: string }}
 */
function mapRpcError(error) {
  if (isSchemaNotReadyError(error)) {
    return { status: 503, code: "db_schema_not_ready" };
  }
  const message = String(error?.message || "");
  if (message.includes("SUBJECT_PERM_PARENT_MISMATCH")) {
    return { status: 404, code: "student_not_linked" };
  }
  if (
    message.includes("SUBJECT_PERM_CATALOG_INCOMPLETE") ||
    message.includes("SUBJECT_CATALOG_GRADE_INCOMPLETE")
  ) {
    return { status: 500, code: "subject_catalog_incomplete" };
  }
  return { status: 500, code: "unexpected_server_error" };
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || "";
  const studentId = safeString(req.query?.studentId, 64);
  if (!studentId) {
    return fail(res, 400, "student_id_required");
  }

  try {
    const ctx = await requireParentApiContext(res, authHeader);
    if (ctx.stopped) return undefined;

    const { loadOwnedGlobalStudent } = await import("../../../../../lib/global/product-student.server.js");
    const owned = await loadOwnedGlobalStudent(ctx.serviceRole, {
      studentId,
      parentUserId: ctx.parentUserId,
      select: "id,grade_level,account_kind,product_id,parent_id",
    });
    if (!owned.ok) {
      const code =
        (typeof owned.error === "string" && owned.error) || "student_not_found";
      return res.status(owned.status || 404).json({
        ok: false,
        error: code,
        code,
        message: owned.message,
      });
    }
    const student = owned.student;

    const supabase = getLearningSupabaseServiceRoleClient();

    if (req.method === "GET") {
      const ensure = await callEnsureParentStudentLearningPermissionsRpc(supabase, {
        parentId: ctx.parentUserId,
        changedBy: ctx.parentUserId,
        studentId,
      });
      if (ensure.error) {
        const mapped = mapRpcError(ensure.error);
        return fail(res, mapped.status, mapped.code);
      }

      const payload = await computeSubjectPermissionsPayload(
        supabase,
        studentId,
        student.grade_level
      );

      const subjects = Object.entries(payload.subjectPermissions)
        .map(([subjectKey, row]) => ({
          subjectKey,
          label: getSubjectPermissionLabelHe(subjectKey),
          isEnabled: row.isEnabled,
          isGradeSuitable: row.isGradeSuitable,
          effectiveGrade: row.effectiveGrade,
        }))
        .sort((a, b) => a.subjectKey.localeCompare(b.subjectKey));

      return res.status(200).json({
        ok: true,
        allowStudentGradePicker: payload.allowStudentGradePicker,
        subjects,
      });
    }

    if (req.method === "PATCH") {
      const body = req.body || {};

      if (body.enableAll === true) {
        const { error } = await callEnableAllParentStudentSubjectsRpc(supabase, {
          parentId: ctx.parentUserId,
          changedBy: ctx.parentUserId,
          studentId,
        });
        if (error) {
          const mapped = mapRpcError(error);
          return fail(res, mapped.status, mapped.code);
        }
      } else if (typeof body.allowStudentGradePicker === "boolean") {
        const { error } = await callSetParentStudentGradePickerRpc(supabase, {
          parentId: ctx.parentUserId,
          changedBy: ctx.parentUserId,
          studentId,
          allowStudentGradePicker: body.allowStudentGradePicker,
        });
        if (error) {
          const mapped = mapRpcError(error);
          return fail(res, mapped.status, mapped.code);
        }
      } else if (body.subjectKey != null && typeof body.isEnabled === "boolean") {
        const subjectKey = String(body.subjectKey).trim();
        if (!isSubjectPermissionKey(subjectKey)) {
          return fail(res, 400, "invalid_subject");
        }
        const { error } = await callSetParentStudentSubjectPermissionRpc(supabase, {
          parentId: ctx.parentUserId,
          changedBy: ctx.parentUserId,
          studentId,
          subjectKey,
          isEnabled: body.isEnabled,
        });
        if (error) {
          const mapped = mapRpcError(error);
          return fail(res, mapped.status, mapped.code);
        }
      } else {
        return fail(res, 400, "no_valid_fields");
      }

      const { data: refreshedStudent } = await supabase
        .from("students")
        .select("grade_level")
        .eq("id", studentId)
        .maybeSingle();

      const payload = await computeSubjectPermissionsPayload(
        supabase,
        studentId,
        refreshedStudent?.grade_level || student.grade_level
      );
      const subjects = Object.entries(payload.subjectPermissions).map(([subjectKey, row]) => ({
        subjectKey,
        label: getSubjectPermissionLabelHe(subjectKey),
        isEnabled: row.isEnabled,
        isGradeSuitable: row.isGradeSuitable,
        effectiveGrade: row.effectiveGrade,
      }));

      return res.status(200).json({
        ok: true,
        allowStudentGradePicker: payload.allowStudentGradePicker,
        subjects,
      });
    }

    return fail(res, 405, "method_not_allowed");
  } catch (err) {
    console.error("[parent/subject-permissions]", err);
    return fail(res, 500, "unexpected_server_error");
  }
}
