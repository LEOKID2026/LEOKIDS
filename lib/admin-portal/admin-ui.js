/**
 * English UI strings for platform admin / school-manager console.
 * Full English parity with ./admin-ui.he.js — export names kept compatible
 * (some still suffixed `He` for call-site compatibility) but all values are
 * English.
 */

import {
  apiErrorMessageHe,
  auditActionLabelHe,
  roleLabelHe,
} from "../platform-ui/hebrew-display-labels.js";

export { apiErrorMessageHe, auditActionLabelHe, roleLabelHe };

export const ADMIN_PLATFORM_LABEL = "System administration";
export const ADMIN_NAV_TEACHERS = "Private teachers";
export const ADMIN_NAV_SCHOOLS = "Schools";
export const ADMIN_NAV_PARENTS = "Registered parents";
export const ADMIN_NAV_ALL_ACCOUNTS = "All accounts";
export const ADMIN_NAV_ANALYTICS = "Analytics";
export const ADMIN_NAV_REWARDS = "Rewards & cards";
export const ADMIN_NAV_GAMES = "Games";
export const ADMIN_NAV_GUEST = "Guest";
export const ADMIN_NAV_VIDEO_BUILDER = "Video builder";
export const ADMIN_NAV_PROTOTYPES = "Dev lab";
export const ADMIN_NAV_ENGINE_REVIEW = "Engine review";
export const ADMIN_NAV_TEACHER_PORTAL = "Teacher portal";
export const ADMIN_LOGOUT = "Sign out";
export const ADMIN_LOGOUT_BUSY = "Signing out…";

export const ADMIN_TEACHERS_TITLE = "Manage private teachers";
export const ADMIN_PARENTS_TITLE = "Registered parents & account settings";
export const ADMIN_ALL_ACCOUNTS_TITLE = "All system accounts";
export const ADMIN_ANALYTICS_TITLE = "Internal analytics center";
export const ADMIN_ALL_ACCOUNTS_MAIN_ADMIN_ONLY =
  "This page is available to the primary admin only.";
export const ADMIN_ALL_ACCOUNTS_LOGGED_IN_AS = "Signed in as:";
export const ADMIN_ALL_ACCOUNTS_LIST_DEGRADED =
  "The list was built from the database (the auth user list returned no results).";
export const ADMIN_NO_ALL_ACCOUNTS = "No accounts found.";
export const ADMIN_COL_USER_ID = "User ID";
export const ADMIN_COL_CLASSIFICATION = "Classification";
export const ADMIN_COL_CONFIRMED = "Email verified";
export const ADMIN_COL_FROZEN = "Frozen";
export const ADMIN_COL_PROTECTED = "Protected";
export const ADMIN_COL_DELETABLE = "Deletable";
export const ADMIN_COL_LINKED = "Links";
export const ADMIN_COL_LAST_SIGN_IN = "Last sign-in";
export const ADMIN_COL_CREATED = "Created";
export const ADMIN_ACCOUNT_CLASS_PLATFORM_ADMIN = "System admin";
export const ADMIN_ACCOUNT_CLASS_QA = "Test account";
export const ADMIN_ACCOUNT_CLASS_PENDING_CONFIRM = "Pending confirmation";
export const ADMIN_ACCOUNT_CLASS_UNLINKED = "Unlinked account";
export const ADMIN_ACCOUNT_CLASS_SCHOOL_STAFF = "School staff / operations";
export const ADMIN_ALL_ACCOUNTS_DELETE_EXPAND = "Delete";
export const ADMIN_ALL_ACCOUNTS_SCHOOLS_LINK = "Manage schools";
export const ADMIN_PARENT_DETAIL_FALLBACK = "Parent account settings";
export const ADMIN_NO_PARENTS = "No registered parents found.";
export const ADMIN_BACK_TO_PARENTS = "← Back to parent list";
export const ADMIN_PARENT_SETTINGS_SECTION = "Account settings";
export const ADMIN_PARENT_UNLINKED_STATUS = "Unlinked account - missing permission";
export const ADMIN_PARENT_UNLINKED_DETAIL_NOTE =
  "This account has a profile record but no active parent permission. Deletion can be managed; account settings are unavailable.";
