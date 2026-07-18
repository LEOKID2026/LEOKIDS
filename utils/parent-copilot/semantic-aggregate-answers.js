/**
 * Answer-first composed replies for aggregate question classes (ranking / listing / period).
 * Uses only payload.subjectProfiles numeric fields + executiveSummary lines; no new contract facts.
 */

import { copilotStaticMessage } from "../../lib/parent-copilot/copilot-static-message.js";
import { SUBJECT_ORDER, normalizeSubjectId, subjectLabelHe } from "./contract-reader.js";
import { normalizeExecutiveTrendLinesHe } from "../parent-report-language/parent-facing-normalize-he.js";

/**
 * @param {string} s
 */
function norm(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ");
}

function readinessScore(v) {
  const x = String(v || "").trim().toLowerCase();
  if (x === "ready") return 3;
  if (x === "emerging") return 2;
  if (x === "forming" || x === "partial" || x === "moderate") return 1;
  return 0;
}

function confidenceScore(v) {
  const x = String(v || "").trim().toLowerCase();
  if (x === "high") return 2;
  if (x === "medium" || x === "moderate") return 1;
  return 0;
}

/**
 * @param {unknown} payload
 */
function subjectRollups(payload) {
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  const bySubject = Object.fromEntries(profiles.map((sp) => [normalizeSubjectId(sp?.subject), sp]));
  /** @type {Array<{
   *   sid: string; label: string; totalQ: number; avg: number | null; topicRows: number; dataTopics: number;
   *   lowConfidenceTopics: number; insufficientTopics: number; cannotConcludeTopics: number; accStdDev: number | null;
   *   readinessAvg: number; confidenceAvg: number;
   * }>} */
  const rows = [];
  for (const sid of SUBJECT_ORDER) {
    const sp = bySubject[sid];
    if (!sp) continue;
    const list = Array.isArray(sp.topicRecommendations) ? sp.topicRecommendations : [];
    let totalQ = 0;
    let wAcc = 0;
    let dataTopics = 0;
    let lowConfidenceTopics = 0;
    let insufficientTopics = 0;
    let cannotConcludeTopics = 0;
    let readinessSum = 0;
    let confidenceSum = 0;
    /** @type {number[]} */
    const accList = [];
    for (const tr of list) {
      const q = Math.max(0, Number(tr?.questions ?? tr?.q) || 0);
      const acc = Math.max(0, Math.min(100, Math.round(Number(tr?.accuracy) || 0)));
      const cv = tr?.contractsV1 && typeof tr.contractsV1 === "object" ? tr.contractsV1 : {};
      const r = readinessScore(cv?.readiness?.readiness);
      const c = confidenceScore(cv?.confidence?.confidenceBand);
      readinessSum += r;
      confidenceSum += c;
      if (cv?.decision?.cannotConcludeYet === true) cannotConcludeTopics += 1;
      if (c <= 0) lowConfidenceTopics += 1;
      if (r <= 0) insufficientTopics += 1;
      if (q > 0) {
        totalQ += q;
        wAcc += acc * q;
        dataTopics += 1;
        accList.push(acc);
      }
    }
    if (totalQ <= 0) {
      const qFromSubject = Math.max(0, Number(sp?.subjectQuestionCount) || 0);
      const accFromSubject = Math.max(0, Math.min(100, Math.round(Number(sp?.subjectAccuracy) || 0)));
      if (qFromSubject > 0) {
        totalQ = qFromSubject;
        wAcc = accFromSubject * qFromSubject;
        dataTopics = Math.max(1, dataTopics);
      }
    }
    const avg = totalQ > 0 ? Math.round(wAcc / totalQ) : null;
    const mean = accList.length ? accList.reduce((a, b) => a + b, 0) / accList.length : null;
    const variance =
      mean == null
        ? null
        : accList.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / Math.max(1, accList.length);
    rows.push({
      sid,
      label: subjectLabelHe(sid),
      totalQ,
      avg,
      topicRows: list.length,
      dataTopics,
      lowConfidenceTopics,
      insufficientTopics,
      cannotConcludeTopics,
      accStdDev: variance == null ? null : Math.round(Math.sqrt(variance)),
      readinessAvg: list.length ? readinessSum / list.length : 0,
      confidenceAvg: list.length ? confidenceSum / list.length : 0,
    });
  }
  return rows;
}

/**
 * Subjects that appear in the report with at least one topic row (chronological order).
 * @param {unknown} payload
 */
