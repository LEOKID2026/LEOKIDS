/**
 * Science & technology () — subsection catalog for audit alignment.
 * Owner reference: ` /science Curriculum2016.docx` (not parsed automatically).
 * Strand keys align with `ISRAELI_PRIMARY_CURRICULUM_MAP.science` (prefix match via findTopicPlacement).
 */

/** @typedef {'high' || 'medium' || 'low'} CatalogConfidence */

/**
 * @typedef {{
 * sectionKey: string,
 * labelHe: string,
 * strand: string,
 * mapsToNormalizedKeys: string[],
 * confidence: CatalogConfidence,
 * notes?: string,
 * }} ScienceCatalogSection
 */

const POP_SCIENCE =
 "https://pop.education.gov.il/tchumey_daat/mada-tehnologia/yesodi/technology-science-pedagogy/";
const OWNER_DOC_REL = " /science Curriculum2016.docx";

function sec(sectionKey, labelHe, strand, mapsToNormalizedKeys, confidence, notes = "") {
 return { sectionKey, labelHe, strand, mapsToNormalizedKeys, confidence, notes };
}

/** @type {Record<string, { grade: number, sourcePortalUrl: string, sourceDoc?: string, sections: ScienceCatalogSection[] }>} */
export const SCIENCE_OFFICIAL_SUBSECTION_CATALOG = {
 grade_1: {
 grade: 1,
 sourcePortalUrl: POP_SCIENCE,
 sourceDoc: OWNER_DOC_REL,
 sections: [
 sec(
 "g1_living_world",
 " - ",
 "life",
 [
 "science.life_science_body",
 "science.life_science_animals",
 "science.life_science_plants",
 ],
 "medium",
 " : ."
 ),
 sec(
 "g1_matter_earth",
 "",
 "matter_earth",
 ["science.materials_matter", "science.earth_space_environment"],
 "medium",
 ""
 ),
 sec(
 "g1_energy_inquiry_enrichment",
 " - / ",
 "energy_inquiry",
 ["science.energy", "science.scientific_inquiry"],
 "medium",
 " enrichment –."
 ),
 ],
 },
 grade_2: {
 grade: 2,
 sourcePortalUrl: POP_SCIENCE,
 sourceDoc: OWNER_DOC_REL,
 sections: [
 sec(
 "g2_life_materials",
 " - ",
 "life_matter",
 [
 "science.life_science_body",
 "science.life_science_animals",
 "science.life_science_plants",
 "science.materials_matter",
 ],
 "medium",
 ""
 ),
 sec(
 "g2_earth_energy_experiments",
 " , ",
 "earth_inquiry",
 [
 "science.earth_space_environment",
 "science.energy",
 "science.scientific_inquiry",
 ],
 "medium",
 ""
 ),
 ],
 },
 grade_3: {
 grade: 3,
 sourcePortalUrl: POP_SCIENCE,
 sourceDoc: OWNER_DOC_REL,
 sections: [
 sec(
 "g3_domains_expanded",
 " : , , , ",
 "domains",
 [
 "science.life_science_body",
 "science.life_science_animals",
 "science.life_science_plants",
 "science.materials_matter",
 "science.earth_space_environment",
 "science.energy",
 ],
 "medium",
 ""
 ),
 sec(
 "g3_inquiry_ecosystems",
 "",
 "inquiry_eco",
 ["science.scientific_inquiry", "science.life_science_ecosystems"],
 "medium",
 ""
 ),
 ],
 },
 grade_4: {
 grade: 4,
 sourcePortalUrl: POP_SCIENCE,
 sourceDoc: OWNER_DOC_REL,
 sections: [
 sec(
 "g4_core_domains",
 ": , , , ",
 "core",
 [
 "science.life_science_body",
 "science.life_science_animals",
 "science.materials_matter",
 "science.earth_space_environment",
 "science.energy",
 ],
 "medium",
 ""
 ),
 sec(
 "g4_inquiry_tech",
 "",
 "inquiry_tech",
 ["science.scientific_inquiry", "science.technology_applications"],
 "medium",
 ""
 ),
 ],
 },
 grade_5: {
 grade: 5,
 sourcePortalUrl: POP_SCIENCE,
 sourceDoc: OWNER_DOC_REL,
 sections: [
 sec(
 "g5_advanced_systems",
 ", , ",
 "systems",
 [
 "science.materials_matter",
 "science.energy",
 "science.earth_space_environment",
 "science.life_science_ecosystems",
 "science.scientific_inquiry",
 ],
 "medium",
 ""
 ),
 sec(
 "g5_life_allowed",
 " ( - allowed )",
 "life_allowed",
 ["science.life_science_body", "science.life_science_animals"],
 "low",
 " Curriculum2016.docx ."
 ),
 ],
 },
 grade_6: {
 grade: 6,
 sourcePortalUrl: POP_SCIENCE,
 sourceDoc: OWNER_DOC_REL,
 sections: [
 sec(
 "g6_synthesis",
 " : , , , ",
 "synthesis",
 [
 "science.materials_matter",
 "science.energy",
 "science.earth_space_environment",
 "science.life_science_ecosystems",
 "science.scientific_inquiry",
 ],
 "medium",
 ""
 ),
 sec(
 "g6_life_allowed",
 " - allowed ",
 "life_allowed",
 ["science.life_science_body", "science.life_science_animals"],
 "low",
 ""
 ),
 ],
 },
};
