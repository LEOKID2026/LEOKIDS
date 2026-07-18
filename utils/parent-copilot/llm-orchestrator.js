/**
 * Grounded LLM path for Parent Copilot.
 * This module is optional and must degrade safely to deterministic flow.
 */

import { copilotStaticMessage } from "../../lib/parent-copilot/copilot-static-message.js";
import { getLlmGateDecision } from "./rollout-gates.js";
import { clinicalBoundaryJoinedFingerprintHe } from "./answer-composer.js";
import {
  callCopilotLlmPrimaryJson,
  callCopilotLlmOpenAiChatCompletionsJson,
  copilotLlmPrimaryProviderLabel,
  getCopilotLlmFallbackConfig,
  isTransientCopilotLlmFailure,
} from "./copilot-llm-client.js";
import { collectParentFacingOutputQualityIssues } from "./guardrail-validator.js";

/**
 * Try next OpenRouter candidate after unusable output / transient HTTP / model-not-found.
 * Does not apply after validateLlmDraft rejects a successfully parsed draft.
 */
function shouldTryNextFallbackCandidate(res) {
  if (!res || res.ok) return false;
  const r = String(res.reason || "");
  if (r === "invalid_json_output") return true;
  if (r === "empty_assistant_content") return true;
  if (r === "reasoning_only_no_json_content") return true;
  if (isTransientCopilotLlmFailure(res)) return true;
  const st = Number(res.httpStatus);
  if (st === 404) return true;
  return false;
}

/**
 * Non-safety `validateLlmDraft` failures where trying another fallback model may help.
 * Does not apply to clinical/safety/contract/raw-leak/thin-data contradiction/etc.
 * @param {string} reason
 */
export function shouldTryNextFallbackCandidateAfterValidationFailure(reason) {
  const r = String(reason || "").trim();
  /** @type {Set<string>} */
  const retryable = new Set([
    "llm_answer_too_short",
    /** Guardrail `main_focus_missing_practical_action` */
    "llm_main_focus_missing_practical_action",
    /** User-facing label alias (not emitted today; kept for forward compat) */
    "llm_missing_required_practical_action",
    "llm_malformed_hebrew_fragment",
    "llm_malformed_preposition_punctuation",
    /** Legacy / forward alias if surfaced under a different guardrail label */
    "llm_main_focus_missing_practical_magnitude",
    /** Intent-specific short answer for main_focus (guardrail-validator) */
    "llm_main_focus_answer_too_short",
  ]);
  return retryable.has(r);
}

const DEFAULT_TIMEOUT_MS = 9000;

const LLM_CLINICAL_DIAGNOSIS_RES = [
  /דיסלקציה|דיסלקסיה|דיסקלקוליה/u,
  /לקות\s*למידה/u,
  /הפרעת\s*קשב/u,
  /\bADHD\b/i,
  /האבחון\s*הוא/u,
  /האבחנה\s*היא/u,
  /(?:יש\s*לילד|לילד\s*יש).{0,64}(?:דיסלקציה|דיסלקסיה|דיסקלקוליה|לקות\s*למידה|הפרעת\s*קשב|ADHD)/iu,
  /(?:דיסלקציה|דיסלקסיה|דיסקלקוליה|לקות\s*למידה|הפרעת\s*קשב|ADHD).{0,64}(?:יש\s*לילד|לילד\s*יש)/iu,
];

const LLM_CLINICAL_CERTAINTY_RE = /(בוודאות|חד[\s-]*משמעית|אין\s*ספק|ברור\s*ש)/u;

/**
 * @param {string} s
 */