function subjectsListedInReport(payload) {
  const profiles = Array.isArray(payload?.subjectProfiles) ? payload.subjectProfiles : [];
  const present = new Set(profiles.map((p) => normalizeSubjectId(p?.subject)).filter(Boolean));
  /** @type {string[]} */
  const out = [];
  for (const sid of SUBJECT_ORDER) {
    if (!present.has(sid)) continue;
    const sp = profiles.find((p) => normalizeSubjectId(p?.subject) === sid);
    const list = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
    const subjectQ = Math.max(0, Number(sp?.subjectQuestionCount) || 0);
    if (list.length > 0 || subjectQ > 0) out.push(sid);
  }
  return out;
}

/**
 * @param {string} utterance
 * @param {unknown} payload
 * @returns {string[]} subject ids in order of first mention in utterance
 */
function subjectsMentionedInUtterance(utterance, payload) {
  const u = norm(utterance);
  const listed = subjectsListedInReport(payload);
  /** @type {Array<{ sid: string; idx: number; len: number }>} */
  const hits = [];
  for (const sid of listed) {
    const lab = subjectLabelHe(sid);
    const idx = u.indexOf(lab);
    if (idx >= 0) hits.push({ sid, idx, len: lab.length });
  }
  /** Informal wording parents use (e.g. "reading" ≈ Hebrew / literacy). Longer needles first. */
  const informalNeedles = [
    ["hebrew", "reading words"],
    ["hebrew", "Reading sentences"],
    ["hebrew", "Reading comprehension"],
    ["math", "Math"],
    ["hebrew", "Hebrew"],
    ["english", "English"],
    ["science", "Science"],
    ["geometry", "Geometry"],
    ["moledet-geography", "Homeland & Geography"],
    ["moledet-geography", "Homeland Studies"],
    ["math", "Math"],
    ["hebrew", "Reading"],
  ];
  for (const [sid, needle] of informalNeedles) {
    if (!listed.includes(sid)) continue;
    const idx = u.indexOf(needle);
    if (idx >= 0) hits.push({ sid, idx, len: needle.length });
  }
  hits.sort((a, b) => a.idx - b.idx || b.len - a.len);
  const seen = new Set();
  /** @type {string[]} */
  const ordered = [];
  for (const h of hits) {
    if (seen.has(h.sid)) continue;
    seen.add(h.sid);
    ordered.push(h.sid);
  }
  return ordered;
}

/**
 * @param {ReturnType<typeof subjectRollups>} rows
 */
function mostStableSubject(rows) {
  if (!rows.length) return null;
  const scored = rows.map((r) => {
    const qFactor = Math.min(1, Math.log10(Math.max(1, r.totalQ + 1)));
    const conf = r.confidenceAvg / 2;
    const read = r.readinessAvg / 3;
    const variancePenalty = r.accStdDev == null ? 0.45 : Math.min(1, r.accStdDev / 40);
    const score = conf * 0.45 + read * 0.35 + qFactor * 0.35 - variancePenalty * 0.35;
    return { r, score };
  });
  scored.sort((a, b) => b.score - a.score || b.r.totalQ - a.r.totalQ);
  return scored[0]?.r || null;
}

/**
 * @param {NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>} truthPacket
 * @param {string} obs
 * @param {string} meaning
 */
function passesEnvelope(truthPacket, obs, meaning, caution = "") {
  const joined = `${obs} ${meaning} ${caution || ""}`;
  for (const ph of truthPacket?.allowedClaimEnvelope?.forbiddenPhrases || []) {
    if (ph && joined.includes(String(ph))) return false;
  }
  const nar = truthPacket?.contracts?.narrative;
  const slotText = [
    String(nar?.textSlots?.observation || ""),
    String(nar?.textSlots?.interpretation || ""),
    String(nar?.textSlots?.action || ""),
    String(nar?.textSlots?.uncertainty || ""),
  ].join(" ");
  const slotBundle = slotText + joined;
  for (const hedge of truthPacket?.allowedClaimEnvelope?.requiredHedges || []) {
    if (hedge && !slotBundle.includes(String(hedge))) return false;
  }
  return true;
}

/**
 * @param {NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>} truthPacket
 * @param {string} obs
 * @param {string} meaning
 */
