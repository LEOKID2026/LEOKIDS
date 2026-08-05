#!/usr/bin/env node
/**
 * Generates data/science-questions-phase-b.js — Phase B science expansion.
 * Run: node scripts/gen-science-phase-b.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "science-questions-phase-b.js");

/** @typedef {[string, string[], number, string, string, string, string]} Row */

/** @type {Record<string, { patternFamily: string, subtype: string, rows: Row[] }>} */
const CELLS = {};

function add(key, patternFamily, subtype, rows) {
  CELLS[key] = { patternFamily, subtype, rows };
}

const MAT = "sci_materials_properties";
const EARTH = "sci_earth_space_cycles";
const ENV = "sci_environment_conservation";

// ——— G1 materials ———
add("g1:materials:medium", MAT, "sci_materials_general", [
  ["    ?", [" ", " ", " ", " "], 0, "    .", "g1_materials_smooth", "basic", "recall"],
  ["   ?", ["  ", "  ", " ", " "], 0, "  .", "g1_materials_sponge_soft", "basic", "recall"],
  ["     ?", ["", "  ", " ", ""], 0, "    .", "g1_materials_cold_touch", "basic", "understanding"],
  ["    ?", ["  ", " ", " ", ""], 0, "    .", "g1_materials_plastic", "basic", "recall"],
]);
add("g1:materials:hard", MAT, "sci_materials_general", [
  ["    ?", ["  ", " ", " ", " "], 0, "    .", "g1_materials_hardness_compare", "advanced", "understanding"],
  ["    ?", ["   ", " ", " ", ""], 0, "   .", "g1_materials_sponge_press", "advanced", "application"],
  ["    ?", ["  ", " ", " ", " "], 0, "   .", "g1_materials_rough_test", "advanced", "application"],
  ["    ?", ["   ", "  ", "  ", " "], 0, "    .", "g1_materials_different_props", "advanced", "understanding"],
]);

// ——— G1 earth_space ———
add("g1:earth_space:medium", EARTH, "sci_earth_space_general", [
  ["   ?", [" ", " ", "  ", " "], 0, "    .", "g1_earth_sun_day", "basic", "recall"],
  ["   ?", ["   ", " ", " ", " "], 0, "   .", "g1_earth_shadow", "basic", "understanding"],
  ["    ?", [" ", " ", " ", "  "], 0, "   .", "g1_earth_winter_cold", "basic", "recall"],
  ["   ?", [" ", " ", " ", " "], 0, "   .", "g1_earth_night_sky", "basic", "recall"],
]);
add("g1:earth_space:hard", EARTH, "sci_earth_space_general", [
  ["   ?", ["  ", " ", " ", " "], 0, "     -.", "g1_earth_day_night_spin", "advanced", "understanding"],
  ["    ?", ["    ", "  ", " ", " "], 0, "   .", "g1_earth_cloud_cover", "advanced", "application"],
  ["    ?", ["    ", "  ", " ", " "], 0, "    .", "g1_earth_summer_heat", "advanced", "understanding"],
  ["   ?", ["  ", "  ", "    ", "  "], 0, "    .", "g1_earth_rain_coat", "advanced", "application"],
]);

// ——— G1 environment ———
add("g1:environment:medium", ENV, "sci_environment_general", [
  ["    ?", ["  ", " ", " ", " "], 0, "   .", "g1_env_trash_bin", "basic", "understanding"],
  ["   ?", ["  ", "  ", " ", " "], 0, "   .", "g1_env_plants_needs", "basic", "recall"],
  ["    ?", ["   ", "  ", "  ", " "], 0, "   .", "g1_env_mud_class", "basic", "understanding"],
  ["   ?", ["  ", "  ", "   ", "  "], 0, "    .", "g1_env_habitat_needs", "basic", "understanding"],
]);
add("g1:environment:hard", ENV, "sci_environment_general", [
  ["   ?", ["  ", "  ", "  ", "  "], 0, "   .", "g1_env_save_water", "advanced", "application"],
  ["     ?", ["   ", "  ", " ", " "], 0, "   .", "g1_env_sea_litter", "advanced", "application"],
  ["    ?", ["  ", " ", "  ", " "], 0, "   .", "g1_env_park_trees", "advanced", "understanding"],
  ["   ?", ["   ", " ", " ", " "], 0, "    .", "g1_env_visit_care", "advanced", "application"],
]);

// ——— G2 materials ———
add("g2:materials:hard", MAT, "sci_materials_general", [
  ["     ?", ["   ,  ", "  ", "  ", " "], 0, "   .", "g2_materials_metal_wood", "advanced", "understanding"],
  ["    ?", ["    ", "  ", " ", " "], 0, "   .", "g2_materials_transparent", "advanced", "application"],
  ["   ?", ["  ", "  ", "  ", "  "], 0, "   .", "g2_materials_plastic_light", "advanced", "understanding"],
  ["     ?", [" ", " ", "", " "], 0, "    .", "g2_materials_wax_melt", "advanced", "application"],
]);

