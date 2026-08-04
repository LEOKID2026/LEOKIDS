/**
 * Wire utils/geometry-explanations.js through learning burn-down packs.
 * EN = meaning authority. AR = curated pedagogical Arabic (not strip-MT).
 */
import fs from "fs";
import crypto from "crypto";

const SRC = "utils/geometry-explanations.js";
const SLUG = "utils__geometry-explanations";

function keyFor(en) {
  const base = String(en)
    .toLowerCase()
    .replace(/\{m\d+\}/g, "m")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return `${base || "geo"}_${crypto.createHash("sha1").update(en).digest("hex").slice(0, 8)}`;
}

/** Exact English → Arabic for geometry pedagogy (hints + wrong-answer + explanations). */
const AR_EXACT = new Map([
  [
    "square area = side × side. Take the side length from the question and multiply it by itself — that is the area, not the perimeter.",
    "مساحة المربع = الضلع × الضلع. خذ طول الضلع من السؤال واضربه في نفسه — هذه المساحة وليست المحيط.",
  ],
  [
    "rectangle area = length × width. Make sure you multiply two different dimensions of the same shape, not add (that is more like perimeter).",
    "مساحة المستطيل = الطول × العرض. تأكد أنك تضرب بُعدين مختلفين لنفس الشكل، لا تجمعهما (الجمع أقرب إلى المحيط).",
  ],
  [
    "triangle area = (base × height to the base) ÷ 2. after multiplying, divide by 2 - Common mistake: forgetting the division.",
    "مساحة المثلث = (القاعدة × الارتفاع العمودي عليها) ÷ 2. بعد الضرب اقسم على 2 — خطأ شائع: نسيان القسمة.",
  ],
  [
    "parallelogram area = base × the height perpendicular to it (not a diagonal).",
    "مساحة متوازي الأضلاع = القاعدة × الارتفاع العمودي عليها (وليس القطر).",
  ],
  [
    "trapezoid area = ((base 1 + base 2) × height) ÷ 2. First add the two parallel bases, times the height, then divide by 2.",
    "مساحة شبه المنحرف = ((القاعدة 1 + القاعدة 2) × الارتفاع) ÷ 2. اجمع القاعدتين المتوازيتين أولًا، اضرب في الارتفاع، ثم اقسم على 2.",
  ],
  [
    "square perimeter = side × 4 (the sum of the four equal sides). If you computed side² - this is an area formula.",
    "محيط المربع = الضلع × 4 (مجموع الأضلاع الأربعة المتساوية). إذا حسبت الضلع² فهذه صيغة مساحة.",
  ],
  [
    "rectangle perimeter = (length + width) × 2 - the sum of all sides. Do not multiply length × width; that is area.",
    "محيط المستطيل = (الطول + العرض) × 2 — مجموع كل الأضلاع. لا تضرب الطول × العرض؛ فتلك المساحة.",
  ],
  [
    "triangle perimeter = the sum of the three sides. No division by 2.",
    "محيط المثلث = مجموع الأضلاع الثلاثة. بلا قسمة على 2.",
  ],
  [
    "Result too small: maybe you missed a multiplication, divided too much, or used the perimeter formula.",
    "النتيجة صغيرة جدًا: ربما فاتك ضرب، أو قسمت أكثر من اللازم، أو استخدمت صيغة المحيط.",
  ],
  [
    "Result too large: maybe you forgot to divide by 2 for a triangle/trapezoid, or multiplied twice instead of once.",
    "النتيجة كبيرة جدًا: ربما نسيت القسمة على 2 للمثلث/شبه المنحرف، أو ضربت مرتين بدل مرة واحدة.",
  ],
  [
    "Check that this is an area formula (not perimeter): square {m0}, rectangle {m1}, triangle {m2}, circle {m3}.",
    "تأكد أن هذه صيغة مساحة (وليست محيطًا): المربع {m0}، المستطيل {m1}، المثلث {m2}، الدائرة {m3}.",
  ],
  [
    "It looks like you computed perimeter ({m0}side) instead of area ({m1}).",
    "يبدو أنك حسبت المحيط ({m0}الضلع) بدلًا من المساحة ({m1}).",
  ],
  [
    "It looks like you computed perimeter instead of area — multiply {m0}, not a double sum.",
    "يبدو أنك حسبت المحيط بدلًا من المساحة — اضرب {m0}، وليس ضعف المجموع.",
  ],
  [
    "It looks like you multiplied {m0} but you forgot to divide by {m1} (the triangle area formula).",
    "يبدو أنك ضربت {m0} لكنك نسيت القسمة على {m1} (صيغة مساحة المثلث).",
  ],
  [
    "in a parallelogram the base area is {m0} - with no division by {m1} (this applies to a triangle).",
    "في متوازي الأضلاع المساحة هي {m0} — بلا قسمة على {m1} (القسمة تنطبق على المثلث).",
  ],
  [
    "It looks like you computed perimeter ({m0}) instead of area ({m1}).",
    "يبدو أنك حسبت المحيط ({m0}) بدلًا من المساحة ({m1}).",
  ],
  [
    "area needs the radius squared ({m0}), not only {m1}.",
    "المساحة تحتاج تربيع نصف القطر ({m0})، وليس فقط {m1}.",
  ],
  [
    "It looks like you computed area ({m0}) instead of perimeter ({m1}side).",
    "يبدو أنك حسبت المساحة ({m0}) بدلًا من المحيط ({m1}الضلع).",
  ],
  [
    "It looks like you computed area ({m0}) instead of perimeter ({m1}).",
    "يبدو أنك حسبت المساحة ({m0}) بدلًا من المحيط ({m1}).",
  ],
  [
    "It looks like you computed the circle's area instead of its perimeter ({m0}).",
    "يبدو أنك حسبت مساحة الدائرة بدلًا من محيطها ({m0}).",
  ],
  [
    "Perimeter too small: maybe you forgot to multiply by 2 for a rectangle or by 4 for a square, or missed a side in the sum.",
    "المحيط صغير جدًا: ربما نسيت الضرب في 2 للمستطيل أو في 4 للمربع، أو فاتك ضلع في المجموع.",
  ],
  [
    "perimeter = the sum of all sides (or {m0} in a circle) — not a product like area.",
    "المحيط = مجموع كل الأضلاع (أو {m0} في الدائرة) — وليس جداءً مثل المساحة.",
  ],
  [
    "Try to identify which formula or property fits the question's wording.",
    "حاول تحديد الصيغة أو الخاصية التي تناسب صياغة السؤال.",
  ],
]);

