/** @typedef {"link" | "panel" | "avatar" | "more"} StudentWorldDockKind */

/**
 * @typedef {object} StudentWorldGate
 * @property {string} id
 * @property {string} labelKey
 * @property {string} emoji
 * @property {string} href
 * @property {string} bgClass
 */

/** @type {StudentWorldGate[]} */
export const STUDENT_WORLD_GATES = [
  {
    id: "learning",
    labelKey: "ui.student.gateLearning",
    emoji: "📚",
    href: "/student/learning",
    bgClass: "from-emerald-500 to-emerald-600 border-emerald-300",
  },
  {
    id: "games",
    labelKey: "ui.student.gateGames",
    emoji: "🎮",
    href: "/student/games",
    bgClass: "from-violet-500 to-purple-600 border-violet-300",
  },
  {
    id: "club",
    labelKey: "ui.student.gateClub",
    emoji: "🌐",
    href: "/student/arcade",
    bgClass: "from-sky-500 to-blue-600 border-sky-300",
  },
];

/**
 * @typedef {object} StudentWorldDockItem
 * @property {string} id
 * @property {string} labelKey
 * @property {string} emoji
 * @property {StudentWorldDockKind} kind
 * @property {string} [href]
 * @property {string} [panelId]
 */

/** @type {StudentWorldDockItem[]} */
export const STUDENT_WORLD_DOCK_PRIMARY = [
  { id: "collection", labelKey: "ui.student.dockCollection", emoji: "🃏", kind: "link", href: "/student/cards" },
  { id: "friends", labelKey: "ui.student.dockFriends", emoji: "👫", kind: "link", href: "/student/arcade" },
  { id: "profile", labelKey: "ui.student.dockProfile", emoji: "😊", kind: "avatar" },
  { id: "missions", labelKey: "ui.student.dockMissions", emoji: "✅", kind: "panel", panelId: "missions" },
];

/** Panels reachable from "more" menu — same modals as before. */
export const STUDENT_WORLD_MORE_PANELS = [
  { id: "stats", panelId: "stats", labelKey: "ui.student.panelStats", emoji: "📊" },
  { id: "progress", panelId: "progress", labelKey: "ui.student.panelProgress", emoji: "📈" },
  { id: "classroom", panelId: "classroom", labelKey: "ui.student.panelClassroom", emoji: "📋" },
  { id: "worksheets", panelId: "worksheets", labelKey: "ui.student.panelWorksheets", emoji: "📄" },
  { id: "subjects", panelId: "subjects", labelKey: "ui.student.panelSubjects", emoji: "📚" },
  { id: "badges", panelId: "badges", labelKey: "ui.student.panelBadges", emoji: "🏅" },
  { id: "recommendations", panelId: "recommendations", labelKey: "ui.student.panelRecommendations", emoji: "💡" },
];

/** @param {string} panelId @param {Set<string>} guestLockedPanelSet */
export function isWorldHubPanelLocked(panelId, guestLockedPanelSet) {
  if (!panelId) return false;
  return guestLockedPanelSet?.has(panelId) ?? false;
}
