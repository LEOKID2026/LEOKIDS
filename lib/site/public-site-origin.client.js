import { CANONICAL_PUBLIC_SITE_ORIGIN } from "./canonical-public-site-origin.js";

/** @returns {string} */
export function getPublicSiteOriginClient() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    CANONICAL_PUBLIC_SITE_ORIGIN;
  return String(raw).replace(/\/$/, "");
}

export const PARENT_PORTAL_PATH = "/parent/login";
export const TEACHER_PORTAL_PATH = "/teacher/login";

/** @returns {string} */
export function getTeacherPortalUrl() {
  return `${getPublicSiteOriginClient()}${TEACHER_PORTAL_PATH}`;
}

/** @returns {string} */
export function getParentPortalUrl() {
  return `${getPublicSiteOriginClient()}${PARENT_PORTAL_PATH}`;
}

/**
 * @param {(key: string, vars?: Record<string, unknown>) => string} t
 * @returns {string}
 */
export function buildParentInviteMessage(t) {
  return t("auth.invite.parentMessage", { url: getParentPortalUrl() });
}

/** @deprecated pass t from useT() */
export function buildParentInviteMessageHe(t) {
  return buildParentInviteMessage(t);
}

/**
 * @param {(key: string, vars?: Record<string, unknown>) => string} t
 */
export function buildParentReferralInviteMessage(t) {
  return t("auth.invite.parentReferral", { url: getPublicSiteOriginClient() });
}

/** @deprecated pass t from useT() */
export function buildParentReferralInviteMessageHe(t) {
  return buildParentReferralInviteMessage(t);
}

/**
 * @param {(key: string, vars?: Record<string, unknown>) => string} t
 */
export function buildTeacherReferralInviteMessage(t) {
  return t("auth.invite.teacherReferral", {
    siteUrl: getPublicSiteOriginClient(),
    parentUrl: getParentPortalUrl(),
    teacherUrl: getTeacherPortalUrl(),
  });
}

/** @deprecated pass t from useT() */
export function buildTeacherReferralInviteMessageHe(t) {
  return buildTeacherReferralInviteMessage(t);
}

/**
 * @param {(key: string, vars?: Record<string, unknown>) => string} t
 */
export function buildStudentShareFriendsMessage(t) {
  return t("auth.invite.studentShareFriends", {
    siteUrl: getPublicSiteOriginClient(),
    parentUrl: getParentPortalUrl(),
  });
}

/** @deprecated pass t from useT() */
export function buildStudentShareFriendsMessageHe(t) {
  return buildStudentShareFriendsMessage(t);
}
