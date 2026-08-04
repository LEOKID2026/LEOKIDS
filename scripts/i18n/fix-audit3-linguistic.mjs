/**
 * Audit #3 linguistic batch: marketing, copilot, parent terms, diagnostic, arcade, help, auth, vocab.
 */
import fs from "node:fs";

function read(p) {
  return fs.readFileSync(p, "utf8");
}
function write(p, s) {
  fs.writeFileSync(p, s);
}
function patchJson(p, mutator) {
  const j = JSON.parse(read(p));
  mutator(j);
  write(p, JSON.stringify(j, null, 2) + "\n");
}

// 1 + 7 — parents marketing
patchJson("content-packs/ar-001/public-seo/marketing/parents.json", (j) => {
  j.installLabel = "ثبّت التطبيق";
  j.infoSections[1].body =
    "أولياء الأمور الذين يريدون فهم مستوى تقدّم أطفالهم ومساعدتهم على التقدّم، وجعل الممارسة المنزلية أوضح وأكثر جاذبية.";
  // Unified imperative style in bullets: imperative verbs
  j.infoSections[0].bullets = [
    "أضِف طفلًا إلى النظام.",
    "احصل على تفاصيل تسجيل الدخول لطفلك.",
    "اعرض التقارير المرحلية.",
    "تحقق من التقدم حسب المادة والموضوع.",
    "شاهد المواضيع القوية والمواضيع التي تحتاج إلى تعزيز.",
    "أرسل نشاطًا شخصيًا لطفلك.",
    "تابع الانتهاء والنتائج.",
    "دع طفلك يتعلم من خلال المكافآت والألعاب.",
  ];
  const benefits = j.benefits.items;
  for (const b of benefits) {
    if (b.text?.includes("دون الحاجة إلى تحريكه")) {
      b.text = b.text.replace("دون الحاجة إلى تحريكه", "دون الحاجة إلى حثّه باستمرار");
    }
    if (b.title?.includes("احتكاك أقل")) {
      b.title = "توتر أقل حول وقت الواجبات";
    }
    if (b.text?.includes("قم بتعيين")) {
      b.text = b.text.replace("قم بتعيين", "عيّن");
    }
  }
});

// 2 — copilot diagnosticBoundary + parent term
patchJson("locales/ar-001/copilot.json", (j) => {
  j.boundary.diagnosticBoundary =
    "يمكنني فقط استخدام ما يظهر في بيانات التدريب العملي على الموقع. يسلّط التقرير الضوء على المواد والمواضيع التي تحتاج إلى تعزيز، لكنه ليس تشخيصًا شخصيًا. يمكننا التركيز على ما يظهره التقرير: مادة قوية، أو موضوع يجب تعزيزه، أو خطوة صغيرة للمنزل.";
  if (j.errors?.student_not_found_for_this_parent) {
    j.errors.student_not_found_for_this_parent = "لم يتم العثور على التلميذ لولي الأمر هذا";
  } else {
    // nested under api/errors variants
    const walk = (o) => {
      if (!o || typeof o !== "object") return;
      for (const [k, v] of Object.entries(o)) {
        if (k === "student_not_found_for_this_parent") o[k] = "لم يتم العثور على التلميذ لولي الأمر هذا";
        else if (typeof v === "object") walk(v);
        else if (typeof v === "string" && v.includes("لهذا الوالد")) {
          o[k] = v.replace(/لهذا الوالد/g, "لولي الأمر هذا").replace(/هذا الوالد/g, "ولي الأمر هذا");
        }
      }
    };
    walk(j);
  }
});

