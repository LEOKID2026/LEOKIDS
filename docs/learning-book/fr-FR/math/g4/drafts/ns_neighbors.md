# Nombre de voisins – Traverser des milliers

## Métadonnées

| Field | Value |
|-------|-------|
| **learning_page_id** | `math:g4:ns_neighbors` |
| **skill_id** | `math:kind:ns_neighbors` |
| **subject** | math |
| **grade** | g4 |
| **age_band** | grades_3_4 |
| **page_type** | practice_bridge |
| **approval_status** | launch_ready |
| **title_english** | Number Neighbors — Large Numbers |

**Références sources :**
- `data/curriculum-spine/v1/skills.json`
- `docs/learning-book/MATH_LEARNING_BOOK_CURRICULUM_MAP.md`
- `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md`

**Portée du contenu :** Le nombre avant et après sur la droite numérique. Jusqu'à 10 000. Pas de grands sauts.

---

## 1. Qu’apprenons-nous ?

Aujourd'hui, nous trouverons des voisins en grand nombre, jusqu'à 10 000.
±1 même en franchissant mille — par exemple 1 999 → 2 000 → 2 001.

---

## 2. Explication simple

Voisin avant = −1
Voisin après = +1
2 450 :
- avant : 2 449
- après : 2 451
Traverser mille :
- 1 999 → après = 2 000
- 2 000 → avant = 1 999
Valeur de position : lorsque tu franchissez mille, tous les chiffres peuvent changer, mais le saut est toujours de 1.

---

## 3. Exemple visuel / concret

3 628 :
3 628 − 1 = 3 627
3 628 + 1 = 3 629
2 999 → 3 000 : le voisin après 2 999 = 3 000 — franchissant le millier, toujours juste +1.
3 626 — 3 627 — [3 628] — 3 629 — 3 630

---

## 4. Résolvons ensemble

Quels sont les voisins de 2 450 ?
Avant = 2 450 − 1 = 2 449
Après = 2 450 + 1 = 2 451
2 449 et 2 451

---

## 5. Essaie-le tu-même

Quel est le voisin avant et après le nombre 3 999 ?
Essaie de le résoudre par tu-même.
Sur la page suivante, nous vérifierons ensemble les étapes et la réponse.

---

## 6. Erreur courante : attention !

Quel est le voisin avant et après le nombre 3 999 ?
Avant = 3 999 − 1 = 3 998.
Après = 3 999 + 1 = 4 000 (passer mille – toujours juste +1).
Avant 3 998, après 4 000

---

## 7. Pratiquons-nous !

Tu connaissez maintenant le nombre de voisins jusqu'à 10 000, y compris des milliers de croisements.
En pratique tu retrouverez ce qui précède ?
Et qu'est-ce qui vient après ? Juste ±1 !
