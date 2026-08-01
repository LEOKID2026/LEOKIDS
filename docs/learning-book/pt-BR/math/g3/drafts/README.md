# Livro de aprendizagem de matemática da 3ª série - Rascunhos

**Status:** Todos os lotes criados — **26/26** páginas de rascunho concluídas (Lotes A + B + C + D). Revisão do proprietário pendente.  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/math/g3/drafts/`

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **26/26** (Lotes A + B + C + D) |
| Pacote de revisão | ✅ `docs/learning-book/MATH_GRADE_3_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-math-g3-book-content.mjs` |
| Registro/rotas em tempo de execução | ❌ Fora do escopo — tarefa somente de conteúdo |
| Pratique o resolvedor CTA (G3) | ❌ Não criado — sem mapeamentos falsos |

---

## Fonte da Verdade

| Documento/arquivo | Função |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Todas as 26 entradas de matemática da 3ª série `skill_id` no escopo |
| `docs/learning-book/MATH_GRADE_3_LEARNING_BOOK_PLAN.md` | Lista de páginas, lotes, limites |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Modelo de sete seções da Seção B (3ª a 4ª séries) |
| `docs/learning-book/math/g1/drafts/`, `math/g2/drafts/` | Apenas referência de estilo — **não modificado** |
| `utils/math-constants.js` | Contexto operacional do ano 3 |

---

## Lote A — יסודות מספרים, השוואה וסדרות (7)

| Arquivo | Título do rascunho |
|------|-------------|
| `ns_place_hundreds.md` | מאות, עשרות ואחדות — עד 1.000 |
| `ns_neighbors.md` | שכנים של מספר — עד 1.000 |
| `ns_complement10.md` | זוגות שמרכיבים 10 — חזרה |
| `ns_complement100.md` | זוגות שמרכיבים 100 |
| `ns_even_odd.md` | זוגי ואי-זוגי — מספרים גדולים |
| `cmp.md` | Mais de 1.000 |
| `sequence.md` | סדרות מספרים |

---

## Lote B — חיבור, חיסור, כפל וחילוק (9)

| Arquivo | Título do rascunho |
|------|-------------|
| `add_two.md` | חיבור שני מספרים — עד 1.000 |
| `sub_two.md` | חיסור שני מספרים — עד 1.000 |
| `add_three.md` | חיבור שלושה מספרים |
| `mul.md` | כפל — לוח הכפל |
| `mul_tens.md` | כפל בעשרות |
| `mul_hundreds.md` | כפל במאות |
| `div.md` | חילוק — חלוקה שווה |
| `div_with_remainder.md` | חילוק עם שארית |
| `divisibility.md` | התחלקות ב-2, ב-5 e וב-10 |

---

## Lote C — משוואות, עשרוניים וסדר פעולות (7)

| Arquivo | Título do rascunho |
|------|-------------|
| `eq_add.md` | משוואת חיבור — מספר חסר |
| `eq_sub.md` | משוואת חיסור — מספר חסר |
| `dec_add.md` | חיבור עשרוניים |
| `dec_sub.md` | חיסור עשרוניים |
| `order_add_mul.md` | סדר פעולות — חיבור וכפל |
| `order_mul_sub.md` | סדר פעולות — כפל וחיסור |
| `order_parentheses.md` | סוגריים בחישוב |

---

## Lote D — שאלות מילוליות (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `wp_comparison_more.md` | שאלה מילולית — כמה יותר? |
| `wp_leftover.md` | שאלה מילולית — מה נשאר? |
| `wp_time_sum.md` | שאלה מילולית — סכום זמנים |

---

## Notas

- `book_placeholder.md` — espaço reservado para infraestrutura de expansão de estrutura; **não** faz parte do livro de 26 páginas.
- Todas as páginas: `age_band: grades_3_4`, `approval_status: draft`.
- Seção 7: apenas rascunho do texto do convite — **sem roteamento prático**.
- A cópia voltada para crianças usa **חשבון**, não **מתמטיקה**.

---

## Regenerar pacote de revisão

```bash
node scripts/build-math-g3-hebrew-review-pack.mjs
node scripts/verify-math-g3-book-content.mjs
```

---

## Regra de parada explícita

Até que o proprietário aprove o conteúdo:

- ❌ Sem registro, rotas, SQL, commit, push ou implantação
- ✅ Somente documentação e remarcação de rascunho