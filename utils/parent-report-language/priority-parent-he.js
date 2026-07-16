/**
 * Map diagnostic priority codes → parent-facing Hebrew (never show P1–P4 to parents).
 * @param {string|null|undefined} level
 * @returns {string|null}
 */
export function priorityLevelParentLabelHe(level) {
  const k = String(level || "").trim().toUpperCase();
  if (!k) return null;
  switch (k) {
    case "P4":
      return "This week it's worth focusing on these topics - in small steps, without pressure.";
    case "P3":
      return "It's worth paying attention this week and scheduling slightly more regular practice around these topics.";
    case "P2":
      return "No special action is needed this week - short, regular practice is enough.";
    case "P1":
      return "There's no topic that needs special focus right now - a short practice routine is enough.";
    default:
      return null;
  }
}
