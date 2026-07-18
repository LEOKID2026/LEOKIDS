/**
 * Copilot locale adapters — select boundary copy and normalization by response locale.
 */

import { resolveLocaleDefinition } from "../../i18n/locale-registry.js";
import { applyPseudoLong } from "../../i18n/message-format.js";
import {
  resolveCopilotAnswerBlockText,
  resolveCopilotReportMessage,
} from "../copilot-response-resolver.js";
import {
  AMBIGUOUS_RESPONSE_HE,
  DIAGNOSTIC_BOUNDARY_RESPONSE_HE,
  GENERAL_OFF_TOPIC_RESPONSE_HE,
  HEALTH_BOUNDARY_RESPONSE_HE,
  NO_DATA_FOR_REQUEST_RESPONSE_HE,
  NO_DATA_SPECIFIC_FOR_REQUEST_RESPONSE_HE,
  PEER_COMPARISON_RESPONSE_HE,
  PRIVACY_BOUNDARY_RESPONSE_HE,
} from "../../../utils/parent-copilot/question-classifier.js";
import { getCopilotBoundaryResponse } from "./en.js";

/** @typedef {keyof import('./en.js').COPILOT_BOUNDARY_RESPONSES} BoundaryKey */

const EN_BY_HE = new Map([
  [GENERAL_OFF_TOPIC_RESPONSE_HE, "generalOffTopic"],
  [DIAGNOSTIC_BOUNDARY_RESPONSE_HE, "diagnosticBoundary"],
  [HEALTH_BOUNDARY_RESPONSE_HE, "healthBoundary"],
  [PRIVACY_BOUNDARY_RESPONSE_HE, "privacyBoundary"],
  [PEER_COMPARISON_RESPONSE_HE, "peerComparison"],
  [AMBIGUOUS_RESPONSE_HE, "ambiguous"],
  [NO_DATA_FOR_REQUEST_RESPONSE_HE, "noDataForRequest"],
  [NO_DATA_SPECIFIC_FOR_REQUEST_RESPONSE_HE, "noDataSpecificForRequest"],
]);

/**
 * @param {string|null|undefined} localeId
 */
export function resolveCopilotResponseLocale(localeId) {
  return resolveLocaleDefinition(localeId || "en").id;
}

/**
 * Map legacy Hebrew boundary constant to locale-aware prose.
 * @param {string|null|undefined} legacyHeText
 * @param {string|null|undefined} responseLocale
 */
export function localizeCopilotBoundaryResponse(legacyHeText, responseLocale) {
  const locale = resolveCopilotResponseLocale(responseLocale);
  const key = EN_BY_HE.get(String(legacyHeText || "").trim());
  let text = key ? getCopilotBoundaryResponse(/** @type {BoundaryKey} */ (key)) : legacyHeText || "";
  if (locale === "en-XA") {
    text = applyPseudoLong(text);
  }
  return text;
}

/**
 * @param {string|null|undefined} responseLocale
 */
export function getCopilotBoundaryResponses(responseLocale) {
  const locale = resolveCopilotResponseLocale(responseLocale);
  /** @type {Record<string, string>} */
  const out = {};
  for (const [he, key] of EN_BY_HE.entries()) {
    out[he] = localizeCopilotBoundaryResponse(he, locale);
  }
  return out;
}

/**
 * Apply response locale to a Copilot turn payload (boundary copy + pseudo transforms).
 * @param {Record<string, unknown>|null|undefined} response
 * @param {string|null|undefined} responseLocale
 */
export function applyCopilotResponseLocaleToTurn(response, responseLocale) {
  if (!response || typeof response !== "object") return response;
  const locale = resolveCopilotResponseLocale(responseLocale);
  const out = { ...response };

  if (Array.isArray(out.answerBlocks)) {
    out.answerBlocks = out.answerBlocks.map((block) => {
      if (!block || typeof block !== "object") return block;
      const resolvedText = resolveCopilotAnswerBlockText(block, locale);
      if (!resolvedText) return block;
      return {
        ...block,
        answerText: resolvedText,
        displayText: resolvedText,
      };
    });
  }

  if (typeof out.clarificationQuestionHe === "string" && out.clarificationQuestionHe.trim()) {
    const clarificationKey = String(out.clarificationQuestionKey || "").trim();
    out.clarificationQuestionHe = clarificationKey
      ? resolveCopilotReportMessage(locale, clarificationKey, out.clarificationParameters || {}) ||
        localizeCopilotBoundaryResponse(out.clarificationQuestionHe, locale)
      : localizeCopilotBoundaryResponse(out.clarificationQuestionHe, locale);
  }

  if (out.suggestedFollowUp && typeof out.suggestedFollowUp === "object") {
    const sf = /** @type {{ textHe?: string, recommendationCode?: string, explanationCode?: string, parameters?: object }} */ (
      out.suggestedFollowUp
    );
    const followKey = String(sf.recommendationCode || sf.explanationCode || "").trim();
    const resolvedFollowUp = followKey
      ? resolveCopilotReportMessage(locale, followKey, sf.parameters || {})
      : sf.answerText
        ? localizeCopilotBoundaryResponse(sf.answerText, locale)
        : "";
    if (resolvedFollowUp) {
      out.suggestedFollowUp = {
        ...sf,
        answerText: resolvedFollowUp,
      };
    }
  }

  out.responseLocale = locale;
  return out;
}

export { getCopilotBoundaryResponse } from "./en.js";
