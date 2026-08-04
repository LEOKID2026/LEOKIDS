/**
 * Apply approved ar-001 terminology + brand locks (no machine translation).
 * Run: node scripts/i18n/apply-ar-001-terminology-locks.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DRY = process.argv.includes("--dry");

/** Ordered phrase replacements — longer phrases first. */
const PHRASE_MAP = [
  // Brand
  [/أدلة ليو للأطفال/g, "أدلة Leo Kids"],
  [/عالم أطفال ليو/g, "عالم Leo Kids"],
  [/شعار ليو كيدز/g, "شعار Leo Kids"],
  [/تثبيت ليو كيدز/g, "تثبيت Leo Kids"],
  [/مركز مساعدة ليو كيدز/g, "مركز مساعدة Leo Kids"],
  [/مرحبًا بكم في ليو كيدز/g, "مرحبًا بكم في Leo Kids"],
  [/مرحبا بكم في ليو كيدز/g, "مرحبًا بكم في Leo Kids"],
  [/تعرف على ليو كيدز/g, "تعرّف على Leo Kids"],
  [/ليو كيدز/g, "Leo Kids"],
  [/أطفال ليو/g, "Leo Kids"],
  [/أطفال الأسد/g, "Leo Kids"],

  // Parent / guardian
  [/بوابة الوالدين/g, "بوابة ولي الأمر"],
  [/تسجيل دخول الوالدين/g, "دخول ولي الأمر"],
  [/فتح حساب الوالدين/g, "فتح حساب ولي أمر"],
  [/أنشئ حسابًا في منطقة الوالدين/g, "أنشئ حساب ولي أمر"],
  [/حسابات الوالدين/g, "حسابات أولياء الأمور"],
  [/تقارير الوالدين/g, "تقارير ولي الأمر"],
  [/تقرير الوالدين/g, "تقرير ولي الأمر"],
  [/أدلة الوالدين/g, "أدلة أولياء الأمور"],
  [/دليل الوالدين/g, "دليل أولياء الأمور"],
  [/لوحة معلومات الوالدين/g, "لوحة ولي الأمر"],
  [/من وجهة نظر الوالدين/g, "من وجهة نظر ولي الأمر"],
  [/فيديو الوالدين/g, "فيديو ولي الأمر"],
  [/تطبيق الوالدين/g, "تطبيق ولي الأمر"],
  [/جلسة الوالدين/g, "جلسة ولي الأمر"],
  [/وصول الوالدين/g, "وصول ولي الأمر"],
  [/ربط الوالدين الموجودين/g, "ربط أولياء الأمور الحاليين"],
  [/اسم الوالدين/g, "اسم ولي الأمر"],
  [/تفاصيل الوالدين/g, "تفاصيل ولي الأمر"],
  [/رسالة الوالدين/g, "رسالة ولي الأمر"],
  [/مغلق من قبل الوالدين/g, "مغلق من قِبل ولي الأمر"],
  [/اطلب من أحد الوالدين/g, "اطلب من ولي الأمر"],
  [/أحد الوالدين/g, "ولي الأمر"],
  [/أنا أحد الوالدين/g, "أنا ولي أمر"],
  [/حساب أحد الوالدين/g, "حساب ولي أمر"],
  [/مرحبا بكم أيها الآباء/g, "مرحبًا بكم أولياء الأمور"],
  [/قم بدعوة الآباء الآخرين/g, "ادعُ أولياء أمور آخرين"],
  [/يحصل الآباء على/g, "يحصل أولياء الأمور على"],
  [/إعطاء الآباء/g, "إعطاء أولياء الأمور"],
  [/للآباء والأمهات/g, "لأولياء الأمور"],
  [/للآباء/g, "لأولياء الأمور"],
  [/الآباء الصف/g, "أولياء أمور الصف"],
  [/آراء الآباء/g, "آراء أولياء الأمور"],
  [/الآباء:/g, "أولياء الأمور:"],
  // Remaining الوالدين as guardians (plural contexts)
  [/الوالدين/g, "أولياء الأمور"],

  // Student
  [/الطلاب/g, "التلاميذ"],
  [/للطلاب/g, "للتلاميذ"],
  [/والطلاب/g, "والتلاميذ"],
  [/الطالب\/ة/g, "التلميذ/ة"],
  [/هذا الطالب/g, "هذا التلميذ"],
  [/هذه الطالبة/g, "هذه التلميذة"],
  [/الطالبة/g, "التلميذة"],
  [/الطالب/g, "التلميذ"],

  // Subject / topic / class
  [/الممارسة حسب الموضوع/g, "الممارسة حسب المادة"],
  [/حسب الموضوع والموضوع/g, "حسب المادة والموضوع"],
  [/أدلة الموضوع/g, "أدلة المواد الدراسية"],
  [/الأنشطة الصفية/g, "أنشطة الفصل"],
  [/مواضيع الصف/g, "مواد الفصل"],
  [/تقرير الصف العام/g, "التقرير العام للفصل"],

  // Geometry / math report terms (common)
  [/منطقة المربع/g, "مساحة المربع"],
  [/منطقة المثلث/g, "مساحة المثلث"],
  [/منطقة الدائرة/g, "مساحة الدائرة"],
  [/تناوب/g, "دوران"],
  [/مرتفعات/g, "ارتفاعات"],
  [/السلطات/g, "القوى"],
  [/التقسيم الأساسي/g, "القسمة الأساسية"],

  // Recommendations
  [/حفر \{skill\}/g, "درّب على {skill}"],
  [/يمكنه استخدام المزيد من التدريب/g, "يحتاج إلى مزيد من التمرين"],
  [/خط التدريب/g, "سلسلة التمرين"],
  [/تدريب التركيز على/g, "ركّز التمرين على"],

  // Games
  [/يتناوبون والمتعة\./g, "تبادلوا الأدوار واستمتعوا."],
  [/يتناوبون والمتعة/g, "تبادلوا الأدوار واستمتعوا"],

  // PIN
  [/رمز التعريف الشخصي/g, "رمز PIN"],
  [/رقم التعريف الشخصي/g, "رمز PIN"],

  // Prewriting / worksheets
  [/الكتابة المسبقة/g, "ما قبل الكتابة"],
  [/قبل الكتابة/g, "ما قبل الكتابة"],
];

const ROOTS = [
  "locales/ar-001",
  "content-packs/ar-001",
  "data/help",
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(json|md|js|mjs|jsx|ts|tsx)$/i.test(name)) out.push(p);
  }
  return out;
}

function applyText(text) {
  let out = text;
  let hits = 0;
  for (const [re, to] of PHRASE_MAP) {
    const before = out;
    out = out.replace(re, to);
    if (out !== before) {
      const m = before.match(re);
      hits += m ? m.length : 1;
    }
  }
  // Western digits only
  const digitMap = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
  out = out.replace(/[٠-٩]/g, (d) => digitMap[d] || d);
  return { out, hits };
}

let files = 0;
let replacements = 0;
for (const root of ROOTS) {
  for (const file of walk(path.join(ROOT, root))) {
    const raw = fs.readFileSync(file, "utf8");
    const { out, hits } = applyText(raw);
    if (out !== raw) {
      files += 1;
      replacements += hits;
      if (!DRY) fs.writeFileSync(file, out, "utf8");
      console.log((DRY ? "DRY " : "") + path.relative(ROOT, file), hits);
    }
  }
}
console.log(JSON.stringify({ filesChanged: files, replacementEvents: replacements, dry: DRY }));
