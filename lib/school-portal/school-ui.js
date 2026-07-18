/**
 * English UI strings for school manager portal.
 * Full English parity with ./school-ui.he.js — export names kept compatible
 * (some still suffixed `He` for call-site compatibility) but all values are
 * English.
 */

import schoolEn from "../../locales/en/school.json" with { type: "json" };
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

const P = schoolEn.portal;
const T = schoolEn.teacher;
const LS = schoolEn.learningStatus;
const RS = schoolEn.reportSummary;

export {
  apiErrorMessageHe,
  auditActionLabelHe,
  roleLabelHe,
  sanitizeActivityTitleHe,
  subjectSelectOptionsHe,
};

export const SCHOOL_PLATFORM_LABEL = P.platformLabel;
export const SCHOOL_NAV_DASHBOARD = P.navDashboard;
export const SCHOOL_NAV_TEACHERS = P.navTeachers;
export const SCHOOL_NAV_CLASSES = P.navClasses;
export const SCHOOL_NAV_STUDENTS = P.navStudents;
export const SCHOOL_NAV_MY_TEACHER = P.navMyTeacher;
export const SCHOOL_LOADING = P.loading;
export const SCHOOL_LOADING_DATA = P.loadingData;
export const SCHOOL_LOAD_ERROR = P.loadError;
export const SCHOOL_CLASS_REPORT_TITLE = P.classReportTitle;
export const SCHOOL_STUDENT_REPORT_TITLE = P.studentReportTitle;
export const SCHOOL_RETRY = P.retry;
export const SCHOOL_REFRESH = P.refresh;
export const SCHOOL_DASHBOARD_TITLE = P.dashboardTitle;
export const SCHOOL_DASHBOARD_SUBTITLE = P.dashboardSubtitle;
export const SCHOOL_STAT_TEACHERS = P.statTeachers;
export const SCHOOL_STAT_STUDENTS = P.statStudents;
export const SCHOOL_STAT_CLASSES = P.statClasses;
export const SCHOOL_STAT_ACTIVITIES = P.statActivities;
export const SCHOOL_QUICK_TEACHERS = P.quickTeachers;
export const SCHOOL_QUICK_TEACHERS_DESC = P.quickTeachersDesc;
export const SCHOOL_QUICK_CLASSES = P.quickClasses;
export const SCHOOL_QUICK_CLASSES_DESC = P.quickClassesDesc;
export const SCHOOL_QUICK_STUDENTS = P.quickStudents;
export const SCHOOL_QUICK_STUDENTS_DESC = P.quickStudentsDesc;
export const SCHOOL_QUICK_ACTIVITIES = P.quickActivities;
export const SCHOOL_QUICK_ACTIVITIES_DESC = P.quickActivitiesDesc;
export const SCHOOL_SECTION_RECENT = P.sectionRecent;
export const SCHOOL_SECTION_ALERTS = P.sectionAlerts;
export const SCHOOL_SECTION_QUICK = P.sectionQuick;
export const SCHOOL_EMPTY_ACTIVITIES = P.emptyActivities;
export const SCHOOL_EMPTY_ACTIVITIES_HINT = P.emptyActivitiesHint;
export const SCHOOL_EMPTY_TEACHERS = P.emptyTeachers;
export const SCHOOL_EMPTY_CLASSES = P.emptyClasses;
export const SCHOOL_EMPTY_STUDENTS = P.emptyStudents;
export const SCHOOL_EMPTY_STUDENTS_HINT = P.emptyStudentsHint;
export const SCHOOL_ALERT_NO_STUDENTS = P.alertNoStudents;
export const SCHOOL_ALERT_FEW_TEACHERS = P.alertFewTeachers;
export const SCHOOL_ALERT_ACTIVE_ACTIVITIES = P.alertActiveActivities;
export const SCHOOL_TEACHERS_TITLE = P.teachersTitle;
export const SCHOOL_TEACHERS_SUBTITLE = P.teachersSubtitle;
export const SCHOOL_COL_NAME = P.colName;
export const SCHOOL_COL_ROLE = P.colRole;
export const SCHOOL_COL_SUBJECTS = P.colSubjects;
export const SCHOOL_COL_CLASSES = P.colClasses;
export const SCHOOL_COL_STUDENTS = P.colStudents;
export const SCHOOL_COL_ACTIONS = P.colActions;
export const SCHOOL_ROLE_MANAGER = P.roleManager;
export const SCHOOL_ROLE_TEACHER = P.roleTeacher;
export const SCHOOL_MANAGE_SUBJECTS = P.manageSubjects;
export const SCHOOL_VIEW_DETAILS = P.viewDetails;
export const SCHOOL_ALL_SUBJECTS = P.allSubjects;
export const SCHOOL_INACTIVE = P.inactive;
export const SCHOOL_CLASSES_TITLE = P.classesTitle;
export const SCHOOL_CLASSES_SUBTITLE = P.classesSubtitle;
export const SCHOOL_CHOOSE_GRADE = P.chooseGrade;
export const SCHOOL_CHOOSE_PHYSICAL_CLASS = P.choosePhysicalClass;
export const SCHOOL_CHOOSE_SUBJECT = P.chooseSubject;
export const SCHOOL_CHOOSE_STUDENTS = P.chooseStudents;
export const SCHOOL_BACK = P.back;
export const SCHOOL_BACK_GRADES = P.backGrades;
export const SCHOOL_BACK_CLASSES = P.backClasses;
export const SCHOOL_STUDENTS_IN_CLASS = P.studentsInClass;
export const SCHOOL_ACTIVITIES_IN_CLASS = P.activitiesInClass;
export const SCHOOL_TEACHER_LABEL = P.teacherLabel;
export const SCHOOL_SUBJECT_LABEL = P.subjectLabel;
export const SCHOOL_CLASS_LABEL = P.classLabel;
export const SCHOOL_STATUS_LABEL = P.statusLabel;
export const SCHOOL_ACTIVITY_TYPE_LABEL = P.activityTypeLabel;
export const SCHOOL_ARCHIVED = P.archived;
export const SCHOOL_COL_CLASS = P.colClass;
export const SCHOOL_COL_GRADE = P.colGrade;
export const SCHOOL_COL_SUBJECT_FOCUS = P.colSubjectFocus;
export const SCHOOL_COL_TEACHER = P.colTeacher;
export const SCHOOL_COL_MEMBERS = P.colMembers;
export const SCHOOL_VIEW_CLASS_REPORT = P.viewClassReport;
export const SCHOOL_PHYSICAL_CLASS_REPORT_TITLE = P.physicalClassReportTitle;
export const SCHOOL_PHYSICAL_CLASS_REPORT_BUTTON = P.physicalClassReportButton;
export const SCHOOL_PHYSICAL_CLASS_ALL_SUBJECTS = P.physicalClassAllSubjects;
export const SCHOOL_PHYSICAL_CLASS_SUBJECT_BREAKDOWN = P.physicalClassSubjectBreakdown;
export const SCHOOL_PHYSICAL_CLASS_RECENT_ACTIVITIES = P.physicalClassRecentActivities;
export const SCHOOL_PHYSICAL_CLASS_LOADING = P.physicalClassLoading;
export const SCHOOL_TEACHER_CARD_ACTION = P.teacherCardAction;
export const SCHOOL_SUBJECT_REPORT_ACTION = P.subjectReportAction;
export const SCHOOL_STUDENTS_TITLE = P.studentsTitle;
export const SCHOOL_STUDENTS_SUBTITLE = P.studentsSubtitle;
export const SCHOOL_COL_STUDENT = P.colStudent;
export const SCHOOL_COL_LINKED = P.colLinked;
export const SCHOOL_SEARCH_STUDENTS = P.searchStudents;
export const SCHOOL_SEARCH_STUDENTS_PLACEHOLDER = P.searchStudentsPlaceholder;
export const SCHOOL_ENROLL_SECTION = P.enrollSection;
export const SCHOOL_CREATE_STUDENT_SECTION = P.createStudentSection;
export const SCHOOL_CREATE_STUDENT_SUBMIT = P.createStudentSubmit;
export const SCHOOL_CREATE_STUDENT_FULL_NAME = P.createStudentFullName;
export const SCHOOL_CREATE_STUDENT_GRADE = P.createStudentGrade;
export const SCHOOL_CREATE_STUDENT_CLASS = P.createStudentClass;
export const SCHOOL_CREATE_STUDENT_NOTES = P.createStudentNotes;
export const SCHOOL_CREATE_STUDENT_LOGIN = P.createStudentLogin;
export const SCHOOL_CREATE_STUDENT_SUCCESS = P.createStudentSuccess;
export const SCHOOL_CREATE_STUDENT_CLASS_HINT = P.createStudentClassHint;
export const SCHOOL_VIEW_STUDENT_REPORT = P.viewStudentReport;
export const SCHOOL_REPORT_LOADING = P.reportLoading;
export const SCHOOL_REPORT_SUMMARY = P.reportSummary;
export const SCHOOL_REPORT_CLOSE = P.reportClose;
export const SCHOOL_TEACHER_CLASSES_TITLE = P.teacherClassesTitle;
export const SCHOOL_TEACHER_EMPTY_CLASSES = P.teacherEmptyClasses;
export const SCHOOL_TEACHER_CLASS_SUBJECTS_PREFIX = P.teacherClassSubjectsPrefix;
export const SCHOOL_SUBJECTS_TITLE = P.subjectsTitle;
export const SCHOOL_SUBJECT_ADD = P.subjectAdd;
export const SCHOOL_SUBJECT_REMOVE = P.subjectRemove;
export const SCHOOL_ENROLL_STUDENT = P.enrollStudent;
export const SCHOOL_STUDENT_ID = P.studentId;
export const SCHOOL_INVITE_TEACHER_SECTION = P.inviteTeacherSection;
export const SCHOOL_INVITE_TEACHER_SUBMIT = P.inviteTeacherSubmit;
export const SCHOOL_INVITE_TEACHER_HELP = P.inviteTeacherHelp;
export const SCHOOL_INVITE_OPERATOR_SECTION = P.inviteOperatorSection;
export const SCHOOL_INVITE_OPERATOR_SUBMIT = P.inviteOperatorSubmit;
export const SCHOOL_INVITE_OPERATOR_HELP = P.inviteOperatorHelp;
export const SCHOOL_INVITE_EMAIL = P.inviteEmail;
export const SCHOOL_INVITE_SUCCESS = P.inviteSuccess;
export const SCHOOL_INVITE_ADVANCED_UUID = P.inviteAdvancedUuid;
export const SCHOOL_STAFF_LOGIN_TITLE = P.staffLoginTitle;
export const SCHOOL_STAFF_LOGIN_SUBTITLE = P.staffLoginSubtitle;
export const SCHOOL_STAFF_CODE_LABEL = P.staffCodeLabel;
export const SCHOOL_STAFF_PIN_LABEL = P.staffPinLabel;
export const SCHOOL_STAFF_LOGIN_SUBMIT = P.staffLoginSubmit;
export const SCHOOL_STAFF_LOGIN_BUSY = P.staffLoginBusy;
export const SCHOOL_STAFF_LOGIN_FAILED = P.staffLoginFailed;
export const SCHOOL_STAFF_LOGIN_LOCKED = P.staffLoginLocked;
export const SCHOOL_STAFF_LOGIN_SUSPENDED = P.staffLoginSuspended;
export const SCHOOL_STAFF_CREATE_TEACHER_SECTION = P.staffCreateTeacherSection;
export const SCHOOL_STAFF_CREATE_OPERATOR_SECTION = P.staffCreateOperatorSection;
export const SCHOOL_STAFF_CREATE_DISPLAY_NAME = P.staffCreateDisplayName;
export const SCHOOL_STAFF_CREATE_SUBMIT_TEACHER = P.staffCreateSubmitTeacher;
export const SCHOOL_STAFF_CREATE_SUBMIT_OPERATOR = P.staffCreateSubmitOperator;
export const SCHOOL_STAFF_CREATE_SUCCESS = P.staffCreateSuccess;
export const SCHOOL_STAFF_CODE_SHOWN = P.staffCodeShown;
export const SCHOOL_STAFF_PIN_SHOWN = P.staffPinShown;
export const SCHOOL_STAFF_STATUS_ACTIVE = P.staffStatusActive;
export const SCHOOL_STAFF_STATUS_SUSPENDED = P.staffStatusSuspended;
export const SCHOOL_STAFF_RESET_PIN = P.staffResetPin;
export const SCHOOL_STAFF_SUSPEND = P.staffSuspend;
export const SCHOOL_STAFF_REACTIVATE = P.staffReactivate;
export const SCHOOL_STAFF_REGENERATE_CODE = P.staffRegenerateCode;
export const SCHOOL_STAFF_ACTION_BUSY = P.staffActionBusy;
export const SCHOOL_STAFF_INVITE_EMAIL_SECTION = P.staffInviteEmailSection;
export const SCHOOL_STAFF_UUID_ADVANCED = P.staffUuidAdvanced;
export const SCHOOL_STAFF_CHANGE_PIN_TITLE = P.staffChangePinTitle;
export const SCHOOL_STAFF_CHANGE_PIN_REQUIRED = P.staffChangePinRequired;
export const SCHOOL_STAFF_CHANGE_PIN_EXPLANATION = P.staffChangePinExplanation;
export const SCHOOL_STAFF_PIN_CURRENT_LABEL = P.staffPinCurrentLabel;
export const SCHOOL_STAFF_PIN_NEW_LABEL = P.staffPinNewLabel;
export const SCHOOL_STAFF_PIN_CONFIRM_LABEL = P.staffPinConfirmLabel;
export const SCHOOL_STAFF_PIN_SAVE = P.staffPinSave;
export const SCHOOL_STAFF_PIN_CHANGED_SUCCESS = P.staffPinChangedSuccess;
export const SCHOOL_STAFF_PIN_WRONG_CURRENT = P.staffPinWrongCurrent;
export const SCHOOL_STAFF_PIN_INVALID_NEW = P.staffPinInvalidNew;
export const SCHOOL_STAFF_PIN_MISMATCH = P.staffPinMismatch;
export const SCHOOL_STAFF_PIN_CHANGE_BUSY = P.staffPinChangeBusy;
export const SCHOOL_NAV_OPERATORS = P.navOperators;
export const SCHOOL_OPERATORS_TITLE = P.operatorsTitle;
export const SCHOOL_OPERATOR_IDENTITY = P.operatorIdentity;
export const SCHOOL_OPERATOR_NO_TEACHING = P.operatorNoTeaching;
export const SCHOOL_OPERATOR_PERMISSIONS = P.operatorPermissions;
export const SCHOOL_OPERATOR_GRANT_SECTION = P.operatorGrantSection;
export const SCHOOL_OPERATOR_NO_PERMISSIONS = P.operatorNoPermissions;
export const SCHOOL_OPERATOR_UPDATE_PERMISSIONS = P.operatorUpdatePermissions;
export const SCHOOL_OPERATOR_STAFF_LABEL = P.operatorStaffLabel;
export const SCHOOL_NAV_OPERATOR_DASHBOARD = P.navOperatorDashboard;
export const SCHOOL_OPERATOR_DASHBOARD_TITLE = P.operatorDashboardTitle;
export const SCHOOL_OPERATOR_WORKSPACE = P.operatorWorkspace;
export const SCHOOL_OPERATOR_ACCESS_ADMIN_SECTION = P.operatorAccessAdminSection;
export const SCHOOL_OPERATOR_ACCESS_ADMIN_DESC = P.operatorAccessAdminDesc;
export const SCHOOL_OPERATOR_DATA_VIEWER_SECTION = P.operatorDataViewerSection;
export const SCHOOL_OPERATOR_DATA_VIEWER_DESC = P.operatorDataViewerDesc;
export const SCHOOL_OPERATOR_GO_TO_STUDENTS = P.operatorGoToStudents;
export const SCHOOL_OPERATOR_MANAGE_ACCESS = P.operatorManageAccess;
export const SCHOOL_OPERATOR_VIEW_REPORT = P.operatorViewReport;
export const SCHOOL_OPERATOR_NO_PERMISSIONS_DETAIL = P.operatorNoPermissionsDetail;
export const SCHOOL_LINKED_TEACHERS = P.linkedTeachers;
export const SCHOOL_NO_LINKED_TEACHERS = P.noLinkedTeachers;
export const SCHOOL_VIEW_REPORT = P.viewReport;
export const SCHOOL_VIEW_CLASS = P.viewClass;
export const SCHOOL_BACK_TEACHERS = P.backTeachers;
export const SCHOOL_MANAGER_ALL_SUBJECTS = P.managerAllSubjects;
export const SCHOOL_CLASS_MGMT_SECTION = P.classMgmtSection;
export const SCHOOL_CLASS_MGMT_ADD = P.classMgmtAdd;
export const SCHOOL_CLASS_MGMT_NAME = P.classMgmtName;
export const SCHOOL_CLASS_MGMT_GRADE = P.classMgmtGrade;
export const SCHOOL_CLASS_MGMT_CREATE = P.classMgmtCreate;
export const SCHOOL_CLASS_MGMT_EXISTING = P.classMgmtExisting;
export const SCHOOL_CLASS_MGMT_LIST_TITLE = P.classMgmtListTitle;
export const SCHOOL_CLASS_MGMT_CREATE_SUCCESS = P.classMgmtCreateSuccess;
export const SCHOOL_CLASS_MGMT_EMPTY = P.classMgmtEmpty;
export const SCHOOL_CLASS_MGMT_SUBJECT_COUNT = P.classMgmtSubjectCount;
export const SCHOOL_CLASS_MGMT_STUDENT_COUNT = P.classMgmtStudentCount;
export const SCHOOL_ASSIGN_SECTION = P.assignSection;
export const SCHOOL_ASSIGN_CURRENT_CLASS = P.assignCurrentClass;
export const SCHOOL_ASSIGN_CURRENT_GRADE = P.assignCurrentGrade;
export const SCHOOL_ASSIGN_TRANSFER = P.assignTransfer;
export const SCHOOL_ASSIGN_CHOOSE_CLASS = P.assignChooseClass;
export const SCHOOL_ASSIGN_UPDATE = P.assignUpdate;
export const SCHOOL_ASSIGN_SAVED = P.assignSaved;
export const SCHOOL_ASSIGN_NO_CLASS = P.assignNoClass;
export const SCHOOL_ASSIGN_TARGET_GRADE = P.assignTargetGrade;
export const SCHOOL_ACTIVITY_COL_TITLE = P.activityColTitle;
export const SCHOOL_ACTIVITY_COL_META = P.activityColMeta;
export const SCHOOL_ACTIVITY_COL_STATUS = P.activityColStatus;

