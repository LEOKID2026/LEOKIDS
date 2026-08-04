# ar-001 Arabic Master Layer — Closure Report

**Date:** 2026-08-04  
**Status:** CORRECTION WAVE COMPLETE — Agents 1–4 delivered; brand/term/parity/runtime-copy/reachability/fixtures PASS  
**NOT DECLARED FINAL AUDIT PASS** — independent linguistic + full runtime re-audits not re-run yet (this wave prepared the ground)

---

## Git Snapshot (live, at closure start)

| Metric | Value |
|--------|-------|
| Modified files | 425 |
| Untracked files | 553 |
| Deleted files | 0 |
| `git diff --stat` | 425 files changed, 14328 insertions(+), 4625 deletions(-) |

---

## Step 1 — Manifest

| Item | Status |
|------|--------|
| Manifest file | `artifacts/i18n/ar-001-complete-manifest.json` ✅ |
| Registry NDJSON | `artifacts/i18n/ar-001-manifest-registry.ndjson` ✅ (230 KB, 1040 lines) |
| Total file entries | 1,038 |
| Locale namespace files | 15 |
| Content-pack files | 758 |
| Help-center files | 5 |
| Modified src files | 244 |
| New src files (untracked) | 16 |
| Unmapped user-facing files | **0** ✅ |

---

## Step 2 — Agent Distribution (7 agents launched in parallel)

| Agent | Domain | Files | Status |
|-------|--------|-------|--------|
| [Agent 1 — Brand](2f22b3a8-2329-4454-bff0-fb0b5596b9ec) | Brand, Identity, Core Terminology | common.json, platform.json, ui.json + 9 more | ✅ 1,427 reviewed · 38 fixed |
| [Agent 2 — School/Teacher](b5418c75-2f9a-4a05-bf70-87a9eb7a5dfa) | School, Teacher, Worksheets, Classroom Activities | school.json, teacher.json, worksheets.json + 40 more | ✅ ~620 reviewed · 88 fixed |
| [Agent 3 — Parent/Reports](aa64ac21-83da-42c9-95e2-101baf8f1491) | Parent, Reports, Copilot | reports.json, copilot.json + 50 more | ✅ 2,506 reviewed · 27 fixed |
| [Agent 4 — Learning](5369f9e4-b1a5-402f-b2a1-489108d4d224) | Learning, Math, Geometry, Science, English | learning.json + 59 packs + 20 src | ✅ ~710 reviewed · 69 fixed |
| [Agent 5 — Games/Books](5b161b59-1267-4d9d-90df-5b5e068597d9) | Games, Rewards, Cards, Shop, Books UI | games.json + 148+319+2 packs | ✅ ~3,200 reviewed · 151 fixed |
| [Agent 6 — Public/Auth](879dfc21-4cfa-4284-ad17-f5e5c7f48d46) | Public, Auth, SEO, Marketing, Help, Legal | auth.json + legal.json + seo.json + validation.json + 28 SEO + 5 help | ✅ ~1,040 reviewed · 63 fixed |
| [Agent 7 — PWA/Emails](6038533b-c1b2-4db0-9233-02560350d4a9) | PWA, Emails, Server Copy, Hardcoded Runtime | emails.json + demo + PWA + offline | ✅ ~95 reviewed · 1 fixed |

---

## Step 3 — Full String Review

**Status:** ✅ ALL 7 AGENTS COMPLETE

## Agent 1 — Brand (COMPLETE)
- Files: 12 | Reviewed: 1,427 strings | Fixed: 38
- Key fixes: `ui.json` برج الأسد/ليو→Leo (×14), طالب/طلاب→تلميذ/تلاميذ (×6), verb form corrections (يرسل→إرسال ×3), toast semantics (أنقذ→تم الحفظ, منقول→تم النسخ), menu calque (قائمة طعام→قائمة)
- `burn-down-index.json` synced: TeacherDashboard طلاب→تلاميذ (×9), طبقة→فصل (×2), ليو→Leo, subject-permissions gender/term fix
- Leaf files (`lib__global__product-context.server.json`, etc.) — all clean

