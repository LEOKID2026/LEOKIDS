#!/usr/bin/env node
/**
 * Generates data/science-questions-p1-g456-fill.js — P1 Science G4–G6 blockers.
 * Run: node scripts/gen-science-p1-g456-fill.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "science-questions-p1-g456-fill.js");

/** @typedef {[string, string[], number, string, string, string?, string?]} Row */
/** @type {Record<string, { subtype: string, rows: Row[] }>} */
const CELLS = {};
function add(key, subtype, rows) {
  CELLS[key] = { subtype, rows };
}

const opts4 = (a, b, c, d) => [a, b, c, d];

// ——— G4 ———
add("g4:body:easy", "sci_body_general", [
  ["    ?", opts4("   ", "  ", "  ", "   "), 0, "     .", "g4_body_digest_easy_a", "basic", "understanding"],
  ["      ?", opts4("", "", "", ""), 0, "  .", "g4_body_lungs_easy_b", "basic", "recall"],
  ["     ?", opts4("   ", "   ", "   ", "  "), 0, "   .", "g4_body_teeth_easy_c", "basic", "understanding"],
  ["   ?", opts4("  ", " ", " ", " "), 0, "   .", "g4_body_heart_easy_d", "basic", "recall"],
]);

add("g4:body:hard", "sci_body_general", [
  ["     ?", opts4("    ", " ", " ", "     "), 0, "  .", "g4_body_pulse_hard_a", "advanced", "application"],
  ["    ?", opts4("  ", " ", " ", " "), 0, "  .", "g4_body_blood_o2_hard_b", "advanced", "understanding"],
  ["   ?", opts4("  ", " ", " ", ""), 0, "  .", "g4_body_muscle_o2_hard_c", "advanced", "application"],
  ["     ?", opts4("   ", " ", " ", " "), 0, "   .", "g4_body_nerves_hard_d", "advanced", "understanding"],
  ["  ?", opts4("   ", " ", " ", " "), 0, "  .", "g4_body_kidney_hard_e", "advanced", "recall"],
  ["    ?", opts4("  ", " ", " ", "  "), 0, "  .", "g4_body_warmup_hard_f", "advanced", "application"],
]);

add("g4:experiments:easy", "sci_experiments_general", [
  [" ?", opts4("  ", " ", " ", " "), 0, "  .", "g4_exp_hyp_easy_a", "basic", "recall"],
  ["   ?", opts4("  ", "", " ", " "), 0, "  .", "g4_exp_table_easy_b", "basic", "understanding"],
  ["    ?", opts4("", "", "", " "), 0, "  .", "g4_exp_ruler_easy_c", "basic", "recall"],
  ["  ?", opts4(" ", " ", " ", " "), 0, " .", "g4_exp_variable_easy_d", "basic", "understanding"],
  ["     ?", opts4("  ", "", " ", " "), 0, " .", "g4_exp_safety_easy_e", "basic", "application"],
  ["   ?", opts4("  ", "", " ", " "), 0, " .", "g4_exp_control_easy_f", "basic", "understanding"],
]);

add("g4:experiments:hard", "sci_experiments_general", [
  ["   ?", opts4("  ", " ", "  ", " "), 0, "  .", "g4_exp_repeat_hard_a", "advanced", "understanding"],
  ["  ?", opts4("    ", " ", " ", " "), 0, " .", "g4_exp_error_hard_b", "advanced", "understanding"],
  ["  ?", opts4(" ", " ", " ", " "), 0, "  .", "g4_exp_units_hard_c", "advanced", "understanding"],
  ["   ?", opts4(" ", " ", " ", ""), 0, " .", "g4_exp_conclude_hard_d", "advanced", "application"],
  ["   ?", opts4("   ", " ", "  ", "   "), 0, "  .", "g4_exp_obs_exp_hard_e", "advanced", "application"],
]);

add("g4:animals:easy", "sci_animals_general", [
  ["  ?", opts4("   ", "", " ", " "), 0, "  .", "g4_anim_fish_easy_a", "basic", "recall"],
  ["    ?", opts4(", , , ", " ", " ", " "), 0, " .", "g4_anim_butterfly_easy_b", "basic", "understanding"],
  ["   ?", opts4("", " ", "", " "), 0, ".", "g4_anim_bee_easy_c", "basic", "understanding"],
  ["  ?", opts4("  ", "", " ", " "), 0, " .", "g4_anim_mammal_easy_d", "basic", "recall"],
  ["  ?", opts4("", "", "", ""), 0, " .", "g4_anim_cow_easy_e", "basic", "recall"],
  ["   ?", opts4("  ", "", " ", " "), 0, " .", "g4_anim_beak_easy_f", "basic", "understanding"],
]);

