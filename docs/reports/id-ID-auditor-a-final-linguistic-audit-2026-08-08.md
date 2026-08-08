# Indonesian Master — Final Linguistic Audit (Independent Auditor A)

**Date:** 2026-08-08  
**Auditor:** Independent Auditor A — Indonesian Master Final Linguistic & Visible-Language Audit  
**Mode:** READ-ONLY (no fixes, no build, no commit/push, no sub-agents)

**Method:** Static inventory of all id-ID layers (15 namespaces, Help, public-seo, content-packs, learning books, word meanings, portals) + focused scans (Hebrew Unicode, identical EN↔ID, Anda/kamu, Kelas/rombel/Fase, hardcoded chrome) + manual semantic classification. Priority residual from Phase 9B-5 note: arcade club decorative/hardcoded strings.

**Artifacts:** `artifacts/id-ID-auditor-a-final-linguistic/**`

---

```text
Indonesian Master — Final Linguistic Audit

AUDIT RESULT = FAIL

Hebrew visible findings = 0
Unexplained English visible findings = many (see findings; not zero)

BLOCKER = 8
HIGH = 9
MEDIUM = 4
LOW = 3

REGISTER

Child kamu defects = 0
Adult Anda defects = 3
Mixed-register defects = 1

TERMINOLOGY

murid defects = 0
guru defects = 0
orang tua / wali murid defects = 0
Kelas defects = 3
rombel defects = 0 (school/teacher namespaces generally correct; shell/platform drift)
laporan / rapor defects = 0
other terminology defects = 2 (Streak/Timer/Reset UI chrome; Parent Copilot brand mix)

ENGLISH SUBJECT

Intentional English-learning retained correctly = YES
English subject chrome leakage = 0 (namespaces/packs; books instructional chrome OK)
Broad English fallback defects = 0 (word-meanings wired; resolveEnglishWordMeaning id-ID OK)

SURFACES

Public/marketing = PASS (representative namespace/UI chrome Indonesian)
Help = PASS (data/help-center/id-ID; no EN/HE token hits)
SEO = PASS (seo namespace + public-seo packs; no mixed prose hits)
Parent = FAIL (hardcoded English validation/errors in parent components)
Student = FAIL (arcade hub + club + multiplayer screens)
Teacher = FAIL (class report + worksheet grading chrome hardcoded English)
School = FAIL (visible English error fallbacks on failure paths)
Guardian = PASS (no comparable hardcoded prose cluster found)
Arcade = FAIL (primary residual; packs exist but components hardcode EN)
Demo/Public = PARTIAL (demo pack copy used in places; arcade/demo chrome still EN)
Learning Books = PASS (450 product drafts; HE only in drafts README notes — not runtime UI)
Math/Geometry = PASS (prior Phase7 + residue scan: unexplained EN prose sample 0)
Science = PASS (overlay wired; no product HE)
Writing = PASS (prior Phase7 wiring; no new defects found)
Word Meanings = PASS (745; senses orange/cold/mouse correct; router id-ID wired)
Games/Rewards = PARTIAL (games.json Indonesian; arcade runtime chrome FAIL)
Reports = PASS (reports namespace + reports pack)

API visible-language regression = PASS (Phase 9B-5 code-first path; no new raw-API consumer reopen found in this linguistic pass)
Hardcoded non-localized chrome findings = YES (arcade club + arcade hub + teacher class report + parent assign modal + school error fallbacks)

Findings list =
[ID-A-001 | BLOCKER | Arcade club | components/arcade/club/ArcadeClubFriendsPanel.jsx | Friends / My Leo number / Add friend / Approve / Decline / … | Hardcoded English UI despite Indonesian games burn-down keys existing | Wire all visible strings via gamePackCopy / t(); use existing id-ID pack leaves | Student/Arcade API/UI]
[ID-A-002 | BLOCKER | Arcade club | components/arcade/club/ArcadeClubProfilePanel.jsx | Player card / Game name / Recent history / Save name / … | Hardcoded English; id-ID profile pack already translated | Wire via gamePackCopy | Student/Arcade API/UI]
[ID-A-003 | BLOCKER | Arcade club | components/arcade/club/ArcadeClubEventsPanel.jsx + ArcadeClubMissionsPanel.jsx + ArcadeClubShopPanel.jsx + ArcadeTabNav.jsx + ArcadeLobbyHeader.jsx + ArcadeGuestUpgradeBanner.jsx + ArcadeInviteBanner.jsx | Daily event / Today's missions / Card shop / Games·Friends·Shop·Profile / Coins·Diamonds / Upgrade to a Leo profile… / Accept·Decline | Hardcoded English decorative + action chrome on /id student arcade | Localize all user-visible labels/actions | Student/Arcade API/UI]
[ID-A-004 | BLOCKER | Student arcade hub | pages/student/arcade.js | Quick match / Create public room / Create private room / Active / Unavailable / Open rooms / Waiting for another player / Not enough coins / Selected game / Entry amount; guestLocked shows raw key ui.student.guestGameLockLabel | Substantial English hub chrome; guest lock uses i18n key constant as visible text instead of t() | Replace with t()/games keys; t(GUEST_GAME_LOCK_LABEL_KEY) | Student/Arcade API/UI]
[ID-A-005 | BLOCKER | Arcade games | components/arcade/{bingo,chess,checkers,dominoes,placeholder}/** | How to play / Wait for your turn / Game in progress / Could not load the room / … | Hardcoded English in-game chrome on normal multiplayer paths | Localize via games pack / burn-down | Student/Arcade API/UI]
[ID-A-006 | BLOCKER | Teacher | pages/teacher/class/[classId].js | Class summary / Class performance by subject / Topics that need reinforcement / Suggested support groups / … | Large hardcoded English report chrome; global-burn-down only covers 4 keys for this page | Move headings/body to burn-down or teacher namespace and consume via globalBurnDownCopy/t | Teacher/School/Guardian API/UI]
[ID-A-007 | BLOCKER | Parent | components/parent/AssignActivityModal.js | Choose a grade… / Enter the number of questions / Generate questions first / … | Hardcoded English validation messages on parent activity assign | Map to ui.parent / validation keys | Parent API/UI]
[ID-A-008 | BLOCKER | Parent | components/parent/ParentSentActivitiesPanel.jsx | Could not load results | Hardcoded English error fallback | Code-first localized parent error | Parent API/UI]

[ID-A-009 | HIGH | Games pack residual | content-packs/id-ID/games/burn-down*/… ArcadeClubFriendsPanel setting_up_your_leo_number | Setting up your Leo number… | Pack leaf left in English (even if wired later) | Translate to Indonesian (e.g. Menyiapkan nomor Leo kamu…) | Games/Rewards/Demo]
[ID-A-010 | HIGH | Teacher | pages/teacher/**/worksheets/**/grade/** + worksheets/new.js | Saved and marked as reviewed / Progress saved / Please select at least one student / Activity mode / Not signed in | Hardcoded English status/validation on teacher worksheet flows | Localize via burn-down/teacher namespace | Teacher/School/Guardian API/UI]
[ID-A-011 | HIGH | School | pages/school/{classes,students,messages,activities,operators,teachers}/** | Error loading report/data/messages/children / Failed to load / Failed to update permissions | English fallbacks remain user-visible on error paths despite apiErrorMessageHe | Ensure code-first + Indonesian fallback only | Teacher/School/Guardian API/UI]
[ID-A-012 | HIGH | Register (adult) | locales/id-ID/worksheets.json publicFullSystemNote | Di portal orang tua lengkap kamu bisa… | Adult parent marketing/chrome uses kamu | Use Anda | Namespace]
[ID-A-013 | HIGH | Register (adult) | locales/id-ID/worksheets.json coloringUploadPrivacyTitle (+ related parent-facing kamu quota strings) | Privasi kamu penting / Kamu punya… | Parent/adult coloring upload chrome uses child register | Use Anda for adult-facing coloring upload | Namespace]
[ID-A-014 | HIGH | Kelas vs rombel | locales/id-ID/ui.json teacherShell.myClasses / classReportTitle | Kelas saya / Laporan kelas | Teacher shell titles for physical class groups should be rombel terminology (burn-down already uses Laporan rombel) | Kelas saya → Rombel saya (or Rombongan belajar saya); Laporan kelas → Laporan rombel | Namespace]
[ID-A-015 | HIGH | Kelas vs rombel | locales/id-ID/platform.json school_class_archived / school_class_viewed / viewed_class_report / classActivity | Kelas diarsipkan / Laporan kelas dilihat / Aktivitas kelas | School class audit events refer to physical/admin class but use Kelas | Prefer rombel / rombongan belajar | Namespace]
[ID-A-016 | HIGH | Learning UI chrome | locales/id-ID/learning.json master.* | Timer / Streak / Reset / Horizontal / Default / Avatar (several) | Unexplained English UI labels identical to EN (not English-learning targets) | Translate: Timer→Pengatur waktu/Waktu; Streak→Beruntun; Reset→Atur ulang; etc. (keep Avatar if intentional loanword) | Namespace]
[ID-A-017 | HIGH | Teacher discussion | pages/teacher/class/[classId]/discussion/new.js | Could not load class / This class grade level is invalid… | Hardcoded English errors | Localize | Teacher/School/Guardian API/UI]

[ID-A-018 | MEDIUM | Register mixed | locales/id-ID/validation.json api.session_expired + ui.student.errors.sessionExpired | Sesi kamu berakhir… | Shared API/student string uses kamu; may surface on adult flows via shared maps | Split adult Anda vs student kamu | Namespace]
[ID-A-019 | MEDIUM | Register | locales/id-ID/worksheets.json answerKeySeparate | …saat kamu memintanya | Worksheet chrome commonly adult; kamu awkward | Anda if adult-only surface | Namespace]
[ID-A-020 | MEDIUM | Brand mix | locales/id-ID/ui.json language.reportHint | …Parent Copilot… | English product name embedded in Indonesian adult UI sentence | Keep brand if intentional, or “Copilot orang tua” | Namespace]
[ID-A-021 | MEDIUM | School status loanword | locales/id-ID/school.json Status | Status | Identical EN UI label; Indonesian often uses Status as loanword — borderline | Prefer Status (loanword OK) or Keadaan if product wants full ID | Namespace]

[ID-A-022 | LOW | Intentional identical | games arcadeTitles / Email / Leo Kids / Bingo / Ludo / Connect Four | various | Brand/proper/loanword — not defects | No change | Games/Rewards/Demo]
[ID-A-023 | LOW | English subject topics | reports/learning grammar_present_simple etc. | Present simple / Past simple | Intentional English-learning topic labels | Retain | Learning]
[ID-A-024 | LOW | Docs-only Hebrew | docs/learning-book/id-ID/**/drafts/README.md | Hebrew draft notes | Not product runtime UI | Leave / cleanup docs later | Learning Books]

Files modified = 0
Build = not run
Commit = not created
Push = not performed
API/background/sub-agents used = 0

FINAL LINGUISTIC AUDIT = FAIL
```

