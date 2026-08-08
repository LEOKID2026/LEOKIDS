import { serializeLocaleCookie } from "../../../../lib/i18n/locale-cookie.js";
import { normalizeMembershipLocale } from "../../../../lib/global/product-membership.server.js";
import {
  clearStudentSessionCookie,
  getAuthenticatedStudentSession,
} from "../../../../lib/learning-supabase/student-auth";
import { getLearningSupabaseServiceRoleClient } from "../../../../lib/learning-supabase/server";
import {
  readInterfaceLocaleFromClientMeta,
  withInterfaceLocaleInClientMeta,
} from "../../../../lib/student-server/student-session-locale.server.js";
import { gateMutatingApi } from "../../../../lib/global/apply-write-barrier.js";

async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const auth = await getAuthenticatedStudentSession(req);
  if (!auth) {
    clearStudentSessionCookie(res);
    return res.status(401).json({ ok: false, error: "Student session expired" });
  }

  if (req.method === "GET") {
    const interfaceLanguage = readInterfaceLocaleFromClientMeta(auth.session?.client_meta);
    return res.status(200).json({
      ok: true,
      interfaceLanguage,
    });
  }

  if (req.method === "PATCH") {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    if (body.interfaceLanguage === undefined) {
      return res.status(400).json({ ok: false, error: "interfaceLanguage is required" });
    }
    const interfaceLanguage = normalizeMembershipLocale(body.interfaceLanguage);
    const nextMeta = withInterfaceLocaleInClientMeta(auth.session?.client_meta, interfaceLanguage);
    const supabase = getLearningSupabaseServiceRoleClient();
    const { error } = await supabase
      .from("student_sessions")
      .update({ client_meta: nextMeta })
      .eq("id", auth.studentSessionId);
    if (error) {
      return res.status(500).json({ ok: false, error: "session_update_failed" });
    }
    res.setHeader("Set-Cookie", serializeLocaleCookie(interfaceLanguage));
    return res.status(200).json({ ok: true, interfaceLanguage });
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}

export default gateMutatingApi(handler, {
  onMock: (req, res) => {
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, interfaceLanguage: "en", mockMode: true });
    }
    if (req.method === "PATCH") {
      const interfaceLanguage = normalizeMembershipLocale(req.body?.interfaceLanguage, "en");
      res.setHeader("Set-Cookie", serializeLocaleCookie(interfaceLanguage));
      return res.status(200).json({ ok: true, interfaceLanguage, mockMode: true });
    }
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  },
});
