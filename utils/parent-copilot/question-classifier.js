/**
 * Parent Q&A Question Classifier — first product gate.
 *
 * Replaces the regex-only first gate with a two-tier signal model that produces
 * exactly 4 product buckets:
 *   - off_topic               (not about the report / child / learning)
 *   - diagnostic_sensitive    (asks for a clinical label / diagnosis)
 *   - privacy_sensitive       (other children, passwords, DB, system internals)
 *   - ambiguous_or_unclear    (too short, contradictory, or pure topic-name without report intent)
 *   - report_related          (clearly asking about this report / child's learning)
 *
 * Architecture:
 *   - The deterministic step is the primary decider. It uses small CATEGORY lexicons
 *     plus compositional **semantic intent rules** (strength / weakness / explain-report
 *     inquiries), not per-sentence FAQ tables. Payload-derived subject/topic vocabulary
 *     layers on top.
 *   - WEAK report tokens (e.g. , , , ) cannot classify a
 *     question as report_related on their own; they must combine with at least one
 *     STRONG report token (, ,  , etc.) or a strong
 *     report intent phrase. This guards against "  ?" being classified
 *     as report_related.
 *   - Generic-knowledge framing ( ,  ,  ) clamps
 *     report_signal so that even a topic-name match cannot push the question into
 *     report_related. "  ?" stays off_topic even when science is in
 *     the report. The parent must phrase it as "   ?" or
 *     "  ?" to trigger report_related.
 *   - On low confidence, the deterministic step returns ambiguous_or_unclear and
 *     defers the upgrade to the optional LLM classifier (see question-classifier-llm.js).
 *
 * Hard gate guarantee for index.js: for any non-report_related bucket, no TruthPacket
 * is built, no answer-LLM is called, and no report data appears in the response.
 */

import { SUBJECT_ORDER, normalizeSubjectId } from "./contract-reader.js";
import { detectAggregateQuestionClass } from "./semantic-question-class.js";
import { foldUtteranceForMatch } from "./utterance-normalize.js";
import { looksLikeExternalPastedQuestion, matchLooseTopicFromUtterance } from "../parent-ai-topic-classifier/classifier.js";
import {
  buildTopicClarificationQuestionHe,
  hasAnchoredReportRows,
  isGeneralReportQuestion,
  isSubjectStatusInquiry,
  isTopicWeaknessInquiry,
  resolveReportRowFromUtterance,
  utteranceQualifiesAsReportQuestion
} from "./report-row-resolver.js";

export { buildTopicClarificationQuestionHe };

/**
 * @typedef {(
 *   "report_related" |
 *   "off_topic" |
 *   "diagnostic_sensitive" |
 *   "health_sensitive" |
 *   "privacy_sensitive" |
 *   "peer_comparison" |
 *   "ambiguous_or_unclear"
 * )} ClassifierBucket
 */

/**
 * @typedef {{
 *   bucket: ClassifierBucket;
 *   confidence: number;
 *   source: "deterministic" || "llm" || "fallback";
 *   signals: {
 *     reportSignal: number;
 *     offTopicSignal: number;
 *     diagnosticSignal: number;
 *     ambiguitySignal: number;
 *     hasStrongReportToken: boolean;
 *     hasGenericKnowledgeFraming: boolean;
 *     subjectTopicNameMatched: boolean;
 *     pronounsMatched: boolean;
 *     meaningfulTokenCount: number;
 *   };
 * }} ClassifierResult
 */

/**
 * Public boundary copy. Imported by question-router.js / index.js.
 */
export const GENERAL_OFF_TOPIC_RESPONSE_HE =
  "I can help here only with the report, practice, and your child's progress on the site. You can ask, for example: what matters to practice this week, what to do at home, or which topic to open as a short activity.";

/** @deprecated alias — use {@link GENERAL_OFF_TOPIC_RESPONSE_HE} */
export const OFF_TOPIC_RESPONSE_HE = GENERAL_OFF_TOPIC_RESPONSE_HE;

export const DIAGNOSTIC_BOUNDARY_RESPONSE_HE =
  "I can only talk about what appears in the practice data on the site. The report can show which subjects and topics are worth reinforcing, but it cannot support a personal conclusion about the child. If you like, we can focus on what the report does show: a strong topic, a topic to reinforce, or a small next step at home.";

export const HEALTH_BOUNDARY_RESPONSE_HE =
  "I can only talk about the practice data that appears on the site. The report is not meant to draw personal conclusions about the child — it helps show which topic is worth reinforcing in learning. We can continue from here with a small learning step based on the report.";

export const PRIVACY_BOUNDARY_RESPONSE_HE =
  "I can only help with the report for the child linked to this parent account. I cannot show other children's data, passwords, user lists, or internal system information.";

export const PEER_COMPARISON_RESPONSE_HE =
  "The report is based only on this child's practice and does not compare to other children in the class. You can focus on what appears in the report and ask about a specific topic.";

export const AMBIGUOUS_RESPONSE_HE =
  "I could not tell exactly which part of the report you meant. Try asking more simply, for example: what matters most to practice this week, what to do at home, or which topic to open as a short activity.";