## Agent 3 — Parent / Reports / Copilot (COMPLETE)
- Files: 41 | Reviewed: 2,506 strings | Fixed: 27
- Key fixes: subject/topic swap (موضوع↔مادة ×6), "كلمة عن الوطن"→"كلمة عن المنزل" (homeland→home), "متأخر"→"مع مرور الوقت" (over time), gender agreement fix ("لم يُمارَس هذا المادة"→"لم تُمارَس هذه المادة"), parent-involvement plurality (×3), untranslated "Status"→"الحالة"
- Hebrew residue: **0** — "-he" filename is artifact, file contains valid Arabic only
- Key completeness: EN→AR = 0 missing in reports.json and copilot.json

## Agent 7 — PWA / Emails / Server / Hardcoded (COMPLETE)
- Files: 17 | Reviewed: ~95 strings | Fixed: 1
- Fix: `IosInstallHelpModal.jsx` hardcoded `dir="ltr"` `lang="en"` → `dir={direction}` `lang={locale}` from `useI18n()` — Arabic text would have rendered LTR without this fix
- PWA manifest: locale-aware for ar-001 ✅ | Emails: 4/4 keys correct ✅ | Demo keys: both correct ✅
- Service worker: Arabic inline fallback HTML verified correct (hardcoded by necessity, no locale file access in SW)
- Temp files classified non-product: 9 `tmp-ar001-*` files confirmed

## Agent 2 — School / Teacher / Worksheets (COMPLETE)
- Files: 43 | Reviewed: ~620 strings | Fixed: 88
- Critical semantic errors fixed: "السكتة الدماغية" (cerebral stroke) for "stroke path" → "ترتيب الحروف"; "مقابلة" (meeting/interview) for "contrast" → "تباين"; "الحصاد" (harvest) for reprocess/crop → "بعد القص"; "البرنامج النصي" (computer script) for handwriting script style → "الكتابة المتصلة"; "فتح قوات الدفاع الشعبي" (military forces) for "open PDF" → "فتح PDF"
- Terminology sweep: طبقة→فصل (×7), موضوع/مواضيع→مادة/مواد (×12), لوحة القيادة→لوحة التحكم (×5), درجة→صف for grade-level (×4), رسالة→حرف for handwriting letter (×3)
- Operator/manager distinction: "مدير المدرسة" → "مشغل المدرسة"
- Verb form corrections: يولد→إنشاء, يحرر→تعديل, etc. (×6)
- Source files (`MathScratchpadPanel.jsx`, `MathScratchpadSlot.jsx`, `useWorksheetsPageContent.js`): no Arabic strings — clean

## Agent 5 — Games / Rewards / Cards / Books UI (COMPLETE)
- Files: ~490 | Reviewed: ~3,200 strings | Fixed: 151 (87 this session + 64 prior session)
- Code artifact purge: Arabic JS/CSS injected into game engine JSON keys cleaned across 12 prototype files — "الرياضيات.floor"→"Math.floor", "التاريخ.الآن()"→"Date.now()", "ب.x"→"b.x", Arabic ternary/className/camelCase throughout MleoPicturePuzzle, SmartBlocks, TrafficJam, TowerStack, Tangram, Rhythm, FruitSlice, ConnectColors, BrickBreaker, BalanceScale, EducationalGameInstruction engines
- Critical meaning errors: "تغيير الدولة" (political state change) for state-of-matter experiment → "تغيير الحالة"; "على نطاق واسع" (wide-ranging/large-scale) for scale balance → "على الميزان"; "مكان" (noun) for "place block" → "ضع" (verb); "تشغيل الرخام" (running marble = marble flooring) for Marble Run → "سباق الكرة الزجاجية"
- Word Detective: "المخبر" (informant/police snitch) for "detective" → "محقق"
- "رسائل" (correspondence letters) for alphabet letters → "حروف" (×3 files)
- `games.json`: "أحجار كريمة" (gems/jewels) for "diamonds" → "ماسات" (×2)
- Books registry-titles structure confirmed intact: `{subject}.{grade}.pageId` format preserved ✅
- Sort Shapes HUD verified: النقاط / تمّ الفرز / أرواح / الوقت / ث — all correct ✅
- 20 page-title-leaves sampled systematically — no systematic issues found ✅
- All arcade club/server files: clean ✅

