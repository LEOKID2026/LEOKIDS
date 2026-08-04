import fs from "fs";

{
  const p = "utils/parent-copilot/intent-answer-contract.js";
  let s = fs.readFileSync(p, "utf8");
  const en = `const REPORT_EXPLAIN_RE =
  /(?:explain|tell\\s+me\\s+about)\\s+(?:the\\s+)?report|what\\s+(?:does\\s+)?(?:the\\s+)?report\\s+(?:say|show|mean)|(?:give\\s+me\\s+)?(?:a\\s+)?summary|what\\s+(?:do\\s+we\\s+)?see\\s+here|overall\\s+picture/iu;

const IMPORTANT_FOCUS_RE =
  /what\\s+(?:is\\s+)?important\\s+(?:here|now)|what\\s+(?:is\\s+)?(?:the\\s+)?most\\s+important|what\\s+(?:to\\s+)?(?:focus|emphasize)|where\\s+(?:to\\s+)?(?:put\\s+)?(?:the\\s+)?focus/iu;

const TOPIC_LOOKUP_RE = /^(?:what\\s+about|how\\s+about)\\s+/iu;

const TOPIC_PROBLEM_RE =
  /what\\s+(?:is\\s+)?(?:the\\s+)?(?:problem|difficulty)|where\\s+(?:is\\s+)?(?:the\\s+)?(?:problem|difficulty)|why\\s+(?:is\\s+)?(?:he|she|the\\s+child)?\\s*(?:weak|struggling)|what\\s+(?:is\\s+)?(?:not\\s+working|weak)|why\\s+(?:is\\s+it\\s+)?(?:hard|difficult)/iu;

const HOME_PRACTICE_RE =
  /what\\s+(?:should\\s+(?:we|i)\\s+)?do|how\\s+(?:to\\s+)?practice|how\\s+long|at\\s+home|next\\s+step|what\\s+(?:do\\s+we\\s+)?do\\s+now|home\\s+practice|how\\s+(?:do\\s+(?:we|i)\\s+)?practice/iu;

const STRENGTH_RE =
  /what\\s+(?:is\\s+)?going\\s+well|where\\s+(?:is\\s+)?(?:he|she|the\\s+child)?\\s*strong|what\\s+(?:is\\s+)?strong|strengths?|succeeding|strongest|(?:the\\s+)?strong(?:est)?\\s+subject|which\\s+subject\\s+is\\s+strongest/iu;

// Progression family: advance / level up / level down / mastered / above-grade / below-grade / focus elsewhere.
const PROGRESSION_RE =
  /\\b(?:advance|move\\s+ahead|level\\s+up|raise\\s+(?:the\\s+)?level|level\\s+down|lower\\s+(?:the\\s+)?level|already\\s+masters?|masters?\\s+the\\s+topic|already\\s+knows?|above\\s+(?:grade|level)|below\\s+(?:grade|level)|focus\\s+on\\s+(?:another|a\\s+different)\\s+topic|switch\\s+(?:to\\s+)?(?:another|a\\s+different)\\s+topic|wasting)\\b/iu;`;
  s = s.replace(/const REPORT_EXPLAIN_RE =[\s\S]*?const PROGRESSION_RE =\s*\/[\s\S]*?;/, en);
  s = s.replace(
    /TOPIC_LOOKUP_RE\.test\(folded\) \|\| \/\^\\s\*\\s\+\/u\.test\(folded\)/,
    "TOPIC_LOOKUP_RE.test(folded)",
  );
  s = s.replace(
    /isContextualFollowUpUtterance\(utteranceStr\) && \/\\s\*\|\\s\*\|\\s\*\/u\.test\(folded\)/,
    "isContextualFollowUpUtterance(utteranceStr) && /\\b(?:home|practice|today|week|next\\s+step)\\b/iu.test(folded)",
  );
  fs.writeFileSync(p, s);
  console.log("iac ok");
}

{
  const p = "utils/parent-copilot/evidence-polarity.js";
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(
    /export const FORBIDDEN_POSITIVE_WHEN_WEAK_RE =\s*\/[\s\S]*?\/u;/,
    `export const FORBIDDEN_POSITIVE_WHEN_WEAK_RE =
  /strong\\s*direction|keep\\s*(?:the\\s+)?same\\s*pace|success\\s*is\\s*repeating|relatively\\s*good\\s*stability|stable\\s*performance|ready\\s*for\\s*(?:further\\s+)?(?:progress|advancement)/iu;`,
  );
  fs.writeFileSync(p, s);
  console.log("ep ok");
}

{
  const p = "utils/parent-narrative-safety/parent-narrative-safety-contract.js";
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(
    /export const MEDICAL_DIAGNOSTIC_RES = \[[\s\S]*?\];/,
    `export const MEDICAL_DIAGNOSTIC_RES = [
  /dyslexia|dyscalculia/iu,
  /learning\\s*disability|learning\\s*disorder/iu,
  /attention\\s*disorder|\\bADHD\\b/iu,
  /neurological\\s*disorder|psychiatric\\s*disorder/iu,
  /medical\\s*diagnosis|clinical\\s*diagnosis/iu,
  /clinical\\s*psychologist|specialist\\s*doctor/iu,
];`,
  );
  s = s.replace(
    /export const OVERCONFIDENT_PHRASE_RES = \[[\s\S]*?\];/,
    `export const OVERCONFIDENT_PHRASE_RES = [
  /\\bwith\\s*certainty\\b/iu,
  /\\bunambiguous(?:ly)?\\b/iu,
  /\\bno\\s*doubt\\b/iu,
  /\\bclear(?:ly)?\\s+that\\b/iu,
  /\\bproves?\\s+(?:fully|completely)\\b|\\bunambiguous\\s*proof\\b/iu,
  /\\bwithout\\s*a\\s*doubt\\b/iu,
];`,
  );
  s = s.replace(
    /export const CAUTIOUS_HEDGE_RES = \[[\s\S]*?\];/,
    `export const CAUTIOUS_HEDGE_RES = [
  /\\bit\\s*seems\\b/iu,
  /\\bit\\s*may\\s*be\\b|\\bmight\\s*be\\b/iu,
  /\\bstill\\s*too\\s*early\\b/iu,
  /\\bfrom\\s*the\\s*data\\s*here\\b/iu,
  /\\bnot\\s*clear\\s*yet\\b/iu,
  /\\bworth\\s*gathering\\b/iu,
  /\\bnot\\s*enough\\s*data\\b/iu,
  /\\bstill\\s+little\\s+data\\b/iu,
];`,
  );
  s = s.replace(
    /export const SAFE_THIN_DATA_CAUTION_RES = \[[\s\S]*?\];/,
    `export const SAFE_THIN_DATA_CAUTION_RES = [
  /not\\s+enough\\s+(?:practice|data|questions)/iu,
  /still\\s+too\\s+early/iu,
  /thin\\s+data|limited\\s+evidence/iu,
  /need\\s+more\\s+(?:practice|data)/iu,
];`,
  );
  fs.writeFileSync(p, s);
  console.log("ns ok");
}

// Keep spaces for English scoring in comparison continuity
{
  const p = "utils/parent-copilot/comparison-practical-continuity.js";
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(
    /const t = utteranceStr\s*\.toLowerCase\(\)\s*\.replace\(\/\\s\+\/g, ""\)\s*\.trim\(\);/,
    `const t = utteranceStr
    .toLowerCase()
    .replace(/\\s+/g, " ")
    .trim();`,
  );
  fs.writeFileSync(p, s);
  console.log("cpc ok");
}
