# Livro de aprendizagem de matemática da 4ª série - Rascunhos

**Status:** Todos os lotes criados — **37/37** páginas de rascunho concluídas (Lotes A–G). Revisão do proprietário pendente.  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/math/g4/drafts/`

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/MATH_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **37/37** (Lotes A – G) |
| Pacote de revisão | ✅ `docs/learning-book/MATH_GRADE_4_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-math-g4-book-content.mjs` |
| Rascunho do manifesto (somente scripts) | ✅ `scripts/lib/math-g4-draft-manifest.mjs` |
| Registro/rotas em tempo de execução | ❌ Fora do escopo — tarefa somente de conteúdo |
| Pratique o resolvedor CTA (G4) | ❌ Não criado — sem mapeamentos falsos |

---

## Fonte da Verdade

| Documento/arquivo | Função |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Todas as 37 entradas de matemática da 4ª série `skill_id` no escopo |
| `docs/learning-book/MATH_GRADE_4_LEARNING_BOOK_PLAN.md` | Lista de páginas, lotes, limites |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Modelo de sete seções da Seção B (3ª a 4ª séries) |
| `docs/learning-book/math/g1/drafts/`, `g2/drafts/`, `g3/drafts/` | Apenas referência de estilo — **não modificado** |
| `utils/math-constants.js` | Somente contexto de operações de ano 4 |

---

## Lote A — ערך מקום, השוואה, סדרות ועיגול (8)

| Arquivo | Título do rascunho |
|------|-------------|
| `ns_place_hundreds.md` | ערך המקום — אלפים ועד 10.000 |
| `ns_neighbors.md` | שכנים — מספרים גדולים |
| `ns_complement100.md` | השלמה ל-100 |
| `ns_complement10.md` | זוגות ל-10 — חזרה |
| `ns_even_odd.md` | זוגי/אי-זוגי — מספרים גדולים |
| `cmp.md` | השוואת מספרים גדולים |
| `sequence.md` | סדרות — קפיצות גדולות |
| `round.md` | עיגול לעשרות/מאות/אלפים |

---

## Lote B — תכונות 0 ו-1 (4)

| Arquivo | Título do rascunho |
|------|-------------|
| `zero_add.md` | חיבור עם 0 |
| `zero_sub.md` | חיסור 0 |
| `zero_mul.md` | כפל ב-0 |
| `one_mul.md` | כפל ב-1 |

---

## Lote C — חיבור, חיסור וכפל (5)

| Arquivo | Título do rascunho |
|------|-------------|
| `add_two.md` | חיבור שני מספרים — עד 10.000 |
| `sub_two.md` | חיסור שני מספרים — עד 10.000 |
| `add_three.md` | חיבור שלושה מספרים |
| `mul.md` | כפל — לוח הכפל ואסטרטגיות |
| `mul_vertical.md` | כפל במאונך |

---

## Lote D — חילוק, התחלקות, ראשוניים, גורמים וכפולים (8)

| Arquivo | Título do rascunho |
|------|-------------|
| `div.md` | חילוק — חלוקה שווה |
| `div_with_remainder.md` | חילוק עם שארית |
| `div_long.md` | חילוק ארוך |
| `divisibility.md` | התחלקות — 2, 3, 5, 6, 9, 10 |
| `prime_composite.md` | מספרים ראשוניים ופריקים |
| `fm_factor.md` | גורמים של מספר |
| `fm_multiple.md` | כפולות של מספר |
| `fm_gcd.md` | מ.א.ח |

---

## Lote E — עשרוניים, משוואות ואומדן (7)

| Arquivo | Título do rascunho |
|------|-------------|
| `dec_add.md` | חיבור עשרוניים — שתי ספרות |
| `dec_sub.md` | חיסור עשרוניים — שתי ספרות |
| `eq_add.md` | משוואת חיבור — מספר חסר |
| `eq_sub.md` | משוואת חיסור — מספר חסר |
| `est_add.md` | הערכת תוצאה — חיבור |
| `est_mul.md` | הערכת תוצאה — כפל |
| `est_quantity.md` | הערכת כמות |

---

## Lote F — חזקות (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `power_base.md` | חזקה — בסיס ומעריך |
| `power_calc.md` | חזקה — חישוב |

---

## Lote G — שאלות מילוליות (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `wp_comparison_more.md` | שאלה מילולית — כמה יותר? |
| `wp_leftover.md` | שאלה מילולית — מה נשאר? |
| `wp_time_sum.md` | שאלה מילולית — סכום זמנים |

---

## Notas

- `book_placeholder.md` — espaço reservado para infraestrutura; **não** faz parte do livro de 37 páginas.
- Todas as páginas: `age_band: grades_3_4`, `approval_status: draft`, `grade: g4`.
- Seção 7: apenas rascunho do texto do convite — **sem roteamento prático**.
- A cópia voltada para crianças usa **חשבון**, não **מתמטיקה**.
- Milhares agrupados (`1,000`, `10,000`) aparecem em muitas páginas — o renderizador deve isolar o LTR (consulte a correção G3 Bidi).

---

## Regenerar pacote de revisão

```bash
node scripts/build-math-g4-hebrew-review-pack.mjs
node scripts/verify-math-g4-book-content.mjs
```

---

## Regra de parada explícita

Até que o proprietário aprove o conteúdo:

- ❌ Sem registro, rotas, SQL, commit, push ou implantação
- ✅ Somente documentação e remarcação de rascunho