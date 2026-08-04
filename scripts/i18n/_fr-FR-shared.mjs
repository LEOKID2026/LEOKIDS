/**
 * France (fr-FR) generation glossary + postfixes.
 * Used only by fr-FR content generators — not runtime wiring.
 */
import fs from "node:fs";

export const FR_FR_LOCALE_ID = "fr-FR";
export const MT_TARGET = "fr";

/** @type {Record<string, { preferred: string, notes?: string }>} */
export const FRENCH_FRANCE_GLOSSARY = Object.freeze({
  Grade: { preferred: "Classe" },
  grade: { preferred: "classe" },
  Grades: { preferred: "Classes" },
  grades: { preferred: "classes" },
  "Grade 1": { preferred: "CP" },
  "Grade 2": { preferred: "CE1" },
  "Grade 3": { preferred: "CE2" },
  "Grade 4": { preferred: "CM1" },
  "Grade 5": { preferred: "CM2" },
  "Grade 6": { preferred: "6e" },
  "All grades": { preferred: "Toutes les classes" },
  "Choose grade": { preferred: "Choisir la classe" },
  "Select grade": { preferred: "Choisir la classe" },
  "Current grade": { preferred: "Classe actuelle" },
  "Invalid grade": { preferred: "Classe non valide" },
  "Activities by grade": { preferred: "Activités par classe" },
  Worksheet: { preferred: "Fiche d’exercices" },
  Worksheets: { preferred: "Fiches d’exercices" },
  worksheet: { preferred: "fiche d’exercices" },
  worksheets: { preferred: "fiches d’exercices" },
  "Create worksheet": { preferred: "Créer une fiche d’exercices" },
  "Ready worksheets": { preferred: "Fiches prêtes à imprimer" },
  Preview: { preferred: "Aperçu" },
  Print: { preferred: "Imprimer" },
  "Answer key": { preferred: "Corrigé" },
  Answers: { preferred: "Réponses" },
  Answer: { preferred: "Réponse" },
  Parent: { preferred: "Parent" },
  Parents: { preferred: "Parents" },
  "parent or guardian": { preferred: "parent ou responsable légal" },
  Student: { preferred: "Élève" },
  Students: { preferred: "Élèves" },
  student: { preferred: "élève" },
  students: { preferred: "élèves" },
  Teacher: { preferred: "Enseignant" },
  Teachers: { preferred: "Enseignants" },
  School: { preferred: "École" },
  Math: { preferred: "Mathématiques" },
  Maths: { preferred: "Maths" },
  Geometry: { preferred: "Géométrie" },
  English: { preferred: "Anglais" },
  Hebrew: { preferred: "Hébreu" },
  Science: { preferred: "Sciences" },
  Geography: { preferred: "Géographie" },
  History: { preferred: "Histoire" },
  Practice: { preferred: "Pratique" },
  Report: { preferred: "Rapport" },
  "Parent report": { preferred: "Rapport pour les parents" },
  Hint: { preferred: "Indice" },
  Loading: { preferred: "Chargement…" },
  "Loading...": { preferred: "Chargement…" },
  Save: { preferred: "Enregistrer" },
  Cancel: { preferred: "Annuler" },
  Delete: { preferred: "Supprimer" },
  Close: { preferred: "Fermer" },
  Start: { preferred: "Commencer" },
  Continue: { preferred: "Continuer" },
  "Try again": { preferred: "Réessaie" },
  Next: { preferred: "Suivant" },
  Back: { preferred: "Retour" },
  Play: { preferred: "Jouer" },
  Finish: { preferred: "Terminer" },
  Check: { preferred: "Vérifier" },
  File: { preferred: "Fichier" },
  Video: { preferred: "Vidéo" },
  Phone: { preferred: "Téléphone" },
  Computer: { preferred: "Ordinateur" },
  Laptop: { preferred: "Ordinateur portable" },
  Addition: { preferred: "Addition" },
  Subtraction: { preferred: "Soustraction" },
  Multiplication: { preferred: "Multiplication" },
  Division: { preferred: "Division" },
  Fractions: { preferred: "Fractions" },
  Percentages: { preferred: "Pourcentages" },
  Decimals: { preferred: "Nombres décimaux" },
  Perimeter: { preferred: "Périmètre" },
  Area: { preferred: "Aire" },
  "Word problems": { preferred: "Problèmes" },
  "Number line": { preferred: "Droite numérique" },
  "Leo Kids": { preferred: "Leo Kids" },
});

