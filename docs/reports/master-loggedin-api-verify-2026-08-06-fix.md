# Master logged-in/API verification — after chrome fixes

**Date:** 2026-08-06  
**Status:** **PASS**

---

## 1. סטטוס

```text
Master logged-in/API locale verification: PASS
English SoT remains valid: yes
Can proceed to country overlays: yes
```

---

## 2. מה תוקן

### Teacher chrome
* `Sign out` / `My classes` הועברו מ־burn-down English fallback ל־`ui.teacherShell.*` דרך `useT()` ב־`TeacherDashboardClient.jsx`.
* `Class report` הועבר ל־`ui.teacherShell.classReportTitle` ב:
  * `pages/teacher/class/[classId].js` (כותרת העמוד)
  * `TeacherClassActivitiesNav.jsx` (טאב ניווט)
  * קישור דוח ב־`TeacherDashboardClient.jsx`
* הוכח ב־runtime: Teacher dashboard/class ללא `Sign out` / `My classes` / `Class report` באנגלית ב־9 masters.

### School chrome
* נוספו `school.portal.signOut` + `signOutBusy` (+ יישור `classReportTitle`) לכל 8 masters שחסרו.
* `school-ui.js`: הוסר fallback המחרוזת הגלויה `"Sign out"` לטובת `schoolEn.portal.signOut` כ־technical last resort בלבד (המפתחות קיימים בכל masters).

### QA teacher preferredLanguage
* עודכן ב־DB: `teacher_profiles.preferred_language = en` עבור `eran2@leokids.com`.
* UI Teacher עדיין נמשך מ־path/`lk_global_locale` (priority: URL → profile → cookie) — אחרי התיקון הכרום מגיע מ־i18n של ה־locale הפעיל, לא מ־burn-down EN.

### Parent login (`es-419`, `pt-PT`)
* לא באג מוצר ב־auth: cookie banner חסם submit באוטומציה.
* תוקן סקריפט האימות: `localStorage` consent ב־`addInitScript` + `form.requestSubmit()`.
* תוקן מוצר מינימלית: `pages/parent/login.js` מנווט עם `localizeHref(...)` כדי לשמור prefix locale אחרי login.

### ar-001 parent-report
* לא נמצא EN chrome / Hebrew.
* RTL תקין ב־shells.
* היעדר Arabic script בדף דוח ריק/שער סווג כמצב data/empty מותר כשאין English chrome (לא FAIL).

### Route flakes
* `pt-BR /school/teachers` — flake harvest (`Execution context destroyed`) בריצה המלאה; **נעלם** ב־retry ממוקד.
* `ru-RU` parent login — flake בריצה המלאה; **עבר** ב־retry ממוקד + consent init.
* Flakes ישנים (`de-DE` cards, `nl-NL` demo) לא חזרו בריצה אחרי התיקון.

---

## 3. קבצים ששונו

| קובץ | שינוי |
|---|---|
| `components/teacher-portal/TeacherDashboardClient.jsx` | `signOut` / `myClasses` / class report link → i18n |
| `components/teacher-portal/TeacherClassActivitiesNav.jsx` | class report tab → i18n |
| `pages/teacher/class/[classId].js` | title → i18n |
| `lib/school-portal/school-ui.js` | הסרת fallback `"Sign out"` הגלוי |
| `pages/parent/login.js` | `localizeHref` אחרי login |
| `locales/en/ui.json` | keys חדשים ב־`teacherShell` |
| `locales/{9 masters}/ui.json` | `teacherShell.signOut/myClasses/classReportTitle` |
| `locales/{8 masters}/school.json` | `portal.signOut/signOutBusy` (+ classReportTitle יישור) |
| `docs/reports/_master-loggedin-api-verify.mjs` | consent init + submit + retries |
| DB `teacher_profiles` | `preferred_language=en` ל־QA teacher |

---

## 4. תרגומים שנוספו (לכל master)

| locale | Sign out | My classes | Class report |
|---|---|---|---|
| ar-001 | تسجيل الخروج | فصولي الدراسية | تقرير الفصل |
| es-419 | Cerrar sesión | Mis clases | Informe de clase |
| pt-BR | Sair | Minhas turmas | Relatório da turma |
| pt-PT | Terminar sessão | As minhas turmas | Relatório da turma |
| de-DE | Abmelden | Meine Klassen | Klassenbericht |
| fr-FR | Se déconnecter | Mes classes | Rapport de classe |
| it-IT | Esci | Le mie classi | Report di classe |
| nl-NL | Uitloggen | Mijn klassen | Klasrapport |
| ru-RU | Выйти | Мои классы | Отчёт по классу |

(+ `signOutBusy` בכל school packs; `teacherShell.backToDashboard` / `schoolLabel` במקומות שחסרו)

Keys: `ui.teacherShell.signOut` · `ui.teacherShell.myClasses` · `ui.teacherShell.classReportTitle` · `school.portal.signOut` · `school.portal.signOutBusy`

---

## 5. תוצאות verification

### Commands
```bash
node docs/reports/_master-loggedin-api-verify.mjs
LOCALES=pt-BR,ru-RU node docs/reports/_master-loggedin-api-verify.mjs
node docs/reports/_retry-ptbr-ruru-flakes.mjs
node docs/reports/_probe-parent-login-consent-fix.mjs
node docs/reports/_merge-master-loggedin-verify.mjs
```

### Counts (full 9-locale chrome-fix run)
| metric | value |
|---:|---:|
| Locales | 9 |
| Routes | 177 |
| Logged-in flows | 36 |
| API responses | 225 |
| Hebrew hits | **0** |
| English leakage hits (Teacher/School chrome) | **0** |
| Actionable after retries | **0** |

Focused retry `pt-BR`+`ru-RU`: routes 40 · flows 8 · APIs 50 · actionable 0 · **PASS**

---

## 6. טבלה לפי locale

| locale | Parent | Student | Teacher | School | status |
|---|---|---|---|---|---|
| ar-001 | OK | OK | OK | OK | **PASS** |
| es-419 | OK | OK | OK | OK | **PASS** |
| pt-BR | OK | OK | OK | OK | **PASS** (retry) |
| pt-PT | OK | OK | OK | OK | **PASS** |
| de-DE | OK | OK | OK | OK | **PASS** |
| fr-FR | OK | OK | OK | OK | **PASS** |
| it-IT | OK | OK | OK | OK | **PASS** |
| nl-NL | OK | OK | OK | OK | **PASS** |
| ru-RU | OK | OK | OK | OK | **PASS** (retry) |

---

## 7. אפשר לעבור ל־country overlays?

**כן.**

```text
Master logged-in/API verification passed. Proceed to country overlays verification.
```

**Evidence:**  
`docs/reports/master-loggedin-api-verify.json` · `master-loggedin-api-retry-flakes.json` · `master-loggedin-api-verify-2026-08-06-fix.md`