// 3 — parent terminology
patchJson("locales/ar-001/auth.json", (j) => {
  j.showParent = "أظهر ولي الأمر";
  if (j.invite?.parentReferral) {
    j.invite.parentReferral = j.invite.parentReferral.replace(/قم بالزيارة هنا:/g, "زُر هذا الرابط:");
  }
  if (j.invite?.studentShareFriends) {
    j.invite.studentShareFriends = j.invite.studentShareFriends.replace(
      /قم بالزيارة هنا:/g,
      "زُر هذا الرابط:"
    );
  }
  if (j.registration?.teacher?.inviteOnlyNote) {
    j.registration.teacher.inviteOnlyNote = j.registration.teacher.inviteOnlyNote.replace(
      /قم بالتبديل إلى علامة تبويب تسجيل المعلم الخاص\./,
      "انتقل إلى تبويب تسجيل المعلم الخاص."
    );
  }
});

patchJson("locales/ar-001/ui.json", (j) => {
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (k === "flowStep2" && typeof v === "string") {
        o[k] = "يحصل ولي الأمر على صورة واضحة";
      } else if (typeof v === "object") walk(v);
    }
  };
  walk(j);
});

patchJson("locales/ar-001/school.json", (j) => {
  if (j.operatorAccessAdminDesc) {
    j.operatorAccessAdminDesc =
      "ابحث عن الأطفال، وأنشئ وأعد تعيين بيانات اعتماد تسجيل دخول الطفل/ولي الأمر، وأدر حسابات الوصول.";
  }
  if (j.confirmDisconnectParent) {
    j.confirmDisconnectParent = "هل تريد فصل ولي الأمر هذا عن الطفل؟";
  }
  if (j.confirmRevokeParent) {
    j.confirmRevokeParent = "هل تريد إلغاء وصول ولي الأمر هذا بشكل دائم؟";
  }
  if (j.detailsFieldParent1Name) j.detailsFieldParent1Name = "اسم ولي الأمر 1";
  if (j.detailsFieldParent2Name) j.detailsFieldParent2Name = "اسم ولي الأمر 2";
  if (j.detailsFieldParent1NationalId) {
    j.detailsFieldParent1NationalId = "رقم الهوية الوطنية لولي الأمر 1";
  }
  if (j.detailsFieldParent2NationalId) {
    j.detailsFieldParent2NationalId = "رقم الهوية الوطنية لولي الأمر 2";
  }
});

// Full scan user-facing الوالد in locales/ar-001 (product UI)
for (const file of fs.readdirSync("locales/ar-001").filter((f) => f.endsWith(".json"))) {
  const p = `locales/ar-001/${file}`;
  let t = read(p);
  const before = t;
  // Avoid English-learning content about biological fathers — none of these locale files are that.
  t = t.replace(/أظهر الوالد/g, "أظهر ولي الأمر");
  t = t.replace(/يحصل الوالد على رؤية واضحة/g, "يحصل ولي الأمر على صورة واضحة");
  t = t.replace(/يحصل الوالد على/g, "يحصل ولي الأمر على");
  t = t.replace(/هذا الوالد/g, "ولي الأمر هذا");
  t = t.replace(/لهذا الوالد/g, "لولي الأمر هذا");
  t = t.replace(/اسم الوالد (\d)/g, "اسم ولي الأمر $1");
  t = t.replace(/للوالد (\d)/g, "لولي الأمر $1");
  t = t.replace(/الطفل\/الوالد/g, "الطفل/ولي الأمر");
  t = t.replace(/رقم الهوية الوطنية للوالد/g, "رقم الهوية الوطنية لولي الأمر");
  if (t !== before) {
    write(p, t);
    console.log("parent-term patched", p);
  }
}

// 4 — diagnostic terminology
const diagFiles = [
  "content-packs/ar-001/learning/burn-down/utils__adaptive-learning-planner__adaptive-planner.json",
  "content-packs/ar-001/learning/burn-down/utils__diagnostic-engine-v3__types.json",
  "content-packs/ar-001/learning/diagnostic-framework-v1.json",
  "content-packs/ar-001/learning/burn-down/diagnostic-framework-v1.json",
  "content-packs/ar-001/learning/burn-down-index.json",
];
for (const p of diagFiles) {
  if (!fs.existsSync(p)) continue;
  let t = read(p);
  const before = t;
  t = t.replace(/مجموعة تشخيصية صغيرة/g, "مجموعة تقييمية صغيرة");
  t = t.replace(/محرك التشخيص V3/g, "محرك التحليل V3");
  t = t.replace(/إطار التشخيص المهني V1/g, "إطار التحليل التربوي V1");
  // Keep ليس تشخيصًا intact — do not touch
  if (t !== before) {
    write(p, t);
    console.log("diagnostic patched", p);
  }
}

