import { getLearningSupabaseServiceRoleClient } from "../../../lib/learning-supabase/server";
import {
  clearStudentSessionCookie,
  getStudentSessionCookie,
  hashStudentSecret,
} from "../../../lib/learning-supabase/student-auth";
import { guardCookieMutationOrigin } from "../../../lib/security/api-guards.js";
import { LOCALE_COOKIE_NAME } from "../../../lib/i18n/locale-registry.js";
import { LOCALE_COOKIE_PATH } from "../../../lib/i18n/locale-cookie.js";

/**
 * @param {import("http").ServerResponse} res
 * @param {string} cookie
 */
function appendSetCookie(res, cookie) {
  const prev = res.getHeader("Set-Cookie");
  if (!prev) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }
  if (Array.isArray(prev)) {
    res.setHeader("Set-Cookie", [...prev, cookie]);
    return;
  }
  res.setHeader("Set-Cookie", [String(prev), cookie]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (guardCookieMutationOrigin(req, res)) return;

  const token = getStudentSessionCookie(req);
  clearStudentSessionCookie(res);
  // Drop browser locale so the next student on this device does not inherit
  // this account's last explicit choice. Re-login restores from client_meta.
  appendSetCookie(
    res,
    `${LOCALE_COOKIE_NAME}=; Path=${LOCALE_COOKIE_PATH}; Max-Age=0; SameSite=Lax`
  );

  if (!token) {
    return res.status(200).json({ ok: true });
  }

  try {
    const supabase = getLearningSupabaseServiceRoleClient();
    const tokenHash = hashStudentSecret(token);
    const nowIso = new Date().toISOString();

    await supabase
      .from("student_sessions")
      .update({
        revoked_at: nowIso,
        ended_at: nowIso,
      })
      .eq("session_token_hash", tokenHash)
      .is("ended_at", null);

    return res.status(200).json({ ok: true });
  } catch (_e) {
    return res.status(200).json({ ok: true });
  }
}

