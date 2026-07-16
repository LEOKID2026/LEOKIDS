/**
 * English UI strings for school messaging / access / student-detail surfaces.
 * Full English parity with ./school-communication.he.js — export names kept
 * compatible but all values are English.
 */

export const SC_TAB_LEARNING_REPORT = "Learning report";
export const SC_TAB_ACCESS_ACCOUNTS = "Access & accounts";
export const SC_TAB_STUDENT_ASSIGNMENT = "Manage child assignment";

export const SC_SECTION_STUDENT_ACCOUNT = "Child account";
export const SC_STATUS_ACTIVE = "Active";
export const SC_STATUS_BLOCKED = "Blocked";
export const SC_STATUS_NOT_CREATED = "Not created";
export const SC_STATUS_REVOKED = "Revoked";
export const SC_LAST_LOGIN_NEVER = "Never signed in";
export const SC_LAST_LOGIN_DAYS_AGO = (days) => `${days} days ago`;
export const SC_LAST_LOGIN_TODAY = "Today";
export const SC_BTN_CREATE_ACCOUNT = "Create account";
export const SC_BTN_RESET_PIN = "Reset PIN";
export const SC_BTN_COPY_CREDENTIALS = "Copy credentials";
export const SC_BTN_BLOCK = "Block";
export const SC_BTN_UNBLOCK = "Unblock";
export const SC_BTN_REVOKE = "Revoke access";
export const SC_CONFIRM_REVOKE_STUDENT = "Permanently revoke this child's access?";
export const SC_EMPTY_STUDENT_ACCOUNT = "No account created for this child";

export const SC_SECTION_PARENT_ACCOUNTS = "Parent accounts";
export const SC_BTN_ADD_PARENT = "Add parent access";
export const SC_BTN_LINK_PARENT = "Link existing parent";
export const SC_LABEL_RELATION = "Relation to child";
export const SC_RELATION_MOTHER = "Mother";
export const SC_RELATION_FATHER = "Father";
export const SC_RELATION_GUARDIAN = "Guardian";
export const SC_RELATION_OTHER = "Other";
export const SC_LABEL_DISPLAY_NAME = "Parent name";
export const SC_BTN_DISCONNECT_PARENT = "Disconnect from child";
export const SC_CONFIRM_DISCONNECT_PARENT = "Disconnect this parent from the child?";
export const SC_CONFIRM_REVOKE_PARENT = "Permanently revoke this parent's access?";
export const SC_MUST_CHANGE_PIN_PENDING = "PIN change required on first login";
export const SC_MUST_CHANGE_PIN_DONE = "PIN change completed";
export const SC_EMPTY_PARENT_ACCOUNTS = "No parent accounts created for this child";

export const SC_CREDENTIAL_BOX_HEADING = "Access details";
export const SC_CREDENTIAL_BOX_WARNING = "Save these details now. They will not be shown again.";
export const SC_CREDENTIAL_LABEL_USERNAME = "Username";
export const SC_CREDENTIAL_LABEL_PIN = "Access code";
export const SC_CREDENTIAL_COPIED = "Copied to clipboard";
export const SC_CREDENTIAL_BTN_DISMISS = "OK, I saved it";

export const SC_PIN_GATE_HEADING = "Change access code";
export const SC_PIN_GATE_EXPLANATION =
  "The access code you received is temporary. Choose a new access code before entering the portal.";
export const SC_PIN_GATE_FIELD_CURRENT = "Temporary access code";
export const SC_PIN_GATE_FIELD_NEW = "New access code";
export const SC_PIN_GATE_FIELD_CONFIRM = "Confirm new access code";
export const SC_PIN_GATE_BTN_SUBMIT = "Confirm change";
export const SC_PIN_GATE_SUCCESS = "Access code updated successfully";
export const SC_PIN_GATE_ERROR_WRONG_CURRENT = "The current access code is incorrect";
export const SC_PIN_GATE_ERROR_MISMATCH = "Access codes do not match";
export const SC_PIN_GATE_ERROR_TOO_SHORT = "The access code must have 6 digits";
export const SC_PIN_GATE_ERROR_DIGITS_ONLY = "The access code must contain digits only";

