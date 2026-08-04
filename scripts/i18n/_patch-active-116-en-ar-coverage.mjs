/**
 * Patch 116 active runtime keys into EN + ar-001 leaves, then rebuild indexes.
 * Does NOT add the 23 stale es-419-only keys.
 *
 * Run: node scripts/i18n/_patch-active-116-en-ar-coverage.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {Record<string, { en: Record<string,string>, ar: Record<string,string> }>} */
const GAME_PACKS = {
  "components__educational-games__leo-bakery__leo-bakery-data": {
    en: {
      item_cookies: "cookies",
      item_cupcakes: "cupcakes",
      item_rolls: "rolls",
      item_muffins: "muffins",
      item_croissants: "croissants",
      prompt_build: "Set up {trays} trays with {perTray} {itemLabel} on each tray.",
      prompt_find_trays:
        "There are {total} {itemLabel}. Each tray holds {perTray}. How many trays do you need?",
      prompt_find_per_tray:
        "Share {total} {itemLabel} equally among {trays} trays. How many go on each tray?",
      prompt_find_total:
        "There are {trays} trays with {perTray} {itemLabel} on each. How many {itemLabel} in total?",
      prompt_same_total:
        "There are {total} items. They are arranged as {givenTrays} trays with {givenPerTray} on each. Rearrange the same total using a different number of trays.",
      prompt_build_fallback: "Set up the order.",
      control_build: "Build the order.",
      control_find_total: "Choose the total number of items.",
      control_find_trays: "Choose how many trays you need.",
      control_find_per_tray: "Choose how many go on each tray.",
      control_same_total: "Choose a different arrangement with the same total.",
      solution_text_same_total: "Another way: {trays} trays with {perTray} on each.",
      solution_text_find_trays: "You need {trays} trays.",
      solution_text_find_per_tray: "Each tray gets {perTray}.",
      solution_text_default: "Solution:",
      feedback_ok: "Great! The order is ready.",
      feedback_almost: "Check the number of trays and how many are on each tray.",
      info_find_trays: "{total} {itemLabel} · {perTray} per tray",
      info_find_per_tray: "{total} {itemLabel} · {trays} trays",
      info_find_total: "{trays} trays · {perTray} {itemLabel} per tray",
      info_same_total_given: "Given: {givenTrays} × {givenPerTray} = {total}",
    },
    ar: {
      item_cookies: "بسكويت",
      item_cupcakes: "كب كيك",
      item_rolls: "لفائف",
      item_muffins: "مافن",
      item_croissants: "كرواسون",
      prompt_build: "جهّز {trays} صوانٍ وفي كل صينية {perTray} من {itemLabel}.",
      prompt_find_trays:
        "يوجد {total} من {itemLabel}. كل صينية تتسع لـ {perTray}. كم صينية تحتاج؟",
      prompt_find_per_tray:
        "وزّع {total} من {itemLabel} بالتساوي على {trays} صوانٍ. كم قطعة في كل صينية؟",
      prompt_find_total:
        "يوجد {trays} صوانٍ وفي كل واحدة {perTray} من {itemLabel}. كم {itemLabel} بالمجموع؟",
      prompt_same_total:
        "يوجد {total} قطعة. هي مرتبة كـ {givenTrays} صوانٍ وفي كل واحدة {givenPerTray}. أعد الترتيب بنفس المجموع بعدد مختلف من الصواني.",
      prompt_build_fallback: "جهّز الطلب.",
      control_build: "ابنِ الطلب.",
      control_find_total: "اختر العدد الإجمالي للقطع.",
      control_find_trays: "اختر كم صينية تحتاج.",
      control_find_per_tray: "اختر كم قطعة في كل صينية.",
      control_same_total: "اختر ترتيبًا مختلفًا بنفس المجموع.",
      solution_text_same_total: "طريقة أخرى: {trays} صوانٍ وفي كل واحدة {perTray}.",
      solution_text_find_trays: "تحتاج إلى {trays} صوانٍ.",
      solution_text_find_per_tray: "كل صينية تحصل على {perTray}.",
      solution_text_default: "الحل:",
      feedback_ok: "أحسنت! الطلب جاهز.",
      feedback_almost: "تحقق من عدد الصواني وكم قطعة في كل صينية.",
      info_find_trays: "{total} من {itemLabel} · {perTray} في كل صينية",
      info_find_per_tray: "{total} من {itemLabel} · {trays} صوانٍ",
      info_find_total: "{trays} صوانٍ · {perTray} من {itemLabel} في كل صينية",
      info_same_total_given: "معطى: {givenTrays} × {givenPerTray} = {total}",
    },
  },
  "components__educational-games__leo-gifts__leo-gifts-data": {
    en: {
      item_gifts_one: "gift",
      item_gifts_other: "gifts",
      item_candies_one: "candy",
      item_candies_other: "candies",
      item_stickers_one: "sticker",
      item_stickers_other: "stickers",
      item_stars_one: "star",
      item_stars_other: "stars",
      item_sweets_one: "sweet",
      item_sweets_other: "sweets",
      item_gifts: "gifts",
      item_candies: "candies",
      item_stickers: "stickers",
      item_stars: "stars",
      item_sweets: "sweets",
      remaining_none: "Nothing left over.",
      remaining_one: "1 item left over.",
      remaining_other: "{count} items left over.",
      prompt_share_equal:
        "Share {total} {itemLabel} equally among {children} children. How many does each child get?",
      prompt_share_with_remainder:
        "Share {total} {itemLabel} equally among {children} children. How many does each child get, and how many are left over?",
      prompt_make_groups:
        "There are {total} {itemLabel}. Put {groupSize} in each bag. How many full bags can you make?",
      prompt_make_groups_with_remainder:
        "There are {total} {itemLabel}. Put {groupSize} in each bag. How many full bags can you make, and how many are left over?",
      solution_text_share: "Each child gets {quotient}.",
      solution_text_share_remainder: "Each child gets {quotient}. {remaining}",
      solution_text_groups: "You can make {quotient} full bags.",
      solution_text_groups_remainder: "You can make {quotient} full bags. {remaining}",
      feedback_ok: "Great! You shared correctly.",
      feedback_almost_groups: "Check how many full bags you can make.",
      feedback_almost_share:
        "Check that each child gets an equal share and that the remainder is correct.",
      label_children: "Children",
      label_bags: "Bags",
      quotient_per_child: "Per child",
      quotient_full_bags: "Full bags",
      idle_make_groups_remainder: "Choose how many full bags and how many are left over",
      idle_make_groups: "Choose how many full bags you can make",
      idle_share_remainder: "Choose how many each child gets and how many are left over",
      idle_share_equal: "Choose how many each child gets",
    },
    ar: {
      item_gifts_one: "هدية",
      item_gifts_other: "هدايا",
      item_candies_one: "حلوى",
      item_candies_other: "حلويات",
      item_stickers_one: "ملصق",
      item_stickers_other: "ملصقات",
      item_stars_one: "نجمة",
      item_stars_other: "نجوم",
      item_sweets_one: "حلوى",
      item_sweets_other: "حلويات",
      item_gifts: "هدايا",
      item_candies: "حلويات",
      item_stickers: "ملصقات",
      item_stars: "نجوم",
      item_sweets: "حلويات",
      remaining_none: "لا يتبقى شيء.",
      remaining_one: "يتبقى عنصر واحد.",
      remaining_other: "يتبقى {count} عناصر.",
      prompt_share_equal:
        "وزّع {total} من {itemLabel} بالتساوي بين {children} أطفال. كم يحصل كل طفل؟",
      prompt_share_with_remainder:
        "وزّع {total} من {itemLabel} بالتساوي بين {children} أطفال. كم يحصل كل طفل، وكم يتبقى؟",
      prompt_make_groups:
        "يوجد {total} من {itemLabel}. ضع {groupSize} في كل كيس. كم كيسًا ممتلئًا يمكنك صنعه؟",
      prompt_make_groups_with_remainder:
        "يوجد {total} من {itemLabel}. ضع {groupSize} في كل كيس. كم كيسًا ممتلئًا يمكنك صنعه، وكم يتبقى؟",
      solution_text_share: "كل طفل يحصل على {quotient}.",
      solution_text_share_remainder: "كل طفل يحصل على {quotient}. {remaining}",
      solution_text_groups: "يمكنك صنع {quotient} أكياس ممتلئة.",
      solution_text_groups_remainder: "يمكنك صنع {quotient} أكياس ممتلئة. {remaining}",
      feedback_ok: "أحسنت! وزّعت بشكل صحيح.",
      feedback_almost_groups: "تحقق من عدد الأكياس الممتلئة التي يمكنك صنعها.",
      feedback_almost_share: "تحقق أن كل طفل يحصل على نصيب متساوٍ وأن الباقي صحيح.",
      label_children: "أطفال",
      label_bags: "أكياس",
      quotient_per_child: "لكل طفل",
      quotient_full_bags: "أكياس ممتلئة",
      idle_make_groups_remainder: "اختر كم كيسًا ممتلئًا وكم يتبقى",
      idle_make_groups: "اختر كم كيسًا ممتلئًا يمكنك صنعه",
      idle_share_remainder: "اختر كم يحصل كل طفل وكم يتبقى",
      idle_share_equal: "اختر كم يحصل كل طفل",
    },
  },
  "components__educational-games__leo-number-path__leo-number-path-data": {
    en: {
      feedback_ok: "Great! You chose the correct path.",
      feedback_almost: "Almost! Check the rule and the order again.",
    },
    ar: {
      feedback_ok: "أحسنت! اخترت المسار الصحيح.",
      feedback_almost: "كدت تصل! تحقق من القاعدة والترتيب مرة أخرى.",
    },
  },
  "components__educational-games__leo-pizzeria__leo-pizzeria-data": {
    en: {
      difficulty_easy: "Easy",
      difficulty_medium: "Medium",
      difficulty_hard: "Hard",
      hint_easy: "Whole, half, third, and quarter",
      hint_medium: "Build fractions, equivalent fractions, and compare",
      hint_hard: "Equivalent fractions, compare, and combine visually",
      topping_cheese: "Cheese",
      topping_tomato: "Tomato",
      topping_olives: "Olives",
      topping_mushrooms: "Mushrooms",
      topping_pepper: "Pepper",
      topping_basil: "Basil",
      greeting_build: "Build the pizza for this fraction.",
      ticket_build: "Mark the matching number of slices.",
      greeting_identify: "How many slices are marked?",
      ticket_identify: "Choose how many slices are marked.",
      greeting_complete: "Complete the pizza to make a whole.",
      ticket_complete: "Mark the missing slices.",
      greeting_equivalent: "Make a fraction equal to the one shown.",
      ticket_equivalent: "Mark the matching part on the pizza.",
      greeting_compare: "Which fraction is greater?",
      ticket_compare: "Choose the correct answer.",
      greeting_combine: "Combine the fractions on the pizza.",
      ticket_combine: "Mark the sum on the pizza.",
      error_extra_topping: "Extra topping on the pizza — check again.",
      error_almost_check_slices: "Almost! Check how many slices are marked.",
      success_pizza_ready: "Well done! The pizza is ready.",
      feedback_identify_ok: "Great! You identified the fraction.",
      feedback_identify_almost: "Check how many slices are marked.",
      feedback_compare_ok: "Correct comparison!",
      feedback_compare_almost: "Try comparing again by portion size.",
      error_missing_answer: "Missing answer",
      solution_compare_greater: "Solution: the first fraction is greater.",
      solution_compare_less: "Solution: the second fraction is greater.",
      solution_compare_equal: "Solution: equal",
      solution_identify: "Solution: that is the correct fraction",
      solution_equivalent: "Solution: the fractions are equal.",
      solution_complete: "Solution: had {given}, added {added}, together {total}",
      solution_combine: "Solution: mark the sum of the parts on the pizza.",
      solution_build: "Solution: mark the correct number of slices for the fraction",
    },
    ar: {
      difficulty_easy: "سهل",
      difficulty_medium: "متوسط",
      difficulty_hard: "صعب",
      hint_easy: "كامل، نصف، ثلث، وربع",
      hint_medium: "ابنِ الكسور، والكسور المتكافئة، وقارن",
      hint_hard: "كسور متكافئة، قارن، واجمع بصريًا",
      topping_cheese: "جبن",
      topping_tomato: "طماطم",
      topping_olives: "زيتون",
      topping_mushrooms: "فطر",
      topping_pepper: "فلفل",
      topping_basil: "ريحان",
      greeting_build: "ابنِ البيتزا لهذا الكسر.",
      ticket_build: "علّم عدد الشرائح المطابق.",
      greeting_identify: "كم شريحة معلّمة؟",
      ticket_identify: "اختر كم شريحة معلّمة.",
      greeting_complete: "أكمل البيتزا حتى تصبح كاملة.",
      ticket_complete: "علّم الشرائح الناقصة.",
      greeting_equivalent: "اصنع كسرًا مساويًا للكسر المعروض.",
      ticket_equivalent: "علّم الجزء المطابق على البيتزا.",
      greeting_compare: "أي كسر أكبر؟",
      ticket_compare: "اختر الإجابة الصحيحة.",
      greeting_combine: "اجمع الكسور على البيتزا.",
      ticket_combine: "علّم المجموع على البيتزا.",
      error_extra_topping: "إضافة زائدة على البيتزا — تحقق مرة أخرى.",
      error_almost_check_slices: "كدت تصل! تحقق من عدد الشرائح المعلّمة.",
      success_pizza_ready: "أحسنت! البيتزا جاهزة.",
      feedback_identify_ok: "أحسنت! تعرّفت على الكسر.",
      feedback_identify_almost: "تحقق من عدد الشرائح المعلّمة.",
      feedback_compare_ok: "مقارنة صحيحة!",
      feedback_compare_almost: "حاول المقارنة مرة أخرى حسب حجم الجزء.",
      error_missing_answer: "الإجابة ناقصة",
      solution_compare_greater: "الحل: الكسر الأول أكبر.",
      solution_compare_less: "الحل: الكسر الثاني أكبر.",
      solution_compare_equal: "الحل: متساويان",
      solution_identify: "الحل: هذا هو الكسر الصحيح",
      solution_equivalent: "الحل: الكسور متكافئة.",
      solution_complete: "الحل: كان لديه {given}، أضاف {added}، معًا {total}",
      solution_combine: "الحل: علّم مجموع الأجزاء على البيتزا.",
      solution_build: "الحل: علّم العدد الصحيح من الشرائح للكسر",
    },
  },
  "lib__educational-games__educational-game-registry": {
    en: {
      equal_sharing_groups_and_remainder: "Equal sharing, groups, and remainder",
      divide_among_children_or_bags_find_quotient_and_remainder:
        "Divide among children or into bags — find how many per group and how many are left over, then tap Check division.",
      solution_shown_after_failed_attempts:
        "Correct answer +30, time bonus, streak. After a few failed attempts the solution is shown.",
      watch_whether_task_asks_per_child_or_full_bags:
        "Watch whether the task asks for per child or full bags.",
      multiplication_equal_groups_and_missing_factor:
        "Multiplication, equal groups, and missing factor",
      build_trays_find_total_or_factor_rearrange_same_total:
        "Build trays, find the total or missing factor, or rearrange the same total — then tap Check order.",
      build_identify_equivalent_compare_and_combine_fractions:
        "Build, identify, make equivalent, compare, and combine fractions",
      build_identify_complete_compare_or_match_equivalent_fractions_on_pizza:
        "Build fractions on a pizza, identify them from a picture, complete them to a whole, compare, or match equivalents — by task.",
      numerators_and_denominators_equal_slices_not_position:
        "Pay attention to the numerator and denominator — pizza slices are always equal parts.",
      solution_shown_after_failed_attempts_per_customer:
        "Correct answer +30, streak bonus. After a few failed attempts the solution is shown.",
    },
    ar: {
      equal_sharing_groups_and_remainder: "توزيع متساوٍ، مجموعات، وباقٍ",
      divide_among_children_or_bags_find_quotient_and_remainder:
        "اقسم بين الأطفال أو في أكياس — اعثر على الكمية لكل مجموعة وما يتبقى، ثم اضغط تحقق من القسمة.",
      solution_shown_after_failed_attempts:
        "إجابة صحيحة +30، مكافأة وقت، سلسلة. بعد عدة محاولات فاشلة يظهر الحل.",
      watch_whether_task_asks_per_child_or_full_bags:
        "لاحظ إن كانت المهمة تطلب لكل طفل أم أكياسًا ممتلئة.",
      multiplication_equal_groups_and_missing_factor: "الضرب، مجموعات متساوية، وعامل ناقص",
      build_trays_find_total_or_factor_rearrange_same_total:
        "ابنِ الصواني، اعثر على المجموع أو العامل الناقص، أو أعد ترتيب نفس المجموع — ثم اضغط تحقق من الطلب.",
      build_identify_equivalent_compare_and_combine_fractions:
        "ابنِ، وتعرّف، وكافئ، وقارن، واجمع الكسور",
      build_identify_complete_compare_or_match_equivalent_fractions_on_pizza:
        "ابنِ الكسور على بيتزا، تعرّف عليها من صورة، أكملها إلى واحد صحيح، قارن، أو طابق المتكافئة — حسب المهمة.",
      numerators_and_denominators_equal_slices_not_position:
        "انتبه للبسط والمقام — شرائح البيتزا دائمًا أجزاء متساوية.",
      solution_shown_after_failed_attempts_per_customer:
        "إجابة صحيحة +30، مكافأة سلسلة. بعد عدة محاولات فاشلة يظهر الحل.",
    },
  },
};

