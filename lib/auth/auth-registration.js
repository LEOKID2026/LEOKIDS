/** Interface locale keys for registration flows (`auth.registration.*`). */

export const REG_TEACHER_TITLE = "auth.registration.teacher.title";
export const REG_TEACHER_NAME_LABEL = "auth.registration.teacher.nameLabel";
export const REG_TEACHER_EMAIL_LABEL = "auth.registration.teacher.emailLabel";
export const REG_TEACHER_PHONE_LABEL = "auth.registration.teacher.phoneLabel";
export const REG_TEACHER_INTENT_LABEL = "auth.registration.teacher.intentLabel";
export const REG_TEACHER_EXPLANATION_LABEL = "auth.registration.teacher.explanationLabel";
export const REG_TEACHER_EXPLANATION_HINT = "auth.registration.teacher.explanationHint";
export const REG_TEACHER_SUBJECTS_LABEL = "auth.registration.teacher.subjectsLabel";
export const REG_TEACHER_DESCRIPTION_LABEL = REG_TEACHER_EXPLANATION_LABEL;
export const REG_TEACHER_INVITE_ONLY_LOGIN_NOTE = "auth.registration.teacher.inviteOnlyNote";

export const REG_REQUEST_INTENT_IDS = Object.freeze([
  "private_teacher",
  "school_representative",
  "general_access",
  "other",
]);

export const REG_REQUEST_INTENT_OPTIONS = REG_REQUEST_INTENT_IDS.map((id) => ({
  id,
  labelKey: `auth.registration.intent.${id}`,
}));

/** @param {string} intentId @returns {string} auth.registration.intent.* key */
export function regRequestIntentLabelKey(intentId) {
  const id = REG_REQUEST_INTENT_IDS.includes(intentId) ? intentId : "other";
  return `auth.registration.intent.${id}`;
}

/** @deprecated use regRequestIntentLabelKey with t() */
export function regRequestIntentLabel(intentId) {
  return regRequestIntentLabelKey(intentId);
}

/** @deprecated use regRequestIntentLabelKey with t() */
export const regRequestIntentLabelHe = regRequestIntentLabel;

export const REG_TEACHER_SUBMIT = "auth.registration.teacher.submit";
export const REG_TEACHER_SUCCESS = "auth.registration.teacher.success";
export const REG_TEACHER_ALREADY_PENDING = "auth.registration.teacher.alreadyPending";
export const REG_TEACHER_TAB = "auth.registration.teacher.tab";
export const REG_TEACHER_LOGIN_TAB = "auth.registration.teacher.loginTab";

export const REG_SCHOOL_TITLE = "auth.registration.school.title";
export const REG_SCHOOL_NAME_LABEL = "auth.registration.school.nameLabel";
export const REG_SCHOOL_CITY_LABEL = "auth.registration.school.cityLabel";
export const REG_SCHOOL_CONTACT_NAME_LABEL = "auth.registration.school.contactNameLabel";
export const REG_SCHOOL_CONTACT_EMAIL_LABEL = "auth.registration.school.contactEmailLabel";
export const REG_SCHOOL_APPROX_TEACHERS_LABEL = "auth.registration.school.approxTeachersLabel";
export const REG_SCHOOL_APPROX_STUDENTS_LABEL = "auth.registration.school.approxStudentsLabel";
export const REG_SCHOOL_MESSAGE_LABEL = "auth.registration.school.messageLabel";
export const REG_SCHOOL_SUBMIT = "auth.registration.school.submit";
export const REG_SCHOOL_SUCCESS = "auth.registration.school.success";
export const REG_SCHOOL_LINK = "auth.registration.school.link";

export const PENDING_TEACHER_HEADING = "auth.registration.pending.teacherHeading";
export const PENDING_TEACHER_BODY = "auth.registration.pending.teacherBody";
export const PENDING_SCHOOL_HEADING = "auth.registration.pending.schoolHeading";
export const PENDING_SCHOOL_BODY = "auth.registration.pending.schoolBody";
export const PENDING_REJECTED_HEADING = "auth.registration.pending.rejectedHeading";
export const PENDING_REJECTED_BODY = "auth.registration.pending.rejectedBody";

export const REG_SUBMIT_FAILED_KEY = "auth.registration.errors.submitFailed";
export const REG_NETWORK_ERROR_KEY = "auth.registration.errors.networkError";

export const SUBJECT_LABEL_KEYS = Object.freeze({
  math: "auth.registration.subjects.math",
  geometry: "auth.registration.subjects.geometry",
  english: "auth.registration.subjects.english",
  hebrew: "auth.registration.subjects.hebrew",
  science: "auth.registration.subjects.science",
  moledet_geography: "auth.registration.subjects.moledet_geography",
});
