/**
 * Convert remaining getSolutionSteps mix`...` English chrome to geCopy/geMix.
 * Safe patterns only — preserves nested M() math islands as {mN} exprs.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const GEO = path.join(ROOT, "utils/geometry-explanations.js");
const EN_LEAF = path.join(
  ROOT,
  "content-packs/en/learning/burn-down/utils__geometry-explanations.json"
);
const AR_LEAF = path.join(
  ROOT,
  "content-packs/ar-001/learning/burn-down/utils__geometry-explanations.json"
);
const EN_IDX = path.join(ROOT, "content-packs/en/learning/burn-down-index.json");
const AR_IDX = path.join(ROOT, "content-packs/ar-001/learning/burn-down-index.json");

const SLUG = "utils__geometry-explanations";

function shortHash(s) {
  return crypto.createHash("md5").update(s).digest("hex").slice(0, 8);
}

function slugKey(prefix, en) {
  const base = String(en)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 64);
  return `${prefix}_${base}_${shortHash(en)}`;
}

/** @type {Record<string,{en:string,ar:string}>} */
const CURATED = {
  sol_step_compute_m0: {
    en: "Compute: {m0}.",
    ar: "احسب: {m0}.",
  },
  sol_step_compute_then_m0_m1: {
    en: "Compute: {m0}, then {m1}.",
    ar: "احسب: {m0}، ثم {m1}.",
  },
  sol_step_substitute_m0: {
    en: "Substitute: {m0}.",
    ar: "عوّض: {m0}.",
  },
  sol_step_substitute_height_m0_m1: {
    en: "Substitute: {m0}, height {m1}.",
    ar: "عوّض: {m0}، والارتفاع {m1}.",
  },
  sol_step_compute_rounded_m0_m1: {
    en: "Compute: {m0} → rounded per the question: {m1}.",
    ar: "احسب: {m0} ← بعد التقريب حسب السؤال: {m1}.",
  },
  sol_step_volume_m0: {
    en: "Volume: {m0}.",
    ar: "الحجم: {m0}.",
  },
  sol_step_stated_m0: {
    en: "What is stated in the question: {m0}.",
    ar: "ما ورد في السؤال: {m0}.",
  },
  sol_step_missing_angle_m0: {
    en: "The missing angle is {m0}°.",
    ar: "الزاوية الناقصة هي {m0}°.",
  },
  sol_step_squares_m0_m1: {
    en: "Compute the squares: {m0} and {m1}.",
    ar: "احسب المربعات: {m0} و{m1}.",
  },
  sol_step_sqrt_hyp_m0: {
    en: "Take the square root for the hypotenuse: {m0}.",
    ar: "خذ الجذر التربيعي للوتر: {m0}.",
  },
  sol_step_look_for_leg_m0_m1: {
    en: "Here we look for {m0}, so {m1}.",
    ar: "هنا نبحث عن {m0}، إذن {m1}.",
  },
  sol_step_missing_leg_m0: {
    en: "Missing leg: {m0}.",
    ar: "الضلع الناقص: {m0}.",
  },
  sol_step_shape_appears_m0: {
    en: 'Check the side lengths from the data — the shape appears "{m0}".',
    ar: 'تحقق من أطوال الأضلاع من المعطيات — يبدو الشكل "{m0}".',
  },
  sol_step_choose_shape_m0: {
    en: 'Choose the matching shape name — "{m0}".',
    ar: 'اختر اسم الشكل المطابق — "{m0}".',
  },
  sol_step_answer_is_m0: {
    en: 'So the correct answer is "{m0}".',
    ar: 'إذن الإجابة الصحيحة هي "{m0}".',
  },
  sol_step_equal_sides_m0: {
    en: "The number of equal sides is {m0} — choose this answer value among the options.",
    ar: "عدد الأضلاع المتساوية هو {m0} — اختر هذه القيمة من الخيارات.",
  },
  sol_step_two_pairs_m0: {
    en: "Exactly two equal pairs are formed — the numeric answer is {m0}.",
    ar: "يتكوّن زوجان متساويان بالضبط — الإجابة العددية هي {m0}.",
  },
  sol_step_quad_angles_m0: {
    en: "{m0} is a quadrilateral with four interior angles.",
    ar: "{m0} شكل رباعي له أربع زوايا داخلية.",
  },
  sol_step_right_angles_m0: {
    en: "The number of right angles: {m0} — choose this value in the options.",
    ar: "عدد الزوايا القائمة: {m0} — اختر هذه القيمة من الخيارات.",
  },
  sol_step_name_in_q_m0: {
    en: 'The name in the question is: "{m0}".',
    ar: 'الاسم في السؤال هو: "{m0}".',
  },
  sol_step_match_m0: {
    en: "Match: {m0}.",
    ar: "المطابقة: {m0}.",
  },
  sol_step_classify_tri_m0: {
    en: 'Classify the triangle by equal side lengths — the name in the question: "{m0}".',
    ar: 'صنّف المثلث حسب أطوال الأضلاع المتساوية — الاسم في السؤال: "{m0}".',
  },
  sol_step_option_m0: {
    en: "So the correct option is {m0}.",
    ar: "إذن الخيار الصحيح هو {m0}.",
  },
  sol_step_identify_quad_m0: {
    en: 'Identify a quadrilateral by its sides and angles — here: "{m0}".',
    ar: 'تعرّف على الشكل الرباعي من أضلاعه وزواياه — هنا: "{m0}".',
  },
  sol_step_number_matches_m0_m1: {
    en: 'The number that matches "{m0}" is {m1}.',
    ar: 'الرقم المطابق لـ "{m0}" هو {m1}.',
  },
  sol_step_transform_type_m0: {
    en: 'The type of transformation in the question: "{m0}".',
    ar: 'نوع التحويل في السؤال: "{m0}".',
  },
  sol_step_choose_opt_m0: {
    en: "So we choose {m0}.",
    ar: "إذن نختار {m0}.",
  },
  sol_step_rotation_angle_m0: {
    en: "The question asks for the rotation angle — here {m0}°.",
    ar: "السؤال يطلب زاوية الدوران — هنا {m0}°.",
  },
  sol_step_answer_degrees_m0: {
    en: "The answer in degrees: {m0}.",
    ar: "الإجابة بالدرجات: {m0}.",
  },
  sol_step_count_axes_m0: {
    en: 'Careful counting by the shape type "{m0}".',
    ar: 'عدّ بعناية حسب نوع الشكل "{m0}".',
  },
  sol_step_axes_count_m0: {
    en: "The number of axes of symmetry: {m0}.",
    ar: "عدد محاور التماثل: {m0}.",
  },
  sol_step_diag_square_m0: {
    en: "In a square with side {m0}, the diagonal is computed using the Pythagorean theorem.",
    ar: "في مربع طول ضلعه {m0}، يُحسب القطر باستخدام نظرية فيثاغورس.",
  },
  sol_step_diag_rect_m0_m1: {
    en: "In a rectangle with length {m0} and width {m1}, the diagonal is computed using the Pythagorean theorem.",
    ar: "في مستطيل طوله {m0} وعرضه {m1}، يُحسب القطر باستخدام نظرية فيثاغورس.",
  },
  sol_step_diag_para_m0_m1: {
    en: "In a parallelogram with sides {m0} and {m1}, the diagonal is computed using the Pythagorean theorem.",
    ar: "في متوازي أضلاع ضلعاه {m0} و{m1}، يُحسب القطر باستخدام نظرية فيثاغورس.",
  },
  sol_step_interior_angle_m0_m1: {
    en: 'In the shape "{m0}" the interior angle is {m1}°.',
    ar: 'في الشكل "{m0}" الزاوية الداخلية هي {m1}°.',
  },
  sol_step_so_answer_angle_m0: {
    en: "So the answer: {m0}°.",
    ar: "إذن الإجابة: {m0}°.",
  },
  sol_step_faces_q_m0: {
    en: "Question: how many faces does{m0}?",
    ar: "السؤال: كم وجهًا لـ{m0}؟",
  },
  sol_step_faces_a_m0_m1: {
    en: "For{m0} there are {m1} faces.",
    ar: "لـ{m0} يوجد {m1} أوجه.",
  },
  sol_step_vertices_q_m0: {
    en: "Question: how many vertices does{m0}?",
    ar: "السؤال: كم رأسًا لـ{m0}؟",
  },
  sol_step_vertices_a_m0_m1: {
    en: "For{m0} there are {m1} vertices.",
    ar: "لـ{m0} يوجد {m1} رؤوس.",
  },
  sol_step_edges_q_m0: {
    en: "Question: how many edges does{m0}?",
    ar: "السؤال: كم حرفًا لـ{m0}؟",
  },
  sol_step_edges_a_m0_m1: {
    en: "For{m0} there are {m1} edges.",
    ar: "لـ{m0} يوجد {m1} أحرف.",
  },
  sol_step_desc_m0: {
    en: 'In the description: "{m0}".',
    ar: 'في الوصف: "{m0}".',
  },
  sol_step_identify_features_m0: {
    en: "Identify by features: {m0}.",
    ar: "تعرّف بالخصائص: {m0}.",
  },
  sol_step_solid_name_m0: {
    en: "The matching solid's name: {m0}.",
    ar: "اسم المجسّم المطابق: {m0}.",
  },
};

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

