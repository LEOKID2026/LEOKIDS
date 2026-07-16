import { requireParentApiContext } from "../../../lib/auth/persona-guard.server.js";
import { deleteParentOwnedStudent } from "../../../lib/parent-server/delete-parent-owned-student.server.js";
import { safeApiLog } from "../../../lib/security/safe-log.js";
import { wrapMutatingApi } from "../../../lib/global/apply-write-barrier.js";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed", errorCode: "method_not_allowed" });
  }

  const studentId = String(req.body?.studentId || "").trim();
  if (!studentId) {
    return res.status(400).json({
      ok: false,
      error: "Child ID is missing",
      errorCode: "student_id_required",
    });
  }

  try {
    const ctx = await requireParentApiContext(res, req.headers.authorization || "");
    if (ctx.stopped) return undefined;

    const result = await deleteParentOwnedStudent(ctx.serviceRole, ctx.parentUserId, studentId);
    if (!result.ok) {
      safeApiLog("delete_student_failed", {
        parentUserId: ctx.parentUserId,
        studentId,
        code: result.code,
        step: result.step || null,
      });
      return res.status(result.status).json({
        ok: false,
        error: result.error,
        errorCode: result.code,
        step: result.step || null,
        detail: result.detail || null,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[delete-student] unexpected error", error);
    return res.status(500).json({
      ok: false,
      error: "Server error — please try again",
      errorCode: "internal_error",
    });
  }
}

export default wrapMutatingApi(handler);
