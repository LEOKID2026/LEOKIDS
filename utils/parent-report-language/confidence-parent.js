/**
 * Map engine confidence levels → parent-facing copy (no raw enums in UI).
 */
import { PARENT_EVIDENCE_VOLUME } from "./parent-evidence-matrix.js";

/**
 * @param {string|null|undefined} level
 * @param {number|null|undefined} [questionCount] optional volume guard for strong wording
 * @returns {string}
 */
export function confidenceLevelParentSummaryHe(level, questionCount = null) {
  const k = String(level || "").trim();
  const q =
    questionCount != null && Number.isFinite(Number(questionCount))
      ? Math.max(0, Math.floor(Number(questionCount)))
      : null;
  const belowStrong = q != null && q < PARENT_EVIDENCE_VOLUME.STRONG_MIN;

  switch (k) {
    case "high":
      if (belowStrong) {
        return "There's an early direction on this topic, but more practice is needed to confirm it's stable.";
      }
      return "A consistent direction is already visible on this topic.";
    case "moderate":
      return "There's an early direction on this topic, but more practice is needed to confirm it's stable.";
    case "low":
      return "It's still early to draw a conclusion on this topic, and more practice will help clarify the picture.";
    case "early_signal_only":
      return "This is only an early signal, so a final direction on this topic hasn't been set yet.";
    case "insufficient_data":
      return "There's still limited material for this topic in the selected period - a bit more practice will create a clearer picture.";
    case "contradictory":
      return "Results on this topic aren't consistent right now, so it's still early to settle on a clear direction.";
    default:
      return "It's still not clear what can be concluded on this topic - for now, short practice and checking again later is best.";
  }
}
