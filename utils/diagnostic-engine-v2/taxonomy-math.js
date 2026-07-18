/**
 * Math taxonomy — structure from content pack; labels resolved at import time (en default).
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

import mathStructure from "../../content-packs/en/learning/taxonomy/math.structure.json" with { type: "json" };
import mathContent from "../../content-packs/en/learning/taxonomy/math.content.json" with { type: "json" };
import { mergeTaxonomyRows } from "./taxonomy-merge.js";

/** @type {TaxonomyRow[]} */
export const MATH_TAXONOMY_ROWS = mergeTaxonomyRows(mathStructure.rows, mathContent.rows);
