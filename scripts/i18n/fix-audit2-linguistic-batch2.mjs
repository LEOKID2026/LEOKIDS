import fs from "fs";
import path from "path";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, j) {
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

// Glossary
{
  const p = "lib/i18n/arabic-master-glossary.js";
  let s = fs.readFileSync(p, "utf8");
  s = s
    .replace(/Student: \{ preferred: "الطالب" \}/, 'Student: { preferred: "تلميذ / تلميذة" }')
    .replace(/Students: \{ preferred: "الطلاب" \}/, 'Students: { preferred: "تلاميذ" }')
    .replace(
      /"class group": \{ preferred: "مجموعة صفّية" \}/,
      '"class group": { preferred: "الفصل", notes: "class group — not grade" }',
    )
    .replace(
      /"Class group": \{ preferred: "مجموعة صفّية" \}/,
      '"Class group": { preferred: "الفصل", notes: "class group — not grade" }',
    )
    .replace(
      /class: \{ preferred: "الصف", notes: "school year level" \}/,
      'class: { preferred: "الصف", notes: "grade / year level" }',
    );
  fs.writeFileSync(p, s);
  console.log("glossary updated");
}

// Teacher diagnostic wording
{
  const p = "locales/ar-001/teacher.json";
  const j = readJson(p);
  const t = j.topicReinforcement || j;
  // find keys by scanning string values
  function walk(o) {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string") {
        o[k] = v
          .replace(/الممارسة التشخيصية اللازمة/g, "الممارسة التحليلية اللازمة")
          .replace(/الممارسة التشخيصية/g, "الممارسة التحليلية")
          .replace(/تعزيز الفصل التشخيصي/g, "تعزيز تحليلي للفصل")
          .replace(/ممارسة تشخيصية قصيرة/g, "ممارسة تقييمية قصيرة")
          .replace(/نشاط تشخيصي قصير/g, "نشاط تقييمي قصير")
          .replace(/تشخيصي/g, "تحليلي")
          .replace(/تشخيصية/g, "تحليلية");
      } else walk(v);
    }
  }
  walk(j);
  writeJson(p, j);
  console.log("teacher diagnostic updated");
}

// Arcade: الممرات → صالة الألعاب (when meaning arcade)
const arcadeFiles = [
  "locales/ar-001/games.json",
  "locales/ar-001/ui.json",
  "content-packs/ar-001/demo/ui.json",
  "content-packs/ar-001/games/ui-pack-index.json",
  "content-packs/ar-001/games/chess.json",
  "content-packs/ar-001/games/checkers.json",
  "content-packs/ar-001/games/ludo.json",
  "content-packs/ar-001/games/bingo.json",
  "content-packs/ar-001/games/dominoes.json",
  "content-packs/ar-001/games/fourline.json",
  "content-packs/ar-001/games/snakes-and-ladders.json",
  "content-packs/ar-001/games/burn-down-index.json",
  "content-packs/ar-001/games/burn-down/lib__arcade__server__arcadePlaceholderGame.json",
  "data/help-center/ar-001/students.js",
];
let arcadeN = 0;
for (const f of arcadeFiles) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  s = s
    .replace(/العب مع الأصدقاء في الممرات/g, "العب مع الأصدقاء في صالة الألعاب")
    .replace(/العودة إلى الممرات/g, "العودة إلى صالة الألعاب")
    .replace(/نادي الممرات/g, "نادي صالة الألعاب")
    .replace(/مهمات الممرات/g, "مهمات صالة الألعاب")
    .replace(/\{game\} — الممرات/g, "{game} — صالة الألعاب")
    .replace(/بناء الممرات/g, "بناء صالة الألعاب")
    .replace(/تصفح الممرات/g, "تصفح صالة الألعاب")
    .replace(/في الممرات،/g, "في صالة الألعاب،")
    .replace(/صفحة الممرات/g, "صفحة صالة الألعاب")
    .replace(/اذهب إلى الممرات/g, "اذهب إلى صالة الألعاب")
    .replace(/العملات المعدنية والممرات/g, "العملات المعدنية وصالة الألعاب")
    .replace(/\bأركيد\b/g, "الآركيد")
    .replace(/\bآركيد\b/g, "الآركيد");
  // Avoid breaking science "الممرات المائية" / trail paths — those files not in list
  if (s !== before) {
    fs.writeFileSync(f, s);
    arcadeN++;
    console.log("arcade", f);
  }
}
console.log("arcade files", arcadeN);

// Help metadata آباء → أولياء الأمور (keywords only where it's parent UI meta)
for (const f of [
  "data/help-center/ar-001/parents.js",
  "locales/ar-001/school.json",
  "content-packs/ar-001/global-burn-down/lib__school-portal__school-messaging-ui.json",
  "content-packs/ar-001/global-burn-down/burn-down-index.json",
]) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  s = s
    .replace(/"آباء"/g, '"أولياء الأمور"')
    .replace(/آباء الطبقة المنزلية/g, "أولياء أمور الفصل الأساسي")
    .replace(/آباء الأطفال في المنزل/g, "أولياء أمور الأطفال")
    .replace(/آباء الطبقة/g, "أولياء أمور الفصل");
  if (s !== before) {
    fs.writeFileSync(f, s);
    console.log("help/meta", f);
  }
}

// قم بـ naturalness — targeted auth/copilot/learning
const qamFiles = ["locales/ar-001/auth.json", "locales/ar-001/copilot.json", "locales/ar-001/learning.json", "locales/ar-001/ui.json", "locales/ar-001/common.json"];
const qamReps = [
  [/قم بإضافة طفل/g, "أضِف طفلًا"],
  [/قم بإضافة/g, "أضِف"],
  [/قم بإجراء جلسة/g, "نفّذ جلسة تمرين"],
  [/قم بإجراء/g, "نفّذ"],
  [/قم بإلغاء تحديد الكل/g, "ألغِ تحديد الكل"],
  [/قم بإلغاء/g, "ألغِ"],
  [/قم بتسجيل الدخول/g, "سجّل الدخول"],
  [/قم بتسجيل/g, "سجّل"],
  [/قم باختيار/g, "اختر"],
  [/قم بإنشاء/g, "أنشئ"],
  [/قم بتحديث/g, "حدّث"],
  [/قم بحفظ/g, "احفظ"],
  [/قم بفتح/g, "افتح"],
  [/قم بإدخال/g, "أدخل"],
  [/قم بمراجعة/g, "راجع"],
  [/قم بالتحقق/g, "تحقّق"],
  [/قم بالضغط/g, "اضغط"],
  [/قم بالنقر/g, "انقر"],
  [/قم بالمتابعة/g, "تابع"],
];
for (const f of qamFiles) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, "utf8");
  let n = 0;
  for (const [re, to] of qamReps) {
    const m = s.match(re);
    if (m) {
      n += m.length;
      s = s.replace(re, to);
    }
  }
  if (n) {
    fs.writeFileSync(f, s);
    console.log("qam", f, n);
  }
}

console.log("batch2 done");
