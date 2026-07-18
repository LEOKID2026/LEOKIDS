/**
 * Science taxonomy — structure from content pack; labels resolved at import time (en default).
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

import scienceStructure from "../../content-packs/en/learning/taxonomy/science.structure.json" with { type: "json" };
import scienceContent from "../../content-packs/en/learning/taxonomy/science.content.json" with { type: "json" };
import { mergeTaxonomyRows } from "./taxonomy-merge.js";

/** @type {TaxonomyRow[]} */
export const SCIENCE_TAXONOMY_ROWS = mergeTaxonomyRows(scienceStructure.rows, scienceContent.rows);
