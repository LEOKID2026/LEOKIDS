/**
 * English taxonomy — English-subject exception: contentLocale forced to en via subject.
 * @typedef {import("./taxonomy-types.js").TaxonomyRow} TaxonomyRow
 */

import { loadTaxonomyBundle } from "../../lib/learning/learning-locale-contract.js";
import { mergeTaxonomyRows } from "./taxonomy-merge.js";

const { structure: englishStructure, content: englishContent } = loadTaxonomyBundle("english");

/** @type {TaxonomyRow[]} */
export const ENGLISH_TAXONOMY_ROWS = mergeTaxonomyRows(
  englishStructure?.rows,
  englishContent?.rows,
);