const GLOBAL_SPARSE = {
  slug: "utils__detailed-report-parent-letter",
  en: { sparse_data: "Sparse data" },
  ar: { sparse_data: "بيانات متفرقة" },
};

function readLeaf(filePath) {
  if (!fs.existsSync(filePath)) return { copy: {} };
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (raw && typeof raw === "object" && raw.copy && typeof raw.copy === "object") return raw;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return { copy: raw };
  return { copy: {} };
}

function writeLeaf(filePath, copy) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const ordered = {};
  for (const k of Object.keys(copy).sort()) ordered[k] = copy[k];
  fs.writeFileSync(filePath, `${JSON.stringify({ copy: ordered }, null, 2)}\n`, "utf8");
}

const classification = JSON.parse(
  fs.readFileSync(path.join(ROOT, "artifacts/i18n/ar-001-es419-139-key-classification.json"), "utf8"),
);
const activeKeys = classification.active.map((a) => `${a.slug}.${a.shortKey}`);
const staleKeys = classification.stale.map((a) => `${a.slug}.${a.shortKey}`);

let enAdded = 0;
let arAdded = 0;
const counts = {
  bakery: 0,
  gifts: 0,
  numberPath: 0,
  pizzeria: 0,
  registry: 0,
  sparse: 0,
};

