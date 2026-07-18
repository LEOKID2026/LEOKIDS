/**
 * English taxonomy — structure from content pack; labels resolved at import time (en default).
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

import englishStructure from "../../content-packs/en/learning/taxonomy/english.structure.json" with { type: "json" };
import englishContent from "../../content-packs/en/learning/taxonomy/english.content.json" with { type: "json" };
import { mergeTaxonomyRows } from "./taxonomy-merge.js";

/** @type {TaxonomyRow[]} */
export const ENGLISH_TAXONOMY_ROWS = mergeTaxonomyRows(englishStructure.rows, englishContent.rows);
