/**
 * American English glossary for Global product copy (translation SSOT).
 * Prefer these terms in user-facing EN; do not apply blindly without context.
 */
export const AMERICAN_ENGLISH_GLOSSARY = Object.freeze({
  subjectLabel: "Math", // not Maths
  gradeLabel: "Grade 1", // not Year 1
  practice: "practice", // noun and verb
  spelling: Object.freeze({
    color: "color",
    organize: "organize",
    center: "center",
    behavior: "behavior",
    canceled: "canceled",
  }),
  terms: Object.freeze({
    activity: "activity",
    practice: "practice",
    worksheet: "worksheet",
    learning: "learning",
    progress: "progress",
    skill: "skill",
    topic: "topic",
    subject: "subject", // school subject (not "profession")
    correctAnswer: "correct answer",
    incorrectAnswer: "incorrect answer",
    tryAgain: "try again",
    continue: "continue",
    start: "start",
    parentReport: "parent report",
    learningPattern: "learning pattern",
    strength: "strength",
    areaToStrengthen: "area to strengthen",
    rectangularPrism: "Rectangular prism", // not Cuboid for US elementary
    circumference: "Circumference", // circle measure (not "Circle perimeter")
    areaFormula: "A =", // not S =
  }),
});

/** British spellings / labels that must not appear in Global EN product surfaces */
export const FORBIDDEN_BRITISH_PATTERNS = Object.freeze([
  { id: "maths", re: /\bMaths\b/ },
  { id: "year_grade", re: /\bYear\s+[1-6]\b/ },
  { id: "colour", re: /\bcolours?\b/i },
  { id: "organise", re: /\borganis(?:e|ed|ing|ation)\b/i },
  { id: "centre", re: /\bcentres?\b/i },
  { id: "behaviour", re: /\bbehaviours?\b/i },
  { id: "cancelled", re: /\bcancelled\b/i },
  { id: "favourite", re: /\bfavourites?\b/i },
  { id: "recognise", re: /\brecognis(?:e|ed|ing)\b/i }]);

/** Calques / unnatural EN that should not appear in scanned EN packs/locales */
export const FORBIDDEN_CALQUE_PATTERNS = Object.freeze([
  { id: "profession_subject", re: /\bthe profession\b/i },
  { id: "load_to_the_house", re: /\bload to the house\b/i },
  { id: "in_the_lines", re: /\bin the lines\b/i },
  { id: "in_the_rows", re: /\bin the rows\b/i },
  { id: "image_of_the_profession", re: /\bimage of the profession\b/i },
  { id: "initial_image_only", re: /\binitial image only\b/i },
  { id: "worth_strengthening", re: /\bWorth strengthening\b/ },
  { id: "circle_perimeter", re: /\bCircle perimeter\b/ },
  { id: "box_volume", re: /\bBox volume\b/ },
  { id: "cuboid_label", re: /\bCuboid\b/ },
  { id: "success_out_of", re: /\bsuccess out of\b/i },
  { id: "formulation_for_a_child", re: /\bFormulation for a child\b/ }]);

export const HEBREW_CHAR_RE = /(?!)/;
