# Livro de aprendizagem de geometria da 5ª série - Rascunhos

**Status:** Todos os lotes criados — **17/17** páginas de rascunho concluídas (Lotes A–G). Revisão do proprietário pendente.  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/geometry/g5/drafts/`  
**Título do livro (voltado para crianças):** ספר גאומטריה — כיתה ה׳

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/GEOMETRY_GRADE_5_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **17/17** (Lotes A – G) |
| Pacote de revisão | ✅ `docs/learning-book/GEOMETRY_GRADE_5_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-geometry-g5-book-content.mjs` |
| Projeto de manifesto | ✅ `scripts/lib/geometry-g5-draft-manifest.mjs` |
| Registro/rotas em tempo de execução | ❌ Fora do escopo |

---

## Lote A — מקבילות, מרובעים וזוויות (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `parallel_perpendicular.md` | קווים מקבילים ומאונכים |
| `quadrilaterals.md` | סיווג מרובעים — כיתה ה׳ |
| `triangle_angles.md` | זוויות במשולש |

## Lote B — היקף ושטח — ריבוע ומשולש (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `square_perimeter.md` | היקף ריבוע |
| `triangle_perimeter.md` | היקף משולש |
| `square_area.md` | שטח ריבוע |

## Lote C — שטח — מקבילית וטרפז (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `parallelogram_area.md` | שטח מקבילית |
| `trapezoid_area.md` | שטח טרפז |

## Lote D — גובה במצולעים (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `heights_triangle.md` | גובה במשולש |
| `heights_parallelogram.md` | גובה במקבילית |
| `heights_trapezoid.md` | גובה בטרפז |

## Lote E — אלכסונים (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `diagonal_square.md` | אלכסון בריבוע |
| `diagonal_rectangle.md` | אלכסון במלבן |
| `diagonal_parallelogram.md` | אלכסון במקבילית |

## Lote F — גופים ונפח (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `solids.md` | גופים תלת-ממדיים — חזרה |
| `rectangular_prism_volume.md` | נפח תיבה |

## Lote G — ריצוף (1)

| Arquivo | Título do rascunho |
|------|-------------|
| `tiling.md` | ריצוף במישור |

---

## Notas

- Todas as páginas: `age_band: grades_5_6`, `approval_status: draft`, `grade: g5`.
- A cópia voltada para crianças usa **גאומטריה**, não **הנדסה**.
- Seção 7: rascunho apenas para convite — **sem roteamento prático**.
- `book_placeholder.md` — espaço reservado para infraestrutura; **não** faz parte do livro de 17 páginas.

---

## Regenerar

```bash
node scripts/generate-geometry-g5-drafts.mjs
node scripts/build-geometry-g5-hebrew-review-pack.mjs
node scripts/verify-geometry-g5-book-content.mjs
```