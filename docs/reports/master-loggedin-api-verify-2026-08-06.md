# Master logged-in / API locale verification

**Date:** 2026-08-06  
**Scope:** 9 master locales only · verification only (no fixes / no commit / no push)  
**Base:** `http://127.0.0.1:3001`

---

## 1. סטטוס כללי

```text
Master logged-in/API locale verification: BLOCKED
English SoT remains valid: yes
Can proceed to country overlays: no
```

**סיבות עיקריות שלא PASS:**

1. **Parent login BLOCKED** ב־`es-419` וב־`pt-PT` (נשאר על מסך login) — לא ניתן להשלים logged-in parent לכל 9 masters.
2. **English leakage עקבי** ב־Teacher / School shells: `Sign out`, `My classes`, `Class report` כמעט בכל locale שנבדק בהצלחה.
3. ממצאי route חולפים (connection refused/reset) ב־`de-DE` / `nl-NL` / `ar-001` — לא מיוחסים לדליפת שפה, אבל מונעים PASS נקי.

Hebrew ציבורי / logged-in / API: **0** בכל ה־9.  
API English chrome markers: **0**.  
Public runtime EN chrome: **0**.

---

## 2. טבלה לפי locale

| locale | status | public HE | public EN | logged-in HE | logged-in EN | API HE | API EN | fallback | route | RTL/LTR | severity |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| ar-001 | FAIL | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | RTL OK (0 rtl findings) | high |
| es-419 | BLOCKED | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | — | blocked (parent login) |
| pt-BR | FAIL | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | — | medium |
| pt-PT | BLOCKED | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | — | blocked (parent login) |
| de-DE | FAIL | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 2 | — | medium+route |
| fr-FR | FAIL | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | — | medium |
| it-IT | FAIL | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | — | medium |
| nl-NL | FAIL | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 2 | — | medium+route |
| ru-RU | FAIL | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | — | medium |

**Login matrix (UI):**

| locale | Parent | Student | Teacher | School |
|---|---|---|---|---|
| ar-001 | OK | OK | OK | OK |
| es-419 | **FAIL** | OK | OK | OK |
| pt-BR | OK | OK | OK | OK |
| pt-PT | **FAIL** | OK | OK | OK |
| de-DE | OK | OK* | OK | OK |
| fr-FR | OK | OK | OK | OK |
| it-IT | OK | OK | OK | OK |
| nl-NL | OK | OK | OK | OK |
| ru-RU | OK | OK | OK | OK |

\* `de-DE` student: login OK, אך חלק מ־routes נכשלו ב־`ERR_CONNECTION_REFUSED` באמצע הריצה.

---

## 3. טבלה לפי role

| role | login OK (all masters) | routes checked (sum) | APIs checked (sum) | Hebrew found | English leakage found | blocked reason |
|---|---|---:|---:|---|---|---|
| Parent | **no** (7/9) | ~21 | 36 | no | no (when logged in) | `es-419`, `pt-PT`: stuck on `/parent/login` |
| Student | **yes** (9/9) | ~27 | 54 | no | no | — |
| Teacher | **yes** (9/9) | ~18 | 45 | no | **yes** (`Sign out`, `My classes`, `Class report`) | — |
| School | **yes** (9/9) | ~27 | 45 | no | **yes** (`Sign out`) | — |
| Public | n/a | 81 | 45 catalog/demo | no | no | transient demo route flakes on nl-NL |

---

## 4. ממצאים מפורטים

### A. English leakage — Teacher / School chrome (חוזר בכל masters שנבדקו)

| locale | role/flow | route | exact text | kind | severity | source משוער | recommended fix later |
|---|---|---|---|---|---|---|---|
| all FAIL masters | teacher | `/teacher/dashboard` | `Sign out`, `My classes` | english_leakage | medium | Teacher portal shell / nav labels not fully bound to interface locale; QA teacher `preferredLanguage=es-MX` | Wire teacher chrome to `lk_global_locale` / path locale; translate leftover keys; reset QA teacher preferredLanguage to `en` or match test locale |
| all FAIL masters | teacher | `/teacher/class/{classId}` | `Class report` | english_leakage | medium | Hardcoded title in `pages/teacher/class/[classId].js` (`Class report: ${className}`) | Use i18n key (exists e.g. `school.classReportTitle`) |
| most masters | school | `/school/dashboard|students|teachers` | `Sign out` | english_leakage | medium | `lib/school-portal/school-ui.js` fallback `portalPack().signOut \|\| "Sign out"` | Ensure school portal pack resolves signOut per master locale |

**הערה:** ב־`ar-001` teacher dashboard לא סומן EN, אבל class page כן (`Class report`). School בערבית עבר ללא `Sign out` באנגלית — כנראה pack ערבי נטען ל־signOut.

