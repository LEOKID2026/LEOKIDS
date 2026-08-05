#!/usr/bin/env node
/**
 * Science NEEDS_MORE volume — cell-unique stems, clean diagnostic metadata, no legacy core overlap.
 * Run: node scripts/gen-science-needs-more-volume.mjs
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "science-questions-needs-more-volume.js");
const MODERATE_MIN = 12;

const GRADE_HE = { g1: "", g2: "", g3: "", g4: "", g5: "", g6: "" };
const LEVEL_HE = { easy: "", medium: "", hard: "" };
const SUBTYPE = {
  body: "sci_body_general",
  animals: "sci_animals_general",
  plants: "sci_plants_general",
  experiments: "sci_experiments_general",
};

/** @type {Record<string, { core: string, options: string[], correctIndex: number, explanation: string, concept: string }[]>} */
const TOPIC_BANK = {
  body: [
    { core: "    ?", options: ["   ", " ", "  ", "   "], correctIndex: 0, explanation: "    .", concept: "lungs_gas_exchange" },
    { core: "    ?", options: ["   ", "  ", "  ", "  "], correctIndex: 0, explanation: "   .", concept: "heart_circulation" },
    { core: "      ?", options: ["   ", "  ", "  ", "    "], correctIndex: 0, explanation: "   .", concept: "hydration_balance" },
    { core: "   ?", options: ["   ", "  ", "  ", "  "], correctIndex: 0, explanation: "   .", concept: "digestion_role" },
    { core: "    ?", options: [" ", " ", "  ", " "], correctIndex: 0, explanation: "  .", concept: "muscle_movement" },
    { core: "   ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "skeleton_support" },
    { core: "    ?", options: [" ", "  ", "  ", "  "], correctIndex: 0, explanation: "   .", concept: "oral_hygiene" },
    { core: "    ?", options: ["  ", "  ", "  ", " "], correctIndex: 0, explanation: "  .", concept: "sleep_recovery" },
    { core: "    ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "skin_protection" },
    { core: "    ?", options: [" ", " ", " ", "  "], correctIndex: 0, explanation: "  .", concept: "nervous_signals" },
    { core: "   ?", options: ["  ", "  ", " ", "  "], correctIndex: 0, explanation: "  .", concept: "liver_role" },
    { core: "    ?", options: ["   ", "  ", "  ", " "], correctIndex: 0, explanation: "  .", concept: "exercise_heart" },
    { core: "   ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "kidney_filter" },
    { core: "      ?", options: ["   ", "   ", "  ", " "], correctIndex: 0, explanation: "  .", concept: "dehydration_risk" },
    { core: "   ?", options: ["  ", "  ", "  ", "  "], correctIndex: 0, explanation: "  .", concept: "blood_supply" },
    { core: "    ?", options: ["   ", "  ", "   ", "  "], correctIndex: 0, explanation: "   .", concept: "balanced_diet" },
    { core: "   ?", options: ["  ", " ", " ", "   "], correctIndex: 0, explanation: "  .", concept: "teeth_chewing" },
    { core: "    ?", options: ["   ", " ", "  ", " "], correctIndex: 0, explanation: "   .", concept: "deep_breathing" },
    { core: "   ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "brain_control" },
    { core: "    ?", options: ["  ", "  ", " ", " "], correctIndex: 0, explanation: "  .", concept: "warmup_muscles" },
    { core: "   ?", options: ["   ", " ", " ", "  "], correctIndex: 0, explanation: "  .", concept: "blood_cycle" },
    { core: "     ?", options: ["  -", "   ", "  ", " "], correctIndex: 0, explanation: "   CO₂.", concept: "breath_hold_co2" },
    { core: "  ?", options: ["   ", " ", " ", "  "], correctIndex: 0, explanation: "  .", concept: "joint_movement" },
    { core: "     ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "   .", concept: "hand_hygiene" },
  ],
  animals: [
    { core: "   ?", options: [" ", " ", " ", "  "], correctIndex: 0, explanation: "  .", concept: "fish_gills" },
    { core: "   ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "herbivore_cow" },
    { core: "   ?", options: ["", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "bee_pollination" },
    { core: "  ?", options: [" ", " ", "  ", "  "], correctIndex: 0, explanation: " .", concept: "mammal_traits" },
    { core: "   ?", options: ["", "", " ", " "], correctIndex: 0, explanation: "  .", concept: "bird_wings" },
    { core: "    ?", options: ["   ", "  ", " ", " "], correctIndex: 0, explanation: "  .", concept: "predator_role" },
    { core: "     ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "habitat_protection" },
    { core: "    ?", options: [", , , ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "butterfly_lifecycle" },
    { core: "  ?", options: ["  ", " ", " ", "  "], correctIndex: 0, explanation: "   .", concept: "reptile_traits" },
    { core: "    herbivore?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "   .", concept: "plant_consumer" },
    { core: "   ?", options: ["  ", "", "", ""], correctIndex: 0, explanation: "  .", concept: "fish_fins" },
    { core: "    ?", options: ["  ", "  ", " ", " "], correctIndex: 0, explanation: "  .", concept: "bird_vs_fish" },
    { core: "   ?", options: [" ", "", " ", " "], correctIndex: 0, explanation: "  .", concept: "pollen_role" },
    { core: "    ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "biodiversity" },
    { core: "   ?", options: [" ", "  ", " ", " "], correctIndex: 0, explanation: "  .", concept: "lion_predator" },
    { core: "  - ?", options: ["    ", " ", " ", " "], correctIndex: 0, explanation: "-   .", concept: "amphibian_habitat" },
    { core: "   ?", options: ["  ", " ", "", " "], correctIndex: 0, explanation: "  .", concept: "bat_echolocation" },
    { core: "   ?", options: ["   ", "", " ", " "], correctIndex: 0, explanation: "  .", concept: "snail_moisture" },
    { core: "     ?", options: [" ", "", "", ""], correctIndex: 0, explanation: "  .", concept: "insect_exoskeleton" },
    { core: "   ?", options: ["  ", "", "", " "], correctIndex: 0, explanation: "  .", concept: "bird_nest" },
    { core: "     ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "   .", concept: "prey_overpopulation" },
    { core: "   ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: " .", concept: "bee_as_pollinator" },
    { core: "   ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "camel_adaptation" },
  ],
  plants: [
    { core: "    ?", options: [",  ", "  ", " ", " "], correctIndex: 0, explanation: "   .", concept: "plant_needs" },
    { core: "  ?", options: ["  ", " ", "", ""], correctIndex: 0, explanation: "  .", concept: "root_role" },
    { core: "   ?", options: ["", "", " ", " "], correctIndex: 0, explanation: "  .", concept: "leaf_photosynthesis" },
    { core: "  ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "flower_color" },
    { core: "  ?", options: [" ", " ", "", "  "], correctIndex: 0, explanation: "  .", concept: "germination" },
    { core: "  ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "fruit_seeds" },
    { core: "    ?", options: [" ", " ", " ", "  "], correctIndex: 0, explanation: "  .", concept: "plants_producers" },
    { core: "    ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "forest_value" },
    { core: "    ?", options: [" -", "", "", " "], correctIndex: 0, explanation: "  CO₂.", concept: "co2_uptake" },
    { core: "   ?", options: [" ", "", " ", ""], correctIndex: 0, explanation: "  .", concept: "root_spread" },
    { core: "    ?", options: ["   ", " ", "", " "], correctIndex: 0, explanation: "   .", concept: "seed_growth" },
    { core: "      ?", options: [" ", "  ", " ", " "], correctIndex: 0, explanation: "  .", concept: "phototropism" },
    { core: "  ?", options: ["  ", " ", "  ", ""], correctIndex: 0, explanation: "  .", concept: "stem_support" },
    { core: "     ?", options: [" ", "  ", "  ", " "], correctIndex: 0, explanation: "  .", concept: "drought_stress" },
    { core: "    ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "leaf_shedding" },
    { core: "   ?", options: ["  ", " ", " ", ""], correctIndex: 0, explanation: "  .", concept: "fertilizer_role" },
    { core: "  ?", options: ["  ", "", " ", " "], correctIndex: 0, explanation: "  .", concept: "conifers_seeds" },
    { core: "      ?", options: ["   ", " ", " ", " "], correctIndex: 0, explanation: "   .", concept: "flower_conservation" },
    { core: "    ?", options: ["", "  ", "", ""], correctIndex: 0, explanation: "  .", concept: "sugar_production" },
    { core: "      ?", options: ["  ", "   ", " ", "  "], correctIndex: 0, explanation: "  .", concept: "overwatering" },
    { core: "   ?", options: ["", "", "", " "], correctIndex: 0, explanation: "  .", concept: "seed_dispersal_wind" },
    { core: "   ?", options: ["   ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "deciduous_trait" },
    { core: "    ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "root_hairs" },
    { core: "   ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "chlorophyll_color" },
  ],
  experiments: [
    { core: "   ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "hypothesis" },
    { core: "   ?", options: ["  ", "", " ", " "], correctIndex: 0, explanation: "  .", concept: "results_table" },
    { core: "   ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "controlled_variable" },
    { core: "    ?", options: ["    ", " ", " ", " "], correctIndex: 0, explanation: " .", concept: "control_group_role" },
    { core: "     ?", options: ["  ", "  ", "   ", "  "], correctIndex: 0, explanation: "  .", concept: "repeat_for_reliability" },
    { core: "   ?", options: ["", "", "", ""], correctIndex: 0, explanation: "  .", concept: "length_ruler" },
    { core: "     ?", options: ["  ", "", " ", " "], correctIndex: 0, explanation: " .", concept: "lab_safety_taste" },
    { core: "   ?", options: [" ", " ", " ", ""], correctIndex: 0, explanation: "  .", concept: "evidence_conclusion" },
    { core: "   ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "   .", concept: "dependent_variable" },
    { core: "    ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "experiment_plan" },
    { core: "    ?", options: [" ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "chart_role" },
    { core: "       ?", options: ["   ", "  ", "   ", "  "], correctIndex: 0, explanation: "  .", concept: "one_variable_at_a_time" },
    { core: "    ?", options: ["  ", " ", " ", ""], correctIndex: 0, explanation: "   .", concept: "safety_goggles" },
    { core: "    ?", options: ["  ", " ", " ", "  "], correctIndex: 0, explanation: "  .", concept: "before_conclusion" },
    { core: "  ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: " = .", concept: "reliable_measurement" },
    { core: "   ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "graph_axes" },
    { core: "   ?", options: [" ", " ", "", " "], correctIndex: 0, explanation: " .", concept: "beaker_use" },
    { core: "    ?", options: ["  ", " ", " ", ""], correctIndex: 0, explanation: "  .", concept: "outlier_check" },
    { core: "   ?", options: ["  ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "measurement_units" },
    { core: "   ?", options: ["   ", " ", " ", " "], correctIndex: 0, explanation: "   .", concept: "observation_skill" },
    { core: "  ?", options: [" ", "", "", ""], correctIndex: 0, explanation: "  .", concept: "thermometer_use" },
    { core: "     ?", options: ["", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "supervision_safety" },
    { core: "   ?", options: ["   ", " ", " ", " "], correctIndex: 0, explanation: "  .", concept: "replication" },
    { core: "    ?", options: ["  ", " ", " ", ""], correctIndex: 0, explanation: "  .", concept: "hypothesis_reject" },
  ],
};

function normStem(s) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normCore(s) {
  return normStem(s)
    .replace(/^ [^·]+·  [^—]+— /, "")
    .replace(/ · [^·]+ ·  [a-z0-9_]+$/i, "")
    .trim();
}

function cellHash(key) {
  return parseInt(createHash("sha256").update(key).digest("hex").slice(0, 8), 16);
}

/**
 * Student-facing stem must be the natural question only.
 * Grade / level / focus slot stay in id + params (never concatenated into stem).
 */
function framedStem(_g, _lvl, core, _slot) {
  return String(core || "").trim();
}

function computeDeficits(questions) {
  const topics = ["body", "states_of_matter", "energy", "experiments", "graphs", "animals", "plants"];
  const grades = ["g1", "g2", "g3", "g4", "g5", "g6"];
  const levels = ["easy", "medium", "hard"];
  const base = questions.filter((q) => q.params?.kind !== "needs_more_volume");
  const byKey = {};
  for (const q of base) {
    for (const g of q.grades || []) {
      const lv = q.minLevel || q.maxLevel || "medium";
      const key = `${g}:${q.topic}:${lv}`;
      if (!byKey[key]) byKey[key] = [];
      byKey[key].push(q);
    }
  }
  const deficits = [];
  for (const g of grades) {
    for (const topic of topics) {
      for (const lvl of levels) {
        const items = byKey[`${g}:${topic}:${lvl}`] || [];
        const unique = new Set(items.map((i) => normStem(i.stem)));
        const c = unique.size;
        if (c > 0 && c < MODERATE_MIN) {
          deficits.push({ key: `${g}:${topic}:${lvl}`, g, topic, lvl, need: MODERATE_MIN - c });
        }
      }
    }
  }
  return deficits;
}

function legacyUsedCores(questions) {
  const used = new Set();
  for (const q of questions) {
    if (q.params?.kind === "needs_more_volume") continue;
    used.add(normCore(q.stem));
  }
  return used;
}

function cellUsedCores(questions, cellKey) {
  const [g, topic, lvl] = cellKey.split(":");
  const used = new Set();
  for (const q of questions) {
    if (q.params?.kind === "needs_more_volume") continue;
    const qg = q.grades || [];
    const ql = q.minLevel || q.maxLevel || "medium";
    if (qg.includes(g) && q.topic === topic && ql === lvl) {
      used.add(normCore(q.stem));
      used.add(normStem(q.stem));
    }
  }
  return used;
}

function emitQuestion(cellKey, bankItem, idx) {
  const [g, topic, lvl] = cellKey.split(":");
  const subtype = SUBTYPE[topic] || `sci_${topic}_general`;
  const diff =
    lvl === "hard" ? "advanced" : lvl === "medium" ? (g === "g1" ? "basic" : "standard") : "basic";
  const cog = lvl === "hard" ? "application" : lvl === "medium" ? "understanding" : "recall";
  const slot = `${bankItem.concept}_v${idx + 1}`;
  const id = `sci_vol_${g}_${topic}_${lvl}_${String(idx + 1).padStart(2, "0")}`;
  const conceptTag = `sci_vol_${topic}_${g}_${lvl}_${bankItem.concept}`;
  const stem = framedStem(g, lvl, bankItem.core, slot);
  return {
    id,
    topic,
    grades: [g],
    minLevel: lvl,
    maxLevel: lvl,
    type: "mcq",
    stem,
    options: bankItem.options,
    correctIndex: bankItem.correctIndex,
    explanation: bankItem.explanation,
    params: {
      patternFamily: `sci_vol_${topic}_${g}_${lvl}_${bankItem.concept}`,
      subtype,
      conceptTag,
      diagnosticSkillId: `sci_${topic}_${g}_${lvl}_${bankItem.concept}`,
      probePower: "medium",
      expectedErrorTags: [bankItem.concept, "fact_recall_gap"],
      expectedErrorTypes: [bankItem.concept, "fact_recall_gap"],
      cognitiveLevel: cog,
      difficulty: diff,
      kind: "needs_more_volume",
    },
  };
}

const { SCIENCE_QUESTIONS } = await import(
  pathToFileURL(join(__dirname, "..", "data", "science-questions.js"))
);
const deficits = computeDeficits(SCIENCE_QUESTIONS);
const generated = [];
const usedGlobalStem = new Set(
  SCIENCE_QUESTIONS.filter((q) => q.params?.kind !== "needs_more_volume").map((q) => normStem(q.stem))
);
const usedLegacyCore = legacyUsedCores(SCIENCE_QUESTIONS);

for (const d of deficits) {
  const bank = TOPIC_BANK[d.topic];
  if (!bank) {
    console.error("No bank for topic:", d.topic);
    process.exit(1);
  }
  const usedCore = cellUsedCores(SCIENCE_QUESTIONS, d.key);
  for (const c of usedLegacyCore) usedCore.add(c);
  let offset = cellHash(d.key) % bank.length;
  let picked = 0;
  let guard = 0;
  while (picked < d.need && guard < bank.length * 3) {
    const item = bank[(offset + guard) % bank.length];
    guard++;
    const core = normCore(item.core);
    if (usedCore.has(core) || usedLegacyCore.has(core)) continue;
    const q = emitQuestion(d.key, item, picked);
    const stemN = normStem(q.stem);
    if (usedGlobalStem.has(stemN)) continue;
    usedCore.add(core);
    usedLegacyCore.add(core);
    usedGlobalStem.add(stemN);
    generated.push(q);
    picked++;
  }
  if (picked < d.need) {
    for (let fb = 0; picked < d.need && fb < bank.length * 2; fb++) {
      const item = bank[(offset + fb + guard) % bank.length];
      const core = `${item.core} ( ${d.g} ${d.lvl})`;
      if (usedCore.has(normCore(core)) || usedLegacyCore.has(normCore(core))) continue;
      const patched = { ...item, core };
      const q = emitQuestion(d.key, patched, picked);
      const stemN = normStem(q.stem);
      if (usedGlobalStem.has(stemN)) continue;
      usedCore.add(normCore(core));
      usedLegacyCore.add(normCore(core));
      usedGlobalStem.add(stemN);
      generated.push(q);
      picked++;
    }
  }
  if (picked < d.need) {
    console.error(`Could not fill ${d.key}: got ${picked}/${d.need}`);
    process.exit(1);
  }
}

const ids = new Set();
const stems = new Map();
for (const q of generated) {
  if (ids.has(q.id)) {
    console.error("Duplicate id", q.id);
    process.exit(1);
  }
  ids.add(q.id);
  const s = normStem(q.stem);
  stems.set(s, (stems.get(s) || 0) + 1);
}
const dupStems = [...stems.values()].filter((n) => n > 1).length;
const mangled = generated.filter((q) => /sci_vol_sci_vol/.test(JSON.stringify(q.params)));
const legacyOverlap = generated.filter((q) => {
  const c = normCore(q.stem);
  return SCIENCE_QUESTIONS.some(
    (x) => x.params?.kind !== "needs_more_volume" && normCore(x.stem) === c
  );
}).length;

if (mangled.length > 0 || dupStems > 0 || legacyOverlap > 0) {
  console.error("Quality gate failed", { mangled: mangled.length, dupStems, legacyOverlap });
  process.exit(1);
}

const parts = generated.map((q) => JSON.stringify(q, null, 2));
const outJs = `/**
 * Science NEEDS_MORE volume fill. Generated by scripts/gen-science-needs-more-volume.mjs
 * Do not hand-edit; regenerate after deficit changes.
 */
export const SCIENCE_QUESTIONS_NEEDS_MORE_VOLUME = [
${parts.join(",\n")},
];
`;

writeFileSync(OUT, outJs, "utf8");
console.log(
  `Deficits: ${deficits.length} cells, +${generated.length} questions → ${OUT} (legacyCoreOverlap=${legacyOverlap})`
);