export const TEACHER_NAV_SCHOOL = T.navSchool;
export const TEACHER_SCHOOL_BADGE = T.schoolBadge;

/** @type {Record<string, string>} */
export const SCHOOL_SUBJECT_LABELS = { ...SUBJECT_LABEL_HE };

/** @type {Record<string, string>} */
export const SCHOOL_ACTIVITY_MODE_LABELS = { ...ACTIVITY_MODE_LABEL_HE };

/** @type {Record<string, string>} */
export const SCHOOL_ACTIVITY_STATUS_LABELS = { ...ACTIVITY_STATUS_LABEL_HE };

/** @type {string[]} */
export const SCHOOL_SUBJECT_ORDER = [...SUBJECT_ORDER];

/**
 * @param {string} template
 * @param {Record<string, string|number|null|undefined>} vars
 */
function fillTemplate(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => {
    const value = vars[key];
    return value == null ? "" : String(value);
  });
}

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
    line: fillTemplate(RS.cohortLine, {
      totalAnswers: cohort.totalAnswers ?? 0,
      accuracy,
      studentCount: cohort.studentCount ?? cohort.studentsCount ?? "-",
    }),
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
    line: fillTemplate(RS.studentLine, {
      totalAnswers: summary.totalAnswers ?? 0,
      accuracy,
      gradeLevel: gradeLevel || "-",
    }),
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
    case LS.strong:
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
    case LS.onTrack:
      return "bg-sky-500/20 text-sky-200 border-sky-400/40";
    case LS.monitoring:
      return "bg-amber-500/20 text-amber-200 border-amber-400/40";
    case LS.needsReinforcement:
      return "bg-orange-500/20 text-orange-200 border-orange-400/40";
    case LS.needsIntervention:
      return "bg-red-500/20 text-red-200 border-red-400/40";
    case LS.lowActivity:
    case LS.notEnoughData:
      return "bg-white/10 text-white/70 border-white/20";
    default:
      return "bg-white/10 text-white/70 border-white/20";
  }
}
