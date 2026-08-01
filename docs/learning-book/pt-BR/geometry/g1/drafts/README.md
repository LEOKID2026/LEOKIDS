# Livro de aprendizagem de geometria da 1ª série - Rascunhos

**Status:** **Conteúdo aprovado pelo proprietário** — **3/3** páginas. Inserção em tempo de execução não iniciada.  
**Aprovação:** `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md`  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/geometry/g1/drafts/`

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Aprovação do proprietário | ✅ `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_SIGNOFF.md` |
| Rascunho de páginas de redução | ✅ **3/3** (Lotes A–B) — **conteúdo aprovado** |
| Pacote de revisão | ✅ `docs/learning-book/GEOMETRY_GRADE_1_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-geometry-g1-book-content.mjs` |
| Rascunho do manifesto (somente scripts) | ✅ `scripts/lib/geometry-g1-draft-manifest.mjs` |
| Rotas de tempo de execução | ✅ `/learning/book/geometry/g1` + `[pageId]` (3 páginas SSG) |
| Pratique o resolvedor de CTA | ❌ Não criado — tarefa pós-execução |

---

## Nomenclatura

- O conteúdo do livro voltado para crianças usa **גאומטריה**, não **הנדסה** (aprovado pelo proprietário).
- Os IDs internos permanecem `geometry:g1:{pageId}` e `subject: geometry`.

---

## Fonte da Verdade

| Documento/arquivo | Função |
|-----------------|------|
| `data/curriculum-spine/v1/skills.json` | Geometria de ano 1 `skill_id` entradas no escopo |
| `docs/learning-book/GEOMETRY_GRADE_1_LEARNING_BOOK_PLAN.md` | Lista de páginas, lotes, limites |
| `docs/learning-book/MATH_LEARNING_PAGE_TEMPLATE.md` | Modelo de sete seções (faixa etária de 1ª a 2ª série) |
| `docs/learning-book/math/g1/drafts/` | Apenas referência de estilo — **não modificado** |
| `utils/geometry-constants.js` | Descrições dos tópicos do G1 (somente contexto) |

---

## Lote A — צורות בסיסיות (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `shapes_basic_square.md` | הכרת הריבוע |
| `shapes_basic_rectangle.md` | הכרת המלבן |

---

## Lote B — הזזה ושיקוף (1)

| Arquivo | Título do rascunho |
|------|-------------|
| `transformations.md` | הזזה ושיקוף — היכרות |

---

## Notas

- `book_placeholder.md` — espaço reservado para infraestrutura; **não** faz parte do livro de 3 páginas.
- Todas as páginas: `age_band: grades_1_2`, `approval_status: draft`, `grade: g1`.
- Seção 7: rascunho apenas para convite — **sem roteamento prático**.
- Não há diagramas ASCII ou tabelas de descontos em órgãos voltados para crianças.
- `geometry:kind:no_question` é apenas meta da coluna vertebral - **não** página de aprendizagem.

---

## Regenerar pacote de revisão

```bash
node scripts/build-geometry-g1-hebrew-review-pack.mjs
node scripts/verify-geometry-g1-book-content.mjs
```

---

## Regra de parada explícita

O conteúdo é aprovado pelo proprietário; **inserção em tempo de execução não iniciada**:

- ❌ Sem registro, rotas, SQL, commit, push ou implantação (a menos que solicitado explicitamente)
- ✅ Rascunhos em hebraico aprovados permanecem como fonte para uma tarefa de tempo de execução futura