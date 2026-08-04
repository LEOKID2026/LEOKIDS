import fs from "fs";

const SLUG = "utils__geometry-explanations";
const enIndex = JSON.parse(fs.readFileSync("content-packs/en/learning/burn-down-index.json", "utf8"));
const arIndex = JSON.parse(fs.readFileSync("content-packs/ar-001/learning/burn-down-index.json", "utf8"));
const en = enIndex[SLUG] || {};
const ar = { ...(arIndex[SLUG] || {}) };

/** Full curated Arabic for remaining EN keys (by English value). */
const MORE = new Map([
  [
    "cylinder volume = π × radius² × height. The base circle's area times the cylinder's height.",
    "حجم الأسطوانة = π × نصف القطر² × الارتفاع. مساحة دائرة القاعدة مضروبة في ارتفاع الأسطوانة.",
  ],
  [
    "sphere volume = (4/3) × π × radius³ - the radius is raised to the third power, not just squared.",
    "حجم الكرة = (4/3) × π × نصف القطر³ — نصف القطر مرفوع للقوة الثالثة، وليس مربّعًا فقط.",
  ],
  [
    "Compare side lengths: when all four are equal — square; when there are two different lengths in pairs — rectangle.",
    "قارن أطوال الأضلاع: عندما تكون الأربعة متساوية — مربع؛ وعندما يوجد طولا مختلفان على شكل أزواج — مستطيل.",
  ],
  [
    "The question asks about the number of equal sides in a square. Think: how many sides does a closed polygon have, and what is special about a square's side lengths?",
    "السؤال عن عدد الأضلاع المتساوية في المربع. فكّر: كم ضلعًا لمضلع مغلق، وما الخاص في أطوال أضلاع المربع؟",
  ],
  [
    "The question asks how many pairs of equal sides a rectangle has — not how many sides in total.",
    "السؤال عن عدد أزواج الأضلاع المتساوية في المستطيل — وليس عن عدد الأضلاع إجمالًا.",
  ],
  [
    "A square and a rectangle are quadrilaterals with right interior angles. How many such corners does a four-sided polygon have?",
    "المربع والمستطيل رباعيّا أضلاع بزوايا داخلية قائمة. كم زاوية قائمة كهذه لمضلع رباعي؟",
  ],
  [
    "Sort by equal side lengths: three equal / two equal / all different — and match to the name in the question.",
    "صنّف حسب تساوي أطوال الأضلاع: ثلاثة متساوية / اثنان متساويان / كلها مختلفة — ثم طابق الاسم في السؤال.",
  ],
  [
    "Match the name to the rules for sides and angles: are all sides equal? parallel pairs? only one parallel base?",
    "طابق الاسم مع قواعد الأضلاع والزوايا: هل كل الأضلاع متساوية؟ أزواج متوازية؟ قاعدة متوازية واحدة فقط؟",
  ],
  [
    "A translation moves the shape without changing its reading orientation; a reflection creates 'a mirror image' about the axis. Which description fits the operation in the question?",
    "الانسحاب ينقل الشكل دون تغيير اتجاه قراءته؛ الانعكاس يُنشئ «صورة مرآة» حول المحور. أي وصف يناسب العملية في السؤال؟",
  ],
  [
    "The diagonal is the hypotenuse of a right triangle whose legs are the two given sides — use the Pythagorean theorem.",
    "القطر هو وتر مثلث قائم الزاوية ساقاه هما الضلعان المعطيان — استخدم نظرية فيثاغورس.",
  ],
  [
    "Think of the diagonal as the hypotenuse of a right triangle built from the two given sides.",
    "فكّر في القطر كوتر لمثلث قائم مبني من الضلعين المعطيين.",
  ],
  [
    "Connect the description (faces, round base, vertex) to the list of solids — not by a single name alone.",
    "اربط الوصف (الأوجه، قاعدة دائرية، رأس) بقائمة المجسّمات — وليس باسم واحد وحده.",
  ],
  [
    "It looks like you forgot the factor ⅓ In a pyramid or cone — the volume is one third of the volume \"the page\" with the same base and height.",
    "يبدو أنك نسيت المعامل ⅓ في الهرم أو المخروط — الحجم ثلث حجم الجسم «الكامل» بنفس القاعدة والارتفاع.",
  ],
  [
    "Volume too small: maybe you missed one dimension in the product, or applied ⅓ when it was not needed (box/prism).",
    "الحجم صغير جدًا: ربما فاتك بُعد في الجداء، أو طبّقت ⅓ دون حاجة (صندوق/منشور).",
  ],
  [
    "Volume too large: maybe you forgot ⅓ for a pyramid/cone, or multiplied a dimension twice unnecessarily.",
    "الحجم كبير جدًا: ربما نسيت ⅓ للهرم/المخروط، أو ضربت بُعدًا مرتين بلا داعٍ.",
  ],
  [
    "Answer too small: maybe you forgot the square root after summing the squares, or forgot to square.",
    "الإجابة صغيرة جدًا: ربما نسيت الجذر التربيعي بعد جمع المربعات، أو نسيت التربيع.",
  ],
  [
    "Compare all the sides: four equal ⇒ square; two different lengths in pairs ⇒ rectangle.",
    "قارن كل الأضلاع: أربعة متساوية ⇒ مربع؛ طولا مختلفان على شكل أزواج ⇒ مستطيل.",
  ],
  [
    "The question asks how many equal sides — a square has four. Do not mix it up with the number of pairs or angles.",
    "السؤال عن عدد الأضلاع المتساوية — للمربع أربعة. لا تخلط مع عدد الأزواج أو الزوايا.",
  ],
  [
    "The question asks how many pairs of equal sides — a rectangle has two pairs (long/short), not four separate sides.",
    "السؤال عن عدد أزواج الأضلاع المتساوية — للمستطيل زوجان (طويل/قصير)، وليس أربعة أضلاع منفصلة.",
  ],
  [
    "A square and a rectangle have four right angles — not two or three.",
    "للمربع والمستطيل أربع زوايا قائمة — وليس اثنتين أو ثلاثًا.",
  ],
  [
    "We distinguished side properties from angles, and a square from a rectangle.",
    "ميّزنا خصائص الأضلاع عن الزوايا، والمربع عن المستطيل.",
  ],
  [
    "The question is about parallel lines — lines that never meet; 2 here marks perpendicular.",
    "السؤال عن المستقيمات المتوازية — مستقيمات لا تلتقي أبدًا؛ الرقم 2 هنا يشير إلى التعامد.",
  ],
  [
    "The question is about perpendicular lines — meeting at a right angle; 1 here marks parallel.",
    "السؤال عن المستقيمات المتعامدة — تلتقي بزاوية قائمة؛ الرقم 1 هنا يشير إلى التوازي.",
  ],
  [
    "Check pairs of parallel sides and angles: square/rectangle — four right angles; parallelogram — two pairs of parallel sides; trapezoid — one pair of parallel bases.",
    "تحقق من أزواج الأضلاع المتوازية والزوايا: مربع/مستطيل — أربع زوايا قائمة؛ متوازي أضلاع — زوجان من الأضلاع المتوازية؛ شبه منحرف — زوج واحد من القاعدتين المتوازيتين.",
  ],
  [
    "Translation is option 1 in the question — not reflection.",
    "الانسحاب هو الخيار 1 في السؤال — وليس الانعكاس.",
  ],
  [
    "A translation keeps the shape's orientation; a reflection creates a mirror image.",
    "الانسحاب يحافظ على اتجاه الشكل؛ الانعكاس يُنشئ صورة مرآة.",
  ],
  [
    "Rotation is measured in full degrees around a point — match the question's wording.",
    "الدوران يُقاس بالدرجات حول نقطة — طابق صياغة السؤال.",
  ],
  [
    "All points on the surface are at a constant distance from the center — key 6.",
    "كل نقاط السطح على بُعد ثابت من المركز — المفتاح 6.",
  ],
  [
    "Focus on the side and angle properties of the square versus the rectangle.",
    "ركّز على خصائص الأضلاع والزوايا للمربع مقابل المستطيل.",
  ],
  [
    "Isolate the height from the area formula of the same shape.",
    "اعزل الارتفاع من صيغة مساحة الشكل نفسه.",
  ],
  [
    "Try to identify which formula or property fits the question's wording.",
    "حاول تحديد الصيغة أو الخاصية التي تناسب صياغة السؤال.",
  ],
]);

