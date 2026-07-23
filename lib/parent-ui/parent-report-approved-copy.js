/**
 * Approved parent-facing English copy for the regular report (UI layer only).
 * Maps engine pattern labels -> plain parent language.
 * English sibling of parent-report-approved-copy-he.js.
 */

import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";
import { formatParentReportGradeHe as formatParentReportGrade } from "../../utils/parent-report-language/parent-report-display-labels.js";
import { normalizeParentFacingHe as normalizeParentFacing } from "../../utils/parent-report-language/parent-facing-normalize.js";
import { buildTopicOwnerCopySlots, resolveTopicExplainOwnerSectionsHe } from "../../utils/learning-pattern-decision/resolve-topic-owner-copy.js";
import { getLpdFromRow, rowIsPositiveFromLpd } from "../../utils/learning-pattern-decision/index.js";
import { resolveParentReportRowGradeRelation } from "../../utils/parent-report-core-grade-filter.js";
import {
  parentFacingErrorPatternLabel,
  parentFacingErrorPatternMeaning,
  resolveParentFacingPatternLabel,
  stripParentTopicSectionPrefix,
} from "../../utils/learning-pattern-decision/parent-facing-error-pattern.js";
import { gateParentPatternCopy, buildParentEvidenceStatements } from "../../lib/learning/parent-report-evidence-pipeline.js";

/** @param {string} text */
function clean(text) {
  return normalizeParentFacing(String(text || "").replace(/\s+/g, " ").trim());
}

/**
 * Strip registered-grade suffix from any free-text line (insights, recommendations, etc.).
 * Other grades are kept when explicitly written.
 * @param {string} text
 * @param {string|null|undefined} registeredGradeKey
 */
export function cleanRegisteredGradeFromFreeText(text, registeredGradeKey) {
  let t = clean(text);
  if (!t || !registeredGradeKey) return t;
  const reg = formatParentReportGrade(registeredGradeKey);
  if (!reg || reg === reportPackCopy("lib__parent-ui__parent-report-approved-copy", "not_available")) return t;
  const esc = reg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const suffix = `\\s*[–·-]\\s*Grade\\s*${esc}`;
  const end = `(?=\\s|[,.:;»»\\)\\]]|$)`;
  t = t.replace(new RegExp(`«([^»]+?)${suffix}${end}»`, "gu"), "«$1»");
  t = t.replace(new RegExp(`${suffix}${end}`, "gu"), "");
  t = t.replace(new RegExp(`in\\s+([^\\s,]+)${suffix}${end}`, "gu"), "in $1");
  return clean(t);
}

/** @param {string} label @param {string|null|undefined} registeredGradeKey @param {Record<string, unknown>} row */
export function topicTitleForFreeText(label, registeredGradeKey, row) {
  let t = clean(label);
  if (!t) return "";
  const rel = resolveParentReportRowGradeRelation(row, registeredGradeKey);
  if (rel === "lower" || rel === "higher") {
    const grade = formatParentReportGrade(
      row?.contentGradeKey ?? row?.gradeKey ?? row?.contentGradeLevel ?? row?.grade,
    );
    if (grade && grade !== reportPackCopy("lib__parent-ui__parent-report-approved-copy", "not_available")) return `${t} - Grade ${grade}`;
  }
  const reg = registeredGradeKey ? formatParentReportGrade(registeredGradeKey) : null;
  if (reg && reg !== reportPackCopy("lib__parent-ui__parent-report-approved-copy", "not_available")) {
    const esc = reg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp(`\\s*[–·-]\\s*Grade\\s*${esc}\\s*$`, "iu"), "");
    t = t.replace(new RegExp(`\\s*Grade\\s*${esc}\\s*$`, "iu"), "");
  }
  return clean(t);
}

