# Livro de aprendizagem de geometria da 3ª série - Rascunhos

**Status:** **Aprovado pelo proprietário** — **9/9** páginas; tempo de execução conectado.  
**Aprovação:** `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md`  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/geometry/g3/drafts/`

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_PLAN.md` |
| Aprovação do proprietário | ✅ `docs/learning-book/GEOMETRY_GRADE_3_LEARNING_BOOK_SIGNOFF.md` |
| Rascunho de páginas | ✅ **9/9** (Lotes A–E) |
| Rotas de tempo de execução | ✅ `/learning/book/geometry/g3` + `[pageId]` |
| Pacote de revisão | ✅ `docs/learning-book/GEOMETRY_GRADE_3_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificador | ✅ `scripts/verify-geometry-g3-book-content.mjs` |
| Manifesto | ✅ `scripts/lib/geometry-g3-draft-manifest.mjs` |

---

##Lotes

| Lote | Páginas |
|-------|--------|
| **A** | `triangles`, `quadrilaterals` |
| **B** | `parallel_perpendicular` |
| **C** | `square_area`, `square_perimeter`, `triangle_perimeter` |
| **D** | `triangle_angles` |
| **E** | `rotation`, `solids` |

---

## Nomenclatura

- Voltado para crianças: **גאומטריה** (não הנדסה).
- IDs: `geometry:g3:{pageId}`, `age_band: grades_3_4`.

---

## Regenerar

```bash
node scripts/build-geometry-g3-hebrew-review-pack.mjs
node scripts/verify-geometry-g3-book-content.mjs
```

---

## Parar regra

Nenhum registro, rotas, SQL, commit, push ou implantação até que o proprietário aprove o conteúdo.