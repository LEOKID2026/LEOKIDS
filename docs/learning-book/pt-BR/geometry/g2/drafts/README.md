# Livro de aprendizagem de geometria da 2ª série - Rascunhos

**Status:** Todos os lotes criados — **3/3** páginas de rascunho concluídas. Revisão do proprietário pendente.  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/geometry/g2/drafts/`

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/GEOMETRY_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **3/3** (Lotes A–C) |
| Pacote de revisão | ✅ `docs/learning-book/GEOMETRY_GRADE_2_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-geometry-g2-book-content.mjs` |
| Rascunho do manifesto (somente scripts) | ✅ `scripts/lib/geometry-g2-draft-manifest.mjs` |
| Registro/rotas em tempo de execução | ✅ com fio (`geometry-g2-registry`, `/learning/book/geometry/g2`) |

---

## Nomenclatura

- O conteúdo do livro voltado para crianças usa **גאומטריה**, não **הנדסה**.
- IDs internos: `geometry:g2:{pageId}`, `subject: geometry`.

---

## Lote A — גופים (1)

| Arquivo | Título do rascunho |
|------|-------------|
| `solids.md` | גופים תלת־ממדיים — שמות והיכרות |

---

## Lote B — שטח (1)

| Arquivo | Título do rascunho |
|------|-------------|
| `square_area.md` | שטח של ריבוע |

---

## Lote C — הזזה ושיקוף (1)

| Arquivo | Título do rascunho |
|------|-------------|
| `transformations.md` | הזזה ושיקוף — המשך |

---

## Notas

- `book_placeholder.md` — espaço reservado para infraestrutura; **não** faz parte do livro de 3 páginas.
- Todas as páginas: `age_band: grades_1_2`, `approval_status: draft`, `grade: g2`.
- As páginas G1 para `shapes_basic_square` / `shapes_basic_rectangle` não são repetidas — essas habilidades terminam no Ano 1 na lombada.
- `geometry:kind:no_question` — apenas meta; nenhuma página de aprendizagem.

---

## Regenerar pacote de revisão

```bash
node scripts/build-geometry-g2-hebrew-review-pack.mjs
node scripts/verify-geometry-g2-book-content.mjs
```

---

## Regra de parada explícita

Até que o proprietário aprove o conteúdo:

- ❌ Sem registro, rotas, SQL, commit, push ou implantação
- ✅ Somente documentação e remarcação de rascunho