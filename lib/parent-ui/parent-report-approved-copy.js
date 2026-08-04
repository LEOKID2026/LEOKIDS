/**
 * Approved parent-facing English copy for the regular report (UI layer only).
 * Maps engine pattern labels -> plain parent language.
 * English sibling of parent-report-approved-copy-he.js.
 */

import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";
import { formatParentReportGradeHe as formatParentReportGrade } from "../../utils/parent-report-language/parent-report-display-labels.js";
import { normalizeParentFacing } from "../../utils/parent-report-language/parent-facing-normalize.js";
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
import { getTopicDisplayNameHe } from "../../utils/parent-report-insights/normalize-parent-facing-labels.js";

const APPROVED_SLUG = "lib__parent-ui__parent-report-approved-copy";
const TOPIC_SLUG = "utils__parent-report-insights__normalize-parent-facing-labels";

/** English topic chrome tokens → pack keys (display remapping for baked EN labels). */
const EN_TOPIC_NAME_TO_PACK = Object.freeze({
  vocabulary: "vocabulary",
  grammar: "grammar",
  "grammar basics": "grammar_basics",
  translation: "translation",
  writing: "writing",
  "reading comprehension": "reading_comprehension",
  matching: "matching",
  inference: "inference",
  addition: "addition",
  subtraction: "subtraction",
  multiplication: "multiplication",
  division: "division",
  fractions: "fractions",
  percentages: "percentages",
  rounding: "rounding",
  decimals: "decimals",
  sequences: "sequences",
  angles: "angles",
  shapes: "shapes",
  perimeter: "perimeter",
  area: "area",
  volume: "volume",
  circles: "circles",
  triangles: "triangles",
  symmetry: "symmetry",
  rotation: "rotation",
  heights: "heights",
});

/** @param {string} text */
function localizeBakedEnglishTopicChrome(text) {
  let t = String(text || "").trim();
  if (!t) return t;
  t = t.replace(/\s*[–·-]\s*Grade\s+(\d+)\b/gi, (_m, g) =>
    reportPackCopy(APPROVED_SLUG, "grade_suffix", { grade: g }),
  );
  t = t.replace(/\bGrade\s+(\d+)\b/gi, (_m, g) =>
    reportPackCopy(APPROVED_SLUG, "grade_word_n", { grade: g }),
  );
  const lower = t.toLowerCase();
  for (const [en, packKey] of Object.entries(EN_TOPIC_NAME_TO_PACK)) {
    if (lower === en || lower.startsWith(`${en} `) || lower.startsWith(`${en}-`) || lower.startsWith(`${en}–`)) {
      const ar = reportPackCopy(TOPIC_SLUG, packKey);
      if (ar && ar !== packKey) {
        t = t.replace(new RegExp(en, "i"), ar);
      }
      break;
    }
  }
  return t;
}

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
  const subjectId = String(row?.subjectId || row?.subject || "").trim().toLowerCase();
  const topicKey = String(row?.topicKey || row?.canonicalTopicKey || row?.bucketKey || "").trim();
  const fromKey = subjectId && topicKey ? getTopicDisplayNameHe(subjectId, topicKey.split("::")[0]) : "";
  let t = clean(fromKey || localizeBakedEnglishTopicChrome(label));
  if (!t) return "";
  const rel = resolveParentReportRowGradeRelation(row, registeredGradeKey);
  if (rel === "lower" || rel === "higher") {
    const grade = formatParentReportGrade(
      row?.contentGradeKey ?? row?.gradeKey ?? row?.contentGradeLevel ?? row?.grade,
    );
    if (grade && grade !== reportPackCopy(APPROVED_SLUG, "not_available")) {
      return `${t}${reportPackCopy(APPROVED_SLUG, "grade_suffix", { grade })}`;
    }
  }
  const reg = registeredGradeKey ? formatParentReportGrade(registeredGradeKey) : null;
  if (reg && reg !== reportPackCopy(APPROVED_SLUG, "not_available")) {
    const esc = reg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp(`\\s*[–·-]\\s*Grade\\s*${esc}\\s*$`, "iu"), "");
    t = t.replace(new RegExp(`\\s*Grade\\s*${esc}\\s*$`, "iu"), "");
    t = t.replace(new RegExp(`\\s*[–·-]\\s*الصف\\s*${esc}\\s*$`, "u"), "");
  }
  return clean(localizeBakedEnglishTopicChrome(t));
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
    return approved?.meaning
      ? `. ${approved.meaning}`
      : `. ${reportPackCopy("lib__parent-ui__parent-report-approved-copy", "some_mistakes_repeat_same_type")}`;
  });

  for (const re of REGULAR_REPORT_ENGINE_JARGON_RES) {
    t = t.replace(re, "");
  }

  t = t.replace(/\s{2,}/g, " ").replace(/\.\s*\./g, ".").trim();
  return clean(t);
}