export const SC_NAV_MESSAGES = "Messages";
export const SC_PAGE_MESSAGES_TITLE = "School messages";
export const SC_BTN_COMPOSE = "New message";
export const SC_MESSAGES_EMPTY = "No messages sent yet";
export const SC_COL_SUBJECT = "Subject";
export const SC_COL_AUDIENCE = "Recipients";
export const SC_COL_DATE = "Date";
export const SC_COL_READ_COUNT = "Read";
export const SC_FILTER_ALL = "All";
export const SC_FILTER_PARENTS = "Parents";
export const SC_FILTER_TEACHERS = "Teachers";
export const SC_BADGE_REGULAR = "Regular";
export const SC_BADGE_IMPORTANT = "Important";
export const SC_BADGE_URGENT = "Urgent";
export const SC_BADGE_REQUIRES_CONFIRMATION = "Requires read receipt";

export const SC_COMPOSE_TITLE = "New message";
export const SC_COMPOSE_FIELD_SUBJECT = "Subject (optional)";
export const SC_COMPOSE_FIELD_BODY = "Message content";
export const SC_COMPOSE_FIELD_TYPE = "Message type";
export const SC_COMPOSE_FIELD_AUDIENCE = "Recipients";
export const SC_COMPOSE_BTN_SEND = "Send message";
export const SC_COMPOSE_BTN_CANCEL = "Cancel";
export const SC_COMPOSE_PREVIEW_COUNT = (count) => `${count} recipients will receive this message`;
export const SC_COMPOSE_ERROR_EMPTY_BODY = "Please enter message content";
export const SC_COMPOSE_SUCCESS = "Message sent successfully";

export const SC_AUDIENCE_ALL_PARENTS = "All school parents";
export const SC_AUDIENCE_GRADE_PARENTS = "Grade parents";
export const SC_AUDIENCE_CLASS_PARENTS = "Class parents";
export const SC_AUDIENCE_SPECIFIC_PARENT = "Specific parent";
export const SC_AUDIENCE_ALL_TEACHERS = "All school teachers";
export const SC_AUDIENCE_GRADE_TEACHERS = "Grade teachers";
export const SC_AUDIENCE_SUBJECT_TEACHERS = "Subject teachers";
export const SC_AUDIENCE_CLASS_TEACHERS = "Class teaching staff";
export const SC_AUDIENCE_SPECIFIC_TEACHER = "Specific teacher";

export const SC_NAV_SCHOOL_INBOX_PARENT = "School messages";
export const SC_INBOX_TITLE_PARENT = "Messages from school";
export const SC_INBOX_EMPTY = "No messages from school";
export const SC_BTN_MARK_RECEIVED = "I received it";
export const SC_CONFIRMED_RECEIPT = "Receipt confirmed";
export const SC_BTN_OPEN = "Open";
export const SC_BTN_CLOSE_MESSAGE_DETAIL = "Close";
export const SC_MESSAGE_FROM_SCHOOL_ADMIN = "From school management";
export const SC_MESSAGE_FROM_SCHOOL_PARENT = "From school";
export const SC_BTN_MARK_READ = "Mark as read";
export const SC_COL_ACTION = "Action";

export const SC_FILTER_LAST_7_DAYS = "Last 7 days";
export const SC_FILTER_LAST_30_DAYS = "Last 30 days";
export const SC_FILTER_CUSTOM_RANGE = "Custom date range";
export const SC_LABEL_DATE_FROM = "From date";
export const SC_LABEL_DATE_TO = "To date";

export const SC_SECTION_LEGACY_ACCESS = "Existing non-school access";
export const SC_LEGACY_ACCESS_HINT = "This account was created outside the school system and cannot be managed from here.";
export const SC_BTN_CREATE_NEW_ACCOUNT = "Create new account";
export const SC_REVOKE_RECOVERY_HINT =
  "The previous access was revoked. You can create a new school account with a new username and access code.";

export const SC_NAV_SCHOOL_MESSAGES_TEACHER = "School messages";
export const SC_TEACHER_INBOX_TITLE = "Messages from school management";
export const SC_TEACHER_INBOX_EMPTY = "No messages from school";

