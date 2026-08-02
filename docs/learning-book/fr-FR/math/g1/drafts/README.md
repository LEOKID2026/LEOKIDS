# Livre d'apprentissage des mathématiques de CP — Brouillons

**Statut :** Contenu brouillon uniquement. Aucun code. Pas d'interface utilisateur. Pas de SQL. Pas de validation/push/déploiement.
**Date :** juin 2026
**Dossier :** `docs/learning-book/math/g1/drafts/`

---

## Décisions du propriétaire (enregistrées)

| Decision | Status |
|----------|--------|
| Shared section 7 heading | **Approved for draft use:** `בואו נתרגל!` |
| Crocodile metaphor (`cmp.md`) | **Keep for CP draft:** `תנין רעב` — child-friendly, draft content only (not final owner-approved product copy) |
| Batch A Hebrew titles | **Accepted for continued draft use** — all remain `[DRAFT — not owner-approved]` |
| Batch B Hebrew titles | **Accepted for continued draft use** — all remain `[DRAFT — not owner-approved]` |
| `add_second_decade` title | **Draft use:** `חיבור בעשרייה השנייה — מספרים בין 11 ל־19` (keep concept "עשרייה השנייה", child-clear) |
| Ten-frame term | **Draft use:** `מסגרת עשר` (standardized; not "מסגרת של 10") |
| Place-value blocks | **Draft use:** `מקל עשרת`, `קוביות בודדות` |
| Even/odd method | **Pairing first**; last-digit rule as **טיפ** only |
| `add_tens_only` scope | **CP cap: 30** — use 10, 20, 30 only |
| Batch C Hebrew titles | **Accepted for continued draft use** — all remain `[DRAFT — not owner-approved]` |
| Batch C polish pass | **Accepted for continued draft use** (June 2026) |
| Batch D Hebrew titles | **Draft only** — all remain `[DRAFT — not owner-approved]` |
| Missing-number language | **Draft use:** `מספר חסר`, `מקום ריק` — not variables/algebra |
| Missing-number titles | **Draft use:** `משפט חיבור/חיסור עם מספר חסר` |
| `mul` example 4 × 3 = 12 | **Accepted for draft use** — within CP scope (product ≤ 20) |
| All pages | **`approval_status: draft`** — nothing moved to review/approved/active |

---

## Lot A - Fondations de lignes numériques / sens des nombres

**Focus :** Fondements des droites numériques et du sens des nombres

| File | learning_page_id | skill_id | page_type |
|------|------------------|----------|-----------|
| `ns_counting_forward.md` | `math:g1:ns_counting_forward` | `math:kind:ns_counting_forward` | visual_intuition |
| `ns_counting_backward.md` | `math:g1:ns_counting_backward` | `math:kind:ns_counting_backward` | visual_intuition |
| `ns_number_line.md` | `math:g1:ns_number_line` | `math:kind:ns_number_line` | visual_intuition |
| `ns_neighbors.md` | `math:g1:ns_neighbors` | `math:kind:ns_neighbors` | visual_intuition |
| `cmp.md` | `math:g1:cmp` | `math:kind:cmp` | visual_intuition |

### Lot A Statut Polonais

**Pass polonais terminé :** juin 2026

| Fix | Detail |
|-----|--------|
| Section 7 heading | **"בואו נתרגל!"** on all 5 pages |
| Typos | חיפושית, לפני המראה, קל לטעות |
| Scope wording | Negative-number note scoped to CP page |

---

## Lot B – Valeur de position / Fondements des opérations

**Focus :** Valeur de position, paire/impaire, compléments de 10, addition chez les adolescents, addition de dizaines entières

| File | learning_page_id | skill_id | page_type |
|------|------------------|----------|-----------|
| `ns_place_tens_units.md` | `math:g1:ns_place_tens_units` | `math:kind:ns_place_tens_units` | concept_foundation |
| `ns_even_odd.md` | `math:g1:ns_even_odd` | `math:kind:ns_even_odd` | concept_foundation |
| `ns_complement10.md` | `math:g1:ns_complement10` | `math:kind:ns_complement10` | visual_intuition |
| `add_second_decade.md` | `math:g1:add_second_decade` | `math:kind:add_second_decade` | concept_foundation |
| `add_tens_only.md` | `math:g1:add_tens_only` | `math:kind:add_tens_only` | visual_intuition |

