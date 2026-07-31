/**
 * Science taxonomy — structure from content pack catalog via locale resolver.
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

import { loadTaxonomyBundle } from "../../lib/learning/learning-locale-contract.js";
import { mergeTaxonomyRows } from "./taxonomy-merge.js";

const { structure: scienceStructure, content: scienceContent } = loadTaxonomyBundle("science");

/** @type {TaxonomyRow[]} */
export const SCIENCE_TAXONOMY_ROWS = mergeTaxonomyRows(
  scienceStructure?.rows,
  scienceContent?.rows,
);
