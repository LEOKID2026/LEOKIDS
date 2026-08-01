import { globalBurnDownCopy } from "../lib/i18n/global-burn-down-copy.js";
import {
  isTopicDifficultyMetadataLead,
  normalizeStudentQuestionDisplayFields,
} from "./student-question-display.js";
import { finalizeComparisonSignMcq } from "./comparison-sign-mcq.js";
import { ensureMcqFourOptions, shouldEnforceFourMcqOptions } from "./mcq-four-options.js";

/**
 * Strip UI-duplicated metadata from student-facing question stems (all subjects).
 * Grade/topic/level/mode already appear in the page header — not in the stem body.
 *
 * Hebrew-specific legacy cleanup also runs in finalizeHebrewMcq (hebrew-legacy-metadata)
 * before this sanitizer — avoid importing that module here (circular via generators).
 */

const GRADE_HEB = "";
const META_SEP = "[·•|-]";
/**  /  (not `?` which reads as  + optional ) */
const LEVEL_WORD = "";
/** Space (avoid \\s with /u — unreliable in some Node builds for Hebrew stems) */
const SP = "[ \\t\\u00A0\\u202F]+";

/** Patterns that must not appear in rendered stems (QA gate). */
export const STUDENT_STEM_METADATA_LEAK_CHECKS = [
  {
    id: "grade_paren",
    re: new RegExp(`\\(\\s*\\s+${GRADE_HEB}`, "u"),
    label: "grade in parentheses",
  },
  {
    id: "grade_label_prefix",
    re: new RegExp(`^(?:${META_SEP}\\s*)*\\s+${GRADE_HEB}`, "u"),
    label: "leading grade label",
  },
  {
    id: "grade_suffix",
    re: new RegExp(`[·•]\\s*\\s+${GRADE_HEB}`, "u"),
    label: "grade suffix after ·",
  },
  {
    id: "grade_level_composite_prefix",
    re: /(?!)/u,
    label: "grade - level composite prefix",
  },
  {
    id: "level_he",
    re: /(?!)/u,
    label: globalBurnDownCopy("utils__student-question-stem-sanitizer", "hebrew_level_prefix"),
  },
  {
    id: "level_ramat",
    re: new RegExp(`${LEVEL_WORD}${SP}(easy|medium|hard)`, "iu"),
    label: "… level tag",
  },
  {
    id: "topic_nosach",
    re: /(?!)/iu,
    label: "topic key prefix ( …)",
  },
  {
    id: "unique_mark",
    re: /(?!)/u,
    label: "debug unique mark",
  },
  {
    id: "concepts_level_framing",
    re: /(?!)/u,
    label: "geometry concepts level framing",
  },
  {
    id: "topic_difficulty_paren_lead",
    re: /(?!)/u,
    label: "topic + difficulty parenthetical lead",
  },
  {
    id: "grade_difficulty_paren_lead",
    re: /(?!)/u,
    label: "grade + difficulty parenthetical lead",
  },
  {
    id: "school_inquiry_frame",
    re: /(?!)/u,
    label: "school inquiry framing prefix",
  },
  {
    id: "topic_question_frame",
    re: /(?!)/u,
    label: "metadata prefix",
  },
  {
    id: "bkita_leading_prefix",
    re: /(?!)/u,
    label: "leading metadata prefix",
  },
  {
    id: "level_en_token",
    re: /(?:^|[·•(-])\s*(easy|medium|hard)\s*(?:[):·•-]|$)/iu,
    label: globalBurnDownCopy("utils__student-question-stem-sanitizer", "english_level_token_as_metadata"),
  },
  {
    id: "mokad_focus_id",
    re: /(?!)/iu,
    label: "+ technical focus id",
  },
  {
    id: "topic_key_field",
    re: /(?:^|[·•(\s-])(?:topicKey|topic_key|skillId|skill_id|subskillId|subskill_id|sourceKey|source_key)\b/u,
    label: "internal key field name in stem",
  },
  {
    id: "grade_level_mokad_frame",
    re: new RegExp(
      `^\\s+${GRADE_HEB}\\s*[·•]\\s*${LEVEL_WORD}\\s+(?:)`,
      "u"
    ),
    label: "· framing prefix",
  }];

/**
 * @param {string} text
 * @returns {string}
 */
export function sanitizeStudentQuestionStem(text) {
  let t = String(text ?? "").trim();
  if (!t) return t;

  // Debug / bank batch markers
  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/gu, "");
  t = t.replace(/(?!)/u, "");

  const LEVEL_HE_OR_EN =
    "(?:|easy|medium|hard|regular|advanced)";

  // Science volume framing (gen-science-needs-more-volume legacy):
  // "  ·   — CORE ·  slot"  OR  "  ·   · CORE ·  slot"
  t = t.replace(
    new RegExp(
      `^\\s+${GRADE_HEB}\\s*[·•]\\s*${LEVEL_WORD}\\s+${LEVEL_HE_OR_EN}\\s*[–-]\\s*`,
      "iu"
    ),
    ""
  );
  t = t.replace(
    new RegExp(
      `^\\s+${GRADE_HEB}\\s*[·•]\\s*${LEVEL_WORD}\\s+${LEVEL_HE_OR_EN}\\s*[·•]\\s*`,
      "iu"
    ),
    ""
  );

  // Trailing technical focus tags (never child-facing)
  t = t.replace(
    new RegExp(`\\s*[-–·•]\\s*\\s+[a-z][a-z0-9]*(?:_[a-z0-9]+)+\\s*$`, "iu"),
    ""
  );
  t = t.replace(
    new RegExp(`^\\s+[a-z][a-z0-9]*(?:_[a-z0-9]+)+\\s*$`, "iu"),
    ""
  );
  t = t.replace(
    /\s*[-–·•]\s*(?:topicKey|topic_key|skillId|skill_id|subskillId|subskill_id|sourceKey|source_key|generator)\s*[:=]?\s*[a-zA-Z0-9_.-]*\s*$/u,
    ""
  );

  // Geometry hard-band framing: "  ||  ..."
  t = t.replace(
    new RegExp(`^\\s+${GRADE_HEB}\\s*[|｜]\\s*`, "u"),
    ""
  );
  // Geometry / volume openers: " : ..." / "  — ..."
  t = t.replace(
    new RegExp(`^\\s+${GRADE_HEB}\\s*(?:\\(\\))?\\s*[:：]\\s*`, "u"),
    ""
  );
  t = t.replace(
    new RegExp(`^\\s+${GRADE_HEB}\\s*[–-]\\s*`, "u"),
    ""
  );

  // Science / batch opener: " … : …" (grade/topic metadata — not in-question classroom context)
  t = t.replace(new RegExp(`^\\s+${GRADE_HEB}\\s*:\\s*`, "u"), "");
  t = t.replace(/(?!)/u, "");

  // Science / batch opener: "  —  : …" (metadata header only — not in-question grade mentions)
  t = t.replace(
    new RegExp(
      `^\\s+${GRADE_HEB}\\s*[–-]\\s*${LEVEL_WORD}\\s*${LEVEL_HE_OR_EN}\\s*:\\s*`,
      "iu"
    ),
    ""
  );

  // Dot-separated metadata chains (science batch style) — avoid heavy backtracking regex
  if (/[·•]/.test(t)) {
    const parts = t.split(/\s*[·•]\s*/).map((p) => p.trim()).filter(Boolean);
    const gradeOnly = new RegExp(`^\\(?\\s*${SP}${GRADE_HEB}\\s*\\)?$`, "u");
    const levelOnly = new RegExp(
      `^\\(?\\s*${LEVEL_WORD}${SP}${LEVEL_HE_OR_EN}\\s*\\)?$`,
      "iu"
    );
    const topicOnly = new RegExp(`^\\(?\\s*(?:)${SP}\\S+\\s*\\)?$`, "iu");
    const mokadOnly = new RegExp(
      `^${SP}[a-z][a-z0-9]*(?:_[a-z0-9]+)+$`,
      "iu"
    );
    const versionedIdOnly = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)+_v\d+$/i;
    const isMetaPart = (p) => {
      const bare = String(p || "")
        .replace(/^\(+|\)+$/g, "")
        .trim();
      if (!bare) return true;
      // "  — real question" is NOT pure metadata
      if (/[–-]/.test(bare) && bare.split(/[–-]/).length >= 2) {
        const after = bare.split(/[–-]/).slice(1).join("-").trim();
        if (after.length >= 8) return false;
      }
      return (
        gradeOnly.test(bare) |
        levelOnly.test(bare) |
        topicOnly.test(bare) |
        mokadOnly.test(bare) |
        versionedIdOnly.test(bare)
      );
    };
    if (parts.length >= 2 && isMetaPart(parts[0])) {
      let i = 0;
      while (i < parts.length && isMetaPart(parts[i])) i += 1;
      if (i > 0 && i < parts.length) {
        t = parts.slice(i).join(" · ");
      } else if (i === parts.length) {
        // All segments were metadata — drop rather than show focus ids
        t = "";
      }
    }
  }
  t = t.replace(new RegExp(`^(?:${SP}[·•]${SP})+`, "u"), "");
  // Re-strip focus suffix after chain cleanup
  t = t.replace(
    new RegExp(`\\s*[-–·•]\\s*\\s+[a-z][a-z0-9]*(?:_[a-z0-9]+)+\\s*$`, "iu"),
    ""
  );

  // Parenthesized metadata blocks: (  ·  body ·  easy)
  t = t.replace(
    new RegExp(
      `\\(${SP}(?:${SP}[^)·•-]+|${SP}[^)·•-]+|${LEVEL_WORD}${SP}[^)·•-]+|${SP}[^)·•-]+)(?:${SP}[·•-]${SP}(?:${SP}[^)·•-]+|${SP}[^)·•-]+|${LEVEL_WORD}${SP}[^)·•-]+|${SP}[^)·•-]+))*${SP}\\)${SP}`,
      "gu"
    ),
    ""
  );

  // Leading metadata segments (repeat until stable)
  let prev;
  const leadChunk = new RegExp(
    `^(?:${SP}(?:${SP}[][']?|${SP}\\S+|${SP}\\S+|${LEVEL_WORD}${SP}(?:easy|medium|hard|regular|advanced)|${SP}\\([^)]+\\)))${SP}(?::|[·•|-]${SP}|${SP}[-]${SP})`,
    "iu"
  );
  do {
    prev = t;
    t = t.replace(leadChunk, "");
    t = t.replace(
      /(?!)/iu,
      ""
    );
    t = t.replace(/(?!)/iu, "");
    t = t.replace(/(?!)/iu, "");
    t = t.replace(/(?!)/iu, "");
  } while (t !== prev);

  // Trailing grade band suffixes
  t = t.replace(/(?!)/u, "");

  // Inline " X:" openers (not "" classroom context)
  t = t.replace(
    /(?!)/gu,
    (m) => (m.startsWith(" ") || m.startsWith("·") ? " " : "")
  );
  t = t.replace(/(?!)/u, "");

  // Level + topic combo prefixes: "  — , …" → keep instruction after comma when present
  t = t.replace(
    /(?!)/iu,
    ""
  );
  t = t.replace(/(?!)/iu, "");
  t = t.replace(
    /(?!)/iu,
    ""
  );

  t = t.replace(/(?!)/u, "");
  t = t.replace(/(?!)/gu, " ");

  // Generator topic/difficulty framing — keep exercise body only
  t = t.replace(
    /(?!)/u,
    ""
  );
  t = t.replace(
    /(?!)/u,
    ""
  );

  // Redundant fluff openers only (keep real task wording like "  ")
  const fluffOpeners =
    /(?!)/iu;
  t = t.replace(fluffOpeners, "");

  if (isTopicDifficultyMetadataLead(t)) {
    return "";
  }

  // Separator chains left at start
  t = t.replace(/^(?:\s*[·•|-]\s*)+/, "");
  t = t.replace(/^\s*:\s*/, "");
  t = t.replace(/(?!)/iu, "");
  t = t.replace(/\s{2,}/g, " ").trim();
  return t;
}