All Batch B pages:
- `subject`: math
- `classe`: g1
- `age_band`: classes_1_2
- `approval_status`: **draft**
- Titre de la section 7 : **בואו נתרגל !**
- Tous les titres hébreux : **`[DRAFT — not owner-approved]`**

### Notes sur la portée du contenu du lot B

- `ns_place_tens_units` : nombres à deux chiffres jusqu'à 30 ; `מקל עשרת` / `קוביות בודדות`; pas de notation `+` étendue comme explication principale
- `ns_even_odd` : chiffres 1 à 20 ; **pairing first**; règle du dernier chiffre comme **טיפ** uniquement
- `ns_complement10` : paires totalisant 10 ; visual term **`מסגרת עשר`**
- `add_second_decade` : titre **`חיבור בעשרייה השנייה — מספרים בין 11 ל־19`** ; stratégie « terminer jusqu'à 10 » ; max sum 20
- `add_tens_only` : **10, 20, 30 uniquement** ; max sum 30; wording **`בכיתה א' נשתמש בעשרות 10, 20 ו־30`**

### Statut polonais du lot B

**Pass polonais terminé :** juin 2026

| Fix | Detail |
|-----|--------|
| `add_second_decade` title | Updated to **`חיבור בעשרייה השנייה — מספרים בין 11 ל־19`**; child-clear explanation of עשרייה שנייה throughout |
| Ten-frame term | Standardized to **`מסגרת עשר`** (`ns_complement10.md`) |
| Place-value terms | Standardized to **`מקל עשרת`**, **`קוביות בודדות`**; removed `10 + 7` style as main explanation |
| Even/odd | Pairing as main method; last-digit rule demoted to **טיפ**; clearer wording for 11 example |
| `add_tens_only` scope | Explicit **CP cap 30**; removed ellipsis implying 40/50/100 |

**Confirmation :** Toutes les pages du lot B restent **`approval_status: draft`**. Tous les titres restent **`[DRAFT — not owner-approved]`**.

---

## Lot C – Opération Fondations

**Focus :** Addition de base, soustraction, phrases avec nombres manquants, multiplication précoce (pas de problèmes de mots)

| File | learning_page_id | skill_id | page_type |
|------|------------------|----------|-----------|
| `add_two.md` | `math:g1:add_two` | `math:kind:add_two` | visual_intuition |
| `sub_two.md` | `math:g1:sub_two` | `math:kind:sub_two` | visual_intuition |
| `eq_add_simple.md` | `math:g1:eq_add_simple` | `math:kind:eq_add_simple` | concept_foundation |
| `eq_sub_simple.md` | `math:g1:eq_sub_simple` | `math:kind:eq_sub_simple` | concept_foundation |
| `mul.md` | `math:g1:mul` | `math:kind:mul` | visual_intuition |

Toutes les pages du lot C :
- `subject` : mathématiques
- `classe` : g1
- `age_band` : notes_1_2
- `approval_status` : **projet**
- Titre de la section 7 : **בואו נתרגל !**
- Tous les titres hébreux : **`[DRAFT — not owner-approved]`**

### Notes sur la portée du contenu du lot C

- `add_two` : rejoindre deux groupes ; droite numérique/objets ; totalise jusqu'à 30 ; pas d'ajout vertical
- `sub_two` : enlever / reculer ; pas en dessous de 0 ; pas d'emprunt ni de soustraction verticale
- `eq_add_simple` : numéro manquant comme puzzle ; `__` / `מספר חסר` ; des liens vers `מסגרת עשר` là où cela est utile
- `eq_sub_simple` : nombre manquant en soustraction ; droite numérique/objets concrets ; pas d'algèbre formelle
- `mul` : addition répétée / groupes égaux uniquement ; ** קבוצות עד 5, תוצאה עד 20**; `4 × 3 = 12` accepté ; pas d'horaire complet, pas de division

### Titres brouillons du lot C

| learning_page_id | Draft title |
|------------------|-------------|
| `math:g1:add_two` | חיבור של שני מספרים |
| `math:g1:sub_two` | חיסור של שני מספרים |
| `math:g1:eq_add_simple` | משפט חיבור עם מספר חסר |
| `math:g1:eq_sub_simple` | משפט חיסור עם מספר חסר |
| `math:g1:mul` | כפל — חיבור חוזר |

### Statut polonais du lot C

**Pass polonais terminé :** juin 2026

