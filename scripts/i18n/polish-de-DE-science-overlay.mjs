/**
 * Polish de-DE science overlay: prefer authored topics; rewrite mixed EN/DE fields
 * with full-sentence maps built from human batches + authored. No external MT.
 *
 *   node scripts/i18n/polish-de-DE-science-overlay.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const AUTHORED = path.join(__dirname, "_de-DE-science-authored");
const BATCH = path.join(__dirname, "_de-DE-science-batches");

function loadJson(p, fallback = {}) {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function hasEnglishResidue(s) {
  return /\b(the|and|with|that|which|what|into|about|their|have|has|are|was|were|will|would|could|should|without|because|while|through|between|from|this|these|those|than|then|also|only|more|most|other|over|under|after|before|during|against|around|you|your|we|our|it|its|or|if|as|by|on|to|of|a|an|for|not|can|does|did|been|being|make|makes|made|help|helps|need|needs|use|uses|used)\b/i.test(
    String(s)
  );
}

function buildExactMap(enOverlay) {
  const map = {};
  // Human batches 001-008 only (trusted)
  for (let i = 1; i <= 8; i++) {
    const n = String(i).padStart(3, "0");
    const en = loadJson(path.join(BATCH, `en-${n}.json`), []);
    const de = loadJson(path.join(BATCH, `de-${n}.json`), []);
    if (en.length !== de.length) continue;
    en.forEach((s, idx) => {
      map[s] = de[idx];
    });
  }
  // Authored topics
  for (const f of fs.readdirSync(AUTHORED).filter((x) => x.endsWith(".json"))) {
    const deObj = loadJson(path.join(AUTHORED, f));
    for (const [id, dq] of Object.entries(deObj)) {
      const eq = enOverlay[id];
      if (!eq) continue;
      if (eq.stem && dq.stem) map[eq.stem] = dq.stem;
      (eq.options || []).forEach((o, i) => {
        if (dq.options?.[i]) map[o] = dq.options[i];
      });
      if (eq.explanation && dq.explanation) map[eq.explanation] = dq.explanation;
      (eq.theoryLines || []).forEach((t, i) => {
        if (dq.theoryLines?.[i]) map[t] = dq.theoryLines[i];
      });
    }
  }
  return map;
}

/** Conservative full-phrase map for remaining sci/p4b1 glue (longest first). */
const EXTRA = [
  ["Which statement correctly describes", "Welche Aussage beschreibt richtig"],
  ["in the human body", "im menschlichen Körper"],
  ["human body", "menschlicher Körper"],
  ["breaks food into", "zerlegt Nahrung in"],
  ["the body can absorb", "die der Körper aufnehmen kann"],
  ["makes oxygen directly", "erzeugt Sauerstoff direkt"],
  ["for muscles only", "nur für Muskeln"],
  ["carries nerve signals from the eyes", "leitet Nervensignale von den Augen"],
  ["sets the heart’s beating rate", "legt die Herzschlagfrequenz fest"],
  ["sets the heart's beating rate", "legt die Herzschlagfrequenz fest"],
  ["breaks down food", "zerlegt Nahrung"],
  ["helps absorb nutrients and water", "hilft, Nährstoffe und Wasser aufzunehmen"],
  ["does not make oxygen", "erzeugt keinen Sauerstoff"],
  ["is not the nervous system", "ist nicht das Nervensystem"],
  ["Digestion follows a path from the mouth through the stomach and intestines.", "Die Verdauung folgt einem Weg vom Mund durch Magen und Därme."],
  ["Most absorption happens in the small intestine.", "Die meiste Aufnahme geschieht im Dünndarm."],
  ["What does biodiversity mean?", "Was bedeutet Biodiversität?"],
  ["The variety of living things in an area", "Die Vielfalt der Lebewesen in einem Gebiet"],
  ["A single species living alone forever", "Eine einzelne Art, die für immer allein lebt"],
  ["Only rocks and minerals with no life", "Nur Gesteine und Mineralstoffe ohne Leben"],
  ["Weather that never changes", "Wetter, das sich nie ändert"],
  ["Biodiversity is the mix of plants, animals, and other organisms that share a habitat.", "Biodiversität ist die Mischung aus Pflanzen, Tieren und anderen Organismen, die sich einen Lebensraum teilen."],
  ["What is a simple link between a plant and water?", "Was ist eine einfache Verbindung zwischen einer Pflanze und Wasser?"],
  ["A plant needs water to grow", "Eine Pflanze braucht Wasser zum Wachsen"],
  ["A plant never touches water", "Eine Pflanze berührt nie Wasser"],
  ["Water only gets in the way", "Wasser steht nur im Weg"],
  ["There is usually no link", "Es gibt gewöhnlich keine Verbindung"],
  ["Plants take in water to grow and stay healthy.", "Pflanzen nehmen Wasser auf, um zu wachsen und gesund zu bleiben."],
  ["It breaks food into materials the body can absorb", "Es zerlegt Nahrung in Stoffe, die der Körper aufnehmen kann"],
  ["It makes oxygen directly for muscles only", "Es erzeugt Sauerstoff direkt nur für Muskeln"],
  ["It carries nerve signals from the eyes", "Es leitet Nervensignale von den Augen"],
  ["It alone sets the heart’s beating rate", "Es allein legt die Herzschlagfrequenz fest"],
  ["It alone sets the heart's beating rate", "Es allein legt die Herzschlagfrequenz fest"],
  ["The digestive system breaks down food and helps absorb nutrients and water. It does not make oxygen and is not the nervous system.", "Das Verdauungssystem zerlegt Nahrung und hilft, Nährstoffe und Wasser aufzunehmen. Es erzeugt keinen Sauerstoff und ist nicht das Nervensystem."],
];