const REGULAR_REPORT_ENGINE_JARGON_RES = [
  /indicates a pattern[^.]*\.?\s*/gi,
  /focus point[^.]*\.?\s*/gi,
  /cautious observation[^.]*\.?\s*/gi,
  /\bmistake pattern:\s*/gi,
  /\ba recurring mistake pattern was found:\s*/gi,
  /\bwhat was found:\s*/gi,
];

/**
 * Sanitize any regular-report free-text line: registered-grade cleanup + parent-safe wording.
 * @param {string} text
 * @param {string|null|undefined} registeredGradeKey
 * @param {string} [topicHint]
 */
export function sanitizeRegularReportFreeText(text, registeredGradeKey, topicHint = "") {
  let t = cleanRegisteredGradeFromFreeText(text, registeredGradeKey);
  if (!t) return "";

  t = t.replace(/,?\s*and a recurring mistake pattern was found:\s*([^.;]+)/gi, (_match, rawPattern) => {
    const approved = resolveApprovedCopy(String(rawPattern || ""), topicHint);
    return approved?.meaning ? `. ${approved.meaning}` : ". Some mistakes repeat in the same type of question.";
  });

  for (const re of REGULAR_REPORT_ENGINE_JARGON_RES) {
    t = t.replace(re, "");
  }

  t = t.replace(/\s{2,}/g, " ").replace(/\.\s*\./g, ".").trim();
  return clean(t);
}

function genericLowVolumeTopicCopy(title, q) {
  const topic = clean(title) || "this topic";
  return {
    title,
    whatWeSee: q > 0 ? `${q} question${q === 1 ? "" : "s"} answered.` : "",
    whatItMeans: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "there_are_only_a_few_questions_on_this_topic_so_it_is_still_early_to_dra"),
    homeAction: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "keep_practicing_a_few_more_short_questions_and_watch_for_whether_the_sam"),
    prominent: `There are only a few questions in ${topic} so far, so it's still too early to draw a strong conclusion.`,
    strength: null,
    focusLine: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "there_are_only_a_few_questions_on_this_topic_so_it_is_still_early_to_dra"),
  };
}

function genericStableTopicCopy(title, q, acc) {
  return {
    title,
    whatWeSee: `${q} question${q === 1 ? "" : "s"} answered, with ${acc}% accuracy.`,
    whatItMeans: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "most_answers_are_correct_and_this_topic_looks_relatively_stable"),
    homeAction: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "keep_up_the_success_with_a_short_practice_every_now_and_then"),
    prominent: null,
    strength: `${title}: practice looks stable - ${q} questions, ${acc}% accuracy.`,
    focusLine: null,
  };
}

/**
 * @param {string} topicTitle
 */
function genericParentCopyForPattern(topicTitle) {
  const topic = clean(topicTitle) || "this topic";
  return {
    prominent: `In ${topic}, the same type of mistake keeps showing up.`,
    focusLine: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "the_same_type_of_mistake_keeps_showing_up"),
    meaning:
      "The same type of mistake keeps showing up in this topic - it helps to follow the solving method together.",
    home: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "pause_after_a_mistake_and_ask_the_child_to_explain_how_they_reached_the_"),
  };
}

/**
 * @param {string} patternRaw
 * @param {string} topicTitle
 */