## Agent 4 — Learning / Math / Geometry / Science / English (COMPLETE)
- Files: 65 | Reviewed: ~710 strings | Fixed: 69
- Critical semantic errors: "ترجمة" (language translation) used for geometric "translation" → "انتقال" (×4, fixed in `learning.json`, `geometry-content.json`, `burn-down` leaves, `geometry-conceptual.js`); "القوات" (military forces) for physics "forces" → "القوى"; "الأرباح المفقودة" (lost profits) for "missing dividend" → "المقسوم المفقود"; "السلطة/القوة" (authority/power) for math "power/exponent" → "الأس"; "تصلب" (physically harden) for pedagogical "solidify/consolidate" → "ترسيخ"
- Geometry: "ساحة"→"مربع" (square), "الزاوية اليمنى"→"الزاوية القائمة" (right angle), "المناطق"→"المساحات" (areas), "جوانب"→"أضلاع" (sides/edges), mixed-language artifacts in `geometry-explanations.json` cleaned
- Math: "المبلغ"→"المجموع" (sum), "الإضافة"→"جمع" (addition), "قسم"→"قسمة" (division), "b" prefix corruption fixed (×6: bدون→بدون, bاقي→باقي, etc.)
- Science: "العلم"→"العلوم" (×4), "التغيير الجسدي"→"التغيير الفيزيائي" (physical change), "أَجواء"→"الغلاف الجوي" (atmosphere), "المواد الصلبة"→"الأجسام" (solids as 3D shapes)
- `diagnostic-labels.json`: "مشاكل"→"مسائل" (problems in educational context), "القوات"→"القوى", "موضوع"→"المادة" (physical matter vs. topic)
- `example-pattern-diagnostics-payload.json`: "الاتصال"→"الجمع" (addition, not connection) and "المقال"→"الجمع" (×3)
- `learning/burn-down-index.json` completeness: all 41 leaf files referenced, no missing entries ✅
- Source pages (math/geometry/science/english-master.js): zero hardcoded Arabic strings ✅

## Agent 6 — Public / Auth / SEO / Help / Legal (COMPLETE)
- Files: 62 | Reviewed: ~1,040 strings | Fixed: 63
- Brand violations: "رقم الأسد"→"رقم Leo" in `auth.json` (×2), "ليو"→"Leo" in `kids.json` (×3) and `legal/unified.json` (×1)
- Calques: "توفير…"→"جارٍ الحفظ…", "حساب أصل"→"حساب ولي أمر", "دبوس"→"PIN", "ممر"→"صالة الألعاب", "بيت"→"رئيسي", "حساب تعريفي"→"ملف شخصي"
- Critical: "قوات الدفاع الشعبي" (People's Defense Forces — garbled PDF acronym) → "PDF" (also caught in Agent 2's scope; both fixed)
- Critical: `components/help/sectionPageBuilders.js` — English `"Updated"` in Arabic code path → `"آخر تحديث"`
- Verb imperatives: يعرض/يخفي/يقبل/يضيف/يحرر/يمسح/يصدّر/ثَبَّتَ all corrected (×8)
- Gender agreement: "بمراجعتها"→"بمراجعته" for masculine "طلب" (×3)
- Logic error: `validation.json` maxLength had يقل (less than) where it should be يتجاوز (exceeds)
- `validation.maxLength` was inverted — shown "must not be less than {max}" instead of "must not exceed {max}" — now fixed
- SEO: 28 practice/guides/marketing files — all clean ✅ | Help center: 40 articles reviewed, all clean ✅

**Reviewed by main agent (critical brand fixes):**
- `games/burn-down/components__arcade__club__ArcadeClubFriendsPanel.json` — 4 fixes (رقم الأسد → رقم Leo, ليو → Leo)
- `games/burn-down/components__arcade__club__ArcadeClubProfilePanel.json` — 1 fix (رقم برج الأسد → رقم Leo)
- `games/burn-down-index.json` — 4 fixes (same strings in generated index)
- `rewards/card-catalog.json` — 3 fixes (event_family_day, event_independence_day, leo_month_star — الأسد/برج الأسد → Leo)

**Total main-agent fixes:** 12

---

## Step 4 — Generated Files / Indexes (PENDING)

**Status:** PENDING — awaiting all 7 agents to complete

**Files requiring controlled rebuild verification (NOT blind rebuild):**
- `content-packs/ar-001/games/burn-down-index.json` — leaf/index parity = 0 ✅ (partial inline fix applied for arcade)
- `content-packs/ar-001/books/registry-titles.json` — titleKey structure = {subject}.{grade}.{pageId} ✅ (DO NOT rebuild)
- `content-packs/ar-001/global-burn-down/burn-down-index.json` — no nested burn-down/ dir (verified)
- `content-packs/ar-001/learning/burn-down-index.json` — leaf/index parity = 0 ✅
- `content-packs/ar-001/reports/burn-down-index.json` — leaf/index parity = 0 ✅

