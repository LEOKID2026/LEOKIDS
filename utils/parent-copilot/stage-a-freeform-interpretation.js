/**
 * Stage A — free-form parent question interpretation (deterministic).
 * Output is the product interpretation object; not display copy and not final scope entity.
 */

import { normalizeFreeformParentUtterance, foldUtteranceForMatch } from "./utterance-normalize.js";
import { SUBJECT_ORDER, subjectLabel } from "./contract-reader.js";

/**
 * @typedef {(
 *   "explain_report" |
 *   "what_is_most_important" |
 *   "what_to_do_today" |
 *   "what_to_do_this_week" |
 *   "why_not_advance" |
 *   "what_is_going_well" |
 *   "what_is_still_difficult" |
 *   "what_not_to_do_now" |
 *   "how_to_tell_child" |
 *   "question_for_teacher" |
 *   "is_intervention_needed" |
 *   "strength_vs_weakness_summary" |
 *   "clarify_term" |
 *   "clinical_boundary" |
 *   "sensitive_education_choice" |
 *   "report_trust_question" |
 *   "parent_policy_refusal" |
 *   "off_report_subject_clarification" |
 *   "off_topic_redirect" |
 *   "simple_parent_explanation" |
 *   "ask_topic_specific" |
 *   "ask_subject_specific" |
 *   "unclear"
 * )} CanonicalParentIntent
 */

/**
 * @typedef {(
 *   "executive" |
 *   "subject" |
 *   "topic" |
 *   "recommendation" |
 *   "confidence_uncertainty" |
 *   "strengths" |
 *   "weaknesses" |
 *   "blocked_advance"
 * )} ScopeClass
 */

/** @type {CanonicalParentIntent[]} */
export const CANONICAL_PARENT_INTENTS = [
  "explain_report",
  "what_is_most_important",
  "what_to_do_today",
  "what_to_do_this_week",
  "why_not_advance",
  "what_is_going_well",
  "what_is_still_difficult",
  "what_not_to_do_now",
  "how_to_tell_child",
  "question_for_teacher",
  "is_intervention_needed",
  "strength_vs_weakness_summary",
  "clarify_term",
  "clinical_boundary",
  "sensitive_education_choice",
  "report_trust_question",
  "parent_policy_refusal",
  "off_report_subject_clarification",
  "off_topic_redirect",
  "simple_parent_explanation",
  "ask_topic_specific",
  "ask_subject_specific",
  "unclear",
];

/**
 * @param {unknown} payload
 */
function listAnchoredTopicRows(payload) {
  /** @type {Array<{ subjectId: string; topicRowKey: string; displayName: string }>} */
  const out = [];
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  const bySubject = Object.fromEntries(profiles.map((sp) => [String(sp?.subject || ""), sp]));
  for (const sid of SUBJECT_ORDER) {
    const sp = bySubject[sid];
    const list = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
    for (const tr of list) {
      const displayNameHe = String(tr?.displayName || "").trim();
      const displayNameFolded = foldUtteranceForMatch(displayNameHe);
      const topicRowKey = String(tr?.topicRowKey || tr?.topicKey || "").trim();
      const nar = tr?.contractsV1?.narrative;
      const anchored = !!(nar && typeof nar === "object" && String(nar?.textSlots?.observation || "").trim());
      if (!topicRowKey || displayNameFolded.length < 2 || !anchored) continue;
      out.push({ subjectId: sid, topicRowKey, displayName: displayNameFolded, displayNameHe });
    }
  }
  return out;
}

/**
 * @param {string} utteranceFolded
 * @param {unknown} payload
 */
function extractTopicHint(utteranceFolded, payload) {
  const rows = listAnchoredTopicRows(payload);
  let best = null;
  for (const row of rows) {
    if (
      utteranceFolded.includes(row.displayName) &&
      (!best || row.displayName.length > best.displayName.length)
    ) {
      best = {
        subjectId: row.subjectId,
        topicRowKey: row.topicRowKey,
        displayName: row.displayNameHe || row.displayName,
      };
    }
  }
  return best;
}

/**
 * @param {string} utteranceFolded
 * @param {unknown} payload
 */
