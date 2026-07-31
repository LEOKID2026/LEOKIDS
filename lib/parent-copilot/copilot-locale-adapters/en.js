/**
 * English Copilot locale adapter — boundary and safety copy for Global.
 * Keep in sync with locales/en/copilot.json → boundary.*
 */

export const COPILOT_BOUNDARY_RESPONSES = Object.freeze({
  generalOffTopic:
    "I can only help with your child's report, practice, and progress on the site. Try asking what to practice this week, what to try at home, or which topic to open as a short activity.",
  diagnosticBoundary:
    "I can only use what shows up in the practice data on the site. The report can highlight subjects and topics to strengthen, but it is not a personal diagnosis. We can focus on what the report does show: a strong topic, a topic to strengthen, or a small step for home.",
  healthBoundary:
    "I can only use the practice data shown on the site. The report is not meant to draw personal conclusions about your child — it helps you see which learning topic to strengthen. We can pick a small next learning step from that data.",
  privacyBoundary:
    "I can only help with the report for the child linked to this parent account. I cannot show other children's data, passwords, user lists, or internal system information.",
  peerComparison:
    "The report is based only on this child's practice and does not compare them to other children in the class. You can focus on what appears in the report and ask about a specific topic.",
  ambiguous:
    "I couldn't tell which part of the report you meant. Try a simpler question — for example: what matters most to practice this week, what to try at home, or which topic to open as a short activity.",
  noDataForRequest:
    "This report does not have enough information to answer that accurately yet. Do a short practice session on the site, then check again for a clearer direction.",
  noDataSpecificForRequest:
    "The report has practice data for the period, but not enough to answer this specific point accurately. Do a short practice session on the site, then check again for a clearer direction on this topic.",
});

/**
 * @param {keyof typeof COPILOT_BOUNDARY_RESPONSES} key
 */
export function getCopilotBoundaryResponse(key) {
  return COPILOT_BOUNDARY_RESPONSES[key] || COPILOT_BOUNDARY_RESPONSES.generalOffTopic;
}

export default COPILOT_BOUNDARY_RESPONSES;