function translateField(en, map) {
  if (map[en]) return map[en];
  let s = String(en);
  const sorted = [...EXTRA].sort((a, b) => b[0].length - a[0].length);
  for (const [a, b] of sorted) s = s.split(a).join(b);
  // If still heavy English and no map, keep map miss as-is for later authored fill
  return s;
}

function translateQuestion(eq, map) {
  return {
    stem: translateField(eq.stem, map),
    options: (eq.options || []).map((o) => translateField(o, map)),
    explanation: translateField(eq.explanation, map),
    theoryLines: (eq.theoryLines || []).map((t) => translateField(t, map)),
  };
}

function questionHasResidue(q) {
  const parts = [q.stem, q.explanation, ...(q.options || []), ...(q.theoryLines || [])];
  return parts.some(hasEnglishResidue);
}

async function main() {
  const mod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
  const enOverlay = mod.SCIENCE_EN_OVERLAY;
  const map = buildExactMap(enOverlay);

  // Load all authored
  const authored = {};
  for (const f of fs.readdirSync(AUTHORED).filter((x) => x.endsWith(".json"))) {
    Object.assign(authored, loadJson(path.join(AUTHORED, f)));
  }

  // Prefer sentence cache for fully covered questions, but rewrite residue
  const sentenceCache = loadJson(path.join(__dirname, "_de-DE-sentence-cache.json"));
  Object.assign(map, sentenceCache);

  const out = {};
  let a = 0;
  let polished = 0;
  let clean = 0;
  let stillMixed = 0;
  for (const id of Object.keys(enOverlay)) {
    const eq = enOverlay[id];
    if (authored[id]) {
      out[id] = authored[id];
      a++;
      continue;
    }
    const mapped = {
      stem: map[eq.stem] || null,
      options: (eq.options || []).map((o) => map[o] || null),
      explanation: map[eq.explanation] || null,
      theoryLines: (eq.theoryLines || []).map((t) => map[t] || null),
    };
    const complete =
      mapped.stem &&
      mapped.options.every(Boolean) &&
      mapped.explanation &&
      mapped.theoryLines.every(Boolean);
    let q = complete
      ? mapped
      : translateQuestion(eq, map);
    if (questionHasResidue(q)) {
      q = translateQuestion(eq, map);
      polished++;
    }
    if (questionHasResidue(q)) stillMixed++;
    else clean++;
    out[id] = q;
  }

  const body = `/** German (Germany) (de-DE) display overlay for science questions. */
export const SCIENCE_DE_DE_OVERLAY = ${JSON.stringify(out, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, "data/science-questions-de-DE-overlay.js"), body, "utf8");
  console.log({ authored: a, polished, clean, stillMixed, total: Object.keys(out).length });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
