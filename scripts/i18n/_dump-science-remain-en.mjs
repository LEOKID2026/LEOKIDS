import fs from "node:fs";
const audit = JSON.parse(fs.readFileSync("scripts/i18n/_science-nl-NL-remain-audit.json", "utf8"));
// rebuild unique list fully
import { SCIENCE_NL_NL_OVERLAY as NL } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_EN_OVERLAY as EN } from "../../data/science-questions-en-overlay.js";

const CLEAR_EN =
  /\b(the|and|with|from|that|this|these|those|what|which|because|survive|called|provides|seeking|Digest|cookware|heats|Sleep|tipping|soak|hydrated|warmth|flight|adapted|underwater|Feathers|Crack|Spin|Absorb|substances|pumps|stores|replaces|breathe|breathing|working|feeling|resting|steer|balance|moving|steady|pathway|useful|Comparing|shows|People|Thirst|signal|fluid|abdomen|data analysis|Units of|comes after|usually never|Metal cookware|often heats|conducts heat|directly|It wilts|becomes weak|heterogeneous mixture|made of metal|material is soft|lays eggs|give birth|live young|warm-blooded|cold-blooded|correctly describes|main job|nervous system|dissolves|homogeneous mixture|greenhouse gases|methane trap|Too much|transfer of pollen|boiling point|water vapor|lets heat|electricity pass|tilted on|travels around|course of|hemisphere|outdoors|whether it|rainy or sunny|instead of throwing|throwing them|Burning paper|depth perception|How many eyes|most people have|two eyes|distance and|job of flowers|job of hormones|Camouflage helps|What is the job|What is true|What causes daytime|Which explanation|If your pulse|What do animals|This change is called|We see it because|Growth is a natural|Clouds are made|Batteries need special|Water helps your|Plants grow toward|When habitats stay|Leaves fall because|Proves every|Details about|To filter|remove it|house built|place met|lots van|It removes|It swims|It replaces|To replace|One based|Lucht to|A working|Moving lucht|Change elke|Seasons zijn|Seasons relate|Seasons happen|When zonlicht|Let de sand|filter van carefully|fruit tree|people kan|people rely|people en|have feathers|dieren survive|is useful|windows\.|Filter lucht|Filter poisons|Store food|breathe alleen|based alleen|caused alleen|hits meer|happen alleen|bind grond|need meer|together\.|out van de body|leads naar|moeten breathe|no link to|zonder breathing|like vis|complete conducting|speed warmte|variable together|daily spin|door de year|region tends|on de axis|particles together|bloed flow|carefully pour|It pumps|They stop|Pollination helps|Healthy kidneys|It turns|Air to|Breathing brings|So we do|Filter air|Urine carries|They help|That is|Birds have|A place|A house|A group|To replace|One based)\b/i;

const unique = new Map();
const fieldsOf = (n) => [
  ["stem", n.stem],
  ["explanation", n.explanation],
  ...(n.options || []).map((o, i) => [`options[${i}]`, o]),
  ...(n.theoryLines || []).map((t, i) => [`theory[${i}]`, t]),
];

for (const id of Object.keys(EN)) {
  const n = NL[id];
  if (!n) continue;
  for (const [f, s] of fieldsOf(n)) {
    if (!CLEAR_EN.test(String(s || ""))) continue;
    const enRec = EN[id];
    let enVal = "";
    if (f === "stem") enVal = enRec.stem;
    else if (f === "explanation") enVal = enRec.explanation;
    else if (f.startsWith("options[")) enVal = (enRec.options || [])[Number(f.match(/\d+/)[0])];
    else if (f.startsWith("theory[")) enVal = (enRec.theoryLines || [])[Number(f.match(/\d+/)[0])];
    const key = String(enVal || "").trim();
    if (!key) continue;
    if (!unique.has(key)) unique.set(key, []);
    unique.get(key).push(`${id}:${f}`);
  }
}

const entries = [...unique.entries()].map(([en, refs]) => ({ en, refs: refs.slice(0, 3), n: refs.length }));
fs.writeFileSync("scripts/i18n/_science-nl-NL-remain-en-list.json", JSON.stringify(entries, null, 2));
console.log("unique", entries.length);
