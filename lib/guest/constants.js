/** Browser key for guest resume token (opaque UUID). */
export const LIOSH_GUEST_RESUME_TOKEN_KEY = "liosh_guest_resume_token";

export const GUEST_ACCOUNT_KIND = "guest";
export const REGISTERED_ACCOUNT_KIND = "registered";

export const GUEST_STATUS_ACTIVE = "active";
export const GUEST_STATUS_LINKED = "linked";

export const GUEST_SESSION_KIND = "guest";

/** Silent default grade for guest learning masters (no grade picker in UI). */
export const GUEST_DEFAULT_GRADE_LEVEL = "g3";

/** Israeli guest system parent (legacy). Do not use on Global site. */
export const GUEST_SYSTEM_PARENT_EMAIL_IL =
  (typeof process !== "undefined" && process.env?.GUEST_SYSTEM_PARENT_EMAIL_IL) ||
  "guest-system@liosh.invalid";

/**
 * Global guest system parent — separate auth user from IL guest parent.
 * Override with GUEST_SYSTEM_PARENT_EMAIL or GUEST_SYSTEM_PARENT_EMAIL_GLOBAL.
 */
export const GUEST_SYSTEM_PARENT_EMAIL =
  (typeof process !== "undefined" &&
    (process.env?.GUEST_SYSTEM_PARENT_EMAIL_GLOBAL || process.env?.GUEST_SYSTEM_PARENT_EMAIL)) ||
  "guest-system-global@liosh.invalid";

/** Home dashboard panel ids locked for guests. */
export const GUEST_LOCKED_HOME_PANELS = Object.freeze([
  "stats",
  "progress",
  "missions",
  "classroom",
  "worksheets",
  "recommendations",
]);

/** Interface locale keys for guest lock copy (`ui.student.*`). */
export const GUEST_LOCK_MESSAGE_KEY = "ui.student.guestLock";
export const GUEST_GAME_LOCK_MESSAGE_KEY = "ui.student.guestLock";
export const GUEST_TOPIC_LOCK_MESSAGE_KEY = "ui.student.guestTopicLock";
export const GUEST_GAME_LOCK_LABEL_KEY = "ui.student.guestGameLockLabel";
export const GUEST_GAME_LOCK_HINT_KEY = "ui.student.guestGameLockHint";

/** @deprecated use GUEST_LOCK_MESSAGE_KEY with t() */
export const GUEST_LOCK_MESSAGE_HE = GUEST_LOCK_MESSAGE_KEY;
/** @deprecated use GUEST_GAME_LOCK_MESSAGE_KEY with t() */
export const GUEST_GAME_LOCK_MESSAGE_HE = GUEST_GAME_LOCK_MESSAGE_KEY;
/** @deprecated use GUEST_TOPIC_LOCK_MESSAGE_KEY with t() */
export const GUEST_TOPIC_LOCK_MESSAGE_HE = GUEST_TOPIC_LOCK_MESSAGE_KEY;
/** @deprecated use GUEST_GAME_LOCK_LABEL_KEY with t() */
export const GUEST_GAME_LOCK_LABEL_HE = GUEST_GAME_LOCK_LABEL_KEY;
/** @deprecated use GUEST_GAME_LOCK_HINT_KEY with t() */
export const GUEST_GAME_LOCK_HINT_HE = GUEST_GAME_LOCK_HINT_KEY;
