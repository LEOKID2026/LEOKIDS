/**
 * Parent-facing copy from engineDiagnosticDecision only — no engine/threshold changes.
 * Templates per Stage parent copy spec (engine decision × safeSubskill).
 */

import { subjectLabelHe } from "../../lib/teacher-portal/teacher-ui.js";
import { TAXONOMY_BY_ID } from "../diagnostic-engine-v2/taxonomy-registry.js";
import { resolveGradeAwareParentRecommendationHe } from "./grade-aware-recommendation-resolver.js";
import { splitTopicRowKey } from "../parent-report-row-diagnostics.js";
import { buildSpeedPressurePatternFindingHe } from "../learning-pattern-decision/normalize-parent-practice-metrics.js";

/** Home actions by taxonomy id — editorial parent copy, not engine logic. */
const HOME_ACTION_BY_TAXONOMY_ID = Object.freeze({
  "M-02":
    "Solve column-addition problems, mark the ones and tens, and ask the child to explain when a ten is carried to the next column.",
  "M-09":
    "Solve column-subtraction problems slowly, mark where a ten is borrowed from, and check every step before the answer.",
  "M-01":
    "Break numbers into tens and ones, or hundreds, tens and ones, and then solve.",
  "M-04":
    "For every fraction, ask \"how many parts are there in total?\" and \"how many parts did we take?\" before calculating.",
  "M-05":
    "Draw two simple fractions, compare them in the drawing, and only then move to calculation.",
  "M-03":
    "Work with equal groups, for example \"3 groups of 4\", and ask the child to explain what each number represents.",
  "M-10":
    "Work with equal groups, for example \"3 groups of 4\", and ask the child to explain what each number represents.",
  "G-03":
    "Show a shape and ask \"what are we measuring inside the shape?\" Then calculate together using area units.",
  "G-08":
    "Show a shape and ask \"what are we measuring inside the shape?\" Then calculate together using area units.",
  "G-06":
    "Show a shape and ask \"what are we measuring around the shape?\" Then add up the side lengths.",
  "G-04":
    "For every shape, first ask \"are we measuring inside or around it?\", and only then calculate.",
  "G-02":
    "Mark the units next to every number and check that the answer is written with the correct unit.",
  "G-01":
    "Ask the child to point to the given data in the drawing before starting to solve.",
  "E-01":
    "Read 5-8 short words, ask the child to say the meaning, and then use one word in a short sentence.",
  "E-02":
    "Give a word, ask the child to say it in English, and then check the spelling and meaning together.",
  "E-03":
    "Read a word in English, ask the child to explain its meaning, not just pick an answer.",
  "E-05":
    "Show two similar words, read them slowly, and point out what's different between them.",
  "E-06":
    "Read a short sentence, pause, and ask \"what does the sentence say?\"",
  "H-04":
    "Read a short sentence out loud, pause, and ask the child to explain what they read.",
  "H-02":
    "Read the sentence and ask what role the word plays in it, without rushing to an answer.",
  "H-06":
    "Read the sentence and ask what role the word plays in it, without rushing to an answer.",
  "H-01":
    "Choose one word from the question, ask the child to explain it in their own words, then use it in a sentence.",
  "H-03":
    "Write the word, read it out loud, and mark the part where the mistake was.",
  "H-07":
    "Write the word, read it out loud, and mark the part where the mistake was.",
  "S-01":
    "Review 3 short facts, then ask one question without looking.",
  "S-02":
    "Review 3 short facts, then ask one question without looking.",
  "S-03":
    "Put two concepts side by side, ask \"what's similar?\" and \"what's different?\", then solve one question.",
  "S-04":
    "Ask \"what happened first?\" and \"what happened because of that?\"",
  "S-05":
    "Ask \"what happened first?\" and \"what happened because of that?\"",
  "S-06":
    "Put the steps of the process in order, then explain each step in a short sentence.",
  "S-07":
    "Choose one concept, ask the child to explain it in their own words, then give a real-life example.",
  "MG-01":
    "Practice reading a map scale using a ruler or scale line, and ask the child to explain what a distance on the map represents.",
  "MG-02":
    "Practice map directions using a north arrow, and ask the child to explain which direction to go.",
  "MG-03":
    "Practice short scenarios that require distinguishing between a right, an obligation, or a rule, and ask the child to explain what in the text supports the answer.",
  "MG-04":
    "Practice ordering events by time, and ask the child to explain which event happened first and what the evidence is.",
  "MG-05":
    "Practice comparing areas on a map using the legend, colors and symbols, and ask the child to show which map data was used.",
  "MG-06":
    "Practice cause-and-effect questions, and ask the child to separate a fact stated in the text from an opinion.",
  "MG-07":
    "Practice matching community institutions to their roles, and ask the child to explain who uses the institution and what service it provides.",
  "MG-08":
    "Practice reading a map legend and symbols, and ask the child to identify the relevant data before answering.",
});

