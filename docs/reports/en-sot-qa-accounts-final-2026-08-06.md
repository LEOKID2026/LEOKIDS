# English SoT — QA accounts + real-login crawl (final)

**Date:** 2026-08-06  
**Status:** **PASS**  
**Artifacts:** `docs/reports/en-sot-qa-roles-crawl.json`, `docs/qa/GLOBAL_EN_QA_ACCOUNTS.md`

---

## 1. מה נוצר / תוקן

- נוצר סקריפט פרוביז׳ן: `scripts/qa/provision-global-en-qa-accounts.mjs`
- נפתחו/עודכנו חשבונות QA קבועים (סיסמת email לכולם: `747975`)
- נתוני fixtures באנגלית בלבד: QA Parent / QA Student / QA Teacher / LEO Global QA School / Grade 3 - Global QA
- **תיקון קריטי:** Student/Staff PIN חייב להיות **4 ספרות** (API דוחה PIN באורך אחר) → `7479` (לא הסיסמה `747975`)
- עודכן `.env.e2e.local` + מסמך QA
- בוצע crawl real-login ל־Parent / Student / Teacher / School — **0 Hebrew** ב־UI וב־API

---

## 2. חשבונות שעובדים

| Role | Email | Password | Login path | סטטוס |
|---|---|---|---|---|
| ADMIN | `eran@leokids.com` | `747975` | Admin portal | תקין (מחוץ ל־English SoT) |
| Parent | `eran1@leokids.com` | `747975` | `/parent/login` | עובד |
| Private Teacher | `eran2@leokids.com` | `747975` | `/teacher/login` | עובד |
| School Manager | `eran3@leokids.com` | `747975` | `/teacher/login` → `/school/dashboard` | עובד |
| School staff (אופציונלי) | code `leoq-t0001` | PIN `7479` | `/school/staff/login` | עובד |

---

## 3. Student username / PIN

```text
Student username: qa-student
Student PIN: 7479
```

הערה: סיסמת email של ההורים/מורים/בי״ס נשארת `747975`. PIN של תלמיד/staff חייב 4 ספרות לפי ה־API.

---

## 4. Env שעודכנו (`.env.e2e.local`)

```env
E2E_PARENT_EMAIL=eran1@leokids.com
E2E_PARENT_PASSWORD=747975

E2E_STUDENT_USERNAME=qa-student
E2E_STUDENT_PIN=7479

TEACHER_PORTAL_VERIFY_EMAIL=eran2@leokids.com
TEACHER_PORTAL_VERIFY_PASSWORD=747975

E2E_SCHOOL_EMAIL=eran3@leokids.com
E2E_SCHOOL_PASSWORD=747975

E2E_SCHOOL_STAFF_CODE=leoq-t0001
E2E_SCHOOL_STAFF_PIN=7479
```

תיעוד ידני: `docs/qa/GLOBAL_EN_QA_ACCOUNTS.md`

---

## 5. תוצאות login לפי role

| Role | Real UI login | נחיתה |
|---|---|---|
| Parent | OK | `/parent/dashboard` (+ worksheets, parent-report) |
| Student | OK | `/student/home` (+ cards, profile) |
| Teacher | OK | `/teacher/dashboard` + `/teacher/class/{id}` |
| School | OK | `/school/dashboard` (+ students, teachers); staff path OK |

Teacher: `preferredLanguage=en`, displayName=`QA Teacher`, class=`Grade 3 - Global QA`

---

## 6. Hebrew scan לפי role

| Role | UI routes Hebrew | APIs Hebrew |
|---|---|---|
| Parent | 0 | 0 |
| Student | 0 | 0 |
| Teacher | 0 | 0 |
| School | 0 | 0 |

Admin לא נכלל בבדיקת English SoT הציבורית (עברית מותרת שם).

---

## 7. סטטוס סופי

**PASS**

```text
English global product is fully Hebrew-clean across public, demo, parent, student, teacher, school, APIs and runtime UI. English may be used as Source of Truth.
```

לא בוצעו commit / push.
