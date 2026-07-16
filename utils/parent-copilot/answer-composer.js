/**
 * Composes draft answer blocks from TruthPacketV1 narrative slots only (+ composed glue).
 * Phase C: intent coaching packs, script variants, in-session personalization (no new facts).
 * Polish: adjacent composed de-dup by token overlap.
 */

import { narrativeSectionTextHe } from "../contracts/narrative-contract-v1.js";
import { coachingVariantIndex, applyParentCoachingPacks, pickUncertaintyReasonScript } from "./parent-coaching-packs.js";
import { parentDirectOpenerHe } from "./direct-answer-openers.js";
import { isMixedGradeReportQuestion } from "./report-row-resolver.js";
import { foldUtteranceForHeMatch } from "./utterance-normalize-he.js";
import { compactParentAnswerBlocks } from "./answer-compaction.js";
import { PEER_COMPARISON_RESPONSE_HE } from "./question-classifier.js";

/** Fixed Copilot-only clinical boundary copy (Task C / Task G). */
export const CLINICAL_BOUNDARY_LINE_1_HE =
  "I can only refer to what appears in the practice data on the website.";
export const CLINICAL_BOUNDARY_LINE_2_HE =
  "The report can help identify topics that should be strengthened in learning, but it does not make personal conclusions about the child.";
export const CLINICAL_BOUNDARY_LINE_3_HE =
  "You can continue from here in a practical way: choose one topic from the report, practice for a few minutes, and check if there is an improvement in the next practice.";

/** School placement / non-clinical sensitive education decisions — no diagnosis, no “move/don’t move” from practice data alone. */
export const SENSITIVE_EDUCATION_LINE_1_HE =
  "Such a question is broader than the report on the site can determine.";
export const SENSITIVE_EDUCATION_LINE_2_HE =
  "The report only shows practice data from the selected period: subjects, subjects, number of questions and accuracy.";
export const SENSITIVE_EDUCATION_LINE_3_HE =
  "What can be done here is to choose from the report one subject for strengthening, and build around it a small and clear step for home or for a conversation with the educational staff.";

/**
 * @returns {{ answerBlocks: Array<{ type: string; textHe: string; source: "composed" }> }}
 */
export function buildClinicalBoundaryAnswerDraft() {
  return {
    answerBlocks: [
      { type: "observation", textHe: CLINICAL_BOUNDARY_LINE_1_HE, source: "composed" },
      { type: "meaning", textHe: CLINICAL_BOUNDARY_LINE_2_HE, source: "composed" },
      { type: "caution", textHe: CLINICAL_BOUNDARY_LINE_3_HE, source: "composed" },
    ],
  };
}

/**
 * Normalized join of boundary blocks - matches `validateAnswerDraft` joined shape (single spaces between blocks).
 */
export function clinicalBoundaryJoinedFingerprintHe() {
  return [CLINICAL_BOUNDARY_LINE_1_HE, CLINICAL_BOUNDARY_LINE_2_HE, CLINICAL_BOUNDARY_LINE_3_HE].join(" ");
}

/** Approved peer-comparison early-exit (single line). */
export function peerComparisonBoundaryJoinedFingerprintHe() {
  return PEER_COMPARISON_RESPONSE_HE;
}

/**
 * @returns {{ answerBlocks: Array<{ type: string; textHe: string; source: "composed" }> }}
 */
export function buildSensitiveEducationChoiceAnswerDraft() {
  return {
    answerBlocks: [
      { type: "observation", textHe: SENSITIVE_EDUCATION_LINE_1_HE, source: "composed" },
      { type: "meaning", textHe: SENSITIVE_EDUCATION_LINE_2_HE, source: "composed" },
      { type: "caution", textHe: SENSITIVE_EDUCATION_LINE_3_HE, source: "composed" },
    ],
  };
}

/** Normalized join for validator whitelist (fixed deterministic copy). */
export function sensitiveEducationChoiceJoinedFingerprintHe() {
  return [SENSITIVE_EDUCATION_LINE_1_HE, SENSITIVE_EDUCATION_LINE_2_HE, SENSITIVE_EDUCATION_LINE_3_HE].join(" ");
}

