/**
 * Local curated EN→de-DE educational translator (no external MT / no API agents).
 * Used only to bootstrap de-DE content packs, science overlay, and learning books.
 * Prefer exact/phrase matches; apply Germany post-fixes (Klasse, Arbeitsblatt, Euro, ß).
 */

/** @type {Record<string, string>} */
export const EXACT = {
  // Grades / roles / subjects
  "Grade 1": "1. Klasse",
  "Grade 2": "2. Klasse",
  "Grade 3": "3. Klasse",
  "Grade 4": "4. Klasse",
  "Grade 5": "5. Klasse",
  "Grade 6": "6. Klasse",
  "Grade {grade}": "{grade}. Klasse",
  Grade: "Klasse",
  "All grades": "Alle Klassen",
  "Choose grade": "Klasse auswählen",
  "Select grade": "Klasse auswählen",
  Math: "Mathematik",
  Geometry: "Geometrie",
  English: "Englisch",
  Science: "Naturwissenschaften",
  Worksheet: "Arbeitsblatt",
  Worksheets: "Arbeitsblätter",
  "Answer key": "Lösungen",
  Answers: "Antworten",
  Answer: "Antwort",
  Preview: "Vorschau",
  Print: "Drucken",
  Parent: "Elternteil",
  Parents: "Eltern",
  Student: "Schülerin oder Schüler",
  Students: "Schülerinnen und Schüler",
  Teacher: "Lehrkraft",
  Teachers: "Lehrkräfte",
  School: "Schule",
  Yes: "Ja",
  No: "Nein",
  yes: "ja",
  no: "nein",
  Loading: "Wird geladen…",
  "Loading...": "Wird geladen…",
  Continue: "Weiter",
  Back: "Zurück",
  Next: "Weiter",
  Start: "Start",
  Finish: "Fertig",
  Check: "Prüfen",
  Save: "Speichern",
  Cancel: "Abbrechen",
  Close: "Schließen",
  Delete: "Löschen",
  Hint: "Tipp",
  Practice: "Übung",
  Progress: "Fortschritt",
  Strength: "Stärke",
  "Area to strengthen": "Bereich zum Stärken",
  "Worth strengthening": "Bereich zum Stärken",
  "Parent report": "Elternbericht",
  "Learning pattern": "Lernmuster",
  "Try again": "Nochmal versuchen",
  Play: "Spielen",
  "Leo Kids": "Leo Kids",
  Addition: "Addition",
  Subtraction: "Subtraktion",
  Multiplication: "Multiplikation",
  Division: "Division",
  Fractions: "Brüche",
  Percentages: "Prozente",
  Decimals: "Dezimalzahlen",
  Sequences: "Folgen",
  Rounding: "Runden",
  Equations: "Gleichungen",
  Patterns: "Muster",
  Vocabulary: "Wortschatz",
  Grammar: "Grammatik",
  Phonics: "Phonetik",
  Writing: "Schreiben",
  Reading: "Lesen",
  Shapes: "Formen",
  Area: "Fläche",
  Perimeter: "Umfang",
  Volume: "Volumen",
  Angles: "Winkel",
  Triangles: "Dreiecke",
  Circles: "Kreise",
  Symmetry: "Symmetrie",
  Animals: "Tiere",
  Plants: "Pflanzen",
  Materials: "Materialien",
  "Word problems": "Textaufgaben",
  "Place value": "Stellenwert",
  "Number sense": "Zahlenverständnis",
  "Mixed practice": "Gemischte Übung",
  Ears: "Ohren",
  Eyes: "Augen",
  Nose: "Nase",
  Tongue: "Zunge",
  Frog: "Frosch",
  Crocodile: "Krokodil",
  Cat: "Katze",
  Rooster: "Hahn",
  Dog: "Hund",
  Bird: "Vogel",
  Fish: "Fisch",
  Solve: "Löse",
  "Solve.": "Löse.",
};

