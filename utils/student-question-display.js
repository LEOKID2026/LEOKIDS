/**
 * Split and format student-facing question text for readable display
 * (instruction line vs equation/formula body, LTR isolation).
 */

import { globalBurnDownCopy } from "../lib/i18n/global-burn-down-copy.js";
import { COMPARISON_SIGN_LRM } from "./comparison-sign-mcq.js";

const BLANK = /_{2,}|\?\?|…/;

const KNOWN_INSTRUCTION_LEADS = [
  /(?!)/u,
  /(?!)/iu,
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
  /^Choose\b/iu];

/** @param {string} s */
export function isEquationLikeText(s) {
  const t = String(s ?? "").trim();
  if (!t) return false;
  if (
    /(?!)/u.test(
      t
    )
  ) {
    return false;
  }
  const hebrewChars = (t.match(/(?!)/g) || []).length;
  if (hebrewChars >= 10 && hebrewChars / Math.max(t.length, 1) > 0.3) {
    return false;
  }
  if (BLANK.test(t)) return true;
  if (/=\s*[\d(]|[\d)]\s*=/.test(t)) return true;
  if (/[0-9]/.test(t) && /[+\-×÷*/()]/.test(t)) return true;
  if (/^[\d\s+\-×÷*/()._=?:…]+$/.test(t.replace(BLANK, ""))) return true;
  return false;
}

/** @param {string} s */
export function isFormulaLikeText(s) {
  const t = String(s ?? "").trim();
  if (!t) return false;
  if (/(?!)/u.test(t)) return true;
  if (/[×÷]/.test(t) && /(?!)/.test(t)) return true;
  return isEquationLikeText(t);
}

/**
 * Collapse whitespace and normalize operator spacing for compact exercise lines.
 * @param {string} text
 */
export function formatCompactExpression(text) {
  let t = String(text ?? "")
    .replace(/\u2066|\u2067|\u2068|\u2069/gu, "")
    .trim();
  if (!t) return t;
  t = t.replace(/\s+/g, " ");
  t = t.replace(/\s*([+\-×÷*/=()])\s*/g, " $1 ");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

const DIFFICULTY_IN_PAREN = /(?!)/u;

/**
 * Generator topic/difficulty framing (not child-facing instruction).
 * @param {string} lead
 */
export function isTopicDifficultyMetadataLead(lead) {
  const raw = String(lead ?? "").trim();
  if (!raw) return false;
  const t = raw.replace(/:\s*$/, "").trim();
  if (!t) return false;

  if (isKnownInstructionLead(t)) return false;
  if (/^Choose\b|^What\b|^Read\b|^Select\b|^Complete\b|^Fill\b|^Which\b/i.test(t)) {
    return false;
  }

  if (
    /(?!)/u.test(t)
  ) {
    return true;
  }

  if (DIFFICULTY_IN_PAREN.test(t) && t.length <= 72) {
    return true;
  }

  return false;
}

/** @param {string} lead @param {string} body */
export function shouldOmitInstructionLead(lead, body) {
  const leadT = String(lead ?? "")
    .trim()
    .replace(/:$/, "");
  const bodyT = formatCompactExpression(body);
  if (!leadT || !bodyT) return true;
  if (isTopicDifficultyMetadataLead(leadT)) return true;
  if (/^Choose\b|^What\b|^Read\b|^Select\b|^Complete\b|^Fill in\b|^Which\b/i.test(leadT)) {
    return false;
  }
  if (!isKnownInstructionLead(leadT)) return false;
  if (isEquationLikeText(bodyT) && bodyT.length <= 56) return true;
  if (
    isFormulaLikeText(bodyT) &&
    /(?!)/.test(bodyT) &&
    bodyT.length <= 40
  ) {
    return true;
  }
  return false;
}

/** Child-friendly geometry question wording (display + generator post-process). */
/**
 * Strip trailing geometry formula-help parentheticals from child-facing stems.
 * Matches the same formula phrases that formatFormulaSpacing / child-friendly
 * rewrites already treat as presentation (not part of the question task).
 * Does not strip arbitrary parentheses.
 * @param {string} text
 * @returns {string}
 */
export function stripGeometryFormulaHelpParenthetical(text) {
  let t = String(text ?? "");
  if (!t.trim()) return t;
  const mul = "[×xX]";
  const formulas = [
    `\\s+\\s*${mul}\\s*`,
    `\\s*${mul}\\s*\\s*${mul}\\s*`,
    `\\s*${mul}\\s*`,
    `\\s*${mul}\\s*`,
    `\\s*${mul}\\s*`].join("|");
  t = t.replace(new RegExp(`\\s*\\(\\s*(?:${formulas})\\s*\\)\\s*$`, "u"), "");
  return t;
}

export function formatGeometryChildFriendlyQuestion(text) {
  let t = String(text ?? "");
  if (!t.trim()) return t;

  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/gu, "");
  t = t.replace(
    /(?!)/gu,
    "$1 $2"
  );
  t = t.replace(
    /(?!)/gu,
    "$1 $2 . ?"
  );
  t = t.replace(
    /(?!)/gu,
    "$1 $2 -"
  );
  t = t.replace(
    /(?!)/gu,
    "$1 $2 . ?"
  );
  t = stripGeometryFormulaHelpParenthetical(t);
  return t.replace(/\s{2,}/g, " ").trim();
}

