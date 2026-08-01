/**
 * Report-row-first subject/topic resolution for Parent Copilot.
 * Matches parent utterances against actual payload rows (display labels + subject labels).
 */

import { listTopicRowsForClassifier } from "../parent-ai-topic-classifier/classifier.js";
import { SUBJECT_ORDER, subjectLabel } from "./contract-reader.js";
import { foldUtteranceForMatch } from "./utterance-normalize.js";
import { isContextualFollowUpUtterance } from "./contextual-follow-up.js";
import { detectHistoryCopilotLock } from "./history-scope.js";

/** @type {Record<string, string[]>} */
export const SUBJECT_HE_ALIASES = Object.freeze({
  math: ["Math", "Math"],
  geometry: ["Geometry", "Geometry"],
  english: ["English"],
  science: ["Science", "science"],
  history: ["History"]});

/** Common parent/taxonomy topic phrases beyond exact displayName (report rows still win first). */
/** @type {Record<string, string[]>} */
export const TOPIC_HE_ALIASES = Object.freeze({
  fractions: ["Fractions", "Calculus of fractions"],
  multiplication: ["Multiplication", "Multiplication table", "Multiply by tens"],
  division: ["Division", "division", "division by tens"],
  "word-problems": ["Word problems", "Verbal problems", "Word exercises"],
  "reading-comprehension": ["Reading comprehension", "understanding", "Reading"],
  grammar: ["Grammar", "English grammar"],
  vocabulary: ["Vocabulary", "curator"],
  what_is_history: ["what is history", "primary source", "secondary source", "timeline"],
  classical_greece: ["Classical Greece", "Athens", "Sparta", "democracy", "Compare Athens Sparta"],
  hellenism_jews: ["Hellenism", "Alexander the Great", "Alexander", "Hellenism and the Jews"],
  hasmonaeans: ["The Hasmoneans", "Hasmoneans", "Antiochus", "Rebellion of the Maccabees", "the maces", "inauguration"],
  rome_jews: ["Rome and the Jews", "Rome", "Herod", "The Great Rebellion", "The destruction of the temple", "destruction", "will build", "Bar Kochba", "Babylon"],
  hist_sub_intro_sources_timeline: ["primary source", "secondary source", "timeline", "what is history"],
  hist_sub_athens_democracy: ["Athens", "democracy", "Democratic Athens"],
  hist_sub_sparta: ["Sparta"],
  hist_sub_athens_sparta_compare: ["Compare Athens Sparta", "Comparison between Athens and Sparta"],
  hist_sub_greek_culture_legacy: ["Greek culture", "Greek heritage", "Olympics"],
  hist_sub_alexander_hellenism: ["Alexander the Great", "Hellenism"],
  hist_sub_hellenism_meets_judaism: ["The encounter between Hellenism and Judaism", "Hellenism and the Jews"],
  hist_sub_antiochus_maccabees: ["Antiochus decrees", "Rebellion of the Maccabees", "the maces"],
  hist_sub_hasmonaean_kingdom: ["Hasmonean kingdom"],
  hist_sub_rise_of_rome: ["The rise of Rome", "Rome"],
  hist_sub_roman_culture_law: ["Roman culture", "Roman law", "Roman law"],
  hist_sub_hasmonaean_loss_roman_conquest: ["Roman occupation", "Pompey", "loss of independence"],
  hist_sub_herod_building: ["Herod", "construction plants", "The rhodium"],
  hist_sub_judea_province: ["Judah as a province", "province"],
  hist_sub_great_revolt_destruction: ["The Great Rebellion", "The destruction of the temple", "Masada"],
  hist_sub_yavne_bar_kokhba_babylon: ["will build", "Bar Kochba", "Center of Babylon", "Babylon"]});