function upsertKeys(enLeaf, arLeaf, enIdx, arIdx, keys) {
  for (const [k, v] of Object.entries(keys)) {
    enLeaf.copy[k] = v.en;
    arLeaf.copy[k] = v.ar;
    if (!enIdx[SLUG]) enIdx[SLUG] = {};
    if (!arIdx[SLUG]) arIdx[SLUG] = {};
    enIdx[SLUG][k] = v.en;
    arIdx[SLUG][k] = v.ar;
  }
}

let src = fs.readFileSync(GEO, "utf8");
const enLeaf = loadJson(EN_LEAF);
const arLeaf = loadJson(AR_LEAF);
const enIdx = loadJson(EN_IDX);
const arIdx = loadJson(AR_IDX);
if (!enLeaf.copy) enLeaf.copy = {};
if (!arLeaf.copy) arLeaf.copy = {};

upsertKeys(enLeaf, arLeaf, enIdx, arIdx, CURATED);

// 1) Result phrases: drop English "N. " wrapper
src = src.replace(
  /toSpan\(\s*mix`\d+\.\s*\$\{(resultPhrase(?:Area|Length|Volume|VolumeRounded)\([^)]+\))\}`\s*,\s*"(\d+)"\s*\)/g,
  'toSpan($1, "$2")'
);

