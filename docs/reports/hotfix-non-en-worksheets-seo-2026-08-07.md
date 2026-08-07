# Hotfix: non-EN English leakage (worksheets + homepage seoEntry)

Date: 2026-08-07  
Commit/push: **not done** (awaiting owner approval)

## 1. Root cause

1. **Worksheets catalog API** built question-card labels without locale (`buildQuestionCatalogItems()` ignored `contentLocale` / `interfaceLocale`), so cards always returned English subject/level/grade/title.
2. **Missing burn-down keys** for formats like `horizontal_addition` and subjects like `subject_math` in most non-EN masters (except `ar-001`).
3. **Homepage SEO entry** keys `ui.public.homepage.seoEntry.*` existed only in `en` + `ar-001`, so `/mx` and other masters fell back to English copy.

## 2. Files changed

- `lib/worksheets/worksheet-public-catalog.server.js` — pass locale into label helpers
- `components/worksheets/ReadyWorksheetsTab.jsx` — client subject/grade/level from `worksheets.*` keys
- `components/seo/PublicSeoEntrySection.jsx` — translated CTAs + `localizeHref` / `LocaleLink`
- `locales/*/ui.json` — `seoEntry`, `valueCardsAria`, `seoNav` for masters
- `locales/es-419/worksheets.json` — `levelRegular` → `Común`
- `content-packs/*/global-burn-down/burn-down-index.json` (+ source pack JSON) — missing worksheet labels
- `scripts/i18n/hotfix-non-en-worksheets-seo-leak.mjs`
- `scripts/i18n/verify-non-en-worksheets-seo-hotfix.mjs`
- Evidence: `docs/reports/hotfix-non-en-worksheets-seo-verify.json`

## 3. Translated / wired labels (examples)

| EN (was leaking) | es-419 / mx / cl | fr-FR | ar-001 |
|---|---|---|---|
| Math | Matemáticas | Maths | الرياضيات |
| Regular / Advanced | Común / Avanzado | Commune / Avancé | عادية / متقدم |
| Grade 1 | Grado 1 | CP | الصف 1 |
| Horizontal addition | Suma horizontal | Addition horizontale | جمع أفقي |
| Practice areas and parent guides | Áreas de práctica y guías para padres | Domaines de pratique et guides parents | مجالات الممارسة وأدلة أولياء الأمور |

Also filled subject chips, format titles, ratio/area/scale, and homepage CTAs/quick links for de/it/nl/pt-BR/pt-PT/ru.

## 4. Route results (extracted visible catalog/SEO text)

See JSON samples. Summary:

- `/mx/practice/worksheets` → Matemáticas / Común / Grado N / Suma horizontal… — **no listed EN strings**
- `/cl/practice/worksheets` → same as es-419 chain — **clean**
- `/fr/practice/worksheets` → Maths / Commune / CP|CE… / Addition horizontale… — **clean** (cognate: French *Fractions*)
- `/ar-001/practice/worksheets` → Arabic labels — **clean**, RTL unchanged
- `/mx` seoEntry → Spanish title/body/CTAs — **clean**

Extra masters sample (de/it/nl/br/pt/ru): catalog EN forbidden list **NONE**.

## 5. Remaining English visible?

On the cited phrases and masters sample: **No** (aside from true cognates: FR `Fractions`, IT `Area`, and subject English when the subject is English-learning).

## 6. Commit / push?

**Yes — hotfix needs commit + push** to reach live Vercel. Not performed yet.