export const ADMIN_COL_PLAN = "Plan";
export const ADMIN_COL_ACCOUNT_STATUS = "Account status";
export const ADMIN_TEACHER_DETAIL_FALLBACK = "Private teacher details";
export const ADMIN_LOADING = "Loading…";
export const ADMIN_NO_TEACHERS = "No private teachers found.";
export const ADMIN_LOAD_ERROR = "Error loading data";
export const ADMIN_BACK_TO_TEACHERS = "← Back to teacher list";

export const ADMIN_COL_EMAIL = "Email";
export const ADMIN_COL_NAME = "Name";
export const ADMIN_COL_CLASSES = "Classes";
export const ADMIN_COL_STUDENTS = "Children";
export const ADMIN_COL_DIRECT = "Private";
export const ADMIN_COL_INDIV_ACTIVITIES = "Personal activities";
export const ADMIN_COL_PER_CLASS_CAP = "Class cap";
export const ADMIN_COL_ACTIVE = "Active";
export const ADMIN_COL_ACTIONS = "Actions";
export const ADMIN_COL_SCHOOL = "School";
export const ADMIN_MANAGE = "Manage";
export const ADMIN_YES = "Yes";
export const ADMIN_NO = "No";

export const ADMIN_SUMMARY_TEACHERS = "Teachers";
export const ADMIN_SUMMARY_ACTIVE_ACCOUNTS = "Active accounts";
export const ADMIN_SUMMARY_LINKED_STUDENTS = "Linked children";
export const ADMIN_SUMMARY_CLASSES = "Active classes";

export const ADMIN_SECTION_IDENTITY = "Teacher details";
export const ADMIN_SECTION_USAGE = "Usage summary";
export const ADMIN_SECTION_CLASSES = "Classes";
export const ADMIN_SECTION_QUOTAS = "Quotas";
export const ADMIN_SECTION_FEATURES = "Feature permissions";
export const ADMIN_SECTION_PERMISSIONS = "Permissions";
export const ADMIN_SECTION_ACCOUNT = "Account access";
export const ADMIN_SECTION_MANAGEMENT = "Quotas & permissions";
export const ADMIN_SECTION_AUDIT = "Audit log";
export const ADMIN_TEACHER_DETAIL_NAV = "Teacher page navigation";

/** @param {number} count @param {boolean} expanded */
export function ADMIN_SMOKE_CLASSES_TOGGLE(count, expanded) {
  if (expanded) return `Hide ${count} test classes`;
  return `Show ${count} test classes (not shown in management)`;
}

export const ADMIN_LABEL_EMAIL = "Email";
export const ADMIN_LABEL_NAME = "Display name";
export const ADMIN_LABEL_PLAN = "Plan";
export const ADMIN_LABEL_STATUS = "Status";
export const ADMIN_LABEL_CREATED = "Created";
export const ADMIN_LABEL_CLASSES = "Classes";
export const ADMIN_LABEL_TOTAL_STUDENTS = "Total children";
export const ADMIN_LABEL_CLASS_STUDENTS = "Children in classes";
export const ADMIN_LABEL_DIRECT_STUDENTS = "Private children";
export const ADMIN_LABEL_INDIV_ACTIVITIES = "Personal activities";
export const ADMIN_LABEL_EFFECTIVE_CLASS_CAP = "Effective class cap";
export const ADMIN_LABEL_OVERRIDE = "Class cap override";
export const ADMIN_LABEL_NOTES = "Internal notes";
export const ADMIN_PLACEHOLDER_OVERRIDE = "Blank = default (40)";
export const ADMIN_OVERRIDE_HINT =
  "An empty value uses the plan's cap. Default: 40 children per class.";

export const ADMIN_CLASS_COL_NAME = "Class name";
export const ADMIN_CLASS_COL_STUDENTS = "Children";
export const ADMIN_NO_CLASSES = "No active classes.";
export const ADMIN_NO_AUDIT = "No log records.";