// 2) Multi-line compute with two M() then result already handled; handle common compute/substitute templates
const REPLACERS = [
  // compute: M(...), then M(...).
  {
    re: /toSpan\(\s*mix`(\d+)\.\s*compute:\s*\$\{M\(([\s\S]*?)\)\}\s*,\s*then\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    to: (_m, _n, a, b, step) =>
      `toSpan(geMix("sol_step_compute_then_m0_m1", [${a}, ${b}]), "${step}")`,
  },
  // compute: M(...) → rounded ... M(...)
  {
    re: /toSpan\(\s*mix`(\d+)\.\s*compute:\s*\$\{M\(([\s\S]*?)\)\}\s*→\s*rounded per the question:\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    to: (_m, _n, a, b, step) =>
      `toSpan(geMix("sol_step_compute_rounded_m0_m1", [${a}, ${b}]), "${step}")`,
  },
  // substitute: M(...), height M(...).
  {
    re: /toSpan\(\s*mix`(\d+)\.\s*substitute:\s*\$\{M\(([\s\S]*?)\)\}\s*,\s*height\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    to: (_m, _n, a, b, step) =>
      `toSpan(geMix("sol_step_substitute_height_m0_m1", [${a}, ${b}]), "${step}")`,
  },
  // substitute: M(...).
  {
    re: /toSpan\(\s*mix`(\d+)\.\s*substitute:\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    to: (_m, _n, a, step) => `toSpan(geMix("sol_step_substitute_m0", [${a}]), "${step}")`,
  },
  // compute: M(...).
  {
    re: /toSpan\(\s*mix`(\d+)\.\s*compute:\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    to: (_m, _n, a, step) => `toSpan(geMix("sol_step_compute_m0", [${a}]), "${step}")`,
  },
  // volume: M(...).
  {
    re: /toSpan\(\s*mix`(\d+)\.\s*volume:\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    to: (_m, _n, a, step) => `toSpan(geMix("sol_step_volume_m0", [${a}]), "${step}")`,
  },
];

for (const { re, to } of REPLACERS) {
  src = src.replace(re, to);
}

// 3) Narrative lines — map known English templates to curated keys
const NARRATIVE = [
  [
    /toSpan\(\s*mix`(\d+)\.\s*what is stated in the question:\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, a, step) => `toSpan(geMix("sol_step_stated_m0", [${a}]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the missing angle is \$\{correctAnswer\}°\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_missing_angle_m0", [String(correctAnswer)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*compute the squares:\s*\$\{M\(([\s\S]*?)\)\}\s*and\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, a, b, step) => `toSpan(geMix("sol_step_squares_m0_m1", [${a}, ${b}]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*take the square root for the hypotenuse:\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, a, step) => `toSpan(geMix("sol_step_sqrt_hyp_m0", [${a}]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*here we look for \$\{missingLeg\},\s*so\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, a, step) =>
      `toSpan(geMix("sol_step_look_for_leg_m0_m1", [String(missingLeg), ${a}]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*missing leg:\s*\$\{M\(([\s\S]*?)\)\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, a, step) => `toSpan(geMix("sol_step_missing_leg_m0", [${a}]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*Check the side lengths from the data — the shape appears "\$\{shapeName\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_shape_appears_m0", [String(shapeName)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*Choose the matching shape name — "\$\{shapeName\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_choose_shape_m0", [String(shapeName)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*so the correct answer is "\$\{shapeName\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_answer_is_m0", [String(shapeName)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the number of equal sides is \$\{correctAnswer\} - Choose this answer value among the options\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_equal_sides_m0", [String(correctAnswer)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*exactly two equal pairs are formed — the numeric answer is \$\{correctAnswer\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_two_pairs_m0", [String(correctAnswer)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*\$\{shapeName\} a quadrilateral with four interior angles\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_quad_angles_m0", [String(shapeName)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the number of right angles: \$\{correctAnswer\} - choose this value in the options\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_right_angles_m0", [String(correctAnswer)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the name in the question is: "\$\{type\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_name_in_q_m0", [String(type)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*match: \$\{opt\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_match_m0", [String(opt)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*Classify the triangle by equal side lengths — the name in the question: "\$\{type\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_classify_tri_m0", [String(type)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*so the correct option is \$\{idx\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_option_m0", [String(idx)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*Identify a quadrilateral by its sides and angles — here: "\$\{type\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_identify_quad_m0", [String(type)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the number that matches "\$\{type\}" is \$\{idx\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_number_matches_m0_m1", [String(type), String(idx)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the type of transformation in the question: "\$\{type\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_transform_type_m0", [String(type)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*so we choose \$\{opt\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_choose_opt_m0", [String(opt)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*The question asks for the rotation angle — here \$\{angle\}°\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_rotation_angle_m0", [String(angle)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the answer in degrees: \$\{angle\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_answer_degrees_m0", [String(angle)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*careful counting by the shape type "\$\{shapeName\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_count_axes_m0", [String(shapeName)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the number of axes of symmetry: \$\{axes\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_axes_count_m0", [String(axes)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*in a square with side \$\{side\}, The diagonal is computed using the Pythagorean theorem\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_diag_square_m0", [String(side)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*in a rectangle with length \$\{side\} and width \$\{width\}, The diagonal is computed using the Pythagorean theorem\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_diag_rect_m0_m1", [String(side), String(width)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*in a parallelogram with sides \$\{side\} and \$\{width\}, The diagonal is computed using the Pythagorean theorem\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_diag_para_m0_m1", [String(side), String(width)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*in the shape "\$\{shape\}" the interior angle is \$\{angle\}°\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_interior_angle_m0_m1", [String(shape), String(angle)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*so the answer: \$\{angle\}°\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_so_answer_angle_m0", [String(angle)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*Question: how many faces does\$\{solid\}\?`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_faces_q_m0", [String(solid)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*to\$\{solid\} there is \$\{faces\} faces\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_faces_a_m0_m1", [String(solid), String(faces)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*Question: how many vertices does\$\{solid\}\?`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_vertices_q_m0", [String(solid)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*to\$\{solid\} there is \$\{vertices\} vertices\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_vertices_a_m0_m1", [String(solid), String(vertices)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*Question: how many sides does\$\{solid\}\?`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_edges_q_m0", [String(solid)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*to\$\{solid\} there is \$\{edges\} sides\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) =>
      `toSpan(geMix("sol_step_edges_a_m0_m1", [String(solid), String(edges)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*in the description: "\$\{desc\}"\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_desc_m0", [String(desc)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*identify by features:\s*\$\{key\}`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_identify_features_m0", [String(key)]), "${step}")`,
  ],
  [
    /toSpan\(\s*mix`(\d+)\.\s*the matching solid's name:\s*\$\{solid\}\.`\s*,\s*"(\d+)"\s*\)/g,
    (_m, _n, step) => `toSpan(geMix("sol_step_solid_name_m0", [String(solid)]), "${step}")`,
  ],
];

for (const [re, to] of NARRATIVE) {
  src = src.replace(re, to);
}

fs.writeFileSync(GEO, src);
saveJson(EN_LEAF, enLeaf);
saveJson(AR_LEAF, arLeaf);
saveJson(EN_IDX, enIdx);
saveJson(AR_IDX, arIdx);

const left = (src.match(/toSpan\(\s*mix`/g) || []).length;
console.log("remaining toSpan(mix`", left);
if (left) {
  const re = /toSpan\(\s*mix`([\s\S]*?)`/g;
  let m;
  let i = 0;
  while ((m = re.exec(src)) && i < 20) {
    console.log("---", m[1].replace(/\s+/g, " ").slice(0, 140));
    i += 1;
  }
}
