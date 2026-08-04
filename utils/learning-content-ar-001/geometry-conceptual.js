/**
 * ar-001 localization for geometry conceptual-bank strings.
 * Bank rows freeze burnDownCopy() at module load (usually English); re-map at render time.
 */
import { getActiveLearningBurnDownLocale } from "../../lib/learning/burn-down-copy.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";

/** Hardcoded English stems in geometry-conceptual-bank.js (not via burnDownCopy). */
const LITERAL_STEMS_EN_TO_AR = Object.freeze({
  "There is a square with side 5 cm. If we ask 'how much paper is needed to cover the whole face,' which concept are we looking for?":
    "هناك مربع طول ضلعه 5 سم. إذا سألنا «كم ورقة نحتاج لتغطية الوجه بالكامل»، فأي مفهوم نبحث عنه؟",
  "A rectangle is 8 m long and 3 m wide. What is the correct first step to find the floor area?":
    "مستطيل طوله 8 م وعرضه 3 م. ما الخطوة الصحيحة الأولى لإيجاد مساحة الأرضية؟",
  "A rectangular rug for a large room: length 8 m and width 3 m. Before computing the space area — what is a good first step?":
    "سجادة مستطيلة لغرفة كبيرة: الطول 8 م والعرض 3 م. قبل حساب مساحة الفراغ — ما الخطوة الأولى الجيدة؟",
  "A right angle is about:": "الزاوية القائمة تقارب:",
  "A triangle with all three sides equal — what is it called?":
    "مثلث أضلاعه الثلاثة متساوية — ماذا يُسمى؟",
  "A cube usually has how many square faces?": "كم وجهًا مربعاً للمكعب عادة؟",
  "A rotation of one-quarter of a full turn about a center is usually called:":
    "دوران بمقدار ربع دورة كاملة حول مركز يُسمى عادة:",
  "A triangle can have two obtuse angles (greater than 90°). True or false?":
    "يمكن أن يكون للمثلث زاويتان منفرجتان (أكبر من 90°). صحيح أم خطأ؟",
  "When counting 'unit squares' inside a shape, what are you roughly measuring?":
    "عند عدّ «مربعات الوحدة» داخل شكل، ماذا تقيس تقريباً؟",
  "A square has perimeter 20 cm. What is true about the side length?":
    "مربع محيطه 20 سم. ما الصحيح بشأن طول الضلع؟",
});

