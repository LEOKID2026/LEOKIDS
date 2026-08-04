/**
 * Contextual terminology locks for ar-001 FAIL remediations.
 * Prefer phrase maps over single-token blind replaces where possible.
 */
import fs from "fs";
import path from "path";

const ROOTS = [
  "locales/ar-001",
  "content-packs/ar-001",
  "data/help-center/ar-001",
  "docs/i18n",
];

/** Longer phrases first */
const PHRASES = [
  ["وأوضح تقرير الوالدين", "شرح تقرير ولي الأمر"],
  ["نظرة عامة على تقرير الوالدين", "نظرة عامة على تقرير ولي الأمر"],
  ["صفحة تقرير الوالدين القياسية", "صفحة تقرير ولي الأمر القياسية"],
  ["تقرير الوالدين", "تقرير ولي الأمر"],
  ["جولة في لوحة معلومات الوالدين", "جولة في لوحة ولي الأمر"],
  ["مرحبا بكم في دليل الوالدين", "مرحبًا بكم في دليل أولياء الأمور"],
  ["مرحباً بكم في دليل الوالدين", "مرحبًا بكم في دليل أولياء الأمور"],
  ["قم بإنشاء حساب أحد الوالدين وقم بتسجيل الدخول", "أنشئ حساب ولي أمر وسجّل الدخول"],
  ["قم بإنشاء حساب أحد الوالدين", "أنشئ حساب ولي أمر"],
  ["إنشاء حساب الوالدين", "إنشاء حساب ولي أمر"],
  ["إنشاء حساب أحد الوالدين", "إنشاء حساب ولي أمر"],
  ["حساب أحد الوالدين", "حساب ولي أمر"],
  ["أحد الوالدين", "ولي الأمر"],
  ["شاشة تسجيل دخول الوالدين", "شاشة تسجيل دخول ولي الأمر"],
  ["تسجيل دخول الوالدين", "تسجيل دخول ولي الأمر"],
  ["انتقل إلى تسجيل دخول الوالدين", "انتقل إلى تسجيل دخول ولي الأمر"],
  ["صفحة الوالدين مع قائمة الأطفال", "صفحة ولي الأمر مع قائمة الأطفال"],
  ["دور الوالدين", "دور ولي الأمر"],
  ["دليل الوالدين", "دليل أولياء الأمور"],
  ["أدوات الوالدين", "أدوات أولياء الأمور"],
  ["رسالة الوالدين", "رسالة ولي الأمر"],
  ["للوالدين", "لأولياء الأمور"],
  ["والوالدين", "وأولياء الأمور"],
  ["البوابة الأم", "بوابة ولي الأمر"],
  ["أدخل البوابة الأم", "ادخل بوابة ولي الأمر"],
  ["استكشف البوابة الأم", "استكشف بوابة ولي الأمر"],
  ["انتقل إلى البوابة الأم", "انتقل إلى بوابة ولي الأمر"],
  ["أدلة الموضوع", "أدلة المواد الدراسية"],
  ["الأنشطة الصفية", "أنشطة الفصل"],
  ["مواضيع الصف", "مواد الفصل"],
  ["تقرير الصف العام", "التقرير العام للفصل"],
  ["يتناوبون والمتعة.", "تبادلوا الأدوار واستمتعوا."],
  ["يتناوبون والمتعة", "تبادلوا الأدوار واستمتعوا"],
  ["أطفال ليو", "Leo Kids"],
  ["ليو كيدز", "Leo Kids"],
  ["أدلة ليو للأطفال", "أدلة Leo Kids"],
  ["LEO KIDS", "Leo Kids"],
  ["مقدمة في السلطات", "مقدمة في القوى"],
  ["السلطات", "القوى"], // risky — only after longer phrases; review
  ["التقسيم الأساسي", "القسمة الأساسية"],
  ["خصومات بالنسبة المئوية", "خصومات بالنسبة المئوية"], // already ok pattern
  ["منطقة المربع", "مساحة المربع"],
  ["منطقة المثلث", "مساحة المثلث"],
  ["منطقة الدائرة", "مساحة الدائرة"],
  ["حفر ", "درّب على "],
  ["يمكنه استخدام المزيد من التدريب", "يحتاج إلى مزيد من التمرين"],
  ["خط التدريب", "سلسلة التمرين"],
  ["تدريب التركيز على", "ركّز التمرين على"],
  ["رمز التعريف الشخصي", "رمز PIN"],
  ["رقم التعريف الشخصي", "رمز PIN"],
  ["شاشة تسجيل دخول الطالب", "شاشة تسجيل دخول التلميذ"],
  ["الصفحة الرئيسية للطالب", "الصفحة الرئيسية للتلميذ"],
  ["تسجيل دخول الطالب", "تسجيل دخول التلميذ"],
];

const AUDIENCE_FIX = ['"audience": "الوالدين"', '"audience": "أولياء الأمور"'];