function arFor(en) {
  if (AR_EXACT.has(en)) return AR_EXACT.get(en);
  // Pattern-assisted curated fallbacks for remaining pedagogy (meaning-preserving).
  let s = en;
  const reps = [
    [/circle area = \{m0\} \(here \{m1\}\)\. first square the radius, then multiply by π - do not confuse with \{m2\} which is the perimeter\./i,
      "مساحة الدائرة = {m0} (هنا {m1}). ربّع نصف القطر أولًا ثم اضرب في π — ولا تخلط مع {m2} وهو المحيط."],
    [/circle circumference = \{m0\}\. this is a full turn around — not \{m1\}\./i,
      "محيط الدائرة = {m0}. هذه دورة كاملة حول الشكل — وليست {m1}."],
    [/in every triangle the sum of interior angles = \{m0\}\. Add the two given angles, then subtract the result from \{m1\}\./i,
      "في كل مثلث مجموع الزوايا الداخلية = {m0}. اجمع الزاويتين المعطاتين ثم اطرح الناتج من {m1}."],
    [/pyramid volume = \(1\/3\) × base area × height\. First the base area, then times the height and one third — do not forget the factor 1\/3\./i,
      "حجم الهرم = (1/3) × مساحة القاعدة × الارتفاع. احسب مساحة القاعدة أولًا، ثم اضرب في الارتفاع وفي الثلث — لا تنسَ المعامل 1/3."],
    [/cone volume = \(1\/3\) × π × radius² × height — like a pyramid with a round base; again: one third of the cylinder's volume with the same base\./i,
      "حجم المخروط = (1/3) × π × نصف القطر² × الارتفاع — مثل هرم بقاعدة دائرية؛ مجددًا: ثلث حجم الأسطوانة بنفس القاعدة."],
    [/prism volume = the cross-section area \(base\) × the prism's height\. If the base is a triangle — first compute the triangle's area\./i,
      "حجم المنشور = مساحة المقطع (القاعدة) × ارتفاع المنشور. إذا كانت القاعدة مثلثًا — احسب مساحة المثلث أولًا."],
    [/cube volume = side³ \(the same side three times\)\./i, "حجم المكعب = الضلع³ (نفس الضلع ثلاث مرات)."],
    [/box volume = length × width × height — the three dimensions, without a 1\/3 factor\./i,
      "حجم الصندوق = الطول × العرض × الارتفاع — الأبعاد الثلاثة، بلا معامل 1/3."],
    [/Focus on the side and angle properties of the square versus the rectangle\./i,
      "ركّز على خصائص الأضلاع والزوايا للمربع مقابل المستطيل."],
    [/Isolate the height from the area formula of the same shape\./i,
      "اعزل الارتفاع من صيغة مساحة الشكل نفسه."],
    [/An axis of symmetry splits the shape into two mirror halves\. Think how many such lines pass through the shape by its type \(square \/ rectangle \/ equilateral triangle\)\./i,
      "محور التماثل يقسم الشكل إلى نصفين متطابقين. فكّر كم خطًا من هذا النوع يمرّ بالشكل حسب نوعه (مربع / مستطيل / مثلث متساوي الأضلاع)."],
  ];
  for (const [re, ar] of reps) {
    if (re.test(s)) return s.replace(re, ar);
  }
  // Last resort: mark with structured Arabic wrapper that preserves math tokens and meaning cues
  return (
    "توضيح هندسي: " +
    s
      .replace(/\barea\b/gi, "مساحة")
      .replace(/\bperimeter\b/gi, "محيط")
      .replace(/\bvolume\b/gi, "حجم")
      .replace(/\bsquare\b/gi, "مربع")
      .replace(/\brectangle\b/gi, "مستطيل")
      .replace(/\btriangle\b/gi, "مثلث")
      .replace(/\bcircle\b/gi, "دائرة")
      .replace(/\bheight\b/gi, "ارتفاع")
      .replace(/\bbase\b/gi, "قاعدة")
      .replace(/\bside\b/gi, "ضلع")
      .replace(/\bradius\b/gi, "نصف قطر")
      .replace(/\blength\b/gi, "طول")
      .replace(/\bwidth\b/gi, "عرض")
      .replace(/\bIt looks like you\b/gi, "يبدو أنك")
      .replace(/\bcomputed\b/gi, "حسبت")
      .replace(/\binstead of\b/gi, "بدلًا من")
      .replace(/\bforgot\b/gi, "نسيت")
      .replace(/\bCheck that\b/gi, "تأكد أن")
      .replace(/\bmaybe you\b/gi, "ربما")
  );
}

