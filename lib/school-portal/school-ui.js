/**
 * English UI strings for school manager portal.
 * Full English parity with ./school-ui.he.js — export names kept compatible
 * (some still suffixed `He` for call-site compatibility) but all values are
 * English.
 */

import {
  ACTIVITY_MODE_LABEL_HE,
  ACTIVITY_STATUS_LABEL_HE,
  SUBJECT_LABEL_HE,
  SUBJECT_ORDER,
  activityModeLabelHe as platformActivityModeLabelHe,
  activityStatusLabelHe as platformActivityStatusLabelHe,
  apiErrorMessageHe,
  auditActionLabelHe,
  roleLabelHe,
  sanitizeActivityTitleHe,
  subjectLabelHe as platformSubjectLabelHe,
  subjectSelectOptionsHe,
} from "../platform-ui/hebrew-display-labels.js";

export {
  apiErrorMessageHe,
  auditActionLabelHe,
  roleLabelHe,
  sanitizeActivityTitleHe,
  subjectSelectOptionsHe,
};

export const SCHOOL_PLATFORM_LABEL = "School management";
export const SCHOOL_NAV_DASHBOARD = "Dashboard";
export const SCHOOL_NAV_TEACHERS = "Teachers";
export const SCHOOL_NAV_CLASSES = "Classes";
export const SCHOOL_NAV_STUDENTS = "Children";
export const SCHOOL_NAV_MY_TEACHER = "My teacher dashboard";
export const SCHOOL_LOADING = "Loading…";
export const SCHOOL_LOADING_DATA = "Loading data…";
export const SCHOOL_LOAD_ERROR = "Error loading data";
export const SCHOOL_CLASS_REPORT_TITLE = "Class report";
export const SCHOOL_STUDENT_REPORT_TITLE = "Child report";
export const SCHOOL_RETRY = "Try again";
export const SCHOOL_REFRESH = "Refresh data";

export const SCHOOL_DASHBOARD_TITLE = "School dashboard";
export const SCHOOL_DASHBOARD_SUBTITLE = "Overview, quick actions and school activity monitoring";
export const SCHOOL_STAT_TEACHERS = "Teachers at school";
export const SCHOOL_STAT_STUDENTS = "Registered children";
export const SCHOOL_STAT_CLASSES = "Active classes";
export const SCHOOL_STAT_ACTIVITIES = "Active activities";

export const SCHOOL_QUICK_TEACHERS = "Manage teachers";
export const SCHOOL_QUICK_TEACHERS_DESC = "View teachers, roles and subject permissions";
export const SCHOOL_QUICK_CLASSES = "Manage classes";
export const SCHOOL_QUICK_CLASSES_DESC = "Classes by teacher, class and subject";
export const SCHOOL_QUICK_STUDENTS = "Manage children";
export const SCHOOL_QUICK_STUDENTS_DESC = "Register children and link to teachers";
export const SCHOOL_QUICK_ACTIVITIES = "Class activities";
export const SCHOOL_QUICK_ACTIVITIES_DESC = "Monitor recent activities at school";

export const SCHOOL_SECTION_RECENT = "Recent activities";
export const SCHOOL_SECTION_ALERTS = "Needs attention";
export const SCHOOL_SECTION_QUICK = "Quick actions";
export const SCHOOL_EMPTY_ACTIVITIES = "No class activities to show right now.";
export const SCHOOL_EMPTY_ACTIVITIES_HINT = "Once teachers create activities, they'll appear here.";
export const SCHOOL_EMPTY_TEACHERS = "No teachers linked besides the school manager.";
export const SCHOOL_EMPTY_CLASSES = "No classes registered for the school.";
export const SCHOOL_EMPTY_STUDENTS = "No children registered for the school.";
export const SCHOOL_EMPTY_STUDENTS_HINT = "You can register a child by UUID in the form above.";

export const SCHOOL_ALERT_NO_STUDENTS = "No children registered - recommended to register children for the school.";
export const SCHOOL_ALERT_FEW_TEACHERS = "Few active teachers - consider linking more teachers.";
export const SCHOOL_ALERT_ACTIVE_ACTIVITIES = "There are active class activities right now.";