add("g4:animals:hard", "sci_animals_general", [
  ["    ?", opts4("   ", " ", " ", " "), 0, "  .", "g4_anim_predator_hard_a", "advanced", "application"],
  ["   ?", opts4("   ", "  ", " ", "  "), 0, "  .", "g4_anim_camel_hard_b", "advanced", "application"],
  ["  ?", opts4(" ", " ", " ", " "), 0, " = .", "g4_anim_camouflage_hard_c", "advanced", "understanding"],
  ["    ?", opts4(" ,  ", "  ", " ", " "), 0, " -.", "g4_anim_frog_hard_d", "advanced", "understanding"],
  ["     ?", opts4("  ", " ", " ", " "), 0, " .", "g4_anim_habitat_hard_e", "advanced", "application"],
]);

// ——— G5 ———
add("g5:body:easy", "sci_body_general", [
  ["  ?", opts4("   ", " ", "", " "), 0, " .", "g5_body_kidney_easy_a", "basic", "recall"],
  ["    ?", opts4(" ", "", " ", "  "), 0, "  .", "g5_body_pulse_easy_b", "basic", "understanding"],
  ["   ?", opts4(" ", "", " ", " "), 0, " .", "g5_body_nerves_easy_c", "basic", "recall"],
  ["   ?", opts4("  ", " ", " ", " "), 0, " .", "g5_body_nutrition_easy_d", "basic", "understanding"],
  ["  ?", opts4(" ", "", " ", " "), 0, " =  .", "g5_body_lungs_easy_e", "basic", "recall"],
  ["  ?", opts4("  ", " ", "", " "), 0, "  .", "g5_body_skin_easy_f", "basic", "understanding"],
]);

add("g5:body:medium", "sci_body_general", [
  ["    ?", opts4("   ", "  ", " ", " "), 0, " .", "g5_body_blood_lungs_med_a", "standard", "understanding"],
  ["   ?", opts4("  ", " ", " ", " "), 0, "  .", "g5_body_muscle_fatigue_med_b", "standard", "application"],
  ["  ?", opts4("   ", " ", "", " "), 0, "  .", "g5_body_liver_med_c", "standard", "understanding"],
  ["   ?", opts4(" ", " ", " ", " "), 0, "  .", "g5_body_hydration_med_d", "standard", "application"],
  ["   ?", opts4("  ", " ", " ", "  "), 0, " .", "g5_body_digest_med_e", "standard", "understanding"],
  ["  ?", opts4("  ", " ", " ", " "), 0, " =  .", "g5_body_pulse_mean_med_f", "standard", "recall"],
]);

add("g5:body:hard", "sci_body_general", [
  ["    ?", opts4("    ", " ", " ", " "), 0, "  .", "g5_body_cardio_hard_a", "advanced", "application"],
  ["   ?", opts4(" ", " ", " ", " "), 0, "  .", "g5_body_warmup_hard_b", "advanced", "application"],
  ["   ?", opts4("  ", "", "", ""), 0, "   .", "g5_body_vessels_hard_c", "advanced", "understanding"],
]);

add("g5:experiments:easy", "sci_experiments_general", [
  [" ?", opts4(" ", " ", "", ""), 0, " .", "g5_exp_hyp_easy_a", "basic", "recall"],
  ["  ?", opts4(" ", "", " ", " "), 0, " .", "g5_exp_var_easy_b", "basic", "understanding"],
  ["  ?", opts4("   ", "", " ", " "), 0, " = .", "g5_exp_log_easy_c", "basic", "understanding"],
  ["   ?", opts4(" ", "", "", " "), 0, "  .", "g5_exp_repeat_easy_d", "basic", "understanding"],
  ["   ?", opts4("", "", "", ""), 0, " .", "g5_exp_mass_easy_e", "basic", "recall"],
  ["  ?", opts4(" ", " ", "", " "), 0, " .", "g5_exp_safety_easy_f", "basic", "application"],
  ["  ?", opts4("  ", "", " ", " "), 0, " .", "g5_exp_control_easy_g", "basic", "understanding"],
]);

