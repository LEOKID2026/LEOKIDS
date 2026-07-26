/**
 * Compose parent-facing finding text: topic-state sentence + factual observations.
 * Works for all engineDecision values including mastery_stable / partial_stable.
 * Does not write into detectedPattern / blockPatternClaim. English-only.
 */
import { formatFactualObservationSentenceEn } from "./build-factual-observations.js";
import {
  provenFactualParentLabelEn,
  isApprovedFactualObservationTag,
} from "./parent-facing-error-pattern-factual.js";
import { formatQuestionsTextHe, formatWrongOfQuestionsTextHe } from "./normalize-parent-practice-metrics.js";

/**
 * Topic-state base sentence (without observations). English.
 * @param {object} p
 * @param {string} p.topicName
 * @param {string} p.engineDecision
 * @param {number} p.questions
 * @param {number} p.wrong
 * @param {number} p.accuracy
 */
export function topicStateFindingBaseEn(p) {
  const name = String(p.topicName || "this topic").trim() || "this topic";
  const q = Math.max(0, Math.floor(Number(p.questions) || 0));
  const wrong = Math.max(0, Math.floor(Number(p.wrong) || 0));
  const acc = Math.round(Number(p.accuracy) || 0);
  const decision = String(p.engineDecision || "");
  const suffix = q > 0 ? ` Based on ${formatQuestionsTextHe(q)} solved in this topic.` : "";

  if (q <= 0) return "";

  if (decision === "clear_topic_gap") {
    return `${name} shows a clear difficulty.${wrong > 0 && q > 0 ? ` ${formatWrongOfQuestionsTextHe(wrong, q)} (${acc}% accuracy).` : ""} It's worth going back and reinforcing this topic before moving on.${suffix}`;
  }
  if (decision === "topic_needs_strengthening") {
    return `${name} has a point worth reinforcing (${formatQuestionsTextHe(q)}, ${acc}% accuracy). Focused reinforcement would help.${suffix}`;
  }
  if (decision === "partial_stable") {
    return `Understanding is developing in ${name}.${suffix}`;
  }
  if (decision === "mastery_stable") {
    return `Performance was strong and stable in ${name}.${suffix}`;
  }
  if (decision === "early_direction_only") {
    if (q <= 4) return `${name} has only an early direction so far.${suffix}`;
    return `${name} shows good success, but it's still early to determine stable mastery.${suffix}`;
  }
  if (decision === "insufficient_data") {
    return `There isn't enough data yet in ${name}.${suffix}`;
  }
  if (decision === "speed_pressure_pattern") {
    return `In ${name}, some of the mistakes appeared during fast work.${suffix}`;
  }
  return String(p.existingFinding || "").trim();
}

/**
 * Integrate factual observation sentences with topic-state finding.
 * Positive accuracy never suppresses observations.
 *
 * @param {object} p
 * @param {string} [p.finding] existing finding (optional)
 * @param {string} p.topicName
 * @param {string} p.engineDecision
 * @param {number} p.questions
 * @param {number} p.wrong
 * @param {number} p.accuracy
 * @param {object[]} p.factualObservations
 */
export function composeParentFindingWithFactualObservations(p) {
  const observations = Array.isArray(p.factualObservations) ? p.factualObservations : [];
  const obsSentences = observations
    .map((o) => formatFactualObservationSentenceEn(o))
    .filter(Boolean);

  const decision = String(p.engineDecision || "");
  const q = Math.max(0, Math.floor(Number(p.questions) || 0));
  const name = String(p.topicName || "this topic").trim() || "this topic";
  const suffix = q > 0 ? ` Based on ${formatQuestionsTextHe(q)} solved in this topic.` : "";

  // Prefer composed base + observations for positive / gap states
  if (decision === "mastery_stable" && obsSentences.length) {
    const first = obsSentences[0].replace(/^The same error appeared in/, "the same error appeared in");
    const rest = obsSentences.slice(1).join(" ");
    return `Performance was strong and stable in ${name}. Alongside this success, ${first}${rest ? ` ${rest}` : ""}${suffix}`.replace(
      /\.\./g,
      ".",
    );
  }

  if (decision === "partial_stable" && obsSentences.length) {
    const body = obsSentences.join(" ");
    return `Understanding is developing in ${name}. ${body}${suffix}`.replace(/\s+/g, " ").trim();
  }

  let base = String(p.finding || "").trim();
  // Prefer existing finding text when present; only rebuild if empty.
  if (!base) {
    base = topicStateFindingBaseEn({
      topicName: name,
      engineDecision: decision,
      questions: q,
      wrong: p.wrong,
      accuracy: p.accuracy,
      existingFinding: "",
    });
  }

  // Strip trailing suffix so we can re-append once after observations
  const baseCore = base.replace(/\s*Based on \d+ questions? solved in this topic\.?\s*$/iu, "").trim();

  if (!obsSentences.length) {
    return base || baseCore;
  }

  // Avoid duplicating observation text already present
  const missing = obsSentences.filter((s) => {
    const labelMatch = s.match(/appeared in [^:]+:\s*(.+)\.$/);
    const label = labelMatch?.[1] || "";
    return !label || !baseCore.includes(label);
  });

  if (!missing.length) return base;

  const combined = `${baseCore} ${missing.join(" ")}${suffix}`
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
  return combined;
}

/**
 * Backward-compatible wrapper used by buildLearningPatternDecision and older tests.
 * Always surfaces factual observations when labels exist — ignores old enrich gates.
 * Accepts either factualObservations[] or repeatedMistakePatterns[].
 */
export function enrichParentFindingWithConsistentStrongTag(p) {
  let observations = Array.isArray(p.factualObservations) ? [...p.factualObservations] : [];
  if (!observations.length && Array.isArray(p.repeatedMistakePatterns)) {
    const q = Math.max(0, Math.floor(Number(p.questions) || 0));
    const wrong = Math.max(
      0,
      Math.floor(
        Number(
          p.wrong != null
            ? p.wrong
            : p.repeatedMistakePatterns.reduce((s, x) => s + (Number(x.count) || 0), 0),
        ) || 0,
      ),
    );
    for (const pat of p.repeatedMistakePatterns) {
      const key = String(pat?.key || "");
      const canon = key.replace(/^(mt|pf|st|ct|k|to):/i, "");
      if (!isApprovedFactualObservationTag(canon)) continue;
      const label = provenFactualParentLabelEn(key);
      if (!label) continue;
      const count = Math.max(0, Math.floor(Number(pat.count) || 0));
      if (count < 1) continue;
      observations.push({
        key,
        canonicalKey: canon,
        labelKey: canon,
        label,
        count,
        totalQuestions: q,
        totalErrors: wrong || count,
        ratioOfQuestions: q > 0 ? count / q : 0,
        ratioOfErrors: (wrong || count) > 0 ? count / (wrong || count) : 0,
        distinctSessions: 0,
        distinctDays: 0,
        firstSeenAt: null,
        lastSeenAt: null,
        recurrenceLevel: "repeated",
      });
    }
  }
  return composeParentFindingWithFactualObservations({
    finding: p.finding,
    topicName: p.topicName,
    engineDecision: p.engineDecision,
    questions: p.questions,
    wrong: p.wrong,
    accuracy: p.accuracy,
    factualObservations: observations,
  });
}