export const EXACT_OVERRIDES = Object.freeze({
  Math: "Mathématiques",
  Geometry: "Géométrie",
  English: "Anglais",
  Hebrew: "Hébreu",
  Science: "Sciences",
  Geography: "Géographie",
  History: "Histoire",
  Strength: "Point fort",
  "Area to strengthen": "Point à renforcer",
  "Worth strengthening": "Point à renforcer",
  "Parent report": "Rapport pour les parents",
  "Learning pattern": "Profil d’apprentissage",
  Progress: "Progression",
  Improvement: "Progrès",
  Practice: "Pratique",
  Start: "Commencer",
  Continue: "Continuer",
  "Try again": "Réessaie",
  Check: "Vérifier",
  Next: "Suivant",
  Back: "Retour",
  Play: "Jouer",
  Finish: "Terminer",
  Loading: "Chargement…",
  "Loading...": "Chargement…",
  Save: "Enregistrer",
  Cancel: "Annuler",
  Delete: "Supprimer",
  Close: "Fermer",
  Hint: "Indice",
  Addition: "Addition",
  Subtraction: "Soustraction",
  Multiplication: "Multiplication",
  Division: "Division",
  Fractions: "Fractions",
  Percentages: "Pourcentages",
  Sequences: "Suites",
  Decimals: "Nombres décimaux",
  Rounding: "Arrondi",
  Equations: "Équations",
  Patterns: "Motifs",
  Vocabulary: "Vocabulaire",
  Grammar: "Grammaire",
  Phonics: "Phonétique",
  Writing: "Écriture",
  Reading: "Lecture",
  "Reading comprehension": "Compréhension de lecture",
  Shapes: "Formes",
  "Basic shapes": "Formes de base",
  Area: "Aire",
  Perimeter: "Périmètre",
  Volume: "Volume",
  Angles: "Angles",
  Triangles: "Triangles",
  Circles: "Cercles",
  Symmetry: "Symétrie",
  Coordinates: "Coordonnées",
  Animals: "Animaux",
  Plants: "Plantes",
  Materials: "Matériaux",
  "Mixed practice": "Pratique mixte",
  "Word problems": "Problèmes",
  "Place value": "Valeur de position",
  "Number sense": "Sens du nombre",
  "Grade 1": "CP",
  "Grade 2": "CE1",
  "Grade 3": "CE2",
  "Grade 4": "CM1",
  "Grade 5": "CM2",
  "Grade 6": "6e",
  "Grade {grade}": "Classe {grade}",
  "Grades 1–2": "CP–CE1",
  "Grades 3–4": "CE2–CM1",
  "Grades 5–6": "CM2–6e",
  Grade: "Classe",
  "All grades": "Toutes les classes",
  "Choose grade": "Choisir la classe",
  "Select grade": "Choisir la classe",
  "Current grade": "Classe actuelle",
  "Invalid grade": "Classe non valide",
  "Invalid grade. Please choose another grade.": "Classe non valide. Choisis une autre classe.",
  "That grade is not valid.": "Cette classe n’est pas valide.",
  "Allow child to pick grade on learning pages":
    "Autoriser l’enfant à choisir la classe sur les pages d’apprentissage",
  Worksheet: "Fiche d’exercices",
  Worksheets: "Fiches d’exercices",
  "Create worksheet": "Créer une fiche d’exercices",
  "Ready worksheets": "Fiches prêtes à imprimer",
  Preview: "Aperçu",
  Print: "Imprimer",
  "Answer key": "Corrigé",
  Regular: "Commune",
  Special: "Spéciale",
  Rare: "Rare",
  Gold: "Or",
  "Surprise box": "Boîte surprise",
  Locked: "Verrouillée",
  "My cards": "Mes cartes",
  "My collection": "Ma collection",
  "Card shop": "Boutique de cartes",
  "All cards": "Toutes les cartes",
  Series: "Séries",
  Buy: "Acheter",
  "Sell duplicate": "Vendre le doublon",
  "Open box": "Ouvrir la boîte",
  "Table of contents": "Table des matières",
  "Coming soon": "Bientôt disponible",
  "Previous page": "Page précédente",
  "Next page": "Page suivante",
  "Previous topic": "Thème précédent",
  "Next topic": "Thème suivant",
  "Let's practice now": "Entraînons-nous maintenant",
  "Practice with questions": "S’entraîner avec des questions",
  "Book reading": "Lecture du livre",
  Parent: "Parent",
  Parents: "Parents",
  Student: "Élève",
  Students: "Élèves",
  Teacher: "Enseignant",
  Teachers: "Enseignants",
  School: "École",
  Answers: "Réponses",
  Answer: "Réponse",
  File: "Fichier",
  Video: "Vidéo",
  Phone: "Téléphone",
  Computer: "Ordinateur",
  Laptop: "Ordinateur portable",
  "Leo Kids": "Leo Kids",
});

