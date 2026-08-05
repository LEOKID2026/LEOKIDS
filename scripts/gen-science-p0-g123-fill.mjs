#!/usr/bin/env node
/**
 * Generates data/science-questions-p0-g123-fill.js — P0 Science G1–G3 blocker fill.
 * Run: node scripts/gen-science-p0-g123-fill.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "science-questions-p0-g123-fill.js");

/** @typedef {[string, string[], number, string, string, string?, string?]} Row */

/** @type {Record<string, { subtype: string, rows: Row[] }>} */
const CELLS = {};

function add(key, subtype, rows) {
  CELLS[key] = { subtype, rows };
}

// ——— G1 body ———
add("g1:body:medium", "sci_body_general", [
  ["      ?", ["", "", "", ""], 0, "    .", "g1_body_lungs_role", "basic", "understanding"],
  ["     ?", ["     ", "    ", "    ", "   "], 0, "      .", "g1_body_hygiene_hands", "basic", "understanding"],
  ["     ?", ["", "", "", ""], 0, "     .", "g1_body_hearing", "basic", "recall"],
  ["   ?", ["  ", " ", " ", " "], 0, "   .", "g1_body_vision", "basic", "recall"],
  ["    ?", ["    ", "   ", "    ", "  "], 0, "    .", "g1_body_sleep", "basic", "understanding"],
  ["   ?", ["    ", " ", " ", "   "], 0, "   .", "g1_body_heart_pump", "basic", "recall"],
  ["     ?", ["", "", "", ""], 0, "   .", "g1_body_smell", "basic", "recall"],
  ["     ?", ["    ", "   ", "  ", "  "], 0, "   .", "g1_body_water", "basic", "understanding"],
  ["     ?", ["   ", "   ", " ", "   "], 0, "   .", "g1_body_teeth_care", "basic", "understanding"],
]);

add("g1:body:hard", "sci_body_general", [
  ["       ?", ["     ", "  ", "  ", "  "], 0, "    .", "g1_body_exercise_breath", "advanced", "application"],
  ["     ?", ["   ", "   ", "    ", "   "], 0, "    .", "g1_body_nose_safety", "advanced", "application"],
  ["       ?", ["   ", "    ", "   ", "    "], 0, "    .", "g1_body_food_energy", "advanced", "application"],
  ["   ?", [",   ", " ", "  ", " "], 0, "     .", "g1_body_skeleton", "advanced", "understanding"],
  ["      ?", ["  ", "  ", "  ", "  "], 0, "    .", "g1_body_head_protection", "advanced", "application"],
  ["      ?", ["    ", "  ", " ", "  "], 0, "    .", "g1_body_deep_breath", "advanced", "understanding"],
  ["     ?", ["     ", " ", "   ", "      "], 0, "      .", "g1_body_pulse_run", "advanced", "application"],
  ["       ?", ["    ", "     ", "     ", "   "], 0, "    .", "g1_body_pain_report", "advanced", "application"],
  ["   ?", ["   ", " ", " ", " "], 0, "    .", "g1_body_muscles", "advanced", "understanding"],
]);

// ——— G1 animals ———
add("g1:animals:medium", "sci_animals_general", [
  ["     ?", ["    ", "  ", "   ", " "], 0, "     .", "g1_animals_vs_plants", "basic", "understanding"],
  ["       ?", ["", "", "", ""], 0, "   .", "g1_animals_fish", "basic", "recall"],
  ["    ?", ["  ", " ", " ", ""], 0, "     .", "g1_animals_cow_diet", "basic", "recall"],
  ["   ?", ["     ", "  ", "    ", "  "], 0, "  .", "g1_animals_bird_flight", "basic", "understanding"],
  ["    ?", [" ", "  ", " ", "  "], 0, "    .", "g1_animals_bee_pollinate", "basic", "understanding"],
  ["    ?", ["", "", " ", ""], 0, "   .", "g1_animals_mammal", "basic", "recall"],
  ["   ?", ["  ", "  ", "  ", "  "], 0, "   .", "g1_animals_need_water", "basic", "understanding"],
  ["    ?", ["    ", "   ", " ", " "], 0, "   .", "g1_animals_cat_land", "basic", "understanding"],
  ["       ?", ["  ", " ", " ", ""], 0, "  .", "g1_animals_reptile_warm", "basic", "recall"],
]);