add("g5:animals:easy", "sci_animals_general", [
  ["  ?", opts4(" ", " ", " ", "  "), 0, "   .", "g5_anim_pred_easy_a", "basic", "understanding"],
  ["    ?", opts4(", , , ", " ", " ", " "), 0, " .", "g5_anim_insect_easy_b", "basic", "understanding"],
  ["  ?", opts4("", " ", "", " "), 0, ".", "g5_anim_bee_easy_c", "basic", "understanding"],
  ["  ?", opts4("", "", "", ""), 0, " .", "g5_anim_rabbit_easy_d", "basic", "recall"],
  ["  ?", opts4(" ", "", "", ""), 0, " = .", "g5_anim_reptile_easy_e", "basic", "recall"],
  ["   ?", opts4(" ", "", "", " "), 0, " .", "g5_anim_gills_easy_f", "basic", "understanding"],
  ["    ?", opts4("  ", "", "", ""), 0, " = .", "g5_anim_producer_easy_g", "basic", "recall"],
]);

add("g5:animals:medium", "sci_animals_general", [
  ["    ?", opts4("  ", " ", " ", " "), 0, " .", "g5_anim_food_web_med_a", "standard", "application"],
  ["   ?", opts4("  ", "", "", ""), 0, " .", "g5_anim_cold_med_b", "standard", "understanding"],
  ["  ?", opts4(" ", " ", " ", " "), 0, ".", "g5_anim_camouflage_med_c", "standard", "understanding"],
  ["    ?", opts4(" ", " ", " ", ""), 0, " .", "g5_anim_mammal_med_d", "standard", "understanding"],
  ["    ?", opts4(" ", " ", " ", " "), 0, " .", "g5_anim_nest_med_e", "standard", "application"],
  ["  ?", opts4(" ", "", " ", " "), 0, " .", "g5_anim_bird_med_f", "standard", "recall"],
]);

add("g5:animals:hard", "sci_animals_general", [
  ["    ?", opts4("   ", " ", " ", " "), 0, "  .", "g5_anim_habitat_loss_hard_a", "advanced", "application"],
  ["   ?", opts4("    ", " ", "  ", " "), 0, "  .", "g5_anim_food_chain_hard_b", "advanced", "application"],
  ["   ?", opts4("  ", " ", "", " "), 0, " .", "g5_anim_bat_hard_c", "advanced", "application"],
]);

// ——— G6 ———
add("g6:body:easy", "sci_body_general", [
  ["   ?", opts4("  ", " ", " ", " "), 0, " .", "g6_body_digest_easy_a", "basic", "understanding"],
  ["  ?", opts4(" ", "", " ", " "), 0, " = .", "g6_body_heart_easy_b", "basic", "recall"],
  ["  ?", opts4("  ", " ", " ", " "), 0, " .", "g6_body_water_easy_c", "basic", "understanding"],
  ["  ?", opts4(" ", "", "", ""), 0, " = .", "g6_body_lungs_easy_d", "basic", "recall"],
  ["   ?", opts4("  ", " ", " ", " "), 0, " = .", "g6_body_food_energy_easy_e", "basic", "understanding"],
]);

add("g6:body:medium", "sci_body_general", [
  ["   ?", opts4("  ", "  ", " ", " "), 0, "  .", "g6_body_o2_blood_med_a", "standard", "understanding"],
  ["   ?", opts4(" ", " ", "", ""), 0, " .", "g6_body_muscle_o2_med_b", "standard", "application"],
  ["  ?", opts4("  ", "", "", " "), 0, " .", "g6_body_kidney_med_c", "standard", "recall"],
  ["  ?", opts4(" ", "", " ", " "), 0, " .", "g6_body_nerves_med_d", "standard", "understanding"],
  ["   ?", opts4(" ", " ", " ", " "), 0, "  .", "g6_body_warmup_med_e", "standard", "application"],
  ["  ?", opts4(" ", "", "", ""), 0, " .", "g6_body_skin_med_f", "standard", "recall"],
]);

add("g6:body:hard", "sci_body_general", [
  ["    ?", opts4("   ", "", " ", " "), 0, "  .", "g6_body_pulse_hard_a", "advanced", "application"],
  ["   ?", opts4(" ", "", "", ""), 0, "  .", "g6_body_vessels_hard_b", "advanced", "understanding"],
  ["   ?", opts4(" ", " ", "", " "), 0, " .", "g6_body_cell_o2_hard_c", "advanced", "understanding"],
]);