for (const [slug, packs] of Object.entries(GAME_PACKS)) {
  for (const loc of ["en", "ar-001"]) {
    const leafPath = path.join(ROOT, "content-packs", loc, "games", "burn-down", `${slug}.json`);
    const leaf = readLeaf(leafPath);
    const src = loc === "en" ? packs.en : packs.ar;
    for (const [k, v] of Object.entries(src)) {
      const before = leaf.copy[k];
      if (before !== v) {
        if (before == null || before === "") {
          if (loc === "en") enAdded += 1;
          else arAdded += 1;
        }
        leaf.copy[k] = v;
      }
      if (loc === "en") {
        if (slug.includes("leo-bakery")) counts.bakery += 1;
        else if (slug.includes("leo-gifts")) counts.gifts += 1;
        else if (slug.includes("leo-number-path")) counts.numberPath += 1;
        else if (slug.includes("leo-pizzeria")) counts.pizzeria += 1;
        else if (slug.includes("educational-game-registry")) counts.registry += 1;
      }
    }
    // Never introduce stale keys
    for (const stale of staleKeys) {
      const [s, short] = [stale.slice(0, stale.lastIndexOf(".")), stale.slice(stale.lastIndexOf(".") + 1)];
      if (s === slug && short in src === false && short in leaf.copy) {
        // leave existing if any (shouldn't be in EN/AR); do not add
      }
    }
    writeLeaf(leafPath, leaf.copy);
  }
}

