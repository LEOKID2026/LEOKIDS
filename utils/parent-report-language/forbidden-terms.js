/**
 * Parent report — forbidden substrings in parent-facing text (screen/PDF).
 * Used by selftest; can be imported by future snapshot guards.
 */

/** Lowercase ASCII fragments that must not appear in parent-facing lines */
/**       (/) —  readability */
export const PARENT_READABILITY_LEAK_SUBSTRINGS = [
  "responsems",
  /* Plain-language guardrails — old diagnostic labels must not leak back */
  /* Engine-internal M-10 taxonomy — must not leak to parents */
  /* Parent copy guard — diagnostic-engine jargon in default-visible report text */
  /* Duplicate phrase guard — patch typo must not recur */
  /* parent_report_hebrew_copy_spec.md §9 */
  "drop_one_level",
  "drop level",
  /* blocked taxonomy patternHe labels — must never reach parent display */
  "past/present",
];

/** Adjacent duplicate word pairs that must not appear in parent-facing copy. */
export const PARENT_COPY_DUPLICATE_WORD_PAIRS = Object.freeze([
]);

/** Forbidden fragments in parent-report Hebrew copy sources (denylist for copy guard). */
export const PARENT_COPY_FORBIDDEN_FRAGMENTS = Object.freeze([
  /* Awkward bare "" / engineer empty-state wording */
  /* Duplicate phrase guard — patch typo must not recur */
  /* explicit parent-facing forbidden terms — owner spec */
  "subskill",
  "oracle",
  /* parent_report_hebrew_copy_spec.md §9 */
  "clear_topic_gap",
  "partial_stable",
  "mastery_stable",
  "engineDecision",
  "safeSubskill",
  /* blocked taxonomy patternHe labels */
  "past/present",
]);

export const FORBIDDEN_PARENT_REPORT_SUBSTRINGS = [
  "insufficient_data",
  "early_signal_only",
  "contradictory",
  "probe",
  "fallback",
  "legacy",
  "diagnosticenginev2",
  "pattern_diagnostics",
  "p4)",
  "(p4",
  " p4",
  "p3)",
  "(p3",
  " p3",
  "p2)",
  "(p2",
  " p2",
  "p1)",
  "(p1",
  " p1",
];

/**
 * @param {string} s
 * @returns {string[]}
 */
export function findParentCopyForbiddenFragmentsInString(s) {
  const t = String(s || "");
  const hits = [];
  for (const frag of PARENT_COPY_FORBIDDEN_FRAGMENTS) {
    if (t.includes(frag)) hits.push(frag);
  }
  return hits;
}

/**
 * @param {string} s
 * @returns {string[]}
 */
export function findDuplicateWordPairsInString(s) {
  const t = String(s || "");
  const hits = [];
  for (const pair of PARENT_COPY_DUPLICATE_WORD_PAIRS) {
    if (t.includes(pair)) hits.push(pair);
  }
  return hits;
}

/**
 * @param {string} s
 * @returns {string[]} list of matched forbidden fragments (lowercase scan)
 */
export function findForbiddenSubstringsInString(s) {
  const t = String(s || "").toLowerCase();
  const hits = [];
  for (const frag of FORBIDDEN_PARENT_REPORT_SUBSTRINGS) {
    if (t.includes(frag)) hits.push(frag);
  }
  return hits;
}

/**
 * @param {string} s
 * @returns {string[]}
 */
export function findReadabilityLeakSubstringsInString(s) {
  const t = String(s || "").toLowerCase();
  const hits = [];
  for (const frag of PARENT_READABILITY_LEAK_SUBSTRINGS) {
    if (t.includes(frag)) hits.push(frag);
  }
  return hits;
}

/**
 * Depth-first scan of string values in a plain object/array tree.
 * @param {unknown} value
 * @param {(path: string, hits: string[]) => void} onHits
 * @param {string} [path]
 */
export function scanValueForForbidden(value, onHits, path = "$") {
  if (value == null) return;
  if (typeof value === "string") {
    const hits = findForbiddenSubstringsInString(value);
    if (hits.length) onHits(path, hits);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => scanValueForForbidden(v, onHits, `${path}[${i}]`));
    return;
  }
  if (typeof value === "object") {
    for (const k of Object.keys(value)) {
      scanValueForForbidden(/** @type {any} */ (value)[k], onHits, `${path}.${k}`);
    }
  }
}