| Fix | Detail |
|-----|--------|
| `add_two.md` | `שני כמויות` → **`שתי כמויות`**; common-mistake section clarified (first number counted as first jump) |
| `sub_two.md` | Fixed 8−3 visual: **3 נלקחו, 5 נשארו** (was reversed) |
| `eq_add_simple.md` | `לעוד` → **`להוסיף`** |
| `eq_sub_simple.md` | Simplified missing-start-number wording; fixed 8−__=3 visual (**5 נלקחו, 3 נשארו**) |
| `mul.md` | Removed child-facing **`גורמים`**; scope wording **`בכיתה א' נשתמש בכפל קטן: קבוצות עד 5, והתוצאה עד 20`** |

**Confirmation :** Toutes les pages du lot C restent **`approval_status: draft`**. Tous les titres restent **`[DRAFT — not owner-approved]`**.

**Polissage du lot C accepté :** juin 2026 — le propriétaire a confirmé l'utilisation continue du brouillon (titres, langue avec nombres manquants, `4 × 3 = 12`, portée de multiplication).

**Polissage reporté :** `add_two.md` exemple travaillé — `ספרו את הכל` → **`ספרו עוד 3 אחרי 5: 6, 7, 8`**

---

## Lot D – Problèmes de mots

**Focus :** Lecture de problèmes de mots simples : pièces de monnaie, dépenses/monnaie, jours et calendrier

| File | learning_page_id | skill_id | page_type |
|------|------------------|----------|-----------|
| `wp_coins.md` | `math:g1:wp_coins` | `math:kind:wp_coins` | word_problem_strategy |
| `wp_coins_spent.md` | `math:g1:wp_coins_spent` | `math:kind:wp_coins_spent` | word_problem_strategy |
| `wp_time_date.md` | `math:g1:wp_time_date` | `math:kind:wp_time_date` | word_problem_strategy |
| `wp_time_days.md` | `math:g1:wp_time_days` | `math:kind:wp_time_days` | word_problem_strategy |

Toutes les pages du lot D :
- `subject` : mathématiques
- `classe` : g1
- `age_band` : notes_1_2
- `approval_status` : **projet**
- Titre de la section 7 : **בואו נתרגל !**
- Tous les titres hébreux : **`[DRAFT — not owner-approved]`**

### Notes sur la portée du contenu du lot D

- `wp_coins` : valeurs des pièces additionnées ; « combien en tout ? » ; addition répétée uniquement ; pas de dépenses/changement, pas de multiplication
- `wp_coins_spent` : avait / dépensé / est parti ; changement simple (payé 10, coût 7, changement 3); soustraction uniquement ; pas d'achats multi-articles
- `wp_time_date` : jours de la semaine ; aujourd'hui/demain/hier ; « dans 2 jours » ; pas d'horloge, pas de mois/années
- `wp_time_days` : comptage des jours en avant/en arrière sur une ligne de jours de la semaine ; dans un délai d'une semaine ; pas d'horloge, pas de mois/années

### Titres brouillons du lot D

| learning_page_id | Draft title |
|------------------|-------------|
| `math:g1:wp_coins` | שאלות מילוליות — ערך מטבעות |
| `math:g1:wp_coins_spent` | שאלות מילוליות — כמה נשאר או עודף |
| `math:g1:wp_time_date` | שאלות מילוליות — ימים ותאריכים |
| `math:g1:wp_time_days` | שאלות מילוליות — מרחק בין ימים |

**Confirmation :** Toutes les pages du lot D restent **`approval_status: draft`**. Tous les titres restent **`[DRAFT — not owner-approved]`**.

### Statut polonais du lot D

**Pass polonais terminé :** juin 2026

| Fix | Detail |
|-----|--------|
| `wp_coins.md` | Fixed worked-example arithmetic: **12₪ → 13₪** (`5 + 5 + 1 + 1 + 1 = 13`); visual example **5 + 5 + 2 = 12** unchanged |
| `wp_time_days.md` | Clarified day-counting common mistake — do not count start day as first jump; do not stop before target day |

**Confirmation :** Toutes les **19** pages restent **`approval_status: draft`**. Tous les titres restent **`[DRAFT — not owner-approved]`**. Aucun code, interface utilisateur, registre d'exécution, SQL, validation, push ou déploiement.

---

## Résumé de toutes les pages brouillon

| Batch | Files | Status |
|-------|-------|--------|
| A | 5 | draft |
| B | 5 | draft |
| C | 5 | draft |
| D | 4 | draft |
| **Total** | **19** | **all draft** |

