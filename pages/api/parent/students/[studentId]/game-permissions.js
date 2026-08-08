import { getLearningSupabaseServiceRoleClient } from "../../../../../lib/learning-supabase/server";
import { requireParentApiContext } from "../../../../../lib/auth/persona-guard.server.js";
import { safeString } from "../../../../../lib/parent-server/report-data-aggregate.server.js";
import {
  getStudentGamePermissions,
  upsertStudentGamePermissions,
} from "../../../../../lib/games/server/game-access.server.js";

/**
 * @param {import("next").NextApiResponse} res
 * @param {number} status
 * @param {string} code
 */
function fail(res, status, code) {
  return res.status(status).json({ ok: false, error: code, code });
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
      select: "id,product_id,parent_id",
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

    const supabase = getLearningSupabaseServiceRoleClient();

    if (req.method === "GET") {
      const permissions = await getStudentGamePermissions(supabase, studentId);
      return res.status(200).json({ ok: true, permissions });
    }

    if (req.method === "PATCH") {
      const { onlineEnabled, offlineEnabled, soloEnabled } = req.body || {};
      const patch = {};
      if (typeof onlineEnabled === "boolean") patch.onlineEnabled = onlineEnabled;
      if (typeof offlineEnabled === "boolean") patch.offlineEnabled = offlineEnabled;
      if (typeof soloEnabled === "boolean") patch.soloEnabled = soloEnabled;

      if (Object.keys(patch).length === 0) {
        return fail(res, 400, "no_valid_fields");
      }

      const permissions = await upsertStudentGamePermissions({
        supabase,
        studentId,
        parentId: ctx.parentUserId,
        patch,
      });
      return res.status(200).json({ ok: true, permissions });
    }

    return fail(res, 405, "method_not_allowed");
  } catch (err) {
    console.error("[parent/game-permissions]", err);
    return fail(res, 500, "unexpected_server_error");
  }
}
