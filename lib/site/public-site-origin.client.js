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

/** @returns {string} */
export function buildParentInviteMessageHe() {
  return buildParentInviteMessage();
}

/** @returns {string} */
export function buildParentInviteMessage() {
  const url = getParentPortalUrl();
  return `Hi,
Could you open a Leo Kids learning account for me?

Parent sign-up is here:
${url}

After you create a parent account, you can add me and get a username and login code.`;
}

/** Parent dashboard — invite other parents to discover Leo Kids. */
export function buildParentReferralInviteMessageHe() {
  return buildParentReferralInviteMessage();
}

export function buildParentReferralInviteMessage() {
  const url = getPublicSiteOriginClient();
  return `Hi, I wanted to share Leo Kids — learning practice, games, and progress reports for parents.
Visit here:
${url}`;
}

/** Teacher dashboard — invite other parents and teachers. */
export function buildTeacherReferralInviteMessageHe() {
  return buildTeacherReferralInviteMessage();
}

export function buildTeacherReferralInviteMessage() {
  const siteUrl = getPublicSiteOriginClient();
  const parentUrl = getParentPortalUrl();
  const teacherUrl = getTeacherPortalUrl();
  return `Hi, I wanted to share Leo Kids — practice, games, parent reports, and teacher tools.

Site:
${siteUrl}

Parents:
${parentUrl}

Teachers:
${teacherUrl}`;
}

/** Student home — share site with friends. */
export function buildStudentShareFriendsMessageHe() {
  return buildStudentShareFriendsMessage();
}

export function buildStudentShareFriendsMessage() {
  const siteUrl = getPublicSiteOriginClient();
  const parentUrl = getParentPortalUrl();
  return `Hi!
I wanted to share Leo Kids — practice, games, and progress reports for parents.

Visit here:
${siteUrl}

Want an account too? Ask your parents to create one — parents can sign in here:
${parentUrl}`;
}