function genericLowVolumeTopicCopy(title, q) {
  const topic = clean(title) || reportPackCopy("lib__parent-ui__parent-report-approved-copy", "this_topic");
  const slug = "lib__parent-ui__parent-report-approved-copy";
  return {
    title,
    whatWeSee:
      q > 0
        ? reportPackCopy(slug, "questions_answered", {
            q: String(q),
            questions: reportPackCopy(slug, q === 1 ? "question_singular" : "question_plural"),
          })
        : "",
    whatItMeans: reportPackCopy(slug, "there_are_only_a_few_questions_on_this_topic_so_it_is_still_early_to_dra"),
    homeAction: reportPackCopy(slug, "keep_practicing_a_few_more_short_questions_and_watch_for_whether_the_sam"),
    prominent: reportPackCopy(slug, "few_questions_in_topic_early", { topic }),
    strength: null,
    focusLine: reportPackCopy(slug, "there_are_only_a_few_questions_on_this_topic_so_it_is_still_early_to_dra"),
  };
}

function genericStableTopicCopy(title, q, acc) {
  const slug = "lib__parent-ui__parent-report-approved-copy";
  return {
    title,
    whatWeSee: reportPackCopy(slug, "questions_answered_with_accuracy", {
      q: String(q),
      questions: reportPackCopy(slug, q === 1 ? "question_singular" : "question_plural"),
      acc: String(acc),
    }),
    whatItMeans: reportPackCopy(slug, "most_answers_are_correct_and_this_topic_looks_relatively_stable"),
    homeAction: reportPackCopy(slug, "keep_up_the_success_with_a_short_practice_every_now_and_then"),
    prominent: null,
    strength: reportPackCopy(slug, "topic_stable_strength", {
      title,
      q: String(q),
      acc: String(acc),
    }),
    focusLine: null,
  };
}

/**
 * @param {string} topicTitle
 */
function genericParentCopyForPattern(topicTitle) {
  const topic =
    clean(topicTitle) || reportPackCopy("lib__parent-ui__parent-report-approved-copy", "this_topic");
  return {
    prominent: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "in_topic_same_mistake", { topic }),
    focusLine: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "the_same_type_of_mistake_keeps_showing_up"),
    meaning: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "same_mistake_meaning"),
    home: reportPackCopy("lib__parent-ui__parent-report-approved-copy", "pause_after_a_mistake_and_ask_the_child_to_explain_how_they_reached_the_"),
  };
}

/**
 * @param {string} patternRaw
 * @param {string} topicTitle
 */