/** @param {string} lead */
function isKnownInstructionLead(lead) {
  const t = String(lead ?? "").trim().replace(/:$/, "");
  if (!t) return false;
  if (KNOWN_INSTRUCTION_LEADS.some((re) => re.test(t))) return true;
  if (t.length <= 42 && /(?!)/u.test(t)) {
    return !isEquationLikeText(t) && !isFormulaLikeText(t);
  }
  return false;
}

/** Reading / instruction prefix for verbal question hierarchy (with or without trailing colon). */
export function isLikelyVerbalInstruction(lead) {
  const t = String(lead ?? "")
    .trim()
    .replace(/:$/, "");
  if (!t) return false;
  if (isKnownInstructionLead(t)) return true;
  if (
    /(?!)/u.test(
      t
    )
  ) {
    return true;
  }
  if (
    /(?!)/u.test(t) |
    /^(?:Look|Read|Listen|Watch|Choose|Select|Complete|Fill)\b/iu.test(t)
  ) {
    return !isEquationLikeText(t) && !isFormulaLikeText(t);
  }
  if (
    t.length <= 56 &&
    /(?!)/iu.test(
      t
    )
  ) {
    return !isEquationLikeText(t) && !isFormulaLikeText(t);
  }
  return false;
}

/**
 * Add readable spaces around × ÷ in Hebrew formula strings.
 * @param {string} text
 * @returns {string}
 */
export function formatFormulaSpacing(text) {
  let t = formatGeometryChildFriendlyQuestion(String(text ?? ""));
  if (!t) return t;

  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/gu, "");

  t = t.replace(/(?!)/gu, "$1 $2 $3");
  t = t.replace(/(?!)/gu, "$1 $2 $3");
  t = t.replace(/(?!)/gu, "$1 $2 $3");

  t = t.replace(/(?!)/gu, "$1$2");
  t = t.replace(/(?!)/gu, "= ");
  t = t.replace(
    /(\d+(?:[.]\d+)?)\s*([<>=])\s*(\d+(?:[.]\d+)?)/g,
    (_, left, sign, right) =>
      `${left} ${COMPARISON_SIGN_LRM}${sign}${COMPARISON_SIGN_LRM} ${right}`
  );
  t = t.replace(/\s{2,}/g, " ");
  return t.trim();
}

/**
 * Normalize percent / mixed stems that start with LTR junk before Hebrew text.
 * @param {string} raw
 */
function splitHebrewQuestionWithEquationTail(raw) {
  const t = String(raw ?? "").trim();
  if (!t || !/(?!)/.test(t)) return null;

  const leadingJunk = t.match(/(?!)/u);
  const normalized = leadingJunk?.[1]?.trim() || t;

  const trailingBlank = normalized.match(/(?!)/u);
  if (trailingBlank?.[1] && trailingBlank?.[2]) {
    return {
      leadText: trailingBlank[1].replace(/\?\s*$/, "").trim(),
      bodyText: formatCompactExpression(trailingBlank[2].trim()),
      bodyKind: "equation",
    };
  }

  if (leadingJunk?.[1]) {
    return {
      leadText: normalized.replace(/\?\s*$/, "").trim(),
      bodyText: "",
      bodyKind: "text",
    };
  }

  return null;
}

/**
 * Split context + instruction sentences for long Hebrew geometry prompts.
 * @param {string} raw
 */