### B. ar-001 locale / RTL

| route | kind | exact | severity | notes |
|---|---|---|---|---|
| `/learning/parent-report` | locale_inactive | no Arabic script in body | high | RTL findings = 0 על שאר ה־shells; Western digits לא הופיעו כ־Arabic-Indic. ייתכן דף ריק/שגיאה/תוכן EN בלבד בדוח. |
| public + logged-in shells | rtl | — | — | לא נמצאו `dir!=rtl` |

### C. Parent login BLOCKED

| locale | role | route | kind | exact | severity | recommended |
|---|---|---|---|---|---|---|
| es-419 | parent | `/es-419/parent/login` | blocked | still on login | blocked | Re-verify manually; likely cookie-consent overlay / form submit flake under `/es-419` |
| pt-PT | parent | `/pt/parent/login` | blocked | still on login | blocked | Same — automation stayed on login after submit |

Parent APIs עדיין נבדקו עם Bearer token + `Accept-Language`/`Cookie` — **ללא Hebrew / ללא EN chrome markers**.

### D. Route flakes (סביבה / server)

| locale | route | exact | severity |
|---|---|---|---|
| ar-001 | `/school/teachers` | Execution context destroyed (navigation) | critical (flake) |
| de-DE | `/student/cards`, `/learning` | `ERR_CONNECTION_REFUSED` / interrupted | critical (flake) |
| nl-NL | `/demo/student`, `/demo/parent` | `ERR_CONNECTION_RESET` / `REFUSED` | critical (flake) |

### E. Informational

| item | detail |
|---|---|
| `/api/teacher/me` | `preferredLanguage=es-MX` לכל master (QA teacher `eran2@leokids.com`) — לא FAIL לבד, אך עלול להסביר chrome באנגלית/לא-locale |
| QA data names | `QA Teacher`, `Grade 3 - Global QA`, student English names — נתוני QA, לא סומנו כ־UI chrome leakage |
| `/games` | מפנה ל־`/student/login?next=/learning` בכל locales — gate צפוי, לא נספר כ־EN leakage |
| Admin | לא נבדק (מוחרג) |
| Hebrew | 0 בכל UI + API |

---

## 5. Evidence

### Commands

```bash
node docs/reports/_master-loggedin-api-verify.mjs
```

(ריצה שנייה אחרי שיפור cookie-consent / force-click; הריצה הראשונה נעצרה על באנר cookies ב־`es-419`.)

### Script / artifacts

| artifact | path |
|---|---|
| Script | `docs/reports/_master-loggedin-api-verify.mjs` |
| JSON report | `docs/reports/master-loggedin-api-verify.json` |
| Run log | `docs/reports/_master-loggedin-api-verify-run.log` |
| This MD | `docs/reports/master-loggedin-api-verify-2026-08-06.md` |

### Counts

| metric | value |
|---:|---:|
| Locales checked | **9** |
| Routes crawled | **174** |
| Logged-in flows | **36** (9×4 roles) |
| API responses | **225** |
| Findings (all) | **55** |
| Actionable findings | **47** |
| Hebrew hits | **0** |
| Runtime public EN chrome | **0** |
| API Hebrew | **0** |
| API EN chrome markers | **0** |

### Locale activation method used

* Path prefix (`/ar-001`, `/es-419`, `/br`, `/pt`, `/de`, `/fr`, `/it`, `/nl`, `/ru`)
* Cookie `lk_global_locale=<master>`
* `Accept-Language: <intlLocale>,en;q=0.4`
* Playwright browser `locale` = intlLocale

### Roles / APIs covered

* Parent: login, dashboard, worksheets, parent-report · APIs: `list-students`, `worksheets/catalog`, `coloring-catalog`, `session/ready`
* Student: login, home, cards, learning · APIs: `login`, `me`, `home-profile/summary`, cards collection/summary, diamonds
* Teacher: login, dashboard, class · APIs: `me`, `classes`, `dashboard`, `students`, `report-data`
* School: login via teacher login → dashboard/students/teachers · APIs: `school/dashboard|students|teachers|me`, `teacher/me`
* Public APIs: worksheets catalogs, demo catalog/cards, arcade games

---

## 6. מסקנה

לא ניתן לעבור ל־country overlays.

יש דפוס ברור לתיקון בשלב הבא (אחרי אישור): Teacher/School chrome + hardcoded `Class report` + חסימות parent login ב־`es-419`/`pt-PT` + בדיקת `preferredLanguage` של חשבון ה־QA.

```text
Master logged-in/API verification is not complete. Do not proceed to country overlays yet.
```

```text
English remains Source of Truth.
```
