import { copilotStaticMessage } from "../../lib/parent-copilot/copilot-static-message.js";
import { getLearningSupabaseBrowserClient } from "../learning-supabase/client.js";

/**
 * Same bearer resolution as parent report remote load (dashboard / teacher link).
 * @returns {Promise<string | null>}
 */
export async function resolveParentReportBearerToken() {
  if (typeof window === "undefined") return null;
  const supabase = getLearningSupabaseBrowserClient();
  const { data: sessData } = await supabase.auth.getSession();
  let token = sessData?.session?.access_token || null;
  if (!token && window.__parentReportPlaywrightE2eSession === true) {
    token = "playwright-e2e-parent-report";
  }
  return token;
}

/** @type {Record<string, string>} */
const CODE_MESSAGES_HE = {
  STUDENT_ID_REQUIRED:
    "We couldn't identify the child for this report question. Refresh the page and try again.",
  INVALID_REPORT_RANGE:
    "The report date range is invalid. Choose a period again and try again.",
  SERVER_SNAPSHOT_UNAVAILABLE:
    "Can't connect to the report Q&A service right now. The report itself is still available.",
  monthly_ai_limit_exceeded: "You've reached this month's question limit.",
  not_authenticated: copilotStaticMessage("copilot.answers.lib_parent-client_copilot-turn-api.please_sign_in_again_as_a_parent"),
  feature_not_enabled: "Report questions aren't available for this account right now.",
  parent_account_inactive:
    "The parent account is inactive. Contact support if this continues.",
  not_a_parent: "You don't have parent permission to ask about this report.",
  STUDENT_SESSION_MISMATCH:
    "The question must refer to the currently linked child. Refresh the page and try again.",
  STUDENT_NOT_FOUND: copilotStaticMessage("copilot.answers.lib_parent-client_copilot-turn-api.no_report_was_found_for_the_child_you_selected"),
  PARENT_OWNERSHIP_DENIED: "You don't have permission to ask about this report.",
};

/**
 * @param {{ ok?: boolean; error?: string; code?: string; errorCode?: string; message?: string }} payload
 * @param {number} status
 * @returns {string}
 */
export function mapParentCopilotTurnErrorHe(payload, status) {
  const code = String(payload?.code || payload?.errorCode || "").trim();
  const err = String(payload?.error || payload?.message || "").trim();

  if (code && CODE_MESSAGES_HE[code]) return CODE_MESSAGES_HE[code];
  if (err && CODE_MESSAGES_HE[err]) return CODE_MESSAGES_HE[err];

  if (status === 401) return CODE_MESSAGES_HE.not_authenticated;
  if (status === 400) {
    if (/studentId is required/i.test(err)) return CODE_MESSAGES_HE.STUDENT_ID_REQUIRED;
    if (/Invalid custom range/i.test(err)) return CODE_MESSAGES_HE.INVALID_REPORT_RANGE;
    if (/Missing payload/i.test(err)) return CODE_MESSAGES_HE.SERVER_SNAPSHOT_UNAVAILABLE;
  }
  if (status === 403) {
    if (/not allowed in unauthenticated dev/i.test(err)) return CODE_MESSAGES_HE.not_authenticated;
    if (/studentId must match/i.test(err)) {
      return CODE_MESSAGES_HE.STUDENT_SESSION_MISMATCH;
    }
    if (/Student not found/i.test(err)) return CODE_MESSAGES_HE.STUDENT_NOT_FOUND;
    if (/verify student ownership/i.test(err)) return CODE_MESSAGES_HE.PARENT_OWNERSHIP_DENIED;
    return CODE_MESSAGES_HE.PARENT_OWNERSHIP_DENIED;
  }
  if (status === 404) return CODE_MESSAGES_HE.STUDENT_NOT_FOUND;
  if (status === 422) return CODE_MESSAGES_HE.SERVER_SNAPSHOT_UNAVAILABLE;
  if (status === 429) return "Too many questions were asked. Wait a moment and try again.";

  if (err && !/[A-Za-z]{6,}/.test(err)) return err;

  return "Unable to answer the question right now. Please try again in a moment.";
}

/**
 * @param {Record<string, unknown>} body
 * @returns {Promise<unknown>}
 */
export async function postParentCopilotTurn(body) {
  const headers = { "Content-Type": "application/json" };
  const token = await resolveParentReportBearerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const r = await fetch("/api/parent/copilot-turn", {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await r.json();
  } catch {
    data = {};
  }

  if (!r.ok || !data.ok) {
    throw new Error(mapParentCopilotTurnErrorHe(data, r.status));
  }

  return data.result;
}