/** Common MCQ / TF tokens not always present as burn-down keys. */
const OPTION_TOKENS_EN_TO_AR = Object.freeze({
  Area: "المساحة",
  Perimeter: "المحيط",
  Volume: "الحجم",
  "Interior angle": "زاوية داخلية",
  "Diagonal length only": "طول القطر فقط",
  True: "صحيح",
  False: "خطأ",
  "90°": "90°",
  "180°": "180°",
  "45°": "45°",
  "360°": "360°",
  "60°": "60°",
  "6": "6",
  "4": "4",
  Square: "مربع",
  Triangle: "مثلث",
  Circle: "دائرة",
  Rectangle: "المستطيل",
  "Isosceles triangle": "مثلث متساوي الساقين",
  "Always a right triangle": "دائماً مثلث قائم",
  "Cube": "مكعب",
  "Cylinder": "اسطوانة",
  "Cone": "مخروط",
  "Sphere": "جسم كروي",
  "Pyramid": "هرم",
  "Rectangular prism": "المنشور المستطيل",
  "There is no difference between a pyramid and a prism":
    "لا فرق بين الهرم والمنشور",
  "A prism always has no faces": "المنشور بلا أوجه دائماً",
  "Both must be round": "يجب أن يكون كلاهما دائرياً",
  "unrelated to base": "غير مرتبط بالقاعدة",
  "No equal sides": "لا توجد أضلاع متساوية",
  "No right angles": "لا زوايا قائمة",
  "Always equal and bisect each other": "متساويان وينصفان بعضهما البعض",
  "Always perpendicular at 90° to each other at the center only in a general rectangle":
    "دائماً متعامدان بزاوية 90° عند المركز فقط في مستطيل عام",
  "at 90° to each other at the center only in a general rectangle":
    "بزاوية 90° عند المركز فقط في مستطيل عام",
  Parallel: "موازي",
  Perpendicular: "عمودي",
  "unrelated to same": "غير مرتبط بذلك",
  "(not rectangular)": "(ليس مستطيلاً)",
  "not rectangular": "ليس مستطيلاً",
  Equilateral: "متساوي الأضلاع",
  Isosceles: "متساوي الساقين",
  Scalene: "مختلف الأضلاع",
  "Triangle Equilateral": "مثلث متساوي الأضلاع",
  Hexagon: "سداسي",
  Trapezoid: "شبه منحرف",
  Parallelogram: "متوازي الأضلاع",
  Rhombus: "معين",
  "Only a trapezoid": "شبه منحرف فقط",
  "A mirror image": "صورة مرآة",
  "Rotation about a center": "دوران حول مركز",
  "Translation without rotation": "انتقال بدون دوران",
  "Enlarging the shape": "تكبير الشكل",
  "Add all the sides (like perimeter)": "اجمع كل الأضلاع (مثل المحيط)",
  "Multiply length by 4": "اضرب الطول في 4",
  "Divide length by 2 only": "اقسم الطول على 2 فقط",
  "The areas are always equal": "المساحات متساوية دائماً",
  "The taller rectangle always has larger area regardless of width":
    "المستطيل الأطول مساحة أكبر دائماً بغض النظر عن العرض",
  "The perimeter determines the area uniquely": "المحيط يحدد المساحة بشكل فريد",
  "The third angle is always 90°": "الزاوية الثالثة دائماً 90°",
  "The sum of angles in a triangle is 360°": "مجموع زوايا المثلث 360°",
  "There is not enough information without side lengths": "لا توجد معلومات كافية دون أطوال الأضلاع",
  "They always add to 180° with each other": "مجموعهما دائماً 180°",
  "Their sum is always 90°": "مجموعهما دائماً 90°",
  "There is no fixed relationship": "لا توجد علاقة ثابتة",
  "Always perpendicular": "دائماً متعامدان",
  "Always the same length as the diagonals": "دائماً بنفس طول القطرين",
  "Form a right angle at every join": "يشكّلان زاوية قائمة عند كل اتصال",
  "Only the same area but a different shape": "نفس المساحة فقط بشكل مختلف",
  "Only the same perimeter": "نفس المحيط فقط",
  "Only equal angles with no regard to sides": "زوايا متساوية فقط دون اعتبار للأضلاع",
  "They never meet": "لا يلتقيان أبداً",
  "They are always the same length": "دائماً بنفس الطول",
  "They are always parallel": "دائماً متوازيان",
  "They must meet at one point": "يجب أن يلتقيا في نقطة واحدة",
  "They are always perpendicular": "دائماً متعامدان",
  "They are always equal in length": "دائماً متساويان في الطول",
  "Lines equal in length": "خطوط متساوية الطول",
  "Lines that cut a 45° angle": "خطوط تقطع زاوية 45°",
  "They always meet at a 90° angle": "يلتقيان دائماً بزاوية 90°",
  "They must be the same length": "يجب أن يكونا بنفس الطول",
  "Lines that cannot be compared": "خطوط لا يمكن مقارنتها",
  "Only the length of the longest edge": "طول أطول حرف فقط",
  "Only the area of one face": "مساحة وجه واحد فقط",
  "Only the perimeter of the base": "محيط القاعدة فقط",
  "length × width × height": "الطول × العرض × الارتفاع",
  "length + width + height": "الطول + العرض + الارتفاع",
  "(length + width) × 2": "(الطول + العرض) × 2",
  "length × height only without width": "الطول × الارتفاع فقط دون العرض",
  "The radius is twice the diameter": "نصف القطر ضعف القطر",
  "They are always equal": "دائماً متساويان",
  "The area of the circle": "مساحة الدائرة",
  "The volume of the tire": "حجم الإطار",
  "Radius alone without multiplication": "نصف القطر وحده دون ضرب",
  "Always the shortest side": "دائماً أقصر ضلع",
  "Any side that was not chosen": "أي ضلع لم يُختر",
  "Always a side next to the right angle": "دائماً ضلع بجانب الزاوية القائمة",
  "Another option": "خيار آخر",
  "Does not fit": "لا يناسب",
  "Usually not": "عادة لا",
  "Not correct here": "غير صحيح هنا",
  "Only in special cases": "فقط في حالات خاصة",
  "Depends on the shape": "يعتمد على الشكل",
  "True in every case": "صحيح في كل حالة",
  "Always true": "صحيح دائماً",
  "Concepts (easy)": "مفاهيم (سهل)",
  "Concepts (medium)": "مفاهيم (متوسط)",
  "Concepts (challenge)": "مفاهيم (تحدٍّ)",
  "A pyramid has one apex; a prism has two similar parallel bases":
    "للهرم رأس واحد؛ للمنشور قاعدتان متشابهتان متوازيتان",
  "A perpendicular segment from the opposite vertex to the base or its extension":
    "قطعة عمودية من الرأس المقابل إلى القاعدة أو امتدادها",
});