export const SCHOOL_TEACHERS_TITLE = "Teachers at school";
export const SCHOOL_TEACHERS_SUBTITLE = "Teacher list, roles, subjects and activity";
export const SCHOOL_COL_NAME = "Name";
export const SCHOOL_COL_ROLE = "Role";
export const SCHOOL_COL_SUBJECTS = "Subjects";
export const SCHOOL_COL_CLASSES = "Classes";
export const SCHOOL_COL_STUDENTS = "Linked children";
export const SCHOOL_COL_ACTIONS = "Actions";
export const SCHOOL_ROLE_MANAGER = "School manager";
export const SCHOOL_ROLE_TEACHER = "Teacher";
export const SCHOOL_MANAGE_SUBJECTS = "Subject permissions";
export const SCHOOL_VIEW_DETAILS = "Details";
export const SCHOOL_ALL_SUBJECTS = "All subjects";
export const SCHOOL_INACTIVE = "Inactive";

export const SCHOOL_CLASSES_TITLE = "Classes at school";
export const SCHOOL_CLASSES_SUBTITLE = "Choose grade, physical class and subject - reports and management by grade";
export const SCHOOL_CHOOSE_GRADE = "Choose grade";
export const SCHOOL_CHOOSE_PHYSICAL_CLASS = "Choose class";
export const SCHOOL_CHOOSE_SUBJECT = "Class subjects";
export const SCHOOL_CHOOSE_STUDENTS = "Class children";
export const SCHOOL_BACK = "Back";
export const SCHOOL_BACK_GRADES = "← Back to grades";
export const SCHOOL_BACK_CLASSES = "← Back to classes";
export const SCHOOL_STUDENTS_IN_CLASS = "Children in class";
export const SCHOOL_ACTIVITIES_IN_CLASS = "Activities";
export const SCHOOL_TEACHER_LABEL = "Teacher";
export const SCHOOL_SUBJECT_LABEL = "Subject";
export const SCHOOL_CLASS_LABEL = "Class";
export const SCHOOL_STATUS_LABEL = "Status";
export const SCHOOL_ACTIVITY_TYPE_LABEL = "Activity type";
export const SCHOOL_ARCHIVED = "Archived";
export const SCHOOL_COL_CLASS = "Class";
export const SCHOOL_COL_GRADE = "Grade";
export const SCHOOL_COL_SUBJECT_FOCUS = "Subject";
export const SCHOOL_COL_TEACHER = "Teacher";
export const SCHOOL_COL_MEMBERS = "Children in class";
export const SCHOOL_VIEW_CLASS_REPORT = "Class report";

export const SCHOOL_PHYSICAL_CLASS_REPORT_TITLE = "General class report";
export const SCHOOL_PHYSICAL_CLASS_REPORT_BUTTON = "General class report";
export const SCHOOL_PHYSICAL_CLASS_ALL_SUBJECTS = "All subjects";
export const SCHOOL_PHYSICAL_CLASS_SUBJECT_BREAKDOWN = "Breakdown by subject";
export const SCHOOL_PHYSICAL_CLASS_RECENT_ACTIVITIES = "Recent activities";
export const SCHOOL_PHYSICAL_CLASS_LOADING = "Loading general class report…";
export const SCHOOL_TEACHER_CARD_ACTION = "Teacher card";
export const SCHOOL_SUBJECT_REPORT_ACTION = "Subject report";

export const SCHOOL_STUDENTS_TITLE = "Registered children";
export const SCHOOL_STUDENTS_SUBTITLE = "Browse by grade and class - child reports without entering IDs";
export const SCHOOL_COL_STUDENT = "Child";
export const SCHOOL_COL_LINKED = "Linked teachers";
export const SCHOOL_SEARCH_STUDENTS = "Search by name (optional)";
export const SCHOOL_SEARCH_STUDENTS_PLACEHOLDER = "Type child's name";
export const SCHOOL_ENROLL_SECTION = "Register existing child (advanced - by ID)";
export const SCHOOL_CREATE_STUDENT_SECTION = "Add new child";
export const SCHOOL_CREATE_STUDENT_SUBMIT = "Create child";
export const SCHOOL_CREATE_STUDENT_FULL_NAME = "Child's name";
export const SCHOOL_CREATE_STUDENT_GRADE = "Grade";
export const SCHOOL_CREATE_STUDENT_CLASS = "Class (class name at school)";
export const SCHOOL_CREATE_STUDENT_NOTES = "Notes (optional)";
export const SCHOOL_CREATE_STUDENT_LOGIN = "Create login credentials for child (username + PIN)";
export const SCHOOL_CREATE_STUDENT_SUCCESS = "Child created and registered at school";
export const SCHOOL_CREATE_STUDENT_CLASS_HINT =
  "Choose a class that already exists for a teacher at the school (e.g. \u201c1\u201d, \u201c2\u201d).";
