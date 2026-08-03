/**
 * Generate locales/ar-001 + content-packs/ar-001 from English sources.
 *
 * Uses curated MSA glossary + exact overrides as authority.
 * Network MT (gtx tl=ar) fills remaining strings, then Arabic post-fixes run.
 * Set AR_001_OFFLINE=1 to skip network (parity structure only).
 *
 * Run: node scripts/i18n/generate-ar-001-layer.mjs
 * Optional: --force  --dry  --namespaces-only  --packs-only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ARABIC_MASTER_GLOSSARY,
  FORBIDDEN_AR_001_PATTERNS,
  AR_001_GRADE_LABEL,
  AR_001_BRAND_TAGLINE,
} from "../../lib/i18n/arabic-master-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-ar-001.json");
const REPORT_PATH = path.join(__dirname, "_ar-001-layer-report.json");
const LOCALE = "ar-001";

const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const NAMESPACES_ONLY = process.argv.includes("--namespaces-only");
const PACKS_ONLY = process.argv.includes("--packs-only");
const OFFLINE = process.env.AR_001_OFFLINE === "1" || process.argv.includes("--offline");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

const SKIP_VALUE_KEYS = new Set([
  "id",
  "ids",
  "skillId",
  "pageType",
  "learningPageId",
  "learningLanguage",
  "gameId",
  "subjectId",
  "topicId",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "icon",
  "image",
  "imageSrc",
  "asset",
  "assetPath",
  "font",
  "ttf",
  "locale",
  "localeId",
  "contentLocale",
  "enum",
  "key",
  "code",
  "type",
  "kind",
  "status",
  "severity",
  "version",
  "sha",
  "hash",
  "color",
  "bg",
  "background",
  "className",
  "component",
  "file",
  "filename",
  "ext",
  "mime",
  "doNotTranslateFields",
]);

const EXACT_OVERRIDES = {
  Math: "الرياضيات",
  Geometry: "الهندسة",
  English: "الإنجليزية",
  Hebrew: "العبرية",
  Science: "العلوم",
  Geography: "الجغرافيا",
  History: "التاريخ",
  Strength: "نقطة قوة",
  "Area to strengthen": "مجال للتقوية",
  "Worth strengthening": "مجال للتقوية",
  "Parent report": "تقرير ولي الأمر",
  "Learning pattern": "نمط التعلّم",
  Progress: "التقدّم",
  Improvement: "تحسّن",
  Practice: "تمرين",
  Start: "ابدأ",
  Continue: "متابعة",
  "Try again": "حاول مرة أخرى",
  Check: "تحقّق",
  Next: "التالي",
  Back: "رجوع",
  Play: "العب",
  Finish: "إنهاء",
  Loading: "جاري التحميل…",
  "Loading...": "جاري التحميل…",
  Save: "حفظ",
  Cancel: "إلغاء",
  Delete: "حذف",
  Close: "إغلاق",
  Hint: "تلميح",
  Addition: "الجمع",
  Subtraction: "الطرح",
  Multiplication: "الضرب",
  Division: "القسمة",
  Fractions: "الكسور",
  Percentages: "النسب المئوية",
  Sequences: "المتتاليات",
  Decimals: "الأعداد العشرية",
  Rounding: "التقريب",
  Equations: "المعادلات",
  Patterns: "الأنماط",
  Vocabulary: "المفردات",
  Grammar: "القواعد",
  Phonics: "الصوتيات",
  Writing: "الكتابة",
  Reading: "القراءة",
  "Reading comprehension": "فهم المقروء",
  Shapes: "الأشكال",
  "Basic shapes": "الأشكال الأساسية",
  Area: "المساحة",
  Perimeter: "المحيط",
  Volume: "الحجم",
  Angles: "الزوايا",
  Triangles: "المثلثات",
  Circles: "الدوائر",
  Symmetry: "التناظر",
  Coordinates: "الإحداثيات",
  Animals: "الحيوانات",
  Plants: "النباتات",
  Materials: "المواد",
  "Mixed practice": "تمرين مختلط",
  "Word problems": "مسائل كلامية",
  "Place value": "القيمة المنزلية",
  "Number sense": "الحس العددي",
  "Grade 1": "الصف 1",
  "Grade 2": "الصف 2",
  "Grade 3": "الصف 3",
  "Grade 4": "الصف 4",
  "Grade 5": "الصف 5",
  "Grade 6": "الصف 6",
  "Grade {grade}": "الصف {grade}",
  "Grades 1–2": "الصف 1–2",
  "Grades 3–4": "الصف 3–4",
  "Grades 5–6": "الصف 5–6",
  Grade: "الصف",
  "All grades": "جميع الصفوف",
  "Choose grade": "اختر الصف",
  "Select grade": "اختر الصف",
  "Current grade": "الصف الحالي",
  "Invalid grade": "صف غير صالح",
  "Invalid grade. Please choose another grade.": "صف غير صالح. اختر صفًا آخر.",
  "That grade is not valid.": "هذا الصف غير صالح.",
  "Allow child to pick grade on learning pages": "السماح للطفل باختيار الصف في صفحات التعلّم",
  Worksheet: "ورقة عمل",
  Worksheets: "أوراق عمل",
  "Create worksheet": "إنشاء ورقة عمل",
  "Ready worksheets": "أوراق عمل جاهزة للطباعة",
  Preview: "معاينة",
  Print: "طباعة",
  "Answer key": "مفتاح الإجابات",
  Regular: "عادية",
  Special: "خاصة",
  Rare: "نادرة",
  Gold: "ذهبية",
  "Surprise box": "صندوق المفاجآت",
  Locked: "مقفلة",
  "My cards": "بطاقاتي",
  "My collection": "مجموعتي",
  "Card shop": "متجر البطاقات",
  "All cards": "جميع البطاقات",
  Series: "سلسلة",
  Buy: "شراء",
  "Sell duplicate": "بيع المكرّر",
  "Open box": "افتح الصندوق",
  "Table of contents": "جدول المحتويات",
  "Coming soon": "قريبًا",
  "Previous page": "الصفحة السابقة",
  "Next page": "الصفحة التالية",
  "Previous topic": "الموضوع السابق",
  "Next topic": "الموضوع التالي",
  "Let's practice now": "لنتمرّن الآن",
  "Practice with questions": "تمرّن على الأسئلة",
  "Book reading": "قراءة الكتاب",
  Parent: "ولي الأمر",
  Parents: "أولياء الأمور",
  Student: "الطالب",
  Students: "الطلاب",
  Teacher: "المعلّم",
  Teachers: "المعلّمون",
  School: "المدرسة",
  Answers: "الإجابات",
  Answer: "الإجابة",
  File: "ملف",
  Video: "فيديو",
  Phone: "هاتف",
  Computer: "حاسوب",
  Laptop: "حاسوب محمول",
  Yes: "نعم",
  No: "لا",
  Click: "انقر",
  Choose: "اختر",
  Select: "حدّد",
  "Leo Kids": "Leo Kids",
  Home: "الرئيسية",
  Help: "المساعدة",
  Settings: "الإعدادات",
  "Log out": "تسجيل الخروج",
  "Log in": "تسجيل الدخول",
  Search: "بحث",
  More: "المزيد",
  OK: "موافق",
  "Start learning": "ابدأ التعلّم",
  "Learning that feels like play": AR_001_BRAND_TAGLINE,
  "Something went wrong. Please try again.": "حدث خطأ. حاول مرة أخرى.",
  "Page not found": "الصفحة غير موجودة",
  "You do not have access to this page.": "ليس لديك صلاحية الوصول إلى هذه الصفحة.",
  "No data yet": "لا توجد بيانات بعد",
  "Data unavailable right now": "البيانات غير متاحة حاليًا",
  Cumulative: "تراكمي",
  "For the current month": "للشهر الحالي",
  "Cumulative from all sessions": "تراكمي من جميع الجلسات",
  "From completed sessions": "من الجلسات المكتملة",
  "From all sessions with duration": "من جميع الجلسات ذات المدة",
  "Credited learning time — questions, books, and parent activities":
    "وقت التعلّم المعتمد — أسئلة وكتب وأنشطة أولياء الأمور",
  dollar: "دولار",
  dollars: "دولار",
  Dollar: "دولار",
  Dollars: "دولار",
};

const POST_PHRASE_FIXES = [
  [/\bGrade 1\b/g, "الصف 1"],
  [/\bGrade 2\b/g, "الصف 2"],
  [/\bGrade 3\b/g, "الصف 3"],
  [/\bGrade 4\b/g, "الصف 4"],
  [/\bGrade 5\b/g, "الصف 5"],
  [/\bGrade 6\b/g, "الصف 6"],
  [/\bYear 1\b/g, "الصف 1"],
  [/\bYear 2\b/g, "الصف 2"],
  [/\bYear 3\b/g, "الصف 3"],
  [/\bYear 4\b/g, "الصف 4"],
  [/\bYear 5\b/g, "الصف 5"],
  [/\bYear 6\b/g, "الصف 6"],
  [/worksheet/gi, "ورقة عمل"],
  [/worksheets/gi, "أوراق عمل"],
  [/answer key/gi, "مفتاح الإجابات"],
  [/\bclass group\b/gi, "مجموعة صفّية"],
  [/\bClass group\b/g, "مجموعة صفّية"],
];

function looksNonTranslate(s) {
  if (s == null) return true;
  const str = String(s);
  if (!str.trim()) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str)) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(str)) return true;
  if (/^\d+(\.\d+)?%?$/.test(str)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(str) && str.length <= 48) return true;
  if (/[\u0590-\u05FF]/.test(str) && !/[A-Za-z]/.test(str)) return true;
  if (!/\s/.test(str)) {
    if (/^[a-z0-9]+([_/.-][a-z0-9]+)+$/i.test(str)) return true;
    if (/^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(str)) return true;
    if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
    if (/\.(png|jpe?g|gif|webp|svg|ttf|woff2?|json|js|css|mp3|wav|pdf)$/i.test(str)) return true;
  }
  return false;
}

function protectPlaceholders(s) {
  /** @type {string[]} */
  const ph = [];
  const out = String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    ph.push(name);
    return `⟦${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restorePlaceholders(s, ph) {
  return String(s).replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `{${ph[Number(i)]}}`);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyGlossaryHints(text) {
  let out = text;
  for (const [enTerm, entry] of Object.entries(ARABIC_MASTER_GLOSSARY)) {
    if (!entry?.preferred) continue;
    if (!/[A-Za-z]/.test(enTerm)) continue;
    if (enTerm.length < 3) continue;
    const re = new RegExp(`\\b${escapeRegExp(enTerm)}\\b`, "g");
    out = out.replace(re, entry.preferred);
  }
  for (const [re, rep] of POST_PHRASE_FIXES) {
    out = out.replace(re, rep);
  }
  // Protect brand
  out = out.replace(/Leo Kids/g, "Leo Kids");
  return out;
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

async function mtTranslate(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateString(en, cache) {
  if (looksNonTranslate(en)) return { value: en, source: "skip" };
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, en)) {
    return { value: EXACT_OVERRIDES[en], source: "override" };
  }
  if (!FORCE && cache[en]) {
    return { value: applyGlossaryHints(cache[en]), source: "cache" };
  }
  if (OFFLINE) {
    return { value: applyGlossaryHints(en), source: "offline" };
  }

  const { text, ph } = protectPlaceholders(en);
  let translated;
  try {
    translated = await mtTranslate(text);
  } catch (err) {
    console.warn("MT fail:", en.slice(0, 60), err.message);
    return { value: en, source: "mt-fail" };
  }
  translated = restorePlaceholders(translated, ph);
  translated = applyGlossaryHints(translated);

  const enPh = [...en.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  const arPh = [...translated.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  if (enPh !== arPh) {
    console.warn("placeholder mismatch, keeping EN:", en.slice(0, 80));
    return { value: en, source: "ph-mismatch" };
  }

  cache[en] = translated;
  return { value: translated, source: "mt" };
}

function listJsonFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".json")) out.push(full);
    }
  })(dir);
  return out;
}

async function transformValue(value, key, cache, stats) {
  if (typeof value === "string") {
    if (SKIP_VALUE_KEYS.has(key)) {
      stats.skipped += 1;
      return value;
    }
    const { value: out, source } = await translateString(value, cache);
    stats[source] = (stats[source] || 0) + 1;
    return out;
  }
  if (Array.isArray(value)) {
    const arr = [];
    for (const item of value) arr.push(await transformValue(item, key, cache, stats));
    return arr;
  }
  if (value && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const obj = {};
    for (const [k, v] of Object.entries(value)) {
      obj[k] = await transformValue(v, k, cache, stats);
    }
    return obj;
  }
  return value;
}

async function processJsonFile(srcPath, destPath, cache, stats) {
  const raw = JSON.parse(fs.readFileSync(srcPath, "utf8"));
  const out = await transformValue(raw, "", cache, stats);
  if (!DRY) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  }
}

async function main() {
  const cache = loadCache();
  const stats = { skipped: 0 };
  const report = { namespaces: [], packs: [], forbiddenHits: [] };

  if (!PACKS_ONLY) {
    const srcDir = path.join(ROOT, "locales/en");
    const destDir = path.join(ROOT, "locales", LOCALE);
    for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"))) {
      const src = path.join(srcDir, file);
      const dest = path.join(destDir, file);
      console.log("namespace", file);
      await processJsonFile(src, dest, cache, stats);
      report.namespaces.push(file);
      // Hard authority for grade keys in common.json
      if (file === "common.json" && !DRY) {
        const common = JSON.parse(fs.readFileSync(dest, "utf8"));
        common.gradeLabel = AR_001_GRADE_LABEL;
        common.grade1 = "الصف 1";
        common.grade2 = "الصف 2";
        common.grade3 = "الصف 3";
        common.grade4 = "الصف 4";
        common.grade5 = "الصف 5";
        common.grade6 = "الصف 6";
        common.brandName = "Leo Kids";
        common.brandTagline = AR_001_BRAND_TAGLINE;
        common.subjectMath = "الرياضيات";
        common.subjectGeometry = "الهندسة";
        common.subjectEnglish = "الإنجليزية";
        common.subjectScience = "العلوم";
        fs.writeFileSync(dest, JSON.stringify(common, null, 2) + "\n", "utf8");
      }
      saveCache(cache);
    }
  }

  if (!NAMESPACES_ONLY) {
    for (const domain of DOMAINS) {
      const srcDir = path.join(ROOT, "content-packs/en", domain);
      const destDir = path.join(ROOT, "content-packs", LOCALE, domain);
      if (!fs.existsSync(srcDir)) continue;
      const files = listJsonFiles(srcDir);
      console.log("pack domain", domain, files.length);
      for (const src of files) {
        const rel = path.relative(srcDir, src);
        const dest = path.join(destDir, rel);
        await processJsonFile(src, dest, cache, stats);
        report.packs.push(`${domain}/${rel.replace(/\\/g, "/")}`);
        if (report.packs.length % 25 === 0) saveCache(cache);
      }
      saveCache(cache);
    }
  }

  // Scan forbidden patterns
  const trees = [`locales/${LOCALE}`, `content-packs/${LOCALE}`];
  for (const tree of trees) {
    const dir = path.join(ROOT, tree);
    if (!fs.existsSync(dir)) continue;
    for (const file of listJsonFiles(dir)) {
      const text = fs.readFileSync(file, "utf8");
      for (const { re, label } of FORBIDDEN_AR_001_PATTERNS) {
        if (re.test(text)) {
          report.forbiddenHits.push({ file: path.relative(ROOT, file), label });
        }
      }
    }
  }

  saveCache(cache);
  fs.writeFileSync(REPORT_PATH, JSON.stringify({ stats, report }, null, 2), "utf8");
  console.log("Done", stats);
  console.log("Forbidden hits", report.forbiddenHits.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
