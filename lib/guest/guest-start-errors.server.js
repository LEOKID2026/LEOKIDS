import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
/**
 * Safe guest-start error classification and logging (no secrets in logs/responses).
 * @module lib/guest/guest-start-errors.server
 */

export const GUEST_START_ERROR_CODES = Object.freeze({
  MISSING_LEARNING_SUPABASE_CONFIG: "missing_learning_supabase_config",
  MISSING_STUDENT_ACCESS_SECRET: "missing_student_access_secret",
  GUEST_MODE_DISABLED: "guest_mode_disabled",
  GUEST_SYSTEM_PARENT_NOT_FOUND: "guest_system_parent_not_found",
  GUEST_START_FAILED: "guest_start_failed",
});

const PUBLIC_MESSAGE_KEYS = Object.freeze({
  [GUEST_START_ERROR_CODES.MISSING_LEARNING_SUPABASE_CONFIG]: "ui.guest.errors.serviceNotConfigured",
  [GUEST_START_ERROR_CODES.MISSING_STUDENT_ACCESS_SECRET]: "ui.guest.errors.serviceNotConfigured",
  [GUEST_START_ERROR_CODES.GUEST_MODE_DISABLED]: "ui.guest.errors.modeDisabled",
  [GUEST_START_ERROR_CODES.GUEST_SYSTEM_PARENT_NOT_FOUND]: "ui.guest.errors.systemNotReady",
  [GUEST_START_ERROR_CODES.GUEST_START_FAILED]: "ui.guest.errors.startFailed",
});

/** @deprecated Use messageKey at API boundary. Legacy English for tests/fixtures only. */
export const GUEST_START_LEGACY_PUBLIC_MESSAGES = Object.freeze({
  [GUEST_START_ERROR_CODES.MISSING_LEARNING_SUPABASE_CONFIG]: globalBurnDownCopy("lib__guest__guest-start-errors.server", "the_service_is_not_configured_correctly"),
  [GUEST_START_ERROR_CODES.MISSING_STUDENT_ACCESS_SECRET]: globalBurnDownCopy("lib__guest__guest-start-errors.server", "the_service_is_not_configured_correctly"),
  [GUEST_START_ERROR_CODES.GUEST_MODE_DISABLED]: globalBurnDownCopy("lib__guest__guest-start-errors.server", "guest_mode_is_currently_disabled"),
  [GUEST_START_ERROR_CODES.GUEST_SYSTEM_PARENT_NOT_FOUND]: globalBurnDownCopy("lib__guest__guest-start-errors.server", "the_guest_system_is_not_ready"),
  [GUEST_START_ERROR_CODES.GUEST_START_FAILED]: globalBurnDownCopy("lib__guest__guest-start-errors.server", "could_not_start_guest_mode"),
});

/**
 * @param {unknown} err
 * @returns {string}
 */
function errorMessage(err) {
  if (!err) return "";
  if (typeof err === "string") return err;
  return String(/** @type {{ message?: unknown }} */ (err).message || err);
}

/**
 * Classify a thrown error into a stable guest-start client payload.
 * Never includes stack traces or secret material.
 *
 * @param {unknown} err
 * @returns {{ status: number, code: string, messageKey: string }}
 */
export function classifyGuestStartThrownError(err) {
  const msg = errorMessage(err);
  const lower = msg.toLowerCase();

  if (
    msg.includes("NEXT_PUBLIC_LEARNING_SUPABASE_URL") ||
    msg.includes("NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY") ||
    msg.includes("LEARNING_SUPABASE_SERVICE_ROLE_KEY") ||
    lower.includes("missing next_public_learning_supabase") ||
    lower.includes("missing learning_supabase_service_role_key")
  ) {
    return {
      status: 500,
      code: GUEST_START_ERROR_CODES.MISSING_LEARNING_SUPABASE_CONFIG,
      messageKey: PUBLIC_MESSAGE_KEYS[GUEST_START_ERROR_CODES.MISSING_LEARNING_SUPABASE_CONFIG],
    };
  }

  if (
    msg.includes("LEARNING_STUDENT_ACCESS_SECRET") ||
    lower.includes("missing learning_student_access_secret")
  ) {
    return {
      status: 500,
      code: GUEST_START_ERROR_CODES.MISSING_STUDENT_ACCESS_SECRET,
      messageKey: PUBLIC_MESSAGE_KEYS[GUEST_START_ERROR_CODES.MISSING_STUDENT_ACCESS_SECRET],
    };
  }

  return {
    status: 500,
    code: GUEST_START_ERROR_CODES.GUEST_START_FAILED,
    messageKey: PUBLIC_MESSAGE_KEYS[GUEST_START_ERROR_CODES.GUEST_START_FAILED],
  };
}

/**
 * Map a controlled startGuestStudent failure to a stable client payload.
 *
 * @param {{ status?: number, code?: string, message?: string }} result
 * @returns {{ status: number, code: string, messageKey: string }}
 */
export function mapGuestStartResultError(result) {
  const code = String(result?.code || GUEST_START_ERROR_CODES.GUEST_START_FAILED);
  const status = Number(result?.status) || 500;

  if (code === GUEST_START_ERROR_CODES.GUEST_MODE_DISABLED) {
    return {
      status: status || 403,
      code,
      messageKey: PUBLIC_MESSAGE_KEYS[GUEST_START_ERROR_CODES.GUEST_MODE_DISABLED],
    };
  }
  if (code === GUEST_START_ERROR_CODES.GUEST_SYSTEM_PARENT_NOT_FOUND) {
    return {
      status: status || 503,
      code,
      messageKey: PUBLIC_MESSAGE_KEYS[GUEST_START_ERROR_CODES.GUEST_SYSTEM_PARENT_NOT_FOUND],
    };
  }
  if (code === "db_schema_not_ready") {
    return {
      status: status || 503,
      code,
      messageKey: PUBLIC_MESSAGE_KEYS[GUEST_START_ERROR_CODES.GUEST_SYSTEM_PARENT_NOT_FOUND],
    };
  }

  return {
    status,
    code: code || GUEST_START_ERROR_CODES.GUEST_START_FAILED,
    messageKey:
      PUBLIC_MESSAGE_KEYS[code] ||
      PUBLIC_MESSAGE_KEYS[GUEST_START_ERROR_CODES.GUEST_START_FAILED],
  };
}

/**
 * Safe server log — name/code/message/step only.
 * @param {unknown} err
 * @param {string} step
 */
export function safeLogGuestStartError(err, step) {
  const e = err && typeof err === "object" ? /** @type {{ name?: string, code?: unknown, message?: unknown }} */ (err) : null;
  console.error("[guest/start]", {
    step: String(step || "unknown"),
    name: e?.name || (err instanceof Error ? err.name : "Error"),
    code: e?.code != null ? String(e.code) : null,
    message: errorMessage(err).slice(0, 300),
  });
}
