import { isParentDemoMode } from "./parent-demo-mode.client.js";
import { demoPackCopy } from "./demo-pack-copy.js";

/** @type {Record<string, string>} */
const READONLY_MESSAGE_KEYS = Object.freeze({
  create_student: "readOnlyDefault",
  update_student: "readOnlyDefault",
  delete_student: "readOnlyDefault",
  assign_activity: "readOnlyDefault",
  save_permissions: "readOnlyDefault",
  share: "readOnlyShare",
  guest_link: "readOnlyDefault",
  credentials: "readOnlyDefault",
  worksheets_generate: "readOnlyWorksheets",
});

/**
 * @param {string} actionKey
 */
export function assertParentDemoReadOnly(actionKey) {
  if (!isParentDemoMode()) return { allowed: true, message: "" };
  const messageKey = READONLY_MESSAGE_KEYS[actionKey] || READONLY_MESSAGE_KEYS.create_student;
  const message = demoPackCopy("parentPortal", messageKey);
  return { allowed: false, message };
}

export function isParentDemoReadOnlyBlocked(actionKey) {
  return !assertParentDemoReadOnly(actionKey).allowed;
}

export function parentDemoReadOnlyMessage(actionKey) {
  return assertParentDemoReadOnly(actionKey).message;
}

/** @deprecated use parentDemoReadOnlyMessage */
export function parentDemoReadOnlyMessageHe(actionKey) {
  return parentDemoReadOnlyMessage(actionKey);
}