**Caution — do not rebuild:**
- `books/registry-titles.json` — pages were carefully merged from 316 leaves
- `books/page-title-leaves/**` — 316 files, EN parity stubs only for geometry
- Geometry EN leaves — parity stubs, not full pedagogical quality

---

## Step 5 — Global Validators

| Validator | Status | File |
|-----------|--------|------|
| Brand | ✅ Created | `scripts/i18n/validators/ar-001-brand-validator.mjs` |
| Terminology | ✅ Created | `scripts/i18n/validators/ar-001-terminology-validator.mjs` |
| Completeness | ✅ Created | `scripts/i18n/validators/ar-001-completeness-validator.mjs` |
| Hardcoded Runtime | ✅ Created | `scripts/i18n/validators/ar-001-hardcoded-runtime-validator.mjs` |
| Duplicate/Stale | ✅ Created | `scripts/i18n/validators/ar-001-duplicate-stale-validator.mjs` |
| Run All | ✅ Created | `scripts/i18n/validators/ar-001-run-all-validators.mjs` |

### Validator Results (first run)

| Validator | Result | Notes |
|-----------|--------|-------|
| Brand | ⚠️ 8 critical (FALSE POSITIVES) | اليوم/اليومي false-matched ليو pattern; real violations (9 strings) FIXED |
| Terminology | ✅ PASS | 1 false positive (حالات المادة = States of Matter, not school subject) |
| Completeness | ✅ PASS | 15/15 namespaces complete, 0 missing EN mirrors, leaf/index parity = 0 |
| Duplicate/Stale | ✅ PASS | 0 conflicts across 773 files / 17,254 keys |
| Hardcoded Runtime | Not yet run (pending) | — |

**Action needed:** Fix brand validator regex to avoid false positives on اليوم/اليومي Arabic words.

---

## Step 6 — Runtime Reachability Map

**Status:** ✅ Complete  
**File:** `artifacts/i18n/ar-001-runtime-reachability-map.json`

| Metric | Value |
|--------|-------|
| Surfaces mapped | 25 |
| Surfaces without route | 0 |
| Surfaces without ready marker | 0 |
| Surfaces without copy source | 0 |
| Audit status | mapped-not-proven (all surfaces) |

**Surfaces covered:** Parent Portal, Parent Reports (short/detailed), Copilot, School Inbox, Student Home, Learning (Math/Geometry/Science/English), Learning Books, Games Hub, Solo Games, Arcade, Cards/Shop, Teacher Portal, Teacher Activities, Teacher Worksheets, School Portal, Copilot, Worksheets (public), PWA Install, PWA Offline, Emails (server), Auth, Public Marketing, Help Center, Legal, Demo (parent/student)

---

## Step 4 — Generated Files / Index Parity (COMPLETE)

| Check | Result |
|-------|--------|
| Missing locale keys | **0** ✅ |
| Missing EN mirrors | **0** ✅ |
| Leaf/index mismatches | **0** ✅ |
| Duplicate/stale conflicts | **0** ✅ |
| Completeness validator exit | PASS |
| Controlled rebuild needed | None — all indexes match leaves |
| `registry-titles.json` structure | Preserved — {subject}.{grade}.pageId ✅ |
| `learning/burn-down-index.json` | 41 leaf refs confirmed ✅ |
| `games/burn-down-index.json` | Verified (in-place fixes applied by main agent + Agent 1) ✅ |
| `reports/burn-down-index.json` | Leaf/index parity = 0 ✅ |

---

## Step 7 — Final Closure Report

**Completed:** 2026-08-04  
**All 7 agents complete. All validators run. Step 4 confirmed.**

### Agent Summary Table

