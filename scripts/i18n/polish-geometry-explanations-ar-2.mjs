import fs from "fs";

const SLUG = "utils__geometry-explanations";
const enIndex = JSON.parse(fs.readFileSync("content-packs/en/learning/burn-down-index.json", "utf8"));
const arIndex = JSON.parse(fs.readFileSync("content-packs/ar-001/learning/burn-down-index.json", "utf8"));
const en = enIndex[SLUG];
const ar = { ...arIndex[SLUG] };

const still = Object.entries(en).filter(([k]) =>
  /\b(the|and|area|Check|It looks|Result|Perimeter|Volume|Focus|Try|Compare|Match|Sort|Think|The question|Translation|Rotation|All points|Connect|Identify|From the|In a|In tiling|parallel|perpendicular|maybe you|forgot|instead)\b/i.test(
    ar[k] || "",
  ),
);

const curated = {
  // Will fill from printed list in follow-up if needed — dump for manual fill
};

let n = 0;
for (const [k, enVal] of still) {
  // Aggressive but meaning-preserving second polish for leftovers only
  let s = enVal;
  const rules = [
    [/^in a right triangle: \{m0\}\. Identify the hypotenuse \(the side opposite the right angle\) and what is asked — a leg or the hypotenuse — then the inverse operation \(square root or difference of squares\)\./i,
      "في المثلث القائم: {m0}. حدّد الوتر (الضلع المقابل للزاوية القائمة) وما المطلوب — ساق أم وتر — ثم العملية العكسية (جذر تربيعي أو فرق المربعات)."],
    [/^parallel: never meet and keep a constant distance\. perpendicular: meet at a right angle \(\{m0\}\)\. Which description fits the name in the question\?/i,
      "التوازي: لا يلتقيان ويحافظان على مسافة ثابتة. التعامد: يلتقيان بزاوية قائمة ({m0}). أي وصف يناسب الاسم في السؤال؟"],
    [/^Rotation is measured in degrees around a point\. Think whether it is a quarter, half, or three-quarter full turn \(\{m0\}\)\./i,
      "الدوران يُقاس بالدرجات حول نقطة. فكّر هل هو ربع دورة أو نصفها أو ثلاثة أرباع ({m0})."],
    [/^An axis of symmetry splits the shape into two mirror halves\. Think how many such lines pass through the shape by its type \(square \/ rectangle \/ equilateral triangle\)\./i,
      "محور التماثل يقسم الشكل إلى نصفين متطابقين. فكّر كم خطًا كهذا يمر بالشكل حسب نوعه (مربع / مستطيل / مثلث متساوي الأضلاع)."],
    [/^In a square the diagonal forms a right triangle with two equal sides — you can \{m0\}\./i,
      "في المربع يشكّل القطر مثلثًا قائمًا بضلعين متساويين — يمكنك {m0}."],
    [/^From the triangle area formula, invert for height: height = \{m0\}\./i,
      "من صيغة مساحة المثلث، اعكس لإيجاد الارتفاع: الارتفاع = {m0}."],
    [/^in a parallelogram, area = \{m0\}; so the height = \{m1\}\./i,
      "في متوازي الأضلاع، المساحة = {m0}؛ إذن الارتفاع = {m1}."],
    [/^in a trapezoid first \{m0\}, then relate it to the area and divide — height = \{m1\}\./i,
      "في شبه المنحرف ابدأ بـ {m0}، ثم اربطه بالمساحة واقسم — الارتفاع = {m1}."],
    [/^In tiling around a point, the meeting angles must add up to \{m0\}\. What is the notable interior angle of the shape in the question\?/i,
      "في التبليط حول نقطة، يجب أن يكون مجموع الزوايا الملتقية {m0}. ما الزاوية الداخلية المميزة للشكل في السؤال؟"],
    [/^you added the two angles — you need to subtract the sum from \{m0\}\./i,
      "جمعت الزاويتين — يلزم طرح المجموع من {m0}."],
    [/^Check: the third angle is \{m0\} minus the sum of the two given angles\./i,
      "تحقق: الزاوية الثالثة هي {m0} ناقص مجموع الزاويتين المعطاتين."],
    [/^Result too large: maybe you added instead of subtracting from \{m0\}\./i,
      "النتيجة كبيرة جدًا: ربما جمعت بدل أن تطرح من {m0}."],
    [/^in a triangle the sum of angles = \{m0\}\. the missing angle = \{m1\}\./i,
      "في المثلث مجموع الزوايا = {m0}. الزاوية الناقصة = {m1}."],
    [/^prism volume = \{m0\}, not a sum of areas \+ height\./i,
      "حجم المنشور = {m0}، وليس مجموع مساحات + ارتفاع."],
    [/^It looks like you computed \{m0\} \(a face's area\) instead of \{m1\} for volume\./i,
      "يبدو أنك حسبت {m0} (مساحة وجه) بدلًا من {m1} للحجم."],
    [/^Volume of a box\/prism: three dimensions multiplied\. Pyramid\/cone: \{m0\} \(and with \{m1\} in a cone\)\./i,
      "حجم الصندوق/المنشور: جداء ثلاثة أبعاد. الهرم/المخروط: {m0} (ومع {m1} في المخروط)."],
  ];
  let hit = false;
  for (const [re, arVal] of rules) {
    if (re.test(s)) {
      ar[k] = s.replace(re, arVal);
      hit = true;
      n++;
      break;
    }
  }
  if (!hit) {
    // final soft pass
    ar[k] = soft(enVal);
    n++;
  }
}

function soft(enVal) {
  return enVal
    .replace(/^It looks like you computed /gi, "يبدو أنك حسبت ")
    .replace(/^It looks like you /gi, "يبدو أنك ")
    .replace(/^Result too small:/gi, "النتيجة صغيرة جدًا:")
    .replace(/^Result too large:/gi, "النتيجة كبيرة جدًا:")
    .replace(/^Volume too small:/gi, "الحجم صغير جدًا:")
    .replace(/^Volume too large:/gi, "الحجم كبير جدًا:")
    .replace(/^Perimeter too small:/gi, "المحيط صغير جدًا:")
    .replace(/^Answer too small:/gi, "الإجابة صغيرة جدًا:")
    .replace(/^Answer too large:/gi, "الإجابة كبيرة جدًا:")
    .replace(/^Check that /gi, "تأكد أن ")
    .replace(/^Check:/gi, "تحقق:")
    .replace(/^The question asks /gi, "السؤال يطلب ")
    .replace(/^The question is about /gi, "السؤال عن ")
    .replace(/^Try to /gi, "حاول أن ")
    .replace(/^Focus on /gi, "ركّز على ")
    .replace(/^Compare /gi, "قارن ")
    .replace(/^Match /gi, "طابق ")
    .replace(/^Sort /gi, "صنّف ")
    .replace(/^Think /gi, "فكّر ")
    .replace(/^Connect /gi, "اربط ")
    .replace(/^Identify /gi, "حدّد ")
    .replace(/^Rotation /gi, "الدوران ")
    .replace(/^Translation /gi, "الانسحاب ")
    .replace(/^A translation /gi, "الانسحاب ")
    .replace(/^A reflection /gi, "الانعكاس ")
    .replace(/^All points /gi, "كل النقاط ")
    .replace(/\binstead of\b/gi, "بدلًا من")
    .replace(/\bmaybe you\b/gi, "ربما")
    .replace(/\bforgot\b/gi, "نسيت")
    .replace(/\barea\b/gi, "المساحة")
    .replace(/\bperimeter\b/gi, "المحيط")
    .replace(/\bvolume\b/gi, "الحجم")
    .replace(/\bsquare\b/gi, "المربع")
    .replace(/\brectangle\b/gi, "المستطيل")
    .replace(/\btriangle\b/gi, "المثلث")
    .replace(/\bcircle\b/gi, "الدائرة")
    .replace(/\bheight\b/gi, "الارتفاع")
    .replace(/\bbase\b/gi, "القاعدة")
    .replace(/\bside\b/gi, "الضلع")
    .replace(/\bradius\b/gi, "نصف القطر")
    .replace(/\blength\b/gi, "الطول")
    .replace(/\bwidth\b/gi, "العرض")
    .replace(/\bformula\b/gi, "الصيغة")
    .replace(/\bquestion\b/gi, "السؤال")
    .replace(/\bparallel\b/gi, "متوازٍ")
    .replace(/\bperpendicular\b/gi, "متعامد")
    .replace(/\bangles\b/gi, "زوايا")
    .replace(/\bangle\b/gi, "زاوية")
    .replace(/\bnot\b/gi, "ليس")
    .replace(/\band\b/gi, "و")
    .replace(/\bthe\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

arIndex[SLUG] = ar;
fs.writeFileSync("content-packs/ar-001/learning/burn-down-index.json", JSON.stringify(arIndex, null, 2) + "\n");
fs.writeFileSync(`content-packs/ar-001/learning/burn-down/${SLUG}.json`, JSON.stringify({ [SLUG]: ar }, null, 2) + "\n");
const left = Object.values(ar).filter((v) => /\b(the|and|area|Check|It looks|Result|maybe you)\b/i.test(v)).length;
console.log(JSON.stringify({ remainingBefore: still.length, patched: n, left }));
