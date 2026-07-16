/**
 * Owner-approved parent diagnostic explanations (parent report only).
 * Renders only when status === "approved" and the engine diagnosed the finding.
 *
 * Do not invent Hebrew at runtime. Add entries only after explicit owner approval.
 */

/**
 * @typedef {"approved" | "waived" | "review"} ParentDiagnosticExplanationStatus
 */

/**
 * @typedef {{
 *   lookupKey: string;
 *   explanationHe: string;
 *   exampleHe?: string | null;
 *   status: ParentDiagnosticExplanationStatus;
 *   approvalSource?: string;
 * }} ParentDiagnosticExplanationEntry
 */

/**
 * @typedef {{
 *   lookupKey: string;
 *   explanationHe: string;
 *   exampleHe: string | null;
 * }} ParentDiagnosticExplanationV1
 */

/** Mathematics taxonomy M-01 … M-10 — owner_math_batch_approved only. */
/** @type {ParentDiagnosticExplanationEntry[]} */
const PARENT_DIAGNOSTIC_EXPLANATION_CATALOG = [
  {
    lookupKey: "finding:taxonomy:M-01",
    explanationHe:
      "The system identified difficulty breaking a number into tens and ones. The idea is to understand that a number is made up of tens and ones, so it can be used in calculation.",
    exampleHe: "14 = 10 + 4",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-02",
    explanationHe:
      "The system identified difficulty with addition where a ten needs to be carried to the next column. This happens when adding digits produces a number greater than 9.",
    exampleHe: "27 + 18",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-03",
    explanationHe:
      "The system identified difficulty recalling basic multiplication facts. The idea is number pairs in multiplication that are worth knowing quickly and accurately, without calculating from scratch every time.",
    exampleHe: "7 × 8",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-04",
    explanationHe:
      "The system identified difficulty understanding that a fraction represents a part of a whole. It's important to understand that the bottom number says into how many parts the whole is divided, and the top number says how many parts were taken.",
    exampleHe: "2/3",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-05",
    explanationHe:
      "The system identified difficulty adding or subtracting fractions when they need to be brought to the same denominator before calculating. In other words, you don't immediately add the numerators and denominators - you first write the fractions with the same kind of parts.",
    exampleHe: "1/2 + 1/3",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-06",
    explanationHe:
      "The system identified difficulty rounding or comparing decimal numbers. The idea is to understand the digits after the decimal point and know which digit decides whether to round up or leave it.",
    exampleHe: "4.67 → 4.7",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-07",
    explanationHe:
      "The system identified difficulty matching the unit of measurement to the answer. The numeric calculation may be correct, but you need to check whether the answer should be in kilograms, meters, dollars, minutes, and so on.",
    exampleHe: "5 km / 5 kg",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-08",
    explanationHe:
      "The system identified difficulty solving word problems with more than one step. The idea is to identify what needs to be done first, use that result, and then move on to the next step.",
    exampleHe: "purchase + change",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-09",
    explanationHe:
      "The system identified difficulty using the nearest ten to calculate subtraction. The idea is to break the subtraction into small steps: first reach a ten, then continue subtracting.",
    exampleHe: "13 - 5",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:M-10",
    explanationHe:
      "The system identified difficulty understanding the relationship between division and multiplication - that is, using multiplication to check a division exercise or choosing the right operation.",
    exampleHe: "12 ÷ 3 = 4; 4 × 3 = 12",
    status: "approved",
    approvalSource: "owner_math_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:G-01",
    explanationHe:
      "The system identified difficulty distinguishing between properties of quadrilaterals. The idea is to know which sides are parallel, which angles are right angles, and what the difference is between a rectangle, a square, and a parallelogram.",
    exampleHe: "rectangle / parallelogram",
    status: "approved",
    approvalSource: "owner_geometry_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:G-02",
    explanationHe:
      "The system identified difficulty reading an angle with a protractor. The idea is to correctly line up the protractor's center and zero line, then read the number from the correct scale.",
    exampleHe: "40°",
    status: "approved",
    approvalSource: "owner_geometry_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:G-03",
    explanationHe:
      "The system identified difficulty identifying the correct height for calculating area. In geometry, height is a line perpendicular to the base, and isn't always the side that looks longest or diagonal.",
    exampleHe: "height ⟂ base",
    status: "approved",
    approvalSource: "owner_geometry_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:G-04",
    explanationHe:
      "The system identified difficulty identifying the direction or amount of rotation. The idea is to understand whether the shape rotates clockwise or counterclockwise, and by how many degrees.",
    exampleHe: "90° to the right",
    status: "approved",
    approvalSource: "owner_geometry_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:G-05",
    explanationHe:
      "The system identified difficulty understanding a three-dimensional shape. The idea is to see that it's not just a flat drawing, but a shape with length, width, and height.",
    exampleHe: "cube",
    status: "approved",
    approvalSource: "owner_geometry_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:G-06",
    explanationHe:
      "The system identified difficulty converting units before calculating perimeter or length. The idea is to make sure all measurements are in the same unit before adding or comparing them.",
    exampleHe: "120 cm = 1.2 m",
    status: "approved",
    approvalSource: "owner_geometry_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:G-07",
    explanationHe:
      "The system identified difficulty identifying an axis of symmetry. The idea is to find a line that divides the shape into two identical halves, so that folding along the line makes both sides match.",
    exampleHe: "fold line through the middle of a shape",
    status: "approved",
    approvalSource: "owner_geometry_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:G-08",
    explanationHe:
      "The system identified difficulty calculating the area of a triangle. To find a triangle's area, you use the base and the matching height, then divide the result by 2.",
    exampleHe: "base 6, height 4: 6 × 4 ÷ 2",
    status: "approved",
    approvalSource: "owner_geometry_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:H-01",
    explanationHe:
      "The system identified difficulty choosing a synonym that fits the context. The idea is not just to find a similar word, but to make sure it fits the meaning of the sentence.",
    exampleHe: "happy / cheerful",
    status: "approved",
    approvalSource: "owner_hebrew_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:H-02",
    explanationHe:
      "The system identified difficulty matching words in a sentence by gender and number. The idea is to make sure the noun, adjective, or pronoun match masculine or feminine, and singular or plural.",
    exampleHe: "a little girl / little children",
    status: "approved",
    approvalSource: "owner_hebrew_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:H-03",
    explanationHe:
      "The system identified difficulty identifying a word family or a spelling pattern that repeats across related words. The idea is to notice the letters and structure that repeat within the same word family.",
    exampleHe: "write / letter / writing",
    status: "approved",
    approvalSource: "owner_hebrew_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:H-04",
    explanationHe:
      "The system identified difficulty locating information within a text. The idea is to find a specific detail using keywords, headings, or clues that appear in the question and the text.",
    exampleHe: "when did it happen? / who did it?",
    status: "approved",
    approvalSource: "owner_hebrew_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:H-05",
    explanationHe:
      "The system identified difficulty distinguishing between words that sound similar or identical, but are spelled differently or have a different meaning. The idea is to choose the correct word based on the context of the sentence.",
    exampleHe: "if / with",
    status: "approved",
    approvalSource: "owner_hebrew_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:H-06",
    explanationHe:
      "The system identified difficulty arranging words in a question sentence. The idea is to build a clear question, with the question word, subject, and verb in the right place.",
    exampleHe: "When did the child arrive?",
    status: "approved",
    approvalSource: "owner_hebrew_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:H-07",
    explanationHe:
      "The system identified difficulty connecting sentences into a clear sequence. The idea is to use connecting words to explain a relationship of addition, contrast, cause, or result.",
    exampleHe: "but / therefore / in addition",
    status: "approved",
    approvalSource: "owner_hebrew_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:H-08",
    explanationHe:
      "The system identified difficulty matching the level of language to the situation. The idea is to choose wording that fits the purpose: everyday conversation, an academic answer, or a formal request.",
    exampleHe: "Could I get some help? / Bring me that",
    status: "approved",
    approvalSource: "owner_hebrew_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:E-01",
    explanationHe:
      "The system identified difficulty using natural word combinations in English. The idea is that some words are usually said together in English, and it's not always possible to translate word-for-word from Hebrew.",
    exampleHe: "make a decision",
    status: "approved",
    approvalSource: "owner_english_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:E-02",
    explanationHe:
      "The system identified difficulty identifying clues that show what tense a sentence is written in. The idea is to notice words that show whether it's past, present, or future, and then choose the matching verb form.",
    exampleHe: "yesterday / now / tomorrow",
    status: "approved",
    approvalSource: "owner_english_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:E-03",
    explanationHe:
      "The system identified difficulty tracking the right place in an English text. The idea is to read in order, not skip a line, and return to the right line when looking for an answer.",
    exampleHe: "line 3",
    status: "approved",
    approvalSource: "owner_english_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:E-04",
    explanationHe:
      "The system identified difficulty choosing the right pronoun for the subject of an English sentence. The idea is to correctly choose between pronouns like he, she, or it based on who or what is being talked about.",
    exampleHe: "he / she / it",
    status: "approved",
    approvalSource: "owner_english_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:E-05",
    explanationHe:
      "The system identified difficulty using prepositions in English. These are short words that show a relationship of place, time, or direction, and they're sometimes not translated directly from Hebrew.",
    exampleHe: "in / on / at",
    status: "approved",
    approvalSource: "owner_english_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:E-06",
    explanationHe:
      "The system identified difficulty understanding an inference from an English text. The idea is to understand something that isn't written explicitly, but is implied by the sentences and clues in the text.",
    exampleHe: "The room is dark, so she turns on the light.",
    status: "approved",
    approvalSource: "owner_english_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:E-07",
    explanationHe:
      "The system identified difficulty identifying English letters or spelling patterns that aren't always heard in pronunciation. The idea is to notice that not every letter in a word sounds the way it's written.",
    exampleHe: "knight / night",
    status: "approved",
    approvalSource: "owner_english_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:E-08",
    explanationHe:
      "The system identified difficulty distinguishing between English words that sound almost the same, but differ in a small sound and in meaning. The idea is to listen for the exact difference between the sounds.",
    exampleHe: "ship / sheep",
    status: "approved",
    approvalSource: "owner_english_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:S-01",
    explanationHe:
      "The system identified difficulty distinguishing between a property of something and a process that happens to it. A property describes what characterizes a material, body, or organism, and a process describes a change or action that happens over time.",
    exampleHe: "color is a property; melting is a process",
    status: "approved",
    approvalSource: "owner_science_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:S-02",
    explanationHe:
      "The system identified difficulty understanding an experiment where only one factor is changed at a time. The idea is to keep the rest of the conditions constant, so you know what actually affected the result.",
    exampleHe: "changing only the amount of light",
    status: "approved",
    approvalSource: "owner_science_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:S-03",
    explanationHe:
      "The system identified difficulty understanding location or flow order within a system. The idea is to know where each part is and the order in which material, information, or action moves from place to place.",
    exampleHe: "heart → blood vessels",
    status: "approved",
    approvalSource: "owner_science_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:S-04",
    explanationHe:
      "The system identified difficulty understanding that matter doesn't disappear when it changes. In many cases the material changes shape, state, or location, but its total amount is conserved.",
    exampleHe: "ice → water",
    status: "approved",
    approvalSource: "owner_science_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:S-05",
    explanationHe:
      "The system identified difficulty correctly using units of measurement and converting between them. The idea is to check whether length, mass, time, or volume is being measured, and use the matching unit.",
    exampleHe: "1000 grams = 1 kg",
    status: "approved",
    approvalSource: "owner_science_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:S-06",
    explanationHe:
      "The system identified difficulty reading values from a graph. The idea is to understand what each axis represents, find the right point, and read the correct value from it.",
    exampleHe: "X axis / Y axis",
    status: "approved",
    approvalSource: "owner_science_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:S-07",
    explanationHe:
      "The system identified difficulty understanding feeding relationships and energy transfer in nature. The idea is to identify who eats whom, and what role each organism plays in the system.",
    exampleHe: "plant → rabbit → fox",
    status: "approved",
    approvalSource: "owner_science_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:S-08",
    explanationHe:
      "The system identified difficulty basing an answer on a source of information. The idea is not to settle for a feeling or a guess, but to find in the text, the observation, or the data what supports the claim.",
    exampleHe: "based on the text / based on the observation",
    status: "approved",
    approvalSource: "owner_science_subject_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:MG-01",
    explanationHe:
      "The system identified difficulty understanding a map scale. The idea is to understand how a small distance on the map represents a larger distance in reality.",
    exampleHe: "1 cm on the map = 1 km in reality",
    status: "approved",
    approvalSource: "owner_moledet_geography_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:MG-02",
    explanationHe:
      "The system identified difficulty identifying north on a map. The idea is to use the north arrow or the direction markers, even when the map is rotated or not shown the way it's usually seen.",
    exampleHe: "north arrow on a map",
    status: "approved",
    approvalSource: "owner_moledet_geography_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:MG-03",
    explanationHe:
      "The system identified difficulty distinguishing between a right and a duty. A right is something owed to a person or citizen, and a duty is something they are expected to do or uphold.",
    exampleHe: "right to education / duty to follow the rules",
    status: "approved",
    approvalSource: "owner_moledet_geography_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:MG-04",
    explanationHe:
      "The system identified difficulty arranging events in chronological order. The idea is to understand what happened first, what happened next, and how the events are connected to each other.",
    exampleHe: "before / after",
    status: "approved",
    approvalSource: "owner_moledet_geography_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:MG-05",
    explanationHe:
      "The system identified difficulty reading a climate map. The idea is to use colors, symbols, and the legend to understand what type of climate appears in each area.",
    exampleHe: "desert / Mediterranean",
    status: "approved",
    approvalSource: "owner_moledet_geography_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:MG-06",
    explanationHe:
      "The system identified difficulty understanding a cause-and-effect relationship. The idea is to identify why something happened, and what happened as a result.",
    exampleHe: "migration because of work",
    status: "approved",
    approvalSource: "owner_moledet_geography_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:MG-07",
    explanationHe:
      "The system identified difficulty understanding the role of public institutions. The idea is to know what each institution does and what its responsibility is in society.",
    exampleHe: "Parliament - legislation / Court - adjudication",
    status: "approved",
    approvalSource: "owner_moledet_geography_batch_approved",
  },
  {
    lookupKey: "finding:taxonomy:MG-08",
    explanationHe:
      "The system identified difficulty understanding map symbols. The idea is to use the map legend to understand what marks a road, river, settlement, border, or important place.",
    exampleHe: "map legend",
    status: "approved",
    approvalSource: "owner_moledet_geography_batch_approved",
  },
];

