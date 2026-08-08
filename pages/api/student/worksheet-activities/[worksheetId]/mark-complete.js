import { getLearningSupabaseServiceRoleClient } from "../../../../../lib/learning-supabase/server";
import {
  clearStudentSessionCookie,
  getAuthenticatedStudentSession,
} from "../../../../../lib/learning-supabase/student-auth";
import { guardCookieMutationOrigin } from "../../../../../lib/security/api-guards.js";
import { markStudentWorksheetComplete } from "../../../../../lib/worksheet-activities/worksheet-student.server.js";

export default async function handler(req, res) {
  const worksheetId = String(req.query?.worksheetId || "").trim();

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed", code: "method_not_allowed" });
  }

  if (guardCookieMutationOrigin(req, res)) return undefined;

  try {
    const auth = await getAuthenticatedStudentSession(req);
    if (!auth) {
      clearStudentSessionCookie(res);
      return res.status(401).json({ ok: false, error: "not_authenticated", code: "not_authenticated" });
    }

    const supabase = getLearningSupabaseServiceRoleClient();
    const result = await markStudentWorksheetComplete(supabase, auth.studentId, worksheetId);

    if (!result.ok) {
      return res.status(result.status || 500).json({ ok: false, error: result.code, code: result.code });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error", code: "server_error" });
  }
}