function resolveApprovedCopy(patternRaw, topicTitle) {
  const mapped = resolveParentFacingPatternLabel(patternRaw);
  const p = clean(mapped || patternRaw);
  const topic = clean(topicTitle) || "this topic";
  if (!p) return null;
  const pl = p.toLowerCase();
  const meaningFromEngine = parentFacingErrorPatternMeaning(patternRaw);
  if (meaningFromEngine) {
    const short = parentFacingErrorPatternLabel(patternRaw) || p;
    return {
      prominent: `In ${topic}, a recurring mistake shows up: ${short}.`,
      focusLine: short,
      meaning: meaningFromEngine,
      home: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "pause_after_a_mistake_and_ask_the_child_to_explain_step_by_step_how_they"),
    };
  }

  if (/numerator only|compares by numerator/i.test(pl)) {
    return {
      prominent: `In ${topic}, a recurring mistake shows up: the child tends to compare fractions using only the top number, without checking the overall size of the fraction.`,
      focusLine:
        "The child tends to compare fractions using only the top number, without checking the overall size of the fraction.",
      meaning:
        "The recurring mistake is comparing by the top number only - the child doesn't always check the overall size of the fraction.",
      home:
        "Ask them to explain why one fraction is bigger than another, rather than only looking at the top number.",
    };
  }

  if (/same wrong pairs|recurring wrong pairs/i.test(pl)) {
    return {
      prominent: `In ${topic}, the same specific problems keep coming up wrong. This means the issue isn't the whole times-table, just a few pairs worth reinforcing.`,
      focusLine:
        "The same specific fact pairs keep coming up wrong - it helps to reinforce exactly those pairs.",
      meaning:
        "The same multiplication pairs keep coming up wrong. It helps to reinforce those specific pairs rather than redoing everything from scratch.",
      home: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "practice_the_specific_pairs_that_keep_coming_up_wrong_out_loud_and_as_a_"),
    };
  }

  if (/rounding direction|confusion (?:with|about) rounding/i.test(pl)) {
    return {
      prominent: `In ${topic}, there's some confusion about rounding numbers: when to round up and when to keep or round down.`,
      focusLine: "There's some confusion about rounding - when to round up and when to round down.",
      meaning: "There's some confusion about rounding - when to round up and when to round down.",
      home: "Ask the child to explain which digit they're rounding by, and check whether the result makes sense.",
    };
  }

  if (/reverse operation|adds instead of subtracts/i.test(pl)) {
    return {
      prominent: `In ${topic}, the child sometimes works in the opposite direction - adding or moving forward instead of decreasing the number.`,
      focusLine:
        "The child sometimes works in the opposite direction - adding or moving forward instead of decreasing the number.",
      meaning:
        "The child sometimes works in the opposite direction - adding or moving forward instead of decreasing the number.",
      home: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "pause_before_solving_and_ask_should_the_result_be_bigger_or_smaller_than"),
    };
  }

  if (/partial comparison/i.test(pl)) {
    return {
      prominent: `In ${topic}, the child seems to use only part of the information in the text, rather than comparing all the needed details.`,
      focusLine:
        "The child seems to use only part of the information in the text, rather than comparing all the needed details.",
      meaning:
        "It looks like the child uses only part of the information in the text, rather than comparing all the needed details.",
      home: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "read_a_short_passage_together_and_pause_to_ask_where_in_the_text_did_you"),
    };
  }

  return genericParentCopyForPattern(topicTitle);
}

/**
 * @param {Record<string, unknown>} row
 */
function patternFromRow(row) {
  const slots = buildTopicOwnerCopySlots(row);
  const lpd = getLpdFromRow(row);
  const contract =
    lpd?.engineDecisionContract && typeof lpd.engineDecisionContract === "object"
      ? lpd.engineDecisionContract
      : null;
  const raw =
    slots?.detectedPattern ||
    contract?.detectedPattern ||
    lpd?.repeatedMistakePatterns?.[0]?.label ||
    "";
  return clean(resolveParentFacingPatternLabel(raw) || "");
}

/**
 * @param {Record<string, unknown>} row
 * @param {string} title
 * @param {string} pattern
 */