**Livre d'apprentissage des mathématiques de CP :** Toutes les **19** pages de compétences existent désormais sous forme de brouillons dans ce dossier.

---

## Documents sources utilisés

| Document | Role |
|----------|------|
| `docs/learning-book/MATH_LEARNING_BOOK_MASTER_PLAN.md` | Product rules, hard constraints, age-band policy |
| `docs/learning-book/MATH_LEARNING_BOOK_CURRICULUM_MAP.md` | Skill IDs, page types, grade scope |
| `docs/learning-book/MATH_GRADE_1_LEARNING_BOOK_COVERAGE.md` | Per-skill content guidance and exclusions |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Grades 1–2 section structure |
| `docs/learning-book/MATH_LEARNING_BOOK_IMPLEMENTATION_NOTES.md` | No-fallback and approval lifecycle reference |
| `data/curriculum-spine/v1/skills.json` | Canonical skill_id registry |
| `utils/math-constants.js` | CP number range (0–30 max) |

---

## Confirmation

- Toutes les **19** pages d'apprentissage sont **un brouillon uniquement** (`approval_status: draft`).
- Aucune page n'est définie sur `review`, `approved` ou `active`.
- Tous les titres hébreux restent **`[DRAFT — not owner-approved]`**.
- **Aucun code d'application** n'a été modifié.
- **Aucune interface utilisateur ni aucun bouton** n'ont été ajoutés.
- **Aucun fichier de registre d'exécution** n'a été créé.
- **Aucune copie du produit en hébreu dans l'application** n'a été modifiée.
- **Aucun SQL** n'a été exécuté.
- **Aucun commit, push ou déploiement** n'a été effectué.

---

## Questions ouvertes pour l'examen du propriétaire

### Lot B - résolu pour une utilisation en brouillon (passe de polissage)

Les éléments suivants ont été décidés pour une utilisation continue **ébauche** (et non la copie finale du produit approuvée par le propriétaire) :

| Topic | Decision |
|-------|----------|
| `add_second_decade` title | `חיבור בעשרייה השנייה — מספרים בין 11 ל־19` |
| Ten-frame | `מסגרת עשר` |
| Place value | `מקל עשרת`, `קוביות בודדות` |
| Even/odd | Pairing first; last-digit as **טיפ** |
| `add_tens_only` | Cap at 30; 10, 20, 30 only |

### Lot C - résolu pour une utilisation en brouillon (passe de polissage)

| Topic | Decision |
|-------|----------|
| Missing-number titles | `משפט חיבור/חיסור עם מספר חסר` |
| Missing-number language | `מספר חסר`, `מקום ריק` |
| `4 × 3 = 12` in `mul.md` | Accepted — within CP scope (product ≤ 20) |

### Encore ouvert (Lot A + général)

1. **"שכן לפני / שכן אחרי"** — confirme la correspondance linguistique en classe.
2. **Direction de la ligne numérique RTL** — confirmez que 0 à gauche correspond aux visuels du produit.
3. **Actifs visuels** — descriptions textuelles uniquement ; confirmer les atouts illustrés pour la phase 1.
4. **Approbation finale du titre** — les 19 pages restent `[DRAFT — not owner-approved]` jusqu'à l'approbation explicite du propriétaire.

### Lot D – en attente d'examen par le propriétaire

| Topic | Notes |
|-------|-------|
| Word-problem reading frame | `מה יודעים?` / `מה מבקשים?` / `מה עושים?` on all 4 pages |
| Ajout de pièces | Repeated addition only — no multiplication on `wp_coins` |
| `wp_coins_spent` title | Draft: `שאלות מילוליות — כמה נשאר או עודף` |
| Calendar scope | Weekday names only — no clock, no month/year arithmetic |
| Day-counting | Within one week; same "don't count start as first jump" pattern as number line |

---

## Étape suivante recommandée

1. **Créez le document de décision/approbation de niveau 1** — consolidez tous les projets de décisions du propriétaire (lots A à D), les questions ouvertes et la liste de contrôle d'approbation pour `draft` → `review`.
2. **Examen par le propriétaire** de la passe de polissage du lot D et de l'ensemble complet de brouillons de niveau 1.
3. Après l'approbation de la CP, envisagez un **addendum au guide de style hébreu**, puis commencez la CE1 ou la planification de la mise en œuvre.

**Ne passez pas au niveau 2 ou à la mise en œuvre tant que le document d'approbation du niveau 1 n'a pas été examiné.**
