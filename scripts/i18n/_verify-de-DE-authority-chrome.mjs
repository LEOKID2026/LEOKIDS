/**
 * Focused Germany authority chrome verification (demo, rewards, skill titles, accessDenied).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function collectStrings(obj, out = []) {
  if (obj == null) return out;
  if (typeof obj === "string") {
    out.push(obj);
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v) => collectStrings(v, out));
    return out;
  }
  if (typeof obj === "object") {
    for (const v of Object.values(obj)) collectStrings(v, out);
  }
  return out;
}

// English chrome detectors (UI chrome, not brand tokens)
const EN_CHROME =
  /\b(Demo mode|Exit demo|Play time|Try the|Loading demo|Could not|Welcome to|Practice math|Answer \d|Solo game|Purchases are|not available in demo|Quick play|My Room|My room|Friends and|View only|Exit demo|Parent demo|Elternteil demo mode|You have an active|Enter Elternteil|sign-up|without signing|Time for new|Change grade|Dismiss demo|Got it|Start a new|Online games are|Keep practicing|From session|Buy|You have it|My cards|My collection|Not enough coins|Purchase failed|Sell duplicate|Open box|Kids World|Card shop|Opening box|Rolling your|Download my|Already in your|You don't have|Network error while|Available in the shop|Keep learning to unlock)\b/i;

const MASH_TITLE =
  /\bin Englisch\b|menschlicher Körper|Schülerinnen und Schüler, read|\breinforce\b|Eltern, work|Klima, protect/;

const demo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-DE/demo/ui.json"), "utf8"));
const rewards = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-DE/rewards/ui.json"), "utf8"));
const skills = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content-packs/de-DE/books/english-page-skills.json"), "utf8")
);
const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/common.json"), "utf8"));
const atDemo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-AT/demo/ui.json"), "utf8"));

const demoHits = collectStrings(demo).filter((s) => EN_CHROME.test(s));
const rewardHits = collectStrings(rewards).filter((s) => EN_CHROME.test(s));

const skillTitles = [];
function walkTitles(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) return node.forEach(walkTitles);
  if (typeof node.title === "string") skillTitles.push(node.title);
  for (const v of Object.values(node)) walkTitles(v);
}
walkTitles(skills);
const mashTitles = skillTitles.filter((t) => MASH_TITLE.test(t));

// Placeholders preserved
const demoPlaceholders = JSON.stringify(demo).match(/\{[a-zA-Z]+\}/g) || [];
const rewardPlaceholders = JSON.stringify(rewards).match(/\{[a-zA-Z]+\}/g) || [];

const accessOk = common.accessDenied === "Sie haben keinen Zugriff auf diese Seite.";

// Austria regression: local Schulstufe overlays remain (badge/chrome may inherit de-DE)
const atOk =
  atDemo.bar?.gradeLabel === "Schulstufe" &&
  atDemo.grades?.g1 === "1. Schulstufe" &&
  atDemo.bar?.changeGrade === "Schulstufe ändern" &&
  !/1\. Klasse/.test(JSON.stringify(atDemo.grades || {}));

// Germany grades intact
const deGradesOk = ["g1", "g2", "g3", "g4", "g5", "g6"].every(
  (k) => demo.grades[k] === `${k.slice(1)}. Klasse`.replace(/^(\d)/, "$1") || demo.grades[k] === `${Number(k.slice(1))}. Klasse`
);
const gradesOk =
  demo.grades.g1 === "1. Klasse" &&
  demo.grades.g6 === "6. Klasse" &&
  !/Schulstufe/.test(JSON.stringify(demo.grades));

// Parent Sie / child du smoke
const parentSie = /Sie |Ihren |Ihrem |Ihr /.test(JSON.stringify(demo.parentPortal));
const childDu = /\b(Du |du |dein |deine |Wähle )\b/.test(demo.enter.intro + demo.enter.activeSessionNote);

const report = {
  demoEnglishHits: demoHits.length,
  demoEnglishSamples: demoHits.slice(0, 15),
  rewardsEnglishHits: rewardHits.length,
  rewardsEnglishSamples: rewardHits.slice(0, 15),
  skillTitleMashHits: mashTitles.length,
  skillTitleMashSamples: mashTitles.slice(0, 15),
  accessDenied: common.accessDenied,
  accessOk,
  demoPlaceholdersOk: demoPlaceholders.includes("{minutes}"),
  rewardPlaceholdersOk: rewardPlaceholders.some((p) => p === "{amount}" || p === "{name}"),
  austriaRegressionOk: atOk,
  germanyGradesOk: gradesOk,
  parentSieOk: parentSie,
  childDuOk: childDu,
  ok:
    demoHits.length === 0 &&
    rewardHits.length === 0 &&
    mashTitles.length === 0 &&
    accessOk &&
    atOk &&
    gradesOk,
};

console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
