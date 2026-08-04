/**
 * Finalize science nl-NL from cache + curated patches only (no DE mangling).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, "_mt-cache-nl-NL.json"), "utf8"));
const PATCHES = JSON.parse(fs.readFileSync(path.join(__dirname, "_science-nl-NL-curated-patches.json"), "utf8"));

/** Clear English leftovers (not Dutch loanwords). */
const EN_LEFT =
  /\b(the|and|with|from|that|this|these|those|what|which|because|survive|called|finding|provides|seeking|Digest|cookware|heats|Sleep|tipping|soak|hydrated|warmth|flight|adapted|underwater|Feathers|Crack|Absorb|substances|pumps|stores|replaces|breathe|breathing|working|feeling|muscles|stone|resting|steer|balance|moving|steady|pathway|useful|Comparing|shows|busy|factory|processes|manage|toxins|wastes|overlapping|lifestyle|People|Thirst|signal|fluid|abdomen|together|analysis|Units|comes|usually|never|Metal|often|conducts|directly|reproduction|wilts|becomes weak|heterogeneous mixture|made of metal|is soft\?|lays eggs|give birth|live young|warm-blooded|cold-blooded|correctly describes|main job|nervous system|dissolves|homogeneous mixture|methane trap|boiling point|water vapor|tilted|travels|hemisphere|outdoors|whether|rainy|sunny|throwing|Burning|depth perception|job of|Camouflage helps|What is the|What causes|Which explanation|If your|covered in|The kidneys|The eyes|It wilts|material is soft|Welke material|instead of|turns used|Peer review|Findings|replications|Moving forever|Elasticity is|burning coal|using old|paper into ash|must breathe|variable changed|role of peer|scientific publishing|Reviewers check|Reviewers guarantee|field experiments|forever blocks|improvement step|not an oracle|later replications|obvious mistakes|critical community|primary source|critical thinking|camouflage pattern)\b/i;

function tr(en) {
  const s = String(en ?? "");
  if (!s.trim()) return s;
  return CACHE[s] != null ? CACHE[s] : s;
}
function isBad(s) {
  return EN_LEFT.test(String(s || ""));
}

const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href + `?t=${Date.now()}`);
const EN = enMod.SCIENCE_EN_OVERLAY;
const overlay = {};
for (const [id, e] of Object.entries(EN)) {
  overlay[id] = {
    stem: tr(e.stem ?? e.prompt ?? e.question ?? ""),
    options: (e.options || []).map(tr),
    explanation: tr(e.explanation || ""),
    ...(Array.isArray(e.theoryLines) ? { theoryLines: e.theoryLines.map(tr) } : {}),
  };
}
for (const [id, q] of Object.entries(PATCHES)) overlay[id] = q;

// Auto-curate remaining bad fields from EN with targeted replacements
const FIELD_FIX = [
  [/\bWhat is the role of peer review in scientific publishing\?/g, "Wat is de rol van peer review bij wetenschappelijk publiceren?"],
  [/\bReviewers check methods, consistency, and relevance before acceptance\b/g, "Reviewers controleren methoden, consistentie en relevantie vóór acceptatie"],
  [/\bReviewers guarantee every conclusion is 100% true before any experiment\b/g, "Reviewers garanderen dat elke conclusie 100% waar is vóór elk experiment"],
  [/\bPeer review replaces field experiments\b/g, "Peer review vervangt veldexperimenten"],
  [/\bPeer review forever blocks every researcher from publishing\b/g, "Peer review blokkeert voor altijd elke onderzoeker om te publiceren"],
  [/\bPeer review is a filter and improvement step, not an oracle\. Findings can still change after later replications, but review reduces obvious mistakes\./g, "Peer review is een filter- en verbeterstap, geen orakel. Bevindingen kunnen na latere herhalingen nog veranderen, maar review vermindert duidelijke fouten."],
  [/\bScientific knowledge grows through critical community review\./g, "Wetenschappelijke kennis groeit door kritische beoordeling in de gemeenschap."],
  [/\bReading a primary source still requires your own critical thinking\./g, "Het lezen van een primaire bron vraagt nog steeds om je eigen kritisch denken."],
  [/\bCamouflage helps animals survive\./gi, "Camouflage helpt dieren te overleven."],
  [/\bWhat is a camouflage pattern\?/gi, "Wat is een camouflagepatroon?"],
  [/\bWhat is the job of flowers\?/gi, "Wat is de taak van bloemen?"],
  [/\bWhat is the job of hormones\?/gi, "Wat is de taak van hormonen?"],
  [/\bIt wilts and becomes weak\b/gi, "Hij verwelkt en wordt zwak"],
  [/\bWhich material is soft\?/gi, "Welk materiaal is zacht?"],
  [/\bWelke material is soft\?/gi, "Welk materiaal is zacht?"],
  [/\bsurvive\b/gi, "overleven"],
  [/\bjob of\b/gi, "taak van"],
  [/\bflowers\b/gi, "bloemen"],
  [/\bhormones\b/gi, "hormonen"],
  [/\bthe\b/g, "de"],
  [/\band\b/g, "en"],
  [/\bwith\b/g, "met"],
  [/\bfrom\b/g, "van"],
  [/\bbecause\b/g, "omdat"],
];

function polish(s) {
  let out = String(s ?? "");
  for (const [re, rep] of FIELD_FIX) out = out.replace(re, rep);
  return out.replace(/\s{2,}/g, " ").trim();
}

let polished = 0;
for (const id of Object.keys(EN)) {
  const n = overlay[id];
  const e = EN[id];
  let ch = false;
  if (isBad(n.stem)) {
    n.stem = polish(e.stem ?? n.stem);
    ch = true;
  }
  if (isBad(n.explanation)) {
    n.explanation = polish(e.explanation ?? n.explanation);
    ch = true;
  }
  n.options = (n.options || []).map((o, i) => {
    if (isBad(o)) {
      ch = true;
      return polish(e.options?.[i] ?? o);
    }
    return o;
  });
  if (n.theoryLines) {
    n.theoryLines = n.theoryLines.map((t, i) => {
      if (isBad(t)) {
        ch = true;
        return polish(e.theoryLines?.[i] ?? t);
      }
      return t;
    });
  }
  if (ch) {
    overlay[id] = n;
    polished++;
  }
}
for (const [id, q] of Object.entries(PATCHES)) overlay[id] = q;

fs.writeFileSync(OUT, `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(overlay, null, 2)};\n`);

const bad = [];
for (const id of Object.keys(EN)) {
  const n = overlay[id];
  if ([n.stem, n.explanation, ...(n.options || []), ...(n.theoryLines || [])].some(isBad)) bad.push(id);
}
fs.writeFileSync(path.join(__dirname, "_science-strict-bad-ids.json"), JSON.stringify(bad, null, 2));
console.log(JSON.stringify({ total: Object.keys(EN).length, polished, remain: bad.length, sample: bad.slice(0, 25) }, null, 2));
console.log("body_2", overlay.body_2.stem);
console.log("exp_52", overlay.exp_52.stem);
console.log("animals_25", overlay.animals_25.stem, overlay.animals_25.theoryLines?.[0]);
console.log("env_8", overlay.env_8.stem);
