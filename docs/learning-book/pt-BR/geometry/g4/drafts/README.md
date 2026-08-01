# Livro de aprendizagem de geometria da 4ª série - Rascunhos

**Status:** Todos os lotes criados — **14/14** páginas de rascunho concluídas. Revisão do proprietário pendente.  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/geometry/g4/drafts/`

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/GEOMETRY_GRADE_4_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas | ✅ **14/14** (Lotes A–E) |
| Pacote de revisão | ✅ `docs/learning-book/GEOMETRY_GRADE_4_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificador | ✅ `scripts/verify-geometry-g4-book-content.mjs` |
| Manifesto | ✅ `scripts/lib/geometry-g4-draft-manifest.mjs` |
| Registro/rotas em tempo de execução | ✅ com fio (`geometry-g4-registry`, `/learning/book/geometry/g4`) |

---

##Lotes

| Lote | Páginas |
|-------|--------|
| **A** | `shapes_basic_properties_square`, `shapes_basic_properties_rectangle`, `shapes_basic_properties_angles`, `symmetry` |
| **B** | `quadrilaterals`, `parallel_perpendicular` |
| **C** | `square_perimeter`, `square_area`, `triangle_perimeter`, `triangle_angles` |
| **D** | `diagonal_square`, `diagonal_rectangle` |
| **E** | `solids`, `rectangular_prism_volume` |

---

## Nomenclatura

- Título do livro: **ספר גאומטריה — כיתה ד׳** (não **הנדסה**).
- IDs: `geometry:g4:{pageId}`, `age_band: grades_3_4`.

---

## Regenerar

```bash
node scripts/build-geometry-g4-hebrew-review-pack.mjs
node scripts/verify-geometry-g4-book-content.mjs
```

---

## Parar regra

Conteúdo aprovado – tempo de execução conectado. Sem SQL, commit, push ou implantação sem solicitação do proprietário.