// Global sparse_data canonical slug (no -he)
for (const loc of ["en", "ar-001"]) {
  const leafPath = path.join(
    ROOT,
    "content-packs",
    loc,
    "global-burn-down",
    `${GLOBAL_SPARSE.slug}.json`,
  );
  const leaf = readLeaf(leafPath);
  const src = loc === "en" ? GLOBAL_SPARSE.en : GLOBAL_SPARSE.ar;
  for (const [k, v] of Object.entries(src)) {
    if (leaf.copy[k] == null || leaf.copy[k] === "") {
      if (loc === "en") enAdded += 1;
      else arAdded += 1;
    }
    leaf.copy[k] = v;
  }
  writeLeaf(leafPath, leaf.copy);
}
counts.sparse = 1;

// Rebuild indexes for en + ar-001
execSync("node scripts/i18n/rebuild-canonical-burn-down-indexes.mjs", {
  cwd: ROOT,
  stdio: "inherit",
});

// Verify active keys present; stale absent from AR requirement
const enGames = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content-packs/en/games/burn-down-index.json"), "utf8"),
);
const arGames = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content-packs/ar-001/games/burn-down-index.json"), "utf8"),
);
const enGlobal = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content-packs/en/global-burn-down/burn-down-index.json"), "utf8"),
);
const arGlobal = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "content-packs/ar-001/global-burn-down/burn-down-index.json"),
    "utf8",
  ),
);