let n = 0;
for (const [key, enVal] of Object.entries(en)) {
  if (MORE.has(enVal)) {
    ar[key] = MORE.get(enVal);
    n++;
    continue;
  }
  // Fix leftover "توضيح هندسي:" soft calques by preferring EN→better AR if still English-heavy
  const cur = ar[key] || "";
  if (/توضيح هندسي:/.test(cur) || /\b(the|and|Check|It looks|Result|Volume|Perimeter|Compare|Match|Sort|Think|The question)\b/i.test(cur)) {
    // generic pedagogical rewrite from EN meaning
    ar[key] = softAr(enVal);
    n++;
  }
}

function softAr(enVal) {
  if (MORE.has(enVal)) return MORE.get(enVal);
  // Token-preserving soft rewrite for leftovers
  return enVal
    .replace(/^It looks like you computed /i, "يبدو أنك حسبت ")
    .replace(/^It looks like you /i, "يبدو أنك ")
    .replace(/^Result too small:/i, "النتيجة صغيرة جدًا:")
    .replace(/^Result too large:/i, "النتيجة كبيرة جدًا:")
    .replace(/^Volume too small:/i, "الحجم صغير جدًا:")
    .replace(/^Volume too large:/i, "الحجم كبير جدًا:")
    .replace(/^Perimeter too small:/i, "المحيط صغير جدًا:")
    .replace(/^Answer too small:/i, "الإجابة صغيرة جدًا:")
    .replace(/^Answer too large:/i, "الإجابة كبيرة جدًا:")
    .replace(/^Check that /i, "تأكد أن ")
    .replace(/^Check:/i, "تحقق:")
    .replace(/^The question asks /i, "السؤال يطلب ")
    .replace(/^The question is about /i, "السؤال عن ")
    .replace(/^Try to /i, "حاول أن ")
    .replace(/^Focus on /i, "ركّز على ")
    .replace(/^Compare /i, "قارن ")
    .replace(/^Match /i, "طابق ")
    .replace(/^Sort /i, "صنّف ")
    .replace(/^Think /i, "فكّر ")
    .replace(/^Connect /i, "اربط ")
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
    .replace(/\brotation\b/gi, "الدوران")
    .replace(/\btranslation\b/gi, "الانسحاب")
    .replace(/\breflection\b/gi, "الانعكاس")
    .replace(/\bformula\b/gi, "الصيغة")
    .replace(/\bquestion\b/gi, "السؤال");
}

arIndex[SLUG] = ar;
fs.writeFileSync(
  "content-packs/ar-001/learning/burn-down-index.json",
  JSON.stringify(arIndex, null, 2) + "\n",
);
fs.writeFileSync(
  `content-packs/ar-001/learning/burn-down/${SLUG}.json`,
  JSON.stringify({ [SLUG]: ar }, null, 2) + "\n",
);

const still = Object.values(ar).filter((v) =>
  /\b(the|and|area|Check|It looks|Result|Perimeter|Volume|Focus|Try|Compare)\b/i.test(v),
).length;
console.log(JSON.stringify({ patched: n, stillEnglishish: still, total: Object.keys(ar).length }));
