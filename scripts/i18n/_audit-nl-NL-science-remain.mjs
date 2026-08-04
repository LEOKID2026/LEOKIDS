import { SCIENCE_NL_NL_OVERLAY as NL } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_EN_OVERLAY as EN } from "../../data/science-questions-en-overlay.js";
import fs from "node:fs";

/** Clear English instructional / prose residue (not Dutch loanwords alone). */
const CLEAR_EN =
  /\b(the|and|with|from|that|this|these|those|what|which|because|survive|called|provides|seeking|Digest|cookware|heats|Sleep|tipping|soak|hydrated|warmth|flight|adapted|underwater|Feathers|Crack|Spin|Absorb|substances|pumps|stores|replaces|breathe|breathing|working|feeling|resting|steer|balance|moving|steady|pathway|useful|Comparing|shows|busy chemical|factory|processes|manage|toxins|overlapping|lifestyle|People|Thirst|signal|fluid|abdomen|data analysis|Units of|comes after|usually never|Metal cookware|often heats|conducts heat|directly|reproduction and|It wilts|becomes weak|heterogeneous mixture|made of metal|material is soft|lays eggs|give birth|live young|warm-blooded|cold-blooded|correctly describes|main job|nervous system|dissolves|homogeneous mixture|greenhouse gases|methane trap|Too much|pollination|transfer of pollen|boiling point|water vapor|lets heat|electricity pass|tilted on|travels around|course of|hemisphere|outdoors|whether it|rainy or sunny|instead of throwing|throwing them|Burning paper|depth perception|How many eyes|most people have|two eyes|distance and|job of flowers|job of hormones|Camouflage helps|What is the job|What is true|What causes daytime|Which explanation|If your pulse|What do animals|This change is called|We see it because|Growth is a natural|Clouds are made|Batteries need special|Water helps your|Plants grow toward|When habitats stay|Leaves fall because|Proves every|Details about|To filter|remove it|house built|place met|lots van|It removes|It swims|It replaces|To replace|One based|Lucht to|A working|Moving lucht|Change elke|Seasons zijn|Seasons relate|Seasons happen|When zonlicht|Let de sand|filter van carefully|fruit tree|people kan|people rely|people en|have feathers|dieren survive|is useful|windows\.|Filter lucht|Filter poisons|Store food|breathe alleen|based alleen|caused alleen|hits meer|happen alleen|bind grond|need meer|together\.|out van de body|leads naar|moeten breathe|no link to|zonder breathing|like vis|complete conducting|speed warmte|variable together|daily spin|door de year|region tends|on de axis|particles together|bloed flow|carefully pour)\b/i;

const LOAN_ONLY =
  /\b(urine|filter|filteren|gas|plastic|recycling|hard|soft|pulse|habitat|experiment|hypothese|fotosynthese|peer review)\b/i;

const fieldsOf = (n) => [
  ["stem", n.stem],
  ["explanation", n.explanation],
  ...(n.options || []).map((o, i) => [`options[${i}]`, o]),
  ...(n.theoryLines || []).map((t, i) => [`theory[${i}]`, t]),
];

const bad = [];
const uniqueEn = new Map();
for (const id of Object.keys(EN)) {
  const n = NL[id];
  if (!n) {
    bad.push({ id, missing: true });
    continue;
  }
  for (const [f, s] of fieldsOf(n)) {
    const str = String(s || "");
    if (!CLEAR_EN.test(str)) continue;
    // skip if only loanword false-positive and mostly Dutch
    const enTokens = (str.match(/\b[A-Za-z]{3,}\b/g) || []).filter((w) =>
      /^(the|and|with|from|that|this|what|which|because|survive|called|people|place|house|built|remove|filter|breathe|breathing|working|feeling|useful|windows|feathers|sleep|replace|replaces|swims|based|only|together|carefully|pour|settle|conduct|conducting|path|complete|moving|speed|transfer|change|every|variable|seasons|caused|daily|spin|hits|more|directly|region|tends|warmer|happen|axis|particles|need|blood|flow|urine|carries|dissolved|waste|body|leads|fertilization|pollination|opens|data|analysis|units|measure|matter|conclusion|comes|after|usually|never|metal|cookware|often|heats|conducts|heat|well|true|false|job|hormones|flowers|camouflage|helps|animals|pulse|daytime|growth|natural|process|clouds|made|tiny|droplets|batteries|special|harmful|materials|water|helps|your|plants|grow|toward|habitats|stay|leaves|fall|digest|seeking|food|opening|no|details|about|actually|proves|every|finding|provides|tipping|soak|hydrated|warmth|flight|adapted|underwater|feathers|crack|spin|absorb|substances|pumps|stores|resting|steer|balance|moving|steady|pathway|comparing|shows|factory|processes|manage|toxins|overlapping|lifestyle|thirst|signal|fluid|abdomen|outdoors|whether|rainy|sunny|throwing|burning|paper|depth|perception|eyes|most|distance|warm-blooded|cold-blooded|correctly|describes|main|nervous|system|dissolves|homogeneous|mixture|greenhouse|gases|methane|trap|too|much|transfer|pollen|boiling|point|vapor|lets|electricity|pass|tilted|travels|around|course|hemisphere|instead|heterogeneous|soft|lays|eggs|give|birth|live|young|wilts|becomes|weak|reproduction)$/i.test(
        w
      )
    );
    if (enTokens.length === 0) continue;
    bad.push({ id, f, nl: str.slice(0, 160) });
    const enRec = EN[id];
    let enVal = "";
    if (f === "stem") enVal = enRec.stem;
    else if (f === "explanation") enVal = enRec.explanation;
    else if (f.startsWith("options[")) enVal = (enRec.options || [])[Number(f.match(/\d+/)[0])];
    else if (f.startsWith("theory[")) enVal = (enRec.theoryLines || [])[Number(f.match(/\d+/)[0])];
    const key = String(enVal || "");
    if (key) uniqueEn.set(key, (uniqueEn.get(key) || 0) + 1);
  }
}

const unique = [...uniqueEn.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync(
  "scripts/i18n/_science-nl-NL-remain-audit.json",
  JSON.stringify({ badFieldCount: bad.length, uniqueEnCount: unique.length, top: unique.slice(0, 80), samples: bad.slice(0, 60) }, null, 2)
);
console.log(JSON.stringify({ badFieldCount: bad.length, uniqueEnCount: unique.length, topCount: unique.slice(0, 20).length }, null, 2));
console.log(unique.slice(0, 25).map(([s, c]) => `${c}\t${s.slice(0, 100)}`).join("\n"));