function taxonomyIdFromLookupKey(lookupKey) {
  return String(lookupKey || "").replace("finding:taxonomy:", "").trim();
}

const MATH_TAXONOMY_IDS = new Set(
  PARENT_DIAGNOSTIC_EXPLANATION_CATALOG.filter((e) => /^finding:taxonomy:M-/.test(e.lookupKey)).map((e) =>
    taxonomyIdFromLookupKey(e.lookupKey),
  ),
);

const GEOMETRY_TAXONOMY_IDS = new Set(
  PARENT_DIAGNOSTIC_EXPLANATION_CATALOG.filter((e) => /^finding:taxonomy:G-/.test(e.lookupKey)).map((e) =>
    taxonomyIdFromLookupKey(e.lookupKey),
  ),
);

const HEBREW_SUBJECT_TAXONOMY_IDS = new Set(
  PARENT_DIAGNOSTIC_EXPLANATION_CATALOG.filter((e) => /^finding:taxonomy:H-/.test(e.lookupKey)).map((e) =>
    taxonomyIdFromLookupKey(e.lookupKey),
  ),
);

const ENGLISH_SUBJECT_TAXONOMY_IDS = new Set(
  PARENT_DIAGNOSTIC_EXPLANATION_CATALOG.filter((e) => /^finding:taxonomy:E-/.test(e.lookupKey)).map((e) =>
    taxonomyIdFromLookupKey(e.lookupKey),
  ),
);

