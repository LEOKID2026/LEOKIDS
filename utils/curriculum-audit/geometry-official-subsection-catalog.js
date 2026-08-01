/**
 * Phase 4G — Official Geometry subsection catalog (planning artefact).
 * Geometry is a separate product strand but aligns with the MoE math programme geometry thread (POP).
 *
 * @typedef {'high' || 'medium' || 'low'} CatalogConfidence
 * @typedef {'intro' || 'basic' || 'developing' || 'advanced'} ExpectedDepth
 */

import {
 MATH_ELEMENTARY_GRADE_PDF_BASE,
 SOURCE_REGISTRY_CHECKED_AT,
} from "./official-curriculum-source-registry.js";

/** Official elementary programme PDF for grade (geometry strand appears inside math kita PDF). */
export function geometryGradeProgrammePdfUrl(grade) {
 return `${MATH_ELEMENTARY_GRADE_PDF_BASE}/kita${grade}.pdf`;
}

/** POP — geometry strand (single anchor for all elementary grades). */
export const GEOMETRY_STRAND_POP_PAGE =
 "https://pop.education.gov.il/tchumey_daat/matmatika/yesodi/noseem_nilmadim/geometrya/";

/** @param {object} p */
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
 * @param {number} grade 1–6
 */
export function buildGeometrySectionsForGrade(grade) {
 /** @type {object[]} */
 const s = [];

 const strand = {
 shapes: "plane_figures",
 measure: "measurement_volume",
 spatial: "spatial_reasoning",
 reasoning: "geometric_reasoning",
 };

 /* ---------- Grade 1 ---------- */
 if (grade === 1) {
 s.push(
 sec({
 sectionKey: "g1_shapes_plane_intro",
 labelHe: " - ",
 strand: strand.shapes,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "intro",
 sourcePageHint: " - ",
 mapsToNormalizedKeys: ["geometry.shape_recognition_plane_figures"],
 confidence: "high",
 }),
 sec({
 sectionKey: "g1_transformations_intro",
 labelHe: "",
 strand: strand.spatial,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "intro",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.transformations_symmetry"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g1_solids_area_exposure",
 labelHe: " - ",
 strand: strand.measure,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "intro",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.solids_3d", "geometry.area"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g1_parallel_spatial_intro",
 labelHe: " - ",
 strand: strand.spatial,
 subsectionLabelsHe: [],
 expectedDepth: "intro",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.parallel_perpendicular_spatial"],
 confidence: "low",
 })
 );
 }

 /* ---------- Grade 2 ---------- */
 if (grade === 2) {
 s.push(
 sec({
 sectionKey: "g2_area_solids_core",
 labelHe: " - ",
 strand: strand.measure,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.area", "geometry.solids_3d", "geometry.volume"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_shapes_transformations",
 labelHe: "",
 strand: strand.shapes,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.shape_recognition_plane_figures",
 "geometry.transformations_symmetry",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_perimeter_spatial",
 labelHe: "",
 strand: strand.measure,
 subsectionLabelsHe: [],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.perimeter", "geometry.parallel_perpendicular_spatial"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g2_angles_intro",
 labelHe: " - ",
 strand: strand.reasoning,
 subsectionLabelsHe: [],
 expectedDepth: "basic",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.angles"],
 confidence: "low",
 })
 );
 }

 /* ---------- Grade 3 ---------- */
 if (grade === 3) {
 s.push(
 sec({
 sectionKey: "g3_angles_parallel_triangles_quads",
 labelHe: ", , ",
 strand: strand.reasoning,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.angles",
 "geometry.parallel_perpendicular_spatial",
 "geometry.triangles",
 "geometry.polygons_quadrilaterals",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_area_perimeter",
 labelHe: ", ",
 strand: strand.measure,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.area", "geometry.perimeter", "geometry.volume"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_shapes_solids_diagonals",
 labelHe: ", ",
 strand: strand.shapes,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.shape_recognition_plane_figures",
 "geometry.solids_3d",
 "geometry.diagonals_properties",
 "geometry.heights_area_links",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g3_transform_rotation",
 labelHe: "",
 strand: strand.spatial,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.transformations_symmetry"],
 confidence: "medium",
 })
 );
 }

 /* ---------- Grade 4 ---------- */
 if (grade === 4) {
 s.push(
 sec({
 sectionKey: "g4_polygons_diagonals_symmetry",
 labelHe: ", ",
 strand: strand.shapes,
 subsectionLabelsHe: ["", ""],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.shape_recognition_plane_figures",
 "geometry.diagonals_properties",
 "geometry.transformations_symmetry",
 "geometry.polygons_quadrilaterals",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_area_perimeter_volume_boxes",
 labelHe: ", ",
 strand: strand.measure,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.area", "geometry.perimeter", "geometry.volume"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_circles_solids_intro",
 labelHe: "",
 strand: strand.shapes,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.circle_basic", "geometry.solids_3d"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_triangles_quadrilaterals",
 labelHe: ", , ",
 strand: strand.reasoning,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.triangles",
 "geometry.polygons_quadrilaterals",
 "geometry.angles",
 "geometry.parallel_perpendicular_spatial",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g4_tiling_enrichment",
 labelHe: "",
 strand: strand.shapes,
 subsectionLabelsHe: [],
 expectedDepth: "developing",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.tiling_covering"],
 confidence: "low",
 })
 );
 }

 /* ---------- Grade 5 ---------- */
 if (grade === 5) {
 s.push(
 sec({
 sectionKey: "g5_angle_quad_parallel_diagonal_height",
 labelHe: ", , , ",
 strand: strand.reasoning,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.angles",
 "geometry.polygons_quadrilaterals",
 "geometry.parallel_perpendicular_spatial",
 "geometry.diagonals_properties",
 "geometry.heights_area_links",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_area_perimeter_volume",
 labelHe: ", ",
 strand: strand.measure,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.area", "geometry.perimeter", "geometry.volume"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_transform_tiling_mixed",
 labelHe: ", ",
 strand: strand.spatial,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.transformations_symmetry",
 "geometry.tiling_covering",
 "geometry.mixed_review",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_solids_triangles",
 labelHe: "",
 strand: strand.measure,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.solids_3d", "geometry.triangles"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g5_shapes_recognition",
 labelHe: "",
 strand: strand.shapes,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.shape_recognition_plane_figures"],
 confidence: "low",
 })
 );
 }

 /* ---------- Grade 6 ---------- */
 if (grade === 6) {
 s.push(
 sec({
 sectionKey: "g6_solids_circle_volume",
 labelHe: ", ",
 strand: strand.measure,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.solids_3d",
 "geometry.circle_basic",
 "geometry.volume",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_area_perimeter_angles",
 labelHe: ", ",
 strand: strand.measure,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.area", "geometry.perimeter", "geometry.angles"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_pythagoras_triangles",
 labelHe: "",
 strand: strand.reasoning,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.pythagoras_right_triangles", "geometry.triangles"],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_quadrilaterals_transform",
 labelHe: ", ",
 strand: strand.shapes,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: [
 "geometry.polygons_quadrilaterals",
 "geometry.transformations_symmetry",
 "geometry.parallel_perpendicular_spatial",
 "geometry.diagonals_properties",
 "geometry.tiling_covering",
 ],
 confidence: "medium",
 }),
 sec({
 sectionKey: "g6_mixed_review_geometry",
 labelHe: "",
 strand: strand.reasoning,
 subsectionLabelsHe: [],
 expectedDepth: "advanced",
 sourcePageHint: "",
 mapsToNormalizedKeys: ["geometry.mixed_review", "geometry.heights_area_links"],
 confidence: "low",
 })
 );
 }

 return s;
}

/**
 * Planning notes until PDF subsection anchors are confirmed.
 * @param {number} grade
 */
export function geometryMissingUncertainAreasForGrade(grade) {
 const common = [
 " - .",
 " PDF .",
 ];
 if (grade <= 2) return [...common, " - ."];
 if (grade <= 4) return [...common, " - ."];
 return [...common];
}

function buildFullGeometryCatalog() {
 /** @type {Record<string, object>} */
 const out = {};
 for (let g = 1; g <= 6; g++) {
 out[`grade_${g}`] = {
 grade: g,
 sourcePdf: geometryGradeProgrammePdfUrl(g),
 strandPopAnchor: GEOMETRY_STRAND_POP_PAGE,
 catalogCheckedAt: SOURCE_REGISTRY_CHECKED_AT,
 missingUncertainAreas: geometryMissingUncertainAreasForGrade(g),
 sections: buildGeometrySectionsForGrade(g),
 };
 }
 return out;
}

export const GEOMETRY_OFFICIAL_SUBSECTION_CATALOG = buildFullGeometryCatalog();
