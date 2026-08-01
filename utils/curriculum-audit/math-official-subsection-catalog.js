/**
 * Phase 4B-3 — Official Math subsection catalog (planning artefact).
 *
 * Encoded manually from the structure of MoE elementary math programmes (PDF per grade).
 * Does NOT replace reading kita{n}.pdf line-by-line; page hints are indicative only.
 *
 * @typedef {'high' || 'medium' || 'low'} CatalogConfidence
 * @typedef {'intro' || 'basic' || 'developing' || 'advanced'} ExpectedDepth
 */

import { MATH_ELEMENTARY_GRADE_PDF_BASE, SOURCE_REGISTRY_CHECKED_AT } from "./official-curriculum-source-registry.js";

/** @param {number} g */
export function mathGradeProgrammePdfUrl(g) {
 return `${MATH_ELEMENTARY_GRADE_PDF_BASE}/kita${g}.pdf`;
}

/**
 * @param {object} p
 * @returns {object}
 */
function sec(p) {
 return {
 confidence: /** @type {CatalogConfidence} */ (p.confidence || "medium"),
 notes:
 p.notes ||
 " - PDF .",
 ...p,
 };
}

/**
 * Sections for one grade — Hebrew labels align with typical headings / strands.
 * `mapsToNormalizedKeys` links audit keys from curriculum-topic-normalizer.js.
 *
 * @param {number} grade 1–6
 */
