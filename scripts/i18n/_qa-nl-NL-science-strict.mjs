import { SCIENCE_NL_NL_OVERLAY as NL } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_EN_OVERLAY as EN } from "../../data/science-questions-en-overlay.js";
import fs from "node:fs";

/** Strict English residue — not Dutch loanwords (gas, plastic, recycling, hard, …). */
const STRICT =
  /\b(the|and|with|from|that|this|these|those|what|which|because|survive|called|finding|provides|seeking|Digest|cookware|heats|Sleep|tipping|soak|hydrated|warmth|flight|adapted|underwater|Feathers|Crack|Filter|Spin|Absorb|substances|pumps|stores|urine|replaces|breathe|breathing|working|feeling|muscles|stone|resting|steer|balance|moving|steady|pathway|useful|Comparing|shows|adaptation patterns|busy chemical|factory|processes|manage|toxins|wastes|overlapping|lifestyle|People|Thirst|signal|fluid|abdomen|together|opening with|data analysis|Units of|comes after|usually never|Metal cookware|often heats|conducts heat|directly|reproduction and|It wilts|becomes weak|heterogeneous mixture|made of metal|material is soft|is soft\?|lays eggs|give birth|live young|warm-blooded|cold-blooded|correctly describes|main job|nervous system|dissolves|homogeneous mixture|greenhouse gases|methane trap|Too much|pollination|transfer of pollen|boiling point|water vapor|lets heat|electricity pass|tilted on|travels around|course of|hemisphere|outdoors|whether it|rainy or sunny|instead of throwing|throwing them|Burning paper|depth perception|How many eyes|most people have|two eyes|distance and|job of flowers|job of hormones|Camouflage helps animals survive|What is the job|What is true|What causes daytime|Which explanation|If your pulse|What do animals do to survive|This change is called|We see it because|Growth is a natural|Clouds are made of|Batteries need special|Water helps your body|Plants grow toward|When habitats stay|Leaves fall because|Bladeren fall|What color|Proves every|Details about what you actually)\b/i;

let badIds = 0;
const samples = [];
for (const id of Object.keys(EN)) {
  const n = NL[id];
  if (!n) {
    badIds++;
    continue;
  }
  const fields = [
    ["stem", n.stem],
    ["explanation", n.explanation],
    ...(n.options || []).map((o, i) => [`options[${i}]`, o]),
    ...(n.theoryLines || []).map((t, i) => [`theory[${i}]`, t]),
  ];
  let hit = false;
  for (const [f, s] of fields) {
    if (STRICT.test(String(s || ""))) {
      hit = true;
      if (samples.length < 40) samples.push({ id, f, s: String(s).slice(0, 140) });
    }
  }
  if (hit) badIds++;
}

const out = { badIds, total: Object.keys(EN).length, samples };
fs.writeFileSync("scripts/i18n/_qa-science-strict.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify({ badIds, total: out.total, sampleCount: samples.length }, null, 2));
