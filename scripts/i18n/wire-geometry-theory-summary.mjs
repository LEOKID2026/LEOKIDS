/**
 * Locale-wire getTheorySummary lines.push("...") → geCopy(key).
 */
import fs from "node:fs";
import crypto from "node:crypto";

const GEO = "utils/geometry-explanations.js";
const SLUG = "utils__geometry-explanations";
let src = fs.readFileSync(GEO, "utf8");

/** curated Arabic for theory lines */
const AR = {
  "Area measures how much space a shape takes up on a surface.":
    "المساحة تقيس مقدار الحيز الذي يشغله الشكل على سطح.",
  "square: area = side × side.": "المربع: المساحة = الضلع × الضلع.",
  "rectangle: area = length × width.": "المستطيل: المساحة = الطول × العرض.",
  "triangle: area = (base × height) ÷ 2.": "المثلث: المساحة = (القاعدة × الارتفاع) ÷ 2.",
  "parallelogram: area = base × height.": "متوازي الأضلاع: المساحة = القاعدة × الارتفاع.",
  "trapezoid: area = ((base 1 + base 2) × height) ÷ 2.":
    "شبه المنحرف: المساحة = ((القاعدة 1 + القاعدة 2) × الارتفاع) ÷ 2.",
  "square: area = side².": "المربع: المساحة = الضلع².",
  "circle: area = π × radius².": "الدائرة: المساحة = π × نصف القطر².",
  "Perimeter measures the length of the path around the shape.":
    "المحيط يقيس طول المسار حول الشكل.",
  "always add all the sides.": "اجمع دائمًا كل الأضلاع.",
  "square: perimeter = side × 4.": "المربع: المحيط = الضلع × 4.",
  "rectangle: perimeter = (length + width) × 2.":
    "المستطيل: المحيط = (الطول + العرض) × 2.",
  "for every shape: perimeter = the sum of all side lengths.":
    "لكل شكل: المحيط = مجموع أطوال كل الأضلاع.",
  "circle: circumference = 2 × π × radius.":
    "الدائرة: المحيط = 2 × π × نصف القطر.",
  "Volume measures how much space a solid takes up (three-dimensional).":
    "الحجم يقيس مقدار الحيز الذي يشغله المجسّم (ثلاثي الأبعاد).",
  "cube: volume = side³.": "المكعب: الحجم = الضلع³.",
  "box (rectangular): volume = length × width × height.":
    "متوازي المستطيلات: الحجم = الطول × العرض × الارتفاع.",
  "box: volume = length × width × height.":
    "الصندوق: الحجم = الطول × العرض × الارتفاع.",
  "cylinder: volume = π × radius² × height.":
    "الأسطوانة: الحجم = π × نصف القطر² × الارتفاع.",
  "sphere: volume = (4/3) × π × radius³.":
    "الكرة: الحجم = (4/3) × π × نصف القطر³.",
  "In every triangle: the sum of the interior angles is 180°.":
    "في كل مثلث: مجموع الزوايا الداخلية 180°.",
  "If two angles are known — find the third using 180° minus their sum.":
    "إذا عُرفت زاويتان — أوجد الثالثة بـ 180° ناقص مجموعهما.",
  "in a right triangle: a² + b² = c² (c is the hypotenuse).":
    "في المثلث القائم: a² + b² = c² (c هو الوتر).",
  "If both legs are known — find the hypotenuse: c = √(a² + b²).":
    "إذا عُرف الضلعان القائمان — أوجد الوتر: c = √(a² + b²).",
  "If the hypotenuse and one leg are known — find the missing leg: √(c² - leg²).":
    "إذا عُرف الوتر وأحد الضلعين — أوجد الضلع الناقص: √(c² - leg²).",
  "Square: 4 equal sides, 4 right angles.":
    "المربع: 4 أضلاع متساوية، و4 زوايا قائمة.",
  "Rectangle: 2 pairs of equal sides, 4 right angles.":
    "المستطيل: زوجان من الأضلاع المتساوية، و4 زوايا قائمة.",
  "Square: 4 equal sides, 4 right angles (90°).":
    "المربع: 4 أضلاع متساوية، و4 زوايا قائمة (90°).",
  "Rectangle: 2 pairs of equal sides, 4 right angles (90°).":
    "المستطيل: زوجان من الأضلاع المتساوية، و4 زوايا قائمة (90°).",
  "Square: all 4 sides are equal in length.":
    "المربع: الأضلاع الأربعة كلها متساوية الطول.",
  "Rectangle: it has 2 pairs of equal sides (one long pair and one short pair).":
    "المستطيل: له زوجان من الأضلاع المتساوية (زوج طويل وزوج قصير).",
  "Parallel lines: never meet.": "المستقيمات المتوازية: لا تلتقي أبدًا.",
  "Perpendicular lines: form a right angle (90°).":
    "المستقيمات المتعامدة: تكوّن زاوية قائمة (90°).",
  "Equilateral triangle: all 3 sides are equal.":
    "المثلث المتساوي الأضلاع: الأضلاع الثلاثة متساوية.",
  "Isosceles triangle: 2 equal sides.": "المثلث المتساوي الساقين: ضلعان متساويان.",
  "Scalene triangle: all sides are different.":
    "المثلث مختلف الأضلاع: كل الأضلاع مختلفة.",
  "Parallelogram: 2 pairs of parallel sides.":
    "متوازي الأضلاع: زوجان من الأضلاع المتوازية.",
  "Trapezoid: one pair of parallel sides.":
    "شبه المنحرف: زوج واحد من الأضلاع المتوازية.",
  "Translation: copies the shape in the same direction and distance.":
    "الإزاحة: تنسخ الشكل في الاتجاه والمسافة نفسيهما.",
  "Reflection: flips the shape about a line (axis).":
    "الانعكاس: يقلب الشكل حول خط (محور).",
  "Rotation: moves the shape around a point.": "الدوران: يحرّك الشكل حول نقطة.",
  "a 90-degree rotation° = a quarter turn, 180° = a half turn, 360° = a full turn.":
    "دوران 90° = ربع دورة، 180° = نصف دورة، 360° = دورة كاملة.",
  "Symmetry: a shape that has an axis of symmetry.":
    "التماثل: شكل له محور تماثل.",
  "Square: 4 axes of symmetry, rectangle: 2 axes of symmetry.":
    "المربع: 4 محاور تماثل، المستطيل: محوران.",
  "Diagonal: a segment connecting two vertices not on the same side.":
    "القطر: قطعة تصل رأسين ليسا على الضلع نفسه.",
  "square: diagonal = side × √2.": "المربع: القطر = الضلع × √2.",
  "rectangle: diagonal = √(length² + width²).":
    "المستطيل: القطر = √(الطول² + العرض²).",
  "parallelogram: diagonal = √(side 1² + side 2²).":
    "متوازي الأضلاع: القطر = √(الضلع 1² + الضلع 2²).",
  "height: the distance from the vertex to the base (in a triangle) or the distance between parallel sides (in a parallelogram/trapezoid).":
    "الارتفاع: المسافة من الرأس إلى القاعدة (في المثلث) أو بين الضلعين المتوازيين (في متوازي الأضلاع/شبه المنحرف).",
  "triangle: area = (base × height) ÷ 2, so the height = (area × 2) ÷ base.":
    "المثلث: المساحة = (القاعدة × الارتفاع) ÷ 2، إذن الارتفاع = (المساحة × 2) ÷ القاعدة.",
  "parallelogram: area = base × height, so the height = area ÷ base.":
    "متوازي الأضلاع: المساحة = القاعدة × الارتفاع، إذن الارتفاع = المساحة ÷ القاعدة.",
  "trapezoid: area = ((base 1 + base 2) × height) ÷ 2, so the height = (area × 2) ÷ (base 1 + base 2).":
    "شبه المنحرف: المساحة = ((القاعدة 1 + القاعدة 2) × الارتفاع) ÷ 2، إذن الارتفاع = (المساحة × 2) ÷ (القاعدة 1 + القاعدة 2).",
  "Tiling: covering a surface with no gaps.": "التبليط: تغطية سطح دون فراغات.",
  "square: 90-degree angle°, Equilateral triangle: 60-degree angle°.":
    "المربع: زاوية 90°، المثلث المتساوي الأضلاع: زاوية 60°.",
  "Circle: all points at an equal distance from the center.":
    "الدائرة: كل النقاط على مسافة متساوية من المركز.",
  "circle area = π × radius².": "مساحة الدائرة = π × نصف القطر².",
  "circle circumference = 2 × π × radius.": "محيط الدائرة = 2 × π × نصف القطر.",
  "Cube: 6 equal square faces.": "المكعب: 6 أوجه مربعة متساوية.",
  "Rectangular prism: 6 rectangular faces.": "متوازي المستطيلات: 6 أوجه مستطيلة.",
  "Cylinder: 2 round bases.": "الأسطوانة: قاعدتان دائريتان.",
  "Sphere: all points at an equal distance from the center.":
    "الكرة: كل النقاط على مسافة متساوية من المركز.",
  "It is important to remember the formula that fits the topic and shape.":
    "من المهم تذكّر الصيغة المناسبة للموضوع والشكل.",
};

