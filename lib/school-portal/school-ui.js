/**
 * English UI strings for school manager portal.
 * (some still suffixed `He` for call-site compatibility) but all values are
 * English.
 */

import { loadLocaleBundles } from "../i18n/load-messages.js";
import schoolEn from "../../locales/en/school.json" with { type: "json" };

/** @type {string} */
let _schoolUiLocale = "en";

/** Bind school portal copy to interface locale (call from SchoolPortalShell render). */
export function bindSchoolUiLocale(localeId) {
  _schoolUiLocale = localeId || "en";
  refreshSchoolUiBindings();
}

function schoolRoot() {
  const b = loadLocaleBundles(_schoolUiLocale);
  const s = b.school;
  return s && typeof s === "object" ? s : schoolEn;
}

function portalPack() {
  return schoolRoot().portal || schoolEn.portal;
}
function teacherPack() {
  return schoolRoot().teacher || schoolEn.teacher;
}
function learningStatusPack() {
  return schoolRoot().learningStatus || schoolEn.learningStatus;
}
function reportSummaryPack() {
  return schoolRoot().reportSummary || schoolEn.reportSummary;
}
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
  subjectLabel as platformSubjectLabel,
  subjectSelectOptionsHe,
} from "../platform-ui/display-labels.js";



function refreshSchoolUiBindings() {
  SCHOOL_PLATFORM_LABEL = portalPack().platformLabel;
  SCHOOL_NAV_DASHBOARD = portalPack().navDashboard;
  SCHOOL_NAV_TEACHERS = portalPack().navTeachers;
  SCHOOL_NAV_CLASSES = portalPack().navClasses;
  SCHOOL_NAV_STUDENTS = portalPack().navStudents;
  SCHOOL_NAV_MY_TEACHER = portalPack().navMyTeacher;
  SCHOOL_SIGN_OUT = portalPack().signOut || schoolEn.portal.signOut;
  SCHOOL_SIGN_OUT_BUSY = portalPack().signOutBusy || schoolEn.portal.signOutBusy;
  SCHOOL_NAV_MANAGEMENT_MENU = portalPack().navManagementMenu || "Management menu";
  SCHOOL_NAV_OPERATIONS_MENU = portalPack().navOperationsMenu || "Operations menu";
  SCHOOL_LOADING = portalPack().loading;
  SCHOOL_LOADING_DATA = portalPack().loadingData;
  SCHOOL_LOAD_ERROR = portalPack().loadError;
  SCHOOL_CLASS_REPORT_TITLE = portalPack().classReportTitle;
  SCHOOL_STUDENT_REPORT_TITLE = portalPack().studentReportTitle;
  SCHOOL_RETRY = portalPack().retry;
  SCHOOL_REFRESH = portalPack().refresh;
  SCHOOL_DASHBOARD_TITLE = portalPack().dashboardTitle;
  SCHOOL_DASHBOARD_SUBTITLE = portalPack().dashboardSubtitle;
  SCHOOL_STAT_TEACHERS = portalPack().statTeachers;
  SCHOOL_STAT_STUDENTS = portalPack().statStudents;
  SCHOOL_STAT_CLASSES = portalPack().statClasses;
  SCHOOL_STAT_ACTIVITIES = portalPack().statActivities;
  SCHOOL_QUICK_TEACHERS = portalPack().quickTeachers;
  SCHOOL_QUICK_TEACHERS_DESC = portalPack().quickTeachersDesc;
  SCHOOL_QUICK_CLASSES = portalPack().quickClasses;
  SCHOOL_QUICK_CLASSES_DESC = portalPack().quickClassesDesc;
  SCHOOL_QUICK_STUDENTS = portalPack().quickStudents;
  SCHOOL_QUICK_STUDENTS_DESC = portalPack().quickStudentsDesc;
  SCHOOL_QUICK_ACTIVITIES = portalPack().quickActivities;
  SCHOOL_QUICK_ACTIVITIES_DESC = portalPack().quickActivitiesDesc;
  SCHOOL_SECTION_RECENT = portalPack().sectionRecent;
  SCHOOL_SECTION_ALERTS = portalPack().sectionAlerts;
  SCHOOL_SECTION_QUICK = portalPack().sectionQuick;
  SCHOOL_EMPTY_ACTIVITIES = portalPack().emptyActivities;
  SCHOOL_EMPTY_ACTIVITIES_HINT = portalPack().emptyActivitiesHint;
  SCHOOL_EMPTY_TEACHERS = portalPack().emptyTeachers;
  SCHOOL_EMPTY_CLASSES = portalPack().emptyClasses;
  SCHOOL_EMPTY_STUDENTS = portalPack().emptyStudents;
  SCHOOL_EMPTY_STUDENTS_HINT = portalPack().emptyStudentsHint;
  SCHOOL_ALERT_NO_STUDENTS = portalPack().alertNoStudents;
  SCHOOL_ALERT_FEW_TEACHERS = portalPack().alertFewTeachers;
  SCHOOL_ALERT_ACTIVE_ACTIVITIES = portalPack().alertActiveActivities;
  SCHOOL_TEACHERS_TITLE = portalPack().teachersTitle;
  SCHOOL_TEACHERS_SUBTITLE = portalPack().teachersSubtitle;
  SCHOOL_COL_NAME = portalPack().colName;
  SCHOOL_COL_ROLE = portalPack().colRole;
  SCHOOL_COL_SUBJECTS = portalPack().colSubjects;
  SCHOOL_COL_CLASSES = portalPack().colClasses;
  SCHOOL_COL_STUDENTS = portalPack().colStudents;
  SCHOOL_COL_ACTIONS = portalPack().colActions;
  SCHOOL_ROLE_MANAGER = portalPack().roleManager;
  SCHOOL_ROLE_TEACHER = portalPack().roleTeacher;
  SCHOOL_MANAGE_SUBJECTS = portalPack().manageSubjects;
  SCHOOL_VIEW_DETAILS = portalPack().viewDetails;
  SCHOOL_ALL_SUBJECTS = portalPack().allSubjects;
  SCHOOL_INACTIVE = portalPack().inactive;
  SCHOOL_CLASSES_TITLE = portalPack().classesTitle;
  SCHOOL_CLASSES_SUBTITLE = portalPack().classesSubtitle;
  SCHOOL_CHOOSE_GRADE = portalPack().chooseGrade;
  SCHOOL_CHOOSE_PHYSICAL_CLASS = portalPack().choosePhysicalClass;
  SCHOOL_CHOOSE_SUBJECT = portalPack().chooseSubject;
  SCHOOL_CHOOSE_STUDENTS = portalPack().chooseStudents;
  SCHOOL_BACK = portalPack().back;
  SCHOOL_BACK_GRADES = portalPack().backGrades;
  SCHOOL_BACK_CLASSES = portalPack().backClasses;
  SCHOOL_STUDENTS_IN_CLASS = portalPack().studentsInClass;
  SCHOOL_ACTIVITIES_IN_CLASS = portalPack().activitiesInClass;
  SCHOOL_TEACHER_LABEL = portalPack().teacherLabel;
  SCHOOL_SUBJECT_LABEL = portalPack().subjectLabel;
  SCHOOL_CLASS_LABEL = portalPack().classLabel;
  SCHOOL_STATUS_LABEL = portalPack().statusLabel;
  SCHOOL_ACTIVITY_TYPE_LABEL = portalPack().activityTypeLabel;
  SCHOOL_ARCHIVED = portalPack().archived;
  SCHOOL_COL_CLASS = portalPack().colClass;
  SCHOOL_COL_GRADE = portalPack().colGrade;
  SCHOOL_COL_SUBJECT_FOCUS = portalPack().colSubjectFocus;
  SCHOOL_COL_TEACHER = portalPack().colTeacher;
  SCHOOL_COL_MEMBERS = portalPack().colMembers;
  SCHOOL_VIEW_CLASS_REPORT = portalPack().viewClassReport;
  SCHOOL_PHYSICAL_CLASS_REPORT_TITLE = portalPack().physicalClassReportTitle;
  SCHOOL_PHYSICAL_CLASS_REPORT_BUTTON = portalPack().physicalClassReportButton;
  SCHOOL_PHYSICAL_CLASS_ALL_SUBJECTS = portalPack().physicalClassAllSubjects;
  SCHOOL_PHYSICAL_CLASS_SUBJECT_BREAKDOWN = portalPack().physicalClassSubjectBreakdown;
  SCHOOL_PHYSICAL_CLASS_RECENT_ACTIVITIES = portalPack().physicalClassRecentActivities;
  SCHOOL_PHYSICAL_CLASS_LOADING = portalPack().physicalClassLoading;
  SCHOOL_TEACHER_CARD_ACTION = portalPack().teacherCardAction;
  SCHOOL_SUBJECT_REPORT_ACTION = portalPack().subjectReportAction;
  SCHOOL_STUDENTS_TITLE = portalPack().studentsTitle;
  SCHOOL_STUDENTS_SUBTITLE = portalPack().studentsSubtitle;
  SCHOOL_HIDE_ADVANCED_ENROLLMENT = portalPack().hideAdvancedEnrollment || "Hide advanced enrollment";
  SCHOOL_ENROLLING = portalPack().enrolling || "Enrolling…";
  SCHOOL_COL_STUDENT = portalPack().colStudent;
  SCHOOL_COL_LINKED = portalPack().colLinked;
  SCHOOL_SEARCH_STUDENTS = portalPack().searchStudents;
  SCHOOL_SEARCH_STUDENTS_PLACEHOLDER = portalPack().searchStudentsPlaceholder;
  SCHOOL_ENROLL_SECTION = portalPack().enrollSection;
  SCHOOL_CREATE_STUDENT_SECTION = portalPack().createStudentSection;
  SCHOOL_CREATE_STUDENT_SUBMIT = portalPack().createStudentSubmit;
  SCHOOL_CREATE_STUDENT_FULL_NAME = portalPack().createStudentFullName;
  SCHOOL_CREATE_STUDENT_GRADE = portalPack().createStudentGrade;
  SCHOOL_CREATE_STUDENT_CLASS = portalPack().createStudentClass;
  SCHOOL_CREATE_STUDENT_NOTES = portalPack().createStudentNotes;
  SCHOOL_CREATE_STUDENT_LOGIN = portalPack().createStudentLogin;
  SCHOOL_CREATE_STUDENT_SUCCESS = portalPack().createStudentSuccess;
  SCHOOL_CREATE_STUDENT_CLASS_HINT = portalPack().createStudentClassHint;
  SCHOOL_VIEW_STUDENT_REPORT = portalPack().viewStudentReport;
  SCHOOL_REPORT_LOADING = portalPack().reportLoading;
  SCHOOL_REPORT_SUMMARY = portalPack().reportSummary;
  SCHOOL_REPORT_CLOSE = portalPack().reportClose;
  SCHOOL_TEACHER_CLASSES_TITLE = portalPack().teacherClassesTitle;
  SCHOOL_TEACHER_EMPTY_CLASSES = portalPack().teacherEmptyClasses;
  SCHOOL_TEACHER_CLASS_SUBJECTS_PREFIX = portalPack().teacherClassSubjectsPrefix;
  SCHOOL_SUBJECTS_TITLE = portalPack().subjectsTitle;
  SCHOOL_SUBJECT_ADD = portalPack().subjectAdd;
  SCHOOL_SUBJECT_REMOVE = portalPack().subjectRemove;
  SCHOOL_ENROLL_STUDENT = portalPack().enrollStudent;
  SCHOOL_STUDENT_ID = portalPack().studentId;
  SCHOOL_INVITE_TEACHER_SECTION = portalPack().inviteTeacherSection;
  SCHOOL_INVITE_TEACHER_SUBMIT = portalPack().inviteTeacherSubmit;
  SCHOOL_INVITE_TEACHER_HELP = portalPack().inviteTeacherHelp;
  SCHOOL_INVITE_OPERATOR_SECTION = portalPack().inviteOperatorSection;
  SCHOOL_INVITE_OPERATOR_SUBMIT = portalPack().inviteOperatorSubmit;
  SCHOOL_INVITE_OPERATOR_HELP = portalPack().inviteOperatorHelp;
  SCHOOL_INVITE_EMAIL = portalPack().inviteEmail;
  SCHOOL_INVITE_SUCCESS = portalPack().inviteSuccess;
  SCHOOL_INVITE_ADVANCED_UUID = portalPack().inviteAdvancedUuid;
  SCHOOL_STAFF_LOGIN_TITLE = portalPack().staffLoginTitle;
  SCHOOL_STAFF_LOGIN_SUBTITLE = portalPack().staffLoginSubtitle;
  SCHOOL_STAFF_CODE_LABEL = portalPack().staffCodeLabel;
  SCHOOL_STAFF_PIN_LABEL = portalPack().staffPinLabel;
  SCHOOL_STAFF_LOGIN_SUBMIT = portalPack().staffLoginSubmit;
  SCHOOL_STAFF_LOGIN_BUSY = portalPack().staffLoginBusy;
  SCHOOL_STAFF_LOGIN_FAILED = portalPack().staffLoginFailed;
  SCHOOL_STAFF_LOGIN_LOCKED = portalPack().staffLoginLocked;
  SCHOOL_STAFF_LOGIN_SUSPENDED = portalPack().staffLoginSuspended;
  SCHOOL_STAFF_CREATE_TEACHER_SECTION = portalPack().staffCreateTeacherSection;
  SCHOOL_STAFF_CREATE_OPERATOR_SECTION = portalPack().staffCreateOperatorSection;
  SCHOOL_STAFF_CREATE_DISPLAY_NAME = portalPack().staffCreateDisplayName;
  SCHOOL_STAFF_CREATE_SUBMIT_TEACHER = portalPack().staffCreateSubmitTeacher;
  SCHOOL_STAFF_CREATE_SUBMIT_OPERATOR = portalPack().staffCreateSubmitOperator;
  SCHOOL_STAFF_CREATE_SUCCESS = portalPack().staffCreateSuccess;
  SCHOOL_STAFF_CODE_SHOWN = portalPack().staffCodeShown;
  SCHOOL_STAFF_PIN_SHOWN = portalPack().staffPinShown;
  SCHOOL_STAFF_STATUS_ACTIVE = portalPack().staffStatusActive;
  SCHOOL_STAFF_STATUS_SUSPENDED = portalPack().staffStatusSuspended;
  SCHOOL_STAFF_RESET_PIN = portalPack().staffResetPin;
  SCHOOL_STAFF_SUSPEND = portalPack().staffSuspend;
  SCHOOL_STAFF_REACTIVATE = portalPack().staffReactivate;
  SCHOOL_STAFF_REGENERATE_CODE = portalPack().staffRegenerateCode;
  SCHOOL_STAFF_ACTION_BUSY = portalPack().staffActionBusy;
  SCHOOL_STAFF_INVITE_EMAIL_SECTION = portalPack().staffInviteEmailSection;
  SCHOOL_STAFF_UUID_ADVANCED = portalPack().staffUuidAdvanced;
  SCHOOL_STAFF_CHANGE_PIN_TITLE = portalPack().staffChangePinTitle;
  SCHOOL_STAFF_CHANGE_PIN_REQUIRED = portalPack().staffChangePinRequired;
  SCHOOL_STAFF_CHANGE_PIN_EXPLANATION = portalPack().staffChangePinExplanation;
  SCHOOL_STAFF_PIN_CURRENT_LABEL = portalPack().staffPinCurrentLabel;
  SCHOOL_STAFF_PIN_NEW_LABEL = portalPack().staffPinNewLabel;
  SCHOOL_STAFF_PIN_CONFIRM_LABEL = portalPack().staffPinConfirmLabel;
  SCHOOL_STAFF_PIN_SAVE = portalPack().staffPinSave;
  SCHOOL_STAFF_PIN_CHANGED_SUCCESS = portalPack().staffPinChangedSuccess;
  SCHOOL_STAFF_PIN_WRONG_CURRENT = portalPack().staffPinWrongCurrent;
  SCHOOL_STAFF_PIN_INVALID_NEW = portalPack().staffPinInvalidNew;
  SCHOOL_STAFF_PIN_MISMATCH = portalPack().staffPinMismatch;
  SCHOOL_STAFF_PIN_CHANGE_BUSY = portalPack().staffPinChangeBusy;
  SCHOOL_NAV_OPERATORS = portalPack().navOperators;
  SCHOOL_OPERATORS_TITLE = portalPack().operatorsTitle;
  SCHOOL_OPERATOR_IDENTITY = portalPack().operatorIdentity;
  SCHOOL_OPERATOR_NO_TEACHING = portalPack().operatorNoTeaching;
  SCHOOL_OPERATOR_PERMISSIONS = portalPack().operatorPermissions;
  SCHOOL_OPERATOR_GRANT_SECTION = portalPack().operatorGrantSection;
  SCHOOL_OPERATOR_NO_PERMISSIONS = portalPack().operatorNoPermissions;
  SCHOOL_OPERATOR_UPDATE_PERMISSIONS = portalPack().operatorUpdatePermissions;
  SCHOOL_OPERATOR_STAFF_LABEL = portalPack().operatorStaffLabel;
  SCHOOL_NAV_OPERATOR_DASHBOARD = portalPack().navOperatorDashboard;
  SCHOOL_OPERATOR_DASHBOARD_TITLE = portalPack().operatorDashboardTitle;
  SCHOOL_OPERATOR_WORKSPACE = portalPack().operatorWorkspace;
  SCHOOL_OPERATOR_ACCESS_ADMIN_SECTION = portalPack().operatorAccessAdminSection;
  SCHOOL_OPERATOR_ACCESS_ADMIN_DESC = portalPack().operatorAccessAdminDesc;
  SCHOOL_OPERATOR_DATA_VIEWER_SECTION = portalPack().operatorDataViewerSection;
  SCHOOL_OPERATOR_DATA_VIEWER_DESC = portalPack().operatorDataViewerDesc;
  SCHOOL_OPERATOR_GO_TO_STUDENTS = portalPack().operatorGoToStudents;
  SCHOOL_OPERATOR_MANAGE_ACCESS = portalPack().operatorManageAccess;
  SCHOOL_OPERATOR_VIEW_REPORT = portalPack().operatorViewReport;
  SCHOOL_OPERATOR_NO_PERMISSIONS_DETAIL = portalPack().operatorNoPermissionsDetail;
  SCHOOL_LINKED_TEACHERS = portalPack().linkedTeachers;
  SCHOOL_NO_LINKED_TEACHERS = portalPack().noLinkedTeachers;
  SCHOOL_VIEW_REPORT = portalPack().viewReport;
  SCHOOL_VIEW_CLASS = portalPack().viewClass;
  SCHOOL_BACK_TEACHERS = portalPack().backTeachers;
  SCHOOL_MANAGER_ALL_SUBJECTS = portalPack().managerAllSubjects;
  SCHOOL_CLASS_MGMT_SECTION = portalPack().classMgmtSection;
  SCHOOL_CLASS_MGMT_ADD = portalPack().classMgmtAdd;
  SCHOOL_CLASS_MGMT_NAME = portalPack().classMgmtName;
  SCHOOL_CLASS_MGMT_GRADE = portalPack().classMgmtGrade;
  SCHOOL_CLASS_MGMT_CREATE = portalPack().classMgmtCreate;
  SCHOOL_CLASS_MGMT_EXISTING = portalPack().classMgmtExisting;
  SCHOOL_CLASS_MGMT_LIST_TITLE = portalPack().classMgmtListTitle;
  SCHOOL_CLASS_MGMT_CREATE_SUCCESS = portalPack().classMgmtCreateSuccess;
  SCHOOL_CLASS_MGMT_EMPTY = portalPack().classMgmtEmpty;
  SCHOOL_CLASS_MGMT_SUBJECT_COUNT = portalPack().classMgmtSubjectCount;
  SCHOOL_CLASS_MGMT_STUDENT_COUNT = portalPack().classMgmtStudentCount;
  SCHOOL_ASSIGN_SECTION = portalPack().assignSection;
  SCHOOL_ASSIGN_CURRENT_CLASS = portalPack().assignCurrentClass;
  SCHOOL_ASSIGN_CURRENT_GRADE = portalPack().assignCurrentGrade;
  SCHOOL_ASSIGN_TRANSFER = portalPack().assignTransfer;
  SCHOOL_ASSIGN_CHOOSE_CLASS = portalPack().assignChooseClass;
  SCHOOL_ASSIGN_UPDATE = portalPack().assignUpdate;
  SCHOOL_ASSIGN_SAVED = portalPack().assignSaved;
  SCHOOL_ASSIGN_NO_CLASS = portalPack().assignNoClass;
  SCHOOL_ASSIGN_TARGET_GRADE = portalPack().assignTargetGrade;
  SCHOOL_ACTIVITY_COL_TITLE = portalPack().activityColTitle;
  SCHOOL_ACTIVITY_COL_META = portalPack().activityColMeta;
  SCHOOL_ACTIVITY_COL_STATUS = portalPack().activityColStatus;
  TEACHER_NAV_SCHOOL = teacherPack().navSchool;
  TEACHER_SCHOOL_BADGE = teacherPack().schoolBadge;
}

