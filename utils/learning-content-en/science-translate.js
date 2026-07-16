/**
 * Word-token English rendering for science MCQ bank rows (no runtime MT).
 */
import { containsHebrew } from "../learning-question-content-locale.js";

const EXACT = new Map([
  ["איפה נמצא הלב בגוף האדם?", "Where is the heart located in the human body?"],
  ["באיזה איבר אנחנו משתמשים כדי לראות?", "Which organ do we use to see?"],
  [
    "בחזה, בצד ימין של הגוף",
    "in the chest, on the right side of the body",
  ],
  ["בחזה, מעט משמאל למרכז", "in the chest, slightly left of center"],
  [
    "בבטן העליונה, באזור הכבד",
    "in the upper abdomen, near the liver",
  ],
  [
    "בגובה הצוואר, מאחורי קנה הנשימה",
    "at neck level, behind the windpipe",
  ],
  [
    "הלב נמצא בחזה, מעט שמאלה מקו האמצע, ומזרים דם לכל הגוף.",
    "The heart is in the chest, slightly left of the midline, and pumps blood through the body.",
  ],
  [
    "העיניים הן איבר הראייה. דרכן נכנס האור למוח שמפרש את התמונה.",
    "The eyes are the organs of sight. Light enters through them and the brain interprets the image.",
  ],
  [
    "הלב הוא איבר שרירי שפועל ללא הפסקה.",
    "The heart is a muscle that works without stopping.",
  ],
  [
    "תפקידו להזרים דם המכיל חמצן וחומרי מזון לכל חלקי הגוף.",
    "It pumps blood that carries oxygen and nutrients to all parts of the body.",
  ],
  ["נכון", "True"],
  ["לא נכון", "False"],
  ["כן", "Yes"],
  ["לא", "No"],
]);

const WORDS = new Map([
  ["איפה", "where"],
  ["נמצא", "is located"],
  ["נמצאת", "is located"],
  ["בגוף", "in the body"],
  ["האדם", "human"],
  ["באיזה", "which"],
  ["איבר", "organ"],
  ["אנחנו", "we"],
  ["משתמשים", "use"],
  ["כדי", "to"],
  ["לראות", "see"],
  ["לב", "heart"],
  ["עיניים", "eyes"],
  ["אוזניים", "ears"],
  ["אף", "nose"],
  ["לשון", "tongue"],
  ["שיניים", "teeth"],
  ["מוח", "brain"],
  ["ריאות", "lungs"],
  ["כבד", "liver"],
  ["קיבה", "stomach"],
  ["מעיים", "intestines"],
  ["כליות", "kidneys"],
  ["דם", "blood"],
  ["חמצן", "oxygen"],
  ["עור", "skin"],
  ["שרירים", "muscles"],
  ["עצמות", "bones"],
  ["שלד", "skeleton"],
  ["חזה", "chest"],
  ["בטן", "abdomen"],
  ["ראש", "head"],
  ["גוף", "body"],
  ["מערכת", "system"],
  ["הנשימה", "respiratory"],
  ["העיכול", "digestive"],
  ["הדם", "circulatory"],
  ["העצבים", "nervous"],
  ["צמח", "plant"],
  ["צמחים", "plants"],
  ["בעל", "animal"],
  ["חיים", "living"],
  ["בעלי", "animals"],
  ["חי", "living"],
  ["דומם", "non-living"],
  ["מים", "water"],
  ["אדמה", "soil"],
  ["אור", "light"],
  ["חום", "heat"],
  ["קור", "cold"],
  ["מוצק", "solid"],
  ["נוזל", "liquid"],
  ["גז", "gas"],
  ["מגנט", "magnet"],
  ["חשמל", "electricity"],
  ["אנרגיה", "energy"],
  ["כוח", "force"],
  ["תנועה", "movement"],
  ["חיכוך", "friction"],
  ["כבידה", "gravity"],
  ["מזג", "weather"],
  ["האוויר", "air"],
  ["גשם", "rain"],
  ["שמש", "sun"],
  ["ירח", "moon"],
  ["כדור", "Earth"],
  ["הארץ", "Earth"],
  ["כוכבים", "stars"],
  ["כוכב", "planet"],
  ["לכת", "planet"],
  ["סביבה", "environment"],
  ["זיהום", "pollution"],
  ["מיחזור", "recycling"],
  ["יער", "forest"],
  ["ים", "sea"],
  ["אוקיינוס", "ocean"],
  ["נהר", "river"],
  ["אגם", "lake"],
  ["הר", "mountain"],
  ["מדבר", "desert"],
  ["תצפית", "observation"],
  ["ניסוי", "experiment"],
  ["מדע", "science"],
  ["מדען", "scientist"],
  ["השערה", "hypothesis"],
  ["מסקנה", "conclusion"],
  ["תוצאה", "result"],
  ["משתנה", "variable"],
  ["בטיחות", "safety"],
  ["חומר", "material"],
  ["חומרים", "materials"],
  ["מתכת", "metal"],
  ["עץ", "wood"],
  ["פלסטיק", "plastic"],
  ["זכוכית", "glass"],
  ["נייר", "paper"],
  ["בריא", "healthy"],
  ["מזון", "food"],
  ["ויטמין", "vitamin"],
  ["חלבון", "protein"],
  ["תמיד", "always"],
  ["לעולם", "never"],
  ["לפעמים", "sometimes"],
  ["בדרך", "usually"],
  ["כלל", "usually"],
  ["מה", "what"],
  ["איך", "how"],
  ["למה", "why"],
  ["מתי", "when"],
  ["האם", "is"],
  ["איזה", "which"],
  ["איזו", "which"],
  ["בחר", "choose"],
  ["בחרי", "choose"],
  ["תפקיד", "role"],
  ["העיקרי", "main"],
  ["של", "of"],
  ["את", ""],
  ["ה", "the"],
  ["ב", "in"],
  ["ל", "to"],
  ["מ", "from"],
  ["על", "on"],
  ["עם", "with"],
  ["ו", "and"],
  ["או", "or"],
  ["כל", "all"],
  ["כלל", "all"],
  ["חלק", "part"],
  ["חלקי", "parts"],
  ["דרך", "through"],
  ["דרכן", "through them"],
  ["נכון", "true"],
  ["לא", "not"],
  ["יום", "day"],
  ["לילה", "night"],
  ["בוקר", "morning"],
  ["ערב", "evening"],
  ["ילד", "child"],
  ["ילדים", "children"],
  ["תלמיד", "student"],
  ["תלמידים", "students"],
  ["כיתה", "class"],
  ["מורה", "teacher"],
  ["פוטוסינתזה", "photosynthesis"],
  ["זרע", "seed"],
  ["שורש", "root"],
  ["גבעול", "stem"],
  ["עלה", "leaf"],
  ["פרח", "flower"],
  ["פרי", "fruit"],
  ["צף", "float"],
  ["טבוע", "sink"],
  ["נמס", "dissolves"],
  ["מתחמם", "heats up"],
  ["מתקרר", "cools down"],
  ["מתרחב", "expands"],
  ["מתכווץ", "contracts"],
  ["הכי", "most"],
  ["טובה", "best"],
  ["יותר", "more"],
  ["פחות", "less"],
  ["מאוד", "very"],
  ["גדול", "large"],
  ["קטן", "small"],
  ["ארוך", "long"],
  ["קצר", "short"],
  ["מהיר", "fast"],
  ["איטי", "slow"],
  ["קר", "cold"],
  ["חם", "hot"],
  ["רך", "soft"],
  ["קשה", "hard"],
  ["מעט", "slightly"],
  ["משמאל", "left"],
  ["ימין", "right"],
  ["מרכז", "center"],
  ["מקו", "line"],
  ["האמצע", "midline"],
  ["מזרים", "pumps"],
  ["מכיל", "contains"],
  ["מזון", "food"],
  ["ראייה", "sight"],
  ["נכנס", "enters"],
  ["מפרש", "interprets"],
  ["תמונה", "image"],
  ["איבר", "organ"],
  ["שרירי", "muscle"],
  ["פועל", "works"],
  ["פועם", "beats"],
  ["ללא", "without"],
  ["הפסקה", "stopping"],
  ["תפקידו", "its role"],
  ["להזרים", "to pump"],
  ["המכיל", "that contains"],
  ["העליונה", "upper"],
  ["באזור", "near"],
  ["הצוואר", "neck"],
  ["מאחורי", "behind"],
  ["קנה", "windpipe"],
  ["הנשימה", "breathing"],
  ["משפט", "sentence"],
  ["מתאר", "describes"],
  ["בצורה", "way"],
  ["הטובה", "best"],
  ["ביותר", "most"],
]);