const SCIENCE_SUBJECT_TAXONOMY_IDS = new Set(
  PARENT_DIAGNOSTIC_EXPLANATION_CATALOG.filter((e) => /^finding:taxonomy:S-/.test(e.lookupKey)).map((e) =>
    taxonomyIdFromLookupKey(e.lookupKey),
  ),
);

const MOLEDET_GEOGRAPHY_TAXONOMY_IDS = new Set(
  PARENT_DIAGNOSTIC_EXPLANATION_CATALOG.filter((e) => /^finding:taxonomy:MG-/.test(e.lookupKey)).map((e) =>
    taxonomyIdFromLookupKey(e.lookupKey),
  ),
);

const APPROVED_BY_LOOKUP_KEY = new Map(
  PARENT_DIAGNOSTIC_EXPLANATION_CATALOG.filter((e) => e.status === "approved").map((e) => [e.lookupKey, e]),
);

/**
 * @param {string|null|undefined} taxonomyId
 * @returns {string}
 */
export function taxonomyDiagnosticExplanationLookupKey(taxonomyId) {
  const id = String(taxonomyId || "").trim();
  return id ? `finding:taxonomy:${id}` : "";
}

/**
 * @param {unknown} unit
 * @returns {string}
 */
export function v2UnitTaxonomyId(unit) {
  if (!unit || typeof unit !== "object") return "";
  const u = /** @type {Record<string, unknown>} */ (unit);
  const tax = u.taxonomy;
  const fromTax =
    tax && typeof tax === "object" ? String(/** @type {Record<string, unknown>} */ (tax).id || "").trim() : "";
  if (fromTax) return fromTax;
  const diag = u.diagnosis;
  return diag && typeof diag === "object"
    ? String(/** @type {Record<string, unknown>} */ (diag).taxonomyId || "").trim()
    : "";
}

