# מיפוי מלא — שפות/מדינות לא־אנגליות מול English SoT

**תאריך:** 2026-08-06  
**סוג:** מיפוי בלבד (ללא תיקונים, ללא commit/push)  
**מקור אמת:** English SoT (מאושר PASS)

---

## 1. סטטוס כללי

```text
Global non-English locale audit: FAIL
English SoT remains valid: yes
Can start fixes: yes
```

**פירוש:** אין עברית ציבורית בשום locale לא־אנגלי שנבדק. נמצאה **דליפת אנגלית** ב־9 master locales (בעיקר static + 2 routes משותפים ב־runtime). אין BLOCKED גלובלי — ניתן להתחיל תיקונים לפי סדר העדיפויות למטה.

**מגבלות מיפוי (חשוב):**
- **API responses:** לא נסרקו ב־auth per-locale (0 בדיקות API) — נדרש שלב המשך.
- **Logged-in flows:** נבדקו דפי login בלבד; לא parent/student/teacher/school מחוברים per locale.
- **עומק אינטראקציה:** לא נפתחו modals/menus עמוקים, cards, reports, games actions per locale.
- **Country overlays:** crawl מדגם (5 routes) — לא 17 routes מלאים כמו masters.
- **זיהוי EN leakage static:** משווה עלים זהים ל־`en` — כולל brand (`Leo Kids`), ICU templates (`{message}`), ותוכן English-subject מכוון.

---

## 2. Inventory מלא

**מקור:** `lib/i18n/locale-registry.js` — **87 locale IDs** (כולל `en`), **86 לא־אנגליים**.

| מדד | ערך |
|---|---|
| Locales ב־registry | 87 |
| Masters (non-EN) | 9 |
| Country overlays פעילים | 67 |
| Pseudo (QA) | 2 (`en-XA`, `ar-XB`) |
| Disabled placeholders | 8 (`pl`, `ar`, `fa`, `ur`, `tr`, `zh`, `ja`, `ko`) |
| Switcher visible | 76 |
| Selector hidden (routable) | `es-419` בלבד |

**טבלת inventory מלאה (76 locales פעילים):**  
`docs/reports/non-en-locale-inventory-table.md`

**דוגמאות מיוחדות:**

| locale | public path | selector | visible | fallback | pack | runtime |
|---|---|---|---|---|---|---|
| `ar-001` | `/ar-001` | العربية | visible | `ar-001 → en` | full | yes |
| `es-419` | `/es-419` | Español | **hidden** | `es-419 → en` | full | yes |
| `es-ES` | `/es` | España | visible | `es-ES → es-419 → en` | sparse overlay | yes |
| `es-AR` | `/ar` | Argentina | visible | `es-AR → es-419 → en` | sparse overlay | yes |
| `pt-BR` | `/br` | Brasil | visible | `pt-BR → en` | full | yes |
| `pt-PT` | `/pt` | Portugal | visible | `pt-PT → pt-BR → en` | full | yes |
| `de-DE` | `/de` | Germany | visible | `de-DE → en` | full | yes |
| `fr-FR` | `/fr` | France | visible | `fr-FR → en` | full | yes |
| `en-GB` | `/eng` | England | visible | `en-GB → en` | sparse overlay | yes |
| `en-WLS` | `/wls` | Wales | visible | `en-WLS → en-GB → en` | **missing** (by design) | yes |
| `en-PH` | `/ph` | Philippines | visible | `en-PH → en` | **missing** | yes (5/15 UI ns) |

**קבצי config מרכזיים:**
- `lib/i18n/locale-registry.js` — registry, pathPrefix, selectorVisible, fallback
- `lib/i18n/locale-resolution.js` — `getLocaleFallbackChain`, cookie/query resolution
- `lib/i18n/locale-path.js` — route prefix strip/localize
- `lib/i18n/load-messages.js` — `I18N_NAMESPACES` (15), bundle merge
- `lib/content/pack-catalog.js` + `content-packs/{locale}/`
- `middleware.js` — locale rewrite; `/admin` exempt

---

## 3. טבלת מצב לפי locale

### סיכום

| status | count | הערה |
|---|---:|---|
| **PASS** | 77 | כולל 67 overlays + 22 en-country + pseudo/disabled ללא runtime |
| **FAIL** | 9 | כולם **master locales** בלבד |
| **BLOCKED** | 0 | — |

### Masters — FAIL (דליפת אנגלית)