export const NO_DATA_FOR_REQUEST_RESPONSE_HE =
  "In the current report there is not enough information to answer that precisely. You can continue with short practice on the site, then check again whether a clearer direction appears in the report.";

export const NO_DATA_SPECIFIC_FOR_REQUEST_RESPONSE_HE =
  "The report has practice data from this period, but there is not enough information to answer this specific point precisely. You can continue with short practice on the site, then check again whether a clearer direction appears for this topic.";

/**
 * Decision thresholds. Exported so tests can assert behavior without re-deriving them.
 */
export const CLASSIFIER_THRESHOLDS = Object.freeze({
  diagnostic: 0.7,
  offTopic: 0.4,
  reportRelated: 0.5,
  reportRelatedOffTopicCeiling: 0.3,
  llmConfidenceFloor: 0.7,
  meaningfulTokenMinForReport: 2
});

const STRONG_REPORT_TOKEN_WEIGHT = 0.35;
const STRONG_REPORT_INTENT_WEIGHT = 0.5;
const WEAK_REPORT_TOKEN_WEIGHT = 0.1;
const SUBJECT_TOPIC_VOCAB_WEIGHT = 0.2;
const OFF_TOPIC_CATEGORY_WEIGHT = 0.4;
const MIXED_INTENT_PENALTY = 0.3;

// ─── Lexicons (intentionally short and category-based) ──────────────────────

/** STRONG report tokens — each contributes 0.35 to reportSignal. */
const STRONG_REPORT_TOKENS = [
  // Verbs / actions about practice and learning
  "", "", "", "", "", "", "",
  "", "", "", "", "", "", "",
  // Strengths / weaknesses / state about the child's performance
  "", "", "", "", "",
  "", "", "", "", "", "", "",
  "", "", "", "",
  "", "", "",
  // Help / report references
  "", "", "", "", "",
  "", "", "", "", "", "",
  "report", "practice", "progress", "learning", "data", "numbers", "conclusions",
  "help me", "at home", "teacher", "explain", "meaning", "general picture"
];

/** STRONG report intent phrases — compact routing cues (after fold). */
const STRONG_REPORT_INTENTS = [
  /(?!)/u, /(?!)/u, /(?!)/u,
  /(?!)/u,
  /(?!)/u, /(?!)/u,
  /(?!)/u, /(?!)/u,
  // Home-practice / next-step framing (keep aligned with semantic-question-class recommendation_action)
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u, /(?!)/u, /(?!)/u,
  /(?!)/u, /(?!)/u, /(?!)/u,
  /(?!)/u, /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  // Strength / best-subject family (category signals — not FAQ sentences)
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
  // Main focus / priority family
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  // Home-practice / dosage family
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  // Catalog-aligned report questions that must reach Stage A (avoid classifier ambiguous early-exit)
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  // Balanced strengths vs gaps (executive) without explicit "" /  stems
  /(?!)/u,
  /what\s+(?:does|do).{0,20}(?:report|data|numbers).{0,20}(?:mean|show|say)/i,
  /what\s+is\s+the\s+(?:main\s+)?thing.{0,40}(?:report|data)/i,
  /what\s+should\s+i\s+(?:know|remember|take).{0,40}(?:report|home)/i,
  /general\s+picture.{0,40}(?:going\s+on|report|learning)/i,
  /what\s+is\s+going\s+on.{0,40}(?:report|learning|data)/i,
  /how\s+(?:should\s+i\s+)?(?:read|understand).{0,40}report/i,
  /how\s+(?:should\s+i\s+)?understand.{0,40}conclusions/i,
  /what\s+should\s+we\s+do.{0,30}(?:home|today|week)/i,
  /weekly\s+plan|coming\s+week|what\s+should\s+we\s+start/i,
  /how\s+should\s+i\s+explain.{0,40}(?:child|kid)/i,
  /what\s+should\s+i\s+(?:write|ask).{0,40}teacher/i,
  /wording.{0,40}teacher|teacher\s+question|question.{0,40}teacher/i,
  /(?:worried|concerning|serious|concern).{0,40}(?:report|data|this)/i,
  /should\s+i\s+be\s+worried/i,
  /serious\s+or\s+not/i,
  /strengths?.{0,30}weaknesses|strong.{0,30}weak/i,
  /balanced\s+summary.{0,40}(?:good|less\s+good|weaker|weak)/i,
  /reinforcement\s+needed|most\s+reinforcement|needs\s+strengthening/i,
  /what\s+is\s+(?:strong|weak).{0,30}report/i
];

/**
 * Semantic **categories** for report-related questions: compositional rules (stems +
 * inquiry frames), not a FAQ list of exact sentences. Contributes at most one
 * STRONG_REPORT_INTENT_WEIGHT so a lone STRONG token (0.35) still clears 0.5.
 */
function matchesExplainReportInquiry(t) {
  const reportSurface = /(?!)/u.test(t);
  const inAppDeictic = /(?!)/u.test(t);
  const conclusionReading =
    /(?!)/u.test(t) && /(?!)/u.test(t);
  if (!reportSurface && !inAppDeictic && !conclusionReading) return false;
  return /(?!)/i.test(
    t,
  );
}