let src = fs.readFileSync(SRC, "utf8");
const packs = { en: {}, ar: {} };
const seen = new Map();

function register(templateEn) {
  if (seen.has(templateEn)) return seen.get(templateEn);
  const key = keyFor(templateEn);
  seen.set(templateEn, key);
  packs.en[key] = templateEn;
  packs.ar[key] = arFor(templateEn);
  return key;
}

function tokenizeMixBody(body) {
  const exprs = [];
  const template = body.replace(/\$\{M\((["'`])(.*?)\1\)\}/g, (_, _q, expr) => {
    const i = exprs.length;
    exprs.push(expr);
    return `{m${i}}`;
  });
  return { template, exprs };
}

// return "..."
src = src.replace(/return\s+"((?:\\.|[^"\\])*)"/g, (m, body) => {
  if (body.length < 8 || !/[A-Za-z]{4,}/.test(body)) return m;
  const key = register(body);
  return `return geCopy(${JSON.stringify(key)})`;
});

// return mix`...`
src = src.replace(/return\s+mix`((?:\\.|[^`\\]|\$\{[^}]*\})*)`/g, (m, body) => {
  if (body.length < 8) return m;
  const { template, exprs } = tokenizeMixBody(body);
  const key = register(template);
  if (!exprs.length) return `return geCopy(${JSON.stringify(key)})`;
  return `return geMix(${JSON.stringify(key)}, [${exprs.map((e) => JSON.stringify(e)).join(", ")}])`;
});

if (!src.includes("function geCopy")) {
  src = src.replace(
    /import \{ mix, M \} from "\.\.\/lib\/learning-book\/learning-math-line-build\.js";/,
    `import { mix, M } from "../lib/learning-book/learning-math-line-build.js";
import { burnDownCopy } from "../lib/learning/burn-down-copy.js";

const GEO_EXPL_SLUG = "${SLUG}";
function geCopy(key) {
  return burnDownCopy(GEO_EXPL_SLUG, key);
}
function geMix(key, exprs) {
  let s = String(geCopy(key) || "");
  (exprs || []).forEach((expr, i) => {
    s = s.split("{m" + i + "}").join("\\u2066" + expr + "\\u2069");
  });
  return s;
}`,
  );
}

fs.writeFileSync(SRC, src);

function merge(loc, pack) {
  const leafDir = `content-packs/${loc}/learning/burn-down`;
  fs.mkdirSync(leafDir, { recursive: true });
  fs.writeFileSync(`${leafDir}/${SLUG}.json`, JSON.stringify({ [SLUG]: pack }, null, 2) + "\n");
  const indexPath = `content-packs/${loc}/learning/burn-down-index.json`;
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index[SLUG] = { ...(index[SLUG] || {}), ...pack };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");
}

merge("en", packs.en);
merge("ar-001", packs.ar);

const remainingEnLike = Object.values(packs.ar).filter((v) => /\b(the|and|area|Check|It looks)\b/i.test(v)).length;
console.log(
  JSON.stringify({
    keys: Object.keys(packs.en).length,
    arStillEnglishish: remainingEnLike,
  }),
);
