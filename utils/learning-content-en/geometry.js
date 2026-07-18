import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";
import geometryContent from "../../content-packs/en/learning/geometry-content.json" with { type: "json" };

export const GEOMETRY_EN_LABEL_OPTIONS = geometryContent.labelOptions;
export const GEOMETRY_SOLID_NAMES_EN = geometryContent.solidNames;

const SOLID_HE_TO_EN = geometryContent.hebrewSolidAliases;

/** Full-phrase replacements only — never bare nouns like רדיוס/צלע (they shred stems). */
const PHRASES = [
  ["במלבן כל ארבע הזוויות הפנימיות ישרות (90°). נכון או לא נכון?", "In a rectangle, all four interior angles are right angles (90°). True or false?"],
  ["במעגל, הקשר בין קוטר לרדיוס הוא:", "In a circle, the relationship between diameter and radius is:"],
  ["כמה מטרים עובר גלגל אופניים במסלול מעגלי אחד מלא - זה קשור בעיקר ל:", "How many meters a bicycle wheel travels in one full circular path is mainly related to:"],
  ["הקוטר פי 2 מהרדיוס", "The diameter is twice the radius"],
  ["הרדיוס פי 2 מהקוטר", "The radius is twice the diameter"],
  ["הם תמיד שווים", "They are always equal"],
  ["אין קשר קבוע", "There is no fixed relationship"],
  ["היקף המעגל", "The circumference of the circle"],
  ["שטח העיגול", "The area of the circle"],
  ["נפח הצמיג", "The volume of the tire"],
  ["רדיוס בלבד בלי כפל", "Radius alone without multiplication"],
  ["הקוטר ארוך פי שניים מהרדיוס", "The diameter is twice as long as the radius"],
  ["לריבוע יש כמה צלעות?", "How many sides does a square have?"],
  ["נכון או לא נכון?", "True or false?"],
  ["לא נכון", "False"],
  ["נכון", "True"],
  ["ריבוע", "Square"],
  ["מלבן", "Rectangle"],
  ["מקבילית", "Parallelogram"],
  ["טרפז", "Trapezoid"],
  ["משולש", "Triangle"],
  ["מקבילות", "Parallel"],
  ["מאונכות", "Perpendicular"],
  ["הזזה", "Translation"],
  ["שיקוף", "Reflection"],
  ["סיבוב", "Rotation"],
  ["ללא תנועה", "No movement"],
  ["שווה צלעות", "Equilateral"],
  ["שווה שוקיים", "Isosceles"],
  ["שונה צלעות", "Scalene"],
  ["אין צלעות שוות", "No equal sides"],
  ["אין זוויות ישרות", "No right angles"],
  ["כיתה לא תקינה. אנא בחר כיתה אחרת.", "Invalid grade. Please choose another grade."],
  ["אין נושאים זמינים עבור הכיתה הזו. אנא בחר כיתה אחרת.", "No topics available for this grade. Please choose another grade."],
  ["אין שאלות זמינות עבור הנושא והכיתה שנבחרו. אנא בחר נושא אחר.", "No questions available for the selected topic and grade. Please choose another topic."],
  ["שגיאה ביצירת שאלה. אנא נסה שוב.", "Error generating question. Please try again."],
  ["זיהוי מהיר - מרובע עם צלע", "Quick identification — quadrilateral with side"],
  ["לכל צד. ריבוע או מלבן?", "on each side. Square or rectangle?"],
  ["שאלת זיהוי קצרה -", "Short identification question —"],
  ["צורה עם זוגות נגדיים שווים:", "Shape with equal opposite pairs:"],
  ["בוחנים צורה סגורה:", "Examine a closed shape:"],
  ["ארבע צלעות שוות", "four equal sides"],
  ["וזוויות ישרות", "and right angles"],
  ["מלבן אמיתי: צלעות", "True rectangle: sides"],
  ["לסירוגין", "alternating"],
  ["סימטרייה מלאה בצלעות: כולן", "Full side symmetry: all sides"],
  ["איזו צורה?", "Which shape?"],
  ["השוו בין ריבוע למלבן:", "Compare square and rectangle:"],
  ["( לא כל הצלעות שוות )", "( not all sides equal )"],
  ["האם מדובר בריבוע כשהצלעות", "Is this a square when the sides are"],
  ["ארבע צלעות באורך", "Four sides of length"],
  ["האם זה תיאור של ריבוע?", "Does this describe a square?"],
  ["ניתוח תיאור - מרובע עם ארבע צלעות שוות", "Analyze the description — quadrilateral with four equal sides"],
  ["תכונות: כל הצלעות", "Properties: all sides"],
  ["כל הזוויות ישרות", "all angles right"],
  ["זיהוי לפי תכונות: שני אורכי צלע שונים", "Identify by properties: two different side lengths"],
  ["הצורה נשארה באותו מקום ובאותו כיוון - איזו טרנספורמציה מתאימ", "The shape stayed in the same place and orientation — which transformation fits?"],
  ["ביצענו סיבוב של צורה סביב נקודה - מה הפעולה?", "We rotated a shape around a point — what is the action?"],
  ["הצורה מתהפכת כמו במראה ליד קו - איזו תנועה זו?", "The shape flips like in a mirror across a line — which move is this?"],
  ["הצורה לא זזה בכלל - איזו תנועה?", "The shape did not move at all — which transformation?"],
  ["הצורה זזה למקום חדש בלי סיבוב ובלי שינוי גודל - איזו תנועה", "The shape moved to a new place with no rotation or size change — which move?"],
  ["הצורה נשארה בדיוק כמו שהייתה - איזו פעולה?", "The shape stayed exactly the same — which action?"],
  ["מה שטח הדיסק", "What is the area of the disk"],
  ["מה שטח העיגול", "What is the area of the circle"],
  ["מה השטח", "What is the area"],
  ["מה היקף המעטפת", "What is the circumference"],
  ["מה אורך המעטפת", "What is the circumference"],
  ["מה היקף המעגל", "What is the circumference of the circle"],
  ["מה ההיקף של עיגול", "What is the circumference of a circle"],
  ["מה היקף", "What is the perimeter"],
  ["מה ההיקף", "What is the perimeter"],
  ["מה שטח", "What is the area of"],
  ["מהו שטח", "What is the area of"],
  ["מהו היקף", "What is the perimeter of"],
  ["מהו נפח", "What is the volume of"],
  ["מה נפח", "What is the volume of"],
  ["חשבו שטח מדויק", "calculate the exact area"],
  ["אתגר שטח -", "Area challenge —"],
  ["אתגר היקף -", "Circumference challenge —"],
  ["אתגר -", "Challenge —"],
  ["עיגול קטן:", "Small circle:"],
  ["עיגול עם רדיוס", "A circle with radius"],
  ["עיגול ברדיוס", "A circle with radius"],
  ["עיגול רדיוס", "circle radius"],
  ["מעגל ברדיוס", "A circle with radius"],
  ["מעגל: רדיוס", "Circle: radius"],
  ["מעגל רדיוס", "Circle radius"],
  ["שטח מעגל - רדיוס", "Circle area — radius"],
  ["אורך צלע הריבוע הוא", "The side of the square is"],
  ["אורך המלבן הוא", "The length of the rectangle is"],
  ["ורוחבו", "and its width is"],
  ["חשבו את שטח המלבן", "Calculate the area of the rectangle"],
  ["חשבו את שטח הריבוע", "Calculate the area of the square"],
  ["חשבו את שטח", "Calculate the area of"],
  ["ס״מ", "cm"],
  ["ס\"מ", "cm"],
  ["אפשרות אחרת", "Another option"],
  ["לא מתאים", "Does not fit"],
  ["בדרך כלל לא", "Usually not"],
  ["לא נכון כאן", "Not correct here"],
  ["רק במקרים מיוחדים", "Only in special cases"],
  ["תלוי בצורה", "Depends on the shape"],
  ["נכון בכל מקרה", "True in every case"],
  ["תמיד נכון", "Always true"],
  ["ורוחב", "and width"],
  ["(שונים)", "(different)"],
].sort((a, b) => b[0].length - a[0].length);