| locale | status | Hebrew runtime | Hebrew static | EN leakage | RTL | severity | wave |
|---|---|---:|---:|---:|---:|---|---:|
| `fr-FR` | FAIL | 0 | 0 | **57** (55 static + 2 runtime) | 0 | high | 4 |
| `de-DE` | FAIL | 0 | 0 | 26 | 0 | medium | 5 |
| `nl-NL` | FAIL | 0 | 0 | 25 | 0 | medium | 5 |
| `es-419` | FAIL | 0 | 0 | 18 | 0 | medium | 5 |
| `it-IT` | FAIL | 0 | 0 | 15 | 0 | medium | 5 |
| `ru-RU` | FAIL | 0 | 0 | 12 | 0 | medium | 5 |
| `pt-BR` | FAIL | 0 | 0 | 11 | 0 | medium | 5 |
| `ar-001` | FAIL | 0 | 0 | 6 | 0 | low | 5 |
| `pt-PT` | FAIL | 0 | 0 | 2 | 0 | low | 5 |

### Masters — הערות

- **אין עברית** בכל ה־masters (static מחובר + runtime).
- **`ar-001`:** RTL תקין (`dir=rtl`, `lang=ar-001` על `/ar-001/parent/login`); 0 עברית; 6 עלים static זהים ל־en (brand + ICU templates).
- **Country overlays (67):** PASS בדגימת runtime — אין ממצאי עברית; EN chrome לא הועלה כממצא נפרד (ירשו מ־master).

### Disabled placeholders

`pl`, `ar`, `fa`, `ur`, `tr`, `zh`, `ja`, `ko` — `enabled: false`, אין `locales/` / `content-packs/`, לא נסרקו ב־runtime. סטטוס PASS טכני; **לא מוכנים לשחרור**.

---

## 4. Blockers גלובליים

| אזור | ממצא | חומרה | הערה |
|---|---|---|---|
| **עברית ציבורית** | **0 hits** | — | אין blocker עברית בשפות לא־אנגליות |
| **Fallback לעברית** | לא נמצא | — | `he`/`he-IL` → `en` ב־resolver |
| **English leakage — shared routes** | `/contact`, `/practice/worksheets` | high | אותו דפוס ב־8 masters: `Privacy policy`, `Printable worksheets` |
| **English leakage — static UI** | `locales/{master}/*.json` | medium–high | 156 עלים static זהים ל־en (סה״כ); `fr-FR` הכי גבוה |
| **Cards / reports / games / demo deep** | לא נבדק per-locale | — | שלב המשך נדרש |
| **API responses** | לא נבדק | — | שלב המשך עם session per locale |
| **Resolver / middleware** | תקין | — | 76 locales נגישים ב־runtime crawl |
| **Stale PWA list** | `public/sw.js` — 4 locales בלבד | warning | לא blocker runtime; תיקון תשתיתי עתידי |

---

## 5. ממצאים מפורטים (24 סה״כ)

### A. Runtime — English chrome (16 ממצאים, 8 masters × 2 routes)

| locale | route | exact text (דוגמה) | layer | severity | kind |
|---|---|---|---|---|---|
| `es-419` | `/es-419/contact` | Privacy policy | runtime | high | english_leakage |
| `es-419` | `/es-419/practice/worksheets` | Printable worksheets | runtime | high | english_leakage |
| `pt-BR` | `/br/contact` | Privacy policy | runtime | high | english_leakage |
| `pt-BR` | `/br/practice/worksheets` | Printable worksheets | runtime | high | english_leakage |
| `pt-PT` | `/pt/contact` | Privacy policy | runtime | high | english_leakage |
| `pt-PT` | `/pt/practice/worksheets` | Printable worksheets | runtime | high | english_leakage |
| `it-IT` | `/it/contact` | Privacy policy | runtime | high | english_leakage |
| `it-IT` | `/it/practice/worksheets` | Printable worksheets | runtime | high | english_leakage |
| `fr-FR` | `/fr/contact` | Privacy policy | runtime | high | english_leakage |
| `fr-FR` | `/fr/practice/worksheets` | Printable worksheets | runtime | high | english_leakage |
| `nl-NL` | `/nl/contact` | Privacy policy | runtime | high | english_leakage |
| `nl-NL` | `/nl/practice/worksheets` | Printable worksheets | runtime | high | english_leakage |
| `de-DE` | `/de/contact` | Privacy policy | runtime | high | english_leakage |
| `de-DE` | `/de/practice/worksheets` | Printable worksheets | runtime | high | english_leakage |
| `ru-RU` | `/ru/contact` | Privacy policy | runtime | high | english_leakage |
| `ru-RU` | `/ru/practice/worksheets` | Printable worksheets | runtime | high | english_leakage |

**מקור משוער:** footer/legal + worksheets surface שלא נמשכים מ־bundle המקומי (fallback ל־en).

### B. Static — EN-identical leaves (8 ממצאים master)

