/**
 * Rebuild locales/fr-FR/worksheets.json with adult (vous) tone + France authorities.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXACT_OVERRIDES,
  applyGlossaryHints,
  applySurfaceTone,
  loadCache,
  looksNonTranslate,
  protectPlaceholders,
} from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-fr-FR.json");

function translateValue(s, cache) {
  if (looksNonTranslate(s)) return s;
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, s)) return EXACT_OVERRIDES[s];
  const raw = cache[s];
  if (!raw) return s;
  const guarded = protectPlaceholders(raw);
  let out = applyGlossaryHints(guarded.text);
  out = out.replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `{${guarded.ph[Number(i)]}}`);
  const enNames = [...String(s).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]);
  if (enNames.length) {
    let i = 0;
    out = out.replace(/\{[a-zA-Z0-9_]+\}/g, () => `{${enNames[i++] || enNames[enNames.length - 1]}}`);
  }
  out = applySurfaceTone(out, "adult");
  return out
    .replace(/Mathématiques(?:ématiques)+/g, "Mathématiques")
    .replace(/Leo Enfants|Enfants Lion/g, "Leo Kids")
    .replace(/feuille de calcul/gi, "fiche d’exercices")
    .replace(/feuilles de calcul/gi, "fiches d’exercices");
}

function transform(node, cache) {
  if (typeof node === "string") return translateValue(node, cache);
  if (Array.isArray(node)) return node.map((x) => transform(x, cache));
  if (node && typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = transform(v, cache);
    return out;
  }
  return node;
}

const cache = loadCache(CACHE_PATH);
const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/worksheets.json"), "utf8"));
const fr = transform(en, cache);

fr.hubTitle = "Fiches d’exercices imprimables";
fr.hubSubtitle =
  "Choisissez une fiche prête, créez-en une personnalisée ou obtenez des recommandations basées sur la pratique de votre enfant.";
fr.hubIntro =
  "Chaque fiche d’exercices s’ouvre en aperçu avant l’impression. Un corrigé facultatif est disponible.";
fr.tabGenerator = "Créer une fiche d’exercices";
fr.createWorksheet = "Créer une fiche d’exercices";
fr.preview = "Aperçu";
fr.answerKey = "Corrigé";
fr.answerKeyTitle = "Corrigé";
fr.readyTitle = "Fiches d’exercices prêtes à imprimer";
fr.gradeFilterAll = "Toutes les classes";
fr.gradeG1 = "CP";
fr.gradeG2 = "CE1";
fr.gradeG3 = "CE2";
fr.gradeG4 = "CM1";
fr.gradeG5 = "CM2";
fr.gradeG6 = "6e";
fr.gradeField = "Classe";
fr.selectGrade = "Classe";
fr.createHint =
  "Choisissez la matière, la classe, le thème et le niveau, puis créez une fiche prête à imprimer.";
fr.recommendationsEmpty =
  "Après un peu plus de pratique, nous pourrons vous proposer des fiches d’exercices adaptées à votre enfant.";
fr.selectChild = "Sélectionnez un enfant";
fr.documentTitle = "Fiche d’exercices";
fr.seoPreviewTitle = "Aperçu de la fiche d’exercices · Leo Kids";
fr.seoAnswerKeyTitle = "Corrigé · Leo Kids";
fr.publicFullSystemNote =
  "Dans le portail parent complet, vous pouvez créer un nombre illimité de fiches d’exercices, sélectionner tous les thèmes disponibles et générer de nouvelles fiches à chaque fois.";
fr.writingInstructionIndependent = "Écris";
fr.writingInstructionTrace = "Repasse";
fr.writingInstructionColor = "Colorie";

fs.writeFileSync(path.join(ROOT, "locales/fr-FR/worksheets.json"), `${JSON.stringify(fr, null, 2)}\n`);
console.log("worksheets repaired (adult vous + France authorities)");
