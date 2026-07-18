import { serializeLocaleCookie } from "../../../../lib/i18n/locale-cookie.js";
import { normalizeMembershipLocale } from "../../../../lib/global/product-membership.server.js";
import {
  getTeacherPortalServiceRole,
  loadTeacherProfileRow,
  rejectIfTeacherPortalDisabled,
  resolveAuthenticatedTeacherUserId,
  sendTeacherApiError,
} from "../../../../lib/teacher-server/teacher-session.server.js";

export default async function handler(req, res) {
  if (rejectIfTeacherPortalDisabled(res)) return undefined;

  const auth = await resolveAuthenticatedTeacherUserId(req.headers.authorization || "", req);
  if (!auth.ok) {
    return sendTeacherApiError(res, auth.status, auth.code, auth.message);
  }

  const serviceRole = getTeacherPortalServiceRole();

  if (req.method === "GET") {
    const profileResult = await loadTeacherProfileRow(serviceRole, auth.teacherUserId);
    if (!profileResult.ok) {
      return sendTeacherApiError(
        res,
        profileResult.status,
        profileResult.code,
        profileResult.code
      );
    }
    const preferredLanguage = normalizeMembershipLocale(
      profileResult.profile?.preferred_language,
      "en"
    );
    return res.status(200).json({ ok: true, preferredLanguage });
  }

  if (req.method === "PATCH") {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    if (body.preferredLanguage === undefined) {
      return sendTeacherApiError(res, 400, "validation_failed", "preferredLanguage is required");
    }
    const preferredLanguage = normalizeMembershipLocale(body.preferredLanguage);
    const { error } = await serviceRole
      .from("teacher_profiles")
      .update({ preferred_language: preferredLanguage })
      .eq("id", auth.teacherUserId);
    if (error) {
      return sendTeacherApiError(res, 500, "internal_error", "profile_update_failed");
    }
    res.setHeader("Set-Cookie", serializeLocaleCookie(preferredLanguage));
    return res.status(200).json({ ok: true, preferredLanguage });
  }

  res.setHeader("Allow", "GET, PATCH");
  return sendTeacherApiError(res, 405, "method_not_allowed", "Method not allowed");
}
