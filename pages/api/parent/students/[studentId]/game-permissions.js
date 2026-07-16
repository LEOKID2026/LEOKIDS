import { getLearningSupabaseServiceRoleClient } from "../../../../../lib/learning-supabase/server";
import { requireParentApiContext } from "../../../../../lib/auth/persona-guard.server.js";
import { safeString } from "../../../../../lib/parent-server/report-data-aggregate.server.js";
import {
  getStudentGamePermissions,
  upsertStudentGamePermissions,
} from "../../../../../lib/games/server/game-access.server.js";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || "";
  const studentId = safeString(req.query?.studentId, 64);
  if (!studentId) {
    return res.status(400).json({ ok: false, error: "studentId is required" });
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
      return res.status(owned.status || 404).json({
        ok: false,
        error: owned.error || "Student not found for this parent",
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
        return res.status(400).json({ ok: false, error: "No valid fields to update" });
      }

      const permissions = await upsertStudentGamePermissions({
        supabase,
        studentId,
        parentId: ctx.parentUserId,
        patch,
      });
      return res.status(200).json({ ok: true, permissions });
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (err) {
    console.error("[parent/game-permissions]", err);
    return res.status(500).json({ ok: false, error: "Unexpected server error" });
  }
}