export const SCHOOL_VIEW_STUDENT_REPORT = "Child report";
export const SCHOOL_REPORT_LOADING = "Loading report…";
export const SCHOOL_REPORT_SUMMARY = "Report summary";
export const SCHOOL_REPORT_CLOSE = "Close";

export const SCHOOL_TEACHER_CLASSES_TITLE = "Teacher's classes";
export const SCHOOL_TEACHER_EMPTY_CLASSES = "No classes linked to this teacher.";
export const SCHOOL_TEACHER_CLASS_SUBJECTS_PREFIX = "Subjects";
export const SCHOOL_SUBJECTS_TITLE = "Subject permissions";
export const SCHOOL_SUBJECT_ADD = "Add subject";
export const SCHOOL_SUBJECT_REMOVE = "Remove subject assignment";
export const SCHOOL_ENROLL_STUDENT = "Register child";
export const SCHOOL_STUDENT_ID = "Child ID (UUID)";

export const SCHOOL_INVITE_TEACHER_SECTION = "Add teacher to school";
export const SCHOOL_INVITE_TEACHER_SUBMIT = "Invite teacher";
export const SCHOOL_INVITE_TEACHER_HELP =
  "Enter the existing teacher's account email. If there's no account, sign up/sign in on the teacher portal first, then link to the school.";
export const SCHOOL_INVITE_OPERATOR_SECTION = "Add operator to school";
export const SCHOOL_INVITE_OPERATOR_SUBMIT = "Invite operator";
export const SCHOOL_INVITE_OPERATOR_HELP =
  "Enter the existing operator's account email. If there's no account, create an account and sign in first, then link to the school.";
export const SCHOOL_INVITE_EMAIL = "User account email";
export const SCHOOL_INVITE_SUCCESS = "Invitation sent successfully";
export const SCHOOL_INVITE_ADVANCED_UUID = "Advanced options (user ID)";

export const SCHOOL_STAFF_LOGIN_TITLE = "School staff login";
export const SCHOOL_STAFF_LOGIN_SUBTITLE = "Enter the staff code and PIN you received from the school manager";
export const SCHOOL_STAFF_CODE_LABEL = "Staff code";
export const SCHOOL_STAFF_PIN_LABEL = "PIN code";
export const SCHOOL_STAFF_LOGIN_SUBMIT = "Sign in";
export const SCHOOL_STAFF_LOGIN_BUSY = "Signing in…";
export const SCHOOL_STAFF_LOGIN_FAILED = "The staff code or PIN is incorrect. Contact the school manager.";
export const SCHOOL_STAFF_LOGIN_LOCKED = "The account is temporarily locked after failed attempts. Try again later.";
export const SCHOOL_STAFF_LOGIN_SUSPENDED = "Access has been suspended. Contact the school manager.";
export const SCHOOL_STAFF_CREATE_TEACHER_SECTION = "Create new teacher (code + PIN)";
export const SCHOOL_STAFF_CREATE_OPERATOR_SECTION = "Create new operator (code + PIN)";
export const SCHOOL_STAFF_CREATE_DISPLAY_NAME = "Display name";
export const SCHOOL_STAFF_CREATE_SUBMIT_TEACHER = "Create teacher";
export const SCHOOL_STAFF_CREATE_SUBMIT_OPERATOR = "Create operator";
export const SCHOOL_STAFF_CREATE_SUCCESS = "Created successfully - save the code and PIN (shown once only)";
export const SCHOOL_STAFF_CODE_SHOWN = "Staff code";
export const SCHOOL_STAFF_PIN_SHOWN = "Initial PIN";
export const SCHOOL_STAFF_STATUS_ACTIVE = "Active";
export const SCHOOL_STAFF_STATUS_SUSPENDED = "Suspended";
export const SCHOOL_STAFF_RESET_PIN = "Reset PIN";
export const SCHOOL_STAFF_SUSPEND = "Suspend";
export const SCHOOL_STAFF_REACTIVATE = "Reactivate";
export const SCHOOL_STAFF_REGENERATE_CODE = "New code";
export const SCHOOL_STAFF_ACTION_BUSY = "Processing…";
export const SCHOOL_STAFF_INVITE_EMAIL_SECTION = "Invite by email (existing user)";
export const SCHOOL_STAFF_UUID_ADVANCED = "User ID (UUID) - advanced";

