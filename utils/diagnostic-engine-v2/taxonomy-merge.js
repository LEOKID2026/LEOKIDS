/**
 * Merge language-neutral taxonomy structure rows with localized content pack entries.
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

/** @type {Record<string, keyof TaxonomyRow>} */
const CONTENT_TO_ROW_FIELD = {
  domain: "domainHe",
  topic: "topicHe",
  subskill: "subskillHe",
  pattern: "patternHe",
  observableMarkers: "observableMarkersHe",
  counterEvidence: "counterEvidenceHe",
  countsWhen: "countsWhenHe",
  doesNotCountWhen: "doesNotCountWhenHe",
  roots: "rootsHe",
  competitors: "competitorsHe",
  doNotConclude: "doNotConcludeHe",
  probe: "probeHe",
  intervention: "interventionHe",
  escalation: "escalationHe",
  parentLabel: "parentLabelHe",
  studentLabel: "studentLabelHe",
  recommendation: "recommendationHe",
  title: "titleHe",
  description: "descriptionHe",
};

/**
 * @param {Record<string, unknown>[]} structureRows
 * @param {Record<string, Record<string, unknown>>} contentById
 * @returns {TaxonomyRow[]}
 */
export function mergeTaxonomyRows(structureRows, contentById) {
  return structureRows.map((row) => {
    /** @type {Record<string, unknown>} */
    const merged = { ...row };
    const content = contentById[String(row.id)] || {};
    for (const [contentKey, rowKey] of Object.entries(CONTENT_TO_ROW_FIELD)) {
      if (content[contentKey] !== undefined) {
        merged[rowKey] = content[contentKey];
      }
    }
    return /** @type {TaxonomyRow} */ (merged);
  });
}
