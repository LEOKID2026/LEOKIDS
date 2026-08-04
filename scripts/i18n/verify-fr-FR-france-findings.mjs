/**
 * Verify France findings closed for fr-FR.
 * Run: node scripts/i18n/verify-fr-FR-france-findings.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

const failures = [];
function ok(name, pass, detail = "") {
  if (!pass) failures.push({ name, detail });
  else console.log("OK", name, detail);
}

const roots = [
  ...walk(path.join(ROOT, "locales/fr-FR"), (n) => n.endsWith(".json")),
  ...walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json")),
  ...walk(path.join(ROOT, "data/help-center/fr-FR"), (n) => n.endsWith(".js")),
  path.join(ROOT, "data/english-questions/word-meanings/fr-FR.js"),
  ...walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md")),
];

const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR/common.json"), "utf8"));
const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR/learning.json"), "utf8"));
ok("common grades", common.grade1 === "CP" && common.grade6 === "6e");
ok(
  "gradeLabel passthrough",
  common.gradeLabel === "{grade}",
  common.gradeLabel,
);
ok(
  "gradeTitle passthrough",
  learning.master?.gradeTitle === "{grade}",
  learning.master?.gradeTitle,
);
ok(
  "no raw ICU select in grade templates",
  !/, select,/.test(String(common.gradeLabel)) && !/, select,/.test(String(learning.master?.gradeTitle || "")),
);
ok(
  "master.grades discrete",
  learning.master?.grades?.g1 === "CP" &&
    learning.master?.grades?.g2 === "CE1" &&
    learning.master?.grades?.g3 === "CE2" &&
    learning.master?.grades?.g4 === "CM1" &&
    learning.master?.grades?.g5 === "CM2" &&
    learning.master?.grades?.g6 === "6e",
);
ok(
  "learning mode tu",
  learning.master?.modes?.learning?.description === "Pas de fin de partie : entraîne-toi à ton rythme",
  learning.master?.modes?.learning?.description,
);
ok(
  "questionsAnswered ICU",
  learning.questionsAnswered === "{count, plural, one {# question} other {# questions}}",
  learning.questionsAnswered,
);

const meanings = fs.readFileSync(path.join(ROOT, "data/english-questions/word-meanings/fr-FR.js"), "utf8");
ok("technology.file", /"file":\s*"fichier"/.test(meanings));
ok("technology.tablet", /"tablet":\s*"tablette"/.test(meanings));
ok("technology.speaker", /"speaker":\s*"haut-parleur"/.test(meanings));

const patterns = [
  [/Classe \{grade\}/, "Classe {grade} template"],
  [/\bClasse [1-6]\b/, "Classe N display"],
  [/Choisissez une note\b/, "Choisissez une note"],
  [/Choisis une note\b/, "Choisis une note"],
  [/sélectionner une note/, "sélectionner une note"],
  [/\bton note\b/, "ton note"],
  [/\{compte,\s*pluriel/, "translated ICU compte/pluriel"],
  [/\bpluriel,\s*un\b/, "translated ICU un/autre"],
  [/Entraînez-tu/, "Entraînez-tu"],
  [/Tu êtes /, "Tu êtes"],
  [/Entrez ton /, "Entrez ton"],
  [/Contrôlez ton /, "Contrôlez ton"],
  [/Connectez-tu/, "Connectez-tu"],
  [/après tu être/, "après tu être"],
  [/commencez à pratiquer/, "commencez à pratiquer (child mix)"],
  [/apprenants/, "apprenants"],
  [/\bétudiant(?:e|s|es)?\b/i, "étudiant"],
  [/Lion Kids/, "Lion Kids"],
  [/de la 1re à la 6e/, "1re à 6e"],
  [/"audience": "mère"/, "audience mère"],
  [/Livre d'apprentissage ouvert/, "Livre ouvert button"],
  [/Aucune feuille trouvée/, "Aucune feuille"],
  [/Parents de classe(?! )/, "Parents de classe"], // allow "Parents de cette classe"
  [/"je suis parent"/, "je suis parent casing"],
];

// More precise Parents de classe (not "cette classe")
const parentClassBad = [];
const noteAsGradeBad = [];
const icuBad = [];
const tuVousBad = [];
const brandBad = [];
const otherBad = [];

for (const f of roots) {
  const t = fs.readFileSync(f, "utf8");
  const rel = path.relative(ROOT, f);
  if (/Parents de classe(?! )/.test(t) && !/Parents de cette classe/.test(t.replace(/Parents de cette classe/g, ""))) {
    // count remaining exact phrase
    if (/\bParents de classe\b/.test(t)) parentClassBad.push(rel);
  }
  if (/\bParents de classe\b/.test(t) && !t.includes("Parents de cette classe")) parentClassBad.push(rel);
  // residual exact bad phrase
  if (/(?<!cette )Parents de classe/.test(t)) {
    // still have "Parents de classe" without cette - check
  }
  if (/\bParents de classe\b/.test(t)) {
    const without = t.split("Parents de cette classe").join("");
    if (/\bParents de classe\b/.test(without)) parentClassBad.push(rel);
  }

  if (/Choisissez une note\b|Choisis une note\b|sélectionner une note|ton note\b|Choisis la note,/.test(t)) {
    noteAsGradeBad.push(rel);
  }
  if (/\{compte,\s*pluriel|, pluriel,|\{compte,/.test(t) && /plural/.test(t) === false) {
    // if has compte,pluriel
    if (/\{compte,\s*pluriel/.test(t)) icuBad.push(rel);
  }
  if (/\{compte,\s*pluriel/.test(t) || (/, pluriel,/.test(t) && /\{count,/.test(t) === false && /plural/.test(t) === false)) {
    if (/\{compte,\s*pluriel|\bpluriel,\s*un\b/.test(t)) icuBad.push(rel);
  }
  if (/Entraînez-tu|entraînez-tu|Tu êtes |Entrez ton |Contrôlez ton |Connectez-tu|après tu être|Choisis un sujet et commencez/.test(t)) {
    tuVousBad.push(rel);
  }
  if (/Lion Kids/.test(t)) brandBad.push(rel);
  if (/apprenants|de la 1re à la 6e|"audience": "mère"|Livre d'apprentissage ouvert|Aucune feuille trouvée|"je suis parent"|Classe \{grade\}/.test(t)) {
    otherBad.push(rel);
  }
  if (/\bétudiant(?:e|s|es)?\b/i.test(t) && !f.includes("word-meanings")) {
    // élève required; étudiant banned for school surfaces
    otherBad.push(rel + "#etudiant");
  }
}

ok("Parents de classe residual", parentClassBad.length === 0, parentClassBad.slice(0, 10).join(", "));
ok("note-as-grade residual", noteAsGradeBad.length === 0, noteAsGradeBad.slice(0, 15).join(", "));
ok("ICU keyword residual", icuBad.length === 0, icuBad.slice(0, 10).join(", "));
ok("tu/vous hybrid residual", tuVousBad.length === 0, tuVousBad.slice(0, 15).join(", "));
ok("Lion Kids brand residual", brandBad.length === 0, brandBad.slice(0, 10).join(", "));
ok("other France residual", otherBad.length === 0, otherBad.slice(0, 20).join(", "));

// spot checks
ok("learning openBook", learning.openBook.includes("Ouvrir"));
ok("learning practiceAgain", learning.practiceAgain === "Entraîne-toi à nouveau");
ok("learning hubBlurb", learning.hubBlurb.includes("commence à pratiquer"));
ok("ui casing", !JSON.stringify(JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR/ui.json"), "utf8"))).includes('"je suis parent"'));

const helpParents = fs.readFileSync(path.join(ROOT, "data/help-center/fr-FR/parents.js"), "utf8");
ok("help Leo Kids", /Leo Kids/.test(helpParents) && !/Lion Kids/.test(helpParents));
ok("help CP–6e", /du CP à la 6e/.test(helpParents));
ok("help audience parent", /"audience": "parent"/.test(helpParents) && !/"audience": "mère"/.test(helpParents));

if (failures.length) {
  console.error("FAILURES", JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log("\nALL FRANCE FINDINGS CLOSED");
