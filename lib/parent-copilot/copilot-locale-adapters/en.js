/**
 * English Copilot locale adapter — boundary and safety copy for Global.
 */

export const COPILOT_BOUNDARY_RESPONSES = Object.freeze({
  generalOffTopic:
    "I can only help here with your child's report, practice, and progress on the site. You can ask, for example: what to practice this week, what to try at home, or which topic to open as a short activity.",
  diagnosticBoundary:
    "I can only refer to what appears in the practice data on the site. From the report you can see which subjects and topics to strengthen, but this cannot be used to draw personal conclusions about your child. If you like, we can focus on what the report does show: a strong topic, a topic to strengthen, or a small step for home.",
  healthBoundary:
    "I can only refer to the practice data shown on the site. The report is not meant to draw personal conclusions about your child, but to help you see which topic to strengthen in learning. You can continue from here with a small learning step based on the report data.",
  privacyBoundary:
    "I can only help with the report for the child linked to this parent account. I cannot show data for other children, passwords, user lists, or internal system information.",
  peerComparison:
    "The report is based on this child's practice only and does not compare them to other children in the class. You can focus on what appears in the report and ask about a specific topic.",
  ambiguous:
    "I couldn't tell exactly which part of the report you meant. Try asking more simply, for example: what is most important to practice this week, what to try at home, or which topic to open as a short activity.",
  noDataForRequest:
    "The current report does not have enough information to answer this accurately. You can continue with a short practice session on the site, then check again whether a clearer direction appears in the report.",
  noDataSpecificForRequest:
    "The report has practice data for the period, but not enough information to answer this specific point accurately. You can continue with a short practice session on the site, then check again whether a clearer direction appears for this topic.",
});

/**
 * @param {keyof typeof COPILOT_BOUNDARY_RESPONSES} key
 */
export function getCopilotBoundaryResponse(key) {
  return COPILOT_BOUNDARY_RESPONSES[key] || COPILOT_BOUNDARY_RESPONSES.generalOffTopic;
}

export default COPILOT_BOUNDARY_RESPONSES;
