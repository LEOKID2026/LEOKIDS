/**
 * Geometry taxonomy — structure from content pack; labels resolved at import time (en default).
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

import geometryStructure from "../../content-packs/en/learning/taxonomy/geometry.structure.json" with { type: "json" };
import geometryContent from "../../content-packs/en/learning/taxonomy/geometry.content.json" with { type: "json" };
import { mergeTaxonomyRows } from "./taxonomy-merge.js";

/** @type {TaxonomyRow[]} */
export const GEOMETRY_TAXONOMY_ROWS = mergeTaxonomyRows(geometryStructure.rows, geometryContent.rows);
