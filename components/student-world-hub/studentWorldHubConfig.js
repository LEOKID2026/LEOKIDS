/** @typedef {"link" | "panel" | "avatar" | "more"} StudentWorldDockKind */

/**
 * @typedef {object} StudentWorldGate
 * @property {string} id
 * @property {string} labelHe
 * @property {string} emoji
 * @property {string} href
 * @property {string} bgClass
 */

/** @type {StudentWorldGate[]} */
export const STUDENT_WORLD_GATES = [
  {
    id: "learning",
    labelHe: "Challenge games",
    emoji: "📚",
    href: "/student/learning",
    bgClass: "from-emerald-500 to-emerald-600 border-emerald-300",
  },
  {
    id: "games",
    labelHe: "Games",
    emoji: "🎮",
    href: "/student/games",
    bgClass: "from-violet-500 to-purple-600 border-violet-300",
  },
  {
    id: "club",
    labelHe: "Online club",
    emoji: "🌐",
    href: "/student/arcade",
    bgClass: "from-sky-500 to-blue-600 border-sky-300",
  },
];

/**
 * @typedef {object} StudentWorldDockItem
 * @property {string} id
 * @property {string} labelHe
 * @property {string} emoji
 * @property {StudentWorldDockKind} kind
 * @property {string} [href]
 * @property {string} [panelId]
 */

/** @type {StudentWorldDockItem[]} */
export const STUDENT_WORLD_DOCK_PRIMARY = [
  { id: "collection", labelHe: "Collection", emoji: "🃏", kind: "link", href: "/student/cards" },
  { id: "friends", labelHe: "Friends", emoji: "👫", kind: "link", href: "/student/arcade" },
  { id: "profile", labelHe: "Profile", emoji: "😊", kind: "avatar" },
  { id: "missions", labelHe: "Missions", emoji: "✅", kind: "panel", panelId: "missions" },
];

/** Panels reachable from "more" menu — same modals as before. */
export const STUDENT_WORLD_MORE_PANELS = [
  { id: "stats", panelId: "stats", labelHe: "My stats", emoji: "📊" },
  { id: "progress", panelId: "progress", labelHe: "My progress", emoji: "📈" },
  { id: "classroom", panelId: "classroom", labelHe: "Activities", emoji: "📋" },
  { id: "worksheets", panelId: "worksheets", labelHe: "Worksheets", emoji: "📄" },
  { id: "subjects", panelId: "subjects", labelHe: "Subjects", emoji: "📚" },
  { id: "badges", panelId: "badges", labelHe: "Badges", emoji: "🏅" },
  { id: "recommendations", panelId: "recommendations", labelHe: "Tips", emoji: "💡" },
];

/** @param {string} panelId @param {Set<string>} guestLockedPanelSet */
export function isWorldHubPanelLocked(panelId, guestLockedPanelSet) {
  if (!panelId) return false;
  return guestLockedPanelSet?.has(panelId) ?? false;
}