add("g1:animals:hard", "sci_animals_general", [
  ["    ?", ["    ", "   ", "  ", "   "], 0, "    .", "g1_animals_hibernate", "advanced", "application"],
  ["    ?", ["   ", " ", "  ", " "], 0, "  .", "g1_animals_nestling", "advanced", "understanding"],
  ["   ?", ["  ", " ", "   ", " "], 0, "   .", "g1_animals_gills", "advanced", "understanding"],
  ["    ?", ["     ", "   ", " ", "   "], 0, "  .", "g1_animals_predator", "advanced", "application"],
  ["    ?", ["   ", "   ", "  ", "   "], 0, "   .", "g1_animals_bat_night", "advanced", "application"],
  ["       ?", ["   ", "  ", "  ", " "], 0, "   .", "g1_animals_bird_cold", "advanced", "application"],
  ["   ?", ["    ", " ", "  ", "  "], 0, "   .", "g1_animals_cat_claws", "advanced", "application"],
  ["    ?", ["   ", " ", "  ", "  "], 0, "  .", "g1_animals_camouflage", "advanced", "understanding"],
  ["      ?", ["    ", "  ", "  ", "   "], 0, "  .", "g1_animals_nest_disturb", "advanced", "application"],
]);

// ——— G1 plants ———
add("g1:plants:medium", "sci_plants_general", [
  ["    ?", [",   ", "  ", "  ", " "], 0, "  ,   .", "g1_plants_needs", "basic", "understanding"],
  ["     ?", ["", " ", "", "  "], 0, "   .", "g1_plants_roots", "basic", "recall"],
  ["   ?", ["   ", "  ", " ", " "], 0, "   .", "g1_plants_leaves", "basic", "understanding"],
  ["   ?", ["  ", " ", "  ", " "], 0, "  .", "g1_plants_flower_color", "basic", "understanding"],
  ["    ?", ["    ", " ", "", "  "], 0, "  .", "g1_plants_seed_germ", "basic", "understanding"],
  ["     —  ?", [" ", "", "", ""], 0, "  .", "g1_plants_producer", "basic", "recall"],
  ["      ?", ["  ", "   ", "  ", " "], 0, " .", "g1_plants_fire_safety", "basic", "application"],
  ["   ?", ["    ", " ", " ", " "], 0, "  .", "g1_plants_fruit_role", "basic", "understanding"],
]);

add("g1:plants:hard", "sci_plants_general", [
  ["      ?", ["  ", "   ", "  ", " "], 0, "   .", "g1_plants_no_light", "advanced", "application"],
  ["      ?", [" ", "   ", " ", "  "], 0, "   .", "g1_plants_overwater", "advanced", "application"],
  ["    ?", ["  ", " ", " ", " "], 0, "   .", "g1_plants_tree_birds", "advanced", "application"],
  ["      ?", ["     ", "  ", "  ", "  "], 0, "  .", "g1_plants_food_chain", "advanced", "understanding"],
  ["     ?", ["   ", "  ", "  ", "   "], 0, "  .", "g1_plants_seed_wind", "advanced", "application"],
  ["     ?", ["    ", " ", "  ", " "], 0, "  .", "g1_plants_leaf_fall", "advanced", "understanding"],
  ["       ?", ["  ", "  ", "  ", "  "], 0, "  .", "g1_plants_pick_care", "advanced", "application"],
  ["     ?", ["    ", " ", " ", " "], 0, " .", "g1_plants_seed_coat", "advanced", "understanding"],
  ["     ?", ["   ", "   ", "    ", "   "], 0, "  .", "g1_plants_hardening", "advanced", "application"],
]);

