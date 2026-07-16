/**
 * Phase C — parent coaching lines and script variants (deterministic, in-session only).
 * Text is generic framing around contract slots; no new facts beyond TruthPacket + scope label.
 */

/**
 * Map canonical Stage A intents to legacy pack keys (OBS_PREFIX / MEANING_COACH / NEXT_STEP_COACH).
 * @param {string} intent
 */
export function mapCanonicalIntentToPackGroup(intent) {
  const k = String(intent || "");
  /** @type {Record<string, string>} */
  const t = {
    explain_report: "understand_observation",
    ask_topic_specific: "understand_observation",
    ask_subject_specific: "understand_observation",
    what_is_most_important: "understand_meaning",
    what_to_do_today: "action_today",
    what_to_do_this_week: "action_week",
    why_not_advance: "advance_or_hold",
    what_is_going_well: "understand_observation",
    what_is_still_difficult: "avoid_now",
    how_to_tell_child: "explain_to_child",
    question_for_teacher: "ask_teacher",
    is_intervention_needed: "uncertainty_boundary",
    strength_vs_weakness_summary: "understand_meaning",
    clarify_term: "understand_meaning",
    clinical_boundary: "uncertainty_boundary",
    sensitive_education_choice: "uncertainty_boundary",
    unclear: "understand_meaning",
  };
  return t[k] || "understand_meaning";
}

/**
 * @param {object} [conv]
 * @param {string[]} [conv.priorIntents]
 * @param {number} [conv.repeatedPhraseHits]
 * @param {string} intent
 * @param {number} [turnOrdinal]
 * @returns {number}
 */
export function coachingVariantIndex(conv, intent, turnOrdinal = 0) {
  const pi = Array.isArray(conv?.priorIntents) ? conv.priorIntents.slice(-6).join("|") : "";
  const n = Number(conv?.repeatedPhraseHits) || 0;
  let h = 0;
  for (let i = 0; i < pi.length; i++) h = (h * 31 + pi.charCodeAt(i)) >>> 0;
  const s = String(intent || "");
  for (let i = 0; i < s.length; i++) h = (h * 17 + s.charCodeAt(i)) >>> 0;
  h = (h + (n % 11) * 5 + (conv?.priorIntents?.length || 0) + (Number(turnOrdinal) || 0) * 13) >>> 0;
  return h % 24;
}

/** @param {string} label */
function scopeSnippet(label) {
  const t = String(label || "").trim();
  if (t.length < 2) return "On the selected topic";
  if (t === "Period overview" || t === "the report for the selected period" || t === "executive") return "What appears in the report";
  if (t.length > 32) return `About ${t.slice(0, 30)}…`;
  return `on ${t}`;
}

/** @type {Record<string, string[]>} */
const OBS_PREFIX = {
  understand_observation: [
    "In simple words from the report:",
    "What is written there in this line:",
    "Data point:",
    "Here is only what appears in the report, without expanding beyond it:",
  ],
  understand_meaning: [
    "This is what the report summarizes here:",
    "What appears in the report summarizes as follows:",
    "",
    "In the wording of the report:",
  ],
  action_today: ["What the report shows: ", "On the same figure in the report:", "", "Regarding that figure in the report:"],
  action_tomorrow: ["What the report shows: ", "Further to the wording in the report:", "", "Based on what the report says: "],
  action_week: ["What the report shows: ", "Regarding the picture from the report:", "", "Based on what the report says: "],
  avoid_now: ["What the report shows: ", "Carefully and according to what is written:", "", "Based on what the report says: "],
  advance_or_hold: ["What the report shows: ", "Without determining beyond the wording in the report:", "", "Based on what the report says: "],
  explain_to_child: ["What appears in the report:", "Based on the same wording in the report:", "", "From what appears in the report:"],
  ask_teacher: ["What appears in the report:", "From what appears in the report:", "", "Based on what the report says: "],
  uncertainty_boundary: ["What the report shows: ", "Within the limits of the wording in the report:", "", "Based on what the report says: "],
};