function lookup(domain, slug, key) {
  if (domain === "games") {
    return { en: enGames[slug]?.[key], ar: arGames[slug]?.[key] };
  }
  return { en: enGlobal[slug]?.[key], ar: arGlobal[slug]?.[key] };
}

let missingEn = 0;
let missingAr = 0;
for (const a of classification.active) {
  const domain = a.file.includes("global-burn-down") ? "global" : "games";
  const { en, ar } = lookup(domain, a.slug, a.shortKey);
  if (typeof en !== "string" || !en.trim()) missingEn += 1;
  if (typeof ar !== "string" || !ar.trim()) missingAr += 1;
}

let staleInArRequired = 0;
for (const s of classification.stale) {
  // Stale keys must not be treated as required; count if we accidentally added them
  // into packs that previously lacked them. Presence in es-419 only is fine.
  // We only flag if a stale key was newly introduced where EN/AR both have it AND
  // it was not already expected — skip soft check; report 0 if not in our GAME_PACKS.
  const inPatch =
    (GAME_PACKS[s.slug] && (s.shortKey in GAME_PACKS[s.slug].en || s.shortKey in GAME_PACKS[s.slug].ar)) ||
    (s.slug === GLOBAL_SPARSE.slug && s.shortKey in GLOBAL_SPARSE.en);
  if (inPatch) staleInArRequired += 1;
}

const report = {
  activeKeys: activeKeys.length,
  englishCanonicalKeysAdded: enAdded,
  arabicKeysAdded: arAdded,
  familyCounts: counts,
  missingEn,
  missingAr,
  staleKeys: staleKeys.length,
  staleKeysAddedByPatch: staleInArRequired,
};

fs.writeFileSync(
  path.join(ROOT, "artifacts/i18n/ar-001-active-116-patch-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(report, null, 2));
if (missingEn || missingAr || staleInArRequired) process.exit(1);
