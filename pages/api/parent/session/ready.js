import { safeApiLog } from "../../../../lib/security/safe-log.js";
import { getLearningSupabaseServerUserClient } from "../../../../lib/learning-supabase/server.js";
import { getLearningSupabaseServiceRoleClient } from "../../../../lib/learning-supabase/server.js";
import { finalizeParentSessionReady } from "../../../../lib/parent-server/parent-session-ready.server.js";
import { resolveInterfaceLocale } from "../../../../lib/i18n/locale-resolution.js";
import { serializeLocaleCookie } from "../../../../lib/i18n/locale-cookie.js";
import {
  gateMutatingApi,
} from "../../../../lib/global/apply-write-barrier.js";
import { respondGlobalWritesDisabled } from "../../../../lib/global/write-barrier.js";

function mockParentSessionReady(req, res) {
  const flow = String(req.body?.flow || "login").trim().toLowerCase();
  if (flow === "signup" || flow === "google") {
    return respondGlobalWritesDisabled(res);
  }
  return res.status(200).json({ ok: true, isNewSignup: false, mockMode: true });
}

function sessionReadyErrorPayload(result) {
  const errorCode = String(result?.error || "unknown").trim();
  /** @type {Record<string, { messageKey: string }>} */
  const byError = {
    not_authorized: { messageKey: "auth.google.parentOnly" },
    google_identity_required: { messageKey: "auth.google.identityRequired" },
    parent_profile_create_failed: { messageKey: "auth.errors.setupFailed" },
    membership_failed: { messageKey: "auth.errors.setupFailed" },
    policy_accept_failed: { messageKey: "auth.errors.setupFailed" },
    entitlement_provision_failed: { messageKey: "auth.errors.setupFailed" },
  };
  const mapped = byError[errorCode];
  return {
    errorCode,
    messageKey:
      typeof result?.messageKey === "string" && result.messageKey.trim()
        ? result.messageKey.trim()
        : mapped?.messageKey || "auth.google.signInIncomplete",
    parameters: {},
  };
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const bearer = typeof req.headers.authorization === "string" ? req.headers.authorization.trim() : "";
    if (!bearer.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, error: "Missing bearer token" });
    }

    const supabase = getLearningSupabaseServerUserClient(bearer);
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user?.id) {
      return res.status(401).json({ ok: false, error: "Invalid session" });
    }

    const flow = String(req.body?.flow || "login").trim().toLowerCase();
    const requireGoogle = flow === "google";
    const source =
      flow === "google" ? "parent_google_signup" : flow === "signup" ? "parent_signup" : "parent_login";
    const signupMethod =
      flow === "google" ? "google" : flow === "signup" ? "email" : null;

    const cookieHeader = typeof req.headers.cookie === "string" ? req.headers.cookie : undefined;
    const acceptLanguage =
      typeof req.headers["accept-language"] === "string" ? req.headers["accept-language"] : undefined;
    const initialInterfaceLanguage = resolveInterfaceLocale({
      asPath: req.url || "/",
      cookieHeader,
      acceptLanguage,
    });

    const result = await finalizeParentSessionReady(
      getLearningSupabaseServiceRoleClient(),
      userData.user,
      { source, signupMethod, requireGoogle, initialInterfaceLanguage }
    );

    if (!result.ok) {
      safeApiLog("parent_session_ready_failed", {
        flow,
        error: result.error,
        status: result.status,
      });
      return res.status(result.status || 500).json({
        ok: false,
        error: result.error,
        ...sessionReadyErrorPayload(result),
      });
    }

    safeApiLog("parent_session_ready_ok", {
      flow,
      parentUserId: result.parentUserId,
      isNewSignup: Boolean(result.isNewSignup),
    });

    if (result.interfaceLanguage) {
      res.setHeader("Set-Cookie", serializeLocaleCookie(result.interfaceLanguage));
    }

    return res.status(200).json({
      ok: true,
      isNewSignup: Boolean(result.isNewSignup),
      interfaceLanguage: result.interfaceLanguage || "en",
      preferredReportLanguage: result.preferredReportLanguage || result.interfaceLanguage || "en",
    });
  } catch (_e) {
    safeApiLog("parent_session_ready_error", { route: "session/ready" });
    return res.status(500).json({ ok: false, error: "Unexpected server error" });
  }
}

export default gateMutatingApi(handler, { onMock: mockParentSessionReady });
