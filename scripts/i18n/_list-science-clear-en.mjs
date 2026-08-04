import { SCIENCE_NL_NL_OVERLAY as NL } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_EN_OVERLAY as EN } from "../../data/science-questions-en-overlay.js";

const CLEAR_EN =
  /\b(the|and|with|from|that|this|these|those|what|which|because|survive|called|provides|seeking|Digest|cookware|heats|Sleep|tipping|soak|hydrated|warmth|flight|adapted|underwater|Feathers|Crack|Spin|Absorb|substances|pumps|stores|replaces|breathe|breathing|working|feeling|resting|steer|balance|moving|steady|pathway|useful|Comparing|shows|People|Thirst|signal|fluid|abdomen|data analysis|Units of|comes after|usually never|Metal cookware|often heats|conducts heat|directly|It wilts|becomes weak|heterogeneous mixture|made of metal|material is soft|lays eggs|give birth|live young|warm-blooded|cold-blooded|correctly describes|main job|nervous system|dissolves|homogeneous mixture|greenhouse gases|methane trap|Too much|transfer of pollen|boiling point|water vapor|lets heat|electricity pass|tilted on|travels around|course of|hemisphere|outdoors|whether it|rainy or sunny|instead of throwing|throwing them|Burning paper|depth perception|How many eyes|most people have|two eyes|distance and|job of flowers|job of hormones|Camouflage helps|What is the job|What is true|What causes daytime|Which explanation|If your pulse|What do animals|This change is called|We see it because|Growth is a natural|Clouds are made|Batteries need special|Water helps your|Plants grow toward|When habitats stay|Leaves fall because|Proves every|Details about|To filter|remove it|house built|place met|lots van|It removes|It swims|It replaces|To replace|One based|Lucht to|A working|Moving lucht|Change elke|Seasons zijn|Seasons relate|Seasons happen|When zonlicht|Let de sand|filter van carefully|fruit tree|people kan|people rely|people en|have feathers|dieren survive|is useful|windows\.|Filter lucht|Filter poisons|Store food|breathe alleen|based alleen|caused alleen|hits meer|happen alleen|bind grond|need meer|together\.|out van de body|leads naar|moeten breathe|no link to|zonder breathing|like vis|complete conducting|speed warmte|variable together|daily spin|door de year|region tends|on de axis|particles together|bloed flow|carefully pour|It pumps|They stop|Pollination helps|Healthy kidneys|It turns|Air to|Breathing brings|So we do|Filter air|Urine carries|They help|That is|Birds have|A place|A house|A group|To replace|One based|manage wastes|manage heat|manage body|overlapping feeding|healthy lifestyle|body processes|Lifestyle choices|release energy|reproductive parts|After pollination|supports photosynthesis|life processes|Attract bees|runs out of oxygen|shuts down all)\b/i;

const rows = [];
for (const id of Object.keys(EN)) {
  const n = NL[id];
  if (!n) continue;
  const fields = [
    ["stem", n.stem, EN[id].stem],
    ["explanation", n.explanation, EN[id].explanation],
    ...(n.options || []).map((o, i) => [`options[${i}]`, o, (EN[id].options || [])[i]]),
    ...(n.theoryLines || []).map((t, i) => [`theory[${i}]`, t, (EN[id].theoryLines || [])[i]]),
  ];
  for (const [f, nl, en] of fields) {
    if (CLEAR_EN.test(String(nl || ""))) rows.push({ id, f, nl: String(nl).slice(0, 120), en: String(en || "") });
  }
}
console.log(JSON.stringify({ count: rows.length, rows }, null, 2));
