import { getLearningSupabaseServiceRoleClient } from "../learning-supabase/server.js";
import { guardCookieMutationOrigin } from "../security/api-guards.js";
import {
  setStudentSessionCookie,
  clearStudentSessionCookie,
} from "../learning-supabase/student-auth.js";
import { startGuestStudent } from "./guest-student.server.js";
import { LIOSH_GUEST_RESUME_TOKEN_KEY } from "./constants.js";
import {
  rejectIfGuestStartRateLimited,
  rejectIfGuestStartDeviceRateLimited,
} from "./guest-start-rate-limit.server.js";
import {
  classifyGuestStartThrownError,
  mapGuestStartResultError,
  safeLogGuestStartError,
} from "./guest-start-errors.server.js";

/**
 * @typedef {Object} GuestStartHandlerDeps
 * @property {typeof getLearningSupabaseServiceRoleClient} [getLearningSupabaseServiceRoleClient]
 * @property {typeof startGuestStudent} [startGuestStudent]
 * @property {typeof setStudentSessionCookie} [setStudentSessionCookie]
 * @property {typeof clearStudentSessionCookie} [clearStudentSessionCookie]
 */

/**
 * @param {GuestStartHandlerDeps} [deps]
 */
export function createGuestStartHandler(deps = {}) {
  const getClient =
    deps.getLearningSupabaseServiceRoleClient || getLearningSupabaseServiceRoleClient;
  const startGuest = deps.startGuestStudent || startGuestStudent;
  const setCookie = deps.setStudentSessionCookie || setStudentSessionCookie;
  const clearCookie = deps.clearStudentSessionCookie || clearStudentSessionCookie;

  return async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    if (guardCookieMutationOrigin(req, res)) return;

    res.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    /** @type {string} */
    let step = "init";

    try {
      step = "supabase_client";
      const supabase = getClient();

      const resumeToken = String(req.body?.resumeToken || "").trim() || null;

      step = "rate_limit";
      if (rejectIfGuestStartRateLimited(req, res, resumeToken)) return;
      if (rejectIfGuestStartDeviceRateLimited(req, res, resumeToken)) return;

      step = "start_guest_student";
      const result = await startGuest(supabase, { resumeToken });

      if (!result.ok) {
        const mapped = mapGuestStartResultError(result);
        safeLogGuestStartError(
          { name: "GuestStartResultError", code: mapped.code, message: mapped.error },
          step
        );
        clearCookie(res);
        return res.status(mapped.status).json({
          ok: false,
          error: mapped.error,
          code: mapped.code,
        });
      }

      step = "set_session_cookie";
      setCookie(res, result.sessionToken);

      return res.status(200).json({
        ok: true,
        student: result.student,
        leoNumber: result.leoNumber ?? result.student?.leo_number ?? null,
        resumeToken: result.resumeToken,
        resumeTokenStorageKey: LIOSH_GUEST_RESUME_TOKEN_KEY,
      });
    } catch (err) {
      safeLogGuestStartError(err, step);
      clearCookie(res);
      const mapped = classifyGuestStartThrownError(err);
      return res.status(mapped.status).json({
        ok: false,
        error: mapped.error,
        code: mapped.code,
      });
    }
  };
}