export {
  apiErrorMessageHe,
  auditActionLabelHe,
  roleLabelHe,
  sanitizeActivityTitleHe,
  subjectSelectOptionsHe,
};

export let SCHOOL_PLATFORM_LABEL = "";
export let SCHOOL_NAV_DASHBOARD = "";
export let SCHOOL_NAV_TEACHERS = "";
export let SCHOOL_NAV_CLASSES = "";
export let SCHOOL_NAV_STUDENTS = "";
export let SCHOOL_NAV_MY_TEACHER = "";
export let SCHOOL_SIGN_OUT = "";
export let SCHOOL_SIGN_OUT_BUSY = "";
export let SCHOOL_NAV_MANAGEMENT_MENU = "";
export let SCHOOL_NAV_OPERATIONS_MENU = "";
export let SCHOOL_LOADING = "";
export let SCHOOL_LOADING_DATA = "";
export let SCHOOL_LOAD_ERROR = "";
export let SCHOOL_CLASS_REPORT_TITLE = "";
export let SCHOOL_STUDENT_REPORT_TITLE = "";
export let SCHOOL_RETRY = "";
export let SCHOOL_REFRESH = "";
export let SCHOOL_DASHBOARD_TITLE = "";
export let SCHOOL_DASHBOARD_SUBTITLE = "";
export let SCHOOL_STAT_TEACHERS = "";
export let SCHOOL_STAT_STUDENTS = "";
export let SCHOOL_STAT_CLASSES = "";
export let SCHOOL_STAT_ACTIVITIES = "";
export let SCHOOL_QUICK_TEACHERS = "";
export let SCHOOL_QUICK_TEACHERS_DESC = "";
export let SCHOOL_QUICK_CLASSES = "";
export let SCHOOL_QUICK_CLASSES_DESC = "";
export let SCHOOL_QUICK_STUDENTS = "";
export let SCHOOL_QUICK_STUDENTS_DESC = "";
export let SCHOOL_QUICK_ACTIVITIES = "";
export let SCHOOL_QUICK_ACTIVITIES_DESC = "";
export let SCHOOL_SECTION_RECENT = "";
export let SCHOOL_SECTION_ALERTS = "";
export let SCHOOL_SECTION_QUICK = "";
export let SCHOOL_EMPTY_ACTIVITIES = "";
export let SCHOOL_EMPTY_ACTIVITIES_HINT = "";
export let SCHOOL_EMPTY_TEACHERS = "";
export let SCHOOL_EMPTY_CLASSES = "";
export let SCHOOL_EMPTY_STUDENTS = "";
export let SCHOOL_EMPTY_STUDENTS_HINT = "";
export let SCHOOL_ALERT_NO_STUDENTS = "";
export let SCHOOL_ALERT_FEW_TEACHERS = "";
export let SCHOOL_ALERT_ACTIVE_ACTIVITIES = "";
export let SCHOOL_TEACHERS_TITLE = "";
export let SCHOOL_TEACHERS_SUBTITLE = "";
export let SCHOOL_COL_NAME = "";
export let SCHOOL_COL_ROLE = "";
export let SCHOOL_COL_SUBJECTS = "";
export let SCHOOL_COL_CLASSES = "";
export let SCHOOL_COL_STUDENTS = "";
export let SCHOOL_COL_ACTIONS = "";
export let SCHOOL_ROLE_MANAGER = "";
export let SCHOOL_ROLE_TEACHER = "";
export let SCHOOL_MANAGE_SUBJECTS = "";
export let SCHOOL_VIEW_DETAILS = "";
export let SCHOOL_ALL_SUBJECTS = "";
export let SCHOOL_INACTIVE = "";
export let SCHOOL_CLASSES_TITLE = "";
export let SCHOOL_CLASSES_SUBTITLE = "";
export let SCHOOL_CHOOSE_GRADE = "";
export let SCHOOL_CHOOSE_PHYSICAL_CLASS = "";
export let SCHOOL_CHOOSE_SUBJECT = "";
export let SCHOOL_CHOOSE_STUDENTS = "";
export let SCHOOL_BACK = "";
export let SCHOOL_BACK_GRADES = "";
export let SCHOOL_BACK_CLASSES = "";
export let SCHOOL_STUDENTS_IN_CLASS = "";
export let SCHOOL_ACTIVITIES_IN_CLASS = "";
export let SCHOOL_TEACHER_LABEL = "";
export let SCHOOL_SUBJECT_LABEL = "";
export let SCHOOL_CLASS_LABEL = "";
export let SCHOOL_STATUS_LABEL = "";
export let SCHOOL_ACTIVITY_TYPE_LABEL = "";
export let SCHOOL_ARCHIVED = "";
export let SCHOOL_COL_CLASS = "";
export let SCHOOL_COL_GRADE = "";
export let SCHOOL_COL_SUBJECT_FOCUS = "";
export let SCHOOL_COL_TEACHER = "";
export let SCHOOL_COL_MEMBERS = "";
export let SCHOOL_VIEW_CLASS_REPORT = "";
export let SCHOOL_PHYSICAL_CLASS_REPORT_TITLE = "";
export let SCHOOL_PHYSICAL_CLASS_REPORT_BUTTON = "";
export let SCHOOL_PHYSICAL_CLASS_ALL_SUBJECTS = "";
export let SCHOOL_PHYSICAL_CLASS_SUBJECT_BREAKDOWN = "";
export let SCHOOL_PHYSICAL_CLASS_RECENT_ACTIVITIES = "";
export let SCHOOL_PHYSICAL_CLASS_LOADING = "";
export let SCHOOL_TEACHER_CARD_ACTION = "";
export let SCHOOL_SUBJECT_REPORT_ACTION = "";
export let SCHOOL_STUDENTS_TITLE = "";
export let SCHOOL_STUDENTS_SUBTITLE = "";
export let SCHOOL_HIDE_ADVANCED_ENROLLMENT = "";
export let SCHOOL_ENROLLING = "";
export let SCHOOL_COL_STUDENT = "";
export let SCHOOL_COL_LINKED = "";
export let SCHOOL_SEARCH_STUDENTS = "";
export let SCHOOL_SEARCH_STUDENTS_PLACEHOLDER = "";
export let SCHOOL_ENROLL_SECTION = "";
export let SCHOOL_CREATE_STUDENT_SECTION = "";
export let SCHOOL_CREATE_STUDENT_SUBMIT = "";
export let SCHOOL_CREATE_STUDENT_FULL_NAME = "";
export let SCHOOL_CREATE_STUDENT_GRADE = "";
export let SCHOOL_CREATE_STUDENT_CLASS = "";
export let SCHOOL_CREATE_STUDENT_NOTES = "";
export let SCHOOL_CREATE_STUDENT_LOGIN = "";
export let SCHOOL_CREATE_STUDENT_SUCCESS = "";
export let SCHOOL_CREATE_STUDENT_CLASS_HINT = "";
export let SCHOOL_VIEW_STUDENT_REPORT = "";
export let SCHOOL_REPORT_LOADING = "";
export let SCHOOL_REPORT_SUMMARY = "";
export let SCHOOL_REPORT_CLOSE = "";
export let SCHOOL_TEACHER_CLASSES_TITLE = "";
export let SCHOOL_TEACHER_EMPTY_CLASSES = "";
export let SCHOOL_TEACHER_CLASS_SUBJECTS_PREFIX = "";
export let SCHOOL_SUBJECTS_TITLE = "";
export let SCHOOL_SUBJECT_ADD = "";
export let SCHOOL_SUBJECT_REMOVE = "";
export let SCHOOL_ENROLL_STUDENT = "";
export let SCHOOL_STUDENT_ID = "";
export let SCHOOL_INVITE_TEACHER_SECTION = "";
export let SCHOOL_INVITE_TEACHER_SUBMIT = "";
export let SCHOOL_INVITE_TEACHER_HELP = "";
export let SCHOOL_INVITE_OPERATOR_SECTION = "";
export let SCHOOL_INVITE_OPERATOR_SUBMIT = "";
export let SCHOOL_INVITE_OPERATOR_HELP = "";
export let SCHOOL_INVITE_EMAIL = "";
export let SCHOOL_INVITE_SUCCESS = "";
export let SCHOOL_INVITE_ADVANCED_UUID = "";
export let SCHOOL_STAFF_LOGIN_TITLE = "";
export let SCHOOL_STAFF_LOGIN_SUBTITLE = "";
export let SCHOOL_STAFF_CODE_LABEL = "";
export let SCHOOL_STAFF_PIN_LABEL = "";
export let SCHOOL_STAFF_LOGIN_SUBMIT = "";
export let SCHOOL_STAFF_LOGIN_BUSY = "";
export let SCHOOL_STAFF_LOGIN_FAILED = "";
export let SCHOOL_STAFF_LOGIN_LOCKED = "";
export let SCHOOL_STAFF_LOGIN_SUSPENDED = "";
export let SCHOOL_STAFF_CREATE_TEACHER_SECTION = "";
export let SCHOOL_STAFF_CREATE_OPERATOR_SECTION = "";
export let SCHOOL_STAFF_CREATE_DISPLAY_NAME = "";
export let SCHOOL_STAFF_CREATE_SUBMIT_TEACHER = "";
export let SCHOOL_STAFF_CREATE_SUBMIT_OPERATOR = "";
export let SCHOOL_STAFF_CREATE_SUCCESS = "";
export let SCHOOL_STAFF_CODE_SHOWN = "";
export let SCHOOL_STAFF_PIN_SHOWN = "";
export let SCHOOL_STAFF_STATUS_ACTIVE = "";
export let SCHOOL_STAFF_STATUS_SUSPENDED = "";
export let SCHOOL_STAFF_RESET_PIN = "";
export let SCHOOL_STAFF_SUSPEND = "";
export let SCHOOL_STAFF_REACTIVATE = "";
export let SCHOOL_STAFF_REGENERATE_CODE = "";
export let SCHOOL_STAFF_ACTION_BUSY = "";
export let SCHOOL_STAFF_INVITE_EMAIL_SECTION = "";
export let SCHOOL_STAFF_UUID_ADVANCED = "";
export let SCHOOL_STAFF_CHANGE_PIN_TITLE = "";
export let SCHOOL_STAFF_CHANGE_PIN_REQUIRED = "";
export let SCHOOL_STAFF_CHANGE_PIN_EXPLANATION = "";
export let SCHOOL_STAFF_PIN_CURRENT_LABEL = "";
export let SCHOOL_STAFF_PIN_NEW_LABEL = "";
export let SCHOOL_STAFF_PIN_CONFIRM_LABEL = "";
export let SCHOOL_STAFF_PIN_SAVE = "";
export let SCHOOL_STAFF_PIN_CHANGED_SUCCESS = "";
export let SCHOOL_STAFF_PIN_WRONG_CURRENT = "";
export let SCHOOL_STAFF_PIN_INVALID_NEW = "";
export let SCHOOL_STAFF_PIN_MISMATCH = "";
export let SCHOOL_STAFF_PIN_CHANGE_BUSY = "";
export let SCHOOL_NAV_OPERATORS = "";
export let SCHOOL_OPERATORS_TITLE = "";
export let SCHOOL_OPERATOR_IDENTITY = "";
export let SCHOOL_OPERATOR_NO_TEACHING = "";
export let SCHOOL_OPERATOR_PERMISSIONS = "";
export let SCHOOL_OPERATOR_GRANT_SECTION = "";
export let SCHOOL_OPERATOR_NO_PERMISSIONS = "";
export let SCHOOL_OPERATOR_UPDATE_PERMISSIONS = "";
export let SCHOOL_OPERATOR_STAFF_LABEL = "";
export let SCHOOL_NAV_OPERATOR_DASHBOARD = "";
export let SCHOOL_OPERATOR_DASHBOARD_TITLE = "";
export let SCHOOL_OPERATOR_WORKSPACE = "";
export let SCHOOL_OPERATOR_ACCESS_ADMIN_SECTION = "";
export let SCHOOL_OPERATOR_ACCESS_ADMIN_DESC = "";
export let SCHOOL_OPERATOR_DATA_VIEWER_SECTION = "";
export let SCHOOL_OPERATOR_DATA_VIEWER_DESC = "";
export let SCHOOL_OPERATOR_GO_TO_STUDENTS = "";
export let SCHOOL_OPERATOR_MANAGE_ACCESS = "";
export let SCHOOL_OPERATOR_VIEW_REPORT = "";
export let SCHOOL_OPERATOR_NO_PERMISSIONS_DETAIL = "";
export let SCHOOL_LINKED_TEACHERS = "";
export let SCHOOL_NO_LINKED_TEACHERS = "";
export let SCHOOL_VIEW_REPORT = "";
export let SCHOOL_VIEW_CLASS = "";
export let SCHOOL_BACK_TEACHERS = "";
export let SCHOOL_MANAGER_ALL_SUBJECTS = "";
export let SCHOOL_CLASS_MGMT_SECTION = "";
export let SCHOOL_CLASS_MGMT_ADD = "";
export let SCHOOL_CLASS_MGMT_NAME = "";
export let SCHOOL_CLASS_MGMT_GRADE = "";
export let SCHOOL_CLASS_MGMT_CREATE = "";
export let SCHOOL_CLASS_MGMT_EXISTING = "";
export let SCHOOL_CLASS_MGMT_LIST_TITLE = "";
export let SCHOOL_CLASS_MGMT_CREATE_SUCCESS = "";
export let SCHOOL_CLASS_MGMT_EMPTY = "";
export let SCHOOL_CLASS_MGMT_SUBJECT_COUNT = "";
export let SCHOOL_CLASS_MGMT_STUDENT_COUNT = "";
export let SCHOOL_ASSIGN_SECTION = "";
export let SCHOOL_ASSIGN_CURRENT_CLASS = "";
export let SCHOOL_ASSIGN_CURRENT_GRADE = "";
export let SCHOOL_ASSIGN_TRANSFER = "";
export let SCHOOL_ASSIGN_CHOOSE_CLASS = "";
export let SCHOOL_ASSIGN_UPDATE = "";
export let SCHOOL_ASSIGN_SAVED = "";
export let SCHOOL_ASSIGN_NO_CLASS = "";
export let SCHOOL_ASSIGN_TARGET_GRADE = "";
export let SCHOOL_ACTIVITY_COL_TITLE = "";
export let SCHOOL_ACTIVITY_COL_META = "";
export let SCHOOL_ACTIVITY_COL_STATUS = "";

export let TEACHER_NAV_SCHOOL = "";
export let TEACHER_SCHOOL_BADGE = "";

refreshSchoolUiBindings();

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
export function schoolsubjectLabel(key) {
  return platformSubjectLabel(key);
}

/** @deprecated Alias for existing school portal imports. */
export const schoolSubjectLabelHe = schoolsubjectLabel;

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
    line: fillTemplate(reportSummaryPack().cohortLine, {
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
    line: fillTemplate(reportSummaryPack().studentLine, {
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
    case learningStatusPack().strong:
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
    case learningStatusPack().onTrack:
      return "bg-sky-500/20 text-sky-200 border-sky-400/40";
    case learningStatusPack().monitoring:
      return "bg-amber-500/20 text-amber-200 border-amber-400/40";
    case learningStatusPack().needsReinforcement:
      return "bg-orange-500/20 text-orange-200 border-orange-400/40";
    case learningStatusPack().needsIntervention:
      return "bg-red-500/20 text-red-200 border-red-400/40";
    case learningStatusPack().lowActivity:
    case learningStatusPack().notEnoughData:
      return "bg-white/10 text-white/70 border-white/20";
    default:
      return "bg-white/10 text-white/70 border-white/20";
  }
}
