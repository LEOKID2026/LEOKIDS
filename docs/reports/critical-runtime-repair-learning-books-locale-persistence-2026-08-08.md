# LEO KIDS GLOBAL — Critical Runtime Repair

**Date:** 2026-08-08  
**Scope:** Learning Books HTTP 500 + locale/language persistence  
**Commit/push:** not created / not performed  

---

```text
LEO KIDS GLOBAL — Critical Runtime Repair

A. LEARNING BOOKS

Root cause = Missing English runtime drafts tree (`docs/learning-book/en/**`) after historical cleanup; resolver fell through to absent legacy `docs/learning-book/{subject}/{grade}/drafts`; `loadTocEntries` → `loadAllPages` threw → HTTP 500. Secondary: public dynamic book routes used undefined `contentLocale` (ReferenceError → 500).
Production 500 reproduced = YES (local loader throw: Missing math/g6 draft: ns_place_hundreds.md; same for english/science/geometry on en/ar-001/es-419/pt-BR)
Affected resolver/file = lib/content/locale.server.js (resolveLearningBookDraftsDir) + lib/learning-book/load-learning-book-pages.js (loadAllPages/loadTocEntries) + pages/student|learning/book/[subject]/[grade]/**
Old 2 book-path failures related = YES

Runtime authority for books = docs/learning-book/{locale}/{subject}/{grade}/drafts via resolveLearningBookDraftsDir (locale fallback chain → legacy path)
English authority = docs/learning-book/en/** (restored from artifacts/id-ID-phase8/en-sot; identical to pre-deletion SoT)
Locale fallback behavior = requested locale tree → fallback chain (e.g. ar-001→en, id-ID→en, es-419→en) → legacy path; never 500 solely because a non-EN locale tree is absent when EN exists

Math routes = PASS (g1–g6 × en/ar-001/id-ID/es-419/pt-BR TOC load)
Geometry routes = PASS
Science routes = PASS
English routes = PASS (learning MD remains English SoT; UI chrome localizes separately)

en = PASS (uses docs/learning-book/en)
ar-001 = PASS (falls back to en drafts)
id-ID = PASS (uses docs/learning-book/id-ID)
es-419 = PASS (falls back to en drafts; no es-419 book tree on HEAD)
pt-BR = PASS (falls back to en drafts)

Valid book routes returning 500 after fix = 0
Book content/logic drift = NO (EN restored bit-identical from phase8 extract; no pedagogy/question edits)

B. LOCALE PERSISTENCE

Previous locale authority conflict = URL prefix always beat profile/cookie and middleware always wrote cookie from URL (shared/stale /ar-001 wiped saved choice). Accept-Language could initialize non-English UI without explicit choice; client prefix restore then persisted it via cookie.
Final precedence = 1) authenticated profile preference 2) lk_global_locale cookie (last explicit / guest) 3) URL/?locale= first use only 4) optional detectedMarketLocale 5) English. Accept-Language not in product default chain.

Explicit selector persistence = YES (I18nProvider.setLocale → writeLocaleCookieClient + navigate; parent/teacher optimistic profile update)
Authenticated user persistence = YES (parent interface_language / teacher preferred_language; login session/ready sets cookie from account)
Guest/browser persistence = YES (lk_global_locale cookie, 1y)
Middleware behavior = saved cookie wins over mismatched URL prefix (redirect to preferred locale path); bare path restores non-default cookie prefix; matching URL rewrites as before
Country detection behavior = no existing geo authority in repo — not invented; detectedMarketLocale hook available for future; otherwise English
English final default = YES

Geo overwrites saved preference = NO
Stale cookie overwrites account preference = NO (profile > cookie on resolve; login writes cookie from account)
Navigation loses locale = NO (localizeHref / ensureLocalePrefixedUrl / middleware bare→prefix)
Refresh loses locale = NO (cookie + profile)
Login redirect loses locale = NO (account preference applied; cookie synced on parent session/ready)

Multiple-user account preference behavior = account profile wins over prior guest cookie when profile is loaded; each account’s preferred_language / interface_language is the authority after login

C. TEST MATRIX

Book resolver tests = tests/i18n/learning-content-locale.test.mjs (incl. 24×5 TOC matrix)
Book runtime probes = local loader probes for math/english/science/geometry × en/ar-001/id-ID (and full matrix in test)
Locale persistence tests = tests/i18n/locale-persistence-authority.test.mjs (12-point matrix)
Middleware tests = tests/i18n/middleware-locale-precedence.test.mjs
Navigation tests = tests/i18n/locale-nav-persistence.test.mjs + persistence href builders

Tests passed = 47/47 focused
Tests failed = 0

D. REGRESSIONS

en = no translation rewrite (EN book tree restored as runtime authority only)
es-419 = no content rewrite
ar-001 = no content rewrite
id-ID = no content rewrite
pt-BR = no content rewrite

Other locale content modified = NO
Question/learning logic drift = NO
Game/report logic drift = NO

401 screenshot items classification = OUT OF SCOPE (student guest/playable-topics + learning-profile auth; not causal for book 500 or locale persistence)
Browser content-script warnings classification = OUT OF SCOPE (extension / MaxListenersExceededWarning; not product defects)

Files modified =
  docs/learning-book/en/** (restored English runtime drafts, 450 md)
  pages/learning/book/[subject]/[grade]/index.js
  pages/learning/book/[subject]/[grade]/[pageId].js
  pages/student/learning/book/[subject]/[grade]/index.js
  pages/student/learning/book/[subject]/[grade]/[pageId].js
  lib/i18n/locale-resolution.js
  middleware.js
  components/i18n/AppLocaleShell.jsx
  hooks/useParentMembershipLocale.js
  hooks/useTeacherProfileLocale.js
  tests/i18n/learning-content-locale.test.mjs
  tests/i18n/locale-resolution.test.mjs
  tests/i18n/profile-locale-e2e.test.mjs
  tests/i18n/locale-persistence-authority.test.mjs (new)
  tests/i18n/middleware-locale-precedence.test.mjs (new)
  docs/reports/critical-runtime-repair-learning-books-locale-persistence-2026-08-08.md (this report)

Files outside scope = none intentionally touched
Unexpected changes = none

Build = not run (loader-level reproduction + matrix prove GSSP crash path fixed; full production build deferred)
Commit = not created
Push = not performed

API/background/sub-agents used = 0

REPAIR RESULT = PASS
```