/**
 * At least one topic row has parent-visible narrative observation (Copilot-safe anchor).
 * Used so recommendation/next-step shorthand can classify as report_related only when a real report is loaded.
 * @param {unknown} payload
 */
function hasAnchoredTopicObservation(payload) {
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  for (const sp of profiles) {
    const recs = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
    for (const tr of recs) {
      const obs = String(tr?.contractsV1?.narrative?.textSlots?.observation || "").trim();
      if (obs.length >= 8) return true;
    }
  }
  return false;
}

function hasWeaknessStem(t) {
  return (
    /(?!)/u.test(t) ||
    (/(?!)/u.test(t) && /(?!)/u.test(t))
  );
}

function hasLearningInquiryFrame(t) {
  return /(?!)/u.test(t);
}

function matchesWeaknessInquiryCategory(t) {
  return hasWeaknessStem(t) && hasLearningInquiryFrame(t);
}

function hasStrengthStem(t) {
  if (/(?!)/u.test(t)) return true;
  if (/(?!)/u.test(t)) return true;
  if (t.includes("") && /(?!)/u.test(t)) return true;
  if (t.includes("") && /(?!)/u.test(t)) return true;
  if (/(?!)/u.test(t)) {
    return /(?!)/u.test(t);
  }
  return false;
}

function matchesStrengthInquiryCategory(t) {
  return hasStrengthStem(t) && hasLearningInquiryFrame(t);
}

/** @returns {number} 0 or STRONG_REPORT_INTENT_WEIGHT */
function computeSemanticReportIntentBonus(t) {
  if (matchesExplainReportInquiry(t)) return STRONG_REPORT_INTENT_WEIGHT;
  if (matchesWeaknessInquiryCategory(t)) return STRONG_REPORT_INTENT_WEIGHT;
  if (matchesStrengthInquiryCategory(t)) return STRONG_REPORT_INTENT_WEIGHT;
  return 0;
}

/** WEAK tokens — only count when paired with a STRONG token or strong intent. */
const WEAK_REPORT_TOKENS = [
  // Pronouns referring to the child
  "", "", "", "", "", "", "", "",
  // Time / context
  "", "", "", "", ""
];

/** Off-topic category lexicons. Short, category-based. */
const OFF_TOPIC_CATEGORIES = {
  weather: ["", "", "", "", "", "", ""],
  time: ["", "", ""],
  jokes_chat: ["", "", "", ""],
  politics: ["", "", "", "", "", ""],
  sports: ["", "", "", "", "", ""],
  food: ["", "", "", "", "", "", "", ""],
  code: ["javascript", "java script", "", "", ""],
  shopping: ["", "", "", "", "", "", ""],
  songs: ["", "", ""],
  news: ["", "", ""],
  investments: ["", "", "", "", "", ""],
  generic_knowledge_qa: [
    "", "", "", "", "", "", "",
    "", "", "", ""
  ],
  trivia: ["", "", "", "", ""],
  // Note: phrases like "  ", " ", "" are intentionally
  //       NOT in smalltalk because we want them to surface as ambiguous_or_unclear,
  //       so the LLM upgrade can decide based on context. Smalltalk targets only
  //       phrases that are clearly about the bot itself.
  smalltalk: ["", "", "", ""],
  computation: ["", "", ""],
  hobbies_general: ["", "", "", ""]
};

/**
 * Generic-knowledge framing — clamps reportSignal even on subject/topic match.
 * IMPORTANT: JavaScript's `\b` matches ASCII word boundaries only (`[A-Za-z0-9_]`).
 * Hebrew letters are NOT word characters, so `\b` after a Hebrew character does
 * not match. We use `(?:\s|$)` explicitly instead.
 */
const GENERIC_KNOWLEDGE_FRAMING = [
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
  /(?!)/u
];

/** Privacy / system-internals — must refuse before report routing. */
const PRIVACY_SENSITIVE_PATTERNS = [
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u
];

/** Health / clinical / diagnosis — route to HEALTH_BOUNDARY (not sensitive_education). */
const HEALTH_SENSITIVE_PATTERNS = [
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
  /(?!)/u
];

/** Diagnostic / clinical lexicon — independent of report context. */
const DIAGNOSTIC_PATTERNS = [
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /\badhd\b/i,
  /(?!)/u,
  /(?!)/u,
  /\bocd\b/i,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/iu,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  // Emotional / mental-health wording (boundary — not diagnosis from report data)
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u
];

/** Off-topic patterns beyond category lexicon. */
const OFF_TOPIC_EXTRA_PATTERNS = [
  /(?!)/u,
  /(?!)/u,
  /(?!)/u
];

/** Legitimate parent report questions — must never land in ambiguous_or_unclear. */
const LEGITIMATE_PARENT_PATTERNS = [
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
  /(?!)/u
];

/**
 * @param {string} utterance
 */
export function matchesLegitimateParentQuestion(utterance) {
  const t = normalizeForClassifier(utterance);
  if (!t) return false;
  return LEGITIMATE_PARENT_PATTERNS.some((re) => re.test(t));
}