/** Longest-first phrase replacements (case-sensitive where needed). */
export const PHRASES = [
  ["parent or guardian", "Elternteil oder Erziehungsberechtigte"],
  ["parents or guardians", "Eltern oder Erziehungsberechtigte"],
  ["answer key", "Lösungen"],
  ["ready worksheets", "fertige Arbeitsblätter"],
  ["create worksheet", "Arbeitsblatt erstellen"],
  ["learning book", "Lernbuch"],
  ["word problems", "Textaufgaben"],
  ["number line", "Zahlenstrahl"],
  ["even number", "gerade Zahl"],
  ["odd number", "ungerade Zahl"],
  ["right angle", "rechter Winkel"],
  ["carbon dioxide", "Kohlenstoffdioxid"],
  ["respiratory system", "Atemsystem"],
  ["circulatory system", "Kreislaufsystem"],
  ["digestive system", "Verdauungssystem"],
  ["nervous system", "Nervensystem"],
  ["solar system", "Sonnensystem"],
  ["state of matter", "Aggregatzustand"],
  ["food chain", "Nahrungskette"],
  ["food web", "Nahrungsnetz"],
  ["water cycle", "Wasserkreislauf"],
  ["human body", "menschlicher Körper"],
  ["optic nerve", "Sehnerv"],
  ["windpipe", "Luftröhre"],
  ["How many", "Wie viele"],
  ["How much", "Wie viel"],
  ["What is the main job of", "Was ist die Hauptaufgabe von"],
  ["What is the main function of", "Was ist die Hauptfunktion von"],
  ["Which organ do we use to", "Welches Organ nutzen wir zum"],
  ["Which animal is", "Welches Tier ist"],
  ["Which statement", "Welche Aussage"],
  ["Which action", "Welche Handlung"],
  ["Where is the", "Wo befindet sich"],
  ["What causes", "Was verursacht"],
  ["What does a", "Was braucht eine"],
  ["What do the", "Was machen die"],
  ["How do muscles", "Wie helfen Muskeln"],
  ["in the chest", "im Brustkorb"],
  ["slightly left of center", "etwas links von der Mitte"],
  ["on the right side of the body", "auf der rechten Körperseite"],
  ["in the upper abdomen", "im oberen Bauchraum"],
  ["near the liver", "in der Nähe der Leber"],
  ["at neck level", "auf Höhe des Halses"],
  ["behind the windpipe", "hinter der Luftröhre"],
  ["Give birth to live young", "bringen lebende Junge zur Welt"],
  ["without stopping", "ohne Pause"],
  ["all parts of the body", "alle Körperteile"],
  ["Worksheet", "Arbeitsblatt"],
  ["Worksheets", "Arbeitsblätter"],
  ["worksheet", "Arbeitsblatt"],
  ["worksheets", "Arbeitsblätter"],
  ["Teacher", "Lehrkraft"],
  ["teacher", "Lehrkraft"],
  ["Student", "Schülerin oder Schüler"],
  ["student", "Schülerin oder Schüler"],
  ["Students", "Schülerinnen und Schüler"],
  ["students", "Schülerinnen und Schüler"],
  ["Parents", "Eltern"],
  ["parents", "Eltern"],
  ["Parent", "Elternteil"],
  ["parent", "Elternteil"],
  ["Grade 1", "1. Klasse"],
  ["Grade 2", "2. Klasse"],
  ["Grade 3", "3. Klasse"],
  ["Grade 4", "4. Klasse"],
  ["Grade 5", "5. Klasse"],
  ["Grade 6", "6. Klasse"],
  ["grades 1–6", "Klassen 1–6"],
  ["grades 1-6", "Klassen 1–6"],
  ["dollars", "Euro"],
  ["dollar", "Euro"],
  ["Mathematics", "Mathematik"],
  ["geometry", "Geometrie"],
  ["Geometry", "Geometrie"],
  ["Science", "Naturwissenschaften"],
  ["science", "Naturwissenschaften"],
  ["English", "Englisch"],
  ["circumference", "Kreislinie"],
  ["diameter", "Durchmesser"],
  ["radius", "Radius"],
  ["perimeter", "Umfang"],
  ["square", "Quadrat"],
  ["rectangle", "Rechteck"],
  ["circle", "Kreis"],
  ["triangle", "Dreieck"],
  ["angle", "Winkel"],
  ["fraction", "Bruch"],
  ["percentage", "Prozent"],
  ["decimal", "Dezimalzahl"],
  ["oxygen", "Sauerstoff"],
  ["nutrients", "Nährstoffe"],
  ["muscles", "Muskeln"],
  ["skeleton", "Skelett"],
  ["bones", "Knochen"],
  ["blood", "Blut"],
  ["heart", "Herz"],
  ["lungs", "Lungen"],
  ["brain", "Gehirn"],
  ["plant", "Pflanze"],
  ["plants", "Pflanzen"],
  ["animal", "Tier"],
  ["animals", "Tiere"],
  ["mammal", "Säugetier"],
  ["amphibian", "Amphibie"],
  ["environment", "Umwelt"],
  ["recycle", "recyceln"],
  ["hypothesis", "Hypothese"],
  ["investigation", "Untersuchung"],
  ["experiment", "Experiment"],
  ["observation", "Beobachtung"],
  ["matter", "Materie"],
  ["solid", "fest"],
  ["liquid", "flüssig"],
  ["gas", "gasförmig"],
  ["Earth", "Erde"],
  ["Moon", "Mond"],
  ["Sun", "Sonne"],
  ["forest", "Wald"],
  ["water", "Wasser"],
  ["energy", "Energie"],
  ["force", "Kraft"],
  ["gravity", "Schwerkraft"],
  ["temperature", "Temperatur"],
  ["weather", "Wetter"],
  ["climate", "Klima"],
  ["What is", "Was ist"],
  ["What are", "Was sind"],
  ["Which of the following", "Welche der folgenden"],
  ["Choose the", "Wähle die"],
  ["Select the", "Wähle die"],
  ["Fill in", "Trage ein"],
  ["Try again", "Nochmal versuchen"],
  ["in all", "insgesamt"],
  ["How do", "Wie"],
  ["Why are", "Warum sind"],
  ["Why is", "Warum ist"],
  ["Why do", "Warum"],
  ["When does", "Wann"],
  ["When do", "Wann"],
];