// ——— G2 body ———
add("g2:body:medium", "sci_body_general", [
  ["    ?", ["   ", " ", " ", ""], 0, "  .", "g2_body_skeleton_role", "standard", "understanding"],
  ["    ?", ["  ", " ", " ", " "], 0, "   .", "g2_body_nutrition", "standard", "understanding"],
  ["   ?", [" ,  ", " ", " ", " "], 0, "  .", "g2_body_brain", "standard", "recall"],
  ["    ?", [" ", "", "", ""], 0, "   .", "g2_body_digestion", "standard", "recall"],
  ["    ?", ["  ", "  ", " ", "  "], 0, "  .", "g2_body_warmup", "standard", "application"],
  ["   ?", ["   ", "  ", " ", "  "], 0, "   .", "g2_body_thirst", "standard", "understanding"],
  ["         ?", ["   ", "  ", "  ", "   "], 0, "      .", "g2_body_skin_touch", "standard", "understanding"],
  ["     ?", ["  ", "  ", " ", "  "], 0, "   .", "g2_body_dental", "standard", "understanding"],
  ["     ?", ["  ", " ", " ", "  "], 0, "  .", "g2_body_heart_activity", "standard", "understanding"],
]);

add("g2:body:hard", "sci_body_general", [
  ["     ?", ["    ", " ", " ", " "], 0, "   .", "g2_body_breath_run", "advanced", "application"],
  ["    ?", ["  ", " ", " ", ""], 0, "  .", "g2_body_oxygen_muscle", "advanced", "understanding"],
  ["   ?", ["  ", " ", " ", " "], 0, "  .", "g2_body_blood", "advanced", "recall"],
  ["      ?", ["  ", "  ", "  ", "  "], 0, " .", "g2_body_brain_protect", "advanced", "application"],
  ["     ?", ["  ", "  ", " ", " "], 0, "  .", "g2_body_breakfast", "advanced", "application"],
  ["   ?", [" ", " ", "", " "], 0, "  .", "g2_body_arm_muscle", "advanced", "understanding"],
  ["    ?", [" ", "  ", " ", " "], 0, "  .", "g2_body_hydration_sport", "advanced", "application"],
  ["  ?", ["  ", " ", " ", " "], 0, "   .", "g2_body_pulse_meaning", "advanced", "understanding"],
]);

// ——— G2 experiments ———
add("g2:experiments:easy", "sci_experiments_general", [
  ["     ?", ["   ", "  ", " ", "  "], 0, "  .", "g2_exp_prepare", "basic", "recall"],
  ["      ?", ["", "", "", " "], 0, "  .", "g2_exp_ruler", "basic", "recall"],
  ["   ?", ["   ", " ", "  ", "  "], 0, "  .", "g2_exp_table", "basic", "understanding"],
]);

add("g2:experiments:medium", "sci_experiments_general", [
  ["    ?", ["  ", "  ", " ", "  "], 0, "  .", "g2_exp_variable", "standard", "understanding"],
  ["   ?", ["  ", "    ", "  ", "  "], 0, "  .", "g2_exp_repeat", "standard", "understanding"],
  ["  ?", ["  ", " ", " ", " "], 0, "  .", "g2_exp_hypothesis", "standard", "recall"],
  ["   ?", ["  ", "  ", "  ", "  "], 0, "  .", "g2_exp_control", "standard", "understanding"],
  ["   ?", ["  ", " ", " ", " "], 0, "  .", "g2_exp_conclude", "standard", "application"],
  ["     ?", ["  ", " ", "  ", "  "], 0, " .", "g2_exp_safety_taste", "standard", "application"],
  ["  ?", ["   ", "  ", " ", " "], 0, " = .", "g2_exp_reliable", "standard", "understanding"],
]);