const SHAPE_WORDS = {
  ...geometryContent.shapeWords,
  ...SOLID_HE_TO_EN,
};

function mapGeometryLabel(text) {
  const t = String(text ?? "").trim();
  if (SOLID_HE_TO_EN[t]) return SOLID_HE_TO_EN[t];
  for (const [kind, opts] of Object.entries(GEOMETRY_EN_LABEL_OPTIONS)) {
    const heOpts = {
      parallel_perpendicular: ["מקבילות", "מאונכות"],
      triangles: ["שווה צלעות", "שווה שוקיים", "שונה צלעות"],
      quadrilaterals: ["ריבוע", "מלבן", "מקבילית", "טרפז"],
      transformations: ["הזזה", "שיקוף", "סיבוב", "ללא תנועה"],
      concept_transform: ["הזזה", "שיקוף", "סיבוב", "ללא תנועה"],
      shapes_basic_square: ["ריבוע", "מלבן"],
      shapes_basic_rectangle: ["ריבוע", "מלבן"],
    }[kind];
    if (heOpts) {
      const idx = heOpts.indexOf(t);
      if (idx >= 0 && opts[idx]) return opts[idx];
    }
  }
  return null;
}

function isNearlyEmptyStem(text) {
  const t = String(text ?? "")
    .replace(/[_\s.:=?\-−–—,/|()π=3.14]+/gi, "")
    .replace(/radius|diameter|circle|area|perimeter|circumference|of|the|a|what|is/gi, "")
    .trim();
  return t.length < 1;
}