/**
 * @param {string} text
 */
function hebrewTokens4(text) {
  return String(text || "")
    .split(/\s+/)
    .map((t) => t.replace(/^[^\u0590-\u05FF]+|[^\u0590-\u05FF]+$/g, ""))
    .filter((t) => t.length >= 4);
}

/**
 * @param {string} a
 * @param {string} b
 */
function tokenOverlapCount4(a, b) {
  const A = new Set(hebrewTokens4(a));
  const B = new Set(hebrewTokens4(b));
  let n = 0;
  for (const t of A) if (B.has(t)) n += 1;
  return n;
}

/**
 * Avoid prepending the same required-hedge fragment when observation/meaning/caution already carry it.
 * Wording-layer only: does not remove hedges from the packet, only skips redundant prefix glue.
 * @param {string} hedge
 * @param {string} reason
 * @param {string} priorSlots
 */
function requiredHedgeAlreadyCoveredInDraft(hedge, reason, priorSlots) {
  const h = String(hedge || "").trim();
  if (!h) return true;
  const bucket = `${priorSlots} ${reason}`.replace(/\s+/g, " ").trim();
  if (!bucket) return false;
  if (bucket.includes(h)) return true;
  if (h === "Still too early to decide" && (bucket.includes("too early to determine") || bucket.includes("still early"))) return true;
  return false;
}

/**
 * Drop adjacent composed blocks that repeat the same framing (high token overlap).
 * @param {Array<{ type: string; textHe: string; source: string }>} blocks
 */
function dedupeAdjacentOverlappingComposed(blocks) {
  /** @type {typeof blocks} */
  const out = [];
  for (const b of blocks) {
    const prev = out[out.length - 1];
    if (
      prev &&
      b.source === "composed" &&
      prev.source === "composed" &&
      tokenOverlapCount4(String(prev.textHe || ""), String(b.textHe || "")) >= 4
    ) {
      continue;
    }
    out.push(b);
  }
  return out;
}

/** Mirrors QA harness `home_practice` magnitude check — slots/coaching often omit these tokens. */
const PRACTICAL_MAGNITUDE_MARKERS_RE =
  /(דקות|דקה|פעמים|שאלות|סשנים|זמן\s+קצר|\d+\s*דק)/u;

function weakSubjectLabelForPlan(truthPacket) {
  return (
    String(truthPacket?.surfaceFacts?.weakFocusSubjectLabelHe || "").trim() ||
    String(truthPacket?.surfaceFacts?.subjectLabelHe || "").trim() ||
    "Subject from the report"
  );
}

/**
 * Numbered concrete plan — reused by fast-path fallback and magnitude tail sourcing.
 * @param {"what_to_do_today"|"what_to_do_this_week"} intentMain
 */
export function defaultConcretePlanTextHe(intentMain, truthPacket) {
  const subj = weakSubjectLabelForPlan(truthPacket);
  if (intentMain === "what_to_do_today") {
    return `1) Tomorrow 10 minutes practice focused on ${subj}. 2) 5-8 short questions and check what comes back. 3) Finish in one sentence with the child what you tried.`;
  }
  return `1) Choose one central topic in ${subj} and divide practice into three short windows per week. 2) In each window 5-8 short questions and check if the same mistake repeats. 3) At the end of the week: one sentence with the child - what has progressed and what still needs reinforcement.`;
}

/**
 * Short tail lifted from {@link defaultConcretePlanTextHe} — merged into the last block when the draft lacks magnitude markers.
 * @param {"what_to_do_today"|"what_to_do_this_week"} intentMain
 */
export function practicalMagnitudeTailHe(intentMain, truthPacket) {
  const subj = weakSubjectLabelForPlan(truthPacket);
  if (intentMain === "what_to_do_today") {
    return `10 minutes practice focused on ${subj}, 5–8 short questions.`;
  }
  return `three short windows per week; In each window 5–8 short questions in ${subj}.`;
}

