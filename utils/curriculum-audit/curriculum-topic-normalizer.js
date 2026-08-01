import { burnDownCopy } from "../../lib/learning/burn-down-copy.js";
/**
 * Maps raw inventory topic/subtopic strings to stable audit keys (English internal).
 * Preserves raw strings; Hebrew labels are conservative metadata for reports only.
 */

/** @typedef {'high' || 'medium' || 'low'} NormConfidence */

/**
 * @typedef {Object} NormalizedTopic
 * @property {string} rawTopic
 * @property {string} rawSubtopic
 * @property {string} normalizedTopicKey
 * @property {string} normalizedTopicLabelHe
 * @property {NormConfidence} normalizationConfidence
 * @property {string} normalizationNotes
 * @property {string[]} [compositeSegments]
 */

function slug(s) {
 return String(s || "")
 .trim()
 .toLowerCase()
 .replace(/\s+/g, "_")
 .replace(/[^\w-.+|-]/g, "");
}

/**
 * @param {object} input
 * @param {string} input.subject
 * @param {string} [input.topic]
 * @param {string} [input.subtopic]
 * @returns {NormalizedTopic}
 */
export function normalizeInventoryTopic(input) {
 const subject = String(input.subject || "").trim();
 const rawTopic = String(input.topic ?? "").trim();
 const rawSubtopic = String(input.subtopic ?? "").trim();

 switch (subject) {
 case "math":
 return normalizeMath(rawTopic, rawSubtopic);
 case "geometry":
 return normalizeGeometry(rawTopic, rawSubtopic);
 
 case "english":
 return normalizeEnglish(rawTopic, rawSubtopic);
 case "science":
 return normalizeScience(rawTopic, rawSubtopic);
 
 case "geography":
 return normalizeGeography(rawTopic, rawSubtopic);
 default:
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `unknown.${slug(subject)}.${slug(rawTopic)}`,
 normalizedTopicLabelHe: "",
 normalizationConfidence: "low",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "unknown_subject_for_normalization")
 };
 }
}

/** @returns {NormalizedTopic} */
function normalizeMath(rawTopic, rawSubtopic) {
 const op = slug(rawTopic || rawSubtopic);
 const sub = slug(rawSubtopic);

 const strandMap = {
 number_sense: {
 key: "math.number_sense",
 he: " / "
 },
 compare: {
 key: "math.number_sense",
 he: " / "
 },
 addition: {
 key: "math.addition_subtraction",
 he: ""
 },
 subtraction: {
 key: "math.addition_subtraction",
 he: ""
 },
 multiplication: {
 key: "math.multiplication_division",
 he: ""
 },
 division: {
 key: "math.multiplication_division",
 he: ""
 },
 division_with_remainder: {
 key: "math.multiplication_division",
 he: " ( )"
 },
 fractions: { key: "math.fractions", he: "" },
 decimals: { key: "math.decimals", he: "" },
 percentages: { key: "math.percentages", he: "" },
 word_problems: { key: "math.word_problems", he: "" },
 sequences: { key: "math.patterns_sequences", he: "" },
 divisibility: { key: "math.divisibility_factors", he: "" },
 prime_composite: { key: "math.divisibility_factors", he: "" },
 factors_multiples: { key: "math.divisibility_factors", he: "" },
 powers: { key: "math.powers_and_scaling", he: "" },
 ratio: { key: "math.ratio_and_scale", he: "" },
 scale: { key: "math.ratio_and_scale", he: "" },
 estimation: { key: "math.estimation_rounding", he: "" },
 rounding: { key: "math.estimation_rounding", he: "" },
 equations: { key: "math.equations_and_expressions", he: "" },
 order_of_operations: {
 key: "math.equations_and_expressions",
 he: ""
 },
 zero_one_properties: {
 key: "math.number_sense",
 he: " 0 -1"
 },
 mixed: { key: "math.mixed_operations", he: "" },
 geometry_basic: {
 key: "math.geometry_context",
 he: " ( )"
 },
 data: { key: "math.data_and_charts", he: "" }
 };

 const primary = op || sub;
 const hit = strandMap[primary];
 if (hit) {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: hit.key,
 normalizedTopicLabelHe: hit.he,
 normalizationConfidence: "high",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "mapped_from_math_generator_operation_topic_key")
 };
 }

 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `math.unmapped.${primary || "empty"}`,
 normalizedTopicLabelHe: " - ",
 normalizationConfidence: "low",
 normalizationNotes:
 "Operation/topic not in strand table - expand curriculum-topic-normalizer.js."
 };
}

