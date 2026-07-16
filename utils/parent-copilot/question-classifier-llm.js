/**
 * Optional LLM upgrade for the Q&A classifier.
 *
 * Called ONLY when the deterministic classifier returns `ambiguous_or_unclear`
 * AND the Gemini gate is enabled. Tiny prompt, low token budget, strict JSON.
 *
 * Failure semantics: any error (timeout, http, JSON parse, missing key, low
 * confidence) returns `{ ok: false, reason }` and the caller falls back to
 * `ambiguous_or_unclear`. We never silently upgrade to `report_related` on a
 * weak LLM response.
 */

import { callCopilotLlmJson } from "./copilot-llm-client.js";
import { CLASSIFIER_THRESHOLDS } from "./question-classifier.js";
import { normalizeSubjectId } from "./contract-reader.js";

const DEFAULT_TIMEOUT_MS = 4000;

const VALID_BUCKETS = new Set([
  "report_related",
  "off_topic",
  "diagnostic_sensitive",
  "ambiguous_or_unclear",
]);

/**
 * @param {string} subjectId
 */
function subjectLabelLocalHe(subjectId) {
  const sid = normalizeSubjectId(subjectId);
  switch (sid) {
    case "math": return "Math";
    case "geometry": return "Geometry";
    case "english": return "English";
    case "science": return "Science";
    case "hebrew": return "Hebrew";
    case "moledet-geography": return "Homeland Studies";
    default: return "";
  }
}

/**
 * Build a tiny per-report context summary for the LLM.
 * Only subjects + a few topic names — never numeric facts.
 * @param {unknown} payload
 */
function buildClassifierContext(payload) {
  /** @type {string[]} */
  const subjects = [];
  /** @type {string[]} */
  const topics = [];
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  for (const sp of profiles) {
    const lbl = subjectLabelLocalHe(sp?.subject);
    if (lbl) subjects.push(lbl);
    const recs = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
    for (const tr of recs.slice(0, 4)) {
      const dn = String(tr?.displayName || "").trim();
      if (dn) topics.push(dn);
    }
  }
  return {
    subjects: Array.from(new Set(subjects)).slice(0, 8),
    topics: Array.from(new Set(topics)).slice(0, 12),
  };
}

/**
 * @param {string} utterance
 * @param {unknown} payload
 */
function buildPrompt(utterance, payload) {
  const ctx = buildClassifierContext(payload);
  return [
    "You categorize parenting questions on a learning report. Return JSON only.",
    "Four categories:",
    "report_related - a question about the child, about his learning, about progress, about practice, or about a subject/subject from the report.",
    "off_topic - a general question that is not about the report/child/learning (weather, recipe, general knowledge, news, etc.).",
    "diagnostic_sensitive - a question that asks for a clinical diagnosis (ADHD, dyslexia, learning disability, emotional state).",
    "ambiguous_or_unclear - a question that is too short, obscure, or it is not clear what it is about.",
    "Decision rules:",
    "General knowledge about a study topic (\"what is X\") is off_topic, even if X appears in the report.",
    "A question about the child on a topic from the report (\"He has difficulty with X\", \"What about X in the report\") is report_related.",
    "An emotional/clinical question is diagnostic_sensitive even if the report has practice data.",
    `Subjects in the report: ${ctx.subjects.join(", ") || "(none)"}.`,
    `Selected topics in the report: ${ctx.topics.join(", ") || "(none)"}.`,
    `Parent Question: ${String(utterance || "").trim()}`,
    'Return only JSON in the format {"bucket":"report_related|off_topic|diagnostic_sensitive|ambiguous_or_unclear","confidence":0..1}.',
  ].join("\n");
}

/**
 * Call the LLM classifier. Always non-throwing; returns ok=false on any failure.
 *
 * @param {{ utterance: string; payload?: unknown; timeoutMs?: number }} args
 * @returns {Promise<{ ok: true; bucket: import("./question-classifier.js").ClassifierBucket; confidence: number; provider?: string } | { ok: false; reason: string }>}
 */
export async function classifyParentQuestionViaLlm({ utterance, payload, timeoutMs }) {
  const u = String(utterance || "").trim();
  if (!u) return { ok: false, reason: "empty_utterance" };

  const ms = Number.isFinite(timeoutMs) ? Number(timeoutMs) : DEFAULT_TIMEOUT_MS;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);

  try {
    const prompt = buildPrompt(u, payload);
    const res = await callCopilotLlmJson(ac.signal, prompt);
    if (!res.ok) {
      return { ok: false, reason: String(res.reason || "llm_call_failed") };
    }
    const payloadJson = res.payload && typeof res.payload === "object" ? res.payload : null;
    if (!payloadJson) {
      return { ok: false, reason: "invalid_json_shape" };
    }
    const bucket = String(payloadJson.bucket || "").trim();
    const confidence = Number(payloadJson.confidence);
    if (!VALID_BUCKETS.has(bucket)) {
      return { ok: false, reason: "invalid_bucket_value" };
    }
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
      return { ok: false, reason: "invalid_confidence_value" };
    }
    if (confidence < CLASSIFIER_THRESHOLDS.llmConfidenceFloor) {
      return { ok: false, reason: "llm_confidence_below_floor" };
    }
    return {
      ok: true,
      bucket: /** @type {import("./question-classifier.js").ClassifierBucket} */ (bucket),
      confidence,
    };
  } catch (e) {
    return { ok: false, reason: `llm_exception:${String(e?.message || e)}` };
  } finally {
    clearTimeout(timer);
  }
}

export default { classifyParentQuestionViaLlm };
