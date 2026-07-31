/**
 * Math taxonomy — structure from content pack catalog via locale resolver.
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

import { loadTaxonomyBundle } from "../../lib/learning/learning-locale-contract.js";
import { mergeTaxonomyRows } from "./taxonomy-merge.js";

const { structure: mathStructure, content: mathContent } = loadTaxonomyBundle("math");

/** @type {TaxonomyRow[]} */
export const MATH_TAXONOMY_ROWS = mergeTaxonomyRows(mathStructure?.rows, mathContent?.rows);
