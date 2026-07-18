/**
 * Parent-facing wording layer only — detailed report (display only).
 * Short, sharp, no sub-layers — does not change engine payload fields.
 */

import { globalBurnDownCopy } from "../lib/i18n/global-burn-down-copy.js";
import { pickVariant } from "./parent-report-language/variants.js";
import {
  normalizeParentFacingHe,
  normalizeSubjectParentLetterHe,
} from "./parent-report-language/parent-facing-normalize.js";
import { parentFacingWeaknessPracticePhraseEn as parentFacingWeaknessPracticePhraseHe } from "./diagnostic-labels.js";
import {
  buildNarrativeContractV1,
  narrativeSectionTextHe,
} from "./contracts/narrative-contract-v1.js";
import {
  findClearWeakTopicInSubject,
  isClearWeakSubjectVolume,
  subjectClearWeakClosingHe,
  subjectClearWeakOpeningHe,
} from "./learning-pattern-decision/subject-clear-weak-topic.js";
import {
  buildSubjectEngineSummaryOpeningHe,
  findStrongestEngineDecisionInSubject,
} from "./learning-pattern-decision/build-parent-report-engine-decision-contract.js";
import { findTopicRecommendationForPriority } from "./learning-pattern-decision/build-subject-engine-decision-contract.js";
import { resolveSubjectLetterOwnerCopyHe } from "./learning-pattern-decision/resolve-subject-owner-copy.js";
import { resolveNarrativeOwnerCopyHe } from "./learning-pattern-decision/resolve-topic-owner-copy.js";
import { SUBJECT_OWNER_COPY_TEMPLATE_IDS } from "./parent-report-language/parent-report-owner-copy-templates-he.js";
import {
  RENDER_SOURCE_SUBJECT_ENGINE,
  SP_SUBJECT_ENGINE_CONTRACT,
  readSubjectEngineContract,
} from "./learning-pattern-decision/engine-decision-codes.js";
import {
  gradeContextActionHe,
  gradeContextExplanationHe,
  gradeContextIsStrength,
  gradeContextNeedsSupport,
  suppressRegisteredGradeStrengthenCopy,
} from "./parent-report-language/grade-context-parent-he.js";