/** @returns {NormalizedTopic} */
function normalizeGeometry(rawTopic, rawSubtopic) {
 const segments = String(rawTopic || "")
 .split("|")
 .map((x) => slug(x))
 .filter(Boolean);
 const kind = slug(rawSubtopic);

 const geomMap = {
 shapes_basic: {
 key: "geometry.shape_recognition_plane_figures",
 he: ""
 },
 quadrilaterals: {
 key: "geometry.polygons_quadrilaterals",
 he: ""
 },
 triangles: { key: "geometry.triangles", he: "" },
 area: { key: "geometry.area", he: "" },
 perimeter: { key: "geometry.perimeter", he: "" },
 volume: { key: "geometry.volume", he: "" },
 solids: { key: "geometry.solids_3d", he: "" },
 angles: { key: "geometry.angles", he: "" },
 parallel_perpendicular: {
 key: "geometry.parallel_perpendicular_spatial",
 he: ", "
 },
 transformations: {
 key: "geometry.transformations_symmetry",
 he: ""
 },
 rotation: {
 key: "geometry.transformations_symmetry",
 he: ""
 },
 symmetry: { key: "geometry.transformations_symmetry", he: "" },
 tiling: { key: "geometry.tiling_covering", he: "" },
 diagonal: { key: "geometry.diagonals_properties", he: "" },
 heights: { key: "geometry.heights_area_links", he: "" },
 circles: { key: "geometry.circle_basic", he: "" },
 pythagoras: { key: "geometry.pythagoras_right_triangles", he: "" },
 mixed: { key: "geometry.mixed_review", he: "" }
 };

 const primarySeg = segments[0] || kind;
 const hit = geomMap[primarySeg] || geomMap[kind];
 if (hit) {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: hit.key,
 normalizedTopicLabelHe: hit.he,
 normalizationConfidence: segments.length > 1 ? "medium" : "high",
 normalizationNotes:
 segments.length > 1
 ? "Composite topic string split; primary segment drove mapping."
 : burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "mapped_from_geometry_topic_generator_kind"),
 compositeSegments: segments.length ? segments : undefined
 };
 }

 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `geometry.unmapped.${primarySeg || kind || "empty"}`,
 normalizedTopicLabelHe: " - ",
 normalizationConfidence: "low",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "expand_geometry_strand_map_for_this_topic_kind"),
 compositeSegments: segments.length ? segments : undefined
 };
}

/** @returns {NormalizedTopic} */
function normalizeHebrew(rawTopic, rawSubtopic) {
 const t = slug(rawTopic);
 const st = slug(rawSubtopic);

 const skillMap = {
 reading: {
 key: "hebrew.decoding_reading_fluency",
 he: ""
 },
 comprehension: {
 key: "hebrew.reading_comprehension",
 he: ""
 },
 writing: { key: "hebrew.writing", he: "" },
 grammar: {
 key: "hebrew.grammar_language_knowledge",
 he: ""
 },
 vocabulary: { key: "hebrew.vocabulary", he: "" },
 speaking: { key: "hebrew.oral_expression", he: "" }
 };

 const refineReading = () => {
 const u = `${rawSubtopic}`.toLowerCase();
 if (
 u.includes("locat") ||
 u.includes("") ||
 u.includes("scan") ||
 u.includes("find")
 )
 return {
 key: "hebrew.locating_information",
 he: ""
 };
 if (u.includes("infer") || u.includes("") || u.includes(""))
 return { key: "hebrew.inference", he: "" };
 if (u.includes("sequence") || u.includes("order") || u.includes(""))
 return { key: "hebrew.sequence_order", he: "" };
 if (u.includes("main") || u.includes(""))
 return { key: "hebrew.main_idea", he: "" };
 if (u.includes("connector") || u.includes(""))
 return { key: "hebrew.connectors_cohesion", he: "" };
 return null;
 };

 if (t === "comprehension" && st) {
 const r = refineReading();
 if (r) {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: r.key,
 normalizedTopicLabelHe: r.he,
 normalizationConfidence: "medium",
 normalizationNotes:
 "Heuristic refinement from subtopic slug - verify against Hebrew bank metadata."
 };
 }
 }

 const hit = skillMap[t];
 if (hit) {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: hit.key,
 normalizedTopicLabelHe: hit.he,
 normalizationConfidence: st ? "medium" : "high",
 normalizationNotes: st
 ? "Primary Hebrew skill from topic; subtopic present - review for finer skill tagging."
 : burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "mapped_from_hebrew_topics_key")
 };
 }

 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `hebrew.unmapped.${t || "empty"}`,
 normalizedTopicLabelHe: " - ",
 normalizationConfidence: "low",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "unknown_hebrew_topic_bucket")
 };
}

