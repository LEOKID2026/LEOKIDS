# Livro de aprendizagem de matemática da 5ª série - Rascunhos

**Status:** Todos os lotes criados — **40/40** páginas de rascunho concluídas (Lotes A–H). Revisão do proprietário pendente.  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/math/g5/drafts/`

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/MATH_GRADE_5_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **40/40** (Lotes A–H) |
| Pacote de revisão | ✅ `docs/learning-book/MATH_GRADE_5_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-math-g5-book-content.mjs` |
| Rascunho do manifesto (somente scripts) | ✅ `scripts/lib/math-g5-draft-manifest.mjs` |
| Rascunho da fonte de conteúdo (somente scripts) | ✅ `scripts/lib/math-g5-draft-content.mjs` |
| Gerador de tiragem (regeneração opcional) | ✅ `scripts/gen-math-g5-drafts.mjs` |
| Registro/rotas em tempo de execução | ❌ Fora do escopo — tarefa somente de conteúdo |
| Pratique o resolvedor CTA (G5) | ❌ Não criado — sem mapeamentos falsos |

---

## Fonte da Verdade

| Documento/arquivo | Função |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Todas as 40 entradas de matemática da 5ª série `skill_id` no escopo |
| `docs/learning-book/MATH_GRADE_5_LEARNING_BOOK_PLAN.md` | Lista de páginas, lotes, limites |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Modelo de sete seções (faixa etária de 5ª a 6ª série) |
| `docs/learning-book/math/g1/drafts/`… `g4/drafts/` | Apenas referência de estilo — **não modificado** |
| `utils/math-constants.js` | Somente contexto de operações de ano 5 |

---

## Lote A — ערך מקום, השוואה, סדרות ועיגול (6)

| Arquivo | Título do rascunho |
|------|-------------|
| `ns_place_hundreds.md` | ערך המקום — עד 100.000 |
| `ns_neighbors.md` | שכנים — 100.000 |
| `ns_complement100.md` | השלמה ל-100 |
| `cmp.md` | השוואת מספרים — עד 100.000 |
| `sequence.md` | סדרות — קפיצות גדולות |
| `round.md` | עיגול — עשרות אלפים |

---

## Lote B — חיבור, חיסור וכפל (4)

| Arquivo | Título do rascunho |
|------|-------------|
| `add_two.md` | חיבור — 100.000 |
| `sub_two.md` | חיסור — 100.000 |
| `add_three.md` | חיבור שלושה מספרים |
| `mul.md` | כפל — אסטרטגיות |

---

## Lote C — חילוק (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `div.md` | חילוק — חלוקה שווה |
| `div_with_remainder.md` | חילוק עם שארית |
| `div_two_digit.md` | חילוק במחלק דו-ספרתי |

---

## Lote D — שברים (5)

| Arquivo | Título do rascunho |
|------|-------------|
| `frac_reduce.md` | צמצום שבר |
| `frac_expand.md` | הרחבת שבר |
| `frac_add_sub.md` | חיבור וחיסור שברים |
| `mixed_to_frac.md` | מספר מעורב לשבר |
| `frac_to_mixed.md` | שבר למספר מעורב |

---

## Lote E — עשרוניים ומשוואות (6)

| Arquivo | Título do rascunho |
|------|-------------|
| `dec_add.md` | חיבור עשרוניים |
| `dec_sub.md` | חיסור עשרוניים |
| `eq_add.md` | משוואת חיבור |
| `eq_sub.md` | משוואת חיסור |
| `eq_mul.md` | משוואת כפל |
| `eq_div.md` | משוואת חילוק |

---

## Lote F — גורמים, כפולות, מ.א.ח ואומדן (6)

| Arquivo | Título do rascunho |
|------|-------------|
| `fm_factor.md` | גורמים |
| `fm_multiple.md` | כפולות |
| `fm_gcd.md` | המחלק המשותף הגדול ביותר (מ.א.ח) |
| `est_add.md` | אומדן חיבור |
| `est_mul.md` | אומדן כפל |
| `est_quantity.md` | אומדן כמות |

---

## Lote G — אחוזים (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `perc_part_of.md` | אחוז מכמות |
| `perc_discount.md` | הנחה באחוזים |

---

## Lote H — שאלות מילוליות (8)

| Arquivo | Título do rascunho |
|------|-------------|
| `wp_comparison_more.md` | כמה יותר? |
| `wp_leftover.md` | Você não? |
| `wp_time_sum.md` | סכום זמנים |
| `wp_multi_step.md` | שאלה מרובת שלבים |
| `wp_distance_time.md` | מרחק, זמן, מהירות |
| `wp_shop_discount.md` | קניות והנחה |
| `wp_unit_cm_to_m.md` | ס״מ ↔ מטר |
| `wp_unit_g_to_kg.md` | גרם ↔ ק״ג |

---

## Notas

- `book_placeholder.md` — espaço reservado para infraestrutura; **não** faz parte do livro de 40 páginas.
- Todas as páginas: `age_band: grades_5_6`, `approval_status: draft`, `grade: g5`.
- Seção 7: apenas rascunho do texto do convite — **sem roteamento prático**.
- A cópia voltada para crianças usa **חשבון**, não **מתמטיקה**.
- Milhares agrupados (`1,000`, `10,000`, `48,726`) aparecem em muitas páginas — o renderizador deve isolar o LTR.

---

## Gerar novamente rascunhos/pacote de revisão

```bash
node scripts/gen-math-g5-drafts.mjs
node scripts/build-math-g5-hebrew-review-pack.mjs
node scripts/verify-math-g5-book-content.mjs
```

---

## Regra de parada explícita

Até que o proprietário aprove o conteúdo:

- ❌ Sem registro, rotas, SQL, commit, push ou implantação
- ✅ Somente documentação e remarcação de rascunho