let cachedMap = null;

function buildEnToArMap() {
  if (cachedMap) return cachedMap;
  const en =
    resolveRegisteredContentPack("en", "learning", "burn-down-index.json")?.[
      "utils__geometry-conceptual-bank"
    ] || {};
  const ar =
    resolveRegisteredContentPack("ar-001", "learning", "burn-down-index.json")?.[
      "utils__geometry-conceptual-bank"
    ] || {};
  const map = Object.create(null);
  Object.assign(map, OPTION_TOKENS_EN_TO_AR, LITERAL_STEMS_EN_TO_AR);
  for (const key of Object.keys(ar)) {
    const arVal = ar[key];
    if (typeof arVal !== "string") continue;
    map[key] = arVal;
    const enVal = en[key];
    if (typeof enVal === "string" && enVal.trim()) {
      map[enVal.trim()] = arVal;
    }
  }
  cachedMap = map;
  return map;
}

export function isAr001GeometryContentLocale() {
  return String(getActiveLearningBurnDownLocale() || "") === "ar-001";
}

/**
 * @param {unknown} text
 * @returns {string}
 */
export function localizeGeometryConceptualTextAr001(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return raw;
  if (!isAr001GeometryContentLocale()) return raw;
  if (/[\u0600-\u06FF]/.test(raw) && !/[A-Za-z]{4,}/.test(raw)) return raw;

  // MCQ pad suffixes from mcq-fail-content-repair
  const padMatch = raw.match(/^(.*?)( in another case| usually| sometimes| in general)$/i);
  const core = padMatch ? padMatch[1].trim() : raw;
  const padAr = padMatch
    ? {
        " in another case": " في حالة أخرى",
        " usually": " عادةً",
        " sometimes": " أحيانًا",
        " in general": " عمومًا",
      }[padMatch[2].toLowerCase()] ||
      {
        " In another case": " في حالة أخرى",
      }[padMatch[2]] ||
      ""
    : "";

  const map = buildEnToArMap();
  let translated = map[core];
  if (!translated) {
    const lower = core.toLowerCase();
    for (const [k, v] of Object.entries(map)) {
      if (String(k).toLowerCase() === lower) {
        translated = v;
        break;
      }
    }
  }
  if (!translated && /^[\d./ππ°%\-+×÷=]+$/u.test(core)) {
    translated = core;
  }
  if (!translated && padMatch) {
    if (map[raw]) return map[raw];
  }
  if (translated != null && translated !== "" && (translated !== core || padMatch)) {
    if (!padMatch) return translated;
    const padKey = padMatch[2].toLowerCase();
    const pad =
      padKey === " in another case"
        ? " في حالة أخرى"
        : padKey === " usually"
          ? " عادةً"
          : padKey === " sometimes"
            ? " أحيانًا"
            : padKey === " in general"
              ? " عمومًا"
              : "";
    return `${translated}${pad}`;
  }
  if (translated) return translated;

  // Phrase-level fallback for padded / composite distractors
  let out = raw;
  const phrasePairs = [
    [/There is no difference between a pyramid and a prism/gi, "لا فرق بين الهرم والمنشور"],
    [/A prism always has no faces/gi, "المنشور بلا أوجه دائماً"],
    [/Both must be round/gi, "يجب أن يكون كلاهما دائرياً"],
    [/unrelated to base/gi, "غير مرتبط بالقاعدة"],
    [/unrelated to same/gi, "غير مرتبط بذلك"],
    [/\(not rectangular\)/gi, "(ليس مستطيلاً)"],
    [/not rectangular/gi, "ليس مستطيلاً"],
    [/They must meet at one point/gi, "يجب أن يلتقيا في نقطة واحدة"],
    [/They are always equal in length/gi, "دائماً متساويان في الطول"],
    [/They are always perpendicular/gi, "دائماً متعامدان"],
    [/They never meet/gi, "لا يلتقيان أبداً"],
    [/They are always parallel/gi, "دائماً متوازيان"],
    [/They must be the same length/gi, "يجب أن يكونا بنفس الطول"],
    [/They always meet at a 90° angle/gi, "يلتقيان دائماً بزاوية 90°"],
    [/Lines that cannot be compared/gi, "خطوط لا يمكن مقارنتها"],
    [/Lines equal in length/gi, "خطوط متساوية الطول"],
    [/Lines that cut a 45° angle/gi, "خطوط تقطع زاوية 45°"],
    [/Always perpendicular/gi, "دائماً متعامدان"],
    [/Always the same length as the diagonals/gi, "دائماً بنفس طول القطرين"],
    [/Form a right angle at every join/gi, "يشكّلان زاوية قائمة عند كل اتصال"],
    [/There is no fixed relationship/gi, "لا توجد علاقة ثابتة"],
    [/Their sum is always 90°/gi, "مجموعهما دائماً 90°"],
    [/They always add to 180° with each other/gi, "مجموعهما دائماً 180°"],
    [/The third angle is always 90°/gi, "الزاوية الثالثة دائماً 90°"],
    [/The sum of angles in a triangle is 360°/gi, "مجموع زوايا المثلث 360°"],
    [/There is not enough information without side lengths/gi, "لا توجد معلومات كافية دون أطوال الأضلاع"],
    [/Only the length of the longest edge/gi, "طول أطول حرف فقط"],
    [/Only the area of one face/gi, "مساحة وجه واحد فقط"],
    [/Only the perimeter of the base/gi, "محيط القاعدة فقط"],
    [/No equal sides/gi, "لا توجد أضلاع متساوية"],
    [/No right angles/gi, "لا زوايا قائمة"],
    [/Always equal and bisect each other/gi, "متساويان وينصفان بعضهما البعض"],
    [/at 90° to each other at the center only in a general rectangle/gi, "بزاوية 90° عند المركز فقط في مستطيل عام"],
    [/Always perpendicular/gi, "دائماً متعامدان"],
    [/\bin another case\b/gi, "في حالة أخرى"],
    [/\busually\b/gi, "عادةً"],
    [/\bsometimes\b/gi, "أحيانًا"],
    [/\bin general\b/gi, "عمومًا"],
    [/\bCylinder\b/g, "اسطوانة"],
    [/\bCone\b/g, "مخروط"],
    [/\bCube\b/g, "مكعب"],
    [/\bSphere\b/g, "جسم كروي"],
    [/\bPyramid\b/g, "هرم"],
    [/\bRectangular prism\b/gi, "المنشور المستطيل"],
    [/\bTrapezoid\b/gi, "شبه منحرف"],
    [/\bParallelogram\b/gi, "متوازي الأضلاع"],
    [/\bRhombus\b/gi, "معين"],
    [/\bParallel\b/g, "موازي"],
    [/\bPerpendicular\b/g, "عمودي"],
  ];
  for (const [re, ar] of phrasePairs) {
    out = out.replace(re, ar);
  }
  if (out !== raw && (/[\u0600-\u06FF]/.test(out) || !/[A-Za-z]{4,}/.test(out))) {
    return out.replace(/\s{2,}/g, " ").replace(/\s+,/g, ",").trim();
  }
  return raw;
}

/**
 * @param {Record<string, unknown>} question
 * @returns {Record<string, unknown>}
 */
export function localizeGeometryConceptualQuestionAr001(question) {
  if (!question || !isAr001GeometryContentLocale()) return question;
  const out = { ...question };
  if (typeof out.question === "string") {
    out.question = localizeGeometryConceptualTextAr001(out.question);
  }
  if (typeof out.exerciseText === "string") {
    out.exerciseText = localizeGeometryConceptualTextAr001(out.exerciseText);
  }
  if (out.correctAnswer != null) {
    out.correctAnswer = localizeGeometryConceptualTextAr001(String(out.correctAnswer));
  }
  if (Array.isArray(out.answers)) {
    out.answers = out.answers.map((a) => localizeGeometryConceptualTextAr001(String(a)));
  }
  if (Array.isArray(out.options)) {
    out.options = out.options.map((a) => localizeGeometryConceptualTextAr001(String(a)));
  }
  if (out.params && typeof out.params === "object") {
    const p = { ...out.params };
    if (typeof p.conceptualLevelFraming === "string") {
      p.conceptualLevelFraming = localizeGeometryConceptualTextAr001(p.conceptualLevelFraming);
    }
    out.params = p;
  }
  return out;
}