// Also scan teacher/reports/copilot/school for user-facing تشخيصي labels (not ليس تشخيصًا)
for (const p of [
  "locales/ar-001/teacher.json",
  "locales/ar-001/reports.json",
  "locales/ar-001/school.json",
  "locales/ar-001/copilot.json",
]) {
  let t = read(p);
  const before = t;
  t = t.replace(/الممارسة التشخيصية/g, "الممارسة التقييمية");
  t = t.replace(/ممارسة تشخيصية/g, "ممارسة تقييمية");
  t = t.replace(/نشاط تشخيصي/g, "نشاط تقييمي");
  t = t.replace(/تعزيز الفصل التشخيصي/g, "تعزيز تحليلي للفصل");
  t = t.replace(/تعزيز تشخيصي/g, "تعزيز تحليلي");
  if (t !== before) {
    write(p, t);
    console.log("diag locale", p);
  }
}

// 5 — arcade missions
patchJson(
  "content-packs/ar-001/games/burn-down/lib__arcade__club__missions.server.json",
  (j) => {
    const c = j.copy || j;
    if (c.play_one_arcade_game) c.play_one_arcade_game = "العب لعبة واحدة في صالة الألعاب";
    if (c.play_50_arcade_games) c.play_50_arcade_games = "العب 50 لعبة في صالة الألعاب";
  }
);
{
  const idxP = "content-packs/ar-001/games/burn-down-index.json";
  const idx = JSON.parse(read(idxP));
  const slug = "lib__arcade__club__missions.server";
  if (idx[slug]) {
    if (idx[slug].play_one_arcade_game)
      idx[slug].play_one_arcade_game = "العب لعبة واحدة في صالة الألعاب";
    if (idx[slug].play_50_arcade_games)
      idx[slug].play_50_arcade_games = "العب 50 لعبة في صالة الألعاب";
  }
  // also flat keys if mirrored
  for (const [k, v] of Object.entries(idx)) {
    if (typeof v === "string") {
      if (v === "العب لعبة صالة الألعاب واحدة") idx[k] = "العب لعبة واحدة في صالة الألعاب";
      if (v === "العب 50 لعبة صالة الألعاب") idx[k] = "العب 50 لعبة في صالة الألعاب";
    } else if (v && typeof v === "object") {
      for (const [kk, vv] of Object.entries(v)) {
        if (vv === "العب لعبة صالة الألعاب واحدة") v[kk] = "العب لعبة واحدة في صالة الألعاب";
        if (vv === "العب 50 لعبة صالة الألعاب") v[kk] = "العب 50 لعبة في صالة الألعاب";
      }
    }
  }
  write(idxP, JSON.stringify(idx, null, 2) + "\n");
}

// 6 — help monthly persistence
{
  const p = "data/help-center/ar-001/students.js";
  let t = read(p);
  t = t.replace(
    /كلما تدربت أكثر في الشهر، كلما قطعت رحلتك أبعد\. إنه يوضح مدى استمرارك في المضي قدمًا!/,
    "كلّما تدرّبت أكثر خلال الشهر، تقدّمت أكثر في رحلتك. هذا يُظهر مثابرتك!"
  );
  write(p, t);
}

// 9 — english vocab title
patchJson("content-packs/ar-001/books/english-page-skills.json", (j) => {
  if (j.grades?.g4?.vocab_family?.title) {
    j.grades.g4.vocab_family.title = "الأسرة — parents, work";
  }
});

console.log("linguistic batch done");
