import {
  normalizeStudentUsername,
  hashStudentSecret,
  normalizeStudentPin,
} from "../../../lib/learning-supabase/student-auth";
import { isStudentIdentityDebugEnabled } from "../../../lib/student-identity-debug-flag";
import { getLearningSupabaseServiceRoleClient } from "../../../lib/learning-supabase/server";
import { requireParentApiContext } from "../../../lib/auth/persona-guard.server.js";
import { safeApiLog } from "../../../lib/security/safe-log.js";
import { safeUuid } from "../../../lib/security/api-input.server.js";
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
  const usernameRaw = String(req.body?.username || "");
  const pinRaw = String(req.body?.pin || "");
  if (!studentId) {
    return fail(res, 400, "student_id_required");
  }

  try {
    const username = normalizeStudentUsername(usernameRaw);
    if (!/^[a-z0-9_-]{3,24}$/.test(username)) {
      return fail(res, 400, "invalid_username");
    }
    const pin = normalizeStudentPin(pinRaw);
    if (!/^\d{4}$/.test(pin)) {
      return fail(res, 400, "invalid_pin");
    }

    const ctx = await requireParentApiContext(res, req.headers.authorization || "");
    if (ctx.stopped) return undefined;

    const serviceRole = getLearningSupabaseServiceRoleClient();
    const { loadOwnedGlobalStudent } = await import("../../../lib/global/product-student.server.js");
    const owned = await loadOwnedGlobalStudent(serviceRole, {
      studentId,
      parentUserId: ctx.parentUserId,
      select: "id,parent_id,is_active,product_id",
    });
    if (!owned.ok) {
      const code =
        (typeof owned.error === "string" && owned.error) || "student_not_found";
      return res.status(owned.status || 403).json({
        ok: false,
        error: code,
        code,
        message: owned.message,
      });
    }
    const student = owned.student;
    if (student.is_active !== true) {
      return fail(res, 403, "student_inactive");
    }

    const codeHash = hashStudentSecret(username);
    const pinHash = hashStudentSecret(pin);

    const { data: conflict, error: conflictErr } = await serviceRole
      .from("student_access_codes")
      .select("id,student_id")
      .eq("code_hash", codeHash)
      .eq("is_active", true)
      .is("revoked_at", null)
      .neq("student_id", studentId)
      .limit(1)
      .maybeSingle();
    if (conflictErr) {
      return fail(res, 500, "username_check_failed");
    }
    if (conflict?.id) {
      return fail(res, 409, "username_taken");
    }

    // Mutations run with service role after explicit ownership checks above.
    // Revoke every non-revoked row for this student (handles duplicate-active rows and RLS edge cases).
    const nowIso = new Date().toISOString();
    const { error: revokeErr } = await serviceRole
      .from("student_access_codes")
      .update({
        is_active: false,
        revoked_at: nowIso,
      })
      .eq("student_id", studentId)
      .is("revoked_at", null);
    if (revokeErr) {
      return fail(res, 500, "access_code_revoke_failed");
    }

    const { getServerProductId } = await import("../../../lib/global/product-context.server.js");
    const productId = getServerProductId();
    let insErr = (
      await serviceRole.from("student_access_codes").insert({
        student_id: studentId,
        code_hash: codeHash,
        pin_hash: pinHash,
        login_username: username,
        product_id: productId,
        is_active: true,
        expires_at: null,
        revoked_at: null,
      })
    ).error;

    // Optional denormalized product_id — fall back if column not yet applied.
    if (insErr) {
      const msg = String(insErr.message || "").toLowerCase();
      if (msg.includes("product_id") || insErr.code === "42703" || insErr.code === "PGRST204") {
        insErr = (
          await serviceRole.from("student_access_codes").insert({
            student_id: studentId,
            code_hash: codeHash,
            pin_hash: pinHash,
            login_username: username,
            is_active: true,
            expires_at: null,
            revoked_at: null,
          })
        ).error;
      }
    }
    if (insErr) {
      return fail(res, 500, "access_code_create_failed");
    }

    if (isStudentIdentityDebugEnabled()) {
      safeApiLog("[create-student-access-code] saved credential", {
        studentId,
      });
    }

    return res.status(200).json({
      ok: true,
      username,
    });
  } catch (_e) {
    return fail(res, 500, "unexpected_server_error");
  }
}

export default wrapMutatingApi(handler);