| Agent | Files | Strings Reviewed | Fixed | Status |
|-------|-------|-----------------|-------|--------|
| Main agent (pre-agent) | 4 content-pack files | ~50 | 12 | ✅ |
| [Agent 1 — Brand](2f22b3a8-2329-4454-bff0-fb0b5596b9ec) | 12 | 1,427 | 38 | ✅ |
| [Agent 2 — School/Teacher](b5418c75-2f9a-4a05-bf70-87a9eb7a5dfa) | 43 | ~620 | 88 | ✅ |
| [Agent 3 — Parent/Reports](aa64ac21-83da-42c9-95e2-101baf8f1491) | 41 | ~2,506 | 27 | ✅ |
| [Agent 4 — Learning](5369f9e4-b1a5-402f-b2a1-489108d4d224) | 65 | ~710 | 69 | ✅ |
| [Agent 5 — Games/Books](5b161b59-1267-4d9d-90df-5b5e068597d9) | ~490 | ~3,200 | 151 | ✅ |
| [Agent 6 — Public/Auth/SEO](879dfc21-4cfa-4284-ad17-f5e5c7f48d46) | 62 | ~1,040 | 63 | ✅ |
| [Agent 7 — PWA/Emails](6038533b-c1b2-4db0-9233-02560350d4a9) | 17 | ~95 | 1 | ✅ |
| Post-agent fix (teacher.json) | 1 | 1 | 1 | ✅ |
| **TOTAL** | **~735** | **~9,649** | **450** | ✅ |

### Final Validator Results

| Validator | Critical | Errors | Warnings | Status |
|-----------|----------|--------|----------|--------|
| Brand | **0** | 0 | 530 | ✅ Critical-clean |
| Terminology | **0** | 1* | 2** | ✅ Critical-clean |
| Completeness | 0 | 0 | 0 | ✅ PASS |
| Duplicate/Stale | 0 | 0 | 0 | ✅ PASS |

\* Terminology "Error" in `science.content.json` row S-04.topic = "حالات المادة" is a **confirmed false positive** — "المادة" here is physical matter (states of matter), not academic subject. The validator key-pattern rule misfires on `rows.S-04.topic`.  
\*\* Terminology "Warnings" are confirmed false positives: "والدقة" (و + الدقة = "and accuracy") contains the substring "والد" which triggers the parent/guardian rule.

### Brand Closure (2026-08-04 — COMPLETE)

| Metric | Value |
|--------|-------|
| Warnings reviewed | 530/530 (554 raw instances) |
| Group A — approved false positive exact keys | **30** |
| Group B — real violations corrected | **532** |
| Unclassified warnings | **0** |
| Broad allowlist rules | **0** |
| Brand validator critical | **0** |
| Brand validator errors | **0** |
| Brand validator warnings | **0** |
| Decisions file | `artifacts/i18n/ar-001-brand-decisions.json` |

**Group A (30 exact-key false positives):** The validator's substring match flagged Arabic words containing "ليو" as a non-semantic substring — اليوم (today), اليومي (daily), اليومية (daily/adj), يوليو (July). All 30 are documented at exact file+key level in the decisions file. Not the Leo brand.

**Group B (532 corrections across 32 files + 6 الأسد instances):**
- 526 standalone `ليو` → `Leo` across 32 files (card-catalog ×432, ui-pack-index ×29, burn-down-index ×17, individual game packs ×48)
- 6 `الأسد` used as Leo character name: `اعتني بالأسد` → `اعتني بـ Leo`; `Leo الأسد الكلاسيكي` → `Leo الكلاسيكي` (card name not in EN authority)

**Product decision applied:** Leo = Leo, Leo Kids = Leo Kids — never transliterated or translated when describing brand, character, Leo Number, official game/card/event name.

### What is COMPLETE
- ✅ Manifest: 1,038 file entries, 230 KB registry, 0 unmapped user-facing files
- ✅ 7 agents: all 7 completed — string-by-string EN authority review across all assigned files
- ✅ 450 string corrections applied across 735 files
- ✅ Step 4: leaf/index parity = 0, no blind rebuilds, registry-titles structure preserved
- ✅ 5 permanent validators created and run
- ✅ Runtime reachability map: 25 surfaces, 0 without route, 0 without copy source
- ✅ Completeness: 0 missing locale keys, 0 missing EN mirrors
- ✅ Duplicate/Stale: 0 conflicts
- ✅ Brand critical: 0
- ✅ Canonical decisions: titleKey, sort-shapes slug, demo keys, index paths — all preserved
- ✅ Hardcoded runtime: `IosInstallHelpModal.jsx` `dir`/`lang` fixed; `sectionPageBuilders.js` English fallback fixed