const SUBJECT_KEY_HINT =
  /subject|subjects|مادة|chooseSubject|subjectLabel|subjectField|subjectFilter|subjectAdd|subjectRemove|colSubject|manageSubjects|subjectsTitle|subjectReport|subjectFocus|permissions?Subject|school_subject/i;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      walk(p, out);
    } else if (/\.(json|js|md|jsx|tsx|ts|mjs)$/i.test(ent.name)) {
      out.push(p);
    }
  }
  return out;
}

function applyText(text, filePath) {
  let out = text;
  let count = 0;
  const before = out;
  out = out.split(AUDIENCE_FIX[0]).join(AUDIENCE_FIX[1]);
  if (out !== before) count += 1;

  for (const [from, to] of PHRASES) {
    if (from === "السلطات") {
      // Only replace when talking about powers in math context
      const re = /مقدمة في السلطات|موضوع السلطات|مهارات السلطات|السلطات \(/g;
      const next = out.replace(re, (m) => m.replace("السلطات", "القوى"));
      if (next !== out) {
        count += 1;
        out = next;
      }
      continue;
    }
    if (!out.includes(from)) continue;
    const parts = out.split(from);
    if (parts.length > 1) {
      count += parts.length - 1;
      out = parts.join(to);
    }
  }

  // Parent plural leftovers in UI strings (not English vocabulary "آباء" in English lessons)
  if (!filePath.includes("english-page") && !filePath.includes("leo-word")) {
    const parentPairs = [
      ["الآباء", "أولياء الأمور"],
      ["الوالدين", "أولياء الأمور"],
    ];
    for (const [from, to] of parentPairs) {
      if (!out.includes(from)) continue;
      // Skip if already part of longer fixed phrase edge cases
      const re = new RegExp(from, "g");
      const next = out.replace(re, to);
      if (next !== out) {
        count += (out.match(re) || []).length;
        out = next;
      }
    }
  }

  // Key-aware subject→مادة for JSON flat keys containing subject
  if (filePath.endsWith(".json")) {
    try {
      const data = JSON.parse(out);
      const touched = { n: 0 };
      const walkObj = (obj, keyPath = "") => {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) {
          obj.forEach((v, i) => walkObj(v, `${keyPath}[${i}]`));
          return;
        }
        for (const [k, v] of Object.entries(obj)) {
          const kp = keyPath ? `${keyPath}.${k}` : k;
          if (typeof v === "string") {
            if (SUBJECT_KEY_HINT.test(k) || SUBJECT_KEY_HINT.test(kp)) {
              if (v === "موضوع") {
                obj[k] = "مادة";
                touched.n += 1;
              } else if (v.includes("جميع المواضيع") && /subjectFilter|subjectsAll|allSubjects/i.test(k + kp)) {
                obj[k] = v.replace("جميع المواضيع", "جميع المواد");
                touched.n += 1;
              } else if (v === "الموضوع" && /subjectLabel|subjectField|colSubject|chooseSubject/i.test(k)) {
                obj[k] = "المادة";
                touched.n += 1;
              }
            }
          } else walkObj(v, kp);
        }
      };
      walkObj(data);
      if (touched.n) {
        out = JSON.stringify(data, null, 2) + "\n";
        count += touched.n;
      }
    } catch {
      // keep text transforms only
    }
  }

  return { out, count };
}

let filesChanged = 0;
let replacements = 0;
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, "utf8");
    const { out, count } = applyText(text, file);
    if (count && out !== text) {
      fs.writeFileSync(file, out);
      filesChanged += 1;
      replacements += count;
      console.log(count, file);
    }
  }
}