function resolveApprovedCopy(patternRaw, topicTitle) {
  const slug = "lib__parent-ui__parent-report-approved-copy";
  const mapped = resolveParentFacingPatternLabel(patternRaw);
  const p = clean(mapped || patternRaw);
  const topic = clean(topicTitle) || reportPackCopy(slug, "this_topic");
  if (!p) return null;
  const pl = p.toLowerCase();
  const meaningFromEngine = parentFacingErrorPatternMeaning(patternRaw);
  if (meaningFromEngine) {
    const short = parentFacingErrorPatternLabel(patternRaw) || p;
    return {
      prominent: reportPackCopy(slug, "in_topic_recurring", {
        topic,
        pattern: short,
      }),
      focusLine: short,
      meaning: meaningFromEngine,
      home: reportPackCopy(slug, "pause_after_a_mistake_and_ask_the_child_to_explain_step_by_step_how_they"),
    };
  }

  if (/numerator only|compares by numerator/i.test(pl)) {
    return {
      prominent: reportPackCopy(slug, "fractions_numerator_only_prominent", { topic }),
      focusLine: reportPackCopy(slug, "fractions_numerator_only_focus"),
      meaning: reportPackCopy(slug, "fractions_numerator_only_meaning"),
      home: reportPackCopy(slug, "fractions_numerator_only_home"),
    };
  }

  if (/same wrong pairs|recurring wrong pairs/i.test(pl)) {
    return {
      prominent: reportPackCopy(slug, "wrong_pairs_prominent", { topic }),
      focusLine: reportPackCopy(slug, "wrong_pairs_focus"),
      meaning: reportPackCopy(slug, "wrong_pairs_meaning"),
      home: reportPackCopy(slug, "practice_the_specific_pairs_that_keep_coming_up_wrong_out_loud_and_as_a_"),
    };
  }

  if (/rounding direction|confusion (?:with|about) rounding/i.test(pl)) {
    return {
      prominent: reportPackCopy(slug, "rounding_prominent", { topic }),
      focusLine: reportPackCopy(slug, "rounding_focus"),
      meaning: reportPackCopy(slug, "rounding_meaning"),
      home: reportPackCopy(slug, "rounding_home"),
    };
  }

  if (/reverse operation|adds instead of subtracts/i.test(pl)) {
    return {
      prominent: reportPackCopy(slug, "reverse_op_prominent", { topic }),
      focusLine: reportPackCopy(slug, "reverse_op_focus"),
      meaning: reportPackCopy(slug, "reverse_op_meaning"),
      home: reportPackCopy(slug, "pause_before_solving_and_ask_should_the_result_be_bigger_or_smaller_than"),
    };
  }

  if (/partial comparison/i.test(pl)) {
    return {
      prominent: reportPackCopy(slug, "partial_comparison_prominent", { topic }),
      focusLine: reportPackCopy(slug, "partial_comparison_focus"),
      meaning: reportPackCopy(slug, "partial_comparison_meaning"),
      home: reportPackCopy(slug, "read_a_short_passage_together_and_pause_to_ask_where_in_the_text_did_you"),
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
  const slug = "lib__parent-ui__parent-report-approved-copy";
  if (q > 0 && acc < 72) {
    return reportPackCopy(slug, "recurring_mistakes_follow_method");
  }

  return reportPackCopy(slug, "no_clear_pattern_review_method");
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
    const slug = "lib__parent-ui__parent-report-approved-copy";
    return {
      title,
      whatWeSee:
        q > 0
          ? reportPackCopy(slug, "questions_answered_with_accuracy", {
              q: String(q),
              questions: reportPackCopy(slug, q === 1 ? "question_singular" : "question_plural"),
              acc: String(acc),
            })
          : "",
      whatItMeans: approved?.meaning || buildRegularReportTopicMeaning(row, title, pattern),
      homeAction:
        approved?.home ||
        reportPackCopy(slug, "practice_a_few_short_questions_and_ask_the_child_to_explain_the_method"),
      prominent: approved?.prominent || null,
      strength: null,
      focusLine: approved?.focusLine || approved?.meaning || null,
    };
  }

  if (q > 0 && acc < 72) {
    const slug = "lib__parent-ui__parent-report-approved-copy";
    return {
      title,
      whatWeSee: reportPackCopy(slug, "questions_answered_with_accuracy", {
        q: String(q),
        questions: reportPackCopy(slug, q === 1 ? "question_singular" : "question_plural"),
        acc: String(acc),
      }),
      whatItMeans: buildRegularReportTopicMeaning(row, title, ""),
      homeAction: reportPackCopy(slug, "practice_a_few_short_questions_and_ask_the_child_to_explain_the_method"),
      prominent: title ? reportPackCopy(slug, "in_topic_recurring_mistakes", { topic: title }) : null,
      strength: null,
      focusLine: title
        ? reportPackCopy(slug, "topic_recurring_mistakes_focus", { topic: title })
        : null,
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