function extractSubjectHint(utteranceFolded, payload) {
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  const present = new Set(profiles.map((p) => String(p?.subject || "")).filter(Boolean));
  const pairs = [];
  for (const sid of SUBJECT_ORDER) {
    if (!present.has(sid)) continue;
    const lf = foldUtteranceForMatch(subjectLabel(sid));
    if (lf.length < 2) continue;
    pairs.push({ id: sid, fold: lf });
  }
  pairs.sort((a, b) => b.fold.length - a.fold.length);
  for (const { id, fold } of pairs) {
    if (fold.length >= 4 && utteranceFolded.includes(fold)) return { subjectId: id, labelFolded: fold };
    if (
      fold.length >= 2 &&
      (utteranceFolded === fold ||
        utteranceFolded.startsWith(`${fold} `) ||
        utteranceFolded.endsWith(` ${fold}`) ||
        utteranceFolded.includes(` ${fold} `))
    ) {
      return { subjectId: id, labelFolded: fold };
    }
  }
  return null;
}

/**
 * @param {string} t
 */
function inferTimeframeHint(t) {
  if (/(?!)/.test(t)) return "today";
  if (/(?!)/.test(t)) return "week";
  if (/(?!)/.test(t)) return "period";
  return "none";
}

/**
 * @param {string} t
 */
function inferToneHint(t) {
  if (/(?!)/.test(t)) return "worried";
  if (/(?!)/.test(t)) return "encouraging";
  return "neutral";
}