add("g2:experiments:hard", "sci_experiments_general", [
  ["    ?", ["   ", " ", "  ", "   "], 0, "  .", "g2_exp_obs_vs_exp", "advanced", "application"],
  ["   ?", [",  ", "  ", " ", "  "], 0, "  .", "g2_exp_error", "advanced", "understanding"],
  ["      ?", ["   ", " ", " ", "  "], 0, "  .", "g2_exp_two_vars", "advanced", "application"],
  ["   ?", [" ", " ", " ", " "], 0, "  .", "g2_exp_units", "advanced", "understanding"],
  ["   ?", ["  ", " ", " ", " "], 0, "  .", "g2_exp_good_conclusion", "advanced", "application"],
  ["   ?", [" ", " ", "", " "], 0, "  .", "g2_exp_conditions", "advanced", "understanding"],
  ["   ?", [" ", " ", " ", " "], 0, "  .", "g2_exp_graph", "advanced", "application"],
]);

// ——— G2 animals ———
add("g2:animals:medium", "sci_animals_general", [
  ["  ?", ["   ", " ", "", "  "], 0, "  .", "g2_animals_fish", "standard", "recall"],
  ["  ?", [" ", "", "", ""], 0, " .", "g2_animals_rabbit", "standard", "recall"],
  ["    ?", [", , , ", " ", " ", " "], 0, " .", "g2_animals_butterfly", "standard", "understanding"],
  ["   ?", ["  ", "", " ", " "], 0, "  .", "g2_animals_beak", "standard", "understanding"],
  ["   ?", [" ", " ", " ", " "], 0, "  .", "g2_animals_fur", "standard", "understanding"],
  ["    ?", ["", "", "", ""], 0, " .", "g2_animals_lizard", "standard", "recall"],
  ["  ?", [" ", " ", " ", "  "], 0, "  .", "g2_animals_bees", "standard", "understanding"],
]);

add("g2:animals:hard", "sci_animals_general", [
  ["    ?", ["   ", "  ", " ", "  "], 0, "  .", "g2_animals_camel", "advanced", "application"],
  ["   ?", [" ", "  ", " ", " "], 0, " = .", "g2_animals_bat_echo", "advanced", "understanding"],
  ["    ?", ["   ", " ", " ", " "], 0, "   .", "g2_animals_habitat_loss", "advanced", "application"],
  ["  ?", [" ", "  ", " ", "  "], 0, "   .", "g2_animals_predator_role", "advanced", "understanding"],
  ["   ?", ["  ", "", "", " "], 0, "  .", "g2_animals_fins", "advanced", "understanding"],
  ["    ?", [" ,  ", "  ", " ", " "], 0, "   .", "g2_animals_frog_cycle", "advanced", "understanding"],
  ["      ?", ["  ", " ", " ", " "], 0, "   .", "g2_animals_wild_space", "advanced", "application"],
  ["    ?", ["  ", "", " ", " "], 0, " .", "g2_animals_bird_winter", "advanced", "application"],
  ["   ?", ["  ", "", " ", " "], 0, " = .", "g2_animals_whiskers", "advanced", "understanding"],
]);

// ——— G2 plants ———
add("g2:plants:medium", "sci_plants_general", [
  ["   ?", [" ", "", "", ""], 0, "  .", "g2_plants_photosynth", "standard", "understanding"],
  ["  ?", ["  ", " ", " ", " "], 0, " .", "g2_plants_stem", "standard", "recall"],
  ["  ?", ["  ", "", "", ""], 0, " =  .", "g2_plants_roots_role", "standard", "understanding"],
  ["  ?", ["  ", " ", "", " "], 0, " = .", "g2_plants_germinate", "standard", "understanding"],
  ["  ?", ["  ", " ", " ", " "], 0, "  .", "g2_plants_green", "standard", "understanding"],
]);

add("g2:plants:hard", "sci_plants_general", [
  ["   ?", [" ", " ", " ", " "], 0, " .", "g2_plants_shed", "advanced", "understanding"],
  ["   ?", ["  ", "", "  ", " "], 0, " .", "g2_plants_pollen", "advanced", "understanding"],
  ["      ?", ["  ", " ", " ", " "], 0, "   .", "g2_plants_water_safety", "advanced", "application"],
  ["   ?", ["", "", "", " "], 0, " = .", "g2_plants_producer_chain", "advanced", "recall"],
  ["    ?", ["  ", "", " ", "  "], 0, "роп .", "g2_plants_tropism", "advanced", "application"],
  ["    ?", ["", " ", "  ", " "], 0, " .", "g2_plants_no_water", "advanced", "application"],
]);