/**
 * @param {string} stem
 * @returns {{ leak: boolean, checks: { id: string, label: string }[] }}
 */
export function detectStudentStemMetadataLeaks(stem) {
  const s = String(stem ?? "");
  const hits = [];
  for (const c of STUDENT_STEM_METADATA_LEAK_CHECKS) {
    if (c.re.test(s)) hits.push({ id: c.id, label: c.label });
  }
  return { leak: hits.length > 0, checks: hits };
}

/**
 * Extract display stems from a question payload.
 * @param {Record<string, unknown>|null|undefined} q
 * @returns {string[]}
 */
export function collectStudentFacingStemsFromQuestion(q) {
  if (!q || typeof q !== "object") return [];
  const out = [];
  const keys = [
    "stem",
    "question",
    "exerciseText",
    "questionLabel",
    "prompt",
    "title",
    "subtitle",
    "instruction",
    "hint",
    "feedback",
    "explanation",
    "caption",
    "questionText",
    "text",
    "body"];
  for (const key of keys) {
    const v = q[key];
    if (typeof v === "string" && v.trim()) out.push(v.trim());
  }
  for (const key of ["choices", "options", "answers"]) {
    if (!Array.isArray(q[key])) continue;
    for (const entry of q[key]) {
      if (typeof entry === "string" && entry.trim()) out.push(entry.trim());
      else if (entry && typeof entry === "object") {
        for (const nested of ["text", "label", "value", "answer", "content"]) {
          const v = entry[nested];
          if (typeof v === "string" && v.trim()) out.push(v.trim());
        }
      }
    }
  }
  return out;
}