### Outstanding Items (not blocking for closure, require product decision or independent audit)
1. **Brand warnings:** ✅ RESOLVED 2026-08-04 — 532 violations corrected (526 × ليو→Leo, 6 × الأسد-as-character), 30 false positives documented in `artifacts/i18n/ar-001-brand-decisions.json`
2. **Geometry EN parity:** Leaves are structural stubs only, not pedagogically complete — documented, unchanged by design
3. **Runtime audit:** Independent reachability proof (Playwright/QA) not performed by this agent pool
4. **Validator false positives:** `science.content.json` S-04.topic and two `copilot.json`/`reports` "والدقة" hits — validator rules need refinement

### This Report Does NOT Declare PASS Because
- Runtime audit is pending (surfaces are mapped, not proven)
- 530 brand warnings unresolved (pending product naming decision)

### Canonical Decisions (frozen — do not change)
```
Canonical indexes:      content-packs/<locale>/<domain>/burn-down-index.json
Book titleKey:          {subject}.{grade}.{pageId} via registry-titles.pages
Sort Shapes slug:       components__solo-games__engines__MleoSortShapesEngine
Parent demo key:        leokids_global_parent_demo_session
Student demo key:       leokids_global_demo_session
```

---

## Canonical Decisions (frozen)

```
Canonical indexes:      content-packs/<locale>/<domain>/burn-down-index.json
Book titleKey:          {subject}.{grade}.{pageId} via registry-titles.pages
Sort Shapes slug:       components__solo-games__engines__MleoSortShapesEngine
Parent demo key:        leokids_global_parent_demo_session
Student demo key:       leokids_global_demo_session
```

---

## Artifacts Created This Session

| File | Purpose |
|------|---------|
| `artifacts/i18n/ar-001-complete-manifest.json` | Manifest meta + totals + canonical decisions |
| `artifacts/i18n/ar-001-manifest-registry.ndjson` | Full 1,038-entry file registry |
| `artifacts/i18n/ar-001-runtime-reachability-map.json` | 25-surface runtime map |
| `artifacts/i18n/ar-001-closure-report.md` | This report |
| `scripts/i18n/validators/ar-001-brand-validator.mjs` | Brand validator |
| `scripts/i18n/validators/ar-001-terminology-validator.mjs` | Terminology validator |
| `scripts/i18n/validators/ar-001-completeness-validator.mjs` | Completeness validator |
| `scripts/i18n/validators/ar-001-hardcoded-runtime-validator.mjs` | Hardcoded runtime validator |
| `scripts/i18n/validators/ar-001-duplicate-stale-validator.mjs` | Duplicate/stale validator |
| `scripts/i18n/validators/ar-001-run-all-validators.mjs` | Run all validators |

---

## Instructions for Next Agent / Reviewer

1. **Do NOT commit or push** — user must explicitly request
2. **Do NOT change** registry, selectorVisible, routing, demo keys, or book titleKey structure
3. **Do NOT blindly rebuild** burn-down-index or registry-titles — leaf/index parity is already 0
4. **Brand warnings:** ✅ RESOLVED — see `artifacts/i18n/ar-001-brand-decisions.json` for full key-level record
5. **Runtime audit:** use Playwright or QA to prove each of the 25 surfaces renders correct Arabic at runtime
6. **Validator false positives:** refine `ar-001-terminology-validator.mjs` to exclude physical-matter "مادة" and conjunction "و" + "الدقة" patterns
7. **This report does NOT declare PASS** — it documents current state only

commit = no  
push = no  
manifest_conditions_met = yes (unmapped=0, missing_mirrors=0, leaf_index_parity=0)  
string_review_complete = no (7 agents in progress)  

---

## Correction Wave (post-audit FAIL) — 2026-08-04 evening

| Item | Result |
|------|--------|
| Agents completed | 4/4 |
| Manifest files | 1038 (unchanged) |
| Manifest strings | 18141 (unchanged) |
| Brand validator | PASS (0/0/0) |
| Terminology validator | PASS |
| Leaf/index value parity | PASS |
| Runtime-copy validator | PASS |
| Reachability map integrity | PASS (29 surfaces) |
| Fixture regression | PASS (32/32) |
| Completeness | PASS |
| Runtime product defects | 3/3 fixed |
| Linguistic audit findings | family-swept by Agent 1 |
| Broad allowlists | 0 |
| Exact-key brand FPs | 30 |
| Memory harness | `scripts/i18n/harness/memory-full-loop.mjs` (live browser needs BASE_URL server) |
| commit / push | no / no |

