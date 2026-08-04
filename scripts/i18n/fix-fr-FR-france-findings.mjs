/**
 * Close all France (fr-FR) content findings listed for /fr.
 * Does not touch shared content-locale gate.
 *
 * Run: node scripts/i18n/fix-fr-FR-france-findings.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

/** Same contract as it-IT / nl-NL: passthrough of already-localized short labels. */
const GRADE_PASSTHROUGH = "{grade}";

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

function protectIcu(s) {
  /** @type {string[]} */
  const ph = [];
  const out = String(s).replace(/\{[^{}]+(?:,[^{}]+)+\}/g, (m) => {
    ph.push(m);
    return `⟦ICU${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restoreIcu(s, ph) {
  return String(s).replace(/⟦ICU(\d+)⟧/g, (_, i) => ph[Number(i)] ?? "");
}

/** Generic France copy fixes (safe across child/adult after specific overrides). */
function fixFranceCopy(text) {
  let out = String(text);

  // Brand
  out = out.replace(/Lion Kids/g, "Leo Kids");

  // School-year range
  out = out.replace(/de la 1re à la 6e/gi, "du CP à la 6e");
  out = out.replace(/de la 1ère à la 6e/gi, "du CP à la 6e");
  out = out.replace(/de la 1re à la 6ème/gi, "du CP à la 6e");

  // Learners terminology
  out = out.replace(/apprenants du primaire/gi, "élèves du primaire");
  out = out.replace(/apprenants/gi, "élèves");

  // Parents of class
  out = out.replace(/Parents de classe/g, "Parents de cette classe");

  // Worksheet empty
  out = out.replace(/Aucune feuille trouvée/g, "Aucune fiche trouvée");
  // Keep coloring sheet phrasing natural
  out = out.replace(/Aucune feuille de coloriage trouvée/g, "Aucune fiche de coloriage trouvée");

  // Grade mis-translated as "note" (school year / class)
  out = out
    .replace(/Choisissez une note et un niveau/g, "Choisissez une classe et un niveau")
    .replace(/Choisis une matière et une note/g, "Choisis une matière et une classe")
    .replace(/Choisissez une matière et une note/g, "Choisissez une matière et une classe")
    .replace(/Choisissez une note et explorez/g, "Choisissez une classe et explorez")
    .replace(/Choisissez une note/g, "Choisissez une classe")
    .replace(/Choisis une note/g, "Choisis une classe")
    .replace(/Choisis la note,/g, "Choisis la classe,")
    .replace(/choisissez la note et/gi, "choisissez la classe et")
    .replace(/choisissez le sujet, la note et/gi, "choisissez la matière, la classe et")
    .replace(/Veuillez sélectionner une note/g, "Veuillez sélectionner une classe")
    .replace(/sélectionner une note\./g, "sélectionner une classe.")
    .replace(/choisir une note avant/g, "choisir une classe avant")
    .replace(/choisissez une note \(/gi, "choisissez une classe (")
    .replace(/mettre à jour ton note/g, "mettre à jour ta classe")
    .replace(/mettre à jour votre note/g, "mettre à jour votre classe")
    .replace(/à ton note/g, "à ta classe")
    .replace(/à votre note/g, "à votre classe")
    .replace(/correspondront à ton note/g, "correspondront à ta classe")
    .replace(/Remonter d'une note/g, "Remonter d'une classe")
    .replace(/niveau ou une note inférieur/g, "niveau ou une classe inférieure")
    .replace(/matière, une note, un sujet/g, "matière, une classe, un thème")
    .replace(/matières, notes et niveaux/g, "matières, classes et niveaux")
    .replace(/choisissez une note \(1 à 6\)/gi, "choisissez une classe (CP à 6e)")
    .replace(/une note \(1 à 6\)/gi, "une classe (CP à 6e)");

  // Audience
  out = out.replace(/"audience": "mère"/g, '"audience": "parent"');
  out = out.replace(/"audience":"mère"/g, '"audience":"parent"');

  // Broken tu/vous hybrids (child-facing patterns)
  out = out
    .replace(/Entraînez-tu à nouveau/g, "Entraîne-toi à nouveau")
    .replace(/Entraînez-tu maintenant/g, "Entraîne-toi maintenant")
    .replace(/Entraînez-tu,/g, "Entraîne-toi,")
    .replace(/Entraînez-tu et/g, "Entraîne-toi et")
    .replace(/Entraînez-tu chaque/g, "Entraîne-toi chaque")
    .replace(/Entraînez-tu un peu/g, "Entraîne-toi un peu")
    .replace(/Entraînez-tu\b/g, "Entraîne-toi")
    .replace(/Tu êtes désormais/g, "Tu es désormais")
    .replace(/Tu êtes maintenant/g, "Tu es maintenant")
    .replace(/Entrez ton nom/g, "Entre ton nom")
    .replace(/Contrôlez ton entraînement/g, "Vérifie ton entraînement")
    .replace(/Connectez-tu avec ton/g, "Connecte-toi avec ton")
    .replace(/Connectez-tu\b/g, "Connecte-toi")
    .replace(/après tu être connecté/g, "après t’être connecté")
    .replace(/Choisis un sujet et commencez à pratiquer/g, "Choisis un sujet et commence à pratiquer")
    .replace(/commencez à pratiquer\./g, "commence à pratiquer.")
    .replace(/passez en revue/g, "passe en revue")
    .replace(/pratiquez progressivement/g, "pratique progressivement")
    .replace(/\(commencez bas/g, "(commence bas")
    .replace(/ou choisissez un domaine/g, "ou choisis un domaine")
    .replace(/faites des erreurs/g, "fais des erreurs")
    .replace(/appuyez ici/g, "appuie ici")
    .replace(/ce dont tu avez besoin/g, "ce dont tu as besoin")
    .replace(/et progressez\./g, "et progresse.");

  // Action button
  out = out.replace(/Livre d'apprentissage ouvert/g, "Ouvrir le livre d'apprentissage");
  out = out.replace(/Livre d’apprentissage ouvert/g, "Ouvrir le livre d’apprentissage");

  // Casing
  out = out.replace(/"je suis parent"/g, '"Je suis parent"');

  return out;
}

function fixNode(node) {
  if (typeof node === "string") {
    const icu = protectIcu(node);
    let out = fixFranceCopy(icu.text);
    out = restoreIcu(out, icu.ph);
    // Repair mangled ICU if still present as French keywords
    out = out.replace(
      /\{compte,\s*pluriel,\s*un\s*\{# question\}\s*autre\s*\{# questions\}\}/g,
      "{count, plural, one {# question} other {# questions}}",
    );
    out = out.replace(/\{compte,\s*pluriel,/g, "{count, plural,");
    out = out.replace(/,\s*un \{/g, ", one {");
    out = out.replace(/\} autre \{/g, "} other {");
    return out;
  }
  if (Array.isArray(node)) return node.map(fixNode);
  if (node && typeof node === "object") {
    const o = {};
    for (const [k, v] of Object.entries(node)) o[k] = fixNode(v);
    return o;
  }
  return node;
}

function writeJson(file, obj) {
  fs.writeFileSync(file, `${JSON.stringify(obj, null, 2)}\n`, "utf8");
}

let changed = 0;

// --- locales ---
for (const f of walk(path.join(ROOT, "locales/fr-FR"), (n) => n.endsWith(".json"))) {
  const raw = JSON.parse(fs.readFileSync(f, "utf8"));
  const next = fixNode(raw);
  const base = path.basename(f);
  if (base === "common.json") {
    next.gradeLabel = GRADE_PASSTHROUGH;
    next.grade1 = "CP";
    next.grade2 = "CE1";
    next.grade3 = "CE2";
    next.grade4 = "CM1";
    next.grade5 = "CM2";
    next.grade6 = "6e";
  }
  if (base === "learning.json") {
    next.questionsAnswered = "{count, plural, one {# question} other {# questions}}";
    if (next.master) next.master.gradeTitle = GRADE_PASSTHROUGH;
    next.hubBlurb = "Choisis un sujet et commence à pratiquer.";
    next.chooseGrade = "Choisis une classe";
    next.openBook = "Ouvrir le livre d’apprentissage";
    next.practiceAgain = "Entraîne-toi à nouveau";
    if (next.challenge) {
      next.challenge.enterNameToStart = "Entre ton nom pour commencer";
    }
    if (next.master) {
      if (next.master.modes?.learning) {
        next.master.modes.learning.description =
          "Pas de fin de partie : entraîne-toi à ton rythme";
      }
      if (next.master.grades) {
        next.master.grades.g1 = "CP";
        next.master.grades.g2 = "CE1";
        next.master.grades.g3 = "CE2";
        next.master.grades.g4 = "CM1";
        next.master.grades.g5 = "CM2";
        next.master.grades.g6 = "6e";
      }
      next.master.levelUpNow = "Tu es désormais au niveau {level} !";
      next.master.levelUpNowText = "Tu es désormais au niveau {level} !";
      next.master.gradeRequired =
        "Merci de choisir une classe avant de pratiquer. Demande à un parent de mettre à jour ta classe.";
      next.master.practiceSettingsBlurb =
        "Vérifie ton entraînement : passe en revue les erreurs récentes, pratique progressivement (commence bas et avance jusqu’au niveau choisi) ou choisis un domaine d’intervention.";
      next.master.mistakeReviewEmpty =
        "Aucune erreur enregistrée pour l’instant. Entraîne-toi, fais des erreurs et appuie ici pour vérifier exactement ce dont tu as besoin.";
      next.master.practiceNow = "Entraîne-toi maintenant";
    }
  }
  if (base === "ui.json") {
    next.ctaParents = next.ctaParents || next.home?.ctaParents;
    if (next.home) {
      next.home.subhead =
        "Pratiquez les mathématiques, la géométrie, l’anglais et les sciences – conçus pour les élèves du primaire.";
      next.home.ctaParents = "Je suis parent";
    }
    if (next.marketing?.intro1) {
      next.marketing.intro1 = String(next.marketing.intro1).replace(/apprenants du primaire/gi, "élèves du primaire");
    }
    // nested path used in file
    if (next.publicHome?.subhead) {
      next.publicHome.subhead =
        "Pratiquez les mathématiques, la géométrie, l’anglais et les sciences – conçus pour les élèves du primaire.";
    }
    if (next.publicHome?.ctaParents) next.publicHome.ctaParents = "Je suis parent";
    if (next.parent?.gradeRequired) next.parent.gradeRequired = "Veuillez sélectionner une classe.";
    // scan common locations
    const uiStr = JSON.stringify(next);
    if (uiStr.includes("je suis parent")) {
      // already handled by fixNode for quoted form; also free text
    }
  }
  if (base === "school.json") {
    next.chooseGrade = "Choisissez une classe";
    if (next.audienceGradeParents) next.audienceGradeParents = "Parents de cette classe";
    if (next.audienceClassParents) next.audienceClassParents = "Parents de cette classe";
  }
  if (base === "seo.json") {
    next.homeTitle = "Leo Kids — Pratique pour les élèves du primaire";
    next.learningDescription = "Choisissez une matière et une classe pour commencer à pratiquer.";
  }
  if (base === "worksheets.json") {
    next.readyEmptyTitle = "Aucune fiche trouvée";
    if (next.coloringEmpty) next.coloringEmpty = "Aucune fiche de coloriage trouvée.";
    if (next.readyEmptyText) {
      next.readyEmptyText = "Essayez de modifier les filtres ou choisissez toutes les matières, classes et niveaux.";
    }
    if (next.publicDemoHint) {
      next.publicDemoHint =
        "Une courte démo avec 8 exercices : choisissez la matière, la classe et le thème.";
    }
  }
  // Fix ctaParents at top-level if present (structure varies)
  const dump = JSON.stringify(next);
  const fixedDump = dump.replace(/"ctaParents":\s*"je suis parent"/g, '"ctaParents": "Je suis parent"');
  const finalObj = JSON.parse(fixedDump);
  writeJson(f, finalObj);
  changed += 1;
}

// --- content packs ---
for (const f of walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json"))) {
  const raw = JSON.parse(fs.readFileSync(f, "utf8"));
  writeJson(f, fixNode(raw));
  changed += 1;
}

// --- help ---
for (const f of walk(path.join(ROOT, "data/help-center/fr-FR"), (n) => n.endsWith(".js"))) {
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  t = fixFranceCopy(t);
  // Help student-facing specifics
  if (f.endsWith("students.js")) {
    t = t
      .replace(/Connectez-tu avec ton nom d'utilisateur et ton code PIN\./g, "Connecte-toi avec ton nom d’utilisateur et ton code PIN.")
      .replace(/après tu être connecté/g, "après t’être connecté")
      .replace(/Choisis une matière et une note/g, "Choisis une matière et une classe")
      .replace(/correspondront à ton note/g, "correspondront à ta classe")
      .replace(/Entraînez-tu/g, "Entraîne-toi")
      .replace(/et progressez\./g, "et progresse.");
  }
  if (f.endsWith("parents.js")) {
    t = t
      .replace(/Qu’est-ce que Lion Kids \?/g, "Qu’est-ce que Leo Kids ?")
      .replace(/choisissez une note et enregistrez/g, "choisissez une classe et enregistrez")
      .replace(/choisissez une classe \(1 à 6\)/g, "choisissez une classe (CP à 6e)")
      .replace(/Entrez le nom de l'enfant et choisissez une classe \(1 à 6\)/g, "Entrez le nom de l’enfant et choisissez une classe (CP à 6e)");
  }
  if (f.endsWith("subjects.js")) {
    t = t
      .replace(/de la 1re à la 6e/g, "du CP à la 6e")
      .replace(/Choisissez une note et un niveau/g, "Choisissez une classe et un niveau");
  }
  t = t.replace(/"audience": "mère"/g, '"audience": "parent"');
  if (t !== before) {
    fs.writeFileSync(f, t, "utf8");
    changed += 1;
  }
}

// --- word meanings ---
const meaningsPath = path.join(ROOT, "data/english-questions/word-meanings/fr-FR.js");
let meanings = fs.readFileSync(meaningsPath, "utf8");
meanings = meanings
  .replace(/("technology"[\s\S]*?"file":\s*")déposer(")/, "$1fichier$2")
  .replace(/("technology"[\s\S]*?"tablet":\s*")comprimé(")/, "$1tablette$2")
  .replace(/("technology"[\s\S]*?"speaker":\s*")conférencier(")/, "$1haut-parleur$2");
fs.writeFileSync(meaningsPath, meanings, "utf8");
changed += 1;

// --- books: grade/note leakage only (safe) ---
for (const f of walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md"))) {
  const before = fs.readFileSync(f, "utf8");
  let t = before
    .replace(/Lion Kids/g, "Leo Kids")
    .replace(/de la 1re à la 6e/gi, "du CP à la 6e")
    .replace(/\bGrade\s*([1-6])\b/g, (_, n) => ({ 1: "CP", 2: "CE1", 3: "CE2", 4: "CM1", 5: "CM2", 6: "6e" })[n]);
  if (t !== before) {
    fs.writeFileSync(f, t, "utf8");
    changed += 1;
  }
}

console.log("Files touched:", changed);
console.log("gradeLabel authority:", GRADE_PASSTHROUGH);
