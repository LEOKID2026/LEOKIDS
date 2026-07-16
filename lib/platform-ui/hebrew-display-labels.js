/**
 * Central display labels for school / admin / teacher / student management UI.
 * Internal keys stay English in code — browser-visible text uses these helpers.
 * Global product: English only (no Hebrew fallback).
 */

export const SUBJECT_ORDER = [
  "math",
  "geometry",
  "english",
  "hebrew",
  "science",
  "moledet_geography",
  "history",
];

/** @type {Record<string, string>} */
export const SUBJECT_LABEL_HE = {
  math: "Math",
  geometry: "Geometry",
  english: "English",
  hebrew: "Hebrew",
  science: "Science",
  moledet: "Homeland studies",
  geography: "Geography",
  moledet_geography: "Homeland & geography",
  "moledet-geography": "Homeland & geography",
  history: "History",
};

/** @type {Record<string, string>} */
export const ACTIVITY_MODE_LABEL_HE = {
  live_lesson: "Live lesson",
  guided_practice: "Guided practice",
  quiz: "Quiz",
  homework: "Homework",
  discussion: "Discussion",
  practice: "Practice",
  review: "Review",
};

/** @type {Record<string, string>} */
export const ACTIVITY_STATUS_LABEL_HE = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  closed: "Closed",
  archived: "Archived",
};

/** @type {Record<string, string>} */
export const STUDENT_ACTIVITY_STATUS_LABEL_HE = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  completed: "Completed",
  timed_out: "Timed out",
};

/** @type {Record<string, string>} */
export const ROLE_LABEL_HE = {
  teacher: "Teacher",
  school_admin: "School admin",
  admin: "System admin",
};

/** @type {Record<string, string>} */
export const AUDIT_ACTION_LABEL_HE = {
  school_subject_granted: "Subject permission granted",
  school_subject_revoked: "Subject assignment revoked",
  school_student_enrolled: "Student enrolled",
  school_student_unenrolled: "Student unenrolled",
  school_class_viewed: "Class report viewed",
  school_student_report_viewed: "Student report viewed",
  school_student_class_transferred: "Student transferred",
  school_class_teacher_reassigned: "Class teacher reassigned",
  school_class_archived: "Class archived",
  assign_teacher: "Teacher assigned",
  assign_manager: "Manager appointed",
  class_transfer: "Student transferred",
  grant: "Permission granted",
  revoke: "Permission removed",
  archive: "Archived",
  viewed_student_report: "Student report viewed",
  viewed_class_report: "Class report viewed",
  grant_created: "Access grant created",
  grant_revoked: "Access grant revoked",
  magic_link_issued: "Login link issued",
  pin_rotated: "PIN rotated",
  username_rotated: "Username rotated",
  teacher_quota_updated: "Quotas updated",
  teacher_features_updated: "Feature permissions updated",
  teacher_status_updated: "Account status updated",
};

/** @type {Record<string, string>} */
export const API_ERROR_LABEL_HE = {
  not_a_school_manager: "School manager permission required",
  school_inactive: "School is inactive",
  feature_disabled: "Portal is unavailable right now",
  unauthorized: "Please sign in",
  forbidden: "Permission denied",
  validation_failed: "Invalid data",
  method_not_allowed: "Action not supported",
  internal_error: "Server error — please try again",
  db_schema_not_ready: "System is still updating — try again later",
  subject_already_granted: "Subject already assigned to this teacher",
  teacher_subject_not_granted: "Teacher does not have this subject permission",
  invalid_audit_action: "Invalid action type",
  not_found: "Not found",
  staff_user_not_found:
    "No registered user found with this email. Sign up/sign in on the teacher portal first, then link to the school.",
  physical_class_not_found: "No matching class found — confirm teacher and subject classes are set up",
  student_limit_reached: "School student quota reached",
  main_admin_required: "This action is available to the primary system admin only",
  auth_list_failed: "Could not load auth users — check that the server key is configured",
  auth_users_unavailable: "No auth users found and a list could not be built from the database",
  protected_account: "Protected account cannot be deleted",
  protected_admin_account: "System admin account cannot be deleted",
  cannot_delete_self: "Cannot delete the signed-in account",
  delete_confirm_code_invalid: "Confirmation code is incorrect",
  full_delete_disabled: "Permanent delete is not enabled on the server",
  full_delete_not_configured: "Permanent delete is not configured on the server",
  confirm_email_mismatch: "Email address does not match",
  delete_blocked_by_dependencies: "Cannot delete — dependent records exist",
  auth_delete_failed: "Account delete failed",
  dependency_cleanup_failed: "Dependent record cleanup failed",
  user_not_found: "User not found",
  not_an_admin: "System admin permission required",
  economy_unavailable: "Coin economy unavailable right now",
  economy_disabled: "Coin economy is disabled",
  economy_config_missing: "Coin economy settings are missing",
  economy_db_error: "Coin economy database error",
  card_settings_missing: "Card settings are missing",
  invalid_amount: "Invalid amount",
  parent_not_found: "No parent found with this email",
  coin_failed: "Coin credit failed",
  db_error: "Database error",
  update_failed: "Update failed",
  count_failed: "Could not count dependent records",
  invalid_json: "Invalid data structure",
};