---

## Evidence notes (classification)

### What is in good shape
- **15/15 namespaces** present; **missing keys = 0**, **empty values = 0** vs EN.
- **Hebrew in product locales / content-packs / help / curriculum = 0.**
- Learning-book **450** files: **product Hebrew = 0**; unexplained EN prose sample on MGS = **0** (README draft Hebrew notes only).
- Word meanings: **oranye / jeruk / tikus / mouse komputer / dingin / pilek**; router **id-ID** wired.
- School/teacher **namespaces** generally distinguish **Kelas** vs **rombel** well; product grades **Kelas 1–6**; no **Fase A/B/C** product labels found.
- Phase **9B-5 API** code-first path for mapped errors remains linguistically closed in this pass.

### Primary Master blockers
1. **Hardcoded English arcade chrome** (club + hub + in-game) — exactly the residual class Phase 9B-5 warned about; Indonesian burn-down leaves often already exist but JSX does not consume them.
2. **Teacher class report** and **parent assign-activity** hardcoding — adult portal English on normal `/id` paths.
3. Guest arcade badge renders **raw i18n key** `ui.student.guestGameLockLabel` instead of `t(...)`.

### Severity policy applied
- **BLOCKER** = substantial English visible on normal product paths (arcade/teacher/parent).
- **HIGH** = clear untranslated pack leaf, adult register kamu, Kelas/rombel shell misuse, school English error fallbacks.
- **MEDIUM/LOW** = borderline loanwords, mixed brand, docs-only Hebrew (not counted in Hebrew visible = 0).

PASS criteria require **Hebrew=0 AND unexplained English=0 AND BLOCKER/HIGH/MEDIUM=0**. This audit fails on unexplained English and remaining HIGH/MEDIUM/BLOCKER findings.
