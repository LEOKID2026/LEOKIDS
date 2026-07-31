/**
 * Geometry taxonomy — structure from content pack catalog via locale resolver.
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

import { loadTaxonomyBundle } from "../../lib/learning/learning-locale-contract.js";
import { mergeTaxonomyRows } from "./taxonomy-merge.js";

const { structure: geometryStructure, content: geometryContent } = loadTaxonomyBundle("geometry");

/** @type {TaxonomyRow[]} */
export const GEOMETRY_TAXONOMY_ROWS = mergeTaxonomyRows(
  geometryStructure?.rows,
  geometryContent?.rows,
);
