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
export const REG_TEACHER_SUBMIT = "Submit request";
export const REG_TEACHER_SUCCESS =
  "Your request was received. Our team will review it and contact you soon.";
export const REG_TEACHER_ALREADY_PENDING = "A request is already pending approval.";
export const REG_TEACHER_TAB = "Private tutor registration";
export const REG_TEACHER_LOGIN_TAB = "Sign in";