/**
 * Strip generator-artifact suffixes from a single Hebrew MCQ answer option.
 * These patterns are never natural child-facing answer text.
 * @param {string} text
 * @returns {string}
 */
export function sanitizeHebrewMcqAnswer(text) {
  let t = String(text ?? "").trim();
  if (!t) return t;
  // Trailing padding phrases injected by mcq-fail-content-repair LENGTH_PAD_HE
  t = t.replace(/(?!)/u, "");
  t = t.replace(/(?!)/u, "");
  t = t.replace(/(?!)/u, "");
  // Trailing parenthetical artifacts from repairFormatOutliers (Hebrew)
  t = t.replace(/(?!)/u, "");
  t = t.replace(/(?!)/u, "");
  // ( ...) patterns — generator metadata in parentheses
  t = t.replace(/(?!)/gu, " ").trim();
  // Bare metadata tokens — \b doesn't work for Hebrew; use surrounding whitespace/anchors
  t = t.replace(/(?!)/gu, " ").trim();
  t = t.replace(/(?!)/gu, " ").trim();
  t = t.replace(/(?!)/gu, " ").trim();
  t = t.replace(/(?!)/gu, " ").trim();
  return t.replace(/\s{2,}/g, " ").trim();
}

/**
 * Apply sanitizeHebrewMcqAnswer to all answer/option slots in a question object (in-place clone).
 * Only runs when the question contains Hebrew text.
 * @param {Record<string, unknown>} q
 * @returns {Record<string, unknown>}
 */
