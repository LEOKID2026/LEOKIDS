/**
 * RTL-safe content normalization for Learning Book child-facing prose (source markdown).
 */

const HEBREW = /[\u0590-\u05FF]/;
const MATH_OP = /[+−\-=×÷]/;

/** @typedef {{ id: string, label: string, pattern: RegExp }} RiskPattern */
export const RTL_CONTENT_RISK_PATTERNS = [
  {
    id: "remainder_without_vav",
    label: "remainder_without_vav",
    pattern: /\d[\d,]*\s+שארית\s+\d/,
  },
  {
    id: "verbal_formula_label",
    label: "verbal_formula_label",
    pattern: /^נוסחה:\s*[\u0590-\u05FF].*[()=×÷]/,
  },
  {
    id: "meaning_comma_hebrew",
    label: "meaning_comma_hebrew",
    pattern: /=\s*\d{1,3}(?:,\d{3})+,\s*ו[\u0590-\u05FF]/,
  },
  {
    id: "hebrew_word_formula",
    label: "hebrew_word_formula",
    pattern:
      /^[^#\n]*[\u0590-\u05FF][^=\n]*=\s*\([^)]*[\u0590-\u05FF][^)]*[×÷][^)]*[\u0590-\u05FF]/,
  },
  {
    id: "chained_comma_equation",
    label: "chained_comma_equation",
    pattern: /\d[\d,]*,\s*[+−\-=×÷]/,
  },
  {
    id: "geometry_verbal_formula",
    label: "geometry_verbal_formula",
    pattern: /^נוסחה:\s*[\u0590-\u05FF]+\s*=\s*[\u0590-\u05FF]/,
  },
];

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
  out = out.replace(/(\d[\d,]*)\s+שארית\s+(\d+)/g, "$1 ושארית $2");
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

  if (/^שלב 1:\s*8\s*×\s*155\s*=\s*1,240/.test(fixed)) {
    return ["שלב 1: מחשבים כמה קרוב אפשר להגיע.", "8 × 155 = 1,240"];
  }

  if (/^שלב 2:\s*1,247\s*[−\-]\s*1,240\s*=\s*7/.test(fixed)) {
    return ["שלב 2: מחשבים מה נשאר.", "1,247 − 1,240 = 7"];
  }

  if (/^שטח\s*=\s*\(בסיס\s*×\s*גובה\)\s*÷\s*2\s*→\s*גובה\s*=/.test(fixed)) {
    return [
      "לדוגמה: משולש עם בסיס 10 וגובה 6",
      "10 × 6 ÷ 2 = 30",
      "גובה = 30 × 2 ÷ 10 = 6",
    ];
  }

  if (/^שטח משולש\s*=\s*\(בסיס\s*×\s*גובה\)\s*÷\s*2/.test(fixed)) {
    return ["לדוגמה (בסיס 10, גובה 4):", "10 × 4 ÷ 2 = 20"];
  }

  if (/^1\.\s*שטח בסיס משולש\s*=\s*\(בסיס\s*×\s*גובה משולש\)\s*÷\s*2/.test(fixed)) {
    return ["1. שטח בסיס (בסיס 10, גובה 4):", "10 × 4 ÷ 2 = 20"];
  }

  if (/^נוסחה:\s*מחולק\s*=\s*\(מחלק\s*×\s*מנה\)\s*\+\s*שארית/i.test(fixed)) {
    return [
      "בודקים: מכפילים את המנה במחלק, ואז מוסיפים את השארית.",
      "8 × 155 + 7 = 1,247",
    ];
  }

  if (/^1,247\s*=\s*8\s*×\s*155\s*\+\s*7/.test(fixed)) {
    return ["8 × 155 + 7 = 1,247"];
  }

  if (/^משמעות:\s*8\s*×\s*155\s*=\s*1,240,\s*ונשאר\s*7/.test(fixed)) {
    return [
      "בודקים: מכפילים את המנה במחלק, ואז מוסיפים את השארית.",
      "8 × 155 = 1,240",
      "נשאר 7",
    ];
  }

  if (/^6\s*×\s*87\s*=\s*522,\s*\+\s*1\s*=\s*523/.test(fixed.replace(/✓/, "").trim())) {
    const check = fixed.includes("✓") ? " ✓" : "";
    return [`6 × 87 = 522`, `522 + 1 = 523${check}`];
  }

  if (/^נוסחה:\s*שטח\s*=\s*צלע\s*×\s*צלע/.test(fixed)) {
    return ["לדוגמה (ריבוע עם צלע 5):", "5 × 5 = 25"];
  }

  if (/^נוסחה:\s*היקף\s*=\s*צלע1\s*\+\s*צלע2\s*\+\s*צלע3/.test(fixed)) {
    return ["לדוגמה (משולש 3, 4, 5):", "3 + 4 + 5 = 12"];
  }

  if (/^נוסחה:\s*$/.test(fixed)) {
    return null;
  }

  if (/^נוסחה:\s*מרחק\s*=\s*מהירות\s*×\s*זמן/.test(fixed)) {
    return [
      "לדוגמה: 60 קמ\"ש במשך 2 שעות",
      "60 × 2 = 120 ק\"מ",
    ];
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
