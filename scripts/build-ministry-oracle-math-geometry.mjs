#!/usr/bin/env node
/**
 * Standalone Ministry oracle builder — math + geometry strands.
 * Writes partial/math-geometry.json only. Not wired to npm/CI/runtime.
 */
import {
  TXT_DIR,
  makeRowId,
  makeSequence,
  writePartial,
} from "./lib/ministry-oracle-shared.mjs";

const MAVO_FILE = `${TXT_DIR}/mavo1.txt`;
const RESOURCE_FILE = `${TXT_DIR}/resource_100673815.txt`;

/** Curated grade×strand cells from mavo1.txt lines 603–659 + resource corroboration. */
const MAVO_TABLE = [
  {
    grade: 1,
    rows: [
      { domain: "", topic: "", subtopic: ";   ", group: "measurement_length", index: 1 },
      { domain: "", topic: "  ", subtopic: " ", group: "transformations", index: 1 },
      { domain: "", topic: "", subtopic: ";  ", group: "geometry_properties", index: 1 },
    ],
  },
  {
    grade: 2,
    rows: [
      { domain: "", topic: "", subtopic: "  : \";   \" ", group: "measurement_length", index: 1 },
      { domain: "", topic: "", subtopic: "  ;    ", group: "measurement_time", index: 1 },
      { domain: "", topic: "", subtopic: ";   ", group: "measurement_area", index: 1 },
      { domain: "", topic: "", subtopic: "", group: "measurement_weight", index: 1 },
      { domain: "", topic: "  ", subtopic: "", group: "transformations", index: 1 },
      { domain: "", topic: "", subtopic: "", group: "solids", index: 1 },
    ],
  },
  {
    grade: 3,
    rows: [
      { domain: "", topic: "", subtopic: "   ;  ( )", group: "measurement_area", index: 1, geometry_strand: true },
      { domain: "", topic: " ", subtopic: "  ", group: "area_formulas", index: 1, geometry_strand: true },
      { domain: "", topic: "", subtopic: ", , ; , ;   ", group: "geometry_properties", index: 1, geometry_strand: true },
      { domain: "", topic: "", subtopic: "", group: "transformations", index: 1 },
      { domain: "", topic: "", subtopic: "", group: "volume", index: 1 },
    ],
  },
  {
    grade: 4,
    rows: [
      { domain: "", topic: " ", subtopic: " ; , , , ", group: "geometry_properties", index: 1, geometry_strand: true },
      { domain: "", topic: "", subtopic: "    ", group: "geometry_properties", index: 2, geometry_strand: true, resource_anchor: "  §  69–91; resource_100673815.txt" },
      { domain: "", topic: "  ", subtopic: "  +  ", group: "area_formulas", index: 1, geometry_strand: true },
      { domain: "", topic: "", subtopic: " ,  ;    ", group: "volume", index: 1, geometry_strand: true },
      { domain: "", topic: "", subtopic: "", group: "symmetry", index: 1 },
    ],
  },
  {
    grade: 5,
    rows: [
      { domain: "", topic: "", subtopic: ", ,  ", group: "geometry_properties", index: 1, geometry_strand: true, resource_anchor: "  § .   110–112" },
      { domain: "", topic: "", subtopic: "   ", group: "tiling", index: 1, geometry_strand: true, resource_anchor: "  § .3  112–113" },
      { domain: "", topic: "", subtopic: "  (, , )", group: "heights", index: 1, geometry_strand: true, row_id: "math.g5.geometry.heights", resource_anchor: "kita5.pdf § .4   113", prerequisite_ids: [], sequence_notes: "Official G5 order: § .4  before § .  ." },
      { domain: "", topic: " ", subtopic: "  ()", group: "area_formulas", index: 1, geometry_strand: true, row_id: "math.g5.measurement.area_formulas.rectangle_area", resource_anchor: "kita5.pdf § .    114–115", prerequisite_ids: ["math.g4.measurement.area_formulas.___"] },
      { domain: "", topic: " ", subtopic: "  ( ×  ÷ 2)", group: "area_formulas", index: 2, geometry_strand: true, row_id: "math.g5.measurement.area_formulas.triangle_area", resource_anchor: "kita5.pdf § .    114–115", status: "required", confidence: "high", internal_candidate_skill_id: "geometry:kind:triangle_area", prerequisite_ids: ["math.g5.geometry.heights", "math.g4.measurement.area_formulas.___"], sequence_notes: "After § .4 ; verified kita5.pdf § ." },
      { domain: "", topic: " ", subtopic: "  ", group: "area_formulas", index: 3, geometry_strand: true, row_id: "math.g5.measurement.area_formulas.parallelogram_trapezoid", resource_anchor: "  § .    114–115", prerequisite_ids: ["math.g5.measurement.area_formulas.triangle_area", "math.g5.geometry.heights"] },
    ],
  },
  {
    grade: 6,
    rows: [
      { domain: "", topic: "", subtopic: " ; ;  ", group: "volume", index: 1, geometry_strand: true },
      { domain: "", topic: " ", subtopic: " +  ", group: "circles", index: 1, geometry_strand: true },
      { domain: "", topic: "", subtopic: " /    ", group: "volume", index: 2, geometry_strand: true, prerequisite_ids: ["math.g5.measurement.area_formulas.triangle_area"] },
    ],
  },
];