// Teachers marketing rewrite
const teachersPath = "content-packs/ar-001/public-seo/marketing/teachers.json";
const teachers = {
  pageTitle: "بوابة المدرّسين الخصوصيين · Leo Kids",
  metaDescription:
    "أدِر التلاميذ، وأرسل تمارين مركّزة، وتتبّع التقدّم، وخطّط للدرس التالي بوضوح أكبر.",
  badge: "معلّمون · تتبّع · تمرين",
  installLabel: "ثبّت تطبيق المعلّم",
  hero: {
    title: "مساحة عمل واضحة للمدرّسين الخصوصيين",
    subtitle:
      "أدِر التلاميذ، وأرسل تمارين مركّزة، وتتبّع التقدّم، وخطّط للدرس التالي بوضوح أكبر.",
    primaryCta: { label: "دخول المعلّم / الاشتراك", href: "/teacher/login" },
    secondaryCta: { label: "ماذا يمكنك أن تفعل في النظام؟", scrollTo: "فوائد" },
  },
  benefits: {
    items: [
      {
        title: "تتبّع منظّم لكل تلميذ",
        text: "لكل تلميذ صورة أوضح عن التقدّم حسب النشاط والمادة والموضوع.",
      },
      {
        title: "تحضير أوضح قبل الدرس",
        text: "اعرف أين نجح التلميذ وأين احتاج دعمًا، وما الذي يستحق التعزيز تاليًا.",
      },
      {
        title: "أنشطة شخصية بدل واجبات عامة",
        text: "عيّن تمرينًا مركّزًا وتابع الإنجاز بدل الاعتماد على واجبات منزلية عامة.",
      },
      {
        title: "قيمة أوضح لأولياء الأمور",
        text: "يرى أولياء الأمور العمل منظّمًا وقابلًا للمتابعة وواضحًا.",
      },
      {
        title: "استمرارية بين الدروس",
        text: "يمكن للتلاميذ مواصلة التمرين بعد الجلسة بينما ترى ما تم إنجازه.",
      },
      {
        title: "مصمَّم للتدريس الفردي",
        text: "للتلاميذ والتمرين والتتبّع والتقدّم — دون الحاجة إلى إعداد مدرسة كاملة.",
      },
    ],
  },
  infoSections: [
    {
      title: "ماذا يحصل المعلّم؟",
      intro: "بعد التسجيل يمكنك:",
      bullets: [
        "الدخول إلى منطقة المعلّم.",
        "إدارة التلاميذ.",
        "عرض تقارير التلاميذ.",
        "متابعة التقدّم والموضوعات التي تحتاج تعزيزًا.",
        "إرسال أنشطة شخصية.",
        "متابعة الإنجاز والنتائج.",
        "استخدام النظام كأداة مساعدة بين الدرس والتمرين المنزلي.",
      ],
    },
    {
      title: "لماذا يناسب المدرّسين الخصوصيين",
      body: "يوفّر الوقت، ويضيف تنظيمًا، ويُظهر لأولياء الأمور عملًا مهنيًا واضحًا. تصل إلى الدرس بصورة بيانات لا بالانطباع وحده.",
    },
  ],
  closing: {
    title: "مزيد من الوضوح. مزيد من التتبّع. مزيد من القيمة لكل تلميذ.",
    text: "يمنح Leo Kids المدرّسين الخصوصيين طريقة أبسط لدعم التلاميذ وإرسال التمارين وتتبع التقدّم.",
    primaryCta: { label: "فتح حساب المعلّم", href: "/teacher/login" },
  },
};
fs.writeFileSync(teachersPath, JSON.stringify(teachers, null, 2) + "\n");
console.log("rewrote", teachersPath);

// Style guide sync
const stylePath = "docs/i18n/ar-001-style-guide.md";
fs.writeFileSync(
  stylePath,
  `# ar-001 style guide

**Locale:** \`ar-001\` · **Script:** Arabic (MSA) · **Direction:** RTL · **Digits:** 0–9 (Western)

## Voice

- Modern Standard Arabic — formal but child-friendly
- Country-neutral — no Egypt/Levant/Gulf dialect markers
- No Israeli Hebrew loan translations
- No machine-translation calques; edit for natural Arabic

## Brand

The brand is always **Leo Kids** (Latin). Never translate or transliterate to أطفال ليو / ليو كيدز / أدلة ليو للأطفال.

## Terminology locks

| English | ar-001 |
|---------|--------|
| Grade / year level | الصف |
| Class group | الفصل |
| Subject | مادة |
| Topic | موضوع |
| Student | تلميذ / تلميذة |
| Students | تلاميذ |
| Parent/guardian | ولي الأمر |
| Parents/guardians | أولياء الأمور |
| Teacher | معلّم / معلّمة |
| School | مدرسة |
| Activity | نشاط |
| Worksheet | ورقة عمل |
| Report | تقرير |
| Finding | ملاحظة |
| Strength / Strengths | نقطة قوة / نقاط قوة |
| PIN | رمز PIN |
| Math | الرياضيات |
| Geometry | الهندسة |
| English (subject) | الإنجليزية |

### Forbidden swaps

- Subject ≠ موضوع / عنوان
- Topic ≠ عنوان
- Class group ≠ الصف
- Parent ≠ الوالدين / الآباء (UI must use ولي الأمر / أولياء الأمور)
- Powers (math) ≠ السلطات → القوى
- Division (math) ≠ التقسيم → القسمة
- Square/triangle/circle area ≠ منطقة → مساحة
- Rotation (geometry) ≠ تناوب → دوران
- Heights (geometry) ≠ مرتفعات → الارتفاعات

## Mixed direction

- UI chrome: RTL
- English learning Q/A: LTR in scoped islands
- Math variables and expressions: LTR (\`MathExpression\`, \`.leo-ltr-island\`)
- Email, URL, code, ID: LTR scoped

## Forbidden in chrome

English UI strings, Hebrew, country-specific Arabic dialects, Israeli curriculum terms, Arabic-Indic digits (\`٠١٢٣٤٥٦٧٨٩\`).

## Numbers

Always Western digits \`0–9\`.
`
);
console.log("updated", stylePath);
console.log(JSON.stringify({ filesChanged, replacements }, null, 2));