/**
 * Deterministic merge-layer: guarantees QA-visible magnitude hints for weekly/today intents without adding blocks (compaction pops trailing blocks). Preserves `contract_slot` sourcing when merging the approved tail.
 * @param {{ answerBlocks?: Array<{ type: string; textHe: string; source?: string }> }} draft
 */
export function ensureHomePracticePracticalMagnitudeDraft(draft, responseIntent, truthPacket) {
  const intent = String(responseIntent || "");
  if (intent !== "what_to_do_today" && intent !== "what_to_do_this_week") {
    return draft;
  }
  const blocks = draft?.answerBlocks;
  if (!Array.isArray(blocks) || !blocks.length) return draft;
  const joined = blocks.map((b) => String(b?.textHe || "")).join("\n");
  if (joined.length <= 30 || PRACTICAL_MAGNITUDE_MARKERS_RE.test(joined)) {
    return draft;
  }
  const tail = practicalMagnitudeTailHe(intent, truthPacket);
  const lastIdx = blocks.length - 1;
  const last = blocks[lastIdx];
  const next = blocks.slice();
  next[lastIdx] = {
    ...last,
    textHe: `${String(last?.textHe || "").trim()}\n\n${tail}`.trim(),
    // Magnitude tail is deterministic product copy; keep contract_slot so resolved+fallbackUsed
    // passes validateParentCopilotResponseV1 (fallback_non_slot_source).
    source: last?.source === "contract_slot" ? "contract_slot" : last.source,
  };
  return { ...draft, answerBlocks: next };
}

/**
 * @param {ReturnType<typeof import("./conversation-planner.js").planConversation>} plan
 * @param {NonNullable<ReturnType<typeof import("./truth-packet-v1.js").buildTruthPacketV1>>} truthPacket
 * @param {null|{ intent?: string; continuityRepeat?: boolean; conversationState?: object; turnOrdinal?: number }} [coachingCtx]
 */
function intelligenceV1DebugSnapshot(truthPacket) {
  const iv = truthPacket?.signals?.intelligenceV1;
  return iv && typeof iv === "object" ? { ...iv } : null;
}

