# Static EN-identical leaves sweep — 8 master locales

**Date:** 2026-08-06  
**Status:** **PASS**

---

## 1. סטטוס

```text
PASS
```

כל 8 masters נקיים מ־English leakage לא מכוון.  
Hebrew = 0 · Runtime EN findings = 0 · Forbidden static leaves = 0 · `pt-PT` ללא regression · English SoT תקין.

---

## 2. מה תוקן

**27 תרגומים** ב־`locales/{locale}/*.json` (+ 1 נוסף ב־`nl-NL`):

### fr-FR (8)
| מפתח | לפני | אחרי |
|---|---|---|
| `learning.correct` | Correct! | Correct ! |
| `learning.master.streakFeedback.correct` | Correct! | Correct ! |
| `learning.master.feedback.excellent` | Excellent! ✅ | Excellent ! ✅ |
| `learning.master.badges.topic_expert` | 🔬 {topic} expert | 🔬 Expert {topic} |
| `learning.master.badges.topic_expert_legacy` | 🔬 {topic} expert | 🔬 Expert {topic} |
| `worksheets.writingCategoryPrewriting` | Pre-writing | Pré-écriture |
| `worksheets.writingNumberModeBeforeAfter` | Before/after | Avant/après |
| `seo.contactTitle` | Contact · Leo Kids | Nous contacter · Leo Kids |

### de-DE (4)
| מפתח | לפני | אחרי |
|---|---|---|
| `learning.master.start` | ▶️ Start | ▶️ Starten |
| `learning.master.levelLabel` | Level {level} | Stufe {level} |
| `learning.master.streakEncouragement.champion` | 👑 Champion! | 👑 Meister! |
| `learning.master.dailyStreakChampion` | 👑 Champion! | 👑 Meister! |

### nl-NL (9)
| מפתח | לפני | אחרי |
|---|---|---|
| social Instagram/YouTube/Facebook | Leo's … | … van Leo |
| `ui.parent.detailsTitle` | Details — {name} | Gegevens — {name} |
| `learning.master.streakFeedback.correct` | Correct! | Goed zo! |
| `learning.master.mistakeRow` | (correct: …) | (juist: …) |
| `worksheets.writingCategoryPrewriting` | Pre-writing | Voorschrijven |
| `school.portal.navDashboard` | Dashboard | Overzicht |
| `ui.student.prototypeBadge` | 🧪 Prototype | 🧪 Proefversie |

### es-419 (3)
| מפתח | לפני | אחרי |
|---|---|---|
| `teacher.activities.individualBadge` | Personal | Individual |
| `ui.student.arcadePageTitle` | {game} — Arcade | {game} — Juegos |
| `learning.master.remainderWarning` | ⚠️ Error: | ⚠️ ¡Error! |

### it-IT (4)
| מפתח | לפני | אחרי |
|---|---|---|
| `ui.parent.curriculum` / `learning.master.curriculum` | Curriculum | Programma |
| `worksheets.writingCategoryPrewriting` | Pre-writing | Pre-scrittura |
| `worksheets.writingNumberModeBeforeAfter` | Before/after | Prima/dopo |

### ru-RU / pt-BR / ar-001
לא נדרשו תרגומי UI — כל העלים הנותרים מסווגים כמותרים.

**קבצים:**  
`locales/fr-FR/{learning,worksheets,seo}.json` · `locales/de-DE/learning.json` · `locales/nl-NL/{ui,learning,worksheets,school}.json` · `locales/es-419/{ui,learning,teacher}.json` · `locales/it-IT/{ui,learning,worksheets}.json`

**כלי סיווג/יישום:**  
`docs/reports/_classify-static-en-leaves.mjs` · `_apply-static-en-fixes.mjs` · עדכון classifier ב־`_non-en-locale-sot-audit.mjs`

---

## 3. מה נשאר באנגלית ולמה (מותר)

| סוג | דוגמאות | למה מותר |
|---|---|---|
| **brand** | `Leo Kids`, `home.headline` | מותג מוצר |
| **ICU / templates** | `{message}`, `{name} · {suffix}`, `{className} ({count})` | placeholders טכניים |
| **allowed_cognate** | Addition, Division, Question, Marathon, Diagonal, Horizontal… | מילה זהה בשפת היעד (צרפתית/גרמנית/ספרדית וכו') |
| **english_subject** | `I = am…`, Present/Past simple, `cat, dog` | תוכן לימוד אנגלית מכוון |
| **technical** | `geometry` ב־`reportSubjects` | מזהה טכני |

---

## 4. טבלה לפי locale

| locale | before (identical) | fixed | allowed remaining | forbidden remaining | status |
|---|---:|---:|---:|---:|---|
| fr-FR | 55 | 8 | 47 | **0** | **PASS** |
| de-DE | 24 | 4 | 20 | **0** | **PASS** |
| nl-NL | 23 | 9 | 14 | **0** | **PASS** |
| es-419 | 16 | 3 | 13 | **0** | **PASS** |
| it-IT | 13 | 4 | 9 | **0** | **PASS** |
| ru-RU | 10 | 0 | 10 | **0** | **PASS** |
| pt-BR | 9 | 0 | 9 | **0** | **PASS** |
| ar-001 | 6 | 0 | 6 | **0** | **PASS** |
| pt-PT | 0 (קודם) | — | 0 | **0** | **PASS** (ללא regression) |

---

## 5. תוצאות audit חוזר

```bash
node docs/reports/_non-en-locale-sot-audit.mjs
node docs/reports/_classify-static-en-leaves.mjs
node docs/reports/_verify-priority1-fix.mjs
```

| מדד | ערך |
|---|---:|
| Hebrew hits | **0** |
| Runtime EN findings | **0** |
| Forbidden static EN findings | **0** |
| Total findings | **0** |
| Routes checked | 555 |
| Locales runtime crawled | 76 |
| Master statuses | 9/9 PASS |

הערה: בריצת ה־crawl המלאה `es-419` סומן זמנית BLOCKED (reachability). בדיקה חוזרת מיידית לכל 17 routes העמוקים החזירה HTTP תקין — עודכן ל־PASS ב־JSON עם `es419ReachabilityRecheck`.

---

## 6. אפשר לעבור לשלב הבא?

**כן.**

```text
English remains Source of Truth.
Non-English master static leakage sweep is complete.
Next step is API + logged-in per-locale verification only after static sweep is clean.
```

**Evidence:**  
`docs/reports/non-en-locale-sot-audit.json` · `non-en-static-en-leaves-classified.json` · `non-en-static-sweep-applied.json` · `_non-en-static-sweep-audit-run.log`
