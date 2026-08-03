# ar-001 RTL audit

**Reference (read-only):** LEO-KIDS, LEO-KIDS-WEB-TRY  
**Target:** LEO-KIDS-GLOBAL  
**Locale:** `ar-001` · **Direction:** RTL · **Numbers:** Western 0–9

## Reuse (Global)

| Pattern | Location |
|---------|----------|
| SSR/client `dir`/`lang` bootstrap | `AppLocaleShell`, `_document`, `I18nProvider` |
| Math LTR islands | `MathExpression`, `.leo-ltr-island`, `lib/bidi/*` |
| RTL fonts | `styles/locale-fonts.css` |
| Pseudo RTL QA | `ar-XB` |

## Refactor required

| Surface | Issue | Action |
|---------|-------|--------|
| **SchoolPortalShell** | Forces `dir=ltr` + `lang=en` on `<html>` and shell | Locale-aware direction; bind school UI locale |
| **school-ui.js** | Hardcoded `locales/en/school.json` | `bindSchoolUiLocale` + `loadLocaleBundles` |
| Worksheet HTML | `lang="en" dir="ltr"` in payload builder | Locale-aware `lang`/`dir`; math islands LTR |
| PWA / offline SW | English LTR copy in `public/sw.js`, `public/student/sw.js` | Runtime locale strings for ar-001 |
| Physical CSS | `ml-`/`mr-`/`text-left` in shared shells | Logical properties where shell-level |

## LTR islands (scoped only)

Email, password, URL, code, ID, file extension, Math notation, English-learning Q/A, technical identifiers.

## School Portal RTL contract

Full RTL: navigation, sidebar, headings, tables, forms, modals, class groups, teachers, reports.  
LTR islands: scoped children only (see above).

## Persona surfaces

| Persona | RTL shell | Notes |
|---------|-----------|-------|
| Public | AppLocaleShell | — |
| Parent | Portal shell | — |
| Student | Portal shell | English subject content LTR |
| Teacher | Portal shell | — |
| School | **SchoolPortalShell** | Was LTR — refactor to RTL |

## High-risk mixed direction

Math/geometry stems (LTR), English subject Q/A (LTR), diagnostic evidence (preserve order), print/PDF worksheets.