// ——— G3 body hard (5 new; 2 exist in batch1) ———
add("g3:body:hard", "sci_body_general", [
  ["    ?", ["   ", "  ", "  ", " "], 0, "  .", "g3_body_blood_lungs", "advanced", "application"],
  ["  ?", ["   ", " ", "", " "], 0, " .", "g3_body_kidney", "advanced", "understanding"],
  ["     ?", ["   ", " ", " ", " "], 0, " = .", "g3_body_heart_always", "advanced", "understanding"],
  ["   ?", ["  ", " ", " ", " "], 0, "  .", "g3_body_muscle_oxygen", "advanced", "application"],
  ["   ?", ["   ", " ", " ", " "], 0, " .", "g3_body_nerves", "advanced", "understanding"],
]);

// ——— G3 experiments ———
add("g3:experiments:easy", "sci_experiments_general", [
  ["    ?", ["", "", "", ""], 0, "  .", "g3_exp_thermometer", "basic", "recall"],
  ["    ?", ["  ", " ", "", " "], 0, "  .", "g3_exp_date_log", "basic", "understanding"],
  ["     ?", ["   ", " ", " ", " "], 0, " .", "g3_exp_seed_var", "basic", "understanding"],
  ["      ?", [" ", " ", " ", "  "], 0, " .", "g3_exp_hot_safety", "basic", "application"],
  ["  ?", [" ", " ", "", ""], 0, " .", "g3_exp_hypothesis_easy", "basic", "recall"],
  ["  ?", [" ", " ", "", " "], 0, "  .", "g3_exp_compare", "basic", "understanding"],
]);

add("g3:experiments:hard", "sci_experiments_general", [
  ["    ?", [" ", "", " ", " "], 0, " .", "g3_exp_control_var", "advanced", "application"],
  ["   ?", [" ", " ", "", " "], 0, " = .", "g3_exp_replicate", "advanced", "understanding"],
  ["  ?", ["    ", " ", " ", " "], 0, " .", "g3_exp_measurement_error", "advanced", "understanding"],
  ["  ?", [" ", "", " ", " "], 0, "  .", "g3_exp_units_hard", "advanced", "understanding"],
  ["   ?", [" ", " ", " ", ""], 0, " .", "g3_exp_data_conclusion", "advanced", "application"],
  ["   ?", ["  ", "", " ", " "], 0, " .", "g3_exp_control_group", "advanced", "application"],
]);

// ——— G3 animals ———
add("g3:animals:easy", "sci_animals_general", [
  ["  ?", ["  ", "", "   ", "  "], 0, " .", "g3_animals_mammal_easy", "basic", "recall"],
  ["  ?", ["", "", "", ""], 0, " .", "g3_animals_cow", "basic", "recall"],
  ["    ?", ["", "", "", ""], 0, " .", "g3_animals_water", "basic", "recall"],
  ["  ?", ["", " ", "", " "], 0, ".", "g3_animals_bee_easy", "basic", "understanding"],
  ["  ?", [" ", "", " ", "  "], 0, "  .", "g3_animals_bird_easy", "basic", "recall"],
  ["   ?", [" ", "", "", " "], 0, "  .", "g3_animals_gills_easy", "basic", "understanding"],
]);