/** Regionalisms / wrong terms that must not appear in fr-FR base layer. */
export const FORBIDDEN_FR_FR_PATTERNS = Object.freeze([
  { re: /\bfeuille de calcul\b/i, label: "feuille de calcul→fiche d’exercices" },
  { re: /\bfeuilles de calcul\b/i, label: "feuilles de calcul" },
  { re: /\bseptante\b/i, label: "septante (BE/CH)" },
  { re: /\bnonante\b/i, label: "nonante (BE/CH)" },
  { re: /\bhuitante\b/i, label: "huitante (CH)" },
  { re: /\bmagasiner\b/i, label: "magasiner (CA)" },
  { re: /\bmagasinage\b/i, label: "magasinage (CA)" },
  { re: /\bfin de semaine\b/i, label: "fin de semaine (CA)→week-end" },
  { re: /\bcourriel\b/i, label: "courriel (CA)→e-mail" },
  { re: /\bclavarder\b/i, label: "clavarder (CA)" },
  { re: /\bchar\b/i, label: "char (CA car)" },
  { re: /étudiant/i, label: "étudiant→élève (school child)" },
  { re: /\bGrade\s*[1-6]\b/, label: "Grade N English leakage" },
  { re: /\b1st Grade\b/i, label: "1st Grade" },
  { re: /\bYear\s*[1-6]\b/, label: "Year N" },
]);

/**
 * Phrase-level France French fixes after MT.
 * @type {Array<[RegExp, string|((...args:any[])=>string)]>}
 */