// ——— G2 earth_space ———
add("g2:earth_space:medium", EARTH, "sci_earth_space_general", [
  ["    ?", ["  ", "  ", " ", " "], 0, "   .", "g2_earth_rain_signs", "standard", "recall"],
  ["   ?", ["   ", "  ", " ", " "], 0, "   .", "g2_earth_wind_cause", "standard", "understanding"],
]);
add("g2:earth_space:hard", EARTH, "sci_earth_space_general", [
  ["    ?", ["    ", " ", " ", " "], 0, "   .", "g2_earth_seasons", "advanced", "understanding"],
  ["    ?", ["  ", "  ", " ", " "], 0, "  .", "g2_earth_evaporation_heat", "advanced", "application"],
  ["    ?", ["   ", "  ", "  ", "  "], 0, "  .", "g2_earth_dead_sea_salt", "advanced", "understanding"],
  ["    ?", ["   ", " ", "  ", "  "], 0, "   .", "g2_earth_cloud_role", "advanced", "understanding"],
]);

// ——— G2 environment ———
add("g2:environment:medium", ENV, "sci_environment_general", [
  ["  ?", ["   ", " ", " ", " "], 0, "  .", "g2_env_recycle_bottles", "standard", "understanding"],
]);
add("g2:environment:hard", ENV, "sci_environment_general", [
  ["    ?", ["  ", " ", " ", " "], 0, "   .", "g2_env_no_burning", "advanced", "application"],
  ["   ?", ["  ", "  ", " ", " "], 0, "  .", "g2_env_stream_pollution", "advanced", "application"],
  ["   ?", ["  ", "  ", "  ", " "], 0, "   .", "g2_env_plant_trees", "advanced", "understanding"],
  ["   ?", ["   ", "  ", " ", " "], 0, "    .", "g2_env_trail_behavior", "advanced", "application"],
]);

// ——— G3 materials ———
add("g3:materials:easy", MAT, "sci_materials_general", [
  ["    ?", ["", "", " ", ""], 0, "  .", "g3_materials_conductor", "basic", "recall"],
  ["     ?", ["", "", " ", ""], 0, "   .", "g3_materials_water_liquid", "basic", "recall"],
]);
add("g3:materials:hard", MAT, "sci_materials_general", [
  ["     ?", ["   ", " ", " ", " "], 0, "    .", "g3_materials_ice_melt_rate", "advanced", "application"],
  ["     ?", ["  ,  ", " ", "  ", "  "], 0, "   .", "g3_materials_phys_vs_chem", "advanced", "understanding"],
]);

// ——— G3 earth_space ———
add("g3:earth_space:easy", EARTH, "sci_earth_space_general", [
  ["   ?", ["  ", " ", " ", ""], 0, "   -.", "g3_earth_day_night", "basic", "recall"],
  ["    ?", [" ", " ", "", " "], 0, "   .", "g3_earth_moon_light", "basic", "understanding"],
]);
add("g3:earth_space:hard", EARTH, "sci_earth_space_general", [
  ["     ?", ["  ", " ", "  ", " "], 0, "   .", "g3_earth_med_climate", "advanced", "understanding"],
  ["     ?", [" ", "  ", " ", " "], 0, "  .", "g3_earth_condensation", "advanced", "understanding"],
]);

// ——— G3 environment ———
add("g3:environment:easy", ENV, "sci_environment_general", [
  ["   ?", ["", "", "", ""], 0, "   .", "g3_env_food_chain_start", "basic", "recall"],
  ["  ?", ["  ", " ", " ", " "], 0, "   .", "g3_env_paper_recycle", "basic", "understanding"],
]);
add("g3:environment:hard", ENV, "sci_environment_general", [
  ["   ?", ["  ", " ", "  ", " "], 0, "  .", "g3_env_deforestation", "advanced", "application"],
  ["   ?", ["   ", " ", " ", " "], 0, "   .", "g3_env_air_pollution", "advanced", "application"],
]);

// ——— G4 materials ———
add("g4:materials:easy", MAT, "sci_materials_general", [
  ["    ?", ["  ", " ", "", ""], 0, "    .", "g4_materials_sand_water_sep", "basic", "application"],
  ["   ?", ["   ", " ", " ", " "], 0, " .", "g4_materials_liquid_shape", "basic", "recall"],
]);

// ——— G4 earth_space ———
add("g4:earth_space:easy", EARTH, "sci_earth_space_general", [
  ["   ?", ["    ", " ", " ", " "], 0, "   -.", "g4_earth_rotation_day", "basic", "understanding"],
  ["    ?", ["", "", "", ""], 0, "  .", "g4_earth_water_cycle_start", "basic", "recall"],
]);

// ——— G4 environment ———
add("g4:environment:easy", ENV, "sci_environment_general", [
  ["  ?", ["     ", "  ", "  ", "  "], 0, "    .", "g4_env_habitat_def", "basic", "recall"],
  ["    ?", ["", "", " ", " "], 0, "   .", "g4_env_sun_energy_chain", "basic", "understanding"],
]);