function stripHebrewPrefixes(token) {
  let t = token;
  if (t.startsWith("ה") && t.length > 1) {
    const rest = WORDS.get(t) || WORDS.get(t.slice(1));
    if (rest) return rest;
  }
  if (t.startsWith("ב") && t.length > 1) {
    const inner = WORDS.get(t.slice(1));
    if (inner) return `in ${inner}`;
  }
  if (t.startsWith("ל") && t.length > 1) {
    const inner = WORDS.get(t.slice(1));
    if (inner) return `to ${inner}`;
  }
  if (t.startsWith("מ") && t.length > 1) {
    const inner = WORDS.get(t.slice(1));
    if (inner) return `from ${inner}`;
  }
  return null;
}

function translateToken(token) {
  const t = token.trim();
  if (!t) return "";
  if (!containsHebrew(t)) return t;
  if (WORDS.has(t)) return WORDS.get(t);
  const pref = stripHebrewPrefixes(t);
  if (pref) return pref;
  return "";
}

export function translateScienceText(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return raw;
  if (EXACT.has(raw)) return EXACT.get(raw);
  if (!containsHebrew(raw)) return raw;

  const tokens = raw.split(/(\s+|[,.!?;:()\-–—])/u).filter((x) => x !== "");
  const parts = [];
  for (const token of tokens) {
    if (/^\s+$/.test(token) || /^[,.!?;:()\-–—]$/.test(token)) {
      parts.push(token.trim() ? token : token);
      continue;
    }
    const tr = translateToken(token);
    if (tr) parts.push(tr);
  }

  let out = parts
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!out || containsHebrew(out)) {
    // Last resort: keep numerals/Latin, drop remaining Hebrew tokens
    out = raw
      .replace(/[\u0590-\u05FF]+/gu, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  if (!out) return "Science question";
  if (!/[.!?]$/.test(out) && raw.includes("?")) out += "?";
  if (!/[.!?]$/.test(out) && !raw.includes("?")) out += ".";
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export function translateScienceFields(row) {
  if (!row) return row;
  const out = { ...row };
  if (typeof out.stem === "string") out.stem = translateScienceText(out.stem);
  if (typeof out.question === "string") out.question = translateScienceText(out.question);
  if (Array.isArray(out.options)) out.options = out.options.map((o) => translateScienceText(o));
  if (typeof out.explanation === "string") out.explanation = translateScienceText(out.explanation);
  if (Array.isArray(out.theoryLines)) out.theoryLines = out.theoryLines.map((l) => translateScienceText(l));
  return out;
}
