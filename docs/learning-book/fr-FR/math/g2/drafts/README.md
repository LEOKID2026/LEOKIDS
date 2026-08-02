# Livre d'apprentissage des mathématiques de CE1 — Brouillons

**Statut :** Tous les lots créés — **22 / 22** brouillons de pages terminés (lots A + B + C + D). Examen complet du pass polonais appliqué (juin 2026). Examen du propriétaire en attente.  
**Date :** juin 2026  
**Dossier :** `docs/learning-book/math/g2/drafts/`

---

## Statut actuel

| Item | Status |
|------|--------|
| Curriculum plan | ✅ `docs/learning-book/MATH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| UI style lock | ✅ `docs/learning-book/MATH_LEARNING_BOOK_UI_STYLE_LOCK.md` |
| Draft markdown pages | ✅ **22 / 22** (Batches A + B + C + D) |
| Batch A polish pass | ✅ Applied (June 2026) |
| Batch B polish pass | ✅ Applied (June 2026) |
| Batch C authoring | ✅ Complete + polish pass applied (June 2026) |
| Batch D authoring | ✅ Complete (June 2026) — owner review pending |
| Full review polish pass | ✅ Applied (June 2026) |
| Runtime registry | ✅ `lib/learning-book/math-g2-registry.js` |
| Page loader | ✅ `lib/learning-book/load-math-g2-pages.js` |
| App route `/learning/book/math/g2` | ✅ Implemented (dev preview) |
| Practice CTA resolver (G2) | ✅ `lib/learning-book/resolve-math-g2-practice-target.js` |
| Book page resolver (G2) | ✅ `lib/learning-book/resolve-math-g2-book-page.js` |
| Math Master book entry | ✅ General tile + topic + in-learning buttons (g2) |
| Verification script | ✅ `scripts/verify-math-g2-book.mjs` |

---

## Décisions du propriétaire (enregistrées – juin 2026)

| Topic | Decision |
|-------|----------|
| UI / reader | Reuse CP book reader — no redesign |
| `divisibility` | **2, 5, 10 only** in G2; child-facing last-digit rules; no 3/6/9 |
| Fractions (Batch C) | **Visual only** — half and quarter; no fraction arithmetic |
| `frac_*_reverse` | Doubling (half) or 4 equal parts (quarter) to find whole |
| `wp_time_date` / `wp_time_days` | **Weekdays only** for G2 (Batch D) |
| `wp_coins` | Simple equal groups / multiplication allowed (Batch D) |

---

## Source de vérité

| Document / file | Role |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | All 22 CE1 Math `skill_id` entries |
| `docs/learning-book/MATH_GRADE_2_LEARNING_BOOK_PLAN.md` | Page list, batches, boundaries |
| `docs/learning-book/MATH_LEARNING_BOOK_CURRICULUM_MAP.md` | Page types and wide-span rules |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Seven-section Grades 1–2 template |
| `docs/learning-book/MATH_LEARNING_BOOK_UI_STYLE_LOCK.md` | Reader UX — reuse CP |
| `utils/math-constants.js` | CE1 number ranges and allowed operations |
| `docs/learning-book/math/g1/drafts/` | **Style reference only** |

---

## Lot A — יסודות מספרים והשוואה

**Statut :** ✅ Projet terminé + passe de polissage appliquée

| File | Draft title |
|------|-------------|
| `ns_place_tens_units.md` | מאות, עשרות ואחדות — עד 1,000 |
| `ns_neighbors.md` | שכנים של מספר — מספרים גדולים יותר |
| `ns_complement10.md` | זוגות שמרכיבים 10 — עזר לחיבור |
| `ns_even_odd.md` | זוגי ואי-זוגי — חזרה ותרגול |
| `cmp.md` | השוואת מספרים עד 1,000 |

---

## Lot B — חיבור, חיסור, כפל וחילוק

**Statut :** ✅ Projet terminé + passe de polissage appliquée

| File | Draft title |
|------|-------------|
| `add_two.md` | חיבור של שני מספרים — עד 100 |
| `sub_two.md` | חיסור של שני מספרים — עד 100 |
| `add_vertical.md` | חיבור במאונך |
| `sub_vertical.md` | חיסור במאונך |
| `mul.md` | לוח הכפל — קבוצות שוות |
| `div.md` | חילוק — חלוקה שווה |

---

## Lot C — התחלקות ושברים

**Statut :** ✅ **Ébauche terminée + passe de polissage appliquée** (juin 2026) — examen du propriétaire en attente

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|
| `divisibility.md` | `math:g2:divisibility` | `math:kind:divisibility` | concept_foundation | מתי מספר מתחלק ב־2, ב־5 וב־10? |
| `frac_half.md` | `math:g2:frac_half` | `math:kind:frac_half` | visual_intuition | חצי מהשלם |
| `frac_half_reverse.md` | `math:g2:frac_half_reverse` | `math:kind:frac_half_reverse` | visual_intuition | מציאת השלם כשיש חצי |
| `frac_quarter.md` | `math:g2:frac_quarter` | `math:kind:frac_quarter` | visual_intuition | רבע מהשלם |
| `frac_quarter_reverse.md` | `math:g2:frac_quarter_reverse` | `math:kind:frac_quarter_reverse` | visual_intuition | מציאת השלם כשיש רבע |

Toutes les pages du lot C :

- `subject` : mathématiques · `classe` : g2 · `age_band` : notes_1_2 · `approval_status` : **brouillon**
- Titres de section : מה לומדים ? / הסבר / דוגמה / בואו נפתור / נסו בעצמכם / שימו לב! / בואו נתרגל!
- Tous les titres hébreux : **`[DRAFT — not owner-approved]`**

### Passe de polissage du lot C (juin 2026)

| Fix | Detail |
|-----|--------|
| `frac_half` / `frac_quarter` | Section 7: **שני חלקים שווים** / **ארבעה חלקים שווים** (not “שתיים/ארבע שווה”) |
| `frac_half_reverse` | Section 1: removed **להפוך**; Section 6: clearer “add only 1” mistake |
| `frac_quarter_reverse` | Section 1: **כשידוע לנו רבע…**; Section 6: half vs quarter contrast (**5 + 5** vs **5 + 5 + 5 + 5**) |

### Notes sur la portée du contenu du lot C

- `divisibility` : **2, 5, 10 uniquement** ; « מתחלק ב־2/5/10 » ; règles du dernier chiffre ; par ex. 40 ; **non** 3/6/9 ; peu profond « בלי שארית » uniquement
- `frac_half` : visuel ; חצי = חלק אחד מתוך שני חלקים שווים; par ex. חצי מ־12 = 6 ; pas de numérateur/dénominateur formel
- `frac_half_reverse` : connaître la moitié → trouver le tout ; doubler; par ex. חצי = 6 → שלם 12
- `frac_quarter` : visuel ; רבע = חלק אחד מתוך ארבעה חלקים שווים; par ex. רבע מ־12 = 3 ; pas de tiers/huitièmes
- `frac_quarter_reverse` : connaître le quartier → trouver le tout ; 4 parts égales ; 4 × ou ajout répété ; par ex. רבע = 4 → שלם 16

### Alignement lot C section 5/6

| Page | Section 5 (try it) | Section 6 (mistake) |
|------|-------------------|---------------------|
| `divisibility` | 35 — divide by 2, 5, 10? | 35 confused with ÷10 |
| `frac_half` | חצי מ־10 = ? | 10 split unequally (4+6) |
| `frac_half_reverse` | חצי = 5 → whole? | 5 + 1 = 6 instead of 5 + 5 |
| `frac_quarter` | רבע מ־20 = ? | 20 split in 2 (half = 10) |
| `frac_quarter_reverse` | רבע = 5 → whole? | 5 + 5 = 10 (half not quarter) |

---

## Lot D — שאלות מילוליות

**Statut :** ✅ **Ébauche terminée** (juin 2026) – examen par le propriétaire en attente

| File | learning_page_id | skill_id | page_type | Draft title |
|------|------------------|----------|-----------|-------------|
| `wp_coins.md` | `math:g2:wp_coins` | `math:kind:wp_coins` | word_problem_strategy | שאלות מילוליות — מטבעות |
| `wp_coins_spent.md` | `math:g2:wp_coins_spent` | `math:kind:wp_coins_spent` | word_problem_strategy | שאלות מילוליות — קניות ועודף |
| `wp_time_date.md` | `math:g2:wp_time_date` | `math:kind:wp_time_date` | word_problem_strategy | שאלות מילוליות — ימי השבוע |
| `wp_time_days.md` | `math:g2:wp_time_days` | `math:kind:wp_time_days` | word_problem_strategy | שאלות מילוליות — כמה ימים בין יום ליום |
| `wp_groups_g2.md` | `math:g2:wp_groups_g2` | `math:kind:wp_groups_g2` | word_problem_strategy | שאלות מילוליות — קבוצות שוות |
| `wp_division_simple.md` | `math:g2:wp_division_simple` | `math:kind:wp_division_simple` | word_problem_strategy | שאלות מילוליות — חלוקה שווה |

Toutes les pages du lot D :

- `subject` : mathématiques · `classe` : g2 · `age_band` : notes_1_2 · `approval_status` : **brouillon**
- Titres de section : מה לומדים ? / הסבר / דוגמה / בואו נפתור / נסו בעצמכם / שימו לב! / בואו נתרגל!
- Tous les titres hébreux : **`[DRAFT — not owner-approved]`**
- Cadre de problème de mots : **מה יודעים ? / מה מבקשים? / מה עושים?**

### Notes sur la portée du contenu du lot D

- `wp_coins` : ₪ shekels entiers uniquement ; totaux en une seule étape ; groupes égaux / multiplication OK (par exemple 4 × 5) ; jusqu'à ~100 ; pas d'agorot, pas d'argent en plusieurs étapes
- `wp_coins_spent` : payant − coût = changement ; en une seule étape ; un achat ; jusqu'à ~100 ; pas d'agorot
- `wp_time_date` : **en semaine uniquement** ; sauts de jour avant/arrière ; pas d'arithmétique d'horloge, de mois, de calendrier ou d'année
- `wp_time_days` : compte les sauts entre les jours de la semaine ; **ne comptez pas le jour de départ comme premier saut** ; pas d'horloge ni de dates de calendrier
- `wp_groups_g2` : histoires de multiplication en groupes égaux ; une étape ; facteurs au sein de G2 ; réticulation avec le lot B `mul` ; pas de division ici
- `wp_division_simple` : histoires à partage égalitaire ; une étape ; pas de reste ; réticulation avec le lot B `div` ; pas de longue division

### Lot D section 5/6 alignement

| Page | Section 5 (try it) | Section 6 (mistake) |
|------|-------------------|---------------------|
| `wp_coins` | 3 coins × 10 ₪ = ? | counted 3 instead of 3 × 10 = 30 |
| `wp_coins_spent` | paid 40, cost 28 → change? | 40 − 20 = 20 (partial subtract) |
| `wp_time_date` | Wed + 2 days → ? | stopped at Thu (1 jump) not Fri |
| `wp_time_days` | Mon → Fri, how many days? | counted Mon or stopped at Thu (3 not 4) |
| `wp_groups_g2` | 6 bags × 3 apples = ? | 6 + 3 = 9 instead of 6 × 3 = 18 |
| `wp_division_simple` | 20 stickers ÷ 5 kids = ? | 20 − 5 = 15 instead of 20 ÷ 5 = 4 |

---

## Plan de lots (complet)

**Total de pages : 22 — toutes rédigées**

| Batch | Title (draft) | Pages | Status |
|-------|---------------|-------|--------|
| **A** | יסודות מספרים והשוואה | 5 | ✅ drafted + polished |
| **B** | חיבור, חיסור, כפל וחילוק | 6 | ✅ drafted + polished |
| **C** | התחלקות ושברים | 5 | ✅ drafted + polished |
| **D** | שאלות מילוליות | 6 | ✅ drafted — owner review pending |

---

## Révision complète du pass polonais (juin 2026)

Correctifs obligatoires en hébreu/contenu issus de la révision complète du pack de révision, avant la mise en œuvre :

| Page | Fix |
|------|-----|
| `add_two` | Grammar: `מחברים את שתי התוצאות` (feminine plural) |
| `wp_coins_spent` | Wording: `יותר מהמחיר`; Section 6: `לחסר` (not `לחסור`) |
| `wp_division_simple` | Clarity: `חלק שווה`; `באופן שווה בין … ילדים` (§4 + §5) |

**Statut inchangé :** **22 / 22** pages rédigées · toutes `approval_status: draft`.

---

## Mise en place du site (juin 2026)

Livre de CE1 connecté au site pour **aperçu de développement** — réutilise exactement l'UX du lecteur de CP (`MathG2BookShell`, partagé `LearningPageBody` / `BookTocModal`).

| Item | Location |
|------|----------|
| Registry + page order | `lib/learning-book/math-g2-registry.js` |
| Markdown loader | `lib/learning-book/load-math-g2-pages.js` |
| Book nav / snapshots / practice preset | `lib/learning-book/math-g2-book-nav.js` |
| Topic → book page | `lib/learning-book/resolve-math-g2-book-page.js` |
| Section 7 practice CTA | `lib/learning-book/resolve-math-g2-practice-target.js` |
| Routes | `/learning/book/math/g2`, `/learning/book/math/g2/[pageId]` |
| Math Master | General 📖 tile (g2 only), `הסבר בספר`, in-learning `📖 הסבר` |
| Verify | `node scripts/verify-math-g2-book.mjs` |

**Interface utilisateur destinée aux enfants :** `ספר חשבון — כיתה ב׳` · pas de marqueurs `[DRAFT]` · pas de métadonnées internes.

**Pratiquez le CTA :** Toutes les **22** pages mappées via les branches `resolve-math-g2-practice-target.js` + `forceKind` dans `utils/math-question-generator.js`.

**Boutons cachés (pas de mappage fiable) :**
- Configuration `הסבר בספר` cachée pour les opérations parapluie : `number_sense`, `word_problems`, `fractions`, `mixed`
- En apprentissage `📖 הסבר` masqué lorsque le type/l'opération ne peut pas être résolu en une seule page G2

**Pas terminé :** SQL · validation · push · déploiement · approbation du contenu par le propriétaire.

Voir aussi : `docs/learning-book/MATH_GRADE_2_BOOK_IMPLEMENTATION_SUMMARY.md`

---

## Questions ouvertes (post-lot D)

1. **Titres hébreux du lot D** — examen par le propriétaire avant la mise en œuvre
2. **Pratiquez les mappages CTA** — Le résolveur G2 n'est toujours pas implémenté
3. ** Signature complète du livre ** — les 22 pages en attente de l'approbation du propriétaire

---

## Règle d'arrêt explicite

> **L'interface utilisateur de niveau 2 est implémentée pour l'aperçu des développeurs uniquement.** Ne déployez pas et ne traitez pas le brouillon de contenu comme approuvé par le propriétaire jusqu'à l'approbation.

Jusqu'à ce que le propriétaire approuve le contenu :

- ❌ Pas de SQL, de validation, de push ou de déploiement pour la version de production
- ✅ Itinéraires de développement `/learning/book/math/g2` disponibles pour le contrôle qualité

---

## Confirmation

- **22** brouillons de pages `.md` (Lots A + B + C + D) ; tous `approval_status: draft`.
- Tous les brouillons de pages de niveau 2 existent désormais — **22 / 22**.
- Registre G2, chargeur, routes, résolveurs et câblage Math Master implémentés (juin 2026).
- Le lecteur Classe 1 UX reste la référence verrouillée (`MATH_LEARNING_BOOK_UI_STYLE_LOCK.md`).
- Pas de SQL, de validation, de push ou de déploiement dans ce flux de travail.