add("g3:animals:hard", "sci_animals_general", [
  ["     ?", ["   ", " ", " ", " "], 0, " .", "g3_animals_cold_adapt", "advanced", "application"],
  ["    ?", ["  ", " ", " ", " "], 0, "  .", "g3_animals_food_web", "advanced", "application"],
  ["  ?", [" ", " ", " ", " "], 0, " = .", "g3_animals_camouflage_hard", "advanced", "understanding"],
  ["    ?", [", , ", " ", " ", " "], 0, " .", "g3_animals_mammal_cycle", "advanced", "understanding"],
  ["     ?", [" ", " ", " ", " "], 0, " .", "g3_animals_nest_hard", "advanced", "application"],
  ["   ?", ["   ", "  ", " ", " "], 0, " .", "g3_animals_predator_hard", "advanced", "application"],
]);

// ——— G3 plants easy (4 new) ———
add("g3:plants:easy", "sci_plants_general", [
  ["    ?", ["  ", " ", " ", " "], 0, " .", "g3_plants_needs_easy", "basic", "understanding"],
  ["   ?", ["", "", " ", " "], 0, " = .", "g3_plants_leaves_easy", "basic", "recall"],
  ["  ?", [" ", "", "", ""], 0, " .", "g3_plants_root_easy", "basic", "recall"],
  ["  ?", [" ", " ", " ", " "], 0, " .", "g3_plants_flower_easy", "basic", "understanding"],
]);

const EXPECTED = {
  "g1:body:medium": 9, "g1:body:hard": 9, "g1:animals:medium": 9, "g1:animals:hard": 9,
  "g1:plants:medium": 8, "g1:plants:hard": 9,
  "g2:body:medium": 9, "g2:body:hard": 8, "g2:experiments:easy": 3, "g2:experiments:medium": 7,
  "g2:experiments:hard": 7, "g2:animals:medium": 7, "g2:animals:hard": 9,
  "g2:plants:medium": 5, "g2:plants:hard": 6,
  "g3:body:hard": 5, "g3:experiments:easy": 6, "g3:experiments:hard": 6,
  "g3:animals:easy": 6, "g3:animals:hard": 6, "g3:plants:easy": 4,
};

for (const [key, n] of Object.entries(EXPECTED)) {
  const got = CELLS[key]?.rows?.length ?? 0;
  if (got !== n) {
    console.error(`Cell ${key}: expected ${n} rows, got ${got}`);
    process.exit(1);
  }
}

function emitQuestion(key, subtype, row, idx) {
  const [g, topic, lvl] = key.split(":");
  const [stem, options, correctIndex, explanation, conceptTag, pDiff = "basic", cog = "recall"] = row;
  const id = `sci_p0_${g}_${topic}_${lvl}_${String(idx + 1).padStart(2, "0")}`;
  const diff = lvl === "hard" ? "advanced" : lvl === "medium" ? (g === "g1" ? "basic" : "standard") : "basic";
  const cogLevel = cog || (lvl === "hard" ? "application" : lvl === "medium" ? "understanding" : "recall");
  const diffFinal = pDiff || diff;
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
      theoryLines: [
        " P0      –   .",
        "     .",
      ],
      params: {
        patternFamily: `sci_p0_${topic}_${g}_${lvl}_${conceptTag}`,
        subtype,
        conceptTag,
        diagnosticSkillId: `sci_p0_${topic}_${conceptTag}`,
        probePower: "medium",
        expectedErrorTags: [conceptTag, "fact_recall_gap"],
        expectedErrorTypes: [conceptTag, "fact_recall_gap"],
        cognitiveLevel: cogLevel,
        difficulty: diffFinal,
        kind: "p0_g123_fill",
      },
    },
    null,
    2,
  );
}

const parts = [];
for (const [key, { subtype, rows }] of Object.entries(CELLS)) {
  rows.forEach((row, i) => parts.push(emitQuestion(key, subtype, row, i)));
}

const outJs = `/**
 * P0 Science fill — G1–G3 core blockers (launch gate). Generated by scripts/gen-science-p0-g123-fill.mjs
 * Do not hand-edit; regenerate if batch structure changes.
 */
export const SCIENCE_QUESTIONS_P0_G123_FILL = [
${parts.join(",\n")},
];
`;

writeFileSync(OUT, outJs, "utf8");
console.log(`Wrote ${parts.length} questions to ${OUT}`);