function ensureRequiredHedges(truthPacket, obs, meaning) {
  let o = obs;
  let m = meaning;
  const req = Array.isArray(truthPacket?.allowedClaimEnvelope?.requiredHedges)
    ? truthPacket.allowedClaimEnvelope.requiredHedges.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
  for (const h of req) {
    const bundle = `${o} ${m}`;
    if (h && !bundle.includes(h)) {
      o = `${h} ${o}`.trim();
    }
  }
  return { obs: o, meaning: m };
}

/** Keeps comparison answers direct-first: add required hedges to meaning tail, not observation lead. */
function ensureRequiredHedgesTrailing(truthPacket, obs, meaning) {
  let o = String(obs || "").trim();
  let m = String(meaning || "").trim();
  const req = Array.isArray(truthPacket?.allowedClaimEnvelope?.requiredHedges)
    ? truthPacket.allowedClaimEnvelope.requiredHedges.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
  for (const h of req) {
    const bundle = `${o} ${m}`;
    if (h && !bundle.includes(h)) {
      m = `${m} · ${h}.`.trim();
    }
  }
  return { obs: o, meaning: m };
}

/**
 * @param {NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>} truthPacket
 */
function narrativeTextSlots(truthPacket) {
  const nar =
    truthPacket.contracts?.narrative?.textSlots && typeof truthPacket.contracts.narrative.textSlots === "object"
      ? truthPacket.contracts.narrative.textSlots
      : {};
  return {
    observation: String(nar.observation || "").trim(),
    interpretation: String(nar.interpretation || "").trim(),
    action: String(nar.action || "").trim(),
    uncertainty: String(nar.uncertainty || "").trim(),
  };
}

/**
 * Answer-first: plain-language re-explain from narrative slots (not generic report summary).
 * @param {{
 *   utterance?: string;
 *   truthPacket: NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>;
 * }} input
 * @returns {{ answerBlocks: Array<{ type: string; answerText: string; source: "composed" }> } | null}
 */
function buildClarifyReexplainDraft(input) {
  const truthPacket = input?.truthPacket;
  if (!truthPacket) return null;
  const { observation, interpretation, uncertainty } = narrativeTextSlots(truthPacket);
  const hedges = Array.isArray(truthPacket.allowedClaimEnvelope?.requiredHedges)
    ? truthPacket.allowedClaimEnvelope.requiredHedges.map((h) => String(h || "").trim()).filter(Boolean)
    : [];
  const lead = hedges[0] ? `${hedges[0]} - ` : "";

  /** @type {string} */
  let obs = "";
  /** @type {string} */
  let meaning = "";

  if (interpretation.length >= 8) {
    obs = `${lead}In simple words, it means: ${interpretation}`;
  } else if (observation.length >= 8) {
    obs = `${lead}In simple words, this means: what you see in the report is that ${observation.charAt(0).toLowerCase()}${observation.slice(1)}`;
  } else if (uncertainty.length >= 8) {
    obs = `${lead}${uncertainty}`;
  } else {
    return null;
  }

  if (observation.length >= 8 && interpretation.length >= 8 && obs !== `${lead}${uncertainty}`) {
    meaning = `Within the numbers in the report: ${observation}`;
  } else if (uncertainty.length >= 8 && !obs.includes(uncertainty.slice(0, Math.min(24, uncertainty.length)))) {
    meaning = uncertainty;
  } else if (interpretation.length >= 8 && obs.includes(interpretation.slice(0, Math.min(24, interpretation.length))) && observation.length >= 8) {
    meaning = `Just to anchor to the report: ${observation}`;
  } else {
    meaning =
      uncertainty.length >= 8
        ? uncertainty
        : "This is still a picture from the report itself, without adding an explanation that did not appear there.";
  }

  ({ obs, meaning } = ensureRequiredHedges(truthPacket, obs, meaning));
  obs = norm(obs);
  meaning = norm(meaning);
  if (obs.length < 8 || meaning.length < 8) return null;
  if (!passesEnvelope(truthPacket, obs, meaning)) return null;
  return {
    answerBlocks: [
      { type: "observation", answerText: obs, source: "composed" },
      { type: "meaning", answerText: meaning, source: "composed" },
    ],
  };
}

/**
 * Answer-first: advance vs hold from derivedLimits + decision (bounded, parent language).
 * @param {{
 *   utterance?: string;
 *   truthPacket: NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>;
 * }} input
 * @returns {{ answerBlocks: Array<{ type: string; answerText: string; source: "composed" }> } | null}
 */
