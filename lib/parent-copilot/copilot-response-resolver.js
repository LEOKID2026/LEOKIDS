/**
 * Resolve Copilot rule-based answer blocks via reportLocale (copilot.* namespace).
 * Supports structured codes alongside legacy textHe during migration.
 */

import { loadLocaleBundles, lookupMessage } from "../i18n/load-messages.js";
import { applyPseudoLong } from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { localizeCopilotBoundaryResponse } from "./copilot-locale-adapters/index.js";

/** Maps legacy Hebrew boundary strings → structured explanation codes. */
const LEGACY_HE_TO_EXPLANATION_CODE = Object.freeze({
  boundary_general_off_topic: "copilot.boundary.generalOffTopic",
  boundary_diagnostic: "copilot.boundary.diagnosticBoundary",
  boundary_health: "copilot.boundary.healthBoundary",
  boundary_privacy: "copilot.boundary.privacyBoundary",
  boundary_peer_comparison: "copilot.boundary.peerComparison",
  boundary_ambiguous: "copilot.boundary.ambiguous",
  boundary_no_data: "copilot.boundary.noDataForRequest",
  boundary_no_data_specific: "copilot.boundary.noDataSpecificForRequest",
});

/** @type {Record<string, string>} */
const BOUNDARY_KEY_TO_EXPLANATION_CODE = Object.freeze({
  generalOffTopic: "copilot.boundary.generalOffTopic",
  diagnosticBoundary: "copilot.boundary.diagnosticBoundary",
  healthBoundary: "copilot.boundary.healthBoundary",
  privacyBoundary: "copilot.boundary.privacyBoundary",
  peerComparison: "copilot.boundary.peerComparison",
  ambiguous: "copilot.boundary.ambiguous",
  noDataForRequest: "copilot.boundary.noDataForRequest",
  noDataSpecificForRequest: "copilot.boundary.noDataSpecificForRequest",
});

/**
 * @param {string|null|undefined} reportLocale
 * @param {string} messageKey
 * @param {Record<string, string|number>} [parameters]
 */
export function resolveCopilotReportMessage(reportLocale, messageKey, parameters = {}) {
  const locale = resolveLocaleDefinition(reportLocale || "en").id;
  const bundles = loadLocaleBundles(locale);
  let text = lookupMessage(bundles, messageKey);
  if (!text) return null;

  if (parameters && typeof parameters === "object") {
    for (const [key, value] of Object.entries(parameters)) {
      text = text.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
    }
  }

  if (locale === "en-XA") {
    text = applyPseudoLong(text);
  }
  return text;
}

/**
 * @param {Record<string, unknown>|null|undefined} block
 * @param {string|null|undefined} reportLocale
 */
export function resolveCopilotAnswerBlockText(block, reportLocale) {
  if (!block || typeof block !== "object") return "";

  const explanationCode = String(block.explanationCode || block.responseCode || "").trim();
  if (explanationCode) {
    const parameters =
      block.parameters && typeof block.parameters === "object"
        ? /** @type {Record<string, string|number>} */ (block.parameters)
        : {};
    const resolved = resolveCopilotReportMessage(reportLocale, explanationCode, parameters);
    if (resolved) return resolved;
  }

  const recommendationCode = String(block.recommendationCode || "").trim();
  if (recommendationCode) {
    const resolved = resolveCopilotReportMessage(reportLocale, recommendationCode, {});
    if (resolved) return resolved;
  }

  const answerText = String(block.answerText || block.textHe || "").trim();
  if (answerText) {
    return localizeCopilotBoundaryResponse(answerText, reportLocale) || answerText;
  }

  return "";
}

/**
 * @param {Array<Record<string, unknown>>|null|undefined} blocks
 * @param {string|null|undefined} reportLocale
 */
export function resolveCopilotAnswerBlocksText(blocks, reportLocale) {
  if (!Array.isArray(blocks) || !blocks.length) return "";
  return blocks
    .map((b) => resolveCopilotAnswerBlockText(b, reportLocale))
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Build a structured answer block (preferred over raw answerText).
 * @param {{
 *   type?: string;
 *   explanationCode: string;
 *   parameters?: Record<string, string|number>;
 *   responseCode?: string;
 *   recommendationCode?: string;
 *   topicCode?: string;
 *   skillCode?: string;
 *   severityCode?: string;
 *   source?: string;
 * }} spec
 */
export function structuredCopilotAnswerBlock(spec) {
  return {
    type: spec.type || "meaning",
    responseCode: spec.responseCode || spec.explanationCode,
    explanationCode: spec.explanationCode,
    recommendationCode: spec.recommendationCode || null,
    parameters: spec.parameters || {},
    topicCode: spec.topicCode || null,
    skillCode: spec.skillCode || null,
    severityCode: spec.severityCode || null,
    source: spec.source || "structured",
  };
}

/**
 * @param {keyof typeof BOUNDARY_KEY_TO_EXPLANATION_CODE} boundaryKey
 * @param {{ type?: string, source?: string }} [opts]
 */
export function boundaryCopilotAnswerBlock(boundaryKey, opts = {}) {
  const explanationCode = BOUNDARY_KEY_TO_EXPLANATION_CODE[boundaryKey];
  return structuredCopilotAnswerBlock({
    type: opts.type || "meaning",
    explanationCode,
    responseCode: explanationCode,
    source: opts.source || "boundary",
  });
}

export { BOUNDARY_KEY_TO_EXPLANATION_CODE, LEGACY_HE_TO_EXPLANATION_CODE };