export const ADMIN_SAVE_QUOTAS = "Save quotas";
export const ADMIN_SAVE_FEATURES = "Save permissions";
export const ADMIN_SAVE_STATUS = "Save status";
export const ADMIN_ACCOUNT_ACTIVE_LABEL = "Active teacher account (interface access)";

export const ADMIN_STATUS_ACTIVE = "Active";
export const ADMIN_STATUS_INACTIVE = "Inactive";

export const ADMIN_FEATURE_LABELS_HE = {
  classroom_activities: "Class activities",
  individual_activities: "Personal activities",
  parent_messaging: "Messages to parents",
  ai_reports: "AI reports",
  live_audio: "Live lesson (future)",
};

/** @param {boolean|undefined|null} active */
export function adminYesNoHe(active) {
  return active ? ADMIN_YES : ADMIN_NO;
}

/** @param {{ isAccountActive?: boolean, isActive?: boolean }|null|undefined} teacher */
export function adminAccountStatusHe(teacher) {
  const active = teacher?.isAccountActive !== false && teacher?.isActive;
  return active ? ADMIN_STATUS_ACTIVE : ADMIN_STATUS_INACTIVE;
}

/** @param {string|null|undefined} iso */
export function adminFormatDateHe(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export const ADMIN_SCHOOLS_TITLE = "Manage schools";
export const ADMIN_SCHOOL_DETAIL_FALLBACK = "School details";
export const ADMIN_SCHOOL_CREATE = "Create school";
export const ADMIN_SCHOOL_NAME = "School name";
export const ADMIN_SCHOOL_CITY = "City";
export const ADMIN_SCHOOL_CONTACT = "Contact email";
export const ADMIN_SCHOOL_MAX_TEACHERS = "Teacher cap";
export const ADMIN_SCHOOL_ACTIVE = "Active school";
export const ADMIN_SCHOOL_TEACHERS = "Teachers at school";
export const ADMIN_SCHOOL_ASSIGN_TEACHER = "Assign teacher";
export const ADMIN_SCHOOL_ASSIGN_MANAGER = "Appoint school manager";
export const ADMIN_SCHOOL_ROLE_MANAGER = "Manager";
export const ADMIN_SCHOOL_ROLE_TEACHER = "Teacher";
export const ADMIN_SCHOOL_NO_SCHOOLS = "No schools.";
export const ADMIN_SCHOOL_FORCE_REASSIGN = "Reassign to existing school";
export const ADMIN_TEACHER_SCHOOL_SECTION = "School assignment";
export const ADMIN_TEACHER_NO_SCHOOL = "Not assigned to a school";
export const ADMIN_TEACHER_VIEW_SCHOOL = "View school details";
export const ADMIN_TEACHER_SCHOOL_STAFF_READONLY =
  "This user belongs to a school staff. Managing subjects, quotas and permissions is done in the school portal - not here.";

export const ADMIN_LIFECYCLE_SECTION = "Manage status & permissions";
export const ADMIN_LIFECYCLE_ACCOUNT_STATUS = "Account status";
export const ADMIN_LIFECYCLE_ENTITLEMENT_STATUS = "Entitlement status";
export const ADMIN_LIFECYCLE_SUSPEND = "Suspend access";
export const ADMIN_LIFECYCLE_REACTIVATE = "Restore access";
export const ADMIN_LIFECYCLE_REVOKE = "Revoke entitlement";
export const ADMIN_LIFECYCLE_SAVE = "Save";
export const ADMIN_LIFECYCLE_BUSY = "Updating…";
export const ADMIN_LIFECYCLE_CONFIRM_REVOKE =
  "Revoke this entitlement? It can only be restored by re-approval.";
export const ADMIN_LIFECYCLE_TEACHER_LIMITS = "Teacher account limits";
export const ADMIN_LIFECYCLE_LOADING = "Loading…";
export const ADMIN_LIFECYCLE_NETWORK_ERROR = "Network error";

export const ADMIN_LIFECYCLE_DELETE = "Delete account";
export const ADMIN_LIFECYCLE_DELETE_BUSY = "Deleting…";
export const ADMIN_LIFECYCLE_DELETE_CONFIRM_LABEL =
  "To confirm permanent deletion, type the confirmation code:";
export const ADMIN_LIFECYCLE_DELETE_SUBMIT = "Delete permanently";
export const ADMIN_LIFECYCLE_DELETE_CANCEL = "Cancel";
export const ADMIN_LIFECYCLE_DELETE_SUCCESS = "The account has been deleted.";
export const ADMIN_LIFECYCLE_DELETE_PROTECTED = "A protected account cannot be deleted.";
export const ADMIN_LIFECYCLE_DELETE_BLOCKED =
  "Cannot delete - dependent records exist. Details shown below.";

export const ADMIN_SCHOOL_LIFECYCLE_SECTION = "Manage school status";
export const ADMIN_SCHOOL_LIFECYCLE_STATUS = "School status";
export const ADMIN_SCHOOL_LIFECYCLE_ACTIVE = "School is active";
export const ADMIN_SCHOOL_LIFECYCLE_SUSPENDED = "School is frozen";
export const ADMIN_SCHOOL_LIFECYCLE_SUSPEND = "Freeze school";
export const ADMIN_SCHOOL_LIFECYCLE_REACTIVATE = "Restore school activity";

export const ADMIN_PARENT_MAX_CHILDREN = "Maximum children";
export const ADMIN_PARENT_FEATURE_REPORTS = "Reports";
export const ADMIN_PARENT_FEATURE_COPILOT = "Parent assistant";
export const ADMIN_PARENT_FEATURE_DIAGNOSTICS = "Advanced diagnostics";
export const ADMIN_PARENT_FEATURE_EXPORT = "Export";

/** @type {Record<string, string>} */
export const PERSONA_LABELS_HE = {
  parent: "Parent",
  private_teacher: "Private teacher",
  school_teacher: "School teacher",
  school_manager: "School manager",
  school_operator: "Operator / administrative staff",
  admin: "System admin",
};

/** @type {Record<string, string>} */
export const ENTITLEMENT_STATUS_LABELS_HE = {
  active: "Active",
  suspended: "Frozen",
  revoked: "Entitlement revoked",
  cancelled: "Cancelled",
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
  trial: "Trial",
  none: "Not set",
};

/** @type {Record<string, string>} */
export const PLAN_CODE_LABELS_HE = {
  free: "Free",
  trial: "Trial",
  basic: "Basic",
  family: "Family",
  premium: "Premium",
  school_linked: "School-linked",
  teacher_basic_20: "Basic plan - up to 20 children",
  teacher_pro_50: "Pro plan - up to 50 children",
  teacher_school_unlimited: "School plan - unlimited",
};

/** @param {string|null|undefined} status */
export function entitlementStatusLabelHe(status) {
  const key = String(status || "").trim().toLowerCase();
  return ENTITLEMENT_STATUS_LABELS_HE[key] || "-";
}

/** @param {string|null|undefined} persona */
export function personaLabelHe(persona) {
  const key = String(persona || "").trim().toLowerCase();
  return PERSONA_LABELS_HE[key] || "-";
}

/** @type {Record<string, string>} */
export const ACCOUNT_CLASSIFICATION_LABELS_HE = {
  platform_admin: ADMIN_ACCOUNT_CLASS_PLATFORM_ADMIN,
  parent: PERSONA_LABELS_HE.parent,
  private_teacher: PERSONA_LABELS_HE.private_teacher,
  school_manager: PERSONA_LABELS_HE.school_manager,
  school_teacher: PERSONA_LABELS_HE.school_teacher,
  school_operator: ADMIN_ACCOUNT_CLASS_SCHOOL_STAFF,
  unlinked: ADMIN_ACCOUNT_CLASS_UNLINKED,
  pending_confirmation: ADMIN_ACCOUNT_CLASS_PENDING_CONFIRM,
  qa_test: ADMIN_ACCOUNT_CLASS_QA,
};

/** @param {string|null|undefined} key */
export function accountClassificationLabelHe(key) {
  const k = String(key || "").trim().toLowerCase();
  return ACCOUNT_CLASSIFICATION_LABELS_HE[k] || "-";
}

/** @param {string[]} classifications */
export function accountClassificationsLabelHe(classifications) {
  if (!Array.isArray(classifications) || !classifications.length) return "-";
  return classifications.map((c) => accountClassificationLabelHe(c)).join(" · ");
}

/** @param {string|null|undefined} status */
export function accountStatusLabelHe(status) {
  return entitlementStatusLabelHe(status);
}

/** @param {{ isOrphanUnlinked?: boolean, settings?: object|null, entitlementStatus?: string|null }} parent */
export function parentListStatusLabelHe(parent) {
  if (parent?.isOrphanUnlinked) return ADMIN_PARENT_UNLINKED_STATUS;
  if (parent?.settings?.accountStatus) return accountStatusLabelHe(parent.settings.accountStatus);
  if (parent?.entitlementStatus) return entitlementStatusLabelHe(parent.entitlementStatus);
  return "-";
}

/** @param {string|null|undefined} planCode */
export function planCodeLabelHe(planCode) {
  const key = String(planCode || "").trim().toLowerCase();
  return PLAN_CODE_LABELS_HE[key] || "-";
}

export function adminGradeLabelHe(gradeLevel) {
  const map = {
    g1: "Grade 1",
    g2: "Grade 2",
    g3: "Grade 3",
    g4: "Grade 4",
    g5: "Grade 5",
    g6: "Grade 6",
  };
  const key = String(gradeLevel || "").trim().toLowerCase();
  return map[key] || gradeLevel || "-";
}

export const ADMIN_REG_REQUEST_SECTION = "Registration / access request";
export const ADMIN_REG_REQUEST_DETAILS = "Request details";
export const ADMIN_REG_REQUEST_SUBJECTS = "Requested subjects";
export const ADMIN_REG_REQUEST_STATUS = "Request status";
export const ADMIN_REG_REQUEST_SUBMITTED = "Submitted date";
export const ADMIN_REG_REQUEST_NO_SUBJECTS = "No subjects specified";

/** @type {Record<string, string>} */
export const ADMIN_DEPENDENCY_LABEL_HE = {
  "school_messages.author_id": "School messages",
  "school_teacher_subjects.teacher_id": "School subject assignment (teacher)",
  "school_teacher_subjects.granted_by": "School subject assignment (granter)",
  "private_teacher_subjects.teacher_id": "Private teacher subject assignment",
  "private_teacher_subjects.granted_by": "Private teacher subject assignment (granter)",
  "student_guardian_access.created_by_teacher_id": "Parent access to child (teacher)",
  "school_staff_access_codes.user_id": "Staff access codes",
  "school_staff_access_codes.created_by": "Staff access codes (creator)",
  "school_staff_sessions.user_id": "School staff sessions",
  "school_operator_grants.operator_user_id": "School operator permissions",
  "school_teacher_memberships.teacher_id": "Teacher-school assignment",
  "teacher_registration_requests.user_id": "Teacher registration requests",
  "school_registration_requests.contact_user_id": "School registration requests",
  "account_persona_entitlements.user_id": "Account entitlements",
  "parent_account_settings.parent_user_id": "Parent account settings",
  "parent_profiles.id": "Parent profile",
  "teacher_profiles.id": "Teacher profile",
  "students.parent_id": "Linked children",
  "parent_copilot_usage_log.parent_user_id": "Parent assistant usage",
};

/**
 * @param {string|null|undefined} label
 */
export function formatAdminDependencyLabelHe(label) {
  const key = String(label || "").trim();
  if (!key) return "-";
  return ADMIN_DEPENDENCY_LABEL_HE[key] || "Dependent record";
}