/** Rebuild common procedural stems from params (IDs unchanged). */
export function rebuildGeometryStemEn(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "").replace(/^story_/, "");
  const radius = Number(p.radius);
  const hasRadius = Number.isFinite(radius) && radius > 0;

  if (kind === "circle_area" && hasRadius) {
    return `A circle with radius ${radius}. What is the area? (π = 3.14)`;
  }
  if (kind === "circle_perimeter" && hasRadius) {
    return `A circle with radius ${radius}. What is the circumference? (π = 3.14)`;
  }
  if (kind === "concept_circle" && p.patternFamily === "radius_diameter") {
    return "In a circle, the relationship between diameter and radius is:";
  }

  const side = Number(p.side ?? p.sideLength);
  const length = Number(p.length ?? p.a);
  const width = Number(p.width ?? p.b);
  if ((kind === "square_area" || kind.includes("square_area")) && Number.isFinite(side) && side > 0) {
    return `What is the area of the square with side ${side}?`;
  }
  if ((kind === "square_perimeter" || kind.includes("square_perimeter")) && Number.isFinite(side) && side > 0) {
    return `What is the perimeter of the square with side ${side}?`;
  }
  if (
    (kind === "rectangle_area" || kind.includes("rect_area")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `What is the area of the rectangle with length ${length} and width ${width}?`;
  }
  if (
    (kind === "rectangle_perimeter" || kind.includes("rect_perimeter")) &&
    Number.isFinite(length) &&
    Number.isFinite(width) &&
    length > 0 &&
    width > 0
  ) {
    return `What is the perimeter of the rectangle with length ${length} and width ${width}?`;
  }

  return null;
}

function translateGeometryPhrase(text) {
  let out = String(text ?? "").trim();
  if (!out) return out;
  if (!containsHebrew(out)) return out;
  if (SHAPE_WORDS[out]) return SHAPE_WORDS[out];

  const mapped = mapGeometryLabel(out);
  if (mapped) return mapped;

  for (const [he, en] of PHRASES) {
    if (out.includes(he)) out = out.split(he).join(en);
  }

  out = out
    .replace(/מה שטח הריבוע שצלעו (\d+)/u, "What is the area of the square with side $1?")
    .replace(/מה שטח המלבן שאורכו (\d+) ורוחבו (\d+)/u, "What is the area of the rectangle with length $1 and width $2?")
    .replace(/מה היקף הריבוע שצלעו (\d+)/u, "What is the perimeter of the square with side $1?")
    .replace(/מה היקף המלבן שאורכו (\d+) ורוחבו (\d+)/u, "What is the perimeter of the rectangle with length $1 and width $2?")
    .replace(/עיגול עם רדיוס (\d+)/gu, "A circle with radius $1")
    .replace(/מעגל:?\s*רדיוס (\d+)/gu, "Circle: radius $1")
    .replace(/רדיוס (\d+)/gu, "radius $1")
    .replace(/(\d+)\s+מול\s+(\d+)/gu, "$1 vs $2")
    .replace(/Square בגודל (\d+)×(\d+) משבצות\. כמה משבצות יש בשטחו\?/u, "A $1 by $2 unit-square square. How many unit squares cover its area?")
    .replace(/Rectangle בגודל (\d+)×(\d+) משבצות\. כמה משבצות יש בשטחו\?/u, "A $1 by $2 unit-square rectangle. How many unit squares cover its area?")
    .replace(/[\u0590-\u05FF]+/gu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return out;
}

function isShortAnswerField(field) {
  return field === "answers" || field === "options" || field === "acceptedAnswers";
}

export function localizeGeometryQuestionEn(question) {
  if (!question) return question;
  const rebuilt = rebuildGeometryStemEn(question);
  const out = mapQuestionTextFields({ ...question }, (field, value) => {
    if (isShortAnswerField(field)) {
      const label = mapGeometryLabel(value) || SHAPE_WORDS[String(value ?? "").trim()];
      if (label) return label;
      return translateGeometryPhrase(value);
    }
    if (rebuilt && (field === "question" || field === "exerciseText" || field === "questionLabel")) {
      if (containsHebrew(value) || isNearlyEmptyStem(value)) return rebuilt;
    }
    return translateGeometryPhrase(value);
  });

  if (rebuilt) {
    if (
      !out.question ||
      containsHebrew(String(out.question)) ||
      isNearlyEmptyStem(out.question)
    ) {
      out.question = rebuilt;
    }
    if (
      out.exerciseText &&
      (containsHebrew(String(out.exerciseText)) || isNearlyEmptyStem(out.exerciseText))
    ) {
      out.exerciseText = rebuilt;
    }
  }

  if (typeof out.correctAnswer === "string") {
    const mapped =
      mapGeometryLabel(out.correctAnswer) ||
      SHAPE_WORDS[out.correctAnswer.trim()] ||
      translateGeometryPhrase(out.correctAnswer);
    out.correctAnswer = mapped;
  }

  return out;
}