function splitInstructionAfterContextSentence(raw) {
  const t = String(raw ?? "").trim();
  const match = t.match(/(?!)/u);
  if (!match?.[2]) return null;
  const instruction = match[2].trim().replace(/\.$/, "");
  if (!isKnownInstructionLead(instruction)) return null;
  return {
    leadText: match[2].trim().endsWith(".") ? match[2].trim() : `${match[2].trim()}.`,
    bodyText: formatCompactExpression(formatFormulaSpacing(match[1].trim())),
    bodyKind: "text",
  };
}

/**
 * @param {string} text
 * @returns {{ leadText: string, bodyText: string, bodyKind: "text" || "equation" || "mixed" }}
 */
export function splitStudentQuestionForDisplay(text) {
  const raw = String(text ?? "").trim();
  if (!raw) {
    return { leadText: "", bodyText: "", bodyKind: "text" };
  }

  const hebrewEq = splitHebrewQuestionWithEquationTail(raw);
  if (hebrewEq) return hebrewEq;

  const instructionSplit = splitInstructionAfterContextSentence(raw);
  if (instructionSplit) return instructionSplit;

  const colonIdx = raw.indexOf(":");
  if (colonIdx > 0 && colonIdx < 72) {
    const lead = raw.slice(0, colonIdx).trim();
    const body = raw.slice(colonIdx + 1).trim();
    if (
      body &&
      (isKnownInstructionLead(lead) |
        (lead.length <= 56 && (isEquationLikeText(body) || isFormulaLikeText(body))))
    ) {
      const bodyText = formatCompactExpression(formatFormulaSpacing(body));
      const leadText = `${lead}:`;
      const bodyKind =
        isEquationLikeText(bodyText) ? "equation" : isFormulaLikeText(bodyText) ? "mixed" : "text";
      if (shouldOmitInstructionLead(leadText, bodyText)) {
        return { leadText: "", bodyText, bodyKind };
      }
      return { leadText, bodyText, bodyKind };
    }
  }

  const formulaInSentence = raw.match(/(?!)/u);
  if (formulaInSentence) {
    const lead = formulaInSentence[1].trim();
    const body = formulaInSentence[2].trim();
    if (isFormulaLikeText(body) && lead.length <= 80) {
      return {
        leadText: lead.endsWith(":") ? lead : `${lead}:`,
        bodyText: formatFormulaSpacing(body),
        bodyKind: "mixed",
      };
    }
  }

  const formatted = formatCompactExpression(formatFormulaSpacing(raw));
  const bodyKind = isEquationLikeText(formatted)
    ? "equation"
    : isFormulaLikeText(formatted)
      ? "mixed"
      : "text";

  return { leadText: "", bodyText: formatted, bodyKind };
}

/**
 * Resolve lead/body from question payload fields.
 * @param {{ question?: string, questionLabel?: string, exerciseText?: string } || null || undefined}
 */
export function resolveStudentQuestionDisplayParts(q) {
  if (!q || typeof q !== "object") {
    return { leadText: "", bodyText: "", bodyKind: "text" };
  }

  const label = typeof q.questionLabel === "string" ? q.questionLabel.trim() : "";
  const exercise = typeof q.exerciseText === "string" ? q.exerciseText.trim() : "";
  const question = typeof q.question === "string" ? q.question.trim() : "";

  if (label && exercise) {
    const bodyText = formatCompactExpression(formatFormulaSpacing(exercise));
    const leadText = label.endsWith(":") ? label : `${label}:`;
    if (shouldOmitInstructionLead(leadText, bodyText)) {
      return {
        leadText: "",
        bodyText,
        bodyKind: isEquationLikeText(bodyText)
          ? "equation"
          : isFormulaLikeText(bodyText)
            ? "mixed"
            : "text",
      };
    }
    return {
      leadText,
      bodyText,
      bodyKind: isEquationLikeText(bodyText)
        ? "equation"
        : isFormulaLikeText(bodyText)
          ? "mixed"
          : "text",
    };
  }

  if (label && !exercise && question) {
    const split = splitStudentQuestionForDisplay(question);
    if (split.bodyText) {
      const leadText = label.endsWith(":") ? label : `${label}:`;
      if (shouldOmitInstructionLead(leadText, split.bodyText)) {
        return { leadText: "", bodyText: split.bodyText, bodyKind: split.bodyKind };
      }
      return {
        leadText,
        bodyText: split.bodyText,
        bodyKind: split.bodyKind,
      };
    }
  }

  const combined = exercise || question;
  if (!label && combined) {
    const split = splitStudentQuestionForDisplay(combined);
    if (split.leadText) return split;
    return {
      leadText: "",
      bodyText: split.bodyText || formatFormulaSpacing(combined),
      bodyKind: split.bodyKind,
    };
  }

  if (label && !exercise && !question) {
    return { leadText: label, bodyText: "", bodyKind: "text" };
  }

  return { leadText: "", bodyText: formatFormulaSpacing(question), bodyKind: "text" };
}