export const POST_FIXES = [
  [/\bGrade\s*(\d)\b/g, "$1. Klasse"],
  [/\bgrade\s*(\d)\b/g, "$1. Klasse"],
  [/\bGrades\b/g, "Klassen"],
  [/\bgrades\b/g, "Klassen"],
  [/\bWorksheet\b/g, "Arbeitsblatt"],
  [/\bWorksheets\b/g, "Arbeitsblätter"],
  [/\bworksheet\b/g, "Arbeitsblatt"],
  [/\bworksheets\b/g, "Arbeitsblätter"],
  [/\bAnswer key\b/gi, "Lösungen"],
  [/\bdollars?\b/gi, "Euro"],
  [/\b\$\b/g, "€"],
  [/\bLeo Crianças\b/g, "Leo Kids"],
  [/\bLeo Kinder\b/g, "Leo Kids"],
  // Avoid Austrian/Swiss regionalisms if any slip in
  [/\bJänner\b/g, "Januar"],
  [/\bSpital\b/g, "Krankenhaus"],
  [/\bVelo\b/g, "Fahrrad"],
  [/\bparkieren\b/gi, "parken"],
  [/\bss\b(?= [a-zäöü])/g, "ß"], // never auto-expand; keep intentional ß elsewhere
];

const SKIP_KEYS = new Set([
  "id",
  "ids",
  "skillId",
  "pageType",
  "learningPageId",
  "learningLanguage",
  "gameId",
  "subjectId",
  "topicId",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "icon",
  "image",
  "imageSrc",
  "asset",
  "assetPath",
  "font",
  "ttf",
  "locale",
  "localeId",
  "contentLocale",
  "enum",
  "key",
  "code",
  "type",
  "kind",
  "status",
  "severity",
  "version",
  "sha",
  "hash",
  "color",
  "bg",
  "background",
  "className",
  "component",
  "file",
  "filename",
  "ext",
  "mime",
  "doNotTranslateFields",
]);

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
  // Pure math / formula-ish
  if (/^[\d\s+\-−–—×÷=<>().,/π√%]+$/.test(str)) return true;
  return false;
}

