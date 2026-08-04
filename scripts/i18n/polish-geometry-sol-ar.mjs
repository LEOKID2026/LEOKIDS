/**
 * Polish half-English sol_* / theory chrome in ar-001 geometry explanations pack.
 */
import fs from "node:fs";

const LEAF =
  "content-packs/ar-001/learning/burn-down/utils__geometry-explanations.json";
const IDX = "content-packs/ar-001/learning/burn-down-index.json";
const SLUG = "utils__geometry-explanations";

const leaf = JSON.parse(fs.readFileSync(LEAF, "utf8"));
const idx = JSON.parse(fs.readFileSync(IDX, "utf8"));
const copy = leaf.copy || {};

/** Exact overrides for known mixed keys */
const OVERRIDES = {
  sol_1_identify_square_all_sides_the_same_length_area_how_much_sp_b3333972:
    "1. تعرّف: المربع — كل الأضلاع متساوية الطول. المساحة = مقدار الحيز داخل الشكل (وليست المحيط). الصيغة: المساحة = الضلع × الضلع.",
  sol_1_identify_a_rectangle_has_two_pairs_of_equal_sides_the_area_fb06eee4:
    "1. تعرّف: للمستطيل زوجان من الأضلاع المتساوية. المساحة = الطول × العرض.",
  sol_2_formula_rectangle_area_length_width_6f1b39cf:
    "2. الصيغة: مساحة المستطيل = الطول × العرض.",
  sol_1_identify_the_height_to_the_base_is_a_perpendicular_segment_4872de1b:
    "1. تعرّف: الارتفاع على القاعدة هو قطعة عمودية على القاعدة.",
  sol_2_formula_triangle_area_base_height_to_the_base_2_015bb42a:
    "2. الصيغة: مساحة المثلث = (القاعدة × الارتفاع) ÷ 2.",
  sol_1_identify_the_height_of_a_parallelogram_is_the_perpendicula_a12f1744:
    "1. تعرّف: ارتفاع متوازي الأضلاع هو العمود على القاعدة.",
  sol_2_formula_parallelogram_area_base_height_perpendicular_8c27ad4b:
    "2. الصيغة: مساحة متوازي الأضلاع = القاعدة × الارتفاع العمودي.",
  sol_1_identify_a_trapezoid_has_two_parallel_bases_the_height_is__e574ad5a:
    "1. تعرّف: لشبه المنحرف قاعدتان متوازيتان؛ الارتفاع هو المسافة بينهما.",
  sol_2_formula_trapezoid_area_base_1_base_2_height_2_644c8814:
    "2. الصيغة: مساحة شبه المنحرف = ((القاعدة 1 + القاعدة 2) × الارتفاع) ÷ 2.",
  sol_1_identify_the_radius_goes_from_the_center_to_the_edge_area__f56cefda:
    "1. تعرّف: نصف القطر يمتد من المركز إلى الحافة. المساحة = π × نصف القطر².",
  sol_2_formula_circle_area_radius_here_3_14_006a59dc:
    "2. الصيغة: مساحة الدائرة = π × نصف القطر² (هنا π ≈ 3.14).",
  sol_1_formula_square_perimeter_side_4_6b38bda8:
    "1. الصيغة: محيط المربع = الضلع × 4.",
  sol_1_formula_rectangle_perimeter_length_width_2_0461f663:
    "1. الصيغة: محيط المستطيل = (الطول + العرض) × 2.",
  sol_1_formula_triangle_perimeter_side_1_side_2_side_3_71ad3bd7:
    "1. الصيغة: محيط المثلث = الضلع 1 + الضلع 2 + الضلع 3.",
  sol_1_formula_circle_circumference_2_radius_86c6d60f:
    "1. الصيغة: محيط الدائرة = 2 × π × نصف القطر.",
  sol_1_formula_pyramid_volume_1_3_base_area_height_2d011c6f:
    "1. الصيغة: حجم الهرم = (1/3) × مساحة القاعدة × الارتفاع.",
  sol_2_square_base_base_area_side_side_540df4c9:
    "2. قاعدة مربعة: مساحة القاعدة = الضلع × الضلع.",
  sol_2_rectangular_base_base_area_length_width_4cb18ac3:
    "2. قاعدة مستطيلة: مساحة القاعدة = الطول × العرض.",
  sol_1_formula_cone_volume_1_3_radius_height_3_14_2d90d146:
    "1. الصيغة: حجم المخروط = (1/3) × π × نصف القطر² × الارتفاع.",
  sol_1_formula_prism_volume_base_area_the_prism_s_height_b604a955:
    "1. الصيغة: حجم المنشور = مساحة القاعدة × ارتفاع المنشور.",
  sol_2_triangle_base_area_base_height_to_the_base_2_ed4b64f8:
    "2. قاعدة مثلثة: مساحة القاعدة = (القاعدة × الارتفاع على القاعدة) ÷ 2.",
  sol_1_formula_prism_volume_base_area_height_7cfa36dd:
    "1. الصيغة: حجم المنشور = مساحة القاعدة × الارتفاع.",
  sol_1_recall_the_sum_of_the_three_interior_angles_of_a_triangle__50dae0bb:
    "1. تذكّر: مجموع الزوايا الداخلية الثلاث في المثلث = 180°.",
  sol_1_in_a_right_triangle_the_two_sides_next_to_the_right_angle__cdc681b6:
    "1. في المثلث القائم: الضلعان المجاوران للزاوية القائمة هما الساقان، والضلع المقابل هو الوتر.",
  sol_1_the_same_formula_a_b_c_when_finding_a_leg_isolate_its_squa_6633504c:
    "1. نفس الصيغة a² + b² = c²؛ عند إيجاد ساق، اعزل مربّعها.",
};