export const POST_PHRASE_FIXES = [
  [/Leo Enfants/g, "Leo Kids"],
  [/Leo Kids Kids/g, "Leo Kids"],
  [/feuille de calcul/gi, "fiche d’exercices"],
  [/feuilles de calcul/gi, "fiches d’exercices"],
  [/feuille de travail/gi, "fiche d’exercices"],
  [/feuilles de travail/gi, "fiches d’exercices"],
  [/fiche de travail/gi, "fiche d’exercices"],
  [/fiches de travail/gi, "fiches d’exercices"],
  [/\bGrade 1\b/g, "CP"],
  [/\bGrade 2\b/g, "CE1"],
  [/\bGrade 3\b/g, "CE2"],
  [/\bGrade 4\b/g, "CM1"],
  [/\bGrade 5\b/g, "CM2"],
  [/\bGrade 6\b/g, "6e"],
  [/\b1st Grade\b/gi, "CP"],
  [/\b2nd Grade\b/gi, "CE1"],
  [/\b3rd Grade\b/gi, "CE2"],
  [/\b4th Grade\b/gi, "CM1"],
  [/\b5th Grade\b/gi, "CM2"],
  [/\b6th Grade\b/gi, "6e"],
  [/\bYear 1\b/gi, "CP"],
  [/\bYear 2\b/gi, "CE1"],
  [/\bYear 3\b/gi, "CE2"],
  [/\bYear 4\b/gi, "CM1"],
  [/\bYear 5\b/gi, "CM2"],
  [/\bYear 6\b/gi, "6e"],
  [/\b1re année\b/gi, "CP"],
  [/\b2e année\b/gi, "CE1"],
  [/\b3e année\b/gi, "CE2"],
  [/\b4e année\b/gi, "CM1"],
  [/\b5e année\b/gi, "CM2"],
  [/\b6e année\b/gi, "6e"],
  [/\bannée 1\b/gi, "CP"],
  [/\bannée 2\b/gi, "CE1"],
  [/\bannée 3\b/gi, "CE2"],
  [/\bannée 4\b/gi, "CM1"],
  [/\bannée 5\b/gi, "CM2"],
  [/\bannée 6\b/gi, "6e"],
  [/\bclasse de 1(?:re|ère)\b/gi, "CP"],
  [/\bclasse de 2(?:e|ème)\b/gi, "CE1"],
  [/\bclasse de 3(?:e|ème)\b/gi, "CE2"],
  [/\bclasse de 4(?:e|ème)\b/gi, "CM1"],
  [/\bclasse de 5(?:e|ème)\b/gi, "CM2"],
  [/\bclasse de 6(?:e|ème)\b/gi, "6e"],
  [/\bseptante\b/gi, "soixante-dix"],
  [/\bnonante\b/gi, "quatre-vingt-dix"],
  [/\bhuitante\b/gi, "quatre-vingts"],
  [/\bfin de semaine\b/gi, "week-end"],
  [/\bcourriel\b/gi, "e-mail"],
  [/\bmagasinage\b/gi, "courses"],
  [/\bmagasiner\b/gi, "faire des courses"],
  [/(?<![A-Za-zÀ-ÖØ-öø-ÿ])étudiantes?(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "élèves"],
  [/(?<![A-Za-zÀ-ÖØ-öø-ÿ])étudiants(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "élèves"],
  [/(?<![A-Za-zÀ-ÖØ-öø-ÿ])étudiante(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "élève"],
  [/(?<![A-Za-zÀ-ÖØ-öø-ÿ])étudiant(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "élève"],
  [/(?<![A-Za-zÀ-ÖØ-öø-ÿ])Étudiantes?(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "Élèves"],
  [/(?<![A-Za-zÀ-ÖØ-öø-ÿ])Étudiants(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "Élèves"],
  [/(?<![A-Za-zÀ-ÖØ-öø-ÿ])Étudiante(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "Élève"],
  [/(?<![A-Za-zÀ-ÖØ-öø-ÿ])Étudiant(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "Élève"],
  [/dollars?/gi, "euros"],
  [/\$(\d+)/g, "$1 €"],
  [/\bUS\$\b/g, "€"],
  [/\bUSD\b/g, "EUR"],
];

/**
 * Child-facing imperative normalization (learning, games, student help).
 * Do NOT blanket-replace vous→tu (breaks “à vous”, “Il vous”, clitics).
 */
export const CHILD_TU_FIXES = [
  [/\bVeuillez\b/g, "Merci de"],
  [/\bSélectionnez\b/g, "Sélectionne"],
  [/\bChoisissez\b/g, "Choisis"],
  [/\bCliquez\b/g, "Clique"],
  [/\bEssayez\b/g, "Essaie"],
  [/\bContinuez\b/g, "Continue"],
  [/\bRegardez\b/g, "Regarde"],
  [/\bÉcrivez\b/g, "Écris"],
  [/\bCalculez\b/g, "Calcule"],
  [/\bVérifiez\b/g, "Vérifie"],
  [/\bRéessayez\b/g, "Réessaie"],
  [/\bCommencez\b/g, "Commence"],
  [/\bTerminez\b/g, "Termine"],
  [/\bOuvrez\b/g, "Ouvre"],
  [/\bFermez\b/g, "Ferme"],
  [/\bLisez\b/g, "Lis"],
  [/\bÉcoutez\b/g, "Écoute"],
  [/\bVous pouvez\b/g, "Tu peux"],
  [/\bvous pouvez\b/g, "tu peux"],
  [/\bà vous entraîner\b/gi, "à t’entraîner"],
  [/\bà vous\b/g, "à te"],
];

/** Adult-facing surfaces keep vous; fix accidental tu. */
export const ADULT_VOUS_FIXES = [
  [/\bSélectionne\b/g, "Sélectionnez"],
  [/\bChoisis\b(?!sez)/g, "Choisissez"],
  [/\bClique\b(?!z)/g, "Cliquez"],
  [/\bEssaie\b(?!z)/g, "Essayez"],
  [/\bTon enfant\b/g, "Votre enfant"],
  [/\bton enfant\b/g, "votre enfant"],
  [/\bTes enfants\b/g, "Vos enfants"],
  [/\btes enfants\b/g, "vos enfants"],
];

export function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function looksNonTranslate(s) {
  if (s == null) return true;
  const str = String(s);
  if (!str.trim()) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str)) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(str)) return true;
  if (/^\d+(\.\d+)?%?$/.test(str)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(str) && str.length <= 48) return true;
  if (/[\u0590-\u05FF]/.test(str) && !/[A-Za-z]/.test(str)) return true;
  if (!/\s/.test(str)) {
    if (/^[a-z0-9]+([_/.-][a-z0-9]+)+$/i.test(str)) return true;
    if (/^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(str)) return true;
    if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
    if (/\.(png|jpe?g|gif|webp|svg|ttf|woff2?|json|js|css|mp3|wav|pdf)$/i.test(str)) return true;
  }
  return false;
}

export function protectPlaceholders(s) {
  /** @type {string[]} */
  const ph = [];
  const out = String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    ph.push(name);
    return `⟦${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

export function restorePlaceholders(s, ph) {
  return String(s).replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `{${ph[Number(i)]}}`);
}

/** ASCII \b breaks on accented French letters; use Latin-letter edges instead. */
function frEdgeTermPattern(term, flags = "g") {
  return new RegExp(`(?<![A-Za-zÀ-ÖØ-öø-ÿ])${escapeRegExp(term)}(?![A-Za-zÀ-ÖØ-öø-ÿ])`, flags);
}

export function applyGlossaryHints(text) {
  let out = String(text ?? "");
  for (const [enTerm, entry] of Object.entries(FRENCH_FRANCE_GLOSSARY)) {
    if (!entry?.preferred) continue;
    if (!/[A-Za-z]/.test(enTerm)) continue;
    if (enTerm.length < 4) continue;
    // Never re-apply short stems that are prefixes of already-French terms (Math⊂Mathématiques).
    if (entry.preferred.toLowerCase().includes(enTerm.toLowerCase()) && entry.preferred.length > enTerm.length) {
      continue;
    }
    out = out.replace(frEdgeTermPattern(enTerm), entry.preferred);
  }
  for (const [re, rep] of POST_PHRASE_FIXES) {
    out = out.replace(re, rep);
  }
  // Collapse glossary stutter from earlier bad boundary passes
  out = out.replace(/Mathématiques(?:ématiques)+/g, "Mathématiques");
  out = out.replace(/Géométrie(?:ométrie)+/g, "Géométrie");
  out = out.replace(/Sciences(?:ciences)+/g, "Sciences");
  return out;
}

export function applySurfaceTone(text, tone) {
  let out = String(text ?? "");
  const fixes = tone === "child" ? CHILD_TU_FIXES : tone === "adult" ? ADULT_VOUS_FIXES : [];
  for (const [re, rep] of fixes) out = out.replace(re, rep);
  return out;
}

export function hasForbidden(text) {
  return FORBIDDEN_FR_FR_PATTERNS.some((p) => p.re.test(String(text ?? "")));
}

export async function mtTranslate(text, { tl = MT_TARGET } = {}) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" +
    encodeURIComponent(tl) +
    "&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

export function loadCache(cachePath) {
  if (!fs.existsSync(cachePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  } catch {
    return {};
  }
}

export function saveCache(cachePath, cache) {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 0), "utf8");
}

export async function translateStringFr(en, cache, { force = false, tone = null } = {}) {
  if (looksNonTranslate(en)) return { value: en, source: "skip" };
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, en)) {
    let value = EXACT_OVERRIDES[en];
    if (tone) value = applySurfaceTone(value, tone);
    return { value, source: "override" };
  }
  if (!force && cache[en]) {
    const guarded = protectPlaceholders(cache[en]);
    let value = restorePlaceholders(applyGlossaryHints(guarded.text), guarded.ph);
    if (tone) {
      const g2 = protectPlaceholders(value);
      value = restorePlaceholders(applySurfaceTone(g2.text, tone), g2.ph);
    }
    return { value, source: "cache" };
  }

  const { text, ph } = protectPlaceholders(en);
  let translated;
  try {
    translated = await mtTranslate(text);
  } catch (err) {
    console.warn("MT fail:", String(en).slice(0, 60), err.message);
    return { value: en, source: "mt-fail" };
  }
  translated = restorePlaceholders(translated, ph);
  // Re-protect placeholders before glossary/tone so `{grade}` is never rewritten to `{classe}`.
  const guarded = protectPlaceholders(translated);
  let polished = applyGlossaryHints(guarded.text);
  polished = restorePlaceholders(polished, guarded.ph);
  if (tone) {
    const g2 = protectPlaceholders(polished);
    polished = restorePlaceholders(applySurfaceTone(g2.text, tone), g2.ph);
  }

  const enPh = [...String(en).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  const frPh = [...polished.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  if (enPh !== frPh) {
    console.warn("placeholder mismatch, keeping EN:", String(en).slice(0, 80));
    return { value: en, source: "ph-mismatch" };
  }

  cache[en] = polished;
  return { value: polished, source: "mt" };
}