add("g6:experiments:easy", "sci_experiments_general", [
  [" ?", opts4(" ", " ", "", ""), 0, " .", "g6_exp_hyp_easy_a", "basic", "recall"],
  ["  ?", opts4(" ", "", " ", ""), 0, ".", "g6_exp_var_easy_b", "basic", "understanding"],
  [" ?", opts4(" ", "", " ", ""), 0, ".", "g6_exp_log_easy_c", "basic", "understanding"],
  [" ?", opts4("", "", "", ""), 0, ".", "g6_exp_repeat_easy_d", "basic", "understanding"],
  [" ?", opts4("", "", "", ""), 0, ".", "g6_exp_units_easy_e", "basic", "understanding"],
  [" ?", opts4("  ", "", "", ""), 0, ".", "g6_exp_control_easy_f", "basic", "understanding"],
  [" ?", opts4("", "", "", ""), 0, ".", "g6_exp_safety_easy_g", "basic", "application"],
]);

add("g6:animals:easy", "sci_animals_general", [
  ["  ?", opts4(" ", "", " ", " "), 0, ".", "g6_anim_mammal_easy_a", "basic", "recall"],
  ["  ?", opts4("", "", "", ""), 0, " .", "g6_anim_cow_easy_b", "basic", "recall"],
  [" ?", opts4(" ", "", "", ""), 0, " .", "g6_anim_fish_easy_c", "basic", "recall"],
  [" ?", opts4("", " ", "", ""), 0, ".", "g6_anim_bee_easy_d", "basic", "understanding"],
  [" ?", opts4(" ", "", " ", ""), 0, ".", "g6_anim_bird_easy_e", "basic", "recall"],
  [" ?", opts4(" ", "", "", ""), 0, ".", "g6_anim_reptile_easy_f", "basic", "recall"],
  [" ?", opts4(" ", "", " ", " "), 0, ".", "g6_anim_pred_easy_g", "basic", "understanding"],
]);

add("g6:animals:medium", "sci_animals_general", [
  ["  ?", opts4("   ", " ", " ", " "), 0, " .", "g6_anim_food_web_med_a", "standard", "application"],
  ["  ?", opts4("  ", "", "", ""), 0, ".", "g6_anim_cold_med_b", "standard", "understanding"],
  [" ?", opts4("  ", "", "", ""), 0, ".", "g6_anim_camouflage_med_c", "standard", "understanding"],
  ["  ?", opts4(" ", "", "", ""), 0, ".", "g6_anim_cycle_med_d", "standard", "understanding"],
  ["   ?", opts4(" ", "", "", ""), 0, " .", "g6_anim_nest_med_e", "standard", "application"],
  ["  ?", opts4("   ", "", "", ""), 0, " .", "g6_anim_habitat_med_f", "standard", "understanding"],
  ["  ?", opts4(" ", "", "", ""), 0, ".", "g6_anim_seed_disp_med_g", "standard", "understanding"],
]);

add("g6:animals:hard", "sci_animals_general", [
  ["    ?", opts4(" ", "", " ", " "), 0, " .", "g6_anim_pred_prey_hard_a", "advanced", "application"],
  ["   ?", opts4("  ", "", "", " "), 0, "  .", "g6_anim_habitat_loss_hard_b", "advanced", "application"],
  ["  ?", opts4("", " ", "", ""), 0, ".", "g6_anim_bat_hard_c", "advanced", "application"],
  ["  -?", opts4(" ", " ", " ", " "), 0, "-.", "g6_anim_amphibian_hard_d", "advanced", "understanding"],
]);