/** @type {Record<string, string[]>} */
const MEANING_COACH = {
  understand_meaning: [
    "As parents, you can ask: where does this apply on a daily basis - without expanding beyond what is written in the report.",
    "If it is clear, you can leave it as an explanation to yourself and continue with a small step only when appropriate.",
    "It is worth connecting this sentence to a concrete example from home, without creating a new direction that does not appear in the report.",
    "For now, it is enough to hold this meaning as a framework and not rush into a big action.",
  ],
  understand_observation: [
    "As a parent, this number can be read as a sign of direction, not as a complete story in itself.",
    "If something is not clear in a line, you can return to it later with a focused question - still within the limits of the report.",
    "Good use: to indicate to the child what is seen in the report without giving a personal grade on character.",
    "For now, it is enough to identify what is being measured here and what has not yet been said.",
  ],
  action_today: [
    "From the parent's side: one small step that can be checked today is better, instead of a long list.",
    "If that sounds like a lot, you can choose just one part and leave the rest for the next few days.",
    "You should make sure that the step fits the situation at home - without adding goals that do not appear in the report.",
    "Currently, it is enough to break down into something that can be described to a child in one sentence.",
  ],
  action_tomorrow: [
    "Tomorrow, something already \"prepared in advance\" is better - one sentence for the family and a short task.",
    "If the day is busy, you can prepare a short note today so that no last minute decisions are required the next day.",
    "From the parents' side: it is better not to sit all evening on planning - one clear direction is enough.",
    "Currently, it is enough to choose a short time window in advance.",
  ],
  action_week: [
    "A plan for the week should remain realistic: fewer items that last are better than a long list.",
    "You can schedule a short return in the middle of the week and see if the step is still appropriate.",
    "As parents, it's worth associating the plan with a short fixed day - not turning it into a test.",
    "Currently, a lightweight framework that can be updated after a week is preferable.",
  ],
  avoid_now: [
    "An avoid list works well when it's short and to the point - especially when it's a busy week.",
    "You can choose one thing to avoid and leave the rest for another conversation.",
    "You should maintain a tone of energy protection, not criticism of the child.",
    "Currently, it is enough to identify one focal point that complicates it and make it easier.",
  ],
  advance_or_hold: [
    "A decision to promote versus waiting is good when it is based on the same signals in the report, not on a gut feeling alone.",
    "You can write two sentences for yourself: when you take a small step forward and when you stay put.",
    "As parents, sometimes \"waiting\" is a wise move - especially when the data is still thin.",
    "Currently, it is worth setting a date for a re-examination instead of deciding everything today.",
  ],
  explain_to_child: [
    "Formulation for the child is better to be short, at eye level, and without words from the report that the child does not know.",
    "You can start with a sentence about what you see together and only then add one meaningful sentence.",
    "If the child asks \"why\", you can stay within what the report says without predicting the future.",
    "For now, one sentence of encouragement and one sentence of direction is enough.",
  ],
  ask_teacher: [
    "A good question for the teacher is specific and short - with a quote from the report if needed.",
    "You can arrange in advance what you want to hear in the answer (index, example, next recommendation).",
    "It is useful to maintain a cooperative language: \"how can we support the house\" instead of blame.",
    "Currently, one focused question is better than a long list.",
  ],
  uncertainty_boundary: [
    "When there is uncertainty, it is better not to fill the space with explanations that do not appear in the report.",
    "You can write down for yourself what you do know from the report and what is still open - it takes the pressure off.",
    "As parents, sometimes it's most helpful to set when to check back instead of closing the day.",
    "For now, it's enough to hold the question mark and take small steps.",
  ],
};

/** @type {Record<string, string[]>} */
const NEXT_STEP_COACH = {
  action_today: [
    "Before execution: it is worth making sure that the step is small enough that it is clear when we have finished it.",
    "From the parent's side: something that can be described to the child in one sentence is better.",
    "If there is resistance, you can shorten even more and stay on only one part.",
    "For now, a short trial that can be repeated tomorrow is enough.",
  ],
  action_tomorrow: [
    "To continue tomorrow: you can prepare a short note today so that no last-minute decisions are required the next day.",
    "It is worth choosing a short time window in advance - not a task that opens a long debate.",
    "From the parents' side: something suitable for the day after school, not for the peak of the rush, is better.",
    "Currently, it is enough to define \"what we do for five minutes\".",
  ],
  action_week: [
    "For the coming week: three small steps that hold are better than ten that do not progress.",
    "It is possible to insert one day without a task - to allow absorption.",
    "From the parents' side: it is worth coordinating in advance who is responsible for what, without discounts.",
    "Currently, a weekly framework that can be updated at the end of the week is sufficient.",
  ],
};

/** @param {object} truthPacket */
function personalizedLine(truthPacket, ix) {
  const label = truthPacket?.scopeLabel || "";
  const snip = scopeSnippet(label);
  const pool = [
    `${snip} - The answer can be read as practical guidance, not as a personality assessment.`,
    `${snip} It is worth maintaining a connection between what is written in the report and what can be done at home in practice.`,
    `${snip} If something does not agree with the situation at home, it is better to shorten a step than to expand a direction.`,
    `${snip} Currently, it is enough to keep the information as a frame and update after further practice.`,
  ];
  return pool[ix % pool.length];
}

/**
 * @param {Array<{ type: string; textHe: string; source: string }>} blocks
 * @param {{
 *   intent: string;
 *   truthPacket: object;
 *   conversationState?: object;
 *   continuityRepeat?: boolean;
 *   turnOrdinal?: number;
 * }} ctx
 */