/**
 * @param {unknown} unit
 * @returns {string}
 */
export function resolveLookupKeyFromV2Unit(unit) {
  return taxonomyDiagnosticExplanationLookupKey(v2UnitTaxonomyId(unit));
}

/**
 * @param {{ lookupKey?: string | null; taxonomyId?: string | null }} input
 * @returns {ParentDiagnosticExplanationEntry | null}
 */
export function getParentDiagnosticExplanationEntry(input) {
  const lookupKey =
    String(input?.lookupKey || "").trim() ||
    taxonomyDiagnosticExplanationLookupKey(input?.taxonomyId);
  if (!lookupKey) return null;
  return APPROVED_BY_LOOKUP_KEY.get(lookupKey) || null;
}

/**
 * Approved explanation payload for UI, or null when unmapped / not approved.
 *
 * @param {{ lookupKey?: string | null; taxonomyId?: string | null }} input
 * @returns {ParentDiagnosticExplanationV1 | null}
 */
export function resolveApprovedParentDiagnosticExplanationV1(input) {
  const entry = getParentDiagnosticExplanationEntry(input);
  if (!entry || entry.status !== "approved") return null;
  const explanationHe = String(entry.explanationHe || "").trim();
  if (!explanationHe) return null;
  const exampleRaw = entry.exampleHe != null ? String(entry.exampleHe).trim() : "";
  return {
    lookupKey: entry.lookupKey,
    explanationHe,
    exampleHe: exampleRaw || null,
  };
}