/**
 * @param {string} t — normalized utterance
 */
function matchesPrivacySensitive(t) {
  if (scorePeerComparisonSignal(t) >= 0.9) return false;
  return PRIVACY_SENSITIVE_PATTERNS.some((re) => re.test(t));
}

/**
 * @param {string} t — normalized utterance
 */
function matchesHealthSensitive(t) {
  if (HEALTH_SENSITIVE_PATTERNS.some((re) => re.test(t))) return true;
  for (const re of DIAGNOSTIC_PATTERNS) {
    if (re.test(t)) return true;
  }
  return false;
}

/**
 * @param {string} t — normalized utterance
 */
function matchesOffTopicExtra(t) {
  return OFF_TOPIC_EXTRA_PATTERNS.some((re) => re.test(t));
}

/** Peer / class norm comparison — not clinical diagnosis; separate early-exit copy. */
const PEER_COMPARISON_PATTERNS = [
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u,
  /(?!)/u
];

// ─── Normalization ──────────────────────────────────────────────────────────

/**
 * Strip niqqud, quotes, punctuation; lowercase; collapse whitespace.
 * @param {string} raw
 */
function normalizeForClassifier(raw) {
  return String(raw || "")
    .replace(/(?!)/g, "")
    .replace(/(?!)/g, "")
    .replace(/[?!.,:;]+/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Count meaningful tokens (after dropping fillers). */
function countMeaningfulTokens(normalized) {
  if (!normalized) return 0;
  const drops = new Set([
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", ""
  ]);
  const tokens = normalized.split(/\s+/).filter((t) => t.length >= 2 && !drops.has(t));
  return tokens.length;
}

// ─── Payload-derived vocabulary ─────────────────────────────────────────────

/**
 * Extract subject + topic display name vocabulary from the report payload.
 * @param {unknown} payload
 * @returns {{ subjectsHe: string[]; topicsHe: string[] }}
 */
function extractReportVocabulary(payload) {
  /** @type {string[]} */
  const subjectsHe = [];
  /** @type {string[]} */
  const topicsHe = [];
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  for (const sp of profiles) {
    const sid = normalizeSubjectId(sp?.subject);
    if (!sid) continue;
    const subjectLabel = subjectLabelLocalHe(sid);
    if (subjectLabel) subjectsHe.push(subjectLabel.toLowerCase());
    const recs = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
    for (const tr of recs) {
      const dn = String(tr?.displayName || "").trim().toLowerCase();
      if (dn.length >= 3) topicsHe.push(dn);
    }
  }
  return { subjectsHe, topicsHe };
}

/**
 * Local Hebrew subject label map. Mirrors contract-reader's SUBJECT_ORDER.
 * Avoids importing display dictionaries that are tied to UI layers.
 * @param {string} subjectId
 */
function subjectLabelLocalHe(subjectId) {
  const sid = normalizeSubjectId(subjectId);
  switch (sid) {
    case "math": return "";
    case "geometry": return "";
    case "english": return "";
    case "science": return "";
    case "history": return "";
    
    
    default: return "";
  }
}

// ─── Signal scorers ─────────────────────────────────────────────────────────

/**
 * @param {string} t — normalized utterance
 * @param {{ subjectsHe: string[]; topicsHe: string[] }} vocab
 * @param {unknown} payload
 * @param {string} rawUtterance
 */
function scoreReportSignal(t, vocab, payload, rawUtterance) {
  let score = 0;
  let hasStrong = false;
  let pronounsMatched = false;
  let subjectTopicNameMatched = false;
  let hasGenericKnowledgeFraming = false;

  for (const tok of STRONG_REPORT_TOKENS) {
    if (t.includes(tok.toLowerCase())) {
      score += STRONG_REPORT_TOKEN_WEIGHT;
      hasStrong = true;
    }
  }
  const semanticBonus = computeSemanticReportIntentBonus(t);
  if (semanticBonus > 0) {
    score += semanticBonus;
    hasStrong = true;
  }
  for (const re of STRONG_REPORT_INTENTS) {
    if (re.test(t)) {
      score += STRONG_REPORT_INTENT_WEIGHT;
      hasStrong = true;
    }
  }
  for (const tok of WEAK_REPORT_TOKENS) {
    if (new RegExp(`(^|\\s)${tok}(\\s|$)`, "u").test(t)) {
      if (tok === "" || tok === "" || tok === "" || tok === "" ||
          tok === "" || tok === "" || tok === "" || tok === "") {
        pronounsMatched = true;
      }
    }
  }
  if (hasStrong) {
    for (const tok of WEAK_REPORT_TOKENS) {
      if (new RegExp(`(^|\\s)${tok}(\\s|$)`, "u").test(t)) {
        score += WEAK_REPORT_TOKEN_WEIGHT;
      }
    }
  }

  for (const lbl of vocab.subjectsHe) {
    if (lbl && t.includes(lbl)) {
      subjectTopicNameMatched = true;
      score += SUBJECT_TOPIC_VOCAB_WEIGHT;
      break;
    }
  }
  for (const lbl of vocab.topicsHe) {
    if (lbl && t.includes(lbl)) {
      subjectTopicNameMatched = true;
      score += SUBJECT_TOPIC_VOCAB_WEIGHT;
      break;
    }
  }

  if (payload && utteranceQualifiesAsReportQuestion(rawUtterance, payload)) {
    const rowRes = resolveReportRowFromUtterance(rawUtterance, payload);
    if (rowRes.best || rowRes.subjectId) {
      subjectTopicNameMatched = true;
      score += STRONG_REPORT_INTENT_WEIGHT;
      hasStrong = true;
    }
  }

  for (const re of GENERIC_KNOWLEDGE_FRAMING) {
    if (re.test(t)) {
      hasGenericKnowledgeFraming = true;
      break;
    }
  }
  if (hasGenericKnowledgeFraming && subjectTopicNameMatched && utteranceQualifiesAsReportQuestion(rawUtterance, payload)) {
    hasGenericKnowledgeFraming = false;
    score = Math.max(score, STRONG_REPORT_INTENT_WEIGHT);
    hasStrong = true;
  } else if (hasGenericKnowledgeFraming && score > 0.3) {
    score = 0.3;
  }

  return {
    score: Math.min(1, score),
    hasStrong,
    pronounsMatched,
    subjectTopicNameMatched,
    hasGenericKnowledgeFraming
  };
}

/**
 * @param {string} t — normalized utterance
 * @param {boolean} hasStrongReportToken
 */
function scoreOffTopicSignal(t, hasStrongReportToken) {
  let score = 0;
  if (matchesOffTopicExtra(t)) score += 0.8;
  for (const cat of Object.values(OFF_TOPIC_CATEGORIES)) {
    for (const phrase of cat) {
      if (t.includes(phrase.toLowerCase())) {
        score += OFF_TOPIC_CATEGORY_WEIGHT;
      }
    }
  }
  // Cap and reduce when a STRONG report token is also present (mixed intent).
  score = Math.min(1, score);
  if (hasStrongReportToken && score > 0) {
    score = Math.max(0, score - MIXED_INTENT_PENALTY);
  }
  return score;
}

/**
 * @param {string} t — normalized utterance
 */
function scoreDiagnosticSignal(t) {
  for (const re of DIAGNOSTIC_PATTERNS) {
    if (re.test(t)) return 0.95;
  }
  return 0;
}

/**
 * @param {string} t — normalized utterance
 */
function scorePeerComparisonSignal(t) {
  for (const re of PEER_COMPARISON_PATTERNS) {
    if (re.test(t)) return 0.92;
  }
  return 0;
}

/**
 * "  …?" where the remainder names a subject/topic label present in the payload.
 * Category-level shorthand (not per-sentence FAQ).
 * @param {string} t
 * @param {{ subjectsHe: string[]; topicsHe: string[] }} vocab
 */
function maImReferencesPayloadVocab(t, vocab) {
  if (!/(?!)/u.test(t)) return false;
  const tail = t.replace(/(?!)/u, "").trim();
  if (tail.length < 2) return false;
  const labels = [...new Set([...vocab.subjectsHe, ...vocab.topicsHe])];
  for (const lbl of labels) {
    if (lbl && tail.includes(lbl)) return true;
  }
  return false;
}

/**
 * True for "  …?" when no subject/topic label from the payload appears in the tail.
 * QA harness / callers use this to distinguish expected ambiguity from routing bugs.
 */
export function maImSubjectAbsentFromPayload({ utterance, payload }) {
  const t = normalizeForClassifier(utterance);
  if (!/(?!)/u.test(t)) return false;
  const vocab = extractReportVocabulary(payload);
  return !maImReferencesPayloadVocab(t, vocab);
}

// ─── Main entry ─────────────────────────────────────────────────────────────

/**
 * Run the deterministic classifier. Pure / sync / no I/O.
 *
 * @param {{ utterance: string; payload?: unknown }} args
 * @returns {ClassifierResult}
 */
export function classifyParentQuestionDeterministic({ utterance, payload }) {
  const t = normalizeForClassifier(utterance);
  const vocab = extractReportVocabulary(payload);
  const meaningfulTokenCount = countMeaningfulTokens(t);

  const reportRes = scoreReportSignal(t, vocab, payload, String(utterance || ""));
  const offTopicSignal = scoreOffTopicSignal(t, reportRes.hasStrong);
  const diagnosticSignal = scoreDiagnosticSignal(t);
  const ambiguitySignal = computeAmbiguity({
    meaningfulTokenCount,
    reportSignal: reportRes.score,
    offTopicSignal,
    hasStrong: reportRes.hasStrong,
    subjectTopicNameMatched: reportRes.subjectTopicNameMatched,
    pronounsMatched: reportRes.pronounsMatched
  });

  const signals = {
    reportSignal: reportRes.score,
    offTopicSignal,
    diagnosticSignal,
    ambiguitySignal,
    hasStrongReportToken: reportRes.hasStrong,
    hasGenericKnowledgeFraming: reportRes.hasGenericKnowledgeFraming,
    subjectTopicNameMatched: reportRes.subjectTopicNameMatched,
    pronounsMatched: reportRes.pronounsMatched,
    meaningfulTokenCount
  };

  // Decision rules in strict order.
  // 0. Privacy / system internals — refuse before any report access.
  if (matchesPrivacySensitive(t)) {
    return {
      bucket: "privacy_sensitive",
      confidence: 0.96,
      source: "deterministic",
      signals
    };
  }

  // 1. Health / clinical takes precedence over everything else (clinical safety).
  if (matchesHealthSensitive(t)) {
    return {
      bucket: "health_sensitive",
      confidence: 0.95,
      source: "deterministic",
      signals
    };
  }

  const peerComparisonSignal = scorePeerComparisonSignal(t);
  if (peerComparisonSignal >= 0.9) {
    return {
      bucket: "peer_comparison",
      confidence: peerComparisonSignal,
      source: "deterministic",
      signals: { ...signals, peerComparisonSignal }
    };
  }

  const aggregateQuestionClass = detectAggregateQuestionClass(String(utterance || ""));
  if (
    aggregateQuestionClass !== "none" &&
    aggregateQuestionClass !== "vague_summary_question" &&
    aggregateQuestionClass !== "recommendation_action"
  ) {
    return {
      bucket: "report_related",
      confidence: 0.82,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.78),
        hasStrongReportToken: true,
        ambiguitySignal: Math.min(ambiguitySignal, 0.2),
        aggregateQuestionClass
      }
    };
  }

  // 1a. Report-row-first: anchored report + row/subject/general question (before off-topic / ambiguous).
  if (hasAnchoredReportRows(payload) && utteranceQualifiesAsReportQuestion(String(utterance || ""), payload)) {
    const rowRes = resolveReportRowFromUtterance(String(utterance || ""), payload);
    return {
      bucket: "report_related",
      confidence: 0.84,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.78),
        hasStrongReportToken: true,
        subjectTopicNameMatched: !!(rowRes.best || rowRes.subjectId),
        ambiguitySignal: Math.min(ambiguitySignal, 0.2)
      }
    };
  }

  // 1b. Catalog topic named in the utterance but row not anchored — Phase E / bank path must run before
  //     off-topic hits on mid-sentence fragments like "  …" (generic_knowledge_qa category).
  const looseUnanchoredEarly = matchLooseTopicFromUtterance(String(utterance || ""), payload);
  if (looseUnanchoredEarly && !looseUnanchoredEarly.anchored) {
    return {
      bucket: "report_related",
      confidence: 0.77,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.7),
        hasStrongReportToken: true,
        subjectTopicNameMatched: true
      }
    };
  }

  // 2. Subject/status inquiry framed as child + report scope —
  // must beat hobbies/off-topic lexicon hits (e.g. / in OFF_TOPIC_CATEGORIES).
  if (
    /(?!)/u.test(t) ||
    /(?!)/u.test(
      t,
    ) ||
    /how\s+is\s+(?:my|the)\s+child\s+doing\s+in\s+/i.test(t) ||
    /^how\s+is\s+(?:my|the)\s+child.*(?:math|arithmetic|geometry|english|science|history|hebrew|social studies|geography)/i.test(
      t,
    ) ||
    /what\s+is\s+going\s+on\s+in\s+(?:math|arithmetic|geometry|english|science|history|hebrew|social studies|geography)\b/i.test(
      t,
    ) ||
    /\b(?:math|arithmetic|geometry|english|science|history|hebrew|social studies|geography)\b.{0,40}\b(?:status|situation|report)\b/i.test(
      t,
    ) ||
    /\b(?:math|arithmetic|geometry|english|science|history|hebrew|social studies|geography)\s+subject\b/i.test(
      t,
    ) ||
    /(?:want|need)\s+to\s+understand\s+(?:math|arithmetic|geometry|english|science|history|hebrew|social studies|geography)\b/i.test(
      t,
    )
  ) {
    return {
      bucket: "report_related",
      confidence: 0.86,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.75),
        hasStrongReportToken: true
      }
    };
  }

  // 3. Off-topic: clear category match AND no strong report token.
  if (offTopicSignal >= CLASSIFIER_THRESHOLDS.offTopic && !reportRes.hasStrong) {
    return {
      bucket: "off_topic",
      confidence: offTopicSignal,
      source: "deterministic",
      signals
    };
  }

  // 4. "  <payload subject/topic>?" — beats ambiguous when the named row exists.
  if (
    maImReferencesPayloadVocab(t, vocab) &&
    offTopicSignal <= CLASSIFIER_THRESHOLDS.reportRelatedOffTopicCeiling &&
    meaningfulTokenCount >= CLASSIFIER_THRESHOLDS.meaningfulTokenMinForReport
  ) {
    return {
      bucket: "report_related",
      confidence: 0.78,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.78),
        hasStrongReportToken: true,
        subjectTopicNameMatched: true
      }
    };
  }

  // 2c. Policy / integrity violations — must reach Stage A (`parent_policy_refusal`) with payload contracts.
  if (
    /(?!)/u.test(
      t,
    )
  ) {
    return {
      bucket: "report_related",
      confidence: 0.88,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.78),
        hasStrongReportToken: true
      }
    };
  }

  // 2d. Prompt-style overrides — must reach Stage A grounded refusal (not ambiguous clarification exit).
  if (/(?!)/u.test(t)) {
    return {
      bucket: "report_related",
      confidence: 0.86,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.78),
        hasStrongReportToken: true
      }
    };
  }

  // 2e. Education-adjacent sensitive decisions — Stage A `sensitive_education_choice` (not ambiguous early-exit).
  if (
    /(?!)/u.test(
      t,
    )
  ) {
    return {
      bucket: "report_related",
      confidence: 0.87,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.75),
        hasStrongReportToken: true
      }
    };
  }

  // 2f. Trajectory / trend questions — keep on-report (mass catalog dg_03/dg_04 style). Avoid ambiguous early-exit.
  if (
    /(?!)/u.test(
      t,
    )
  ) {
    return {
      bucket: "report_related",
      confidence: 0.84,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.72),
        hasStrongReportToken: true
      }
    };
  }

  // 2g. Prioritization / planning / comparison stems from Parent AI catalog — must reach Stage A (not ambiguous router exit).
  if (
    /(?!)/u.test(
      t,
    )
  ) {
    return {
      bucket: "report_related",
      confidence: 0.83,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.72),
        hasStrongReportToken: true
      }
    };
  }

  // 2h. Next-step / recommendation shorthand with a loaded anchored report — stay on-report (not ambiguous early-exit).
  if (
    hasAnchoredTopicObservation(payload) &&
    detectAggregateQuestionClass(utterance) === "recommendation_action"
  ) {
    return {
      bucket: "report_related",
      confidence: 0.82,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.75),
        hasStrongReportToken: true
      }
    };
  }

  // 2m. Anchored report + explicit subject/topic label + "I want to understand …" — on-report (not ambiguous).
  if (hasAnchoredTopicObservation(payload) && reportRes.subjectTopicNameMatched && /(?!)/u.test(t)) {
    return {
      bucket: "report_related",
      confidence: 0.79,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.73),
        hasStrongReportToken: true
      }
    };
  }

  // 2n. " …" + clarity/uncertainty on a payload subject label — on-report (not ambiguous).
  if (
    hasAnchoredTopicObservation(payload) &&
    reportRes.subjectTopicNameMatched &&
    /(?!)/u.test(t) &&
    /(?!)/u.test(t)
  ) {
    return {
      bucket: "report_related",
      confidence: 0.78,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.72),
        hasStrongReportToken: true
      }
    };
  }

  // 2o. Topic display matched + short status ask (" —  ?") — on-report without " " prefix.
  const looseForStatus = matchLooseTopicFromUtterance(String(utterance || ""), payload);
  if (
    looseForStatus &&
    looseForStatus.anchored &&
    hasAnchoredTopicObservation(payload) &&
    /(?!)/u.test(t)
  ) {
    return {
      bucket: "report_related",
      confidence: 0.76,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.72),
        hasStrongReportToken: true,
        subjectTopicNameMatched: true
      }
    };
  }

  // 2p. Topic-only shorthand with light punctuation ("???") — anchored display match, very short utterance.
  const looseBare = matchLooseTopicFromUtterance(String(utterance || ""), payload);
  if (looseBare && looseBare.anchored && hasAnchoredTopicObservation(payload) && meaningfulTokenCount <= 2) {
    const uFold = foldUtteranceForMatch(String(utterance || ""))
      .replace(/(?!)/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const dn = foldUtteranceForMatch(String(looseBare.displayName || ""))
      .replace(/\s+/g, " ")
      .trim();
    if (dn.length >= 2 && (uFold === dn || uFold === `${dn}`)) {
      return {
        bucket: "report_related",
        confidence: 0.74,
        source: "deterministic",
        signals: {
          ...signals,
          reportSignal: Math.max(reportRes.score, 0.7),
          hasStrongReportToken: true,
          subjectTopicNameMatched: true
        }
      };
    }
  }

  // 2q. Severity / worry about the report (no explicit "" token) — needs anchored rows so off-topic stays gated.
  if (
    hasAnchoredTopicObservation(payload) &&
    (/(?!)/u.test(t) ||
      (/(?!)/u.test(t) && /(?!)/u.test(t)))
  ) {
    return {
      bucket: "report_related",
      confidence: 0.81,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.72),
        hasStrongReportToken: true
      }
    };
  }

  // 2r. Anchored report + recommendation rationale / “what to avoid now” — sync path has no LLM classifier upgrade; keep on-report (not ambiguous).
  if (
    hasAnchoredTopicObservation(payload) &&
    (/(?!)/u.test(t) || /(?!)/u.test(t))
  ) {
    return {
      bucket: "report_related",
      confidence: 0.84,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.76),
        hasStrongReportToken: true
      }
    };
  }

  // 2i. Pasted homework / external exercise — Stage A + Phase E shortcut requires report_related before scope + truth packet.
  if (looksLikeExternalPastedQuestion(String(utterance || ""))) {
    return {
      bucket: "report_related",
      confidence: 0.81,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.72),
        hasStrongReportToken: true
      }
    };
  }

  // 2j. Topic-scoped "  …" when payload vocabulary matches — on-report (not ambiguous).
  if (hasAnchoredTopicObservation(payload) && /(?!)/u.test(t) && reportRes.subjectTopicNameMatched) {
    return {
      bucket: "report_related",
      confidence: 0.8,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.74),
        hasStrongReportToken: true
      }
    };
  }

  // 9. Report-related: needs strong signal AND low off-topic AND meaningful length.
  if (
    reportRes.score >= CLASSIFIER_THRESHOLDS.reportRelated &&
    offTopicSignal <= CLASSIFIER_THRESHOLDS.reportRelatedOffTopicCeiling &&
    reportRes.hasStrong &&
    meaningfulTokenCount >= CLASSIFIER_THRESHOLDS.meaningfulTokenMinForReport
  ) {
    return {
      bucket: "report_related",
      confidence: reportRes.score,
      source: "deterministic",
      signals
    };
  }

  // 4. Subject/topic match without strong intent => ambiguous (NOT report_related).
  //    "  " or "  ?" without strong report verb.
  //    Note: "  X?" is a common parent shorthand for "what about X in the report".
  //    We treat it as ambiguous so the LLM upgrade can decide; the deterministic
  //    fallback for "  " will be report_related via the dedicated
  //    " " rule below.
  if (
    reportRes.subjectTopicNameMatched &&
    !reportRes.hasStrong &&
    /(?!)/u.test(t)
  ) {
    // "  <topic>?" is a clear report-related shorthand even without explicit verb.
    return {
      bucket: "report_related",
      confidence: 0.65,
      source: "deterministic",
      signals: { ...signals, hasStrongReportToken: true }
    };
  }

  // 5b. Subject-scoped status / weakness when report vocabulary matches the subject label.
  if (
    reportRes.subjectTopicNameMatched &&
    (isSubjectStatusInquiry(t) || isTopicWeaknessInquiry(t))
  ) {
    return {
      bucket: "report_related",
      confidence: 0.86,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.76),
        hasStrongReportToken: true,
        ambiguitySignal: Math.min(ambiguitySignal, 0.15)
      }
    };
  }

  // 5. Legitimate parent report questions — must not fall to ambiguous.
  if (matchesLegitimateParentQuestion(String(utterance || ""))) {
    return {
      bucket: "report_related",
      confidence: 0.88,
      source: "deterministic",
      signals: {
        ...signals,
        reportSignal: Math.max(reportRes.score, 0.78),
        hasStrongReportToken: true,
        ambiguitySignal: Math.min(ambiguitySignal, 0.15)
      }
    };
  }

  // 6. Everything else => ambiguous_or_unclear (the LLM may upgrade in async path).
  return {
    bucket: "ambiguous_or_unclear",
    confidence: ambiguitySignal,
    source: "deterministic",
    signals
  };
}