export const SCHOOL_STAFF_CHANGE_PIN_TITLE = "Change PIN";
export const SCHOOL_STAFF_CHANGE_PIN_REQUIRED = "PIN change required";
export const SCHOOL_STAFF_CHANGE_PIN_EXPLANATION =
  "Before signing in you must change the initial PIN you received from the school manager.";
export const SCHOOL_STAFF_PIN_CURRENT_LABEL = "Current PIN";
export const SCHOOL_STAFF_PIN_NEW_LABEL = "New PIN";
export const SCHOOL_STAFF_PIN_CONFIRM_LABEL = "Confirm new PIN";
export const SCHOOL_STAFF_PIN_SAVE = "Save new PIN";
export const SCHOOL_STAFF_PIN_CHANGED_SUCCESS = "PIN updated successfully";
export const SCHOOL_STAFF_PIN_WRONG_CURRENT = "The current PIN is incorrect";
export const SCHOOL_STAFF_PIN_INVALID_NEW = "The new PIN is invalid";
export const SCHOOL_STAFF_PIN_MISMATCH = "The PINs do not match";
export const SCHOOL_STAFF_PIN_CHANGE_BUSY = "Saving…";
export const SCHOOL_NAV_OPERATORS = "Operators";
export const SCHOOL_OPERATORS_TITLE = "Operators & administrative staff";
export const SCHOOL_OPERATOR_IDENTITY = "Operator details";
export const SCHOOL_OPERATOR_NO_TEACHING = "Operator - no subject permissions and no teaching activities.";
export const SCHOOL_OPERATOR_PERMISSIONS = "Permissions";
export const SCHOOL_OPERATOR_GRANT_SECTION = "Access permissions";
export const SCHOOL_OPERATOR_NO_PERMISSIONS = "No permissions defined";
export const SCHOOL_OPERATOR_UPDATE_PERMISSIONS = "Update permissions";
export const SCHOOL_OPERATOR_STAFF_LABEL = "Administrative staff";
export const SCHOOL_NAV_OPERATOR_DASHBOARD = "Operator dashboard";
export const SCHOOL_OPERATOR_DASHBOARD_TITLE = "School operator dashboard";
export const SCHOOL_OPERATOR_WORKSPACE = "Workspace";
export const SCHOOL_OPERATOR_ACCESS_ADMIN_SECTION = "Manage children & parent access";
export const SCHOOL_OPERATOR_ACCESS_ADMIN_DESC =
  "Search children, create and reset child/parent login credentials, and manage access accounts.";
export const SCHOOL_OPERATOR_DATA_VIEWER_SECTION = "View reports and child details";
export const SCHOOL_OPERATOR_DATA_VIEWER_DESC =
  "View learning reports and child details permitted by your access.";
export const SCHOOL_OPERATOR_GO_TO_STUDENTS = "Go to children";
export const SCHOOL_OPERATOR_MANAGE_ACCESS = "Manage access";
export const SCHOOL_OPERATOR_VIEW_REPORT = "View report";
export const SCHOOL_OPERATOR_NO_PERMISSIONS_DETAIL =
  "You have not been granted any active permissions. Contact the school manager to assign permissions.";
export const SCHOOL_LINKED_TEACHERS = "Linked teachers";
export const SCHOOL_NO_LINKED_TEACHERS = "No linked teachers";
export const SCHOOL_VIEW_REPORT = "View report";
export const SCHOOL_VIEW_CLASS = "Class";
export const SCHOOL_BACK_TEACHERS = "← Back to teachers";
export const SCHOOL_MANAGER_ALL_SUBJECTS = "The school manager has access to all subjects.";

export const SCHOOL_CLASS_MGMT_SECTION = "Manage classes";
export const SCHOOL_CLASS_MGMT_ADD = "Add class";
export const SCHOOL_CLASS_MGMT_NAME = "Class name";
export const SCHOOL_CLASS_MGMT_GRADE = "Grade";
export const SCHOOL_CLASS_MGMT_CREATE = "Create class";
export const SCHOOL_CLASS_MGMT_EXISTING = "Existing class";
export const SCHOOL_CLASS_MGMT_LIST_TITLE = "Classes at school";
export const SCHOOL_CLASS_MGMT_CREATE_SUCCESS = "Class created successfully";
export const SCHOOL_CLASS_MGMT_EMPTY = "No classes registered - you can create a new class below.";
export const SCHOOL_CLASS_MGMT_SUBJECT_COUNT = "Subjects";
export const SCHOOL_CLASS_MGMT_STUDENT_COUNT = "Children";