/**
 * @param {unknown} unit — diagnosticEngineV2 unit when diagnosed
 * @returns {ParentDiagnosticExplanationV1 | null}
 */
export function buildParentDiagnosticExplanationV1FromV2Unit(unit) {
  if (!unit || typeof unit !== "object") return null;
  const lookupKey = resolveLookupKeyFromV2Unit(unit);
  if (!lookupKey) return null;
  return resolveApprovedParentDiagnosticExplanationV1({ lookupKey });
}

/** Test / audit hook: full approved catalog (all subject batches including Moledet/Geography in this module). */
export function parentDiagnosticExplanationCatalogForTests() {
  return PARENT_DIAGNOSTIC_EXPLANATION_CATALOG.map((e) => ({ ...e }));
}

/** Test hook: math taxonomy ids with approved explanations in this module. */
export function mathTaxonomyExplanationIdsForTests() {
  return [...MATH_TAXONOMY_IDS].sort();
}

/** Test hook: geometry taxonomy ids with approved explanations in this module. */
export function geometryTaxonomyExplanationIdsForTests() {
  return [...GEOMETRY_TAXONOMY_IDS].sort();
}

/** Test hook: Hebrew-subject taxonomy ids with approved explanations in this module. */
export function hebrewSubjectTaxonomyExplanationIdsForTests() {
  return [...HEBREW_SUBJECT_TAXONOMY_IDS].sort();
}

/** Test hook: English-subject taxonomy ids with approved explanations in this module. */
export function englishSubjectTaxonomyExplanationIdsForTests() {
  return [...ENGLISH_SUBJECT_TAXONOMY_IDS].sort();
}

/** Test hook: Science-subject taxonomy ids with approved explanations in this module. */
export function scienceSubjectTaxonomyExplanationIdsForTests() {
  return [...SCIENCE_SUBJECT_TAXONOMY_IDS].sort();
}

/** Test hook: Moledet/Geography taxonomy ids with approved explanations in this module. */
export function moledetGeographyTaxonomyExplanationIdsForTests() {
  return [...MOLEDET_GEOGRAPHY_TAXONOMY_IDS].sort();
}