const TOPIC_INQUIRY_PREFIX_RE =
  /^(?:explain\s+(?:to\s+me\s+)?|tell\s+me\s+(?:about\s+)?|what(?:'s|\s+is)\s+(?:the\s+)?(?:problem|issue)\s+(?:with\s+|in\s+)?|what(?:'s|\s+is)\s+(?:happening|going\s+on)\s+(?:with\s+|in\s+)?|what\s+about\s+|how\s+(?:is\s+)?(?:he|she|they|my\s+child)\s+(?:doing\s+)?(?:in\s+|at\s+|with\s+)?|what\s+(?:should\s+(?:i|we)\s+)?(?:do|practice)\s+(?:in\s+|for\s+|with\s+|about\s+)?|what\s+to\s+(?:strengthen|reinforce)\s+(?:in\s+|for\s+)?|(?:i\s+)?want\s+to\s+(?:know|understand)\s+(?:about\s+)?)/i;

const FOLDED_PHRASE_BOUNDARY = /[\s?!.,:;""'']/;

/**
 * Avoid false positives (e.g. alias "crisis" inside "Math").
 * @param {string} haystack
 * @param {string} phrase
 */
function foldedIncludesPhrase(haystack, phrase) {
  const h = String(haystack || "");
  const p = String(phrase || "").trim();
  if (p.length < 2 || !h.includes(p)) return false;
  if (p.length >= 4) return true;
  let idx = 0;
  while ((idx = h.indexOf(p, idx)) !== -1) {
    const before = idx === 0 ? " " : h[idx - 1];
    const afterIdx = idx + p.length;
    const after = afterIdx >= h.length ? " " : h[afterIdx];
    if (FOLDED_PHRASE_BOUNDARY.test(before) && FOLDED_PHRASE_BOUNDARY.test(after)) return true;
    idx += 1;
  }
  return false;
}

/**
 * @param {unknown} payload
 */
export function hasAnchoredReportRows(payload) {
  const rows = listReportRows(payload);
  return rows.some((r) => r.anchored);
}

/**
 * @param {unknown} payload
 * @returns {Array<{
 *   subjectId: string;
 *   subjectLabel: string;
 *   topicRowKey: string;
 *   displayName: string;
 *   displayNameFolded: string;
 *   anchored: boolean;
 *   contentGradeKey: string|null;
 *   topicBaseKey: string;
 * }>}
 */
export function listReportRows(payload) {
  const raw = listTopicRowsForClassifier(payload);
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  const trByKey = new Map();
  for (const sp of profiles) {
    const sid = String(sp?.subject || "");
    for (const tr of Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : []) {
      const trk = String(tr?.topicRowKey || tr?.topicKey || "").trim();
      if (trk) trByKey.set(`${sid}|${trk}`, tr);
    }
    for (const row of Array.isArray(sp?.topicOverviewRows) ? sp.topicOverviewRows : []) {
      const trk = String(row?.topicRowKey || row?.topicKey || "").trim();
      if (trk && !trByKey.has(`${sid}|${trk}`)) trByKey.set(`${sid}|${trk}`, row);
    }
  }
  return raw.map((row) => {
    const topicRowKey = String(row.topicRowKey || "").trim();
    let contentGradeKey = null;
    let topicBaseKey = topicRowKey;
    const gradeSep = "::grade:";
    if (topicRowKey.includes(gradeSep)) {
      const parts = topicRowKey.split(gradeSep);
      topicBaseKey = parts[0] || topicRowKey;
      contentGradeKey = parts[1] || null;
    }
    const tr = trByKey.get(`${row.subjectId}|${topicRowKey}`);
    const questions = Math.max(0, Math.round(Number(tr?.questions ?? tr?.contractsV1?.evidence?.questionCount) || 0));
    const accuracy = Math.max(
      0,
      Math.min(100, Math.round(Number(tr?.accuracy ?? tr?.contractsV1?.evidence?.accuracyPct) || 0)),
    );
    return {
      subjectId: row.subjectId,
      subjectLabel: subjectLabel(row.subjectId),
      topicRowKey,
      displayName: row.displayName,
      displayNameFolded: row.displayNameFolded,
      anchored: row.anchored,
      contentGradeKey,
      topicBaseKey,
      questions,
      accuracy};
  });
}

/**
 * @param {string} folded
 */