/** Strip French quotation marks / guillemets */
export function stripGuillemetsHe(s) {
  return String(s || "")
    .replace(/[\u00AB\u00BB«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTechnicalNoiseHe(text) {
  return String(text || "")
    .replace(/\(pf:[^)]*\)/gi, "")
    .replace(/\(k:[^)]*\)/gi, "")
    .replace(/\(to:[^)]*\)/gi, "")
    .replace(/\(st:[^)]*\)/gi, "")
    .replace(/\(ct:[^)]*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function displayTopicCoreHe(labelHe) {
  let t = stripGuillemetsHe(stripTechnicalNoiseHe(labelHe));
  t = t.replace(/^(on the topic of|the topic of|about|on)\s+/iu, "").trim();
  return t;
}

/**
 * Consistent phrasing: "on addition" or "on areas and surface units" (when there is a space in the name).
 */
export function displayTopicPhraseHe(labelHe) {
  const core = displayTopicCoreHe(labelHe);
  if (!core) return "";
  return `on ${core}`;
}

/** Rewrites and removes "settings / game / grade" wording into clear parent-facing language */
export function rewriteParentRecommendationForDetailedHe(raw) {
  let s = stripGuillemetsHe(String(raw || ""));
  if (!s) return "";
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/^On ([^,]+), (?:after what was collected in the(?: selected)? period|based on the practice collected in the selected period):\s*/iu, "In $1: ");
  s = s.replace(/in the game/gi, "in practice");
  s = s.replace(/if the game allows choosing a grade by topic -/gi, "if the difficulty level can be split by topic -");
  s = s.replace(/if a separate grade can be chosen by topic -/gi, "if a separate difficulty level can be set by topic -");
  s = s.replace(
    /if a separate difficulty level can be set by topic - in (.+?) one grade lower is recommended\. no need to change the other topics\./iu,
    "in $1 it's recommended to try a lower level or grade and then progress gradually."
  );
  s = s.replace(
    /staying at the same setting in (?:«|")?([^»"]+)(?:»|")?\s*\([^)]*\)/giu,
    "in $1 it's recommended to continue at the current difficulty level for now"
  );
  s = s.replace(/staying at the same grade and level/gi, "continue at the same difficulty level");
  s = s.replace(/give the child/gi, "help the child");
  s = s.replace(/and build small successes/gi, "and build up the topic gradually with the child");
  s = s.replace(/staying at level [^ ]+ and focusing/gi, "it's best to stay at the same difficulty level and focus");
  s = s.replace(/2–3 short sessions/gi, "two to three short practice sessions");
  s = s.replace(/short sessions/gi, "short practice sessions");
  s = s.replace(/short practice meetings/gi, "short practice sessions");
  s = s.replace(/it's recommended to raise the difficulty one level only on this topic in practice/gi, "it's recommended to raise the level only on this topic");
  s = s.replace(/it's recommended to raise the difficulty one level only on this topic in the game/gi, "it's recommended to raise the level only on this topic in practice");
  s = s.replace(/it's recommended to make it slightly harder only on this topic/gi, "it's recommended to raise the level only on this topic");
  s = s.replace(/only on this topic in the game/gi, "only on this topic in practice");
  s = s.replace(
    /it's worth practicing a bit more (?:«|")?([^»"]+)(?:»|")? at the same level - and then decide the next step\./giu,
    "it's recommended to continue with short practice on $1 at the same difficulty level, and delay a change until there's consistency."
  );
  s = s.replace(/\s+/g, " ").trim();
  return stripGuillemetsHe(s);
}

function takeFirstSentence(text) {
  const t = String(text || "").trim();
  if (!t) return "";
  const cut = t.split(/(?<=[.!?])\s+/)[0];
  return cut && cut.length <= 200 ? cut : t.slice(0, 160).trim() + (t.length > 160 ? "…" : "");
}

function dedupeRowsByLabel(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows || []) {
    const k = String(r?.labelHe || "").trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}

function topicDataSparse(sp) {
  const recs = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
  if (!recs.length) return false;
  return recs.every((t) => t?.isEarlySignalOnly);
}

function majorRiskAny(sp) {
  const r = sp?.majorRiskFlagsAcrossRows;
  if (!r || typeof r !== "object") return false;
  return Object.values(r).some(Boolean);
}

/** One opening sentence */
function buildSubjectOpeningLineHe(sp, lab) {
  const contract = readSubjectEngineContract(sp);
  if (contract?.blockedLegacySummary) {
    const ownerOpening = resolveSubjectLetterOwnerCopyHe(
      contract,
      String(contract.summarySlots?.openingTemplateId || SUBJECT_OWNER_COPY_TEMPLATE_IDS.OPENING),
      lab,
    );
    if (ownerOpening) return stripGuillemetsHe(ownerOpening);
  }

  if (contract?.blockedLegacySummary && contract.priorityTopics?.length) {
    const finding = String(contract.priorityTopics[0].parentSafeFinding || "").trim();
    if (finding) {
      return stripGuillemetsHe(
        buildSubjectEngineSummaryOpeningHe(lab, { contract: contract.priorityTopics[0] }),
      );
    }
  }

  const engineStrongest = findStrongestEngineDecisionInSubject(sp);
  const engineOpening = buildSubjectEngineSummaryOpeningHe(lab, engineStrongest);
  if (engineOpening) {
    return stripGuillemetsHe(engineOpening);
  }

  if (contract?.blockedLegacySummary) {
    return "";
  }

  const clearWeak = findClearWeakTopicInSubject(sp);
  if (clearWeak) {
    const topicCore = displayTopicCoreHe(clearWeak.label) || clearWeak.label;
    return stripGuillemetsHe(subjectClearWeakOpeningHe(lab, topicCore));
  }

  const w0 = sp?.topWeaknesses?.[0];
  const ex0 = sp?.excellence?.[0] || sp?.topStrengths?.[0];
  const imp0 = sp?.improving?.[0];
  const sparse = topicDataSparse(sp);
  const domRisk = String(sp?.dominantLearningRiskLabelHe || "").trim();
  const domSucc = String(sp?.dominantSuccessPatternLabelHe || "").trim();
  const mr = majorRiskAny(sp);
  const readiness = String(sp?.subjectConclusionReadiness || "").trim();
  const domRc = String(sp?.dominantRootCauseLabelHe || "").trim();
  const pri = String(sp?.subjectPriorityLevel || "").trim();
  const priReason = String(sp?.subjectPriorityReasonHe || "").trim();

  if (pri === "immediate" && priReason) {
    const t = [
      stripGuillemetsHe(`${priReason} It helps to pick one task this week and stick with it.`),
      stripGuillemetsHe(`${priReason} A small, repeated step is better than trying to "fix everything at once."`),
    ];
    return t[Math.abs(priReason.length + lab.length) % t.length];
  }
  if (pri === "monitor" && priReason) {
    const t = [
      stripGuillemetsHe(`${priReason} At this stage it's best to avoid big decisions at home.`),
      stripGuillemetsHe(`${priReason} It helps to continue with short practice before settling on a clear direction.`),
    ];
    return t[Math.abs((priReason + lab).length) % t.length];
  }
  if (pri === "maintain" && domSucc && ex0 && !mr) {
    const t = [
      stripGuillemetsHe(`In ${lab} you can ease off a bit: ${domSucc} - a short practice routine is enough.`),
      stripGuillemetsHe(`In ${lab} the picture is relatively consistent (${domSucc}) - no need to add load; light monitoring is enough.`),
    ];
    return t[Math.abs((domSucc + lab).length) % t.length];
  }

  if (readiness === "not_ready" && domRc) {
    if (w0 && isClearWeakSubjectVolume(w0.questions, w0.accuracy)) {
      const coreW = displayTopicCoreHe(w0.labelHe) || displayTopicPhraseHe(w0.labelHe);
      return stripGuillemetsHe(
        `In ${lab} a clear point to reinforce shows up ${displayTopicPhraseHe(w0.labelHe) || coreW} - it's worth strengthening the topic with short practice.`,
      );
    }
    const templates = [
      `In ${lab} it's still early to know clearly what's happening from the practice - what does stand out: ${domRc}. It helps to continue with short practice before a major change.`,
      `In ${lab} the information collected in the selected period is still partial; the most likely direction right now is ${domRc} - without locking in a long plan.`,
    ];
    return stripGuillemetsHe(templates[Math.abs((lab + domRc).length) % templates.length]);
  }
  if (readiness === "partial" && domRc && w0) {
    return stripGuillemetsHe(
      `In ${lab} there's a mixed picture: ${domRc} alongside ${displayTopicPhraseHe(w0.labelHe)} - it helps to keep watching without concluding yet.`
    );
  }

  if (domSucc && sp?.dominantSuccessPattern === "stable_mastery" && ex0 && !mr) {
    return stripGuillemetsHe(
      `In ${lab} there's good consistency (${domSucc}) ${displayTopicPhraseHe(ex0.labelHe)} - it's worth keeping a calm pace.`
    );
  }
  if (mr && ex0) {
    const acc = Math.round(Number(ex0.accuracy) || 0);
    return stripGuillemetsHe(
      `In ${lab} there are also areas with relatively good results (for example ${displayTopicPhraseHe(ex0.labelHe)}, about ${acc}%) as well as points worth watching - the whole topic isn't marked as stable yet.`
    );
  }
  if (domRisk && domRisk !== globalBurnDownCopy("utils__detailed-report-parent-letter-he", "sparse_data") && w0) {
    const pre = sparse ? "It's still early to conclude for sure, but " : "";
    return stripGuillemetsHe(
      `${pre}In ${lab} the main picture relates to ${domRisk} alongside ${displayTopicPhraseHe(w0.labelHe)}.`
    );
  }

  if (!w0 && !ex0 && !imp0 && sp.summaryHe && String(sp.summaryHe).trim()) {
    return (
      takeFirstSentence(rewriteParentRecommendationForDetailedHe(sp.summaryHe)) ||
      takeFirstSentence(stripGuillemetsHe(sp.summaryHe))
    );
  }
  if (w0) {
    const coreW = displayTopicCoreHe(w0.labelHe) || displayTopicPhraseHe(w0.labelHe);
    const pre = sparse ? "It's still early to be certain, but " : "";
    return stripGuillemetsHe(`${pre}The topic that stands out right now in ${lab} is ${coreW}.`);
  }
  if (ex0) {
    const acc = Math.round(Number(ex0.accuracy) || 0);
    return stripGuillemetsHe(`In ${lab} there's a good handle ${displayTopicPhraseHe(ex0.labelHe)} (accuracy about ${acc}%).`);
  }
  if (imp0) {
    const acc = Math.round(Number(imp0.accuracy) || 0);
    const pre = sparse ? "It looks like " : "";
    return stripGuillemetsHe(`${pre}In ${lab} there's partial progress ${displayTopicPhraseHe(imp0.labelHe)} (accuracy about ${acc}%).`);
  }
  return stripGuillemetsHe(`It's still early to summarize ${lab} - little information in the selected period.`);
}

/** One diagnosis sentence — merges strength/weakness without separate blocks */
function buildSubjectDiagnosisLineHe(sp, lab) {
  const contract = readSubjectEngineContract(sp);
  if (contract?.blockedLegacySummary) {
    const diagnosisTemplateId = String(
      contract.summarySlots?.diagnosisTemplateId ||
        (contract.priorityTopics?.length > 1
          ? SUBJECT_OWNER_COPY_TEMPLATE_IDS.DIAGNOSIS_1
          : SUBJECT_OWNER_COPY_TEMPLATE_IDS.DIAGNOSIS_0),
    ).trim();
    const ownerDiagnosis = resolveSubjectLetterOwnerCopyHe(contract, diagnosisTemplateId, lab);
    if (ownerDiagnosis) return stripGuillemetsHe(ownerDiagnosis);
    return "";
  }

  const w0 = sp?.topWeaknesses?.[0];
  const domRc = String(sp?.dominantRootCauseLabelHe || "").trim();
  const restraintLine = String(sp?.subjectDiagnosticRestraintHe || "").trim();
  if (domRc && restraintLine) {
    const variants = [
      stripGuillemetsHe(`What stands out right now: ${domRc}. ${restraintLine}`),
      stripGuillemetsHe(`A careful look at ${lab}: ${domRc}. ${restraintLine}`),
    ];
    return variants[Math.abs(restraintLine.length) % variants.length];
  }
  const pool = dedupeRowsByLabel([
    ...(Array.isArray(sp.excellence) ? sp.excellence : []),
    ...(Array.isArray(sp.topStrengths) ? sp.topStrengths : []),
    ...(Array.isArray(sp.maintain) ? sp.maintain : []),
  ]);
  const s0 = pool[0];
  const imp0 = sp?.improving?.[0];
  const trendLine = takeFirstSentence(String(sp?.trendNarrativeHe || "").trim());
  const domRisk = String(sp?.dominantLearningRiskLabelHe || "").trim();
  const ibs = String(sp?.improvingButSupportedHe || "").trim();

  if (ibs) {
    return stripGuillemetsHe(ibs);
  }

  if (trendLine && domRisk && domRisk !== globalBurnDownCopy("utils__detailed-report-parent-letter-he", "sparse_data")) {
    const base = stripGuillemetsHe(`${domRisk} - ${trendLine}`);
    if (w0 && s0) {
      return stripGuillemetsHe(
        `${base} Based on the practice collected in the selected period: ${displayTopicPhraseHe(s0.labelHe)} there's a good base; on the other hand ${displayTopicPhraseHe(w0.labelHe)} could use focused reinforcement.`
      );
    }
    if (w0) {
      const hint = parentFacingWeaknessPracticePhraseHe(w0.labelHe);
      const tail = hint
        ? ` It's worth practicing ${hint} again with a few short questions.`
        : " It's worth practicing this again with a few short questions.";
      return stripGuillemetsHe(`${base}${tail}`);
    }
    return base.length > 280 ? `${base.slice(0, 277)}…` : base;
  }

  if (w0 && s0) {
    const strong = (Number(w0.mistakeCount) || 0) >= 8;
    const tail = strong
      ? "Worth reinforcing; the pattern repeats consistently."
      : "Worth reinforcing - and it helps to keep watching without rushing to a final direction.";
    return stripGuillemetsHe(
      `Based on the practice collected in the selected period: ${displayTopicPhraseHe(s0.labelHe)} there's a good base; on the other hand ${displayTopicPhraseHe(w0.labelHe)} ${tail}`
    );
  }
  if (w0) {
    const ws =
      (Number(w0.mistakeCount) || 0) >= 8
        ? "a consistent repeat - worth emphasizing"
        : "still not clear if this is a long-term pattern";
    return stripGuillemetsHe(`The practical focus right now: ${displayTopicPhraseHe(w0.labelHe)} - ${ws}.`);
  }
  if (s0) {
    return stripGuillemetsHe(`The strong direction: ${displayTopicPhraseHe(s0.labelHe)} - worth maintaining with short practice until the direction becomes clearer.`);
  }
  if (imp0 && !w0) {
    return stripGuillemetsHe(`There's movement ${displayTopicPhraseHe(imp0.labelHe)} - it helps to continue with short practice without jumping a level too fast.`);
  }
  return stripGuillemetsHe("The picture is still partial - a bit more practice will clarify the direction.");
}

function buildSubjectHomeLineHe(sp, lab) {
  const contract = readSubjectEngineContract(sp);
  if (contract?.blockedLegacySummary) {
    const homeTemplateId = String(
      contract.summarySlots?.homeActionTemplateId || SUBJECT_OWNER_COPY_TEMPLATE_IDS.HOME_ACTION,
    ).trim();
    const ownerHome = resolveSubjectLetterOwnerCopyHe(contract, homeTemplateId, lab);
    if (ownerHome) return stripGuillemetsHe(ownerHome);
  }

  if (contract?.blockedLegacySummary && contract.priorityTopics?.[0]) {
    const tr = findTopicRecommendationForPriority(sp, contract.priorityTopics[0].topicKey);
    if (tr?.recommendedNextStep) {
      return stripGuillemetsHe(rewriteParentRecommendationForDetailedHe(String(tr.recommendedNextStep)));
    }
    if (tr?.doNowHe) {
      return stripGuillemetsHe(rewriteParentRecommendationForDetailedHe(String(tr.doNowHe)));
    }
    if (tr?.recommendedStepLabelHe) {
      return stripGuillemetsHe(rewriteParentRecommendationForDetailedHe(String(tr.recommendedStepLabelHe)));
    }
  }

  // Same legacy-blocking guard as buildSubjectDiagnosisLineHe/buildSubjectClosingLineHe:
  // once the engine contract has blocked the legacy summary, an unmatched home-action
  // template must render empty — never fall through to the engine-unaware legacy fields
  // below (sp.recommendedHomeMethodHe / subjectImmediateActionHe / parentActionHe), which
  // have no awareness of decisions like speed_check_only_subject and could reintroduce a
  // knowledge-gap-flavored recommendation for a topic that was only flagged for speed.
  if (contract?.blockedLegacySummary) return "";

  const homeDiag = sp?.recommendedHomeMethodHe && String(sp.recommendedHomeMethodHe).trim();
  if (homeDiag) return stripGuillemetsHe(rewriteParentRecommendationForDetailedHe(homeDiag));
  const imm = sp?.subjectImmediateActionHe && String(sp.subjectImmediateActionHe).trim();
  if (imm) return stripGuillemetsHe(rewriteParentRecommendationForDetailedHe(imm));
  const raw = sp?.parentActionHe && String(sp.parentActionHe).trim();
  if (raw) return rewriteParentRecommendationForDetailedHe(raw);
  return stripGuillemetsHe(`In ${lab}: short practice twice a week, with emphasis on reading the question before answering.`);
}

function buildSubjectClosingLineHe(sp, lab) {
  const contract = readSubjectEngineContract(sp);
  if (contract?.blockedLegacySummary) {
    const closingTemplateId = String(
      contract.summarySlots?.closingTemplateId || SUBJECT_OWNER_COPY_TEMPLATE_IDS.CLOSING,
    ).trim();
    const ownerClosing = resolveSubjectLetterOwnerCopyHe(contract, closingTemplateId, lab);
    if (ownerClosing) return stripGuillemetsHe(ownerClosing);
    return "";
  }

  const conf = String(sp?.confidenceSummaryHe || "").trim();
  const wnt = String(sp?.whatNotToDoHe || "").trim();
  const g = sp?.nextWeekGoalHe && String(sp.nextWeekGoalHe).trim();
  const doNow = String(sp?.subjectDoNowHe || "").trim();
  const avoidNow = String(sp?.subjectAvoidNowHe || "").trim();
  const memN = String(sp?.subjectMemoryNarrativeHe || "").trim();
  const parts = [];
  if (conf) parts.push(takeFirstSentence(conf));
  if (g) {
    let c = takeFirstSentence(rewriteParentRecommendationForDetailedHe(g));
    if (!c) c = takeFirstSentence(stripGuillemetsHe(g));
    if (c && !/[.!?]$/.test(c)) c += ".";
    parts.push(c);
  }
  if (wnt) parts.push(takeFirstSentence(wnt));
  if (doNow) {
    const d1 = takeFirstSentence(doNow);
    const dup =
      parts.some((p) => p.includes(d1.slice(0, Math.min(18, d1.length)))) ||
      (wnt && wnt.includes(d1.slice(0, Math.min(18, d1.length))));
    if (!dup) parts.push(d1);
  }
  if (avoidNow) {
    const a1 = takeFirstSentence(avoidNow);
    const dup =
      parts.some((p) => p.includes(a1.slice(0, Math.min(18, a1.length)))) ||
      (wnt && wnt.includes(a1.slice(0, Math.min(18, a1.length))));
    if (!dup) parts.push(a1);
  }
  if (memN) {
    const m1 = takeFirstSentence(memN);
    const dup = parts.some((p) => p.includes(m1.slice(0, Math.min(16, m1.length))));
    if (!dup && m1.length > 20) parts.push(m1);
  }
  if (parts.length) return stripGuillemetsHe(parts.join(" "));
  return stripGuillemetsHe(`In ${lab} consistency in short practice sessions is better than one long session.`);
}

function collectTopicNarrativeContracts(sp) {
  const list = Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : [];
  return list
    .map((tr) => tr?.contractsV1?.narrative)
    .filter((x) => x && typeof x === "object");
}

function applySubjectNarrativeGuardrails(sp, letter) {
  if (readSubjectEngineContract(sp)?.blockedLegacySummary) {
    return letter;
  }

  const clearWeak = findClearWeakTopicInSubject(sp);
  if (clearWeak) {
    const lab = sp?.subjectLabelHe || "the subject";
    const topicCore = displayTopicCoreHe(clearWeak.label) || clearWeak.label;
    return {
      ...letter,
      opening: stripGuillemetsHe(subjectClearWeakOpeningHe(lab, topicCore)),
      closing: stripGuillemetsHe(subjectClearWeakClosingHe(lab, topicCore)),
    };
  }

  const contracts = collectTopicNarrativeContracts(sp);
  if (!contracts.length) return letter;
  const hasStrictRestraint = contracts.some((c) => String(c.wordingEnvelope) === "WE0" || String(c.wordingEnvelope) === "WE1");
  if (!hasStrictRestraint) return letter;
  const lab = sp?.subjectLabelHe || "the subject";
  return {
    ...letter,
    opening: `In ${lab} there isn't yet a clear enough picture. It helps to continue with short practice and check again after a few more sessions.`,
    diagnosisHe: letter.diagnosisHe,
    homeAction: letter.homeAction || `In ${lab} it's recommended to focus on one short step and not add extra load.`,
    closing: `It's still early to know if the direction is stable in ${lab}; we'll keep watching in the coming weeks and update accordingly.`,
  };
}

/** @param {Record<string, unknown>|null|undefined} topic */
function topicLetterSlotFromPriorityTopic(topic) {
  if (!topic || typeof topic !== "object") return null;
  const raw = String(topic.topicLabelKey || topic.displayName || topic.topicName || "").trim();
  const core = displayTopicCoreHe(raw) || raw.replace(/^[^-]+-\s*/, "").trim();
  if (!core) return null;
  const patternRaw = topic.detectedPattern ? String(topic.detectedPattern).trim() : "";
  return {
    topic: core,
    questions: Number(topic.questions) || 0,
    accuracy: Math.round(Number(topic.accuracy) || 0),
    pattern: patternRaw || null,
  };
}

/** @param {Record<string, unknown>|null|undefined} sp */
function collectSubjectLetterTopicSlots(sp) {
  const contract = readSubjectEngineContract(sp);
  if (contract?.priorityTopics?.length) {
    return contract.priorityTopics
      .map((t) => topicLetterSlotFromPriorityTopic(t))
      .filter(Boolean);
  }

  /** @type {{ topic: string, questions: number, accuracy: number, pattern: string|null }[]} */
  const out = [];
  const seen = new Set();
  const pushRow = (row) => {
    if (!row?.topic || seen.has(row.topic)) return;
    seen.add(row.topic);
    out.push(row);
  };

  for (const tr of Array.isArray(sp?.topicRecommendations) ? sp.topicRecommendations : []) {
    const name = String(tr?.narrativeTitleHe || tr?.displayName || "").trim();
    const q = Number(tr?.questions) || 0;
    if (!name || q <= 0) continue;
    const pattern =
      tr?.detectedPattern != null
        ? String(tr.detectedPattern).trim()
        : tr?.taxonomy?.patternHe
          ? String(tr.taxonomy.patternHe).trim()
          : null;
    pushRow({
      topic: displayTopicCoreHe(name) || name.replace(/^[^-]+-\s*/, "").trim(),
      questions: q,
      accuracy: Math.round(Number(tr?.accuracy) || 0),
      pattern: pattern || null,
    });
  }

  for (const w of Array.isArray(sp?.topWeaknesses) ? sp.topWeaknesses : []) {
    const name = String(w?.labelHe || w?.displayName || "").trim();
    const q = Number(w?.questions) || 0;
    if (!name || q <= 0) continue;
    pushRow({
      topic: displayTopicCoreHe(name) || name.replace(/^[^-]+-\s*/, "").trim(),
      questions: q,
      accuracy: Math.round(Number(w?.accuracy) || 0),
      pattern: null,
    });
  }

  return out;
}

/**
 * Short subject letter — implementation phase 1 (detailed report only, display).
 * @param {Record<string, unknown>|null|undefined} sp
 */
export function buildSubjectParentLetterDetailedPhase1(sp) {
  const lab = String(sp?.subjectLabelHe || "the subject").trim();
  const subjQ = Number(sp?.subjectQuestionCount) || 0;
  const emptyTail = { diagnosisHe: "", homeAction: "", closing: "", goingWell: "", fragile: "", reliabilityNoteHe: null };

  if (subjQ < 5) {
    return {
      ...emptyTail,
      opening: `There's little practice in ${lab} this period, so a broad conclusion isn't possible yet. It helps to continue with short practice and check if the direction holds after more questions.`,
    };
  }

  const slots = collectSubjectLetterTopicSlots(sp);
  if (!slots.length) {
    return {
      ...emptyTail,
      opening: `There's practice in ${lab}, but not yet enough detail by topic to show a precise conclusion. It helps to continue with short practice, and in the next report it will be easier to see what repeats.`,
    };
  }

  if (slots.length >= 2) {
    const t0 = slots[0];
    const t1 = slots[1];
    let opening = `In ${lab} it's worth focusing first on ${t0.topic}. ${t0.questions} questions were solved, with ${t0.accuracy}% accuracy.`;
    opening += ` Another topic worth watching is ${t1.topic}, with ${t1.questions} questions and ${t1.accuracy}% accuracy.`;
    if (t0.pattern) opening += ` The main pattern seen: ${t0.pattern}.`;
    return { ...emptyTail, opening };
  }

  const t0 = slots[0];
  let opening = `In ${lab} it's worth focusing right now on ${t0.topic}. ${t0.questions} questions were solved, with ${t0.accuracy}% accuracy.`;
  if (t0.pattern) opening += ` The main pattern seen: ${t0.pattern}.`;
  return { ...emptyTail, opening };
}

export function buildSubjectParentLetterCompact(sp) {
  const full = buildSubjectParentLetter(sp, { compact: true });
  const lead = [full.opening, full.diagnosisHe].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  const leadMax = lead.length > 240 ? `${lead.slice(0, 237)}…` : lead;
  return {
    opening: leadMax,
    middle: null,
    homeAction: full.homeAction,
    closing: full.closing,
  };
}

export function buildSubjectParentLetter(sp, opts = {}) {
  const compact = !!opts.compact;
  const lab = sp.subjectLabelHe || "the subject";
  const opening = buildSubjectOpeningLineHe(sp, lab);
  let diagnosisHe = buildSubjectDiagnosisLineHe(sp, lab);
  if (compact && diagnosisHe.length > 200) {
    diagnosisHe = `${diagnosisHe.slice(0, 197)}…`;
  }
  const homeAction = buildSubjectHomeLineHe(sp, lab);
  const closing = buildSubjectClosingLineHe(sp, lab);

  const base = {
    opening: normalizeParentFacingHe(stripGuillemetsHe(opening)),
    diagnosisHe: normalizeParentFacingHe(stripGuillemetsHe(diagnosisHe)),
    homeAction: normalizeParentFacingHe(String(homeAction || "")),
    closing: normalizeParentFacingHe(stripGuillemetsHe(closing)),
    /** backward compatibility — empty */
    goingWell: "",
    fragile: "",
    reliabilityNoteHe: null,
  };
  const contract = readSubjectEngineContract(sp);
  if (contract && typeof contract === "object") {
    base[SP_SUBJECT_ENGINE_CONTRACT] = contract;
    base.renderSource = contract.summarySlots?.renderSource || RENDER_SOURCE_SUBJECT_ENGINE;
    base.summarySlots = contract.summarySlots || null;
  }
  return normalizeSubjectParentLetterHe(applySubjectNarrativeGuardrails(sp, base));
}

export function buildTopicRecommendationNarrative(tr) {
  const gradeRelation = String(tr?.gradeRelation || tr?.rowIdentityV1?.gradeRelation || "").trim();
  const hasCanonicalNarrative = !!(tr?.contractsV1?.narrative && typeof tr.contractsV1.narrative === "object");
  const canonicalNarrative = hasCanonicalNarrative
    ? tr.contractsV1.narrative
    : buildNarrativeContractV1({
        ...tr,
        subjectId: tr?.subjectId,
        topicKey: tr?.topicKey || tr?.topicRowKey,
      });
  const summarySlot = narrativeSectionTextHe("summary", canonicalNarrative);
  const findingSlot = narrativeSectionTextHe("finding", canonicalNarrative);
  const recommendationSlot = narrativeSectionTextHe("recommendation", canonicalNarrative);
  const limitationsSlot = narrativeSectionTextHe("limitations", canonicalNarrative);
  const nameRaw = String(tr?.displayName || "this topic").trim();
  const core = displayTopicCoreHe(nameRaw) || stripGuillemetsHe(nameRaw);
  const q = Number(tr?.questions) || 0;
  const acc = Math.round(Number(tr?.accuracy) || 0);
  const m = Number(tr?.mistakeEventCount) || 0;
  const step = String(tr?.recommendedNextStep || "").trim();
  const statsLine =
    q > 0
      ? `There were ${q} questions, with about ${acc}% accuracy${m > 0 ? ` and ${m} cumulative mistakes` : ""}.`
      : "In the selected period there still aren't enough questions to see a clear trend.";
  let snap = q > 0 ? `In ${core} ${statsLine}` : `In ${core} ${statsLine}`;
  if (q > 0 && !suppressRegisteredGradeStrengthenCopy(gradeRelation)) {
    const stepOpeners =
      step === "remediate_same_level"
        ? [
            `In ${core} the picture points to a need for reinforcement: ${statsLine}`,
            `In ${core} it's currently better to pause for focused reinforcement: ${statsLine}`,
          ]
        : [
            `In ${core} the current direction is more cautious: ${statsLine}`,
            `In ${core} at this stage it's worth gathering more short practice before a broad decision: ${statsLine}`,
          ];
    snap = stepOpeners[Math.abs(q + m + core.length) % stepOpeners.length];
  }
  const early = !!tr?.isEarlySignalOnly || tr?.dataSufficiencyLevel === "low" || tr?.evidenceStrength === "low";
  if (early && q > 0 && q < 12) {
    snap = `In ${core} the picture is still at an early stage: ${statsLine}`;
  }
  const cs = String(tr?.conclusionStrength || "").trim();
  const rc = String(tr?.rootCauseLabelHe || "").trim();
  if (cs === "withheld" || cs === "tentative") {
    const alt = [
      `At this stage there's no final conclusion about ${core}. ${statsLine}${rc ? ` The likely direction right now: ${rc}.` : ""}`,
      q >= 20 && acc >= 85
        ? `In ${core} performance looks good throughout the period. ${statsLine} It's still early to set a definitive direction.${rc ? ` What looks reasonable now: ${rc}.` : ""}`
        : `In ${core} the data is still partial. ${statsLine}${rc ? ` What's worth watching right now: ${rc}.` : ""}`,
    ];
    snap = stripGuillemetsHe(pickVariant(`${core}|${q}|${acc}`, alt));
  } else if (rc) {
    snap = stripGuillemetsHe(`${snap} A point worth noting: ${rc}.`);
  }
  if (q === 0 && !rc) {
    const altNoData = [
      `In ${core} there still isn't a basic practice pace to establish a clear direction.`,
      `In ${core} at this stage practice data is still missing, so we keep a careful wording.`,
    ];
    snap = altNoData[Math.abs(core.length) % altNoData.length];
  }
  const reasoning = String(tr?.recommendationReasoningHe || "").trim();
  const homeRaw = tr?.recommendedParentActionHe ? String(tr.recommendedParentActionHe).trim() : "";
  const homeLine = rewriteParentRecommendationForDetailedHe(homeRaw);
  const whyHold = String(tr?.whyNotAStrongerConclusionHe || "").trim();
  const homeAug =
    reasoning && q >= 10
      ? `${homeLine} ${takeFirstSentence(reasoning)}`
      : homeLine;
  const snapshotFromContract = [summarySlot, findingSlot].filter(Boolean).join(" ");
  let homeFromContract = hasCanonicalNarrative ? recommendationSlot || "" : recommendationSlot || homeAug;
  const ownerSnapshot = resolveNarrativeOwnerCopyHe(tr, "snapshot");
  const ownerCaution = resolveNarrativeOwnerCopyHe(tr, "cautionLineHe");
  let snapshotOut = ownerSnapshot || snapshotFromContract || snap;

  if (suppressRegisteredGradeStrengthenCopy(gradeRelation)) {
    const needsSupport = gradeContextNeedsSupport(gradeRelation, acc);
    const isStrength = gradeContextIsStrength(gradeRelation, acc, q);
    const expl = gradeContextExplanationHe({ gradeRelation, isStrength, needsSupport });
    const action = gradeContextActionHe({ gradeRelation, isStrength, needsSupport });
    if (expl) snapshotOut = q > 0 ? `In ${core} ${expl}` : expl;
    if (action) homeFromContract = action;
  }

  const cautionFromContract =
    ownerCaution || limitationsSlot || (whyHold ? stripGuillemetsHe(takeFirstSentence(whyHold)) : "");
  return {
    snapshot: normalizeParentFacingHe(stripGuillemetsHe(snapshotOut)),
    homeLine: normalizeParentFacingHe(stripGuillemetsHe(homeFromContract)),
    cautionLineHe: cautionFromContract ? normalizeParentFacingHe(stripGuillemetsHe(cautionFromContract)) : "",
  };
}

/** Phase 10–11 — short lines for parent-facing wording (mapped from parent-report-ui-explain-he) */
export {
  responseToInterventionLineHe,
  supportAdjustmentLineHe,
  freshnessLineHe,
  recalibrationLineHe,
  supportSequenceLineHe,
  repetitionRiskLineHe,
  fatigueRiskLineHe,
  releaseReadinessLineHe,
  sequenceActionLineHe,
  topicRepetitionFatigueCompactLineHe,
  topicSupportSequenceOrReleaseLineHe,
  recommendationMemoryLineHe,
  outcomeTrackingLineHe,
  continuationDecisionLineHe,
  carryoverLineHe,
  freshEvidenceNeedLineHe,
  gateStateLineHe,
  decisionFocusLineHe,
  evidenceTargetLineHe,
  releaseGateLineHe,
  pivotTriggerLineHe,
  recheckTriggerLineHe,
  gateTriggerCompactLineHe,
  dependencyStateLineHe,
  foundationPriorityLineHe,
  interventionOrderingLineHe,
  foundationBeforeExpansionLineHe,
  downstreamSymptomLineHe,
  topicFreshnessUnifiedLineHe,
  topicGatesEvidenceDecisionCompactLineHe,
  topicFoundationDependencyCompactLineHe,
  topicMemoryOutcomeContinuationCompactLineHe,
  topicSequencingRepeatCompactLineHe,
  topicSupportFlowUnifiedLineHe,
} from "./parent-report-ui-explain-he.js";