function buildMavoRows() {
  const rows = [];
  for (const gradeBlock of MAVO_TABLE) {
    const { grade } = gradeBlock;
    for (const item of gradeBlock.rows) {
      const rowId = item.row_id
        ? item.row_id
        : item.row_key
          ? makeRowId("math", grade, item.domain, item.group, item.row_key)
          : makeRowId("math", grade, item.domain, item.group, item.subtopic);
      const status = item.status ?? "required_pending_pdf_parse";
      const corroborating = item.resource_anchor
        ? `resource_100673815.txt: ${item.resource_anchor}`
        : item.geometry_strand
          ? "mavo1.txt geometry progression table lines 603–659"
          : null;

      rows.push({
        row_id: rowId,
        subject: item.geometry_strand ? "geometry" : "math",
        grade,
        official_domain: item.domain,
        official_topic: item.topic,
        official_subtopic: item.subtopic,
        ministry_source_file: item.resource_anchor ? RESOURCE_FILE.replace(/\\/g, "/").split("/").slice(-2).join("/") : "    TXT/mavo1.txt",
        ministry_source_type: "txt",
        source_class: item.resource_anchor ? "official_supplement" : "official_primary",
        source_anchor: item.resource_anchor ?? `mavo1.txt lines 603–659, grade-${grade} ${item.domain}`,
        corroborating_source: corroborating,
        status,
        confidence: item.confidence ?? "medium",
        geometry_strand: Boolean(item.geometry_strand),
        internal_candidate_skill_id: item.internal_candidate_skill_id ?? null,
        notes:
          status === "required"
            ? item.sequence_notes ?? "Verified oracle row."
            : status === "required_pending_pdf_parse"
              ? "Strongly supported by mavo1.txt and/or resource_100673815.txt; not final until kita PDF parsed."
              : null,
        blocker_reason:
          status === "required_pending_pdf_parse"
            ? `Primary grade-${grade} Ministry PDF (kita${grade}.pdf) not yet parsed or anchored; confidence capped at medium.`
            : null,
        ...makeSequence({
          sequence_index: item.index,
          sequence_group: item.group,
          prerequisite_row_ids: item.prerequisite_ids ?? [],
          prerequisite_skill_ids: [],
          sequence_source_anchor: item.resource_anchor ? item.resource_anchor : "pedagogical_inferred",
          sequence_confidence: "medium",
          sequence_notes:
            item.sequence_notes ??
            `Order within grade ${grade} ${item.group} block inferred from Ministry table structure.`,
        }),
      });
    }
  }
  return rows;
}

function buildKitaPlaceholderRows() {
  const rows = [];
  for (let grade = 1; grade <= 6; grade += 1) {
    rows.push({
      row_id: makeRowId("math", grade, "kita_pdf_placeholder"),
      subject: "math",
      grade,
      official_domain: null,
      official_topic: null,
      official_subtopic: null,
      ministry_source_file: `  / ${["", "", "", "", "", ""][grade - 1]}.pdf`,
      ministry_source_type: "pdf",
      source_class: "official_primary",
      source_anchor: null,
      corroborating_source: null,
      status: "pending_parse",
      confidence: "low",
      geometry_strand: false,
      internal_candidate_skill_id: null,
      notes: "Primary grade PDF exists remotely but is not parsed to oracle rows in repo.",
      blocker_reason: `kita${grade}.pdf not yet parsed`,
      ...makeSequence({
        sequence_index: null,
        sequence_group: null,
        prerequisite_row_ids: [],
        prerequisite_skill_ids: [],
        sequence_source_anchor: null,
        sequence_confidence: null,
        sequence_notes: null,
      }),
    });
  }
  return rows;
}

const rows = [...buildMavoRows(), ...buildKitaPlaceholderRows()];

writePartial("math-geometry", {
  generated_at: new Date().toISOString(),
  source_script: "scripts/build-ministry-oracle-math-geometry.mjs",
  row_count: rows.length,
  rows,
});

console.log(`Wrote ${rows.length} math/geometry oracle rows to partial/math-geometry.json`);