export function applyParentCoachingPacks(blocks, ctx) {
  if (ctx.stripParentFacingMeta) {
    return (Array.isArray(blocks) ? blocks : []).map((b) => ({ ...b, textHe: String(b.textHe || "").trim() }));
  }
  const intent = String(ctx.intent || "");
  let packGroup = mapCanonicalIntentToPackGroup(intent);
  const dl = ctx.truthPacket?.derivedLimits || {};
  const interp = String(ctx.truthPacket?.interpretationScope || "executive").trim();
  if (intent === "what_is_going_well") {
    const strengthOk =
      interp === "strengths" &&
      !dl.cannotConcludeYet &&
      dl.readiness !== "insufficient" &&
      dl.confidenceBand !== "low";
    if (!strengthOk) packGroup = "uncertainty_boundary";
  }
  if (intent === "strength_vs_weakness_summary") {
    if (interp === "weaknesses") packGroup = "avoid_now";
    else if (interp === "strengths") {
      const strengthOk =
        !dl.cannotConcludeYet && dl.readiness !== "insufficient" && dl.confidenceBand !== "low";
      if (!strengthOk) packGroup = "uncertainty_boundary";
    }
  }
  const conv = ctx.conversationState || {};
  const turnOrd =
    ctx.turnOrdinal != null ? Number(ctx.turnOrdinal) : Number(conv?.priorIntents?.length) || 0;
  const ix = coachingVariantIndex(conv, intent, turnOrd);
  const hits = Number(conv.repeatedPhraseHits) || 0;
  const effIx = hits >= 2 ? ix % 4 : ix;
  const cont = !!ctx.continuityRepeat;

  /** @type {Array<{ type: string; textHe: string; source: string }>} */
  const out = [];

  const obsArr = OBS_PREFIX[packGroup] || ["What the report shows: ", "", "Based on what the report says: ", "Regarding the figure in the report:"];
  const obsPrefix = obsArr[effIx % obsArr.length];

  const meaningLines = MEANING_COACH[packGroup];
  const addMeaningCoach = Array.isArray(meaningLines) && meaningLines.length > 0;
  const meaningCoachText = addMeaningCoach ? meaningLines[effIx % meaningLines.length] : "";

  let meaningEmitted = 0;

  for (const b of blocks) {
    if (b.type === "observation" && b.source === "contract_slot" && String(b.textHe || "").trim()) {
      out.push({ ...b, textHe: obsPrefix + String(b.textHe).trim() });
      continue;
    }

    if (b.type === "meaning" && b.source === "contract_slot") {
      out.push(b);
      meaningEmitted += 1;
      if (addMeaningCoach && meaningEmitted === 1 && meaningCoachText) {
        out.push({ type: "meaning", textHe: meaningCoachText, source: "composed" });
        if (cont) {
          out.push({
            type: "meaning",
            textHe: personalizedLine(ctx.truthPacket, effIx + 3),
            source: "composed",
          });
        }
      }
      continue;
    }

    if (
      b.type === "next_step" &&
      b.source === "contract_slot" &&
      (intent.startsWith("action") || intent === "what_to_do_today" || intent === "what_to_do_this_week")
    ) {
      const coachKey =
        intent === "what_to_do_today"
          ? "action_today"
          : intent === "what_to_do_this_week"
            ? "action_week"
            : intent;
      const arr = NEXT_STEP_COACH[coachKey] || NEXT_STEP_COACH.action_week;
      const line = arr[effIx % arr.length];
      if (line) {
        out.push({ type: "next_step", textHe: line, source: "composed" });
      }
      out.push(b);
      continue;
    }

    out.push(b);
  }

  return out;
}

/**
 * @param {object} dl
 * @param {string} intent
 * @param {number} ix
 */
export function pickUncertaintyReasonScript(dl, intent, ix) {
  const cannot = !!dl.cannotConcludeYet;
  const low = String(dl.confidenceBand || "") === "low";

  if (cannot) {
    const lines = [
      "According to the framework of the report, it is still not possible to determine a consistent direction - practice and retesting continue.",
      "The report still does not make it possible to determine a clear direction; Currently, we continue with focused practice and check again later.",
      "When you can't close yet, it's better to break down into small steps of information gathering than to guess.",
      "According to the limits in the report: there is still no \"end point\" for the direction; Continue with caution and repeat measurement.",
    ];
    return lines[ix % lines.length];
  }
  if (low) {
    const lines = [
      "What is presented here is not yet sufficiently established in this range, so caution is maintained in wording.",
      "When the confidence is low, at the moment we keep close to what is written in the report and do not expand the estimate.",
      "The data here is too thin to state with confidence; Better to keep questions open and check back later.",
      "In a situation of low security, it is correct to maintain caution and repeat measurement.",
    ];
    return lines[ix % lines.length];
  }
  const lines = [
    "The recommendations here reflect the same data source in the report only, without expanding beyond it.",
    "What appears here is based on the same wording as in the report; If something is missing, stay within what appears there.",
    "The report is based on the practice carried out on the site in the selected period.",
  ];
  if (
    intent === "uncertainty_boundary" ||
    intent === "is_intervention_needed" ||
    intent === "unclear" ||
    mapCanonicalIntentToPackGroup(intent) === "uncertainty_boundary"
  ) {
    const extra = [
      ...lines,
      "This is exactly the place to ask what else is missing in the report to feel more confident - without making up for a lack of guesswork.",
    ];
    return extra[ix % extra.length];
  }
  return lines[ix % lines.length];
}