function buildRegularReportTopicMeaning(row, title, pattern) {
  const ownerSections = resolveTopicExplainOwnerSectionsHe(row);
  const ownerMeaning = stripParentTopicSectionPrefix(ownerSections?.meaning || "");
  if (ownerMeaning) return ownerMeaning;

  if (pattern) {
    const lpd = getLpdFromRow(row);
    const pipeline = buildParentEvidenceStatements({
      questions: Number(row?.questions) || 0,
      correct: Number(row?.correct) || 0,
      wrong: Number(row?.wrong) || 0,
      taxonomyId: lpd?.engineDecisionContract?.detectedPatternId || null,
      de2Unit: row?.de2Unit || null,
    });
    const gatedPattern = gateParentPatternCopy(pattern, pipeline);
    if (!gatedPattern && /reverse direction|add instead of subtract|omitted|add three/i.test(pattern)) {
      return genericStableTopicCopy(title, Number(row?.questions) || 0, Number(row?.accuracy) || 0).whatItMeans;
    }
    const approved = resolveApprovedCopy(gatedPattern || pattern, title);
    if (approved?.requiresEvidenceTag && !pipeline.allowsSpecificDiagnosis) {
      return genericLowVolumeTopicCopy(title, Number(row?.questions) || 0).whatItMeans;
    }
    if (approved?.meaning) return approved.meaning;
  }

  const lpd = getLpdFromRow(row);
  const finding = stripParentTopicSectionPrefix(lpd?.parentVisibleFinding || "");
  if (finding) return finding;

  const q = Number(row.questions) || 0;
  const acc = Math.round(Number(row.accuracy) || 0);
  if (q > 0 && acc < 72) {
    return "There are recurring mistakes in this practice - it helps to follow the solving method together.";
  }

  return "There isn't one clear mistake pattern yet, but it helps to go over the solving method together, not just the final answer.";
}

/**
 * @param {Record<string, unknown>} row
 * @param {string|null|undefined} registeredGradeKey
 */
export function buildApprovedTopicCopy(row, registeredGradeKey) {
  const title = topicTitleForFreeText(
    String(row.label || row.displayName || ""),
    registeredGradeKey,
    row,
  );
  const q = Number(row.questions) || 0;
  const acc = Math.round(Number(row.accuracy) || 0);
  const pattern = patternFromRow(row);

  if (rowIsPositiveFromLpd(row) && q >= 5 && acc >= 80) {
    return genericStableTopicCopy(title, q, acc);
  }

  if (q > 0 && q <= 3) {
    return genericLowVolumeTopicCopy(title, q);
  }

  if (pattern) {
    const approved = resolveApprovedCopy(pattern, title);
    return {
      title,
      whatWeSee: q > 0 ? `${q} questions answered, with ${acc}% accuracy.` : "",
      whatItMeans: approved?.meaning || buildRegularReportTopicMeaning(row, title, pattern),
      homeAction: approved?.home || reportPackCopy("lib__parent-ui__parent-report-approved-copy", "practice_a_few_short_questions_and_ask_the_child_to_explain_the_method"),
      prominent: approved?.prominent || null,
      strength: null,
      focusLine: approved?.focusLine || approved?.meaning || null,
    };
  }

  if (q > 0 && acc < 72) {
    return {
      title,
      whatWeSee: `${q} questions answered, with ${acc}% accuracy.`,
      whatItMeans: buildRegularReportTopicMeaning(row, title, ""),
      homeAction: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "practice_a_few_short_questions_and_ask_the_child_to_explain_the_method"),
      prominent: title ? `In ${title}, there are recurring mistakes worth noticing.` : null,
      strength: null,
      focusLine: title ? `${title}: there are recurring mistakes worth noticing.` : null,
    };
  }

  return {
    title,
    whatWeSee: q > 0 ? `${q} questions answered, with ${acc}% accuracy.` : "",
    whatItMeans: "",
    homeAction: "",
    prominent: null,
    strength: null,
    focusLine: null,
  };
}

/**
 * @param {Record<string, unknown>} row
 * @param {string|null|undefined} registeredGradeKey
 */
export function buildRegularReportTopicExplainCard(row, registeredGradeKey) {
  const copy = buildApprovedTopicCopy(row, registeredGradeKey);
  if (!copy.whatWeSee && !copy.whatItMeans) return null;
  return {
    title: copy.title,
    whatWeSee: copy.whatWeSee,
    whatItMeans: copy.whatItMeans,
    homeAction: copy.homeAction,
  };
}