export const SC_RECEIPTS_PANEL_TITLE = "Read status";
export const SC_RECEIPTS_TAB_PARENTS = "Parents";
export const SC_RECEIPTS_TAB_TEACHERS = "Teachers";
export const SC_RECEIPTS_READ_COUNT = (read, total) => `Read by ${read} of ${total}`;
export const SC_RECEIPTS_STATUS_READ = "Read";
export const SC_RECEIPTS_STATUS_UNREAD = "Unread";
export const SC_RECEIPTS_STATUS_CONFIRMED = "Receipt confirmed";

export const SC_MINI_REPORT_CARD_TITLE = "Short learning report";
export const SC_MINI_REPORT_LINK_FULL = "View full report";
export const SC_MINI_REPORT_NO_DATA = "No learning data yet";

export const SC_COUNTER_UNREAD_PARENTS = "Unread messages - parents";
export const SC_COUNTER_UNREAD_TEACHERS = "Unread messages - teachers";
export const SC_COUNTER_IMPORTANT_ACTIVE = "Active important messages";

export const SC_LOADING = "Loading…";
export const SC_ERROR_GENERIC = "Error. Please try again.";

export const SC_BTN_STUDENT_DETAILS = "Details";
export const SC_BTN_EDIT_DETAILS = "Edit";
export const SC_BTN_SAVE_DETAILS = "Save";
export const SC_BTN_CANCEL_DETAILS = "Cancel";
export const SC_BTN_ADD_DETAILS = "Add details";
export const SC_BTN_HIDE_DETAILS = "Hide extra details";
export const SC_BTN_CLOSE_DETAILS = "Close";

export const SC_DETAILS_MODAL_TITLE = "Child details";

export const SC_DETAILS_SECTION_STUDENT = "Child details";
export const SC_DETAILS_SECTION_PARENTS = "Parent details";
export const SC_DETAILS_SECTION_ADDRESS = "Address & contact";
export const SC_DETAILS_SECTION_EMERGENCY = "Emergency contact";
export const SC_DETAILS_SECTION_MEDICAL = "Medical info & allergies";
export const SC_DETAILS_SECTION_TRANSPORT = "Transport & notes";
export const SC_DETAILS_SECTION_INTERNAL = "Internal notes";

export const SC_DETAILS_FIELD_STUDENT_NAME = "Child's name";
export const SC_DETAILS_FIELD_GRADE = "Grade";
export const SC_DETAILS_FIELD_CLASS = "Class";
export const SC_DETAILS_FIELD_CHILD_AGE = "Child's age";
export const SC_DETAILS_FIELD_DATE_OF_BIRTH = "Date of birth";
export const SC_DETAILS_FIELD_PARENT1_NAME = "Parent 1 name";
export const SC_DETAILS_FIELD_PARENT1_PHONE = "Parent 1 phone";
export const SC_DETAILS_FIELD_PARENT1_NATIONAL_ID = "Parent 1 national ID";
export const SC_DETAILS_FIELD_PARENT2_NAME = "Parent 2 name";
export const SC_DETAILS_FIELD_PARENT2_PHONE = "Parent 2 phone";
export const SC_DETAILS_FIELD_PARENT2_NATIONAL_ID = "Parent 2 national ID";
export const SC_DETAILS_FIELD_PARENT_EMAIL = "Parent email";
export const SC_DETAILS_FIELD_ADDRESS = "Address";
export const SC_DETAILS_FIELD_EMERGENCY_NAME = "Emergency contact name";
export const SC_DETAILS_FIELD_EMERGENCY_PHONE = "Emergency phone";
export const SC_DETAILS_FIELD_MEDICAL_NOTES = "Medical notes / allergies";
export const SC_DETAILS_FIELD_TRANSPORT_NOTES = "Transport notes";
export const SC_DETAILS_FIELD_INTERNAL_NOTES = "Internal notes";

export const SC_DETAILS_EMPTY_STATE = "No additional details entered for this child.";
export const SC_DETAILS_SAVE_SUCCESS = "Details saved successfully.";
export const SC_DETAILS_SAVE_ERROR = "Could not save details right now. Try again.";
export const SC_DETAILS_NAME_UPDATE_SUCCESS = "Child's name updated successfully.";
export const SC_DETAILS_NAME_UPDATE_ERROR = "Could not update child's name right now. Try again.";
export const SC_DETAILS_READONLY_BADGE = "Read only";