function protectPlaceholders(s) {
  /** @type {string[]} */
  const ph = [];
  let out = String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    ph.push(`{${name}}`);
    return `⟦P${ph.length - 1}⟧`;
  });
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    ph.push(`\`${code}\``);
    return `⟦C${ph.length - 1}⟧`;
  });
  out = out.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    ph.push(`\${${expr}}`);
    return `⟦S${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restorePlaceholders(s, ph) {
  return String(s)
    .replace(/⟦P(\d+)⟧/g, (_, i) => ph[Number(i)])
    .replace(/⟦C(\d+)⟧/g, (_, i) => ph[Number(i)])
    .replace(/⟦S(\d+)⟧/g, (_, i) => ph[Number(i)]);
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Curated local EN→de-DE transform (no network).
 * @param {string} en
 * @param {{ cache?: Record<string,string>, protectEnglishTargets?: boolean }} [opts]
 */
export function translateEnToDeDe(en, opts = {}) {
  const s = String(en ?? "");
  if (!s.trim()) return s;
  if (looksNonTranslate(s)) return s;
  if (Object.prototype.hasOwnProperty.call(EXACT, s)) return EXACT[s];
  if (opts.cache && opts.cache[s]) return applyPostFixes(opts.cache[s]);

  // Protect pure English learning targets (short tokens / listed words) when requested
  if (opts.protectEnglishTargets) {
    if (/^[a-z]+(?:_[a-z]+)*$/i.test(s) && s.length <= 24) return s;
    if (/^(book|pen|desk|chair|door|teacher|hello|bye|cat|dog|red|blue)$/i.test(s)) return s;
  }

  const { text, ph } = protectPlaceholders(s);
  let out = text;

  // Phrase pass (longest first)
  const phrases = [...PHRASES].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of phrases) {
    if (!from) continue;
    const re = new RegExp(`\\b${escapeRegExp(from)}\\b`, "g");
    out = out.replace(re, to);
  }

  out = applyPostFixes(out);
  out = restorePlaceholders(out, ph);

  // Placeholder integrity
  const enPh = [...s.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  const dePh = [...out.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  if (enPh !== dePh) return s;

  return out;
}

function applyPostFixes(text) {
  let out = String(text);
  for (const [re, rep] of POST_FIXES) out = out.replace(re, rep);
  return out;
}

export { SKIP_KEYS };

/**
 * Deep-transform JSON-like trees; preserves skip keys.
 * @param {unknown} node
 * @param {{ key?: string, cache?: Record<string,string>, protectEnglishTargets?: boolean, doNotTranslate?: Set<string> }} ctx
 */
export function transformNode(node, ctx = {}) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (ctx.key && SKIP_KEYS.has(ctx.key)) return node;
    if (ctx.doNotTranslate && ctx.key && ctx.doNotTranslate.has(ctx.key)) return node;
    return translateEnToDeDe(node, {
      cache: ctx.cache,
      protectEnglishTargets: ctx.protectEnglishTargets,
    });
  }
  if (Array.isArray(node)) {
    return node.map((item) => transformNode(item, { ...ctx, key: undefined }));
  }
  if (typeof node === "object") {
    /** @type {Set<string>|undefined} */
    let childSkip = ctx.doNotTranslate;
    if (Array.isArray(/** @type {any} */ (node).doNotTranslateFields)) {
      childSkip = new Set([
        ...(childSkip || []),
        .../** @type {any} */ (node).doNotTranslateFields.map(String),
      ]);
    }
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = transformNode(v, { ...ctx, key: k, doNotTranslate: childSkip });
    }
    return out;
  }
  return node;
}