/** @returns {NormalizedTopic} */
function normalizeEnglish(rawTopic, rawSubtopic) {
 let cat = slug(rawTopic);
 const pool = slug(rawSubtopic);
 if (cat === "sentences") cat = "sentence";

 if (cat === "vocabulary") {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `english.vocabulary_translation.${pool || "general"}`,
 normalizedTopicLabelHe: "",
 normalizationConfidence: pool ? "high" : "medium",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "vocabulary_games_map_to_lexis_translation_strand")
 };
 }
 if (cat === "writing") {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `english.sentence_writing_patterns.${pool || "writing"}`,
 normalizedTopicLabelHe: "",
 normalizationConfidence: "medium",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "writing_typing_modes_align_with_sentence_writing_strand")
 };
 }
 if (cat === "mixed") {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: "english.mixed_practice",
 normalizedTopicLabelHe: " - ",
 normalizationConfidence: "medium",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "mixed_practice_audit_often_skips_or_treats_as_composite")
 };
 }

 if (cat === "grammar") {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `english.grammar.${pool || "general"}`,
 normalizedTopicLabelHe: " ( )",
 normalizationConfidence: pool ? "high" : "medium",
 normalizationNotes:
 "Grammar pools vary by grade gate in product - audit uses pool key as subtype."
 };
 }
 if (cat === "translation") {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `english.vocabulary_translation.${pool || "general"}`,
 normalizedTopicLabelHe: " ()",
 normalizationConfidence: pool ? "high" : "medium",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "translation_pools_emphasize_vocabulary_phrases")
 };
 }
 if (cat === "sentence") {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `english.sentence_writing_patterns.${pool || "general"}`,
 normalizedTopicLabelHe: ", ",
 normalizationConfidence: pool ? "medium" : "medium",
 normalizationNotes:
 "Sentence pools touch writing-like patterns - not full composition curriculum."
 };
 }

 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `english.unmapped.${cat || "empty"}`,
 normalizedTopicLabelHe: " - ",
 normalizationConfidence: "low",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "expected_grammar_translation_sentence")
 };
}

/** @returns {NormalizedTopic} */
function normalizeScience(rawTopic, rawSubtopic) {
 const t = slug(rawTopic);
 const domainMap = {
 body: { key: "science.life_science_body", he: " - " },
 animals: { key: "science.life_science_animals", he: " - " },
 plants: { key: "science.life_science_plants", he: " - " },
 ecosystems: {
 key: "science.life_science_ecosystems",
 he: ""
 },
 matter: { key: "science.materials_matter", he: "" },
 materials: { key: "science.materials_matter", he: "" },
 energy: { key: "science.energy", he: "" },
 earth_space: {
 key: "science.earth_space_environment",
 he: ""
 },
 environment: {
 key: "science.earth_space_environment",
 he: ""
 },
 experiments: {
 key: "science.scientific_inquiry",
 he: ""
 },
 technology: {
 key: "science.technology_applications",
 he: ""
 }
 };

 const hit = domainMap[t];
 if (hit) {
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: hit.key,
 normalizedTopicLabelHe: hit.he,
 normalizationConfidence: "high",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "mapped_from_science_bank_topic_field")
 };
 }

 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `science.unmapped.${t || "empty"}`,
 normalizedTopicLabelHe: " - ",
 normalizationConfidence: "low",
 normalizationNotes: burnDownCopy("utils__curriculum-audit__curriculum-topic-normalizer", "extend_science_domain_map")
 };
}

/** @returns {NormalizedTopic} */
function normalizeGeography(rawTopic, rawSubtopic) {
 const t = slug(rawTopic);
 return {
 rawTopic,
 rawSubtopic,
 normalizedTopicKey: `moledet.bank.${t || "general"}`,
 normalizedTopicLabelHe: " / - ",
 normalizationConfidence: "medium",
 normalizationNotes:
 "Curriculum placement for Moledet/geography requires dedicated pedagogy review; kept advisory only."
 };
}