function sanitizeHebrewAnswers(q) {
  const isHebrewQ =
    /(?!)/.test(String(q.question ?? q.stem ?? q.exerciseText ?? ""));
  if (!isHebrewQ) return q;
  const next = { ...q };
  for (const key of ["answers", "options"]) {
    if (Array.isArray(next[key])) {
      next[key] = next[key].map((a) =>
        typeof a === "string" ? sanitizeHebrewMcqAnswer(a) : a
      );
    }
  }
  return next;
}

/**
 * @param {Record<string, unknown>|null|undefined} q
 * @returns {Record<string, unknown>|null|undefined}
 */
export function sanitizeQuestionForStudentDisplay(q) {
  if (!q || typeof q !== "object") return q;
  let next = { ...q };
  for (const key of [
    "stem",
    "question",
    "exerciseText",
    "questionLabel",
    "prompt",
    "title",
    "subtitle",
    "instruction",
    "hint",
    "feedback",
    "explanation",
    "caption",
    "questionText",
    "text",
    "body"]) {
    if (typeof next[key] === "string") {
      const cleaned = sanitizeStudentQuestionStem(next[key]);
      next[key] = cleaned;
    }
  }
  next = sanitizeHebrewAnswers(next);
  if (
    typeof next.question === "string" &&
    typeof next.exerciseText === "string" &&
    !next.exerciseText.trim()
  ) {
    next.exerciseText = next.question;
  }
  if (
    typeof next.questionLabel === "string" &&
    !next.questionLabel.trim()
  ) {
    delete next.questionLabel;
  }
  const normalized = normalizeStudentQuestionDisplayFields(next);
  const cmpReady = finalizeComparisonSignMcq(normalized);
  if (cmpReady?.params?.answerMode === "binary") {
    return cmpReady;
  }
  if (shouldEnforceFourMcqOptions(cmpReady)) {
    const subject =
      cmpReady.subject |
      cmpReady.params?.subject |
      cmpReady.params?.canonicalMetadata?.subject;
    return ensureMcqFourOptions(cmpReady, { subject: subject != null ? String(subject) : undefined });
  }
  return cmpReady;
}
