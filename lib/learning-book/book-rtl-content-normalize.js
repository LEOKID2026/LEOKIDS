/**
 * RTL-safe content normalization for Learning Book child-facing prose (source markdown).
 */

const HEBREW = /(?!)/;
const MATH_OP = /[+−\-=×÷]/;

/** @typedef {{ id: string, label: string, pattern: RegExp }} RiskPattern */
export const RTL_CONTENT_RISK_PATTERNS = [
  {
    id: "remainder_without_vav",
    label: "remainder_without_vav",
    pattern: /(?!)/,
  },
  {
    id: "verbal_formula_label",
    label: "verbal_formula_label",
    pattern: /(?!)/,
  },
  {
    id: "meaning_comma_hebrew",
    label: "meaning_comma_hebrew",
    pattern: /(?!)/,
  },
  {
    id: "hebrew_word_formula",
    label: "hebrew_word_formula",
    pattern:
      /(?!)/,
  },
  {
    id: "chained_comma_equation",
    label: "chained_comma_equation",
    pattern: /\d[\d]*,\s*[+−\-=×÷]/,
  },
  {
    id: "geometry_verbal_formula",
    label: "geometry_verbal_formula",
    pattern: /(?!)/,
  }];

/**
 * @param {string} line
 * @returns {string[]}
 */
export function auditLineRisks(line) {
  const input = String(line || "");
  if (!input.trim()) return [];
  if (input.startsWith("#") || input.startsWith("|") || input.startsWith("**Source")) {
    return [];
  }
  return RTL_CONTENT_RISK_PATTERNS.filter((p) => p.pattern.test(input)).map(
    (p) => p.id
  );
}

/**
 * @param {string} line
 */
export function fixRemainderPhrasing(line) {
  let out = String(line || "");
  out = out.replace(/(?!)/g, "$1 $2");
  return out;
}

/**
 * @param {string} line
 * @returns {string[]|null}
 */
export function normalizeFragileLine(line) {
  const input = String(line || "").trim();
  if (!input) return null;

  let fixed = fixRemainderPhrasing(input);

  if (/(?!)/.test(fixed)) {
    return ["1: .", "8 × 155 = 1,240"];
  }

  if (/(?!)/.test(fixed)) {
    return ["2: .", "1,247 − 1,240 = 7"];
  }

  if (/(?!)/.test(fixed)) {
    return [
      ": 10 6",
      "10 × 6 ÷ 2 = 30",
      "= 30 × 2 ÷ 10 = 6"];
  }

  if (/(?!)/.test(fixed)) {
    return ["( 10, 4):", "10 × 4 ÷ 2 = 20"];
  }

  if (/(?!)/.test(fixed)) {
    return ["1. ( 10, 4):", "10 × 4 ÷ 2 = 20"];
  }

  if (/(?!)/i.test(fixed)) {
    return [
      "",
      "8 × 155 + 7 = 1,247"];
  }

  if (/^1,247\s*=\s*8\s*×\s*155\s*\+\s*7/.test(fixed)) {
    return ["8 × 155 + 7 = 1,247"];
  }

  if (/(?!)/.test(fixed)) {
    return [
      "",
      "8 × 155 = 1,240",
      "7"];
  }

  if (/^6\s*×\s*87\s*=\s*522,\s*\+\s*1\s*=\s*523/.test(fixed.replace(/✓/, "").trim())) {
    const check = fixed.includes("✓") ? " ✓" : "";
    return [`6 × 87 = 522`, `522 + 1 = 523${check}`];
  }

  if (/(?!)/.test(fixed)) {
    return ["( 5):", "5 × 5 = 25"];
  }

  if (/(?!)/.test(fixed)) {
    return ["( 3, 4, 5):", "3 + 4 + 5 = 12"];
  }

  if (/(?!)/.test(fixed)) {
    return null;
  }

  if (/(?!)/.test(fixed)) {
    return [
      ": 60 \" 2",
      "60 × 2 = 120 \""];
  }

  if (fixed !== input) {
    return [fixed];
  }

  return null;
}

/**
 * @param {string} body markdown section body
 * @returns {{ lines: string[], changes: { before: string, after: string[] }[] }}
 */
export function normalizeSectionBodyLines(body) {
  const rawLines = String(body || "").split(/\r?\n/);
  /** @type {string[]} */
  const out = [];
  /** @type {{ before: string, after: string[] }[]} */
  const changes = [];

  for (const raw of rawLines) {
    const trimmed = raw.trimEnd();
    if (!trimmed.trim()) {
      out.push(trimmed);
      continue;
    }

    const replacement = normalizeFragileLine(trimmed);
    if (replacement) {
      changes.push({ before: trimmed, after: replacement });
      for (const line of replacement) {
        out.push(line);
      }
      continue;
    }

    out.push(fixRemainderPhrasing(trimmed));
  }

  return { lines: out, changes };
}

/**
 * @param {string} markdown full file
 * @returns {{ markdown: string, changes: { before: string, after: string[] }[], riskyBefore: number }}
 */
export function normalizeLearningBookMarkdown(markdown) {
  const input = String(markdown || "");
  const parts = input.split(/(?=^## \d+\. )/m);
  if (parts.length <= 1) {
    return { markdown: input, changes: [], riskyBefore: 0 };
  }

  let riskyBefore = 0;
  /** @type {{ before: string, after: string[] }[]} */
  const allChanges = [];
  /** @type {string[]} */
  const rebuilt = [parts[0]];

  for (let i = 1; i < parts.length; i += 1) {
    const part = parts[i];
    const headerEnd = part.indexOf("\n");
    const header = headerEnd >= 0 ? part.slice(0, headerEnd) : part;
    const body = headerEnd >= 0 ? part.slice(headerEnd + 1) : "";

    for (const line of body.split(/\r?\n/)) {
      if (auditLineRisks(line).length) riskyBefore += 1;
    }

    const { lines, changes } = normalizeSectionBodyLines(body);
    allChanges.push(...changes);
    rebuilt.push(`${header}\n${lines.join("\n")}`);
  }

  return {
    markdown: rebuilt.join(""),
    changes: allChanges,
    riskyBefore,
  };
}