/** Phrase-level cleanup for remaining mixed strings */
const PHRASE_FIXES = [
  [/Identify:/gi, "تعرّف:"],
  [/Formula:/gi, "الصيغة:"],
  [/Substitute:/gi, "عوّض:"],
  [/Compute:/gi, "احسب:"],
  [/Conclusion:/gi, "الخلاصة:"],
  [/all sides same/gi, "كل الأضلاع متساوية"],
  [/how much space inside/gi, "مقدار الحيز داخل الشكل"],
  [/ليس المحيط around/gi, "وليست المحيط"],
  [/\baround\b/gi, "حول"],
  [/\bheight\b/gi, "الارتفاع"],
  [/\bbase\b/gi, "القاعدة"],
  [/\blength\b/gi, "الطول"],
  [/\bwidth\b/gi, "العرض"],
  [/\bside\b/gi, "الضلع"],
  [/\bradius\b/gi, "نصف القطر"],
  [/\barea\b/gi, "المساحة"],
  [/\bperimeter\b/gi, "المحيط"],
  [/\bvolume\b/gi, "الحجم"],
  [/\btriangle\b/gi, "المثلث"],
  [/\brectangle\b/gi, "المستطيل"],
  [/\bsquare\b/gi, "المربع"],
  [/\bcircle\b/gi, "الدائرة"],
  [/\bparallelogram\b/gi, "متوازي الأضلاع"],
  [/\btrapezoid\b/gi, "شبه المنحرف"],
  [/added بدلًا من subtracting from/gi, "جمعت بدلًا من أن تطرح من"],
];

let n = 0;
for (const [k, v] of Object.entries(copy)) {
  if (!k.startsWith("sol_") && !k.startsWith("theory_")) continue;
  let next = OVERRIDES[k] || v;
  if (!OVERRIDES[k] && /[A-Za-z]{3,}/.test(String(v))) {
    for (const [re, rep] of PHRASE_FIXES) next = String(next).replace(re, rep);
  }
  if (next !== v) {
    copy[k] = next;
    idx[SLUG][k] = next;
    n += 1;
  } else if (OVERRIDES[k]) {
    copy[k] = OVERRIDES[k];
    idx[SLUG][k] = OVERRIDES[k];
    n += 1;
  }
}

leaf.copy = copy;
fs.writeFileSync(LEAF, JSON.stringify(leaf, null, 2) + "\n");
fs.writeFileSync(IDX, JSON.stringify(idx, null, 2) + "\n");
console.log("polished keys", n);

// Count remaining Latin words in sol_/theory_
let left = 0;
for (const [k, v] of Object.entries(copy)) {
  if (!k.startsWith("sol_") && !k.startsWith("theory_")) continue;
  const stripped = String(v)
    .replace(/[π√×÷°²³≈]/g, "")
    .replace(/\b[a-c]\b/gi, "")
    .replace(/\d+(?:\.\d+)?/g, "")
    .replace(/\{m\d+\}/g, "");
  if (/[A-Za-z]{4,}/.test(stripped)) {
    left += 1;
    if (left <= 12) console.log("still", k, "=>", String(v).slice(0, 100));
  }
}
console.log("remaining mixed-ish", left);