// ——— G5 materials ———
add("g5:materials:easy", MAT, "sci_materials_general", [
  ["    ?", ["", "", "", ""], 0, "   .", "g5_materials_insulator", "basic", "recall"],
  ["   ?", [" ", " ", " ", " "], 0, "   .", "g5_materials_physical_change", "basic", "understanding"],
  ["    ?", ["  ", " ", " ", " "], 0, "   .", "g5_materials_metal_props", "basic", "recall"],
]);
add("g5:materials:medium", MAT, "sci_materials_general", [
  ["     ?", [" ", " ", " ", "  "], 0, "   .", "g5_materials_dissolve_rate", "standard", "application"],
  ["    ?", ["   ", " ", "  ", "  "], 0, "   .", "g5_materials_mixture_compound", "standard", "understanding"],
]);

// ——— G5 earth_space ———
add("g5:earth_space:easy", EARTH, "sci_earth_space_general", [
  ["     ?", [",  ", " ", " ", " "], 0, "   .", "g5_earth_daily_weather", "basic", "understanding"],
  ["  ?", ["    ", "  ", " ", " "], 0, "   .", "g5_earth_wind_pressure", "basic", "understanding"],
]);

// ——— G5 environment ———
add("g5:environment:easy", ENV, "sci_environment_general", [
  ["   ?", ["    ", " ", " ", " "], 0, "    .", "g5_env_conservation", "basic", "recall"],
  ["  ?", ["  ", " ", " ", " "], 0, "  .", "g5_env_recycle_importance", "basic", "understanding"],
]);

// ——— G6 materials ———
add("g6:materials:easy", MAT, "sci_materials_general", [
  ["   ?", ["  ", " ", " ", " "], 0, "   .", "g6_materials_chemical_change", "basic", "understanding"],
  ["   ?", [" ", "", "", ""], 0, "  .", "g6_materials_insulator_plastic", "basic", "recall"],
  ["    ?", [",  ", " ", " ", " "], 0, "    .", "g6_materials_water_states", "basic", "recall"],
]);
add("g6:materials:medium", MAT, "sci_materials_general", [
  ["    ?", [" ", "  ", " ", " "], 0, "    .", "g6_materials_phase_change", "standard", "understanding"],
  ["    ?", ["  ", " ", "  ", " "], 0, "    .", "g6_materials_dissolution_factors", "standard", "application"],
]);

// ——— G6 earth_space ———
add("g6:earth_space:easy", EARTH, "sci_earth_space_general", [
  ["    ?", ["    ", " ", " ", " "], 0, "    .", "g6_earth_seasons_tilt", "basic", "understanding"],
  ["    ?", ["  ", " ", " ", "  "], 0, "   .", "g6_earth_sun_water_cycle", "basic", "understanding"],
]);

// ——— G6 environment ———
add("g6:environment:easy", ENV, "sci_environment_general", [
  ["  ?", ["  ", " ", " ", " "], 0, " =   .", "g6_env_biodiversity", "basic", "recall"],
  ["   ?", ["   ", " ", " ", " "], 0, "   .", "g6_env_water_pollution", "basic", "understanding"],
]);

const LEVEL_ABBR = { easy: "eas", medium: "med", hard: "hard" };

function emitQuestion(key, patternFamily, subtype, row, index) {
  const [g, topic, lvl] = key.split(":");
  const [stem, options, correctIndex, explanation, conceptTag, difficulty, cognitiveLevel] = row;
  const abbr = LEVEL_ABBR[lvl];
  const num = String(index + 1).padStart(2, "0");
  const id = `sci_phb_${g}_${topic}_${abbr}_${num}`;
  return JSON.stringify(
    {
      id,
      topic,
      grades: [g],
      minLevel: lvl,
      maxLevel: lvl,
      type: "mcq",
      stem,
      options,
      correctIndex,
      explanation,
      params: {
        patternFamily: `sci_phb_${topic}_${g}_${lvl}_${conceptTag}`,
        subtype,
        conceptTag,
        difficulty,
        cognitiveLevel,
        kind: "phase_b",
      },
    },
    null,
    2,
  );
}

const parts = [];
const summary = {};
for (const [key, { patternFamily, subtype, rows }] of Object.entries(CELLS)) {
  rows.forEach((row, i) => {
    parts.push(emitQuestion(key, patternFamily, subtype, row, i));
    summary[key] = (summary[key] || 0) + 1;
  });
}

const outJs = `/**
 * Phase B Science expansion — materials, earth_space, environment (g1–g6).
 * Generated by scripts/gen-science-phase-b.mjs
 * Do not hand-edit; regenerate if batch structure changes.
 */
export const SCIENCE_QUESTIONS_PHASE_B = [
${parts.join(",\n")},
];
`;

writeFileSync(OUT, outJs, "utf8");
console.log(`Wrote ${parts.length} questions to ${OUT}`);
console.log("Summary by cell:", summary);
const total = Object.values(summary).reduce((a, b) => a + b, 0);
console.log("Total:", total);
if (total !== 75) {
  console.error(`ERROR: expected 75 items, got ${total}`);
  process.exit(1);
}