const RAW_KEY_PATTERN =
  /^(math|geometry|hebrew|english|science|moledet_geography|moledet|history|guided_practice|quiz|homework|practice|review|draft|active|paused|closed|archived|submitted|in_progress|not_started|school_admin|teacher|admin)$/i;

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function unknownDisplayHe() {
  return "-";
}

/**
 * @param {string|null|undefined} key
 */
export function subjectLabelHe(key) {
  if (!key) return unknownDisplayHe();
  const k = normalizeKey(key);
  return SUBJECT_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} mode
 */
export function activityModeLabelHe(mode) {
  if (!mode) return unknownDisplayHe();
  const k = normalizeKey(mode);
  return ACTIVITY_MODE_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} status
 */
export function activityStatusLabelHe(status) {
  if (!status) return unknownDisplayHe();
  const k = normalizeKey(status);
  return ACTIVITY_STATUS_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} status
 */
export function studentActivityStatusLabelHe(status) {
  if (!status) return unknownDisplayHe();
  const k = normalizeKey(status);
  return STUDENT_ACTIVITY_STATUS_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} role
 */
export function roleLabelHe(role) {
  if (!role) return unknownDisplayHe();
  const k = normalizeKey(role);
  return ROLE_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} action
 */
export function auditActionLabelHe(action) {
  if (!action) return unknownDisplayHe();
  const k = normalizeKey(action);
  return AUDIT_ACTION_LABEL_HE[k] || "System action";
}

/**
 * @param {{ code?: string|null, message?: string|null }|string|null|undefined} error
 * @param {string} [fallback]
 */
export function apiErrorMessageHe(error, fallback = "Something went wrong — please try again") {
  if (!error) return fallback;
  if (typeof error === "string") {
    const k = normalizeKey(error);
    return API_ERROR_LABEL_HE[k] || (RAW_KEY_PATTERN.test(k) ? fallback : error);
  }
  const code = normalizeKey(error.code);
  if (code && API_ERROR_LABEL_HE[code]) return API_ERROR_LABEL_HE[code];
  const message = String(error.message || "").trim();
  if (message && !RAW_KEY_PATTERN.test(normalizeKey(message)) && !/^[a-z][a-z0-9_]*$/i.test(message)) {
    return message;
  }
  if (code && API_ERROR_LABEL_HE[code]) return API_ERROR_LABEL_HE[code];
  return fallback;
}

/**
 * @returns {{ value: string, label: string }[]}
 */
export function subjectSelectOptionsHe() {
  return SUBJECT_ORDER.map((value) => ({
    value,
    label: SUBJECT_LABEL_HE[value],
  }));
}

/**
 * @param {string|null|undefined} title
 * @param {string|null|undefined} subject
 */
function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Replace raw internal keys embedded anywhere in visible copy. */
function replaceRawKeysInText(text) {
  let out = String(text || "");
  const replacements = [
    ...SUBJECT_ORDER.map((sid) => [sid, SUBJECT_LABEL_HE[sid]]),
    ["moledet-geography", SUBJECT_LABEL_HE.moledet_geography],
    ...Object.entries(ACTIVITY_MODE_LABEL_HE),
    ...Object.entries(ACTIVITY_STATUS_LABEL_HE),
  ];
  for (const [key, heLabel] of replacements) {
    if (!key || !heLabel) continue;
    const pattern = escapeRegExp(key).replace(/_/g, "[_\\s-]+");
    out = out.replace(new RegExp("\\b" + pattern + "\\b", "gi"), heLabel);
    if (out.toLowerCase() === key.toLowerCase()) out = heLabel;
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

export function sanitizeActivityTitleHe(title, subject) {
  const raw = String(title || "").trim();
  const subjHe = subjectLabelHe(subject);
  if (!raw) return subjHe !== "-" ? `${subjHe} activity` : "Class activity";
  let out = raw;
  for (const sid of SUBJECT_ORDER) {
    const re = new RegExp("^" + sid.replace("_", "[_ ]") + "\\s*[-:\\u2014]\\s*", "i");
    if (re.test(out)) {
      out = out.replace(re, subjHe !== "-" ? `${subjHe} · ` : "");
      break;
    }
    if (out.toLowerCase() === sid || out.toLowerCase().startsWith(`${sid} `)) {
      out = out.replace(new RegExp(`^${sid}`, "i"), subjHe !== "-" ? subjHe : "Activity");
      break;
    }
  }
  out = replaceRawKeysInText(out);
  if (subjHe !== "-" && !out.includes(subjHe)) {
    out = out.replace(/\s*[-:\u2014]\s*$/u, "").trim();
  }
  return out || (subjHe !== "-" ? `${subjHe} activity` : "Class activity");
}

/** Keys that must never appear as visible UI text when mapped through helpers. */
export const RAW_VISIBLE_KEY_DENYLIST = [
  "math",
  "geometry",
  "hebrew",
  "english",
  "science",
  "history",
  "moledet_geography",
  "guided_practice",
  "quiz",
  "homework",
  "draft",
  "active",
  "paused",
  "closed",
  "archived",
  "submitted",
  "in_progress",
  "not_started",
  "school_admin",
  "teacher",
];