/**
 * @param {{
 *   meaningfulTokenCount: number;
 *   reportSignal: number;
 *   offTopicSignal: number;
 *   hasStrong: boolean;
 *   subjectTopicNameMatched: boolean;
 *   pronounsMatched: boolean;
 * }} args
 */
function computeAmbiguity(args) {
  let amb = 0;
  if (args.meaningfulTokenCount < 2) amb += 0.6;
  if (args.reportSignal >= 0.4 && args.offTopicSignal >= 0.4) amb += 0.4;
  if (args.subjectTopicNameMatched && !args.hasStrong) amb += 0.3;
  if (!args.hasStrong && args.pronounsMatched && args.offTopicSignal < 0.4) amb += 0.2;
  return Math.min(1, amb);
}

/**
 * Map classifier bucket to the existing CanonicalParentIntent used downstream.
 * @param {ClassifierBucket} bucket
 */
export function bucketToCanonicalIntent(bucket) {
  switch (bucket) {
    case "off_topic": return "off_topic_redirect";
    case "health_sensitive":
    case "diagnostic_sensitive": return "clinical_boundary";
    case "privacy_sensitive": return "parent_policy_refusal";
    case "peer_comparison": return "unclear";
    case "ambiguous_or_unclear": return "unclear";
    case "report_related":
    default:
      return null;
  }
}

export default {
  classifyParentQuestionDeterministic,
  bucketToCanonicalIntent,
  maImSubjectAbsentFromPayload,
  matchesLegitimateParentQuestion,
  OFF_TOPIC_RESPONSE_HE,
  GENERAL_OFF_TOPIC_RESPONSE_HE,
  DIAGNOSTIC_BOUNDARY_RESPONSE_HE,
  HEALTH_BOUNDARY_RESPONSE_HE,
  PRIVACY_BOUNDARY_RESPONSE_HE,
  NO_DATA_FOR_REQUEST_RESPONSE_HE,
  PEER_COMPARISON_RESPONSE_HE,
  AMBIGUOUS_RESPONSE_HE,
  CLASSIFIER_THRESHOLDS
};