/**
 * Split combined stems into questionLabel + exerciseText for generators/sanitizer.
 * @param {Record<string, unknown>|null|undefined} q
 */
const MATH_EQUATION_LABELS = {
  g1: globalBurnDownCopy("utils__student-question-display", "short_equation_puzzle"),
  g2: globalBurnDownCopy("utils__student-question-display", "complete_the_missing_part_of_the_equation"),
  g3: globalBurnDownCopy("utils__student-question-display", "find_the_unknown"),
  g4: globalBurnDownCopy("utils__student-question-display", "find_the_unknown"),
  g5: globalBurnDownCopy("utils__student-question-display", "find_the_unknown"),
  g6: globalBurnDownCopy("utils__student-question-display", "find_x"),
};

/**
 * @param {Record<string, unknown>} q
 * @param {string} gradeKey
 */
export function attachMathEquationInstructionLabel(q, gradeKey) {
  if (!q || typeof q !== "object") return q;
  const op = String(q.operation || q.params?.kind || "");
  const kind = String(q.params?.kind || "");
  const isEq =
    op === "equations" |
    /^eq_/.test(kind) |
    /^order_/.test(kind) |
    op === "order_of_operations";
  if (!isEq) return q;

  const exercise =
    (typeof q.exerciseText === "string" && q.exerciseText.trim()) |
    (typeof q.params?.exerciseText === "string" && q.params.exerciseText.trim()) |
    "";
  const question = typeof q.question === "string" ? q.question.trim() : "";
  const body = exercise || question;
  if (!body || !isEquationLikeText(body)) return q;
  if (typeof q.questionLabel === "string" && q.questionLabel.trim()) {
    const existing = q.questionLabel.trim();
    if (shouldOmitInstructionLead(existing, body)) {
      const next = { ...q };
      delete next.questionLabel;
      return next;
    }
    return q;
  }

  const proposed = MATH_EQUATION_LABELS[gradeKey] || "Complete the equation:";
  if (shouldOmitInstructionLead(proposed, body)) return q;

  return {
    ...q,
    questionLabel: proposed,
  };
}

export function normalizeStudentQuestionDisplayFields(q) {
  if (!q || typeof q !== "object") return q;
  const next = { ...q };

  if (
    typeof next.stem === "string" &&
    next.stem.trim() &&
    !(typeof next.question === "string" && next.question.trim())
  ) {
    next.question = next.stem.trim();
  }

  const label =
    typeof next.questionLabel === "string" ? next.questionLabel.trim() : "";
  let exercise =
    typeof next.exerciseText === "string" ? next.exerciseText.trim() : "";
  const question =
    typeof next.question === "string" ? next.question.trim() : "";

  if (
    label &&
    /^\d+$/.test(label) &&
    typeof next.stem === "string" &&
    next.stem.trim()
  ) {
    delete next.questionLabel;
  }

  if (label && exercise) {
    const bodyText = formatCompactExpression(formatFormulaSpacing(exercise));
    const leadText = label.endsWith(":") ? label : `${label}:`;
    if (!shouldOmitInstructionLead(leadText, bodyText)) {
      next.questionLabel = leadText;
    } else {
      delete next.questionLabel;
    }
    next.exerciseText = bodyText;
    next.question = bodyText;
    return next;
  }

  const source = exercise || question;
  if (!source) return next;

  const split = splitStudentQuestionForDisplay(source);
  if (split.leadText && split.bodyText) {
    if (!label && !shouldOmitInstructionLead(split.leadText, split.bodyText)) {
      next.questionLabel = split.leadText;
    }
    next.exerciseText = formatCompactExpression(split.bodyText);
    next.question = next.exerciseText;
    return next;
  }

  if (isEquationLikeText(source) || isFormulaLikeText(source)) {
    next.exerciseText = formatCompactExpression(formatFormulaSpacing(source));
    if (!label && split.leadText && !shouldOmitInstructionLead(split.leadText, next.exerciseText)) {
      next.questionLabel = split.leadText;
    }
    return next;
  }

  if (exercise) next.exerciseText = formatFormulaSpacing(exercise);
  if (question) next.question = formatFormulaSpacing(question);
  return next;
}
