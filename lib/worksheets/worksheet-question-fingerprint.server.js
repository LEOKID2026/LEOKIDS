/**
 * Question-level fingerprints for worksheet dedup (not payload/session fingerprint).
 * Distinct from lib/worksheets/worksheet-fingerprint.js.
 * @module lib/worksheets/worksheet-question-fingerprint.server
 */

/**
 * Normalize stem for comparison (whitespace / punctuation noise).
 * @param {unknown} text
 * @returns {string}
 */
function normalizeStem(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[_\s]*=[_\s]*/g, "=")
    .replace(/\s*\+\s*/g, "+")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s*×\s*/g, "x")
    .replace(/\s*÷\s*/g, "/");
}

/**
 * Structural operand signature (order-preserving).
 * @param {Record<string, unknown>} item
 * @returns {string}
 */
function mathOperandSignature(item) {
  const kind = String(item.params?.kind || "");
  const a = item.a ?? item.params?.a;
  const b = item.b ?? item.params?.b;
  const c = item.params?.c;
  const d = item.params?.d;
  const ops = Array.isArray(item.params?.operands)
    ? item.params.operands.map(String).join(",")
    : "";
  return `${kind}|${a ?? ""}|${b ?? ""}|${c ?? ""}|${d ?? ""}|${ops}`;
}

/**
 * Primary question fingerprint.
 * @param {Record<string, unknown>} item
 * @param {string} subjectId
 * @returns {string}
 */
export function worksheetQuestionFingerprint(item, subjectId) {
  const sub = String(subjectId || item.subject || "").toLowerCase();
  const stem = normalizeStem(
    item.question || item.prompt || item.questionLabel || item.exerciseText || ""
  );
  const answer = String(item.correctAnswer ?? "");

  if (sub === "english") {
    const phonics = String(item.params?.phonicsStimulus || item.exerciseText || "");
    const pf = String(item.params?.patternFamily || item.params?.subtype || "");
    return `english|${item.topic || item.operation}|${pf}|${stem}|${normalizeStem(phonics)}|${answer}`;
  }
  if (sub === "geometry") {
    const p = item.params && typeof item.params === "object" ? item.params : {};
    return [
      "geometry",
      item.topic || item.operation,
      p.kind || "",
      p.subtype || "",
      p.type || "",
      p.patternFamily || "",
      p.diagramVariant ?? "",
      p.poolRowId || "",
      stem,
      answer,
      item.answerMode || p.answerMode || "",
    ].join("|");
  }
  if (sub === "math") {
    return `math|${item.topic || item.operation}|${mathOperandSignature(item)}|${stem}|${answer}`;
  }
  return `${sub}|${stem}|${answer}`;
}

/**
 * Extra fingerprints that catch near-duplicates beyond full-string equality.
 * @param {Record<string, unknown>} item
 * @param {string} subjectId
 * @returns {string[]}
 */
export function worksheetQuestionFingerprintAliases(item, subjectId) {
  const sub = String(subjectId || item.subject || "").toLowerCase();
  const primary = worksheetQuestionFingerprint(item, sub);
  /** @type {string[]} */
  const aliases = [primary];

  if (sub === "math") {
    const opsSig = mathOperandSignature(item);
    // Only alias on operands when concrete values exist (avoid collapsing kind-only items).
    if (/\|[^|]+/.test(opsSig.replace(/^[^|]+\|/, ""))) {
      aliases.push(`math-ops|${item.topic || item.operation}|${opsSig}`);
    }
  }
  if (sub === "geometry") {
    const p = item.params && typeof item.params === "object" ? item.params : {};
    // Same diagram/compute identity with same answer (stem wording may vary).
    const hasConcrete =
      p.diagramVariant != null ||
      p.radius != null ||
      p.side != null ||
      p.base != null ||
      p.height != null ||
      p.length != null ||
      p.width != null ||
      p.poolRowId;
    if (hasConcrete) {
      aliases.push(
        [
          "geometry-inputs",
          item.topic || item.operation,
          p.kind || "",
          p.type || "",
          p.isParallel,
          p.diagramVariant ?? "",
          p.radius ?? "",
          p.side ?? "",
          p.base ?? "",
          p.height ?? "",
          p.length ?? "",
          p.width ?? "",
          p.poolRowId || "",
          item.correctAnswer,
        ].join("|")
      );
    }
  }

  return [...new Set(aliases.filter(Boolean))];
}

/**
 * @param {Record<string, unknown>} item
 * @param {string} subjectId
 * @param {Set<string>} seen
 * @returns {boolean} true if any alias already seen
 */
export function worksheetQuestionFingerprintSeen(item, subjectId, seen) {
  if (!seen) return false;
  for (const fp of worksheetQuestionFingerprintAliases(item, subjectId)) {
    if (seen.has(fp)) return true;
  }
  return false;
}

/**
 * @param {Record<string, unknown>} item
 * @param {string} subjectId
 * @param {Set<string>} seen
 */
export function rememberWorksheetQuestionFingerprints(item, subjectId, seen) {
  if (!seen) return;
  for (const fp of worksheetQuestionFingerprintAliases(item, subjectId)) {
    seen.add(fp);
  }
}