/** Parent-facing subskill labels — taxonomy ids unchanged; editorial copy only. */
const PARENT_SUBSKILL_LABEL_HE = Object.freeze({
  "M-02": "carrying in addition",
  "H-04": "finding information in a text",
  "S-03": "understanding the connection between body parts",
  "MG-01": "reading a map scale",
  "MG-02": "directions and north on a map",
  "MG-03": "rights, obligations and rules",
  "MG-04": "ordering events on a timeline",
  "MG-05": "reading a climate map",
  "MG-06": "cause and effect",
  "MG-07": "institutions in the community",
  "MG-08": "map legend and symbols",
});

const TOPIC_ONLY_HOME = Object.freeze({
  strengthening:
    "Practice a small number of questions on this topic, and ask the child to explain out loud how they reached the answer. If the same kind of mistake repeats, the report will be able to narrow it down further later.",
  clear_gap:
    "Go back to simpler questions on this topic, solve 3-5 examples together, and then let the child explain the solving method in their own words.",
  partial:
    "Continue at the same level a bit longer, with a short check after every answer.",
  mastery:
    "Keep the topic fresh with occasional short practice, and check that accuracy holds on new questions too.",
  early:
    "Do a bit more short practice on this topic before drawing a clear conclusion.",
  insufficient:
    "Do a few more questions on this topic, then check the report again.",
});