function buildAdvanceOrHoldDraft(input) {
  const truthPacket = input?.truthPacket;
  if (!truthPacket) return null;
  const dl = truthPacket.derivedLimits || {};
  const d =
    truthPacket.contracts?.decision && typeof truthPacket.contracts.decision === "object"
      ? truthPacket.contracts.decision
      : {};
  const tier = Number(d.decisionTier) || 0;
  const { observation, interpretation, uncertainty, action } = narrativeTextSlots(truthPacket);
  const hedges = Array.isArray(truthPacket.allowedClaimEnvelope?.requiredHedges)
    ? truthPacket.allowedClaimEnvelope.requiredHedges.map((h) => String(h || "").trim()).filter(Boolean)
    : [];
  const lead = hedges[0] ? `${hedges[0]} - ` : "";

  const holdStrong =
    dl.cannotConcludeYet === true ||
    dl.readiness === "insufficient" ||
    dl.confidenceBand === "low" ||
    tier < 2;

  const hasConcreteStep =
    dl.recommendationEligible === true &&
    dl.recommendationIntensityCap !== "RI0" &&
    action.length >= 8;

  /** @type {string} */
  let obs = "";
  /** @type {string} */
  let meaning = "";

  if (holdStrong) {
    obs = `${lead}At the moment it is better to wait and not to push for big progress: the report still does not have a sufficiently stable basis to say that it is worth "pressing the gas".`;
    meaning = norm(
      uncertainty ||
        interpretation ||
        (observation.length >= 8 ? `According to what appears in the report: ${observation}` : "You can continue with normal practice and check again after some more data."),
    );
  } else if (hasConcreteStep) {
    obs = `${lead}You can move forward, but carefully and in small steps - not to jump big steps at once.`;
    const tail = interpretation.length >= 8 ? ` ${interpretation}` : "";
    meaning = norm(`${action}${tail}`);
  } else {
    obs = `${lead}You can only progress at a slow pace: some practice, stopping to check, then deciding again according to what will appear in the report.`;
    meaning = norm(
      interpretation ||
        uncertainty ||
        (observation.length >= 8 ? observation : "This is not yet a stage for opening new goals that were not built from the report."),
    );
  }

  ({ obs, meaning } = ensureRequiredHedges(truthPacket, obs, meaning));
  obs = norm(obs);
  meaning = norm(meaning);
  if (obs.length < 8 || meaning.length < 8) return null;
  if (!passesEnvelope(truthPacket, obs, meaning)) return null;
  return {
    answerBlocks: [
      { type: "observation", answerText: obs, source: "composed" },
      { type: "meaning", answerText: meaning, source: "composed" },
    ],
  };
}

/**
 * Answer-first: recommendation / next-step / focus questions from contract slots only.
 * @param {{
 *   utterance?: string;
 *   truthPacket: NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>;
 * }} input
 * @returns {{ answerBlocks: Array<{ type: string; answerText: string; source: "composed" }> } | null}
 */
