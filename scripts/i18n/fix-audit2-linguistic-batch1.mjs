import fs from "fs";
import path from "path";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, j) {
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

// --- 1–4, 8: reports.json ---
const reportsPath = "locales/ar-001/reports.json";
const reports = readJson(reportsPath);
const geo = reports.topics?.geometry || {};
const en = reports.topics?.english || {};
const math = reports.topics?.math || {};

Object.assign(geo, {
  square_area_intro: "مقدمة في المساحة",
  square_area: "مساحة المربع",
  trapezoid_area: "مساحة شبه المنحرف",
  parallelogram_area: "مساحة متوازي الأضلاع",
  square_perimeter: "محيط المربع",
  diagonal_rectangle: "أقطار المستطيل",
  rectangular_prism_volume: "حجم المنشور المستطيل",
  pythagoras_hyp: "وتر فيثاغورس",
  cylinder_volume: "حجم الأسطوانة",
  solids: "المجسمات ثلاثية الأبعاد",
  solids_intro: "مقدمة إلى المجسمات ثلاثية الأبعاد",
});
Object.assign(en, {
  phonics_blends: "مزج الأصوات",
  grammar_be: "فعل «to be»",
  grammar_present_simple: "المضارع البسيط",
  grammar_conditionals: "الجمل الشرطية",
  sentences_reported: "الكلام المنقول",
});
Object.assign(math, {
  percent_discount: "خصومات بالنسبة المئوية",
  lcm_gcf: "المضاعف المشترك الأصغر (LCM) والقاسم المشترك الأكبر (GCF)",
});

// Naturalness in insights
function walkReplace(obj, pairs) {
  if (!obj || typeof obj !== "object") return;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      let s = v;
      for (const [from, to] of pairs) s = s.split(from).join(to);
      obj[k] = s;
    } else walkReplace(v, pairs);
  }
}
walkReplace(reports, [
  ["في المضي قدمًا", "فيما بعد"],
  ["في المضي قدما", "فيما بعد"],
  ["إنه يساعد على الاستمرار في التدريب القصير والمنتظم والتحقق من استمرار الاستقرار فيما بعد.", "يُستحسن الاستمرار في التدريب القصير والمنتظم والتحقق من استمرار الاستقرار فيما بعد."],
  ["عادة عظيمة", "عادة ممتازة"],
  ["الأشياء التي يجب وضعها في الاعتبار", "نقاط للتنبّه"],
  ["هذا الاسبوع", "هذا الأسبوع"],
]);
// Fix the specific noUrgentTopic sentence if still awkward
if (reports.parentInsights?.noUrgentTopic?.includes("إنه يساعد")) {
  reports.parentInsights.noUrgentTopic = reports.parentInsights.noUrgentTopic.replace(
    /إنه يساعد على/,
    "يُستحسن",
  );
}
writeJson(reportsPath, reports);

// Fix mathematical منطقة across ar-001 packs (not UI "area/zone")
const mathAreaReps = [
  [/منطقة مربعة/g, "مساحة المربع"],
  [/منطقة المربع/g, "مساحة المربع"],
  [/منطقة شبه منحرف/g, "مساحة شبه المنحرف"],
  [/منطقة متوازي الأضلاع/g, "مساحة متوازي الأضلاع"],
  [/مقدمة للمنطقة/g, "مقدمة في المساحة"],
  [/📐 منطقة المستطيل/g, "📐 مساحة المستطيل"],
  [/منطقة المستطيل/g, "مساحة المستطيل"],
  [/📐 المنطقة(?!")/g, "📐 المساحة"],
];

function walkFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, out);
    else if (/\.(json|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

let areaHits = 0;
const roots = [
  "locales/ar-001",
  "content-packs/ar-001/reports",
  "content-packs/ar-001/books",
  "content-packs/ar-001/learning",
  "content-packs/ar-001/public-seo/practice",
];
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walkFiles(root)) {
    let text = fs.readFileSync(file, "utf8");
    let n = 0;
    for (const [re, to] of mathAreaReps) {
      const before = text;
      text = text.replace(re, to);
      if (text !== before) n += (before.match(re) || []).length || 1;
    }
    if (n) {
      fs.writeFileSync(file, text);
      areaHits += n;
      console.log("area", file, n);
    }
  }
}

// --- 5 learning formulas ---
const learningPath = "locales/ar-001/learning.json";
const learning = readJson(learningPath);
function fixFormulas(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) return node.forEach(fixFormulas);
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === "string") {
      if (k === "title" || k === "desc" || k === "formula") {
        node[k] = v
          .replace(/📐\s*مساحة المربعة/g, "📐 مساحة المربع")
          .replace(/مساحة المربعة/g, "مساحة المربع")
          .replace(/📐\s*منطقة المستطيل/g, "📐 مساحة المستطيل")
          .replace(/منطقة المستطيل/g, "مساحة المستطيل")
          .replace(/^📐\s*المنطقة$/g, "📐 المساحة")
          .replace(/الجانب × الجانب/g, "الضلع × الضلع")
          .replace(/أ = أ²/g, "A = a²")
          .replace(/أ = أ × ب/g, "A = a × b")
          .replace(/أ = /g, "A = ")
          .replace(/ ب/g, " b");
      }
    } else fixFormulas(v);
  }
}
fixFormulas(learning);
if (learning.activity?.needsStrengthening) {
  learning.activity.needsStrengthening = learning.activity.needsStrengthening.replace(
    "المنطقة المراد تعزيزها",
    "المجال المراد تعزيزه",
  );
}
writeJson(learningPath, learning);

console.log(JSON.stringify({ areaHits, reportsOk: true, learningOk: true }));