function normalizeWsHe(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

function env(name, fallback = "") {
  let raw;
  try {
    raw = typeof process !== "undefined" && process?.env ? process.env[name] : undefined;
  } catch {
    raw = undefined;
  }
  const v = String(raw ?? "").trim();
  return v || fallback;
}

/** Same predicate as truth-packet executive strength (subject-level wording). */
function utteranceAsksSubjectLevelStrength(u) {
  return /מקצוע|מקצועות|המקצוע\s+ה(חזק|טוב)|איזה\s+מקצוע|באיזה\s+מקצוע|מה\s+המקצוע/u.test(String(u || "").trim());
}

export function buildGroundedPrompt(utterance, truthPacket, parentIntent = "", opts = {}) {
  const responseLocale = String(opts?.responseLocale || opts?.reportLocale || "en").trim() || "en";
  const nar = truthPacket?.contracts?.narrative?.textSlots || {};
  const dl = truthPacket?.derivedLimits || {};
  const globalQ =
    Math.max(
      0,
      Number(truthPacket?.surfaceFacts?.reportQuestionTotalGlobal) || 0,
      Number(truthPacket?.surfaceFacts?.questions) || 0,
    ) || 0;
  const intentLabel = String(parentIntent || "").trim();
  const facts = {
    parentIntent: intentLabel,
    scopeType: truthPacket.scopeType,
    scopeLabel: truthPacket.scopeLabel,
    questions: truthPacket?.surfaceFacts?.questions,
    accuracy: truthPacket?.surfaceFacts?.accuracy,
    observation: String(nar.observation || ""),
    interpretation: String(nar.interpretation || ""),
    action: String(nar.action || ""),
    uncertainty: String(nar.uncertainty || ""),
    cannotConcludeYet: !!dl.cannotConcludeYet,
    recommendationEligible: !!dl.recommendationEligible,
    recommendationIntensityCap: String(dl.recommendationIntensityCap || "RI0"),
    requiredHedges: Array.isArray(truthPacket?.allowedClaimEnvelope?.requiredHedges)
      ? truthPacket.allowedClaimEnvelope.requiredHedges
      : [],
    forbiddenPhrases: Array.isArray(truthPacket?.allowedClaimEnvelope?.forbiddenPhrases)
      ? truthPacket.allowedClaimEnvelope.forbiddenPhrases
      : [],
    reportQuestionTotalGlobal: globalQ,
  };
  // Per-intent guidance for parent-friendly structured answers
  const intentGuidance = (() => {
    switch (intentLabel) {
      case "what_is_going_well": {
        const u = String(utterance || "").trim();
        const asksMiktzoa = utteranceAsksSubjectLevelStrength(u);
        if (asksMiktzoa) {
          return [
            "The question refers to a profession (professional level), not just a single subject.",
            "Block observation: start with a sentence like 'the profession in which the best results were seen is [name of the subject in Hebrew]', then if necessary 'and especially in the subject [name of the subject]' - only what appears in FACTS_JSON.observation.",
            "Mandatory: Do not use the word «the field» in blocks - instead «the profession» or a direct opening with the name of the profession (for example «in English the best results were seen in this period...»).",
            "Formulations such as «the area where the numbers are seen...» are expressly prohibited - this is not appropriate when the parent asked about a profession.",
            "Do not start with a wording that begins only with a specific subject (for example «on the subject of vocabulary...») when the question is about a subject - first the name of the subject, then the prominent subject within the subject.",
            "Block meaning: Briefly explain why it is positive according to FACTS_JSON.interpretation. One percentage of accuracy can be mentioned.",
            "Do not list all professions. Do not write 'according to the report, appear:' or 'the professions that appear'. Do not present an area as having relatively good results if it also appears as a focus for strengthening in the report.",
          ].join("\n");
        }
        return [
          "The question is about where relative progress is seen. The required structure:",
          "Observation block: start with a wording like 'the topic where the best results were seen is...' or 'in... relatively good results were seen' - specify 1-2 specific areas from the FACTS_JSON.observation only.",
          "Block meaning: Briefly explain why this is positive, according to the FACTS_JSON.interpretation. You can mention one percentage of accuracy.",
          "Do not list all professions. Do not write 'according to the report, appear:' or 'the professions that appear'. Do not present an area as having relatively good results if it also appears as a focus for strengthening in the report.",
        ].join("\n");
      }
      case "what_is_still_difficult":
        return [
          "The question is about areas of difficulty. The required structure:",
          "Observation block: start with a direct formulation such as 'the area that currently requires strengthening is...' or 'the areas that require strengthening are...' - specify 1-2 specific areas from the FACTS_JSON.observation.",
          "Block meaning: explanation in calm language, without scary words, according to the FACTS_JSON.interpretation.",
          "Don't diagnose. Don't say 'serious problem'. Use a calm and practical tone.",
        ].join("\n");
      case "what_is_most_important":
        return [
          "The question is what is most important to practice this week. The following structure must be filled in (natural wording, full subject names from FACTS_JSON.observation only):",
          'Block observation - a direct opening sentence in the structure: "This week you should focus mainly on [full topic name] and [additional full topic name if available]."',
          "Block meaning - one short sentence to explain why it is important to focus on each area you mentioned (if there are two areas - two short sentences).",
          'It is mandatory to include a practical homework sentence (within meaning, or another sentence in the same block): "It is recommended to practice for about 10 minutes, 3 times a week, with 5-8 short questions each time."',
          "If FACTS_JSON allows a next_step block - you can put the action statement there; If not - the same sentence (or a close formulation with 10 minutes, 3 times, 5–8 questions, short practice, each time) within the text is still mandatory.",
          "A full stop or punctuation is not allowed immediately after a preposition (in, on, with, of, to) before the subject name - \"in.\", \"in .\", \"in .\", \"in-.\", \"in:.\" are not allowed. Continue immediately after \"b\" with the full subject name.",
          "Don't start with \"seems worth focusing on\" and then a period or dash before the subject. Do not write 'it is possible to arrange what is important first' or 'this is what the report gives at the moment'.",
        ].join("\n");
      case "what_to_do_today":
      case "what_to_do_this_week":
        return [
          "The question is what to do at home. The required structure:",
          "Observation block: start with 'at home it's good to practice...' - specify a specific topic from the FACTS_JSON.observation.",
          "Block meaning: short practical program: 5-10 minutes a day, what topic, type of practice.",
          facts.recommendationEligible && facts.recommendationIntensityCap !== "RI0"
            ? "next_step block: one specific simple step to perform (according to FACTS_JSON.action)."
            : copilotStaticMessage("copilot.answers.utils_parent-copilot_llm-orchestrator.you_must_not_include_a_next_step_block"),
          "Do not write 'it is possible to arrange' or 'this is what the report gives'.",
        ].join("\n");
      case "is_intervention_needed":
        return [
          "The question is whether there is cause for concern. The required structure:",
          "Observation block: start with 'At this stage...' - a calm overview of the state of the report according to FACTS_JSON.observation.",
          "block meaning: explain what the situation is and what the recommended next step is, according to FACTS_JSON.interpretation.",
          "Don't diagnose. Don't panic. Use a calm and practical tone.",
          'Open a calm and professional tone. If there is enough data, you can start with the following: "At this stage there is no reason for concern, but...". After that, it is mandatory to continue according to FACTS_JSON only: if there is an established study finding (according to FACTS_JSON.interpretation), present it clearly and carefully and propose a practical study step; If there is no significant finding in the report, you can reassure briefly. Do not diagnose, do not use medical/psychological language, and do not hide a study finding that exists in the report.',
          "It is forbidden to write \"don't get under pressure\", it is forbidden to write \"nothing to worry about\" in an absolute wording, and it is forbidden to write \"everything is fine\" if there is a study finding in the report.",
        ].join("\n");
      case "ask_subject_specific":
      case "ask_topic_specific":
        return [
          "The question is about a specific profession or topic. The required structure:",
          "Observation block: Specify only what appears on the specific topic in FACTS_JSON.observation.",
          "block meaning: explain what the meaning is; Any short practical suggestion is allowed here or in another sentence in the same block - according to FACTS_JSON.interpretation/action only if they appear there.",
          "If the specific topic has few questions - this can be carefully noted only for this topic.",
          facts.recommendationEligible && facts.recommendationIntensityCap !== "RI0"
            ? "Optional: next_step block - one short home step according to FACTS_JSON.action only."
            : copilotStaticMessage("copilot.answers.utils_parent-copilot_llm-orchestrator.the_next_step_block_must_not_be_included_practical_recommendations"),
        ].join("\n");
      default:
        return [
          "Answer the parent's question directly. The required structure:",
          "Observation block: a short direct answer, based on FACTS_JSON.observation.",
          "block meaning: one practical point from FACTS_JSON.interpretation.",
        ].join("\n");
    }
  })();

  const uTrim = String(utterance || "").trim();
  const subjectStrengthStyleRule =
    intentLabel === "what_is_going_well" && utteranceAsksSubjectLevelStrength(uTrim)
      ? "Style rule for this question: the parent asks about a profession (strong / best). It is forbidden to use the word «the field» in the answer - use «the profession» or open directly with the name of the profession. Examples of a proper opening: «The subject in which the best results were seen is English, especially in the subject of vocabulary» or «In English, the best results were seen in this period, mainly in the subject of vocabulary». Prohibited: «The area where the numbers are visible...»."
      : "";

  return [
    `You are a professional parent helper. Answer in the language matching BCP-47 locale "${responseLocale}" only.`,
    "Use only facts from the FACTS_JSON. It is forbidden to invent facts that are not in it.",
    "Write in simple, direct, and parent-friendly language - not in system language.",
    "Do not use the phrases: 'According to the report, there are:', 'The professions that appear:', 'Focuses with wording', 'This is what the report gives at the moment', 'It is possible to arrange what is important first'.",
    "Natural wording for example: 'This week you should focus mainly on...', 'Relatively good results were seen in...', 'The area that needs strengthening at the moment is...', 'At home you should practice...', 'At this stage it is recommended...', 'The data points to...'.",
    "You must not write a period, colon or dash immediately after a preposition (in, on, with, of, to) before the subject name - always continue immediately with the full subject name. Prohibited example: \"Focus on account\"; Correct: \"to focus on the account\" or \"to focus on the account -\".",
    "Do not use the words 'security', 'security' or confidence about the child; Don't assume an emotional state.",
    "Do not diagnose: Never say that a child has dyslexia, ADHD, a learning disability or any diagnosis. The report is practice data only.",
    `Volume rule: If reportQuestionTotalGlobal >= 100, it is forbidden to write at the level of the period rule: 'Too early to determine', 'There is not enough data', 'Little data', 'Initial direction only', 'It is still not possible to conclude'. Allowed only if capable of a specific subject/subject with few questions.`,
    ...(subjectStrengthStyleRule ? [subjectStrengthStyleRule] : []),
    "SYSTEM RULE - Impossible to bypass: if the question is not about the report, about the child, about learning, about practice, or about learning progress - return exactly: {\"answerBlocks\":[{\"type\":\"observation\",\"textHe\":\"You can ask questions here about the report and the learning progress that appears in it.\",\"source\":\"composed\"},{\"type\":\"meaning\",\"textHe\":\"For example: What should you practice this week? Or where have you seen relatively good results?\",\"source\":\"composed\"}]}. No more content. No report data. No summary child.",
    `Specific instructions for the parent intent (parentIntent=${intentLabel}):\n${intentGuidance}`,
    'Return only JSON in the format {"answerBlocks":[{"type":"observation|meaning|next_step|caution","textHe":"...","source":"composed"}]}',
    `Parent Question: ${String(utterance || "").trim()}`,
    `FACTS_JSON: ${JSON.stringify(facts)}`,
  ].join("\n");
}

/**
 * @param {unknown} payload
 * @param {NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>} truthPacket
 * @param {{ intent?: string }} [hints]
 */
function validateLlmDraft(payload, truthPacket, hints = null) {
  const dl0 = truthPacket?.derivedLimits || {};
  const recommendationOk =
    dl0.recommendationEligible === true && String(dl0.recommendationIntensityCap || "RI0") !== "RI0";
  /** Drop next_step when contracts forbid recommendations — models often add it anyway; same rule as validateAnswerDraft next_step_not_eligible. */
  let blocks = Array.isArray(payload?.answerBlocks)
    ? payload.answerBlocks.map((b) => ({
        type: b?.type,
        answerText: b?.answerText,
        source: b?.source,
      }))
    : [];
  if (!recommendationOk) {
    blocks = blocks.filter((b) => String(b?.type || "") !== "next_step");
  }
  if (blocks.length < 2) return { ok: false, reason: "llm_answer_too_short" };
  if (blocks.length > 4) return { ok: false, reason: "llm_answer_too_long" };
  const allowedTypes = new Set(["observation", "meaning", "next_step", "caution", "uncertainty_reason"]);
  const hasObs = blocks.some((b) => String(b?.type || "") === "observation");
  const hasMean = blocks.some((b) => String(b?.type || "") === "meaning");
  if (!hasObs && !hasMean) return { ok: false, reason: "llm_missing_observation_or_meaning" };

  const joined = blocks.map((b) => String(b?.answerText || "").trim()).join(" ");
  const intent = String(hints?.intent || "").trim();
  const joinedNorm = normalizeWsHe(joined);
  const boundaryNorm = normalizeWsHe(clinicalBoundaryJoinedFingerprintHe());
  const isApprovedClinicalBoundaryCopy = joinedNorm === boundaryNorm;

  if (!isApprovedClinicalBoundaryCopy) {
    for (const re of LLM_CLINICAL_DIAGNOSIS_RES) {
      if (re.test(joined)) return { ok: false, reason: "llm_clinical_diagnosis_language" };
    }
    if (intent === "clinical_boundary" && LLM_CLINICAL_CERTAINTY_RE.test(joined)) {
      return { ok: false, reason: "llm_clinical_certainty_language" };
    }
  }

  for (const b of blocks) {
    const type = String(b?.type || "");
    const textHe = String(b?.answerText || "").trim();
    if (!allowedTypes.has(type) || !answerText) return { ok: false, reason: "llm_invalid_block_shape" };
    for (const ph of truthPacket?.allowedClaimEnvelope?.forbiddenPhrases || []) {
      if (ph && textHe.toLowerCase().includes(String(ph).toLowerCase())) {
        return { ok: false, reason: "llm_forbidden_phrase" };
      }
    }
  }
  if (intent !== "clinical_boundary") {
    const joinedLower = joined.toLowerCase();
    for (const hedge of truthPacket?.allowedClaimEnvelope?.requiredHedges || []) {
      const h = String(hedge || "").trim().toLowerCase();
      if (h && !joinedLower.includes(h)) return { ok: false, reason: "llm_missing_required_hedge" };
    }
  }
  const qualityIssues = collectParentFacingOutputQualityIssues(joined, intent);
  if (qualityIssues.length) {
    return { ok: false, reason: `llm_${qualityIssues[0]}` };
  }

  return {
    ok: true,
    draft: {
      answerBlocks: blocks.map((b) => ({
        type: String(b.type),
        answerText: String(b.answerText || "").trim(),
        source: "composed",
      })),
    },
  };
}

/**
 * @param {{ utterance: string; truthPacket: NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>; parentIntent?: string }} input
 */
function pickLlmFailureFields(response) {
  return {
    ...(response.httpStatus != null ? { httpStatus: response.httpStatus } : {}),
    ...(typeof response.geminiErrorBody === "string" ? { geminiErrorBody: response.geminiErrorBody } : {}),
    ...(typeof response.geminiErrorSummary === "string" ? { geminiErrorSummary: response.geminiErrorSummary } : {}),
    ...(response.geminiErrorParsed !== undefined ? { geminiErrorParsed: response.geminiErrorParsed } : {}),
    ...(typeof response.llmRetryCount === "number" ? { llmRetryCount: response.llmRetryCount } : {}),
    ...(typeof response.invalidJsonRawPreview === "string" && String(response.invalidJsonRawPreview).trim()
      ? { invalidJsonRawPreview: String(response.invalidJsonRawPreview).slice(0, 3000) }
      : {}),
    ...(typeof response.actualModel === "string" && String(response.actualModel).trim()
      ? { actualModel: String(response.actualModel).trim() }
      : {}),
    ...(Array.isArray(response.fallbackAttempts) && response.fallbackAttempts.length
      ? { fallbackAttempts: response.fallbackAttempts.map((a) => ({ ...a })) }
      : {}),
  };
}

/**
 * @param {number} timeoutMs
 * @param {(signal: AbortSignal) => Promise<unknown>} fn
 */
async function withAbortTimeout(timeoutMs, fn) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

export async function maybeGenerateGroundedLlmDraft(input) {
  const gate = getLlmGateDecision();
  if (!gate.enabled) {
    return {
      ok: false,
      reason: "llm_disabled_by_rollout_gate",
      gateReasonCodes: gate.reasonCodes,
    };
  }
  const primaryProvider = copilotLlmPrimaryProviderLabel();
  const prompt = buildGroundedPrompt(input.utterance, input.truthPacket, String(input?.parentIntent || ""), {
    responseLocale: input.responseLocale || input.reportLocale || "en",
  });
  const timeoutMs = Number(env("PARENT_COPILOT_LLM_TIMEOUT_MS", String(DEFAULT_TIMEOUT_MS))) || DEFAULT_TIMEOUT_MS;
  const intentHint = String(input?.parentIntent || "").trim();

  try {
    const primaryRes = await withAbortTimeout(timeoutMs, (sig) => callCopilotLlmPrimaryJson(sig, prompt));
    const primaryReason = primaryRes.ok ? "ok" : String(primaryRes.reason || "llm_provider_error");

    if (primaryRes.ok) {
      const validated = validateLlmDraft(primaryRes.payload, input.truthPacket, { intent: intentHint });
      if (!validated.ok) {
        return {
          ok: false,
          reason: validated.reason || "llm_validation_failed",
          primaryProvider,
          primaryReason: "ok",
          finalProvider: primaryProvider,
        };
      }
      return {
        ok: true,
        draft: validated.draft,
        provider: primaryProvider,
        finalProvider: primaryProvider,
        primaryProvider,
        primaryReason: "ok",
        ...(typeof primaryRes.llmRetryCount === "number" ? { llmRetryCount: primaryRes.llmRetryCount } : {}),
      };
    }

    if (!isTransientCopilotLlmFailure(primaryRes)) {
      return {
        ok: false,
        reason: primaryRes.reason || "llm_provider_error",
        primaryProvider,
        primaryReason,
        finalProvider: primaryProvider,
        ...pickLlmFailureFields(primaryRes),
      };
    }

    const fbCfg = getCopilotLlmFallbackConfig();
    if (!fbCfg) {
      return {
        ok: false,
        reason: primaryRes.reason || "llm_provider_error",
        primaryProvider,
        primaryReason,
        finalProvider: primaryProvider,
        ...pickLlmFailureFields(primaryRes),
      };
    }

    const fallbackProvider = fbCfg.telemetryFallbackProvider;
    const fallbackModels = fbCfg.fallbackModels;
    /** @type {{ model: string; reason: string; httpStatus?: number; actualModel?: string; invalidJsonRawPreview?: string }[]} */
    const fallbackAttempts = [];

    const candidates =
      Array.isArray(fallbackModels) && fallbackModels.length ? fallbackModels : [fbCfg.model];

    for (let i = 0; i < candidates.length; i++) {
      const candidateModel = candidates[i];
      const fallbackRes = await withAbortTimeout(timeoutMs, (sig) =>
        callCopilotLlmOpenAiChatCompletionsJson(sig, prompt, {
          baseUrl: fbCfg.baseUrl,
          apiKey: fbCfg.apiKey,
          model: candidateModel,
          providerKind: fbCfg.kind,
        }),
      );

      const resolvedRouteModel =
        typeof fallbackRes.actualModel === "string" && fallbackRes.actualModel.trim()
          ? fallbackRes.actualModel.trim()
          : candidateModel;

      if (!fallbackRes.ok) {
        fallbackAttempts.push({
          model: candidateModel,
          reason: String(fallbackRes.reason || "error"),
          ...(fallbackRes.httpStatus != null ? { httpStatus: Number(fallbackRes.httpStatus) } : {}),
          actualModel: resolvedRouteModel,
          ...(typeof fallbackRes.invalidJsonRawPreview === "string" && fallbackRes.invalidJsonRawPreview.trim()
            ? { invalidJsonRawPreview: String(fallbackRes.invalidJsonRawPreview).slice(0, 3000) }
            : {}),
        });
        const tryNextNetwork = shouldTryNextFallbackCandidate(fallbackRes) && i < candidates.length - 1;
        if (tryNextNetwork) continue;
        return {
          ok: false,
          reason: fallbackRes.reason || "llm_fallback_provider_error",
          primaryProvider,
          primaryReason,
          fallbackProvider,
          fallbackModels,
          fallbackAttempts,
          fallbackReason: String(fallbackRes.reason || "llm_fallback_provider_error"),
          finalProvider: fallbackProvider,
          ...pickLlmFailureFields(fallbackRes),
        };
      }

      const validatedFb = validateLlmDraft(fallbackRes.payload, input.truthPacket, { intent: intentHint });
      if (validatedFb.ok) {
        fallbackAttempts.push({
          model: candidateModel,
          reason: "ok",
          ...(fallbackRes.httpStatus != null ? { httpStatus: Number(fallbackRes.httpStatus) } : {}),
          actualModel: resolvedRouteModel,
        });
        return {
          ok: true,
          draft: validatedFb.draft,
          provider: resolvedRouteModel,
          finalProvider: resolvedRouteModel,
          primaryProvider,
          primaryReason,
          fallbackProvider,
          fallbackModels,
          fallbackAttempts,
          fallbackReason: "ok",
        };
      }

      const vr = validatedFb.reason || "llm_validation_failed";
      fallbackAttempts.push({
        model: candidateModel,
        reason: `validator_rejected:${vr}`,
        ...(fallbackRes.httpStatus != null ? { httpStatus: Number(fallbackRes.httpStatus) } : {}),
        actualModel: resolvedRouteModel,
      });

      const tryNextQuality =
        shouldTryNextFallbackCandidateAfterValidationFailure(vr) && i < candidates.length - 1;
      if (tryNextQuality) continue;

      return {
        ok: false,
        reason: vr,
        primaryProvider,
        primaryReason,
        fallbackProvider,
        fallbackModels,
        fallbackAttempts,
        fallbackReason: vr,
        finalProvider: resolvedRouteModel,
      };
    }

  } catch (error) {
    return {
      ok: false,
      reason: `llm_exception:${String(error?.message || error || "unknown")}`,
      primaryProvider,
      primaryReason: "exception",
      finalProvider: primaryProvider,
    };
  }
}

export default { maybeGenerateGroundedLlmDraft, shouldTryNextFallbackCandidateAfterValidationFailure };