function keyFor(en) {
  const base = en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 56);
  const h = crypto.createHash("md5").update(en).digest("hex").slice(0, 8);
  return `theory_${base}_${h}`;
}

const added = {};
src = src.replace(/lines\.push\("((?:\\.|[^"\\])*)"\)/g, (m, raw) => {
  const en = raw.replace(/\\"/g, '"').replace(/\\n/g, "\n");
  if (!(en in AR)) {
    console.warn("missing AR for:", en.slice(0, 80));
    return m;
  }
  const k = keyFor(en);
  added[k] = { en, ar: AR[en] };
  return `lines.push(geCopy(${JSON.stringify(k)}))`;
});

fs.writeFileSync(GEO, src);

for (const loc of ["en", "ar-001"]) {
  const leafP = `content-packs/${loc}/learning/burn-down/utils__geometry-explanations.json`;
  const idxP = `content-packs/${loc}/learning/burn-down-index.json`;
  const leaf = JSON.parse(fs.readFileSync(leafP, "utf8"));
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  leaf.copy = leaf.copy || {};
  for (const [k, v] of Object.entries(added)) {
    const val = loc === "en" ? v.en : v.ar;
    leaf.copy[k] = val;
    idx[SLUG][k] = val;
  }
  fs.writeFileSync(leafP, JSON.stringify(leaf, null, 2) + "\n");
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
}

console.log("theory keys", Object.keys(added).length);