function buildRecommendationActionDraft(input) {
  const truthPacket = input?.truthPacket;
  const utterance = String(input?.utterance || "");
  if (!truthPacket) return null;

  const t = norm(utterance).toLowerCase();
  const { action, interpretation: interp, uncertainty: unc } = narrativeTextSlots(truthPacket);

  const dl = truthPacket.derivedLimits || {};
  const eligible =
    dl.recommendationEligible === true &&
    dl.recommendationIntensityCap !== "RI0" &&
    dl.cannotConcludeYet !== true;

  const hedges = Array.isArray(truthPacket.allowedClaimEnvelope?.requiredHedges)
    ? truthPacket.allowedClaimEnvelope.requiredHedges.map((h) => String(h || "").trim()).filter(Boolean)
    : [];
  const lead = hedges[0] ? `${hedges[0]} - ` : "";

  /** @type {string} */
  let obs = "";
  /** @type {string} */
  let meaning = "";

  if (eligible && action) {
    obs = `${lead}${action}`;
    if (/השבוע|בשבוע|שבוע\s+הקרוב/.test(t)) {
      meaning = interp
        ? `${interp} Within the framework of the week: break down the step that appears in the report into small units throughout the days, without adding goals that do not appear there.`
        : `As part of the week: break down the step that appears in the report into small units throughout the days, without adding goals that do not appear there.`;
    } else if (/עכשיו|היום|מיד|כרגע/.test(t) || /על\s+מה\s+להתמקד/.test(t)) {
      meaning = interp
        ? `${interp} Now: start from the step that appears in the report before further expansion.`
        : `Now: start from the step that appears in the report before further expansion.`;
    } else {
      meaning = interp
        ? `The context from the report: ${interp} This is the practical step that appears in the report at the moment, without going beyond what is explained there at this stage.`
        : `This is the practical step that appears in the report at the moment, without going beyond what is explained there at this stage.`;
    }
  } else {
    if (dl.cannotConcludeYet === true) {
      obs = `${lead}It is still too early in the report to clearly suggest the next house step - the picture is not yet closed.`;
    } else if (dl.recommendationEligible !== true || dl.recommendationIntensityCap === "RI0") {
      obs = `${lead}The report is not currently aimed at recommending a specific step from home; In such a situation it is better to keep practicing and collect another picture before deciding what to do next.`;
    } else if (!action) {
      obs = `${lead}The report currently does not contain a practical formulation of the next step - only a description of what we have seen so far.`;
    } else {
      obs = `${lead}We were not able to derive from the report the next step clearly; It is better to have a little more basis before deciding.`;
    }
    meaning = unc || interp || `It is recommended to return to the subject after more practice, or when a clearer line of direction appears in the report.`;
  }

  ({ obs, meaning } = ensureRequiredHedges(truthPacket, obs, meaning));
  obs = norm(obs);
  meaning = norm(meaning);
  if (obs.length < 8 || meaning.length < 8) return null;
  if (!passesEnvelope(truthPacket, obs, meaning)) return null;

  return {
    answerBlocks: [
      { type: "observation", answerText: obs, source: "composed" },
      { type: "meaning", answerText: meaning, source: "composed" },
    ],
  };
}

/**
 * @param {{
 *   questionClass: string;
 *   utterance?: string;
 *   payload: unknown;
 *   truthPacket: NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>;
 * }} input
 * @returns {{ answerBlocks: Array<{ type: string; answerText: string; source: "composed" }>; aggregateContinuity?: { questionClass: string; subjectId: string; role: string } | null } | null}
 */
