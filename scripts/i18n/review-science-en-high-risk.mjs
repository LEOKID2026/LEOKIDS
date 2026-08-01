/**
 * Independent pedagogical review of high-risk reconstructed Science EN records.
 * Outputs pass/fail with structured findings — does not modify banks.
 */
import fs from "fs";
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";

const highRisk = JSON.parse(
  fs.readFileSync("reports/science-en-qa/high-risk-reconstructed.json", "utf8")
);
const byId = Object.fromEntries(SCIENCE_QUESTIONS.map((q) => [q.id, q]));

/** Keyword maps: diagnostic/concept → expected content signals */
const SKILL_SIGNALS = [
  {
    id: /seed_dispersal/i,
    need: /\b(seeds?|dispers\w*|spread|wind|animals?|fruit|hooks?|float)\b/i,
    // Check stem+correct+explanation only (not distractors)
    avoidDominant: /\b(cellular respiration|use oxygen to release energy)\b/i,
  },
  {
    id: /photosynthesis|light_photosynthesis|photosynthesis_needs/i,
    need: /\b(photosynthes\w*|sunlight|chlorophyll|glucose|carbon dioxide|make food|light)\b/i,
  },
  {
    id: /stomata/i,
    need: /\b(stomata|gas|carbon dioxide|oxygen|leaf)\b/i,
  },
  {
    id: /pollination/i,
    need: /\b(pollen|pollinat\w*|flower|insect|bee)\b/i,
  },
  {
    id: /oral_hygiene|teeth/i,
    need: /\b(teeth|tooth|brush|cavity|chew|gum)\b/i,
  },
  {
    id: /joint_movement/i,
    need: /\b(joints?|bones?|muscles?|move|movement)\b/i,
  },
  {
    id: /hypothesis/i,
    need: /\b(hypothesis|predict|testable)\b/i,
  },
  {
    id: /amphibian/i,
    need: /\b(amphibians?|frogs?|toads?|both (in )?water and (on )?land|moist)\b/i,
  },
  {
    id: /reptile/i,
    need: /\b(reptiles?|scales?|snakes?|lizards?|dry,? scaly skin)\b/i,
  },
  {
    id: /mixture_compound/i,
    need: /\b(mixture|compound|chemical)\b/i,
  },
  {
    id: /chemical_change/i,
    need: /\b(chemical|new substance|rust|burn|react)\b/i,
  },
  {
    id: /water_states|water_liquid/i,
    need: /\b(solid|liquid|gas|water|ice|steam|melt|freeze)\b/i,
  },
  {
    id: /day_night|sun_day|day_night_spin/i,
    need: /\b(day|night|spin|axis|Earth|Sun|rotate)\b/i,
  },
  {
    id: /trail_behavior/i,
    need: /\b(trail|ants?|pheromone|follow|path|food)\b/i,
  },
  {
    id: /habitat/i,
    need: /\b(habitat|home|live|shelter|food|water)\b/i,
  },
  {
    id: /trash_bin|save_water|recycling|sustainability/i,
    need: /\b(trash|bin|recycl\w*|reuse|reduce|water|waste|protect|sustainab\w*)\b/i,
  },
];

function neighbors(q, limit = 4) {
  return SCIENCE_QUESTIONS.filter(
    (x) =>
      x.id !== q.id &&
      x.topic === q.topic &&
      (x.grades || []).some((g) => (q.grades || []).includes(g))
  )
    .slice(0, limit)
    .map((x) => ({ id: x.id, stem: x.stem, diag: x.params?.diagnosticSkillId }));
}