function clean(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

function subjectLabel(subject, subjectId) {
  const s = clean(subject);
  if (s) return s;
  return subjectLabelHe(String(subjectId || "")) || "";
}

/**
 * @param {string|null|undefined} taxonomyId
 * @param {boolean} safe
 * @param {string} [topicLabel]
 */
function parentSubskillLabelHe(taxonomyId, safe, topicLabel = "") {
  if (!safe || !taxonomyId) return null;
  const id = String(taxonomyId).trim();
  const mapped = PARENT_SUBSKILL_LABEL_HE[id];
  if (mapped) return mapped;

  const row = TAXONOMY_BY_ID[id];
  const name = clean(row?.subskillHe);
  if (!name) return null;

  if (id === "H-04") {
    const topic = clean(topicLabel);
    if (/reading comprehension/i.test(topic)) return "reading comprehension";
    return "finding information in a text";
  }

  return /^[a-zA-Z][a-zA-Z0-9_/\-\s]*$/.test(name) ? null : name;
}

/**
 * @param {object} p
 */
function resolveHomeActionHe(p) {
  const { taxonomyId, safeSubskill, subjectId, gradeKey, bucketKey, engineDecision } = p;
  if (safeSubskill && taxonomyId) {
    const direct = HOME_ACTION_BY_TAXONOMY_ID[taxonomyId];
    if (direct) return direct;
    const fromTemplate = resolveGradeAwareParentRecommendationHe({
      subjectId,
      gradeKey,
      taxonomyId,
      bucketKey,
      slot: "action",
    });
    if (fromTemplate) return fromTemplate;
  }
  if (engineDecision === "clear_topic_gap") return TOPIC_ONLY_HOME.clear_gap;
  if (engineDecision === "topic_needs_strengthening") return TOPIC_ONLY_HOME.strengthening;
  if (engineDecision === "partial_stable") return TOPIC_ONLY_HOME.partial;
  if (engineDecision === "mastery_stable") return TOPIC_ONLY_HOME.mastery;
  if (engineDecision === "early_direction_only") return TOPIC_ONLY_HOME.early;
  return TOPIC_ONLY_HOME.insufficient;
}

/**
 * @param {Record<string, unknown>|null|undefined} sig
 */
function competitiveModeContextHe(sig) {
  if (!sig || typeof sig !== "object") return "";
  const ed = sig.engineDiagnosticDecision && typeof sig.engineDiagnosticDecision === "object"
    ? sig.engineDiagnosticDecision
    : null;
  const decision = clean(ed?.engineDecision);
  const diagType = clean(sig.diagnosticType);
  const speedRisk = sig.riskFlags?.speedOnlyRisk === true;

  if (decision === "speed_pressure_pattern" || diagType === "speed_pressure" || speedRisk) {
    return (
      "Some of the mistakes appear related to solving too quickly. It helps to practice pausing briefly before submitting: re-read the question, check the answer, and only then continue."
    );
  }
  return "";
}

/**
 * Diagnostic body only — no home-action lines (those go to actionHe).
 * @param {object} p
 */
function buildDiagnosticBodyByDecision(p) {
  const subj = subjectLabel(p.subjectLabelHe, p.subjectId);
  const topic = clean(p.topic);
  const q = Math.round(Number(p.q) || 0);
  const acc = Math.round(Number(p.acc) || 0);
  const decision = clean(p.engineDecision);
  const subskill = p.subskillHe;

  if (decision === "mastery_stable") {
    let body =
      `In ${subj} - topic ${topic}, good command is showing. The child solved ${q} questions with ${acc}% accuracy.`;
    if (subskill) body += ` Stability is especially visible in ${subskill}.`;
    return body;
  }

  if (decision === "partial_stable") {
    let body =
      `In ${subj} - topic ${topic}, understanding looks partial but good, though not full mastery yet. ` +
      `The child solved ${q} questions with ${acc}% accuracy.`;
    if (subskill) body += ` It looks like ${subskill} is especially worth reinforcing.`;
    return body;
  }

  if (decision === "topic_needs_strengthening") {
    let body =
      `In ${subj} - topic ${topic}, there's a point worth reinforcing. ` +
      `The child solved ${q} questions with ${acc}% accuracy. ` +
      "The data shows this topic isn't stable yet, so focused practice would help.";
    if (subskill) body += ` The main point to reinforce is ${subskill}.`;
    return body;
  }

  if (decision === "clear_topic_gap") {
    let body =
      `In ${subj} - topic ${topic}, this looks like a topic worth reinforcing. ` +
      `The child solved ${q} questions with ${acc}% accuracy, so it helps to pause and reinforce the basics before moving on.`;
    if (subskill) body += ` The main point to reinforce is ${subskill}.`;
    return body;
  }

  if (decision === "early_direction_only") {
    if (q <= 5) return `There's still limited data on the topic ${topic} - a bit more practice will help us understand better.`;
    return `This is only an early picture for the topic ${topic}, but a bit more practice would help before a clear conclusion.`;
  }

  if (decision === "insufficient_data" || q < 5) {
    if (q <= 5) return `There's still limited data on the topic ${topic} - a bit more practice will help us understand better.`;
    if (q <= 15) return `This is only an early picture for the topic ${topic}, but a bit more practice would help before a clear conclusion.`;
    return `It looks like ${topic} is a topic worth reinforcing in upcoming practice.`;
  }

  if (decision === "speed_pressure_pattern") {
    // Product-owner-approved wording — single source shared with
    // build-parent-report-engine-decision-contract.js (buildParentSafeFindingFromEngine).
    return buildSpeedPressurePatternFindingHe({ topicName: topic, wrong: p.wrong, questions: q, accuracy: acc });
  }

  return (
    `In ${subj} - topic ${topic}, there's a point worth following. ` +
    `The child solved ${q} questions with ${acc}% accuracy.`
  );
}

/**
 * Single home action text (no prefix).
 * @param {object} p
 */
function buildHomeActionTextHe(p) {
  const decision = clean(p.engineDecision);
  const subskill = p.subskillHe;
  const home = p.homeAction;

  if (decision === "mastery_stable") {
    if (subskill) return "Give a few similar questions at a slightly higher level, without rushing.";
    return TOPIC_ONLY_HOME.mastery;
  }
  if (decision === "partial_stable") {
    return subskill ? home : TOPIC_ONLY_HOME.partial;
  }
  if (decision === "topic_needs_strengthening") {
    return subskill ? home : TOPIC_ONLY_HOME.strengthening;
  }
  if (decision === "clear_topic_gap") {
    return subskill ? home : TOPIC_ONLY_HOME.clear_gap;
  }
  if (decision === "early_direction_only") return TOPIC_ONLY_HOME.early;
  if (decision === "insufficient_data") return TOPIC_ONLY_HOME.insufficient;
  if (decision === "speed_pressure_pattern") return "";
  return subskill ? home : TOPIC_ONLY_HOME.strengthening;
}

/**
 * Build parent topic copy from engineDiagnosticDecision (screen + PDF + insights).
 * @param {object} p
 * @param {string} [p.subjectId]
 * @param {string} [p.subjectLabelHe]
 * @param {string} [p.topic]
 * @param {string} [p.topicKey]
 * @param {number} [p.q]
 * @param {number} [p.acc]
 * @param {number} [p.wrong]
 * @param {string|null} [p.gradeKey]
 * @param {Record<string, unknown>|null} [p.topicEngineRowSignals]
 */
export function buildEngineDecisionParentTopicCopyHe(p) {
  const sig = p.topicEngineRowSignals && typeof p.topicEngineRowSignals === "object" ? p.topicEngineRowSignals : null;
  const ed = sig?.engineDiagnosticDecision && typeof sig.engineDiagnosticDecision === "object"
    ? sig.engineDiagnosticDecision
    : null;

  const subjectId = String(p.subjectId || "").trim();
  const topic = clean(p.topic);
  const q = Math.round(Number(p.q) || 0);
  const acc = Math.round(Number(p.acc) || 0);

  if (!topic || q <= 0) return null;

  let engineDecision = clean(ed?.engineDecision);
  if (!engineDecision && q < 5) engineDecision = "insufficient_data";
  if (!engineDecision && acc >= 90 && q >= 10) engineDecision = "mastery_stable";
  if (!engineDecision) engineDecision = acc < 55 ? "clear_topic_gap" : acc < 72 ? "topic_needs_strengthening" : "partial_stable";

  if (engineDecision === "insufficient_data" && q >= 5) {
    engineDecision = acc < 55 ? "clear_topic_gap" : acc < 72 ? "topic_needs_strengthening" : "partial_stable";
  }

  const safeSubskill = ed?.safeSubskillToShow === true;
  const taxonomyId =
    safeSubskill && ed?.subskillCandidate?.taxonomyId
      ? String(ed.subskillCandidate.taxonomyId).trim()
      : safeSubskill && sig?.subskillCandidate?.taxonomyId
        ? String(sig.subskillCandidate.taxonomyId).trim()
        : safeSubskill && ed?.taxonomyMatchId
          ? String(ed.taxonomyMatchId).trim()
          : null;

  const subskillHe =
    engineDecision === "early_direction_only" || engineDecision === "insufficient_data"
      ? null
      : parentSubskillLabelHe(taxonomyId, safeSubskill, topic);

  const { bucketKey } = splitTopicRowKey(String(p.topicKey || ""));
  const homeAction = resolveHomeActionHe({
    taxonomyId,
    safeSubskill,
    subjectId,
    gradeKey: p.gradeKey,
    bucketKey,
    engineDecision,
  });

  const copyCtx = {
    subjectId,
    subjectLabelHe: p.subjectLabelHe,
    topic,
    q,
    acc,
    wrong: p.wrong,
    engineDecision,
    subskillHe,
    homeAction,
  };

  const diagnosticBody = buildDiagnosticBodyByDecision(copyCtx);
  const homeActionText = buildHomeActionTextHe(copyCtx);
  const actionHe = homeActionText ? `What to try together: ${homeActionText}` : "";

  // speed_pressure_pattern's diagnosticBody already IS the single canonical
  // sentence (incl. the untimed-practice check) — do not append a second,
  // duplicate speed remark for the same decision on the same surface.
  const modeContextHe = engineDecision === "speed_pressure_pattern" ? "" : competitiveModeContextHe(sig);
  const dataHe = `The child solved ${q} questions with ${acc}% accuracy.`;

  let summaryHe = diagnosticBody;
  if (actionHe) summaryHe += ` ${actionHe}`;
  if (modeContextHe) summaryHe += ` ${modeContextHe}`;

  return {
    summaryHe,
    dataHe,
    whyHe: diagnosticBody,
    actionHe,
    patternHe: "",
    modeContextHe,
    engineDecision,
    safeSubskill: safeSubskill === true,
    subskillHe,
  };
}

/**
 * @param {ReturnType<typeof buildEngineDecisionParentTopicCopyHe>} engineCopy
 * @param {string} label
 */
export function buildExplainIdentifiedLineHe(engineCopy, label) {
  const t = clean(label);
  if (!engineCopy || !t) return "";
  switch (engineCopy.engineDecision) {
    case "mastery_stable":
      return `What we see: good command of the topic ${t}.`;
    case "partial_stable":
      return `What we see: partial command of the topic ${t}.`;
    case "clear_topic_gap":
      return "What's worth reinforcing: this looks like a topic that needs more practice.";
    case "topic_needs_strengthening":
      return `What we see: a point worth reinforcing in the topic ${t}.`;
    case "early_direction_only":
      return `What we see: this is only an early picture for the topic ${t}.`;
    case "insufficient_data":
      return `What we see: a topic to keep an eye on: ${t}.`;
    case "deferred_topic_only":
      return `What we see: a general picture for the topic ${t}.`;
    case "speed_pressure_pattern":
      // No second sentence for this decision on the same surface: the canonical
      // buildSpeedPressurePatternFindingHe text already appears once (via
      // engineCopy.whyHe/meaning). Also — there is no evidence that the mistakes are
      // CAUSED BY speed; the only proven fact is that they occurred during fast/timed
      // practice, which the canonical sentence already states without overclaiming causation.
      return "";
    default:
      return `What we see: focus on the topic ${t}.`;
  }
}

/** Strip technical engine ids if they leak into parent text. */
export const PARENT_TECHNICAL_ID_STRIP_RE =
  /\b(clear_topic_gap|partial_stable|mastery_stable|topic_needs_strengthening|early_direction_only|insufficient_data|speed_pressure_pattern|engineDecision|safeSubskill|taxonomy|metadata|candidate|fallback)\b/g;

/**
 * One-line insight for parentFacing.insights array.
 * @param {Record<string, unknown>} row
 */
export function buildEngineDecisionInsightLineHe(row) {
  const copy = buildEngineDecisionParentTopicCopyHe({
    subjectId: row.subjectId,
    subjectLabelHe: row.subjectLabelHe,
    topic: row.label,
    topicKey: row.topicKey,
    q: row.questions,
    acc: row.accuracy,
    wrong: row.wrong,
    gradeKey: row.gradeKey,
    topicEngineRowSignals: row.topicEngineRowSignals,
  });
  return copy?.summaryHe || "";
}