/** @type {Record<CanonicalParentIntent, RegExp[]>} */
const INTENT_PARAPHRASES = {
  explain_report: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /what\s+(?:do|does)\s+(?:the\s+)?(?:data|numbers|report)\s+(?:show|mean|say)/i,
    /what\s+do\s+we\s+see\s+in\s+(?:the\s+)?data/i,
    /explain\s+(?:the\s+)?(?:report|numbers|data)/i,
    /explain\s+what\s+(?:appears|is\s+shown)\s+in\s+(?:the\s+)?report/i,
    /what\s+is\s+(?:the\s+)?(?:status|picture|situation)\s+(?:in|on|about|for)/i,
    /what\s+is\s+going\s+on\s+(?:in|on|about|with)/i,
    /summary\s+of\s+(?:the\s+)?report|report\s+summary/i,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  // what_is_most_important: /^ / must not match "What to focus on this week" (prefix-only false positive).
  what_is_most_important: [
    /what\s+is\s+(?:the\s+)?most\s+important\s+(?:right\s+now|today)/i,
    /what\s+should\s+(?:we|i)\s+focus\s+on\s+(?:right\s+now|today)/i,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    // Common phrasings with  /  (exclude weekly focus: "Where should you focus this week?")
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  what_to_do_today: [
    /what\s+should\s+(?:we|i)\s+do\s+(?:right\s+now|today)/i,
    /what\s+is\s+(?:the\s+)?next\s+step/i,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  what_to_do_this_week: [
    /what\s+should\s+(?:we|i)\s+(?:do|practice)\s+this\s+week/i,
    /what\s+is\s+(?:the\s+)?most\s+important(?:\s+(?:thing|to\s+practice))?\s+this\s+week/i,
    /what\s+to\s+practice\s+this\s+week/i,
    /what\s+are\s+(?:the\s+)?next\s+recommendations?/i,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    // Generic home-practice phrasings without time qualifier
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  why_not_advance: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  what_is_going_well: [
    // Category: strength / “where are results strong?” — compositional patterns, not a FAQ list.
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    // Common parent phrasings not covered above
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  what_not_to_do_now: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  what_is_still_difficult: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  how_to_tell_child: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  question_for_teacher: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  is_intervention_needed: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    // Common parent phrasings not covered above
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  strength_vs_weakness_summary: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  clinical_boundary: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /\bADHD\b/i,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/iu,
    /(?!)/iu,
    /(?!)/iu,
  ],
  parent_policy_refusal: [
    /(?!)/u,
    /(?!)/i,
    /(?!)/u,
    /(?!)/u,
  ],
  off_report_subject_clarification: [/(?!)/u],
  report_trust_question: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  sensitive_education_choice: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  clarify_term: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  /** Resolved via payload vocabulary when Stage‑A scores zero (see interpretFreeformStageA rescue). */
  ask_topic_specific: [],
  ask_subject_specific: [],
  off_topic_redirect: [
    // Weather — all spellings (with/without , /)
    /(?!)/u,
    // Time
    /(?!)/u,
    // Jokes
    /(?!)/u,
    // Politics / prime minister
    /(?!)/u,
    // Sports / who won — includes all variants
    /(?!)/u,
    // Recipes / food (non-learning)
    /(?!)/u,
    // Crypto
    /(?!)/u,
    // Code / programming
    /(?!)/iu,
    // Shopping
    /(?!)/u,
    // Songs
    /(?!)/u,
    // News (non-report)
    /(?!)/u,
    // General knowledge / hobbies not related to learning
    /(?!)/u,
  ],
  simple_parent_explanation: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
    /explain\s+(?:it\s+|this\s+|what\s+appears\s+in\s+the\s+report\s+)?(?:to\s+me\s+)?(?:like|as)\s+(?:i\s+am\s+a\s+|a\s+|you\s+would\s+to\s+a\s+)?parent/i,
    /explain\s+(?:in\s+)?(?:plain|simple)\s+(?:language|words|terms)(?:\s+without\s+jargon)?/i,
    /without\s+(?:professional\s+)?jargon/i,
    /give\s+me\s+(?:just\s+)?3\s+points/i,
    /in\s+one\s+sentence/i,
  ],
  unclear: [/^$/u],
};

/** @type {Record<ScopeClass, RegExp[]>} */
const SCOPE_CLASS_SIGNALS = {
  recommendation: [
    /(?!)/u,
    /(?!)/u,
  ],
  confidence_uncertainty: [
    /(?!)/u,
    /(?!)/u,
  ],
  strengths: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  weaknesses: [
    /(?!)/u,
    /(?!)/u,
    /(?!)/u,
  ],
  blocked_advance: [
    /(?!)/u,
    /(?!)/u,
  ],
  executive: [],
  subject: [],
  topic: [],
};

/**
 * @param {string} folded
 */
function bestScopeClassFromSignals(folded) {
  /** @type {Array<{ k: ScopeClass; s: number }>} */
  const scores = [];
  for (const [k, patterns] of Object.entries(SCOPE_CLASS_SIGNALS)) {
    if (!patterns.length) continue;
    let s = 0;
    for (const re of patterns) {
      if (re.test(folded)) s += 1;
    }
    if (s > 0) scores.push({ k: /** @type {ScopeClass} */ (k), s });
  }
  scores.sort((a, b) => b.s - a.s);
  return scores[0]?.k || null;
}

/**
 * Strength-vs-weakness: one-sided wording → strengths/weaknesses; both sides → executive.
 * @param {string} folded
 * @returns {ScopeClass}
 */
function strengthVsInterpretationScopeFromFolded(folded) {
  const st = SCOPE_CLASS_SIGNALS.strengths;
  const wk = SCOPE_CLASS_SIGNALS.weaknesses;
  let sStr = 0;
  let sWeak = 0;
  for (const re of st) {
    if (re.test(folded)) sStr += 1;
  }
  for (const re of wk) {
    if (re.test(folded)) sWeak += 1;
  }
  if (sStr > 0 && sWeak > 0) return "executive";
  if (sWeak > sStr) return "weaknesses";
  if (sStr > sWeak) return "strengths";
  return "executive";
}

/**
 * Obvious non-learning utterances (weather, shopping, code, news, …).
 * @param {string} t normalized lowercase utterance
 * @param {string} folded folded utterance
 */
function offTopicUtteranceHeuristic(t, folded) {
  const s = `${t}\n${folded}`;
  return (
    // Weather — all spellings (with/without , /)
    /(?!)/u.test(s) ||
    /(?!)/u.test(s) ||
    /(?!)/u.test(s) ||
    // Politics / prime minister
    /(?!)/u.test(s) ||
    // Sports / who won
    /(?!)/u.test(s) ||
    /(?!)/u.test(s) ||
    /(?!)/u.test(s) ||
    /(?!)/iu.test(s) ||
    /(?!)/u.test(s) ||
    /(?!)/u.test(s) ||
    /(?!)/u.test(s)
  );
}

/**
 * Free-form Stage A interpretation.
 * @param {string} utteranceRaw
 * @param {unknown} payload
 */
export function interpretFreeformStageA(utteranceRaw, payload) {
  const normalizedUtterance = normalizeFreeformParentUtterance(String(utteranceRaw || ""));
  const t = normalizedUtterance.toLowerCase().replace(/\s+/g, " ").trim();
  const folded = foldUtteranceForMatch(normalizedUtterance);
  const topicHintEarly = payload ? extractTopicHint(folded, payload) : null;
  const subjectHintEarly = payload ? extractSubjectHint(folded, payload) : null;

  /** @type {Record<CanonicalParentIntent, number>} */
  const scores = /** @type {any} */ ({});
  for (const intent of CANONICAL_PARENT_INTENTS) scores[intent] = 0;

  for (const [intent, patterns] of Object.entries(INTENT_PARAPHRASES)) {
    if (intent === "unclear") continue;
    let s = 0;
    for (const re of patterns) {
      if (re.test(t) || re.test(folded)) s += 1;
    }
    scores[/** @type {CanonicalParentIntent} */ (intent)] = s;
  }

  if (offTopicUtteranceHeuristic(t, folded)) {
    scores.off_topic_redirect = Math.max(scores.off_topic_redirect || 0, 12);
  }

  // Product QA equivalence overrides for high-frequency free-form phrasings.
  if (/(?!)/.test(t) || /(?!)/.test(folded)) {
    scores.what_to_do_this_week += 3;
  }
  if (
    (/(?!)/.test(t) || /(?!)/.test(folded)) ||
    (/(?!)/.test(t) || /(?!)/.test(folded))
  ) {
    scores.strength_vs_weakness_summary += 3;
  }
  if (/(?!)/.test(t) || /(?!)/.test(folded)) {
    scores.strength_vs_weakness_summary += 4;
  }
  if (/(?!)/u.test(t) || /(?!)/u.test(folded)) {
    scores.explain_report += 4;
  }
  if (/(?!)/u.test(t) || /(?!)/u.test(folded)) {
    scores.what_to_do_today += 6;
  }
  if (
    /(?!)/u.test(t) ||
    /(?!)/u.test(folded) ||
    /explain\s+(?:it\s+|this\s+|what\s+appears\s+in\s+the\s+report\s+)?(?:to\s+me\s+)?(?:like|as)\s+(?:i\s+am\s+a\s+|a\s+|you\s+would\s+to\s+a\s+)?parent/i.test(
      t,
    ) ||
    /explain\s+(?:in\s+)?(?:plain|simple)\s+(?:language|words|terms)/i.test(t)
  ) {
    scores.simple_parent_explanation += 10;
  }
  if (/(?!)/u.test(t) || /(?!)/u.test(folded)) {
    scores.what_is_going_well += 10;
  }
  const weekPlanningCue = /(?!)/u;
  if (
    (/(?!)/u.test(t) || /(?!)/u.test(folded)) &&
    !weekPlanningCue.test(t) &&
    !weekPlanningCue.test(folded)
  ) {
    scores.what_is_most_important += 10;
  }
  if (/(?!)/u.test(t) || /(?!)/u.test(folded)) {
    scores.what_to_do_this_week += 10;
  }

  let best = /** @type {CanonicalParentIntent} */ ("unclear");
  let bestScore = 0;
  let second = 0;
  /** How many distinct intents share the top score (for ties). */
  let topIntentCount = 0;
  for (const intent of CANONICAL_PARENT_INTENTS) {
    if (intent === "unclear") continue;
    const v = scores[intent] || 0;
    if (v > bestScore) {
      second = bestScore;
      bestScore = v;
      best = intent;
    } else if (v > second) {
      second = v;
    }
  }
  if (bestScore === 0) best = "unclear";
  else {
    for (const intent of CANONICAL_PARENT_INTENTS) {
      if (intent === "unclear") continue;
      if ((scores[intent] || 0) === bestScore) topIntentCount += 1;
    }
  }

  if ((scores.clinical_boundary || 0) > 0) {
    best = "clinical_boundary";
    bestScore = scores.clinical_boundary || 0;
    topIntentCount = 1;
    second = 0;
  }

  if ((scores.off_topic_redirect || 0) >= 8 && best !== "clinical_boundary") {
    best = "off_topic_redirect";
    bestScore = scores.off_topic_redirect || 0;
    topIntentCount = 1;
    second = 0;
  }

  if (
    ((scores.off_report_subject_clarification || 0) > 0 ||
      /(?!)/u.test(folded)) &&
    best !== "clinical_boundary"
  ) {
    best = "off_report_subject_clarification";
    bestScore = Math.max(scores.off_report_subject_clarification || 0, 8);
    topIntentCount = 1;
    second = 0;
  }

  if ((scores.parent_policy_refusal || 0) > 0 && best !== "clinical_boundary") {
    best = "parent_policy_refusal";
    bestScore = Math.max(scores.parent_policy_refusal || 0, 9);
    topIntentCount = 1;
    second = 0;
  }

  /** Product routing: clinical / health labels must hit clinical_boundary composer — not generic executive summary. */
  if (
    (/(?!)/i.test(t) ||
      /(?!)/u.test(folded) ||
      /(?!)/u.test(
        t,
      )) &&
    best !== "parent_policy_refusal"
  ) {
    best = "clinical_boundary";
    bestScore = 20;
    topIntentCount = 1;
    second = 0;
  }

  /** School placement / tutoring — use sensitive-education draft (bounded), not explain_report dump. */
  if (
    (/(?!)/u.test(t) ||
      /(?!)/u.test(folded)) &&
    best !== "clinical_boundary" &&
    best !== "parent_policy_refusal"
  ) {
    best = "sensitive_education_choice";
    bestScore = 20;
    topIntentCount = 1;
    second = 0;
  }

  /** QA catalog: these read as   /   — route to recommendation intent for numbered steps in Copilot. */
  if (
    (/(?!)/u.test(
      t,
    ) ||
      /(?!)/u.test(
        folded,
      )) &&
    best !== "clinical_boundary" &&
    best !== "parent_policy_refusal"
  ) {
    best = "what_to_do_this_week";
    bestScore = 20;
    topIntentCount = 1;
    second = 0;
  }

  if (
    (scores.sensitive_education_choice || 0) > 0 &&
    best !== "clinical_boundary" &&
    best !== "parent_policy_refusal" &&
    best !== "off_report_subject_clarification"
  ) {
    best = "sensitive_education_choice";
    bestScore = scores.sensitive_education_choice || 0;
    topIntentCount = 1;
    second = 0;
  }

  if (
    ((scores.report_trust_question || 0) > 0 ||
      /(?!)/u.test(folded)) &&
    best !== "clinical_boundary" &&
    best !== "sensitive_education_choice" &&
    best !== "parent_policy_refusal" &&
    best !== "off_report_subject_clarification"
  ) {
    best = "report_trust_question";
    bestScore = Math.max(scores.report_trust_question || 0, 5);
    topIntentCount = 1;
    second = 0;
  }

  if ((scores.what_not_to_do_now || 0) > 0 && best !== "clinical_boundary") {
    const n = scores.what_not_to_do_now || 0;
    const d = scores.what_is_still_difficult || 0;
    if (n >= d) {
      best = "what_not_to_do_now";
      bestScore = n;
      topIntentCount = 1;
      second = 0;
    }
  }

  // Short topic/subject follow-ups (e.g. "What about geometry?") often score zero Stage‑A patterns.
  // When the utterance matches an anchored topic or subject row from the payload, route explicitly.
  if (best === "unclear" && topicHintEarly) {
    best = "ask_topic_specific";
    bestScore = 6;
    second = 0;
    topIntentCount = 1;
  } else if (best === "unclear" && subjectHintEarly && !topicHintEarly) {
    best = "ask_subject_specific";
    bestScore = 6;
    second = 0;
    topIntentCount = 1;
  }

  const scopeSignal = bestScopeClassFromSignals(folded);
  /** @type {ScopeClass} */
  let scopeClass =
    scopeSignal ||
    (best === "what_is_going_well"
      ? "strengths"
      : best === "what_is_still_difficult" || best === "what_not_to_do_now"
        ? "weaknesses"
        : best === "why_not_advance"
          ? "blocked_advance"
            : best === "what_to_do_today" || best === "what_to_do_this_week" || best === "is_intervention_needed"
            ? "recommendation"
            : "executive");

  if (best === "clinical_boundary" || best === "sensitive_education_choice") {
    scopeClass = "confidence_uncertainty";
  }

  if (best === "strength_vs_weakness_summary") {
    scopeClass = strengthVsInterpretationScopeFromFolded(folded);
  }

  const timeframeHint = inferTimeframeHint(t);
  const toneHint = inferToneHint(t);

  let ambiguityLevel = "low";
  if (bestScore > 0 && topIntentCount >= 2) ambiguityLevel = "high";
  else if (bestScore > 0 && second > 0 && second >= bestScore - 1 && bestScore <= 3) ambiguityLevel = "medium";

  const margin = best === "unclear" ? 0 : Math.max(0, bestScore - second);
  const canonicalIntentScore =
    best === "unclear"
      ? t.length >= 4
        ? 0.28
        : 0.22
      : Math.min(0.98, 0.4 + bestScore * 0.065 + Math.min(0.18, margin * 0.045));

  /** True when two+ intents tie for the top score — downstream may ask one short clarification. */
  const shouldClarifyIntent = ambiguityLevel === "high" && best !== "unclear";

  const intentHitSignals = { ...scores };

  return {
    canonicalIntent: best,
    canonicalIntentScore,
    intentReason: best === "unclear" ? "no_intent_signal" : `stage_a:${best}`,
    normalizedUtterance: t,
    scopeClass,
    subjectHint: subjectHintEarly,
    topicHint: topicHintEarly,
    timeframeHint,
    toneHint,
    ambiguityLevel,
    shouldClarifyIntent,
    /** Per-intent evidence counts — telemetry / tests only */
    intentHitSignals,
    /** @deprecated use intentHitSignals */
    intentHitCounts: intentHitSignals,
  };
}

export default { interpretFreeformStageA, CANONICAL_PARENT_INTENTS };
