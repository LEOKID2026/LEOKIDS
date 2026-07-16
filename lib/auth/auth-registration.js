export const REG_TEACHER_TITLE = "Request account / access";
export const REG_TEACHER_NAME_LABEL = "Full name";
export const REG_TEACHER_EMAIL_LABEL = "Email address";
export const REG_TEACHER_PHONE_LABEL = "Phone number";
export const REG_TEACHER_INTENT_LABEL = "Request type";
export const REG_TEACHER_EXPLANATION_LABEL = "Describe your request";
export const REG_TEACHER_EXPLANATION_HINT =
  "Describe the access you need — private tutor, school representative, or another request.";
export const REG_TEACHER_SUBJECTS_LABEL = "Requested subjects (optional)";
export const REG_TEACHER_DESCRIPTION_LABEL = REG_TEACHER_EXPLANATION_LABEL;
export const REG_TEACHER_INVITE_ONLY_LOGIN_NOTE =
  "Already have an account invited by our team? Sign in here. Need new access? Switch to the private tutor registration tab.";

export const REG_REQUEST_INTENT_OPTIONS = [
  { id: "private_teacher", label: "Private tutor account" },
  { id: "school_representative", label: "School representative / principal" },
  { id: "general_access", label: "General teacher access request" },
  { id: "other", label: "Other — describe below" },
];

/** @param {string} intentId */
export function regRequestIntentLabel(intentId) {
  const opt = REG_REQUEST_INTENT_OPTIONS.find((o) => o.id === intentId);
  return opt?.label || REG_REQUEST_INTENT_OPTIONS[REG_REQUEST_INTENT_OPTIONS.length - 1].label;
}
/** @deprecated use regRequestIntentLabel */
export const regRequestIntentLabelHe = regRequestIntentLabel;
export const REG_TEACHER_SUBMIT = "Submit request";
export const REG_TEACHER_SUCCESS =
  "Your request was received. Our team will review it and contact you soon.";
export const REG_TEACHER_ALREADY_PENDING = "A request is already pending approval.";
export const REG_TEACHER_TAB = "Private tutor registration";
export const REG_TEACHER_LOGIN_TAB = "Sign in";

export const REG_SCHOOL_TITLE = "School registration";
export const REG_SCHOOL_NAME_LABEL = "School name";
export const REG_SCHOOL_CITY_LABEL = "City";
export const REG_SCHOOL_CONTACT_NAME_LABEL = "Contact name";
export const REG_SCHOOL_CONTACT_EMAIL_LABEL = "Contact email";
export const REG_SCHOOL_APPROX_TEACHERS_LABEL = "Approximate number of teachers";
export const REG_SCHOOL_APPROX_STUDENTS_LABEL = "Approximate number of children";
export const REG_SCHOOL_MESSAGE_LABEL = "Notes (optional)";
export const REG_SCHOOL_SUBMIT = "Submit registration request";
export const REG_SCHOOL_SUCCESS =
  "Your registration request was received. Our team will review it and contact you soon.";
export const REG_SCHOOL_LINK = "School registration";

export const PENDING_TEACHER_HEADING = "Your request is pending approval";
export const PENDING_TEACHER_BODY =
  "Your account/access request is pending approval. Our team will review it and update you soon.";
export const PENDING_SCHOOL_HEADING = "Your school registration is pending approval";
export const PENDING_SCHOOL_BODY =
  "Your school registration request was received. Once approved, you'll get access to the management portal.";
export const PENDING_REJECTED_HEADING = "Your request was declined";
export const PENDING_REJECTED_BODY =
  "Your request was declined. For more details, please contact support.";

export const ADMIN_PENDING_REQUESTS_TAB = "Pending requests";
export const ADMIN_APPROVE_ACTION = "Approve request";
export const ADMIN_REJECT_ACTION = "Reject request";
export const ADMIN_REJECT_REASON_LABEL = "Rejection reason (optional)";
export const ADMIN_APPROVED_SUCCESS = "Request approved.";
export const ADMIN_REJECTED_SUCCESS = "Request rejected.";
export const ADMIN_STATUS_PENDING = "Pending approval";
export const ADMIN_REG_REQUEST_PHONE = "Phone";
export const ADMIN_REG_REQUEST_INTENT = "Request type";
export const ADMIN_SEND_PASSWORD_SETUP = "Send password setup link";
export const ADMIN_PASSWORD_SETUP_SENT = "Password setup link sent";
export const ADMIN_PASSWORD_SETUP_NOT_SENT = "Password setup link not yet sent";
export const ADMIN_PASSWORD_SETUP_STATUS = "Password setup status";
export const ADMIN_PASSWORD_SETUP_SENDING = "Sending…";
export const ADMIN_PASSWORD_SETUP_FAILED = "Failed to send the password setup link";

export const SUBJECT_LABELS_HE = {
  math: "Math",
  geometry: "Geometry",
  english: "English",
  hebrew: "Hebrew",
  science: "Science",
  moledet_geography: "Homeland & Geography",
};