export function buildSectionsForGrade(grade) {
 /** @type {object[]} */
 const s = [];

 const strand = {
 numbers: "numbers_operations",
 data: "data_investigation",
 geometry: "geometry_measurement",
 patterns: "patterns_early_algebra",
 };

 /* ---------- Grade 1 ---------- */
 if (grade === 1) {
 s.push(
 sec({
 sectionKey: "g1_numbers_natural",
 labelHe: " 100 (, , )",
 strand: strand.numbers,
 subsectionLabelsHe: ["", "", ""],
 expectedDepth: /** @type {ExpectedDepth} */ ("intro"),
 sourcePageHint: " / - ",
 mapsToNormalizedKeys: ["math.number_sense", "math.estimation_rounding"],
 confidence: "high",
 }),
 sec({
 sectionKey: "g1_add_sub_facts",
 labelHe: " ( )",
 strand: strand.numbers,
 subsectionLabelsHe: [" 20", ""],
 expectedDepth: "intro",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: [
 "math.addition_subtraction",
 "math.mixed_operations",
 "math.multiplication_division",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g1_word_simple",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [""],
 expectedDepth: "intro",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: ["math.word_problems"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g1_patterns_intro",
 labelHe: "",
 strand: strand.patterns,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "intro",
 sourcePageHint: " / ",
 mapsToNormalizedKeys: ["math.patterns_sequences", "math.equations_and_expressions"],
 confidence: "low",
 }),
 sec({
 sectionKey: "g1_geometry_shapes",
 labelHe: " - ",
 strand: strand.geometry,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "intro",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.geometry_context"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g1_data_intro",
 labelHe: " - ",
 strand: strand.data,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "intro",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: ["math.data_and_charts"],
 confidence: "medium",
 })
 );
 }

 /* ---------- Grade 2 ---------- */
 if (grade === 2) {
 s.push(
 sec({
 sectionKey: "g2_numbers_to_1000",
 labelHe: " 1000",
 strand: strand.numbers,
 subsectionLabelsHe: ["//", ""],
 expectedDepth: "basic",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: ["math.number_sense", "math.estimation_rounding"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_add_sub_multi_digit",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.addition_subtraction", "math.mixed_operations"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_mult_div_intro",
 labelHe: " ; ",
 strand: strand.numbers,
 subsectionLabelsHe: ["", " - "],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.multiplication_division"],
 confidence: "medium",
 notes:
 " math.divisibility_factors - (g3_divisibility_intro); .",
 }),
 sec({
 sectionKey: "g2_fractions_intro",
 labelHe: " - ",
 strand: strand.numbers,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.fractions"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_word_problems",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [""],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.word_problems"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_measurement_intro",
 labelHe: " - / / ",
 strand: strand.geometry,
 subsectionLabelsHe: [""],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.geometry_context"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_data_charts",
 labelHe: "",
 strand: strand.data,
 subsectionLabelsHe: [" /"],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.data_and_charts"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_patterns_equations_early",
 labelHe: "",
 strand: strand.patterns,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "basic",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: ["math.patterns_sequences", "math.equations_and_expressions"],
 confidence: "low",
 })
 );
 }

 /* ---------- Grade 3 ---------- */
 if (grade === 3) {
 s.push(
 sec({
 sectionKey: "g3_numbers_large",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "math.number_sense",
 "math.estimation_rounding",
 "math.addition_subtraction",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_mult_div_facts",
 labelHe: " - ",
 strand: strand.numbers,
 subsectionLabelsHe: [" - "],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.multiplication_division"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_fractions_compare",
 labelHe: " - ",
 strand: strand.numbers,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.fractions"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_decimals_intro",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [""],
 expectedDepth: "developing",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: ["math.decimals"],
 confidence: "low",
 }),
 sec({
 sectionKey: "g3_word_complex",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.word_problems"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_geometry_area_intro",
 labelHe: " - ",
 strand: strand.geometry,
 subsectionLabelsHe: [""],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.geometry_context"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_data_statistics",
 labelHe: " - / ",
 strand: strand.data,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.data_and_charts"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_divisibility_intro",
 labelHe: " - , 3/5",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.divisibility_factors"],
 confidence: "low",
 notes:
 " math.divisibility_factors; ( ) - kita3.pdf.",
 }),
 sec({
 sectionKey: "g3_patterns_algebra",
 labelHe: "",
 strand: strand.patterns,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.patterns_sequences", "math.equations_and_expressions"],
 confidence: "medium",
 })
 );
 }

 /* ---------- Grade 4 ---------- */
 if (grade === 4) {
 s.push(
 sec({
 sectionKey: "g4_operations_fractions_decimals",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "math.fractions",
 "math.decimals",
 "math.mixed_operations",
 "math.multiplication_division",
 "math.addition_subtraction",
 "math.estimation_rounding",
 "math.number_sense",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_divisibility_factors",
 labelHe: ", ",
 strand: strand.numbers,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "developing",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: ["math.divisibility_factors"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_percent_intro",
 labelHe: " - ",
 strand: strand.numbers,
 subsectionLabelsHe: ["100 "],
 expectedDepth: "developing",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: ["math.percentages"],
 confidence: "low",
 }),
 sec({
 sectionKey: "g4_word_multistep",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.word_problems"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_geometry_angles",
 labelHe: ", , ",
 strand: strand.geometry,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.geometry_context"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_data_graphs",
 labelHe: "",
 strand: strand.data,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.data_and_charts"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_powers_ratio",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.powers_and_scaling", "math.ratio_and_scale"],
 confidence: "low",
 }),
 sec({
 sectionKey: "g4_equations",
 labelHe: "",
 strand: strand.patterns,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.equations_and_expressions", "math.patterns_sequences"],
 confidence: "medium",
 })
 );
 }

 /* ---------- Grade 5 ---------- */
 if (grade === 5) {
 s.push(
 sec({
 sectionKey: "g5_fractions_operations",
 labelHe: " - ",
 strand: strand.numbers,
 subsectionLabelsHe: [""],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.fractions", "math.mixed_operations", "math.addition_subtraction"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_decimals_percent",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [""],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "math.decimals",
 "math.percentages",
 "math.estimation_rounding",
 "math.number_sense",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_volume_measurement",
 labelHe: "",
 strand: strand.geometry,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.geometry_context"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_word_problems",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.word_problems"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_data_probability_intro",
 labelHe: "",
 strand: strand.data,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.data_and_charts"],
 confidence: "low",
 }),
 sec({
 sectionKey: "g5_algebra_expressions",
 labelHe: "",
 strand: strand.patterns,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.equations_and_expressions", "math.patterns_sequences"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_divisibility_primes",
 labelHe: ", , ",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.divisibility_factors", "math.multiplication_division"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_ratio_scale",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.ratio_and_scale"],
 confidence: "medium",
 })
 );
 }

 /* ---------- Grade 6 ---------- */
 if (grade === 6) {
 s.push(
 sec({
 sectionKey: "g6_rational_numbers",
 labelHe: " - , , ",
 strand: strand.numbers,
 subsectionLabelsHe: [""],
 expectedDepth: "advanced",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: [
 "math.fractions",
 "math.decimals",
 "math.number_sense",
 "math.estimation_rounding",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_percent_ratio_problems",
 labelHe: ", ",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.percentages", "math.ratio_and_scale", "math.word_problems"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_expressions_equations",
 labelHe: " - ",
 strand: strand.patterns,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.equations_and_expressions", "math.patterns_sequences"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_geometry_area_volume",
 labelHe: " - , , ",
 strand: strand.geometry,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.geometry_context"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_data_statistics",
 labelHe: " - ",
 strand: strand.data,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.data_and_charts"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_powers_roots",
 labelHe: "",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.powers_and_scaling"],
 confidence: "low",
 }),
 sec({
 sectionKey: "g6_divisibility_lcm_gcd",
 labelHe: " , , ",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["math.divisibility_factors"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_mixed_review",
 labelHe: " ( )",
 strand: strand.numbers,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 notes:
 " math.word_problems - / g6_percent_ratio_problems ; .",
 mapsToNormalizedKeys: [
 "math.mixed_operations",
 "math.addition_subtraction",
 "math.multiplication_division",
 ],
 confidence: "low",
 })
 );
 }

 return s;
}

/**
 * Uncertain / thin areas per grade (manual notes until PDF cross-check).
 * @param {number} grade
 */
export function missingUncertainAreasForGrade(grade) {
 const common = [
 " PDF - .",
 " - .",
 ];
 if (grade <= 2)
 return [...common, " - .", " - ."];
 if (grade <= 4)
 return [...common, " - ."];
 return [...common];
}

function buildFullCatalog() {
 /** @type {Record<string, object>} */
 const out = {};
 for (let g = 1; g <= 6; g++) {
 out[`grade_${g}`] = {
 grade: g,
 sourcePdf: mathGradeProgrammePdfUrl(g),
 catalogCheckedAt: SOURCE_REGISTRY_CHECKED_AT,
 missingUncertainAreas: missingUncertainAreasForGrade(g),
 sections: buildSectionsForGrade(g),
 };
 }
 return out;
}

export const MATH_OFFICIAL_SUBSECTION_CATALOG = buildFullCatalog();