function reviewOne(entry) {
  const q = byId[entry.id];
  const ov = SCIENCE_EN_OVERLAY[q.id] || {};
  const stem = ov.stem ?? q.stem;
  const options = ov.options ?? q.options;
  const explanation = ov.explanation ?? q.explanation;
  const theory = ov.theoryLines ?? q.theoryLines ?? [];
  const ci = q.correctIndex;
  const correct = String(options[ci] ?? "");
  const diag = String(q.params?.diagnosticSkillId || q.skillId || "");
  const concept = String(q.params?.conceptTag || "");
  const grades = q.grades || [];
  const blob = [stem, ...options, explanation, ...(theory || [])].join(" \n ");

  const findings = [];
  const checks = {
    science_correct: true,
    one_clear_correct: true,
    correctIndex_right: true,
    distractors_plausible: true,
    explanation_fits: true,
    grade_fit: true,
    topic_skill_fit: true,
    diagnostic_fit: true,
    no_answer_leak: true,
    unsupported_assumption: false,
  };

  // Required fields
  if (!stem?.trim() || options.some((o) => !String(o).trim()) || !String(explanation || "").trim()) {
    findings.push({ code: "empty_field", detail: "missing required text" });
    checks.science_correct = false;
  }
  if (ci < 0 || ci >= options.length) {
    findings.push({ code: "correctIndex_oob", detail: String(ci) });
    checks.correctIndex_right = false;
  }

  // Duplicate options
  const norm = options.map((o) => String(o).trim().toLowerCase());
  if (new Set(norm).size !== norm.length) {
    findings.push({ code: "duplicate_options", detail: "duplicate choices" });
    checks.one_clear_correct = false;
  }

  // Answer leakage
  const key = correct.toLowerCase().replace(/[.?!,]/g, "");
  if (key.length >= 24 && stem.toLowerCase().replace(/[.?!,]/g, "").includes(key.slice(0, 24))) {
    findings.push({ code: "answer_leakage", detail: "stem contains correct option" });
    checks.no_answer_leak = false;
  }

  // Soft science red flags
  if (/\b(always never|never always|digest rocks|green fur|motor oil|hunt whales)\b/i.test(correct)) {
    findings.push({ code: "correct_looks_wrong", detail: correct.slice(0, 80) });
    checks.correctIndex_right = false;
    checks.science_correct = false;
  }

  // Explanation should mention a theme from correct answer (soft)
  const correctTokens = correct
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 5)
    .slice(0, 6);
  const explLow = String(explanation || "").toLowerCase();
  if (correctTokens.length >= 2) {
    const hit = correctTokens.filter((t) => explLow.includes(t)).length;
    if (hit === 0 && explLow.length > 20) {
      findings.push({
        code: "explanation_weak_link",
        detail: "explanation shares no key tokens with correct option",
      });
      checks.explanation_fits = false;
    }
  }

  // Grade vs jargon
  const hard = /\b(mitochondria|hemoglobin|osmosis|allele|chromosome|stoichiometr)\b/i;
  if (grades.some((g) => Number(String(g).replace(/\D/g, "")) <= 2) && hard.test(blob)) {
    findings.push({ code: "age_mismatch", detail: "advanced jargon for early grade" });
    checks.grade_fit = false;
  }

  // Topic keyword soft check
  const topic = q.topic;
  const topicNeed = {
    body: /\b(bod(?:y|ies)|organs?|heart|lungs?|bones?|muscles?|blood|brain|digest\w*|tooth|teeth|skin|nerves?|pulse|stomach|liver|intestin\w*|joint)\b/i,
    plants: /\b(plants?|leaves|leaf|roots?|seeds?|flowers?|photosynthes\w*|stem|chlorophyll|stomata|fruit|trees?)\b/i,
    animals: /\b(animals?|mammals?|birds?|fish|insects?|habitat|predators?|prey|amphibians?|reptiles?|warm-blooded|cold-blooded|food chain)\b/i,
    materials: /\b(materials?|solids?|liquids?|gas(?:es)?|metals?|wood|plastic|dissolv\w*|mixture|density|sugar|sponge|iron|water)\b/i,
    earth_space: /\b(Earth|Sun|Moon|planets?|day|night|seasons?|weather|soil|rocks?|orbit|axis|star|heat|rain|sea|equator)\b/i,
    environment: /\b(environment|habitat|pollution|recycl\w*|ecosystem|waste|water|forest|plastic|climate|sustainab\w*|food (?:web|chain)|greenhouse|soil|weather|ants?|energy|Sun)\b/i,
    experiments: /\b(experiment|hypothesis|variables?|measure|observ\w*|trials?|control|data|results?|scientific|law|containers?)\b/i,
  };
  if (topicNeed[topic] && !topicNeed[topic].test(stem + " " + correct + " " + explanation)) {
    findings.push({ code: "topic_mismatch", detail: `stem/correct weak for topic ${topic}` });
    checks.topic_skill_fit = false;
  }

  // Diagnostic / concept alignment (stem + correct + explanation only)
  const alignBlob = [stem, correct, explanation].join(" \n ");
  for (const rule of SKILL_SIGNALS) {
    if (rule.id.test(diag) || rule.id.test(concept)) {
      if (!rule.need.test(alignBlob)) {
        findings.push({
          code: "diagnostic_content_mismatch",
          detail: `diag/concept ${diag || concept} not reflected in content`,
        });
        checks.diagnostic_fit = false;
        checks.topic_skill_fit = false;
      }
      if (rule.avoidDominant && rule.avoidDominant.test(alignBlob) && !rule.need.test(stem + " " + correct)) {
        findings.push({
          code: "diagnostic_content_mismatch",
          detail: `content dominated by other concept vs ${diag || concept}`,
        });
        checks.diagnostic_fit = false;
      }
    }
  }

  // Unsupported reconstruction only if AFTER text still looks broken
  if (/Earth Earth|What true |Science question|^What\?$|^Why\?$/i.test(stem) || stem.trim().length < 12) {
    findings.push({ code: "unsupported_assumption", detail: "reconstructed stem still broken" });
    checks.unsupported_assumption = true;
  }

  // Distractors: all too similar to correct (soft)
  const wrong = options.filter((_, i) => i !== ci);
  if (wrong.every((w) => String(w).trim().length < 4)) {
    findings.push({ code: "weak_distractors", detail: "wrong options too short" });
    checks.distractors_plausible = false;
  }

  const failKeys = Object.entries(checks)
    .filter(([k, v]) => {
      if (k === "unsupported_assumption") return v === true;
      return v === false;
    })
    .map(([k]) => k);

  return {
    id: q.id,
    pass: failKeys.length === 0 && findings.filter((f) => f.code !== "explanation_weak_link").length === 0,
    softFailOnly:
      findings.length > 0 &&
      findings.every((f) => f.code === "explanation_weak_link"),
    failKeys,
    findings,
    grade: grades,
    topic,
    diag,
    concept,
    stem,
    correctIndex: ci,
    correct,
    neighbors: neighbors(q),
  };
}

const results = highRisk.map(reviewOne);
const fails = results.filter((r) => !r.pass && !r.softFailOnly);
const soft = results.filter((r) => r.softFailOnly);
const passes = results.filter((r) => r.pass);

const report = {
  total: results.length,
  pass: passes.length,
  softFail: soft.length,
  fail: fails.length,
  fails: fails.map((r) => ({
    id: r.id,
    failKeys: r.failKeys,
    findings: r.findings,
    stem: r.stem,
    correct: r.correct,
    diag: r.diag,
    concept: r.concept,
  })),
  softFails: soft.map((r) => ({ id: r.id, findings: r.findings })),
};

fs.writeFileSync(
  "reports/science-en-qa/high-risk-ai-review.json",
  JSON.stringify({ summary: { total: report.total, pass: report.pass, softFail: report.softFail, fail: report.fail }, fails: report.fails, softFails: report.softFails, all: results }, null, 2)
);
console.log(JSON.stringify({ total: report.total, pass: report.pass, softFail: report.softFail, fail: report.fail }, null, 2));
console.log("FAILS:");
for (const f of report.fails) {
  console.log(f.id, f.failKeys.join("|"), f.findings.map((x) => x.code).join(","), "|", f.stem.slice(0, 70));
}
