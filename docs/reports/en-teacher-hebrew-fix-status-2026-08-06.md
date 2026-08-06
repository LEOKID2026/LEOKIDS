# English Teacher Hebrew data fix + re-verification

**Date:** 2026-08-06  
**Scope:** Teacher DB/API/UI English sanitization only (no other languages)

---

## 1. מה תוקן

עודכנו ב־DB (Supabase learning) עבור `teacher@leo.com`:

| שדה | לפני | אחרי |
|---|---|---|
| `teacher_profiles.display_name` | `מורה LEO` | `LEO Teacher` |
| `teacher_profiles.preferred_language` | `he` | `en` |
| `teacher_classes.name` | `כיתה ג׳ - LEO` | `Grade 3 - LEO` |
| 20 × `students.full_name` | שמות עבריים (נועה כהן, איתי לוי, …) | שמות אנגליים (Noah Cohen, Emma Levy, …) |

סה״כ **22** עדכונים ב־DB.

---

## 2. קבצים / seed / API שהשתנו

### DB (runtime data — מקור הכשל)
- `teacher_profiles` (display_name, preferred_language)
- `teacher_classes` (name)
- `students` (full_name) — תלמידי הסימולציה של המורה

### Scripts (כדי למנוע חזרה לעברית)
- **נוסף:** `scripts/teacher-portal/sanitize-leo-teacher-english-data.mjs`
- **עודכן:** `scripts/teacher-portal/rename-simulation-students.mjs` — כבר לא מכוון לשמות עבריים; אנגלית בלבד

### Content pack EN (יישור duplicate-hide label)
- `content-packs/en/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json` — `class_3_leo` → `Grade 3 - LEO`
- `content-packs/en/global-burn-down/burn-down-index.json` — אותו מפתח

לא שונו: UI components, locales אחרים, Admin.

---

## 3. תוצאות API אחרי התיקון

מתוך `docs/reports/en-teacher-sanitize-reverify.json` + dump:

| Endpoint | status | Hebrew | הערות |
|---|---|---|---|
| `/api/teacher/me` | 200 | **0** | `displayName=LEO Teacher`, `preferredLanguage=en` |
| `/api/teacher/classes` | 200 | **0** | `Grade 3 - LEO` |
| `/api/teacher/dashboard` | 200 | **0** | — |
| `.../report-data` | 200 | **0** | — |

Idempotent dry-run אחרי התיקון: **Changes: 0**.

---

## 4. תוצאות runtime אחרי התיקון

| route | Hebrew in body/HTML |
|---|---|
| `/teacher/dashboard` | **0** |
| `/teacher/class/eb24c41d-…` | **0** |

---

## 5. Parent / Student / School real login

| Role | Result | Reason |
|---|---|---|
| **Teacher** | ✅ | UI + API נקיים מעברית |
| **Parent real** | ❌ blocked | `E2E_PARENT_*` → Supabase `Invalid login credentials` |
| **Student real** | ❌ blocked | `E2E_STUDENT_*` → API `Incorrect username or PIN` (401) |
| **School real** | ❌ blocked | אין `SCHOOL_QA_PASSWORD` / `DEMO_TEACHER_PASSWORD` / `E2E_SCHOOL_PASSWORD` ב־env |

Demo student/parent (סשן דמו) נבדקו בעבר כנקיים מעברית, אבל לפי הדרישה הנוכחית **אין PASS בלי real login תקין**.

מה חסר ל־PASS:
1. Parent credentials תקינים ב־`.env.e2e.local` (או seed מחדש ל־`E2E_PARENT_EMAIL`)
2. Student username/PIN תקפים (כרגע שגויים מול DB)
3. סיסמת school staff ב־env + משתמש `school@leo-k.com` (או מקביל)

---

## 6. סטטוס סופי

# **BLOCKED**

### למה לא PASS
- Teacher EN (הכשל המקורי) — **תוקן ועבר**.
- Parent / Student / School real flows — **לא הושלמו** בגלל credentials/env.

### למה לא FAIL
- לא נמצאה עברית ב־Teacher UI/API אחרי התיקון.
- אין ממצא עברית חדש בנתיבים שנבדקו כעת.

### האם English SoT?
**עדיין לא.** מותר להכריז SoT רק אחרי השלמת parent/student/school real crawls (או סביבת seed עם credentials תקינים) ואימות חוזר ל־0 Hebrew.

### הצעד הבא המומלץ
1. לספק/לתקן credentials ל־parent, student, school  
2. להריץ crawl ממוקד ל־3 התפקידים  
3. רק אז — Pass/SoT gate