export function buildSemanticAggregateDraft(input) {
  const qc = String(input?.questionClass || "");
  const utterance = String(input?.utterance || "");
  const payload = input?.payload;
  const truthPacket = input?.truthPacket;
  if (!truthPacket || !payload || typeof payload !== "object") return null;

  if (qc === "clarify_reexplain") {
    return buildClarifyReexplainDraft({ utterance, truthPacket });
  }
  if (qc === "advance_or_hold_question") {
    return buildAdvanceOrHoldDraft({ utterance, truthPacket });
  }
  if (qc === "recommendation_action") {
    return buildRecommendationActionDraft({ utterance, truthPacket });
  }

  if (
    qc !== "strongest_subject" &&
    qc !== "weakest_subject" &&
    qc !== "hardest_subject" &&
    qc !== "subject_listing" &&
    qc !== "period_highlight" &&
    qc !== "comparison" &&
    qc !== "most_practice" &&
    qc !== "least_data" &&
    qc !== "improved" &&
    qc !== "needs_attention" &&
    qc !== "still_unclear" &&
    qc !== "most_stable"
  ) {
    return null;
  }

  const hedges = Array.isArray(truthPacket.allowedClaimEnvelope?.requiredHedges)
    ? truthPacket.allowedClaimEnvelope.requiredHedges.map((h) => String(h || "").trim()).filter(Boolean)
    : [];
  const lead = hedges[0] ? `${hedges[0]} - ` : "";

  const roll = subjectRollups(payload);
  const withAvg = roll.filter((r) => r.avg != null);

  /** @type {string} */
  let obs = "";
  /** @type {string} */
  let meaning = "";
  /** @type {{ questionClass: string; subjectId: string; role: string } | null} */
  let aggregateContinuity = null;

  if (qc === "subject_listing") {
    const ids = subjectsListedInReport(payload);
    if (!ids.length) {
      obs = `${lead}The report does not currently show subjects with subject lines.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.when_subjects_appear_in_the_date_range_you_can_ask_again_and_get");
    } else {
      const names = ids.map((sid) => subjectLabelHe(sid)).join(" · ");
      obs = `${lead}The following subjects appear in the report: ${names}.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.the_list_is_based_on_the_subjects_that_are_shown_in_the_report_f");
    }
  } else if (qc === "period_highlight") {
    const es = payload?.executiveSummary && typeof payload.executiveSummary === "object" ? payload.executiveSummary : {};
    const trends = normalizeExecutiveTrendLinesHe(es.majorTrendsHe);
    if (trends.length) {
      obs = `What stands out in the period: ${trends.slice(0, 4).join(" · ")}.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.these_are_the_summary_formulations_for_the_period_as_they_appear");
      aggregateContinuity = { questionClass: qc, subjectId: "", role: "period_highlight" };
    } else if (withAvg.length) {
      const sorted = [...withAvg].sort((a, b) => (b.avg || 0) - (a.avg || 0) || b.totalQ - a.totalQ);
      const top = sorted.slice(0, 2);
      obs = `Currently the highest average overall accuracy rating in the report: ${top.map((r) =>`${r.label} (about ${r.avg}%)`).join(" · ")}.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.the_ranking_is_based_on_averages_across_subjects_with_practice_i");
      aggregateContinuity = { questionClass: qc, subjectId: top[0]?.sid || "", role: "period_numeric" };
    } else {
      obs = `There is currently not enough numerical practice across disciplines in the report to describe "what stands out" reliably.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.when_practice_data_appears_on_at_least_one_topic_with_questions_");
    }
  } else if (qc === "comparison") {
    const mentioned = subjectsMentionedInUtterance(utterance, payload);
    if (mentioned.length < 2) {
      obs = `${lead} To compare two subjects you need to specify the two names as they appear in your report.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.you_can_formulate_again_with_two_subject_names");
    } else {
      const a = roll.find((r) => r.sid === mentioned[0]);
      const b = roll.find((r) => r.sid === mentioned[1]);
      if (!a || !b || a.avg == null || b.avg == null) {
        obs = `${lead} There is mention of two subjects in the question, but the report lacks enough numerical practice data for both to compare in a stable way.`;
        meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.when_questions_and_accuracy_appear_for_both_subjects_you_can_ask");
      } else if (a.avg === b.avg) {
        obs = `${lead} According to the averages in the report, ${a.label} and ${b.label} are currently on the same line in terms of general accuracy (about ${a.avg}%).`;
        meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.in_order_to_differentiate_between_the_directions");
      } else {
        const hi = a.avg > b.avg ? a : b;
        const lo = a.avg > b.avg ? b : a;
        obs = `${hi.label} is currently higher than ${lo.label} - according to the average of the general accuracy in the report (about ${hi.avg}% vs. ${lo.avg}%).`;
        meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.the_comparison_is_based_on_averages_across_the_topics_that_have_");
        aggregateContinuity = { questionClass: qc, subjectId: hi.sid, role: "comparison_hi" };
      }
    }
  } else if (qc === "most_practice") {
    const listed = roll.filter((r) => r.topicRows > 0);
    if (!listed.length) {
      obs = `${lead}There are currently no active subjects in the report for the selected period.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.when_subjects_appear_with_subject_lines_you_can_return_to_the_qu");
    } else {
      const best = [...listed].sort((a, b) => b.totalQ - a.totalQ || b.topicRows - a.topicRows)[0];
      obs = `Most practice on report right now: ${best.label} (${best.totalQ} documented questions).`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.the_rating_is_based_on_the_actual_amount_of_questions_in_the_per");
      aggregateContinuity = { questionClass: qc, subjectId: best.sid, role: "most_practice" };
    }
  } else if (qc === "least_data") {
    const listed = roll.filter((r) => r.topicRows > 0);
    if (!listed.length) {
      obs = `${lead}There are currently no active subjects with data to compare in the report.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.when_active_subjects_appear_it_is_possible_to_identify_exactly_w");
    } else {
      const weakestData = [...listed].sort((a, b) => a.totalQ - b.totalQ || a.dataTopics - b.dataTopics)[0];
      obs = `The least amount of data in the report at the moment: ${weakestData.label} (${weakestData.totalQ} documented questions).`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.this_is_a_sign_that_there_is_too_little_data_in_the_period_repor");
      aggregateContinuity = { questionClass: qc, subjectId: weakestData.sid, role: "least_data" };
    }
  } else if (qc === "improved") {
    const es = payload?.executiveSummary && typeof payload.executiveSummary === "object" ? payload.executiveSummary : {};
    const trends = normalizeExecutiveTrendLinesHe(es.majorTrendsHe);
    const improvementLines = trends.filter((t) => /שיפור|התקדמות|עלייה|התחזק|משתפר/.test(t));
    if (improvementLines.length) {
      obs = `Signs of improvement that appear in the wording of the summary for the period: ${improvementLines.slice(0, 3).join(" · ")}.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.this_is_an_answer_based_on_the_summary_lines_in_the_report_only_");
      aggregateContinuity = { questionClass: qc, subjectId: "", role: "improved" };
    } else {
      const uImp = norm(utterance).toLowerCase();
      const mathRow = roll.find((r) => r.sid === "math");
      if (/מתמטיקה|חשבון/.test(uImp) && mathRow && mathRow.avg != null && mathRow.totalQ > 0) {
        obs = `${lead}in mathematics, about ${mathRow.totalQ} questions were counted in the range, with an average accuracy of about ${mathRow.avg}% according to the report.`;
        meaning =
          "An explicit sign of improvement does not always appear as a separate line in the report - it is still possible to anchor the volume and accuracy in the subject from the data that is presented.";
      } else {
        obs = `${lead}In the current report there is no explicit summary line that indicates improvement over time.`;
        meaning = "To answer \"what has improved\" more clearly, you need either explicit summary lines in a period or a comparison of periods.";
      }
    }
  } else if (qc === "needs_attention") {
    const atRisk = [...roll].sort((a, b) => {
      const aRisk = (a.avg == null ? 1 : 0) * 100 + (a.avg == null ? 0 : 100 - a.avg) + a.lowConfidenceTopics * 8 + a.insufficientTopics * 8;
      const bRisk = (b.avg == null ? 1 : 0) * 100 + (b.avg == null ? 0 : 100 - b.avg) + b.lowConfidenceTopics * 8 + b.insufficientTopics * 8;
      return bRisk - aRisk || a.totalQ - b.totalQ;
    })[0];
    if (!atRisk) {
      obs = `${lead}There is currently insufficient data in the report to identify a clear focus of attention.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.when_complete_practice_data_by_subject_appears_in_the_report_it_");
    } else {
      obs = `The focus that currently requires the most reinforcement is ${atRisk.label}.`;
      meaning =
        atRisk.avg == null
          ? "The main reason is that there is too little data in this subject in the current period."
          : `The rating is based on a combination of average accuracy (about ${atRisk.avg}%) along with signs of instability in the report.`;
      aggregateContinuity = { questionClass: qc, subjectId: atRisk.sid, role: "needs_attention" };
    }
  } else if (qc === "still_unclear") {
    const unclear = roll.filter((r) => r.cannotConcludeTopics > 0 || r.lowConfidenceTopics > 0 || r.insufficientTopics > 0);
    if (!unclear.length) {
      obs = `${lead}There is currently no strong indication in the report that an entire subject is still uncertain.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.it_is_still_correct_to_continue_practicing_and_testing_but_there");
    } else {
      const names = unclear.map((r) => r.label).join(" · ");
      obs = `${lead}still not clear enough mainly in: ${names}.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.the_identification_is_based_on_signs_of_doubt_regarding_the_word");
    }
  } else if (qc === "most_stable") {
    if (roll.length < 2) {
      obs = `${lead}The report currently shows only one subject, so it is impossible to compare stability between subjects.`;
      meaning = "It is still possible to describe the situation in the single subject, but not to determine who is \"the most stable\" in comparison.";
    } else {
      const stable = mostStableSubject(roll);
      if (!stable || stable.totalQ <= 0) {
        obs = `${lead}There is currently not enough practice in some subjects to determine who is the most stable.`;
        meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.more_questions_and_a_wider_practice_sequence_are_needed_to_relia");
      } else {
        obs = `The most stable subject at the moment according to the period data in the report is ${stable.label}.`;
        meaning = `The assessment is based on a combination of the amount of practice, performance stability, readiness and maturity according to the report, not on a single subject line.`;
        aggregateContinuity = { questionClass: qc, subjectId: stable.sid, role: "most_stable" };
      }
    }
  } else {
    if (withAvg.length === 1 && (qc === "strongest_subject" || qc === "weakest_subject" || qc === "hardest_subject")) {
      const only = withAvg[0];
      const pct =
        only.avg == null
          ? "Still without a stable accuracy average that can be trusted reliably"
          : `with an average accuracy of about ${only.avg}%`;
      obs = `There is currently mainly one subject with enough numerical practice in the report - ${only.label}, ${pct}.`;
      if (qc === "strongest_subject") {
        meaning =
          "When there is one subject with data, \"strongest\" simply describes what actually appears in that subject, without comparison to others. In order to rank between subjects, at least two subjects with practice must appear in the report.";
        aggregateContinuity = { questionClass: qc, subjectId: only.sid, role: "strongest" };
      } else if (qc === "weakest_subject") {
        meaning =
          "When there is one subject with data, \"the weakest\" does not mean a comparison between subjects - only the bar in the only subject that appears. A real comparison requires two or more subjects with practice.";
        aggregateContinuity = { questionClass: qc, subjectId: only.sid, role: "weakest" };
      } else {
        meaning =
          "When there is only one subject with data, \"hardest\" refers to the situation within that subject from the report, not who is more comfortable compared to another subject.";
        aggregateContinuity = { questionClass: qc, subjectId: only.sid, role: "hardest" };
      }
    } else if (withAvg.length < 2) {
      obs = `${lead}The report currently does not have enough numerical practice on at least two different subjects, so subjects are not ranked here against each other.`;
      meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.when_data_appears_for_two_or_more_subjects_you_can_ask_again_and");
    } else {
      const sortedStrength = [...withAvg].sort((a, b) => (b.avg || 0) - (a.avg || 0) || b.totalQ - a.totalQ);
      const sortedWeak = [...withAvg].sort((a, b) => (a.avg || 0) - (b.avg || 0) || a.totalQ - b.totalQ);
      const strongest = sortedStrength[0];
      const weakest = sortedWeak[0];
      if (qc === "strongest_subject") {
        obs = `The strongest subject at the moment is ${strongest.label} - according to the average overall accuracy across subjects with practice in the report (about ${strongest.avg}%).`;
        meaning = `The index reflects an average over all subject lines with practice under ${strongest.label}, not a formulation of a single subject.`;
        aggregateContinuity = { questionClass: qc, subjectId: strongest.sid, role: "strongest" };
      } else if (qc === "weakest_subject") {
        obs = `The lowest subject right now is ${weakest.label} - by the same overall accuracy average across subjects with practice (about ${weakest.avg}%).`;
        meaning = copilotStaticMessage("copilot.answers.utils_parent-copilot_semantic-aggregate-answers.this_is_a_subject_level_description_from_the_report_for_exact_de");
        aggregateContinuity = { questionClass: qc, subjectId: weakest.sid, role: "weakest" };
      } else {
        obs = `The subject where the most "difficult" at the moment in terms of results is ${weakest.label} - according to the average overall accuracy in the report (about ${weakest.avg}%).`;
        meaning = "Here \"hard\" is translated according to the average accuracy in subjects with practice in the report, not according to impression without data.";
        aggregateContinuity = { questionClass: qc, subjectId: weakest.sid, role: "hardest" };
      }
    }
  }

  const directOpenQ = new Set([
    "strongest_subject",
    "weakest_subject",
    "hardest_subject",
    "period_highlight",
    "comparison",
    "most_practice",
    "least_data",
    "improved",
    "needs_attention",
    "most_stable",
  ]);
  const uncSlot = String(truthPacket.contracts?.narrative?.textSlots?.uncertainty || "").trim();
  let cautionHe = "";
  let cautionSource = /** @type {"composed"|"contract_slot"} */ ("composed");
  if (directOpenQ.has(qc) && uncSlot.length >= 12) {
    cautionHe = norm(uncSlot.length <= 420 ? uncSlot : `${uncSlot.slice(0, 400)}…`);
    cautionSource = uncSlot.length <= 420 ? "contract_slot" : "composed";
  }

  if (directOpenQ.has(qc)) {
    ({ obs, meaning } = ensureRequiredHedgesTrailing(truthPacket, obs, meaning));
  } else {
    ({ obs, meaning } = ensureRequiredHedges(truthPacket, obs, meaning));
  }
  obs = norm(obs);
  meaning = norm(meaning);
  if (obs.length < 8 || meaning.length < 8) return null;
  if (!passesEnvelope(truthPacket, obs, meaning, cautionHe)) return null;

  /** @type {Array<{ type: string; answerText: string; source: "composed"|"contract_slot" }>} */
  const answerBlocks = [
    { type: "observation", answerText: obs, source: "composed" },
    { type: "meaning", answerText: meaning, source: "composed" },
  ];
  if (cautionHe) {
    answerBlocks.push({ type: "caution", answerText: cautionHe, source: cautionSource });
  }

  return {
    answerBlocks,
    aggregateContinuity,
  };
}

export default { buildSemanticAggregateDraft };