const EXPECTED = {
  "g4:body:easy": 4, "g4:body:hard": 6, "g4:experiments:easy": 6, "g4:experiments:hard": 5,
  "g4:animals:easy": 6, "g4:animals:hard": 5,
  "g5:body:easy": 6, "g5:body:medium": 6, "g5:body:hard": 3,
  "g5:experiments:easy": 7, "g5:animals:easy": 7, "g5:animals:medium": 6, "g5:animals:hard": 3,
  "g6:body:easy": 5, "g6:body:medium": 6, "g6:body:hard": 3,
  "g6:experiments:easy": 7, "g6:animals:easy": 7, "g6:animals:medium": 7, "g6:animals:hard": 4,
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
  const [rawStem, options, correctIndex, explanation, conceptTag, pDiff, cog] = row;
  // Source templates must already be child-facing only (no grade/level framing).
  const stem = String(rawStem || "").trim();
  if (/^\s+[]/u.test(stem) || /\s+[a-z0-9_]+/iu.test(stem)) {
    throw new Error(
      `Dirty source stem in gen-science-p1 cell ${key}#${idx}: ${stem.slice(0, 80)}`
    );
  }
  const id = `sci_p1_${g}_${topic}_${lvl}_${String(idx + 1).padStart(2, "0")}`;
  const diff =
    pDiff ||
    (lvl === "hard" ? "advanced" : lvl === "medium" ? "standard" : "basic");
  const cogLevel =
    cog || (lvl === "hard" ? "application" : lvl === "medium" ? "understanding" : "recall");
  return {
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
      " P1      –   .",
      "     .",
    ],
    params: {
      patternFamily: `sci_p1_${topic}_${g}_${lvl}_${conceptTag}`,
      subtype,
      conceptTag,
      diagnosticSkillId: `sci_p1_${topic}_${conceptTag}`,
      probePower: "medium",
      expectedErrorTags: [conceptTag, "fact_recall_gap"],
      expectedErrorTypes: [conceptTag, "fact_recall_gap"],
      cognitiveLevel: cogLevel,
      difficulty: diff,
      kind: "p1_g456_fill",
    },
  };
}

const questions = [];
for (const [key, { subtype, rows }] of Object.entries(CELLS)) {
  rows.forEach((row, i) => questions.push(emitQuestion(key, subtype, row, i)));
}

const ids = new Set();
for (const q of questions) {
  if (ids.has(q.id)) {
    console.error("Duplicate id:", q.id);
    process.exit(1);
  }
  ids.add(q.id);
  if (!q.params.diagnosticSkillId || !q.params.conceptTag) {
    console.error("Missing metadata:", q.id);
    process.exit(1);
  }
  if (
    !q.params.expectedErrorTags?.length &&
    !q.params.expectedErrorTypes?.length
  ) {
    console.error("Missing error tags:", q.id);
    process.exit(1);
  }
}

async function validateAgainstBank() {
  const { SCIENCE_QUESTIONS } = await import(
    new URL("../data/science-questions.js", import.meta.url).href
  );
  function norm(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }
  for (const [key, { rows }] of Object.entries(CELLS)) {
    const [g, topic, lvl] = key.split(":");
    const existing = new Set();
    for (const q of SCIENCE_QUESTIONS) {
      for (const gr of q.grades || []) {
        if (gr !== g || q.topic !== topic) continue;
        const lv = q.minLevel || q.maxLevel || "medium";
        if (lv !== lvl) continue;
        existing.add(norm(q.stem));
      }
    }
    for (const row of rows) {
      const stem = norm(row[0]);
      if (existing.has(stem)) {
        console.error(`Stem collision in ${key}:`, row[0].slice(0, 60));
        process.exit(1);
      }
      existing.add(stem);
    }
  }
  for (const key of Object.keys(CELLS)) {
    const [g, topic, lvl] = key.split(":");
    const stems = new Set();
    for (const item of SCIENCE_QUESTIONS) {
      for (const g2 of item.grades || []) {
        if (g2 !== g || item.topic !== topic) continue;
        const l2 = item.minLevel || item.maxLevel || "medium";
        if (l2 !== lvl) continue;
        stems.add(norm(item.stem));
      }
    }
    for (const row of CELLS[key].rows) stems.add(norm(row[0]));
    if (stems.size < 10) {
      console.error(`After merge ${key} unique=${stems.size} < 10`);
      process.exit(1);
    }
  }
}

await validateAgainstBank();

const parts = questions.map((q) => JSON.stringify(q, null, 2));
const outJs = `/**
 * P1 Science fill — G4–G6 blockers (launch gate). Generated by scripts/gen-science-p1-g456-fill.mjs
 */
export const SCIENCE_QUESTIONS_P1_G456_FILL = [
${parts.join(",\n")},
];
`;

writeFileSync(OUT, outJs, "utf8");
console.log(`Wrote ${questions.length} questions to ${OUT}`);
console.log("Pre-write validation: OK (ids, metadata, no stem collisions, projected >=10 per cell)");