export function isTopicWeaknessInquiry(folded) {
  const t = String(folded || "").trim();
  return (
    /^what(?:'s|\s+is)\s+(?:the\s+)?(?:problem|issue)/i.test(t) ||
    /^what(?:'s|\s+is)\s+(?:hard|difficult)/i.test(t) ||
    /^where\s+(?:is\s+)?(?:he|she)\s+struggling/i.test(t)
  );
}

/**
 * @param {string} folded
 * @param {ReturnType<typeof listReportRows>[number]} row
 */
export function utteranceNamesTopicRow(folded, row) {
  if (!row) return false;
  const u = String(folded || "");
  if (foldedIncludesPhrase(u, row.displayNameFolded)) return true;
  return topicAliasPhrases(row.subjectId, row.topicBaseKey).some((a) => foldedIncludesPhrase(u, a));
}

/**
 * @param {string} folded
 */
export function stripTopicInquiryPrefixes(folded) {
  let t = String(folded || "").trim();
  for (let i = 0; i < 4; i++) {
    const next = t.replace(TOPIC_INQUIRY_PREFIX_RE, "").trim();
    if (next === t) break;
    t = next;
  }
  return t.replace(/[?!.,:;""'']+/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * @param {string} subjectId
 * @param {string} topicBaseKey
 */
function topicAliasPhrases(subjectId, topicBaseKey) {
  const base = String(topicBaseKey || "").trim();
  const aliases = TOPIC_HE_ALIASES[base] || [];
  const out = new Set(aliases.map((a) => foldUtteranceForMatch(a)).filter((a) => a.length >= 2));
  return [...out];
}

/**
 * @param {string} foldedUtterance
 * @param {ReturnType<typeof listReportRows>[number]} row
 */
function scoreRowMatch(foldedUtterance, row) {
  const u = foldedUtterance;
  if (!u || u.length < 2) return 0;
  const dn = row.displayNameFolded;
  const subj = foldUtteranceForMatch(row.subjectLabel);
  let score = 0;
  if (dn.length >= 2 && u.includes(dn)) score = Math.max(score, dn.length + 10);
  const tail = stripTopicInquiryPrefixes(u);
  if (dn.length >= 2 && tail.length >= 2) {
    if (tail === dn || tail.endsWith(` ${dn}`) || tail.startsWith(`${dn} `)) {
      score = Math.max(score, dn.length + 14);
    }
    if (tail.includes(dn)) score = Math.max(score, dn.length + 8);
  }
  for (const alias of topicAliasPhrases(row.subjectId, row.topicBaseKey)) {
    if (alias.length >= 2 && foldedIncludesPhrase(u, alias)) score = Math.max(score, alias.length + 6);
  }
  for (const alias of SUBJECT_HE_ALIASES[row.subjectId] || []) {
    const af = foldUtteranceForMatch(alias);
    if (af.length >= 2 && u.includes(af) && dn.length >= 2 && u.includes(dn)) {
      score = Math.max(score, af.length + dn.length + 6);
    }
  }
  if (score <= 0) return 0;
  if (row.anchored) score += 2;
  void subj;
  return score;
}

/**
 * @param {string} utterance
 * @param {unknown} payload
 */
export function resolveReportRowFromUtterance(utterance, payload) {
  const folded = foldUtteranceForMatch(utterance);
  const rows = listReportRows(payload);
  /** @type {Array<{ row: typeof rows[0]; score: number }>} */
  const hits = [];
  for (const row of rows) {
    const score = scoreRowMatch(folded, row);
    if (score > 0) hits.push({ row, score });
  }
  hits.sort(
    (a, b) =>
      b.score - a.score ||
      SUBJECT_ORDER.indexOf(a.row.subjectId) - SUBJECT_ORDER.indexOf(b.row.subjectId),
  );
  let best = hits[0] || null;
  const second = hits[1] || null;
  let ambiguous = !!(
    best &&
    second &&
    best.score > 0 &&
    second.score > 0 &&
    best.score - second.score <= 3
  );

  let subjectId = null;
  const subjHits = [];
  for (const sid of SUBJECT_ORDER) {
    const labels = [subjectLabel(sid), ...(SUBJECT_HE_ALIASES[sid] || [])];
    for (const lbl of labels) {
      const lf = foldUtteranceForMatch(lbl);
      if (lf.length >= 2 && folded.includes(lf)) {
        subjHits.push({ subjectId: sid, score: lf.length });
        break;
      }
    }
  }
  subjHits.sort((a, b) => b.score - a.score);
  if (subjHits[0] && (!best || subjHits[0].score >= 4)) {
    subjectId = subjHits[0].subjectId;
  }

  const historyLock = detectHistoryCopilotLock(utterance);
  if (historyLock?.locked) {
    subjectId = "history";
    if (historyLock.topicBaseKey) {
      const histRows = rows.filter(
        (r) => r.subjectId === "history" && r.topicBaseKey === historyLock.topicBaseKey,
      );
      const histBest = [...histRows].sort(
        (a, b) => (Number(b.questions) || 0) - (Number(a.questions) || 0) || b.score - a.score,
      )[0];
      if (histBest) {
        best = { row: histBest, score: Math.max(best?.score ?? 0, 100) };
        ambiguous = false;
      }
    }
  }

  if (best && subjectId && best.row.subjectId === subjectId) {
    const topicNamed =
      foldedIncludesPhrase(folded, best.row.displayNameFolded) ||
      topicAliasPhrases(best.row.subjectId, best.row.topicBaseKey).some((a) =>
        foldedIncludesPhrase(folded, a),
      );
    if (!topicNamed) {
      best = null;
      ambiguous = false;
    }
  }

  const isSubjectScopedInquiry =
    isSubjectStatusInquiry(folded) ||
    /^what\s+(?:should\s+(?:i|we)\s+)?do\s+(?:in|for|about)\b/i.test(folded) ||
    /^what\s+to\s+(?:strengthen|reinforce)\b/i.test(folded);
  if (isSubjectScopedInquiry && subjHits[0]) {
    const tail = stripTopicInquiryPrefixes(folded).replace(/^(?:in|at|with)\s+/i, "").trim();
    const sid = subjHits[0].subjectId;
    const subjectLabels = [subjectLabel(sid), ...(SUBJECT_HE_ALIASES[sid] || [])].map((l) =>
      foldUtteranceForMatch(l),
    );
    const topicExplicit =
      best &&
      (foldedIncludesPhrase(folded, best.row.displayNameFolded) ||
        topicAliasPhrases(best.row.subjectId, best.row.topicBaseKey).some((a) =>
          foldedIncludesPhrase(folded, a),
        ));
    if (!topicExplicit && (subjectLabels.includes(tail) || subjectLabels.some((l) => foldedIncludesPhrase(folded, l)))) {
      best = null;
      subjectId = sid;
      ambiguous = false;
    }
  }

  const sameTopicBase =
    best && second && best.row.topicBaseKey && best.row.topicBaseKey === second.row.topicBaseKey;

  let gradeSplitTopicRows = [];
  if (sameTopicBase && best?.row?.topicBaseKey) {
    gradeSplitTopicRows = hits
      .filter((h) => h.row.topicBaseKey === best.row.topicBaseKey && h.score > 0)
      .map((h) => h.row);
    const grades = new Set(gradeSplitTopicRows.map((r) => r.contentGradeKey).filter(Boolean));
    if (grades.size < 2) gradeSplitTopicRows = [];
  }

  if (gradeSplitTopicRows.length >= 2 && isTopicWeaknessInquiry(folded)) {
    const weakest = [...gradeSplitTopicRows].sort(
      (a, b) => (Number(a.accuracy) || 0) - (Number(b.accuracy) || 0) || (Number(a.questions) || 0) - (Number(b.questions) || 0),
    )[0];
    if (weakest) {
      best = { row: weakest, score: best?.score ?? 0 };
      ambiguous = false;
    }
  }

  return {
    best: best ? best.row : null,
    bestScore: best?.score ?? 0,
    subjectId: best ? best.row.subjectId : subjectId,
    ambiguous: ambiguous && !sameTopicBase,
    candidates: hits.slice(0, 4).map((h) => h.row),
    gradeSplitTopicRows,
    mixedGradeQuestion: isMixedGradeReportQuestion(folded),
    foldedUtterance: folded};
}

/**
 * @param {string} folded
 */
export function isSubjectStatusInquiry(folded) {
  const t = String(folded || "").trim();
  return (
    /^(?:how\s+(?:is\s+)?(?:he|she|the\s+(?:boy|girl|kid|child)|my\s+(?:son|daughter))|what(?:'s|\s+is)\s+(?:the\s+)?(?:status|situation)|what(?:'s|\s+happening|going\s+on))(?:\s|$)/i.test(
      t,
    ) && /\s+(?:in|at|with)\s+/i.test(t)
  );
}

/**
 * @param {string} folded
 */
export function isGeneralReportQuestion(folded) {
  const t = String(folded || "").trim();
  if (t.length < 3) return false;
  return (
    /^what(?:'s|\s+is)\s+(?:the\s+)?(?:problem|issue)\??$/i.test(t) ||
    /^what(?:'s|\s+is)\s+(?:the\s+)?(?:problem|issue)\s/i.test(t) ||
    /^what(?:'s|\s+is)\s+(?:hard|difficult)(?:\s+for\s+(?:him|her|the\s+child))?/i.test(t) ||
    /^what(?:'s|\s+is)\s+good(?:\s+for\s+(?:him|her))?/i.test(t) ||
    /^what\s+to\s+(?:strengthen|reinforce)/i.test(t) ||
    /^what\s+(?:should\s+(?:i|we)\s+)?do\s+at\s+home/i.test(t) ||
    /^what\s+(?:should\s+(?:i|we)\s+)?do\s+(?:in|for|about)\b/i.test(t) ||
    /^what(?:'s|\s+is)\s+(?:the\s+)?most\s+important/i.test(t) ||
    /^where\s+(?:is\s+)?(?:he|she)\s+(?:weak|strong|struggling)/i.test(t) ||
    /^what\s+(?:is\s+)?(?:he|she)\s+(?:strong|struggling)\s+(?:in|at|with)/i.test(t) ||
    /^what\s+does\s+the\s+report\s+say/i.test(t) ||
    /^what\s+does\s+the\s+report\s+say\s+briefly/i.test(t) ||
    /^what\s+(?:has\s+)?improved/i.test(t) ||
    /^what\s+(?:should\s+(?:i|we)\s+)?do\s+(?:this\s+week|now)/i.test(t) ||
    /why\s+(?:does|did)\s+the\s+report\s+say/i.test(t) ||
    /^explain\s+(?:to\s+me\s+)?(?:the\s+)?report/i.test(t) ||
    /^how\s+(?:is\s+)?(?:he|she)\s+(?:in|at|with)\b/i.test(t) ||
    /^what(?:'s|\s+is)\s+(?:the\s+)?(?:status|situation)\s+(?:in|at|with)\b/i.test(t) ||
    /^what(?:'s|\s+happening|going\s+on)\s+(?:in|at|with)\b/i.test(t)
  );
}

/**
 * @param {string} folded
 */
export function isMixedGradeReportQuestion(folded) {
  const t = String(folded || "").trim();
  return (
    /two\s+grades|two\s+grade\s+rows|another\s+grade|practiced\s+(?:a\s+)?different\s+grade|higher\s+grade|lower\s+grade|relative\s+to\s+(?:his|her)\s+grade|in\s+(?:a\s+)?(?:higher|lower)\s+grade|above\s+(?:his|her)\s+grade|below\s+(?:his|her)\s+grade/i.test(
      t,
    )
  );
}

/**
 * @param {string} folded
 */
export function isVagueTopicSelectionRequest(folded) {
  const t = String(folded || "").trim();
  return (
    /(?:a\s+)?specific\s+topic|about\s+a\s+(?:certain|specific)\s+topic|want\s+to\s+know\s+about\s+a\s+(?:certain|specific)\s+topic/i.test(
      t,
    )
  );
}

/**
 * @param {unknown} payload
 */
export function buildTopicClarificationQuestionHe(payload) {
  const rows = listReportRows(payload)
    .filter((r) => r.anchored)
    .slice(0, 6);
  const examples = [];
  const seen = new Set();
  for (const r of rows) {
    const subj = r.subjectLabel;
    const label =
      foldUtteranceForMatch(r.displayName) === foldUtteranceForMatch(subj)
        ? r.displayName
        : `${subj} · ${r.displayName}`;
    const key = foldUtteranceForMatch(label);
    if (seen.has(key)) continue;
    seen.add(key);
    examples.push(label);
  }
  const ex =
    examples.length > 0 ? examples.join(", ") : "Math, fractions, reading comprehension or science";
  return `What topic would you like to know about? For example ${ex}.`;
}

/**
 * True when utterance should enter the report pipeline (not ambiguous/off-topic) because it
 * references a report row, a report subject, or a valid general report question.
 * @param {string} utterance
 * @param {unknown} payload
 */
function isStandaloneGenericKnowledgeQuestion(folded) {
  const t = String(folded || "").trim();
  return (
    /^what\s+is(?:\s|$)/i.test(t) ||
    /^who\s+invented/i.test(t) ||
    /^who\s+discovered/i.test(t) ||
    /^who\s+wrote/i.test(t) ||
    /^how\s+(?:do\s+you|to)\s+(?:make|prepare)/i.test(t)
  );
}

export function utteranceQualifiesAsReportQuestion(utterance, payload) {
  if (!payload || typeof payload !== "object") return false;
  const folded = foldUtteranceForMatch(utterance);
  if (hasAnchoredReportRows(payload) && isContextualFollowUpUtterance(utterance)) return true;
  if (
    hasAnchoredReportRows(payload) &&
    /what(?:'s|\s+is)?\s*important|important\s+here|what\s+about|strong(?:est)?\s+subject|what\s+(?:are\s+)?the\s+mistakes|notable\s+mistakes/i.test(
      folded,
    )
  ) {
    return true;
  }
  if (
    isStandaloneGenericKnowledgeQuestion(folded) &&
    !/report|practice|struggling|strong|weak|according\s+to\s+the\s+report|at\s+school|learning/i.test(folded)
  ) {
    return false;
  }
  if (isVagueTopicSelectionRequest(folded) && hasAnchoredReportRows(payload)) return true;
  if (hasAnchoredReportRows(payload) && isGeneralReportQuestion(folded)) return true;
  if (hasAnchoredReportRows(payload) && isMixedGradeReportQuestion(folded)) return true;
  const res = resolveReportRowFromUtterance(utterance, payload);
  if (res.best && res.bestScore >= 8) return true;
  if (
    res.subjectId &&
    !res.best &&
    /how\s+(?:is\s+)?(?:he|she)|what(?:'s|\s+is)\s+(?:the\s+)?(?:status|situation)|what(?:'s|\s+happening|going\s+on)|in\s+(?:the\s+)?subject/i.test(
      folded,
    )
  ) {
    return true;
  }
  if (
    res.best &&
    /explain|tell\s+me|what(?:'s|\s+is)\s+(?:the\s+)?(?:problem|issue)|what\s+(?:should\s+(?:i|we)\s+)?do|want\s+to\s+(?:know|understand)/i.test(
      folded,
    )
  ) {
    return true;
  }
  return false;
}

export default {
  listReportRows,
  hasAnchoredReportRows,
  resolveReportRowFromUtterance,
  stripTopicInquiryPrefixes,
  isGeneralReportQuestion,
  isMixedGradeReportQuestion,
  isVagueTopicSelectionRequest,
  buildTopicClarificationQuestionHe,
  utteranceQualifiesAsReportQuestion,
  SUBJECT_HE_ALIASES,
  TOPIC_HE_ALIASES};
