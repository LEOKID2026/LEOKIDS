# Livro de aprendizagem de geometria da 6ª série - Rascunhos

**Status:** Todos os lotes criados — **19/19** páginas de rascunho concluídas (Lotes A–G). Revisão do proprietário pendente.  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/geometry/g6/drafts/`  
**Título do livro (voltado para crianças):** ספר גאומטריה — כיתה ו׳

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/GEOMETRY_GRADE_6_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **19/19** (Lotes A – G) |
| Pacote de revisão | ✅ `docs/learning-book/GEOMETRY_GRADE_6_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-geometry-g6-book-content.mjs` |
| Projeto de manifesto | ✅ `scripts/lib/geometry-g6-draft-manifest.mjs` |
| Registro/rotas em tempo de execução | ❌ Fora do escopo |

---

## Lote A — היקף, שטח וזוויות (6)

| Arquivo | Título do rascunho |
|------|-------------|
| `square_perimeter.md` | היקף ריבוע — כיתה ו׳ |
| `triangle_perimeter.md` | היקף משולש — כיתה ו׳ |
| `square_area.md` | שטח ריבוע — כיתה ו׳ |
| `parallelogram_area.md` | שטח מקבילית — כיתה ו׳ |
| `trapezoid_area.md` | שטח טרפז — כיתה ו׳ |
| `triangle_angles.md` | זוויות במשולש — כיתה ו׳ |

## Lote B — מעגל ועיגול (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `circle_perimeter.md` | היקף מעגל |
| `circle_area.md` | שטח עיגול |

## Lote C — משפט פיתגורס (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `pythagoras_hyp.md` | משפט פיתגורס — מציאת יתר |
| `pythagoras_leg.md` | משפט פיתגורס — מציאת ניצב |

## Lote D — גופים ונפח בסיסי (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `solids.md` | גופים — גליל, פירמידה, חרוט, כדור |
| `rectangular_prism_volume.md` | נפח תיבה — כיתה ו׳ |

## Lote E — נפח מנסרות (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `prism_volume_rectangular.md` | נפח מנסרה — בסיס מלבן |
| `prism_volume_triangle.md` | נפח מנסרה — בסיס משולש |

## Lote F — נפח פירמידות (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `pyramid_volume_square.md` | נפח פירמידה — בסיס ריבוע |
| `pyramid_volume_rectangular.md` | נפח פירמידה — בסיס מלבן |

## Lote G — נפח גליל, חרוט וכדור (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `cylinder_volume.md` | נפח גליל |
| `cone_volume.md` | נפח חרוט |
| `sphere_volume.md` | נפח כדור |

---

## Notas

- Todas as páginas: `age_band: grades_5_6`, `approval_status: draft`, `grade: g6`.
- A cópia voltada para crianças usa **גאומטריה**, não **הנדסה**.
- A Seção 5 e a Seção 6 usam o **mesmo problema de geometria** (mesmos números, unidades, história).
- Seção 7: rascunho apenas para convite — **sem roteamento prático**.
- `book_placeholder.md` — espaço reservado para infraestrutura; **não** faz parte do livro de 19 páginas.

---

## Regenerar

```bash
node scripts/generate-geometry-g6-drafts.mjs
node scripts/build-geometry-g6-hebrew-review-pack.mjs
node scripts/verify-geometry-g6-book-content.mjs
```