/**
 * Restore critical EN matchers corrupted by Hebrew purge (match-all `\s*|` / `(?!)` wipe).
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function stripHeAndCleanRegexes(src) {
  let out = src.replace(/[\u0590-\u05FF]+/g, "");
  out = out.replace(/\/((?:\\.|\[(?:\\.|[^\]])*\]|[^/[\\])+?)\/([gimsuyvd]*)/g, (full, body, flags) => {
    let b = body;
    for (let i = 0; i < 12; i++) {
      const prev = b;
      b = b.replace(/\|\|/g, "|");
      b = b.replace(/\(\?:\|/g, "(?:");
      b = b.replace(/\(\|/g, "(");
      b = b.replace(/\|\)/g, ")");
      b = b.replace(/\|\]/g, "]");
      b = b.replace(/\[\|/g, "[");
      if (b === prev) break;
    }
    b = b.replace(/^\|+/, "").replace(/\|+$/, "");
    const latinProbe = b.replace(/\\[bBdDsSwW]/g, "x");
    if (!/[a-zA-Z0-9]/.test(latinProbe)) {
      const useful = b.replace(/[\s^$*+?.()[\]{}|\\-]/g, "");
      if (!useful) return `/(?!)/${flags}`;
    }
    b = b.replace(/\(\?:\|/g, "(?:");
    b = b.replace(/\(\|/g, "(");
    if (!b.trim() || /^[\s|()[\]{}*?+^$\\.-]*$/.test(b)) return `/(?!)/${flags}`;
    return `/${b}/${flags}`;
  });
  return out;
}

// 1) semantic-question-class: restore from bilingual base + strip HE
{
  const rel = "utils/parent-copilot/semantic-question-class.js";
  const f = path.join(ROOT, rel);
  const base = execSync(`git show e8b01fa0b:${rel}`, { encoding: "utf8", maxBuffer: 5e6, cwd: ROOT });
  fs.writeFileSync(f, stripHeAndCleanRegexes(base));
  execSync(`node --check "${f}"`, { cwd: ROOT });
  console.log("OK", rel);
}

// 2) comparison-practical-continuity: only fix scorePracticalFollowupMode regex block
{
  const rel = "utils/parent-copilot/comparison-practical-continuity.js";
  const f = path.join(ROOT, rel);
  let cur = fs.readFileSync(f, "utf8");
  const fixedFn = `function scorePracticalFollowupMode(t) {
  let action = 0;
  let advance = 0;
  let strengthen = 0;
  if (
    /what\\s+(?:should|do)\\s+(?:we|i)\\s+do|what\\s+now|what\\s+next|in\\s+practice|practical|do\\s+with\\s+this/.test(t)
  ) {
    action += 2.4;
  }
  if (/\\band\\s+now\\b|\\bso\\s+what\\s+(?:do\\s+we\\s+)?do\\b|\\bat\\s+home\\b|\\btomorrow\\b/u.test(t)) {
    action += 1.85;
  }
  if (/recommendation|next\\s+step|today|week|coming\\s+week/.test(t)) action += 1.6;
  if (/advance|promote|move\\s+ahead|raise\\s+(?:the\\s+)?level/.test(t)) advance += 2.5;
  if (/wait|stop|hold|do\\s+not\\s+promote/.test(t)) advance += 0.8;
  if (/strengthen|reinforce|work\\s+on/.test(t)) strengthen += 2.4;
  return { action, advance, strengthen };
}`;
  if (!/function scorePracticalFollowupMode\(t\)/.test(cur)) throw new Error("missing scorePracticalFollowupMode");
  cur = cur.replace(/function scorePracticalFollowupMode\(t\) \{[\s\S]*?return \{ action, advance, strengthen \};\n\}/, fixedFn);
  // Also fix plannerIntent week matcher if collapsed
  cur = cur.replace(
    /plannerIntent = \/\\s\*\|\\s\*\|\\s\*\/\.test\(t\) \? "what_to_do_this_week" : "what_to_do_today";/,
    'plannerIntent = /\\b(?:this\\s+)?week\\b|coming\\s+week/.test(t) ? "what_to_do_this_week" : "what_to_do_today";',
  );
  cur = cur.replace(
    /plannerIntent = \/[^/]+\/\.test\(t\) \? "what_to_do_this_week" : "what_to_do_today";/,
    'plannerIntent = /\\b(?:this\\s+)?week\\b|coming\\s+week/.test(t) ? "what_to_do_this_week" : "what_to_do_today";',
  );
  fs.writeFileSync(f, cur);
  execSync(`node --check "${f}"`, { cwd: ROOT });
  console.log("OK", rel);
}

// 3) truth-packet: fix weakness interpretation + subject-level strength ask
{
  const rel = "utils/parent-copilot/truth-packet-v1.js";
  const f = path.join(ROOT, rel);
  let cur = fs.readFileSync(f, "utf8");
  cur = cur.replace(
    /function interpretationReadsAsWeaknessNeedingSupport\(interp\) \{[\s\S]*?return \/[\s\S]*?\/u\.test\(\s*s,\s*\);\n\}/,
    `function interpretationReadsAsWeaknessNeedingSupport(interp) {
  const s = String(interp || "").trim();
  if (!s) return false;
  return /needs?\\s*(?:reinforcement|support|work|practice)|requires?\\s*(?:reinforcement|support|work|practice)|significant\\s*reinforcement|unique\\s*challenge|still\\s*needs?|harder|weak(?:ness)?|unstable|special\\s*attention|needs?\\s*more\\s*practice/iu.test(
    s,
  );
}`,
  );
  cur = cur.replace(
    /const subjectLevelStrengthQuestion =\s*\/[\s\S]*?\/u\.test\(parentUtteranceRaw\);/,
    `const subjectLevelStrengthQuestion =
      /\\b(?:subject|subjects)\\b|\\bstrong(?:est)?\\s+subject\\b|\\bwhich\\s+subject\\b|\\bbest\\s+subject\\b/iu.test(parentUtteranceRaw);`,
  );
  fs.writeFileSync(f, cur);
  execSync(`node --check "${f}"`, { cwd: ROOT });
  console.log("OK", rel);
}

// 4) evidence-polarity
{
  const rel = "utils/parent-copilot/evidence-polarity.js";
  const f = path.join(ROOT, rel);
  let cur = fs.readFileSync(f, "utf8");
  cur = cur.replace(
    /export const FORBIDDEN_POSITIVE_WHEN_WEAK_RE =\s*\/[\s\S]*?\/u;/,
    `export const FORBIDDEN_POSITIVE_WHEN_WEAK_RE =
  /strong\\s*direction|keep\\s*(?:the\\s+)?same\\s*pace|success\\s*is\\s*repeating|relatively\\s*good\\s*stability|stable\\s*performance|ready\\s*for\\s*(?:further\\s+)?(?:progress|advancement)/iu;`,
  );
  fs.writeFileSync(f, cur);
  execSync(`node --check "${f}"`, { cwd: ROOT });
  console.log("OK", rel);
}

// 5) parent-narrative-safety
{
  const rel = "utils/parent-narrative-safety/parent-narrative-safety-contract.js";
  const f = path.join(ROOT, rel);
  let cur = fs.readFileSync(f, "utf8");
  cur = cur.replace(
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
  cur = cur.replace(
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
  cur = cur.replace(
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
  fs.writeFileSync(f, cur);
  execSync(`node --check "${f}"`, { cwd: ROOT });
  console.log("OK", rel);
}

// 6) intent-answer-contract EN regexes
{
  const iacPath = path.join(ROOT, "utils/parent-copilot/intent-answer-contract.js");
  let iac = fs.readFileSync(iacPath, "utf8");
  const enBlock = `const REPORT_EXPLAIN_RE =
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
  iac = iac.replace(/const REPORT_EXPLAIN_RE =[\s\S]*?const PROGRESSION_RE =\s*\/[\s\S]*?;/, `${enBlock}\n`);
  iac = iac.replace(
    /isContextualFollowUpUtterance\(utteranceStr\) && \/\\s\*\|\\s\*\|\\s\*\/u\.test\(folded\)/,
    "isContextualFollowUpUtterance(utteranceStr) && /\\b(?:home|practice|today|week|next\\s+step)\\b/iu.test(folded)",
  );
  // Also catch already-broken TOPIC_LOOKUP second test
  iac = iac.replace(
    /TOPIC_LOOKUP_RE\.test\(folded\) \|\| \/\^\\s\*\\s\+\/u\.test\(folded\)/,
    "TOPIC_LOOKUP_RE.test(folded)",
  );
  fs.writeFileSync(iacPath, iac);
  execSync(`node --check "${iacPath}"`, { cwd: ROOT });
  console.log("OK utils/parent-copilot/intent-answer-contract.js");
}

const { detectAggregateQuestionClass } = await import(
  pathToFileURL(path.join(ROOT, "utils/parent-copilot/semantic-question-class.js")).href + `?t=${Date.now()}`
);
for (const u of [
  "Which subject is strongest?",
  "Are there more subjects?",
  "Which subject is hardest?",
  "What stands out most this period?",
]) {
  console.log(u, "->", detectAggregateQuestionClass(u));
}