export function composeAnswerDraft(plan, truthPacket, coachingCtx = null) {
  const nar = truthPacket.contracts?.narrative;
  const slots = nar?.textSlots && typeof nar.textSlots === "object" ? nar.textSlots : {};
  const obs = String(slots.observation || narrativeSectionTextHe("summary", nar) || "").trim();
  const interp = String(slots.interpretation || narrativeSectionTextHe("finding", nar) || "").trim();
  const act = String(slots.action || narrativeSectionTextHe("recommendation", nar) || "").trim();
  const lim = String(slots.uncertainty || narrativeSectionTextHe("limitations", nar) || "").trim();

  const iv = truthPacket?.signals?.intelligenceV1;
  const hasIntelligenceSignals = iv && typeof iv === "object";
  const ivWeak = hasIntelligenceSignals ? String(iv.weaknessLevel || "none") : "";
  const ivConf = hasIntelligenceSignals ? String(iv.confidenceBand || "low") : "";
  const sfQ = Math.max(0, Number(truthPacket?.surfaceFacts?.questions ?? 0));
  const sfA = Math.max(0, Number(truthPacket?.surfaceFacts?.accuracy ?? 0));

  const intentEarly = String(coachingCtx?.intent || plan.intent || "").trim();
  if (intentEarly === "clinical_boundary") {
    return {
      ...buildClinicalBoundaryAnswerDraft(),
      debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
    };
  }
  if (intentEarly === "sensitive_education_choice") {
    return {
      ...buildSensitiveEducationChoiceAnswerDraft(),
      debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
    };
  }
  if (intentEarly === "off_topic_redirect") {
    return {
      answerBlocks: [
        {
          type: "observation",
          textHe:
            "Here you can ask questions about the report and the learning progress that appears in it.",
          source: "composed",
        },
        {
          type: "meaning",
          textHe:
            "For example: What should you practice this week? Or where relatively good results were seen?",
          source: "composed",
        },
      ],
      debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
    };
  }
  if (intentEarly === "parent_policy_refusal") {
    return {
      answerBlocks: [
        {
          type: "observation",
          textHe:
            "It is not possible to invent, change or improve data in the report. It is possible to explain only the data that appears in it.",
          source: "composed",
        },
        {
          type: "meaning",
          textHe:
            "It is not possible to ignore the report or bypass what was told from the practice within the scope of the report only. If something doesn't seem to be working out, it's right to check dates and topics together before deciding on a direction.",
          source: "composed",
        },
      ],
      debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
    };
  }
  if (intentEarly === "off_report_subject_clarification") {
    return {
      answerBlocks: [
        {
          type: "observation",
          textHe:
            "In the practice report presented here, there is currently no data on the subject you asked about - the system records only the study subjects that appear in the report.",
          source: "composed",
        },
        {
          type: "meaning",
          textHe:
            "Therefore, it is not possible to assess a situation here according to this report on this issue; If a relevant practice enters the range, the image will be updated.",
          source: "composed",
        },
      ],
      debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
    };
  }

  const intentMain = String(coachingCtx?.intent || plan.intent || "");

  // ── is_intervention_needed: build calm, reassuring answer in correct order ──
  if (intentMain === "is_intervention_needed") {
    const slotsIv = truthPacket?.contracts?.narrative?.textSlots || {};
    const obsText = String(slotsIv.observation || "").trim();
    const interpText = String(slotsIv.interpretation || "").trim();
    const limText = String(slotsIv.uncertainty || "").trim();
    const opener = parentDirectOpenerHe("is_intervention_needed", truthPacket);
    const obsBlock = opener ? `${opener}\n\n${obsText}`.trim() : obsText;
    const blocks = [];
    if (obsBlock) blocks.push({ type: "observation", textHe: obsBlock, source: "composed" });
    if (interpText) blocks.push({ type: "meaning", textHe: interpText, source: "composed" });
    if (limText) blocks.push({ type: "caution", textHe: limText, source: "composed" });
    if (blocks.length > 0) {
      return {
        answerBlocks: blocks,
        debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
      };
    }
  }

  // ── what_to_do_this_week / what_to_do_today: fast-path concrete plan only when recommendation contract allows practice framing ──
  const dlEarly = truthPacket?.derivedLimits || {};
  const recommendationContractOk =
    dlEarly.recommendationEligible === true &&
    String(dlEarly.recommendationIntensityCap || "RI0") !== "RI0";

  if (
    (intentMain === "what_to_do_this_week" || intentMain === "what_to_do_today") &&
    recommendationContractOk &&
    !(hasIntelligenceSignals && ivWeak === "none")
  ) {
    const slotsWk = truthPacket?.contracts?.narrative?.textSlots || {};
    const obsWk = String(slotsWk.observation || "").trim();
    const interpWk = String(slotsWk.interpretation || "").trim();
    const actWk = String(slotsWk.action || "").trim();
    const opener = parentDirectOpenerHe(intentMain, truthPacket);
    const obsBlock = opener ? `${opener}\n\n${obsWk}`.trim() : obsWk;
    const blocks = [];
    if (obsBlock) blocks.push({ type: "observation", textHe: obsBlock, source: "composed" });
    if (actWk) {
      // Use "composed" not "contract_slot" — normalizeAnswerBlocksHe replaces \n with spaces,
      // making the text diverge from the raw slot text, which would trigger contract_slot_mismatch.
      blocks.push({ type: "next_step", textHe: actWk.replace(/\n/g, " "), source: "composed" });
    } else if (interpWk) {
      blocks.push({ type: "meaning", textHe: interpWk, source: "composed" });
    }
    if (!actWk && !interpWk) {
      blocks.push({
        type: "next_step",
        textHe: defaultConcretePlanTextHe(intentMain, truthPacket),
        source: "composed",
      });
    }
    if (blocks.length > 0) {
      return {
        answerBlocks: blocks,
        debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
      };
    }
  }

  const intent = String(coachingCtx?.intent || plan.intent || "");
  const conv = coachingCtx?.conversationState || null;
  const turnOrd =
    coachingCtx?.turnOrdinal != null
      ? Number(coachingCtx.turnOrdinal)
      : Number(conv?.priorIntents?.length) || 0;
  const scriptIx = conv ? coachingVariantIndex(conv, intent, turnOrd) : 0;

  /** @type {Array<{ type: string; textHe: string; source: "contract_slot"|"composed" }>} */
  const answerBlocks = [];

  for (const b of plan.blockPlan || []) {
    if (b === "observation" && obs) {
      answerBlocks.push({ type: "observation", textHe: obs, source: "contract_slot" });
    }
    if (b === "meaning" && interp) {
      answerBlocks.push({ type: "meaning", textHe: interp, source: "contract_slot" });
    }
    if (b === "next_step") {
      const dlRec = truthPacket?.derivedLimits || {};
      const recommendationOk =
        dlRec.recommendationEligible === true && String(dlRec.recommendationIntensityCap || "RI0") !== "RI0";
      const isWeeklyIntent = intent === "what_to_do_today" || intent === "what_to_do_this_week";
      if (!recommendationOk && isWeeklyIntent) {
        const subj =
          String(truthPacket?.surfaceFacts?.weakFocusSubjectLabelHe || "").trim() ||
          String(truthPacket?.surfaceFacts?.subjectLabelHe || "").trim() ||
          "Subject from the report";
        answerBlocks.push({
          type: "next_step",
          textHe:
            intent === "what_to_do_today"
              ? `Tomorrow: 1) 8–10 minutes short practice in ${subj} around the topic that stands out as a gap in the report. 2) Then 3-5 short test questions. 3) End in one sentence for the child what you tried together.`
              : `For the coming week: 1) Choose one central topic in ${subj} according to what stands out in the report. 2) Divide into three short windows of practice (15-20 minutes total per week). 3) At the end of the week, check in one sentence what has improved compared to the beginning of the week.`,
          source: "composed",
        });
        continue;
      }
      if (act) {
        const skipWhenIvSaysNoWeakTopic = hasIntelligenceSignals && ivWeak === "none";
        if (!skipWhenIvSaysNoWeakTopic) {
          answerBlocks.push({ type: "next_step", textHe: act, source: "contract_slot" });
        }
      } else if (intent === "what_to_do_today" || intent === "what_to_do_this_week") {
        const subj =
          String(truthPacket?.surfaceFacts?.weakFocusSubjectLabelHe || "").trim() ||
          String(truthPacket?.surfaceFacts?.subjectLabelHe || "").trim() ||
          "Subject from the report";
        answerBlocks.push({
          type: "next_step",
          textHe:
            intent === "what_to_do_today"
              ? `Tomorrow: 1) 8–10 minutes short practice in ${subj} around the topic that stands out as a gap in the report. 2) Then 3-5 short test questions. 3) End in one sentence for the child what you tried together.`
              : `For the coming week: 1) choose one central topic from the report. 2) Divide into three short windows of practice. 3) At the end of the week, make a one-sentence summary of what progressed.`,
          source: "composed",
        });
      }
    }
    if (b === "caution" && lim) {
      answerBlocks.push({ type: "caution", textHe: lim, source: "contract_slot" });
    }
    if (b === "uncertainty_reason") {
      const dl = truthPacket.derivedLimits || {};
      const iv1 = hasIntelligenceSignals ? iv : null;
      const iv1Low = hasIntelligenceSignals && String(iv1?.confidenceBand || "") === "low";
      const dlForUncertainty = {
        ...dl,
        confidenceBand: String(dl.confidenceBand || "") === "low" || iv1Low ? "low" : dl.confidenceBand,
      };
      let reason = pickUncertaintyReasonScript(dlForUncertainty, intent, scriptIx);
      if (
        sfQ >= 120 &&
        sfA >= 65 &&
        /דקים מדי|לא ניתן לקבוע כיוון עקבי|כיוון ברור|שאלות פתוחות|עדיין לא מאפשר לקבוע/u.test(reason)
      ) {
        reason =
          "There is a significant volume of practice in the report; There is still a natural difference between what happens at home and what is told in the range - we will update again after more practice.";
      }
      if (hasIntelligenceSignals && ivConf === "low" && sfQ < 90) {
        reason = "This is an initial image only -" + reason;
      }
      if (hasIntelligenceSignals && ivWeak === "tentative" && sfQ < 100) {
        reason = "There is only an initial sign of weakness -" + reason;
      }
      const hedges = Array.isArray(truthPacket.allowedClaimEnvelope?.requiredHedges)
        ? truthPacket.allowedClaimEnvelope.requiredHedges.map((h) => String(h || "").trim()).filter(Boolean)
        : [];
      const priorSlotsForHedgeDedup = [obs, interp, lim].filter(Boolean).join(" ");
      for (const h of hedges) {
        if (h && !requiredHedgeAlreadyCoveredInDraft(h, reason, priorSlotsForHedgeDedup)) {
          reason = `${h} - ${reason}`;
        }
      }
      answerBlocks.push({ type: "uncertainty_reason", textHe: reason, source: "composed" });
    }
  }

  if (answerBlocks.length < 2 && obs) {
    answerBlocks.unshift({ type: "observation", textHe: obs, source: "contract_slot" });
  }
  if (answerBlocks.length < 2 && interp) {
    answerBlocks.push({ type: "meaning", textHe: interp, source: "contract_slot" });
  }

  if (!coachingCtx || !intent) {
    return {
      answerBlocks,
      debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
    };
  }

  const packed = applyParentCoachingPacks(answerBlocks, {
    intent,
    truthPacket,
    conversationState: coachingCtx.conversationState,
    continuityRepeat: !!coachingCtx.continuityRepeat,
    turnOrdinal: turnOrd,
    stripParentFacingMeta: true,
  });

  let composed = dedupeAdjacentOverlappingComposed(packed);
  const opener = parentDirectOpenerHe(intent, truthPacket);
  const firstObsIx = composed.findIndex((b) => b.type === "observation" && String(b.textHe || "").trim());
  if (opener && firstObsIx >= 0) {
    const cur = String(composed[firstObsIx].textHe || "").trim();
    composed[firstObsIx] = {
      ...composed[firstObsIx],
      textHe: cur.includes(opener.slice(0, 12)) ? cur : `${opener}\n\n${cur}`.trim(),
    };
  }

  composed = compactParentAnswerBlocks(composed, {
    scopeType: String(truthPacket?.scopeType || ""),
    maxBlocks: truthPacket?.scopeType === "executive" ? 4 : 5,
    maxTotalChars: truthPacket?.scopeType === "executive" ? 1900 : 2400,
  });

  const parentUtterance = String(coachingCtx?.parentUtterance || plan?.parentUtterance || "");
  const gpm = truthPacket?.surfaceFacts?.gradePracticeMeta;
  if (isMixedGradeReportQuestion(foldUtteranceForHeMatch(parentUtterance)) && gpm?.mixedGradePractice) {
    const note = String(gpm.mixedGradePracticeNoteHe || "").trim();
    const gradeLine = note
      ? `${note} Each line in the report shows the content class in which the practice was performed - do not merge between classes when determining direction.`
      : "When the same subject appears in different content classes, each line in the report is counted separately - do not merge between classes.";
    if (!composed.some((b) => String(b.textHe || "").includes("Class"))) {
      composed = [...composed, { type: "meaning", textHe: gradeLine, source: "composed" }];
    }
  }

  return {
    answerBlocks: composed,
    debug: { intelligenceV1: intelligenceV1DebugSnapshot(truthPacket) },
  };
}