| locale | file | דוגמאות | severity | הערה |
|---|---|---|---|---|
| `fr-FR` | `locales/fr-FR/*.json` | 55 עלים — `Correct!`, `Collection`, `Question`, `Curriculum`… | high | הכי רחב |
| `de-DE` | `locales/de-DE/*.json` | 24 עלים — `Marathon`, `Champion`, `Start`… | medium | |
| `nl-NL` | `locales/nl-NL/*.json` | 23 עלים — social labels, `Prototype`… | medium | |
| `es-419` | `locales/es-419/*.json` | 16 עלים — `Horizontal`/`Vertical`, ICU… | medium | |
| `it-IT` | `locales/it-IT/*.json` | 13 עלים — `Password`, `Curriculum`, `Arcade`… | medium | |
| `ru-RU` | `locales/ru-RU/*.json` | 10 עלים — חלק English-subject מכוון | medium | לסווג ב־fix |
| `pt-BR` | `locales/pt-BR/*.json` | 9 עלים | medium | |
| `ar-001` | `locales/ar-001/*.json` | 6 עלים — `Leo Kids`, `{name} · {suffix}` | low | brand/templates |

**לא נמצאו:** עברית static מחוברת, missing namespaces ב־masters, RTL חסר ב־`ar-001`, stale files מחוברים עם עברית.

---

## 6. Admin exemptions

| נושא | מצב |
|---|---|
| **מה נמצא** | קבצי `.he.js` ו־Admin portal (`lib/admin-portal/*`, `pages/admin/*`) — עברית מותרת |
| **למה מוחרג** | Admin לא חלק מ־English SoT הציבורי; מוגדר ב־`check-zero-hebrew-repository.mjs` ו־`_global-hebrew-guard-lib.mjs` |
| **דליפה ל־public** | **לא נמצאה** — `/admin` מוחרג מ־locale middleware; לא נכלל ב־crawl ציבורי |
| **דוגמאות קבצים** | `admin-ui.he.js`, `admin-rewards-ui.he.js`, `pages/admin/analytics.js` |

---

## 7. המלצת סדר תיקון (ללא ביצוע)

1. **תשתית גלובלית:** `/contact` footer legal + `/practice/worksheets` — מקור EN משותף; תקן פעם אחת → 8 masters.
2. **עברית ציבורית:** אין — דלג.
3. **Fallback שגוי:** אין לעברית — דלג.
4. **EN leakage רחב:** `fr-FR` static (55 עלים), אחר כך `de-DE` / `nl-NL`.
5. **כמעט נקיות:** `ar-001`, `pt-PT`, `ru-RU` — ניקוי עלים אחרונים + וידוא English-subject exceptions.
6. **ערבית/RTL:** RTL כבר תקין; המשך עם תוכן לימוד אנגלית מכוון בלבד.
7. **שלב המשך חובה לפני PASS סופי:** API per-locale, logged-in portals, cards/reports/games/modals.

---

## 8. Evidence

### Commands

```bash
node docs/reports/_non-en-locale-sot-audit.mjs
# spot-check ar-001 RTL:
# playwright → http://127.0.0.1:3001/ar-001/parent/login
```

### מספרים

| מדד | ערך |
|---|---:|
| קבצים שנסרקו (static) | 5,622 |
| Locales ב־registry | 87 |
| Locales לא־אנגליים שנבדקו | 86 |
| Locales runtime crawled | 76 |
| Routes שנבדקו | 555 |
| API responses | 0 |
| Hebrew static file hits (non-EN public) | **0** |
| Hebrew runtime hits | **0** |
| EN static identical leaf hits | 156 |
| Findings JSON | 24 |

### קבצי דוח

| קובץ | תוכן |
|---|---|
| `docs/reports/non-en-locale-sot-audit.json` | JSON מלא — inventory, statusTable, findings |
| `docs/reports/non-en-locale-inventory-table.md` | טבלת inventory לכל locale פעיל |
| `docs/reports/_non-en-locale-sot-audit-run.log` | לוג crawl שורה-שורה |
| `docs/reports/_non-en-locale-sot-audit.mjs` | סקריפט המיפוי (ניתן להרצה חוזרת) |
| `docs/reports/non-en-locale-sot-audit-2026-08-06.md` | דוח זה |

---

## שורת החלטה

```text
English remains Source of Truth.
The next step is fixes for non-English locales only, based strictly on English SoT.
```

**English SoT לא נפגע.** הממצאים הם דליפת אנגלית ב־masters (לא עברית, לא fallback לעברית). מומלץ להתחיל מתיקון shared `/contact` + `/practice/worksheets`, ואז `fr-FR` static sweep.