export const SCHOOL_ASSIGN_SECTION = "Manage child assignment";
export const SCHOOL_ASSIGN_CURRENT_CLASS = "Current class";
export const SCHOOL_ASSIGN_CURRENT_GRADE = "Current grade";
export const SCHOOL_ASSIGN_TRANSFER = "Transfer to class";
export const SCHOOL_ASSIGN_CHOOSE_CLASS = "Choose class";
export const SCHOOL_ASSIGN_UPDATE = "Update assignment";
export const SCHOOL_ASSIGN_SAVED = "Change saved";
export const SCHOOL_ASSIGN_NO_CLASS = "Not assigned to a class";
export const SCHOOL_ASSIGN_TARGET_GRADE = "Target grade";

export const SCHOOL_ACTIVITY_COL_TITLE = "Activity";
export const SCHOOL_ACTIVITY_COL_META = "Details";
export const SCHOOL_ACTIVITY_COL_STATUS = "Status";

export const TEACHER_NAV_SCHOOL = "School management";
export const TEACHER_SCHOOL_BADGE = "School";

/** @type {Record<string, string>} */
export const SCHOOL_SUBJECT_LABELS = { ...SUBJECT_LABEL_HE };

/** @type {Record<string, string>} */
export const SCHOOL_ACTIVITY_MODE_LABELS = { ...ACTIVITY_MODE_LABEL_HE };

/** @type {Record<string, string>} */
export const SCHOOL_ACTIVITY_STATUS_LABELS = { ...ACTIVITY_STATUS_LABEL_HE };

/** @type {string[]} */
export const SCHOOL_SUBJECT_ORDER = [...SUBJECT_ORDER];

/**
 * @param {string|null|undefined} key
 */
export function schoolSubjectLabelHe(key) {
  return platformSubjectLabelHe(key);
}

export function schoolActivityModeHe(mode) {
  return platformActivityModeLabelHe(mode);
}

export function schoolActivityStatusHe(status) {
  return platformActivityStatusLabelHe(status);
}

/**
 * @param {unknown} body
 */
export function schoolClassReportSummaryFromBody(body, classLabel) {
  const cohort = body?.cohortSummary || body?.summary || {};
  const accuracy = cohort.accuracy != null ? `${cohort.accuracy}%` : "-";
  return {
    title: `${SCHOOL_REPORT_SUMMARY}: ${classLabel}`,
    line: `Answers: ${cohort.totalAnswers ?? 0} · Accuracy: ${accuracy} · Children: ${cohort.studentCount ?? cohort.studentsCount ?? "-"}`,
  };
}

/**
 * @param {unknown} body
 * @param {string} studentLabel
 * @param {string|null|undefined} gradeLevel
 */
export function schoolStudentReportSummaryFromBody(body, studentLabel, gradeLevel) {
  const summary = body?.summary || {};
  const accuracy = summary.accuracy != null ? `${summary.accuracy}%` : "-";
  return {
    title: `${SCHOOL_REPORT_SUMMARY}: ${studentLabel}`,
    line: `Answers: ${summary.totalAnswers ?? 0} · Accuracy: ${accuracy} · Grade: ${gradeLevel || "-"}`,
  };
}

/**
 * School portal fetch — Bearer JWT and/or staff session cookie.
 * @param {string|null|undefined} accessToken
 * @param {string} path
 * @param {RequestInit} [init]
 */
export async function schoolAuthFetch(accessToken, path, init = {}) {
  const headers = {
    ...(init.headers || {}),
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(path, {
    ...init,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
}

/** Tailwind classes for student learning-status badges (aligned with teacher dashboard). */
export function studentLearningStatusBadgeClass(badge) {
  switch (badge) {
    case "Strong":
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
    case "On track":
      return "bg-sky-500/20 text-sky-200 border-sky-400/40";
    case "Monitoring":
      return "bg-amber-500/20 text-amber-200 border-amber-400/40";
    case "Needs reinforcement":
      return "bg-orange-500/20 text-orange-200 border-orange-400/40";
    case "Needs intervention":
      return "bg-red-500/20 text-red-200 border-red-400/40";
    case "Low activity":
    case "Not enough data":
      return "bg-white/10 text-white/70 border-white/20";
    default:
      return "bg-white/10 text-white/70 border-white/20";
  }
}
